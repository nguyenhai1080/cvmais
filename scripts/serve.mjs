import { spawn } from 'node:child_process';
const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit', env: process.env });
let worker;
let monitor;
let mailWorker;
let mailRestart;
let stopping=false;
function startMailWorker(){
  if(stopping)return;
  mailWorker=spawn(process.execPath,['scripts/auth-mail-worker.mjs'],{stdio:'inherit',env:process.env});
  mailWorker.on('error',()=>console.error('Authentication email queue worker could not start.'));
  mailWorker.on('close',()=>{
    if(stopping)return;
    console.error('Authentication email queue worker stopped; restarting in five seconds.');
    mailRestart=setTimeout(startMailWorker,5000);
  });
}
function stopWorkers(signal){stopping=true;clearTimeout(mailRestart);worker?.kill(signal);monitor?.kill(signal);mailWorker?.kill(signal);}
startMailWorker();

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
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { stopWorkers(signal);server.kill(signal); });
server.on('error', () => { stopWorkers();process.exitCode=1; });
server.on('exit', code => { stopWorkers();process.exit(code ?? 1); });
