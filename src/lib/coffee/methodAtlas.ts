// Brewing Constellations: thirteen brewers described on separate physical axes.
//
// Contact (how water meets coffee), filter (what holds the grounds back), force (what moves the
// water) and contact time are independent: espresso is percolation under pump pressure, the
// AeroPress steeps and is then pushed by hand, a siphon steeps and is pulled down by a vacuum.
// Where the Brew Guide covers a method, its numbers come from the engine (methods.ts), so the
// atlas and the guide can't disagree. The other four use the recipe in the site's own guide to
// that brewer, credited as such.
import { METHODS } from './methods.ts';
import type { MethodId } from './types.ts';

export type AtlasId = 'v60' | 'chemex' | 'kalita' | 'drip-machine' | 'phin' | 'french-press' | 'clever' | 'cold-brew' | 'siphon' | 'turkish' | 'espresso' | 'moka' | 'aeropress';
export type Contact = 'percolation' | 'immersion' | 'steep-drain';
export type FilterKind = 'thick-paper' | 'paper' | 'cloth' | 'metal' | 'none';
export type Force = 'gravity' | 'none' | 'hand' | 'vapour' | 'steam' | 'pump';

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
  none: { label: 'None: it steeps', line: 'Nothing pushes the water through the coffee: it steeps, then the grounds are separated.', order: 0 },
  gravity: { label: 'Gravity', line: 'The water\'s own weight pulls it through the bed.', order: 1 },
  hand: { label: 'Hand pressure', line: 'You press a plunger to push the brew through the bed and filter.', order: 2 },
  vapour: { label: 'Vapour and vacuum', line: 'Heated vapour pushes the water up; as it cools, a vacuum pulls the brew back down.', order: 3 },
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
  /** Anything Astra should check before this ships. */
  verify?: string[];
}

