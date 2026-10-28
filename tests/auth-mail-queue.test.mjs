import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {Store,digest} from '../src/lib/server/store.ts';
import {processAuthMail,mailQueueStatus,queuedMailEnabled} from '../scripts/auth-mail-core.mjs';
import {MailDeliveryError,deliverBody,tokenIdempotency} from '../scripts/auth-mail-transport.mjs';

async function fixture(run) {
  const directory=mkdtempSync(join(tmpdir(),'cvmais-auth-queue-'));
  const keys=['AUTH_MAIL_ENCRYPTION_KEY','BACKUP_ENCRYPTION_KEY','MAIL_ENABLED','RESEND_API_KEY','MAIL_FROM','APP_ORIGIN'];
  const old=Object.fromEntries(keys.map(key=>[key,process.env[key]]));
  Object.assign(process.env,{AUTH_MAIL_ENCRYPTION_KEY:'ab'.repeat(32),MAIL_ENABLED:'true',RESEND_API_KEY:'fictional-test-key',MAIL_FROM:'CVMais <sender@example.test>',APP_ORIGIN:'https://cvmais.example.test'});
  const realNow=Date.now;
  const context={db:new Store(join(directory,'db.sqlite')),path:join(directory,'db.sqlite'),time:realNow()};
  Date.now=()=>context.time;
  context.now=()=>context.time;
  try {await run(context);} finally {
    Date.now=realNow;context.db.db.close();rmSync(directory,{recursive:true,force:true});
    for(const key of keys){if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];}
  }
}
const account=db=>db.register('queue@example.test','fictional-long-password');
const count=db=>db.db.prepare('SELECT COUNT(*) AS n FROM auth_mail_outbox').get().n;

test('registration atomically persists an encrypted verification job without returning a recovery code or link',()=>fixture(async c=>{
  const a=await c.db.register('queue@example.test','fictional-long-password',true);
  assert.equal(Object.hasOwn(a,'recovery'),false);assert.equal(count(c.db),1);
  const row=c.db.db.prepare('SELECT * FROM auth_mail_outbox').get();
  assert.ok(!row.payload.includes(a.user.email));assert.ok(!row.payload.includes('https://'));
  assert.match(row.token,/^[a-f0-9]{64}$/);
  let message;
  const result=await processAuthMail(c.db.db,{now:c.now,deliver:async(body,key)=>{message=body;assert.ok(key.startsWith('cvmais-verify-'));return 'accepted';}});
  assert.equal(result,'accepted');assert.equal(count(c.db),0);
  assert.deepEqual(message.to,[a.user.email]);assert.match(message.text,/#token=[a-f0-9]{64}/);
  const token=message.text.match(/#token=([a-f0-9]{64})/)[1];
  assert.equal(row.token,digest(token));assert.equal(c.db.emailToken(token,'verify').id,a.user.id);
  assert.ok(mailQueueStatus(c.db.db,c.time).lastAcceptedAt);
  process.env.AUTH_MAIL_ENCRYPTION_KEY='invalid';
  await assert.rejects(c.db.register('failed@example.test','fictional-long-password',true));
  assert.equal(c.db.db.prepare('SELECT 1 FROM users WHERE email=?').get('failed@example.test'),undefined);
}));

test('transient failure retries after restart with an identical payload and idempotency key',()=>fixture(async c=>{
  const a=await account(c.db);const token=c.db.issueEmailToken(a.user.id,'verify',true);
  let first;
  const failure=await processAuthMail(c.db.db,{now:c.now,deliver:async(body,key)=>{first={body,key};throw new TypeError('Simulated connection loss');}});
  assert.equal(failure,'retry');assert.equal(mailQueueStatus(c.db.db,c.time).retrying,1);
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>assert.fail('backoff ignored')}),'idle');
  c.db.db.close();c.db=new Store(c.path);c.time+=31_000;
  const delivered=await processAuthMail(c.db.db,{now:c.now,deliver:async(body,key)=>{assert.deepEqual({body,key},first);return 'accepted';}});
  assert.equal(delivered,'accepted');assert.equal(count(c.db),0);
  assert.equal(c.db.emailToken(token,'verify').id,a.user.id);
}));

