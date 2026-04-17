<script>
  // SliderGauge — horizontal brass slide rule for Ratio & Time
  // Concept art ref: 01-gauge-sequence.png (bottom two gauges)
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let { value = 0, min = 0, max = 100, label = '', unit = '', displayValue = '' } = $props();

  const markerPos = tweened(0.5, { duration: 600, easing: cubicOut });

  // Normalize value to 0-1 position within the gauge range
  // The gauge shows a wider window around the min-max band
  $effect(() => {
    if (max === min) { markerPos.set(0.5); return; }
    const normalized = (value - min) / (max - min);
    markerPos.set(Math.max(0, Math.min(1, normalized)));
  });

  // Gauge dimensions
  const W = 220;
  const H = 60;
  const trackY = 34;
  const trackLeft = 30;
  const trackRight = W - 30;
  const trackW = trackRight - trackLeft;
</script>

<div class="slider-gauge">
  <svg viewBox="0 {0} {W} {H}" xmlns="http://www.w3.org/2000/svg">
    <!-- Brass frame -->
    <rect x="2" y="2" width={W - 4} height={H - 4} rx="6" ry="6"
      fill="#F5F0E6" stroke="#B8860B" stroke-width="2" />
    <rect x="5" y="5" width={W - 10} height={H - 10} rx="4" ry="4"
      fill="none" stroke="#D4A847" stroke-width="0.5" opacity="0.5" />

    <!-- Label -->
    <text x={W / 2} y="18" text-anchor="middle"
      font-family="'Inter', sans-serif" font-size="9" font-weight="600"
      fill="#6B6560" letter-spacing="0.08em" text-transform="uppercase">
      {label}
    </text>

    <!-- Track background -->
    <line x1={trackLeft} y1={trackY} x2={trackRight} y2={trackY}
      stroke="#D4C5A9" stroke-width="3" stroke-linecap="round" />

    <!-- Range band (min to max) — full width since value IS within min-max -->
    <line x1={trackLeft} y1={trackY} x2={trackRight} y2={trackY}
      stroke="#C17A3A" stroke-width="3" stroke-linecap="round" opacity="0.25" />

    <!-- Tick marks -->
    {#each [0, 0.25, 0.5, 0.75, 1] as tick}
      <line
        x1={trackLeft + tick * trackW} y1={trackY - 6}
        x2={trackLeft + tick * trackW} y2={trackY + 6}
        stroke="#B8860B" stroke-width="0.75" opacity="0.4" />
    {/each}

    <!-- Min label -->
    <text x={trackLeft} y={trackY + 16}
      text-anchor="middle" font-family="'Inter', sans-serif" font-size="7" fill="#94A3B8">
      {min}{unit}
    </text>

    <!-- Max label -->
    <text x={trackRight} y={trackY + 16}
      text-anchor="middle" font-family="'Inter', sans-serif" font-size="7" fill="#94A3B8">
      {max}{unit}
    </text>

    <!-- Current value marker (brass diamond) -->
    <g transform="translate({trackLeft + $markerPos * trackW}, {trackY})">
      <!-- Marker shadow -->
      <polygon points="0,-7 5,0 0,7 -5,0" fill="#A0692E" opacity="0.3"
        transform="translate(0.5, 0.5)" />
      <!-- Marker -->
      <polygon points="0,-7 5,0 0,7 -5,0" fill="#C17A3A" stroke="#8B5E2B" stroke-width="0.75" />
      <!-- Value readout -->
      <text y="-11" text-anchor="middle"
        font-family="'Inter', sans-serif" font-size="10" font-weight="700" fill="#1A1A1A">
        {displayValue || `${value}${unit}`}
      </text>
    </g>
  </svg>
</div>

<style>
  .slider-gauge {
    width: 100%;
    max-width: 220px;
  }
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
