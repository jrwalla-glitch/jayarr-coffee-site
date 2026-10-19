// Coffee Drinks: a published drink recipe sized to the reader's own cup (Wave F r1, C4).
// The rules, so the result stays the named recipe and not a new one:
// - The recipe's reference size is its published cup. With no published cup, it's the drink's own published
//   volume, treated as a full cup (and the result says so). With neither, nothing is scaled.
// - Milk, frothed milk, foam, hot water and brewed coffee scale with the cup, by the same factor.
// - The espresso doesn't: a double stays a double, a single stays a single, and a shot whose volume isn't
//   published stays unpublished. Chocolate, gelato and cream stay as the recipe gives them.
// - So a bigger cup makes the drink milkier per shot, by exactly the scaling factor. Past twice the recipe's
//   milk per shot (or under half), or when the scaled drink won't fit, the cup is called too large (too
//   small) for this recipe, and no scaled amounts are given for it.
// - A single-shot recipe in a cup more than twice its size can be made twice: two shots, milk scaled to fit.
// - Grams are not millilitres: a recipe weighed in grams with no cup isn't fitted by volume.
import type { DrinkRef, LayerKind } from './drinks.ts';

const SCALES: LayerKind[] = ['milk', 'frothed', 'foam', 'water', 'brewed'];
/** Milk (or water) per shot, relative to the recipe, that still counts as the recipe. */
export const FIT_RANGE = { min: 0.5, max: 2 } as const;

export interface FitLayer {
  kind: LayerKind;
  /** True for the espresso and the other parts that don't grow with the cup. */
  fixed: boolean;
  ml?: [number, number];
  g?: [number, number];
  amount?: string;
  unspecified?: boolean;
  basis?: string;
}

export type FitBlock = 'espresso-only' | 'unpublished' | 'by-weight' | 'no-basis';

export interface Fit {
  ok: true;
  /** Cup size ÷ the recipe's reference size. */
  factor: number;
  basis: 'cup' | 'drink';
  /** The recipe's reference size in ml (midpoint) and as published. */
  refMl: number;
  refRange: [number, number];
  /** 1, or 2 when a single-shot recipe is made twice. */
  times: 1 | 2;
  layers: FitLayer[];
  /** The scaled drink's volume in ml, when every part's volume is published. */
  totalMl?: number;
  /** Milk (or water) per shot relative to the recipe: factor ÷ times. */
  perShot: number;
  verdict: 'fits' | 'too-large' | 'too-small';
  /** The scaled parts alone don't fit the cup. */
  overflow: boolean;
  /** Where the recipe gives its cup and every other part but not the shot's volume: the room its own cup
   *  leaves for the shot (cup less the rest), in ml, made twice when the recipe is. It counts toward the fit. */
  shotRoomMl?: [number, number];
}

export type CupFit = Fit | { ok: false; why: FitBlock };

const mid = (r: [number, number]) => (r[0] + r[1]) / 2;

/** What a recipe's amounts are measured against: its published cup, or its own published volume. */
export function referenceSize(ref: DrinkRef): { ml: number; range: [number, number]; basis: 'cup' | 'drink' } | null {
  if (ref.vessel.capacityMl) return { ml: mid(ref.vessel.capacityMl), range: ref.vessel.capacityMl, basis: 'cup' };
  if (ref.layers.length && ref.layers.every((l) => l.ml)) {
    const lo = ref.layers.reduce((t, l) => t + l.ml![0], 0), hi = ref.layers.reduce((t, l) => t + l.ml![1], 0);
    return { ml: (lo + hi) / 2, range: [lo, hi], basis: 'drink' };
  }
  return null;
}

/**
 * The room a recipe's own cup leaves for a shot whose volume it doesn't publish: the cup, less every other
 * part it does publish (Wave F r2, Opus). Cimbali's flat white puts 125–130 ml of frothed milk in a 150–160 ml
 * cup, which leaves 20–35 ml for its double shot. The shot doesn't shrink with a smaller cup, so this room
 * counts toward the fit; without it a 4 oz cup was given 95–100 ml of milk plus a shot it can't hold.
 * Null where the recipe gives the shot's volume, no cup, or another part without a volume.
 */
