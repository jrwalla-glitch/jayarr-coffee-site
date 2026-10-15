<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import {
    FAMILIES, OFF_GROUPS, ALL_NOTES, MAX_PINS, noteById, familyById, groupById, exercise, evidenceFor,
    compareCard, encodeCard, decodeCard, notesInText, PROCESS_LABEL, ROAST_LABEL, ROASTER_SAMPLE,
  } from '../../lib/coffee/flavors.ts';
  import type { Family, FamilyId, Lot, Note } from '../../lib/coffee/flavors.ts';

  // The bloom: eight families as petals, the off notes as leaves on the stem. Pick a petal and its
  // groups fan out from the tip; pick a note and the panel teaches it: what it's like, how to train
  // your nose on it, what roasters' words show, and what changes it. Pinned notes go on a tasting
  // card you can hold up against the bag. Roasters' words, general tendencies and your own notes
  // are always labelled as three different things.
  interface Props {
    lots: Lot[];
    origins: { id: string; name: string; page?: string }[];
  }
  let { lots, origins }: Props = $props();

  const STORE = 'jayarr-tasting-card-v1';
  const CX = 360, CY = 276, R = 148, CORE = 30, SPRAY = 84;
  const FULL = [0, 0, 720, 590];
  // The painting's reading order, clockwise from the top: the list view follows it.
  const DISPLAY_ORDER: FamilyId[] = ['sweet', 'floral', 'fruity', 'sour-fermented', 'green', 'roasted', 'spices', 'nutty-cocoa'];
  // Clockwise from lower left, leaving a gap at the bottom for the stem.
  const ANGLE: Record<FamilyId, number> = { roasted: -140, spices: -100, 'nutty-cocoa': -60, sweet: -20, floral: 20, fruity: 60, 'sour-fermented': 100, green: 140 };
  const SHORT: Record<FamilyId, string> = { roasted: 'Roasted', spices: 'Spices', 'nutty-cocoa': 'Nutty & cocoa', sweet: 'Sweet', floral: 'Floral', fruity: 'Fruity', 'sour-fermented': 'Sour', green: 'Green' };
  const STARTERS = ['blueberry', 'jasmine', 'caramel', 'chocolate', 'lemon', 'black-tea'];
  const OFF_COLOUR = '#8a8378';

  let familyId = $state<FamilyId | 'off' | null>(null);
  let groupId = $state<string | null>(null);
  let stageW = $state(640);
  let reduced = $state(false);
  const vb = new Tween(FULL, { duration: 700, easing: cubicOut });
  let noteId = $state<string | null>(null);
  let pins = $state<string[]>([]);
  let bag = $state('');
  let saved = $state<{ pins: string[]; bag: string; made: string }[]>([]);
  let view = $state<'bloom' | 'list'>('bloom');
  let mounted = $state(false);
  let linkNote = $state<string | null>(null);
  let copied = $state(false);
  let full = $state(false);
  let panelEl = $state<HTMLElement | null>(null);
  let headEl = $state<HTMLElement | null>(null);

  let fam = $derived(familyId && familyId !== 'off' ? familyById(familyId) ?? null : null);

  // How many of the sample's lots name each note: buds on the plate grow with it.
  const COUNTS: Record<string, number> = (() => {
    const c: Record<string, number> = {};
    for (const l of lots) for (const id of new Set(l.notes.flatMap((t) => notesInText(t)))) c[id] = (c[id] ?? 0) + 1;
    return c;
  })();
  const MAXC = Math.max(1, ...Object.values(COUNTS));
  const budR = (id: string) => 4.5 + 8.5 * Math.sqrt((COUNTS[id] ?? 0) / MAXC);
  let note = $derived(noteId ? noteById(noteId) ?? null : null);
  let groups = $derived(familyId === 'off' ? OFF_GROUPS : fam ? fam.groups : []);
  let ev = $derived(note && note.family !== 'off' ? evidenceFor(note.id, lots) : null);
  let cmp = $derived(compareCard(pins, bag));
  // How each phrase on the bag was read, so "milk chocolate → Chocolate" is visible, not silent.
  let bagMapping = $derived(bag.split(/[,;\/]| and /).map((t) => t.trim()).filter(Boolean).map((t) => { const ids = notesInText(t); return ids.length ? `${t} → ${ids.map((id) => noteById(id)?.label).join(', ')}` : `${t} → no match`; }));
  let thinOrigins = $derived(note && ev?.thin ? [...new Set(lots.filter((l) => l.notes.some((t) => notesInText(t).includes(note.id))).map((l) => originName(l.o)))] : []);
  let originName = (id: string) => origins.find((o) => o.id === id)?.name ?? id;
  let originPage = (id: string) => origins.find((o) => o.id === id)?.page;
  const colourOf = (id: FamilyId | 'off') => (id === 'off' ? OFF_COLOUR : familyById(id)!.colour);
  // Watercolour: each petal fades from its pigment to a paler wash at the edge.
  function wash(hex: string, t: number) {
    const n = parseInt(hex.slice(1), 16), mix = (c: number) => Math.round(c + (255 - c) * t);
    return `rgb(${mix(n >> 16)}, ${mix((n >> 8) & 255)}, ${mix(n & 255)})`;
  }
  const pct = (x: number) => `${Math.round(x * 100)}%`;
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const at = (deg: number, r: number) => [CX + Math.sin(rad(deg)) * r, CY - Math.cos(rad(deg)) * r];

  // A teardrop petal pointing up from the core, in local coordinates.
  function petal(len: number, w: number, from = CORE - 4) {
    return `M0 ${-from} C ${w} ${-from - len * 0.28}, ${w * 1.08} ${-len * 0.78}, 0 ${-len} C ${-w * 1.08} ${-len * 0.78}, ${-w} ${-from - len * 0.28}, 0 ${-from} Z`;
  }
  // The open family's groups spray out from its tip, like a flower spike.
  const GROUP_SHORT: Record<string, string> = { fermented: 'Fermented', 'green-veg': 'Green', 'brown-spice': 'Brown spice', 'citrus': 'Citrus' };
  function fan(f: Family) {
    const n = f.groups.length, step = n > 3 ? 31 : n === 3 ? 36 : 42;
    const [tx, ty] = at(ANGLE[f.id], R - 6);
    return f.groups.map((g, i) => {
      const angle = ANGLE[f.id] + (i - (n - 1) / 2) * step;
      const lx = tx + Math.sin(rad(angle)) * (SPRAY + 18), ly = ty - Math.cos(rad(angle)) * (SPRAY + 18);
      return { g, angle, tx, ty, lx, ly, label: GROUP_SHORT[g.id] ?? g.label };
    });
  }
  function labelAnchor(deg: number) { const s = Math.sin(rad(deg)); return s > 0.3 ? 'start' : s < -0.3 ? 'end' : 'middle'; }

  // A family zooms the plate into its branch; the picture stays in play, so on a phone the page
  // doesn't jump. Picking a note (a bud, or a chip in the panel) brings the note card into view.
  function openFamily(id: FamilyId | 'off') {
    if (familyId === id && !noteId) { closeFamily(); return; }
    familyId = id;
    noteId = null;
    const groups = id === 'off' ? OFF_GROUPS : familyById(id)!.groups;
    // Start on the group roasters write about most, so the first buds have something to show.
    groupId = [...groups].sort((a, b) => sumCounts(b) - sumCounts(a))[0]?.id ?? null;
  }
  const sumCounts = (g: { notes: Note[] }) => g.notes.reduce((t, n) => t + (COUNTS[n.id] ?? 0), 0);
  function closeFamily() { familyId = null; noteId = null; groupId = null; }
  async function openNote(id: string, reveal = true) {
    const n = noteById(id);
    if (!n) return;
    familyId = n.family as FamilyId | 'off';
    groupId = n.group;
    noteId = id;
    if (reveal) await revealPanel();
  }
  async function revealPanel() {
    if (!matchMedia('(max-width: 900px)').matches) return;
    await tick();
    panelEl?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    headEl?.focus({ preventScroll: true });
  }
  function togglePin(id: string) {
    if (pins.includes(id)) pins = pins.filter((p) => p !== id);
    else if (pins.length < MAX_PINS) pins = [...pins, id];
    else { full = true; return; }
    full = false;
  }
  function keyAct(e: KeyboardEvent, fn: () => void) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }

  function persist() {
    try { localStorage.setItem(STORE, JSON.stringify({ current: { pins, bag }, saved })); } catch { /* storage unavailable */ }
  }
  function saveCard() {
    if (!pins.length) return;
    const made = new Date().toISOString().slice(0, 10);
    saved = [{ pins: [...pins], bag: bag.trim(), made }, ...saved.filter((c) => c.pins.join() !== pins.join() || c.bag !== bag.trim())].slice(0, 12);
    persist();
  }
  function loadCard(c: { pins: string[]; bag: string }) { pins = c.pins.filter((p) => !!noteById(p)).slice(0, MAX_PINS); bag = c.bag; }
  function removeSaved(i: number) { saved = saved.filter((_, k) => k !== i); persist(); }
  function newCard() { pins = []; bag = ''; full = false; }
  async function share() {
    const url = `${location.origin}${location.pathname}?${encodeCard({ pins, bag })}`;
    try { await navigator.clipboard.writeText(url); copied = true; setTimeout(() => (copied = false), 2200); }
    catch { prompt('Copy this link:', url); }
  }

  onMount(() => {
    reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const q = new URLSearchParams(location.search);
    let fromLink = false;
    if (q.get('pins') || q.get('bag')) {
      const d = decodeCard(location.search);
      pins = d.pins; bag = d.bag; fromLink = true;
      if (d.dropped) linkNote = `${d.dropped === 1 ? 'One note' : `${d.dropped} notes`} in that link didn't match our list, so ${d.dropped === 1 ? 'it was' : 'they were'} left out.`;
    }
    try {
      const s = JSON.parse(localStorage.getItem(STORE) ?? 'null');
      if (s && Array.isArray(s.saved)) saved = s.saved.filter((c: { pins?: unknown }) => Array.isArray(c?.pins)).slice(0, 12);
      // Someone else's link never replaces your own card until you change it.
      if (!fromLink && s?.current && Array.isArray(s.current.pins)) { pins = s.current.pins.filter((p: string) => !!noteById(p)).slice(0, MAX_PINS); bag = typeof s.current.bag === 'string' ? s.current.bag : ''; }
    } catch { /* storage unavailable */ }
    const n = q.get('note');
    if (n && noteById(n)) { noteId = n; familyId = noteById(n)!.family as FamilyId | 'off'; groupId = noteById(n)!.group; }
    else { const f = q.get('family'); if (f && (familyById(f) || f === 'off')) openFamily(f as FamilyId | 'off'); }
    vb.set(zoomTarget(), { duration: 0 });
    mounted = true;
  });
  let firstSave = true;
  $effect(() => {
    void [pins, bag];
    if (!mounted) return;
    if (firstSave) { firstSave = false; return; }
    persist();
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    if (noteId) q.set('note', noteId);
    else if (familyId) q.set('family', familyId);
    history.replaceState(history.state, '', q.toString() ? `${location.pathname}?${q}` : location.pathname);
  });

  // ── The zoomed branch: group petals spray from the family's tip, the active group's notes grow
  // as buds around its tip, and every label is placed so none overlap (in screen pixels).
  const groupTip = (f: FamilyId, angle: number) => { const [tx, ty] = at(ANGLE[f], R - 6); return [tx + Math.sin(rad(angle)) * SPRAY, ty - Math.cos(rad(angle)) * SPRAY]; };
  function zoomTarget(): number[] {
    // Phones zoom closer: labels keep their size in pixels, so the branch needs more room on screen.
    const W = stageW < 520 ? 370 : 440, H = W / (FULL[2] / FULL[3]);
    if (fam) {
      const sp = fan(fam), act = sp.find((x) => x.g.id === groupId) ?? sp[0];
      const [gx, gy] = groupTip(fam.id, act.angle);
      const [tx, ty] = at(ANGLE[fam.id], R);
      // On a phone the frame centres on the buds themselves; on desktop it keeps the family petal in view too.
      const w = stageW < 520 ? 0.9 : 0.6;
      const ox = Math.sin(rad(act.angle)) * (stageW < 520 ? 22 : 0), oy = -Math.cos(rad(act.angle)) * (stageW < 520 ? 22 : 0);
      const cx = gx * w + tx * (1 - w) + ox, cy = gy * w + ty * (1 - w) + oy;
      return [cx - W / 2, cy - H / 2, W, H];
    }
    if (familyId === 'off') return [CX - 220, CY + 70, W, H];
    return FULL;
  }
  $effect(() => { void [familyId, groupId, stageW < 520]; if (mounted) vb.set(zoomTarget(), { duration: reduced ? 0 : 700 }); });
  let upp = $derived(vb.current[2] / Math.max(240, stageW));
  interface Box { x: number; y: number; w: number; h: number }
  const hit = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
  interface Bud { id: string; label: string; x: number; y: number; r: number; lx: number; ly: number; anchor: string }
  interface GLabel { id: string; label: string; x: number; y: number; anchor: string }
  let branch = $derived.by(() => {
    if (!fam || !groupId) return { buds: [] as Bud[], glabels: [] as GLabel[], hidden: 0 };
    const u = upp, fs = 14 * u;
    const sp = fan(fam);
    const boxes: Box[] = [];
    // The petals' own space is taken: buds and labels go around them.
    const [tx0, ty0] = at(ANGLE[fam.id], R - 6);
    for (const x of sp) for (const f of [0.25, 0.5, 0.75, 1]) {
      const px = tx0 + Math.sin(rad(x.angle)) * SPRAY * f, py = ty0 - Math.cos(rad(x.angle)) * SPRAY * f, half = f === 1 ? 6 : 12;
      boxes.push({ x: px - half, y: py - half, w: half * 2, h: half * 2 });
    }
    for (const f of [0.45, 0.65, 0.85]) { const [px, py] = at(ANGLE[fam.id], R * f); boxes.push({ x: px - 26, y: py - 26, w: 52, h: 52 }); }
    const act = sp.find((x) => x.g.id === groupId) ?? sp[0];
    const [gx, gy] = groupTip(fam.id, act.angle);
    // Long groups show their eight most-used notes on the plate; the panel lists every note.
    const keep = new Set([...act.g.notes].sort((p, q) => (COUNTS[q.id] ?? 0) - (COUNTS[p.id] ?? 0)).slice(0, 8).map((x) => x.id));
    const notes = act.g.notes.filter((x) => keep.has(x.id)), n = notes.length;
    const span = Math.min(200, 26 * Math.max(1, n - 1)), rho = (n > 6 ? 50 : 38) * Math.max(0.8, u / 0.7);
    const buds: Bud[] = notes.map((nt, k) => {
      const a = n === 1 ? act.angle : act.angle - span / 2 + (k * span) / (n - 1);
      const r = budR(nt.id);
      const x = gx + Math.sin(rad(a)) * rho, y = gy - Math.cos(rad(a)) * rho;
      boxes.push({ x: x - r, y: y - r, w: r * 2, h: r * 2 });
      return { id: nt.id, label: nt.label, x, y, r, lx: 0, ly: 0, anchor: 'start', a } as Bud & { a: number };
    });
    const [vx, vy, vw, vh] = zoomTarget();
    const inside = (b: Box) => b.x > vx + 6 * u && b.y > vy + 30 * u && b.x + b.w < vx + vw - 6 * u && b.y + b.h < vy + vh - 6 * u;
    // Try spots around the point, near first, radially outward first; keep the first that is free
    // and inside the frame, else the one that overlaps least.
    const place = (x: number, y: number, r: number, text: string, prefer: number): { lx: number; ly: number; anchor: string } => {
      const w = text.length * fs * 0.5, h = fs * 1.15;
      const dirs = [prefer, prefer + 35, prefer - 35, 90, -90, 0, 180, 45, -45, 135, -135];
      const spots: { lx: number; ly: number; anchor: string }[] = [];
      for (const k of [1, 1.45]) for (const d of dirs) {
        const sn = Math.sin(rad(d)), cs = Math.cos(rad(d)), g = (r + 5 * u) * k;
        spots.push({ lx: sn * g, ly: -cs * g + fs * 0.35, anchor: sn > 0.3 ? 'start' : sn < -0.3 ? 'end' : 'middle' });
      }
      const boxOf = (sp: { lx: number; ly: number; anchor: string }) => ({ x: x + sp.lx - (sp.anchor === 'end' ? w : sp.anchor === 'middle' ? w / 2 : 0), y: y + sp.ly - fs * 0.85, w, h });
      const overlap = (bx: Box) => boxes.reduce((t, b) => t + (hit(b, bx) ? Math.min(b.x + b.w, bx.x + bx.w) - Math.max(b.x, bx.x) : 0), 0) + (inside(bx) ? 0 : 1e4);
      let pick = spots.find((spot) => { const bx = boxOf(spot); return inside(bx) && !boxes.some((b) => hit(b, bx)); });
      if (!pick) pick = [...spots].sort((a, b2) => overlap(boxOf(a)) - overlap(boxOf(b2)))[0];
      boxes.push(boxOf(pick));
      return pick;
    };
    for (const b of buds as (Bud & { a: number })[]) Object.assign(b, place(b.x, b.y, b.r, b.label, b.a));
    const glabels: GLabel[] = sp.map((x) => {
      const [mx, my] = at(ANGLE[fam.id], R - 6);
      const px = mx + Math.sin(rad(x.angle)) * SPRAY * 0.62, py = my - Math.cos(rad(x.angle)) * SPRAY * 0.62;
      const side = x.angle - ANGLE[fam.id] >= 0 ? 90 : -90;
      const pl = place(px, py, 16 * u, x.label, x.angle + side);
      return { id: x.g.id, label: x.label, x: px + pl.lx, y: py + pl.ly, anchor: pl.anchor };
    });
    return { buds, glabels, hidden: act.g.notes.length - notes.length };
  });

  const ROAST_LINE: Record<string, string> = {
    fruity: 'Lighter roasts keep more of it; darker roasts turn fruit into roast and cocoa notes.',
    floral: 'Lighter roasts keep it; floral aromas are among the first to go as a roast darkens.',
    'sour-fermented': 'Lighter roasts keep more acidity; it softens as a roast darkens.',
    green: 'Green and raw notes fall as a roast develops; strong ones can mean it was underdeveloped.',
    roasted: 'It grows with roast degree: a darker roast brings more.',
    spices: 'Often more noticeable in medium to darker roasts.',
    'nutty-cocoa': 'Medium roasts show it most; very dark roasts push it toward bitter and burnt.',
    sweet: 'Light to medium roasts carry the most caramel-like sweetness; very dark roasts lose it to bitterness.',
    off: 'A flaw from the farm, the processing, storage or age won\'t roast away; a roast can only mask it.',
  };
