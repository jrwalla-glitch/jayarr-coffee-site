<script lang="ts">
  import { onMount, tick, untrack } from 'svelte';
  import podData from '../../data/nespressoPods.json';
  import { catalog, sizeRows, filterPods, wall, tryAlso, similar, podFromParam, cleanFlight, rangeOf, buySearch, blendText, onSale, sizeName, STATUS_NOTE, LINES, ROASTS, AROMA_FAMILIES } from '../../lib/coffee/pods.ts';
  import type { Line, Pod, Roast, RawPod, SizeRow } from '../../lib/coffee/pods.ts';
  import { readLocal, writeLocal, canStore } from '../../lib/storage.ts';

  // The capsule wall: pick your machine, then every capsule it takes, by cup size and intensity.
  // Picking one pours its cup beside the system's other sizes. Every cup drawing on the page uses
  // one scale (the largest capsule's cup, 355 ml, is the full height), so systems compare honestly.
  const pods = catalog(podData.pods as RawPod[]);
  const COLS = 13;
  const LINE_IDS: Line[] = ['original', 'vertuo'];
  // The largest cup any capsule makes is the full height of every drawing.
  const ML_TOP = Math.max(...pods.map((p) => p.ml));
  const shortSize = (n: string) => (n === 'Double Espresso' ? 'Double' : n === 'Gran Lungo' ? 'Gran Lungo' : n);
  // The phone wall fits up to seven cup columns of about 47 px: short heads, with the exact ml beneath (WB2 Opus).
  // The ladder draws one glass per cup volume: Vertuo's Alto and its over-ice capsule are both 355 ml (Muse WB2 P-4).
  const ladderCols = (rws: SizeRow[]) => { const m = new Map<number, { key: string; ml: number; names: string[] }>(); for (const r of rws) { const c = m.get(r.ml); if (c) c.names.push(r.name); else m.set(r.ml, { key: r.key, ml: r.ml, names: [r.name] }); } return [...m.values()]; };
  const colLabel = (ns: string[]) => ns.map((n) => (n === 'Double Espresso' ? 'Double' : n === 'Gran Lungo' ? 'Gran L.' : n === 'Over ice' ? 'Ice' : n)).join('/');
  const TALL_HEAD: Record<string, string> = { Ristretto: 'Ristr.', Espresso: 'Espr.', 'Double Espresso': 'Double', 'Gran Lungo': 'Gran L.', Lungo: 'Lungo', Mug: 'Mug', Alto: 'Alto' };

  let line = $state<Line | null>(null);
  let selectedId = $state<string | null>(null);
  let query = $state('');
  let roast = $state<Roast | 'all'>('all');
  let family = $state<string>('all');
  let category = $state<string>('all');
  let decaf = $state(false);
  let flavored = $state<'any' | 'only' | 'none'>('any');
  let includeUnlisted = $state(false);
  let view = $state<'wall' | 'list'>('wall');
  let flight = $state<string[]>([]);
  // Said when the flight is full, instead of silently dropping a capsule you chose.
  let flightFull = $state<string | null>(null);
  // The capsule that opened the details, so focus can go back to it on close.
  let opener: HTMLElement | null = null;
  let headEl = $state<HTMLElement | null>(null);
  let mounted = $state(false);
  let panelEl = $state<HTMLElement | null>(null);
  // Filters start open on wide screens and folded on phones, so the wall is the first thing you see there.
  let filtersOpen = $state(true);
  // Phones get the wall turned on its side: 14 intensity columns can't give 24 px targets at 360 px.
  let narrow = $state(false);

  let rows = $derived(line ? sizeRows(pods, line) : []);
  let all = $derived(line ? pods.filter((p) => p.line === line && (includeUnlisted || onSale(p))) : []);
  let shown = $derived(line ? filterPods(pods, { line, query, roast, family, category, decaf, flavored, includeUnlisted }) : []);
  let roastsHere = $derived(ROASTS.filter((r) => all.some((p) => p.roast_level === r)));
  let shownIds = $derived(new Set(shown.map((p) => p.id)));
  let placed = $derived(rows.length ? wall(all, rows) : []);
  let categories = $derived(line ? [...new Set(pods.filter((p) => p.line === line).map(rangeOf))].sort() : []);
  // A ?pod= link that matched nothing: said once, instead of silently showing the chooser.
  let badLink = $state(false);
  let selected = $derived(selectedId ? pods.find((p) => p.id === selectedId) ?? null : null);
  let suggestion = $derived(selected ? tryAlso(pods, selected) : null);
  // No editorial suggestion: the nearest capsule on the same row, labelled as such (design gate r2).
  let near = $derived(selected && !suggestion ? similar(pods, selected) : null);
  // The flight is tasted mildest first, so it's shown in that order (unrated last).
  let flightPods = $derived(flight.map((id) => pods.find((p) => p.id === id)).filter((p): p is Pod => !!p && p.line === line).sort((a, b) => (a.intensity ?? 99) - (b.intensity ?? 99)));
  let filtering = $derived(!!query.trim() || roast !== 'all' || family !== 'all' || category !== 'all' || decaf || flavored !== 'any');

  // False when the browser won't keep the machine or the flight: the wall says so, and stops promising it.
  let storageOk = $state(true);
  function choose(l: Line) {
    if (l !== line) {
      selectedId = null; category = 'all';
      // A roast the other system doesn't use would leave an empty wall behind a blank select.
      if (roast !== 'all' && !pods.some((p) => p.line === l && p.roast_level === roast)) roast = 'all';
    }
    badLink = false;
    line = l;
    storageOk = writeLocal('jayarr-pods-machine', l);
  }
  // Set when a suggestion or the flight opens a capsule the filters had hidden: the filters clear, and we say so.
  let cleared = $state<string | null>(null);
  async function pick(p: Pod) {
    const active = document.activeElement;
    if (active instanceof HTMLElement && !panelEl?.contains(active)) opener = active;
    cleared = null;
    if (selectedId !== p.id && p.line === line && !shownIds.has(p.id)) {
      // The wall and the detail never disagree: clear what hides it rather than open a capsule the wall has dropped.
      if (filtering) { clearFilters(); cleared = p.name; }
      if (!onSale(p)) includeUnlisted = true;
    }
    selectedId = selectedId === p.id ? null : p.id;
    flightFull = null;
    // On a phone the panel sits below the wall: bring the answer into view, and keyboard focus with it.
    if (selectedId && matchMedia('(max-width: 900px)').matches) {
      await tick();
      panelEl?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      headEl?.focus({ preventScroll: true });
    }
  }
  async function closeDetail() {
    selectedId = null;
    await tick();
    if (opener?.isConnected) opener.focus();
    opener = null;
  }
  function clearFilters() { query = ''; roast = 'all'; family = 'all'; category = 'all'; decaf = false; flavored = 'any'; }
  function toggleFlight(p: Pod) {
    if (flight.includes(p.id)) flight = flight.filter((x) => x !== p.id);
    else {
      const same = flight.filter((id) => pods.find((x) => x.id === id)?.line === p.line);
      // Three per system is the most a flight holds: ask for a removal rather than dropping one silently.
      // The other system's flight is kept for when you switch back.
      if (same.length >= 3) { flightFull = p.name; return; }
      flight = [...flight, p.id];
    }
    flightFull = null;
    storageOk = writeLocal('jayarr-pods-flight', JSON.stringify(flight));
  }

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const fromLink = podFromParam(pods, q.get('pod'));
    if (q.get('pod') && !fromLink) badLink = true;
    const l = q.get('line');
    let saved: string | null = null;
    saved = readLocal('jayarr-pods-machine');
    try { flight = cleanFlight(pods, JSON.parse(readLocal('jayarr-pods-flight') ?? '[]')); } catch { /* unreadable flight */ }
    storageOk = canStore();
    // A pod in a link decides the system; otherwise the link's line, otherwise your machine from last time.
    if (fromLink) { line = fromLink.line; selectedId = fromLink.id; if (!onSale(fromLink)) includeUnlisted = true; }
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
  // When a filter change removes the open capsule, close it: the details never show a capsule the wall has dropped.
  $effect(() => {
    void [query, roast, family, category, decaf, flavored, includeUnlisted];
    untrack(() => { if (selectedId && line && !shownIds.has(selectedId)) selectedId = null; });
  });
  const fmtDate = (iso?: string) => iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'October 2026';
  function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && selectedId) closeDetail(); }

  const label = (p: Pod) => `${p.name}: ${p.size}, ${p.ml} ml, ${p.intensity ? `intensity ${p.intensity}` : 'no intensity rating'}${STATUS_NOTE[p.status] ? `, ${STATUS_NOTE[p.status].toLowerCase()}` : ''}${flight.includes(p.id) ? ', in your tasting flight' : ''}`;
  // Other cups Nespresso says the capsule makes, besides the one it sits under on the wall.
  const alsoBrews = (p: Pod) => (p.servings ?? []).filter((x) => !(x.cup_size === p.cup_size && x.ml === p.ml)).map((x) => `${sizeName(x).toLowerCase()} (${x.ml} ml)`);
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

