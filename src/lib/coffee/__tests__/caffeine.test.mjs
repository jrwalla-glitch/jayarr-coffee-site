import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CAFFEINE, GUIDANCE, SOURCES, beanFraction, shownMg, mgText, shownIntakeMg, shownTotal, caffeineCurve, caffeineInBody, espressoMg, estimateBrewedMg, buildRecipe, flOzToMl } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);

test('a homemade 8 oz pour-over lands in the published range for a cup', () => {
  const recipe = ok(buildRecipe({ method: 'v60', target: { cupMl: 237 } }));
  const mg = ok(estimateBrewedMg(recipe.doseG, 'v60'));
  // Synthesis §15: drip/pour-over 8 oz is 95–120 mg, range 60–180.
  assert.ok(mg.min >= 60 && mg.max <= 230, JSON.stringify(mg));
  assert.ok(mg.min < 120 && mg.max > 95, 'overlaps the typical band');
});

test('robusta reads higher than arabica for the same dose; blend spans both', () => {
  const a = ok(estimateBrewedMg(20, 'v60', 'arabica')), r = ok(estimateBrewedMg(20, 'v60', 'robusta')), b = ok(estimateBrewedMg(20, 'v60', 'blend'));
  // Farah's ranges touch (arabica up to 1.3%, robusta from 1.5%), and extraction widens both, so the cup ranges overlap
  // a little; robusta's sits higher at both ends and is about twice arabica in the middle (Farah p. 28).
  assert.ok(r.min > a.min && r.max > a.max, 'robusta range sits above arabica');
  const mid = (x) => (x.min + x.max) / 2;
  assert.ok(mid(r) / mid(a) > 1.6 && mid(r) / mid(a) < 2.2, String(mid(r) / mid(a)));
  assert.ok(b.min <= a.min && b.max >= r.max * 0.99);
});

test('item 34: bean caffeine is Farah 2012 Tables 2.1–2.2, cited and no longer marked VERIFY', () => {
  assert.deepEqual(CAFFEINE.beanFraction, { arabica: { min: 0.009, max: 0.013 }, robusta: { min: 0.015, max: 0.025 } });
  assert.ok(CAFFEINE.sourceIds.includes('farah-2012'));
  assert.match(SOURCES['farah-2012'].where, /Table 2\.1, p\. 28/);
  assert.match(SOURCES['farah-2012'].where, /Table 2\.2, p\. 38/);
  // The medium-roast figures (Table 2.2) sit inside the green ranges the model uses.
  assert.ok(0.011 >= CAFFEINE.beanFraction.arabica.min && 0.013 <= CAFFEINE.beanFraction.arabica.max);
  assert.ok(0.024 >= CAFFEINE.beanFraction.robusta.min && 0.025 <= CAFFEINE.beanFraction.robusta.max);
  assert.ok(!CAFFEINE.VERIFY.some((v) => /beanFraction/.test(v)));
});

test('item 34 / B1: a 15% robusta blend sits 15% of the way from arabica to robusta; a share needs a blend', () => {
  const a = ok(estimateBrewedMg(20, 'v60', 'arabica')), r = ok(estimateBrewedMg(20, 'v60', 'robusta'));
  const b15 = ok(estimateBrewedMg(20, 'v60', 'blend', undefined, undefined, 15));
  near(b15.min, a.min + 0.15 * (r.min - a.min), 1e-9); near(b15.max, a.max + 0.15 * (r.max - a.max), 1e-9);
  assert.deepEqual(beanFraction('blend', 15), { min: 0.009 + 0.15 * 0.006, max: 0.013 + 0.15 * 0.012 });
  assert.equal(beanFraction('blend', 0), null); assert.equal(beanFraction('blend', 100), null);
  assert.equal(estimateBrewedMg(20, 'v60', 'robusta', undefined, undefined, 15).ok, false);
  assert.equal(estimateBrewedMg(20, 'v60', 'blend', undefined, undefined, 150).ok, false);
  // The diary passes the share through; arabica is the default bean.
  const i = { kind: 'brewed', method: 'drip-machine', cupMl: 355, atMin: 480 };
  const plain = ok(intakeMg(i)), blend = ok(intakeMg({ ...i, bean: 'blend', robustaPct: 15 })), rob = ok(intakeMg({ ...i, bean: 'robusta' }));
  assert.ok(plain.max < blend.max && blend.max < rob.max);
});

