<script>
  import { slide, fade } from 'svelte/transition';

  let userGH = $state('');
  let userKH = $state('');
  let selectedRecipeId = $state(null);
  let batchSize = $state(1);
  let showDIY = $state(false);
  let inputMode = $state(null); // null | 'known' | 'unknown'
  let hoveredRecipeId = $state(null);

  // SCA Standard reference point
  const SCA = { gh: 68, kh: 40, tds: 150, ghkhRatio: '1.7:1' };

  // SCA ideal zone bounds (for chart rectangle)
  const SCA_ZONE = { ghMin: 40, ghMax: 120, khMin: 20, khMax: 80 };

  const recipes = [
    { id: 'rpavlis', name: 'RPavlis', gh: 0, kh: 50, tds: 50, ghkhRatio: '0:1', flavor: 'Neutral, clean', bestFor: 'Light roasts, delicate single origins', desc: "Robert Pavlis's minimalist formula. Zero hardness, KH-only buffer. The simplest DIY water recipe\u2009\u2014\u2009one ingredient.", boilerSafe: true, diyType: 'rpavlis', labelDx: 10, labelDy: 5 },
    { id: 'melbourne', name: 'Melbourne', gh: 24, kh: 12, tds: 36, ghkhRatio: '2:1', flavor: 'Ultra-clean, bright', bestFor: 'Competition brewing, light roasts', desc: 'Ultra-soft competition water. Extremely low mineral content lets origin character dominate.', boilerSafe: true, diyType: 'twobottle', labelDx: 8, labelDy: -12 },
    { id: 'holywater', name: 'Holy Water', gh: 62, kh: 23, tds: 85, ghkhRatio: '2.7:1', flavor: 'Clean, sweet, balanced', bestFor: 'Light\u2013medium roasts, pour over', desc: "Barista Hustle's sweet-spot recipe. Good extraction power with a clean finish.", boilerSafe: true, diyType: 'twobottle', labelDx: 8, labelDy: 16 },
    { id: 'bh4', name: 'Barista Hustle #4', gh: 80, kh: 40, tds: 120, ghkhRatio: '2:1', flavor: 'Balanced, full body', bestFor: 'All brew methods, daily driver', desc: 'The balanced workhorse. Close to SCA ideal with enough hardness for full extraction.', boilerSafe: true, diyType: 'twobottle', labelDx: 8, labelDy: -18 },
    { id: 'raoperger', name: 'Rao/Perger', gh: 76, kh: 50, tds: 126, ghkhRatio: '1.5:1', flavor: 'Rich, rounded, sweet', bestFor: 'Best all-rounder, any method', desc: "The internet's most popular DIY recipe. Developed by Scott Rao and Matt Perger. Best balance of extraction and buffer.", boilerSafe: true, diyType: 'twobottle', labelDx: -8, labelDy: 5 },
    { id: 'hendon', name: 'Hendon', gh: 100, kh: 31, tds: 131, ghkhRatio: '3.2:1', flavor: 'Bright, complex, juicy', bestFor: 'Light roasts, pour over', desc: "Dr. Christopher Hendon's research-derived formula. High hardness, low buffer\u2009\u2014\u2009maximizes brightness and acidity.", boilerSafe: true, diyType: 'twobottle', labelDx: 8, labelDy: 16 },
    { id: 'tww-classic', name: 'TWW Classic', gh: 150, kh: 40, tds: 190, ghkhRatio: '3.75:1', flavor: 'Strong extraction, bold', bestFor: 'Medium\u2013dark roasts', desc: "Third Wave Water's flagship packet. High GH for maximum extraction. Convenience of pre-measured packets.", boilerSafe: false, diyType: 'packet', labelDx: 8, labelDy: -12 },
    { id: 'tww-espresso', name: 'TWW Espresso', gh: 135, kh: 80, tds: 215, ghkhRatio: '1.7:1', flavor: 'Rich, heavy body', bestFor: 'Espresso machines', desc: 'Designed for espresso machines. Higher KH provides boiler-safe alkalinity and rich body.', boilerSafe: true, diyType: 'packet', labelDx: 8, labelDy: 5 },
    { id: 'tww-darkroast', name: 'TWW Dark Roast', gh: 20, kh: 135, tds: 155, ghkhRatio: '0.15:1', flavor: 'Smooth, low acidity', bestFor: 'Dark roasts, cold brew', desc: 'Inverted ratio\u2009\u2014\u2009very high alkalinity, minimal hardness. Tames bitterness in dark roasts.', boilerSafe: true, diyType: 'packet', labelDx: 10, labelDy: 5 },
  ];

  // Chart geometry
  const C = { left: 50, right: 385, top: 20, bottom: 265, xMax: 200, yMax: 150 };
  const cW = C.right - C.left;
  const cH = C.bottom - C.top;

  function xScale(gh) { return C.left + (gh / C.xMax) * cW; }
  function yScale(kh) { return C.bottom - (kh / C.yMax) * cH; }

  // X/Y axis ticks
  const xTicks = [0, 50, 100, 150, 200];
  const yTicks = [0, 50, 100, 150];

  // Derived
  let hasUserWater = $derived(userGH !== '' && userKH !== '' && !isNaN(+userGH) && !isNaN(+userKH));
  let selectedRecipe = $derived(recipes.find(r => r.id === selectedRecipeId));
  let userGHNum = $derived(hasUserWater ? +userGH : 0);
  let userKHNum = $derived(hasUserWater ? +userKH : 0);
  let userTDS = $derived(hasUserWater ? userGHNum + userKHNum : 0);
  let userGHKHRatio = $derived(hasUserWater && userKHNum > 0 ? (userGHNum / userKHNum).toFixed(1) + ':1' : '\u2014');

  // DIY calculations
  // Convention: concentrates are calibrated so 1 mL per 1L = 1 ppm
  // Bottle 1 (GH): 2.46g Epsom Salt per liter distilled
  // Bottle 2 (KH): 1.68g Baking Soda per liter distilled
  let bottle1mL = $derived(selectedRecipe ? Math.round(selectedRecipe.gh * batchSize * 10) / 10 : 0);
  let bottle2mL = $derived(selectedRecipe ? Math.round(selectedRecipe.kh * batchSize * 10) / 10 : 0);
  let distilledmL = $derived(Math.round(batchSize * 1000 - bottle1mL - bottle2mL));
  let rpavlisG = $derived(Math.round(0.10 * batchSize * 100) / 100);

  // Comparison deltas
  let deltaGH = $derived(hasUserWater && selectedRecipe ? selectedRecipe.gh - userGHNum : null);
  let deltaKH = $derived(hasUserWater && selectedRecipe ? selectedRecipe.kh - userKHNum : null);

  function selectRecipe(id) {
    if (selectedRecipeId === id) {
      selectedRecipeId = null;
      showDIY = false;
    } else {
      selectedRecipeId = id;
      showDIY = false;
    }
  }

  function setBatch(liters) {
    batchSize = liters;
  }

  function formatDelta(val) {
    if (val === null) return '\u2014';
    if (val > 0) return '+' + val;
    if (val < 0) return String(val);
    return '0';
  }
