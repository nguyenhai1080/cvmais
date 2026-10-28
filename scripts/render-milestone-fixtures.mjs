import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const ids='conselho,processos,fiscal,controlo,arquitectura,dados,triagem,prevencao,investigacao,mentoria,projectista,seguranca,rotas,cadeia,negocio,relacao,destino,eventos,marca,campanha,irrigacao,colheita,programa,terreno'.split(',');
let tasks=ids.flatMap(id=>['short','no-photo','en','long','support','sparse'].map(kind=>({id,kind})));let cursor=0;
await Promise.all(Array.from({length:4},async()=>{while(cursor<tasks.length){const {id,kind}=tasks[cursor++];await new Promise((resolve,reject)=>{const c=spawn(process.execPath,['node_modules/tsx/dist/cli.mjs','scripts/render-sector-fixtures.tsx'],{env:{...process.env,QA_MODELS:id,QA_CASE:kind},stdio:'ignore'});c.on('exit',code=>code===0?resolve():reject(Error(id+kind)));});}}));
writeFileSync('work/sector-qa/manifest.json',JSON.stringify(ids));console.log('144 isolated PDF renders completed');
