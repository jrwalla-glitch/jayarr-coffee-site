<script>
  import { onMount } from 'svelte';
  import { methods, branches, methodById, methodsByBranch } from '../data/brewMethodData';

  let activeMethod = $state(null);
  let hoveredMethod = $state(null);
  let showPanel = $state(false);
  let panelClosing = $state(false);
  let isMobile = $state(false);

  const VIEW_W = 1000;
  const VIEW_H = 500;
  const PAD_TOP = 20;
  const PAD_SIDE = 22;
  const PAD_BOTTOM = 28;
  const FULL_W = VIEW_W + PAD_SIDE * 2;
  const FULL_H = VIEW_H + PAD_TOP + PAD_BOTTOM;

  // Constellation node positions — each shape is distinct
  const starPos = {
    // Percolation (The Filter) — 5 stars, funnel shape widest at top
    'v60':          { x: 105, y: 180, r: 3.5 },
    'chemex':       { x: 275, y: 175, r: 3.5 },
    'kalita':       { x: 145, y: 270, r: 3.5 },
    'drip':         { x: 245, y: 275, r: 3.5 },
    'phin':         { x: 190, y: 360, r: 3.5 },
    // Immersion (The Vessel) — 5 stars, deep U/chalice shape
    'french-press': { x: 410, y: 195, r: 3.5 },
    'cold-brew':    { x: 590, y: 200, r: 3.5 },
    'siphon':       { x: 430, y: 295, r: 3.5 },
    'turkish':      { x: 570, y: 300, r: 3.5 },
    'clever':       { x: 500, y: 385, r: 3.5 },
    // Pressure (The Force) — 3 stars, arrow/spear pointing down
    'espresso':     { x: 815, y: 195, r: 3.5 },
    'moka-pot':     { x: 870, y: 295, r: 3.5 },
    'aeropress':    { x: 755, y: 300, r: 3.5 },
  };

  // Hub stars — constellation name anchors
  const hubPos = {
    'percolation': { x: 190, y: 100, r: 5.5 },
    'immersion':   { x: 500, y: 115, r: 5.5 },
    'pressure':    { x: 815, y: 110, r: 5.5 },
  };

  // Constellation line connections
  const constellationLines = {
    'percolation': [
      ['hub', 'v60'], ['hub', 'chemex'],
      ['v60', 'kalita'], ['chemex', 'drip'],
      ['kalita', 'phin'], ['drip', 'phin'],
    ],
    'immersion': [
      ['hub', 'french-press'], ['hub', 'cold-brew'],
      ['french-press', 'siphon'], ['cold-brew', 'turkish'],
      ['siphon', 'clever'], ['turkish', 'clever'],
    ],
    'pressure': [
      ['hub', 'espresso'],
      ['espresso', 'moka-pot'], ['espresso', 'aeropress'],
      ['moka-pot', 'aeropress'],
    ],
  };

  function getNode(branchId, ref) {
    return ref === 'hub' ? hubPos[branchId] : starPos[ref];
  }

  // Generate deterministic field stars
  function genFieldStars(n) {
    let s = 42;
    const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    const result = [];
    for (let i = 0; i < n; i++) {
      result.push({
        x: rand() * VIEW_W,
        y: rand() * VIEW_H,
        r: 0.3 + rand() * 1.0,
        opacity: 0.1 + rand() * 0.45,
        delay: rand() * 10,
        duration: 3 + rand() * 5,
      });
    }
    return result;
  }
  const fieldStars = genFieldStars(150);

  // Brighter "feature" stars — a handful of larger, more prominent background stars
  const featureStars = [
    { x: 50, y: 80, r: 1.6, opacity: 0.6 },
    { x: 420, y: 60, r: 1.4, opacity: 0.55 },
    { x: 680, y: 90, r: 1.5, opacity: 0.5 },
    { x: 950, y: 150, r: 1.3, opacity: 0.55 },
    { x: 320, y: 400, r: 1.7, opacity: 0.5 },
    { x: 620, y: 420, r: 1.4, opacity: 0.6 },
    { x: 900, y: 440, r: 1.5, opacity: 0.55 },
    { x: 80, y: 350, r: 1.3, opacity: 0.5 },
    { x: 550, y: 80, r: 1.2, opacity: 0.45 },
    { x: 350, y: 130, r: 1.1, opacity: 0.5 },
  ];

  // Label offsets to avoid collision — most go below
  const labelOffsets = {
    'v60':          { dx: -12, dy: 6, anchor: 'end' },
    'chemex':       { dx: 12, dy: 6, anchor: 'start' },
    'kalita':       { dx: -12, dy: 6, anchor: 'end' },
    'drip':         { dx: 12, dy: 6, anchor: 'start' },
    'phin':         { dx: 0, dy: 16, anchor: 'middle' },
    'french-press': { dx: -12, dy: 6, anchor: 'end' },
    'cold-brew':    { dx: 12, dy: 6, anchor: 'start' },
    'siphon':       { dx: -12, dy: 6, anchor: 'end' },
    'turkish':      { dx: 12, dy: 6, anchor: 'start' },
    'clever':       { dx: 0, dy: 16, anchor: 'middle' },
    'espresso':     { dx: 0, dy: 16, anchor: 'middle' },
    'moka-pot':     { dx: 14, dy: 6, anchor: 'start' },
    'aeropress':    { dx: -14, dy: 6, anchor: 'end' },
  };

  function difficultyDots(d) {
    return '\u25CF'.repeat(d) + '\u25CB'.repeat(3 - d);
  }
  function difficultyLabel(d) {
    return ['', 'Beginner', 'Intermediate', 'Advanced'][d];
  }

  function selectMethod(id) {
    const m = methodById.get(id);
    if (!m) return;
    panelClosing = false;
    activeMethod = m;
    showPanel = true;
  }

  function closePanel() {
    panelClosing = true;
    setTimeout(() => {
      showPanel = false;
      activeMethod = null;
      panelClosing = false;
    }, 250);
  }

  function handleStarKey(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectMethod(id);
    }
  }

  function getStarClass(methodId) {
    if (activeMethod?.id === methodId) return 'star-node star-active';
    if (hoveredMethod === methodId) return 'star-node star-hovered';
    if (activeMethod) return 'star-node star-dimmed';
    return 'star-node';
  }

  function getLineOpacity(branchId) {
    if (!activeMethod) return 0.45;
    if (activeMethod.branch === branchId) return 0.65;
    return 0.15;
  }

  function getHubOpacity(branchId) {
    if (!activeMethod) return 1;
    if (activeMethod.branch === branchId) return 1;
    return 0.35;
  }

  onMount(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    isMobile = mq.matches;
    const handler = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  const branchInfo = Object.fromEntries(branches.map(b => [b.id, b]));
</script>

<div class="brew-container">
  <!-- Header -->
  <div class="brew-header">
    <span class="overline">Explore</span>
    <h1>The Brewing Constellations</h1>
    <p class="subtitle">Every brewing method is a star — click one to learn the science behind it</p>
  </div>

  <div class="brew-layout">
    <div class="chart-wrapper">
      <svg
        viewBox={`-${PAD_SIDE} -${PAD_TOP} ${FULL_W} ${FULL_H}`}
        xmlns="http://www.w3.org/2000/svg"
        class="chart-svg"
        role="img"
        aria-label="Interactive star chart of coffee brewing methods"
      >
        <defs>
          <!-- Sky gradient — deep navy to darker navy -->
          <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#0B1525"/>
            <stop offset="60%" stop-color="#12213A"/>
            <stop offset="100%" stop-color="#1A2A3D"/>
          </linearGradient>

          <!-- Horizon glow — warm amber at bottom edge -->
          <radialGradient id="horizon-glow" cx="50%" cy="108%" r="60%" fx="50%" fy="108%">
            <stop offset="0%" stop-color="#D4A44C" stop-opacity="0.18"/>
            <stop offset="30%" stop-color="#A07838" stop-opacity="0.08"/>
            <stop offset="60%" stop-color="#5A4020" stop-opacity="0.03"/>
            <stop offset="100%" stop-color="#0B1525" stop-opacity="0"/>
          </radialGradient>

          <!-- Fine grain texture — barely perceptible, like printed paper -->
          <filter id="sky-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" seed="3" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
            <feComponentTransfer in="grayNoise" result="flatNoise">
              <feFuncR type="linear" slope="0.08" intercept="0.46"/>
              <feFuncG type="linear" slope="0.08" intercept="0.46"/>
              <feFuncB type="linear" slope="0.08" intercept="0.46"/>
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="flatNoise" mode="soft-light"/>
          </filter>

          <!-- Star glow filters -->
          <filter id="hub-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="method-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <!-- Vignette — darker corners -->
          <radialGradient id="sky-vignette" cx="50%" cy="50%" r="60%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="black" stop-opacity="0"/>
            <stop offset="65%" stop-color="black" stop-opacity="0"/>
            <stop offset="100%" stop-color="black" stop-opacity="0.25"/>
          </radialGradient>

          <!-- Inner shadow gradients — depth at frame edges -->
          <linearGradient id="shadow-top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000" stop-opacity="0.2"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="shadow-bottom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.15"/>
          </linearGradient>
          <linearGradient id="shadow-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#000" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="shadow-right" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.18"/>
          </linearGradient>
        </defs>

        <!-- ═══ FRAME & MAT ═══ -->
        <!-- Dark slate mat background -->
        <rect x={-PAD_SIDE} y={-PAD_TOP} width={FULL_W} height={FULL_H} fill="#2A3040" rx="2"/>
        <!-- Outer frame -->
        <rect x={-PAD_SIDE} y={-PAD_TOP} width={FULL_W} height={FULL_H}
              fill="none" stroke="#2A2520" stroke-width="2.5" rx="2"/>
        <!-- Copper accent line -->
        <rect x={-PAD_SIDE + 4} y={-PAD_TOP + 4} width={FULL_W - 8} height={FULL_H - 8}
              fill="none" stroke="#C17A3A" stroke-width="0.5" opacity="0.55" rx="1"/>
        <!-- Inner border — map meets mat -->
        <rect x="-0.5" y="-0.5" width={VIEW_W + 1} height={VIEW_H + 1}
              fill="none" stroke="#4A5568" stroke-width="0.6"/>

        <!-- ═══ SKY ═══ -->
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#sky-grad)" pointer-events="none"/>
        <!-- Horizon glow -->
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#horizon-glow)" pointer-events="none"/>

        <!-- ═══ CLUSTER NEBULA GLOWS ═══ -->
        <!-- Very subtle localized haze behind each constellation -->
        <g pointer-events="none" opacity="0.05">
          <circle cx="190" cy="235" r="200" fill="#2A4060"/>
          <circle cx="500" cy="255" r="210" fill="#2A3E5E"/>
          <circle cx="815" cy="230" r="160" fill="#2A4060"/>
        </g>

        <!-- ═══ FIELD STARS ═══ -->
        {#each fieldStars as star, i}
          <circle
            cx={star.x} cy={star.y} r={star.r}
            fill="#C8D0E0"
            opacity={star.opacity}
            class="field-star"
            style={`animation-delay: ${star.delay}s; animation-duration: ${star.duration}s`}
          />
        {/each}

        <!-- Feature stars — brighter accent stars -->
        {#each featureStars as star}
          <circle cx={star.x} cy={star.y} r={star.r * 2} fill="#D0D8E8" opacity={star.opacity * 0.15}/>
          <circle cx={star.x} cy={star.y} r={star.r} fill="#D8E0F0" opacity={star.opacity}/>
        {/each}

        <!-- ═══ CONSTELLATION LINES ═══ -->
        {#each Object.entries(constellationLines) as [branchId, lines]}
          {#each lines as [from, to]}
            {@const p1 = getNode(branchId, from)}
            {@const p2 = getNode(branchId, to)}
            <line
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="#C9A84E" stroke-width="1.0"
              opacity={getLineOpacity(branchId)}
              class="constellation-line"
            />
          {/each}
        {/each}

        <!-- ═══ HUB STARS (branch centers) ═══ -->
        {#each Object.entries(hubPos) as [branchId, pos]}
          <g opacity={getHubOpacity(branchId)} class="hub-group">
            <!-- Outer glow -->
            <circle cx={pos.x} cy={pos.y} r={pos.r * 4.5} fill="#D4A44C" opacity="0.06"/>
            <!-- Mid glow -->
            <circle cx={pos.x} cy={pos.y} r={pos.r * 3} fill="#D4A44C" opacity="0.12"/>
            <!-- Inner glow -->
            <circle cx={pos.x} cy={pos.y} r={pos.r * 1.8} fill="#D4A44C" opacity="0.3" filter="url(#hub-glow)"/>
            <!-- Core -->
            <circle cx={pos.x} cy={pos.y} r={pos.r} fill="#E8B85C"/>
            <!-- Sparkle cross -->
            <line x1={pos.x - pos.r * 1.8} y1={pos.y} x2={pos.x + pos.r * 1.8} y2={pos.y}
                  stroke="#D4A44C" stroke-width="0.4" opacity="0.6"/>
            <line x1={pos.x} y1={pos.y - pos.r * 1.8} x2={pos.x} y2={pos.y + pos.r * 1.8}
                  stroke="#D4A44C" stroke-width="0.4" opacity="0.6"/>
            <!-- Branch label -->
            <text x={pos.x} y={pos.y - 24} text-anchor="middle" class="hub-label">
              {branchInfo[branchId].name.toUpperCase()}
            </text>
            <text x={pos.x} y={pos.y - 13} text-anchor="middle" class="hub-subtitle">
              {branchInfo[branchId].subtitle}
            </text>
          </g>
        {/each}

        <!-- ═══ METHOD STARS ═══ -->
        {#each methods as method}
          {@const pos = starPos[method.id]}
          {@const offset = labelOffsets[method.id]}
          {@const isActive = activeMethod?.id === method.id}
          {@const isHovered = hoveredMethod === method.id}
          <g
            class={getStarClass(method.id)}
            role="button"
            tabindex="0"
            aria-label={`${method.name} — ${method.oneLiner}`}
            onclick={() => selectMethod(method.id)}
            onkeydown={(e) => handleStarKey(e, method.id)}
            onmouseenter={() => { hoveredMethod = method.id; }}
            onmouseleave={() => { hoveredMethod = null; }}
          >
            <!-- Outer glow -->
            <circle cx={pos.x} cy={pos.y} r={isActive ? pos.r * 5 : isHovered ? pos.r * 4 : pos.r * 3}
                    fill="#E8C36A" opacity={isActive ? 0.12 : isHovered ? 0.08 : 0.05}/>
            <!-- Inner glow -->
            <circle cx={pos.x} cy={pos.y} r={isActive ? pos.r * 2.5 : isHovered ? pos.r * 2 : pos.r * 1.6}
                    fill="#E8C36A" opacity={isActive ? 0.25 : isHovered ? 0.2 : 0.12}/>
            <!-- Core star -->
            <circle cx={pos.x} cy={pos.y} r={isActive ? pos.r * 1.3 : pos.r}
                    fill={isActive ? '#F5D78E' : isHovered ? '#F0D070' : '#E8C36A'}
                    filter="url(#method-glow)"/>
            <!-- Label -->
            <text x={pos.x + offset.dx} y={pos.y + offset.dy}
                  text-anchor={offset.anchor} class="star-label"
                  fill={isActive || isHovered ? '#F5F0E8' : '#C0C8D8'}>
              {method.name}
            </text>
          </g>
        {/each}

        <!-- ═══ DECORATIVE ELEMENTS ═══ -->
        <g pointer-events="none">
          <!-- Subtle coordinate grid — like a star chart -->
          <!-- Vertical grid lines -->
          {#each [200, 400, 600, 800] as x}
            <line x1={x} y1="0" x2={x} y2={VIEW_H} stroke="#2A3A50" stroke-width="0.3" stroke-dasharray="2,10" opacity="0.2"/>
          {/each}
          <!-- Horizontal grid lines -->
          {#each [125, 250, 375] as y}
            <line x1="0" y1={y} x2={VIEW_W} y2={y} stroke="#2A3A50" stroke-width="0.3" stroke-dasharray="2,10" opacity="0.2"/>
          {/each}

          <!-- Tick marks along edges -->
          {#each [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000] as x}
            <line x1={x} y1={VIEW_H - 3} x2={x} y2={VIEW_H} stroke="#3A4A60" stroke-width="0.4" opacity="0.5"/>
            <line x1={x} y1="0" x2={x} y2="3" stroke="#3A4A60" stroke-width="0.4" opacity="0.5"/>
          {/each}
          {#each [0, 100, 200, 300, 400, 500] as y}
            <line x1="0" y1={y} x2="3" y2={y} stroke="#3A4A60" stroke-width="0.4" opacity="0.5"/>
            <line x1={VIEW_W - 3} y1={y} x2={VIEW_W} y2={y} stroke="#3A4A60" stroke-width="0.4" opacity="0.5"/>
          {/each}

          <!-- Compass rose — upper right, matching map's style but in sky colors -->
          <g transform="translate(940, 50)" opacity="0.35">
            <circle cx="0" cy="0" r="12" fill="none" stroke="#C17A3A" stroke-width="0.3"/>
            <circle cx="0" cy="0" r="11" fill="none" stroke="#D4A44C" stroke-width="0.15"/>
            <polygon points="0,-10 -1.5,-3 0,-4 1.5,-3" fill="#D4A44C"/>
            <polygon points="0,10 -1.5,3 0,4 1.5,3" fill="#6B7A90"/>
            <polygon points="10,0 3,-1.5 4,0 3,1.5" fill="#6B7A90"/>
            <polygon points="-10,0 -3,-1.5 -4,0 -3,1.5" fill="#6B7A90"/>
            <line x1="7" y1="-7" x2="3" y2="-3" stroke="#6B7A90" stroke-width="0.25"/>
            <line x1="7" y1="7" x2="3" y2="3" stroke="#6B7A90" stroke-width="0.25"/>
            <line x1="-7" y1="-7" x2="-3" y2="-3" stroke="#6B7A90" stroke-width="0.25"/>
            <line x1="-7" y1="7" x2="-3" y2="3" stroke="#6B7A90" stroke-width="0.25"/>
            <circle cx="0" cy="0" r="1" fill="#D4A44C"/>
            <text x="0" y="-14" text-anchor="middle" class="compass-letter">N</text>
          </g>

          <!-- Ghost constellation names at bottom -->
          <text x="200" y={VIEW_H - 15} text-anchor="middle" class="ghost-label">THE FILTER</text>
          <text x="500" y={VIEW_H - 15} text-anchor="middle" class="ghost-label">THE VESSEL</text>
          <text x="800" y={VIEW_H - 15} text-anchor="middle" class="ghost-label">THE FORCE</text>
        </g>

        <!-- ═══ OVERLAYS ═══ -->
        <!-- Vignette -->
        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#sky-vignette)" pointer-events="none"/>

        <!-- Inner shadows at frame edges -->
        <rect x="0" y="0" width={VIEW_W} height="8" fill="url(#shadow-top)" pointer-events="none"/>
        <rect x="0" y={VIEW_H - 7} width={VIEW_W} height="7" fill="url(#shadow-bottom)" pointer-events="none"/>
        <rect x="0" y="0" width="8" height={VIEW_H} fill="url(#shadow-left)" pointer-events="none"/>
        <rect x={VIEW_W - 8} y="0" width="8" height={VIEW_H} fill="url(#shadow-right)" pointer-events="none"/>
      </svg>

      <!-- Legend cartouche — bottom left -->
      <div class="chart-legend">
        <span class="legend-header">Star Key</span>
        <div class="legend-entries">
          <div class="legend-entry">
            <span class="legend-star legend-hub"></span>
            <span>Extraction type</span>
          </div>
          <div class="legend-entry">
            <span class="legend-star legend-method"></span>
            <span>Brewing method (click to explore)</span>
          </div>
          <div class="legend-entry">
            <span class="legend-line"></span>
            <span>Constellation connection</span>
          </div>
        </div>
      </div>

      <!-- Detail Panel -->
      {#if showPanel && activeMethod}
        <div class="detail-panel" class:closing={panelClosing}>
          <button class="panel-close" onclick={closePanel} aria-label="Close panel">
            <span class="panel-close-text">&larr; Back to Sky</span>
          </button>

          <div class="panel-content">
            <span class="panel-branch">{branchInfo[activeMethod.branch].name}</span>
            <h2 class="panel-title">{activeMethod.name}</h2>
            <p class="panel-oneliner">{activeMethod.oneLiner}</p>

            <!-- Articles — primary CTA -->
            {#if activeMethod.articles.length > 0}
              <div class="panel-section">
                <div class="article-links">
                  {#each activeMethod.articles as article}
                    <a href={`/blog/${article.slug}/`} class="article-link">
                      <span class="article-arrow">&rarr;</span>
                      <span>{article.title}</span>
                    </a>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Brew Parameters -->
            <div class="panel-section">
              <h3>Brew Parameters</h3>
              <div class="param-grid">
                <div class="param-row">
                  <span class="param-label">Ratio</span>
                  <span class="param-value">{activeMethod.parameters.ratio}</span>
                </div>
                <div class="param-row">
                  <span class="param-label">Grind Size</span>
                  <span class="param-value">{activeMethod.parameters.grindSize}</span>
                </div>
                <div class="param-row">
                  <span class="param-label">Temperature</span>
                  <span class="param-value">{activeMethod.parameters.waterTemp}</span>
                </div>
                <div class="param-row">
                  <span class="param-label">Brew Time</span>
                  <span class="param-value">{activeMethod.parameters.brewTime}</span>
                </div>
                <div class="param-row">
                  <span class="param-label">Difficulty</span>
                  <span class="param-value">{difficultyDots(activeMethod.parameters.difficulty)} {difficultyLabel(activeMethod.parameters.difficulty)}</span>
                </div>
              </div>
            </div>

            <!-- The Physics -->
            <div class="panel-section">
              <h3>The Physics</h3>
              <p class="panel-body">{activeMethod.physics}</p>
            </div>

            <!-- What Makes It Unique -->
            <div class="panel-section">
              <h3>What Makes It Unique</h3>
              <p class="panel-body">{activeMethod.whatMakesItUnique}</p>
            </div>

            <!-- Comparisons -->
            {#if activeMethod.comparisons.length > 0}
              <div class="panel-section">
                <h3>Compare</h3>
                <div class="comparison-list">
                  {#each activeMethod.comparisons as comp}
                    {@const other = methodById.get(comp.methodId)}
                    {#if other}
                      <div class="comparison-item">
                        <button class="comp-link" onclick={() => selectMethod(comp.methodId)}>
                          vs {other.name}
                        </button>
                        <p class="comp-desc">{comp.relationship}</p>
                      </div>
                    {/if}
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Mobile: Method Cards (below chart) -->
  {#if isMobile && !showPanel}
    <div class="mobile-methods">
      {#each branches as branch}
        <div class="mobile-branch">
          <h2 class="mobile-branch-title">{branch.name}</h2>
          <p class="mobile-branch-desc">{branch.subtitle}</p>
          {#each methodsByBranch(branch.id) as method}
            <button class="method-card" onclick={() => selectMethod(method.id)}>
              <div class="method-card-header">
                <span class="method-card-name">{method.name}</span>
                <span class="method-card-difficulty">{difficultyDots(method.parameters.difficulty)}</span>
              </div>
              <p class="method-card-desc">{method.oneLiner}</p>
              <span class="method-card-articles">{method.articles.length} article{method.articles.length !== 1 ? 's' : ''}</span>
            </button>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .brew-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .brew-header {
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

  .brew-header h1 {
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
  .brew-layout {
    position: relative;
  }

  .chart-wrapper {
    width: 100%;
    position: relative;
  }

  /* SVG Chart */
  .chart-svg {
    width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.08);
  }

  .chart-svg:focus-visible {
    outline: 2px solid #D4A44C;
    outline-offset: 2px;
  }

  /* ═══ STAR STYLES ═══ */

  /* Field stars — gentle twinkle via opacity animation */
  .field-star {
    animation: twinkle ease-in-out infinite;
  }

  @keyframes twinkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.2; }
  }

  /* Hub stars */
  .hub-group {
    transition: opacity 0.4s ease;
  }

  .hub-label {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 10px;
    fill: #D4A44C;
    font-weight: 700;
    letter-spacing: 0.25em;
  }

  .hub-subtitle {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 6.5px;
    fill: #8898B0;
    font-weight: 400;
    letter-spacing: 0.05em;
    font-style: italic;
  }

  /* Method stars */
  .star-node {
    cursor: pointer;
    transition: opacity 0.3s ease;
    outline: none;
  }

  .star-node:focus-visible circle:last-of-type {
    stroke: #F5D78E;
    stroke-width: 1.5;
  }

  .star-dimmed {
    opacity: 0.4;
  }

  .star-label {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 7px;
    font-weight: 600;
    letter-spacing: 0.04em;
    transition: fill 0.2s ease;
    pointer-events: none;
  }

  /* Constellation lines */
  .constellation-line {
    transition: opacity 0.4s ease;
  }

  /* Ghost labels at bottom */
  .ghost-label {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 8px;
    fill: #4A5A70;
    opacity: 0.35;
    font-style: italic;
    letter-spacing: 0.3em;
    font-weight: 400;
  }

  .compass-letter {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 5px;
    fill: #D4A44C;
    font-weight: 700;
  }

  /* ═══ LEGEND ═══ */
  .chart-legend {
    position: absolute;
    bottom: 1.25rem;
    left: 1.25rem;
    background: rgba(20, 26, 40, 0.88);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(212, 164, 76, 0.4);
    border-radius: 4px;
    padding: 0.6rem 0.85rem;
    z-index: 5;
  }

  .legend-header {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 0.7rem;
    font-weight: 700;
    color: #D4A44C;
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
    color: #8898B0;
  }

  .legend-star {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-hub {
    background: #D4A44C;
    box-shadow: 0 0 4px rgba(212, 164, 76, 0.5);
  }

  .legend-method {
    background: #E8C36A;
    width: 8px;
    height: 8px;
    box-shadow: 0 0 3px rgba(232, 195, 106, 0.4);
  }

  .legend-line {
    width: 16px;
    height: 1px;
    background: #B89A40;
    opacity: 0.5;
    flex-shrink: 0;
  }

  /* ═══ DETAIL PANEL (dark theme) ═══ */
  .detail-panel {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 380px;
    overflow-y: auto;
    background: #141A28;
    border: 1px solid #2A3548;
    border-left: 3px solid #D4A44C;
    border-radius: 0 8px 8px 0;
    box-shadow: -8px 0 30px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2);
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
    color: #D4A44C;
    transition: color 0.15s;
  }

  .panel-close:hover .panel-close-text {
    color: #E8C36A;
  }

  .panel-content {
    padding: 1.75rem 1.5rem 1.5rem;
  }

  .panel-branch {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #D4A44C;
  }

  .panel-title {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 1.75rem;
    font-weight: 700;
    color: #F5F0E8;
    margin: 0.25rem 0 0.75rem;
    line-height: 1.2;
  }

  .panel-oneliner {
    font-size: 0.9rem;
    line-height: 1.75;
    color: #A0A8B8;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  /* Panel sections */
  .panel-section {
    margin-bottom: 1.5rem;
  }

  .panel-section h3 {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #6B7A90;
    margin-bottom: 0.6rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #2A3548;
  }

  .panel-body {
    font-size: 0.85rem;
    line-height: 1.75;
    color: #C8CCD5;
    margin: 0;
  }

  /* Article links — dark theme */
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
    color: #E8E0D0;
    font-size: 0.85rem;
    line-height: 1.4;
    border-left: 2px solid #D4A44C;
    background: linear-gradient(90deg, rgba(212, 164, 76, 0.08), transparent);
    border-radius: 0 4px 4px 0;
    margin-bottom: 0.35rem;
    transition: background 0.15s, border-color 0.15s;
  }

  .article-link:hover {
    background: linear-gradient(90deg, rgba(212, 164, 76, 0.18), transparent);
    border-left-color: #E8C36A;
    color: #F5F0E8;
  }

  .article-arrow {
    color: #D4A44C;
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 0.05rem;
  }

  /* Brew parameters grid */
  .param-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .param-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid #1E2A3D;
    gap: 1rem;
  }

  .param-row:last-child {
    border-bottom: none;
  }

  .param-label {
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.8rem;
    color: #6B7A90;
    font-weight: 500;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .param-value {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 0.85rem;
    color: #F5F0E8;
    text-align: right;
    font-weight: 600;
  }

  /* Comparisons */
  .comparison-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .comparison-item {
    padding-left: 0.75rem;
    border-left: 2px solid #2A3548;
  }

  .comp-link {
    background: none;
    border: none;
    cursor: pointer;
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.8rem;
    font-weight: 600;
    color: #D4A44C;
    padding: 0;
    margin-bottom: 0.25rem;
    display: block;
    transition: color 0.15s;
  }

  .comp-link:hover {
    color: #E8C36A;
  }

  .comp-desc {
    font-size: 0.8rem;
    color: #8898B0;
    line-height: 1.5;
    margin: 0;
  }

  /* ═══ MOBILE ═══ */
  .mobile-methods {
    margin-top: 2rem;
  }

  .mobile-branch {
    margin-bottom: 2rem;
  }

  .mobile-branch-title {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 1.35rem;
    font-weight: 700;
    color: #1A1A1A;
    margin-bottom: 0.25rem;
  }

  .mobile-branch-desc {
    font-size: 0.85rem;
    color: #6B6560;
    margin-bottom: 1rem;
  }

  .method-card {
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

  .method-card:hover {
    border-color: #D4A44C;
  }

  .method-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
  }

  .method-card-name {
    font-family: var(--font-serif, 'Playfair Display', serif);
    font-size: 1.1rem;
    font-weight: 700;
    color: #1A1A1A;
  }

  .method-card-difficulty {
    font-size: 0.75rem;
    color: #D4A44C;
    letter-spacing: 0.05em;
  }

  .method-card-desc {
    font-size: 0.85rem;
    color: #6B6560;
    margin: 0 0 0.4rem;
    line-height: 1.4;
  }

  .method-card-articles {
    font-size: 0.75rem;
    color: #9B9590;
  }

  @media (max-width: 768px) {
    .chart-legend {
      display: none;
    }

    .brew-header h1 {
      font-size: 1.75rem;
    }

    .detail-panel {
      width: 100%;
      min-width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      top: auto;
      max-height: 70vh;
      border-radius: 16px 16px 0 0;
      border-left: none;
      border-top: 3px solid #D4A44C;
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
