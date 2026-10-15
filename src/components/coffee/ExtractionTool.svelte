<script lang="ts">
  import { onMount } from 'svelte';
  import ExtractionMap from './ExtractionMap.svelte';
  import { LEVERS, ZONES, placeOnMap, suggestLevers, measuredExtraction, CHARTS } from '../../lib/coffee/index.ts';
  import type { MeasuredKind } from '../../lib/coffee/index.ts';

  // Starts in the middle with no verdict until the reader describes their cup (Muse).
  let sourBitter = $state(0);
  let body = $state(0);
  let touched = $state(false);
  let espresso = $state(false);
  let mounted = $state(false);
  let moved = $state<string | null>(null);
  // Measured mode: a refractometer reading turns the guess into arithmetic.
  let mode = $state<'taste' | 'measured'>('taste');
  let kind = $state<MeasuredKind>('percolation');
  let doseG = $state(20);
  let liquidG = $state(300);
  let tdsPct = $state(1.3);
  let diluted = $state(false);
  let linkProblem = $state(false);
  let measured = $derived(measuredExtraction({ kind, doseG, liquidG, tdsPct, diluted }));
  let mv = $derived(measured.ok ? measured.value : null);
  function setKind(k: MeasuredKind) {
    kind = k;
    if (k === 'espresso') { doseG = 18; liquidG = 36; tdsPct = 10; } else if (k === 'immersion') { doseG = 30; liquidG = 500; tdsPct = 1.25; } else { doseG = 20; liquidG = 300; tdsPct = 1.3; }
  }

  let place = $derived(placeOnMap({ sourBitter, body }));
  let zone = $derived(ZONES[place.zone]);
  let suggested = $derived(suggestLevers({ sourBitter, body }));
  let suggestedIds = $derived(new Set(place.zone === 'ideal-ideal' ? [] : suggested.slice(0, 3).map((l) => l.id)));
  const clamp = (v: number) => Math.max(-2, Math.min(2, Math.round(v * 20) / 20));
  function pull(id: string) {
    const l = LEVERS.find((x) => x.id === id)!;
    sourBitter = clamp(sourBitter + l.dx); body = clamp(body + l.dy); touched = true;
    moved = espresso && l.espresso ? l.espresso : l.label;
  }
  const word = (v: number, neg: string, pos: string) => (v <= -1.25 ? `very ${neg}` : v <= -0.5 ? neg : v >= 1.25 ? `very ${pos}` : v >= 0.5 ? pos : 'balanced');

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const a = Number(q.get('taste')), b = Number(q.get('body'));
    if (q.has('taste') && Number.isFinite(a)) { sourBitter = clamp(a); touched = true; }
    if (q.has('body') && Number.isFinite(b)) { body = clamp(b); touched = true; }
    espresso = q.get('espresso') === '1';
    if (q.get('mode') === 'measured') {
      mode = 'measured';
      const k = q.get('kind'); if (k === 'percolation' || k === 'immersion' || k === 'espresso') kind = k;
      const d = Number(q.get('dose')), l = Number(q.get('liquid')), t = Number(q.get('tds'));
      if (q.has('dose') && Number.isFinite(d)) doseG = d;
      if (q.has('liquid') && Number.isFinite(l)) liquidG = l;
      if (q.has('tds') && Number.isFinite(t)) tdsPct = t;
      // A link whose numbers aren't numbers says so instead of quietly showing an example.
      linkProblem = (['dose', 'liquid', 'tds'] as const).some((k) => q.has(k) && !Number.isFinite(Number(q.get(k))));
      diluted = q.get('diluted') === '1';
    }
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = mode === 'measured' ? new URLSearchParams({ mode, kind, dose: String(doseG), liquid: String(liquidG), tds: String(tdsPct), ...(diluted ? { diluted: '1' } : {}) }) : new URLSearchParams(touched ? { taste: String(sourBitter), body: String(body) } : {});
    if (mode === 'taste' && espresso) q.set('espresso', '1');
    history.replaceState(history.state, '', `${location.pathname}${q.toString() ? `?${q}` : ''}`);
  });
</script>

