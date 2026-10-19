import type { MethodId, Range, Result } from './types.ts';
import { failure, finite, mlToFlOz, success } from './units.ts';
import { doseForCup } from './brew.ts';
import { methodById } from './methods.ts';

// Caffeine model for the Caffeine Calculator and anything that quotes caffeine.
// Ranges, not points: caffeine varies with bean, roast, dose and method. Values marked in
// VERIFY need an independent primary source before ship (fact-check queue).

export const CAFFEINE = {
  /**
   * Single espresso shot (about 1 oz). Typical 63 mg: USDA FoodData Central SR Legacy 171891, espresso
   * at 212 mg per 100 g, is 62.8 mg in 1 fl oz (29.6 g), calculated (R1). The 60–75 range is synthesis §15, §20 #35.
   */
  espressoShotMg: { min: 60, max: 75, typical: 63 },
  /**
   * Caffeine as a fraction of the coffee's weight. Farah 2012, "Coffee Constituents" (ch. 2): Table 2.1, p. 28, green
   * arabica 0.9–1.3 g/100 g and canephora (robusta) 1.5–2.5; Table 2.2, p. 38, a typical medium roast at 1.1–1.3 and
   * 2.4–2.5. Roasting doesn't significantly alter caffeine (p. 37), so the wider green ranges stand in for roasted beans.
   * The old robusta floor of 1.7% had no source and is gone (round 3, item 34).
   */
  beanFraction: { arabica: { min: 0.009, max: 0.013 }, robusta: { min: 0.015, max: 0.025 } },
  /**
   * Share of the caffeine in the grounds that dissolves into the brew water. For immersion brews
   * the grounds then keep some of that water, as strong as the cup, so the cup gets less (below).
   */
  extractionFraction: {
    percolation: { min: 0.75, max: 0.95 },
    immersion: { min: 0.75, max: 0.95 },
    'cold-brew': { min: 0.6, max: 0.9 },
  },
  /**
   * The FDA: "decaf coffee typically has 2 to 15 milligrams in an 8-fluid-ounce cup" (Spilling the Beans, content current
   * as of 08/28/2024, checked 2026-10-18). Replaces Easto's narrower 3–6 mg per 6 oz, so the calculator and the decaf
   * article quote one figure (round 3, B1).
   */
  decafPer8FlOz: { min: 2, max: 15 },
  /**
   * The calculator's three half-life settings (R4). Primary averages: 2.5–4.5 h in adult men (IOM 2001),
   * 3.4 h, range 2–5 (Knutti 1981), "typically 3–6 hours" (Gardiner 2025). Typical 5 h is the middle
   * setting, at the slow end of those, so bedtime figures lean high. The old "1.5–10 h" range had no
   * primary source and is gone. Late pregnancy: 3 h rising to 10.5 h, about 3½ times (Knutti 1982).
   */
  halfLifeH: { typical: 5, faster: 3, slower: 8 },
  sourceIds: ['synthesis', 'usda-fdc-espresso', 'farah-2012', 'fda-caffeine', 'iom-2001', 'knutti-1981', 'knutti-1982', 'gardiner-2025'],
  VERIFY: ['extractionFraction by method', 'absorption rate used by the curve'],
} as const;

export type Bean = 'arabica' | 'robusta' | 'blend';

/**
 * Caffeine as a fraction of the coffee's weight for a bean choice. A blend with a known robusta share (1–99%) mixes the
 * two ranges by weight, so an 85/15 blend sits 15% of the way from arabica to robusta; a blend of unknown make-up spans
 * both. Returns null for a share outside 1–99%.
 */
export function beanFraction(bean: Bean = 'arabica', robustaPct?: number): Range | null {
  const a = CAFFEINE.beanFraction.arabica, r = CAFFEINE.beanFraction.robusta;
  if (bean === 'arabica') return { min: a.min, max: a.max };
  if (bean === 'robusta') return { min: r.min, max: r.max };
  if (robustaPct === undefined) return { min: a.min, max: r.max };
  if (!finite(robustaPct) || robustaPct < 1 || robustaPct > 99) return null;
  const s = robustaPct / 100;
  return { min: a.min + (r.min - a.min) * s, max: a.max + (r.max - a.max) * s };
}

