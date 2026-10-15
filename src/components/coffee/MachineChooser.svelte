<script lang="ts">
  import { onMount } from 'svelte';
  import data from '../../data/machines.json';
  import { chooseMachines, setupBand, fitsCounter, needsGrinder, bandText, CATEGORY_LABEL } from '../../lib/coffee/machines.ts';
  import type { Machine, GrinderPrice, Needs, Category, Heating } from '../../lib/coffee/machines.ts';

  // Choose a machine for your counter, budget (grinder included), milk and effort; then, if you own
  // one, what its maker says about dose, temperature and care. Every spec is the maker's, dated.
  type Owner = { dose?: string | null; recipe?: string | null; baskets?: string | null; temperature?: string | null; descale?: string | null; clean?: string | null };
  type M = Machine & { fullName?: string; owner?: Owner | null };
  const machines = data.machines as unknown as M[];
  const grinders = data.grinders as unknown as GrinderPrice[];
  const byId = (id: string | null) => (id ? machines.find((m) => m.id === id) ?? null : null);

  let mode = $state<'find' | 'own' | 'all'>('find');
  let milk = $state<Needs['milk']>('some');
  let cups = $state<Needs['cups']>(3);
  let effort = $state<Needs['effort']>('guided');
  let budget = $state(1200);
  let unitsIn = $state(true);
  let widthIn = $state<number | null>(null);
  let heightIn = $state<number | null>(null);
  let ownId = $state<string>('breville-bambino-bes450');
  let mounted = $state(false);

  const toCm = (v: number | null) => (v == null || !Number.isFinite(v) || v <= 0 ? null : unitsIn ? v * 2.54 : v);
  let needs = $derived<Needs>({ milk, cups, effort, budget, widthCm: toCm(widthIn), heightCm: toCm(heightIn) });
  let matches = $derived(chooseMachines(machines, grinders, needs));
  // When nothing fits, say what would: the cheapest fit with the same routine and counter, at any budget.
  let nearest = $derived(matches.length ? null : chooseMachines(machines, grinders, { ...needs, budget: Infinity }, 1)[0] ?? null);
  let own = $derived(byId(ownId) ?? machines[0]);

  const HEAT: Record<Heating, string> = { thermoblock: 'Thermoblock', 'single-boiler': 'Single boiler', 'heat-exchanger': 'Heat exchanger', 'dual-boiler': 'Dual boiler', none: 'No boiler' };
  const HEAT_KEY: Record<string, string> = { thermoblock: 'thermoblock', 'single-boiler': 'singleBoiler', 'heat-exchanger': 'heatExchanger', 'dual-boiler': 'dualBoiler' };
  const MILK: Record<string, string> = { none: 'No milk system', 'manual-wand': 'Manual steam wand', panarello: 'Frothing wand', 'auto-wand': 'Automatic steam wand', carafe: 'Automatic milk system' };
  const heatLabel = (m: M) => (m.heating.system ? HEAT[m.heating.system] : 'Not established');
  // The maker's own name for its heater, without the research's parenthetical detail ("ThermoJet", "Thermocoil").
  const shortTerm = (m: M) => {
    const t = (m.heating.makerTerm ?? '').replace(/\s*\(.*$/, '').replace(/®|™/g, '').replace(/\s*heating system/i, '').trim();
    return m.heating.system && t && !/^(dual boiler|single boiler|heat exchanger|thermoblock|system with heat exchanger)$/i.test(t) ? t : '';
  };
  const fmtDate = (iso?: string | null) => (iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');
  const money = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
  const grinderPrices = grinders.map((g) => g.usd).filter((n): n is number => n != null).sort((a, b) => a - b);
  const sizeText = (m: M) => (m.dims ? (unitsIn ? `${(m.dims.w / 2.54).toFixed(1)} × ${(m.dims.d / 2.54).toFixed(1)} × ${(m.dims.h / 2.54).toFixed(1)} in` : `${m.dims.w} × ${m.dims.d} × ${m.dims.h} cm`) : 'Size not established');
  const statusNote = (m: M) => (m.status === 'discontinued' ? 'Discontinued by the maker' : m.status === 'unconfirmed' ? 'Not confirmed as a current US model' : m.status === 'replaced' ? 'Replaced by a newer model' : '');
  const brands = [...new Set(machines.map((m) => m.brand))].sort();
  // Model codes only (BES450, EC260), not the research's notes about them.
  const modelCodes = (m: M) => m.models.filter((c) => /^[A-Z0-9][A-Z0-9.\-]{1,14}$/i.test(c) && /\d/.test(c)).join(', ');
  // Phones get a narrower counter so the machines and their labels stay readable.
  let narrow = $state(false);
  const CATS: Category[] = ['capsule', 'super-auto', 'semi-auto-grinder', 'semi-auto', 'manual-lever'];

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const md = q.get('mode');
    if (md === 'own' || md === 'all' || md === 'find') mode = md;
    const mi = q.get('milk'); if (mi === 'none' || mi === 'some' || mi === 'most') milk = mi;
    const c = Number(q.get('cups')); if (c === 1 || c === 3 || c === 5) cups = c;
    const ef = q.get('effort'); if (ef === 'button' || ef === 'guided' || ef === 'hands-on') effort = ef;
    const b = Number(q.get('budget')); if (Number.isFinite(b) && b >= 100 && b <= 10000) budget = b;
    if (q.get('units') === 'cm') unitsIn = false;
    const w = Number(q.get('w')); if (w > 0) widthIn = w;
    const h = Number(q.get('h')); if (h > 0) heightIn = h;
    const m = q.get('m'); if (byId(m)) ownId = m!;
    const mq = matchMedia('(max-width: 640px)'); narrow = mq.matches; mq.addEventListener('change', (e) => (narrow = e.matches));
    mounted = true;
  });
  $effect(() => {
    if (!mounted) return;
    const q = new URLSearchParams();
    q.set('mode', mode);
    if (mode === 'find') {
      q.set('milk', milk); q.set('cups', String(cups)); q.set('effort', effort); q.set('budget', String(budget));
      if (!unitsIn) q.set('units', 'cm');
      if (widthIn) q.set('w', String(widthIn)); if (heightIn) q.set('h', String(heightIn));
    }
    if (mode === 'own') q.set('m', ownId);
    history.replaceState(history.state, '', `${location.pathname}?${q}`);
  });
  function openOwn(id: string) { ownId = id; mode = 'own'; scrollTo({ top: (document.querySelector('.mc') as HTMLElement | null)?.offsetTop ?? 0, behavior: 'smooth' }); }

  // ── The counter: matches side by side at one scale, beside your cabinets ──
  let CW = $derived(narrow ? 360 : 640);
  const CH = 300, FLOOR = 250;
  let counter = $derived.by(() => {
    const items = matches.map((x) => x.machine);
    const dims = items.map((m) => m.dims ?? { w: 28, d: 40, h: 34 });
    const totalW = dims.reduce((a, d) => a + d.w, 0) + 18 * Math.max(0, items.length - 1);
    const tallest = Math.max(50, ...dims.map((d) => d.h), needs.heightCm ?? 0);
    const scale = Math.min((CW - 80) / Math.max(totalW, 60), (FLOOR - 30) / tallest);
    let x = (CW - totalW * scale) / 2;
    const placed = items.map((m, i) => { const d = dims[i]; const r = { m, x, w: d.w * scale, h: d.h * scale, known: !!m.dims }; x += d.w * scale + 18 * scale; return r; });
    return { placed, scale };
  });

  // ── Heating explainer: step through how each system brews and steams ──
  let heatTab = $state<string>('thermoblock');
  let step = $state(0);
  let playing = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;
  // Each system's sequence in plain words, from the research's explainers (makers' manuals and technical pages),
  // with the path each step lights: heating, brewing, steaming, both at once, or waiting.
  type Phase = 'heat' | 'brew' | 'steam' | 'both' | 'wait';
  const SEQ: Record<string, [Phase, string][]> = {
    thermoblock: [
      ['heat', 'The heater brings water up to brewing temperature, and the machine shows it is ready.'],
      ['brew', 'Pull the shot.'],
      ['wait', 'Switch to steam. The same heater gets hotter: wait for the steam-ready signal, and purge the wand as your manual says.'],
      ['steam', 'Steam the milk, then stop, wipe and purge the wand.'],
      ['wait', 'Switch back to brewing. The machine returns to brewing temperature, automatically on some designs, before the next shot.'],
    ],
    'single-boiler': [
      ['heat', 'The boiler heats to brewing temperature. On a thermostat machine, some people time each shot to the same point in the heating cycle: temperature surfing.'],
      ['brew', 'Pull the shot.'],
      ['wait', 'Switch to steam. The boiler heats further: purge the wand and wait for the ready signal.'],
      ['steam', 'Steam the milk, then turn the steam off and purge the wand.'],
      ['wait', 'Refill and cool the boiler as your manual directs before the next shot; never brew at steam temperature.'],
    ],
    'heat-exchanger': [
      ['heat', 'The boiler heats to steam temperature. Brew water runs through its own tube inside it, the heat exchanger, so the two never mix.'],
      ['wait', 'Some machines want a short cooling flush before the shot: only if your manual says so.'],
      ['both', 'Pull the shot, and steam milk at the same time if you like.'],
      ['heat', 'Stop each one when it is done. There is no switching between brewing and steaming.'],
    ],
    'dual-boiler': [
      ['heat', 'Both boilers heat, each to its own temperature.'],
      ['brew', 'Pull the shot from the brew boiler.'],
      ['both', 'Steam from the steam boiler, at the same time if your machine supports it, as the Breville Dual Boiler does.'],
      ['heat', 'Each boiler keeps its own temperature, so there is no switching between them.'],
    ],
  };
  let seq = $derived(SEQ[heatTab] ?? []);
  let steps = $derived(seq.map(([, t]) => t));
  let ph = $derived<Phase>(seq[step]?.[0] ?? 'heat');
  function play() {
    if (playing) { stop(); return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { step = (step + 1) % steps.length; return; }
    playing = true; step = 0;
    timer = setInterval(() => { if (step >= steps.length - 1) stop(); else step += 1; }, 2600);
  }
  function stop() { playing = false; if (timer) clearInterval(timer); timer = null; }
  function pickHeat(k: string) { stop(); heatTab = k; step = 0; }
  // In "I own one", the explainer follows your machine's heating system.
  $effect(() => { if (mode === 'own' && own.heating.system && HEAT_KEY[own.heating.system] && heatTab !== own.heating.system) { stop(); heatTab = own.heating.system; step = 0; } });
  const SIMUL: Record<string, string> = {
    thermoblock: 'One after the other: one heater switches between brew and steam.',
    'single-boiler': 'One after the other: one boiler has to change temperature in between.',
    'heat-exchanger': 'At the same time, by design: brew water runs through its own circuit.',
    'dual-boiler': 'At the same time where the maker says so: each boiler keeps its own temperature.',
  };
</script>

{#snippet machineShape(m: M, x: number, w: number, h: number, known: boolean)}
  {@const y = FLOOR - h}
  <g class="mach" class:unknown={!known}>
    {#if m.category === 'capsule'}
      <rect x={x} y={y} width={w} height={h} rx={Math.min(10, w / 5)} class="body" />
      <rect x={x + w * 0.2} y={y + h * 0.62} width={w * 0.6} height={h * 0.06} rx="2" class="detail" />
      <circle cx={x + w / 2} cy={y + h * 0.2} r={Math.min(w, h) * 0.12} class="detail" />
    {:else if m.category === 'super-auto'}
      <rect x={x} y={y} width={w} height={h} rx="8" class="body" />
      <rect x={x + w * 0.22} y={y + h * 0.12} width={w * 0.56} height={h * 0.14} rx="3" class="screen" />
      <rect x={x + w * 0.38} y={y + h * 0.42} width={w * 0.24} height={h * 0.08} rx="2" class="detail" />
      <rect x={x + w * 0.15} y={y + h * 0.86} width={w * 0.7} height={h * 0.06} rx="2" class="detail" />
    {:else if m.category === 'manual-lever'}
      <rect x={x + w * 0.1} y={y + h * 0.82} width={w * 0.8} height={h * 0.18} rx="4" class="body" />
      <rect x={x + w * 0.42} y={y + h * 0.15} width={w * 0.16} height={h * 0.67} rx="3" class="body" />
      <line x1={x + w * 0.5} y1={y + h * 0.18} x2={x + w * 0.95} y2={y} class="lever" />
    {:else}
      <rect x={x} y={y} width={w} height={h} rx="7" class="body" />
      <rect x={x + w * 0.3} y={y + h * 0.36} width={w * 0.4} height={h * 0.07} rx="2" class="detail" />
      <line x1={x + w * 0.5} y1={y + h * 0.43} x2={x + w * 0.5 + w * 0.42} y2={y + h * 0.47} class="handle" />
      <rect x={x + w * 0.1} y={y + h * 0.88} width={w * 0.8} height={h * 0.05} rx="2" class="detail" />
      {#if m.milk.type && m.milk.type !== 'none'}<line x1={x + w * 0.9} y1={y + h * 0.3} x2={x + w * 1.0} y2={y + h * 0.66} class="wand" />{/if}
      {#if m.category === 'semi-auto-grinder'}<path d="M{x + w * 0.12} {y} L{x + w * 0.3} {y - h * 0.22} L{x + w * 0.48} {y} Z" class="hopper" />{/if}
    {/if}
  </g>
{/snippet}

<div class="mc">
  <div class="modes" role="tablist" aria-label="What you want to do">
    <button type="button" role="tab" aria-selected={mode === 'find'} onclick={() => (mode = 'find')}>Find a machine</button>
    <button type="button" role="tab" aria-selected={mode === 'own'} onclick={() => (mode = 'own')}>I own one</button>
    <button type="button" role="tab" aria-selected={mode === 'all'} onclick={() => (mode = 'all')}>Every machine</button>
  </div>

  {#if mode === 'find'}
    <div class="find">
      <form class="ask" onsubmit={(e) => e.preventDefault()} aria-label="Your routine">
        <fieldset><legend class="lbl">Milk in your drinks</legend>
          <div class="chips">
            {#each [['none', 'Never'], ['some', 'Sometimes'], ['most', 'Most of them']] as [v, l] (v)}<button type="button" aria-pressed={milk === v} onclick={() => (milk = v as Needs['milk'])}>{l}</button>{/each}
          </div>
        </fieldset>
        <fieldset><legend class="lbl">Drinks on a usual morning</legend>
          <div class="chips">
            {#each [[1, 'One'], [3, 'Two or three'], [5, 'Four or more']] as [v, l] (v)}<button type="button" aria-pressed={cups === v} onclick={() => (cups = v as Needs['cups'])}>{l}</button>{/each}
          </div>
        </fieldset>
        <fieldset><legend class="lbl">How hands-on</legend>
          <div class="effort">
            {#each [['button', 'Push a button', 'Capsules or bean-to-cup: no grinding or tamping'], ['guided', 'Guide me', 'A built-in grinder and presets; you still make the shot'], ['hands-on', 'By hand', 'Grind, dose, tamp and steam yourself']] as [v, l, d] (v)}
              <button type="button" aria-pressed={effort === v} onclick={() => (effort = v as Needs['effort'])}><b>{l}</b><small>{d}</small></button>
            {/each}
          </div>
        </fieldset>
        <fieldset><legend class="lbl">Budget, grinder included</legend>
          <div class="budget">
            <output for="budget-range" class="bval">{money(budget)}</output>
            <input id="budget-range" type="range" min="150" max="5000" step="50" bind:value={budget} aria-label="Budget in US dollars, grinder included" />
            <div class="chips sm">{#each [300, 700, 1200, 2500] as v (v)}<button type="button" aria-pressed={budget === v} onclick={() => (budget = v)}>{money(v)}</button>{/each}</div>
          </div>
        </fieldset>
        <fieldset><legend class="lbl">Your counter <span class="opt">(optional)</span></legend>
          <div class="space">
            <label><span>Width you have</span><input type="number" inputmode="decimal" min="1" step="0.5" bind:value={widthIn} placeholder="any" /><span class="u">{unitsIn ? 'in' : 'cm'}</span></label>
            <label><span>Height under cabinets</span><input type="number" inputmode="decimal" min="1" step="0.5" bind:value={heightIn} placeholder="any" /><span class="u">{unitsIn ? 'in' : 'cm'}</span></label>
            <div class="seg" role="group" aria-label="Units"><button type="button" aria-pressed={unitsIn} onclick={() => { if (!unitsIn) { widthIn = widthIn ? Math.round((widthIn / 2.54) * 2) / 2 : null; heightIn = heightIn ? Math.round((heightIn / 2.54) * 2) / 2 : null; unitsIn = true; } }}>in</button><button type="button" aria-pressed={!unitsIn} onclick={() => { if (unitsIn) { widthIn = widthIn ? Math.round(widthIn * 2.54) : null; heightIn = heightIn ? Math.round(heightIn * 2.54) : null; unitsIn = false; } }}>cm</button></div>
          </div>
        </fieldset>
      </form>

      <section class="results" aria-live="polite" aria-label="Machines that fit">
        {#if matches.length}
          <p class="kick">{matches.length === 1 ? 'One machine fits' : `${matches.length === 2 ? 'Two' : 'Three'} machines fit`}, best first</p>
          <svg viewBox="0 0 {CW} {CH}" class="counter" role="img" aria-label="Your shortlist on a counter, drawn to one scale: {matches.map((x) => `${x.machine.brand} ${x.machine.name}, ${sizeText(x.machine)}`).join('; ')}{needs.heightCm ? `, under cabinets ${heightIn} ${unitsIn ? 'inches' : 'cm'} high` : ''}.">
            <rect x="0" y={FLOOR} width={CW} height={CH - FLOOR} class="top" />
            <line x1="0" y1={FLOOR} x2={CW} y2={FLOOR} class="edge" />
            {#if needs.heightCm}
              {@const cy = FLOOR - needs.heightCm * counter.scale}
              {#if cy > 6}<rect x="0" y="0" width={CW} height={cy} class="cab" /><line x1="0" y1={cy} x2={CW} y2={cy} class="cabline" /><text x={CW - 12} y={cy - 7} text-anchor="end" class="cablbl">Under your cabinets · {heightIn} {unitsIn ? 'in' : 'cm'}</text>{/if}
            {/if}
            {#each counter.placed as p, i (p.m.id)}
              {@render machineShape(p.m, p.x, p.w, p.h, p.known)}
              <text x={p.x + p.w / 2} y={FLOOR + 20} text-anchor="middle" class="mlbl"><tspan class="rank">{i + 1}</tspan> {p.m.name}</text>
              <text x={p.x + p.w / 2} y={FLOOR + 36} text-anchor="middle" class="mdim">{p.known ? sizeText(p.m).replace(/ × [\d.]+ (in|cm)$/, '') : 'size not established'}</text>
            {/each}
          </svg>
          <p class="cap">Drawn to one scale from the makers' published sizes (width × height){matches.some((x) => x.machine.axisFlag) ? '. Breville lists the Bambino as wider than it is deep, which looks swapped, so its narrower side is tested against your width' : ''}.</p>

          <ol class="cards">
            {#each matches as x, i (x.machine.id)}
              {@const m = x.machine as M}
              <li class="card">
                <p class="ck"><span class="rank">{i + 1}</span>{m.category ? CATEGORY_LABEL[m.category] : ''}</p>
                <h3>{m.brand} {m.name}</h3>
                <p class="band">{x.band ? (needsGrinder(m) ? `About ${bandText(x.band)} with a grinder` : `About ${bandText(x.band)}`) : 'Budget fit unknown'}</p>
                <p class="fine">{m.listPrice.usd ? `The machine: ${money(m.listPrice.usd)}, the ${m.listPrice.kind ?? 'price seen'} on ${fmtDate(m.listPrice.checked)}.` : ''}{needsGrinder(m) && grinderPrices.length ? ` An espresso grinder adds about ${money(grinderPrices[0])}–${money(grinderPrices[grinderPrices.length - 1])}.` : ''} Prices change; check before you buy.</p>
                {#if x.why.length}<ul class="why">{#each x.why as w (w)}<li>{w}</li>{/each}</ul>{/if}
                {#if x.tradeoffs.length}<ul class="trade">{#each x.tradeoffs as t (t)}<li>{t}</li>{/each}</ul>{/if}
                <dl class="mini">
                  <div><dt>Heats</dt><dd>{heatLabel(m)}{shortTerm(m) ? ` (${m.brand}'s ${shortTerm(m)})` : ''}</dd></div>
                  <div><dt>Milk</dt><dd>{m.milk.type ? MILK[m.milk.type] : 'Not established'}</dd></div>
                  <div><dt>Size</dt><dd>{sizeText(m)}</dd></div>
                </dl>
                <div class="acts">
                  {#if m.heating.system && HEAT_KEY[m.heating.system]}<button type="button" class="ghost" onclick={() => { pickHeat(m.heating.system!); document.getElementById('how-it-heats')?.scrollIntoView({ behavior: 'smooth' }); }}>How it brews and steams</button>{/if}
                  <button type="button" class="ghost" onclick={() => openOwn(m.id)}>Its dose and care</button>
                  {#if m.amazon}<a class="go" href={m.amazon.url} rel="sponsored noopener" target="_blank">See it on Amazon</a>{/if}
                </div>
                {#if m.amazon}<p class="disc">The Amazon link is to this exact model, checked {fmtDate(m.amazon.checked)}. As an Amazon Associate we earn from qualifying purchases.</p>{/if}
              </li>
            {/each}
          </ol>
        {:else}
          <div class="none">
            <p class="kick">Nothing fits all of that</p>
            {#if nearest}
              <p>The closest current machine for your routine{needs.widthCm || needs.heightCm ? ' and counter' : ''} is the <b>{nearest.machine.brand} {nearest.machine.name}</b>, at about {bandText(nearest.band!)}{needsGrinder(nearest.machine) ? ' with a grinder' : ''}. <button type="button" class="linkish" onclick={() => (budget = Math.min(5000, Math.ceil(nearest!.band!.low / 50) * 50))}>Set the budget to {money(Math.ceil(nearest.band!.low / 50) * 50)}</button></p>
            {:else}
              <p>No current machine with a published size fits that counter. Try clearing the width or height.</p>
            {/if}
          </div>
        {/if}
        <p class="method">Only current machines with a dated price and a known milk system are suggested; {machines.filter((m) => m.status === 'current' && !(m.category && m.listPrice.usd && m.milk.type)).length} more are in <button type="button" class="linkish" onclick={() => (mode = 'all')}>Every machine</button>, with what's missing.</p>
      </section>
    </div>
  {:else if mode === 'own'}
    <div class="own">
      <label class="pickm"><span class="lbl">Your machine</span>
        <select bind:value={ownId}>
          {#each brands as b (b)}<optgroup label={b}>{#each machines.filter((m) => m.brand === b) as m (m.id)}<option value={m.id}>{m.name}{modelCodes(m) ? ` (${modelCodes(m)})` : ''}</option>{/each}</optgroup>{/each}
        </select>
      </label>
      <div class="ownbody">
        <div class="ownhead">
          <p class="ck">{own.category ? CATEGORY_LABEL[own.category] : 'Category not established'}{statusNote(own) ? ` · ${statusNote(own)}` : ''}</p>
          <h3>{own.brand} {own.name}</h3>
          <dl class="specs">
            <div><dt>Heats</dt><dd>{heatLabel(own)}{own.heating.makerTerm ? ` · ${own.heating.makerTerm}` : ''}</dd></div>
            {#if own.portafilterMm}<div><dt>Portafilter</dt><dd>{own.portafilterMm} mm</dd></div>{/if}
            {#if own.owner?.baskets ?? own.baskets?.length}<div><dt>Baskets</dt><dd>{own.owner?.baskets ?? own.baskets?.join(', ')}</dd></div>{/if}
            {#if own.owner?.dose}<div><dt>Dose</dt><dd>{own.owner.dose}</dd></div>{/if}
            {#if own.owner?.temperature}<div><dt>Temperature</dt><dd>{own.owner.temperature}</dd></div>{/if}
            <div><dt>Milk</dt><dd>{own.milk.type ? MILK[own.milk.type] : 'Not established'}{own.milk.makerTerm ? ` · ${own.milk.makerTerm}` : ''}</dd></div>
            {#if own.tankL}<div><dt>Water tank</dt><dd>{own.tankL} L</dd></div>{/if}
            <div><dt>Size</dt><dd>{sizeText(own)}{own.axisFlag ? ' (as the maker lists it; width and depth may be swapped)' : ''}</dd></div>
          </dl>
        </div>
        <div class="care">
          {#if own.owner?.recipe}<div class="note"><p class="lbl">The maker's starting recipe</p><p>{own.owner.recipe}</p></div>{/if}
          {#if own.owner?.descale}<div class="note"><p class="lbl">Descaling</p><p>{own.owner.descale}</p></div>{/if}
          {#if own.owner?.clean}<div class="note"><p class="lbl">Cleaning</p><p>{own.owner.clean}</p></div>{/if}
          {#if !own.owner?.recipe && !own.owner?.descale && !own.owner?.clean}<p class="quiet">The research found no dose, recipe or care details to show for this model{own.care?.manualUrl ? '; the manual below has them' : ''}.</p>{/if}
          <div class="acts">
            {#if own.care?.manualUrl}<a class="go" href={own.care.manualUrl} rel="noopener" target="_blank">The maker's manual ↗</a>{/if}
            {#if own.category !== 'capsule' && own.category !== 'super-auto'}<a class="ghost" href="/tools/brew-ratio/?method=espresso&dose=18">Brew an espresso in the Brew Guide</a>{/if}
            <a class="ghost" href="/tools/fix-my-coffee/?method=espresso">Fix a shot</a>
          </div>
          <p class="fine">From the maker's own pages and manual, checked October 15, 2026. Machine water and descaling follow the maker's specification.</p>
        </div>
      </div>
    </div>
  {:else}
    <div class="all">
      <p class="quiet">All {machines.length} machines in this guide, from the makers' published specs, checked October 15, 2026. Pick one for its dose and care.</p>
      {#each CATS as c (c)}
        {@const list = machines.filter((m) => m.category === c)}
        {#if list.length}
          <h3 class="cath">{CATEGORY_LABEL[c]} <span>{list.length}</span></h3>
          <div class="tw"><table>
            <thead><tr><th scope="col">Machine</th><th scope="col">Heats</th><th scope="col">Milk</th><th scope="col">Size</th><th scope="col">Price seen</th></tr></thead>
            <tbody>
              {#each list as m (m.id)}
                <tr>
                  <th scope="row"><button type="button" class="linkish" onclick={() => openOwn(m.id)}>{m.brand} {m.name}</button>{#if statusNote(m)}<small>{statusNote(m)}</small>{/if}</th>
                  <td>{heatLabel(m)}</td><td>{m.milk.type ? MILK[m.milk.type] : '—'}</td><td class="nw">{m.dims ? sizeText(m) : '—'}</td>
                  <td class="nw">{m.listPrice.usd ? money(m.listPrice.usd) : 'Not verified'}</td>
                </tr>
              {/each}
            </tbody>
          </table></div>
        {/if}
      {/each}
      {#if machines.some((m) => !m.category)}<p class="quiet">Also researched, without enough published detail to place: {machines.filter((m) => !m.category).map((m) => `${m.brand} ${m.name}`).join(', ')}.</p>{/if}
    </div>
  {/if}

  <section class="heat" id="how-it-heats" aria-label="How each heating system brews and steams">
    <p class="kick">How it brews and steams</p>
    <div class="htabs" role="tablist" aria-label="Heating system">
      {#each Object.keys(HEAT_KEY) as k (k)}<button type="button" role="tab" aria-selected={heatTab === k} onclick={() => pickHeat(k)}>{HEAT[k as Heating]}</button>{/each}
    </div>
    <div class="hbody">
      <svg viewBox="0 0 360 200" class="schem" role="img" aria-label="{HEAT[heatTab as Heating]}: {SIMUL[heatTab]} Now: {steps[step] ?? ''}" data-phase={ph}>
        <!-- tank -->
        <rect x="14" y="70" width="46" height="80" rx="6" class="tank" /><text x="37" y="166" text-anchor="middle" class="sl">Tank</text>
        {#if heatTab === 'dual-boiler'}
          <rect x="110" y="30" width="80" height="54" rx="10" class="heater brewh" /><text x="150" y="61" text-anchor="middle" class="hl">Brew boiler</text>
          <rect x="110" y="112" width="80" height="54" rx="10" class="heater steamh" /><text x="150" y="143" text-anchor="middle" class="hl">Steam boiler</text>
          <path d="M60 100 C 85 100, 90 57, 110 57" class="pipe pbrew" /><path d="M60 120 C 85 120, 90 139, 110 139" class="pipe psteam" />
          <path d="M190 57 L 262 57 L 262 76" class="pipe pbrew" /><path d="M190 139 L 300 139 L 300 110" class="pipe psteam" />
        {:else}
          <rect x="105" y="62" width="92" height="76" rx={heatTab === 'thermoblock' ? 6 : 14} class="heater" class:hx={heatTab === 'heat-exchanger'} />
          <text x="151" y="98" text-anchor="middle" class="hl">{heatTab === 'thermoblock' ? 'Thermoblock' : heatTab === 'heat-exchanger' ? 'Boiler' : 'Boiler'}</text>
          {#if heatTab === 'heat-exchanger'}<path d="M120 122 C 140 108, 160 136, 182 116" class="hxtube" /><text x="151" y="132" text-anchor="middle" class="sl">heat exchanger</text>{/if}
          <path d="M60 110 L 105 110" class="pipe pboth" />
          <path d="M197 82 L 262 82 L 262 76" class="pipe pbrew" /><path d="M197 118 L 300 118 L 300 110" class="pipe psteam" />
        {/if}
        <!-- group head and cup -->
        <rect x="244" y="60" width="36" height="16" rx="3" class="group" /><text x="262" y="52" text-anchor="middle" class="sl">Group</text>
        <path d="M252 140 L 272 140 L 270 160 L 254 160 Z" class="cup" /><line x1="262" y1="78" x2="262" y2="138" class="flow fbrew" />
        <!-- steam wand -->
        <line x1="300" y1="110" x2="330" y2="160" class="wandl" /><text x="332" y="104" text-anchor="end" class="sl">Wand</text>
        <path d="M322 168 q6 -10 12 0 q6 -10 12 0" class="flow fsteam" />
      </svg>
      <div class="steps">
        <p class="simul"><b>Brew and steam:</b> {SIMUL[heatTab]}</p>
        <ol>{#each steps as s, i (i)}<li class:on={i === step}><button type="button" class="stepbtn" onclick={() => { stop(); step = i; }} aria-current={i === step ? 'step' : undefined}>{s}</button></li>{/each}</ol>
        <div class="acts"><button type="button" class="go" onclick={play}>{playing ? 'Pause' : step > 0 ? 'Play from the start' : 'Play the sequence'}</button></div>
        <p class="fine">A schematic of the system, not of any one machine: follow your own manual for timings and controls. No fixed waits are given because the makers don't publish universal ones.</p>
      </div>
    </div>
  </section>
</div>

<style>
  .mc { --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22; --water: #2f7484;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; }
  .modes { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid var(--rule); border-radius: 999px; background: #fff; margin-bottom: 16px; }
  .modes button { appearance: none; border: 0; background: none; border-radius: 999px; padding: 9px 16px; min-height: 40px; font: 500 14px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .modes button[aria-selected='true'] { background: var(--ink); color: #f3ede3; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin: 0 0 8px; }
  .opt { text-transform: none; letter-spacing: 0; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--crema-deep); margin: 0 0 8px; }
  .find { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 18px; align-items: start; }
  .ask { background: var(--card); border: 1px solid var(--rule); border-radius: 18px; padding: 18px; display: grid; gap: 16px; }
  fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button, .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'], .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .chips.sm button { min-height: 36px; padding: 6px 11px; font-size: 13px; }
  .effort { display: grid; gap: 6px; }
  .effort button { appearance: none; text-align: left; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 10px 12px; min-height: 44px; cursor: pointer; color: var(--ink); font: inherit; }
  .effort button[aria-pressed='true'] { border-color: var(--ink); box-shadow: inset 0 0 0 1px var(--ink); background: #fffaf2; }
  .effort b { display: block; font-weight: 600; font-size: 15px; }
  .effort small { color: var(--ink-3); font-size: 13px; }
  .budget { display: grid; gap: 8px; }
  .bval { font: 400 34px/1 'Instrument Serif', Georgia, serif; }
  .budget input[type=range] { width: 100%; accent-color: var(--crema-deep); min-height: 32px; }
  .space { display: flex; flex-wrap: wrap; gap: 10px; align-items: end; }
  .space label { display: grid; gap: 4px; font-size: 13px; color: var(--ink-2); }
  .space label > span:first-child { font-size: 12.5px; }
  .space input { width: 88px; font: 500 15px 'IBM Plex Mono', monospace; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 10px; min-height: 42px; }
  .space .u { position: relative; margin-left: 6px; font: 500 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .space label { grid-template-columns: auto auto; grid-template-areas: 'l l' 'i u'; align-items: center; }
  .space label > span:first-child { grid-area: l; }
  .seg { display: inline-flex; gap: 4px; }
  .results { min-width: 0; }
  .counter { width: 100%; height: auto; background: linear-gradient(#fffdf9, #f1e7d9); border: 1px solid var(--rule); border-radius: 16px; }
  .top { fill: #e6d6bf; }
  .edge { stroke: #b59a77; stroke-width: 2; }
  .cab { fill: #3a2a20; opacity: .08; }
  .cabline { stroke: #3a2a20; stroke-width: 2; stroke-dasharray: 6 4; }
  .cablbl { font: 500 11px 'IBM Plex Mono', monospace; fill: var(--ink-2); }
  .mach .body { fill: #2a1d15; }
  .mach.unknown .body { fill: none; stroke: #75655a; stroke-dasharray: 5 4; stroke-width: 1.5; }
  .mach .detail { fill: #f3ede3; opacity: .35; }
  .mach .screen { fill: #2f7484; opacity: .7; }
  .mach .handle { stroke: #2a1d15; stroke-width: 5; stroke-linecap: round; }
  .mach .wand { stroke: #9c8f82; stroke-width: 3; stroke-linecap: round; }
  .mach .lever { stroke: #2a1d15; stroke-width: 6; stroke-linecap: round; }
  .mach .hopper { fill: #5b4a3d; opacity: .7; }
  .mlbl { font: 400 15px 'Instrument Serif', Georgia, serif; fill: var(--ink); }
  .mlbl .rank { font: 500 11px 'IBM Plex Mono', monospace; fill: var(--crema-deep); }
  .mdim { font: 500 10.5px 'IBM Plex Mono', monospace; fill: var(--ink-3); }
  .cap { margin: 8px 0 14px; font-size: 13px; color: var(--ink-3); }
  .cards { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
  .card { background: #fff; border: 1px solid var(--rule); border-radius: 16px; padding: 16px 18px; }
  .ck { margin: 0; font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); display: flex; align-items: center; gap: 8px; }
  .ck .rank { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--crema-deep); color: var(--crema-deep); letter-spacing: 0; }
  h3 { font: 400 28px/1.1 'Instrument Serif', Georgia, serif; margin: 6px 0 4px; }
  .band { margin: 0; font: 500 15px 'IBM Plex Mono', monospace; color: var(--ink); }
  .fine { margin: 4px 0 0; font-size: 12.5px; color: var(--ink-3); }
  .why, .trade { margin: 10px 0 0; padding: 0; list-style: none; display: grid; gap: 4px; font-size: 14.5px; }
  .why li, .trade li { padding-left: 22px; position: relative; color: var(--ink-2); }
  .why li::before { content: '✓'; position: absolute; left: 2px; color: #2f7484; font-weight: 600; }
  .trade li::before { content: '–'; position: absolute; left: 4px; color: #a0522d; font-weight: 600; }
  .mini { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 12px 0 0; padding-top: 10px; border-top: 1px dashed var(--rule); }
  .mini dt, .specs dt { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .mini dd, .specs dd { margin: 2px 0 0; font-size: 14px; color: var(--ink); }
  .acts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .go { background: var(--ink); color: #f3ede3; border: 0; border-radius: 999px; padding: 10px 16px; font: 600 14px/1.2 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; cursor: pointer; }
  .ghost { border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 9px 13px; font: 500 14px/1.2 'IBM Plex Sans', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; cursor: pointer; }
  .disc { margin: 8px 0 0; font-size: 12px; color: var(--ink-3); }
  .none { background: #fff8ec; border: 1px solid #e9c48f; border-radius: 14px; padding: 14px 16px; }
  .none p { margin: 0; }
  .linkish { appearance: none; border: 0; background: none; padding: 0; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; font: inherit; cursor: pointer; }
  .method { margin: 12px 0 0; font-size: 13px; color: var(--ink-3); }
  .own { display: grid; gap: 14px; }
  .pickm select { width: 100%; max-width: 520px; appearance: none; font: 500 16px 'IBM Plex Sans', sans-serif; padding: 10px 36px 10px 12px; border: 1px solid var(--rule); border-radius: 10px; color: var(--ink); min-height: 46px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center; }
  .ownbody { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; }
  .ownhead, .care { background: #fff; border: 1px solid var(--rule); border-radius: 16px; padding: 16px 18px; }
  .specs { display: grid; gap: 10px; margin: 12px 0 0; }
  .note { padding: 10px 12px; border-left: 3px solid var(--crema); background: #fff8ec; border-radius: 0 10px 10px 0; margin-bottom: 10px; }
  .note p { margin: 0; font-size: 14.5px; color: var(--ink-2); }
  .note .lbl { margin-bottom: 4px; }
  .quiet { color: var(--ink-3); font-size: 14px; margin: 0 0 10px; }
  .cath { font: 400 24px 'Instrument Serif', Georgia, serif; margin: 18px 0 6px; }
  .cath span { font: 500 12px 'IBM Plex Mono', monospace; color: var(--ink-3); }
  .tw { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 8px 8px; border-bottom: 1px solid #e6dccd; vertical-align: top; }
  thead th { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  tbody th small { display: block; font-weight: 400; color: var(--ink-3); font-size: 12px; }
  .nw { white-space: nowrap; }
  .heat { margin-top: 28px; background: var(--card); border: 1px solid var(--rule); border-radius: 18px; padding: 18px; }
  .htabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .htabs button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; }
  .htabs button[aria-selected='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .hbody { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; align-items: start; }
  .schem { width: 100%; height: auto; background: #fff; border: 1px solid var(--rule); border-radius: 14px; }
  .tank { fill: #dbeef1; stroke: #2f7484; stroke-width: 1.5; }
  .heater { fill: #3a2a20; }
  .heater.hx { fill: #3a2a20; }
  .hxtube { fill: none; stroke: #7fc3cf; stroke-width: 3; }
  .hl { font: 500 11px 'IBM Plex Mono', monospace; fill: #f3ede3; }
  .sl { font: 500 10.5px 'IBM Plex Mono', monospace; fill: var(--ink-3); }
  .pipe { fill: none; stroke: #cdbba6; stroke-width: 4; stroke-linecap: round; transition: stroke .4s; }
  .group { fill: #5b4a3d; }
  .cup { fill: #fbf8f3; stroke: #5b4a3d; stroke-width: 1.5; }
  .wandl { stroke: #9c8f82; stroke-width: 4; stroke-linecap: round; }
  .flow { fill: none; stroke-width: 3; opacity: 0; transition: opacity .4s; }
  .fbrew { stroke: #7a4e30; stroke-dasharray: 4 5; }
  .fsteam { stroke: #9c8f82; }
  .schem[data-phase='heat'] .heater, .schem[data-phase='wait'] .heater { filter: drop-shadow(0 0 6px #c3873a); }
  .schem[data-phase='brew'] .pbrew, .schem[data-phase='both'] .pbrew { stroke: #7a4e30; }
  .schem[data-phase='steam'] .psteam, .schem[data-phase='both'] .psteam { stroke: #9c8f82; }
  .schem[data-phase='brew'] .pboth, .schem[data-phase='steam'] .pboth, .schem[data-phase='both'] .pboth { stroke: #2f7484; }
  .schem[data-phase='brew'] .fbrew, .schem[data-phase='both'] .fbrew { opacity: 1; animation: drip 1s linear infinite; }
  .schem[data-phase='steam'] .fsteam, .schem[data-phase='both'] .fsteam { opacity: 1; }
  @keyframes drip { to { stroke-dashoffset: -18; } }
  .steps .simul { margin: 0 0 8px; font-size: 14.5px; }
  .steps ol { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
  .steps li.on .stepbtn { color: var(--ink); font-weight: 600; }
  .stepbtn { appearance: none; border: 0; background: none; padding: 4px 0; text-align: left; font: 400 14px/1.45 'IBM Plex Sans', sans-serif; color: var(--ink-3); cursor: pointer; min-height: 32px; }
  button:focus-visible, a:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 900px) {
    .find, .ownbody, .hbody { grid-template-columns: 1fr; }
    .mini { grid-template-columns: 1fr 1fr; }
    h3 { font-size: 25px; }
  }
  @media (prefers-reduced-motion: reduce) { .schem .fbrew { animation: none; } .pipe, .flow { transition: none; } }
</style>
