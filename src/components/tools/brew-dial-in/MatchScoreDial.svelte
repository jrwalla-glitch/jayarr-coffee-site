<script>
  // MatchScoreDial — semi-circular 0-100 gauge on the collection cup
  // Concept art ref: 00-apparatus-v3-final.png (MATCH SCORE 95 gauge on cup)
  import { spring } from 'svelte/motion';

  let { score = 0 } = $props();

  // Semi-circular gauge: -90° (left, score=0) to +90° (right, score=100)
  const startAngle = -90;
  const endAngle = 90;
  const sweep = endAngle - startAngle;

  const needleAngle = spring(startAngle, { stiffness: 0.08, damping: 0.35 });

  const cx = 80;
  const cy = 72;
  const R = 52;
  const needleR = 44;

  $effect(() => {
    const normalized = Math.max(0, Math.min(100, score)) / 100;
    needleAngle.set(startAngle + normalized * sweep);
  });

  // Color for a given score
  function scoreColor(s) {
    if (s >= 85) return '#4ADE80';
    if (s >= 70) return '#D27D2D';
    if (s >= 50) return '#FBBF24';
    return '#F87171';
  }

  // SVG arc path
  function arcPath(r, fromDeg, toDeg) {
    const from = (fromDeg - 90) * Math.PI / 180;
    const to = (toDeg - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(from);
    const y1 = cy + r * Math.sin(from);
    const x2 = cx + r * Math.cos(to);
    const y2 = cy + r * Math.sin(to);
    const large = (toDeg - fromDeg) > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  // Color zone arcs
  const zones = [
    { from: -90, to: -36, color: '#F87171' },   // 0-30: red
    { from: -36, to: 0,   color: '#FBBF24' },   // 30-50: yellow
    { from: 0,   to: 36,  color: '#D27D2D' },   // 50-70: copper
    { from: 36,  to: 90,  color: '#4ADE80' },   // 70-100: green
  ];
</script>

<div class="match-dial">
  <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg">
    <!-- Label -->
    <text x={cx} y="12" text-anchor="middle"
      font-family="'Inter', sans-serif" font-size="7" font-weight="600"
      fill="#6B6560" letter-spacing="0.1em">
      MATCH SCORE
    </text>

    <!-- Brass bezel (semi-circle) -->
    <path d={arcPath(R + 6, startAngle, endAngle)}
      fill="none" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" />

    <!-- Color zone arcs -->
    {#each zones as zone}
      <path d={arcPath(R, zone.from, zone.to)}
        fill="none" stroke={zone.color} stroke-width="8" opacity="0.3"
        stroke-linecap="butt" />
    {/each}

    <!-- Scale arc (overlay for definition) -->
    <path d={arcPath(R, startAngle, endAngle)}
      fill="none" stroke="#B8860B" stroke-width="0.75" />

    <!-- Tick marks -->
    {#each [0, 25, 50, 75, 100] as tick}
      {@const angle = (startAngle + (tick / 100) * sweep - 90) * Math.PI / 180}
      <line
        x1={cx + (R - 6) * Math.cos(angle)}
        y1={cy + (R - 6) * Math.sin(angle)}
        x2={cx + (R + 3) * Math.cos(angle)}
        y2={cy + (R + 3) * Math.sin(angle)}
        stroke="#B8860B" stroke-width="1" />
    {/each}

    <!-- Needle -->
    <g transform="rotate({$needleAngle}, {cx}, {cy})">
      <line x1={cx} y1={cy + 6} x2={cx} y2={cy - needleR}
        stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" />
    </g>

    <!-- Center hub -->
    <circle cx={cx} cy={cy} r="5" fill="#B8860B" />
    <circle cx={cx} cy={cy} r="3" fill="#D4A847" />

    <!-- Score readout -->
    <text x={cx} y={cy + 20} text-anchor="middle"
      font-family="'Playfair Display', serif" font-size="22" font-weight="700"
      fill={scoreColor(score)}>
      {score}
    </text>
  </svg>
</div>

<style>
  .match-dial {
    width: 100%;
    max-width: 160px;
  }
  svg {
    width: 100%;
    height: auto;
    display: block;
  }
</style>
