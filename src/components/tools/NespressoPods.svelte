<script>
  import podData from '../../data/nespressoPods.json';

  const pods = podData.pods;

  // --- Filter state ---
  let lineFilter = $state('all');       // 'all' | 'vertuo' | 'original'
  let categoryFilter = $state('all');
  let roastFilter = $state('all');
  let searchQuery = $state('');
  let showDecafOnly = $state(false);
  let showFlavoredOnly = $state(false);
  let intensityRange = $state([1, 13]);
  let selectedPodName = $state(null);
  let sortBy = $state('name');          // 'name' | 'intensity' | 'roast'

  // --- Derived filter values ---
  const categories = $derived((() => {
    const relevant = lineFilter === 'all' ? pods : pods.filter(p => p.line === lineFilter);
    return [...new Set(relevant.map(p => p.category))].sort();
  })());

  const roastLevels = ['Light', 'Medium', 'Medium-Dark', 'Dark'];

  const ROAST_ORDER = { 'Light': 0, 'Medium': 1, 'Medium-Dark': 2, 'Dark': 3 };

  const filtered = $derived((() => {
    let result = pods;
    if (lineFilter !== 'all') result = result.filter(p => p.line === lineFilter);
    if (categoryFilter !== 'all') result = result.filter(p => p.category === categoryFilter);
    if (roastFilter !== 'all') result = result.filter(p => p.roast_level === roastFilter);
    if (showDecafOnly) result = result.filter(p => p.decaf);
    if (showFlavoredOnly) result = result.filter(p => p.flavored);
    result = result.filter(p => {
      if (p.intensity == null) return true;
      return p.intensity >= intensityRange[0] && p.intensity <= intensityRange[1];
    });
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.aroma && p.aroma.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.best_for && p.best_for.toLowerCase().includes(q))
      );
    }
    if (sortBy === 'intensity') {
      result = [...result].sort((a, b) => (b.intensity ?? 0) - (a.intensity ?? 0));
    } else if (sortBy === 'roast') {
      result = [...result].sort((a, b) => (ROAST_ORDER[a.roast_level] ?? 2) - (ROAST_ORDER[b.roast_level] ?? 2));
    } else {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    return result;
  })());

  const selectedPod = $derived(pods.find(p => p.name === selectedPodName) || null);
  const tryAlsoPod = $derived(selectedPod?.try_also ? pods.find(p => p.name === selectedPod.try_also) : null);

  function selectPod(name) {
    selectedPodName = selectedPodName === name ? null : name;
  }

  function selectTryAlso() {
    if (tryAlsoPod) {
      selectedPodName = tryAlsoPod.name;
    }
  }

  function clearFilters() {
    lineFilter = 'all';
    categoryFilter = 'all';
    roastFilter = 'all';
    searchQuery = '';
    showDecafOnly = false;
    showFlavoredOnly = false;
    intensityRange = [1, 13];
    sortBy = 'name';
  }

  function cupSizeLabel(size) {
    const labels = {
      alto: 'Alto (414ml)',
      mug: 'Mug (230ml)',
      gran_lungo: 'Gran Lungo (150ml)',
      double_espresso: 'Double Espresso (80ml)',
      espresso: 'Espresso (40ml)',
      lungo: 'Lungo (110ml)',
    };
    return labels[size] || size;
  }

  // Intensity dots: filled up to the pod's intensity
  function intensityDots(intensity, max = 13) {
    if (intensity == null) return [];
    return Array.from({ length: max }, (_, i) => i < intensity);
  }
</script>

