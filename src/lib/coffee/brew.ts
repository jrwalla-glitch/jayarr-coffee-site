import type { Method, Notice, Range, Recipe, RecipeInput, Result, Roast, Step, StrengthEstimate } from './types.ts';
import { EY_BY_METHOD, methodById } from './methods.ts';
import { failure, finite, success } from './units.ts';

const RATIO_BOUNDS: Record<Method['family'] | 'espresso' | 'cold', Range> = {
  percolation: { min: 10, max: 22 },
  immersion: { min: 10, max: 22 },
  pressure: { min: 7, max: 14 },
  espresso: { min: 1, max: 4 },
  cold: { min: 3, max: 10 },
};

function ratioBounds(m: Method): Range {
  if (m.id === 'espresso') return RATIO_BOUNDS.espresso;
  if (m.id === 'cold-brew') return RATIO_BOUNDS.cold;
  return RATIO_BOUNDS[m.family];
}

/** Light roasts toward the hot end of the method's range, dark toward the cool end. */
function tempFor(m: Method, roast: Roast): number {
  if (roast === 'light') return m.tempC.max;
  if (roast === 'dark') return m.tempC.min;
  return m.tempC.default;
}

/** Light roasts toward the fine half of the band, dark toward the coarse half. */
function grindFor(m: Method, roast: Roast): Range {
  const mid = (m.grindMicrons.min + m.grindMicrons.max) / 2;
  if (roast === 'light') return { min: m.grindMicrons.min, max: mid };
  if (roast === 'dark') return { min: mid, max: m.grindMicrons.max };
  return { ...m.grindMicrons };
}

export function estimateStrength(methodId: Recipe['method'], doseG: number, beverageG: number): StrengthEstimate {
  const ey = EY_BY_METHOD[methodId];
  return {
    eyPct: { ...ey },
    tdsPct: { min: (ey.min * doseG) / beverageG, max: (ey.max * doseG) / beverageG },
    illustrative: true,
  };
}

/** Grams of coffee for a served cup by the method's own arithmetic, ignoring brewer size limits. */
export function doseForCup(m: Method, cupMl: number, ratio: number): number {
  if (m.id === 'espresso') return cupMl / ratio;
  // Cold brew: the served drink is the concentrate diluted one to one.
  if (m.id === 'cold-brew') return cupMl / 2 / (ratio - m.retentionGPerG);
  return cupMl / (ratio - m.retentionGPerG);
}

