<script lang="ts">
  // Altitude on one fixed scale, sea level to 2,600 m, so any two origins compare honestly.
  // Arabica is the solid band; robusta, where it's a large share, the hatched one.
  import { bandText } from '../../../lib/coffee/origins.ts';
  import type { Band } from '../../../lib/coffee/origins.ts';
  interface Props { arabica: Band | null; robusta?: Band | null; name?: string; height?: number }
  let { arabica, robusta = null, name = '', height = 170 }: Props = $props();
  const TOP = 2600, H = 150;
  const y = (m: number) => 8 + H - (Math.min(m, TOP) / TOP) * H;
  const pid = $props.id();
  const uid = `ab-${pid}`;
  let text = $derived([arabica && `arabica ${bandText(arabica)}`, robusta && `robusta ${bandText(robusta)}`].filter(Boolean).join('; '));
</script>

<svg viewBox="0 0 92 172" height={height} width={(height * 92) / 172} role="img" aria-label={`${name ? name + ': ' : ''}${text || 'altitude not established'}`} class="ab">
  <defs><pattern id="{uid}-h" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="3" fill="#efe3cf" /><rect width="1.3" height="3" fill="#8a6a4a" /></pattern></defs>
  <!-- the mountain: a quiet silhouette behind the scale -->
  <path d="M30 {8 + H} L44 70 L52 82 L60 40 L72 66 L82 {8 + H} Z" fill="#e7dfd2" />
  {#each [0, 500, 1000, 1500, 2000, 2500] as m (m)}
    <line x1="26" x2="86" y1={y(m)} y2={y(m)} stroke="#2a1d15" stroke-opacity={m === 0 ? 0.5 : 0.12} stroke-width=".8" />
    <text x="22" y={y(m) + 3} text-anchor="end" class="t">{m === 0 ? 'sea' : `${m / 1000}k`}</text>
  {/each}
  {#if robusta}
    <rect x="60" y={y(robusta.max)} width="16" height={y(robusta.min) - y(robusta.max)} rx="3" fill="url(#{uid}-h)" stroke="#5b4a3d" stroke-width=".8" />
  {/if}
  {#if arabica}
    <rect x="38" y={y(arabica.max)} width="18" height={y(arabica.min) - y(arabica.max)} rx="3" fill="#7a4e30" />
    {#if arabica.upperBoundOpen}<path d="M41 {y(arabica.max) - 2} L47 {y(arabica.max) - 9} L53 {y(arabica.max) - 2}" fill="none" stroke="#7a4e30" stroke-width="1.6" />{/if}
  {/if}
  <text x="0" y="170" class="t">m</text>
</svg>

<style>
  .ab { display: block; overflow: visible; }
  .t { font: 500 9px 'IBM Plex Mono', monospace; fill: #75655a; }
</style>
