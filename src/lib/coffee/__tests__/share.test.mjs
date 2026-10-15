import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeBrew, decodeBrew, buildRecipe } from '../index.ts';

test('brew state round-trips through the URL', () => {
  const states = [
    { method: 'v60', target: { cupMl: 355 }, strength: 'classic', roast: 'medium', units: 'us' },
    { method: 'espresso', target: { doseG: 18 }, ratio: 2.5, strength: 'classic', roast: 'light', units: 'metric' },
    { method: 'cold-brew', target: { cupMl: 1000 }, strength: 'stronger', roast: 'dark', units: 'us' },
    { method: 'french-press', target: { waterG: 500 }, strength: 'lighter', roast: 'medium', units: 'us' },
    { method: 'v60', target: { cupMl: 355 }, strength: 'classic', roast: 'medium', units: 'us', adjust: 'finer' },
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
