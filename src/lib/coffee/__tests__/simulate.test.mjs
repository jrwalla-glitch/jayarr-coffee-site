import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRecipe, simulate } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const within = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test('pour-overs: the scale hits every step target on time and the cup ends at the recipe yield', () => {
  for (const method of ['v60', 'chemex', 'kalita', 'drip-machine']) {
    const r = ok(buildRecipe({ method, target: { cupMl: method === 'drip-machine' ? 1000 : 355 } }));
    const sim = simulate(r);
    for (const s of r.steps) if (s.toG !== undefined && s.untilS !== undefined) within(sim.at(s.untilS).scaleG, s.toG, 0.01, `${method} step at ${s.untilS}s`);
    const end = sim.at(sim.durationS);
    within(end.cupG, r.cupMl, r.cupMl * 0.02, `${method} cup at end`);
    assert.ok(end.brewerG < 1, `${method} drained`);
  }
});

test('scale never goes down and the cup never exceeds what was poured', () => {
  const r = ok(buildRecipe({ method: 'v60', target: { cupMl: 300 } })), sim = simulate(r);
  let prev = -1;
  for (let t = 0; t <= sim.durationS; t += 1) {
    const f = sim.at(t);
    assert.ok(f.scaleG >= prev - 1e-9); prev = f.scaleG;
    assert.ok(f.cupG <= f.scaleG + 1e-9);
  }
});

test('French press holds everything until the press, then the cup gets the yield', () => {
  const r = ok(buildRecipe({ method: 'french-press', target: { cupMl: 500 } })), sim = simulate(r);
  assert.equal(sim.at(300).cupG, 0);
  within(sim.at(sim.durationS).cupG, r.cupMl, 0.5, 'press yield');
});

test('AeroPress with a top-up ends at the full cup', () => {
  const r = ok(buildRecipe({ method: 'aeropress', target: { cupMl: 296 }, strength: 'lighter' })), sim = simulate(r);
  within(sim.at(sim.durationS).cupG, r.cupMl, 0.5, 'aeropress cup');
  within(sim.at(sim.durationS).scaleG, r.waterG, 0.5, 'aeropress scale');
});

test('espresso: the scale is the yield, reached at the end of the pull', () => {
  const r = ok(buildRecipe({ method: 'espresso', target: { doseG: 18 } })), sim = simulate(r);
  assert.equal(sim.at(0).cupG, 0);
  within(sim.at(sim.durationS).scaleG, 36, 1e-9, 'yield');
});

test('cold brew ends with the concentrate in the jar, ready to dilute', () => {
  const r = ok(buildRecipe({ method: 'cold-brew', target: { cupMl: 1000 } })), sim = simulate(r);
  within(sim.at(sim.durationS).cupG, r.dilution.waterG, 0.5, 'concentrate');
});
