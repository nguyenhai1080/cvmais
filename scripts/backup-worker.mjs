import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { backupOffsite } from './backup-offsite.mjs';

export async function runDailyBackup({ directory = process.env.BACKUP_DIR || '/data/backups', now = new Date(), backup = backupOffsite } = {}) {
  const statusPath = join(directory, 'offsite-status.json');
  const day = now.toISOString().slice(0, 10);
  let last;
  try { last = JSON.parse(await readFile(statusPath, 'utf8')); } catch { /* First run or invalid status requires a fresh backup. */ }
  if (last?.day === day && typeof last.fileId === 'string') return false;
  try {
    const result = await backup();
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const temp = `${statusPath}.tmp`;
    await writeFile(temp, JSON.stringify({ day, completedAt: new Date().toISOString(), ...result }), { mode: 0o600 });
    await rename(temp, statusPath);
    console.log('Daily encrypted off-server backup succeeded.');
    return true;
  } catch {
    // No exceptions, headers, tokens or private document contents are logged.
    console.error('Daily off-server backup failed; retrying in one hour. Check backup configuration and service logs.');
    return false;
  }
}
// Give the app time to initialise SQLite. Restart-safe status prevents duplicate daily uploads.
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await new Promise(resolve => setTimeout(resolve, 60_000));
  for (;;) { await runDailyBackup(); await new Promise(resolve => setTimeout(resolve, 3600_000)); }
}
