<script lang="ts">
  // Altitude on one fixed scale, sea level to 2,600 m, so any two origins compare honestly.
  // Arabica is the solid band; robusta, where it's a large share, the hatched one.
  import { mToFt } from '../../../lib/coffee/origins.ts';
  import type { Band } from '../../../lib/coffee/origins.ts';
  interface Props { arabica: Band | null; robusta?: Band | null; name?: string; height?: number }
  let { arabica, robusta = null, name = '', height = 170 }: Props = $props();
  const TOP = 2600, H = 148, Y0 = 18, W = 160, VH = 190;
  const y = (m: number) => Y0 + H - (Math.min(m, TOP) / TOP) * H;
  const pid = $props.id();
  const uid = `ab-${pid}`;
  const m = (v: number) => v.toLocaleString('en-US');
  // An open upper bound (the source's edge is above its figure) reads "and above", as the drawn "+" does.
  const span = (b: Band) => `${m(b.min)} to ${m(b.max)} meters${b.upperBoundOpen ? ' and above' : ''}`;
  let text = $derived([arabica && `arabica ${span(arabica)}`, robusta && `robusta ${span(robusta)}`].filter(Boolean).join('; '));
</script>

<svg viewBox="0 0 {W} {VH}" height={height} width={(height * W) / VH} role="img" aria-label={`${name ? name + ' altitude: ' : 'Altitude: '}${text || 'not established'}`} class="ab">
  <defs><pattern id="{uid}-h" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="#efe3cf" /><rect width="1.3" height="3" fill="#8a6a4a" /></pattern></defs>
  <text x="46" y="8" text-anchor="end" class="t ttl">meters</text>
  {#each [0, 500, 1000, 1500, 2000, 2500] as v (v)}
    <line x1="50" x2="80" y1={y(v)} y2={y(v)} stroke="#2a1d15" stroke-opacity={v === 0 ? 0.5 : 0.14} stroke-width=".8" />
    <text x="46" y={y(v) + 3.5} text-anchor="end" class="t">{v === 0 ? 'sea level' : m(v)}</text>
  {/each}
  {#if robusta}
    <rect x="68" y={y(robusta.max)} width="10" height={y(robusta.min) - y(robusta.max)} rx="2.5" fill="url(#{uid}-h)" stroke="#5b4a3d" stroke-width=".8" />
  {/if}
  {#if arabica}
    <rect x="54" y={y(arabica.max)} width="12" height={y(arabica.min) - y(arabica.max)} rx="3" fill="#7a4e30" />
    {#if arabica.upperBoundOpen}<path d="M55 {y(arabica.max) - 2} L60 {y(arabica.max) - 8} L65 {y(arabica.max) - 2}" fill="none" stroke="#7a4e30" stroke-width="1.6" />{/if}
    <text x="84" y={y(arabica.max) + 4} class="v">{m(arabica.max)}{arabica.upperBoundOpen ? '+' : ''}</text>
    <text x="84" y={y(arabica.min) + 2} class="v">{m(arabica.min)}</text>
    <text x={W - 2} y={VH - 3} text-anchor="end" class="ft">{m(mToFt(arabica.min))}–{m(mToFt(arabica.max))}{arabica.upperBoundOpen ? '+' : ''} ft</text>
  {/if}
</svg>

<style>
  .ab { display: block; overflow: visible; }
  .t { font: 500 10px 'IBM Plex Sans', 'IBM Plex Sans Fallback', system-ui, sans-serif; fill: #75655a; }
  .ttl { font: 500 9px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; letter-spacing: .1em; text-transform: uppercase; }
  .v { font: 600 12px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; fill: #2a1d15; }
  .ft { font: 500 11px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; fill: #5b4a3d; }
</style>