/**
 * Homemade brewed coffee from its dose (grams of coffee used for this drink). Immersion brews lose
 * the caffeine in the liquid the grounds keep (about 2 g per g, as strong as the cup): the cup gets
 * 1 − retention ÷ ratio of what dissolved. At cold brew's 1:6.25 that is about 68% (Muse, Wave A r2).
 */
export function estimateBrewedMg(doseG: number, method: MethodId, bean: Bean = 'arabica', ratio?: number, contactWaterG?: number, robustaPct?: number): Result<Range> {
  if (!finite(doseG) || doseG <= 0 || doseG > 300) return failure('bad-dose', 'doseG', 'Enter the coffee you used, in grams.');
  if (method === 'espresso') return failure('use-shots', 'method', 'For espresso, count shots instead.');
  if (!methodById(method)) return failure('bad-method', 'method', 'Choose how it was brewed.');
  if (bean !== 'arabica' && bean !== 'robusta' && bean !== 'blend') return failure('bad-bean', 'bean', 'Choose arabica, robusta or a blend.');
  if (robustaPct !== undefined && bean !== 'blend') return failure('bad-blend', 'robustaPct', 'A robusta share applies only to a blend.');
  if (contactWaterG !== undefined && (!finite(contactWaterG) || contactWaterG <= 0)) return failure('bad-water', 'contactWaterG', 'Enter the water that touched the coffee.');
  const b = beanFraction(bean, robustaPct);
  if (!b) return failure('bad-blend', 'robustaPct', 'Enter the blend\'s robusta share, 1–99%.');
  const ex = method === 'cold-brew' ? CAFFEINE.extractionFraction['cold-brew']
    : (method === 'french-press' || method === 'aeropress') ? CAFFEINE.extractionFraction.immersion
    : CAFFEINE.extractionFraction.percolation;
  const m = methodById(method);
  // Only water that touched the grounds counts: an AeroPress top-up dilutes the cup but never
  // sat in the grounds, so it can't change the share the grounds hold back (Astra, Wave A r3).
  const contact = contactWaterG ?? doseG * (ratio ?? m?.ratio.classic ?? 1);
  const served = m && m.family === 'immersion' ? Math.max(0, (contact - m.retentionGPerG * doseG) / contact) : 1;
  // grams of coffee × caffeine fraction × share dissolved × share that reaches the cup, in milligrams
  return success({ min: doseG * b.min * ex.min * served * 1000, max: doseG * b.max * ex.max * served * 1000 });
}

export function espressoMg(shots: number): Range {
  return { min: shots * CAFFEINE.espressoShotMg.min, max: shots * CAFFEINE.espressoShotMg.max };
}

// One-compartment model with first-order absorption. Absorption rate chosen so the peak
// arrives about 45 minutes after drinking (effects are felt within 15–60 min, §15). Illustrative.
const KA_PER_H = 5;

/** Milligrams of caffeine in the body at `atMin`, from intakes at given minutes. */
export function caffeineInBody(intakes: { atMin: number; mg: number }[], atMin: number, halfLifeH: number = CAFFEINE.halfLifeH.typical): number {
  // A half-life outside 1–15 h (a corrupted setting) falls back to typical rather than growing or going NaN (Muse r4).
  const ke = Math.LN2 / (finite(halfLifeH) && halfLifeH >= 1 && halfLifeH <= 15 ? halfLifeH : CAFFEINE.halfLifeH.typical);
  let total = 0;
  for (const { atMin: t0, mg } of intakes) {
    const t = (atMin - t0) / 60;
    if (!finite(t) || t <= 0 || !finite(mg) || mg <= 0) continue;
    total += mg * (KA_PER_H / (KA_PER_H - ke)) * (Math.exp(-ke * t) - Math.exp(-KA_PER_H * t));
  }
  return total;
}

