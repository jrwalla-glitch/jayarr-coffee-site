<script>
  // FlavorVibeSelector — Door III: "I want a flavor"
  // User picks a flavor vibe → see matching beans → select one → brewer selector opens
  import { VIBES, beanData, recommendationData, phase } from './store.js';

  let { beanIndex = [], onclose = () => {} } = $props();

  let selectedVibe = $state(null);
  let matchingBeans = $state([]);
  let loading = $state(false);

  // Flavor keywords for each vibe, used to match against bean flavor notes
  const VIBE_KEYWORDS = {
    comfort: ['chocolate', 'cocoa', 'nutty', 'almond', 'hazelnut', 'caramel', 'toffee', 'brown sugar', 'smooth', 'walnut', 'pecan', 'nougat'],
    bright: ['citrus', 'lemon', 'lime', 'floral', 'jasmine', 'bergamot', 'tea', 'clean', 'crisp', 'grapefruit', 'orange'],
    bold: ['dark chocolate', 'spice', 'pepper', 'clove', 'tobacco', 'molasses', 'full body', 'earthy', 'cedar', 'smoky'],
    fruity: ['berry', 'blueberry', 'strawberry', 'raspberry', 'wine', 'grape', 'tropical', 'mango', 'pineapple', 'cherry', 'plum', 'papaya'],
    sweet: ['caramel', 'honey', 'stone fruit', 'peach', 'apricot', 'vanilla', 'maple', 'butterscotch', 'sugar cane', 'melon'],
  };

  function selectVibe(vibe) {
    selectedVibe = vibe;

    // Filter bean index for beans whose flavor notes match this vibe
    const keywords = VIBE_KEYWORDS[vibe.id] || [];
    const scored = beanIndex
      .map(bean => {
        const noteStr = (bean.notes || []).join(' ').toLowerCase();
        const hits = keywords.filter(kw => noteStr.includes(kw)).length;
        return { ...bean, hits };
      })
      .filter(b => b.hits > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 12);

    matchingBeans = scored;
  }

  async function pickBean(bean) {
    loading = true;
    try {
      const res = await fetch(`/data/beans/${bean.id}.json`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      beanData.set(data.bean);
      recommendationData.set(data.recData);
      phase.set('apparatus');
      onclose();
    } catch (e) {
      console.error('Bean load failed:', e);
    } finally {
      loading = false;
    }
  }

  function goBack() {
    selectedVibe = null;
    matchingBeans = [];
  }
</script>

<div class="vibe-selector">
  {#if !selectedVibe}
    <!-- Vibe selection -->
    <div class="selector-header">
      <span class="selector-title">What flavor are you after?</span>
      <button class="close-btn" onclick={onclose} type="button">&times;</button>
    </div>
    <div class="vibe-grid">
      {#each VIBES as vibe}
        <button class="vibe-card" onclick={() => selectVibe(vibe)} type="button">
          <span class="vibe-icon">{vibe.icon}</span>
          <span class="vibe-label">{vibe.label}</span>
          <span class="vibe-desc">{vibe.desc}</span>
        </button>
      {/each}
    </div>
  {:else}
    <!-- Matching beans for selected vibe -->
    <div class="selector-header">
      <button class="back-btn" onclick={goBack} type="button">&larr; Back</button>
      <span class="selector-title">{selectedVibe.label}</span>
      <button class="close-btn" onclick={onclose} type="button">&times;</button>
    </div>
    <p class="vibe-match-desc">{selectedVibe.desc} — {matchingBeans.length} beans match</p>

    {#if loading}
      <p class="loading-text">Loading...</p>
    {:else if matchingBeans.length === 0}
      <p class="no-matches">No beans match this profile. Try another flavor.</p>
    {:else}
      <div class="bean-list">
        {#each matchingBeans as bean}
          <button class="bean-item" onclick={() => pickBean(bean)} type="button">
            <span class="bean-name">{bean.name}</span>
            <span class="bean-meta">{bean.roaster} · {bean.origin} · {bean.roast}</span>
            <span class="bean-notes">{bean.notes.join(', ')}</span>
          </button>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .vibe-selector {
    max-width: 400px;
    width: 100%;
  }

  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }
  .selector-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1A1A1A;
    flex: 1;
  }
  .close-btn, .back-btn {
    background: none;
    border: none;
    font-size: 1.3rem;
    color: #94A3B8;
    cursor: pointer;
    padding: 0 0.25rem;
    line-height: 1;
  }
  .back-btn {
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
  }
  .close-btn:hover, .back-btn:hover { color: #C17A3A; }

  .vibe-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .vibe-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.7rem 1rem;
    background: white;
    border: 1.5px solid #E5E0D8;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    font-family: 'Inter', sans-serif;
    text-align: left;
  }
  .vibe-card:hover {
    border-color: #C17A3A;
    background: #F5F0E6;
  }
  .vibe-icon {
    font-size: 1.2rem;
    margin-bottom: 0.15rem;
  }
  .vibe-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #1A1A1A;
  }
  .vibe-desc {
    font-size: 0.7rem;
    color: #94A3B8;
    margin-top: 0.1rem;
  }

  .vibe-match-desc {
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: #94A3B8;
    margin: 0 0 0.75rem;
    font-style: italic;
  }

  .bean-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    max-height: 320px;
    overflow-y: auto;
  }

  .bean-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    background: white;
    border: 1px solid #E5E0D8;
    border-radius: 3px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .bean-item:hover {
    background: #F5F0E6;
    border-color: #C17A3A;
  }
  .bean-name {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1A1A1A;
  }
  .bean-meta {
    display: block;
    font-size: 0.65rem;
    color: #94A3B8;
    margin-top: 0.1rem;
    text-transform: capitalize;
  }
  .bean-notes {
    display: block;
    font-size: 0.65rem;
    color: #C17A3A;
    margin-top: 0.15rem;
    text-transform: capitalize;
  }

  .loading-text, .no-matches {
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    color: #94A3B8;
    text-align: center;
    padding: 1rem;
    font-style: italic;
  }
</style>
