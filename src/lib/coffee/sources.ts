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
  // Round 3 follow-ups (group A), checked 2026-10-18.
  'nguyen-iced': { id: 'nguyen-iced', author: 'Nguyen Coffee Supply (Sahra Nguyen)', title: 'Vietnamese Iced Coffee', year: 2018, where: 'phin recipe: 14 g (2 tbsp) to 4 oz of water at 195–200°F, fine like sand, a 45-second bloom with 1 oz of water, first drip before 2 min and the last around 5 min', url: 'https://nguyencoffeesupply.com/blogs/vietnamese-coffee-brew-guide/vietnamese-iced-coffee' },
  'nguyen-phin': { id: 'nguyen-phin', author: 'Nguyen Coffee Supply', title: 'How to Use & Clean a Vietnamese Phin Filter (2020); phin filter FAQ', year: 2020, where: 'drip troubleshooting: too fine, a wet filter or trapped gas (lift the press about 2 seconds); less than 2 tablespoons in a 4 oz phin may drip fast; add hot water if it is too strong', url: 'https://nguyencoffeesupply.com/blogs/news/using-and-maintaining-a-vietnamese-phin-filter' },
  toddy: { id: 'toddy', author: 'Toddy', title: 'Home Cold Brew System Brewing Guide, version 8-2026', year: 2026, where: 'a full home batch: 340 g (12 oz) of coffee to 8 cups of water', url: 'https://toddycafe.com/downloads/THMBGN-brewing-instructions.pdf' },
  'breville-bdc450': { id: 'breville-bdc450', author: 'Breville', title: 'Precision Brewer Thermal (BDC450) product page', where: '"60 oz." drip coffee maker, 12 cups', url: 'https://www.breville.com/en-us/product/bdc450' },
  'turkpatent-g8': { id: 'turkpatent-g8', author: 'TÜRKPATENT (Turkish Patent and Trademark Office)', title: 'Türk Kahvesi / Turkish Coffee, traditional product name registration No. G8 (registered 10 March 2026; application G2023/000008)', year: 2026, where: 'Öğütme: the average particle size of the ground coffee is to be 75–125 microns', url: 'https://ci.turkpatent.gov.tr/Files/GeographicalSigns/e6a9967f-4501-40fb-a040-4675c9600fb6.pdf' },
  'gagne-roast': { id: 'gagne-roast', author: 'Jonathan Gagné', title: 'The Physics of Filter Coffee', year: 2021, where: '§9.2, pp. 171–177: darker roasts gave faster drawdowns and lower average extraction yields in his V60 log (he notes espresso may differ), and he brews darker roasts cooler to avoid bitterness' },
  'hoffmann-press': { id: 'hoffmann-press', author: 'James Hoffmann', title: 'The World Atlas of Coffee (2nd ed.), pp. 78–79, and "The Ultimate French Press Technique" (video, 2016)', year: 2018, where: 'steep 4 min, break the crust and skim, wait at least 5 more minutes (the video: perhaps 7–8), then pour without plunging' },
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
