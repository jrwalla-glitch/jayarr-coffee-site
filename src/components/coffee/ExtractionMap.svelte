<script lang="ts">
  // The brewing control chart as a map: extraction left→right (sour→bitter), strength
  // bottom→top (weak→strong). Qualitative: taste places the cup, it doesn't measure it.
  import type { ZoneId } from '../../lib/coffee/index.ts';

  interface Props {
    /** 0..1 across (extraction) and up (strength). */
    x: number;
    y: number;
    zone: ZoneId;
    showArrow?: boolean;
    label?: string;
    compact?: boolean;
    /** Measured mode: numeric axes. Each ideal band is the middle third of its axis. */
    axes?: { ey: [number, number]; tds: [number, number]; eyIdeal: [number, number]; tdsIdeal: [number, number] };
    /** No reading yet (or an invalid one): draw the chart with no cup on it. */
    empty?: boolean;
    emptyText?: string;
    /** Taste and time disagree: draw the cup as a fuzzy estimate rather than a point. */
    uncertain?: boolean;
    /** Strength isn't judged (a diluted drink): no zone or sweet-spot emphasis. */
    plain?: boolean;
    /** Only the extraction is known (a diluted drink): a line at that extraction, not a dot at a strength it doesn't have. */
    extractionOnly?: boolean;
  }
  let { x, y, zone, showArrow = true, label = '', compact = false, axes, empty = false, emptyText = 'enter a valid reading to place your cup', uncertain = false, plain = false, extractionOnly = false }: Props = $props();
  const n = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2).replace(/0$/, ''));

  const L = 64, R = 384, T = 18, B = 338;
  const W = R - L, H = B - T;
  let px = $derived(L + Math.max(0.04, Math.min(0.96, x)) * W);
  let py = $derived(B - Math.max(0.04, Math.min(0.96, y)) * H);
  const cx = L + W / 2, cy = T + H / 2;
  let inSweet = $derived(zone === 'ideal-ideal');
  // arrow stops at the edge of the sweet-spot cell
  let arrow = $derived.by(() => {
    const dx = cx - px, dy = cy - py, len = Math.hypot(dx, dy);
    if (len < 30) return null;
    const stop = Math.min(len - 8, len - (W / 6) * 0.9);
    return { x2: px + (dx / len) * stop, y2: py + (dy / len) * stop };
  });
  const cols = ['under', 'ideal', 'over'], rows = ['strong', 'ideal', 'weak'];
</script>

