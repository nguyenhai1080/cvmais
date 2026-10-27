#!/usr/bin/env node
// Read-only v30 public acceptance: no login, no valid analytics POST, no user data.
const base='https://cvmais.co.mz';
const checks=[];
function record(name,ok,detail=''){checks.push({name,ok});console.log((ok?'PASS ':'FAIL ')+name+(detail?': '+detail:''));}
async function read(url,options={}){
 const r=await fetch(new URL(url,base),{redirect:'follow',signal:AbortSignal.timeout(20000),...options});
 return {status:r.status,body:await r.text(),headers:r.headers};
}
const pages=new Map();
for(const path of ['/','/modelos','/operacoes','/privacidade','/criar-cv']){
 try{
  const r=await read(path);pages.set(path,r.body);
  record('HTTP '+path,r.status===200,String(r.status));
  record('No eager third-party GA4 '+path,!/<script[^>]+(?:googletagmanager\.com|google-analytics\.com)/i.test(r.body));
 }catch(e){record('HTTP '+path,false,String(e).slice(0,160));}
}
try{
 const r=await read('/sitemap.xml');
 record('17 canonical sitemap URLs',r.status===200&&(r.body.match(/<loc>/g)||[]).length===17,
  'HTTP '+r.status+' / '+(r.body.match(/<loc>/g)||[]).length+' URLs');
}catch(e){record('17 canonical sitemap URLs',false,String(e));}
for(const [path,expected] of [['/api/storage/operations',403],['/api/analytics',405]]){
 try{const r=await read(path);record('Restricted '+path,r.status===expected,'HTTP '+r.status);}
 catch(e){record('Restricted '+path,false,String(e));}
}
const scripts=new Set(),styles=new Set();
for(const html of pages.values()){
 for(const m of html.matchAll(/<(script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["'][^>]*>/gi)){
  try{
   const url=new URL(m[2].replaceAll('&amp;','&'),base);
   if(url.origin!==base||!url.pathname.startsWith('/_next/static/'))continue;
   if(url.pathname.endsWith('.js'))scripts.add(url.href);
   if(url.pathname.endsWith('.css'))styles.add(url.href);
  }catch{}
 }
}
async function fetchAssets(urls){
 let failures=0;const parts=[];
 const list=[...urls];
 for(let i=0;i<list.length;i+=6){
  const batch=await Promise.all(list.slice(i,i+6).map(async url=>{
   try{const r=await fetch(url,{signal:AbortSignal.timeout(20000)});return r.ok?await r.text():null;}
   catch{return null;}
  }));
  for(const data of batch){if(data===null)failures++;else parts.push(data);}
 }
 return {parts,failures};
}
const js=await fetchAssets(scripts);
record('Production JS assets accessible',scripts.size>0&&js.failures===0,js.parts.length+' assets / '+js.failures+' failures');
const css=await fetchAssets(styles);
record('Production CSS assets accessible',styles.size>0&&css.failures===0,css.parts.length+' assets / '+css.failures+' failures');
const cssText=css.parts.join('\n').replace(/\s+/g,'');
record('v30 chart CSS deployed',cssText.includes('height:217px')&&cssText.includes('height:175px')&&
 cssText.includes('font-size:10px')&&cssText.includes('min-width:0'),
 'Expected v30 chart dimensions, activity tick spacing and labels');
const jsText=js.parts.join('\n');
record('No old GA4 or consent script',!jsText.includes('cvmais-analytics-consent-v1')&&
 !jsText.includes('G-JNHPNNCZRF')&&!jsText.includes('googletagmanager.com/gtag/js'));
const passed=checks.filter(x=>x.ok).length;
console.log('\n'+passed+'/'+checks.length+' checks passed');
if(passed!==checks.length)process.exitCode=1;
