// Region marks on the simplified map. The borders are Natural Earth's 110 m outlines, coarse enough
// that a growing region a few kilometres from a border can fall inside the neighbour's outline
// (Kayanza in Burundi, Renacimiento in Panama). The stored coordinates stay as sourced; the mark is
// drawn at the nearest point inside its own country's outline (review r3, Astra).
import { countryPaths } from '../../data/mapPaths.ts';
import { project } from './origins.ts';

type Ring = [number, number][];
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

/** Where to draw a region of `countryId`: its projected point, or the nearest point at least
 *  `margin` map units inside the country's outline when the coarse border puts it outside. */
export function regionPoint(countryId: string, lat: number, lon: number, margin = 0.4): [number, number] {
  const [x, y] = project(lat, lon);
  if (!rings(countryId).length || inside(countryId, x, y)) return [x, y];
  for (let r = 0.2; r <= 8; r += 0.2) {
    for (let a = 0; a < 360; a += 10) {
      const dx = Math.cos((a * Math.PI) / 180), dy = Math.sin((a * Math.PI) / 180);
      if (inside(countryId, x + dx * r, y + dy * r) && inside(countryId, x + dx * (r + margin), y + dy * (r + margin))) return [x + dx * (r + margin), y + dy * (r + margin)];
    }
  }
  return [x, y];
}
