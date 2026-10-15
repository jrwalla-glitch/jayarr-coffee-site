<script lang="ts">
  import { onMount } from 'svelte';
  import { freshness, isRealDate } from '../../lib/coffee/index.ts';
  import type { FreshUse, Storage, StageId } from '../../lib/coffee/index.ts';

  const isoLocal = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  let today = $state(isoLocal(new Date()));
  // Calendar days back, not 24-hour blocks, so a daylight-saving night can't shift the default.
  const daysAgo = (n: number) => { const d = new Date(); return isoLocal(new Date(d.getFullYear(), d.getMonth(), d.getDate() - n)); };
  let roastDate = $state(daysAgo(10));
  let dateInvalid = $state(false);
  let linkProblem = $state(false);
  // The link's own impossible date, named in the note, since a date box can't show it (Muse r4).
  let badLinkDate = $state('');
  // First visit: the bag shown is an example until the reader enters theirs (Opus r4).
  let example = $state(false);
  let use = $state<FreshUse>('filter');
  let storage = $state<Storage>('opened');
  let frozenOn = $state(daysAgo(3));
  let thawed = $state(false);
  let thawedOn = $state(isoLocal(new Date()));
  let mounted = $state(false);

  let result = $derived(freshness({ roastDate, today, use, storage, ...(storage === 'frozen' ? { frozenOn, ...(thawed ? { thawedOn } : {}) } : {}) }));
  let r = $derived(result.ok ? result.value : null);

  // ── timeline ──
  // Drawn at the container's real width so labels stay legible on phones.
  let boxW = $state(1000);
  let W = $derived(Math.max(320, Math.min(1100, boxW)));
  const L = 20, TOP = 70, BASE = 210, DAYS = 60;
  let R = $derived(W - 20);
  let x = $derived((d: number) => L + (Math.min(d, DAYS) / DAYS) * (R - L));
  const FILL: Record<StageId, string> = { resting: '#d6e7ea', opening: '#f3e3c6', peak: '#e7c08a', good: '#f1dcbb', fading: '#e6dacb', stale: '#ddd6cc' };
  // Illustrative curves: CO2 leaving the beans, and aroma (rising after the rest, then fading).
  const co2 = (d: number) => Math.exp(-d / 6);
  const aroma = (d: number) => (1 - Math.exp(-d / 3)) * Math.exp(-Math.max(0, d - 14) / 30);
  const y = (v: number) => BASE - v * (BASE - TOP);
  let path = $derived((f: (d: number) => number) => Array.from({ length: 121 }, (_, i) => i / 2).map((d, i) => `${i ? 'L' : 'M'}${x(d)} ${y(f(d))}`).join(' '));
  let CO2_PATH = $derived(path(co2));
  let AROMA_PATH = $derived(path(aroma));
  let ticks = $derived(W < 600 ? [0, 7, 21, 30, 60] : [0, 7, 14, 21, 30, 45, 60]);
  let here = $derived(r ? Math.max(0, r.effectiveDays) : 0);
  // Dates outside this year carry the year, so a past window can't read as an upcoming one (blind Opus r2).
  let fmt = (s: string) => { const d = new Date(s + 'T12:00:00'); return d.toLocaleDateString(undefined, d.getFullYear() === new Date(today + 'T12:00:00').getFullYear() ? { month: 'short', day: 'numeric' } : { month: 'short', day: 'numeric', year: 'numeric' }); };

  // Your last bag stays on this device, so a plain reload brings it back (Muse r3); a link wins.
  const SAVE_KEY = 'jayarr-freshness-v1';
  // Opened from someone's link: it doesn't replace your own saved bag until you change something (Muse r4).
  let skipSave = false;
  onMount(() => {
    let q = new URLSearchParams(location.search);
    const fromLink = !!location.search;
    if (!fromLink) { try { const last = localStorage.getItem(SAVE_KEY); if (last) q = new URLSearchParams(last); else example = true; } catch { example = true; } }
    const rd = q.get('roast'); if (rd && isRealDate(rd)) roastDate = rd; else if (rd !== null && fromLink) { linkProblem = true; example = true; badLinkDate = /^\d{4}-\d{2}-\d{2}$/.test(rd) ? rd : ''; }
    if (q.get('use') === 'espresso') use = 'espresso';
    const s = q.get('storage'); if (s === 'sealed-bag' || s === 'opened' || s === 'frozen') storage = s;
    const f = q.get('frozen'); if (f && isRealDate(f)) frozenOn = f;
    const th = q.get('thawed'); if (th && isRealDate(th)) { thawed = true; thawedOn = th; }
    skipSave = fromLink;
    mounted = true;
    // "Today" moves on in an open tab, so a bag roasted today can be picked after midnight (Opus r3).
    const tick = setInterval(() => { const t = isoLocal(new Date()); if (t !== today) today = t; }, 60000);
    return () => clearInterval(tick);
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams({ roast: roastDate });
    if (use !== 'filter') q.set('use', use);
    if (storage !== 'opened') q.set('storage', storage);
    if (storage === 'frozen') q.set('frozen', frozenOn);
    if (storage === 'frozen' && thawed) q.set('thawed', thawedOn);
    // The example bag isn't the reader's: the address stays bare and nothing is saved. A half-typed or
    // impossible date isn't written into the address either, so a reshare never carries it (blind Opus r5).
    if (example) { history.replaceState(history.state, '', location.pathname); return; }
    if (!result.ok) return;
    history.replaceState(history.state, '', `${location.pathname}?${q}`);
    if (skipSave) { skipSave = false; return; }
    // Only a bag that makes sense is kept, so a half-typed date can't come back as "that link's date" (Opus r4).
    if (result.ok) try { localStorage.setItem(SAVE_KEY, q.toString()); } catch { /* storage unavailable */ }
  });
