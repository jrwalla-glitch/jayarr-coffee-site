<script>
  let isMobile = $state(false);
  let hoveredDrawer = $state(null);
  let hoveredProp = $state(null);
  let isZooming = $state(false);

  const drawers = [
    { id: 'fix-my-coffee',  name: 'Fix My Coffee',   desc: 'Diagnose what went wrong with your brew',     href: '/tools/fix-my-coffee/' },
    { id: 'caffeine',       name: 'Caffeine Calc',   desc: 'Track daily caffeine intake by method',       href: '/tools/caffeine/' },
    { id: 'drink-builder',  name: 'Drink Builder',   desc: 'Build espresso drinks with the right ratios', href: '/tools/drink-builder/' },
    { id: 'nespresso-pods', name: 'Nespresso Pods',  desc: 'Explore every Nespresso capsule',             href: '/tools/nespresso-pods/' },
  ];

  const props = [
    { id: 'beanbag',     name: 'Freshness Tracker', desc: 'Know when your beans are at their best',  href: '/tools/freshness/',         asset: '/assets/workshop/beanbag.svg',     alt: 'Coffee bean bag' },
    { id: 'frenchpress', name: 'Brew Ratio',        desc: 'Dial in coffee-to-water ratio',           href: '/tools/brew-ratio/',        asset: '/assets/workshop/frenchpress.svg', alt: 'French press' },
    { id: 'grinder',     name: 'Grind Guide',       desc: 'Match grind size to your brew method',    href: '/tools/grind-guide/',       asset: '/assets/workshop/grinder.svg',     alt: 'Eureka Mignon Specialita grinder' },
    { id: 'espresso',    name: 'Espresso Machines', desc: 'Compare machines, flip through specs',    href: '/tools/espresso-machines/', asset: '/assets/workshop/gaggia.svg',      alt: 'Gaggia Classic Pro espresso machine' },
  ];

  let activeLabel = $derived.by(() => {
    if (hoveredDrawer) {
      const d = drawers.find(x => x.id === hoveredDrawer);
      if (d) return d.desc;
    }
    if (hoveredProp) {
      const p = props.find(x => x.id === hoveredProp);
      if (p) return p.desc;
    }
    return 'Click any item to explore — hover for details';
  });

  $effect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 1099px)');
    isMobile = mq.matches;
    const handler = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  function handlePosterClick(e) {
    e.preventDefault();
    if (isZooming) return;
    isZooming = true;
    setTimeout(() => {
      window.location.href = '/tools/brew-dial-in/';
    }, 450);
  }
</script>

