import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { backupHealth } from './backup-health.mjs';
import { notifyBackupHealth } from './backup-alerts.mjs';
export async function checkBackupAlerts({ directory = process.env.BACKUP_DIR || '/data/backups', now = new Date(), health = backupHealth, notify = notifyBackupHealth } = {}) {
  try { await notify(await health({ directory, now }), { directory, now }); }
  catch { console.error('Backup notification failed; retrying at the next monitor check. No private data logged.'); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await new Promise(resolve => setTimeout(resolve, 90_000));
  for (;;) { await checkBackupAlerts(); await new Promise(resolve => setTimeout(resolve, 300_000)); }
}