export function caffeineCurve(intakes: { atMin: number; mg: number }[], fromMin: number, toMin: number, stepMin = 10, halfLifeH?: number) {
  const out: { tMin: number; mg: number }[] = [];
  for (let t = fromMin; t <= toMin; t += stepMin) out.push({ tMin: t, mg: caffeineInBody(intakes, t, halfLifeH) });
  return out;
}

/**
 * Agency guidance, quoted in the agencies' own words (R5). A population guide, never a personal limit.
 * FDA: "Spilling the Beans: How Much Caffeine is Too Much?", content current as of 8/28/2024 (its
 * footnote mark after "milligrams" left out). ACOG: Committee Opinion 462 (2010, reaffirmed), abstract.
 */
export const GUIDANCE = [
  { id: 'fda-adult-daily', mg: 400, per: 'day', who: 'FDA', wording: 'The FDA says, “For most adults, the FDA has cited 400 milligrams a day — that\'s about two to three 12-fluid-ounce cups of coffee — as an amount not generally associated with negative effects.”' },
  { id: 'efsa-single-dose', mg: 200, per: 'dose', who: 'EFSA', wording: 'EFSA found single doses of up to 200 mg raise no safety concerns for healthy adults.' },
  { id: 'acog-pregnancy', mg: 200, per: 'day', who: 'ACOG', wording: 'ACOG (Committee Opinion 462) says, “Moderate caffeine consumption (less than 200 mg per day) does not appear to be a major contributing factor in miscarriage or preterm birth. The relationship of caffeine to growth restriction remains undetermined.”' },
] as const;

// ── A day of drinks (Caffeine Calculator) ──

