import { spawn } from 'node:child_process';
const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit', env: process.env });
let worker;
let monitor;
if (process.env.BACKUP_ENABLED === 'true') {
  const required = ['DATABASE_PATH', 'BACKUP_ENCRYPTION_KEY', 'B2_KEY_ID', 'B2_APPLICATION_KEY', 'B2_BUCKET_ID'];
  if (required.every(key => process.env[key])) {
    worker = spawn(process.execPath, ['scripts/backup-worker.mjs'], { stdio: 'inherit', env: process.env });
    worker.on('exit', () => console.error('Backup worker stopped; inspect and restart backup scheduling.'));
    if (process.env.BACKUP_ALERTS_ENABLED === 'true') {
      monitor = spawn(process.execPath, ['scripts/backup-monitor.mjs'], { stdio: 'inherit', env: process.env });
      monitor.on('spawn', () => console.log('Backup alert monitor enabled; independent checks every five minutes after startup grace.'));
      monitor.on('error', () => console.error('Backup alert monitor could not start.'));
      monitor.on('exit', () => console.error('Backup alert monitor stopped; external monitoring is still required for host outages.'));
    }
  } else console.error('Backup scheduling was requested but required configuration is incomplete.');
} else console.log('Off-server backup scheduling is not enabled.');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { server.kill(signal); worker?.kill(signal); monitor?.kill(signal); });
server.on('error', () => { worker?.kill(); monitor?.kill(); process.exitCode = 1; });
server.on('exit', code => { worker?.kill(); monitor?.kill(); process.exit(code ?? 1); });
