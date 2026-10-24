import { spawn } from 'node:child_process';
const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit', env: process.env });
let worker;
if (process.env.BACKUP_ENABLED === 'true') {
  const required = ['DATABASE_PATH', 'BACKUP_ENCRYPTION_KEY', 'B2_KEY_ID', 'B2_APPLICATION_KEY', 'B2_BUCKET_ID'];
  if (required.every(key => process.env[key])) {
    worker = spawn(process.execPath, ['scripts/backup-worker.mjs'], { stdio: 'inherit', env: process.env });
    worker.on('exit', () => console.error('Backup worker stopped; inspect and restart backup scheduling.'));
  } else console.error('Backup scheduling was requested but required configuration is incomplete.');
} else console.log('Off-server backup scheduling is not enabled.');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { server.kill(signal); worker?.kill(signal); });
server.on('error', () => { worker?.kill(); process.exitCode = 1; });
server.on('exit', code => { worker?.kill(); process.exit(code ?? 1); });