export function buildRecipe(input: RecipeInput): Result<Recipe> {
  const m = methodById(input?.method);
  if (!m) return failure('unknown-method', 'method', 'Choose a brewer.');
  const roast: Roast = input.roast ?? 'medium';
  const ratio = finite(input.ratio) ? input.ratio : m.ratio[input.strength ?? 'classic'];
  const bounds = ratioBounds(m);
  if (!finite(ratio) || ratio < bounds.min || ratio > bounds.max) {
    return failure('ratio-out-of-range', 'ratio', `Use a ratio between 1:${bounds.min} and 1:${bounds.max} for ${m.label}.`, { ratio: m.ratio.classic });
  }

  const t = input.target ?? {};
  const value = 'cupMl' in t ? t.cupMl : 'doseG' in t ? t.doseG : 'waterG' in t ? t.waterG : NaN;
  const field = 'cupMl' in t ? 'cupMl' : 'doseG' in t ? 'doseG' : 'waterG';
  if (!finite(value) || value <= 0) return failure('missing-amount', field, 'Enter an amount greater than zero.');

  const warnings: Notice[] = [];
  const r = m.retentionGPerG;
  let doseG: number;
  let waterG: number | undefined;
  let yieldG: number | undefined;
  let cupMl: number;
  let dilution: Recipe['dilution'];

  if (m.id === 'espresso') {
    if ('waterG' in t) return failure('espresso-no-water', 'waterG', 'Espresso is set by the coffee dose and the yield in the cup, not by water poured.');
    doseG = 'doseG' in t ? t.doseG : doseForCup(m, t.cupMl, ratio);
    yieldG = doseG * ratio;
    cupMl = yieldG;
  } else if (m.id === 'cold-brew') {
    // Target cup = served drink after diluting the concentrate one to one.
    doseG = 'doseG' in t ? t.doseG : 'waterG' in t ? t.waterG / ratio : doseForCup(m, t.cupMl, ratio);
    waterG = doseG * ratio;
    const conc = waterG - r * doseG;
    dilution = { waterG: conc, servedMl: conc * 2 };
    cupMl = conc * 2;
  } else {
    doseG = 'doseG' in t ? t.doseG : 'waterG' in t ? t.waterG / ratio : doseForCup(m, t.cupMl, ratio);
    waterG = doseG * ratio;
    cupMl = waterG - r * doseG;
  }

  if (doseG > m.capacity.maxDoseG) {
    const maxCup = m.id === 'espresso' ? m.capacity.maxDoseG * ratio : m.capacity.maxDoseG * (ratio - r) * (m.id === 'cold-brew' ? 2 : 1);
    const message = m.id === 'aeropress'
      ? `That needs ${Math.round(doseG)} g of coffee; one AeroPress takes about ${m.capacity.maxDoseG} g. Make two presses, or choose a smaller cup.`
      : `That needs ${Math.round(doseG)} g of coffee, more than a ${m.label} handles well (about ${m.capacity.maxDoseG} g).`;
    return failure('over-capacity', field, message, { target: { cupMl: Math.floor(maxCup) } });
  }
  if (m.capacity.maxWaterG && m.id !== 'aeropress' && waterG && waterG > m.capacity.maxWaterG) {
    return failure('over-capacity', field, `That's ${Math.round(waterG)} g of water, more than a typical ${m.label} holds.`, { target: { waterG: m.capacity.maxWaterG } });
  }
  if (doseG < m.capacity.minDoseG) {
    warnings.push({ code: 'small-batch', message: `Below about ${m.capacity.minDoseG} g the bed is shallow and drains fast; expect to grind a little finer.` });
  }

  // AeroPress: the chamber holds about 230 g; the rest is hot water added after pressing.
  let bypassG = 0;
  if (m.id === 'aeropress' && waterG && m.capacity.maxWaterG && waterG > m.capacity.maxWaterG) {
    bypassG = waterG - m.capacity.maxWaterG;
  }

  const waterScale = (waterG ?? yieldG ?? 0) / m.base.waterG;
  const doseScale = doseG / m.base.doseG;
  if (m.family === 'percolation' && m.id !== 'drip-machine' && waterScale > 1.4) {
    warnings.push({ code: 'large-batch', message: 'A bigger batch than the recipe was written for drains more slowly. Grind a touch coarser and expect a longer drawdown.' });
  }

  const steps: Step[] = m.steps.map((s) => {
    let toG: number | undefined;
    if (s.toG !== undefined) {
      if (s.kind === 'bloom') toG = s.toG * doseScale;
      else if (s.kind === 'pull') toG = yieldG;
      else if (m.id === 'aeropress' && s.kind === 'pour') toG = (waterG ?? 0) - bypassG;
      else toG = s.toG * waterScale;
    }
    return { kind: s.kind, atS: s.atS, untilS: s.untilS, toG, text: s.text, cue: s.cue };
  });
  if (bypassG > 0) {
    const last = m.steps[m.steps.length - 1];
    steps.push({ kind: 'dilute', atS: last.untilS ?? last.atS, toG: waterG, text: `Top up the cup with ${Math.round(bypassG)} g of hot water.`, cue: 'The chamber only holds about 230 g; the rest goes in after pressing.' });
  }
  if (m.id === 'cold-brew' && dilution) {
    const d = steps.find((s) => s.kind === 'dilute');
    if (d) d.text = `Mix the concentrate one to one: add about ${Math.round(dilution.waterG)} g of cold water or milk, and serve over ice.`;
  }

  const beverageG = m.id === 'espresso' ? (yieldG as number) : m.id === 'cold-brew' ? (dilution as { servedMl: number }).servedMl : cupMl;
  const recipe: Recipe = {
    method: m.id,
    doseG,
    waterG,
    yieldG,
    cupMl,
    ratio,
    tempC: tempFor(m, roast),
    timeS: { ...m.timeS },
    steps,
    grind: { microns: grindFor(m, roast), label: m.grindLabel, texture: m.texture },
    dilution,
    strength: estimateStrength(m.id, doseG, beverageG),
    by: m.base.by,
    sourceIds: [...m.sourceIds],
  };
  return success(recipe, warnings);
}
