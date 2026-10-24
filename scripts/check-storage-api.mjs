import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
const base = process.env.TEST_ORIGIN || 'http://localhost:3001';
const suffix = randomUUID();
async function request(path, method = 'GET', body, cookie, origin = base) {
  const response = await fetch(`${base}/api/storage/${path}`, { method,
    headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(method !== 'GET' ? { Origin: origin } : {}), ...(cookie ? { Cookie: cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, value: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0], cache: response.headers.get('cache-control'), rawCookie: response.headers.get('set-cookie') };
}
const password = `Test-${randomUUID()}`;
assert.equal((await request('cvs')).status, 401);
assert.equal((await request('register','POST',{email:`qa-${suffix}@example.test`,password},null,'https://foreign.example')).status, 403);
const a = await request('register','POST',{email:`qa-${suffix}@example.test`,password});
assert.equal(a.status, 201); assert.ok(a.value.recovery); assert.match(a.rawCookie,/HttpOnly/); assert.match(a.rawCookie,/SameSite=Lax/);
const cookie = a.cookie;
assert.equal((await request('cvs','POST',{data:{profile:'x'.repeat(513_000)}},cookie)).status,413);
const b = await request('register','POST',{email:`qa-b-${suffix}@example.test`,password});
assert.equal(b.status, 201);
const cv = await request('cvs','POST',{title:'Validação · CV privado',data:{name:'Pessoa de teste',profile:'Apenas conteúdo fictício para validação.'}},cookie);
assert.equal(cv.status,201);
assert.equal((await request(`cvs/${cv.value.id}`,'GET',undefined,b.cookie)).status,404);
assert.equal((await request(`cvs/${cv.value.id}`,'PUT',{...cv.value,deleted:false},b.cookie)).status,404);
const update = await request(`cvs/${cv.value.id}`,'PUT',{...cv.value,data:{...cv.value.data,role:'Perfil de teste'},deleted:false},cookie);
assert.equal(update.status,200); assert.equal(update.value.revision,2);
assert.equal((await request(`cvs/${cv.value.id}`,'PUT',{...cv.value,deleted:false},cookie)).status,409);
assert.match(update.cache,/no-store/);
// New session represents a second device; original account data remains available.
const second = await request('login','POST',{email:`qa-${suffix}@example.test`,password});
assert.equal(second.status,200);
assert.equal((await request(`cvs/${cv.value.id}`,'GET',undefined,second.cookie)).value.data.role,'Perfil de teste');
const trash = await request(`cvs/${cv.value.id}`,'PUT',{...update.value,deleted:true},cookie); assert.ok(trash.value.deleted);
const restored = await request(`cvs/${cv.value.id}`,'PUT',{...trash.value,deleted:false},cookie); assert.equal(restored.value.deleted,null);
const reset = await request('recover','POST',{email:`qa-${suffix}@example.test`,password:`New-${password}`,recovery:a.value.recovery});
assert.equal(reset.status,200);
assert.equal((await request('cvs','GET',undefined,cookie)).status,401);
assert.equal((await request('cvs','GET',undefined,second.cookie)).status,401);
const login = await request('login','POST',{email:`qa-${suffix}@example.test`,password:`New-${password}`});
assert.equal(login.status,200);
await request('logout','POST',undefined,login.cookie);
assert.equal((await request('cvs','GET',undefined,login.cookie)).status,401);
console.log('PASS: CSRF, private cache, credentials, sessions, ownership, cross-device save, conflicts, trash/restore, recovery and logout.');
