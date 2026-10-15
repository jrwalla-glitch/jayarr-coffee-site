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
  let linkProblem = $state(false);

  let volumeL = $derived(gallons ? volume * 3.785 : volume);
  let plan = $derived(planWater({ targetId, volumeL, espresso, ...(base === 'tested' ? { base: { gh, kh } } : {}) }));
  let p = $derived(plan.ok ? plan.value : null);
  let share = $derived(p ? p.baseL / p.finalL : 0);
  const unitName = (v: number) => (gallons ? (v === 1 ? 'gallon' : 'gallons') : 'L');
  const fmt2 = (n: number) => (n < 10 ? String(Math.round(n * 100) / 100) : fmt1(n));
  const vol = (litres: number) => (gallons ? (litres < 3.785 ? `${Math.round(litres * 33.814)} fl oz` : `${fmt2(litres / 3.785)} gal`) : litres < 1 ? `${Math.round(litres * 1000)} mL` : `${fmt2(litres)} L`);
  // Under a gallon, US jugs are marked in ounces.
  const line = $derived(gallons && volume < 1 ? `${Math.round(volume * 128)} fl oz line` : `${volume} ${unitName(volume)} line`);
  // Stocks first, then your water, then distilled to the line; when no distilled is needed, fill with your own water instead.
  let steps = $derived.by(() => {
    if (!p) return [];
    const out: { key: string; html: string; fill?: boolean }[] = [];
    if (p.ghStockMl > 0) out.push({ key: 'a', html: `Add <span class="mono a">${fmt1(p.ghStockMl)} mL</span> of bottle A to an empty jug.` });
    if (p.khStockMl > 0) out.push({ key: 'b', html: `Add <span class="mono b">${fmt1(p.khStockMl)} mL</span> of bottle B.` });
    const noDistilled = p.distilledL < p.finalL * 0.005;
    if (p.baseL > 0 && noDistilled) out.push({ key: 'fill', fill: true, html: `Fill with your own water <b>to the ${line}</b> (about <span class="mono">${vol(p.baseL)}</span>), cap and shake.` });
    else {
      if (p.baseL > 0) out.push({ key: 'base', html: `Pour in <span class="mono">${vol(p.baseL)}</span> of your own water.` });
      out.push({ key: 'fill', fill: true, html: `Fill with distilled water <b>to the ${line}</b> (about <span class="mono">${vol(p.distilledL)}</span>), cap and shake.` });
    }
    return out;
  });
  const shortName = (n: string) => n.replace(' (GH/KH only)', '').replace('Third Wave Water', 'Third Wave');
  // Hand-placed labels where recipes crowd together on the KH 40 row.
  const LBL: Record<string, { dx: number; dy: number; a: string }> = { sca: { dx: -11, dy: 4, a: 'end' }, bh4: { dx: 8, dy: -8, a: 'start' }, 'tww-classic': { dx: 0, dy: 20, a: 'middle' } };
  /** The marked jug size closest to an amount (by ratio), or the amount itself when it's not a number. */
  const nearest = (v: number, sizes: number[]) => (Number.isFinite(v) && v > 0 ? sizes.reduce((a, b) => (Math.abs(Math.log(b / v)) < Math.abs(Math.log(a / v)) ? b : a)) : v);
  const fmt1 = (n: number) => (n < 10 ? n.toFixed(1) : Math.round(n).toString());

  // ── map: GH across, KH up ──
  const L = 46, R = 470, T = 16, B = 300, GMAX = 180, KMAX = 100;
  const mx = (v: number) => L + (Math.min(v, GMAX) / GMAX) * (R - L);
  const my = (v: number) => B - (Math.min(v, KMAX) / KMAX) * (B - T);
  // Label placement: flip left near the right edge.
  const lx = (gh: number) => (mx(gh) > R - 150 ? mx(gh) - 10 : mx(gh) + 10);
  const la = (gh: number) => (mx(gh) > R - 150 ? 'end' : 'start');

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const t = q.get('target'); if (t && WATER_RECIPES.some((r) => r.id === t)) targetId = t;
    const g = Number(q.get('gh')), k = Number(q.get('kh'));
    if (q.has('gh') && q.has('kh') && Number.isFinite(g) && Number.isFinite(k)) { base = 'tested'; gh = g; kh = k; }
    else if (q.has('gh') || q.has('kh')) linkProblem = true;
    espresso = q.get('espresso') === '1';
    if (q.get('units') === 'metric') { gallons = false; volume = 4; }
    // The batch travels with the link, so the recipient sees the amounts the sender built (Muse r4).
    const v = Number(q.get('vol')); if (q.has('vol') && Number.isFinite(v) && v > 0) volume = v;
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams({ target: targetId });
    // Only numbers go into the link: a cleared box wrote gh=null (Opus r4).
    if (base === 'tested' && Number.isFinite(gh) && Number.isFinite(kh)) { q.set('gh', String(gh)); q.set('kh', String(kh)); }
    if (espresso) q.set('espresso', '1');
    if (!gallons) q.set('units', 'metric');
    if (Number.isFinite(volume) && volume > 0) q.set('vol', String(volume));
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
        <g class="lm" class:on={r.id === targetId} role="button" tabindex="-1" onclick={() => (targetId = r.id)} onkeydown={(e) => e.key === 'Enter' && (targetId = r.id)}>
          <circle cx={mx(r.gh)} cy={my(r.kh)} r={r.id === targetId ? 8 : 5} />
          <text x={LBL[r.id] ? mx(r.gh) + LBL[r.id].dx : lx(r.gh)} y={my(r.kh) + (LBL[r.id] ? LBL[r.id].dy : 4)} text-anchor={LBL[r.id]?.a ?? la(r.gh)} class="ln">{shortName(r.name)}</text>
        </g>
      {/each}
      {#if base === 'tested' && p}
        <line x1={mx(gh)} y1={my(kh)} x2={mx(gh * share)} y2={my(kh * share)} class="path" />
        <line x1={mx(gh * share)} y1={my(kh * share)} x2={mx(p.gh)} y2={my(p.kh)} class="path add" />
        <g transform="translate({mx(gh)} {my(kh)})"><path d="M0 -14 C 7 -6, 7 0, 0 4 C -7 0, -7 -6, 0 -14 Z" fill="#3f8796" stroke="#2a1d15" stroke-width="1.2" /></g>
        <text x={mx(gh)} y={my(kh) - 20} text-anchor={mx(gh) < L + 50 ? 'start' : mx(gh) > R - 50 ? 'end' : 'middle'} class="ln strong">your water{gh > GMAX || kh > KMAX ? ' (off the chart)' : ''}</text>
      {/if}
    </svg>
    <figcaption>Hardness (calcium and magnesium) helps pull flavour out; alkalinity (bicarbonate) buffers acidity. The dashed lines mark hardness two and three times the alkalinity, a common starting range; recipes sit on both sides of it.</figcaption>
  </figure>

  <div class="panel">
    <fieldset>
      <legend class="lbl">1 · Your starting water</legend>
      <div class="seg">
        <button type="button" aria-pressed={base === 'distilled'} onclick={() => (base = 'distilled')}>Distilled or RO</button>
        <button type="button" aria-pressed={base === 'tested'} onclick={() => (base = 'tested')}>I have test results</button>
        <button type="button" aria-pressed={base === 'unknown'} onclick={() => (base = 'unknown')}>I don't know my water</button>
      </div>
      {#if linkProblem}<p class="note">That link's GH and KH weren't both numbers, so this starts from distilled water.</p>{/if}
      {#if base === 'tested'}
        <div class="row">
          <label class="fld"><span>GH (ppm)</span><input type="number" min="0" max="1000" bind:value={gh} /></label>
          <label class="fld"><span>KH (ppm)</span><input type="number" min="0" max="1000" bind:value={kh} /></label>
        </div>
        <p class="note">{#if Number.isFinite(gh) && Number.isFinite(kh) && gh >= 0 && kh >= 0}Closest named water: {nearestRecipe(gh, kh).name}.{' '}{/if}Aquarium test kits read GH and KH in degrees (dGH, dKH); multiply by 17.9 for ppm.</p>
      {:else if base === 'unknown'}
        <p class="note">Your water utility publishes an annual water quality report with hardness and alkalinity; an aquarium GH/KH test kit costs a few dollars. Until then, start from distilled water: the recipe below works anywhere.</p>
      {/if}
    </fieldset>

    <fieldset>
      <legend class="lbl">2 · What you want</legend>
      <label class="check"><input type="checkbox" bind:checked={espresso} /> It's for an espresso machine</label>
      <div class="recipes">
        {#each WATER_RECIPES as r (r.id)}
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
          {#each (gallons ? [1, 2, 5] : [1, 2, 4, 10]) as v (v)}<button type="button" aria-pressed={volume === v} onclick={() => (volume = v)}>{v} {gallons ? (v === 1 ? 'gallon' : 'gallons') : 'L'}</button>{/each}
          <label class="fld vol"><span class="sr">Custom batch, {gallons ? 'gallons' : 'litres'}</span><input type="number" inputmode="decimal" min="0.1" step="0.1" value={volume} oninput={(e) => { const v = Number((e.currentTarget as HTMLInputElement).value); volume = Number.isFinite(v) ? v : NaN; }} /><span class="unit">{gallons ? 'gal' : 'L'}</span></label>
        </div>
        <div class="seg">
          <!-- Switching units converts the batch you were building rather than resetting it. -->
          <button type="button" aria-pressed={gallons} onclick={() => { if (!gallons) { volume = nearest(volume / 3.785, [0.25, 0.5, 1, 2, 3, 5, 10]); gallons = true; } }}>US</button>
          <button type="button" aria-pressed={!gallons} onclick={() => { if (gallons) { volume = nearest(volume * 3.785, [0.5, 1, 2, 4, 5, 10, 20, 40]); gallons = false; } }}>Metric</button>
        </div>
      </div>
    </fieldset>

    {#if p}
      <div class="result" aria-live="polite">
        <p class="kick">Your recipe: {p.target.name}</p>
        {#if p.ghStockMl > 0 || p.khStockMl > 0}<p class="once"><b>Once:</b> make {p.ghStockMl > 0 && p.khStockMl > 0 ? 'two stock bottles' : 'a stock bottle'} (they keep for months, capped, out of the sun). {#if p.ghStockMl > 0} Bottle A: <span class="mono a">{CONCENTRATE_G_PER_L.gh} g</span> Epsom salt in distilled water, made up to 1 L.{/if}{#if p.khStockMl > 0} Bottle B: <span class="mono b">{CONCENTRATE_G_PER_L.kh} g</span> baking soda, made up to 1 L.{/if}</p>{/if}
        <ol class="steps">
          {#each steps as st, k (st.key)}<li class:fill={st.fill}><span class="n">{st.fill ? '✓' : k + 1}</span><span>{@html st.html}</span></li>{/each}
        </ol>
        {#if base === 'tested' && p.khStockMl === 0 && p.ghStockMl > 0}<p class="note">No bottle B needed: your water already brings enough alkalinity.</p>{/if}
        {#if base === 'tested' && p.ghStockMl === 0 && p.khStockMl > 0}<p class="note">No bottle A needed: your water already brings enough hardness.</p>{/if}
        {#if p.dry.epsomG === 0 && p.dry.bicarbG === 0}
          <p class="direct">{p.baseL < p.finalL * 0.995 ? 'No salts needed: your own water, diluted as above, matches this recipe.' : 'Your water already matches this recipe, so no salts are needed.'}</p>
        {:else if p.dry.weighable}
          <p class="direct"><b>Or skip the bottles:</b> weigh {#if p.dry.epsomG > 0}<span class="mono">{p.dry.epsomG.toFixed(2)} g</span> Epsom salt{/if}{#if p.dry.epsomG > 0 && p.dry.bicarbG > 0}{' '}and{' '}{/if}{#if p.dry.bicarbG > 0}<span class="mono">{p.dry.bicarbG.toFixed(2)} g</span> baking soda{/if} into the empty jug, then {#if p.dry.baseL > 0 && p.dry.distilledL < p.finalL * 0.005}fill with your own water to the {line}{:else if p.dry.baseL > 0}add <span class="mono">{vol(p.dry.baseL)}</span> of your own water and fill with distilled water to the {line}{:else}fill with distilled water to the {line}{/if} (needs a 0.01 g scale).</p>
        {:else}
          <p class="direct">Weighing the dry salts directly isn't practical for this batch: {p.dry.minBatchL <= 40 ? `the amounts are under 0.2 g, too small for a 0.01 g scale to measure accurately. From about ${vol(Math.ceil(p.dry.minBatchL * 10) / 10)} they're big enough.` : 'the amounts are a few milligrams. Use the stock bottles.'}</p>
        {/if}
        <p class="out">Result: GH {Math.round(p.gh)} · KH {Math.round(p.kh)} ppm as CaCO₃. {p.target.bestFor}.</p>
        {#each p.notes as n (n)}<p class="note">{n}</p>{/each}
        <p class="note">Use plain Epsom salt (magnesium sulfate heptahydrate, unscented, food or USP grade) and ordinary baking soda (sodium bicarbonate). Two salts match a recipe's hardness and alkalinity, not every mineral in a branded product. All the hardness they add is magnesium, from the Epsom salt, so the numbers match a recipe's GH, not its calcium{targetId === 'sca' ? ': the SCA\'s 68 is a calcium-hardness figure' : ''}.</p>
      </div>
    {:else if !plan.ok}
      <p class="err">{plan.errors[0].code === 'bad-volume' && gallons ? 'Choose a batch between about 0.03 and 10.5 gallons.' : plan.errors[0].message}</p>
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
  .once { font-size: 14.5px; color: var(--ink-2); margin: 0 0 12px; }
  .steps { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
  .steps li { display: grid; grid-template-columns: 28px 1fr; gap: 10px; align-items: start; font-size: 16px; }
  .steps .n { width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--ink); display: grid; place-items: center; font: 500 13px/1 'IBM Plex Mono', monospace; }
  .steps .fill .n { background: var(--water); border-color: var(--water); color: #fff; }
  .mono { font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
  .mono.a { color: var(--crema-deep); }
  .mono.b { color: var(--water); }
  .direct, .out { font-size: 14.5px; color: var(--ink-2); margin: 10px 0 0; }
  .note { font-size: 13.5px; color: var(--ink-3); margin: 8px 0 0; }
  .err { color: #9a3b1c; }
  button:focus-visible, input:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  /* Phones: the map scales down, so its words scale up to stay readable (about 9–10 px on screen). */
  @media (max-width: 640px) { .ln { font-size: 17px; } .tk, .gl, .ax { font-size: 16px; } }
  @media (max-width: 860px) { .wb { grid-template-columns: 1fr; } .stage { border-right: 0; border-bottom: 1px solid var(--rule); } .panel { padding: 18px 16px 20px; } .recipes { grid-template-columns: 1fr; } }
  .vol { flex-direction: row; align-items: center; gap: 6px; }
  .vol input { width: 84px; }
  .vol .unit { font: 400 14px 'IBM Plex Mono', monospace; color: var(--ink-2); }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
