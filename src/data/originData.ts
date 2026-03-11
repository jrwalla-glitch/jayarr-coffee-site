// Coffee origin data for the interactive Origin Map
// Sources: COFFEE_KNOWLEDGE_SYNTHESIS.md, existing blog posts, WCR Catalog

export interface CoffeeOrigin {
  id: string;
  name: string;
  regions?: string[];
  production?: string;
  worldRank?: number;
  mainVarieties: string[];
  primaryProcessing: string[];
  harvestMonths: [number, number]; // [start, end] — wraps around year if start > end
  altitudeRange?: [number, number]; // meters
  flavorProfile: string[];
  description: string;
  articles: { slug: string; title: string }[];
  continent: 'africa' | 'americas' | 'asia';
}

export const origins: CoffeeOrigin[] = [
  // ═══════════════════════════════════════
  // AFRICA
  // ═══════════════════════════════════════
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    regions: ['Yirgacheffe', 'Sidamo', 'Guji', 'Harrar', 'Limu'],
    production: '6.6M bags',
    worldRank: 5,
    mainVarieties: ['Heirloom (uncatalogued)'],
    primaryProcessing: ['Washed', 'Natural'],
    harvestMonths: [10, 2],
    altitudeRange: [1200, 2200],
    flavorProfile: ['Citrus', 'Bergamot', 'Floral', 'Candied Fruit', 'Berry'],
    description: 'The birthplace of coffee. Ethiopia\'s enormous genetic diversity produces the most aromatic and complex coffees on earth — from the explosive florals of Yirgacheffe to the wild berry intensity of natural-processed Guji.',
    continent: 'africa',
    articles: [
      { slug: 'ethiopian-coffee-flavors-and-varieties', title: 'Ethiopian Coffee: Flavors, Varieties, and Growing Regions' },
      { slug: '7-ethiopian-coffees-reviewed-best-and-worst', title: '7 Ethiopian Coffees Reviewed and Ranked' },
      { slug: 'ethiopian-heirloom-vs-named-varietals', title: 'Ethiopian Heirloom vs Named Varietals' },
    ],
  },
  {
    id: 'kenya',
    name: 'Kenya',
    regions: ['Nyeri', 'Kirinyaga', 'Kiambu', 'Murang\'a'],
    production: '783K bags',
    mainVarieties: ['SL-28', 'SL-34', 'Ruiru 11', 'Batian'],
    primaryProcessing: ['Washed'],
    harvestMonths: [10, 12],
    altitudeRange: [1400, 2000],
    flavorProfile: ['Blackcurrant', 'Berry', 'Bright Acidity', 'Grapefruit'],
    description: 'Among the most celebrated coffees globally. Kenya\'s SL-28 and SL-34 varieties produce intensely bright, complex cups with signature blackcurrant and berry notes. Weekly Tuesday auctions in Nairobi drive quality competition.',
    continent: 'africa',
    articles: [
      { slug: 'kenyan-coffee-flavor-notes-and-best-coffees', title: 'Kenyan Coffee: Flavor Profile and Best Beans' },
      { slug: 'what-does-kenyan-coffee-taste-like', title: 'What Does Kenyan Coffee Taste Like?' },
    ],
  },
  {
    id: 'rwanda',
    name: 'Rwanda',
    production: '220K bags',
    mainVarieties: ['Bourbon'],
    primaryProcessing: ['Washed'],
    harvestMonths: [3, 7],
    altitudeRange: [1500, 2000],
    flavorProfile: ['Red Apple', 'Grape', 'Berry', 'Floral'],
    description: 'A nation that rebuilt itself through specialty coffee. Rwanda\'s Bourbon variety produces bright, fruity cups with apple and grape sweetness. The country\'s investment in washing stations transformed its coffee from commodity to specialty.',
    continent: 'africa',
    articles: [
      { slug: 'rwandan-coffee-a-story-of-rebuilding', title: 'Rwandan Coffee: A Story of Rebuilding' },
    ],
  },
  {
    id: 'tanzania',
    name: 'Tanzania',
    regions: ['Kilimanjaro', 'Mbeya', 'Arusha'],
    production: '870K bags',
    mainVarieties: ['Kent', 'Bourbon'],
    primaryProcessing: ['Washed'],
    harvestMonths: [7, 12],
    altitudeRange: [1200, 1800],
    flavorProfile: ['Complex', 'Bright', 'Berry', 'Citrus'],
    description: 'Tanzania\'s best lots rival Kenya for complexity and brightness. Peaberry lots from the slopes of Kilimanjaro are specifically sought after for their concentrated flavor and unique round bean shape.',
    continent: 'africa',
    articles: [
      { slug: 'stone-street-tanzania-peaberry-grind-and-brew', title: 'Stone Street Tanzania Peaberry Review' },
    ],
  },
  {
    id: 'malawi',
    name: 'Malawi',
    regions: ['Mzuzu Highlands', 'Misuku Hills'],
    production: 'Small',
    mainVarieties: ['Geisha', 'Catimor', 'Agaro'],
    primaryProcessing: ['Washed'],
    harvestMonths: [4, 9],
    altitudeRange: [1000, 1800],
    flavorProfile: ['Citrus', 'Floral', 'Stone Fruit', 'Clean'],
    description: 'Africa\'s overlooked origin and one of its most promising. Malawi\'s Mzuzu highlands produce clean, bright coffees with citrus and stone fruit character. The Misuku Hills sub-region is gaining specialty recognition.',
    continent: 'africa',
    articles: [
      { slug: 'malawi-coffee-africas-hidden-gem', title: 'Malawi Coffee: Africa\'s Hidden Gem' },
    ],
  },

  // ═══════════════════════════════════════
  // AMERICAS
  // ═══════════════════════════════════════
  {
    id: 'brazil',
    name: 'Brazil',
    regions: ['Minas Gerais', 'São Paulo', 'Espírito Santo', 'Bahia'],
    production: '~55M bags',
    worldRank: 1,
    mainVarieties: ['Mundo Novo', 'Catuai', 'Bourbon'],
    primaryProcessing: ['Natural', 'Pulped Natural'],
    harvestMonths: [5, 9],
    altitudeRange: [600, 1400],
    flavorProfile: ['Nutty', 'Chocolatey', 'Low Acidity', 'Heavy Body'],
    description: 'The world\'s largest coffee producer for over 150 years, responsible for roughly one-third of all coffee grown. Brazil\'s natural-process coffees set the baseline for what most people think of as "coffee flavor" — nutty, chocolatey, and full-bodied.',
    continent: 'americas',
    articles: [
      { slug: 'is-brazilian-coffee-any-good', title: 'Is Brazilian Coffee Any Good?' },
    ],
  },
  {
    id: 'colombia',
    name: 'Colombia',
    regions: ['Huila', 'Nariño', 'Antioquia', 'Tolima', 'Cauca'],
    production: '14.2M bags',
    worldRank: 3,
    mainVarieties: ['Caturra', 'Castillo', 'Colombia'],
    primaryProcessing: ['Washed'],
    harvestMonths: [3, 6], // Main crop; secondary Sep-Dec
    altitudeRange: [1200, 2000],
    flavorProfile: ['Balanced', 'Nutty', 'Caramel', 'Pleasant Acidity'],
    description: 'Three Andes mountain ranges create enormous microclimate diversity. Colombia\'s washed coffees are the gold standard for balanced, accessible specialty coffee — sweet, nutty, with bright but approachable acidity.',
    continent: 'americas',
    articles: [
      { slug: 'single-origin-colombian-coffee-what-flavor-notes-to-expect', title: 'Colombian Coffee: Flavor Profile Guide' },
      { slug: '6-colombian-coffees-reviewed-best-and-worst', title: '6 Colombian Coffees Reviewed and Ranked' },
    ],
  },
  {
    id: 'guatemala',
    name: 'Guatemala',
    regions: ['Antigua', 'Huehuetenango', 'Atitlán', 'Cobán', 'San Marcos'],
    production: '~3.5M bags',
    mainVarieties: ['Bourbon', 'Caturra', 'Catuai'],
    primaryProcessing: ['Washed'],
    harvestMonths: [12, 3],
    altitudeRange: [1300, 2000],
    flavorProfile: ['Chocolate', 'Nuts', 'Fruit', 'Bright Acidity'],
    description: 'Guatemala\'s volcanic soil produces some of Central America\'s most complex coffees. Antigua is famous for chocolate and spice; Huehuetenango for fruit-forward brightness. Eight distinct growing regions each offer unique character.',
    continent: 'americas',
    articles: [
      { slug: 'guatemala-coffee-review-regional-differences-and-best-coffees', title: 'Guatemalan Coffee: Regional Differences and Best Coffees' },
    ],
  },
  {
    id: 'costa-rica',
    name: 'Costa Rica',
    regions: ['Tarrazú', 'Central Valley', 'West Valley'],
    production: '~1.5M bags',
    mainVarieties: ['Caturra', 'Catuai', 'Villa Sarchi'],
    primaryProcessing: ['Washed', 'Honey'],
    harvestMonths: [11, 3],
    altitudeRange: [1200, 1800],
    flavorProfile: ['Bright', 'Clean', 'Sweet', 'Honey Process'],
    description: 'The only country in the world where planting Robusta is prohibited by law. Costa Rica pioneered the honey process and the micro-mill revolution, producing exceptionally clean, bright coffees with transparent origin character.',
    continent: 'americas',
    articles: [
      { slug: 'costa-rica-possibly-the-best-single-origin-coffee', title: 'Costa Rican Coffee: The Best Single Origin?' },
      { slug: 'what-does-costa-rican-coffee-taste-like', title: 'What Does Costa Rican Coffee Taste Like?' },
    ],
  },
  {
    id: 'el-salvador',
    name: 'El Salvador',
    regions: ['Apaneca-Ilamatepec', 'El Bálsamo-Quezaltepec'],
    production: '~700K bags',
    mainVarieties: ['Bourbon (68%)', 'Pacamara'],
    primaryProcessing: ['Washed', 'Honey'],
    harvestMonths: [11, 3],
    altitudeRange: [1200, 1800],
    flavorProfile: ['Sweet', 'Balanced', 'Chocolatey', 'Complex (Pacamara)'],
    description: 'Civil war preserved El Salvador\'s heirloom Bourbon trees — farmers couldn\'t afford to replant with modern varieties. Today those old trees produce remarkably sweet, complex cups. Pacamara, created here, is one of specialty coffee\'s most exciting varieties.',
    continent: 'americas',
    articles: [
      { slug: 'el-salvador-coffee-guide-pacamara', title: 'El Salvador Coffee Guide: Pacamara and Bourbon Heritage' },
    ],
  },
  {
    id: 'honduras',
    name: 'Honduras',
    regions: ['Marcala', 'Comayagua', 'Copán', 'Opalaca', 'Montecillos', 'Agalta'],
    production: '8.3M bags',
    mainVarieties: ['Bourbon', 'Caturra', 'Lempira'],
    primaryProcessing: ['Washed'],
    harvestMonths: [11, 4],
    altitudeRange: [1100, 1600],
    flavorProfile: ['Fruity', 'Sweet', 'Clean', 'Improving'],
    description: 'Central America\'s largest coffee producer and one of the fastest-improving origins in specialty. Marcala holds a Denomination of Origin designation. Honduras quietly produces enormous quantities of increasingly excellent coffee.',
    continent: 'americas',
    articles: [
      { slug: 'honduras-coffee-guide-marcala-comayagua', title: 'Honduras Coffee Guide: Marcala and Comayagua' },
    ],
  },
  {
    id: 'mexico',
    name: 'Mexico',
    regions: ['Chiapas', 'Veracruz', 'Oaxaca'],
    production: '~3.9M bags',
    mainVarieties: ['Typica', 'Bourbon', 'Caturra'],
    primaryProcessing: ['Washed'],
    harvestMonths: [11, 3],
    altitudeRange: [900, 1700],
    flavorProfile: ['Light Body', 'Clean', 'Delicate', 'Chocolate'],
    description: 'A major organic coffee producer with Chiapas as the most celebrated region. Mexican coffees tend toward gentle, approachable profiles — light body, clean sweetness, and delicate chocolate notes. Quietly consistent rather than flashy.',
    continent: 'americas',
    articles: [
      { slug: 'whats-the-flavor-of-mexican-coffee', title: 'Mexican Coffee: Flavor Profile and Growing Regions' },
    ],
  },
  {
    id: 'nicaragua',
    name: 'Nicaragua',
    regions: ['Jinotega', 'Matagalpa', 'Nueva Segovia'],
    production: '~2.5M bags',
    mainVarieties: ['Caturra', 'Bourbon', 'Catimor'],
    primaryProcessing: ['Washed'],
    harvestMonths: [11, 3],
    altitudeRange: [1100, 1600],
    flavorProfile: ['Balanced', 'Sweet', 'Fruity', 'Clean'],
    description: 'Often overshadowed by its Central American neighbors, Nicaragua produces increasingly excellent specialty coffee. Cup of Excellence competitions have revealed stunning lots from Jinotega and Nueva Segovia that rival Guatemala and Costa Rica.',
    continent: 'americas',
    articles: [
      { slug: 'is-nicaraguan-coffee-any-good', title: 'Is Nicaraguan Coffee Any Good?' },
    ],
  },
  {
    id: 'panama',
    name: 'Panama',
    regions: ['Boquete', 'Volcán', 'Renacimiento'],
    production: '~100K bags',
    mainVarieties: ['Typica', 'Geisha', 'Caturra'],
    primaryProcessing: ['Washed', 'Natural'],
    harvestMonths: [12, 3],
    altitudeRange: [1200, 1800],
    flavorProfile: ['Jasmine (Geisha)', 'Bergamot', 'Tropical Fruit', 'Tea-like'],
    description: 'Panama transformed specialty coffee economics when Hacienda La Esmeralda\'s Geisha variety broke auction records — from $21/lb in 2004 to over $350/lb. The most important variety discovery in modern specialty coffee, producing cups of jasmine, bergamot, and tropical fruit unlike anything else.',
    continent: 'americas',
    articles: [
      { slug: 'panama-coffee-guide-geisha-boquete', title: 'Panama Coffee Guide: Geisha, Boquete, and the World\'s Most Expensive Beans' },
      { slug: 'gesha-coffee-worth-the-price', title: 'Gesha Coffee: Worth the Price?' },
    ],
  },
  {
    id: 'peru',
    name: 'Peru',
    regions: ['Chanchamayo', 'Cajamarca', 'Cusco', 'San Martín'],
    production: '~4.2M bags',
    mainVarieties: ['Typica', 'Caturra', 'Bourbon'],
    primaryProcessing: ['Washed'],
    harvestMonths: [3, 9],
    altitudeRange: [1200, 1800],
    flavorProfile: ['Mild', 'Sweet', 'Clean', 'Balanced'],
    description: 'A major Fair Trade and organic coffee producer with enormous untapped potential. Peru\'s infrastructure challenges have historically limited quality, but the Chanchamayo Valley and Cajamarca regions are producing increasingly refined specialty lots.',
    continent: 'americas',
    articles: [
      { slug: 'peru-coffee-guide-chanchamayo', title: 'Peru Coffee Guide: Chanchamayo and Organic Excellence' },
    ],
  },
  {
    id: 'bolivia',
    name: 'Bolivia',
    regions: ['Yungas (Caranavi)', 'Coroico', 'Alto Beni'],
    production: 'Small',
    mainVarieties: ['Typica', 'Caturra', 'Catuai'],
    primaryProcessing: ['Washed'],
    harvestMonths: [7, 11],
    altitudeRange: [1400, 2300],
    flavorProfile: ['Sweet', 'Complex', 'Citrus', 'Floral'],
    description: 'One of the rarest and most rewarding origins in specialty coffee. Bolivia\'s extreme altitude in the Yungas valleys produces intensely sweet, complex cups. Small lot sizes and difficult logistics keep it off most radars — but those who find it are rewarded.',
    continent: 'americas',
    articles: [
      { slug: 'bolivia-coffee-rare-hidden-gem', title: 'Bolivia Coffee: Rare and Rewarding' },
    ],
  },
  {
    id: 'cuba',
    name: 'Cuba',
    regions: ['Sierra Maestra', 'Sierra del Escambray'],
    production: 'Small (declining)',
    mainVarieties: ['Typica', 'Bourbon'],
    primaryProcessing: ['Washed'],
    harvestMonths: [9, 2],
    altitudeRange: [800, 1200],
    flavorProfile: ['Mild', 'Sweet', 'Low Acidity', 'Smooth'],
    description: 'Cuban coffee has a storied cultural legacy — from Sierra Maestra mountain farms to the cafecito ritual. The US trade embargo makes genuine Cuban beans rare outside the island, but the coffee tradition runs deep.',
    continent: 'americas',
    articles: [
      { slug: 'what-is-cuban-coffee', title: 'What Is Cuban Coffee? History, Recipes, and Cafecito' },
    ],
  },
  {
    id: 'jamaica',
    name: 'Jamaica',
    regions: ['Blue Mountain'],
    production: 'Small',
    mainVarieties: ['Blue Mountain Typica'],
    primaryProcessing: ['Washed'],
    harvestMonths: [9, 3],
    altitudeRange: [900, 1700],
    flavorProfile: ['Mild', 'Sweet', 'Balanced', 'Clean'],
    description: 'Jamaica Blue Mountain is one of the most famous (and most expensive) coffee brands in the world. The protected designation requires beans grown between 3,000-5,500 feet in the Blue Mountains. Mild, sweet, and impeccably balanced — though the price premium is debated.',
    continent: 'americas',
    articles: [
      { slug: '10-of-the-worlds-most-expensive-coffees', title: '10 of the World\'s Most Expensive Coffees' },
    ],
  },

  // ═══════════════════════════════════════
  // ASIA & PACIFIC
  // ═══════════════════════════════════════
  {
    id: 'indonesia',
    name: 'Indonesia',
    regions: ['Sumatra', 'Java', 'Sulawesi', 'Bali', 'Flores'],
    production: '11.5M bags',
    worldRank: 4,
    mainVarieties: ['Typica', 'Catimor', 'S795'],
    primaryProcessing: ['Giling Basah (Semi-washed)'],
    harvestMonths: [6, 12],
    altitudeRange: [800, 1600],
    flavorProfile: ['Earthy', 'Woody', 'Herbal', 'Heavy Body', 'Low Acidity'],
    description: 'The third-largest coffee producer, famous for the distinctive heavy, earthy profile created by the unique giling basah (wet-hull) processing method. Sumatra\'s Mandheling and Lintong coffees are the archetype; Java, Sulawesi, and Flores offer cleaner variations.',
    continent: 'asia',
    articles: [
      { slug: 'what-does-indonesian-coffee-taste-like', title: 'Indonesian Coffee: A Flavor Guide by Island' },
      { slug: '7-sumatra-coffees-reviewed-best-and-worst', title: '7 Sumatra Coffees Reviewed and Ranked' },
    ],
  },
  {
    id: 'india',
    name: 'India',
    regions: ['Karnataka', 'Kerala', 'Tamil Nadu'],
    production: '5.3M bags',
    mainVarieties: ['Kent', 'S795', 'Selection 9'],
    primaryProcessing: ['Washed', 'Natural', 'Monsooned'],
    harvestMonths: [11, 3],
    altitudeRange: [800, 1600],
    flavorProfile: ['Mild', 'Balanced', 'Spicy (Monsooned: Heavy, Creamy, Zero Acidity)'],
    description: 'India\'s coffee is mild and balanced, but the real star is Monsooned Malabar — beans exposed to monsoon winds for 12-16 weeks, producing a heavy, creamy cup with virtually zero acidity. It\'s unlike anything else in the coffee world.',
    continent: 'asia',
    articles: [
      { slug: 'what-is-coffee-from-india-like', title: 'Indian Coffee: Flavor Profile and History' },
    ],
  },
  {
    id: 'yemen',
    name: 'Yemen',
    regions: ['Bani Mattar (Mattari)', 'Bani Ismail', 'Hayma'],
    production: 'Small (shrinking)',
    mainVarieties: ['Uncatalogued Heirlooms'],
    primaryProcessing: ['Natural'],
    harvestMonths: [10, 1],
    altitudeRange: [1500, 2500],
    flavorProfile: ['Wine-like', 'Fruity', 'Wild', 'Dried Fruit', 'Spice'],
    description: 'The first country to cultivate coffee commercially, and home of the legendary port of Mocha. Yemen\'s uncatalogued heirloom varieties and ancient natural processing produce wild, wine-like cups unlike anything else — dried fig, date, and exotic spice. Civil war and qat competition make it increasingly scarce.',
    continent: 'asia',
    articles: [
      { slug: 'yemen-coffee-guide-mocha-origin', title: 'Yemen Coffee Guide: The Port of Mocha' },
    ],
  },
  {
    id: 'china',
    name: 'China (Yunnan)',
    regions: ['Pu\'er', 'Baoshan', 'Dehong'],
    production: 'Growing (~2M bags)',
    mainVarieties: ['Catimor', 'Bourbon'],
    primaryProcessing: ['Washed', 'Natural'],
    harvestMonths: [10, 3],
    altitudeRange: [1000, 1800],
    flavorProfile: ['Improving', 'Sweet', 'Fruity', 'Clean'],
    description: 'The emerging origin that\'s getting serious about specialty. Yunnan province is investing heavily in quality infrastructure, and the results are showing — competition lots are earning international recognition. Still early days, but the trajectory is clear.',
    continent: 'asia',
    articles: [
      { slug: 'china-yunnan-coffee-emerging-origin', title: 'China Yunnan: The Emerging Origin' },
    ],
  },
  {
    id: 'myanmar',
    name: 'Myanmar',
    regions: ['Shan State', 'Shan Plateau'],
    production: 'Small (growing)',
    mainVarieties: ['Catimor', 'SL-34'],
    primaryProcessing: ['Washed', 'Natural'],
    harvestMonths: [11, 3],
    altitudeRange: [1000, 1600],
    flavorProfile: ['Bright', 'Floral', 'Fruity', 'Clean'],
    description: 'The newest frontier in specialty coffee. Myanmar\'s Shan State has the altitude, climate, and soil for excellent Arabica, and international investment is accelerating quality. Early specialty lots have surprised evaluators with their brightness and complexity.',
    continent: 'asia',
    articles: [
      { slug: 'myanmar-coffee-shan-state', title: 'Myanmar Coffee: Shan State and the Newest Frontier' },
    ],
  },
  {
    id: 'papua-new-guinea',
    name: 'Papua New Guinea',
    regions: ['Eastern Highlands', 'Western Highlands', 'Simbu'],
    production: '~1M bags',
    mainVarieties: ['Typica', 'Bourbon', 'Arusha'],
    primaryProcessing: ['Washed'],
    harvestMonths: [4, 9],
    altitudeRange: [1300, 1900],
    flavorProfile: ['Sweet', 'Fruity', 'Complex', 'Tropical'],
    description: 'Sweet, fruity, and seriously underrated. Papua New Guinea\'s highland coffees offer remarkable complexity for their price point. Difficult terrain and logistics keep production small, but the cup quality — tropical fruit, honey sweetness, bright acidity — rewards the adventurous drinker.',
    continent: 'asia',
    articles: [
      { slug: 'papua-new-guinea-makes-excellent-coffee', title: 'Papua New Guinea: Sweet, Fruity, and Underrated' },
    ],
  },
];

// Quick lookup by id
export const originById = new Map(origins.map(o => [o.id, o]));

// Check if a given month (1-12) falls within a harvest range
export function isInHarvest(origin: CoffeeOrigin, month: number): boolean {
  const [start, end] = origin.harvestMonths;
  if (start <= end) {
    return month >= start && month <= end;
  }
  // Wraps around year boundary (e.g., Oct-Feb = [10, 2])
  return month >= start || month <= end;
}
