import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clearPrivateCopies, ERASURE_EVENT } from '../src/lib/local-erasure.ts';

test('local erasure removes only matching private copies, preserves guests and notifies other tabs', () => {
  const data = { 'cvmais-draft-v2': 'guest', 'cvmais-pending:a:one': 'private', 'cvmais-pending:a:two': 'private', 'cvmais-pending:b:one': 'other account' };
  const events = [];
  const storage = new Proxy({}, {
    ownKeys: () => Object.keys(data),
    getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }),
    get: (_, key) => key === 'removeItem' ? value => { delete data[value]; } : key === 'setItem' ? (key, value) => { events.push([key, value]); data[key] = value; } : undefined,
  });
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true });
  try {
    clearPrivateCopies('a', 'one');
    assert.equal(data['cvmais-pending:a:one'], undefined);
    assert.ok(data['cvmais-pending:a:two']);
    clearPrivateCopies('a');
    assert.equal(data['cvmais-pending:a:two'], undefined);
    assert.equal(data['cvmais-draft-v2'], 'guest');
    assert.equal(data['cvmais-pending:b:one'], 'other account');
    assert.equal(data[ERASURE_EVENT], undefined);
    assert.deepEqual(JSON.parse(events[0][1]).cvId, 'one');
    assert.equal(JSON.parse(events[1][1]).cvId, null);
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original); else delete globalThis.localStorage;
  }
});
