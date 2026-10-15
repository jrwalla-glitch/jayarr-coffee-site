import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planWater, WATER_RECIPES, nearestRecipe, recipeNumbers, MG_EPSOM_PER_PPM_GH, MG_BICARB_PER_PPM_KH, CONCENTRATE_G_PER_L, PPM_PER_ML_PER_L } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const near = (a, b, eps, msg = '') => assert.ok(Math.abs(a - b) <= eps, `${msg} ${a} vs ${b}`);
// Independent mass balance: minerals from each ingredient over the final volume.
const balance = (p, base = { gh: 0, kh: 0 }) => ({
  vol: p.baseL + p.distilledL + (p.ghStockMl + p.khStockMl) / 1000,
  gh: (p.baseL * base.gh + (p.ghStockMl / 1000) * (CONCENTRATE_G_PER_L.gh * 1000 / MG_EPSOM_PER_PPM_GH)) / p.finalL,
  kh: (p.baseL * base.kh + (p.khStockMl / 1000) * (CONCENTRATE_G_PER_L.kh * 1000 / MG_BICARB_PER_PPM_KH)) / p.finalL,
});

test('stocks are about 1 ppm per mL per litre, from the salts\' molar masses', () => {
  near(PPM_PER_ML_PER_L.gh, 1, 0.01); near(PPM_PER_ML_PER_L.kh, 1, 0.01);
});

test('Barista Hustle #4 for 1 L: 80 mL A + 40 mL B + 880 mL distilled, and it balances', () => {
  const p = ok(planWater({ targetId: 'bh4', volumeL: 1 }));
  near(p.ghStockMl, 80, 0.5); near(p.khStockMl, 40, 0.1); near(p.distilledL * 1000, 880, 0.5);
  const b = balance(p); near(b.vol, 1, 1e-9); near(b.gh, 80, 1e-6); near(b.kh, 40, 1e-6);
});

test('every recipe, every batch size: the jug ends at the final line and on target (distilled start)', () => {
  for (const r of WATER_RECIPES) for (const V of [1, 2, 3.785, 10]) {
    const p = ok(planWater({ targetId: r.id, volumeL: V }));
    const b = balance(p);
    near(b.vol, V, 1e-9, `${r.id} ${V} L volume`); near(b.gh, r.gh, 1e-6, r.id); near(b.kh, r.kh, 1e-6, r.id);
    assert.ok(p.distilledL >= 0);
  }
});

test('soft tap water (GH 20 / KH 10) to SCA 68/40 in 1 L: balances to the final line exactly', () => {
  const base = { gh: 20, kh: 10 };
  const p = ok(planWater({ targetId: 'sca', volumeL: 1, base }));
  assert.ok(p.baseL < 1, 'room is left for the stocks');
  const b = balance(p, base); near(b.vol, 1, 1e-9); near(b.gh, 68, 1e-6); near(b.kh, 40, 1e-6);
});

test('hard tap water is diluted without overshooting either target', () => {
  const base = { gh: 180, kh: 150 };
  const p = ok(planWater({ targetId: 'rao', volumeL: 1, base }));
  const b = balance(p, base); near(b.vol, 1, 1e-9); near(b.gh, 76, 1e-6); near(b.kh, 50, 1e-6);
  assert.ok(p.ghStockMl >= 0 && p.khStockMl >= 0 && p.distilledL >= 0);
  assert.ok(p.notes.some((n) => /harder and more alkaline than this recipe/.test(n)));
});

test('soft water needs no dilution note: the jug is your water plus stocks', () => {
  const p = ok(planWater({ targetId: 'sca', volumeL: 1, base: { gh: 20, kh: 10 } }));
  assert.equal(p.notes.length, 0);
  near(p.distilledL, 0, 1e-9);
});

