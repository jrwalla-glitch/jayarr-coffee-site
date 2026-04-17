<script>
  // BeanVessel — Section I: copper input vessel with glass porthole
  // Concept art ref: 00-apparatus-v3-final.png (leftmost section)
  import { beanData } from './store.js';

  let bean = $derived($beanData);
  let hasBean = $derived(!!bean);

  let originDisplay = $derived(
    (bean?.origin || '').replace(/_/g, ' ')
  );
  let roastDisplay = $derived(
    (bean?.roast_level || '').replace(/_/g, '-')
  );
  let processDisplay = $derived(bean?.processing || '');
  let varietyDisplay = $derived(
    Array.isArray(bean?.variety) ? bean.variety.join(', ') : (bean?.variety || '')
  );
</script>

<div class="bean-vessel">
  <!-- Section header -->
  <div class="section-label">
    <span class="section-num">I</span>
    <span class="section-title">The Input Vessel</span>
    <span class="section-sub">the bean</span>
  </div>

  <!-- Vessel SVG -->
  <div class="vessel-container">
    <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" class="vessel-svg">
      <!-- Vessel body (copper rounded rectangle) -->
      <path d="M 40,30 Q 35,30 30,40 L 25,160 Q 25,180 45,185 L 115,185 Q 135,180 135,160 L 130,40 Q 125,30 120,30 Z"
        fill="#D4A847" stroke="#8B5E2B" stroke-width="2" />

      <!-- Vessel highlight (left edge) -->
      <path d="M 42,35 Q 38,35 35,42 L 30,155"
        fill="none" stroke="#E8C86A" stroke-width="2" opacity="0.5" stroke-linecap="round" />

      <!-- Glass porthole -->
      <ellipse cx="80" cy="100" rx="38" ry="45"
        fill="#2C1810" stroke="#8B5E2B" stroke-width="3" />
      <!-- Porthole glass rim -->
      <ellipse cx="80" cy="100" rx="35" ry="42"
        fill="none" stroke="#B8860B" stroke-width="1" />

      {#if hasBean}
        <!-- Bean fill pattern inside porthole (clipped) -->
        <clipPath id="porthole-clip">
          <ellipse cx="80" cy="100" rx="33" ry="40" />
        </clipPath>
        <g clip-path="url(#porthole-clip)">
          <!-- Bean cluster (simplified oval shapes) -->
          {#each [
            { x: 65, y: 80, r: 0 }, { x: 82, y: 75, r: 20 }, { x: 95, y: 82, r: -15 },
            { x: 60, y: 95, r: 10 }, { x: 78, y: 92, r: -5 }, { x: 96, y: 96, r: 25 },
            { x: 68, y: 108, r: -10 }, { x: 85, y: 105, r: 15 }, { x: 100, y: 110, r: -20 },
            { x: 62, y: 120, r: 5 }, { x: 80, y: 118, r: -25 }, { x: 95, y: 122, r: 10 },
            { x: 70, y: 132, r: 20 }, { x: 88, y: 130, r: -8 },
          ] as b}
            <g transform="translate({b.x}, {b.y}) rotate({b.r})">
              <ellipse rx="8" ry="5" fill="#5C3A1E" />
              <!-- Bean crease -->
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#3D2510" stroke-width="0.75" />
            </g>
          {/each}
        </g>
        <!-- Porthole glass reflection -->
        <ellipse cx="68" cy="85" rx="12" ry="8"
          fill="white" opacity="0.08" transform="rotate(-15, 68, 85)" />
      {:else}
        <!-- Empty porthole -->
        <text x="80" y="105" text-anchor="middle"
          font-family="'Playfair Display', serif" font-size="24" fill="#6B6560" opacity="0.4">
          ?
        </text>
      {/if}

      <!-- Vessel cap / lid -->
      <rect x="35" y="22" width="90" height="12" rx="3"
        fill="#B8860B" stroke="#8B5E2B" stroke-width="1" />
      <!-- Cap knob -->
      <rect x="72" y="16" width="16" height="10" rx="3"
        fill="#D4A847" stroke="#8B5E2B" stroke-width="1" />

      <!-- Pipe outlet (right side) -->
      <rect x="132" y="90" width="28" height="14" rx="7"
        fill="#B8860B" stroke="#8B5E2B" stroke-width="1.5" />
    </svg>
  </div>

  <!-- Bean annotations -->
  <div class="annotations">
    {#if hasBean}
      <div class="annotation">
        <span class="anno-label">Origin:</span>
        <span class="anno-value">{originDisplay}</span>
      </div>
      <div class="annotation">
        <span class="anno-label">Process:</span>
        <span class="anno-value">{processDisplay}</span>
      </div>
      <div class="annotation">
        <span class="anno-label">Roast:</span>
        <span class="anno-value">{roastDisplay}</span>
      </div>
      {#if varietyDisplay}
        <div class="annotation">
          <span class="anno-label">Variety:</span>
          <span class="anno-value">{varietyDisplay}</span>
        </div>
      {/if}
    {:else}
      <div class="annotation empty">
        <span class="anno-label">Origin:</span>
        <span class="anno-value">[?]</span>
      </div>
      <div class="annotation empty">
        <span class="anno-label">Process:</span>
        <span class="anno-value">[?]</span>
      </div>
      <div class="annotation empty">
        <span class="anno-label">Roast:</span>
        <span class="anno-value">[?]</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .bean-vessel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .section-label {
    text-align: center;
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

  .vessel-container {
    width: 100%;
    max-width: 160px;
  }
  .vessel-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  .annotations {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    width: 100%;
    max-width: 160px;
  }
  .annotation {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-family: 'Inter', sans-serif;
    font-size: 0.7rem;
    line-height: 1.4;
  }
  .annotation.empty .anno-value {
    color: #94A3B8;
  }
  .anno-label {
    color: #94A3B8;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.6rem;
  }
  .anno-value {
    color: #1A1A1A;
    font-weight: 600;
    text-transform: capitalize;
  }
</style>
