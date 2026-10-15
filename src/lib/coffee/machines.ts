// Espresso Machine Chooser: a counter, a budget that includes the grinder, a routine and an
// appetite for effort, matched to two or three machines from the makers' published specs.
// Data: src/data/machines.json, built from makeover-2026-10/research (RESEARCH_ESPRESSO_MACHINES.md).
// No static prices are shown: list prices only place a machine in a dated budget band.

export type Category = 'manual-lever' | 'semi-auto' | 'semi-auto-grinder' | 'super-auto' | 'capsule';
/** Heating families; the maker's own term (ThermoJet, Thermocoil) travels in `makerTerm`. */
export type Heating = 'thermoblock' | 'single-boiler' | 'heat-exchanger' | 'dual-boiler' | 'none';
export type Milk = 'none' | 'manual-wand' | 'panarello' | 'auto-wand' | 'carafe';

export interface Machine {
  id: string; brand: string; name: string; models: string[];
  /** 'unconfirmed': the research couldn't establish whether the maker still sells it. */
  status: 'current' | 'discontinued' | 'replaced' | 'unconfirmed'; replacedBy?: string | null;
  /** null where the research couldn't establish it; such machines are browsable, never recommended. */
  category: Category | null;
  heating: { system: Heating; makerTerm?: string | null; boilers?: { role: string; liters: number | null }[]; heatUpSeconds?: number | null; simultaneousBrewSteam?: boolean | null };
  tempControl?: { type: string; range?: string | null } | null;
  pumpBar?: number | null; preInfusion?: boolean | string | null; gauge?: boolean | null;
  portafilterMm?: number | null; baskets?: string[]; doseG?: number | string | null;
  milk: { type: Milk | null; makerTerm?: string | null };
  grinder: { builtIn: boolean | null; type?: string | null; settings?: number | string | null };
  tankL?: number | null; plumbable?: boolean | null;
  /** Width, depth and height in centimetres. */
  dims?: { w: number; d: number; h: number } | null;
  weightKg?: number | null; watts?: number | null;
  recipe?: { doseG?: number | string | null; yield?: string | null; seconds?: string | number | null; tempC?: number | null } | null;
  care?: { descale?: string | null; backflush?: string | null; manualUrl?: string | null } | null;
  /** The dated price seen on the maker's US site or shop, and what kind it was; only for budget bands. */
  listPrice: { usd: number | null; kind?: string | null; url?: string | null; checked?: string | null };
  amazon?: { asin: string | null; url: string | null; title?: string | null; checked?: string | null } | null;
  sources?: { field: string; url: string; checked: string }[];
  notes?: string | null;
  /** No longer set: superseded by dimsUnclear (kept so older data still type-checks). */
  axisFlag?: boolean;
  dimsPublished?: { w: number; d: number; h: number; unit: string } | null;
  /** The maker's printed size where its axes conflict with the maker's own guidance; dims is then null. */
  dimsUnclear?: string | null;
  /** The countertop clearance the maker suggests, in centimetres, and where it says so. */
  clearanceCm?: number | null; clearanceUrl?: string | null;
}
export interface GrinderPrice { id: string; name: string; usd: number | null; checked?: string | null; url?: string | null }

export interface Needs {
  /** How often milk goes in: never, sometimes, or most drinks. */
  milk: 'none' | 'some' | 'most';
  /** Drinks on a usual morning. */
  cups: 1 | 3 | 5;
  /** The whole setup, grinder included, in US dollars. */
  budget: number;
  /** Push a button; have the machine guide you; or do it by hand. */
  effort: 'button' | 'guided' | 'hands-on';
  widthCm?: number | null; heightCm?: number | null;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  'manual-lever': 'Manual lever', 'semi-auto': 'Semi-automatic', 'semi-auto-grinder': 'Semi-automatic with grinder',
  'super-auto': 'Super-automatic', capsule: 'Capsule',
};

/** Machines that need a separate espresso grinder (capsules and super-automatics don't). */
export const needsGrinder = (m: Machine) => (m.category === 'semi-auto' || m.category === 'manual-lever') && !m.grinder.builtIn;

/** The setup's budget band: the machine's dated list price, plus the published grinder range where one is needed. */
export function setupBand(m: Machine, grinders: GrinderPrice[]): { low: number; high: number } | null {
  if (m.listPrice.usd == null) return null;
  if (!needsGrinder(m)) return { low: m.listPrice.usd, high: m.listPrice.usd };
  const p = grinders.map((g) => g.usd).filter((n): n is number => n != null).sort((a, b) => a - b);
  if (!p.length) return null;
  return { low: m.listPrice.usd + p[0], high: m.listPrice.usd + p[p.length - 1] };
}

/** The height to test against the cabinets: the body, or the maker's suggested clearance where that is more. */
export const neededHeight = (m: Machine) => (m.dims || m.clearanceCm ? Math.max(m.dims?.h ?? 0, m.clearanceCm ?? 0) : null);

/**
 * Does it fit the space given (width and height under the cabinets)? Unknown dimensions never "fit".
 * Height uses the maker's suggested clearance where it publishes one, so a machine whose printed size is
 * unclear can still be checked against cabinets; its width can't, so a width rules it out.
 */
export function fitsCounter(m: Machine, n: Pick<Needs, 'widthCm' | 'heightCm'>): boolean | null {
  if (!n.widthCm && !n.heightCm) return true;
  if (n.widthCm) { if (!m.dims) return null; if (m.dims.w > n.widthCm) return false; }
  if (n.heightCm) { const h = neededHeight(m); if (h == null) return null; if (h > n.heightCm) return false; }
  return true;
}

