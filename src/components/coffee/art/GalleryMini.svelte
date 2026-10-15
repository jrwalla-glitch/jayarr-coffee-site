<script lang="ts">
  // The three Explore paintings in miniature, as they hang in the gallery: the antique map with
  // this month's harvest, the navy star chart, the botanical bloom. Used on the gallery wall and on
  // the toolkit's Explore cards, so a piece looks the same wherever it's shown.
  import world from '../../../data/world-mini.json';
  import { ORIGINS, harvestingIn, project } from '../../../lib/coffee/origins.ts';
  import { FAMILIES } from '../../../lib/coffee/flavors.ts';
  import { ATLAS, CONTACT } from '../../../lib/coffee/methodAtlas.ts';
  import type { Contact } from '../../../lib/coffee/methodAtlas.ts';
  interface Props { id: 'origins' | 'methods' | 'flavors'; month?: number; names?: boolean }
  let { id, month = 10, names = true }: Props = $props();
  let now = $derived(harvestingIn(month));
  const pid = $props.id();
  // Origins: the atlas's own map, simplified, at 0.3 scale and centred in the frame; harvest dots on top.
  const MAP_Y = (180 - 367 * 0.3) / 2;
  const dot = (lat: number, lon: number) => { const [x, y] = project(lat, lon); return [x * 0.3, y * 0.3 + MAP_Y]; };
  const LETTERED: Record<string, string> = { sweet: 'caramel', floral: 'jasmine', fruity: 'blueberry', 'nutty-cocoa': 'cocoa', 'sour-fermented': 'lemon' };

  // Constellations: the contact families as three small constellations, each hung from a hub star.
  const GROUPS: Contact[] = ['percolation', 'steep-drain', 'immersion'];
  const stars = GROUPS.flatMap((g, gi) => {
    const ms = ATLAS.filter((m) => m.contact === g).sort((a, b) => a.timeS[0] - b.timeS[0]);
    const cx = 52 + gi * 98;
    return ms.map((m, j) => ({ id: m.id, g: gi, x: cx + 20 * Math.sin(j * 1.9 + gi + 0.6) * (ms.length > 1 ? 1 : 0), y: ms.length === 1 ? 108 : 66 + (j * 92) / Math.max(1, ms.length - 1) }));
  });
  const field = Array.from({ length: 46 }, (_, i) => { const a = Math.sin(i * 12.9898) * 43758.5453, b = Math.sin(i * 78.233) * 12345.6789; return { x: (a - Math.floor(a)) * 300, y: (b - Math.floor(b)) * 180, r: 0.3 + (i % 4) * 0.18 }; });

  // Bloom: eight watercolour petals and the stem with its two leaves.
  const ANG = [-140, -100, -60, -20, 20, 60, 100, 140];
  const petal = (len: number, w: number) => `M0 -9 C ${w} ${-9 - len * 0.28}, ${w * 1.08} ${-len * 0.78}, 0 ${-len} C ${-w * 1.08} ${-len * 0.78}, ${-w} ${-9 - len * 0.28}, 0 -9 Z`;

