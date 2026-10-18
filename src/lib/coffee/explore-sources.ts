// Sources for the Explore section (Flavor Bloom, Brewing Constellations, Origins atlas).
// Same shape as sources.ts; kept apart so Wave C doesn't collide with the engine registry.
// Fold into sources.ts when the waves merge.
import type { Source } from './sources.ts';

export const EXPLORE_SOURCES: Record<string, Source> = {
  'sca-wcr-wheel': { id: 'sca-wcr-wheel', author: 'Specialty Coffee Association and World Coffee Research', title: 'Coffee Taster\'s Flavor Wheel', year: 2016, where: 'family, group and attribute names', url: 'https://sca.coffee/research/coffee-tasters-flavor-wheel' },
  'wcr-lexicon': { id: 'wcr-lexicon', author: 'World Coffee Research', title: 'Sensory Lexicon, 2nd edition', year: 2017, where: 'attribute definitions; notes on the Roasted, Nutty and Floral categories', url: 'https://worldcoffeeresearch.org/resources/sensory-lexicon' },
  // Review r2 (Astra, N2): the three-defect list is SCA-104's (Affective Assessment); tasting as the cup cools is the cupping protocol's.
  'sca-cupping': { id: 'sca-cupping', author: 'Specialty Coffee Association', title: 'Cupping Protocols', where: 'evaluation begins at about 71 °C and the cup is tasted again as it cools' },
  'sca-cva': { id: 'sca-cva', author: 'Specialty Coffee Association', title: 'SCA-104-2024, Coffee Value Assessment: Affective Assessment', year: 2024, where: '§5.4.1, the sensory defects (potato, moldy, phenolic)' },
  'wcr-ptd': { id: 'wcr-ptd', author: 'World Coffee Research', title: 'Potato taste defect', year: 2026, where: 'where it occurs (the Great Lakes region), its link to antestia-bug damage, one bean spoiling a bag (checked October 18, 2026)', url: 'https://worldcoffeeresearch.org/resources/potato-taste-defect' },
  easto: { id: 'easto', author: 'Jessica Easto', title: 'Craft Coffee: A Manual', year: 2017, where: 'acids in coffee; roast and brightness; brewing method chapters' },
  synthesis: { id: 'synthesis', author: 'JayArr Coffee', title: 'Coffee Knowledge Synthesis (seventeen sources)', where: '§1 extraction order, §5 filter science, §14 flavor chemistry, §17 method comparisons' },
  hoffmann: { id: 'hoffmann', author: 'James Hoffmann', title: 'The World Atlas of Coffee (2nd ed.) and published brewing technique', year: 2018, where: 'moka pot (about 1.5 bar against espresso\'s 9)' },
  rao: { id: 'rao', author: 'Scott Rao', title: 'Espresso Extraction: Measurement and Mastery', where: 'pump pressure: flow peaks at about 7–9 bar at the group head' },
  'roaster-lots-2026': { id: 'roaster-lots-2026', author: 'JayArr Coffee', title: 'Lot descriptions from 38 specialty roasters\' online catalogs', year: 2026, where: '320 lots recorded January–March 2026; the 272 single-origin lots whose descriptions name a tasting note, from 37 of the 38 roasters, are counted; the words are the roasters\', counted as written' },
};
