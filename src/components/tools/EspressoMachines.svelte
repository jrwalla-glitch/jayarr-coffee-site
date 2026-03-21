<script>
  import { onMount } from 'svelte';
  import machineData from '../../data/espressoMachines.json';
  import { machineSvgs } from '../../data/espressoMachineSvgs';

  const machines = machineData.machines;

  // --- State ---
  let activeTab = $state('semi_auto');
  let currentIndex = $state(0);
  let isTransitioning = $state(false);
  let transitionDirection = $state('right');

  // --- Derived ---
  const tabCounts = $derived({
    semi_auto: machines.filter(m => m.type === 'semi_auto').length,
    super_auto: machines.filter(m => m.type === 'super_auto').length,
    nespresso: machines.filter(m => m.type === 'nespresso').length,
  });

  const filtered = $derived(machines.filter(m => m.type === activeTab));
  const currentMachine = $derived(filtered[currentIndex] || filtered[0]);
  const totalInCategory = $derived(filtered.length);

  // --- Label maps ---
  const typeLabels = {
    semi_auto: 'Semi-Automatic',
    super_auto: 'Super-Automatic',
    nespresso: 'Nespresso',
  };

  const boilerLabels = {
    thermocoil: 'Thermocoil',
    thermoblock: 'Thermoblock',
    single_boiler: 'Single Boiler',
    dual_boiler: 'Dual Boiler',
  };

  const grinderLabels = {
    null: 'None (BYO)',
    conical_burr: 'Conical Burr',
    ceramic_burr: 'Ceramic Burr',
    steel_burr: 'Steel Burr',
  };

  const steamLabels = {
    commercial: 'Commercial Wand',
    panarello: 'Panarello',
    auto_frother: 'Auto Frother',
    none: 'No Steamer',
  };

  function formatGrinder(val) {
    if (val === null || val === undefined) return 'None (BYO)';
    return grinderLabels[val] || val;
  }

  function formatBoiler(val) {
    return boilerLabels[val] || val;
  }

  function formatSteam(val) {
    return steamLabels[val] || val;
  }

  function formatType(val) {
    return typeLabels[val] || val;
  }

  function formatPrice(price) {
    return '$' + price.toLocaleString('en-US');
  }

  // --- Navigation ---
  function switchTab(tab) {
    if (tab === activeTab) return;
    activeTab = tab;
    currentIndex = 0;
  }

  function navigate(direction) {
    if (isTransitioning) return;
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % totalInCategory
      : (currentIndex - 1 + totalInCategory) % totalInCategory;
    transitionDirection = direction === 'next' ? 'right' : 'left';
    isTransitioning = true;
    setTimeout(() => {
      currentIndex = newIndex;
      isTransitioning = false;
    }, 200);
  }

  function goToMachine(index) {
    if (index === currentIndex || isTransitioning) return;
    transitionDirection = index > currentIndex ? 'right' : 'left';
    isTransitioning = true;
    setTimeout(() => {
      currentIndex = index;
      isTransitioning = false;
    }, 200);
  }

  // --- Keyboard support ---
  function handleKeydown(e) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigate('next');
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigate('prev');
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });

  // --- Touch / swipe support ---
  let touchStartX = $state(0);
  let touchStartY = $state(0);

  function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function handleTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Only trigger if horizontal swipe is dominant and long enough
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) navigate('next');
      else navigate('prev');
    }
  }
</script>

