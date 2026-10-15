<script lang="ts">
  import { onMount } from 'svelte';
  import data from '../../data/grinders.json';
  import { GROUPS, settingsFor, groupsFor, groupFromParam, rangeText, headline, countHeadline, turnsLine, grinderById } from '../../lib/coffee/grinders.ts';
  import type { Grinder, Group, Setting } from '../../lib/coffee/grinders.ts';

  // Your grinder's own control, drawn and turned to the maker's starting setting for your brew.
  // Every number is the maker's, in the maker's unit; where the maker prints only a range, the
  // band is shown and nothing is invented inside it.
  const grinders = data.grinders as unknown as Grinder[];
  const electric = grinders.filter((g) => g.type === 'electric'), hand = grinders.filter((g) => g.type === 'hand');

  let grinderId = $state<string>('baratza-encore');
  let group = $state<Group>('pourover');
  // A second published row for the same method (Breville's two drip filters) is picked from the map.
  let pickKey = $state<string | null>(null);
  // A method a link asked for that this grinder has no included setting for: said, never swapped silently.
  let askedFor = $state<Group | null>(null);
  // A ?grinder= link that names no grinder we include: said, not silently replaced.
  let badGrinder = $state(false);
  // A ?method= or ?setting= value we don't recognise: said too, like every other bad link (Muse WB1 G-2).
  let badMethod = $state(false);
  let badSetting = $state(false);
  let mounted = $state(false);
  let g = $derived(grinderById(grinders, grinderId) ?? grinders[0]);
  let available = $derived(groupsFor(g));
  let missing = $derived(GROUPS.filter((m) => !available.some((x) => x.id === m.id)));
  let rows = $derived(settingsFor(g, group));
  let s = $derived<Setting | null>(rows.find((r) => r.key === pickKey) ?? rows[0] ?? null);
  let others = $derived(rows.filter((r) => r !== s));
  let brew = $derived(GROUPS.find((x) => x.id === group)!.brew);
  // "maker" or "source": the two secondary-source grinders never borrow the maker's authority.
  let who = $derived(s?.provenance === 'documented-secondary' ? 'source' : 'maker');
  let brand = $derived(g.name.split(' ')[0]);

  function pickGrinder(id: string) {
    grinderId = id;
    pickKey = null;
    askedFor = null;
    badGrinder = false;
    badMethod = false; badSetting = false;
    const gg = grinderById(grinders, id);
    // Keep the method if this grinder's maker publishes it; otherwise the first one it does, and say so (Muse WB1 G-3).
    if (gg && !settingsFor(gg, group).length) { askedFor = group; group = groupsFor(gg)[0]?.id ?? group; }
    try { localStorage.setItem('jayarr-grinder', id); } catch { /* storage unavailable */ }
  }
  const pickGroup = (id: Group) => { group = id; pickKey = null; askedFor = null; badMethod = false; badSetting = false; };
  const pickRow = (r: Setting) => { group = r.group; pickKey = r.key; askedFor = null; badMethod = false; badSetting = false; };
  onMount(() => {
    const q = new URLSearchParams(location.search);
    let saved: string | null = null;
    try { saved = localStorage.getItem('jayarr-grinder'); } catch { /* storage unavailable */ }
    const id = q.get('grinder') ?? saved;
    if (id && grinderById(grinders, id)) grinderId = id;
    else if (q.get('grinder')) badGrinder = true;
    const m = groupFromParam(q.get('method'));
    if (q.get('method') && !m) badMethod = true;
    if (m && settingsFor(g, m).length) group = m;
    else {
      if (m) askedFor = m;
      if (!settingsFor(g, group).length) group = groupsFor(g)[0]?.id ?? group;
    }
    // A link to a second row for the same method (Breville's paper-filter drip) restores that row.
    const key = q.get('setting');
    if (key && settingsFor(g, group).some((r) => r.key === key)) pickKey = key;
    else if (key && !badMethod && !askedFor) badSetting = true;
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const extra = s && s !== rows[0] ? `&setting=${encodeURIComponent(s.key)}` : '';
    history.replaceState(history.state, '', `${location.pathname}?grinder=${g.id}&method=${group}${extra}`);
  });

  // Where the control turns to: the maker's start, else the fine end of the band.
  let target = $derived(s && s.min != null ? (s.start ?? s.min) : null);
  let bandTo = $derived(s && s.min != null ? (s.openTop ? g.scale?.[1] ?? s.min : s.max ?? s.min) : null);
  const isSingle = (r: Setting) => r.start != null || (r.min != null && r.max === r.min && !r.openTop);
  let single = $derived(!!s && isSingle(s));
  // A published low end that sits inside the maker's "don't grind here" zone reads as "above" it (the C2).
  const lowText = (r: Setting) => (g.avoid && r.min != null && r.min <= g.avoid[1] ? `above ${r.min}` : `${r.min}`);

  // ── Numbered dial: a 300° scale; top centre is the grinder's index mark ──
  const SWEEP = 300, C = 160, CAP = (6 / 120) * (180 / Math.PI);
  const ang = (v: number, sc: [number, number]) => -SWEEP / 2 + ((v - sc[0]) / (sc[1] - sc[0])) * SWEEP;
  const pt = (a: number, r: number, cx = C, cy = C) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)];
  function arc(a0: number, a1: number, r: number, cx = C, cy = C) {
    const [x0, y0] = pt(a0, r, cx, cy), [x1, y1] = pt(a1, r, cx, cy);
    return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  }
  function ticks(sc: [number, number]) {
    const span = sc[1] - sc[0];
    const major = span <= 16 ? 1 : span <= 60 ? 5 : 10, minor = span <= 16 ? (g.step === 0.25 ? 0.25 : 0) : span <= 60 ? 1 : 5;
    const out: { v: number; major: boolean }[] = [];
    for (let v = sc[0]; v <= sc[1] + 1e-9; v += minor || major) out.push({ v: Math.round(v * 100) / 100, major: Math.abs(v / major - Math.round(v / major)) < 1e-9 || v === sc[0] });
    return out;
  }
  let ringTurn = $derived(single && g.kind === 'dial' && g.scale && target != null ? -ang(target, g.scale) : 0);

  // ── Turn-counted grinders: a knob for one turn, and a ruler across the turns ──
  let full = $derived(g.perTurn && target != null ? Math.floor(target / g.perTurn + 1e-9) : 0);
  let rest = $derived(g.perTurn && target != null ? Math.round((target - full * g.perTurn) * 100) / 100 : target ?? 0);
  let knobTurn = $derived(single && g.kind === 'turns' && g.perTurn && target != null ? -(rest / g.perTurn) * 360 : 0);
  // A range on a knob with a published turn size: the arc of the one turn it covers, or the whole ring past a turn.
  let knobArc = $derived.by(() => {
    if (g.kind !== 'turns' || !g.perTurn || single || !s || s.min == null || bandTo == null) return null;
    const span = bandTo - s.min;
    const a0 = ((s.min % g.perTurn) / g.perTurn) * 360, a1 = a0 + (span / g.perTurn) * 360;
    const ends = [a0, a1].map((a) => [...pt(a, 93, 160, 122), ...pt(a, 111, 160, 122)]);
    // Each end is labelled in the ruler's own count, outside the bezel; two ends close together share one label.
    const label = (a: number, text: string) => {
      const [x, y] = pt(a, 122, 160, 122);
      return { x, y: y + 4, text, anchor: x > 172 ? 'start' : x < 148 ? 'end' : 'middle' };
    };
    const gap = Math.abs(((a1 - a0) % 360 + 360) % 360);
    const labels = gap < 30 || gap > 330 ? [label(a0, `from ${s.min} · to ${bandTo}`)] : [label(a0, `from ${s.min}`), label(a1, `to ${bandTo}`)];
    // A range of a turn or more: a thin full ring for each whole turn, and a thick arc for the part beyond it.
    if (span >= g.perTurn) {
      const extra = ((span % g.perTurn) / g.perTurn) * 360;
      return { full: true, d: extra > 0.5 ? arc(a0, a0 + extra, 102, 160, 122) : '', ends, labels, turns: Math.round((span / g.perTurn) * 10) / 10 };
    }
    return { full: false, d: arc(a0, a1, 102, 160, 122), ends, labels, turns: 0 };
  });
  // The ruler shows whole turns to just past the coarsest published setting, or a round number without turn data.
  let rulerMax = $derived.by(() => {
    if (g.kind !== 'turns') return 1;
    const top = Math.max(...g.settings.map((x) => (x.max ?? x.min ?? 0)));
    if (g.perTurn) return Math.max(g.perTurn, Math.ceil((top + 1e-9) / g.perTurn) * g.perTurn);
    const st = [5, 10, 20, 25, 50, 100].find((x) => (top * 1.15) / x <= 8) ?? 100;
    return Math.ceil((top * 1.15) / st) * st;
  });
  const rx = (v: number) => 20 + (v / rulerMax) * 280;
  let rulerTicks = $derived.by(() => {
    const st = [1, 2, 5, 10, 20, 25, 50, 100].find((x) => rulerMax / x <= 6) ?? 100;
    return Array.from({ length: Math.floor(rulerMax / st) + 1 }, (_, i) => i * st);
  });
  let turnMarks = $derived(g.perTurn ? Array.from({ length: Math.floor(rulerMax / g.perTurn) }, (_, i) => (i + 1) * g.perTurn!) : []);
  let knobStep = $derived(!g.perTurn ? 1 : g.perTurn >= 60 ? 10 : g.perTurn >= 30 ? 5 : 1);
  let knobCap = $derived(
    !g.perTurn ? `Count ${g.unit} from zero on the ruler.`
    : single ? `The knob is turned to ${rest} within the turn; the ruler counts all ${target} ${g.unit} from zero.`
    : knobArc?.full ? `The knob shows one turn of ${g.perTurn} ${g.unit}. This range runs ${knobArc.turns} turns: the thin ring is one full turn from the first mark, and the thick arc carries on to the second.`
    : `The knob shows one turn of ${g.perTurn} ${g.unit}; the arc is where the range falls in it.`
  );

  // ── Named steps (Hario, Capresso): one continuous strip from fine to coarse ──
  const NX = 16, NW = 308;
  // Grounds drawn along the strip, growing from fine to coarse; fixed positions, so it never shimmers.
  const grounds = Array.from({ length: 190 }, (_, i) => {
    const t = (0.5 + i * 0.7548776662) % 1, u = (0.5 + i * 0.5698402910) % 1;
    return { x: NX + 3 + t * (NW - 6), y: 55 + u * 24, r: 0.5 + t * 2.3 };
  });
  let namedOn = $derived.by(() => {
    if (!s?.categories || !g.categories) return null;
    // A headline override means the maker gives one step with a conditional alternative (Capresso pump espresso).
    const main = s.headline ? [s.categories[0]] : s.categories;
    const idx = main.map((c) => g.categories!.indexOf(c)).filter((i) => i >= 0);
    const alt = s.headline ? s.categories.slice(1).map((c) => g.categories!.indexOf(c)).filter((i) => i >= 0) : [];
    return { lo: Math.min(...idx), hi: Math.max(...idx), alt, all: [...idx, ...alt] };
  });

  // ── The map: every published setting for this grinder on one scale ──
  let mapScale = $derived<[number, number] | null>(g.kind === 'dial' && g.scale ? (g.scale as [number, number]) : g.kind === 'turns' ? [0, rulerMax] : null);
  const pc = (v: number) => (mapScale ? ((v - mapScale[0]) / (mapScale[1] - mapScale[0])) * 100 : 0);
  const mapEnd = (r: Setting) => (r.openTop ? mapScale?.[1] ?? r.min! : r.max ?? r.min!);
  // Rows in order along the scale, so the map reads fine to coarse; as-written text keeps the source's order.
  let mapRows = $derived.by(() => {
    const at = (r: Setting) => (r.min != null ? [r.min, mapEnd(r)] : r.categories && g.categories ? [g.categories.indexOf(r.categories[0]), Math.max(...r.categories.map((c) => g.categories!.indexOf(c)))] : null);
    return g.kind === 'text' ? g.settings : [...g.settings].sort((a, b) => { const x = at(a)!, y = at(b)!; return x[0] - y[0] || x[1] - y[1]; });
  });
  // Capresso prints its steps in capitals; shown as words, like Hario's.
  const nice = (t: string) => t.replace(/\b[A-Z]{2,}\b/g, (w) => w[0] + w.slice(1).toLowerCase());
  function mapVal(r: Setting): string {
    if (r.published) return r.published;
    // A maker's condition stays with its alternative: "FINE (EXTRA FINE for some pump machines)".
    if (r.categories) return nice(r.headline ? r.headline.replace(/^Start (at|between) /, '') : r.categories.join(' to '));
    if (r.min == null) return '';
    if (r.start != null) return r.max != null && r.max !== r.min ? `${r.start}, in ${r.min}–${r.max}` : `${r.start}`;
    if (r.openTop) return `${r.min} and coarser`;
    if (r.max == null || r.max === r.min) return `${r.min}`;
    return g.avoid && r.min <= g.avoid[1] ? `above ${r.min}, to ${r.max}` : `${r.min}–${r.max}`;
  }
  let mapUnit = $derived(g.kind === 'dial' && g.scale ? `on its ${g.scale[0]}–${g.scale[1]} dial` : g.kind === 'turns' ? `${g.unit} from zero` : g.kind === 'named' ? 'fine to coarse' : 'as written');
  // The secondary source's notation, from its own chart: a rotation and a mark ("1+4"); plain numbers
  // (0 to 5, then 1+0) are marks on the first rotation.
  let textNotes = $derived(!s?.published ? [] : [
    ...(s.published.includes('+') ? ['The source writes a rotation and a mark: “1+4” is one full rotation from zero, then on to mark 4.'] : []),
    ...(/(^|[^+\d])\d+(\.\d)?(\s|$)/.test(s.published) ? ['A plain number such as 3.5 is a mark on the first rotation: on the source\'s chart, 0 to 5 come before 1+0.'] : []),
  ]);
