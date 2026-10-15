<script lang="ts">
  import { onMount } from 'svelte';
  import data from '../../data/grinders.json';
  import { GROUPS, settingsFor, groupsFor, rangeText, turnsText, headline, grinderById } from '../../lib/coffee/grinders.ts';
  import type { Grinder, Group, Setting } from '../../lib/coffee/grinders.ts';

  // Your grinder's own control, drawn and turned to the maker's starting setting for your brew.
  // Every number is the maker's, in the maker's unit; where the maker prints a range and no single
  // start, the band is shown and nothing is invented inside it.
  const grinders = data.grinders as unknown as Grinder[];
  const electric = grinders.filter((g) => g.type === 'electric'), hand = grinders.filter((g) => g.type === 'hand');

  let grinderId = $state<string>('baratza-encore');
  let group = $state<Group>('pourover');
  let mounted = $state(false);
  let g = $derived(grinderById(grinders, grinderId) ?? grinders[0]);
  let available = $derived(groupsFor(g));
  let rows = $derived(settingsFor(g, group));
  let s = $derived<Setting | null>(rows[0] ?? null);
  let brew = $derived(GROUPS.find((x) => x.id === group)!.brew);

  function pickGrinder(id: string) {
    grinderId = id;
    const gg = grinderById(grinders, id);
    // Keep the method if this grinder's maker publishes it; otherwise the first one it does.
    if (gg && !settingsFor(gg, group).length) group = groupsFor(gg)[0]?.id ?? group;
    try { localStorage.setItem('jayarr-grinder', id); } catch { /* storage unavailable */ }
  }
  onMount(() => {
    const q = new URLSearchParams(location.search);
    let saved: string | null = null;
    try { saved = localStorage.getItem('jayarr-grinder'); } catch { /* storage unavailable */ }
    const id = q.get('grinder') ?? saved;
    if (id && grinderById(grinders, id)) grinderId = id;
    const m = q.get('method') as Group | null;
    if (m && GROUPS.some((x) => x.id === m) && settingsFor(g, m).length) group = m;
    else if (!settingsFor(g, group).length) group = groupsFor(g)[0]?.id ?? group;
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    history.replaceState(history.state, '', `${location.pathname}?grinder=${g.id}&method=${group}`);
  });

  // ── Dial geometry: a 300° scale, top centre is the grinder's index mark ──
  const SWEEP = 300, R = 118, C = 160;
  const ang = (v: number, sc: [number, number]) => -SWEEP / 2 + ((v - sc[0]) / (sc[1] - sc[0])) * SWEEP;
  const pt = (a: number, r: number) => [C + r * Math.sin((a * Math.PI) / 180), C - r * Math.cos((a * Math.PI) / 180)];
  function arc(a0: number, a1: number, r: number) {
    const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r);
    return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  }
  function ticks(sc: [number, number]) {
    const span = sc[1] - sc[0];
    const major = span <= 16 ? 1 : span <= 60 ? 5 : 10, minor = span <= 16 ? (g.step === 0.25 ? 0.25 : 0) : span <= 60 ? 1 : 5;
    const out: { v: number; major: boolean }[] = [];
    const st = minor || major;
    for (let v = sc[0]; v <= sc[1] + 1e-9; v += st) out.push({ v: Math.round(v * 100) / 100, major: Math.abs(v / major - Math.round(v / major)) < 1e-9 || v === sc[0] });
    return out;
  }
  // Where the dial turns to: the maker's start, else the fine end of the band.
  let target = $derived(s && s.min != null ? (s.start ?? s.min) : null);
  let ringTurn = $derived(g.kind === 'dial' && g.scale && target != null ? -ang(target, g.scale) : 0);
  let bandTo = $derived(s && s.min != null ? (s.openTop ? g.scale?.[1] ?? s.min : s.max ?? s.min) : null);

  // ── Turns: a knob for one turn, and a ruler across all the turns ──
  let full = $derived(g.perTurn && target != null ? Math.floor(target / g.perTurn) : 0);
  let knobTurn = $derived(g.kind === 'turns' && g.perTurn && target != null ? -((target % g.perTurn) / g.perTurn) * 360 : 0);
  // A maker caution without its manual locator: 'Manual "Adjusting": …' → '…', ending in one full stop.
  const caution = (c: string) => c.replace(/^(Maker manual|Manual)[^:]*:\s*/i, '').replace(/^WARNING:\s*/i, '').replace(/\s*\((?:NZ )?manual[^)]*\)/gi, '').replace(/([^.!?"”])$/, '$1.').replace(/^./, (m) => m.toUpperCase());
  const rx = (v: number) => 14 + (v / (g.scale?.[1] ?? 1)) * 292;
  /** Round tick values across 0..max: about six to ten of them. */
  function niceTicks(max: number) {
    const step = [1, 2, 5, 10, 20, 25, 50, 100].find((st) => max / st <= 10) ?? 100;
    return Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);
  }
</script>

<div class="gc">
  <div class="stage" aria-hidden="false">
    {#if g.kind === 'dial' && g.scale && s}
      <svg viewBox="0 0 320 320" class="dial" role="img" aria-label="{g.short} dial: {headline(g, s)}, on the maker's {g.scale[0]} to {g.scale[1]} scale (lower is finer).">
        <circle cx={C} cy={C} r="150" class="bezel" />
        <g class="ring" style:transform="rotate({ringTurn}deg)">
          <circle cx={C} cy={C} r="136" class="ringface" />
          {#if bandTo != null && s.min != null}
            <path d={arc(ang(s.min, g.scale), Math.max(ang(bandTo, g.scale), ang(s.min, g.scale) + 2.2), R + 2)} class="band" class:openband={s.openTop} />
          {/if}
          {#each ticks(g.scale) as t (t.v)}
            {@const a = ang(t.v, g.scale)}
            {@const [x0, y0] = pt(a, t.major ? 126 : 130)}
            {@const [x1, y1] = pt(a, 136)}
            <line x1={x0} y1={y0} x2={x1} y2={y1} class="tick" class:major={t.major} />
            {#if t.major}{@const [tx, ty] = pt(a, 110)}<text x={tx} y={ty + 4} text-anchor="middle" class="num" transform="rotate({a} {tx} {ty})">{t.v}</text>{/if}
          {/each}
        </g>
        <path d="M{C - 9} 2 L{C + 9} 2 L{C} 18 Z" class="index" />
        <circle cx={C} cy={C} r="70" class="hub" />
        <text x={C} y={C - 12} text-anchor="middle" class="hubk">{s.start != null ? 'start' : s.openTop ? 'from' : s.max !== s.min ? 'between' : 'start'}</text>
        <text x={C} y={C + 20} text-anchor="middle" class="hubv">{s.start != null ? s.start : s.openTop ? `${s.min}+` : rangeText(s).replace(' to ', '–')}</text>
        <text x={C} y={C + 40} text-anchor="middle" class="hubu">{g.stepless ? 'stepless dial' : `${g.unit} ${g.scale[0]}–${g.scale[1]}`}</text>
      </svg>
      <p class="cap">Lower numbers grind finer. The dial is turned so the setting sits under the mark.</p>
    {:else if g.kind === 'turns' && g.scale && s && s.min != null}
      <div class="turns">
        {#if g.perTurn}
          <svg viewBox="0 0 320 250" class="knob" role="img" aria-label="{g.short}: {headline(g, s)}, which is {turnsText(target ?? 0, g)}.">
            <circle cx="160" cy="125" r="110" class="bezel" />
            <g class="ring" style:transform="rotate({knobTurn}deg)" style:transform-origin="160px 125px">
              <circle cx="160" cy="125" r="98" class="ringface" />
              {#each Array.from({ length: g.perTurn }, (_, i) => i) as i (i)}
                {@const a = (i / g.perTurn!) * 360}
                {@const major = g.perTurn! <= 12 || i % (g.perTurn! / (g.perTurn! >= 60 ? 6 : 9)) === 0}
                {@const r0 = major ? 86 : 91}
                <line x1={160 + r0 * Math.sin((a * Math.PI) / 180)} y1={125 - r0 * Math.cos((a * Math.PI) / 180)} x2={160 + 98 * Math.sin((a * Math.PI) / 180)} y2={125 - 98 * Math.cos((a * Math.PI) / 180)} class="tick" class:major />
                {#if major}<text x={160 + 72 * Math.sin((a * Math.PI) / 180)} y={125 - 72 * Math.cos((a * Math.PI) / 180) + 4} text-anchor="middle" class="num" transform="rotate({a} {160 + 72 * Math.sin((a * Math.PI) / 180)} {125 - 72 * Math.cos((a * Math.PI) / 180)})">{i}</text>{/if}
              {/each}
            </g>
            <path d="M151 6 L169 6 L160 22 Z" class="index" />
            <circle cx="160" cy="125" r="44" class="hub" />
            <text x="160" y="118" text-anchor="middle" class="hubk">{full === 0 ? 'from zero' : `${full} turn${full === 1 ? '' : 's'} +`}</text>
            <text x="160" y="146" text-anchor="middle" class="hubv">{Math.round(((target ?? 0) - full * (g.perTurn ?? 1)) * 100) / 100}</text>
          </svg>
        {/if}
        <svg viewBox="0 0 320 108" class="ruler" role="img" aria-label="{headline(g, s)}, on a ruler from 0 to {g.scale[1]} {g.unit} with each full turn marked.">
          {#if g.perTurn}
            {#each Array.from({ length: Math.floor(g.scale[1] / g.perTurn) }, (_, i) => (i + 1) * g.perTurn!) as v (v)}
              <line x1={rx(v)} y1="20" x2={rx(v)} y2="70" class="turnline" /><text x={rx(v)} y="14" text-anchor={v === g.scale[1] ? 'end' : 'middle'} class="turnlbl">{v / g.perTurn!} turn{v / g.perTurn! === 1 ? '' : 's'}</text>
            {/each}
          {/if}
          <line x1="14" y1="48" x2="306" y2="48" class="rail" />
          {#if g.avoid}<rect x={rx(g.avoid[0])} y="32" width={rx(g.avoid[1]) - rx(g.avoid[0])} height="32" class="avoid" /><text x={rx(g.avoid[0])} y="28" class="avoidlbl">avoid</text>{/if}
          <rect x={rx(s.min)} y="36" width={Math.max(4, rx(bandTo ?? s.min) - rx(s.min))} height="24" rx="4" class="bandr" />
          {#if s.start != null}<line x1={rx(s.start)} y1="28" x2={rx(s.start)} y2="68" class="needle" />{/if}
          {#each niceTicks(g.scale[1]) as v (v)}
            <line x1={rx(v)} y1="62" x2={rx(v)} y2="70" class="tick dark" /><text x={rx(v)} y="84" text-anchor="middle" class="num small">{v}</text>
          {/each}
          <text x="14" y="102" class="fine">← finer</text>
          <text x="306" y="102" text-anchor="end" class="fine">coarser →</text>
        </svg>
      </div>
    {:else if g.kind === 'named' && g.categories && s}
      <div class="named" role="img" aria-label="{g.short}: {headline(g, s)}, on the maker's named scale from {g.categories[0]} to {g.categories[g.categories.length - 1]}.">
        <p class="fine">finer</p>
        <ol>{#each g.categories as c (c)}<li class:on={s.categories?.includes(c)}><span>{c}</span></li>{/each}</ol>
        <p class="fine">coarser</p>
      </div>
    {:else if s}
      <div class="textcard"><p class="hubk">{g.short}, as published</p><p class="pub">{s.published}</p><p class="fine">The source writes this as turns of the dial plus a reference mark; it isn't converted here.</p></div>
    {/if}
  </div>

  <div class="panel">
    <label class="fld"><span class="lbl">Your grinder</span>
      <select value={g.id} onchange={(e) => pickGrinder((e.currentTarget as HTMLSelectElement).value)}>
        <optgroup label="Electric">{#each electric as x (x.id)}<option value={x.id}>{x.short}</option>{/each}</optgroup>
        <optgroup label="Hand grinders">{#each hand as x (x.id)}<option value={x.id}>{x.short}</option>{/each}</optgroup>
      </select>
    </label>
    <div class="fld"><span class="lbl">Brewing</span>
      <div class="chips" role="group" aria-label="Brew method">
        {#each GROUPS as m (m.id)}
          {@const has = available.some((x) => x.id === m.id)}
          <button type="button" aria-pressed={group === m.id} disabled={!has} title={has ? '' : `${g.short}: no setting published by the maker for ${m.label.toLowerCase()}`} onclick={() => (group = m.id)}>{m.label}</button>
        {/each}
      </div>
    </div>

    {#if s}
      <div class="answer" aria-live="polite">
        <p class="kick">{g.short} · {s.label}</p>
        <h3>{headline(g, s)}</h3>
        {#if g.kind === 'turns' && target != null && g.perTurn}<p class="trans">That's {turnsText(s.min ?? 0, g)}{s.max != null && s.max !== s.min ? ` to ${turnsText(s.max, g)}` : ''}.{g.sub ? ` ${g.sub[0].toUpperCase()}${g.sub.slice(1)}.` : ''}</p>{/if}
        {#if s.start == null && s.max !== s.min && g.kind !== 'text'}<p class="trans">The maker prints a range, not one setting: start anywhere in it, then adjust by taste.</p>{/if}
        {#if rows.length > 1}
          <ul class="more">{#each rows.slice(1) as r (r.key)}<li><b>{r.label}:</b> {rangeText(r)}{g.kind === 'turns' ? ` ${g.unit} from zero` : ''}{r.start != null && r.max !== r.min ? ` (start ${r.start})` : ''}</li>{/each}</ul>
        {/if}
        <p class="prov" class:sec={s.provenance !== 'maker'}>{s.provenance === 'maker' ? 'From the maker\'s own chart' : 'From a documented secondary source (no maker chart published)'}{s.url ? '' : '.'}{#if s.url} · <a href={s.url} rel="noopener" target="_blank" title={s.source ?? ''}>{s.provenance === 'maker' ? 'see the chart' : 'see the source'}</a>{/if}{s.checked ? `, checked ${s.checked}` : ''}</p>
        {#if g.startingPoint?.quote}<blockquote>“{g.startingPoint.quote.length > 220 ? `${g.startingPoint.quote.slice(0, 217)}…` : g.startingPoint.quote}”</blockquote>{/if}
        {#if g.cautions.length}<p class="cauth">The maker's cautions</p><ul class="cautions">{#each g.cautions.slice(0, 2) as c (c)}<li>{caution(c)}</li>{/each}</ul>{/if}
        <details class="zero"><summary>Where is zero, and how far is one step?</summary>
          <p>{g.zeroNote}</p>
          {#if g.stepMicrons}<p>The maker says each {g.unit === 'numbers' ? 'click' : g.unit.replace(/s$/, '')} moves the burrs about {g.stepMicrons} µm (a burr movement, not a particle size).</p>{/if}
        </details>
        <div class="actions">
          <a class="go" href="/tools/brew-ratio/?method={brew}">Brew it in the Brew Guide →</a>
          <a class="ghost" href="/tools/grind-guide/?method={brew === 'moka' ? 'moka' : brew}">What it should look like</a>
          <a class="ghost" href="/tools/fix-my-coffee/?method={brew}">Tune it by taste</a>
        </div>
        {#if g.amazon}<p class="buy"><a href={g.amazon.url} rel="sponsored noopener" target="_blank">{g.short} on Amazon</a>: the exact model, checked {data.checked}. As an Amazon Associate we earn from qualifying purchases.</p>{/if}
      </div>
    {:else}
      <p class="none">{g.short}'s maker doesn't publish a setting for this method.</p>
    {/if}

    <details class="all"><summary>All of the {g.short}'s published settings</summary>
      <table>
        <thead><tr><th scope="col">Method</th><th scope="col">Setting ({g.kind === 'named' ? 'category' : g.unit})</th><th scope="col">Source</th></tr></thead>
        <tbody>{#each g.settings as r (r.key)}<tr><th scope="row">{r.label}</th><td>{rangeText(r)}{r.start != null && r.max !== r.min ? ` (start ${r.start})` : ''}</td><td>{r.provenance === 'maker' ? 'Maker' : 'Secondary'}</td></tr>{/each}</tbody>
      </table>
    </details>
  </div>
</div>

<style>
  .gc { --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); background: var(--card); border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .stage { padding: 22px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #f1e7d9 85%); display: grid; place-items: center; min-height: 380px; }
  .dial, .knob { width: 100%; max-width: 360px; height: auto; }
  .ruler { width: 100%; max-width: 420px; height: auto; margin-top: 8px; }
  .turns { width: 100%; display: grid; justify-items: center; }
  .bezel { fill: #2a1d15; }
  .ringface { fill: #3a2a20; }
  .ring { transform-origin: 160px 160px; transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
  .tick { stroke: #cdbba6; stroke-width: 1; }
  .tick.major { stroke: #f3ede3; stroke-width: 2; }
  .num { font: 500 12px 'IBM Plex Mono', monospace; fill: #f3ede3; }
  .num.small { fill: #5b4a3d; font-size: 10.5px; }
  .fine { font: 500 10.5px 'IBM Plex Mono', monospace; fill: #9c8f82; letter-spacing: .08em; text-transform: uppercase; }
  .band { fill: none; stroke: #c3873a; stroke-width: 12; stroke-linecap: round; }
  .band.openband { stroke-dasharray: 3 3; }
  .index { fill: #c3873a; }
  .hub { fill: #fbf8f3; stroke: #d9cdbd; }
  .hubk { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; fill: #75655a; }
  .hubv { font: 400 36px 'Instrument Serif', Georgia, serif; fill: #2a1d15; }
  .hubu { font: 400 10.5px 'IBM Plex Mono', monospace; fill: #75655a; }
  .rail { stroke: #9c8f82; stroke-width: 2; }
  .bandr { fill: #c3873a; opacity: .85; }
  .needle { stroke: #2a1d15; stroke-width: 3; }
  .turnline { stroke: #2a1d15; stroke-width: 1; stroke-dasharray: 3 3; opacity: .5; }
  .turnlbl { font: 500 9.5px 'IBM Plex Mono', monospace; fill: #5b4a3d; }
  .avoid { fill: #9a3b1c; opacity: .15; }
  .avoidlbl { font: 500 9.5px 'IBM Plex Mono', monospace; fill: #9a3b1c; }
  .tick.dark { stroke: #5b4a3d; }
  .cap { margin: 8px 0 0; font-size: 13px; color: var(--ink-3); text-align: center; }
  .named { width: 100%; max-width: 420px; }
  .named ol { list-style: none; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 6px; margin: 8px 0; padding: 0; }
  .named li { border: 1px solid var(--rule); border-radius: 10px; background: #fff; padding: 18px 6px; text-align: center; font: 500 13px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .named li.on { background: var(--crema); color: #2a1d15; border-color: var(--crema-deep); }
  .named .fine { margin: 0; color: #75655a; }
  .named .fine:last-child { text-align: right; }
  .textcard { text-align: center; }
  .textcard .pub { font: 400 42px 'Instrument Serif', Georgia, serif; margin: 6px 0; }
  .textcard .fine { color: var(--ink-3); text-transform: none; letter-spacing: 0; font-size: 13px; max-width: 34ch; margin: 0 auto; }

  .panel { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 16px; min-width: 0; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 8px; }
  .fld select { width: 100%; appearance: none; font: 500 16px 'IBM Plex Sans', sans-serif; padding: 10px 36px 10px 12px; border: 1px solid var(--rule); border-radius: 10px; color: var(--ink); min-height: 46px; cursor: pointer;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .chips button:disabled { opacity: .42; cursor: not-allowed; text-decoration: line-through; text-decoration-color: rgba(117, 101, 90, .5); }
  .answer { border-top: 1px solid var(--rule); padding-top: 14px; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  h3 { font: 400 34px/1.05 'Instrument Serif', Georgia, serif; margin: 6px 0 4px; }
  .trans { margin: 6px 0 0; color: var(--ink-2); font-size: 15px; }
  .more { margin: 8px 0 0; padding-left: 18px; color: var(--ink-2); font-size: 14.5px; }
  .prov { margin: 12px 0 0; font-size: 13.5px; color: var(--ink-3); }
  .prov.sec { color: #8a4b16; }
  .prov a, .buy a { color: var(--crema-deep); text-underline-offset: 3px; }
  blockquote { margin: 10px 0 0; padding: 8px 12px; border-left: 3px solid var(--crema); background: #fff8ec; font-size: 14px; color: var(--ink-2); }
  .cauth { margin: 12px 0 0; font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #8a4b16; }
  .cautions { margin: 4px 0 0; padding-left: 18px; font-size: 13.5px; color: #8a4b16; }
  .zero { margin-top: 10px; font-size: 14px; color: var(--ink-2); }
  .zero summary, .all summary { cursor: pointer; font-weight: 600; color: var(--ink); min-height: 32px; display: flex; align-items: center; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .go { background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 12px 18px; font: 600 14.5px/1.2 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 10px 15px; font: 500 14px 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .buy { margin: 12px 0 0; font-size: 12.5px; color: var(--ink-3); }
  .none { color: var(--ink-2); }
  .all { border-top: 1px dashed var(--rule); padding-top: 8px; font-size: 14px; }
  .all table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .all th, .all td { text-align: left; padding: 6px 6px; border-bottom: 1px solid #e6dccd; font-size: 14px; }
  .all thead th { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .all td:nth-child(2) { font-family: 'IBM Plex Mono', monospace; }
  button:focus-visible, a:focus-visible, select:focus-visible, summary:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 860px) { .gc { grid-template-columns: 1fr; } .stage { border-right: 0; border-bottom: 1px solid var(--rule); min-height: 0; padding: 16px; } .panel { padding: 18px 16px 20px; } h3 { font-size: 30px; } .num.small { font-size: 12px; } }
  @media (prefers-reduced-motion: reduce) { .ring { transition: none; } }
</style>
