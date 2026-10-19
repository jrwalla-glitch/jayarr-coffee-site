import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRecipe, METHODS, GUIDE_METHODS, EY_BY_METHOD, SOURCES, cToF, fToC, gToOz, ozToG, mlToFlOz, flOzToMl, diagnose } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test('unit conversions round-trip exactly', () => {
  for (const v of [0, 1, 18.5, 355, 1000]) {
    near(fToC(cToF(v)), v); near(ozToG(gToOz(v)), v); near(flOzToMl(mlToFlOz(v)), v);
  }
  near(cToF(96), 204.8); near(cToF(100), 212);
});

test('every method preset is complete, sourced and internally consistent', () => {
  for (const m of GUIDE_METHODS) {
    assert.ok(m.sourceIds.length > 0, m.id);
    for (const id of m.sourceIds) assert.ok(SOURCES[id], `${m.id} cites unknown source ${id}`);
    // A brewer that sets its own strength (moka, phin) needs no lighter or stronger step; the others need both.
    if (m.fixedRatio) assert.ok(m.ratio.stronger <= m.ratio.classic && m.ratio.classic <= m.ratio.lighter, `${m.id} ratio order`);
    else assert.ok(m.ratio.stronger < m.ratio.classic && m.ratio.classic < m.ratio.lighter, `${m.id} ratio order`);
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

test('moka credit: the steps are Hoffmann\'s, the 1:10 ratio is the Brew Guide\'s estimate (batch 9: Hoffmann prints 200 g/l)', () => {
  const r = buildRecipe({ method: 'moka', target: { doseG: 15 } });
  assert.equal(r.ok, true);
  assert.equal(r.value.by, "James Hoffmann's moka technique, at the Brew Guide's estimated 1:10 ratio");
  assert.equal(METHODS.find((m) => m.id === 'moka').ratio.classic, 10);
  assert.ok(Math.abs(r.value.waterG / r.value.doseG - 10) < 1e-9, `${r.value.waterG} / ${r.value.doseG}`);
  assert.doesNotMatch(r.value.by, /Hoffmann's (moka )?ratio/);
});

test('cold brew steeps in the fridge (Easto; batch 9), and its strength doesn\'t depend on the 20 °C water figure', () => {
  const r = buildRecipe({ method: 'cold-brew', target: { cupMl: 946 } });
  assert.equal(r.ok, true);
  const steep = r.value.steps.find((s) => s.kind === 'steep');
  assert.equal(steep.text, 'Cover and leave it in the fridge for 12 hours.');
  const cold = METHODS.find((m) => m.id === 'cold-brew');
  assert.equal(r.value.tempC, cold.tempC.default);
  // Strength comes from the method's extraction band and the weights alone.
  assert.equal(r.value.strength.eyPct.min, 15); assert.equal(r.value.strength.eyPct.max, 20);
});

test('R11: the extraction-yield ranges no longer credit the Newcastle 2018 study (Wave A follow-ups 2, item 6)', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../methods.ts', import.meta.url), 'utf8');
  const doc = src.slice(src.lastIndexOf('/**', src.indexOf('export const EY_BY_METHOD')), src.indexOf('export const EY_BY_METHOD'));
  assert.match(doc, /synthesis §17/);
  assert.doesNotMatch(src, /Newcastle/);
});

// ── Round 3 follow-ups, group A ──

test('item 29: the phin follows Nguyen Coffee Supply\'s recipe (14 g, 4 oz at 195–200°F, 45 s bloom with 1 oz, last drop about 5:00)', () => {
  const phin = GUIDE_METHODS.find((m) => m.id === 'phin');
  assert.ok(phin && !METHODS.some((m) => m.id === 'phin'), 'phin is a Brew Guide brewer, not one Fix My Coffee or the Caffeine Calculator lists');
  assert.deepEqual(phin.sourceIds, ['nguyen-iced', 'nguyen-phin']);
  const r = ok(buildRecipe({ method: 'phin', target: { doseG: 14 } }));
  near(r.waterG, 118.3, 1e-9); assert.equal(Math.round(mlToFlOz(r.waterG) * 10) / 10, 4);
  near(r.cupMl, 118.3 - 28, 1e-9); // the grounds keep about 2 g per g, as for every brewer
  const f = (c) => Math.round(cToF(c));
  assert.equal(f(phin.tempC.min), 195); assert.equal(f(phin.tempC.max), 200);
  for (const roast of ['light', 'medium', 'dark']) { const t = f(ok(buildRecipe({ method: 'phin', target: { doseG: 14 }, roast })).tempC); assert.ok(t >= 195 && t <= 200, `${roast} ${t}`); }
  const bloom = r.steps.find((s) => s.kind === 'bloom');
  near(bloom.toG, flOzToMl(1), 1e-9); assert.equal(bloom.untilS, 45);
  assert.equal(r.steps.at(-1).atS, 300);
  assert.match(r.steps.find((s) => s.kind === 'drawdown').cue, /first drop falls within about 2:00 and the last around 5:00/);
  assert.match(r.by, /Nguyen Coffee Supply/);
  // The fine grind is Nguyen's; the micron range is borrowed from the moka pot and says so.
  assert.equal(r.grind.label, 'Fine'); assert.equal(r.grind.texture, 'sand'); assert.match(r.grind.note, /our estimate/);
  // No source gives a phin extraction band, so there is no strength estimate.
  assert.equal(EY_BY_METHOD.phin, undefined); assert.equal(r.strength, undefined);
});

test('item 29: the phin\'s strength is the recipe\'s, and a 4 oz phin takes 14 g', () => {
  for (const extra of [{ strength: 'stronger' }, { strength: 'lighter' }, { ratio: 12 }]) assert.equal(ok(buildRecipe({ method: 'phin', target: { doseG: 14 }, ...extra })).ratio, 8.45, JSON.stringify(extra));
  const big = buildRecipe({ method: 'phin', target: { doseG: 20 } });
  assert.equal(big.ok, false); assert.match(big.errors[0].message, /14 g in a 4 oz phin/); assert.deepEqual(big.errors[0].patch, { target: { doseG: 14 } });
  ok(buildRecipe({ method: 'phin', ...big.errors[0].patch }));
  const small = buildRecipe({ method: 'phin', target: { doseG: 10 } });
  assert.match(small.warnings.map((w) => w.message).join(' '), /less than 2 tablespoons \(14 g\) in a 4 oz phin may drip fast/);
  // Fix My Coffee doesn't diagnose a phin yet.
  assert.equal(diagnose({ method: 'phin', symptom: 'sour', answers: { time: 'fast', roast: 'medium', grinder: 'burr' } }).ok, false);
});

test('item 30: a French press at exactly 1,000 g of water builds; over it, the message says "French press"', () => {
  // (1000 / 15) × 15 is a hair over 1,000 in floating point; stronger (1:14) needs 71.4 g, past the 70 g dose limit, so it isn't tested here.
  for (const strength of ['lighter', 'classic']) ok(buildRecipe({ method: 'french-press', target: { waterG: 1000 }, strength }));
  const r = buildRecipe({ method: 'french-press', target: { waterG: 1001 } });
  assert.equal(r.ok, false); assert.match(r.errors[0].message, /a typical French press holds/);
});

test('A5: cold brew opens a full Toddy batch (340 g), says "cold brew" in lower case, and an 8 oz glass gets no "cools quickly"', () => {
  const toddy = ok(buildRecipe({ method: 'cold-brew', target: { doseG: 340 }, ratio: 5.5 }));
  near(toddy.waterG, 1870, 1e-9);
  const big = buildRecipe({ method: 'cold-brew', target: { doseG: 400 } });
  assert.equal(big.ok, false); assert.match(big.errors[0].message, /a full home cold brew batch \(Toddy's home system takes 340 g\)/); assert.doesNotMatch(big.errors[0].message, /Cold brew/);
  ok(buildRecipe({ method: 'cold-brew', ...big.errors[0].patch }));
  const glass = buildRecipe({ method: 'cold-brew', target: { cupMl: flOzToMl(8) } });
  assert.equal(glass.ok, true); assert.ok(glass.value.doseG < 30); assert.doesNotMatch(glass.warnings.map((w) => w.message).join(' '), /cools quickly/);
  assert.doesNotMatch(buildRecipe({ method: 'cold-brew', target: { doseG: 2 } }).errors[0].message, /a Cold brew/);
});

test('item 32: cold brew\'s ratio range is a concentrate\'s, and an out-of-range ratio says so', () => {
  const r = buildRecipe({ method: 'cold-brew', target: { cupMl: 500 }, ratio: 11 });
  assert.equal(r.ok, false); assert.match(r.errors[0].message, /brews it as a concentrate/); assert.equal(r.errors[0].patch.ratio, 6.25);
});

test('A7: a drip machine holds a 12-cup machine\'s 60 fl oz (Breville BDC450), not an unsourced 1,800 g', () => {
  const drip = GUIDE_METHODS.find((m) => m.id === 'drip-machine');
  near(drip.capacity.maxWaterG, flOzToMl(60), 1e-9); assert.ok(drip.sourceIds.includes('breville-bdc450'));
  ok(buildRecipe({ method: 'drip-machine', target: { waterG: flOzToMl(60) } }));
  const r = buildRecipe({ method: 'drip-machine', target: { waterG: 1800 } });
  assert.equal(r.ok, false); assert.match(r.errors[0].message, /12-cup drip machine holds \(60 fl oz/);
  // An 8 oz mug builds, so the drip machine can offer it as a size.
  ok(buildRecipe({ method: 'drip-machine', target: { cupMl: flOzToMl(8) } }));
});

test('item 31: the AeroPress recipe is credited as adapted from Easto\'s Classic AeroPress Method', () => {
  assert.equal(ok(buildRecipe({ method: 'aeropress', target: { doseG: 16 } })).by, "Jessica Easto's Classic AeroPress Method, adapted");
});

test('item 42: espresso temperature follows the ratio (Rao: cooler for lungo, hotter for ristretto); the time stays 25–30 s', () => {
  const t = (strength, roast = 'medium') => ok(buildRecipe({ method: 'espresso', target: { doseG: 18 }, strength, roast })).tempC;
  assert.equal(t('classic'), 93); assert.equal(t('classic', 'light'), 95); assert.equal(t('classic', 'dark'), 91);
  assert.ok(t('lighter') < t('classic') && t('classic') < t('stronger'));
  for (const s of ['lighter', 'classic', 'stronger']) for (const roast of ['light', 'medium', 'dark']) {
    const r = ok(buildRecipe({ method: 'espresso', target: { doseG: 18 }, strength: s, roast }));
    assert.ok(r.tempC >= 91 && r.tempC <= 95, `${s}/${roast} ${r.tempC}`);
    assert.deepEqual(r.timeS, { min: 25, max: 30 });
  }
  const custom = ok(buildRecipe({ method: 'espresso', target: { doseG: 18 }, ratio: 3 })).tempC;
  assert.equal(custom, 91, 'past 1:2.5 stays at the bottom of the range');
});

test('item 27: the extraction bands are labeled the guide\'s estimates in the engine', async () => {
  const { readFile } = await import('node:fs/promises');
  const src = await readFile(new URL('../methods.ts', import.meta.url), 'utf8');
  const doc = src.slice(src.lastIndexOf('/**', src.indexOf('export const EY_BY_METHOD')), src.indexOf('export const EY_BY_METHOD'));
  assert.match(doc, /the guide's own estimates/);
});
