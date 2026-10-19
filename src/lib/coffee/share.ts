import type { MethodId, RecipeInput, Result, Roast, Strength } from './types.ts';
import { GUIDE_METHODS } from './methods.ts';
import { failure, finite, flOzToMl, mlToFlOz, success } from './units.ts';

// Brew Guide state ↔ URL query. Readable keys so shared links explain themselves:
//   ?method=v60&cup=355&strength=classic&roast=medium&units=us
export type Units = 'us' | 'metric';
/** `ratio`: Fix My Coffee's change is the strength itself (already in the link), named so the Brew Guide can say so. */
export type Adjust = 'finer' | 'coarser' | 'hotter' | 'cooler' | 'ratio';
/** `adjust` carries a change from Fix My Coffee into the next brew. */
export interface BrewState extends RecipeInput { units: Units; adjust?: Adjust }
const ADJUSTS: Adjust[] = ['finer', 'coarser', 'hotter', 'cooler', 'ratio'];

const STRENGTHS: Strength[] = ['lighter', 'classic', 'stronger'];
const ROASTS: Roast[] = ['light', 'medium', 'dark'];

/**
 * Espresso's strengths are named by the shot, as its buttons say ("Longer 1:2.5", "Shorter 1:1.5"), so its links say
 * `strength=longer` and `strength=shorter`. The old keys still open the same shot (Wave D batch 33: `strength=stronger`
 * read as "Shorter 1:1.5"). Other brewers keep lighter and stronger.
 */
const ESPRESSO_KEYS: Record<Strength, string> = { lighter: 'longer', classic: 'classic', stronger: 'shorter' };
export const strengthParam = (method: MethodId, s: Strength) => (method === 'espresso' ? ESPRESSO_KEYS[s] : s);
function strengthFromParam(method: MethodId, v: string): Strength | null {
  if (STRENGTHS.includes(v as Strength)) return v as Strength;
  if (method === 'espresso') return (Object.keys(ESPRESSO_KEYS) as Strength[]).find((k) => ESPRESSO_KEYS[k] === v) ?? null;
  return null;
}

/**
 * A US-units link stores its cup in ml to a tenth (12 oz is 354.9), and articles round it to whole ml (355, 237).
 * Within half a milliliter of a whole fluid ounce, it is that many ounces exactly, so `cup=237` and the 8 oz chip
 * give the same recipe and the same top-up (Wave D batch 19: 46 g against 47 g). Metric links are left alone.
 */
function snapUsCup(ml: number): number {
  const oz = Math.round(mlToFlOz(ml));
  return oz > 0 && Math.abs(flOzToMl(oz) - ml) < 0.5 ? flOzToMl(oz) : ml;
}

export function encodeBrew(state: BrewState): string {
  const q = new URLSearchParams();
  q.set('method', state.method);
  const t = state.target as Record<string, number>;
  // Keep a tenth of a unit: rounding to whole millilitres lost entries like 350.5 mL.
  const r1 = (n: number) => String(Math.round(n * 10) / 10);
  if ('cupMl' in t) q.set('cup', r1(t.cupMl));
  else if ('doseG' in t) q.set('dose', r1(t.doseG));
  else if ('waterG' in t) q.set('water', r1(t.waterG));
  if (finite(state.ratio)) q.set('ratio', String(state.ratio));
  else if (state.strength && state.strength !== 'classic') q.set('strength', strengthParam(state.method, state.strength));
  if (state.roast && state.roast !== 'medium') q.set('roast', state.roast);
  if (state.units !== 'us') q.set('units', state.units);
  if (state.adjust) q.set('adjust', state.adjust);
  return q.toString();
}

export function decodeBrew(query: string): Result<BrewState> {
  const q = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  const method = q.get('method') as MethodId | null;
  if (!method || !GUIDE_METHODS.some((m) => m.id === method)) return failure('bad-method', 'method', 'Unknown brewer in the link.');
  const num = (k: string) => { const v = q.get(k); if (v === null) return undefined; const n = Number(v); return finite(n) && n > 0 ? n : NaN; };
  const cup = num('cup'), dose = num('dose'), water = num('water'), ratio = num('ratio');
  if ([cup, dose, water, ratio].some((v) => Number.isNaN(v))) return failure('bad-number', 'target', 'A number in the link is not valid.');
  const units = (q.get('units') ?? 'us') as Units;
  const target = cup !== undefined ? { cupMl: units === 'us' && method !== 'espresso' ? snapUsCup(cup) : cup } : dose !== undefined ? { doseG: dose } : water !== undefined ? { waterG: water } : null;
  if (!target) return failure('no-target', 'target', 'The link has no cup size or dose.');
  const strength = strengthFromParam(method, q.get('strength') ?? 'classic');
  const roast = (q.get('roast') ?? 'medium') as Roast;
  const adjust = q.get('adjust') as Adjust | null;
  if (!strength || !ROASTS.includes(roast) || (units !== 'us' && units !== 'metric') || (adjust !== null && !ADJUSTS.includes(adjust))) return failure('bad-option', 'options', 'An option in the link is not recognized.');
  return success({ method, target, strength, roast, units, ...(ratio !== undefined ? { ratio } : {}), ...(adjust ? { adjust } : {}) });
}
