// Shared types for the coffee engine. Canonical units: grams, millilitres, °C, seconds, micrometres, mg.

export interface Notice {
  code: string;
  message: string;
  field?: string;
  /** A change the UI can offer as a button; applying it must produce a valid input. */
  patch?: Record<string, unknown>;
}

export type Result<T> =
  | { ok: true; value: T; warnings: Notice[] }
  | { ok: false; errors: Notice[] };

export interface Range { min: number; max: number }

export type MethodId =
  | 'v60' | 'chemex' | 'kalita' | 'french-press' | 'aeropress'
  | 'cold-brew' | 'drip-machine' | 'espresso' | 'moka';

export type MethodFamily = 'percolation' | 'immersion' | 'pressure';
export type Roast = 'light' | 'medium' | 'dark';
export type Strength = 'lighter' | 'classic' | 'stronger';

export type StepKind = 'prep' | 'bloom' | 'pour' | 'stir' | 'steep' | 'press' | 'drawdown' | 'pull' | 'heat' | 'dilute' | 'serve';

/** A step in the published base recipe; grams are cumulative water on the scale. */
export interface StepTemplate {
  kind: StepKind;
  atS: number;
  untilS?: number;
  toG?: number;
  text: string;
  cue: string;
}

export interface Method {
  id: MethodId;
  label: string;
  family: MethodFamily;
  /** Water : coffee for brewed coffee; yield : dose for espresso. */
  ratio: { lighter: number; classic: number; stronger: number };
  tempC: { default: number; min: number; max: number };
  /** Total contact/brew time for the base recipe. */
  timeS: Range;
  grindMicrons: Range;
  grindLabel: string;
  texture: string;
  /** Water held back by the spent grounds, g per g of coffee. */
  retentionGPerG: number;
  /** The published recipe the steps come from. */
  base: { doseG: number; waterG: number; by: string };
  steps: StepTemplate[];
  /** Practical limits of the brewer. */
  capacity: { minDoseG: number; maxDoseG: number; maxWaterG?: number };
  filter: 'paper' | 'metal' | 'none';
  sourceIds: string[];
  /** Data still waiting for an independent check. */
  verify?: string[];
}

export interface RecipeInput {
  method: MethodId;
  /** Exactly one target: the cup you want, the coffee you have, or the water you'll pour (espresso: dose). */
  target: { cupMl: number } | { doseG: number } | { waterG: number };
  strength?: Strength;
  /** Explicit water:coffee (espresso yield:dose) ratio; overrides strength. */
  ratio?: number;
  roast?: Roast;
}

export interface Step {
  kind: StepKind;
  atS: number;
  untilS?: number;
  /** Cumulative scale reading to reach, in grams. */
  toG?: number;
  text: string;
  cue: string;
}

export interface Recipe {
  method: MethodId;
  doseG: number;
  /** Brew water poured. For espresso: undefined (see yieldG). */
  waterG?: number;
  /** Espresso only: liquid in the cup by weight. */
  yieldG?: number;
  cupMl: number;
  ratio: number;
  tempC: number;
  timeS: Range;
  steps: Step[];
  grind: { microns: Range; label: string; texture: string };
  /** Cold brew and iced drinks: what to add after brewing. */
  dilution?: { waterG: number; servedMl: number };
  strength: StrengthEstimate;
  by: string;
  sourceIds: string[];
}

export interface StrengthEstimate {
  tdsPct: Range;
  eyPct: Range;
  illustrative: true;
}
