import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=(path)=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
test('SEO maps to existing CVMais routes',()=>{
  assert.match(read('src/app/modelos/page.tsx'),/\/modelos/);
  assert.match(read('src/app/orientacoes/[slug]/page.tsx'),/primeiro-cv/);
});
test('private routes declare noindex headers',()=>{
  const config=read('next.config.ts');
  for(const route of ['/conta','/meus-cvs','/criar-cv'])assert.ok(config.includes(`'${route}/:path*'`));
  assert.match(config,/X-Robots-Tag/);
});
test('robots permits noindex visibility',()=>{
  assert.doesNotMatch(read('src/app/robots.ts'),/disallow:.*\/conta/);
});
test('WebApplication has no fabricated review count',()=>{
  const homepage=read('src/app/page.tsx');
  assert.match(homepage,/WebApplication/);
  assert.doesNotMatch(homepage,/aggregateRating|reviewCount/);
});
