import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {professions,professionUrl} from '../src/lib/profession-seo.ts';
const read=(path)=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('homepage exposes existing profession hub without generating new pages',()=>{
 const home=read('src/components/home-content.tsx');
 const hub=read('src/components/profession-links.tsx');
 assert.match(home,/<ProfessionLinks\/>/);
 assert.ok(home.indexOf('<TemplateGallery/>')<home.indexOf('<ProfessionLinks/>'));
 assert.match(hub,/professions\.map/);
 assert.match(hub,/professionUrl\(p\.slug\)/);
 assert.deepEqual(professions.map(p=>professionUrl(p.slug)),[
  '/modelos/para/motorista','/modelos/para/vendedor','/modelos/para/estudante',
  '/modelos/para/administrativo','/modelos/para/enfermeiro'
 ]);
});
test('first CV guide links contextually to student example',()=>{
 const source=read('src/components/guide-article.tsx');
 assert.match(source,/slug==='primeiro-cv'/);
 assert.match(source,/href="\/modelos\/para\/estudante"/);
});
test('each profession offers editor action after article and factual examples',()=>{
 const page=read('src/app/modelos/para/[profissao]/page.tsx');
 assert.match(page,/className=\{styles\.nextStep\}/);
 assert.match(page,/<Link className="button" href=\{editor\}>Criar o meu CV grátis<\/Link>/);
 assert.ok(page.indexOf('Exemplos para adaptar ao teu percurso')<page.indexOf('className={styles.nextStep}'));
 assert.match(page,/href="\/orientacoes\/antes-de-enviar"/);
 const sitemap=read('src/app/sitemap.ts');
 assert.match(sitemap,/professionUrl\(slug\)/);
});
