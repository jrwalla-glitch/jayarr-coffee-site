<script lang="ts">
  // Coffee Drinks' "In your cup" panel (Wave F r1, C4): one published recipe scaled to the reader's cup,
  // or a plain statement of why it can't be. Coffee Drinks loads it when the panel is opened (or a link
  // brings a cup), so the tool's first load carries none of it. The scaling rules are in lib/coffee/cupFit.ts.
  import { onMount } from 'svelte';
  import { mlToFlOz, flOzToMl } from '../../lib/coffee/units.ts';
  import { fitToCup, canMakeTwice, roundMl } from '../../lib/coffee/cupFit.ts';
  import type { Fit, FitLayer } from '../../lib/coffee/cupFit.ts';
  import type { Drink, DrinkRef } from '../../lib/coffee/drinks.ts';

  // The two recipes on the counter, which one is being sized, the cup and the units belong to Coffee Drinks
  // (they go in its link); this component draws the controls and the result.
  let { a, b, da, db, fitSide = $bindable(), cupMl = $bindable(), units = $bindable(), focusFirst = false, onref, onsummary }: {
    a: DrinkRef; b: DrinkRef; da: Drink; db: Drink; fitSide: 'a' | 'b'; cupMl: number | null; units: 'us' | 'metric'; focusFirst?: boolean;
    onref: (id: string) => void; onsummary: (s: string) => void;
  } = $props();
  let r = $derived(fitSide === 'a' ? a : b);
  let d = $derived(fitSide === 'a' ? da : db);

  // Sizes follow the site's units pattern: US cups in fl oz, metric in ml, or a custom amount.
  const CUPS_US = [4, 6, 8, 12, 16];
  const CUPS_METRIC = [120, 180, 240, 350, 475];
  const sizesMl = (u: 'us' | 'metric') => (u === 'us' ? CUPS_US.map(flOzToMl) : CUPS_METRIC);
  const inUnits = (ml: number, u: 'us' | 'metric') => (u === 'us' ? Math.round(mlToFlOz(ml) * 10) / 10 : Math.round(ml));
  // A cup that came with a link and isn't one of the sizes opens the custom box with it.
  let customOpen = $state(!!cupMl && !sizesMl(units).some((v) => Math.abs(v - cupMl!) < 1));
  let customNum = $state<number | null>(customOpen && cupMl ? inUnits(cupMl, units) : null);
  function setCup(ml: number | null) { cupMl = ml && Number.isFinite(ml) && ml >= 30 && ml <= 1000 ? ml : null; }
  function openCustom() { customOpen = true; customNum = cupMl ? inUnits(cupMl, units) : null; }
  // Switching units converts a custom size rather than clearing it.
  function switchUnits(u: 'us' | 'metric') { if (u === units) return; if (customOpen && cupMl) customNum = inUnits(cupMl, u); units = u; }
  // A typed size sets the cup, unless it is just the cup already set, shown in the other units. An empty box
  // clears the cup, so no result (and no cup in the link) is left from the size typed before (Wave F r2, Astra).
  $effect(() => {
    if (!customOpen) return;
    if (customNum === null || customNum === undefined || (customNum as unknown) === '') { cupMl = null; return; }
    if (cupMl && inUnits(cupMl, units) === Number(customNum)) return;
    setCup(units === 'us' ? flOzToMl(Number(customNum)) : Number(customNum));
  });
  let chips: HTMLElement | undefined = $state();
  // Opened from its button, which then goes: focus moves to the first size so it isn't lost.
  onMount(() => { if (focusFirst) chips?.querySelector('button')?.focus(); });
  const both = (lo: number, hi: number) => { const m = span(lo, hi, 'ml'), f = span(oz(lo), oz(hi), 'fl oz'); return units === 'us' ? `${f} (${m})` : `${m} (${f})`; };
  let refHint = $derived.by(() => {
    if (r.vessel.capacityMl) return `The recipe's cup holds ${both(r.vessel.capacityMl[0], r.vessel.capacityMl[1])}.`;
    if (r.layers.every((l) => l.ml)) return `The recipe makes ${both(r.layers.reduce((t, l) => t + l.ml![0], 0), r.layers.reduce((t, l) => t + l.ml![1], 0))} in all and gives no cup size.`;
    return '';
  });

  const NAME: Record<string, string> = { espresso: 'espresso', milk: 'milk', frothed: 'frothed milk', foam: 'foam', water: 'hot water', brewed: 'brewed coffee', chocolate: 'chocolate', gelato: 'gelato', cream: 'whipped cream' };
  const shotName = (x: DrinkRef) => (x.shots === 'single' || x.shots === 'double' ? `${x.shots} shot` : '');

  let fit = $derived(fitToCup(r, cupMl ?? 1));
  // A single-shot recipe in a cup more than twice its size can be made twice.
  let twice = $derived(fit.ok && fit.verdict === 'too-large' && canMakeTwice(r) ? fitToCup(r, cupMl ?? 1, 2) : null);
  let shown = $derived<Fit | null>(fit.ok && fit.verdict === 'fits' ? fit : twice && twice.ok && twice.verdict === 'fits' ? twice : null);
  // Other recipes for the same drink that do fit this cup.
  let others = $derived(!cupMl || (fit.ok && fit.verdict === 'fits') ? [] : d.refs.filter((x) => { if (x.id === r.id) return false; const f = fitToCup(x, cupMl!); return f.ok && f.verdict === 'fits'; }));

  const oz = (ml: number) => { const v = mlToFlOz(ml); return v < 10 ? Math.round(v * 2) / 2 : Math.round(v); };
  const span = (lo: number, hi: number, u: string) => (lo === hi ? `${lo} ${u}` : `${lo}–${hi} ${u}`);
  const times = (x: number) => (x >= 3 ? String(Math.round(x)) : (Math.round(x * 10) / 10).toString());
  // An amount in both units, the reader's first; scaled amounts are rounded and said to be "about".
  function amt(v: [number, number], exact = false) {
    const ml = exact ? v : [roundMl(v[0]), roundMl(v[1])];
    const m = span(ml[0], ml[1], 'ml'), f = span(oz(v[0]), oz(v[1]), 'fl oz');
    return `${exact ? '' : 'about '}${units === 'us' ? `${f} (${m})` : `${m} (${f})`}`;
  }
  let cupText = $derived(!cupMl ? '' : units === 'us' ? `${oz(cupMl)} fl oz (${Math.round(cupMl)} ml)` : `${Math.round(cupMl)} ml (${oz(cupMl)} fl oz)`);
  let recipe = $derived(`${d.name.toLowerCase()} (${r.label})`);
  // The recipe as published, in one line: "single shot, 20–25 ml and 120 ml milk".
  function published(x: DrinkRef) {
    const parts = x.layers.map((l) => {
      const v = l.ml ? span(l.ml[0], l.ml[1], 'ml') : l.g ? span(l.g[0], l.g[1], 'g') : '';
      if (l.kind === 'espresso') return `${shotName(x) || 'espresso'}${v ? `, ${v}` : shotName(x) ? '' : ' (amount not published)'}`;
      return v ? `${v} ${NAME[l.kind]}` : `${NAME[l.kind]} (amount not published)`;
    });
    const cup = x.vessel.capacityMl ? ` in a ${span(x.vessel.capacityMl[0], x.vessel.capacityMl[1], 'ml')} ${x.vessel.name.toLowerCase().replace(/,.*$/, '')}` : '';
    return parts.join(', ').replace(/, ([^,]*)$/, ' and $1') + cup;
  }
  function row(l: FitLayer, n: 1 | 2) {
    if (l.kind === 'espresso') {
      const s = n === 2 ? (shotName(r) ? 'two shots' : 'twice the espresso') : shotName(r) || 'espresso';
      return `${s}${l.ml ? `, ${span(l.ml[0], l.ml[1], 'ml')}` : ', volume not published'} (${n === 2 ? 'the recipe made twice' : 'as the recipe has it'})`;
    }
    if (l.ml) return `${amt(l.ml, l.fixed)}${l.basis ? `, ${l.basis}` : ''}`;
    if (l.g) return `${span(l.g[0], l.g[1], 'g')}${l.basis ? `, ${l.basis}` : ''} (as the recipe has it)`;
    return l.amount ?? 'amount not published';
  }
  const grownOf = (f: Fit) => [...new Set(f.layers.filter((l) => !l.fixed).map((l) => NAME[l.kind]))].join(' and ');
  const knownOf = (f: Fit) => f.layers.reduce((t, l) => t + (l.ml ? (l.ml[0] + l.ml[1]) / 2 : 0), 0);
  // Why a recipe can't be sized at all, in plain words.
  let blocked = $derived.by(() => {
    if (fit.ok) return '';
    const e = r.layers.find((l) => l.kind === 'espresso');
    if (fit.why === 'espresso-only') return `The ${recipe} is espresso alone${e?.ml ? `, ${span(e.ml[0], e.ml[1], 'ml')}` : ''}, the same whatever the cup, so there's nothing to scale.`;
    if (fit.why === 'by-weight') return `This recipe is weighed in grams (${published(r)}) and gives no cup size, so it can't be sized to a cup by volume.`;
    if (fit.why === 'no-basis') { const kn = r.layers.filter((l) => l.ml).map((l) => `the ${NAME[l.kind]} (${span(l.ml![0], l.ml![1], 'ml')})`).join(' and '); return `The recipe gives ${kn || 'some amounts'} but not ${e?.unspecified ? "the shot's volume or " : ''}a cup size, so it can't be sized to your cup.`; }
    const un = [...new Set(r.layers.filter((l) => l.unspecified && l.kind !== 'espresso').map((l) => NAME[l.kind]))];
    return un.length ? `The recipe doesn't publish how much ${un.join(' or ')} goes in, so there's nothing to scale.` : 'Nothing in this recipe grows with the cup, so there is nothing to scale.';
  });
  // What changed, in words, under a scaled result.
  let note = $derived.by(() => {
    if (!shown) return '';
    const grown = grownOf(shown), shot = shotName(r) || 'espresso';
    const out = [`Scaled from the published ${recipe}: ${published(r)}.`];
    if (shown.basis === 'drink') out.push(`It gives no cup size, so its whole drink, ${amt(shown.refRange, true)}, counts as a full cup.`);
    const per = Math.abs(shown.perShot - 1) < 0.05 ? "the recipe's own balance" : `about ${times(shown.perShot)} times the recipe's ${grown} per shot`;
    out.push(shown.times === 2
      ? `Made twice: two shots, and the ${grown} scaled by ${times(shown.factor)} to fit your cup, so ${per}.`
      : `The ${grown} ${grown.includes(' and ') ? 'are' : 'is'} scaled by ${times(shown.factor)} to fit your cup; the ${shot} stays as the recipe has it, so that's ${per}.`);
    if (shown.layers.some((l) => l.kind === 'espresso' && !l.ml)) out.push(`The recipe doesn't give the shot's volume, so leave room for it: ${shown.shotRoomMl ? `its own cup leaves about ${span(shown.shotRoomMl[0], shown.shotRoomMl[1], 'ml')} for the ${shown.times === 2 ? 'two shots' : shot}, and ` : ''}the ${grown} alone comes to about ${roundMl(knownOf(shown))} ml of your cup's ${Math.round(cupMl ?? 0)} ml.`);
    else if (shown.totalMl) out.push(`In all about ${roundMl(shown.totalMl)} ml, in a cup that holds ${Math.round(cupMl ?? 0)} ml${shown.totalMl >= (cupMl ?? 0) * 0.95 ? ': that is to the brim, so pour a little less milk to leave room' : ''}.`);
    return out.join(' ');
  });
  // Why a cup is too big or too small for the recipe, said plainly; no scaled amounts are given then.
  let tooWhy = $derived.by(() => {
    if (!fit.ok || shown) return '';
    const grown = grownOf(fit), shot = shotName(r) || 'espresso';
    const what = fit.basis === 'cup' ? `the recipe's ${span(fit.refRange[0], fit.refRange[1], 'ml')} cup` : `the recipe's whole drink (${span(fit.refRange[0], fit.refRange[1], 'ml')}; it gives no cup size)`;
    if (fit.verdict === 'too-large') {
      const tw = twice && twice.ok ? ` Even made twice, with two shots, it would be ${times(twice.perShot)} times the recipe's ${grown} per shot.` : r.shots === 'double' ? ' A double stays a double here.' : '';
      return `Your cup holds ${times(fit.factor)} times ${what}. Keeping its ${shot}, filling it would take ${times(fit.perShot)} times the recipe's ${grown} per shot, more than twice, so it would no longer be this recipe.${tw}`;
    }
    // An unpublished shot takes the room the recipe's own cup leaves for it (lib/coffee/cupFit.ts, shotRoom).
    if (fit.overflow && fit.shotRoomMl) {
      const m = fit.layers.filter((l) => !l.fixed && l.ml), lo = m.reduce((t, l) => t + l.ml![0], 0), hi = m.reduce((t, l) => t + l.ml![1], 0);
      const all = knownOf(fit) + (fit.shotRoomMl[0] + fit.shotRoomMl[1]) / 2;
      return `The recipe doesn't give its ${shot}'s volume, but its own ${span(r.vessel.capacityMl![0], r.vessel.capacityMl![1], 'ml')} cup leaves about ${span(fit.shotRoomMl[0], fit.shotRoomMl[1], 'ml')} for it. With the ${grown} in proportion, ${span(roundMl(lo), roundMl(hi), 'ml')}, that comes to about ${roundMl(all)} ml, more than your cup's ${Math.round(cupMl ?? 0)} ml.`;
    }
    if (fit.overflow) return `The recipe's ${shot} with its ${grown} in proportion comes to about ${roundMl(knownOf(fit))} ml, more than your cup's ${Math.round(cupMl ?? 0)} ml.`;
    return `Your cup holds under half of ${what}. Keeping its ${shot}, the ${grown} would be less than half the recipe's per shot, so it would no longer be this recipe.`;
  });
  // One sentence for screen readers; the parent reads it out once it settles.
  $effect(() => {
    const head = `${cupText} cup, ${recipe}: `;
    if (!cupMl) { onsummary(''); return; }
    onsummary(!fit.ok ? head + blocked : !shown ? head + `too ${fit.verdict === 'too-small' ? 'small' : 'big'} for this recipe.`
      : head + `${shown.times === 2 ? 'made twice, two shots, ' : ''}${shown.layers.filter((l) => !l.fixed && l.ml).map((l) => `${NAME[l.kind]} ${amt(l.ml!)}`).join(', ')}.`);
  });
