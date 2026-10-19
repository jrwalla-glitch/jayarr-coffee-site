import type { Method, MethodId, Range } from './types.ts';
import { fToC, flOzToMl } from './units.ts';

// Each method carries the published recipe its steps come from. Steps are scaled to the
// user's dose and water by brew.ts: the bloom scales with the coffee, pours with the water.
// Extraction ranges (for the strength estimate) are the guide's own estimates, from synthesis §17 (R11, below).

export const METHODS: Method[] = [
  {
    id: 'v60', label: 'V60', family: 'percolation',
    ratio: { lighter: 17, classic: 16, stronger: 15 },
    tempC: { default: 94, min: 91, max: 96 },
    timeS: { min: 180, max: 240 },
    grindMicrons: { min: 450, max: 650 }, grindLabel: 'Medium-fine', texture: 'table salt',
    retentionGPerG: 2,
    base: { doseG: 23.5, waterG: 400, by: "Jessica Easto's continuous-pour V60" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Rinse the paper filter with hot water and tip the rinse out. Add the coffee, shake it level, tare the scale.', cue: 'Flat bed, scale at zero.' },
      { kind: 'bloom', atS: 0, untilS: 45, toG: 60, text: 'Start the timer and pour just enough to wet every ground.', cue: 'The bed swells and bubbles; no dry patches.' },
      { kind: 'pour', atS: 45, untilS: 150, toG: 400, text: 'Pour slowly in small circles at the center, without stopping. Make one lap near the edge as you pass the third and two-thirds marks.', cue: 'Reach the total by 2:30.' },
      { kind: 'drawdown', atS: 150, untilS: 210, text: 'Let it drain.', cue: 'Done around 3:00–4:00. Much faster: grind finer next time. Much slower: coarser.' },
    ],
    capacity: { minDoseG: 10, maxDoseG: 32 },
    filter: 'paper',
    sourceIds: ['easto', 'gagne', 'synthesis'],
    verify: ['retention 2 g/g', 'micron band'],
  },
  {
    id: 'chemex', label: 'Chemex', family: 'percolation',
    ratio: { lighter: 17, classic: 16, stronger: 15 },
    tempC: { default: 94, min: 91, max: 96 },
    timeS: { min: 210, max: 270 },
    grindMicrons: { min: 550, max: 750 }, grindLabel: 'Medium', texture: 'coarse sand',
    retentionGPerG: 2,
    base: { doseG: 31, waterG: 500, by: "Jessica Easto's Chemex" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Unfold the filter with the three-layer side toward the spout. Rinse it, pour the rinse out, add the coffee and tare.', cue: 'Thick side of the filter over the spout.' },
      { kind: 'bloom', atS: 0, untilS: 45, toG: 70, text: 'Start the timer and bloom.', cue: 'Every ground wet.' },
      { kind: 'pour', atS: 45, untilS: 150, toG: 500, text: 'Pour steadily in small circles, with one lap near the edge at about two-fifths and four-fifths of the total.', cue: 'Reach the total by 2:30.' },
      { kind: 'drawdown', atS: 150, untilS: 225, text: 'Let it drain, then lift the filter out.', cue: 'Done around 3:30–4:30.' },
    ],
    capacity: { minDoseG: 20, maxDoseG: 55 },
    filter: 'paper',
    sourceIds: ['easto', 'synthesis'],
    verify: ['retention 2 g/g', 'micron band'],
  },
  {
    id: 'kalita', label: 'Kalita Wave', family: 'percolation',
    ratio: { lighter: 17, classic: 16, stronger: 15 },
    tempC: { default: 94, min: 91, max: 96 },
    timeS: { min: 180, max: 240 },
    grindMicrons: { min: 500, max: 700 }, grindLabel: 'Medium', texture: 'sand',
    retentionGPerG: 2,
    base: { doseG: 23.5, waterG: 400, by: "Jessica Easto's Kalita Wave pulse pour" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Rinse the filter without pouring on its walls, add the coffee, tare.', cue: 'Keep water off the fluted walls.' },
      { kind: 'bloom', atS: 0, untilS: 35, toG: 50, text: 'Start the timer and bloom.', cue: 'Every ground wet.' },
      { kind: 'pour', atS: 35, untilS: 45, toG: 150, text: 'First pulse, in small circles at the center.', cue: 'Stay off the walls.' },
      { kind: 'pour', atS: 65, untilS: 75, toG: 200, text: 'Pulse.', cue: 'Pour when the level has dropped a little.' },
      { kind: 'pour', atS: 90, untilS: 100, toG: 250, text: 'Pulse.', cue: '' },
      { kind: 'pour', atS: 115, untilS: 125, toG: 300, text: 'Pulse.', cue: '' },
      { kind: 'pour', atS: 140, untilS: 150, toG: 350, text: 'Pulse.', cue: '' },
      { kind: 'pour', atS: 165, untilS: 175, toG: 400, text: 'Last pulse.', cue: '' },
      { kind: 'drawdown', atS: 175, untilS: 225, text: 'Let it drain.', cue: 'Done around 3:45.' },
    ],
    capacity: { minDoseG: 12, maxDoseG: 30 },
    filter: 'paper',
    sourceIds: ['easto', 'synthesis'],
    verify: ['pulse timing is our schedule: Easto gives the pulse sizes, not the times', 'retention 2 g/g'],
  },
  {
    id: 'french-press', label: 'French press', family: 'immersion',
    ratio: { lighter: 16, classic: 15, stronger: 14 },
    tempC: { default: 96, min: 93, max: 98 },
    timeS: { min: 480, max: 480 },
    grindMicrons: { min: 900, max: 1200 }, grindLabel: 'Extra coarse', texture: 'coarse sea salt',
    retentionGPerG: 2,
    base: { doseG: 28.5, waterG: 400, by: "Jessica Easto's eight-minute French press" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Warm the press, add the coffee, tare.', cue: '' },
      { kind: 'pour', atS: 0, untilS: 15, toG: 400, text: 'Start the timer and pour all the water.', cue: 'All the grounds wet.' },
      { kind: 'stir', atS: 30, untilS: 45, text: 'Stir gently to sink the crust.', cue: '' },
      { kind: 'steep', atS: 45, untilS: 480, text: 'Put the lid on with the plunger up. Leave it.', cue: 'Don\'t press yet.' },
      { kind: 'press', atS: 480, untilS: 500, text: 'Press gently and pour it all out straight away.', cue: 'Coffee left on the grounds keeps extracting.' },
    ],
    capacity: { minDoseG: 12, maxDoseG: 70, maxWaterG: 1000 },
    filter: 'metal',
    sourceIds: ['easto', 'hoffmann', 'synthesis'],
    verify: ['retention 2 g/g for immersion', 'press size limit'],
  },
  {
    id: 'aeropress', label: 'AeroPress', family: 'immersion',
    ratio: { lighter: 16, classic: 14, stronger: 12 },
    tempC: { default: 85, min: 80, max: 96 },
    timeS: { min: 50, max: 90 },
    // Names run in micron order: coarser than the moka pot's band, so not "Fine" (Opus r4, Muse r4; names still R13).
    grindMicrons: { min: 350, max: 500 }, grindLabel: 'Medium-fine', texture: 'fine sand',
    retentionGPerG: 2,
    // Easto's Classic AeroPress Method is 11.5 g to 138 g, 1:12, fine, 185°F, 50–90 s (Craft Coffee, pp. 219–221);
    // the guide's 1:14, medium-fine is an adaptation of it, so it says "adapted from" (Wave D batch 13).
    base: { doseG: 11.5, waterG: 138, by: "Jessica Easto's Classic AeroPress Method, adapted" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Rinse a paper filter in the cap, lock it on, stand the AeroPress on your mug, add the coffee and tare.', cue: 'Upright, on a sturdy mug.' },
      { kind: 'pour', atS: 0, untilS: 10, toG: 138, text: 'Start the timer and pour the water.', cue: '' },
      { kind: 'stir', atS: 10, untilS: 20, text: 'Stir for ten seconds.', cue: '' },
      { kind: 'press', atS: 30, untilS: 80, text: 'Press down slowly and steadily.', cue: 'Stop when you hear a hiss.' },
    ],
    // The chamber holds about 230 g once coffee is in; bigger cups get hot water added after pressing.
    capacity: { minDoseG: 10, maxDoseG: 22, maxWaterG: 230 },
    filter: 'paper',
    sourceIds: ['easto', 'synthesis'],
    verify: ['chamber limit 230 g', 'retention 2 g/g'],
  },
  {
    id: 'cold-brew', label: 'Cold brew', family: 'immersion',
    // Stronger is a real step (1:5.5, about 14% more coffee), inside the usual 1:4–1:8 concentrate range (synthesis §17; Opus r4).
    ratio: { lighter: 7, classic: 6.25, stronger: 5.5 },
    tempC: { default: 20, min: 4, max: 24 },
    timeS: { min: 12 * 3600, max: 18 * 3600 },
    // Between Chemex (medium, coarse sand) and the French press (extra coarse, sea salt), so a feel-word reader doesn't grind it like a Chemex.
    grindMicrons: { min: 800, max: 1100 }, grindLabel: 'Coarse', texture: 'kosher salt',
    retentionGPerG: 2,
    base: { doseG: 96, waterG: 600, by: "Jessica Easto's French-press cold brew" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Add the coffee to a jar or French press and tare.', cue: '' },
      { kind: 'pour', atS: 0, untilS: 30, toG: 600, text: 'Pour cold water over all of it and stir until every ground is wet.', cue: '' },
      { kind: 'steep', atS: 30, untilS: 12 * 3600, text: 'Cover and leave it in the fridge for 12 hours.', cue: '' },
      { kind: 'press', atS: 12 * 3600, text: 'Press or filter out the grounds. This is concentrate.', cue: 'Keeps 1–2 weeks in the fridge.' },
      { kind: 'dilute', atS: 12 * 3600, text: 'Serve it mixed one to one with cold water or milk, over ice.', cue: '' },
    ],
    // Up to a full Toddy home batch, 340 g (12 oz) of coffee (Toddy's brewing guide, version 8-2026; Wave D batch 31).
    capacity: { minDoseG: 30, maxDoseG: 340 },
    filter: 'metal',
    sourceIds: ['easto', 'toddy', 'synthesis'],
    verify: ['retention for coarse cold brew', 'minDoseG 30 g is a practical floor, not a sourced figure'],
  },
  {
    id: 'drip-machine', label: 'Drip machine', family: 'percolation',
    ratio: { lighter: 18, classic: 17, stronger: 15.5 },
    tempC: { default: 94, min: 92, max: 96 },
    timeS: { min: 240, max: 480 },
    grindMicrons: { min: 600, max: 900 }, grindLabel: 'Medium', texture: 'sand',
    retentionGPerG: 2,
    base: { doseG: 106, waterG: 1893, by: "Scott Rao's batch-brew ratio (3.75 oz to 64 oz)" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Rinse the filter, add the coffee, level the bed. Put the water in the tank.', cue: '' },
      { kind: 'pour', atS: 0, untilS: 240, toG: 1893, text: 'Start the brewer. It showers the water over about four minutes.', cue: '' },
      { kind: 'stir', atS: 10, text: 'Stir the slurry gently 5–10 seconds after the water starts.', cue: 'Every ground wet.' },
      { kind: 'stir', atS: 240, text: 'Stir once more when the spray head stops.', cue: 'Evens out the bed.' },
      { kind: 'serve', atS: 300, text: 'Serve within 30 minutes.', cue: 'Keeping it on a hot plate stews it.' },
    ],
    // A 12-cup machine's 60 fl oz (1,774 g): Breville sells its Precision Brewer as a "60 oz." 12-cup drip coffee
    // maker (product page, checked 2026-10-18). Machines vary, so the message says to check your own (was 1,800 g, R22).
    capacity: { minDoseG: 15, maxDoseG: 130, maxWaterG: flOzToMl(60) },
    filter: 'paper',
    sourceIds: ['rao', 'breville-bdc450', 'synthesis'],
    verify: ['drip micron band'],
  },
  {
    id: 'espresso', label: 'Espresso', family: 'pressure',
    // yield : dose
    ratio: { lighter: 2.5, classic: 2, stronger: 1.5 },
    tempC: { default: 93, min: 91, max: 95 },
    timeS: { min: 25, max: 30 },
    grindMicrons: { min: 200, max: 300 }, grindLabel: 'Fine', texture: 'powdered sugar',
    retentionGPerG: 0,
    // 18 g → 36 g in 25–30 s at 91–95 °C sits inside Rao's normale ranges (Espresso Extraction ch. 1:
    // 14–22 g, 1.5–2.0× the dose, 25–40 s, 91–95 °C) but is narrower, so it isn't credited as his recipe.
    // Time stays 25–30 s at every ratio: Rao's 25–40 s applies to ristretto and lungo alike, and he puts
    // "flat" pressure profiles at its low end. Temperature follows the ratio (brew.ts): Rao uses the lower
    // temperatures for higher ratios (more lungo) and the higher ones for lower ratios (Wave D batch 22).
    base: { doseG: 18, waterG: 36, by: "a recipe within Scott Rao's published ranges" },
    steps: [
      { kind: 'prep', atS: 0, text: 'Grind, dose into the basket, level it and tamp flat.', cue: 'Level puck, no gaps at the edge.' },
      { kind: 'pull', atS: 0, untilS: 28, toG: 36, text: 'Start the shot and the timer together. Stop at the yield.', cue: 'Aim for 25–30 seconds. Faster: grind finer. Slower: coarser.' },
    ],
    capacity: { minDoseG: 14, maxDoseG: 22 },
    filter: 'none',
    sourceIds: ['rao', 'synthesis'],
  },
  {
    id: 'moka', label: 'Moka pot', family: 'pressure',
    ratio: { lighter: 11, classic: 10, stronger: 9 },
    tempC: { default: 100, min: 95, max: 100 },
    timeS: { min: 240, max: 300 },
    grindMicrons: { min: 300, max: 450 }, grindLabel: 'Medium-fine (coarser than espresso)', texture: 'fine sand',
    retentionGPerG: 2,
    // The steps are Hoffmann's technique; the 1:10 is our estimate (synthesis §23.1), not his: the World Atlas
    // (p. 91) prints "Ratio: 200g/l", about 1:5 (Wave D batch 9).
    base: { doseG: 17, waterG: 170, by: "James Hoffmann's moka technique, at the Brew Guide's estimated 1:10 ratio" },
    fixedRatio: true,
    steps: [
      { kind: 'prep', atS: 0, text: 'Fill the basket level with coffee. Don\'t tamp.', cue: 'Level with the rim.' },
      { kind: 'pour', atS: 0, toG: 170, text: 'Fill the base with just-boiled water to just below the valve, then screw it together with a towel.', cue: 'Pre-boiled water keeps the grounds from cooking.' },
      { kind: 'heat', atS: 30, untilS: 270, text: 'Low to medium heat, lid open.', cue: 'Coffee should flow out slowly and steadily.' },
      { kind: 'serve', atS: 270, text: 'Take it off the heat as soon as it starts to sputter.', cue: 'Sputtering means the last of it is steam.' },
    ],
    capacity: { minDoseG: 6, maxDoseG: 40 },
    filter: 'metal',
    sourceIds: ['hoffmann', 'synthesis'],
    verify: ['the pot sets dose and water; per-size figures need maker data', 'ratio ~1:10 from §23.1'],
  },
];

