<script lang="ts">
  import { onMount } from 'svelte';
  import { buildRecipe, encodeBrew, flOzToMl, cToF, SYMPTOMS } from '../../lib/coffee/index.ts';
  import type { MethodId } from '../../lib/coffee/index.ts';
  import ToolMini from './art/ToolMini.svelte';
  import GalleryMini from './art/GalleryMini.svelte';

  // The homepage's first screen is a decision with a working preview. "Make a better cup" runs the
  // Brew Guide's own engine, so the numbers here are the numbers there, and the button carries the
  // choice across. The other doors lead straight into the tool for that job.
  type Door = 'make' | 'fix' | 'choose' | 'explore';
  const DOORS: { id: Door; label: string }[] = [
    { id: 'make', label: 'Make a better cup' },
    { id: 'fix', label: 'Fix today\'s coffee' },
    { id: 'choose', label: 'Choose equipment' },
    { id: 'explore', label: 'Explore flavor' },
  ];
  const BREWERS: { id: MethodId; label: string }[] = [
    { id: 'v60', label: 'V60' }, { id: 'chemex', label: 'Chemex' }, { id: 'french-press', label: 'French press' }, { id: 'aeropress', label: 'AeroPress' },
    { id: 'drip-machine', label: 'Drip machine' }, { id: 'cold-brew', label: 'Cold brew' }, { id: 'moka', label: 'Moka pot' }, { id: 'espresso', label: 'Espresso' },
  ];
  const CUPS = [8, 10, 12, 16];
  const FIX = ['sour', 'bitter', 'weak', 'strong', 'flat'];
  // What each taste usually points to, said as a likelihood: the Doctor asks before it decides.
  const LIKELY: Record<string, string> = {
    sour: 'Often under-extracted: the water didn\'t pull enough from the coffee. The usual suspects are a grind that\'s too coarse or a brew that ran too fast.',
    bitter: 'Often over-extracted: too much was pulled out. A grind that\'s too fine or a brew that ran too long are the usual suspects, though dark roasts are bitter by nature.',
    weak: 'Usually too little coffee for the water, before anything else. A stronger ratio is the first thing to try.',
    strong: 'Usually too much coffee for the water. A lighter ratio, or adding a little hot water, fixes it without touching the grind.',
    flat: 'Often stale beans or water with too few minerals, rather than the recipe.',
  };

  let door = $state<Door>('make');
  let method = $state<MethodId>('v60');
  let oz = $state(12);
  let symptom = $state('sour');
  let fixMethod = $state<'v60' | 'espresso'>('v60');

  let target = $derived(method === 'espresso' ? { doseG: 18 } : method === 'moka' ? { doseG: 15 } : { cupMl: flOzToMl(oz) });
  let res = $derived(buildRecipe({ method, target, strength: 'classic', roast: 'medium' }));
  let r = $derived(res.ok ? res.value : null);
  let href = $derived(`/tools/brew-ratio/?${encodeBrew({ method, target, strength: 'classic', roast: 'medium', units: 'us' })}`);
  const fmtG = (g: number) => { const v = Math.round(g * 10) / 10; return g >= 100 ? String(Math.round(g)) : Number.isInteger(v) ? String(v) : v.toFixed(1); };
  const sym = (id: string) => SYMPTOMS.find((s) => s.id === id)!;

  onMount(() => {
    try { const d = sessionStorage.getItem('jayarr-home-door') as Door | null; if (d && DOORS.some((x) => x.id === d)) door = d; } catch { /* no storage */ }
  });
  function pick(d: Door) { door = d; try { sessionStorage.setItem('jayarr-home-door', d); } catch { /* no storage */ } }
</script>

