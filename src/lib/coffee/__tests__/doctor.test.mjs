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
        // The map never contradicts the text (Astra: "Over-extracted" beside "not from over-extraction").
        const all = text(d);
        if (/not over-extract|isn't over-extracted|not from over-extraction|under-extracted overall/i.test(all)) assert.ok(!d.zone.startsWith('over'), `${where}: ${d.zone}`);
        if (d.placement === 'likely' && /^under-extracted/i.test(d.cause)) assert.ok(d.zone.startsWith('under'), where);
        if (d.placement === 'likely' && /^over-extracted/i.test(d.cause)) assert.ok(d.zone.startsWith('over'), where);
        if (/uneven|channel/i.test(d.cause)) assert.equal(d.placement, 'uncertain', where);
        if (d.placement !== 'likely') assert.ok(d.placementNote, where);
        assert.ok(['likely', 'uncertain', 'other'].includes(d.placement), where);
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
  assert.match(dirty.cause, /oils|scale/i); assert.match(dirty.changeNow, /clean and descale the machine as your manual directs/i);
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

test('"Not sure" is never treated as on target (Muse: V60 sour + not sure said "at a normal brew time")', () => {
  for (const method of ['v60', 'chemex', 'drip-machine', 'french-press', 'aeropress', 'cold-brew']) for (const symptom of ['sour', 'bitter']) {
    const answers = { time: 'unsure', roast: 'medium', grinder: 'burr' };
    const d = ok(diagnose({ method, symptom, answers }));
    assert.doesNotMatch(text(d), /normal brew time|usual steep|at the usual|on target and/i, `${method}/${symptom}`);
    assert.match(d.changeNow, /time/i, `${method}/${symptom} asks for a timed brew`);
  }
});

test('machine- or pod-dosed coffee is never told to change the grind', () => {
  for (const method of ['drip-machine', 'v60', 'french-press']) for (const symptom of ['weak', 'strong']) for (const time of ['fast', 'ok', 'slow', 'unsure']) {
    const d = ok(diagnose({ method, symptom, answers: { measure: 'machine', time } }));
    assert.notEqual(d.change, 'grind', `${method}/${symptom}/${time}`); assert.equal(d.next.grind, undefined);
    assert.ok(!d.hold.includes('grind'));
  }
});

test('follow-up experiments change one thing at a time', () => {
  const d = ok(diagnose({ method: 'espresso', symptom: 'harsh-mixed', answers: { shot: 'ok', grinder: 'burr' } }));
  assert.doesNotMatch(d.nextExperiment, /less coffee|more coffee/);
});

test('Opus blind review: moka bitter is one change; cold brew strength changes the dilution; text stands alone', () => {
  for (const time of ['fast', 'ok', 'slow', 'unsure']) {
    const d = ok(diagnose({ method: 'moka', symptom: 'bitter', answers: { time, roast: 'medium' } }));
    assert.equal(d.change, 'heat'); assert.doesNotMatch(d.changeNow, /hot water in the base/);
  }
  const weak = ok(diagnose({ method: 'cold-brew', symptom: 'weak', answers: { measure: 'scale', time: 'ok' } }));
  assert.equal(weak.change, 'dilution'); assert.ok(weak.hold.includes('water') && !weak.hold.includes('dilution')); assert.deepEqual(weak.next, {});
  for (const m of METHODS) for (const sy of SYMPTOMS) {
    const applies = m.id === 'espresso' ? sy.espresso : sy.filter; if (!applies) continue;
    for (const answers of allPaths(m.id, sy.id)) assert.doesNotMatch(text(ok(diagnose({ method: m.id, symptom: sy.id, answers }))), /next row|next path/);
  }
  const ap = ok(diagnose({ method: 'aeropress', symptom: 'bitter', answers: { time: 'slow', roast: 'medium' } }));
  assert.doesNotMatch(ap.changeNow, /pour it all off/);
});

test('Opus r2: espresso sour-and-bitter follows the shot time; too strong but fast fixes timing first', () => {
  const slow = ok(diagnose({ method: 'espresso', symptom: 'harsh-mixed', answers: { shot: 'slow', grinder: 'burr' } }));
  assert.match(slow.nextExperiment, /coarser/); assert.doesNotMatch(slow.nextExperiment, /finer/);
  const fast = ok(diagnose({ method: 'espresso', symptom: 'harsh-mixed', answers: { shot: 'fast', grinder: 'burr' } }));
  assert.match(fast.nextExperiment, /finer/);
  const strongFast = ok(diagnose({ method: 'espresso', symptom: 'strong', answers: { shot: 'fast' } }));
  assert.equal(strongFast.next.grind, 'finer');
  const bitterOk = ok(diagnose({ method: 'espresso', symptom: 'bitter', answers: { shot: 'ok', roast: 'medium' } }));
  assert.match(bitterOk.changeNow, /1:1\.5/); assert.equal(bitterOk.next.strength, 'stronger');
});

test('immersion steep advice uses the recipe\'s own steep (Opus r2: AeroPress 0:50, cold brew 18 h)', () => {
  assert.match(ok(diagnose({ method: 'aeropress', symptom: 'sour', answers: { time: 'fast', roast: 'medium' } })).changeNow, /0:30/);
  assert.match(ok(diagnose({ method: 'cold-brew', symptom: 'bitter', answers: { time: 'slow', roast: 'medium' } })).changeNow, /12 h/);
  assert.match(nextQuestion({ method: 'aeropress', symptom: 'sour', answers: {} }).text, /0:30/);
});

import { adjustedTempC, methodById } from '../index.ts';
test('Astra r3: the Doctor\'s temperature is the one its hand-off applies (AeroPress cooler is 80 °C, not 90)', () => {
  for (const m of METHODS) for (const sy of SYMPTOMS) {
    const applies = m.id === 'espresso' ? sy.espresso : sy.filter; if (!applies) continue;
    for (const answers of allPaths(m.id, sy.id)) {
      const d = ok(diagnose({ method: m.id, symptom: sy.id, answers }));
      if (!d.next.temp) continue;
      const want = adjustedTempC(methodById(m.id), d.next.temp, answers.roast === 'light' || answers.roast === 'dark' ? answers.roast : 'medium');
      const said = text(d).match(/about (\d+) °C/);
      if (said) assert.equal(Number(said[1]), want, `${m.id}/${sy.id}/${JSON.stringify(answers)}`);
    }
  }
  // Cooler means cooler than this brewer's own recipe for the roast (Opus r3): AeroPress dark is 80 °C, so 77 °C.
  assert.match(ok(diagnose({ method: 'aeropress', symptom: 'bitter', answers: { time: 'fast', roast: 'dark' } })).changeNow, /about 77 °C/);
  for (const id of ['v60', 'chemex', 'french-press', 'aeropress', 'drip-machine']) for (const roast of ['light', 'medium', 'dark']) {
    const m = methodById(id); const base = buildRecipe({ method: id, target: { cupMl: 237 }, roast }).value.tempC;
    assert.ok(adjustedTempC(m, 'cooler', roast) < base && adjustedTempC(m, 'hotter', roast) > base - (base >= 100 ? 1 : 0), `${id} ${roast}`);
  }
});

test('Opus r3: Doctor advice matches the answers given and the link it opens', () => {
  // Weighing carries no strength change.
  assert.deepEqual(ok(diagnose({ method: 'v60', symptom: 'weak', answers: { measure: 'scoop', time: 'ok' } })).next, {});
  // Flat with no roast date and bottled water: never "check the date" or "try bottled water".
  const flat = ok(diagnose({ method: 'aeropress', symptom: 'flat', answers: { age: 'unsure', water: 'bottled' } }));
  assert.doesNotMatch(text(flat), /Check the roast date|bottled spring water/);
  // Ratio examples are the brewer's own.
  assert.match(ok(diagnose({ method: 'french-press', symptom: 'weak', answers: { measure: 'scale', time: 'ok' } })).changeNow, /1:15 to 1:14/);
  // Only a drip machine offers "the machine decided".
  for (const method of ['v60', 'french-press', 'cold-brew']) assert.ok(!nextQuestion({ method, symptom: 'weak', answers: {} }).options.some((o) => o.id === 'machine'));
  assert.ok(nextQuestion({ method: 'drip-machine', symptom: 'weak', answers: {} }).options.some((o) => o.id === 'machine'));
  // Cold brew's next step never mentions the hot end.
  assert.doesNotMatch(ok(diagnose({ method: 'cold-brew', symptom: 'bright', answers: { finish: 'short', roast: 'light' } })).nextExperiment, /hot end/);
});

test('Muse r4: every Doctor link opens a recipe that builds (a stronger 8 oz AeroPress needs two presses)', async () => {
  const { brewLinkFor } = await import('../index.ts');
  for (const m of METHODS) for (const sy of SYMPTOMS) {
    const applies = m.id === 'espresso' ? sy.espresso : sy.filter; if (!applies) continue;
    for (const answers of allPaths(m.id, sy.id)) {
      const d = ok(diagnose({ method: m.id, symptom: sy.id, answers }));
      const q = new URL(brewLinkFor(m.id, d, answers.roast), 'https://x').searchParams;
      const target = q.has('dose') ? { doseG: Number(q.get('dose')) } : q.has('water') ? { waterG: Number(q.get('water')) } : { cupMl: Number(q.get('cup')) };
      // "Same water, more coffee" holds the water; a machine-set dose sends no strength change (Opus r4).
      if (d.change === 'dose' && d.next.strength && !q.has('dose')) assert.ok(q.has('water'), `${m.id}/${sy.id} holds the water`);
      if (answers.measure === 'machine') assert.equal(q.get('strength'), null);
      const r = buildRecipe({ method: m.id, target, strength: q.get('strength') ?? 'classic', roast: q.get('roast') ?? 'medium' });
      assert.equal(r.ok, true, `${m.id}/${sy.id}/${JSON.stringify(answers)} → ${q}`);
    }
  }
  const ap = ok(diagnose({ method: 'aeropress', symptom: 'weak', answers: { measure: 'scale', time: 'ok' } }));
  const apq = new URL(brewLinkFor('aeropress', ap), 'https://x').searchParams;
  assert.equal(apq.get('strength'), 'stronger');
  assert.ok(Number(apq.get('water')) < 276, 'the 8 oz recipe would need two presses, so the next size down');
});

test('Muse r4: every question asked can change the answer', () => {
  for (const m of METHODS) for (const sy of SYMPTOMS) {
    const applies = m.id === 'espresso' ? sy.espresso : sy.filter; if (!applies) continue;
    const qs = questionsFor({ method: m.id, symptom: sy.id, answers: {} });
    const paths = [...allPaths(m.id, sy.id)];
    for (const q of qs) {
      const live = paths.some((p) => q.options.some((o) => JSON.stringify(ok(diagnose({ method: m.id, symptom: sy.id, answers: { ...p, [q.id]: o.id } }))) !== JSON.stringify(ok(diagnose({ method: m.id, symptom: sy.id, answers: p })))));
      assert.ok(live, `${m.id}/${sy.id} asks "${q.id}" but no answer changes the diagnosis`);
    }
  }
});

test('Muse r4: "Not sure" of the shot time exists, and a bitter shot of unknown time changes nothing until timed', () => {
  assert.ok(questionsFor({ method: 'espresso', symptom: 'sour', answers: {} })[0].options.some((o) => o.id === 'unsure'));
  const bitter = ok(diagnose({ method: 'espresso', symptom: 'bitter', answers: { shot: 'unsure', roast: 'medium' } }));
  assert.equal(bitter.change, undefined); assert.deepEqual(bitter.next, {}); assert.match(bitter.changeNow, /time it/);
  assert.equal(bitter.placement, 'uncertain');
  const sour = ok(diagnose({ method: 'espresso', symptom: 'sour', answers: { shot: 'unsure', roast: 'medium' } }));
  assert.equal(sour.change, 'grind'); assert.equal(sour.placement, 'uncertain'); assert.match(sour.changeNow, /time the next shot/);
  // Unknown time never yields a confident placement, for any brewer or symptom.
  for (const m of METHODS) for (const sy of SYMPTOMS) {
    const applies = m.id === 'espresso' ? sy.espresso : sy.filter; if (!applies) continue;
    for (const answers of allPaths(m.id, sy.id)) {
      if ((answers.shot ?? answers.time) !== 'unsure' || answers.measure === 'scoop' || answers.measure === 'machine') continue;
      const d = ok(diagnose({ method: m.id, symptom: sy.id, answers }));
      if (['sour', 'bitter', 'weak', 'strong'].includes(sy.id)) assert.notEqual(d.placement, 'likely', `${m.id}/${sy.id}/${JSON.stringify(answers)}`);
      assert.ok(!d.hold.includes('steep time'), `${m.id}/${sy.id}: the unknown steep isn't "kept the same"`);
    }
  }
});

test('Muse r4: an unknown roast keeps a bitter cup at a normal time uncertain; blade-ground espresso changes the grinder', () => {
  for (const [method, answers] of [['espresso', { shot: 'ok', roast: 'unsure' }], ['v60', { time: 'ok', roast: 'unsure' }], ['french-press', { time: 'ok', roast: 'unsure' }]]) {
    assert.equal(ok(diagnose({ method, symptom: 'bitter', answers })).placement, 'uncertain', method);
  }
  for (const grinder of ['blade', 'pre']) {
    const d = ok(diagnose({ method: 'espresso', symptom: 'harsh-mixed', answers: { shot: 'ok', grinder } }));
    assert.equal(d.change, 'grind'); assert.ok(!d.hold.includes('grind'));
  }
  assert.doesNotMatch(ok(diagnose({ method: 'espresso', symptom: 'harsh-mixed', answers: { shot: 'ok', grinder: 'burr' } })).changeNow, /over- or under-filled/);
  const clog = ok(diagnose({ method: 'v60', symptom: 'harsh-mixed', answers: { grinder: 'burr', time: 'slow' } }));
  assert.equal(clog.next.grind, 'coarser');
});

test('blind Opus r5: espresso yield moves strength the right way; fast cups are not placed "strong"', async () => {
  const { leverMove } = await import('../index.ts');
  const by = Object.fromEntries(LEVERS.map((l) => [l.id, l]));
  assert.ok(leverMove(by.longer, true).dy < 0, 'a longer shot is weaker');
  assert.ok(leverMove(by.shorter, true).dy > 0, 'a shorter shot is stronger');
  assert.ok(leverMove(by.longer, false).dy > 0, 'filter: longer contact is a little stronger');
  // A sour, thin espresso isn't told to pull a longer shot.
  assert.ok(!suggestLevers({ sourBitter: -1.5, body: -1.5 }, true).slice(0, 2).some((l) => l.id === 'longer'));
  for (const [method, symptom, answers] of [['v60', 'bitter', { time: 'fast', roast: 'medium' }], ['espresso', 'bitter', { shot: 'fast', roast: 'medium' }], ['french-press', 'bitter', { time: 'fast', roast: 'light' }]]) {
    assert.ok(!ok(diagnose({ method, symptom, answers })).zone.endsWith('strong'), `${method} ${symptom} fast`);
  }
});

test('"Runs too fast" and the shot-time question use the same threshold (25 s, the Brew Guide\'s 25–30 s shot)', () => {
  const gushing = SYMPTOMS.find((s) => s.id === 'gushing');
  const q = nextQuestion({ method: 'espresso', symptom: 'bitter', answers: {} });
  assert.equal(q.id, 'shot');
  const fast = q.options.find((o) => o.id === 'fast').label;
  const sec = (t) => Number(t.match(/under (\d+) seconds/i)?.[1]);
  assert.equal(sec(gushing.tagline), 25, gushing.tagline);
  assert.equal(sec(gushing.tagline), sec(fast), `${gushing.tagline} vs ${fast}`);
  assert.equal(METHODS.find((m) => m.id === 'espresso').timeS.min, 25);
});

test('espresso cleaning follows the machine\'s manual: no backflush for every machine, no monthly norm (batch 7)', () => {
  const state = { method: 'espresso', symptom: 'off', answers: {} };
  const q = questionsFor(state).find((x) => x.id === 'clean');
  assert.match(q.text, /cleaned and descaled the machine as its manual directs/);
  const all = q.text + ' ' + q.options.map((o) => o.label).join(' ');
  assert.doesNotMatch(all, /backflush|month/i);
  for (const clean of ['months', 'never']) {
    const r = ok(diagnose({ ...state, answers: { clean, water: 'tap' } }));
    assert.match(r.changeNow, /as your manual directs/); assert.doesNotMatch(r.changeNow, /backflush|detergent/i);
  }
  assert.notEqual(ok(diagnose({ ...state, answers: { clean: 'recent', water: 'tap' } })).cause, 'Old coffee oils or scale in the equipment');
  // Other brewers keep their own question.
  assert.match(questionsFor({ method: 'v60', symptom: 'off', answers: {} }).find((x) => x.id === 'clean').text, /deep-clean the brewer/);
});
