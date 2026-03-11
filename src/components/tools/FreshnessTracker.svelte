<script>
  // Freshness data sourced from COFFEE_KNOWLEDGE_SYNTHESIS.md + coffee-freshness-roast-to-stale article
  // Gagné: 3 mechanisms of staling (CO2 loss, aroma volatilization, oil oxidation)
  // All sources: peak freshness 7-21 days post-roast, 3-4 day rest minimum

  const stages = [
    {
      id: 'too-fresh',
      name: 'Too Fresh',
      days: [0, 3],
      color: '#8A8070',
      summary: 'Excess CO2 disrupts extraction',
      detail: 'Beans straight off the roaster are full of CO2 — so much that it creates channeling in espresso and aggressive, uneven blooms in pour over. The cup tastes sharp, unbalanced, and hard to dial in. Most roasters won\'t sell until 48+ hours rest.',
      tips: [
        'Wait. Don\'t try to dial in a recipe yet.',
        'Dark roasts degas faster — may be ready by day 2–3.',
        'Light roasts need the full 3–4 days.',
      ],
    },
    {
      id: 'opening',
      name: 'Opening Up',
      days: [3, 7],
      color: '#C17A3A',
      summary: 'Dark roasts often peak here',
      detail: 'The initial CO2 rush subsides. Aromatics begin expressing themselves more clearly. Sweetness increases daily. Dark roasts hit their sweet spot in this window — their higher porosity means faster degassing.',
      tips: [
        'Start dialing in your recipe for dark roasts.',
        'Light/medium roasts are good and getting better.',
        'Store airtight — CO2 is still protecting the beans from oxygen.',
      ],
    },
    {
      id: 'peak',
      name: 'Peak Window',
      days: [7, 21],
      color: '#6B8F3A',
      summary: 'Sweet spot for most coffees',
      detail: 'CO2 has dropped to levels that allow clean, even extraction. The full aromatic profile is present and expressive. Sweetness is at its maximum. Acidity is bright without being sharp. This is when to evaluate, dial in, and enjoy.',
      tips: [
        'This is your best window — enjoy it.',
        'Dial in your recipe during days 7–14.',
        'If you can\'t finish the bag, freeze portions now.',
      ],
      link: '/blog/single-dose-coffee-freezing-guide/',
      linkLabel: 'Freezing Guide',
    },
    {
      id: 'declining',
      name: 'Declining',
      days: [21, 30],
      color: '#A8632E',
      summary: 'Top notes fading, still drinkable',
      detail: 'The lightest volatile aromatics — floral, fruity, citrus — are gone. What remains is the heavier base: chocolate, nutty, caramel. The coffee is still good but has lost complexity and brightness. Sweetness is noticeably reduced.',
      tips: [
        'Grind slightly finer to compensate for reduced solubles.',
        'Milk drinks and cold brew are more forgiving here.',
        'Not the time to evaluate a new coffee\'s potential.',
      ],
    },
    {
      id: 'stale',
      name: 'Stale',
      days: [30, Infinity],
      color: '#5C4A38',
      summary: 'Flat, papery, oils going rancid',
      detail: 'Most volatile aromatics are gone. Oils on the bean surface have oxidized — producing flat, papery, cardboard-like flavors. CO2 is depleted, so the bloom is weak or absent. The coffee tastes one-dimensional. If the beans look oily and glossy, oxidation is well advanced.',
      tips: [
        'Cold brew can salvage stale beans better than hot methods.',
        'If beans are oily/glossy, they\'re past the point of rescue.',
        'Time to buy fresh. Check the roast date before purchasing.',
      ],
      link: '/blog/coffee-freshness-roast-to-stale/',
      linkLabel: 'Freshness Science',
    },
  ];

  const TIMELINE_DAYS = 35;

  let roastDateStr = $state('');
  let hasSubmitted = $state(false);

  let daysOld = $derived(() => {
    if (!roastDateStr) return null;
    const roast = new Date(roastDateStr + 'T12:00:00');
    const now = new Date();
    const diff = Math.floor((now - roast) / (1000 * 60 * 60 * 24));
    return diff;
  });

  let currentStage = $derived(() => {
    const days = daysOld();
    if (days === null || days < 0) return null;
    return stages.find(s => days >= s.days[0] && days < s.days[1]) ?? stages[stages.length - 1];
  });

  let timelinePosition = $derived(() => {
    const days = daysOld();
    if (days === null || days < 0) return 0;
    return Math.min((days / TIMELINE_DAYS) * 100, 100);
  });

  function checkFreshness() {
    if (roastDateStr) hasSubmitted = true;
  }

  function reset() {
    roastDateStr = '';
    hasSubmitted = false;
  }
