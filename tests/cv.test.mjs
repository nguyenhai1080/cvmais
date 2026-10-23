import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blank, isModel, readDraft } from '../src/lib/cv.ts';

test('invalid or non-object saved data safely starts a blank draft', () => {
  for (const raw of [null, '', '{bad json', 'null', '123', '[]', '"text"']) {
    assert.deepEqual(readDraft(raw), blank);
  }
});
test('restores supported fields, ignores unexpected properties and rejects invalid field types', () => {
  const draft = readDraft(JSON.stringify({name:'Celina Macamo', model:'moderno', role:23, profile:{text:'bad'}, unknown:'ignored'}));
  assert.equal(draft.name, 'Celina Macamo');
  assert.equal(draft.model, 'moderno');
  assert.equal(draft.role, '');
  assert.equal(draft.profile, '');
  assert.equal(Object.hasOwn(draft, 'unknown'), false);
});
test('saved drafts obey input length limits and model allowlist', () => {
  const draft = readDraft(JSON.stringify({name:'x'.repeat(500), experience:'y'.repeat(5000), model:'unavailable'}));
  assert.equal(draft.name.length, 150);
  assert.equal(draft.experience.length, 4000);
  assert.equal(draft.model, 'classico');
  assert.equal(isModel('criativo'), true);
  assert.equal(isModel(null), false);
});
test('restoring a blank draft returns independent state', () => {
  const draft = readDraft(null);
  draft.name = 'Changed';
  assert.equal(blank.name, '');
  assert.equal(readDraft(null).name, '');
});
