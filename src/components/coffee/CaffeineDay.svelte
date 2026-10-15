<script lang="ts">
  import { onMount } from 'svelte';
  import { METHODS, CAFFEINE, GUIDANCE, intakeMg, dayCurve, dailyTotal, inBodyAt, encodeDay, decodeDay, dayMinute, newDayAt, bedMinute, flOzToMl, mlToFlOz, buildRecipe,
    DEFAULT_SETTINGS, dayWindow, dayStartClock, dayView, instantInDay, placeTypedTime, minutesFromMidnight, bedInstant, clockOf, migrateV1, placeSharedDay, toDiaryMinutes, applyOp, parseStore, emptyStore, CARRY_HOURS } from '../../lib/coffee/index.ts';
  import type { Intake, MethodId, LoggedDrink, DiarySettings, DiaryStore, DiaryOp } from '../../lib/coffee/index.ts';

  // Your diary is a log of real moments (see diary.ts): "today" is a view over it, so nothing is
  // thrown away to make a day fit, and daylight-saving nights can't move a drink. A shared link is
  // a separate, temporary day that never touches the log unless you keep it.
  const BREWERS = METHODS.filter((m) => m.id !== 'espresso');
  const SIZES_OZ = [6, 8, 12, 16, 20];
  // A moka pot makes only a few ounces of coffee, so it gets its own sizes (Muse r3: 12 oz moka slipped in).
  const MOKA_OZ = [2, 3, 4, 6];
  const ESPRESSO_DRINKS = [
    { label: 'Single espresso', shots: 1 }, { label: 'Double espresso', shots: 2 },
    { label: 'Latte or cappuccino (double)', shots: 2 }, { label: 'Americano (double)', shots: 2 },
    { label: 'Triple shot', shots: 3 },
  ];
  // Primary figures, not a 1.5–10 h range no source supports (R4; see CAFFEINE.halfLifeH).
  const HALF_LIVES = [
    { h: CAFFEINE.halfLifeH.faster, label: 'Faster', note: 'Smokers, for example, clear caffeine faster.' },
    { h: CAFFEINE.halfLifeH.typical, label: 'Typical', note: 'A middle setting. Studies put the average at 2.5–4.5 hours in adult men (IOM, 2001) and 3.4 hours, range 2–5 (Knutti, 1981); a 2025 sleep trial says “typically 3–6 hours.” Five hours is at the slow end, so bedtime figures lean high.' },
    { h: CAFFEINE.halfLifeH.slower, label: 'Slower', note: 'Oral contraceptives can double the half-life (IOM, 2001). In one study it rose from 3 hours to 10.5 hours in the last four weeks of pregnancy, about 3½ times as long (Knutti, 1982).' },
  ];
  const EXAMPLE: Intake[] = [
    { kind: 'brewed', method: 'drip-machine', cupMl: flOzToMl(12), atMin: 7 * 60 + 30 },
    { kind: 'espresso', shots: 2, atMin: 14 * 60 },
  ];
  const STORE = 'jayarr-caffeine-log-v2';
  const STORE_V1 = 'jayarr-caffeine-day-v1';
  const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  let mode = $state<'example' | 'own' | 'shared'>('example');
  let settings = $state<DiarySettings>({ ...DEFAULT_SETTINGS });
  let log = $state<LoggedDrink[]>([]);
  let shared = $state<{ intakes: Intake[]; halfLifeH: number; bedMin: number } | null>(null);
  let nowMs = $state(Date.now());
  let mounted = $state(false);
  let hlBeforePregnancy = $state<number | null>(null);
  // A second tap confirms a change that removes your drinks (blind Opus r3: no confirm before).
  let confirmAction = $state<'keep' | 'clear' | null>(null);

  // add-drink form
  let addKind = $state<'brewed' | 'espresso' | 'decaf' | 'custom'>('brewed');
  let addMg = $state(150);
  let addMethod = $state<MethodId>('drip-machine');
  let addOz = $state(12);
  let addShots = $state(2);
  let addEsp = $state('Double espresso');
  let addTime = $state('09:00');
  let addError = $state('');
  // Says where a drink went when it isn't simply "today, so far" (Muse r4: a 2:30 am drink vanished into Earlier).
  let addNote = $state('');
  // A row's time that can't be used (skipped by the clocks): said, and the box goes back (Astra r5).
  let rowError = $state('');

  const toClock = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  const hhmm = (min: number) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
  const clock12 = (min: number) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}`; };
  const r0 = (n: number) => Math.round(n);
  const rangeText = (lo: number, hi: number) => (r0(lo) === r0(hi) ? `${r0(lo)}` : `${r0(lo)}–${r0(hi)}`);

  let halfLifeH = $derived(mode === 'shared' && shared ? shared.halfLifeH : settings.halfLifeH);
  let bedMin = $derived(mode === 'shared' && shared ? shared.bedMin : settings.bedMin);
  let startClock = $derived(dayStartClock({ bedMin, dayStartMin: mode === 'shared' ? null : settings.dayStartMin }));
  let win = $derived(dayWindow(nowMs, dayStartClock(settings)));
  let ownView = $derived(dayView(log, win));

  // Rows for the list: own drinks keep their ids and real clock times; example and shared days are abstract.
  let rows = $derived(mode === 'own'
    ? ownView.today.map((x) => ({ key: x.id, i: x as Intake, clock: clockOf(x.at) }))
    : (mode === 'shared' && shared ? shared.intakes : EXAMPLE).map((i, k) => ({ key: String(k), i, clock: ((Math.round(i.atMin) % 1440) + 1440) % 1440 })).sort((a, b) => a.i.atMin - b.i.atMin));
  let sorted = $derived(rows.map((r) => r.i));
  // Earlier drinks still in your body (last night's late coffee) count in the curve, not the total.
  let curveIntakes = $derived(mode === 'own' ? [...ownView.carried, ...sorted] : sorted);
  // Last night's drinks still in your body, listed so you can see (and fix) what's being counted.
  let lastNight = $derived(mode === 'own' ? log.filter((x) => x.at < win.start && x.at >= win.start - CARRY_HOURS * 3600e3).sort((a, b) => b.at - a.at) : []);
  let bedAt = $derived(mode === 'own' ? minutesFromMidnight(win, bedInstant(win, bedMin)) : bedMin);
  let nowAt = $derived(mode === 'own' ? minutesFromMidnight(win, nowMs) : mode === 'example' ? dayMinute(clockOf(nowMs), bedMin) : null);
  // From 6 am, or earlier when the day starts earlier or a drink comes first (Opus r3: 03:10 showed nothing).
  let FROM = $derived(Math.min(6 * 60, Math.floor((mode === 'own' ? minutesFromMidnight(win, win.start) : startClock) / 60) * 60, ...sorted.map((i) => Math.floor((i.atMin - 30) / 60) * 60)));
  let TO = $derived(Math.max(26 * 60, Math.ceil((Math.max(bedAt, ...sorted.map((i) => i.atMin)) + 60) / 60) * 60));
  // Axis labels from real instants on your own day, so a 23- or 25-hour day is labelled correctly.
  const labelAt = (t: number) => (mode === 'own' ? clock12(clockOf(win.midnight + t * 60000)) : clock12(t));
  let curve = $derived(dayCurve(curveIntakes, FROM, TO, 5, halfLifeH));
  let total = $derived(dailyTotal(sorted));
  let atBed = $derived(inBodyAt(curveIntakes, bedAt, halfLifeH));
  let atNow = $derived(nowAt !== null && nowAt >= FROM && nowAt <= TO ? inBodyAt(curveIntakes, nowAt, halfLifeH) : null);
  let peak = $derived(curve.reduce((a, p) => (p.max > a.max ? p : a), { tMin: FROM, min: 0, max: 0 }));
  // A shared day is someone else's: judged against the healthy-adult reference, never the viewer's own settings (Muse r3).
  let guidance = $derived(settings.pregnant && mode !== 'shared' ? GUIDANCE.find((g) => g.id === 'acog-pregnancy')! : GUIDANCE.find((g) => g.id === 'fda-adult-daily')!);
  // Colour follows the middle estimate; a range that only reaches the reference at its top is flagged as "could be".
  let overDaily = $derived((total.min + total.max) / 2 > guidance.mg);
  let mightExceed = $derived(!overDaily && total.max > guidance.mg);
  // Plain-language comparison for the bedtime number (midpoint): tea ≈ 47 mg per 8 oz, espresso ≈ 63 mg a shot (synthesis §15, §16).
  let bedCompare = $derived.by(() => { const m = (atBed.min + atBed.max) / 2; return m < 20 ? 'Close to nothing left.' : m < 50 ? 'About a cup of black tea’s worth still in you.' : m < 90 ? 'About a shot of espresso’s worth still in you.' : 'Like a cup of coffee at bedtime.'; });

  // ── chart geometry ──
  // Drawn at the container's real width so text stays legible on phones.
  let chartW = $state(1000);
  let W = $derived(Math.max(320, Math.min(1100, chartW)));
  let narrow = $derived(W < 600);
  const H = 300, PADL = 46, PADR = 16, TOP = 24, BASE = 246;
  let yMax = $derived(Math.max(150, Math.ceil((peak.max * 1.1) / 50) * 50));
  let x = $derived((t: number) => PADL + ((t - FROM) / (TO - FROM)) * (W - PADL - PADR));
  let y = $derived((mg: number) => BASE - (mg / yMax) * (BASE - TOP));
  let band = $derived(
    `M${x(curve[0].tMin)} ${y(curve[0].max)} ` + curve.map((p) => `L${x(p.tMin)} ${y(p.max)}`).join(' ') +
    ' ' + [...curve].reverse().map((p) => `L${x(p.tMin)} ${y(p.min)}`).join(' ') + ' Z'
  );
  let mid = $derived(curve.map((p, i) => `${i ? 'L' : 'M'}${x(p.tMin)} ${y((p.min + p.max) / 2)}`).join(' '));
  let ticks = $derived(Array.from({ length: Math.floor((TO - FROM) / (narrow ? 360 : 120)) + 1 }, (_, i) => FROM + i * (narrow ? 360 : 120)));
  let yTicks = $derived(Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50).filter((v) => yMax <= 300 || v % 100 === 0));

  // A cup bigger than one brewer makes is counted, and said to be more than one brew's worth.
  function oversize(i: Intake) { if (i.kind !== 'brewed' || !i.method || !i.cupMl) return false; const r = buildRecipe({ method: i.method, target: { cupMl: i.cupMl } }); return !r.ok && r.errors[0].code === 'over-capacity'; }
  function describe(i: Intake) {
    if (i.kind === 'espresso') return i.label ?? (i.shots === 1 ? 'Single espresso' : `${i.shots} espresso shots`);
    if (i.kind === 'custom') return 'Drink with a known amount';
    const oz = r0(mlToFlOz(i.cupMl ?? 0));
    if (i.kind === 'decaf') return `${oz} oz decaf`;
    const m = METHODS.find((mm) => mm.id === i.method);
    // Brand names keep their capitals: "8 oz V60", "8 oz AeroPress", but "8 oz drip machine" (blind Opus r5).
    const nm = m ? (/^(Cold|Drip|Moka|Espresso)/.test(m.label) ? m.label.toLowerCase() : m.label) : 'coffee';
    return `${oz} oz ${nm}${oversize(i) ? ` (more than one ${nm} makes)` : ''}`;
  }
  function newIntake(): Omit<Intake, 'atMin'> {
    return addKind === 'custom' ? { kind: 'custom', mg: addMg } : addKind === 'espresso' ? { kind: 'espresso', shots: addShots, label: addEsp }
      : addKind === 'decaf' ? { kind: 'decaf', cupMl: flOzToMl(addOz) } : { kind: 'brewed', method: addMethod, cupMl: flOzToMl(addOz) };
  }
  function add() {
    const base = newIntake(), clock = toClock(addTime);
    if (!Number.isFinite(clock)) { addError = 'Pick a time.'; return; }
    const check = intakeMg({ ...base, atMin: 0 } as Intake);
    if (!check.ok) { addError = check.errors[0].message; return; }
    addError = ''; addNote = '';
    if (mode === 'shared' && shared) shared.intakes = [...shared.intakes, { ...base, atMin: dayMinute(clock, shared.bedMin) } as Intake];
    else {
      const at = placeTypedTime(clock, nowMs, win);
      if (at === null) { addError = 'That time doesn\'t exist today (the clocks changed); pick another.'; return; }
      mode = 'own'; commit({ type: 'add', drink: { ...base, id: newId(), at } as LoggedDrink });
      addNote = placedNote(at, clock);
    }
    addTime = hhmm(Math.min(22 * 60, clock + 180));
  }
  function placedNote(at: number, clock: number): string {
    if (at < win.start) return `${clock12(clock)} is before your day started (${clock12(startClock)}), so it's logged as last night's: it's under "Earlier" and counts in the curve, not today's total.`;
    if (at > nowMs + 60_000) return `${clock12(clock)} is later today: it counts in today's total now, and in the curve from then.`;
    return '';
  }
  function remove(key: string) {
    if (mode === 'own') commit({ type: 'remove', id: key });
    else if (mode === 'shared' && shared) shared.intakes = shared.intakes.filter((_, k) => String(k) !== key);
  }
  function retime(key: string, el: HTMLInputElement, was: number) {
    const clock = toClock(el.value);
    if (!Number.isFinite(clock)) { el.value = hhmm(was); return; }
    if (clock === was) return; // nothing changed (the box was put back)
    rowError = '';
    if (mode === 'own') {
      const at = placeTypedTime(clock, nowMs, win);
      if (at === null) { rowError = `${clock12(clock)} doesn't exist today (the clocks changed), so the drink stays at ${clock12(was)}.`; el.value = hhmm(was); return; }
      commit({ type: 'retime', id: key, at }); addNote = placedNote(at, clock);
    }
    else if (mode === 'shared' && shared) shared.intakes = shared.intakes.map((x, k) => (String(k) === key ? { ...x, atMin: dayMinute(clock, shared!.bedMin) } : x));
  }
  function clearDay() {
    if (mode === 'shared' && shared) shared.intakes = [];
    else { mode = 'own'; commit({ type: 'clear', start: win.start, end: win.end }); }
  }
  // Bedtime regroups the view; it never rewrites when a drink was drunk.
  function setBed(b: number) {
    if (mode === 'shared' && shared) { shared.bedMin = b; shared.intakes = shared.intakes.map((x) => ({ ...x, atMin: dayMinute(x.atMin, b) })); }
    else commit({ type: 'settings', patch: { bedMin: b } });
  }
  function setHalfLife(h: number) { if (mode === 'shared' && shared) shared.halfLifeH = h; else commit({ type: 'settings', patch: { halfLifeH: h } }); }
  function togglePregnant(on: boolean) {
    if (mode === 'shared') return;
    const patch: Partial<DiarySettings> = { pregnant: on };
    if (on && settings.halfLifeH < 8) { hlBeforePregnancy = settings.halfLifeH; patch.halfLifeH = 8; }
    if (!on && hlBeforePregnancy !== null) { patch.halfLifeH = hlBeforePregnancy; hlBeforePregnancy = null; }
    commit({ type: 'settings', patch });
  }

  // ── Saving: each edit is applied to the latest stored log (diary.ts applyOp) inside a browser
  // lock, so a second tab can neither overwrite nor resurrect drinks; clock ticks never write
  // (Astra, Wave A r3). When the browser refuses storage, the page says the diary isn't saved. ──
  let storageOk = $state(true);
  let hadStore = false;
  function readStore(): { store: DiaryStore | null; ok: boolean; source: 'v2' | 'v1' | null } {
    try {
      const v2 = parseStore(localStorage.getItem(STORE));
      if (v2) return { store: v2, ok: true, source: 'v2' };
      const v1 = migrateV1(JSON.parse(localStorage.getItem(STORE_V1) ?? 'null'), newId);
      return { store: v1, ok: true, source: v1 ? 'v1' : null };
    } catch { return { store: null, ok: false, source: null }; }
  }
  function adopt(st: DiaryStore) {
    log = st.drinks.filter((x) => intakeMg({ ...x, atMin: 0 } as Intake).ok);
    settings = { ...DEFAULT_SETTINGS, ...st.settings, bedMin: bedMinute(st.settings.bedMin ?? 1380) };
  }
  // Edits not yet written (storage refused) wait here and are replayed on top of the latest saved
  // log, so a later edit never drops an earlier unsaved one (Astra r4) and another tab's removals
  // aren't undone. Without readable storage, the last log we saw is the base.
  let pending: DiaryOp[] = [];
  let lastSeen: DiaryStore | null = null;
  function commit(op: DiaryOp) {
    pending.push(op);
    const run = () => {
      const { store, ok } = readStore();
      if (store) lastSeen = store;
      const base: DiaryStore = store ?? lastSeen ?? emptyStore();
      const now = Date.now();
      const next = pending.reduce((st, o) => applyOp(st, o, now), base);
      let wrote = false;
      if (ok) { try { localStorage.setItem(STORE, JSON.stringify(next)); wrote = true; } catch { /* quota or denial */ } }
      if (wrote) { pending = []; lastSeen = next; }
      storageOk = wrote;
      adopt(next);
    };
    const locks = typeof navigator !== 'undefined' ? (navigator as Navigator & { locks?: { request: (name: string, cb: () => void) => Promise<unknown> } }).locks : undefined;
    if (locks?.request) locks.request(STORE, run).catch(run); else run();
  }
  // Load your diary: the v2 log, or a v1 save migrated drink by drink and written once as v2.
  function loadOwn() {
    const { store, ok, source } = readStore();
    storageOk = ok;
    if (store) lastSeen = store;
    if (!store) return;
    adopt(store); hadStore = true;
    if (source === 'v1') commit({ type: 'settings', patch: {} });
  }
  function backToMine() { shared = null; mode = hadStore || log.length ? 'own' : 'example'; }
  // "Make this my day": the shared drinks replace today's in your log, placed by their clock times.
  function keepShared() {
    if (!shared) return;
    confirmAction = null;
    // Only the drinks come across: your own half-life, bedtime and pregnancy setting stay yours (Muse r3).
    const w = dayWindow(Date.now(), dayStartClock(settings));
    commit({ type: 'replaceDay', start: w.start, end: w.end, drinks: placeSharedDay(shared.intakes, w, newId) });
    shared = null; mode = 'own';
  }

  onMount(() => {
    loadOwn();
    nowMs = Date.now();
    const d = decodeDay(location.search);
    if (d.ok) {
      // A shared link is someone else's day: shown on its own, and the address bar is cleared.
      shared = { intakes: d.value.intakes, halfLifeH: d.value.halfLifeH, bedMin: d.value.bedMin };
      mode = 'shared';
      history.replaceState(history.state, '', location.pathname);
    } else if (hadStore) mode = 'own';
    const timer = setInterval(() => (nowMs = Date.now()), 30000);
    // Another tab saved: show its log here too.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORE) return;
      const { store } = readStore();
      if (!store) return;
      lastSeen = store;
      const now = Date.now();
      adopt(pending.reduce((st, o) => applyOp(st, o, now), store)); hadStore = true; if (mode === 'example') mode = 'own';
    };
    window.addEventListener('storage', onStorage);
    mounted = true;
    return () => { clearInterval(timer); window.removeEventListener('storage', onStorage); };
  });

  let copied = $state(false);
  // Builds a link only when asked. It never includes the pregnancy setting.
  async function share() {
    const intakes = mode === 'own' ? ownView.today.map((x, k) => ({ ...x, atMin: toDiaryMinutes(ownView.today, win)[k] })) : sorted;
    const url = `${location.origin}${location.pathname}?${encodeDay({ intakes, halfLifeH, bedMin })}`;
    try { await navigator.clipboard.writeText(url); copied = true; setTimeout(() => (copied = false), 2200); } catch { prompt('Copy this link:', url); }
  }

  // Only last night's drinks still counting: say so, rather than "No drinks yet" beside a curve (Muse r5).
  let carriedOnly = $derived(!sorted.length && mode === 'own' && ownView.carried.length > 0);
  let summary = $derived(sorted.length
    ? `Caffeine in your body across the day. Peak about ${rangeText(peak.min, peak.max)} mg near ${labelAt(peak.tMin)}; about ${rangeText(atBed.min, atBed.max)} mg left at ${clock12(bedMin)}.`
    : carriedOnly
      ? `Nothing logged today yet; earlier drinks still count${atNow ? `, about ${rangeText(atNow.min, atNow.max)} mg in you now` : ''}, and about ${rangeText(atBed.min, atBed.max)} mg left at ${clock12(bedMin)}.`
      : 'No drinks yet.');