<svg viewBox="0 0 400 {compact ? 372 : 392}" role="img" aria-label={label || `Extraction map: your cup sits in the ${zone.replace('-', ', ')} zone.`} class="map">
  <defs>
    <linearGradient id="em-x" x1="0" x2="1"><stop offset="0" style="stop-color: var(--t-map-sour, #f1e7b9)" /><stop offset=".5" style="stop-color: var(--t-map-mid, #f6eee0)" /><stop offset="1" style="stop-color: var(--t-map-bitter, #d9c2a8)" /></linearGradient>
    <linearGradient id="em-y" x1="0" y1="1" x2="0" y2="0"><stop offset="0" style="stop-color: var(--t-map-weak, #3f8796)" stop-opacity=".16" /><stop offset=".5" style="stop-color: var(--t-surface, #fff)" stop-opacity="0" /><stop offset="1" style="stop-color: var(--t-map-strong, #3b2214)" stop-opacity=".2" /></linearGradient>
    <marker id="em-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style="fill: var(--t-crema-deep, #8f5d22)" /></marker>
  </defs>
  <rect x={L} y={T} width={W} height={H} fill="url(#em-x)" rx="10" />
  <rect x={L} y={T} width={W} height={H} fill="url(#em-y)" rx="10" />
  {#each [1, 2] as i (i)}
    <line x1={L + (W / 3) * i} x2={L + (W / 3) * i} y1={T} y2={B} style="stroke: var(--t-ink, #2a1d15)" stroke-opacity=".12" />
    <line x1={L} x2={R} y1={T + (H / 3) * i} y2={T + (H / 3) * i} style="stroke: var(--t-ink, #2a1d15)" stroke-opacity=".12" />
  {/each}
  <rect x={L + W / 3} y={T + H / 3} width={W / 3} height={H / 3} rx="6" style="fill: var(--t-surface-2, #fffdf8); stroke: var(--t-crema, #c3873a)" fill-opacity=".7" stroke-width={inSweet && !empty && !plain ? 2.5 : 1.5} />
  <text x={cx} y={cy + 4} text-anchor="middle" class="sweet">{axes ? 'reference range' : 'sweet spot'}</text>
  {#each rows as r, ri (r)}
    {#each cols as c, ci (c)}
      {#if `${c}-${r}` === zone && !inSweet && !empty && !plain}
        <rect x={L + (W / 3) * ci + 3} y={T + (H / 3) * ri + 3} width={W / 3 - 6} height={H / 3 - 6} rx="6" fill="none" style="stroke: var(--t-ink, #2a1d15)" stroke-width="1.5" stroke-dasharray="4 4" />
      {/if}
    {/each}
  {/each}

  <!-- axes -->
  {#if axes}
    {#each [axes.ey[0], axes.eyIdeal[0], axes.eyIdeal[1], axes.ey[1]] as v, i (i)}
      <text x={L + (W / 3) * i} y={B + 20} text-anchor={i === 0 ? 'start' : i === 3 ? 'end' : 'middle'} class="num">{n(v)}%</text>
    {/each}
    <text x={cx} y={B + 40} text-anchor="middle" class="ax">extraction yield</text>
    {#each [axes.tds[0], axes.tdsIdeal[0], axes.tdsIdeal[1], axes.tds[1]] as v, i (i)}
      <text x={L - 8} y={B - (H / 3) * i + (i === 0 ? 0 : i === 3 ? 10 : 4)} text-anchor="end" class="num">{n(v)}</text>
    {/each}
    <text transform="translate({L - 48} {cy}) rotate(-90)" text-anchor="middle" class="ax">strength, % TDS</text>
  {:else}
    <text x={L} y={B + 22} class="ax">sour</text>
    <text x={cx} y={B + 22} text-anchor="middle" class="ax">extraction</text>
    <text x={R} y={B + 22} text-anchor="end" class="ax">bitter</text>
    {#if !compact}<text x={cx} y={B + 42} text-anchor="middle" class="ax2">under-extracted ← → over-extracted</text>{/if}
    <text transform="translate({L - 16} {B}) rotate(-90)" class="ax">weak</text>
    <text transform="translate({L - 16} {cy}) rotate(-90)" text-anchor="middle" class="ax">strength</text>
    <text transform="translate({L - 16} {T}) rotate(-90)" text-anchor="end" class="ax">strong</text>
  {/if}

  {#if empty}
    <text x={cx} y={T + 26} text-anchor="middle" class="ax2">{emptyText}</text>
  {:else if extractionOnly}
    <line x1={px} x2={px} y1={T + 4} y2={B - 4} style="stroke: var(--t-ink, #2a1d15)" stroke-width="2.5" stroke-dasharray="6 5" />
    <path d="M{px} {B - 2} l-7 10 h14 z" style="fill: var(--t-ink, #2a1d15)" />
    <text x={px < cx ? px + 8 : px - 8} y={T + 22} text-anchor={px < cx ? 'start' : 'end'} class="ax2">diluted: strength not judged</text>
  {:else}
  {#if showArrow && arrow && !inSweet}
    <line x1={px} y1={py} x2={arrow.x2} y2={arrow.y2} style="stroke: var(--t-crema-deep, #8f5d22)" stroke-width="2.2" marker-end="url(#em-head)" class="arrow" />
  {/if}
  <g class="dot" style:transform="translate({px}px, {py}px)">
    {#if uncertain}<circle r="44" style="fill: var(--t-crema, #c3873a); stroke: var(--t-crema-deep, #8f5d22)" fill-opacity=".1" stroke-width="1.4" stroke-dasharray="4 5" />{/if}
    <circle r="16" style="fill: var(--t-crema, #c3873a)" fill-opacity=".18" />
    <circle r="8" style="fill: var(--t-ink, #2a1d15)" />
    <circle r="3" style="fill: var(--t-on-ink, #f3ede3)" />
  </g>
  {/if}
</svg>

<style>
  .map { width: 100%; height: auto; display: block; }
  .sweet { font: 400 15px 'Instrument Serif', Georgia, serif; fill: var(--t-crema-deep, #8f5d22); letter-spacing: .02em; }
  .ax { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; fill: var(--t-ink-2, #5b4a3d); }
  .ax2 { font: 400 11px 'IBM Plex Mono', monospace; fill: var(--t-ink-3, #75655a); }
  .num { font: 500 12px 'IBM Plex Mono', monospace; fill: var(--t-ink, #2a1d15); }
  /* Phones: the map scales down, so its axis text scales up to stay readable. */
  @media (max-width: 640px) { .num { font-size: 15px; } .ax { font-size: 14px; } .ax2 { font-size: 13px; } }
  .dot { transition: transform .6s cubic-bezier(.2, .7, .2, 1); }
  .arrow { stroke-dasharray: 6 4; }
  @media (prefers-reduced-motion: reduce) { .dot { transition: none; } }
</style>
