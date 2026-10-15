// Nespresso pods: one catalogue, two systems that never mix. A pod's identity is its system plus its
// name (Original Colombia and Vertuo Colombia are different capsules), and every list, suggestion
// and link stays inside the reader's own system.
// Data: src/data/nespressoPods.json (Nespresso chart and site, baseline March 2026; colours approximate).

export type Line = 'original' | 'vertuo';
export type Roast = 'Light' | 'Medium' | 'Medium-Dark' | 'Dark';

export interface RawPod {
  name: string; line: Line; cup_size: string; ml: number; intensity: number | null; blend: string; aroma: string;
  category: string; color_hex: string; description: string; roast_level: Roast; best_for: string; try_also?: string;
  amazon_url: string; discontinued?: boolean; note?: string; decaf?: boolean; flavored?: boolean;
}
export interface Pod extends RawPod { id: string; slug: string; size: string }

export const LINES: Record<Line, { label: string; short: string; how: string }> = {
  original: { label: 'Original', short: 'Small capsules, pressure-brewed', how: 'Espresso, ristretto and lungo from a pump, like a small espresso machine.' },
  vertuo: { label: 'Vertuo', short: 'Dome capsules, spun and barcoded', how: 'The machine reads a barcode and spins the capsule; sizes run from espresso to a large mug.' },
};
export const ROASTS: Roast[] = ['Light', 'Medium', 'Medium-Dark', 'Dark'];

const SIZE_NAMES: Record<string, string> = { espresso: 'Espresso', double_espresso: 'Double Espresso', gran_lungo: 'Gran Lungo', mug: 'Mug', alto: 'Alto', lungo: 'Lungo' };
/** "Espresso", or "Ristretto" for a 25 ml espresso-family pod: the badge names the cup the pod makes. */
export function sizeName(p: Pick<RawPod, 'cup_size' | 'ml'>): string {
  if (p.cup_size === 'espresso' && p.ml <= 30) return 'Ristretto';
  return SIZE_NAMES[p.cup_size] ?? p.cup_size;
}

export function catalog(raw: RawPod[]): Pod[] {
  return raw.map((p) => ({ ...p, id: `${p.line}:${p.name}`, slug: `${p.line}-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, size: sizeName(p) }));
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
  { id: 'fruity', label: 'Fruity or floral', words: /fruit|floral|berr|citrus|wine|winey|fruity/i },
  { id: 'cereal', label: 'Cereal, biscuit or malt', words: /cereal|biscuit|malt|bread|toast|grain/i },
  { id: 'cocoa', label: 'Cocoa or chocolate', words: /cocoa|chocolate/i },
  { id: 'sweet', label: 'Caramel, sweet or nutty', words: /caramel|sugar|sweet|vanilla|hazelnut|nut|honey|toffee|maple|pecan/i },
  { id: 'roasted', label: 'Roasted or smoky', words: /roast|smok|burnt|intense/i },
  { id: 'woody', label: 'Woody, spicy or earthy', words: /wood|spic|earth|leather|pepper|oak/i },
];
export const aromaFamilies = (p: Pick<RawPod, 'aroma'>) => AROMA_FAMILIES.filter((f) => f.words.test(p.aroma)).map((f) => f.id);

export interface PodFilters {
  line: Line; query?: string; roast?: Roast | 'all'; family?: string | 'all'; category?: string | 'all';
  decaf?: boolean; flavored?: 'any' | 'only' | 'none'; includeDiscontinued?: boolean;
}
export function filterPods(pods: Pod[], f: PodFilters): Pod[] {
  const q = (f.query ?? '').trim().toLowerCase();
  return pods.filter((p) => p.line === f.line
    && (f.includeDiscontinued || !p.discontinued)
    && (!f.roast || f.roast === 'all' || p.roast_level === f.roast)
    && (!f.family || f.family === 'all' || aromaFamilies(p).includes(f.family))
    && (!f.category || f.category === 'all' || p.category === f.category)
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

/** "Try also": the suggested pod in the same system, if it's in the catalogue and still made. */
export function tryAlso(pods: Pod[], pod: Pod): Pod | null {
  if (!pod.try_also) return null;
  return pods.find((p) => p.line === pod.line && p.name === pod.try_also && !p.discontinued) ?? null;
}

/**
 * When there's no editorial "try also", the nearest current capsule on the same row of the wall:
 * same system and cup size, closest intensity, sharing an aroma family where possible. Shown as
 * "Similar", not as a recommendation.
 */
export function similar(pods: Pod[], pod: Pod): Pod | null {
  const fam = new Set(aromaFamilies(pod));
  const pool = pods.filter((p) => p.id !== pod.id && p.line === pod.line && p.size === pod.size && p.ml === pod.ml && !p.discontinued && !!p.flavored === !!pod.flavored);
  const score = (p: Pod) => Math.abs((p.intensity ?? 0) - (pod.intensity ?? 0)) + (aromaFamilies(p).some((f) => fam.has(f)) ? 0 : 1.5);
  return pool.sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name))[0] ?? null;
}

/** A pod from a link: by slug, else by "line:name". */
export function podFromParam(pods: Pod[], v: string | null): Pod | null {
  if (!v) return null;
  return pods.find((p) => p.slug === v || p.id === v) ?? null;
}

/** Amazon search for this exact system and pod (a search, not a verified listing; the button says so). */
export function buySearch(p: Pod): string {
  const q = `Nespresso ${LINES[p.line].label} ${p.name} capsules`;
  return `https://www.amazon.com/s?k=${encodeURIComponent(q).replace(/%20/g, '+')}&tag=jayarrcoffee-20`;
}

export const blendText = (b: string) => (b === 'A' ? 'Arabica' : b === 'A/R' ? 'Arabica and robusta' : b === 'R/A' ? 'Robusta and arabica' : b);
