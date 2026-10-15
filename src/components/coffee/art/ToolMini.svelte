<script lang="ts" module>
  // Live miniatures for the Toolkit hub: one small drawing per tool, each echoing the tool's own
  // signature drawing. All share one 160 × 100 bench: a ground line at y 84, labels below it.
  // The still picture is the end frame of each loop; `live` only adds CSS animations.
  export type MiniId =
    | 'brew' | 'grind' | 'calibrator' | 'water' | 'drinks' | 'doctor' | 'extraction'
    | 'caffeine' | 'freshness' | 'machines' | 'pods' | 'origins' | 'flavors' | 'methods';

  const r1 = (n: number) => Math.round(n * 10) / 10;

  // Seeded jitter so ground particles look irregular but never change between renders.
  function seeded(seed: number) {
    let s = seed;
    return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  }
  function rock(cx: number, cy: number, r: number, seed: number) {
    const rnd = seeded(seed);
    const n = 6;
    const pts: string[] = [];
    const start = rnd() * Math.PI;
    for (let i = 0; i < n; i++) {
      const a = start + (i / n) * Math.PI * 2;
      const rr = r * (0.72 + rnd() * 0.36);
      pts.push(`${r1(cx + Math.cos(a) * rr)} ${r1(cy + Math.sin(a) * rr)}`);
    }
    return `M${pts.join(' L')} Z`;
  }

  // ── grind: four particle sizes along the micron ruler ──
  const GRIND_GROUPS = [
    { cx: 32, r: 1.25, spots: [[-6, -1], [-3, 2], [0, -2], [3, 1], [6, -1], [-4, -5], [1, -6], [5, -4], [-1, 4], [4, 5], [-6, 4]] },
    { cx: 62, r: 2, spots: [[-7, 1], [-2, -4], [3, 2], [7, -2], [-3, 5], [2, -9]] },
    { cx: 96, r: 3, spots: [[-7, 2], [1, -3], [8, 3], [-3, -10], [5, -11]] },
    { cx: 127, r: 4.4, spots: [[-6, 1], [5, -1], [0, -10]] },
  ];
  const GRIND_ROCKS = GRIND_GROUPS.map((g, gi) =>
    g.spots.map(([dx, dy], i) => ({ d: rock(g.cx + dx, 70 + dy, g.r, gi * 31 + i * 7 + 3), small: g.r < 1.5 })),
  );

  // ── calibrator: a 0–40 dial over 300°; 20 sits at the top of the ring's own frame ──
  const CX = 80, CY = 47;
  const dialAng = (n: number) => -150 + n * 7.5;
  const polar = (a: number, r: number) => {
    const t = ((a - 90) * Math.PI) / 180;
    return [r1(CX + Math.cos(t) * r), r1(CY + Math.sin(t) * r)];
  };
  const DIAL_TICKS = Array.from({ length: 21 }, (_, i) => {
    const n = i * 2;
    const major = n % 10 === 0;
    const [x1, y1] = polar(dialAng(n), major ? 26.5 : 28.5);
    const [x2, y2] = polar(dialAng(n), 32);
    return { x1, y1, x2, y2, major };
  });
  const DIAL_NUMS = [0, 10, 20, 30, 40].map((n) => ({ n, a: dialAng(n) }));
  const BAND_FROM = 12, BAND_TO = 17;
  const arcPath = (a0: number, a1: number, r: number) => {
    const [x0, y0] = polar(a0, r);
    const [x1, y1] = polar(a1, r);
    return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const DIAL_BAND = arcPath(dialAng(BAND_FROM), dialAng(BAND_TO), 30.2);
  // The hub shows a burr from above, so the dial reads as a grinder's and not a clock's.
  const BURR = Array.from({ length: 8 }, (_, i) => {
    const a = i * 45;
    const [x0, y0] = polar(a, 3.2);
    const [xm, ym] = polar(a + 22, 6.4);
    const [x1, y1] = polar(a + 30, 9.4);
    return `M${x0} ${y0} Q${xm} ${ym} ${x1} ${y1}`;
  }).join(' ');
  // The ring turns so the band's middle sits under the index mark (top).
  const DIAL_REST = -dialAng((BAND_FROM + BAND_TO) / 2);

  // ── doctor: a taste line, jagged (sour) to calm to heavy (bitter) ──
  function tasteLine() {
    const y = 58;
    let sour = `M20 ${y}`;
    // zigzag whose height shrinks toward the middle
    for (let x = 20, i = 0; x < 62; x += 3.5, i++) {
      const amp = 6.5 * (1 - (x - 20) / 44);
      sour += ` L${r1(x + 1.75)} ${r1(y + (i % 2 ? amp : -amp))}`;
    }
    sour += ` L62 ${y}`;
    let bitter = `M98 ${y}`;
    for (let x = 98; x < 140; x += 1) {
      const amp = 6 * ((x - 98) / 42);
      bitter += ` L${x + 1} ${r1(y + Math.sin(((x + 1 - 98) / 14) * Math.PI) * amp)}`;
    }
    return { sour, calm: `M62 ${y} H98`, bitter, y };
  }
  const TASTE = tasteLine();

  // ── caffeine: two cups across a day, decaying; bedtime near the right edge ──
  const DAY0 = 6, DAY1 = 24; // 6 am to midnight
  const CX0 = 16, CX1 = 144;
  const tx = (h: number) => CX0 + ((h - DAY0) / (DAY1 - DAY0)) * (CX1 - CX0);
  const CUPS = [8, 13.5];
  const BED = 22.5;
  function caffeine() {
    const ke = Math.LN2 / 5; // a five-hour half-life, illustrative
    const ka = 2.2; // absorption: peaks about an hour after the cup
    const level = (h: number) =>
      CUPS.reduce((s, c) => (h <= c ? s : s + (Math.exp(-ke * (h - c)) - Math.exp(-ka * (h - c)))), 0);
    let max = 0;
    for (let h = DAY0; h <= BED; h += 0.1) max = Math.max(max, level(h));
    const ty = (v: number) => 84 - (v / max) * 50;
    const from = CUPS[0] - 0.6;
    const pts: string[] = [];
    for (let h = from; h <= BED + 0.001; h += 0.125) pts.push(`${r1(tx(h))} ${r1(ty(level(h)))}`);
    const line = `M${pts.join(' L')}`;
    const end = { x: r1(tx(BED)), y: r1(ty(level(BED))) };
    return { line, area: `${line} L${end.x} 84 L${r1(tx(from))} 84 Z`, end };
  }
  const CAF = caffeine();

  // ── freshness: aroma rises while the beans rest, peaks, then fades ──
  const FRESH_CURVE = (() => {
    const pts: string[] = [];
    const tp = 0.43, pw = 1.5;
    for (let x = 16; x <= 144; x += 2) {
      const t = (x - 16) / 128;
      const v = t === 0 ? 0 : Math.pow(t / tp, pw) * Math.exp(pw * (1 - t / tp));
      pts.push(`${x} ${r1(83 - v * 43)}`);
    }
    return `M${pts.join(' L')}`;
  })();

  // ── pods: a sparse capsule wall, three cup rows by intensity ──
  const POD_COLORS = ['#d9a43a', '#6e4a6e', '#3d4a7a', '#2b211d', '#b9533f', '#cdb48a', '#7d9a5b', '#8a5a3a'];
  const PODS = [
    { x: 58, y: 44, c: 3 }, { x: 75, y: 44, c: 1 },
    { x: 24, y: 64, c: 5 }, { x: 58, y: 64, c: 6 }, { x: 75, y: 64, c: 2 },
    { x: 24, y: 84, c: 0 }, { x: 41, y: 84, c: 4 }, { x: 58, y: 84, c: 7 }, { x: 75, y: 84, c: 3 }, { x: 92, y: 84, c: 1 },
  ].map((p) => ({ ...p, fill: POD_COLORS[p.c] }));
  const POD_PICK = { x: 92, y: 64, fill: POD_COLORS[0] };

  // ── origins: a 12-month ring; harvest runs October to January (illustrative) ──
  const OX = 80, OY = 46, OR = 24;
  const opolar = (a: number, r: number) => {
    const t = ((a - 90) * Math.PI) / 180;
    return [r1(OX + Math.cos(t) * r), r1(OY + Math.sin(t) * r)];
  };
  const MONTH_TICKS = Array.from({ length: 12 }, (_, i) => {
    const [x1, y1] = opolar(i * 30, OR - 3);
    const [x2, y2] = opolar(i * 30, OR + 3);
    return { x1, y1, x2, y2, jan: i === 0 };
  });
  const HARVEST = (() => {
    const [x0, y0] = opolar(-90, OR);
    const [x1, y1] = opolar(30, OR);
    return `M${x0} ${y0} A${OR} ${OR} 0 0 1 ${x1} ${y1}`;
  })();
  const POINTER_REST = -30; // mid-harvest, between November and December

  // ── flavors: an 8-petal bloom; one petal opens into three sub-notes ──
  const FX = 64, FY = 52;
  const PETAL_TINTS = ['#d4944f', '#ccaca4', '#a6895e', '#bba98d', '#b3926e', '#96967e', '#c9b07a', '#a99482'];
  const PETALS = PETAL_TINTS.map((c, i) => ({ a: i * 45, c }));
  const OPEN_A = 45;
  // Sub-petals spring from the open petal's tip and fan out.
  const SUBS = [-36, 0, 36].map((da) => {
    const t = ((OPEN_A - 90) * Math.PI) / 180;
    return { a: OPEN_A + da, tx: r1(FX + Math.cos(t) * 25.5), ty: r1(FY + Math.sin(t) * 25.5) };
  });

  // ── methods: the percolation constellation, a funnel of five stars ──
  const STARS = [
    { x: 50, y: 22, s: 3.4 }, { x: 64, y: 41, s: 3 }, { x: 80, y: 62, s: 3.2 }, { x: 96, y: 41, s: 3 }, { x: 110, y: 22, s: 3.6 },
  ];
  const FIELD = [[24, 30], [34, 58], [28, 74], [128, 52], [138, 30], [122, 72], [70, 16], [92, 14], [44, 46], [116, 40]];
  const sparkle = (x: number, y: number, s: number) =>
    `M${x} ${r1(y - s)} Q${r1(x + s * 0.18)} ${r1(y - s * 0.18)} ${r1(x + s)} ${y} Q${r1(x + s * 0.18)} ${r1(y + s * 0.18)} ${x} ${r1(y + s)} Q${r1(x - s * 0.18)} ${r1(y + s * 0.18)} ${r1(x - s)} ${y} Q${r1(x - s * 0.18)} ${r1(y - s * 0.18)} ${x} ${r1(y - s)} Z`;
</script>

<script lang="ts">
  interface Props {
    id: MiniId;
    /** Run the loop. The still picture is the loop's last frame. */
    live?: boolean;
  }
  let { id, live = false }: Props = $props();
  const uid = $props.id();
  const ref = (name: string) => `url(#${name}-${uid})`;
</script>

<svg
  viewBox="0 0 160 100"
  aria-hidden="true"
  focusable="false"
  class="mini"
  class:live
  data-mini={id}
>
  {#if id === 'brew'}
    <defs>
      <clipPath id="srv-{uid}"><path d="M62.8 43 V67 Q62.8 72.4 68 72.4 H92 Q97.2 72.4 97.2 67 V43 Z" /></clipPath>
      <clipPath id="win-{uid}"><rect x="85" y="75.2" width="25" height="7.6" rx="1" /></clipPath>
    </defs>
    <!-- dripper -->
    <path class="h" d="M67 15 L78.6 36.6 M93 15 L81.4 36.6" />
    <path d="M70.2 29 H89.8 L84 37.4 H76 Z" class="coffee" />
    <path class="o" d="M57 14 H103 L84 38 H76 Z" />
    <path class="o" d="M101.6 17.5 C111 17 112 30.5 93 30.2" />
    <rect class="o fill-card" x="66" y="38" width="28" height="3.6" rx="1.2" />
    <!-- stream, liquid, server -->
    <line class="stream a-brew-stream" x1="80" y1="41.8" x2="80" y2="72" />
    <g clip-path={ref('srv')}>
      <rect class="coffee a-brew-level" x="62" y="54" width="36" height="19" />
    </g>
    <path class="o" d="M62.8 43 V67 Q62.8 73 68.5 73 H91.5 Q97.2 73 97.2 67 V43" />
    <path class="o" d="M60.6 43 H99.4" />
    <path class="o" d="M97.2 48.5 C105.5 48.5 105.5 63.5 97.2 63.5" />
    <path class="d tick" d="M57 54 H66" />
    <!-- scale -->
    <rect x="46" y="73.8" width="68" height="10.2" rx="2.2" class="ink" />
    <circle cx="52.5" cy="79" r="1.6" class="btn" /><circle cx="58.5" cy="79" r="1.6" class="btn" />
    <rect x="85" y="75.2" width="25" height="7.6" rx="1" class="window" />
    <g clip-path={ref('win')}>
      <g class="a-brew-count">
        {#each ['0', '80', '160', '240', '320', '400'] as v, i (v)}
          <text x="107.6" y={r1(81.8 - (5 - i) * 9)} class="digits" text-anchor="end">{v}</text>
        {/each}
      </g>
    </g>
  {:else if id === 'grind'}
    <rect class="band a-fade-late" x="45" y="50" width="34" height="34" />
    {#each GRIND_ROCKS as group, gi (gi)}
      {#each group as p, i (i)}
        <path d={p.d} class={p.small ? 'grounds' : 'grounds edged'} />
      {/each}
    {/each}
    <!-- ruler -->
    <path class="o" d="M20 84 H140" />
    {#each Array.from({ length: 13 }, (_, i) => 20 + i * 10) as x (x)}
      <path class={x % 40 === 20 ? 'd' : 'h'} d="M{x} 84 V{x % 40 === 20 ? 77.5 : 80.5}" />
    {/each}
    <rect class="bandbar a-fade-late" x="45" y="81.6" width="34" height="2.4" />
    <g class="a-grind-marker">
      <path class="d" d="M62 46 V84" />
      <path class="ink" d="M62 46 L58.4 39.6 H65.6 Z" />
    </g>
    <text x="20" y="95" class="lbl">fine</text>
    <text x="140" y="95" class="lbl" text-anchor="end">coarse</text>
  {:else if id === 'calibrator'}
    <circle class="o fill-card" cx={CX} cy={CY} r="33" />
    <g class="a-dial" style="--rest: {DIAL_REST}deg">
      <path d={DIAL_BAND} class="dialband" />
      {#each DIAL_TICKS as t, i (i)}
        <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} class={t.major ? 'd' : 'h'} />
      {/each}
      {#each DIAL_NUMS as m (m.n)}
        <g transform="rotate({m.a} {CX} {CY})">
          <text x={CX} y={CY - 17.2} class="num" text-anchor="middle" style="--a: {m.a}deg">{m.n}</text>
        </g>
      {/each}
    </g>
    <circle class="d fill-card" cx={CX} cy={CY} r="11" />
    <path d={BURR} class="burr" />
    <circle class="ink" cx={CX} cy={CY} r="1.6" />
    <path class="ink" d="M80 15.6 L76.4 8.6 H83.6 Z" />
  {:else if id === 'water'}
    <path class="h dash" d="M71.3 20 V84 M92.7 20 V84 M50 41.3 H114 M50 62.7 H114" />
    <path class="h" d="M50 20 H114 V84" />
    <path class="o" d="M50 20 V84 H114" />
    <circle class="landmark" cx="60" cy="71" r="3" />
    <circle class="landmark" cx="99" cy="64" r="3" />
    <circle class="landmark" cx="88" cy="32" r="3" />
    <ellipse class="shadow" cx="79" cy="55.6" rx="3.2" ry="1.1" />
    <ellipse class="ripple a-ripple" cx="79" cy="55.6" rx="7" ry="2.4" />
    <g transform="translate(79 55)">
      <g class="a-pin">
        <path class="pin" d="M0 0 C-1.8 -3.6 -5.4 -6.4 -5.4 -10.4 A5.4 5.4 0 1 1 5.4 -10.4 C5.4 -6.4 1.8 -3.6 0 0 Z" />
        <circle cx="0" cy="-10.4" r="1.9" class="fill-card" />
      </g>
    </g>
    <text x="114" y="95" class="lbl" text-anchor="end">GH</text>
    <text x="45" y="24" class="lbl" text-anchor="end">KH</text>
  {:else if id === 'drinks'}
    <defs>
      <clipPath id="gla-{uid}"><path d="M40.9 50 L43.3 81.2 H66.7 L69.1 50 Z" /></clipPath>
      <clipPath id="glb-{uid}"><path d="M92.9 26 L95.2 81.2 H116.8 L119.1 26 Z" /></clipPath>
    </defs>
    <g clip-path={ref('gla')}>
      <rect class="espresso a-l1" x="38" y="71" width="34" height="10.4" />
      <rect class="crema a-l1c" x="38" y="71" width="34" height="1.8" />
      <rect class="milk a-l2" x="38" y="61" width="34" height="10.2" />
      <rect class="foam a-l3" x="38" y="55" width="34" height="6.2" />
    </g>
    <g clip-path={ref('glb')}>
      <rect class="espresso a-l1" x="90" y="71" width="32" height="10.4" />
      <rect class="crema a-l1c" x="90" y="71" width="32" height="1.8" />
      <rect class="milk a-l2" x="90" y="44" width="32" height="27.2" />
      <rect class="foam a-l3" x="90" y="34" width="32" height="10.2" />
    </g>
    <path class="d layerline a-l3" d="M41.6 55 H68.4 M93.4 34 H118.6" />
    <g class="bubbles a-l3b">
      <circle cx="50" cy="58" r="0.9" /><circle cx="58.5" cy="57.2" r="0.7" /><circle cx="63" cy="59.2" r="0.8" />
      <circle cx="100" cy="38" r="0.9" /><circle cx="107" cy="40.6" r="0.7" /><circle cx="112.5" cy="37.4" r="0.8" /><circle cx="104" cy="36" r="0.6" />
    </g>
    <path class="o" d="M40 50 L42.4 82.4 Q42.6 84 44.4 84 H65.6 Q67.4 84 67.6 82.4 L70 50" />
    <path class="o" d="M92 26 L94.3 82.4 Q94.4 84 96.2 84 H115.8 Q117.6 84 117.7 82.4 L120 26" />
    <path class="h" d="M44.6 54 L46.2 77 M96.4 30 L97.6 77" />
  {:else if id === 'doctor'}
    <rect class="band a-fade-late" x="67" y="44" width="26" height="28" rx="3" />
    <path class="taste thin" d={TASTE.sour} />
    <path class="taste" d={TASTE.calm} />
    <path class="taste heavy" d={TASTE.bitter} />
    <path class="h" d="M80 40 V44 M80 72 V76" />
    <g class="a-doc-dot">
      <circle cx="80" cy={TASTE.y} r="4.6" class="dot" />
    </g>
    <text x="20" y="95" class="lbl">sour</text>
    <text x="140" y="95" class="lbl" text-anchor="end">bitter</text>
  {:else if id === 'extraction'}
    <defs>
      <linearGradient id="exy-{uid}" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" class="st-water" stop-opacity=".16" />
        <stop offset=".5" stop-color="#fff" stop-opacity="0" />
        <stop offset="1" class="st-espresso" stop-opacity=".16" />
      </linearGradient>
    </defs>
    <rect x="46" y="18" width="78" height="66" fill={ref('exy')} />
    <path class="h dash" d="M72 18 V84 M98 18 V84 M46 40 H124 M46 62 H124" />
    <path class="h" d="M46 18 H124 V84" />
    <rect x="72" y="40" width="26" height="22" rx="2" class="refbox" />
    <rect x="72" y="40" width="26" height="22" rx="2" class="refglow a-fade-late" />
    <path class="o" d="M46 18 V84 H124" />
    <path class="trail" d="M56 75 C60 62 70 55 85 51" />
    <circle cx="56" cy="75" r="2.2" class="h fill-card" />
    <g class="a-ext-dot">
      <circle cx="85" cy="51" r="8" class="halo" />
      <circle cx="85" cy="51" r="4.2" class="dot" />
    </g>
    <text x="85" y="95" class="lbl" text-anchor="middle">extraction</text>
    <text x="0" y="0" class="lbl" text-anchor="middle" transform="translate(40 51) rotate(-90)">strength</text>
  {:else if id === 'caffeine'}
    <defs>
      <clipPath id="caf-{uid}"><rect class="a-caf-reveal" x="16" y="10" width="128" height="76" /></clipPath>
    </defs>
    <path class="h dash" d="M{CAF.end.x} 26 V84" />
    <g clip-path={ref('caf')}>
      <path d={CAF.area} class="cafarea" />
    </g>
    <path d={CAF.line} class="o a-caf-line" pathLength="1" />
    <circle cx={CAF.end.x} cy={CAF.end.y} r="3" class="dot a-caf-end" />
    <!-- bedtime moon, as in the tool -->
    <circle cx={CAF.end.x} cy="18" r="4.6" class="ink" />
    <circle cx={CAF.end.x + 2} cy="16.6" r="3.9" class="fill-card" />
    <text x={CAF.end.x - 8} y="21" class="lbl" text-anchor="end">bedtime</text>
    {#each CUPS as h (h)}
      <g transform="translate({r1(tx(h))} 86.2) scale(0.56)">
        <path d="M-8 1 h16 v12 q0 4 -4 4 h-8 q-4 0 -4 -4 z" class="cup" />
        <path d="M8 4 q6 0 6 5 q0 4 -6 4" class="cuphandle" />
      </g>
    {/each}
  {:else if id === 'freshness'}
    <defs>
      <pattern id="hat-{uid}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="4" class="hatch" />
      </pattern>
      <linearGradient id="fad-{uid}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" class="st-acc" stop-opacity=".22" />
        <stop offset="1" class="st-acc" stop-opacity="0" />
      </linearGradient>
    </defs>
    <rect x="16" y="36" width="28" height="48" fill={ref('hat')} />
    <rect x="90" y="36" width="54" height="48" fill={ref('fad')} />
    <rect x="52" y="36" width="38" height="48" class="peak" />
    <rect x="52" y="36" width="38" height="48" class="peakglow a-fade-late" />
    <path d={FRESH_CURVE} class="o" />
    <path class="d" d="M16 84 V78" />
    <g class="a-fresh-marker">
      <path class="d" d="M71 31 V84" />
      <g transform="translate(66.4 15.6) scale(0.27)">
        <path d="M4 10 Q2 4 8 2 L26 2 Q32 4 30 10 L32 48 Q32 52 28 52 L6 52 Q2 52 2 48 Z" class="bag" />
        <rect x="4" y="2" width="26" height="6" class="bagtop" />
        <circle cx="17" cy="20" r="4" class="bagvalve" />
      </g>
    </g>
    <text x="16" y="95" class="lbl">roast</text>
    <text x="71" y="95" class="lbl peaklbl" text-anchor="middle">peak</text>
  {:else if id === 'machines'}
    <!-- the other machines step back once the match is picked -->
    <g class="a-mach-dim">
      <g>
        <rect x="26" y="57" width="18" height="27" rx="4" class="ink" />
        <circle cx="35" cy="62.4" r="1.7" class="fill-card" />
        <rect x="29" y="69" width="12" height="11" rx="1.2" class="fill-card" />
        <rect x="31.5" y="74.6" width="7" height="5.4" rx="1" class="ink" />
      </g>
      <g>
        <rect x="110" y="53" width="26" height="31" rx="4" class="ink" />
        <rect x="114" y="57" width="18" height="6.4" rx="1.2" class="fill-card" />
        <rect x="115" y="68" width="16" height="12" rx="1.2" class="fill-card" />
        <rect x="121" y="68" width="4" height="3" class="ink" />
        <rect x="119" y="75" width="8" height="5" rx="1" class="ink" />
      </g>
    </g>
    <ellipse cx="80" cy="84" rx="20" ry="1.8" class="shadow a-fade-late" />
    <g class="a-mach-lift">
      <rect x="63" y="48" width="34" height="36" rx="3.5" class="ink" />
      <circle cx="80" cy="55.6" r="3.6" class="fill-card" />
      <path d="M80 55.6 L82 53.4" class="needle" />
      <rect x="68" y="63.6" width="24" height="16.4" rx="1.4" class="fill-card" />
      <rect x="73" y="63.6" width="14" height="3.6" class="ink" />
      <path d="M87 65.4 H102" class="handle" />
      <path d="M75.5 72.4 H84.5 V77 Q84.5 80 81.5 80 H78.5 Q75.5 80 75.5 77 Z" class="d" />
    </g>
    <text x="16" y="95" class="lbl">budget</text>
    <defs><clipPath id="bud-{uid}"><rect x="52" y="89.4" width="92" height="5.2" rx="2.6" /></clipPath></defs>
    <g clip-path={ref('bud')}>
      <rect x="52" y="89.4" width="50" height="5.2" class="seg1 a-seg1" />
      <rect x="102" y="89.4" width="26" height="5.2" class="seg2 a-seg2" />
      <rect x="128" y="89.4" width="12" height="5.2" class="seg3 a-seg3" />
    </g>
    <rect x="52" y="89.4" width="92" height="5.2" rx="2.6" class="track" />
  {:else if id === 'pods'}
    <path class="h dash" d="M16 44 H102 M16 64 H102" />
    {#each PODS as p (p.x + '-' + p.y)}
      <g transform="translate({p.x} {p.y})">
        <ellipse cx="0" cy="-0.6" rx="7.4" ry="1.5" class="rim" />
        <path d="M-5.6 -1 C-5.6 -7.2 -3 -11 0 -11 C3 -11 5.6 -7.2 5.6 -1 Z" fill={p.fill} class="dome" />
        <path d="M-3.4 -1.6 C-3.4 -5.4 -2.4 -8 -0.8 -9.2 C-1.6 -7 -2 -4.4 -1.9 -1.6 Z" class="gloss" />
      </g>
    {/each}
    <g transform="translate({POD_PICK.x} {POD_PICK.y})">
      <ellipse cx="0" cy="-0.6" rx="7.4" ry="1.5" class="rim ghost" />
      <g class="a-pod-lift">
        <ellipse cx="0" cy="-0.6" rx="7.4" ry="1.5" class="rim" />
        <path d="M-5.6 -1 C-5.6 -7.2 -3 -11 0 -11 C3 -11 5.6 -7.2 5.6 -1 Z" fill={POD_PICK.fill} class="dome" />
        <path d="M-3.4 -1.6 C-3.4 -5.4 -2.4 -8 -0.8 -9.2 C-1.6 -7 -2 -4.4 -1.9 -1.6 Z" class="gloss" />
      </g>
    </g>
    <defs>
      <clipPath id="cup-{uid}"><path d="M114.9 66 L116.1 75.6 Q117 80.6 121.2 80.6 H126.8 Q131 80.6 131.9 75.6 L133.1 66 Z" /></clipPath>
    </defs>
    <g clip-path={ref('cup')}>
      <rect x="112" y="69" width="24" height="13" class="espresso a-cup-fill" />
      <rect x="112" y="69" width="24" height="2" class="crema a-cup-fill" />
    </g>
    <path class="o" d="M114 65 L115.4 75.8 Q116.4 81.4 121 81.4 H127 Q131.6 81.4 132.6 75.8 L134 65" />
    <path class="o" d="M133.4 68.4 C139.6 68.4 139.6 75.6 132.4 75.6" />
    <path class="o" d="M108 83.4 H140" />
  {:else if id === 'origins'}
    <!-- a faint map strip: the Americas, Africa, Asia and the islands, between the tropics -->
    <g class="map">
      <path d="M20 34 C27 32 33 36 36 42 C40 49 45 55 43 63 C41 71 37 77 34 82 C31 76 30 68 28 62 C25 56 21 49 19 42 Z" />
      <path d="M62 33 C71 29 85 30 94 36 C99 42 100 49 96 55 C92 63 87 73 81 80 C76 76 74 68 71 62 C65 58 60 50 60 43 Z" />
      <path d="M108 32 C119 28 134 30 143 36 C145 43 139 47 131 47 C124 49 117 45 111 42 Z" />
      <ellipse cx="120" cy="60" rx="5" ry="2" /><ellipse cx="131" cy="65" rx="6" ry="2.2" /><ellipse cx="141" cy="58" rx="3" ry="2.4" />
    </g>
    <path class="h dash" d="M16 36 H144 M16 70 H144" />
    <circle cx={OX} cy={OY} r={OR} class="ringface" />
    {#each MONTH_TICKS as t, i (i)}
      <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} class={t.jan ? 'd' : 'h month'} />
    {/each}
    <path d={HARVEST} class="harvest" />
    <path d={HARVEST} class="harvest lit a-harvest" />
    <g class="a-pointer" style="--rest: {POINTER_REST}deg">
      <path d="M{OX} {OY} V{OY - OR + 6}" class="d" />
      <circle cx={OX} cy={OY - OR} r="2.6" class="ink" />
    </g>
    <circle cx={OX} cy={OY} r="3.6" class="dot" />
    <text x="50" y="22" class="lbl harvestlbl" text-anchor="end">harvest</text>
  {:else if id === 'flavors'}
    {#each PETALS as pt (pt.a)}
      {#if pt.a !== OPEN_A}
        <g transform="rotate({pt.a} {FX} {FY})">
          <ellipse cx={FX} cy={FY - 14} rx="5.4" ry="10.8" fill={pt.c} class="petal" />
        </g>
      {/if}
    {/each}
    {#each SUBS as sp, i (i)}
      <g transform="translate({sp.tx} {sp.ty}) rotate({sp.a})">
        <ellipse cx="0" cy="-8" rx="4" ry="8" class="sub a-sub{i + 1}" />
      </g>
    {/each}
    <g transform="rotate({OPEN_A} {FX} {FY})">
      <ellipse cx={FX} cy={FY - 14} rx="5.6" ry="11.2" class="petal open a-petal-open" />
    </g>
    <circle cx={FX} cy={FY} r="5.4" class="o fill-card" />
    <circle cx={FX} cy={FY} r="1.5" class="ink" />
    <text x="107" y="38" class="lbl">fruity</text>
  {:else if id === 'methods'}
    {#each FIELD as [fx, fy], i (i)}
      <circle cx={fx} cy={fy} r={i % 3 === 0 ? 0.9 : 0.65} class="field" />
    {/each}
    <path class="cline" d="M50 22 L64 41 L80 62 M96 41 L110 22" />
    <path class="cline faint" d="M50 22 H110" />
    <path class="cline new a-cline" d="M80 62 L96 41" pathLength="1" />
    {#each STARS as st, i (i)}
      {#if i !== 2}<path d={sparkle(st.x, st.y, st.s)} class="star" />{/if}
    {/each}
    <circle cx="80" cy="62" r="7" class="halo a-star-glow" />
    <g class="a-star">
      <path d={sparkle(80, 62, 4.4)} class="star bright" />
    </g>
    <text x="90" y="71" class="lbl">pour-over</text>
  {/if}
  <path class="ground" d="M14 84 H146" />
</svg>

<style>
  .mini {
    --k: var(--color-ink, #2a1d15);
    --wat: var(--water, #3f8796);
    --cof: var(--color-coffee, #7a4e30);
    --esp: var(--espresso, #3b2214);
    --cre: var(--crema, #b77a3c);
    --mlk: var(--milk, #efe3cf);
    --fom: var(--foam, #fffaf2);
    --acc: var(--accent-crema, #c3873a);
    --acc2: var(--accent-crema-dark, #9a6526);
    --rul: var(--color-rule, #d9cdbd);
    --crd: var(--color-card, #fbf8f3);
    --ease: cubic-bezier(0.45, 0.05, 0.25, 1);
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .mini * { vector-effect: none; }

  /* ── the shared hand ── */
  .o { fill: none; stroke: var(--k); stroke-width: 1.7; stroke-linejoin: round; stroke-linecap: round; }
  .d { fill: none; stroke: var(--k); stroke-width: 1.1; stroke-linejoin: round; stroke-linecap: round; }
  .h { fill: none; stroke: var(--k); stroke-width: 1; stroke-opacity: 0.25; stroke-linecap: round; }
  .dash { stroke-dasharray: 2 2.6; }
  .ground { fill: none; stroke: var(--k); stroke-width: 1; stroke-opacity: 0.22; stroke-linecap: round; }
  .ink { fill: var(--k); stroke: none; }
  .fill-card { fill: var(--crd); }
  .o.fill-card, .d.fill-card { fill: var(--crd); }
  .h.fill-card { fill: var(--crd); }
  .lbl { font: 500 8px/1 var(--font-mono, 'IBM Plex Mono', ui-monospace, monospace); fill: var(--k); fill-opacity: 0.62; letter-spacing: 0.04em; }

  /* gradient stops take their colour from the tokens (a var() in an attribute is not portable) */
  .st-water { stop-color: var(--wat); }
  .st-espresso { stop-color: var(--esp); }
  .st-acc { stop-color: var(--acc); }

  /* ── substances ── */
  .coffee { fill: var(--cof); }
  .espresso { fill: var(--esp); }
  .milk { fill: var(--mlk); }
  .foam { fill: var(--fom); }
  .stream { stroke: var(--cof); stroke-width: 1.3; stroke-linecap: round; opacity: 0; }

  /* brew */
  .tick { stroke-opacity: 0.6; }
  .btn { fill: none; stroke: var(--crd); stroke-opacity: 0.45; stroke-width: 0.9; }
  .window { fill: #16201f; }
  .digits { font: 500 8px/1 var(--font-mono, 'IBM Plex Mono', ui-monospace, monospace); fill: #8cc3cb; letter-spacing: 0.02em; }

  /* grind */
  .grounds { fill: var(--cof); }
  .grounds.edged { stroke: var(--k); stroke-width: 0.9; stroke-linejoin: round; }
  .band { fill: var(--acc); fill-opacity: 0.14; }
  .bandbar { fill: var(--acc); }

  /* calibrator */
  .a-dial { transform-box: view-box; transform-origin: 80px 47px; transform: rotate(var(--rest)); }
  .dialband { fill: none; stroke: var(--acc); stroke-width: 5.6; stroke-opacity: 0.6; }
  /* Numbers stay upright, like a clock face, while the ring carries them round. */
  .burr { fill: none; stroke: var(--k); stroke-opacity: 0.45; stroke-width: 1; stroke-linecap: round; }
  .num { font: 500 8px/1 var(--font-mono, 'IBM Plex Mono', ui-monospace, monospace); fill: var(--k); fill-opacity: 0.75; transform-box: fill-box; transform-origin: 50% 50%; transform: rotate(calc(0deg - var(--rest) - var(--a))); }

  /* water */
  .landmark { fill: var(--crd); stroke: var(--wat); stroke-width: 1.4; }
  .pin { fill: var(--wat); stroke: var(--k); stroke-width: 1.1; stroke-linejoin: round; }
  .shadow { fill: var(--k); fill-opacity: 0.16; }
  .ripple { fill: none; stroke: var(--wat); stroke-width: 1; opacity: 0; }

  /* drinks */
  .layerline { stroke-opacity: 0.35; }
  .crema { fill: var(--cre); }
  .bubbles circle { fill: none; stroke: var(--k); stroke-opacity: 0.3; stroke-width: 0.8; }

  /* doctor */
  .taste { fill: none; stroke: var(--k); stroke-width: 1.7; stroke-linejoin: round; stroke-linecap: round; }
  .taste.thin { stroke-width: 1.2; }
  .taste.heavy { stroke-width: 2.6; }
  .dot { fill: var(--acc); stroke: var(--k); stroke-width: 1.3; }

  /* extraction */
  .refbox { fill: #fffdf8; fill-opacity: 0.85; stroke: var(--acc); stroke-width: 1.5; }
  .refglow { fill: var(--acc); fill-opacity: 0.12; stroke: none; }
  .trail { fill: none; stroke: var(--k); stroke-opacity: 0.32; stroke-width: 1; stroke-dasharray: 1.6 2.4; stroke-linecap: round; }
  .halo { fill: var(--acc); fill-opacity: 0.18; }

  /* caffeine */
  .cafarea { fill: var(--acc); fill-opacity: 0.2; }
  .cup { fill: var(--cof); stroke: var(--k); stroke-width: 2; stroke-linejoin: round; }
  .cuphandle { fill: none; stroke: var(--k); stroke-width: 2; stroke-linecap: round; }

  /* freshness */
  .hatch { stroke: var(--k); stroke-opacity: 0.28; stroke-width: 1; }
  .peak { fill: var(--acc); fill-opacity: 0.3; }
  .peakglow { fill: var(--acc); fill-opacity: 0.16; }
  .peaklbl { fill: var(--acc2); fill-opacity: 1; }
  .bag { fill: #b48a5c; stroke: var(--k); stroke-width: 4.4; stroke-linejoin: round; }
  .bagtop { fill: #8a6440; stroke: var(--k); stroke-width: 3.6; }
  .bagvalve { fill: var(--mlk); stroke: var(--k); stroke-width: 3.6; }

  /* machines */
  .needle { stroke: var(--k); stroke-width: 1.1; stroke-linecap: round; }
  .handle { stroke: var(--k); stroke-width: 2.8; stroke-linecap: round; }
  .a-mach-dim { opacity: 0.38; }
  .track { fill: none; stroke: var(--k); stroke-opacity: 0.25; stroke-width: 1; }
  .seg1 { fill: var(--k); }
  .seg2 { fill: var(--acc); }
  .seg3 { fill: var(--rul); }
  .a-mach-lift { transform: translateY(-5px); }

  /* pods */
  .rim { fill: #d8d0c5; stroke: var(--k); stroke-opacity: 0.35; stroke-width: 0.7; }
  .rim.ghost { fill: none; stroke-dasharray: 1.4 1.6; stroke-opacity: 0.4; }
  .dome { stroke: var(--k); stroke-opacity: 0.35; stroke-width: 0.7; }
  .gloss { fill: #fff; fill-opacity: 0.26; }
  .a-pod-lift { transform: translateY(-9px); }

  /* origins */
  .map path, .map ellipse { fill: var(--k); fill-opacity: 0.08; }
  .ringface { fill: var(--crd); fill-opacity: 0.55; stroke: var(--k); stroke-opacity: 0.55; stroke-width: 1.1; }
  .harvest { fill: none; stroke: var(--acc); stroke-width: 4.6; stroke-opacity: 0.3; stroke-linecap: butt; }
  .harvest.lit { stroke-opacity: 0.85; }
  .month { stroke-opacity: 0.4; }
  .harvestlbl { fill: var(--acc2); fill-opacity: 1; }
  .a-pointer { transform-box: view-box; transform-origin: 80px 46px; transform: rotate(var(--rest)); }

  /* flavors */
  .petal { stroke: var(--k); stroke-width: 1.1; fill-opacity: 0.5; }
  .petal.open { fill: var(--acc); fill-opacity: 0.9; stroke-width: 1.4; }
  .sub { fill: var(--acc); fill-opacity: 0.45; stroke: var(--k); stroke-width: 1; }

  /* methods */
  .field { fill: var(--k); fill-opacity: 0.32; }
  .cline { fill: none; stroke: var(--k); stroke-opacity: 0.4; stroke-width: 1; stroke-linecap: round; }
  .cline.faint { stroke-opacity: 0.16; stroke-dasharray: 2 2.6; }
  .cline.new { stroke-opacity: 0.85; stroke-width: 1.2; }
  .star { fill: var(--k); }
  .star.bright { fill: var(--acc); stroke: var(--k); stroke-width: 0.9; stroke-linejoin: round; }

  /* ── motion: only when live, never under reduced motion ── */
  .live .a-brew-level { transform-box: fill-box; transform-origin: 50% 100%; animation: brew-level 4.6s var(--ease) infinite; }
  .live .a-brew-stream { animation: brew-stream 4.6s linear infinite; }
  .live .a-brew-count { animation: brew-count 4.6s infinite; }
  @keyframes brew-level {
    0%, 8% { transform: scaleY(0); opacity: 1; }
    62%, 93% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }
  @keyframes brew-stream {
    0%, 3% { opacity: 0; }
    7%, 60% { opacity: 1; }
    66%, 100% { opacity: 0; }
  }
  @keyframes brew-count {
    0%, 8% { transform: translateY(45px); opacity: 1; animation-timing-function: steps(5, end); }
    62%, 93% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(0); opacity: 0; }
  }

  .live .a-fade-late { animation: fade-late 4.4s var(--ease) infinite; }
  @keyframes fade-late {
    0%, 52% { opacity: 0; }
    66%, 94% { opacity: 1; }
    100% { opacity: 0; }
  }
  .live .a-grind-marker { animation: grind-marker 4.4s var(--ease) infinite; }
  @keyframes grind-marker {
    0% { transform: translateX(-40px); opacity: 0; }
    6% { transform: translateX(-40px); opacity: 1; }
    44% { transform: translateX(5px); }
    56%, 94% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(0); opacity: 0; }
  }

  .live .a-dial { animation: dial 4.6s var(--ease) infinite; }
  .live .num { animation: dial-num 4.6s var(--ease) infinite; }
  @keyframes dial {
    0%, 6% { transform: rotate(calc(var(--rest) - 110deg)); }
    58%, 100% { transform: rotate(var(--rest)); }
  }
  @keyframes dial-num {
    0%, 6% { transform: rotate(calc(110deg - var(--rest) - var(--a))); }
    58%, 100% { transform: rotate(calc(0deg - var(--rest) - var(--a))); }
  }

  .live .a-pin { animation: pin 4s infinite; }
  .live .a-ripple { transform-box: fill-box; transform-origin: 50% 50%; animation: ripple 4s ease-out infinite; }
  @keyframes pin {
    0%, 10% { transform: translateY(-34px); opacity: 0; animation-timing-function: cubic-bezier(0.5, 0, 0.9, 0.6); }
    14% { opacity: 1; }
    38% { transform: translateY(0); animation-timing-function: ease-out; }
    44% { transform: translateY(-3px); animation-timing-function: ease-in; }
    50%, 100% { transform: translateY(0); opacity: 1; }
  }
  @keyframes ripple {
    0%, 37% { transform: scale(0.2); opacity: 0; }
    39% { transform: scale(0.3); opacity: 0.8; }
    70%, 100% { transform: scale(1.5); opacity: 0; }
  }

  .live .a-l1, .live .a-l2, .live .a-l3 { transform-box: fill-box; transform-origin: 50% 100%; }
  .live .a-l1 { animation: layer1 4.8s var(--ease) infinite; }
  /* the crema rides on top of the rising espresso */
  .live .a-l1c { animation: layer1c 4.8s var(--ease) infinite; }
  .live .a-l2 { animation: layer2 4.8s var(--ease) infinite; }
  .live .a-l3 { animation: layer3 4.8s var(--ease) infinite; }
  .live path.a-l3, .live .a-l3b { animation: layerline 4.8s var(--ease) infinite; }
  @keyframes layer1 {
    0%, 4% { transform: scaleY(0); opacity: 1; }
    24%, 93% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }
  @keyframes layer1c {
    0%, 4% { transform: translateY(10.4px); opacity: 0; }
    6% { opacity: 1; }
    24%, 93% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(0); opacity: 0; }
  }
  @keyframes layer2 {
    0%, 27% { transform: scaleY(0); opacity: 1; }
    50%, 93% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }
  @keyframes layer3 {
    0%, 53% { transform: scaleY(0); opacity: 1; }
    67%, 93% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }
  @keyframes layerline {
    0%, 62% { opacity: 0; }
    67%, 93% { opacity: 1; }
    100% { opacity: 0; }
  }

  .live .a-doc-dot { animation: doc-dot 4.4s var(--ease) infinite; }
  @keyframes doc-dot {
    0% { transform: translateX(-52px); opacity: 0; }
    6% { transform: translateX(-52px); opacity: 1; }
    56%, 94% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(0); opacity: 0; }
  }

  .live .a-ext-dot { animation: ext-dot 4.4s infinite; }
  @keyframes ext-dot {
    0% { transform: translate(-29px, 24px); opacity: 0; animation-timing-function: ease-in; }
    6% { transform: translate(-29px, 24px); opacity: 1; animation-timing-function: cubic-bezier(0.3, 0, 0.6, 1); }
    30% { transform: translate(-22px, 7px); animation-timing-function: cubic-bezier(0.3, 0.3, 0.3, 1); }
    56%, 94% { transform: translate(0, 0); opacity: 1; }
    100% { transform: translate(0, 0); opacity: 0; }
  }

  .live .a-caf-line { stroke-dasharray: 1 1; animation: caf-line 4.8s var(--ease) infinite; }
  .live .a-caf-reveal { transform-box: view-box; transform-origin: 16px 0; animation: caf-reveal 4.8s var(--ease) infinite; }
  .live .a-caf-end { transform-box: fill-box; transform-origin: 50% 50%; animation: caf-end 4.8s var(--ease) infinite; }
  @keyframes caf-line {
    0%, 4% { stroke-dashoffset: 1; opacity: 1; }
    66%, 94% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }
  @keyframes caf-reveal {
    0%, 4% { transform: scaleX(0); opacity: 1; }
    66%, 94% { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }
  @keyframes caf-end {
    0%, 62% { transform: scale(0); }
    72%, 100% { transform: scale(1); }
  }

  .live .a-fresh-marker { animation: fresh-marker 4.6s var(--ease) infinite; }
  @keyframes fresh-marker {
    0% { transform: translateX(-55px); opacity: 0; }
    6% { transform: translateX(-55px); opacity: 1; }
    58%, 94% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(0); opacity: 0; }
  }

  .live .a-mach-lift { animation: mach-lift 4.6s var(--ease) infinite; }
  .live .a-mach-dim { animation: mach-dim 4.6s var(--ease) infinite; }
  .live .a-seg1, .live .a-seg2, .live .a-seg3 { transform-box: fill-box; transform-origin: 0 50%; }
  .live .a-seg1 { animation: seg1 4.6s var(--ease) infinite; }
  .live .a-seg2 { animation: seg2 4.6s var(--ease) infinite; }
  .live .a-seg3 { animation: seg3 4.6s var(--ease) infinite; }
  @keyframes mach-lift {
    0%, 8% { transform: translateY(0); }
    28%, 100% { transform: translateY(-5px); }
  }
  @keyframes mach-dim {
    0%, 8% { opacity: 1; }
    28%, 100% { opacity: 0.38; }
  }
  @keyframes seg1 {
    0%, 30% { transform: scaleX(0); opacity: 1; }
    48%, 94% { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }
  @keyframes seg2 {
    0%, 48% { transform: scaleX(0); opacity: 1; }
    60%, 94% { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }
  @keyframes seg3 {
    0%, 60% { transform: scaleX(0); opacity: 1; }
    68%, 94% { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(1); opacity: 0; }
  }

  .live .a-pod-lift { animation: pod-lift 4.6s var(--ease) infinite; }
  .live .a-cup-fill { transform-box: fill-box; transform-origin: 50% 100%; }
  .live rect.a-cup-fill.espresso { animation: cup-fill 4.6s var(--ease) infinite; }
  .live rect.a-cup-fill.crema { animation: cup-crema 4.6s var(--ease) infinite; }
  @keyframes pod-lift {
    0%, 6% { transform: translateY(0); }
    26%, 100% { transform: translateY(-9px); }
  }
  @keyframes cup-fill {
    0%, 28% { transform: scaleY(0); opacity: 1; }
    66%, 94% { transform: scaleY(1); opacity: 1; }
    100% { transform: scaleY(1); opacity: 0; }
  }
  @keyframes cup-crema {
    0%, 28% { transform: translateY(13px); opacity: 0; }
    32% { opacity: 1; }
    66%, 94% { transform: translateY(0); opacity: 1; }
    100% { transform: translateY(0); opacity: 0; }
  }

  .live .a-pointer { animation: pointer 4.8s linear infinite; }
  .live .a-harvest { animation: harvest 4.8s linear infinite; }
  /* One full turn in the first 80 % (linear), then a rest; the arc is lit while the pointer is over it. */
  @keyframes pointer {
    0% { transform: rotate(var(--rest)); }
    80%, 100% { transform: rotate(calc(var(--rest) + 360deg)); }
  }
  @keyframes harvest {
    0%, 13% { opacity: 1; }
    17%, 61% { opacity: 0; }
    65%, 100% { opacity: 1; }
  }

  .live .a-petal-open { transform-box: view-box; transform-origin: 64px 52px; animation: petal-open 4.6s var(--ease) infinite; }
  .live .a-sub1, .live .a-sub2, .live .a-sub3 { transform-origin: 0 0; }
  .live .a-sub1 { animation: sub1 4.6s var(--ease) infinite; }
  .live .a-sub2 { animation: sub2 4.6s var(--ease) infinite; }
  .live .a-sub3 { animation: sub3 4.6s var(--ease) infinite; }
  @keyframes petal-open {
    0%, 6% { transform: scale(1); fill-opacity: 0.5; fill: #d4944f; }
    26%, 100% { transform: scale(1.08); fill-opacity: 0.9; }
  }
  @keyframes sub1 {
    0%, 26% { transform: scale(0) rotate(30deg); opacity: 0; }
    30% { opacity: 1; }
    46%, 94% { transform: scale(1) rotate(0); opacity: 1; }
    100% { transform: scale(1) rotate(0); opacity: 0; }
  }
  @keyframes sub2 {
    0%, 32% { transform: scale(0); opacity: 0; }
    36% { opacity: 1; }
    52%, 94% { transform: scale(1); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes sub3 {
    0%, 38% { transform: scale(0) rotate(-30deg); opacity: 0; }
    42% { opacity: 1; }
    58%, 94% { transform: scale(1) rotate(0); opacity: 1; }
    100% { transform: scale(1) rotate(0); opacity: 0; }
  }

  .live .a-star, .live .a-star-glow { transform-box: fill-box; transform-origin: 50% 50%; }
  .live .a-star { animation: star 4.4s var(--ease) infinite; }
  .live .a-star-glow { animation: star-glow 4.4s var(--ease) infinite; }
  .live .a-cline { stroke-dasharray: 1 1; animation: cline 4.4s var(--ease) infinite; }
  @keyframes star {
    0%, 8% { transform: scale(0.72); opacity: 0.6; }
    30%, 100% { transform: scale(1); opacity: 1; }
  }
  @keyframes star-glow {
    0%, 8% { transform: scale(0.3); opacity: 0; }
    30%, 100% { transform: scale(1); opacity: 1; }
  }
  @keyframes cline {
    0%, 30% { stroke-dashoffset: 1; opacity: 1; }
    60%, 94% { stroke-dashoffset: 0; opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .live * { animation: none !important; }
  }
</style>
