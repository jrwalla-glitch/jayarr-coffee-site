<script>
  import { slide, fade } from 'svelte/transition';

  // ========== State ==========
  let grinderId = $state('comandante');
  let method = $state('v60');
  let roast = $state('medium');
  let processing = $state('washed');

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

  const roastLevels = [
    { id: 'light', name: 'Light', color: '#C4A882', darkColor: '#A08060' },
    { id: 'medium_light', name: 'Med-Light', color: '#A07850', darkColor: '#8A6540' },
    { id: 'medium', name: 'Medium', color: '#7A5230', darkColor: '#6A4525' },
    { id: 'medium_dark', name: 'Med-Dark', color: '#5A3518', darkColor: '#4A2A12' },
    { id: 'dark', name: 'Dark', color: '#3A1E0A', darkColor: '#2A1505' },
  ];

  const processingMethods = [
    { id: 'washed', name: 'Washed' },
    { id: 'honey', name: 'Honey' },
    { id: 'natural', name: 'Natural' },
  ];

  const recipes = {
    v60:          { dose: 15, water: 250, ratio: '1:16.7', temp: '96', time: '3:00' },
    french_press: { dose: 30, water: 500, ratio: '1:16.7', temp: '96', time: '4:00' },
    espresso:     { dose: 18, water: 36,  ratio: '1:2',    temp: '93', time: '0:28' },
    aeropress:    { dose: 15, water: 200, ratio: '1:13.3', temp: '93', time: '2:00' },
    chemex:       { dose: 30, water: 500, ratio: '1:16.7', temp: '96', time: '4:30' },
    cold_brew:    { dose: 60, water: 420, ratio: '1:7',    temp: '20', time: '18:00:00' },
    moka_pot:     { dose: 15, water: 200, ratio: '1:13.3', temp: 'N/A', time: '~4:00' },
  };

  // Temperature adjustments by roast
  const tempAdjust = {
    light: '+2',
    medium_light: '+1',
    medium: '0',
    medium_dark: '-2',
    dark: '-4',
  };

  // ========== Grinder Database ==========
  const grinders = [
    {
      id: 'comandante',
      name: 'Comandante C40 MK4',
      type: 'Hand Grinder',
      burrs: 'Nitro Blade 39mm conical',
      steps: 'Stepped (~30\u00B5m/click)',
      unit: 'clicks',
      unitLabel: 'clicks',
      quirk: 'Red Clix aftermarket axle doubles click resolution from ~30\u00B5m to ~15\u00B5m per click. Essential for espresso precision.',
      confidence: { espresso: 'high', moka_pot: 'medium', aeropress: 'high', v60: 'high', chemex: 'medium', french_press: 'high', cold_brew: 'medium' },
      settings: {
        espresso:     { min: 10, max: 14, default: 12 },
        moka_pot:     { min: 14, max: 18, default: 16 },
        aeropress:    { min: 15, max: 24, default: 18 },
        v60:          { min: 22, max: 28, default: 25 },
        chemex:       { min: 26, max: 30, default: 28 },
        french_press: { min: 28, max: 34, default: 30 },
        cold_brew:    { min: 32, max: 38, default: 35 },
      }
    },
    {
      id: 'jxpro',
      name: '1Zpresso JX-Pro',
      type: 'Hand Grinder',
      burrs: '48mm stainless steel conical',
      steps: 'Stepped (12.5\u00B5m/click)',
      unit: 'clicks',
      unitLabel: 'clicks',
      quirk: 'Rotation notation system (e.g., 1.5.0 = 60 clicks). 40 clicks per rotation, 10 numbers, 4 ticks per number. Calibration can drift \u2014 re-zero occasionally.',
      confidence: { espresso: 'high', moka_pot: 'medium', aeropress: 'medium', v60: 'high', chemex: 'medium', french_press: 'high', cold_brew: 'medium' },
      settings: {
        espresso:     { min: 40, max: 80, default: 60 },
        moka_pot:     { min: 76, max: 120, default: 96 },
        aeropress:    { min: 68, max: 128, default: 96 },
        v60:          { min: 88, max: 128, default: 108 },
        chemex:       { min: 112, max: 144, default: 128 },
        french_press: { min: 144, max: 200, default: 168 },
        cold_brew:    { min: 168, max: 200, default: 180 },
      }
    },
    {
      id: 'encore',
      name: 'Baratza Encore',
      type: 'Electric Grinder',
      burrs: '40mm conical steel',
      steps: 'Stepped (40 settings, ~24\u00B5m/step)',
      unit: 'setting',
      unitLabel: 'setting (1\u201340)',
      quirk: 'Most popular entry-level grinder. Coarse step size (~24\u00B5m) limits espresso precision. The Encore ESP variant adds finer espresso steps.',
      confidence: { espresso: 'low', moka_pot: 'high', aeropress: 'high', v60: 'high', chemex: 'high', french_press: 'high', cold_brew: 'high' },
      settings: {
        espresso:     { min: 1, max: 5, default: 3 },
        moka_pot:     { min: 5, max: 12, default: 8 },
        aeropress:    { min: 8, max: 18, default: 12 },
        v60:          { min: 12, max: 18, default: 15 },
        chemex:       { min: 18, max: 24, default: 20 },
        french_press: { min: 24, max: 32, default: 28 },
        cold_brew:    { min: 30, max: 40, default: 35 },
      }
    },
    {
      id: 'ode',
      name: 'Fellow Ode Gen 2',
      type: 'Electric Grinder',
      burrs: '64mm flat (Gen 2 Brew Burrs)',
      steps: 'Stepped (1\u201311, ~80\u00B5m/step)',
      unit: 'setting',
      unitLabel: 'setting (1\u201311)',
      quirk: 'Intentionally limited to brew/filter methods. Cannot grind fine enough for espresso or Turkish. Grinder guide printed under the hopper lid.',
      confidence: { espresso: 'none', moka_pot: 'low', aeropress: 'high', v60: 'high', chemex: 'high', french_press: 'high', cold_brew: 'high' },
      settings: {
        espresso:     null,
        moka_pot:     { min: 1, max: 2, default: 1.5 },
        aeropress:    { min: 2, max: 5, default: 3 },
        v60:          { min: 2, max: 5, default: 3.5 },
        chemex:       { min: 3, max: 6, default: 4.5 },
        french_press: { min: 6, max: 9, default: 7 },
        cold_brew:    { min: 8, max: 11, default: 9 },
      }
    },
    {
      id: 'niche',
      name: 'Niche Zero',
      type: 'Electric Grinder',
      burrs: '63mm conical (Mazzer-designed)',
      steps: 'Stepless (dial 0\u201350+, ~20\u00B5m/number)',
      unit: 'dial #',
      unitLabel: 'dial number',
      quirk: 'Dial goes to 50 but can adjust coarser into unmarked zone. Calibration varies 5\u201310 points between units. Always calibrate from the chirp point.',
      confidence: { espresso: 'high', moka_pot: 'medium', aeropress: 'medium', v60: 'medium', chemex: 'medium', french_press: 'medium', cold_brew: 'low' },
      settings: {
        espresso:     { min: 8, max: 20, default: 15 },
        moka_pot:     { min: 18, max: 28, default: 22 },
        aeropress:    { min: 20, max: 40, default: 28 },
        v60:          { min: 30, max: 50, default: 40 },
        chemex:       { min: 35, max: 50, default: 45 },
        french_press: { min: 45, max: 60, default: 50 },
        cold_brew:    { min: 50, max: 65, default: 55 },
      }
    },
    {
      id: 'timemore_c2',
      name: 'Timemore C2',
      type: 'Hand Grinder',
      burrs: '38mm stainless steel conical',
      steps: 'Stepped (~25\u201330\u00B5m/click)',
      unit: 'clicks',
      unitLabel: 'clicks',
      quirk: 'Do NOT use below 6 clicks \u2014 can damage burrs. Narrow usable range (~30 clicks) limits precision. Budget-friendly but less consistent.',
      confidence: { espresso: 'low', moka_pot: 'medium', aeropress: 'medium', v60: 'medium', chemex: 'low', french_press: 'medium', cold_brew: 'medium' },
      settings: {
        espresso:     { min: 6, max: 10, default: 8 },
        moka_pot:     { min: 10, max: 15, default: 12 },
        aeropress:    { min: 11, max: 18, default: 14 },
        v60:          { min: 14, max: 20, default: 17 },
        chemex:       { min: 18, max: 24, default: 20 },
        french_press: { min: 22, max: 28, default: 24 },
        cold_brew:    { min: 26, max: 30, default: 28 },
      }
    },
    {
      id: 'timemore_c3',
      name: 'Timemore C3',
      type: 'Hand Grinder',
      burrs: '38mm S2C conical (upgraded)',
      steps: 'Stepped (finer resolution than C2)',
      unit: 'clicks',
      unitLabel: 'clicks',
      quirk: 'S2C burrs produce fewer fines and more uniform particles than C2. Same 6-click minimum to avoid burr damage. Chemex settings are extrapolated.',
      confidence: { espresso: 'low', moka_pot: 'medium', aeropress: 'medium', v60: 'medium', chemex: 'low', french_press: 'medium', cold_brew: 'medium' },
      settings: {
        espresso:     { min: 6, max: 9, default: 7 },
        moka_pot:     { min: 9, max: 13, default: 11 },
        aeropress:    { min: 10, max: 16, default: 13 },
        v60:          { min: 12, max: 17, default: 14 },
        chemex:       { min: 15, max: 20, default: 17 },
        french_press: { min: 18, max: 24, default: 20 },
        cold_brew:    { min: 22, max: 25, default: 23 },
      }
    },
    {
      id: 'virtuoso',
      name: 'Baratza Virtuoso+',
      type: 'Electric Grinder',
      burrs: '40mm conical steel',
      steps: 'Stepped (40 settings, ~25\u00B5m/step)',
      unit: 'setting',
      unitLabel: 'setting (1\u201340)',
      quirk: 'Same 40mm burrs as Encore but with better motor, digital timer, and build quality. Official Baratza starting points are identical to Encore.',
      confidence: { espresso: 'medium', moka_pot: 'high', aeropress: 'high', v60: 'high', chemex: 'high', french_press: 'high', cold_brew: 'high' },
      settings: {
        espresso:     { min: 1, max: 7, default: 5 },
        moka_pot:     { min: 7, max: 12, default: 10 },
        aeropress:    { min: 8, max: 16, default: 12 },
        v60:          { min: 12, max: 20, default: 15 },
        chemex:       { min: 16, max: 24, default: 20 },
        french_press: { min: 22, max: 32, default: 28 },
        cold_brew:    { min: 28, max: 40, default: 34 },
      }
    },
    {
      id: 'eureka',
      name: 'Eureka Mignon Specialita',
      type: 'Electric Grinder',
      burrs: '55mm flat steel',
      steps: 'Stepless (0\u20139 per rotation, multi-rotation)',
      unit: 'dial position',
      unitLabel: 'dial position',
      quirk: 'Designed primarily for espresso. Dial numbers are reference points only \u2014 they don\u2019t match between units. Always calibrate from the chirp point. Multi-rotation switching between espresso and filter is slow.',
      confidence: { espresso: 'medium', moka_pot: 'low', aeropress: 'low', v60: 'low', chemex: 'low', french_press: 'low', cold_brew: 'low' },
      settings: {
        espresso:     { min: 0, max: 3.5, default: 1.5 },
        moka_pot:     { min: 3.5, max: 13, default: 5 },
        aeropress:    { min: 2.5, max: 15, default: 7 },
        v60:          { min: 4.5, max: 14, default: 10 },
        chemex:       { min: 6, max: 16, default: 12 },
        french_press: { min: 14, max: 34, default: 20 },
        cold_brew:    { min: 20, max: 40, default: 30 },
      }
    },
    {
      id: 'df64',
      name: 'DF64',
      type: 'Electric Grinder',
      burrs: '64mm flat (stock Italmill)',
      steps: 'Stepless (dial 0\u201390, ~10\u00B5m/number)',
      unit: 'dial #',
      unitLabel: 'dial number (0\u201390)',
      quirk: 'Settings are for stock Italmill burrs only. Aftermarket SSP/DLC burrs shift all numbers significantly. Popular espresso-first single-dose grinder. Use bellows for retention management.',
      confidence: { espresso: 'medium', moka_pot: 'medium', aeropress: 'medium', v60: 'medium', chemex: 'low', french_press: 'medium', cold_brew: 'low' },
      settings: {
        espresso:     { min: 5, max: 25, default: 15 },
        moka_pot:     { min: 20, max: 35, default: 28 },
        aeropress:    { min: 25, max: 50, default: 35 },
        v60:          { min: 35, max: 55, default: 42 },
        chemex:       { min: 40, max: 60, default: 48 },
        french_press: { min: 55, max: 75, default: 65 },
        cold_brew:    { min: 70, max: 90, default: 80 },
      }
    },
    {
      id: 'kinu',
      name: 'Kinu M47',
      type: 'Hand Grinder',
      burrs: '47mm Black Fusion conical',
      steps: 'Stepless (~10\u00B5m/mark, 50 marks/rotation)',
      unit: 'rotations',
      unitLabel: 'rotations from zero',
      quirk: 'Despite being \u201Cstepless,\u201D the M47 Classic has tactile click detents as reference points (you can set between them). Exceptionally wide range (0\u20131400\u00B5m) handles Turkish to cold brew.',
      confidence: { espresso: 'medium', moka_pot: 'medium', aeropress: 'medium', v60: 'medium', chemex: 'low', french_press: 'medium', cold_brew: 'medium' },
      settings: {
        espresso:     { min: 0.8, max: 2.0, default: 1.2 },
        moka_pot:     { min: 1.8, max: 2.8, default: 2.2 },
        aeropress:    { min: 2.0, max: 3.5, default: 2.5 },
        v60:          { min: 3.0, max: 4.5, default: 3.5 },
        chemex:       { min: 3.5, max: 5.0, default: 4.0 },
        french_press: { min: 4.5, max: 6.5, default: 5.5 },
        cold_brew:    { min: 5.5, max: 8.0, default: 6.5 },
      }
    },
  ];

  // ========== Derived State ==========
  let grinder = $derived(grinders.find(g => g.id === grinderId));
  let methodSettings = $derived(grinder?.settings[method] ?? null);
  let isSupported = $derived(methodSettings !== null);
  let recipe = $derived(recipes[method]);
  let methodName = $derived(methods.find(m => m.id === method)?.name ?? '');

  // Roast index: -2 (light) to +2 (dark), 0 = medium
  let roastIndex = $derived.by(() => {
    const map = { light: -2, medium_light: -1, medium: 0, medium_dark: 1, dark: 2 };
    return map[roast] ?? 0;
  });

  // Processing offset: 0 (washed), 1 (honey), 2 (natural)
  let procOffset = $derived.by(() => {
    const map = { washed: 0, honey: 1, natural: 2 };
    return map[processing] ?? 0;
  });

  // Calculate adjusted grind setting
  let adjustedSetting = $derived.by(() => {
    if (!isSupported || !methodSettings) return null;
    const range = methodSettings.max - methodSettings.min;
    const base = methodSettings.default;

    // Roast adjustment: ~3.75% of range per step from medium
    const roastAdj = roastIndex * (range * 0.0375);

    // Processing adjustment: honey +2.5%, natural +5% coarser
    const procAdj = procOffset * (range * 0.025);

    let adjusted = base + roastAdj + procAdj;

    // Clamp to range
    adjusted = Math.max(methodSettings.min, Math.min(methodSettings.max, adjusted));

    // Round based on grinder step type
    if (grinder.id === 'kinu') {
      return Math.round(adjusted * 10) / 10; // 0.1 precision
    } else if (grinder.id === 'ode') {
      return Math.round(adjusted * 2) / 2; // 0.5 precision
    } else if (grinder.id === 'eureka') {
      return Math.round(adjusted * 2) / 2; // 0.5 precision
    } else {
      return Math.round(adjusted);
    }
  });

  // Display value for the setting
  let displaySetting = $derived.by(() => {
    if (adjustedSetting === null) return 'N/A';
    if (grinder.id === 'kinu') return adjustedSetting.toFixed(1);
    if (grinder.id === 'ode' || grinder.id === 'eureka') return adjustedSetting % 1 === 0 ? adjustedSetting.toString() : adjustedSetting.toFixed(1);
    return adjustedSetting.toString();
  });

  // Adjusted temperature
  let adjustedTemp = $derived.by(() => {
    if (recipe.temp === 'N/A') return 'N/A';
    const baseTemp = parseInt(recipe.temp, 10);
    const adj = parseInt(tempAdjust[roast], 10);
    return (baseTemp + adj).toString();
  });

  // Confidence for current selection
  let confidence = $derived.by(() => {
    if (!isSupported) return 'none';
    return grinder?.confidence[method] ?? 'medium';
  });

  // Solubility value (0-1) for roast display
  let solubility = $derived.by(() => {
    const map = { light: 0.2, medium_light: 0.38, medium: 0.55, medium_dark: 0.72, dark: 0.88 };
    return map[roast] ?? 0.5;
  });

  // Roast adjustment description
  let roastNote = $derived.by(() => {
    if (roast === 'medium') return 'Medium roast is the baseline \u2014 no grind adjustment applied.';
    if (roast === 'light') return 'Light roast: denser, less soluble beans. Grind finer to increase extraction.';
    if (roast === 'medium_light') return 'Medium-light roast: slightly denser than medium. Grind slightly finer.';
    if (roast === 'medium_dark') return 'Medium-dark roast: more porous, more soluble. Grind slightly coarser.';
    if (roast === 'dark') return 'Dark roast: very porous and brittle. Grind coarser to prevent over-extraction.';
    return '';
  });

  // Processing note
  let procNote = $derived.by(() => {
    if (processing === 'washed') return '';
    if (processing === 'honey') return 'Honey process: residual mucilage sugars increase solubility. Grind slightly coarser. Evidence: limited \u2014 treat as suggested.';
    if (processing === 'natural') return 'Natural process: most degraded cell structure, highest solubility. Grind coarser to avoid over-extraction. Evidence: directional only.';
    return '';
  });

  // SVG grinder range bar calculations
  const BAR = { left: 40, right: 380, top: 15, bottom: 40 };
  let barScale = $derived.by(() => {
    if (!isSupported || !methodSettings) return { min: 0, max: 1, pxPerUnit: 1 };
    const padding = (methodSettings.max - methodSettings.min) * 0.15;
    const min = methodSettings.min - padding;
    const max = methodSettings.max + padding;
    return { min, max, pxPerUnit: (BAR.right - BAR.left) / (max - min) };
  });

  function barX(val) {
    return BAR.left + (val - barScale.min) * barScale.pxPerUnit;
  }

  // Sweet spot zone calculations
  let sweetMin = $derived(methodSettings ? methodSettings.min + (methodSettings.max - methodSettings.min) * 0.3 : 0);
  let sweetMax = $derived(methodSettings ? methodSettings.min + (methodSettings.max - methodSettings.min) * 0.7 : 0);

  // Tick marks for bar
  let barTicks = $derived.by(() => {
    if (!isSupported || !methodSettings) return [];
    const s = methodSettings;
    const step = Math.max(1, Math.round((s.max - s.min) / 6));
    const ticks = [];
    for (let v = s.min; v <= s.max; v += step) {
      ticks.push(v);
    }
    if (ticks[ticks.length - 1] !== s.max) ticks.push(s.max);
    return ticks;
  });

  // Bean SVG drawing helpers
  function beanPath(cx, cy, w, h) {
    // Simple bean shape: slightly asymmetric oval with a center line
    const rx = w / 2;
    const ry = h / 2;
    return `M ${cx} ${cy - ry} C ${cx + rx * 1.1} ${cy - ry * 0.8}, ${cx + rx * 1.1} ${cy + ry * 0.8}, ${cx} ${cy + ry} C ${cx - rx * 1.1} ${cy + ry * 0.8}, ${cx - rx * 1.1} ${cy - ry * 0.8}, ${cx} ${cy - ry} Z`;
  }

  function beanCrease(cx, cy, h) {
    const ry = h / 2;
    return `M ${cx} ${cy - ry * 0.7} C ${cx + 3} ${cy - ry * 0.2}, ${cx - 3} ${cy + ry * 0.2}, ${cx} ${cy + ry * 0.7}`;
  }

  // Cell pattern density per roast (more cells = denser/lighter)
  function cellPositions(index) {
    const baseCells = [
      // light: many small cells (dense)
      [
        {x: -8, y: -10, r: 2}, {x: 4, y: -12, r: 1.8}, {x: -5, y: -4, r: 2.2},
        {x: 6, y: -5, r: 1.5}, {x: -2, y: 2, r: 2}, {x: 8, y: 3, r: 1.8},
        {x: -7, y: 8, r: 2}, {x: 3, y: 9, r: 1.5}, {x: -1, y: -8, r: 1.5},
        {x: 7, y: 10, r: 1.3}, {x: -9, y: 2, r: 1.5}, {x: 1, y: 13, r: 1.8},
      ],
      // medium-light
      [
        {x: -7, y: -10, r: 2.5}, {x: 5, y: -11, r: 2.2}, {x: -4, y: -3, r: 2.8},
        {x: 6, y: -4, r: 2}, {x: -2, y: 4, r: 2.5}, {x: 7, y: 5, r: 2.2},
        {x: -6, y: 10, r: 2.5}, {x: 3, y: 11, r: 2}, {x: 0, y: -7, r: 2},
        {x: -8, y: 3, r: 2},
      ],
      // medium
      [
        {x: -6, y: -9, r: 3}, {x: 5, y: -10, r: 2.8}, {x: -3, y: -2, r: 3.2},
        {x: 6, y: -2, r: 2.5}, {x: -1, y: 5, r: 3}, {x: 7, y: 6, r: 2.8},
        {x: -5, y: 11, r: 3}, {x: 3, y: 12, r: 2.5},
      ],
      // medium-dark
      [
        {x: -5, y: -8, r: 3.5}, {x: 5, y: -9, r: 3.2}, {x: -2, y: -1, r: 3.8},
        {x: 6, y: 0, r: 3}, {x: 0, y: 7, r: 3.5}, {x: -5, y: 12, r: 3.2},
      ],
      // dark: few large cells (porous)
      [
        {x: -4, y: -7, r: 4.2}, {x: 5, y: -6, r: 3.8}, {x: -1, y: 2, r: 4.5},
        {x: 5, y: 4, r: 3.5}, {x: -3, y: 11, r: 4},
      ],
    ];
    return baseCells[index] || baseCells[2];
  }
