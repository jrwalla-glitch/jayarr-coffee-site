import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayWindow, instantInDay, instantNearest, minutesFromMidnight, dayView, migrateV1, placeSharedDay, toDiaryMinutes, bedInstant, pruneLog, dayStartClock, clockOf } from '../diary.ts';
import { inBodyAt } from '../caffeine.ts';

// Run a block in a time zone, then restore it.
function inTZ(tz, fn) { const old = process.env.TZ; try { process.env.TZ = tz; fn(); } finally { if (old === undefined) delete process.env.TZ; else process.env.TZ = old; } }
let n = 0; const id = () => `d${n++}`;
const at = (iso) => new Date(iso).getTime();
const key = (w) => `${w.y}-${w.m + 1}-${w.d}`;

test('the day start never runs backwards inside a repeated hour (Astra: Berlin 02:30 boundary flipped Oct 25 → 24 → 25)', () => inTZ('Europe/Berlin', () => {
  // Bedtime 22:30 → new day at 02:30. On 2026-10-25 clocks go 03:00 CEST → 02:00 CET.
  const start = dayStartClock({ bedMin: 1350, dayStartMin: null });
  assert.equal(start, 150);
  const keys = ['2026-10-25T00:45:00Z', '2026-10-25T01:15:00Z', '2026-10-25T01:45:00Z'].map((t) => key(dayWindow(at(t), start)));
  assert.deepEqual(keys, ['2026-10-25', '2026-10-25', '2026-10-25'], '02:45 CEST, 02:15 CET, 02:45 CET');
  assert.equal(key(dayWindow(at('2026-10-25T00:15:00Z'), start)), '2026-10-24', '02:15 CEST is before the start');
}));

test('New York: both daylight-saving nights move the day exactly once, at the start instant', () => inTZ('America/New_York', () => {
  for (const [startClock, before, after] of [[300, '2026-11-01T09:59:00Z', '2026-11-01T10:00:00Z'], [300, '2026-03-08T08:59:00Z', '2026-03-08T09:00:00Z'], [90, '2026-11-01T05:29:00Z', '2026-11-01T05:30:00Z']]) {
    const a = dayWindow(at(before), startClock), b = dayWindow(at(after), startClock);
    assert.notEqual(key(a), key(b), `${before} → ${after}`);
    // and it never flips back during the repeated hour
    for (let t = at(after); t < at(after) + 3 * 3600e3; t += 60e3) assert.equal(key(dayWindow(t, startClock)), key(b));
  }
}));

test('an early riser and a night owl: clock times land on the right instants', () => inTZ('America/New_York', () => {
  const w = dayWindow(at('2026-10-15T19:00:00Z'), 180); // 3 pm EDT, day starts 3 am
  assert.equal(key(w), '2026-10-15');
  assert.equal(instantInDay(330, w), at('2026-10-15T09:30:00Z'), '05:30 is this morning');
  assert.equal(instantInDay(30, w), at('2026-10-16T04:30:00Z'), '00:30 is after midnight tonight');
  assert.equal(minutesFromMidnight(w, instantInDay(330, w)), 330);
  assert.equal(bedInstant(w, 1500), at('2026-10-16T05:00:00Z'), '1 am bedtime is the next date');
}));

test('elapsed time is real across the fall-back night (a 25-hour day)', () => inTZ('America/New_York', () => {
  const w = dayWindow(at('2026-10-31T16:00:00Z'), 300);
  const drink = at('2026-11-01T04:30:00Z'); // 00:30 EDT Nov 1
  const later = at('2026-11-01T06:30:00Z'); // 01:30 EST, two real hours later
  assert.equal(minutesFromMidnight(w, later) - minutesFromMidnight(w, drink), 120);
}));

test('Astra: an old save from "yesterday\'s" key is migrated, not deleted', () => inTZ('America/New_York', () => {
  const store = migrateV1({ day: '2026-10-14', intakes: [{ kind: 'custom', mg: 100, atMin: 1770 }], halfLifeH: 5, bedMin: 1380, pregnant: false }, id);
  assert.equal(store.drinks.length, 1);
  assert.equal(store.drinks[0].at, at('2026-10-15T09:30:00Z'), 'Oct 15 05:30 EDT');
  const w = dayWindow(at('2026-10-15T09:45:00Z'), dayStartClock(store.settings)); // 05:45 EDT
  const v = dayView(store.drinks, w);
  assert.equal(v.today.length, 1, 'shown today');
  assert.ok(inBodyAt(v.today, minutesFromMidnight(w, at('2026-10-15T19:00:00Z'))).min > 20);
  assert.equal(migrateV1({ day: '2026-10-14', intakes: [], bedMin: 60 }, id).settings.bedMin, 1500);
}));

