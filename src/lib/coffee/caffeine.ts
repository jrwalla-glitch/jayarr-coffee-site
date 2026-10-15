import type { MethodId, Range, Result } from './types.ts';
import { failure, finite, success } from './units.ts';

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