</script>

{#snippet bloomSvg(mini: boolean)}
  {@const lit = mini ? new Set(pins.map((p) => noteById(p)?.family)) : null}
  <svg viewBox={mini ? '130 40 460 520' : vb.current.join(' ')} class:mini role={mini ? 'img' : 'group'}
    aria-label={mini ? (pins.length ? `Your card: ${pins.map((p) => noteById(p)?.label).join(', ')}` : 'An empty tasting card') : fam ? `${fam.label}: choose a group, then a note` : 'Flavor families as petals. Choose one to open it.'}>
    <defs>
      {#each [...FAMILIES.map((f) => [f.id, f.colour]), ['off', OFF_COLOUR]] as [id, c] (id)}
        <radialGradient id="fb-wc-{mini ? 'm' : 'b'}-{id}" cx=".5" cy=".62" r=".62">
          <stop offset="0" stop-color={c} stop-opacity="1" /><stop offset=".55" stop-color={c} stop-opacity=".9" /><stop offset=".85" stop-color={wash(c, 0.35)} stop-opacity=".7" /><stop offset="1" stop-color={wash(c, 0.55)} stop-opacity=".45" />
        </radialGradient>
      {/each}
      <filter id="fb-soft-{mini ? 'm' : 'b'}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={mini ? 1.6 : 1.1} /></filter>
    </defs>
    {#if !mini}
      <!-- Botanical-plate corner flourishes -->
      <g fill="none" stroke="#8a9a7c" stroke-width="1.1" opacity=".55">
        {#each [[16, 16, 1, 1], [704, 16, -1, 1], [16, 574, 1, -1], [704, 574, -1, -1]] as [x, y, dx, dy] (x + '' + y)}
          <path d="M{x} {y + dy * 60} Q {x} {y} {x + dx * 60} {y}" /><path d="M{x + dx * 8} {y + dy * 44} Q {x + dx * 8} {y + dy * 8} {x + dx * 44} {y + dy * 8}" opacity=".6" />
          <circle cx={x + dx * 14} cy={y + dy * 14} r="2.4" fill="#8a9a7c" stroke="none" />
        {/each}
      </g>
    {/if}
    <!-- Stem and the off-note leaves -->
    <path d="M{CX} {CY + CORE} C {CX - 6} {CY + 120}, {CX + 8} {CY + 200}, {CX - 2} {CY + 300}" fill="none" stroke="#6f7a52" stroke-width={mini ? 4 : 3} stroke-linecap="round" opacity=".85" />
    {#each [{ d: -1, y: CY + 175, g: 0 }, { d: 1, y: CY + 215, g: 1 }] as leaf (leaf.g)}
      {@const sel = !mini && familyId === 'off'}
      <g class="leaf" class:sel class:dim={!mini && !!familyId && familyId !== 'off'}
        transform="translate({CX + leaf.d * 2} {leaf.y}) rotate({leaf.d * 62})"
        role={mini ? undefined : 'button'} tabindex={mini ? undefined : 0} aria-pressed={mini ? undefined : sel}
        aria-label={mini ? undefined : `Off notes: ${OFF_GROUPS[leaf.g].label.toLowerCase()}`}
        onclick={mini ? undefined : () => openFamily('off')} onkeydown={mini ? undefined : (e) => keyAct(e, () => openFamily('off'))}>
        <path d={petal(78, 22, 0)} fill={mini && !lit?.has('off') ? '#e9ece2' : 'url(#fb-wc-' + (mini ? 'm' : 'b') + '-off)'} filter="url(#fb-soft-{mini ? 'm' : 'b'})" fill-opacity={mini ? 1 : sel ? 1 : 0.7} />
        <path d={petal(78, 22, 0)} fill="none" stroke="#2a1d15" stroke-opacity={mini ? 0.35 : sel ? 0.55 : 0.18} stroke-width={mini ? 2 : 1} />
        <path d="M0 -4 L0 -70" stroke="#2a1d15" stroke-width=".8" opacity=".3" />
      </g>
    {/each}
    {#if !mini}
      <text x={CX + 80} y={CY + 232} class="leaflab" class:on={familyId === 'off'}>Off notes</text>
      {#if !familyId}<text x={CX} y="34" text-anchor="middle" class="cue">Tap a petal to open a family</text>{/if}
    {/if}

    <!-- Petals -->
    {#each FAMILIES as f (f.id)}
      {@const sel = !mini && familyId === f.id}
      {@const dim = !mini && !!familyId && !sel}
      <g class="petal" class:sel class:dim transform="translate({CX} {CY}) rotate({ANGLE[f.id]})"
        role={mini ? undefined : 'button'} tabindex={mini ? undefined : 0} aria-pressed={mini ? undefined : sel}
        aria-label={mini ? undefined : `${f.label}: ${f.groups.map((g) => g.label.toLowerCase()).join(', ')}`}
        onclick={mini ? undefined : () => openFamily(f.id)} onkeydown={mini ? undefined : (e) => keyAct(e, () => openFamily(f.id))}>
        <path class="shape" d={petal(R, 46)} fill={mini && !lit?.has(f.id) ? '#e9ece2' : `url(#fb-wc-${mini ? 'm' : 'b'}-${f.id})`} filter="url(#fb-soft-{mini ? 'm' : 'b'})"
          fill-opacity={mini ? 1 : sel ? 1 : dim ? 0.38 : 0.86} />
        <path d={petal(R, 46)} fill="none" stroke="#2a1d15" stroke-opacity={mini ? 0.35 : sel ? 0.55 : 0.16} stroke-width={mini ? 2 : 1} />
        {#if !mini}
          <path d="M0 {-CORE} L0 {-R + 14}" stroke="#2a1d15" stroke-width=".8" opacity=".28" />
          <path d="M0 {-R * 0.42} Q 12 {-R * 0.55} 18 {-R * 0.7} M0 {-R * 0.42} Q -12 {-R * 0.55} -18 {-R * 0.7}" fill="none" stroke="#2a1d15" stroke-width=".8" opacity=".2" />
        {/if}
      </g>
    {/each}

    <!-- The open family's groups fan out from its tip -->
    {#if !mini && fam}
      {#each fan(fam) as x (x.g.id)}
        {@const on = groupId === x.g.id}
        <g class="sub" class:on transform="translate({x.tx} {x.ty}) rotate({x.angle})" role="button" tabindex="0" aria-pressed={on}
          aria-label="{x.g.label}: {x.g.notes.map((n) => n.label).join(', ')}" onclick={() => (groupId = x.g.id)} onkeydown={(e) => keyAct(e, () => (groupId = x.g.id))}>
          <path d={petal(SPRAY, 17, 0)} fill="url(#fb-wc-b-{fam.id})" filter="url(#fb-soft-b)" fill-opacity={on ? 1 : 0.62} />
          <path d={petal(SPRAY, 17, 0)} fill="none" stroke="#2a1d15" stroke-opacity={on ? 0.6 : 0.25} stroke-width={on ? 1.4 : 1} />
          <path d="M0 -4 L0 {-SPRAY + 10}" stroke="#2a1d15" stroke-width=".7" opacity=".3" />
        </g>
      {/each}
      {#each branch.glabels as gl (gl.id)}
        <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (the group petal is the keyboard target) -->
        <text x={gl.x} y={gl.y} text-anchor={gl.anchor} class="glab" class:on={groupId === gl.id} style="font-size: {15 * upp}px; stroke-width: {4 * upp}px" onclick={() => (groupId = gl.id)}>{gl.label}</text>
      {/each}
      <!-- The active group's notes, as buds: bigger buds are words roasters use more often -->
      {#each branch.buds as b (b.id)}
        {@const sel = noteId === b.id}
        {@const pinned = pins.includes(b.id)}
        <g class="bud" class:sel role="button" tabindex="0" aria-pressed={sel}
          aria-label="{b.label}{COUNTS[b.id] ? `, named in ${COUNTS[b.id]} of ${lots.length} roaster descriptions` : ''}{pinned ? ', on your card' : ''}"
          onclick={() => openNote(b.id)} onkeydown={(e) => keyAct(e, () => openNote(b.id))}>
          <circle cx={b.x} cy={b.y} r={Math.max(b.r, 14 * upp)} fill="transparent" />
          <circle cx={b.x} cy={b.y} r={b.r} fill={fam.colour} fill-opacity={COUNTS[b.id] ? (sel ? 1 : 0.82) : 0.18} stroke="#2a1d15" stroke-opacity={sel ? 0.9 : 0.45} stroke-width={(sel ? 2 : 1) * upp} />
          {#if sel}<circle cx={b.x} cy={b.y} r={b.r + 5 * upp} fill="none" stroke="#8f5d22" stroke-width={2 * upp} />{/if}
          {#if pinned}<circle cx={b.x} cy={b.y} r={2.6 * upp} fill="#fffaf2" />{/if}
          <text x={b.x + b.lx} y={b.y + b.ly} text-anchor={b.anchor} class="blab" class:on={sel} style="font-size: {14 * upp}px; stroke-width: {4 * upp}px">{b.label}</text>
        </g>
      {/each}
    {/if}

    <!-- Family labels -->
    {#if !mini && !familyId}
      {#each FAMILIES as f (f.id)}
        {#if familyId !== f.id}
          {@const [lx, ly] = at(ANGLE[f.id], R + 22)}
          <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (the petal itself is the keyboard target) -->
          <text x={lx} y={ly + (Math.cos(rad(ANGLE[f.id])) > 0.5 ? 0 : 7)} text-anchor={labelAnchor(ANGLE[f.id])} class="flab" onclick={() => openFamily(f.id)}>{SHORT[f.id]}</text>
        {/if}
      {/each}
    {/if}

    <circle cx={CX} cy={CY} r={CORE} fill="#f6f1e8" stroke="#c17a3a" stroke-width={mini ? 3.4 : 2} />
    <g transform="translate({CX} {CY}) rotate(-28)">
      <ellipse rx="10.5" ry="14.5" fill="#7a4e30" />
      <path d="M0 -12 C 4.5 -5, -4.5 5, 0 12" fill="none" stroke="#f6f1e8" stroke-width="2" stroke-linecap="round" />
    </g>

    <!-- Your pinned notes sit on their petals as seeds -->
    {#if !mini}
      {#each pins as p, i (p)}
        {@const pn = noteById(p)}
        {#if pn && pn.family !== 'off'}
          {@const [px, py] = at(ANGLE[pn.family] + (i - 1) * 7, R - 30)}
          <circle cx={px} cy={py} r="7" fill="#fffaf2" stroke="#2a1d15" stroke-width="1.5" />
          <circle cx={px} cy={py} r="3.2" fill="#9a6526" />
        {/if}
      {/each}
    {/if}
  </svg>
{/snippet}

{#snippet bars(title: string, rows: { key: string; hits: number; of: number; rate: number }[], label: (k: string) => string, overall: number, top: number)}
  <div class="bars">
    <p class="lbl">{title}</p>
    {#each rows as r (r.key)}
      <div class="bar">
        <span class="bk">{label(r.key)}</span>
        <span class="track" aria-hidden="true">
          <span class="fill" style:width="{(r.rate / top) * 100}%"></span>
          <span class="base" style:left="{(overall / top) * 100}%"></span>
        </span>
        <span class="bn"><b>{r.hits}</b> of {r.of} · {pct(r.rate)}</span>
      </div>
    {/each}
  </div>
{/snippet}

<div class="fb">
  {#if linkNote}<p class="notice" role="status">{linkNote}</p>{/if}
  <div class="body">
    <div class="stage">
      <div class="stagebar">
        <div class="seg" role="group" aria-label="View">
          <button type="button" aria-pressed={view === 'bloom'} onclick={() => (view = 'bloom')}>Painting</button>
          <button type="button" aria-pressed={view === 'list'} onclick={() => (view = 'list')}>List</button>
        </div>
      </div>
      {#if view === 'bloom'}
        <div class="gp-frame painting" style="--mat: #efe8da; --matpad: 16px; --matpad-phone: 8px">
          <div class="bloom" bind:clientWidth={stageW}>
            {@render bloomSvg(false)}
            {#if familyId}<button type="button" class="allfam" onclick={closeFamily}>← All families</button>{/if}
          </div>
        </div>
        <p class="gp-plaque"><b>The Flavor Bloom</b><small>A botanical tasting guide</small></p>
        <p class="cap">{#if fam}Tap a group, then a note. Bigger buds are words roasters use more often in their lot descriptions.{#if branch.hidden}{' '}{branch.hidden} rarer {branch.hidden === 1 ? 'note is' : 'notes are'} in the list beside the plate.{/if}{:else}Eight families from the SCA and WCR Coffee Taster's Flavor Wheel; the leaves on the stem are off notes, tastes that usually mean a flaw.{/if}</p>
      {:else}
        <div class="gp-frame" style="--mat: #efe8da; --matpad: 16px; --matpad-phone: 8px">
        <div class="list">
          {#each [...DISPLAY_ORDER.map((id) => familyById(id)!).map((f) => ({ id: f.id as FamilyId | 'off', label: f.label, colour: f.colour, groups: f.groups })), { id: 'off' as const, label: 'Off notes', colour: OFF_COLOUR, groups: OFF_GROUPS }] as f (f.id)}
            <section class="lfam">
              <h3><span class="sw" style:background={f.colour}></span>{f.label}</h3>
              {#each f.groups as g (g.id)}
                {#if !(g.notes.length === 1 && g.notes[0].label === g.label)}<p class="lgroup">{g.label}</p>{/if}
                <ul class="chips">
                  {#each g.notes as n (n.id)}
                    <li><button type="button" class="chip" class:on={noteId === n.id} aria-pressed={noteId === n.id} onclick={() => openNote(n.id)}>{n.label}{#if pins.includes(n.id)}<span class="pinmark" aria-label=", on your card">●</span>{/if}</button></li>
                  {/each}
                </ul>
              {/each}
            </section>
          {/each}
        </div>
        </div>
        <p class="gp-plaque"><b>The Flavor Bloom</b><small>Every note, as a list</small></p>
      {/if}
    </div>

    <div class="panel gp-label" bind:this={panelEl}>
      {#if !familyId}
        <div class="intro">
          <h2 tabindex="-1" bind:this={headEl}>What can a coffee taste like?</h2>
          <p>Tap a petal to open a flavor family; its notes grow on the plate. For each note you get what it's like, a kitchen exercise to train your nose on it, and what roasters' own descriptions show about where it turns up.</p>
          <p class="lbl">Or start with a note</p>
          <ul class="chips">
            {#each STARTERS as id (id)}
              {@const n = noteById(id)!}
              <li><button type="button" class="chip big" onclick={() => openNote(id)}><span class="sw" style:background={colourOf(n.family as FamilyId)}></span>{n.label}</button></li>
            {/each}
          </ul>
          <div class="kinds">
            <p><b>Roasters say</b> Words counted from {lots.length} lot descriptions in {ROASTER_SAMPLE.label}.</p>
            <p><b>In general</b> Broad tendencies, with their sources.</p>
            <p><b>You noticed</b> Your own tasting card, kept on this device.</p>
          </div>
        </div>
      {:else if !note}
        {@const label = fam ? fam.label : 'Off notes'}
        <div class="famhead">
          <span class="sw big" style:background={colourOf(familyId)}></span>
          <div>
            <p class="kick">Flavor family</p>
            <h2 tabindex="-1" bind:this={headEl}>{label}</h2>
          </div>
        </div>
        <p class="blurb">{fam ? fam.blurb : 'The wheel\'s "other" notes: papery, musty and chemical tastes. If you can pick one out, something went wrong on the farm, in processing, in storage or with age.'}</p>
        {#if fam?.brings}
          <div class="tends"><p class="lbl">In general</p><p>{fam.brings}</p></div>
        {/if}
        {#each groups as g (g.id)}
          <button type="button" class="lgroup gbtn" class:on={groupId === g.id} aria-pressed={groupId === g.id} onclick={() => (groupId = g.id)}>{g.label}</button>
          <ul class="chips">
            {#each g.notes as n (n.id)}
              <li><button type="button" class="chip" onclick={() => openNote(n.id, true)}>{n.label}{#if pins.includes(n.id)}<span class="pinmark" aria-label=", on your card">●</span>{/if}</button></li>
            {/each}
          </ul>
        {/each}
        <button type="button" class="linkish back" onclick={closeFamily}>← All families</button>
      {:else}
        {@const g = groupById(note.group)}
        <div class="notecard">
          <p class="kick"><span class="sw" style:background={colourOf(note.family as FamilyId)}></span>{fam ? fam.label : 'Off notes'} · {g?.label}</p>
          <h2 tabindex="-1" bind:this={headEl}>{note.label}</h2>
          <p class="gist">{note.gist}{#if note.flaw}{' '}<span class="flawtag">Usually a flaw</span>{/if}</p>
          {#if !note.wheel}<p class="quiet small">Not on the wheel itself: a word roasters use often, placed under {g?.label.toLowerCase()}.</p>{/if}

          <div class="tryit">
            <p class="lbl">Try it</p>
            <p>{exercise(note)}</p>
          </div>

          <div class="evidence">
            <p class="lbl">Roasters say <span class="quiet">· {ROASTER_SAMPLE.label}</span></p>
            {#if note.family === 'off'}
              <p>Roasters don't print off notes on their bags, so their words can't show where this turns up.</p>
            {:else if ev && ev.lots === 0}
              <p>None of the {ev.total} lot descriptions we recorded names {note.label.toLowerCase()}. That says more about how roasters write than about coffee: it's a word you'll meet more in cupping notes than on bags.</p>
            {:else if ev}
              <p class="evhead"><b>{note.label}</b> is named in <b>{ev.lots}</b> of {ev.total} lots ({pct(ev.overall)}).</p>
              {#if ev.thin}
                <p>Too few to compare processes or origins honestly. {ev.lots === 1 ? 'The lot is' : 'They are'} from {thinOrigins.join(', ')}.</p>
              {:else}
                {@const top = Math.max(ev.overall, ...ev.process.map((r) => r.rate), ...ev.roast.map((r) => r.rate), 0.05)}
                {@render bars('By process', ev.process, (k) => PROCESS_LABEL[k] ?? k, ev.overall, top)}
                {@render bars('By roast', ['light', 'medium', 'dark'].map((k) => ev!.roast.find((r) => r.key === k)).filter((r) => !!r) as typeof ev.roast, (k) => ROAST_LABEL[k] ?? k, ev.overall, top)}
                {#if ev.origins.filter((o) => o.hits >= 2).length}
                  <p class="lbl orig">Origins where it's named most often</p>
                  <ul class="origins">
                    {#each ev.origins.filter((o) => o.hits >= 2).slice(0, 4) as o (o.key)}
                      {@const page = originPage(o.key)}
                      <li>{#if page}<a href={page}>{originName(o.key)}</a>{:else}{originName(o.key)}{/if} <span class="mono">{o.hits} of {o.of} lots</span></li>
                    {/each}
                  </ul>
                {/if}
                <p class="quiet small">All bars share one scale; the dark line marks {pct(ev.overall)}, the share across all lots. These are roasters' words about their own lots, not a measurement, and small groups swing with a single lot.</p>
              {/if}
            {/if}
          </div>

          {#if fam?.brings}<div class="tends"><p class="lbl">In general</p><p>{fam.brings}</p></div>{/if}
          <div class="changes">
            <p class="lbl">What changes it</p>
            <ul>
              <li><b>Roast.</b> {ROAST_LINE[note.family]}</li>
              <li><b>Temperature.</b> Taste again as it cools. Cuppers taste each cup several times from about 70 °C down (the SCA's protocol), because what you notice shifts.</li>
              <li><b>Brewing.</b> An under-extracted cup leans sour and thin, an over-extracted one bitter and dry, and either can hide a note. <a href="/tools/fix-my-coffee/">Fix My Coffee</a> finds the one change to try.</li>
              <li><b>Filter.</b> Paper gives a clearer cup where delicate notes show; metal lets oils through for more body. <a href="/explore/methods/">Compare brewers</a>.</li>
            </ul>
          </div>

          <div class="actions">
            <button type="button" class="primary" aria-pressed={pins.includes(note.id)} onclick={() => togglePin(note.id)}>
              {pins.includes(note.id) ? 'On your card ✓' : 'I taste this: add to my card'}
            </button>
            <button type="button" class="linkish" onclick={() => (noteId = null)}>← {fam ? fam.label : 'Off notes'}</button>
          </div>
          {#if full}<p class="small warn" role="status">Your card holds three notes. Remove one to add {note.label.toLowerCase()}.</p>{/if}
        </div>
      {/if}
    </div>
  </div>

  <section class="card gp-label" aria-labelledby="fb-card-h">
    <div class="cardart">{@render bloomSvg(true)}</div>
    <div class="cardbody">
      <p class="kick">You noticed</p>
      <h2 id="fb-card-h">Your tasting card</h2>
      {#if pins.length}
        <ul class="pins">
          {#each pins as p (p)}
            {@const pn = noteById(p)!}
            <li><span class="sw" style:background={colourOf(pn.family as FamilyId)}></span><button type="button" class="pinname" onclick={() => openNote(p)}>{pn.label}</button><button type="button" class="x" aria-label="Remove {pn.label}" onclick={() => togglePin(p)}>×</button></li>
          {/each}
        </ul>
      {:else}
        <p class="quiet">Add up to three notes you can taste in today's cup, then compare them with the bag.</p>
      {/if}
      <label class="bagin">
        <span class="lbl">What does the bag say? <span class="quiet">(optional)</span></span>
        <input type="text" maxlength="160" placeholder="e.g. blueberry, jasmine, dark chocolate" bind:value={bag} />
      </label>
      {#if pins.length && cmp.bagNotes.length}
        <div class="cmp" aria-live="polite">
          {#if cmp.shared.length}<p><b>You both found</b> {cmp.shared.map((x) => noteById(x)?.label).join(', ')}</p>{/if}
          {#if cmp.near.length}<p><b>Close</b> {cmp.near.map((x) => `${noteById(x)?.label} (same family as the bag's ${noteById(cmp.bagNotes.find((b) => noteById(b)?.family === noteById(x)?.family)!)?.label.toLowerCase()})`).join(', ')}</p>{/if}
          {#if cmp.yoursOnly.length}<p><b>Only you</b> {cmp.yoursOnly.map((x) => noteById(x)?.label).join(', ')}</p>{/if}
          {#if cmp.bagOnly.length}<p><b>Only the bag</b> {#each cmp.bagOnly as x, i (x)}{i > 0 ? ', ' : ''}<button type="button" class="inl" onclick={() => openNote(x)}>{noteById(x)?.label}</button>{/each}{' '}<span class="quiet">(open one to try its exercise)</span></p>{/if}
          <p class="quiet small mapping">Read from the bag: {bagMapping.join(' · ')}</p>
          <p class="quiet small">Tasting notes are hints, not a test: a note in the same family counts as close.</p>
        </div>
      {:else if bag.trim() && !cmp.bagNotes.length}
        <p class="quiet small">None of those words match a note on the wheel yet. Try the main fruit or sweet word on the bag.</p>
      {/if}
      <div class="cardactions">
        <button type="button" class="primary" disabled={!pins.length} onclick={saveCard}>Save on this device</button>
        <button type="button" class="ghost" disabled={!pins.length && !bag.trim()} onclick={share}>{copied ? 'Link copied' : 'Copy link'}</button>
        {#if pins.length || bag}<button type="button" class="linkish" onclick={newCard}>New card</button>{/if}
      </div>
      {#if saved.length}
        <details class="saved">
          <summary>Saved cards ({saved.length})</summary>
          <ul>
            {#each saved as c, i (c.made + c.pins.join() + i)}
              <li><button type="button" class="linkish" onclick={() => loadCard(c)}>{c.pins.map((p) => noteById(p)?.label ?? p).join(', ')}</button> <span class="mono quiet">{c.made}</span><button type="button" class="x" aria-label="Delete this saved card" onclick={() => removeSaved(i)}>×</button></li>
            {/each}
          </ul>
        </details>
      {/if}
    </div>
  </section>
</div>

<style>
  .fb {
    --paper: #f3ede3; --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif;
  }
  .lbl { font: 500 11px/1.3 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 6px; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; display: flex; gap: 8px; align-items: center; }
  .quiet { color: var(--ink-3); }
  .small { font-size: 13.5px; }
  .mono { font: 500 13px 'IBM Plex Mono', monospace; }
  .sw { display: inline-block; width: 12px; height: 12px; border-radius: 50% 50% 50% 0; border: 1px solid rgba(42, 29, 21, .5); flex: none; transform: rotate(-45deg); }
  .sw.big { width: 26px; height: 26px; }
  .notice { margin: 0 0 12px; padding: 8px 12px; border-radius: 10px; background: #fbe9cc; font-size: 14.5px; }
  .warn { color: #8f3b22; margin: 8px 0 0; }

  .body { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 32px; align-items: start; }
  .stage { min-width: 0; position: sticky; top: 84px; }
  .stagebar { display: flex; justify-content: flex-end; margin-bottom: 10px; }
  .painting .bloom { position: relative; background: radial-gradient(90% 80% at 50% 42%, #e7ece0 0%, #dde4d6 70%, #d3dbcb 100%); box-shadow: inset 0 0 0 1px rgba(120, 140, 100, .35); }
  .allfam { position: absolute; top: 10px; left: 10px; appearance: none; border: 1px solid rgba(42, 29, 21, .25); background: rgba(251, 248, 243, .92); border-radius: 999px; padding: 6px 12px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink); cursor: pointer; }
  .allfam:hover { background: #fff; }
  .budcue { position: absolute; bottom: 8px; left: 0; right: 0; margin: 0; text-align: center; font: italic 400 15px 'Instrument Serif', Georgia, serif; color: #4f5b49; pointer-events: none; }
  .cue { font: italic 400 21px 'Instrument Serif', Georgia, serif; fill: #4f5b49; }
  .bud { cursor: pointer; outline: none; }
  .bud:focus-visible circle:nth-of-type(2) { stroke: var(--crema-deep); stroke-width: 3; }
  .blab { font-family: 'Instrument Serif', Georgia, serif; fill: #2a1d15; paint-order: stroke; stroke: #e6ebde; stroke-linejoin: round; }
  .blab.on { fill: #6b3a12; }
  .sub { cursor: pointer; outline: none; }
  .sub:focus-visible path:nth-child(2) { stroke: var(--crema-deep); stroke-width: 3; stroke-opacity: 1; }
  .seg { display: flex; border: 1px solid var(--rule); border-radius: 999px; overflow: hidden; flex: none; }
  .seg button { appearance: none; border: 0; background: #fff; padding: 7px 14px; min-height: 36px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; }
  .bloom svg { display: block; width: 100%; height: auto; max-height: 660px; }
  .cap { margin: 12px auto 0; max-width: 52ch; text-align: center; font-size: 13.5px; font-style: italic; color: var(--ink-3); }

  .petal, .leaf { cursor: pointer; outline: none; }
  .petal .shape, .leaf path { transition: fill-opacity .3s, stroke-width .2s; }
  .petal { transition: opacity .3s; }
  .petal:hover .shape { fill-opacity: .95; }
  .petal:focus-visible .shape, .leaf:focus-visible path:first-child { stroke: var(--crema-deep); stroke-width: 4; }
  .sub path { animation: grow .45s cubic-bezier(.2, .7, .2, 1) both; transform-origin: 0 0; }
  @keyframes grow { from { transform: scale(.82); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .flab { font: 400 25px 'Instrument Serif', Georgia, serif; fill: #2a1d15; cursor: pointer; }
  .flab.dim { fill: #5f6a58; }
  .glab { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; fill: #2a1d15; cursor: pointer; paint-order: stroke; stroke: #e2e8da; stroke-linejoin: round; }
  .glab.on { fill: var(--crema-deep); }
  .leaflab { font: italic 400 19px 'Instrument Serif', Georgia, serif; fill: #4f5b49; letter-spacing: .02em; }
  .leaflab.on { fill: var(--ink); }
  svg.mini { width: 100%; height: auto; }

  .list { max-height: 640px; overflow: auto; padding: 8px 14px 12px; background: #fbf8f1; }
  .lfam h3 { font: 400 26px/1.1 'Instrument Serif', Georgia, serif; margin: 14px 0 4px; display: flex; gap: 10px; align-items: center; }
  .lgroup { font: 600 13px/1.3 'IBM Plex Sans', sans-serif; color: var(--ink-2); margin: 10px 0 6px; }
  .gbtn { display: block; appearance: none; border: 0; background: none; padding: 2px 0; cursor: pointer; text-align: left; }
  .gbtn.on { color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; }
  .inl { appearance: none; border: 0; background: none; padding: 0; font: inherit; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  .mapping { margin-top: 6px !important; }
  .chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink); border-radius: 999px; padding: 6px 12px; min-height: 36px; font: 500 14px 'IBM Plex Sans', sans-serif; cursor: pointer; display: inline-flex; gap: 8px; align-items: center; }
  .chip:hover { border-color: var(--ink-3); }
  .chip.on { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); background: #fffaf2; }
  .chip.big { padding: 9px 16px; min-height: 44px; font-size: 15px; }
  .pinmark { color: var(--crema-deep); font-size: 10px; }

  .panel { min-width: 0; scroll-margin-top: 84px; }
  .panel h2 { font: 400 40px/1.02 'Instrument Serif', Georgia, serif; margin: 4px 0 8px; outline: none; }
  .intro h2 { font-size: 36px; }
  .intro > p { color: var(--ink-2); margin: 0 0 14px; }
  .kinds { margin-top: 18px; border-top: 1px solid var(--rule); padding-top: 12px; display: grid; gap: 6px; }
  .kinds p { margin: 0; font-size: 14.5px; color: var(--ink-2); }
  .kinds b { display: inline-block; min-width: 96px; font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--crema-deep); }
  .famhead { display: flex; gap: 14px; align-items: center; }
  .blurb { color: var(--ink-2); margin: 4px 0 12px; }
  .tends { background: #f6efe4; border-radius: 12px; padding: 10px 14px; margin: 0 0 10px; }
  .tends p:last-child { margin: 0; font-size: 15px; }
  .back { margin-top: 16px; }
  .gist { font-size: 17px; margin: 0 0 6px; }
  .flawtag { display: inline-block; font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: #8f3b22; border: 1px solid #d9a891; border-radius: 999px; padding: 2px 8px; vertical-align: 2px; }
  .tryit { border-left: 3px solid var(--crema); padding: 4px 0 4px 14px; margin: 14px 0; }
  .tryit p:last-child { margin: 0; }
  .evidence { border: 1px solid var(--rule); background: #fff; border-radius: 14px; padding: 12px 14px; margin: 12px 0; }
  .evidence p:not(.lbl) { margin: 0 0 8px; font-size: 15px; }
  .evidence .lbl { margin: 0 0 6px; }
  .evidence .evhead { font-size: 16px; }
  .bars { margin: 10px 0 6px; }
  .bar { display: grid; grid-template-columns: 96px minmax(0, 1fr) auto; gap: 10px; align-items: center; margin: 4px 0; font-size: 14px; }
  .bk { color: var(--ink-2); }
  .track { position: relative; height: 10px; background: #f1e9dd; border-radius: 5px; }
  .fill { position: absolute; left: 0; top: 0; bottom: 0; border-radius: 5px; background: var(--crema); }
  .base { position: absolute; top: -3px; bottom: -3px; width: 2px; margin-left: -1px; background: var(--ink); opacity: .55; }
  .bn { font: 400 12.5px 'IBM Plex Mono', monospace; color: var(--ink-3); text-align: right; white-space: nowrap; }
  .bn b { color: var(--ink); font-weight: 500; }
  .evidence .orig { margin-top: 12px; }
  .origins { list-style: none; margin: 0 0 8px; padding: 0; display: flex; flex-wrap: wrap; gap: 6px 16px; font-size: 15px; }
  .origins a { color: var(--ink); text-underline-offset: 3px; }
  .origins .mono { color: var(--ink-3); font-size: 12.5px; }
  .changes ul { margin: 0; padding-left: 1.1em; }
  .changes li { margin: 0 0 6px; font-size: 15px; color: var(--ink-2); }
  .changes b { color: var(--ink); }
  .changes a { color: var(--coffee, #7a4e30); }
  .actions { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; margin-top: 14px; }
  .primary { appearance: none; border: 0; background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 11px 20px; min-height: 44px; font: 600 15px 'IBM Plex Sans', sans-serif; cursor: pointer; }
  .primary[aria-pressed='true'] { background: #fff; color: var(--ink); box-shadow: inset 0 0 0 1.5px var(--ink); }
  .primary:disabled { opacity: .45; cursor: default; }
  .ghost { appearance: none; border: 1px solid var(--ink-3); background: #fff; color: var(--ink); border-radius: 999px; padding: 10px 18px; min-height: 44px; font: 500 15px 'IBM Plex Sans', sans-serif; cursor: pointer; }
  .ghost:disabled { opacity: .45; cursor: default; }
  .linkish { appearance: none; border: 0; background: none; padding: 4px 0; font: inherit; font-size: 15px; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }

  .card { margin-top: 28px; display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 22px; align-items: start; }
  .cardart { background: #dde4d6; border: 2px solid #2a2520; box-shadow: inset 0 0 0 3px #dde4d6, inset 0 0 0 4px rgba(193, 122, 58, .6); padding: 10px; }
  .card h2 { font: 400 32px/1.05 'Instrument Serif', Georgia, serif; margin: 2px 0 10px; }
  .pins { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
  .pins li { display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--ink); border-radius: 999px; padding: 2px 4px 2px 12px; background: #fffaf2; }
  .pinname { appearance: none; border: 0; background: none; font: 600 15px 'IBM Plex Sans', sans-serif; color: var(--ink); cursor: pointer; padding: 6px 2px; }
  .x { appearance: none; border: 0; background: none; width: 32px; height: 32px; border-radius: 50%; font-size: 18px; color: var(--ink-2); cursor: pointer; }
  .x:hover { background: #f1e9dd; }
  .bagin { display: block; max-width: 520px; }
  .bagin input { width: 100%; font: 400 15px 'IBM Plex Sans', sans-serif; padding: 9px 12px; border: 1px solid var(--rule); border-radius: 10px; background: #fff; color: var(--ink); min-height: 42px; }
  .bagin input:focus-visible { outline: 3px solid rgba(143, 93, 34, .55); outline-offset: 1px; border-color: var(--crema-deep); }
  .cmp { margin: 12px 0 0; padding: 10px 14px; background: #f6efe4; border-radius: 12px; }
  .cmp p { margin: 0 0 4px; font-size: 15px; }
  .cmp b { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin-right: 6px; }
  .cardactions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-top: 14px; }
  .saved { margin-top: 12px; font-size: 14.5px; }
  .saved summary { cursor: pointer; color: var(--ink-2); }
  .saved ul { list-style: none; padding: 0; margin: 8px 0 0; }
  .saved li { display: flex; gap: 10px; align-items: center; }

  @media (max-width: 900px) {
    .body { grid-template-columns: 1fr; }
    .stage { position: static; }
    .card { grid-template-columns: 1fr; gap: 10px; }
    .cardart { width: 120px; }
  }
  @media (max-width: 640px) {
    .flab { font-size: 31px; }
    .glab { font-size: 26px; stroke-width: 6px; }
    .leaflab { font-size: 24px; }
    .panel h2 { font-size: 34px; }
    .bar { grid-template-columns: 78px minmax(0, 1fr) auto; gap: 8px; }
    .card h2 { font-size: 28px; }
  }
  @media (prefers-reduced-motion: reduce) { .sub path { animation: none; } .petal .shape, .petal { transition: none; } }
</style>
