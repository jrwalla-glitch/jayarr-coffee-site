import type { MethodId, Result, Strength } from './types.ts';
import { METHODS, methodById } from './methods.ts';
import { adjustedTempC, buildRecipe } from './brew.ts';
import { strengthParam } from './share.ts';
import { failure, flOzToMl, success } from './units.ts';

// Fix My Coffee (the "Coffee Doctor" in code) and the Extraction Map share this module.
// It covers METHODS, and the Brew Guide's phin on a short path of its own: the drip running fast, the drip
// stalling, and a cup too strong, with only the causes Nguyen Coffee Supply's troubleshooting gives (Wave F r1, B14).
// Science: compounds dissolve at different speeds, so taste changes as extraction rises; under-extracted
// cups tend to taste sour and thin, over-extracted ones bitter and drying (Gagné; synthesis §1). No fixed
// acid → sugar → bitter phases: the Deep Brew note on the extraction sequence finds the bitter, slow end
// better supported than the sour, fast one (Wave F r1, B2). Espresso dial-in by shot time and yield (§7, Rao).
// The map is qualitative: taste cannot give a TDS or extraction reading.

export type SymptomId = 'sour' | 'bitter' | 'weak' | 'strong' | 'harsh-mixed' | 'bright' | 'flat' | 'off' | 'muddy' | 'gushing' | 'choking' | 'drip-fast' | 'drip-stall';

/** `phin`: offered for the phin, whose path covers only what Nguyen Coffee Supply's troubleshooting does. */
export interface Symptom { id: SymptomId; label: string; tagline: string; espresso: boolean; filter: boolean; phin?: boolean }
export const SYMPTOMS: Symptom[] = [
  { id: 'sour', label: 'Sour', tagline: 'Sharp, tangy, thin, like under-ripe fruit', espresso: true, filter: true },
  { id: 'bitter', label: 'Bitter', tagline: 'Harsh, ashy, drying finish', espresso: true, filter: true },
  { id: 'weak', label: 'Weak', tagline: 'Watery, thin, not enough coffee', espresso: false, filter: true },
  { id: 'strong', label: 'Too strong', tagline: 'Heavy and intense, more than you want', espresso: true, filter: true, phin: true },
  { id: 'harsh-mixed', label: 'Sour and bitter', tagline: 'Both at once, hollow in the middle', espresso: true, filter: true },
  { id: 'bright', label: 'Bright, is that right?', tagline: 'Lively, fruity acidity you are not sure about', espresso: true, filter: true },
  { id: 'flat', label: 'Flat', tagline: 'Dull, papery, no aroma', espresso: true, filter: true },
  { id: 'off', label: 'Tastes off', tagline: 'Stale oil, metallic, chlorine or musty notes', espresso: true, filter: true },
  { id: 'muddy', label: 'Muddy', tagline: 'Silty, gritty, heavy sludge', espresso: false, filter: true },
  { id: 'gushing', label: 'Runs too fast', tagline: 'Shot pours in under 25 seconds', espresso: true, filter: false },
  { id: 'choking', label: 'Barely drips', tagline: 'Shot drips slowly or not at all', espresso: true, filter: false },
  // The phin's own two, in the terms of Nguyen Coffee Supply's troubleshooting (the phin guide's "When the drip runs too fast or too slow").
  { id: 'drip-fast', label: 'Drips too fast', tagline: 'A phin that empties in about a minute', espresso: false, filter: false, phin: true },
  { id: 'drip-stall', label: 'Stalls', tagline: 'A phin that hasn\'t dripped for more than 5 minutes', espresso: false, filter: false, phin: true },
];

export interface Option { id: string; label: string }
export interface Question { id: QuestionId; text: string; options: Option[] }
export type QuestionId = 'time' | 'roast' | 'grinder' | 'age' | 'water' | 'measure' | 'shot' | 'finish' | 'clean' | 'serve' | 'press' | 'dose' | 'dry';

export interface DoctorState { method: MethodId; symptom: SymptomId; answers: Partial<Record<QuestionId, string>> }

/** How the water meets the coffee decides which fixes make sense: drawdown advice means nothing to an immersion brew. */
export type Family = 'espresso' | 'moka' | 'percolation' | 'immersion';
export function familyOf(method: MethodId): Family {
  if (method === 'espresso') return 'espresso';
  if (method === 'moka') return 'moka';
  return methodById(method)?.family === 'immersion' ? 'immersion' : 'percolation';
}

/**
 * Immersion steep: from the recipe itself (the press time) up to the method's longest usual steep.
 * A French press is commonly pressed at 4 minutes and this site's recipe waits 8 (synthesis: "4+ min"),
 * so anything from 4:00 to 8:00 is on target rather than "too brief" (Opus r4).
 */
function steepWindow(method: MethodId): { min: number; max: number; recipe: number } {
  const m = methodById(method);
  const press = m?.steps.find((st) => st.kind === 'press')?.atS;
  if (press === undefined || !m) return { ...(m?.timeS ?? { min: 180, max: 240 }), recipe: m?.timeS.max ?? 240 };
  return { min: method === 'french-press' ? Math.min(240, press) : press, max: Math.max(press, m.timeS.max), recipe: press };
}
/** "Steep for at least 4:00 (the Brew Guide recipe steeps 8:00)", or "Steep for the full 2:00". */
function steepLonger(method: MethodId): string {
  const w = steepWindow(method);
  return w.recipe > w.min ? `Steep for at least ${fmt(w.min)}; the Brew Guide recipe steeps ${fmt(w.recipe)}.` : `Steep for the full ${fmt(w.min)}.`;
}

/** A brewer's name mid-sentence: "the usual cold brew steep", but "the usual AeroPress steep". */
const inSentence = (label: string) => (/^(Cold|Drip|Moka|Espresso)/.test(label) ? label.toLowerCase() : label);
const fmt = (s: number) => (s >= 3600 ? `${Math.round(s / 3600)} h` : `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`);

function question(id: QuestionId, method: MethodId): Question {
  const m = methodById(method);
  const fam = familyOf(method);
  switch (id) {
    case 'time': {
      const t = fam === 'immersion' ? steepWindow(method) : (m?.timeS ?? { min: 180, max: 240 });
      const target = t.min === t.max ? `about ${fmt(t.min)}` : `about ${fmt(t.min)}–${fmt(t.max)}`;
      const text = fam === 'immersion' ? `How long did it steep before you ${method === 'cold-brew' ? 'strained it' : 'pressed or poured'}? The usual ${inSentence(m?.label ?? '')} steep is ${target}.`
        : fam === 'moka' ? `How long from putting the pot on the heat to the coffee finishing? Usually ${target}.`
        : method === 'drip-machine' ? `How long did the machine take to brew? Usually ${target}.`
        : `How long did the brew take, from the first pour to the end of drawdown? Target for ${inSentence(m?.label ?? 'this method')} is ${target}.`;
      // Hoffmann's French press (World Atlas pp. 78–79; his 2016 video) steeps 4:00, skims, then settles 5 or more minutes
      // and is poured without plunging: about 9½–12½ minutes from the first pour, as the French press guide times it
      // (Wave F r1, B3). It is its own answer, not "too long" (Wave D batch 19).
      const settled = method === 'french-press' ? [{ id: 'settled', label: 'About 9½–12½ min, Hoffmann\'s way: crust broken at 4:00, then left to settle and poured without plunging' }] : [];
      return { id, text, options: [{ id: 'fast', label: `Shorter than ${fmt(t.min)}` }, { id: 'ok', label: 'About on target' }, { id: 'slow', label: `Longer than ${fmt(t.max)}` }, ...settled, { id: 'unsure', label: 'Not sure' }] };
    }
    case 'shot':
      // The same 25–30 s band the Brew Guide and Grind Guide use, so a 22 s sour shot is "fast" everywhere (Opus r4, Muse r4).
      return { id, text: 'How long did the shot run, from pressing the button to stopping it?',
        options: [{ id: 'fast', label: 'Under 25 seconds' }, { id: 'ok', label: '25–30 seconds' }, { id: 'slow', label: 'Over 30 seconds' }, { id: 'unsure', label: 'Not sure' }] };
    case 'roast':
      return { id, text: 'How dark is the roast?', options: [{ id: 'light', label: 'Light' }, { id: 'medium', label: 'Medium' }, { id: 'dark', label: 'Dark or oily' }, { id: 'unsure', label: 'Not sure' }] };
    case 'grinder':
      return { id, text: 'What ground the coffee?', options: [{ id: 'burr', label: 'A burr grinder' }, { id: 'blade', label: 'A blade grinder' }, { id: 'pre', label: 'Bought pre-ground' }] };
    case 'age':
      return { id, text: 'When was it roasted?', options: [{ id: 'fresh', label: 'Within the last month' }, { id: 'old', label: 'More than six weeks ago' }, { id: 'ground', label: 'It was ground days ago' }, { id: 'unsure', label: 'No date on the bag' }] };
    case 'water':
      return { id, text: 'What water did you use?', options: [{ id: 'tap', label: 'Tap or filtered tap' }, { id: 'bottled', label: 'Bottled spring water' }, { id: 'pure', label: 'Distilled or reverse osmosis' }] };
    case 'measure':
      // Only a drip machine (pre-portioned packs, a machine's own scoop) offers "the machine decided" (blind Opus r3).
      return { id, text: 'How did you measure the coffee?', options: [{ id: 'scale', label: 'On a scale' }, { id: 'scoop', label: 'Scoops or spoons' }, ...(method === 'drip-machine' ? [{ id: 'machine', label: 'A pre-measured pack or the machine decided' }] : [])] };
    case 'serve':
      // Cold brew is a concentrate in the Brew Guide, but some brew it ready to drink (CoffeeSock's about 1:11; Wave D batch 13).
      return { id, text: 'Did you brew a concentrate and dilute it, or brew it ready to drink?', options: [{ id: 'concentrate', label: 'A concentrate, diluted to serve' }, { id: 'ready', label: 'Ready to drink, nothing added' }] };
    case 'finish':
      return { id, text: 'How does a sip finish?', options: [{ id: 'sweet', label: 'Sweet and juicy, it lingers' }, { id: 'short', label: 'Sharp, then thin and gone' }, { id: 'drying', label: 'Dry and puckering' }] };
    // The phin's questions: what Nguyen Coffee Supply names as the causes of a fast or stalled drip.
    case 'press':
      return { id, text: 'Which press does your phin have?', options: [{ id: 'gravity', label: 'It rests on the coffee' }, { id: 'screw', label: 'It screws down' }, { id: 'unsure', label: 'Not sure' }] };
    case 'dose':
      return { id, text: 'How much coffee went in?', options: [{ id: 'full', label: '14 g (about 2 tablespoons) or more' }, { id: 'less', label: 'Less than that' }, { id: 'unsure', label: 'I didn\'t measure' }] };
    case 'dry':
      return { id, text: 'Was the phin dry when you started?', options: [{ id: 'dry', label: 'Yes, dry' }, { id: 'wet', label: 'Still wet from washing' }, { id: 'unsure', label: 'Not sure' }] };
    case 'clean':
      // Espresso machines differ (the Bambino has no backflush; some makers name their own tablets), so ask
      // against the machine's manual, not a monthly norm (Wave D batch 7).
      return fam === 'espresso'
        ? { id, text: 'Have you cleaned and descaled the machine as its manual directs?', options: [{ id: 'recent', label: 'Yes, on its schedule' }, { id: 'months', label: 'Not lately' }, { id: 'never', label: 'Never, or not sure' }] }
        : { id, text: 'When did you last deep-clean the brewer (old oils, scale)?', options: [{ id: 'recent', label: 'Within the last month' }, { id: 'months', label: 'Months ago' }, { id: 'never', label: 'Never, or not sure' }] };
  }
}