</script>

<div class="fit-top">
  <p class="k" id="cd-fit-k">In your cup</p>
  <div class="seg" role="group" aria-label="Which drink to size">
    <button type="button" aria-pressed={fitSide === 'a'} onclick={() => (fitSide = 'a')}>{da.name === db.name ? `${da.name} (${a.label})` : da.name}</button>
    <button type="button" aria-pressed={fitSide === 'b'} onclick={() => (fitSide = 'b')}>{da.name === db.name ? `${db.name} (${b.label})` : db.name}</button>
  </div>
</div>
<div class="fit-ctl">
  <div class="chips" role="group" aria-label="Your cup holds" bind:this={chips}>
    {#each (units === 'us' ? CUPS_US : CUPS_METRIC) as v (v)}
      {@const ml = units === 'us' ? flOzToMl(v) : v}
      <button type="button" aria-pressed={!customOpen && cupMl !== null && Math.abs(cupMl - ml) < 1} onclick={() => { customOpen = false; setCup(ml); }}>{units === 'us' ? `${v} oz` : `${v} ml`}</button>
    {/each}
    <button type="button" aria-pressed={customOpen} onclick={openCustom}>Custom</button>
  </div>
  <div class="seg" role="group" aria-label="Units">
    <button type="button" aria-pressed={units === 'us'} onclick={() => switchUnits('us')}>US</button>
    <button type="button" aria-pressed={units === 'metric'} onclick={() => switchUnits('metric')}>Metric</button>
  </div>
</div>
{#if customOpen}
  <label class="custom"><span>My cup holds</span><input type="number" inputmode="decimal" min={units === 'us' ? 1 : 30} max={units === 'us' ? 34 : 1000} step={units === 'us' ? 0.5 : 5} bind:value={customNum} /><span>{units === 'us' ? 'fl oz' : 'ml'}</span></label>
{/if}
<div class="fit-out">
{#if !cupMl}
  <p class="fit-hint">{customOpen ? `Type your cup's size, ${units === 'us' ? '1 to 34 fl oz' : '30 to 1,000 ml'}.` : `Pick your cup's size to scale the ${recipe} to it.`} {refHint}</p>
{:else if !fit.ok}
  <p class="fit-line">{cupText} cup</p>
  <p class="fit-why">{blocked}</p>
{:else if shown}
  <p class="fit-line">{cupText} cup: {recipe}{shown.times === 2 ? ', made twice' : ''}, scaled</p>
  {#if shown.times === 2}<p class="fit-why">Too big for one shot of this recipe: keeping its single shot would take {times(fit.perShot)} times its {grownOf(fit)} per shot. Made twice, it fits.</p>{/if}
  <dl class="fit-dl">
    {#each shown.layers as l, i (i)}<div><dt>{NAME[l.kind]}</dt><dd>{row(l, shown.times)}</dd></div>{/each}
    {#if r.foamCm}<div><dt>Foam</dt><dd>about {r.foamCm[0]} cm on top, as the recipe has it</dd></div>{/if}
  </dl>
  <p class="fit-note">{note}</p>
{:else}
  <p class="fit-line">{cupText} cup: too {fit.verdict === 'too-small' ? 'small' : 'big'} for the {recipe}</p>
  <p class="fit-why">{tooWhy}</p>
{/if}
{#if others.length}<p class="fit-alt">Recipes here that fit your cup: {#each others as x, i (x.id)}{i ? ', ' : ''}<button type="button" class="linkish" onclick={() => onref(x.id)}>{d.name} ({x.label})</button>{/each}</p>{/if}
</div>

<style>
  p { margin: 0; }
  .fit-top, .fit-ctl { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; }
  .k { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--crema-deep); }
  .chips, .seg { display: flex; flex-wrap: wrap; gap: 6px; }
  .chips button, .seg button { appearance: none; border: 1px solid var(--rule); background: #fff; border-radius: 999px; padding: 7px 12px; min-height: 36px; font: 500 13px/1 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; color: var(--ink-2); cursor: pointer; }
  .seg button { font-family: 'IBM Plex Sans', 'IBM Plex Sans Metrics', sans-serif; }
  button[aria-pressed='true'] { background: var(--ink); color: #f3ede3; border-color: var(--ink); }
  button:focus-visible { outline: 2px solid var(--crema-deep); outline-offset: 2px; }
  .custom { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--ink-2); }
  .custom input { font: 400 16px 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; width: 96px; padding: 8px 10px; border: 1px solid var(--rule); border-radius: 8px; background: #fff; min-height: 40px; color: var(--ink); }
  .fit-out { display: grid; gap: 6px; }
  .fit-hint { font-size: 14px; color: var(--ink-3); }
  .fit-line { font: 400 21px/1.3 'Instrument Serif', 'Instrument Serif Metrics', Georgia, serif; }
  .fit-why { font-size: 14.5px; color: var(--ink-2); }
  .fit-dl { margin: 2px 0 0; border-top: 1px solid var(--rule); max-width: 640px; }
  .fit-dl div { display: grid; grid-template-columns: 110px 1fr; gap: 10px; padding: 7px 0; border-bottom: 1px dashed var(--rule); }
  dt { font: 500 11px/1.6 'IBM Plex Mono', 'IBM Plex Mono Metrics', monospace; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-3); }
  dd { margin: 0; font-size: 14.5px; }
  .fit-note, .fit-alt { font-size: 13.5px; color: var(--ink-2); max-width: 70ch; }
  .linkish { appearance: none; border: 0; background: none; padding: 0; min-height: 24px; font: inherit; color: #7a4e30; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
  @media (max-width: 640px) { .fit-dl div { grid-template-columns: 92px 1fr; } }
</style>
