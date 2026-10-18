// Origins atlas: where coffee grows, when it's harvested, how high, and how its coffees are
// usually described. Facts live in src/data/origins-atlas.json, researched and sourced by Astra
// (makeover-2026-10/research/ORIGINS_ATLAS.md); this module adds the site's own layer: names,
// map positions, the country pages that exist, and our articles.
import data from '../../data/origins-atlas.json' with { type: 'json' };
import sourcesData from '../../data/origins-sources.json' with { type: 'json' };

export type Continent = 'africa' | 'americas' | 'asia-pacific';
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Band { min: number; max: number; species?: string; scope?: string; upperBoundOpen?: boolean; sources?: string[] }
export interface OriginFacts {
  id: string;
  harvest: {
    main: [number, number] | null;
    second: [number, number] | null;
    variesBy: string | null;
    edgeMonths: number;
    sources: string[];
    /** Other calendars that give a different window, named in variesBy (the drawn window is from `sources`). */
    compare?: string[];
    scope?: string | null;
    /** Set where a source says picking goes on outside the drawn window (another region's calendar). */
    elsewhere?: string | null;
  };
  altitudeM: Band | null;
  robustaAltitudeM?: Band | null;
  production: { bags60kg: number; season: string; kind: string; arabicaShare?: number | null; source: string; scope?: string } | null;
  regions: { name: string; lat: number | null; lon: number | null }[];
  varieties: string[];
  processing: string[];
  tendencies: { notes: string[]; source: string; caveat?: string | null };
  sources?: { varieties: string[]; processing: string[]; regions: string[] };
  status?: string;
  gaps?: string[];
}

export interface OriginMeta {
  id: string;
  name: string;
  continent: Continent;
  /** Where the marker sits: the main growing area, not the country's centre. */
  lat: number;
  lon: number;
  /** The country page, where one exists (the 19 kept URLs). */
  page?: string;
  articles: { slug: string; title: string }[];
}

export type Origin = OriginMeta & OriginFacts;

const a = (slug: string, title: string) => ({ slug, title });

