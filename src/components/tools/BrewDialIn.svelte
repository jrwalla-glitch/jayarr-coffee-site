<script>
  // Brew Dial-In Recommendation Card
  // Svelte 5 — runes for state management
  // Consumes pre-computed recommendation JSON from the rules engine

  /** @type {{ recommendationData: any, beanData: any }} */
  let { recommendationData = null, beanData = null } = $props();

  // --- State ---
  let phase = $state('entry');          // entry | brewer_select | bean_card | flavor_select
  let selectedBrewer = $state(null);
  let flipped = $state(false);
  let tasteResult = $state(null);       // null | sour | bitter | thin | strong | flat | nailed
  let adjustedRecipe = $state(null);
  let savedRecipes = $state([]);

  // Load saved recipes from localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('brew-dial-in-saved');
      if (saved) savedRecipes = JSON.parse(saved);
    } catch {}
  }

  // --- Brewers ---
  const BREWERS = [
    { id: 'hario-v60-02',    name: 'V60',           icon: '△', category: 'Pour Over' },
    { id: 'chemex-6cup',     name: 'Chemex',        icon: '⧖', category: 'Pour Over' },
    { id: 'kalita-wave-185', name: 'Kalita Wave',   icon: '▭', category: 'Pour Over' },
    { id: 'aeropress',       name: 'AeroPress',     icon: '⊘', category: 'Hybrid' },
    { id: 'clever-dripper',  name: 'Clever',        icon: '⊡', category: 'Hybrid' },
    { id: 'french-press',    name: 'French Press',  icon: '⊞', category: 'Immersion' },
    { id: 'espresso-generic',name: 'Espresso',      icon: '◉', category: 'Pressure' },
    { id: 'moka-pot',        name: 'Moka Pot',      icon: '⬡', category: 'Pressure' },
    { id: 'cold-brew',       name: 'Cold Brew',     icon: '❄', category: 'Cold' },
  ];

  // --- Flavor vibes (Path 3) ---
  const VIBES = [
    { id: 'comfort',   label: 'Morning Comfort',    desc: 'Chocolatey, smooth, nutty',       icon: '☕' },
    { id: 'bright',    label: 'Bright & Clean',     desc: 'Citrus, floral, tea-like',        icon: '✦' },
    { id: 'bold',      label: 'Rich & Bold',        desc: 'Full body, dark chocolate, spice',icon: '◆' },
    { id: 'fruity',    label: 'Fruity & Complex',   desc: 'Berry, tropical, wine-like',      icon: '❋' },
    { id: 'sweet',     label: 'Sweet Without Sugar', desc: 'Caramel, honey, stone fruit',    icon: '✿' },
  ];

  // --- Derived ---
  let currentRec = $derived(
    selectedBrewer && recommendationData?.recommendations?.[selectedBrewer]
      ? recommendationData.recommendations[selectedBrewer]
      : null
  );

  let displayRecipe = $derived(adjustedRecipe || currentRec?.recipe);

  let matchColor = $derived.by(() => {
    if (!currentRec) return '#94A3B8';
    const s = currentRec.match_score;
    if (s >= 85) return '#4ADE80';
    if (s >= 70) return '#D27D2D';
    if (s >= 50) return '#FBBF24';
    return '#F87171';
  });

  let matchLabel = $derived.by(() => {
    if (!currentRec) return '';
    const s = currentRec.match_score;
    if (s >= 85) return 'Excellent match';
    if (s >= 70) return 'Good match';
    if (s >= 50) return 'Decent match';
    return 'Not ideal';
  });

  let profile = $derived(recommendationData?.profile);

  let sortedBrewers = $derived.by(() => {
    if (!recommendationData?.recommendations) return BREWERS;
    return [...BREWERS].sort((a, b) => {
      const scoreA = recommendationData.recommendations[a.id]?.match_score ?? 0;
      const scoreB = recommendationData.recommendations[b.id]?.match_score ?? 0;
      return scoreB - scoreA;
    });
  });

  // --- Actions ---
  function selectBrewer(brewerId) {
    selectedBrewer = brewerId;
    flipped = false;
    tasteResult = null;
    adjustedRecipe = null;
    phase = 'bean_card';
  }

  function handleTaste(issue) {
    if (issue === 'nailed') {
      tasteResult = 'nailed';
      saveRecipe();
      return;
    }
    tasteResult = issue;
    const adj = currentRec?.adjustments?.[issue];
    if (adj?.adjusted_recipe) {
      // Merge adjusted values into current recipe
      adjustedRecipe = { ...displayRecipe, ...adj.adjusted_recipe };
    }
  }

  function resetTaste() {
    tasteResult = null;
    adjustedRecipe = null;
  }

  function saveRecipe() {
    if (!currentRec || !beanData) return;
    const recipe = {
      bean_id: beanData.id,
      bean_name: beanData.name,
      roaster: beanData.roaster,
      brewer_id: selectedBrewer,
      brewer_name: currentRec.brewer_name,
      recipe: displayRecipe,
      saved_at: new Date().toISOString(),
    };
    savedRecipes = [...savedRecipes, recipe];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('brew-dial-in-saved', JSON.stringify(savedRecipes));
      } catch {}
    }
  }

  function goBack() {
    if (phase === 'bean_card') {
      phase = 'brewer_select';
      flipped = false;
      tasteResult = null;
      adjustedRecipe = null;
    } else {
      phase = 'entry';
    }
  }

  function tempDisplay(band) {
    if (!band) return '';
    const fMin = Math.round(band.min * 9/5 + 32);
    const fMax = Math.round(band.max * 9/5 + 32);
    const fStart = Math.round(band.start * 9/5 + 32);
    return `${fMin}-${fMax}°F (start ${fStart})`;
  }
