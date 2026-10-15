import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { headline, rangeText, settingsFor, groupsFor, grinderById } from '../grinders.ts';

const { grinders } = JSON.parse(readFileSync(new URL('../../../data/grinders.json', import.meta.url), 'utf8'));
const row = (id, key) => grinderById(grinders, id).settings.find((s) => s.key === key);
const say = (id, key) => headline(grinderById(grinders, id), row(id, key));

test('every setting names its source, its provenance and a link', () => {
  for (const g of grinders) for (const s of g.settings) {
    assert.ok(['maker', 'documented-secondary'].includes(s.provenance), `${g.id} ${s.key}`);
    assert.ok(s.url && /^https:\/\//.test(s.url), `${g.id} ${s.key} url`);
  }
});

test('no grinder converts into another grinder\'s numbers: values stay in its own unit and scale', () => {
  for (const g of grinders) for (const s of g.settings) {
    if (g.kind === 'dial') {
      assert.ok(s.min >= g.scale[0] && (s.max ?? s.min) <= g.scale[1], `${g.id} ${s.key} inside ${g.scale}`);
      if (s.start != null) assert.ok(s.start >= s.min && s.start <= s.max, `${g.id} ${s.key} start inside its range`);
    }
    if (g.kind === 'named') for (const c of s.categories) assert.ok(g.categories.includes(c), `${g.id} ${c}`);
    if (g.kind === 'text') assert.ok(s.published, `${g.id} ${s.key} as published`);
  }
});

test('a single setting on a turn-counted grinder reads as full turns, then the remainder, with the unit', () => {
  assert.equal(say('kingrinder-k6', 'pour-over'), 'Start at 1 full turn + 40 clicks');
  assert.equal(say('kingrinder-k6', 'espresso'), 'Start at 40 clicks on the first turn');
});

test('a range inside one turn reads as the full turns, then the span past them', () => {
  assert.equal(say('1zpresso-j-max', 'french-press'), 'Start at 4 full turns, then up to 60 clicks more');
  assert.equal(say('1zpresso-jx-pro', 'espresso'), 'Start 1 full turn in, then 2 to 6 numbers more');
  assert.equal(say('1zpresso-k-ultra', 'french-press'), 'Start between 9 and 10 numbers on the first turn');
});

test('a range across turns names both ends in turns, each with the unit', () => {
  assert.equal(say('1zpresso-jx-pro', 'pour-over'), 'Start between 3 full turns + 2 numbers and 4 full turns + 4 numbers');
});

test('the C2 espresso headline excludes the 0 to 6 clicks Timemore says not to grind at', () => {
  const h = say('timemore-chestnut-c2', 'espresso');
  assert.match(h, /above 6/);
  assert.doesNotMatch(h, /between 6/);
});

test('Capresso pump espresso keeps the maker\'s condition instead of an interval', () => {
  assert.equal(say('capresso-infinity-560', 'espresso-pump'), 'Start at FINE (EXTRA FINE for some pump machines)');
});

test('dials: a maker start, a range, an open top', () => {
  assert.equal(say('breville-smart-grinder-pro-bcg820', 'espresso'), 'Start at 12');
  assert.equal(say('fellow-opus-1', 'aeropress'), 'Start between 2 and 5');
  assert.equal(say('niche-zero', 'french-press'), 'Start at 45 or coarser');
  assert.equal(rangeText(row('niche-zero', 'french-press')), '45 and coarser');
});

test('the Eureka is shown exactly as its source writes it', () => {
  assert.equal(say('eureka-mignon-specialita', 'espresso'), 'As published: 0 to 3.5');
});

test('a source with a V60 row and a generic pour-over row labels them apart', () => {
  for (const id of ['df64-gen2', 'eureka-mignon-specialita']) {
    const labels = settingsFor(grinderById(grinders, id), 'pourover').map((s) => s.label);
    assert.deepEqual(labels.sort(), ['Pour-over (V60)', 'Pour-over (general)']);
  }
});

test('every grinder offers at least one method', () => {
  for (const g of grinders) assert.ok(groupsFor(g).length > 0, g.id);
});

test('turn-counted headlines lead with the count the ruler shows; the turns follow on their own line', async () => {
  const { countHeadline, turnsLine } = await import('../grinders.ts');
  const g = (id) => grinderById(grinders, id);
  assert.equal(countHeadline(g('1zpresso-jx-pro'), row('1zpresso-jx-pro', 'pour-over')), 'Start between 32 and 44 numbers from zero');
  assert.equal(turnsLine(g('1zpresso-jx-pro'), row('1zpresso-jx-pro', 'pour-over')), '3 full turns + 2 numbers to 4 full turns + 4 numbers');
  assert.equal(countHeadline(g('kingrinder-k6'), row('kingrinder-k6', 'pour-over')), 'Start at 100 clicks from zero');
  assert.equal(turnsLine(g('kingrinder-k6'), row('kingrinder-k6', 'pour-over')), '1 full turn + 40 clicks');
  assert.equal(turnsLine(g('1zpresso-j-max'), row('1zpresso-j-max', 'french-press')), '4 full turns, then up to 60 clicks more');
  assert.equal(turnsLine(g('1zpresso-k-ultra'), row('1zpresso-k-ultra', 'french-press')), '9 to 10 numbers on the first turn');
  // Grinders with no published turn size keep their click count and get no turns line.
  assert.equal(turnsLine(g('comandante-c40-mk4-standard'), row('comandante-c40-mk4-standard', 'espresso')), null);
});

test('only the Sculptor 064S has no cautions listed', () => {
  // The Sculptor 064S is the one exception: the research warning found was for the non-S 064.
  assert.deepEqual(grinders.filter((g) => !g.cautions.length).map((g) => g.id), ['timemore-sculptor-064s']);
});

test('links in the site\'s brewer ids land on the same method here', async () => {
  const { groupFromParam } = await import('../grinders.ts');
  assert.equal(groupFromParam('drip-machine'), 'drip');
  assert.equal(groupFromParam('v60'), 'pourover');
  assert.equal(groupFromParam('kalita'), 'pourover');
  assert.equal(groupFromParam('drip'), 'drip');
  assert.equal(groupFromParam('french-press'), 'french-press');
  assert.equal(groupFromParam('turkish'), null);
  assert.equal(groupFromParam(null), null);
});
