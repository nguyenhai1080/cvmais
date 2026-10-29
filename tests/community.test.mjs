import {test} from 'node:test';
import assert from 'node:assert/strict';
import {invitation,whatsappInvitationURL,officialChannelURL,WHATSAPP_CHANNEL_URL} from '../src/lib/community.ts';

test('invitations share only the public site, with no preselected recipient or CV data',()=>{
  for(const language of ['pt','en']){
    const url=new URL(whatsappInvitationURL(language));
    assert.equal(url.origin,'https://wa.me');
    assert.equal(url.pathname,'/');
    assert.deepEqual([...url.searchParams.keys()],['text']);
    assert.equal(url.searchParams.get('text'),invitation(language));
    assert.ok(invitation(language).includes('https://cvmais.co.mz'));
  }
  assert.match(invitation('pt'),/Olá/);
  assert.match(invitation('en'),/Hi!/);
});

test('join CTA requires an official channel URL; rejects lookalikes and arbitrary links',()=>{
  assert.equal(officialChannelURL(WHATSAPP_CHANNEL_URL),'https://whatsapp.com/channel/0029VbEAD4VG8l58vnbH4u1t');
  assert.equal(officialChannelURL('https://whatsapp.com/channel/0029VaExampleChannel'),'https://whatsapp.com/channel/0029VaExampleChannel');
  for(const input of ['', 'https://whatsapp.com.evil.test/channel/0029VaExampleChannel','https://user:pass@whatsapp.com/channel/0029VaExampleChannel','http://whatsapp.com/channel/0029VaExampleChannel','https://whatsapp.com/channel/0029VaExampleChannel?redirect=https://example.test','https://whatsapp.com/channel/0029VaExampleChannel#private','https://whatsapp.com:8443/channel/0029VaExampleChannel','https://cvmais.co.mz']) assert.equal(officialChannelURL(input),null);
});
