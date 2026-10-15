<script lang="ts">
  import { onMount } from 'svelte';
  import { DRINKS, drinkById, refById, compareRefs, mlToFlOz } from '../../lib/coffee/index.ts';
  import type { Drink, DrinkRef, Layer } from '../../lib/coffee/index.ts';

  // Two drinks on one counter, drawn to one scale. Schematic: real drinks mix, foam drains,
  // crema varies. Unpublished amounts are drawn dashed and labelled, never guessed.
  const GROUPS = [
    { label: 'Black', ids: ['espresso', 'doppio', 'ristretto', 'lungo', 'americano', 'long-black', 'red-eye'] },
    { label: 'With milk', ids: ['macchiato', 'cortado', 'gibraltar', 'piccolo', 'flat-white', 'cappuccino', 'latte', 'latte-macchiato', 'mocha'] },
    { label: 'Other', ids: ['affogato', 'cafe-au-lait'] },
  ];
  const FILL: Record<string, string> = { espresso: '#3b2214', milk: '#efe3cf', frothed: '#f3e9d8', foam: '#fffaf2', water: '#a9cfd6', brewed: '#5a3822', chocolate: '#4a2a1c', gelato: '#f4ead2', cream: '#fffdf8' };
  const NAME: Record<string, string> = { espresso: 'espresso', milk: 'milk', frothed: 'frothed milk', foam: 'foam', water: 'hot water', brewed: 'brewed coffee', chocolate: 'chocolate', gelato: 'gelato', cream: 'whipped cream' };

  type Shape = 'demitasse' | 'cup' | 'glass' | 'tall' | 'mug' | 'coupe' | 'paper';
  const SHAPE: Record<Shape, { cap: number; w: number; h: number; hCm: number; saucer?: boolean; handle?: boolean; taper: number }> = {
    demitasse: { cap: 90, w: 58, h: 52, hCm: 6, saucer: true, handle: true, taper: 0.78 },
    cup: { cap: 160, w: 84, h: 62, hCm: 7.5, saucer: true, handle: true, taper: 0.62 },
    glass: { cap: 133, w: 62, h: 84, hCm: 9, taper: 0.9 },
    tall: { cap: 300, w: 66, h: 150, hCm: 15, taper: 0.88 },
    mug: { cap: 300, w: 82, h: 96, hCm: 10, handle: true, taper: 0.96 },
    coupe: { cap: 200, w: 104, h: 70, hCm: 7, taper: 0.45 },
    paper: { cap: 355, w: 80, h: 128, hCm: 13, taper: 0.74 },
  };
  function shapeOf(name: string): Shape {
    const n = name.toLowerCase();
    if (/demitasse|espresso cup/.test(n)) return 'demitasse';
    if (/gibraltar|small glass/.test(n)) return 'glass';
    if (/tall glass|tumbler/.test(n)) return 'tall';
    if (/short cup|tall cup|fl oz/.test(n)) return 'paper';
    if (/bowl|dessert/.test(n)) return 'coupe';
    if (/mug/.test(n)) return 'mug';
    if (/glass/.test(n)) return 'glass';
    return 'cup';
  }

  let aId = $state('cortado-sabora');
  let bId = $state('flat-cimbali');
  let picking = $state<'a' | 'b'>('a');
  let mounted = $state(false);

  let a = $derived(refById(aId)!);
  let b = $derived(refById(bId)!);
  let drinkOf = (r: DrinkRef) => DRINKS.find((d) => d.refs.includes(r)) ?? DRINKS.find((d) => d.refs.some((x) => x.id === r.id))!;
  let da = $derived(drinkOf(a));
  let db = $derived(drinkOf(b));
  let sentence = $derived(compareRefs(a, b, da.name, db.name));

  function pick(drinkId: string) {
    const d = drinkById(drinkId)!;
    if (picking === 'a') { aId = d.refs[0].id; picking = 'b'; } else { bId = d.refs[0].id; picking = 'a'; }
  }

  // ── geometry: both vessels share one ml→size scale ──
  // The drawing is laid out for its real width: on a phone it uses a narrower canvas and a colour key
  // instead of leader labels, so text stays readable rather than shrinking with the SVG.
  const BASE = 290, H_AVAIL = 210;
  let cw = $state(900);
  let narrow = $derived(cw < 640);
  let VW = $derived(narrow ? 440 : 900);
  let CX = $derived(narrow ? [108, 322] : [270, 630]);
  function capOf(r: DrinkRef) { const s = SHAPE[shapeOf(r.vessel.name)]; return r.vessel.capacityMl ? (r.vessel.capacityMl[0] + r.vessel.capacityMl[1]) / 2 : s.cap; }
  let scale = $derived.by(() => {
    // size factor so the larger vessel stands about H_AVAIL tall
    const k = (r: DrinkRef) => { const s = SHAPE[shapeOf(r.vessel.name)]; return s.h * Math.cbrt(capOf(r) / s.cap); };
    const kw = (r: DrinkRef) => { const s = SHAPE[shapeOf(r.vessel.name)]; return s.w * Math.cbrt(capOf(r) / s.cap); };
    return Math.min(H_AVAIL / Math.max(k(a), k(b)), (narrow ? 150 : 250) / Math.max(kw(a), kw(b)));
  });

  interface Drawn { kind: string; y0: number; y1: number; band?: [number, number]; unknown: boolean; label: string; value: string }
  function build(r: DrinkRef) {
    const s = SHAPE[shapeOf(r.vessel.name)];
    const f = Math.cbrt(capOf(r) / s.cap) * scale;
    const w = s.w * f, h = s.h * f, cap = capOf(r);
    const byMass = r.layers.some((l) => l.g && !l.ml);
    const amount = (l: Layer) => (l.ml ? (l.ml[0] + l.ml[1]) / 2 : l.g ? (l.g[0] + l.g[1]) / 2 : 0);
    const known = r.layers.reduce((t, l) => t + amount(l), 0);
    // Unpublished layers get a nominal share of the free space so the drawing reads; they stay dashed.
    // Espresso, foam and chocolate get small fixed shares; milk, water or brewed coffee fill the rest.
    const free = Math.max(cap * 0.82 - known, cap * 0.18);
    const small = (l: Layer) => (l.kind === 'espresso' ? Math.min(30, free * 0.35) : l.kind === 'foam' || l.kind === 'chocolate' ? free * 0.12 : 0);
    const unk = r.layers.filter((l) => l.unspecified);
    const fillers = unk.filter((l) => small(l) === 0).length;
    const rest = Math.max(0, free - unk.reduce((t, l) => t + small(l), 0));
    const nominal = (l: Layer) => small(l) || rest / Math.max(1, fillers);
    let acc = 0;
    const layers: Drawn[] = r.layers.map((l) => {
      const v = l.unspecified ? nominal(l) : amount(l);
      const y0 = BASE - (acc / cap) * h; acc += v; const y1 = BASE - (acc / cap) * h;
      let band: [number, number] | undefined;
      const range = l.ml ?? l.g;
      if (range && range[0] !== range[1]) band = [BASE - ((acc - v + range[0]) / cap) * h, BASE - ((acc - v + range[1]) / cap) * h];
      const unit = l.ml ? 'ml' : 'g';
      const val = range ? (range[0] === range[1] ? `${range[0]} ${unit}` : `${range[0]}–${range[1]} ${unit}`) : 'amount not published';
      return { kind: l.kind, y0, y1, band, unknown: !!l.unspecified, label: NAME[l.kind], value: val };
    });
    const foamPx = r.foamCm ? ((r.foamCm[0] + r.foamCm[1]) / 2 / s.hCm) * h : 0;
    return { s, w, h, cap, layers, byMass, foamPx, shape: shapeOf(r.vessel.name) };
  }
  let A = $derived(build(a));
  let B = $derived(build(b));
  // Widen the canvas when the outside labels need room (a big mug's handle pushes them right).
  const LABEL_W = 150;
  let vLeft = $derived(narrow ? 0 : Math.min(0, CX[0] - A.w / 2 - 34 - LABEL_W));
  let vRight = $derived(narrow ? VW : Math.max(VW, CX[1] + B.w / 2 + (B.s.handle ? B.h * 0.27 + 22 : 0) + 34 + LABEL_W));
  // Crop the canvas to the taller vessel so short drinks don't float in empty space.
  let vTop = $derived(Math.min(BASE - Math.max(A.h, B.h) - 26, BASE - 120));
  let keyKinds = $derived([...new Set([...a.layers, ...b.layers].filter((l) => !l.unspecified).map((l) => l.kind))]);
  let hasUnknown = $derived([...a.layers, ...b.layers].some((l) => l.unspecified));

  function outline(cx: number, g: ReturnType<typeof build>) {
    const top = BASE - g.h, wt = g.w / 2, wb = (g.w * g.s.taper) / 2;
    if (g.shape === 'coupe') return `M${cx - wt} ${top} Q ${cx - wt + 4} ${BASE - 16}, ${cx - wb} ${BASE - 12} L ${cx + wb} ${BASE - 12} Q ${cx + wt - 4} ${BASE - 16}, ${cx + wt} ${top}`;
    const r = g.shape === 'glass' || g.shape === 'tall' ? 4 : 12;
    return `M${cx - wt} ${top} L${cx - wb} ${BASE - r} Q${cx - wb} ${BASE} ${cx - wb + r} ${BASE} L${cx + wb - r} ${BASE} Q${cx + wb} ${BASE} ${cx + wb} ${BASE - r} L${cx + wt} ${top}`;
  }
  // Label rows: each layer's label sits beside its band, pushed apart so thin layers don't collide.
  function labelSpots(g: ReturnType<typeof build>) {
    const GAP = 32;
    const spots = [...g.layers].reverse().map((L) => ({ ...L, ly: (L.y0 + L.y1) / 2, ty: (L.y0 + L.y1) / 2 - 2 }));
    for (let i = 1; i < spots.length; i++) spots[i].ty = Math.max(spots[i].ty, spots[i - 1].ty + GAP);
    const over = spots.length ? spots[spots.length - 1].ty - (BASE - 14) : 0;
    if (over > 0) for (const sp of spots) sp.ty -= over;
    return spots;
  }
  const widthAt = (g: ReturnType<typeof build>, y: number) => { const t = (BASE - y) / g.h; return (g.w * g.s.taper + (g.w - g.w * g.s.taper) * t) / 2; };

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const qa = q.get('a'), qb = q.get('b');
    if (qa && refById(qa)) aId = qa;
    if (qb && refById(qb)) bId = qb;
    if (!qa && q.get('drink') && drinkById(q.get('drink')!)) aId = drinkById(q.get('drink')!)!.refs[0].id;
    mounted = true;
  });
  $effect(() => { if (!mounted) return; history.replaceState(history.state, '', `${location.pathname}?a=${aId}&b=${bId}`); });
