import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {metricPage,metricSource,parseMetricPayload} from '../src/lib/anonymous-metrics.ts';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('no external analytics scripts or consent banner',()=>{
 const source=read('src/lib/seo-analytics.ts');
 assert.doesNotMatch(source,/gtag|googletagmanager|document\.cookie|localStorage/);
 assert.doesNotMatch(read('src/app/layout.tsx'),/AnalyticsConsentManager/);
});
test('path sanitization',()=>{
 assert.equal(metricPage('/criar-cv?id=private'),'/criar-cv');
 assert.equal(metricPage('/modelos/para/motorista?email=secret'),'/modelos/para/motorista');
 assert.equal(metricPage('/api/cvs/personal-id'),'/outras-paginas');
});
test('source categories without full referrer URLs',()=>{
 assert.equal(metricSource('https://www.google.com/search?q=private','https://cvmais.co.mz'),'google');
 assert.equal(metricSource('https://cvmais.co.mz/modelos','https://cvmais.co.mz'),'internal');
 assert.equal(metricSource('','https://cvmais.co.mz'),'direct');
});
test('strict event allowlist',()=>{
 assert.deepEqual(parseMetricPayload({event:'cv_pdf_exported',page:'/criar-cv',source:'none'}),{event:'cv_pdf_exported',page:'/criar-cv',source:'none'});
 assert.equal(parseMetricPayload({event:'cv_pdf_exported',page:'/criar-cv?id=private',source:'none'}),null);
 assert.equal(parseMetricPayload({event:'page_view',page:'/',source:'none'}),null);
 assert.equal(parseMetricPayload({event:'page_view',page:'/',source:'direct',email:'secret'}),null);
});
test('PDF event only after initiating download',()=>{
 const source=read('src/app/criar-cv/page.tsx');
 assert.ok(source.indexOf('anchor.click();')<source.indexOf("trackConversion('cv_pdf_exported');"));
});
