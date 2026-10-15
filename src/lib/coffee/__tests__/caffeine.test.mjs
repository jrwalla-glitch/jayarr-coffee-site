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

import { intakeMg, dayCurve, dailyTotal, inBodyAt, encodeDay, decodeDay, dayMinute, diaryDayKey, newDayAt, bedMinute } from '../index.ts';

test('a day: totals add up, bedtime level is below the peak, ranges stay ordered', () => {
  const day = [
    { kind: 'brewed', method: 'v60', cupMl: 355, atMin: 7 * 60 },
    { kind: 'espresso', shots: 2, atMin: 10 * 60 },
    { kind: 'brewed', method: 'cold-brew', cupMl: 473, atMin: 15 * 60 },
  ];
  const total = dailyTotal(day);
  const parts = day.map((i) => intakeMg(i).value);
  assert.ok(Math.abs(total.min - parts.reduce((a, p) => a + p.min, 0)) < 1e-9);
  const curve = dayCurve(day, 6 * 60, 26 * 60, 10);
  for (const p of curve) assert.ok(p.min <= p.max + 1e-9);
  const bed = inBodyAt(day, 23 * 60);
  const peak = Math.max(...curve.map((p) => p.max));
  assert.ok(bed.max < peak);
  assert.ok(bed.min > 0);
});

test('decaf scales with the cup and stays tiny', () => {
  const r = intakeMg({ kind: 'decaf', cupMl: 355, atMin: 600 }).value;
  assert.ok(r.max < 15 && r.min > 5);
});

test('a cup bigger than one brewer makes still gets an estimate, with no jump at the brewer\'s limit', () => {
  assert.equal(intakeMg({ kind: 'brewed', method: 'aeropress', cupMl: 473, atMin: 480 }).ok, true);
  // Astra's probe: AeroPress dropped from 148.5–271.7 mg at 264 mL to 127.8–233.8 mg at 265 mL.
  for (const method of ['aeropress', 'v60', 'french-press', 'cold-brew', 'drip-machine', 'moka']) {
    let prev = intakeMg({ kind: 'brewed', method, cupMl: 99, atMin: 480 }).value.max;
    for (let ml = 100; ml <= 1200; ml += 1) {
      const r = intakeMg({ kind: 'brewed', method, cupMl: ml, atMin: 480 }).value;
      assert.ok(r.max > prev, `${method} ${ml} mL`);
      assert.ok(r.max - prev < 2, `${method} jumps at ${ml} mL: ${prev} → ${r.max}`);
      prev = r.max;
    }
  }
});

test('a new diary day starts four hours after bedtime: late drinks stay tonight, early ones are this morning', () => {
  // Default 11 pm bedtime → the new day starts at 3 am.
  assert.equal(newDayAt(), 180);
  assert.equal(dayMinute(30), 1470); assert.equal(dayMinute(60), 1500); assert.equal(dayMinute(23 * 60), 1380);
  assert.equal(dayMinute(1470), 1470);
  // Opus blind review: an early riser's 05:30 coffee was moved to the next morning and read 0 mg all day.
  assert.equal(dayMinute(330), 330);
  const early = [{ kind: 'custom', mg: 100, atMin: dayMinute(330) }];
  assert.ok(inBodyAt(early, 15 * 60).min > 20, 'still in you at 3 pm');
  // A 1 am bedtime moves the line to 5 am: 04:30 is still the night before.
  assert.equal(newDayAt(1500), 300); assert.equal(dayMinute(270, 1500), 1710); assert.equal(dayMinute(330, 1500), 330);
  assert.equal(bedMinute(60), 1500); assert.equal(bedMinute(1500), 1500); assert.equal(bedMinute(22 * 60), 1320);
  // Astra's probe still holds: 100 mg at 00:30, bedtime 01:00 → about 87.5 mg left (illustrative model).
  const day = [{ kind: 'custom', mg: 100, atMin: dayMinute(30, 1500) }];
  const left = inBodyAt(day, 1500);
  assert.ok(Math.abs(left.min - 87.52) < 0.05, String(left.min));
});

test('share links carry no pregnancy setting, and old links\' preg=1 is ignored', () => {
  const q = encodeDay({ intakes: [{ kind: 'espresso', shots: 2, atMin: 600 }], halfLifeH: 8, bedMin: 1380, pregnant: true });
  assert.doesNotMatch(q, /preg/);
  const d = decodeDay('d=esp.2@600&preg=1').value;
  assert.equal('pregnant' in d, false);
  // An older link that wrote a 00:30 drink as minute 30 lands at the end of the day.
  const old = decodeDay('d=esp.1@30&bed=60').value;
  assert.equal(old.intakes[0].atMin, 1470); assert.equal(old.bedMin, 1500);
  assert.equal(decodeDay('d=esp.1@330').value.intakes[0].atMin, 330, 'an early-morning drink in a link stays in the morning');
  assert.equal(decodeDay('d=mg.100@1770&bed=1380').value.intakes[0].atMin, 330, 'Astra: an older 1770 (05:30) link lands in the morning');
  assert.equal(decodeDay('d=esp.1@600&bed=abc').ok, false);
});

