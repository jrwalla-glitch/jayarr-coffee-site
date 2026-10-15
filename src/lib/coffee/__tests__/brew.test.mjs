import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRecipe, METHODS, SOURCES, cToF, fToC, gToOz, ozToG, mlToFlOz, flOzToMl } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('unit conversions round-trip exactly', () => {
  for (const v of [0, 1, 18.5, 355, 1000]) {
    near(fToC(cToF(v)), v); near(ozToG(gToOz(v)), v); near(flOzToMl(mlToFlOz(v)), v);
  }
  near(cToF(96), 204.8); near(cToF(100), 212);
});

test('every method preset is complete, sourced and internally consistent', () => {
  for (const m of METHODS) {
    assert.ok(m.sourceIds.length > 0, m.id);
    for (const id of m.sourceIds) assert.ok(SOURCES[id], `${m.id} cites unknown source ${id}`);
    assert.ok(m.ratio.stronger < m.ratio.classic && m.ratio.classic < m.ratio.lighter, `${m.id} ratio order`);
    assert.ok(m.tempC.min <= m.tempC.default && m.tempC.default <= m.tempC.max, `${m.id} temp`);
    assert.ok(m.grindMicrons.min < m.grindMicrons.max, `${m.id} grind`);
    const times = m.steps.map((s) => s.atS);
    assert.deepEqual(times, [...times].sort((a, b) => a - b), `${m.id} steps in time order`);
  }
});

test('mug target: dose, water and cup balance (V60, 12 oz)', () => {
  const r = ok(buildRecipe({ method: 'v60', target: { cupMl: 355 } }));
  near(r.waterG, r.doseG * 16);
  near(r.cupMl, r.waterG - 2 * r.doseG);
  near(r.cupMl, 355);
  assert.ok(r.doseG > 25 && r.doseG < 26);
});

test('pour steps end exactly at the total water; bloom scales with the coffee', () => {
  for (const id of ['v60', 'chemex', 'kalita', 'french-press', 'cold-brew']) {
    const r = ok(buildRecipe({ method: id, target: { doseG: 30 } }));
    const targets = r.steps.filter((s) => s.toG !== undefined && s.kind !== 'dilute').map((s) => s.toG);
    near(targets.at(-1), r.waterG, 1e-6);
    for (let i = 1; i < targets.length; i++) assert.ok(targets[i] > targets[i - 1], `${id} cumulative pours rise`);
    const bloom = r.steps.find((s) => s.kind === 'bloom');
    if (bloom) assert.ok(bloom.toG / r.doseG >= 2 && bloom.toG / r.doseG <= 3.2, `${id} bloom ${bloom.toG / r.doseG}x dose`);
  }
});

test('strength choice moves the ratio and nothing else about the cup', () => {
  const light = ok(buildRecipe({ method: 'v60', target: { cupMl: 355 }, strength: 'lighter' }));
  const strong = ok(buildRecipe({ method: 'v60', target: { cupMl: 355 }, strength: 'stronger' }));
  near(light.cupMl, 355); near(strong.cupMl, 355);
  assert.ok(strong.doseG > light.doseG);
  assert.ok(strong.strength.tdsPct.min > light.strength.tdsPct.min);
});

test('espresso talks dose and yield, never water; 1:2.5 works', () => {
  const r = ok(buildRecipe({ method: 'espresso', target: { doseG: 18 }, ratio: 2.5 }));
  assert.equal(r.waterG, undefined);
  near(r.yieldG, 45);
  assert.equal(r.steps.find((s) => s.kind === 'pull').toG, 45);
  assert.ok(r.strength.tdsPct.min > 7 && r.strength.tdsPct.max < 10);
  const bad = buildRecipe({ method: 'espresso', target: { waterG: 40 } });
  assert.equal(bad.ok, false); assert.equal(bad.errors[0].code, 'espresso-no-water');
});

test('cold brew: concentrate, then one-to-one dilution to the served volume', () => {
  const r = ok(buildRecipe({ method: 'cold-brew', target: { cupMl: 1000 } }));
  near(r.dilution.servedMl, 1000, 1e-6);
  near(r.dilution.waterG, 500, 1e-6);
  near(r.waterG - 2 * r.doseG, 500, 1e-6);
  assert.ok(/500 g/.test(r.steps.find((s) => s.kind === 'dilute').text));
});

test('AeroPress: a 10 oz lighter cup brews in the chamber and tops up with hot water', () => {
  const r = ok(buildRecipe({ method: 'aeropress', target: { cupMl: 296 }, strength: 'lighter' }));
  const pour = r.steps.find((s) => s.kind === 'pour');
  near(pour.toG, 230);
  const top = r.steps.find((s) => s.kind === 'dilute');
  assert.ok(top, 'bypass step present');
  near(top.toG, r.waterG);
  assert.ok(r.doseG <= 22);
});

