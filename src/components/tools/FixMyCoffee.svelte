<script>
  let selectedSymptom = $state(null);

  // Sourced from COFFEE_KNOWLEDGE_SYNTHESIS.md + physics_of_filter_coffee_summary.md
  // Extraction science: acids first, sugars mid, bitter compounds last (Gagné)
  // Waveforms: visual taste signatures — shape = taste quality, weight = intensity
  const symptoms = [
    {
      id: 'sour',
      name: 'Sour / Acidic',
      wave: 'M0 8 L4 2 L8 14 L12 2 L16 14 L20 2 L24 14 L28 2 L32 8',
      strokeWidth: 1.5,
      tagline: 'Sharp, tangy, vinegary — tastes under-developed',
      diagnosis: 'Under-extraction (EY below 18%). Only the fast-extracting fruit acids dissolved — the balancing sugars and caramel compounds didn\'t have time.',
      diagnosisLink: '/blog/coffee-extraction-yield-explained/',
      diagnosisLinkLabel: 'Extraction Science',
      fixes: [
        { action: 'Grind finer', detail: 'More surface area slows flow and increases extraction. This is the single most effective fix.', link: '/blog/coffee-grind-size-guide-what-grind-for-every-brew-method/', linkLabel: 'Grind Size Guide' },
        { action: 'Use hotter water', detail: 'Target 93–96°C (200–205°F). Higher temp increases diffusion rate. Note: slurry temp is 5–15°C lower than kettle temp — pre-heat your dripper.', link: '/blog/whats-the-ideal-coffee-brewing-temperature/', linkLabel: 'Brewing Temperature' },
        { action: 'Extend brew time', detail: 'Pour slower, use smaller pours, or steep longer. V60 should be 2:30–3:30; French press 4:00 minimum.' },
        { action: 'Check your water', detail: 'Water below 75 ppm TDS is too soft to extract properly. If using RO or distilled, add minerals (target 150 ppm TDS).', link: '/blog/why-water-matters-more-than-your-coffee-beans/', linkLabel: 'Water Science' },
      ],
    },
    {
      id: 'bitter',
      name: 'Bitter / Harsh',
      wave: 'M0 8 Q8 0 16 8 Q24 16 32 8',
      strokeWidth: 2.5,
      tagline: 'Ashy, burnt, unpleasant aftertaste',
      diagnosis: 'Over-extraction (EY above 22%). Dry distillates — the last, bitter compounds — have been pulled into the cup. Even small amounts overpower sweetness.',
      diagnosisLink: '/blog/coffee-extraction-yield-explained/',
      diagnosisLinkLabel: 'Extraction Science',
      fixes: [
        { action: 'Grind coarser', detail: 'Less surface area means faster water flow and shorter contact time. Adjust one click at a time.', link: '/blog/coffee-grind-size-guide-what-grind-for-every-brew-method/', linkLabel: 'Grind Size Guide' },
        { action: 'Use cooler water', detail: 'Drop to 90–93°C (195–200°F). Lower temps slow diffusion and reduce bitter compound extraction. Try bottom of range for dark roasts.', link: '/blog/whats-the-ideal-coffee-brewing-temperature/', linkLabel: 'Brewing Temperature' },
        { action: 'Shorten brew time', detail: 'Pour faster, use larger pours. If V60 is running over 3:30, grind is too fine or bed is clogged by fines.' },
        { action: 'Use more water', detail: 'Try a 1:17 ratio instead of 1:15. More water dilutes over-extracted solids and softens the cup.' },
      ],
    },
    {
      id: 'weak',
      name: 'Weak / Watery',
      wave: 'M0 8 Q8 6.5 16 8 Q24 9.5 32 8',
      strokeWidth: 1,
      tagline: 'Thin body, tastes diluted, lacks punch',
      diagnosis: 'Low TDS (below 1.15%) — not enough dissolved coffee in the cup. This is about concentration, not extraction. You can have properly extracted but weak coffee.',
      fixes: [
        { action: 'Use more coffee', detail: 'Increase dose. Try 1:14 or 1:15 ratio instead of 1:17. Even 1–2g more coffee makes a noticeable difference.' },
        { action: 'Grind finer', detail: 'Finer grind extracts more solids from the same amount of coffee, increasing strength without changing dose.', link: '/blog/coffee-grind-size-guide-what-grind-for-every-brew-method/', linkLabel: 'Grind Size Guide' },
        { action: 'Use less water', detail: 'If you don\'t want to change grind or dose, simply reduce total water volume for a stronger cup.' },
        { action: 'Check bean freshness', detail: 'Stale beans (30+ days post-roast) have lost volatile compounds and produce thin, flat cups. Peak flavor: 7–21 days after roasting.', link: '/blog/coffee-freshness-roast-to-stale/', linkLabel: 'Freshness Timeline' },
      ],
    },
    {
      id: 'both',
      name: 'Sour AND Bitter',
      wave: 'M0 8 L3 3 L6 14 L10 4 L13 13 L17 2 L20 14 L24 5 L27 12 L32 8',
      strokeWidth: 1.5,
      tagline: 'Confusing — unpleasant in multiple ways at once',
      diagnosis: 'Uneven extraction. Some particles are over-extracted while others are under-extracted. Average EY may be "ideal" but the cup tastes bad. A brew at 20% EY with even extraction beats 19% EY with uneven extraction (Gagné).',
      diagnosisLink: '/blog/coffee-extraction-yield-explained/',
      diagnosisLinkLabel: 'Extraction Science',
      fixes: [
        { action: 'Improve grind consistency', detail: 'Blade grinders and cheap burr grinders produce too many fines and boulders. Upgrade to a quality burr grinder — this is the #1 equipment upgrade.', link: '/blog/top-10-best-manual-coffee-grinders/', linkLabel: 'Manual Grinder Guide' },
        { action: 'Fix water distribution', detail: 'Pour in slow, concentric circles. Don\'t pour on the filter walls. Keep the coffee bed level — channeling causes uneven extraction.', link: '/blog/ultimate-pour-over-coffee-guide-and-best-v60-technique/', linkLabel: 'Pour Over Technique' },
        { action: 'Try a more forgiving brewer', detail: 'Kalita Wave or Clever Dripper regulate flow automatically, reducing technique-dependent variables.', link: '/blog/the-clever-dripper-better-coffee-than-pour-over/', linkLabel: 'Clever Dripper Review' },
        { action: 'Sift out fines', detail: 'Use a fine-mesh sieve (Kruve 200–400μm) to remove excess fines. Reduces both over-extraction from fines and channeling.', link: '/blog/coffee-grind-size-micron-chart/', linkLabel: 'Grind Micron Chart' },
      ],
    },
    {
      id: 'flat',
      name: 'Flat / Dull',
      wave: 'M0 8 L32 8',
      strokeWidth: 1.5,
      tagline: 'No brightness, boring, tastes muted',
      diagnosis: 'Likely a water chemistry issue. High alkalinity (KH above 80 ppm) buffers the natural fruit acids in coffee, neutralizing brightness. Can also indicate stale beans.',
      diagnosisLink: '/blog/why-water-matters-more-than-your-coffee-beans/',
      diagnosisLinkLabel: 'Water Science',
      fixes: [
        { action: 'Check water alkalinity', detail: 'If KH is above 80 ppm, your water is buffering all the bright acids. Target ~40 ppm alkalinity with a GH:KH ratio of 2:1 to 3:1.', link: '/blog/coffee-water-recipes-compared/', linkLabel: 'Water Recipes' },
        { action: 'Use fresher beans', detail: 'Volatile aromatic compounds fade quickly after roasting. Buy whole bean, grind fresh, use within 3 weeks of roast date.', link: '/blog/coffee-freshness-roast-to-stale/', linkLabel: 'Freshness Timeline' },
        { action: 'Try a lighter roast', detail: 'Dark roasts have fewer origin-character acids. Medium or light roasts preserve more of the bright, complex flavors.', link: '/blog/how-is-coffee-roasted/', linkLabel: 'Roasting Explained' },
        { action: 'Switch to paper filter', detail: 'Metal filters (French press) let oils through that can mute brightness. Paper filters produce a cleaner, brighter cup.' },
      ],
    },
    {
      id: 'muddy',
      name: 'Muddy / Gritty',
      wave: 'M0 9 L2 7 L4 10 L6 6 L8 11 L10 7 L12 10 L14 6 L16 11 L18 7 L20 10 L22 6 L24 11 L26 7 L28 10 L30 7 L32 9',
      strokeWidth: 2,
      tagline: 'Heavy sediment, chalky texture, murky',
      diagnosis: 'Fines in the cup — either from a metal filter letting particles through, or grind inconsistency flooding fine particles past the filter.',
      diagnosisLink: '/blog/coffee-grind-size-guide-what-grind-for-every-brew-method/',
      diagnosisLinkLabel: 'Grind Size Guide',
      fixes: [
        { action: 'Use a paper filter', detail: 'Paper filters catch virtually all fine particles. If using French press, try a Clever Dripper for similar body with paper-filter clarity.', link: '/blog/the-clever-dripper-better-coffee-than-pour-over/', linkLabel: 'Clever Dripper Review' },
        { action: 'Grind coarser', detail: 'A finer grind produces more dust-like fines that slip through any filter. Coarser grind reduces fines production.', link: '/blog/coffee-grind-size-guide-what-grind-for-every-brew-method/', linkLabel: 'Grind Size Guide' },
        { action: 'Upgrade your grinder', detail: 'Cheap grinders (especially blade) produce excessive fines at any setting. A quality burr grinder dramatically reduces fines.', link: '/blog/top-10-best-manual-coffee-grinders/', linkLabel: 'Manual Grinder Guide' },
        { action: 'Don\'t agitate the bed', detail: 'Aggressive stirring or pouring breaks the coffee bed and sends fines into suspension. Pour gently, stir minimally.' },
      ],
    },
  ];

  function select(id) {
    selectedSymptom = selectedSymptom === id ? null : id;
  }

  let active = $derived(symptoms.find(s => s.id === selectedSymptom));
