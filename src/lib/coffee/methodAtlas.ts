// Brewing Constellations: thirteen brewers described on separate physical axes.
//
// Contact (how water meets coffee), filter (what holds the grounds back), force (what moves the
// water) and contact time are independent: espresso is percolation under pump pressure, the
// AeroPress steeps and is then pushed by hand, a siphon steeps and is pulled down by a vacuum.
// Where the Brew Guide covers a method (the phin included), its numbers come from the engine
// (methods.ts), so the atlas and the guide can't disagree. The other three use the recipe in the
// site's own guide to that brewer, credited as such.
import { GUIDE_METHODS, PHIN } from './methods.ts';
import type { MethodId } from './types.ts';

export type AtlasId = 'v60' | 'chemex' | 'kalita' | 'drip-machine' | 'phin' | 'french-press' | 'clever' | 'cold-brew' | 'siphon' | 'turkish' | 'espresso' | 'moka' | 'aeropress';
export type Contact = 'percolation' | 'immersion' | 'steep-drain';
export type FilterKind = 'thick-paper' | 'paper' | 'cloth' | 'metal' | 'none';
export type Force = 'gravity' | 'none' | 'hand' | 'vapor' | 'steam' | 'pump';

export const CONTACT: Record<Contact, { label: string; line: string }> = {
  percolation: { label: 'Percolation', line: 'Water runs through a bed of coffee and out the bottom.' },
  'steep-drain': { label: 'Steep, then drain', line: 'Coffee steeps in all the water, then the brew is drained or pushed through the bed.' },
  immersion: { label: 'Immersion', line: 'Coffee steeps in all the water; the grounds are held back or settle at the end.' },
};

// Ordered from the clearest cup to the heaviest (synthesis §5: paper traps the most oil and fines).
export const FILTER: Record<FilterKind, { label: string; line: string; order: number }> = {
  'thick-paper': { label: 'Thick paper', line: 'Holds back the most oil and fine particles: the clearest, lightest-bodied cup.', order: 0 },
  paper: { label: 'Paper', line: 'Traps most oils and fines: a clear cup.', order: 1 },
  cloth: { label: 'Cloth', line: 'Lets some oil through: between paper and metal.', order: 2 },
  metal: { label: 'Metal', line: 'Lets oils and some fines through: more body, less clarity.', order: 3 },
  none: { label: 'No filter', line: 'The grounds stay in the pot and settle in the cup: the heaviest body.', order: 4 },
};

// Ordered by how hard the water is pushed.
export const FORCE: Record<Force, { label: string; line: string; order: number }> = {
  none: { label: 'None', line: 'Nothing pushes the water through the coffee: it steeps (or, for Turkish coffee, heats) with the grounds, which are then strained off or left to settle.', order: 0 },
  gravity: { label: 'Gravity', line: 'The water\'s own weight pulls it through the bed.', order: 1 },
  hand: { label: 'Hand pressure', line: 'You press a plunger to push the brew through the bed and filter.', order: 2 },
  vapor: { label: 'Vapor and vacuum', line: 'Heated vapor pushes the water up; as it cools, a vacuum pulls the brew back down.', order: 3 },
  steam: { label: 'Steam, about 1.5 bar', line: 'Steam in the sealed boiler pushes the water up through the coffee at about 1.5 bar.', order: 4 },
  pump: { label: 'Pump, about 9 bar', line: 'An electric pump pushes water through a tamped puck at around 9 bar.', order: 5 },
};

export interface AtlasMethod {
  id: AtlasId;
  label: string;
  /** How a sentence names it: "the V60", "espresso", "a drip machine". */
  the: string;
  /** One line for the star's label and the list. */
  line: string;
  contact: Contact;
  filter: FilterKind;
  force: Force;
  /** Water–coffee contact time in seconds, typical range. */
  timeS: [number, number];
  /** Water to coffee, by weight (espresso: drink out to coffee in). */
  ratio: { classic: number; range: [number, number]; yield?: boolean };
  grind: string;
  temp: string;
  /** How much attention it asks, 1–3: our judgment, labelled as such. */
  attention: 1 | 2 | 3;
  /** Where the numbers come from, in words. */
  recipeBy: string;
  /** The Brew Guide method that opens with this brewer, or null. */
  brewGuide: MethodId | null;
  /** The site's guide to this brewer. */
  guide: { slug: string; title: string };
  sourceIds: string[];
  /** A note on the time, where recipes vary a lot. */
  timeNote?: string;
  /** A concentrate, served diluted: how many times its water the served drink holds (cold brew: 2, diluted about 1:1). */
  servedFactor?: number;
  /** Said in place of a ratio range where the brewer sets the ratio itself (the moka pot). */
  ratioNote?: string;
  /** A note on the filter, where the brewer is sold or used with others too (review r4, Muse M2). */
  filterNote?: string;
  /** How a sentence says it brews, where "steeps" would be wrong (Turkish coffee is heated with the water). */
  brewVerb?: string;
}

