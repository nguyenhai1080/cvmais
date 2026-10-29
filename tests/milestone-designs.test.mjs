import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {milestoneDesigns,compositionBlocks,compositionCompact} from '../src/lib/milestone-designs.ts';
import {catalogueTemplates,templateSample,templateAreas,areasForTemplate} from '../src/lib/templates.ts';
import {emptyCV,normaliseCV} from '../src/lib/cv.ts';
import {discoverTemplates,defaultTemplateFilters} from '../src/lib/template-discovery.ts';
test('milestone 98 registers seventy-two whole-page compositions with complete unique content regions',()=>{
 assert.equal(milestoneDesigns.length,72);assert.equal(catalogueTemplates.length,98);
 assert.equal(new Set(milestoneDesigns.map(d=>JSON.stringify(d.layout))).size,72);
 for(const d of milestoneDesigns){const blocks=compositionBlocks(d.layout);for(const key of ['identity','portrait','contact','profile','work','study','skills','languages'])assert.equal(blocks.filter(x=>x===key).length,1,`${d.id}: ${key}`);assert.equal(areasForTemplate(d.id)[0].id,d.area);assert.ok(catalogueTemplates.some(t=>t.id===d.id));assert.ok(d.description&&d.enDescription&&d.detail&&d.enDetail);}
 for(const area of templateAreas)assert.ok(milestoneDesigns.some(d=>d.area===area.id),area.id);
 for(const area of ['logistica','vendas','agricultura'])assert.equal(milestoneDesigns.filter(d=>d.area===area).length,7);
});
test('new layouts retain real candidate text, portrait, language and existing entry order',()=>{
 const data={...emptyCV(),name:'Nome real',profile:'Conteúdo real [sem substituir]',cvLanguage:'en',photo:'data:image/jpeg;base64,'+readFileSync(new URL('../public/images/demo-portrait-woman.jpg',import.meta.url)).toString('base64'),experiences:[{id:'one',title:'Função real',organisation:'Organização',period:'2024',description:'Actividades reais'}]};
 for(const d of milestoneDesigns){const saved=normaliseCV({...data,model:d.id});assert.equal(saved.model,d.id);for(const key of ['name','profile','cvLanguage','photo'])assert.equal(saved[key],data[key]);assert.equal(saved.experiences[0].title,'Função real');assert.equal(compositionCompact(saved),true);assert.equal(compositionCompact({...saved,skills:'Texto longo '.repeat(150)}),false);}
});
test('first-job illustrations use training projects, not invented prior employment',()=>{
 const first=milestoneDesigns.filter(d=>d.sampleMode==='first');assert.ok(first.length>=6);
 for(const d of first){const sample=templateSample(d.id);assert.equal(sample.role,d.role);assert.equal(sample.experiences.length,1);assert.equal(sample.experiences[0].title,'Projecto de formação');assert.ok(sample.education.length);}
 for(const [query,id] of [['secretariado','secretariado'],['audit','auditoria'],['telecom','sistemas'],['nursing','clinica'],['warehouse','inventario'],['motorista','mobilidade'],['customer service','balcao'],['cozinha','sabores'],['agronomy','safra'],['NGO','cooperacao']])assert.ok(discoverTemplates({...defaultTemplateFilters,query}).some(t=>t.id===id),`${query}: ${id}`);
});
