<script>
  // BeanSearch — autocomplete search against 329-bean index
  // On selection, fetches full bean data and pushes to store
  import { beanData, recommendationData, selectedBrewer, phase } from './store.js';

  let { beanIndex = [] } = $props();

  let query = $state('');
  let focused = $state(false);
  let selectedIdx = $state(-1);
  let loading = $state(false);

  // Every query word must appear somewhere in the joined haystack (name / roaster /
  // origin / roast / notes). Lets "onyx burundi" match Onyx Coffee Lab's Burundi
  // beans where no single field contains both words.
  let results = $derived.by(() => {
    if (!query || query.length < 2) return [];
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return beanIndex
      .filter(b => {
        const haystack = [
          b.name,
          b.roaster,
          b.origin,
          b.roast,
          Array.isArray(b.notes) ? b.notes.join(' ') : ''
        ].join(' ').toLowerCase();
        return words.every(w => haystack.includes(w));
      })
      .slice(0, 8);
  });

  let showDropdown = $derived(focused && results.length > 0);

  async function selectBean(bean) {
    query = `${bean.name} — ${bean.roaster}`;
    focused = false;
    loading = true;

    try {
      const res = await fetch(`/data/beans/${bean.id}.json`);
      if (!res.ok) throw new Error('Failed to load bean data');
      const data = await res.json();

      // Push to store (don't auto-select brewer — user picks via brewer selector)
      beanData.set(data.bean);
      recommendationData.set(data.recData);
      phase.set('apparatus');
    } catch (e) {
      console.error('Bean load failed:', e);
    } finally {
      loading = false;
    }
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, results.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, 0);
    } else if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      e.preventDefault();
      selectBean(results[selectedIdx]);
    } else if (e.key === 'Escape') {
      focused = false;
    }
  }

  function handleInput() {
    selectedIdx = -1;
  }

  function clear() {
    query = '';
    focused = false;
    selectedIdx = -1;
  }
</script>

<div class="bean-search" class:loading>
  <div class="search-input-wrap">
    <input
      type="text"
      bind:value={query}
      onfocus={() => { focused = true; }}
      onblur={() => { setTimeout(() => { focused = false; }, 200); }}
      onkeydown={handleKeydown}
      oninput={handleInput}
      placeholder="Search 329 beans..."
      class="search-input"
      autocomplete="off"
      spellcheck="false"
    />
    {#if query}
      <button class="clear-btn" onclick={clear} type="button">&times;</button>
    {/if}
    {#if loading}
      <span class="loading-dot"></span>
    {/if}
  </div>

  {#if showDropdown}
    <ul class="search-results">
      {#each results as bean, i}
        <li>
          <button
            class="result-item"
            class:highlighted={i === selectedIdx}
            onmousedown={() => selectBean(bean)}
            type="button"
          >
            <span class="result-name">{bean.name}</span>
            <span class="result-meta">
              {bean.roaster} · {bean.origin} · {bean.roast}
            </span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .bean-search {
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  .search-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-input {
    width: 100%;
    padding: 0.6rem 2rem 0.6rem 0.75rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    border: 1.5px solid #D4C5A9;
    border-radius: 3px;
    background: #FAF8F5;
    color: #1A1A1A;
    outline: none;
    transition: border-color 0.2s;
  }
  .search-input:focus {
    border-color: #C17A3A;
  }
  .search-input::placeholder {
    color: #94A3B8;
    font-style: italic;
  }

  .clear-btn {
    position: absolute;
    right: 0.5rem;
    background: none;
    border: none;
    font-size: 1.1rem;
    color: #94A3B8;
    cursor: pointer;
    padding: 0 0.25rem;
    line-height: 1;
  }
  .clear-btn:hover { color: #C17A3A; }

  .loading-dot {
    position: absolute;
    right: 0.5rem;
    width: 8px;
    height: 8px;
    background: #C17A3A;
    border-radius: 50%;
    animation: pulse 0.8s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  .search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;
    list-style: none;
    background: white;
    border: 1.5px solid #D4C5A9;
    border-top: none;
    border-radius: 0 0 3px 3px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .result-item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    border: none;
    background: none;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: background 0.15s;
  }
  .result-item:hover, .result-item.highlighted {
    background: #F5F0E6;
  }

  .result-name {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: #1A1A1A;
  }
  .result-meta {
    display: block;
    font-size: 0.7rem;
    color: #94A3B8;
    margin-top: 0.1rem;
    text-transform: capitalize;
  }
</style>
