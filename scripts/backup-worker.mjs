import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { backupOffsite } from './backup-offsite.mjs';
import { readStatus, writeStatus } from './backup-health.mjs';

export async function runDailyBackup({ directory = process.env.BACKUP_DIR || '/data/backups', now = new Date(), backup = backupOffsite } = {}) {
  const day = now.toISOString().slice(0, 10);
  const last = await readStatus(directory, 'offsite-status.json');
  const previous = await readStatus(directory, 'worker-status.json');
  const worker = { checkedAt: now.toISOString(), lastAttemptAt: previous?.lastAttemptAt || null, lastResult: previous?.lastResult || null, failureSince: previous?.failureSince || null };
  let succeeded = false;
  try {
    if (last?.day === day && typeof last.fileId === 'string' && last.fileId && typeof last.completedAt === 'string' && last.completedAt.startsWith(day) && Number.isFinite(Date.parse(last.completedAt)) && Date.parse(last.completedAt) <= now.getTime() + 300_000) {
      worker.lastResult = 'success'; worker.failureSince = null;
    } else {
      worker.lastAttemptAt = now.toISOString();
      await writeStatus(directory, 'worker-status.json', worker);
      const result = await backup();
      await writeStatus(directory, 'offsite-status.json', { day, completedAt: now.toISOString(), ...result });
      worker.lastResult = 'success'; worker.failureSince = null; succeeded = true;
      console.log('Daily encrypted off-server backup succeeded.');
    }
    await writeStatus(directory, 'worker-status.json', worker);
  } catch {
    worker.lastResult = 'failure'; worker.failureSince ||= now.toISOString();
    try { await writeStatus(directory, 'worker-status.json', worker); } catch { /* The probe detects a stale heartbeat if storage is unwritable. */ }
    console.error('Daily off-server backup failed; retrying in one hour. Check backup configuration and service logs.');
  }
  return succeeded;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await new Promise(resolve => setTimeout(resolve, 60_000));
  for (;;) { await runDailyBackup(); await new Promise(resolve => setTimeout(resolve, 3600_000)); }
}