// The 19 country pages keep their indexed URLs, underscores included.
const META: OriginMeta[] = [
  { id: 'ethiopia', name: 'Ethiopia', continent: 'africa', lat: 6.8, lon: 38.4, page: '/explore/origins/ethiopia/', articles: [a('ethiopian-coffee-flavors-and-varieties', 'Ethiopian coffee: flavors, varieties and regions'), a('ethiopian-heirloom-vs-named-varietals', 'Ethiopian heirloom vs named varieties'), a('7-ethiopian-coffees-reviewed-best-and-worst', 'Seven Ethiopian coffees reviewed'), a('ethiopian-coffee-ceremony-explained', 'The Ethiopian coffee ceremony')] },
  { id: 'kenya', name: 'Kenya', continent: 'africa', lat: -0.4, lon: 37.0, page: '/explore/origins/kenya/', articles: [a('kenyan-coffee-flavor-notes-and-best-coffees', 'Kenyan coffee: flavor notes and the best beans')] },
  { id: 'uganda', name: 'Uganda', continent: 'africa', lat: 1.0, lon: 32.6, articles: [] },
  { id: 'rwanda', name: 'Rwanda', continent: 'africa', lat: -2.0, lon: 29.8, page: '/explore/origins/rwanda/', articles: [a('rwandan-coffee-a-story-of-rebuilding', 'Rwandan coffee: a story of rebuilding')] },
  { id: 'burundi', name: 'Burundi', continent: 'africa', lat: -3.3, lon: 29.9, page: '/explore/origins/burundi/', articles: [] },
  { id: 'tanzania', name: 'Tanzania', continent: 'africa', lat: -4.5, lon: 36.0, page: '/explore/origins/tanzania/', articles: [a('stone-street-tanzania-peaberry-grind-and-brew', 'Stone Street Tanzania peaberry review')] },
  { id: 'malawi', name: 'Malawi', continent: 'africa', lat: -11.4, lon: 33.9, articles: [a('malawi-coffee-africas-hidden-gem', 'Malawi coffee: Africa\'s hidden gem')] },
  { id: 'yemen', name: 'Yemen', continent: 'africa', lat: 15.3, lon: 43.9, articles: [a('yemen-coffee-guide-mocha-origin', 'Yemeni coffee and the port of Mocha')] },
  { id: 'brazil', name: 'Brazil', continent: 'americas', lat: -19.8, lon: -45.4, page: '/explore/origins/brazil/', articles: [a('is-brazilian-coffee-any-good', 'Is Brazilian coffee any good?'), a('brazilian-coffee-kingdom-history', 'Brazil\'s coffee kingdom: a history')] },
  { id: 'colombia', name: 'Colombia', continent: 'americas', lat: 4.6, lon: -75.6, page: '/explore/origins/colombia/', articles: [a('single-origin-colombian-coffee-what-flavor-notes-to-expect', 'Colombian coffee: what flavor notes to expect'), a('6-colombian-coffees-reviewed-best-and-worst', 'Six Colombian coffees reviewed'), a('juan-valdez-fnc-colombia-history', 'Juan Valdez and the FNC')] },
  { id: 'ecuador', name: 'Ecuador', continent: 'americas', lat: -1.6, lon: -78.6, page: '/explore/origins/ecuador/', articles: [] },
  { id: 'peru', name: 'Peru', continent: 'americas', lat: -6.6, lon: -77.9, page: '/explore/origins/peru/', articles: [a('peru-coffee-guide-chanchamayo', 'Peruvian coffee: Chanchamayo and beyond')] },
  { id: 'bolivia', name: 'Bolivia', continent: 'americas', lat: -16.0, lon: -67.6, page: '/explore/origins/bolivia/', articles: [a('bolivia-coffee-rare-hidden-gem', 'Bolivian coffee: a rare hidden gem')] },
  { id: 'guatemala', name: 'Guatemala', continent: 'americas', lat: 15.0, lon: -90.9, page: '/explore/origins/guatemala/', articles: [a('guatemala-coffee-review-regional-differences-and-best-coffees', 'Guatemalan coffee by region')] },
  { id: 'honduras', name: 'Honduras', continent: 'americas', lat: 14.4, lon: -87.7, page: '/explore/origins/honduras/', articles: [a('honduras-coffee-guide-marcala-comayagua', 'Honduran coffee: Marcala and Comayagua')] },
  { id: 'el-salvador', name: 'El Salvador', continent: 'americas', lat: 13.8, lon: -89.3, page: '/explore/origins/el_salvador/', articles: [a('el-salvador-coffee-guide-pacamara', 'El Salvador and the Pacamara')] },
  { id: 'nicaragua', name: 'Nicaragua', continent: 'americas', lat: 13.1, lon: -85.9, page: '/explore/origins/nicaragua/', articles: [a('is-nicaraguan-coffee-any-good', 'Is Nicaraguan coffee any good?')] },
  { id: 'costa-rica', name: 'Costa Rica', continent: 'americas', lat: 10.0, lon: -84.1, page: '/explore/origins/costa_rica/', articles: [a('what-does-costa-rican-coffee-taste-like', 'What Costa Rican coffee tastes like'), a('honey-process-colors-explained', 'Honey process colours explained')] },
  { id: 'panama', name: 'Panama', continent: 'americas', lat: 8.8, lon: -82.4, page: '/explore/origins/panama/', articles: [a('panama-coffee-guide-geisha-boquete', 'Panama, Boquete and Geisha'), a('gesha-coffee-worth-the-price', 'Is Gesha coffee worth the price?')] },
  { id: 'mexico', name: 'Mexico', continent: 'americas', lat: 16.6, lon: -93.6, page: '/explore/origins/mexico/', articles: [a('whats-the-flavor-of-mexican-coffee', 'What Mexican coffee tastes like')] },
  { id: 'cuba', name: 'Cuba', continent: 'americas', lat: 20.1, lon: -76.4, articles: [a('what-is-cuban-coffee', 'What is Cuban coffee?')] },
  { id: 'jamaica', name: 'Jamaica', continent: 'americas', lat: 18.08, lon: -76.6, articles: [] },
  { id: 'hawaii', name: 'Hawaii', continent: 'americas', lat: 19.4, lon: -155.8, articles: [a('ka-u-hawaii-specialty-coffee-region', 'Ka\'ū, Hawaii\'s other coffee region')] },
  { id: 'india', name: 'India', continent: 'asia-pacific', lat: 12.9, lon: 75.8, articles: [a('what-is-coffee-from-india-like', 'What coffee from India is like')] },
  { id: 'myanmar', name: 'Myanmar', continent: 'asia-pacific', lat: 21.0, lon: 96.9, articles: [a('myanmar-coffee-shan-state', 'Myanmar coffee: Shan State')] },
  { id: 'thailand', name: 'Thailand', continent: 'asia-pacific', lat: 19.6, lon: 99.6, page: '/explore/origins/thailand/', articles: [] },
  { id: 'china', name: 'China (Yunnan)', continent: 'asia-pacific', lat: 22.8, lon: 100.9, articles: [a('china-yunnan-coffee-emerging-origin', 'Yunnan: China\'s coffee origin')] },
  { id: 'vietnam', name: 'Vietnam', continent: 'asia-pacific', lat: 12.7, lon: 108.1, articles: [a('vietnam-coffee-origin-guide', 'Vietnam: how one country changed coffee'), a('vietnamese-phin-guide', 'Vietnamese phin guide')] },
  { id: 'indonesia', name: 'Indonesia', continent: 'asia-pacific', lat: -1.0, lon: 102.0, page: '/explore/origins/indonesia/', articles: [a('what-does-indonesian-coffee-taste-like', 'What Indonesian coffee tastes like'), a('7-sumatra-coffees-reviewed-best-and-worst', 'Seven Sumatran coffees reviewed')] },
  { id: 'papua-new-guinea', name: 'Papua New Guinea', continent: 'asia-pacific', lat: -6.1, lon: 145.3, articles: [a('papua-new-guinea-makes-excellent-coffee', 'Papua New Guinea: sweet, fruity and underrated')] },
];

