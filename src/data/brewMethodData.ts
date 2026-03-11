// Brew method data for the interactive Brew Explorer ("The Brewing Constellations")

export type Branch = 'percolation' | 'immersion' | 'pressure';

export interface BrewMethod {
  id: string;
  name: string;
  branch: Branch;
  oneLiner: string;
  physics: string;
  whatMakesItUnique: string;
  parameters: {
    ratio: string;
    grindSize: string;
    waterTemp: string;
    brewTime: string;
    difficulty: 1 | 2 | 3;
  };
  comparisons: { methodId: string; relationship: string }[];
  articles: { slug: string; title: string }[];
}

export interface BranchInfo {
  id: Branch;
  name: string;
  subtitle: string;
  description: string;
}

export const branches: BranchInfo[] = [
  {
    id: 'percolation',
    name: 'Percolation',
    subtitle: 'Water flows through the coffee bed',
    description: 'Gravity pulls water through a bed of ground coffee. The grind creates resistance, controlling contact time and extraction. Paper filters produce clean, bright cups that highlight origin character.',
  },
  {
    id: 'immersion',
    name: 'Immersion',
    subtitle: 'Coffee steeps in the water',
    description: 'Ground coffee sits in water for a set time, extracting evenly and forgivingly. Immersion methods are the most approachable — timing matters more than technique, producing full-bodied, rounded cups.',
  },
  {
    id: 'pressure',
    name: 'Pressure',
    subtitle: 'Force drives water through coffee',
    description: 'Mechanical or steam pressure forces water through finely ground coffee. High pressure creates espresso\'s signature crema and concentrated intensity. Lower pressure methods like the Moka Pot produce strong, bold cups.',
  },
];

