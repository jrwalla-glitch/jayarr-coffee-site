import type { MethodId, RecipeInput, Result, Roast, Strength } from './types.ts';
import { METHODS } from './methods.ts';
import { failure, finite, success } from './units.ts';

// Brew Guide state ↔ URL query. Readable keys so shared links explain themselves:
//   ?method=v60&cup=355&strength=classic&roast=medium&units=us
export type Units = 'us' | 'metric';
/** `ratio`: the Doctor's change is the strength itself (already in the link), named so the Brew Guide can say so. */
export type Adjust = 'finer' | 'coarser' | 'hotter' | 'cooler' | 'ratio';
/** `adjust` carries a change from the Coffee Doctor into the next brew. */
export interface BrewState extends RecipeInput { units: Units; adjust?: Adjust }
const ADJUSTS: Adjust[] = ['finer', 'coarser', 'hotter', 'cooler', 'ratio'];

const STRENGTHS: Strength[] = ['lighter', 'classic', 'stronger'];
const ROASTS: Roast[] = ['light', 'medium', 'dark'];

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
  else if (state.strength && state.strength !== 'classic') q.set('strength', state.strength);
  if (state.roast && state.roast !== 'medium') q.set('roast', state.roast);
  if (state.units !== 'us') q.set('units', state.units);
  if (state.adjust) q.set('adjust', state.adjust);
  return q.toString();
}

export function decodeBrew(query: string): Result<BrewState> {
  const q = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  const method = q.get('method') as MethodId | null;
  if (!method || !METHODS.some((m) => m.id === method)) return failure('bad-method', 'method', 'Unknown brewer in the link.');
  const num = (k: string) => { const v = q.get(k); if (v === null) return undefined; const n = Number(v); return finite(n) && n > 0 ? n : NaN; };
  const cup = num('cup'), dose = num('dose'), water = num('water'), ratio = num('ratio');
  if ([cup, dose, water, ratio].some((v) => Number.isNaN(v))) return failure('bad-number', 'target', 'A number in the link is not valid.');
  const target = cup !== undefined ? { cupMl: cup } : dose !== undefined ? { doseG: dose } : water !== undefined ? { waterG: water } : null;
  if (!target) return failure('no-target', 'target', 'The link has no cup size or dose.');
  const strength = (q.get('strength') ?? 'classic') as Strength;
  const roast = (q.get('roast') ?? 'medium') as Roast;
  const units = (q.get('units') ?? 'us') as Units;
  const adjust = q.get('adjust') as Adjust | null;
  if (!STRENGTHS.includes(strength) || !ROASTS.includes(roast) || (units !== 'us' && units !== 'metric') || (adjust !== null && !ADJUSTS.includes(adjust))) return failure('bad-option', 'options', 'An option in the link is not recognised.');
  return success({ method, target, strength, roast, units, ...(ratio !== undefined ? { ratio } : {}), ...(adjust ? { adjust } : {}) });
}
