import type { MethodId, Result, Strength } from './types.ts';
import { methodById } from './methods.ts';
import { failure, success } from './units.ts';

// Coffee Doctor (Fix My Coffee) and Extraction Map share this module.
// Science: extraction order — acids first, then sugars and Maillard products, then bitter
// compounds (synthesis §1, §14, Gagné); espresso dial-in by shot time and yield (§7, Rao).
// The map is qualitative: taste cannot give a TDS or extraction reading.

export type SymptomId = 'sour' | 'bitter' | 'weak' | 'harsh-mixed' | 'flat' | 'muddy' | 'gushing' | 'choking';

export interface Symptom { id: SymptomId; label: string; tagline: string; espresso: boolean; filter: boolean }
export const SYMPTOMS: Symptom[] = [
  { id: 'sour', label: 'Sour', tagline: 'Sharp, tangy, thin, like under-ripe fruit', espresso: true, filter: true },
  { id: 'bitter', label: 'Bitter', tagline: 'Harsh, ashy, drying finish', espresso: true, filter: true },
  { id: 'weak', label: 'Weak', tagline: 'Watery, thin, not enough coffee', espresso: false, filter: true },
  { id: 'harsh-mixed', label: 'Sour and bitter', tagline: 'Both at once, hollow in the middle', espresso: true, filter: true },
  { id: 'flat', label: 'Flat', tagline: 'Dull, papery, no aroma', espresso: true, filter: true },
  { id: 'muddy', label: 'Muddy', tagline: 'Silty, gritty, heavy sludge', espresso: false, filter: true },
  { id: 'gushing', label: 'Runs too fast', tagline: 'Shot pours in under 20 seconds', espresso: true, filter: false },
  { id: 'choking', label: 'Barely drips', tagline: 'Shot drips slowly or not at all', espresso: true, filter: false },
];

export interface Option { id: string; label: string }
export interface Question { id: QuestionId; text: string; options: Option[] }
export type QuestionId = 'time' | 'roast' | 'grinder' | 'age' | 'water' | 'measure' | 'shot';

export interface DoctorState { method: MethodId; symptom: SymptomId; answers: Partial<Record<QuestionId, string>> }

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

function question(id: QuestionId, method: MethodId): Question {
  const m = methodById(method);
  switch (id) {
    case 'time': {
      const t = m?.timeS ?? { min: 180, max: 240 };
      return { id, text: `How long did the brew take, start to finish? Target for ${m?.label ?? 'this method'} is about ${fmt(t.min)}–${fmt(t.max)}.`,
        options: [{ id: 'fast', label: `Faster than ${fmt(t.min)}` }, { id: 'ok', label: 'About on target' }, { id: 'slow', label: `Longer than ${fmt(t.max)}` }, { id: 'unsure', label: 'Not sure' }] };
    }
    case 'shot':
      return { id, text: 'How long did the shot run, from pressing the button to stopping it?',
        options: [{ id: 'fast', label: 'Under 20 seconds' }, { id: 'ok', label: '20–35 seconds' }, { id: 'slow', label: 'Over 35 seconds' }] };
    case 'roast':
      return { id, text: 'How dark is the roast?', options: [{ id: 'light', label: 'Light' }, { id: 'medium', label: 'Medium' }, { id: 'dark', label: 'Dark or oily' }, { id: 'unsure', label: 'Not sure' }] };
    case 'grinder':
      return { id, text: 'What ground the coffee?', options: [{ id: 'burr', label: 'A burr grinder' }, { id: 'blade', label: 'A blade grinder' }, { id: 'pre', label: 'Bought pre-ground' }] };
    case 'age':
      return { id, text: 'When was it roasted?', options: [{ id: 'fresh', label: 'Within the last month' }, { id: 'old', label: 'More than six weeks ago' }, { id: 'ground', label: 'It was ground days ago' }, { id: 'unsure', label: 'No date on the bag' }] };
    case 'water':
      return { id, text: 'What water did you use?', options: [{ id: 'tap', label: 'Tap or filtered tap' }, { id: 'bottled', label: 'Bottled spring water' }, { id: 'pure', label: 'Distilled or reverse osmosis' }] };
    case 'measure':
      return { id, text: 'How did you measure the coffee?', options: [{ id: 'scale', label: 'On a scale' }, { id: 'scoop', label: 'Scoops or spoons' }, { id: 'machine', label: 'A pod or the machine decided' }] };
  }
}

