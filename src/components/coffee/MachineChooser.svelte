<script lang="ts">
  import { onMount } from 'svelte';
  import data from '../../data/machines.json';
  import { chooseMachines, needsGrinder, neededHeight, unclearMaxCm, CATEGORY_LABEL } from '../../lib/coffee/machines.ts';
  import type { Machine, GrinderPrice, Needs, Category, Heating, Match } from '../../lib/coffee/machines.ts';

  // Choose a machine for your counter, budget (grinder included), milk and effort; then, if you own
  // one, what its maker says about dose, temperature and care. Every spec is the maker's, dated.
  type Owner = { dose?: string | null; recipe?: string | null; baskets?: string | null; temperature?: string | null; descale?: string | null; clean?: string | null };
  type M = Machine & { fullName?: string; variant?: string | null; code?: string | null; owner?: Owner | null };
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
  // An owner link naming a machine this guide doesn't include: said, not silently replaced by another machine's care.
  let badOwnLink = $state(false);
  // Link values the guide couldn't use, named in a notice rather than silently replaced (Muse WB2 M-5).
  let badRoute = $state<string[]>([]);
  let narrow = $state(false);

  const toCm = (v: number | null) => (v == null || !Number.isFinite(v) || v <= 0 ? null : unitsIn ? v * 2.54 : v);
  let needs = $derived<Needs>({ milk, cups, effort, budget, widthCm: toCm(widthIn), heightCm: toCm(heightIn) });
  let matches = $derived(chooseMachines(machines, grinders, needs));
  // When nothing fits, say what would: the cheapest fit with the same routine and counter, at any budget.
  // When nothing fits the budget, the least you could spend on a machine that fully meets the routine and counter
  // (WB2 Opus: it used to offer the top-ranked machine, $1,800, when setups from about $350 fit).
  let nearest = $derived.by(() => {
    if (matches.length) return null;
    const all = chooseMachines(machines, grinders, { ...needs, budget: Infinity }, 200);
    return [...all.filter((x) => !x.misses.length)].sort((a, b) => a.band!.low - b.band!.low)[0] ?? all[0] ?? null;
  });
  let own = $derived(byId(ownId) ?? machines[0]);
  // Machines a width ruled out only because their published size is unclear, which would otherwise be shortlisted:
  // said where the answer is, not in a footnote (gate r2).
  let hiddenByWidth = $derived(needs.widthCm ? chooseMachines(machines, grinders, { ...needs, widthCm: null }).map((x) => x.machine as M).filter((m) => !m.dims && m.dimsUnclear) : []);

  const HEAT: Record<Heating, string> = { thermoblock: 'Thermoblock', 'single-boiler': 'Single boiler', 'heat-exchanger': 'Heat exchanger', 'dual-boiler': 'Dual boiler', 'dual-thermoblock': 'Twin thermoblocks', none: 'No boiler (lever)' };
  const HEATS: string[] = ['thermoblock', 'single-boiler', 'heat-exchanger', 'dual-boiler'];
  const MILK: Record<string, string> = { none: 'No milk system', 'manual-wand': 'Manual steam wand', panarello: 'Frothing wand', 'auto-wand': 'Automatic steam wand', carafe: 'Automatic milk system' };
  const NE = 'not established';
  const heatLabel = (m: M) => (m.heating.system ? HEAT[m.heating.system] : NE);
  // The maker's own name for its heater, without the research's parenthetical detail ("ThermoJet", "Thermocoil").
  const shortTerm = (m: M) => {
    const t = (m.heating.makerTerm ?? '').replace(/\s*\(.*$/, '').replace(/®|™/g, '').replace(/\s*(heating )?system$/i, '').trim();
    // Only a distinct maker name adds anything ("ThermoJet"); "Dual Boiler Technology" or "stainless steel boiler" just repeats the family.
    return m.heating.system && t && !/boiler|heat exchanger|thermoblock/i.test(t) ? t : '';
  };
  const money = (v: number) => `$${Math.round(v).toLocaleString('en-US')}`;
  // Converting a measurement never makes the space bigger than the reader gave: round down, to 0.01 in or 0.1 cm (WB2 M1).
  const toUnit = (v: number | null, factor: number, steps: number) => (v ? Math.floor(v * factor * steps + 1e-9) / steps : null);
  const lowerFirst = (t: string) => t.charAt(0).toLowerCase() + t.slice(1);
  // Nespresso's two capsule systems don't interchange, so capsule machines are compared by the capsules they take.
  const LINE: Record<string, string> = { original: 'Original', vertuo: 'Vertuo' };
  // Bands are "about": rounded to $10 below $600 and $50 above, so they don't look more exact than prices are.
  const r = (v: number) => (v < 600 ? Math.round(v / 10) * 10 : Math.round(v / 50) * 50);
  const band = (b: { low: number; high: number } | null) => (!b ? null : r(b.low) === r(b.high) ? money(r(b.low)) : `${money(r(b.low))}–${money(r(b.high))}`);
  const grinderPrices = grinders.map((g) => g.usd).filter((n): n is number => n != null).sort((a, b) => a - b);
  const u = $derived(unitsIn ? 'in' : 'cm');
  const len = (cm: number) => (unitsIn ? `${(cm / 2.54).toFixed(1)}` : `${Math.round(cm * 10) / 10}`);
  const sizeText = (m: M) => (m.dims ? `${len(m.dims.w)} × ${len(m.dims.d)} × ${len(m.dims.h)} ${u}` : m.dimsUnclear ? 'Unclear' : NE);
  // Unknown widths are drawn at a nominal 28 cm, dashed, and say so.
  const drawW = (m: M) => (m.dims ? m.dims.w : 28);
  // Breville's printed size conflicts with its own guidance (research/BREVILLE_DIMS_CHECK.md): said plainly.
  const unclearNote = (m: M) => `${m.brand}'s listed size (${m.dimsUnclear}, as W × D × H) conflicts with its own clearance guidance, so it isn't drawn to scale or tested against a width.${neededHeight(m) ? ` Under cabinets we allow ${len(neededHeight(m)!)} ${u}: ${allowWhy(m)}.` : ''}`;
  // Why that height: the maker's clearance, or the largest figure in its listing when that is more.
  const allowWhy = (m: M) => ((unclearMaxCm(m) ?? 0) > (m.clearanceCm ?? 0) ? `the largest figure in ${m.brand}'s listed size${m.clearanceCm ? `, more than the ${len(m.clearanceCm)} ${u} of clearance it suggests` : ''}` : `the clearance ${m.brand} suggests`);
  // A manual that downloads as an archive says so in its link (Muse WB2 M-9b).
  const zipNote = (url: string) => (/\.zip($|\?)/i.test(url) ? ' (a ZIP download)' : '');
  const fullName = (m: M) => `${m.brand} ${m.name}${m.variant ? `, ${m.variant}` : ''}`;
  const statusNote = (m: M) => (m.status === 'discontinued' ? 'Discontinued by the maker' : m.status === 'unconfirmed' ? 'Not confirmed as a current US model' : m.status === 'replaced' ? 'Replaced by a newer model' : '');
  const brands = [...new Set(machines.map((m) => m.brand))].sort();
  const CATS: Category[] = ['capsule', 'super-auto', 'semi-auto-grinder', 'semi-auto', 'manual-lever'];
  const makesEspressoByHand = (m: M) => m.category === 'semi-auto' || m.category === 'semi-auto-grinder' || m.category === 'manual-lever';

  // ── Cards: why each ranks where it does, a trade-off on every card, and the counter fit ──
  const CATEGORY_TRADE: Record<Category, string> = {
    capsule: 'Capsules only: you can\'t choose your own beans or grind.',
    'super-auto': 'Less control over each shot than a machine you run by hand.',
    'semi-auto-grinder': 'The grinder is part of the machine, so you can\'t swap it for a better one later.',
    'semi-auto': 'Needs a separate grinder, and practice to pull good shots.',
    'manual-lever': 'Every shot is pressed by hand, and there is no steam for milk.',
  };
  function tradeoffs(x: Match): string[] {
    return x.tradeoffs.length ? x.tradeoffs : x.machine.category ? [CATEGORY_TRADE[x.machine.category]] : [];
  }
  function rankNote(i: number): string {
    const a = matches[i], top = matches[0];
    if (i === 0) return a.misses.length ? `First, though not a full match: ${a.misses[0]}.` : matches.length > 1 && a.score === matches[1].score ? 'First: it meets what you asked, and makes the most of your budget among the close matches.' : 'First: the closest match to what you asked.';
    const d: string[] = [];
    const dp = r(a.band!.low) - r(top.band!.low);
    d.push(dp > 0 ? `${money(dp)} more` : dp < 0 ? `${money(-dp)} less` : 'about the same money');
    const am = a.machine.milk.type, tm = top.machine.milk.type;
    if (am && tm && am !== tm) d.push(`${MILK[am].toLowerCase()} rather than ${MILK[tm].toLowerCase()}`);
    if (needsGrinder(a.machine) !== needsGrinder(top.machine)) d.push(needsGrinder(a.machine) ? 'needs a separate grinder' : 'no separate grinder needed');
    const sa = a.machine.heating.system, st = top.machine.heating.system;
    if (sa && st && sa !== st && sa !== 'none' && a.machine.category !== 'capsule' && top.machine.category !== 'capsule') d.push(`${HEAT[sa].toLowerCase()} rather than ${HEAT[st].toLowerCase()}`);
    const la = (a.machine as M).capsuleLine, lt = (top.machine as M).capsuleLine;
    if (la && lt && la !== lt) d.push(`takes ${LINE[la]} capsules, not ${LINE[lt]}`);
    if (a.machine.heating.simultaneousBrewSteam && !top.machine.heating.simultaneousBrewSteam) d.push('brews and steams at once');
    // What the difference buys, from the makers' own specs: grind steps, heat-up, tank, portafilter.
    const gs = (m: Machine) => { const n = String(m.grinder.settings ?? '').match(/\d+/); return m.grinder.builtIn && n ? Number(n[0]) : null; };
    const ga = gs(a.machine), gt = gs(top.machine);
    if (ga && gt && ga !== gt) d.push(`${ga} grind settings, not ${gt}`);
    const ha = a.machine.heating.heatUpSeconds, ht = top.machine.heating.heatUpSeconds;
    if (ha && ht && Math.abs(ha - ht) >= 5) d.push(`heats in about ${ha} seconds, not ${ht}, by the makers' figures`);
    else if (ha && !ht && ha <= 10) d.push(`ready in about ${ha} seconds, by the maker's figure`);
    if (a.machine.tankL && top.machine.tankL && a.machine.tankL - top.machine.tankL >= 0.5) d.push(`a bigger tank (${a.machine.tankL} L, not ${top.machine.tankL} L)`);
    if (a.machine.portafilterMm && top.machine.portafilterMm && a.machine.portafilterMm !== top.machine.portafilterMm) d.push(`a ${a.machine.portafilterMm} mm portafilter, not ${top.machine.portafilterMm} mm`);
    // Say what makes it a weaker fit, never just that it is one.
    if (a.misses.length && !top.misses.length) d.push(`not a full match: ${a.misses[0]}`);
    else if (a.score > top.score) { const t = a.tradeoffs.find((x) => !top.tradeoffs.includes(x)); if (t) d.push(`a weaker fit: ${lowerFirst(t).replace(/\.$/, '')}`); }
    // Nothing else separates them for this routine: say they score the same, never that their specs are the same (WB2 M5).
    if (d.length === 1) return `Against #1: ${d[0]}; it scores the same for what you asked.`;
    return `Against #1: ${d.join('; ')}.`;
  }
  // Why a machine isn't drawn: Breville's listed sizes conflict with its own guidance (research/BREVILLE_DIMS_CHECK.md),
  // or the maker publishes none we could find.
  // How each dashed outline was sized: an unclear listing at the height we allow, an unknown size at a nominal one.
  function dashedCap(ms: M[]): string {
    const one = ms.length === 1, unclear = ms.filter((m) => m.dimsUnclear && neededHeight(m)), rest = ms.filter((m) => !(m.dimsUnclear && neededHeight(m)));
    const who = (xs: M[]) => (one ? 'It is' : `The ${xs.map((m) => m.name).join(xs.length === 2 ? ' and ' : ', ').replace(/, ([^,]*)$/, ' and $1')} ${xs.length === 1 ? 'is' : 'are'}`);
    return [unclear.length ? `${who(unclear)} outlined at the height we allow for ${unclear.length === 1 ? 'it' : 'each'}, at a nominal width.` : '', rest.length ? `${who(rest)} outlined at a nominal height and width.` : ''].filter(Boolean).join(' ');
  }
  function sizeWhy(ms: M[]): string {
    const names = (xs: M[]) => xs.map((m) => m.name).join(xs.length === 2 ? ' and ' : ', ').replace(/, ([^,]*)$/, ' and $1');
    const unclear = ms.filter((m) => m.dimsUnclear), none = ms.filter((m) => !m.dimsUnclear);
    const out: string[] = [];
    if (unclear.length) out.push(`the sizes ${unclear[0].brand} lists for the ${names(unclear)} conflict with its own clearance guidance, so ${unclear.length === 1 ? 'it isn\'t' : 'they aren\'t'} drawn to scale or tested against a width.`);
    if (none.length) out.push(`the maker${none.length === 1 ? '' : 's'} of the ${names(none)} publish${none.length === 1 ? 'es' : ''} no size we could find.`);
    return out.map((t) => t[0].toUpperCase() + t.slice(1)).join(' ');
  }
  // "Breville suggests 16.0 in of clearance under cabinets for all three", grouped by brand and clearance.
  function clearanceText(ms: M[]): string {
    return ms.filter((m) => m.dimsUnclear && neededHeight(m)).map((m) => ` For the ${m.name}, we allow ${len(neededHeight(m)!)} ${u} under cabinets: ${allowWhy(m)}.`).join('');
  }
  // Less than an inch above the machine: it fits, but there may be no room to lift a lid or fill the tank in place.
  function tightLine(m: M): string | null {
    if (!needs.heightCm || !m.dims || (m.clearanceCm && m.clearanceCm > m.dims.h)) return null;
    const gap = needs.heightCm - m.dims.h;
    return gap < 2.54 ? `Leaves only ${len(gap)} ${u} under your cabinets: check you can lift the lid and fill the tank where it stands.` : null;
  }
  function fitLines(m: M): string[] {
    const out: string[] = [];
    if (needs.heightCm && !m.dims && neededHeight(m)) out.push(`Fits under your ${heightIn} ${u} cabinets: we allow ${len(neededHeight(m)!)} ${u}, ${allowWhy(m)}.`);
    else if (needs.heightCm && m.clearanceCm && m.dims && m.clearanceCm > m.dims.h) out.push(`Fits under your ${heightIn} ${u} cabinets: ${m.brand} suggests ${len(m.clearanceCm)} ${u} of clearance.`);
    else if (needs.heightCm && m.dims && !tightLine(m)) out.push(`Leaves ${len(needs.heightCm - m.dims.h)} ${u} under your cabinets.`);
    if (needs.widthCm && m.dims) out.push(`Fits your ${widthIn} ${u} of width, with ${len(needs.widthCm - m.dims.w)} ${u} to spare.`);
    return out;
  }

  onMount(() => {
    const q = new URLSearchParams(location.search);
    const bad: string[] = [];
    const md = q.get('mode');
    if (md === 'own' || md === 'all' || md === 'find') mode = md; else if (md) bad.push('the view');
    const mi = q.get('milk'); if (mi === 'none' || mi === 'some' || mi === 'most') milk = mi; else if (mi) bad.push('milk');
    const c = Number(q.get('cups')); if (c === 1 || c === 3 || c === 5) cups = c; else if (q.get('cups')) bad.push('drinks');
    const ef = q.get('effort'); if (ef === 'button' || ef === 'guided' || ef === 'hands-on') effort = ef; else if (ef) bad.push('how hands-on');
    // Kept within the slider's range and steps, so the display and the slider always agree (WB2 Opus).
    const b = Number(q.get('budget'));
    if (Number.isFinite(b) && b > 0) { budget = Math.min(5000, Math.max(150, Math.round(b / 50) * 50)); if (budget !== b) bad.push(`the budget (kept to $150–$5,000 in $50 steps)`); }
    else if (q.get('budget')) bad.push('the budget');
    if (q.get('units') === 'cm') unitsIn = false;
    const w = Number(q.get('w')); if (w > 0) widthIn = w; else if (q.get('w')) bad.push('the counter width');
    const h = Number(q.get('h')); if (h > 0) heightIn = h; else if (q.get('h')) bad.push('the cabinet height');
    badRoute = bad;
    const m = q.get('m'); if (byId(m)) ownId = m!; else if (m) badOwnLink = true;
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

  // ── The counter: matches side by side at one scale, with your counter width and cabinets ──
  let CW = $derived(narrow ? 360 : 640);
  let counter = $derived.by(() => {
    const items = matches.map((x) => x.machine);
    // An unclear size is drawn dashed at the height we allow for it; an unknown one at a nominal 34 cm.
    const ws = items.map(drawW), hs = items.map((m) => (m.dims ? m.dims.h : neededHeight(m) ?? 34));
    const slot = (i: number) => Math.max(ws[i], needs.widthCm ?? 0);
    const gap = 10;
    const totalW = items.reduce((a, _, i) => a + slot(i), 0) + gap * Math.max(0, items.length - 1);
    const tallest = Math.max(...hs, needs.heightCm ?? 0, 20);
    const s = Math.min((CW - 48) / Math.max(totalW, 40), (narrow ? 150 : 190) / tallest);
    const TOP = needs.heightCm ? 46 : 24;
    const FLOOR = TOP + tallest * s;
    let x = (CW - totalW * s) / 2;
    const placed = items.map((m, i) => {
      const sx = x, sw = slot(i) * s;
      x += sw + gap * s;
      return { m, slotX: sx, slotW: sw, x: sx + (sw - ws[i] * s) / 2, w: ws[i] * s, h: hs[i] * s, known: !!m.dims };
    });
    // A scale bar the reader can trust: 4 in or 10 cm.
    const barCm = unitsIn ? 4 * 2.54 : 10;
    // When a label would run into its neighbour, each machine is labelled by its rank only; the cards carry the names.
    const labelW = (m: M) => Math.max((m.name.length + 2) * 7.2, (m.dims ? `${len(m.dims.w)} wide × ${len(m.dims.h)} tall` : `size unclear · needs ${len(m.clearanceCm ?? 0)} in`).length * 6.4);
    const compact = placed.some((q) => q.slotW + gap * s < labelW(q.m));
    return { placed, s, FLOOR, compact, H: FLOOR + (needs.widthCm ? 88 : 56), barPx: barCm * s, barLabel: unitsIn ? '4 in' : '10 cm' };
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
  const TOGETHER: Record<string, [boolean, string]> = {
    thermoblock: [false, 'One heater switches between brewing and steaming, so they happen one after the other.'],
    'single-boiler': [false, 'One boiler changes temperature between brewing and steaming, so they happen one after the other.'],
    'heat-exchanger': [true, 'Brew water runs through its own circuit inside the steam boiler, so both can run at once.'],
    'dual-boiler': [true, 'Each boiler keeps its own temperature; both run at once where the maker says so.'],
  };
  let seq = $derived(SEQ[heatTab] ?? []);
  let ph = $derived<Phase>(seq[step]?.[0] ?? 'heat');
  function play() {
    if (playing) { stop(); return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { step = (step + 1) % seq.length; return; }
    playing = true; step = 0;
    timer = setInterval(() => { if (step >= seq.length - 1) stop(); else step += 1; }, 2600);
  }
  function stop() { playing = false; if (timer) clearInterval(timer); timer = null; }
  function pickHeat(k: string) { stop(); heatTab = k; step = 0; }
  // The explainer follows what's on screen: your machine in "I own one", the top match in "Find".
  let followed = '';
  $effect(() => {
    const m = mode === 'own' ? own : mode === 'find' ? matches.find((x) => x.machine.heating.system && (HEATS.includes(x.machine.heating.system) || x.machine.heating.system === 'dual-thermoblock'))?.machine : null;
    const key = m ? `${mode}:${m.id}` : '';
    // Twin thermoblocks work like a dual boiler: one heater for brewing, one for steam (WB2 Astra M3).
    const tab = m?.heating.system === 'dual-thermoblock' ? 'dual-boiler' : m?.heating.system;
    if (tab && HEATS.includes(tab) && key !== followed) { followed = key; stop(); heatTab = tab; step = 0; }
  });
</script>

{#snippet machineShape(m: M, x: number, w: number, h: number, known: boolean, floor: number)}
  {@const y = floor - h}
  <g class="mach" class:unknown={!known}>
    {#if !known}
      <!-- size unclear or unpublished: an outline only, never a shape that claims proportions -->
      <rect x={x} y={y} width={w} height={h} rx="6" class="body" />
      <text x={x + w / 2} y={y + h / 2 + 6} text-anchor="middle" class="qmark">?</text>
    {:else if m.category === 'capsule'}
      <!-- slim body, a lid for the capsule, a cup on the tray -->
      <rect x={x} y={y + h * 0.08} width={w} height={h * 0.92} rx={Math.min(8, w / 4)} class="body" />
      <rect x={x + w * 0.08} y={y} width={w * 0.84} height={h * 0.14} rx={Math.min(6, w / 5)} class="body lid" />
      <rect x={x + w * 0.3} y={y + h * 0.4} width={w * 0.4} height={h * 0.06} rx="1.5" class="spout" />
      <rect x={x + w * 0.12} y={y + h * 0.86} width={w * 0.76} height={h * 0.05} rx="1.5" class="tray" />
    {:else if m.category === 'super-auto'}
      <!-- tall body, bean lid, screen, spout over the cup, drip tray -->
      <rect x={x} y={y} width={w} height={h} rx="6" class="body" />
      <rect x={x + w * 0.08} y={y - 3} width={w * 0.36} height="6" rx="3" class="body lid" />
      <rect x={x + w * 0.18} y={y + h * 0.12} width={w * 0.64} height={h * 0.13} rx="3" class="screen" />
      <rect x={x + w * 0.4} y={y + h * 0.36} width={w * 0.2} height={h * 0.09} rx="2" class="spout" />
      <rect x={x + w * 0.1} y={y + h * 0.86} width={w * 0.8} height={h * 0.05} rx="2" class="tray" />
    {:else if m.category === 'manual-lever'}
      <!-- base, column and lever: no boiler, no wand -->
      <rect x={x + w * 0.08} y={y + h * 0.84} width={w * 0.84} height={h * 0.16} rx="4" class="body" />
      <rect x={x + w * 0.44} y={y + h * 0.12} width={w * 0.12} height={h * 0.72} rx="3" class="body" />
      <rect x={x + w * 0.3} y={y + h * 0.42} width={w * 0.4} height={h * 0.1} rx="3" class="body" />
      <line x1={x + w * 0.5} y1={y + h * 0.16} x2={x + w * 0.98} y2={y + h * 0.02} class="lever" />
    {:else}
      <!-- boxy body, group head with portafilter handle, wand, drip tray; a hopper if the grinder is built in -->
      {@const top = m.category === 'semi-auto-grinder' ? h * 0.22 : 0}
      <!-- a built-in grinder's hopper sits inside the published height, on top of the body -->
      {#if top}<path d="M{x + w * 0.1} {y + top} L{x + w * 0.16} {y} L{x + w * 0.42} {y} L{x + w * 0.48} {y + top} Z" class="hopper" />{/if}
      <rect x={x} y={y + top} width={w} height={h - top} rx="6" class="body" />
      <rect x={x + w * 0.32} y={y + h * 0.4} width={w * 0.3} height={h * 0.07} rx="2" class="spout" />
      <line x1={x + w * 0.47} y1={y + h * 0.47} x2={x + w * 0.47 + w * 0.4} y2={y + h * 0.51} class="handle" />
      <rect x={x + w * 0.1} y={y + h * 0.86} width={w * 0.8} height={h * 0.05} rx="2" class="tray" />
      {#if m.milk.type && m.milk.type !== 'none'}<line x1={x + w * 0.92} y1={y + top + h * 0.12} x2={x + w * 1.04} y2={y + h * 0.66} class="wand" />{/if}
      {#if m.heating.system === 'dual-boiler' || m.heating.system === 'heat-exchanger'}<circle cx={x + w * 0.82} cy={y + top + h * 0.12} r={Math.min(w, h) * 0.07} class="gauge" />{/if}
    {/if}
  </g>
{/snippet}

<div class="mc">
  <div class="modes" role="tablist" aria-label="What you want to do">
    <button type="button" role="tab" aria-selected={mode === 'find'} onclick={() => (mode = 'find')}>Find one</button>
    <button type="button" role="tab" aria-selected={mode === 'own'} onclick={() => (mode = 'own')}>I own one</button>
    <button type="button" role="tab" aria-selected={mode === 'all'} onclick={() => (mode = 'all')}>All {machines.length}</button>
  </div>

  {#if mode === 'find'}
    <div class="find">
      <!-- On a phone the answer comes first, in one line, before the questions. -->
      {#if matches.length}<a class="peek" href="#chooser-results"><span class="lbl">Best fit</span><b>{matches[0].machine.brand} {matches[0].machine.name}</b><span>about {band(matches[0].band)}{needsGrinder(matches[0].machine) ? ' with a grinder' : ''} ↓</span></a>
      {:else}<a class="peek" href="#chooser-results"><span class="lbl">Nothing fits yet</span><span>See what would ↓</span></a>{/if}

      {#if badRoute.length}<p class="widthnote" role="status">That link had values this guide couldn't use for {badRoute.join(', ').replace(/, ([^,]*)$/, ' and $1')}, so those answers are the defaults or the nearest allowed value. Change them below.</p>{/if}
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
            <label><span>Width you have</span><span class="inp"><input type="number" inputmode="decimal" min="1" step="any" bind:value={widthIn} placeholder="any" /><i>{u}</i></span></label>
            <label><span>Height under cabinets</span><span class="inp"><input type="number" inputmode="decimal" min="1" step="any" bind:value={heightIn} placeholder="any" /><i>{u}</i></span></label>
            <div class="seg" role="group" aria-label="Units"><button type="button" aria-pressed={unitsIn} onclick={() => { if (!unitsIn) { widthIn = toUnit(widthIn, 1 / 2.54, 100); heightIn = toUnit(heightIn, 1 / 2.54, 100); unitsIn = true; } }}>in</button><button type="button" aria-pressed={!unitsIn} onclick={() => { if (unitsIn) { widthIn = toUnit(widthIn, 2.54, 10); heightIn = toUnit(heightIn, 2.54, 10); unitsIn = false; } }}>cm</button></div>
          </div>
        </fieldset>
      </form>

      <section class="results" id="chooser-results" aria-live="polite" aria-label="Machines that fit">
        {#if matches.length}
          {@const sized = matches.filter((x) => x.machine.dims)}
          {@const words = ['', 'one', 'two', 'three']}
          {@const full = matches.filter((x) => !x.misses.length).length}
          <!-- Only full matches are said to fit; the rest are named as the closest after them (gate r3). -->
          <p class="kick">{full === 0 ? `Nothing meets everything you asked: the ${words[matches.length]} closest, closest first` : full === matches.length ? `${words[full].charAt(0).toUpperCase() + words[full].slice(1)} ${full === 1 ? 'match' : 'matches'} for what you asked, closest first` : `${words[full].charAt(0).toUpperCase() + words[full].slice(1)} ${full === 1 ? 'match' : 'matches'} for what you asked, then the closest ${matches.length - full === 1 ? 'alternative' : 'alternatives'}`}</p>
          {#if hiddenByWidth.length}
            <div class="widthnote">
              <p>Left out because you gave a width: the {hiddenByWidth.map((m) => m.name).join(hiddenByWidth.length === 2 ? ' and ' : ', ').replace(/, ([^,]*)$/, ' and $1')}, which would otherwise be among your matches. {hiddenByWidth[0].brand}'s published sizes for {hiddenByWidth.length === 1 ? 'it' : 'them'} conflict with its own guidance, so we can't check {hiddenByWidth.length === 1 ? 'it' : 'them'} against your {widthIn} {u}.</p>
              <button type="button" class="ghost" onclick={() => (widthIn = null)}>Show {hiddenByWidth.length === 1 ? 'it' : 'them'} without the width</button>
            </div>
          {/if}
          {@const c = counter}
          {#if sized.length}
          <svg viewBox="0 0 {CW} {c.H}" class="counter" role="img" aria-label="Your shortlist on a counter, drawn to one scale: {matches.map((x) => x.machine.dims ? `${x.machine.brand} ${x.machine.name}, ${len(x.machine.dims.w)} ${u} wide and ${len(x.machine.dims.h)} ${u} tall` : `${x.machine.brand} ${x.machine.name}, size unclear`).join('; ')}{needs.heightCm ? `, under cabinets ${heightIn} ${u} high` : ''}{needs.widthCm ? `, in ${widthIn} ${u} of width` : ''}.">
            <rect x="0" y={c.FLOOR} width={CW} height={c.H - c.FLOOR} class="top" />
            <line x1="0" y1={c.FLOOR} x2={CW} y2={c.FLOOR} class="edge" />
            {#if needs.heightCm}
              {@const cy = c.FLOOR - needs.heightCm * c.s}
              <rect x="0" y="0" width={CW} height={cy} class="cab" /><line x1="0" y1={cy} x2={CW} y2={cy} class="cabline" />
              <text x={CW - 10} y="13" text-anchor="end" class="cablbl">Under your cabinets · {heightIn} {u}</text>
            {/if}
            {#each c.placed as p, i (p.m.id)}
              {#if needs.widthCm}
                <!-- the width you have, at the same scale -->
                <path d="M{p.slotX} {c.FLOOR + 50} l0 -6 L{p.slotX + p.slotW} {c.FLOOR + 44} l0 6" class="slot" />
                <text x={p.slotX + p.slotW / 2} y={c.FLOOR + 63} text-anchor="middle" class="slotl">your {widthIn} {u}</text>
              {/if}
              {@render machineShape(p.m, p.x, p.w, p.h, p.known, c.FLOOR)}
              {#if needs.heightCm && neededHeight(p.m)}
                <!-- the room left under the cabinets, read in the cabinet band right above each machine -->
                {@const cy = c.FLOOR - needs.heightCm * c.s}
                <line x1={p.x + p.w / 2} y1={c.FLOOR - p.h} x2={p.x + p.w / 2} y2={cy} class="gapl" />
                <text x={p.x + p.w / 2} y={cy - 6} text-anchor="middle" class="clear">{len(needs.heightCm - neededHeight(p.m)!)} {u}{c.compact ? '' : ' to spare'}{p.m.clearanceCm && p.m.dims && p.m.clearanceCm > p.m.dims.h ? (c.compact ? '*' : ', by the maker\'s clearance') : ''}</text>
              {/if}
              <text x={p.x + p.w / 2} y={c.FLOOR + 17} text-anchor="middle" class="mlbl"><tspan class="rank" class:solo={c.compact}>{i + 1}</tspan>{c.compact ? '' : ` ${p.m.name}`}</text>
              <text x={p.x + p.w / 2} y={c.FLOOR + 32} text-anchor="middle" class="mdim">{p.known ? (c.compact ? `${len(drawW(p.m))} × ${len(p.m.dims!.h)}` : `${len(drawW(p.m))} wide × ${len(p.m.dims!.h)} tall`) : p.m.clearanceCm ? (c.compact ? `needs ${len(p.m.clearanceCm)} ${u}` : `size unclear · needs ${len(p.m.clearanceCm)} ${u}`) : (c.compact ? 'size n/e' : 'size not established')}</text>
            {/each}
            <g class="bar"><line x1="12" y1={c.H - 10} x2={12 + c.barPx} y2={c.H - 10} /><line x1="12" y1={c.H - 14} x2="12" y2={c.H - 6} /><line x1={12 + c.barPx} y1={c.H - 14} x2={12 + c.barPx} y2={c.H - 6} /><text x={18 + c.barPx} y={c.H - 6} class="barl">{c.barLabel}</text></g>
          </svg>
          <p class="cap">{counter.compact ? `Numbered as the cards below: ${matches.map((x, i) => `${i + 1} ${x.machine.name}`).join(', ')}. ` : ''}Drawn to one scale from the makers' published sizes, width × height{needs.widthCm ? ', each in the width you gave' : ''}.{matches.some((x) => !x.machine.dims) ? ` Dashed: ${lowerFirst(sizeWhy(matches.filter((x) => !x.machine.dims).map((x) => x.machine as M)))} ${dashedCap(matches.filter((x) => !x.machine.dims).map((x) => x.machine as M))}` : ''}</p>
          {/if}
          <ol class="cards">
            {#each matches as x, i (x.machine.id)}
              {@const m = x.machine as M}
              <li class="card">
                <p class="ck"><span class="rank">{i + 1}</span>{m.category ? CATEGORY_LABEL[m.category] : ''}</p>
                <h3>{m.brand} {m.name}</h3>
                <p class="band">About {band(x.band)}{needsGrinder(m) ? ' with a grinder' : ''}</p>
                {#if m.listPrice.seller}<p class="fine">Machine price: the {m.listPrice.kind}.</p>{/if}
                {#if needsGrinder(m) && grinderPrices.length}<p class="fine">Machine {money(m.listPrice.usd!)}, plus an espresso grinder from about {money(r(grinderPrices[0]))} to {money(r(grinderPrices[grinderPrices.length - 1]))}.</p>{/if}
                <p class="rankn">{rankNote(i)}</p>
                <ul class="why">{#each [...x.why, ...fitLines(m)] as w (w)}<li>{w}</li>{/each}</ul>
                <ul class="trade">{#each [...tradeoffs(x), ...(tightLine(m) ? [tightLine(m)!] : [])] as t (t)}<li>{t}</li>{/each}</ul>
                <dl class="mini">
                  {#if m.capsuleLine}<div><dt>Capsules</dt><dd>Nespresso {LINE[m.capsuleLine]}</dd></div>
                  {:else if m.heating.system}<div><dt>Heats</dt><dd>{heatLabel(m)}{shortTerm(m) ? ` (${shortTerm(m)})` : ''}</dd></div>
                  {:else}<div aria-hidden="true"></div>{/if}
                  <div><dt>Milk</dt><dd>{m.milk.type ? MILK[m.milk.type] : NE}</dd></div>
                  {#if m.dims}<div><dt>Size, W × D × H</dt><dd>{sizeText(m)}</dd></div>
                  {:else}<div><dt>Height to allow</dt><dd>{m.dimsUnclear && neededHeight(m) ? `About ${len(neededHeight(m)!)} ${u}, ${allowWhy(m)}` : NE}</dd></div>{/if}
                </dl>
                <div class="acts">
                  {#if m.amazon}<a class="go" href={m.amazon.url} rel="sponsored noopener" target="_blank">See it on Amazon</a>
                  {:else if m.listPrice.url}<a class="go" href={m.listPrice.url} rel="noopener" target="_blank">{m.listPrice.seller ? `${m.listPrice.seller} ↗` : 'The maker\'s page ↗'}</a>{/if}
                  {#if m.capsuleLine}<a class="ghost" href={`/tools/nespresso-pods/?line=${m.capsuleLine}`}>See its capsules</a>{/if}
                  <button type="button" class="ghost" onclick={() => openOwn(m.id)}>Dose and care</button>
                  {#if m.heating.system && HEATS.includes(m.heating.system)}<button type="button" class="ghost" onclick={() => { pickHeat(m.heating.system!); document.getElementById('how-it-heats')?.scrollIntoView({ behavior: 'smooth' }); }}>How it brews and steams</button>{/if}
                </div>
              </li>
            {/each}
          </ol>
          <!-- after the answer, not before it (gate r2): why there's no drawing, and where the prices come from -->
          {#if !sized.length}<p class="cap nodraw">No drawing to scale: {sizeWhy(matches.map((x) => x.machine as M))}{clearanceText(matches.map((x) => x.machine as M))}</p>{/if}
          <p class="shared">Prices are what each maker's US site or shop showed on October 15, 2026, or, where a maker doesn't sell direct, its US importer or an authorized dealer; they change. Amazon links go to the exact model; as an Amazon Associate we earn from qualifying purchases.</p>
        {:else}
          <div class="none">
            <p class="kick">Nothing fits all of that</p>
            {#if nearest}
              <p>No current machine meets your routine{needs.widthCm || needs.heightCm ? ' and counter' : ''} at {money(budget)}. {nearest.misses.length ? 'The closest is the' : 'The least you could spend on one that meets it is the'} <b>{nearest.machine.brand} {nearest.machine.name}</b>, at about {band(nearest.band)}{needsGrinder(nearest.machine) ? ' with a grinder' : ''}.</p>
              <button type="button" class="go" onclick={() => (budget = Math.min(5000, Math.ceil(nearest!.band!.low / 50) * 50))}>Set the budget to {money(Math.ceil(nearest.band!.low / 50) * 50)}</button>
              <p class="fine">The budget moves in $50 steps, so this is the first step that covers it.</p>
            {:else}
              <p>No current machine with a published size fits that counter. Try clearing the width or height.</p>
            {/if}
          </div>
        {/if}
        <p class="method">Only current machines with a dated price and a known milk system are suggested.{needs.widthCm ? ` With a width given, the ${machines.filter((m) => m.status === 'current' && m.category && m.listPrice.usd && m.milk.type && !m.dims).length} of those without a clear published size are left out.` : ''} {machines.filter((m) => m.status === 'current' && !(m.category && m.listPrice.usd && m.milk.type)).length} more current machines are in <button type="button" class="linkish" onclick={() => (mode = 'all')}>All {machines.length}</button>, with what's missing.</p>
      </section>
    </div>
  {:else if mode === 'own'}
    <div class="own">
      {#if badOwnLink}<p class="widthnote" role="status">That link named a machine this guide doesn't include. Pick yours below; the care notes that follow are for the machine shown.</p>{/if}
      <label class="pickm"><span class="lbl">Your machine</span>
        <select bind:value={ownId} onchange={() => (badOwnLink = false)}>
          {#each brands as b (b)}<optgroup label={b}>{#each machines.filter((m) => m.brand === b) as m (m.id)}<option value={m.id}>{m.brand} {m.name}{m.variant ? `, ${m.variant}` : ''}{m.code ? ` · ${m.code}` : ''}</option>{/each}</optgroup>{/each}
        </select>
      </label>
      <div class="ownbody">
        <div class="ownhead">
          <p class="ck">{own.category ? CATEGORY_LABEL[own.category] : 'Category not established'}{statusNote(own) ? ` · ${statusNote(own)}` : ''}</p>
          <h3>{fullName(own)}</h3>
          <dl class="specs">
            {#if own.category !== 'capsule'}<div><dt>Heats</dt><dd>{heatLabel(own)}{shortTerm(own) ? ` (${shortTerm(own)})` : ''}</dd></div>{/if}
            {#if own.portafilterMm}<div><dt>Portafilter</dt><dd>{own.portafilterMm} mm</dd></div>{/if}
            {#if own.owner?.baskets}<div><dt>Baskets</dt><dd>{own.owner.baskets}</dd></div>{/if}
            <div><dt>Milk</dt><dd>{own.milk.type ? MILK[own.milk.type] : NE}</dd></div>
            {#if own.tankL}<div><dt>Water tank</dt><dd>{own.tankL} L</dd></div>{/if}
            <div><dt>Size, W × D × H</dt><dd>{own.dimsUnclear ? unclearNote(own) : sizeText(own)}</dd></div>
          </dl>
        </div>
        <div class="care">
          <div class="note"><p class="lbl">Dose and recipe</p><p>{own.owner?.recipe ?? own.owner?.dose ?? (makesEspressoByHand(own) ? 'The maker\'s materials we checked give no dose. Our Brew Guide starts espresso at 18 g of coffee for 36 g in the cup.' : 'Set by the machine: there is no dose to weigh.')}</p>{#if own.owner?.recipe && own.owner?.dose}<p>{own.owner.dose}</p>{/if}</div>
          <div class="note"><p class="lbl">Temperature</p><p>{own.owner?.temperature ?? 'The maker\'s materials we checked give no brew temperature.'}</p></div>
          <div class="note"><p class="lbl">Descaling</p><p>{own.owner?.descale ?? 'The maker\'s materials we checked give no descaling interval; the manual has the procedure.'}</p></div>
          {#if own.owner?.clean}<div class="note"><p class="lbl">Cleaning</p><p>{own.owner.clean}</p></div>{/if}
          <div class="acts">
            {#if own.care?.manualUrl}<a class="go" href={own.care.manualUrl} rel="noopener" target="_blank">The maker's manual{zipNote(own.care.manualUrl)} ↗</a>{/if}
            {#if makesEspressoByHand(own)}<a class="ghost" href="/tools/brew-ratio/?method=espresso&dose=18">Brew an espresso in the Brew Guide</a>{/if}
            <a class="ghost" href="/tools/fix-my-coffee/?method=espresso">Fix a shot</a>
          </div>
          <p class="fine">From the maker's own pages and manual, checked October 15, 2026. Machine water and descaling follow the maker's specification.</p>
        </div>
      </div>
    </div>
  {:else}
    <div class="all">
      <p class="quiet">All {machines.length} machines in this guide, from the makers' published specs, checked October 15, 2026. Pick a machine for its dose and care.</p>
      <p class="key"><span class="ne">n/e</span> not established: the maker's materials we checked don't say · <span class="ne">n/a</span> doesn't apply · <span class="ne">unclear</span> the maker's listed size conflicts with its own guidance</p>
      {#each [...CATS, null] as cat (cat ?? 'none')}
        {@const list = machines.filter((m) => m.category === cat)}
        {#if list.length}
          <h3 class="cath">{cat ? CATEGORY_LABEL[cat] : 'Not yet placed'} <span>{list.length}</span></h3>
          <div class="tw"><table>
            <colgroup><col class="c1" /><col class="c2" /><col class="c3" /><col class="c4" /><col class="c5" /></colgroup>
            <thead><tr><th scope="col">Machine</th><th scope="col">Heats</th><th scope="col">Milk</th><th scope="col">W × D × H</th><th scope="col">Price seen</th></tr></thead>
            <tbody>
              {#each list as m (m.id)}
                <tr>
                  <th scope="row"><button type="button" class="linkish" onclick={() => openOwn(m.id)}>{m.brand} {m.name}</button>{#if m.variant}<small>{m.variant}</small>{/if}{#if statusNote(m)}<small>{statusNote(m)}</small>{/if}</th>
                  <td class:ne={!m.heating.system}>{m.category === 'capsule' ? 'n/a' : m.heating.system ? heatLabel(m) : 'n/e'}</td>
                  <td class:ne={!m.milk.type}>{m.milk.type ? MILK[m.milk.type] : 'n/e'}</td>
                  <td class:ne={!m.dims}>{m.dims ? sizeText(m) : m.dimsUnclear ? 'unclear' : 'n/e'}</td>
                  <td class:ne={!m.listPrice.usd}>{m.listPrice.usd ? money(m.listPrice.usd) : 'n/e'}{#if m.listPrice.seller}<small>{m.listPrice.seller}</small>{/if}</td>
                </tr>
              {/each}
            </tbody>
          </table></div>
        {/if}
      {/each}
    </div>
  {/if}

  <!-- No steam explainer where it doesn't apply: an all-capsule shortlist, or an owner's capsule, lever or no-steam machine (WB2 Opus). -->
  {#if !(mode === 'find' && matches.length && matches.every((x) => x.machine.category === 'capsule')) && !(mode === 'own' && (own.category === 'capsule' || own.category === 'manual-lever' || own.milk.type === 'none' || !own.heating.system))}
  <section class="heat" id="how-it-heats" aria-label="How each heating system brews and steams">
    <p class="kick">How it brews and steams</p>
    <div class="htabs" role="tablist" aria-label="Heating system">
      {#each HEATS as k (k)}<button type="button" role="tab" aria-selected={heatTab === k} onclick={() => pickHeat(k)}>{HEAT[k as Heating]}</button>{/each}
    </div>
    <div class="hbody">
      <svg viewBox="0 0 360 230" class="schem" role="img" aria-label="{HEAT[heatTab as Heating]}: {TOGETHER[heatTab][1]} Now: {seq[step]?.[1] ?? ''}" data-phase={ph}>
        <!-- can it brew and steam at the same time: readable in a still -->
        <text x="14" y="20" class="badgek">Brew + steam together</text>
        <text x="14" y="42" class="badgev" class:yes={TOGETHER[heatTab][0]}>{TOGETHER[heatTab][0] ? 'Yes' : 'No, one after the other'}</text>
        <!-- tank -->
        <rect x="14" y="96" width="40" height="76" rx="6" class="tank" /><text x="34" y="188" text-anchor="middle" class="sl">Tank</text>
        {#if heatTab === 'dual-boiler'}
          <rect x="96" y="64" width="98" height="52" rx="12" class="heater" /><text x="145" y="94" text-anchor="middle" class="hl">Brew boiler</text>
          <rect x="96" y="140" width="98" height="52" rx="12" class="heater" /><text x="145" y="170" text-anchor="middle" class="hl">Steam boiler</text>
          <path d="M54 120 C 74 120, 76 90, 96 90" class="pipe pbrew" /><path d="M54 150 C 74 150, 76 166, 96 166" class="pipe psteam" />
          <path d="M194 90 C 218 90, 222 62, 246 62 L 262 62 L 262 70" class="pipe pbrew" />
          <path d="M194 166 L 300 166 L 300 152" class="pipe psteam" />
        {:else if heatTab === 'heat-exchanger'}
          <rect x="92" y="76" width="110" height="112" rx="16" class="heater" /><text x="147" y="100" text-anchor="middle" class="hl">Steam boiler</text>
          <!-- the heat exchanger: fresh brew water in its own tube through the boiler -->
          <path d="M54 140 L 98 140 C 122 140, 118 120, 140 124 C 162 128, 158 150, 180 146 C 196 143, 196 120, 200 112" class="pipe pbrew hxpath" />
          <text x="147" y="204" text-anchor="middle" class="sl">brew water's own tube</text>
          <path d="M200 112 C 220 112, 222 62, 246 62 L 262 62 L 262 70" class="pipe pbrew" />
          <path d="M202 168 L 300 168 L 300 152" class="pipe psteam" />
        {:else}
          <rect x="96" y="90" width="100" height="80" rx={heatTab === 'thermoblock' ? 6 : 16} class="heater" />
          <text x="146" y="128" text-anchor="middle" class="hl">{heatTab === 'thermoblock' ? 'Thermoblock' : 'Boiler'}</text>
          <text x="146" y="146" text-anchor="middle" class="hlsm">one heater</text>
          <path d="M54 134 L 96 134" class="pipe pin" />
          <path d="M196 104 C 220 104, 222 62, 246 62 L 262 62 L 262 70" class="pipe pbrew" />
          <path d="M196 156 L 300 156 L 300 152" class="pipe psteam" />
          <!-- the switch between brew and steam -->
          <g class="switch"><circle cx="214" cy="130" r="11" /><text x="214" y="134" text-anchor="middle">⇅</text></g>
        {/if}
        <!-- group head over the cup -->
        <rect x="240" y="70" width="44" height="14" rx="3" class="group" /><text x="290" y="81" class="sl">Group</text>
        <line x1="262" y1="86" x2="262" y2="112" class="flow fbrew" />
        <path d="M250 114 L 274 114 L 271 136 L 253 136 Z" class="cup" />
        <!-- steam wand into a milk jug -->
        <line x1="300" y1="152" x2="322" y2="194" class="wandl" /><text x="342" y="146" text-anchor="end" class="sl">Wand</text>
        <path d="M312 198 L 340 198 L 337 222 L 315 222 Z" class="jug" />
        <path d="M318 196 q5 -9 10 0 q5 -9 10 0" class="flow fsteam" />
      </svg>
      <div class="steps">
        <p class="simul">{TOGETHER[heatTab][1]}</p>
        <ol>{#each seq as [, s], i (i)}<li class:on={i === step}><button type="button" class="stepbtn" onclick={() => { stop(); step = i; }} aria-current={i === step ? 'step' : undefined}>{s}</button></li>{/each}</ol>
        <div class="acts"><button type="button" class="go" onclick={play}>{playing ? 'Pause' : step > 0 ? 'Play from the start' : 'Play the sequence'}</button></div>
        <p class="fine">A schematic of the system, not of any one machine: follow your own manual for timings and controls. No fixed waits are given because the makers don't publish universal ones.</p>
      </div>
    </div>
  </section>
  {/if}
</div>

<style>
  .mc { --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema: #c3873a; --crema-deep: #8f5d22; --water: #2f7484;
    color: var(--ink); font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Metrics', system-ui, sans-serif; }
  .modes { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid var(--rule); border-radius: 999px; background: #fff; margin-bottom: 16px; }
  .modes button { appearance: none; border: 0; background: none; border-radius: 999px; padding: 9px 16px; min-height: 40px; font: 500 14px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink-2); cursor: pointer; white-space: nowrap; }
  .modes button[aria-selected='true'] { background: var(--ink); color: #f3ede3; }
  .lbl { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); display: block; margin: 0 0 8px; }
  .opt { text-transform: none; letter-spacing: 0; }
  .kick { font: 500 11.5px/1.3 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--crema-deep); margin: 0 0 8px; }
  .find { display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); grid-template-areas: 'ask res'; gap: 18px; align-items: start; }
  .peek { display: none; }
  .ask { grid-area: ask; background: var(--card); border: 1px solid var(--rule); border-radius: 18px; padding: 18px; display: grid; gap: 16px; position: sticky; top: 84px; }
  .key { font-size: 12.5px; color: var(--ink-3); margin: 0 0 6px; }
  .key .ne { font: 500 11.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-2); }
  .results { grid-area: res; min-width: 0; }
  /* Jump links land below the fixed site header (WB2 Opus). */
  #chooser-results, #how-it-heats { scroll-margin-top: 84px; }
  fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button, .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'], .seg button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .chips.sm button { min-height: 36px; padding: 6px 11px; font-size: 13px; }
  .effort { display: grid; gap: 6px; }
  .effort button { appearance: none; text-align: left; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 10px 12px; min-height: 44px; cursor: pointer; color: var(--ink); font: inherit; }
  .effort button[aria-pressed='true'] { border-color: var(--ink); background: var(--ink); color: #f3ede3; }
  .effort button[aria-pressed='true'] small { color: #cdbba6; }
  .effort b { display: block; font-weight: 600; font-size: 15px; }
  .effort small { color: var(--ink-3); font-size: 13px; }
  .budget { display: grid; gap: 8px; }
  .bval { font: 400 34px/1 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; }
  .budget input[type=range] { width: 100%; accent-color: var(--crema-deep); min-height: 32px; }
  .space { display: flex; flex-wrap: wrap; gap: 10px 12px; align-items: end; }
  .space label { display: grid; gap: 4px; font-size: 12.5px; color: var(--ink-2); }
  .inp { display: inline-flex; align-items: center; gap: 6px; }
  .inp input { width: 84px; font: 500 15px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 10px; min-height: 42px; }
  .inp i { font: 500 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; font-style: normal; color: var(--ink-3); }
  .seg { display: inline-flex; gap: 4px; }
  .counter { width: 100%; height: auto; background: linear-gradient(#fffdf9, #f1e7d9); border: 1px solid var(--rule); border-radius: 16px; }
  .top { fill: #e6d6bf; }
  .edge { stroke: #b59a77; stroke-width: 2; }
  .cab { fill: #3a2a20; opacity: .1; }
  .cabline { stroke: #3a2a20; stroke-width: 2; stroke-dasharray: 6 4; }
  .cablbl, .clear { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: var(--ink-2); }
  .clear { fill: #2f7484; }
  .gapl { stroke: #2f7484; stroke-width: 1.2; stroke-dasharray: 2 3; }
  .slot { fill: none; stroke: #2f7484; stroke-width: 1.5; }
  .slotl { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: #2f7484; }
  .mach .body { fill: #2a1d15; }
  .mach .lid { fill: #3a2a20; }
  .mach.unknown .body { fill: rgba(117, 101, 90, .06); stroke: #75655a; stroke-dasharray: 5 4; stroke-width: 1.5; }
  .qmark { font: 400 26px 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; fill: #75655a; }
  .mach .spout { fill: #75655a; }
  .mach .tray { fill: #9c8f82; }
  .mach .screen { fill: #2f7484; opacity: .75; }
  .mach .handle { stroke: #2a1d15; stroke-width: 5; stroke-linecap: round; }
  .mach .wand { stroke: #9c8f82; stroke-width: 3; stroke-linecap: round; }
  .mach .lever { stroke: #2a1d15; stroke-width: 6; stroke-linecap: round; }
  .mach .hopper { fill: #5b4a3d; }
  .mach .gauge { fill: #f3ede3; stroke: #9c8f82; stroke-width: 1; }
  .mlbl { font: 400 15px 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; fill: var(--ink); }
  .mlbl .rank { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: var(--crema-deep); }
  .mlbl .rank.solo { font-size: 14px; }
  .mdim { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: var(--ink-3); }
  .bar line { stroke: var(--ink-2); stroke-width: 1.5; }
  .barl { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: var(--ink-2); }
  .cap { margin: 8px 0 10px; font-size: 13px; color: var(--ink-3); }
  .cap.nodraw { margin-top: 16px; padding: 12px 14px; border: 1px dashed var(--rule); border-radius: 14px; background: #fffdf9; }
  .shared { margin: 14px 0 10px; font-size: 12.5px; color: var(--ink-3); }
  .cards { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
  .card { background: #fff; border: 1px solid var(--rule); border-radius: 16px; padding: 16px 18px; }
  .ck { margin: 0; font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); display: flex; align-items: center; gap: 8px; }
  .ck .rank { display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--crema-deep); color: var(--crema-deep); letter-spacing: 0; }
  h3 { font: 400 28px/1.1 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; margin: 6px 0 4px; }
  .band { margin: 0; font: 500 15px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink); }
  .fine { margin: 4px 0 0; font-size: 12.5px; color: var(--ink-3); }
  td small + small, td small { display: block; font: 400 11.5px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink-3); }
  .rankn { margin: 10px 0 0; font-size: 14px; color: var(--ink); font-weight: 500; }
  .why, .trade { margin: 8px 0 0; padding: 0; list-style: none; display: grid; gap: 4px; font-size: 14.5px; }
  .why li, .trade li { padding-left: 22px; position: relative; color: var(--ink-2); }
  .why li::before { content: '✓'; position: absolute; left: 2px; color: #2f7484; font-weight: 600; }
  .trade li::before { content: '–'; position: absolute; left: 4px; color: #a0522d; font-weight: 600; }
  .mini { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 12px 0 0; padding-top: 10px; border-top: 1px dashed var(--rule); }
  .mini dt, .specs dt { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .mini dd, .specs dd { margin: 2px 0 0; font-size: 14px; color: var(--ink); }
  .acts { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .go { background: var(--ink); color: #f3ede3; border: 0; border-radius: 999px; padding: 10px 16px; font: 600 14px/1.2 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; cursor: pointer; }
  .ghost { border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 9px 13px; font: 500 14px/1.2 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; text-decoration: none; min-height: 44px; display: inline-flex; align-items: center; cursor: pointer; }
  .none { background: #fff8ec; border: 1px solid #e9c48f; border-radius: 14px; padding: 14px 16px; display: grid; gap: 10px; justify-items: start; }
  .none p { margin: 0; }
  .linkish { appearance: none; border: 0; background: none; padding: 0; color: var(--crema-deep); text-decoration: underline; text-underline-offset: 3px; font: inherit; cursor: pointer; text-align: left; }
  .method { margin: 12px 0 0; font-size: 13px; color: var(--ink-3); }
  .own { display: grid; gap: 14px; }
  .pickm select { width: 100%; max-width: 560px; appearance: none; font: 500 16px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; padding: 10px 36px 10px 12px; border: 1px solid var(--rule); border-radius: 10px; color: var(--ink); min-height: 46px; background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%235b4a3d' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 14px center; }
  .ownbody { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr); gap: 16px; }
  .ownhead, .care { background: #fff; border: 1px solid var(--rule); border-radius: 16px; padding: 16px 18px; }
  .specs { display: grid; gap: 10px; margin: 12px 0 0; }
  .note { padding: 10px 12px; border-left: 3px solid var(--crema); background: #fff8ec; border-radius: 0 10px 10px 0; margin-bottom: 10px; }
  .note p { margin: 0; font-size: 14.5px; color: var(--ink-2); }
  .note p + p { margin-top: 4px; }
  .note .lbl { margin-bottom: 4px; }
  .quiet { color: var(--ink-3); font-size: 14px; margin: 0 0 10px; }
  .cath { font: 400 24px 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; margin: 18px 0 6px; }
  .cath span { font: 500 12px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); }
  .tw { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; table-layout: fixed; min-width: 640px; }
  .c1 { width: 30%; } .c2 { width: 16%; } .c3 { width: 20%; } .c4 { width: 20%; } .c5 { width: 14%; }
  th, td { text-align: left; padding: 8px 8px; border-bottom: 1px solid #e6dccd; vertical-align: top; }
  thead th { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); white-space: nowrap; }
  tbody th { font-weight: 500; }
  tbody th small { display: block; font-weight: 400; color: var(--ink-3); font-size: 12px; }
  td.ne { font: 400 12.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-3); }
  .heat { margin-top: 28px; background: var(--card); border: 1px solid var(--rule); border-radius: 18px; padding: 18px; }
  .htabs { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .htabs button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 8px 13px; min-height: 40px; font: 500 13.5px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink-2); cursor: pointer; }
  .htabs button[aria-selected='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  .hbody { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 18px; align-items: start; }
  .schem { width: 100%; height: auto; background: #fff; border: 1px solid var(--rule); border-radius: 14px; }
  .badgek { font: 500 10px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .12em; text-transform: uppercase; fill: var(--ink-3); }
  .badgev { font: 400 19px 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; fill: #a0522d; }
  .badgev.yes { fill: #2f7484; }
  .tank { fill: #dbeef1; stroke: #2f7484; stroke-width: 1.5; }
  .heater { fill: #3a2a20; transition: filter .4s; }
  .hl { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: #f3ede3; }
  .hlsm { font: 400 9.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: #cdbba6; }
  .sl { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; fill: var(--ink-3); }
  .pipe { fill: none; stroke: #cdbba6; stroke-width: 4; stroke-linecap: round; transition: stroke .4s; }
  .hxpath { stroke-width: 3.5; }
  .switch circle { fill: #fff; stroke: #75655a; stroke-width: 1.5; }
  .switch text { font: 600 12px 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; fill: var(--ink-2); }
  .group { fill: #5b4a3d; }
  .cup, .jug { fill: #fbf8f3; stroke: #5b4a3d; stroke-width: 1.5; }
  .wandl { stroke: #9c8f82; stroke-width: 4; stroke-linecap: round; }
  .flow { fill: none; stroke-width: 3; opacity: 0; transition: opacity .4s; }
  .fbrew { stroke: #7a4e30; stroke-dasharray: 4 5; }
  .fsteam { stroke: #9c8f82; }
  .schem[data-phase='heat'] .heater, .schem[data-phase='wait'] .heater { filter: drop-shadow(0 0 6px #c3873a); }
  .schem[data-phase='brew'] .pbrew, .schem[data-phase='both'] .pbrew { stroke: #2f7484; }
  .schem[data-phase='steam'] .psteam, .schem[data-phase='both'] .psteam { stroke: #9c8f82; stroke-width: 5; }
  /* Water is drawn from the tank to brew; steaming a boiler doesn't draw it, so the inlet lights for brewing only (gate r3). */
  .schem[data-phase='brew'] .pin, .schem[data-phase='both'] .pin { stroke: #2f7484; }
  .schem[data-phase='brew'] .fbrew, .schem[data-phase='both'] .fbrew { opacity: 1; animation: drip 1s linear infinite; }
  .schem[data-phase='steam'] .fsteam, .schem[data-phase='both'] .fsteam { opacity: 1; }
  @keyframes drip { to { stroke-dashoffset: -18; } }
  .steps .simul { margin: 0 0 8px; font-size: 15px; color: var(--ink); }
  .steps ol { margin: 0; padding-left: 20px; display: grid; gap: 4px; }
  .steps li.on .stepbtn { color: var(--ink); font-weight: 600; }
  .stepbtn { appearance: none; border: 0; background: none; padding: 4px 0; text-align: left; font: 400 14px/1.45 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; color: var(--ink-3); cursor: pointer; min-height: 32px; }
  button:focus-visible, a:focus-visible, select:focus-visible, input:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  @media (max-width: 900px) {
    .find { grid-template-columns: 1fr; grid-template-areas: 'peek' 'ask' 'res'; }
    .ask { position: static; }
    .peek { grid-area: peek; display: grid; grid-template-columns: auto 1fr; grid-template-areas: 'l l' 'n p'; gap: 2px 10px; align-items: baseline; padding: 12px 14px; border-radius: 14px; background: var(--ink); color: #f3ede3; text-decoration: none; }
    .peek .lbl { grid-area: l; color: #cdbba6; margin: 0; }
    .peek b { grid-area: n; font: 400 22px/1.1 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; }
    .peek span:last-child { grid-area: p; font: 500 13px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; text-align: right; }
    .ownbody, .hbody { grid-template-columns: 1fr; }
    .mini { grid-template-columns: 1fr 1fr; }
    h3 { font-size: 25px; }
    .mlbl { font-size: 14px; }
  }
  @media (max-width: 420px) { .modes button { padding: 9px 12px; } }
  @media (prefers-reduced-motion: reduce) { .schem .fbrew { animation: none; } .pipe, .flow, .heater { transition: none; } }
  .widthnote { margin: 0 0 12px; padding: 12px 14px; border-radius: 14px; border: 1px solid #e9c48f; background: #fff8ec; display: grid; gap: 8px; justify-items: start; }
  .widthnote p { margin: 0; font-size: 14.5px; color: var(--ink); }
  .schem[data-phase='steam'] .psteam, .schem[data-phase='both'] .psteam { stroke: #c3873a !important; stroke-width: 5; }
  .schem[data-phase='steam'] .fsteam, .schem[data-phase='both'] .fsteam { stroke: #c3873a; }
  /* Phones: the drawings scale down, so their words scale up (gate r2). */
  @media (max-width: 640px) {
    .mdim, .slotl, .clear, .barl, .cablbl { font-size: 13px; }
    .mlbl { font-size: 16px; }
    .hl { font-size: 13px; } .hlsm, .sl { font-size: 12.5px; } .badgek { font-size: 11.5px; } .badgev { font-size: 22px; }
  }
</style>
