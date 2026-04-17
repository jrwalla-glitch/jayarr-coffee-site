<script>
  // ExtractionApparatus — orchestrator for the three-door interactive flow
  //
  // Door I  (vessel): Bean search → select bean → auto-open brewer selector
  // Door II (brewer): Brewer selector → select brewer → result card appears
  // Door III (cup):   Flavor vibe selector → matching beans → select bean → brewer selector
  //
  // All three paths converge on: bean + brewer selected → result card → spoke page

  import ApparatusIllustration from './ApparatusIllustration.svelte';
  import BeanSearch from './BeanSearch.svelte';
  import BrewerSelector from './BrewerSelector.svelte';
  import FlavorVibeSelector from './FlavorVibeSelector.svelte';
  import {
    initFromProps, resetAll, isMobile,
    beanData, recommendationData, selectedBrewer, phase, BREWERS
  } from './store.js';

  let { beanProp = null, recProp = null, beanIndex = [], topBeans = {} } = $props();

  // Initialize store from props if provided (spoke page mode)
  $effect(() => {
    if (beanProp && recProp) {
      initFromProps(beanProp, recProp);
    }
    return () => resetAll();
  });

  // Mobile detection
  $effect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    isMobile.set(mq.matches);
    const handler = (e) => isMobile.set(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  // Panel state — only one panel open at a time
  let activePanel = $state(null); // null | 'bean' | 'brewer' | 'flavor'

  let hasBean = $derived(!!$beanData);
  let hasBrewer = $derived(!!$selectedBrewer);

  // --- Door handlers ---

  function openDoor1() {
    // Door I: select a bean
    activePanel = 'bean';
  }

  function openDoor2() {
    // Door II: "I have a brewer" — show brewer selector directly
    // After brewer is picked, if no bean yet, auto-open bean search
    activePanel = 'brewer';
  }

  function openDoor3() {
    // Door III: pick a flavor vibe
    activePanel = 'flavor';
  }

  function closePanel() {
    activePanel = null;
  }

  async function pickRecommendedBean(bean) {
    try {
      const res = await fetch(`/data/beans/${bean.id}.json`);
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      beanData.set(data.bean);
      recommendationData.set(data.recData);
      phase.set('apparatus');
    } catch (e) {
      console.error('Bean load failed:', e);
    }
  }

  function startOver() {
    resetAll();
    activePanel = null;
    brewerConfirmed = false;
  }

  // --- Auto-progression ---
  // Track previous bean state to detect new selection
  let prevBeanId = $state(null);

  $effect(() => {
    const currentId = $beanData?.id || null;
    if (currentId && currentId !== prevBeanId) {
      prevBeanId = currentId;
      if (brewerConfirmed || $selectedBrewer) {
        // Door II flow (brewer already picked) or brewer was pre-selected — done, close everything
        activePanel = null;
        brewerConfirmed = false;
      } else {
        // Door I or III flow — bean just selected, need brewer next
        activePanel = null;
        setTimeout(() => {
          if (!$selectedBrewer) {
            activePanel = 'brewer';
          }
        }, 400);
      }
    }
  });

  // After brewer is selected: if bean exists, close panel. If not, stay open for bean search.
  let prevBrewerId = $state(null);
  let brewerConfirmed = $state(false); // tracks Door II two-step flow

  $effect(() => {
    const currentBrewer = $selectedBrewer;
    if (currentBrewer && currentBrewer !== prevBrewerId && activePanel === 'brewer') {
      prevBrewerId = currentBrewer;
      if ($beanData) {
        // Bean already selected (Door I flow) — just close
        setTimeout(() => { activePanel = null; }, 200);
      } else {
        // Door II flow — brewer picked, now need bean. Stay in same panel.
        brewerConfirmed = true;
      }
    }
  });
</script>

<div class="apparatus-wrapper">
  <!-- Selection panels (floating above the illustration) -->
  {#if activePanel === 'bean'}
    <div class="selection-overlay" onclick={closePanel}>
      <div class="selection-panel" onclick={(e) => e.stopPropagation()}>
        <div class="panel-header">
          <span class="panel-title">I: Select Your Coffee</span>
          <button class="panel-close" onclick={closePanel} type="button">&times;</button>
        </div>
        <BeanSearch {beanIndex} />
      </div>
    </div>
  {/if}

  {#if activePanel === 'brewer'}
    <div class="selection-overlay" onclick={closePanel}>
      <div class="selection-panel" onclick={(e) => e.stopPropagation()}>
        {#if !brewerConfirmed}
          <!-- Step 1: Pick a brewer -->
          <div class="panel-header">
            <span class="panel-title">II: Choose Your Brewer</span>
            <button class="panel-close" onclick={closePanel} type="button">&times;</button>
          </div>
          <BrewerSelector onclose={closePanel} />
        {:else}
          <!-- Step 2: Brewer confirmed, show recommended beans -->
          {@const brewerName = BREWERS.find(b => b.id === $selectedBrewer)?.name}
          {@const recommended = topBeans[$selectedBrewer] || []}
          <div class="panel-header">
            <span class="panel-title">Best Beans for {brewerName}</span>
            <button class="panel-close" onclick={closePanel} type="button">&times;</button>
          </div>
          <div class="brewer-confirmed">
            <span class="confirmed-icon">&#10003;</span>
            <span class="confirmed-text">{brewerName} selected</span>
            <button class="change-btn" onclick={() => { brewerConfirmed = false; }} type="button">Change</button>
          </div>
          {#if recommended.length > 0}
            <div class="recommended-beans">
              {#each recommended as bean}
                {@const label = bean.score >= 90 ? 'Excellent' : bean.score >= 80 ? 'Great' : bean.score >= 70 ? 'Good' : 'Fair'}
                {@const color = bean.score >= 90 ? '#4ADE80' : bean.score >= 80 ? '#C17A3A' : bean.score >= 70 ? '#FBBF24' : '#94A3B8'}
                <button class="rec-bean" onclick={() => pickRecommendedBean(bean)} type="button">
                  <div class="rec-top">
                    <span class="rec-name">{bean.name}</span>
                    <span class="rec-label" style="color: {color}">{label}</span>
                  </div>
                  <span class="rec-meta">{bean.roaster} · {bean.origin} · {bean.roast}</span>
                </button>
              {/each}
            </div>
          {/if}
          <div class="search-fallback">
            <span class="fallback-text">or</span>
            <BeanSearch {beanIndex} />
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if activePanel === 'flavor'}
    <div class="selection-overlay" onclick={closePanel}>
      <div class="selection-panel" onclick={(e) => e.stopPropagation()}>
        <FlavorVibeSelector {beanIndex} onclose={closePanel} />
      </div>
    </div>
  {/if}

  <!-- The illustrated apparatus -->
  <ApparatusIllustration
    onclick_vessel={openDoor1}
    onclick_brewer={openDoor2}
    onclick_cup={openDoor3}
  />

  <!-- Start over button -->
  {#if hasBean}
    <div class="apparatus-actions">
      <button class="start-over" onclick={startOver} type="button">Start Over</button>
    </div>
  {/if}
</div>

<style>
  .apparatus-wrapper {
    position: relative;
  }

  .selection-overlay {
    position: absolute;
    inset: 0;
    background: rgba(26, 26, 26, 0.3);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 3rem;
    z-index: 50;
    border-radius: 4px;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .selection-panel {
    background: #FAF8F5;
    border: 2px solid #B8860B;
    border-radius: 6px;
    padding: 1.25rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    max-width: 420px;
    width: 90%;
    animation: slideDown 0.25s ease-out;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }
  .panel-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1A1A1A;
  }
  .panel-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #94A3B8;
    cursor: pointer;
    line-height: 1;
    padding: 0 0.25rem;
  }
  .panel-close:hover { color: #C17A3A; }

  .brewer-confirmed {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: rgba(74, 222, 128, 0.08);
    border: 1px solid rgba(74, 222, 128, 0.3);
    border-radius: 4px;
    margin-bottom: 0.75rem;
  }
  .confirmed-icon {
    color: #4ADE80;
    font-size: 1rem;
    font-weight: 700;
  }
  .confirmed-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1A1A1A;
    flex: 1;
  }
  .change-btn {
    font-family: 'Inter', sans-serif;
    font-size: 0.65rem;
    color: #94A3B8;
    background: none;
    border: 1px solid #E5E0D8;
    border-radius: 3px;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .change-btn:hover {
    border-color: #C17A3A;
    color: #C17A3A;
  }

  .recommended-beans {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    max-height: 280px;
    overflow-y: auto;
    margin-bottom: 0.75rem;
  }
  .rec-bean {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.45rem 0.7rem;
    background: white;
    border: 1px solid #E5E0D8;
    border-radius: 3px;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s, border-color 0.15s;
  }
  .rec-bean:hover {
    background: #F5F0E6;
    border-color: #C17A3A;
  }
  .rec-top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .rec-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1A1A1A;
  }
  .rec-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .rec-meta {
    font-size: 0.65rem;
    color: #94A3B8;
    text-transform: capitalize;
  }

  .search-fallback {
    text-align: center;
  }
  .fallback-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    color: #94A3B8;
    display: block;
    margin-bottom: 0.4rem;
  }

  .apparatus-actions {
    text-align: center;
    margin-top: 0.75rem;
  }
  .start-over {
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    color: #94A3B8;
    background: none;
    border: 1px solid #E5E0D8;
    border-radius: 3px;
    padding: 0.35rem 0.75rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .start-over:hover {
    border-color: #C17A3A;
    color: #C17A3A;
  }
</style>
