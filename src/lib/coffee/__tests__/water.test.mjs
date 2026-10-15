import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planWater, WATER_RECIPES, nearestRecipe, MG_EPSOM_PER_PPM_GH, MG_BICARB_PER_PPM_KH, CONCENTRATE_G_PER_L, PPM_PER_ML_PER_L } from '../index.ts';

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
