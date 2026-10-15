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
  // Edition verified by Astra (R9, 15 Oct 2026): the 2019 chart marks 1.15–1.45%; the older Golden Cup is 1.15–1.35%.
  'sca-chart': { id: 'sca-chart', author: 'Specialty Coffee Association', title: 'Coffee Brewing Control Chart, revised March 2019 (Version 3)', year: 2019, where: 'reference region: extraction 18–22%, strength 1.15–1.45% TDS', url: 'https://static1.squarespace.com/static/587af1d4db29d69a1a226b95/t/60aece65e4f2134d99f6e646/1622068839009/SCA%2BBrewing%2BChart%2B-%2BRevised%2BMarch%2B2019-US-Letter.pdf' },
  'sca-golden-cup': { id: 'sca-golden-cup', author: 'Specialty Coffee Association', title: 'Coffee Standards, revised 2018', year: 2018, where: '§5.1 Golden Cup: extraction 18–22%, strength 1.15–1.35% TDS', url: 'https://editordecafe.com/wp-content/uploads/2019/03/6ec09-coffeestandards-digital.pdf' },
  'cotter-2021': { id: 'cotter-2021', author: 'Cotter, Batali, Ristenpart and Guinard', title: 'Consumer preferences for black coffee are spread over a wide range of brew strengths and extraction yields (Journal of Food Science 86: 194–205)', year: 2021, url: 'https://doi.org/10.1111/1750-3841.15561' },
  'newcastle-2018': { id: 'newcastle-2018', author: 'Newcastle University', title: 'Caffeine and chlorogenic acid by brewing method (HPLC, same beans)', year: 2018 },
  'barista-hustle-water': { id: 'barista-hustle-water', author: 'Barista Hustle', title: 'Water recipes and the two-bottle concentrate method', where: 'Epsom salt and baking soda concentrates; recipe #4' },
  'hendon-2014': { id: 'hendon-2014', author: 'Hendon, Colonna-Dashwood and Colonna-Dashwood', title: 'The role of dissolved cations in coffee extraction (Journal of Agricultural and Food Chemistry)', year: 2014 },
  'sca-water': { id: 'sca-water', author: 'Specialty Coffee Association', title: 'Water quality standard for brewing', where: 'TDS 150 ppm, hardness and alkalinity targets' },
  synthesis: { id: 'synthesis', author: 'JayArr Coffee', title: 'Coffee Knowledge Synthesis (seventeen sources)', where: '§6 recipes, §17 method comparisons, §19 key numbers, §23 brewer base parameters' },
};