</script>

<div class="water-builder">
  <!-- Input Mode Selection -->
  {#if inputMode === null}
    <div class="mode-select" in:fade={{ duration: 200 }}>
      <p class="mode-prompt">How well do you know your water?</p>
      <div class="mode-buttons">
        <button class="mode-btn" onclick={() => inputMode = 'known'}>
          <span class="mode-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </span>
          <span class="mode-label">I have test results</span>
          <span class="mode-desc">Enter your GH and KH to see where your water falls</span>
        </button>
        <button class="mode-btn" onclick={() => inputMode = 'unknown'}>
          <span class="mode-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827m0 4.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </span>
          <span class="mode-label">I don't know my water</span>
          <span class="mode-desc">We'll help you figure it out</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- User Water Input -->
  {#if inputMode === 'known'}
    <div class="input-section" transition:slide={{ duration: 300 }}>
      <div class="input-row">
        <div class="input-group">
          <label class="field-label" for="user-gh">GH <span class="field-unit">ppm CaCO&#x2083;</span></label>
          <input id="user-gh" type="number" bind:value={userGH} min="0" max="500" step="1" placeholder="0" class="field-input" />
        </div>
        <div class="input-group">
          <label class="field-label" for="user-kh">KH <span class="field-unit">ppm CaCO&#x2083;</span></label>
          <input id="user-kh" type="number" bind:value={userKH} min="0" max="500" step="1" placeholder="0" class="field-input" />
        </div>
        {#if hasUserWater}
          <div class="input-summary" in:fade={{ duration: 200 }}>
            <span class="summary-item">TDS <strong>{userTDS}</strong></span>
            <span class="summary-sep">/</span>
            <span class="summary-item">GH:KH <strong>{userGHKHRatio}</strong></span>
          </div>
        {/if}
      </div>
      <button class="mode-switch" onclick={() => { inputMode = null; userGH = ''; userKH = ''; }}>
        &larr; Change input method
      </button>
    </div>
  {/if}

  {#if inputMode === 'unknown'}
    <div class="unknown-section" transition:slide={{ duration: 300 }}>
      <div class="unknown-card">
        <h3 class="unknown-title">How to test your water</h3>
        <div class="unknown-options">
          <div class="unknown-option">
            <span class="option-num">1</span>
            <div>
              <strong>Test strips</strong> &mdash; $8&ndash;15 on Amazon. Search "GH KH test strips." Fast, approximate (&plusmn;20 ppm). Good enough to place yourself on the chart.
            </div>
          </div>
          <div class="unknown-option">
            <span class="option-num">2</span>
            <div>
              <strong>API drop test kit</strong> &mdash; ~$15. More accurate than strips. The aquarium hobby standard. Takes 5 minutes.
            </div>
          </div>
          <div class="unknown-option">
            <span class="option-num">3</span>
            <div>
              <strong>Your city's water report</strong> &mdash; Free. Google "[your city] water quality report." Look for "Total Hardness" (GH) and "Alkalinity" (KH), reported as ppm CaCO&#x2083;.
            </div>
          </div>
        </div>
        <p class="unknown-note">
          Don't have results yet? Browse the recipes below &mdash; the chart still works. Or skip straight to distilled water + a recipe.
        </p>
      </div>
      <button class="mode-switch" onclick={() => inputMode = null}>
        &larr; Back
      </button>
    </div>
  {/if}

  <!-- SVG Scatter Chart -->
  <div class="chart-wrap">
    <svg viewBox="0 0 400 300" class="chart-svg" role="img" aria-label="Water chemistry scatter chart showing GH vs KH for coffee water recipes">
      <!-- Chart background -->
      <rect x={C.left} y={C.top} width={cW} height={cH} class="chart-bg" />

      <!-- Grid lines -->
      {#each xTicks as tick}
        <line x1={xScale(tick)} y1={C.top} x2={xScale(tick)} y2={C.bottom} class="grid-line" />
      {/each}
      {#each yTicks as tick}
        <line x1={C.left} y1={yScale(tick)} x2={C.right} y2={yScale(tick)} class="grid-line" />
      {/each}

      <!-- SCA Ideal Zone -->
      <rect
        x={xScale(SCA_ZONE.ghMin)}
        y={yScale(SCA_ZONE.khMax)}
        width={xScale(SCA_ZONE.ghMax) - xScale(SCA_ZONE.ghMin)}
        height={yScale(SCA_ZONE.khMin) - yScale(SCA_ZONE.khMax)}
        class="sca-zone"
      />
      <text
        x={xScale((SCA_ZONE.ghMin + SCA_ZONE.ghMax) / 2)}
        y={yScale(SCA_ZONE.khMax) + 12}
        class="sca-label"
      >SCA Ideal Zone</text>

      <!-- Axes -->
      <line x1={C.left} y1={C.bottom} x2={C.right} y2={C.bottom} class="axis-line" />
      <line x1={C.left} y1={C.top} x2={C.left} y2={C.bottom} class="axis-line" />

      <!-- X axis ticks & labels -->
      {#each xTicks as tick}
        <text x={xScale(tick)} y={C.bottom + 16} class="tick-label tick-x">{tick}</text>
      {/each}
      <text x={(C.left + C.right) / 2} y={C.bottom + 30} class="axis-title">GH (ppm)</text>

      <!-- Y axis ticks & labels -->
      {#each yTicks as tick}
        <text x={C.left - 8} y={yScale(tick) + 4} class="tick-label tick-y">{tick}</text>
      {/each}
      <text x={12} y={(C.top + C.bottom) / 2} class="axis-title axis-title-y" transform="rotate(-90, 12, {(C.top + C.bottom) / 2})">KH (ppm)</text>

      <!-- SCA reference point -->
      <circle cx={xScale(SCA.gh)} cy={yScale(SCA.kh)} r="5" class="sca-point" />
      <line x1={xScale(SCA.gh)} y1={yScale(SCA.kh) + 5} x2={xScale(SCA.gh)} y2={yScale(SCA.kh) + 12} class="sca-pointer" />
      <text x={xScale(SCA.gh)} y={yScale(SCA.kh) + 20} class="sca-point-label" text-anchor="middle">SCA Ideal</text>

      <!-- Connecting line (user to selected recipe) -->
      {#if hasUserWater && selectedRecipe}
        <line
          x1={xScale(Math.min(userGHNum, C.xMax))}
          y1={yScale(Math.min(userKHNum, C.yMax))}
          x2={xScale(selectedRecipe.gh)}
          y2={yScale(selectedRecipe.kh)}
          class="connect-line"
        />
      {/if}

      <!-- Recipe points -->
      {#each recipes as recipe, i}
        {@const cx = xScale(recipe.gh)}
        {@const cy = yScale(recipe.kh)}
        {@const isSelected = selectedRecipeId === recipe.id}
        {@const isHovered = hoveredRecipeId === recipe.id}
        <g
          class="recipe-group"
          class:recipe-selected={isSelected}
          onclick={() => selectRecipe(recipe.id)}
          onmouseenter={() => hoveredRecipeId = recipe.id}
          onmouseleave={() => hoveredRecipeId = null}
          role="button"
          tabindex="0"
          aria-label="{recipe.name}: GH {recipe.gh}, KH {recipe.kh}"
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectRecipe(recipe.id); }}}
        >
          <!-- Hit area -->
          <circle {cx} {cy} r="14" class="hit-area" />
          <!-- Visible point -->
          <circle {cx} {cy} r={isSelected ? 7 : isHovered ? 6.5 : 5.5} class="recipe-point" class:point-selected={isSelected} class:point-hovered={isHovered} />
          <!-- Number (mobile) -->
          <text x={cx} y={cy + 3.5} class="point-num mobile-label">{i + 1}</text>
          <!-- Name label (desktop) -->
          <text
            x={cx + (recipe.labelDx ?? 8)}
            y={cy + (recipe.labelDy ?? -8)}
            class="point-label desktop-label"
            text-anchor={recipe.labelDx < 0 ? 'end' : 'start'}
          >{recipe.name}</text>
          <!-- Hover tooltip -->
          {#if isHovered && !isSelected}
            <rect
              x={cx + 10} y={cy - 28} width={recipe.name.length * 6.5 + 16} height="20" rx="3"
              class="tooltip-bg"
            />
            <text x={cx + 18} y={cy - 14} class="tooltip-text mobile-label">{recipe.name}</text>
          {/if}
        </g>
      {/each}

      <!-- User water point -->
      {#if hasUserWater}
        {@const ux = xScale(Math.min(userGHNum, C.xMax))}
        {@const uy = yScale(Math.min(userKHNum, C.yMax))}
        <!-- Diamond marker -->
        <g class="user-marker">
          <polygon
            points="{ux},{uy - 8} {ux + 7},{uy} {ux},{uy + 8} {ux - 7},{uy}"
            class="user-diamond"
          />
          <polygon
            points="{ux},{uy - 8} {ux + 7},{uy} {ux},{uy + 8} {ux - 7},{uy}"
            class="user-diamond-pulse"
          />
          <text x={ux + 10} y={uy + 4} class="user-label">Your Water</text>
        </g>
      {/if}
    </svg>

    <!-- Mobile legend -->
    <div class="mobile-legend">
      {#each recipes as recipe, i}
        <button
          class="legend-item"
          class:legend-active={selectedRecipeId === recipe.id}
          onclick={() => selectRecipe(recipe.id)}
        >
          <span class="legend-num">{i + 1}</span>
          <span class="legend-name">{recipe.name}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Recipe Grid -->
  <div class="recipe-grid">
    <span class="section-label">Recipes</span>
    <div class="recipe-cards">
      {#each recipes as recipe, i}
        <button
          class="recipe-card"
          class:card-active={selectedRecipeId === recipe.id}
          onclick={() => selectRecipe(recipe.id)}
        >
          <div class="card-header">
            <span class="card-num">{i + 1}</span>
            <span class="card-name">{recipe.name}</span>
          </div>
          <div class="card-minerals">
            <span>GH {recipe.gh}</span>
            <span class="card-sep">/</span>
            <span>KH {recipe.kh}</span>
          </div>
          <div class="card-flavor">{recipe.flavor}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Detail Panel -->
  {#if selectedRecipe}
    <div class="detail-panel" transition:slide={{ duration: 300 }}>
      <div class="detail-header">
        <h3 class="detail-name">{selectedRecipe.name}</h3>
        <button class="detail-close" onclick={() => { selectedRecipeId = null; showDIY = false; }} aria-label="Close">&times;</button>
      </div>

      <p class="detail-desc">{selectedRecipe.desc}</p>

      <div class="detail-stats">
        <div class="stat">
          <span class="stat-label">GH</span>
          <span class="stat-value">{selectedRecipe.gh}</span>
          <span class="stat-unit">ppm</span>
        </div>
        <div class="stat">
          <span class="stat-label">KH</span>
          <span class="stat-value">{selectedRecipe.kh}</span>
          <span class="stat-unit">ppm</span>
        </div>
        <div class="stat">
          <span class="stat-label">TDS</span>
          <span class="stat-value">{selectedRecipe.tds}</span>
          <span class="stat-unit">ppm</span>
        </div>
        <div class="stat">
          <span class="stat-label">GH:KH</span>
          <span class="stat-value">{selectedRecipe.ghkhRatio}</span>
        </div>
      </div>

      <div class="detail-meta">
        <div class="meta-row">
          <span class="meta-label">Flavor</span>
          <span class="meta-value">{selectedRecipe.flavor}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Best for</span>
          <span class="meta-value">{selectedRecipe.bestFor}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Boiler safe</span>
          <span class="meta-value">{selectedRecipe.boilerSafe ? 'Yes' : 'No \u2014 may cause scale'}</span>
        </div>
      </div>

      <!-- Comparison (user water vs recipe) -->
      {#if hasUserWater}
        <div class="comparison" transition:slide={{ duration: 200 }}>
          <span class="section-label">Your Water vs. {selectedRecipe.name}</span>
          <div class="compare-table">
            <div class="compare-header">
              <span></span>
              <span>Yours</span>
              <span>Recipe</span>
              <span>Delta</span>
            </div>
            <div class="compare-row">
              <span class="compare-label">GH</span>
              <span class="compare-val">{userGHNum}</span>
              <span class="compare-val">{selectedRecipe.gh}</span>
              <span class="compare-delta" class:delta-pos={deltaGH > 0} class:delta-neg={deltaGH < 0}>{formatDelta(deltaGH)}</span>
            </div>
            <div class="compare-row">
              <span class="compare-label">KH</span>
              <span class="compare-val">{userKHNum}</span>
              <span class="compare-val">{selectedRecipe.kh}</span>
              <span class="compare-delta" class:delta-pos={deltaKH > 0} class:delta-neg={deltaKH < 0}>{formatDelta(deltaKH)}</span>
            </div>
          </div>
          <p class="compare-note">
            For best results, start from distilled water rather than adjusting tap water. Tap contains unknown minerals that affect extraction unpredictably.
          </p>
        </div>
      {/if}

      <!-- Make This Recipe button -->
      {#if !showDIY}
        <button class="diy-trigger" onclick={() => showDIY = true}>
          Make This Recipe
        </button>
      {/if}

      <!-- DIY Calculator -->
      {#if showDIY}
        <div class="diy-section" transition:slide={{ duration: 300 }}>
          <span class="section-label">DIY Instructions</span>

          {#if selectedRecipe.diyType === 'packet'}
            <!-- TWW packets -->
            <div class="diy-packet">
              <p class="diy-packet-text">
                Add <strong>1 packet</strong> of {selectedRecipe.name} to <strong>1 gallon</strong> (3.785 L) of distilled water. Shake until dissolved.
              </p>
              <p class="diy-note">Pre-measured packets &mdash; no scale needed. Available from Third Wave Water.</p>
            </div>

          {:else if selectedRecipe.diyType === 'rpavlis'}
            <!-- RPavlis single-ingredient -->
            <div class="diy-rpavlis">
              <div class="batch-select">
                <span class="batch-label">Batch size</span>
                <div class="batch-buttons">
                  <button class:batch-active={batchSize === 1} onclick={() => setBatch(1)}>1 L</button>
                  <button class:batch-active={batchSize === 2} onclick={() => setBatch(2)}>2 L</button>
                  <button class:batch-active={batchSize === 3.785} onclick={() => setBatch(3.785)}>1 gal</button>
                  <button class:batch-active={batchSize === 5} onclick={() => setBatch(5)}>5 L</button>
                </div>
              </div>
              <div class="diy-result">
                <div class="diy-ingredient">
                  <span class="ingr-amount">{rpavlisG}g</span>
                  <span class="ingr-name">Potassium Bicarbonate (KHCO&#x2083;)</span>
                </div>
                <div class="diy-plus">+</div>
                <div class="diy-ingredient">
                  <span class="ingr-amount">{batchSize * 1000}mL</span>
                  <span class="ingr-name">Distilled Water</span>
                </div>
              </div>
              <p class="diy-note">Dissolve the KHCO&#x2083; directly into the distilled water. No concentrates needed. Use a 0.01g precision scale.</p>
            </div>

          {:else}
            <!-- Two-bottle method -->
            <div class="diy-twobottle">
              <div class="batch-select">
                <span class="batch-label">Batch size</span>
                <div class="batch-buttons">
                  <button class:batch-active={batchSize === 1} onclick={() => setBatch(1)}>1 L</button>
                  <button class:batch-active={batchSize === 2} onclick={() => setBatch(2)}>2 L</button>
                  <button class:batch-active={batchSize === 3.785} onclick={() => setBatch(3.785)}>1 gal</button>
                  <button class:batch-active={batchSize === 5} onclick={() => setBatch(5)}>5 L</button>
                </div>
              </div>

              <!-- Concentrate prep -->
              <div class="concentrate-prep">
                <span class="prep-title">First, make two concentrates (one-time)</span>
                <div class="prep-bottles">
                  <div class="prep-bottle">
                    <span class="bottle-label">Bottle 1 &mdash; GH</span>
                    <span class="bottle-recipe">2.46g Epsom Salt (MgSO&#x2084;&middot;7H&#x2082;O) per 1L distilled water</span>
                  </div>
                  <div class="prep-bottle">
                    <span class="bottle-label">Bottle 2 &mdash; KH</span>
                    <span class="bottle-recipe">1.68g Baking Soda (NaHCO&#x2083;) per 1L distilled water</span>
                  </div>
                </div>
                <p class="prep-note">Each 1 mL added to 1 L of water = 1 ppm. Store at room temperature. Lasts months.</p>
              </div>

              <!-- Per-batch amounts -->
              <div class="diy-result">
                <div class="diy-ingredient">
                  <span class="ingr-amount">{bottle1mL} mL</span>
                  <span class="ingr-name">Bottle 1 (GH)</span>
                </div>
                <div class="diy-plus">+</div>
                <div class="diy-ingredient">
                  <span class="ingr-amount">{bottle2mL} mL</span>
                  <span class="ingr-name">Bottle 2 (KH)</span>
                </div>
                <div class="diy-plus">+</div>
                <div class="diy-ingredient">
                  <span class="ingr-amount">{distilledmL} mL</span>
                  <span class="ingr-name">Distilled Water</span>
                </div>
                <div class="diy-equals">=</div>
                <div class="diy-ingredient diy-total">
                  <span class="ingr-amount">{batchSize * 1000} mL</span>
                  <span class="ingr-name">Brew Water</span>
                </div>
              </div>

              <p class="diy-note">Measure concentrates with a syringe or graduated cylinder. Add to distilled water and stir.</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  /* ========== Layout ========== */
  .water-builder {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section-label {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #D27D2D;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  /* ========== Mode Selection ========== */
  .mode-select {
    text-align: center;
  }
  .mode-prompt {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.3rem;
    color: #E2E8F0;
    margin-bottom: 1.25rem;
  }
  .mode-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
  }
  @media (max-width: 480px) {
    .mode-buttons { grid-template-columns: 1fr; }
  }
  .mode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem 1rem;
    border: 1px solid rgba(210, 125, 45, 0.15);
    background: #161B22;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    border-radius: 6px;
  }
  .mode-btn:hover {
    border-color: rgba(210, 125, 45, 0.4);
    background: #21262D;
  }
  .mode-icon {
    color: #D27D2D;
  }
  .mode-label {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.05rem;
    font-weight: 600;
    color: #E2E8F0;
  }
  .mode-desc {
    font-size: 0.75rem;
    color: #94A3B8;
    line-height: 1.4;
  }

  /* ========== User Water Input ========== */
  .input-section {
    padding: 1.25rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 6px;
  }
  .input-row {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .input-group {
    flex: 0 0 auto;
  }
  .field-label {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #D27D2D;
    font-weight: 600;
    margin-bottom: 0.35rem;
  }
  .field-unit {
    color: #94A3B8;
    font-weight: 400;
    font-size: 0.6rem;
  }
  .field-input {
    width: 100px;
    padding: 0.6rem 0.75rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1.1rem;
    font-weight: 500;
    color: #E2E8F0;
    background: #0B0E14;
    border: 1px solid rgba(210, 125, 45, 0.25);
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s;
    -moz-appearance: textfield;
  }
  .field-input::-webkit-outer-spin-button,
  .field-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .field-input:focus {
    border-color: #D27D2D;
  }
  .field-input::placeholder {
    color: #475569;
  }

  .input-summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 0.6rem;
  }
  .summary-item {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    color: #94A3B8;
  }
  .summary-item strong {
    color: #E2E8F0;
    font-weight: 600;
  }
  .summary-sep {
    color: #475569;
    font-size: 0.7rem;
  }

  .mode-switch {
    display: inline-block;
    margin-top: 0.75rem;
    font-size: 0.7rem;
    color: #94A3B8;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .mode-switch:hover {
    color: #D27D2D;
  }

  /* ========== Unknown Water Guidance ========== */
  .unknown-section {
    max-width: 500px;
    margin: 0 auto;
  }
  .unknown-card {
    padding: 1.5rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 6px;
  }
  .unknown-title {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: #E2E8F0;
    margin-bottom: 1rem;
  }
  .unknown-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .unknown-option {
    display: flex;
    gap: 0.75rem;
    font-size: 0.8rem;
    color: #94A3B8;
    line-height: 1.5;
  }
  .unknown-option strong {
    color: #E2E8F0;
  }
  .option-num {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    font-weight: 700;
    color: #D27D2D;
    border: 1px solid rgba(210, 125, 45, 0.3);
    border-radius: 50%;
  }
  .unknown-note {
    margin-top: 1rem;
    font-size: 0.75rem;
    color: #64748B;
    font-style: italic;
    line-height: 1.5;
  }

  /* ========== Chart ========== */
  .chart-wrap {
    position: relative;
  }
  .chart-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  /* SVG elements */
  .chart-bg {
    fill: #0D1117;
    rx: 2;
  }
  .grid-line {
    stroke: rgba(210, 125, 45, 0.06);
    stroke-width: 0.5;
  }
  .sca-zone {
    fill: rgba(210, 125, 45, 0.06);
    stroke: rgba(210, 125, 45, 0.2);
    stroke-width: 0.75;
    stroke-dasharray: 4 3;
  }
  .sca-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6px;
    fill: rgba(210, 125, 45, 0.35);
    text-anchor: middle;
  }
  .axis-line {
    stroke: rgba(210, 125, 45, 0.2);
    stroke-width: 1;
  }
  .tick-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #64748B;
  }
  .tick-x { text-anchor: middle; }
  .tick-y { text-anchor: end; }
  .axis-title {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #94A3B8;
    text-anchor: middle;
  }
  .axis-title-y {
    text-anchor: middle;
  }

  /* SCA reference point */
  .sca-point {
    fill: rgba(210, 125, 45, 0.12);
    stroke: rgba(210, 125, 45, 0.6);
    stroke-width: 1.5;
    stroke-dasharray: 2 2;
  }
  .sca-pointer {
    stroke: rgba(210, 125, 45, 0.3);
    stroke-width: 0.75;
  }
  .sca-point-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6px;
    fill: rgba(210, 125, 45, 0.5);
  }

  /* Recipe points */
  .recipe-group { cursor: pointer; }
  .hit-area { fill: transparent; }
  .recipe-point {
    fill: #D27D2D;
    stroke: #0B0E14;
    stroke-width: 1.5;
    transition: r 0.15s ease;
  }
  .point-selected {
    fill: #F59E0B;
    stroke: #0B0E14;
    stroke-width: 2;
  }
  .point-hovered {
    fill: #E89144;
  }
  .point-num {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6px;
    fill: #0B0E14;
    font-weight: 700;
    text-anchor: middle;
    pointer-events: none;
  }
  .point-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6.5px;
    fill: #94A3B8;
    pointer-events: none;
  }
  .recipe-selected .point-label {
    fill: #F59E0B;
    font-weight: 600;
  }

  /* Tooltip */
  .tooltip-bg {
    fill: #21262D;
    stroke: rgba(210, 125, 45, 0.25);
    stroke-width: 0.5;
  }
  .tooltip-text {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #E2E8F0;
  }

  /* Connecting line */
  .connect-line {
    stroke: #F59E0B;
    stroke-width: 1;
    stroke-dasharray: 4 3;
    opacity: 0.5;
  }

  /* User marker */
  .user-diamond {
    fill: #F59E0B;
    stroke: #0B0E14;
    stroke-width: 1.5;
  }
  .user-diamond-pulse {
    fill: none;
    stroke: #F59E0B;
    stroke-width: 1;
    animation: diamond-pulse 2s ease-in-out infinite;
  }
  @keyframes diamond-pulse {
    0%, 100% { opacity: 0; stroke-width: 1; }
    50% { opacity: 0.6; stroke-width: 2.5; }
  }
  .user-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6.5px;
    fill: #F59E0B;
    font-weight: 600;
  }

  /* Desktop / Mobile label toggle */
  .mobile-label { display: none; }
  .desktop-label { display: block; }
  @media (max-width: 640px) {
    .mobile-label { display: block; }
    .desktop-label { display: none; }
  }

  /* Mobile legend */
  .mobile-legend {
    display: none;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-top: 0.75rem;
  }
  @media (max-width: 640px) {
    .mobile-legend { display: flex; }
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.5rem;
    background: transparent;
    border: 1px solid rgba(210, 125, 45, 0.12);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .legend-item:hover {
    border-color: rgba(210, 125, 45, 0.3);
  }
  .legend-active {
    border-color: #F59E0B;
    background: rgba(245, 158, 11, 0.08);
  }
  .legend-num {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    color: #D27D2D;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(210, 125, 45, 0.15);
    border-radius: 50%;
  }
  .legend-active .legend-num {
    background: #F59E0B;
    color: #0B0E14;
  }
  .legend-name {
    font-size: 0.65rem;
    color: #94A3B8;
  }
  .legend-active .legend-name {
    color: #F59E0B;
  }

  /* ========== Recipe Grid ========== */
  .recipe-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  @media (max-width: 768px) {
    .recipe-cards { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 480px) {
    .recipe-cards { grid-template-columns: 1fr; }
  }

  .recipe-card {
    padding: 0.75rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.1);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }
  .recipe-card:hover {
    border-color: rgba(210, 125, 45, 0.3);
    background: #1A2030;
  }
  .card-active {
    border-color: #F59E0B;
    background: rgba(245, 158, 11, 0.06);
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.35rem;
  }
  .card-num {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    color: #D27D2D;
    background: rgba(210, 125, 45, 0.1);
    border-radius: 50%;
    flex-shrink: 0;
  }
  .card-active .card-num {
    background: #F59E0B;
    color: #0B0E14;
  }
  .card-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: #E2E8F0;
  }
  .card-minerals {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    color: #94A3B8;
    margin-bottom: 0.25rem;
  }
  .card-sep {
    color: #475569;
    margin: 0 0.15rem;
  }
  .card-flavor {
    font-size: 0.7rem;
    color: #64748B;
  }

  /* ========== Detail Panel ========== */
  .detail-panel {
    padding: 1.5rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.2);
    border-radius: 6px;
  }
  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  .detail-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: #E2E8F0;
  }
  .detail-close {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    color: #64748B;
    background: none;
    border: 1px solid rgba(210, 125, 45, 0.1);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .detail-close:hover {
    color: #E2E8F0;
    border-color: rgba(210, 125, 45, 0.3);
  }
  .detail-desc {
    font-size: 0.85rem;
    color: #94A3B8;
    line-height: 1.6;
    margin-bottom: 1.25rem;
  }

  .detail-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
    flex-wrap: wrap;
  }
  .stat {
    flex: 1;
    min-width: 70px;
    padding: 0.6rem 0.75rem;
    background: #0B0E14;
    border: 1px solid rgba(210, 125, 45, 0.1);
    border-radius: 4px;
    text-align: center;
  }
  .stat-label {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #D27D2D;
    margin-bottom: 0.2rem;
  }
  .stat-value {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1.15rem;
    font-weight: 600;
    color: #E2E8F0;
  }
  .stat-unit {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.55rem;
    color: #64748B;
  }

  .detail-meta {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
    padding: 0.75rem;
    background: rgba(210, 125, 45, 0.03);
    border-radius: 4px;
  }
  .meta-row {
    display: flex;
    gap: 0.75rem;
    font-size: 0.8rem;
  }
  .meta-label {
    flex-shrink: 0;
    width: 80px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748B;
    padding-top: 0.1rem;
  }
  .meta-value {
    color: #94A3B8;
    line-height: 1.4;
  }

  /* ========== Comparison ========== */
  .comparison {
    margin-bottom: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(210, 125, 45, 0.1);
  }
  .compare-table {
    display: grid;
    grid-template-columns: 60px 1fr 1fr 1fr;
    gap: 0;
    margin-bottom: 0.75rem;
  }
  .compare-header {
    display: contents;
  }
  .compare-header span {
    padding: 0.35rem 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #64748B;
    border-bottom: 1px solid rgba(210, 125, 45, 0.1);
  }
  .compare-row {
    display: contents;
  }
  .compare-row span {
    padding: 0.4rem 0.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.8rem;
    border-bottom: 1px solid rgba(210, 125, 45, 0.05);
  }
  .compare-label {
    color: #64748B;
    font-size: 0.65rem !important;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .compare-val {
    color: #E2E8F0;
  }
  .compare-delta {
    color: #94A3B8;
    font-weight: 600;
  }
  .delta-pos { color: #22C55E; }
  .delta-neg { color: #F87171; }
  .compare-note {
    font-size: 0.72rem;
    color: #64748B;
    font-style: italic;
    line-height: 1.5;
  }

  /* ========== DIY Trigger ========== */
  .diy-trigger {
    display: block;
    width: 100%;
    padding: 0.75rem;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem;
    font-weight: 600;
    color: #0B0E14;
    background: #D27D2D;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
  }
  .diy-trigger:hover {
    background: #E89144;
  }

  /* ========== DIY Section ========== */
  .diy-section {
    padding-top: 1rem;
    border-top: 1px solid rgba(210, 125, 45, 0.1);
  }

  /* Batch size selector */
  .batch-select {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .batch-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #64748B;
  }
  .batch-buttons {
    display: flex;
    gap: 0.35rem;
  }
  .batch-buttons button {
    padding: 0.35rem 0.75rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    color: #94A3B8;
    background: #0B0E14;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .batch-buttons button:hover {
    border-color: rgba(210, 125, 45, 0.4);
    color: #E2E8F0;
  }
  .batch-active {
    border-color: #D27D2D !important;
    color: #D27D2D !important;
    background: rgba(210, 125, 45, 0.08) !important;
  }

  /* Concentrate prep */
  .concentrate-prep {
    margin-bottom: 1.25rem;
    padding: 1rem;
    background: rgba(210, 125, 45, 0.04);
    border: 1px solid rgba(210, 125, 45, 0.1);
    border-radius: 4px;
  }
  .prep-title {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #D27D2D;
    margin-bottom: 0.75rem;
  }
  .prep-bottles {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .prep-bottle {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .bottle-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    font-weight: 600;
    color: #E2E8F0;
  }
  .bottle-recipe {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    color: #94A3B8;
  }
  .prep-note {
    font-size: 0.7rem;
    color: #64748B;
    margin-top: 0.6rem;
    font-style: italic;
  }

  /* DIY result display */
  .diy-result {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    padding: 1rem 0;
  }
  .diy-ingredient {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.6rem 1rem;
    background: #0B0E14;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 4px;
    min-width: 90px;
  }
  .diy-total {
    border-color: #D27D2D;
    background: rgba(210, 125, 45, 0.06);
  }
  .ingr-amount {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1.05rem;
    font-weight: 700;
    color: #E2E8F0;
  }
  .diy-total .ingr-amount {
    color: #D27D2D;
  }
  .ingr-name {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.55rem;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 0.15rem;
  }
  .diy-plus, .diy-equals {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1rem;
    color: #475569;
    font-weight: 600;
  }
  .diy-equals {
    color: #D27D2D;
  }

  .diy-note {
    font-size: 0.72rem;
    color: #64748B;
    text-align: center;
    font-style: italic;
    line-height: 1.5;
    margin-top: 0.25rem;
  }

  /* Packet type */
  .diy-packet {
    text-align: center;
    padding: 1rem 0;
  }
  .diy-packet-text {
    font-size: 0.9rem;
    color: #E2E8F0;
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }
  .diy-packet-text strong {
    color: #D27D2D;
    font-weight: 700;
  }

  /* RPavlis type */
  .diy-rpavlis {
    text-align: center;
  }
</style>
