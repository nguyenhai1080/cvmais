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
