import type { Result } from './types.ts';
import { failure, finite, success } from './units.ts';

// Brewing water (synthesis §2). Hardness (GH) and alkalinity (KH) in ppm (mg/L) as CaCO3.
// Two-bottle method (Barista Hustle): 2.45 g Epsom salt (MgSO4·7H2O) per litre makes a GH
// concentrate and 1.68 g baking soda (NaHCO3) per litre a KH concentrate; 1 mL of either in
// 1 L of distilled water adds 1 ppm. Chemistry check: CaCO3 100.09 g/mol; Epsom 246.47 g/mol
// → 2.462 mg per ppm GH; NaHCO3 84.01 g/mol, 2 eq per CaCO3 → 1.679 mg per ppm KH.

export const MG_EPSOM_PER_PPM_GH = 246.47 / 100.09;
export const MG_BICARB_PER_PPM_KH = (2 * 84.01) / 100.09;
export const CONCENTRATE_G_PER_L = { gh: 2.45, kh: 1.68 };
/** Smallest dry-salt weight worth offering: a 0.01 g scale reads it to within about 2.5%. */
export const DRY_MIN_G = 0.2;

// Each mL of stock in a litre of finished water adds this many ppm (exact, from the stock strengths).
export const PPM_PER_ML_PER_L = { gh: CONCENTRATE_G_PER_L.gh / MG_EPSOM_PER_PPM_GH, kh: CONCENTRATE_G_PER_L.kh / MG_BICARB_PER_PPM_KH };

// No TDS figures: the old strings disagreed with the two-salt mixes (blind Opus r3), and GH + KH isn't TDS.
export interface WaterRecipe { id: string; name: string; gh: number; kh: number; profile: string; bestFor: string }

// Hardness and alkalinity targets from the synthesis's recipe comparison (§2). Two salts reproduce
// a recipe's GH and KH, not every mineral in a branded product: Third Wave Water, for example,
// also uses calcium citrate and sodium chloride. TWW Dark Roast (no published GH) and RPavlis
// (potassium bicarbonate) are omitted from this two-bottle tool.
export const WATER_RECIPES: WaterRecipe[] = [
  { id: 'sca', name: 'SCA standard', gh: 68, kh: 40, profile: 'Balanced benchmark', bestFor: 'Cupping, a neutral reference' },
  { id: 'melbourne', name: 'Melbourne', gh: 24, kh: 12, profile: 'Very soft, delicate', bestFor: 'Light-roast filter' },
  { id: 'holy', name: 'Holy Water', gh: 62, kh: 23, profile: 'Clean, sweet, clear', bestFor: 'Light-roast pour-over' },
  { id: 'bh4', name: 'Barista Hustle #4', gh: 80, kh: 40, profile: 'Clean, bright, balanced', bestFor: 'Light-to-medium filter' },
  { id: 'rao', name: 'Rao/Perger (simplified)', gh: 76, kh: 50, profile: 'Balanced, rounder', bestFor: 'All-purpose, filter and espresso' },
  { id: 'hendon', name: 'Hendon', gh: 100, kh: 31, profile: 'Bright, complex', bestFor: 'Origin-focused pour-over' },
  { id: 'tww-classic', name: 'Third Wave Water Classic (GH/KH only)', gh: 150, kh: 40, profile: 'Intense acidity and clarity', bestFor: 'Light roasts' },
  { id: 'tww-espresso', name: 'Third Wave Water Espresso (GH/KH only)', gh: 135, kh: 80, profile: 'Smoother, more buffered', bestFor: 'Espresso' },
];

export interface WaterPlan {
  target: WaterRecipe;
  finalL: number;
  /** Your own water to measure into the jug (L); 0 when starting from distilled. */
  baseL: number;
  /** Stock to add for the whole batch (mL). */
  ghStockMl: number;
  khStockMl: number;
  /** Distilled water to reach the final line (L). */
  distilledL: number;
  /** The same minerals as dry salts for the whole batch (g). */
  /**
   * The dry-salt alternative, as its own recipe: salts weighed straight into the jug add no volume,
   * so the split between your water and distilled water differs from the stock route.
   */
  dry: { baseL: number; distilledL: number; epsomG: number; bicarbG: number; weighable: boolean; minBatchL: number };
  /** Resulting water, ppm as CaCO3. */
  gh: number;
  kh: number;
  notes: string[];
}

/**
 * Plan a batch of `volumeL` finished water. Source water, both stocks and distilled water are solved
 * together so the jug ends exactly at the final line. Where your water already has more of something
 * than the target, less of it is used (never overshooting either target).
 */
