<script lang="ts">
  // A country's harvest ring with this month's hand and a plain line saying whether it's being
  // picked now. The page is built ahead of time, so the month is set in the reader's browser.
  import { onMount } from 'svelte';
  import HarvestRing from './art/HarvestRing.svelte';
  import { calendarTag, drawsEdge, harvestState, MONTHS_LONG } from '../../lib/coffee/origins.ts';
  import type { OriginFacts } from '../../lib/coffee/origins.ts';
  interface Props { harvest: OriginFacts['harvest']; name: string; size?: number }
  let { harvest, name, size = 150 }: Props = $props();
  let month = $state<number | null>(null);
  onMount(() => { month = new Date().getMonth() + 1; });
  let st = $derived(month ? harvestState({ harvest }, month) : null);
  // Which coffee the sentence is about, where the calendar isn't the whole country's (Thailand's northern
  // arabica, Vietnam's robusta), so "outside its harvest" isn't read as the whole crop (review r5, Muse).
  const tag = calendarTag({ harvest });
  // Which calendar the ring draws, when it isn't simply the country's arabica (Huila for Colombia).
  const scope = harvest.scope && !/^(arabica|robusta)$/i.test(harvest.scope) ? harvest.scope.replace(/ illustrative calendar/i, '').replace(/^\w/, (c) => c.toUpperCase()) : '';
</script>

<div class="hn">
  <HarvestRing harvest={harvest} month={month} labels size={size} label="{name} harvest calendar" />
  <p class="now" aria-live="polite">
    {#if month && st}
      {#if st === 'main'}<b>Harvesting now</b> ({MONTHS_LONG[month - 1]}, main crop{tag ? `, ${tag}` : ''}){:else if st === 'second'}<b>Harvesting now</b> ({MONTHS_LONG[month - 1]}, second crop{tag ? `, ${tag}` : ''}){:else if st === 'edge'}<b>Maybe</b>: {MONTHS_LONG[month - 1]} is just outside the calendar drawn, where picking can start early or run late{:else if st === 'elsewhere'}<b>Outside this calendar</b> in {MONTHS_LONG[month - 1]}, but {harvest.elsewhere}{:else}<b>Outside its harvest</b>{tag ? ` (${tag})` : ''} in {MONTHS_LONG[month - 1]}{/if}
    {/if}
  </p>
  <ul class="key" aria-label="Ring key">
    <li><span class="k main"></span>Main harvest</li>
    {#if harvest.second}<li><span class="k second"></span>Second crop</li>{/if}
    {#if drawsEdge({ harvest })}<li><span class="k edge"></span>Edge month, a margin we add: picking may start early or run late</li>{/if}
  </ul>
  {#if scope}<p class="sc">Calendar shown: {scope}</p>{/if}
</div>

<style>
  .hn { display: grid; justify-items: center; gap: 4px; }
  .sc { margin: 0; font-size: .82rem; color: var(--color-ink-3); text-align: center; max-width: 30ch; }
  .now { margin: 0; min-height: 1.4em; font: 400 14px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: #5b4a3d; text-align: center; }
  .now b { color: #2a1d15; }
  .key { list-style: none; margin: 0; padding: 0; display: flex; gap: 4px 12px; flex-wrap: wrap; justify-content: center; font: 400 12.5px 'IBM Plex Sans', 'IBM Plex Sans Fallback', sans-serif; color: #5b4a3d; }
  .key li { display: inline-flex; align-items: center; gap: 5px; }
  /* The month is only known in the browser: hold room for a two-line answer so nothing moves. */
  @media (max-width: 640px) { .now { min-height: 2.8em; } }
  .k { width: 14px; height: 8px; border-radius: 2px; display: inline-block; }
  .k.main { background: #b86e2c; }
  .k.second { background: #e2a861; }
  .k.edge { background: repeating-linear-gradient(45deg, #f1e2cc 0 2px, #c98a4e 2px 3.4px); }
</style>
