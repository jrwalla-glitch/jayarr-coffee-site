<script lang="ts">
  import { onMount } from 'svelte';
  import { MONTHS_LONG, harvestingIn } from '../../lib/coffee/origins.ts';
  import GalleryMini from './art/GalleryMini.svelte';

  // The Coffee Collection: three framed paintings on a gallery wall, each a live miniature of its
  // piece, hung under a picture light with a brass plate and a short wall label (DECISIONS #16).
  let month = $state(10);
  let lit = $state<string | null>(null);
  onMount(() => { month = new Date().getMonth() + 1; });
  let now = $derived(harvestingIn(month));

  const PIECES = [
    { id: 'origins', href: '/explore/origins/', title: 'The Coffee Origins', sub: 'An interactive world map', mat: '#e8e1d4' },
    { id: 'methods', href: '/explore/methods/', title: 'The Brewing Constellations', sub: 'An interactive star chart', mat: '#2a3040' },
    { id: 'flavors', href: '/explore/flavors/', title: 'The Flavor Bloom', sub: 'A botanical tasting guide', mat: '#dde4d6' },
  ];
</script>

<div class="wall">
  {#each PIECES as p, i (p.id)}
    <figure class="piece" class:centre={i === 1} class:dim={lit !== null && lit !== p.id} class:lit={lit === p.id}>
      <div class="hang">
      <span class="lamp" aria-hidden="true"></span>
      <a class="frame" href={p.href} style="--mat: {p.mat}" aria-label="{p.title}: {p.sub}"
        onmouseenter={() => (lit = p.id)} onmouseleave={() => (lit = null)} onfocus={() => (lit = p.id)} onblur={() => (lit = null)}>
        <GalleryMini id={p.id as 'origins' | 'methods' | 'flavors'} month={month} />
        <span class="glow" aria-hidden="true"></span>
      </a>
      </div>
      <figcaption>
        <a class="plate" href={p.href} tabindex="-1" aria-hidden="true"><b>{p.title}</b><small>{p.sub}</small></a>
        <div class="label">
          {#if p.id === 'origins'}
            <p>When and where each origin is harvested, how high it grows and how its coffees are described.</p>
            <p class="now"><span>In {MONTHS_LONG[month - 1]}:</span> {now.slice(0, 4).map((o) => o.name).join(', ')}{now.length > 4 ? ` and ${now.length - 4} more` : ''} are harvesting. <a href="/explore/origins/">See who's harvesting now →</a></p>
          {:else if p.id === 'methods'}
            <p>Thirteen brewers as stars. Rearrange the sky by filter, pressure or time to see how they really differ.</p>
            <p class="now"><a href="/explore/methods/?m=v60&vs=french-press">Compare a V60 and a French press →</a></p>
          {:else}
            <p>Tasting notes as a flower: what each one is like, how to train your nose on it, and how often roasters use it.</p>
            <p class="now"><a href="/explore/flavors/?note=blueberry">Start with blueberry →</a></p>
          {/if}
        </div>
      </figcaption>
    </figure>
  {/each}
</div>


<style>
  /* One hang line: frames centre on the same line, captions start on the same line below. */
  .wall { display: grid; grid-template-columns: 1fr 1.18fr 1fr; grid-template-rows: auto auto; column-gap: 44px; padding: 40px 0 6px; }
  .piece { margin: 0; display: grid; grid-row: span 2; grid-template-rows: subgrid; justify-items: center; transition: opacity .4s ease, transform .4s ease; }
  .piece.dim { opacity: .66; }
  .hang { position: relative; width: 100%; align-self: center; }
  /* A brass picture light fixed to the top of the frame. */
  .lamp { position: absolute; z-index: 2; top: -12px; left: 50%; width: 34%; height: 9px; transform: translateX(-50%); border-radius: 2px 2px 7px 7px; background: linear-gradient(180deg, #e3c77f, #b48a3a 55%, #7d6227); box-shadow: 0 2px 3px rgba(0, 0, 0, .3); }
  .lamp::before { content: ''; position: absolute; left: 50%; top: 7px; width: 4px; height: 12px; background: #7d6227; transform: translateX(-50%); }
  .frame {
    position: relative; z-index: 1; display: block; width: 100%; background: var(--mat); padding: 10px;
    border: 10px solid transparent; border-image: linear-gradient(145deg, #4a3526 0%, #22170f 22%, #3b2a1d 48%, #1d140e 70%, #4a3526 100%) 1;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, .35), 0 24px 40px -22px rgba(42, 29, 21, .6), inset 0 0 0 1px rgba(214, 170, 92, .75), inset 0 0 0 3px rgba(42, 29, 21, .5);
    transition: transform .4s ease, box-shadow .4s ease;
  }
  .glow { position: absolute; inset: 10px; pointer-events: none; background: radial-gradient(70% 60% at 50% -8%, rgba(255, 238, 200, .42), rgba(255, 238, 200, 0) 70%); opacity: .7; transition: opacity .4s; }
  .piece.lit .glow { opacity: 1; }
  .piece.lit .frame { transform: translateY(-4px); box-shadow: 0 1px 0 1px rgba(0, 0, 0, .35), 0 32px 48px -24px rgba(42, 29, 21, .65), 0 0 34px rgba(193, 122, 58, .16), inset 0 0 0 1px rgba(214, 170, 92, .75), inset 0 0 0 3px rgba(42, 29, 21, .5); }
  .frame:focus-visible { outline: 3px solid #8f5d22; outline-offset: 6px; }
  figcaption { display: flex; flex-direction: column; align-items: center; width: 100%; align-self: start; }
  .plate { display: block; margin-top: 18px; padding: 7px 24px 7px; border-radius: 2px; text-align: center; text-decoration: none;
    background: linear-gradient(180deg, #e3c77f 0%, #c9a24f 18%, #b48a3a 52%, #a07a32 78%, #c39b4c 100%); border: 1px solid #7d6227;
    box-shadow: 0 2px 5px rgba(42, 29, 21, .28), inset 0 1px 0 rgba(255, 246, 214, .7), inset 0 -1px 0 rgba(80, 60, 20, .35); }
  .plate b { display: block; font: 400 19px/1.25 'Instrument Serif', Georgia, serif; color: #2b1f12; text-shadow: 0 1px 0 rgba(255, 240, 200, .45); }
  .plate small { display: block; font: 600 10.5px/1.4 'IBM Plex Mono', monospace; letter-spacing: .13em; text-transform: uppercase; color: #2b1f12; text-shadow: 0 1px 0 rgba(255, 240, 200, .4); }
  .label { margin-top: 14px; max-width: 34ch; text-align: center; font: 400 14.5px/1.5 'IBM Plex Sans', sans-serif; color: #5b4a3d; }
  .label p { margin: 0 0 6px; }
  .now { font-size: 14px; }
  .now span { font: 500 11px 'IBM Plex Mono', monospace; letter-spacing: .1em; text-transform: uppercase; color: #8f5d22; }
  .now a, .label a { color: #7a4e30; font-weight: 600; text-underline-offset: 3px; }

  @media (max-width: 900px) {
    .wall { grid-template-columns: 1fr; grid-template-rows: none; row-gap: 52px; max-width: 520px; margin: 0 auto; }
    .piece { grid-row: auto; grid-template-rows: auto auto; }
    .piece.dim { opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .piece, .frame, .glow { transition: none; }
  }
</style>
