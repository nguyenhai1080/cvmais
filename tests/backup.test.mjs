import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readFile, writeFile, access, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomBytes, createHash } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { encryptedSnapshot, decryptSnapshot, uploadB2 } from '../scripts/backup-core.mjs';
import { runDailyBackup } from '../scripts/backup-worker.mjs';

test('encrypted snapshots restore verified SQLite data, detect corruption and never overwrite existing files', async () => {
  const root = await mkdtemp(join(tmpdir(), 'cvmais-backup-'));
  const source = join(root, 'source.sqlite');
  const db = new DatabaseSync(source);
  try {
    db.exec('PRAGMA journal_mode=WAL; CREATE TABLE example(value TEXT);');
    db.prepare('INSERT INTO example VALUES (?)').run('Conteúdo fictício de validação');
    const key = randomBytes(32).toString('hex');
    const encrypted = await encryptedSnapshot(source, root, key);
    assert.equal((await readdir(root)).some(name => name.startsWith('.snapshot-')), false);
    const restoredPath = join(root, 'restored.sqlite');
    await decryptSnapshot(encrypted, restoredPath, key);
    const restored = new DatabaseSync(restoredPath, { readOnly: true });
    try { assert.equal(restored.prepare('SELECT value FROM example').get().value, 'Conteúdo fictício de validação'); }
    finally { restored.close(); }
    await assert.rejects(decryptSnapshot(encrypted, restoredPath, key), { code: 'EEXIST' });
    const wrongTarget = join(root, 'wrong.sqlite');
    await assert.rejects(decryptSnapshot(encrypted, wrongTarget, randomBytes(32).toString('hex')));
    await assert.rejects(access(wrongTarget));
    const bytes = await readFile(encrypted); bytes[bytes.length - 20] ^= 1;
    const corrupted = join(root, 'corrupted.cvb'); await writeFile(corrupted, bytes);
    await assert.rejects(decryptSnapshot(corrupted, wrongTarget, key));
    await assert.rejects(access(wrongTarget));
    assert.equal(db.prepare('SELECT count(*) AS n FROM example').get().n, 1);
  } finally { db.close(); await rm(root, { recursive: true, force: true }); }
});

test('B2 upload validates its receipt and rejects unrestricted credentials or untrusted endpoints', async () => {
  const root = await mkdtemp(join(tmpdir(), 'cvmais-upload-'));
  const file = join(root, 'synthetic.cvb');
  const bytes = randomBytes(128); await writeFile(file, bytes);
  const original = globalThis.fetch;
  const bucketId = 'a'.repeat(24), config = { keyId: 'fictional-id', applicationKey: 'fictional-key', bucketId };
  let count = 0, endpoint = 'https://api001.backblazeb2.com', restricted = true;
  globalThis.fetch = async (input, options) => {
    count++;
    const url = new URL(input);
    assert.equal(options.redirect, 'error');
    if (count === 1) {
      assert.equal(url.hostname, 'api.backblazeb2.com');
      return Response.json({ authorizationToken: 'fictional-auth', apiInfo: { storageApi: { apiUrl: endpoint, allowed: { buckets: restricted ? [{ id: bucketId }] : null, capabilities: ['writeFiles'] } } } });
    }
    if (count === 2) return Response.json({ uploadUrl: 'https://pod-001.backblaze.com/b2api/v4/b2_upload_file/test', authorizationToken: 'fictional-upload' });
    const received = [];
    for await (const chunk of options.body) received.push(chunk);
    assert.deepEqual(Buffer.concat(received), bytes);
    return Response.json({ bucketId, contentSha1: createHash('sha1').update(bytes).digest('hex'), contentLength: String(bytes.length), fileId: 'fictional-file', fileName: decodeURIComponent(options.headers['X-Bz-File-Name']) });
  };
  try {
    assert.equal((await uploadB2(file, config)).bytes, bytes.length);
    assert.equal(count, 3);
    count = 0; endpoint = 'https://untrusted.example';
    await assert.rejects(uploadB2(file, config), /endpoint/); assert.equal(count, 1);
    count = 0; restricted = false;
    await assert.rejects(uploadB2(file, config), /restricted/); assert.equal(count, 1);
  } finally { globalThis.fetch = original; await rm(root, { recursive: true, force: true }); }
});

test('daily scheduling persists successful completion across restarts and retries failures', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'cvmais-schedule-'));
  let calls = 0;
  const backup = async () => { calls++; return { fileId: `test-${calls}`, fileName: 'fictional.cvb', bytes: 20 }; };
  try {
    assert.equal(await runDailyBackup({ directory, backup, now: new Date('2026-10-24T12:00:00Z') }), true);
    assert.equal(await runDailyBackup({ directory, backup, now: new Date('2026-10-24T18:00:00Z') }), false);
    assert.equal(calls, 1);
    assert.equal(await runDailyBackup({ directory, backup: async () => { throw new Error('Synthetic failure'); }, now: new Date('2026-10-25T01:00:00Z') }), false);
    assert.equal(await runDailyBackup({ directory, backup, now: new Date('2026-10-25T02:00:00Z') }), true);
    assert.equal(calls, 2);
  } finally { await rm(directory, { recursive: true, force: true }); }
});