export function shotRoom(ref: DrinkRef): [number, number] | null {
  const e = ref.layers.find((l) => l.kind === 'espresso');
  if (!e || e.ml || e.g || !ref.vessel.capacityMl) return null;
  const rest = ref.layers.filter((l) => l !== e);
  if (!rest.every((l) => l.ml)) return null;
  const lo = ref.vessel.capacityMl[0] - rest.reduce((t, l) => t + l.ml![1], 0);
  const hi = ref.vessel.capacityMl[1] - rest.reduce((t, l) => t + l.ml![0], 0);
  return hi > 0 ? [Math.max(0, lo), hi] : null;
}

/** A recipe can be made twice only when it is one shot (or a stated espresso volume, like Hoffmann's 30 ml). */
export function canMakeTwice(ref: DrinkRef): boolean {
  const e = ref.layers.find((l) => l.kind === 'espresso');
  return ref.shots === 'single' || (ref.shots === 'not stated' && !!e?.ml);
}

export function fitToCup(ref: DrinkRef, cupMl: number, times: 1 | 2 = 1): CupFit {
  const scalable = ref.layers.filter((l) => SCALES.includes(l.kind) && l.ml);
  if (!scalable.length) {
    if (ref.layers.every((l) => l.kind === 'espresso')) return { ok: false, why: 'espresso-only' };
    if (ref.layers.some((l) => SCALES.includes(l.kind) && l.g)) return { ok: false, why: 'by-weight' };
    return { ok: false, why: 'unpublished' };
  }
  const size = referenceSize(ref);
  if (!size) return { ok: false, why: ref.layers.some((l) => l.g) ? 'by-weight' : 'no-basis' };
  const factor = cupMl / size.ml;
  const scale = (r: [number, number], k: number): [number, number] => [r[0] * k, r[1] * k];
  const layers: FitLayer[] = ref.layers.map((l) => {
    if (SCALES.includes(l.kind) && l.ml) return { kind: l.kind, fixed: false, ml: scale(l.ml, factor), basis: l.basis };
    if (l.kind === 'espresso') return { kind: l.kind, fixed: true, ml: l.ml ? scale(l.ml, times) : undefined, g: l.g ? scale(l.g, times) : undefined, unspecified: l.unspecified };
    return { kind: l.kind, fixed: true, ml: l.ml, g: l.g, amount: l.amount, unspecified: l.unspecified, basis: l.basis };
  });
  const totalMl = layers.every((l) => l.ml) ? layers.reduce((t, l) => t + mid(l.ml!), 0) : undefined;
  // What's known has to fit; a part whose volume isn't published can only make it fuller. An unpublished shot
  // takes the room the recipe's own cup leaves for it, once per shot.
  const room = shotRoom(ref);
  const shotRoomMl: [number, number] | undefined = room ? [room[0] * times, room[1] * times] : undefined;
  const knownMl = layers.reduce((t, l) => t + (l.ml ? mid(l.ml) : 0), 0) + (shotRoomMl ? mid(shotRoomMl) : 0);
  // An estimated shot gets 1% of the cup as slack, so a cup at the low end of the recipe's own size range
  // (150 ml for Cimbali's 150–160 ml) still fits, to the brim.
  const overflow = knownMl > cupMl + (shotRoomMl ? Math.max(0.5, cupMl * 0.01) : 0.5);
  const perShot = factor / times;
  const verdict = overflow || perShot < FIT_RANGE.min ? 'too-small' : perShot > FIT_RANGE.max ? 'too-large' : 'fits';
  return { ok: true, factor, basis: size.basis, refMl: size.ml, refRange: size.range, times, layers, totalMl, perShot, verdict, overflow, shotRoomMl };
}

/** Rounded for a kitchen: to the nearest 5 ml (1 ml under 20 ml), never pretending to more precision than that. */
export function roundMl(ml: number): number {
  return ml < 20 ? Math.round(ml) : Math.round(ml / 5) * 5;
}
