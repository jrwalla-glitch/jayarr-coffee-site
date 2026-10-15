<script lang="ts">
  import { onMount } from 'svelte';
  import { METHODS, GUIDANCE, CAFFEINE, intakeMg, dayCurve, dailyTotal, inBodyAt, encodeDay, decodeDay, dayMinute, flOzToMl, mlToFlOz } from '../../lib/coffee/index.ts';
  import type { Intake, MethodId } from '../../lib/coffee/index.ts';

  const FROM = 6 * 60, TO = 26 * 60; // 6 am to 2 am
  const BREWERS = METHODS.filter((m) => m.id !== 'espresso');
  const SIZES_OZ = [6, 8, 12, 16, 20];
  const ESPRESSO_DRINKS = [
    { label: 'Single espresso', shots: 1 }, { label: 'Double espresso', shots: 2 },
    { label: 'Latte or cappuccino (double)', shots: 2 }, { label: 'Americano (double)', shots: 2 },
    { label: 'Triple shot', shots: 3 },
  ];
  const HALF_LIVES = [
    { h: 3, label: 'Faster', note: 'Smokers, for example, clear caffeine faster.' },
    { h: 5, label: 'Typical', note: 'The average adult half-life is about 5 hours (range about 1.5 to 10).' },
    { h: 8, label: 'Slower', note: 'Pregnancy and oral contraceptives slow it down; in late pregnancy it can be up to three times longer.' },
  ];

  let intakes = $state<Intake[]>([
    { kind: 'brewed', method: 'drip-machine', cupMl: flOzToMl(12), atMin: 7 * 60 + 30 },
    { kind: 'espresso', shots: 2, atMin: 14 * 60 },
  ]);
  let halfLifeH = $state(5);
  let bedMin = $state(23 * 60);
  let pregnant = $state(false);
  let nowMin = $state<number | null>(null);
  let mounted = $state(false);
  let example = $state(true);
  const STORE = 'jayarr-caffeine-day-v1';
  // The diary day starts at 6 am, so a 1 am coffee still belongs to yesterday's diary.
  const todayKey = () => { const d = new Date(Date.now() - 6 * 3600e3); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

  // add-drink form
  let addKind = $state<'brewed' | 'espresso' | 'decaf' | 'custom'>('brewed');
  let addMg = $state(150);
  let addMethod = $state<MethodId>('drip-machine');
  let addOz = $state(12);
  let addShots = $state(2);
  let addEsp = $state('Double espresso');
  let addTime = $state('09:00');

  // Diary minutes: the day runs 6 am to 6 am, so 00:30 after a late evening is 1470, not 30.
  const toMin = (hhmm: string) => { const [h, m] = hhmm.split(':').map(Number); return dayMinute(h * 60 + m); };
  const hhmm = (min: number) => { const m = ((min % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
  const clock12 = (min: number) => { const m = ((min % 1440) + 1440) % 1440; const h = Math.floor(m / 60), mm = m % 60; return `${((h + 11) % 12) + 1}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${h < 12 ? 'am' : 'pm'}`; };
  const r0 = (n: number) => Math.round(n);
  const rangeText = (lo: number, hi: number) => (r0(lo) === r0(hi) ? `${r0(lo)}` : `${r0(lo)}–${r0(hi)}`);

  // Keep each drink's index into `intakes`: $state proxies break identity checks (indexOf/===).
  let rows = $derived(intakes.map((i, idx) => ({ i, idx })).sort((a, b) => a.i.atMin - b.i.atMin));
  let sorted = $derived(rows.map((r) => r.i));
  let curve = $derived(dayCurve(sorted, FROM, TO, 5, halfLifeH));
  let total = $derived(dailyTotal(sorted));
  let atBed = $derived(inBodyAt(sorted, bedMin, halfLifeH));
  let atNow = $derived(nowMin !== null && nowMin >= FROM && nowMin <= TO ? inBodyAt(sorted, nowMin, halfLifeH) : null);
  let peak = $derived(curve.reduce((a, p) => (p.max > a.max ? p : a), { tMin: FROM, min: 0, max: 0 }));
  let guidance = $derived(pregnant ? GUIDANCE.find((g) => g.id === 'acog-pregnancy')! : GUIDANCE.find((g) => g.id === 'fda-adult-daily')!);
  let overDaily = $derived(total.max > guidance.mg);
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
  let ticks = $derived(narrow ? [FROM, FROM + 360, FROM + 720, FROM + 1080] : Array.from({ length: 11 }, (_, i) => FROM + i * 120));
  let yTicks = $derived(Array.from({ length: yMax / 50 + 1 }, (_, i) => i * 50).filter((v) => yMax <= 300 || v % 100 === 0));

  function describe(i: Intake) {
    if (i.kind === 'espresso') return i.shots === 1 ? 'Single espresso' : `${i.shots} espresso shots`;
    if (i.kind === 'custom') return 'Drink with a known amount';
    const oz = r0(mlToFlOz(i.cupMl ?? 0));
    if (i.kind === 'decaf') return `${oz} oz decaf`;
    return `${oz} oz ${METHODS.find((m) => m.id === i.method)?.label.toLowerCase() ?? 'coffee'}`;
  }
  function add() {
    const atMin = toMin(addTime);
    const i: Intake = addKind === 'custom' ? { kind: 'custom', mg: addMg, atMin }
      : addKind === 'espresso' ? { kind: 'espresso', shots: addShots, atMin }
      : addKind === 'decaf' ? { kind: 'decaf', cupMl: flOzToMl(addOz), atMin }
      : { kind: 'brewed', method: addMethod, cupMl: flOzToMl(addOz), atMin };
    if (!intakeMg(i).ok) return;
    if (example) { intakes = []; example = false; }
    intakes = [...intakes, i];
    addTime = hhmm(Math.min(22 * 60, atMin + 180));
  }
  function remove(idx: number) { intakes = intakes.filter((_, k) => k !== idx); }
  function retime(idx: number, v: string) { const t = toMin(v); if (Number.isFinite(t)) intakes = intakes.map((x, k) => (k === idx ? { ...x, atMin: t } : x)); }

  onMount(() => {
    // A shared link loads once and is then cleared from the address bar; your own diary lives on this device only.
    const d = decodeDay(location.search);
    if (d.ok) {
      intakes = d.value.intakes; halfLifeH = d.value.halfLifeH; bedMin = d.value.bedMin; example = false;
      history.replaceState(history.state, '', location.pathname);
    } else {
      try {
        const saved = JSON.parse(localStorage.getItem(STORE) ?? 'null');
        if (saved) {
          halfLifeH = saved.halfLifeH ?? 5; bedMin = dayMinute(saved.bedMin ?? 1380); pregnant = !!saved.pregnant;
          // Older saves stored after-midnight times as 0–359; move them to the end of the day.
          if (saved.day === todayKey() && Array.isArray(saved.intakes)) { intakes = saved.intakes.map((x: Intake) => ({ ...x, atMin: dayMinute(x.atMin) })).filter((x: Intake) => intakeMg(x).ok); example = false; }
          else { intakes = []; example = false; }
        }
      } catch { /* storage unavailable: keep the example day */ }
    }
    const n = new Date(); nowMin = dayMinute(n.getHours() * 60 + n.getMinutes());
    const timer = setInterval(() => { const d2 = new Date(); nowMin = dayMinute(d2.getHours() * 60 + d2.getMinutes()); }, 60000);
    mounted = true;
    return () => clearInterval(timer);
  });
  $effect(() => {
    const snapshot = JSON.stringify({ day: todayKey(), intakes, halfLifeH, bedMin, pregnant });
    if (!mounted || example) return;
    try { localStorage.setItem(STORE, snapshot); } catch { /* private mode: nothing saved */ }
  });
  let copied = $state(false);
  // Builds a link only when asked. It never includes the pregnancy setting.
  async function share() {
    const url = `${location.origin}${location.pathname}?${encodeDay({ intakes: sorted, halfLifeH, bedMin })}`;
    try { await navigator.clipboard.writeText(url); copied = true; setTimeout(() => (copied = false), 2200); } catch { prompt('Copy this link:', url); }
  }
  function clearDay() { intakes = []; example = false; }

  let summary = $derived(sorted.length
    ? `Caffeine in your body across the day. Peak about ${rangeText(peak.min, peak.max)} mg near ${clock12(peak.tMin)}; about ${rangeText(atBed.min, atBed.max)} mg left at ${clock12(bedMin)}.`
    : 'No drinks yet.');
</script>

<div class="cd">
  <div class="readouts">
    <div class="ro bed">
      <span class="lbl">Left at bedtime · {clock12(bedMin)}</span>
      <span class="val">{rangeText(atBed.min, atBed.max)}<small>mg</small></span>
      <span class="sub">{bedCompare}</span>
    </div>
    <div class="ro">
      <span class="lbl">In you now</span>
      <span class="val small">{atNow ? rangeText(atNow.min, atNow.max) : '—'}<small>mg</small></span>
      <span class="sub">{atNow ? `at ${clock12(nowMin ?? 0)}` : 'outside 6 am – 2 am'}</span>
    </div>
    <div class="ro total" class:over={overDaily}>
      <span class="lbl">Today’s total</span>
      <span class="val small">{rangeText(total.min, total.max)}<small>mg</small></span>
      <div class="meter" aria-hidden="true">
        <span class="fill lo" style:width="{Math.min(100, (total.min / (guidance.mg * 1.5)) * 100)}%"></span>
        <span class="fill hi" style:width="{Math.min(100, (total.max / (guidance.mg * 1.5)) * 100)}%"></span>
        <span class="mark" style:left="{(1 / 1.5) * 100}%"></span>
      </div>
      <span class="sub">{guidance.who} reference: {guidance.mg} mg a day{pregnant ? ' in pregnancy' : ' for healthy adults'}; a population guide, not a personal limit</span>
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
        <text x={x(tk)} y={BASE + 40} text-anchor="middle" class="axis">{clock12(tk)}</text>
      {/each}
      <path d={band} fill="url(#cd-band)" />
      <path d={mid} fill="none" stroke="#2a1d15" stroke-width="1.6" />
      <!-- bedtime -->
      <line x1={x(bedMin)} x2={x(bedMin)} y1={TOP - 8} y2={BASE} class="bedline" />
      <circle cx={x(bedMin)} cy={TOP - 10} r="7" fill="#2a1d15" /><circle cx={x(bedMin) + 3} cy={TOP - 12} r="6" fill="#fbf8f3" />
      <text x={x(bedMin) - 12} y={TOP - 6} text-anchor="end" class="axis strong">bedtime</text>
      {#if nowMin !== null && nowMin >= FROM && nowMin <= TO}
        <line x1={x(nowMin)} x2={x(nowMin)} y1={TOP} y2={BASE} class="nowline" />
        <text x={x(nowMin) + 6} y={TOP + 12} class="axis">now</text>
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
      {#if example}<p class="example">This is an example day. Add a drink to start your own; it stays on this device.</p>{/if}
      {#if sorted.length === 0}<p class="empty">Add your first coffee of the day.</p>{/if}
      <ul>
        {#each rows as row (row.idx)}
          {@const i = row.i}
          {@const mg = intakeMg(i)}
          <li>
            <input type="time" value={hhmm(i.atMin)} aria-label={`Time of ${describe(i)}`} onchange={(e) => retime(row.idx, (e.currentTarget as HTMLInputElement).value)} />
            <span class="what">{describe(i)}</span>
            <span class="mg">{mg.ok ? rangeText(mg.value.min, mg.value.max) : '—'} mg<small class="basis">{i.kind === 'custom' ? 'label' : 'estimate'}</small></span>
            <button type="button" class="x" aria-label={`Remove ${describe(i)}`} onclick={() => remove(row.idx)}>×</button>
          </li>
        {/each}
      </ul>
      <div class="actions">
        <button type="button" class="ghost" onclick={share}>{copied ? 'Link copied' : 'Share this day'}</button>
        {#if sorted.length}<button type="button" class="ghost" onclick={clearDay}>Clear</button>{/if}
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
          <select bind:value={addMethod}>{#each BREWERS as b (b.id)}<option value={b.id}>{b.label}</option>{/each}</select>
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
          {#each SIZES_OZ as oz (oz)}<button type="button" aria-pressed={addOz === oz} onclick={() => (addOz = oz)}>{oz} oz</button>{/each}
        </div>
      {/if}
      <div class="row">
        <label class="fld"><span class="lbl">At</span><input type="time" bind:value={addTime} /></label>
        <button type="button" class="go" onclick={add}>Add</button>
      </div>

      <h3 class="settings">You</h3>
      <div class="seg" role="group" aria-label="How fast you clear caffeine">
        {#each HALF_LIVES as hl (hl.h)}<button type="button" aria-pressed={halfLifeH === hl.h} onclick={() => (halfLifeH = hl.h)}>{hl.label} ({hl.h} h)</button>{/each}
      </div>
      <p class="note">{HALF_LIVES.find((h) => h.h === halfLifeH)?.note}</p>
      <div class="row">
        <label class="fld"><span class="lbl">Bedtime</span>
          <select value={String(bedMin)} onchange={(e) => (bedMin = Number((e.currentTarget as HTMLSelectElement).value))}>
            {#each [20, 21, 22, 22.5, 23, 23.5, 24, 25] as h (h)}<option value={String(h * 60)}>{clock12(h * 60)}</option>{/each}
          </select>
        </label>
        <label class="check"><input type="checkbox" bind:checked={pregnant} onchange={() => { if (pregnant && halfLifeH < 8) halfLifeH = 8; }} /> Pregnant</label>
      </div>
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
</style>
