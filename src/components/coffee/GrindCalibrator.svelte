<script lang="ts">
  import { onMount } from 'svelte';
  import data from '../../data/grinders.json';
  import { GROUPS, settingsFor, groupsFor, rangeText, headline, grinderById } from '../../lib/coffee/grinders.ts';
  import type { Grinder, Group, Setting } from '../../lib/coffee/grinders.ts';

  // Your grinder's own control, drawn and turned to the maker's starting setting for your brew.
  // Every number is the maker's, in the maker's unit; where the maker prints only a range, the
  // band is shown and nothing is invented inside it.
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

  // Where the control turns to: the maker's start, else the fine end of the band.
  let target = $derived(s && s.min != null ? (s.start ?? s.min) : null);
  let bandTo = $derived(s && s.min != null ? (s.openTop ? g.scale?.[1] ?? s.min : s.max ?? s.min) : null);

  // ── Numbered dial: a 300° scale; top centre is the grinder's index mark ──
  const SWEEP = 300, C = 160;
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
  let single = $derived(!!s && (s.start != null || (s.min != null && s.max === s.min && !s.openTop)));
  let ringTurn = $derived(single && g.kind === 'dial' && g.scale && target != null ? -ang(target, g.scale) : 0);

  // ── Turn-counted grinders: a knob for one turn, and a ruler across the turns ──
  let full = $derived(g.perTurn && target != null ? Math.floor(target / g.perTurn + 1e-9) : 0);
  let rest = $derived(g.perTurn && target != null ? Math.round((target - full * g.perTurn) * 100) / 100 : target ?? 0);
  let knobTurn = $derived(single && g.kind === 'turns' && g.perTurn && target != null ? -(rest / g.perTurn) * 360 : 0);
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
    const st = [1, 2, 5, 10, 20, 25, 50, 100].find((x) => rulerMax / x <= 10) ?? 100;
    return Array.from({ length: Math.floor(rulerMax / st) + 1 }, (_, i) => i * st);
  });
  let turnMarks = $derived(g.perTurn ? Array.from({ length: Math.floor(rulerMax / g.perTurn) }, (_, i) => (i + 1) * g.perTurn!) : []);
  let knobStep = $derived(!g.perTurn ? 1 : g.perTurn >= 60 ? 10 : g.perTurn >= 30 ? 5 : 1);
</script>

