import type { MethodId, Range, Result } from './types.ts';
import { failure, finite, success } from './units.ts';
import { doseForCup } from './brew.ts';
import { methodById } from './methods.ts';

// Caffeine model for the Caffeine Calculator and anything that quotes caffeine.
// Ranges, not points: caffeine varies with bean, roast, dose and method. Values marked in
// VERIFY need an independent primary source before ship (fact-check queue).

export const CAFFEINE = {
  /** Single espresso shot (about 1 oz), synthesis §15 and §20 #35 (Newcastle 2018). */
  espressoShotMg: { min: 60, max: 75, typical: 63 },
  /** Caffeine as a fraction of roasted coffee mass. */
  beanFraction: { arabica: { min: 0.009, max: 0.013 }, robusta: { min: 0.017, max: 0.025 } },
  /** Share of the caffeine in the grounds that ends up in the cup. */
  extractionFraction: {
    percolation: { min: 0.75, max: 0.95 },
    immersion: { min: 0.75, max: 0.95 },
    'cold-brew': { min: 0.6, max: 0.9 },
  },
  decafPer6Oz: { min: 3, max: 6 },
  halfLifeH: { typical: 5, min: 1.5, max: 10 },
  sourceIds: ['synthesis', 'newcastle-2018'],
  VERIFY: ['beanFraction (arabica/robusta, roasted basis)', 'extractionFraction by method', 'absorption rate used by the curve'],
} as const;

export type Bean = 'arabica' | 'robusta' | 'blend';

/** Homemade brewed coffee from its dose (grams of coffee used for this drink). */
export function estimateBrewedMg(doseG: number, method: MethodId, bean: Bean = 'arabica'): Result<Range> {
  if (!finite(doseG) || doseG <= 0 || doseG > 300) return failure('bad-dose', 'doseG', 'Enter the coffee you used, in grams.');
  if (method === 'espresso') return failure('use-shots', 'method', 'For espresso, count shots instead.');
  const b = bean === 'blend'
    ? { min: CAFFEINE.beanFraction.arabica.min, max: CAFFEINE.beanFraction.robusta.max }
    : CAFFEINE.beanFraction[bean];
  const ex = method === 'cold-brew' ? CAFFEINE.extractionFraction['cold-brew']
    : (method === 'french-press' || method === 'aeropress') ? CAFFEINE.extractionFraction.immersion
    : CAFFEINE.extractionFraction.percolation;
  // grams of coffee × caffeine fraction × share extracted, in milligrams
  return success({ min: doseG * b.min * ex.min * 1000, max: doseG * b.max * ex.max * 1000 });
}

export function espressoMg(shots: number): Range {
  return { min: shots * CAFFEINE.espressoShotMg.min, max: shots * CAFFEINE.espressoShotMg.max };
}

// One-compartment model with first-order absorption. Absorption rate chosen so the peak
// arrives about 45 minutes after drinking (effects are felt within 15–60 min, §15). Illustrative.
const KA_PER_H = 5;

/** Milligrams of caffeine in the body at `atMin`, from intakes at given minutes. */
export function caffeineInBody(intakes: { atMin: number; mg: number }[], atMin: number, halfLifeH: number = CAFFEINE.halfLifeH.typical): number {
  const ke = Math.LN2 / halfLifeH;
  let total = 0;
  for (const { atMin: t0, mg } of intakes) {
    const t = (atMin - t0) / 60;
    if (t <= 0 || !finite(mg) || mg <= 0) continue;
    total += mg * (KA_PER_H / (KA_PER_H - ke)) * (Math.exp(-ke * t) - Math.exp(-KA_PER_H * t));
  }
  return total;
}

export function caffeineCurve(intakes: { atMin: number; mg: number }[], fromMin: number, toMin: number, stepMin = 10, halfLifeH?: number) {
  const out: { tMin: number; mg: number }[] = [];
  for (let t = fromMin; t <= toMin; t += stepMin) out.push({ tMin: t, mg: caffeineInBody(intakes, t, halfLifeH) });
  return out;
}

/** Agency guidance, in the agencies' own terms. Wording to be checked against the primary pages. */
export const GUIDANCE = [
  { id: 'fda-adult-daily', mg: 400, per: 'day', who: 'FDA', wording: 'For healthy adults, the FDA has cited 400 mg a day as an amount not generally associated with dangerous, negative effects.' },
  { id: 'efsa-single-dose', mg: 200, per: 'dose', who: 'EFSA', wording: 'EFSA found single doses of up to 200 mg raise no safety concerns for healthy adults.' },
  { id: 'acog-pregnancy', mg: 200, per: 'day', who: 'ACOG', wording: 'ACOG advises pregnant people to keep caffeine under 200 mg a day.' },
] as const;

