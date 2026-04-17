<script>
  // BrewerSelector — 3x3 grid of brewers with match scores
  // Shown when user clicks Section II or needs to pick a brewer
  import { selectBrewer, sortedBrewers, recommendationData, selectedBrewer } from './store.js';

  let { onclose = () => {} } = $props();

  let brewers = $derived($sortedBrewers);
  let hasScores = $derived(!!$recommendationData?.recommendations);

  function handleSelect(brewerId) {
    selectBrewer(brewerId);
    // Don't call onclose — let the orchestrator's $effect handle panel progression
  }

  function scoreColor(score) {
    if (score >= 85) return '#4ADE80';
    if (score >= 70) return '#D27D2D';
    if (score >= 50) return '#FBBF24';
    return '#F87171';
  }
</script>

<div class="brewer-selector">
  <!-- Header handled by orchestrator panel-header -->

  <div class="brewer-grid">
    {#each brewers as brewer}
      {@const rec = hasScores ? $recommendationData.recommendations[brewer.id] : null}
      {@const score = rec?.match_score ?? 0}
      {@const isActive = $selectedBrewer === brewer.id}
      <button
        class="brewer-card"
        class:best={score >= 85}
        class:poor={score > 0 && score < 50}
        class:active={isActive}
        onclick={() => handleSelect(brewer.id)}
        type="button"
      >
        <span class="brewer-icon">{brewer.icon}</span>
        <span class="brewer-name">{brewer.name}</span>
        {#if score > 0}
          <span class="brewer-score" style="color: {scoreColor(score)}">{score}</span>
        {/if}
        <span class="brewer-category">{brewer.category}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .brewer-selector {
    background: #FAF8F5;
    border: 1.5px solid #D4C5A9;
    border-radius: 4px;
    padding: 1rem;
    max-width: 360px;
    width: 100%;
  }

  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  .selector-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    color: #1A1A1A;
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 1.3rem;
    color: #94A3B8;
    cursor: pointer;
    padding: 0 0.25rem;
    line-height: 1;
  }
  .close-btn:hover { color: #C17A3A; }

  .brewer-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .brewer-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.6rem 0.4rem;
    background: white;
    border: 1.5px solid #E5E0D8;
    border-radius: 3px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    font-family: 'Inter', sans-serif;
  }
  .brewer-card:hover {
    border-color: #C17A3A;
    background: #F5F0E6;
  }
  .brewer-card.best {
    border-color: rgba(74, 222, 128, 0.4);
  }
  .brewer-card.poor {
    opacity: 0.5;
  }
  .brewer-card.active {
    border-color: #C17A3A;
    background: #F5F0E6;
    box-shadow: 0 0 0 1px #C17A3A;
  }

  .brewer-icon {
    font-size: 1.3rem;
    margin-bottom: 0.2rem;
  }
  .brewer-name {
    font-size: 0.75rem;
    font-weight: 600;
    color: #1A1A1A;
  }
  .brewer-score {
    font-size: 0.7rem;
    font-weight: 700;
    margin-top: 0.1rem;
  }
  .brewer-category {
    font-size: 0.55rem;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 0.1rem;
  }

  @media (max-width: 360px) {
    .brewer-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
