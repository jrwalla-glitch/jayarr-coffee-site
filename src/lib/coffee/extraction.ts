import type { Result } from './types.ts';
import { failure, finite, success } from './units.ts';
import type { ZoneId } from './doctor.ts';

// Measured extraction: with a refractometer reading, extraction yield is arithmetic, not a guess.
//   EY % = liquid weight × TDS % ÷ dose
// Percolation and espresso use the beverage weight in the cup. Immersion uses all the water added,
// because the liquid left in the grounds is as strong as the cup (the standard simple estimate; it
// ignores the dissolved coffee's own weight, so it reads slightly low).
// Chart bands: filter after the SCA brewing control chart (EY 18–22 %, TDS 1.15–1.45 %); espresso
// has no SCA chart, so its strength band (8–12 % TDS) is a common rule of thumb (Rao). Each band is
// the middle third of the drawn axis so the map's nine zones line up with the numbers.

export type MeasuredKind = 'percolation' | 'immersion' | 'espresso';
export interface MeasuredInput { kind: MeasuredKind; doseG: number; /** beverage weight (percolation, espresso) or water added (immersion), g */ liquidG: number; tdsPct: number }
export interface Chart { ey: [number, number]; tds: [number, number]; eyIdeal: [number, number]; tdsIdeal: [number, number] }
export interface MeasuredResult { eyPct: number; dissolvedG: number; zone: ZoneId; x: number; y: number; chart: Chart; notes: string[] }

export const CHARTS: Record<'filter' | 'espresso', Chart> = {
  filter: { ey: [14, 26], tds: [0.85, 1.75], eyIdeal: [18, 22], tdsIdeal: [1.15, 1.45] },
  espresso: { ey: [14, 26], tds: [4, 16], eyIdeal: [18, 22], tdsIdeal: [8, 12] },
};

export function measuredExtraction(input: MeasuredInput): Result<MeasuredResult> {
  const { kind, doseG, liquidG, tdsPct } = input;
  if (kind !== 'percolation' && kind !== 'immersion' && kind !== 'espresso') return failure('bad-kind', 'kind', 'Choose how it was brewed.');
  if (!finite(doseG) || doseG < 1 || doseG > 1000) return failure('bad-dose', 'doseG', 'Enter the coffee dose, 1–1000 g.');
  if (!finite(liquidG) || liquidG < 1 || liquidG > 20000) return failure('bad-liquid', 'liquidG', kind === 'immersion' ? 'Enter the water you added, in grams.' : 'Enter the weight of the drink, in grams.');
  if (!finite(tdsPct) || tdsPct <= 0 || tdsPct > 25) return failure('bad-tds', 'tdsPct', 'Enter the refractometer reading as a percentage, above 0 and up to 25.');
  const dissolvedG = (liquidG * tdsPct) / 100;
  const eyPct = (dissolvedG / doseG) * 100;
  if (eyPct > 30) return failure('implausible', 'tdsPct', `That works out to ${eyPct.toFixed(1)}% extraction, more than coffee can give (about 30% at most). Check the dose, the weight and the reading.`);
  const chart = CHARTS[kind === 'espresso' ? 'espresso' : 'filter'];
  const notes: string[] = [];
  if (kind === 'immersion') notes.push('Immersion: this uses all the water you added, because the liquid left in the grounds is as strong as your cup. It reads slightly low.');
  if (kind === 'espresso') notes.push('Espresso has no SCA chart; the strength band here (8–12% TDS) is a common rule of thumb.');
  if (eyPct < 10) notes.push('Under 10% is unusually low: check the reading was taken on a cooled, well-mixed sample.');
  const third = (v: number, [lo, hi]: [number, number]) => { const t = (v - lo) / (hi - lo); return Math.max(0, Math.min(1, t)); };
  const x = third(eyPct, chart.ey), y = third(tdsPct, chart.tds);
  const e = eyPct < chart.eyIdeal[0] ? 'under' : eyPct > chart.eyIdeal[1] ? 'over' : 'ideal';
  const s = tdsPct < chart.tdsIdeal[0] ? 'weak' : tdsPct > chart.tdsIdeal[1] ? 'strong' : 'ideal';
  return success({ eyPct, dissolvedG, zone: `${e}-${s}` as ZoneId, x, y, chart, notes });
}
