<script lang="ts">
  import { onMount, tick } from 'svelte';
  import podData from '../../data/nespressoPods.json';
  import { catalog, sizeRows, filterPods, wall, tryAlso, podFromParam, buySearch, blendText, aromaFamilies, LINES, ROASTS, AROMA_FAMILIES } from '../../lib/coffee/pods.ts';
  import type { Line, Pod, Roast, RawPod, SizeRow } from '../../lib/coffee/pods.ts';

  // The capsule wall: pick your machine, then every capsule it takes, by cup size (rows) and
  // intensity (columns). Picking one pours its cup at its true volume beside the others.
  const pods = catalog(podData.pods as RawPod[]);
  const COLS = 13;
  const LINE_IDS: Line[] = ['original', 'vertuo'];

  let line = $state<Line | null>(null);
  let selectedId = $state<string | null>(null);
  let query = $state('');
  let roast = $state<Roast | 'all'>('all');
  let family = $state<string>('all');
  let category = $state<string>('all');
  let decaf = $state(false);
  let flavored = $state<'any' | 'only' | 'none'>('any');
  let includeDiscontinued = $state(false);
  let view = $state<'wall' | 'list'>('wall');
  let flight = $state<string[]>([]);
  let mounted = $state(false);
  let panelEl = $state<HTMLElement | null>(null);
  // Filters start open on wide screens and folded on phones, so the wall is the first thing you see there.
  let filtersOpen = $state(true);
  // Phones get the wall turned on its side (see the template).
  let narrow = $state(false);

  let rows = $derived(line ? sizeRows(pods, line) : []);
  let all = $derived(line ? pods.filter((p) => p.line === line && (includeDiscontinued || !p.discontinued)) : []);
  let shown = $derived(line ? filterPods(pods, { line, query, roast, family, category, decaf, flavored, includeDiscontinued }) : []);
  let shownIds = $derived(new Set(shown.map((p) => p.id)));
  let placed = $derived(rows.length ? wall(all, rows) : []);
  let categories = $derived(line ? [...new Set(pods.filter((p) => p.line === line).map((p) => p.category))].sort() : []);
  let selected = $derived(selectedId ? pods.find((p) => p.id === selectedId) ?? null : null);
  let suggestion = $derived(selected ? tryAlso(pods, selected) : null);
  let flightPods = $derived(flight.map((id) => pods.find((p) => p.id === id)).filter((p): p is Pod => !!p && p.line === line));
  let filtering = $derived(!!query.trim() || roast !== 'all' || family !== 'all' || category !== 'all' || decaf || flavored !== 'any');
  let maxMl = $derived(rows.length ? Math.max(...rows.map((r) => r.ml)) : 1);

  function choose(l: Line) {
    if (l !== line) { selectedId = null; category = 'all'; }
    line = l;
    try { localStorage.setItem('jayarr-pods-machine', l); } catch { /* storage unavailable */ }
  }
  async function pick(p: Pod) {
    selectedId = selectedId === p.id ? null : p.id;
    // On a phone the panel sits below the wall: bring the answer into view.
    if (selectedId && matchMedia('(max-width: 900px)').matches) { await tick(); panelEl?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
  }
  function clearFilters() { query = ''; roast = 'all'; family = 'all'; category = 'all'; decaf = false; flavored = 'any'; }
  function toggleFlight(p: Pod) {
    flight = flight.includes(p.id) ? flight.filter((x) => x !== p.id) : [...flight.filter((id) => pods.find((x) => x.id === id)?.line === p.line), p.id].slice(-3);
    try { localStorage.setItem('jayarr-pods-flight', JSON.stringify(flight)); } catch { /* storage unavailable */ }
  }

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const fromLink = podFromParam(pods, q.get('pod'));
    const l = q.get('line');
    let saved: string | null = null;
    try { saved = localStorage.getItem('jayarr-pods-machine'); const f = JSON.parse(localStorage.getItem('jayarr-pods-flight') ?? '[]'); if (Array.isArray(f)) flight = f.filter((x) => typeof x === 'string').slice(0, 3); } catch { /* storage unavailable */ }
    // A pod in a link decides the system; otherwise the link's line, otherwise your machine from last time.
    if (fromLink) { line = fromLink.line; selectedId = fromLink.id; if (fromLink.discontinued) includeDiscontinued = true; }
    else if (l === 'original' || l === 'vertuo') line = l;
    else if (saved === 'original' || saved === 'vertuo') line = saved;
    const mq = matchMedia('(max-width: 640px)');
    filtersOpen = !mq.matches; narrow = mq.matches;
    mq.addEventListener('change', (e) => { narrow = e.matches; });
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    if (line) q.set('line', line);
    if (selected) q.set('pod', selected.slug);
    history.replaceState(history.state, '', q.toString() ? `${location.pathname}?${q}` : location.pathname);
  });
  function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && selectedId) selectedId = null; }

  const label = (p: Pod) => `${p.name}: ${p.size}, ${p.ml} ml, ${p.intensity ? `intensity ${p.intensity}` : 'no intensity rating'}${p.discontinued ? ', discontinued' : ''}`;
  const roastStep = (r: Roast) => ROASTS.indexOf(r);