<!-- The large capsule: the original explorer's detailed drawing, kept (DECISIONS #12), one gradient set per use. -->
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

<!-- One tall glass (the largest cup when full), filled to a cup's volume: the page's one scale, in miniature. -->
{#snippet glassAt(ml: number, H: number)}
  {@const h = Math.max(2.5, (ml / ML_TOP) * (H - 2))}
  <svg viewBox="0 0 16 {H + 2}" width="16" height={H + 2} aria-hidden="true" class="glass1">
    <rect x="1.5" y={H + 0.5 - h} width="13" height={h} fill="#3b2214" />
    <rect x="1.5" y={H + 0.5 - h} width="13" height={Math.min(2, h)} fill="#b77a3c" />
    <path d="M1 1 V{H + 1} H15 V1" fill="none" stroke="#5b4a3d" stroke-width="1.2" stroke-linejoin="round" />
  </svg>
{/snippet}

{#snippet wallPod(x: { pod: Pod })}
  {#if shownIds.has(x.pod.id)}
    <button type="button" class="pod" class:sel={selectedId === x.pod.id} class:gone={!onSale(x.pod)} class:inflight={flight.includes(x.pod.id)} aria-pressed={selectedId === x.pod.id} aria-label={label(x.pod)} onclick={() => pick(x.pod)}>{@render capsule(line!, x.pod.color_hex, 28)}<span class="tip" aria-hidden="true">{x.pod.name}</span></button>
  {:else}
    <span class="pod faded" aria-hidden="true">{@render capsule(line!, x.pod.color_hex, 28)}</span>
  {/if}
{/snippet}

<!-- The cups a system makes, at the page's one scale: so 355 ml looks nine times 40 ml, on either system. -->
{#snippet ladder(fill: Pod | null, H: number, rws: SizeRow[], names = true, reference = false)}
  {@const lcs = ladderCols(rws)}
  {@const W = 28}
  {@const gap = 18}
  <!-- Original's cups are small next to Vertuo's: a faint outline of the largest Vertuo cup shows why (design gate). -->
  {@const ref = reference && Math.max(...rws.map((r) => r.ml)) < ML_TOP}
  {@const cols = lcs.length + (ref ? 1 : 0)}
  <svg viewBox="0 0 {cols * (W + gap)} {H + (names ? 32 : 18)}" width={cols * (W + gap)} height={H + (names ? 32 : 18)} class="ladder" role="img" aria-label={fill ? `${fill.name} pours ${fill.ml} ml, drawn beside the other ${LINES[fill.line].label} cup sizes at one scale.` : `${rws.map((r) => `${r.name} ${r.ml} ml`).join(', ')}, drawn at one scale.`}>
    {#each lcs as r, i (r.key)}
      {@const h = Math.max(3, (r.ml / ML_TOP) * H)}
      {@const x = i * (W + gap) + gap / 2}
      {@const on = !!fill && fill.ml === r.ml && r.names.includes(fill.size)}
      <rect x={x} y={H - h} width={W} height={h} rx="2" class="glass" class:on />
      {#if on}
        <rect x={x + 1.5} y={H - h + 1.5} width={W - 3} height={h - 3} rx="1.5" class="pour" fill="#3b2214" />
        <rect x={x + 1.5} y={H - h + 1.5} width={W - 3} height={Math.min(4, h - 3)} rx="1" class="pour" fill="#b77a3c" />
      {/if}
      <text x={x + W / 2} y={H + 14} text-anchor="middle" class="lml" class:on>{r.ml}</text>
      {#if names}<text x={x + W / 2} y={H + 27} text-anchor="middle" class="lnm" class:on>{colLabel(r.names)}</text>{/if}
    {/each}
    {#if ref}
      {@const x = lcs.length * (W + gap) + gap / 2}
      <rect x={x} y="0.6" width={W} height={H - 0.6} rx="2" fill="none" stroke="#9c8f82" stroke-width="1" stroke-dasharray="3 4" opacity=".55" />
      <text x={x + W / 2} y={H + 14} text-anchor="middle" class="lml ref">{ML_TOP}</text>
      {#if names}<text x={x + W / 2} y={H + 27} text-anchor="middle" class="lnm ref">Vertuo</text>{/if}
    {/if}
  </svg>
{/snippet}

<div class="px">
  {#if !storageOk}<p class="full badlink" role="status">This browser isn't letting the page save, so your machine and tasting flight last only until you leave. The address bar keeps the machine and capsule you're on: copy that link to come back to them.</p>{/if}
  {#if badLink}<p class="full badlink" role="status">That capsule link didn't match a capsule we list, so nothing is open.{line ? '' : ' Pick your machine to browse.'}</p>{/if}
  {#if !line}
    <div class="ask">
      <h3>Which machine do you have?</h3>
      <p>Original and Vertuo capsules don't fit each other's machines, so the wall shows one system at a time.{storageOk ? ' Your choice stays on this device.' : ''}</p>
      <div class="ask-cards">
        {#each LINE_IDS as l (l)}
          <button type="button" class="ask-card" onclick={() => choose(l)}>
            <span class="art">{@render bigCapsule(l, l === 'original' ? '#7a4e30' : '#3b2214', `ask-${l}`, 84)}</span>
            <b>{LINES[l].label}</b>
            <span class="how">{LINES[l].how}</span>
            <span class="askladder">{@render ladder(null, 72, sizeRows(pods, l), true)}<small>its cup sizes in ml, at one scale</small></span>
            <small class="n">{pods.filter((p) => p.line === l && onSale(p)).length} capsules →</small>
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <div class="machine" role="group" aria-label="Your machine">
      <span class="lbl">Your machine</span>
      {#each LINE_IDS as l (l)}
        <button type="button" class="mch" aria-pressed={line === l} onclick={() => choose(l)}>
          {@render capsule(l, l === 'original' ? '#7a4e30' : '#3b2214', 30)}
          <span><b>{LINES[l].label}</b><small>{LINES[l].short}</small></span>
        </button>
      {/each}
    </div>

    <details class="filters" bind:open={filtersOpen}>
      <summary><span>Filters{filtering ? ' (on)' : ''}</span></summary>
      <div class="tools">
        <label class="search"><span class="sr">Search capsules</span><input type="search" bind:value={query} placeholder="Search by name or note" /></label>
        <label class="sel"><span class="lbl">Roast</span>
          <select bind:value={roast}><option value="all">Any</option>{#each roastsHere as r (r)}<option value={r}>{r}</option>{/each}</select></label>
        <label class="sel"><span class="lbl">Aroma</span>
          <select bind:value={family}><option value="all">Any</option>{#each AROMA_FAMILIES as f (f.id)}<option value={f.id}>{f.label}</option>{/each}</select></label>
        <label class="sel"><span class="lbl">Range</span>
          <select bind:value={category}><option value="all">All</option>{#each categories as c (c)}<option value={c}>{c}</option>{/each}</select></label>
        <label class="sel"><span class="lbl">Flavored</span>
          <select bind:value={flavored}><option value="any">Either</option><option value="none">Not flavored</option><option value="only">Flavored only</option></select></label>
        <label class="chk"><input type="checkbox" bind:checked={decaf} /> Decaf</label>
        <label class="chk"><input type="checkbox" bind:checked={includeUnlisted} /> Show retired and unlisted</label>
      </div>
    </details>
    <div class="countrow">
      <p class="count" aria-live="polite">{shown.length === all.length ? `${all.length} ${LINES[line].label} capsules` : `${shown.length} of ${all.length} ${LINES[line].label} capsules match`}{#if filtering}{' · '}<button type="button" class="linkish" onclick={clearFilters}>Clear filters</button>{/if}</p>
      <div class="seg" role="group" aria-label="View">
        <button type="button" aria-pressed={view === 'wall'} onclick={() => (view = 'wall')}>Wall</button>
        <button type="button" aria-pressed={view === 'list'} onclick={() => (view = 'list')}>List</button>
      </div>
    </div>

    <div class="body">
      <div class="stage">
        {#if view === 'wall' && narrow}
          <div class="wall tall" role="group" aria-label="{LINES[line].label} capsules by intensity and cup size">
            <div class="thead" style:--n={rows.length} aria-hidden="true">
              <span class="corner">int.</span>
              {#each rows as r (r.key)}<span class="th">{@render glassAt(r.ml, 22)}<b>{TALL_HEAD[r.name] ?? r.name}</b><small>{r.ml}&nbsp;ml</small></span>{/each}
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
            <p class="axis tallaxis" aria-hidden="true">Nespresso intensity runs down: roast and body, not caffeine. <b>n/r</b>: not rated.{#if flightPods.length}{' '}<span class="key"></span> in your flight.{/if}</p>
          </div>
        {:else if view === 'wall'}
          <div class="wall" role="group" aria-label="{LINES[line].label} capsules by cup size and intensity">
            <div class="head" aria-hidden="true">
              <span class="corner">cup</span><span class="nr">n/r</span>
              {#each Array.from({ length: COLS }, (_, i) => i + 1) as n (n)}<span>{n}</span>{/each}
            </div>
            {#each rows as r, ri (r.key)}
              <div class="row" role="group" aria-label="{r.name}, {r.ml} ml">
                <div class="rl" aria-hidden="true">{@render glassAt(r.ml, 30)}<span><b>{r.name}</b><small>{r.ml}&nbsp;ml</small></span></div>
                {#each Array.from({ length: COLS + 1 }, (_, c) => c) as c (c)}
                  <div class="cell" class:nr={c === 0}>
                    {#each placed.filter((x) => x.row === ri && x.col === c) as x (x.pod.id)}{@render wallPod(x)}{/each}
                  </div>
                {/each}
              </div>
            {/each}
            <p class="axis" aria-hidden="true"><span>← milder</span><span>intensity: roast and body, not caffeine</span><span>more intense →</span></p>
            {#if flightPods.length}<p class="axis keyrow" aria-hidden="true"><span><span class="key"></span> in your tasting flight</span></p>{/if}
          </div>
        {:else}
          <div class="list-wrap">
            <table class="list">
              <thead><tr><th scope="col">Capsule</th><th scope="col">Cup</th><th scope="col">Intensity</th><th scope="col">Roast</th><th scope="col">Aroma</th></tr></thead>
              <tbody>
                {#each [...shown].sort((a, b) => a.ml - b.ml || (a.intensity ?? 0) - (b.intensity ?? 0) || a.name.localeCompare(b.name)) as p (p.id)}
                  <tr class:sel={selectedId === p.id}>
                    <th scope="row"><button type="button" class="lname" aria-pressed={selectedId === p.id} onclick={() => pick(p)}>{@render capsule(line, p.color_hex, 20)}<span>{p.name}{#if STATUS_NOTE[p.status]}{' '}<em>({STATUS_NOTE[p.status].toLowerCase()})</em>{/if}</span></button></th>
                    <td class="nw">{shortSize(p.size)} · {p.ml}&nbsp;ml</td><td class="num">{p.intensity ?? 'n/r'}</td><td class="nw">{p.roast_level ?? '—'}</td><td>{p.aroma}</td>
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
            <button type="button" class="x" aria-label="Close {selected.name}" onclick={closeDetail}>×</button>
            {#if cleared}<p class="tag-note cleared" role="status">Your filters hid {cleared}, so they're cleared to show it.</p>{/if}
            <div class="dhead">
              <div class="bigcap">{@render bigCapsule(selected.line, selected.color_hex, 'detail', 84)}</div>
              <div>
                <p class="kick">{LINES[selected.line].label} · {selected.size} · {selected.ml} ml</p>
                <h3 tabindex="-1" bind:this={headEl}>{selected.name}</h3>
                {#if rangeOf(selected) !== selected.size || selected.decaf || selected.flavored}<p class="cat">{[rangeOf(selected) !== selected.size ? rangeOf(selected) : '', selected.decaf ? 'Decaf' : '', selected.flavored ? 'Flavored' : ''].filter(Boolean).join(' · ')}</p>{/if}
              </div>
            </div>
            {#if selected.status === 'retired'}<p class="gone-note">Nespresso has discontinued this capsule, so it may be hard to find. Its tasting notes are from our earlier catalogue and weren't rechecked.</p>
            {:else if selected.status === 'unlisted'}<p class="gone-note">Not in Nespresso's current US range when we checked on {fmtDate(selected.checked)}. It may be gone, or between seasons.</p>
            {:else if selected.status !== 'current'}<p class="tag-note">{STATUS_NOTE[selected.status]}: on sale for now, while Nespresso has it.</p>{/if}
            {#if selected.note}<p class="tag-note">{selected.note}</p>{/if}
            <div class="meters">
              <div><span class="lbl">Intensity</span>
                {#if selected.intensity}
                  <span class="bar" role="img" aria-label="Intensity {selected.intensity} of 13">{#each Array.from({ length: 13 }, (_, i) => i) as i (i)}<i class:on={i < selected.intensity}></i>{/each}</span><span class="mono">{selected.intensity}<small>/13</small></span>
                {:else}<span class="mono quiet">Not rated by Nespresso</span>{/if}
              </div>
              <div><span class="lbl">Roastiness, 1–5</span>
                {#if selected.roastiness}
                  <span class="bar roast" role="img" aria-label="Roastiness {selected.roastiness} of 5, by Nespresso">{#each Array.from({ length: 5 }, (_, i) => i) as i (i)}<i class:on={i < selected.roastiness}></i>{/each}</span><span class="mono">{selected.roastiness}<small>/5</small></span>
                {:else}<span class="mono quiet">Not rated on this scale</span><span></span>{/if}
              </div>
            </div>
            <dl class="facts">
              <div><dt>Aroma</dt><dd>{selected.aroma}</dd></div>
              <!-- Nespresso's US roast filter is a separate, coarser label from its 1–5 roastiness scale. -->
              {#if selected.roast_level}<div><dt>Roast filter</dt><dd>{selected.roast_level}, in Nespresso's US filter</dd></div>{/if}
              {#if selected.blend}<div><dt>Beans</dt><dd>{blendText(selected.blend)}</dd></div>{/if}
              {#if alsoBrews(selected).length}<div><dt>Also brews</dt><dd>{alsoBrews(selected).join(', ')}</dd></div>{/if}
            </dl>
            {#if selected.description}<p class="desc">{selected.description}</p>{/if}
            {#if selected.best_for}<p class="best"><span class="lbl">Best for</span>{selected.best_for}</p>{/if}
            <figure class="pours">
              {@render ladder(selected, 150, rows, true, true)}
              <figcaption>What it pours: {selected.ml} ml, beside the {LINES[selected.line].label} cup sizes listed here{selected.line === 'vertuo' ? ' (carafe capsules aren\'t)' : ''}. Every drawing on this page uses one scale, with {ML_TOP} ml as the full height.</figcaption>
            </figure>
            {#if suggestion}
              <p class="try"><span class="lbl">Try also</span><button type="button" class="trybtn" onclick={() => pick(suggestion!)}>{@render capsule(suggestion.line, suggestion.color_hex, 20)}{suggestion.name}<small>{suggestion.size} · {suggestion.ml} ml</small></button></p>
            {:else if near}
              <p class="try"><span class="lbl">Similar on the wall</span><button type="button" class="trybtn" onclick={() => pick(near!)}>{@render capsule(near.line, near.color_hex, 20)}{near.name}<small>{near.intensity ? `intensity ${near.intensity}` : 'not rated'} · {near.aroma}</small></button><small class="quiet nearwhy">{selected.intensity ? 'Same cup size, the closest intensity and aroma.' : 'Same cup size and aroma family (Nespresso doesn\'t rate this one for intensity).'}</small></p>
            {/if}
            <div class="actions">
              {#if onSale(selected)}<a class="go" href={buySearch(selected)} rel="sponsored noopener" target="_blank">Search Amazon for {LINES[selected.line].label} {selected.name} →</a>{/if}
              <button type="button" class="pill" aria-pressed={flight.includes(selected.id)} onclick={() => toggleFlight(selected!)}>{flight.includes(selected.id) ? 'In your flight ✓' : 'Add to a tasting flight'}</button>
            </div>
            {#if onSale(selected)}<p class="disc">The button opens an Amazon search for this {LINES[selected.line].label} capsule; as an Amazon Associate we earn from qualifying purchases.</p>{/if}
            {#if selected.source_url}<p class="disc"><a class="src" href={selected.source_url} rel="noopener" target="_blank">{selected.source_label ?? "Nespresso's page for this capsule"} ↗</a>{selected.checked ? `, ${onSale(selected) ? 'checked' : 'status checked'} ${fmtDate(selected.checked)}` : ''}</p>{/if}
          </div>
        {:else}
          <div class="howto">
            <span class="lbl">Reading the wall</span>
            <p>{#if narrow}Each column is a cup size, smallest on the left; intensity runs down, from mild to intense on Nespresso's 1–13 scale.{:else}Each row is a cup size, smallest at the top; intensity runs across, from mild to intense on Nespresso's 1–13 scale.{/if} <b>n/r</b> holds capsules Nespresso doesn't rate. Pick a capsule to see what it pours.</p>
            {@render ladder(null, 96, rows, true, true)}
            <p class="quiet small">The {LINES[line].label} cup sizes, drawn to the page's one scale{line === 'original' ? '; the dashed outline is the largest Vertuo cup, for comparison' : ''}.</p>
          </div>
        {/if}

        <div class="flight">
          <span class="lbl">Tasting flight{flightPods.length ? ` · ${flightPods.length} of 3, mildest first` : ''}</span>
          {#if flightFull}<p class="full" role="status">Your flight holds three. Remove one to add {flightFull}.</p>{/if}
          {#if flightPods.length}
            <ol class="cmp" style:--k={flightPods.length}>
              {#each flightPods as p (p.id)}
                <li>
                  <button type="button" class="rm" aria-label="Remove {p.name} from the flight" onclick={() => toggleFlight(p)}>×</button>
                  <button type="button" class="fl" onclick={() => pick(p)}>
                    <span class="flcap">{@render capsule(p.line, p.color_hex, 34)}</span>
                    <b>{p.name}</b>
                    <small>{shortSize(p.size)} · {p.ml} ml</small>
                    <span class="mini" aria-label={p.intensity ? `Intensity ${p.intensity} of 13` : 'Not rated'} role="img">{#each Array.from({ length: 13 }, (_, i) => i) as i (i)}<i class:on={!!p.intensity && i < p.intensity}></i>{/each}</span>
                    <small class="mono">{p.intensity ? `${p.intensity}/13` : 'n/r'}</small>
                    <small class="rl2">{p.roast_level ?? 'roast not published'}</small>
                    <span class="flglass">{@render glassAt(p.ml, 60)}</span>
                  </button>
                </li>
              {/each}
            </ol>
            <p class="quiet small">Brew them one after another into the same kind of cup, with the same milk (or none), and taste from left to right.</p>
          {:else}
            <p class="quiet small">Add up to three capsules to compare side by side: intensity, roast and the cup each pours.{storageOk ? ' Kept on this device.' : ''}</p>
          {/if}
        </div>
      </aside>
    </div>
    <p class="data">Range checked against Nespresso's US catalogue on October 15, 2026; it changes often, so check the box before you buy. Retired and unlisted capsules are hidden unless you ask. Roast is Nespresso's own filter and 1–5 roastiness, where published. Capsule colors are approximate; aroma groups gather Nespresso's own aroma words.</p>
  {/if}
</div>

<style>
  .px {
    --paper: #f3ede3; --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    background: var(--card); border: 1px solid var(--rule); border-radius: 18px; color: var(--ink);
    font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Metrics', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); padding: 18px 20px 20px;
  }
  .lbl { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 6px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .mono { font: 500 14px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; }
  .quiet { color: var(--ink-3); }
  .small { font-size: 13.5px; }

  /* Chooser */
  .ask { padding: 12px 4px 4px; }
  .ask h3 { font: 400 36px/1.1 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; margin: 0 0 6px; }
  .ask > p { color: var(--ink-2); max-width: 36em; /* 60ch of Plex */ margin: 0 0 18px; }
  .ask-cards { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
  .ask-card { appearance: none; border: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 0%, #fffdf9, #f4ece0); border-radius: 16px; padding: 20px 18px 18px; cursor: pointer; display: grid; grid-template-rows: 96px auto auto 1fr auto; justify-items: center; gap: 6px; text-align: center; color: var(--ink); transition: border-color .2s, transform .25s cubic-bezier(.2, .7, .2, 1); }
  .ask-card:hover { border-color: var(--ink-3); transform: translateY(-2px); }
  .ask-card .art { display: grid; place-items: end center; height: 96px; filter: drop-shadow(0 10px 12px rgba(42, 29, 21, .2)); }
  .ask-card b { font: 400 32px/1 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; }
  .ask-card .how { color: var(--ink-2); font-size: 14.5px; max-width: 21.6em; /* 36ch of Plex */ }
  .askladder { display: grid; justify-items: center; align-content: end; gap: 2px; margin-top: 6px; }
  .askladder small { font: 400 11.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); }
  .ask-card .n { font: 500 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--crema-deep); letter-spacing: .08em; text-transform: uppercase; margin-top: 4px; }

  /* Machine switch, filters, count */
  .machine { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .machine .lbl { margin: 0 6px 0 0; }
  .mch { appearance: none; display: flex; gap: 10px; align-items: center; border: 1px solid var(--rule); background: #fff; border-radius: 14px; padding: 8px 14px 8px 10px; cursor: pointer; color: var(--ink); text-align: left; min-height: 52px; }
  .mch b { display: block; font: 600 15px/1.2 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; }
  .mch small { display: block; font-size: 12.5px; color: var(--ink-3); }
  .mch[aria-pressed='true'] { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); background: #fffaf2; }
  .mch:hover { border-color: var(--ink-3); }
  .filters { margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--rule); }
  .filters summary { display: none; }
  .tools { display: flex; flex-wrap: wrap; gap: 10px 12px; align-items: flex-end; }
  .search { flex: 1 1 200px; }
  .search input, .sel select { width: 100%; font: 400 15px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; padding: 8px 12px; border: 1px solid var(--rule); border-radius: 10px; background: #fff; color: var(--ink); min-height: 40px; }
  .sel select { appearance: none; padding-right: 32px; cursor: pointer; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center; }
  .sel { flex: 0 1 158px; }
  .chk { display: flex; gap: 6px; align-items: center; font-size: 14.5px; min-height: 40px; }
  .chk input { width: 18px; height: 18px; accent-color: var(--crema-deep); }
  .countrow { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin: 12px 0 8px; }
  .count { margin: 0; font: 500 13px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-2); }
  .seg { display: flex; border: 1px solid var(--rule); border-radius: 999px; overflow: hidden; flex: none; }
  .seg button { appearance: none; border: 0; background: #fff; padding: 8px 16px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; }
  .linkish { appearance: none; border: 0; background: none; padding: 0; font: inherit; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }

  .body { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 18px; align-items: start; }
  .stage { background: radial-gradient(120% 90% at 50% 0%, #fffdf9 0%, #f4ece0 85%); border: 1px solid var(--rule); border-radius: 14px; padding: 12px 10px 8px; min-width: 0; position: sticky; top: 88px; }

  /* The wall: a label column, a "not rated" column, then intensity 1–13 (14 columns). */
  .wall { --lab: 112px; }
  /* "Not rated" is wider: unrated limited editions and flavors gather there and sit three abreast. */
  .head, .row { display: grid; grid-template-columns: var(--lab) minmax(0, 2.8fr) repeat(13, minmax(0, 1fr)); align-items: stretch; }
  .head { font: 500 11.5px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); text-align: center; padding-bottom: 6px; border-bottom: 1px solid var(--rule); }
  .head .corner { text-align: left; letter-spacing: .12em; text-transform: uppercase; font-size: 10.5px; }
  .head .nr { font-size: 10.5px; }
  .row { border-bottom: 1px dashed var(--rule); min-height: 60px; }
  .row:last-of-type { border-bottom: 0; }
  .rl { display: flex; gap: 8px; align-items: center; padding: 6px 4px 6px 0; }
  .rl b { display: block; font: 600 13px/1.15 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; }
  .rl small { display: block; font: 500 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); white-space: nowrap; }
  .cell { display: flex; flex-wrap: wrap; align-content: center; justify-content: center; padding: 4px 0; }
  .cell.nr, .trow.nr { background: repeating-linear-gradient(135deg, transparent 0 5px, rgba(117, 101, 90, .06) 5px 6px); }
  .pod { position: relative; appearance: none; border: 0; background: none; padding: 1px; width: 32px; height: 28px; display: grid; place-items: center; cursor: pointer; border-radius: 7px; transition: transform .25s cubic-bezier(.2, .7, .2, 1); }
  .pod:hover { transform: translateY(-2px); z-index: 2; }
  .pod.sel { background: #fff; box-shadow: 0 0 0 2px var(--ink), 0 6px 12px -6px rgba(42, 29, 21, .5); transform: translateY(-2px); z-index: 1; }
  .pod.inflight::after { content: ''; position: absolute; left: 7px; right: 7px; bottom: 0; height: 3px; border-radius: 2px; background: var(--crema); }
  .pod.gone :global(.cap) { opacity: .55; }
  .pod.faded { cursor: default; opacity: .22; filter: grayscale(.6); }
  .tip { position: absolute; bottom: calc(100% + 4px); left: 50%; transform: translateX(-50%); white-space: nowrap; background: var(--ink); color: #f3ede3; font: 500 12px/1 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; padding: 6px 8px; border-radius: 6px; pointer-events: none; opacity: 0; transition: opacity .15s; z-index: 3; }
  .pod:hover .tip, .pod:focus-visible .tip, .pod.sel .tip { opacity: 1; }
  .axis { display: flex; justify-content: space-between; gap: 8px; margin: 8px 0 0 var(--lab); font: 400 11.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); }
  .axis span:nth-child(2) { text-align: center; }
  .axis > span:first-child, .axis > span:last-child { white-space: nowrap; }
  .axis.keyrow { justify-content: center; margin-top: 4px; }
  .ladder :global(.ref) { fill: #9c8f82; font-style: italic; }
  .key { display: inline-block; width: 14px; height: 3px; border-radius: 2px; background: var(--crema); vertical-align: middle; }

  /* The wall turned on its side, for phones. */
  .thead, .trow { display: grid; grid-template-columns: 30px repeat(var(--n), minmax(0, 1fr)); }
  .wall.tall .thead { position: sticky; top: 60px; z-index: 3; background: var(--card, #fbf8f3); padding-top: 6px; }
  .thead { padding-bottom: 6px; border-bottom: 1px solid var(--rule); text-align: center; align-items: end; }
  .thead .corner { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); text-align: left; }
  .thead .th { display: grid; justify-items: center; gap: 1px; }
  .thead b { display: block; font: 600 11px/1.15 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; white-space: nowrap; }
  .thead small { display: block; font: 500 10px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); white-space: nowrap; }
  .trow { border-bottom: 1px dashed var(--rule); min-height: 42px; }
  .trow.empty { min-height: 24px; }
  .tl { font: 500 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); align-self: center; }
  /* Two capsules side by side in a 5-column phone cell (about 58 px at 360 px wide). */
  .tall .pod { width: 29px; height: 38px; }
  .tall .pod :global(.cap) { width: 25px; }
  .axis.tallaxis { display: block; margin: 8px 0 0; font-size: 11.5px; line-height: 1.45; }

  /* List */
  .list-wrap { overflow-x: auto; }
  .list { width: 100%; border-collapse: collapse; font-size: 14.5px; }
  .list th, .list td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #e6dccd; vertical-align: middle; }
  .list thead th { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); white-space: nowrap; }
  .list .num { font-family: 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; text-align: center; }
  .list .nw { white-space: nowrap; }
  .list tr.sel th, .list tr.sel td { background: #fbe9cc; }
  .list tr.sel th { box-shadow: inset 3px 0 0 var(--crema-deep); }
  .lname { appearance: none; border: 0; background: none; padding: 4px 0; display: inline-flex; gap: 8px; align-items: center; font: 600 14.5px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink); cursor: pointer; text-align: left; min-height: 32px; }
  .lname em { font-weight: 400; color: var(--ink-3); }
  .lname :global(svg) { flex: none; }
  .none { margin: 10px 4px; color: var(--ink-2); }

  /* Panel */
  .panel { display: flex; flex-direction: column; gap: 14px; min-width: 0; scroll-margin-top: 90px; }
  .detail { position: relative; border: 1px solid var(--rule); border-radius: 14px; background: #fff; padding: 16px 16px 14px; }
  .x { position: absolute; top: 10px; right: 10px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; font-size: 18px; cursor: pointer; color: var(--ink-2); }
  .dhead { display: flex; gap: 14px; align-items: center; padding-right: 36px; }
  .bigcap { flex: none; filter: drop-shadow(0 8px 10px rgba(42, 29, 21, .22)); }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  .detail h3 { font: 400 38px/1.02 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; margin: 4px 0 2px; }
  .cat { margin: 0; color: var(--ink-3); font-size: 14px; }
  .tag-note { margin: 10px 0 0; font-size: 13.5px; color: var(--ink-2); }
  .badlink { margin: 0 0 12px; }
  .full { margin: 6px 0 4px; padding: 7px 10px; border-radius: 8px; background: #fff3e0; border: 1px solid #e9c48f; font-size: 13.5px; color: var(--ink); }
  h3[tabindex='-1']:focus { outline: none; }
  h3[tabindex='-1']:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  .src { color: var(--crema-deep); text-underline-offset: 3px; }
  .gone-note { margin: 10px 0 0; padding: 8px 10px; border-radius: 8px; background: #f6efe5; color: var(--ink-2); font-size: 14px; }
  .meters { display: grid; gap: 10px; margin-top: 14px; }
  .meters > div { display: grid; grid-template-columns: 78px 1fr auto; align-items: center; gap: 10px; }
  .meters .lbl { margin: 0; }
  .bar, .mini { display: grid; grid-template-columns: repeat(13, 1fr); gap: 2px; height: 10px; }
  .bar.roast { grid-template-columns: repeat(5, 1fr); }
  .bar i, .mini i { background: #ece3d6; border-radius: 2px; }
  .bar i.on, .mini i.on { background: #7a4e30; }
  .bar.roast i.on { background: linear-gradient(90deg, #b77a3c, #3b2214); background-size: 400% 100%; }
  .mono small { color: var(--ink-3); font-size: 11px; }
  .facts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 14px 0 0; }
  .facts dt { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .facts dd { margin: 4px 0 0; font-size: 14.5px; }
  .desc { margin: 12px 0 0; color: var(--ink-2); font-size: 15px; }
  .best { margin: 10px 0 0; font-size: 14.5px; }
  .pours { margin: 14px 0 0; padding: 12px 6px 4px; border-top: 1px dashed var(--rule); text-align: center; }
  .pours figcaption { font-size: 13px; color: var(--ink-3); margin: 6px 0 0; text-align: left; }
  .ladder { display: inline-block; max-width: 100%; height: auto; }
  .ladder :global(.glass) { fill: #fffdf9; stroke: #9c8f82; stroke-width: 1.2; }
  .ladder :global(.glass.on) { stroke: var(--ink); stroke-width: 1.6; }
  .ladder :global(.pour) { transform-box: fill-box; transform-origin: 50% 100%; animation: pour .7s cubic-bezier(.2, .7, .2, 1) both; }
  .ladder :global(.lml) { font: 500 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: #75655a; }
  .ladder :global(.lnm) { font: 400 11px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; fill: #5b4a3d; }
  .ladder :global(.lml.on), .ladder :global(.lnm.on) { fill: #2a1d15; font-weight: 600; }
  @keyframes pour { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  .try { margin: 12px 0 0; }
  .trybtn { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 6px 14px 6px 8px; display: inline-flex; gap: 8px; align-items: center; cursor: pointer; font: 600 14px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink); min-height: 40px; }
  .trybtn small { font: 500 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); }
  .nearwhy { display: block; margin-top: 4px; font-size: 12.5px; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .go { background: #fff; color: var(--ink); border: 1.5px solid var(--ink); border-radius: 999px; padding: 11px 18px; font: 600 14.5px/1.2 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .pill { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 10px 15px; font: 500 14px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; cursor: pointer; min-height: 44px; }
  .pill[aria-pressed='true'] { border-color: var(--crema); background: #fff8ec; color: var(--ink); }
  .disc { font-size: 12.5px; color: var(--ink-3); margin: 8px 0 0; }
  .howto { border: 1px solid var(--rule); border-radius: 14px; background: #fff; padding: 14px 16px; text-align: center; }
  .howto .lbl, .howto p { text-align: left; }
  .howto > p:first-of-type { font-size: 14.5px; color: var(--ink-2); margin: 0 0 12px; }
  .howto .small { margin: 4px 0 0; }

  /* Tasting flight: three columns to compare at a glance. */
  .flight { border: 1px solid var(--rule); border-radius: 14px; background: #fff; padding: 12px 14px; }
  .cmp { list-style: none; margin: 4px 0 8px; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .cmp li { position: relative; border: 1px solid #ece3d6; border-radius: 12px; background: radial-gradient(120% 90% at 50% 0%, #fffdf9, #f7f1e8); }
  .fl { appearance: none; border: 0; background: none; width: 100%; padding: 12px 8px 10px; display: grid; justify-items: center; gap: 4px; cursor: pointer; color: var(--ink); text-align: center; }
  .fl b { font: 600 14px/1.15 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; }
  .fl small { font-size: 12px; color: var(--ink-3); white-space: nowrap; }
  .fl .rl2 { margin-top: -2px; }
  .fl .mini { width: 100%; max-width: 110px; height: 7px; gap: 1px; margin-top: 2px; }
  .flglass { display: grid; place-items: end center; height: 64px; margin-top: 4px; }
  .rm { position: absolute; top: 2px; right: 2px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; cursor: pointer; color: var(--ink-3); z-index: 1; }
  .data { margin: 14px 2px 0; font-size: 12.5px; color: var(--ink-3); }
  button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }

  @media (max-width: 900px) {
    .body { grid-template-columns: 1fr; }
    .stage { position: static; }
  }
  @media (max-width: 640px) {
    .px { padding: 14px 12px 16px; border-radius: 14px; }
    .ask-cards { grid-template-columns: 1fr; }
    .ask h3 { font-size: 30px; }
    .ask-card { grid-template-rows: auto auto auto auto auto; padding: 16px 14px; }
    .machine .lbl, .mch small { display: none; }
    .mch { flex: 1; padding: 6px 10px; min-height: 44px; }
    .filters summary { display: inline-flex; align-items: center; min-height: 40px; padding: 0 14px; border: 1px solid var(--rule); border-radius: 999px; background: #fff; font: 500 14px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; cursor: pointer; list-style: none; }
    .filters summary::-webkit-details-marker { display: none; }
    .filters[open] summary { margin-bottom: 10px; }
    .filters { padding-top: 10px; margin-top: 12px; }
    .sel { flex: 1 1 40%; }
    .stage { padding: 10px 4px 6px; }
    .detail h3 { font-size: 32px; }
    .tip { display: none; }
    .list th, .list td { padding: 6px 5px; font-size: 13.5px; }
  }
  @media (prefers-reduced-motion: reduce) { .pod, .ask-card, .ladder :global(.pour) { transition: none; animation: none; } }
</style>