</script>

<div class="freshness-tool">
  {#if !hasSubmitted}
    <!-- Input state -->
    <div class="input-section">
      <p class="intro">When were your beans roasted?</p>
      <div class="date-row">
        <input
          type="date"
          class="date-input"
          bind:value={roastDateStr}
          max={new Date().toISOString().split('T')[0]}
        />
        <button class="check-btn" onclick={checkFreshness} disabled={!roastDateStr}>
          Check Freshness
        </button>
      </div>
      <p class="date-hint">Look for the roast date on your bag — not the "best by" date.</p>
    </div>
  {:else}
    <!-- Results state -->
    {@const days = daysOld()}
    {@const stage = currentStage()}

    {#if days !== null && days >= 0 && stage}
      <div class="result-section">
        <!-- Days counter -->
        <div class="days-display">
          <span class="days-number" style:color={stage.color}>{days}</span>
          <span class="days-label">days since roast</span>
        </div>

        <!-- Timeline bar -->
        <div class="timeline-wrap">
          <div class="timeline-bar">
            {#each stages.filter(s => s.days[1] !== Infinity) as s}
              {@const startPct = (s.days[0] / TIMELINE_DAYS) * 100}
              {@const endPct = (Math.min(s.days[1], TIMELINE_DAYS) / TIMELINE_DAYS) * 100}
              <div
                class="timeline-segment"
                style:left="{startPct}%"
                style:width="{endPct - startPct}%"
                style:background={s.color}
                style:opacity={s.id === stage.id ? '1' : '0.25'}
              ></div>
            {/each}
            <!-- Stale extends to end -->
            <div
              class="timeline-segment"
              style:left="{(30 / TIMELINE_DAYS) * 100}%"
              style:width="{100 - (30 / TIMELINE_DAYS) * 100}%"
              style:background="#5C4A38"
              style:opacity={stage.id === 'stale' ? '1' : '0.25'}
            ></div>
            <!-- Position marker -->
            <div class="timeline-marker" style:left="{timelinePosition()}%">
              <div class="marker-dot" style:background={stage.color}></div>
            </div>
          </div>
          <div class="timeline-labels">
            <span>Roast</span>
            <span>7</span>
            <span>14</span>
            <span>21</span>
            <span>30</span>
            <span>35+</span>
          </div>
        </div>

        <!-- Stage card -->
        <div class="stage-card" style:border-left-color={stage.color}>
          <span class="section-label">Status</span>
          <h3 class="stage-name">{stage.name}</h3>
          <p class="stage-summary">{stage.summary}</p>
          <p class="stage-detail">{stage.detail}</p>
        </div>

        <!-- Tips -->
        <div class="tips-section">
          <span class="section-label">What to do</span>
          <div class="tips-list">
            {#each stage.tips as tip, i}
              <div class="tip-item">
                <span class="tip-bullet" style:color={stage.color}>&bull;</span>
                <span class="tip-text">{tip}</span>
              </div>
            {/each}
            {#if stage.link}
              <a href={stage.link} class="tip-link">{stage.linkLabel} &rarr;</a>
            {/if}
          </div>
        </div>

        <!-- Storage reference -->
        <div class="storage-section">
          <span class="section-label">Storage rules</span>
          <div class="storage-grid">
            <div class="storage-card">
              <h4 class="storage-title">Airtight + cool + dark</h4>
              <p class="storage-text">Keep in the original bag, squeeze out air, seal tight. Counter is fine if away from heat and sunlight.</p>
            </div>
            <div class="storage-card">
              <h4 class="storage-title">Never refrigerate</h4>
              <p class="storage-text">Moisture condenses on cold beans, absorbs fridge odors. Every source agrees: the fridge is the worst place for coffee.</p>
            </div>
            <div class="storage-card">
              <h4 class="storage-title">Freezing works</h4>
              <p class="storage-text">Sealed single-dose portions can last up to a year. Grind while still frozen — cold beans fracture more uniformly. <a href="/blog/single-dose-coffee-freezing-guide/" class="storage-link">Freezing guide &rarr;</a></p>
            </div>
          </div>
        </div>

        <button class="reset-btn" onclick={reset}>Check another bag</button>
      </div>
    {:else}
      <div class="input-section">
        <p class="intro">That date is in the future — your beans haven't been roasted yet!</p>
        <button class="reset-btn" onclick={reset}>Try again</button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .freshness-tool {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
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

  /* === Input State === */
  .input-section {
    text-align: center;
  }

  .intro {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1A1A1A;
    margin-bottom: 1.25rem;
  }

  .date-row {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }
  @media (max-width: 480px) {
    .date-row {
      flex-direction: column;
    }
  }

  .date-input {
    padding: 0.65rem 0.75rem;
    border: 1px solid rgba(26, 26, 26, 0.15);
    background: #fff;
    font-size: 0.85rem;
    color: #1A1A1A;
    outline: none;
    font-family: system-ui, sans-serif;
  }
  .date-input:focus {
    border-color: #C17A3A;
  }

  .check-btn {
    padding: 0.65rem 1.25rem;
    background: #C17A3A;
    color: #F5F0E8;
    border: none;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: background 0.2s;
  }
  .check-btn:hover:not(:disabled) {
    background: #A8632E;
  }
  .check-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .date-hint {
    font-size: 0.65rem;
    color: #8A8070;
    margin-top: 0.75rem;
  }

  /* === Days Display === */
  .days-display {
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .days-number {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1;
    display: block;
    transition: color 0.3s;
  }
  .days-label {
    font-size: 0.7rem;
    color: #8A8070;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* === Timeline === */
  .timeline-wrap {
    margin-bottom: 0.5rem;
  }
  .timeline-bar {
    position: relative;
    height: 10px;
    background: rgba(26, 26, 26, 0.04);
  }
  .timeline-segment {
    position: absolute;
    top: 0;
    height: 100%;
    transition: opacity 0.3s;
  }
  .timeline-marker {
    position: absolute;
    top: -4px;
    transform: translateX(-50%);
    z-index: 2;
    transition: left 0.4s ease;
  }
  .marker-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 3px solid #F5F0E8;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  }
  .timeline-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.4rem;
    font-size: 0.55rem;
    color: #8A8070;
    padding: 0 0.25rem;
  }

  /* === Stage Card === */
  .stage-card {
    padding: 1rem;
    background: rgba(61, 37, 24, 0.03);
    border-left: 4px solid;
    transition: border-color 0.3s;
  }
  .stage-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0 0 0.15rem;
  }
  .stage-summary {
    font-size: 0.75rem;
    color: #C17A3A;
    font-weight: 500;
    margin: 0 0 0.5rem;
  }
  .stage-detail {
    font-size: 0.8rem;
    color: #3D2518;
    line-height: 1.6;
    margin: 0;
  }

  /* === Tips === */
  .tips-section {
    display: flex;
    flex-direction: column;
  }
  .tips-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .tip-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .tip-bullet {
    font-size: 1.1rem;
    line-height: 1.2;
    flex-shrink: 0;
  }
  .tip-text {
    font-size: 0.8rem;
    color: #1A1A1A;
    line-height: 1.5;
  }
  .tip-link {
    display: inline-block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #C17A3A;
    text-decoration: none;
    font-weight: 500;
    margin-top: 0.3rem;
    margin-left: 1.6rem;
  }
  .tip-link:hover {
    color: #A8632E;
    text-decoration: underline;
  }

  /* === Storage === */
  .storage-section {
    border-top: 1px solid rgba(26, 26, 26, 0.08);
    padding-top: 1.25rem;
  }
  .storage-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .storage-card {
    padding: 0.6rem 0.75rem;
    border: 1px solid rgba(26, 26, 26, 0.06);
  }
  .storage-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1A1A1A;
    margin: 0 0 0.15rem;
  }
  .storage-text {
    font-size: 0.7rem;
    color: #5C4A38;
    line-height: 1.5;
    margin: 0;
  }
  .storage-link {
    color: #C17A3A;
    text-decoration: none;
    font-weight: 500;
  }
  .storage-link:hover {
    color: #A8632E;
    text-decoration: underline;
  }

  /* === Reset === */
  .reset-btn {
    align-self: center;
    padding: 0.5rem 1rem;
    border: 1px solid rgba(26, 26, 26, 0.15);
    background: transparent;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8A8070;
    cursor: pointer;
    transition: all 0.2s;
  }
  .reset-btn:hover {
    border-color: #C17A3A;
    color: #C17A3A;
  }
</style>
