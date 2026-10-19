<script lang="ts">
  import { onMount } from 'svelte';
  import { METHODS, methodById } from '../../lib/coffee/index.ts';
  import type { MethodId } from '../../lib/coffee/index.ts';

  // Method bands come from the engine (methods.ts). The loupe is illustrative: particle sizes are
  // drawn in proportion to the method's micron band; a blade grinder adds dust and boulders.
  // brew: a Brew Guide recipe; doctor: Fix My Coffee covers it; calibrator: the Grind Calibrator has maker settings for it.
  type Row = { id: string; label: string; grindLabel: string; texture: string; grindMicrons: { min: number; max: number }; brew: boolean; doctor: boolean; calibrator: boolean; note?: string };
  // Turkish coffee has no Brew Guide recipe yet, so it is a grind-only row. Its band is TÜRKPATENT's: the Turkish Coffee
  // traditional-product-name registration (No. G8, 2026) sets an average particle size of 75–125 µm (FOLLOWUPS_2 item 40).
  // The Grind Calibrator has no Turkish rows (its maker research didn't record them), so there's no calibrator link (item 12).
  const ROWS: Row[] = [
    { id: 'turkish', label: 'Turkish', grindLabel: 'Extra fine', texture: 'flour', grindMicrons: { min: 75, max: 125 }, brew: false, doctor: false, calibrator: false, note: 'the average particle size in Türkiye\'s Turkish Coffee registration (TÜRKPATENT, 2026)' },
    ...(['espresso', 'moka', 'phin', 'aeropress', 'v60', 'kalita', 'chemex', 'drip-machine', 'cold-brew', 'french-press'] as MethodId[]).map((id) => { const x = methodById(id)!; return { id, label: x.label, grindLabel: x.grindLabel, texture: x.texture, grindMicrons: x.grindMicrons, brew: true, doctor: id !== 'phin', calibrator: id !== 'phin', note: x.grindNote }; }),
  ];
  const rowById = (id: string) => ROWS.find((r) => r.id === id)!;
  const RULER_MAX = 1300;
  // Common signs, tied to the selected recipe's own target time. Taste is the judge: other things
  // (water, freshness, pouring) cause the same tastes, so these are hedged and point to Fix My Coffee.
  const mmss = (sec: number) => (sec >= 3600 ? `${Math.round(sec / 3600)} h` : `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`);
  function tooText(id: string): { fine: string; coarse: string } {
    const x = methodById(id as MethodId);
    // Turkish is already the finest setting, so "too fine" is the grinder's limit, not a brewing mistake (Muse r4).
    if (id === 'turkish') return { fine: 'There is no useful finer setting: if the grinder clogs or the powder cakes, that is its limit.', coarse: 'The cup can taste thin, and the grounds feel gritty instead of silky.' };
    // Nguyen Coffee Supply's phin troubleshooting (How to Use & Clean, 2020; its FAQ), timed against its own recipe.
    if (id === 'phin') return { fine: 'It drips very slowly or stalls. A phin still wet from washing, or gas trapped under the press, can stall it too: Nguyen says to lift the press for about 2 seconds.', coarse: 'It rushes through well before Nguyen\'s 5:00. Less than 2 tablespoons (14 g) in a 4 oz phin can drip fast too, Nguyen says.' };
    if (!x) return { fine: '', coarse: '' };
    const t = x.timeS;
    if (id === 'espresso') return { fine: `The shot usually runs longer than about ${t.max} s at the same dose and yield, and can taste bitter or harsh.`, coarse: `The shot usually runs faster than about ${t.min} s, and can taste sour or thin.` };
    // Sputtering is the normal end of every moka brew, so it isn't a sign of a fine grind (Muse r4).
    if (id === 'moka') return { fine: 'It can flow slowly or stall, taste harsh, or clog the filter plate.', coarse: 'Coffee may rush out early and taste weak or sour.' };
    // A drip machine's pump sets its run time, so the visible signs are the basket and the taste.
    if (id === 'drip-machine') return { fine: 'The basket can flood or overflow, and the coffee can taste bitter.', coarse: 'Water runs straight through, and the coffee can taste weak or sour.' };
    if (x.family === 'percolation') return { fine: `It usually drains slower than this recipe's ${mmss(t.max)}, and can taste bitter or dry.`, coarse: `It usually drains faster than ${mmss(t.min)}, and can taste sour or thin.` };
    return { fine: id === 'aeropress' ? 'Pressing gets hard, and the cup can taste bitter.' : 'The cup can turn silty or muddy, harder to press or filter, and sometimes bitter.', coarse: id === 'aeropress' ? 'Water runs through before you press, and the cup can taste weak or sour.' : `At the usual ${mmss(t.min)} steep the cup can taste weak or sour.` };
  }

  let method = $state<string>('v60');
  let grinder = $state<'burr' | 'blade'>('burr');
  let mounted = $state(false);
  let m = $derived(rowById(method));
  let mid = $derived((m.grindMicrons.min + m.grindMicrons.max) / 2);
  let too = $derived(tooText(method));

  // Deterministic pseudo-random particles.
  function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  function poly(cx: number, cy: number, r: number, rnd: () => number) {
    const n = 6 + Math.floor(rnd() * 3), pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd() * 0.5, rr = r * (0.7 + rnd() * 0.45); pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`); }
    return pts.join(' ');
  }
  // Loupe shows a 3 mm field of view across 240 px (1 µm = 0.08 px).
  const PX_PER_UM = 240 / 3000;
  let drawn = $derived.by(() => {
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
    return { out, sizes };
  });
  let particles = $derived(drawn.out);
  // Spread of the drawn particles in 100 µm bins (by count, illustrative). Fines: under 100 µm.
  const BIN = 100, BINS = 16;
  let hist = $derived.by(() => {
    const h = Array.from({ length: BINS }, () => 0);
    for (const um of drawn.sizes) h[Math.min(BINS - 1, Math.floor(um / BIN))]++;
    const max = Math.max(...h, 1);
    return h.map((c) => c / max);
  });

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

  // The band, for screen readers: one polite sentence once the choice settles, not one per tap.
  // The band on screen when the page opens isn't read out; each later change is.
  let said = $state('');
  let quiet = true;
  $effect(() => {
    const s = `${m.label}: ${m.grindLabel.toLowerCase()}, like ${m.texture}, about ${m.grindMicrons.min} to ${m.grindMicrons.max} micrometers${grinder === 'blade' ? '. A blade grinder adds dust and large chunks' : ''}.`;
    if (!mounted) return;
    if (quiet) { quiet = false; return; }
    const t = setTimeout(() => (said = s), 700);
    return () => clearTimeout(t);
  });
</script>

<div class="gg">
  <div class="loupe-wrap">
    <svg class="loupe" viewBox="0 0 280 280" role="img" aria-label={`Magnified grounds for ${m.label}: ${m.grindLabel.toLowerCase()}, about ${m.grindMicrons.min} to ${m.grindMicrons.max} micrometers${grinder === 'blade' ? ', from a blade grinder with dust and large chunks mixed in' : ''}.`}>
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
      <!-- A light pill keeps the scale readable over dark grounds. -->
      <rect x={96 + 500 * PX_PER_UM - 22} y="226" width="44" height="18" rx="9" fill="#fbf8f3" opacity=".92" />
      <text x={96 + 500 * PX_PER_UM} y="240" text-anchor="middle" class="sb">1 mm</text>
    </svg>
    <p class="cap">Drawn to the 1 mm scale bar. An illustration of a typical spread, not a photo or a measurement.</p>
    <figure class="spread" aria-label={`Illustrative spread of particle sizes${grinder === 'blade' ? ' from a blade grinder: many more fines under 100 micrometers, and some large chunks' : ': most particles near the range, with a small share of fines under 100 micrometers'}.`}>
      <div class="bars" aria-hidden="true">
        {#each hist as hgt, i (i)}<span class="bar" class:fine={i === 0} class:band={i * BIN + BIN > m.grindMicrons.min && i * BIN < m.grindMicrons.max} style:height="{Math.max(2, hgt * 100)}%"></span>{/each}
      </div>
      <div class="axis" aria-hidden="true"><span>0 µm</span><span>800</span><span>1600+</span></div>
      <figcaption>Every grinder makes a spread of sizes, not one size. The range above is where most of the coffee should sit; the dark bar is the fines, which extract fastest. Blade grinders make far more fines and boulders. An illustrative shape, not a measured distribution.</figcaption>
    </figure>
  </div>

  <div class="panel">
    <div class="chips" role="group" aria-label="Brew method">
      {#each ROWS as r (r.id)}<button type="button" aria-pressed={method === r.id} onclick={() => (method = r.id)}>{r.label}</button>{/each}
    </div>
    <p class="sr" aria-live="polite" aria-atomic="true">{said}</p>
    <div class="head">
      <p class="name">{m.grindLabel}</p>
      <p class="sub">like {m.texture} · about {m.grindMicrons.min}–{m.grindMicrons.max} µm</p>
      {#if m.note}<p class="src">The micron range is {m.note}.</p>{/if}
    </div>
    <div class="seg" role="group" aria-label="Grinder type">
      <button type="button" aria-pressed={grinder === 'burr'} onclick={() => (grinder = 'burr')}>Burr grinder</button>
      <button type="button" aria-pressed={grinder === 'blade'} onclick={() => (grinder = 'blade')}>Blade grinder</button>
    </div>
    {#if grinder === 'blade'}<p class="warn">A blade chops rather than grinds, so it gives a wide spread of sizes, from dust to large chunks. A spread that wide can extract unevenly: the dust extracts fast and the chunks slowly. A burr grinder gives a more even grind.</p>{/if}
    <dl class="too">
      <div><dt>Signs it's too fine</dt><dd>{too.fine}</dd></div>
      <div><dt>Signs it's too coarse</dt><dd>{too.coarse}</dd></div>
    </dl>
    {#if m.doctor}
      <p class="hint">Taste is the judge: water, freshness and pouring cause the same tastes. <a href={`/tools/fix-my-coffee/${m.brew ? `?method=${method}` : ''}`}>Fix My Coffee</a> helps sort it out.</p>
    {:else if method === 'phin'}
      <p class="hint">For a phin that drips too fast or stalls, <a href="/tools/fix-my-coffee/?method=phin">Fix My Coffee</a> walks through Nguyen's troubleshooting.</p>
    {:else}
      <p class="hint">Taste is the judge: water, freshness and pouring cause the same tastes. <a href="/tools/fix-my-coffee/">Fix My Coffee</a> helps sort it out.</p>
    {/if}
    {#if !m.calibrator}<p class="hint">{method === 'phin' ? 'The Grind Calibrator has no phin settings; its moka pot settings are a place to start, since Nguyen likens the two grinds.' : 'The Grind Calibrator has no Turkish settings yet; your grinder\'s manual may list one.'}</p>{/if}
    <div class="actions">
      {#if m.calibrator}<a class="go" href={`/deep-brew/calibrator/?method=${method}`}>Find the setting on your grinder</a>{:else if method === 'phin'}<a class="go" href="/deep-brew/calibrator/?method=moka">Moka pot settings for your grinder</a>{/if}
      {#if m.brew}<a class="ghost" href={`/tools/brew-ratio/?method=${method}${method === 'espresso' ? '&dose=18' : method === 'moka' ? '&dose=15' : method === 'phin' ? '&dose=14' : '&cup=355'}`}>Brew Guide</a>{:else}<a class="ghost" href="/blog/turkish-coffee-guide/">Turkish coffee guide</a>{/if}
    </div>
  </div>

  <figure class="ruler">
    <figcaption class="rh">Grind size by brew method <span>micrometers (µm), typical ranges</span></figcaption>
    <div class="rows">
      {#each ROWS as mm (mm.id)}
        <button type="button" class="rrow" aria-pressed={mm.id === method} onclick={() => (method = mm.id)}>
          <span class="rl">{mm.label}</span>
          <span class="track" aria-hidden="true"><span class="fill" style:left="{(mm.grindMicrons.min / RULER_MAX) * 100}%" style:width="{((mm.grindMicrons.max - mm.grindMicrons.min) / RULER_MAX) * 100}%"></span></span>
          <span class="rv">{mm.grindMicrons.min}–{mm.grindMicrons.max}</span>
        </button>
      {/each}
      <div class="rrow axisrow" aria-hidden="true">
        <span></span>
        <span class="track scale">{#each [0, 250, 500, 750, 1000, 1250] as um (um)}<span class="tk" class:minor={um % 500 !== 0} style:left="{(um / RULER_MAX) * 100}%">{um}</span>{/each}</span>
        <span></span>
      </div>
    </div>
  </figure>
</div>

<style>
  .gg { --rule: #d9cdbd; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --crema: #c3873a; --crema-deep: #8f5d22;
    display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); background: #fbf8f3; border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Metrics', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .loupe-wrap { padding: 22px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #f4ece0 80%); display: flex; flex-direction: column; align-items: center; }
  .loupe { width: 100%; max-width: 340px; height: auto; }
  .sb { font: 500 14px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: #2a1d15; }
  .cap { font-size: 12.5px; color: var(--ink-3); margin: 6px 0 0; }
  .panel { padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; min-width: 0; }
  .chips, .seg { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button, .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 7px 12px; min-height: 36px; font: 500 13px/1 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'], .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .name { font: 400 44px/1 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; margin: 6px 0 0; }
  .sub { font: 400 14px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-2); margin: 6px 0 0; }
  .src { font-size: 12.5px; color: var(--ink-3); margin: 4px 0 0; }
  .warn { margin: 0; font-size: 14px; color: var(--crema-deep); background: rgba(195, 135, 58, .08); border-left: 2px solid var(--crema); padding: 8px 12px; }
  .too { margin: 0; display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .too div { padding: 10px 0; }
  .too div + div { border-left: 1px solid var(--rule); padding-left: 12px; }
  dt { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  dd { margin: 6px 0 0; font-size: 14.5px; }
  .actions { display: flex; gap: 8px; flex-wrap: wrap; }
  .go { background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 13px 20px; font: 600 15px/1 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 11px 15px; font: 500 14px/1 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ruler { grid-column: 1 / -1; margin: 0; padding: 16px 22px 18px; border-top: 1px solid var(--rule); }
  .rh { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 10px; }
  .rh span { letter-spacing: .04em; text-transform: none; margin-left: 8px; }
  .rows { display: grid; gap: 2px; }
  .rrow { appearance: none; border: 0; background: none; display: grid; grid-template-columns: 110px minmax(0, 1fr) 92px; gap: 12px; align-items: center; padding: 5px 6px; border-radius: 8px; cursor: pointer; text-align: left; color: var(--ink-2); font: inherit; }
  .rrow:hover { background: rgba(195, 135, 58, .07); }
  .rrow[aria-pressed='true'] { background: rgba(195, 135, 58, .12); color: var(--ink); }
  .rl { font: 500 14px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; }
  .rrow[aria-pressed='true'] .rl { font-weight: 600; }
  .track { position: relative; height: 14px; border-radius: 7px; background: #efe6d8; }
  .fill { position: absolute; top: 0; bottom: 0; border-radius: 7px; background: #d9c09c; }
  .rrow[aria-pressed='true'] .fill { background: #8f5d22; }
  .rv { font: 400 13px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); text-align: right; }
  .axisrow { cursor: default; padding-top: 0; }
  .axisrow:hover { background: none; }
  .scale { background: none; height: 18px; border-top: 1px solid var(--ink); border-radius: 0; }
  .tk { position: absolute; top: 3px; transform: translateX(-50%); font: 400 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); }
  .tk:first-child { transform: none; }
  .hint { font-size: 13.5px; color: var(--ink-3); margin: 0; }
  .hint a { color: #7a4e30; }
  .spread { margin: 14px 0 0; width: 100%; max-width: 340px; }
  .bars { display: flex; align-items: flex-end; gap: 2px; height: 54px; border-bottom: 1px solid var(--ink); }
  .bar { flex: 1; background: #d9c09c; border-radius: 2px 2px 0 0; }
  .bar.band { background: #b48a5c; }
  .bar.fine { background: #2a1d15; }
  .spread .axis { display: flex; justify-content: space-between; font: 400 11.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); margin-top: 3px; }
  .spread figcaption { font-size: 12.5px; color: var(--ink-3); margin-top: 6px; }
  button:focus-visible, a:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  .sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
  @media (max-width: 820px) { .gg { grid-template-columns: 1fr; } .loupe-wrap { border-right: 0; border-bottom: 1px solid var(--rule); } .loupe { max-width: 240px; } .name { font-size: 36px; } .too { grid-template-columns: 1fr; } .too div + div { border-left: 0; padding-left: 0; border-top: 1px dashed var(--rule); } .ruler { padding: 12px 10px 16px; } .rrow { grid-template-columns: 94px minmax(0, 1fr) 72px; gap: 8px; } .rl { font-size: 13px; white-space: nowrap; } .rv { font-size: 12.5px; } .tk.minor { display: none; } }
</style>
