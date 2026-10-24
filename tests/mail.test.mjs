import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { tokenMessage, sendTokenEmail } from '../src/lib/server/mail.ts';

test('authentication email uses a private single-purpose fragment link and a verified configurable sender', async () => {
  const token = randomBytes(32).toString('hex');
  const verification = tokenMessage('verify', token, 'https://cvmais.example.test');
  const reset = tokenMessage('reset', token, 'https://cvmais.example.test');
  assert.match(verification.text, /confirmar-email#token=/);
  assert.match(reset.text, /repor-acesso#token=/);
  assert.match(reset.text, /30 minutos/);
  assert.throws(() => tokenMessage('verify', 'bad-token', 'https://cvmais.example.test'));
  assert.throws(() => tokenMessage('verify', token, 'http://cvmais.example.test'));
  const keys = ['MAIL_ENABLED','MAIL_FROM','RESEND_API_KEY','APP_ORIGIN'];
  const old = Object.fromEntries(keys.map(key => [key, process.env[key]]));
  const original = globalThis.fetch;
  Object.assign(process.env, { MAIL_ENABLED:'true', MAIL_FROM:'CVMais <sender@example.test>', RESEND_API_KEY:'fictional-test-key', APP_ORIGIN:'https://cvmais.example.test' });
  globalThis.fetch = async (url, init) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(init.redirect, 'error');
    assert.ok(init.headers['Idempotency-Key']);
    const body = JSON.parse(init.body);
    assert.equal(body.from, 'CVMais <sender@example.test>');
    assert.deepEqual(body.to, ['fictional@example.test']);
    assert.equal(body.text, reset.text);
    return Response.json({ id:'fictional-receipt' });
  };
  try { await sendTokenEmail('fictional@example.test', 'reset', token); }
  finally { globalThis.fetch = original; keys.forEach(key => { if (old[key] === undefined) delete process.env[key]; else process.env[key] = old[key]; }); }
});
