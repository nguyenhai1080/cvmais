import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
const ids=(process.env.QA_MODELS||'direccao,capital,infraestrutura,engenhodigital,assistencia,vigilancia,pedagogia,conhecimento,obra,mecanica,terminal,abastecimento,cliente,expansao,acolhimento,hospitalidade,criacao,voz,rural,producao,inclusao,impacto').split(',');
let tasks=ids.flatMap(id=>['short','no-photo','en','long','support','sparse'].map(kind=>({id,kind})));let cursor=0;
await Promise.all(Array.from({length:4},async()=>{while(cursor<tasks.length){const {id,kind}=tasks[cursor++];await new Promise((resolve,reject)=>{const c=spawn(process.execPath,['node_modules/tsx/dist/cli.mjs','scripts/render-sector-fixtures.tsx'],{env:{...process.env,QA_MODELS:id,QA_CASE:kind},stdio:'ignore'});c.on('exit',code=>code===0?resolve():reject(Error(id+kind)));});}}));
writeFileSync('work/sector-qa/manifest.json',JSON.stringify(ids));console.log(tasks.length+' isolated PDF renders completed');
