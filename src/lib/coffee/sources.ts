// Source registry. Every preset, dataset row and threshold cites ids from here.
// The knowledge synthesis and the book it summarises count as one lineage.

export interface Source {
  id: string;
  author: string;
  title: string;
  year?: number;
  where?: string;
  url?: string;
}

export const SOURCES: Record<string, Source> = {
  easto: { id: 'easto', author: 'Jessica Easto', title: 'Craft Coffee: A Manual', year: 2017, where: 'brewing method chapters (V60, Chemex, Kalita Wave, French press, AeroPress, cold brew)' },
  gagne: { id: 'gagne', author: 'Jonathan Gagné', title: 'The Physics of Filter Coffee', year: 2021, where: 'V60 method; extraction and strength' },
  hoffmann: { id: 'hoffmann', author: 'James Hoffmann', title: 'The World Atlas of Coffee (2nd ed.) and published brewing technique', year: 2018, where: 'French press and moka pot technique' },
  rao: { id: 'rao', author: 'Scott Rao', title: 'The Professional Barista\'s Handbook; Espresso Extraction', where: 'espresso dose, ratio, time and temperature; batch brewing' },
  'sca-chart': { id: 'sca-chart', author: 'Specialty Coffee Association', title: 'Coffee Brewing Control Chart (after E. E. Lockhart)', where: 'extraction 18–22%, strength 1.15–1.45% TDS' },
  'newcastle-2018': { id: 'newcastle-2018', author: 'Newcastle University', title: 'Caffeine and chlorogenic acid by brewing method (HPLC, same beans)', year: 2018 },
  synthesis: { id: 'synthesis', author: 'JayArr Coffee', title: 'Coffee Knowledge Synthesis (seventeen sources)', where: '§6 recipes, §17 method comparisons, §19 key numbers, §23 brewer base parameters' },
};