</script>

<div class="cd">
  <div class="menu" role="group" aria-label="Choose drinks">
    <p class="hint"><span class="slot" class:sa={picking === 'a'} class:sb={picking === 'b'}>{picking === 'a' ? 'Left' : 'Right'}</span> Tap a drink to put it on the {picking === 'a' ? 'left' : 'right'}.</p>
    {#each GROUPS as g (g.label)}
      <div class="grp">
        <span class="gl">{g.label}</span>
        {#each g.ids as id (id)}
          {@const d = drinkById(id)}
          {#if d}<button type="button" class:a={da.id === id} class:b={db.id === id} aria-pressed={da.id === id || db.id === id} onclick={() => pick(id)}>{d.name}</button>{/if}
        {/each}
      </div>
    {/each}
  </div>

  <figure class="counter" bind:clientWidth={cw}>
    <svg viewBox="{vLeft} {vTop} {vRight - vLeft} {BASE + 76 - vTop}" class:narrow role="img" aria-label={`${da.name} (${a.label}) beside ${db.name} (${b.label}), drawn to the same scale. ${sentence}`}>
      <defs>
        <pattern id="cd-unk" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#f6efe4" /><line x1="0" y1="0" x2="0" y2="8" stroke="#c9b9a3" stroke-width="3" /></pattern>
        <linearGradient id="cd-glass" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6" /><stop offset=".5" stop-color="#fff" stop-opacity=".05" /><stop offset="1" stop-color="#fff" stop-opacity=".45" /></linearGradient>
        <linearGradient id="cd-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9dcc8" /><stop offset="1" stop-color="#d9c6aa" /></linearGradient>
      </defs>
      <rect x={vLeft} y={BASE + 6} width={vRight - vLeft} height="90" fill="url(#cd-wood)" />
      <line x1={vLeft} x2={vRight} y1={BASE + 6} y2={BASE + 6} stroke="#bfa98a" />
      {#each [{ g: A, r: a, d: da, cx: CX[0], side: -1 }, { g: B, r: b, d: db, cx: CX[1], side: 1 }] as v (v.cx)}
        {@const clipId = `cd-clip-${v.cx}`}
        <g class="vessel">
          <clipPath id={clipId}><path d={`${outline(v.cx, v.g)} Z`} /></clipPath>
          {#if v.g.s.saucer}<ellipse cx={v.cx} cy={BASE + 4} rx={v.g.w * 0.66} ry="7" fill="#fbf8f3" stroke="#2a1d15" stroke-width="1.8" />{/if}
          <g clip-path={`url(#${clipId})`}>
            {#each v.g.layers as L, i (i)}
              <rect x={v.cx - v.g.w} y={L.y1} width={v.g.w * 2} height={Math.max(0, L.y0 - L.y1) + 0.6} fill={L.unknown ? 'url(#cd-unk)' : FILL[L.kind]} class="lay" style:animation-delay="{i * 0.25}s" />
              {#if L.band}<rect x={v.cx - v.g.w} y={Math.min(L.band[0], L.band[1])} width={v.g.w * 2} height={Math.abs(L.band[1] - L.band[0])} fill="#2a1d15" opacity=".08" />{/if}
              {#if L.kind === 'espresso' && !L.unknown}<rect x={v.cx - v.g.w} y={L.y1} width={v.g.w * 2} height="3" fill="#b77a3c" />{/if}
            {/each}
            {#if v.g.foamPx > 0}
              {@const top = v.g.layers[v.g.layers.length - 1].y1}
              <rect x={v.cx - v.g.w} y={top} width={v.g.w * 2} height={v.g.foamPx} fill="#fffaf2" />
            {/if}
          </g>
          <path d={outline(v.cx, v.g)} fill={v.g.shape === 'glass' || v.g.shape === 'tall' || v.g.shape === 'coupe' ? 'url(#cd-glass)' : 'none'} stroke={v.r.vessel.capacityMl ? '#2a1d15' : '#8a786a'} stroke-dasharray={v.r.vessel.capacityMl ? '' : '5 4'} stroke-width="2" stroke-linejoin="round" />
          <!-- 3/4 rim -->
          <ellipse cx={v.cx} cy={BASE - v.g.h} rx={v.g.w / 2} ry={Math.max(3, v.g.w * 0.07)} fill="none" stroke="#2a1d15" stroke-width="1.6" />
          {#if v.g.s.handle}<path d={`M${v.cx + widthAt(v.g, BASE - v.g.h * 0.75) - 1} ${BASE - v.g.h * 0.75} c ${v.g.h * 0.36} -2, ${v.g.h * 0.36} ${v.g.h * 0.5}, -1 ${v.g.h * 0.5}`} fill="none" stroke="#2a1d15" stroke-width="2" />{/if}
          {#if v.g.shape === 'coupe'}<path d={`M${v.cx} ${BASE - 12} L${v.cx} ${BASE - 2} M${v.cx - 22} ${BASE} L${v.cx + 22} ${BASE}`} stroke="#2a1d15" stroke-width="2" fill="none" />{/if}
          {#if v.g.shape === 'paper'}<rect x={v.cx - v.g.w * 0.46} y={BASE - v.g.h * 0.62} width={v.g.w * 0.92} height={v.g.h * 0.24} fill="#c9b18e" opacity=".6" />{/if}
          <!-- labels on the outside (wide layout only; phones get the colour key below) -->
          {#if !narrow}
            {@const lx = v.cx + v.side * (v.g.w / 2 + (v.side > 0 && v.g.s.handle ? v.g.h * 0.27 + 22 : 0) + 34)}
            {#each labelSpots(v.g) as L, i (i)}
              {@const edge = widthAt(v.g, L.ly)}
              <polyline points={`${v.cx + v.side * (edge + 2)},${L.ly} ${lx - v.side * 14},${L.ly} ${lx - v.side * 4},${L.ty - 4}`} fill="none" stroke="#8a786a" stroke-width=".8" />
              <text x={lx} y={L.ty} text-anchor={v.side < 0 ? 'end' : 'start'} class="lbl" class:unk={L.unknown}>{L.label}<tspan x={lx} dy="15" class="val">{L.value}</tspan></text>
            {/each}
          {/if}
          <text x={v.cx} y={BASE + 42} text-anchor="middle" class="nm">{v.d.name}</text>
          <text x={v.cx} y={BASE + 62} text-anchor="middle" class="sub">{narrow ? v.r.label : `${v.r.label} · ${v.r.vessel.name}${v.r.vessel.capacityMl ? `, ${Math.round(v.r.vessel.capacityMl[1])} ml` : ' (size not published)'}`}</text>
        </g>
      {/each}
    </svg>
    {#if narrow}
      <ul class="key" aria-label="Color key">
        {#each keyKinds as k (k)}<li><span class="sw" style:background={FILL[k]}></span>{NAME[k]}</li>{/each}
        {#if hasUnknown}<li><span class="sw hatch"></span>amount not published</li>{/if}
      </ul>
    {/if}
    <figcaption>Schematic layers drawn to one scale. Shaded bands show a range; hatched layers mean the recipe doesn't publish that amount, so their heights are placeholders, not to scale; a dashed outline means it doesn't give the cup size.{A.byMass || B.byMass ? ' Recipes measured by weight are drawn in proportion to the weights.' : ''}</figcaption>
  </figure>

  <div class="diff"><span class="k">The difference</span><p>{sentence}</p></div>

  <div class="cards">
    {#each [{ r: a, d: da, set: (id: string) => (aId = id), tag: 'Left' }, { r: b, d: db, set: (id: string) => (bId = id), tag: 'Right' }] as c (c.tag)}
      <article class="card">
        <p class="tag">{c.tag}</p>
        <h3>{c.d.name}</h3>
        <p class="def">{c.d.definition}</p>
        {#if c.d.refs.length > 1}
          <div class="refs" role="group" aria-label={`${c.d.name} recipes`}>
            {#each c.d.refs as r (r.id)}<button type="button" aria-pressed={r.id === c.r.id} onclick={() => c.set(r.id)}>{r.label}</button>{/each}
          </div>
        {/if}
        <dl>
          <div><dt>Shots</dt><dd>{c.r.shots}</dd></div>
          {#each c.r.layers as l, i (i)}
            <div><dt>{NAME[l.kind]}</dt><dd>{l.ml ? `${l.ml[0] === l.ml[1] ? l.ml[0] : `${l.ml[0]}–${l.ml[1]}`} ml (${l.ml[0] === l.ml[1] ? mlToFlOz(l.ml[0]).toFixed(1) : `${mlToFlOz(l.ml[0]).toFixed(1)}–${mlToFlOz(l.ml[1]).toFixed(1)}`} fl oz)` : l.g ? `${l.g[0] === l.g[1] ? l.g[0] : `${l.g[0]}–${l.g[1]}`} g` : 'not published'}{l.basis ? ` — ${l.basis}` : ''}</dd></div>
          {/each}
          {#if c.r.foamCm}<div><dt>Foam</dt><dd>about {c.r.foamCm[0]} cm</dd></div>{/if}
          <div><dt>Served in</dt><dd>{c.r.vessel.name}{c.r.vessel.capacityMl ? `, ${c.r.vessel.capacityMl[0] === c.r.vessel.capacityMl[1] ? c.r.vessel.capacityMl[0] : `${c.r.vessel.capacityMl[0]}–${c.r.vessel.capacityMl[1]}`} ml` : ''}</dd></div>
        </dl>
        {#if c.r.note}<p class="note">{c.r.note}</p>{/if}
        <p class="src">Recipe: <a href={c.r.source.url} target="_blank" rel="noopener">{c.r.source.name}</a> · {c.r.where}</p>
      </article>
    {/each}
  </div>
</div>

<style>
  .cd { --rule: #d9cdbd; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --crema: #c3873a; --crema-deep: #8f5d22;
    background: #fbf8f3; border: 1px solid var(--rule); border-radius: 18px; overflow: hidden; color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .menu { padding: 16px 20px 12px; border-bottom: 1px solid var(--rule); display: grid; gap: 8px; }
  .hint { margin: 0 0 2px; font-size: 13px; color: var(--ink-3); display: flex; gap: 8px; align-items: center; }
  .slot { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; border-radius: 999px; padding: 4px 8px; }
  .slot.sa { background: var(--ink); color: #f3ede3; }
  .slot.sb { background: #fff; color: var(--ink); box-shadow: 0 0 0 1.5px var(--crema) inset; }
  .grp { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
  .gl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); width: 76px; }
  .grp button, .refs button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 7px 12px; min-height: 36px; font: 500 13px/1 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .grp button.a { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .grp button.b { box-shadow: 0 0 0 1.5px var(--crema) inset; border-color: var(--crema); color: var(--ink); }
  .refs { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 10px; }
  .refs button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .counter { margin: 0; background: linear-gradient(180deg, #fffdf9 0%, #f6efe4 76%); }
  .counter svg { width: 100%; height: auto; display: block; }
  .lay { transform-box: fill-box; transform-origin: bottom; animation: pour .6s cubic-bezier(.2, .7, .2, 1) both; }
  @keyframes pour { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  .lbl { font: 400 12.5px 'IBM Plex Mono', monospace; fill: var(--ink-2); }
  .lbl.unk { fill: #8a786a; font-style: italic; }
  .val { font-size: 11.5px; fill: var(--ink-3); }
  .nm { font: 400 30px 'Instrument Serif', Georgia, serif; fill: var(--ink); }
  .sub { font: 400 12px 'IBM Plex Mono', monospace; fill: var(--ink-3); }
  .narrow .nm { font-size: 34px; }
  .narrow .sub { font-size: 17px; }
  .key { list-style: none; margin: 0; padding: 10px 18px 0; display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 13.5px; color: var(--ink-2); }
  .key li { display: flex; align-items: center; gap: 6px; }
  .sw { width: 14px; height: 14px; border-radius: 3px; border: 1px solid #b9a78f; }
  .sw.hatch { background: repeating-linear-gradient(45deg, #f6efe4 0 3px, #c9b9a3 3px 5px); }
  figcaption { font-size: 12.5px; color: var(--ink-3); padding: 8px 18px 10px; }
  .diff { padding: 14px 22px; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); background: linear-gradient(90deg, rgba(195, 135, 58, .1), transparent 70%); display: flex; gap: 14px; align-items: baseline; }
  .diff .k { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-deep); white-space: nowrap; }
  .diff p { margin: 0; font: 400 21px/1.3 'Instrument Serif', Georgia, serif; }
  @media (max-width: 640px) { .diff { flex-direction: column; gap: 6px; padding: 14px 18px; } }
  .cards { display: grid; grid-template-columns: 1fr 1fr; }
  .card { padding: 18px 22px 22px; }
  .card + .card { border-left: 1px solid var(--rule); }
  .tag { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  h3 { font: 400 32px/1.05 'Instrument Serif', Georgia, serif; margin: 4px 0 6px; }
  .def { margin: 0 0 10px; color: var(--ink-2); font-size: 15px; }
  dl { margin: 0; border-top: 1px solid var(--rule); }
  dl div { display: grid; grid-template-columns: 110px 1fr; gap: 10px; padding: 7px 0; border-bottom: 1px dashed var(--rule); }
  dt { font: 500 11px/1.6 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
  dd { margin: 0; font-size: 14.5px; }
  .note { font-size: 13.5px; color: var(--ink-2); margin: 10px 0 0; }
  .src { font-size: 13px; color: var(--ink-3); margin: 10px 0 0; }
  .src a { color: #7a4e30; }
  button:focus-visible, a:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 760px) {
    .gl { width: 100%; }
    .cards { grid-template-columns: 1fr; }
    .card + .card { border-left: 0; border-top: 1px solid var(--rule); }
  }
  @media (prefers-reduced-motion: reduce) { .lay { animation: none; } }
</style>
