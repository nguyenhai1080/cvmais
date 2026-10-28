import { createHash, createCipheriv, createDecipheriv, hkdfSync, randomBytes, randomUUID } from 'node:crypto';
import { mailEnabled, tokenMessage, tokenIdempotency, deliverBody, MailDeliveryError } from './auth-mail-transport.mjs';

const MAX_ATTEMPTS=8;
const GRACE=30_000;
function encryptionKey() {
  const value=process.env.AUTH_MAIL_ENCRYPTION_KEY || process.env.BACKUP_ENCRYPTION_KEY;
  if (!/^[a-f0-9]{64}$/i.test(value || '')) throw new Error('Authentication mail encryption is not configured');
  return Buffer.from(hkdfSync('sha256',Buffer.from(value,'hex'),Buffer.from('cvmais'),Buffer.from('auth-mail-outbox-v1'),32));
}
export function queuedMailEnabled() { try { encryptionKey(); return mailEnabled(); } catch { return false; } }
export function initialiseMailQueue(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS auth_mail_outbox (
    token TEXT PRIMARY KEY REFERENCES email_tokens(token) ON DELETE CASCADE,
    payload TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0,
    next_attempt INTEGER NOT NULL, lease_id TEXT, lease_until INTEGER NOT NULL DEFAULT 0,
    created INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS auth_mail_due ON auth_mail_outbox(next_attempt,lease_until);
    CREATE TABLE IF NOT EXISTS auth_mail_state (
      id INTEGER PRIMARY KEY CHECK(id=1), heartbeat INTEGER NOT NULL DEFAULT 0,
      next_send INTEGER NOT NULL DEFAULT 0, last_accepted INTEGER, last_failure INTEGER);
    INSERT OR IGNORE INTO auth_mail_state(id) VALUES (1);`);
}
export function encryptedMail(email,purpose,token) {
  const hash=createHash('sha256').update(token).digest('hex');
  const iv=randomBytes(12);
  const cipher=createCipheriv('aes-256-gcm',encryptionKey(),iv);
  cipher.setAAD(Buffer.from(hash));
  // Snapshot the exact payload so retries keep the same body across restarts/deploys.
  const body={from:process.env.MAIL_FROM,to:[email],...tokenMessage(purpose,token,process.env.APP_ORIGIN)};
  const payload=Buffer.concat([cipher.update(JSON.stringify({token,body}),'utf8'),cipher.final()]);
  return Buffer.concat([iv,cipher.getAuthTag(),payload]).toString('base64');
}
function decryptMail(payload,hash) {
  const bytes=Buffer.from(payload,'base64');
  const decipher=createDecipheriv('aes-256-gcm',encryptionKey(),bytes.subarray(0,12));
  decipher.setAAD(Buffer.from(hash));decipher.setAuthTag(bytes.subarray(12,28));
  const value=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8'));
  if (!/^[a-f0-9]{64}$/.test(value.token) || createHash('sha256').update(value.token).digest('hex')!==hash) throw new Error('Invalid queued email');
  return value;
}
export function mailWorkerReady(db,now=Date.now()) {
  const state=db.prepare('SELECT heartbeat FROM auth_mail_state WHERE id=1').get();
  return Boolean(state?.heartbeat && now-state.heartbeat<120_000);
}
export function mailQueueStatus(db,now=Date.now()) {
  const state=db.prepare('SELECT heartbeat,last_accepted,last_failure FROM auth_mail_state WHERE id=1').get();
  const counts=db.prepare(`SELECT COUNT(*) AS pending,COALESCE(SUM(q.attempts>=? AND q.lease_until<=?),0) AS failed,
    COALESCE(SUM(q.attempts>0 AND q.attempts<? AND q.lease_until<=?),0) AS retrying
    FROM auth_mail_outbox q JOIN email_tokens t ON t.token=q.token WHERE t.expires>?`).get(MAX_ATTEMPTS,now,MAX_ATTEMPTS,now,now);
  return {enabled:queuedMailEnabled(),workerReady:Boolean(state?.heartbeat && now-state.heartbeat<120_000),
    pending:Number(counts.pending)-Number(counts.failed),retrying:Number(counts.retrying),failed:Number(counts.failed),
    lastAcceptedAt:state?.last_accepted ? new Date(state.last_accepted).toISOString() : null,
    lastFailureAt:state?.last_failure ? new Date(state.last_failure).toISOString() : null};
}
export async function processAuthMail(db,{now=()=>Date.now(),deliver=deliverBody,worker=false}={}) {
  const time=now();
  // FK cascades remove ciphertext for expired, superseded, consumed or erased tokens.
  db.prepare('DELETE FROM email_tokens WHERE expires<=?').run(time);
  db.prepare("UPDATE auth_mail_outbox SET payload='' WHERE attempts>=? AND lease_until<=? AND payload<>''").run(MAX_ATTEMPTS,time);
  if(worker)db.prepare('UPDATE auth_mail_state SET heartbeat=? WHERE id=1 AND heartbeat<?').run(time,time-30_000);
  if(!queuedMailEnabled())return 'disabled';
  let job;
  const lease=randomUUID();
  db.exec('BEGIN IMMEDIATE');
  try {
    const state=db.prepare('SELECT next_send FROM auth_mail_state WHERE id=1').get();
    if(state.next_send<=time)job=db.prepare(`SELECT q.token,q.payload,q.attempts,t.purpose,t.expires,u.email
      FROM auth_mail_outbox q JOIN email_tokens t ON t.token=q.token JOIN users u ON u.id=t.user_id
      WHERE q.next_attempt<=? AND q.lease_until<=? AND q.attempts<? AND t.expires>?
      ORDER BY q.created,q.token LIMIT 1`).get(time,time,MAX_ATTEMPTS,time+GRACE);
    if(job){db.prepare('UPDATE auth_mail_outbox SET lease_id=?,lease_until=?,attempts=attempts+1 WHERE token=?').run(lease,time+60_000,job.token);
      db.prepare('UPDATE auth_mail_state SET next_send=? WHERE id=1').run(time+600);}
    db.exec('COMMIT');
  } catch(error){db.exec('ROLLBACK');throw error;}
  if(!job)return 'idle';
  let envelope;
  try {
    envelope=decryptMail(job.payload,job.token);
    if(envelope.body.to?.length!==1 || envelope.body.to[0]!==job.email)throw new Error('Invalid queued recipient');
  } catch {
    // A corrupt payload or changed encryption key must never cause a plaintext fallback.
    db.prepare('UPDATE auth_mail_outbox SET attempts=?,payload=?,lease_id=NULL,lease_until=0 WHERE token=? AND lease_id=?').run(MAX_ATTEMPTS,'',job.token,lease);
    db.prepare('UPDATE auth_mail_state SET last_failure=? WHERE id=1').run(now());
    return 'failed';
  }
  if(!db.prepare(`SELECT 1 FROM auth_mail_outbox q JOIN email_tokens t ON t.token=q.token
    WHERE q.token=? AND q.lease_id=? AND t.expires>?`).get(job.token,lease,now()+GRACE))return 'cancelled';
  try {
    await deliver(envelope.body,tokenIdempotency(job.purpose,envelope.token));
    db.prepare('DELETE FROM auth_mail_outbox WHERE token=? AND lease_id=?').run(job.token,lease);
    db.prepare('UPDATE auth_mail_state SET last_accepted=? WHERE id=1').run(now());
    return 'accepted';
  } catch(error) {
    const attempts=job.attempts+1;
    const terminal=attempts>=MAX_ATTEMPTS || (error instanceof MailDeliveryError && !error.retryable);
    const retryAfter=error instanceof MailDeliveryError ? error.retryAfterMs : 0;
    const next=now()+Math.max(Math.min(30_000*2**(attempts-1),300_000),retryAfter);
    db.prepare('UPDATE auth_mail_outbox SET attempts=?,payload=?,next_attempt=?,lease_id=NULL,lease_until=0 WHERE token=? AND lease_id=?')
      .run(terminal?MAX_ATTEMPTS:attempts,terminal?'':job.payload,next,job.token,lease);
    db.prepare('UPDATE auth_mail_state SET last_failure=? WHERE id=1').run(now());
    return terminal?'failed':'retry';
  }
}