test('superseding, consuming, resetting and erasing cancel pending messages through foreign keys',()=>fixture(async c=>{
  const a=await account(c.db);
  const old=c.db.issueEmailToken(a.user.id,'verify',true);
  const latest=c.db.issueEmailToken(a.user.id,'verify',true);
  assert.equal(count(c.db),1);assert.throws(()=>c.db.emailToken(old,'verify'));
  c.db.verifyEmail(latest);assert.equal(count(c.db),0);
  const reset=c.db.requestEmailReset(a.user.email,true);
  c.db.issueEmailToken(a.user.id,'verify',true);assert.equal(count(c.db),2);
  await c.db.resetByEmail(reset.token,'another-fictional-password');assert.equal(count(c.db),0);
  const code=await c.db.configureRecovery(c.db.session(a.user.id),'another-fictional-password',true);
  c.db.requestEmailReset(a.user.email,true);
  await c.db.recover(a.user.email,code,'third-fictional-password');assert.equal(count(c.db),0);
  c.db.issueEmailToken(a.user.id,'verify',true);c.db.eraseAccount(a.user.id);assert.equal(count(c.db),0);
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>assert.fail('cancelled email sent')}),'idle');
}));

test('unverified/unknown reset targets do not queue emails; expired links are purged without delivery',()=>fixture(async c=>{
  const a=await account(c.db);
  assert.equal(c.db.requestEmailReset(a.user.email,true),null);
  assert.equal(c.db.requestEmailReset('missing@example.test',true),null);
  assert.equal(count(c.db),0);
  c.db.issueEmailToken(a.user.id,'verify',true);
  c.db.db.prepare('UPDATE email_tokens SET expires=?').run(c.time-1);
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>assert.fail('expired link sent')}),'idle');
  assert.equal(count(c.db),0);
  c.db.issueEmailToken(a.user.id,'verify',true);
  c.db.db.prepare('UPDATE email_tokens SET expires=?').run(c.time+29_000);
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>assert.fail('near-expiry link sent')}),'idle');
}));

test('leases prevent concurrent sends and recover interrupted work with the same deduplication key',()=>fixture(async c=>{
  const a=await account(c.db);const token=c.db.issueEmailToken(a.user.id,'verify',true);
  const other=new Store(c.path);let release;
  const gate=new Promise(resolve=>{release=resolve;});let calls=0;
  try {
    const first=processAuthMail(c.db.db,{now:c.now,deliver:async()=>{calls++;await gate;return 'accepted';}});
    c.time+=1000;
    assert.equal(await processAuthMail(other.db,{now:c.now,deliver:async()=>assert.fail('duplicate lease send')}),'idle');
    release();assert.equal(await first,'accepted');assert.equal(calls,1);
    const retryToken=c.db.issueEmailToken(a.user.id,'verify',true);
    c.db.db.prepare('UPDATE auth_mail_outbox SET attempts=1,lease_id=?,lease_until=?').run('crashed-worker',c.time+60_000);
    assert.equal(await processAuthMail(other.db,{now:c.now,deliver:async()=>assert.fail('lease not expired')}),'idle');
    c.time+=61_000;
    assert.equal(await processAuthMail(other.db,{now:c.now,deliver:async(body,key)=>{
      assert.equal(key,tokenIdempotency('verify',retryToken));assert.ok(!body.text.includes(token));return 'accepted';
    }}),'accepted');
  } finally {other.db.close();}
}));

test('retries are bounded, permanent rejection stops immediately and failed payloads are cleared',()=>fixture(async c=>{
  const a=await account(c.db);c.db.issueEmailToken(a.user.id,'verify',true);
  let attempts=0;
  for(let n=0;n<8;n++){
    c.time+=1000;c.db.db.prepare('UPDATE auth_mail_outbox SET next_attempt=0').run();
    await processAuthMail(c.db.db,{now:c.now,deliver:async()=>{attempts++;throw new MailDeliveryError(true);}});
  }
  assert.equal(attempts,8);const row=c.db.db.prepare('SELECT attempts,payload FROM auth_mail_outbox').get();
  assert.equal(row.attempts,8);assert.equal(row.payload,'');
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>assert.fail('exhausted job sent')}),'idle');
  c.db.issueEmailToken(a.user.id,'verify',true);c.time+=1000;
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>{throw new MailDeliveryError(false);}}),'failed');
  assert.equal(mailQueueStatus(c.db.db,c.time).failed,1);
}));