/**
 * Which questions each symptom asks, in order. Espresso uses shot time instead of brew time.
 * Only questions whose answer can change the diagnosis are asked (Muse r4 F5): immersion and
 * moka sourness don't depend on the roast, an immersion brew's strength doesn't depend on the
 * steep, and a moka pot's strength is set by a full basket.
 */
function questionIds(state: DoctorState): QuestionId[] {
  const fam = familyOf(state.method);
  const esp = fam === 'espresso';
  if (state.method === 'phin') return state.symptom === 'drip-fast' ? ['press', 'dose'] : state.symptom === 'drip-stall' ? ['press', 'dry'] : [];
  switch (state.symptom) {
    case 'drip-fast': case 'drip-stall': return [];
    case 'sour': return esp ? ['shot', 'roast'] : fam === 'percolation' ? ['time', 'roast', 'grinder'] : ['time'];
    case 'bitter': return esp ? ['shot', 'roast'] : ['time', 'roast'];
    case 'weak': return fam === 'moka' ? [] : state.method === 'cold-brew' ? ['serve', 'measure', 'time'] : ['measure', 'time'];
    case 'strong': return esp ? ['shot'] : fam === 'moka' ? [] : fam === 'immersion' ? ['measure'] : ['measure', 'time'];
    case 'harsh-mixed': return esp ? ['shot', 'grinder'] : fam === 'percolation' ? ['grinder', 'time'] : ['grinder'];
    case 'bright': return state.method === 'cold-brew' ? ['finish'] : ['finish', 'roast'];
    case 'flat': return ['age', 'water'];
    case 'off': return ['clean', 'water'];
    case 'muddy': return ['grinder'];
    case 'gushing': case 'choking': return ['roast'];
  }
}

export function nextQuestion(state: DoctorState): Question | null {
  const id = questionIds(state).find((q) => state.answers[q] === undefined);
  return id ? question(id, state.method) : null;
}

export function questionsFor(state: DoctorState): Question[] {
  return questionIds(state).map((id) => question(id, state.method));
}

export type Variable = 'grind' | 'dose' | 'yield' | 'water' | 'temperature' | 'steep time' | 'pour' | 'heat' | 'dilution' | 'press';
const VARS: Record<Family, Variable[]> = {
  espresso: ['grind', 'dose', 'yield', 'temperature'],
  moka: ['grind', 'dose', 'water', 'heat'],
  percolation: ['grind', 'dose', 'water', 'temperature', 'pour'],
  immersion: ['grind', 'dose', 'water', 'temperature', 'steep time'],
};

export interface Diagnosis {
  cause: string;
  why: string;
  /** The one change to make on the next brew. */
  changeNow: string;
  /** The single brew variable that changes, if the fix is a brew variable at all. */
  change?: Variable;
  /** Everything else to keep exactly the same, so the next cup tests one thing. */
  hold: Variable[];
  nextExperiment: string;
  ruleOut: string;
  /** Where the cup likely sits on the extraction map: a hypothesis from taste, not a measurement. */
  zone: ZoneId;
  /**
   * How far taste and time can place the cup: `likely` (they agree), `uncertain` (they point
   * different ways, e.g. bitter but fast, or uneven extraction), or `other` (the problem isn't
   * extraction: stale beans, dirty equipment, tap-water taste, fines in the cup).
   */
  placement: 'likely' | 'uncertain' | 'other';
  /** For uncertain or other placements: one line the map shows instead of a zone verdict. */
  placementNote?: string;
  /** What to carry into the Brew Guide for the next brew. */
  next: { grind?: 'finer' | 'coarser'; strength?: Strength; temp?: 'hotter' | 'cooler'; tool?: string };
  sourceIds: string[];
}

const S = ['synthesis', 'gagne', 'rao'];

