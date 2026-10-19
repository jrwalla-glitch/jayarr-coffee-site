// Region marks on the simplified map. The borders are Natural Earth's 110 m outlines, coarse enough
// that a growing region a few kilometres from a border can fall inside the neighbour's outline
// (Kayanza in Burundi, Renacimiento in Panama). The stored coordinates stay as sourced; the mark is
// drawn at the nearest point where it sits whole inside its own country's outline (reviews r3, r4, Astra).
import { countryPaths } from '../../data/mapPaths.ts';
import { project } from './origins.ts';

type Ring = [number, number][];

/**
 * The same outline written compactly for the page: each ring starts with an absolute moveto and then
 * gives every point as a relative step ("l-1 .1-1.2-2"), so "L628.2,66.7" becomes "-1 .1". The points are
 * the stored ones exactly: both ends of a step are on the 0.1 grid, so each step is rounded to 0.1 to
 * drop floating-point noise and nothing moves. Cuts the Origins map's path text roughly in half (Wave F r1, B7).
 */
export function compactPath(path: string): string {
  // One pass over the characters, in whole tenths (the stored points are on the 0.1 grid), so the island's
  // first render doesn't pay for regular expressions over 9,600 points (it showed as ~20 ms of blocking time).
  const tenths = (t: number) => { const a = t < 0 ? -t : t, s = a % 10 ? `${(a - (a % 10)) / 10}.${a % 10}` : String(a / 10); return (t < 0 ? '-' : '') + (s.startsWith('0.') ? s.slice(1) : s); };
  let out = '', i = 0, px = 0, py = 0, first = true, nums = 0;
  const n = path.length;
  const read = (): number => { // the number at i, in tenths
    let neg = false, ip = 0, fp = 0, fd = 0;
    if (path.charCodeAt(i) === 45) { neg = true; i++; }
    while (i < n) { const c = path.charCodeAt(i); if (c < 48 || c > 57) break; ip = ip * 10 + (c - 48); i++; }
    if (path.charCodeAt(i) === 46) { i++; while (i < n) { const c = path.charCodeAt(i); if (c < 48 || c > 57) break; if (fd < 2) { fp = fp * 10 + (c - 48); fd++; } i++; } }
    const v = ip * 10 + (fd === 0 ? 0 : fd === 1 ? fp : Math.round(fp / 10));
    return neg ? -v : v;
  };
  const put = (v: number) => { const s = tenths(v); out += nums === 0 || s.startsWith('-') ? s : ` ${s}`; nums++; };
  while (i < n) {
    const c = path[i];
    if (c === 'M') { i++; const x = read(); i++; const y = read(); px = x; py = y; out += 'M'; nums = 0; put(x); put(y); first = true; continue; }
    if (c === 'L') { i++; const x = read(); i++; const y = read(); if (first) { out += 'l'; nums = 0; first = false; } put(x - px); put(y - py); px = x; py = y; continue; }
    if (c === 'Z' || c === 'z') { out += 'z'; i++; continue; }
    i++;
  }
  return out;
}

const parse = (path: string): Ring[] => path.split('M').filter(Boolean).map((sp) => [...sp.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])] as [number, number]));
const cache = new Map<string, Ring[]>();
function rings(id: string): Ring[] {
  if (!cache.has(id)) cache.set(id, parse(countryPaths.find((c) => c.id === id)?.path ?? ''));
  return cache.get(id)!;
}
export function inRing(x: number, y: number, ps: Ring): boolean {
  let c = false;
  for (let i = 0, j = ps.length - 1; i < ps.length; j = i++) {
    const [xi, yi] = ps[i], [xj, yj] = ps[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const inside = (id: string, x: number, y: number) => rings(id).some((ps) => inRing(x, y, ps));

// A mark fits where its whole diamond (half-diagonal `m`) lies inside: the centre, the four tips and
// points along each edge, so a diamond near a coast or lake doesn't overhang (review r4, Astra).
const EDGE = [0, 0.25, 0.5, 0.75];
function fits(id: string, x: number, y: number, m: number): boolean {
  if (!inside(id, x, y)) return false;
  const tips: [number, number][] = [[m, 0], [0, m], [-m, 0], [0, -m]];
  return tips.every(([ax, ay], i) => {
    const [bx, by] = tips[(i + 1) % 4];
    return EDGE.every((t) => inside(id, x + ax + (bx - ax) * t, y + ay + (by - ay) * t));
  });
}
const placed = new Map<string, [number, number]>();

/** Where to draw a region of `countryId`: its projected point when a diamond of half-diagonal
 *  `margin` (map units) fits there whole, else the nearest point where it does. Where the country
 *  is too thin for the whole mark, the nearest point inside it. */
export function regionPoint(countryId: string, lat: number, lon: number, margin = 0.4): [number, number] {
  const key = `${countryId}|${lat}|${lon}|${margin.toFixed(3)}`;
  const hit = placed.get(key);
  if (hit) return hit;
  const [x, y] = project(lat, lon);
  let out: [number, number] = [x, y];
  if (rings(countryId).length && !fits(countryId, x, y, margin)) {
    const step = Math.max(0.02, margin / 3);
    out = search(x, y, step, (px, py) => fits(countryId, px, py, margin)) ?? search(x, y, step, (px, py) => inside(countryId, px, py)) ?? [x, y];
  }
  placed.set(key, out);
  return out;
}
function search(x: number, y: number, step: number, ok: (x: number, y: number) => boolean): [number, number] | null {
  for (let r = step; r <= 10; r += step) {
    for (let a = 0; a < 360; a += 10) {
      const px = x + Math.cos((a * Math.PI) / 180) * r, py = y + Math.sin((a * Math.PI) / 180) * r;
      if (ok(px, py)) return [px, py];
    }
  }
  return null;
}