export const CONTINENTS: { id: Continent; label: string }[] = [
  { id: 'americas', label: 'Americas' },
  { id: 'africa', label: 'Africa & Yemen' },
  { id: 'asia-pacific', label: 'Asia & Pacific' },
];

const FACTS = new Map((data.origins as OriginFacts[]).map((f) => [f.id, f]));
export const DATA_STATUS: string = (data as { status?: string }).status ?? 'final';

const EMPTY: Omit<OriginFacts, 'id'> = { harvest: { main: null, second: null, variesBy: null, edgeMonths: 1, sources: [] }, altitudeM: null, robustaAltitudeM: null, production: null, regions: [], varieties: [], processing: [], tendencies: { notes: [], source: '' } };

/** Every origin with its facts; an origin the research couldn't support shows its gaps, not guesses. */
// Where a calendar is one region's but the sources say coffee is picked elsewhere in the country
// outside it, the months outside read "picking elsewhere", not "outside its harvest" (review r2, B1).
const ELSEWHERE: Record<string, string> = {
  colombia: 'southern districts reverse the seasons, so coffee is picked somewhere in Colombia all year (Sucafina, Café Imports)',
  indonesia: "other islands keep their own calendars and Sumatra has a year-round fly crop (Sucafina)",
};
export const ORIGINS: Origin[] = META.map((m) => {
  const o = { ...EMPTY, ...(FACTS.get(m.id) ?? { id: m.id }), ...m } as Origin;
  return ELSEWHERE[o.id] ? { ...o, harvest: { ...o.harvest, elsewhere: ELSEWHERE[o.id] } } : o;
}).sort((x, y) => x.name.localeCompare(y.name));
export const originById = (id: string) => ORIGINS.find((o) => o.id === id);
export const originByPage = (slug: string) => ORIGINS.find((o) => o.page === `/explore/origins/${slug}/`);

// ── Months ────────────────────────────────────────────────────────────────────────────────────
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The months in a window, wrapping across the new year: [10, 2] is Oct, Nov, Dec, Jan, Feb. */
export function monthsIn(w: [number, number] | null): number[] {
  if (!w) return [];
  const out: number[] = [];
  for (let m = w[0], i = 0; i < 12; i++, m = (m % 12) + 1) { out.push(m); if (m === w[1]) break; }
  return out;
}
export type HarvestState = 'main' | 'second' | 'edge' | 'elsewhere' | 'off';
/** Where a month sits for an origin: in the main harvest, the secondary one, an uncertain edge, or off. */
export function harvestState(o: Pick<OriginFacts, 'harvest'>, month: number): HarvestState {
  if (monthsIn(o.harvest.main).includes(month)) return 'main';
  if (monthsIn(o.harvest.second).includes(month)) return 'second';
  // Where sources say another region is picking outside the drawn window, that beats a "maybe" edge.
  if (o.harvest.elsewhere) return 'elsewhere';
  const e = o.harvest.edgeMonths;
  if (e > 0) {
    for (const w of [o.harvest.main, o.harvest.second]) {
      if (!w) continue;
      for (let d = 1; d <= e; d++) {
        if (((w[0] - 1 - d + 24) % 12) + 1 === month || ((w[1] - 1 + d) % 12) + 1 === month) return 'edge';
      }
    }
  }
  return 'off';
}
export const windowText = (w: [number, number] | null) => (w ? (w[0] === w[1] ? MONTHS_LONG[w[0] - 1] : `${MONTHS[w[0] - 1]}–${MONTHS[w[1] - 1]}`) : '');

// A drawn calendar that is one region's or one species' says so wherever it is summarised.
const CALENDAR_TAGS: Record<string, string> = {
  Robusta: 'robusta', 'Robusta regional seasons': 'robusta', 'Huila illustrative calendar': 'Huila',
  'arabica from Sumatra': 'Sumatran arabica', 'arabica, south and north together': 'arabica',
  'northern arabica, Chiang Rai and Chiang Mai together': 'northern arabica', 'Central Kenya': 'Central Kenya',
};
export const calendarTag = (o: Pick<OriginFacts, 'harvest'>): string | null => (o.harvest.scope && CALENDAR_TAGS[o.harvest.scope]) || null;
export function harvestText(o: Origin): string {
  if (!o.harvest.main) return 'Not established';
  if (monthsIn(o.harvest.main).length === 12) return 'All year, depending on region';
  const w = o.harvest.second ? `${windowText(o.harvest.main)}, and ${windowText(o.harvest.second)}` : windowText(o.harvest.main);
  const tag = calendarTag(o);
  return tag ? `${w} (${tag})` : w;
}
/** Origins picking somewhere outside their drawn calendar this month (see ELSEWHERE). */
export const pickingElsewhereIn = (month: number) => ORIGINS.filter((o) => harvestState(o, month) === 'elsewhere');