</script>

        {#if id === 'origins'}
          <svg viewBox="0 0 300 180" class="art" aria-hidden="true">
            <defs>
              <filter id="eg-grain-{pid}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="5" result="n" /><feColorMatrix type="saturate" values="0" in="n" result="g" /><feComponentTransfer in="g" result="f"><feFuncR type="linear" slope=".12" intercept=".44" /><feFuncG type="linear" slope=".12" intercept=".44" /><feFuncB type="linear" slope=".12" intercept=".44" /></feComponentTransfer><feBlend in="SourceGraphic" in2="f" mode="soft-light" /></filter>
              <radialGradient id="eg-vig-{pid}" cx=".5" cy=".5" r=".7"><stop offset=".6" stop-color="#5a5040" stop-opacity="0" /><stop offset="1" stop-color="#5a5040" stop-opacity=".25" /></radialGradient>
            </defs>
            <rect width="300" height="180" fill="#ccd0cc" filter="url(#eg-grain-{pid})" />
            <rect width="300" height="180" fill="#f1e2c4" opacity=".2" />
            {#each [116.6, 183.5, 250.4] as y (y)}<line x1="0" x2="300" y1={y * 0.3 + MAP_Y} y2={y * 0.3 + MAP_Y} stroke="#8b9ba8" stroke-width=".4" stroke-dasharray="3 4" opacity=".55" />{/each}
            <g transform="translate(0 {MAP_Y}) scale(.3)">
              <path d={world.land} fill="#e4ddd0" stroke="#b3a68f" stroke-width="1.2" stroke-opacity=".55" />
              {#each Object.values(world.coffee) as d, k (k)}<path d={d} fill="#ddc9a8" stroke="#b3a68f" stroke-width="1.2" stroke-opacity=".55" />{/each}
            </g>
            {#each ORIGINS as o (o.id)}
              {@const [x, y] = dot(o.lat, o.lon)}
              {@const on = now.some((n) => n.id === o.id)}
              <circle cx={x} cy={y} r={on ? 2.4 : 1.7} fill={on ? '#9a5420' : '#fbf6ee'} stroke="#2a1d15" stroke-width=".55" class:pulse={on} style="animation-delay: {(x % 7) * 0.3}s" />
            {/each}
            <g transform="translate(274 26)" opacity=".6"><circle r="9" fill="none" stroke="#5b4a3d" stroke-width=".5" /><polygon points="0,-8 -1.3,-2.4 0,-3.2 1.3,-2.4" fill="#2a1d15" /><polygon points="0,8 -1.3,2.4 0,3.2 1.3,2.4" fill="#a6896a" /></g>
            <rect width="300" height="180" fill="url(#eg-vig-{pid})" />
          </svg>
        {:else if id === 'methods'}
          <svg viewBox="0 0 300 180" class="art" aria-hidden="true">
            <defs><linearGradient id="eg-sky-{pid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1525" /><stop offset=".6" stop-color="#12213a" /><stop offset="1" stop-color="#1a2a3d" /></linearGradient></defs>
            <rect width="300" height="180" fill="url(#eg-sky-{pid})" />
            {#each field as f, k (k)}<circle cx={f.x} cy={f.y} r={f.r} fill="#c8d0e0" opacity=".45" class="tw" style="animation-delay: {k * 0.37}s" />{/each}
            {#each GROUPS as g, gi (g)}
              {@const hx = 52 + gi * 98}
              {@const ss = stars.filter((s) => s.g === gi)}
              <polyline points={[`${hx},34`, ...ss.map((s) => `${s.x},${s.y}`)].join(' ')} fill="none" stroke="#c9a84e" stroke-width=".8" opacity=".6" class="chain" />
              <circle cx={hx} cy="34" r="7" fill="#d4a44c" opacity=".12" /><circle cx={hx} cy="34" r="3.2" fill="none" stroke="#e8b85c" stroke-width="1.1" />
              <path d="M{hx - 6} 34 H{hx + 6} M{hx} 28 V40" stroke="#d4a44c" stroke-width=".5" opacity=".6" />
              <text x={hx} y="20" text-anchor="middle" class="hub">{CONTACT[g].label.toUpperCase()}</text>
              {#each ss as s (s.id)}
                <circle cx={s.x} cy={s.y} r="5" fill="#e8c36a" opacity=".12" /><circle cx={s.x} cy={s.y} r="2.2" fill="#e8c36a" />
                {#if names && (s.id === 'v60' || s.id === 'french-press')}<text x={s.x + 5} y={s.y + 2.5} class="sname">{s.id === 'v60' ? 'V60' : 'French press'}</text>{/if}
              {/each}
            {/each}
          </svg>
        {:else}
          <svg viewBox="0 0 300 180" class="art" aria-hidden="true">
            <defs>
              {#each FAMILIES as f (f.id)}
                <radialGradient id="eg-{f.id}-{pid}" cx=".5" cy=".62" r=".62"><stop offset="0" stop-color={f.colour} /><stop offset=".6" stop-color={f.colour} stop-opacity=".88" /><stop offset="1" stop-color={f.colour} stop-opacity=".35" /></radialGradient>
              {/each}
              <filter id="eg-soft-{pid}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation=".7" /></filter>
            </defs>
            <rect width="300" height="180" fill="#dde4d6" />
            <path d="M150 108 C 147 130, 153 156, 149 180" fill="none" stroke="#6f7a52" stroke-width="1.8" opacity=".85" />
            <g transform="translate(150 150) rotate(-62)"><path d={petal(30, 10)} fill="#b9b5a6" opacity=".75" filter="url(#eg-soft-{pid})" /></g>
            <g transform="translate(151 165) rotate(62)"><path d={petal(30, 10)} fill="#b9b5a6" opacity=".75" filter="url(#eg-soft-{pid})" /></g>
            <g transform="translate(150 98) scale(1.28) translate(-150 -84)">
              {#each FAMILIES as f, k (f.id)}
                <g transform="translate(150 84) rotate({ANG[k]})" class="petal" style="animation-delay: {k * 0.12}s"><path d={petal(62, 21)} fill="url(#eg-{f.id}-{pid})" filter="url(#eg-soft-{pid})" /><path d={petal(62, 21)} fill="none" stroke="#2a1d15" stroke-opacity=".18" stroke-width=".6" /></g>
              {/each}
              <circle cx="150" cy="84" r="11" fill="#f6f1e8" stroke="#c17a3a" stroke-width="1" />
              <g transform="translate(150 84) rotate(-28)"><ellipse rx="4.2" ry="5.8" fill="#7a4e30" /><path d="M0 -4.8 C 1.8 -2, -1.8 2, 0 4.8" fill="none" stroke="#f6f1e8" stroke-width=".9" /></g>
            </g>
            {#each FAMILIES as f, k (f.id)}
              {#if names && LETTERED[f.id]}
                {@const a = (ANG[k] * Math.PI) / 180}
                <text x={150 + Math.sin(a) * 92} y={98 - Math.cos(a) * 88 + 3} text-anchor={Math.sin(a) > 0.2 ? 'start' : Math.sin(a) < -0.2 ? 'end' : 'middle'} class="lettered">{LETTERED[f.id]}</text>
              {/if}
            {/each}
          </svg>
        {/if}

<style>
  .art { display: block; width: 100%; height: auto; }
  .hub { font: 600 6.5px 'IBM Plex Mono', monospace; letter-spacing: .2em; fill: #d4a44c; }
  .sname { font: 600 7px 'IBM Plex Sans', sans-serif; fill: #e8dccb; }
  .lettered { font: italic 400 9.5px 'Instrument Serif', Georgia, serif; fill: #3d4a36; }
  .pulse { transform-box: fill-box; transform-origin: center; }
  :global(.lit) .pulse { animation: pulse 2.2s ease-in-out infinite; }
  @keyframes pulse { 50% { transform: scale(1.6); } }
  :global(.lit) .tw { animation: tw 3s ease-in-out infinite; }
  @keyframes tw { 50% { opacity: .1; } }
  :global(.lit) .chain { stroke-dasharray: 300; animation: draw 2.4s ease-out; }
  @keyframes draw { from { stroke-dashoffset: 300; } to { stroke-dashoffset: 0; } }
  :global(.lit) .petal path { animation: open 1.6s ease-in-out infinite alternate; transform-origin: 0 0; }
  @keyframes open { to { transform: scale(1.07); } }
  @media (prefers-reduced-motion: reduce) { :global(.lit) .pulse, :global(.lit) .tw, :global(.lit) .chain, :global(.lit) .petal path { animation: none; } }
</style>
