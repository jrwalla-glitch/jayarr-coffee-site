import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planWater, WATER_RECIPES, nearestRecipe, MG_EPSOM_PER_PPM_GH, MG_BICARB_PER_PPM_KH, CONCENTRATE_G_PER_L } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const near = (a, b, eps, msg = '') => assert.ok(Math.abs(a - b) <= eps, `${msg} ${a} vs ${b}`);

test('the two-bottle concentrates give 1 ppm per mL per litre (chemistry check, within 1%)', () => {
  near(CONCENTRATE_G_PER_L.gh * 1000 / 1000 / MG_EPSOM_PER_PPM_GH, 1, 0.01, 'GH');
  near(CONCENTRATE_G_PER_L.kh * 1000 / 1000 / MG_BICARB_PER_PPM_KH, 1, 0.01, 'KH');
});

test('from distilled, every recipe lands exactly on target', () => {
  for (const r of WATER_RECIPES) {
    const p = ok(planWater({ targetId: r.id, volumeL: 3.785 }));
    near(p.gh, r.gh, 1e-9); near(p.kh, r.kh, 1e-9);
    near(p.ghMlPerL, r.gh, 1e-9); near(p.epsomG, r.gh * MG_EPSOM_PER_PPM_GH * 3.785 / 1000, 1e-12);
  }
});

test('hard tap water is diluted, never overshooting, and the result hits the target within 1 ppm', () => {
  const p = ok(planWater({ targetId: 'rao', volumeL: 1, base: { gh: 180, kh: 150 } }));
  assert.ok(p.baseShare < 1);
  near(p.gh, 76, 1); near(p.kh, 50, 1);
  assert.ok(p.ghMlPerL >= 0 && p.khMlPerL >= 0);
});

test('soft tap water is used whole and topped up', () => {
  const p = ok(planWater({ targetId: 'sca', volumeL: 1, base: { gh: 20, kh: 10 } }));
  assert.equal(p.baseShare, 1);
  near(p.ghMlPerL, 48, 1e-9); near(p.khMlPerL, 30, 1e-9);
});

test('espresso warnings for scale-prone recipes; junk fails', () => {
  const p = ok(planWater({ targetId: 'tww-classic', volumeL: 1, espresso: true }));
  assert.ok(p.notes.some((n) => /scales boilers/.test(n)));
  assert.equal(planWater({ targetId: 'nope', volumeL: 1 }).ok, false);
  assert.equal(planWater({ targetId: 'sca', volumeL: 0 }).ok, false);
  assert.equal(planWater({ targetId: 'sca', volumeL: 1, base: { gh: -1, kh: 0 } }).ok, false);
  assert.equal(nearestRecipe(70, 42).id, 'sca');
});