</script>

<div class="fr">
  <div class="top">
    <div class="inputs">
      <label class="fld"><span class="lbl">Roasted on</span><input type="date" bind:value={roastDate} max={today} oninput={(e) => { dateInvalid = (e.currentTarget as HTMLInputElement).validity.badInput; example = false; linkProblem = false; }} /></label>
      <div class="fld"><span class="lbl">Brewing</span>
        <div class="seg" role="group" aria-label="Brewing">
          <button type="button" aria-pressed={use === 'filter'} onclick={() => (use = 'filter')}>Filter</button>
          <button type="button" aria-pressed={use === 'espresso'} onclick={() => (use = 'espresso')}>Espresso</button>
        </div>
      </div>
      <div class="fld"><span class="lbl">Stored</span>
        <div class="seg" role="group" aria-label="Storage">
          <button type="button" aria-pressed={storage === 'sealed-bag'} onclick={() => (storage = 'sealed-bag')}>Sealed bag</button>
          <button type="button" aria-pressed={storage === 'opened'} onclick={() => (storage = 'opened')}>Opened</button>
          <button type="button" aria-pressed={storage === 'frozen'} onclick={() => { storage = 'frozen'; if (frozenOn < roastDate) frozenOn = roastDate; }}>Frozen</button>
        </div>
      </div>
      {#if storage === 'frozen'}
        <label class="fld"><span class="lbl">Frozen on</span><input type="date" bind:value={frozenOn} min={roastDate} max={today} /></label>
        <div class="fld"><span class="lbl">Out of the freezer?</span>
          <label class="check"><input type="checkbox" bind:checked={thawed} /> Taken out</label>
          {#if thawed}<input type="date" aria-label="Taken out on" bind:value={thawedOn} min={frozenOn} max={today} />{/if}
        </div>
      {/if}
    </div>
    <div class="read" aria-live="polite">
      {#if r}
        <span class="lbl">{example ? 'Example bag · ' : ''}Day {r.daysSinceRoast}{r.effectiveDays !== r.daysSinceRoast ? ` (${r.effectiveDays} counting)` : ''}</span>
        <span class="stage">{r.stage.label}</span>
        <span class="sub">{r.peakTo < today ? `Its usual best window has passed (${fmt(r.peakFrom)} – ${fmt(r.peakTo)})` : `${storage === 'frozen' && !thawed ? 'If taken out today: usually' : 'Usually'} best ${fmt(r.peakFrom)} – ${fmt(r.peakTo)} · best used by about ${fmt(r.useBy)}`}</span>
        {#if example}<span class="sub ex">Enter the roast date from your bag.</span>{/if}
      {:else if dateInvalid}
        <span class="err">Enter a complete, real date: check the day, month and year on the bag.</span>
      {:else if !result.ok}
        <span class="err">{result.errors[0].message}</span>
      {/if}
    </div>
  </div>

  <figure class="tl" bind:clientWidth={boxW}>
    <svg viewBox="0 0 {W} 300" role="img" aria-label={r ? `Freshness timeline: day ${r.daysSinceRoast}, ${r.stage.label}. Peak from ${fmt(r.peakFrom)} to ${fmt(r.peakTo)}.` : 'Freshness timeline'}>
      {#if r}
        {#each r.stages as s (s.id)}
          <rect x={x(s.from)} y={TOP} width={x(Math.min(s.to, DAYS)) - x(s.from)} height={BASE - TOP} fill={FILL[s.id]} />
          {#if s.from < DAYS && x(Math.min(s.to, DAYS)) - x(s.from) > 64}<text x={(x(s.from) + x(Math.min(s.to, DAYS))) / 2} y={BASE + 22} text-anchor="middle" class="band" class:on={s.id === r.stage.id}>{s.short}</text>{/if}
        {/each}
      {/if}
      <path d={CO2_PATH} fill="none" stroke="#3f8796" stroke-width="2" stroke-dasharray="5 4" />
      <path d={AROMA_PATH} fill="none" stroke="#2a1d15" stroke-width="2.2" />
      <text x={x(1.2)} y={y(co2(1.2)) - 8} class="curve teal">CO₂ in the beans</text>
      <text x={x(26)} y={y(aroma(26)) - 10} class="curve">aroma</text>
      {#each ticks as d (d)}
        <line x1={x(d)} x2={x(d)} y1={BASE} y2={BASE + 6} stroke="#2a1d15" />
        <text x={x(d)} y={BASE + 44} text-anchor="middle" class="tick">{d === 60 ? '60+' : d === 0 ? 'roast' : `day ${d}`}</text>
      {/each}
      <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="#2a1d15" stroke-width="1.4" />
      {#if r}
        <g class="here" style:transform="translate({x(here)}px, 0)">
          <line x1="0" x2="0" y1={TOP - 4} y2={BASE} stroke="#2a1d15" stroke-width="1.6" />
          <!-- bean bag with a one-way valve; puffs while it's still degassing -->
          <g transform="translate(-17 {TOP - 58})">
            <path d="M4 10 Q2 4 8 2 L26 2 Q32 4 30 10 L32 48 Q32 52 28 52 L6 52 Q2 52 2 48 Z" fill="#b48a5c" stroke="#2a1d15" stroke-width="1.6" />
            <rect x="4" y="2" width="26" height="6" fill="#8a6440" stroke="#2a1d15" stroke-width="1.2" />
            <circle cx="17" cy="20" r="4" fill="#efe3cf" stroke="#2a1d15" stroke-width="1.2" />
            {#if r.stage.id === 'resting' || r.stage.id === 'opening'}
              <circle cx="21" cy="12" r="2" fill="#3f8796" class="puff p1" /><circle cx="24" cy="6" r="1.6" fill="#3f8796" class="puff p2" />
            {/if}
          </g>
        </g>
      {/if}
    </svg>
    <figcaption>The curves are illustrative: CO₂ leaves the beans quickly at first; aroma rises as the coffee rests, peaks, then fades. Days in the freezer are left out.</figcaption>
  </figure>

  {#if r}
    <div class="advice">
      {#if linkProblem}<p class="note">{badLinkDate ? `That link's roast date, ${badLinkDate}, doesn't exist, so here's an example bag.` : 'That link\'s roast date wasn\'t a date, so here\'s an example bag.'}</p>{/if}
      <p class="what">{storage === 'frozen' && !thawed ? (r.freezerCapped ? `The freezer pauses the clock for about a year; past that it runs again, so these beans are at day ${r.effectiveDays}. Take out only what you'll use.` : `While they're in the freezer the clock is paused at day ${r.effectiveDays}. Take out only what you'll use; from then, the usual stages apply.`) : r.stage.advice}</p>
      {#each r.notes.filter((n) => !(r.freezerCapped && storage === 'frozen' && !thawed && n.startsWith('After about a year'))) as n (n)}<p class="note">{n}</p>{/each}
      <p class="note">{r.uncertainty}</p>
      {#if r.stage.id === 'fading' || r.stage.id === 'stale'}<p class="note">Tasting flat? The <a href="/tools/fix-my-coffee/?method=v60&symptom=flat">Coffee Doctor</a> can tell freshness from water problems.</p>{/if}
    </div>
  {/if}
</div>

<style>
  .fr { --rule: #d9cdbd; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --crema-deep: #8f5d22;
    background: #fbf8f3; border: 1px solid var(--rule); border-radius: 18px; overflow: hidden; color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .top { display: grid; grid-template-columns: 1.4fr 1fr; border-bottom: 1px solid var(--rule); }
  .inputs { padding: 20px 22px; display: flex; flex-wrap: wrap; gap: 16px 22px; align-items: flex-end; }
  .read { padding: 20px 22px; border-left: 1px solid var(--rule); display: flex; flex-direction: column; gap: 4px; justify-content: center; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; }
  .fld { display: flex; flex-direction: column; gap: 8px; }
  .stage { font: 400 52px/1 'Instrument Serif', Georgia, serif; }
  .sub { font: 400 14px 'IBM Plex Mono', monospace; color: var(--ink-2); }
  .sub.ex { color: #8f5d22; }
  .err { color: #9a3b1c; }
  input[type='date'] { font: 400 15px 'IBM Plex Mono', monospace; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 8px; background: #fff; color: var(--ink); min-height: 42px; }
  .seg { display: flex; flex-wrap: wrap; gap: 4px; }
  .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px/1 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .tl { margin: 0; padding: 14px 16px 6px; }
  .tl svg { width: 100%; height: auto; display: block; }
  .band { font: 500 12px 'IBM Plex Mono', monospace; fill: var(--ink-3); text-transform: uppercase; letter-spacing: .06em; }
  .band.on { fill: var(--ink); font-weight: 600; }
  .tick { font: 400 12px 'IBM Plex Mono', monospace; fill: var(--ink-3); }
  .curve { font: 400 14px 'Instrument Serif', Georgia, serif; fill: var(--ink); }
  .curve.teal { fill: #2f7484; }
  .here { transition: transform .5s cubic-bezier(.2, .7, .2, 1); }
  .puff { animation: puff 2.4s ease-out infinite; }
  .p2 { animation-delay: 1.2s; }
  @keyframes puff { 0% { opacity: 0; transform: translateY(4px); } 30% { opacity: .9; } 100% { opacity: 0; transform: translateY(-10px); } }
  figcaption { font-size: 13px; color: var(--ink-3); padding: 0 6px 6px; }
  .advice { border-top: 1px solid var(--rule); padding: 16px 22px 20px; }
  .advice .what { font: 400 24px/1.25 'Instrument Serif', Georgia, serif; margin: 0 0 6px; }
  .note { margin: 4px 0 0; font-size: 14.5px; color: var(--ink-2); }
  .note a { color: #7a4e30; }
  button:focus-visible, input:focus-visible, a:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 760px) { .top { grid-template-columns: 1fr; } .read { border-left: 0; border-top: 1px solid var(--rule); } .stage { font-size: 42px; } .band { font-size: 11px; } }
  @media (prefers-reduced-motion: reduce) { .here { transition: none; } .puff { animation: none; opacity: .8; } }
  .check { display: flex; gap: 8px; align-items: center; font-size: 14.5px; min-height: 38px; }
  .check input { width: 18px; height: 18px; }
</style>