// ── A day of drinks (Caffeine Calculator) ──

export type IntakeKind = 'brewed' | 'espresso' | 'decaf' | 'custom';
export interface Intake {
  kind: IntakeKind;
  /** Minutes after midnight (may exceed 1440 for after-midnight drinks). */
  atMin: number;
  method?: MethodId;
  cupMl?: number;
  shots?: number;
  bean?: Bean;
  /** custom: an amount the reader knows (a can's label, a chain's published figure). */
  mg?: number;
}

export function intakeMg(i: Intake): Result<Range> {
  if (!finite(i.atMin)) return failure('bad-time', 'atMin', 'Pick a time.');
  if (i.kind === 'custom') {
    if (!finite(i.mg) || i.mg < 0 || i.mg > 1000) return failure('bad-mg', 'mg', 'Enter the caffeine from the label, 0–1000 mg.');
    return success({ min: i.mg, max: i.mg });
  }
  if (i.kind === 'espresso') {
    if (!finite(i.shots) || i.shots < 1 || i.shots > 6) return failure('bad-shots', 'shots', 'Count 1 to 6 shots.');
    return success(espressoMg(i.shots));
  }
  if (!finite(i.cupMl) || i.cupMl < 30 || i.cupMl > 2000) return failure('bad-cup', 'cupMl', 'Choose a cup size.');
  if (i.kind === 'decaf') return success({ min: CAFFEINE.decafPer6Oz.min * i.cupMl / 177, max: CAFFEINE.decafPer6Oz.max * i.cupMl / 177 });
  const method = i.method ?? 'drip-machine';
  const m = methodById(method);
  if (!m || method === 'espresso') return failure('bad-method', 'method', 'Choose how it was brewed.');
  // The Brew Guide's own arithmetic at the classic ratio, without the brewer's size limit, so the
  // estimate grows smoothly with the cup (a cup bigger than one brewer makes is still that coffee).
  return estimateBrewedMg(doseForCup(m, i.cupMl, m.ratio.classic), method, i.bean ?? 'arabica');
}

/**
 * When the diary's new day starts: four hours after bedtime. A drink between midnight and then is
 * a late one from the night before (00:30 with an 11 pm bedtime is still tonight); a drink after it
 * starts the new day (an early riser's 05:30 coffee is this morning's). Bedtime is in diary minutes,
 * so 1 am is 1500. Returns clock minutes (0–1439).
 */
export function newDayAt(bedMin: number = DEFAULT_BED_MIN): number {
  return (((Math.round(bedMin) + 240) % 1440) + 1440) % 1440;
}
export const DEFAULT_BED_MIN = 23 * 60;
/** Clock minutes to diary minutes: before the new-day time, a time belongs to the night before (00:30 → 1470). */
export function dayMinute(clockMin: number, bedMin: number = DEFAULT_BED_MIN): number {
  const m = ((Math.round(clockMin) % 1440) + 1440) % 1440;
  return m < newDayAt(bedMin) ? m + 1440 : m;
}
/** A bedtime as diary minutes: anything before noon is after midnight (1 am → 1500). */
export function bedMinute(clockOrDiaryMin: number): number {
  const m = ((Math.round(clockOrDiaryMin) % 1440) + 1440) % 1440;
  return m < 12 * 60 ? m + 1440 : m;
}

/**
 * Which diary a moment belongs to: the local calendar date, moved back a day before the new-day
 * time. Uses the local clock, never elapsed hours, so daylight-saving changes can't shift it.
 * Format matches existing saves: yyyy-m-d.
 */
export function diaryDayKey(now: Date, bedMin: number = DEFAULT_BED_MIN): string {
  const before = now.getHours() * 60 + now.getMinutes() < newDayAt(bedMin);
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (before ? 1 : 0));
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export interface DayPoint { tMin: number; min: number; max: number }

