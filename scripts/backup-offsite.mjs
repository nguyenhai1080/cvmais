import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { encryptedSnapshot, uploadB2 } from './backup-core.mjs';

export async function backupOffsite() {
  const database = process.env.DATABASE_PATH;
  if (!database) throw new Error('DATABASE_PATH is required.');
  const directory = process.env.BACKUP_DIR || '/data/backups';
  const snapshot = await encryptedSnapshot(database, directory, process.env.BACKUP_ENCRYPTION_KEY);
  try {
    return await uploadB2(snapshot, { keyId: process.env.B2_KEY_ID, applicationKey: process.env.B2_APPLICATION_KEY, bucketId: process.env.B2_BUCKET_ID });
  } finally { await rm(snapshot, { force: true }); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { const result = await backupOffsite(); console.log(`Encrypted off-server backup verified (${result.bytes} bytes).`); }
  catch { console.error('Off-server backup failed. Check credentials, network and backup configuration; no secrets logged.'); process.exitCode = 1; }
}
