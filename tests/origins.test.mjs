import {test} from 'node:test';
import assert from 'node:assert/strict';
import {allowedOrigin} from '../src/lib/server/origins.ts';
import {parseCVBackup} from '../src/lib/cv-backup.ts';
import {normaliseCV} from '../src/lib/cv.ts';
import {readFileSync} from 'node:fs';
test('domain migration trusts exact configured origins and rejects lookalikes, missing and malformed origins', () => {
 const keys=['APP_ORIGIN','APP_ALLOWED_ORIGINS'];const old=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 try {
 Object.assign(process.env,{APP_ORIGIN:'https://cvmais.win',APP_ALLOWED_ORIGINS:'https://cvmais-dgc.n1.tinhgon.xyz, invalid, https://bad.example/path'});
 for(const origin of ['https://cvmais.win','https://cvmais-dgc.n1.tinhgon.xyz'])assert.ok(allowedOrigin(origin,'http://internal:3000'));
 for(const origin of [null,'null','http://cvmais.win','https://cvmais.win.evil.test','https://cvmais.win/','https://bad.example','https://bad.example/path','http://internal:3000'])assert.equal(allowedOrigin(origin,'http://internal:3000'),false);
 }finally{for(const key of keys){if(old[key]===undefined)delete process.env[key];else process.env[key]=old[key];}}
});
test('portable CV backups reject malformed and oversized files and preserve supported photo/content', () => {
 const photo='data:image/jpeg;base64,'+readFileSync(new URL('../public/images/demo-portrait-woman.jpg',import.meta.url)).toString('base64');
 const data={name:'Pessoa fictícia',model:'moderno',photo,profile:'Exemplo de teste'};
 assert.deepEqual(normaliseCV(parseCVBackup(JSON.stringify({format:'cvmais-backup-v1',data}))),normaliseCV(data));
 for(const raw of ['null','[]','bad','{}',JSON.stringify({format:'other',data}),JSON.stringify({format:'cvmais-backup-v1',data:[]}),JSON.stringify({format:'cvmais-backup-v1',data:null}),'a'.repeat(512001)])assert.throws(()=>parseCVBackup(raw));
});
