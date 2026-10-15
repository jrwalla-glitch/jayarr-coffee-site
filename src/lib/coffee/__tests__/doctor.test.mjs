import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SYMPTOMS, METHODS, nextQuestion, questionsFor, diagnose, placeOnMap, ZONES, buildRecipe } from '../index.ts';

const ok = (r) => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };

function walk(method, symptom, pick) {
  const state = { method, symptom, answers: {} };
  let q, n = 0;
  while ((q = nextQuestion(state)) && n++ < 10) state.answers[q.id] = pick(q);
  return diagnose(state);
}

test('every symptom × method × answer path ends in a diagnosis with a valid next step', () => {
  for (const m of METHODS) {
    for (const s of SYMPTOMS) {
      const applies = m.id === 'espresso' ? s.espresso : s.filter;
      if (!applies) { assert.equal(diagnose({ method: m.id, symptom: s.id, answers: {} }).ok, false); continue; }
      const qs = questionsFor({ method: m.id, symptom: s.id, answers: {} });
      // try each option of the first question, the rest at their first option
      const firsts = qs[0]?.options ?? [{ id: 'x' }];
      for (const opt of firsts) {
        const r = walk(m.id, s.id, (q) => (q.id === qs[0]?.id ? opt.id : q.options[0].id));
        const d = ok(r);
        assert.ok(d.cause && d.changeNow && ZONES[d.zone], `${m.id}/${s.id}/${opt.id}`);
        if (d.next.strength) assert.equal(buildRecipe({ method: m.id, target: m.id === 'espresso' || m.id === 'moka' ? { doseG: 18 } : { cupMl: m.id === 'aeropress' ? 200 : 300 }, strength: d.next.strength }).ok, true);
      }
    }
  }
});

test('sour fast V60 and bitter slow espresso lead to different, opposite experiments', () => {
  const a = ok(diagnose({ method: 'v60', symptom: 'sour', answers: { time: 'fast', roast: 'medium', grinder: 'burr' } }));
  const b = ok(diagnose({ method: 'espresso', symptom: 'bitter', answers: { shot: 'slow', roast: 'medium' } }));
  assert.equal(a.next.grind, 'finer');
  assert.equal(b.next.grind, 'coarser');
  assert.notEqual(a.zone, b.zone);
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