export const methods: BrewMethod[] = [
  // ═══════════════════════════════════════
  // PERCOLATION
  // ═══════════════════════════════════════
  {
    id: 'v60',
    name: 'Hario V60',
    branch: 'percolation',
    oneLiner: 'Cone-shaped pour over with spiral ridges for airflow',
    physics: 'Water percolates through a 60° cone. The single large hole and spiral ridges allow faster flow than flat-bottom brewers, giving the barista direct control over extraction through pour rate and pattern.',
    whatMakesItUnique: 'The V60 is the barista\'s instrument — more technique-dependent than any other pour over. Small changes in pour speed, pattern, and water temperature produce dramatically different cups. When dialed in, it produces the cleanest, most transparent expression of a coffee\'s origin character.',
    parameters: {
      ratio: '1:15 – 1:17',
      grindSize: 'Medium-fine',
      waterTemp: '92–96°C (198–205°F)',
      brewTime: '2:30 – 3:30',
      difficulty: 3,
    },
    comparisons: [
      { methodId: 'chemex', relationship: 'Similar pour-over physics but thinner filter — brighter, less body' },
      { methodId: 'clever', relationship: 'Both use paper filters for clarity, but Clever removes the pour technique variable' },
    ],
    articles: [
      { slug: 'ultimate-pour-over-coffee-guide-and-best-v60-technique', title: 'Pour Over Coffee Guide: V60 Technique and Brew Science' },
      { slug: 'making-coffee-with-the-oxo-brew-pour-over', title: 'OXO Brew Pour Over Review: Best Beginner Pour-Over Brewer?' },
      { slug: 'coffee-grind-size-guide-what-grind-for-every-brew-method', title: 'Coffee Grind Size Guide: Right Grind for Every Brew Method' },
    ],
  },
  {
    id: 'chemex',
    name: 'Chemex',
    branch: 'percolation',
    oneLiner: 'Elegant hourglass brewer with ultra-thick paper filters',
    physics: 'Water percolates through a bonded paper filter 20–30% thicker than standard filters. This removes more oils and fine particles, producing an exceptionally clean cup. The thick glass retains heat well during brewing.',
    whatMakesItUnique: 'The Chemex filter is the secret — it strips out nearly all coffee oils and sediment, producing the cleanest cup of any manual method. The result is tea-like clarity with delicate floral and fruit notes. It\'s also a design icon — in the permanent collection at MoMA.',
    parameters: {
      ratio: '1:15 – 1:17',
      grindSize: 'Medium-coarse',
      waterTemp: '93–96°C (200–205°F)',
      brewTime: '3:30 – 4:30',
      difficulty: 2,
    },
    comparisons: [
      { methodId: 'v60', relationship: 'Both pour overs, but Chemex\'s thicker filter removes more oils for a cleaner cup' },
      { methodId: 'french-press', relationship: 'Opposite ends of the clarity spectrum — Chemex strips oils, French Press keeps them all' },
    ],
    articles: [
      { slug: 'ultimate-pour-over-coffee-guide-and-best-v60-technique', title: 'Pour Over Coffee Guide: V60 Technique and Brew Science' },
      { slug: 'coffee-grind-size-guide-what-grind-for-every-brew-method', title: 'Coffee Grind Size Guide: Right Grind for Every Brew Method' },
    ],
  },
  {
    id: 'kalita',
    name: 'Kalita Wave',
    branch: 'percolation',
    oneLiner: 'Flat-bottom dripper with three small drain holes for even extraction',
    physics: 'Three small drain holes restrict flow more than a V60\'s single hole, creating a deeper water bed. The flat bottom ensures even extraction across the coffee bed. The waved paper filter minimizes contact with the brewer walls, reducing heat loss.',
    whatMakesItUnique: 'The most forgiving pour over. The restricted flow and flat bed mean your pour technique matters less — the brewer itself regulates extraction. Produces a balanced, sweet cup that sits between the V60\'s brightness and the Chemex\'s smoothness.',
    parameters: {
      ratio: '1:15 – 1:16',
      grindSize: 'Medium',
      waterTemp: '92–96°C (198–205°F)',
      brewTime: '3:00 – 4:00',
      difficulty: 1,
    },
    comparisons: [
      { methodId: 'v60', relationship: 'More forgiving than V60 — flat bed evens out pour technique mistakes' },
      { methodId: 'clever', relationship: 'Similar forgiveness level but different physics — Kalita is percolation, Clever is immersion' },
    ],
    articles: [
      { slug: 'ultimate-pour-over-coffee-guide-and-best-v60-technique', title: 'Pour Over Coffee Guide: V60 Technique and Brew Science' },
      { slug: 'coffee-grind-size-guide-what-grind-for-every-brew-method', title: 'Coffee Grind Size Guide: Right Grind for Every Brew Method' },
    ],
  },
  {
    id: 'drip',
    name: 'Drip Machine',
    branch: 'percolation',
    oneLiner: 'Automatic brewer that showers heated water over a flat coffee bed',
    physics: 'An electric heating element brings water to temperature and distributes it through a showerhead over a basket of ground coffee. Gravity pulls the water through the bed and a paper or mesh filter into a carafe below. The machine automates the pour rate and temperature — the two variables that manual pour-over methods leave to the barista.',
    whatMakesItUnique: 'The drip machine is the world\'s most common brewing method for a reason — it\'s completely hands-off and produces consistent results batch after batch. The best SCA-certified machines rival pour over quality by nailing the 92–96°C sweet spot and distributing water evenly. It\'s also the only method that can brew 8–12 cups at once without a commercial setup.',
    parameters: {
      ratio: '1:15 – 1:17',
      grindSize: 'Medium',
      waterTemp: '92–96°C (198–205°F)',
      brewTime: '4:00 – 8:00',
      difficulty: 1,
    },
    comparisons: [
      { methodId: 'kalita', relationship: 'Kalita is essentially a manual drip machine — same flat-bed physics, but you control the pour' },
      { methodId: 'v60', relationship: 'V60 gives more control and brightness, but a good drip machine matches it in consistency' },
    ],
    articles: [
      { slug: '7-popular-grind-and-brew-drip-coffee-makers-reviewed-a-buying-guide', title: 'Best Grind and Brew Coffee Makers: 7 Popular Models Ranked' },
    ],
  },
  {
    id: 'phin',
    name: 'Vietnamese Phin',
    branch: 'percolation',
    oneLiner: 'Single-cup metal filter that gravity-drips concentrate directly into your cup',
    physics: 'A small stainless steel chamber sits directly on the cup. Ground coffee is loaded, a perforated press plate compresses the bed, and hot water is added on top. Gravity slowly pulls water through the compressed coffee and the metal filter — no paper involved. The metal filter and slow drip produce a concentrate typically served over ice with sweetened condensed milk.',
    whatMakesItUnique: 'The phin is Vietnam\'s answer to espresso — a concentrated, full-bodied brew that pairs perfectly with condensed milk to create cà phê sữa đá, one of the world\'s great iced coffees. The metal filter lets oils through like a French Press, but the gravity percolation adds clarity. It\'s also the most portable and inexpensive way to make concentrate — the whole brewer fits in your palm and costs under $10.',
    parameters: {
      ratio: '1:4 – 1:6 (concentrate)',
      grindSize: 'Medium-coarse',
      waterTemp: '96°C (205°F)',
      brewTime: '4:00 – 6:00',
      difficulty: 1,
    },
    comparisons: [
      { methodId: 'v60', relationship: 'Both percolation, but phin\'s metal filter and slow drip produce a heavier, oilier concentrate' },
      { methodId: 'french-press', relationship: 'Both use metal filters for body, but phin is gravity percolation, not immersion' },
    ],
    articles: [],
  },

  // ═══════════════════════════════════════
  // IMMERSION
  // ═══════════════════════════════════════
  {
    id: 'french-press',
    name: 'French Press',
    branch: 'immersion',
    oneLiner: 'Full-immersion brewer with metal mesh plunger filter',
    physics: 'Coffee grounds steep fully submerged in hot water. The metal mesh filter allows oils and fine particles to pass through, producing heavy body and rich mouthfeel. Extraction is even and forgiving — grind consistency matters more than timing precision.',
    whatMakesItUnique: 'The French Press produces the most full-bodied cup of any common method. All the coffee oils that paper filters remove stay in the cup, creating a rich, almost creamy texture. It\'s the easiest method to master — if you can boil water and wait four minutes, you can make great French Press coffee.',
    parameters: {
      ratio: '1:15 – 1:17',
      grindSize: 'Coarse',
      waterTemp: '93–96°C (200–205°F)',
      brewTime: '4:00',
      difficulty: 1,
    },
    comparisons: [
      { methodId: 'clever', relationship: 'Both immersion, but Clever uses a paper filter for cleaner cups' },
      { methodId: 'aeropress', relationship: 'AeroPress can mimic French Press with a metal filter, but adds pressure for faster extraction' },
      { methodId: 'chemex', relationship: 'Opposite ends — French Press is oils-in, Chemex is oils-out' },
    ],
    articles: [
      { slug: 'how-to-use-a-french-press-the-most-amazing-coffee-youve-ever-had', title: 'How to Use a French Press: Complete Guide to Perfect Coffee' },
      { slug: 'coffee-grind-size-guide-what-grind-for-every-brew-method', title: 'Coffee Grind Size Guide: Right Grind for Every Brew Method' },
    ],
  },
  {
    id: 'clever',
    name: 'Clever Dripper',
    branch: 'immersion',
    oneLiner: 'Hybrid immersion brewer with a paper-filtered drawdown',
    physics: 'Coffee steeps in a sealed chamber like a French Press, then a valve releases when placed on a cup — the brew drains through a paper filter. Combines immersion\'s forgiveness with paper filtration\'s clarity.',
    whatMakesItUnique: 'The best of both worlds. You get the easy, forgiving steep of immersion brewing, but the clean, bright cup of a paper-filtered pour over. No technique required — just steep and release. Many specialty professionals consider it the most underrated brewer.',
    parameters: {
      ratio: '1:15 – 1:16',
      grindSize: 'Medium',
      waterTemp: '93–96°C (200–205°F)',
      brewTime: '2:30 – 3:30',
      difficulty: 1,
    },
    comparisons: [
      { methodId: 'french-press', relationship: 'Same immersion physics but paper filter gives dramatically cleaner cup' },
      { methodId: 'v60', relationship: 'Similar cup clarity but Clever removes the pour technique variable entirely' },
    ],
    articles: [
      { slug: 'the-clever-dripper-better-coffee-than-pour-over', title: 'Clever Dripper Review: Immersion + Pour Over in One Brewer' },
      { slug: 'coffee-grind-size-guide-what-grind-for-every-brew-method', title: 'Coffee Grind Size Guide: Right Grind for Every Brew Method' },
    ],
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    branch: 'immersion',
    oneLiner: 'Coarse grounds steeped in cold water for 12–24 hours',
    physics: 'Cold water extracts coffee compounds much more slowly than hot. The extended steep time compensates, but cold water is selective — it extracts sugars and smooth compounds while leaving behind many bitter and acidic molecules.',
    whatMakesItUnique: 'Cold brew\'s low acidity and natural sweetness come from the physics of cold extraction. It\'s not just "iced coffee" — it\'s a fundamentally different extraction that produces a smooth, chocolatey concentrate. Makes excellent batch coffee that keeps for up to two weeks refrigerated.',
    parameters: {
      ratio: '1:5 – 1:8 (concentrate)',
      grindSize: 'Extra coarse',
      waterTemp: 'Room temp or cold',
      brewTime: '12 – 24 hours',
      difficulty: 1,
    },
    comparisons: [
      { methodId: 'french-press', relationship: 'Same immersion physics, but cold water changes everything about what gets extracted' },
      { methodId: 'aeropress', relationship: 'Puck Puck attachment turns AeroPress into a slow-drip cold brewer' },
    ],
    articles: [
      { slug: 'whats-great-about-cold-brew-toddy-cold-brew-tutorial', title: 'Cold Brew Coffee Guide: Toddy System Tutorial + Science' },
      { slug: 'cold-brew-coffeewith-an-instant-pot', title: 'Instant Pot Cold Brew: Coffee Concentrate in 5 Minutes' },
      { slug: 'cold-brewing-coffee-with-the-coffeesock', title: 'CoffeeSock Cold Brew Review: Reusable Filter That Works' },
      { slug: 'puck-puck-amazing-aeropress-cold-brew-coffee', title: 'Puck Puck Review: Slow Drip Cold Brew with Your AeroPress' },
    ],
  },
  {
    id: 'siphon',
    name: 'Siphon',
    branch: 'immersion',
    oneLiner: 'Vacuum brewer that uses vapor pressure and gravity to cycle water through coffee',
    physics: 'Heating the lower chamber creates vapor pressure that pushes water up into the upper chamber where it steeps with the coffee. Removing heat creates a vacuum that pulls the brewed coffee back down through a filter. It\'s immersion brewing with a dramatic pressure-driven transfer.',
    whatMakesItUnique: 'The siphon is theatrical science — part chemistry lab, part performance art. The vacuum filtration produces a cup that\'s exceptionally clean and bright while retaining more body than paper-filtered methods. It\'s a conversation piece that also happens to make outstanding coffee, with a complexity and vibrancy that rewards light-roasted single origins.',
    parameters: {
      ratio: '1:14 – 1:16',
      grindSize: 'Medium-fine',
      waterTemp: '92–96°C (198–205°F)',
      brewTime: '1:30 – 2:30',
      difficulty: 3,
    },
    comparisons: [
      { methodId: 'french-press', relationship: 'Both immersion, but siphon\'s cloth/paper filter produces a much cleaner cup' },
      { methodId: 'v60', relationship: 'Similar cup clarity, but siphon\'s full immersion gives more body and different flavor development' },
    ],
    articles: [
      { slug: 'how-to-use-a-siphon-coffee-maker', title: 'How to Use a Siphon Coffee Maker: Complete Brewing Guide' },
    ],
  },
  {
    id: 'turkish',
    name: 'Turkish Coffee',
    branch: 'immersion',
    oneLiner: 'Ultra-fine grounds simmered in a cezve — the oldest brewing method still in daily use',
    physics: 'Powdered coffee is combined with water (and often sugar) in a small brass or copper pot called a cezve or ibrik. The mixture is heated until it froths and rises, then poured directly into the cup — grounds and all. This is decoction: the most aggressive extraction method, where near-boiling water extracts everything the grounds can give.',
    whatMakesItUnique: 'Turkish coffee is the original — predating every other method by centuries. The ultra-fine grind (finer than espresso) and lack of filtration produce an intensely flavored, full-bodied cup with a thick, silty texture. The grounds settle to the bottom, and in many cultures, the remaining sediment is read for fortune-telling. UNESCO recognized Turkish coffee culture as an Intangible Cultural Heritage in 2013.',
    parameters: {
      ratio: '1:9 – 1:12',
      grindSize: 'Extra fine (powder)',
      waterTemp: 'Just below boiling',
      brewTime: '2:00 – 3:00',
      difficulty: 2,
    },
    comparisons: [
      { methodId: 'french-press', relationship: 'Both unfiltered immersion, but Turkish uses powder-fine grounds and heat for a far more intense extraction' },
      { methodId: 'espresso', relationship: 'Both produce concentrated, intense coffee — Turkish through long contact time, espresso through pressure' },
    ],
    articles: [],
  },

  // ═══════════════════════════════════════
  // PRESSURE
  // ═══════════════════════════════════════
  {
    id: 'espresso',
    name: 'Espresso',
    branch: 'pressure',
    oneLiner: '9 bars of pressure forcing water through a fine coffee puck',
    physics: '9 bars (130 PSI) of pressure forces near-boiling water through a precisely ground, compressed puck of coffee in 25–30 seconds. This extreme pressure emulsifies oils and creates crema — the golden foam that carries aromatic compounds.',
    whatMakesItUnique: 'Espresso is the most concentrated coffee extraction — roughly 10x stronger than drip. The pressure creates textures and flavors impossible with gravity alone: crema, syrupy body, and an intensity that makes it the base for lattes, cappuccinos, and americanos. It\'s also the most demanding method — grind, dose, tamp, and timing all must be precise.',
    parameters: {
      ratio: '1:2 – 1:2.5',
      grindSize: 'Very fine',
      waterTemp: '90–96°C (194–205°F)',
      brewTime: '25 – 35 seconds',
      difficulty: 3,
    },
    comparisons: [
      { methodId: 'moka-pot', relationship: 'Both use pressure, but espresso\'s 9 bars vs Moka\'s 1.5 bars creates crema and more intensity' },
      { methodId: 'aeropress', relationship: 'AeroPress with Prismo attachment mimics espresso concentration but at much lower pressure' },
    ],
    articles: [
      { slug: 'best-espresso-machines-under-500-2026-7-picks-for-every-budget', title: 'Best Espresso Machines Under $500 in 2026: 7 Picks' },
      { slug: 'espresso-battle-royale-reviews-of-gaggia-breville-bambino-and-phillips-3200', title: 'Gaggia vs Breville vs Philips: Which Espresso Machine?' },
      { slug: 'whats-different-about-ristretto-or-lungo-espresso-shots', title: 'Ristretto vs Lungo vs Normal Espresso' },
    ],
  },
  {
    id: 'moka-pot',
    name: 'Moka Pot',
    branch: 'pressure',
    oneLiner: 'Stovetop brewer using steam pressure to push water upward through coffee',
    physics: 'Heating water in the sealed lower chamber creates steam pressure (~1.5 bars) that forces water up through a basket of ground coffee into the upper chamber. Lower pressure than espresso but still produces a strong, concentrated brew.',
    whatMakesItUnique: 'The Moka Pot is the espresso of the people — invented in 1933 Italy, found in 90% of Italian households. It produces a strong, bold cup without electricity or expensive equipment. The flavor is intense and slightly smoky, distinct from true espresso but sharing its concentrated character.',
    parameters: {
      ratio: '1:7 – 1:10',
      grindSize: 'Fine (but coarser than espresso)',
      waterTemp: 'Stovetop heat',
      brewTime: '4 – 5 minutes',
      difficulty: 2,
    },
    comparisons: [
      { methodId: 'espresso', relationship: 'Similar concentrated output, but ~1.5 bars vs 9 bars means no crema and different body' },
      { methodId: 'aeropress', relationship: 'Both produce concentrated coffee with manual pressure, very different technique' },
    ],
    articles: [
      { slug: 'moka-pot-brewing-guide', title: 'How to Use a Moka Pot: Complete Guide to Stovetop Espresso' },
      { slug: 'coffee-grind-size-guide-what-grind-for-every-brew-method', title: 'Coffee Grind Size Guide: Right Grind for Every Brew Method' },
    ],
  },
  {
    id: 'aeropress',
    name: 'AeroPress',
    branch: 'pressure',
    oneLiner: 'Portable plunger brewer combining immersion steep with hand pressure',
    physics: 'Coffee steeps briefly in the chamber (immersion), then hand pressure (~0.5 bars) forces the brew through a paper or metal filter. This hybrid approach extracts quickly while the filter controls clarity. The low pressure is gentler than espresso but faster than gravity.',
    whatMakesItUnique: 'The Swiss Army knife of coffee. Depending on your recipe, it can produce anything from espresso-like concentrate to clean pour-over style cups. It\'s virtually unbreakable, weighs 6oz, and has spawned its own World Championship. The most versatile single brewer you can own.',
    parameters: {
      ratio: '1:6 – 1:16 (varies widely)',
      grindSize: 'Medium-fine to fine',
      waterTemp: '80–96°C (176–205°F)',
      brewTime: '1:00 – 2:30',
      difficulty: 1,
    },
    comparisons: [
      { methodId: 'french-press', relationship: 'Both can do immersion, but AeroPress adds pressure and paper filtration for a cleaner cup' },
      { methodId: 'espresso', relationship: 'AeroPress + Prismo approximates espresso concentration at a fraction of the cost' },
      { methodId: 'cold-brew', relationship: 'With a Puck Puck attachment, AeroPress becomes a slow-drip cold brewer' },
    ],
    articles: [
      { slug: 'why-and-how-you-should-use-an-aeropress', title: 'AeroPress Brewing Guide: Standard and Inverted Methods' },
      { slug: 'world-aeropress-championships-best-recipe-of-last-5-years', title: 'World AeroPress Championship Recipes: Best of 5 Years Tested' },
      { slug: 'whats-the-best-metal-filter-for-an-aeropress', title: 'Best AeroPress Metal Filter: 3 Filters Tested vs Paper' },
      { slug: 'aeropress-accessories-prismo-blind-taste-test-an-honest-review', title: 'Fellow Prismo Review: Blind Taste Test Results' },
      { slug: 'puck-puck-amazing-aeropress-cold-brew-coffee', title: 'Puck Puck Review: Slow Drip Cold Brew with AeroPress' },
    ],
  },
];

// Cross-reference articles that apply to multiple methods / general science
export const scienceArticles = [
  { slug: 'coffee-extraction-yield-explained', title: 'Coffee Extraction Yield Explained' },
  { slug: 'whats-the-ideal-coffee-brewing-temperature', title: 'Coffee Brewing Temperature Guide: Ideal Ranges by Method' },
  { slug: 'coffee-grind-size-guide-what-grind-for-every-brew-method', title: 'Coffee Grind Size Guide: Right Grind for Every Brew Method' },
];

export const methodById = new Map(methods.map(m => [m.id, m]));
export const methodsByBranch = (branch: Branch) => methods.filter(m => m.branch === branch);
