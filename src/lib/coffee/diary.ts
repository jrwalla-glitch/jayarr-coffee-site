import type { Intake } from './caffeine.ts';
import { DEFAULT_BED_MIN, newDayAt } from './caffeine.ts';

// The caffeine diary as a log of real moments. Each drink is stored with the instant it was drunk;
// "today" is a view over the log, so nothing is ever discarded to make a day fit (Astra, Wave A r2).
//
// Day boundaries are instants, not clock comparisons: each diary date starts at one local time
// (four hours after bedtime unless the reader sets it), resolved by the Date constructor to a
// single instant. A skipped time moves forward to the first valid one; a repeated time resolves to
// its first occurrence. Comparing instants can't run backwards inside a repeated hour.

export interface LoggedDrink extends Omit<Intake, 'atMin'> {
  id: string;
  /** When it was drunk, epoch milliseconds. */
  at: number;
}
export interface DiarySettings {
  halfLifeH: number;
  /** Bedtime in diary minutes (11 pm = 1380, 1 am = 1500). */
  bedMin: number;
  /** The reader's own "my day starts at" clock time, or null for four hours after bedtime. */
  dayStartMin: number | null;
  pregnant: boolean;
}
export interface DiaryStore { v: 2; drinks: LoggedDrink[]; settings: DiarySettings; migratedFromV1?: boolean }
export interface DayWindow { start: number; end: number; y: number; m: number; d: number; midnight: number }

export const DEFAULT_SETTINGS: DiarySettings = { halfLifeH: 5, bedMin: DEFAULT_BED_MIN, dayStartMin: null, pregnant: false };
/** How long drinks stay in the log; caffeine from a week ago no longer matters. */
export const KEEP_DAYS = 7;
/** Earlier drinks still counted in today's curve (a late coffee yesterday is still in you this morning). */
export const CARRY_HOURS = 48;

/** One local instant for a calendar date and clock minutes. */
export function localInstant(y: number, m: number, d: number, clockMin: number): number {
  return new Date(y, m, d, Math.floor(clockMin / 60), clockMin % 60).getTime();
}

export function dayStartClock(s: Pick<DiarySettings, 'bedMin' | 'dayStartMin'>): number {
  return s.dayStartMin ?? newDayAt(s.bedMin);
}

/** The diary day containing `now`: [start, end) instants and the date it's named for. */
export function dayWindow(now: number, startClock: number): DayWindow {
  const n = new Date(now);
  const y = n.getFullYear(), m = n.getMonth(), d = n.getDate();
  const todayStart = localInstant(y, m, d, startClock);
  const shift = now >= todayStart ? 0 : -1;
  const day = new Date(y, m, d + shift);
  const Y = day.getFullYear(), M = day.getMonth(), D = day.getDate();
  return { start: localInstant(Y, M, D, startClock), end: localInstant(Y, M, D + 1, startClock), y: Y, m: M, d: D, midnight: localInstant(Y, M, D, 0) };
}

/** A clock time entered for this diary day, as the instant inside the day (00:30 after an 11 pm bedtime is the next date). */
export function instantInDay(clockMin: number, w: DayWindow): number {
  const t = localInstant(w.y, w.m, w.d, clockMin);
  return t < w.start ? localInstant(w.y, w.m, w.d + 1, clockMin) : t;
}

/**
 * A clock time typed in for the day you're looking at. It lands inside that diary day, so at 9 pm
 * "08:30" is this morning (blind Opus r3: the nearest-moment rule sent it to tomorrow). The one
 * exception: if that lands more than 12 hours ahead and the same time earlier today was within the
 * last 12 hours, it means earlier (at 05:45, "02:30" is three hours ago, not tonight; Opus r2).
 */
export function placeTypedTime(clockMin: number, now: number, w: DayWindow): number {
  const inDay = instantInDay(clockMin, w);
  if (inDay - now <= 12 * 3600e3) return inDay;
  const d = new Date(inDay);
  const earlier = localInstant(d.getFullYear(), d.getMonth(), d.getDate() - 1, clockMin);
  return now - earlier >= 0 && now - earlier <= 12 * 3600e3 ? earlier : inDay;
}

/** Real elapsed minutes from the diary date's midnight, so a 23- or 25-hour day stays exact. */
export function minutesFromMidnight(w: DayWindow, at: number): number {
  return (at - w.midnight) / 60000;
}

/** Bedtime for this diary day as an instant (1 am bedtime is the next date). */
export function bedInstant(w: DayWindow, bedMin: number): number {
  return localInstant(w.y, w.m, w.d + Math.floor(bedMin / 1440), ((bedMin % 1440) + 1440) % 1440);
}

/** Local clock minutes of an instant, for display. */
export function clockOf(at: number): number {
  const t = new Date(at);
  return t.getHours() * 60 + t.getMinutes();
}

/** Today's drinks (in the list and total) and earlier ones still in the body (curve only), as engine intakes. */
export function dayView(drinks: LoggedDrink[], w: DayWindow): { today: (Intake & { id: string; at: number })[]; carried: Intake[] } {
  const toIntake = (x: LoggedDrink) => ({ ...x, atMin: minutesFromMidnight(w, x.at) });
  const today = drinks.filter((x) => x.at >= w.start && x.at < w.end).map(toIntake).sort((a, b) => a.at - b.at);
  const carried = drinks.filter((x) => x.at < w.start && x.at >= w.start - CARRY_HOURS * 3600e3).map(toIntake);
  return { today, carried };
}

