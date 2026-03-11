<script>
  let method = $state('pour-over');
  let mode = $state('coffee-to-water'); // or 'water-to-coffee'
  let inputAmount = $state(18);
  let customRatio = $state(null);

  // Ratios sourced from brewMethodData.ts + COFFEE_KNOWLEDGE_SYNTHESIS.md
  // Default ratio is midpoint of canonical range
  const methods = [
    { id: 'pour-over', name: 'Pour Over', ratio: 16, range: '1:15–1:17', icon: 'V', desc: 'V60, Chemex, Kalita Wave — medium-fine grind, 92–96°C', guide: '/blog/ultimate-pour-over-coffee-guide-and-best-v60-technique/', guideLabel: 'Pour Over Guide' },
    { id: 'french-press', name: 'French Press', ratio: 16, range: '1:15–1:17', icon: 'F', desc: 'Coarse grind, 4 min steep, full body — 93–96°C', guide: '/blog/how-to-use-a-french-press-the-most-amazing-coffee-youve-ever-had/', guideLabel: 'French Press Guide' },
    { id: 'aeropress', name: 'AeroPress', ratio: 12, range: '1:6–1:16', icon: 'A', desc: 'Varies widely by recipe — medium-fine, 80–96°C', guide: '/blog/why-and-how-you-should-use-an-aeropress/', guideLabel: 'AeroPress Guide' },
    { id: 'cold-brew', name: 'Cold Brew', ratio: 7, range: '1:5–1:8', icon: 'C', desc: 'Concentrate — extra coarse, room temp, 12–24 hours', guide: '/blog/whats-great-about-cold-brew-toddy-cold-brew-tutorial/', guideLabel: 'Cold Brew Guide' },
    { id: 'espresso', name: 'Espresso', ratio: 2, range: '1:2–1:2.5', icon: 'E', desc: 'Very fine grind, 9 bars, 25–35 sec pull — 90–96°C', guide: '/blog/best-espresso-machines-under-500-2026-7-picks-for-every-budget/', guideLabel: 'Espresso Machines' },
    { id: 'moka-pot', name: 'Moka Pot', ratio: 8, range: '1:7–1:10', icon: 'M', desc: 'Fine grind (coarser than espresso), stovetop ~1.5 bars', guide: '/blog/moka-pot-brewing-guide/', guideLabel: 'Moka Pot Guide' },
  ];

  let activeMethod = $derived(methods.find(m => m.id === method));
  let ratio = $derived(customRatio ?? activeMethod?.ratio ?? 16);

  let result = $derived(() => {
    if (mode === 'coffee-to-water') {
      return { coffee: inputAmount, water: Math.round(inputAmount * ratio) };
    } else {
      return { coffee: Math.round((inputAmount / ratio) * 10) / 10, water: inputAmount };
    }
  });

  function selectMethod(id) {
    method = id;
    customRatio = null;
    // Set sensible default input for each method
    if (mode === 'coffee-to-water') {
      if (id === 'espresso') inputAmount = 18;
      else if (id === 'cold-brew') inputAmount = 100;
      else if (id === 'moka-pot') inputAmount = 20;
      else if (id === 'aeropress') inputAmount = 15;
      else inputAmount = 18;
    } else {
      if (id === 'espresso') inputAmount = 36;
      else if (id === 'cold-brew') inputAmount = 700;
      else if (id === 'moka-pot') inputAmount = 160;
      else if (id === 'aeropress') inputAmount = 180;
      else inputAmount = 300;
    }
  }

  function toggleMode() {
    const r = result();
    if (mode === 'coffee-to-water') {
      mode = 'water-to-coffee';
      inputAmount = r.water;
    } else {
      mode = 'coffee-to-water';
      inputAmount = r.coffee;
    }
  }

  function adjustRatio(delta) {
    const newRatio = (customRatio ?? ratio) + delta;
    if (newRatio >= 1 && newRatio <= 25) {
      customRatio = newRatio;
    }
  }
</script>

