import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {sectorDesigns,sectorBlocks,sectorCompact} from '../src/lib/sector-designs.ts';
import {emptyCV,normaliseCV,usesSidebar} from '../src/lib/cv.ts';
import {catalogueTemplates,templateSample,templateMatchesArea,templateAreas} from '../src/lib/templates.ts';
import {discoverTemplates,defaultTemplateFilters} from '../src/lib/template-discovery.ts';
test('twelve sector compositions own different structures and cover every industry once',()=>{
 assert.equal(sectorDesigns.length,12);
 assert.deepEqual(new Set(sectorDesigns.map(d=>d.area)),new Set(templateAreas.map(a=>a.id)));
 // Structure omits all colour/name/sector metadata. Visual review is required separately.
 assert.equal(new Set(sectorDesigns.map(d=>JSON.stringify([d.header,d.entry,d.label,d.body]))).size,12);
 for(const d of sectorDesigns){const blocks=sectorBlocks(d.body);for(const key of ['profile','work','study','skills','languages'])assert.equal(blocks.filter(b=>b===key).length,1,`${d.id}: ${key}`);assert.ok(blocks.filter(b=>b==='contact').length<=1);assert.ok(catalogueTemplates.some(t=>t.id===d.id));assert.ok(templateMatchesArea(d.id,d.area));assert.equal(templateSample(d.id).model,d.id);}
});
test('new sector models retain user fields, portrait and independent CV language',()=>{
 const data={...emptyCV(),name:'Nome real',photo:'data:image/jpeg;base64,'+readFileSync(new URL('../public/images/demo-portrait-woman.jpg',import.meta.url)).toString('base64'),profile:'Conteúdo do candidato',cvLanguage:'en',education:[{id:'one',title:'Formação real',organisation:'Instituição',period:'2024',description:'Projecto real'}]};
 for(const d of sectorDesigns){const result=normaliseCV({...data,model:d.id});assert.equal(result.model,d.id);assert.equal(result.profile,data.profile);assert.equal(result.photo,data.photo);assert.equal(result.cvLanguage,'en');assert.equal(result.education[0].description,data.education[0].description);assert.equal(usesSidebar(result),false);assert.equal(sectorCompact(result),true);assert.equal(sectorCompact({...result,skills:'Muito texto '.repeat(150)}),false);}
});
test('sector discovery finds a suitable new layout from profession aliases',()=>{
 for(const [query,id] of [['auditor','balanco'],['telecom','circuito'],['nurse','cuidado'],['teacher','catedra'],['AutoCAD','prumo'],['warehouse','travessia'],['sales','impulso'],['receptionist','estancia'],['design','prisma'],['agronomy','campo'],['NGO','elo'],['HR','pauta']])assert.ok(discoverTemplates({...defaultTemplateFilters,query}).some(t=>t.id===id),query);
});
