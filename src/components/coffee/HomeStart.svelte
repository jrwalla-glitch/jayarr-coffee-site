<script lang="ts">
  import { onMount } from 'svelte';
  import { buildRecipe, encodeBrew, flOzToMl, cToF, SYMPTOMS } from '../../lib/coffee/index.ts';
  import type { MethodId } from '../../lib/coffee/index.ts';
  import ToolMini from './art/ToolMini.svelte';
  import GalleryMini from './art/GalleryMini.svelte';

  // The homepage's first screen is a decision with a working preview. "Make a better cup" runs the
  // Brew Guide's own engine, so the numbers here are the numbers there, and the button carries the
  // choice across. The other doors lead straight into the tool for that job.
  type Door = 'make' | 'fix' | 'choose' | 'explore';
  const DOORS: { id: Door; label: string }[] = [
    { id: 'make', label: 'Make a better cup' },
    { id: 'fix', label: 'Fix today\'s coffee' },
    { id: 'choose', label: 'Choose equipment' },
    { id: 'explore', label: 'Explore flavor' },
  ];
  const BREWERS: { id: MethodId; label: string }[] = [
    { id: 'v60', label: 'V60' }, { id: 'chemex', label: 'Chemex' }, { id: 'french-press', label: 'French press' }, { id: 'aeropress', label: 'AeroPress' },
    { id: 'drip-machine', label: 'Drip machine' }, { id: 'cold-brew', label: 'Cold brew' }, { id: 'moka', label: 'Moka pot' }, { id: 'espresso', label: 'Espresso' },
  ];
  const CUPS = [8, 10, 12, 16];
  const FIX = ['sour', 'bitter', 'weak', 'strong', 'flat'];
  // What each taste usually points to, said as a likelihood: the Doctor asks before it decides.
  const LIKELY: Record<string, string> = {
    sour: 'Often under-extracted: the water didn\'t pull enough from the coffee. The usual suspects are a grind that\'s too coarse or a brew that ran too fast.',
    bitter: 'Often over-extracted: too much was pulled out. A grind that\'s too fine or a brew that ran too long are the usual suspects, though dark roasts are bitter by nature.',
    weak: 'Usually too little coffee for the water, before anything else. A stronger ratio is the first thing to try.',
    strong: 'Usually too much coffee for the water. A lighter ratio, or adding a little hot water, fixes it without touching the grind.',
    flat: 'Often stale beans or water with too few minerals, rather than the recipe.',
  };

  let door = $state<Door>('make');
  let method = $state<MethodId>('v60');
  let oz = $state(12);
  let symptom = $state('sour');
  let fixMethod = $state<'v60' | 'espresso'>('v60');

  let target = $derived(method === 'espresso' ? { doseG: 18 } : method === 'moka' ? { doseG: 15 } : { cupMl: flOzToMl(oz) });
  let res = $derived(buildRecipe({ method, target, strength: 'classic', roast: 'medium' }));
  let r = $derived(res.ok ? res.value : null);
  let href = $derived(`/tools/brew-ratio/?${encodeBrew({ method, target, strength: 'classic', roast: 'medium', units: 'us' })}`);
  const fmtG = (g: number) => { const v = Math.round(g * 10) / 10; return g >= 100 ? String(Math.round(g)) : Number.isInteger(v) ? String(v) : v.toFixed(1); };
  const sym = (id: string) => SYMPTOMS.find((s) => s.id === id)!;

  // ── The drawn row under the numbers: the cup at its size, the ratio as cells, the grind to scale ──
  let ratioN = $derived(r ? Math.round(r.ratio) : 16);
  let ratioText = $derived(r ? (Number.isInteger(Math.round(r.ratio * 10) / 10) ? String(Math.round(r.ratio)) : (Math.round(r.ratio * 10) / 10).toFixed(1)) : '16');
  let cells = $derived(Array.from({ length: ratioN + 1 }, (_, i) => ({ x: (i % 9) * 11, y: Math.floor(i / 9) * 11, coffee: i === 0 })));
  let cellRows = $derived(Math.ceil((ratioN + 1) / 9));
  // A mug's height grows with its size: 8 oz to 16 oz.
  let mugH = $derived(30 + 34 * Math.min(1, Math.max(0, (oz - 8) / 8)));
  // Grind: particles drawn to a 1 mm scale bar (40 units), at the middle of the recipe's range.
  let grindD = $derived(r ? ((r.grind.microns.min + r.grind.microns.max) / 2 / 1000) * 40 : 20);
  function particles(d: number) {
    const out: { x: number; y: number; pts: string }[] = [];
    const step = d * 1.35, cols = Math.max(1, Math.floor(84 / step)), rows = Math.max(1, Math.min(3, Math.floor(52 / step)));
    let k = 0;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols && out.length < 10; i++, k++) {
      const x = 50 - ((cols - 1) * step) / 2 + i * step + (j % 2 ? step * 0.25 : 0), y = 58 - d / 2 - j * step;
      const pts = Array.from({ length: 7 }, (_, q) => { const a = (q / 7) * Math.PI * 2, rr = (d / 2) * (0.78 + 0.3 * Math.abs(Math.sin(k * 3.7 + q * 1.9))); return `${(x + Math.cos(a) * rr).toFixed(1)},${(y + Math.sin(a) * rr).toFixed(1)}`; }).join(' ');
      out.push({ x, y, pts });
    }
    return out;
  }
  let grindShort = $derived(r ? r.grind.label.replace(/\s*\(.*\)$/, '') : '');

  // ── The Fix door's picture: a small extraction map, the taste marked, an arrow to the usual fix ──
  const MAP_AT: Record<string, [number, number]> = { sour: [86, 66], bitter: [234, 66], weak: [160, 118], strong: [160, 16], flat: [160, 66] };
  const MAP_FIX: Record<string, string> = { sour: 'grind finer?', bitter: 'grind coarser?', weak: 'more coffee?', strong: 'less coffee?', flat: 'check the beans and water' };

  onMount(() => {
    try { const d = sessionStorage.getItem('jayarr-home-door') as Door | null; if (d && DOORS.some((x) => x.id === d)) door = d; } catch { /* no storage */ }
  });
  function pick(d: Door) { door = d; try { sessionStorage.setItem('jayarr-home-door', d); } catch { /* no storage */ } }