export type IntakeKind = 'brewed' | 'espresso' | 'decaf' | 'custom';
export interface Intake {
  kind: IntakeKind;
  /** The drink's name as the reader chose it ("Latte or cappuccino (double)"), shown in the list. */
  label?: string;
  /** Minutes after midnight (may exceed 1440 for after-midnight drinks). */
  atMin: number;
  method?: MethodId;
  cupMl?: number;
  shots?: number;
  bean?: Bean;
  /** A blend's robusta share in percent (1–99), when the reader knows it; without it a blend spans both beans. */
  robustaPct?: number;
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
  if (i.kind === 'decaf') return success({ min: CAFFEINE.decafPer8FlOz.min * mlToFlOz(i.cupMl) / 8, max: CAFFEINE.decafPer8FlOz.max * mlToFlOz(i.cupMl) / 8 });
  const method = i.method ?? 'drip-machine';
  const m = methodById(method);
  if (!m || method === 'espresso') return failure('bad-method', 'method', 'Choose how it was brewed.');
  // The Brew Guide's own arithmetic at the classic ratio, without the brewer's size limit, so the
  // estimate grows smoothly with the cup (a cup bigger than one brewer makes is still that coffee).
  const doseG = doseForCup(m, i.cupMl, m.ratio.classic);
  // AeroPress: the chamber holds about maxWaterG per press (as in the Brew Guide); beyond one
  // press's dose, presses scale with the dose so the estimate stays continuous.
  const water = doseG * m.ratio.classic;
  const contact = m.id === 'aeropress' && m.capacity.maxWaterG ? Math.min(water, m.capacity.maxWaterG * Math.max(1, doseG / m.capacity.maxDoseG)) : water;
  return estimateBrewedMg(doseG, method, i.bean ?? 'arabica', m.ratio.classic, contact, i.bean === 'blend' ? i.robustaPct : undefined);
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

// ── Display rounding (the UI's, never fed back into the model) ──

/**
 * An estimate shown to the nearest 5 mg, the precision the page's table uses, so a row, the table and the day's
 * total agree (round 3, B1 and item 36). A label's own figure ("I know the mg") is shown as given.
 */
export function shownMg(r: Range, exact = false): Range {
  if (exact) return { min: Math.round(r.min), max: Math.round(r.max) };
  return { min: Math.round(r.min / 5) * 5, max: Math.round(r.max / 5) * 5 };
}
export const mgText = (r: Range) => (r.min === r.max ? `${r.min}` : `${r.min}–${r.max}`);
/**
 * A drink's caffeine as shown. Decaf keeps whole milligrams: the FDA's 2–15 mg would round to "0–15", and decaf
 * isn't caffeine free.
 */
export function shownIntakeMg(i: Intake): Range | null {
  const r = intakeMg(i);
  return r.ok ? shownMg(r.value, i.kind === 'custom' || i.kind === 'decaf') : null;
}
/** The day's total as shown: the sum of the rows as shown, so the figures on screen add up. */
export function shownTotal(intakes: Intake[]): Range {
  return intakes.reduce((acc, i) => { const v = shownIntakeMg(i); return v ? { min: acc.min + v.min, max: acc.max + v.max } : acc; }, { min: 0, max: 0 });
}

export function inBodyAt(intakes: Intake[], atMin: number, halfLifeH: number = CAFFEINE.halfLifeH.typical): Range {
  const p = dayCurve(intakes, atMin, atMin, 1, halfLifeH)[0];
  return { min: p.min, max: p.max };
}

// Share: ?d=v60.355@480,esp.2@630,decaf.237@1200,drip-machine.355.blend15@900&bed=1380
// A bean other than arabica follows the cup size: .robusta, .blend (make-up unknown) or .blend15 (15% robusta).
// Health details never go into a link: no pregnancy field and no half-life. Old links' preg= and hl=
// are both ignored, so an old link can't hint at a pregnancy through its half-life (Muse r4).
export function encodeDay(state: { intakes: Intake[]; halfLifeH: number; bedMin: number }): string {
  const q = new URLSearchParams();
  q.set('d', state.intakes.map((i) => i.kind === 'espresso' ? `esp.${i.shots}@${Math.round(i.atMin)}`
    : i.kind === 'custom' ? `mg.${Math.round(i.mg ?? 0)}@${Math.round(i.atMin)}`
    : i.kind === 'decaf' ? `decaf.${Math.round(i.cupMl ?? 0)}@${Math.round(i.atMin)}`
    : `${i.method}.${Math.round(i.cupMl ?? 0)}${i.bean && i.bean !== 'arabica' ? '.' + i.bean + (i.bean === 'blend' && i.robustaPct !== undefined ? Math.round(i.robustaPct) : '') : ''}@${Math.round(i.atMin)}`).join(','));
  // No half-life either: a slow one can reveal pregnancy by inference (blind Opus r2). The
  // recipient sees the day at the typical 5 h and can choose their own.
  void state.halfLifeH;
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
    const m = part.match(/^([a-z0-9-]+)\.(\d+)(?:\.(arabica|robusta|blend)(\d{1,2})?)?@(\d+)$/);
    if (!m) return failure('bad-drink', 'd', 'A drink in the link is not valid.');
    const [, kind, n, bean, pct, at] = m;
    // Only a blend carries a robusta share (blend15); "robusta15" isn't a bean.
    if (pct !== undefined && bean !== 'blend') return failure('bad-drink', 'd', 'A drink in the link is not valid.');
    // Older links wrote after-midnight drinks as 0–359; they belong to the end of the day.
    const n0 = Number(at);
    // Place every time by its clock reading and the link's own bedtime, so older links written
    // under a different day rule (05:30 as 1770) land where they belong.
    const atMin = dayMinute(n0 % 1440, bedForLink);
    if (n0 > 2880) return failure('bad-drink', 'd', 'A drink in the link is not valid.');
    if (kind === 'esp') intakes.push({ kind: 'espresso', shots: Number(n), atMin });
    else if (kind === 'mg') intakes.push({ kind: 'custom', mg: Number(n), atMin });
    else if (kind === 'decaf') intakes.push({ kind: 'decaf', cupMl: Number(n), atMin });
    else intakes.push({ kind: 'brewed', method: kind as MethodId, cupMl: Number(n), atMin, ...(bean ? { bean: bean as Bean } : {}), ...(pct !== undefined ? { robustaPct: Number(pct) } : {}) });
  }
  for (const i of intakes) { const r = intakeMg(i); if (!r.ok) return failure('bad-drink', 'd', r.errors[0].message); }
  return success({ intakes, halfLifeH: CAFFEINE.halfLifeH.typical, bedMin: bedForLink });
}