export function dayCurve(intakes: Intake[], fromMin: number, toMin: number, stepMin = 10, halfLifeH: number = CAFFEINE.halfLifeH.typical): DayPoint[] {
  const lows: { atMin: number; mg: number }[] = [], highs: { atMin: number; mg: number }[] = [];
  for (const i of intakes) {
    const r = intakeMg(i);
    if (!r.ok) continue;
    lows.push({ atMin: i.atMin, mg: r.value.min }); highs.push({ atMin: i.atMin, mg: r.value.max });
  }
  const out: DayPoint[] = [];
  for (let t = fromMin; t <= toMin; t += stepMin) out.push({ tMin: t, min: caffeineInBody(lows, t, halfLifeH), max: caffeineInBody(highs, t, halfLifeH) });
  return out;
}

export function dailyTotal(intakes: Intake[]): Range {
  return intakes.reduce((acc, i) => { const r = intakeMg(i); return r.ok ? { min: acc.min + r.value.min, max: acc.max + r.value.max } : acc; }, { min: 0, max: 0 });
}

export function inBodyAt(intakes: Intake[], atMin: number, halfLifeH: number = CAFFEINE.halfLifeH.typical): Range {
  const p = dayCurve(intakes, atMin, atMin, 1, halfLifeH)[0];
  return { min: p.min, max: p.max };
}

// Share: ?d=v60.355@480,esp.2@630,decaf.237@1200&hl=5&bed=1380
// Health details never go into a link: there is no pregnancy field, and old links' preg= is ignored.
export function encodeDay(state: { intakes: Intake[]; halfLifeH: number; bedMin: number }): string {
  const q = new URLSearchParams();
  q.set('d', state.intakes.map((i) => i.kind === 'espresso' ? `esp.${i.shots}@${Math.round(i.atMin)}`
    : i.kind === 'custom' ? `mg.${Math.round(i.mg ?? 0)}@${Math.round(i.atMin)}`
    : i.kind === 'decaf' ? `decaf.${Math.round(i.cupMl ?? 0)}@${Math.round(i.atMin)}`
    : `${i.method}.${Math.round(i.cupMl ?? 0)}${i.bean && i.bean !== 'arabica' ? '.' + i.bean : ''}@${Math.round(i.atMin)}`).join(','));
  if (state.halfLifeH !== CAFFEINE.halfLifeH.typical) q.set('hl', String(state.halfLifeH));
  if (state.bedMin !== 1380) q.set('bed', String(state.bedMin));
  return q.toString();
}

export function decodeDay(query: string): Result<{ intakes: Intake[]; halfLifeH: number; bedMin: number }> {
  const q = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  const d = q.get('d');
  if (!d) return failure('empty', 'd', 'No drinks in the link.');
  const intakes: Intake[] = [];
  const bed0 = Number(q.get('bed') ?? DEFAULT_BED_MIN);
  if (!finite(bed0) || bed0 < 0 || bed0 > 2880) return failure('bad-option', 'bed', 'An option in the link is not valid.');
  const bedForLink = bedMinute(bed0);
  for (const part of d.split(',')) {
    const m = part.match(/^([a-z0-9-]+)\.(\d+)(?:\.(arabica|robusta|blend))?@(\d+)$/);
    if (!m) return failure('bad-drink', 'd', 'A drink in the link is not valid.');
    const [, kind, n, bean, at] = m;
    // Older links wrote after-midnight drinks as 0–359; they belong to the end of the day.
    const n0 = Number(at);
    // Times under 1440 are clock times (older links); place them by the link's own bedtime.
    const atMin = n0 < 1440 ? dayMinute(n0, bedForLink) : n0;
    if (n0 > 2880) return failure('bad-drink', 'd', 'A drink in the link is not valid.');
    if (kind === 'esp') intakes.push({ kind: 'espresso', shots: Number(n), atMin });
    else if (kind === 'mg') intakes.push({ kind: 'custom', mg: Number(n), atMin });
    else if (kind === 'decaf') intakes.push({ kind: 'decaf', cupMl: Number(n), atMin });
    else intakes.push({ kind: 'brewed', method: kind as MethodId, cupMl: Number(n), atMin, ...(bean ? { bean: bean as Bean } : {}) });
  }
  for (const i of intakes) { const r = intakeMg(i); if (!r.ok) return failure('bad-drink', 'd', r.errors[0].message); }
  const hl = Number(q.get('hl') ?? CAFFEINE.halfLifeH.typical), bed = bedForLink;
  if (!finite(hl) || hl < 1 || hl > 15 || !finite(bed) || bed < 0 || bed > 2880) return failure('bad-option', 'hl', 'An option in the link is not valid.');
  return success({ intakes, halfLifeH: hl, bedMin: bed });
}