const fromEngine = (id: MethodId) => {
  const m = GUIDE_METHODS.find((x) => x.id === id)!;
  return {
    ratio: { classic: m.ratio.classic, range: [m.ratio.stronger, m.ratio.lighter] as [number, number], ...(id === 'espresso' ? { yield: true } : {}) },
    grind: m.grindLabel,
    // The phin's range is set in °F (195–200), so its °C is rounded: 91–93.
    temp: id === 'cold-brew' ? 'Cold or room temperature' : id === 'moka' ? 'Just-boiled water in the base' : `${Math.round(m.tempC.min * 9 / 5 + 32)}–${Math.round(m.tempC.max * 9 / 5 + 32)}°F (${Math.round(m.tempC.min)}–${Math.round(m.tempC.max)}°C)`,
    timeS: [m.timeS.min, m.timeS.max] as [number, number],
    // The Guide's classic numbers are its own, adapted from the recipe it credits, not that recipe's exact ratio (review r7, Opus).
    recipeBy: m.base?.by ? `the Brew Guide's classic recipe (adapted from ${m.base.by})` : 'the Brew Guide\'s classic recipe',
    brewGuide: id,
  };
};

export const ATLAS: AtlasMethod[] = [
  {
    id: 'v60', label: 'V60', the: 'the V60', line: 'A 60° paper cone with one large hole: you control the flow with your pour.',
    contact: 'percolation', filter: 'paper', force: 'gravity', attention: 3,
    ...fromEngine('v60'),
    guide: { slug: 'ultimate-pour-over-coffee-guide-and-best-v60-technique', title: 'Pour over coffee guide: V60 technique' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'chemex', label: 'Chemex', the: 'the Chemex', line: 'An hourglass brewer with a thick folded paper: the clearest cup.',
    contact: 'percolation', filter: 'thick-paper', force: 'gravity', attention: 2,
    ...fromEngine('chemex'),
    guide: { slug: 'flat-bottom-vs-cone-pour-over', title: 'Flat-bottom vs cone pour-over (the Chemex among the cones)' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'kalita', label: 'Kalita Wave', the: 'the Kalita Wave', line: 'A flat-bottomed dripper with three small holes: the flat bed is forgiving.',
    contact: 'percolation', filter: 'paper', force: 'gravity', attention: 2,
    ...fromEngine('kalita'),
    guide: { slug: 'flat-bottom-vs-cone-pour-over', title: 'Flat-bottom vs cone pour-over' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'drip-machine', label: 'Drip machine', the: 'a drip machine', line: 'A machine heats the water and showers it over a filter basket.',
    contact: 'percolation', filter: 'paper', force: 'gravity', attention: 1,
    filterNote: 'paper is the usual; many machines also come with a reusable metal basket',
    ...fromEngine('drip-machine'),
    guide: { slug: 'batch-brew-drip-coffee-guide', title: 'Batch brew and drip coffee guide' },
    sourceIds: ['rao', 'synthesis'],
  },
  {
    id: 'phin', label: 'Phin', the: 'the phin', line: 'A small Vietnamese metal filter that drips slowly straight into the glass.',
    contact: 'percolation', filter: 'metal', force: 'gravity', attention: 2,
    // The Brew Guide's phin is Nguyen Coffee Supply's recipe, numbers and all (Wave F r1, B1): 1:8.45, fine, 195–200°F, the last drop around 5:00.
    ...fromEngine('phin'),
    recipeBy: `Nguyen Coffee Supply's phin recipe, as the Brew Guide makes it: ${PHIN.base!.doseG} g of coffee to 4 oz (${PHIN.base!.waterG} g) of water, 1:${PHIN.ratio.classic} (calculated), with the last drop around 5:00`,
    guide: { slug: 'vietnamese-phin-guide', title: 'Vietnamese phin guide' },
    sourceIds: ['nguyen-iced'],
  },
  {
    id: 'french-press', label: 'French press', the: 'the French press', line: 'Coffee steeps in all the water; a metal mesh holds the grounds back.',
    contact: 'immersion', filter: 'metal', force: 'none', attention: 1,
    ...fromEngine('french-press'),
    // Most press recipes steep about 4 minutes; the Brew Guide's is Easto's long 8-minute steep. The star
    // spans both so a comparison doesn't treat one recipe as the method's time (review r4, Muse M1).
    timeS: [240, 480],
    timeNote: '4 minutes is the common recipe; the Brew Guide\'s is the long 8-minute steep',
    guide: { slug: 'how-to-use-a-french-press-the-most-amazing-coffee-youve-ever-had', title: 'How to use a French press' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'cold-brew', label: 'Cold brew', the: 'cold brew', line: 'Coarse coffee steeps in cold water for half a day or more.',
    contact: 'immersion', filter: 'metal', force: 'none', attention: 1,
    filterNote: 'a metal mesh in the recipe drawn; paper and cloth work too',
    servedFactor: 2,
    ...fromEngine('cold-brew'),
    guide: { slug: 'cold-brew-concentrate-guide', title: 'Cold brew concentrate: ratio, steep time and dilution' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'turkish', label: 'Turkish coffee', the: 'Turkish coffee', line: 'Powder-fine coffee heated with water in a cezve and poured unfiltered.',
    contact: 'immersion', filter: 'none', force: 'none', attention: 2,
    // As the Turkish coffee guide gives it, from Türkiye's registered description (Wave F r1, B3): 1 g to
    // 10 ml, extra fine, cold water warmed to 190–198°F in 2½ to 3 minutes and taken off as the foam forms.
    brewVerb: 'heats the coffee in all the water until a foam forms',
    timeS: [150, 180], ratio: { classic: 10, range: [10, 10] }, grind: 'Extra fine (like flour)', temp: 'Cold water, heated to 190–198°F (88–92°C)',
    recipeBy: 'our Turkish coffee guide: 1 g of coffee to 10 ml of water, warmed to 190–198°F over 2½ to 3 minutes and taken off before it boils',
    brewGuide: null,
    guide: { slug: 'turkish-coffee-guide', title: 'Turkish coffee guide' },
    sourceIds: ['synthesis'],
  },
  {
    id: 'clever', label: 'Clever Dripper', the: 'the Clever Dripper', line: 'A cone with a valve: it steeps like a press, then drains through paper.',
    contact: 'steep-drain', filter: 'paper', force: 'gravity', attention: 1,
    // As the Clever Dripper guide's 2020 recipe gives it (Wave F r1, B3): 20 g to 300 g (1:15), medium to
    // coarse, water just off the boil (the box said 196–205°F), a 4-minute steep and a minute or so to drain.
    timeS: [300, 300], ratio: { classic: 15, range: [15, 15] }, grind: 'Medium to coarse', temp: '196–205°F (91–96°C)',
    timeNote: 'one recipe, our guide\'s: a 4-minute steep and about a minute to drain; many recipes steep for less',
    recipeBy: 'our Clever Dripper guide: 20 g of coffee and 300 g of water just off the boil, 4 minutes under the lid, then about a minute to drain',
    brewGuide: null,
    guide: { slug: 'the-clever-dripper-better-coffee-than-pour-over', title: 'The Clever Dripper' },
    sourceIds: ['synthesis'],
  },
  {
    id: 'siphon', label: 'Siphon', the: 'the siphon', line: 'Vapor pushes water up into the coffee; a vacuum pulls the brew back down.',
    contact: 'steep-drain', filter: 'cloth', force: 'vapor', attention: 3,
    filterNote: 'cloth in most siphons; paper and metal filters are made for them too',
    // As the siphon guide gives it, Jessica Easto's three-cup recipe (Wave F r1, B3): 22 g to 300 g (1:13.6,
    // calculated), medium-fine, coffee in at 202°F, heat off at 1:20 and drained by about 1:55.
    timeS: [115, 115], ratio: { classic: 13.6, range: [13.6, 13.6] }, grind: 'Medium-fine', temp: 'In the top chamber, 202°F (94°C)',
    recipeBy: 'our siphon guide, Jessica Easto\'s three-cup recipe: 22 g of coffee and 300 g of water (1:13.6, calculated), the coffee in at 202°F, the heat off at 1:20 and the brew drained by about 1:55',
    brewGuide: null,
    guide: { slug: 'how-to-use-a-siphon-coffee-maker', title: 'How to use a siphon coffee maker' },
    sourceIds: ['synthesis'],
  },
  {
    id: 'aeropress', label: 'AeroPress', the: 'the AeroPress', line: 'Coffee steeps in a chamber, then you press it through a paper disc.',
    contact: 'steep-drain', filter: 'paper', force: 'hand', attention: 2,
    ...fromEngine('aeropress'),
    timeNote: 'the Brew Guide\'s quick recipe; many AeroPress recipes steep 2 minutes or more',
    guide: { slug: 'why-and-how-you-should-use-an-aeropress', title: 'Why and how to use an AeroPress' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'moka', label: 'Moka pot', the: 'the moka pot', line: 'Steam pressure in the base pushes water up through the coffee.',
    contact: 'percolation', filter: 'metal', force: 'steam', attention: 2,
    ...fromEngine('moka'),
    ratioNote: 'the pot sets it',
    timeNote: 'time on the stove, from heat to sputter; the coffee itself flows for the last part of it',
    guide: { slug: 'moka-pot-brewing-guide', title: 'Moka pot brewing guide' },
    sourceIds: ['hoffmann', 'synthesis'],
  },
  {
    id: 'espresso', label: 'Espresso', the: 'espresso', line: 'A pump pushes hot water through a tamped puck in about half a minute.',
    contact: 'percolation', filter: 'metal', force: 'pump', attention: 3,
    ...fromEngine('espresso'),
    guide: { slug: 'how-to-dial-in-espresso', title: 'How to dial in espresso' },
    sourceIds: ['rao', 'synthesis'],
  },
];

export const atlasById = (id: string) => ATLAS.find((m) => m.id === id);

/** The Brew Guide link for a method, or null if the guide doesn't cover it. */
export function brewGuideHref(m: AtlasMethod): string | null {
  if (!m.brewGuide) return null;
  // Each brewer's own default in the Brew Guide (a size chip it offers), so the link opens a complete
  // recipe with its chip lit: an 18 g double shot, a 15 g moka basket, an 8 oz AeroPress cup, a 12 oz
  // V60 or Kalita, a 16 oz Chemex or French press, a 32 oz drip or cold-brew batch (review r2, Muse).
  if (m.brewGuide === 'espresso') return `/tools/brew-ratio/?method=espresso&dose=18`;
  if (m.brewGuide === 'moka') return `/tools/brew-ratio/?method=moka&dose=15`;
  // The phin's one size: Nguyen's 14 g in a 4 oz phin, as the phin article's callout opens it.
  if (m.brewGuide === 'phin') return `/tools/brew-ratio/?method=phin&dose=14`;
  const CUP: Record<string, number> = { aeropress: 236.6, v60: 354.9, kalita: 354.9, chemex: 473.2, 'french-press': 473.2, 'drip-machine': 946.4, 'cold-brew': 946.4 };
  return `/tools/brew-ratio/?method=${m.brewGuide}&cup=${CUP[m.brewGuide] ?? 354.9}`;
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
export function timeText(m: AtlasMethod): string {
  const [a, b] = m.timeS;
  if (a >= 3600) return a === b ? `${a / 3600} hours` : `${a / 3600}–${b / 3600} hours`;
  if (b < 60) return `${a}–${b} seconds`;
  if (a % 60 === 0 && b % 60 === 0) return a === b ? `${a / 60} minutes` : `${a / 60}–${b / 60} minutes`;
  return a === b ? mmss(a) : `${mmss(a)}–${mmss(b)}`;
}
export function ratioText(m: AtlasMethod): string {
  const r = (x: number) => String(Math.round(x * 100) / 100);
  if (m.ratio.yield) return `1:${r(m.ratio.classic)} out (1:${r(m.ratio.range[0])}–1:${r(m.ratio.range[1])})`;
  // As the Brew Guide's own table puts it (review r4, Opus M3).
  if (m.ratioNote) return `1:${r(m.ratio.classic)} (${m.ratioNote})`;
  const base = m.ratio.range[0] === m.ratio.range[1] ? `1:${r(m.ratio.classic)}` : `1:${r(m.ratio.classic)} (1:${r(m.ratio.range[0])}–1:${r(m.ratio.range[1])})`;
  // A concentrate's ratio isn't the cup's: said so wherever it shows (review r6, Opus).
  return m.servedFactor ? `${base} concentrate, diluted about 1:1 to serve` : base;
}

export type Axis = 'contact' | 'filter' | 'force' | 'time';

/** Every property two methods can differ on, in the order the comparison reads them. */
export function differences(a: AtlasMethod, b: AtlasMethod): Axis[] {
  const out: Axis[] = [];
  if (a.contact !== b.contact) out.push('contact');
  if (a.filter !== b.filter) out.push('filter');
  if (a.force !== b.force) out.push('force');
  // Time differs when the ranges don't overlap, or one typically runs at least half as long again as
  // the other (by the middle of each range), so 3–4 minutes against 4–8 counts and 3–4 against 3:30–4:30 doesn't.
  const apart = a.timeS[1] < b.timeS[0] || b.timeS[1] < a.timeS[0];
  if (apart || Math.max(midS(a), midS(b)) / Math.min(midS(a), midS(b)) >= 1.5) out.push('time');
  return out;
}
/** The middle of a brewer's time range (geometric, as the time axis is a log scale). */
const midS = (m: AtlasMethod) => Math.sqrt(m.timeS[0] * m.timeS[1]);

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const FORCE_PHRASE: Record<Force, string> = {
  none: '', gravity: 'by gravity', hand: 'by hand', vapor: 'by vapor, then a vacuum', steam: 'by steam (about 1.5 bar)', pump: 'by a pump (about 9 bar)',
};
const FORCE_DO: Record<Force, string> = {
  none: 'just steeps', gravity: 'lets gravity pull the water through', hand: 'presses the brew through by hand', vapor: 'moves the water with vapor and a vacuum', steam: 'pushes the water with steam (about 1.5 bar)', pump: 'pushes the water with a pump (about 9 bar)',
};
const FILTER_PHRASE: Record<FilterKind, string> = {
  'thick-paper': 'thick paper', paper: 'paper', cloth: 'cloth', metal: 'metal', none: 'nothing',
};

/** One sentence per method, built only from its axes. */
export function describe(m: AtlasMethod): string {
  const t = timeText(m);
  if (m.contact === 'percolation') return `${cap(m.the)} sends water through a bed of coffee ${FORCE_PHRASE[m.force]} and out through ${FILTER_PHRASE[m.filter]}, in about ${t}.`;
  if (m.force === 'vapor') return `In ${m.the}, vapor pushes the water up into the coffee to steep, then a vacuum pulls the brew back down through ${FILTER_PHRASE[m.filter]}, in about ${t}.`;
  if (m.contact === 'steep-drain') {
    const out = m.force === 'hand' ? 'you press the brew through the bed and out through' : m.force === 'vapor' ? 'vapor pushes the water up into the coffee and a vacuum pulls the brew back down through' : 'the brew drains through the bed and out through';
    return `${cap(m.the)} steeps the coffee, then ${out} ${FILTER_PHRASE[m.filter]}, in about ${t}.`;
  }
  if (m.brewVerb) return `${cap(m.the)} ${m.brewVerb} over about ${t} and is poured unfiltered; the grounds settle in the cup.`;
  return m.filter === 'none'
    ? `${cap(m.the)} steeps the coffee in all the water for about ${t} and is poured unfiltered; the grounds settle in the cup.`
    : `${cap(m.the)} steeps the coffee in all the water for about ${t}, then ${FILTER_PHRASE[m.filter]} holds the grounds back.`;
}

/** The headline difference for a comparison: at most two clauses, the rest is in the table. */
/** Ratio and grind aren't axes, but they're rows a reader compares. The ratio differs when one brewer
 *  uses at least a third more coffee for its water, or only one is measured as drink out (espresso); the
 *  grind when the grinds differ (review r5, Muse and Opus). */
const baseGrind = (m: AtlasMethod) => m.grind.split(' (')[0];
// The table compares the brewing ratios it shows, as its note says; a concentrate's is labelled as one
// where it shows, so cold brew's 1:6.25 is highlighted against a V60's 1:16 (review r7, Astra).
const served = (m: AtlasMethod) => m.ratio.classic * (m.servedFactor ?? 1);
export function recipeDiffers(a: AtlasMethod, b: AtlasMethod): { ratio: boolean; grind: boolean } {
  const ratio = !!a.ratio.yield !== !!b.ratio.yield || Math.max(a.ratio.classic, b.ratio.classic) / Math.min(a.ratio.classic, b.ratio.classic) >= 4 / 3;
  return { ratio, grind: baseGrind(a) !== baseGrind(b) };
}
export function differenceSentence(a: AtlasMethod, b: AtlasMethod): string {
  const d = differences(a, b);
  // Same axes: the grind each recipe uses can still differ, so say so (review r4, Opus M2).
  const grind = a.grind !== b.grind ? `, and in the grind each recipe uses (${a.grind.toLowerCase()} and ${b.grind.toLowerCase()})` : '';
  if (!d.length) return `${cap(a.the)} and ${b.the} work the same way on contact, filter and force, and ${timeText(a) === timeText(b) ? `take the same time (${timeText(a)})` : `their times overlap (${timeText(a)} and ${timeText(b)})`}; they differ in the brewer's shape and how fast it drains${grind}.`;
  const parts: string[] = [];
  if (d.includes('contact')) {
    const verb = (m: AtlasMethod) => m.contact === 'percolation' ? 'runs water through the coffee'
      : m.contact === 'immersion' ? m.brewVerb ?? 'steeps the coffee in all the water'
      : m.force === 'hand' ? 'steeps the coffee, then presses the brew through it'
      : m.force === 'vapor' ? 'steeps the coffee, then pulls the brew back down through a filter'
      : 'steeps the coffee, then drains the brew through it';
    parts.push(`${a.the} ${verb(a)}; ${b.the} ${verb(b)}`);
  } else if (d.includes('force')) {
    parts.push(`${a.the} ${FORCE_DO[a.force]}; ${b.the} ${FORCE_DO[b.force]}`);
  }
  if (d.includes('filter')) {
    const [clear, full] = FILTER[a.filter].order <= FILTER[b.filter].order ? [a, b] : [b, a];
    parts.push(full.filter === 'none' ? `only ${clear.the} is filtered` : `${clear.the}'s ${FILTER_PHRASE[clear.filter]} gives the clearer cup`);
  }
  let timePart: string | null = null;
  if (d.includes('time')) {
    const [fast, slow] = a.timeS[1] <= b.timeS[1] ? [a, b] : [b, a];
    timePart = `${fast.the} takes ${timeText(fast)}, ${slow.the} ${timeText(slow)}`;
  }
  // A large ratio difference is often the one a reader notices most (phin against V60): say it when
  // there's room, for brewers measured the same way (review r5, Muse).
  const [strong, weak] = served(a) <= served(b) ? [a, b] : [b, a];
  const times = served(weak) / served(strong);
  let ratioPart: string | null = null;
  if (!a.ratio.yield && !b.ratio.yield && !a.servedFactor && !b.servedFactor && times >= 1.5) {
    const r = (x: number) => String(Math.round(x * 100) / 100);
    ratioPart = `${strong.the} uses about ${times >= 1.85 && times < 2.15 ? 'twice' : `${times.toFixed(1)} times`} the coffee for its water (1:${r(strong.ratio.classic)} against 1:${r(weak.ratio.classic)})`;
  }
  // Room for only one: say the bigger of the two, as a multiple. The phin's 5 minutes against a V60's
  // 3–4 is about 1.4 times; its coffee is about twice (Wave F r1). The table marks both rows either way.
  const timeTimes = Math.max(midS(a), midS(b)) / Math.min(midS(a), midS(b));
  if (timePart && ratioPart && parts.length === 1) parts.push(times > timeTimes ? ratioPart : timePart);
  else for (const p of [timePart, ratioPart]) if (p && parts.length < 2) parts.push(p);
  if (parts.length === 1 && d.includes('force') && d.includes('contact')) {
    const pushed = [a, b].filter((m) => m.force === 'hand' || m.force === 'steam' || m.force === 'pump' || m.force === 'vapor');
    if (pushed.length === 1) parts.push(`only ${pushed[0].the} ${FORCE_DO[pushed[0].force]}`);
    else if (pushed.length === 2) parts.push(`${a.the} ${FORCE_DO[a.force]} while ${b.the} ${FORCE_DO[b.force]}`);
  }
  return cap(parts.slice(0, 2).join(', and ')) + '.';
}

/** Where a star sits on the time axis: 0 at 15 seconds, 1 at 24 hours, log scale. */
export function timePosition(s: number): number {
  const lo = Math.log(15), hi = Math.log(24 * 3600);
  return Math.max(0, Math.min(1, (Math.log(s) - lo) / (hi - lo)));
}
export const TIME_TICKS: { s: number; label: string }[] = [
  { s: 30, label: '30 s' }, { s: 180, label: '3 min' }, { s: 600, label: '10 min' }, { s: 3600, label: '1 h' }, { s: 43200, label: '12 h' },
];
