import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SYMPTOMS, METHODS, nextQuestion, questionsFor, diagnose, placeOnMap, ZONES, buildRecipe, familyOf } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };

function walk(method, symptom, pick) {
  const state = { method, symptom, answers: {} };
  let q, n = 0;
  while ((q = nextQuestion(state)) && n++ < 10) state.answers[q.id] = pick(q);
  return diagnose(state);
}

// Every answer combination, not just the first option of each question.
function* allPaths(method, symptom) {
  const qs = questionsFor({ method, symptom, answers: {} });
  function* rec(k, answers) {
    if (k === qs.length) { yield { ...answers }; return; }
    for (const o of qs[k].options) yield* rec(k + 1, { ...answers, [qs[k].id]: o.id });
  }
  yield* rec(0, {});
}
const text = (d) => [d.cause, d.why, d.changeNow, d.nextExperiment, d.ruleOut].join(' ');

test('every symptom × method × every answer combination ends in a diagnosis with a valid next step', () => {
  let n = 0;
  for (const m of METHODS) {
    for (const s of SYMPTOMS) {
      const applies = m.id === 'espresso' ? s.espresso : s.filter;
      if (!applies) { assert.equal(diagnose({ method: m.id, symptom: s.id, answers: {} }).ok, false); continue; }
      for (const answers of allPaths(m.id, s.id)) {
        const d = ok(diagnose({ method: m.id, symptom: s.id, answers }));
        const where = `${m.id}/${s.id}/${JSON.stringify(answers)}`;
        assert.ok(d.cause && d.changeNow && ZONES[d.zone], where);
        // One variable at a time: the changed variable is never also held, and a recipe change names what stays fixed.
        if (d.change) { assert.ok(!d.hold.includes(d.change), where); assert.ok(d.hold.length >= 2, where); }
        if (d.next.grind) assert.equal(d.change, 'grind', where);
        if (d.next.temp) assert.equal(d.change, 'temperature', where);
        if (d.next.strength) assert.equal(buildRecipe({ method: m.id, target: m.id === 'espresso' || m.id === 'moka' ? { doseG: 18 } : { cupMl: m.id === 'aeropress' ? 200 : 300 }, strength: d.next.strength }).ok, true, where);
        // The answer decides the direction: a fast brew is never told to grind coarser, a slow percolation brew never finer.
        const time = answers.shot ?? answers.time;
        const fam = familyOf(m.id);
        if (time === 'fast' && fam !== 'immersion') assert.notEqual(d.next.grind, 'coarser', where);
        if (time === 'slow' && (fam === 'percolation' || fam === 'espresso')) assert.notEqual(d.next.grind, 'finer', where);
        if (time === 'fast') assert.doesNotMatch(d.cause, /too slow|ran slow|ran long|too long/i, where);
        if (time === 'slow') assert.doesNotMatch(d.cause, /too fast|ran fast|too quickly|too briefly/i, where);
        // Immersion brews have no drawdown, centre pour or clogged bed.
        if (fam === 'immersion') assert.doesNotMatch(text(d), /drawdown|in the cent(re|er)|clog|swirl|bed flat/i, where);
        // Cold brew is never told to change the water temperature.
        if (m.id === 'cold-brew') { assert.equal(d.next.temp, undefined, where); assert.ok(!d.hold.includes('temperature') && d.change !== 'temperature', where); }
        n++;
      }
    }
  }
  assert.ok(n > 300, `walked ${n} paths`);
});

test('espresso: bitter and fast is not called slow; the fix is to bring the time up first', () => {
  const d = ok(diagnose({ method: 'espresso', symptom: 'bitter', answers: { shot: 'fast', roast: 'dark' } }));
  assert.doesNotMatch(d.cause, /slow/i);
  assert.equal(d.next.grind, 'finer');
  assert.match(d.cause, /roast/i);
  assert.deepEqual(d.hold.sort(), ['dose', 'temperature', 'yield']);
});

test('French press sour and slow gets steep advice, never pour-over advice', () => {
  const d = ok(diagnose({ method: 'french-press', symptom: 'sour', answers: { time: 'slow', roast: 'medium' } }));
  assert.doesNotMatch(text(d), /pour|drawdown|clog|filter/i);
  assert.equal(d.change, 'grind');
  assert.equal(d.next.grind, 'finer');
});

