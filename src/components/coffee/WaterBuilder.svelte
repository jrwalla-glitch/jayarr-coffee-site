<script lang="ts">
  import { onMount } from 'svelte';
  import { WATER_RECIPES, planWater, nearestRecipe, CONCENTRATE_G_PER_L } from '../../lib/coffee/index.ts';

  type Base = 'distilled' | 'tested' | 'unknown';
  let base = $state<Base>('distilled');
  let gh = $state(120);
  let kh = $state(80);
  let targetId = $state('rao');
  let espresso = $state(false);
  let gallons = $state(true);
  let volume = $state(1); // in gallons or litres per `gallons`
  let mounted = $state(false);

  let volumeL = $derived(gallons ? volume * 3.785 : volume);
  let plan = $derived(planWater({ targetId, volumeL, espresso, ...(base === 'tested' ? { base: { gh, kh } } : {}) }));
  let p = $derived(plan.ok ? plan.value : null);
  let shown = $derived(WATER_RECIPES.filter((r) => !espresso || r.espressoSafe));
  let perUnit = $derived(gallons ? 3.785 : 1);
  const fmt1 = (n: number) => (n < 10 ? n.toFixed(1) : Math.round(n).toString());

  // ── map: GH across, KH up ──
  const L = 46, R = 470, T = 16, B = 300, GMAX = 180, KMAX = 100;
  const mx = (v: number) => L + (Math.min(v, GMAX) / GMAX) * (R - L);
  const my = (v: number) => B - (Math.min(v, KMAX) / KMAX) * (B - T);
  // Label placement: flip left near the right edge; nudge the two recipes that sit close together.
  const NUDGE: Record<string, number> = { sca: -11, bh4: 15 };
  const lx = (gh: number) => (mx(gh) > R - 150 ? mx(gh) - 10 : mx(gh) + 10);
  const la = (gh: number) => (mx(gh) > R - 150 ? 'end' : 'start');

  $effect(() => { if (espresso && !WATER_RECIPES.find((r) => r.id === targetId)?.espressoSafe) targetId = 'rao'; });

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const t = q.get('target'); if (t && WATER_RECIPES.some((r) => r.id === t)) targetId = t;
    const g = Number(q.get('gh')), k = Number(q.get('kh'));
    if (q.has('gh') && q.has('kh') && Number.isFinite(g) && Number.isFinite(k)) { base = 'tested'; gh = g; kh = k; }
    espresso = q.get('espresso') === '1';
    if (q.get('units') === 'metric') { gallons = false; volume = 4; }
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams({ target: targetId });
    if (base === 'tested') { q.set('gh', String(gh)); q.set('kh', String(kh)); }
    if (espresso) q.set('espresso', '1');
    if (!gallons) q.set('units', 'metric');
    history.replaceState(history.state, '', `${location.pathname}?${q}`);
  });
</script>

