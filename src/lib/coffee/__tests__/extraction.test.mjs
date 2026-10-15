import { test } from 'node:test';
import assert from 'node:assert/strict';
import { measuredExtraction } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);

test('Astra\'s acceptance cases: 18 g → 36 g at 10% is 20%; 20 g → 300 g at 1.3% is 19.5%', () => {
  const esp = ok(measuredExtraction({ kind: 'espresso', doseG: 18, liquidG: 36, tdsPct: 10 }));
  near(esp.eyPct, 20); near(esp.dissolvedG, 3.6); assert.equal(esp.zone, 'ideal-ideal');
  const pour = ok(measuredExtraction({ kind: 'percolation', doseG: 20, liquidG: 300, tdsPct: 1.3 }));
  near(pour.eyPct, 19.5); assert.equal(pour.zone, 'ideal-ideal');
});

test('dilution doesn\'t change extraction when weight and TDS are taken at the same point', () => {
  // Cold brew: 100 g coffee, 500 g concentrate at 4% TDS, diluted 1:1 to 1000 g at 2%.
  const conc = ok(measuredExtraction({ kind: 'percolation', doseG: 100, liquidG: 500, tdsPct: 4 }));
  const diluted = ok(measuredExtraction({ kind: 'percolation', doseG: 100, liquidG: 1000, tdsPct: 2 }));
  near(conc.eyPct, diluted.eyPct); near(conc.dissolvedG, 20);
});

test('zones follow the numbers: weak and under, strong and over', () => {
  assert.equal(ok(measuredExtraction({ kind: 'percolation', doseG: 20, liquidG: 320, tdsPct: 1.0 })).zone, 'under-weak');
  assert.equal(ok(measuredExtraction({ kind: 'percolation', doseG: 20, liquidG: 300, tdsPct: 1.6 })).zone, 'over-strong');
  const imm = ok(measuredExtraction({ kind: 'immersion', doseG: 30, liquidG: 500, tdsPct: 1.25 }));
  near(imm.eyPct, 500 * 1.25 / 30); assert.ok(imm.notes.some((n) => /water you added/.test(n)));
});

test('junk and impossible readings fail with a reason', () => {
  for (const bad of [{ doseG: 0 }, { liquidG: -1 }, { tdsPct: 0 }, { tdsPct: 30 }, { kind: 'drip' }]) {
    assert.equal(measuredExtraction({ kind: 'percolation', doseG: 20, liquidG: 300, tdsPct: 1.3, ...bad }).ok, false, JSON.stringify(bad));
  }
  const r = measuredExtraction({ kind: 'percolation', doseG: 10, liquidG: 300, tdsPct: 1.5 });
  assert.equal(r.ok, false); assert.equal(r.errors[0].code, 'implausible');
});

test('immersion: a diluted reading is refused with the right method (Opus: the old note gave 12–15% for an 18% cold brew)', () => {
  const r = measuredExtraction({ kind: 'immersion', doseG: 100, liquidG: 600, tdsPct: 1.5, diluted: true });
  assert.equal(r.ok, false); assert.equal(r.errors[0].code, 'immersion-diluted');
  near(ok(measuredExtraction({ kind: 'immersion', doseG: 100, liquidG: 600, tdsPct: 3 })).eyPct, 18);
});

test('a deliberately diluted americano is judged on extraction only, not called too dilute', () => {
  const r = ok(measuredExtraction({ kind: 'espresso', doseG: 18, liquidG: 200, tdsPct: 1.8, diluted: true }));
  near(r.eyPct, 20); assert.equal(r.zone, 'ideal-ideal'); assert.equal(r.strengthJudged, false); assert.deepEqual(r.moves, []);
});

test('next moves fit the brewer: immersion never gets bed or clogging advice', () => {
  const r = ok(measuredExtraction({ kind: 'immersion', doseG: 100, liquidG: 600, tdsPct: 2.5 }));
  assert.ok(r.moves.join(' ').match(/steep longer/)); assert.doesNotMatch(r.moves.join(' '), /bed|clog|coarser/);
});

test('a drink lighter than its coffee is flagged and gets no moves', () => {
  const r = ok(measuredExtraction({ kind: 'percolation', doseG: 20, liquidG: 15, tdsPct: 1.3 }));
  assert.ok(r.notes.some((n) => /Check the weights/.test(n))); assert.deepEqual(r.moves, []);
});

test('a filter-level reading on an espresso gets no moves (Opus r2: 2.6% EY suggested grinding finer)', () => {
  const r = ok(measuredExtraction({ kind: 'espresso', doseG: 18, liquidG: 36, tdsPct: 1.3 }));
  assert.deepEqual(r.moves, []); assert.ok(r.notes.some((n) => /unusually low/.test(n)));
});

test('a drink lighter than twice its coffee is not placed on the map (Muse r3)', () => {
  assert.equal(ok(measuredExtraction({ kind: 'percolation', doseG: 20, liquidG: 15, tdsPct: 1.3 })).placeable, false);
  assert.equal(ok(measuredExtraction({ kind: 'percolation', doseG: 20, liquidG: 300, tdsPct: 1.3 })).placeable, true);
  assert.equal(ok(measuredExtraction({ kind: 'espresso', doseG: 18, liquidG: 36, tdsPct: 10 })).placeable, true);
});
