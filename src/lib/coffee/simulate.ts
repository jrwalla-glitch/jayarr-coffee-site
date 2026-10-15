import type { Recipe, Step } from './types.ts';
import { methodById } from './methods.ts';

// Brew-along simulation: what the scale, the brewer and the cup look like at any second of a
// recipe. Drives the Brew Guide's animation. Illustrative: real drawdown depends on grind and
// filter; the target pace (scale reading) is exact, the drain curve is a model.

export interface Frame {
  tS: number;
  /** What a scale under brewer and cup reads: water poured (espresso: liquid in the cup). */
  scaleG: number;
  /** Free liquid sitting in the brewer above the grounds. */
  brewerG: number;
  /** Liquid in the cup or server. */
  cupG: number;
  pouring: boolean;
  dripping: boolean;
  stepIndex: number;
}

export interface Simulation {
  durationS: number;
  at(tS: number): Frame;
}

/** Cumulative water poured at t, following the step targets linearly within each pour window. */
function pouredAt(steps: Step[], tS: number): { g: number; pouring: boolean } {
  let g = 0, pouring = false;
  for (const s of steps) {
    if (s.toG === undefined || (s.kind !== 'bloom' && s.kind !== 'pour' && s.kind !== 'dilute')) continue;
    const start = s.atS, end = s.untilS ?? s.atS + 10;
    if (tS >= end) g = s.toG;
    else if (tS > start) { g = g + (s.toG - g) * ((tS - start) / (end - start)); pouring = true; break; }
    else break;
  }
  return { g, pouring };
}

function activeStep(steps: Step[], tS: number): number {
  let idx = 0;
  steps.forEach((s, i) => { if (s.kind !== 'prep' && tS >= s.atS) idx = i; });
  return idx;
}

export function simulate(recipe: Recipe): Simulation {
  const m = methodById(recipe.method);
  if (!m) throw new Error('unknown method');
  const steps = recipe.steps;
  const last = steps[steps.length - 1];
  const durationS = Math.max(last.untilS ?? last.atS, recipe.timeS.max);

  if (m.family === 'percolation') {
    // Drain model: outflow k·√(free); k fitted so the bed is drained by the recipe's drawdown end.
    const retainedMax = m.retentionGPerG * recipe.doseG;
    const endS = last.untilS ?? last.atS;
    const run = (k: number, untilS: number) => {
      const dt = 0.25; let drained = 0; const frames: Frame[] = [];
      for (let t = 0; t <= untilS + 1e-9; t += dt) {
        const { g, pouring } = pouredAt(steps, t);
        const retained = Math.min(g, retainedMax);
        let free = Math.max(0, g - retained - drained);
        const out = Math.min(free, k * Math.sqrt(free) * dt);
        drained += out; free -= out;
        frames.push({ tS: t, scaleG: g, brewerG: free, cupG: drained, pouring, dripping: out > 0.01, stepIndex: activeStep(steps, t) });
      }
      return frames;
    };
    let lo = 0.05, hi = 5;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const f = run(mid, endS);
      (f[f.length - 1].brewerG > 0.5 ? (lo = mid) : (hi = mid));
    }
    const frames = run(hi, durationS);
    return { durationS, at: (tS) => frames[Math.max(0, Math.min(frames.length - 1, Math.round(tS / 0.25)))] };
  }

  if (m.id === 'espresso') {
    const pull = steps.find((s) => s.kind === 'pull');
    const end = pull?.untilS ?? 28, firstDrops = Math.min(8, end * 0.3), y = recipe.yieldG ?? 0;
    return {
      durationS: end,
      at: (tS) => {
        const f = Math.max(0, Math.min(1, (tS - firstDrops) / (end - firstDrops)));
        return { tS, scaleG: y * f, brewerG: 0, cupG: y * f, pouring: false, dripping: f > 0 && f < 1, stepIndex: tS > 0 ? 1 : 0 };
      },
    };
  }

  // Immersion and moka: liquid stays in the brewer until the press (or the moka's heat) releases it.
  // AeroPress top-up water goes straight into the cup.
  const release = steps.find((s) => s.kind === 'press') ?? steps.find((s) => s.kind === 'heat');
  const rs = release?.atS ?? durationS, re = release?.untilS ?? rs + 20;
  const chamberSteps = steps.filter((s) => s.kind !== 'dilute');
  const cp = pouredAt(chamberSteps, Number.POSITIVE_INFINITY).g;
  const out = cp - Math.min(cp, m.retentionGPerG * recipe.doseG);
  const bypass = steps.find((s) => s.kind === 'dilute' && s.toG !== undefined);
  const bypassG = bypass && bypass.toG !== undefined ? bypass.toG - cp : 0;
  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  return {
    // Ends when the recipe's own steps end (cold brew: the 12-hour press), not at the longest steep the method allows.
    durationS: Math.max(last.untilS ?? last.atS, re, bypass ? bypass.atS + 10 : 0),
    at: (tS) => {
      const { g, pouring } = pouredAt(chamberSteps, tS);
      const f = clamp((tS - rs) / Math.max(1, re - rs));
      const b = bypass ? clamp((tS - bypass.atS) / 10) * bypassG : 0;
      return { tS, scaleG: g + b, brewerG: Math.max(0, g - out * f), cupG: out * f + b, pouring: pouring || (b > 0 && b < bypassG), dripping: f > 0 && f < 1, stepIndex: activeStep(steps, tS) };
    },
  };
}