<div class="espresso-guide" role="application" aria-label="Espresso Machine Guide">

  <!-- Category Tabs -->
  <div class="tab-bar" role="tablist">
    <button
      class="tab-btn"
      class:tab-btn--active={activeTab === 'semi_auto'}
      role="tab"
      aria-selected={activeTab === 'semi_auto'}
      onclick={() => switchTab('semi_auto')}
    >
      Semi-Auto
      <span class="tab-badge">{tabCounts.semi_auto}</span>
    </button>
    <button
      class="tab-btn"
      class:tab-btn--active={activeTab === 'super_auto'}
      role="tab"
      aria-selected={activeTab === 'super_auto'}
      onclick={() => switchTab('super_auto')}
    >
      Super-Auto
      <span class="tab-badge">{tabCounts.super_auto}</span>
    </button>
    <button
      class="tab-btn"
      class:tab-btn--active={activeTab === 'nespresso'}
      role="tab"
      aria-selected={activeTab === 'nespresso'}
      onclick={() => switchTab('nespresso')}
    >
      Nespresso
      <span class="tab-badge">{tabCounts.nespresso}</span>
    </button>
  </div>

  <!-- Main Brochure View -->
  {#if currentMachine}
    <div
      class="brochure"
      ontouchstart={handleTouchStart}
      ontouchend={handleTouchEnd}
    >
      <!-- Previous arrow -->
      <button
        class="nav-arrow nav-arrow--prev"
        onclick={() => navigate('prev')}
        aria-label="Previous machine"
        disabled={totalInCategory <= 1}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      <!-- Brochure content -->
      <div class="brochure-content" class:brochure-content--exiting={isTransitioning}>

        <!-- SVG Illustration -->
        <div class="brochure-illustration">
          <div class="svg-container">
            {#if machineSvgs[currentMachine.name]}
              {@html machineSvgs[currentMachine.name]}
            {:else}
              <div class="svg-placeholder">
                <span>No illustration</span>
              </div>
            {/if}
          </div>
          <div class="illustration-accent" style:background-color={currentMachine.color_hex}></div>
        </div>

        <!-- Info Panel -->
        <div class="brochure-info">

          <!-- Header -->
          <div class="info-header">
            <span class="info-brand">{currentMachine.brand}</span>
            <h3 class="info-name">{currentMachine.name}</h3>
            <div class="info-price">{formatPrice(currentMachine.price_usd)}</div>
            <p class="info-tagline">{currentMachine.best_for}</p>
          </div>

          <!-- Specs Grid -->
          <div class="specs-grid">
            <div class="spec-item">
              <span class="spec-label">Type</span>
              <span class="spec-value">{formatType(currentMachine.type)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Boiler</span>
              <span class="spec-value">{formatBoiler(currentMachine.boiler_type)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Pressure</span>
              <span class="spec-value">{currentMachine.pressure_bar} bar</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Grinder</span>
              <span class="spec-value">{formatGrinder(currentMachine.grinder)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Steam</span>
              <span class="spec-value">{formatSteam(currentMachine.steam_wand)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">PID</span>
              <span class="spec-value">{currentMachine.pid_control ? 'Yes' : 'No'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Pre-Infusion</span>
              <span class="spec-value">{currentMachine.pre_infusion ? 'Yes' : 'No'}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Tank</span>
              <span class="spec-value">{currentMachine.water_tank_liters}L</span>
            </div>
          </div>

          <!-- Key Features -->
          <div class="features-section">
            <span class="section-label">Key Features</span>
            <ul class="features-list">
              {#each currentMachine.key_features as feature}
                <li>{feature}</li>
              {/each}
            </ul>
          </div>

          <!-- Description -->
          <div class="description-section">
            <span class="section-label">Our Take</span>
            <p class="description-text">{currentMachine.description}</p>
          </div>

          <!-- Buy button -->
          {#if currentMachine.amazon_url}
            <a
              href={currentMachine.amazon_url}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              class="buy-button"
            >
              Check Price on Amazon
            </a>
          {/if}

          <!-- Physical specs -->
          <div class="physical-specs">
            <span class="physical-spec">{currentMachine.dimensions_inches}"</span>
            <span class="physical-divider">&middot;</span>
            <span class="physical-spec">{currentMachine.weight_lbs} lbs</span>
          </div>

        </div>
      </div>

      <!-- Next arrow -->
      <button
        class="nav-arrow nav-arrow--next"
        onclick={() => navigate('next')}
        aria-label="Next machine"
        disabled={totalInCategory <= 1}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>

    <!-- Page indicator -->
    <div class="page-indicator">
      <span class="page-current">{currentIndex + 1}</span>
      <span class="page-sep">of</span>
      <span class="page-total">{totalInCategory}</span>
    </div>

    <!-- Quick-compare bar -->
    <div class="compare-bar">
      <div class="compare-track">
        {#each filtered as machine, i (machine.name)}
          <button
            class="compare-thumb"
            class:compare-thumb--active={i === currentIndex}
            onclick={() => goToMachine(i)}
            aria-label="Jump to {machine.name}"
            title={machine.name}
          >
            <span class="thumb-name">{machine.name.split(' ').slice(-1)[0]}</span>
            <span class="thumb-price">{formatPrice(machine.price_usd)}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}

</div>

<style>
  /* === Container === */
  .espresso-guide {
    display: flex;
    flex-direction: column;
    gap: 0;
    max-width: 1000px;
    margin: 0 auto;
  }

  /* === Section Labels === */
  .section-label {
    display: block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #C17A3A;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  /* === Tab Bar === */
  .tab-bar {
    display: flex;
    gap: 0;
    border-bottom: 2px solid rgba(26, 26, 26, 0.08);
    margin-bottom: 1.5rem;
  }

  .tab-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: #6B6560;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }

  .tab-btn:hover {
    color: #2C2C2C;
    background: rgba(193, 122, 58, 0.04);
  }

  .tab-btn--active {
    color: #C17A3A;
    border-bottom-color: #C17A3A;
    font-weight: 600;
  }

  .tab-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    font-size: 0.65rem;
    font-weight: 600;
    background: rgba(26, 26, 26, 0.06);
    color: #6B6560;
  }

  .tab-btn--active .tab-badge {
    background: rgba(193, 122, 58, 0.12);
    color: #C17A3A;
  }

  /* === Brochure Layout === */
  .brochure {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0;
  }

  .brochure-content {
    display: flex;
    flex: 1;
    gap: 2rem;
    min-height: 480px;
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  .brochure-content--exiting {
    opacity: 0;
  }

  /* === SVG Illustration === */
  .brochure-illustration {
    flex: 0 0 340px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .svg-container {
    width: 100%;
    background: #1A1A1A;
    border-radius: 6px;
    padding: 2rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 380px;
    position: relative;
    overflow: hidden;
  }

  .svg-container :global(svg) {
    width: 100%;
    height: auto;
    max-height: 340px;
    display: block;
  }

  .illustration-accent {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 0 0 6px 6px;
    opacity: 0.6;
  }

  .svg-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 300px;
    color: #555;
    font-size: 0.8rem;
    font-style: italic;
  }

  /* === Info Panel === */
  .brochure-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 0.5rem 0;
    min-width: 0;
  }

  .info-header {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .info-brand {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: #9B9590;
    font-weight: 500;
  }

  .info-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: #1A1A1A;
    line-height: 1.15;
    margin: 0;
    letter-spacing: -0.02em;
  }

  .info-price {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #C17A3A;
    margin-top: 0.15rem;
  }

  .info-tagline {
    font-size: 0.8rem;
    color: #6B6560;
    line-height: 1.4;
    margin: 0.2rem 0 0;
    font-style: italic;
  }

  /* === Specs Grid === */
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    border: 1px solid rgba(26, 26, 26, 0.08);
    border-radius: 4px;
    overflow: hidden;
  }

  .spec-item {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 0.6rem;
    border-right: 1px solid rgba(26, 26, 26, 0.06);
    border-bottom: 1px solid rgba(26, 26, 26, 0.06);
  }

  .spec-item:nth-child(4n) {
    border-right: none;
  }

  .spec-item:nth-last-child(-n+4) {
    border-bottom: none;
  }

  .spec-label {
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #9B9590;
    font-weight: 500;
    margin-bottom: 0.15rem;
  }

  .spec-value {
    font-size: 0.72rem;
    font-weight: 600;
    color: #2C2C2C;
    line-height: 1.2;
  }

  /* === Features === */
  .features-section {
    display: flex;
    flex-direction: column;
  }

  .features-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .features-list li {
    position: relative;
    padding-left: 1rem;
    font-size: 0.75rem;
    color: #2C2C2C;
    line-height: 1.4;
  }

  .features-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.45em;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #C17A3A;
    opacity: 0.5;
  }

  /* === Description === */
  .description-section {
    display: flex;
    flex-direction: column;
  }

  .description-text {
    font-size: 0.78rem;
    color: #4A4540;
    line-height: 1.65;
    margin: 0;
  }

  /* === Buy Button === */
  .buy-button {
    display: inline-block;
    background: #C17A3A;
    color: #FFF;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    text-decoration: none;
    padding: 0.6rem 1.5rem;
    border-radius: 4px;
    text-align: center;
    transition: background 0.2s ease;
    margin-top: 0.25rem;
  }
  .buy-button:hover {
    background: #A66830;
  }

  /* === Physical Specs === */
  .physical-specs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(26, 26, 26, 0.06);
  }

  .physical-spec {
    font-size: 0.65rem;
    color: #9B9590;
    font-weight: 500;
  }

  .physical-divider {
    color: #DFD8CA;
  }

  /* === Navigation Arrows === */
  .nav-arrow {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid rgba(26, 26, 26, 0.1);
    border-radius: 50%;
    color: #2C2C2C;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
  }

  .nav-arrow:hover:not(:disabled) {
    border-color: #C17A3A;
    color: #C17A3A;
    background: rgba(193, 122, 58, 0.04);
  }

  .nav-arrow:disabled {
    opacity: 0.2;
    cursor: default;
  }

  .nav-arrow svg {
    width: 18px;
    height: 18px;
  }

  .nav-arrow--prev {
    margin-right: 1rem;
  }

  .nav-arrow--next {
    margin-left: 1rem;
  }

  /* === Page Indicator === */
  .page-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;
    margin-top: 1rem;
    font-size: 0.7rem;
    color: #9B9590;
  }

  .page-current {
    font-weight: 700;
    color: #C17A3A;
    font-size: 0.85rem;
  }

  .page-sep {
    font-weight: 400;
  }

  .page-total {
    font-weight: 500;
    color: #6B6560;
  }

  /* === Quick-Compare Bar === */
  .compare-bar {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(26, 26, 26, 0.06);
    overflow-x: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .compare-bar::-webkit-scrollbar {
    display: none;
  }

  .compare-track {
    display: flex;
    gap: 0.5rem;
    padding-bottom: 0.25rem;
  }

  .compare-thumb {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
    padding: 0.4rem 0.65rem;
    border: 1px solid rgba(26, 26, 26, 0.08);
    border-radius: 3px;
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
    min-width: 0;
  }

  .compare-thumb:hover {
    border-color: rgba(193, 122, 58, 0.3);
    background: rgba(193, 122, 58, 0.03);
  }

  .compare-thumb--active {
    border-color: #C17A3A;
    background: rgba(193, 122, 58, 0.06);
  }

  .thumb-name {
    font-size: 0.6rem;
    font-weight: 600;
    color: #2C2C2C;
    white-space: nowrap;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .compare-thumb--active .thumb-name {
    color: #C17A3A;
  }

  .thumb-price {
    font-size: 0.55rem;
    color: #9B9590;
    white-space: nowrap;
  }

  /* === Responsive: Mobile === */
  @media (max-width: 768px) {
    .brochure-content {
      flex-direction: column;
      gap: 1.25rem;
      min-height: auto;
    }

    .brochure-illustration {
      flex: none;
      width: 100%;
    }

    .svg-container {
      padding: 1.5rem 1rem;
      min-height: 280px;
    }

    .svg-container :global(svg) {
      max-height: 260px;
    }

    .brochure {
      flex-direction: column;
    }

    .nav-arrow--prev,
    .nav-arrow--next {
      display: none;
    }

    .info-name {
      font-size: 1.35rem;
    }

    .info-price {
      font-size: 1.15rem;
    }

    .specs-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .specs-grid .spec-item:nth-child(4n) {
      border-right: 1px solid rgba(26, 26, 26, 0.06);
    }

    .specs-grid .spec-item:nth-child(2n) {
      border-right: none;
    }

    .specs-grid .spec-item:nth-last-child(-n+4) {
      border-bottom: 1px solid rgba(26, 26, 26, 0.06);
    }

    .specs-grid .spec-item:nth-last-child(-n+2) {
      border-bottom: none;
    }

    /* Mobile navigation strip */
    .mobile-nav {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
  }

  /* Mobile nav buttons shown below tabs */
  @media (max-width: 768px) {
    .brochure {
      position: relative;
    }

    /* Re-show arrows as inline controls on mobile */
    .espresso-guide {
      gap: 0;
    }
  }

  /* Small tablets and up — side-by-side layout */
  @media (min-width: 769px) {
    .brochure-content {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  /* Very small screens */
  @media (max-width: 480px) {
    .tab-btn {
      font-size: 0.7rem;
      padding: 0.6rem 0.5rem;
      gap: 0.3rem;
    }

    .tab-badge {
      min-width: 17px;
      height: 17px;
      font-size: 0.55rem;
    }

    .specs-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .compare-thumb {
      padding: 0.3rem 0.5rem;
    }

    .thumb-name {
      font-size: 0.55rem;
      max-width: 60px;
    }
  }
</style>
