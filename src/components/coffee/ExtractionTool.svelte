<script lang="ts">
  import { onMount } from 'svelte';
  import ExtractionMap from './ExtractionMap.svelte';
  import { LEVERS, ZONES, placeOnMap, suggestLevers, leverMove, measuredExtraction, CHARTS } from '../../lib/coffee/index.ts';
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
  // The opening numbers are an example until the reader enters their own (Muse r4).
  let example = $state(true);
  let measured = $derived(measuredExtraction({ kind, doseG, liquidG, tdsPct, diluted }));
  let mv = $derived(measured.ok ? measured.value : null);
  type Entry = { doseG: number; liquidG: number; tdsPct: number; example: boolean };
  const PRESETS: Record<MeasuredKind, Entry> = {
    percolation: { doseG: 20, liquidG: 300, tdsPct: 1.3, example: true },
    immersion: { doseG: 30, liquidG: 500, tdsPct: 1.25, example: true },
    espresso: { doseG: 18, liquidG: 36, tdsPct: 10, example: true },
  };
  // Each brew kind keeps its own numbers, so a misclick on another kind doesn't lose a real reading.
  const entries: Partial<Record<MeasuredKind, Entry>> = {};
  function setKind(k: MeasuredKind) {
    if (k === kind) return;
    entries[kind] = { doseG, liquidG, tdsPct, example };
    kind = k;
    const e = entries[k] ?? PRESETS[k];
    doseG = e.doseG; liquidG = e.liquidG; tdsPct = e.tdsPct; example = e.example;
  }

  let place = $derived(placeOnMap({ sourBitter, body }));
  let zone = $derived(ZONES[place.zone]);
  let suggested = $derived(suggestLevers({ sourBitter, body }, espresso));
  let suggestedIds = $derived(new Set(place.zone === 'ideal-ideal' ? [] : suggested.slice(0, 3).map((l) => l.id)));
  const clamp = (v: number) => Math.max(-2, Math.min(2, Math.round(v * 20) / 20));
  function pull(id: string) {
    const l = LEVERS.find((x) => x.id === id)!;
    const mv = leverMove(l, espresso);
    sourBitter = clamp(sourBitter + mv.dx); body = clamp(body + mv.dy); touched = true;
    moved = espresso && l.espresso ? l.espresso : l.label;
  }
  // Measured readings are compared with reference ranges, not graded: a point outside the box isn't a fault (Astra R9).
  function verdict(z: string, strengthJudged: boolean): string {
    const [e, s] = z.split('-');
    const E = e === 'under' ? 'Below the reference extraction' : e === 'over' ? 'Above the reference extraction' : 'Within the reference extraction';
    if (!strengthJudged) return `${E}; strength not judged for a diluted drink`;
    if (e === 'ideal' && s === 'ideal') return 'Within both reference ranges';
    return `${E}; ${s === 'weak' ? 'below reference strength' : s === 'strong' ? 'above reference strength' : 'within reference strength'}`;
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
      // A complete reading is used as given. Anything less (a missing or non-numeric field) shows this
      // kind's own example, labelled, never another kind's default mixed into the reader's numbers (blind Opus r5).
      const num = (key: string) => { const v = q.get(key); return v === null || v.trim() === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null; };
      const d = num('dose'), l = num('liquid'), t = num('tds');
      const pre = PRESETS[kind];
      if (d !== null && l !== null && t !== null) { doseG = d; liquidG = l; tdsPct = t; example = false; }
      else {
        doseG = pre.doseG; liquidG = pre.liquidG; tdsPct = pre.tdsPct; example = true;
        linkProblem = ['dose', 'liquid', 'tds'].some((key) => q.has(key));
      }
      diluted = q.get('diluted') === '1';
    }
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = mode === 'measured' ? new URLSearchParams(Object.fromEntries(Object.entries({ mode, kind, dose: doseG, liquid: liquidG, tds: tdsPct, ...(diluted ? { diluted: '1' } : {}) }).filter(([, v]) => v !== null && v !== undefined && v !== '' && !(typeof v === 'number' && !Number.isFinite(v))).map(([k, v]) => [k, String(v)]))) : new URLSearchParams(touched ? { taste: String(sourBitter), body: String(body) } : {});
    if (mode === 'taste' && espresso) q.set('espresso', '1');
    history.replaceState(history.state, '', `${location.pathname}${q.toString() ? `?${q}` : ''}`);
  });
</script>

