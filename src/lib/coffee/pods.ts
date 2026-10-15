// Nespresso pods: one catalogue, two systems that never mix. A pod's identity is its system plus its
// name (Original Colombia and Vertuo Colombia are different capsules), and every list, suggestion
// and link stays inside the reader's own system.
// Data: src/data/nespressoPods.json, checked against Nespresso's live US catalogue on 2026-10-15 by Astra
// (makeover-2026-10/research/RESEARCH_PODS.md, R18/R21). Colours are approximate.

export type Line = 'original' | 'vertuo';
export type Roast = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';
/** current, limited (limited edition) and seasonal are on sale; unlisted is not in the current US range
 * (not the same as discontinued); retired is corroborated as discontinued. */
export type Status = 'current' | 'limited' | 'seasonal' | 'unlisted' | 'retired';

export interface RawPod {
  name: string; line: Line; cup_size: string; ml: number; intensity: number | null; blend: string | null; aroma: string;
  category: string; color_hex: string; description: string | null; best_for: string | null; try_also?: string;
  /** Nespresso's own US roast filter (Light, Medium, Dark), not a measurement; null when unpublished. */
  roast_level: Roast | null;
  /** Nespresso's roastiness on its 1–5 sensory scale, when published. */
  roastiness?: number | null;
  status: Status; discontinued?: boolean; note?: string; decaf?: boolean; flavored?: boolean;
  /** Other cups the capsule is made to brew, when Nespresso lists more than one. */
  servings?: { cup_size: string; ml: number }[];
  source_url?: string; checked?: string;
  /** What the source link is, when it isn't the capsule's own Nespresso page (a retirement notice). */
  source_label?: string;
  /** Nespresso adds caffeine to this blend (Arpeggio Extra): never suggested as a like-for-like swap. */
  caffeine_boosted?: boolean;
  /** Earlier names, so saved links keep working after a rename. */
  aliases?: string[];
}

export const LINES: Record<Line, { label: string; short: string; how: string }> = {
  original: { label: 'Original', short: 'Small capsules, pressure-brewed', how: 'Espresso, ristretto and lungo from a pump, like a small espresso machine.' },
  vertuo: { label: 'Vertuo', short: 'Dome capsules, spun and barcoded', how: 'The machine reads a barcode and spins the capsule; cups run from a 25 ml ristretto to a 355 ml Alto pour.' },
};
export const ROASTS: Roast[] = ['Light', 'Medium', 'Medium-Dark', 'Dark'];

const SIZE_NAMES: Record<string, string> = { espresso: 'Espresso', double_espresso: 'Double Espresso', gran_lungo: 'Gran Lungo', mug: 'Mug', alto: 'Alto', lungo: 'Lungo', cold_brew: 'Over ice' };
/** On sale now: current, limited and seasonal capsules. */
export const onSale = (p: Pick<RawPod, 'status'>) => p.status === 'current' || p.status === 'limited' || p.status === 'seasonal';
export const STATUS_NOTE: Record<Status, string> = {
  current: '', limited: 'Limited edition', seasonal: 'Seasonal',
  unlisted: 'Not in Nespresso\'s current US range', retired: 'Discontinued by Nespresso',
};
/** "Espresso", or "Ristretto" for a 25 ml espresso-family pod: the badge names the cup the pod makes. */
export function sizeName(p: Pick<RawPod, 'cup_size' | 'ml'>): string {
  if (p.cup_size === 'espresso' && p.ml <= 30) return 'Ristretto';
  return SIZE_NAMES[p.cup_size] ?? p.cup_size;
}

