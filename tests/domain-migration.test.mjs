import test from 'node:test';
import assert from 'node:assert/strict';
import {publicDomainRedirect} from '../src/lib/domain-migration.ts';
import {SITE_ORIGIN,PREVIOUS_ORIGINS} from '../src/lib/site.ts';
test('public migration uses the official origin and preserves library filters',()=>{
 assert.equal(SITE_ORIGIN,'https://cvmais.co.mz');
 assert.equal(publicDomainRedirect('www.cvmais.co.mz','/criar-cv','?modelo=classico','GET'),`${SITE_ORIGIN}/criar-cv?modelo=classico`);
 for(const origin of PREVIOUS_ORIGINS){const host=new URL(origin).host;
  assert.equal(publicDomainRedirect(host,'/modelos','?q=telecom&area=tecnologia','GET'),`${SITE_ORIGIN}/modelos?q=telecom&area=tecnologia`);
  assert.equal(publicDomainRedirect(host,'/orientacoes/primeiro-cv','','HEAD'),`${SITE_ORIGIN}/orientacoes/primeiro-cv`);
  for(const path of ['/criar-cv','/meus-cvs','/conta','/confirmar-email','/repor-acesso','/mudar-endereco','/api/storage/cvs'])assert.equal(publicDomainRedirect(host,path,'','GET'),null);
  assert.equal(publicDomainRedirect(host,'/','','POST'),null);
 }
 for(const host of ['cvmais.co.mz','cvmais.win.evil.test','evil.test','localhost:3004'])assert.equal(publicDomainRedirect(host,'/','','GET'),null);
});
