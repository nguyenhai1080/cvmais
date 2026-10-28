// Read-only public release checks. No CV, account or email requests are submitted.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {sectorDesigns} from '../src/lib/sector-designs.ts';
import {catalogueTemplates,featuredTemplateIds} from '../src/lib/templates.ts';
const origin=process.env.TEST_ORIGIN||'https://cvmais.co.mz';
const fetchPublic=url=>fetch(new URL(url,origin),{signal:AbortSignal.timeout(20000)});
const galleryResponse=await fetchPublic('/modelos');assert.equal(galleryResponse.status,200);
const gallery=await galleryResponse.text();const visible=gallery.replace(/<!--.*?-->/gs,'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ');
assert.ok(visible.includes(`${catalogueTemplates.length} modelos disponíveis`),'truthful catalogue count');
for(const design of sectorDesigns)assert.ok(gallery.includes(`modelo=${design.id}`),design.id);
assert.ok(gallery.includes(`Explora ${catalogueTemplates.length} modelos`),'current SEO count');
const homepage=await(await fetchPublic('/')).text();
const shown=[...homepage.matchAll(/\/template-previews\/([a-z]+)\.png/g)].map(match=>match[1]);
assert.deepEqual(new Set(shown),new Set(featuredTemplateIds));assert.equal(new Set(shown).size,12);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
await Promise.all(sectorDesigns.map(async design=>{
 const path=`public/template-previews/${design.id}.png`;const response=await fetchPublic(`/template-previews/${design.id}.png`);assert.equal(response.status,200,path);
 assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(await readFile(path)),path);
}));
for(const route of ['/api/health','/api/health/backup'])assert.equal((await fetchPublic(route)).status,200,route);
const mail=await(await fetchPublic('/api/storage/email-status')).json();assert.equal(mail.enabled,true);assert.equal(mail.workerReady,true);
console.log(`PASS: ${catalogueTemplates.length} public compositions, ${sectorDesigns.length} byte-identical reviewed PDF previews, twelve homepage designs, current SEO count, app/backup health and mail worker. No private CV data accessed.`);