const slugOf = (line: Line, name: string) => `${line}-${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
export interface Pod extends RawPod { id: string; slug: string; size: string; oldSlugs: string[] }
export function catalog(raw: RawPod[]): Pod[] {
  return raw.map((p) => ({ ...p, id: `${p.line}:${p.name}`, slug: slugOf(p.line, p.name), size: sizeName(p), oldSlugs: (p.aliases ?? []).map((a) => slugOf(p.line, a)) }));
}

/** The cup sizes a system makes, smallest first: the rows of the wall and the cups of the ladder. */
export interface SizeRow { key: string; name: string; ml: number }
export function sizeRows(pods: Pod[], line: Line): SizeRow[] {
  const seen = new Map<string, SizeRow>();
  for (const p of pods) if (p.line === line) { const key = `${p.size}-${p.ml}`; if (!seen.has(key)) seen.set(key, { key, name: p.size, ml: p.ml }); }
  return [...seen.values()].sort((a, b) => a.ml - b.ml);
}

/**
 * Aroma families, from Nespresso's own aroma words. A pod can belong to several ("Cocoa & Fruity").
 * These group the published notes; they aren't our tasting.
 */
export const AROMA_FAMILIES: { id: string; label: string; words: RegExp }[] = [
  { id: 'fruity', label: 'Fruity or floral', words: /fruit|floral|berr|citrus|wine|winey|fruity|apple/i },
  { id: 'cereal', label: 'Cereal, biscuit or malt', words: /cereal|biscuit|malt|bread|toast|grain/i },
  { id: 'cocoa', label: 'Cocoa or chocolate', words: /cocoa|chocolate/i },
  { id: 'sweet', label: 'Caramel, sweet or nutty', words: /caramel|sugar|sweet|vanilla|hazelnut|nut|honey|toffee|maple|pecan/i },
  { id: 'roasted', label: 'Roasted or smoky', words: /roast|smok|burnt|intense|chicory/i },
  { id: 'woody', label: 'Woody, spicy or earthy', words: /wood|spic|earth|leather|pepper|oak|cinnamon/i },
  // Nespresso describes some capsules only by texture ("Round & Smooth", "Velvety & Rich").
  { id: 'smooth', label: 'Smooth, round or creamy', words: /smooth|round|velvet|butter|cream/i },
];
export const aromaFamilies = (p: Pick<RawPod, 'aroma'>) => AROMA_FAMILIES.filter((f) => f.words.test(p.aroma)).map((f) => f.id);

/**
 * The range a capsule belongs to, with Nespresso's near-duplicate labels joined ("Starbucks" and
 * "Starbucks® by Nespresso"; "Gran Lungo" and "Gran Lungo (5 oz)"), so a filter finds the whole family.
 */
const RANGE_JOIN: [RegExp, string][] = [
  [/^Starbucks/, 'Starbucks'],
  [/^Master (Origin|Crafted Single Origins)$/, 'Master Origins'],
  [/^Ristretto & Espresso/, 'Espresso'],
  [/^Gran Lungo/, 'Gran Lungo'],
  [/^(XL Coffees|Alto)$/, 'Alto and XL'],
  [/^(Festive )?Limited Edition$/, 'Limited Edition'],
];
export const rangeOf = (p: Pick<RawPod, 'category'>) => RANGE_JOIN.find(([re]) => re.test(p.category))?.[1] ?? p.category;

export interface PodFilters {
  line: Line; query?: string; roast?: Roast | 'all'; family?: string | 'all'; category?: string | 'all';
  decaf?: boolean; flavored?: 'any' | 'only' | 'none';
  /** Also show retired and unlisted capsules (hidden by default: you can't buy them). */
  includeUnlisted?: boolean;
}
export function filterPods(pods: Pod[], f: PodFilters): Pod[] {
  const q = (f.query ?? '').trim().toLowerCase();
  return pods.filter((p) => p.line === f.line
    && (f.includeUnlisted || onSale(p))
    && (!f.roast || f.roast === 'all' || p.roast_level === f.roast)
    && (!f.family || f.family === 'all' || aromaFamilies(p).includes(f.family))
    && (!f.category || f.category === 'all' || rangeOf(p) === f.category)
    && (!f.decaf || p.decaf)
    && (!f.flavored || f.flavored === 'any' || (f.flavored === 'only' ? !!p.flavored : !p.flavored))
    && (!q || [p.name, p.aroma, p.category, p.description, p.best_for].some((s) => s?.toLowerCase().includes(q))));
}

/**
 * Places on the wall: row = the cup size, column = intensity (0 = not rated). Within a cell, pods sort
 * by name so the wall reads the same on every visit.
 */
export interface Placed { pod: Pod; row: number; col: number; index: number }
export function wall(pods: Pod[], rows: SizeRow[]): Placed[] {
  const cells = new Map<string, Pod[]>();
  for (const p of pods) {
    const row = rows.findIndex((r) => r.name === p.size && r.ml === p.ml);
    if (row < 0) continue;
    const col = p.intensity ?? 0;
    const k = `${row}:${col}`;
    cells.set(k, [...(cells.get(k) ?? []), p]);
  }
  const out: Placed[] = [];
  for (const [k, list] of cells) {
    const [row, col] = k.split(':').map(Number);
    [...list].sort((a, b) => a.name.localeCompare(b.name)).forEach((pod, index) => out.push({ pod, row, col, index }));
  }
  return out.sort((a, b) => a.row - b.row || a.col - b.col || a.index - b.index);
}

/** The capsule of this system with this name or one of its earlier names: renames keep links,
 * suggestions and saved flights pointing at the same capsule. */
export function byName(pods: Pod[], line: Line, name: string): Pod | null {
  const n = name.trim().toLowerCase();
  return pods.find((p) => p.line === line && p.name.toLowerCase() === n)
    ?? pods.find((p) => p.line === line && (p.aliases ?? []).some((a) => a.toLowerCase() === n)) ?? null;
}
/** A stored or linked identity ("vertuo:Chiaro"), resolved through renames. */
export function podFromId(pods: Pod[], id: string): Pod | null {
  const m = /^(original|vertuo):(.+)$/.exec(id);
  return m ? byName(pods, m[1] as Line, m[2]) : null;
}
/** Saved flight ids, resolved through renames, deduplicated and capped at three per system. */
export function cleanFlight(pods: Pod[], ids: unknown): string[] {
  if (!Array.isArray(ids)) return [];
  const out: Pod[] = [];
  for (const x of ids) {
    const p = typeof x === 'string' ? podFromId(pods, x) : null;
    if (p && !out.includes(p) && out.filter((q) => q.line === p.line).length < 3) out.push(p);
  }
  return out.map((p) => p.id);
}

/** "Try also": the suggested pod in the same system, if it's in the catalogue and still made. */
export function tryAlso(pods: Pod[], pod: Pod): Pod | null {
  if (!pod.try_also) return null;
  const p = byName(pods, pod.line, pod.try_also);
  // The same like-for-like rule as "Similar": a decaf capsule never points to a caffeinated one, or the reverse.
  if (!p || p.id === pod.id || !onSale(p) || !!p.decaf !== !!pod.decaf || !!p.caffeine_boosted !== !!pod.caffeine_boosted) return null;
  return p;
}

/**
 * When there's no editorial "try also", the nearest current capsule on the same row of the wall:
 * same system and cup size, closest intensity, sharing an aroma family where possible. Shown as
 * "Similar", not as a recommendation.
 */
export function similar(pods: Pod[], pod: Pod): Pod | null {
  const fam = new Set(aromaFamilies(pod));
  // Like for like: decaf stays decaf, and a caffeine-enriched capsule is never offered as a near twin.
  const pool = pods.filter((p) => p.id !== pod.id && p.line === pod.line && p.size === pod.size && p.ml === pod.ml && onSale(p)
    && !!p.flavored === !!pod.flavored && !!p.decaf === !!pod.decaf && !!p.caffeine_boosted === !!pod.caffeine_boosted);
  const score = (p: Pod) => Math.abs((p.intensity ?? 0) - (pod.intensity ?? 0)) + (aromaFamilies(p).some((f) => fam.has(f)) ? 0 : 1.5);
  return pool.sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name))[0] ?? null;
}

/** A pod from a link: by slug (current or earlier name), else by "line:name" through renames. */
export function podFromParam(pods: Pod[], v: string | null): Pod | null {
  if (!v) return null;
  return pods.find((p) => p.slug === v || p.oldSlugs.includes(v)) ?? podFromId(pods, v);
}

/** Amazon search for this exact system and pod (a search, not a verified listing; the button says so). */
export function buySearch(p: Pod): string {
  const q = `Nespresso ${LINES[p.line].label} ${p.name} capsules`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(q).replace(/%20/g, '+')}&tag=jayarrcoffee-20`;
}

export const blendText = (b: string | null) => b === null ? null : (b === 'A' ? 'Arabica' : b === 'A/R' ? 'Arabica and robusta' : b === 'R/A' ? 'Robusta and arabica' : b);
