<script>
  // BrewerApparatus — Section II: brewer housing with swappable silhouette
  // Concept art ref: 00-apparatus-v3-final.png (center section)
  import { selectedBrewer, recommendation, BREWERS } from './store.js';

  let hasBrewer = $derived(!!$selectedBrewer);
  let brewerInfo = $derived(BREWERS.find(b => b.id === $selectedBrewer));
  let rec = $derived($recommendation);

  // Brewer metadata for annotations
  const BREWER_META = {
    'hario-v60-02':    { filter: 'Paper Cone',    mechanism: 'Pour-Over',     character: 'Clean, Bright' },
    'chemex-6cup':     { filter: 'Thick Paper',   mechanism: 'Pour-Over',     character: 'Clean, Sweet' },
    'kalita-wave-185': { filter: 'Wave Paper',    mechanism: 'Pour-Over',     character: 'Even, Balanced' },
    'aeropress':       { filter: 'Paper/Metal',   mechanism: 'Pressure',      character: 'Versatile' },
    'clever-dripper':  { filter: 'Paper Cone',    mechanism: 'Immersion+Drip',character: 'Forgiving' },
    'french-press':    { filter: 'Metal Mesh',    mechanism: 'Immersion',     character: 'Rich, Full-Bodied' },
    'espresso-generic':{ filter: 'Pressurized',   mechanism: 'Pressure',      character: 'Concentrated' },
    'moka-pot':        { filter: 'Metal Basket',  mechanism: 'Steam Pressure',character: 'Strong, Bold' },
    'cold-brew':       { filter: 'Metal/Cloth',   mechanism: 'Immersion',     character: 'Smooth, Low-Acid' },
  };

  let meta = $derived(
    $selectedBrewer ? BREWER_META[$selectedBrewer] : null
  );

  // Simplified brewer silhouette paths (stroke-based, copper line art)
  const SILHOUETTES = {
    'hario-v60-02':    'M 50,30 L 30,90 Q 30,95 40,95 L 60,95 Q 70,95 70,90 L 50,30 M 35,50 L 65,50 M 30,95 L 30,115 Q 30,120 50,120 Q 70,120 70,115 L 70,95',
    'chemex-6cup':     'M 50,25 L 35,55 Q 50,60 65,55 L 50,25 M 35,55 L 30,90 Q 30,95 50,95 Q 70,95 70,90 L 65,55 M 40,55 L 40,62 M 60,55 L 60,62',
    'kalita-wave-185': 'M 30,40 L 30,80 Q 30,90 50,90 Q 70,90 70,80 L 70,40 Q 70,35 50,35 Q 30,35 30,40 M 33,80 Q 50,85 67,80 M 30,90 L 30,110 Q 30,115 50,115 Q 70,115 70,110 L 70,90',
    'aeropress':       'M 35,25 L 35,85 Q 35,90 50,90 Q 65,90 65,85 L 65,25 Q 65,22 50,22 Q 35,22 35,25 M 40,22 L 40,15 M 60,22 L 60,15 M 40,15 L 60,15',
    'clever-dripper':  'M 50,30 L 32,85 Q 32,90 50,90 Q 68,90 68,85 L 50,30 M 45,90 L 45,100 Q 45,102 50,102 Q 55,102 55,100 L 55,90',
    'french-press':    'M 35,25 L 35,95 Q 35,100 50,100 Q 65,100 65,95 L 65,25 Q 65,22 50,22 Q 35,22 35,25 M 50,15 L 50,25 M 45,15 L 55,15 M 38,50 L 62,50',
    'espresso-generic':'M 30,50 L 30,65 Q 30,70 40,70 L 60,70 Q 70,70 70,65 L 70,50 Q 70,45 50,45 Q 30,45 30,50 M 25,50 L 30,50 M 70,50 L 75,50 M 40,70 L 35,85 M 60,70 L 65,85',
    'moka-pot':        'M 35,55 L 35,90 Q 35,95 50,95 Q 65,95 65,90 L 65,55 Q 65,50 50,50 Q 35,50 35,55 M 35,50 L 38,25 Q 40,20 50,20 Q 60,20 62,25 L 65,50 M 50,20 L 50,12 Q 50,10 52,10 L 55,10',
    'cold-brew':       'M 30,20 L 30,95 Q 30,100 50,100 Q 70,100 70,95 L 70,20 Q 70,15 50,15 Q 30,15 30,20 M 35,35 L 35,80 Q 35,85 50,85 Q 65,85 65,80 L 65,35 Q 65,30 50,30 Q 35,30 35,35',
  };

  let silhouettePath = $derived(
    $selectedBrewer ? SILHOUETTES[$selectedBrewer] : null
  );
</script>

<div class="brewer-apparatus">
  <!-- Section header -->
  <div class="section-label">
    <span class="section-num">II</span>
    <span class="section-title">The Extraction Apparatus</span>
    <span class="section-sub">the brewer</span>
  </div>

  <!-- Brewer housing SVG -->
  <div class="brewer-container">
    <svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" class="brewer-svg">
      {#if hasBrewer && silhouettePath}
        <!-- Brewer silhouette (copper stroke art) -->
        <path d={silhouettePath}
          fill="none" stroke="#B8860B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Brewer name -->
        <text x="50" y="122" text-anchor="middle"
          font-family="'Playfair Display', serif" font-size="10" font-weight="700" fill="#1A1A1A">
          {brewerInfo?.name || ''}
        </text>
      {:else}
        <!-- Empty housing -->
        <rect x="25" y="25" width="50" height="75" rx="6"
          fill="none" stroke="#D4C5A9" stroke-width="1.5" stroke-dasharray="4,3" />
        <text x="50" y="68" text-anchor="middle"
          font-family="'Playfair Display', serif" font-size="24" fill="#94A3B8" opacity="0.4">
          ?
        </text>
        <text x="50" y="118" text-anchor="middle"
          font-family="'Inter', sans-serif" font-size="7" fill="#94A3B8">
          SELECT BREWER
        </text>
      {/if}
    </svg>
  </div>

  <!-- Brewer annotations -->
  <div class="annotations">
    {#if meta}
      <div class="annotation">
        <span class="anno-label">Filter:</span>
        <span class="anno-value">{meta.filter}</span>
      </div>
      <div class="annotation">
        <span class="anno-label">Method:</span>
        <span class="anno-value">{meta.mechanism}</span>
      </div>
      <div class="annotation">
        <span class="anno-label">Character:</span>
        <span class="anno-value">{meta.character}</span>
      </div>
    {:else}
      <div class="annotation empty">
        <span class="anno-label">Filter:</span>
        <span class="anno-value">[?]</span>
      </div>
      <div class="annotation empty">
        <span class="anno-label">Method:</span>
        <span class="anno-value">[?]</span>
      </div>
      <div class="annotation empty">
        <span class="anno-label">Character:</span>
        <span class="anno-value">[?]</span>
      </div>
    {/if}
  </div>
</div>

<style>
  .brewer-apparatus {
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

  .brewer-container {
    width: 100%;
    max-width: 120px;
  }
  .brewer-svg {
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
  }
</style>
