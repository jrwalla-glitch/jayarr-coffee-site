<script>
  // ThermometerGauge — vertical mercury-column thermometer for Temperature
  // Concept art ref: 01-gauge-sequence.png (leftmost gauge)
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let { value = 93, min = 85, max = 100, label = 'Temp', unit = '°C' } = $props();

  // Gauge range — show a wider window than just min-max
  const gaugeMin = 80;
  const gaugeMax = 100;

  const fillHeight = tweened(0, { duration: 600, easing: cubicOut });

  // Column dimensions
  const W = 60;
  const H = 160;
  const colX = W / 2;
  const colTop = 28;
  const colBottom = 128;
  const colH = colBottom - colTop;
  const bulbY = colBottom + 10;
  const bulbR = 10;

  $effect(() => {
    const normalized = (value - gaugeMin) / (gaugeMax - gaugeMin);
    fillHeight.set(Math.max(0, Math.min(1, normalized)));
  });

  // Convert value to Y position
  function valToY(v) {
    const normalized = (v - gaugeMin) / (gaugeMax - gaugeMin);
    return colBottom - Math.max(0, Math.min(1, normalized)) * colH;
  }
</script>

<div class="thermo-gauge">
  <svg viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">
    <!-- Label -->
    <text x={colX} y="14" text-anchor="middle"
      font-family="'Inter', sans-serif" font-size="9" font-weight="600"
      fill="#6B6560" letter-spacing="0.08em">
      {label}
    </text>

    <!-- Brass frame / outer tube -->
    <rect x={colX - 8} y={colTop - 4} width="16" height={colH + 8} rx="8" ry="8"
      fill="none" stroke="#B8860B" stroke-width="1.5" />

    <!-- Glass tube background -->
    <rect x={colX - 5} y={colTop} width="10" height={colH} rx="5" ry="5"
      fill="#E8E3D8" />

    <!-- Range band (min-max shading) -->
    <rect x={colX - 5} y={valToY(max)} width="10"
      height={valToY(min) - valToY(max)} rx="0" ry="0"
      fill="#C17A3A" opacity="0.15" />

    <!-- Mercury column (fills from bottom) -->
    <rect x={colX - 3.5} y={colBottom - $fillHeight * colH} width="7"
      height={$fillHeight * colH} rx="3.5" ry="0"
      fill="#C0392B" />

    <!-- Bulb -->
    <circle cx={colX} cy={bulbY} r={bulbR}
      fill="#C0392B" stroke="#B8860B" stroke-width="1.5" />
    <!-- Bulb highlight -->
    <circle cx={colX - 3} cy={bulbY - 3} r="3" fill="#E74C3C" opacity="0.5" />

    <!-- Scale ticks + labels -->
    {#each [80, 85, 90, 95, 100] as tick}
      {@const y = valToY(tick)}
      <line x1={colX + 10} y1={y} x2={colX + 16} y2={y}
        stroke="#B8860B" stroke-width="0.75" />
      <text x={colX + 19} y={y + 3}
        font-family="'Inter', sans-serif" font-size="7" fill="#94A3B8">
        {tick}
      </text>
    {/each}

    <!-- Min marker -->
    <line x1={colX - 10} y1={valToY(min)} x2={colX - 14} y2={valToY(min)}
      stroke="#C17A3A" stroke-width="1" />

    <!-- Max marker -->
    <line x1={colX - 10} y1={valToY(max)} x2={colX - 14} y2={valToY(max)}
      stroke="#C17A3A" stroke-width="1" />

    <!-- Value readout -->
    <text x={colX} y={H - 2} text-anchor="middle"
      font-family="'Inter', sans-serif" font-size="11" font-weight="700" fill="#1A1A1A">
      {value}{unit}
    </text>
  </svg>
</div>

<style>
  .thermo-gauge {
    width: 100%;
    max-width: 60px;
  }
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