const fromEngine = (id: MethodId) => {
  const m = METHODS.find((x) => x.id === id)!;
  return {
    ratio: { classic: m.ratio.classic, range: [m.ratio.stronger, m.ratio.lighter] as [number, number], ...(id === 'espresso' ? { yield: true } : {}) },
    grind: m.grindLabel,
    temp: id === 'cold-brew' ? 'Cold or room temperature' : id === 'moka' ? 'Just-boiled water in the base' : `${Math.round(m.tempC.min * 9 / 5 + 32)}–${Math.round(m.tempC.max * 9 / 5 + 32)}°F (${m.tempC.min}–${m.tempC.max}°C)`,
    timeS: [m.timeS.min, m.timeS.max] as [number, number],
    recipeBy: m.base?.by ? `the Brew Guide's recipe, after ${m.base.by}` : 'the Brew Guide\'s recipe',
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
    guide: { slug: 'ultimate-pour-over-coffee-guide-and-best-v60-technique', title: 'Pour over coffee guide (V60 and other cones)' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'kalita', label: 'Kalita Wave', the: 'the Kalita Wave', line: 'A flat-bottomed dripper with three small holes: the flat bed is forgiving.',
    contact: 'percolation', filter: 'paper', force: 'gravity', attention: 2,
    ...fromEngine('kalita'),
    guide: { slug: 'dripper-material-comparison', title: 'Dripper materials compared' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'drip-machine', label: 'Drip machine', the: 'a drip machine', line: 'A machine heats the water and showers it over a flat basket.',
    contact: 'percolation', filter: 'paper', force: 'gravity', attention: 1,
    ...fromEngine('drip-machine'),
    guide: { slug: 'batch-brew-drip-coffee-guide', title: 'Batch brew and drip coffee guide' },
    sourceIds: ['rao', 'synthesis'],
  },
  {
    id: 'phin', label: 'Phin', the: 'the phin', line: 'A small Vietnamese metal filter that drips slowly straight into the glass.',
    contact: 'percolation', filter: 'metal', force: 'gravity', attention: 2,
    timeS: [240, 300], ratio: { classic: 8.6, range: [8.6, 8.6] }, grind: 'Medium-coarse', temp: '205–212°F (95–100°C)',
    recipeBy: 'our phin guide: 14 g of coffee and 120 ml of water, dripping for 4–5 minutes',
    brewGuide: null,
    guide: { slug: 'vietnamese-phin-guide', title: 'Vietnamese phin guide' },
    sourceIds: [],
    verify: ['phin recipe (14 g / 120 ml, 4–5 min) is the site article\'s; check against a published Vietnamese source'],
  },
  {
    id: 'french-press', label: 'French press', the: 'the French press', line: 'Coffee steeps in all the water; a metal mesh holds the grounds back.',
    contact: 'immersion', filter: 'metal', force: 'none', attention: 1,
    timeNote: 'Easto\'s recipe; 4-minute recipes are common too',
    ...fromEngine('french-press'),
    guide: { slug: 'how-to-use-a-french-press-the-most-amazing-coffee-youve-ever-had', title: 'How to use a French press' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'cold-brew', label: 'Cold brew', the: 'cold brew', line: 'Coarse coffee steeps in cold water for half a day or more.',
    contact: 'immersion', filter: 'metal', force: 'none', attention: 1,
    ...fromEngine('cold-brew'),
    guide: { slug: 'cold-brew-concentrate-guide', title: 'Cold brew concentrate: ratio, steep time and dilution' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'turkish', label: 'Turkish coffee', the: 'Turkish coffee', line: 'Powder-fine coffee heated with water in a cezve and poured unfiltered.',
    contact: 'immersion', filter: 'none', force: 'none', attention: 2,
    timeS: [120, 180], ratio: { classic: 10, range: [9, 10] }, grind: 'Powder (finer than espresso)', temp: 'Heated slowly to just below the boil',
    recipeBy: 'our Turkish coffee guide: about 1:9 to 1:10, heated over 2–3 minutes',
    brewGuide: null,
    guide: { slug: 'turkish-coffee-guide', title: 'Turkish coffee guide' },
    sourceIds: ['synthesis'],
    verify: ['contact time: the guide heats over 2–3 min; the synthesis gives 3–5 min overall'],
  },
  {
    id: 'clever', label: 'Clever Dripper', the: 'the Clever Dripper', line: 'A cone with a valve: it steeps like a press, then drains through paper.',
    contact: 'steep-drain', filter: 'paper', force: 'gravity', attention: 1,
    timeS: [240, 285], ratio: { classic: 15, range: [15, 16] }, grind: 'Medium-coarse', temp: '200–205°F (93–96°C)',
    recipeBy: 'our Clever Dripper guide: 20 g of coffee and 300 g of water, 4 minutes, then a 30–45 second drain',
    brewGuide: null,
    guide: { slug: 'the-clever-dripper-better-coffee-than-pour-over', title: 'The Clever Dripper' },
    sourceIds: ['synthesis'],
  },
  {
    id: 'siphon', label: 'Siphon', the: 'the siphon', line: 'Vapour pushes water up into the coffee; a vacuum pulls the brew back down.',
    contact: 'steep-drain', filter: 'cloth', force: 'vapour', attention: 3,
    timeS: [120, 180], ratio: { classic: 15, range: [15, 15] }, grind: 'Medium-fine', temp: '195–200°F (90–93°C)',
    recipeBy: 'our siphon guide: 20 g of coffee and 300 g of water, a 60–90 second steep and a 60–90 second drawdown',
    brewGuide: null,
    guide: { slug: 'how-to-use-a-siphon-coffee-maker', title: 'How to use a siphon coffee maker' },
    sourceIds: ['synthesis'],
  },
  {
    id: 'aeropress', label: 'AeroPress', the: 'the AeroPress', line: 'Coffee steeps in a chamber, then you press it through a paper disc.',
    contact: 'steep-drain', filter: 'paper', force: 'hand', attention: 2,
    ...fromEngine('aeropress'),
    guide: { slug: 'why-and-how-you-should-use-an-aeropress', title: 'Why and how to use an AeroPress' },
    sourceIds: ['easto', 'synthesis'],
  },
  {
    id: 'moka', label: 'Moka pot', the: 'the moka pot', line: 'Steam pressure in the base pushes water up through the coffee.',
    contact: 'percolation', filter: 'metal', force: 'steam', attention: 2,
    ...fromEngine('moka'),
    guide: { slug: 'moka-pot-brewing-guide', title: 'Moka pot brewing guide' },
    sourceIds: ['hoffmann', 'synthesis'],
  },
  {
    id: 'espresso', label: 'Espresso', the: 'espresso', line: 'A pump pushes hot water through a tamped puck in under half a minute.',
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
  // A standard cup, so the link opens a complete recipe: a 12 oz mug, or an 18 g double shot.
  return m.brewGuide === 'espresso' ? `/tools/brew-ratio/?method=espresso&dose=18` : `/tools/brew-ratio/?method=${m.brewGuide}&cup=355`;
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
export function timeText(m: AtlasMethod): string {
  const [a, b] = m.timeS;
  if (a >= 3600) return a === b ? `${a / 3600} hours` : `${a / 3600}–${b / 3600} hours`;
  if (b < 60) return `${a}–${b} seconds`;
  if (a % 60 === 0 && b % 60 === 0) return a === b ? `${a / 60} minutes` : `${a / 60}–${b / 60} minutes`;
  return `${mmss(a)}–${mmss(b)}`;
}
export function ratioText(m: AtlasMethod): string {
  const r = (x: number) => String(Math.round(x * 100) / 100);
  if (m.ratio.yield) return `1:${r(m.ratio.classic)} out (1:${r(m.ratio.range[0])}–1:${r(m.ratio.range[1])})`;
  return m.ratio.range[0] === m.ratio.range[1] ? `1:${r(m.ratio.classic)}` : `1:${r(m.ratio.classic)} (1:${r(m.ratio.range[0])}–1:${r(m.ratio.range[1])})`;
}

export type Axis = 'contact' | 'filter' | 'force' | 'time';

/** Every property two methods can differ on, in the order the comparison reads them. */
export function differences(a: AtlasMethod, b: AtlasMethod): Axis[] {
  const out: Axis[] = [];
  if (a.contact !== b.contact) out.push('contact');
  if (a.filter !== b.filter) out.push('filter');
  if (a.force !== b.force) out.push('force');
  // Time differs when the ranges don't overlap or one is at least twice the other.
  const mid = (m: AtlasMethod) => Math.sqrt(m.timeS[0] * m.timeS[1]);
  if (Math.max(mid(a), mid(b)) / Math.min(mid(a), mid(b)) >= 2) out.push('time');
  return out;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const FORCE_PHRASE: Record<Force, string> = {
  none: '', gravity: 'by gravity', hand: 'by hand', vapour: 'by vapour, then a vacuum', steam: 'by steam (about 1.5 bar)', pump: 'by a pump (about 9 bar)',
};
const FORCE_DO: Record<Force, string> = {
  none: 'just steeps', gravity: 'lets gravity pull the water through', hand: 'presses the brew through by hand', vapour: 'moves the water with vapour and a vacuum', steam: 'pushes the water with steam (about 1.5 bar)', pump: 'pushes the water with a pump (about 9 bar)',
};
const FILTER_PHRASE: Record<FilterKind, string> = {
  'thick-paper': 'thick paper', paper: 'paper', cloth: 'cloth', metal: 'metal', none: 'nothing',
};

/** One sentence per method, built only from its axes. */
export function describe(m: AtlasMethod): string {
  const t = timeText(m);
  if (m.contact === 'percolation') return `${cap(m.the)} sends water through a bed of coffee ${FORCE_PHRASE[m.force]} and out through ${FILTER_PHRASE[m.filter]}, in about ${t}.`;
  if (m.force === 'vapour') return `In ${m.the}, vapour pushes the water up into the coffee to steep, then a vacuum pulls the brew back down through ${FILTER_PHRASE[m.filter]}, in about ${t}.`;
  if (m.contact === 'steep-drain') {
    const out = m.force === 'hand' ? 'you press the brew through the bed and out through' : m.force === 'vapour' ? 'vapour pushes the water up into the coffee and a vacuum pulls the brew back down through' : 'the brew drains through the bed and out through';
    return `${cap(m.the)} steeps the coffee, then ${out} ${FILTER_PHRASE[m.filter]}, in about ${t}.`;
  }
  return m.filter === 'none'
    ? `${cap(m.the)} steeps the coffee in all the water for about ${t} and is poured unfiltered; the grounds settle in the cup.`
    : `${cap(m.the)} steeps the coffee in all the water for about ${t}, then ${FILTER_PHRASE[m.filter]} holds the grounds back.`;
}

/** The headline difference for a comparison: at most two clauses, the rest is in the table. */
export function differenceSentence(a: AtlasMethod, b: AtlasMethod): string {
  const d = differences(a, b);
  if (!d.length) return `${cap(a.the)} and ${b.the} work the same way on every axis here; they differ in the brewer's shape and how fast it drains.`;
  const parts: string[] = [];
  if (d.includes('contact')) {
    const verb = (m: AtlasMethod) => m.contact === 'percolation' ? 'runs water through the coffee' : m.contact === 'immersion' ? 'steeps it in all the water' : 'steeps it, then drains it through the bed';
    parts.push(`${a.the} ${verb(a)}; ${b.the} ${verb(b)}`);
  } else if (d.includes('force')) {
    parts.push(`${a.the} ${FORCE_DO[a.force]}; ${b.the} ${FORCE_DO[b.force]}`);
  }
  if (d.includes('filter')) {
    const [clear, full] = FILTER[a.filter].order <= FILTER[b.filter].order ? [a, b] : [b, a];
    parts.push(full.filter === 'none' ? `only ${clear.the} is filtered` : `${clear.the} gets the clearer cup (${FILTER_PHRASE[clear.filter]} against ${FILTER_PHRASE[full.filter]})`);
  } else if (d.includes('time')) {
    const [fast, slow] = a.timeS[1] <= b.timeS[1] ? [a, b] : [b, a];
    parts.push(`${fast.the} takes ${timeText(fast)}, ${slow.the} ${timeText(slow)}`);
  }
  if (parts.length === 1 && d.includes('force') && d.includes('contact')) {
    const pushed = [a, b].filter((m) => m.force === 'hand' || m.force === 'steam' || m.force === 'pump' || m.force === 'vapour');
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