test('day state round-trips through the link; junk fails', () => {
  const s = { intakes: [{ kind: 'brewed', method: 'v60', cupMl: 355, atMin: 420 }, { kind: 'espresso', shots: 2, atMin: 630 }, { kind: 'decaf', cupMl: 237, atMin: 1200 }, { kind: 'brewed', method: 'drip-machine', cupMl: 296, bean: 'robusta', atMin: 900 }, { kind: 'custom', mg: 200, atMin: 960 }], halfLifeH: 8, bedMin: 1350 };
  const d = decodeDay(encodeDay(s));
  assert.equal(d.ok, true, JSON.stringify(d));
  // Everything but the half-life round-trips; links never carry it (it can hint at pregnancy).
  assert.deepEqual(d.value, { ...s, halfLifeH: 5 });
  assert.doesNotMatch(encodeDay(s), /hl=/);
  assert.equal(decodeDay('d=esp.1@600&hl=8').value.halfLifeH, 8, 'older links with hl still open');
  for (const q of ['', 'd=', 'd=v60.355', 'd=esp.9@600', 'd=v60.355@600&hl=99', 'd=nope.355@600']) assert.equal(decodeDay(q).ok, false, q);
});

test('a known label amount counts exactly, not as a range', () => {
  const r = intakeMg({ kind: 'custom', mg: 155, atMin: 600 }).value;
  assert.equal(r.min, 155); assert.equal(r.max, 155);
  assert.equal(intakeMg({ kind: 'custom', mg: -1, atMin: 600 }).ok, false);
});

test('the diary key follows the local clock across both daylight-saving nights (Astra: fall-back ended it an hour early)', () => {
  const tz = process.env.TZ;
  try {
    process.env.TZ = 'America/New_York';
    // 11 pm bedtime → new day at 3 am local. Fall back, 2026-11-01.
    assert.equal(diaryDayKey(new Date('2026-11-01T07:30:00Z')), '2026-10-31', '02:30 EST');
    assert.equal(diaryDayKey(new Date('2026-11-01T08:00:00Z')), '2026-11-1', '03:00 EST');
    // Spring forward, 2026-03-08.
    assert.equal(diaryDayKey(new Date('2026-03-08T06:30:00Z')), '2026-3-7', '01:30 EST');
    assert.equal(diaryDayKey(new Date('2026-03-08T07:00:00Z')), '2026-3-8', '03:00 EDT');
    // A 1 am bedtime keeps the night's diary until 5 am.
    assert.equal(diaryDayKey(new Date('2026-10-16T08:30:00Z'), 1500), '2026-10-15', '04:30 EDT');
    assert.equal(diaryDayKey(new Date('2026-10-16T09:00:00Z'), 1500), '2026-10-16', '05:00 EDT');
    process.env.TZ = 'Europe/London';
    assert.equal(diaryDayKey(new Date('2026-10-25T02:30:00Z')), '2026-10-24', 'UK 02:30 GMT');
    assert.equal(diaryDayKey(new Date('2026-10-25T03:00:00Z')), '2026-10-25');
  } finally {
    if (tz === undefined) delete process.env.TZ; else process.env.TZ = tz;
  }
});

test('immersion caffeine leaves out the liquid the grounds keep (Muse: 12 oz cold brew read 225–488 mg)', () => {
  const near = (a, b, eps) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);
  const cb = intakeMg({ kind: 'brewed', method: 'cold-brew', cupMl: 355, atMin: 600 }).value;
  near(cb.min, 153, 3); near(cb.max, 332, 4);
  // French press keeps 2/15 of what dissolved; a V60 (percolation) is unchanged by this rule.
  const fp = intakeMg({ kind: 'brewed', method: 'french-press', cupMl: 355, atMin: 600 }).value;
  const dose = 355 / (15 - 2);
  near(fp.min, dose * 0.009 * 0.75 * (1 - 2 / 15) * 1000, 1e-6);
  const v60 = intakeMg({ kind: 'brewed', method: 'v60', cupMl: 355, atMin: 600 }).value;
  near(v60.min, (355 / (16 - 2)) * 0.009 * 0.75 * 1000, 1e-6);
});

test('AeroPress caffeine counts only the water in the chamber (Astra r3: 264 mL read about 6% high)', () => {
  const near = (a, b, eps) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);
  const r = intakeMg({ kind: 'brewed', method: 'aeropress', cupMl: 264, atMin: 600 }).value;
  near(r.min, 120.091304, 0.01); near(r.max, 219.722609, 0.01);
  const small = intakeMg({ kind: 'brewed', method: 'aeropress', cupMl: 216, atMin: 600 }).value;
  near(small.min, 102.482609, 0.01); near(small.max, 187.505217, 0.01);
});
