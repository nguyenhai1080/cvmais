import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Store, digest } from '../src/lib/server/store.ts';

test('accounts, credentials, ownership, conflict detection, trash and recovery persist correctly', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'cvmais-test-'));
  const path = join(directory, 'test.sqlite');
  let db = new Store(path);
  try {
    const a = await db.register('a@example.test', 'a-long-test-password');
    a.recovery = await db.configureRecovery(db.session(a.user.id), 'a-long-test-password', true);
    const b = await db.register('b@example.test', 'b-long-test-password');
    assert.equal((await db.login('a@example.test', 'a-long-test-password')).id, a.user.id);
    await assert.rejects(db.login('a@example.test', 'wrong-password'), { status: 401 });
    await assert.rejects(db.login('unknown@example.test', 'wrong-password'), { status: 401 });
    const raw = db.db.prepare('SELECT password,recovery FROM users WHERE id=?').get(a.user.id);
    assert.notEqual(raw.password, 'a-long-test-password');
    assert.equal(raw.recovery, digest(a.recovery));
    const token = db.session(a.user.id);
    assert.equal(db.user(token).id, a.user.id);
    assert.equal(db.db.prepare('SELECT token FROM sessions').get().token, digest(token));
    const cv = db.create(a.user.id, 'CV Administração', { name: 'José', profile: 'Organização e gestão' });
    assert.equal(db.list(b.user.id).length, 0);
    assert.throws(() => db.cv(b.user.id, cv.id), { status: 404 });
    assert.throws(() => db.update(b.user.id, cv.id, 1, 'attack', {}, false), { status: 404 });
    const edited = db.update(a.user.id, cv.id, 1, 'CV revisto', { name: 'José', profile: 'Revisto' }, false);
    assert.equal(edited.revision, 2);
    assert.throws(() => db.update(a.user.id, cv.id, 1, 'stale', {}, false), { status: 409 });
    const trashed = db.update(a.user.id, cv.id, 2, edited.title, edited.data, true);
    assert.ok(trashed.deleted);
    const restored = db.update(a.user.id, cv.id, 3, edited.title, edited.data, false);
    assert.equal(restored.deleted, null);
    db.db.close(); db = new Store(path);
    assert.equal(db.cv(a.user.id, cv.id).data.profile, 'Revisto');
    assert.equal(db.user(token).id, a.user.id);
    await assert.rejects(db.recover('a@example.test', 'wrong-code', 'new-long-test-password'), { status: 401 });
    await db.recover('a@example.test', a.recovery, 'new-long-test-password');
    assert.equal(db.user(token), null);
    await assert.rejects(db.login('a@example.test', 'a-long-test-password'), { status: 401 });
    await assert.rejects(db.recover('a@example.test', a.recovery, 'other-long-password'), { status: 401 });
    assert.equal(db.recoveryEnabled(a.user.id), false);
    assert.equal((await db.login('a@example.test', 'new-long-test-password')).id, a.user.id);
    const newToken = db.session(a.user.id); db.logout(newToken); assert.equal(db.user(newToken), null);
    db.limit('test-limit', 1); assert.throws(() => db.limit('test-limit', 1), { status: 429 });
    db.db.close(); db = new Store(path);
    assert.throws(() => db.limit('test-limit', 1), { status: 429 });
  } finally { db.db.close(); rmSync(directory, { recursive: true, force: true }); }
});