</script>

<svelte:window onkeydown={onKey} />

{#snippet capsule(l: Line, color: string, size = 24)}
  <svg viewBox="0 0 24 22" width={size} height={size * 22 / 24} aria-hidden="true" class="cap">
    {#if l === 'original'}
      <path d="M3.4 7.2 L7.6 18.6 Q12 20.6 16.4 18.6 L20.6 7.2 Z" fill={color} />
      <path d="M5.6 8 L9 18.4 Q9.8 19 10.6 19.2 L7.6 8 Z" fill="#fff" fill-opacity=".22" />
      <ellipse cx="12" cy="7" rx="10.6" ry="3" fill="#d8d0c5" stroke="#9c9186" stroke-width=".6" />
      <ellipse cx="12" cy="6.6" rx="7" ry="1.5" fill="#efe9e1" />
    {:else}
      <ellipse cx="12" cy="17.6" rx="11.2" ry="2.8" fill="#d8d0c5" stroke="#9c9186" stroke-width=".6" />
      <path d="M3.8 17 C3.8 8.6 7.6 3 12 3 C16.4 3 20.2 8.6 20.2 17 Z" fill={color} />
      <path d="M7.4 15.8 C7.4 10 9 6.4 11.4 5 C9.8 7.4 9.2 11 9.4 15.8 Z" fill="#fff" fill-opacity=".24" />
    {/if}
  </svg>
{/snippet}

{#snippet bigCapsule(l: Line, color: string, uid: string, size: number)}
  {#if l === 'original'}
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id="og-{uid}" x1="0" y1="0" x2="1" y2="0.08"><stop offset="0%" stop-color={color} stop-opacity="0.55" /><stop offset="18%" stop-color={color} stop-opacity="0.95" /><stop offset="42%" stop-color={color} /><stop offset="68%" stop-color={color} stop-opacity="0.85" /><stop offset="100%" stop-color={color} stop-opacity="0.4" /></linearGradient>
        <linearGradient id="rim-{uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#909090" /><stop offset="30%" stop-color="#D0D0D0" /><stop offset="50%" stop-color="#ECECEC" /><stop offset="70%" stop-color="#D0D0D0" /><stop offset="100%" stop-color="#888" /></linearGradient>
      </defs>
      <ellipse cx="50" cy="93" rx="16" ry="3" fill="rgba(0,0,0,0.1)" />
      <path d="M 16,35 L 28,84 Q 33,90 50,91 Q 67,90 72,84 L 84,35 Z" fill="url(#og-{uid})" />
      <path d="M 21,37 L 31,84 Q 33,88 38,90 L 34,84 L 25,37 Z" fill="rgba(255,255,255,0.18)" />
      <path d="M 79,37 L 69,84 Q 67,88 62,90 L 66,84 L 75,37 Z" fill="rgba(0,0,0,0.07)" />
      <ellipse cx="50" cy="33" rx="44" ry="13" fill="url(#rim-{uid})" stroke="#AAA" stroke-width="0.3" />
      <path d="M 6,33 Q 6,42 12,45 Q 26,51 50,52 Q 74,51 88,45 Q 94,42 94,33" fill="#B5B5B5" opacity="0.3" />
      <ellipse cx="50" cy="31" rx="32" ry="8" fill="#D0D0D0" opacity="0.5" />
      <ellipse cx="44" cy="29" rx="14" ry="4" fill="rgba(255,255,255,0.3)" />
    </svg>
  {:else}
    <svg viewBox="0 0 130 115" width={size} height={size * 115 / 130} aria-hidden="true">
      <defs>
        <radialGradient id="vd-{uid}" cx="0.35" cy="0.28" r="0.6"><stop offset="0%" stop-color={color} /><stop offset="35%" stop-color={color} stop-opacity="0.95" /><stop offset="65%" stop-color={color} stop-opacity="0.8" /><stop offset="100%" stop-color={color} stop-opacity="0.5" /></radialGradient>
        <linearGradient id="sc-{uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#909090" /><stop offset="20%" stop-color="#C8C8C8" /><stop offset="40%" stop-color="#E8E8E8" /><stop offset="60%" stop-color="#D0D0D0" /><stop offset="80%" stop-color="#DDD" /><stop offset="100%" stop-color="#888" /></linearGradient>
      </defs>
      <ellipse cx="65" cy="110" rx="50" ry="5" fill="rgba(0,0,0,0.08)" />
      <ellipse cx="65" cy="90" rx="58" ry="15" fill="url(#sc-{uid})" stroke="#AAA" stroke-width="0.3" />
      <path d="M 7,90 Q 7,100 14,104 Q 30,112 65,113 Q 100,112 116,104 Q 123,100 123,90" fill="#C0C0C0" opacity="0.35" />
      <g opacity="0.35">{#each [[12, 2.5, -6], [18, 1.5, -5], [23, 2.5, -4], [28, 1.5, -3], [102, 1.5, 3], [107, 2.5, 4], [112, 1.5, 5], [118, 2.5, 6]] as [bx, bw, br] (bx)}<rect x={bx} y="86" width={bw} height="8" fill="#333" rx="0.5" transform="rotate({br},{bx},90)" />{/each}</g>
      <path d="M 18,86 C 18,42 38,8 65,8 C 92,8 112,42 112,86 Z" fill="url(#vd-{uid})" />
      <path d="M 18,86 Q 16,92 22,96 Q 35,103 65,105 Q 95,103 108,96 Q 114,92 112,86" fill={color} opacity="0.75" />
      <path d="M 38,86 Q 42,60 48,40 M 53,86 Q 56,55 60,30 M 68,86 Q 69,55 68,28 M 82,86 Q 80,58 76,36" fill="none" stroke="rgba(0,0,0,0.09)" stroke-width="1.2" />
      <path d="M 42,30 Q 50,15 62,10 Q 72,8 82,14 Q 72,9 62,8 Q 50,10 44,20 Q 38,32 42,30 Z" fill="rgba(255,255,255,0.4)" />
      <path d="M 28,55 Q 34,40 44,30 Q 48,26 52,28 Q 42,34 34,48 Q 28,60 30,65 Z" fill="rgba(255,255,255,0.1)" />
    </svg>
  {/if}
{/snippet}

{#snippet wallPod(x: { pod: Pod })}
  {#if shownIds.has(x.pod.id)}
    <button type="button" class="pod" class:sel={selectedId === x.pod.id} class:gone={x.pod.discontinued} class:inflight={flight.includes(x.pod.id)} aria-pressed={selectedId === x.pod.id} aria-label={label(x.pod)} title={x.pod.name} onclick={() => pick(x.pod)}>{@render capsule(line!, x.pod.color_hex, 28)}</button>
  {:else}
    <span class="pod ghost" aria-hidden="true">{@render capsule(line!, '#d9cdbd', 28)}</span>
  {/if}
{/snippet}

<!-- The cups a system makes, one width, height by volume: so 414 ml looks ten times 40 ml. -->
{#snippet ladder(fill: Pod | null, compact = false, rws: SizeRow[] = rows)}
  {@const H = compact ? 64 : 112}
  {@const W = compact ? 22 : 30}
  {@const gap = compact ? 10 : 16}
  {@const top = Math.max(...rws.map((r) => r.ml))}
  <svg viewBox="0 0 {rws.length * (W + gap)} {H + (compact ? 18 : 30)}" style:width={compact ? `${rws.length * (W + gap)}px` : null} class="ladder" role="img" aria-label={fill ? `${fill.name} pours ${fill.ml} ml, drawn beside the other ${LINES[fill.line].label} cup sizes at one scale.` : 'The cup sizes, drawn at one scale.'}>
    {#each rws as r, i (r.key)}
      {@const h = Math.max(2, (r.ml / Math.max(top, compact ? 414 : top)) * H)}
      {@const x = i * (W + gap) + gap / 2}
      {@const on = !!fill && fill.size === r.name && fill.ml === r.ml}
      <rect x={x} y={H - h} width={W} height={h} rx="2" class="glass" class:on />
      {#if on}
        <rect x={x + 1.5} y={H - h + 1.5} width={W - 3} height={h - 3} rx="1.5" class="pour" fill="#3b2214" />
        <rect x={x + 1.5} y={H - h + 1.5} width={W - 3} height={Math.min(4, h - 3)} rx="1" class="pour crema" fill="#b77a3c" />
      {/if}
      <text x={x + W / 2} y={H + 13} text-anchor="middle" class="lml" class:on>{r.ml}</text>
      {#if !compact}<text x={x + W / 2} y={H + 26} text-anchor="middle" class="lnm" class:on>{r.name === 'Double Espresso' ? 'Double' : r.name === 'Gran Lungo' ? 'Gran L.' : r.name}</text>{/if}
    {/each}
  </svg>
{/snippet}

<div class="px">
  <div class="machine" role="group" aria-label="Your machine">
    <span class="lbl">Your machine</span>
    {#each LINE_IDS as l (l)}
      <button type="button" class="mch" aria-pressed={line === l} onclick={() => choose(l)}>
        {@render capsule(l, l === 'original' ? '#7a4e30' : '#3b2214', 30)}
        <span><b>{LINES[l].label}</b><small>{LINES[l].short}</small></span>
      </button>
    {/each}
  </div>

  {#if !line}
    <div class="ask">
      <h3>Which machine do you have?</h3>
      <p>Original and Vertuo capsules don't fit each other's machines, so the wall shows one system at a time. Your choice stays on this device.</p>
      <div class="ask-cards">
        {#each LINE_IDS as l (l)}
          <button type="button" class="ask-card" onclick={() => choose(l)}>
            {@render bigCapsule(l, l === 'original' ? '#7a4e30' : '#3b2214', `ask-${l}`, 84)}
            <b>{LINES[l].label}</b>
            <span>{LINES[l].how}</span>
            <span class="askladder">{@render ladder(null, true, sizeRows(pods, l))}<small class="askml">cup sizes, ml</small></span>
            <small>{pods.filter((p) => p.line === l && !p.discontinued).length} capsules</small>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <details class="filters" bind:open={filtersOpen}>
      <summary><span>Filters{filtering ? ' (on)' : ''}</span></summary>
    <div class="tools">
      <label class="search"><span class="sr">Search capsules</span><input type="search" bind:value={query} placeholder="Search by name or note" /></label>
      <label class="sel"><span class="lbl">Roast</span>
        <select bind:value={roast}><option value="all">Any</option>{#each ROASTS as r (r)}<option value={r}>{r}</option>{/each}</select></label>
      <label class="sel"><span class="lbl">Aroma</span>
        <select bind:value={family}><option value="all">Any</option>{#each AROMA_FAMILIES as f (f.id)}<option value={f.id}>{f.label}</option>{/each}</select></label>
      <label class="sel"><span class="lbl">Range</span>
        <select bind:value={category}><option value="all">All</option>{#each categories as c (c)}<option value={c}>{c}</option>{/each}</select></label>
      <label class="sel"><span class="lbl">Flavoured</span>
        <select bind:value={flavored}><option value="any">Either</option><option value="none">Not flavoured</option><option value="only">Flavoured only</option></select></label>
      <label class="chk"><input type="checkbox" bind:checked={decaf} /> Decaf</label>
      <label class="chk"><input type="checkbox" bind:checked={includeDiscontinued} /> Show discontinued</label>
      <div class="seg" role="group" aria-label="View">
        <button type="button" aria-pressed={view === 'wall'} onclick={() => (view = 'wall')}>Wall</button>
        <button type="button" aria-pressed={view === 'list'} onclick={() => (view = 'list')}>List</button>
      </div>
    </div>
    </details>
    <p class="count" aria-live="polite">{shown.length === all.length ? `${all.length} ${LINES[line].label} capsules` : `${shown.length} of ${all.length} ${LINES[line].label} capsules match`}{#if filtering} · <button type="button" class="linkish" onclick={clearFilters}>Clear filters</button>{/if}</p>

    <div class="body">
      <div class="stage">
        {#if view === 'wall' && narrow}
          <div class="wall tall" role="group" aria-label="{LINES[line].label} capsules by intensity and cup size">
            <div class="thead" style:--n={rows.length} aria-hidden="true">
              <span class="corner">int.</span>
              {#each rows as r (r.key)}<span><b>{r.name === 'Double Espresso' ? 'Double' : r.name === 'Gran Lungo' ? 'Gran L.' : r.name}</b><small>{r.ml} ml</small></span>{/each}
            </div>
            {#each Array.from({ length: COLS + 1 }, (_, c) => c) as c (c)}
              {@const here = placed.filter((x) => x.col === c)}
              <div class="trow" class:empty={here.length === 0} class:nr={c === 0} style:--n={rows.length} role="group" aria-label={c === 0 ? 'Not rated' : `Intensity ${c}`}>
                <span class="tl" aria-hidden="true">{c === 0 ? 'n/r' : c}</span>
                {#each rows as r, ri (r.key)}
                  <div class="cell">{#each here.filter((x) => x.row === ri) as x (x.pod.id)}{@render wallPod(x)}{/each}</div>
                {/each}
              </div>
            {/each}
            <p class="axis tallaxis" aria-hidden="true">Intensity runs down, mild to intense (Nespresso's 1–13: roast and body, not caffeine); <b>n/r</b> = not rated.</p>
          </div>
        {:else if view === 'wall'}
          <div class="wall" role="group" aria-label="{LINES[line].label} capsules by cup size and intensity">
            <div class="head" aria-hidden="true">
              <span class="corner">cup</span><span class="nr">n/r</span>
              {#each Array.from({ length: COLS }, (_, i) => i + 1) as n (n)}<span>{n}</span>{/each}
            </div>
            {#each rows as r, ri (r.key)}
              <div class="row" role="group" aria-label="{r.name}, {r.ml} ml">
                <div class="rl" aria-hidden="true"><span><b>{r.name}</b><small>{r.ml} ml</small></span></div>
                {#each Array.from({ length: COLS + 1 }, (_, c) => c) as c (c)}
                  <div class="cell" class:nr={c === 0}>
                    {#each placed.filter((x) => x.row === ri && x.col === c) as x (x.pod.id)}{@render wallPod(x)}{/each}
                  </div>
                {/each}
              </div>
            {/each}
            <p class="axis" aria-hidden="true"><span>milder</span><span>Nespresso intensity, 1–13: roast and body, not caffeine</span><span>more intense</span></p>
          </div>
        {:else}
          <div class="list-wrap">
            <table class="list">
              <thead><tr><th scope="col">Capsule</th><th scope="col">Cup</th><th scope="col">Intensity</th><th scope="col">Roast</th><th scope="col">Aroma</th></tr></thead>
              <tbody>
                {#each [...shown].sort((a, b) => a.ml - b.ml || (a.intensity ?? 0) - (b.intensity ?? 0) || a.name.localeCompare(b.name)) as p (p.id)}
                  <tr class:sel={selectedId === p.id}>
                    <th scope="row"><button type="button" class="lname" aria-pressed={selectedId === p.id} onclick={() => pick(p)}>{@render capsule(line, p.color_hex, 18)}{p.name}{#if p.discontinued}<em> (discontinued)</em>{/if}</button></th>
                    <td>{p.size} · {p.ml} ml</td><td class="num">{p.intensity ?? '–'}</td><td>{p.roast_level}</td><td>{p.aroma}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        {/if}
        {#if shown.length === 0}<p class="none">No {LINES[line].label} capsules match. <button type="button" class="linkish" onclick={clearFilters}>Clear filters</button></p>{/if}
      </div>

      <p class="sr" aria-live="polite">{selected ? `${selected.name} selected: ${selected.size}, ${selected.ml} ml.` : ''}</p>
      <aside class="panel" bind:this={panelEl} aria-label="Capsule details">
        {#if selected}
          <div class="detail">
            <button type="button" class="x" aria-label="Close {selected.name}" onclick={() => (selectedId = null)}>×</button>
            <div class="dhead">
              <div class="bigcap">{@render bigCapsule(selected.line, selected.color_hex, 'detail', 84)}</div>
              <div>
                <p class="kick">{LINES[selected.line].label} · {selected.size} · {selected.ml} ml</p>
                <h3>{selected.name}</h3>
                <p class="cat">{selected.category}{selected.decaf ? ' · Decaf' : ''}{selected.flavored ? ' · Flavoured' : ''}</p>
              </div>
            </div>
            {#if selected.discontinued}<p class="gone-note">Nespresso has discontinued this capsule, so it may be hard to find. {selected.note ?? ''}</p>{/if}
            <div class="meters">
              <div><span class="lbl">Intensity</span>
                {#if selected.intensity}
                  <span class="bar" role="img" aria-label="Intensity {selected.intensity} of 13">{#each Array.from({ length: 13 }, (_, i) => i) as i (i)}<i class:on={i < selected.intensity}></i>{/each}</span><span class="mono">{selected.intensity}<small>/13</small></span>
                {:else}<span class="mono quiet">Not rated by Nespresso</span>{/if}
              </div>
              <div><span class="lbl">Roast</span>
                <span class="bar roast" role="img" aria-label="Roast: {selected.roast_level}">{#each ROASTS as r, i (r)}<i class:on={i <= roastStep(selected.roast_level)}></i>{/each}</span><span class="mono">{selected.roast_level}</span>
              </div>
            </div>
            <dl class="facts">
              <div><dt>Aroma</dt><dd>{selected.aroma}</dd></div>
              <div><dt>Beans</dt><dd>{blendText(selected.blend)}</dd></div>
            </dl>
            <p class="desc">{selected.description}</p>
            <p class="best"><span class="lbl">Best for</span>{selected.best_for}</p>
            <figure class="pours">
              {@render ladder(selected)}
              <figcaption>What it pours: {selected.ml} ml, beside every {LINES[selected.line].label} cup size. One width, height by volume.</figcaption>
            </figure>
            {#if suggestion}
              <p class="try"><span class="lbl">Try also</span><button type="button" class="trybtn" onclick={() => pick(suggestion!)}>{@render capsule(suggestion.line, suggestion.color_hex, 20)}{suggestion.name}<small>{suggestion.size} · {suggestion.ml} ml</small></button></p>
            {/if}
            <div class="actions">
              {#if !selected.discontinued}<a class="go" href={buySearch(selected)} rel="sponsored noopener" target="_blank">Search Amazon for {LINES[selected.line].label} {selected.name} →</a>{/if}
              <button type="button" class="ghost" aria-pressed={flight.includes(selected.id)} onclick={() => toggleFlight(selected!)}>{flight.includes(selected.id) ? 'In your flight ✓' : 'Add to a tasting flight'}</button>
            </div>
            {#if !selected.discontinued}<p class="disc">The button opens an Amazon search for this {LINES[selected.line].label} capsule; as an Amazon Associate we earn from qualifying purchases.</p>{/if}
          </div>
        {:else}
          <div class="howto">
            <span class="lbl">Reading the wall</span>
            <p>{#if narrow}Each column is a cup size, smallest on the left; intensity runs down the rows, from mild to intense on Nespresso's 1–13 scale.{:else}Each row is a cup size, smallest at the top. Columns run from mild to intense on Nespresso's 1–13 scale.{/if} <b>n/r</b> holds capsules Nespresso doesn't rate. Pick a capsule to see what it pours.</p>
            {@render ladder(null)}
          </div>
        {/if}

        <div class="flight">
          <span class="lbl">Tasting flight{flightPods.length ? ` · ${flightPods.length} of 3` : ''}</span>
          {#if flightPods.length}
            <ul>
              {#each flightPods as p (p.id)}
                <li><button type="button" class="fl" onclick={() => pick(p)}>{@render capsule(p.line, p.color_hex, 26)}<span><b>{p.name}</b><small>{p.size} · {p.ml} ml · {p.intensity ? `intensity ${p.intensity}` : 'not rated'} · {p.roast_level}</small></span></button>
                  <button type="button" class="rm" aria-label="Remove {p.name} from the flight" onclick={() => toggleFlight(p)}>×</button></li>
              {/each}
            </ul>
            <p class="quiet small">Brew them side by side, same cup and milk (or none), and taste from mildest to most intense.</p>
          {:else}
            <p class="quiet small">Add up to three capsules to compare side by side. Kept on this device.</p>
          {/if}
        </div>
      </aside>
    </div>
    <p class="data">Range from Nespresso's chart and US site, checked March 2026; Nespresso changes it often, so check the box before you buy. Capsule colours are approximate. Aroma groups gather Nespresso's own aroma words.</p>
  {/if}
</div>

<style>
  .px {
    --paper: #f3ede3; --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    background: var(--card); border: 1px solid var(--rule); border-radius: 18px; color: var(--ink);
    font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); padding: 18px 20px 20px;
  }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 6px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .mono { font: 500 14px 'IBM Plex Mono', monospace; }
  .quiet { color: var(--ink-3); }
  .small { font-size: 13.5px; }

  .machine { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .machine .lbl { margin: 0 6px 0 0; }
  .mch { appearance: none; display: flex; gap: 10px; align-items: center; border: 1px solid var(--rule); background: #fff; border-radius: 14px; padding: 8px 14px 8px 10px; cursor: pointer; color: var(--ink); text-align: left; min-height: 52px; }
  .mch b { display: block; font: 600 15px/1.2 'IBM Plex Sans', sans-serif; }
  .mch small { display: block; font-size: 12.5px; color: var(--ink-3); }
  .mch[aria-pressed='true'] { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); background: #fffaf2; }

  .ask { padding: 28px 4px 8px; }
  .ask h3 { font: 400 34px/1.1 'Instrument Serif', Georgia, serif; margin: 0 0 6px; }
  .ask p { color: var(--ink-2); max-width: 60ch; margin: 0 0 16px; }
  .ask-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .ask-card { appearance: none; border: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 0%, #fffdf9, #f4ece0); border-radius: 16px; padding: 22px 18px; cursor: pointer; display: grid; justify-items: center; gap: 6px; text-align: center; color: var(--ink); }
  .ask-card b { font: 400 30px/1 'Instrument Serif', Georgia, serif; }
  .ask-card span { color: var(--ink-2); font-size: 14.5px; max-width: 34ch; }
  .ask-card small { font: 500 12px 'IBM Plex Mono', monospace; color: var(--crema-deep); letter-spacing: .08em; text-transform: uppercase; }
  .ask-card:hover, .mch:hover { border-color: var(--ink-3); }

  .filters { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--rule); }
  .filters summary { display: none; }
  .tools { display: flex; flex-wrap: wrap; gap: 10px 12px; align-items: flex-end; }
  .askladder { display: grid; justify-items: center; gap: 2px; width: 100%; margin-top: 6px; }
  .askladder :global(.ladder) { max-width: 180px; }
  .askml { font: 500 11.5px 'IBM Plex Mono', monospace; color: var(--ink-3); letter-spacing: 0; text-transform: none; }
  .search { flex: 1 1 200px; }
  .search input, .sel select { width: 100%; font: 400 15px 'IBM Plex Sans', sans-serif; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 10px; background: #fff; color: var(--ink); min-height: 40px; }
  .sel { flex: 0 1 150px; }
  .chk { display: flex; gap: 6px; align-items: center; font-size: 14.5px; min-height: 40px; }
  .chk input { width: 18px; height: 18px; accent-color: var(--crema-deep); }
  .seg { display: flex; border: 1px solid var(--rule); border-radius: 999px; overflow: hidden; margin-left: auto; }
  .seg button { appearance: none; border: 0; background: #fff; padding: 8px 14px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; }
  .count { margin: 12px 0 6px; font: 500 13px 'IBM Plex Mono', monospace; color: var(--ink-2); }
  .linkish { appearance: none; border: 0; background: none; padding: 0; font: inherit; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }

  .body { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 18px; align-items: start; }
  .stage { background: radial-gradient(120% 90% at 50% 0%, #fffdf9 0%, #f4ece0 85%); border: 1px solid var(--rule); border-radius: 14px; padding: 12px 10px 8px; min-width: 0; }

  /* The wall: a label column, a "not rated" column, then intensity 1–13. */
  .wall { --lab: 92px; }
  /* 14 columns: "not rated", then intensity 1–13. */
  .head, .row { display: grid; grid-template-columns: var(--lab) repeat(14, minmax(0, 1fr)); align-items: stretch; }
  .head { font: 500 11.5px/1 'IBM Plex Mono', monospace; color: var(--ink-3); text-align: center; padding-bottom: 6px; border-bottom: 1px solid var(--rule); }
  .head .corner { text-align: left; letter-spacing: .12em; text-transform: uppercase; font-size: 10.5px; }
  .head .nr { font-size: 10.5px; }
  .row { border-bottom: 1px dashed var(--rule); min-height: 46px; }
  .row:last-of-type { border-bottom: 0; }
  .rl { display: flex; gap: 8px; align-items: center; padding: 6px 4px 6px 0; }
  .rl b { display: block; font: 600 13px/1.15 'IBM Plex Sans', sans-serif; }
  .rl small { display: block; font: 500 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .cell { display: flex; flex-wrap: wrap; align-content: center; justify-content: center; gap: 0; padding: 4px 0; }
  .cell.nr { background: repeating-linear-gradient(135deg, transparent 0 5px, rgba(117, 101, 90, .06) 5px 6px); }
  .pod { appearance: none; border: 0; background: none; padding: 1px; width: 32px; height: 28px; display: grid; place-items: center; cursor: pointer; border-radius: 7px; transition: transform .25s cubic-bezier(.2, .7, .2, 1); }
  .pod:hover { transform: translateY(-2px); }
  .pod.sel { background: #fff; box-shadow: 0 0 0 2px var(--ink), 0 6px 12px -6px rgba(42, 29, 21, .5); transform: translateY(-2px); }
  .pod.gone :global(.cap) { opacity: .55; }
  .pod.inflight { box-shadow: inset 0 -2px 0 var(--crema); }
  .pod.ghost { cursor: default; opacity: .7; }
  .thead, .trow { display: grid; grid-template-columns: 34px repeat(var(--n), minmax(0, 1fr)); }
  .thead { padding-bottom: 6px; border-bottom: 1px solid var(--rule); text-align: center; }
  .thead .corner { font: 500 10.5px 'IBM Plex Mono', monospace; color: var(--ink-3); text-align: left; align-self: end; }
  .thead b { display: block; font: 600 12px/1.15 'IBM Plex Sans', sans-serif; }
  .thead small { display: block; font: 500 11px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .trow { border-bottom: 1px dashed var(--rule); min-height: 34px; }
  .trow.empty { min-height: 16px; }
  .trow.nr { background: repeating-linear-gradient(135deg, transparent 0 5px, rgba(117, 101, 90, .06) 5px 6px); }
  .tl { font: 500 12px 'IBM Plex Mono', monospace; color: var(--ink-3); align-self: center; }
  /* Two capsules side by side in a 5-column phone cell (about 58 px at 360 px wide). */
  .tall .pod { width: 29px; height: 28px; }
  .tall .pod :global(.cap) { width: 25px; }
  .axis.tallaxis { display: block; margin: 8px 0 0; font-size: 11.5px; line-height: 1.4; }
  .axis { display: flex; justify-content: space-between; gap: 8px; margin: 8px 0 0 var(--lab); font: 400 11.5px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .axis span:nth-child(2) { text-align: center; }

  .list-wrap { overflow-x: auto; }
  .list { width: 100%; border-collapse: collapse; font-size: 14.5px; }
  .list th, .list td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #e6dccd; vertical-align: middle; }
  .list thead th { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .list .num { font-family: 'IBM Plex Mono', monospace; text-align: center; }
  .list tr.sel { background: #fff8ec; }
  .lname { appearance: none; border: 0; background: none; padding: 4px 0; display: inline-flex; gap: 8px; align-items: center; font: 600 14.5px 'IBM Plex Sans', sans-serif; color: var(--ink); cursor: pointer; text-align: left; min-height: 32px; }
  .lname em { font-weight: 400; color: var(--ink-3); }
  .none { margin: 10px 4px; color: var(--ink-2); }

  .panel { display: flex; flex-direction: column; gap: 14px; min-width: 0; scroll-margin-top: 90px; }
  .detail { position: relative; border: 1px solid var(--rule); border-radius: 14px; background: #fff; padding: 16px 16px 14px; }
  .x { position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; font-size: 18px; cursor: pointer; color: var(--ink-2); }
  .dhead { display: flex; gap: 14px; align-items: center; padding-right: 36px; }
  .bigcap { flex: none; filter: drop-shadow(0 8px 10px rgba(42, 29, 21, .22)); }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  .detail h3 { font: 400 36px/1.02 'Instrument Serif', Georgia, serif; margin: 4px 0 2px; }
  .cat { margin: 0; color: var(--ink-3); font-size: 14px; }
  .gone-note { margin: 10px 0 0; padding: 8px 10px; border-radius: 8px; background: #f6efe5; color: var(--ink-2); font-size: 14px; }
  .meters { display: grid; gap: 10px; margin-top: 14px; }
  .meters > div { display: grid; grid-template-columns: 78px 1fr auto; align-items: center; gap: 10px; }
  .meters .lbl { margin: 0; }
  .bar { display: grid; grid-template-columns: repeat(13, 1fr); gap: 2px; height: 10px; }
  .bar.roast { grid-template-columns: repeat(4, 1fr); }
  .bar i { background: #ece3d6; border-radius: 2px; }
  .bar i.on { background: #7a4e30; }
  .bar.roast i.on { background: linear-gradient(90deg, #b77a3c, #3b2214); background-size: 400% 100%; }
  .mono small { color: var(--ink-3); font-size: 11px; }
  .facts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 14px 0 0; }
  .facts dt { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .facts dd { margin: 4px 0 0; font-size: 14.5px; }
  .desc { margin: 12px 0 0; color: var(--ink-2); font-size: 15px; }
  .best { margin: 10px 0 0; font-size: 14.5px; }
  .pours { margin: 14px 0 0; padding: 10px 6px 4px; border-top: 1px dashed var(--rule); }
  .pours figcaption, .howto p { font-size: 13px; color: var(--ink-3); margin: 6px 0 0; }
  .ladder { width: 100%; max-width: 320px; height: auto; display: block; margin: 0 auto; }
  .ladder :global(.glass) { fill: #fffdf9; stroke: #9c8f82; stroke-width: 1.2; }
  .ladder :global(.glass.on) { stroke: var(--ink); stroke-width: 1.6; }
  .ladder :global(.pour) { transform-box: fill-box; transform-origin: 50% 100%; animation: pour .7s cubic-bezier(.2, .7, .2, 1) both; }
  .ladder :global(.lml) { font: 500 10px 'IBM Plex Mono', monospace; fill: #75655a; }
  .ladder :global(.lnm) { font: 400 9.5px 'IBM Plex Sans', sans-serif; fill: #75655a; }
  .ladder :global(.lml.on), .ladder :global(.lnm.on) { fill: #2a1d15; font-weight: 600; }
  @keyframes pour { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  .try { margin: 12px 0 0; }
  .trybtn { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 6px 14px 6px 8px; display: inline-flex; gap: 8px; align-items: center; cursor: pointer; font: 600 14px 'IBM Plex Sans', sans-serif; color: var(--ink); min-height: 40px; }
  .trybtn small { font: 500 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .go { background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 12px 18px; font: 600 14.5px/1.2 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 10px 15px; font: 500 14px 'IBM Plex Sans', sans-serif; cursor: pointer; min-height: 44px; }
  .ghost[aria-pressed='true'] { border-color: var(--crema); background: #fff8ec; color: var(--ink); }
  .disc { font-size: 12.5px; color: var(--ink-3); margin: 8px 0 0; }
  .howto { border: 1px solid var(--rule); border-radius: 14px; background: #fff; padding: 14px 16px; }
  .howto p { font-size: 14.5px; color: var(--ink-2); margin: 0 0 10px; }
  .flight { border: 1px solid var(--rule); border-radius: 14px; background: #fff; padding: 12px 14px; }
  .flight ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
  .flight li { display: flex; align-items: center; gap: 6px; }
  .fl { appearance: none; border: 0; background: none; padding: 4px 0; display: flex; gap: 10px; align-items: center; cursor: pointer; text-align: left; color: var(--ink); flex: 1; min-height: 40px; }
  .fl b { display: block; font: 600 14.5px 'IBM Plex Sans', sans-serif; }
  .fl small { display: block; font: 500 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .rm { width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; cursor: pointer; color: var(--ink-3); }
  .data { margin: 14px 2px 0; font-size: 12.5px; color: var(--ink-3); }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }

  @media (max-width: 900px) {
    .body { grid-template-columns: 1fr; }
    .seg { margin-left: 0; }
  }
  @media (max-width: 640px) {
    .px { padding: 14px 12px 16px; border-radius: 14px; }
    .ask-cards { grid-template-columns: 1fr; }
    .ask h3 { font-size: 28px; }
    .wall { --lab: 46px; }
    .rl b { display: none; }
    .rl { gap: 4px; }
    .head { font-size: 10.5px; }
    .head .corner { font-size: 0; }
    .pod { width: 22px; height: 24px; }
    .pod :global(.cap) { width: 21px; height: auto; }
    .machine .lbl, .mch small { display: none; }
    .mch { flex: 1; padding: 6px 10px; min-height: 44px; }
    .filters summary { display: inline-flex; align-items: center; min-height: 40px; padding: 0 14px; border: 1px solid var(--rule); border-radius: 999px; background: #fff; font: 500 14px 'IBM Plex Sans', sans-serif; cursor: pointer; list-style: none; }
    .filters summary::-webkit-details-marker { display: none; }
    .filters[open] summary { margin-bottom: 10px; }
    .filters { padding-top: 10px; margin-top: 12px; }
    .howto :global(.ladder) { display: none; }
    .stage { padding: 10px 4px 6px; }
    .axis { font-size: 10.5px; margin-left: 0; }
    .axis span:nth-child(2) { display: none; }
    .sel { flex: 1 1 40%; }
    .detail h3 { font-size: 30px; }
  }
  @media (prefers-reduced-motion: reduce) { .pod, .ladder :global(.pour) { transition: none; animation: none; } }
</style>
