import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {backupHealth,writeStatus,readStatus} from '../scripts/backup-health.mjs';
import {notifyBackupHealth,sendBackupAlert} from '../scripts/backup-alerts.mjs';
import {checkBackupAlerts} from '../scripts/backup-monitor.mjs';
import {runDailyBackup} from '../scripts/backup-worker.mjs';
const now=new Date('2026-10-25T12:00:00Z');
test('backup probe distinguishes stale worker, stale/missing snapshots, disabled configuration and failed attempts without private fields',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'cvmais-health-'));
 const health=()=>backupHealth({directory,now,enabled:true,configured:true});
 try{
 assert.equal((await health()).state,'worker_stale');
 await writeStatus(directory,'worker-status.json',{checkedAt:now.toISOString(),lastAttemptAt:now.toISOString(),lastResult:'success'});
 assert.equal((await health()).state,'missing');
 await writeStatus(directory,'offsite-status.json',{fileId:'private-upload-id',fileName:'private-object-name',completedAt:'2026-10-24T11:59:59Z',secret:'must-never-appear'});
 assert.equal((await health()).state,'healthy');
 assert.equal(JSON.stringify(await health()).includes('private-'),false);assert.equal(JSON.stringify(await health()).includes('must-never-appear'),false);
 await writeStatus(directory,'offsite-status.json',{fileId:'private',completedAt:'2026-10-23T23:59:59Z'});
 assert.equal((await health()).state,'stale');
 await writeStatus(directory,'worker-status.json',{checkedAt:now.toISOString(),lastResult:'failure',failureSince:now.toISOString()});assert.equal((await health()).state,'failed');
 await writeStatus(directory,'worker-status.json',{checkedAt:'2026-10-25T09:29:59Z',lastResult:'success'});assert.equal((await health()).state,'worker_stale');
 await writeStatus(directory,'worker-status.json',{checkedAt:'2026-10-26T12:00:00Z'});assert.equal((await health()).state,'worker_stale');
 assert.equal((await backupHealth({directory,now,enabled:false,configured:true})).state,'disabled');
 assert.equal((await backupHealth({directory,now,enabled:true,configured:false})).state,'misconfigured');
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('worker preserves last successful receipt on failure and records/recoveries status consistently',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'cvmais-worker-state-'));
 const receipt={fileId:'fictional-id',bytes:20,fileName:'fictional.cvb'};
 try{
 await runDailyBackup({directory,now,backup:async()=>receipt});
 const original=await readStatus(directory,'offsite-status.json');
 await runDailyBackup({directory,now:new Date('2026-10-26T12:00:00Z'),backup:async()=>{throw Error('credential-private-must-not-log');}});
 assert.deepEqual(await readStatus(directory,'offsite-status.json'),original);
 assert.equal((await readStatus(directory,'worker-status.json')).lastResult,'failure');
 await runDailyBackup({directory,now:new Date('2026-10-26T13:00:00Z'),backup:async()=>receipt});
 assert.equal((await readStatus(directory,'worker-status.json')).failureSince,null);
 assert.equal((await readStatus(directory,'offsite-status.json')).completedAt,'2026-10-26T13:00:00.000Z');
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('incident alerts deduplicate across restarts, retry delivery failures and send a single recovery',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'cvmais-alerts-'));const sent=[];
 const send=async(h,kind,id)=>sent.push({kind,id});
 const bad={state:'failed',healthy:false,lastSuccessAt:null,checkedAt:now.toISOString()};
 const good={...bad,state:'healthy',healthy:true};
 const options={directory,now,enabled:true,send};
 try{
 await notifyBackupHealth(good,options);assert.equal(sent.length,0);
 await assert.rejects(notifyBackupHealth(bad,{...options,send:async()=>{throw Error('synthetic');}}));
 assert.equal((await readStatus(directory,'alert-status.json')).notified,false);
 await notifyBackupHealth(bad,options);await notifyBackupHealth({...bad,state:'stale'},options);assert.equal(sent.length,1);
 await assert.rejects(notifyBackupHealth(good,{...options,send:async()=>{throw Error('synthetic');}}));
 assert.ok((await readStatus(directory,'alert-status.json')).id);
 await notifyBackupHealth(good,options);await notifyBackupHealth(good,options);assert.equal(sent.length,2);assert.equal(sent[1].kind,'recovered');assert.equal(sent[0].id,sent[1].id);
 await notifyBackupHealth(bad,{...options,now:new Date('2026-10-26T12:00:00Z')});assert.equal(sent.length,3);assert.notEqual(sent[2].id,sent[0].id);
 await notifyBackupHealth(good,{...options,enabled:false});assert.equal(sent.length,3);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('independent monitor observes an old heartbeat even without running the backup worker',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'cvmais-watchdog-'));let observed;
 try{
 await writeStatus(directory,'worker-status.json',{checkedAt:'2026-10-25T01:00:00Z'});
 await checkBackupAlerts({directory,now,health:options=>backupHealth({...options,enabled:true,configured:true}),notify:async value=>{observed=value;}});
 assert.equal(observed.state,'worker_stale');
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('alert transport uses scoped sender with stable idempotency and no private operational receipt',async()=>{
 const keys=['OPERATIONS_EMAIL','RESEND_API_KEY','MAIL_FROM'];const old=Object.fromEntries(keys.map(key=>[key,process.env[key]]));const original=globalThis.fetch;
 Object.assign(process.env,{OPERATIONS_EMAIL:'operator@example.test',RESEND_API_KEY:'fictional-key',MAIL_FROM:'CVMais <fictional@example.test>'});
 globalThis.fetch=async(url,options)=>{assert.equal(url,'https://api.resend.com/emails');assert.equal(options.redirect,'error');const body=JSON.parse(options.body);assert.deepEqual(body.to,['operator@example.test']);assert.equal(JSON.stringify(body).includes('private-receipt'),false);assert.ok(options.headers['Idempotency-Key']);return Response.json({id:'fictional-receipt'});};
 try{await sendBackupAlert({state:'failed',lastSuccessAt:null,checkedAt:null,fileId:'private-receipt'},'failed',now.toISOString());}
 finally{globalThis.fetch=original;for(const key of keys){if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];}}
});
