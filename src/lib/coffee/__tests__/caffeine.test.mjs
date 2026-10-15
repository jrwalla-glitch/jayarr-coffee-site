import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CAFFEINE, GUIDANCE, caffeineCurve, caffeineInBody, espressoMg, estimateBrewedMg, buildRecipe } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };

test('a homemade 8 oz pour-over lands in the published range for a cup', () => {
  const recipe = ok(buildRecipe({ method: 'v60', target: { cupMl: 237 } }));
  const mg = ok(estimateBrewedMg(recipe.doseG, 'v60'));
  // Synthesis §15: drip/pour-over 8 oz is 95–120 mg, range 60–180.
  assert.ok(mg.min >= 60 && mg.max <= 230, JSON.stringify(mg));
  assert.ok(mg.min < 120 && mg.max > 95, 'overlaps the typical band');
});

test('robusta reads higher than arabica for the same dose; blend spans both', () => {
  const a = ok(estimateBrewedMg(20, 'v60', 'arabica')), r = ok(estimateBrewedMg(20, 'v60', 'robusta')), b = ok(estimateBrewedMg(20, 'v60', 'blend'));
  assert.ok(r.min > a.max, "robusta range sits above arabica");
  assert.ok(b.min <= a.min && b.max >= r.max * 0.99);
});

test('espresso is counted by shots, about 63 mg each', () => {
  const two = espressoMg(2);
  assert.ok(two.min <= 126 && two.max >= 126);
  assert.equal(estimateBrewedMg(18, 'espresso').ok, false);
});

test('body curve: rises to a peak near 45 minutes, then halves every half-life', () => {
  const intakes = [{ atMin: 0, mg: 100 }];
  const curve = caffeineCurve(intakes, 0, 600, 5);
  const peak = curve.reduce((a, b) => (b.mg > a.mg ? b : a));
  assert.ok(peak.tMin >= 30 && peak.tMin <= 60, `peak at ${peak.tMin}`);
  const at3h = caffeineInBody(intakes, 180), at8h = caffeineInBody(intakes, 480);
  const ratio = at8h / at3h;
  assert.ok(Math.abs(ratio - 0.5) < 0.02, `5 h later ≈ half: ${ratio}`);
  for (let i = curve.indexOf(peak) + 1; i < curve.length; i++) assert.ok(curve[i].mg <= curve[i - 1].mg + 1e-9, 'monotone after the peak');
});

test('intakes add, ignore the future and junk', () => {
  const a = caffeineInBody([{ atMin: 0, mg: 100 }], 300), b = caffeineInBody([{ atMin: 0, mg: 100 }, { atMin: 0, mg: 100 }], 300);
  assert.ok(Math.abs(b - 2 * a) < 1e-9);
  assert.equal(caffeineInBody([{ atMin: 400, mg: 100 }], 300), 0);
  assert.equal(caffeineInBody([{ atMin: 0, mg: NaN }, { atMin: 0, mg: -5 }], 300), 0);
});

test('a slower half-life leaves more at bedtime', () => {
  const day = [{ atMin: 8 * 60, mg: 126 }, { atMin: 15 * 60, mg: 200 }];
  assert.ok(caffeineInBody(day, 23 * 60, 8) > caffeineInBody(day, 23 * 60, 5));
});

test('guidance lines are in the agencies\' own terms', () => {
  const fda = GUIDANCE.find((g) => g.id === 'fda-adult-daily');
  assert.equal(fda.mg, 400);
  assert.ok(!/limit/i.test(fda.wording), 'not called a limit');
  assert.ok(CAFFEINE.VERIFY.length > 0);
});
