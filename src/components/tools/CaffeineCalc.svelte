<script>
  // Caffeine data sourced from COFFEE_KNOWLEDGE_SYNTHESIS.md
  // Newcastle University 2018 HPLC analysis, Gloess et al. 2013
  // FDA limit: 400mg/day healthy adults | ACOG pregnancy limit: 200mg/day
  const drinks = [
    { id: 'pour-over', name: 'Pour Over', serving: '8 oz', mg: 100, note: 'V60, Chemex, Kalita' },
    { id: 'drip', name: 'Drip Coffee', serving: '8 oz', mg: 95, note: 'Auto drip machine' },
    { id: 'french-press', name: 'French Press', serving: '8 oz', mg: 120, note: 'Unfiltered, full body' },
    { id: 'aeropress', name: 'AeroPress', serving: '8 oz', mg: 100, note: 'Standard recipe' },
    { id: 'espresso', name: 'Espresso', serving: '1 oz', mg: 63, note: 'Single shot' },
    { id: 'double', name: 'Double Espresso', serving: '2 oz', mg: 126, note: 'Two shots' },
    { id: 'latte', name: 'Latte / Cappuccino', serving: '12 oz', mg: 126, note: 'Double shot + milk' },
    { id: 'cold-brew', name: 'Cold Brew', serving: '12 oz', mg: 200, note: 'Diluted concentrate' },
    { id: 'moka', name: 'Moka Pot', serving: '2 oz', mg: 93, note: 'Stovetop' },
    { id: 'decaf', name: 'Decaf', serving: '8 oz', mg: 5, note: '3–6 mg per cup' },
  ];

  const FDA_LIMIT = 400;
  const PREGNANCY_LIMIT = 200;
  const HALF_LIFE_HOURS = 5;

  let log = $state([]);

  let total = $derived(log.reduce((sum, item) => sum + item.mg, 0));
  let pct = $derived(Math.min((total / FDA_LIMIT) * 100, 100));
  let overLimit = $derived(total > FDA_LIMIT);
  let overPregnancy = $derived(total > PREGNANCY_LIMIT);

  function addDrink(drink) {
    log = [...log, { ...drink, ts: Date.now(), uid: Math.random() }];
  }

  function removeDrink(uid) {
    log = log.filter(d => d.uid !== uid);
  }

  function clearAll() {
    log = [];
  }

  // Determine bar color based on percentage
  function barColor(total) {
    if (total >= FDA_LIMIT) return '#8B2500';
    if (total >= 300) return '#A8632E';
    if (total >= 200) return '#C17A3A';
    return 'rgba(193, 122, 58, 0.7)';
  }
</script>