{#if isMobile}
  <!-- =========================================================== -->
  <!-- MOBILE STACKED LAYOUT (Option D)                             -->
  <!-- Hero poster → 2×2 prop grid → full-width cabinet             -->
  <!-- =========================================================== -->
  <div class="mobile-scene" class:is-zooming={isZooming}>
    <a
      href="/tools/brew-dial-in/"
      class="mobile-poster"
      onclick={handlePosterClick}
      title="Open the Extraction Apparatus"
      style="padding-top: 1rem;"
    >
      <div class="poster-frame-m">
        <div class="poster-mat-m">
          <img src="/assets/brew-dial-in/apparatus-bg.svg" alt="The Extraction Apparatus — 329 specialty coffees, 9 brew methods, 2,961 recipes" class="poster-img-m" />
        </div>
      </div>
      <div class="poster-label-m">The Extraction Apparatus</div>
      <div class="poster-sub-m">329 beans · 9 brewers · 2,961 recipes</div>
      <div class="poster-cta-m">Tap to explore &rarr;</div>
    </a>

    <div class="mobile-counter">
      <div class="mobile-overline">Other Tools</div>

      <!-- 2×2 prop grid -->
      <div class="prop-grid">
        {#each props as prop}
          <a href={prop.href} class="prop-card">
            <div class="prop-card-img-wrap">
              <img src={prop.asset} alt={prop.alt} class="prop-card-img" />
            </div>
            <div class="prop-card-label">{prop.name}</div>
            <div class="prop-card-desc">{prop.desc}</div>
          </a>
        {/each}
      </div>

      <!-- Cabinet: 4 stacked drawers, full width -->
      <div class="mobile-cabinet">
        <div class="cabinet-handle">
          <div class="handle-strap"></div>
          <div class="handle-rivet handle-rivet--left"></div>
          <div class="handle-rivet handle-rivet--right"></div>
        </div>
        <div class="corner-bracket corner-bracket--tl"></div>
        <div class="corner-bracket corner-bracket--tr"></div>
        <div class="corner-bracket corner-bracket--bl"></div>
        <div class="corner-bracket corner-bracket--br"></div>
        <div class="cabinet-molding"></div>
        <div class="cabinet-interior">
          <div class="drawer-grid mobile-drawer-grid">
            {#each drawers as drawer}
              <a
                href={drawer.href}
                class="drawer"
                class:drawer--hovered={hoveredDrawer === drawer.id}
                onmouseenter={() => hoveredDrawer = drawer.id}
                onmouseleave={() => hoveredDrawer = null}
              >
                <div class="drawer-face">
                  <div class="nameplate"><span class="nameplate-text">{drawer.name}</span></div>
                  <div class="knob-wrap"><div class="knob-ring"></div><div class="knob"></div></div>
                </div>
              </a>
            {/each}
          </div>
        </div>
        <div class="cabinet-molding"></div>
      </div>
    </div>
  </div>
{:else}
  <!-- =========================================================== -->
  <!-- DESKTOP DIORAMA                                               -->
  <!-- Wall + framed apparatus poster + walnut counter + props      -->
  <!-- =========================================================== -->
  <div class="scene-wrap" class:is-zooming={isZooming}>
    <!-- WALL -->
    <div class="wall">
      <a
        href="/tools/brew-dial-in/"
        class="poster-frame"
        onclick={handlePosterClick}
        title="Open the Extraction Apparatus"
      >
        <div class="poster-mat">
          <img src="/assets/brew-dial-in/apparatus-bg.svg" alt="The Extraction Apparatus — 329 specialty coffees, 9 brew methods, 2,961 recipes" class="poster-img" />
        </div>
        <div class="poster-label">The Extraction Apparatus</div>
        <div class="poster-sub">329 beans · 9 brewers · 2,961 recipes — click to explore</div>
      </a>
    </div>

    <!-- COUNTER -->
    <div class="counter">
      <a
        href={props[0].href}
        class="prop prop--beanbag"
        onmouseenter={() => hoveredProp = props[0].id}
        onmouseleave={() => hoveredProp = null}
      >
        <img src={props[0].asset} alt={props[0].alt} />
        <div class="prop-tooltip">{props[0].name}</div>
      </a>

      <div class="prop prop--cabinet">
        <div class="cabinet">
          <div class="cabinet-handle">
            <div class="handle-strap"></div>
            <div class="handle-rivet handle-rivet--left"></div>
            <div class="handle-rivet handle-rivet--right"></div>
          </div>
          <div class="corner-bracket corner-bracket--tl"></div>
          <div class="corner-bracket corner-bracket--tr"></div>
          <div class="corner-bracket corner-bracket--bl"></div>
          <div class="corner-bracket corner-bracket--br"></div>
          <div class="cabinet-molding"></div>
          <div class="cabinet-interior">
            <div class="drawer-grid">
              {#each drawers as drawer}
                <a
                  href={drawer.href}
                  class="drawer"
                  class:drawer--hovered={hoveredDrawer === drawer.id}
                  onmouseenter={() => hoveredDrawer = drawer.id}
                  onmouseleave={() => hoveredDrawer = null}
                >
                  <div class="drawer-face">
                    <div class="nameplate"><span class="nameplate-text">{drawer.name}</span></div>
                    <div class="knob-wrap"><div class="knob-ring"></div><div class="knob"></div></div>
                  </div>
                </a>
              {/each}
            </div>
          </div>
          <div class="cabinet-molding"></div>
        </div>
      </div>

      <a
        href={props[2].href}
        class="prop prop--grinder"
        onmouseenter={() => hoveredProp = props[2].id}
        onmouseleave={() => hoveredProp = null}
      >
        <img src={props[2].asset} alt={props[2].alt} />
        <div class="prop-tooltip">{props[2].name}</div>
      </a>

      <a
        href={props[1].href}
        class="prop prop--frenchpress"
        onmouseenter={() => hoveredProp = props[1].id}
        onmouseleave={() => hoveredProp = null}
      >
        <img src={props[1].asset} alt={props[1].alt} />
        <div class="prop-tooltip">{props[1].name}</div>
      </a>

      <a
        href={props[3].href}
        class="prop prop--espresso"
        onmouseenter={() => hoveredProp = props[3].id}
        onmouseleave={() => hoveredProp = null}
      >
        <img src={props[3].asset} alt={props[3].alt} />
        <div class="prop-tooltip">{props[3].name}</div>
      </a>

      <!-- Scattered beans -->
      <div class="bean-scatter" style="left: 180px; bottom: 132px; transform: rotate(-30deg);"></div>
      <div class="bean-scatter" style="left: 200px; bottom: 128px; transform: rotate(20deg);"></div>
      <div class="bean-scatter" style="left: 490px; bottom: 130px; transform: rotate(-45deg);"></div>
      <div class="bean-scatter" style="left: 660px; bottom: 136px; transform: rotate(15deg);"></div>
      <div class="bean-scatter" style="left: 685px; bottom: 128px; transform: rotate(-55deg); width: 12px; height: 8px;"></div>
      <div class="bean-scatter" style="left: 710px; bottom: 134px; transform: rotate(35deg);"></div>
      <div class="bean-scatter" style="left: 640px; bottom: 126px; transform: rotate(-20deg); width: 12px; height: 8px;"></div>
      <div class="bean-scatter" style="left: 740px; bottom: 138px; transform: rotate(50deg);"></div>
    </div>
  </div>

  <p class="scene-hint" class:scene-hint--active={hoveredDrawer || hoveredProp}>{activeLabel}</p>
{/if}

<style>
  /* =========================================================================
     SHARED (both layouts use these)
     ========================================================================= */

  /* Walnut cabinet hardware — shared between desktop cabinet and mobile cabinet */
  .cabinet-handle { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); width: 90px; height: 26px; z-index: 10; }
  .handle-strap {
    position: absolute; top: 2px; left: 10px; right: 10px; height: 16px;
    background: linear-gradient(180deg, #6B4A3A 0%, #5C3D2E 30%, #4A3020 60%, #3D2518 100%);
    border-radius: 9px 9px 0 0; border: 1px solid rgba(0,0,0,0.4); border-bottom: none;
    box-shadow: inset 0 2px 0 rgba(255,255,255,0.1), 0 -3px 6px rgba(0,0,0,0.2);
  }
  .handle-rivet {
    position: absolute; bottom: 2px; width: 9px; height: 9px; border-radius: 50%;
    background: radial-gradient(circle at 38% 32%, #D4944F 0%, #C17A3A 45%, #8B5A28 100%);
    box-shadow: 0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25);
  }
  .handle-rivet--left { left: 12px; }
  .handle-rivet--right { right: 12px; }

  .corner-bracket { position: absolute; width: 14px; height: 14px; z-index: 3; }
  .corner-bracket::before, .corner-bracket::after {
    content: ''; position: absolute;
    background: linear-gradient(180deg, #D4944F 0%, #C17A3A 50%, #A66830 100%); border-radius: 1px;
  }
  .corner-bracket::before { height: 2.5px; width: 12px; }
  .corner-bracket::after  { width: 2.5px; height: 12px; }
  .corner-bracket--tl { top: 4px;    left: 4px;  } .corner-bracket--tl::before { top: 0;    left: 0;  } .corner-bracket--tl::after { top: 0;    left: 0;  }
  .corner-bracket--tr { top: 4px;    right: 4px; } .corner-bracket--tr::before { top: 0;    right: 0; } .corner-bracket--tr::after { top: 0;    right: 0; }
  .corner-bracket--bl { bottom: 4px; left: 4px;  } .corner-bracket--bl::before { bottom: 0; left: 0;  } .corner-bracket--bl::after { bottom: 0; left: 0;  }
  .corner-bracket--br { bottom: 4px; right: 4px; } .corner-bracket--br::before { bottom: 0; right: 0; } .corner-bracket--br::after { bottom: 0; right: 0; }

  .cabinet-molding {
    height: 8px; margin: 0 -2px;
    background: linear-gradient(180deg, #6B4E3D 0%, #5C3D2E 20%, #4A3528 50%, #3D2B1F 100%);
    border-radius: 2px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2), 0 2px 3px rgba(0,0,0,0.15);
  }
  .cabinet-interior {
    background: #100C09; margin: 4px 0; border-radius: 3px; padding: 6px;
    box-shadow: inset 0 3px 10px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,0,0,0.4);
  }
  .drawer-grid { display: grid; grid-template-columns: 1fr; gap: 5px; }
  .drawer { display: block; text-decoration: none; outline: none; }
  .drawer:focus-visible .drawer-face { outline: 2px solid #C17A3A; outline-offset: 2px; }
  .drawer-face {
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
    padding: 8px 8px 6px; border-radius: 3px; cursor: pointer;
    background:
      repeating-linear-gradient(88deg, transparent, transparent 5px, rgba(0,0,0,0.05) 5px, rgba(0,0,0,0.05) 6px),
      linear-gradient(180deg, #8A6E58 0%, #7A5E4A 30%, #6B4E3D 70%, #7A5E4A 100%);
    border-top: 1px solid rgba(255,255,255,0.14); border-bottom: 2px solid rgba(0,0,0,0.3);
    box-shadow: 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease;
  }
  .drawer:hover .drawer-face,
  .drawer.drawer--hovered .drawer-face {
    transform: translateX(-8px);
    box-shadow: 8px 3px 14px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.14);
  }
  .nameplate {
    padding: 3px 14px; border-radius: 1.5px;
    background: linear-gradient(180deg, #D4944F 0%, #C17A3A 30%, #B07030 60%, #C17A3A 85%, #D4944F 100%);
    border: 1px solid rgba(0,0,0,0.15);
    box-shadow: 0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: box-shadow 0.3s ease;
  }
  .drawer:hover .nameplate,
  .drawer.drawer--hovered .nameplate {
    box-shadow: 0 1px 3px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25), 0 0 14px rgba(193,122,58,0.4);
  }
  .nameplate-text {
    font-family: 'Playfair Display', Georgia, serif; font-size: 7px; font-weight: 700;
    color: #1A1210; letter-spacing: 0.05em; text-transform: uppercase;
    text-shadow: 0 1px 0 rgba(255,255,255,0.15); white-space: nowrap;
  }
  .knob-wrap { position: relative; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }
  .knob-ring { position: absolute; width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid #A66830; box-shadow: 0 1px 2px rgba(0,0,0,0.3); }
  .knob {
    width: 9px; height: 9px; border-radius: 50%;
    background: radial-gradient(circle at 36% 30%, #E0A860 0%, #D4944F 30%, #C17A3A 55%, #8B5A28 100%);
    box-shadow: 0 1px 3px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3);
    transition: box-shadow 0.3s ease;
  }
  .drawer:hover .knob,
  .drawer.drawer--hovered .knob {
    box-shadow: 0 1px 3px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 8px rgba(193,122,58,0.5);
  }

  /* =========================================================================
     DESKTOP DIORAMA
     ========================================================================= */

  .scene-wrap {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    transition: opacity 0.45s ease;
  }
  .scene-wrap.is-zooming { overflow: visible; }

  /* Wall */
  .wall {
    position: relative;
    height: 340px;
    background:
      radial-gradient(ellipse 700px 400px at 50% 60%, rgba(193,122,58,0.07) 0%, transparent 65%),
      repeating-linear-gradient(92deg, transparent, transparent 3px, rgba(139,94,40,0.012) 3px, rgba(139,94,40,0.012) 4px),
      linear-gradient(180deg, #F5EFE3 0%, #F0E8D8 55%, #E8DDC6 100%);
    transition: opacity 0.4s ease;
  }
  .scene-wrap.is-zooming .wall { opacity: 0.15; }

  .scene-header { position: absolute; top: 0; left: 0; right: 0; text-align: center; padding: 12px; z-index: 10; transition: opacity 0.3s ease; }
  .scene-header-overline { font-size: 9px; color: #C17A3A; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 600; }
  .scene-wrap.is-zooming .scene-header { opacity: 0; }

  /* Framed apparatus poster (desktop) */
  .poster-frame {
    position: absolute;
    left: 50%; top: 30px;
    transform: translateX(-50%);
    width: 560px; padding: 14px;
    border-radius: 4px;
    cursor: zoom-in;
    text-decoration: none;
    display: block;
    z-index: 1;
    background:
      repeating-linear-gradient(91deg, transparent, transparent 5px, rgba(0,0,0,0.06) 5px, rgba(0,0,0,0.06) 6px),
      linear-gradient(180deg, #4E3829 0%, #3D2B1F 35%, #4A3425 65%, #3D2B1F 100%);
    box-shadow:
      0 18px 40px rgba(0,0,0,0.22),
      0 8px 16px rgba(0,0,0,0.16),
      inset 0 1px 0 rgba(255,255,255,0.12),
      inset 0 -1px 0 rgba(0,0,0,0.3);
    transition: transform 0.45s cubic-bezier(0.4, 0.0, 0.2, 1), box-shadow 0.45s ease;
  }
  .poster-frame:hover {
    transform: translateX(-50%) translateY(-4px);
    box-shadow: 0 28px 50px rgba(0,0,0,0.28), 0 12px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12);
  }
  .scene-wrap.is-zooming .poster-frame {
    transform: translateX(-50%) scale(1.55);
    z-index: 100;
    box-shadow: 0 40px 80px rgba(0,0,0,0.35), 0 20px 40px rgba(0,0,0,0.25);
  }
  .poster-mat {
    background: #FAF4E4;
    padding: 8px;
    border-radius: 2px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.15), inset 0 -1px 1px rgba(0,0,0,0.08);
  }
  .poster-img { display: block; width: 100%; height: auto; border-radius: 1px; }
  .poster-label {
    text-align: center; margin-top: 10px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 13px; font-weight: 700; color: #FAF4E4;
    letter-spacing: 0.06em;
  }
  .poster-sub { text-align: center; margin-top: 3px; font-size: 10px; color: #D4C5A9; font-style: italic; }

  /* Counter */
  .counter {
    position: relative;
    z-index: 10;
    height: 360px;
    background:
      repeating-linear-gradient(88deg, transparent, transparent 8px, rgba(0,0,0,0.03) 8px, rgba(0,0,0,0.03) 9px),
      linear-gradient(180deg, #6B5242 0%, #7A6050 4%, #8A7060 12%, #7A6050 50%, #6B5242 100%);
    transition: opacity 0.4s ease;
  }
  .scene-wrap.is-zooming .counter { opacity: 0.15; }
  .counter::after {
    content: '';
    position: absolute; left: 0; right: 0; bottom: 0;
    height: 80px;
    background:
      repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 7px),
      linear-gradient(180deg, #4E3829 0%, #3D2B1F 40%, #4A3425 70%, #3D2B1F 100%);
    border-top: 2px solid rgba(0,0,0,0.3);
  }
  .counter::before {
    content: '';
    position: absolute; left: 0; right: 0; top: 0;
    height: 3px;
    background: linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 50%, rgba(255,220,170,0.1) 100%);
    z-index: 1;
  }

  /* Props on counter */
  .prop {
    position: absolute;
    display: flex; flex-direction: column; align-items: center;
    cursor: pointer; text-decoration: none;
    transition: transform 0.3s ease, filter 0.3s ease;
  }
  .prop:hover {
    transform: translateY(-4px);
    filter: drop-shadow(0 8px 20px rgba(193,122,58,0.25));
  }
  .prop-tooltip {
    margin-top: 6px;
    font-size: 10px; color: #6B6560;
    background: rgba(255,255,255,0.85);
    padding: 3px 10px; border-radius: 3px;
    white-space: nowrap;
    opacity: 0; transition: opacity 0.3s ease;
    pointer-events: none;
  }
  .prop:hover .prop-tooltip { opacity: 1; }

  .prop--beanbag    { left: 85px;  bottom: 140px; }
  .prop--beanbag img { width: 95px;  height: auto; display: block; }
  .prop--cabinet    { left: 220px; bottom: 130px; }
  .prop--grinder    { left: 515px; bottom: 135px; }
  .prop--grinder img { width: 115px; height: auto; display: block; }
  .prop--espresso   { right: 220px; bottom: 130px; }
  .prop--espresso img { width: 200px; height: auto; display: block; }
  .prop--frenchpress { left: 475px; bottom: 115px; z-index: 5; }
  .prop--frenchpress img { width: 75px; height: auto; display: block; }

  /* Desktop cabinet sizing */
  .prop--cabinet .cabinet {
    position: relative; width: 150px; border-radius: 6px; overflow: visible;
    background:
      repeating-linear-gradient(91deg, transparent, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 7px),
      repeating-linear-gradient(93deg, transparent, transparent 18px, rgba(255,255,255,0.03) 18px, rgba(255,255,255,0.03) 19px),
      linear-gradient(180deg, #4E3829 0%, #3D2B1F 35%, #4A3425 65%, #3D2B1F 100%);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3);
    padding: 9px; padding-top: 14px;
  }

  .bean-scatter {
    position: absolute;
    width: 14px; height: 9px;
    background: #3D2518;
    border-radius: 50%;
    transition: opacity 0.3s ease;
  }
  .scene-wrap.is-zooming .prop,
  .scene-wrap.is-zooming .bean-scatter { opacity: 0; }

  /* Scene hint (desktop only) */
  .scene-hint {
    text-align: center;
    padding: 12px 0 20px;
    font-size: 12px;
    color: #9B9590;
    font-style: italic;
    transition: color 0.25s ease;
    margin: 0;
  }
  .scene-hint--active { color: #1A1A1A; font-style: normal; }

  /* =========================================================================
     MOBILE STACKED LAYOUT
     ========================================================================= */

  .mobile-scene {
    max-width: 640px;
    margin: 0 auto;
    padding: 0 1rem;
    transition: opacity 0.45s ease;
  }

  .mobile-overline {
    text-align: center;
    font-size: 9px;
    color: #C17A3A;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-weight: 600;
    padding: 1rem 0 0.75rem;
  }

  /* Mobile poster — full width, centered, natural flow */
  .mobile-poster {
    display: block;
    text-decoration: none;
    margin: 0 auto 1.5rem;
    transition: transform 0.45s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.4s ease;
  }
  .mobile-scene.is-zooming .mobile-poster {
    transform: scale(1.12);
    z-index: 100;
  }
  .poster-frame-m {
    padding: 10px;
    border-radius: 4px;
    background:
      repeating-linear-gradient(91deg, transparent, transparent 5px, rgba(0,0,0,0.06) 5px, rgba(0,0,0,0.06) 6px),
      linear-gradient(180deg, #4E3829 0%, #3D2B1F 35%, #4A3425 65%, #3D2B1F 100%);
    box-shadow:
      0 14px 32px rgba(0,0,0,0.22),
      0 6px 12px rgba(0,0,0,0.14),
      inset 0 1px 0 rgba(255,255,255,0.12);
  }
  .poster-mat-m { background: #FAF4E4; padding: 6px; border-radius: 2px; }
  .poster-img-m { display: block; width: 100%; height: auto; border-radius: 1px; }
  .poster-label-m {
    text-align: center; margin-top: 12px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 18px; font-weight: 700; color: #1A1210;
    letter-spacing: 0.02em;
  }
  .poster-sub-m { text-align: center; margin-top: 4px; font-size: 12px; color: #6B6560; }
  .poster-cta-m {
    text-align: center; margin-top: 10px;
    font-size: 11px; color: #C17A3A;
    text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;
  }

  .mobile-scene.is-zooming .prop-grid,
  .mobile-scene.is-zooming .mobile-cabinet { opacity: 0.15; }

  /* Mobile counter region (atmospheric walnut background) */
  .mobile-counter {
    margin: 0 -1rem;
    padding: 1rem;
    background:
      repeating-linear-gradient(88deg, transparent, transparent 8px, rgba(0,0,0,0.03) 8px, rgba(0,0,0,0.03) 9px),
      linear-gradient(180deg, #E8DDC6 0%, #D4C5A9 14%, #C9B898 40%, #D4C5A9 100%);
    border-top: 1px solid rgba(0,0,0,0.12);
  }
  .mobile-counter .mobile-overline { padding: 0.5rem 0 1rem; color: #8B5E2B; }

  /* 2×2 prop grid */
  .prop-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
  .prop-card {
    display: flex; flex-direction: column; align-items: center;
    padding: 1rem 0.75rem;
    background: #FFFDFA;
    border: 1px solid #D4C5A9;
    border-top: 3px solid #C17A3A;
    border-radius: 4px;
    text-decoration: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .prop-card:hover, .prop-card:focus-visible {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0,0,0,0.1);
    border-top-color: #A86830;
  }
  .prop-card-img-wrap {
    height: 90px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 0.5rem;
  }
  .prop-card-img { max-height: 90px; max-width: 100%; width: auto; }
  .prop-card-label {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 14px; font-weight: 700; color: #1A1A1A;
    text-align: center;
    margin-bottom: 0.25rem;
  }
  .prop-card-desc {
    font-size: 11px; color: #6B6560;
    text-align: center;
    line-height: 1.4;
  }

  /* Mobile cabinet — full width, 4 stacked drawers */
  .mobile-cabinet {
    position: relative;
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    border-radius: 6px;
    background:
      repeating-linear-gradient(91deg, transparent, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 7px),
      linear-gradient(180deg, #4E3829 0%, #3D2B1F 35%, #4A3425 65%, #3D2B1F 100%);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08);
    padding: 10px; padding-top: 18px;
    margin-top: 1.5rem;
  }
  .mobile-drawer-grid { gap: 8px; }
  .mobile-drawer-grid .drawer-face { padding: 14px 16px; }
  .mobile-drawer-grid .nameplate { padding: 5px 20px; }
  .mobile-drawer-grid .nameplate-text { font-size: 11px; }
  .mobile-drawer-grid .knob-wrap { width: 22px; height: 22px; }
  .mobile-drawer-grid .knob-ring { width: 22px; height: 22px; }
  .mobile-drawer-grid .knob { width: 12px; height: 12px; }

  @media (hover: none) {
    .drawer:hover .drawer-face { transform: none; }
    .prop:hover { transform: none; filter: none; }
    .prop-card:hover { transform: none; box-shadow: none; }
  }
</style>
