<script lang="ts">
  import { onMount } from 'svelte';
  import { METHODS, methodById } from '../../lib/coffee/index.ts';
  import type { MethodId } from '../../lib/coffee/index.ts';

  // Method bands come from the engine (methods.ts). The loupe is illustrative: particle sizes are
  // drawn in proportion to the method's micron band; a blade grinder adds dust and boulders.
  type Row = { id: string; label: string; grindLabel: string; texture: string; grindMicrons: { min: number; max: number }; brew: boolean };
  // Turkish coffee has no Brew Guide recipe yet, so it is a grind-only row (range to verify).
  const ROWS: Row[] = [
    { id: 'turkish', label: 'Turkish', grindLabel: 'Extra fine', texture: 'flour', grindMicrons: { min: 100, max: 200 }, brew: false },
    ...(['espresso', 'moka', 'aeropress', 'v60', 'kalita', 'chemex', 'drip-machine', 'cold-brew', 'french-press'] as MethodId[]).map((id) => { const x = methodById(id)!; return { id, label: x.label, grindLabel: x.grindLabel, texture: x.texture, grindMicrons: x.grindMicrons, brew: true }; }),
  ];
  const rowById = (id: string) => ROWS.find((r) => r.id === id)!;
  const RULER_MAX = 1300;
  const TOO: Record<string, { fine: string; coarse: string }> = {
    turkish: { fine: 'Hard to get finer: this is the finest grind there is.', coarse: 'Grounds won\'t stay suspended; thin and sour.' },
    espresso: { fine: 'Chokes: drips slowly, tastes bitter and harsh.', coarse: 'Gushes in under 20 seconds, tastes sour and thin.' },
    moka: { fine: 'Sputters early and tastes burnt; can clog the filter.', coarse: 'Weak and sour.' },
    aeropress: { fine: 'Hard to press, bitter.', coarse: 'Weak and sour; water runs through before you press.' },
    v60: { fine: 'Slow drawdown past 4 minutes, bitter and dry.', coarse: 'Drains in under 2:30, tastes sour and thin.' },
    kalita: { fine: 'Slow drawdown, bitter.', coarse: 'Fast drawdown, sour.' },
    chemex: { fine: 'The thick filter clogs: very slow, bitter.', coarse: 'Drains fast, weak and sour.' },
    'drip-machine': { fine: 'Basket can overflow; bitter.', coarse: 'Weak and sour.' },
    'cold-brew': { fine: 'Muddy, hard to filter, bitter.', coarse: 'Weak; needs a longer steep.' },
    'french-press': { fine: 'Muddy and silty, hard to press, bitter.', coarse: 'Weak and sour.' },
  };

  let method = $state<string>('v60');
  let grinder = $state<'burr' | 'blade'>('burr');
  let mounted = $state(false);
  let m = $derived(rowById(method));
  let mid = $derived((m.grindMicrons.min + m.grindMicrons.max) / 2);

  // Deterministic pseudo-random particles.
  function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function poly(cx: number, cy: number, r: number, rnd: () => number) {
    const n = 6 + Math.floor(rnd() * 3), pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd() * 0.5, rr = r * (0.7 + rnd() * 0.45); pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`); }
    return pts.join(' ');
  }
  // Loupe shows a 3 mm field of view across 240 px (1 µm = 0.08 px).
  const PX_PER_UM = 240 / 3000;
  let particles = $derived.by(() => {
    const rnd = rng(method.length * 7919 + (grinder === 'blade' ? 31 : 0));
    const out: { pts: string; tone: number }[] = [];
    const sizes: number[] = [];
    const count = Math.round(Math.min(220, 26000 / mid));
    for (let i = 0; i < count; i++) {
      let um = m.grindMicrons.min + rnd() * (m.grindMicrons.max - m.grindMicrons.min);
      if (grinder === 'blade') { const k = rnd(); um = k < 0.35 ? 40 + rnd() * 120 : k > 0.82 ? um * (1.6 + rnd()) : um; }
      else if (rnd() < 0.12) um = 30 + rnd() * 70; // burr grinders make some fines too
      sizes.push(um);
    }
    sizes.sort((a, b) => b - a);
    for (const um of sizes) {
      const r = (um * PX_PER_UM) / 2;
      out.push({ pts: poly(20 + rnd() * 240, 20 + rnd() * 240, Math.max(0.8, r), rnd), tone: rnd() });
    }
    return out;
  });
  const xr = (um: number) => 30 + (Math.min(um, RULER_MAX) / RULER_MAX) * 640;

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const mm = q.get('method');
    if (mm && ROWS.some((r) => r.id === mm)) method = mm;
    if (q.get('grinder') === 'blade') grinder = 'blade';
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams({ method });
    if (grinder === 'blade') q.set('grinder', 'blade');
    history.replaceState(history.state, '', `${location.pathname}?${q}`);
  });
</script>

<div class="gg">
  <div class="loupe-wrap">
    <svg class="loupe" viewBox="0 0 280 280" role="img" aria-label={`Magnified grounds for ${m.label}: ${m.grindLabel.toLowerCase()}, about ${m.grindMicrons.min} to ${m.grindMicrons.max} micrometres${grinder === 'blade' ? ', from a blade grinder with dust and large chunks mixed in' : ''}.`}>
      <defs><clipPath id="gg-lens"><circle cx="140" cy="140" r="122" /></clipPath>
        <radialGradient id="gg-glass" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".55" /><stop offset=".5" stop-color="#fff" stop-opacity="0" /></radialGradient></defs>
      <circle cx="140" cy="140" r="122" fill="#efe4d3" />
      <g clip-path="url(#gg-lens)">
        {#each particles as p, i (i)}<polygon points={p.pts} fill={`hsl(24 ${38 + p.tone * 14}% ${20 + p.tone * 16}%)`} />{/each}
      </g>
      <circle cx="140" cy="140" r="122" fill="url(#gg-glass)" />
      <circle cx="140" cy="140" r="122" fill="none" stroke="#2a1d15" stroke-width="6" />
      <circle cx="140" cy="140" r="130" fill="none" stroke="#2a1d15" stroke-width="1.2" opacity=".4" />
      <!-- 1 mm scale bar -->
      <line x1="96" x2={96 + 1000 * PX_PER_UM} y1="246" y2="246" stroke="#2a1d15" stroke-width="3" />
      <text x={96 + 500 * PX_PER_UM} y="240" text-anchor="middle" class="sb">1 mm</text>
    </svg>
    <p class="cap">Magnified about 25×. Illustrative.</p>
  </div>

  <div class="panel">
    <div class="chips" role="group" aria-label="Brew method">
      {#each ROWS as r (r.id)}<button type="button" aria-pressed={method === r.id} onclick={() => (method = r.id)}>{r.label}</button>{/each}
    </div>
    <div class="head">
      <p class="name">{m.grindLabel}</p>
      <p class="sub">like {m.texture} · about {m.grindMicrons.min}–{m.grindMicrons.max} µm</p>
    </div>
    <div class="seg" role="group" aria-label="Grinder type">
      <button type="button" aria-pressed={grinder === 'burr'} onclick={() => (grinder = 'burr')}>Burr grinder</button>
      <button type="button" aria-pressed={grinder === 'blade'} onclick={() => (grinder = 'blade')}>Blade grinder</button>
    </div>
    {#if grinder === 'blade'}<p class="warn">A blade chops rather than grinds: you get dust and boulders in the same cup, so it extracts unevenly and tastes sour and bitter at once. A burr grinder is the single biggest upgrade.</p>{/if}
    <dl class="too">
      <div><dt>Too fine</dt><dd>{TOO[method].fine}</dd></div>
      <div><dt>Too coarse</dt><dd>{TOO[method].coarse}</dd></div>
    </dl>
    <div class="actions">
      <a class="go" href={`/deep-brew/calibrator/?method=${method}`}>Find the setting on your grinder</a>
      {#if m.brew}<a class="ghost" href={`/tools/brew-ratio/?method=${method}${method === 'espresso' ? '&dose=18' : method === 'moka' ? '&dose=15' : '&cup=355'}`}>Brew Guide</a>{:else}<a class="ghost" href="/blog/turkish-coffee-guide/">Turkish coffee guide</a>{/if}
    </div>
  </div>

  <figure class="ruler">
    <svg viewBox="0 0 700 {ROWS.length * 26 + 56}" role="img" aria-label="Grind size ranges by brew method on a micrometre scale.">
      {#each ROWS as mm, i (mm.id)}
        <g class:on={mm.id === method} class="row" role="button" tabindex="-1" onclick={() => (method = mm.id)} onkeydown={(e) => e.key === 'Enter' && (method = mm.id)}>
          <text x="0" y={i * 26 + 18} class="rl">{mm.label}</text>
          <rect x={xr(mm.grindMicrons.min) + 90} y={i * 26 + 7} width={xr(mm.grindMicrons.max) - xr(mm.grindMicrons.min)} height="14" rx="7" />
        </g>
      {/each}
      {#each [0, 250, 500, 750, 1000, 1250] as um (um)}
        <line x1={xr(um) + 90} x2={xr(um) + 90} y1={ROWS.length * 26 + 4} y2={ROWS.length * 26 + 10} stroke="#2a1d15" />
        <text x={xr(um) + 90} y={ROWS.length * 26 + 26} text-anchor="middle" class="tick">{um} µm</text>
      {/each}
      <line x1={xr(0) + 90} x2={xr(RULER_MAX) + 90} y1={ROWS.length * 26 + 4} y2={ROWS.length * 26 + 4} stroke="#2a1d15" />
      <text x={xr(0) + 90} y={ROWS.length * 26 + 46} class="tick">finer</text>
      <text x={xr(RULER_MAX) + 90} y={ROWS.length * 26 + 46} text-anchor="end" class="tick">coarser</text>
    </svg>
  </figure>
</div>

<style>
  .gg { --rule: #d9cdbd; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --crema: #c3873a; --crema-deep: #8f5d22;
    display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); background: #fbf8f3; border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .loupe-wrap { padding: 22px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #f4ece0 80%); display: flex; flex-direction: column; align-items: center; }
  .loupe { width: 100%; max-width: 340px; height: auto; }
  .sb { font: 500 11px 'IBM Plex Mono', monospace; fill: #2a1d15; }
  .cap { font-size: 12.5px; color: var(--ink-3); margin: 6px 0 0; }
  .panel { padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .chips, .seg { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button, .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 7px 12px; min-height: 36px; font: 500 13px/1 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'], .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .name { font: 400 44px/1 'Instrument Serif', Georgia, serif; margin: 6px 0 0; }
  .sub { font: 400 14px 'IBM Plex Mono', monospace; color: var(--ink-2); margin: 6px 0 0; }
  .warn { margin: 0; font-size: 14px; color: var(--crema-deep); background: rgba(195, 135, 58, .08); border-left: 2px solid var(--crema); padding: 8px 12px; }
  .too { margin: 0; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .too div { padding: 10px 0; }
  .too div + div { border-left: 1px solid var(--rule); padding-left: 12px; }
  dt { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  dd { margin: 6px 0 0; font-size: 14.5px; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .go { background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 13px 20px; font: 600 15px/1 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 11px 15px; font: 500 14px/1 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ruler { grid-column: 1 / -1; margin: 0; padding: 16px 22px 14px; border-top: 1px solid var(--rule); }
  .ruler svg { width: 100%; height: auto; display: block; }
  .rl { font: 500 12.5px 'IBM Plex Sans', sans-serif; fill: var(--ink-2); }
  .row { cursor: pointer; }
  .row rect { fill: #e5d5bf; transition: fill .2s; }
  .row.on rect { fill: #8f5d22; }
  .row.on .rl { fill: var(--ink); font-weight: 600; }
  .tick { font: 400 11px 'IBM Plex Mono', monospace; fill: var(--ink-3); }
  button:focus-visible, a:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 820px) { .gg { grid-template-columns: 1fr; } .loupe-wrap { border-right: 0; border-bottom: 1px solid var(--rule); } .loupe { max-width: 240px; } .name { font-size: 36px; } .too { grid-template-columns: 1fr; } .too div + div { border-left: 0; padding-left: 0; border-top: 1px dashed var(--rule); } .ruler { padding: 12px 8px; } .rl { font-size: 15px; } .tick { font-size: 13px; } }
</style>