<div class="caffeine-tool">
  <!-- Total display -->
  <div class="total-section">
    <span class="section-label">Today's Caffeine</span>
    <div class="total-display" class:over-limit={overLimit}>
      <span class="total-number">{total}</span>
      <span class="total-unit">mg</span>
    </div>
    <div class="limit-bar-wrap">
      <div class="limit-bar">
        <div
          class="limit-bar-fill"
          style:width="{pct}%"
          style:background={barColor(total)}
        ></div>
        <div class="limit-marker" style:left="{(PREGNANCY_LIMIT / FDA_LIMIT) * 100}%">
          <span class="marker-label">200</span>
        </div>
        <div class="limit-marker limit-marker--end">
          <span class="marker-label">400</span>
        </div>
      </div>
      <div class="limit-labels">
        <span class="limit-note">FDA daily limit: 400 mg</span>
        {#if overLimit}
          <span class="limit-warning">Over recommended limit</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Drink picker -->
  <div class="picker-section">
    <span class="section-label">Add a drink</span>
    <div class="drink-grid">
      {#each drinks as drink}
        <button class="drink-btn" onclick={() => addDrink(drink)}>
          <div class="drink-info">
            <span class="drink-name">{drink.name}</span>
            <span class="drink-meta">{drink.serving} &middot; {drink.note}</span>
          </div>
          <div class="drink-mg">
            <span class="mg-value">+{drink.mg}</span>
            <span class="mg-unit">mg</span>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Log -->
  {#if log.length > 0}
    <div class="log-section">
      <div class="log-header">
        <span class="section-label">Today's log</span>
        <button class="clear-btn" onclick={clearAll}>Clear all</button>
      </div>
      <div class="log-list">
        {#each log as entry, i}
          <div class="log-item">
            <span class="log-name">{entry.name}</span>
            <span class="log-mg">{entry.mg} mg</span>
            <button class="log-remove" onclick={() => removeDrink(entry.uid)} aria-label="Remove">&times;</button>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Science notes -->
  <div class="notes-section">
    <span class="section-label">Good to know</span>
    <div class="notes-grid">
      <div class="note-card">
        <h4 class="note-title">Half-life: ~5 hours</h4>
        <p class="note-text">Caffeine's half-life averages 5 hours but ranges 1.5–10 hours depending on genetics. A 3pm coffee means ~half is still active at 8pm.</p>
      </div>
      <div class="note-card">
        <h4 class="note-title">Pregnancy: 200 mg max</h4>
        <p class="note-text">ACOG recommends no more than 200 mg/day during pregnancy. Caffeine crosses the placenta and its half-life extends up to 3x in the third trimester. <a href="/blog/how-is-coffee-decaffeinated/" class="note-link">Decaf options &rarr;</a></p>
      </div>
      <div class="note-card">
        <h4 class="note-title">Fast vs slow metabolizers</h4>
        <p class="note-text">The CYP1A2 gene determines how fast you process caffeine — clearance varies up to 40-fold between people. If coffee keeps you up at night, you may be a slow metabolizer.</p>
      </div>
      <div class="note-card">
        <h4 class="note-title">Espresso myth</h4>
        <p class="note-text">Espresso has MORE caffeine per ml, but LESS per serving. A single shot (~63 mg) has far less caffeine than an 8 oz drip (~95 mg). The "espresso = more caffeine" perception comes from its extreme concentration, not its total content. <a href="/blog/whats-different-about-ristretto-or-lungo-espresso-shots/" class="note-link">Espresso shots explained &rarr;</a></p>
      </div>
      <div class="note-card">
        <h4 class="note-title">Stomach sensitivity?</h4>
        <p class="note-text">Caffeine itself triggers gastric acid production — independent of the coffee's acidity. Paper-filtered methods, cold brew, and lower doses can all help. <a href="/blog/finding-the-best-low-acid-coffee/" class="note-link">Low acid coffee guide &rarr;</a></p>
      </div>
    </div>
  </div>
</div>

<style>
  .caffeine-tool {
    display: flex;
    flex-direction: column;
    gap: 2rem;
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

  /* === Total Display === */
  .total-section {
    text-align: center;
  }

  .total-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.25rem;
    transition: color 0.3s;
  }
  .total-number {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-weight: 700;
    color: #1A1A1A;
    line-height: 1;
    transition: color 0.3s;
  }
  .total-unit {
    font-size: 1rem;
    color: #8A8070;
    font-weight: 500;
  }
  .over-limit .total-number {
    color: #8B2500;
  }

  /* === Limit Bar === */
  .limit-bar-wrap {
    margin-top: 0.75rem;
  }
  .limit-bar {
    position: relative;
    height: 8px;
    background: rgba(26, 26, 26, 0.06);
    overflow: visible;
  }
  .limit-bar-fill {
    height: 100%;
    transition: width 0.4s ease, background 0.4s ease;
    min-width: 2px;
  }
  .limit-marker {
    position: absolute;
    top: -2px;
    height: 12px;
    width: 1px;
    background: rgba(26, 26, 26, 0.2);
  }
  .limit-marker--end {
    left: 100%;
  }
  .marker-label {
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.55rem;
    color: #8A8070;
    white-space: nowrap;
  }

  .limit-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
  .limit-note {
    font-size: 0.65rem;
    color: #8A8070;
  }
  .limit-warning {
    font-size: 0.65rem;
    font-weight: 600;
    color: #8B2500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* === Drink Picker === */
  .drink-grid {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .drink-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.75rem;
    border: 1px solid rgba(26, 26, 26, 0.08);
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    gap: 0.75rem;
  }
  .drink-btn:hover {
    border-color: rgba(193, 122, 58, 0.35);
    background: rgba(193, 122, 58, 0.02);
  }
  .drink-btn:active {
    background: rgba(193, 122, 58, 0.08);
  }

  .drink-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }
  .drink-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1A1A1A;
  }
  .drink-meta {
    font-size: 0.65rem;
    color: #8A8070;
  }

  .drink-mg {
    display: flex;
    align-items: baseline;
    gap: 0.15rem;
    flex-shrink: 0;
  }
  .mg-value {
    font-family: 'Playfair Display', serif;
    font-size: 1rem;
    font-weight: 700;
    color: #C17A3A;
  }
  .mg-unit {
    font-size: 0.6rem;
    color: #8A8070;
  }

  /* === Log === */
  .log-section {
    border-top: 1px solid rgba(26, 26, 26, 0.08);
    padding-top: 1.25rem;
  }

  .log-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .log-header .section-label {
    margin-bottom: 0;
  }

  .clear-btn {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #8A8070;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  .clear-btn:hover {
    color: #8B2500;
    text-decoration: underline;
  }

  .log-list {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin-top: 0.5rem;
  }

  .log-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(26, 26, 26, 0.04);
  }
  .log-name {
    flex: 1;
    font-size: 0.75rem;
    color: #1A1A1A;
  }
  .log-mg {
    font-size: 0.75rem;
    font-weight: 600;
    color: #5C4A38;
    flex-shrink: 0;
  }
  .log-remove {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    color: #8A8070;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1;
    padding: 0;
    flex-shrink: 0;
  }
  .log-remove:hover {
    color: #8B2500;
  }

  /* === Notes === */
  .notes-section {
    border-top: 1px solid rgba(26, 26, 26, 0.08);
    padding-top: 1.25rem;
  }

  .notes-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .note-card {
    background: rgba(61, 37, 24, 0.03);
    padding: 0.75rem;
    border-left: 2px solid rgba(193, 122, 58, 0.3);
  }
  .note-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: #1A1A1A;
    margin: 0 0 0.2rem;
  }
  .note-text {
    font-size: 0.7rem;
    color: #5C4A38;
    line-height: 1.5;
    margin: 0;
  }
  .note-link {
    display: inline;
    font-size: 0.65rem;
    color: #C17A3A;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.25rem;
    white-space: nowrap;
  }
  .note-link:hover {
    color: #A8632E;
    text-decoration: underline;
  }
</style>
