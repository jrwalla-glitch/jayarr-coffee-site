<script lang="ts">
  import { onMount } from 'svelte';
  import { buildRecipe, encodeBrew, flOzToMl, cToF, SYMPTOMS } from '../../lib/coffee/index.ts';
  import type { MethodId } from '../../lib/coffee/index.ts';
  import ToolMini from './art/ToolMini.svelte';
  import GalleryMini from './art/GalleryMini.svelte';
  import { harvestBags, harvestingIn, pickingElsewhereIn, MONTHS_LONG } from '../../lib/coffee/origins.ts';

  // The homepage's first screen is a decision with a working preview. "Make a better cup" runs the
  // Brew Guide's own engine, so the numbers here are the numbers there, and the button carries the
  // choice across. The other doors lead straight into the tool for that job.
  type Door = 'make' | 'fix' | 'choose' | 'explore';
  const DOORS: { id: Door; label: string }[] = [
    { id: 'make', label: 'Make a better cup' },
    { id: 'fix', label: 'Fix today\'s coffee' },
    { id: 'choose', label: 'Choose gear' },
    { id: 'explore', label: 'Explore' },
  ];
  const BREWERS: { id: MethodId; label: string }[] = [
    { id: 'v60', label: 'V60' }, { id: 'kalita', label: 'Kalita Wave' }, { id: 'chemex', label: 'Chemex' }, { id: 'french-press', label: 'French press' }, { id: 'aeropress', label: 'AeroPress' },
    { id: 'drip-machine', label: 'Drip machine' }, { id: 'cold-brew', label: 'Cold brew' }, { id: 'moka', label: 'Moka pot' }, { id: 'espresso', label: 'Espresso' },
  ];
  const CUPS = [8, 10, 12, 16];
  const FIX = ['sour', 'bitter', 'weak', 'strong', 'flat'];
  // What each taste usually points to, said as a likelihood: the Doctor asks before it decides, and
  // its answer depends on the brewer (a shot's time, a press's steep), so the door asks which.
  const FIX_BREWERS = BREWERS;
  // A drip machine sets its own water temperature, and Fix My Coffee never suggests changing it (review r5, Opus).
  function likely(id: string, m: MethodId): string {
    const steep = m === 'french-press' || m === 'aeropress' || m === 'cold-brew';
    if (m === 'espresso') return {
      sour: 'Often under-extracted. The shot time decides the fix: a fast shot wants a finer grind, one that runs on time a longer shot.',
      bitter: 'Over-extraction, a fast and uneven shot, or simply a dark roast: one timed shot tells them apart.',
      strong: 'Espresso is intense by design, and the ratio sets it: a longer shot, with more liquid per gram, makes it gentler.',
      flat: 'A thin cup or a tired one: too little coffee for the water, or stale beans and soft water. Fix My Coffee asks two questions to tell which.',
    }[id] ?? '';
    // Cold brew is a concentrate and a moka pot's ratio is set by the pot, so their advice is their own,
    // as the Doctor gives it (review r2, Opus).
    if (m === 'cold-brew') return {
      sour: 'Often under-extracted: a steep that was too short or a grind that was too coarse.',
      bitter: 'Often a steep that ran long or a grind that was too fine; dark roasts are bitter by nature.',
      weak: 'Cold brew is a concentrate: serve it with less water or milk before changing the recipe.',
      strong: 'Cold brew is a concentrate: add more cold water or milk when you serve it.',
      flat: 'A thin cup or a tired one: too little coffee for the water, or stale beans and soft water. Fix My Coffee asks two questions to tell which.',
    }[id] ?? '';
    if (m === 'moka') return {
      sour: 'Often the water passed through too fast: grind one step finer (still coarser than espresso); a lower flame, which slows it, is the next thing to try.',
      bitter: 'Often overheated: take the pot off the heat as it starts to sputter, and cool the base under the tap.',
      weak: 'Usually too little coffee in the basket: fill it level, without tamping.',
      strong: 'Moka coffee is concentrated by design: brew it as usual and add hot water to the cup to taste.',
      flat: 'A thin cup or a tired one: too little coffee for the water, or stale beans and soft water. Fix My Coffee asks two questions to tell which.',
    }[id] ?? '';
    return {
      sour: `Often under-extracted: the water didn't pull enough from the coffee. The usual suspects are a grind that's too coarse or ${steep ? 'a steep that was too short' : m === 'drip-machine' ? 'a brew that ran too fast' : 'a brew that ran too fast, or water that wasn\'t hot enough'}.`,
      bitter: `Often over-extracted: too much was pulled out. A grind that's too fine or ${steep ? 'a steep that ran too long' : 'a brew that ran too long'} are the usual suspects, though dark roasts are bitter by nature.`,
      weak: 'Usually too little coffee for the water, before anything else. A stronger ratio is the first thing to try.',
      strong: 'Usually too much coffee for the water, so the one change is a lighter ratio or a little hot water added; if the brew ran long, it\'s a coarser grind instead. Fix My Coffee asks which.',
      flat: 'A thin cup or a tired one: too little coffee for the water, or stale beans and soft water. Fix My Coffee asks two questions to tell which.',
    }[id] ?? '';
  }

  let door = $state<Door>('make');
  let method = $state<MethodId>('v60');
  let oz = $state(12);
  let symptom = $state('sour');
  let fixMethod = $state<MethodId>('v60');

  // Only the mug sizes this brewer makes well in one go are offered (one AeroPress holds about 22 g), and
  // none the Brew Guide would open with its small-batch warning (an 8 oz Chemex or cold brew; review r5, Muse).
  const fits = (m: MethodId, c: number) => { const r = buildRecipe({ method: m, target: { cupMl: flOzToMl(c) }, strength: 'classic', roast: 'medium' }); return r.ok && !r.warnings.some((w) => w.code === 'small-batch'); };
  let cups = $derived(method === 'espresso' || method === 'moka' ? [] : CUPS.filter((c) => fits(method, c)));
  $effect(() => { if (cups.length && !cups.includes(oz)) oz = cups.filter((c) => c <= oz).at(-1) ?? cups[0]; });
  let target = $derived(method === 'espresso' ? { doseG: 18 } : method === 'moka' ? { doseG: 15 } : { cupMl: flOzToMl(oz) });
  let res = $derived(buildRecipe({ method, target, strength: 'classic', roast: 'medium' }));
  let r = $derived(res.ok ? res.value : null);
  let href = $derived(`/tools/brew-ratio/?${encodeBrew({ method, target, strength: 'classic', roast: 'medium', units: 'us' })}`);
  const fmtG = (g: number) => { const v = Math.round(g * 10) / 10; return g >= 100 ? String(Math.round(g)) : Number.isInteger(v) ? String(v) : v.toFixed(1); };
  const sym = (id: string) => SYMPTOMS.find((s) => s.id === id)!;

  // ── The drawn row under the numbers: the cup at its size, the ratio as cells, the grind to scale ──
  // The ratio as the Brew Guide prints it: up to two decimals, trailing zeros dropped (6.25, 15, 2).
  let ratioText = $derived(r ? String(Math.round(r.ratio * 100) / 100) : '16');
  // An AeroPress mug's water is more than the chamber holds; the Guide adds the rest after pressing,
  // and the preview says so, so no one pours it all into the chamber (review r4, Muse H1).
  let topUpG = $derived.by(() => {
    if (method !== 'aeropress' || !r?.waterG || !r.steps.some((x) => x.kind === 'dilute')) return 0;
    const inChamber = r.steps.filter((x) => x.kind === 'pour').at(-1)?.toG;
    return inChamber != null ? Math.round(r.waterG - inChamber) : 0;
  });
  // One coffee cell, then a water cell per unit of the ratio; a fractional ratio (cold brew's 6.25)
  // ends on a part-cell, so the drawing says what the caption says.
  let cells = $derived.by(() => {
    const ratio = r ? r.ratio : 16, whole = Math.floor(ratio + 1e-9), part = ratio - whole;
    const n = whole + (part > 0.05 ? 1 : 0);
    return Array.from({ length: n + 1 }, (_, i) => ({ x: (i % 9) * 11, y: Math.floor(i / 9) * 11, coffee: i === 0, w: i === n && part > 0.05 ? Math.max(2, 9 * part) : 9 }));
  });
  let cellRows = $derived(Math.ceil(cells.length / 9));
  // A mug's height grows with its size: 8 oz to 16 oz.
  let mugH = $derived(30 + 34 * Math.min(1, Math.max(0, (oz - 8) / 8)));
  // Grind: five grounds from fine to coarse, drawn to one scale (1 mm = 22 units); the ones in the
  // recipe's range are lit, so the size reads against its neighbours.
  const GRIND_STEPS = [{ um: 250, x: 10 }, { um: 450, x: 25 }, { um: 650, x: 43 }, { um: 900, x: 64 }, { um: 1200, x: 88 }];
  const grain = (x: number, d: number, k: number) => Array.from({ length: 7 }, (_, q) => { const a = (q / 7) * Math.PI * 2, rr = (d / 2) * (0.8 + 0.28 * Math.abs(Math.sin(k * 3.7 + q * 1.9))); return `${(x + Math.cos(a) * rr).toFixed(1)},${(58 - d / 2 + Math.sin(a) * rr).toFixed(1)}`; }).join(' ');
  let grains = $derived(GRIND_STEPS.map((g, k) => ({ ...g, d: (g.um / 1000) * 22, pts: grain(g.x, (g.um / 1000) * 22, k), on: !!r && g.um >= r.grind.microns.min && g.um <= r.grind.microns.max })).map((g, _, all) => {
    // Only grains inside the recipe's band are lit; if none of the five steps falls inside, the nearest one (review r3, Muse).
    if (!r || all.some((x) => x.on)) return g;
    const mid = (r.grind.microns.min + r.grind.microns.max) / 2, near = all.reduce((b, x) => (Math.abs(x.um - mid) < Math.abs(b.um - mid) ? x : b));
    return { ...g, on: g.um === near.um };
  }));
  let litSpan = $derived.by(() => { const on = grains.filter((g) => g.on); return on.length ? [Math.max(1, on[0].x - on[0].d / 2 - 2), Math.min(99, on[on.length - 1].x + on[on.length - 1].d / 2 + 2)] : null; });
  let grindShort = $derived(r ? r.grind.label.replace(/\s*\(.*\)$/, '') : '');

  // ── The Fix door's picture: a small extraction map, the taste marked, an arrow to the usual fix ──
  const MAP_AT: Record<string, [number, number]> = { sour: [86, 66], bitter: [234, 66], weak: [160, 118], strong: [160, 16], flat: [160, 92] };
  // Only the direction to move: how to get there depends on the brewer, which is the Doctor's job.
  const MAP_FIX: Record<string, string> = { sour: 'extract more?', bitter: 'extract less?', weak: 'stronger?', strong: 'weaker?', flat: 'thin, or stale?' };
  // A bitter shot can be a fast, uneven one, so for espresso the picture asks for the timing first, as the Doctor does.
  let fixLabel = $derived(fixMethod === 'espresso' && symptom === 'bitter' ? 'time the shot?' : MAP_FIX[symptom]);

  // The Explore door's live line: who is harvesting this month (the reader's month, once known).
  let mounted = $state(false);
  let month = $state(10);
  let elsewhereNow = $derived(pickingElsewhereIn(month));
  let nowNames = $derived.by(() => {
    const now = [...harvestingIn(month)].sort((a, b) => harvestBags(b) - harvestBags(a));
    return `${now.slice(0, 4).map((o) => o.name).join(', ')}${now.length > 4 ? ` and ${now.length - 4} more` : ''}`;
  });
  onMount(() => {
    try { const d = sessionStorage.getItem('jayarr-home-door') as Door | null; if (d && DOORS.some((x) => x.id === d)) door = d; } catch { /* no storage */ }
    month = new Date().getMonth() + 1;
    mounted = true;
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
          {#each cups as c (c)}<button type="button" class="chip" aria-pressed={oz === c} onclick={() => (oz = c)}>{c} oz</button>{/each}
          {#if cups.length < CUPS.length}<span class="cupnote">{method === 'aeropress' ? 'One press makes about 8 oz; for a bigger mug, make two.' : cups[0] > CUPS[0] ? `The Brew Guide starts a ${BREWERS.find((b) => b.id === method)?.label} ${method === 'cold-brew' || method === 'drip-machine' ? 'batch' : 'brew'} at ${cups[0]} oz; less is too small to brew well.` : `The Brew Guide sizes one ${BREWERS.find((b) => b.id === method)?.label} ${method === 'cold-brew' || method === 'drip-machine' ? 'batch' : 'brew'} up to ${cups.at(-1)} oz.`}</span>{/if}
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
        </dl>
        <div class="figs" aria-hidden="true">
          <figure>
            <svg viewBox="0 0 100 84">
              <line x1="6" x2="94" y1="80" y2="80" class="ground" />
              {#if method === 'espresso' || method === 'moka'}
                <path d="M34 62 H66 V70 a8 8 0 0 1 -8 8 H42 a8 8 0 0 1 -8 -8 Z" class="cup" /><path d="M66 64 h3 a4 4 0 0 1 0 8 h-3" class="line" />
                <rect x="35" y="63.5" width="30" height="4" class="crema" />
              {:else if method === 'cold-brew'}
                <rect x="32" y="22" width="36" height="56" rx="4" class="glass" /><rect x="34" y="34" width="32" height="42" rx="2" class="brew" /><rect x="30" y="16" width="40" height="7" rx="2" class="lid" />
              {:else}
                <path d="M{50 - 22} {78 - mugH} H{50 + 22} V{70} a8 8 0 0 1 -8 8 H{50 - 14} a8 8 0 0 1 -8 -8 Z" class="cup" />
                <path d="M{50 + 22} {78 - mugH + 8} h5 a8 8 0 0 1 0 16 h-5" class="line" />
                <path d="M{50 - 21} {78 - mugH * 0.84} H{50 + 21} V{70} a7 7 0 0 1 -7 7 H{50 - 14} a7 7 0 0 1 -7 -7 Z" class="brew" />
              {/if}
            </svg>
            <figcaption>{method === 'espresso' ? 'A double shot' : method === 'cold-brew' ? 'A jar of concentrate' : method === 'moka' ? 'One pot' : `${oz === 8 || oz === 11 || oz === 18 ? 'An' : 'A'} ${oz} oz mug`}</figcaption>
          </figure>
          <figure>
            <svg viewBox="0 0 100 84">
              <g transform="translate({50 - (Math.min(9, cells.length) * 11 - 2) / 2} {78 - (cellRows * 11 - 2)})">
                {#each cells as c, i (i)}<rect x={c.x} y={c.y} width={c.w} height="9" rx="1.5" class={c.coffee ? 'cc' : 'cw'} />{/each}
              </g>
            </svg>
            <figcaption><b class="k-c">1</b> coffee to <b class="k-w">{ratioText}</b> {method === 'espresso' ? 'in the cup' : 'water'}</figcaption>
          </figure>
          <figure>
            <svg viewBox="0 0 100 84">
              <line x1="2" x2="98" y1="62" y2="62" class="ground" />
              {#each grains as g (g.um)}<polygon points={g.pts} class="grain" class:off={!g.on} />{/each}
              {#if litSpan}<path d="M{litSpan[0]} 66 V69 H{litSpan[1]} V66" class="bracket" />{/if}
              <text x="2" y="80" class="mm">fine</text><text x="98" y="80" text-anchor="end" class="mm">coarse</text>
            </svg>
            <figcaption>{grindShort}, like {r.grind.texture}</figcaption>
          </figure>
        </div>
        <p class="note">{method === 'espresso' ? 'A double shot: 18 g in, 36 g out, in 25–30 seconds.' : method === 'cold-brew' ? 'A concentrate: dilute it about one to one to serve.' : method === 'moka' ? 'The pot sets the amounts: coffee level in the basket, water to just below the valve. The Brew Guide opens on a 15 g basket; set your pot there.' : `1:${ratioText} is the Brew Guide's classic strength for the ${BREWERS.find((b) => b.id === method)?.label}, and the Guide ${method === 'french-press' || method === 'aeropress' ? 'times the steep and the press' : method === 'cold-brew' ? 'times the steep' : method === 'drip-machine' ? 'walks you through the batch' : 'times every pour'}.${topUpG > 0 ? ` The chamber holds about 230 g, so ${topUpG} g of the water goes in after pressing.` : ''}`}</p>
      {/if}
      <a class="go" href={href}>Brew it step by step →</a>
    {:else if door === 'fix'}
      <p class="q">How does it taste?</p>
      <div class="chips">
        {#each FIX.filter((id) => fixMethod === 'espresso' ? sym(id).espresso : sym(id).filter) as id (id)}<button type="button" class="chip" aria-pressed={symptom === id} onclick={() => (symptom = id)}>{sym(id).label}</button>{/each}
      </div>
      <p class="q">Made with</p>
      <div class="chips">
        {#each FIX_BREWERS as b (b.id)}<button type="button" class="chip" aria-pressed={fixMethod === b.id} onclick={() => { fixMethod = b.id; if (b.id === 'espresso' && !sym(symptom).espresso) symptom = 'sour'; }}>{b.label}</button>{/each}
      </div>
      {@const [mx, my] = MAP_AT[symptom]}
      <svg class="xmap" viewBox="0 0 320 136" aria-hidden="true">
        <rect x="24" y="4" width="272" height="124" rx="6" class="field" />
        <rect x="128" y="44" width="64" height="44" rx="4" class="ideal" /><text x="160" y="70" text-anchor="middle" class="ax">balanced</text>
        <text x="30" y="70" class="ax">sour</text><text x="290" y="70" text-anchor="end" class="ax">bitter</text>
        <text x="160" y="16" text-anchor="middle" class="ax" opacity={symptom === 'strong' ? 0 : 1}>strong</text><text x="160" y="124" text-anchor="middle" class="ax" opacity={symptom === 'weak' ? 0 : 1}>weak</text>
        {#if symptom === 'flat'}
          <circle cx={mx} cy={my} r="26" class="ring" />
          <text x={mx + 34} y={my - 22} class="fixlab">{fixLabel}</text>
        {:else}
          {@const vert = symptom === 'weak' || symptom === 'strong'}
          {@const tx = symptom === 'sour' ? 124 : symptom === 'bitter' ? 196 : 160}
          {@const ty = symptom === 'weak' ? 92 : symptom === 'strong' ? 40 : 66}
          <line x1={mx} y1={my} x2={tx} y2={ty} class="arrow" marker-end="url(#hs-arr)" />
          <text x={vert ? mx + 12 : mx} y={vert ? (my + ty) / 2 + 5 : my + 26} text-anchor={vert ? 'start' : 'middle'} class="fixlab">{fixLabel}</text>
        {/if}
        <circle cx={mx} cy={my} r="7" class="mark" />
        <defs><marker id="hs-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L9 5 L0 9 Z" fill="#8f5d22" /></marker></defs>
      </svg>
      <p class="likely"><b>{sym(symptom).tagline}.</b> {likely(symptom, fixMethod)}</p>
      <p class="note">Fix My Coffee asks two or three questions about your brew, then gives you one change to try and keeps everything else the same.</p>
      <a class="go" href="/tools/fix-my-coffee/?method={fixMethod}&symptom={symptom}">Find the one change →</a>
    {:else if door === 'choose'}
      <ul class="pick">
        <li><a href="/tools/espresso-machines/"><span class="pm" aria-hidden="true"><ToolMini id="machines" /></span><span><b>An espresso machine</b><small>Machines matched to how you drink and what you'll spend, grinder included</small></span></a></li>
        <li><a href="/tools/nespresso-pods/"><span class="pm" aria-hidden="true"><ToolMini id="pods" /></span><span><b>Nespresso pods</b><small>Every capsule your machine takes, Original or Vertuo</small></span></a></li>
        <li><a href="/deep-brew/calibrator/"><span class="pm" aria-hidden="true"><ToolMini id="calibrator" /></span><span><b>Your grinder's setting</b><small>The number to set for your brewer, from makers' guidance and testers' data</small></span></a></li>
      </ul>
      <a class="go" href="/tools/#job-choose">Every gear tool →</a>
    {:else}
      <ul class="pick gallery">
        <li><a href="/explore/flavors/"><span class="pm" aria-hidden="true"><GalleryMini id="flavors" names={false} /></span><span><b>The Flavor Bloom</b><small>Learn to taste a note, and how often roasters use it</small></span></a></li>
        <li><a href="/explore/origins/"><span class="pm" aria-hidden="true"><GalleryMini id="origins" names={false} /></span><span><b>The Coffee Origins</b><small>Who's harvesting now, and how high it grows</small></span></a></li>
        <li><a href="/explore/methods/"><span class="pm" aria-hidden="true"><GalleryMini id="methods" names={false} /></span><span><b>The Brewing Constellations</b><small>How thirteen brewers really differ</small></span></a></li>
      </ul>
      <p class="note nowh" class:pending={!mounted}>Harvesting in {MONTHS_LONG[month - 1]}: {nowNames}.{#if elsewhereNow.length}{' '}{elsewhereNow.map((o) => o.name).join(' and ')} {elsewhereNow.length > 1 ? 'pick' : 'picks'} in some regions too.{/if}</p>
      <a class="go" href="/explore/">Walk through the gallery →</a>
    {/if}
  </div>
</div>

<style>
  .hs { --ink: #2a1d15; --ink-2: #5b4a3d; --ink-3: #75655a; --rule: #d9cdbd; --crema-deep: #8f5d22; background: #fbf8f3; color: var(--ink); border-radius: 18px; box-shadow: 0 30px 60px -30px rgba(0, 0, 0, .55); overflow: hidden; font: 16px/1.5 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif; }
  .doors { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); border-bottom: 1px solid var(--rule); background: #f3ece1; }
  .doors button { appearance: none; border: 0; background: none; padding: 13px 10px 12px; font: 600 14.5px/1.25 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: var(--ink-2); cursor: pointer; border-bottom: 3px solid transparent; }
  .doors button + button { border-left: 1px solid var(--rule); }
  .doors button[aria-selected='true'] { background: #fbf8f3; color: var(--ink); border-bottom-color: #c3873a; }
  .doors button:focus-visible { outline: 3px solid rgba(143, 93, 34, .6); outline-offset: -3px; }
  /* Every door is the same height on desktop, so nothing below the card moves when you switch. */
  /* Every door the same height on desktop; the button sits at the card's foot, so the room reads as layout, not leftover. */
  .panel { padding: 18px 20px 20px; min-height: 600px; display: flex; flex-direction: column; }
  .panel > .go { margin-top: auto; align-self: flex-start; }
  .panel > .pick + .go, .panel > .nowh + .go { margin-top: auto; }
  .q { font: 500 11px/1 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-3); margin: 0 0 8px; }
  .q:not(:first-child) { margin-top: 14px; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { appearance: none; border: 1px solid var(--rule); background: #fff; color: var(--ink); border-radius: 999px; padding: 7px 13px; min-height: 38px; font: 500 14.5px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; cursor: pointer; }
  .chip[aria-pressed='true'] { background: var(--ink); border-color: var(--ink); color: #f3ede3; }
  .chip:hover { border-color: var(--ink-3); }
  .cupnote { align-self: center; font-size: 13px; color: var(--ink-3); }
  .nums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); margin: 16px 0 0; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
  .nums div { padding: 9px 10px 9px 0; }
  .nums div + div { border-left: 1px solid var(--rule); padding-left: 10px; }
  .nums dt { font: 500 10.5px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-3); }
  .nums dd { margin: 2px 0 0; font: 400 30px/1.05 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; }
  .nums dd small { font-size: 13px; margin-left: 2px; color: var(--ink-3); }
  .nums dd.small { font: 500 15px/1.25 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; padding-top: 6px; }
  .nums .coffee { color: #7a4e30; }
  .nums .water { color: #2f7484; }
  .note { font-size: 14px; color: var(--ink-2); margin: 6px 0 12px; text-wrap: pretty; }
  .pending { visibility: hidden; }
  .pick + .go { margin-top: 14px; }
  .figs { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 4px 0 10px; }
  .figs figure { margin: 0; text-align: center; }
  .figs svg { display: block; width: 100%; max-width: 132px; height: auto; margin: 0 auto; }
  .figs figcaption { font: 500 12px/1.3 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; color: var(--ink-2); margin-top: 2px; text-wrap: balance; }
  .figs .ground { stroke: #cdbfac; stroke-width: 1.2; }
  .figs .cup, .figs .glass { fill: #fffdf9; stroke: var(--ink); stroke-width: 1.6; }
  .figs .line { fill: none; stroke: var(--ink); stroke-width: 1.6; }
  .figs .brew { fill: #6b4128; }
  .figs .crema { fill: #c3873a; }
  .figs .lid { fill: #c9b9a2; stroke: var(--ink); stroke-width: 1.2; }
  .figs .cc { fill: #7a4e30; }
  .figs .cw { fill: #7fb3bd; }
  .figs .grain { fill: #8a5a36; stroke: #4a2d1a; stroke-width: .6; }
  .figs .grain.off { fill: #e9dfd1; stroke: #b9a891; }
  .figs .bracket { fill: none; stroke: #c3873a; stroke-width: 1.4; }
  .figs .scale { stroke: var(--ink-3); stroke-width: 1; }
  .figs .mm { font: 500 8px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; fill: var(--ink-3); }
  .figs b { font-weight: 600; }
  .k-c { color: #7a4e30; } .k-w { color: #2f7484; }
  .xmap { display: block; width: 100%; max-width: 460px; height: auto; margin: 14px auto 0; }
  .xmap .field { fill: #f6efe4; stroke: var(--rule); }
  .xmap .ideal { fill: #e7efe0; stroke: #8aa070; stroke-dasharray: 3 3; }
  .xmap .ax { font: 500 10px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .06em; fill: var(--ink-3); }
  .xmap .mark { fill: #c3873a; stroke: var(--ink); stroke-width: 1.5; }
  .xmap .ring { fill: none; stroke: #c3873a; stroke-width: 1.5; stroke-dasharray: 4 3; }
  .xmap .arrow { stroke: #8f5d22; stroke-width: 2; }
  .xmap .fixlab { font: italic 400 15px 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; fill: #6b3a12; paint-order: stroke; stroke: #f6efe4; stroke-width: 4px; }
  .likely { margin: 10px 0 6px; font-size: 15.5px; text-wrap: pretty; }
  .go { display: inline-block; background: var(--ink); color: #f3ede3; text-decoration: none; border-radius: 999px; padding: 11px 20px; font: 600 15px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; }
  .go:hover { background: #3b2a1f; }
  .pick { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
  .pick a { display: grid; grid-template-columns: 150px 1fr; gap: 16px; align-items: center; border: 1px solid var(--rule); background: #fff; border-radius: 12px; padding: 10px 14px 10px 10px; text-decoration: none; color: var(--ink); }
  @media (hover: hover) { .pick a:hover { border-color: var(--ink-3); background: #fffaf2; } }
  .pm :global(svg) { display: block; width: 100%; height: auto; }
  .gallery .pm { border: 4px solid #2a2118; box-shadow: inset 0 0 0 1px rgba(214, 170, 92, .7); }
  .pick b { display: block; font: 400 23px/1.1 'Instrument Serif', 'Instrument Serif Fallback', Georgia, serif; }
  .pick small { display: block; font-size: 14px; color: var(--ink-2); margin-top: 2px; }
  @media (max-width: 640px) {
    .doors { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .doors button:nth-child(3) { border-left: 0; }
    .doors button:nth-child(n + 3) { border-top: 1px solid var(--rule); }
    .panel { padding: 14px 14px 16px; min-height: 0; }
    .panel > .go, .panel > .pick + .go, .panel > .nowh + .go { margin-top: 10px; }
    .nums div + div { padding-left: 8px; }
    .nums dd { font-size: 24px; }
    .figs figcaption { font-size: 11px; }
    .pick a { grid-template-columns: 96px 1fr; }
    .pick b { font-size: 20px; }
  }
</style>
