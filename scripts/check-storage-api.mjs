import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
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
assert.equal(a.status, 201); assert.equal(Object.hasOwn(a.value,'recovery'),false); assert.match(a.rawCookie,/HttpOnly/); assert.match(a.rawCookie,/SameSite=Lax/);
const cookie = a.cookie;
assert.equal((await request('security')).status,401);
assert.equal((await request('security','GET',undefined,cookie)).value.recoveryEnabled,false);
assert.equal((await request('recovery-code','POST',{password,enabled:true})).status,401);
assert.equal((await request('recovery-code','POST',{password,enabled:true},cookie,'https://foreign.example')).status,403);
assert.equal((await request('recovery-code','POST',{password:'wrong-password',enabled:true},cookie)).status,401);
const optional = await request('recovery-code','POST',{password,enabled:true},cookie);
assert.equal(optional.status,200); assert.match(optional.value.recovery,/^[a-f0-9]{48}$/);
assert.equal((await request('security','GET',undefined,cookie)).value.recoveryEnabled,true);

assert.equal((await request('cvs','POST',{data:{profile:'x'.repeat(513_000)}},cookie)).status,413);
const b = await request('register','POST',{email:`qa-b-${suffix}@example.test`,password});
assert.equal(b.status, 201);
const photo = `data:image/jpeg;base64,${readFileSync(new URL('../public/images/demo-portrait-woman.jpg', import.meta.url)).toString('base64')}`;
const cv = await request('cvs','POST',{title:'Validação · CV privado',data:{cvLanguage:'en',name:'Pessoa de teste',profile:'Apenas conteúdo fictício para validação.',photo}},cookie);
assert.equal(cv.status,201); assert.equal(cv.value.data.cvLanguage,'en');
assert.equal(cv.value.data.photo,photo);
assert.equal((await request(`cvs/${cv.value.id}`,'GET',undefined,b.cookie)).status,404);
assert.equal((await request(`cvs/${cv.value.id}`,'PUT',{...cv.value,deleted:false},b.cookie)).status,404);
const oldClientData = {...cv.value.data,role:'Perfil de teste'};
delete oldClientData.photo;
delete oldClientData.cvLanguage;
const update = await request(`cvs/${cv.value.id}`,'PUT',{...cv.value,data:oldClientData,deleted:false},cookie);
assert.equal(update.status,200); assert.equal(update.value.revision,2);
assert.equal(update.value.data.photo,photo); assert.equal(update.value.data.cvLanguage,'en');
assert.equal((await request(`cvs/${cv.value.id}`,'PUT',{...cv.value,deleted:false},cookie)).status,409);
assert.match(update.cache,/no-store/);
// New session represents a second device; original account data remains available.
const second = await request('login','POST',{email:`qa-${suffix}@example.test`,password});
assert.equal(second.status,200);
assert.equal((await request(`cvs/${cv.value.id}`,'GET',undefined,second.cookie)).value.data.cvLanguage,'en');
assert.equal((await request(`cvs/${cv.value.id}`,'GET',undefined,second.cookie)).value.data.role,'Perfil de teste');
assert.equal((await request(`cvs/${cv.value.id}`,'GET',undefined,second.cookie)).value.data.photo,photo);
const trash = await request(`cvs/${cv.value.id}`,'PUT',{...update.value,deleted:true},cookie); assert.ok(trash.value.deleted);
const restored = await request(`cvs/${cv.value.id}`,'PUT',{...trash.value,deleted:false},cookie); assert.equal(restored.value.deleted,null);
const reset = await request('recover','POST',{email:`qa-${suffix}@example.test`,password:`New-${password}`,recovery:optional.value.recovery});
assert.equal(reset.status,200);
assert.equal((await request('cvs','GET',undefined,cookie)).status,401);
assert.equal((await request('cvs','GET',undefined,second.cookie)).status,401);
const login = await request('login','POST',{email:`qa-${suffix}@example.test`,password:`New-${password}`});
assert.equal(login.status,200);
assert.equal(Object.hasOwn(reset.value,'recovery'),false);
assert.equal((await request('security','GET',undefined,login.cookie)).value.recoveryEnabled,false);
await request('logout','POST',undefined,login.cookie);
assert.equal((await request('cvs','GET',undefined,login.cookie)).status,401);
console.log('PASS: CSRF, private cache, credentials, sessions, ownership, cross-device save, conflicts, trash/restore, recovery and logout.');

// Destructive checks use only newly-created fictional fixtures from this run.
const cEmail = `qa-erase-${suffix}@example.test`;
const c = await request('register','POST',{email:cEmail,password});
assert.equal(c.status,201);
const cCode = await request('recovery-code','POST',{password,enabled:true},c.cookie);
const c2 = await request('login','POST',{email:cEmail,password});
const disposable = await request('cvs','POST',{title:'CV descartável de teste',data:{name:'Exemplo fictício'}},c.cookie);
const id = disposable.value.id;
const erase = (revision, pwd = password, origin = base, session = c.cookie) => request(`cvs/${id}`,'DELETE',{password:pwd,confirmation:disposable.value.title,revision},session,origin);
assert.equal((await erase(1,password,base,null)).status,401);
assert.equal((await erase(1,password,'https://foreign.example')).status,403);
assert.equal((await erase(1,password,base,b.cookie)).status,404);
assert.equal((await erase(1)).status,409);
const inTrash = await request(`cvs/${id}`,'PUT',{...disposable.value,deleted:true},c.cookie);
assert.equal((await erase(inTrash.value.revision,'incorrect-password')).status,401);
assert.equal((await erase(1)).status,409);
assert.equal((await erase(inTrash.value.revision)).status,200);
assert.equal((await request(`cvs/${id}`,'GET',undefined,c.cookie)).status,404);
assert.equal((await request(`cvs/${id}`,'PUT',{...inTrash.value,deleted:false},c2.cookie)).status,404);
await request('cvs','POST',{title:'CV para remoção da conta',data:{name:'Exemplo'}},c.cookie);
const erased = await request('account','DELETE',{password,confirmation:cEmail},c.cookie);
assert.equal(erased.status,200); assert.match(erased.rawCookie,/Max-Age=0/);
assert.equal((await request('cvs','GET',undefined,c2.cookie)).status,401);
assert.equal((await request('login','POST',{email:cEmail,password})).status,401);
assert.equal((await request('recover','POST',{email:cEmail,password,recovery:cCode.value.recovery})).status,401);
assert.equal((await request('cvs','GET',undefined,b.cookie)).status,200);
assert.equal((await request('account','DELETE',{password,confirmation:'wrong@example.test'},b.cookie)).status,400);
assert.equal((await request('account','DELETE',{password:'incorrect-password',confirmation:b.value.user.email},b.cookie)).status,401);
console.log('PASS: permanent erasure guards, password reauthentication, revision protection, revoked sessions and unrelated-account isolation.');

// Clean up only fictional accounts created by this invocation.
const cleanupA = await request('login','POST',{email:a.value.user.email,password:`New-${password}`});
assert.equal((await request('account','DELETE',{password:`New-${password}`,confirmation:a.value.user.email},cleanupA.cookie)).status,200);
assert.equal((await request('account','DELETE',{password,confirmation:b.value.user.email},b.cookie)).status,200);
console.log('PASS: immediate registration, optional code authentication/CSRF guards, reset without forced code and test-fixture cleanup.');
