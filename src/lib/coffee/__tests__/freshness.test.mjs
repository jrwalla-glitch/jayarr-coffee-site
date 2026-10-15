import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshness, freshnessStages } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };

test('stages tile the timeline with no gaps; peak is 7–21 days', () => {
  for (const use of ['filter', 'espresso']) {
    const st = freshnessStages(use);
    for (let i = 1; i < st.length; i++) assert.equal(st[i].from, st[i - 1].to);
    const peak = st.find((s) => s.id === 'peak');
    assert.equal(peak.from, 7); assert.equal(peak.to, 21);
  }
});

test('days map to the right stage, and espresso rests longer', () => {
  const at = (d, use = 'filter') => ok(freshness({ roastDate: '2026-10-01', today: `2026-10-${String(1 + d).padStart(2, '0')}`, use, storage: 'opened' })).stage.id;
  assert.equal(at(2), 'resting'); assert.equal(at(5), 'opening'); assert.equal(at(10), 'peak'); assert.equal(at(25), 'good');
  assert.equal(at(5, 'espresso'), 'resting');
});

test('peak and use-by dates come from the roast date', () => {
  const r = ok(freshness({ roastDate: '2026-10-01', today: '2026-10-15', use: 'filter', storage: 'sealed-bag' }));
  assert.equal(r.peakFrom, '2026-10-08'); assert.equal(r.peakTo, '2026-10-22'); assert.equal(r.useBy, '2026-10-31');
  assert.equal(r.daysSinceRoast, 14);
});

test('freezer days pause the clock', () => {
  const r = ok(freshness({ roastDate: '2026-06-01', today: '2026-10-15', use: 'filter', storage: 'frozen', frozenOn: '2026-06-10' }));
  assert.equal(r.effectiveDays, 9); assert.equal(r.stage.id, 'peak');
});

test('future, missing and impossible dates fail cleanly', () => {
  assert.equal(freshness({ roastDate: '2026-11-01', today: '2026-10-15', use: 'filter', storage: 'opened' }).ok, false);
  assert.equal(freshness({ roastDate: '', today: '2026-10-15', use: 'filter', storage: 'opened' }).ok, false);
  assert.equal(freshness({ roastDate: '2026-10-01', today: '2026-10-15', use: 'filter', storage: 'frozen', frozenOn: '2026-09-01' }).ok, false);
});
