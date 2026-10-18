<script module lang="ts">
  // Cutaway drawings of 13 brewers for the Brewing Constellations detail panel.
  // One viewBox (200 × 240), counter line at y = 228, brewers at roughly one scale (not exact).
  // Colour means substance: teal is water that has not met coffee yet, brown is brew. Nothing else is teal.
  // Colours come from custom properties so the page can theme them; the fallbacks are the design system's:
  //   --ink, --ink-2 (callouts), --water, --water-tint, --coffee, --coffee-deep, --crema-fill, --grounds,
  //   --filter-paper, --filter-line, --mesh, --flame, --metal, --body, --wood.
  export type CutawayId =
    | 'v60' | 'chemex' | 'kalita' | 'drip-machine' | 'phin' | 'french-press' | 'clever'
    | 'cold-brew' | 'siphon' | 'turkish' | 'espresso' | 'moka' | 'aeropress';

  export const CUTAWAY_IDS: CutawayId[] = [
    'v60', 'chemex', 'kalita', 'drip-machine', 'phin', 'french-press', 'clever',
    'cold-brew', 'siphon', 'turkish', 'espresso', 'moka', 'aeropress',
  ];

  export const CUTAWAY_TEXT: Record<CutawayId, string> = {
    v60: 'Water poured over a paper-lined cone passes through the coffee bed and drips from one large hole into the server.',
    chemex: 'Water poured into a thick folded paper passes through the coffee bed and drips into the lower glass bulb.',
    kalita: 'Water poured onto a flat bed in a fluted paper passes through the coffee and leaves by three small holes.',
    'drip-machine': 'A heater pushes water from the reservoir up a tube to a showerhead, which rains it onto a flat bed of coffee that drips into the carafe.',
    phin: 'Water sits on a press disc above the grounds, seeps through them and drips slowly from the perforated base into the glass.',
    'french-press': 'Grounds steep loose in the water for minutes, then a metal mesh is pressed down to hold them below the brew.',
    clever: 'Water and grounds steep together in a paper-lined cone until it is set on a cup, which opens a valve so the brew drains through the paper.',
    'cold-brew': 'Coarse grounds sit in cold water for 12 to 18 hours in a fine metal mesh, while the coffee slowly spreads into the water, with no flow at all.',
    siphon: 'Vapor pressure in the heated lower globe pushes the water up into the grounds, and when the heat goes off the cooling globe pulls the brew back down through the filter.',
    turkish: 'Very fine coffee is heated with water in a cezve until the foam rises, then poured unfiltered so the grounds settle in the cup.',
    espresso: 'A pump forces hot water at about 9 bar through a tamped puck of fine coffee, and two thin streams fall into the cup.',
    moka: 'Steam pressure in the heated boiler pushes the water up the funnel, through the grounds and up the central column into the top chamber.',
    aeropress: 'Grounds steep in the chamber, then the plunger is pushed down by hand and forces the brew through a paper disc into the mug.',
  };

  /** Centre of each drawing without its callouts: compact mode centres the brewer in the frame. */
  const CENTER: Record<CutawayId, number> = {
    v60: 88, chemex: 88, kalita: 88, 'drip-machine': 92, phin: 88, 'french-press': 98, clever: 90,
    'cold-brew': 96, siphon: 92, turkish: 98, espresso: 98, moka: 93, aeropress: 96,
  };

  /** Loop length per method, seconds. */
  const LOOP: Record<CutawayId, number> = {
    v60: 6, chemex: 6, kalita: 6, 'drip-machine': 6, phin: 7, 'french-press': 7, clever: 7,
    'cold-brew': 7, siphon: 7, turkish: 6, espresso: 5, moka: 6, aeropress: 6,
  };
</script>

<script lang="ts">
  interface Props {
    method: CutawayId;
    /** Animate the water path and phases. */
    playing?: boolean;
    /** Hide callouts (small sizes). */
    compact?: boolean;
    /** aria-label override. */
    label?: string;
  }
  let { method, playing = false, compact = false, label }: Props = $props();

  // Unique ids per instance: two cutaways share a page when comparing.
  const uid = $props.id();
  const id = (s: string) => `bc${uid}-${s}`;
  const url = (s: string) => `url(#bc${uid}-${s})`;
  let vx = $derived(compact ? CENTER[method] - 100 : 0);

  /** A zigzag line between two points (fluted paper), as "x y L x y …". */
  function wavy(x1: number, y1: number, x2: number, y2: number, n: number, a: number) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, o = i === 0 || i === n ? 0 : i % 2 ? a : -a;
      pts.push(`${(x1 + (x2 - x1) * t + nx * o).toFixed(1)} ${(y1 + (y2 - y1) * t + ny * o).toFixed(1)}`);
    }
    return pts.join(' L');
  }
</script>

