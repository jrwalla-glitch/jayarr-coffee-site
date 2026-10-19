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
  const num = (v: number) => { const s = String(Math.round(v * 10) / 10); return s.replace(/^(-?)0\./, '$1.'); };
  const join = (vals: number[]) => vals.map(num).reduce((out, s, i) => (i === 0 || s.startsWith('-') ? out + s : `${out} ${s}`), '');
  let out = '', px = 0, py = 0;
  for (const seg of path.split('M').filter(Boolean)) {
    const pts = [...seg.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])]);
    if (!pts.length) continue;
    [px, py] = pts[0];
    const steps: number[] = [];
    for (const [x, y] of pts.slice(1)) { steps.push(x - px, y - py); px = x; py = y; }
    out += `M${join(pts[0])}${steps.length ? `l${join(steps)}` : ''}${/Z\s*$/i.test(seg) ? 'z' : ''}`;
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
