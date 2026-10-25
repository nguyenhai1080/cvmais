import test from 'node:test';
import assert from 'node:assert/strict';
import {discoverTemplates, readTemplateFilters, templateLibraryHref, templateEditorHref, safeTemplateReturn, defaultTemplateFilters} from '../src/lib/template-discovery.ts';

test('discovery finds professions in Portuguese and English without accents and combines filters',()=>{
  for(const query of ['enfermagem','nurse','saúde','saude']) assert.equal(discoverTemplates({area:'saude',style:'Todos',query}).length,6,query);
  for(const query of ['programador','developer','software']) assert.equal(discoverTemplates({area:'tecnologia',style:'Todos',query}).length,6,query);
  assert.equal(discoverTemplates({area:'hotelaria',style:'Criativo',query:'receptionist'}).length,1);
  assert.equal(discoverTemplates({area:'tecnologia',style:'Todos',query:'Byte timeline'}).length,1);
  assert.equal(discoverTemplates({...defaultTemplateFilters,query:'xyz-inexistent'}).length,0);
  assert.equal(discoverTemplates(defaultTemplateFilters).length,82);
});
test('template library URLs retain selection and search through editor and sanitise foreign return targets',()=>{
  const filters={area:'saude',style:'Primeiro emprego',query:'enfermagem'};
  const href=templateLibraryHref(filters);
  assert.deepEqual(readTemplateFilters(new URL(href,'https://cvmais.win').searchParams),filters);
  const params=new URL(templateEditorHref('saude--formacao',filters),'https://cvmais.win').searchParams;
  assert.equal(params.get('modelo'),'saude--formacao');assert.equal(params.get('area'),'saude');
  assert.equal(safeTemplateReturn(params.get('biblioteca')),href);
  for(const foreign of ['https://evil.example/modelos','//evil.example/modelos','/modelos/../conta','/modelos-extra','javascript:alert(1)'])assert.equal(safeTemplateReturn(foreign),'/modelos');
  assert.equal(safeTemplateReturn('/modelos?area=invalid&estilo=bad&other=x'),'/modelos');
  assert.equal(readTemplateFilters(new URLSearchParams({q:'a'.repeat(200)})).query.length,100);
  assert.equal(new URL(templateEditorHref('classico',{...defaultTemplateFilters,area:'gerais'}),'https://cvmais.win').searchParams.get('area'),'administracao');
});
import { templates } from '../src/lib/templates.ts';
import { templateTags, templateTagById } from '../src/lib/template-taxonomy.ts';
import { discoverTemplateResults, visibleTemplateTags } from '../src/lib/template-discovery.ts';
import { designModel } from '../src/lib/industry-catalogue.ts';
const search=query=>discoverTemplates({...defaultTemplateFilters,query});

test('all templates expose curated multilingual tags and every tag is assigned',()=>{
 assert.equal(new Set(templateTags.map(t=>t.id)).size,templateTags.length);
 for(const t of templates){assert.ok(t.tagIds.length>=2,t.id);assert.equal(new Set(t.tagIds).size,t.tagIds.length);for(const id of t.tagIds)assert.ok(templateTagById.has(id),id);}
 for(const tag of templateTags){assert.ok(tag.pt&&tag.en&&tag.aliases.length);assert.ok(templates.some(t=>t.tagIds.includes(tag.id)),tag.id);}
 for(const [area,query] of Object.entries({administracao:'human resources',contabilidade:'auditor',tecnologia:'telecom',saude:'nursing',educacao:'teacher',engenharia:'AutoCAD',logistica:'supply chain',vendas:'customer service',hotelaria:'receptionist',comunicacao:'public relations',agricultura:'agronomy',projectos:'NGO'}))assert.equal(discoverTemplates({area,style:'Todos',query}).length,6,area);
});
test('telecom equivalents find suitable engineering/IT designs without conflating marketing',()=>{
 const expected=search('telecom').map(t=>t.id);
 assert.ok(expected.length>=12);
 for(const query of ['telecommunications','telecomunicações','telecomunicacoes','telecom engineer','engenheiro de telecomunicações','5G','fibra óptica'])assert.deepEqual(new Set(search(query).map(t=>t.id)),new Set(expected),query);
 assert.ok(search('telecom').every(t=>t.tagIds.includes('telecom')));
 assert.ok(search('communication').some(t=>t.id==='comunicacao--editorial'));
 assert.ok(!search('telecom').some(t=>t.id.startsWith('comunicacao--')));
 assert.ok(['engenharia','tecnico','moderno'].includes(designModel(search('telecom')[0].id)));
 assert.equal(visibleTemplateTags(search('telecom')[0].id,'telecom')[0].id,'telecom');
 assert.ok(search('telecom project manager').length>0);
 assert.equal(discoverTemplates({area:'comunicacao',style:'Todos',query:'telecom'}).length,0);
});
test('short abbreviations match whole words and one-edit fallback never broadens exact results',()=>{
 assert.ok(search('IT').length>0);assert.ok(search('IT').every(t=>t.tagIds.includes('it-support')));
 assert.ok(search('HR').every(t=>t.tagIds.includes('hr')));
 assert.equal(search('JT').length,0);
 assert.equal(discoverTemplateResults({...defaultTemplateFilters,query:'telecom'}).approximate,false);
 const typo=discoverTemplateResults({...defaultTemplateFilters,query:'telecomunications'});
 assert.ok(typo.approximate&&typo.items.length>0);assert.ok(typo.items.every(t=>t.tagIds.includes('telecom')));
 assert.equal(search('thisworddoesnotexist').length,0);
 assert.ok(search('project manager').some(t=>t.tagIds.includes('project-management')));
});

import {templateTagSuggestions,resultsOutsideTemplateFilters} from '../src/lib/template-discovery.ts';
test('tag suggestions support prefixes, aliases and languages with truthful filtered counts',()=>{
 const base={...defaultTemplateFilters,query:'tel'};
 const telecom=templateTagSuggestions(base,'en').find(s=>s.id==='telecom');
 assert.ok(telecom);assert.equal(telecom.label,'Telecommunications');assert.equal(telecom.count,14);
 for(const locale of ['pt','en'])for(const query of ['tel','RF','nurse','telecomunications',''])for(const s of templateTagSuggestions({...defaultTemplateFilters,query},locale))assert.equal(s.count,discoverTemplates({...defaultTemplateFilters,query:s.label}).length);
 assert.equal(templateTagSuggestions({...base,area:'saude'},'en').length,0);
 assert.equal(templateTagSuggestions({...base,query:'unknownxyz'},'pt').length,0);
 assert.ok(templateTagSuggestions({...base,query:'IT'},'en').every(s=>s.id==='it-support'));
 assert.ok(!templateTagSuggestions({...base,query:'Telecommunications'},'en').some(s=>s.id==='telecom'));
});
test('empty-state recovery offers real results outside facets while retaining search text',()=>{
 const blocked={area:'saude',style:'Todos',query:'telecom'};
 assert.equal(discoverTemplates(blocked).length,0);assert.equal(resultsOutsideTemplateFilters(blocked),14);
 const recovered={...blocked,area:'all',style:'Todos'};assert.equal(recovered.query,'telecom');assert.equal(discoverTemplates(recovered).length,14);
 assert.equal(resultsOutsideTemplateFilters({...blocked,query:'unknownxyz'}),0);
 assert.equal(resultsOutsideTemplateFilters(defaultTemplateFilters),0);
});
