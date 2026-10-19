<script lang="ts">
  import { onMount, tick } from 'svelte';
  import {
    ATLAS, CONTACT, FILTER, FORCE, TIME_TICKS, atlasById, brewGuideHref, describe, differenceSentence, differences, recipeDiffers,
    ratioText, timePosition, timeText,
  } from '../../lib/coffee/methodAtlas.ts';
  import type { AtlasId, AtlasMethod, Axis } from '../../lib/coffee/methodAtlas.ts';
  import BrewerCutaway from './art/BrewerCutaway.svelte';

  // Brewing Constellations: every brewer is a star. The sky can be arranged by one physical
  // property at a time (how water meets the coffee, what filters it, what pushes the water, how
  // long it takes), so you can see that these are separate axes, not one family tree. A star
  // opens a cutaway of the brewer with its water path; two stars compare side by side.
  const W = 1000, H = 556, TOP = 180, BOT = 486, PAD = 16;
  const ARRANGE: { id: Axis; label: string }[] = [
    { id: 'contact', label: 'Contact' }, { id: 'filter', label: 'Filter' }, { id: 'force', label: 'Force' }, { id: 'time', label: 'Time' },
  ];
  const QUICK: [AtlasId, AtlasId][] = [['v60', 'french-press'], ['espresso', 'moka'], ['clever', 'kalita'], ['aeropress', 'french-press']];

  let by = $state<Axis>('contact');
  let aId = $state<AtlasId | null>(null);
  let bId = $state<AtlasId | null>(null);
  let picking = $state(false);
  let view = $state<'sky' | 'list'>('sky');
  let mounted = $state(false);
  let reduced = $state(false);
  let panelEl = $state<HTMLElement | null>(null);
  let headEl = $state<HTMLElement | null>(null);
  let opener: string | null = null;

  let A = $derived(aId ? atlasById(aId) ?? null : null);
  let B = $derived(bId ? atlasById(bId) ?? null : null);

  const mid = (m: AtlasMethod) => Math.sqrt(m.timeS[0] * m.timeS[1]);
  // Star size is body: the less a filter holds back, the bigger the star.
  const size = (m: AtlasMethod) => 5 + FILTER[m.filter].order * 1.35;
  const pushed = (m: AtlasMethod) => m.force === 'hand' || m.force === 'vapor' || m.force === 'steam' || m.force === 'pump';

  interface Group { key: string; label: string; line: string; ids: AtlasId[] }
  function groupsFor(axis: Axis): Group[] {
    const sortT = (xs: AtlasMethod[]) => [...xs].sort((p, q) => mid(p) - mid(q));
    if (axis === 'contact') return (['percolation', 'steep-drain', 'immersion'] as const).map((k) => ({ key: k, label: CONTACT[k].label, line: CONTACT[k].line, ids: sortT(ATLAS.filter((m) => m.contact === k)).map((m) => m.id) }));
    if (axis === 'filter') return (Object.keys(FILTER) as (keyof typeof FILTER)[]).sort((p, q) => FILTER[p].order - FILTER[q].order).map((k) => ({ key: k, label: FILTER[k].label, line: FILTER[k].line, ids: sortT(ATLAS.filter((m) => m.filter === k)).map((m) => m.id) })).filter((g) => g.ids.length);
    if (axis === 'force') return (Object.keys(FORCE) as (keyof typeof FORCE)[]).sort((p, q) => FORCE[p].order - FORCE[q].order).map((k) => ({ key: k, label: FORCE[k].label, line: FORCE[k].line, ids: sortT(ATLAS.filter((m) => m.force === k)).map((m) => m.id) })).filter((g) => g.ids.length);
    // Time: one row per contact type, so the stars spread along the axis without piling up.
    return (['percolation', 'steep-drain', 'immersion'] as const).map((k) => ({ key: k, label: CONTACT[k].label, line: CONTACT[k].line, ids: sortT(ATLAS.filter((m) => m.contact === k)).map((m) => m.id) }));
  }

  interface Placed { x: number; y: number; lx: number; ly: number; anchor: 'start' | 'middle' | 'end' }
  interface Hub { x: number; y: number; label: string; sub: string; lx: number; ly: number; anchor: string; first?: AtlasId }
  interface Layout { w: number; h: number; pos: Record<string, Placed>; hubs: Hub[]; chains: AtlasId[][]; x0?: number; x1?: number }
  const HEAD: Record<string, string> = { 'steep-drain': 'Steep, then drain', 'thick-paper': 'Thick paper', none: 'Steeped', hand: 'Hand', vapor: 'Vapor', steam: 'Steam', pump: 'Pump' };
  const SUB: Record<string, string> = {
    percolation: 'water runs through the bed', 'steep-drain': 'steeps, then drains through it', immersion: 'steeps in all the water',
    'thick-paper': 'the clearest cup', paper: 'a clear cup', cloth: 'some oils pass', metal: 'oils and fines pass',
    none: 'nothing pushes', gravity: 'the water\'s own weight', hand: 'a plunger', vapor: 'vapor, then a vacuum', steam: 'about 1.5 bar', pump: 'about 9 bar',
  };
  const headOf = (axis: Axis, g: Group) => (axis === 'filter' && g.key === 'none' ? 'No filter' : HEAD[g.key] ?? g.label);
  const subOf = (axis: Axis, g: Group) => (axis === 'filter' && g.key === 'none' ? 'grounds settle in the cup' : SUB[g.key] ?? '');
  const GHOST: Record<Axis, string> = { contact: 'how water meets the coffee', filter: 'what holds the grounds back', force: 'what moves the water', time: 'how long the brew takes' };

  function layout(axis: Axis, portrait: boolean): Layout {
    const pos: Record<string, Placed> = {};
    const hubs: Hub[] = [];
    if (axis === 'time') {
      // One row per brewer, fastest at the top: a range chart drawn in stars.
      const sorted = [...ATLAS].sort((p, q) => mid(p) - mid(q));
      const w = portrait ? 600 : W, top = portrait ? 60 : 56, rowH = portrait ? 46 : (H - top - 64) / sorted.length;
      const h = portrait ? top + sorted.length * rowH + 64 : H;
      const x0 = portrait ? 200 : 210, x1 = w - 40;
      sorted.forEach((m, i) => {
        const x = x0 + timePosition(mid(m)) * (x1 - x0), y = top + i * rowH + rowH / 2;
        const start = x0 + timePosition(m.timeS[0]) * (x1 - x0);
        pos[m.id] = { x, y, lx: Math.min(start, x) - (pushed(m) ? Math.max(16, size(m) * 3.1 + 6) : 16) - x, ly: 6, anchor: 'end' };
      });
      return { w, h, pos, hubs, chains: [sorted.map((m) => m.id)], x0, x1 };
    }
    const gs = groupsFor(axis);
    if (!portrait) {
      const k = gs.length, left = 56, colW = (W - 2 * left) / k;
      const beside = axis === 'contact';
      gs.forEach((g, i) => {
        const cx = left + (i + 0.5) * colW;
        hubs.push({ x: cx, y: 128, label: headOf(axis, g), sub: subOf(axis, g), lx: 0, ly: -48, anchor: 'middle', first: g.ids[0] });
        const n = g.ids.length;
        g.ids.forEach((id, j) => {
          const y = n === 1 ? (TOP + BOT) / 2 + 10 : TOP + 16 + (j * (BOT - TOP - 26)) / (n - 1);
          // A crowded column (four stars or more, labels under them) zigzags left and right, so the
          // name under one star never sits on top of the next one.
          const crowded = !beside && n >= 4;
          const swing = n === 1 ? 0 : crowded ? (j % 2 ? -1 : 1) * 0.24 * colW : (beside ? 0.22 : 0.17) * colW * Math.sin(j * 1.9 + i + 0.6);
          const x = cx + swing;
          // A label stays inside its own column: if it would cross into the next one, it goes on
          // the other side of its star (or whichever side has more room).
          const m = atlasById(id)!, gap = pushed(m) ? Math.max(24, size(m) * 3.1 + 7) : 24;
          const lw = m.label.length * 10.4, lo = cx - colW / 2 + 4, hi = cx + colW / 2 - 4;
          const fitsR = x + gap + lw < Math.min(hi, W - 8), fitsL = x - gap - lw > Math.max(lo, 8);
          const right = swing >= 0 ? (fitsR || !fitsL) && (fitsR || hi - x > x - lo) : !fitsL && (fitsR || hi - x > x - lo);
          pos[id] = beside ? { x, y, lx: right ? gap : -gap, ly: 7, anchor: right ? 'start' : 'end' }
            : crowded ? { x, y, lx: swing > 0 ? 12 : -12, ly: 34, anchor: swing > 0 ? 'end' : 'start' }
            : { x, y, lx: 0, ly: 40, anchor: 'middle' };
        });
      });
      return { w: W, h: H, pos, hubs, chains: gs.map((g) => g.ids) };
    }
    // Phone: each group is a row; its hub on the left, the stars across, labels above and below.
    const w = 600, band = gs.length > 4 ? 168 : 196, extra = 110;
    let y0 = 24;
    gs.forEach((g) => {
      const n0 = g.ids.length, two = n0 > 5;
      const yc = y0 + 122;
      hubs.push({ x: 46, y: yc, label: headOf(axis, g), sub: subOf(axis, g), lx: -26, ly: -84, anchor: 'start', first: g.ids[0] });
      // A long row (percolation has seven) splits into two, so no label crowds its neighbour.
      const rows = two ? [g.ids.slice(0, Math.ceil(n0 / 2)), g.ids.slice(Math.ceil(n0 / 2))] : [g.ids];
      rows.forEach((ids, ri) => ids.forEach((id, j) => {
        const n = ids.length;
        const jj = ri ? n - 1 - j : j;
        const x = n === 1 ? 330 : 140 + (jj * (w - 190)) / (n - 1) + (ri ? 30 : 0);
        const up = two ? ri === 0 : n > 2 && j % 2 === 1;
        const yrow = yc + ri * extra;
        // Keep every name inside the frame: a label that would run off the right edge ends there instead.
        const half = (atlasById(id)!.label.length * 11.6) / 2;
        const over = x + half > w - 10, under = x - half < 10;
        const anchor = over ? 'end' : under ? 'start' : 'middle';
        pos[id] = { x: Math.min(x, w - 40), y: yrow + (up ? -12 : 8), lx: over ? w - 10 - x : under ? 10 - x : 0, ly: up ? -24 : 42, anchor };
      }));
      y0 += band + (two ? extra : 0);
    });
    return { w, h: y0 + 6, pos, hubs, chains: gs.map((g) => g.ids) };
  }
  let portrait = $state(false);
  let L = $derived(layout(by, portrait));
  // Name boxes in this layout, so field stars keep out of them.
  let nameBoxes = $derived(ATLAS.map((m) => {
    const p = L.pos[m.id], w = m.label.length * (portrait ? 12.5 : 10.6) + 14, x = p.x + p.lx;
    return { x: p.anchor === 'end' ? x - w : p.anchor === 'middle' ? x - w / 2 : x - 7, y: p.y + p.ly - 22, w, h: 30 };
  }));
  const clear = (x: number, y: number) => !nameBoxes.some((b) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h);
  let groups = $derived(groupsFor(by));
  // The list is the sky's text alternative: under Time it reads fastest to slowest with each brewer's time,
  // not the contact rows the sky uses only to spread its stars (review r5, Opus).
  let listGroups = $derived<Group[]>(by === 'time' ? [{ key: 'time', label: 'Fastest to slowest', line: 'how long each brew takes', ids: [...ATLAS].sort((p, q) => mid(p) - mid(q)).map((m) => m.id) }] : groups);

  // The night sky, fixed so it's the same on every load: field stars that twinkle, a few bright ones.
  function seeded(n: number) { let x = 42; return () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }
  const rnd = seeded(42);
  const field = Array.from({ length: 160 }, () => ({ x: rnd(), y: rnd(), r: 0.35 + rnd() * 1.05, o: 0.12 + rnd() * 0.45, delay: rnd() * 10, dur: 3 + rnd() * 5 }));
  const feature = [[0.05, 0.14], [0.42, 0.1], [0.68, 0.16], [0.95, 0.27], [0.32, 0.72], [0.62, 0.76], [0.9, 0.8], [0.08, 0.63], [0.55, 0.14], [0.35, 0.23]].map(([x, y], i) => ({ x, y, r: 1.2 + (i % 4) * 0.18, o: 0.45 + (i % 3) * 0.06 }));

  async function select(id: AtlasId) {
    opener = id;
    if (picking && aId && id !== aId) { bId = id; picking = false; }
    else if (aId === id && !bId) { aId = null; picking = false; return; }
    else { aId = id; bId = null; picking = false; }
    await reveal();
  }
  async function compare(a: AtlasId, b: AtlasId) { aId = a; bId = b; picking = false; opener = a; await reveal(); }
  async function reveal() {
    if (!matchMedia('(max-width: 900px)').matches) return;
    await tick();
    panelEl?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    headEl?.focus({ preventScroll: true });
  }
  async function close() {
    if (bId) bId = null; else { aId = null; picking = false; }
    await tick();
    if (opener) (document.querySelector(`[data-star="${opener}"]`) as HTMLElement | null)?.focus();
  }
  function swap() { const t = aId; aId = bId; bId = t; }
  function keyAct(e: KeyboardEvent, fn: () => void) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }
  function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && (aId || picking)) close(); }

  onMount(() => {
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mq = matchMedia('(max-width: 720px)');
    portrait = mq.matches;
    mq.addEventListener('change', (e) => { portrait = e.matches; });
    const q = new URLSearchParams(location.search);
    // Case doesn't matter in a link (?m=V60), as on the Origins map (review r4, Opus M4).
    const a = q.get('m')?.toLowerCase(), b = q.get('vs')?.toLowerCase(), axis = q.get('by')?.toLowerCase();
    if (a && atlasById(a)) aId = a as AtlasId;
    if (aId && b && b !== aId && atlasById(b)) bId = b as AtlasId;
    if (axis && ARRANGE.some((x) => x.id === axis)) by = axis as Axis;
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    if (aId) q.set('m', aId);
    if (aId && bId) q.set('vs', bId);
    if (by !== 'contact') q.set('by', by);
    history.replaceState(history.state, '', q.toString() ? `${location.pathname}?${q}` : location.pathname);
  });

  const axisValue = (m: AtlasMethod, axis: Axis) => axis === 'contact' ? CONTACT[m.contact].label : axis === 'filter' ? FILTER[m.filter].label + (m.filterNote ? '†' : '') : axis === 'force' ? FORCE[m.force].label : timeText(m) + (m.timeNote ? '*' : '');
  // Ranges and units stay on one line.
  const keep = (s: string) => s.replace(/–/g, '\u2060–\u2060').replace(/ \(/g, '\u00a0(');
  const dots = (n: number) => '●'.repeat(n) + '○'.repeat(3 - n);
</script>

<svelte:window onkeydown={onKey} />

{#snippet star(m: AtlasMethod, p: Placed)}
  {@const r = size(m)}
  {@const sel = aId === m.id}
  {@const vs = bId === m.id}
  {@const lit = sel || vs}
  <g class="star" class:sel class:vs class:pick={picking && m.id !== aId} class:dimmed={!!aId && !lit && !picking} style="transform: translate({p.x}px, {p.y}px)"
    role="button" tabindex="0" data-star={m.id} aria-pressed={lit}
    aria-label="{m.label}: {CONTACT[m.contact].label.toLowerCase()}, {m.filter === 'none' ? 'no filter' : `${FILTER[m.filter].label.toLowerCase()} filter`}, {FORCE[m.force].label.toLowerCase()}, {timeText(m)}"
    onclick={() => select(m.id)} onkeydown={(e) => keyAct(e, () => select(m.id))}>
    <circle class="halo" r={lit ? r * 5 : r * 3.2} fill="#E8C36A" opacity={lit ? 0.13 : 0.06} />
    <circle class="halo" r={lit ? r * 2.6 : r * 1.7} fill="#E8C36A" opacity={lit ? 0.28 : 0.14} />
    {#if pushed(m)}
      {@const vr = by === 'time' ? Math.min(r * 3.1, 12) : r * 3.1}
      <path d="M{-r * 3.1} 0 H{r * 3.1} M0 {-vr} V{vr}" stroke="#F0D070" stroke-width="1.5" opacity=".9" />
    {/if}
    <circle class="core" r={lit ? r * 1.25 : r} fill={lit ? '#F5D78E' : '#E8C36A'} filter="url(#mc-star-glow)" />
    {#if sel}<circle r={r * 1.25 + 9} fill="none" stroke="#F5D78E" stroke-width="1.6" class="ring" />{/if}
    {#if vs}<circle r={r * 1.25 + 9} fill="none" stroke="#F5D78E" stroke-width="1.6" stroke-dasharray="4 4" />{/if}
    <circle r={Math.max(20, r + 12)} fill="transparent" />
    <text x={p.lx} y={p.ly} text-anchor={p.anchor} class="slab" class:on={lit}>{m.label}</text>
  </g>
{/snippet}

<div class="mc">
  <div class="topbar">
    <div class="arr" role="group" aria-label="Arrange the brewers by">
      <span class="lbl">Arrange by</span>
      <div class="seg">
        {#each ARRANGE as x (x.id)}
          <button type="button" aria-pressed={by === x.id} onclick={() => (by = x.id)}>{x.label}</button>
        {/each}
      </div>
    </div>
    <em class="ghost-cap">{GHOST[by]}</em>
    <div class="seg small" role="group" aria-label="View">
      <button type="button" aria-pressed={view === 'sky'} onclick={() => (view = 'sky')}>Sky</button>
      <button type="button" aria-pressed={view === 'list'} onclick={() => (view = 'list')}>List</button>
    </div>
  </div>
  <div class="body">
    <div class="stagecol">
      {#if view === 'sky'}
        <div class="gp-frame skyframe" style="--mat: #2a3040; --matpad: 8px; --matpad-phone: 4px">
        <div class="sky" class:pre={!mounted}>
          <svg viewBox="{-PAD} {-PAD} {L.w + PAD * 2} {L.h + PAD * 2}" role="group" aria-label="Thirteen brewers as stars, arranged by {by}. Choose a star to open it.">
            <defs>
              <linearGradient id="mc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1525" /><stop offset=".6" stop-color="#12213A" /><stop offset="1" stop-color="#1A2A3D" /></linearGradient>
              <radialGradient id="mc-horizon" cx=".5" cy="1.08" r=".6"><stop offset="0" stop-color="#D4A44C" stop-opacity=".18" /><stop offset=".3" stop-color="#A07838" stop-opacity=".08" /><stop offset=".6" stop-color="#5A4020" stop-opacity=".03" /><stop offset="1" stop-color="#0B1525" stop-opacity="0" /></radialGradient>
              <radialGradient id="mc-vignette" cx=".5" cy=".5" r=".62"><stop offset=".65" stop-color="#000" stop-opacity="0" /><stop offset="1" stop-color="#000" stop-opacity=".26" /></radialGradient>
              <filter id="mc-hub-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              <marker id="mc-arrow" viewBox="0 0 8 8" refX="4" refY="6" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 1 L4 7 L7 1" fill="none" stroke="#8898B0" stroke-width="1.2" /></marker>
              <filter id="mc-star-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <!-- The frame: a slate mat, a copper rule, the chart's own border -->
            <rect x={-PAD} y={-PAD} width={L.w + PAD * 2} height={L.h + PAD * 2} fill="#2A3040" rx="3" />
            <rect x={-PAD + 4} y={-PAD + 4} width={L.w + PAD * 2 - 8} height={L.h + PAD * 2 - 8} fill="none" stroke="#C17A3A" stroke-width=".7" opacity=".55" rx="2" />
            <rect x="0" y="0" width={L.w} height={L.h} fill="url(#mc-sky)" />
            <rect x="0" y="0" width={L.w} height={L.h} fill="url(#mc-horizon)" />
            <g opacity=".06" pointer-events="none">{#each L.hubs as hb (hb.label)}<circle cx={hb.x} cy={portrait ? hb.y : L.h / 2} r={portrait ? 150 : 190} fill="#2A4060" />{/each}</g>
            <!-- Coordinate grid and edge ticks, like a printed star chart -->
            <g stroke="#2A3A50" stroke-width=".6" stroke-dasharray="2 10" opacity=".35" pointer-events="none">
              {#each [1, 2, 3, 4] as i (i)}<line x1={(L.w * i) / 5} y1="0" x2={(L.w * i) / 5} y2={L.h} />{/each}
              {#each [1, 2, 3] as i (i)}<line x1="0" y1={(L.h * i) / 4} x2={L.w} y2={(L.h * i) / 4} />{/each}
            </g>
            <g stroke="#3A4A60" stroke-width=".8" opacity=".6" pointer-events="none">
              {#each Array.from({ length: Math.floor(L.w / 100) + 1 }, (_, i) => i * 100) as x (x)}<line x1={x} y1="0" x2={x} y2="5" /><line x1={x} y1={L.h - 5} x2={x} y2={L.h} />{/each}
              {#each Array.from({ length: Math.floor(L.h / 100) + 1 }, (_, i) => i * 100) as y (y)}<line x1="0" y1={y} x2="5" y2={y} /><line x1={L.w - 5} y1={y} x2={L.w} y2={y} />{/each}
            </g>
            {#each field.filter((f) => clear(f.x * L.w, f.y * L.h)) as f, i (i)}<circle pointer-events="none" class="twinkle" cx={f.x * L.w} cy={f.y * L.h} r={f.r} fill="#C8D0E0" opacity={f.o} style="animation-delay: {f.delay}s; animation-duration: {f.dur}s" />{/each}
            {#each feature.filter((f) => clear(f.x * L.w, f.y * L.h)) as f, i (i)}<circle pointer-events="none" cx={f.x * L.w} cy={f.y * L.h} r={f.r * 2} fill="#D0D8E8" opacity={f.o * 0.15} /><circle cx={f.x * L.w} cy={f.y * L.h} r={f.r} fill="#D8E0F0" opacity={f.o} />{/each}
            <!-- Compass rose -->
            {#if !portrait && by !== 'time'}
              <g transform="translate({L.w - 48} 46) scale(1.5)" opacity=".4">
                <circle r="12" fill="none" stroke="#C17A3A" stroke-width=".4" /><circle r="11" fill="none" stroke="#D4A44C" stroke-width=".2" />
                <polygon points="0,-10 -1.5,-3 0,-4 1.5,-3" fill="#D4A44C" /><polygon points="0,10 -1.5,3 0,4 1.5,3" fill="#6B7A90" /><polygon points="10,0 3,-1.5 4,0 3,1.5" fill="#6B7A90" /><polygon points="-10,0 -3,-1.5 -4,0 -3,1.5" fill="#6B7A90" />
                <circle r="1" fill="#D4A44C" /><text y="-14.5" text-anchor="middle" class="compass">N</text>
              </g>
            {/if}
            {#if by === 'time' && L.x0 !== undefined && L.x1 !== undefined}
              {@const sx = (t: number) => L.x0! + timePosition(t) * (L.x1! - L.x0!)}
              {#each TIME_TICKS as t, i (t.s)}
                <line x1={sx(t.s)} x2={sx(t.s)} y1="34" y2={L.h - 52} stroke="#8898B0" stroke-opacity=".22" stroke-dasharray="2 5" />
                <!-- On a phone the ticks sit close, so every other label drops a line (review r4, Opus M1). -->
                <text x={sx(t.s)} y={L.h - 32 + (portrait && i % 2 === 1 ? 18 : 0)} text-anchor="middle" class="tick">{t.label}</text>
              {/each}
              <text x="20" y="30" class="timecap">Fastest at the top</text>
              <text x={L.x1} y="30" text-anchor="end" class="timecap">brew time, log scale →</text>
              {#each ATLAS as m (m.id)}
                <line class="range" x1={sx(m.timeS[0])} x2={sx(Math.max(m.timeS[1], m.timeS[0] * 1.08))} y1={L.pos[m.id].y} y2={L.pos[m.id].y} />
              {/each}
            {/if}
            {#if by !== 'time'}
              <!-- Height means order within a line only (not one time scale across the sky), so the
                   caption says to follow each line rather than drawing a shared axis. -->
              {#if portrait}
                <text x={L.w - 12} y="22" text-anchor="end" class="edge">follow each line: quicker → slower · tap a star</text>
              {:else}
                <text x="20" y="24" class="edge">follow each line down: quicker → slower · pick a star for its recipe</text>
              {/if}
            {/if}
            {#key by}
              <!-- The lines stop short of every name, so none cuts through one (gate r8): each name, drawn
                   with a wide stroke, is cut out of the lines' mask. -->
              <mask id="mc-lmask" maskUnits="userSpaceOnUse" x="0" y="0" width={L.w} height={L.h}>
                <rect width={L.w} height={L.h} fill="#fff" />
                {#each ATLAS as m (m.id)}{@const p = L.pos[m.id]}<text x={p.x + p.lx} y={p.y + p.ly} text-anchor={p.anchor} class="mlab">{m.label}</text>{/each}
              </mask>
              <g class="chains" pointer-events="none" mask="url(#mc-lmask)">
                {#each L.chains as ids, ci (ci)}
                  {@const hb = L.hubs[ci]}
                  <polyline points={[...(hb ? [`${hb.x},${hb.y}`] : []), ...ids.map((id) => `${L.pos[id].x},${L.pos[id].y}`)].join(' ')} fill="none" stroke="#C9A84E" stroke-width="1.1" stroke-opacity={by === 'time' ? 0.3 : 0.5} />
                {/each}
              </g>
              {#each L.hubs as hb (hb.label)}
                <g class="hub" pointer-events="none">
                  <!-- The group's mark: a ring, not a star, so the thirteen brewers are the only stars -->
                  <circle cx={hb.x} cy={hb.y} r="22" fill="#D4A44C" opacity=".07" />
                  <circle cx={hb.x} cy={hb.y} r="7" fill="none" stroke="#E8B85C" stroke-width="1.6" filter="url(#mc-hub-glow)" />
                  <circle cx={hb.x} cy={hb.y} r="2" fill="#E8B85C" />
                  <text x={hb.x + hb.lx} y={hb.y + hb.ly} text-anchor={hb.anchor} class="hublab">{hb.label.toUpperCase()}</text>
                  <text x={hb.x + hb.lx} y={hb.y + hb.ly + 19} text-anchor={hb.anchor} class="hubsub">{hb.sub}</text>
                </g>
              {/each}
            {/key}
            {#each ATLAS as m (m.id)}{@render star(m, L.pos[m.id])}{/each}
            <rect x="0" y="0" width={L.w} height={L.h} fill="url(#mc-vignette)" pointer-events="none" />
            <rect x="-.5" y="-.5" width={L.w + 1} height={L.h + 1} fill="none" stroke="#4A5568" stroke-width=".8" />
          </svg>
        </div>
        </div>
        <p class="gp-plaque"><b>The Brewing Constellations</b><small>An interactive star chart</small></p>
        <div class="key gp-label">
          <p class="kstate">Thirteen brewers, sorted by one property at a time: {GHOST[by]}.</p>
          <p class="ksym"><span class="kit"><span class="lstar big"></span><span class="lstar"></span> A bigger star: a more open filter, so more body</span> <span class="kit"><span class="lray" aria-hidden="true">✳</span> Rays: the water is pushed</span> <span class="kit"><span class="lring" aria-hidden="true"></span> A ring: where a group's line starts</span></p>
          {#each groups as g (g.key)}
            <p><b>{g.label}</b> {g.line}</p>
          {/each}
        </div>
      {:else}
        <div class="list gp-label">
          {#each listGroups as g (g.key)}
            <section>
              <h3>{g.label}</h3>
              <p class="gline">{g.line}</p>
              <ul>
                {#each g.ids as id (id)}
                  {@const m = atlasById(id)!}
                  <li>
                    <button type="button" class="row" class:on={aId === id || bId === id} data-star={id} aria-pressed={aId === id || bId === id} onclick={() => select(id)}>
                      <span class="rstar" style:--s="{size(m) * 1.6}px" class:rays={pushed(m)} aria-hidden="true"></span>
                      <span class="rname">{m.label}</span>
                      <span class="rmeta">{timeText(m)}{m.timeNote ? '*' : ''}</span>
                      <span class="rline">{m.line}</span>
                    </button>
                  </li>
                {/each}
              </ul>
            </section>
          {/each}
        </div>
      {/if}
    </div>

    <div class="panel gp-label" bind:this={panelEl}>
      {#if !A}
        <div class="intro">
          <h2 tabindex="-1" bind:this={headEl}>Four ways to sort thirteen brewers</h2>
          <p>Brewers are often grouped as pour-over, immersion and pressure, but those mix different things. Here each property is its own axis: how water meets the coffee, what filters it, what pushes the water and how long it takes. Rearrange the sky to see each one, then pick a star.</p>
          <p class="lbl qlbl">Compare two</p>
          <ul class="quick">
            {#each QUICK as [a, b] (a + b)}
              <li><button type="button" class="qbtn" onclick={() => compare(a, b)}>{atlasById(a)?.label} <span>vs</span> {atlasById(b)?.label}</button></li>
            {/each}
          </ul>
        </div>
      {:else if !B}
        <div class="detail">
          <button type="button" class="x" aria-label="Close {A.label}" onclick={close}>×</button>
          <p class="kick">{CONTACT[A.contact].label}</p>
          <h2 tabindex="-1" bind:this={headEl}>{A.label}</h2>
          <ul class="axes">
            {#each ARRANGE as x (x.id)}<li><span class="lbl">{x.label}</span>{axisValue(A, x.id)}</li>{/each}
          </ul>
          {#if A.timeNote}<p class="quiet small fn">* {A.timeNote.replace(/^\w/, (c) => c.toUpperCase())}.</p>{/if}
          {#if A.filterNote}<p class="quiet small fn">† {A.filterNote.replace(/^\w/, (c) => c.toUpperCase())}.</p>{/if}
          <div class="cut">{#key A.id}<BrewerCutaway method={A.id} playing={!reduced} />{/key}</div>
          <p class="desc">{keep(describe(A))}</p>
          <dl class="nums">
            <div><dt>Ratio</dt><dd>{keep(ratioText(A))}</dd></div>
            <div><dt>Grind</dt><dd>{A.grind}</dd></div>
            <div><dt>Water</dt><dd>{#each A.temp.split(' (') as part, i (i)}{#if i}<small class="alt">({keep(part)}</small>{:else}{keep(part)}{/if}{/each}</dd></div>
            <div><dt>Hands-on</dt><dd><span class="att" aria-hidden="true">{dots(A.attention)}</span> {['', 'Low', 'Some', 'High'][A.attention]}</dd></div>
          </dl>
          <p class="quiet small">Numbers from {A.recipeBy}. Hands-on is our judgment.</p>
          <div class="actions">
            {#if brewGuideHref(A)}
              <a class="primary" href={brewGuideHref(A)}>Brew it in the Brew Guide →</a>
              <a class="linkish" href="/blog/{A.guide.slug}/">{A.guide.title}</a>
            {:else}
              <a class="primary" href="/blog/{A.guide.slug}/">Read the {A.label} guide →</a>
              <span class="quiet small">The Brew Guide doesn't cover {A.the} yet.</span>
            {/if}
          </div>
          <div class="cmpstart">
            {#if picking}
              <p class="small" role="status">Pick a second star{view === 'list' ? ' from the list' : ''}, or choose one here:</p>
            {/if}
            <label class="pickvs">
              <span class="lbl">Compare with</span>
              <select onchange={(e) => { const v = (e.currentTarget as HTMLSelectElement).value; if (v) compare(A!.id, v as AtlasId); }}>
                <option value="">Choose a brewer…</option>
                {#each ATLAS.filter((m) => m.id !== A.id) as m (m.id)}<option value={m.id}>{m.label}</option>{/each}
              </select>
            </label>
            {#if !picking}<button type="button" class="linkish" onclick={async () => { picking = true; await tick(); (document.querySelector(`.mc [data-star]:not([data-star="${A!.id}"])`) as HTMLElement | null)?.focus(); }}>or pick a second star on the chart</button>{/if}
          </div>
        </div>
      {:else}
        {@const d = differences(A, B)}
        {@const rd = recipeDiffers(A, B)}
        <div class="detail compare">
          <button type="button" class="x" aria-label="Close the comparison" onclick={close}>×</button>
          <p class="kick">Compare</p>
          <h2 tabindex="-1" bind:this={headEl}>{A.label} <em>vs</em> {B.label}</h2>
          <p class="diff"><span class="lbl">The difference</span>{differenceSentence(A, B)}</p>
          <div class="pair">
            {#each [A, B] as m (m.id)}
              <figure>
                <BrewerCutaway method={m.id} playing={!reduced} compact />
                <figcaption>{m.label}</figcaption>
              </figure>
            {/each}
          </div>
          <table class="ctab">
            <thead><tr><th scope="col"><span class="sr">Property</span></th><th scope="col">{A.label}</th><th scope="col">{B.label}</th></tr></thead>
            <tbody>
              {#each ARRANGE as x (x.id)}
                <tr class:differs={d.includes(x.id)}><th scope="row">{x.label}{#if d.includes(x.id)}<span class="sr"> (differs)</span>{/if}</th><td>{axisValue(A, x.id)}</td><td>{axisValue(B, x.id)}</td></tr>
              {/each}
              <tr class:differs={rd.ratio}><th scope="row">Ratio{#if rd.ratio}<span class="sr"> (differs)</span>{/if}</th><td>{keep(ratioText(A))}</td><td>{keep(ratioText(B))}</td></tr>
              <tr class:differs={rd.grind}><th scope="row">Grind{#if rd.grind}<span class="sr"> (differs)</span>{/if}</th><td>{A.grind}</td><td>{B.grind}</td></tr>
            </tbody>
          </table>
          <details class="rules quiet small"><summary>Highlighted rows are where these two differ. How rows are highlighted</summary>Contact, filter and force when they're different kinds; time when the ranges don't overlap or one takes at least 1.5 times as long; ratio when one uses at least a third more coffee for its water; grind when the grinds differ.</details>
          <p class="quiet small">Time is the typical brew time for each recipe (the moka pot's is its time on the stove).{#each [A, B].filter((m) => m.timeNote) as m (m.id)}{' '}* {m.label}: {m.timeNote}.{/each}{#each [A, B].filter((m) => m.filterNote) as m (m.id)}{' '}† {m.label}: {m.filterNote}.{/each}</p>
          <div class="actions">
            {#each [A, B] as m (m.id)}
              {#if brewGuideHref(m)}<a class="ghost" href={brewGuideHref(m)}>{m.label} in the Brew Guide →</a>{:else}<a class="ghost" href="/blog/{m.guide.slug}/">{m.label} guide →</a>{/if}
            {/each}
            <button type="button" class="linkish" onclick={swap}>Swap</button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .mc {
    --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif;
  }
  .lbl { font: 500 11px/1.3 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 6px; display: block; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  .quiet { color: var(--ink-3); }
  .small { font-size: 13.5px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  .topbar { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
  .arr { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .arr .lbl { margin: 0; }
  .seg { display: flex; border: 1px solid var(--rule); border-radius: 999px; overflow: hidden; flex: none; }
  .seg button { appearance: none; border: 0; background: #fff; padding: 8px 16px; min-height: 40px; font: 500 14px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--rule); }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; }
  .seg.small button { padding: 7px 14px; min-height: 36px; font-size: 13.5px; }

  .body { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); gap: 22px; align-items: start; }
  .stagecol { min-width: 0; }
  .sky { overflow: hidden; background: #2A3040; }
  .sky svg { display: block; width: 100%; height: auto; }
  /* Phones get a taller sky, known only once the page runs: hold its shape until then. */
  @media (max-width: 720px) { .sky.pre { aspect-ratio: 632 / 760; } .sky.pre svg { visibility: hidden; } }
  .hublab { font: 600 15px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .22em; fill: #D4A44C; }
  .hubsub { font: italic 400 17px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #8898B0; letter-spacing: .02em; }
  .skycap { font: italic 400 19px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #4A5A70; opacity: .55; letter-spacing: .28em; }
  .compass { font: 400 6px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #D4A44C; }
  .tick { font: 500 15px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; fill: #A9B5C9; }
  .range { stroke: #D4A44C; stroke-opacity: .5; stroke-width: 3; stroke-linecap: round; }
  .twinkle { animation: twinkle ease-in-out infinite; }
  @keyframes twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
  .chains, .hub { animation: fadein .8s ease-out both; }
  @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
  .star { cursor: pointer; transition: transform .75s cubic-bezier(.2, .7, .2, 1), opacity .3s; outline: none; }
  .star.dimmed { opacity: .55; }
  .star:hover .core { fill: #F0D070; }
  .star:hover .slab, .star:focus-visible .slab { fill: #F5F0E8; }
  .star:focus-visible .core { stroke: #F5D78E; stroke-width: 2; }
  .star:focus-visible .slab { text-decoration: underline; }
  /* A sky-colored halo behind each name breaks the constellation line where it passes. */
  .slab { font: 600 18px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; letter-spacing: .02em; fill: #C0C8D8; transition: fill .2s; paint-order: stroke; stroke: #12203A; stroke-width: 6px; stroke-linejoin: round; }
  .mlab { font: 600 18px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; letter-spacing: .02em; fill: #000; stroke: #000; stroke-width: 12px; stroke-linejoin: round; }
  .kit { white-space: nowrap; display: inline-block; margin-right: 10px; }
  .lring { display: inline-block; width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid #c8a24a; vertical-align: -1px; margin-right: 4px; }
  .edge, .edge text { font: italic 400 19px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #aab6ca; }
  .slab.on { fill: #F5F0E8; }
  .pick .slab { fill: #F0D070; }
  .ring { animation: pulse 2.4s ease-in-out infinite; }
  @keyframes pulse { 50% { opacity: .35; } }
  .key { margin: 14px auto 0; display: grid; gap: 5px; max-width: 640px; }
  .key .kstate { font: 400 19px/1.3 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; color: var(--ink); }
  .key .ksym { color: var(--ink-3); font-size: 13.5px; border-bottom: 1px solid var(--rule); padding-bottom: 6px; margin-bottom: 2px !important; }
  .ghost-cap { font: italic 400 20px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; color: var(--ink); margin-right: auto; }
  .fn { margin: -4px 0 8px; }
  .alt { display: block; font: 400 12.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-3); }
  .timecap { font: italic 400 18px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #C9BBA8; }
  .qlbl { margin-top: 16px !important; }
  .key p { margin: 0; font-size: 14px; color: var(--ink-2); }
  .key b { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin-right: 6px; }
  .key .legend { margin-top: 4px; color: var(--ink-3); font-size: 13.5px; }
  .lstar { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #2a1d15; vertical-align: middle; margin-right: 3px; }
  .lstar.big { width: 12px; height: 12px; }
  .lray { color: var(--ink); margin-left: 8px; }

  .list section + section { margin-top: 14px; }
  .list h3 { font: 400 26px/1.1 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 0; }
  .gline { margin: 2px 0 8px; font-size: 14px; color: var(--ink-3); }
  .list ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
  .row { appearance: none; width: 100%; text-align: left; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 10px 12px; cursor: pointer; display: grid; grid-template-columns: 26px 1fr auto; gap: 2px 10px; align-items: center; color: var(--ink); }
  .row:hover { border-color: var(--ink-3); }
  .row.on { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); background: #fffaf2; }
  .rstar { width: var(--s); height: var(--s); border-radius: 50%; background: #2a1d15; justify-self: center; box-shadow: 0 0 0 3px #f1e3c8; }
  .rstar.rays { box-shadow: 0 0 0 3px #f1e3c8, 0 0 0 4.5px #c3873a; }
  .rname { font: 600 16px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; }
  .rmeta { font: 500 12.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-3); white-space: nowrap; }
  .rline { grid-column: 2 / 4; font-size: 14px; color: var(--ink-2); }

  .panel { min-width: 0; scroll-margin-top: 84px; }
  .panel h2 { font: 400 40px/1.02 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 4px 0 10px; outline: none; }
  .panel h2 em { font-style: italic; color: var(--ink-3); }
  .intro h2 { font-size: 34px; }
  .intro p { color: var(--ink-2); }
  .quick { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
  .qbtn { appearance: none; width: 100%; text-align: left; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 12px 14px; min-height: 48px; font: 600 16px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink); cursor: pointer; }
  .qbtn span { font-weight: 400; color: var(--ink-3); font-style: italic; margin: 0 4px; }
  .qbtn:hover { border-color: var(--ink-3); background: #fffaf2; }
  .detail { position: relative; }
  .x { position: absolute; top: 0; right: 0; width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; font-size: 19px; cursor: pointer; color: var(--ink-2); }
  .axes { list-style: none; margin: 0 0 10px; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .axes li { padding: 8px 8px 8px 0; font-size: 14.5px; font-weight: 500; }
  .axes li:nth-child(even) { border-left: 1px solid var(--rule); padding-left: 10px; }
  .axes li:nth-child(n + 3) { border-top: 1px solid var(--rule); }
  .axes .lbl { margin-bottom: 2px; }
  .cut { max-width: 300px; margin: 0 auto; }
  @media (max-width: 640px) { .cut { max-width: 230px; } }
  .cut :global(svg) { width: 100%; height: auto; display: block; }
  .desc { font: 400 21px/1.3 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 6px 0 10px; }
  .nums { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; margin: 0 0 6px; border-top: 1px solid var(--rule); }
  .nums div { padding: 8px 0; border-bottom: 1px solid var(--rule); }
  .nums div:nth-child(odd) { padding-right: 10px; }
  .nums div:nth-child(even) { border-left: 1px solid var(--rule); padding-left: 10px; }
  .nums dt { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .nums dd { margin: 2px 0 0; font: 500 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif; }
  .nums small { font: 400 12px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink-3); }
  .att { letter-spacing: .12em; color: var(--crema-deep); }
  .actions { display: flex; gap: 10px 14px; align-items: center; flex-wrap: wrap; margin-top: 12px; }
  .primary { display: inline-block; background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 11px 20px; font: 600 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; text-decoration: none; }
  .primary:hover { background: #3b2a1f; }
  .ghost { appearance: none; display: inline-block; border: 1px solid var(--ink-3); background: #fff; color: var(--ink); border-radius: 999px; padding: 9px 16px; min-height: 42px; font: 500 14.5px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; text-decoration: none; cursor: pointer; }
  .linkish { appearance: none; border: 0; background: none; padding: 4px 0; font: inherit; font-size: 15px; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .cmpstart { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--rule); display: flex; gap: 10px 14px; align-items: flex-end; flex-wrap: wrap; }
  .cmpstart p { flex-basis: 100%; margin: 0; }
  .pickvs select { font: 400 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; padding: 8px 32px 8px 12px; border: 1px solid var(--rule); border-radius: 10px; background: #fff; color: var(--ink); min-height: 42px; appearance: none; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 12px center; }
  .diff { font: 400 22px/1.3 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 0 0 10px; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pair figure { margin: 0; background: #fff; border: 1px solid var(--rule); border-radius: 12px; padding: 6px; }
  .pair figure :global(svg) { width: 100%; height: auto; display: block; }
  .pair figcaption { text-align: center; font: 600 14px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; padding-bottom: 4px; }
  .ctab { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 14.5px; }
  .ctab th, .ctab td { text-align: left; padding: 7px 8px; border-bottom: 1px solid #e6dccd; vertical-align: top; text-wrap: pretty; }
  .ctab thead th { font: 600 14px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; }
  .ctab tbody th { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); width: 24%; }
  .ctab tr.differs td { background: #fbe9cc; font-weight: 600; }
  .ctab tr.differs th { color: var(--crema-deep); box-shadow: inset 3px 0 0 var(--crema-deep); }

  @media (max-width: 900px) {
    .body { grid-template-columns: 1fr; }
  }
  @media (max-width: 720px) {
    .slab, .mlab { font-size: 22px; }
    .hublab { font-size: 18px; }
    .hubsub { font-size: 20px; }
    .tick { font-size: 17px; }
    .skycap { font-size: 20px; letter-spacing: .14em; }
  }
  @media (max-width: 640px) {
    .mc { padding: 0; }
    .topbar { gap: 8px; }
    .arr { width: 100%; }
    .seg button { padding: 8px 12px; font-size: 13.5px; }
    .ghost-cap { flex: 1; font-size: 18px; }
    .topbar > .seg.small { margin-left: auto; }
    .ghost-cap { margin-right: 0; }
    .cut :global(svg) { overflow: visible; }

    .panel h2 { font-size: 34px; }
    .diff { font-size: 20px; }
  }
  @media (prefers-reduced-motion: reduce) { .star { transition: none; } .chains, .hub, .ring, .twinkle { animation: none; } }
</style>
