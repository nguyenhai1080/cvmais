import { DatabaseSync, backup } from 'node:sqlite';
import { createCipheriv, createDecipheriv, randomBytes, randomUUID, createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, rm, stat, open } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { resolve } from 'node:path';

const MAGIC = Buffer.from('CVMAIS-BACKUP-1\n');
export function encryptionKey(value) {
  if (typeof value !== 'string' || !/^[a-f0-9]{64}$/i.test(value)) throw new Error('A 32-byte hexadecimal BACKUP_ENCRYPTION_KEY is required.');
  return Buffer.from(value, 'hex');
}
export async function encryptedSnapshot(database, directory, keyValue) {
  const key = encryptionKey(keyValue);
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const id = randomUUID();
  const snapshot = resolve(directory, `.snapshot-${id}.sqlite`);
  if (snapshot === resolve(database)) throw new Error('Backup path must differ from the active database.');
  const encrypted = resolve(directory, `cvmais-${Date.now()}-${id}.cvb`);
  const db = new DatabaseSync(database, { readOnly: true });
  try {
    await backup(db, snapshot);
    const check = new DatabaseSync(snapshot, { readOnly: true });
    try { if (check.prepare('PRAGMA quick_check').get().quick_check !== 'ok') throw new Error('Snapshot integrity check failed.'); }
    finally { check.close(); }
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    cipher.setAAD(MAGIC);
    const header = await open(encrypted, 'wx', 0o600);
    try { await header.writeFile(Buffer.concat([MAGIC, iv])); } finally { await header.close(); }
    await pipeline(createReadStream(snapshot), cipher, createWriteStream(encrypted, { flags: 'a', mode: 0o600 }));
    const output = await open(encrypted, 'a');
    try { await output.writeFile(cipher.getAuthTag()); } finally { await output.close(); }
    return encrypted;
  } catch (error) { await rm(encrypted, { force: true }); throw error; }
  finally {
    db.close();
    // These are only the unique temporary snapshot files created above.
    for (const suffix of ['', '-wal', '-shm']) await rm(snapshot + suffix, { force: true });
  }
}
export async function decryptSnapshot(source, target, keyValue) {
  const key = encryptionKey(keyValue);
  if (resolve(source) === resolve(target)) throw new Error('Restore target must differ from the encrypted source.');
  const size = (await stat(source)).size;
  const start = MAGIC.length + 12;
  if (size <= start + 16) throw new Error('Invalid encrypted backup.');
  const file = await open(source, 'r');
  const header = Buffer.alloc(start), tag = Buffer.alloc(16);
  try { await file.read(header, 0, start, 0); await file.read(tag, 0, 16, size - 16); } finally { await file.close(); }
  if (!header.subarray(0, MAGIC.length).equals(MAGIC)) throw new Error('Unsupported backup format.');
  const decipher = createDecipheriv('aes-256-gcm', key, header.subarray(MAGIC.length));
  decipher.setAAD(MAGIC); decipher.setAuthTag(tag);
  // Reserve the target first; never overwrite an existing database or file.
  const output = await open(target, 'wx', 0o600);
  await output.close();
  try {
    await pipeline(createReadStream(source, { start, end: size - 17 }), decipher, createWriteStream(target, { flags: 'r+' }));
    const restored = new DatabaseSync(target, { readOnly: true });
    try { if (restored.prepare('PRAGMA quick_check').get().quick_check !== 'ok') throw new Error('Restored database integrity check failed.'); }
    finally { restored.close(); }
  } catch (error) { await rm(target, { force: true }); throw error; }
}
function b2URL(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !/(^|\.)backblaze(?:b2)?\.com$/.test(url.hostname)) throw new Error('Invalid Backblaze service endpoint.');
  return url;
}
async function responseJSON(response, operation) {
  if (!response.ok) throw new Error(`${operation} failed (HTTP ${response.status}).`);
  return response.json();
}
export async function uploadB2(path, { keyId, applicationKey, bucketId }) {
  if (!keyId || !applicationKey || !/^[a-f0-9]{24}$/.test(bucketId || '')) throw new Error('Restricted B2 credentials and a bucket ID are required.');
  const auth = await responseJSON(await fetch('https://api.backblazeb2.com/b2api/v4/b2_authorize_account', {
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${applicationKey}`).toString('base64')}` }, signal: AbortSignal.timeout(30_000), redirect: 'error',
  }), 'B2 authentication');
  const allowed = auth.apiInfo?.storageApi?.allowed;
  if (allowed?.buckets?.length !== 1 || allowed.buckets[0].id !== bucketId || !allowed.capabilities?.includes('writeFiles')) throw new Error('Use a B2 application key restricted to the configured backup bucket.');
  const api = b2URL(auth.apiInfo?.storageApi?.apiUrl);
  const url = new URL('/b2api/v4/b2_get_upload_url', api);
  url.searchParams.set('bucketId', bucketId);
  const upload = await responseJSON(await fetch(url, { headers: { Authorization: auth.authorizationToken }, signal: AbortSignal.timeout(30_000), redirect: 'error' }), 'B2 upload preparation');
  const uploadURL = b2URL(upload.uploadUrl);
  const hash = createHash('sha1');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  const sha1 = hash.digest('hex');
  const name = `cvmais/${new Date().toISOString().slice(0, 10)}/${randomUUID()}.cvb`;
  const size = (await stat(path)).size;
  const result = await responseJSON(await fetch(uploadURL, {
    method: 'POST', headers: { Authorization: upload.authorizationToken, 'X-Bz-File-Name': encodeURIComponent(name), 'Content-Type': 'application/octet-stream', 'Content-Length': String(size), 'X-Bz-Content-Sha1': sha1 },
    body: createReadStream(path), duplex: 'half', signal: AbortSignal.timeout(300_000), redirect: 'error',
  }), 'B2 encrypted upload');
  if (result.bucketId !== bucketId || result.contentSha1 !== sha1 || Number(result.contentLength) !== size || result.fileName !== name || typeof result.fileId !== 'string') throw new Error('B2 upload receipt mismatch.');
  return { fileId: result.fileId, fileName: result.fileName, bytes: size };
}
