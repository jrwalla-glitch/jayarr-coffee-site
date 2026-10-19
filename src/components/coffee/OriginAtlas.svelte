<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { countryPaths, TROPIC_CANCER_Y, TROPIC_CAPRICORN_Y, EQUATOR_Y } from '../../data/mapPaths.ts';
  import {
    ORIGINS, CONTINENTS, MONTHS_LONG, ARRIVAL_EXAMPLES, originById, harvestState, harvestText, harvestingIn, pickingElsewhereIn, bandText,
    productionText, productionSource, sourceNames, project,
  } from '../../lib/coffee/origins.ts';
  import type { Band, Continent, HarvestState, Origin } from '../../lib/coffee/origins.ts';
  import { regionPoint } from '../../lib/coffee/mapPlace.ts';
  import { drawsEdge } from '../../lib/coffee/origins.ts';
  import HarvestRing from './art/HarvestRing.svelte';
  import AltitudeBand from './art/AltitudeBand.svelte';

  // The Coffee Origins: an antique map of the coffee belt. Each origin carries its harvest as a
  // ring; turn the month dial to see who is picking now, pick an origin to fly to its growing
  // regions, and compare two side by side. Facts are Astra's sourced research (origins-atlas.json).
  interface Props {
    /** Roasters' most-used words per origin, from the winter 2026 catalog sample. */
    roasterWords: Record<string, { words: { id: string; label: string; n: number }[]; lots: number }>;
    sources: Record<string, { title: string; url: string; checked: string }>;
  }
  let { roasterWords, sources }: Props = $props();

  const FULL = [30, 42, 920, 272];
  // The open card's size on the map (desktop), so labels can keep clear of it.
  const TAG_W = 330, TAG_H = 210;
  const PHONE: Record<Continent, number[]> = { americas: [36, 78, 410, 283], africa: [520, 112, 196, 135], 'asia-pacific': [676, 98, 296, 204] };
  const COFFEE = new Set(ORIGINS.map((o) => o.id));

  let month = $state(10);
  let selId = $state<string | null>(null);
  let vsId = $state<string | null>(null);
  // What the pointer is over: the nearest marker within reach, else the country under it.
  let hoverCountry = $state<string | null>(null);
  let hoverMarker = $state<string | null>(null);
  const hover = $derived(hoverMarker ?? hoverCountry);
  let mapSvg = $state<SVGSVGElement | null>(null);
  let query = $state('');
  // A month the reader picks (or a link brings) goes in the link, even today's (review r4, Muse O2).
  let monthPicked = $state(false);
  // Search ignores accents and case, so "Tarrazu" finds Tarrazú and "Narino" finds Nariño.
  const fold = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  let narrow = $state(false);
  let region = $state<Continent>('americas');
  let mounted = $state(false);
  let reduced = $state(false);
  let panelEl = $state<HTMLElement | null>(null);
  let headEl = $state<HTMLElement | null>(null);
  let opener: string | null = null;
  const vb = new Tween(FULL, { duration: 750, easing: cubicOut });

  let sel = $derived(selId ? originById(selId) ?? null : null);
  let vs = $derived(vsId ? originById(vsId) ?? null : null);
  let harvesting = $derived(harvestingIn(month));
  let elsewhereNow = $derived(pickingElsewhereIn(month));
  let zoom = $derived(FULL[2] / vb.current[2]);
  let mapW = $state(1200);
  // Map units per screen pixel: markers and labels keep their size on screen at any zoom.
  let upp = $derived(vb.current[2] / Math.max(200, mapW));
  // Region marks are placed for the zoom's end point, so a zoom doesn't re-place them every frame.
  let markU = $derived(vb.target[2] / Math.max(200, mapW));
  let shown = $derived.by(() => {
    const t = fold(query.trim());
    return ORIGINS.filter((o) => !t || fold(o.name).includes(t) || o.regions.some((r) => fold(r.name).includes(t)));
  });

  function target(): number[] {
    const aspect = narrow ? 1.45 : FULL[2] / FULL[3];
    if (sel && !vs) {
      const [px, py] = project(sel.lat, sel.lon);
      // On a phone, zoom in far enough that the growing regions spread apart (Ethiopia's five sit
      // within a few degrees of each other), but never past the country's own neighbourhood.
      const pts = sel.regions.filter((r) => r.lat !== null && r.lon !== null).map((r) => regionPoint(sel!.id, r.lat!, r.lon!));
      const spread = pts.reduce((m, [x, y]) => Math.max(m, Math.abs(x - px), Math.abs(y - py) * aspect), 0);
      const w = narrow ? Math.min(150, Math.max(70, spread * 3.2)) : 330, h = w / aspect;
      const fx = narrow ? 0.5 : 0.34;
      return [Math.max(0, Math.min(1000 - w, px - w * fx)), Math.max(0, Math.min(367 - h, py - h / 2)), w, h];
    }
    return narrow ? PHONE[region] : FULL;
  }
  $effect(() => { void [selId, vsId, narrow, region]; vb.set(target(), { duration: mounted && !reduced ? 750 : 0 }); });

  async function choose(id: string) {
    opener = id;
    if (selId && !vsId && picking && id !== selId) { vsId = id; picking = false; }
    else { selId = selId === id && !vsId ? null : id; vsId = null; picking = false; }
    const o = originById(id);
    if (o && narrow && o.continent !== region) region = o.continent;
    await reveal();
  }
  let picking = $state(false);
  async function reveal() {
    if (!matchMedia('(max-width: 900px)').matches) return;
    await tick();
    panelEl?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    headEl?.focus({ preventScroll: true });
  }
  async function close() {
    if (vsId) vsId = null; else { selId = null; picking = false; }
    await tick();
    if (opener) (document.querySelector(`[data-origin="${opener}"]`) as HTMLElement | null)?.focus();
  }
  function keyAct(e: KeyboardEvent, fn: () => void) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }
  // A chooser belongs to the view it was opened on.
  $effect(() => { void [region, selId, vsId]; which = null; });
  function onKey(e: KeyboardEvent) { if (e.key === 'Escape' && which) { which = null; return; } if (e.key === 'Escape' && (selId || picking)) close(); }

  onMount(() => {
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mq = matchMedia('(max-width: 720px)');
    narrow = mq.matches;
    mq.addEventListener('change', (e) => { narrow = e.matches; });
    month = new Date().getMonth() + 1;
    const q = new URLSearchParams(location.search);
    const slug = (x: string | null) => x?.trim().toLowerCase().replace(/_/g, '-') ?? null;
    const o = slug(q.get('o')), v = slug(q.get('vs')), m = Number(q.get('month'));
    if (o && originById(o)) { selId = o; if (narrow) region = originById(o)!.continent; }
    if (selId && v && v !== selId && originById(v)) vsId = v;
    if (Number.isInteger(m) && m >= 1 && m <= 12) { month = m; monthPicked = true; }
    vb.set(target(), { duration: 0 });
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    if (selId) q.set('o', selId);
    if (selId && vsId) q.set('vs', vsId);
    if (monthPicked) q.set('month', String(month));
    history.replaceState(history.state, '', q.toString() ? `${location.pathname}?${q}` : location.pathname);
  });

  // What gets a ring and a label at this zoom: rings where they won't touch a neighbour, labels
  // placed greedily (the chosen origins and their regions first) so none overlap on screen.
  interface Box { x: number; y: number; w: number; h: number }
  const hit = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  interface Spot { dx: number; dy: number; anchor: 'start' | 'middle' | 'end'; lead?: boolean }
  let marks = $derived.by(() => {
    const v = vb.current, u = upp, H = mapW * (v[3] / v[2]);
    const pts = ORIGINS.map((o) => { const [mx, my] = project(o.lat, o.lon); return { o, sx: (mx - v[0]) / u, sy: (my - v[1]) / u }; });
    const zoomed = narrow ? zoom > 3.5 : zoom > 2.4;
    const chosen = (id: string) => id === selId || id === vsId;
    const inView = (p: { sx: number; sy: number }) => p.sx > -10 && p.sx < mapW + 10 && p.sy > -10 && p.sy < H + 10;
    const ring = new Set<string>();
    for (const p of pts) {
      if (chosen(p.o.id) || narrow || !zoomed) continue;
      if (!pts.some((q) => q !== p && Math.hypot(q.sx - p.sx, q.sy - p.sy) < 38)) ring.add(p.o.id);
    }
    const radius = (id: string) => (ring.has(id) ? 15 : chosen(id) ? (sel && !vs && zoomed ? 6 : 13) : 6);
    // Every marker in view is an obstacle; labels try four spots around their point.
    const boxes: Box[] = pts.filter(inView).map((p) => { const r = radius(p.o.id) + 2; return { x: p.sx - r, y: p.sy - r, w: r * 2, h: r * 2 }; });
    // The open card on the map is taken space too.
    if (sel && !vs && !narrow) boxes.push({ x: mapW - 16 - TAG_W - 8, y: 0, w: TAG_W + 24, h: TAG_H + 24 });
    const within = (b: Box) => b.x > 4 && b.y > 2 && b.x + b.w < mapW - 4 && b.y + b.h < H - 2;
    const tryPlace = (sx: number, sy: number, text: string, fs: number, r: number, force = false, others: { sx: number; sy: number }[] = []): Spot | null => {
      const w = text.length * fs * 0.47, h = fs + 2;
      const spots: (Spot & { b: Box })[] = [];
      for (const g of [0, 9, 20, 34]) spots.push(
        { dx: 0, dy: -r - 4 - g, anchor: 'middle', b: { x: sx - w / 2, y: sy - r - 4 - g - fs, w, h } },
        { dx: r + 5 + g, dy: fs * 0.35, anchor: 'start', b: { x: sx + r + 5 + g, y: sy - fs * 0.65, w, h } },
        { dx: 0, dy: r + fs + 2 + g, anchor: 'middle', b: { x: sx - w / 2, y: sy + r + 2 + g, w, h } },
        { dx: -r - 5 - g, dy: fs * 0.35, anchor: 'end', b: { x: sx - r - 5 - g - w, y: sy - fs * 0.65, w, h } },
        { dx: r + 3 + g, dy: -r - 2 - g, anchor: 'start', b: { x: sx + r + 3 + g, y: sy - r - 2 - g - fs, w, h } },
        { dx: -r - 3 - g, dy: r + fs + g, anchor: 'end', b: { x: sx - r - 3 - g - w, y: sy + r + g, w, h } },
      );
      const near = (b: Box, q: { sx: number; sy: number }) => Math.hypot(Math.max(b.x - q.sx, 0, q.sx - b.x - b.w), Math.max(b.y - q.sy, 0, q.sy - b.y - b.h));
      const owns = (b: Box) => others.every((q) => near(b, q) > near(b, { sx, sy }) + 2);
      const ok = spots.find((c) => within(c.b) && owns(c.b) && !boxes.some((b) => hit(b, c.b))) ?? spots.find((c) => within(c.b) && !boxes.some((b) => hit(b, c.b)));
      const pick = ok ?? (force ? spots.find((c) => within(c.b) && owns(c.b)) ?? spots.find((c) => within(c.b)) ?? spots[0] : null);
      if (pick) boxes.push(pick.b);
      // Labels placed away from their mark get a short leader line back to it.
      return pick ? { dx: pick.dx, dy: pick.dy, anchor: pick.anchor, lead: Math.hypot(pick.dx, pick.dy) > r + 22 } : null;
    };
    const label = new Map<string, Spot>(), regionLabel = new Map<string, Spot>();
    // Region marks first, so the country's own name never lands on one.
    const regs = pts.filter((q) => chosen(q.o.id)).flatMap((p) => p.o.regions.filter((r) => r.lat !== null && r.lon !== null).map((r) => {
      const [rx, ry] = regionPoint(p.o.id, r.lat!, r.lon!, 6 * markU);
      const sx = (rx - v[0]) / u, sy = (ry - v[1]) / u;
      boxes.push({ x: sx - 7, y: sy - 7, w: 14, h: 14 });
      return { key: `${p.o.id}|${r.name}`, name: r.name, sx, sy };
    }));
    // Zoomed to one origin, its regions are the picture and the card names the country, so the
    // regions get the labels; a comparison names both countries.
    const solo = !!sel && !vs && zoomed && regs.length > 0;
    if (!solo) for (const p of pts.filter((q) => chosen(q.o.id))) { const sp = tryPlace(p.sx, p.sy, p.o.name, 17, radius(p.o.id), true); if (sp) label.set(p.o.id, sp); }
    for (const r of regs) { const sp = tryPlace(r.sx, r.sy, r.name, 13, 5, solo, regs.filter((q) => q !== r)); if (sp) regionLabel.set(r.key, sp); }
    if (hover && !chosen(hover)) { const p = pts.find((q) => q.o.id === hover); if (p) { const sp = tryPlace(p.sx, p.sy, p.o.name, 14, radius(p.o.id), true); if (sp) label.set(hover, sp); } }
    if (zoomed) {
      const crowded = (p: { sx: number; sy: number; o: Origin }) => narrow && !chosen(p.o.id) && pts.some((q) => q !== p && inView(q) && Math.hypot(q.sx - p.sx, q.sy - p.sy) < 10);
      const order = pts.filter((p) => !label.has(p.o.id) && inView(p) && !(solo && chosen(p.o.id)) && !crowded(p)).sort((a, b) => Number(live(b.o)) - Number(live(a.o)));
      for (const p of order) { const sp = tryPlace(p.sx, p.sy, p.o.name, 14, radius(p.o.id)); if (sp) label.set(p.o.id, sp); }
    }
    // Where dots crowd (Rwanda and Burundi), a name could sit nearer a neighbour's dot than its own,
    // so crowded or far-placed names get a leader line back to their own dot.
    for (const [id, sp] of label) {
      const p = pts.find((q) => q.o.id === id)!;
      if (pts.some((q) => q !== p && Math.hypot(q.sx - p.sx, q.sy - p.sy) < 24)) sp.lead = true;
    }
    return { ring, label, regionLabel, solo };
  });

  // Research scopes in plain words: which calendar or band a figure describes.
  function scopeText(sc: string): string {
    if (/^arabica$/i.test(sc)) return 'The arabica harvest.';
    if (/^robusta$/i.test(sc)) return 'The robusta harvest.';
    return `The calendar shown: ${sc.replace(/ illustrative calendar/i, '').replace(/^\w/, (c) => c.toLowerCase())}.`.replace('calendar shown: huila', "calendar shown: Huila's");
  }
  const altScope = (sc: string) => sc.replace(/\bRobusta\b/g, 'robusta').replace(/\bArabica\b/g, 'arabica').replace(/[,;]?\s*not national extrema\.?/i, '; not the highest or lowest farms.').replace(/not national extrema/i, "not the country's highest or lowest farms");
  // Markers sit close together (Rwanda and Burundi, Costa Rica and Panama), so a click or tap opens
  // the nearest one within reach of the pointer rather than whichever hit area is drawn on top. A
  // tap uses where the finger landed (the browser may nudge the click toward a nearby target), and
  // when two dots are about equally close it asks which one was meant.
  function markersNear(cx: number, cy: number, reachPx: number) {
    const m = mapSvg?.getScreenCTM();
    if (!m) return [];
    const pt = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return ORIGINS.map((o) => { const [x, y] = project(o.lat, o.lon); return { id: o.id, d: Math.hypot(x - pt.x, y - pt.y) / upp }; })
      .filter((c) => c.d <= reachPx).sort((a, b) => a.d - b.d);
  }
  const nearestMarker = (e: MouseEvent) => markersNear(e.clientX, e.clientY, 16)[0]?.id ?? null;
  let downAt: { x: number; y: number; touch: boolean; t: number } | null = null;
  let which = $state<{ ids: string[]; left: number; top: number } | null>(null);
  let mapBox = $state<HTMLElement | null>(null);
  function mapDown(e: PointerEvent) { downAt = { x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch', t: performance.now() }; }
  function mapClick(e: MouseEvent) {
    const raw = downAt && performance.now() - downAt.t < 1200 ? downAt : null;
    const touch = raw?.touch ?? (e as PointerEvent).pointerType === 'touch';
    const x = raw?.x ?? e.clientX, y = raw?.y ?? e.clientY;
    const near = markersNear(x, y, touch ? 22 : 16);
    if ((e.target as Element).closest?.('.olab') && !(touch && near.length && near[0].d <= 8)) { which = null; return; }
    if (!near.length) { which = null; return; }
    e.stopPropagation();
    const tied = touch ? near.filter((c) => c.d <= near[0].d + 10).slice(0, 4) : [];
    if (tied.length > 1 && mapBox) {
      const r = mapBox.getBoundingClientRect();
      which = { ids: tied.map((c) => c.id), left: Math.min(Math.max(6, x - r.left - 75), r.width - 156), top: Math.max(6, Math.min(y - r.top + 16, r.height - 36 * tied.length - 34)) };
      return;
    }
    which = null;
    choose(near[0].id);
  }
  const stateOf = (o: Origin) => harvestState(o, month);
  // The glance card pairs harvest and altitude, so both describe the same coffee: a robusta calendar
  // gets the robusta band, and an arabica band is named as one where robusta grows too (review r4, Muse O1).
  const tagAltitude = (o: Origin): [string, Band | null] =>
    /^robusta/i.test(o.harvest.scope ?? '') && o.robustaAltitudeM ? ['Altitude (robusta)', o.robustaAltitudeM] : [o.robustaAltitudeM ? 'Altitude (arabica)' : 'Altitude', o.altitudeM];
  let selAlt = $derived<[string, Band | null]>(sel ? tagAltitude(sel) : ['Altitude', null]);
  const live = (o: Origin) => { const s = stateOf(o); return s === 'main' || s === 'second'; };
  // Country fills stay quiet: a whole country isn't a growing region. Only the chosen ones are rust;
  // the dots carry who is harvesting.
  function fillFor(id: string) {
    if (!COFFEE.has(id)) return '#e4ddd0';
    if (sel?.id === id || vs?.id === id) return '#b0672b';
    return '#ddc9a8';
  }
  const src = (id?: string) => (id && sources[id]) || null;
  let arrival = $derived(sel ? ARRIVAL_EXAMPLES.find((a) => a.origin === sel!.name) ?? null : null);
</script>

<svelte:window onkeydown={onKey} />

<!-- A band never breaks inside a figure: metres and feet each stay on one line. -->
{#snippet stateDot(mx: number, my: number, st: HarvestState)}
  {#if st === 'edge'}
    <circle cx={mx} cy={my} r={6 * upp} fill="#fbf6ee" stroke="#2a1d15" stroke-width={1.3 * upp} />
    <path d="M{mx} {my - 6 * upp} A {6 * upp} {6 * upp} 0 0 0 {mx} {my + 6 * upp} Z" fill="#9a5420" />
  {:else if st === 'elsewhere'}
    <!-- Outside the drawn calendar, but picked in another region: a ring with a small centre. -->
    <circle cx={mx} cy={my} r={5.4 * upp} fill="#fbf6ee" stroke="#2a1d15" stroke-width={1.2 * upp} />
    <circle cx={mx} cy={my} r={2 * upp} fill="#9a5420" />
  {:else}
    <circle cx={mx} cy={my} r={(st === 'off' ? 4.4 : 6) * upp} fill={st === 'off' ? '#fbf6ee' : '#9a5420'} stroke="#2a1d15" stroke-width={(st === 'off' ? 1.1 : 1.3) * upp} />
  {/if}
{/snippet}
{#snippet band(t: string)}{@const [m, ft] = t.split(' (')}<span class="nb">{m}</span>{#if ft}{' '}<span class="nb">({ft}</span>{/if}{/snippet}

{#snippet profile(o: Origin, compact: boolean)}
  <div class="pfacts" class:compact>
    <div class="pair">
      <HarvestRing harvest={o.harvest} month={month} labels size={compact ? 140 : 150} label="{o.name} harvest: {harvestText(o)}" />
      <AltitudeBand arabica={o.altitudeM} robusta={o.robustaAltitudeM} name={o.name} height={compact ? 150 : 166} />
    </div>
    {#if !compact}
      <ul class="rkey" aria-label="Ring key"><li><span class="k main"></span>Main harvest</li>{#if o.harvest.second}<li><span class="k second"></span>Second crop</li>{/if}{#if drawsEdge(o)}<li><span class="k edge"></span>Edge month, a margin we add: picking may start early or run late</li>{/if}<li>The hand points to {MONTHS_LONG[month - 1]}</li></ul>
    {/if}
    <dl class="facts">
      <div><dt>Harvest</dt><dd>{harvestText(o)}{#if o.harvest.scope && !compact && !/^This is /.test(o.harvest.variesBy ?? '')}<span class="sub">{scopeText(o.harvest.scope)}</span>{/if}{#if o.harvest.variesBy && !compact}<span class="sub">{o.harvest.variesBy.replace(/^This is (\w+);\s*/, "This calendar is $1's; ")}</span>{/if}{#if o.harvest.elsewhere}<span class="sub">Outside these months, {o.harvest.elsewhere}.</span>{/if}{#if !compact && o.harvest.sources.length}<span class="sub srcline">Calendar from {sourceNames(o.harvest.sources)}, checked October 2026{#if o.harvest.compare?.length}; compared with {sourceNames(o.harvest.compare)}{/if}</span>{/if}</dd></div>
      <!-- Where robusta grows too, the first band is named as arabica's, so a robusta calendar beside it isn't read as the same coffee (review r5, Opus). -->
      <div><dt>{o.robustaAltitudeM ? 'Altitude (arabica)' : 'Altitude'}</dt><dd>{#if o.altitudeM}{@render band(compact ? bandText(o.altitudeM).split(' (')[0] : bandText(o.altitudeM))}{:else}Not established{/if}{#if o.altitudeM?.scope}<span class="sub">{altScope(o.altitudeM.scope)}</span>{/if}{#if o.robustaAltitudeM}<span class="sub">Robusta {@render band(compact ? bandText(o.robustaAltitudeM).split(' (')[0] : bandText(o.robustaAltitudeM))}{#if o.robustaAltitudeM.scope}{' · '}{altScope(o.robustaAltitudeM.scope)}{/if}</span>{/if}{#if !compact && (o.altitudeM?.sources?.length || o.robustaAltitudeM?.sources?.length)}<span class="sub srcline">{#if o.altitudeM?.sources?.length}{o.robustaAltitudeM ? 'Arabica band from' : 'Band from'} {sourceNames(o.altitudeM.sources)}{/if}{#if o.robustaAltitudeM?.sources?.length}{o.altitudeM?.sources?.length ? '; robusta band from ' : 'Robusta band from '}{sourceNames(o.robustaAltitudeM.sources)}{/if}</span>{/if}</dd></div>
      {#if !compact}
        <div><dt>Production</dt><dd>{productionText(o) ?? 'No current official figure'}{#if o.production?.arabicaShare != null && o.production.arabicaShare < 0.95}<span class="sub">{o.production.arabicaShare < 0.03 ? 'All counted as robusta' : `About ${Math.round(o.production.arabicaShare * 100)}% arabica, the rest robusta`}</span>{/if}{#if o.production}<span class="sub srcline">{productionSource(o)}</span>{/if}</dd></div>
      {/if}
      <div><dt>Varieties</dt><dd>{o.varieties.join(', ') || 'Not established'}</dd></div>
      <div><dt>Processing</dt><dd>{o.processing.join(', ') || 'Not established'}{#if !compact && o.processing.length}<span class="sub">The usual methods; individual lots vary.</span>{/if}</dd></div>
    </dl>
  </div>
{/snippet}

<div class="oa">
  <div class="controls">
    <div class="monthpick" role="group" aria-label="Harvest month">
      <span class="lbl">Harvest in</span>
      <div class="months">
        {#each MONTHS_LONG as m, i (m)}
          <button type="button" aria-pressed={month === i + 1} aria-label={m} onclick={() => { month = i + 1; monthPicked = true; }}>{m.slice(0, 3)}</button>
        {/each}
      </div>
    </div>
    {#if !sel}
      <!-- Rendered from the start and shown by CSS on phones, so the map doesn't move when the page runs. -->
      <div class="seg regions" role="group" aria-label="Map region">
        {#each CONTINENTS as c (c.id)}<button type="button" aria-pressed={region === c.id} onclick={() => (region = c.id)}><span>{c.label}</span> <span class="cnt">{harvesting.filter((o) => o.continent === c.id).length} now</span></button>{/each}
      </div>
    {/if}
  </div>
  <p class="nowline" class:pending={!mounted}><span class="lbl">Harvesting in {MONTHS_LONG[month - 1]}</span>
    {#each harvesting as o (o.id)}<span class="nowitem" class:inreg={o.continent === region}><button type="button" class="nowname" onclick={() => choose(o.id)}>{o.name}</button></span>{/each}{#if elsewhereNow.length}<span class="alsoline">{'\u00a0· '}Also picking in some regions: {#each elsewhereNow as o, i (o.id)}<span class="alsoitem" class:inreg={o.continent === region}>{i > 0 ? ', ' : ''}<button type="button" class="nowname" onclick={() => choose(o.id)}>{o.name}</button></span>{/each}</span>{/if}{#if harvesting.some((o) => o.continent !== region)}<span class="nowmore">{harvesting.filter((o) => o.continent !== region).length} more under the other tabs</span>{/if}
  </p>

  <div class="body">
    <div class="stage">
      <div class="gp-frame" style="--mat: #e8e1d4; --matpad: 14px; --matpad-phone: 7px">
        <div class="mapbox" bind:clientWidth={mapW} bind:this={mapBox}>
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (each marker is its own keyboard button; this only routes pointer clicks to the nearest one) -->
        <svg class="map" class:near={!!hoverMarker} bind:this={mapSvg} onclickcapture={mapClick} onpointerdown={mapDown} onpointermove={(e) => (hoverMarker = e.pointerType === 'touch' ? null : nearestMarker(e))} onpointerleave={() => (hoverMarker = null)}
          viewBox={vb.current.join(' ')} preserveAspectRatio="xMidYMid meet" role="group" aria-label="Map of coffee origins. {harvesting.length} are harvesting in {MONTHS_LONG[month - 1]}.">
          <defs>
            <filter id="oa-grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="2" result="n" />
              <feColorMatrix type="saturate" values="0" in="n" result="g" />
              <feComponentTransfer in="g" result="f"><feFuncR type="linear" slope=".12" intercept=".44" /><feFuncG type="linear" slope=".12" intercept=".44" /><feFuncB type="linear" slope=".12" intercept=".44" /></feComponentTransfer>
              <feBlend in="SourceGraphic" in2="f" mode="soft-light" />
            </filter>
            <radialGradient id="oa-vignette" cx=".5" cy=".5" r=".7"><stop offset=".6" stop-color="#5a5040" stop-opacity="0" /><stop offset="1" stop-color="#5a5040" stop-opacity=".22" /></radialGradient>
          </defs>
          <rect x="-50" y="-50" width="1100" height="470" fill="#ccd0cc" filter="url(#oa-grain)" />
          <rect x="-50" y="-50" width="1100" height="470" fill="#f1e2c4" opacity=".18" />
          <rect x="-50" y={TROPIC_CANCER_Y} width="1100" height={TROPIC_CAPRICORN_Y - TROPIC_CANCER_Y} fill="#d9d2c2" opacity=".35" />
          <g class="lines">
            <line x1="-50" x2="1050" y1={TROPIC_CANCER_Y} y2={TROPIC_CANCER_Y} />
            <line x1="-50" x2="1050" y1={EQUATOR_Y} y2={EQUATOR_Y} class="eq" />
            <line x1="-50" x2="1050" y1={TROPIC_CAPRICORN_Y} y2={TROPIC_CAPRICORN_Y} />
          </g>
          {#each countryPaths as c (c.id)}
            {@const isCoffee = COFFEE.has(c.id)}
            <path d={c.path} fill={fillFor(c.id)} stroke="#a89878" stroke-width={0.7 * upp} stroke-opacity=".7" class:cp={isCoffee}
              onclick={isCoffee ? () => choose(c.id) : undefined} onmouseenter={isCoffee ? () => (hoverCountry = c.id) : undefined} onmouseleave={isCoffee ? () => (hoverCountry = null) : undefined} />
          {/each}
          <g class="mapnotes" style="font-size: {9.5 * upp}px">
            <text x={narrow ? vb.current[0] + vb.current[2] - 10 * upp : vb.current[0] + 10 * upp} y={TROPIC_CANCER_Y - 4 * upp} text-anchor={narrow ? 'end' : 'start'} class="tl">TROPIC OF CANCER</text>
            <text x={vb.current[0] + 10 * upp} y={EQUATOR_Y - 4 * upp} class="tl">EQUATOR</text>
            <text x={vb.current[0] + 10 * upp} y={TROPIC_CAPRICORN_Y + 13 * upp} class="tl">TROPIC OF CAPRICORN</text>
            {#if zoom < 2.2}
              <text x="122" y={EQUATOR_Y + 30} class="ocean">PACIFIC OCEAN</text>
              <text x="388" y={EQUATOR_Y + 22} class="ocean">ATLANTIC OCEAN</text>
              <text x="702" y={EQUATOR_Y + 40} class="ocean">INDIAN OCEAN</text>
            {/if}
          </g>
          {#if !narrow && !sel}
            <g transform="translate(905 92) scale(1.4)" opacity=".55" aria-hidden="true">
              <circle r="12" fill="none" stroke="#5b4a3d" stroke-width=".4" /><circle r="10.5" fill="none" stroke="#c17a3a" stroke-width=".25" />
              <polygon points="0,-10 -1.6,-3 0,-4 1.6,-3" fill="#2a1d15" /><polygon points="0,10 -1.6,3 0,4 1.6,3" fill="#a6896a" /><polygon points="10,0 3,-1.6 4,0 3,1.6" fill="#a6896a" /><polygon points="-10,0 -3,-1.6 -4,0 -3,1.6" fill="#a6896a" />
              <text y="-14" text-anchor="middle" class="compass">N</text>
            </g>
          {/if}

          <!-- The selected origin's growing regions -->
          {#each [sel, vs].filter((x): x is Origin => !!x) as o (o.id)}
            {#each o.regions.filter((r) => r.lat !== null && r.lon !== null) as r (r.name)}
              {@const [rx, ry] = regionPoint(o.id, r.lat!, r.lon!, 6 * markU)}
              {@const sp = marks.regionLabel.get(`${o.id}|${r.name}`)}
              <g class="region">
                <path d="M{rx} {ry - 5 * upp} L{rx + 5 * upp} {ry} L{rx} {ry + 5 * upp} L{rx - 5 * upp} {ry} Z" fill="#2a1d15" stroke="#fbf6ee" stroke-width={1.2 * upp} />
                {#if sp?.lead}<line x1={rx} y1={ry} x2={rx + sp.dx * upp * 0.82} y2={ry + (sp.dy - 4) * upp * 0.82} stroke="#2a1d15" stroke-width={0.8 * upp} opacity=".55" />{/if}
                {#if sp}<text x={rx + sp.dx * upp} y={ry + sp.dy * upp} text-anchor={sp.anchor} class="rlab" style="font-size: {13 * upp}px; stroke-width: {3 * upp}px">{r.name}</text>{/if}
              </g>
            {/each}
          {/each}

          <!-- Origin markers: a ring when there's room, a month dot when the whole belt is in view -->
          {#each ORIGINS as o (o.id)}
            {@const [mx, my] = project(o.lat, o.lon)}
            {@const isSel = sel?.id === o.id || vs?.id === o.id}
            {@const st = stateOf(o)}
            {@const showRing = marks.ring.has(o.id)}
            {@const lsp = marks.label.get(o.id)}
            <g class="marker" class:sel={isSel} data-origin={o.id} role="button" tabindex="0"
              aria-label="{o.name}: harvest {harvestText(o)}{st === 'main' || st === 'second' ? `, harvesting in ${MONTHS_LONG[month - 1]}` : st === 'elsewhere' ? `, picked in another region in ${MONTHS_LONG[month - 1]}` : ''}"
              aria-pressed={isSel} onclick={() => choose(o.id)} onkeydown={(e) => keyAct(e, () => choose(o.id))}>
              {#if lsp?.lead}<line x1={mx} y1={my} x2={mx + lsp.dx * upp * 0.86} y2={my + (lsp.dy - (lsp.anchor === 'middle' && lsp.dy < 0 ? 0 : 4)) * upp * 0.86} stroke="#2a1d15" stroke-width={0.8 * upp} opacity=".5" />{/if}
              {#if showRing}
                <HarvestRing harvest={o.harvest} month={month} size={30 * upp} x={mx} y={my} faint={!live(o)} />
              {:else if isSel && marks.solo}
                <!-- Zoomed on one origin: its dot in this month's state, as the key reads (gate r8). -->
                {@render stateDot(mx, my, st)}
              {:else if isSel}
                <circle cx={mx} cy={my} r={13 * upp} fill="#c3873a" opacity=".35" />
                <circle cx={mx} cy={my} r={7.5 * upp} fill="#6b3a12" stroke="#fbf6ee" stroke-width={2 * upp} />
              {:else}
                {@render stateDot(mx, my, st)}
              {/if}
              {#if marks.label.has(o.id)}
                {@const sp = marks.label.get(o.id)!}
                <text x={mx + sp.dx * upp} y={my + sp.dy * upp} text-anchor={sp.anchor} class="olab" class:on={isSel} style="font-size: {(isSel ? 17 : 14) * upp}px; stroke-width: {3 * upp}px">{o.name}</text>
              {/if}
            </g>
          {/each}
          <rect x="-50" y="-50" width="1100" height="470" fill="url(#oa-vignette)" pointer-events="none" />
        </svg>
        {#if which}
          <div class="which" style="left: {which.left}px; top: {which.top}px" role="group" aria-label="Which origin?">
            <p>Which one?</p>
            {#each which.ids as id (id)}<button type="button" onclick={() => { which = null; choose(id); }}>{originById(id)?.name}</button>{/each}
          </div>
        {/if}
        </div>
        {#if sel && !vs && !narrow}
          <div class="tag" role="region" aria-label="{sel.name} at a glance">
            <button type="button" class="x" aria-label="Close {sel.name}" onclick={close}>×</button>
            <p class="tname">{sel.name}</p>
            <div class="tpair">
              <HarvestRing harvest={sel.harvest} month={month} labels size={104} label="{sel.name} harvest: {harvestText(sel)}" />
              <dl>
                <dt>Harvest</dt><dd>{harvestText(sel)}</dd>
                <dt>{selAlt[0]}</dt><dd>{selAlt[1] ? bandText(selAlt[1]).replace(/ \(.*\)$/, '') : 'Not established'}</dd>
                {#if sel.tendencies.notes.length}<dt>Often described as</dt><dd class="it">{sel.tendencies.notes.slice(0, 3).join(', ')}</dd>{/if}
              </dl>
            </div>
            <a class="tmore" href="#oa-label" onclick={(e) => { e.preventDefault(); document.getElementById('oa-label')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }}>The full profile ↓</a>
          </div>
        {/if}
        <div class="mapkey" aria-hidden="true">
          <span class="kt">Key</span>
          <span><span class="dot on"></span> Harvesting in {MONTHS_LONG[month - 1]}</span>
          <span><span class="dot edge"></span> Maybe: possibly starting or finishing (a one-month margin we add)</span>
          {#if elsewhereNow.length}<span><span class="dot else"></span> Picked in some regions</span>{/if}
          {#if sel && zoom > 2}<span><span class="dia"></span> A growing region</span>{/if}
          <span><span class="dot off"></span> Outside its harvest period</span>
          <span class="kring">{#if zoom > 2}<span class="ringk"></span> {narrow ? 'Ring: 12 months, Jan at top' : 'Ring: its 12-month harvest calendar, January at the top'}{:else}Pick an origin to zoom in and see its year as a ring{/if}</span>
        </div>
      </div>
      <p class="gp-plaque"><b>The Coffee Origins</b><small>An interactive world map</small></p>
    </div>

    <div class="panel gp-label" id="oa-label" bind:this={panelEl}>
      {#if !sel}
        <div class="cols"><div>
        <h2 tabindex="-1" bind:this={headEl}>Harvesting in {MONTHS_LONG[month - 1]}</h2>
        <p class="lead"><span class:pending={!mounted}>{harvesting.length} of {ORIGINS.length} origins are picking this month.</span> Choose one on the map or below to see its year, its growing regions and how its coffees are described.</p>
        <ul class="chips">
          {#each harvesting as o (o.id)}<li><button type="button" class="chip" onclick={() => choose(o.id)}>{o.name}</button></li>{/each}
        </ul>
        <details class="arrive">
          <summary>Harvest isn't when it reaches your roaster</summary>
          <p>Coffee is processed, dried, rested, milled and shipped before a roaster sees it, so importers list arrival separately from harvest: {ARRIVAL_EXAMPLES.map((a) => `${a.origin} is picked ${a.harvest} and typically arrives ${a.arrival}`).join('; ')} (Café Imports' origin calendars). There's no single lag that fits every origin.</p>
        </details>
        </div><div>
        <label class="search"><span class="lbl">Find an origin or region</span><input type="search" placeholder="e.g. Huila, Sidama, Kenya" bind:value={query} /></label>
        <div class="olist">
          {#each CONTINENTS.filter((c) => !narrow || !!query.trim() || c.id === region) as c (c.id)}
            {@const list = shown.filter((o) => o.continent === c.id)}
            {#if list.length}
              <p class="lgroup">{c.label}</p>
              <ul>
                {#each list as o (o.id)}
                  <li>
                    <button type="button" class="orow" data-origin={o.id} onclick={() => choose(o.id)}>
                      <HarvestRing harvest={o.harvest} month={month} size={34} faint={!live(o)} />
                      <span class="oname">{o.name}</span>
                      <span class="ohar">{harvestText(o)}</span>
                    </button>
                  </li>
                {/each}
              </ul>
            {/if}
          {/each}
          {#if !shown.length}<p class="quiet">No origin or region matches "{query}".</p>{/if}
        </div>
        </div></div>
      {:else if !vs}
        <button type="button" class="x" aria-label="Close {sel.name}" onclick={close}>×</button>
        <p class="kick">{CONTINENTS.find((c) => c.id === sel!.continent)?.label}</p>
        <h2 tabindex="-1" bind:this={headEl}>{sel.name}</h2>
        <div class="cols"><div>
        {@render profile(sel, false)}
        </div><div>
        {#if sel.tendencies.notes.length}
          <div class="desc">
            <p class="lbl">Often described as</p>
            <p class="notes">{sel.tendencies.notes.join(', ')}</p>
            {#if sel.tendencies.caveat}<p class="small quiet">{sel.tendencies.caveat}</p>{/if}
            <p class="small quiet">A tendency in how importers describe these coffees, not a promise about any one bag{src(sel.tendencies.source) ? ` (${src(sel.tendencies.source)!.title})` : ''}.</p>
          </div>
        {/if}
        {#if roasterWords[sel.id]?.words.length}
          <div class="desc">
            <p class="lbl">Roasters' words, January–March 2026</p>
            <p class="small">Across {roasterWords[sel.id].lots} lots from {sel.name} in our catalog sample, the notes roasters used most:</p>
            <ul class="chips">
              {#each roasterWords[sel.id].words as w (w.id)}<li><a class="chip" href="/explore/flavors/?note={w.id}">{w.label} <span class="n">{w.n} lots</span></a></li>{/each}
            </ul>
          </div>
        {/if}
        {#if sel.regions.length}
          <p class="lbl">Growing regions on the map</p>
          <p class="small">{sel.regions.map((r) => r.name).join(' · ')}</p>
        {/if}
        <div class="journey" aria-label="From cherry to bag">
          <p class="lbl">From cherry to bag</p>
          <ol>
            <li><b>Picked</b> {harvestText(sel)}</li>
            <li><b>Processed</b> {sel.processing.length ? sel.processing.slice(0, 2).map((x) => x.replace(/\s*\(.*\)$/, '')).join(' or ').toLowerCase() : 'at the mill'}</li>
            <li><b>Dried and rested</b> on patios or raised beds</li>
            <li><b>Shipped</b> {arrival ? `arrives ${arrival.arrival}` : 'months later'}</li>
            <li><b>Roasted</b> and bagged</li>
          </ol>
          {#if arrival}<p class="small quiet jnote">Café Imports lists {sel.name}'s harvest as {arrival.harvest} and typical arrival as {arrival.arrival}.</p>{/if}
        </div>
        <div class="actions">
          {#if sel.page}<a class="primary" href={sel.page}>{sel.name}'s country page{'\u00a0'}→</a>{/if}
          {#each sel.articles.slice(0, sel.page ? 1 : 2) as art (art.slug)}<a class="linkish" href="/blog/{art.slug}/"><span class="artk">Article:</span> {art.title}</a>{/each}
        </div>
        <label class="pickvs">
          <span class="lbl">Compare with</span>
          <select onchange={async (e) => { const v = (e.currentTarget as HTMLSelectElement).value; if (v) { vsId = v; picking = false; await tick(); document.getElementById('oa-label')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); headEl?.focus({ preventScroll: true }); } }}>
            <option value="">Choose an origin…</option>
            {#each ORIGINS.filter((o) => o.id !== sel!.id) as o (o.id)}<option value={o.id}>{o.name}</option>{/each}
          </select>
        </label>
        </div></div>
      {:else}
        <button type="button" class="x" aria-label="Close the comparison" onclick={close}>×</button>
        <p class="kick">Compare</p>
        <h2 tabindex="-1" bind:this={headEl}>{sel.name} <em>and</em> {vs.name}</h2>
        <div class="cmp">
          {#each [sel, vs] as o (o.id)}
            <section>
              <h3>{o.name}</h3>
              {@render profile(o, true)}
              <p class="small"><b>Often described as</b> {o.tendencies.notes.join(', ') || 'not established'}</p>
              <!-- The caveat travels with the notes in the comparison too (Wave D batch 35: Panama's Gesha note). -->
              {#if o.tendencies.caveat}<p class="small quiet">{o.tendencies.caveat}</p>{/if}
              {#if o.page}<a class="linkish" href={o.page}>{o.name}'s country page{'\u00a0'}→</a>{/if}
            </section>
          {/each}
        </div>
        <div class="cmpfoot">
          <ul class="rkey" aria-label="Ring key"><li><span class="k main"></span>Main harvest</li><li><span class="k second"></span>Second crop</li><li><span class="k edge"></span>Edge month, a margin we add: picking may start early or run late</li><li>The hand points to {MONTHS_LONG[month - 1]}</li></ul>
          <p class="small quiet">Both altitude bands are drawn on the same scale.</p>
          <button type="button" class="linkish" onclick={() => { const t = selId; selId = vsId; vsId = t; }}>Swap the two</button>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .oa { --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22; color: var(--ink); font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif; }
  .lbl { font: 500 11px/1.3 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 6px; display: block; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  .quiet { color: var(--ink-3); }
  .small { font-size: 14px; }

  .controls { display: flex; justify-content: center; align-items: center; gap: 10px 14px; flex-wrap: wrap; margin-bottom: 10px; }
  .nowline { text-align: center; margin: 0 auto 14px; max-width: 980px; font-size: 15px; color: var(--ink-2); line-height: 1.7; }
  .nowline .lbl { display: inline; margin-right: 8px; color: var(--crema-deep); }
  /* On a phone the names follow the chosen region tab, as the map does: done in CSS, so the
     server-built list and the live one match and nothing shifts on load. */
  .nowitem + .nowitem::before { content: '\00a0·\00a0'; }
  .nowmore { display: none; color: var(--ink-3); }
  .alsoline { color: var(--ink-3); }
  @media (max-width: 720px) {
    .nowitem:not(.inreg) { display: none; }
    .nowitem + .nowitem::before { content: none; }
    .nowitem.inreg ~ .nowitem.inreg::before { content: '\00a0·\00a0'; }
    /* Its own line: a wrapped "·" can't start a line (gate r8). */
    .nowmore { display: block; margin-top: 2px; }
    .alsoitem:not(.inreg) { display: none; }
    .alsoline:not(:has(.alsoitem.inreg)) { display: none; }
  }
  .nowname { appearance: none; border: 0; background: none; padding: 0; font: 500 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink); text-decoration: underline; text-decoration-color: #c9a46e; text-underline-offset: 3px; cursor: pointer; }
  .nowname:hover { color: var(--crema-deep); }
  .cnt { font: 500 11.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; background: #f1e3cc; color: #6b3a12; border-radius: 999px; padding: 1px 6px; margin-left: 2px; }
  [aria-pressed='true'] .cnt { background: #f3ede3; color: #2a1d15; }
  .monthpick { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .monthpick .lbl { margin: 0; }
  .months { display: flex; border: 1px solid var(--rule); border-radius: 999px; overflow: hidden; background: #fff; }
  .months button { appearance: none; border: 0; background: none; padding: 7px 9px; min-height: 38px; min-width: 38px; font: 500 13px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-2); cursor: pointer; }
  .months button + button { border-left: 1px solid #ece3d6; }
  .months button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; }
  .seg { display: flex; border: 1px solid var(--rule); border-radius: 999px; overflow: hidden; }
  .seg button { appearance: none; border: 0; background: #fff; padding: 8px 12px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button + button { border-left: 1px solid var(--rule); }
  .regions { display: none; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; }

  .body { display: grid; gap: 22px; }
  .cols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 32px; align-items: start; }
  .stage { min-width: 0; scroll-margin-top: 84px; }
  .gp-frame { position: relative; }
  .map { display: block; width: 100%; height: auto; aspect-ratio: 920 / 272; background: #cbcfd5; box-shadow: 0 0 0 1px #b8ad99; }
  .lines line { stroke: #8b9ba8; stroke-width: .6; stroke-dasharray: 4 6; opacity: .55; }
  .lines .eq { opacity: .4; }
  .tl { font-family: 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; fill: #7d8a96; letter-spacing: .14em; }
  .ocean { font: italic 400 11px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #8b97a3; letter-spacing: .32em; }
  .compass { font: 400 6px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #2a1d15; }
  .cp { cursor: pointer; transition: fill .3s; }
  .cp:hover { fill: #b9773c; }
  .marker { cursor: pointer; outline: none; }
  .map.near { cursor: pointer; }
  .marker:focus-visible circle:first-of-type, .marker:focus-visible :global(.hring) { filter: drop-shadow(0 0 2px #2a1d15); }
  .olab { font-family: 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #2a1d15; paint-order: stroke; stroke: #f3eee4; stroke-linejoin: round; letter-spacing: .02em; pointer-events: none; }
  .olab.on { font-weight: 400; fill: #6b3a12; }
  .rlab { font-family: 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; font-style: italic; fill: #2a1d15; paint-order: stroke; stroke: #f3eee4; stroke-linejoin: round; }
  .region { pointer-events: none; }
  .mapkey { display: flex; flex-wrap: wrap; gap: 4px 20px; align-items: center; padding: 10px 8px 2px; font-size: 13px; color: var(--ink-2); }
  .mapkey > span { display: inline-flex; align-items: center; gap: 7px; }
  .mapkey .kt { font: 400 15px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; color: #8f5d22; text-transform: uppercase; letter-spacing: .08em; }
  .mapbox { position: relative; }
  .pending { visibility: hidden; }
  .marker:focus-visible circle:first-of-type { stroke: var(--crema-deep); stroke-width: 3px; }
  .nb { white-space: nowrap; }
  .artk { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); }
  .which { position: absolute; z-index: 3; width: 150px; background: #fbf8f3; border: 1px solid #c17a3a; border-radius: 3px; box-shadow: 0 10px 24px -14px rgba(42, 29, 21, .6); padding: 6px; display: grid; gap: 4px; }
  .which p { margin: 0 4px 2px; font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .08em; text-transform: uppercase; color: #8f5d22; }
  .which button { appearance: none; border: 1px solid var(--rule, #d9cbb8); background: #fff; border-radius: 3px; padding: 7px 10px; text-align: left; font: 600 14px/1.2 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink, #2a1d15); cursor: pointer; }
  .which button:focus-visible { outline: 3px solid rgba(143, 93, 34, .6); outline-offset: 1px; }
  .tag { position: absolute; top: 30px; right: 30px; width: 330px; background: #fbf8f3; border: 1px solid #c17a3a; border-radius: 3px; box-shadow: 0 14px 30px -18px rgba(42, 29, 21, .6); padding: 12px 14px 12px; animation: tagin .45s cubic-bezier(.2, .7, .2, 1) both; }
  @keyframes tagin { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: none; } }
  .tag .x { width: 32px; height: 32px; top: 8px; right: 8px; font-size: 17px; }
  .tname { font: 400 30px/1 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 0 0 6px; }
  .tpair { display: flex; gap: 12px; align-items: center; }
  .tag dl { margin: 0; font-size: 13.5px; }
  .tag dt { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); margin-top: 4px; }
  .tag dd { margin: 0; }
  .tag dd.it { font: italic 400 17px/1.15 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; }
  .tmore { display: inline-block; margin-top: 8px; font: 600 14px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--crema-deep); }
  .dot { width: 10px; height: 10px; border-radius: 50%; border: 1px solid #2a1d15; background: #fbf6ee; display: inline-block; }
  .dot.on { background: #9a5420; }
  .dot.edge { background: linear-gradient(90deg, #9a5420 50%, #fbf6ee 50%); }
  .dot.off { width: 8px; height: 8px; }
  .dot.else { background: radial-gradient(circle, #9a5420 0 2px, #fbf6ee 2.5px); }
  .dia { width: 8px; height: 8px; margin: 0 1px; background: #2a1d15; outline: 1px solid #fbf6ee; transform: rotate(45deg); display: inline-block; }
  .ringk { width: 12px; height: 12px; border-radius: 50%; border: 3px solid #b86e2c; border-right-color: #d9cdbd; border-bottom-color: #d9cdbd; display: inline-block; }

  .panel { min-width: 0; position: relative; scroll-margin-top: 84px; }
  .panel h2 { font: 400 36px/1.04 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 4px 0 8px; outline: none; }
  .panel h2 em { font-style: italic; color: var(--ink-3); }
  .lead { color: var(--ink-2); margin: 0 0 10px; }
  .chips { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink); border-radius: 999px; padding: 5px 12px; min-height: 34px; font: 500 14px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; cursor: pointer; text-decoration: none; display: inline-flex; gap: 6px; align-items: center; }
  .chip:hover { border-color: var(--ink-3); background: #fffaf2; }
  .chip .n { font: 500 11.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-3); }
  .arrive { margin: 0 0 14px; font-size: 14.5px; color: var(--ink-2); }
  .arrive summary { cursor: pointer; font-weight: 600; color: var(--ink); }
  .search input { width: 100%; font: 400 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; padding: 8px 12px; border: 1px solid var(--rule); border-radius: 10px; background: #fff; min-height: 42px; color: var(--ink); }
  .olist { max-height: 420px; overflow: auto; margin-top: 8px; padding-right: 4px; }
  .lgroup { font: 600 13px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink-2); margin: 12px 0 4px; }
  .olist ul { list-style: none; margin: 0; padding: 0; }
  .orow { appearance: none; width: 100%; display: grid; grid-template-columns: 34px 1fr auto; gap: 10px; align-items: center; text-align: left; border: 0; border-bottom: 1px solid #ece3d6; background: none; padding: 5px 2px; cursor: pointer; color: var(--ink); }
  .orow:hover { background: #fffaf2; }
  .oname { font: 600 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; }
  .ohar { font: 500 12.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-3); text-align: right; }

  .x { position: absolute; top: 14px; right: 14px; width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; font-size: 19px; cursor: pointer; color: var(--ink-2); }
  .pfacts .pair { display: flex; gap: 18px; align-items: center; justify-content: center; margin: 4px 0 8px; }
  .facts { margin: 0; border-top: 1px solid var(--rule); }
  .rkey { list-style: none; margin: 0 0 10px; padding: 0; display: flex; gap: 4px 12px; flex-wrap: wrap; justify-content: center; font-size: 12.5px; color: var(--ink-2); }
  .rkey li { display: inline-flex; align-items: center; gap: 5px; }
  .k { width: 14px; height: 8px; border-radius: 2px; display: inline-block; }
  .k.main { background: #b86e2c; }
  .k.second { background: #e2a861; }
  .k.edge { background: repeating-linear-gradient(45deg, #f1e2cc 0 2px, #c98a4e 2px 3.4px); }
  .facts div { display: grid; grid-template-columns: 96px 1fr; gap: 10px; padding: 7px 0; border-bottom: 1px solid var(--rule); }
  .facts dt { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); padding-top: 2px; }
  .facts dd { margin: 0; font-size: 14.5px; }
  .facts .sub { display: block; font-size: 13px; color: var(--ink-3); margin-top: 2px; }
  .facts .srcline { font-style: italic; }
  .compact .facts div { grid-template-columns: 1fr; gap: 0; }
  .desc { margin: 12px 0; }
  .notes { font: italic 400 22px/1.2 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 0 0 4px; }
  .journey { margin: 14px 0; }
  .journey ol { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; counter-reset: j; }
  .journey li { position: relative; font-size: 12.5px; color: var(--ink-3); padding-top: 18px; }
  .journey li::before { content: ''; position: absolute; left: 0; right: 0; top: 7px; height: 2px; background: #d9b98f; }
  .journey li::after { content: ''; position: absolute; left: 0; top: 2px; width: 10px; height: 10px; border-radius: 50%; background: #9a5420; border: 2px solid #fbf8f3; }
  .journey b { display: block; color: var(--ink); font-size: 13px; }
  .jnote { margin-top: 10px; }
  .actions { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; margin: 14px 0; }
  .primary { display: inline-block; background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 10px 18px; font: 600 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; text-decoration: none; }
  .linkish { appearance: none; border: 0; background: none; padding: 2px 0; font: inherit; font-size: 15px; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .pickvs select { appearance: none; font: 500 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; padding: 9px 38px 9px 14px; border: 1px solid #c9b493; border-radius: 999px; color: var(--ink); min-height: 44px; cursor: pointer; background: #fbf6ec url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center; }
  .pickvs select:focus-visible { outline: 3px solid rgba(143, 93, 34, .55); outline-offset: 2px; }
  .cmp { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; }
  .cmp h3 { font: 400 24px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; margin: 0; text-align: center; }
  .cmpfoot { text-align: center; margin-top: 12px; border-top: 1px solid var(--rule); padding-top: 10px; }
  .cmpfoot p { margin: 4px 0; }

  @media (max-width: 1060px) { .tag { width: 290px; } }
  @media (max-width: 900px) { .cols { grid-template-columns: 1fr; gap: 10px; } .olist { max-height: none; } }
  @media (max-width: 720px) {
    .map { aspect-ratio: 1.45; }
    .months { width: 100%; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); border-radius: 14px; }
    .months button { padding: 7px 4px; min-width: 0; min-height: 40px; font-size: 13px; }
    .months button:nth-child(7) { border-left: 0; }
    .months button:nth-child(n + 7) { border-top: 1px solid #ece3d6; }
    .monthpick { width: 100%; }
    .regions { width: 100%; display: flex; }
    .regions button { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 6px; line-height: 1.2; }
    .panel h2 { font-size: 32px; }
    .journey ol { grid-template-columns: 1fr; }
    .cmp { gap: 10px; }
    .cmp .pfacts .pair { flex-direction: column; gap: 4px; }
    .cmp :global(svg.hring) { width: 100%; max-width: 132px; height: auto; }
    .cmp :global(svg.ab) { width: auto; height: 132px; max-width: 100%; }
    .cmp h3 { font-size: 21px; }
    .journey li { padding: 0 0 6px 20px; }
    .journey li::before { left: 4px; right: auto; top: 0; bottom: 0; width: 2px; height: auto; }
    .journey li::after { top: 3px; }
  }
  @media (prefers-reduced-motion: reduce) { .cp { transition: none; } }
</style>