<div class="brew-calc">
  <!-- Method selector -->
  <div class="methods">
    <span class="section-label">Brew Method</span>
    <div class="method-grid">
      {#each methods as m}
        <button
          class="method-btn"
          class:method-btn--active={method === m.id}
          onclick={() => selectMethod(m.id)}
        >
          <span class="method-icon">{m.icon}</span>
          <span class="method-name">{m.name}</span>
        </button>
      {/each}
    </div>
    <p class="method-desc">
      {activeMethod?.desc} <span class="method-range">Typical range: {activeMethod?.range}</span>
      {#if activeMethod?.guide}
        <a href={activeMethod.guide} class="method-guide">{activeMethod.guideLabel} &rarr;</a>
      {/if}
    </p>
  </div>

  <!-- Ratio display & adjustment -->
  <div class="ratio-section">
    <span class="section-label">Ratio</span>
    <div class="ratio-display">
      <button class="ratio-adj" onclick={() => adjustRatio(-1)} aria-label="Decrease ratio">-</button>
      <div class="ratio-value">
        <span class="ratio-num">1 : {ratio}</span>
        {#if customRatio !== null}
          <button class="ratio-reset" onclick={() => customRatio = null}>reset</button>
        {/if}
      </div>
      <button class="ratio-adj" onclick={() => adjustRatio(1)} aria-label="Increase ratio">+</button>
    </div>
    <p class="ratio-hint">
      {ratio < 10 ? 'Strong / concentrated' : ratio < 14 ? 'Bold' : ratio < 17 ? 'Balanced' : 'Light / delicate'}
    </p>
  </div>

  <!-- Input / Output -->
  <div class="calc-section">
    <div class="calc-row">
      <div class="calc-input-group">
        <label class="section-label" for="brew-input">
          {mode === 'coffee-to-water' ? 'Coffee (g)' : 'Water (ml)'}
        </label>
        <div class="input-wrap">
          <input
            id="brew-input"
            type="number"
            bind:value={inputAmount}
            min="1"
            max="5000"
            step={mode === 'coffee-to-water' ? 0.5 : 10}
          />
          <span class="input-unit">{mode === 'coffee-to-water' ? 'g' : 'ml'}</span>
        </div>
      </div>

      <button class="swap-btn" onclick={toggleMode} aria-label="Swap input/output">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
      </button>

      <div class="calc-output-group">
        <span class="section-label">
          {mode === 'coffee-to-water' ? 'Water (ml)' : 'Coffee (g)'}
        </span>
        <div class="output-value">
          {mode === 'coffee-to-water' ? result().water : result().coffee}
          <span class="output-unit">{mode === 'coffee-to-water' ? 'ml' : 'g'}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Visual ratio bar -->
  <div class="ratio-bar-wrap">
    <div class="ratio-bar">
      <div
        class="ratio-bar-coffee"
        style:width="{Math.min((1 / (1 + ratio)) * 100, 50)}%"
      >
        <span class="bar-label">{result().coffee}g</span>
      </div>
      <div class="ratio-bar-water" style:flex="1">
        <span class="bar-label">{result().water}ml</span>
      </div>
    </div>
    <div class="bar-legend">
      <span class="legend-coffee">Coffee</span>
      <span class="legend-water">Water</span>
    </div>
  </div>

  <!-- Quick reference -->
  <div class="quick-ref">
    <span class="section-label">Quick Reference</span>
    <div class="ref-table">
      <div class="ref-header">
        <span>Cups</span>
        <span>Coffee</span>
        <span>Water</span>
      </div>
      {#each [1, 2, 3, 4] as cups}
        {@const waterMl = cups * 250}
        {@const coffeeG = Math.round((waterMl / ratio) * 10) / 10}
        <div class="ref-row" class:ref-row--highlight={cups === 1}>
          <span>{cups}</span>
          <span>{coffeeG}g</span>
          <span>{waterMl}ml</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .brew-calc {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section-label {
    display: block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #C17A3A;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  /* === Method Selector === */
  .method-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  @media (max-width: 480px) {
    .method-grid { grid-template-columns: repeat(2, 1fr); }
  }

  .method-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid rgba(26, 26, 26, 0.12);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  .method-btn:hover {
    border-color: rgba(193, 122, 58, 0.4);
  }
  .method-btn--active {
    border-color: #C17A3A;
    background: rgba(193, 122, 58, 0.06);
  }

  .method-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: #C17A3A;
    background: rgba(193, 122, 58, 0.08);
    border-radius: 2px;
    flex-shrink: 0;
  }
  .method-btn--active .method-icon {
    background: #C17A3A;
    color: #F5F0E8;
  }

  .method-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: #1A1A1A;
  }

  .method-desc {
    font-size: 0.75rem;
    color: #8A8070;
    margin-top: 0.4rem;
  }
  .method-range {
    color: #C17A3A;
    font-weight: 500;
  }
  .method-guide {
    display: inline-block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #C17A3A;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.5rem;
  }
  .method-guide:hover {
    color: #A8632E;
    text-decoration: underline;
  }

  /* === Ratio Section === */
  .ratio-section {
    text-align: center;
  }

  .ratio-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .ratio-adj {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(26, 26, 26, 0.15);
    background: transparent;
    font-size: 1.2rem;
    color: #1A1A1A;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .ratio-adj:hover {
    border-color: #C17A3A;
    color: #C17A3A;
  }

  .ratio-value {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ratio-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1A1A1A;
  }
  .ratio-reset {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #C17A3A;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-top: 0.15rem;
  }
  .ratio-reset:hover { text-decoration: underline; }

  .ratio-hint {
    font-size: 0.7rem;
    color: #8A8070;
    margin-top: 0.25rem;
  }

  /* === Calculator Section === */
  .calc-row {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    justify-content: center;
  }
  @media (max-width: 480px) {
    .calc-row { flex-direction: column; align-items: center; }
  }

  .calc-input-group, .calc-output-group {
    flex: 1;
    max-width: 180px;
  }

  .input-wrap {
    position: relative;
  }
  .input-wrap input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 0.75rem;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1A1A1A;
    border: 1px solid rgba(26, 26, 26, 0.15);
    background: #fff;
    outline: none;
    transition: border-color 0.2s;
    -moz-appearance: textfield;
  }
  .input-wrap input::-webkit-outer-spin-button,
  .input-wrap input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .input-wrap input:focus {
    border-color: #C17A3A;
  }
  .input-unit {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8A8070;
  }

  .swap-btn {
    width: 40px;
    height: 40px;
    border: 1px solid rgba(26, 26, 26, 0.12);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8A8070;
    transition: all 0.2s;
    flex-shrink: 0;
    margin-bottom: 0.15rem;
  }
  .swap-btn svg { width: 18px; height: 18px; }
  .swap-btn:hover {
    border-color: #C17A3A;
    color: #C17A3A;
  }

  .output-value {
    padding: 0.75rem;
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1A1A1A;
    background: rgba(193, 122, 58, 0.05);
    border: 1px solid rgba(193, 122, 58, 0.2);
    text-align: center;
  }
  .output-unit {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8A8070;
    font-family: system-ui, sans-serif;
    font-weight: 400;
    margin-left: 0.25rem;
  }

  /* === Ratio Bar === */
  .ratio-bar-wrap { margin-top: -0.5rem; }
  .ratio-bar {
    display: flex;
    height: 28px;
    border-radius: 2px;
    overflow: hidden;
  }
  .ratio-bar-coffee {
    background: #3D2518;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    transition: width 0.3s ease;
  }
  .ratio-bar-water {
    background: rgba(193, 170, 140, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bar-label {
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: #F5F0E8;
  }
  .ratio-bar-water .bar-label { color: #5C4A38; }

  .bar-legend {
    display: flex;
    justify-content: space-between;
    margin-top: 0.25rem;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8A8070;
  }

  /* === Quick Reference Table === */
  .quick-ref {
    border-top: 1px solid rgba(26, 26, 26, 0.08);
    padding-top: 1.5rem;
  }
  .ref-table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0;
  }
  .ref-header {
    display: contents;
  }
  .ref-header span {
    padding: 0.4rem 0.75rem;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #8A8070;
    border-bottom: 1px solid rgba(26, 26, 26, 0.08);
  }
  .ref-row {
    display: contents;
  }
  .ref-row span {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    color: #1A1A1A;
    border-bottom: 1px solid rgba(26, 26, 26, 0.04);
  }
  .ref-row--highlight span {
    background: rgba(193, 122, 58, 0.04);
    font-weight: 600;
  }
</style>
