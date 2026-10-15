// Grind Calibrator: each grinder's own published starting settings, by brew method.
// Data: src/data/grinders.json, built by makeover-2026-10/tools/build_grinders.py from the makers'
// charts and manuals (checked 2026-10-15). Values stay in each maker's own unit: a "15" on one
// grinder means nothing on another, so nothing here converts between grinders.

export type Kind = 'dial' | 'turns' | 'named' | 'text';
export type Group = 'espresso' | 'moka' | 'aeropress' | 'pourover' | 'chemex' | 'drip' | 'french-press' | 'cold-brew';

export interface Setting {
  key: string; group: Group; label: string; provenance: 'maker' | 'documented-secondary';
  source?: string; url?: string; checked?: string;
  min?: number | null; max?: number | null; start?: number | null; openTop?: boolean;
  categories?: string[]; published?: string;
  /** The maker's own name for the method, where it differs (Baratza's "Automatic Brewer"). */
  makerLabel?: string;
  /** Wording where the source's own range or scope needs saying (a conflict, a recipe-scoped start). */
  headline?: string; note?: string;
}
export interface Grinder {
  id: string; name: string; short: string; maker: string; type: 'electric' | 'hand'; kind: Kind;
  unit: string; unitDetail: string; scale: [number, number] | null; step: number | null; stepless: boolean;
  perTurn: number | null; sub?: string | null; avoid?: [number, number] | null; categories?: string[] | null;
  stepMicrons: number | null; zeroNote: string | null; cautions: string[];
  /** What one step is, in the maker's terms; which model or revision the settings apply to; travel notes. */
  stepNote?: string | null; applies?: string | null; rulerNote?: string | null;
  /** What the maker says about its settings (starting points, a reference, a band), in plain words. */
  startingPoint: { status?: string; note?: string | null; url?: string | null };
  chart: { title?: string | null; url?: string | null }; status?: string | null;
  amazon: { asin: string; url: string } | null; settings: Setting[];
}

export const GROUPS: { id: Group; label: string; brew: string }[] = [
  { id: 'espresso', label: 'Espresso', brew: 'espresso' },
  { id: 'moka', label: 'Moka pot', brew: 'moka' },
  { id: 'aeropress', label: 'AeroPress', brew: 'aeropress' },
  { id: 'pourover', label: 'Pour-over', brew: 'v60' },
  { id: 'chemex', label: 'Chemex', brew: 'chemex' },
  { id: 'drip', label: 'Drip machine', brew: 'drip-machine' },
  { id: 'french-press', label: 'French press', brew: 'french-press' },
  { id: 'cold-brew', label: 'Cold brew', brew: 'cold-brew' },
];

export const settingsFor = (g: Grinder, group: Group) => g.settings.filter((s) => s.group === group);
export const groupsFor = (g: Grinder) => GROUPS.filter((x) => settingsFor(g, x.id).length > 0);

const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100));
/** "15", "18 to 35", "45 and coarser", in the grinder's own unit. */
export function rangeText(s: Setting): string {
  if (s.published) return s.published;
  if (s.categories) return s.categories.join(' to ');
  if (s.min == null) return '';
  if (s.openTop) return `${fmt(s.min)} and coarser`;
  if (s.max == null || s.max === s.min) return fmt(s.min);
  return `${fmt(s.min)} to ${fmt(s.max)}`;
}

/** A turn-counted value as turns plus a remainder ("3 turns + 2"), for grinders whose maker gives the units per turn. */
export function turnsText(v: number, g: Pick<Grinder, 'perTurn' | 'unit'>): string | null {
  if (!g.perTurn) return null;
  const turns = Math.floor(v / g.perTurn + 1e-9), rest = Math.round((v - turns * g.perTurn) * 100) / 100;
  if (turns === 0) return `${fmt(rest)} on the first turn`;
  const t = `${turns} turn${turns === 1 ? '' : 's'}`;
  return rest === 0 ? t : `${t} + ${fmt(rest)}`;
}

/** The headline: "Start at 15", "Start between 18 and 35 clicks from zero", "Start in Medium". */
export function headline(g: Grinder, s: Setting): string {
  if (s.headline) return s.headline;
  if (s.published) return `As published: ${s.published}`;
  if (s.categories) return s.categories.length === 1 ? `Start at ${s.categories[0]}` : `Start between ${s.categories.join(' and ')}`;
  // Turn-counted grinders with a published turn size read in turns, the way the hand counts them:
  // full turns first, then the clicks or numbers past them, always with the unit.
  if (g.kind === 'turns' && g.perTurn && s.min != null) {
    const pt = g.perTurn, u = g.unit;
    const turns = (n: number) => `${n} full turn${n === 1 ? '' : 's'}`;
    const at = (v: number) => {
      const n = Math.floor(v / pt + 1e-9), r = Math.round((v - n * pt) * 100) / 100;
      return n === 0 ? `${fmt(r)} ${u} on the first turn` : r === 0 ? turns(n) : `${turns(n)} + ${fmt(r)} ${u}`;
    };
    if (s.start != null) return `Start at ${at(s.start)}`;
    if (s.max == null || s.max === s.min) return `Start at ${at(s.min)}`;
    if (s.max <= pt) return `Start between ${fmt(s.min)} and ${fmt(s.max)} ${u} on the first turn`;
    // Both ends within one turn (its end included): the full turns, then the span past them.
    const n = Math.floor(s.min / pt + 1e-9);
    if (s.max <= (n + 1) * pt) {
      const a = Math.round((s.min - n * pt) * 100) / 100, b = Math.round((s.max - n * pt) * 100) / 100;
      return a === 0 ? `Start at ${turns(n)}, then up to ${fmt(b)} ${u} more` : `Start ${turns(n)} in, then ${fmt(a)} to ${fmt(b)} ${u} more`;
    }
    return `Start between ${at(s.min)} and ${at(s.max)}`;
  }
  const unit = g.kind === 'turns' ? ` ${g.unit} from zero` : '';
  if (s.start != null) return `Start at ${fmt(s.start)}${unit}`;
  if (s.openTop) return `Start at ${fmt(s.min!)}${unit} or coarser`;
  if (s.max == null || s.max === s.min) return `Start at ${fmt(s.min!)}${unit}`;
  return `Start between ${fmt(s.min!)} and ${fmt(s.max)}${unit}`;
}

/** The headline in the grinder's own count from zero ("Start between 32 and 44 numbers from zero"), matching the ruler. */
export const countHeadline = (g: Grinder, s: Setting) => headline({ ...g, perTurn: null }, s);

/** The same setting as the hand turns it, for the line under a count headline ("3 full turns + 2 numbers to 4 full turns + 4 numbers"). */
export function turnsLine(g: Grinder, s: Setting): string | null {
  if (g.kind !== 'turns' || !g.perTurn || s.min == null) return null;
  return headline(g, s).replace(/^Start (at )?/, '').replace(/^between (.+) and (.+)$/, '$1 to $2');
}

export function grinderById(list: Grinder[], id: string | null): Grinder | null {
  return id ? list.find((g) => g.id === id) ?? null : null;
}