<div class="xt">
  <div class="stage">
    {#if mode === 'measured' && mv && !mv.placeable}
      <ExtractionMap x={0.5} y={0.5} zone="ideal-ideal" empty emptyText="check the readings to place your cup" axes={mv.chart} label="Measured mode: the readings look mixed up, so the cup isn't placed." />
    {:else if mode === 'measured' && mv}
      <ExtractionMap x={mv.x} y={mv.y} zone={mv.zone} axes={mv.chart} plain={!mv.strengthJudged} extractionOnly={!mv.strengthJudged} label={`Measured: ${mv.eyPct.toFixed(1)}% extraction${mv.strengthJudged ? ` at ${tdsPct}% TDS` : ''}. ${verdict(mv.zone, mv.strengthJudged)}.`} />
    {:else if mode === 'measured'}
      <ExtractionMap x={0.5} y={0.5} zone="ideal-ideal" empty axes={CHARTS[kind === 'espresso' ? 'espresso' : 'filter']} label="Measured mode: no valid reading yet, so the chart is empty." />
    {/if}
    {#if mode === 'measured'}
      <p class="refcap">{kind === 'espresso' ? 'Reference: 18–22% extraction; 8–12% TDS is a rule of thumb (espresso has no SCA chart). A reference, not a rating of your coffee.' : 'SCA 2019 reference range: 18–22% extraction · 1.15–1.45% TDS. A brewing reference, not a rating of your coffee.'}</p>
    {:else}
      <ExtractionMap x={place.x} y={place.y} zone={place.zone} empty={!touched} emptyText="move the sliders to place your cup" label={touched ? `By taste, your cup probably sits in the ${zone.label.toLowerCase()} zone.` : 'Extraction map: move the sliders to describe your cup and place it here.'} />
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
        <label class="fld"><span class="lbl">Coffee, g</span><input type="number" inputmode="decimal" step="0.1" min="1" bind:value={doseG} oninput={() => (example = false)} /></label>
        <label class="fld"><span class="lbl">{kind === 'immersion' ? 'Water added, g' : kind === 'espresso' && !diluted ? 'Shot weight, g' : 'Drink weight, g'}</span><input type="number" inputmode="decimal" step="0.1" min="1" bind:value={liquidG} oninput={() => (example = false)} /></label>
        <label class="fld"><span class="lbl">TDS, %</span><input type="number" inputmode="decimal" step="0.01" min="0" bind:value={tdsPct} oninput={() => (example = false)} /></label>
      </div>
      <label class="check"><input type="checkbox" bind:checked={diluted} /> I diluted it on purpose (americano, bypass water)</label>
      {#if linkProblem}<p class="note">That link didn't hold a complete, valid reading, so the {kind === 'espresso' ? 'espresso' : kind === 'immersion' ? 'immersion' : 'pour-over'} example is shown instead.</p>{/if}
      {#if example}<p class="note ex">Example reading: enter your own dose, weight and TDS to place your cup.</p>{/if}
      {#if mv}
        <div class="zonecard" class:suspect={!mv.placeable} aria-live="polite">
          <span class="lbl">{example ? 'Example: extraction yield' : mv.placeable ? 'Extraction yield' : 'Extraction yield, if the numbers are right'}</span>
          <p class="ey">{mv.eyPct.toFixed(1)}<small>%</small></p>
          <p class="zt">{mv.dissolvedG.toFixed(2)} g of coffee dissolved from {doseG} g · {!mv.placeable ? 'not judged: these numbers look mixed up (see below)' : verdict(mv.zone, mv.strengthJudged)}</p>
          <p class="calc">{kind === 'immersion' ? 'water added' : kind === 'espresso' && !diluted ? 'shot weight' : 'drink weight'} {liquidG} g × {tdsPct}% ÷ {doseG} g coffee</p>
        </div>
        {#each mv.notes as nt (nt)}<p class="note">{nt}</p>{/each}
        {#if mv.moves.length}<p class="note">If the cup tastes off to you, possible next moves: {mv.moves.join('; ')}. Change one at a time and measure again.</p>{/if}
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
            <svg viewBox="-12 -12 24 24" aria-hidden="true"><line x1="0" y1="0" x2={leverMove(l, espresso).dx * 14} y2={-leverMove(l, espresso).dy * 14} stroke="currentColor" stroke-width="2" stroke-linecap="round" /><circle r="2.4" fill="currentColor" /></svg>
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
  .xt { --rule: var(--t-rule, #d9cdbd); --ink: var(--t-ink, #2a1d15); --ink-2: var(--t-ink-2, #5b4a3d); --ink-3: var(--t-ink-3, #75655a); --crema: var(--t-crema, #c3873a); --crema-deep: var(--t-crema-deep, #8f5d22);
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); background: var(--t-card, #fbf8f3); border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px var(--t-shadow, rgba(60, 35, 15, .35)); }
  .stage { padding: 18px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, var(--t-stage-a, #fffdf9) 0%, var(--t-tint-2, #f4ece0) 80%); display: flex; flex-direction: column; justify-content: center; }
  .refcap { margin: 6px 4px 0; font: 400 12.5px/1.4 'IBM Plex Mono', monospace; color: var(--ink-3); text-align: center; }
  .panel { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 8px; }
  .seg { display: flex; flex-wrap: wrap; gap: 6px; }
  .seg button { appearance: none; border: 1px solid var(--rule); background: var(--t-surface, #fff); border-radius: 999px; padding: 8px 13px; min-height: 38px; font: 500 13.5px/1 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: var(--t-on-ink, #f3ede3); border-color: var(--ink); }
  .slider { display: block; }
  input[type='range'] { width: 100%; accent-color: var(--crema-deep); height: 28px; }
  .ends { display: flex; justify-content: space-between; font-size: 13px; color: var(--ink-3); }
  .ends .now { font: 500 13px 'IBM Plex Mono', monospace; color: var(--ink); text-transform: uppercase; letter-spacing: .08em; }
  .zonecard { border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 12px 0; }
  .zl { font: 400 28px/1.1 'Instrument Serif', Georgia, serif; margin: 0; }
  .zt { margin: 4px 0 0; color: var(--ink-2); }
  .levers { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .levers button { appearance: none; border: 1px solid var(--rule); background: var(--t-surface, #fff); border-radius: 10px; padding: 8px 10px; min-height: 42px; font: 500 13.5px/1.2 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; display: flex; align-items: center; gap: 8px; text-align: left; }
  .levers svg { width: 22px; height: 22px; flex: none; color: var(--crema-deep); }
  .levers button.hint { border-color: var(--crema); background: var(--t-tint, #fff8ec); color: var(--ink); }
  .note { font-size: 13px; color: var(--ink-3); margin: 10px 0 0; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .go { background: var(--ink); color: var(--t-on-ink, #f3ede3); border-radius: 999px; padding: 13px 20px; font: 600 15px/1 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { border: 1px solid var(--rule); background: var(--t-surface, #fff); color: var(--ink-2); border-radius: 999px; padding: 11px 15px; font: 500 14px/1 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  button:focus-visible, a:focus-visible, input:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 860px) { .xt { grid-template-columns: 1fr; } .stage { border-right: 0; border-bottom: 1px solid var(--rule); padding: 10px 24px; } .panel { padding: 18px 16px 20px; } }
  .tabs { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--rule); border-radius: 12px; overflow: hidden; }
  .tabs button { appearance: none; border: 0; background: var(--t-surface, #fff); padding: 10px 12px; font: 600 14.5px/1.2 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; text-align: left; min-height: 48px; }
  .tabs button + button { border-left: 1px solid var(--rule); }
  .tabs button small { display: block; font: 400 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .tabs button[aria-pressed='true'] { background: var(--ink); color: var(--t-on-ink, #f3ede3); }
  .tabs button[aria-pressed='true'] small { color: var(--t-rule, #d9cdbd); }
  .inputs { display: flex; gap: 10px; flex-wrap: wrap; }
  .fld { display: flex; flex-direction: column; gap: 0; }
  .fld input { font: 400 17px 'IBM Plex Mono', monospace; width: 112px; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 8px; background: var(--t-surface, #fff); min-height: 44px; color: var(--ink); }
  .ey { font: 400 52px/1 'Instrument Serif', Georgia, serif; margin: 0; }
  .ey small { font-size: 26px; margin-left: 2px; }
  .calc { font: 400 12.5px 'IBM Plex Mono', monospace; color: var(--ink-3); margin: 6px 0 0; }
  .err { color: var(--t-warn, #9a3b1c); margin: 0; }
  .note.ex { margin: 0; color: var(--crema-deep); }
  .zonecard.suspect .ey { color: var(--ink-3); font-size: 40px; }
  .check { display: flex; gap: 8px; align-items: center; font-size: 14.5px; }
  .check input { width: 18px; height: 18px; }
</style>
