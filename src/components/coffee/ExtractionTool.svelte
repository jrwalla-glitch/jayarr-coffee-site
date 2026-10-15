<script lang="ts">
  import { onMount } from 'svelte';
  import ExtractionMap from './ExtractionMap.svelte';
  import { LEVERS, ZONES, placeOnMap, suggestLevers } from '../../lib/coffee/index.ts';

  let sourBitter = $state(-1);
  let body = $state(-0.5);
  let espresso = $state(false);
  let mounted = $state(false);
  let moved = $state<string | null>(null);

  let place = $derived(placeOnMap({ sourBitter, body }));
  let zone = $derived(ZONES[place.zone]);
  let suggested = $derived(suggestLevers({ sourBitter, body }));
  let suggestedIds = $derived(new Set(place.zone === 'ideal-ideal' ? [] : suggested.slice(0, 3).map((l) => l.id)));
  const clamp = (v: number) => Math.max(-2, Math.min(2, Math.round(v * 20) / 20));
  function pull(id: string) {
    const l = LEVERS.find((x) => x.id === id)!;
    sourBitter = clamp(sourBitter + l.dx); body = clamp(body + l.dy);
    moved = espresso && l.espresso ? l.espresso : l.label;
  }
  const word = (v: number, neg: string, pos: string) => (v <= -1.25 ? `very ${neg}` : v <= -0.5 ? neg : v >= 1.25 ? `very ${pos}` : v >= 0.5 ? pos : 'balanced');

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const a = Number(q.get('taste')), b = Number(q.get('body'));
    if (q.has('taste') && Number.isFinite(a)) sourBitter = clamp(a);
    if (q.has('body') && Number.isFinite(b)) body = clamp(b);
    espresso = q.get('espresso') === '1';
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams({ taste: String(sourBitter), body: String(body) });
    if (espresso) q.set('espresso', '1');
    history.replaceState(history.state, '', `${location.pathname}?${q}`);
  });
</script>

<div class="xt">
  <div class="stage">
    <ExtractionMap x={place.x} y={place.y} zone={place.zone} label={`Your cup sits in the ${zone.label.toLowerCase()} zone.`} />
  </div>
  <div class="panel">
    <div class="seg" role="group" aria-label="Brew type">
      <button type="button" aria-pressed={!espresso} onclick={() => (espresso = false)}>Filter, press or pour-over</button>
      <button type="button" aria-pressed={espresso} onclick={() => (espresso = true)}>Espresso</button>
    </div>

    <label class="slider">
      <span class="lbl">How does it taste?</span>
      <input type="range" min="-2" max="2" step="0.05" bind:value={sourBitter} aria-valuetext={word(sourBitter, 'sour', 'bitter')} />
      <span class="ends"><span>Sour</span><span class="now">{word(sourBitter, 'sour', 'bitter')}</span><span>Bitter</span></span>
    </label>
    <label class="slider">
      <span class="lbl">How does it feel?</span>
      <input type="range" min="-2" max="2" step="0.05" bind:value={body} aria-valuetext={word(body, 'thin', 'heavy')} />
      <span class="ends"><span>Thin, watery</span><span class="now">{word(body, 'thin', 'heavy')}</span><span>Heavy, intense</span></span>
    </label>

    <div class="zonecard" aria-live="polite">
      <span class="lbl">Your cup</span>
      <p class="zl">{zone.label}</p>
      <p class="zt">{zone.tastes}{moved ? ` · after “${moved.toLowerCase()}”` : ''}</p>
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
      <p class="note">Highlighted levers point toward the sweet spot. Grind, water temperature and contact time mostly move extraction; the coffee-to-water ratio mostly moves strength. Illustrative: taste places the cup on this map, it doesn't measure it.</p>
    </div>
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
</style>
