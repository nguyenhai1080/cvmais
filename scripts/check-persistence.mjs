import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
const origin = process.env.TEST_ORIGIN;
if (!origin) throw new Error('Set TEST_ORIGIN explicitly. This creates a small fictional persistence probe.');
const file = 'work/persistence-probe.json';
async function call(path, method, input, cookie) {
  const response = await fetch(`${origin}/api/storage/${path}`, { method, headers: { Origin: origin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: input ? JSON.stringify(input) : undefined });
  assert.ok(response.ok, `Persistence probe request failed: ${response.status}`);
  return { value: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
if (process.argv[2] === 'seed') {
  const credentials = { email: `persistence-${randomUUID()}@example.test`, password: `QA-${randomUUID()}` };
  const account = await call('register', 'POST', credentials);
  const cv = await call('cvs', 'POST', { title: 'Verificação de persistência', data: { name: 'Perfil fictício de validação', profile: 'Conteúdo de teste: confirmar que o CV permanece após actualizar o website.', model: 'primeiro' } }, account.cookie);
  mkdirSync('work', { recursive: true });
  writeFileSync(file, JSON.stringify({ origin, credentials, id: cv.value.id, revision: cv.value.revision }), { mode: 0o600 });
  await call('logout', 'POST', undefined, account.cookie);
  console.log('Fictional persistence probe saved. No credentials printed.');
} else if (process.argv[2] === 'verify') {
  const probe = JSON.parse(readFileSync(file, 'utf8'));
  assert.equal(probe.origin, origin);
  const session = await call('login', 'POST', probe.credentials);
  const cv = await call(`cvs/${probe.id}`, 'GET', undefined, session.cookie);
  assert.equal(cv.value.title, 'Verificação de persistência');
  assert.equal(cv.value.revision, probe.revision);
  assert.equal(cv.value.data.model, 'primeiro');
  assert.match(cv.value.data.profile, /permanece/);
  await call('logout', 'POST', undefined, session.cookie);
  console.log('PASS: account credentials and CV content survived redeployment.');
} else throw new Error('Use seed before and verify after redeployment.');
