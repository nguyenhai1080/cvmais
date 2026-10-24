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
    const nextRecovery = await db.recover('a@example.test', a.recovery, 'new-long-test-password');
    assert.equal(db.user(token), null);
    await assert.rejects(db.login('a@example.test', 'a-long-test-password'), { status: 401 });
    await assert.rejects(db.recover('a@example.test', a.recovery, 'other-long-password'), { status: 401 });
    assert.notEqual(nextRecovery, a.recovery);
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
    const recovery = await db.resetByEmail(reset.token, 'new-long-test-password');
    assert.equal(db.user(session), null); assert.notEqual(recovery, a.recovery);
    await assert.rejects(db.resetByEmail(reset.token, 'another-long-password'), { status:400 });
    assert.equal((await db.login(a.user.email, 'new-long-test-password')).id, a.user.id);
    const expires = db.issueEmailToken(a.user.id, 'reset');
    db.db.prepare('UPDATE email_tokens SET expires=0').run();
    await assert.rejects(db.resetByEmail(expires, 'another-long-password'), { status:400 });
    const beforeRecovery = db.issueEmailToken(a.user.id, 'reset');
    await db.recover(a.user.email, recovery, 'recovered-long-password');
    await assert.rejects(db.resetByEmail(beforeRecovery, 'another-long-password'), { status:400 });
    db.issueEmailToken(a.user.id, 'verify'); db.eraseAccount(a.user.id);
    assert.equal(db.db.prepare('SELECT count(*) AS n FROM email_tokens').get().n, 0);
    assert.equal(db.db.prepare('SELECT count(*) AS n FROM verified_emails').get().n, 0);
  } finally { db.db.close(); rmSync(directory, { recursive: true, force: true }); }
});