/** Extraction yield ranges by method, from synthesis §17's comparison table (claims register R11). The table credits
 *  no study for its yield column; its one study credit covers the caffeine concentrations, and that study no longer
 *  backs any engine figure (R1). No primary source was found, so these are the guide's own estimates, and every
 *  page that shows them (or a strength computed from them) says so. The phin has no band: no source gives one. */
export const EY_BY_METHOD: Partial<Record<MethodId, Range>> = {
  v60: { min: 19, max: 21 },
  chemex: { min: 18, max: 20 },
  kalita: { min: 19, max: 21 },
  'french-press': { min: 20, max: 22 },
  aeropress: { min: 19, max: 22 },
  'cold-brew': { min: 15, max: 20 },
  'drip-machine': { min: 18, max: 22 },
  espresso: { min: 18, max: 22 },
  moka: { min: 15, max: 19 },
};

/**
 * Vietnamese phin, from Nguyen Coffee Supply's published recipe (Wave D batch 30; FOLLOWUPS_2 item 29): 14 g
 * (2 tbsp) of coffee "fine, like sand" to 4 oz of water at 195–200°F, a 45-second bloom with 1 oz of water, the
 * first drop before 2:00 and the last around 5:00. 4 US fl oz is 118.3 g, so 1:8.45 (calculated). The recipe
 * fixes the strength (Nguyen: add hot water if it's too strong), and a 4 oz phin holds the 14 g: larger phins
 * keep about 1 tbsp per 2 oz and take a second pour, which this recipe doesn't cover.
 *
 * Kept out of METHODS, which the Caffeine Calculator lists: it doesn't model a phin. Fix My Coffee adds the phin
 * on a short path of its own (doctor.ts), limited to Nguyen Coffee Supply's troubleshooting (Wave F r1, B14).
 */
