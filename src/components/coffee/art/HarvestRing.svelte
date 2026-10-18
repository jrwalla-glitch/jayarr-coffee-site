<svelte:options namespace="svg" />
<script lang="ts">
  // A year as a ring: January at the top, clockwise. Solid copper is the main harvest, the paler
  // arc a second crop, hatching a month or two either side as a buffer (picking can start early or run late). Drawn as its own
  // <svg>, so it nests inside a map as easily as it sits in a page.
  import { harvestState, MONTHS } from '../../../lib/coffee/origins.ts';
  import type { OriginFacts } from '../../../lib/coffee/origins.ts';

  interface Props {
    harvest: OriginFacts['harvest'];
    /** Month to point at (1–12), or null. */
    month?: number | null;
    /** Month letters around the ring. */
    labels?: boolean;
    size?: number;
    x?: number;
    y?: number;
    /** Dim the ring (e.g. not harvesting in the chosen month). */
    faint?: boolean;
    label?: string;
  }
  let { harvest, month = null, labels = false, size = 120, x, y, faint = false, label }: Props = $props();

  const R = 40, W = 12;
  const rad = (d: number) => ((d - 90) * Math.PI) / 180;
  function arc(i: number, gap = 1.6) {
    const a0 = rad(i * 30 + gap), a1 = rad(i * 30 + 30 - gap);
    return `M${(Math.cos(a0) * R).toFixed(2)} ${(Math.sin(a0) * R).toFixed(2)} A ${R} ${R} 0 0 1 ${(Math.cos(a1) * R).toFixed(2)} ${(Math.sin(a1) * R).toFixed(2)}`;
  }
  const pid = $props.id();
  const uid = `hr-${pid}`;
  let states = $derived(Array.from({ length: 12 }, (_, i) => harvestState({ harvest }, i + 1)));
  // The ring draws its own calendar; months picked only in other regions stay unfilled here.
  const COLOUR: Record<string, string> = { main: '#b86e2c', second: '#e2a861', edge: `url(#${uid}-hatch)`, elsewhere: '#d9cdbd', off: '#d9cdbd' };
</script>

<svg viewBox={labels ? '-60 -60 120 120' : '-48 -48 96 96'} width={size} height={size} x={x !== undefined ? x - size / 2 : undefined} y={y !== undefined ? y - size / 2 : undefined}
  role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'} class="hring" class:faint>
  <defs>
    <pattern id="{uid}-hatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="3.2" height="3.2" fill="#f1e2cc" /><rect width="1.4" height="3.2" fill="#c98a4e" />
    </pattern>
  </defs>
  <circle r={R + W / 2 + 1.5} fill="#fbf6ee" fill-opacity={labels ? 0 : 0.92} stroke="#2a1d15" stroke-opacity=".25" stroke-width=".8" />
  {#each states as st, i (i)}
    <path d={arc(i)} fill="none" stroke={COLOUR[st]} stroke-width={W} stroke-opacity={st === 'off' || st === 'elsewhere' ? 0.7 : 1} />
  {/each}
  <circle r={R - W / 2 - 1.5} fill={labels ? '#fbf6ee' : '#fbf6ee'} stroke="#2a1d15" stroke-opacity=".2" stroke-width=".8" />
  {#if month}
    {@const a = rad((month - 1) * 30 + 15)}
    <path d="M{Math.cos(a) * (R - W / 2 - 4)} {Math.sin(a) * (R - W / 2 - 4)} L0 0" stroke="#2a1d15" stroke-width="2.2" stroke-linecap="round" />
    <circle r="3.4" fill="#2a1d15" />
  {:else}
    <circle r="3" fill="#2a1d15" opacity=".7" />
  {/if}
  {#if labels}
    {#each MONTHS as m, i (m)}
      {@const a = rad(i * 30 + 15)}
      <text x={Math.cos(a) * 54} y={Math.sin(a) * 54 + 3.4} text-anchor="middle" class="ml" class:on={month === i + 1}>{m[0]}</text>
    {/each}
  {/if}
</svg>

<style>
  .hring { overflow: visible; transition: opacity .3s; }
  .hring.faint { opacity: .42; }
  .ml { font: 500 10px 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif; fill: #75655a; }
  .ml.on { fill: #2a1d15; font-weight: 700; }
</style>
