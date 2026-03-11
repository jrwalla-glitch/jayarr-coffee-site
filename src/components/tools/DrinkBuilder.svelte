<script>
  // Espresso drink proportions — based on standard specialty cafe builds
  // Milk texturing data from COFFEE_KNOWLEDGE_SYNTHESIS.md Section 8
  // Hoffmann: cappuccino "rule of thirds" has no historical basis
  // Hoffmann: flat white = essentially a small latte with minimal foam

  const layers = {
    espresso: { label: 'Espresso', color: '#3D2518' },
    water: { label: 'Hot Water', color: '#B89F82' },
    chocolate: { label: 'Chocolate', color: '#5C3A1E' },
    milk: { label: 'Steamed Milk', color: '#E2CEAF' },
    foam: { label: 'Foam', color: '#F0E8DC' },
  };

  const drinks = [
    {
      id: 'espresso',
      name: 'Espresso',
      desc: 'Pure concentrated coffee. 9 bars of pressure, 25–35 seconds. The foundation of every drink on this list.',
      parts: [{ type: 'espresso', oz: 2 }],
      total: '2 oz',
      shots: 2,
      link: '/blog/whats-different-about-ristretto-or-lungo-espresso-shots/',
      linkLabel: 'Ristretto vs Lungo',
    },
    {
      id: 'americano',
      name: 'Americano',
      desc: 'Espresso diluted with hot water. Similar strength to drip but different flavor — the pressure extraction gives it more body. Tip: skim off the crema for a cleaner cup (Hoffmann).',
      parts: [
        { type: 'espresso', oz: 2 },
        { type: 'water', oz: 6 },
      ],
      total: '8 oz',
      shots: 2,
    },
    {
      id: 'macchiato',
      name: 'Macchiato',
      desc: '"Marked" — an espresso stained with just a small spoonful of foam. Barely changes the drink. Not to be confused with the Starbucks caramel dessert drink of the same name.',
      parts: [
        { type: 'espresso', oz: 2 },
        { type: 'foam', oz: 0.5 },
      ],
      total: '2.5 oz',
      shots: 2,
    },
    {
      id: 'cortado',
      name: 'Cortado',
      desc: 'Equal parts espresso and steamed milk. Spanish origin — "cortar" means to cut. The milk softens the espresso without diluting its character. No foam layer.',
      parts: [
        { type: 'espresso', oz: 2 },
        { type: 'milk', oz: 2 },
      ],
      total: '4 oz',
      shots: 2,
      link: '/blog/what-is-a-cortado/',
      linkLabel: 'Cortado Guide',
    },
    {
      id: 'flat-white',
      name: 'Flat White',
      desc: 'Essentially a small latte with minimal foam — just a skin of microfoam on top (Hoffmann). Originated in Australia/New Zealand. The higher espresso-to-milk ratio preserves more coffee flavor than a latte.',
      parts: [
        { type: 'espresso', oz: 2 },
        { type: 'milk', oz: 4 },
        { type: 'foam', oz: 0.25 },
      ],
      total: '~6 oz',
      shots: 2,
      link: '/blog/what-is-a-flat-white-latte-vs-flat-white-comparison/',
      linkLabel: 'Flat White vs Latte',
    },
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      desc: 'Espresso topped with heavily aerated milk — about ½ inch of thick, velvety foam after it settles. The classic Italian milk coffee. The "rule of thirds" (⅓ espresso, ⅓ milk, ⅓ foam) has no historical basis (Hoffmann).',
      parts: [
        { type: 'espresso', oz: 2 },
        { type: 'milk', oz: 2 },
        { type: 'foam', oz: 2 },
      ],
      total: '6 oz',
      shots: 2,
      link: '/blog/whats-a-bone-dry-cappuccino/',
      linkLabel: 'Cappuccino Styles',
    },
    {
      id: 'latte',
      name: 'Latte',
      desc: 'Lots of steamed milk, thin layer of microfoam. The milk-forward espresso drink — smooth, sweet, approachable. The canvas for latte art. Moderately aerated — about ¼ inch of foam.',
      parts: [
        { type: 'espresso', oz: 2 },
        { type: 'milk', oz: 8 },
        { type: 'foam', oz: 0.5 },
      ],
      total: '~10 oz',
      shots: 2,
    },
    {
      id: 'mocha',
      name: 'Mocha',
      desc: 'Espresso + chocolate + steamed milk. The bridge between coffee and hot chocolate. Use real cocoa or chocolate sauce — the quality of the chocolate matters as much as the espresso.',
      parts: [
        { type: 'espresso', oz: 2 },
        { type: 'chocolate', oz: 1 },
        { type: 'milk', oz: 5 },
        { type: 'foam', oz: 1 },
      ],
      total: '~9 oz',
      shots: 2,
      link: '/blog/making-a-mocha-with-and-without-espresso-machine/',
      linkLabel: 'Mocha Recipe',
    },
  ];

  let selectedId = $state(null);
  let active = $derived(drinks.find(d => d.id === selectedId));

  function select(id) {
    selectedId = selectedId === id ? null : id;
  }

  function totalOz(drink) {
    return drink.parts.reduce((sum, p) => sum + p.oz, 0);
  }