test('ciphertext tampering/key changes fail closed; summaries contain no recipient, token or ciphertext',()=>fixture(async c=>{
  const a=await account(c.db);const token=c.db.issueEmailToken(a.user.id,'verify',true);
  const payload=c.db.db.prepare('SELECT payload FROM auth_mail_outbox').get().payload;
  process.env.AUTH_MAIL_ENCRYPTION_KEY='cd'.repeat(32);
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>assert.fail('undecryptable email sent')}),'failed');
  const status=mailQueueStatus(c.db.db,c.time);const summary=JSON.stringify(status);
  assert.ok(!summary.includes(a.user.email));assert.ok(!summary.includes(token));assert.ok(!summary.includes(payload));
  process.env.AUTH_MAIL_ENCRYPTION_KEY='ab'.repeat(32);
  c.db.issueEmailToken(a.user.id,'verify',true);
  const damaged=Buffer.from(c.db.db.prepare('SELECT payload FROM auth_mail_outbox').get().payload,'base64');
  damaged[40]^=1;c.db.db.prepare('UPDATE auth_mail_outbox SET payload=?').run(damaged.toString('base64'));c.time+=1000;
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async()=>assert.fail('tampered payload sent')}),'failed');
  delete process.env.AUTH_MAIL_ENCRYPTION_KEY;process.env.BACKUP_ENCRYPTION_KEY='ab'.repeat(32);
  assert.equal(queuedMailEnabled(),true);
  delete process.env.BACKUP_ENCRYPTION_KEY;assert.equal(queuedMailEnabled(),false);
}));

test('a replacement requested during an in-flight send is not erased by the older receipt',()=>fixture(async c=>{
  const a=await account(c.db);const old=c.db.issueEmailToken(a.user.id,'verify',true);
  let release;const gate=new Promise(resolve=>{release=resolve;});
  const running=processAuthMail(c.db.db,{now:c.now,deliver:async()=>{await gate;return 'accepted';}});
  const latest=c.db.issueEmailToken(a.user.id,'verify',true);
  assert.throws(()=>c.db.emailToken(old,'verify'));
  release();assert.equal(await running,'accepted');assert.equal(count(c.db),1);
  c.time+=1000;
  assert.equal(await processAuthMail(c.db.db,{now:c.now,deliver:async(body,key)=>{
    assert.equal(key,tokenIdempotency('verify',latest));return 'accepted';
  }}),'accepted');
}));

test('provider retry classification, Retry-After and stable request body use a mock transport only',()=>fixture(async c=>{
  const body={from:process.env.MAIL_FROM,to:['mock@example.test'],subject:'Fixture',text:'Fixture'};
  for(const status of [408,409,429,500,503])await assert.rejects(deliverBody(body,'test-key',async()=>new Response('',{status,headers:{'Retry-After':'120'}})),error=>error.retryable===true&&error.retryAfterMs===120_000);
  for(const status of [400,401,403,422])await assert.rejects(deliverBody(body,'test-key',async()=>new Response('',{status})),error=>error.retryable===false);
  await assert.rejects(deliverBody(body,'test-key',async()=>Response.json({})),error=>error.retryable===true);
  assert.equal(await deliverBody(body,'test-key',async(url,init)=>{
    assert.equal(url,'https://api.resend.com/emails');assert.equal(init.headers['Idempotency-Key'],'test-key');
    assert.deepEqual(JSON.parse(init.body),body);return Response.json({id:'mock-accepted'});
  }),'mock-accepted');
}));

test('worker heartbeat expires and disabled sending still purges expired jobs',()=>fixture(async c=>{
  const a=await account(c.db);c.db.issueEmailToken(a.user.id,'verify',true);
  process.env.MAIL_ENABLED='false';
  c.db.db.prepare('UPDATE email_tokens SET expires=?').run(c.time-1);
  assert.equal(await processAuthMail(c.db.db,{now:c.now,worker:true,deliver:async()=>assert.fail('disabled sending')}),'disabled');
  assert.equal(count(c.db),0);assert.equal(mailQueueStatus(c.db.db,c.time).workerReady,true);
  c.time+=121_000;assert.equal(mailQueueStatus(c.db.db,c.time).workerReady,false);
}));

test('the last in-flight attempt is pending rather than prematurely reported as failed',()=>fixture(async c=>{
  const a=await account(c.db);c.db.issueEmailToken(a.user.id,'verify',true);
  c.db.db.prepare('UPDATE auth_mail_outbox SET attempts=7').run();
  let release;const gate=new Promise(resolve=>{release=resolve;});
  const running=processAuthMail(c.db.db,{now:c.now,deliver:async()=>{await gate;return 'accepted';}});
  const status=mailQueueStatus(c.db.db,c.time);assert.equal(status.pending,1);assert.equal(status.failed,0);
  release();assert.equal(await running,'accepted');assert.equal(mailQueueStatus(c.db.db,c.time).pending,0);
}));
