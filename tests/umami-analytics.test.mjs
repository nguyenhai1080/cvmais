import assert from 'node:assert/strict';
import test from 'node:test';
import {safeUmamiReferrer, safeUmamiUrl} from '../src/lib/umami-analytics.ts';

test('Umami only receives allowlisted page paths', () => {
  assert.equal(safeUmamiUrl('/modelos/para/estudante'), '/modelos/para/estudante');
  assert.equal(safeUmamiUrl('/criar-cv'), '/criar-cv');
  assert.equal(safeUmamiUrl('/repor-acesso/secret-token'), '/outras-paginas');
});

test('Umami strips unknown query keys and accepts only safe campaign values', () => {
  const url = safeUmamiUrl(
    '/modelos/para/estudante',
    '?utm_source=facebook&utm_medium=social&utm_campaign=obomamigo_nov2026&email=somebody%40example.com&token=secret',
  );
  assert.equal(url, '/modelos/para/estudante?utm_source=facebook&utm_medium=social&utm_campaign=obomamigo_nov2026');
  assert.equal(safeUmamiUrl('/criar-cv', '?utm_campaign=someone%40example.com'), '/criar-cv');
});

test('Umami reduces referrers to origin, never exposing URL parameters', () => {
  assert.equal(safeUmamiReferrer('https://www.google.com/search?q=private'), 'https://www.google.com/');
  assert.equal(safeUmamiReferrer('javascript:alert(1)'), '');
  assert.equal(safeUmamiReferrer(''), '');
});
