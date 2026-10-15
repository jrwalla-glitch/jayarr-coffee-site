import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chooseMachines, setupBand, fitsCounter, needsGrinder, bandText } from '../machines.ts';

// Fixtures: shapes only, not real specs (the real data is checked separately).
const m = (o) => ({ id: o.id, brand: 'X', name: o.id, models: [], status: 'current', category: 'semi-auto', heating: { system: 'thermoblock' }, milk: { type: 'manual-wand' }, grinder: { builtIn: false }, listPrice: { usd: 400 }, dims: { w: 20, d: 30, h: 30 }, ...o });
const grinders = [{ id: 'hand', name: 'Hand', usd: 100 }, { id: 'elec', name: 'Electric', usd: 300 }];
const fleet = [
  m({ id: 'semi', listPrice: { usd: 400 } }),
  m({ id: 'semi-grinder', category: 'semi-auto-grinder', grinder: { builtIn: true }, listPrice: { usd: 700 } }),
  m({ id: 'super', category: 'super-auto', grinder: { builtIn: true }, milk: { type: 'carafe' }, listPrice: { usd: 900 } }),
  m({ id: 'pod', category: 'capsule', milk: { type: 'none' }, listPrice: { usd: 200 } }),
  m({ id: 'dual', heating: { system: 'dual-boiler', simultaneousBrewSteam: true }, listPrice: { usd: 1600 }, dims: { w: 30, d: 40, h: 40 } }),
  m({ id: 'old', status: 'discontinued', listPrice: { usd: 100 } }),
  m({ id: 'unpriced', listPrice: { usd: null } }),
];

test('the budget band includes a grinder only where the machine needs one', () => {
  assert.deepEqual(setupBand(fleet[0], grinders), { low: 500, high: 700 });
  assert.deepEqual(setupBand(fleet[1], grinders), { low: 700, high: 700 });
  assert.equal(needsGrinder(fleet[3]), false);
  assert.equal(setupBand(fleet[6], grinders), null);
  assert.equal(bandText({ low: 500, high: 1350 }), '$500–$1,350');
});

test('counter space is a hard limit; unknown dimensions never count as fitting', () => {
  assert.equal(fitsCounter(fleet[4], { widthCm: 25 }), false);
  assert.equal(fitsCounter({ ...fleet[0], dims: null }, { widthCm: 25 }), null);
  assert.equal(fitsCounter(fleet[0], {}), true);
});

test('push-button milk drinkers get a super-automatic first; discontinued and unpriced machines never appear', () => {
  const r = chooseMachines(fleet, grinders, { milk: 'most', cups: 3, budget: 1000, effort: 'button' });
  assert.equal(r[0].machine.id, 'super');
  assert.ok(r.every((x) => x.machine.status === 'current' && x.band));
});

test('a hands-on milk-heavy routine with room in the budget prefers brewing and steaming at once', () => {
  const r = chooseMachines(fleet, grinders, { milk: 'most', cups: 5, budget: 2500, effort: 'hands-on' });
  assert.equal(r[0].machine.id, 'dual');
  assert.ok(r.find((x) => x.machine.id === 'semi')?.tradeoffs.some((t) => /one after the other/.test(t)));
});

test('a budget below every band returns nothing rather than a stretch', () => {
  assert.deepEqual(chooseMachines(fleet, grinders, { milk: 'none', cups: 1, budget: 150, effort: 'hands-on' }), []);
});

test('on the real data: recommendations are current, priced and fully described, for every routine', async () => {
  const { readFileSync } = await import('node:fs');
  const data = JSON.parse(readFileSync(new URL('../../../data/machines.json', import.meta.url), 'utf8'));
  for (const milk of ['none', 'some', 'most']) for (const effort of ['button', 'guided', 'hands-on']) for (const budget of [300, 800, 2000, 5000]) {
    const r = chooseMachines(data.machines, data.grinders, { milk, cups: 3, budget, effort });
    for (const x of r) {
      assert.equal(x.machine.status, 'current');
      assert.ok(x.machine.category && x.band && x.band.low <= budget, `${x.machine.id} ${budget}`);
      if (milk !== 'none') assert.ok(x.machine.milk.type, `${x.machine.id} milk`);
    }
  }
  // A narrow counter still finds the Bambino, whose maker-listed width looks like its depth.
  const narrow = chooseMachines(data.machines, data.grinders, { milk: 'some', cups: 1, budget: 700, effort: 'hands-on', widthCm: 20 });
  assert.ok(narrow.some((x) => x.machine.id === 'breville-bambino-bes450'));
});