</script>

<div class="cd">
  <div class="readouts">
    <div class="ro bed">
      <span class="lbl">{mode === 'shared' ? 'Left at their bedtime' : mode === 'example' ? 'Example: left at bedtime' : 'Left at bedtime'} · {clock12(bedMin)}</span>
      <span class="val">{rangeText(atBed.min, atBed.max)}<small>mg</small></span>
      <span class="sub">{bedCompare}{settings.pregnant && mode !== 'shared' ? ' Late in pregnancy caffeine can clear even more slowly than this.' : ''}</span>
    </div>
    <div class="ro">
      <span class="lbl">{mode === 'example' ? 'Example: in you now' : 'In you now'}</span>
      <span class="val small">{atNow ? rangeText(atNow.min, atNow.max) : '—'}<small>mg</small></span>
      <span class="sub">{atNow ? `at ${clock12(clockOf(nowMs))}` : mode === 'shared' ? 'not shown for a shared day' : `outside ${labelAt(FROM)} – ${labelAt(TO)}`}</span>
    </div>
    <div class="ro total" class:over={overDaily} class:might={mightExceed}>
      <span class="lbl">{mode === 'shared' ? 'Their total' : mode === 'example' ? 'Example total' : 'Today’s total'}</span>
      <span class="val small">{rangeText(total.min, total.max)}<small>mg</small></span>
      <div class="meter" aria-hidden="true">
        <span class="fill lo" style:width="{Math.min(100, (total.min / (guidance.mg * 1.5)) * 100)}%"></span>
        <span class="fill hi" style:width="{Math.min(100, (total.max / (guidance.mg * 1.5)) * 100)}%"></span>
        <span class="mark" style:left="{(1 / 1.5) * 100}%"></span>
      </div>
      <span class="sub">{settings.pregnant && mode !== 'shared' ? `ACOG: “moderate caffeine consumption (less than ${guidance.mg} mg per day)”; ask your clinician about your own case` : `${guidance.who} reference: ${guidance.mg} mg a day for most adults; a population guide, not a personal limit`}</span>
    </div>
  </div>

  <figure class="chart" bind:clientWidth={chartW}>
    <svg viewBox="0 0 {W} {H}" role="img" aria-label={summary}>
      <defs>
        <linearGradient id="cd-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c3873a" stop-opacity=".55" /><stop offset="1" stop-color="#c3873a" stop-opacity=".12" /></linearGradient>
      </defs>
      {#each yTicks as v (v)}
        <line x1={PADL} x2={W - PADR} y1={y(v)} y2={y(v)} class="grid" />
        <text x={PADL - 8} y={y(v) + 4} text-anchor="end" class="axis">{v}</text>
      {/each}
      {#each ticks as tk (tk)}
        <text x={x(tk)} y={BASE + 40} text-anchor="middle" class="axis">{labelAt(tk)}</text>
      {/each}
      <path d={band} fill="url(#cd-band)" />
      <path d={mid} fill="none" stroke="#2a1d15" stroke-width="1.6" />
      <!-- bedtime -->
      <line x1={x(bedAt)} x2={x(bedAt)} y1={TOP - 8} y2={BASE} class="bedline" />
      <circle cx={x(bedAt)} cy={TOP - 10} r="7" fill="#2a1d15" /><circle cx={x(bedAt) + 3} cy={TOP - 12} r="6" fill="#fbf8f3" />
      <text x={x(bedAt) - 12} y={TOP - 6} text-anchor="end" class="axis strong">bedtime</text>
      {#if nowAt !== null && nowAt >= FROM && nowAt <= TO}
        <line x1={x(nowAt)} x2={x(nowAt)} y1={TOP} y2={BASE} class="nowline" />
        <text x={x(nowAt) + 6} y={TOP + 12} class="axis">now</text>
      {/if}
      <!-- counter with cups -->
      <line x1={PADL} x2={W - PADR} y1={BASE} y2={BASE} stroke="#2a1d15" stroke-width="1.4" />
      {#each sorted as i, k (k)}
        <g transform="translate({x(i.atMin)} {BASE + 4})">
          {#if i.kind === 'espresso'}
            <path d="M-7 2 h14 l-2 9 q-1 3 -4 3 h-2 q-3 0 -4 -3 z" fill="#3b2214" stroke="#2a1d15" stroke-width="1.2" /><path d="M7 5 q5 0 4 4" fill="none" stroke="#2a1d15" stroke-width="1.2" />
          {:else}
            <path d="M-8 1 h16 v12 q0 4 -4 4 h-8 q-4 0 -4 -4 z" fill={i.kind === 'decaf' ? '#efe3cf' : '#7a4e30'} stroke="#2a1d15" stroke-width="1.2" /><path d="M8 4 q6 0 6 5 q0 4 -6 4" fill="none" stroke="#2a1d15" stroke-width="1.2" />
          {/if}
        </g>
      {/each}
    </svg>
    <figcaption>{summary} The band runs from a lighter estimate to a stronger one; the line is the middle. Illustrative: your body may clear caffeine faster or slower.</figcaption>
  </figure>

  <div class="cols">
    <section class="list" aria-label="Your drinks today">
      <h3>Your drinks today</h3>
      {#if mode === 'shared'}
        <div class="shared" role="status">
          <p>You're looking at a shared day. Your own diary on this device hasn't changed.</p>
          <div class="actions"><button type="button" class="ghost" onclick={backToMine}>Back to my day</button><button type="button" class="ghost" onclick={() => (ownView.today.length && !confirmAction ? (confirmAction = 'keep') : keepShared())}>{confirmAction === 'keep' ? `Replace my ${ownView.today.length} drink${ownView.today.length === 1 ? '' : 's'} today?` : 'Make this my day'}</button></div>
        </div>
      {/if}
      {#if !storageOk && mode !== 'shared'}<p class="example" role="status">This browser isn't letting the page save, so this diary lasts only while the tab is open.</p>{/if}
      {#if mode === 'example'}<p class="example">This is an example day. Add a drink to start your own; it stays on this device.</p>{/if}
      {#if sorted.length === 0}<p class="empty">Add your first coffee of the day.</p>{/if}
      <ul>
        {#each rows as row (row.key)}
          {@const i = row.i}
          {@const mg = intakeMg(i)}
          <li>
            <input type="time" value={hhmm(row.clock)} aria-label={`Time of ${describe(i)}`} disabled={mode === 'example'} onchange={(e) => retime(row.key, e.currentTarget as HTMLInputElement, row.clock)} />
            <span class="what">{describe(i)}</span>
            <span class="mg">{mg.ok ? rangeText(mg.value.min, mg.value.max) : '—'} mg<small class="basis">{i.kind === 'custom' ? 'label' : 'estimate'}</small></span>
            <button type="button" class="x" aria-label={`Remove ${describe(i)}`} onclick={() => remove(row.key)} disabled={mode === 'example'}>×</button>
          </li>
        {/each}
      </ul>
      {#if rowError}<p class="adderr" role="alert">{rowError}</p>{/if}
      {#if lastNight.length}
        <p class="carried">Earlier (up to two days back), still counted in the curve, most recent first:</p>
        <ul class="carried-list">
          {#each lastNight as x (x.id)}
            {@const mg = intakeMg({ ...x, atMin: 0 } as Intake)}
            <li><span class="t">{new Date(x.at).toLocaleDateString('en-US', { weekday: 'short' })} {clock12(clockOf(x.at))}</span><span class="what">{describe({ ...x, atMin: 0 } as Intake)}</span><span class="mg">{mg.ok ? rangeText(mg.value.min, mg.value.max) : '—'} mg</span><button type="button" class="x" aria-label={`Remove ${describe({ ...x, atMin: 0 } as Intake)}`} onclick={() => remove(x.id)}>×</button></li>
          {/each}
        </ul>
      {/if}
      <div class="actions">
        <button type="button" class="ghost" onclick={share}>{copied ? 'Link copied' : 'Share this day'}</button>
        {#if sorted.length}<button type="button" class="ghost" onclick={() => (mode === 'own' && confirmAction !== 'clear' ? (confirmAction = 'clear') : (clearDay(), (confirmAction = null)))}>{confirmAction === 'clear' ? `Remove all ${sorted.length} today?` : 'Clear'}</button>{/if}
      </div>
    </section>

    <section class="add" aria-label="Add a drink">
      <h3>Add a drink</h3>
      <div class="seg" role="group" aria-label="Kind of drink">
        <button type="button" aria-pressed={addKind === 'brewed'} onclick={() => (addKind = 'brewed')}>Brewed</button>
        <button type="button" aria-pressed={addKind === 'espresso'} onclick={() => (addKind = 'espresso')}>Espresso drinks</button>
        <button type="button" aria-pressed={addKind === 'decaf'} onclick={() => (addKind = 'decaf')}>Decaf</button>
        <button type="button" aria-pressed={addKind === 'custom'} onclick={() => (addKind = 'custom')}>I know the mg</button>
      </div>
      {#if addKind === 'brewed'}
        <label class="fld"><span class="lbl">Brewed in</span>
          <select bind:value={addMethod} onchange={() => { const sizes = addMethod === 'moka' ? MOKA_OZ : SIZES_OZ; if (!sizes.includes(addOz)) addOz = addMethod === 'moka' ? 3 : 12; }}>{#each BREWERS as b (b.id)}<option value={b.id}>{b.label}</option>{/each}</select>
        </label>
      {/if}
      {#if addKind === 'custom'}
        <label class="fld"><span class="lbl">Caffeine on the label (mg)</span><input type="number" min="0" max="1000" bind:value={addMg} /></label>
        <p class="note">For a canned drink or a chain's published figure. It counts exactly, not as an estimate.</p>
      {:else if addKind === 'espresso'}
        <div class="chips" role="group" aria-label="Espresso drink">
          {#each ESPRESSO_DRINKS as d (d.label)}<button type="button" aria-pressed={addEsp === d.label} onclick={() => { addEsp = d.label; addShots = d.shots; }}>{d.label}</button>{/each}
        </div>
      {:else}
        <div class="chips" role="group" aria-label="Cup size">
          {#each (addKind === 'brewed' && addMethod === 'moka' ? MOKA_OZ : SIZES_OZ) as oz (oz)}<button type="button" aria-pressed={addOz === oz} onclick={() => (addOz = oz)}>{oz} oz</button>{/each}
        </div>
        {#if addKind === 'brewed' && addMethod === 'moka'}<p class="note">Count the moka coffee itself, before any water or milk goes in; a small pot makes only a few ounces.</p>{/if}
        {#if addKind === 'brewed' && addMethod === 'cold-brew'}<p class="note">The size you drink, with the concentrate diluted one to one.</p>{/if}
      {/if}
      <div class="row">
        <label class="fld"><span class="lbl">At</span><input type="time" bind:value={addTime} /></label>
        <button type="button" class="go" onclick={add}>Add</button>
        {#if addError}<p class="adderr" role="alert">{addError}</p>{:else if addNote}<p class="addnote" role="status">{addNote}</p>{/if}
      </div>

      <h3 class="settings">You</h3>
      <div class="seg" role="group" aria-label="How fast you clear caffeine">
        {#each HALF_LIVES as hl (hl.h)}<button type="button" aria-pressed={halfLifeH === hl.h} onclick={() => setHalfLife(hl.h)}>{hl.label} ({hl.h} h)</button>{/each}{#if !HALF_LIVES.some((hl) => hl.h === halfLifeH)}<button type="button" aria-pressed="true">{halfLifeH} h (from the link)</button>{/if}
      </div>
      <p class="note">{HALF_LIVES.find((h) => h.h === halfLifeH)?.note}</p>
      <div class="row">
        <label class="fld"><span class="lbl">Bedtime</span>
          <select value={String(bedMin)} onchange={(e) => setBed(Number((e.currentTarget as HTMLSelectElement).value))}>
            {#each [20, 21, 22, 22.5, 23, 23.5, 24, 24.5, 25, 26] as h (h)}<option value={String(h * 60)}>{clock12(h * 60)}</option>{/each}
          </select>
        </label>
        {#if mode !== 'shared'}
          <label class="fld"><span class="lbl">My day starts</span>
            <select value={settings.dayStartMin === null ? 'auto' : String(settings.dayStartMin)} onchange={(e) => { const v = (e.currentTarget as HTMLSelectElement).value; commit({ type: 'settings', patch: { dayStartMin: v === 'auto' ? null : Number(v) } }); }}>
              <option value="auto">{clock12(newDayAt(settings.bedMin))} (4 h after going to bed)</option>
              {#each [3, 4, 5, 6, 7] as h (h)}<option value={String(h * 60)}>{clock12(h * 60)}</option>{/each}
            </select>
          </label>
        {/if}
        <label class="check"><input type="checkbox" checked={settings.pregnant} disabled={mode === 'shared'} onchange={(e) => togglePregnant((e.currentTarget as HTMLInputElement).checked)} /> Pregnant</label>
      </div>
      <p class="note">Drinks between midnight and {clock12(startClock)} count as last night's, before bed; from {clock12(startClock)} a new day starts. Earlier drinks still in your body count in the curve but not in today's total. The pregnancy setting stays on this device and never goes into a link.</p>
      <p class="note">{guidance.wording}</p>
    </section>
  </div>
</div>

<style>
  .cd {
    --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    --cf-display: 'Instrument Serif', Georgia, serif; --cf-sans: 'IBM Plex Sans', system-ui, sans-serif; --cf-mono: 'IBM Plex Mono', ui-monospace, monospace;
    background: var(--card); border: 1px solid var(--rule); border-radius: 18px; overflow: hidden; color: var(--ink);
    font: 16px/1.5 var(--cf-sans); box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35);
  }
  .readouts { display: grid; grid-template-columns: 1.3fr 1fr 1.2fr; border-bottom: 1px solid var(--rule); }
  .ro { padding: 20px 22px 16px; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .ro + .ro { border-left: 1px solid var(--rule); }
  .lbl { font: 500 11px/1 var(--cf-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  .val { font: 400 56px/1 var(--cf-mono); letter-spacing: -.03em; font-variant-numeric: tabular-nums; color: var(--ink); margin-top: 4px; }
  .val.small { font-size: 34px; }
  .val small { font-size: 16px; color: var(--ink-3); margin-left: 4px; letter-spacing: 0; }
  .bed .val { color: #4b2f1d; }
  .sub { font-size: 13px; color: var(--ink-3); }
  .meter { position: relative; height: 8px; border-radius: 4px; background: #ece3d6; margin: 6px 0 2px; overflow: hidden; }
  .fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 4px; }
  .fill.hi { background: rgba(195, 135, 58, .45); }
  .fill.lo { background: var(--crema); z-index: 1; }
  .mark { position: absolute; top: -2px; bottom: -2px; width: 2px; background: var(--ink); z-index: 2; }
  .total.over .val { color: #9a3b1c; }
  .total.might .val { color: #8f5d22; }
  .adderr { color: #9a3b1c; font-size: 14px; margin: 6px 0 0; width: 100%; }
  .addnote { color: #5b4a3d; font-size: 14px; margin: 6px 0 0; width: 100%; }

  .chart { margin: 0; padding: 14px 16px 8px; }
  .chart svg { width: 100%; height: auto; display: block; }
  .grid { stroke: #e6dccd; stroke-width: 1; }
  .axis { font: 400 12px var(--cf-mono); fill: var(--ink-3); }
  .axis.strong { fill: var(--ink); }
  .bedline { stroke: var(--ink); stroke-width: 1.2; stroke-dasharray: 4 4; }
  .nowline { stroke: var(--crema); stroke-width: 1.4; }
  figcaption { font-size: 13px; color: var(--ink-3); padding: 2px 6px 6px; }

  .cols { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--rule); }
  .cols > section { padding: 18px 22px 22px; min-width: 0; }
  .cols > section + section { border-left: 1px solid var(--rule); }
  h3 { font: 400 26px/1.1 var(--cf-display); margin: 0 0 12px; }
  h3.settings { margin-top: 22px; }
  ul { list-style: none; margin: 0; padding: 0; }
  li { display: grid; grid-template-columns: 136px 1fr auto 36px; gap: 10px; align-items: center; padding: 8px 0; border-bottom: 1px dashed var(--rule); }
  li .what { font-weight: 500; }
  li .mg { font: 400 14px var(--cf-mono); color: var(--crema-deep); white-space: nowrap; }
  input[type='time'], select { font: 400 14px var(--cf-mono); padding: 7px 8px; border: 1px solid var(--rule); border-radius: 8px; background: #fff; color: var(--ink); min-height: 38px; }
  .x { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; font-size: 18px; cursor: pointer; color: var(--ink-2); }
  .empty { color: var(--ink-3); }
  .example { margin: -4px 0 10px; font-size: 13.5px; color: var(--crema-deep); background: #fff8ec; border-radius: 8px; padding: 7px 10px; }
  input[type='number'] { font: 400 15px var(--cf-mono); padding: 7px 8px; border: 1px solid var(--rule); border-radius: 8px; background: #fff; min-height: 38px; width: 140px; }
  .seg, .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .seg button, .chips button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 7px 12px; min-height: 36px; font: 500 13px/1.1 var(--cf-sans); color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'], .chips button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .fld { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
  .row { display: flex; gap: 12px; align-items: flex-end; flex-wrap: wrap; }
  .check { display: flex; gap: 8px; align-items: center; margin-bottom: 18px; font-size: 14.5px; }
  .check input { width: 18px; height: 18px; }
  .go { appearance: none; border: 0; background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 11px 22px; font: 600 15px/1 var(--cf-sans); cursor: pointer; min-height: 44px; margin-bottom: 12px; }
  .ghost { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 10px 15px; font: 500 14px/1 var(--cf-sans); cursor: pointer; min-height: 42px; }
  .actions { display: flex; gap: 8px; margin-top: 14px; }
  .note { font-size: 13px; color: var(--ink-3); margin: 0 0 10px; }
  button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 820px) {
    .readouts { grid-template-columns: 1fr 1fr; }
    .ro.bed { grid-column: 1 / -1; border-bottom: 1px solid var(--rule); }
    .ro + .ro { border-left: 0; }
    .ro.total { border-left: 1px solid var(--rule); }
    .val { font-size: 46px; }
    .val.small { font-size: 28px; }
    .cols { grid-template-columns: 1fr; }
    .cols > section + section { border-left: 0; border-top: 1px solid var(--rule); }
    li { grid-template-columns: 128px 1fr auto 36px; }
    li .mg { grid-column: 2; grid-row: 2; }
    .chart { padding: 10px 4px 4px; }
  }
  .mg .basis { display: block; font: 400 10.5px/1.2 'IBM Plex Mono', monospace; letter-spacing: .06em; text-transform: uppercase; color: var(--ink-3, #75655a); }
  .shared { background: #eef4f5; border: 1px solid #c6dade; border-radius: 10px; padding: 10px 12px; margin: 0 0 10px; font-size: 14px; }
  .shared p { margin: 0 0 8px; }
  .carried { font-size: 13px; color: var(--ink-3, #75655a); margin: 10px 0 4px; }
  .carried-list { list-style: none; margin: 0 0 6px; padding: 0; display: grid; gap: 4px; }
  .carried-list li { display: grid; grid-template-columns: 62px 1fr auto 32px; gap: 8px; align-items: center; font-size: 14px; color: var(--ink-2, #5b4a3d); opacity: .85; }
  .carried-list .t { font: 400 13px 'IBM Plex Mono', monospace; }
</style>
