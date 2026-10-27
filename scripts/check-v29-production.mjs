#!/usr/bin/env node
// CVMais v29: read-only public acceptance. Never submit valid telemetry events.
const base='https://cvmais.co.mz';const results=[];
const mark=(name,ok,detail='')=>{results.push({name,ok});console.log((ok?'PASS ':'FAIL ')+name+' '+detail)};
async function read(path,options){const response=await fetch(new URL(path,base),{redirect:'follow',signal:AbortSignal.timeout(20000),...options});return {status:response.status,body:await response.text(),headers:response.headers}}
const pages=new Map();
for(const path of ['/','/modelos','/operacoes','/privacidade','/criar-cv']){
 try{const r=await read(path);pages.set(path,r.body);mark(path+' HTTP',r.status===200,String(r.status));
 mark(path+' no eager Google tags',!/<script[^>]+(?:googletagmanager\.com|google-analytics\.com)/i.test(r.body));
 }catch(e){mark(path+' HTTP',false,String(e).slice(0,100))}
}
try{const r=await read('/sitemap.xml');mark('17 sitemap URLs',r.status===200&&(r.body.match(/<loc>/g)||[]).length===17)}catch(e){mark('17 sitemap URLs',false,String(e))}
for(const [path,expect] of [['/api/storage/operations',403],['/api/analytics',405]]){
 try{const r=await read(path);mark(path+' restricted',r.status===expect,String(r.status))}catch(e){mark(path+' restricted',false,String(e))}
}
const assets=new Set();for(const html of pages.values()){for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)){try{const url=new URL(m[1].replaceAll('&amp;','&'),base);if(url.origin===base&&url.pathname.startsWith('/_next/static/')&&url.pathname.endsWith('.js'))assets.add(url.href)}catch{}}}
let source='',fail=0;const urls=[...assets];
for(let i=0;i<urls.length;i+=6){const batch=await Promise.all(urls.slice(i,i+6).map(async url=>{try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});return r.ok?await r.text():null}catch{return null}}));for(const part of batch){if(part===null)fail++;else source+=part+'\n'}}
mark('Next.js bundles accessible',assets.size>0&&fail===0,assets.size+' files; '+fail+' failed');
mark('Dashboard v2 deployed',source.includes('Estatísticas anónimas de utilização')&&source.includes('Aberturas do editor')&&source.includes('Páginas mais visualizadas'),'dashboard PT labels');
mark('7/30/90-day filters deployed',source.includes('7')&&source.includes('30')&&source.includes('90')&&source.includes('Período do relatório'));
mark('No GA4 or consent popup',!source.includes('cvmais-analytics-consent-v1')&&!source.includes('G-JNHPNNCZRF')&&!source.includes('googletagmanager.com/gtag/js'));
const good=results.filter(r=>r.ok).length;console.log(good+'/'+results.length+' checks passed');if(good!==results.length)process.exitCode=1;