{#snippet legend(range: boolean, start: boolean, avoid: boolean)}
  <p class="legend" aria-hidden="true">
    {#if range}<span><i class="k-band"></i>maker's range</span>{/if}
    {#if start}<span><i class="k-start"></i>maker's setting</span>{/if}
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
          <button type="button" aria-pressed={group === m.id} disabled={!has} title={has ? '' : `${g.short}: no maker setting for ${m.label.toLowerCase()} was found in our research`} onclick={() => (group = m.id)}>{m.label}</button>
        {/each}
      </div>
    </div>
  </div>

  <div class="stage">
    {#if s && g.kind === 'dial' && g.scale}
      <svg viewBox="0 0 320 320" class="dial" role="img" aria-label="{g.short} dial: {headline(g, s)}, on the maker's {g.scale[0]} to {g.scale[1]} scale (lower is finer).">
        <circle cx={C} cy={C} r="152" class="bezel" />
        <g class="ring" style:transform="rotate({ringTurn}deg)">
          <circle cx={C} cy={C} r="138" class="ringface" />
          <!-- end stops: the dial runs 300°, and the gap between the stops holds no settings -->
          <path d={arc(ang(g.scale[1], g.scale), ang(g.scale[0], g.scale) + 360, 129)} class="gap" />
          {#each [g.scale[0], g.scale[1]] as e (e)}{@const [x0, y0] = pt(ang(e, g.scale), 120)}{@const [x1, y1] = pt(ang(e, g.scale), 138)}<line x1={x0} y1={y0} x2={x1} y2={y1} class="stop" />{/each}
          {#if bandTo != null && s.min != null && bandTo > s.min}
            <path d={arc(ang(s.min, g.scale), ang(bandTo, g.scale), 120)} class="band" class:openband={s.openTop} />
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
      <p class="cap">Lower numbers grind finer. {single ? 'The dial is turned so the setting sits under the mark.' : 'The band is the range the source prints.'}</p>
    {:else if s && g.kind === 'turns' && s.min != null}
      <svg viewBox="0 0 320 236" class="knob" role="img" aria-label="{g.short} adjustment knob: {headline(g, s)}{single && g.perTurn ? ', with the knob turned to that position within the turn' : ''}.">
        <circle cx="160" cy="122" r="108" class="bezel" />
        <g class="ring" style:transform="rotate({knobTurn}deg)" style:transform-origin="160px 122px">
          <circle cx="160" cy="122" r="96" class="ringface" />
          {#if g.perTurn}
            {#each Array.from({ length: g.perTurn }, (_, i) => i) as i (i)}
              {@const a = (i / g.perTurn!) * 360}
              {@const major = i % knobStep === 0}
              {@const [x0, y0] = pt(a, major ? 82 : 88, 160, 122)}
              {@const [x1, y1] = pt(a, 96, 160, 122)}
              <line x1={x0} y1={y0} x2={x1} y2={y1} class="tick" class:major />
              {#if major}{@const [tx, ty] = pt(a, 68, 160, 122)}<text x={tx} y={ty + 4} text-anchor="middle" class="num up" class:underl={i === 6 || i === 9} style:transform="rotate({-knobTurn}deg)">{i}</text>{/if}
            {/each}
          {:else}
            <!-- no published clicks per turn: a plain knurled knob, so the drawing doesn't imply one -->
            {#each Array.from({ length: 36 }, (_, i) => i * 10) as a (a)}{@const [x0, y0] = pt(a, 88, 160, 122)}{@const [x1, y1] = pt(a, 96, 160, 122)}<line x1={x0} y1={y0} x2={x1} y2={y1} class="knurl" />{/each}
          {/if}
        </g>
        {#if single}<path d="M150 2 L170 2 L160 20 Z" class="index" />{/if}
        <circle cx="160" cy="122" r="48" class="hub" />
        {#if g.perTurn && single}
          <text x="160" y="114" text-anchor="middle" class="hubk">{full === 0 ? 'first turn' : `${full} turn${full === 1 ? '' : 's'} +`}</text>
          <text x="160" y="144" text-anchor="middle" class="hubv">{rest}</text>
        {:else}
          <text x="160" y="114" text-anchor="middle" class="hubk">{g.unit}</text>
          <text x="160" y="142" text-anchor="middle" class="hubv sm">{s.start ?? (s.max !== s.min ? `${s.min}–${s.max}` : s.min)}</text>
        {/if}
      </svg>
      <svg viewBox="0 0 320 104" class="ruler" role="img" aria-label="On a ruler from 0 to {rulerMax} {g.unit}{g.perTurn ? ', with each full turn marked' : ''}: {headline(g, s)}.">
        {#each turnMarks as v, i (v)}
          {@const lbl = i === 0 || rx(g.perTurn!) - rx(0) > 70 ? `${v / g.perTurn!} turn${v / g.perTurn! === 1 ? '' : 's'}` : `${v / g.perTurn!}`}
          <line x1={rx(v)} y1="18" x2={rx(v)} y2="66" class="turnline" /><text x={rx(v)} y="13" text-anchor={v === rulerMax ? 'end' : 'middle'} class="turnlbl">{lbl}</text>
        {/each}
        <line x1="20" y1="44" x2="300" y2="44" class="rail" />
        {#if g.avoid}<rect x={rx(g.avoid[0])} y="30" width={rx(g.avoid[1]) - rx(g.avoid[0])} height="28" rx="3" class="avoid" />{/if}
        {#if bandTo != null && bandTo > s.min}<rect x={rx(s.min)} y="36" width={rx(bandTo) - rx(s.min)} height="16" rx="8" class="bandr" />{/if}
        {#if s.start != null || s.max === s.min}<circle cx={rx(s.start ?? s.min)} cy="44" r="7" class="startdot" />{/if}
        {#each rulerTicks as v (v)}<line x1={rx(v)} y1="58" x2={rx(v)} y2="64" class="tick dark" /><text x={rx(v)} y="78" text-anchor="middle" class="num small">{v}</text>{/each}
        <text x="20" y="98" class="fine">← finer</text>
        <text x="160" y="98" text-anchor="middle" class="fine">{g.unit} from zero</text>
        <text x="300" y="98" text-anchor="end" class="fine">coarser →</text>
      </svg>
      {@render legend(s.max !== s.min, s.start != null || s.max === s.min, !!g.avoid)}
      <p class="cap">{g.rulerNote ?? 'Drawn just past the coarsest published setting; the maker publishes no maximum.'}</p>
    {:else if s && g.kind === 'named' && g.categories}
      <div class="named" role="img" aria-label="{g.short}: {headline(g, s)}, on the maker's named scale from {g.categories[0]} to {g.categories[g.categories.length - 1]}.">
        <svg viewBox="0 0 320 120" class="nut" aria-hidden="true">
          <circle cx="160" cy="60" r="54" class="bezel" /><circle cx="160" cy="60" r="44" class="ringface" />
          {#each Array.from({ length: 24 }, (_, i) => i * 15) as a (a)}{@const [x0, y0] = pt(a, 44, 160, 60)}{@const [x1, y1] = pt(a, 54, 160, 60)}<line x1={x0} y1={y0} x2={x1} y2={y1} class="knurl" />{/each}
          <circle cx="160" cy="60" r="22" class="hub" />
        </svg>
        <ol>{#each g.categories as c (c)}<li class:on={s.categories?.includes(c)}><span>{c.replace('-', '‑')}</span></li>{/each}</ol>
        <p class="ends"><span>← finer</span><span>coarser →</span></p>
        <p class="cap">{g.id.startsWith('hario') ? 'Hario names steps, not clicks: turn the nut until the grounds look like the step.' : 'Capresso names four steps, each with four positions on the hopper.'}</p>
      </div>
    {:else if s}
      <div class="textcard" role="img" aria-label="{g.short}: {s.published}, as published.">
        <svg viewBox="0 0 320 130" class="nut" aria-hidden="true"><circle cx="160" cy="65" r="56" class="bezel" /><circle cx="160" cy="65" r="44" class="ringface" /><circle cx="160" cy="65" r="22" class="hub" /><path d="M150 2 L170 2 L160 16 Z" class="index" /></svg>
        <p class="pub">{s.published}</p>
        <p class="cap">The source defines “1+4” as one full turn plus mark 4. It doesn't define decimal forms such as 3.5, so they're shown exactly as written.</p>
      </div>
    {/if}
  </div>

  <div class="answer" aria-live="polite">
    {#if s}
      <p class="kick">{g.short} · {s.label}{s.makerLabel ? ` (the maker's “${s.makerLabel}”)` : ''}</p>
      <h3>{headline(g, s)}</h3>
      {#if s.note}<p class="snote">{s.note}</p>{/if}
      {#if g.kind === 'turns' && g.perTurn}<p class="trans">On the maker's count that's {rangeText(s)} {g.unit} from zero, at {g.perTurn} {g.unit} per turn{g.sub ? ` (${g.sub})` : ''}.</p>{/if}
      {#if s.start == null && s.max !== s.min && g.kind !== 'text' && !s.headline}<p class="trans">The {s.provenance === 'maker' ? 'maker' : 'source'} prints a range, not one setting: start anywhere in it, then adjust by taste.</p>{/if}
      {#if rows.length > 1}
        <div class="more"><p class="morek">The maker also lists</p><ul>{#each rows.slice(1) as r (r.key)}<li><b>{r.label}:</b> {headline(g, r).replace(/^Start (at|between) /, '')}</li>{/each}</ul></div>
      {/if}
      {#if g.startingPoint?.note}<p class="say">{g.startingPoint.note}</p>{/if}
      <p class="prov">{s.provenance === 'maker' ? 'From the maker\'s own chart' : 'From a documented secondary source (no maker chart was found)'}{#if s.url}{' · '}<a href={s.url} rel="noopener" target="_blank" title={s.source ?? ''}>{s.provenance === 'maker' ? 'see the chart' : 'see the source'}</a>{/if}{s.checked ? `, checked ${s.checked}` : ''}.</p>
      {#if g.cautions.length}<div class="cbox"><p class="cauth">Cautions</p><ul class="cautions">{#each g.cautions as c (c)}<li>{c}</li>{/each}</ul></div>{/if}
      {#if g.kind !== 'named' && g.kind !== 'text'}
        <details class="zero"><summary>Where zero is, and what one step does</summary>
          <p>{g.zeroNote}</p>
          {#if g.stepNote}<p>{g.stepNote}</p>{:else if g.stepMicrons}<p>The maker says each click moves the burrs about {g.stepMicrons} µm. That's the burr movement, not the size of the grounds.</p>{/if}
        </details>
      {/if}
      <div class="actions">
        <a class="go" href="/tools/brew-ratio/?method={brew}">Brew it in the Brew Guide →</a>
        <a class="ghost" href="/tools/grind-guide/?method={brew}">What it should look like</a>
        <a class="ghost" href="/tools/fix-my-coffee/?method={brew}">Tune by taste</a>
      </div>
      {#if g.amazon}<p class="buy"><a href={g.amazon.url} rel="sponsored noopener" target="_blank">{g.short} on Amazon</a>: the exact model, checked {data.checked}. As an Amazon Associate we earn from qualifying purchases.</p>{/if}
    {:else}
      <p class="none">{g.short}'s maker doesn't publish a setting for this method.</p>
    {/if}
    <details class="all"><summary>All of the {g.short}'s published settings</summary>
      <table>
        <thead><tr><th scope="col">Method</th><th scope="col">Setting</th><th scope="col">Source</th></tr></thead>
        <tbody>{#each g.settings as r (r.key)}<tr><th scope="row">{r.label}</th><td>{headline(g, r).replace(/^Start (at|between) /, '').replace(/^As published: /, '')}</td><td>{r.provenance === 'maker' ? 'Maker' : 'Secondary'}</td></tr>{/each}</tbody>
      </table>
    </details>
  </div>
</div>

<style>
  .gc { --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22;
    display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); grid-template-areas: 'stage pick' 'stage answer'; grid-template-rows: auto 1fr;
    background: var(--card); border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; box-shadow: 0 30px 60px -40px rgba(60, 35, 15, .35); }
  .pick { grid-area: pick; padding: 22px 24px 0; display: flex; flex-direction: column; gap: 14px; }
  .stage { grid-area: stage; padding: 32px 22px; border-right: 1px solid var(--rule); background: radial-gradient(120% 90% at 50% 10%, #fffdf9 0%, #f1e7d9 85%); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }
  .answer { grid-area: answer; padding: 16px 24px 24px; display: flex; flex-direction: column; min-width: 0; }
  .dial, .knob { width: 100%; max-width: 340px; height: auto; }
  .ruler { width: 100%; max-width: 400px; height: auto; margin-top: 14px; }
  .nut { width: 160px; height: auto; margin: 0 auto 10px; display: block; }
  .bezel { fill: #2a1d15; }
  .ringface { fill: #3a2a20; }
  .gap { fill: none; stroke: #241811; stroke-width: 18; }
  .stop { stroke: #c3873a; stroke-width: 3; }
  .ring { transform-origin: 160px 160px; transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
  .tick { stroke: #cdbba6; stroke-width: 1; }
  .tick.major { stroke: #f3ede3; stroke-width: 2; }
  .tick.dark { stroke: #5b4a3d; }
  .knurl { stroke: #5b4a3d; stroke-width: 2; }
  .num { font: 500 12.5px 'IBM Plex Mono', monospace; fill: #f3ede3; }
  .num.up { transform-box: fill-box; transform-origin: center; transition: transform .8s cubic-bezier(.2, .7, .2, 1); }
  .num.underl { text-decoration: underline; }
  .num.small { fill: #5b4a3d; font-size: 11px; }
  .fine { font: 500 10.5px 'IBM Plex Mono', monospace; fill: #75655a; letter-spacing: .04em; }
  .band { fill: none; stroke: #c3873a; stroke-width: 12; stroke-linecap: round; opacity: .9; }
  .band.openband { stroke-dasharray: 10 4; }
  .startdot { fill: #fbf8f3; stroke: #c3873a; stroke-width: 4; }
  .index { fill: #c3873a; }
  .hub { fill: #fbf8f3; stroke: #d9cdbd; }
  .hubk { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; fill: #75655a; }
  .hubv { font: 400 34px 'Instrument Serif', Georgia, serif; fill: #2a1d15; }
  .hubv.sm { font-size: 26px; }
  .hubu { font: 400 10.5px 'IBM Plex Mono', monospace; fill: #75655a; }
  .rail { stroke: #9c8f82; stroke-width: 2; }
  .bandr { fill: #c3873a; opacity: .85; }
  .turnline { stroke: #2a1d15; stroke-width: 1; stroke-dasharray: 3 3; opacity: .45; }
  .turnlbl { font: 500 10px 'IBM Plex Mono', monospace; fill: #5b4a3d; }
  .avoid { fill: #b04a2a; opacity: .22; }
  .legend { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 14px; margin: 12px 0 0; font: 400 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .legend span { display: inline-flex; align-items: center; gap: 6px; }
  .legend i { display: inline-block; }
  .k-band { width: 22px; height: 8px; border-radius: 4px; background: #c3873a; }
  .k-start { width: 12px; height: 12px; border-radius: 50%; background: #fbf8f3; border: 3px solid #c3873a; box-sizing: border-box; }
  .k-avoid { width: 18px; height: 12px; border-radius: 2px; background: rgba(176, 74, 42, .3); }
  .cap { margin: 10px 0 0; font-size: 13px; color: var(--ink-3); text-align: center; max-width: 40ch; }
  .named { width: 100%; max-width: 420px; }
  .named ol { list-style: none; display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 6px; margin: 6px 0 0; padding: 0; }
  .named li { border: 1px solid var(--rule); border-radius: 10px; background: #fff; padding: 16px 4px; text-align: center; font: 500 12.5px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .named li.on { background: var(--crema); color: #2a1d15; border-color: var(--crema-deep); }
  .ends { display: flex; justify-content: space-between; margin: 6px 0 0; font: 500 11px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .textcard { text-align: center; }
  .textcard .pub { font: 400 40px 'Instrument Serif', Georgia, serif; margin: 2px 0 0; }

  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin-bottom: 8px; }
  .fld select { width: 100%; appearance: none; font: 500 16px 'IBM Plex Sans', sans-serif; padding: 10px 36px 10px 12px; border: 1px solid var(--rule); border-radius: 10px; color: var(--ink); min-height: 46px; cursor: pointer;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .chips button:disabled { opacity: .42; cursor: not-allowed; text-decoration: line-through; text-decoration-color: rgba(117, 101, 90, .5); }
  .answer > :first-child { border-top: 1px solid var(--rule); padding-top: 14px; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--crema-deep); margin: 0; }
  h3 { font: 400 34px/1.05 'Instrument Serif', Georgia, serif; margin: 6px 0 4px; }
  .trans { margin: 6px 0 0; color: var(--ink-2); font-size: 15px; }
  .snote { margin: 8px 0 0; padding: 8px 12px; border-radius: 8px; background: #f6efe5; color: var(--ink); font-size: 14.5px; }
  .applies { margin: -6px 0 0; font-size: 13px; color: var(--ink-3); }
  .more { margin: 10px 0 0; padding: 8px 12px; border: 1px dashed var(--rule); border-radius: 10px; }
  .morek { margin: 0 0 4px; font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .more ul { margin: 0; padding-left: 18px; font-size: 14.5px; color: var(--ink-2); }
  .say { margin: 12px 0 0; padding: 8px 12px; border-left: 3px solid var(--crema); background: #fff8ec; font-size: 14.5px; color: var(--ink-2); }
  .prov { margin: 10px 0 0; font-size: 13.5px; color: var(--ink-3); }
  .prov a, .buy a { color: var(--crema-deep); text-underline-offset: 3px; }
  .cbox { margin: 12px 0 0; }
  .cauth { margin: 0; font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: #8a4b16; }
  .cautions { margin: 4px 0 0; padding-left: 18px; font-size: 14px; color: var(--ink-2); list-style: disc; }
  .cautions li { margin: 2px 0; }
  details summary { cursor: pointer; font-weight: 600; color: var(--ink); min-height: 36px; display: flex; align-items: center; gap: 8px; list-style: none; }
  details summary::-webkit-details-marker { display: none; }
  details summary::before { content: '+'; display: inline-grid; place-items: center; width: 20px; height: 20px; border: 1px solid var(--rule); border-radius: 50%; font: 500 13px/1 'IBM Plex Mono', monospace; color: var(--crema-deep); flex: none; }
  details[open] summary::before { content: '–'; }
  .zero { margin-top: 10px; font-size: 14px; color: var(--ink-2); }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  .go { background: var(--ink); color: #f3ede3; border-radius: 999px; padding: 11px 16px; font: 600 14px/1.2 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .ghost { border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 10px 13px; font: 500 14px 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; }
  .buy { margin: 12px 0 0; font-size: 12.5px; color: var(--ink-3); }
  .none { color: var(--ink-2); border-top: 1px solid var(--rule); padding-top: 14px; }
  .all { border-top: 1px dashed var(--rule); padding-top: 8px; margin-top: 14px; font-size: 14px; }
  .all table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  .all th, .all td { text-align: left; padding: 6px 6px; border-bottom: 1px solid #e6dccd; font-size: 14px; }
  .all thead th { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  button:focus-visible, a:focus-visible, select:focus-visible, summary:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 860px) {
    .gc { grid-template-columns: 1fr; grid-template-areas: 'pick' 'stage' 'answer'; grid-template-rows: auto auto auto; }
    .pick { padding: 18px 16px 14px; }
    .stage { border-right: 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); padding: 18px 16px; }
    .dial, .knob { max-width: 280px; }
    .answer { padding: 0 16px 20px; }
    .answer > :first-child { border-top: 0; }
    h3 { font-size: 30px; }
    .num.small { font-size: 12px; }
  }
  @media (prefers-reduced-motion: reduce) { .ring, .num.up { transition: none; } }
</style>