{#snippet co(text: string, tx: number, ty: number, anchor: 'start' | 'end', x1: number, y1: number, x2: number, y2: number)}
  <g class="co">
    <path class="lead" d={`M${x1} ${y1} L${x2} ${y2}`} />
    <circle class="dot" cx={x2} cy={y2} r="1.3" />
    <text x={tx} y={ty} text-anchor={anchor}>{#each text.split('\n') as line, i}<tspan x={tx} dy={i ? 10.5 : 0}>{line}</tspan>{/each}</text>
  </g>
{/snippet}

{#snippet bedgrad(y1: number, y2: number)}
  <!-- water turning into brew on its way through the bed: tint (readable over the teal pool) → teal → dark brew -->
  <linearGradient id={id('bed')} gradientUnits="userSpaceOnUse" x1="0" {y1} x2="0" {y2}>
    <stop offset="0" class="sc-water2" /><stop offset=".3" class="sc-water" /><stop offset=".5" class="sc-water" /><stop offset="1" class="sc-brew2" />
  </linearGradient>
{/snippet}

{#snippet arrow(d: string, stroke: string, mk: string)}
  <path class="halo" {d} />
  <path class="pa" {d} style={`stroke:${stroke}`} marker-end={url(mk)} />
{/snippet}

{#snippet stream(d: string, kind: 'w' | 'b', w: number = 1.8)}
  <path class="st" {d} style={`stroke:var(--_${kind === 'w' ? 'water' : 'brew'});stroke-width:${w}`} />
  <path class="run" {d} style={`stroke-width:${Math.max(0.6, w - 1)}`} />
{/snippet}

{#snippet drop(x: number, y: number, fall: number, k: number, t: number = 1.4, kind: 'w' | 'b' = 'b')}
  <path
    class="drop {kind === 'w' ? 'f-water' : 'f-brew'}"
    d={`M${x} ${y - 2.6} Q ${x + 2} ${y + 0.4} ${x} ${y + 1.9} Q ${x - 2} ${y + 0.4} ${x} ${y - 2.6} Z`}
    style={`--fall:${fall}px;--k:${k};--t:${t}s;transform:translateY(${(k * fall).toFixed(1)}px)`}
  />
{/snippet}

{#snippet kettle(tx: number, ty: number, flip: boolean = false)}
  <!-- the last stretch of a gooseneck kettle's spout, coming in from off the edge -->
  <g transform={flip ? `translate(${2 * tx} 0) scale(-1 1)` : undefined}>
    <path class="neck" d={`M${tx - 112} ${ty + 40} C ${tx - 80} ${ty - 8}, ${tx - 36} ${ty - 30}, ${tx - 13} ${ty - 12} L ${tx} ${ty}`} />
    <path class="neck-in" d={`M${tx - 112} ${ty + 40} C ${tx - 80} ${ty - 8}, ${tx - 36} ${ty - 30}, ${tx - 13} ${ty - 12} L ${tx} ${ty}`} />
  </g>
{/snippet}

{#snippet server(cx: number)}
  <!-- glass server: brew level rises while playing -->
  <clipPath id={id('srv')}><path d={`M${cx - 30} 158 L${cx - 30} 216 Q${cx - 30} 226 ${cx - 20} 226 L${cx + 20} 226 Q${cx + 30} 226 ${cx + 30} 216 L${cx + 30} 158 Z`} /></clipPath>
  <g clip-path={url('srv')}><rect class="lvl-up" x={cx - 36} y="194" width="72" height="34" fill={url('brewg')} /></g>
  <path d={`M${cx - 31} 158 L${cx - 31} 216 Q${cx - 31} 227 ${cx - 20} 227 L${cx + 20} 227 Q${cx + 31} 227 ${cx + 31} 216 L${cx + 31} 158 Z`} fill={url('glass')} fill-opacity=".45" />
  <path class="o" fill="none" d={`M${cx - 37} 154 L${cx - 31} 158 L${cx - 31} 216 Q${cx - 31} 227 ${cx - 20} 227 L${cx + 20} 227 Q${cx + 31} 227 ${cx + 31} 216 L${cx + 31} 158`} />
  <path class="o" fill="none" d={`M${cx + 31} 170 C ${cx + 49} 170, ${cx + 51} 204, ${cx + 31} 204`} />
  <path class="h" d={`M${cx - 25} 166 L${cx - 25} 214`} />
{/snippet}

<svg
  viewBox={`${vx} 0 200 240`}
  role="img"
  aria-label={label ?? CUTAWAY_TEXT[method]}
  class="bc"
  class:play={playing}
  data-method={method}
  style={`--loop:${LOOP[method]}s`}
>
  <defs>
    <linearGradient id={id('glass')} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity=".9" />
      <stop offset=".28" stop-color="#fff" stop-opacity=".22" />
      <stop offset=".64" stop-color="#fff" stop-opacity=".08" />
      <stop offset=".86" stop-color="#fff" stop-opacity=".6" />
      <stop offset="1" stop-color="#fff" stop-opacity=".2" />
    </linearGradient>
    <linearGradient id={id('brewg')} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" class="sc-brew" />
      <stop offset="1" class="sc-brew2" />
    </linearGradient>
    <pattern id={id('gr')} width="5" height="5" patternUnits="userSpaceOnUse">
      <rect width="5" height="5" class="f-grounds" />
      <circle cx="1.2" cy="1.3" r=".75" class="f-gdark" />
      <circle cx="3.6" cy="3.4" r=".6" class="f-glight" />
      <circle cx="3.9" cy=".9" r=".45" class="f-gdark" />
      <circle cx="1.6" cy="4" r=".4" class="f-gdark" />
    </pattern>
    <pattern id={id('sl')} width="7" height="7" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" class="f-slurry" />
      <circle cx="1.5" cy="1.8" r=".9" class="f-gdark" />
      <circle cx="5" cy="4.6" r=".8" class="f-glight" />
      <circle cx="4.6" cy="1" r=".5" class="f-gdark" />
      <circle cx="2" cy="5.6" r=".55" class="f-glight" />
    </pattern>
    <pattern id={id('grc')} width="7" height="7" patternUnits="userSpaceOnUse">
      <rect width="7" height="7" class="f-grounds" />
      <circle cx="1.8" cy="2" r="1.3" class="f-gdark" />
      <circle cx="5.2" cy="5" r="1.1" class="f-glight" />
      <circle cx="5.4" cy="1.4" r=".7" class="f-gdark" />
      <circle cx="2" cy="5.8" r=".8" class="f-gdark" />
    </pattern>
    <marker id={id('mw')} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" class="f-water" /></marker>
    <marker id={id('mb')} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" class="f-brew2" /></marker>
    <marker id={id('mk')} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" class="f-ink" /></marker>
    <marker id={id('mt')} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" class="f-water2" /></marker>
    <marker id={id('ml')} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9 Z" class="f-card" /></marker>
  </defs>

  <path class="counter" d={`M${vx + 6} 228 L${vx + 194} 228`} />

  {#if method === 'v60'}
    {@render bedgrad(114, 146)}
    {@render server(86)}
    <!-- base plate with the one large hole -->
    <rect class="d f-metal" x="58" y="151" width="20" height="6" rx="1.5" />
    <rect class="d f-metal" x="94" y="151" width="20" height="6" rx="1.5" />
    <!-- paper cone, bed, water on top -->
    <path class="paper" d="M46 86 L126 86 L88 150 Q86 153 84 150 Z" />
    <g class="h">
      <path d="M53 91 Q 62 99, 63 110" /><path d="M68 91 Q 75 100, 74 110" /><path d="M86 91 Q 91 100, 88 110" />
      <path d="M103 91 Q 106 100, 101 110" /><path d="M118 91 Q 118 100, 111 109" />
    </g>
    <path d="M67.4 122 L104.6 122 L88 150 Q86 153 84 150 Z" fill={url('gr')} />
    <path class="f-water" d="M61.4 112 L110.6 112 L104.6 122 L67.4 122 Z" opacity=".9" />
    <!-- cone walls, rim, handle -->
    <path class="o" fill="none" d="M42 92 L77 151 M130 92 L95 151" />
    <path class="o rim" d="M38 92 L134 92" />
    <path class="o" fill="none" d="M45.6 98 C 24 98, 24 128, 63.7 128" />
    {#if !compact}{@render kettle(76, 70)}{/if}
    {@render stream('M77 72 Q 81 86, 84 112', 'w')}
    {@render arrow('M71 115 Q 75 128, 79 136', url('bed'), 'mb')}
    {@render arrow('M86 114 L86 145', url('bed'), 'mb')}
    {@render arrow('M101 115 Q 97 128, 93 136', url('bed'), 'mb')}
    {@render stream('M86 154 L86 196', 'b', 2)}
    {#if !compact}
      {@render co('paper', 147, 89, 'start', 145, 86.5, 125, 88)}
      {@render co('bed', 147, 131, 'start', 145, 128, 97, 128)}
      {@render co('one big\nhole', 147, 150, 'start', 145, 147, 95, 153)}
    {/if}
  {:else if method === 'kalita'}
    {@render bedgrad(126, 150)}
    {@render server(86)}
    <path class="paper" d={`M50 100 L122 100 L${wavy(122, 100, 102, 150, 12, 1.6)} L70 150 L${wavy(70, 150, 50, 100, 12, 1.6)} Z`} />
    <g class="h">
      {#each [0, 1, 2, 3, 4, 5, 6] as i}<path d={`M${57 + i * 9.7} 103 L${66 + i * 6.7} 122`} />{/each}
    </g>
    <path d="M63.6 134 L108.4 134 L102 150 L70 150 Z" fill={url('gr')} />
    <path class="f-water" d="M59.6 124 L112.4 124 L108.4 134 L63.6 134 Z" opacity=".9" />
    <!-- flat-bottom dripper: walls and rim, standing on a flat floor plate pierced by three small holes -->
    <path class="o" fill="none" d="M46 106 L68 151 M126 106 L104 151" />
    <path class="o rim" d="M42 106 L130 106" />
    <rect class="d f-metal" x="56" y="151" width="19.8" height="6" rx="1" />
    <rect class="d f-metal" x="78.2" y="151" width="6.6" height="6" />
    <rect class="d f-metal" x="87.2" y="151" width="6.6" height="6" />
    <rect class="d f-metal" x="96.2" y="151" width="19.8" height="6" rx="1" />
    {#if !compact}{@render kettle(78, 82)}{/if}
    {@render stream('M79 84 Q 83 98, 85 124', 'w')}
    {@render arrow('M77 127 L77 146', url('bed'), 'mb')}
    {@render arrow('M86 127 L86 146', url('bed'), 'mb')}
    {@render arrow('M95 127 L95 146', url('bed'), 'mb')}
    {@render stream('M77 158 L77 196', 'b', 1.1)}
    {@render stream('M86 158 L86 196', 'b', 1.1)}
    {@render stream('M95 158 L95 196', 'b', 1.1)}
    {#if !compact}
      {@render co('wave\npaper', 147, 100, 'start', 145, 97, 121, 101)}
      {@render co('flat bed', 147, 139, 'start', 145, 136, 104, 141)}
      {@render co('3 small\nholes', 147, 162, 'start', 145, 159, 98, 155)}
    {/if}
  {:else if method === 'chemex'}
    {@render bedgrad(92, 124)}
    <clipPath id={id('bulb')}><path d="M77 128 L99 128 C 101 140, 136 156, 136 188 C 136 212, 126 226, 112 226 L64 226 C 50 226, 40 212, 40 188 C 40 156, 75 140, 77 128 Z" /></clipPath>
    <!-- glass sheen first, contents, then the outline on top -->
    <path d="M42 60 L134 60 L99 128 C 101 140, 136 156, 136 188 C 136 212, 126 227, 112 227 L64 227 C 50 227, 40 212, 40 188 C 40 156, 75 140, 77 128 Z" fill={url('glass')} fill-opacity=".45" />
    <g clip-path={url('bulb')}><rect class="lvl-up" x="36" y="198" width="104" height="32" fill={url('brewg')} /></g>
    <path class="paper" d="M45 54 L131 54 L97 124 Q 88 129 79 124 Z" />
    <path class="paper-layer" d="M47 54 L80.8 124.6 M49 54 L82.6 125.4" />
    <path d="M67.4 100 L108.6 100 L97 124 Q 88 129 79 124 Z" fill={url('gr')} />
    <path class="f-water" d="M62.5 90 L113.5 90 L108.6 100 L67.4 100 Z" opacity=".9" />
    <path class="o" fill="none" d="M36 55 L42 60 L77 128 C 75 140, 40 156, 40 188 C 40 212, 50 227, 64 227 L112 227 C 126 227, 136 212, 136 188 C 136 156, 101 140, 99 128 L134 60 L42 60" />
    <path class="d" d="M46.5 64 L62 95" />
    <!-- wooden collar in section, leather tie, bead -->
    <path class="d f-wood" d="M64 116 L71 116 L76.5 128 L63 145 L55 145 Z" />
    <path class="d f-wood" d="M112 116 L105 116 L99.5 128 L113 145 L121 145 Z" />
    <path class="tie" d="M58 131 L73 131 M103 131 L118 131 M59 131 Q 54 138 55 144" />
    <circle class="d f-wood" cx="55" cy="147" r="2.6" />
    {#if !compact}{@render kettle(100, 66, true)}{/if}
    {@render stream('M99 68 Q 95 78, 94 90', 'w')}
    {@render arrow('M74 93 Q 78 106, 81 114', url('bed'), 'mb')}
    {@render arrow('M88 93 L88 123', url('bed'), 'mb')}
    {@render arrow('M102 93 Q 98 106, 95 114', url('bed'), 'mb')}
    {@render drop(88, 132, 64, 0.12)}
    {@render drop(88, 132, 64, 0.45)}
    {@render drop(88, 132, 64, 0.78)}
    {#if !compact}
      {@render co('thick\npaper', 4, 74, 'start', 32, 78, 58, 80)}
      {@render co('bed', 123, 109, 'start', 121, 106, 104, 107)}
      {@render co('wood\ncollar', 4, 128, 'start', 34, 131, 58, 136)}
    {/if}
  {:else if method === 'phin'}
    {@render bedgrad(108, 146)}
    <clipPath id={id('glassin')}><path d="M61 150 L65 222 Q65 226 69 226 L107 226 Q111 226 111 222 L115 150 Z" /></clipPath>
    <!-- tumbler -->
    <path d="M60 150 L64 222 Q64 227 69 227 L107 227 Q112 227 112 222 L116 150 Z" fill={url('glass')} fill-opacity=".45" />
    <g clip-path={url('glassin')}><rect class="lvl-up" x="58" y="198" width="60" height="30" fill={url('brewg')} /></g>
    <path class="o" fill="none" d="M60 150 L64 222 Q64 227 69 227 L107 227 Q112 227 112 222 L116 150" />
    <!-- chamber: water on the press disc, grounds below it, perforated floor -->
    <path class="f-water lvl-dn" d="M65.4 104 L110.6 104 L111 124 L65 124 Z" opacity=".9" />
    <path d="M65 127 L111 127 L110 146 L66 146 Z" fill={url('gr')} />
    <rect class="d f-metal" x="66.5" y="124" width="43" height="3.2" rx="1" />
    <path class="d" d="M88 146 L88 109" />
    <circle class="f-ink" cx="88" cy="108.5" r="1.8" />
    <path class="o" fill="none" d="M64 96 L66 146 M112 96 L110 146" />
    <path class="o holes" d="M66 146 L110 146" />
    <rect class="d f-metal" x="44" y="144" width="22" height="4" rx="1" />
    <rect class="d f-metal" x="110" y="144" width="22" height="4" rx="1" />
    <!-- lid -->
    <path class="o f-metal" d="M62 96 L62 91 Q62 88 66 88 L110 88 Q114 88 114 91 L114 96 Z" />
    <rect class="d f-metal" x="83" y="82" width="10" height="6" rx="1.5" />
    {@render arrow('M75 108 L75 143', url('bed'), 'mb')}
    {@render arrow('M101 108 L101 143', url('bed'), 'mb')}
    {@render drop(74, 152, 46, 0.1, 2.4)}
    {@render drop(95, 152, 46, 0.42, 2.4)}
    {@render drop(84, 152, 46, 0.74, 2.4)}
    {#if !compact}
      {@render co('press\ndisc', 4, 121, 'start', 33, 124.5, 69, 125.5)}
      {@render co('perforated\nbase', 136, 157, 'start', 134, 154, 106, 147)}
      {@render co('slow\ndrips', 124, 183, 'start', 122, 186, 103, 180)}
    {/if}
  {:else if method === 'drip-machine'}
    {@render bedgrad(85, 101)}
    <clipPath id={id('carafe')}><path d="M51 118 L51 128 C 41 134, 39 146, 39 160 L39 196 Q39 202 45 202 L99 202 Q105 202 105 196 L105 160 C 105 146, 103 134, 93 128 L93 118 Z" /></clipPath>
    <!-- body: head arm, back column, base -->
    <path class="o f-body" d="M32 40 L152 40 Q158 40 158 46 L158 208 L110 208 L110 62 L32 62 Q26 62 26 56 L26 46 Q26 40 32 40 Z" />
    <path class="o f-body" d="M26 208 L158 208 L158 224 Q158 228 154 228 L30 228 Q26 228 26 224 Z" />
    <rect class="f-ink" x="34" y="203" width="76" height="5" rx="1" />
    <!-- reservoir, cut open -->
    <rect class="d f-card" x="122" y="66" width="30" height="112" />
    <rect class="f-water lvl-dn" x="123" y="100" width="28" height="77" opacity=".9" />
    <!-- tube: reservoir → heater → up the column → across the head to the showerhead -->
    <path class="tube" d="M146 178 L146 217 L116 217 L116 51 L72 51 L72 62" />
    <path class="tube-in" d="M146 178 L146 217 L116 217 L116 51 L72 51 L72 62" />
    <path class="coil" d="M121 212 L124 222 L127 212 L130 222 L133 212 L136 222 L139 212 L142 222" />
    <path class="pa pa-w" d="M146 179 L146 217 L116 217 L116 51 L72 51 L72 61" marker-mid={url('mw')} marker-end={url('mw')} />
    <!-- basket hung under the head, fluted flat-bottom paper, bed -->
    <path class="o f-card" d="M40 64 L104 64 L92 104 L52 104 Z" />
    <path class="paper" d={`M44 64 L100 64 L${wavy(100, 64, 90, 101, 10, 1.3)} L54 101 L${wavy(54, 101, 44, 64, 10, 1.3)} Z`} />
    <path d="M51 90 L93 90 L90 101 L54 101 Z" fill={url('gr')} />
    <path class="f-water" d="M49.4 84 L94.6 84 L93 90 L51 90 Z" opacity=".9" />
    <path class="f-ink" d="M68 104 L76 104 L74.5 110 L69.5 110 Z" />
    <!-- showerhead under the head, spraying onto the bed -->
    <rect class="d f-metal" x="56" y="59" width="32" height="4" rx="1" />
    <path class="spray" d="M61 66 L58 83 M67 66 L66 83 M77 66 L78 83 M83 66 L86 83" />
    {@render arrow('M62 86 L62 99', url('bed'), 'mb')}
    {@render arrow('M72 86 L72 99', url('bed'), 'mb')}
    {@render arrow('M82 86 L82 99', url('bed'), 'mb')}
    <!-- carafe on the warming plate -->
    <path d="M50 118 L50 128 C 40 134, 38 146, 38 160 L38 196 Q38 203 45 203 L99 203 Q106 203 106 196 L106 160 C 106 146, 104 134, 94 128 L94 118 Z" fill={url('glass')} fill-opacity=".45" />
    <g clip-path={url('carafe')}><rect class="lvl-up" x="36" y="168" width="72" height="36" fill={url('brewg')} /></g>
    <path class="o" fill="none" d="M47 118 L97 118 M50 118 L50 128 C 40 134, 38 146, 38 160 L38 196 Q38 203 45 203 L99 203 Q106 203 106 196 L106 160 C 106 146, 104 134, 94 128 L94 118" />
    <path class="o" fill="none" d="M40 140 C 24 140, 22 184, 38 186" />
    {@render stream('M72 111 L72 168', 'b', 1.8)}
    {#if !compact}
      {@render co('reservoir', 196, 27, 'end', 178, 30, 151, 88)}
      {@render co('showerhead', 4, 27, 'start', 30, 30, 60, 61)}
      {@render co('paper', 4, 83, 'start', 34, 80, 48, 80)}
      {@render co('heater', 162, 222, 'start', 160, 219, 141, 217)}
    {/if}
  {:else if method === 'french-press'}
    <clipPath id={id('fpin')}><rect x="61" y="116" width="54" height="101" /></clipPath>
    <!-- handle and frame base -->
    <path class="o f-body" d="M118 128 C 148 128, 150 198, 118 198 L118 188 C 138 188, 138 138, 118 138 Z" />
    <path class="o f-metal" d="M55 217 L121 217 L121 224 Q121 227 118 227 L58 227 Q55 227 55 224 Z" />
    <rect x="60" y="116" width="56" height="102" fill={url('glass')} fill-opacity=".45" />
    <!-- slurry (grounds loose in the water); clear brew opens up above the mesh as it is pressed -->
    <g clip-path={url('fpin')}>
      <rect x="58" y="128" width="60" height="92" fill={url('sl')} />
      <rect x="58" y="211" width="60" height="8" fill={url('gr')} />
      <rect class="fp-clear" x="58" y="128" width="60" height="42" fill={url('brewg')} />
      <g class="fp-swirl">
        <path class="swirl" d="M70 186 A 18 9 0 0 1 106 186" marker-end={url('ml')} />
        <path class="swirl" d="M106 196 A 18 9 0 0 1 70 196" marker-end={url('ml')} />
      </g>
    </g>
    <path class="h" d="M65 122 L65 212" />
    <!-- plunger: knob, rod, spring plate, metal mesh (drawn mid-press) -->
    <g class="fp-plunger">
      <path class="o" d="M88 167 L88 60" />
      <rect class="d f-metal" x="74" y="164.5" width="28" height="3" rx="1" />
      <path class="mesh" d="M61.5 169.5 L114.5 169.5" />
      <path class="d" d="M61.5 171.2 L114.5 171.2" />
      <circle class="o f-metal" cx="88" cy="55" r="5.5" />
      <g class="fp-force">
        <path class="force" d="M88 28 L88 45" marker-end={url('mk')} />
        {#if !compact}<text class="note" x="94" y="38">press</text>{/if}
      </g>
      {#if !compact}{@render co('metal\nmesh', 4, 167, 'start', 34, 170, 64, 170)}{/if}
    </g>
    <!-- glass, frame straps, lid (drawn over the rod) -->
    <path class="d" d="M57.5 120 L57.5 217 M118.5 120 L118.5 217" />
    <rect class="o" fill="none" x="60" y="116" width="56" height="102" />
    <path class="o f-metal" d="M56 116 L120 116 L120 111 Q120 106 113 105 L63 105 Q56 106 56 111 Z" />
    <rect class="f-metal" x="86.5" y="104" width="3" height="13" />
    <path class="o" d="M88 104 L88 117" />
    {#if !compact}
      {@render co('grounds', 125, 214, 'start', 123, 211, 109, 209)}
    {/if}
  {:else if method === 'clever'}
    <clipPath id={id('clin')}><path d="M50 86 L126 86 L101 146 L75 146 Z" /></clipPath>
    <clipPath id={id('mug')}><path d="M65 161 L65 219 Q65 224 70 224 L110 224 Q115 224 115 219 L115 161 Z" /></clipPath>
    <!-- ceramic mug, cut open -->
    <g clip-path={url('mug')}><rect class="cl-cup" x="60" y="196" width="60" height="30" fill={url('brewg')} /></g>
    <path class="o" fill="none" d="M62 161 L62 220 Q62 227 69 227 L111 227 Q118 227 118 220 L118 161" />
    <path class="h" d="M65 163 L65 219 Q65 224 70 224 L110 224 Q115 224 115 219 L115 163" />
    <path class="o" fill="none" d="M118 172 C 137 172, 139 205, 118 205" />
    <!-- dripper: lowered onto the mug in phase 2, which lifts the valve -->
    <g class="cl-dripper">
      <path class="paper" d="M50 86 L126 86 L101 146 L75 146 Z" />
      <g clip-path={url('clin')}><rect class="cl-slurry" x="44" y="106" width="88" height="52" fill={url('sl')} /></g>
      <path d="M70 134 L106 134 L101 146 L75 146 Z" fill={url('gr')} />
      <path class="o" fill="none" d="M46 92 L71 150 M130 92 L105 150" />
      <path class="o rim" d="M42 92 L134 92" />
      <rect class="d f-body" x="64" y="150" width="18" height="9" rx="1" />
      <rect class="d f-body" x="94" y="150" width="18" height="9" rx="1" />
      <rect class="cl-plug f-ink" x="80" y="146.5" width="16" height="4" rx="1.5" />
      <g class="cl-flow">{@render stream('M88 160 L88 196', 'b', 1.8)}</g>
    </g>
    {#if !compact}
      {@render co('paper', 138, 85, 'start', 136, 82, 125, 87)}
      {@render co('slurry', 4, 118, 'start', 40, 115, 64, 117)}
      {@render co('valve opens\non the cup', 124, 150, 'start', 122, 153, 94, 149)}
    {/if}
  {:else if method === 'cold-brew'}
    <radialGradient id={id('diff')} cx=".5" cy=".5" r=".5">
      <stop offset="0" class="sc-brew" stop-opacity=".85" /><stop offset=".5" class="sc-brew" stop-opacity=".45" /><stop offset="1" class="sc-brew" stop-opacity="0" />
    </radialGradient>
    <clipPath id={id('jar')}><path d="M57 80 L127 80 Q137 82 137 92 L137 217 Q137 226 128 226 L56 226 Q47 226 47 217 L47 92 Q47 82 57 80 Z" /></clipPath>
    <path d="M56 62 L56 72 Q46 76 46 88 L46 217 Q46 227 56 227 L128 227 Q138 227 138 217 L138 88 Q138 76 128 72 L128 62 Z" fill={url('glass')} fill-opacity=".45" />
    <!-- cold water, with brew slowly spreading out from the grounds -->
    <g clip-path={url('jar')}>
      <rect class="f-water" x="44" y="80" width="96" height="148" opacity=".85" />
      <ellipse class="cb-diff" cx="92" cy="164" rx="50" ry="66" fill={url('diff')} />
    </g>
    <path class="d" fill="none" d="M80 104 Q 72 86, 59 64" />
    <path class="bag" d="M80 104 Q 92 100 104 104 L111 190 Q111 206 92 206 Q73 206 73 190 Z" fill={url('grc')} />
    <path class="d" d="M80 104 Q 92 108 104 104" />
    <path class="o" fill="none" d="M56 62 L56 72 Q46 76 46 88 L46 217 Q46 227 56 227 L128 227 Q138 227 138 217 L138 88 Q138 76 128 72 L128 62" />
    <path class="h" d="M56 66 L128 66 M56 69.5 L128 69.5" />
    <path class="h" d="M52 92 L52 214" />
    <rect class="o f-metal" x="52" y="52" width="80" height="11" rx="2" />
    <!-- time, not flow -->
    <circle class="d f-card" cx="170" cy="32" r="9" />
    <path class="d" d="M170 32 L170 26.5" />
    <path class="d cb-hand" d="M170 32 L174.5 34.5" />
    <text class="note" x="170" y="54" text-anchor="middle">12–18 h</text>
    {#if !compact}
      {@render co('mesh\nfilter', 4, 146, 'start', 34, 149, 75, 150)}
      {@render co('cold\nwater', 144, 108, 'start', 142, 111, 126, 112)}
    {/if}
  {:else if method === 'turkish'}
    <clipPath id={id('cz')}><path d="M52 148 Q 58 152 59 158 C 57 170, 47 180, 47 191 Q 47 196 52 196 L88 196 Q 93 196 93 191 C 93 180, 83 170, 81 158 Q 82 152 90 146 Z" /></clipPath>
    <clipPath id={id('demi')}><path d="M145 196 L179 196 L176 214 Q175 219 170 219 L154 219 Q149 219 148 214 Z" /></clipPath>
    <!-- long handle, burner with a low flame -->
    <path class="d f-wood" d="M57 159 L10 126 L7 131 L56 166 Z" />
    <rect class="f-ink" x="52" y="205" width="36" height="5" rx="1" />
    <path class="o f-metal" d="M44 210 L96 210 L92 227 L48 227 Z" />
    {#each [57, 66, 75, 84] as x}<path class="flame f-flame" d={`M${x - 2.6} 205 Q ${x - 2.8} 201, ${x} 197.5 Q ${x + 2.8} 201, ${x + 2.6} 205 Z`} />{/each}
    <!-- coffee, water and very fine grounds together, foam rising to the lip -->
    <g clip-path={url('cz')}>
      <rect x="44" y="168" width="52" height="30" fill={url('sl')} />
      <g class="tk-foam">
        <rect class="f-crema" x="44" y="148" width="52" height="21" />
        {#each [[62, 152], [70, 156], [78, 151], [66, 162], [75, 164], [83, 158], [58, 158]] as [bx, by]}<circle class="f-card" cx={bx} cy={by} r="1.3" opacity=".55" />{/each}
      </g>
    </g>
    <path class="o" fill="none" d="M50 147 Q 57 151 58 158 C 56 170, 46 180, 46 191 Q 46 197 52 197 L88 197 Q 94 197 94 191 C 94 180, 84 170, 82 158 Q 83 151 92 145" />
    <!-- small cup: no filter, grounds settle at the bottom -->
    <g clip-path={url('demi')}>
      <g class="tk-cup">
        <rect x="142" y="201" width="40" height="20" fill={url('brewg')} />
        <rect class="f-crema" x="142" y="199" width="40" height="3" />
        <rect x="142" y="213" width="40" height="8" fill={url('gr')} />
      </g>
    </g>
    <path class="o" fill="none" d="M144 196 L180 196 L177 215 Q176 220 171 220 L153 220 Q148 220 147 215 Z" />
    <path class="o" fill="none" d="M179 200 C 190 200, 190 212, 177 212" />
    <path class="d f-card" d="M134 221 L190 221 Q188 226 178 226 L146 226 Q136 226 134 221 Z" />
    <g class="tk-pour">
      <path class="halo" d="M95 141 C 118 122, 152 138, 160 190" />
      <path class="pa" style="stroke:var(--_brew)" d="M95 141 C 118 122, 152 138, 160 190" marker-end={url('mb')} />
    </g>
    {#if !compact}
      <text class="note" x="126" y="120">no filter</text>
      {@render co('foam', 100, 170, 'start', 98, 167, 84, 155)}
      {@render co('low\nheat', 4, 204, 'start', 26, 207, 54, 202)}
      {@render co('grounds\nsettle', 139, 202, 'end', 140, 208, 153, 216)}
    {/if}
  {:else if method === 'siphon'}
    <clipPath id={id('upin')}><path d="M61 30 L107 30 L107 84 Q107 87 101 90 L87 99 L81 99 L67 90 Q61 87 61 84 Z" /></clipPath>
    <clipPath id={id('globe')}><path d="M76 112 L76 123.1 A 30 30 0 1 0 92 123.1 L92 112 Z" /></clipPath>
    <!-- stand: base, upright, clamp on the lower globe's neck -->
    <rect class="d f-metal" x="30" y="222" width="122" height="5" rx="1.5" />
    <rect class="d f-metal" x="142" y="116" width="6" height="106" />
    <rect class="d f-metal" x="92" y="115" width="52" height="5" rx="1" />
    <!-- spirit lamp and its flame -->
    <path class="o" d="M68 222 L68 210 Q68 204 74 204 L94 204 Q100 204 100 210 L100 222 Z" fill={url('glass')} fill-opacity=".6" />
    <rect class="d f-metal" x="80" y="199" width="8" height="5" />
    <path class="sp-flame f-flame" d="M84 198.5 Q 76.5 191, 84 180.5 Q 91.5 191, 84 198.5 Z" />
    <!-- lower globe: water left behind below the tube end, brew returning in phase 3 -->
    <path d="M76 112 L76 123.1 A 30 30 0 1 0 92 123.1 L92 112 Z" fill={url('glass')} fill-opacity=".45" />
    <g clip-path={url('globe')}>
      <rect class="sp-lw f-water" x="50" y="175" width="70" height="8" />
      <rect class="sp-lb" x="50" y="145" width="70" height="38" fill={url('brewg')} />
    </g>
    <path class="o" fill="none" d="M76 112 L76 123.1 A 30 30 0 1 0 92 123.1 L92 112" />
    <!-- upper chamber: water pushed up, steeping with the grounds, then drawn down -->
    <path d="M60 30 L108 30 L108 84 Q108 88 102 91 L88 100 L88 106 L80 106 L80 100 L66 91 Q60 88 60 84 Z" fill={url('glass')} fill-opacity=".45" />
    <g clip-path={url('upin')}>
      <rect class="sp-uw f-water" x="56" y="46" width="56" height="54" />
      <g class="sp-us">
        <rect x="56" y="46" width="56" height="54" fill={url('sl')} />
        <rect x="56" y="46" width="56" height="5" fill={url('gr')} />
      </g>
    </g>
    <rect class="paper" x="73" y="91.5" width="22" height="3.5" rx="1.5" />
    <path class="d" d="M84 95 L84 172" stroke-dasharray="1.5 2.5" opacity=".5" />
    <path class="o" fill="none" d="M57 30 L111 30 M60 30 L60 84 Q60 88 66 91 L80 100 L80 106 M108 30 L108 84 Q108 88 102 91 L88 100 L88 106" />
    <path class="d" d="M81 106 L81 176 M87 106 L87 176" />
    <rect class="f-ink" x="74" y="106" width="20" height="7" rx="1.5" />
    <g class="sp-up">
      {@render arrow('M84 172 L84 101', 'var(--_water)', 'mw')}
      <path class="pa pa-t" d="M67 138 L67 160" marker-end={url('mt')} />
      <path class="pa pa-t" d="M101 138 L101 160" marker-end={url('mt')} />
    </g>
    <g class="sp-dn">{@render arrow('M84 101 L84 172', 'var(--_brew)', 'mb')}</g>
    {#if !compact}
      {@render co('grounds', 4, 52, 'start', 46, 49, 64, 49)}
      {@render co('cloth\nfilter', 114, 89, 'start', 112, 92, 96, 93)}
      {@render co('vapor\npressure', 4, 138, 'start', 52, 145, 64, 149)}
      {@render co('heat', 4, 193, 'start', 26, 190, 77, 190)}
    {/if}
  {:else if method === 'espresso'}
    {@render bedgrad(89, 106)}
    <clipPath id={id('demi')}><path d="M75.5 181 L108.5 181 L106 202.5 Q105 207 101 207 L83 207 Q79 207 78 202.5 Z" /></clipPath>
    <!-- machine body cut open: pump, pipe to the group -->
    <path class="o f-body" d="M28 12 L172 12 Q178 12 178 18 L178 56 Q178 62 172 62 L28 62 Q22 62 22 56 L22 18 Q22 12 28 12 Z" />
    <rect class="d f-metal" x="136" y="22" width="28" height="22" rx="3" />
    <path class="h" d="M142 27 L142 39 M148 27 L148 39 M154 27 L154 39 M160 27 L160 39" />
    <path class="tube" d="M136 33 L92 33 L92 64" />
    <path class="tube-in" d="M136 33 L92 33 L92 64" />
    <path class="pa pa-w" d="M135 33 L92 33 L92 62" marker-mid={url('mw')} marker-end={url('mw')} />
    <!-- group head: hot water under pressure above the shower screen -->
    <path class="o f-metal" d="M68 62 L116 62 L114 80 Q113 85 107 85 L77 85 Q71 85 70 80 Z" />
    <path class="f-water" d="M76 68 L108 68 L107.4 85 L76.6 85 Z" />
    <path class="force" d="M82 69 L82 82" marker-end={url('mk')} />
    <path class="force" d="M102 69 L102 82" marker-end={url('mk')} />
    <!-- portafilter: basket, tamped puck, spouts; handle off to the left -->
    <path class="o f-ink" d="M70 92 L22 99 Q16 100 16 104.5 Q16 109 22 109 L71 103 Z" />
    <path class="o f-metal" d="M68 86 L116 86 L113 107 Q112 112 106 112 L78 112 Q72 112 71 107 Z" />
    <path class="f-water" d="M75 88 L109 88 L108.4 92 L75.6 92 Z" />
    <path d="M75.6 92 L108.4 92 L107 104 Q106 106 103 106 L81 106 Q78 106 77 104 Z" fill={url('gr')} />
    <path class="d" fill="none" d="M75 88 L77 104 Q78 106 81 106 L103 106 Q106 106 107 104 L109 88" />
    <path class="screen" d="M74 86.5 L110 86.5" />
    <path class="f-metal d" d="M84 112 L100 112 L98 117 L86 117 Z" />
    <rect class="d f-metal" x="85.5" y="117" width="3" height="4" />
    <rect class="d f-metal" x="95.5" y="117" width="3" height="4" />
    {@render arrow('M84 90 L84 103', url('bed'), 'mb')}
    {@render arrow('M92 90 L92 103', url('bed'), 'mb')}
    {@render arrow('M100 90 L100 103', url('bed'), 'mb')}
    {@render stream('M87 122 L87 189', 'b', 1.1)}
    {@render stream('M97 122 L97 189', 'b', 1.1)}
    <!-- demitasse with crema on the drip tray -->
    <path class="o f-metal" d="M36 215 L148 215 L148 227 L36 227 Z" />
    <path class="h" d={Array.from({ length: 18 }, (_, i) => `M${42 + i * 6} 216 L${42 + i * 6} 220`).join(' ')} />
    <path class="d f-card" d="M64 209 L120 209 Q118 214 108 214 L76 214 Q66 214 64 209 Z" />
    <g clip-path={url('demi')}>
      <g class="es-cup">
        <rect class="f-brew2" x="72" y="192" width="40" height="17" />
        <rect class="f-crema" x="72" y="188" width="40" height="5" />
      </g>
    </g>
    <path class="o" fill="none" d="M74 180 L110 180 L107 203 Q106 208 101 208 L83 208 Q78 208 77 203 Z" />
    <path class="o" fill="none" d="M109 184 C 122 184, 122 199, 107 199" />
    {#if !compact}
      {@render co('9 bar pump', 178, 7, 'end', 158, 9, 152, 22)}
      {@render co('tamped\npuck', 122, 97, 'start', 120, 100, 104, 99)}
      {@render co('crema', 4, 190, 'start', 34, 187, 80, 190)}
    {/if}
  {:else if method === 'moka'}
    {@render bedgrad(162, 145)}
    <clipPath id={id('boil')}><path d="M66.5 190 L113.5 190 L108.3 148 L71.7 148 Z" /></clipPath>
    <clipPath id={id('top')}><path d="M72.5 139 L64.5 78 L115.5 78 L107.5 139 Z" /></clipPath>
    <!-- gas burner -->
    <path class="o f-metal" d="M52 210 L128 210 L124 227 L56 227 Z" />
    <rect class="f-ink" x="66" y="205" width="48" height="5" rx="1" />
    {#each [70, 80, 90, 100, 110] as x}<path class="flame f-flame" d={`M${x - 3} 205 Q ${x - 3.2} 199, ${x} 194 Q ${x + 3.2} 199, ${x + 3} 205 Z`} />{/each}
    <!-- boiler (cut open): water, steam space, safety valve -->
    <path class="o f-metal" d="M64 192 L116 192 L110 146 L70 146 Z" />
    <path class="f-card" d="M66.5 190 L113.5 190 L108.3 148 L71.7 148 Z" />
    <g clip-path={url('boil')}><rect class="lvl-dn f-water" x="60" y="174" width="60" height="18" /></g>
    <rect class="d f-metal" x="113" y="166" width="5" height="6" rx="1" />
    <!-- funnel basket of grounds, filter plate, gasket -->
    <rect class="d f-card" x="87" y="161" width="6" height="25" />
    <path class="d" d="M72 146 L108 146 L106 160 Q105 162 102 162 L78 162 Q75 162 74 160 Z" fill={url('gr')} />
    <rect class="f-ink" x="69" y="141" width="42" height="2.5" />
    <path class="o holes" d="M70 145 L110 145" />
    <!-- upper chamber (cut open): central column, brew collecting -->
    <path class="o f-metal" d="M71 141 L62 76 L118 76 L109 141 Z" />
    <path class="f-card" d="M72.5 139 L64.5 78 L115.5 78 L107.5 139 Z" />
    <g clip-path={url('top')}><rect class="lvl-up" x="60" y="116" width="60" height="26" fill={url('brewg')} /></g>
    <rect class="d f-metal" x="87" y="96" width="6" height="44" />
    <path class="o f-metal" d="M60 76 L120 76 L116 69 Q90 63 64 69 Z" />
    <rect class="f-ink" x="86" y="60" width="8" height="5" rx="1.5" />
    <path class="o f-metal" d="M62 72 L50 70 L63.5 82 Z" />
    <path class="handle" d="M117 86 L132 88 L129 126 L111 124" />
    <!-- path: steam pushes water up the funnel, through the grounds, up the column, over the top -->
    <path class="pa pa-t" d="M77 158 L77 170" marker-end={url('mt')} />
    <path class="pa pa-t" d="M103 158 L103 170" marker-end={url('mt')} />
    {@render arrow('M90 186 L90 165', 'var(--_water)', 'mw')}
    {@render arrow('M82 160 L82 149', url('bed'), 'mb')}
    {@render arrow('M98 160 L98 149', url('bed'), 'mb')}
    {@render arrow('M90 139 L90 101', 'var(--_brew)', 'mb')}
    {@render stream('M88.5 96 Q 84 88, 79 100', 'b', 1.5)}
    {@render stream('M91.5 96 Q 96 88, 101 100', 'b', 1.5)}
    {#if !compact}
      {@render co('grounds', 4, 147, 'start', 46, 144, 76, 153)}
      {@render co('steam\n~1.5 bar', 4, 166, 'start', 40, 169, 73, 166)}
      {@render co('filter\nplate', 123, 150, 'start', 121, 147, 106, 145)}
    {/if}
  {:else if method === 'aeropress'}
    <clipPath id={id('apin')}><rect x="67" y="70" width="46" height="81" /></clipPath>
    <clipPath id={id('mug')}><path d="M61 156 L61 219 Q61 224 66 224 L114 224 Q119 224 119 219 L119 156 Z" /></clipPath>
    <!-- mug (ceramic, cut open) -->
    <g clip-path={url('mug')}><rect class="ap-cup" x="56" y="196" width="68" height="30" fill={url('brewg')} /></g>
    <path class="o" fill="none" d="M58 154 L58 220 Q58 227 65 227 L115 227 Q122 227 122 220 L122 154" />
    <path class="h" d="M61 158 L61 219 Q61 224 66 224 L114 224 Q119 224 119 219 L119 158" />
    <path class="o" fill="none" d="M122 166 C 142 166, 144 206, 122 206" />
    <g class="ap-flow">{@render stream('M90 161 L90 196', 'b', 1.8)}</g>
    <!-- chamber: slurry below the plunger seal -->
    <rect x="66" y="70" width="48" height="80" fill={url('glass')} fill-opacity=".45" />
    <g clip-path={url('apin')}>
      <rect class="ap-slurry" x="62" y="114" width="56" height="37" fill={url('sl')} />
      <rect x="62" y="145" width="56" height="6" fill={url('gr')} />
      <g class="ap-swirl">
        <path class="swirl" d="M74 108 A 16 8 0 0 1 106 108" marker-end={url('ml')} />
        <path class="swirl" d="M106 118 A 16 8 0 0 1 74 118" marker-end={url('ml')} />
      </g>
    </g>
    <!-- plunger, drawn mid-press: pushed by hand -->
    <g class="ap-plunger">
      <rect class="o f-body" x="70" y="37" width="40" height="72" />
      <rect class="o f-body" x="63" y="31" width="54" height="6" rx="1.5" />
      <rect class="f-ink" x="66.5" y="108" width="47" height="6" rx="1" />
      <g class="ap-force">
        <path class="force" d="M90 8 L90 26" marker-end={url('mk')} />
        {#if !compact}<text class="note" x="96" y="15">hand</text><text class="note" x="96" y="25.5">press</text>{/if}
      </g>
    </g>
    <path class="o" fill="none" d="M66 66 L66 147 M114 66 L114 147" />
    <path class="h" d="M108 84 L113 84 M108 99 L113 99 M108 114 L113 114 M108 129 L113 129" />
    <!-- flange on the mug, cap with the paper disc -->
    <path class="o f-body" d="M56 146 L124 146 L120 152 L60 152 Z" />
    <rect class="paper" x="68" y="151" width="44" height="2.2" />
    <path class="o f-body" d="M68 153 L112 153 L112 158 Q112 160 110 160 L70 160 Q68 160 68 158 Z" />
    <path class="d holes" d="M71 160 L109 160" />
    {#if !compact}
      {@render co('chamber', 4, 128, 'start', 46, 125, 66, 125)}
      {@render co('paper\ndisc', 130, 156, 'start', 128, 158, 111, 152)}
    {/if}
  {:else}
    <text class="todo" x="100" y="120" text-anchor="middle">{method}</text>
  {/if}
</svg>

<style>
  .bc {
    width: 100%; height: auto; display: block;
    --_ink: var(--ink, #2a1d15); --_note: var(--ink-2, #5b4a3d); --_card: var(--card, #fbf8f3);
    --_water: var(--water, #3f8796); --_water2: var(--water-tint, #8fc1ca);
    --_brew: var(--coffee, #7a4e30); --_brew2: var(--coffee-deep, #3b2214); --_crema: var(--crema-fill, #b77a3c);
    --_grounds: var(--grounds, #8a5a36); --_paper: var(--filter-paper, #fffaf2); --_paperline: var(--filter-line, #d9cdbd);
    --_mesh: var(--mesh, #8f969b); --_flame: var(--flame, #c3873a);
    --_metal: var(--metal, #ddd6cb); --_body: var(--body, #ece6dd); --_wood: var(--wood, #b48a5c);
  }
  /* line weights: 2 px outlines, 1–1.4 px details, 0.8 px hints */
  .o { stroke: var(--_ink); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
  .rim { stroke-width: 3; }
  .d { stroke: var(--_ink); stroke-width: 1.2; stroke-linejoin: round; stroke-linecap: round; }
  .h, .h path { fill: none; stroke: var(--_ink); stroke-width: .8; stroke-opacity: .25; }
  .counter { stroke: var(--_ink); stroke-width: 1.2; stroke-opacity: .35; }
  .f-water { fill: var(--_water); } .f-water2 { fill: var(--_water2); }
  .f-brew { fill: var(--_brew); } .f-brew2 { fill: var(--_brew2); } .f-crema { fill: var(--_crema); }
  .f-grounds { fill: var(--_grounds); }
  .f-gdark { fill: color-mix(in srgb, var(--_grounds) 55%, #000); }
  .f-glight { fill: color-mix(in srgb, var(--_grounds) 55%, #fff); }
  .f-metal { fill: var(--_metal); } .f-body { fill: var(--_body); } .f-wood { fill: var(--_wood); }
  .f-ink { fill: var(--_ink); } .f-card { fill: var(--_card); } .f-flame { fill: var(--_flame); }
  .sc-water { stop-color: var(--_water); } .sc-water2 { stop-color: var(--_water2); } .sc-brew { stop-color: var(--_brew); } .sc-brew2 { stop-color: var(--_brew2); }
  .paper { fill: var(--_paper); stroke: var(--_paperline); stroke-width: 1.2; stroke-linejoin: round; }
  .paper-layer { fill: none; stroke: var(--_paperline); stroke-width: 1; }
  .holes { stroke-dasharray: 3 2; stroke-linecap: butt; }
  .tie { fill: none; stroke: color-mix(in srgb, var(--_wood) 45%, #000); stroke-width: 1.4; stroke-linecap: round; }
  .neck { fill: none; stroke: var(--_ink); stroke-width: 5; stroke-linecap: round; stroke-linejoin: round; }
  .neck-in { fill: none; stroke: var(--_body); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .tube { fill: none; stroke: var(--_ink); stroke-width: 4.6; stroke-linejoin: round; }
  .tube-in { fill: none; stroke: var(--_card); stroke-width: 2.6; stroke-linejoin: round; }
  .coil { fill: none; stroke: var(--_flame); stroke-width: 1.4; stroke-linejoin: round; }
  .spray { fill: none; stroke: var(--_water); stroke-width: 1.2; stroke-linecap: round; stroke-dasharray: 2.4 2; }

  /* the water path: streams are solid liquid, arrows show direction through beds and tubes */
  .st { fill: none; stroke-linecap: round; }
  .run { fill: none; stroke: #fff; stroke-opacity: 0; stroke-linecap: round; stroke-dasharray: 2 7; }
  .halo { fill: none; stroke: var(--_card); stroke-width: 2.8; stroke-opacity: .3; stroke-linecap: round; }
  .pa { fill: none; stroke-width: 1.5; stroke-linecap: round; }
  .pa-w { stroke: var(--_water); }

  .co text { font: 400 9.5px/1 'IBM Plex Mono', 'IBM Plex Mono Fallback', ui-monospace, monospace; fill: var(--_note); }
  .lead { fill: none; stroke: var(--_note); stroke-width: .7; }
  .dot { fill: var(--_note); }
  .todo { font: 400 10px 'IBM Plex Mono', 'IBM Plex Mono Fallback', monospace; fill: var(--_note); }

  .lvl-up, .lvl-dn { transform-box: fill-box; transform-origin: 50% 100%; }

  .f-slurry { fill: color-mix(in srgb, var(--_brew) 80%, #fff); }
  .bag { stroke: var(--_mesh); stroke-width: 1.3; stroke-dasharray: 2.2 1.4; stroke-linejoin: round; }
  .mesh { fill: none; stroke: var(--_mesh); stroke-width: 3; stroke-dasharray: 1.3 .9; }
  .force { fill: none; stroke: var(--_ink); stroke-width: 1.8; stroke-linecap: round; }
  .swirl { fill: none; stroke: var(--_card); stroke-width: 1.3; stroke-opacity: .9; stroke-linecap: round; }
  .note { font: 400 9.5px/1 'IBM Plex Mono', 'IBM Plex Mono Fallback', ui-monospace, monospace; fill: var(--_note); }

  /* phase pieces: the still frame is the default; animations only while playing */
  .fp-clear { transform-box: fill-box; transform-origin: 50% 0; }
  .fp-swirl { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; }
  .cl-cup, .tk-foam, .tk-cup { transform-box: fill-box; transform-origin: 50% 100%; }
  .cb-diff { opacity: .7; transform-box: fill-box; transform-origin: 50% 50%; }
  .cb-hand { transform-origin: 170px 32px; }
  .flame { transform-box: fill-box; transform-origin: 50% 100%; }
  .pa-t { stroke: var(--_water2); }
  .screen { fill: none; stroke: var(--_mesh); stroke-width: 2.2; stroke-dasharray: 2 1.2; }
  .handle { fill: none; stroke: var(--_ink); stroke-width: 5; stroke-linejoin: round; stroke-linecap: round; }
  .sp-lw, .sp-uw, .sp-us, .sp-lb, .es-cup, .ap-cup, .ap-slurry { transform-box: fill-box; transform-origin: 50% 100%; }
  .sp-lb, .sp-dn { opacity: 0; }
  .ap-swirl { opacity: 0; transform-box: fill-box; transform-origin: 50% 50%; }

  @media (prefers-reduced-motion: no-preference) {
    .play .run { stroke-opacity: .65; animation: run .6s linear infinite; }
    .play .pa { stroke-dasharray: 3 2.4; }
    .play .pa, .play .spray { animation: dash .7s linear infinite; }
    .play .spray { animation-name: spray; }
    .play .drop { animation: fall var(--t) linear infinite; animation-delay: calc(var(--k) * -1 * var(--t)); }
    .play .lvl-up { animation: rise var(--loop) ease-in-out infinite; }
    .play .lvl-dn { animation: sink var(--loop) ease-in-out infinite; }
    .play .flame { animation: flicker 1.1s ease-in-out infinite alternate; }
    .play .flame:nth-of-type(2n) { animation-delay: -.5s; }
    .play .fp-plunger { animation: fp-plunge var(--loop) ease-in-out infinite; }
    .play .fp-clear { animation: fp-clear var(--loop) ease-in-out infinite; }
    .play .fp-force { animation: fp-force var(--loop) linear infinite; }
    .play .fp-swirl { animation: fp-swirl var(--loop) linear infinite; }
    .play .cl-dripper { animation: cl-lower var(--loop) ease-in-out infinite; }
    .play .cl-plug { animation: cl-plug var(--loop) ease-in-out infinite; }
    .play .cl-slurry { animation: cl-slurry var(--loop) ease-in-out infinite; }
    .play .cl-flow { animation: cl-flow var(--loop) linear infinite; }
    .play .cl-cup { animation: cl-cup var(--loop) ease-in-out infinite; }
    .play .cb-diff { animation: cb-diff var(--loop) ease-in-out infinite; }
    .play .cb-hand { animation: spin var(--loop) linear infinite; }
    .play .tk-foam { animation: tk-foam var(--loop) ease-in-out infinite; }
    .play .tk-pour { animation: tk-pour var(--loop) linear infinite; }
    .play .tk-cup { animation: tk-cup var(--loop) ease-in-out infinite; }
    .play .sp-lw { animation: sp-lw var(--loop) ease-in-out infinite; }
    .play .sp-uw { animation: sp-uw var(--loop) ease-in-out infinite; }
    .play .sp-us { animation: sp-us var(--loop) ease-in-out infinite; }
    .play .sp-lb { animation: sp-lb var(--loop) ease-in-out infinite; }
    .play .sp-flame { animation: sp-flame var(--loop) linear infinite; }
    .play .sp-up { animation: sp-up var(--loop) linear infinite; }
    .play .sp-dn { animation: sp-dn var(--loop) linear infinite; }
    .play .es-cup { animation: rise var(--loop) ease-in-out infinite; }
    .play .ap-plunger { animation: ap-plunge var(--loop) ease-in-out infinite; }
    .play .ap-slurry { animation: ap-slurry var(--loop) ease-in-out infinite; }
    .play .ap-force { animation: ap-force var(--loop) linear infinite; }
    .play .ap-swirl { animation: fp-swirl var(--loop) linear infinite; }
    .play .ap-flow { animation: ap-flow var(--loop) linear infinite; }
    .play .ap-cup { animation: ap-cup var(--loop) ease-in-out infinite; }
  }
  @keyframes flicker { from { transform: scaleY(.88); } to { transform: scaleY(1.04); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  /* French press, 7 s: steep with the mesh up (0–48 %), press (48–84 %), hold, lift back */
  @keyframes fp-plunge { 0%, 48% { transform: translateY(-39px); } 84%, 94% { transform: translateY(38px); } 100% { transform: translateY(-39px); } }
  @keyframes fp-clear { 0%, 48% { transform: scaleY(.07); } 84%, 94% { transform: scaleY(1.9); } 100% { transform: scaleY(.07); } }
  @keyframes fp-force { 0%, 46% { opacity: 0; } 52%, 84% { opacity: 1; } 90%, 100% { opacity: 0; } }
  @keyframes fp-swirl { 0% { opacity: 0; transform: rotate(0); } 6%, 38% { opacity: 1; } 46%, 100% { opacity: 0; transform: rotate(160deg); } }
  /* Clever, 7 s: steep off the cup with the valve shut (0–48 %), set on the cup, drain (52–92 %) */
  @keyframes cl-lower { 0%, 46% { transform: translateY(-6px); } 52%, 96% { transform: translateY(0); } 100% { transform: translateY(-6px); } }
  @keyframes cl-plug { 0%, 47% { transform: translateY(6px); } 53%, 96% { transform: translateY(0); } 100% { transform: translateY(6px); } }
  @keyframes cl-slurry { 0%, 50% { transform: translateY(-2px); } 90%, 96% { transform: translateY(28px); } 100% { transform: translateY(-2px); } }
  @keyframes cl-flow { 0%, 51% { opacity: 0; } 55%, 88% { opacity: 1; } 93%, 100% { opacity: 0; } }
  @keyframes cl-cup { 0%, 52% { transform: scaleY(.02); } 92%, 96% { transform: scaleY(1.1); } 100% { transform: scaleY(.02); } }
  /* Cold brew, 7 s: the brown slowly spreads from the bag */
  @keyframes cb-diff { 0% { opacity: .08; transform: scale(.5); } 86% { opacity: .95; transform: scale(1.12); } 100% { opacity: .08; transform: scale(.5); } }
  /* Turkish, 6 s: foam climbs (0–55 %), pour (60–88 %) */
  @keyframes tk-foam { 0% { transform: scaleY(.18); } 55%, 90% { transform: scaleY(1); } 100% { transform: scaleY(.18); } }
  @keyframes tk-pour { 0%, 56% { opacity: 0; } 61%, 87% { opacity: 1; } 92%, 100% { opacity: 0; } }
  @keyframes tk-cup { 0%, 60% { transform: scaleY(.35); } 90%, 95% { transform: scaleY(1); } 100% { transform: scaleY(.35); } }
  /* Siphon, 7 s: vapor pushes the water up (0–30 %), steep (30–60 %), heat off and the vacuum draws the brew down (60–92 %) */
  @keyframes sp-lw { 0% { transform: scaleY(5.2); } 30%, 94% { transform: scaleY(1); } 100% { transform: scaleY(5.2); } }
  @keyframes sp-uw { 0% { transform: scaleY(.02); opacity: 1; } 30% { transform: scaleY(1); } 38% { opacity: 1; } 42%, 100% { transform: scaleY(1); opacity: 0; } }
  @keyframes sp-us { 0%, 28% { opacity: 0; transform: scaleY(1); } 38%, 60% { opacity: 1; transform: scaleY(1); } 90% { opacity: 1; transform: scaleY(.1); } 96%, 100% { opacity: 0; transform: scaleY(.1); } }
  @keyframes sp-lb { 0%, 60% { opacity: 0; transform: scaleY(.05); } 62% { opacity: 1; transform: scaleY(.05); } 90%, 95% { opacity: 1; transform: scaleY(1); } 100% { opacity: 0; transform: scaleY(1); } }
  @keyframes sp-flame { 0%, 59% { opacity: 1; } 62%, 95% { opacity: 0; } 100% { opacity: 1; } }
  @keyframes sp-up { 0%, 58% { opacity: 1; } 61%, 97% { opacity: 0; } 100% { opacity: 1; } }
  @keyframes sp-dn { 0%, 61% { opacity: 0; } 64%, 90% { opacity: 1; } 94%, 100% { opacity: 0; } }
  /* AeroPress, 6 s: steep with the plunger just in (0–45 %), press by hand (45–85 %) */
  @keyframes ap-plunge { 0%, 45% { transform: translateY(-28px); } 85%, 94% { transform: translateY(32px); } 100% { transform: translateY(-28px); } }
  @keyframes ap-slurry { 0%, 45% { transform: scaleY(1.757); } 85%, 94% { transform: scaleY(.135); } 100% { transform: scaleY(1.757); } }
  @keyframes ap-force { 0%, 43% { opacity: 0; } 49%, 85% { opacity: 1; } 90%, 100% { opacity: 0; } }
  @keyframes ap-flow { 0%, 46% { opacity: 0; } 50%, 86% { opacity: 1; } 90%, 100% { opacity: 0; } }
  @keyframes ap-cup { 0%, 48% { transform: scaleY(.04); } 88%, 95% { transform: scaleY(1.1); } 100% { transform: scaleY(.04); } }
  @keyframes run { to { stroke-dashoffset: -9; } }
  @keyframes dash { to { stroke-dashoffset: -5.4; } }
  @keyframes spray { to { stroke-dashoffset: -4.4; } }
  @keyframes fall {
    0% { transform: translateY(0); opacity: 0; }
    12%, 86% { opacity: 1; }
    100% { transform: translateY(var(--fall)); opacity: 0; }
  }
  @keyframes rise { 0% { transform: scaleY(.45); } 88% { transform: scaleY(1.05); } 100% { transform: scaleY(.45); } }
  @keyframes sink { 0% { transform: scaleY(1.15); } 88% { transform: scaleY(.6); } 100% { transform: scaleY(1.15); } }
</style>
