import type { Result } from './types.ts';
import { failure, finite, success } from './units.ts';

// Freshness windows (synthesis §13): rest at least 3–4 days after roasting (too much CO2),
// peak 7–21 days post-roast (all sources), use within about a month (Hoffmann), never refrigerate.
// Freezing slows the loss rather than stopping it: Marin 2008's frozen samples still lost volatiles
// over a year. The tool treats up to about a year frozen as paused (Gagné, Rao), a simplification.
// The "fading" and "stale" boundaries after a month are editorial and labelled as such in the UI.

export type FreshUse = 'filter' | 'espresso';
export type Storage = 'sealed-bag' | 'opened' | 'frozen';
export type StageId = 'resting' | 'opening' | 'peak' | 'good' | 'fading' | 'stale';

export interface Stage { id: StageId; label: string; short: string; from: number; to: number; advice: string }

/**
 * Day boundaries since roasting, as [from, to): peak covers days 7–21 inclusive and "still good" runs
 * to day 30, so the window dates shown (last peak day, best-used-by day) are inside their stages (Muse r4).
 * Espresso rests a few days longer (verify).
 */
export function stages(use: FreshUse): Stage[] {
  const restEnd = use === 'espresso' ? 7 : 4;
  const all: Stage[] = [
    { id: 'resting', short: 'Resting', label: 'Probably still resting', from: 0, to: restEnd, advice: 'Likely too fresh: trapped CO₂ can make it brew unevenly. Another few days usually helps.' },
    { id: 'opening', short: 'Opening up', label: 'Opening up', from: restEnd, to: 7, advice: 'Ready to brew; most coffees keep getting sweeter for a few more days.' },
    { id: 'peak', short: 'Usually best', label: 'Likely at its best', from: 7, to: 22, advice: 'Most coffees taste their best around now. Brew it.' },
    { id: 'good', short: 'Still good', label: 'Probably still good', from: 22, to: 31, advice: 'Typically past its best but still good. Finish it soon, or freeze what you won\'t use.' },
    { id: 'fading', short: 'Fading', label: 'Likely fading', from: 31, to: 60, advice: 'Aroma usually fades by now. Taste it: if it\'s dull, brew a little finer or hotter, and buy fresher next time.' },
    { id: 'stale', short: 'Stale', label: 'Likely stale', from: 60, to: Number.POSITIVE_INFINITY, advice: 'Probably flat by now. Taste it: if it\'s dull or papery, it\'s still fine for cold brew or baking.' },
  ];
  // Espresso rests until day 7, so its "opening up" stage has no width: leave it out.
  return all.filter((st) => st.to > st.from);
}

export interface FreshnessInput {
  /** ISO dates (yyyy-mm-dd). */
  roastDate: string;
  today: string;
  use: FreshUse;
  storage: Storage;
  /** For frozen beans: the day they went into the freezer. Days frozen don't count. */
  frozenOn?: string;
  /** For frozen beans that have come out: the clock runs again from this day. */
  thawedOn?: string;
}

export interface FreshnessResult {
  daysSinceRoast: number;
  /** Days that count toward staling (freezer days removed). */
  effectiveDays: number;
  stage: Stage;
  peakFrom: string;
  peakTo: string;
  useBy: string;
  stages: Stage[];
  notes: string[];
  /** Why these are typical windows, not a forecast for this particular bag. */
  uncertainty: string;
  /** More than a year in the freezer: the pause stops there and the clock runs again. */
  freezerCapped: boolean;
}

/** A real calendar date in yyyy-mm-dd form (2026-02-31 is not). */
export const isRealDate = (s: string) => Number.isFinite(parse(s));

const DAY = 86400000;
/** Frozen days count as paused for up to about a year (Gagné, Rao via synthesis §13), not forever. A simplification: freezing slows staling a great deal but doesn't stop it (Marin 2008). */
export const FREEZER_PAUSE_MAX_DAYS = 365;
// Calendar days in UTC, so daylight-saving changes never add or lose a day. Impossible dates
// (Feb 31) are rejected rather than rolled into the next month.
const parse = (s: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? '');
  if (!m) return NaN;
  const t = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const d = new Date(t);
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3] ? t : NaN;
};
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

export function freshness(input: FreshnessInput): Result<FreshnessResult> {
  const roast = parse(input.roastDate), today = parse(input.today);
  if (!finite(roast)) return /^\d{4}-\d{2}-\d{2}$/.test(input.roastDate ?? '') ? failure('impossible-date', 'roastDate', 'That date doesn\'t exist: check the day and month on the bag.') : failure('bad-date', 'roastDate', 'Enter the roast date from the bag.');
  if (!finite(today)) return failure('bad-date', 'today', 'Today\'s date is missing.');
  if (roast > today) return failure('future', 'roastDate', 'That roast date is in the future. Check the bag: some show a best-by date instead.');
  const days = Math.round((today - roast) / DAY);
  // Ten calendar years, not 3,650 days, so leap days can't refuse a date two days early (Muse r4).
  if (`${Number(input.roastDate.slice(0, 4)) + 10}${input.roastDate.slice(4)}` < input.today) return failure('too-old', 'roastDate', 'That is more than ten years ago.');
  let frozenDays = 0, freezerCapped = false;
  const notes: string[] = [];
  if (input.storage === 'frozen') {
    const f = parse(input.frozenOn ?? '');
    if (!finite(f) || f < roast || f > today) return failure('bad-date', 'frozenOn', 'Enter the day the beans went into the freezer (on or after the roast date).');
    const out = input.thawedOn ? parse(input.thawedOn) : today;
    if (!finite(out) || out < f || out > today) return failure('bad-date', 'thawedOn', 'Enter the day they came out of the freezer (on or after the day they went in).');
    const inFreezer = Math.round((out - f) / DAY);
    // Freezing slows staling rather than stopping it (Marin 2008); up to about a year frozen is treated as paused (synthesis §13), and beyond that the clock runs again.
    frozenDays = Math.min(inFreezer, FREEZER_PAUSE_MAX_DAYS);
    freezerCapped = inFreezer > FREEZER_PAUSE_MAX_DAYS;
    if (inFreezer > FREEZER_PAUSE_MAX_DAYS) notes.push('After about a year even frozen beans lose quality, so time beyond a year in the freezer counts again.');
    notes.push(input.thawedOn ? 'The clock runs again from the day they came out. Don\'t refreeze them.' : 'Days in a sealed freezer bag barely count. Take out only what you need and don\'t refreeze it.');
  }
  if (input.storage === 'opened') notes.push('Opened bags go stale faster than sealed ones. Squeeze the air out and reseal; keep it cool, dark and dry, and out of the fridge.');
  const st = stages(input.use);
  const eff = days - frozenDays;
  const stage = st.find((s) => eff >= s.from && eff < s.to) ?? st[st.length - 1];
  const shift = frozenDays * DAY;
  return success({
    daysSinceRoast: days, effectiveDays: eff, stage, stages: st, notes,
    uncertainty: 'These are typical windows, not a forecast for your bag: roast level, the bag (one-way valve, nitrogen flush) and storage can move them by days to weeks. Your taste is the final check.',
    freezerCapped,
    peakFrom: iso(roast + 7 * DAY + shift), peakTo: iso(roast + 21 * DAY + shift), useBy: iso(roast + 30 * DAY + shift),
  });
}