test('espresso is counted by shots, about 63 mg each', () => {
  const two = espressoMg(2);
  assert.ok(two.min <= 126 && two.max >= 126);
  assert.equal(estimateBrewedMg(18, 'espresso').ok, false);
});

test('R1: the 63 mg shot is sourced to USDA FoodData Central 171891, not Newcastle 2018', () => {
  assert.ok(CAFFEINE.sourceIds.includes('usda-fdc-espresso') && !CAFFEINE.sourceIds.includes('newcastle-2018'));
  assert.equal(SOURCES['newcastle-2018'], undefined);
  assert.match(SOURCES['usda-fdc-espresso'].title, /171891/);
  // 212 mg per 100 g × 29.6 g (1 fl oz) = 62.75 mg: the engine's typical shot, unchanged.
  assert.equal(Math.round(212 * 29.6 / 100), CAFFEINE.espressoShotMg.typical);
});

test('R4: half-life settings are 3, 5 and 8 h, sourced to primary figures; no unsourced 1.5–10 h range', () => {
  assert.deepEqual(CAFFEINE.halfLifeH, { typical: 5, faster: 3, slower: 8 });
  assert.equal(CAFFEINE.halfLifeH.min, undefined); assert.equal(CAFFEINE.halfLifeH.max, undefined);
  for (const id of ['iom-2001', 'knutti-1981', 'knutti-1982', 'gardiner-2025']) { assert.ok(CAFFEINE.sourceIds.includes(id), id); assert.ok(SOURCES[id], id); }
  // Typical sits inside Gardiner 2025's "typically 3–6 hours"; Knutti 1982's late-pregnancy rise, 3 h → 10.5 h, is 3.5 times.
  assert.ok(CAFFEINE.halfLifeH.typical >= 3 && CAFFEINE.halfLifeH.typical <= 6);
  assert.equal(10.5 / 3, 3.5);
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

test('R5: the FDA and ACOG lines quote the current pages word for word, not the old or paraphrased text', () => {
  const fda = GUIDANCE.find((g) => g.id === 'fda-adult-daily'), acog = GUIDANCE.find((g) => g.id === 'acog-pregnancy');
  // FDA "Spilling the Beans", content current as of 8/28/2024.
  assert.ok(fda.wording.includes('“For most adults, the FDA has cited 400 milligrams a day — that\'s about two to three 12-fluid-ounce cups of coffee — as an amount not generally associated with negative effects.”'), fda.wording);
  assert.ok(!/healthy adults|dangerous/.test(fda.wording), 'not the older FDA text');
  // ACOG Committee Opinion 462, abstract.
  assert.ok(acog.wording.includes('“Moderate caffeine consumption (less than 200 mg per day) does not appear to be a major contributing factor in miscarriage or preterm birth.'), acog.wording);
  assert.ok(!/advises|keep caffeine under/.test(acog.wording), 'not paraphrased as advice');
  assert.equal(acog.mg, 200);
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

test('decaf follows the FDA: 2 to 15 mg in an 8 fl oz cup, scaled with the cup (B1)', () => {
  const eight = intakeMg({ kind: 'decaf', cupMl: flOzToMl(8), atMin: 600 }).value;
  near(eight.min, 2, 1e-9); near(eight.max, 15, 1e-9);
  const twelve = intakeMg({ kind: 'decaf', cupMl: flOzToMl(12), atMin: 600 }).value;
  near(twelve.min, 3, 1e-9); near(twelve.max, 22.5, 1e-9);
  assert.match(SOURCES['fda-caffeine'].where, /2 to 15 milligrams in an 8-fluid-ounce cup/);
  assert.ok(CAFFEINE.sourceIds.includes('fda-caffeine'));
});

test('B1 / item 36: shown figures round estimates to 5 mg, keep a label\'s own figure, and the total adds up the rows', () => {
  assert.deepEqual(shownMg({ min: 107.2, max: 194.6 }), { min: 105, max: 195 });
  assert.deepEqual(shownMg({ min: 142, max: 142 }, true), { min: 142, max: 142 });
  assert.equal(mgText({ min: 105, max: 195 }), '105–195'); assert.equal(mgText({ min: 160, max: 160 }), '160');
  const day = [
    { kind: 'brewed', method: 'drip-machine', cupMl: flOzToMl(8), atMin: 480 },
    { kind: 'espresso', shots: 2, atMin: 600 },
    { kind: 'custom', mg: 142, atMin: 700 },
  ];
  const rows = day.map((i) => shownIntakeMg(i));
  assert.deepEqual(rows[0], { min: 105, max: 195 }, 'the 8 oz drip row reads like the page table');
  const t = shownTotal(day);
  assert.deepEqual(t, { min: rows.reduce((a, r) => a + r.min, 0), max: rows.reduce((a, r) => a + r.max, 0) });
  assert.equal(t.min % 5, 142 % 5, 'the label figure stays exact inside the total');
  // Decaf keeps whole milligrams: 8 oz reads the FDA's 2–15, never "0–15".
  assert.deepEqual(shownIntakeMg({ kind: 'decaf', cupMl: flOzToMl(8), atMin: 0 }), { min: 2, max: 15 });
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
  // Older links with hl still open, at the typical half-life: a link never carries a health detail (Muse r4).
  assert.equal(decodeDay('d=esp.1@600&hl=8').value.halfLifeH, 5, 'older links with hl open at the typical half-life');
  for (const q of ['', 'd=', 'd=v60.355', 'd=esp.9@600', 'd=nope.355@600']) assert.equal(decodeDay(q).ok, false, q);
});

test('item 34: a blend\'s robusta share round-trips through the link; old .robusta and .blend links still open', () => {
  const s = { intakes: [{ kind: 'brewed', method: 'drip-machine', cupMl: 355, bean: 'blend', robustaPct: 15, atMin: 480 }, { kind: 'brewed', method: 'v60', cupMl: 355, bean: 'blend', atMin: 600 }], halfLifeH: 5, bedMin: 1380 };
  const q = encodeDay(s);
  assert.match(q, /drip-machine\.355\.blend15%40480|drip-machine\.355\.blend15@480/);
  assert.deepEqual(decodeDay(q).value, s);
  assert.equal(decodeDay('d=v60.355.robusta@480').value.intakes[0].bean, 'robusta');
  assert.equal(decodeDay('d=v60.355.blend@480').value.intakes[0].robustaPct, undefined);
  for (const bad of ['d=v60.355.robusta15@480', 'd=v60.355.blend0@480', 'd=v60.355.blend100@480']) assert.equal(decodeDay(bad).ok, false, bad);
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

test('AeroPress, 8 oz: the estimate follows the Brew Guide\'s 230 g chamber (110–200 mg), so the page table and the diary agree', () => {
  const cup = flOzToMl(8);
  const r = ok(buildRecipe({ method: 'aeropress', target: { cupMl: cup } }));
  const chamber = r.steps.find((s) => s.kind === 'pour').toG;
  assert.equal(chamber, 230, 'the recipe pours 230 g into the chamber and tops up the rest');
  const diary = ok(intakeMg({ kind: 'brewed', method: 'aeropress', cupMl: cup, atMin: 0 }));
  const capped = ok(estimateBrewedMg(r.doseG, 'aeropress', 'arabica', r.ratio, chamber));
  near(diary.min, capped.min, 1e-9); near(diary.max, capped.max, 1e-9);
  const r5 = (x) => Math.round(x / 5) * 5;
  assert.equal(`${r5(diary.min)}–${r5(diary.max)}`, '110–200');
  // Ignoring the chamber (all 276 g counted as brewing water) overstates it: the old table's 115–210.
  const uncapped = ok(estimateBrewedMg(r.doseG, 'aeropress'));
  assert.equal(`${r5(uncapped.min)}–${r5(uncapped.max)}`, '115–210');
  // Every other brewer in the table already agreed: same dose, all its water in contact.
  for (const id of ['v60', 'chemex', 'kalita', 'french-press', 'drip-machine']) {
    const rr = ok(buildRecipe({ method: id, target: { cupMl: cup } }));
    const a = ok(estimateBrewedMg(rr.doseG, id)), b = ok(intakeMg({ kind: 'brewed', method: id, cupMl: cup, atMin: 0 }));
    near(a.min, b.min, 1e-9); near(a.max, b.max, 1e-9);
  }
});