<div class="xt">
  <div class="stage">
    {#if mode === 'measured' && mv && !mv.placeable}
      <ExtractionMap x={0.5} y={0.5} zone="ideal-ideal" empty emptyText="check the weights to place your cup" axes={mv.chart} label="Measured mode: the weights look mixed up, so the cup isn't placed." />
    {:else if mode === 'measured' && mv}
      <ExtractionMap x={mv.x} y={mv.y} zone={mv.zone} axes={mv.chart} label={mv.strengthJudged ? `Measured: ${mv.eyPct.toFixed(1)}% extraction at ${tdsPct}% TDS, in the ${ZONES[mv.zone].label.toLowerCase()} zone.` : `Measured: ${mv.eyPct.toFixed(1)}% extraction; strength not judged for a diluted drink.`} />
    {:else if mode === 'measured'}
      <ExtractionMap x={0.5} y={0.5} zone="ideal-ideal" empty axes={CHARTS[kind === 'espresso' ? 'espresso' : 'filter']} label="Measured mode: no valid reading yet, so the chart is empty." />
    {:else}
      <ExtractionMap x={place.x} y={place.y} zone={place.zone} label={touched ? `By taste, your cup probably sits in the ${zone.label.toLowerCase()} zone.` : 'Extraction map: move the sliders to describe your cup and place it here.'} />
    {/if}
  </div>
  <div class="panel">
    <div class="tabs" role="group" aria-label="How to place your cup">
      <button type="button" aria-pressed={mode === 'taste'} onclick={() => (mode = 'taste')}>By taste <small>a hypothesis</small></button>
      <button type="button" aria-pressed={mode === 'measured'} onclick={() => (mode = 'measured')}>Measured <small>refractometer</small></button>
    </div>
    {#if mode === 'measured'}
      <div class="seg" role="group" aria-label="How it was brewed">
        <button type="button" aria-pressed={kind === 'percolation'} onclick={() => setKind('percolation')}>Pour-over or drip</button>
        <button type="button" aria-pressed={kind === 'immersion'} onclick={() => setKind('immersion')}>Immersion</button>
        <button type="button" aria-pressed={kind === 'espresso'} onclick={() => setKind('espresso')}>Espresso</button>
      </div>
      <div class="inputs">
        <label class="fld"><span class="lbl">Coffee, g</span><input type="number" inputmode="decimal" step="0.1" min="1" bind:value={doseG} /></label>
        <label class="fld"><span class="lbl">{kind === 'immersion' ? 'Water added, g' : kind === 'espresso' ? 'Shot weight, g' : 'Drink weight, g'}</span><input type="number" inputmode="decimal" step="0.1" min="1" bind:value={liquidG} /></label>
        <label class="fld"><span class="lbl">TDS, %</span><input type="number" inputmode="decimal" step="0.01" min="0" bind:value={tdsPct} /></label>
      </div>
      <label class="check"><input type="checkbox" bind:checked={diluted} /> I diluted it on purpose (americano, bypass water)</label>
      {#if linkProblem}<p class="note">Some numbers in that link weren't valid, so the example values are shown instead.</p>{/if}
      {#if mv}
        <div class="zonecard" aria-live="polite">
          <span class="lbl">Extraction yield</span>
          <p class="ey">{mv.eyPct.toFixed(1)}<small>%</small></p>
          <p class="zt">{mv.dissolvedG.toFixed(2)} g of coffee dissolved from {doseG} g · {mv.strengthJudged ? ZONES[mv.zone].label : `${mv.zone.startsWith('under') ? 'Under-extracted' : mv.zone.startsWith('over') ? 'Over-extracted' : 'Extraction in the usual range'}; strength not judged for a diluted drink`}</p>
          <p class="calc">{kind === 'immersion' ? 'water added' : kind === 'espresso' ? 'shot weight' : 'drink weight'} {liquidG} g × {tdsPct}% ÷ {doseG} g coffee</p>
        </div>
        {#each mv.notes as nt (nt)}<p class="note">{nt}</p>{/each}
        {#if mv.moves.length}<p class="note">Possible next moves: {mv.moves.join('; ')}. Change one at a time and measure again.</p>{/if}
        <p class="note">{kind === 'immersion' ? 'Diluting an immersion brew (cold brew concentrate, for example)? Take the reading before you dilute, with the water you brewed with: the grounds hold back some of the dissolved coffee, so a diluted reading reads low.' : 'Diluted it (an americano, bypass water)? Take the weight and the reading at the same point: the shot or brew with its own reading, or the whole diluted drink with its reading. The dissolved coffee is the same either way.'}</p>
      {:else if !measured.ok}
        <p class="err" role="alert">{measured.errors[0].message}</p>
      {/if}
    {:else}
    <div class="seg" role="group" aria-label="Brew type">
      <button type="button" aria-pressed={!espresso} onclick={() => (espresso = false)}>Filter, press or pour-over</button>
      <button type="button" aria-pressed={espresso} onclick={() => (espresso = true)}>Espresso</button>
    </div>

    <label class="slider">
      <span class="lbl">How does it taste?</span>
      <input type="range" min="-2" max="2" step="0.05" bind:value={sourBitter} oninput={() => (touched = true)} aria-valuetext={word(sourBitter, 'sour', 'bitter')} />
      <span class="ends"><span>Sour</span><span class="now">{word(sourBitter, 'sour', 'bitter')}</span><span>Bitter</span></span>
    </label>
    <label class="slider">
      <span class="lbl">How does it feel?</span>
      <input type="range" min="-2" max="2" step="0.05" bind:value={body} oninput={() => (touched = true)} aria-valuetext={word(body, 'thin', 'heavy')} />
      <span class="ends"><span>Thin, watery</span><span class="now">{word(body, 'thin', 'heavy')}</span><span>Heavy, intense</span></span>
    </label>

    <div class="zonecard" aria-live="polite">
      {#if !touched}
      <span class="lbl">Your cup</span>
      <p class="zl">Describe it with the sliders</p>
      <p class="zt">The dot starts in the middle; move it to match how your coffee tastes and feels.</p>
      {:else}
      <span class="lbl">By taste, your cup is probably</span>
      <p class="zl">{zone.label}</p>
      <p class="zt">{zone.tastes}{moved ? ` · after “${moved.toLowerCase()}”` : ''}</p>
      {/if}
    </div>

    <div>
      <span class="lbl">Try a lever and watch the dot move</span>
      <div class="levers">
        {#each LEVERS as l (l.id)}
          <button type="button" class:hint={suggestedIds.has(l.id)} onclick={() => pull(l.id)}>
            <svg viewBox="-12 -12 24 24" aria-hidden="true"><line x1="0" y1="0" x2={l.dx * 14} y2={-l.dy * 14} stroke="currentColor" stroke-width="2" stroke-linecap="round" /><circle r="2.4" fill="currentColor" /></svg>
            {espresso && l.espresso ? l.espresso : l.label}
          </button>
        {/each}
      </div>
      <p class="note">Highlighted levers are possible directions toward the sweet spot, not measured results. Grind, water temperature and contact time mostly move extraction; the coffee-to-water ratio mostly moves strength. Taste places the cup here as a hypothesis; a refractometer reading (Measured) gives the number.</p>
    </div>
    {/if}
    <div class="actions">
      <a class="go" href="/tools/fix-my-coffee/">Get a diagnosis</a>
      <a class="ghost" href="/tools/brew-ratio/">Open the Brew Guide</a>
    </div>
  </div>
</div>

<style>
  .xt { --rule: #d9cdbd; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --crema: #c3873a; --crema-deep: #8f5d22;
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); background: #fbf8f3; border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .stage { padding: 18px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #f4ece0 80%); display: flex; align-items: center; }
  .panel { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 8px; }
  .seg { display: flex; flex-wrap: wrap; gap: 6px; }
  .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 38px; font: 500 13.5px/1 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .slider { display: block; }
  input[type='range'] { width: 100%; accent-color: var(--crema-deep); height: 28px; }
  .ends { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-3); }
  .ends .now { font: 500 13px 'IBM Plex Mono', monospace; color: var(--ink); text-transform: uppercase; letter-spacing: .08em; }
  .zonecard { border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 12px 0; }
  .zl { font: 400 28px/1.1 'Instrument Serif', Georgia, serif; margin: 0; }
  .zt { margin: 4px 0 0; color: var(--ink-2); }
  .levers { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .levers button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 10px; padding: 8px 10px; min-height: 42px; font: 500 13.5px/1.2 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; display: flex; align-items: center; gap: 8px; text-align: left; }
  .levers svg { width: 22px; height: 22px; flex: none; color: var(--crema-deep); }
  .levers button.hint { border-color: var(--crema); background: #fff8ec; color: var(--ink); }
  .note { font-size: 13px; color: var(--ink-3); margin: 10px 0 0; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .go { background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 13px 20px; font: 600 15px/1 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 11px 15px; font: 500 14px/1 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 860px) { .xt { grid-template-columns: 1fr; } .stage { border-right: 0; border-bottom: 1px solid var(--rule); padding: 10px 24px; } .panel { padding: 18px 16px 20px; } }
  .tabs { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--rule); border-radius: 12px; overflow: hidden; }
  .tabs button { appearance: none; border: 0; background: #fff; padding: 10px 12px; font: 600 14.5px/1.2 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; text-align: left; min-height: 48px; }
  .tabs button + button { border-left: 1px solid var(--rule); }
  .tabs button small { display: block; font: 400 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .tabs button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; }
  .tabs button[aria-pressed='true'] small { color: #d9cdbd; }
  .inputs { display: flex; gap: 10px; flex-wrap: wrap; }
  .fld { display: flex; flex-direction: column; gap: 0; }
  .fld input { font: 400 17px 'IBM Plex Mono', monospace; width: 112px; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 8px; background: #fff; min-height: 44px; color: var(--ink); }
  .ey { font: 400 52px/1 'Instrument Serif', Georgia, serif; margin: 0; }
  .ey small { font-size: 26px; margin-left: 2px; }
  .calc { font: 400 12.5px 'IBM Plex Mono', monospace; color: var(--ink-3); margin: 6px 0 0; }
  .err { color: #9a3b1c; margin: 0; }
  .check { display: flex; gap: 8px; align-items: center; font-size: 14.5px; }
  .check input { width: 18px; height: 18px; }
</style>