/** Which questions each symptom asks, in order. Espresso uses shot time instead of brew time. */
function questionIds(state: DoctorState): QuestionId[] {
  const esp = state.method === 'espresso';
  switch (state.symptom) {
    case 'sour': return esp ? ['shot', 'roast'] : ['time', 'roast', 'grinder'];
    case 'bitter': return esp ? ['shot', 'roast'] : ['time', 'roast'];
    case 'weak': return ['measure', 'time'];
    case 'harsh-mixed': return esp ? ['shot', 'grinder'] : ['grinder', 'time'];
    case 'flat': return ['age', 'water'];
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

export interface Diagnosis {
  cause: string;
  why: string;
  changeNow: string;
  nextExperiment: string;
  ruleOut: string;
  /** Where the cup likely sits on the extraction map. */
  zone: ZoneId;
  /** What to carry into the Brew Guide for the next brew. */
  next: { grind?: 'finer' | 'coarser'; strength?: Strength; temp?: 'hotter' | 'cooler'; tool?: string };
  sourceIds: string[];
}

const S = ['synthesis', 'gagne', 'rao'];

export function diagnose(state: DoctorState): Result<Diagnosis> {
  const m = methodById(state.method);
  if (!m) return failure('unknown-method', 'method', 'Choose how you brewed it.');
  const sym = SYMPTOMS.find((s) => s.id === state.symptom);
  if (!sym) return failure('unknown-symptom', 'symptom', 'Choose what tastes wrong.');
  const esp = state.method === 'espresso';
  if ((esp && !sym.espresso) || (!esp && !sym.filter)) return failure('symptom-method', 'symptom', `That symptom doesn't apply to ${m.label}.`);
  const missing = nextQuestion(state);
  if (missing) return failure('needs-answer', missing.id, missing.text);
  const a = state.answers;
  const d = (x: Omit<Diagnosis, 'sourceIds'>): Result<Diagnosis> => success({ ...x, sourceIds: S });

  if (esp) {
    const shot = a.shot;
    switch (state.symptom) {
      case 'sour':
      case 'gushing':
        if (shot === 'slow' && state.symptom === 'sour') return d({ cause: 'Water is finding a channel through the puck', why: 'A slow shot that still tastes sour usually means most of the coffee was bypassed while a few paths over-ran.', changeNow: 'Break up clumps and level the grounds before tamping (a needle tool helps), then tamp level.', nextExperiment: 'Keep the grind; if it stays sour, add 0.5 g to the dose.', ruleOut: 'If the puck looks even and wet all over afterwards, channeling is less likely.', zone: 'under-strong', next: { tool: 'grind-guide' } });
        return d({ cause: 'Under-extracted: the shot ran too fast', why: 'Acids dissolve first; a fast shot stops before the sugars and caramel notes come through.', changeNow: 'Grind finer, one small step, keeping the same dose and yield.', nextExperiment: a.roast === 'light' ? 'Light roasts often taste best a little longer: try a 1:2.5 ratio at the hotter end (95 °C).' : 'If it is still fast after two steps, add 0.5–1 g to the dose.', ruleOut: 'If it reaches 25–30 s and is still sour, the beans may be very light or very fresh; rest them a few more days.', zone: 'under-weak', next: { grind: 'finer', ...(a.roast === 'light' ? { temp: 'hotter' as const, strength: 'lighter' as Strength } : {}) } });
      case 'bitter':
      case 'choking':
        return d({ cause: 'Over-extracted: the shot ran too slowly', why: 'The last part of a long shot carries the drying, bitter compounds.', changeNow: 'Grind coarser, one small step, keeping the same dose and yield.', nextExperiment: a.roast === 'dark' ? 'Dark roasts extract easily: try the cooler end (91 °C) and a shorter 1:1.5–1:2 ratio.' : 'If it is still slow, take 0.5–1 g off the dose.', ruleOut: 'If it runs 25–30 s and is still bitter, the roast itself may be the bitterness; try a shorter ratio.', zone: 'over-strong', next: { grind: 'coarser', ...(a.roast === 'dark' ? { temp: 'cooler' as const, strength: 'stronger' as Strength } : {}) } });
      case 'harsh-mixed':
        return d({ cause: 'Uneven extraction (channeling)', why: 'Part of the puck over-extracts while the rest is bypassed, so you taste both ends at once.', changeNow: 'Distribute the grounds evenly and tamp level; check the basket isn\'t over- or under-filled.', nextExperiment: a.grinder === 'blade' || a.grinder === 'pre' ? 'Espresso needs fresh, even, fine grounds from a burr grinder made for it.' : 'If it persists, grind a step finer and lower the dose by 0.5 g.', ruleOut: 'Spurts or a split, uneven stream from the portafilter confirm channeling.', zone: 'under-strong', next: {} });
      case 'flat':
        return flat();
    }
  }

  function flat(): Result<Diagnosis> {
    if (a.age === 'old' || a.age === 'ground') return d({ cause: 'Stale coffee', why: 'Aroma compounds fade within weeks of roasting, and within minutes to hours once ground.', changeNow: 'Use beans roasted within the last month and grind just before brewing.', nextExperiment: 'Store beans airtight away from light; freeze what you won\'t use within two weeks.', ruleOut: 'If fresh beans still taste flat, look at the water.', zone: 'ideal-weak', next: { tool: 'freshness' } });
    if (a.water === 'pure') return d({ cause: 'Water with no minerals', why: 'Distilled and RO water lack the minerals that pull flavour out of coffee, so cups taste flat and hollow.', changeNow: 'Brew with filtered tap or spring water, or add minerals to RO water.', nextExperiment: 'Try a mineral recipe from the Water Recipe Builder.', ruleOut: 'If mineral water fixes it, keep the recipe.', zone: 'under-weak', next: { tool: 'water' } });
    return d({ cause: 'Flat flavour: freshness or water', why: 'With the brew on target, dullness usually comes from tired beans or water that is too soft or too hard.', changeNow: 'Check the roast date first; then try a different water.', nextExperiment: 'Brew the same coffee with bottled spring water to isolate the water.', ruleOut: 'If both are fine, try a brighter, lighter-roasted coffee.', zone: 'ideal-weak', next: { tool: 'freshness' } });
  }

  const t = a.time;
  switch (state.symptom) {
    case 'sour':
      if (t === 'slow') return d({ cause: 'Uneven extraction: water ran around the coffee', why: 'Sour and slow together usually means a clogged or channelled bed: some grounds over-ran while most were bypassed.', changeNow: 'Pour more gently in the centre and swirl to flatten the bed; check for a fines layer clogging the filter.', nextExperiment: a.grinder === 'blade' ? 'A blade grinder makes dust and boulders together; a burr grinder fixes this.' : 'Grind a step coarser to clear the clog, then fine-tune.', ruleOut: 'A flat, even bed after drawdown suggests the grind, not the pour.', zone: 'under-strong', next: a.grinder === 'blade' ? { tool: 'grind-guide' } : { grind: 'coarser' } });
      return d({ cause: 'Under-extracted', why: 'Acids dissolve first; the brew stopped before enough of the sweeter compounds came out.', changeNow: t === 'fast' ? 'Grind finer: one or two steps.' : 'Use hotter water, right off the boil.', nextExperiment: a.roast === 'light' ? 'Light roasts need the hot end of the range and a slightly finer grind.' : 'If it is still sour, grind finer again.', ruleOut: 'If it turns bitter, you went too far: come back half a step.', zone: 'under-weak', next: t === 'fast' ? { grind: 'finer' } : { temp: 'hotter' } });
    case 'bitter':
      if (t === 'fast') return d({ cause: 'Bitterness from the roast, not the brew', why: 'A fast brew that still tastes bitter points at dark-roast compounds rather than over-extraction.', changeNow: 'Brew cooler (about 91 °C) and use a lighter ratio.', nextExperiment: 'Try a lighter roast if you want less bitterness overall.', ruleOut: 'If cooler water fixes it, keep it.', zone: 'over-strong', next: { temp: 'cooler', strength: 'lighter' } });
      return d({ cause: 'Over-extracted', why: 'The last compounds to dissolve are the bitter, drying ones; the water pulled too much.', changeNow: t === 'slow' ? 'Grind coarser: one or two steps.' : 'Use slightly cooler water.', nextExperiment: a.roast === 'dark' ? 'Dark roasts extract easily: brew at the cool end and grind a touch coarser.' : 'If it is still bitter, shorten the brew.', ruleOut: 'If it turns sour, you went too far: come back half a step.', zone: 'over-strong', next: t === 'slow' ? { grind: 'coarser' } : { temp: 'cooler' } });
    case 'weak':
      if (a.measure === 'scoop') return d({ cause: 'Not enough coffee (measured by volume)', why: 'Scoops vary a lot with the bean and grind; weak usually means fewer grams than intended.', changeNow: 'Weigh the coffee; use the Brew Guide amount for your cup.', nextExperiment: 'Then adjust strength with the ratio, not by guessing scoops.', ruleOut: 'If a weighed dose is still weak, see the brew time.', zone: 'ideal-weak', next: { strength: 'stronger' } });
      if (t === 'fast') return d({ cause: 'Weak and under-extracted', why: 'Water passed too quickly to dissolve enough.', changeNow: 'Grind finer.', nextExperiment: 'If it is still weak, use a stronger ratio.', ruleOut: '', zone: 'under-weak', next: { grind: 'finer' } });
      return d({ cause: 'Too dilute: a ratio problem', why: 'Strength is set mostly by the ratio of coffee to water; extraction can be fine and the cup still weak.', changeNow: 'Use more coffee for the same water (a stronger ratio).', nextExperiment: 'Move one step stronger at a time, e.g. 1:16 to 1:15.', ruleOut: 'If it turns harsh as well as strong, grind slightly coarser.', zone: 'ideal-weak', next: { strength: 'stronger' } });
    case 'harsh-mixed':
      return d({ cause: 'Uneven extraction', why: 'Some grounds over-extract while others barely extract, so you taste both bitter and sour.', changeNow: a.grinder === 'blade' || a.grinder === 'pre' ? 'Use a burr grinder; a blade makes dust and boulders together.' : 'Pour evenly and swirl to keep the bed flat.', nextExperiment: 'Then fine-tune the grind one step at a time.', ruleOut: 'If the cup is clean but simply sour or bitter, see those symptoms.', zone: 'under-strong', next: { tool: 'grind-guide' } });
    case 'flat':
      return flat();
    case 'muddy':
      return d({ cause: 'Too many fine particles in the cup', why: 'Metal and mesh filters let fines through; very fine or uneven grounds make it worse.', changeNow: state.method === 'french-press' ? 'After pressing, let it settle a few minutes and pour gently, leaving the last bit in the press.' : 'Grind coarser.', nextExperiment: a.grinder === 'blade' ? 'A burr grinder makes far fewer fines.' : 'Pour through a paper filter for a much cleaner cup.', ruleOut: '', zone: 'over-strong', next: { grind: 'coarser' } });
  }
  return failure('no-diagnosis', 'symptom', 'Try another symptom.');
}

// ── Extraction map ──
export type ZoneId = `${'under' | 'ideal' | 'over'}-${'weak' | 'ideal' | 'strong'}`;
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