test('sour fast V60 and bitter slow espresso lead to opposite experiments', () => {
  const a = ok(diagnose({ method: 'v60', symptom: 'sour', answers: { time: 'fast', roast: 'medium', grinder: 'burr' } }));
  const b = ok(diagnose({ method: 'espresso', symptom: 'bitter', answers: { shot: 'slow', roast: 'medium' } }));
  assert.equal(a.next.grind, 'finer');
  assert.equal(b.next.grind, 'coarser');
  assert.notEqual(a.zone, b.zone);
});

test('new paths: too strong lightens the ratio, bright and sweet is left alone, off flavours check cleaning then water', () => {
  const strong = ok(diagnose({ method: 'v60', symptom: 'strong', answers: { measure: 'scale', time: 'ok' } }));
  assert.equal(strong.next.strength, 'lighter'); assert.equal(strong.change, 'dose');
  const bright = ok(diagnose({ method: 'v60', symptom: 'bright', answers: { finish: 'sweet', roast: 'light' } }));
  assert.equal(bright.zone, 'ideal-ideal'); assert.equal(bright.change, undefined); assert.deepEqual(bright.next, {});
  const dirty = ok(diagnose({ method: 'espresso', symptom: 'off', answers: { clean: 'never', water: 'tap' } }));
  assert.match(dirty.cause, /oils|scale/i); assert.match(dirty.changeNow, /backflush/i);
  const tap = ok(diagnose({ method: 'v60', symptom: 'off', answers: { clean: 'recent', water: 'tap' } }));
  assert.equal(tap.change, 'water'); assert.ok(!tap.hold.includes('water'));
});

test('immersion steep questions say "steep", cold brew in hours', () => {
  assert.match(nextQuestion({ method: 'french-press', symptom: 'bitter', answers: {} }).text, /steep/);
  assert.match(nextQuestion({ method: 'cold-brew', symptom: 'sour', answers: {} }).text, /12 h/);
});

test('questions name the method\'s own target time', () => {
  const q = nextQuestion({ method: 'french-press', symptom: 'sour', answers: {} });
  assert.match(q.text, /8:00/);
});

test('unanswered questions block the diagnosis', () => {
  const r = diagnose({ method: 'v60', symptom: 'sour', answers: { time: 'fast' } });
  assert.equal(r.ok, false); assert.equal(r.errors[0].code, 'needs-answer');
});

test('the map: sliders land in the right zone, centre is the sweet spot, junk is clamped', () => {
  assert.equal(placeOnMap({ sourBitter: 0, body: 0 }).zone, 'ideal-ideal');
  assert.equal(placeOnMap({ sourBitter: -2, body: -2 }).zone, 'under-weak');
  assert.equal(placeOnMap({ sourBitter: 2, body: 1.5 }).zone, 'over-strong');
  const j = placeOnMap({ sourBitter: 99, body: NaN });
  assert.equal(j.x, 1); assert.equal(j.y, 0.5);
});

import { LEVERS, suggestLevers } from '../index.ts';

test('levers move the way the science says, in opposing pairs', () => {
  const by = Object.fromEntries(LEVERS.map((l) => [l.id, l]));
  assert.ok(by.finer.dx > 0 && by.coarser.dx < 0 && by.hotter.dx > 0 && by.cooler.dx < 0);
  assert.ok(by['more-coffee'].dy > 0 && by['more-water'].dy < 0);
  assert.ok(Math.abs(by['more-coffee'].dy) > Math.abs(by['more-coffee'].dx), 'ratio moves strength more than extraction');
  for (const [a, b] of [['finer', 'coarser'], ['hotter', 'cooler'], ['longer', 'shorter'], ['more-coffee', 'more-water']]) {
    assert.equal(by[a].dx, -by[b].dx); assert.equal(by[a].dy, -by[b].dy);
  }
});

test('suggestions point toward the sweet spot', () => {
  assert.equal(suggestLevers({ sourBitter: -1.5, body: 0 })[0].id, 'finer');
  assert.equal(suggestLevers({ sourBitter: 1.5, body: 0 })[0].id, 'coarser');
  assert.equal(suggestLevers({ sourBitter: 0, body: -1.5 })[0].id, 'more-coffee');
  assert.equal(suggestLevers({ sourBitter: 0, body: 0 }).length, 0);
});