<div class="wb">
  <figure class="stage">
    <svg viewBox="0 0 490 350" role="img" aria-label={`Water map: hardness across, alkalinity up. Target ${p?.target.name ?? ''}${base === 'tested' ? `; your water at GH ${gh}, KH ${kh}` : ''}.`}>
      <rect x={L} y={T} width={R - L} height={B - T} rx="8" fill="#f2f6f6" />
      <!-- GH:KH 2:1 and 3:1 guides (Gagné) -->
      <line x1={mx(0)} y1={my(0)} x2={mx(180)} y2={my(90)} class="guide" />
      <line x1={mx(0)} y1={my(0)} x2={mx(180)} y2={my(60)} class="guide" />
      <text x={mx(176)} y={my(90) - 6} text-anchor="end" class="gl">GH:KH 2:1</text>
      <text x={mx(176)} y={my(60) + 14} text-anchor="end" class="gl">3:1</text>
      {#each [0, 50, 100, 150] as v (v)}<text x={mx(v)} y={B + 18} text-anchor="middle" class="tk">{v}</text>{/each}
      {#each [0, 25, 50, 75, 100] as v (v)}<text x={L - 8} y={my(v) + 4} text-anchor="end" class="tk">{v}</text>{/each}
      <text x={(L + R) / 2} y={B + 38} text-anchor="middle" class="ax">hardness (GH, ppm) → brighter, more extraction</text>
      <text transform="translate(12 {(T + B) / 2}) rotate(-90)" text-anchor="middle" class="ax">alkalinity (KH) → rounder, flatter</text>
      {#each WATER_RECIPES as r (r.id)}
        <g class="lm" class:on={r.id === targetId} class:dim={espresso && !r.espressoSafe} role="button" tabindex="-1" onclick={() => { if (!espresso || r.espressoSafe) targetId = r.id; }} onkeydown={(e) => e.key === 'Enter' && (targetId = r.id)}>
          <circle cx={mx(r.gh)} cy={my(r.kh)} r={r.id === targetId ? 8 : 5} />
          <text x={lx(r.gh)} y={my(r.kh) + 4 + (NUDGE[r.id] ?? 0)} text-anchor={la(r.gh)} class="ln">{r.name}</text>
        </g>
      {/each}
      {#if base === 'tested' && p}
        <line x1={mx(gh)} y1={my(kh)} x2={mx(gh * p.baseShare)} y2={my(kh * p.baseShare)} class="path" />
        <line x1={mx(gh * p.baseShare)} y1={my(kh * p.baseShare)} x2={mx(p.gh)} y2={my(p.kh)} class="path add" />
        <g transform="translate({mx(gh)} {my(kh)})"><path d="M0 -14 C 7 -6, 7 0, 0 4 C -7 0, -7 -6, 0 -14 Z" fill="#3f8796" stroke="#2a1d15" stroke-width="1.2" /></g>
        <text x={lx(gh)} y={my(kh) - 10} text-anchor={la(gh)} class="ln strong">your water{gh > GMAX || kh > KMAX ? ' (off the chart)' : ''}</text>
      {/if}
    </svg>
    <figcaption>Hardness (calcium and magnesium) helps pull flavour out; alkalinity (bicarbonate) buffers acidity. Most good brewing water sits between the 2:1 and 3:1 lines.</figcaption>
  </figure>

  <div class="panel">
    <fieldset>
      <legend class="lbl">1 · Your starting water</legend>
      <div class="seg">
        <button type="button" aria-pressed={base === 'distilled'} onclick={() => (base = 'distilled')}>Distilled or RO</button>
        <button type="button" aria-pressed={base === 'tested'} onclick={() => (base = 'tested')}>I have test results</button>
        <button type="button" aria-pressed={base === 'unknown'} onclick={() => (base = 'unknown')}>I don't know my water</button>
      </div>
      {#if base === 'tested'}
        <div class="row">
          <label class="fld"><span>GH (ppm)</span><input type="number" min="0" max="1000" bind:value={gh} /></label>
          <label class="fld"><span>KH (ppm)</span><input type="number" min="0" max="1000" bind:value={kh} /></label>
        </div>
        <p class="note">Closest named water: {nearestRecipe(gh, kh).name}. Aquarium test kits read GH and KH in degrees (dGH, dKH); multiply by 17.9 for ppm.</p>
      {:else if base === 'unknown'}
        <p class="note">Your water utility publishes an annual water quality report with hardness and alkalinity; an aquarium GH/KH test kit costs a few dollars. Until then, start from distilled water: the recipe below works anywhere.</p>
      {/if}
    </fieldset>

    <fieldset>
      <legend class="lbl">2 · What you want</legend>
      <label class="check"><input type="checkbox" bind:checked={espresso} /> It's for an espresso machine</label>
      <div class="recipes">
        {#each shown as r (r.id)}
          <button type="button" aria-pressed={r.id === targetId} onclick={() => (targetId = r.id)}>
            <span class="rn">{r.name}</span><span class="rp">{r.profile}</span><span class="rv">GH {r.gh} · KH {r.kh}</span>
          </button>
        {/each}
      </div>
    </fieldset>

    <fieldset>
      <legend class="lbl">3 · How much to make</legend>
      <div class="row">
        <div class="seg">
          {#each (gallons ? [1, 2, 5] : [1, 4, 10]) as v (v)}<button type="button" aria-pressed={volume === v} onclick={() => (volume = v)}>{v} {gallons ? (v === 1 ? 'gallon' : 'gallons') : 'L'}</button>{/each}
        </div>
        <div class="seg">
          <button type="button" aria-pressed={gallons} onclick={() => { gallons = true; volume = 1; }}>US</button>
          <button type="button" aria-pressed={!gallons} onclick={() => { gallons = false; volume = 4; }}>Metric</button>
        </div>
      </div>
    </fieldset>

    {#if p}
      <div class="result" aria-live="polite">
        <p class="kick">Your recipe: {p.target.name}</p>
        <ol>
          <li><b>Make two concentrates once</b> (they keep for months): <span class="mono">{CONCENTRATE_G_PER_L.gh} g</span> Epsom salt in 1 L of distilled water (bottle A, hardness), and <span class="mono">{CONCENTRATE_G_PER_L.kh} g</span> baking soda in another litre (bottle B, buffer).</li>
          <li><b>For {volume} {gallons ? (volume === 1 ? 'gallon' : 'gallons') : 'L'}:</b>
            {#if p.baseShare > 0 && base === 'tested'}<span class="mono">{fmt1(p.baseShare * volumeL / perUnit)} {gallons ? 'gal' : 'L'}</span> of your water, then {/if}
            {#if p.ghMlPerL > 0}<span class="mono a">{fmt1(p.ghMlPerL * volumeL)} mL</span> of bottle A{/if}{#if p.ghMlPerL > 0 && p.khMlPerL > 0}{' '}and{' '}{/if}{#if p.khMlPerL > 0}<span class="mono b">{fmt1(p.khMlPerL * volumeL)} mL</span> of bottle B{/if}{#if p.ghMlPerL === 0 && p.khMlPerL === 0}nothing extra{/if}, topped up with distilled water.{#if p.khMlPerL === 0 && p.ghMlPerL > 0}{' '}No bottle B needed: your water brings enough alkalinity.{/if}</li>
        </ol>
        <p class="direct">Or dissolve directly: <span class="mono">{p.epsomG.toFixed(2)} g</span> Epsom salt and <span class="mono">{p.bicarbG.toFixed(2)} g</span> baking soda in the batch (needs a 0.01 g scale).</p>
        <p class="out">Result: GH {Math.round(p.gh)} · KH {Math.round(p.kh)} ppm. {p.target.bestFor}.</p>
        {#each p.notes as n (n)}<p class="note">{n}</p>{/each}
      </div>
    {:else if !plan.ok}
      <p class="err">{plan.errors[0].message}</p>
    {/if}
  </div>
</div>

<style>
  .wb { --rule: #d9cdbd; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --crema-deep: #8f5d22; --water: #2f7484;
    display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); background: #fbf8f3; border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .stage { margin: 0; padding: 18px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #eef2f1 85%); }
  .stage svg { width: 100%; height: auto; display: block; }
  .guide { stroke: #2f7484; stroke-opacity: .35; stroke-dasharray: 5 5; }
  .gl { font: 400 11px 'IBM Plex Mono', monospace; fill: #2f7484; }
  .tk { font: 400 11px 'IBM Plex Mono', monospace; fill: var(--ink-3); }
  .ax { font: 500 11px 'IBM Plex Mono', monospace; fill: var(--ink-2); letter-spacing: .04em; }
  .lm { cursor: pointer; }
  .lm circle { fill: #fff; stroke: #2a1d15; stroke-width: 1.5; transition: r .2s; }
  .lm.on circle { fill: #8f5d22; }
  .lm.dim { opacity: .35; cursor: default; }
  .ln { font: 400 12px 'IBM Plex Sans', sans-serif; fill: var(--ink-2); }
  .lm.on .ln, .ln.strong { fill: var(--ink); font-weight: 600; }
  .path { stroke: #2f7484; stroke-width: 2; stroke-dasharray: 4 4; }
  .path.add { stroke: #8f5d22; }
  figcaption { font-size: 13px; color: var(--ink-3); padding: 4px 6px 0; }
  .panel { padding: 20px 24px 24px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 9px; padding: 0; }
  .seg { display: flex; flex-wrap: wrap; gap: 6px; }
  .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 38px; font: 500 13.5px/1 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .row { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px; align-items: flex-end; }
  .fld { display: flex; flex-direction: column; gap: 5px; font: 500 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .fld input { font: 400 16px 'IBM Plex Mono', monospace; width: 110px; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 8px; background: #fff; min-height: 42px; }
  .check { display: flex; gap: 8px; align-items: center; font-size: 14.5px; margin-bottom: 10px; }
  .check input { width: 18px; height: 18px; }
  .recipes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .recipes button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 10px; padding: 8px 10px; text-align: left; cursor: pointer; display: grid; gap: 1px; color: var(--ink); }
  .recipes button[aria-pressed='true'] { border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink) inset; background: #fffdf8; }
  .rn { font-weight: 600; font-size: 14px; }
  .rp { font-size: 12.5px; color: var(--ink-3); }
  .rv { font: 400 12px 'IBM Plex Mono', monospace; color: var(--water); }
  .result { border-top: 1px solid var(--rule); padding-top: 12px; }
  .kick { font: 400 26px/1.1 'Instrument Serif', Georgia, serif; margin: 0 0 8px; }
  .result ol { margin: 0; padding-left: 20px; display: grid; gap: 8px; }
  .mono { font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
  .mono.a { color: var(--crema-deep); }
  .mono.b { color: var(--water); }
  .direct, .out { font-size: 14.5px; color: var(--ink-2); margin: 10px 0 0; }
  .note { font-size: 13.5px; color: var(--ink-3); margin: 8px 0 0; }
  .err { color: #9a3b1c; }
  button:focus-visible, input:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 860px) { .wb { grid-template-columns: 1fr; } .stage { border-right: 0; border-bottom: 1px solid var(--rule); } .panel { padding: 18px 16px 20px; } .recipes { grid-template-columns: 1fr; } }
</style>
