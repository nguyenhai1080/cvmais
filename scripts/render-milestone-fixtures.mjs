import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const ids=(process.env.QA_MODELS||'gestao,gabinete,patrimonio,planeamento,plataforma,produto,reabilitacao,bemestar,aprendizagem,academia,energia,inspeccao,operacao,frota,mercado,parcerias,recepcao,servicos,estudio,publicacao,sustentavel,cultivo,avaliacao,desenvolvimento').split(',');
let tasks=ids.flatMap(id=>['short','no-photo','en','long','support','sparse'].map(kind=>({id,kind})));let cursor=0;
await Promise.all(Array.from({length:4},async()=>{while(cursor<tasks.length){const {id,kind}=tasks[cursor++];await new Promise((resolve,reject)=>{const c=spawn(process.execPath,['node_modules/tsx/dist/cli.mjs','scripts/render-sector-fixtures.tsx'],{env:{...process.env,QA_MODELS:id,QA_CASE:kind},stdio:'ignore'});c.on('exit',code=>code===0?resolve():reject(Error(id+kind)));});}}));
writeFileSync('work/sector-qa/manifest.json',JSON.stringify(ids));console.log(tasks.length+' isolated PDF renders completed');
