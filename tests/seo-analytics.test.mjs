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
