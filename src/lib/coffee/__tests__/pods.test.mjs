import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const { pods } = JSON.parse(readFileSync(new URL('../../../data/nespressoPods.json', import.meta.url), 'utf8'));

test('every pod is unique by system and name (Original Colombia is not Vertuo Colombia)', () => {
  const ids = pods.map((p) => `${p.line}:${p.name}`);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(pods.every((p) => p.line === 'original' || p.line === 'vertuo'));
  assert.equal(pods.filter((p) => p.name === 'Colombia').length, 2, 'the known shared name is still present to guard');
});

// "Try also" data: 35 suggestions point to the other system or to pods not in the catalog. The UI
// shows a suggestion only when it exists in the same system; the Pod Finder rebuild (Wave B) redoes
// this data machine-first. Guard that the count only goes down.
test('cross-system or missing "try also" suggestions do not grow', () => {
  const names = new Set(pods.map((p) => `${p.line}:${p.name}`));
  const broken = pods.filter((p) => p.try_also && !names.has(`${p.line}:${p.try_also}`)).length;
  assert.ok(broken <= 35, String(broken));
});
