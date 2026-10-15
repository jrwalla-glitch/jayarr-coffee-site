import type { Notice, Result } from './types.ts';

export const G_PER_OZ = 28.349523125;
export const ML_PER_FL_OZ = 29.5735295625;

export const gToOz = (g: number) => g / G_PER_OZ;
export const ozToG = (oz: number) => oz * G_PER_OZ;
export const mlToFlOz = (ml: number) => ml / ML_PER_FL_OZ;
export const flOzToMl = (flOz: number) => flOz * ML_PER_FL_OZ;
export const cToF = (c: number) => c * 9 / 5 + 32;
export const fToC = (f: number) => (f - 32) * 5 / 9;

/** Rough kitchen-spoon equivalent. Whole beans pour lighter than ground coffee; always approximate. */
export function approxTablespoons(g: number, form: 'whole' | 'ground'): number {
  return g / (form === 'whole' ? 5.5 : 5);
}

export const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

export const success = <T>(value: T, warnings: Notice[] = []): Result<T> => ({ ok: true, value, warnings });
export const failure = <T>(code: string, field: string, message: string, patch?: Record<string, unknown>): Result<T> =>
  ({ ok: false, errors: [{ code, field, message, ...(patch ? { patch } : {}) }] });
