import {designModel} from '../src/lib/industry-catalogue.ts';
import test from 'node:test';import assert from 'node:assert/strict';
import {models,normaliseCV,emptyCV,usesSidebar} from '../src/lib/cv.ts';
import {templates,templateAreas,templateSample,templateMatchesArea,areasForTemplate} from '../src/lib/templates.ts';
test('every template has a valid saved model and every professional area has suggestions',()=>{assert.equal(new Set(templates.map(t=>t.id)).size,templates.length);assert.deepEqual(templates.map(t=>t.id),[...models]);for(const area of templateAreas)assert.equal(templates.filter(t=>templateMatchesArea(t.id,area.id)).length,9,area.id);for(const model of models){const sample=templateSample(model);assert.equal(normaliseCV(sample).model,model);assert.equal(sample.cvLanguage,'pt');assert.ok(sample.name&&sample.profile&&sample.education.length);assert.ok(templateMatchesArea(model,'all'));}});
test('new single-column technical designs never force content into a sidebar',()=>{for(const model of ['tecnico','engenharia'])assert.equal(usesSidebar({...emptyCV(),model,skills:'A, B'}),false);});
test('switching to each new design preserves real text, photo and CV language',()=>{const data={...emptyCV(),name:'João',profile:'Texto real [não substituir]',cvLanguage:'en',skills:'SQL',education:[{id:'a',title:'Curso',organisation:'Escola',period:'2024',description:'Projecto real'}]};for(const model of ['tecnico','saude','engenharia','servico']){const saved=normaliseCV({...data,model});assert.equal(saved.cvLanguage,'en');assert.equal(saved.name,data.name);assert.equal(saved.profile,data.profile);assert.equal(saved.education[0].description,data.education[0].description);}});

test('industry handoff follows the primary recommendation and empty supporting columns collapse',()=>{assert.equal(areasForTemplate('servico')[0].id,'hotelaria');assert.equal(areasForTemplate('engenharia')[0].id,'engenharia');for(const model of ['saude','servico'])assert.equal(usesSidebar({...emptyCV(),model,profile:'Experiência real'}),false);});

test('all twelve industries expose nine different layout families with their own persistent IDs',()=>{for(const area of templateAreas){const group=templates.filter(t=>templateMatchesArea(t.id,area.id));assert.equal(new Set(group.map(t=>t.id)).size,9);assert.equal(new Set(group.map(t=>t.detail)).size,9);assert.equal(new Set(group.map(t=>designModel(t.id))).size,9);for(const t of group)assert.equal(normaliseCV({...emptyCV(),model:t.id}).model,t.id);}assert.equal(templates.filter(t=>templateMatchesArea(t.id,'gerais')).length,10);});

test('all industry IDs retain author content and language while near-matching unknown IDs are rejected',()=>{const profile='Dados reais que não devem mudar.';for(const t of templates.filter(t=>!templateMatchesArea(t.id,'gerais'))){const saved=normaliseCV({...emptyCV(),model:t.id,name:'João',profile,cvLanguage:'en'});assert.equal(saved.model,t.id);assert.equal(saved.profile,profile);assert.equal(saved.cvLanguage,'en');}assert.equal(normaliseCV({...emptyCV(),model:'saude--unknown'}).model,'classico');});

import {featuredTemplates,templatePortrait} from '../src/lib/templates.ts';
test('homepage selection has exactly twelve distinct models, every industry and nine layout families',()=>{
 assert.equal(featuredTemplates.length,12);assert.equal(new Set(featuredTemplates.map(t=>t.id)).size,12);
 assert.equal(new Set(featuredTemplates.map(t=>areasForTemplate(t.id)[0].id)).size,12);
 assert.equal(new Set(featuredTemplates.map(t=>designModel(t.id))).size,9);
 assert.ok(featuredTemplates.every(t=>templates.some(item=>item.id===t.id)));
 for(const area of templateAreas){assert.equal(templatePortrait(`${area.id}--linha`),'woman');assert.equal(templatePortrait(`${area.id}--percurso`),'man');}
});