test('Astra: a tab left open across the boundary keeps yesterday\'s drinks as yesterday\'s', () => inTZ('America/New_York', () => {
  const log = [{ id: 'a', kind: 'custom', mg: 100, at: at('2026-10-15T12:00:00Z') }]; // Oct 15 08:00
  const w2 = dayWindow(at('2026-10-16T09:45:00Z'), 180); // Oct 16 05:45
  log.push({ id: 'b', kind: 'custom', mg: 50, at: instantInDay(330, w2) });
  const v = dayView(log, w2);
  assert.deepEqual(v.today.map((x) => x.id), ['b'], 'only the new drink is today');
  assert.equal(v.today.reduce((t, x) => t + x.mg, 0), 50);
  assert.deepEqual(v.carried.map((x) => x.id), ['a'], 'yesterday\'s still counts in the curve');
  assert.equal(log.find((x) => x.id === 'a').at, at('2026-10-15T12:00:00Z'), 'and keeps its date');
}));

test('changing bedtime regroups the view without rewriting any drink', () => inTZ('America/New_York', () => {
  const log = [{ id: 'a', kind: 'custom', mg: 100, at: at('2026-10-16T08:30:00Z') }]; // 04:30 Oct 16
  const now = at('2026-10-16T08:45:00Z'); // 04:45 EDT
  assert.equal(key(dayWindow(now, dayStartClock({ bedMin: 1380, dayStartMin: null }))), '2026-10-16', '11 pm bedtime: 04:30 is morning');
  assert.equal(key(dayWindow(now, dayStartClock({ bedMin: 1500, dayStartMin: null }))), '2026-10-15', '1 am bedtime: 04:45 is still last night');
  assert.equal(log[0].at, at('2026-10-16T08:30:00Z'));
  assert.equal(dayStartClock({ bedMin: 1500, dayStartMin: 360 }), 360, 'the reader can set the day start');
}));

test('shared days place by clock time; own days share as diary minutes', () => inTZ('America/New_York', () => {
  const w = dayWindow(at('2026-10-15T19:00:00Z'), 180);
  const placed = placeSharedDay([{ kind: 'custom', mg: 100, atMin: 1470 }, { kind: 'custom', mg: 80, atMin: 1770 }, { kind: 'custom', mg: 60, atMin: 480 }], w, id);
  assert.equal(clockOf(placed[0].at), 30); assert.equal(placed[0].at, at('2026-10-16T04:30:00Z'));
  assert.equal(placed[1].at, at('2026-10-15T09:30:00Z'), 'an old 1770 (05:30) link lands in the morning');
  assert.deepEqual(toDiaryMinutes(placed, w), [1470, 330, 480]);
}));

test('the log keeps a week and never drops recent or future drinks', () => {
  const now = Date.UTC(2026, 9, 15, 12);
  const log = [{ id: 'old', at: now - 8 * 86400e3 }, { id: 'week', at: now - 6 * 86400e3 }, { id: 'soon', at: now + 3600e3 }];
  assert.deepEqual(pruneLog(log, now).map((x) => x.id), ['week', 'soon']);
});

test('a typed time means the nearest real moment (Opus r2: 02:30 entered at 05:45 jumped to tonight)', () => inTZ('America/New_York', () => {
  const now = at('2026-10-15T09:45:00Z'); // 05:45 EDT
  assert.equal(instantNearest(150, now), at('2026-10-15T06:30:00Z'), '02:30 this morning');
  const afternoon = at('2026-10-15T19:00:00Z'); // 3 pm
  assert.equal(instantNearest(30, afternoon), at('2026-10-16T04:30:00Z'), '00:30 tonight');
  assert.equal(instantNearest(480, afternoon), at('2026-10-15T12:00:00Z'), '08:00 this morning');
}));

import { applyOp, emptyStore, parseStore } from '../diary.ts';

test('Astra r3: an idle or stale tab can neither overwrite nor resurrect drinks', () => {
  // One shared storage; each "tab" only ever writes edits applied to a fresh read.
  let storage = JSON.stringify(emptyStore());
  const now = Date.UTC(2026, 9, 15, 15);
  const commit = (op) => { storage = JSON.stringify(applyOp(parseStore(storage) ?? emptyStore(), op, now)); };
  commit({ type: 'add', drink: { id: 'a', kind: 'custom', mg: 100, at: now - 3600e3 } }); // tab A
  commit({ type: 'add', drink: { id: 'b', kind: 'custom', mg: 60, at: now - 1800e3 } });  // tab B, loaded before A's add
  assert.deepEqual(parseStore(storage).drinks.map((x) => x.id).sort(), ['a', 'b'], 'A + B both kept (160 mg)');
  commit({ type: 'remove', id: 'a' });                                                      // tab A removes its drink
  commit({ type: 'retime', id: 'a', at: now });                                             // stale tab B retimes it
  assert.deepEqual(parseStore(storage).drinks.map((x) => x.id), ['b'], 'the removed drink stays removed');
  commit({ type: 'settings', patch: { bedMin: 1500 } });
  assert.equal(parseStore(storage).settings.bedMin, 1500);
  assert.deepEqual(parseStore(storage).drinks.map((x) => x.id), ['b'], 'a settings edit leaves drinks alone');
  assert.equal(parseStore('{"v":2,"drinks":[{"id":"x","at":"oops"}]}').drinks.length, 0, 'malformed entries dropped');
  assert.equal(parseStore('not json'), null);
});
