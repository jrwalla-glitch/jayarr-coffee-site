// Brew Dial-In Store — shared state for The Extraction Apparatus
// Extracted from BrewDialIn.svelte (854 lines) — preserves all logic
// Uses Svelte writable/derived stores for cross-component reactivity

import { writable, derived, get } from 'svelte/store';

// ─── Constants ────────────────────────────────────────────────────

export const BREWERS = [
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

export const VIBES = [
  { id: 'comfort',   label: 'Morning Comfort',    desc: 'Chocolatey, smooth, nutty',       icon: '☕' },
  { id: 'bright',    label: 'Bright & Clean',     desc: 'Citrus, floral, tea-like',        icon: '✦' },
  { id: 'bold',      label: 'Rich & Bold',        desc: 'Full body, dark chocolate, spice',icon: '◆' },
  { id: 'fruity',    label: 'Fruity & Complex',   desc: 'Berry, tropical, wine-like',      icon: '❋' },
  { id: 'sweet',     label: 'Sweet Without Sugar', desc: 'Caramel, honey, stone fruit',    icon: '✿' },
];

// ─── Writable Stores (user inputs) ───────────────────────────────

export const selectedBean = writable(null);       // Bean record object
export const selectedBrewer = writable(null);     // Brewer ID string
export const tasteResult = writable(null);        // null | 'sour' | 'bitter' | 'thin' | 'strong' | 'flat' | 'nailed'
export const phase = writable('entry');           // entry | brewer_select | flavor_select | apparatus
export const flipped = writable(false);           // Card flip state (recipe front / narrative back)

// Bean + recommendation data (set once per page/selection)
export const beanData = writable(null);           // { id, name, roaster, ... }
export const recommendationData = writable(null); // { recommendations: { [brewerId]: rec }, profile: { ... } }

// Mobile detection
export const isMobile = writable(false);

// ─── Saved Recipes (localStorage-backed) ─────────────────────────

function loadSavedRecipes() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('brew-dial-in-saved');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function createSavedRecipesStore() {
  const { subscribe, set, update } = writable(loadSavedRecipes());

  return {
    subscribe,
    add(recipe) {
      update(recipes => {
        const updated = [...recipes, recipe];
        if (typeof window !== 'undefined') {
          try { localStorage.setItem('brew-dial-in-saved', JSON.stringify(updated)); } catch {}
        }
        return updated;
      });
    },
    remove(index) {
      update(recipes => {
        const updated = recipes.filter((_, i) => i !== index);
        if (typeof window !== 'undefined') {
          try { localStorage.setItem('brew-dial-in-saved', JSON.stringify(updated)); } catch {}
        }
        return updated;
      });
    },
    set,
  };
}

export const savedRecipes = createSavedRecipesStore();

// ─── Derived Stores (computed from inputs) ───────────────────────

// Current recommendation for selected bean + brewer
export const recommendation = derived(
  [selectedBrewer, recommendationData],
  ([$brewer, $recData]) => {
    if (!$brewer || !$recData?.recommendations?.[$brewer]) return null;
    return $recData.recommendations[$brewer];
  }
);

// Adjusted recipe state (internal, set by taste loop)
const adjustedRecipe = writable(null);

// Display recipe: adjusted if taste loop active, otherwise base recipe
export const recipe = derived(
  [recommendation, adjustedRecipe],
  ([$rec, $adjusted]) => {
    if ($adjusted) return $adjusted;
    return $rec?.recipe ?? null;
  }
);

// Match score (0-100)
export const matchScore = derived(recommendation, ($rec) => $rec?.match_score ?? 0);

// Match score color
export const matchColor = derived(matchScore, ($score) => {
  if ($score >= 85) return '#4ADE80';
  if ($score >= 70) return '#D27D2D';
  if ($score >= 50) return '#FBBF24';
  if ($score === 0) return '#94A3B8';
  return '#F87171';
});

// Match score label
export const matchLabel = derived(matchScore, ($score) => {
  if ($score >= 85) return 'Excellent match';
  if ($score >= 70) return 'Good match';
  if ($score >= 50) return 'Decent match';
  if ($score === 0) return '';
  return 'Not ideal';
});

// Flavor profile from recommendation
export const flavorProfile = derived(recommendation, ($rec) => $rec?.flavor_prediction ?? null);

// Bean profile (deviations, category info)
export const profile = derived(recommendationData, ($recData) => $recData?.profile ?? null);

// Brewers sorted by match score for this bean
export const sortedBrewers = derived(recommendationData, ($recData) => {
  if (!$recData?.recommendations) return BREWERS;
  return [...BREWERS].sort((a, b) => {
    const scoreA = $recData.recommendations[a.id]?.match_score ?? 0;
    const scoreB = $recData.recommendations[b.id]?.match_score ?? 0;
    return scoreB - scoreA;
  });
});

// ─── Actions ─────────────────────────────────────────────────────

export function selectBrewer(brewerId) {
  selectedBrewer.set(brewerId);
  flipped.set(false);
  tasteResult.set(null);
  adjustedRecipe.set(null);
  phase.set('apparatus');
}

export function handleTaste(issue) {
  if (issue === 'nailed') {
    tasteResult.set('nailed');
    saveCurrentRecipe();
    return;
  }
  tasteResult.set(issue);
  const rec = get(recommendation);
  const currentRecipe = get(recipe);
  const adj = rec?.adjustments?.[issue];
  if (adj?.adjusted_recipe) {
    adjustedRecipe.set({ ...currentRecipe, ...adj.adjusted_recipe });
  }
}

export function resetTaste() {
  tasteResult.set(null);
  adjustedRecipe.set(null);
}

export function saveCurrentRecipe() {
  const rec = get(recommendation);
  const bean = get(beanData);
  const currentRecipe = get(recipe);
  const brewer = get(selectedBrewer);
  if (!rec || !bean) return;
  savedRecipes.add({
    bean_id: bean.id,
    bean_name: bean.name,
    roaster: bean.roaster,
    brewer_id: brewer,
    brewer_name: rec.brewer_name,
    recipe: currentRecipe,
    saved_at: new Date().toISOString(),
  });
}

export function goBack() {
  const currentPhase = get(phase);
  if (currentPhase === 'apparatus') {
    phase.set('brewer_select');
    flipped.set(false);
    tasteResult.set(null);
    adjustedRecipe.set(null);
  } else {
    phase.set('entry');
  }
}

// ─── Utilities ───────────────────────────────────────────────────

export function tempDisplay(band) {
  if (!band) return '';
  const fMin = Math.round(band.min * 9/5 + 32);
  const fMax = Math.round(band.max * 9/5 + 32);
  const fStart = Math.round(band.start * 9/5 + 32);
  return `${fMin}-${fMax}°F (start ${fStart})`;
}

// Initialize store from props (called once by the host component)
export function initFromProps(bean, recData) {
  beanData.set(bean);
  recommendationData.set(recData);
  // Auto-select the top-scoring brewer
  if (recData?.recommendations) {
    const topBrewer = [...BREWERS].sort((a, b) => {
      const scoreA = recData.recommendations[a.id]?.match_score ?? 0;
      const scoreB = recData.recommendations[b.id]?.match_score ?? 0;
      return scoreB - scoreA;
    })[0];
    if (topBrewer) {
      selectedBrewer.set(topBrewer.id);
    }
  }
}

// Reset all state (for landing page / new selection)
export function resetAll() {
  selectedBean.set(null);
  selectedBrewer.set(null);
  tasteResult.set(null);
  adjustedRecipe.set(null);
  phase.set('entry');
  flipped.set(false);
  beanData.set(null);
  recommendationData.set(null);
}
