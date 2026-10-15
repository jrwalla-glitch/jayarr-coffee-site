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

export interface WaterRecipe { id: string; name: string; gh: number; kh: number; tds: string; profile: string; bestFor: string; espressoSafe: boolean }

// Values from the synthesis's recipe comparison (§2). TWW Dark Roast and RPavlis are omitted:
// one has no published GH and the other uses potassium bicarbonate, not the two bottles here.
export const WATER_RECIPES: WaterRecipe[] = [
  { id: 'sca', name: 'SCA standard', gh: 68, kh: 40, tds: '~150 ppm', profile: 'Balanced benchmark', bestFor: 'Cupping, a neutral reference', espressoSafe: true },
  { id: 'melbourne', name: 'Melbourne', gh: 24, kh: 12, tds: '~50 ppm', profile: 'Very soft, delicate', bestFor: 'Light-roast filter', espressoSafe: true },
  { id: 'holy', name: 'Holy Water', gh: 62, kh: 23, tds: '~80 ppm', profile: 'Clean, sweet, clear', bestFor: 'Light-roast pour-over', espressoSafe: true },
  { id: 'bh4', name: 'Barista Hustle #4', gh: 80, kh: 40, tds: '~100–120 ppm', profile: 'Clean, bright, balanced', bestFor: 'Light-to-medium filter', espressoSafe: true },
  { id: 'rao', name: 'Rao/Perger', gh: 76, kh: 50, tds: '~120–130 ppm', profile: 'Balanced, rounder', bestFor: 'All-purpose, filter and espresso', espressoSafe: true },
  { id: 'hendon', name: 'Hendon', gh: 100, kh: 31, tds: '~130 ppm', profile: 'Bright, complex', bestFor: 'Origin-focused pour-over', espressoSafe: false },
  { id: 'tww-classic', name: 'Third Wave Water Classic', gh: 150, kh: 40, tds: '~150 ppm', profile: 'Intense acidity and clarity', bestFor: 'Light roasts', espressoSafe: false },
  { id: 'tww-espresso', name: 'Third Wave Water Espresso', gh: 135, kh: 80, tds: '~150 ppm', profile: 'Smoother, more buffered', bestFor: 'Espresso machines', espressoSafe: true },
];

export interface WaterPlan {
  target: WaterRecipe;
  /** Share of your own water in the mix (0 = all distilled). */
  baseShare: number;
  /** Concentrate to add, in mL per litre of finished water. */
  ghMlPerL: number;
  khMlPerL: number;
  /** The same as dry salts, in grams for the whole batch. */
  epsomG: number;
  bicarbG: number;
  /** Resulting water. */
  gh: number;
  kh: number;
  notes: string[];
}

/**
 * Plan a batch. base: your water's GH/KH (omit for distilled/RO). volumeL: batch size.
 * Where your water already has more of something than the target, it is diluted with distilled.
 */
export function planWater(input: { targetId: string; volumeL: number; base?: { gh: number; kh: number }; espresso?: boolean }): Result<WaterPlan> {
  const target = WATER_RECIPES.find((r) => r.id === input.targetId);
  if (!target) return failure('unknown-recipe', 'targetId', 'Choose a recipe.');
  if (!finite(input.volumeL) || input.volumeL <= 0 || input.volumeL > 40) return failure('bad-volume', 'volumeL', 'Choose a batch between 0.1 and 40 litres.');
  const base = input.base ?? { gh: 0, kh: 0 };
  if (!finite(base.gh) || !finite(base.kh) || base.gh < 0 || base.kh < 0 || base.gh > 1000 || base.kh > 1000) return failure('bad-base', 'base', 'Enter GH and KH between 0 and 1000 ppm.');
  // Largest share of base water that doesn't overshoot either target.
  const caps = [base.gh > 0 ? target.gh / base.gh : 1, base.kh > 0 ? target.kh / base.kh : 1];
  const share = Math.max(0, Math.min(1, ...caps));
  const gh0 = base.gh * share, kh0 = base.kh * share;
  const ghAdd = Math.max(0, target.gh - gh0), khAdd = Math.max(0, target.kh - kh0);
  const notes: string[] = [];
  if (share < 1 && input.base) notes.push(`Your water has more ${base.kh * share >= target.kh - 1e-9 && base.kh > 0 ? 'alkalinity' : 'hardness'} than this recipe, so it is mixed with distilled water.`);
  if (input.espresso) {
    if (!target.espressoSafe) notes.push('For an espresso machine, prefer a recipe marked safe: hardness this high scales boilers at steam temperature.');
    notes.push('Epsom salt and baking soda add no chloride, which is what corrodes boilers. Avoid calcium or magnesium chloride in machines.');
  }
  return success({
    target, baseShare: share, ghMlPerL: ghAdd, khMlPerL: khAdd,
    epsomG: (ghAdd * MG_EPSOM_PER_PPM_GH * input.volumeL) / 1000,
    bicarbG: (khAdd * MG_BICARB_PER_PPM_KH * input.volumeL) / 1000,
    gh: gh0 + ghAdd, kh: kh0 + khAdd, notes,
  });
}

/** The recipe nearest to a given water, by distance on the GH/KH map. */
export function nearestRecipe(gh: number, kh: number): WaterRecipe {
  return WATER_RECIPES.reduce((a, r) => (Math.hypot(r.gh - gh, r.kh - kh) < Math.hypot(a.gh - gh, a.kh - kh) ? r : a));
}