test('permanent erasure requires trash, exact confirmation and current revision; account removal cascades and persists', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'cvmais-erasure-'));
  const path = join(directory, 'test.sqlite');
  let db = new Store(path);
  try {
    const a = await db.register('erase@example.test', 'a-long-test-password');
    a.recovery = await db.configureRecovery(db.session(a.user.id), 'a-long-test-password', true);
    const b = await db.register('keep@example.test', 'b-long-test-password');
    const first = db.create(a.user.id, 'Eliminar este CV', { name: 'Exemplo' });
    const other = db.create(b.user.id, 'Manter', { name: 'Outro exemplo' });
    assert.throws(() => db.eraseCV(b.user.id, first.id, 1, first.title), { status: 404 });
    assert.throws(() => db.eraseCV(a.user.id, first.id, 1, first.title), { status: 409 });
    const trash = db.update(a.user.id, first.id, 1, first.title, first.data, true);
    assert.throws(() => db.eraseCV(a.user.id, first.id, 1, first.title), { status: 409 });
    assert.throws(() => db.eraseCV(a.user.id, first.id, 2, 'incorrecto'), { status: 400 });
    db.eraseCV(a.user.id, first.id, trash.revision, first.title);
    assert.throws(() => db.cv(a.user.id, first.id), { status: 404 });
    const active = db.create(a.user.id, 'Activo', {});
    const deleted = db.create(a.user.id, 'Lixo', {});
    db.update(a.user.id, deleted.id, 1, deleted.title, {}, true);
    const sessions = [db.session(a.user.id), db.session(a.user.id)];
    db.eraseAccount(a.user.id);
    assert.deepEqual(db.list(a.user.id), []);
    sessions.forEach(token => assert.equal(db.user(token), null));
    assert.throws(() => db.cv(a.user.id, active.id), { status: 404 });
    await assert.rejects(db.login(a.user.email, 'a-long-test-password'), { status: 401 });
    await assert.rejects(db.recover(a.user.email, a.recovery, 'another-long-password'), { status: 401 });
    db.db.close(); db = new Store(path);
    assert.equal(db.db.prepare('SELECT count(*) AS n FROM users WHERE id=?').get(a.user.id).n, 0);
    assert.equal(db.cv(b.user.id, other.id).title, 'Manter');
  } finally { db.db.close(); rmSync(directory, { recursive: true, force: true }); }
});

test('email verification/reset links are hashed, expiring, purpose-bound and single-use; recovery revokes prior links', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'cvmais-email-'));
  const db = new Store(join(directory, 'test.sqlite'));
  try {
    const a = await db.register('email@example.test', 'a-long-test-password');
    const session = db.session(a.user.id);
    assert.equal(db.emailVerified(a.user.id), false);
    const verification = db.issueEmailToken(a.user.id, 'verify');
    assert.equal(db.db.prepare('SELECT token FROM email_tokens').get().token, digest(verification));
    assert.throws(() => db.emailToken(verification, 'reset'), { status:400 });
    db.verifyEmail(verification); assert.equal(db.emailVerified(a.user.id), true);
    assert.throws(() => db.verifyEmail(verification), { status:400 });
    const old = db.requestEmailReset(a.user.email);
    assert.equal(db.requestEmailReset('unknown@example.test'), null);
    const reset = db.requestEmailReset(a.user.email);
    await assert.rejects(db.resetByEmail(old.token, 'new-long-test-password'), { status:400 });
    await db.resetByEmail(reset.token, 'new-long-test-password');
    assert.equal(db.user(session), null); assert.equal(db.recoveryEnabled(a.user.id), false);
    await assert.rejects(db.resetByEmail(reset.token, 'another-long-password'), { status:400 });
    assert.equal((await db.login(a.user.email, 'new-long-test-password')).id, a.user.id);
    const expires = db.issueEmailToken(a.user.id, 'reset');
    db.db.prepare('UPDATE email_tokens SET expires=0').run();
    await assert.rejects(db.resetByEmail(expires, 'another-long-password'), { status:400 });
    const recovery = await db.configureRecovery(db.session(a.user.id), 'new-long-test-password', true);
    const beforeRecovery = db.issueEmailToken(a.user.id, 'reset');
    await db.recover(a.user.email, recovery, 'recovered-long-password');
    await assert.rejects(db.resetByEmail(beforeRecovery, 'another-long-password'), { status:400 });
    db.issueEmailToken(a.user.id, 'verify'); db.eraseAccount(a.user.id);
    assert.equal(db.db.prepare('SELECT count(*) AS n FROM email_tokens').get().n, 0);
    assert.equal(db.db.prepare('SELECT count(*) AS n FROM verified_emails').get().n, 0);
  } finally { db.db.close(); rmSync(directory, { recursive: true, force: true }); }
});