</script>

<div class="drink-tool">
  <p class="intro">Pick a drink to see how it's built.</p>

  <div class="drink-grid">
    {#each drinks as drink}
      <button
        class="drink-btn"
        class:drink-btn--active={selectedId === drink.id}
        onclick={() => select(drink.id)}
      >
        {drink.name}
      </button>
    {/each}
  </div>

  {#if active}
    <div class="build-panel">
      <div class="build-layout">
        <!-- Cup visual -->
        <div class="cup-wrap">
          <div class="cup">
            {#each [...active.parts].reverse() as part}
              {@const pct = (part.oz / totalOz(active)) * 100}
              <div
                class="cup-layer"
                style:height="{pct}%"
                style:background={layers[part.type].color}
              >
                {#if pct > 12}
                  <span class="layer-label">{layers[part.type].label}</span>
                {/if}
              </div>
            {/each}
          </div>
          <span class="cup-total">{active.total}</span>
        </div>

        <!-- Breakdown -->
        <div class="build-info">
          <h3 class="drink-title">{active.name}</h3>
          <p class="drink-desc">{active.desc}</p>

          <div class="parts-list">
            <span class="section-label">Proportions</span>
            {#each active.parts as part}
              <div class="part-row">
                <div class="part-swatch" style:background={layers[part.type].color}></div>
                <span class="part-name">{layers[part.type].label}</span>
                <span class="part-oz">{part.oz} oz</span>
              </div>
            {/each}
          </div>

          {#if active.link}
            <a href={active.link} class="drink-link">{active.linkLabel} &rarr;</a>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .drink-tool {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .intro {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #1A1A1A;
    text-align: center;
  }

  .section-label {
    display: block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #C17A3A;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  /* === Drink Grid === */
  .drink-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: center;
  }

  .drink-btn {
    padding: 0.5rem 0.85rem;
    border: 1px solid rgba(26, 26, 26, 0.1);
    background: transparent;
    font-size: 0.75rem;
    font-weight: 500;
    color: #1A1A1A;
    cursor: pointer;
    transition: all 0.2s;
  }
  .drink-btn:hover {
    border-color: rgba(193, 122, 58, 0.35);
    background: rgba(193, 122, 58, 0.02);
  }
  .drink-btn--active {
    border-color: #C17A3A;
    background: rgba(193, 122, 58, 0.06);
    color: #C17A3A;
    font-weight: 600;
  }

  /* === Build Panel === */
  .build-panel {
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .build-layout {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
  }
  @media (max-width: 480px) {
    .build-layout {
      flex-direction: column;
      align-items: center;
    }
  }

  /* === Cup Visual === */
  .cup-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .cup {
    width: 90px;
    height: 200px;
    border: 2px solid rgba(26, 26, 26, 0.12);
    border-top: none;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .cup-layer {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: height 0.3s ease;
    position: relative;
    min-height: 2px;
  }
  .layer-label {
    font-size: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: rgba(255,255,255,0.7);
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    text-align: center;
    line-height: 1.2;
    padding: 0 0.2rem;
  }
  /* Dark text for light layers */
  .cup-layer:nth-last-child(1) .layer-label,
  .cup-layer:nth-last-child(2) .layer-label {
    color: rgba(61, 37, 24, 0.5);
    text-shadow: none;
  }

  .cup-total {
    font-size: 0.6rem;
    color: #8A8070;
    margin-top: 0.35rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* === Build Info === */
  .build-info {
    flex: 1;
    min-width: 0;
  }

  .drink-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0 0 0.35rem;
  }
  .drink-desc {
    font-size: 0.8rem;
    color: #5C4A38;
    line-height: 1.6;
    margin: 0 0 1rem;
  }

  /* === Parts List === */
  .parts-list {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .part-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .part-swatch {
    width: 14px;
    height: 14px;
    border: 1px solid rgba(26, 26, 26, 0.08);
    flex-shrink: 0;
  }
  .part-name {
    font-size: 0.75rem;
    color: #1A1A1A;
    flex: 1;
  }
  .part-oz {
    font-size: 0.75rem;
    font-weight: 600;
    color: #5C4A38;
    flex-shrink: 0;
  }

  .drink-link {
    display: inline-block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #C17A3A;
    text-decoration: none;
    font-weight: 500;
    margin-top: 0.75rem;
  }
  .drink-link:hover {
    color: #A8632E;
    text-decoration: underline;
  }
</style>
