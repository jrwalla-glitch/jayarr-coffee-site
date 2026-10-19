import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeBrew, decodeBrew, buildRecipe, flOzToMl } from '../index.ts';

test('brew state round-trips through the URL', () => {
  const states = [
    // A US cup is whole fluid ounces (the decoder snaps within half a millilitre), so the state uses the exact 12 oz.
    { method: 'v60', target: { cupMl: flOzToMl(12) }, strength: 'classic', roast: 'medium', units: 'us' },
    { method: 'espresso', target: { doseG: 18 }, strength: 'stronger', roast: 'medium', units: 'us' },
    { method: 'phin', target: { doseG: 14 }, strength: 'classic', roast: 'dark', units: 'us' },
    { method: 'espresso', target: { doseG: 18 }, ratio: 2.5, strength: 'classic', roast: 'light', units: 'metric' },
    { method: 'cold-brew', target: { cupMl: 1000 }, strength: 'stronger', roast: 'dark', units: 'us' },
    { method: 'french-press', target: { waterG: 500 }, strength: 'lighter', roast: 'medium', units: 'us' },
    { method: 'v60', target: { cupMl: flOzToMl(12) }, strength: 'classic', roast: 'medium', units: 'us', adjust: 'finer' },
  ];
  for (const s of states) {
    const d = decodeBrew('?' + encodeBrew(s));
    assert.equal(d.ok, true, JSON.stringify(d));
    assert.deepEqual(d.value, s);
    assert.equal(buildRecipe(d.value).ok, true);
  }
});

test('defaults stay out of the link', () => {
  assert.equal(encodeBrew({ method: 'v60', target: { cupMl: 355 }, strength: 'classic', roast: 'medium', units: 'us' }), 'method=v60&cup=355');
});

test('junk links fail cleanly', () => {
  for (const q of ['', '?method=nope&cup=300', '?method=v60', '?method=v60&cup=abc', '?method=v60&cup=-3', '?method=v60&cup=300&roast=burnt', '?method=v60&cup=300&adjust=sideways']) {
    assert.equal(decodeBrew(q).ok, false, q);
  }
});

test('decimal amounts survive the link (Astra: 350.5 mL saved as 351, 320.5 g water as 321)', () => {
  for (const target of [{ cupMl: 350.5 }, { waterG: 320.5 }, { doseG: 18.5 }]) {
    const d = decodeBrew(encodeBrew({ method: 'v60', target, strength: 'classic', roast: 'medium', units: 'metric' }));
    assert.deepEqual(d.value.target, target);
  }
});

test('A4: espresso links name the shot as its buttons do (shorter, longer); the old keys still open it', () => {
  assert.equal(encodeBrew({ method: 'espresso', target: { doseG: 18 }, strength: 'stronger', roast: 'medium', units: 'us' }), 'method=espresso&dose=18&strength=shorter');
  assert.equal(encodeBrew({ method: 'espresso', target: { doseG: 18 }, strength: 'lighter', roast: 'medium', units: 'us' }), 'method=espresso&dose=18&strength=longer');
  for (const [key, want] of [['shorter', 'stronger'], ['stronger', 'stronger'], ['longer', 'lighter'], ['lighter', 'lighter']]) {
    const d = decodeBrew(`?method=espresso&dose=18&strength=${key}`);
    assert.equal(d.ok, true, key); assert.equal(d.value.strength, want, key);
  }
  // Other brewers keep lighter and stronger; the shot words mean nothing for them.
  assert.equal(encodeBrew({ method: 'drip-machine', target: { cupMl: 415 }, strength: 'stronger', roast: 'medium', units: 'us' }), 'method=drip-machine&cup=415&strength=stronger');
  assert.equal(decodeBrew('?method=v60&cup=355&strength=shorter').ok, false);
});

test('item 38: a US link\'s cup=237 is the 8 oz chip, so the AeroPress top-up agrees (47 g against 46 g before)', () => {
  const top = (q) => { const d = decodeBrew(q); assert.equal(d.ok, true, q); const r = buildRecipe(d.value); return r.value.steps.find((s) => s.kind === 'dilute').text; };
  assert.equal(top('?method=aeropress&cup=237'), top('?method=aeropress&cup=236.6'));
  assert.match(top('?method=aeropress&cup=237'), /46 g/);
  assert.equal(decodeBrew('?method=v60&cup=355').value.target.cupMl, flOzToMl(12));
  assert.equal(decodeBrew('?method=v60&cup=354.9').value.target.cupMl, flOzToMl(12));
  // Not near a whole ounce, or metric: left alone.
  assert.equal(decodeBrew('?method=drip-machine&cup=415').value.target.cupMl, 415);
  assert.equal(decodeBrew('?method=v60&cup=237&units=metric').value.target.cupMl, 237);
  // Espresso's cup is grams out, not fluid ounces.
  assert.equal(decodeBrew('?method=espresso&cup=36').value.target.cupMl, 36);
});