/** Origins harvesting in a given month (main or secondary crop). */
export const harvestingIn = (month: number) => ORIGINS.filter((o) => { const s = harvestState(o, month); return s === 'main' || s === 'second'; });

export const fmtBags = (n: number) => n >= 1e6 ? `${(Math.round(n / 1e5) / 10).toLocaleString('en-US')} million` : `${Math.round(n / 1000).toLocaleString('en-US')},000`;
export const fmtM = (m: number) => `${m.toLocaleString('en-US')} m`;
export const mToFt = (m: number) => Math.round(m * 3.28084 / 10) * 10;

/** Importers list harvest and arrival separately; these are their examples (Café Imports, Nilaa), not a formula. */
export const ARRIVAL_EXAMPLES: { origin: string; harvest: string; arrival: string; source: string }[] = [
  { origin: 'Ethiopia', harvest: 'October–January', arrival: 'April–June', source: 'ci-ethiopia' },
  { origin: 'Rwanda', harvest: 'March–June', arrival: 'September–December', source: 'ci-rwanda' },
  { origin: 'Hawaii', harvest: 'August–December', arrival: 'December–March', source: 'ci-hawaii' },
];

export const bandText = (b: Band) => `${b.min.toLocaleString('en-US')}–${b.max.toLocaleString('en-US')}${b.upperBoundOpen ? '+' : ''} m (${mToFt(b.min).toLocaleString('en-US')}–${mToFt(b.max).toLocaleString('en-US')}${b.upperBoundOpen ? '+' : ''} ft)`;
export function productionText(o: Origin): string | null {
  const p = o.production;
  if (!p) return null;
  return `${fmtBags(p.bags60kg)} 60 kg bags (${p.season} ${p.kind})`;
}
// Who a figure comes from, in a few words: the publisher before the catalogue's " — ", with plain
// names for the few long titles. Calendars here are importers' (Café Imports, Sucafina…), and other
// references can differ by a month or more, so every figure names its source.
const SOURCE_NAMES: Record<string, string> = {
  'sucafina-handbook-2026': 'Sucafina', 'cabi-coffee-ch2': 'CAB International', 'nass-may2026': 'USDA NASS',
  'usda-psd-2026-07': 'USDA FAS', 'ctahr-coffee-2008': 'University of Hawaiʻi CTAHR', 'shade-indonesia': 'ShadeCoffee',
  'thai-moac': "Thailand's Ministry of Agriculture", 'ip-vietnam-lamdong': "Vietnam's IP Office (Lâm Đồng GI)",
  'tcb-manual-2023': 'Tanzania Coffee Board', 'hamdan-yemen': 'Hamdan Coffee', 'movaci-thailand': 'Movaci', 'iniap-robusta-2017': 'INIAP',
  'coffee-board-india': 'Coffee Board of India', 'moka-cuba': 'Moka Trade', 'mzuzu': 'Mzuzu Coffee', 'shac-regions': 'Hawaii coffee growers',
};
export function sourceNames(ids: string[] | undefined): string {
  const all = sourcesData as Record<string, { title: string }>;
  const names = [...new Set((ids ?? []).map((id) => SOURCE_NAMES[id] ?? all[id]?.title.split(' — ')[0]).filter((x): x is string => !!x))];
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0] ?? '';
}
/** Where and when a production figure was published. */
export function productionSource(o: Origin): string | null {
  if (!o.production) return null;
  return o.production.source === 'nass-may2026' ? 'USDA NASS estimate, published May 2026' : 'USDA Foreign Agricultural Service forecast, published July 2026';
}
export function rankOf(o: Origin): number | null {
  if (!o.production) return null;
  return ORIGINS.filter((x) => x.production && x.production.bags60kg > o.production!.bags60kg).length + 1;
}

// ── Map ───────────────────────────────────────────────────────────────────────────────────────
// mapPaths.ts is Mercator on a 1000 × 367 box from 55° N to 55° S; the same projection places markers.
const mercN = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const N55 = mercN(55);
export const project = (lat: number, lon: number): [number, number] => [((lon + 180) / 360) * 1000, ((N55 - mercN(lat)) / (2 * N55)) * 367];
