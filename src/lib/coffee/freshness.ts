import type { Result } from './types.ts';
import { failure, finite, success } from './units.ts';

// Freshness windows (synthesis §13): rest at least 3–4 days after roasting (too much CO2),
// peak 7–21 days post-roast (all sources), use within about a month (Hoffmann), freezing
// preserves beans for up to a year (Gagné, Rao), never refrigerate. The "fading" and
// "stale" boundaries after a month are editorial and labelled as such in the UI.

export type FreshUse = 'filter' | 'espresso';
export type Storage = 'sealed-bag' | 'opened' | 'frozen';
export type StageId = 'resting' | 'opening' | 'peak' | 'good' | 'fading' | 'stale';

export interface Stage { id: StageId; label: string; from: number; to: number; advice: string }

/** Day boundaries since roasting. Espresso rests a few days longer (verify). */
export function stages(use: FreshUse): Stage[] {
  const restEnd = use === 'espresso' ? 7 : 4;
  return [
    { id: 'resting', label: 'Resting', from: 0, to: restEnd, advice: 'Too fresh: trapped CO₂ makes it brew unevenly. Give it a few more days.' },
    { id: 'opening', label: 'Opening up', from: restEnd, to: 7, advice: 'Ready to brew; it will keep getting sweeter for a few days.' },
    { id: 'peak', label: 'Peak', from: 7, to: 21, advice: 'The best window. Brew it.' },
    { id: 'good', label: 'Still good', from: 21, to: 30, advice: 'Past the peak but good. Finish it this week, or freeze what you won\'t use.' },
    { id: 'fading', label: 'Fading', from: 30, to: 60, advice: 'Aroma is fading. Brew a little finer or hotter, and buy fresher next time.' },
    { id: 'stale', label: 'Stale', from: 60, to: Number.POSITIVE_INFINITY, advice: 'Flat and papery by now. Fine for cold brew or baking; not for a good cup.' },
  ];
}

export interface FreshnessInput {
  /** ISO dates (yyyy-mm-dd). */
  roastDate: string;
  today: string;
  use: FreshUse;
  storage: Storage;
  /** For frozen beans: the day they went into the freezer. Days frozen don't count. */
  frozenOn?: string;
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
}

const DAY = 86400000;
const parse = (s: string) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s ?? ''); if (!m) return NaN; return Date.UTC(+m[1], +m[2] - 1, +m[3]); };
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

export function freshness(input: FreshnessInput): Result<FreshnessResult> {
  const roast = parse(input.roastDate), today = parse(input.today);
  if (!finite(roast)) return failure('bad-date', 'roastDate', 'Enter the roast date from the bag.');
  if (!finite(today)) return failure('bad-date', 'today', 'Today\'s date is missing.');
  if (roast > today) return failure('future', 'roastDate', 'That roast date is in the future. Check the bag: some show a best-by date instead.');
  const days = Math.round((today - roast) / DAY);
  if (days > 3650) return failure('too-old', 'roastDate', 'That is more than ten years ago.');
  let frozenDays = 0;
  const notes: string[] = [];
  if (input.storage === 'frozen') {
    const f = parse(input.frozenOn ?? '');
    if (!finite(f) || f < roast || f > today) return failure('bad-date', 'frozenOn', 'Enter the day the beans went into the freezer (on or after the roast date).');
    frozenDays = Math.round((today - f) / DAY);
    notes.push('Days in a sealed freezer bag barely count. Take out only what you need and don\'t refreeze it.');
  }
  if (input.storage === 'opened') notes.push('Once opened, squeeze the air out and reseal; keep it cool, dark and dry. Never in the fridge.');
  const st = stages(input.use);
  const eff = days - frozenDays;
  const stage = st.find((s) => eff >= s.from && eff < s.to) ?? st[st.length - 1];
  const shift = frozenDays * DAY;
  return success({
    daysSinceRoast: days, effectiveDays: eff, stage, stages: st, notes,
    peakFrom: iso(roast + 7 * DAY + shift), peakTo: iso(roast + 21 * DAY + shift), useBy: iso(roast + 30 * DAY + shift),
  });
}
