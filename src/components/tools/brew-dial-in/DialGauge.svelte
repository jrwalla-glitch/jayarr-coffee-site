<script>
  // DialGauge — circular pressure gauge for Grind Size
  // Concept art ref: 01-gauge-sequence.png (second gauge, circular with FINE→COARSE)
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let { value = 500, min = 200, max = 1000, label = 'Grind', unit = 'μm' } = $props();

  // Gauge arc spans from -135° to +135° (270° total sweep)
  const startAngle = -135;
  const endAngle = 135;
  const sweep = endAngle - startAngle;

  // Grind range for the full gauge face (wider than the bean's min-max)
  const gaugeMin = 100;
  const gaugeMax = 1100;

  const needleAngle = tweened(0, { duration: 600, easing: cubicOut });

  const cx = 75;
  const cy = 75;
  const R = 55; // outer radius for arc
  const needleR = 45;

  $effect(() => {
    const normalized = (value - gaugeMin) / (gaugeMax - gaugeMin);
    const clamped = Math.max(0, Math.min(1, normalized));
    needleAngle.set(startAngle + clamped * sweep);
  });

  // Convert a value to an angle
  function valToAngle(v) {
    const normalized = (v - gaugeMin) / (gaugeMax - gaugeMin);
    return startAngle + Math.max(0, Math.min(1, normalized)) * sweep;
  }

  // SVG arc path helper
  function arcPath(r, fromAngle, toAngle) {
    const from = (fromAngle - 90) * Math.PI / 180;
    const to = (toAngle - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(from);
    const y1 = cy + r * Math.sin(from);
    const x2 = cx + r * Math.cos(to);
    const y2 = cy + r * Math.sin(to);
    const largeArc = (toAngle - fromAngle) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  // Arc label positions
  const labels = [
    { text: 'FINE', angle: -120 },
    { text: 'MED', angle: 0 },
    { text: 'COARSE', angle: 120 },
  ];
</script>

<div class="dial-gauge">
  <svg viewBox="0 0 150 160" xmlns="http://www.w3.org/2000/svg">
    <!-- Label -->
    <text x={cx} y="14" text-anchor="middle"
      font-family="'Inter', sans-serif" font-size="9" font-weight="600"
      fill="#6B6560" letter-spacing="0.08em">
      {label}
    </text>

    <!-- Brass bezel (outer ring) -->
    <circle cx={cx} cy={cy} r="62" fill="none" stroke="#B8860B" stroke-width="3" />
    <circle cx={cx} cy={cy} r="59" fill="none" stroke="#D4A847" stroke-width="0.5" opacity="0.5" />

    <!-- Face -->
    <circle cx={cx} cy={cy} r="58" fill="#F5F0E6" />

    <!-- Scale arc (background) -->
    <path d={arcPath(R, startAngle, endAngle)}
      fill="none" stroke="#D4C5A9" stroke-width="4" stroke-linecap="round" />

    <!-- Range band arc (min to max for this bean) -->
    <path d={arcPath(R, valToAngle(min), valToAngle(max))}
      fill="none" stroke="#C17A3A" stroke-width="4" stroke-linecap="round" opacity="0.3" />

    <!-- Scale ticks -->
    {#each Array.from({ length: 11 }, (_, i) => i) as i}
      {@const angle = (startAngle + (i / 10) * sweep - 90) * Math.PI / 180}
      {@const isMajor = i % 5 === 0}
      <line
        x1={cx + (R - (isMajor ? 10 : 6)) * Math.cos(angle)}
        y1={cy + (R - (isMajor ? 10 : 6)) * Math.sin(angle)}
        x2={cx + (R + 2) * Math.cos(angle)}
        y2={cy + (R + 2) * Math.sin(angle)}
        stroke="#B8860B" stroke-width={isMajor ? 1.5 : 0.75} />
    {/each}

    <!-- Arc text labels -->
    {#each labels as lbl}
      {@const rad = (lbl.angle - 90) * Math.PI / 180}
      <text
        x={cx + 38 * Math.cos(rad)}
        y={cy + 38 * Math.sin(rad) + 3}
        text-anchor="middle"
        font-family="'Inter', sans-serif" font-size="6.5" font-weight="600"
        fill="#94A3B8" letter-spacing="0.06em">
        {lbl.text}
      </text>
    {/each}

    <!-- Needle -->
    <g transform="rotate({$needleAngle}, {cx}, {cy})">
      <!-- Needle shadow -->
      <line x1={cx} y1={cy} x2={cx} y2={cy - needleR}
        stroke="#000" stroke-width="2.5" opacity="0.08"
        transform="translate(0.5, 0.5)" stroke-linecap="round" />
      <!-- Needle body -->
      <line x1={cx} y1={cy + 8} x2={cx} y2={cy - needleR}
        stroke="#C0392B" stroke-width="2" stroke-linecap="round" />
    </g>

    <!-- Center hub -->
    <circle cx={cx} cy={cy} r="6" fill="#B8860B" />
    <circle cx={cx} cy={cy} r="4" fill="#D4A847" />
    <circle cx={cx} cy={cy} r="2" fill="#8B5E2B" />

    <!-- Value readout -->
    <text x={cx} y="152" text-anchor="middle"
      font-family="'Inter', sans-serif" font-size="12" font-weight="700" fill="#1A1A1A">
      {value}{unit}
    </text>
  </svg>
</div>

<style>
  .dial-gauge {
    width: 100%;
    max-width: 150px;
  }
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
