<script>
  // Grind size data sourced from coffee-grind-size-micron-chart article + COFFEE_KNOWLEDGE_SYNTHESIS.md
  // Micron ranges from grinder calibration data (Comandante, 1Zpresso, Baratza)
  // Texture references are tactile comparisons for calibration without measurement tools

  const SCALE_MIN = 0;
  const SCALE_MAX = 1500;

  const grinds = [
    {
      id: 'turkish',
      name: 'Turkish',
      method: 'Ibrik / Cezve',
      microns: [100, 200],
      texture: 'Flour, powder',
      label: 'Extra Fine',
      time: '2–3 min (boiled)',
      detail: 'The finest grind possible — almost powder. Used only for Turkish coffee where grounds aren\'t filtered out. Should feel like flour between your fingers.',
    },
    {
      id: 'espresso',
      name: 'Espresso',
      method: 'Espresso machine',
      microns: [200, 400],
      texture: 'Powdered sugar',
      label: 'Very Fine',
      time: '25–35 seconds',
      detail: 'Fine enough that 9 bars of pressure takes 25–35 seconds to push water through a 18g puck. Should clump slightly when pinched — like powdered sugar.',
      link: '/blog/best-espresso-machines-under-500-2026-7-picks-for-every-budget/',
      linkLabel: 'Espresso Guide',
    },
    {
      id: 'moka',
      name: 'Moka Pot',
      method: 'Stovetop',
      microns: [400, 500],
      texture: 'Fine sand',
      label: 'Fine',
      time: '3–5 minutes',
      detail: 'Finer than drip but coarser than espresso. A common mistake is grinding espresso-fine for Moka Pot — this causes bitter, over-extracted results.',
      link: '/blog/moka-pot-brewing-guide/',
      linkLabel: 'Moka Pot Guide',
    },
    {
      id: 'aeropress',
      name: 'AeroPress',
      method: 'AeroPress',
      microns: [400, 700],
      texture: 'Table salt to fine sand',
      label: 'Fine to Medium-Fine',
      time: '1–3 minutes',
      detail: 'The widest acceptable range of any method — recipes vary from espresso-like concentrate to pour over style. Start at table salt and adjust by taste.',
      link: '/blog/why-and-how-you-should-use-an-aeropress/',
      linkLabel: 'AeroPress Guide',
    },
    {
      id: 'v60',
      name: 'Pour Over',
      method: 'V60, Kalita Wave',
      microns: [500, 800],
      texture: 'Table salt',
      label: 'Medium-Fine',
      time: '2:30–4:00',
      detail: 'The grind that determines your pour over. Too fine = slow drawdown, bitter. Too coarse = fast drawdown, sour. Target table salt consistency. V60 is finer; Kalita can go slightly coarser.',
      link: '/blog/ultimate-pour-over-coffee-guide-and-best-v60-technique/',
      linkLabel: 'Pour Over Guide',
    },
    {
      id: 'drip',
      name: 'Drip / Chemex',
      method: 'Auto drip, Chemex',
      microns: [600, 900],
      texture: 'Medium sand',
      label: 'Medium to Medium-Coarse',
      time: '4–6 minutes',
      detail: 'Chemex sits at the same range as flat-bottom drip despite being cone-shaped — its 20–30% thicker filter creates more resistance, compensated by coarser grind.',
    },
    {
      id: 'french-press',
      name: 'French Press',
      method: 'French Press, cupping',
      microns: [800, 1200],
      texture: 'Sea salt, raw sugar',
      label: 'Coarse',
      time: '4–5 minutes',
      detail: 'Coarse enough that the metal mesh filter catches most particles. If your French press is gritty/muddy, grind coarser. Should look and feel like sea salt.',
      link: '/blog/how-to-use-a-french-press-the-most-amazing-coffee-youve-ever-had/',
      linkLabel: 'French Press Guide',
    },
    {
      id: 'cold-brew',
      name: 'Cold Brew',
      method: 'Cold brew, cold drip',
      microns: [1000, 1500],
      texture: 'Coarse peppercorn',
      label: 'Extra Coarse',
      time: '12–24 hours',
      detail: 'The coarsest setting on most grinders. Cold water extracts slowly, so the long steep time compensates. Going finer risks astringent, bitter concentrate.',
      link: '/blog/whats-great-about-cold-brew-toddy-cold-brew-tutorial/',
      linkLabel: 'Cold Brew Guide',
    },
  ];

  let selectedId = $state(null);
  let active = $derived(grinds.find(g => g.id === selectedId));

  function select(id) {
    selectedId = selectedId === id ? null : id;
  }

  function scalePct(micron) {
    return (micron / SCALE_MAX) * 100;
  }
</script>