</script>

<div class="dial-in">
  <!-- ENTRY: Three Doors -->
  {#if phase === 'entry'}
    <div class="entry-header">
      <h2>Brew Dial-In</h2>
      <p class="subtitle">Science-backed starting points for your next cup</p>
    </div>

    <div class="entry-doors">
      <button class="door" onclick={() => { phase = 'brewer_select'; }}>
        <span class="door-icon">△</span>
        <span class="door-label">I have a brewer</span>
        <span class="door-hint">Show me what beans to use</span>
      </button>

      <button class="door" onclick={() => { phase = 'brewer_select'; }}>
        <span class="door-icon">☕</span>
        <span class="door-label">I have beans</span>
        <span class="door-hint">Show me how to brew them</span>
      </button>

      <button class="door" onclick={() => { phase = 'flavor_select'; }}>
        <span class="door-icon">✦</span>
        <span class="door-label">I want a flavor</span>
        <span class="door-hint">Help me find the right cup</span>
      </button>
    </div>

    {#if savedRecipes.length > 0}
      <div class="saved-count">
        <span class="saved-icon">★</span> {savedRecipes.length} saved recipe{savedRecipes.length !== 1 ? 's' : ''}
      </div>
    {/if}

  <!-- FLAVOR VIBES (Path 3) -->
  {:else if phase === 'flavor_select'}
    <div class="phase-header">
      <button class="back-btn" onclick={goBack}>← Back</button>
      <h3>What are you in the mood for?</h3>
    </div>

    <div class="vibe-grid">
      {#each VIBES as vibe}
        <button class="vibe-card" onclick={() => { phase = 'brewer_select'; }}>
          <span class="vibe-icon">{vibe.icon}</span>
          <span class="vibe-label">{vibe.label}</span>
          <span class="vibe-desc">{vibe.desc}</span>
        </button>
      {/each}
    </div>

  <!-- BREWER SELECT -->
  {:else if phase === 'brewer_select'}
    <div class="phase-header">
      <button class="back-btn" onclick={goBack}>← Back</button>
      <h3>
        {#if beanData}
          {beanData.name}
          <span class="roaster-label">by {beanData.roaster}</span>
        {:else}
          Choose your brewer
        {/if}
      </h3>
    </div>

    {#if beanData && profile?.category?.deviations?.length > 0}
      <div class="deviation-badge">
        {profile.category.deviations[0].summary}
      </div>
    {/if}

    <div class="brewer-grid">
      {#each sortedBrewers as brewer}
        {@const rec = recommendationData?.recommendations?.[brewer.id]}
        {@const score = rec?.match_score ?? 0}
        <button
          class="brewer-card"
          class:best={score >= 85}
          class:poor={score < 50}
          onclick={() => selectBrewer(brewer.id)}
        >
          <span class="brewer-icon">{brewer.icon}</span>
          <span class="brewer-name">{brewer.name}</span>
          {#if score > 0}
            <span class="brewer-score" style="color: {score >= 85 ? '#4ADE80' : score >= 70 ? '#D27D2D' : score >= 50 ? '#FBBF24' : '#F87171'}">{score}</span>
          {/if}
          <span class="brewer-category">{brewer.category}</span>
        </button>
      {/each}
    </div>

  <!-- RECOMMENDATION CARD -->
  {:else if phase === 'bean_card' && currentRec && displayRecipe}
    <div class="phase-header">
      <button class="back-btn" onclick={goBack}>← Back</button>
      <div class="card-title">
        <h3>{currentRec.brewer_name} + {beanData?.name || 'Your Beans'}</h3>
        <div class="match-badge" style="background: {matchColor}">
          {currentRec.match_score}
          <span class="match-label">{matchLabel}</span>
        </div>
      </div>
    </div>

    <div class="rec-card" class:flipped>
      <!-- FRONT -->
      <div class="card-face card-front">
        <div class="recipe-grid">
          <div class="recipe-row">
            <span class="recipe-label">Coffee</span>
            <span class="recipe-value">{displayRecipe.dose_g.start}g</span>
            <span class="recipe-range">{displayRecipe.dose_g.min}-{displayRecipe.dose_g.max}g</span>
          </div>

          {#if currentRec.brewer_id !== 'espresso-generic'}
            <div class="recipe-row">
              <span class="recipe-label">Water</span>
              <span class="recipe-value">{displayRecipe.water_g.start}g</span>
              <span class="recipe-range">{displayRecipe.water_g.min}-{displayRecipe.water_g.max}g</span>
            </div>
          {/if}

          <div class="recipe-row">
            <span class="recipe-label">Temperature</span>
            <span class="recipe-value">{displayRecipe.temp_c.start}°C</span>
            <span class="recipe-range">{tempDisplay(displayRecipe.temp_c)}</span>
          </div>

          <div class="recipe-row">
            <span class="recipe-label">Grind</span>
            <span class="recipe-value">{displayRecipe.grind_um.start}μm</span>
            <span class="recipe-range">{displayRecipe.grind_um.min}-{displayRecipe.grind_um.max}μm</span>
          </div>

          <div class="recipe-row">
            <span class="recipe-label">Time</span>
            <span class="recipe-value">{displayRecipe.time_display || currentRec.recipe.time_display}</span>
          </div>

          <div class="recipe-row">
            <span class="recipe-label">Ratio</span>
            <span class="recipe-value">{displayRecipe.ratio_display || currentRec.recipe.ratio_display}</span>
          </div>
        </div>

        {#if currentRec.flavor_prediction}
          <div class="flavor-expect">
            <span class="expect-label">Expect</span>
            <span class="expect-value">{currentRec.flavor_prediction.expect}</span>
          </div>
        {/if}

        <button class="flip-btn" onclick={() => { flipped = true; }}>
          Why these numbers? →
        </button>
      </div>

      <!-- BACK -->
      <div class="card-face card-back">
        <div class="narrative">
          {#if currentRec.narrative}
            <p>{currentRec.narrative}</p>
          {:else}
            <p class="narrative-placeholder">Bespoke narrative will be generated for this bean + brewer combination, explaining the coffee science behind these specific recommendations.</p>
          {/if}

          {#if currentRec.flavor_prediction?.brewer_effect}
            <p class="brewer-effect">{currentRec.flavor_prediction.brewer_effect}</p>
          {/if}

          {#if profile?.category?.deviations?.length > 0}
            <div class="deviations-detail">
              {#each profile.category.deviations as dev}
                <div class="deviation-item">
                  <span class="dev-type">{dev.type}</span>
                  <p>{dev.narrative_hook}</p>
                  <p class="dev-impact">{dev.brewing_impact}</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <button class="flip-btn" onclick={() => { flipped = false; }}>
          ← Back to recipe
        </button>
      </div>
    </div>

    <!-- TASTE LOOP -->
    <div class="taste-loop">
      {#if tasteResult === 'nailed'}
        <div class="taste-success">
          <span class="success-icon">★</span>
          Recipe saved! Enjoy your cup.
        </div>
      {:else if tasteResult && currentRec.adjustments?.[tasteResult]}
        <div class="taste-adjustment">
          <p class="adj-primary">{currentRec.adjustments[tasteResult].primary}</p>
          {#if currentRec.adjustments[tasteResult].secondary}
            <p class="adj-secondary">{currentRec.adjustments[tasteResult].secondary}</p>
          {/if}
          <p class="adj-explanation">{currentRec.adjustments[tasteResult].explanation}</p>
          <button class="taste-reset" onclick={resetTaste}>Try original recipe</button>
        </div>
      {:else}
        <p class="taste-prompt">How did it taste?</p>
        <div class="taste-buttons">
          <button class="taste-btn taste-sour" onclick={() => handleTaste('sour')}>Sour / Sharp</button>
          <button class="taste-btn taste-bitter" onclick={() => handleTaste('bitter')}>Bitter / Harsh</button>
          <button class="taste-btn taste-thin" onclick={() => handleTaste('thin')}>Thin / Watery</button>
          <button class="taste-btn taste-strong" onclick={() => handleTaste('strong')}>Too Strong</button>
          <button class="taste-btn taste-flat" onclick={() => handleTaste('flat')}>Flat / Bland</button>
          <button class="taste-btn taste-nailed" onclick={() => handleTaste('nailed')}>Nailed it!</button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .dial-in {
    --copper: #D27D2D;
    --copper-light: #E09040;
    --surface: #161B22;
    --surface-2: #21262D;
    --surface-3: #30363D;
    --text: #E2E8F0;
    --text-muted: #94A3B8;
    --green: #4ADE80;
    --red: #F87171;
    --yellow: #FBBF24;
    --font-serif: 'Cormorant Garamond', Georgia, serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

    font-family: var(--font-serif);
    color: var(--text);
    max-width: 480px;
    margin: 0 auto;
    padding: 1.5rem 1rem;
  }

  /* --- Entry --- */
  .entry-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .entry-header h2 {
    font-size: 2rem;
    font-weight: 600;
    color: var(--copper);
    margin: 0 0 0.5rem;
    letter-spacing: 0.02em;
  }
  .subtitle {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .entry-doors {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .door {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.25rem;
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text);
    font-family: inherit;
  }
  .door:hover {
    border-color: var(--copper);
    background: var(--surface-2);
  }
  .door-icon {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  .door-label {
    font-size: 1.15rem;
    font-weight: 600;
  }
  .door-hint {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .saved-count {
    text-align: center;
    margin-top: 1.5rem;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
  }
  .saved-icon { color: var(--copper); }

  /* --- Phase Header --- */
  .phase-header {
    margin-bottom: 1.25rem;
  }
  .back-btn {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }
  .back-btn:hover { color: var(--copper); }

  .phase-header h3 {
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0;
    color: var(--text);
  }
  .roaster-label {
    font-weight: 400;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .deviation-badge {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--copper);
    background: rgba(210, 125, 45, 0.1);
    border: 1px solid rgba(210, 125, 45, 0.3);
    border-radius: 6px;
    padding: 0.4rem 0.75rem;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  /* --- Flavor Vibes --- */
  .vibe-grid {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .vibe-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.25rem;
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text);
    font-family: inherit;
    text-align: left;
  }
  .vibe-card:hover {
    border-color: var(--copper);
    background: var(--surface-2);
  }
  .vibe-icon { font-size: 1.25rem; margin-bottom: 0.25rem; }
  .vibe-label { font-size: 1.05rem; font-weight: 600; }
  .vibe-desc {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 0.15rem;
  }

  /* --- Brewer Grid --- */
  .brewer-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
  }
  .brewer-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.9rem 0.5rem;
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text);
    font-family: inherit;
    position: relative;
  }
  .brewer-card:hover {
    border-color: var(--copper);
    background: var(--surface-2);
  }
  .brewer-card.best {
    border-color: rgba(74, 222, 128, 0.3);
  }
  .brewer-card.poor {
    opacity: 0.55;
  }
  .brewer-icon { font-size: 1.5rem; margin-bottom: 0.3rem; }
  .brewer-name { font-size: 0.85rem; font-weight: 600; }
  .brewer-score {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    font-weight: 700;
    margin-top: 0.15rem;
  }
  .brewer-category {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.15rem;
  }

  /* --- Recommendation Card --- */
  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
  }
  .match-badge {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--surface);
    padding: 0.3rem 0.6rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .match-label {
    font-size: 0.55rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .rec-card {
    position: relative;
    min-height: 320px;
    perspective: 1000px;
  }
  .card-face {
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: 14px;
    padding: 1.25rem;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  .card-front {
    display: block;
  }
  .card-back {
    display: none;
  }
  .rec-card.flipped .card-front {
    display: none;
  }
  .rec-card.flipped .card-back {
    display: block;
  }

  /* --- Recipe --- */
  .recipe-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .recipe-row {
    display: grid;
    grid-template-columns: 100px 1fr auto;
    align-items: baseline;
    gap: 0.5rem;
    padding: 0.35rem 0;
    border-bottom: 1px solid var(--surface-3);
  }
  .recipe-row:last-child { border-bottom: none; }
  .recipe-label {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .recipe-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .recipe-range {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-muted);
    text-align: right;
  }

  .flavor-expect {
    margin-top: 1rem;
    padding: 0.75rem;
    background: var(--surface-2);
    border-radius: 8px;
  }
  .expect-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--copper);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 0.25rem;
  }
  .expect-value {
    font-size: 0.95rem;
    color: var(--text);
    line-height: 1.4;
  }

  .flip-btn {
    display: block;
    width: 100%;
    margin-top: 1rem;
    padding: 0.6rem;
    background: none;
    border: 1px solid var(--surface-3);
    border-radius: 8px;
    color: var(--copper);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
  }
  .flip-btn:hover {
    border-color: var(--copper);
    background: rgba(210, 125, 45, 0.08);
  }

  /* --- Narrative (Back) --- */
  .narrative p {
    font-size: 0.95rem;
    line-height: 1.65;
    margin: 0 0 0.75rem;
    color: var(--text);
  }
  .narrative-placeholder {
    color: var(--text-muted);
    font-style: italic;
  }
  .brewer-effect {
    color: var(--copper-light);
    font-style: italic;
  }
  .deviations-detail {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--surface-3);
  }
  .deviation-item {
    margin-bottom: 0.75rem;
  }
  .dev-type {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--copper);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .deviation-item p {
    font-size: 0.85rem;
    margin: 0.2rem 0;
  }
  .dev-impact {
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 0.7rem !important;
  }

  /* --- Taste Loop --- */
  .taste-loop {
    margin-top: 1.25rem;
    padding: 1rem;
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: 12px;
  }
  .taste-prompt {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-align: center;
    margin: 0 0 0.75rem;
  }
  .taste-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .taste-btn {
    padding: 0.6rem 0.5rem;
    border: 1px solid var(--surface-3);
    border-radius: 8px;
    background: var(--surface-2);
    color: var(--text);
    font-family: var(--font-serif);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .taste-btn:hover {
    border-color: var(--copper);
  }
  .taste-sour:hover { border-color: var(--yellow); }
  .taste-bitter:hover { border-color: var(--red); }
  .taste-nailed {
    grid-column: 1 / -1;
    background: rgba(74, 222, 128, 0.1);
    border-color: rgba(74, 222, 128, 0.3);
    color: var(--green);
    font-weight: 600;
  }
  .taste-nailed:hover {
    border-color: var(--green);
    background: rgba(74, 222, 128, 0.15);
  }

  .taste-adjustment {
    text-align: center;
  }
  .adj-primary {
    font-size: 1rem;
    font-weight: 600;
    color: var(--copper);
    margin: 0 0 0.3rem;
  }
  .adj-secondary {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    margin: 0 0 0.5rem;
  }
  .adj-explanation {
    font-size: 0.8rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0 0 0.75rem;
  }
  .taste-reset {
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--text-muted);
    background: none;
    border: 1px solid var(--surface-3);
    border-radius: 6px;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .taste-reset:hover { border-color: var(--copper); color: var(--copper); }

  .taste-success {
    text-align: center;
    color: var(--green);
    font-size: 1rem;
    font-weight: 600;
    padding: 0.5rem;
  }
  .success-icon { font-size: 1.25rem; }

  /* --- Mobile adjustments --- */
  @media (max-width: 360px) {
    .brewer-grid { grid-template-columns: repeat(2, 1fr); }
    .recipe-row { grid-template-columns: 80px 1fr auto; }
    .recipe-value { font-size: 1.1rem; }
  }
</style>