</script>

<div class="fix-tool">
  <p class="intro">What's wrong with your coffee?</p>

  <div class="symptom-grid">
    {#each symptoms as symptom}
      <button
        class="symptom-btn"
        class:symptom-btn--active={selectedSymptom === symptom.id}
        onclick={() => select(symptom.id)}
      >
        <svg class="symptom-wave" viewBox="0 0 32 16" aria-hidden="true">
          <path d={symptom.wave} fill="none" stroke="currentColor" stroke-width={symptom.strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="symptom-name">{symptom.name}</span>
        <span class="symptom-tag">{symptom.tagline}</span>
      </button>
    {/each}
  </div>

  {#if active}
    <div class="diagnosis-panel">
      <div class="diagnosis-header">
        <svg class="diagnosis-wave" viewBox="0 0 32 16" aria-hidden="true">
          <path d={active.wave} fill="none" stroke="currentColor" stroke-width={active.strokeWidth} stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3 class="diagnosis-title">{active.name}</h3>
      </div>

      <div class="diagnosis-box">
        <span class="section-label">Diagnosis</span>
        <p class="diagnosis-text">
          {active.diagnosis}
          {#if active.diagnosisLink}
            <a href={active.diagnosisLink} class="inline-link">{active.diagnosisLinkLabel} &rarr;</a>
          {/if}
        </p>
      </div>

      <div class="fixes">
        <span class="section-label">Fixes — in order of impact</span>
        {#each active.fixes as fix, i}
          <div class="fix-card">
            <div class="fix-number">{i + 1}</div>
            <div class="fix-content">
              <h4 class="fix-action">{fix.action}</h4>
              <p class="fix-detail">{fix.detail}</p>
              {#if fix.link}
                <a href={fix.link} class="fix-link">{fix.linkLabel} &rarr;</a>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .fix-tool {
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
    margin-bottom: 0.5rem;
  }

  /* === Symptom Grid === */
  .symptom-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  @media (max-width: 480px) {
    .symptom-grid { grid-template-columns: 1fr; }
  }

  .symptom-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
    padding: 0.75rem;
    border: 1px solid rgba(26, 26, 26, 0.1);
    background: transparent;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
  }
  .symptom-btn:hover {
    border-color: rgba(193, 122, 58, 0.35);
    background: rgba(193, 122, 58, 0.02);
  }
  .symptom-btn--active {
    border-color: #C17A3A;
    background: rgba(193, 122, 58, 0.06);
  }

  /* === Taste Waveforms === */
  .symptom-wave {
    width: 48px;
    height: 20px;
    color: #C17A3A;
    margin-bottom: 0.15rem;
  }
  .symptom-btn:hover .symptom-wave {
    color: #A8632E;
  }

  .symptom-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1A1A1A;
    margin-top: 0.1rem;
  }
  .symptom-tag {
    font-size: 0.7rem;
    color: #8A8070;
    line-height: 1.3;
  }

  /* === Diagnosis Panel === */
  .diagnosis-panel {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .diagnosis-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid rgba(26, 26, 26, 0.08);
  }
  .diagnosis-wave {
    width: 44px;
    height: 20px;
    color: #C17A3A;
    flex-shrink: 0;
  }
  .diagnosis-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #1A1A1A;
    margin: 0;
  }

  .diagnosis-box {
    background: rgba(61, 37, 24, 0.04);
    padding: 1rem;
    border-left: 3px solid #3D2518;
  }
  .diagnosis-text {
    font-size: 0.8rem;
    color: #3D2518;
    line-height: 1.6;
    margin: 0;
  }

  /* === Contextual Links === */
  .inline-link {
    display: inline;
    font-size: 0.7rem;
    color: #C17A3A;
    text-decoration: none;
    font-weight: 500;
    margin-left: 0.35rem;
    white-space: nowrap;
  }
  .inline-link:hover {
    color: #A8632E;
    text-decoration: underline;
  }

  .fix-link {
    display: inline-block;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #C17A3A;
    text-decoration: none;
    margin-top: 0.3rem;
    font-weight: 500;
  }
  .fix-link:hover {
    color: #A8632E;
    text-decoration: underline;
  }

  /* === Fix Cards === */
  .fixes {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .fix-card {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .fix-number {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 0.8rem;
    font-weight: 700;
    color: #C17A3A;
    border: 1px solid rgba(193, 122, 58, 0.3);
    border-radius: 2px;
    margin-top: 0.1rem;
  }

  .fix-content {
    flex: 1;
  }
  .fix-action {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1A1A1A;
    margin: 0 0 0.2rem;
  }
  .fix-detail {
    font-size: 0.75rem;
    color: #5C4A38;
    line-height: 1.5;
    margin: 0;
  }
</style>
