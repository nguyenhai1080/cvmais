import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {professions,professionBySlug,professionUrl} from '../src/lib/profession-seo.ts';
import {publicDomainRedirect} from '../src/lib/domain-migration.ts';
const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('five unique profession pages with useful content',()=>{
 assert.deepEqual(professions.map(p=>p.slug),['motorista','vendedor','estudante','administrativo','enfermeiro']);
 assert.equal(new Set(professions.map(p=>p.title)).size,5);
 assert.equal(new Set(professions.map(p=>p.profile)).size,5);
 for(const p of professions){
  assert.equal(professionBySlug(p.slug),p);
  assert.ok(p.intro.length>150);
  assert.ok(p.description.length>70&&p.description.length<190);
  assert.equal(p.advice.length,3);
  assert.ok(p.skills.length>=4&&p.questions.length===2);
  assert.ok(['classico','servico','primeiro','saude'].includes(p.model));
  assert.ok(professionUrl(p.slug).startsWith('/modelos/para/'));
 }
 assert.equal(professionBySlug('desconhecido'),undefined);
});
test('official domain migration of public profession URL, not private editor',()=>{
 assert.equal(publicDomainRedirect('cvmais.win','/modelos/para/motorista','?utm_source=example','GET'),
  'https://cvmais.co.mz/modelos/para/motorista?utm_source=example');
 assert.equal(publicDomainRedirect('www.cvmais.co.mz','/modelos/para/enfermeiro','','HEAD'),
  'https://cvmais.co.mz/modelos/para/enfermeiro');
 assert.equal(publicDomainRedirect('cvmais.win','/criar-cv','','GET'),null);
});
test('profession routes are sitemap indexable and proxied',()=>{
 assert.match(read('src/proxy.ts'),/modelos\/:path/);
 assert.match(read('src/proxy.ts'),/startsWith\('\/modelos\/para\/'\)/);
 assert.match(read('src/app/sitemap.ts'),/professionUrl\(slug\)/);
});
test('landing pages expose canonical and links to functioning editor',()=>{
 const source=read('src/app/modelos/para/[profissao]/page.tsx');
 assert.match(source,/generateStaticParams/);
 assert.match(source,/canonical/);
 assert.match(source,/BreadcrumbList/);
 assert.match(source,/\/criar-cv\?/);
 assert.match(source,/notFound/);
});
