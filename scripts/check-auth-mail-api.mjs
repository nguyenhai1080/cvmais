// Isolated loopback QA only. Overrides mail configuration and intercepts all Resend calls.
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,mkdtempSync,writeFileSync,readFileSync,rmSync,existsSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {DatabaseSync} from 'node:sqlite';
const root=resolve('.');
mkdirSync(resolve('work'),{recursive:true});
const directory=mkdtempSync(join(resolve('work'),'auth-mail-qa-'));
assert.equal(dirname(directory),resolve('work'));
const database=join(directory,'qa.sqlite');
const modeFile=join(directory,'mode.txt');
const capture=join(directory,'capture.jsonl');
const origin='http://localhost:3005';
const email='mail-queue-pilot@example.test';
const password='Fictional-mail-queue-password';
const env={...process.env,NODE_ENV:'production',DATABASE_PATH:database,APP_ORIGIN:'https://cvmais.example.test',APP_ALLOWED_ORIGINS:origin,
  MAIL_ENABLED:'true',MAIL_FROM:'CVMais <sender@example.test>',RESEND_API_KEY:'fictional-test-key',AUTH_MAIL_ENCRYPTION_KEY:'64_hex_characters_generated_privately',BACKUP_ENCRYPTION_KEY:'ab'.repeat(32),
  BACKUP_ENABLED:'false',BACKUP_ALERTS_ENABLED:'false',OPERATIONS_EMAIL:email,QA_MAIL_MODE:modeFile,QA_MAIL_CAPTURE:capture,
  NODE_OPTIONS:'--import '+pathToFileURL(join(root,'tests/fixtures/auth-mail-mock.mjs')).href};
let server,worker,db,cookie;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(check,label,timeout=90000){const deadline=Date.now()+timeout;while(Date.now()<deadline){try{if(await check())return;}catch{}await sleep(500);}throw Error('Timed out: '+label);}
function start(script,args=[]){const child=spawn(process.execPath,[script,...args],{cwd:root,env,windowsHide:true,stdio:['ignore','pipe','pipe']});child.stdout.on('data',()=>{});child.stderr.on('data',()=>{});return child;}
async function stop(child){if(!child||child.exitCode!==null)return;const ended=new Promise(resolve=>child.once('exit',resolve));child.kill();await ended;}
async function startServer(){server=start('node_modules/next/dist/bin/next',['start','--hostname','127.0.0.1','--port','3005']);await until(async()=> (await fetch(origin+'/api/health')).status===200,'server readiness');}
async function request(path,method='GET',body){const response=await fetch(origin+'/api/storage/'+path,{method,headers:{Origin:origin,...(cookie?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});const text=await response.text();if(!text)throw Error(`Empty response at ${method} ${path}: HTTP ${response.status}`);let value;try{value=JSON.parse(text);}catch{throw Error(`Non-JSON response at ${method} ${path}: HTTP ${response.status}`);}return{status:response.status,value,cookie:response.headers.get('set-cookie')?.split(';')[0]};}
function messages(){return existsSync(capture)?readFileSync(capture,'utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line)):[];}
function token(message){return message.body.text.match(/#token=([a-f0-9]{64})/)[1];}
try{
  writeFileSync(modeFile,'fail');await startServer();
  assert.equal((await request('email-status')).value.enabled,true);
  assert.equal((await request('operations')).status,403);
  const registered=await request('register','POST',{email,password});assert.equal(registered.status,201);assert.equal(Object.hasOwn(registered.value,'recovery'),false);cookie=registered.cookie;
  const cv=await request('cvs','POST',{title:'Fictional queue pilot',data:{name:'Fictional applicant',profile:'Synthetic content for persistence testing.'}});assert.equal(cv.status,201);
  await until(()=>messages().length===1,'initial mocked failure');
  db=new DatabaseSync(database);db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  await until(()=>{const row=db.prepare('SELECT attempts,lease_until FROM auth_mail_outbox').get();return row?.attempts===1&&row.lease_until===0;},'persisted retry');
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM auth_mail_outbox').get().n,1);
  await stop(server);server=null;
  db.prepare('UPDATE auth_mail_outbox SET next_attempt=0').run();writeFileSync(modeFile,'accept');
  await startServer();worker=start('scripts/auth-mail-worker.mjs');
  await until(()=>messages().length>=2,'worker replay without page traffic');
  await until(()=>db.prepare('SELECT COUNT(*) AS n FROM auth_mail_outbox').get().n===0,'queue receipt cleanup');
  const delivered=messages();assert.deepEqual(delivered[0].body,delivered[1].body);assert.equal(delivered[0].key,delivered[1].key);
  assert.equal((await request('email-status')).value.workerReady,true);
  assert.equal((await request('cvs/'+cv.value.id)).value.data.profile,'Synthetic content for persistence testing.');
  assert.equal((await request('verify-email','POST',{token:token(delivered[1])})).status,200);
  assert.equal((await request('email-status')).value.verified,true);
  assert.equal((await request('request-reset','POST',{email})).status,200);
  await until(()=>messages().some(m=>m.body.subject.startsWith('Recupera')),'mocked reset receipt');
  const reset=messages().find(m=>m.body.subject.startsWith('Recupera'));
  assert.equal((await request('reset-email','POST',{token:token(reset),password:'Updated-fictional-queue-password'})).status,200);
  assert.equal((await request('cvs')).status,401);
  const login=await request('login','POST',{email,password:'Updated-fictional-queue-password'});assert.equal(login.status,200);cookie=login.cookie;
  const operations=await request('operations');assert.equal(operations.status,200);assert.equal(operations.value.mail.workerReady,true);
  assert.equal(typeof operations.value.mail.pending,'number');assert.ok(!JSON.stringify(operations.value.mail).includes(email));
  writeFileSync(modeFile,'reject');assert.equal((await request('request-reset','POST',{email})).status,200);
  await until(()=>(db.prepare('SELECT attempts FROM auth_mail_outbox').get()?.attempts===8),'permanent rejection status');
  assert.equal((await request('operations')).value.mail.failed,1);
  assert.equal((await request('account','DELETE',{password:'Updated-fictional-queue-password',confirmation:email})).status,200);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM auth_mail_outbox').get().n,0);
  console.log('PASS: compiled HTTP signup, encrypted persistent retry across restart, independent worker, identical replay, verified-email reset, private operator status, permanent failure and account erasure. All email transport mocked; no external emails sent.');
}finally{
  await stop(worker);await stop(server);db?.close();
  assert.equal(dirname(directory),resolve('work'));rmSync(directory,{recursive:true,force:true});
}