export const PHIN: Method = {
  id: 'phin', label: 'Phin', family: 'percolation', fixedRatio: true,
  ratio: { lighter: 8.45, classic: 8.45, stronger: 8.45 },
  tempC: { default: fToC(197.5), min: fToC(195), max: fToC(200) },
  timeS: { min: 300, max: 300 },
  // Nguyen gives no microns: it likens a phin grind to a moka pot's, so the band is the guide's moka band, labeled as our estimate.
  grindMicrons: { min: 300, max: 450 }, grindLabel: 'Fine', texture: 'sand',
  grindNote: "our estimate: Nguyen Coffee Supply likens a phin grind to a moka pot's, so this is the guide's moka pot range",
  retentionGPerG: 2,
  base: { doseG: 14, waterG: 118.3, by: "Nguyen Coffee Supply's Vietnamese iced coffee recipe" },
  steps: [
    { kind: 'prep', atS: 0, text: 'Spoon condensed milk into a heatproof glass if you take it, and set the phin\'s plate and chamber on top. Add the coffee, shake it level, set the press on it and tare.', cue: 'The press goes on before the water.' },
    { kind: 'bloom', atS: 0, untilS: 45, toG: flOzToMl(1), text: 'Start the timer and pour about 1 oz of water, enough to cover the press by about ½ inch.', cue: 'Let it bloom for 45 seconds.' },
    { kind: 'pour', atS: 45, untilS: 55, toG: 118.3, text: 'Fill the chamber with the rest of the water and put the lid on.', cue: '' },
    { kind: 'drawdown', atS: 55, untilS: 300, text: 'Let it drip.', cue: 'In Nguyen\'s guide the first drop falls within about 2:00 and the last around 5:00. Rushing through: grind finer. Stalled: lift the press for about 2 seconds to let trapped gas out.' },
    { kind: 'serve', atS: 300, text: 'Lift the phin off onto its upturned lid, stir, and pour over ice if you like.', cue: 'Or drink it black, hot or iced.' },
  ],
  capacity: { minDoseG: 14, maxDoseG: 14 },
  filter: 'metal',
  sourceIds: ['nguyen-iced', 'nguyen-phin'],
  verify: ['the fill at 0:45–0:55 is our schedule: Nguyen times the bloom and the drip, not the fill', 'retention 2 g/g, as for the other brewers', 'micron band borrowed from the moka pot'],
};

/** Every brewer the Brew Guide and Grind Guide offer: METHODS plus the phin. */
export const GUIDE_METHODS: Method[] = [...METHODS, PHIN];

export const methodById = (id: MethodId) => GUIDE_METHODS.find((m) => m.id === id);
