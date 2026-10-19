import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freshness, freshnessStages } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };

test('stages tile the timeline with no gaps; peak is days 7–21 inclusive', () => {
  for (const use of ['filter', 'espresso']) {
    const st = freshnessStages(use);
    for (let i = 1; i < st.length; i++) assert.equal(st[i].from, st[i - 1].to);
    const peak = st.find((s) => s.id === 'peak');
    assert.equal(peak.from, 7); assert.equal(peak.to, 22);
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

test('Muse r4: the window dates shown sit inside their stages; ten calendar years is the limit', () => {
  const on = (today) => ok(freshness({ roastDate: '2026-10-01', today, use: 'filter', storage: 'opened' }));
  const r = on('2026-10-15');
  assert.equal(on(r.peakTo).stage.id, 'peak', 'the last "usually best" day is still peak');
  assert.equal(on(r.useBy).stage.id, 'good', 'the "best used by" day is still good');
  assert.equal(ok(freshness({ roastDate: '2016-10-16', today: '2026-10-15', use: 'filter', storage: 'opened' })).daysSinceRoast, 3651);
  assert.equal(freshness({ roastDate: '2016-10-14', today: '2026-10-15', use: 'filter', storage: 'opened' }).ok, false);
});

test('item 23: filter beans in their first days are very fresh and fine to brew; espresso still rests (Rao 2013, Hoffmann p. 65)', () => {
  const f = freshnessStages('filter').find((s) => s.id === 'resting'), e = freshnessStages('espresso').find((s) => s.id === 'resting');
  assert.equal(f.label, 'Very fresh'); assert.equal(f.to, 4, 'the window itself is unchanged');
  assert.match(f.advice, /^Fine to brew/); assert.match(f.advice, /Rao/); assert.match(f.advice, /Hoffmann/);
  assert.doesNotMatch(f.advice, /unevenly|too fresh/);
  assert.match(e.label, /resting/); assert.match(e.advice, /pushes back against the water/); assert.doesNotMatch(e.advice, /unevenly/);
});

test('item 26: Marin 2008 is a full reference in the source registry', async () => {
  const { SOURCES } = await import('../index.ts');
  const m = SOURCES['marin-2008'];
  assert.match(m.title, /Food Technology and Biotechnology 46, no\. 4: 442–447/);
  assert.match(m.author, /Marin.*Požrl.*Zlatić.*Plestenjak/);
});
