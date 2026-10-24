import { DatabaseSync, backup } from 'node:sqlite';
import { mkdirSync, chmodSync } from 'node:fs';
import { join } from 'node:path';
const database = process.env.DATABASE_PATH;
if (!database) throw new Error('Set DATABASE_PATH to the persistent database file.');
const directory = process.env.BACKUP_DIR || '/data/backups';
mkdirSync(directory, { recursive: true, mode: 0o700 });
const db = new DatabaseSync(database, { readOnly: true });
try {
  const path = join(directory, `cvmais-${new Date().toISOString().replaceAll(':', '-')}.sqlite`);
  await backup(db, path);
  if (process.platform !== 'win32') chmodSync(path, 0o600);
  const snapshot = new DatabaseSync(path, { readOnly: true });
  try {
    const check = snapshot.prepare('PRAGMA quick_check').get();
    if (check.quick_check !== 'ok') throw new Error('Backup integrity check failed.');
  } finally { snapshot.close(); }
  console.log('Database backup completed and integrity verified. An encrypted off-server copy is still required.');
} finally { db.close(); }
