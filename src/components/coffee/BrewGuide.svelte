<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import BrewStage from './BrewStage.svelte';
  import {
    METHODS, buildRecipe, simulate, encodeBrew, decodeBrew,
    cToF, mlToFlOz, flOzToMl, approxTablespoons,
  } from '../../lib/coffee/index.ts';
  import type { MethodId, Roast, Strength, Units, RecipeInput, Frame, Adjust } from '../../lib/coffee/index.ts';

  type Target = { cupMl: number } | { doseG: number } | { waterG: number };

  // Targets offered per brewer. US sizes in fl oz, metric in ml; espresso and moka by dose.
  const CUPS_US = [6, 8, 10, 12, 16, 20];
  const CUPS_METRIC = [180, 240, 300, 350, 475];
  const BATCH_US = [16, 32, 48, 64];
  const BATCH_METRIC = [500, 1000, 1500, 2000];
  const ESPRESSO_DOSES = [14, 16, 18, 20, 22];
  const MOKA_DOSES = [10, 15, 20, 30];
  const DEFAULTS: Record<MethodId, Target> = {
    v60: { cupMl: flOzToMl(12) }, chemex: { cupMl: flOzToMl(16) }, kalita: { cupMl: flOzToMl(12) },
    'french-press': { cupMl: flOzToMl(16) }, aeropress: { cupMl: flOzToMl(8) }, 'cold-brew': { cupMl: flOzToMl(32) },
    'drip-machine': { cupMl: flOzToMl(32) }, espresso: { doseG: 18 }, moka: { doseG: 15 },
  };
  const STRENGTH_LABEL: Record<Strength, string> = { lighter: 'Lighter', classic: 'Classic', stronger: 'Stronger' };
  const ESPRESSO_LABEL: Record<Strength, string> = { lighter: 'Longer 1:2.5', classic: 'Classic 1:2', stronger: 'Shorter 1:1.5' };

  let method = $state<MethodId>('v60');
  let units = $state<Units>('us');
  let strength = $state<Strength>('classic');
  let roast = $state<Roast>('medium');
  let ratioOverride = $state<number | undefined>(undefined);
  let target = $state<Target>(DEFAULTS.v60);
  let mounted = $state(false);
  let adjust = $state<Adjust | undefined>(undefined);
  const ADJUST_TEXT: Record<Adjust, string> = {
    finer: 'Grind one step finer than last time.', coarser: 'Grind one step coarser than last time.',
    hotter: 'Use water right off the boil this time.', cooler: 'Let the water cool for about a minute off the boil.',
  };

  let m = $derived(METHODS.find((x) => x.id === method)!);
  let byDose = $derived(method === 'espresso' || method === 'moka');
  let isBatch = $derived(method === 'cold-brew' || method === 'drip-machine');
  let input = $derived<RecipeInput>({ method, target, strength, roast, ...(ratioOverride !== undefined ? { ratio: ratioOverride } : {}) });
  let result = $derived(buildRecipe(input));
  let recipe = $derived(result.ok ? result.value : null);
  let sim = $derived(recipe ? simulate(recipe) : null);

  // ── brew-along ──
  let mode = $state<'plan' | 'brew'>('plan');
  let t = $state(0);
  let playing = $state(false);
  let speed = $state(1);
  let raf = 0;
  // Wall-clock timing: the brew keeps time even while the tab is hidden and frames stop.
  let wallStart = 0, tAtStart = 0;
  function tick(now: number) {
    if (!playing || !sim) return;
    t = Math.min(sim.durationS, tAtStart + ((now - wallStart) / 1000) * speed);
    if (t >= sim.durationS) { playing = false; return; }
    raf = requestAnimationFrame(tick);
  }
  function play(s: number) {
    if (!sim) return;
    cancelAnimationFrame(raf);
    if (mode !== 'brew' || t >= sim.durationS) t = 0;
    mode = 'brew'; speed = s; playing = true;
    tAtStart = t; wallStart = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function pause() { playing = false; cancelAnimationFrame(raf); }
  function reset() { pause(); t = 0; mode = 'plan'; }
  // Any change to the recipe ends a brew in progress.
  // Track only the recipe input: reading `mode` here would reset the brew the moment it starts.
  $effect(() => { void JSON.stringify(input); untrack(() => { if (mode === 'brew') reset(); }); });

  const EMPTY: Frame = { tS: 0, scaleG: 0, brewerG: 0, cupG: 0, pouring: false, dripping: false, stepIndex: 0 };
  let frame = $derived(sim ? sim.at(mode === 'brew' ? t : 0) : EMPTY);
  let done = $derived(mode === 'brew' && sim !== null && t >= sim.durationS);
  let steep = $derived(recipe && (method === 'cold-brew' || method === 'french-press') ? Math.min(1, frame.tS / recipe.timeS.min) : 0);

  // ── formatting ──
  const r0 = (n: number) => Math.round(n);
  // Coffee to a tenth of a gram (what a brewing scale reads), without a trailing .0.
  const fmtG = (g: number) => { const v = Math.round(g * 10) / 10; return g >= 100 ? String(Math.round(g)) : Number.isInteger(v) ? String(v) : v.toFixed(1); };
  function clock(s: number) {
    if (s >= 3600) return `${Math.floor(s / 3600)} h ${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}`;
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }
  let cupText = $derived(recipe ? (units === 'us' ? `${r0(mlToFlOz(recipe.cupMl))} fl oz` : `${r0(recipe.cupMl)} ml`) : '');
  let tempMain = $derived(recipe ? (units === 'us' ? `${r0(cToF(recipe.tempC))}°F` : `${r0(recipe.tempC)}°C`) : '');
  let tempSub = $derived(recipe ? (units === 'us' ? `${r0(recipe.tempC)}°C` : `${r0(cToF(recipe.tempC))}°F`) : '');
  let tempNote = $derived(method === 'cold-brew' ? 'Cold or room-temperature water' : method === 'moka' ? 'Just boiled, into the base' : method === 'drip-machine' ? 'Set by the machine' : roast === 'light' ? 'Hot end for light roasts' : roast === 'dark' ? 'Cooler for dark roasts' : 'Just off the boil');

  let activeIndex = $derived(mode === 'brew' ? frame.stepIndex : -1);
  let nowStep = $derived(recipe && mode === 'brew' ? recipe.steps[activeIndex] : null);
  let nextStep = $derived(recipe && mode === 'brew' ? recipe.steps.slice(activeIndex + 1).find((s) => s.kind !== 'prep') : null);
  // Cold brew finishes as concentrate: the served drink is made later, so the cue says so instead of "Done".
  let doneText = $derived(!recipe ? '' : method === 'cold-brew' && recipe.dilution
    ? `Concentrate ready: about ${r0(frame.cupG)} g. It isn't the drink yet: to serve, mix it one to one with about ${r0(recipe.dilution.waterG)} g of cold water or milk, over ice.`
    : method === 'espresso' ? `Done: ${r0(frame.cupG)} g of espresso in the cup.` : 'Done. Enjoy it.');
  let cueNow = $derived(!recipe ? '' : done ? doneText : nowStep ? (nowStep.toG !== undefined && nowStep.kind !== 'prep' ? `${nowStep.text} Pour to ${r0(nowStep.toG)} g.` : nowStep.text) : '');
  let cueNext = $derived(!recipe || done ? '' : nextStep ? `Next at ${clock(nextStep.atS)}: ${nextStep.text.split('.')[0].toLowerCase()}.` : '');

  // ── target choices ──
  let choices = $derived.by(() => {
    if (byDose) return (method === 'espresso' ? ESPRESSO_DOSES : MOKA_DOSES).map((g) => ({ label: `${g} g`, t: { doseG: g } as Target }));
    if (isBatch) return (units === 'us' ? BATCH_US : BATCH_METRIC).map((v) => ({ label: units === 'us' ? `${v} oz` : `${v / 1000} L`, t: { cupMl: units === 'us' ? flOzToMl(v) : v } as Target }));
    return (units === 'us' ? CUPS_US : CUPS_METRIC).map((v) => ({ label: units === 'us' ? `${v} oz` : `${v} ml`, t: { cupMl: units === 'us' ? flOzToMl(v) : v } as Target }));
  });
  const same = (a: Target, b: Target) => JSON.stringify(a) === JSON.stringify(b);
  function pickMethod(id: MethodId) { method = id; target = DEFAULTS[id]; ratioOverride = undefined; customOpen = false; }
  function nudgeRatio(d: number) {
    const base = ratioOverride ?? m.ratio[strength];
    const step = method === 'espresso' ? 0.25 : 0.5;
    ratioOverride = Math.round((base + d * step) / step) * step;
  }
  function applyPatch(patch: Record<string, unknown>) {
    if (patch.target) target = patch.target as Target;
    if (typeof patch.ratio === 'number') ratioOverride = patch.ratio;
  }

  // ── URL state ──
  onMount(() => {
    let store: { saved?: { name: string; q: string }[]; last?: string } = {};
    try { store = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '{}') ?? {}; } catch { /* storage unavailable */ }
    if (Array.isArray(store.saved)) saved = store.saved.filter((x) => typeof x?.q === 'string' && decodeBrew(x.q).ok).slice(0, 8);
    const d = decodeBrew(location.search);
    if (d.ok) {
      method = d.value.method; target = d.value.target; strength = d.value.strength ?? 'classic';
      roast = d.value.roast ?? 'medium'; units = d.value.units; ratioOverride = d.value.ratio; adjust = d.value.adjust;
    } else if (!location.search && store.last && decodeBrew(store.last).ok) {
      // No link: pick up where you left off on this device.
      loadSaved(store.last);
    } else if (navigator.language && !/^en-US/i.test(navigator.language) && !location.search) {
      units = 'metric'; if ('cupMl' in target) target = { cupMl: 350 };
    }
    mounted = true;
    return () => cancelAnimationFrame(raf);
  });
  $effect(() => {
    if (!mounted) return;
    const q = encodeBrew({ ...input, units, ...(adjust ? { adjust } : {}) });
    history.replaceState(history.state, '', `${location.pathname}?${q}`);
    untrack(persist);
  });

  // ── custom amounts, including the reverse (start from the coffee or water you have) ──
  type CustomKind = 'cup' | 'dose' | 'water';
  let customOpen = $state(false);
  let customKinds = $derived<{ id: CustomKind; label: string }[]>(
    method === 'espresso' ? [{ id: 'dose', label: 'g coffee in the basket' }, { id: 'cup', label: 'g espresso out' }]
    : method === 'moka' ? [{ id: 'dose', label: 'g coffee, basket level' }]
    : [{ id: 'cup', label: units === 'us' ? (method === 'cold-brew' ? 'fl oz to serve' : 'fl oz in the cup') : (method === 'cold-brew' ? 'ml to serve' : 'ml in the cup') }, { id: 'dose', label: 'g of coffee I have' }, { id: 'water', label: units === 'us' ? 'fl oz of water' : 'ml of water' }]);
  let customKind = $derived<CustomKind>('doseG' in target ? 'dose' : 'waterG' in target ? 'water' : 'cup');
  let customVal = $derived.by(() => {
    const t = target as Record<string, number>;
    const v = 'doseG' in t ? t.doseG : 'waterG' in t ? (units === 'us' ? mlToFlOz(t.waterG) : t.waterG) : method === 'espresso' ? t.cupMl : units === 'us' ? mlToFlOz(t.cupMl) : t.cupMl;
    return Math.round(v * 10) / 10;
  });
  function openCustom() { customOpen = !customOpen; }
  // Switching what the number means keeps the same brew: start from the current recipe's own amount.
  function changeKind(kind: CustomKind) {
    if (!recipe) return;
    target = kind === 'dose' ? { doseG: Math.round(recipe.doseG * 10) / 10 } : kind === 'water' ? { waterG: Math.round(recipe.waterG ?? 0) } : { cupMl: method === 'espresso' ? Math.round(recipe.yieldG ?? 0) : Math.round(recipe.cupMl) };
  }
  function setCustom(v: number, kind: CustomKind) {
    if (!Number.isFinite(v) || v <= 0) return;
    const ml = (x: number) => (units === 'us' && method !== 'espresso' ? flOzToMl(x) : x);
    target = kind === 'dose' ? { doseG: v } : kind === 'water' ? { waterG: ml(v) } : { cupMl: ml(v) };
  }

  // ── saved recipes, on this device only ──
  const SAVE_KEY = 'jayarr-brew-guide-v1';
  let saved = $state<{ name: string; q: string }[]>([]);
  let savedNow = $derived(saved.some((x) => x.q === encodeBrew({ ...input, units })));
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ saved, last: encodeBrew({ ...input, units }) })); } catch { /* storage unavailable */ } }
  function saveRecipe() {
    if (!recipe) return;
    const amount = method === 'espresso' ? `${fmtG(recipe.doseG)} g in, ${r0(recipe.yieldG ?? 0)} g out` : byDose || 'doseG' in target ? `${fmtG(recipe.doseG)} g coffee` : cupText;
    saved = [{ name: `${m.label} · ${amount} · 1:${recipe.ratio}`, q: encodeBrew({ ...input, units }) }, ...saved].slice(0, 8);
    persist();
  }
  function removeSaved(k: number) { saved = saved.filter((_, i) => i !== k); persist(); }
  function loadSaved(q: string) {
    const d = decodeBrew(q);
    if (!d.ok) return;
    method = d.value.method; target = d.value.target; strength = d.value.strength ?? 'classic';
    roast = d.value.roast ?? 'medium'; units = d.value.units; ratioOverride = d.value.ratio; customOpen = false;
  }

  let copied = $state(false);
  async function share() {
    try { await navigator.clipboard.writeText(location.href); copied = true; setTimeout(() => (copied = false), 2200); }
    catch { prompt('Copy this link:', location.href); }
  }

  const ICON: Record<MethodId, string> = {
    v60: 'M5 8h20l-8 13h-4z M11 21h8v2h-8z',
    chemex: 'M9 4h12l-5 10 5 12H9l5-12z M12 13h6',
    kalita: 'M6 8h18l-6 12h-6z M10 20h10v2H10z',
    'french-press': 'M8 7h14v19H8z M15 3v9 M10 12h10',
    aeropress: 'M10 4h10v18H10z M8 22h14v3H8z',
    'cold-brew': 'M9 6h12v20H9z M8 4h14v3H8z M11 18h8',
    'drip-machine': 'M6 4h18v5H6z M18 9h6v15h-6z M8 11h9l-2 5H10z M8 19h9v6H8z',
    espresso: 'M5 5h20v8H5z M12 13h6v3h-6z M10 20h10l-1 5h-8z',
    moka: 'M9 16h12l-1 10H10z M11 16l2-9h4l2 9 M13 7h4V5h-4z',
  };
