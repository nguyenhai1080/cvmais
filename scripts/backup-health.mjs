import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
export const MAX_BACKUP_AGE_MS = 36 * 3600_000;
export const MAX_WORKER_AGE_MS = 150 * 60_000;
export async function readStatus(directory, name) {
  try { return JSON.parse(await readFile(join(directory, name), 'utf8')); } catch { return null; }
}
export async function writeStatus(directory, name, value) {
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const path = join(directory, name), temp = `${path}.tmp`;
  await writeFile(temp, JSON.stringify(value), { mode: 0o600 });
  await rename(temp, path);
}
export function backupConfigured(env = process.env) {
  return ['DATABASE_PATH','BACKUP_ENCRYPTION_KEY','B2_KEY_ID','B2_APPLICATION_KEY','B2_BUCKET_ID'].every(key => Boolean(env[key]));
}
function timestamp(value, now) {
  const time = typeof value === 'string' ? Date.parse(value) : NaN;
  return Number.isFinite(time) && time <= now + 5 * 60_000 ? time : null;
}
// Whitelist safe status fields. Never expose upload IDs, object names, paths, keys or exceptions.
export async function backupHealth({ directory = process.env.BACKUP_DIR || '/data/backups', now = new Date(), enabled = process.env.BACKUP_ENABLED === 'true', configured = backupConfigured() } = {}) {
  const [last, worker] = await Promise.all([readStatus(directory, 'offsite-status.json'), readStatus(directory, 'worker-status.json')]);
  const clock = now.getTime();
  const complete = timestamp(last?.completedAt, clock);
  const success = typeof last?.fileId === 'string' && last.fileId && complete !== null ? complete : null;
  const checked = timestamp(worker?.checkedAt, clock);
  const attempt = timestamp(worker?.lastAttemptAt, clock);
  const result = ['success','failure'].includes(worker?.lastResult) ? worker.lastResult : null;
  let state = 'healthy';
  if (!enabled) state = 'disabled';
  else if (!configured) state = 'misconfigured';
  else if (checked === null || clock - checked > MAX_WORKER_AGE_MS) state = 'worker_stale';
  else if (result === 'failure') state = 'failed';
  else if (success === null) state = 'missing';
  else if (clock - success > MAX_BACKUP_AGE_MS) state = 'stale';
  return { state, healthy: state === 'healthy', checkedAt: checked === null ? null : new Date(checked).toISOString(), lastSuccessAt: success === null ? null : new Date(success).toISOString(), lastAttemptAt: attempt === null ? null : new Date(attempt).toISOString(), lastResult: result, failureSince: timestamp(worker?.failureSince, clock) === null ? null : worker.failureSince, maximumAgeHours: 36, workerMaximumAgeMinutes: 150, alertsEnabled: process.env.BACKUP_ALERTS_ENABLED === 'true' && Boolean(process.env.OPERATIONS_EMAIL && process.env.RESEND_API_KEY && process.env.MAIL_FROM) };
}
