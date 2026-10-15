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
  // Replaces "Newcastle 2018", which doesn't support 63 mg (press coverage of that study gives espresso as 126 mg; R1, Wave D batch 5).
  'usda-fdc-espresso': { id: 'usda-fdc-espresso', author: 'U.S. Department of Agriculture, Agricultural Research Service', title: 'FoodData Central, SR Legacy, FDC ID 171891: Beverages, coffee, brewed, espresso, restaurant-prepared', year: 2018, where: 'caffeine 212 mg per 100 g; a 1 fl oz serving (29.6 g) works out to 62.8 mg, calculated' },
  // Caffeine half-life (R4, Wave D batch 5; confirmed by Astra 10/15).
  'iom-2001': { id: 'iom-2001', author: 'Institute of Medicine', title: 'Caffeine for the Sustainment of Mental Task Performance', year: 2001, where: 'ch. 2, pp. 26–29: a half-life of 2.5–4.5 hours in adult men given 4 mg/kg; oral contraceptives can double it' },
  'knutti-1981': { id: 'knutti-1981', author: 'Knutti, Rothweiler and Schlatter', title: 'Effect of pregnancy on the pharmacokinetics of caffeine (European Journal of Clinical Pharmacology 21: 121–126)', year: 1981, where: 'abstract: 3.4 hours (range 2–5) in men and non-pregnant women' },
  'knutti-1982': { id: 'knutti-1982', author: 'Knutti, Rothweiler and Schlatter', title: 'The effect of pregnancy on the pharmacokinetics of caffeine (Archives of Toxicology Supplement 5: 187–192)', year: 1982, where: 'abstract: 3 hours in non-pregnant women, 10.5 hours in the last four weeks of pregnancy' },
  'gardiner-2025': { id: 'gardiner-2025', author: 'Gardiner et al.', title: 'Dose and timing effects of caffeine on subsequent sleep: a randomized clinical crossover trial (Sleep 48: zsae230)', year: 2025, where: 'half-life "typically 3–6 hours"' },
  'barista-hustle-water': { id: 'barista-hustle-water', author: 'Barista Hustle', title: 'Water recipes and the two-bottle concentrate method', where: 'Epsom salt and baking soda concentrates; recipe #4' },
  // The water page's Gagné material (recipes compared on a hardness–alkalinity map, magnesium and calcium) is from this post, not the book (Wave D batch 1).
  'gagne-water': { id: 'gagne-water', author: 'Jonathan Gagné', title: 'Water for Coffee Extraction (Coffee ad Astra)', year: 2018, where: 'recipes on a hardness–alkalinity map with a 1:1 line; magnesium "believed to extract slightly different flavors"', url: 'https://coffeeadastra.com/2018/12/16/water-for-coffee-extraction/' },
  'hendon-2014': { id: 'hendon-2014', author: 'Hendon, Colonna-Dashwood and Colonna-Dashwood', title: 'The role of dissolved cations in coffee extraction (Journal of Agricultural and Food Chemistry)', year: 2014 },
  'sca-water': { id: 'sca-water', author: 'Specialty Coffee Association', title: 'Water quality standard for brewing', where: 'TDS 150 ppm, hardness and alkalinity targets' },
  synthesis: { id: 'synthesis', author: 'JayArr Coffee', title: 'Coffee Knowledge Synthesis (seventeen sources)', where: '§6 recipes, §17 method comparisons, §19 key numbers, §23 brewer base parameters' },
};