{#snippet originalCapsule(color, uid)}
<svg viewBox="0 0 100 100" class="capsule-svg">
  <defs>
    <linearGradient id="og-{uid}" x1="0" y1="0" x2="1" y2="0.08">
      <stop offset="0%" stop-color={color} stop-opacity="0.55"/>
      <stop offset="18%" stop-color={color} stop-opacity="0.95"/>
      <stop offset="42%" stop-color={color}/>
      <stop offset="68%" stop-color={color} stop-opacity="0.85"/>
      <stop offset="100%" stop-color={color} stop-opacity="0.4"/>
    </linearGradient>
    <linearGradient id="rim-{uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#909090"/><stop offset="30%" stop-color="#D0D0D0"/>
      <stop offset="50%" stop-color="#ECECEC"/><stop offset="70%" stop-color="#D0D0D0"/>
      <stop offset="100%" stop-color="#888"/>
    </linearGradient>
  </defs>
  <!-- Shadow -->
  <ellipse cx="50" cy="93" rx="16" ry="3" fill="rgba(0,0,0,0.1)"/>
  <!-- Body — squat tapered cup: wide top, narrow base -->
  <path d="M 16,35 L 28,84 Q 33,90 50,91 Q 67,90 72,84 L 84,35 Z" fill="url(#og-{uid})"/>
  <!-- Left highlight -->
  <path d="M 21,37 L 31,84 Q 33,88 38,90 L 34,84 L 25,37 Z" fill="rgba(255,255,255,0.18)"/>
  <!-- Right darken -->
  <path d="M 79,37 L 69,84 Q 67,88 62,90 L 66,84 L 75,37 Z" fill="rgba(0,0,0,0.07)"/>
  <!-- Top rim flange — silver, wider than body -->
  <ellipse cx="50" cy="33" rx="44" ry="13" fill="url(#rim-{uid})" stroke="#AAA" stroke-width="0.3"/>
  <!-- Rim front edge thickness -->
  <path d="M 6,33 Q 6,42 12,45 Q 26,51 50,52 Q 74,51 88,45 Q 94,42 94,33" fill="#B5B5B5" opacity="0.3"/>
  <!-- Rim top highlight -->
  <path d="M 12,28 Q 30,20 50,19 Q 70,20 88,28 Q 70,22 50,21 Q 30,22 12,28 Z" fill="rgba(255,255,255,0.3)"/>
  <!-- Silver foil top -->
  <ellipse cx="50" cy="31" rx="32" ry="8" fill="#D0D0D0" opacity="0.5"/>
  <ellipse cx="44" cy="29" rx="14" ry="4" fill="rgba(255,255,255,0.3)"/>
</svg>
{/snippet}

{#snippet vertuoCapsule(color, uid)}
<svg viewBox="0 0 130 115" class="capsule-svg">
  <defs>
    <radialGradient id="vd-{uid}" cx="0.35" cy="0.28" r="0.6">
      <stop offset="0%" stop-color={color} stop-opacity="1"/>
      <stop offset="35%" stop-color={color} stop-opacity="0.95"/>
      <stop offset="65%" stop-color={color} stop-opacity="0.8"/>
      <stop offset="100%" stop-color={color} stop-opacity="0.5"/>
    </radialGradient>
    <linearGradient id="sc-{uid}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#909090"/><stop offset="20%" stop-color="#C8C8C8"/>
      <stop offset="40%" stop-color="#E8E8E8"/><stop offset="60%" stop-color="#D0D0D0"/>
      <stop offset="80%" stop-color="#DDD"/><stop offset="100%" stop-color="#888"/>
    </linearGradient>
  </defs>
  <!-- Shadow -->
  <ellipse cx="65" cy="110" rx="50" ry="5" fill="rgba(0,0,0,0.08)"/>
  <!-- Silver saucer -->
  <ellipse cx="65" cy="90" rx="58" ry="15" fill="url(#sc-{uid})" stroke="#AAA" stroke-width="0.3"/>
  <!-- Saucer front edge -->
  <path d="M 7,90 Q 7,100 14,104 Q 30,112 65,113 Q 100,112 116,104 Q 123,100 123,90" fill="#C0C0C0" opacity="0.35"/>
  <!-- Barcode stripes on saucer -->
  <g opacity="0.35">
    <rect x="12" y="88" width="2.5" height="8" fill="#333" rx="0.5" transform="rotate(-6,12,92)"/>
    <rect x="18" y="86" width="1.5" height="8" fill="#333" rx="0.5" transform="rotate(-5,18,90)"/>
    <rect x="23" y="85" width="2.5" height="8" fill="#333" rx="0.5" transform="rotate(-4,23,89)"/>
    <rect x="28" y="84.5" width="1.5" height="8" fill="#333" rx="0.5" transform="rotate(-3,28,88)"/>
    <rect x="102" y="84.5" width="1.5" height="8" fill="#333" rx="0.5" transform="rotate(3,102,88)"/>
    <rect x="107" y="85" width="2.5" height="8" fill="#333" rx="0.5" transform="rotate(4,107,89)"/>
    <rect x="112" y="86" width="1.5" height="8" fill="#333" rx="0.5" transform="rotate(5,112,90)"/>
    <rect x="118" y="88" width="2.5" height="8" fill="#333" rx="0.5" transform="rotate(6,118,92)"/>
  </g>
  <!-- Dome — hemisphere -->
  <path d="M 18,86 C 18,42 38,8 65,8 C 92,8 112,42 112,86 Z" fill="url(#vd-{uid})"/>
  <!-- Short body below dome -->
  <path d="M 18,86 Q 16,92 22,96 Q 35,103 65,105 Q 95,103 108,96 Q 114,92 112,86" fill={color} opacity="0.75"/>
  <!-- Dome embossed ridges -->
  <path d="M 38,86 Q 42,60 48,40" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1.4"/>
  <path d="M 40,86 Q 44,60 50,40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
  <path d="M 53,86 Q 56,55 60,30" fill="none" stroke="rgba(0,0,0,0.09)" stroke-width="1.2"/>
  <path d="M 55,86 Q 58,55 62,30" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.8"/>
  <path d="M 68,86 Q 69,55 68,28" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="1.1"/>
  <path d="M 70,86 Q 71,55 70,28" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.7"/>
  <path d="M 82,86 Q 80,58 76,36" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
  <path d="M 84,86 Q 82,58 78,36" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="0.7"/>
  <path d="M 95,86 Q 92,65 86,48" fill="none" stroke="rgba(0,0,0,0.04)" stroke-width="0.8"/>
  <!-- Dome specular highlight -->
  <path d="M 42,30 Q 50,15 62,10 Q 72,8 82,14 Q 72,9 62,8 Q 50,10 44,20 Q 38,32 42,30 Z" fill="rgba(255,255,255,0.4)"/>
  <!-- Secondary highlight -->
  <path d="M 28,55 Q 34,40 44,30 Q 48,26 52,28 Q 42,34 34,48 Q 28,60 30,65 Z" fill="rgba(255,255,255,0.1)"/>
</svg>
{/snippet}

<div class="nespresso-tool">
  <div class="explorer-layout" class:explorer-layout--panel-open={selectedPod}>

    <!-- Left column: filters + grid -->
    <div class="explorer-main">

      <!-- Line toggle -->
      <div class="line-toggle">
        <button class="line-btn" class:line-btn--active={lineFilter === 'all'} onclick={() => { lineFilter = 'all'; categoryFilter = 'all'; }}>
          All Pods
        </button>
        <button class="line-btn" class:line-btn--active={lineFilter === 'vertuo'} onclick={() => { lineFilter = 'vertuo'; categoryFilter = 'all'; }}>
          Vertuo
        </button>
        <button class="line-btn" class:line-btn--active={lineFilter === 'original'} onclick={() => { lineFilter = 'original'; categoryFilter = 'all'; }}>
          Original
        </button>
      </div>

      <!-- Search -->
      <div class="search-row">
        <input
          type="text"
          class="search-input"
          placeholder="Search pods by name, flavor, or mood..."
          bind:value={searchQuery}
        />
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-group">
          <label class="filter-label">Category</label>
          <select class="filter-select" bind:value={categoryFilter}>
            <option value="all">All Categories</option>
            {#each categories as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Roast</label>
          <select class="filter-select" bind:value={roastFilter}>
            <option value="all">All Roasts</option>
            {#each roastLevels as roast}
              <option value={roast}>{roast}</option>
            {/each}
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">Sort</label>
          <select class="filter-select" bind:value={sortBy}>
            <option value="name">Name</option>
            <option value="intensity">Intensity</option>
            <option value="roast">Roast Level</option>
          </select>
        </div>
      </div>

      <!-- Toggles & intensity -->
      <div class="toggle-row">
        <button class="toggle-btn" class:toggle-btn--active={showDecafOnly} onclick={() => showDecafOnly = !showDecafOnly}>
          Decaf
        </button>
        <button class="toggle-btn" class:toggle-btn--active={showFlavoredOnly} onclick={() => showFlavoredOnly = !showFlavoredOnly}>
          Flavored
        </button>

        <div class="intensity-filter">
          <span class="filter-label">Intensity {intensityRange[0]}–{intensityRange[1]}</span>
          <div class="range-inputs">
            <input type="range" min="1" max="13" bind:value={intensityRange[0]}
              oninput={(e) => { if (Number(e.target.value) > intensityRange[1]) intensityRange[0] = intensityRange[1]; }}
            />
            <input type="range" min="1" max="13" bind:value={intensityRange[1]}
              oninput={(e) => { if (Number(e.target.value) < intensityRange[0]) intensityRange[1] = intensityRange[0]; }}
            />
          </div>
        </div>

        {#if lineFilter !== 'all' || categoryFilter !== 'all' || roastFilter !== 'all' || searchQuery || showDecafOnly || showFlavoredOnly || intensityRange[0] !== 1 || intensityRange[1] !== 13}
          <button class="clear-btn" onclick={clearFilters}>Clear all</button>
        {/if}
      </div>

      <!-- Results count -->
      <p class="results-count">
        {filtered.length} pod{filtered.length !== 1 ? 's' : ''}
      </p>

      <!-- Pod grid -->
      <div class="pod-grid">
        {#each filtered as pod (pod.name + pod.line)}
          <button
            class="pod-card"
            class:pod-card--selected={selectedPodName === pod.name}
            onclick={() => selectPod(pod.name)}
          >
            <!-- Capsule SVG -->
            <div class="pod-capsule">
              {#if pod.line === 'original'}
                {@render originalCapsule(pod.color_hex, 'c-' + pod.name.replace(/\s+/g, '-'))}
              {:else}
                {@render vertuoCapsule(pod.color_hex, 'c-' + pod.name.replace(/\s+/g, '-'))}
              {/if}
            </div>

            <!-- Pod info -->
            <span class="pod-name">{pod.name}</span>
            <span class="pod-meta">{pod.category}</span>

            <!-- Intensity dots -->
            {#if pod.intensity != null}
              <div class="intensity-dots">
                {#each intensityDots(pod.intensity) as filled}
                  <span class="dot" class:dot--filled={filled}></span>
                {/each}
              </div>
            {:else}
              <span class="pod-meta" style="font-style:italic">N/A</span>
            {/if}

            <!-- Tags -->
            <div class="pod-tags">
              {#if pod.decaf}<span class="tag tag--decaf">Decaf</span>{/if}
              {#if pod.flavored}<span class="tag tag--flavored">Flavored</span>{/if}
              <span class="tag tag--line">{pod.line === 'vertuo' ? 'Vertuo' : 'Original'}</span>
            </div>
          </button>
        {/each}
      </div>

      {#if filtered.length === 0}
        <div class="empty-state">
          <p>No pods match your filters.</p>
          <button class="clear-btn" onclick={clearFilters}>Clear filters</button>
        </div>
      {/if}

    </div><!-- /.explorer-main -->

    <!-- Right column: detail panel -->
    {#if selectedPod}
      <aside class="detail-panel">
        <div class="detail-panel-inner">
          <button class="detail-close" onclick={() => selectedPodName = null} aria-label="Close detail panel">
            &times;
          </button>

          <!-- Color accent bar from pod color -->
          <div class="detail-accent" style="background:{selectedPod.color_hex}"></div>

          <div class="detail-top">
            <div class="detail-capsule">
              {#if selectedPod.line === 'original'}
                {@render originalCapsule(selectedPod.color_hex, 'detail-og')}
              {:else}
                {@render vertuoCapsule(selectedPod.color_hex, 'detail-vt')}
              {/if}
            </div>

            <div class="detail-header">
              <h3 class="detail-name">{selectedPod.name}</h3>
              <div class="detail-badges">
                <span class="detail-line-badge">{selectedPod.line === 'vertuo' ? 'Vertuo' : 'Original'}</span>
                <span class="detail-size-badge">{cupSizeLabel(selectedPod.cup_size)}</span>
              </div>
              {#if selectedPod.intensity != null}
                <div class="detail-intensity">
                  <span class="detail-intensity-num">{selectedPod.intensity}</span>
                  <div class="detail-intensity-dots">
                    {#each intensityDots(selectedPod.intensity) as filled}
                      <span class="dot-lg" class:dot-lg--filled={filled}></span>
                    {/each}
                  </div>
                  <span class="detail-intensity-label">Intensity</span>
                </div>
              {/if}
            </div>
          </div>

          <div class="detail-body">
            <div class="detail-meta-grid">
              {#if selectedPod.roast_level}
                <div class="meta-item">
                  <span class="section-label">Roast</span>
                  <p class="meta-value">{selectedPod.roast_level}</p>
                </div>
              {/if}
              {#if selectedPod.blend}
                <div class="meta-item">
                  <span class="section-label">Blend</span>
                  <p class="meta-value">{selectedPod.blend === 'A' ? 'Arabica' : selectedPod.blend === 'R' ? 'Robusta' : 'Arabica / Robusta'}</p>
                </div>
              {/if}
              {#if selectedPod.aroma}
                <div class="meta-item">
                  <span class="section-label">Aroma</span>
                  <p class="meta-value">{selectedPod.aroma}</p>
                </div>
              {/if}
              <div class="meta-item">
                <span class="section-label">Category</span>
                <p class="meta-value">{selectedPod.category}</p>
              </div>
            </div>

            {#if selectedPod.description}
              <p class="detail-desc">{selectedPod.description}</p>
            {/if}

            {#if selectedPod.best_for}
              <div class="best-for">
                <span class="section-label">Best For</span>
                <p class="best-for-text">{selectedPod.best_for}</p>
              </div>
            {/if}

            {#if tryAlsoPod}
              <div class="try-also">
                <span class="section-label">Try Also</span>
                <button class="try-also-btn" onclick={selectTryAlso}>
                  <span class="try-also-swatch" style="background:{tryAlsoPod.color_hex}"></span>
                  {tryAlsoPod.name}
                  <span class="try-also-line">{tryAlsoPod.line === 'vertuo' ? 'Vertuo' : 'Original'}</span>
                  &rarr;
                </button>
              </div>
            {/if}

            {#if selectedPod.amazon_url}
              <a href={selectedPod.amazon_url} target="_blank" rel="noopener" class="amazon-link">
                View on Amazon &rarr;
              </a>
            {/if}
          </div>
        </div>
      </aside>
    {/if}

  </div><!-- /.explorer-layout -->
</div>

<style>
  .nespresso-tool {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* === Explorer Layout: two-column when panel open === */
  .explorer-layout {
    display: flex;
    gap: 0;
    align-items: flex-start;
  }
  .explorer-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    transition: flex 0.3s ease;
  }
  .explorer-layout--panel-open .explorer-main {
    flex: 0 0 62%;
    max-width: 62%;
  }

  /* === Line Toggle === */
  .line-toggle {
    display: flex;
    gap: 0;
    border: 1px solid rgba(26, 26, 26, 0.12);
  }
  .line-btn {
    flex: 1;
    padding: 0.6rem 0.75rem;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: transparent;
    border: none;
    border-right: 1px solid rgba(26, 26, 26, 0.08);
    color: #8A8070;
    cursor: pointer;
    transition: all 0.2s;
  }
  .line-btn:last-child { border-right: none; }
  .line-btn:hover { color: #1A1A1A; background: rgba(193, 122, 58, 0.03); }
  .line-btn--active {
    color: #1A1A1A;
    background: rgba(193, 122, 58, 0.08);
    box-shadow: inset 0 -2px 0 #C17A3A;
  }

  /* === Search === */
  .search-row { display: flex; }
  .search-input {
    width: 100%;
    padding: 0.55rem 0.75rem;
    font-size: 0.8rem;
    border: 1px solid rgba(26, 26, 26, 0.12);
    background: transparent;
    color: #1A1A1A;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
  }
  .search-input::placeholder { color: #B8AD9E; }
  .search-input:focus { border-color: #C17A3A; }

  /* === Filters === */
  .filter-bar {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    flex: 1;
    min-width: 120px;
  }
  .filter-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #C17A3A;
    font-weight: 600;
  }
  .filter-select {
    padding: 0.4rem 0.5rem;
    font-size: 0.75rem;
    border: 1px solid rgba(26, 26, 26, 0.12);
    background: transparent;
    color: #1A1A1A;
    cursor: pointer;
    font-family: inherit;
  }
  .filter-select:focus { outline: none; border-color: #C17A3A; }

  /* === Toggles & intensity row === */
  .toggle-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .toggle-btn {
    padding: 0.35rem 0.6rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: 1px solid rgba(26, 26, 26, 0.12);
    background: transparent;
    color: #8A8070;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;
  }
  .toggle-btn:hover { border-color: rgba(193, 122, 58, 0.3); }
  .toggle-btn--active {
    border-color: #C17A3A;
    color: #C17A3A;
    background: rgba(193, 122, 58, 0.06);
  }

  .intensity-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }
  .range-inputs {
    display: flex;
    gap: 0.25rem;
    align-items: center;
  }
  .range-inputs input[type="range"] {
    width: 60px;
    accent-color: #C17A3A;
    height: 4px;
  }

  .clear-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border: 1px solid rgba(193, 122, 58, 0.3);
    background: transparent;
    color: #C17A3A;
    cursor: pointer;
    font-weight: 500;
  }
  .clear-btn:hover { background: rgba(193, 122, 58, 0.06); }

  /* === Results count === */
  .results-count {
    font-size: 0.7rem;
    color: #8A8070;
    margin: 0;
  }

  /* === Pod Grid === */
  .pod-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.6rem;
  }

  .pod-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.75rem 0.5rem 0.6rem;
    border: 1px solid rgba(26, 26, 26, 0.08);
    background: transparent;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    font-family: inherit;
  }
  .pod-card:hover {
    border-color: rgba(193, 122, 58, 0.3);
    background: rgba(193, 122, 58, 0.02);
  }
  .pod-card--selected {
    border-color: #C17A3A;
    background: rgba(193, 122, 58, 0.06);
  }

  .pod-capsule {
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .capsule-svg {
    width: 100%;
    height: 100%;
  }

  .pod-name {
    font-size: 0.72rem;
    font-weight: 600;
    color: #1A1A1A;
    line-height: 1.2;
  }
  .pod-meta {
    font-size: 0.6rem;
    color: #8A8070;
  }

  /* Intensity dots */
  .intensity-dots {
    display: flex;
    gap: 1.5px;
    justify-content: center;
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(26, 26, 26, 0.08);
  }
  .dot--filled { background: #3D2518; }

  .pod-tags {
    display: flex;
    gap: 0.2rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .tag {
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.1rem 0.3rem;
    border-radius: 1px;
  }
  .tag--line { background: rgba(26, 26, 26, 0.04); color: #8A8070; }
  .tag--decaf { background: rgba(74, 124, 89, 0.1); color: #4A7C59; }
  .tag--flavored { background: rgba(193, 122, 58, 0.1); color: #C17A3A; }

  /* === Empty state === */
  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: #8A8070;
    font-size: 0.85rem;
  }
  .empty-state p { margin-bottom: 0.75rem; }

  /* === Detail Panel — right-side sticky panel, dark charcoal === */
  .detail-panel {
    flex: 0 0 38%;
    max-width: 38%;
    position: sticky;
    top: 6rem;
    align-self: flex-start;
    max-height: calc(100vh - 8rem);
    overflow-y: auto;
    animation: slideInRight 0.3s ease;
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .detail-panel-inner {
    position: relative;
    background: #2C2C2C;
    color: #F5F0E8;
    padding: 1.5rem 1.25rem 1.25rem;
    border-left: 3px solid #C17A3A;
  }

  /* Accent bar from pod color */
  .detail-accent {
    height: 4px;
    margin: -1.5rem -1.25rem 1.25rem;
    opacity: 0.85;
  }

  .detail-close {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    background: rgba(245, 240, 232, 0.08);
    border: 1px solid rgba(245, 240, 232, 0.12);
    font-size: 1.2rem;
    color: #B8AD9E;
    cursor: pointer;
    padding: 0.15rem 0.45rem;
    line-height: 1;
    transition: all 0.2s;
    z-index: 2;
  }
  .detail-close:hover {
    color: #F5F0E8;
    background: rgba(193, 122, 58, 0.3);
    border-color: #C17A3A;
  }

  .detail-top {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .detail-capsule {
    flex-shrink: 0;
    width: 72px;
  }

  .detail-header {
    flex: 1;
    min-width: 0;
  }
  .detail-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 700;
    color: #F5F0E8;
    margin: 0 0 0.35rem;
    line-height: 1.2;
    padding-right: 1.5rem;
  }
  .detail-badges {
    display: flex;
    gap: 0.35rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }
  .detail-line-badge, .detail-size-badge {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.15rem 0.4rem;
    background: rgba(245, 240, 232, 0.08);
    color: #D4C9B8;
    font-weight: 500;
  }

  .detail-intensity {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .detail-intensity-num {
    font-family: 'Playfair Display', serif;
    font-size: 1.4rem;
    font-weight: 700;
    color: #C17A3A;
    line-height: 1;
  }
  .detail-intensity-dots {
    display: flex;
    gap: 2px;
  }
  .dot-lg {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(245, 240, 232, 0.12);
  }
  .dot-lg--filled { background: #C17A3A; }
  .detail-intensity-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8A8070;
  }

  /* Detail body */
  .detail-body {}
  .section-label {
    display: block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #C17A3A;
    font-weight: 600;
    margin-bottom: 0.15rem;
  }

  .detail-meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(245, 240, 232, 0.08);
  }
  .meta-item {}
  .meta-value {
    font-size: 0.82rem;
    font-weight: 600;
    color: #F5F0E8;
    margin: 0;
  }

  .detail-desc {
    font-size: 0.8rem;
    color: #D4C9B8;
    line-height: 1.65;
    margin: 0 0 1rem;
  }

  .best-for {
    margin-bottom: 0.75rem;
  }
  .best-for-text {
    font-size: 0.82rem;
    color: #F5F0E8;
    font-weight: 500;
    margin: 0;
    font-style: italic;
  }

  .try-also {
    margin-bottom: 0.75rem;
  }
  .try-also-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.6rem;
    border: 1px solid rgba(245, 240, 232, 0.15);
    background: rgba(245, 240, 232, 0.04);
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 500;
    color: #F5F0E8;
    font-family: inherit;
    transition: all 0.2s;
  }
  .try-also-btn:hover {
    border-color: #C17A3A;
    background: rgba(193, 122, 58, 0.15);
  }
  .try-also-swatch {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .try-also-line {
    font-size: 0.6rem;
    color: #8A8070;
  }

  .amazon-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2C2C2C;
    background: #C17A3A;
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 0.85rem;
    margin-top: 0.5rem;
    transition: all 0.2s;
  }
  .amazon-link:hover { background: #A8632E; color: #F5F0E8; text-decoration: none; }

  /* Scrollbar styling for detail panel */
  .detail-panel::-webkit-scrollbar {
    width: 4px;
  }
  .detail-panel::-webkit-scrollbar-track {
    background: transparent;
  }
  .detail-panel::-webkit-scrollbar-thumb {
    background: rgba(193, 122, 58, 0.3);
    border-radius: 2px;
  }

  /* === Responsive === */

  /* Tablets: slightly adjust proportions */
  @media (max-width: 1024px) {
    .explorer-layout--panel-open .explorer-main {
      flex: 0 0 55%;
      max-width: 55%;
    }
    .detail-panel {
      flex: 0 0 45%;
      max-width: 45%;
    }
  }

  /* Mobile: panel becomes bottom overlay */
  @media (max-width: 768px) {
    .explorer-layout {
      flex-direction: column;
    }
    .explorer-layout--panel-open .explorer-main {
      flex: 1 1 auto;
      max-width: 100%;
    }
    .detail-panel {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      top: auto;
      flex: none;
      max-width: 100%;
      max-height: 70vh;
      z-index: 100;
      animation: slideUpMobile 0.3s ease;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
    }
    .detail-panel-inner {
      border-left: none;
      border-top: 3px solid #C17A3A;
    }
    .detail-accent {
      margin: -1.5rem -1.25rem 1.25rem;
    }
  }
  @keyframes slideUpMobile {
    from { opacity: 0; transform: translateY(100%); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    .filter-bar { flex-direction: column; gap: 0.5rem; }
    .intensity-filter { margin-left: 0; }
    .toggle-row { gap: 0.4rem; }
    .detail-top { flex-direction: column; align-items: center; text-align: center; }
    .detail-intensity { justify-content: center; }
    .detail-badges { justify-content: center; }
  }

  @media (max-width: 480px) {
    .pod-grid { grid-template-columns: repeat(2, 1fr); }
  }
</style>