</script>

<div class="grind-calibrator">
  <!-- Grinder Selector -->
  <div class="section">
    <span class="section-label">Grinder</span>
    <div class="select-wrapper">
      <select class="grinder-select" bind:value={grinderId}>
        {#each grinders as g}
          <option value={g.id}>{g.name}</option>
        {/each}
      </select>
      <span class="select-arrow">&darr;</span>
    </div>
  </div>

  <!-- Brew Method Pills -->
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

  <!-- Roast Level Buttons -->
  <div class="section">
    <span class="section-label">Roast Level</span>
    <div class="roast-buttons">
      {#each roastLevels as r}
        <button
          class="roast-btn"
          class:active={roast === r.id}
          onclick={() => roast = r.id}
          style="--roast-color: {r.color}; --roast-dark: {r.darkColor}"
        >
          <span class="roast-swatch" style="background: {r.color}"></span>
          <span class="roast-name">{r.name}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Processing Method -->
  <div class="section">
    <span class="section-label">Processing Method <span class="section-hint">(optional modifier)</span></span>
    <div class="proc-pills">
      {#each processingMethods as p}
        <button
          class="proc-pill"
          class:active={processing === p.id}
          onclick={() => processing = p.id}
        >
          {p.name}
        </button>
      {/each}
    </div>
  </div>

  <!-- Hero Readout -->
  <div class="hero-readout">
    {#if isSupported}
      <div class="hero-inner">
        <span class="hero-prefix">GRIND SETTING</span>
        <div class="hero-value-row">
          <span class="hero-value">{displaySetting}</span>
          <span class="hero-unit">{grinder.unit}</span>
        </div>
        <span class="hero-range">Range: {methodSettings.min}&ndash;{methodSettings.max} {grinder.unit}</span>
        <div class="hero-recipe">
          <span class="recipe-param">DOSE: {recipe.dose}g</span>
          <span class="recipe-sep">&middot;</span>
          <span class="recipe-param">WATER: {recipe.water}g</span>
          <span class="recipe-sep">&middot;</span>
          <span class="recipe-param">TEMP: {adjustedTemp === 'N/A' ? 'N/A' : adjustedTemp + '\u00B0C'}</span>
          <span class="recipe-sep">&middot;</span>
          <span class="recipe-param">TIME: {recipe.time}</span>
        </div>
      </div>
    {:else}
      <div class="hero-inner hero-unsupported">
        <span class="hero-prefix hero-prefix-warn">NOT SUPPORTED</span>
        <p class="hero-explain">
          The {grinder.name} cannot grind fine enough for {methodName}. {grinder.quirk}
        </p>
      </div>
    {/if}
  </div>

  <!-- Viz + Info Grid -->
  <div class="viz-info-grid">
    <!-- Left Column: Visualizations -->
    <div class="viz-column">
      <!-- Bean Solubility Profile -->
      <div class="viz-card">
        <span class="viz-label">Bean Solubility Profile</span>
        <svg viewBox="0 0 400 140" class="viz-svg" role="img" aria-label="Five coffee bean silhouettes showing roast levels and cellular density">
          <defs>
            <filter id="bean-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {#each roastLevels as r, i}
            {@const cx = 45 + i * 80}
            {@const cy = 48}
            {@const isActive = roast === r.id}
            {@const beanW = 28}
            {@const beanH = 36}

            <!-- Bean shape -->
            <g class="bean-group" style="transition: all 0.3s ease-out;" filter={isActive ? 'url(#bean-glow)' : 'none'}>
              <!-- Bean fill -->
              <path
                d={beanPath(cx, cy, beanW, beanH)}
                fill={r.color}
                stroke={isActive ? '#F59E0B' : 'rgba(210, 125, 45, 0.3)'}
                stroke-width={isActive ? 2 : 0.75}
                opacity={isActive ? 1 : 0.5}
              />

              <!-- Cell pattern overlay -->
              {#each cellPositions(i) as cell}
                <circle
                  cx={cx + cell.x}
                  cy={cy + cell.y}
                  r={cell.r}
                  fill="none"
                  stroke={i < 2 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.25)'}
                  stroke-width="0.5"
                  opacity={isActive ? 0.8 : 0.3}
                />
              {/each}

              <!-- Bean crease -->
              <path
                d={beanCrease(cx, cy, beanH)}
                fill="none"
                stroke={i < 3 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.35)'}
                stroke-width="1"
                opacity={isActive ? 0.9 : 0.4}
              />
            </g>

            <!-- Roast label -->
            <text
              x={cx}
              y={cy + beanH / 2 + 14}
              class="bean-label"
              style="fill: {isActive ? '#E2E8F0' : '#64748B'}; transition: fill 0.3s ease-out;"
              text-anchor="middle"
            >
              {r.name}
            </text>
          {/each}

          <!-- Solubility bar -->
          <rect x="40" y="102" width="320" height="6" rx="3" fill="#0D1117" stroke="rgba(210, 125, 45, 0.15)" stroke-width="0.5" />
          <rect x="40" y="102" width={320 * solubility} height="6" rx="3" fill="url(#sol-grad)" style="transition: width 0.3s ease-out;" />

          <!-- Solubility gradient -->
          <defs>
            <linearGradient id="sol-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#D27D2D" stop-opacity="0.4" />
              <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.9" />
            </linearGradient>
          </defs>

          <!-- Solubility marker -->
          <circle cx={40 + 320 * solubility} cy="105" r="5" fill="#F59E0B" stroke="#0B0E14" stroke-width="1.5" style="transition: cx 0.3s ease-out;" />

          <!-- Solubility label -->
          <text x="40" y="126" class="sol-label">Low Solubility</text>
          <text x="360" y="126" class="sol-label" text-anchor="end">High Solubility</text>
          <text x="200" y="126" class="sol-value" text-anchor="middle">SOLUBILITY: {solubility.toFixed(2)}</text>
        </svg>
      </div>

      <!-- Grinder Range Bar -->
      {#if isSupported && methodSettings}
        <div class="viz-card">
          <span class="viz-label">Grinder Range &mdash; {methodName}</span>
          <svg viewBox="0 0 420 75" class="viz-svg" role="img" aria-label="Horizontal bar showing the grinder's setting range with recommended position">
            <defs>
              <linearGradient id="range-fill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#D27D2D" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.3" />
              </linearGradient>
              <linearGradient id="sweet-range" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.15" />
                <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.3" />
                <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.15" />
              </linearGradient>
            </defs>

            <!-- Background track -->
            <rect x={BAR.left} y={BAR.top} width={BAR.right - BAR.left} height={BAR.bottom - BAR.top} rx="4" fill="#0D1117" stroke="rgba(210, 125, 45, 0.15)" stroke-width="0.5" />

            <!-- Full method range -->
            <rect x={barX(methodSettings.min)} y={BAR.top} width={barX(methodSettings.max) - barX(methodSettings.min)} height={BAR.bottom - BAR.top} rx="4" fill="url(#range-fill)" />

            <!-- Sweet spot zone (middle 40% of range) -->
            <rect x={barX(sweetMin)} y={BAR.top} width={barX(sweetMax) - barX(sweetMin)} height={BAR.bottom - BAR.top} fill="url(#sweet-range)" />

            <!-- Tick marks -->
            {#each barTicks as tick}
              <line x1={barX(tick)} y1={BAR.bottom} x2={barX(tick)} y2={BAR.bottom + 5} class="bar-tick" />
              <text x={barX(tick)} y={BAR.bottom + 15} class="bar-tick-text">{grinder.id === 'kinu' ? tick.toFixed(1) : tick}</text>
            {/each}

            <!-- Min/Max labels -->
            <text x={barX(methodSettings.min)} y={BAR.top - 4} class="bar-range-label" text-anchor="middle">MIN</text>
            <text x={barX(methodSettings.max)} y={BAR.top - 4} class="bar-range-label" text-anchor="middle">MAX</text>

            <!-- Recommended setting marker -->
            <line x1={barX(adjustedSetting)} y1={BAR.top - 2} x2={barX(adjustedSetting)} y2={BAR.bottom + 2} class="setting-marker" style="transition: all 0.3s ease-out;" />
            <circle cx={barX(adjustedSetting)} cy={(BAR.top + BAR.bottom) / 2} r="8" class="setting-marker-pulse" style="transition: all 0.3s ease-out;" />
            <circle cx={barX(adjustedSetting)} cy={(BAR.top + BAR.bottom) / 2} r="6" class="setting-marker-glow" style="transition: all 0.3s ease-out;" />
            <circle cx={barX(adjustedSetting)} cy={(BAR.top + BAR.bottom) / 2} r="4" class="setting-marker-dot" style="transition: all 0.3s ease-out;" />

            <!-- Setting readout -->
            <rect x={barX(adjustedSetting) - 20} y={BAR.bottom + 22} width="40" height="16" rx="3" fill="#0B0E14" stroke="rgba(245, 158, 11, 0.3)" stroke-width="0.5" />
            <text x={barX(adjustedSetting)} y={BAR.bottom + 33} class="bar-setting-text" style="transition: all 0.3s ease-out;">{displaySetting}</text>
          </svg>
        </div>
      {/if}
    </div>

    <!-- Right Column: Info Panel -->
    <div class="info-panel">
      <!-- Grinder Details -->
      <div class="info-card">
        <span class="section-label">Grinder Details</span>
        <div class="info-rows">
          <div class="info-row">
            <span class="info-key">Type</span>
            <span class="info-val">{grinder.type}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Burrs</span>
            <span class="info-val">{grinder.burrs}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Steps</span>
            <span class="info-val">{grinder.steps}</span>
          </div>
          <div class="info-row">
            <span class="info-key">Unit</span>
            <span class="info-val">{grinder.unitLabel}</span>
          </div>
        </div>
      </div>

      <!-- Confidence Badge -->
      <div class="info-card">
        <span class="section-label">Data Confidence</span>
        <div class="confidence-row">
          <span
            class="confidence-badge"
            class:conf-high={confidence === 'high'}
            class:conf-medium={confidence === 'medium'}
            class:conf-low={confidence === 'low'}
            class:conf-none={confidence === 'none'}
          >
            {confidence === 'none' ? 'N/A' : confidence.toUpperCase()}
          </span>
          <span class="confidence-desc">
            {#if confidence === 'high'}
              Multiple concordant sources (4+). Well-documented.
            {:else if confidence === 'medium'}
              2&ndash;3 sources with some variance. Treat as good starting point.
            {:else if confidence === 'low'}
              Single source or extrapolated. Expect to adjust &plusmn;15%.
            {:else}
              This brew method is not supported by this grinder.
            {/if}
          </span>
        </div>
      </div>

      <!-- Quirk -->
      <div class="info-card">
        <span class="section-label">Key Quirk</span>
        <p class="info-text">{grinder.quirk}</p>
      </div>

      <!-- Roast Adjustment Note -->
      {#if roastNote}
        <div class="info-card" transition:fade={{ duration: 200 }}>
          <span class="section-label">Roast Adjustment</span>
          <p class="info-text">{roastNote}</p>
        </div>
      {/if}

      <!-- Processing Note -->
      {#if procNote}
        <div class="info-card info-card-subtle" transition:fade={{ duration: 200 }}>
          <span class="section-label">Processing Note</span>
          <p class="info-text">{procNote}</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* ========== Layout ========== */
  .grind-calibrator {
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

  .section-hint {
    font-weight: 400;
    color: #64748B;
    letter-spacing: 0.1em;
    font-size: 0.6rem;
  }

  /* ========== Grinder Select ========== */
  .select-wrapper {
    position: relative;
    width: 100%;
  }

  .grinder-select {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.2);
    border-radius: 6px;
    color: #E2E8F0;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1rem;
    font-weight: 600;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: border-color 0.2s;
    outline: none;
  }

  .grinder-select:hover {
    border-color: rgba(210, 125, 45, 0.4);
  }

  .grinder-select:focus {
    border-color: #D27D2D;
    box-shadow: 0 0 0 1px rgba(210, 125, 45, 0.2);
  }

  .grinder-select option {
    background: #161B22;
    color: #E2E8F0;
    padding: 0.5rem;
  }

  .select-arrow {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: #D27D2D;
    pointer-events: none;
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

  /* ========== Roast Buttons ========== */
  .roast-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .roast-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.85rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .roast-btn:hover {
    border-color: rgba(210, 125, 45, 0.4);
    background: #21262D;
  }
  .roast-btn.active {
    border-color: var(--roast-color);
    background: rgba(210, 125, 45, 0.08);
  }

  .roast-swatch {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    flex-shrink: 0;
  }

  .roast-name {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    color: #94A3B8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .roast-btn.active .roast-name {
    color: #E2E8F0;
  }

  /* ========== Processing Pills ========== */
  .proc-pills {
    display: flex;
    gap: 0.5rem;
  }

  .proc-pill {
    padding: 0.4rem 0.85rem;
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.1);
    border-radius: 4px;
    cursor: pointer;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: all 0.2s;
  }
  .proc-pill:hover {
    border-color: rgba(210, 125, 45, 0.3);
    color: #94A3B8;
  }
  .proc-pill.active {
    border-color: rgba(210, 125, 45, 0.4);
    color: #E2E8F0;
    background: rgba(210, 125, 45, 0.06);
  }

  /* ========== Hero Readout ========== */
  .hero-readout {
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.25);
    border-radius: 8px;
    padding: 1.75rem;
    text-align: center;
  }

  .hero-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .hero-prefix {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.25em;
    color: #D27D2D;
    font-weight: 600;
  }
  .hero-prefix-warn {
    color: #F87171;
  }

  .hero-value-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .hero-value {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 3.5rem;
    font-weight: 700;
    color: #F59E0B;
    line-height: 1;
    text-shadow: 0 0 30px rgba(245, 158, 11, 0.25);
  }

  .hero-unit {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 1rem;
    color: #94A3B8;
    text-transform: lowercase;
  }

  .hero-range {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    color: #64748B;
    letter-spacing: 0.05em;
  }

  .hero-recipe {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(210, 125, 45, 0.1);
  }

  .recipe-param {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.65rem;
    color: #94A3B8;
    letter-spacing: 0.05em;
  }

  .recipe-sep {
    color: #475569;
    font-size: 0.65rem;
  }

  .hero-unsupported {
    gap: 0.75rem;
  }

  .hero-explain {
    font-size: 0.8rem;
    color: #94A3B8;
    line-height: 1.6;
    max-width: 500px;
    margin: 0;
  }

  /* ========== Viz + Info Grid ========== */
  .viz-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    align-items: start;
  }
  @media (max-width: 768px) {
    .viz-info-grid {
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

  /* ========== Bean SVG ========== */
  .bean-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    text-anchor: middle;
  }

  .sol-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6px;
    fill: #64748B;
  }

  .sol-value {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 7px;
    fill: #F59E0B;
    letter-spacing: 0.05em;
  }

  /* ========== Grinder Range Bar SVG ========== */
  .bar-tick {
    stroke: #475569;
    stroke-width: 0.5;
  }

  .bar-tick-text {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6.5px;
    fill: #64748B;
    text-anchor: middle;
  }

  .bar-range-label {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 6px;
    fill: #475569;
    letter-spacing: 0.1em;
  }

  .setting-marker {
    stroke: #F59E0B;
    stroke-width: 2;
  }

  .setting-marker-pulse {
    fill: rgba(245, 158, 11, 0.15);
    animation: marker-pulse 2s ease-in-out infinite;
  }

  .setting-marker-glow {
    fill: rgba(245, 158, 11, 0.25);
  }

  .setting-marker-dot {
    fill: #F59E0B;
    stroke: #0B0E14;
    stroke-width: 1.5;
  }

  .bar-setting-text {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 8px;
    fill: #F59E0B;
    text-anchor: middle;
    font-weight: 600;
  }

  @keyframes marker-pulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.6; }
  }

  /* ========== Info Panel ========== */
  .info-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-card {
    background: #161B22;
    border: 1px solid rgba(210, 125, 45, 0.15);
    border-radius: 6px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-card-subtle {
    border-color: rgba(210, 125, 45, 0.08);
    background: rgba(22, 27, 34, 0.7);
  }

  .info-rows {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.3rem 0;
    border-bottom: 1px solid rgba(210, 125, 45, 0.05);
  }
  .info-row:last-child {
    border-bottom: none;
  }

  .info-key {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #64748B;
  }

  .info-val {
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.7rem;
    color: #E2E8F0;
    text-align: right;
    max-width: 60%;
  }

  .info-text {
    font-size: 0.78rem;
    color: #94A3B8;
    line-height: 1.6;
    margin: 0;
  }

  /* ========== Confidence Badge ========== */
  .confidence-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .confidence-badge {
    flex-shrink: 0;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 0.25rem 0.6rem;
    border-radius: 3px;
    text-transform: uppercase;
  }

  .conf-high {
    color: #34D399;
    background: rgba(52, 211, 153, 0.1);
    border: 1px solid rgba(52, 211, 153, 0.3);
  }

  .conf-medium {
    color: #F59E0B;
    background: rgba(245, 158, 11, 0.1);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .conf-low {
    color: #F87171;
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.3);
  }

  .conf-none {
    color: #64748B;
    background: rgba(100, 116, 139, 0.1);
    border: 1px solid rgba(100, 116, 139, 0.3);
  }

  .confidence-desc {
    font-size: 0.72rem;
    color: #94A3B8;
    line-height: 1.5;
  }
</style>