</script>

{#snippet legend(range: boolean, start: boolean, avoid: boolean, flat = false)}
  <p class="legend" aria-hidden="true">
    {#if range}<span><i class="k-band" class:flat></i>{who}'s range</span>{/if}
    {#if start}<span><i class="k-start"></i>{who}'s setting</span>{/if}
    {#if avoid}<span><i class="k-avoid"></i>maker says avoid</span>{/if}
  </p>
{/snippet}

<div class="gc">
  <div class="pick">
    <label class="fld"><span class="lbl">Your grinder</span>
      <select value={g.id} onchange={(e) => pickGrinder((e.currentTarget as HTMLSelectElement).value)}>
        <optgroup label="Electric">{#each electric as x (x.id)}<option value={x.id}>{x.short}</option>{/each}</optgroup>
        <optgroup label="Hand grinders">{#each hand as x (x.id)}<option value={x.id}>{x.short}</option>{/each}</optgroup>
      </select>
    </label>
    {#if g.applies}<p class="applies">{g.applies}</p>{/if}
    <div class="fld"><span class="lbl">Brewing</span>
      <div class="chips" role="group" aria-label="Brew method">
        {#each GROUPS as m (m.id)}
          {@const has = available.some((x) => x.id === m.id)}
          <!-- crossed-out methods stay focusable, so keyboard and screen-reader users find them too -->
          <button type="button" aria-pressed={group === m.id} aria-disabled={!has} class:off={!has} aria-label={has ? undefined : `${m.label}: no verified setting for this grinder`} onclick={() => { if (has) pickGroup(m.id); }}>{m.label}</button>
        {/each}
      </div>
      {#if missing.length}<p class="why">Crossed out: no verified setting is included here for {missing.map((x) => x.label.toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' or $1')}.</p>{/if}
    </div>
  </div>

  <div class="left">
  <div class="stage">
    {#if s && g.kind === 'dial' && g.scale}
      <svg viewBox="0 0 320 320" class="dial" role="img" aria-label="{g.short} dial: {headline(g, s)}, on the {who}'s {g.scale[0]} to {g.scale[1]} scale (lower is finer).">
        <circle cx={C} cy={C} r="152" class="bezel" />
        <g class="ring" style:transform="rotate({ringTurn}deg)">
          <circle cx={C} cy={C} r="138" class="ringface" />
          {#if bandTo != null && s.min != null && bandTo > s.min}
            {@const a0 = ang(s.min, g.scale)}
            {@const a1 = ang(bandTo, g.scale)}
            <!-- the round caps sit inside the band's ends, so it stops exactly at the published values -->
            <path d={a1 - a0 > 2 * CAP ? arc(a0 + CAP, a1 - CAP, 120) : arc(a0, a1, 120)} class="band" class:short={a1 - a0 <= 2 * CAP} />
            {#if s.openTop}
              <!-- open-ended ("45 or coarser"): an arrow past the scale's end, so the band doesn't read as stopping there (Muse WB1 G-7) -->
              {@const [tx, ty] = pt(a1 + 9, 120)}
              {@const [bx0, by0] = pt(a1 - 1, 111)}
              {@const [bx1, by1] = pt(a1 - 1, 129)}
              <path d="M{tx} {ty} L{bx0} {by0} L{bx1} {by1} Z" class="openarrow" />
            {/if}
          {/if}
          {#each ticks(g.scale) as t (t.v)}
            {@const a = ang(t.v, g.scale)}
            {@const [x0, y0] = pt(a, t.major ? 127 : 131)}
            {@const [x1, y1] = pt(a, 138)}
            <line x1={x0} y1={y0} x2={x1} y2={y1} class="tick" class:major={t.major} />
            {#if t.major}{@const [tx, ty] = pt(a, 104)}<text x={tx} y={ty + 4} text-anchor="middle" class="num up" style:transform="rotate({-ringTurn}deg)">{t.v}</text>{/if}
          {/each}
          {#if s.start != null || s.max === s.min}{@const [sx, sy] = pt(ang(s.start ?? s.min!, g.scale), 120)}<circle cx={sx} cy={sy} r="7" class="startdot" />{/if}
        </g>
        {#if single}<path d="M{C - 10} 0 L{C + 10} 0 L{C} 18 Z" class="index" />{/if}
        <circle cx={C} cy={C} r="66" class="hub" />
        <text x={C} y={C - 14} text-anchor="middle" class="hubk">{s.start != null || s.max === s.min ? 'set to' : s.openTop ? 'from' : 'between'}</text>
        <text x={C} y={C + 18} text-anchor="middle" class="hubv">{s.start != null ? s.start : s.openTop ? `${s.min}+` : rangeText(s).replace(' to ', '–')}</text>
        <text x={C} y={C + 38} text-anchor="middle" class="hubu">{g.stepless ? 'stepless dial' : `of ${g.scale[0]}–${g.scale[1]}`}</text>
      </svg>
      {@render legend(s.max !== s.min || !!s.openTop, s.start != null || s.max === s.min, false)}
      <p class="cap">Lower numbers grind finer. {single ? 'The dial is turned so the setting sits under the mark.' : `The band is the range the ${who} prints.`}</p>
    {:else if s && g.kind === 'turns' && s.min != null}
      {#if g.perTurn}
      <svg viewBox="-34 -14 388 262" class="knob" role="img" aria-label="{g.short} adjustment knob, one turn of {g.perTurn} {g.unit}: {headline(g, s)}{single ? ', with the knob turned to that position within the turn' : knobArc?.full ? `, with a full turn and the extra arc marked; it spans ${knobArc.turns} turns` : ', with the range shaded on the knob’s one-turn scale'}.">
        <circle cx="160" cy="122" r="108" class="bezel" />
        <g class="ring" style:transform="rotate({knobTurn}deg)" style:transform-origin="160px 122px">
          <circle cx="160" cy="122" r="96" class="ringface" />
            {#each Array.from({ length: g.perTurn }, (_, i) => i) as i (i)}
              {@const a = (i / g.perTurn!) * 360}
              {@const major = i % knobStep === 0}
              {@const [x0, y0] = pt(a, major ? 82 : 88, 160, 122)}
              {@const [x1, y1] = pt(a, 96, 160, 122)}
              <line x1={x0} y1={y0} x2={x1} y2={y1} class="tick" class:major />
              {#if major}{@const [tx, ty] = pt(a, 68, 160, 122)}<text x={tx} y={ty + 4} text-anchor="middle" class="num up" class:underl={i === 6 || i === 9} style:transform="rotate({-knobTurn}deg)">{i}</text>{/if}
            {/each}
        </g>
        {#if knobArc?.full}<circle cx="160" cy="122" r="102" class="kring" />{/if}
        {#if knobArc?.d}<path d={knobArc.d} class="karc" />{/if}
        {#if knobArc}
          {#each knobArc.ends as [x0, y0, x1, y1], i (i)}<line x1={x0} y1={y0} x2={x1} y2={y1} class="kend" class:bold={knobArc.full} />{/each}
          {#each knobArc.labels as l, i (i)}<text x={l.x} y={l.y} text-anchor={l.anchor} class="endv">{l.text}</text>{/each}
        {/if}
        {#if single}<path d="M150 2 L170 2 L160 20 Z" class="index" />{/if}
        <circle cx="160" cy="122" r="48" class="hub" />
        {#if g.perTurn && single}
          <text x="160" y="114" text-anchor="middle" class="hubk">{full === 0 ? 'first turn' : `${full} turn${full === 1 ? '' : 's'} +`}</text>
          <text x="160" y="144" text-anchor="middle" class="hubv">{rest}</text>
        {:else if knobArc?.full}
          <text x="160" y="110" text-anchor="middle" class="hubk">{knobArc.turns} turns</text>
          <text x="160" y="140" text-anchor="middle" class="hubv sm">{s.min}–{bandTo}</text>
          <text x="160" y="156" text-anchor="middle" class="hubu">{g.unit}</text>
        {:else}
          <text x="160" y="110" text-anchor="middle" class="hubk">one turn</text>
          <text x="160" y="140" text-anchor="middle" class="hubv sm">{g.perTurn}</text>
          <text x="160" y="156" text-anchor="middle" class="hubu">{g.unit}</text>
        {/if}
      </svg>
      {/if}
      <svg viewBox="0 0 320 128" class="ruler" class:solo={!g.perTurn} role="img" aria-label="On a ruler from 0 to {rulerMax} {g.unit}{turnMarks.length ? ', with each full turn marked' : ''}: {headline(g, s)}.">
        {#if turnMarks.length}<text x="20" y="12" class="turnlbl">turns</text>{/if}
        {#each turnMarks as v (v)}
          <line x1={rx(v)} y1="18" x2={rx(v)} y2="74" class="turnline" /><text x={rx(v)} y="12" text-anchor={v === rulerMax ? 'end' : 'middle'} class="turnlbl">{v / g.perTurn!}</text>
        {/each}
        <line x1="20" y1="54" x2="300" y2="54" class="rail" />
        {#if g.avoid}<rect x={rx(g.avoid[0])} y="40" width={rx(g.avoid[1]) - rx(g.avoid[0])} height="28" rx="2" class="avoid" />{/if}
        {#if bandTo != null && bandTo > s.min}
          {@const x0 = rx(s.min)}
          {@const x1 = rx(bandTo)}
          <rect x={x0} y="48" width={x1 - x0} height="12" rx="1" class="bandr" />
          <path d="M{x0 + 6} 42 L{x0} 42 L{x0} 66 L{x0 + 6} 66" class="brk" />
          {#if s.openTop}<path d="M{x1} 44 L{x1 + 10} 54 L{x1} 64 Z" class="openarrow" />{:else}<path d="M{x1 - 6} 42 L{x1} 42 L{x1} 66 L{x1 - 6} 66" class="brk" />{/if}
          {#if x1 - x0 >= (lowText(s).length + String(bandTo).length) * 3.6 + 14}
            <text x={x0} y="35" text-anchor="middle" class="endv">{lowText(s)}</text>
            <text x={x1} y="35" text-anchor={x1 > 296 ? 'end' : 'middle'} class="endv">{bandTo}</text>
          {:else}
            <text x={(x0 + x1) / 2} y="35" text-anchor="middle" class="endv">{lowText(s)}–{bandTo}</text>
          {/if}
        {/if}
        {#if single}<circle cx={rx(target ?? 0)} cy="54" r="7" class="startdot" /><text x={rx(target ?? 0)} y="35" text-anchor="middle" class="endv">{target}</text>{/if}
        {#each rulerTicks as v (v)}<line x1={rx(v)} y1="70" x2={rx(v)} y2="76" class="tick dark" /><text x={rx(v)} y="90" text-anchor="middle" class="num small">{v}</text>{/each}
        <text x="20" y="106" class="fine">← finer</text>
        <text x="300" y="106" text-anchor="end" class="fine">coarser →</text>
        <text x="160" y="124" text-anchor="middle" class="fine">{g.unit} from zero</text>
      </svg>
      {@render legend(s.max !== s.min, s.start != null || s.max === s.min, !!g.avoid, true)}
      <p class="cap">{knobCap}{g.rulerNote ? ` ${g.rulerNote}` : ''}</p>
    {:else if s && g.kind === 'named' && g.categories && namedOn}
      {@const n = g.categories.length}
      {@const sw = NW / n}
      <svg viewBox="0 0 340 124" class="strip" role="img" aria-label="{g.short}: {headline(g, s)}, on the maker's named steps from {g.categories[0]} to {g.categories[n - 1]}.">
        <defs><clipPath id="gc-strip"><rect x={NX} y="52" width={NW} height="30" rx="6" /></clipPath></defs>
        <rect x={NX} y="52" width={NW} height="30" rx="6" class="ringface" />
        <g clip-path="url(#gc-strip)">
          {#each grounds as d, i (i)}<circle cx={d.x} cy={d.y} r={d.r} class="ground" />{/each}
          {#each namedOn.alt as i (i)}<rect x={NX + i * sw + 1.5} y="53.5" width={sw - 3} height="27" rx="4" class="altseg" />{/each}
          <rect x={NX + namedOn.lo * sw} y="52" width={(namedOn.hi - namedOn.lo + 1) * sw} height="30" class="onseg" />
        </g>
        {#each Array.from({ length: n - 1 }, (_, i) => i + 1) as i (i)}<line x1={NX + i * sw} y1="52" x2={NX + i * sw} y2="82" class="divider" />{/each}
        {#if g.id.startsWith('capresso')}
          <!-- Capresso: four positions on the hopper within each named step -->
          {#each Array.from({ length: n * 4 }, (_, i) => i).filter((i) => i % 4 !== 0) as i (i)}<line x1={NX + (i * sw) / 4} y1="76" x2={NX + (i * sw) / 4} y2="82" class="subtick" />{/each}
        {/if}
        <path d="M{NX + namedOn.lo * sw + 2} 46 L{NX + namedOn.lo * sw + 2} 38 L{NX + (namedOn.hi + 1) * sw - 2} 38 L{NX + (namedOn.hi + 1) * sw - 2} 46" class="brk" />
        <text x={NX + ((namedOn.lo + namedOn.hi + 1) * sw) / 2} y="28" text-anchor="middle" class="endv">{namedOn.hi > namedOn.lo ? "maker's range" : "maker's step"}</text>
        {#each g.categories as c, i (c)}<text x={NX + (i + 0.5) * sw} y="99" text-anchor="middle" class="cat" class:on={namedOn.all.includes(i)}>{nice(c)}</text>{/each}
        <text x={NX} y="118" class="fine">← finer</text>
        <text x={NX + NW} y="118" text-anchor="end" class="fine">coarser →</text>
      </svg>
      <p class="cap">{g.id.startsWith('hario') ? 'Hario names steps, not clicks: turn the nut until the grounds look like the step.' : 'Capresso names four steps, each with four positions on the hopper.'}{namedOn.alt.length ? ' The outlined step is the alternative the maker gives.' : ''}</p>
    {:else if s}
      <div class="textcard" role="img" aria-label="{g.short}: {s.published}, exactly as the source writes it.">
        <p class="pubk">In the source's own notation</p>
        <p class="pub">{s.published}</p>
        {#if textNotes.length}<p class="pubn">{textNotes.join(' ')}</p>{/if}
      </div>
    {/if}
  </div>

  <div class="map">
    <p class="mapk">The {who}'s settings included here<span>{mapUnit}</span></p>
    <ul>
      {#each mapRows as r (r.key)}
        <li><button type="button" class="mrow" class:cur={r === s} aria-pressed={r === s} onclick={() => pickRow(r)}>
          <span class="ml">{r.label}</span><span class="mv">{#if r.categories && r.headline}{mapVal(r).split(' (')[0]}<small>{mapVal(r).split(' (').slice(1).join(' (').replace(/\)$/, '')}</small>{:else}{mapVal(r)}{/if}</span>
          {#if mapScale && r.min != null}
            <span class="mt" aria-hidden="true">
              {#if mapEnd(r) > r.min}<i class="mband" class:openband={r.openTop} style:left="{pc(r.min)}%" style:width="{Math.max(1.5, pc(mapEnd(r)) - pc(r.min))}%"></i>{/if}
              {#if isSingle(r)}<i class="mdot" style:left="{pc(r.start ?? r.min)}%"></i>{/if}
            </span>
          {:else if g.kind === 'named' && g.categories && r.categories}
            <span class="mt segs" aria-hidden="true">
              {#each g.categories as c (c)}<i class={r.categories.includes(c) ? (r.headline && c !== r.categories[0] ? 'segalt' : 'on') : 'mseg'}></i>{/each}
            </span>
          {/if}
        </button></li>
      {/each}
    </ul>
  </div>
  </div>

  <div class="answer" aria-live="polite">
    {#if badGrinder}<p class="asked">That link named a grinder this guide doesn't include, so this shows the {g.short}. Pick yours above.</p>{/if}
    {#if badMethod}<p class="asked">That link named a brew method this guide doesn't know, so this shows {GROUPS.find((x) => x.id === group)!.label.toLowerCase()}. Pick yours above.</p>{/if}
    {#if badSetting}<p class="asked">That link named a setting the {g.short} doesn't list for {GROUPS.find((x) => x.id === group)!.label.toLowerCase()}, so this shows the first one.</p>{/if}
    {#if askedFor && s}<p class="asked">The {g.short} has no included setting for {GROUPS.find((x) => x.id === askedFor)!.label.toLowerCase()}, so this shows {GROUPS.find((x) => x.id === group)!.label.toLowerCase()} instead. Pick another grinder to see {GROUPS.find((x) => x.id === askedFor)!.label.toLowerCase()}.</p>{/if}
    {#if s}
      <p class="kick">{g.short} · {s.label}{s.makerLabel ? ` (the maker's “${s.makerLabel}”)` : ''}</p>
      <h3>{nice(g.kind === 'turns' && g.perTurn ? countHeadline(g, s) : headline(g, s))}</h3>
      {#if s.note}<p class="snote">{s.note}</p>{/if}
      {#if turnsLine(g, s)}<p class="turnsl"><span>On the grinder</span>{turnsLine(g, s)}<em>{g.perTurn} {g.unit} per turn{g.sub ? `, ${g.sub}` : ''}</em></p>{/if}
      {#if ((g.kind === 'named' && (s.categories?.length ?? 0) > 1) || (g.kind !== 'named' && s.start == null && s.max !== s.min)) && g.kind !== 'text' && !s.headline}<p class="trans">The {who} prints a range, not one setting: start anywhere in it, then adjust by taste.</p>{/if}
      {#if others.length}
        <div class="more"><p class="morek">Also listed for {GROUPS.find((x) => x.id === group)!.label.toLowerCase()}</p>
          {#each others as r (r.key)}<button type="button" class="alt" onclick={() => pickRow(r)}><b>{r.label}</b> {mapVal(r)} →</button>{/each}
        </div>
      {/if}
      {#if g.startingPoint?.note}<p class="say">{g.startingPoint.note}</p>{/if}
      <p class="prov">{who === 'maker' ? `Published by ${brand}` : 'Secondary source'}{#if s.url}{' · '}<a href={s.url} rel="noopener" target="_blank" title={s.source ?? ''}>open the source</a>{/if}{s.checked ? `, checked ${s.checked}` : ''}.</p>
      {#if g.cautions.length}<div class="cbox"><p class="cauth">Cautions</p><ul class="cautions">{#each g.cautions as c (c)}<li>{c}</li>{/each}</ul></div>
      {:else}<p class="cbox nocaut"><span class="cauth">Cautions</span> None listed here; see the maker's manual.</p>{/if}
      {#if g.zeroNote}
        <details class="zero" open={g.kind === 'turns' || g.kind === 'text'}><summary>{g.kind === 'turns' ? 'Where zero is, and what one step does' : 'Where zero is'}</summary>
          <p>{g.zeroNote}</p>
          {#if g.stepNote}<p>{g.stepNote}</p>{:else if g.stepMicrons}<p>The maker says each click moves the burrs about {g.stepMicrons} µm. That's the burr movement, not the size of the grounds.</p>{/if}
        </details>
      {/if}
      <div class="actions">
        <a class="go" href="/tools/brew-ratio/?method={brew}">Brew it in the Brew Guide →</a>
        <a class="ghost" href="/tools/grind-guide/?method={brew}">How it should look</a>
        <a class="ghost" href="/tools/fix-my-coffee/?method={brew}">Tune it by taste</a>
      </div>
      {#if g.amazon}<p class="buy"><a href={g.amazon.url} rel="sponsored noopener" target="_blank">{g.short} on Amazon</a>: the exact model, checked {data.checked}. As an Amazon Associate we earn from qualifying purchases.</p>{/if}
    {:else}
      <p class="none">No verified setting for this method is included here.</p>
    {/if}
  </div>
</div>

<style>
  .gc { --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: 'stage pick' 'stage answer'; grid-template-rows: auto 1fr;
    background: var(--card); border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .pick { grid-area: pick; padding: 22px 24px 0; display: flex; flex-direction: column; gap: 14px; }
  .left { grid-area: stage; border-right: 1px solid var(--rule); background: radial-gradient(120% 60% at 50% 6%, #fffdf9 0%, #f1e7d9 85%); display: flex; flex-direction: column; min-width: 0; }
  .stage { padding: 32px 22px 18px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1 0 auto; }
  .answer { grid-area: answer; padding: 16px 24px 24px; display: flex; flex-direction: column; min-width: 0; }
  .dial, .knob { width: 100%; max-width: 340px; height: auto; }
  .ruler { width: 100%; max-width: 420px; height: auto; margin-top: 12px; }
  .ruler.solo { max-width: 520px; margin-top: 36px; }
  .strip { width: 100%; max-width: 520px; height: auto; margin-top: 18px; }
  .bezel { fill: #2a1d15; }
  .ringface { fill: #3a2a20; }
  .ring { transform-origin: 160px 160px; transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
  .tick { stroke: #cdbba6; stroke-width: 1; }
  .tick.major { stroke: #f3ede3; stroke-width: 2; }
  .tick.dark { stroke: #5b4a3d; }
  .num { font: 500 12.5px 'IBM Plex Mono', monospace; fill: #f3ede3; }
  .num.up { transform-box: fill-box; transform-origin: center; transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
  .num.underl { text-decoration: underline; }
  .num.small { fill: #5b4a3d; font-size: 11px; }
  .fine { font: 500 10.5px 'IBM Plex Mono', monospace; fill: #75655a; letter-spacing: .04em; }
  .band { fill: none; stroke: #c3873a; stroke-width: 12; stroke-linecap: round; opacity: .9; }
  .openarrow { fill: #c3873a; }
  .band.short { stroke-linecap: butt; }
  .karc { fill: none; stroke: #c3873a; stroke-width: 8; }
  .kend { stroke: #f3d7a8; stroke-width: 2.5; }
  .kring { fill: none; stroke: #c3873a; stroke-width: 3; opacity: .75; }
  .kend.bold { stroke: #c3873a; stroke-width: 5; stroke-linecap: round; }
  .startdot { fill: #fbf8f3; stroke: #c3873a; stroke-width: 4; }
  .index { fill: #c3873a; }
  .hub { fill: #fbf8f3; stroke: #d9cdbd; }
  .hubk { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; fill: #75655a; }
  .hubv { font: 400 34px 'Instrument Serif', Georgia, serif; fill: #2a1d15; }
  .hubv.sm { font-size: 28px; }
  .hubu { font: 400 10.5px 'IBM Plex Mono', monospace; fill: #75655a; }
  .rail { stroke: #9c8f82; stroke-width: 2; }
  .bandr { fill: #c3873a; opacity: .85; }
  .brk { fill: none; stroke: #8f5d22; stroke-width: 2; }
  .endv { font: 600 11.5px 'IBM Plex Mono', monospace; fill: #8f5d22; paint-order: stroke; stroke: #f8f1e7; stroke-width: 4px; stroke-linejoin: round; }
  .turnline { stroke: #2a1d15; stroke-width: 1; stroke-dasharray: 3 3; opacity: .4; }
  .turnlbl { font: 500 10px 'IBM Plex Mono', monospace; fill: #5b4a3d; }
  .avoid { fill: #b04a2a; opacity: .22; }
  .ground { fill: #e9dcc9; opacity: .5; }
  .onseg { fill: rgba(195, 135, 58, .5); stroke: #c3873a; stroke-width: 3; }
  .altseg { fill: none; stroke: #e9b56c; stroke-width: 1.5; stroke-dasharray: 4 3; }
  .divider { stroke: #f3ede3; stroke-opacity: .28; stroke-width: 1.5; }
  .subtick { stroke: #f3ede3; stroke-opacity: .35; stroke-width: 1; }
  .cat { font: 500 10.5px 'IBM Plex Mono', monospace; fill: #75655a; }
  .cat.on { fill: #2a1d15; font-weight: 600; }
  .legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 14px; margin: 10px 0 0; font: 400 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .legend span { display: inline-flex; align-items: center; gap: 6px; }
  .legend i { display: inline-block; box-sizing: border-box; }
  .k-band { width: 22px; height: 8px; border-radius: 4px; background: #c3873a; }
  .k-band.flat { height: 10px; border-radius: 0; border-left: 2px solid #8f5d22; border-right: 2px solid #8f5d22; }
  .k-start { width: 12px; height: 12px; border-radius: 50%; background: #fbf8f3; border: 3px solid #c3873a; }
  .k-avoid { width: 18px; height: 12px; border-radius: 2px; background: rgba(176, 74, 42, .3); }
  .cap { margin: 10px 0 0; font-size: 13px; color: var(--ink-3); text-align: center; max-width: 44ch; }
  .textcard { width: 100%; max-width: 380px; margin-top: 14px; padding: 22px 24px 20px; background: #fffdf8; border: 1px solid var(--rule); border-radius: 14px; text-align: center; box-shadow: 0 1px 0 #fff inset, 0 14px 30px -24px rgba(60, 35, 15, .45); }
  .pubk { margin: 0; font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-deep); }
  .pub { font: 400 48px/1.05 'Instrument Serif', Georgia, serif; margin: 10px 0 0; color: var(--ink); }
  .pubn { margin: 14px 0 0; padding-top: 12px; border-top: 1px dashed var(--rule); font-size: 13.5px; color: var(--ink-2); }

  .map { padding: 4px 22px 26px; }
  .mapk { margin: 0 0 6px; padding-top: 14px; border-top: 1px solid var(--rule); font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
  .mapk span { letter-spacing: .04em; text-transform: none; }
  .map ul { list-style: none; margin: 0; padding: 0; }
  .mrow { appearance: none; width: 100%; display: grid; grid-template-columns: 9em minmax(0, 1fr) 8em; grid-template-areas: 'ml mt mv'; gap: 4px 12px; align-items: center; text-align: left; background: none; border: 0; border-radius: 8px; padding: 7px 8px; min-height: 44px; cursor: pointer; font: inherit; color: var(--ink-2); }
  .mrow:hover { background: rgba(255, 255, 255, .6); }
  .mrow.cur { background: #fff; box-shadow: inset 0 0 0 1px var(--rule); color: var(--ink); }
  .ml { grid-area: ml; font-size: 14px; }
  .mrow.cur .ml { font-weight: 600; }
  .mv { grid-area: mv; font: 500 12.5px 'IBM Plex Mono', monospace; color: var(--ink-2); text-align: right; }
  .mt { grid-area: mt; position: relative; height: 14px; display: block; }
  .mt::before { content: ''; position: absolute; left: 0; right: 0; top: 6px; height: 2px; background: #ddd0bf; border-radius: 1px; }
  .mt i { position: absolute; display: block; }
  .mband { top: 3px; height: 8px; border-radius: 1px; background: #d7b98f; }
  .mrow.cur .mband { background: #c3873a; }
  .mband.openband { clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 50%, calc(100% - 6px) 100%, 0 100%); }
  .mdot { top: 2px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: #fbf8f3; border: 2.5px solid #b08a5a; box-sizing: border-box; }
  .mrow.cur .mdot { border-color: #c3873a; }
  .mt.segs { display: flex; gap: 2px; }
  .mt.segs::before { display: none; }
  .mt.segs i { position: static; flex: 1; margin-top: 3px; height: 8px; border-radius: 1px; background: #e6dccd; }
  .mt.segs i.on { background: #d7b98f; }
  .mrow.cur .mt.segs i.on { background: #c3873a; }
  .mt.segs i.segalt { background: none; box-shadow: inset 0 0 0 1.5px #c3873a; }

  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 8px; }
  .fld select { width: 100%; appearance: none; font: 500 16px 'IBM Plex Sans', sans-serif; padding: 10px 36px 10px 12px; border: 1px solid var(--rule); border-radius: 10px; color: var(--ink); min-height: 46px; cursor: pointer;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .chips button.off { opacity: .72; color: var(--ink-3); cursor: not-allowed; text-decoration: line-through; text-decoration-color: rgba(117, 101, 90, .5); }
  .why { margin: 8px 0 0; font-size: 12.5px; color: var(--ink-3); }
  .asked { margin: 0 0 10px; padding: 9px 12px; border-radius: 8px; background: #fff3e0; border: 1px solid #e9c48f; color: var(--ink); font-size: 14px; }
  .answer > :first-child { border-top: 1px solid var(--rule); padding-top: 14px; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  h3 { font: 400 34px/1.05 'Instrument Serif', Georgia, serif; margin: 6px 0 4px; }
  .trans { margin: 6px 0 0; color: var(--ink-2); font-size: 15px; }
  .turnsl { margin: 4px 0 2px; font: 500 15px/1.4 'IBM Plex Mono', monospace; color: var(--ink); }
  .turnsl span { display: block; font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .turnsl em { display: block; font: 400 13.5px 'IBM Plex Sans', sans-serif; font-style: normal; color: var(--ink-3); }
  .mv small { display: block; font: 400 11px/1.25 'IBM Plex Sans', sans-serif; color: var(--ink-3); }
  .snote { margin: 8px 0 0; padding: 8px 12px; border-radius: 8px; background: #f6efe5; color: var(--ink); font-size: 14.5px; }
  .applies { margin: -6px 0 0; font-size: 13px; color: var(--ink-3); }
  .more { margin: 10px 0 0; display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
  .morek { margin: 0; font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .alt { appearance: none; border: 1px dashed var(--rule); background: #fff; border-radius: 8px; padding: 6px 10px; min-height: 40px; font: 400 14px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; text-align: left; }
  .alt b { font-weight: 600; color: var(--ink); margin-right: 4px; }
  .say { margin: 12px 0 0; padding: 8px 12px; border-left: 3px solid var(--crema); background: #fff8ec; font-size: 14.5px; color: var(--ink-2); }
  .prov { margin: 10px 0 0; font-size: 13.5px; color: var(--ink-3); }
  .prov a, .buy a { color: var(--crema-deep); text-underline-offset: 3px; }
  .cbox { margin: 12px 0 0; }
  .nocaut { font-size: 14px; color: var(--ink-2); }
  .nocaut .cauth { margin-right: 6px; }
  .cauth { margin: 0; font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #8a4b16; }
  .cautions { margin: 4px 0 0; padding-left: 18px; font-size: 14px; color: var(--ink-2); list-style: disc; }
  .cautions li { margin: 2px 0; }
  details summary { cursor: pointer; font-weight: 600; color: var(--ink); min-height: 36px; display: flex; align-items: center; gap: 8px; list-style: none; }
  details summary::-webkit-details-marker { display: none; }
  details summary::before { content: '+'; display: inline-grid; place-items: center; width: 20px; height: 20px; border: 1px solid var(--rule); border-radius: 50%; font: 500 13px/1 'IBM Plex Mono', monospace; color: var(--crema-deep); flex: none; }
  details[open] summary::before { content: '–'; }
  .zero { margin-top: 10px; font-size: 14px; color: var(--ink-2); }
  .actions { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px; }
  .go { grid-column: 1 / -1; justify-content: center; background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 11px 16px; font: 600 14px/1.2 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { justify-content: center; text-align: center; border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 10px 13px; font: 500 14px/1.2 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .buy { margin: 12px 0 0; font-size: 12.5px; color: var(--ink-3); }
  .none { color: var(--ink-2); border-top: 1px solid var(--rule); padding-top: 14px; }
  button:focus-visible, a:focus-visible, select:focus-visible, summary:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 860px) {
    .gc { grid-template-columns: 1fr; grid-template-areas: 'pick' 'stage' 'answer' 'map'; grid-template-rows: auto auto auto auto; }
    .left { display: contents; }
    .stage { grid-area: stage; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 18px 16px; background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #f1e7d9 85%); }
    .map { grid-area: map; padding: 0 12px 20px; }
    .mrow { grid-template-columns: minmax(0, 1fr) auto; grid-template-areas: 'ml mv' 'mt mt'; gap: 2px 10px; }
    .pick { padding: 18px 16px 14px; }
    .dial, .knob { max-width: 280px; }
    .answer { padding: 0 16px 20px; }
    .answer > :first-child { border-top: 0; }
    h3 { font-size: 30px; }
    .num.small { font-size: 13px; }
    .fine, .turnlbl { font-size: 12px; }
    .endv { font-size: 13.5px; }
    .hubk { font-size: 12.5px; }
    .knob .num { font-size: 15px; }
    .legend { font-size: 13px; }
    .pub { font-size: 40px; }
  }
  @media (prefers-reduced-motion: reduce) { .ring, .num.up { transition: none; } }
</style>