/** Drop drinks older than KEEP_DAYS; keep everything newer, including future-dated ones. */
export function pruneLog(drinks: LoggedDrink[], now: number): LoggedDrink[] {
  return drinks.filter((x) => x.at >= now - KEEP_DAYS * 86400e3);
}

/**
 * Version-1 saves ({ day: 'yyyy-m-d', intakes: [{ atMin }] }) to the log. Each drink keeps its own
 * date: minutes of 1440 and over are after midnight on the next date. This runs before any day
 * comparison, so a save from "yesterday's" key can't be thrown away.
 */
export function migrateV1(v1: unknown, makeId: () => string): DiaryStore | null {
  if (!v1 || typeof v1 !== 'object') return null;
  const o = v1 as { day?: string; intakes?: (Intake & { atMin: number })[]; halfLifeH?: number; bedMin?: number; pregnant?: boolean };
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(o.day ?? '');
  const drinks: LoggedDrink[] = [];
  if (m && Array.isArray(o.intakes)) {
    for (const i of o.intakes) {
      if (!Number.isFinite(i.atMin)) continue;
      const { atMin, ...rest } = i;
      const extraDays = Math.floor(atMin / 1440), clock = ((Math.round(atMin) % 1440) + 1440) % 1440;
      drinks.push({ ...rest, id: makeId(), at: localInstant(+m[1], +m[2] - 1, +m[3] + extraDays, clock) });
    }
  }
  const bed = Number.isFinite(o.bedMin) ? (o.bedMin! < 720 ? o.bedMin! + 1440 : o.bedMin!) : DEFAULT_BED_MIN;
  return { v: 2, drinks, settings: { halfLifeH: o.halfLifeH ?? 5, bedMin: bed, dayStartMin: null, pregnant: !!o.pregnant }, migratedFromV1: true };
}

/** A shared day's drinks (diary minutes) placed into this device's current day, by clock time. */
export function placeSharedDay(intakes: Intake[], w: DayWindow, makeId: () => string): LoggedDrink[] {
  return intakes.map(({ atMin, ...rest }) => ({ ...rest, id: makeId(), at: instantInDay(((Math.round(atMin) % 1440) + 1440) % 1440, w) }));
}

/** Today's drinks as a shareable day: diary minutes, with after-midnight times past 1440. */
export function toDiaryMinutes(today: { at: number }[], w: DayWindow): number[] {
  return today.map((x) => {
    const t = new Date(x.at);
    const nextDate = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() > new Date(w.y, w.m, w.d).getTime();
    return clockOf(x.at) + (nextDate ? 1440 : 0);
  });
}

// ── Saving: edits, not snapshots ──
// Each tab applies its own edits to a fresh read of storage, so an idle or stale tab can never
// overwrite another tab's log or bring back a drink someone removed (Astra, Wave A r3). Clock ticks
// never write.

export type DiaryOp =
  | { type: 'add'; drink: LoggedDrink }
  | { type: 'remove'; id: string }
  | { type: 'retime'; id: string; at: number }
  | { type: 'clear'; start: number; end: number }
  | { type: 'replaceDay'; start: number; end: number; drinks: LoggedDrink[] }
  | { type: 'settings'; patch: Partial<DiarySettings> };

export function emptyStore(): DiaryStore {
  return { v: 2, drinks: [], settings: { ...DEFAULT_SETTINGS } };
}

/** Apply one edit to the latest stored log. Edits to drinks that are gone are no-ops. */
export function applyOp(store: DiaryStore, op: DiaryOp, now: number): DiaryStore {
  let drinks = store.drinks, settings = store.settings;
  switch (op.type) {
    case 'add': if (!drinks.some((x) => x.id === op.drink.id)) drinks = [...drinks, op.drink]; break;
    case 'remove': drinks = drinks.filter((x) => x.id !== op.id); break;
    case 'retime': drinks = drinks.map((x) => (x.id === op.id ? { ...x, at: op.at } : x)); break;
    case 'clear': drinks = drinks.filter((x) => !(x.at >= op.start && x.at < op.end)); break;
    case 'replaceDay': drinks = [...drinks.filter((x) => !(x.at >= op.start && x.at < op.end)), ...op.drinks]; break;
    case 'settings': settings = { ...settings, ...op.patch }; break;
  }
  return { ...store, v: 2, drinks: pruneLog(drinks, now), settings };
}

/** Parse a stored v2 diary, dropping anything malformed. */
export function parseStore(raw: string | null): DiaryStore | null {
  if (!raw) return null;
  try {
    const st = JSON.parse(raw);
    if (st?.v !== 2 || !Array.isArray(st.drinks)) return null;
    return { v: 2, drinks: st.drinks.filter((x: LoggedDrink) => x && typeof x.id === 'string' && Number.isFinite(x.at)), settings: { ...DEFAULT_SETTINGS, ...(st.settings ?? {}) }, ...(st.migratedFromV1 ? { migratedFromV1: true } : {}) };
  } catch { return null; }
}
