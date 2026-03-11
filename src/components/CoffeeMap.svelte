<script>
  import { onMount } from 'svelte';
  import { countryPaths, VIEW_W, VIEW_H, TROPIC_CANCER_Y, TROPIC_CAPRICORN_Y, EQUATOR_Y } from '../data/mapPaths';
  import { origins, originById, isInHarvest } from '../data/originData';

  let activeOrigin = $state(null);
  let hoveredCountry = $state(null);
  let isMobile = $state(false);
  let panelClosing = $state(false);
  let showPanel = $state(false);

  const currentMonth = new Date().getMonth() + 1;
  const interactiveIds = new Set(origins.map(o => o.id));

  // Mat/frame padding — bottom-weighted like gallery framing
  const PAD_TOP = 20;
  const PAD_SIDE = 22;
  const PAD_BOTTOM = 28;
  const FULL_W = VIEW_W + PAD_SIDE * 2;
  const FULL_H = VIEW_H + PAD_TOP + PAD_BOTTOM;

  function getPathBounds(pathStr) {
    const nums = pathStr.match(/[\d.]+/g);
    if (!nums || nums.length < 4) return { cx: 500, cy: 125 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < Math.min(nums.length, 200); i += 2) {
      const x = parseFloat(nums[i]);
      const y = parseFloat(nums[i + 1]);
      if (!isNaN(x) && !isNaN(y)) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
    return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function formatMonths(range) {
    return `${monthNames[range[0] - 1]}–${monthNames[range[1] - 1]}`;
  }

  onMount(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    isMobile = mq.matches;
    const handler = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  function selectCountry(id) {
    const origin = originById.get(id);
    if (!origin) return;
    panelClosing = false;
    activeOrigin = origin;
    showPanel = true;
  }

  function closePanel() {
    panelClosing = true;
    setTimeout(() => {
      showPanel = false;
      activeOrigin = null;
      panelClosing = false;
    }, 250);
  }

  function handleCountryClick(id) {
    if (interactiveIds.has(id)) {
      selectCountry(id);
    }
  }

  function handleKeydown(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCountryClick(id);
    }
  }

  function getCountryClass(cp) {
    const hasSelection = !!activeOrigin;
    if (!cp.interactive) {
      return hasSelection ? 'country-bg country-dimmed' : 'country-bg';
    }
    if (activeOrigin && activeOrigin.id === cp.id) return 'country-active';
    if (hoveredCountry === cp.id) return 'country-hover';
    return hasSelection ? 'country-interactive country-dimmed' : 'country-interactive';
  }
</script>

<div class="map-container">
  <!-- Header -->
  <div class="map-header">
    <span class="overline">Explore</span>
    <h1>Where Coffee Grows</h1>
    <p class="subtitle">Click a highlighted country to explore its coffee story</p>
  </div>

  <div class="map-layout">
    <!-- SVG Map -->
    <div class="map-wrapper">
      <svg
        viewBox="-{PAD_SIDE} -{PAD_TOP} {FULL_W} {FULL_H}"
        xmlns="http://www.w3.org/2000/svg"
        class="map-svg"
        role="img"
        aria-label="Interactive map of coffee-producing countries"
      >
        <defs>
          <!-- Clip path to keep map content within bounds -->
          <clipPath id="map-clip">
            <rect x="0" y="0" width={VIEW_W} height={VIEW_H}/>
          </clipPath>
          <!-- Paper grain texture — subtle parchment feel on ocean -->
          <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="3" seed="2" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
            <feComponentTransfer in="grayNoise" result="flatNoise">
              <feFuncR type="linear" slope="0.4" intercept="0.3"/>
              <feFuncG type="linear" slope="0.4" intercept="0.3"/>
              <feFuncB type="linear" slope="0.4" intercept="0.3"/>
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="flatNoise" mode="soft-light"/>
          </filter>
          <!-- Copper ink wash gradient — subtle top-to-bottom variation -->
          <linearGradient id="copper-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#D08A48"/>
            <stop offset="55%" stop-color="#C17A3A"/>
            <stop offset="100%" stop-color="#A86A30"/>
          </linearGradient>
          <linearGradient id="copper-wash-hover" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#DDA05C"/>
            <stop offset="55%" stop-color="#D4944F"/>
            <stop offset="100%" stop-color="#BA8040"/>
          </linearGradient>
          <linearGradient id="copper-wash-active" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#E0A560"/>
            <stop offset="50%" stop-color="#D4944F"/>
            <stop offset="100%" stop-color="#C08040"/>
          </linearGradient>
          <!-- Glow for active country -->
          <filter id="country-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
            <feFlood flood-color="#C17A3A" flood-opacity="0.4" result="color"/>
            <feComposite in="color" in2="blur" operator="in" result="shadow"/>
            <feMerge>
              <feMergeNode in="shadow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <!-- Vignette gradient — subtle corner darkening -->
          <radialGradient id="vignette" cx="50%" cy="50%" r="60%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="black" stop-opacity="0"/>
            <stop offset="70%" stop-color="black" stop-opacity="0"/>
            <stop offset="100%" stop-color="black" stop-opacity="0.1"/>
          </radialGradient>
          <!-- Edge fades — ocean-colored to hide hard country cutoffs -->
          <linearGradient id="edge-fade-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#CBCFD5" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#CBCFD5" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="edge-fade-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#CBCFD5" stop-opacity="0"/>
            <stop offset="100%" stop-color="#CBCFD5" stop-opacity="0.9"/>
          </linearGradient>
          <!-- Inner shadow gradients — depth where map meets mat -->
          <linearGradient id="shadow-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3A3228" stop-opacity="0.12"/>
            <stop offset="100%" stop-color="#3A3228" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="shadow-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3A3228" stop-opacity="0"/>
            <stop offset="100%" stop-color="#3A3228" stop-opacity="0.08"/>
          </linearGradient>
          <linearGradient id="shadow-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#3A3228" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#3A3228" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="shadow-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#3A3228" stop-opacity="0"/>
            <stop offset="100%" stop-color="#3A3228" stop-opacity="0.1"/>
          </linearGradient>
        </defs>

        <!-- Mat board background -->
        <rect x="-{PAD_SIDE}" y="-{PAD_TOP}" width={FULL_W} height={FULL_H} fill="#E8E1D4" rx="2"/>

        <!-- Outer frame — gallery-style thin dark border -->
        <rect x="-{PAD_SIDE}" y="-{PAD_TOP}" width={FULL_W} height={FULL_H}
              fill="none" stroke="#2A2520" stroke-width="2.5" rx="2"/>
        <!-- Copper accent line — inside the frame -->
        <rect x="-{PAD_SIDE - 4}" y="-{PAD_TOP - 4}" width={FULL_W - 8} height={FULL_H - 8}
              fill="none" stroke="#C17A3A" stroke-width="0.5" opacity="0.7" rx="1"/>

        <!-- Inner border where mat meets map content -->
        <rect x="-0.5" y="-0.5" width={VIEW_W + 1} height={VIEW_H + 1}
              fill="none" stroke="#6B5D4E" stroke-width="0.6"/>

        <!-- Ocean background — muted steel blue-gray with paper grain -->
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="#CBCFD5" pointer-events="none" filter="url(#paper-grain)"/>

        <!-- All map content clipped to content area — prevents bleeding into mat -->
        <g clip-path="url(#map-clip)">
          <!-- Coffee belt band -->
          <rect
            x="0" y={TROPIC_CANCER_Y}
            width={VIEW_W} height={TROPIC_CAPRICORN_Y - TROPIC_CANCER_Y}
            fill="#D8CDB8"
            opacity="0.4"
            pointer-events="none"
          />

          <!-- Ghost ocean labels -->
          <text x="90" y={EQUATOR_Y - 15} class="ocean-label">PACIFIC</text>
          <text x="90" y={EQUATOR_Y + 3} class="ocean-label">OCEAN</text>
          <text x="370" y={EQUATOR_Y + 20} class="ocean-label">ATLANTIC</text>
          <text x="722" y={EQUATOR_Y + 25} class="ocean-label">INDIAN OCEAN</text>

          <!-- Tropic lines -->
          <line x1="0" y1={TROPIC_CANCER_Y} x2={VIEW_W} y2={TROPIC_CANCER_Y}
                stroke="#8B7A60" stroke-width="0.5" stroke-dasharray="2,4" opacity="0.5"/>
          <line x1="0" y1={TROPIC_CAPRICORN_Y} x2={VIEW_W} y2={TROPIC_CAPRICORN_Y}
                stroke="#8B7A60" stroke-width="0.5" stroke-dasharray="2,4" opacity="0.5"/>

          <!-- Tropic labels — all left-aligned -->
          <text x="5" y={TROPIC_CANCER_Y - 3} class="tropic-label">TROPIC OF CANCER</text>
          <text x="5" y={TROPIC_CAPRICORN_Y + 9} class="tropic-label">TROPIC OF CAPRICORN</text>

          <!-- Equator -->
          <line x1="0" y1={EQUATOR_Y} x2={VIEW_W} y2={EQUATOR_Y}
                stroke="#8B7A60" stroke-width="0.4" stroke-dasharray="2,5" opacity="0.4"/>
          <text x="5" y={EQUATOR_Y - 3} class="tropic-label">EQUATOR</text>

          <!-- Country paths -->
          {#each countryPaths as cp (cp.id)}
            <path
              d={cp.path}
              class={getCountryClass(cp)}
              filter={activeOrigin && activeOrigin.id === cp.id ? 'url(#country-glow)' : undefined}
              role={cp.interactive ? 'button' : undefined}
              tabindex={cp.interactive ? 0 : undefined}
              aria-label={cp.interactive ? `Explore ${originById.get(cp.id)?.name || cp.id} coffee` : undefined}
              onmouseenter={() => { if (cp.interactive) hoveredCountry = cp.id; }}
              onmouseleave={() => { hoveredCountry = null; }}
              onclick={() => handleCountryClick(cp.id)}
              onkeydown={(e) => handleKeydown(e, cp.id)}
            />
          {/each}

          <!-- Edge fades — countries fade into mat-colored edges -->
          <rect x="0" y="0" width={VIEW_W} height="25" fill="url(#edge-fade-top)" pointer-events="none"/>
          <rect x="0" y={VIEW_H - 25} width={VIEW_W} height="25" fill="url(#edge-fade-bottom)" pointer-events="none"/>

          <!-- Vignette — subtle corner darkening for depth -->
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#vignette)" pointer-events="none"/>

          <!-- Compass Rose (upper-left Pacific) -->
          <g transform="translate(60, 55)" class="compass-rose" opacity="0.4">
            <circle cx="0" cy="0" r="12" fill="none" stroke="#1A1A1A" stroke-width="0.4"/>
            <circle cx="0" cy="0" r="11" fill="none" stroke="#C17A3A" stroke-width="0.2"/>
            <polygon points="0,-10 -1.5,-3 0,-4 1.5,-3" fill="#1A1A1A"/>
            <polygon points="0,10 -1.5,3 0,4 1.5,3" fill="#A6896A"/>
            <polygon points="10,0 3,-1.5 4,0 3,1.5" fill="#A6896A"/>
            <polygon points="-10,0 -3,-1.5 -4,0 -3,1.5" fill="#A6896A"/>
            <line x1="7" y1="-7" x2="3" y2="-3" stroke="#A6896A" stroke-width="0.3"/>
            <line x1="7" y1="7" x2="3" y2="3" stroke="#A6896A" stroke-width="0.3"/>
            <line x1="-7" y1="-7" x2="-3" y2="-3" stroke="#A6896A" stroke-width="0.3"/>
            <line x1="-7" y1="7" x2="-3" y2="3" stroke="#A6896A" stroke-width="0.3"/>
            <circle cx="0" cy="0" r="1" fill="#C17A3A"/>
            <text x="0" y="-14" text-anchor="middle" class="compass-letter">N</text>
          </g>

          <!-- Scale bar — bottom-right ocean area -->
          <g transform="translate({VIEW_W - 120}, {VIEW_H - 18})" class="scale-bar" opacity="0.5">
            <line x1="0" y1="0" x2="80" y2="0" stroke="#6B5D4E" stroke-width="0.6"/>
            <line x1="0" y1="-2" x2="0" y2="2" stroke="#6B5D4E" stroke-width="0.6"/>
            <line x1="40" y1="-1.5" x2="40" y2="1.5" stroke="#6B5D4E" stroke-width="0.4"/>
            <line x1="80" y1="-2" x2="80" y2="2" stroke="#6B5D4E" stroke-width="0.6"/>
            <text x="0" y="6" class="scale-text">0</text>
            <text x="40" y="6" class="scale-text">2,000</text>
            <text x="80" y="6" class="scale-text">4,000 km</text>
          </g>

          <!-- Country name tooltip on hover -->
          {#if hoveredCountry && !isMobile}
            {@const origin = originById.get(hoveredCountry)}
            {@const cp = countryPaths.find(c => c.id === hoveredCountry)}
            {#if origin && cp}
              {@const bounds = getPathBounds(cp.path)}
              <g class="tooltip-group" pointer-events="none">
                <rect
                  x={bounds.cx - 40} y={bounds.cy - 18}
                  width="80" height="15"
                  rx="2" fill="#1A1A1A" opacity="0.85"
                />
                <text
                  x={bounds.cx} y={bounds.cy - 8}
                  text-anchor="middle" class="tooltip-text"
                >{origin.name}</text>
              </g>
            {/if}
          {/if}
        </g>

        <!-- Inner shadow — recessed depth where map meets mat -->
        <rect x="0" y="0" width={VIEW_W} height="6" fill="url(#shadow-top)" pointer-events="none"/>
        <rect x="0" y={VIEW_H - 5} width={VIEW_W} height="5" fill="url(#shadow-bottom)" pointer-events="none"/>
        <rect x="0" y="0" width="6" height={VIEW_H} fill="url(#shadow-left)" pointer-events="none"/>
        <rect x={VIEW_W - 6} y="0" width="6" height={VIEW_H} fill="url(#shadow-right)" pointer-events="none"/>

      </svg>

      <!-- Legend cartouche (HTML overlay, bottom-left of map) -->
      <div class="map-legend-cartouche">
        <span class="legend-header">Map Key</span>
        <div class="legend-entries">
          <div class="legend-entry">
            <span class="legend-swatch" style="background: #C17A3A;"></span>
            <span>Coffee origins with articles</span>
          </div>
          <div class="legend-entry">
            <span class="legend-swatch" style="background: #DED7CD; border: 1px solid #C8C3B8;"></span>
            <span>Other countries</span>
          </div>
          <div class="legend-entry">
            <span class="legend-swatch legend-belt-swatch"></span>
            <span>Coffee belt (Tropics)</span>
          </div>
        </div>
      </div>

      <!-- Detail Panel -->
      {#if showPanel && activeOrigin}
        <div class="detail-panel" class:closing={panelClosing}>
        <button class="panel-close" onclick={closePanel} aria-label="Close panel">
          <span class="panel-close-text">Back to Map</span>
        </button>

        <div class="panel-content">
          <span class="panel-continent">{activeOrigin.continent === 'americas' ? 'The Americas' : activeOrigin.continent === 'africa' ? 'Africa' : 'Asia & Pacific'}</span>
          <h2 class="panel-title">{activeOrigin.name}</h2>
          <p class="panel-description">{activeOrigin.description}</p>

          <!-- Articles — prominent, near top -->
          <div class="panel-section">
            <div class="article-links">
              {#each activeOrigin.articles as article}
                <a href={`/blog/${article.slug}/`} class="article-link">
                  <span class="article-arrow">→</span>
                  <span>{article.title}</span>
                </a>
              {/each}
            </div>
          </div>

          <!-- Flavor Profile -->
          <div class="panel-section">
            <h3>Flavor Profile</h3>
            <div class="flavor-list">
              {#each activeOrigin.flavorProfile as flavor}
                <span class="flavor-item">{flavor}</span>
              {/each}
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="panel-stats">
            {#if activeOrigin.production}
              <div class="stat">
                <span class="stat-label">Production</span>
                <span class="stat-value">{activeOrigin.production}</span>
              </div>
            {/if}
            {#if activeOrigin.altitudeRange}
              <div class="stat">
                <span class="stat-label">Altitude</span>
                <span class="stat-value">{activeOrigin.altitudeRange[0]}–{activeOrigin.altitudeRange[1]}m</span>
              </div>
            {/if}
            <div class="stat">
              <span class="stat-label">Harvest</span>
              <span class="stat-value">
                {formatMonths(activeOrigin.harvestMonths)}
                {#if isInHarvest(activeOrigin, currentMonth)}
                  <span class="in-season">In Season</span>
                {/if}
              </span>
            </div>
          </div>

          <!-- Varieties & Processing -->
          <div class="panel-section">
            <h3>Key Details</h3>
            <div class="detail-row">
              <span class="detail-label">Varieties</span>
              <span class="detail-value">{activeOrigin.mainVarieties.join(', ')}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Processing</span>
              <span class="detail-value">{activeOrigin.primaryProcessing.join(', ')}</span>
            </div>
            {#if activeOrigin.regions}
              <div class="detail-row">
                <span class="detail-label">Regions</span>
                <span class="detail-value">{activeOrigin.regions.join(', ')}</span>
              </div>
            {/if}
          </div>
        </div>
      </div>
      {/if}
    </div>
  </div>

  <!-- Mobile: Origin Cards (below map) -->
  {#if isMobile && !showPanel}
    <div class="mobile-origins">
      <h2 class="mobile-section-title">All Origins</h2>
      {#each origins as origin}
        <button class="origin-card" onclick={() => selectCountry(origin.id)}>
          <div class="origin-card-header">
            <span class="origin-card-name">{origin.name}</span>
            {#if isInHarvest(origin, currentMonth)}
              <span class="in-season-badge">In Season</span>
            {/if}
          </div>
          <div class="origin-card-flavors">
            {#each origin.flavorProfile.slice(0, 3) as flavor}
              <span class="flavor-tag-small">{flavor}</span>
            {/each}
          </div>
          <span class="origin-card-articles">{origin.articles.length} article{origin.articles.length !== 1 ? 's' : ''}</span>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .map-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .map-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .overline {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #C17A3A;
  }

  .map-header h1 {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 2.5rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0.25rem 0 0.5rem;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  .subtitle {
    color: #6B6560;
    font-size: 1rem;
    margin: 0;
  }

  /* Layout */
  .map-layout {
    position: relative;
  }

  .map-wrapper {
    width: 100%;
    position: relative;
  }

  /* SVG Map */
  .map-svg {
    width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
  }

  /* Country styles */
  .map-svg path {
    outline: none;
  }

  .map-svg path:focus-visible {
    stroke: #C17A3A;
    stroke-width: 1.2;
  }

  .country-bg {
    fill: #D5D0C8;
    stroke: #C0BAB0;
    stroke-width: 0.3;
    opacity: 0.75;
    transition: opacity 0.4s ease;
  }

  .country-interactive {
    fill: url(#copper-wash);
    stroke: #A66830;
    stroke-width: 0.5;
    opacity: 0.8;
    cursor: pointer;
    transition: opacity 0.3s ease, fill 0.2s ease, filter 0.3s ease;
  }

  .country-interactive:hover,
  .country-hover {
    fill: url(#copper-wash-hover);
    opacity: 1;
    stroke: #C17A3A;
    stroke-width: 0.8;
  }

  .country-active {
    fill: url(#copper-wash-active);
    stroke: #8B5E28;
    stroke-width: 0.8;
    opacity: 1;
  }

  /* Dim non-selected countries when a country is active */
  .country-dimmed {
    opacity: 0.4;
  }

  /* Map typography */
  .tropic-label {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 5.5px;
    fill: #A6896A;
    opacity: 0.65;
    letter-spacing: 0.2em;
    font-weight: 500;
  }

  .ocean-label {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 8px;
    fill: #9BA3AB;
    opacity: 0.45;
    font-style: italic;
    letter-spacing: 0.3em;
    font-weight: 400;
  }

  .compass-letter {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 5px;
    fill: #1A1A1A;
    font-weight: 700;
  }

  .scale-text {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 3.5px;
    fill: #6B5D4E;
    font-weight: 500;
  }

  .compass-rose {
    transition: opacity 0.3s;
  }

  /* Legend cartouche (HTML overlay) */
  .map-legend-cartouche {
    position: absolute;
    bottom: 1.25rem;
    left: 1.25rem;
    background: rgba(245, 240, 232, 0.92);
    backdrop-filter: blur(4px);
    border: 1px solid #C17A3A;
    border-radius: 4px;
    padding: 0.6rem 0.85rem;
    z-index: 5;
  }

  .legend-header {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 0.7rem;
    font-weight: 700;
    color: #C17A3A;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.35rem;
  }

  .legend-entries {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .legend-entry {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.7rem;
    color: #6B6560;
  }

  .legend-swatch {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    flex-shrink: 0;
  }

  .legend-belt-swatch {
    background: #D8CDB8;
    border: 1px solid #C8BFA8;
  }

  .tooltip-text {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 6px;
    fill: #F5F0E8;
    font-weight: 600;
  }

  .tooltip-group {
    pointer-events: none;
  }

  /* Detail Panel */
  .detail-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 380px;
    overflow-y: auto;
    background: #FDFBF7;
    border: 1px solid #EBE4D8;
    border-left: 3px solid #C17A3A;
    border-radius: 0 8px 8px 0;
    box-shadow: -8px 0 30px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06);
    animation: slideIn 0.3s ease-out;
    z-index: 10;
  }

  .detail-panel.closing {
    animation: slideOut 0.25s ease-in;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes slideOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(20px); }
  }

  .panel-close {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0;
  }

  .panel-close-text {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #C17A3A;
    transition: color 0.15s;
  }

  .panel-close:hover .panel-close-text {
    color: #A66830;
  }

  .panel-content {
    padding: 1.75rem 1.5rem 1.5rem;
  }

  .panel-continent {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #C17A3A;
  }

  .panel-title {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 1.75rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0.25rem 0 0.75rem;
    line-height: 1.2;
  }

  .panel-description {
    font-size: 0.9rem;
    line-height: 1.75;
    color: #4A4540;
    margin-bottom: 1.5rem;
  }

  /* Stats — hairline dividers instead of gray box */
  .panel-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-bottom: 1.5rem;
    border-top: 1px solid #EBE4D8;
    border-bottom: 1px solid #EBE4D8;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    padding: 0.75rem 0;
  }

  .stat:nth-child(even) {
    padding-left: 0.75rem;
    border-left: 1px solid #EBE4D8;
  }

  .stat:nth-child(n+3) {
    border-top: 1px solid #EBE4D8;
  }

  .stat:last-child:nth-child(odd) {
    grid-column: span 2;
  }

  .stat-label {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #C17A3A;
  }

  .stat-value {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 0.95rem;
    font-weight: 600;
    color: #1A1A1A;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .in-season {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.55rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: #C17A3A;
    color: white;
    padding: 0.15rem 0.4rem;
    border-radius: 2px;
  }

  /* Sections */
  .panel-section {
    margin-bottom: 1.5rem;
  }

  .panel-section h3 {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #9B9590;
    margin-bottom: 0.6rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #EBE4D8;
  }

  /* Flavor list — editorial style, not pills */
  .flavor-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
  }

  .flavor-item {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 0.9rem;
    font-style: italic;
    color: #4A4540;
  }

  .flavor-item::after {
    content: ' · ';
    color: #C17A3A;
    font-style: normal;
    font-weight: 700;
    padding: 0 0.2rem;
  }

  .flavor-item:last-child::after {
    content: '';
  }

  /* Detail rows */
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.5rem 0;
    border-bottom: 1px solid #F0EBE3;
    gap: 1rem;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.8rem;
    color: #9B9590;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .detail-value {
    font-size: 0.8rem;
    color: #1A1A1A;
    text-align: right;
    line-height: 1.5;
  }

  /* Article links */
  .article-links {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .article-link {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.5rem 0.6rem;
    text-decoration: none;
    color: #1A1A1A;
    font-size: 0.85rem;
    line-height: 1.4;
    border-left: 2px solid #C17A3A;
    background: linear-gradient(90deg, rgba(193, 122, 58, 0.05), transparent);
    border-radius: 0 4px 4px 0;
    margin-bottom: 0.35rem;
    transition: background 0.15s, border-color 0.15s;
  }

  .article-link:hover {
    background: linear-gradient(90deg, rgba(193, 122, 58, 0.12), transparent);
    border-left-color: #D4944F;
  }

  .article-arrow {
    color: #C17A3A;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 0.05rem;
  }

  /* Mobile origins list */
  .mobile-origins {
    margin-top: 2rem;
  }

  .mobile-section-title {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 1.5rem;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 1rem;
  }

  .origin-card {
    display: block;
    width: 100%;
    text-align: left;
    padding: 1rem;
    background: #FDFBF7;
    border: 1px solid #EBE4D8;
    border-radius: 8px;
    margin-bottom: 0.75rem;
    cursor: pointer;
    transition: border-color 0.15s;
  }

  .origin-card:hover {
    border-color: #C17A3A;
  }

  .origin-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .origin-card-name {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 1.1rem;
    font-weight: 700;
    color: #1A1A1A;
  }

  .in-season-badge {
    font-size: 0.6rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: #C17A3A;
    color: white;
    padding: 0.15rem 0.4rem;
    border-radius: 3px;
  }

  .origin-card-flavors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-bottom: 0.4rem;
  }

  .flavor-tag-small {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    background: #EBE4D8;
    color: #6B6560;
    border-radius: 100px;
  }

  .origin-card-articles {
    font-size: 0.75rem;
    color: #9B9590;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .map-legend-cartouche {
      display: none;
    }

    .map-header h1 {
      font-size: 1.75rem;
    }

    .detail-panel {
      width: 100%;
      min-width: 100%;
      margin-left: 0;
      margin-top: 1rem;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      top: auto;
      max-height: 70vh;
      border-radius: 16px 16px 0 0;
      border-left: none;
      border-top: 3px solid #C17A3A;
      z-index: 50;
      animation: slideUp 0.25s ease-out;
    }

    .detail-panel.closing {
      animation: slideDown 0.25s ease-in;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(100%); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideDown {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(100%); }
    }
  }
</style>
