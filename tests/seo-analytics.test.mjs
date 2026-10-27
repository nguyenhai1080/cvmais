import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sanitizeAnalyticsPath,isAnalyticsConfigured} from '../src/lib/seo-analytics.ts';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('GA4 disabled without measurement ID',()=>assert.equal(isAnalyticsConfigured(),false));
test('only clean, known paths reach GA4',()=>{
 assert.equal(sanitizeAnalyticsPath('/criar-cv?id=secret'),'/criar-cv');
 assert.equal(sanitizeAnalyticsPath('/modelos/para/motorista?utm_campaign=x'),'/modelos/para/motorista');
 assert.equal(sanitizeAnalyticsPath('/api/storage/cvs/123'),'/outras-paginas');
 assert.equal(sanitizeAnalyticsPath('/modelos/para/person@example.com'),'/outras-paginas');
});
test('requires opt-in and disables automatic pageview',()=>{
 const src=read('src/lib/seo-analytics.ts');
 assert.match(src,/getAnalyticsConsent\(\) !== 'accepted'/);
 assert.match(src,/send_page_view: false/);
 assert.match(src,/allow_google_signals: false/);
 assert.doesNotMatch(src,/data\.name|data\.email|data\.profile|data\.photo/);
});
test('PDF event after successful download initiation',()=>{
 const src=read('src/app/criar-cv/page.tsx');
 assert.ok(src.indexOf('anchor.click();')<src.indexOf("trackConversion('cv_pdf_exported');"));
});


test('browser mock: no GA script or events before opt-in, no private query data after',async()=>{
 const prev=process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
 process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID='G-TEST123456';
 const storage=new Map();
 const scripts=[];
 const w={
  location:{origin:'https://cvmais.co.mz',hostname:'cvmais.co.mz',pathname:'/criar-cv',search:'?id=private-cv-id'},
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
  dispatchEvent:()=>{},
 };
 const d={
  cookie:'',
  referrer:'https://www.google.com/search?q=private+search',
  getElementById:()=>null,
  createElement:()=>({}),
  head:{appendChild:script=>scripts.push(script)},
 };
 const previousWindow=globalThis.window,previousDocument=globalThis.document,previousEvent=globalThis.Event;
 globalThis.window=w;globalThis.document=d;globalThis.Event=class Event{constructor(type){this.type=type;}};
 try{
  const mod=await import('../src/lib/seo-analytics.ts?configured-test');
  assert.equal(mod.isAnalyticsConfigured(),true);
  assert.equal(mod.startAnalytics(),false);
  assert.equal(scripts.length,0);
  assert.equal(w.dataLayer,undefined);
  mod.chooseAnalyticsConsent('declined');
  mod.trackAnalyticsPage('/criar-cv?id=private-cv-id');
  assert.equal(scripts.length,0);
  mod.chooseAnalyticsConsent('accepted');
  mod.trackAnalyticsPage('/criar-cv?id=private-cv-id');
  mod.trackConversion('cv_pdf_exported');
  assert.equal(scripts.length,1);
  assert.match(scripts[0].src,/googletagmanager\.com\/gtag\/js/);
  const serialized=JSON.stringify(w.dataLayer);
  assert.doesNotMatch(serialized,/private-cv-id|private\+search|google\.com\/search/);
  assert.match(serialized,/cv_pdf_exported/);
  assert.match(serialized,/https:\/\/cvmais\.co\.mz\/criar-cv/);
  const before=w.dataLayer.length;
  mod.chooseAnalyticsConsent('declined');
  assert.equal(w['ga-disable-G-TEST123456'],true);
  mod.trackConversion('cv_pdf_exported');
  assert.equal(w.dataLayer.length,before);
 } finally {
  if(prev===undefined)delete process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
  else process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID=prev;
  if(previousWindow===undefined)delete globalThis.window;else globalThis.window=previousWindow;
  if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;
  if(previousEvent===undefined)delete globalThis.Event;else globalThis.Event=previousEvent;
 }
});