</script>

<div class="hs">
  <div class="doors" role="tablist" aria-label="What are you here to do?">
    {#each DOORS as d (d.id)}
      <button type="button" role="tab" id="hs-tab-{d.id}" aria-selected={door === d.id} aria-controls="hs-panel" tabindex={door === d.id ? 0 : -1} onclick={() => pick(d.id)}
        onkeydown={(e) => { const i = DOORS.findIndex((x) => x.id === door); if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = DOORS[(i + (e.key === 'ArrowRight' ? 1 : DOORS.length - 1)) % DOORS.length].id; pick(n); document.getElementById(`hs-tab-${n}`)?.focus(); } }}>{d.label}</button>
    {/each}
  </div>

  <div class="panel" id="hs-panel" role="tabpanel" aria-labelledby="hs-tab-{door}">
    {#if door === 'make'}
      <p class="q">Your brewer</p>
      <div class="chips">
        {#each BREWERS as b (b.id)}<button type="button" class="chip" aria-pressed={method === b.id} onclick={() => (method = b.id)}>{b.label}</button>{/each}
      </div>
      {#if method !== 'espresso' && method !== 'moka'}
        <p class="q">Your mug</p>
        <div class="chips">
          {#each CUPS as c (c)}<button type="button" class="chip" aria-pressed={oz === c} onclick={() => (oz = c)}>{c} oz</button>{/each}
        </div>
      {/if}
      {#if r}
        <dl class="nums" aria-live="polite">
          <div><dt>Coffee</dt>{#if method === 'moka'}<dd class="coffee small">Fill the basket</dd>{:else}<dd class="coffee">{fmtG(r.doseG)}<small>g</small></dd>{/if}</div>
          {#if method === 'espresso'}
            <div><dt>In the cup</dt><dd>{Math.round(r.yieldG ?? 0)}<small>g</small></dd></div>
          {:else if method === 'moka'}
            <div><dt>Water</dt><dd class="water small">To the valve</dd></div>
          {:else}
            <div><dt>Water</dt><dd class="water">{Math.round(r.waterG ?? 0)}<small>g</small></dd></div>
          {/if}
          <div><dt>Water temp</dt><dd>{method === 'cold-brew' ? 'Cold' : method === 'moka' ? 'Boiled' : `${Math.round(cToF(r.tempC))}°F`}</dd></div>
        </dl>
        <div class="figs" aria-hidden="true">
          <figure>
            <svg viewBox="0 0 100 84">
              <line x1="6" x2="94" y1="80" y2="80" class="ground" />
              {#if method === 'espresso' || method === 'moka'}
                <path d="M34 62 H66 V70 a8 8 0 0 1 -8 8 H42 a8 8 0 0 1 -8 -8 Z" class="cup" /><path d="M66 64 h3 a4 4 0 0 1 0 8 h-3" class="line" />
                <rect x="35" y="63.5" width="30" height="4" class="crema" />
              {:else if method === 'cold-brew'}
                <rect x="32" y="22" width="36" height="56" rx="4" class="glass" /><rect x="34" y="34" width="32" height="42" rx="2" class="brew" /><rect x="30" y="16" width="40" height="7" rx="2" class="lid" />
              {:else}
                <path d="M{50 - 22} {78 - mugH} H{50 + 22} V{70} a8 8 0 0 1 -8 8 H{50 - 14} a8 8 0 0 1 -8 -8 Z" class="cup" />
                <path d="M{50 + 22} {78 - mugH + 8} h5 a8 8 0 0 1 0 16 h-5" class="line" />
                <path d="M{50 - 21} {78 - mugH * 0.84} H{50 + 21} V{70} a7 7 0 0 1 -7 7 H{50 - 14} a7 7 0 0 1 -7 -7 Z" class="brew" />
              {/if}
            </svg>
            <figcaption>{method === 'espresso' ? 'A double shot' : method === 'cold-brew' ? 'A jar of concentrate' : method === 'moka' ? 'One pot' : `A ${oz} oz mug`}</figcaption>
          </figure>
          <figure>
            <svg viewBox="0 0 100 84">
              <g transform="translate({50 - (Math.min(9, ratioN + 1) * 11 - 2) / 2} {78 - (cellRows * 11 - 2)})">
                {#each cells as c, i (i)}<rect x={c.x} y={c.y} width="9" height="9" rx="1.5" class={c.coffee ? 'cc' : 'cw'} />{/each}
              </g>
            </svg>
            <figcaption><b class="k-c">1</b> coffee to <b class="k-w">{ratioText}</b> {method === 'espresso' ? 'in the cup' : 'water'}</figcaption>
          </figure>
          <figure>
            <svg viewBox="0 0 100 84">
              {#each particles(grindD) as p, i (i)}<polygon points={p.pts} class="grain" />{/each}
              <line x1="30" x2="70" y1="76" y2="76" class="scale" /><line x1="30" x2="30" y1="73" y2="79" class="scale" /><line x1="70" x2="70" y1="73" y2="79" class="scale" />
              <text x="50" y="71" text-anchor="middle" class="mm">1 mm</text>
            </svg>
            <figcaption>{grindShort}, like {r.grind.texture}</figcaption>
          </figure>
        </div>
        <p class="note">{method === 'espresso' ? 'A double shot: 18 g in, 36 g out, in 25–30 seconds.' : method === 'cold-brew' ? 'A concentrate: dilute it about one to one to serve.' : method === 'moka' ? 'The pot sets the amounts: coffee level in the basket, water to just below the valve. The Brew Guide sizes it to your pot.' : 'At 1:16, the classic strength. The Brew Guide times every pour.'}</p>
      {/if}
      <a class="go" href={href}>Brew it step by step →</a>
    {:else if door === 'fix'}
      <p class="q">How does it taste?</p>
      <div class="chips">
        {#each FIX.filter((id) => fixMethod === 'espresso' ? sym(id).espresso : sym(id).filter) as id (id)}<button type="button" class="chip" aria-pressed={symptom === id} onclick={() => (symptom = id)}>{sym(id).label}</button>{/each}
      </div>
      <p class="q">Made with</p>
      <div class="chips">
        <button type="button" class="chip" aria-pressed={fixMethod === 'v60'} onclick={() => (fixMethod = 'v60')}>Filter or press</button>
        <button type="button" class="chip" aria-pressed={fixMethod === 'espresso'} onclick={() => { fixMethod = 'espresso'; if (!sym(symptom).espresso) symptom = 'sour'; }}>Espresso</button>
      </div>
      {@const [mx, my] = MAP_AT[symptom]}
      <svg class="xmap" viewBox="0 0 320 136" aria-hidden="true">
        <rect x="24" y="4" width="272" height="124" rx="6" class="field" />
        <rect x="128" y="44" width="64" height="44" rx="4" class="ideal" /><text x="160" y="70" text-anchor="middle" class="ax">balanced</text>
        <text x="30" y="70" class="ax">sour</text><text x="290" y="70" text-anchor="end" class="ax">bitter</text>
        <text x="160" y="16" text-anchor="middle" class="ax" opacity={symptom === 'strong' ? 0 : 1}>strong</text><text x="160" y="124" text-anchor="middle" class="ax" opacity={symptom === 'weak' ? 0 : 1}>weak</text>
        {#if symptom === 'flat'}
          <circle cx={mx} cy={my} r="26" class="ring" />
          <text x={mx + 34} y={my - 22} class="fixlab">{MAP_FIX[symptom]}</text>
        {:else}
          {@const vert = symptom === 'weak' || symptom === 'strong'}
          {@const tx = symptom === 'sour' ? 124 : symptom === 'bitter' ? 196 : 160}
          {@const ty = symptom === 'weak' ? 92 : symptom === 'strong' ? 40 : 66}
          <line x1={mx} y1={my} x2={tx} y2={ty} class="arrow" marker-end="url(#hs-arr)" />
          <text x={vert ? mx + 12 : mx} y={vert ? (my + ty) / 2 + 5 : my + 26} text-anchor={vert ? 'start' : 'middle'} class="fixlab">{MAP_FIX[symptom]}</text>
        {/if}
        <circle cx={mx} cy={my} r="7" class="mark" />
        <defs><marker id="hs-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L9 5 L0 9 Z" fill="#8f5d22" /></marker></defs>
      </svg>
      <p class="likely"><b>{sym(symptom).tagline}.</b> {LIKELY[symptom]}</p>
      <p class="note">Fix My Coffee asks two or three questions about your brew, then gives you one change to try and keeps everything else the same.</p>
      <a class="go" href="/tools/fix-my-coffee/?method={fixMethod}&symptom={symptom}">Find the one change →</a>
    {:else if door === 'choose'}
      <ul class="pick">
        <li><a href="/tools/espresso-machines/"><span class="pm"><ToolMini id="machines" /></span><span><b>An espresso machine</b><small>Matches for how you drink and what you'll spend, grinder included</small></span></a></li>
        <li><a href="/tools/nespresso-pods/"><span class="pm"><ToolMini id="pods" /></span><span><b>Nespresso pods</b><small>Every capsule your machine takes, Original or Vertuo</small></span></a></li>
        <li><a href="/deep-brew/calibrator/"><span class="pm"><ToolMini id="calibrator" /></span><span><b>Your grinder's setting</b><small>The number to set for your brewer, from the maker's guidance</small></span></a></li>
      </ul>
    {:else}
      <ul class="pick gallery">
        <li><a href="/explore/flavors/"><span class="pm"><GalleryMini id="flavors" names={false} /></span><span><b>The Flavor Bloom</b><small>Learn to taste a note, and how often roasters use it</small></span></a></li>
        <li><a href="/explore/origins/"><span class="pm"><GalleryMini id="origins" names={false} /></span><span><b>The Coffee Origins</b><small>Who's harvesting now, and how high it grows</small></span></a></li>
        <li><a href="/explore/methods/"><span class="pm"><GalleryMini id="methods" names={false} /></span><span><b>The Brewing Constellations</b><small>How thirteen brewers really differ</small></span></a></li>
      </ul>
    {/if}
  </div>
</div>

<style>
  .hs { --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema-deep: #8f5d22; background: #fbf8f3; color: var(--ink); border-radius: 18px; box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .55); overflow: hidden; font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif; }
  .doors { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid var(--rule); background: #f3ece1; }
  .doors button { appearance: none; border: 0; background: none; padding: 13px 10px 12px; font: 600 14.5px/1.25 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink-2); cursor: pointer; border-bottom: 3px solid transparent; }
  .doors button + button { border-left: 1px solid var(--rule); }
  .doors button[aria-selected='true'] { background: #fbf8f3; color: var(--ink); border-bottom-color: #c3873a; }
  .doors button:focus-visible { outline: 3px solid rgba(143, 93, 34, .6); outline-offset: -3px; }
  .panel { padding: 18px 20px 20px; min-height: 340px; }
  .q { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 8px; }
  .q:not(:first-child) { margin-top: 14px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink); border-radius: 999px; padding: 7px 13px; min-height: 38px; font: 500 14.5px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; cursor: pointer; }
  .chip[aria-pressed='true'] { background: var(--ink); border-color: var(--ink); color: #f3ede3; }
  .chip:hover { border-color: var(--ink-3); }
  .nums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 16px 0 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .nums div { padding: 9px 10px 9px 0; }
  .nums div + div { border-left: 1px solid var(--rule); padding-left: 10px; }
  .nums dt { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .nums dd { margin: 2px 0 0; font: 400 30px/1.05 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; }
  .nums dd small { font-size: 13px; margin-left: 2px; color: var(--ink-3); }
  .nums dd.small { font: 500 15px/1.25 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; padding-top: 6px; }
  .nums .coffee { color: #7a4e30; }
  .nums .water { color: #2f7484; }
  .note { font-size: 14px; color: var(--ink-2); margin: 6px 0 12px; text-wrap: pretty; }
  .figs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 10px 0 2px; }
  .figs figure { margin: 0; text-align: center; }
  .figs svg { display: block; width: 100%; max-width: 132px; height: auto; margin: 0 auto; }
  .figs figcaption { font: 500 12px/1.3 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-2); margin-top: 2px; text-wrap: balance; }
  .figs .ground { stroke: #cdbfac; stroke-width: 1.2; }
  .figs .cup, .figs .glass { fill: #fffdf9; stroke: var(--ink); stroke-width: 1.6; }
  .figs .line { fill: none; stroke: var(--ink); stroke-width: 1.6; }
  .figs .brew { fill: #6b4128; }
  .figs .crema { fill: #c3873a; }
  .figs .lid { fill: #c9b9a2; stroke: var(--ink); stroke-width: 1.2; }
  .figs .cc { fill: #7a4e30; }
  .figs .cw { fill: #7fb3bd; }
  .figs .grain { fill: #8a5a36; stroke: #4a2d1a; stroke-width: .6; }
  .figs .scale { stroke: var(--ink-3); stroke-width: 1; }
  .figs .mm { font: 500 8px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; fill: var(--ink-3); }
  .figs b { font-weight: 600; }
  .k-c { color: #7a4e30; } .k-w { color: #2f7484; }
  .xmap { display: block; width: 100%; max-width: 420px; height: auto; margin: 14px 0 0; }
  .xmap .field { fill: #f6efe4; stroke: var(--rule); }
  .xmap .ideal { fill: #e7efe0; stroke: #8aa070; stroke-dasharray: 3 3; }
  .xmap .ax { font: 500 10px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .06em; fill: var(--ink-3); }
  .xmap .mark { fill: #c3873a; stroke: var(--ink); stroke-width: 1.5; }
  .xmap .ring { fill: none; stroke: #c3873a; stroke-width: 1.5; stroke-dasharray: 4 3; }
  .xmap .arrow { stroke: #8f5d22; stroke-width: 2; }
  .xmap .fixlab { font: italic 400 15px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #6b3a12; paint-order: stroke; stroke: #f6efe4; stroke-width: 4px; }
  .likely { margin: 10px 0 6px; font-size: 15.5px; text-wrap: pretty; }
  .go { display: inline-block; background: var(--ink); color: #f3ede3; text-decoration: none; border-radius: 999px; padding: 11px 20px; font: 600 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; }
  .go:hover { background: #3b2a1f; }
  .pick { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .pick a { display: grid; grid-template-columns: 120px 1fr; gap: 14px; align-items: center; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 8px 12px 8px 8px; text-decoration: none; color: var(--ink); }
  .pick a:hover { border-color: var(--ink-3); background: #fffaf2; }
  .pm :global(svg) { display: block; width: 100%; height: auto; }
  .gallery .pm { border: 4px solid #2a2118; box-shadow: inset 0 0 0 1px rgba(214, 170, 92, .7); }
  .pick b { display: block; font: 400 23px/1.1 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; }
  .pick small { display: block; font-size: 14px; color: var(--ink-2); margin-top: 2px; }
  @media (max-width: 640px) {
    .doors { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .doors button:nth-child(3) { border-left: 0; }
    .doors button:nth-child(n + 3) { border-top: 1px solid var(--rule); }
    .panel { padding: 14px 14px 16px; min-height: 0; }
    .nums div + div { padding-left: 8px; }
    .nums dd { font-size: 24px; }
    .figs figcaption { font-size: 11px; }
    .pick a { grid-template-columns: 96px 1fr; }
    .pick b { font-size: 20px; }
  }
</style>
