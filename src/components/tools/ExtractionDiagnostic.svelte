<script>
  import { slide, fade } from 'svelte/transition';

  // ========== State ==========
  let method = $state('v60');
  let flavorPos = $state(50);
  let bodyPos = $state(50);
  let showDeepDive = $state(false);

  // ========== Constants ==========
  const methods = [
    { id: 'v60', name: 'V60', icon: 'Pour Over' },
    { id: 'french_press', name: 'French Press', icon: 'Immersion' },
    { id: 'espresso', name: 'Espresso', icon: 'Pressure' },
    { id: 'aeropress', name: 'AeroPress', icon: 'Hybrid' },
    { id: 'chemex', name: 'Chemex', icon: 'Pour Over' },
    { id: 'cold_brew', name: 'Cold Brew', icon: 'Cold' },
    { id: 'moka_pot', name: 'Moka Pot', icon: 'Steam' },
  ];

  // Method-specific TDS ranges and EY sweet spots
  // Sources: COFFEE_KNOWLEDGE_SYNTHESIS.md Section 17 comparison table,
  // Rao (Espresso Extraction), Gagné (Physics of Filter Coffee)
  const methodConfig = {
    v60:          { tdsMin: 0.80, tdsMax: 1.80, eyLow: 19, eyHigh: 22 },  // Synthesis: 1.3-1.45% TDS, 19-21% EY
    french_press: { tdsMin: 0.80, tdsMax: 1.80, eyLow: 20, eyHigh: 22 },  // Synthesis: 1.4-1.6% TDS, 20-22% EY
    espresso:     { tdsMin: 4.00, tdsMax: 14.0, eyLow: 18, eyHigh: 22 },  // Rao: 10-13% TDS, 18-22% EY
    aeropress:    { tdsMin: 0.80, tdsMax: 2.00, eyLow: 19, eyHigh: 22 },  // Synthesis: 1.3-1.5% TDS, 19-22% EY
    chemex:       { tdsMin: 0.80, tdsMax: 1.60, eyLow: 18, eyHigh: 20 },  // Synthesis: 1.2-1.4% TDS, 18-20% EY
    cold_brew:    { tdsMin: 0.80, tdsMax: 5.00, eyLow: 17, eyHigh: 21 },  // Synthesis: 1.0-1.5% RTD / 3-5% conc, EY variable
    moka_pot:     { tdsMin: 2.00, tdsMax: 8.00, eyLow: 15, eyHigh: 19 },  // Synthesis: 3-6% TDS, 15-19% EY
  };

  // Zone descriptions
  const zoneData = {
    under_weak: {
      code: 'UNDEREXTRACTED_WEAK',
      label: 'Under-Extracted &amp; Weak',
      summary: 'Your coffee is sour and watery. Only fast-dissolving organic acids (citric, malic, phosphoric) have been extracted. The sweeter Maillard products haven&rsquo;t had time to develop, and low concentration means not enough solubles overall.',
      chemistry: 'During extraction, organic acids dissolve first (they&rsquo;re small, polar molecules). Sugars and Maillard reaction products come next, requiring more time, heat, or surface area. At low extraction yields (&lt;18%), the cup is acid-dominated. Low TDS compounds the problem &mdash; there simply aren&rsquo;t enough dissolved solids to give the coffee body or sweetness. The fix: increase both extraction (grind finer, more time/heat) and concentration (more coffee or less water).',
    },
    under_good: {
      code: 'UNDEREXTRACTED_BALANCED_BODY',
      label: 'Under-Extracted, Body OK',
      summary: 'Your coffee is sour but the body is right. Extraction is too low &mdash; acids dominate &mdash; but concentration is on target. Focus on extracting more without adding more water.',
      chemistry: 'Your ratio is correct (enough coffee per volume of water), but the water isn&rsquo;t dissolving enough of the good stuff. The acid-to-sugar balance is off. You need to increase contact time, grind finer, or raise temperature &mdash; all of which push extraction further along the dissolving curve without changing concentration.',
    },
    under_strong: {
      code: 'UNDEREXTRACTED_STRONG',
      label: 'Under-Extracted &amp; Strong',
      summary: 'Your coffee is sour but intense. High concentration of solubles, but predominantly acids. This often means fine grind with channeling &mdash; water bypassed much of the coffee bed.',
      chemistry: 'This is the classic channeling signature. A fine grind creates high resistance, but if the bed isn&rsquo;t uniform, water finds paths of least resistance. Some coffee is over-extracted (the channels) while most is under-extracted (the bypassed areas). The result: high TDS (from concentrated channel extraction) but sour flavor (most grounds barely touched). WDT (Weiss Distribution Technique) and even tamping/pouring are the primary fixes.',
    },
    good_weak: {
      code: 'GOOD_EXTRACTION_WEAK',
      label: 'Good Extraction, Too Dilute',
      summary: 'Your extraction balance is good, but the coffee is too dilute. You&rsquo;re pulling the right compounds but not enough of them. This is a ratio problem, not an extraction problem.',
      chemistry: 'Extraction yield (the percentage of coffee mass dissolved) is in the sweet spot, meaning you have the right balance of acids, sugars, and controlled bitters. But TDS (total dissolved solids) is too low &mdash; the cup tastes watery. This is purely a ratio fix: use more coffee per unit of water, or reduce your total water volume. Don&rsquo;t change grind size or time, as those affect extraction yield.',
    },
    good_good: {
      code: 'SWEET_SPOT',
      label: 'Sweet Spot',
      summary: 'Your coffee is in the sweet spot. The balance of organic acids, sugars, Maillard products, and controlled bitter compounds creates complexity and sweetness. This is the 18&ndash;22% extraction yield range where flavor quality peaks.',
      chemistry: 'At 18&ndash;22% extraction, you&rsquo;ve dissolved enough sugars and Maillard products to balance the initial acids, but haven&rsquo;t yet pulled significant quantities of CGA lactones or phenylindanes (the harsh bitter compounds). The SCA established this range through sensory panels &mdash; it&rsquo;s where trained tasters consistently rate coffee highest. Your TDS is also balanced, meaning the concentration amplifies flavor without muddying it.',
    },
    good_strong: {
      code: 'GOOD_EXTRACTION_STRONG',
      label: 'Good Extraction, Too Concentrated',
      summary: 'Your extraction balance is good, but the coffee is too concentrated. You&rsquo;re pulling the right compounds but at too high a concentration. This is a ratio problem.',
      chemistry: 'The extraction yield is correct (right balance of flavor compounds), but TDS is high. The cup may taste overwhelming, heavy, or cloying even though the flavor character is good. The fix is dilution: add bypass water after brewing, or use a higher water-to-coffee ratio next time. This is common in espresso when people prefer an americano-style drink.',
    },
    over_weak: {
      code: 'OVEREXTRACTED_WEAK',
      label: 'Over-Extracted &amp; Thin',
      summary: 'Your coffee is bitter and thin. Too much water dissolved bitter compounds (CGA lactones, phenylindanes) while diluting overall concentration.',
      chemistry: 'This is the worst of both worlds. High extraction yield means you&rsquo;ve pulled deep into the bitter compound range &mdash; chlorogenic acid lactones (astringent) and phenylindanes (harsh, lingering bitter). But the high water volume dilutes the cup, making it both bitter and watery. Common cause: too much water with too fine a grind. Grind coarser AND reduce water volume.',
    },
    over_good: {
      code: 'OVEREXTRACTED_BALANCED_BODY',
      label: 'Over-Extracted, Body OK',
      summary: 'Your coffee is bitter but the body is right. Concentration is on target, but you&rsquo;ve extracted too far into the bitter compounds. Pull back on extraction time or grind coarser.',
      chemistry: 'Your ratio is correct, but extraction has gone past the sweet spot. The additional dissolved compounds are predominantly CGA lactones and phenylindanes &mdash; large molecules that dissolve slowly but contribute harsh, drying bitterness. Grind coarser to reduce surface area, lower temperature to slow dissolution kinetics, or reduce brew time. All three reduce extraction yield without changing concentration.',
    },
    over_strong: {
      code: 'OVEREXTRACTED_STRONG',
      label: 'Over-Extracted &amp; Heavy',
      summary: 'Your coffee is bitter, harsh, and heavy. Maximum extraction of bitter compounds at high concentration. CGA lactones and phenylindanes dominate &mdash; the &ldquo;burnt tire&rdquo; zone.',
      chemistry: 'This is maximum extraction at maximum concentration. Every class of soluble has been pulled &mdash; acids, sugars, Maillard products, CGA lactones, phenylindanes, and even some cellulose breakdown products. The cup is harsh, astringent, and unpleasantly heavy. Multiple variables need adjustment: coarser grind (biggest lever), lower temperature, shorter time, and possibly less coffee or more water.',
    },
  };

  // Method-specific fixes
  const fixData = {
    v60: {
      under_weak: [
        'Grind finer (1&ndash;2 steps on your grinder)',
        'Raise water temperature to 96&ndash;98&deg;C',
        'Slow your pour rate &mdash; extend total brew to 3:00&ndash;3:30',
        'Extend bloom to 45 seconds with gentle swirl',
      ],
      under_good: [
        'Grind finer (1 step) to increase extraction',
        'Raise temperature to 96&deg;C',
        'Add a gentle stir after the bloom',
        'Slow your pour &mdash; aim for 3:00+ total',
      ],
      under_strong: [
        'Fix channeling: use WDT (Weiss Distribution Technique) for bed uniformity',
        'Grind slightly coarser (channeling = effective grind too fine)',
        'Pour more evenly in concentric circles',
        'Excavate center after drawdown &mdash; if there&rsquo;s a divot, water is channeling through the middle',
      ],
      good_weak: [
        'Increase dose by 1&ndash;2g (keep grind the same)',
        'Reduce total water volume by 20&ndash;30mL',
        'Use a tighter ratio: try 1:15 instead of 1:16.5',
      ],
      good_good: [],
      good_strong: [
        'Add bypass water after brewing (dilute to taste)',
        'Use a wider ratio: try 1:17 instead of 1:15',
        'Reduce dose by 1g',
      ],
      over_weak: [
        'Grind coarser (2 steps)',
        'Pour faster &mdash; aim for 2:30 total brew time',
        'Reduce water temperature to 90&ndash;93&deg;C',
        'Reduce total water volume',
      ],
      over_good: [
        'Grind coarser (1&ndash;2 steps)',
        'Lower temperature to 91&ndash;93&deg;C',
        'Pour faster to reduce contact time',
        'Shorten bloom to 30 seconds',
      ],
      over_strong: [
        'Grind coarser (biggest lever &mdash; 2&ndash;3 steps)',
        'Lower temperature to 90&ndash;92&deg;C',
        'Reduce total brew time to under 2:30',
        'Reduce dose or increase water ratio',
      ],
    },
    french_press: {
      under_weak: [
        'Grind finer (medium-coarse, not coarse)',
        'Steep longer: 5&ndash;6 minutes instead of 4',
        'Raise water temperature (off-boil, 96&deg;C+)',
        'Add gentle agitation at 1 minute',
      ],
      under_good: [
        'Grind finer (1 step toward medium)',
        'Steep 30&ndash;60 seconds longer',
        'Stir gently at the 1-minute mark',
      ],
      under_strong: [
        'Grind slightly coarser (reduce fines clogging the filter)',
        'Stir at 1 minute for even saturation',
        'Ensure all grounds are submerged during bloom',
      ],
      good_weak: [
        'Increase coffee dose (try 1:14 ratio)',
        'Reduce water volume by 30&ndash;50mL',
      ],
      good_good: [],
      good_strong: [
        'Add hot water after pressing (dilute to taste)',
        'Use a wider ratio: 1:16 or 1:17',
      ],
      over_weak: [
        'Grind coarser (true coarse)',
        'Reduce steep to 3&ndash;3:30',
        'Decant immediately after pressing',
      ],
      over_good: [
        'Reduce steep time to 3:30&ndash;4:00',
        'Grind coarser (1 step)',
        'Lower water temperature to 93&deg;C',
      ],
      over_strong: [
        'Grind coarser (coarse, visible particles)',
        'Reduce steep to 3&ndash;4 minutes',
        'Decant immediately &mdash; don&rsquo;t let it sit in the press',
        'Lower water temperature to 92&ndash;93&deg;C',
      ],
    },
    espresso: {
      under_weak: [
        'Grind finer (biggest adjustment &mdash; 1&ndash;2 steps)',
        'Increase dose by 0.5&ndash;1g',
        'Check for channeling &mdash; use WDT before tamping',
        'Raise brew temperature 2&ndash;3&deg;C',
      ],
      under_good: [
        'Fix channeling: WDT, level tamp, clean basket',
        'Pull longer (try 1:2.5 ratio instead of 1:2)',
        'Grind finer (0.5&ndash;1 step)',
      ],
      under_strong: [
        'Fix channeling (WDT, level tamp) &mdash; this is the #1 cause',
        'Grind slightly coarser (paradoxically &mdash; reduce channels)',
        'Pull longer: 1:2.5 or 1:3 ratio',
        'Ensure even distribution before tamping',
      ],
      good_weak: [
        'Increase dose by 0.5&ndash;1g',
        'Pull a shorter ratio: 1:1.5 instead of 1:2',
        'Consider a smaller basket if dose is already high',
      ],
      good_good: [],
      good_strong: [
        'Pull longer: try 1:2.5 or 1:3',
        'Add hot water (americano-style) to dilute',
        'Reduce dose by 0.5g',
      ],
      over_weak: [
        'Stop the shot earlier (cut 3&ndash;5 seconds)',
        'Grind coarser 1&ndash;2 steps',
        'Lower brew temperature 2&ndash;3&deg;C',
      ],
      over_good: [
        'Grind coarser (1 step)',
        'Lower temperature 2&ndash;3&deg;C',
        'Stop shot 2&ndash;3 seconds earlier',
      ],
      over_strong: [
        'Grind coarser (1&ndash;2 steps)',
        'Lower temperature to 90&ndash;92&deg;C',
        'Reduce dose by 0.5&ndash;1g',
        'Stop the shot earlier &mdash; aim for 25&ndash;28 seconds',
      ],
    },
    aeropress: {
      under_weak: [
        'Grind finer (medium-fine)',
        'Increase steep time to 2&ndash;3 minutes',
        'Raise water temperature to 95&ndash;98&deg;C',
        'Stir at 30 seconds for even saturation',
      ],
      under_good: [
        'Grind finer (1 step)',
        'Add 30 seconds to steep time',
        'Stir more aggressively at 30s',
      ],
      under_strong: [
        'Use inverted method for full immersion',
        'Stir thoroughly to ensure all grounds are wet',
        'Grind slightly coarser to reduce channeling during press',
      ],
      good_weak: [
        'Increase dose by 1&ndash;2g',
        'Reduce water to 180&ndash;200mL',
        'Use a tighter ratio: 1:12 to 1:14',
      ],
      good_good: [],
      good_strong: [
        'Add bypass water after pressing',
        'Reduce dose by 1g or increase water',
        'Use a wider ratio: 1:16',
      ],
      over_weak: [
        'Grind coarser (medium)',
        'Reduce steep to 1:00&ndash;1:30',
        'Lower temperature to 88&ndash;92&deg;C',
      ],
      over_good: [
        'Reduce steep time by 30 seconds',
        'Grind coarser (1 step)',
        'Lower temperature to 90&deg;C',
      ],
      over_strong: [
        'Grind coarser (medium or medium-coarse)',
        'Reduce steep time to under 1:30',
        'Lower temperature to 88&ndash;90&deg;C',
        'Press gently &mdash; hard pressing extracts more',
      ],
    },
    chemex: {
      under_weak: [
        'Grind finer (thick filter needs finer than typical pour-over)',
        'Slow your pour rate significantly',
        'Aim for 4&ndash;5 minute total brew time',
        'Raise temperature to 96&ndash;98&deg;C',
      ],
      under_good: [
        'Grind finer (1&ndash;2 steps &mdash; Chemex filters are thick)',
        'Extend bloom to 45&ndash;60 seconds',
        'Slow pour rate &mdash; aim for 4:30+ total',
      ],
      under_strong: [
        'Check for channeling &mdash; stir after bloom',
        'Pour in slow, even circles',
        'Grind slightly coarser if bed looks muddy with channels',
      ],
      good_weak: [
        'Increase dose (try 1:14 or 1:15)',
        'Reduce total water volume',
      ],
      good_good: [],
      good_strong: [
        'Add bypass water after brewing',
        'Use a wider ratio: 1:17',
      ],
      over_weak: [
        'Grind coarser (the thick filter already slows drainage)',
        'Pour faster in larger pulses',
        'Lower temperature to 91&ndash;93&deg;C',
      ],
      over_good: [
        'Grind coarser (1&ndash;2 steps)',
        'Pour faster &mdash; reduce total time below 4:00',
        'Lower temperature to 92&deg;C',
      ],
      over_strong: [
        'Grind significantly coarser (thick filter traps fines)',
        'Pour faster &mdash; aim for under 3:30',
        'Lower temperature to 90&ndash;92&deg;C',
        'Reduce dose or increase water',
      ],
    },
    cold_brew: {
      under_weak: [
        'Grind finer (medium, not ultra-coarse)',
        'Steep 18&ndash;24 hours (many people cut too short)',
        'Use a tighter ratio: 1:5 coffee to water',
        'Agitate halfway through steeping',
      ],
      under_good: [
        'Extend steep time by 4&ndash;6 hours',
        'Grind finer (medium-coarse)',
        'Agitate at the halfway mark',
      ],
      under_strong: [
        'Stir thoroughly at start to ensure all grounds are saturated',
        'Grind slightly coarser (fines can clog the filter, causing uneven extraction)',
        'Steep longer: 20&ndash;24 hours',
      ],
      good_weak: [
        'Use a tighter ratio: 1:5 instead of 1:8',
        'Increase coffee dose by 20%',
      ],
      good_good: [],
      good_strong: [
        'Dilute with cold water or ice (this is a concentrate)',
        'Use a wider ratio: 1:8 to 1:10',
      ],
      over_weak: [
        'Reduce steep to 12&ndash;14 hours',
        'Grind coarser (coarse)',
        'Remove from fridge and filter sooner',
      ],
      over_good: [
        'Reduce steep time by 4&ndash;6 hours',
        'Grind coarser (1 step)',
      ],
      over_strong: [
        'Reduce steep to 12&ndash;14 hours',
        'Grind coarser (true coarse)',
        'Use a wider ratio: 1:8',
        'Don&rsquo;t agitate &mdash; let it steep passively',
      ],
    },
    moka_pot: {
      under_weak: [
        'Finer grind (between espresso and drip)',
        'Pre-heat water before adding to the base',
        'Fill the basket completely (don&rsquo;t half-fill)',
        'Use medium-low heat for slower, more even extraction',
      ],
      under_good: [
        'Grind finer (1 step toward espresso)',
        'Pre-heat water in the base chamber',
        'Ensure basket is full and level',
      ],
      under_strong: [
        'Distribute grounds evenly in basket',
        'Don&rsquo;t tamp (just level off)',
        'Pre-heat water to reduce time on heat',
      ],
      good_weak: [
        'Fill the basket fully &mdash; don&rsquo;t use a half dose',
        'Use less water in the base (fill to just below the valve)',
      ],
      good_good: [],
      good_strong: [
        'Add hot water after brewing (caff&egrave; americano style)',
        'Use slightly more water in the base',
      ],
      over_weak: [
        'Coarser grind (medium, not fine)',
        'Remove from heat as soon as you hear hissing',
        'Pre-heat water to reduce total heating time',
      ],
      over_good: [
        'Remove from heat earlier (before sputtering)',
        'Grind coarser (1 step)',
        'Run cold water on base to stop extraction',
      ],
      over_strong: [
        'Grind coarser (medium)',
        'Remove from heat before sputtering starts',
        'Pre-heat water (reduces time coffee spends on heat)',
        'Run cold water on the base immediately after removal',
      ],
    },
  };

  // ========== Derived State ==========
  // Zone thresholds shift based on method's EY sweet spot width/position
  let underThreshold = $derived(35 + (mc.eyLow - 18) * 2.5);
  let overThreshold = $derived(65 + (mc.eyHigh - 22) * 2.5);
  let extraction = $derived(flavorPos < underThreshold ? 'under' : flavorPos > overThreshold ? 'over' : 'good');
  let strength = $derived(bodyPos < 35 ? 'weak' : bodyPos > 65 ? 'strong' : 'good');
  let zone = $derived(`${extraction}_${strength}`);

  // Map flavorPos (0-100) -> EY% (14-26), with 50 -> 20%
  let estimatedEY = $derived.by(() => {
    if (flavorPos <= 50) return 14 + (flavorPos / 50) * 6;
    return 20 + ((flavorPos - 50) / 50) * 6;
  });

  // Map bodyPos (0-100) -> TDS% using method-specific ranges
  let mc = $derived(methodConfig[method]);
  let estimatedTDS = $derived.by(() => {
    const { tdsMin, tdsMax } = mc;
    const range = tdsMax - tdsMin;
    const mid = tdsMin + range * 0.45;
    if (bodyPos <= 50) return tdsMin + (bodyPos / 50) * (mid - tdsMin);
    return mid + ((bodyPos - 50) / 50) * (tdsMax - mid);
  });

  let eyLow = $derived(mc.eyLow);
  let eyHigh = $derived(mc.eyHigh);

  let diagnosis = $derived(zoneData[zone] || zoneData.good_good);
  let fixes = $derived((fixData[method] && fixData[method][zone]) || []);
  let isSweet = $derived(zone === 'good_good');

  // ========== SVG Geometry ==========
  // Matrix coordinates
  const MX = { left: 30, right: 270, top: 30, bottom: 270 };
  let matrixX = $derived(MX.left + (flavorPos / 100) * (MX.right - MX.left));
  let matrixY = $derived(MX.bottom - (bodyPos / 100) * (MX.bottom - MX.top));

  // Bell curve computation
  const BELL = { left: 50, right: 370, top: 15, bottom: 140, eyMin: 12, eyMax: 28 };
  const bellMu = 20;
  const bellSigma = 2.5;

  function bellX(ey) {
    return BELL.left + ((ey - BELL.eyMin) / (BELL.eyMax - BELL.eyMin)) * (BELL.right - BELL.left);
  }

  function gaussianY(ey) {
    const z = (ey - bellMu) / bellSigma;
    const pdf = Math.exp(-0.5 * z * z) / (bellSigma * Math.sqrt(2 * Math.PI));
    const maxPdf = 1 / (bellSigma * Math.sqrt(2 * Math.PI));
    const normalizedHeight = (pdf / maxPdf) * (BELL.bottom - BELL.top - 10);
    return BELL.bottom - normalizedHeight;
  }

  // Pre-compute bell curve path
  function buildBellPath() {
    let points = [];
    for (let ey = BELL.eyMin; ey <= BELL.eyMax; ey += 0.25) {
      points.push(`${bellX(ey).toFixed(1)},${gaussianY(ey).toFixed(1)}`);
    }
    return `M${points[0]} ` + points.slice(1).map(p => `L${p}`).join(' ');
  }

  function buildFillPath(eyStart, eyEnd) {
    let points = [];
    for (let ey = eyStart; ey <= eyEnd; ey += 0.25) {
      points.push(`${bellX(ey).toFixed(1)},${gaussianY(ey).toFixed(1)}`);
    }
    const baseline = BELL.bottom;
    return `M${bellX(eyStart).toFixed(1)},${baseline} ` +
      points.map(p => `L${p}`).join(' ') +
      ` L${bellX(eyEnd).toFixed(1)},${baseline} Z`;
  }

  const bellCurvePath = buildBellPath();
  let underFillPath = $derived(buildFillPath(12, eyLow));
  let sweetFillPath = $derived(buildFillPath(eyLow, eyHigh));
  let overFillPath = $derived(buildFillPath(eyHigh, 28));

  // Bell curve marker position
  let curveMarkerX = $derived(bellX(estimatedEY));
  let curveMarkerY = $derived(gaussianY(estimatedEY));

  // X-axis labels for bell curve
  const bellTicks = [14, 16, 18, 20, 22, 24, 26];

  // Stages bar position
  let stagesMarkerX = $derived(20 + (flavorPos / 100) * 360);
