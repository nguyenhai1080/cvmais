#!/usr/bin/env node
// Read-only v28 acceptance audit; malformed submissions are rejected before storing.
const ORIGIN = 'https://cvmais.co.mz';
const checks = [];
const add = (name, ok, detail = '') => {
  const verdict = ok ? 'PASS' : 'FAIL';
  checks.push({ name, ok, detail });
  console.log(verdict + ' ' + name + ': ' + detail);
};
async function get(path, options = {}) {
  const res = await fetch(new URL(path, ORIGIN), {
    redirect: 'follow',
    signal: AbortSignal.timeout(20000),
    headers: { 'User-Agent': 'CVMais-v28-Public-Audit/1.0', ...options.headers },
    ...options,
  });
  const body = await res.text();
  return { res, body };
}
const publicPaths = ['/', '/modelos', '/privacidade', '/criar-cv'];
const html = new Map();
for (const path of publicPaths) {
  try {
    const data = await get(path);
    html.set(path, data.body);
    add('HTTP ' + path, data.res.status === 200 && data.res.url.startsWith(ORIGIN),
      'HTTP ' + data.res.status);
    const eager = [...data.body.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)]
      .map(match => match[1]).filter(src => /google-analytics\.com|googletagmanager\.com/i.test(src));
    add('No eager third-party analytics ' + path, eager.length === 0,
      eager.length ? eager.join(',').slice(0, 140) : 'No Google tag in HTML');
  } catch (error) {
    add('HTTP ' + path, false, String(error).slice(0, 170));
  }
}
try {
  const {res,body} = await get('/sitemap.xml');
  const n = [...body.matchAll(/<loc>/g)].length;
  add('Sitemap still contains 17 URLs',res.status === 200 && n === 17,
    'HTTP ' + res.status + ' / ' + n + ' URLs');
} catch(error) { add('Sitemap still contains 17 URLs',false,String(error).slice(0,160)); }

const bundles = new Set();
for(const page of html.values()){
  for(const m of page.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)){
    try {
      const url = new URL(m[1].replaceAll('&amp;','&'),ORIGIN);
      if(url.origin===ORIGIN && url.pathname.startsWith('/_next/static/') && url.pathname.endsWith('.js')) bundles.add(url.href);
    } catch {}
  }
}
const source = [];
let errors = 0;
const items = [...bundles];
for(let i=0;i<items.length;i+=6){
  const fetched = await Promise.all(items.slice(i,i+6).map(async url=>{
    try { const res=await fetch(url,{signal:AbortSignal.timeout(20000)});
      return res.ok ? await res.text() : null;
    } catch { return null; }
  }));
  for(const item of fetched){ if(item===null)errors++; else source.push(item); }
}
const all = source.join('\n');
add('Production JS bundles fetched',bundles.size>0 && errors===0,
  source.length+' fetched / '+errors+' failures');
add('First-party analytics client deployed', all.includes('/api/analytics') &&
  ['cv_builder_started','cv_template_selected','cv_pdf_exported'].every(x=>all.includes(x)),
  'Endpoint and 3 event labels');
add('Consent popup and GA4 client removed',!all.includes('cvmais-analytics-consent-v1') &&
  !all.includes('G-JNHPNNCZRF') &&
  !all.includes('googletagmanager.com/gtag/js'),
  'No consent key, old GA4 measurement ID or gtag loader');
add('Privacy information revised', (html.get('/privacidade')||'').includes('Estatísticas anónimas de utilização'),
  'Cookieless measurement described in public Privacy page');

const requests = [
  {name:'Analytics GET forbidden',path:'/api/analytics',expected:405,opts:{}},
  {name:'Reject cross-origin event',path:'/api/analytics',expected:403,opts:{method:'POST',headers:{
    Origin:'https://not-cvmais.example','Content-Type':'application/json','Sec-Fetch-Site':'cross-site'
  },body:JSON.stringify({event:'page_view',page:'/',source:'direct'})}},
  {name:'Reject malformed event before database write',path:'/api/analytics',expected:400,opts:{method:'POST',headers:{
    Origin:ORIGIN,'Content-Type':'application/json','Sec-Fetch-Site':'same-origin'
  },body:JSON.stringify({event:'cv_pdf_exported',page:'/criar-cv?id=secret',source:'none'})}},
  {name:'Operations metrics require authentication',path:'/api/storage/operations',expected:403,opts:{}},
];
for (const {name,path,expected,opts} of requests){
  try {
    const {res} = await get(path,opts);
    add(name,res.status===expected,'HTTP '+res.status+' (expected '+expected+')');
    if(path==='/api/analytics')add('No analytics Set-Cookie ('+name+')',
      !res.headers.has('set-cookie'),'No response cookie');
  } catch(error) {add(name,false,String(error).slice(0,160));}
}
const passed=checks.filter(x=>x.ok).length;
console.log('\n'+passed+'/'+checks.length+' checks passed');
if(passed!==checks.length)process.exitCode=1;
