import { test } from 'node:test';
import assert from 'node:assert/strict';
import { blank, emptyCV, isModel, readDraft, canExport, pdfFilename, MAX_ENTRIES, usesSidebar, normalisePhoto } from '../src/lib/cv.ts';
import { readFileSync } from 'node:fs';

test('prepared JPEG portraits survive draft migration and unsafe photo sources are rejected', () => {
  const jpeg = `data:image/jpeg;base64,${readFileSync(new URL('../public/images/demo-portrait-woman.jpg', import.meta.url)).toString('base64')}`;
  assert.equal(normalisePhoto(jpeg), jpeg);
  assert.equal(readDraft(JSON.stringify({name:'Celina',photo:jpeg})).photo, jpeg);
  assert.equal(readDraft(JSON.stringify({name:'Celina'})).photo, '');
  for (const value of ['https://external.test/photo.jpg','file:///secret.jpg','data:image/svg+xml,<svg/>','data:image/jpeg;base64,AAAA','data:image/jpeg;base64,/9j/'+'A'.repeat(170000),null]) assert.equal(normalisePhoto(value),'');
});

test('long text and many line breaks cannot overflow a fixed sidebar', () => {
  assert.equal(usesSidebar({ ...emptyCV(), model: 'classico', skills: 'Organização\nExcel' }), true);
  assert.equal(usesSidebar({ ...emptyCV(), model: 'classico', skills: '\n'.repeat(50) }), false);
  assert.equal(usesSidebar({ ...emptyCV(), model: 'criativo', languages: 'x'.repeat(4000) }), false);
  assert.equal(usesSidebar({ ...emptyCV(), model: 'minimalista' }), false);
});

test('invalid saved data safely starts a blank draft', () => {
  for (const raw of [null, '', '{bad json', 'null', '123', '[]', '"text"']) assert.deepEqual(readDraft(raw), blank);
});
test('restores supported text fields and ignores unsupported properties and types', () => {
  const draft = readDraft(JSON.stringify({ name: 'Celina Macamo', model: 'moderno', role: 23, profile: {}, unknown: 'ignored' }));
  assert.equal(draft.name, 'Celina Macamo');
  assert.equal(draft.model, 'moderno');
  assert.equal(draft.role, '');
  assert.equal(draft.profile, '');
  assert.equal(Object.hasOwn(draft, 'unknown'), false);
});
test('migrates the original session draft without losing experience or education', () => {
  const draft = readDraft(JSON.stringify({ experience: 'Apoio à equipa de operações.', education: 'Licenciatura em Gestão', skills: 'Excel' }));
  assert.equal(draft.experiences[0].description, 'Apoio à equipa de operações.');
  assert.equal(draft.education[0].description, 'Licenciatura em Gestão');
  assert.equal(draft.skills, 'Excel');
});
test('entry fields and counts have bounded lengths and unique stable restored ids', () => {
  const entries = Array.from({ length: 20 }, () => ({ id: 'duplicate', title: 'x'.repeat(500), description: 'y'.repeat(6000), period: 23 }));
  const draft = readDraft(JSON.stringify({ experiences: entries, name: 'x'.repeat(500), model: 'invalid' }));
  assert.equal(draft.experiences.length, MAX_ENTRIES);
  assert.equal(new Set(draft.experiences.map(e => e.id)).size, MAX_ENTRIES);
  assert.equal(draft.experiences[0].title.length, 150);
  assert.equal(draft.experiences[0].description.length, 4000);
  assert.equal(draft.experiences[0].period, '');
  assert.equal(draft.name.length, 150);
  assert.equal(draft.model, 'classico');
  assert.equal(isModel('criativo'), true);
  assert.equal(isModel(null), false);
});
test('empty CV data does not share mutable arrays across editors', () => {
  const draft = readDraft(null);
  draft.name = 'Changed';
  draft.experiences.push({ id: '1', title: '', organisation: '', period: '', description: '' });
  assert.equal(blank.name, '');
  assert.equal(emptyCV().experiences.length, 0);
});
test('PDF requires a real name and a non-empty content section', () => {
  const draft = emptyCV();
  assert.equal(canExport(draft), false);
  draft.name = '  Celina  ';
  draft.phone = '+258 84 000 0000';
  draft.experiences = [{ id: '1', title: ' ', organisation: '', period: '', description: '' }];
  assert.equal(canExport(draft), false);
  draft.experiences[0].title = 'Estágio';
  assert.equal(canExport(draft), true);
});
test('PDF filenames are safe and preserve a useful accent-free name', () => {
  assert.equal(pdfFilename('João José Mucavele'), 'CV-joao-jose-mucavele.pdf');
  assert.equal(pdfFilename('../../Ana\r\nSet-Cookie: a=b'), 'CV-ana-set-cookie-a-b.pdf');
  assert.equal(pdfFilename(''), 'CV-curriculo.pdf');
});
