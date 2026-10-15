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