test('no boiler-safety verdicts; espresso gets the maker-spec note; junk fails', () => {
  assert.ok(WATER_RECIPES.every((r) => !('espressoSafe' in r)));
  const p = ok(planWater({ targetId: 'tww-classic', volumeL: 1, espresso: true }));
  assert.ok(p.notes.some((n) => /maker's water specification/.test(n)));
  assert.equal(planWater({ targetId: 'nope', volumeL: 1 }).ok, false);
  assert.equal(planWater({ targetId: 'sca', volumeL: 0 }).ok, false);
  assert.equal(planWater({ targetId: 'sca', volumeL: 1, base: { gh: -1, kh: 0 } }).ok, false);
  assert.equal(nearestRecipe(70, 42).id, 'sca');
});

// Dry route checked by its own mass balance: salts' minerals plus your water's, over the final volume.
const dryBalance = (p, base = { gh: 0, kh: 0 }) => ({
  vol: p.dry.baseL + p.dry.distilledL,
  gh: (p.dry.baseL * base.gh + (p.dry.epsomG * 1000) / MG_EPSOM_PER_PPM_GH) / p.finalL,
  kh: (p.dry.baseL * base.kh + (p.dry.bicarbG * 1000) / MG_BICARB_PER_PPM_KH) / p.finalL,
});

test('the dry-salt route is its own recipe and hits the target (Astra: GH 67/KH 0 source overshot to 70.9/40)', () => {
  for (const base of [undefined, { gh: 67, kh: 0 }, { gh: 20, kh: 10 }, { gh: 180, kh: 150 }]) for (const r of WATER_RECIPES) for (const V of [1, 3.785, 10]) {
    const p = ok(planWater({ targetId: r.id, volumeL: V, ...(base ? { base } : {}) }));
    const b = dryBalance(p, base);
    near(b.vol, V, 1e-9, `${r.id} ${V}`); near(b.gh, r.gh, 1e-6, `${r.id} ${JSON.stringify(base)} GH`); near(b.kh, r.kh, 1e-6, `${r.id} KH`);
  }
});

test('dry salts too small to weigh are flagged, with the batch that would make them weighable', () => {
  // 1 ppm of hardness short in 1 L is 2.5 mg of Epsom salt: unweighable at any batch this tool makes.
  const p = ok(planWater({ targetId: 'sca', volumeL: 1, base: { gh: 67, kh: 0 } }));
  assert.equal(p.dry.weighable, false); assert.ok(p.dry.minBatchL > 40);
  // SCA from distilled: 0.07 g baking soda per litre, so about 3 L is the smallest weighable batch.
  const d1 = ok(planWater({ targetId: 'sca', volumeL: 1 }));
  assert.equal(d1.dry.weighable, false); near(d1.dry.minBatchL, 2.98, 0.01);
  assert.equal(ok(planWater({ targetId: 'sca', volumeL: 3 })).dry.weighable, true);
});

test('Muse r4: very hard source water is still used, continuously, never silently dropped', () => {
  const at = (gh, kh) => { const r = planWater({ targetId: 'sca', volumeL: 1, base: { gh, kh } }); assert.equal(r.ok, true); return r.value; };
  const a = at(500, 497), b = at(500, 498), c = at(500, 600);
  assert.ok(Math.abs(a.baseL - b.baseL) < 0.002, `${a.baseL} vs ${b.baseL}`);
  for (const v of [a, b, c]) { assert.ok(v.baseL > 0); assert.ok(Math.abs(v.gh - 68) < 1e-6 && Math.abs(v.kh - 40) < 1e-6); assert.ok(Math.abs(v.baseL + v.distilledL + (v.ghStockMl + v.khStockMl) / 1000 - 1) < 1e-9); }
});

test('R7: Third Wave Water GH is labeled the Builder\'s estimate, and Holy Water as untraced, wherever the numbers show', () => {
  const tww = WATER_RECIPES.filter((r) => r.id.startsWith('tww-'));
  assert.equal(tww.length, 2);
  for (const r of tww) {
    assert.equal(r.ghEstimated, true, r.id);
    assert.match(r.provenance, /Builder's estimate, not a maker figure/);
    assert.match(recipeNumbers(r), new RegExp(`^GH ${r.gh} \\(the Builder's estimate\\) · KH ${r.kh}$`));
  }
  const holy = WATER_RECIPES.find((r) => r.id === 'holy');
  assert.equal(holy.untraced, true);
  assert.match(holy.provenance, /couldn't trace Holy Water to a published original/);
  assert.match(recipeNumbers(holy), /original not traced/);
  // Every other recipe is labeled with its plain numbers.
  for (const r of WATER_RECIPES.filter((x) => !x.ghEstimated && !x.untraced)) { assert.equal(recipeNumbers(r), `GH ${r.gh} · KH ${r.kh}`); assert.equal(r.provenance, undefined); }
});