export function planWater(input: { targetId: string; volumeL: number; base?: { gh: number; kh: number }; espresso?: boolean }): Result<WaterPlan> {
  const target = WATER_RECIPES.find((r) => r.id === input.targetId);
  if (!target) return failure('unknown-recipe', 'targetId', 'Choose a recipe.');
  const V = input.volumeL;
  if (!finite(V) || V < 0.1 || V > 40) return failure('bad-volume', 'volumeL', 'Choose a batch between 0.1 and 40 litres.');
  const base = input.base ?? { gh: 0, kh: 0 };
  if (!finite(base.gh) || !finite(base.kh) || base.gh < 0 || base.kh < 0 || base.gh > 1000 || base.kh > 1000) return failure('bad-base', 'base', 'Enter GH and KH between 0 and 1000 ppm.');
  const Tg = target.gh, Tk = target.kh, pg = PPM_PER_ML_PER_L.gh, pk = PPM_PER_ML_PER_L.kh;
  // Share s of the final volume taken from your water: no overshoot, and room left for the stocks.
  // stock mL per final L: (T - s·b)/p ; volume constraint: s + Σ(T - s·b)/(1000 p) ≤ 1
  const noOvershoot = Math.min(base.gh > 0 ? Tg / base.gh : 1, base.kh > 0 ? Tk / base.kh : 1, 1);
  // Water about as mineral-rich as the stocks takes no room from them, so the volume limit doesn't bind
  // (a sign check: without it, GH+KH near 1000 ppm made the share negative and your water vanished; Muse r4).
  const denom = 1 - base.gh / (1000 * pg) - base.kh / (1000 * pk);
  const room = denom > 0 ? (1 - Tg / (1000 * pg) - Tk / (1000 * pk)) / denom : Number.POSITIVE_INFINITY;
  const s = input.base ? Math.max(0, Math.min(noOvershoot, room)) : 0;
  const ghStockMl = Math.max(0, (Tg - s * base.gh) / pg) * V;
  const khStockMl = Math.max(0, (Tk - s * base.kh) / pk) * V;
  const baseL = s * V;
  const distilledL = Math.max(0, V - baseL - (ghStockMl + khStockMl) / 1000);
  const gh = (s * V * base.gh + ghStockMl * pg) / V;
  const kh = (s * V * base.kh + khStockMl * pk) / V;
  const notes: string[] = [];
  if (input.base && noOvershoot < 1 && s === noOvershoot) {
    const what = [base.gh > Tg ? 'harder' : '', base.kh > Tk ? 'more alkaline' : ''].filter(Boolean).join(' and ');
    notes.push(`Your water is ${what} than this recipe, so part of the jug is distilled water.`);
  }
  if (ghStockMl > 1000 || khStockMl > 1000) notes.push(`This batch uses more than a litre of ${ghStockMl > 1000 && khStockMl > 1000 ? 'each stock' : ghStockMl > 1000 ? 'bottle A' : 'bottle B'}, so make two bottles' worth (or more) before you start.`);
  if (input.espresso) notes.push('For an espresso machine, check the maker\'s water specification (hardness, alkalinity and chloride) first; harder water scales boilers faster. Epsom salt and baking soda add no chloride.');
  // Dry route: as much of your water as the targets allow (no room needed for stock bottles), then
  // salts for what's missing. Weighing below DRY_MIN_G on a 0.01 g scale is too imprecise.
  const sDry = input.base ? Math.max(0, noOvershoot) : 0;
  const epsomG = (Math.max(0, Tg - sDry * base.gh) * V * MG_EPSOM_PER_PPM_GH) / 1000;
  const bicarbG = (Math.max(0, Tk - sDry * base.kh) * V * MG_BICARB_PER_PPM_KH) / 1000;
  const smallest = Math.min(...[epsomG, bicarbG].filter((g) => g > 1e-9));
  const weighable = !Number.isFinite(smallest) || smallest >= DRY_MIN_G;
  const minBatchL = Number.isFinite(smallest) && smallest > 0 ? (V * DRY_MIN_G) / smallest : V;
  const dry = { baseL: sDry * V, distilledL: V - sDry * V, epsomG, bicarbG, weighable, minBatchL };
  return success({ target, finalL: V, baseL, ghStockMl, khStockMl, distilledL, dry, gh, kh, notes });
}

/** The recipe nearest to a given water, by distance on the GH/KH map. */
export function nearestRecipe(gh: number, kh: number): WaterRecipe {
  return WATER_RECIPES.reduce((a, r) => (Math.hypot(r.gh - gh, r.kh - kh) < Math.hypot(a.gh - gh, a.kh - kh) ? r : a));
}