const EFFORT_OK: Record<Needs['effort'], Category[]> = {
  button: ['super-auto', 'capsule'],
  guided: ['semi-auto-grinder', 'super-auto'],
  'hands-on': ['semi-auto', 'semi-auto-grinder', 'manual-lever'],
};

export interface Match { machine: Machine; band: { low: number; high: number } | null; score: number; why: string[]; tradeoffs: string[] }

/**
 * Two or three matches, best first. Hard limits: current machines that fit the counter and
 * whose budget band starts within the budget. Then a score: lower is better.
 */
export function chooseMachines(machines: Machine[], grinders: GrinderPrice[], n: Needs, k = 3): Match[] {
  const out: Match[] = [];
  for (const m of machines) {
    if (m.status !== 'current' || !m.category) continue;
    if (fitsCounter(m, n) !== true) continue;
    // A milk routine can't be matched to a machine whose milk system the research couldn't establish,
    // and milk in most drinks rules out a machine with no milk system at all.
    if (n.milk !== 'none' && m.milk.type == null) continue;
    if (n.milk === 'most' && m.milk.type === 'none') continue;
    const band = setupBand(m, grinders);
    if (!band || band.low > n.budget) continue;
    let score = 0;
    const why: string[] = [], tradeoffs: string[] = [];
    // Effort
    if (EFFORT_OK[n.effort].includes(m.category)) why.push(effortWhy(m, n));
    // Guided, but a plain semi-automatic: close, with a separate grinder to learn too.
    else if (n.effort === 'guided' && m.category === 'semi-auto') { score += m.milk.type === 'auto-wand' ? 1 : 2; tradeoffs.push('Needs a separate grinder, and you dose and tamp by hand.'); }
    else { score += 4; tradeoffs.push(effortTrade(m, n)); }
    // Milk
    if (n.milk !== 'none') {
      if (m.milk.type === 'none') { score += n.milk === 'most' ? 6 : 3; tradeoffs.push('No milk system: you would need a separate frother.'); }
      else if (n.effort === 'button' && (m.milk.type === 'manual-wand' || m.milk.type === 'panarello')) { score += 1.5; tradeoffs.push('Milk is steamed by hand, not at the press of a button.'); }
      else why.push(milkWhy(m));
      if (n.milk === 'most' && n.cups >= 3 && m.category !== 'capsule' && m.category !== 'super-auto') {
        // Brewing and steaming at once matters most for a run of milk drinks; a fast switch is next best.
        if (m.heating.simultaneousBrewSteam) { score -= n.cups >= 5 ? 1.5 : 0.5; why.push('Brews and steams at the same time, which keeps a run of milk drinks moving.'); }
        else if ((m.heating.heatUpSeconds ?? Infinity) <= 10) { score += n.cups >= 5 ? 1 : 0; why.push(`Switches from brewing to steaming quickly (the maker quotes about ${m.heating.heatUpSeconds} seconds to heat).`); if (n.cups >= 5) tradeoffs.push('Brews and steams one after the other: quick to switch, but five milk drinks still queue.'); }
        else { score += 2; tradeoffs.push('Brews and steams one after the other, so several milk drinks take a while.'); }
      }
    } else if (m.milk.type === 'carafe' || m.milk.type === 'auto-wand') { score += 0.5; tradeoffs.push('You would be paying for an automatic milk system you don\'t need.'); }
    // Budget: room to spare is fine; using all of it on the machine alone is not.
    if (band.high > n.budget) { score += 1; tradeoffs.push('The upper end of its grinder range runs past your budget.'); }
    out.push({ machine: m, band, score, why, tradeoffs });
  }
  return out.sort((a, b) => a.score - b.score || (a.band!.low - b.band!.low) || a.machine.name.localeCompare(b.machine.name)).slice(0, k);
}

function effortWhy(m: Machine, n: Needs): string {
  if (m.category === 'capsule') return 'Capsules: no grinding, dosing or tamping.';
  if (m.category === 'super-auto') return 'Grinds, doses and brews at the press of a button.';
  if (m.category === 'semi-auto-grinder') return n.effort === 'hands-on' ? 'Grinder built in, but you still dose, tamp and time the shot.' : 'Grinder built in, so there is one machine to learn.';
  if (m.category === 'manual-lever') return 'You make the pressure by hand: the most control, and the most practice.';
  return 'You grind, dose, tamp and steam yourself: the most control over every shot.';
}
function effortTrade(m: Machine, n: Needs): string {
  if (n.effort === 'button') return 'Needs grinding, dosing and tamping by hand.';
  if (m.category === 'capsule') return 'Capsules only: no choice of beans or grind.';
  if (m.category === 'manual-lever') return 'A manual lever takes practice before it is quick.';
  return 'More automatic than you asked for: less control over each shot.';
}
function milkWhy(m: Machine): string {
  if (m.milk.type === 'carafe') return 'Makes milk drinks automatically from its own milk system.';
  if (m.milk.type === 'auto-wand') return 'A steam wand that textures the milk for you.';
  if (m.milk.type === 'panarello') return 'A beginner-friendly frothing wand.';
  return 'A manual steam wand: the most control over milk texture, with practice.';
}

/** "$650–$1,350" for a band. */
export function bandText(b: { low: number; high: number }): string {
  const f = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
  return b.low === b.high ? f(b.low) : `${f(b.low)}–${f(b.high)}`;
}
