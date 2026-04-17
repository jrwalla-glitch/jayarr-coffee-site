<script>
  // CollectionCup — Section III: cup with flavor rings + match score dial
  // Concept art ref: 00-apparatus-v3-final.png (rightmost section)
  import FlavorRings from './FlavorRings.svelte';
  import MatchScoreDial from './MatchScoreDial.svelte';
  import { matchScore, flavorProfile } from './store.js';

  let { notes = [] } = $props();
</script>

<div class="collection-cup">
  <!-- Section header -->
  <div class="section-label">
    <span class="section-num">III</span>
    <span class="section-title">The Collection Vessel</span>
    <span class="section-sub">the cup</span>
  </div>

  <!-- Cup SVG with flavor rings inside -->
  <div class="cup-container">
    <svg viewBox="0 0 180 140" xmlns="http://www.w3.org/2000/svg" class="cup-svg">
      <!-- Cup body -->
      <path d="M 30,30 Q 28,80 40,110 L 60,120 Q 90,125 120,120 L 140,110 Q 152,80 150,30 Z"
        fill="#F5F0E6" stroke="#B8860B" stroke-width="2" />

      <!-- Cup rim (ellipse at top) -->
      <ellipse cx="90" cy="30" rx="60" ry="12"
        fill="#FAF8F5" stroke="#B8860B" stroke-width="2" />

      <!-- Inner rim highlight -->
      <ellipse cx="90" cy="32" rx="52" ry="9"
        fill="none" stroke="#D4A847" stroke-width="0.5" opacity="0.5" />

      <!-- Handle -->
      <path d="M 150,45 Q 175,50 178,75 Q 178,100 155,105"
        fill="none" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" />
      <!-- Handle inner -->
      <path d="M 152,52 Q 170,56 172,75 Q 172,94 156,98"
        fill="none" stroke="#D4A847" stroke-width="1" opacity="0.4" />

      <!-- Saucer -->
      <ellipse cx="90" cy="122" rx="75" ry="10"
        fill="none" stroke="#B8860B" stroke-width="1.5" />
      <ellipse cx="90" cy="124" rx="70" ry="8"
        fill="none" stroke="#D4A847" stroke-width="0.5" opacity="0.3" />

      <!-- Flavor rings (positioned inside the cup) -->
      <g transform="translate(40, 40)">
        <FlavorRings flavorProfile={$flavorProfile} />
      </g>
    </svg>
  </div>

  <!-- Flavor notes list -->
  {#if notes.length > 0}
    <div class="flavor-notes">
      <span class="notes-label">Notes of:</span>
      {#each notes as note}
        <span class="note-tag">{note}</span>
      {/each}
    </div>
  {/if}

  <!-- Match Score Dial (below cup) -->
  <div class="score-container">
    <MatchScoreDial score={$matchScore} />
  </div>
</div>

<style>
  .collection-cup {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .section-label {
    text-align: center;
    margin-bottom: 0.25rem;
  }
  .section-num {
    font-family: 'Playfair Display', serif;
    font-size: 0.7rem;
    color: #C17A3A;
    display: block;
    letter-spacing: 0.1em;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    color: #1A1A1A;
    display: block;
  }
  .section-sub {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .cup-container {
    width: 100%;
    max-width: 200px;
  }
  .cup-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .flavor-notes {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    justify-content: center;
    max-width: 200px;
  }
  .notes-label {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    color: #94A3B8;
    font-style: italic;
    width: 100%;
    text-align: center;
    margin-bottom: 0.1rem;
  }
  .note-tag {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    color: #6B6560;
    background: #F0EDE8;
    padding: 0.1rem 0.4rem;
    border-radius: 2px;
  }

  .score-container {
    width: 100%;
    max-width: 160px;
  }
</style>