test('registration is immediately usable without a recovery code; reset only targets verified email', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'cvmais-optional-code-'));
  const path = join(directory, 'test.sqlite');
  let db = new Store(path);
  try {
    const account = await db.register('optional@example.test', 'a-long-test-password');
    assert.equal(Object.hasOwn(account, 'recovery'), false);
    assert.equal(db.recoveryEnabled(account.user.id), false);
    const session = db.session(account.user.id);
    assert.equal(db.user(session).id, account.user.id);
    const cv = db.create(account.user.id, 'Immediately usable', {name:'Example'});
    assert.equal(db.cv(account.user.id, cv.id).data.name, 'Example');
    assert.equal(db.requestEmailReset(account.user.email), null);
    assert.equal(db.db.prepare("SELECT count(*) AS n FROM email_tokens WHERE purpose='reset'").get().n, 0);
    await assert.rejects(db.recover(account.user.email, '0'.repeat(48), 'another-long-password'), {status:401});
    await assert.rejects(db.configureRecovery(session, 'wrong-password', true), {status:401});
    const first = await db.configureRecovery(session, 'a-long-test-password', true);
    assert.match(first, /^[a-f0-9]{48}$/);
    assert.equal(db.db.prepare('SELECT recovery FROM users WHERE id=?').get(account.user.id).recovery, digest(first));
    const second = await db.configureRecovery(session, 'a-long-test-password', true);
    await assert.rejects(db.recover(account.user.email, first, 'another-long-password'), {status:401});
    db.db.close(); db = new Store(path);
    assert.equal(db.recoveryEnabled(account.user.id), true);
    assert.equal(await db.configureRecovery(session, 'a-long-test-password', false), '');
    await assert.rejects(db.recover(account.user.email, second, 'another-long-password'), {status:401});
    db.verifyEmail(db.issueEmailToken(account.user.id, 'verify'));
    const reset = db.requestEmailReset(account.user.email);
    assert.ok(reset.token);
    await db.configureRecovery(session, 'a-long-test-password', true);
    await db.resetByEmail(reset.token, 'another-long-password');
    assert.equal(db.recoveryEnabled(account.user.id), false);
    assert.equal(db.user(session), null);
    await assert.rejects(db.configureRecovery(session, 'another-long-password', true), {status:401});
    assert.equal(db.cv(account.user.id, cv.id).data.name, 'Example');
  } finally { db.db.close(); rmSync(directory, {recursive:true,force:true}); }
});

test('old recovery hashes remain valid and revoked sessions cannot create recovery codes during password checking', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'cvmais-legacy-code-'));
  const db = new Store(join(directory, 'test.sqlite'));
  try {
    const a = await db.register('legacy@example.test', 'a-long-test-password');
    const legacy = 'a'.repeat(48);
    db.db.prepare('UPDATE users SET recovery=? WHERE id=?').run(digest(legacy), a.user.id);
    const session = db.session(a.user.id);
    const login = db.login.bind(db);
    db.login = async (...args) => { const result = await login(...args); db.logout(session); return result; };
    await assert.rejects(db.configureRecovery(session, 'a-long-test-password', true), {status:401});
    assert.equal(db.db.prepare('SELECT recovery FROM users WHERE id=?').get(a.user.id).recovery, digest(legacy));
    await db.recover(a.user.email, legacy, 'another-long-password');
    assert.equal((await login(a.user.email, 'another-long-password')).id, a.user.id);
    assert.equal(db.recoveryEnabled(a.user.id), false);
  } finally { db.db.close(); rmSync(directory, {recursive:true,force:true}); }
});