<div class="grind-tool">
  <p class="intro">What are you brewing?</p>

  <div class="method-grid">
    {#each grinds as grind}
      <button
        class="method-btn"
        class:method-btn--active={selectedId === grind.id}
        onclick={() => select(grind.id)}
      >
        <span class="method-name">{grind.name}</span>
        <span class="method-sub">{grind.method}</span>
      </button>
    {/each}
  </div>

  <!-- Spectrum bar (always visible) -->
  <div class="spectrum-section">
    <span class="section-label">Grind Spectrum</span>
    <div class="spectrum-bar">
      <div class="spectrum-gradient"></div>
      {#each grinds as grind}
        {@const left = scalePct(grind.microns[0])}
        {@const width = scalePct(grind.microns[1]) - left}
        <div
          class="spectrum-range"
          class:spectrum-range--active={selectedId === grind.id}
          style:left="{left}%"
          style:width="{width}%"
        ></div>
      {/each}
    </div>
    <div class="spectrum-labels">
      <span>Extra Fine</span>
      <span>Fine</span>
      <span>Medium</span>
      <span>Coarse</span>
      <span>Extra Coarse</span>
    </div>
  </div>

  {#if active}
    <div class="detail-panel">
      <div class="detail-header">
        <div>
          <h3 class="detail-name">{active.name}</h3>
          <span class="detail-label-tag">{active.label}</span>
        </div>
        <div class="micron-badge">
          <span class="micron-range">{active.microns[0]}–{active.microns[1]}</span>
          <span class="micron-unit">μm</span>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-item">
          <span class="section-label">Feels like</span>
          <p class="detail-value">{active.texture}</p>
        </div>
        <div class="detail-item">
          <span class="section-label">Brew time</span>
          <p class="detail-value">{active.time}</p>
        </div>
      </div>

      <p class="detail-text">{active.detail}</p>

      {#if active.link}
        <a href={active.link} class="detail-link">{active.linkLabel} &rarr;</a>
      {/if}
    </div>
  {/if}

  <!-- Quick reference -->
  <div class="ref-section">
    <span class="section-label">Quick Reference</span>
    <div class="ref-table">
      <div class="ref-header">
        <span>Method</span>
        <span>Microns</span>
        <span>Feels Like</span>
      </div>
      {#each grinds as grind}
        <div class="ref-row" class:ref-row--active={selectedId === grind.id}>
          <span class="ref-method">{grind.name}</span>
          <span class="ref-microns">{grind.microns[0]}–{grind.microns[1]}</span>
          <span class="ref-texture">{grind.texture}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .grind-tool {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .intro {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1A1A1A;
    text-align: center;
  }

  .section-label {
    display: block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #C17A3A;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  /* === Method Grid === */
  .method-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4rem;
  }
  @media (max-width: 480px) {
    .method-grid { grid-template-columns: 1fr; }
  }

  .method-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid rgba(26, 26, 26, 0.1);
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }
  .method-btn:hover {
    border-color: rgba(193, 122, 58, 0.35);
    background: rgba(193, 122, 58, 0.02);
  }
  .method-btn--active {
    border-color: #C17A3A;
    background: rgba(193, 122, 58, 0.06);
  }
  .method-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1A1A1A;
  }
  .method-sub {
    font-size: 0.65rem;
    color: #8A8070;
  }

  /* === Spectrum Bar === */
  .spectrum-section {}
  .spectrum-bar {
    position: relative;
    height: 16px;
    margin-bottom: 0.3rem;
  }
  .spectrum-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, #3D2518, #5C4A38, #8A7560, #B89F82, #D4C4A8);
    opacity: 0.15;
  }
  .spectrum-range {
    position: absolute;
    top: 0;
    height: 100%;
    background: rgba(193, 122, 58, 0.15);
    border: 1px solid transparent;
    transition: all 0.3s;
  }
  .spectrum-range--active {
    background: rgba(193, 122, 58, 0.35);
    border-color: #C17A3A;
  }
  .spectrum-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.55rem;
    color: #8A8070;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* === Detail Panel === */
  .detail-panel {
    padding: 1rem;
    background: rgba(61, 37, 24, 0.03);
    border-left: 4px solid #C17A3A;
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }
  .detail-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0;
  }
  .detail-label-tag {
    font-size: 0.65rem;
    color: #8A8070;
  }

  .micron-badge {
    display: flex;
    align-items: baseline;
    gap: 0.2rem;
    flex-shrink: 0;
  }
  .micron-range {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #C17A3A;
  }
  .micron-unit {
    font-size: 0.65rem;
    color: #8A8070;
  }

  .detail-grid {
    display: flex;
    gap: 2rem;
    margin-bottom: 0.75rem;
  }
  .detail-item {}
  .detail-value {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1A1A1A;
    margin: 0;
  }

  .detail-text {
    font-size: 0.8rem;
    color: #3D2518;
    line-height: 1.6;
    margin: 0;
  }

  .detail-link {
    display: inline-block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #C17A3A;
    text-decoration: none;
    font-weight: 500;
    margin-top: 0.6rem;
  }
  .detail-link:hover {
    color: #A8632E;
    text-decoration: underline;
  }

  /* === Reference Table === */
  .ref-section {
    border-top: 1px solid rgba(26, 26, 26, 0.08);
    padding-top: 1.25rem;
  }
  .ref-table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .ref-header {
    display: contents;
  }
  .ref-header span {
    padding: 0.4rem 0.5rem;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8A8070;
    border-bottom: 1px solid rgba(26, 26, 26, 0.08);
  }
  .ref-row {
    display: contents;
  }
  .ref-row span {
    padding: 0.4rem 0.5rem;
    font-size: 0.72rem;
    color: #1A1A1A;
    border-bottom: 1px solid rgba(26, 26, 26, 0.04);
    transition: background 0.2s;
  }
  .ref-row--active span {
    background: rgba(193, 122, 58, 0.06);
    font-weight: 600;
  }
  .ref-method { font-weight: 500; }
  .ref-microns { color: #5C4A38; }
  .ref-texture { color: #8A8070; font-style: italic; }
</style>