test('over capacity fails with a usable patch, never a plausible-looking recipe', () => {
  // A classic-strength 12 oz AeroPress needs about 30 g of coffee: more than one press holds.
  const r = buildRecipe({ method: 'aeropress', target: { cupMl: 355 } });
  assert.equal(r.ok, false); assert.equal(r.errors[0].code, 'over-capacity');
  const patched = ok(buildRecipe({ method: 'aeropress', ...r.errors[0].patch }));
  assert.ok(patched.doseG <= 22);
  const press = buildRecipe({ method: 'french-press', target: { cupMl: 2000 } });
  assert.equal(press.ok, false);
});

test('blank, zero, negative and junk inputs fail cleanly', () => {
  for (const target of [{}, { cupMl: 0 }, { cupMl: -5 }, { doseG: NaN }, { waterG: 'x' }]) {
    const r = buildRecipe({ method: 'v60', target });
    assert.equal(r.ok, false, JSON.stringify(target));
  }
  assert.equal(buildRecipe({ method: 'nope', target: { cupMl: 300 } }).ok, false);
  assert.equal(buildRecipe({ method: 'v60', target: { cupMl: 300 }, ratio: 40 }).ok, false);
});

test('roast moves temperature within the method range and grind within its band', () => {
  const light = ok(buildRecipe({ method: 'v60', target: { cupMl: 300 }, roast: 'light' }));
  const dark = ok(buildRecipe({ method: 'v60', target: { cupMl: 300 }, roast: 'dark' }));
  assert.ok(light.tempC > dark.tempC);
  assert.ok(light.grind.microns.max <= dark.grind.microns.min);
});

test('recipes are deterministic', () => {
  assert.deepEqual(buildRecipe({ method: 'chemex', target: { cupMl: 500 } }), buildRecipe({ method: 'chemex', target: { cupMl: 500 } }));
});

test('absurdly small doses are refused, with a usable minimum (Muse: 0.1 g made a 1.4 ml recipe)', () => {
  for (const method of ['v60', 'french-press', 'espresso', 'moka', 'aeropress']) {
    const r = buildRecipe({ method, target: { doseG: 0.1 } });
    assert.equal(r.ok, false, method); assert.equal(r.errors[0].code, 'too-small');
    assert.equal(buildRecipe({ method, target: r.errors[0].patch.target }).ok, true, `${method} patch builds`);
  }
});

test('small-batch warnings use each brewer\'s own language', () => {
  // Moka has a hard floor at its smallest basket (Muse: 3 g was accepted).
  assert.equal(buildRecipe({ method: 'moka', target: { doseG: 4 } }).errors[0].code, 'too-small');
  const fp = buildRecipe({ method: 'french-press', target: { doseG: 8 } });
  assert.ok(fp.ok); assert.doesNotMatch(fp.warnings.map((w) => w.message).join(' '), /drains/);
});

test('immersion strength uses the water in contact (Opus: cold brew TDS read about 47% high)', () => {
  const near = (a, b, eps) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);
  // French press: TDS = EY × dose ÷ water added.
  const fp = buildRecipe({ method: 'french-press', target: { cupMl: 473 } }).value;
  near(fp.strength.tdsPct.min, (fp.strength.eyPct.min * fp.doseG) / fp.waterG, 1e-9);
  // Cold brew served 1:1: the concentrate's strength, halved.
  const cb = buildRecipe({ method: 'cold-brew', target: { cupMl: 946 } }).value;
  const conc = (cb.strength.eyPct.min * cb.doseG) / cb.waterG;
  near(cb.strength.tdsPct.min, conc / 2, 1e-9);
  // Percolation is unchanged: EY × dose ÷ drink.
  const v = buildRecipe({ method: 'v60', target: { cupMl: 355 } }).value;
  near(v.strength.tdsPct.min, (v.strength.eyPct.min * v.doseG) / v.cupMl, 1e-9);
});

test('a moka or espresso over capacity is offered a dose, not a cup size', () => {
  for (const method of ['moka', 'espresso']) {
    const r = buildRecipe({ method, target: { doseG: 60 } });
    assert.equal(r.ok, false); assert.ok('doseG' in r.errors[0].patch.target, method);
  }
});

test('the espresso recipe is credited as within Rao\'s published ranges, and it is (Espresso Extraction ch. 1)', () => {
  const r = buildRecipe({ method: 'espresso', target: { doseG: 18 } });
  assert.equal(r.ok, true);
  const v = r.value;
  assert.equal(v.by, "a recipe within Scott Rao's published ranges");
  assert.ok(v.doseG >= 14 && v.doseG <= 22);
  assert.ok(v.yieldG / v.doseG >= 1.5 && v.yieldG / v.doseG <= 2.0);
  assert.ok(v.timeS.min >= 25 && v.timeS.max <= 40);
  assert.ok(v.tempC >= 91 && v.tempC <= 95);
});