</script>

<div class="extraction-diagnostic">
  <!-- Method Selection -->
  <div class="section">
    <span class="section-label">Brew Method</span>
    <div class="method-pills">
      {#each methods as m}
        <button
          class="method-pill"
          class:active={method === m.id}
          onclick={() => method = m.id}
        >
          <span class="pill-name">{m.name}</span>
          <span class="pill-type">{m.icon}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Sliders -->
  <div class="section">
    <div class="slider-group">
      <div class="slider-header">
        <span class="section-label">Flavor</span>
        <span class="slider-value">{estimatedEY.toFixed(1)}% EY</span>
      </div>
      <div class="slider-track-wrap">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={flavorPos}
          class="range-input"
          aria-label="Flavor: Sour to Bitter"
        />
        <div class="slider-labels">
          <span class="slider-label-left">Sour</span>
          <span class="slider-label-center">Balanced</span>
          <span class="slider-label-right">Bitter</span>
        </div>
      </div>
    </div>

    <div class="slider-group">
      <div class="slider-header">
        <span class="section-label">Body</span>
        <span class="slider-value">{estimatedTDS.toFixed(2)}% TDS</span>
      </div>
      <div class="slider-track-wrap">
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          bind:value={bodyPos}
          class="range-input"
          aria-label="Body: Thin to Heavy"
        />
        <div class="slider-labels">
          <span class="slider-label-left">Thin / Watery</span>
          <span class="slider-label-center">Balanced</span>
          <span class="slider-label-right">Heavy / Muddy</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Visualizations + Diagnosis -->
  <div class="viz-diagnosis-grid">
    <!-- Visualizations Column -->
    <div class="viz-column">
      <!-- Extraction Matrix -->
      <div class="viz-card matrix-card">
        <!-- Matrix header labels -->
        <div class="matrix-header-labels">
          <span class="matrix-descriptor">Flavor: <span class="desc-range">Sour &larr;&rarr; Bitter</span></span>
          <span class="matrix-descriptor">Body: <span class="desc-range">Thin &larr;&rarr; Heavy</span></span>
        </div>
        <svg viewBox="0 0 300 320" class="viz-svg" role="img" aria-label="2x2 extraction matrix showing extraction vs strength">
          <defs>
            <filter id="crosshair-blur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="scan-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="noise" />
              <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
              <feComponentTransfer in="mono" result="alpha">
                <feFuncA type="linear" slope="0.03" />
              </feComponentTransfer>
              <feBlend in="SourceGraphic" in2="alpha" mode="screen" />
            </filter>
          </defs>

          <!-- Outer frame with corner brackets (oscilloscope aesthetic) -->
          <rect x={MX.left - 4} y={MX.top - 4} width={MX.right - MX.left + 8} height={MX.bottom - MX.top + 8} fill="none" stroke="rgba(210,125,45,0.08)" stroke-width="0.5" />

          <!-- Corner brackets -->
          <polyline points="{MX.left - 4},{MX.top + 16} {MX.left - 4},{MX.top - 4} {MX.left + 16},{MX.top - 4}" class="corner-bracket" />
          <polyline points="{MX.right - 12},{MX.top - 4} {MX.right + 4},{MX.top - 4} {MX.right + 4},{MX.top + 16}" class="corner-bracket" />
          <polyline points="{MX.left - 4},{MX.bottom - 12} {MX.left - 4},{MX.bottom + 4} {MX.left + 16},{MX.bottom + 4}" class="corner-bracket" />
          <polyline points="{MX.right - 12},{MX.bottom + 4} {MX.right + 4},{MX.bottom + 4} {MX.right + 4},{MX.bottom - 12}" class="corner-bracket" />

          <!-- Background with scanline effect -->
          <rect x={MX.left} y={MX.top} width={MX.right - MX.left} height={MX.bottom - MX.top} class="matrix-bg" filter="url(#scan-noise)" />

          <!-- Subtle grid lines (5x5) -->
          {#each [1, 2, 3, 4] as i}
            <line x1={MX.left + (MX.right - MX.left) * i / 5} y1={MX.top} x2={MX.left + (MX.right - MX.left) * i / 5} y2={MX.bottom} class="matrix-subgrid" />
            <line x1={MX.left} y1={MX.top + (MX.bottom - MX.top) * i / 5} x2={MX.right} y2={MX.top + (MX.bottom - MX.top) * i / 5} class="matrix-subgrid" />
          {/each}

          <!-- Center grid lines (zone dividers) -->
          <line x1={150} y1={MX.top} x2={150} y2={MX.bottom} class="matrix-grid" />
          <line x1={MX.left} y1={150} x2={MX.right} y2={150} class="matrix-grid" />

          <!-- Sweet spot glow -->
          <circle cx={150} cy={150} r={42} class="sweet-glow" />

          <!-- Quadrant labels -->
          <text x={90} y={80} class="quadrant-label">Sour &amp;</text>
          <text x={90} y={93} class="quadrant-label">Strong</text>
          <text x={210} y={80} class="quadrant-label">Bitter &amp;</text>
          <text x={210} y={93} class="quadrant-label">Strong</text>
          <text x={90} y={230} class="quadrant-label">Sour &amp;</text>
          <text x={90} y={243} class="quadrant-label">Watery</text>
          <text x={210} y={230} class="quadrant-label">Bitter &amp;</text>
          <text x={210} y={243} class="quadrant-label">Muddy</text>

          <!-- Sweet spot label -->
          <text x={150} y={144} class="sweet-label">Sweet</text>
          <text x={150} y={158} class="sweet-label">Spot</text>

          <!-- Crosshair lines -->
          <line x1={matrixX} y1={MX.top} x2={matrixX} y2={MX.bottom} class="crosshair-line" />
          <line x1={MX.left} y1={matrixY} x2={MX.right} y2={matrixY} class="crosshair-line" />

          <!-- Crosshair dot with pulse -->
          <circle cx={matrixX} cy={matrixY} r={12} class="crosshair-pulse" filter="url(#crosshair-blur)" />
          <circle cx={matrixX} cy={matrixY} r={8} class="crosshair-glow" />
          <circle cx={matrixX} cy={matrixY} r={5} class="crosshair-dot" />
          <circle cx={matrixX} cy={matrixY} r={2} class="crosshair-center" />

          <!-- Axis labels -->
          <text x={MX.left} y={MX.bottom + 18} class="axis-end-label" text-anchor="start">Under</text>
          <text x={MX.right} y={MX.bottom + 18} class="axis-end-label" text-anchor="end">Over</text>
          <text x={15} y={150} class="axis-label-y" transform="rotate(-90, 15, 150)">Weak &rarr; Strong</text>

          <!-- EY/TDS readout -->
          <rect x={MX.left} y={290} width={MX.right - MX.left} height={22} rx="3" class="readout-bg" />
          <text x={150} y={305} class="readout-text">
            Reading: {estimatedEY.toFixed(1)}% EY &middot; {estimatedTDS.toFixed(2)}% TDS
          </text>
        </svg>
      </div>

      <!-- Bell Curve -->
      <div class="viz-card">
        <span class="viz-label">Extraction Yield Curve</span>
        <svg viewBox="0 0 400 180" class="viz-svg" role="img" aria-label="Bell curve showing flavor quality vs extraction yield percentage">
          <defs>
            <linearGradient id="sweet-zone-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#D27D2D" stop-opacity="0.08" />
            </linearGradient>
            <linearGradient id="under-zone-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#D27D2D" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#D27D2D" stop-opacity="0.03" />
            </linearGradient>
            <linearGradient id="over-zone-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#9F1239" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#9F1239" stop-opacity="0.03" />
            </linearGradient>
            <linearGradient id="bell-stroke-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#D27D2D" />
              <stop offset="35%" stop-color="#D27D2D" />
              <stop offset="50%" stop-color="#F59E0B" />
              <stop offset="65%" stop-color="#D27D2D" />
              <stop offset="100%" stop-color="#9F1239" />
            </linearGradient>
          </defs>

          <!-- Zone fills with gradients -->
          <path d={underFillPath} fill="url(#under-zone-grad)" />
          <path d={sweetFillPath} fill="url(#sweet-zone-grad)" />
          <path d={overFillPath} fill="url(#over-zone-grad)" />

          <!-- Sweet spot bracket -->
          <rect x={bellX(eyLow)} y={BELL.top - 2} width={bellX(eyHigh) - bellX(eyLow)} height={4} rx="2" fill="#F59E0B" opacity="0.3" />

          <!-- Curve with warm gradient stroke -->
          <path d={bellCurvePath} stroke="url(#bell-stroke-grad)" stroke-width="2" fill="none" />

          <!-- Threshold lines -->
          <line x1={bellX(eyLow)} y1={BELL.top} x2={bellX(eyLow)} y2={BELL.bottom} class="threshold-line" />
          <line x1={bellX(eyHigh)} y1={BELL.top} x2={bellX(eyHigh)} y2={BELL.bottom} class="threshold-line" />

          <!-- Sweet spot bracket labels -->
          <text x={bellX((eyLow + eyHigh) / 2)} y={BELL.top - 6} class="sweet-zone-header">{eyLow}&ndash;{eyHigh}%</text>

          <!-- Zone labels -->
          <text x={bellX((12 + eyLow) / 2)} y={BELL.bottom + 28} class="zone-label">Under</text>
          <text x={bellX((eyLow + eyHigh) / 2)} y={BELL.bottom + 28} class="zone-label zone-label-sweet">Sweet Spot</text>
          <text x={bellX((eyHigh + 28) / 2)} y={BELL.bottom + 28} class="zone-label">Over</text>

          <!-- X-axis ticks -->
          {#each bellTicks as tick}
            <line x1={bellX(tick)} y1={BELL.bottom} x2={bellX(tick)} y2={BELL.bottom + 5} class="tick-mark" />
            <text x={bellX(tick)} y={BELL.bottom + 15} class="tick-text">{tick}%</text>
          {/each}

          <!-- Baseline -->
          <line x1={BELL.left} y1={BELL.bottom} x2={BELL.right} y2={BELL.bottom} class="baseline" />

          <!-- Animated marker -->
          <circle cx={curveMarkerX} cy={curveMarkerY} r={10} class="curve-marker-pulse" />
          <circle cx={curveMarkerX} cy={curveMarkerY} r={7} class="curve-marker-glow" />
          <circle cx={curveMarkerX} cy={curveMarkerY} r={4.5} class="curve-marker" />

          <!-- Vertical drop line from marker to baseline -->
          <line x1={curveMarkerX} y1={curveMarkerY + 7} x2={curveMarkerX} y2={BELL.bottom} class="marker-drop-line" />

          <!-- Y-axis label -->
          <text x={BELL.left - 10} y={(BELL.top + BELL.bottom) / 2} class="bell-y-label" transform="rotate(-90, {BELL.left - 10}, {(BELL.top + BELL.bottom) / 2})">Flavor Quality</text>
        </svg>
      </div>

      <!-- Extraction Stages Bar -->
      <div class="viz-card">
        <span class="viz-label">Extraction Stages</span>
        <svg viewBox="0 0 400 70" class="viz-svg" role="img" aria-label="Horizontal bar showing acids, sugars, and bitter compounds extraction stages">
          <defs>
            <linearGradient id="acid-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#D27D2D" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#D27D2D" stop-opacity="0.9" />
            </linearGradient>
            <linearGradient id="sugar-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.95" />
            </linearGradient>
            <linearGradient id="bitter-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#9F1239" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#9F1239" stop-opacity="0.9" />
            </linearGradient>
            <clipPath id="bar-clip">
              <rect x="20" y="10" width="360" height="24" rx="12" />
            </clipPath>
          </defs>

          <!-- Background bar -->
          <rect x="20" y="10" width="360" height="24" rx="12" fill="#0D1117" stroke="rgba(210,125,45,0.15)" stroke-width="0.5" />

          <!-- Segments (clipped to rounded bar) -->
          <g clip-path="url(#bar-clip)">
            <rect x="20" y="10" width="144" height="24" fill="url(#acid-grad)" />
            <rect x="164" y="10" width="108" height="24" fill="url(#sugar-grad)" />
            <rect x="272" y="10" width="108" height="24" fill="url(#bitter-grad)" />
          </g>

          <!-- Segment labels -->
          <text x="92" y="26" class="stage-label">Acids</text>
          <text x="218" y="26" class="stage-label">Sugars</text>
          <text x="326" y="26" class="stage-label">Bitters</text>

          <!-- Position indicator -->
          <line x1={stagesMarkerX} y1="4" x2={stagesMarkerX} y2="40" class="stage-indicator" />
          <polygon points="{stagesMarkerX - 5},4 {stagesMarkerX + 5},4 {stagesMarkerX},10" class="stage-triangle" />

          <!-- Sub-labels -->
          <text x="92" y="55" class="stage-sublabel">Citric &middot; Malic &middot; Phosphoric</text>
          <text x="218" y="55" class="stage-sublabel">Maillard &middot; Caramel</text>
          <text x="326" y="55" class="stage-sublabel">CGA &middot; Phenylindanes</text>
        </svg>
      </div>
    </div>

    <!-- Diagnosis Panel -->
    <div class="diagnosis-panel">
      <div class="diag-header">
        <span class="section-label">Diagnosis</span>
        <span class="diag-method-badge">{methods.find(m => m.id === method)?.name}</span>
      </div>

      <!-- Status Code -->
      <div class="diag-code-wrap" class:diag-sweet={isSweet}>
        <span class="diag-code-prefix">STATUS:</span>
        <span class="diag-code">{@html diagnosis.code}</span>
      </div>

      <!-- Summary -->
      <p class="diag-summary">{@html diagnosis.summary}</p>

      <!-- Readings -->
      <div class="diag-readings">
        <div class="reading">
          <span class="reading-label">Est. Extraction Yield</span>
          <span class="reading-value">{estimatedEY.toFixed(1)}%</span>
        </div>
        <div class="reading">
          <span class="reading-label">Est. TDS</span>
          <span class="reading-value">{estimatedTDS.toFixed(2)}%</span>
        </div>
        <div class="reading">
          <span class="reading-label">Extraction</span>
          <span class="reading-value reading-tag" class:reading-under={extraction === 'under'} class:reading-good={extraction === 'good'} class:reading-over={extraction === 'over'}>
            {extraction === 'under' ? 'Under' : extraction === 'over' ? 'Over' : 'Good'}
          </span>
        </div>
        <div class="reading">
          <span class="reading-label">Strength</span>
          <span class="reading-value reading-tag" class:reading-under={strength === 'weak'} class:reading-good={strength === 'good'} class:reading-over={strength === 'strong'}>
            {strength === 'weak' ? 'Weak' : strength === 'strong' ? 'Strong' : 'Good'}
          </span>
        </div>
      </div>

      <!-- Fixes -->
      {#if fixes.length > 0}
        <div class="fixes-section" transition:fade={{ duration: 200 }}>
          <span class="fixes-title">Ranked Fixes</span>
          <ol class="fixes-list">
            {#each fixes as fix, i}
              <li class="fix-item">
                <span class="fix-num">{i + 1}</span>
                <span class="fix-text">{@html fix}</span>
              </li>
            {/each}
          </ol>
        </div>
      {:else if isSweet}
        <div class="sweet-message" transition:fade={{ duration: 200 }}>
          <span class="sweet-icon">&#10003;</span>
          <div>
            <span class="sweet-title">No fixes needed</span>
            <p class="sweet-desc">Your brew is dialed in. Enjoy it. If you want to experiment, try a different origin or roast level &mdash; your technique is solid.</p>
          </div>
        </div>
      {/if}

      <!-- Deep Dive Accordion -->
      <div class="deep-dive-section">
        <button class="deep-dive-toggle" onclick={() => showDeepDive = !showDeepDive}>
          <span class="deep-dive-label">Deep Dive &mdash; Chemistry</span>
          <span class="deep-dive-arrow" class:open={showDeepDive}>&darr;</span>
        </button>
        {#if showDeepDive}
          <div class="deep-dive-content" transition:slide={{ duration: 300 }}>
            <p class="deep-dive-text">{@html diagnosis.chemistry}</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  /* ========== Layout ========== */
  .extraction-diagnostic {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .section-label {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #D27D2D;
    font-weight: 600;
  }

  /* ========== Method Pills ========== */
  .method-pills {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(210, 125, 45, 0.2) transparent;
  }
  .method-pills::-webkit-scrollbar {
    height: 4px;
  }
  .method-pills::-webkit-scrollbar-track {
    background: transparent;
  }
  .method-pills::-webkit-scrollbar-thumb {
    background: rgba(210, 125, 45, 0.2);
    border-radius: 2px;
  }

  .method-pill {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    padding: 0.6rem 1rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .method-pill:hover {
    border-color: rgba(210, 125, 45, 0.4);
    background: #21262D;
  }
  .method-pill.active {
    border-color: #D27D2D;
    background: rgba(210, 125, 45, 0.1);
  }
  .pill-name {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: #E2E8F0;
  }
  .method-pill.active .pill-name {
    color: #F59E0B;
  }
  .pill-type {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748B;
  }

  /* ========== Sliders ========== */
  .slider-group {
    margin-bottom: 1.25rem;
  }
  .slider-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .slider-value {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    color: #F59E0B;
    font-weight: 500;
  }
  .slider-track-wrap {
    position: relative;
  }
  .slider-labels {
    display: flex;
    justify-content: space-between;
    margin-top: 0.35rem;
  }
  .slider-label-left,
  .slider-label-center,
  .slider-label-right {
    font-size: 0.65rem;
    color: #64748B;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    letter-spacing: 0.05em;
  }
  .slider-label-center {
    color: #94A3B8;
  }

  /* Range input styling */
  .range-input {
    width: 100%;
    height: 6px;
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    outline: none;
  }
  .range-input::-webkit-slider-runnable-track {
    height: 6px;
    background: linear-gradient(90deg, #D27D2D 0%, #F59E0B 50%, #9F1239 100%);
    border-radius: 3px;
    border: 1px solid rgba(210, 125, 45, 0.2);
  }
  .range-input::-moz-range-track {
    height: 6px;
    background: linear-gradient(90deg, #D27D2D 0%, #F59E0B 50%, #9F1239 100%);
    border-radius: 3px;
    border: 1px solid rgba(210, 125, 45, 0.2);
  }
  .range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #F59E0B;
    border: 2px solid #0B0E14;
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
    margin-top: -8px;
    cursor: grab;
    transition: box-shadow 0.2s;
  }
  .range-input::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #F59E0B;
    border: 2px solid #0B0E14;
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
    cursor: grab;
    transition: box-shadow 0.2s;
  }
  .range-input:active::-webkit-slider-thumb {
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.7);
    cursor: grabbing;
  }
  .range-input:active::-moz-range-thumb {
    box-shadow: 0 0 16px rgba(245, 158, 11, 0.7);
    cursor: grabbing;
  }

  /* ========== Visualization + Diagnosis Grid ========== */
  .viz-diagnosis-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
  }
  @media (max-width: 768px) {
    .viz-diagnosis-grid {
      grid-template-columns: 1fr;
    }
  }

  .viz-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .viz-card {
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 6px;
    padding: 0.75rem;
  }
  .viz-label {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #94A3B8;
    margin-bottom: 0.5rem;
  }
  .viz-svg {
    width: 100%;
    height: auto;
    display: block;
  }

  /* ========== Matrix Card ========== */
  .matrix-card {
    position: relative;
  }
  .matrix-header-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0 0.25rem;
  }
  .matrix-descriptor {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748B;
  }
  .desc-range {
    color: #94A3B8;
  }

  /* ========== Matrix SVG ========== */
  .matrix-bg {
    fill: #0D1117;
    rx: 2;
  }
  .matrix-subgrid {
    stroke: rgba(210, 125, 45, 0.04);
    stroke-width: 0.5;
  }
  .matrix-grid {
    stroke: rgba(210, 125, 45, 0.15);
    stroke-width: 0.75;
    stroke-dasharray: 4 3;
  }
  .corner-bracket {
    fill: none;
    stroke: #D27D2D;
    stroke-width: 1.5;
    stroke-linecap: round;
    opacity: 0.5;
  }
  .sweet-glow {
    fill: rgba(245, 158, 11, 0.06);
    stroke: rgba(245, 158, 11, 0.15);
    stroke-width: 0.75;
    stroke-dasharray: 3 3;
  }
  .quadrant-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7.5px;
    fill: #475569;
    text-anchor: middle;
  }
  .sweet-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 8px;
    fill: rgba(245, 158, 11, 0.3);
    text-anchor: middle;
  }
  .crosshair-line {
    stroke: rgba(210, 125, 45, 0.35);
    stroke-width: 0.75;
    stroke-dasharray: 3 3;
    transition: all 0.3s ease-out;
  }
  .crosshair-pulse {
    fill: rgba(245, 158, 11, 0.25);
    transition: all 0.3s ease-out;
    animation: pulse 2s ease-in-out infinite;
  }
  .crosshair-glow {
    fill: rgba(245, 158, 11, 0.2);
    transition: all 0.3s ease-out;
  }
  .crosshair-dot {
    fill: #D27D2D;
    stroke: #F59E0B;
    stroke-width: 1.5;
    transition: all 0.3s ease-out;
  }
  .crosshair-center {
    fill: #FCD34D;
    transition: all 0.3s ease-out;
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.2; r: 12; }
    50% { opacity: 0.5; r: 16; }
  }
  .axis-end-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6.5px;
    fill: #475569;
    text-anchor: start;
  }
  .axis-label-y {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #64748B;
    text-anchor: middle;
  }
  .readout-bg {
    fill: #0B0E14;
    stroke: rgba(210, 125, 45, 0.2);
    stroke-width: 0.5;
  }
  .readout-text {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 8px;
    fill: #F59E0B;
    text-anchor: middle;
    letter-spacing: 0.05em;
  }

  /* ========== Bell Curve SVG ========== */
  .sweet-zone-header {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #F59E0B;
    text-anchor: middle;
    opacity: 0.6;
  }
  .threshold-line {
    stroke: rgba(245, 158, 11, 0.25);
    stroke-width: 0.75;
    stroke-dasharray: 4 3;
  }
  .zone-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #64748B;
    text-anchor: middle;
  }
  .zone-label-sweet {
    fill: #F59E0B;
  }
  .tick-mark {
    stroke: #475569;
    stroke-width: 0.5;
  }
  .tick-text {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6.5px;
    fill: #64748B;
    text-anchor: middle;
  }
  .baseline {
    stroke: rgba(210, 125, 45, 0.2);
    stroke-width: 0.75;
  }
  .curve-marker-pulse {
    fill: rgba(245, 158, 11, 0.15);
    animation: pulse 2s ease-in-out infinite;
    transition: all 0.3s ease-out;
  }
  .curve-marker-glow {
    fill: rgba(245, 158, 11, 0.25);
    transition: all 0.3s ease-out;
  }
  .curve-marker {
    fill: #F59E0B;
    stroke: #0B0E14;
    stroke-width: 1.5;
    transition: all 0.3s ease-out;
  }
  .marker-drop-line {
    stroke: rgba(245, 158, 11, 0.2);
    stroke-width: 0.5;
    stroke-dasharray: 2 2;
    transition: all 0.3s ease-out;
  }
  .bell-y-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #64748B;
    text-anchor: middle;
  }

  /* ========== Stages Bar SVG ========== */
  .stage-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7.5px;
    fill: #E2E8F0;
    text-anchor: middle;
    opacity: 0.8;
  }
  .stage-indicator {
    stroke: #F59E0B;
    stroke-width: 1.5;
    transition: all 0.3s ease-out;
  }
  .stage-triangle {
    fill: #F59E0B;
    transition: all 0.3s ease-out;
  }
  .stage-sublabel {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 5px;
    fill: #475569;
    text-anchor: middle;
  }

  /* ========== Diagnosis Panel ========== */
  .diagnosis-panel {
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 6px;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .diag-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .diag-method-badge {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94A3B8;
    background: rgba(210, 125, 45, 0.08);
    border: 1px solid rgba(210, 125, 45, 0.15);
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
  }

  .diag-code-wrap {
    background: #0B0E14;
    border: 1px solid rgba(210, 125, 45, 0.2);
    border-radius: 4px;
    padding: 0.6rem 0.75rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.75rem;
    transition: border-color 0.3s;
  }
  .diag-code-wrap.diag-sweet {
    border-color: rgba(245, 158, 11, 0.4);
  }
  .diag-code-prefix {
    color: #64748B;
    margin-right: 0.5rem;
  }
  .diag-code {
    color: #F59E0B;
    font-weight: 600;
  }
  .diag-sweet .diag-code {
    color: #34D399;
  }

  .diag-summary {
    font-size: 0.8rem;
    color: #94A3B8;
    line-height: 1.6;
  }

  /* ========== Readings ========== */
  .diag-readings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .reading {
    background: #0B0E14;
    border: 1px solid rgba(210, 125, 45, 0.1);
    border-radius: 4px;
    padding: 0.5rem 0.6rem;
  }
  .reading-label {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748B;
    margin-bottom: 0.2rem;
  }
  .reading-value {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.85rem;
    font-weight: 600;
    color: #E2E8F0;
  }
  .reading-tag {
    font-size: 0.7rem;
    padding: 0.1rem 0.35rem;
    border-radius: 3px;
  }
  .reading-under {
    color: #D27D2D;
    background: rgba(210, 125, 45, 0.1);
  }
  .reading-good {
    color: #34D399;
    background: rgba(52, 211, 153, 0.1);
  }
  .reading-over {
    color: #F87171;
    background: rgba(248, 113, 113, 0.1);
  }

  /* ========== Fixes ========== */
  .fixes-section {
    border-top: 1px solid rgba(210, 125, 45, 0.1);
    padding-top: 0.75rem;
  }
  .fixes-title {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #D27D2D;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  .fixes-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .fix-item {
    display: flex;
    gap: 0.6rem;
    align-items: flex-start;
  }
  .fix-num {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    color: #D27D2D;
    border: 1px solid rgba(210, 125, 45, 0.3);
    border-radius: 50%;
  }
  .fix-text {
    font-size: 0.78rem;
    color: #94A3B8;
    line-height: 1.5;
  }

  /* ========== Sweet Spot Message ========== */
  .sweet-message {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 1rem;
    background: rgba(52, 211, 153, 0.05);
    border: 1px solid rgba(52, 211, 153, 0.2);
    border-radius: 6px;
  }
  .sweet-icon {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    color: #34D399;
    border: 1px solid rgba(52, 211, 153, 0.3);
    border-radius: 50%;
  }
  .sweet-title {
    display: block;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    font-weight: 600;
    color: #34D399;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.25rem;
  }
  .sweet-desc {
    font-size: 0.78rem;
    color: #94A3B8;
    line-height: 1.5;
    margin: 0;
  }

  /* ========== Deep Dive Accordion ========== */
  .deep-dive-section {
    border-top: 1px solid rgba(210, 125, 45, 0.1);
    padding-top: 0.5rem;
  }
  .deep-dive-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }
  .deep-dive-toggle:hover .deep-dive-label {
    color: #E2E8F0;
  }
  .deep-dive-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #94A3B8;
    transition: color 0.2s;
  }
  .deep-dive-arrow {
    font-size: 0.75rem;
    color: #D27D2D;
    transition: transform 0.3s ease-out;
    display: inline-block;
  }
  .deep-dive-arrow.open {
    transform: rotate(180deg);
  }
  .deep-dive-content {
    padding: 0.5rem 0;
  }
  .deep-dive-text {
    font-size: 0.78rem;
    color: #94A3B8;
    line-height: 1.7;
    margin: 0;
  }
</style>
