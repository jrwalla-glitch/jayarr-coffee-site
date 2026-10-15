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

test('impossible calendar dates are rejected, not rolled over (Astra: 2026-02-31 was day 1)', () => {
  const feb31 = freshness({ roastDate: '2026-02-31', today: '2026-03-04', use: 'filter', storage: 'opened' });
  assert.equal(feb31.ok, false); assert.equal(feb31.errors[0].code, 'impossible-date');
  assert.equal(freshness({ roastDate: '2026-02-29', today: '2026-03-04', use: 'filter', storage: 'opened' }).ok, false, '2026 is not a leap year');
  assert.equal(freshness({ roastDate: '2026-13-01', today: '2026-10-15', use: 'filter', storage: 'opened' }).ok, false);
  assert.equal(freshness({ roastDate: '2026-04-31', today: '2026-10-15', use: 'filter', storage: 'opened' }).ok, false);
  assert.equal(freshness({ roastDate: '2026-10-01', today: '2026-10-32', use: 'filter', storage: 'opened' }).ok, false);
});

test('leap days count, and daylight-saving changes neither add nor lose a day', () => {
  assert.equal(ok(freshness({ roastDate: '2028-02-28', today: '2028-03-01', use: 'filter', storage: 'opened' })).daysSinceRoast, 2);
  assert.equal(ok(freshness({ roastDate: '2028-02-29', today: '2028-03-07', use: 'filter', storage: 'opened' })).daysSinceRoast, 7);
  assert.equal(ok(freshness({ roastDate: '2026-03-07', today: '2026-03-09', use: 'filter', storage: 'opened' })).daysSinceRoast, 2);
  assert.equal(ok(freshness({ roastDate: '2026-10-31', today: '2026-11-02', use: 'filter', storage: 'opened' })).daysSinceRoast, 2);
  assert.equal(ok(freshness({ roastDate: '2026-03-28', today: '2026-03-30', use: 'filter', storage: 'opened' })).daysSinceRoast, 2, 'EU change');
});

test('thawed beans: the clock runs again from the day they came out', () => {
  const r = ok(freshness({ roastDate: '2026-06-01', today: '2026-10-15', use: 'filter', storage: 'frozen', frozenOn: '2026-06-10', thawedOn: '2026-10-05' }));
  assert.equal(r.effectiveDays, 9 + 10);
  assert.equal(freshness({ roastDate: '2026-06-01', today: '2026-10-15', use: 'filter', storage: 'frozen', frozenOn: '2026-06-10', thawedOn: '2026-06-01' }).ok, false);
});

test('verdicts are hedged and every result says the windows are typical', () => {
  for (const use of ['filter', 'espresso']) for (const st of freshnessStages(use)) {
    assert.doesNotMatch(`${st.label} ${st.advice}`, /^Peak$|The best window|by now\. Fine/);
  }
  const r = ok(freshness({ roastDate: '2026-10-01', today: '2026-10-15', use: 'filter', storage: 'sealed-bag' }));
  assert.match(r.uncertainty, /typical windows, not a forecast/);
});

test('the freezer pauses the clock for about a year, not forever (Muse: 3 years frozen read "at its best")', () => {
  const r = ok(freshness({ roastDate: '2023-01-01', today: '2026-10-15', use: 'filter', storage: 'frozen', frozenOn: '2023-01-08' }));
  assert.notEqual(r.stage.id, 'peak'); assert.equal(r.stage.id, 'stale');
  assert.ok(r.notes.some((n) => /year/.test(n)));
  const six = ok(freshness({ roastDate: '2026-04-01', today: '2026-10-15', use: 'filter', storage: 'frozen', frozenOn: '2026-04-08' }));
  assert.equal(six.stage.id, 'peak');
});

test('no zero-width stages (espresso has no "opening up" stage)', () => {
  for (const use of ['filter', 'espresso']) assert.ok(freshnessStages(use).every((st) => st.to > st.from));
  assert.ok(!freshnessStages('espresso').some((st) => st.id === 'opening'));
});