<div class="hs">
  <div class="doors" role="tablist" aria-label="What are you here to do?">
    {#each DOORS as d (d.id)}
      <button type="button" role="tab" id="hs-tab-{d.id}" aria-selected={door === d.id} aria-controls="hs-panel" tabindex={door === d.id ? 0 : -1} onclick={() => pick(d.id)}
        onkeydown={(e) => { const i = DOORS.findIndex((x) => x.id === door); if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); const n = DOORS[(i + (e.key === 'ArrowRight' ? 1 : DOORS.length - 1)) % DOORS.length].id; pick(n); document.getElementById(`hs-tab-${n}`)?.focus(); } }}>{d.label}</button>
    {/each}
  </div>

  <div class="panel" id="hs-panel" role="tabpanel" aria-labelledby="hs-tab-{door}">
    {#if door === 'make'}
      <p class="q">Your brewer</p>
      <div class="chips">
        {#each BREWERS as b (b.id)}<button type="button" class="chip" aria-pressed={method === b.id} onclick={() => (method = b.id)}>{b.label}</button>{/each}
      </div>
      {#if method !== 'espresso' && method !== 'moka'}
        <p class="q">Your mug</p>
        <div class="chips">
          {#each CUPS as c (c)}<button type="button" class="chip mono" aria-pressed={oz === c} onclick={() => (oz = c)}>{c} oz</button>{/each}
        </div>
      {/if}
      {#if r}
        <dl class="nums" aria-live="polite">
          <div><dt>Coffee</dt>{#if method === 'moka'}<dd class="coffee small">Fill the basket</dd>{:else}<dd class="coffee">{fmtG(r.doseG)}<small>g</small></dd>{/if}</div>
          {#if method === 'espresso'}
            <div><dt>In the cup</dt><dd>{Math.round(r.yieldG ?? 0)}<small>g</small></dd></div>
          {:else if method === 'moka'}
            <div><dt>Water</dt><dd class="water small">To the valve</dd></div>
          {:else}
            <div><dt>Water</dt><dd class="water">{Math.round(r.waterG ?? 0)}<small>g</small></dd></div>
          {/if}
          <div><dt>Water temp</dt><dd>{method === 'cold-brew' ? 'Cold' : method === 'moka' ? 'Boiled' : `${Math.round(cToF(r.tempC))}°F`}</dd></div>
          <div><dt>Grind</dt><dd class="small">{r.grind.label}</dd></div>
        </dl>
        <p class="note">{method === 'espresso' ? 'A double shot: 18 g in, 36 g out, in 25–30 seconds.' : method === 'cold-brew' ? 'A concentrate: dilute it about one to one to serve.' : method === 'moka' ? 'The pot sets the amounts: coffee level in the basket, water to just below the valve. The Brew Guide sizes it to your pot.' : 'At 1:16, the classic strength. The Brew Guide times every pour.'}</p>
      {/if}
      <a class="go" href={href}>Brew it step by step →</a>
    {:else if door === 'fix'}
      <p class="q">How does it taste?</p>
      <div class="chips">
        {#each FIX.filter((id) => fixMethod === 'espresso' ? sym(id).espresso : sym(id).filter) as id (id)}<button type="button" class="chip" aria-pressed={symptom === id} onclick={() => (symptom = id)}>{sym(id).label}</button>{/each}
      </div>
      <p class="q">Made with</p>
      <div class="chips">
        <button type="button" class="chip" aria-pressed={fixMethod === 'v60'} onclick={() => (fixMethod = 'v60')}>Filter or press</button>
        <button type="button" class="chip" aria-pressed={fixMethod === 'espresso'} onclick={() => { fixMethod = 'espresso'; if (!sym(symptom).espresso) symptom = 'sour'; }}>Espresso</button>
      </div>
      <p class="likely"><b>{sym(symptom).tagline}.</b> {LIKELY[symptom]}</p>
      <p class="note">Fix My Coffee asks two or three questions about your brew, then gives you one change to try and keeps everything else the same.</p>
      <a class="go" href="/tools/fix-my-coffee/?method={fixMethod}&symptom={symptom}">Find the one change →</a>
    {:else if door === 'choose'}
      <ul class="pick">
        <li><a href="/tools/espresso-machines/"><span class="pm"><ToolMini id="machines" /></span><span><b>An espresso machine</b><small>Matches for how you drink and what you'll spend, grinder included</small></span></a></li>
        <li><a href="/tools/nespresso-pods/"><span class="pm"><ToolMini id="pods" /></span><span><b>Nespresso pods</b><small>Every capsule your machine takes, Original or Vertuo</small></span></a></li>
        <li><a href="/deep-brew/calibrator/"><span class="pm"><ToolMini id="calibrator" /></span><span><b>Your grinder's setting</b><small>The number to set for your brewer, from the maker's guidance</small></span></a></li>
      </ul>
    {:else}
      <ul class="pick gallery">
        <li><a href="/explore/flavors/"><span class="pm"><GalleryMini id="flavors" names={false} /></span><span><b>The Flavor Bloom</b><small>Learn to taste a note, and how often roasters use it</small></span></a></li>
        <li><a href="/explore/origins/"><span class="pm"><GalleryMini id="origins" names={false} /></span><span><b>The Coffee Origins</b><small>Who's harvesting now, and how high it grows</small></span></a></li>
        <li><a href="/explore/methods/"><span class="pm"><GalleryMini id="methods" names={false} /></span><span><b>The Brewing Constellations</b><small>How thirteen brewers really differ</small></span></a></li>
      </ul>
    {/if}
  </div>
</div>

<style>
  .hs { --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema-deep: #8f5d22; background: #fbf8f3; color: var(--ink); border-radius: 18px; box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .55); overflow: hidden; font: 16px/1.5 'IBM Plex Sans', system-ui, sans-serif; }
  .doors { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid var(--rule); background: #f3ece1; }
  .doors button { appearance: none; border: 0; background: none; padding: 13px 10px 12px; font: 600 14.5px/1.25 'IBM Plex Sans', sans-serif; color: var(--ink-2); cursor: pointer; border-bottom: 3px solid transparent; }
  .doors button + button { border-left: 1px solid var(--rule); }
  .doors button[aria-selected='true'] { background: #fbf8f3; color: var(--ink); border-bottom-color: #c3873a; }
  .doors button:focus-visible { outline: 3px solid rgba(143, 93, 34, .6); outline-offset: -3px; }
  .panel { padding: 18px 20px 20px; min-height: 340px; }
  .q { font: 500 11px/1 'IBM Plex Mono', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 8px; }
  .q:not(:first-child) { margin-top: 14px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink); border-radius: 999px; padding: 7px 13px; min-height: 38px; font: 500 14.5px 'IBM Plex Sans', sans-serif; cursor: pointer; }
  .chip.mono { font-family: 'IBM Plex Mono', monospace; font-size: 14px; }
  .chip[aria-pressed='true'] { background: var(--ink); border-color: var(--ink); color: #f3ede3; }
  .chip:hover { border-color: var(--ink-3); }
  .nums { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); margin: 16px 0 6px; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .nums div { padding: 9px 10px 9px 0; }
  .nums div + div { border-left: 1px solid var(--rule); padding-left: 10px; }
  .nums dt { font: 500 10.5px 'IBM Plex Mono', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .nums dd { margin: 2px 0 0; font: 400 30px/1.05 'IBM Plex Mono', monospace; }
  .nums dd small { font-size: 13px; margin-left: 2px; color: var(--ink-3); }
  .nums dd.small { font: 500 15px/1.25 'IBM Plex Sans', sans-serif; padding-top: 6px; }
  .nums .coffee { color: #7a4e30; }
  .nums .water { color: #2f7484; }
  .note { font-size: 14px; color: var(--ink-2); margin: 6px 0 12px; }
  .likely { margin: 14px 0 6px; font-size: 15.5px; }
  .go { display: inline-block; background: var(--ink); color: #f3ede3; text-decoration: none; border-radius: 999px; padding: 11px 20px; font: 600 15px 'IBM Plex Sans', sans-serif; }
  .go:hover { background: #3b2a1f; }
  .pick { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .pick a { display: grid; grid-template-columns: 120px 1fr; gap: 14px; align-items: center; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 8px 12px 8px 8px; text-decoration: none; color: var(--ink); }
  .pick a:hover { border-color: var(--ink-3); background: #fffaf2; }
  .pm :global(svg) { display: block; width: 100%; height: auto; }
  .gallery .pm { border: 4px solid #2a2118; box-shadow: inset 0 0 0 1px rgba(214, 170, 92, .7); }
  .pick b { display: block; font: 400 23px/1.1 'Instrument Serif', Georgia, serif; }
  .pick small { display: block; font-size: 14px; color: var(--ink-2); margin-top: 2px; }
  @media (max-width: 640px) {
    .doors { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .doors button:nth-child(3) { border-left: 0; }
    .doors button:nth-child(n + 3) { border-top: 1px solid var(--rule); }
    .panel { padding: 14px 14px 16px; min-height: 0; }
    .nums { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .nums div:nth-child(3) { border-left: 0; padding-left: 0; }
    .nums div:nth-child(n + 3) { border-top: 1px solid var(--rule); }
    .nums dd { font-size: 26px; }
    .pick a { grid-template-columns: 96px 1fr; }
    .pick b { font-size: 20px; }
  }
</style>