</script>

<div class="cf" class:brewing={mode === 'brew'}>
  <div class="stage">
    <div class="readouts" aria-hidden="true">
      <div class="ro water"><span class="lbl">{method === 'espresso' ? 'In the cup' : 'Scale'}</span><span class="val">{r0(frame.scaleG)}<small>g</small></span></div>
      <div class="ro time"><span class="lbl">Timer</span><span class="val">{clock(frame.tS)}</span></div>
    </div>
    {#if recipe}
      <p class="quick" aria-hidden="true">
        <span class="qc">{fmtG(recipe.doseG)} g coffee</span>
        {#if method === 'espresso'}<span class="qw">{r0(recipe.yieldG ?? 0)} g out</span>{:else}<span class="qw">{r0(recipe.waterG ?? 0)} g water</span>{/if}
        <span>{method === 'cold-brew' ? 'cold water' : tempMain}</span>
      </p>
      <BrewStage {method} {frame} doseG={recipe.doseG} waterG={recipe.waterG ?? recipe.yieldG ?? 0} cupMl={recipe.cupMl} {steep}
        label={`${m.label} drawing: ${r0(frame.scaleG)} grams on the scale, ${r0(frame.cupG)} grams in the cup at ${clock(frame.tS)}.`} />
    {/if}
    <div class="cue" aria-live="polite">
      {#if mode === 'brew' && recipe}
        <span class="dot" class:still={!playing}></span>
        <div><p class="now">{cueNow}</p>{#if cueNext}<p class="next">{cueNext}</p>{/if}</div>
      {:else if recipe}
        <span class="dot still"></span>
        <div><p class="now">{recipe.steps[0].text}</p><p class="next">Then press Brew along and follow the timer.</p></div>
      {/if}
    </div>
  </div>

  <div class="panel">
    <fieldset class="field">
      <legend class="lbl">Brewer</legend>
      <div class="methods">
        {#each METHODS as x (x.id)}
          <button type="button" aria-pressed={method === x.id} onclick={() => pickMethod(x.id)}>
            <svg viewBox="0 0 30 30" aria-hidden="true"><path d={ICON[x.id]} /></svg>{x.label}
          </button>
        {/each}
      </div>
    </fieldset>

    <div class="row">
      <fieldset class="field grow">
        <legend class="lbl">{method === 'moka' ? 'What your basket holds, level' : byDose ? 'Coffee in the basket' : isBatch ? 'How much to make' : 'Your cup'}</legend>
        <div class="chips">
          {#each choices as c (c.label)}
            <button type="button" aria-pressed={!customOpen && same(c.t, target)} onclick={() => { customOpen = false; target = c.t; }}>{c.label}</button>
          {/each}
          <button type="button" aria-pressed={customOpen || !choices.some((c) => same(c.t, target))} aria-expanded={customOpen} onclick={openCustom}>Custom</button>
        </div>
        {#if customOpen}
          <div class="custom">
            <label class="cfld"><span class="sr">Amount</span><input type="number" inputmode="decimal" min="0" step="0.1" value={customVal} oninput={(e) => setCustom(Number((e.currentTarget as HTMLInputElement).value), customKind)} /></label>
            <select aria-label="What the amount is" value={customKind} onchange={(e) => changeKind((e.currentTarget as HTMLSelectElement).value as CustomKind)}>
              {#each customKinds as k (k.id)}<option value={k.id}>{k.label}</option>{/each}
            </select>
          </div>
          {#if method === 'moka'}<p class="hint">A moka pot's basket and valve set the dose and the water. Fill the basket level once, weigh it, and enter that.</p>{/if}
        {/if}
      </fieldset>
      <fieldset class="field">
        <legend class="lbl">Units</legend>
        <div class="seg">
          <button type="button" aria-pressed={units === 'us'} onclick={() => { units = 'us'; if (!byDose) target = DEFAULTS[method]; }}>US</button>
          <button type="button" aria-pressed={units === 'metric'} onclick={() => { units = 'metric'; if (!byDose) target = isBatch ? { cupMl: 1000 } : { cupMl: 350 }; }}>Metric</button>
        </div>
      </fieldset>
    </div>

    <div class="row">
      <fieldset class="field">
        <legend class="lbl">Strength</legend>
        <div class="seg">
          {#each (['lighter', 'classic', 'stronger'] as Strength[]) as s (s)}
            <button type="button" aria-pressed={ratioOverride === undefined && strength === s} onclick={() => { strength = s; ratioOverride = undefined; }}>{method === 'espresso' ? ESPRESSO_LABEL[s] : STRENGTH_LABEL[s]}</button>
          {/each}
        </div>
      </fieldset>
      <fieldset class="field">
        <legend class="lbl">Roast</legend>
        <div class="seg">
          {#each (['light', 'medium', 'dark'] as Roast[]) as r (r)}
            <button type="button" aria-pressed={roast === r} onclick={() => (roast = r)}>{r[0].toUpperCase() + r.slice(1)}</button>
          {/each}
        </div>
      </fieldset>
    </div>

    {#if !result.ok}
      <div class="problem" role="alert">
        {#each result.errors as e (e.code)}
          <p>{e.message}</p>
          {#if e.patch}<button type="button" class="ghost" onclick={() => applyPatch(e.patch!)}>Use the largest that fits</button>{/if}
        {/each}
      </div>
    {:else if recipe}
      {#if adjust}
        <div class="adjust" role="status"><span class="chip">From the Coffee Doctor</span><span>{ADJUST_TEXT[adjust]}</span><button type="button" class="x" aria-label="Dismiss" onclick={() => (adjust = undefined)}>×</button></div>
      {/if}
      <div class="numbers">
        <div class="coffee"><span class="k">Coffee</span><span class="v">{fmtG(recipe.doseG)}<small>g</small></span><span class="sub">about {r0(approxTablespoons(recipe.doseG, 'whole'))} tbsp beans</span></div>
        {#if method === 'espresso'}
          <div class="water"><span class="k">Yield</span><span class="v">{r0(recipe.yieldG ?? 0)}<small>g</small></span><span class="sub">liquid in the cup</span></div>
        {:else}
          <div class="water"><span class="k">Water</span><span class="v">{r0(recipe.waterG ?? 0)}<small>g</small></span><span class="sub">{method === 'moka' ? 'or fill the base to just below the valve' : units === 'us' ? `${mlToFlOz(recipe.waterG ?? 0).toFixed(1)} fl oz` : `${r0(recipe.waterG ?? 0)} ml`}</span></div>
        {/if}
        {#if method === 'espresso'}
          <div><span class="k">Shot time</span><span class="v">25–30<small>s</small></span><span class="sub">stop at {r0(recipe.yieldG ?? 0)} g by weight; crema makes the volume vary</span></div>
        {:else}
          <div><span class="k">{method === 'cold-brew' ? 'Serves' : 'In the cup'}</span><span class="v">{units === 'us' ? r0(mlToFlOz(recipe.cupMl)) : r0(recipe.cupMl)}<small>{units === 'us' ? 'fl oz' : 'ml'}</small></span><span class="sub">{method === 'cold-brew' ? `${r0(recipe.cupMl / 2)} g concentrate + the same of water or milk` : 'grounds keep ~2 g per g'}</span></div>
        {/if}
        <div><span class="k">Water temp</span><span class="v">{method === 'cold-brew' ? 'Cold' : tempMain}</span><span class="sub">{method === 'cold-brew' || method === 'drip-machine' ? tempNote : `${tempSub} · ${tempNote}`}</span></div>
      </div>

      <div class="ratio">
        <span class="lbl">Ratio</span>
        <button type="button" class="nudge" aria-label="Stronger: less water per gram" onclick={() => nudgeRatio(-1)}>−</button>
        <span class="rv">1 : {recipe.ratio % 1 ? recipe.ratio.toFixed(method === 'espresso' ? 2 : 1).replace(/0$/, '') : recipe.ratio}</span>
        <button type="button" class="nudge" aria-label="Lighter: more water per gram" onclick={() => nudgeRatio(1)}>+</button>
        <span class="tds">≈ {recipe.strength.tdsPct.min.toFixed(method === 'espresso' ? 0 : 2)}–{recipe.strength.tdsPct.max.toFixed(method === 'espresso' ? 0 : 2)}% strength (TDS), illustrative</span>
      </div>

      <p class="grind"><span class="chip">Grind</span><span><b>{recipe.grind.label}</b>, like {recipe.grind.texture} · about {r0(recipe.grind.microns.min)}–{r0(recipe.grind.microns.max)} µm</span></p>

      {#each result.warnings as w (w.code)}<p class="warn">{w.message}</p>{/each}

      <ol class="steps">
        {#each recipe.steps as s, i (i)}
          <li class:active={i === activeIndex && !done} class:done={mode === 'brew' && (i < activeIndex || done)}>
            <span class="t">{s.kind === 'prep' ? 'Before' : clock(s.atS)}</span>
            <span class="what">{s.text}{#if s.cue}<span class="why">{s.cue}</span>{/if}</span>
            <span class="w">{s.toG !== undefined && s.kind !== 'prep' ? `→ ${r0(s.toG)} g` : ''}</span>
          </li>
        {/each}
      </ol>

      <div class="actions">
        {#if mode === 'brew' && playing}
          <button type="button" class="go" onclick={pause}>Pause</button>
        {:else if mode === 'brew' && !done}
          <button type="button" class="go" onclick={() => play(speed)}>Resume</button>
        {:else if method !== 'cold-brew'}
          <button type="button" class="go" onclick={() => play(1)}><svg width="13" height="13" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1.5v11l9-5.5z" fill="currentColor" /></svg>{done ? 'Brew again' : 'Brew along'}</button>
        {/if}
        <button type="button" class="ghost" onclick={() => play(method === 'cold-brew' ? 3600 : 8)}>{method === 'cold-brew' ? 'Watch the steep' : 'Watch it fast'}</button>
        {#if mode === 'brew'}<button type="button" class="ghost" onclick={reset}>Reset</button>{/if}
        <button type="button" class="ghost" onclick={share}>{copied ? 'Link copied' : 'Share'}</button>
        <button type="button" class="ghost" onclick={saveRecipe} disabled={savedNow}>{savedNow ? 'Saved' : 'Save'}</button>
        <button type="button" class="ghost" onclick={() => window.print()}>Print</button>
      </div>
      {#if saved.length}
        <div class="saved" role="group" aria-label="Your saved recipes, on this device">
          <span class="lbl">Saved on this device</span>
          {#each saved as sv, k (sv.q)}
            <span class="sv"><button type="button" class="load" onclick={() => loadSaved(sv.q)}>{sv.name}</button><button type="button" class="x" aria-label={`Delete ${sv.name}`} onclick={() => removeSaved(k)}>×</button></span>
          {/each}
        </div>
      {/if}
      <p class="source">Steps from {recipe.by}, scaled to your {byDose ? 'dose' : 'cup'}. The drawing shows the target pace; real drawdown depends on your grind and filter.</p>
    {/if}
  </div>
</div>

<style>
  .cf {
    --paper: #f3ede3; --card: #fbf8f3; --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd;
    --crema: #c3873a; --crema-deep: #8f5d22; --water: #2f7484; --coffee: #7a4e30;
    --cf-display: 'Instrument Serif', Georgia, serif; --cf-sans: 'IBM Plex Sans', system-ui, sans-serif; --cf-mono: 'IBM Plex Mono', ui-monospace, monospace;
    display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
    background: var(--card); border: 1px solid var(--rule); border-radius: 18px; overflow: hidden;
    box-shadow: 0 1px 0 #fff inset, 0 30px 60px -40px rgba(60, 35, 15, .35);
    color: var(--ink); font: 16px/1.5 var(--cf-sans); text-align: left;
  }
  .stage { background: radial-gradient(120% 90% at 50% 18%, #fffdf9 0%, #f4ece0 70%, #efe5d6 100%); border-right: 1px solid var(--rule); display: flex; flex-direction: column; padding-bottom: 18px; }
  .readouts { display: flex; justify-content: space-between; padding: 18px 22px 0; }
  .ro { display: flex; flex-direction: column; }
  .ro.time { align-items: flex-end; }
  .lbl { font: 500 11px/1 var(--cf-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); }
  .val { font: 400 48px/1 var(--cf-mono); letter-spacing: -.03em; font-variant-numeric: tabular-nums; margin-top: 6px; }
  .val small { font-size: 17px; color: var(--ink-3); margin-left: 3px; letter-spacing: 0; }
  .water .val { color: var(--water); }
  .quick { display: none; }
  .cue { margin: 0 18px; display: flex; gap: 14px; align-items: center; background: rgba(255, 255, 255, .75); border: 1px solid var(--rule); border-radius: 12px; padding: 12px 16px; min-height: 64px; }
  .cue p { margin: 0; }
  .cue .now { font: 400 21px/1.2 var(--cf-display); }
  .cue .next { font-size: 13px; color: var(--ink-3); margin-top: 3px; }
  .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--crema); flex: none; box-shadow: 0 0 0 5px rgba(195, 135, 58, .18); animation: pulse 1.6s ease-in-out infinite; }
  .dot.still { animation: none; opacity: .6; }
  @keyframes pulse { 50% { box-shadow: 0 0 0 9px rgba(195, 135, 58, .06); } }

  .panel { padding: 22px 24px 24px; display: flex; flex-direction: column; gap: 18px; min-width: 0; }
  fieldset { border: 0; margin: 0; padding: 0; min-width: 0; }
  legend.lbl { display: block; margin-bottom: 9px; padding: 0; }
  .methods { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 7px; }
  .methods button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 10px; padding: 7px 3px 6px; cursor: pointer; font: 500 11.5px/1.15 var(--cf-sans); color: var(--ink-2); display: grid; justify-items: center; gap: 3px; min-height: 58px; }
  .methods svg { width: 26px; height: 26px; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linejoin: round; }
  .methods button[aria-pressed='true'] { border-color: var(--ink); color: var(--ink); box-shadow: 0 0 0 1px var(--ink) inset; background: #fffdf8; }
  .methods button:hover { border-color: var(--ink-3); }
  .row { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-start; }
  .grow { flex: 1 1 260px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button, .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 7px 12px; min-height: 36px; font: 500 13px/1 var(--cf-mono); color: var(--ink-2); cursor: pointer; }
  .chips button[aria-pressed='true'], .seg button[aria-pressed='true'] { background: var(--ink); color: var(--paper); border-color: var(--ink); }
  .seg { display: inline-flex; flex-wrap: wrap; gap: 4px; }
  .seg button { font-family: var(--cf-sans); }

  .numbers { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .numbers > div { padding: 12px 0 11px; display: flex; flex-direction: column; min-width: 0; }
  .numbers > div + div { border-left: 1px solid var(--rule); padding-left: 12px; }
  .numbers .k { font: 500 10.5px/1 var(--cf-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .numbers .v { font: 400 29px/1.1 var(--cf-mono); letter-spacing: -.02em; margin-top: 6px; font-variant-numeric: tabular-nums; }
  .numbers .v small { font-size: 12px; color: var(--ink-3); margin-left: 2px; letter-spacing: 0; }
  .numbers .coffee .v { color: var(--coffee); }
  .numbers .water .v { color: var(--water); }
  .numbers .sub { font-size: 12px; color: var(--ink-3); margin-top: 3px; line-height: 1.3; }

  .custom { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
  .custom input { font: 400 16px 'IBM Plex Mono', monospace; width: 96px; padding: 8px 10px; border: 1px solid var(--rule, #d9cdbd); border-radius: 8px; background: #fff; min-height: 40px; }
  .custom select { font: 400 15px 'IBM Plex Sans', sans-serif; padding: 8px 10px; border: 1px solid var(--rule, #d9cdbd); border-radius: 8px; background: #fff; min-height: 40px; color: inherit; }
  .hint { font-size: 13.5px; color: #75655a; margin: 6px 0 0; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .saved { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px; }
  .saved .lbl { width: 100%; }
  .sv { display: inline-flex; align-items: center; border: 1px solid var(--rule, #d9cdbd); border-radius: 999px; background: #fff; }
  .sv .load { appearance: none; border: 0; background: none; padding: 7px 4px 7px 12px; font: 500 13px 'IBM Plex Sans', sans-serif; color: #5b4a3d; cursor: pointer; }
  .sv .x { appearance: none; border: 0; background: none; padding: 7px 10px 7px 4px; font-size: 16px; color: #75655a; cursor: pointer; min-width: 30px; }
  .ratio { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
  .rv { font: 400 22px/1 var(--cf-mono); min-width: 5.5ch; text-align: center; }
  .nudge { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; font: 500 18px/1 var(--cf-mono); cursor: pointer; color: var(--ink); }
  .tds { font-size: 12.5px; color: var(--ink-3); }
  .grind { display: flex; gap: 12px; align-items: baseline; font-size: 14px; color: var(--ink-2); margin: 0; }
  .grind b { color: var(--ink); font-weight: 600; }
  .chip { font: 500 11px/1 var(--cf-mono); text-transform: uppercase; letter-spacing: .1em; border: 1px solid var(--rule); border-radius: 6px; padding: 5px 7px; background: #fff; }
  .adjust { display: flex; gap: 10px; align-items: center; background: #fff8ec; border: 1px solid #e3c79f; border-radius: 10px; padding: 9px 10px 9px 12px; font-size: 14.5px; }
  .adjust .x { margin-left: auto; width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--rule); background: #fff; cursor: pointer; font-size: 16px; }
  .warn { margin: 0; font-size: 13.5px; color: var(--crema-deep); background: rgba(195, 135, 58, .08); border-left: 2px solid var(--crema); padding: 8px 12px; }
  .problem { border: 1px solid #c9a27a; background: #fbf1e6; border-radius: 10px; padding: 12px 14px; }
  .problem p { margin: 0 0 8px; }

  ol.steps { list-style: none; margin: 0; padding: 0; }
  ol.steps li { display: grid; grid-template-columns: 52px 1fr auto; gap: 12px; align-items: baseline; padding: 9px 6px; border-bottom: 1px dashed var(--rule); transition: background .3s, opacity .3s; border-radius: 6px; }
  ol.steps li:last-child { border-bottom: 0; }
  ol.steps .t { font: 500 13px/1.3 var(--cf-mono); color: var(--crema-deep); }
  ol.steps .what { font-weight: 500; font-size: 14.5px; }
  ol.steps .why { display: block; font-size: 13px; color: var(--ink-3); font-weight: 400; margin-top: 2px; }
  ol.steps .w { font: 400 14px/1 var(--cf-mono); color: var(--water); white-space: nowrap; }
  ol.steps li.done { opacity: .5; }
  ol.steps li.active { background: linear-gradient(90deg, rgba(195, 135, 58, .14), transparent); }

  .actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .go { appearance: none; border: 0; background: var(--ink); color: var(--paper); border-radius: 999px; padding: 13px 20px; font: 600 15px/1 var(--cf-sans); cursor: pointer; display: inline-flex; gap: 9px; align-items: center; min-height: 44px; }
  .go:hover { background: #3b2a1f; }
  .ghost { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink-2); border-radius: 999px; padding: 11px 15px; font: 500 14px/1 var(--cf-sans); cursor: pointer; min-height: 44px; }
  .source { font-size: 12.5px; color: var(--ink-3); margin: 0; }
  button:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }

  @media (max-width: 880px) {
    .cf { grid-template-columns: 1fr; }
    .stage { border-right: 0; border-bottom: 1px solid var(--rule); }
    .val { font-size: 38px; }
    .quick { display: flex; gap: 14px; flex-wrap: wrap; margin: 10px 22px 0; font: 500 15px/1.2 var(--cf-mono); }
    .quick .qc { color: var(--coffee); }
    .quick .qw { color: var(--water); }
    .numbers { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .numbers > div:nth-child(3) { border-left: 0; padding-left: 0; border-top: 1px solid var(--rule); }
    .numbers > div:nth-child(4) { border-top: 1px solid var(--rule); }
    .methods { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .panel { padding: 18px 16px 20px; }
    .cf.brewing .panel > :not(.steps):not(.actions) { display: none; }
  }
  @media print {
    .cf { display: block; box-shadow: none; border: 0; }
    .stage, .actions, .methods, .row, .ratio button { display: none !important; }
  }
  @media (prefers-reduced-motion: reduce) { .dot { animation: none; } ol.steps li { transition: none; } }
</style>