export function diagnose(state: DoctorState): Result<Diagnosis> {
  const phin = state.method === 'phin';
  const m = METHODS.some((x) => x.id === state.method) || phin ? methodById(state.method) : undefined;
  if (!m) return failure('unknown-method', 'method', 'Choose how you brewed it.');
  const sym = SYMPTOMS.find((s) => s.id === state.symptom);
  if (!sym) return failure('unknown-symptom', 'symptom', 'Choose what tastes wrong.');
  const fam = familyOf(state.method);
  const esp = fam === 'espresso';
  if (phin ? !sym.phin : (esp && !sym.espresso) || (!esp && !sym.filter)) return failure('symptom-method', 'symptom', `That symptom doesn't apply to ${m.label}.`);
  const missing = nextQuestion(state);
  if (missing) return failure('needs-answer', missing.id, missing.text);
  const a = state.answers;
  const cold = state.method === 'cold-brew';
  // Cold brew: no temperature to change, but the serving dilution is its own variable, unless it was brewed ready to drink.
  // The phin's variables: Nguyen's recipe fixes the dose and water, and a screw-down press sets the drip speed.
  const vars: Variable[] = phin ? ['grind', 'dose', 'water', 'temperature', 'press'] : cold ? [...VARS[fam].filter((v) => v !== 'temperature'), ...(a.serve === 'ready' ? [] : ['dilution' as const])] : VARS[fam];
  // Every diagnosis changes at most one brew variable and says what stays fixed.
  const d = (x: Omit<Diagnosis, 'sourceIds' | 'hold' | 'placement'> & { hold?: Variable[]; placement?: Diagnosis['placement']; sourceIds?: string[] }): Result<Diagnosis> =>
    success({ ...x, placement: x.placement ?? 'likely', hold: x.hold ?? (x.change ? vars.filter((v) => v !== x.change) : []), sourceIds: x.sourceIds ?? S });

  // ── The phin: only the causes Nguyen Coffee Supply's troubleshooting gives (the phin guide, "When the drip runs
  // too fast or too slow"). Its guide times the drip and gives no taste for it, so the map's dot is a guess. ──
  if (phin) {
    const N = ['nguyen-iced', 'nguyen-phin'];
    const timing = 'The first drop falls at about 2:00 and the last around 5:00, as in Nguyen\'s guide; a little faster or slower is fine, Nguyen says.';
    if (state.symptom === 'strong') return d({ cause: 'Nguyen\'s recipe makes a small, strong cup', why: 'The recipe fixes the coffee at 14 g for a 4 oz phin, and Nguyen Coffee Supply\'s answer to a cup that\'s too strong is to add water.', changeNow: 'Add hot water to the cup, or give the phin a second pour.', change: 'dilution', hold: ['grind', 'dose', 'water', 'temperature'], nextExperiment: 'Keep the 14 g: Nguyen says less than 2 tablespoons in a 4 oz phin may drip fast.', ruleOut: 'If it\'s only too strong black, try it the way Nguyen\'s recipe serves it, over condensed milk and ice.', zone: 'ideal-strong', placement: 'uncertain', placementNote: 'Strong for its water; Nguyen gives no extraction for its recipe, so the dot is a guess.', next: {}, sourceIds: N });
    if (state.symptom === 'drip-fast') {
      const note = { placement: 'uncertain' as const, placementNote: 'A fast drip is too little contact, but Nguyen gives no taste for it: the dot is a guess.' };
      if (a.press === 'screw') return d({ cause: 'The screw-down press is set loose', why: 'Nguyen Coffee Supply says how tightly a screw-down press is turned sets how fast the phin drips, so adjust it before the grind.', changeNow: 'Screw the press down a little tighter on the next brew.', change: 'press', nextExperiment: 'If it still empties in about a minute, grind one step finer, as a separate change.', ruleOut: timing, zone: 'under-weak', ...note, next: {}, sourceIds: N });
      if (a.dose === 'less') return d({ cause: 'Too little coffee for a 4 oz phin', why: 'Nguyen Coffee Supply says less than 2 tablespoons (14 g) in a 4 oz phin may drip fast.', changeNow: 'Use the full 14 g, about 2 tablespoons.', change: 'dose', nextExperiment: 'If it still rushes through, grind one step finer, as a separate change.', ruleOut: timing, zone: 'under-weak', ...note, next: {}, sourceIds: N });
      return d({ cause: 'Probably a grind that\'s too coarse', why: 'Too coarse, Nguyen Coffee Supply says, and the coffee drips too fast; its recipe asks for a fine grind, "like sand".', changeNow: 'Grind one step finer.', change: 'grind', nextExperiment: a.dose === 'unsure' ? 'Weigh the coffee next time: less than 14 g can make it drip fast too.' : 'If it still rushes through, check that the bed is level before the press goes on: a lopsided bed lets water run down one side.', ruleOut: timing, zone: 'under-weak', ...note, next: { grind: 'finer' }, sourceIds: N });
    }
    // drip-stall
    const note = { placement: 'uncertain' as const, placementNote: 'A stalled drip is too much contact, but Nguyen gives no taste for it: the dot is a guess.' };
    if (a.dry === 'wet') return d({ cause: 'A wet phin blocking its own holes', why: 'Nguyen Coffee Supply says a phin that\'s still wet from washing can block its holes.', changeNow: 'Dry the phin completely before you brew.', nextExperiment: 'If it still stalls with a dry phin, lift the press for about 2 seconds to let trapped gas out.', ruleOut: timing, zone: 'over-ideal', ...note, next: {}, sourceIds: N });
    if (a.press === 'screw') return d({ cause: 'The screw-down press is set tight', why: 'Nguyen Coffee Supply says how tightly a screw-down press is turned sets how fast the phin drips, so adjust it before the grind.', changeNow: 'Loosen the press a little on the next brew.', change: 'press', nextExperiment: 'If it still stalls, grind one step coarser, as a separate change.', ruleOut: timing, zone: 'over-ideal', ...note, next: {}, sourceIds: N });
    return d({ cause: 'Trapped gas, or a grind that\'s too fine', why: 'Fresh coffee releases gas that can create suction in the chamber and stop the flow, Nguyen Coffee Supply says; a grind that\'s too fine slows it too.', changeNow: 'Lift the press with a spoon or chopstick for about 2 seconds to let the gas out.', nextExperiment: 'If it stalls again on the next brew, grind one step coarser, on its own.', ruleOut: 'If lifting the press starts the drip, it was the gas, not the grind.', zone: 'over-ideal', ...note, next: {}, sourceIds: N });
  }
  // Hoffmann's long, unplunged settle is a French press brewed to its own recipe: judged as on target.
  const t = esp ? a.shot : a.time === 'settled' ? 'ok' : a.time;
  const settled = a.time === 'settled';
  const label = m.label;
  const dark = a.roast === 'dark', light = a.roast === 'light';
  const roastOf = dark ? 'dark' : light ? 'light' : 'medium';

  // ── Paths that don't depend on the brew family ──
  if (state.symptom === 'flat') {
    if (a.age === 'old' || a.age === 'ground') return d({ cause: 'Stale coffee', why: 'Aroma compounds fade over the weeks after roasting, and much faster once the beans are ground.', changeNow: 'Brew the same recipe with beans roasted within the last month, ground just before brewing.', nextExperiment: 'Store beans airtight away from light; freeze what you won\'t use within a couple of weeks.', ruleOut: 'If fresh beans still taste flat, look at the water next.', zone: 'ideal-weak', placement: 'other', placementNote: 'Not an extraction problem: tired beans.', next: { tool: 'freshness' } });
    if (a.water === 'pure') return d({ cause: 'Water with almost no minerals', why: 'Distilled and RO water lack the calcium and magnesium that help pull flavor out, so cups tend to taste flat and hollow.', changeNow: 'Brew the same recipe with mineralized water: filtered tap, spring water or a brewing-water recipe.', change: 'water', hold: vars.filter((v) => v !== 'water'), nextExperiment: 'Try one of the recipes in the Water Recipe Builder and keep everything else the same.', ruleOut: 'If mineralized water fixes it, keep that water.', zone: 'ideal-weak', placement: 'other', placementNote: 'Probably the water: it has almost no minerals.', next: { tool: 'water' } });
    // Follow what the reader already said: no date points at freshness; bottled water already rules out the tap.
    if (a.age === 'unsure') return d({ cause: 'Probably freshness: there\'s no roast date', why: 'Without a roast date the beans could be months old, and old beans taste flat.', changeNow: 'Brew the same recipe with a bag that shows a roast date within the last month.', nextExperiment: a.water === 'tap' ? 'If a fresh bag is still flat, try bottled spring water as a separate change.' : 'If a fresh bag is still flat, try a brewing-water recipe as a separate change.', ruleOut: 'If the fresh bag tastes livelier, it was the beans.', zone: 'ideal-weak', placement: 'other', placementNote: 'Probably not extraction: freshness.', next: { tool: 'freshness' } });
    if (a.water === 'bottled') return d({ cause: 'Flat flavor: the water\'s minerals or the coffee itself', why: 'Fresh beans and spring water can still taste flat when the water is low in the minerals that pull flavor out, or the coffee is simply mild.', changeNow: 'Brew the same recipe with water made to a brewing recipe (the Water Recipe Builder has several).', change: 'water', hold: vars.filter((v) => v !== 'water'), nextExperiment: 'If that doesn\'t help, try a brighter, lighter-roasted coffee.', ruleOut: 'If the recipe water tastes livelier, keep it.', zone: 'ideal-weak', placement: 'other', placementNote: 'Probably not extraction: water or the coffee.', next: { tool: 'water' } });
    return d({ cause: 'Flat flavor: probably the water', why: 'With fresh beans, dullness usually comes from water that is very soft or very hard.', changeNow: 'Brew the same recipe with bottled spring water to test the water alone.', change: 'water', hold: vars.filter((v) => v !== 'water'), nextExperiment: 'If that helps, try a brewing-water recipe for good.', ruleOut: 'If spring water tastes the same, the coffee itself may just be mild.', zone: 'ideal-weak', placement: 'other', placementNote: 'Probably not extraction: freshness or water.', next: { tool: 'water' } });
  }
  if (state.symptom === 'off') {
    if (a.clean !== 'recent') return d({ cause: 'Old coffee oils or scale in the equipment', why: 'Coffee oils left in a brewer, carafe or machine go rancid and taint every cup; scale also harbors stale flavors.', changeNow: esp ? 'Clean and descale the machine as your manual directs, and wash the portafilter and basket.' : 'Wash the brewer, filter holder and carafe with a coffee-equipment cleaner, and descale a kettle or machine.', nextExperiment: 'Brew your usual recipe again on the clean equipment, changing nothing else.', ruleOut: 'If a clean brewer still tastes off, test the water next.', zone: 'ideal-ideal', placement: 'other', placementNote: 'Not an extraction problem: the equipment.', next: {} });
    if (a.water === 'tap') return d({ cause: 'Chlorine or other tastes from the tap water', why: 'Many supplies are treated with chlorine or chloramine, which can come through as a medicinal or swimming-pool note.', changeNow: 'Brew the same recipe with water from a carbon filter, or with bottled spring water.', change: 'water', hold: vars.filter((v) => v !== 'water'), nextExperiment: 'If filtered water fixes it, keep filtering; a brewing-water recipe is the next step up.', ruleOut: 'If the off taste stays with different water, look at the beans: an oily, rancid smell from the bag means they are past it.', zone: 'ideal-ideal', placement: 'other', placementNote: 'Not an extraction problem: the water\'s own taste.', next: { tool: 'water' } });
    return d({ cause: 'The beans, probably', why: 'With clean equipment and neutral water, rancid, musty or cardboard notes usually come from old or badly stored beans.', changeNow: 'Smell the bag; if it smells stale or oily-rancid, brew the same recipe with a fresh bag.', nextExperiment: 'Store beans sealed, cool and dark; freeze what you won\'t use soon.', ruleOut: 'If a fresh bag still tastes off, ask the roaster or try another coffee.', zone: 'ideal-weak', placement: 'other', placementNote: 'Not an extraction problem: the beans.', next: { tool: 'freshness' } });
  }
  if (state.symptom === 'bright') {
    if (a.finish === 'sweet') return d({ cause: 'Probably the coffee, not a fault', why: 'Lively, fruity acidity with a sweet, lingering finish is what many light and washed coffees taste like. Sourness from under-extraction is sharp and finishes thin.', changeNow: 'Nothing has to change. If you want it rounder, try one step finer.', nextExperiment: 'Brew it twice side by side, one a step finer, everything else the same, and keep the one you prefer.', ruleOut: 'If the finer one tastes sweeter and fuller, the first was a little under-extracted.', zone: 'ideal-ideal', next: {} });
    if (a.finish === 'short') return d({ cause: 'Slightly under-extracted', why: 'Acidity that is sharp and then disappears suggests the brew stopped before enough sweetness came out.', changeNow: esp ? 'Grind one small step finer.' : fam === 'immersion' && cold ? 'Steep a few hours longer.' : 'Grind one step finer.', change: esp || !cold ? 'grind' : 'steep time', nextExperiment: cold ? 'If it\'s still sharp, grind one step finer as a separate change.' : light ? 'Light roasts often want the hot end of the range too; change that only after the grind.' : 'Taste again; if it turns bitter, come back half a step.', ruleOut: 'If it tastes sweeter and longer, keep the change.', zone: 'under-ideal', next: esp || !cold ? { grind: 'finer' } : {} });
    return d({ cause: 'Astringency, from uneven extraction', why: 'A drying, puckering finish usually comes from very fine particles over-extracting while the rest under-extracts.', changeNow: fam === 'percolation' ? 'Grind one step coarser.' : esp ? 'Prepare the puck more evenly: break up clumps and tamp level.' : 'Grind one step coarser.', change: esp ? undefined : 'grind', hold: esp ? vars : undefined, nextExperiment: 'A burr grinder makes fewer fines than a blade; sifting out the dust also helps.', ruleOut: 'If the dryness fades, keep the coarser grind.', zone: 'over-ideal', placement: 'uncertain', placementNote: 'Uneven: some grounds over-extract while others under-extract.', next: esp ? { tool: 'grind-guide' } : { grind: 'coarser' } });
  }

  // ── Espresso ──
  if (esp) {
    // "Not sure" of the shot time (Muse r4 F1): a fast and a slow bitter shot need opposite grind
    // changes, so don't guess; sour and too strong get the likeliest change, hedged, plus a timed shot.
    if (t === 'unsure') {
      if (state.symptom === 'sour') return d({ cause: 'Probably under-extracted', why: 'Sour usually means the shot was under-extracted, most often because it ran fast. Without the shot time that\'s a best guess, so start with the change most likely to help.', changeNow: 'Grind one small step finer, and time the next shot from pressing the button.', change: 'grind', nextExperiment: 'Aim for about 25–30 s. If it\'s on time and still sour, pull a longer shot (more yield) as a separate change.', ruleOut: 'If it turns bitter or runs past 30 s, come back half a step.', zone: 'under-ideal', placement: 'uncertain', placementNote: 'Sour, but without the shot time the cause is a best guess.', next: { grind: 'finer' } });
      if (state.symptom === 'bitter') return d({ cause: dark ? 'The roast or the shot time: time it first' : 'Bitter: the shot time decides the fix', why: 'A slow shot turns bitter from over-extraction, but a fast, uneven one can taste harsh too, and the two fixes go in opposite directions. One timed shot tells you which it is.', changeNow: 'Pull the same shot again and time it from pressing the button.', hold: vars, nextExperiment: 'Come back with the time: a slow shot wants a coarser grind, a fast one a finer grind, and a shot on time a shorter ratio.', ruleOut: 'A timed shot settles which way to go.', zone: 'over-ideal', placement: 'uncertain', placementNote: 'Bitter, but without the shot time it could be either end.', next: {} });
      if (state.symptom === 'strong') return d({ cause: 'Probably the ratio: espresso is intense by design', why: 'Strength comes mostly from how much liquid you take per gram of coffee. A shot that runs fast or slow changes it too, so time the next one.', changeNow: 'Pull a longer ratio, for example 1:2.5 instead of 1:2, and time the shot.', change: 'yield', nextExperiment: 'If the shot runs well outside 25–30 s, fix the timing first, as a separate change.', ruleOut: 'If the longer shot tastes thin, go halfway back.', zone: 'ideal-strong', placement: 'uncertain', placementNote: 'Without the shot time, strength and extraction can\'t be told apart.', next: { strength: 'lighter' } });
    }
    switch (state.symptom) {
      case 'sour':
        if (t === 'fast') return d({ cause: 'Under-extracted: the shot ran fast', why: 'A fast shot stops early, and an under-extracted cup tends to taste sour and thin.', changeNow: 'Grind one small step finer.', change: 'grind', nextExperiment: 'Aim for about 25–30 s. If two steps finer still runs fast, then add 0.5 g to the dose, on its own.', ruleOut: 'If it reaches 25–30 s and is still sour, the beans may be very light or very fresh; a longer shot (more yield) is the next thing to try.', zone: 'under-weak', next: { grind: 'finer' } });
        if (t === 'slow') return d({ cause: 'Channeling: water found a path through the puck', why: 'A slow shot that still tastes sour suggests most of the coffee was bypassed while a few paths over-ran.', changeNow: 'Keep the recipe; break up clumps, distribute evenly and tamp level.', hold: vars, nextExperiment: 'If the next shot is still slow and sour, grind one step coarser, keeping dose and yield.', ruleOut: 'An even, wet puck and a steady, centered stream make channeling less likely.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: most of the puck was bypassed while a few paths over-ran.', next: { tool: 'grind-guide' } });
        return d({ cause: light ? 'A light roast that needs more extraction' : 'Under-extracted at a normal shot time', why: 'On time but sour means the recipe, not the flow, is short: light and very fresh coffees often need more water through the puck.', changeNow: `Pull a longer shot: raise the yield by about a quarter (for example 36 g to 45 g).`, change: 'yield', nextExperiment: light ? 'If it is still sour, raise the brew temperature a couple of degrees, on its own.' : 'If it is still sour, grind one step finer, keeping the new yield.', ruleOut: 'If the longer shot turns thin or bitter, go halfway back.', zone: 'under-ideal', next: { strength: 'lighter' } });
      case 'bitter':
        if (t === 'slow') return d({ cause: 'Over-extracted: the shot ran slow', why: 'The tail of a long shot carries the drying, bitter compounds.', changeNow: 'Grind one small step coarser.', change: 'grind', nextExperiment: 'Aim for about 25–30 s. If it is still slow, take 0.5 g off the dose, on its own.', ruleOut: 'If it runs 25–30 s and is still bitter, the roast may be the cause; a shorter shot (less yield) is the next thing to try.', zone: 'over-strong', next: { grind: 'coarser' } });
        if (t === 'fast') return d({ cause: dark ? 'Roast bitterness, with a shot that ran fast' : 'Harshness from a fast, uneven shot', why: 'A fast shot is usually under-extracted overall, so the bitterness more likely comes from the roast or from channeling than from over-extraction.', changeNow: 'First bring the shot to 25–30 s: grind one small step finer.', change: 'grind', nextExperiment: dark ? 'Once the timing is right, if it is still bitter, pull a slightly shorter ratio (about 1:1.5) as a separate change.' : 'Once the timing is right, check puck prep: clumps and an uneven tamp cause harsh, fast shots.', ruleOut: 'If the shot on time tastes balanced, the bitterness was the fast, uneven shot.', zone: 'under-ideal', placement: 'uncertain', placementNote: dark ? 'Under-extracted overall; the bitterness is probably the roast.' : 'Under-extracted overall, with a harsh edge from an uneven shot.', next: { grind: 'finer' } });
        return d({ cause: dark ? 'Roast bitterness' : 'A little over-extracted at a normal shot time', why: dark ? 'Dark roasts carry bitter roast compounds of their own, so even a well-timed shot can taste bitter.' : 'On time but bitter suggests a little too much water through the puck for this coffee.', changeNow: 'Pull a shorter shot: 1:1.5 instead of 1:2 (for example 36 g down to 27 g).', change: 'yield', nextExperiment: dark ? 'If it is still bitter, drop the brew temperature a couple of degrees, on its own.' : 'If it is still bitter, grind one step coarser, keeping the new yield.', ruleOut: 'If the shorter shot turns sour, go halfway back.', zone: 'over-ideal', placement: dark || a.roast === 'unsure' ? 'uncertain' : 'likely', placementNote: dark ? 'A normal shot time; the bitterness may be the roast rather than over-extraction.' : a.roast === 'unsure' ? 'A normal shot time; without knowing the roast, the bitterness may be the roast rather than over-extraction.' : undefined, next: { strength: 'stronger' } });
      case 'strong':
        if (t === 'slow') return d({ cause: 'Over-extracted and heavy: the shot ran slow', why: 'A long, slow shot is both stronger and more bitter.', changeNow: 'Grind one small step coarser.', change: 'grind', nextExperiment: 'Aim for about 25–30 s before changing anything else.', ruleOut: 'If it is on time and still too intense, see the ratio.', zone: 'over-strong', next: { grind: 'coarser' } });
        if (t === 'fast') return d({ cause: 'A fast shot, so fix the timing first', why: 'A shot under 25 seconds is usually under-extracted; judge its strength once it runs 25–30 s.', changeNow: 'Grind one small step finer.', change: 'grind', nextExperiment: 'Once it runs 25–30 s, if it\'s still too intense, pull a longer ratio (1:2.5) as a separate change.', ruleOut: 'If the on-time shot tastes balanced, the speed was the problem.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Intense but fast: the timing has to settle before strength can be judged.', next: { grind: 'finer' } });
        return d({ cause: 'Espresso is intense by design; the ratio sets it', why: 'Strength comes mostly from how much liquid you take per gram of coffee.', changeNow: 'Pull a longer ratio, for example 1:2.5 instead of 1:2.', change: 'yield', nextExperiment: 'If a longer shot tastes thin or bitter, keep the shot and dilute in the cup instead.', ruleOut: 'If the longer shot tastes thin, go halfway back.', zone: 'ideal-strong', next: { strength: 'lighter' } });
      case 'gushing':
        return d({ cause: 'The grind is too coarse for this coffee', why: 'Water rushes through a coarse puck and leaves the coffee under-extracted, usually sour.', changeNow: 'Grind one small step finer.', change: 'grind', nextExperiment: light ? 'Light roasts are dense and resist extraction: you may need several steps finer.' : 'If two steps finer still gushes, add 0.5 g to the dose, on its own.', ruleOut: 'A 25–30 s shot at the same dose and yield means the grind is right.', zone: 'under-weak', next: { grind: 'finer' } });
      case 'choking':
        return d({ cause: 'The grind is too fine for this coffee', why: 'A puck that is too fine resists the water and over-extracts what does come through.', changeNow: 'Grind one small step coarser.', change: 'grind', nextExperiment: dark ? 'Dark roasts are brittle and make more fines: you may need a coarser setting than for lighter coffee.' : 'If it still chokes, take 0.5 g off the dose, on its own.', ruleOut: 'A 25–30 s shot at the same dose and yield means the grind is right.', zone: 'over-strong', next: { grind: 'coarser' } });
      case 'harsh-mixed':
        if (a.grinder === 'blade' || a.grinder === 'pre') return d({ cause: 'Uneven grounds: espresso needs a grinder made for it', why: a.grinder === 'blade' ? 'A blade grinder makes dust and chunks together. In a puck that channels: part of the coffee over-extracts while the rest is bypassed.' : 'Pre-ground coffee is ground for an average brewer and stales quickly. In a puck it channels: part of the coffee over-extracts while the rest is bypassed.', changeNow: 'Use fresh beans ground just before the shot, on a burr grinder that can grind fine enough for espresso.', change: 'grind', nextExperiment: 'Then dial in the grind one small step at a time, aiming for about 25–30 s.', ruleOut: 'Spurts or a split, uneven stream from the portafilter confirm channeling.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: part of the puck over-extracts while the rest is bypassed.', next: { tool: 'grind-guide' } });
        return d({ cause: t === 'slow' ? 'Channeling through a slow, tight puck' : 'Uneven extraction (channeling)', why: t === 'slow' ? 'A slow shot that tastes both sour and bitter usually means the puck is too tight: water forces a few channels, over-extracting them while the rest is bypassed.' : 'Part of the puck over-extracts while the rest is bypassed, so you taste both ends at once.', changeNow: 'Keep the recipe; break up clumps, distribute evenly and tamp level.', hold: vars, nextExperiment: t === 'slow' ? 'If it persists, grind one step coarser, keeping the dose and yield the same.' : t === 'fast' ? 'If it persists, grind one step finer, keeping the dose and yield the same.' : 'If it persists, check the burrs and the basket: worn burrs and an uneven basket cause channeling at any setting.', ruleOut: 'Spurts or a split, uneven stream from the portafilter confirm channeling.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: part of the puck over-extracts while the rest is bypassed.', next: { tool: 'grind-guide' } });
    }
  }

  // ── Moka pot ──
  if (fam === 'moka') {
    switch (state.symptom) {
      case 'bitter': return d({ cause: t === 'slow' ? 'Too long on the heat' : t === 'fast' ? 'Too much heat: it rushed and boiled through' : t === 'unsure' ? 'Probably too much heat at the end' : 'Too much heat at the end', ...(t === 'unsure' ? { placement: 'uncertain' as const, placementNote: 'Without the time, the heat is the likeliest cause, not a certain one.' } : {}), why: 'A moka pot pushes hotter and hotter water, then steam, through the coffee as it finishes, which pulls harsh, burnt flavors.', changeNow: 'Take the pot off the heat the moment it starts to sputter, and cool the base under a cold tap to stop it.', change: 'heat', nextExperiment: dark ? 'If it\'s still bitter, grind a touch coarser as a separate change; with a dark roast, some of the bitterness is the roast itself.' : 'If it\'s still bitter, grind a touch coarser as a separate change.', ruleOut: 'If stopping it early tastes smoother, keep doing that.', zone: 'over-strong', next: {} });
      case 'sour': return d({ cause: t === 'fast' ? 'Ran through too quickly' : t === 'unsure' ? 'Probably under-extracted' : 'Under-extracted', why: 'Sour moka coffee usually means the water passed through too fast or too cool.', changeNow: `Grind one step finer (still coarser than espresso), with the basket filled level and not tamped${t === 'unsure' ? '; time it from heat to finish next time' : ''}.`, ...(t === 'unsure' ? { placement: 'uncertain' as const, placementNote: 'Sour, but without the time the cause is a best guess.' } : {}), change: 'grind', nextExperiment: 'If it\'s still sour, use a slightly lower flame so it brews more slowly, as a separate change.', ruleOut: 'If it turns bitter, come back half a step.', zone: 'under-weak', next: { grind: 'finer' } });
      case 'weak': return d({ cause: 'Too little coffee in the basket', why: 'A moka pot is designed around a full basket; a partly filled one lets the water rush through.', changeNow: 'Fill the basket level to the top, without tamping.', change: 'dose', nextExperiment: 'If it is still weak, grind one step finer.', ruleOut: '', zone: 'ideal-weak', next: {} });
      case 'strong': return d({ cause: 'Moka coffee is concentrated by design', why: 'It sits between filter coffee and espresso in strength; under-filling the basket to weaken it makes it brew unevenly.', changeNow: 'Brew as usual and add hot water to the cup to taste.', hold: vars, nextExperiment: 'If it is also bitter, lower the heat next time.', ruleOut: '', zone: 'ideal-strong', next: {} });
      case 'harsh-mixed': return d({ cause: 'Uneven extraction', why: 'Uneven grounds or a tilted, partly filled basket let water channel through.', changeNow: 'Fill the basket level, wipe the rim clean and screw the pot tight.', hold: vars, nextExperiment: a.grinder === 'blade' ? 'A burr grinder makes much more even grounds.' : 'Then try one step coarser.', ruleOut: '', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: water channels through part of the bed.', next: {} });
      case 'muddy': return d({ cause: 'Grounds too fine for a moka pot', why: 'Very fine coffee passes the filter plate and can clog it.', changeNow: 'Grind one step coarser.', change: 'grind', nextExperiment: a.grinder === 'blade' ? 'A burr grinder makes fewer fines than a blade.' : 'Check the filter plate and gasket are clean and seated.', ruleOut: '', zone: 'over-strong', placement: 'other', placementNote: 'A texture problem: fines in the cup.', next: { grind: 'coarser' } });
    }
  }

  // ── "Not sure" of the time (filter and immersion): don't invent the premise. Start with the change
  // most likely to help whatever the time was, and ask for a timed brew next. ──
  const timing = fam === 'immersion' ? 'time the steep' : state.method === 'drip-machine' ? 'time how long the machine runs' : 'time it from the first pour to the end of drawdown';
  if (t === 'unsure' && (fam === 'percolation' || fam === 'immersion') && (state.symptom === 'sour' || state.symptom === 'bitter')) {
    const hold = vars.filter((v) => v !== 'grind' && v !== 'steep time');
    if (state.symptom === 'sour') return d({ cause: 'Probably under-extracted', why: 'Sour usually means the brew was under-extracted. Without the brew time it\'s hard to say why, so start with the change most likely to help.', changeNow: `Grind one step finer, and ${timing} on the next brew.`, change: 'grind', hold, placement: 'uncertain', placementNote: 'Sour, but without the brew time the cause is a best guess.', nextExperiment: cold ? 'If it\'s on time and still sour, steep a few hours longer as a separate change.' : fam === 'immersion' ? 'If it\'s on time and still sour, go one more step finer.' : 'If it\'s on time and still sour, use hotter water as a separate change.', ruleOut: 'If it turns bitter, come back half a step.', zone: 'under-ideal', next: { grind: 'finer' } });
    return d({ cause: 'Probably over-extracted, or the roast', why: 'Bitterness usually means too much came out, but dark roasts are bitter on their own. Without the brew time it\'s hard to tell which.', changeNow: `Grind one step coarser, and ${timing} on the next brew.`, change: 'grind', hold, nextExperiment: cold ? 'If it\'s on time and still bitter, steep a few hours less as a separate change.' : fam === 'immersion' ? 'Pour it off the grounds as soon as the steep ends; if it\'s still bitter, try a lighter roast.' : dark ? 'If it\'s on time and still bitter, try slightly cooler water as a separate change.' : 'If it\'s on time and still bitter, check for fines clogging the filter.', ruleOut: 'If it turns sour, come back half a step.', zone: 'over-ideal', placement: 'uncertain', placementNote: 'Bitter, but without the time it could be the roast rather than over-extraction.', next: { grind: 'coarser' } });
  }

  // ── Percolation (pour-over, drip) ──
  if (fam === 'percolation') {
    switch (state.symptom) {
      case 'sour':
        if (t === 'slow') return d({ cause: 'Uneven extraction: a clogged bed', why: 'Slow and sour together usually mean fines clogged the filter, so water ran around most of the coffee.', changeNow: a.grinder === 'blade' ? 'A blade grinder makes dust and boulders together; until you have a burr grinder, grind one step coarser.' : 'Grind one step coarser to clear the clog.', change: 'grind', nextExperiment: state.method === 'drip-machine' ? 'Use the right filter size and level the bed before brewing.' : 'Pour gently, keep the bed flat with a light swirl, and don\'t pour onto the paper.', ruleOut: 'If the drawdown speeds up and the cup sweetens, it was the clog.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: water ran around most of the coffee while some over-extracted.', next: { grind: 'coarser' } });
        if (t === 'fast') return d({ cause: 'Under-extracted: the water ran through too fast', why: 'Water that runs through fast extracts too little, which tends to taste sour and thin.', changeNow: 'Grind one step finer.', change: 'grind', nextExperiment: light ? 'If it is still sour, go one step finer again; light roasts also want the hot end of the range, as a separate change.' : 'If it is still sour, go one step finer again.', ruleOut: 'If it turns bitter, you went too far: come back half a step.', zone: 'under-weak', next: { grind: 'finer' } });
        return d({ cause: 'Under-extracted at a normal brew time', why: 'On time but sour usually means the water was too cool or the coffee is a dense, light roast.', changeNow: state.method === 'drip-machine' ? 'Grind one step finer; most machines don\'t let you change the temperature.' : `Use hotter water, about ${adjustedTempC(m, 'hotter', roastOf)} °C (right off the boil).`, change: state.method === 'drip-machine' ? 'grind' : 'temperature', nextExperiment: state.method === 'drip-machine' ? 'If it is still sour, go one more step finer; if it never sweetens, the machine may brew too cool, which the grind can only partly make up for.' : 'If it is still sour, grind one step finer as a separate change.', ruleOut: 'If it turns bitter, go halfway back.', zone: 'under-ideal', next: state.method === 'drip-machine' ? { grind: 'finer' } : { temp: 'hotter' } });
      case 'bitter':
        if (t === 'slow') return d({ cause: 'Over-extracted: the brew ran long', why: 'The last compounds to dissolve are the bitter, drying ones.', changeNow: 'Grind one step coarser.', change: 'grind', nextExperiment: dark ? 'With a dark roast, slightly cooler water can help too, as a separate change.' : 'If it is still bitter, check for fines clogging the filter.', ruleOut: 'If it turns sour, come back half a step.', zone: 'over-strong', next: { grind: 'coarser' } });
        if (t === 'fast' && dark) return d({ cause: 'Roast bitterness, not over-extraction', why: 'A fast brew usually isn\'t over-extracted overall, so the bitterness more likely comes from the roast.', changeNow: state.method === 'drip-machine' ? 'Use a lighter ratio: a little less coffee for the same water.' : `Brew with slightly cooler water, about ${adjustedTempC(m, 'cooler', roastOf)} °C.`, change: state.method === 'drip-machine' ? 'dose' : 'temperature', nextExperiment: 'A lighter roast is the bigger change if you want less bitterness overall.', ruleOut: 'If the change helps, keep it.', zone: 'under-ideal', placement: 'uncertain', placementNote: 'Not over-extracted overall; the bitterness is the roast.', next: state.method === 'drip-machine' ? { strength: 'lighter' } : { temp: 'cooler' } });
        if (t === 'fast') return d({ cause: 'Harshness from uneven flow, not a long brew', why: 'A fast brew usually isn\'t over-extracted overall; a harsh edge more likely means water rushed through channels, over-extracting a little of the coffee and bypassing the rest.', changeNow: state.method === 'drip-machine' ? 'Level the bed before brewing and check the spray head wets all of it.' : 'Pour more slowly and evenly, in small circles, so the water goes through the coffee rather than around it.', change: state.method === 'drip-machine' ? undefined : 'pour', hold: state.method === 'drip-machine' ? vars : undefined, nextExperiment: a.roast === 'unsure' ? 'If it stays harsh, the roast may be darker than it looks: try slightly cooler water as a separate change.' : 'A blade grinder\'s dust causes the same harshness; a burr grinder fixes it.', ruleOut: 'If an even pour tastes balanced, the flow was the problem.', zone: 'under-ideal', placement: 'uncertain', placementNote: 'Uneven: water rushed through channels.', next: { tool: 'grind-guide' } });
        return d({ cause: dark ? 'Roast bitterness' : 'Over-extracted at a normal brew time', why: dark ? 'Dark roasts carry bitter roast compounds of their own, so even a brew on time can taste bitter.' : 'On time but bitter suggests the grind is a little fine or the water a little hot for this coffee.', changeNow: 'Grind one step coarser.', change: 'grind', nextExperiment: 'If it is still bitter, use slightly cooler water as a separate change.', ruleOut: 'If it turns sour, come back half a step.', zone: 'over-ideal', placement: dark || a.roast === 'unsure' ? 'uncertain' : 'likely', placementNote: dark ? 'A normal brew time; the bitterness may be the roast rather than over-extraction.' : a.roast === 'unsure' ? 'A normal brew time; without knowing the roast, the bitterness may be the roast rather than over-extraction.' : undefined, next: { grind: 'coarser' } });
      case 'harsh-mixed':
        if (t === 'slow' && a.grinder === 'burr') return d({ cause: 'Uneven extraction: a clogged bed', why: 'A slow brew that tastes both sour and bitter usually means fines clogged the filter: water stalled in some of the coffee, over-extracting it, and ran around the rest.', changeNow: 'Grind one step coarser to clear the clog.', change: 'grind', nextExperiment: state.method === 'drip-machine' ? 'Use the right filter size and level the bed before brewing.' : 'Pour gently and don\'t pour onto the paper, so the fines stay in the bed.', ruleOut: 'If the drawdown speeds up and the cup tastes cleaner, it was the clog.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: water stalled in some of the coffee and ran around the rest.', next: { grind: 'coarser' } });
        return d({ cause: 'Uneven extraction', why: 'Some grounds over-extract while others barely extract, so you taste both bitter and sour.', changeNow: a.grinder === 'blade' || a.grinder === 'pre' ? 'Use a burr grinder; a blade makes dust and boulders together, and pre-ground coffee is ground for an average brewer.' : state.method === 'drip-machine' ? 'Level the bed and check the spray head wets it evenly.' : 'Pour evenly and swirl to keep the bed flat.', hold: a.grinder === 'blade' || a.grinder === 'pre' ? vars.filter((v) => v !== 'grind') : vars.filter((v) => v !== 'pour'), change: a.grinder === 'blade' || a.grinder === 'pre' ? 'grind' : 'pour', nextExperiment: 'Then fine-tune the grind one step at a time.', ruleOut: 'If the cup is clean but simply sour or bitter, see those symptoms.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: some grounds over-extract while others barely extract.', next: { tool: 'grind-guide' } });
      case 'muddy':
        return d({ cause: 'Fines getting through', why: 'Paper filters usually hold fines back, so a muddy pour-over points at a torn or wrong-size filter or very fine grounds.', changeNow: 'Grind one step coarser and check the filter is the right size and seated.', change: 'grind', nextExperiment: a.grinder === 'blade' ? 'A burr grinder makes fewer fines than a blade.' : 'Rinse the paper before brewing.', ruleOut: '', zone: 'over-strong', placement: 'other', placementNote: 'A texture problem: fines in the cup.', next: { grind: 'coarser' } });
    }
  }

  // ── Immersion (French press, AeroPress, cold brew): no drawdown, so time is steep time ──
  if (fam === 'immersion') {
    switch (state.symptom) {
      case 'sour':
        if (t === 'fast') return d({ cause: 'Steeped too briefly', why: 'A short steep extracts too little, and an under-extracted cup tends to taste sour.', changeNow: steepLonger(state.method), change: 'steep time', nextExperiment: 'If it is still sour at the full steep, grind one step finer as a separate change.', ruleOut: 'If it tastes sweeter, keep the longer steep.', zone: 'under-weak', next: {} });
        return d({ cause: 'Under-extracted', why: cold ? 'Cold water extracts slowly; a coarse grind or a cold room slows it further.' : t === 'slow' ? 'A long steep that is still sour usually means the grind is coarse or the water was cool.' : 'A full steep that is still sour usually means the grind is coarse or the water was cool.', changeNow: 'Grind one step finer.', change: 'grind', nextExperiment: cold ? 'If it is still sour, steep a few hours longer as a separate change.' : 'If it is still sour, go one more step finer.', ruleOut: 'If it turns bitter, come back half a step.', zone: 'under-ideal', next: { grind: 'finer' } });
      case 'bitter':
        if (t === 'slow') return d({ cause: 'Steeped too long', why: 'The longer coffee sits in water, the more of the bitter, drying compounds come out.', changeNow: `Steep for the recipe's ${fmt(steepWindow(state.method).recipe)}${cold ? '' : state.method === 'aeropress' ? ', then press straight away' : ', then pour it all off the grounds straight away'}.`, change: 'steep time', nextExperiment: state.method === 'french-press' ? 'Coffee left in the press keeps extracting: decant into a cup or carafe.' : 'If it is still bitter at the normal steep, grind one step coarser as a separate change.', ruleOut: 'If it tastes smoother, keep the shorter steep.', zone: 'over-strong', next: {} });
        if (t === 'fast' && (!dark || cold)) return d({ cause: 'Bitter after a short steep: fine particles or the roast', why: 'A short steep usually isn\'t over-extracted overall. Very fine particles extract fastest and can bring bitterness, and darker roasts are bitter on their own.', changeNow: 'Grind one step coarser, keeping the same steep time.', change: 'grind', nextExperiment: cold ? 'If it stays bitter, try a lighter roast.' : 'If it stays bitter, use slightly cooler water as a separate change.', ruleOut: 'If the coarser grind tastes cleaner, the fines were the cause.', zone: 'under-ideal', placement: 'uncertain', placementNote: 'A short steep, so probably not over-extracted overall.', next: { grind: 'coarser' } });
        if (t === 'fast' && dark && !cold) return d({ cause: 'Roast bitterness, not over-extraction', why: 'A short steep usually isn\'t over-extracted, so the bitterness more likely comes from the roast itself.', changeNow: `Use slightly cooler water, about ${adjustedTempC(m, 'cooler', roastOf)} °C.`, change: 'temperature', nextExperiment: 'A lighter roast is the bigger change if you want less bitterness overall.', ruleOut: 'If it helps, keep it.', zone: 'under-ideal', placement: 'uncertain', placementNote: 'Not over-extracted overall; the bitterness is the roast.', next: { temp: 'cooler' } });
        return d({ cause: dark ? 'Roast bitterness' : 'Over-extracted', why: dark ? 'Dark roasts carry roast bitterness of their own, even at the usual steep.' : 'At the usual steep, bitterness suggests the grind is a little fine for this coffee.', changeNow: 'Grind one step coarser.', change: 'grind', nextExperiment: cold ? 'If it is still bitter, steep a few hours less as a separate change.' : state.method === 'french-press' && !settled ? 'Pour the coffee off the grounds as soon as you press.' : 'If it is still bitter, use slightly cooler water as a separate change.', ruleOut: 'If it turns sour, come back half a step.', zone: 'over-ideal', placement: dark || a.roast === 'unsure' ? 'uncertain' : 'likely', placementNote: dark ? 'The usual steep time; the bitterness may be the roast rather than over-extraction.' : a.roast === 'unsure' ? 'The usual steep time; without knowing the roast, the bitterness may be the roast rather than over-extraction.' : undefined, next: { grind: 'coarser' } });
      case 'harsh-mixed':
        return d({ cause: 'Uneven extraction', why: 'A mix of dust and large pieces means some grounds over-extract while others barely start.', changeNow: a.grinder === 'blade' || a.grinder === 'pre' ? 'Use a burr grinder for more even grounds.' : 'Stir once after adding the water so every ground is wet, then leave it.', change: a.grinder === 'blade' || a.grinder === 'pre' ? 'grind' : undefined, hold: a.grinder === 'blade' || a.grinder === 'pre' ? undefined : vars, nextExperiment: 'Then fine-tune the grind one step at a time.', ruleOut: 'If the cup is clean but simply sour or bitter, see those symptoms.', zone: 'under-strong', placement: 'uncertain', placementNote: 'Uneven: dust over-extracts while large pieces barely start.', next: { tool: 'grind-guide' } });
      case 'muddy':
        return d({ cause: 'Fines in the cup', why: state.method === 'aeropress' ? 'A paper-filtered AeroPress cup is usually clean, so muddiness points to a metal filter or very fine grounds.' : 'Mesh and cloth filters let the finest particles through.', changeNow: state.method === 'french-press' ? 'Same recipe: after pressing, wait a minute and pour gently, leaving the last bit in the press.' : 'Grind one step coarser.', change: state.method === 'french-press' ? undefined : 'grind', hold: state.method === 'french-press' ? vars : undefined, nextExperiment: a.grinder === 'blade' ? 'A burr grinder makes fewer fines than a blade.' : 'For a much cleaner cup, pour through a paper filter.', ruleOut: '', zone: 'over-strong', placement: 'other', placementNote: 'A texture problem: fines in the cup.', next: state.method === 'french-press' ? {} : { grind: 'coarser' } });
    }
  }

  // ── Strength (filter, moka handled above): weak and too strong ──
  // Pods and machine-set doses: the reader can't change the grind, so the fix is the amount.
  if (a.measure === 'machine' && (state.symptom === 'weak' || state.symptom === 'strong')) {
    const weak = state.symptom === 'weak';
    return d({ cause: weak ? 'Too little coffee for the water' : 'Too much coffee for the water', why: 'When the machine or a pod sets the dose, the grind is fixed, so strength comes down to how much water goes through that coffee.', changeNow: weak ? 'Use a smaller cup size or less water for the same coffee, or the machine\'s strong setting if it has one.' : 'Use a larger cup size or more water for the same coffee, or add hot water to the cup.', change: 'water', hold: vars.filter((v) => v !== 'water' && v !== 'grind'), nextExperiment: weak ? 'If you fill the basket yourself, add a little more coffee as a separate change.' : 'If you fill the basket yourself, use a little less coffee as a separate change.', ruleOut: '', zone: weak ? 'ideal-weak' : 'ideal-strong', next: {} });
  }
  if (state.symptom === 'weak') {
    // Cold brew brewed ready to drink has no serving water to cut back: its strength is the brew's own ratio (item 33).
    const ready = cold && a.serve === 'ready';
    if (ready && a.measure !== 'scoop' && t !== 'fast') return d({ cause: t === 'unsure' ? 'Probably too little coffee for the water' : 'Too little coffee for the water', why: 'A cold brew made ready to drink gets all its strength from the brew itself: nothing is diluted afterwards, so the ratio of coffee to water sets it.', changeNow: `Use a little more coffee for the same water, and keep the steep the same${t === 'unsure' ? '; time the steep next time too' : ''}.`, change: 'dose', hold: vars.filter((v) => v !== 'dose' && (t !== 'unsure' || v !== 'steep time')), nextExperiment: 'Or brew it as a concentrate, as the Brew Guide does, and set the strength in the glass with water or milk.', ruleOut: 'If it turns harsh as well as strong, grind slightly coarser.', zone: 'ideal-weak', ...(t === 'unsure' ? { placement: 'uncertain' as const, placementNote: 'Weak, but without the steep time it could be a short steep rather than the ratio.' } : {}), next: {} });
    if (a.measure === 'scoop') return d({ cause: 'Not enough coffee, measured by volume', why: 'Scoops vary a lot with the bean and grind; weak usually means fewer grams than intended.', changeNow: 'Weigh the coffee: use the Brew Guide amount for your cup.', change: 'dose', nextExperiment: 'Then adjust strength with the ratio, not by guessing scoops.', ruleOut: 'If a weighed dose is still weak, look at the brew time.', zone: 'ideal-weak', next: {} });
    if (t === 'fast' && fam === 'percolation') return d({ cause: 'Weak and under-extracted', why: 'Water passed through too quickly to dissolve enough.', changeNow: 'Grind one step finer.', change: 'grind', nextExperiment: 'If it is still weak but no longer sour, use a stronger ratio as a separate change.', ruleOut: '', zone: 'under-weak', next: { grind: 'finer' } });
    if (t === 'fast' && fam === 'immersion') return d({ cause: 'Steeped too briefly', why: 'A short steep leaves the cup thin as well as sour.', changeNow: steepLonger(state.method), change: 'steep time', nextExperiment: 'If it is still weak, use a stronger ratio as a separate change.', ruleOut: '', zone: 'under-weak', next: {} });
    if (t === 'unsure') return d({ cause: cold ? 'Probably diluted too far' : 'Probably too dilute: a ratio problem', why: `${cold ? 'Cold brew concentrate is diluted to serve; strength depends on how much water goes in.' : 'Strength is set mostly by the ratio of coffee to water.'} A brew that ran short can taste weak too, so time the next one.`, changeNow: cold ? `Add less water or milk to the concentrate when you serve it, and ${timing} next time.` : `Use more coffee for the same water, one step stronger (for example 1:${m.ratio.classic} to 1:${m.ratio.stronger}), and ${timing} on the next brew.`, change: cold ? 'dilution' : 'dose', hold: vars.filter((v) => v !== (cold ? 'dilution' : 'dose') && v !== 'steep time'), nextExperiment: `If the timed brew comes in short, ${fam === 'immersion' ? 'steep for the full time' : 'grind one step finer'} as a separate change.`, ruleOut: 'If it turns harsh as well as strong, grind slightly coarser.', zone: 'ideal-weak', placement: 'uncertain', placementNote: 'Weak, but without the brew time it could be a short brew rather than the ratio.', next: cold ? {} : { strength: 'stronger' } });
    return d({ cause: cold ? 'Diluted too far' : 'Too dilute: a ratio problem', why: cold ? 'Cold brew concentrate is diluted to serve; strength depends on how much water goes in.' : 'Strength is set mostly by the ratio of coffee to water; extraction can be fine and the cup still weak.', changeNow: cold ? 'Add less water or milk to the concentrate when you serve it.' : `Use more coffee for the same water, one step stronger (for example 1:${m.ratio.classic} to 1:${m.ratio.stronger}).`, change: cold ? 'dilution' : 'dose', nextExperiment: cold ? 'If it\'s still weak with little added, brew a stronger concentrate (more coffee) next time.' : 'Move one step at a time.', ruleOut: 'If it turns harsh as well as strong, grind slightly coarser.', zone: 'ideal-weak', next: cold ? {} : { strength: 'stronger' } });
  }
  if (state.symptom === 'strong') {
    if (a.measure === 'scoop') return d({ cause: 'More coffee than intended, measured by volume', why: 'Scoops vary with the bean and grind; a heaped scoop of dense beans can be far more coffee than the recipe means.', changeNow: 'Weigh the coffee: use the Brew Guide amount for your cup.', change: 'dose', nextExperiment: 'Then adjust strength with the ratio.', ruleOut: '', zone: 'ideal-strong', next: {} });
    if (t === 'slow' && fam === 'percolation') return d({ cause: 'Over-extracted and heavy: the brew ran long', why: 'A slow brew makes the cup both stronger and more bitter.', changeNow: 'Grind one step coarser.', change: 'grind', nextExperiment: 'If it is on time and still too strong, use a lighter ratio as a separate change.', ruleOut: '', zone: 'over-strong', next: { grind: 'coarser' } });
    if (t === 'unsure') return d({ cause: 'Probably too concentrated: a ratio problem', why: 'Strength is set mostly by the ratio of coffee to water, but a brew that ran long comes out heavier too, so time the next one.', changeNow: `Use a little less coffee for the same water, one step lighter (for example 1:${m.ratio.classic} to 1:${m.ratio.lighter}), and ${timing} on the next brew.`, change: 'dose', nextExperiment: 'If the timed brew runs long, grind one step coarser as a separate change.', ruleOut: 'If it turns thin and sour, go halfway back.', zone: 'ideal-strong', placement: 'uncertain', placementNote: 'Strong, but without the brew time it could be a long brew rather than the ratio.', next: { strength: 'lighter' } });
    return d({ cause: 'Too concentrated: a ratio problem', why: 'Strength is set mostly by the ratio of coffee to water.', changeNow: cold ? 'Add a little more water or milk when you serve it.' : `Use a little less coffee for the same water, one step lighter (for example 1:${m.ratio.classic} to 1:${m.ratio.lighter}).`, change: cold ? 'dilution' : 'dose', nextExperiment: 'Move one step at a time.', ruleOut: 'If it turns thin and sour, go halfway back.', zone: 'ideal-strong', next: cold ? {} : { strength: 'lighter' } });
  }
  return failure('no-diagnosis', 'symptom', 'Try another symptom.');
}

/**
 * The Brew Guide link for a diagnosis: the standard recipe for this brewer (and the reader's roast,
 * their baseline) with the one change on top. Sizes match the Brew Guide's chips (12 oz is 354.9 ml)
 * so the link lands on a chip; if the changed recipe doesn't fit that size, the next chip down that
 * does (a stronger 8 oz AeroPress needs more coffee than one press holds; Muse r4).
 */
export function brewLinkFor(method: MethodId, d: Diagnosis, roast?: string): string {
  const q = new URLSearchParams({ method });
  const r1 = (n: number) => String(Math.round(n * 10) / 10);
  const strength = d.next.strength ?? 'classic';
  if (method === 'espresso' || method === 'moka' || method === 'phin') q.set('dose', method === 'espresso' ? '18' : method === 'moka' ? '15' : '14');
  else {
    const sizes = method === 'cold-brew' || method === 'drip-machine' ? [32, 16] : method === 'aeropress' ? [8, 6] : [12, 10, 8];
    // "More (or less) coffee for the same water": keep the standard recipe's water, so only the coffee changes (Opus r4).
    const sameWater = d.change === 'dose' && d.next.strength;
    const targetFor = (oz: number) => {
      if (!sameWater) return { cupMl: flOzToMl(oz) };
      const std = buildRecipe({ method, target: { cupMl: flOzToMl(oz) } });
      return std.ok && std.value.waterG ? { waterG: std.value.waterG } : { cupMl: flOzToMl(oz) };
    };
    const fit = sizes.map(targetFor).find((t) => buildRecipe({ method, target: t, strength }).ok) ?? targetFor(sizes[sizes.length - 1]);
    if ('waterG' in fit) q.set('water', r1(fit.waterG)); else q.set('cup', r1(fit.cupMl));
  }
  if (d.next.strength) q.set('strength', strengthParam(method, d.next.strength));
  if (roast === 'light' || roast === 'dark') q.set('roast', roast);
  const adj = d.next.grind ?? d.next.temp ?? (d.next.strength ? 'ratio' : undefined);
  if (adj) q.set('adjust', adj);
  return `/tools/brew-ratio/?${q}`;
}

// ── Extraction map ──
export type ZoneId = `${'under' | 'ideal' | 'over'}-${'weak' | 'ideal' | 'strong'}`;

/**
 * Where a symptom usually sits before the reader has answered anything: a starting guess the map shows as such,
 * never as "probably" this cup (Wave D batch 32). Flat, off and muddy are never extraction problems in any
 * diagnosis here, so they get no zone at all.
 */
export const SYMPTOM_ZONE: Record<SymptomId, ZoneId | null> = {
  sour: 'under-ideal', bitter: 'over-ideal', weak: 'ideal-weak', strong: 'ideal-strong', 'harsh-mixed': 'under-strong',
  bright: 'ideal-ideal', flat: null, off: null, muddy: null, gushing: 'under-weak', choking: 'over-strong',
  'drip-fast': 'under-weak', 'drip-stall': 'over-ideal',
};
export interface Zone { id: ZoneId; label: string; tastes: string; moves: string[] }

export const ZONES: Record<ZoneId, Zone> = {
  'under-weak': { id: 'under-weak', label: 'Under-extracted and weak', tastes: 'Sour and watery', moves: ['Grind finer', 'Use more coffee'] },
  'under-ideal': { id: 'under-ideal', label: 'Under-extracted', tastes: 'Sour, body about right', moves: ['Grind finer', 'Hotter water', 'Longer contact'] },
  'under-strong': { id: 'under-strong', label: 'Under-extracted and strong', tastes: 'Sour but intense; often channeling', moves: ['Even out the bed', 'Grind a touch coarser to stop clogging', 'Then fine-tune'] },
  'ideal-weak': { id: 'ideal-weak', label: 'Well extracted, too dilute', tastes: 'Pleasant but thin', moves: ['Use more coffee (stronger ratio)'] },
  'ideal-ideal': { id: 'ideal-ideal', label: 'Sweet spot', tastes: 'Sweet, balanced, clear', moves: ['Keep it: write down this recipe'] },
  'ideal-strong': { id: 'ideal-strong', label: 'Well extracted, too strong', tastes: 'Heavy and intense', moves: ['Use more water (lighter ratio)'] },
  'over-weak': { id: 'over-weak', label: 'Over-extracted and weak', tastes: 'Bitter and thin, like stewed diner coffee', moves: ['Grind coarser', 'Use more coffee'] },
  'over-ideal': { id: 'over-ideal', label: 'Over-extracted', tastes: 'Bitter, drying finish', moves: ['Grind coarser', 'Cooler water', 'Shorter contact'] },
  'over-strong': { id: 'over-strong', label: 'Over-extracted and strong', tastes: 'Harsh and heavy', moves: ['Grind coarser', 'Use more water'] },
};

/** Taste sliders −2..2 (sour→bitter, thin→heavy) to a zone and a point on a 0..1 map. */
export function placeOnMap(taste: { sourBitter: number; body: number }): { zone: ZoneId; x: number; y: number } {
  const clamp = (v: number) => Math.max(-2, Math.min(2, Number.isFinite(v) ? v : 0));
  const sb = clamp(taste.sourBitter), b = clamp(taste.body);
  const e = sb <= -0.75 ? 'under' : sb >= 0.75 ? 'over' : 'ideal';
  const s = b <= -0.75 ? 'weak' : b >= 0.75 ? 'strong' : 'ideal';
  return { zone: `${e}-${s}` as ZoneId, x: (sb + 2) / 4, y: (b + 2) / 4 };
}

// Levers: what each brewing change does on the map, in slider units (−2..2). Qualitative and
// illustrative: grind, temperature and time move extraction; the ratio moves strength most,
// and more coffee per water slightly lowers extraction (synthesis §1, Easto, Gagné).
export interface Lever { id: string; label: string; dx: number; dy: number; espresso?: string; /** Espresso's own movement, where it differs. */ esp?: { dx: number; dy: number } }
export const LEVERS: Lever[] = [
  { id: 'finer', label: 'Grind finer', dx: 0.6, dy: 0.15 },
  { id: 'coarser', label: 'Grind coarser', dx: -0.6, dy: -0.15 },
  { id: 'hotter', label: 'Hotter water', dx: 0.35, dy: 0.05 },
  { id: 'cooler', label: 'Cooler water', dx: -0.35, dy: -0.05 },
  // Espresso yield moves strength most: a longer shot is weaker, a shorter one stronger (blind Opus r5).
  { id: 'longer', label: 'Longer contact', dx: 0.4, dy: 0.1, espresso: 'Longer shot (more yield)', esp: { dx: 0.35, dy: -0.55 } },
  { id: 'shorter', label: 'Shorter contact', dx: -0.4, dy: -0.1, espresso: 'Shorter shot (less yield)', esp: { dx: -0.35, dy: 0.55 } },
  { id: 'more-coffee', label: 'More coffee, same water', dx: -0.12, dy: 0.6, espresso: 'Bigger dose' },
  { id: 'more-water', label: 'More water, same coffee', dx: 0.12, dy: -0.6, espresso: 'Smaller dose' },
];

/** How a lever moves the cup, for this kind of brew. */
export const leverMove = (l: Lever, espresso = false) => (espresso && l.esp ? l.esp : { dx: l.dx, dy: l.dy });

/** Levers that move a cup at (sourBitter, body) toward the sweet spot, best first. */
export function suggestLevers(taste: { sourBitter: number; body: number }, espresso = false): Lever[] {
  const tx = -taste.sourBitter, ty = -taste.body;
  return LEVERS.map((l) => { const m = leverMove(l, espresso); return { l, score: m.dx * tx + m.dy * ty }; }).filter((s) => s.score > 0.05).sort((a, b) => b.score - a.score).map((s) => s.l);
}
