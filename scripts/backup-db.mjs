import { DatabaseSync, backup } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
const database = process.env.DATABASE_PATH;
if (!database) throw new Error('Set DATABASE_PATH to the persistent database file.');
const directory = process.env.BACKUP_DIR || '/data/backups';
mkdirSync(directory, { recursive: true, mode: 0o700 });
const db = new DatabaseSync(database, { readOnly: true });
try {
  const path = join(directory, `cvmais-${new Date().toISOString().replaceAll(':', '-')}.sqlite`);
  await backup(db, path);
  console.log('Database backup completed. Store an encrypted off-server copy as well.');
} finally { db.close(); }
