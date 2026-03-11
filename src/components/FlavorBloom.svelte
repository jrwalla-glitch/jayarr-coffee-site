<script>
  import { onMount } from 'svelte';

  let activePetal = $state(null);
  let activeSub = $state(null);
  let activeCoffee = $state(null);
  let isMobile = $state(false);

  onMount(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    isMobile = mq.matches;
    const handler = (e) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  const cx = 330, cy = 250;

  const petals = [
    { id: 'fruity', label: 'Fruity', color: '#C17A3A', colorLight: '#D4944F', angle: 0,
      subs: ['Berry', 'Citrus', 'Stone Fruit', 'Tropical', 'Dried Fruit'] },
    { id: 'floral', label: 'Floral', color: '#B8847A', colorLight: '#CCACA4', angle: 60,
      subs: ['Jasmine', 'Rose', 'Tea-like', 'Perfumed'] },
    { id: 'sweet', label: 'Sweet', color: '#8B6F47', colorLight: '#A6895E', angle: 120,
      subs: ['Dark Chocolate', 'Milk Chocolate', 'Caramel & Toffee', 'Brown Sugar', 'Honey & Vanilla'] },
    { id: 'nutty', label: 'Nutty', color: '#A69070', colorLight: '#BBA98D', angle: 180,
      subs: ['Almond', 'Hazelnut', 'Peanut', 'Walnut & Pecan'] },
    { id: 'spiced', label: 'Spiced', color: '#9B7653', colorLight: '#B3926E', angle: 240,
      subs: ['Baking Spice', 'Pungent', 'Wine-like', 'Anise'] },
    { id: 'earthy', label: 'Earthy', color: '#7A7A60', colorLight: '#96967E', angle: 300,
      subs: ['Woody', 'Tobacco & Leather', 'Herbal', 'Savory'] },
  ];

  // Research-backed coffee picks — 78 coffees across 26 sub-categories, verified against roaster descriptions, Coffee Review scores, and independent reviewer confirmations
  const coffeeData = {
    'Berry': [
      { name: 'Counter Culture Idido', origin: 'Ethiopia', roast: 'Medium', notes: 'Blueberry, strawberry, tart cherry with chocolate sweetness.',
        description: 'Counter Culture has sourced Idido for years, making it one of the most reliably returning berry-forward Ethiopians on the market. The natural sundried lot delivers textbook blueberry intensity -- waves of strawberry and blueberry jam over tart cherry brightness and chocolate sweetness. Multiple independent reviewers confirm the berry character across seasons.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Counter Culture', url: 'https://counterculturecoffee.com/products/idido' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Counter-Culture-Coffee-Idido-Roast/dp/B0797HWSN5?tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/search?q=counter+culture+idido' },
        ]},
      { name: 'Black & White The Natural', origin: 'Ethiopia', roast: 'Medium', notes: 'Mixed berries, sangria, candied orange, peach rings.',
        description: 'Founded by the 2016 and 2017 US Barista Champions, Black & White designed The Natural as their year-round Ethiopian natural showcase -- built specifically to highlight berry and red fruit. The wide retail distribution (Williams-Sonoma, Crate & Barrel, Fellow, Sur La Table) makes it one of the most genuinely accessible specialty berry coffees in the country.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Black & White', url: 'https://www.blackwhiteroasters.com/products/the-natural' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=black+white+roasters+the+natural+coffee&tag=jayarrcoffee-20' },
          { retailer: 'Fellow', url: 'https://fellowproducts.com/products/black-and-white-the-natural' },
        ]},
      { name: 'Onyx Ethiopia Gedeb Banko Gotiti', origin: 'Ethiopia', roast: 'Light', notes: 'Strawberry, blueberry, dried plum, lychee berry with jasmine.',
        description: 'Onyx is one of the most awarded specialty roasters in the US, and they return to Banko Gotiti regularly. The natural-process lot consistently delivers dense berry sweetness -- strawberry and blueberry at the forefront with floral jasmine complexity underneath. The kind of coffee that makes you stop and pay attention.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Onyx Coffee Lab', url: 'https://onyxcoffeelab.com/products/ethiopia-gedeb-banko-gotiti' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=onyx+coffee+lab&tag=jayarrcoffee-20' },
        ]},
    ],
    'Citrus': [
      { name: 'George Howell Mamuto AA', origin: 'Kenya', roast: 'Light', notes: 'Grapefruit-citrus brightness, blackberry, plum with deep sweetness.',
        description: 'George Howell has sourced Mamuto since 2006 -- "it has never faltered." The SL28 varietal is genetically predisposed to high citric acidity, and it shows: this is a Grand Cru Kenyan with the grapefruit-citrus brightness that defines the best Kenya coffees. Deep sweetness keeps the acidity from being aggressive.',
        blogSlug: 'kenyan-coffee-flavor-notes-and-best-coffees', buyLinks: [
          { retailer: 'George Howell', url: 'https://georgehowellcoffee.com/products/mamuto-aa-ken-001' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=george+howell+mamuto+kenya&tag=jayarrcoffee-20' },
        ]},
      { name: 'Heart Coffee Kenya', origin: 'Kenya', roast: 'Light', notes: 'Rich grapefruit acidity with a sweet, lingering finish.',
        description: 'Heart is a Portland micro-roasting company known for precision light roasting that maximizes origin character. Their Kenya lots consistently showcase the grapefruit-forward acidity Kenya is famous for. The specific lot name rotates seasonally, but whatever Kenya they carry will deliver that electric citrus.',
        blogSlug: 'kenyan-coffee-flavor-notes-and-best-coffees', buyLinks: [
          { retailer: 'Heart Coffee', url: 'https://www.heartroasters.com/collections/all' },
        ]},
      { name: 'Intelligentsia Kenya', origin: 'Kenya', roast: 'Light', notes: 'Meyer lemon, grapefruit, tart berry with dense jammy character.',
        description: 'Intelligentsia has deep direct-trade relationships in Kenya and consistently sources lots with that signature bright, citric Kenyan character. Their national availability -- grocery stores, cafes, Amazon -- makes them one of the most accessible ways to try world-class Kenya citrus coffee without hunting down a micro-roaster.',
        blogSlug: 'kenyan-coffee-flavor-notes-and-best-coffees', buyLinks: [
          { retailer: 'Intelligentsia', url: 'https://www.intelligentsia.com/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=intelligentsia+kenya+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Stone Fruit': [
      { name: 'Verve Kayon Mountain', origin: 'Ethiopia', roast: 'Light', notes: 'Ripe apricot, white peach, sweet cream with juicy-bright acidity.',
        description: 'Verve has a long relationship with the Kayon Mountain farm, and this washed heirloom lot delivers textbook stone fruit. Apricot and white peach are not supporting notes but the headline flavor -- front and center from first sip through a lingering, juicy finish. Multiple Coffee Review ratings from various roasters confirm the apricot-forward profile.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Verve Coffee', url: 'https://www.vervecoffee.com/products/kayon-mountain' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=verve+coffee+kayon+mountain&tag=jayarrcoffee-20' },
        ]},
      { name: 'George Howell Worka Chelbessa', origin: 'Ethiopia', roast: 'Light', notes: 'Peach, cherry, honeyed-jasmine finish.',
        description: 'George Howell\'s Worka Chelbessa is a returning origin with peach and cherry as dominant notes confirmed across both roast levels. The medium roast specifically emphasizes "stewed peach" for maximum stone fruit saturation. The light roast adds floral brightness that lifts the fruit. Either way, it delivers.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'George Howell', url: 'https://georgehowellcoffee.com/products/worka-chelbessa-ethiopia' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=george+howell+worka+chelbessa&tag=jayarrcoffee-20' },
        ]},
      { name: 'Bean & Bean Las Lajas Red Honey', origin: 'Costa Rica', roast: 'Medium-Light', notes: 'Strawberry, orange, peach, green apple with honey sweetness.',
        description: 'Las Lajas is one of the most famous honey-processing farms in the world. The red honey process -- where more mucilage is left on the bean during drying -- specifically amplifies peach and stone fruit notes. This is not a one-off micro-lot: Las Lajas is a well-established farm that ships regularly, and the peach character is baked into the process.',
        blogSlug: 'what-does-costa-rican-coffee-taste-like', buyLinks: [
          { retailer: 'Bean & Bean', url: 'https://beannbeancoffee.com/products/red-honey-las-lajas-costa-rican' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=bean+bean+las+lajas+red+honey&tag=jayarrcoffee-20' },
        ]},
    ],
    'Tropical': [
      { name: 'Black & White Rodrigo Sanchez Mango', origin: 'Colombia', roast: 'Light', notes: 'Mango, passion fruit, pina colada from mango co-fermentation.',
        description: 'The gold standard for tropical-tasting coffee. The mango co-fermentation is not a gimmick -- it produces genuine, unmistakable mango and tropical flavors confirmed by multiple reviewers. Black & White describes it as "the most balanced of all co-ferment endeavors we\'ve ever tasted." They return to Rodrigo Sanchez regularly; this is their signature experimental line.',
        blogSlug: 'single-origin-colombian-coffee-what-flavor-notes-to-expect', buyLinks: [
          { retailer: 'Black & White', url: 'https://www.blackwhiteroasters.com/products/r-rodrigo-sanchez-mango' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=black+white+rodrigo+sanchez+mango+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Onyx Tropical Weather', origin: 'Ethiopia', roast: 'Light-Medium', notes: 'Mango nectar, pineapple, peach sweet tea, floral honey.',
        description: 'A year-round blend specifically designed to taste tropical -- the name tells you exactly what to expect. The blend format means Onyx can maintain the tropical profile by swapping components seasonally, and wide availability on Amazon and subscription services means you can actually get it. The most accessible entry point into genuinely tropical coffee.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Onyx Coffee Lab', url: 'https://onyxcoffeelab.com/products/tropical-weather' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Onyx-Coffee-Lab-Tropical-Espresso/dp/B0BHZYBCCQ?tag=jayarrcoffee-20' },
        ]},
      { name: 'Happy Mug Passion Fruit Co-Ferment', origin: 'Colombia', roast: 'Light', notes: 'Passion fruit, apple, cinnamon, chocolate, tropical fruit.',
        description: 'Happy Mug is known for offering specialty-grade coffee at much lower prices than competitors, and their honest descriptions confirm this delivers: "the passion fruit flavor is all over it." Budget-friendly entry point for co-fermented tropical coffee without sacrificing authenticity. The passion fruit co-fermentation produces unmistakable tropical fruit character.',
        blogSlug: 'single-origin-colombian-coffee-what-flavor-notes-to-expect', buyLinks: [
          { retailer: 'Happy Mug', url: 'https://happymugcoffee.com/products/colombia-passion-fruit-co-ferment' },
        ]},
    ],
    'Dried Fruit': [
      { name: 'Port of Mokha Yemen Al Wadi', origin: 'Yemen', roast: 'Medium', notes: 'Dried fig, raisin, date, orange blossom with dark chocolate.',
        description: 'Port of Mokha is the premier source for Yemen specialty coffee in the US. Yemen is THE origin for dried fruit notes -- date, fig, and raisin are baked into the terroir and traditional natural processing. Mokhtar Alkhanshali\'s sourcing is world-class. Yes, it\'s expensive ($40-60/bag), but Yemen coffee is inherently scarce, and Port of Mokha makes it as accessible as this origin gets.',
        blogSlug: 'yemen-coffee-guide-mocha-origin', buyLinks: [
          { retailer: 'Port of Mokha', url: 'https://portofmokha.com/pages/shop' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=port+of+mokha+yemen+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Al Mokha Yemen Medium Roast', origin: 'Yemen', roast: 'Medium', notes: 'Dried figs, date syrup, muscat grape, honey, cinnamon.',
        description: 'Al Mokha is the top online seller of 100% authentic Yemeni coffee -- more affordable and more consistently available than Port of Mokha\'s micro-lots. The dried fruit character (date, fig, raisin) is inherent to Yemen\'s terroir and processing tradition. Amazon availability makes this the most accessible way to try genuine Yemen coffee with real dried fruit notes.',
        blogSlug: 'yemen-coffee-guide-mocha-origin', buyLinks: [
          { retailer: 'Al Mokha', url: 'https://www.almokha.com/products/yemeni-medium' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Al-Mokha-Worlds-Coffee-Medium/dp/B00QRB6MUS?tag=jayarrcoffee-20' },
        ]},
      { name: 'Dancing Goats Sumatra Mutu Batak', origin: 'Indonesia', roast: 'Medium', notes: 'Fig bar, cacao nib, clove, dried mango with earthy depth.',
        description: 'The wet-hulled Sumatran process creates the earthy, fig-forward, dried-fruit character that defines this category. Mutu Batak is a consistent, reliable offering -- not a one-off lot. The fig bar note is prominent and genuine, and at roughly $20/bag it is much more affordable than Yemen. A practical everyday alternative for dried fruit lovers.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Dancing Goats', url: 'https://www.dancinggoats.com/products/sumatra-mandheling' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=batdorf+bronson+sumatra&tag=jayarrcoffee-20' },
        ]},
    ],
    'Jasmine': [
      { name: 'Red Rooster Ethiopia Mehbuba Guji', origin: 'Ethiopia', roast: 'Light', notes: 'Star jasmine, bergamot, wild honey, ripe apricot, lemon verbena.',
        description: 'A 97-point coffee with star jasmine and bergamot as primary descriptors -- not an afterthought, but the headline. Red Rooster is a small Floyd, Virginia organic micro-roaster that regularly carries Ethiopian lots from this region. The jasmine here is not subtle; it perfumes the room as you brew.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Red Rooster', url: 'https://www.redroostercoffee.com/collections/coffee' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=red+rooster+coffee+ethiopia&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/collections/red-rooster' },
        ]},
      { name: 'JBC Ethiopia Chelbessa', origin: 'Ethiopia', roast: 'Light', notes: 'Sweet citrus, apricot, jasmine with meyer lemon undertones.',
        description: 'JBC has a long track record with the Chelbessa washing station and consistently delivers jasmine-forward washed Ethiopians. Based in Madison, WI, JBC holds one of the highest average Coffee Review scores of any US roaster. Free shipping on 3+ bags makes repeat ordering painless.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'JBC Coffee', url: 'https://jbccoffeeroasters.com/shop/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=jbc+coffee+roasters&tag=jayarrcoffee-20' },
        ]},
      { name: 'Stumptown Ethiopia Suke Quto', origin: 'Ethiopia', roast: 'Light', notes: 'Sweet peach, jasmine, honey, lemon zest.',
        description: 'Stumptown has been purchasing from Suke Quto since 2010, making this one of the most reliably available jasmine-noted coffees in the US market. The jasmine note is a primary descriptor, not an afterthought. More accessible than micro-lot roasters -- available at grocery stores and through subscription services.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Stumptown', url: 'https://www.stumptowncoffee.com/products/ethiopia-suke-quto' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=stumptown+ethiopia+suke+quto&tag=jayarrcoffee-20' },
        ]},
    ],
    'Rose': [
      { name: 'Onyx Ethiopia Worka Chelbesa', origin: 'Ethiopia', roast: 'Light', notes: 'Earl Grey, bergamot, honeysuckle, cocoa with silky texture.',
        description: 'This is Onyx\'s fifth year carrying this coffee, so it is reliably available year after year. The Earl Grey/bergamot profile delivers that rose water complexity -- Earl Grey tea is flavored with bergamot oil, and this coffee naturally replicates that aromatic complexity. The silky texture completes the rose-water-like experience.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Onyx Coffee Lab', url: 'https://onyxcoffeelab.com/products/ethiopia-worka-chelbesa' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=onyx+coffee+lab&tag=jayarrcoffee-20' },
        ]},
      { name: 'Red Rooster Ethiopia Shantawene Washed', origin: 'Ethiopia', roast: 'Light', notes: 'Nectarine, bergamot, cocoa nib, nougat, wisteria.',
        description: 'The peach blossom + bergamot + wisteria combination creates exactly the rose water character this category targets. The wisteria note is unusual in coffee and adds genuine perfumed floral complexity beyond standard jasmine. Red Rooster sources this annually from the same washing station.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Red Rooster', url: 'https://www.redroostercoffee.com/products/ethiopia-shantawene-washed' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=red+rooster+coffee+shantawene&tag=jayarrcoffee-20' },
        ]},
      { name: 'Paradise Roasters Jamaica Blue Mountain Coffea Diversa Reserve', origin: 'Jamaica', roast: 'Light-Medium', notes: 'Meyer lemon, almond brittle, pink rose, baking chocolate, plum.',
        description: 'One of the rare coffees with "pink rose" as a confirmed tasting note from Coffee Review -- not just generic "floral." Paradise has a direct partnership with Coffea Diversa Jamaica providing access to curated lots. More expensive than Ethiopian options (from $50), but genuinely delivers rose character that most coffees only hint at.',
        buyLinks: [
          { retailer: 'Paradise Roasters', url: 'https://paradiseroasters.com/products/jamaica-blue-mountain-coffea-diversa-reserve' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=paradise+roasters+jamaica+blue+mountain&tag=jayarrcoffee-20' },
        ]},
    ],
    'Tea-like': [
      { name: 'Counter Culture Idido (Washed)', origin: 'Ethiopia', roast: 'Light', notes: 'Lemon drop, jasmine, melon, bergamot tea with delicate body.',
        description: 'Counter Culture\'s 17-year partnership with Idido (through 2026) makes this one of the most reliable tea-like coffees on the US market. The "delicate, tea-like body" is the signature characteristic reviewers consistently cite. Available at Whole Foods nationwide, making it the most accessible recommendation in the entire Floral family.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Counter Culture', url: 'https://counterculturecoffee.com/products/idido' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Counter-Culture-Coffee-Idido-Roast/dp/B0797HWSN5?tag=jayarrcoffee-20' },
        ]},
      { name: 'George Howell Worka Chelbessa (Washed, Light)', origin: 'Ethiopia', roast: 'Light', notes: 'Peach, cherry, honeyed-jasmine finish with tea-like delicacy.',
        description: 'George Howell is a pioneer of specialty coffee, and his light-roasted Worka Chelbessa is frequently described as having a "tea-like delicacy" that defines the sub-category. The honeyed-jasmine finish gives it approachability. George Howell has sourced from Yirgacheffe farms since the 1970s -- this is a deep-knowledge pick from someone who helped define what specialty coffee means.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'George Howell', url: 'https://georgehowellcoffee.com/products/worka-chelbessa-ethiopia' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=george+howell+worka+chelbessa&tag=jayarrcoffee-20' },
        ]},
      { name: 'Stumptown Ethiopia Nano Challa', origin: 'Ethiopia', roast: 'Light', notes: 'Bright citrus, tea-like clarity, jasmine, floral.',
        description: 'Stumptown explicitly describes the cup profile as expressing "tea-like qualities" and "tea-like and floral qualities we love in Ethiopian coffees." The light body and citrus clarity make this genuinely tea-like rather than merely floral. Nano Challa has been in Stumptown\'s lineup for years -- not a one-off lot, and available at grocery retailers.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Stumptown', url: 'https://www.stumptowncoffee.com/products/ethiopia-nano-challa' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=stumptown+ethiopia+nano+challa&tag=jayarrcoffee-20' },
        ]},
    ],
    'Perfumed': [
      { name: 'JBC Ethiopia Halo Beriti', origin: 'Ethiopia', roast: 'Light', notes: 'Jammy pear, meyer lemon, jasmine, raspberry, lavender, honey.',
        description: 'One of the few widely available specialty coffees with both lavender AND honey as confirmed tasting notes from a top-tier roaster -- not artificial flavoring, but naturally occurring aromatics preserved by JBC\'s light roast. The Halo Beriti washing station has earned Cup of Excellence awards. JBC sources from this station regularly, so equivalent lots return each year.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'JBC Coffee', url: 'https://jbccoffeeroasters.com/shop/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=jbc+coffee+roasters+ethiopia&tag=jayarrcoffee-20' },
        ]},
      { name: 'Red Rooster Ethiopia Ayla Bombe Washed', origin: 'Ethiopia', roast: 'Light', notes: 'Lavender, bergamot, nectarine, wild honey, ripe blackberry.',
        description: 'Lavender + wild honey as primary descriptors is exactly the perfumed profile. The bergamot adds aromatic intensity, and the nectarine provides the sweet underpinning. Red Rooster sources Ayla Bombe as a regular offering from the same Sidama region that produces their other top-scoring Ethiopians.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Red Rooster', url: 'https://www.redroostercoffee.com/products/ethiopia-ayla-bombe-washed' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=red+rooster+coffee+ethiopia&tag=jayarrcoffee-20' },
        ]},
      { name: 'Brandywine Ethiopia Aleta Wondo', origin: 'Ethiopia', roast: 'Light', notes: 'Jasmine, Earl Grey, tangerine, wild honey.',
        description: 'The combination of jasmine + wild honey + Earl Grey creates an intensely aromatic, perfumed cup. Brandywine is a respected micro-roaster from Wilmington, Delaware, known for precise light roasting that preserves delicate aromatics. The wild honey note specifically indicates the natural sweetness that defines the perfumed sub-category.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Brandywine Coffee', url: 'https://www.brandywinecoffeeroasters.com/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=brandywine+coffee+roasters&tag=jayarrcoffee-20' },
        ]},
    ],
    'Dark Chocolate': [
      { name: 'Counter Culture Forty-Six', origin: 'Blend', roast: 'Dark', notes: 'Dark chocolate, smoky undertones, bittersweet cacao.',
        description: 'One of the rare specialty-grade dark roasts that genuinely leads with dark chocolate and smoke while preserving sweetness and complexity. Counter Culture built this blend to prove that dark roast can be specialty-quality, and multiple reviewers confirm the sweet-smoky-chocolate trifecta. Available at Whole Foods and many grocery stores.',
        buyLinks: [
          { retailer: 'Counter Culture', url: 'https://counterculturecoffee.com/products/12-oz-forty-six' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Counter-Culture-Coffee-Forty-Whole/dp/B0764KPS75?tag=jayarrcoffee-20' },
        ]},
      { name: 'Onyx Monarch', origin: 'Blend', roast: 'Medium-Dark', notes: 'Bittersweet dark chocolate, cacao, molasses, mulled wine, dried berries.',
        description: 'Onyx describes "complex sugar browning notes from Swiss chocolate to cacao with molasses" -- this is their intentional dark-chocolate-forward espresso blend. The velvety mouthfeel is remarkable, and the chocolate intensifies with milk. From the roaster ranked #1 coffee shop in the world (2026).',
        buyLinks: [
          { retailer: 'Onyx Coffee Lab', url: 'https://onyxcoffeelab.com/products/monarch' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Onyx-Coffee-Lab-Monarch-Espresso/dp/B0BZ4N7LRW?tag=jayarrcoffee-20' },
        ]},
      { name: 'George Howell Alchemy Espresso', origin: 'Blend', roast: 'Medium-Dark', notes: 'Dark chocolate brownie, dark caramel, raspberry jam, nougat.',
        description: 'Three origins chosen specifically for chocolate depth -- Brazil for velvety body, Costa Rica for nougat and milk-chocolate sweetness, Guatemala for bittersweet chocolate-and-nuts complexity. Multiple reviewers confirm the "luscious dark chocolate" as the dominant impression. Also available through Cometeer for single-serve convenience.',
        buyLinks: [
          { retailer: 'George Howell', url: 'https://georgehowellcoffee.com/products/alchemy-espresso-alc-001' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/George-Howell-Coffee-Alchemy-Espresso/dp/B0DLBDK1XP?tag=jayarrcoffee-20' },
        ]},
    ],
    'Milk Chocolate': [
      { name: 'La Colombe Nizza', origin: 'Blend', roast: 'Medium', notes: 'Milk chocolate, roasted nuts, honey-sweet nuttiness, caramel.',
        description: 'This is the espresso behind every La Colombe cafe drink -- and there\'s a reason it\'s their foundation. "Honey-sweet, roasted nuttiness" with milk chocolate as the dominant note. Low acidity, creamy body, and one of the most widely available specialty coffees in the country (grocery stores, cafes, Amazon).',
        buyLinks: [
          { retailer: 'La Colombe', url: 'https://www.lacolombe.com/products/nizza' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Colombe-Coffee-Whl-Bean-Nizza/dp/B00MZXU6CW?tag=jayarrcoffee-20' },
        ]},
      { name: 'Black & White The Classic', origin: 'Blend', roast: 'Medium', notes: 'Caramel, black cherry, milk chocolate with balanced acidity.',
        description: 'Designed as their approachable "breakfast-style" coffee that leads with clean acidity and milk chocolate. The Colombia/Uganda washed combination delivers a clean, creamy cup with prominent milk chocolate and restrained acidity. From the same roaster behind The Natural -- same quality, different direction.',
        buyLinks: [
          { retailer: 'Black & White', url: 'https://www.blackwhiteroasters.com/products/the-classic' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=black+white+roasters+the+classic&tag=jayarrcoffee-20' },
        ]},
      { name: 'Intelligentsia Frequency Blend', origin: 'Blend', roast: 'Medium', notes: 'Milk chocolate, toasted almond, dried fruits, smooth full body.',
        description: 'Intelligentsia explicitly describes the Brazil component as contributing "a smooth body and predominant note of milk chocolate." This is their everyday crowd-pleaser, built on a milk-chocolate foundation with nutty support. Available at Target, Kroger, Harris Teeter, and most Whole Foods -- the definition of accessible specialty.',
        buyLinks: [
          { retailer: 'Intelligentsia', url: 'https://www.intelligentsia.com/products/frequency-blend' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Intelligentsia-Coffee-Frequency-Direct-Medium/dp/B00P7EB7BU?tag=jayarrcoffee-20' },
        ]},
    ],
    'Caramel & Toffee': [
      { name: 'Ceremony Coffee Thesis', origin: 'Blend', roast: 'Medium', notes: 'Cookie dough, brown sugar, caramel, toffee finish, vanilla.',
        description: 'A direct bullseye for caramel and toffee. Multiple independent reviewers confirm the caramel-toffee-brown sugar trifecta. Bean Box reviewers specifically call out cookie/caramel/vanilla. The roaster designs this blend to maximize sugar-browning sweetness, and it shows in every sip.',
        buyLinks: [
          { retailer: 'Ceremony Coffee', url: 'https://ceremonycoffee.com/products/thesis' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Ceremony-Coffee-Roasters-Specialty-Coffee/dp/B01922C1US?tag=jayarrcoffee-20' },
        ]},
      { name: 'Stumptown Holler Mountain', origin: 'Blend', roast: 'Medium', notes: 'Citrus zest, caramel, hazelnut, toffee.',
        description: 'The Latin American base delivers the caramel/toffee sweetness while East African beans add brightness that keeps it from being flat. The caramel note intensifies as the cup cools. Full-bodied, creamy, organic, and one of the most widely available specialty coffees in America -- grocery stores, Amazon, everywhere.',
        buyLinks: [
          { retailer: 'Stumptown', url: 'https://www.stumptowncoffee.com/products/holler-mountain' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Stumptown-Coffee-Roasters-Organic-Mountain/dp/B008J4Z3C4?tag=jayarrcoffee-20' },
        ]},
      { name: 'Greater Goods Take Me Home', origin: 'Costa Rica', roast: 'Medium', notes: 'Sticky toffee, caramel, marzipan, vanilla bean with blood orange.',
        description: 'Honey processing from Tarrazu produces intense natural sweetness, and multiple retailers independently describe "toffee, marzipan, and vanilla" as the core notes. The sticky-toffee descriptor is particularly apt. From Greater Goods (Roast Magazine Roaster of the Year 2021) -- serious quality from an award-winning operation.',
        blogSlug: 'what-does-costa-rican-coffee-taste-like', buyLinks: [
          { retailer: 'Greater Goods', url: 'https://greatergoodsroasting.com/products/take-me-home' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=greater+goods+take+me+home+coffee&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/take-me-home-costa-rica/p/1864' },
        ]},
    ],
    'Brown Sugar': [
      { name: 'Brandywine Colombia Santa Barbara Estate', origin: 'Colombia', roast: 'Medium', notes: 'Milk chocolate, brown sugar, cherry.',
        description: 'The official tasting notes lead with brown sugar as a primary descriptor. The washed process keeps it clean while the medium roast develops the sugar-browning sweetness. Cherry provides the stone fruit element. Consistent year-round offering (harvest Oct-May) from one of Delaware\'s most respected micro-roasters.',
        blogSlug: 'single-origin-colombian-coffee-what-flavor-notes-to-expect', buyLinks: [
          { retailer: 'Brandywine Coffee', url: 'https://www.brandywinecoffeeroasters.com/products/colombia-santa-barbara-estate-12oz' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=brandywine+coffee+santa+barbara&tag=jayarrcoffee-20' },
        ]},
      { name: 'Counter Culture Hologram', origin: 'Blend', roast: 'Medium', notes: 'Brown sugar, fig, red fruit syrup, milk chocolate.',
        description: 'The natural-sundried coffees provide the syrupy body and stone fruit punch, while washed coffees add chocolate and pastry. A reviewer explicitly called out "brown sugar and fig right off the bat." The syrupy mouthfeel is a defining characteristic confirmed across multiple reviews. Widely available at grocery stores with Amazon backup.',
        buyLinks: [
          { retailer: 'Counter Culture', url: 'https://counterculturecoffee.com/products/12-oz-hologram' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Counter-Culture-Coffee-Hologram-Whole/dp/B018CSY0R0?tag=jayarrcoffee-20' },
        ]},
      { name: 'Greater Goods Kickstart Espresso', origin: 'Blend', roast: 'Medium', notes: 'Dark chocolate, brown sugar, rose.',
        description: 'Greater Goods (Roast Magazine Roaster of the Year) explicitly leads with "dark chocolate and brown sugar sweetness" as the primary descriptors. The espresso blend format means it\'s designed for syrupy extraction with heavy body. The rose note adds an unexpected floral lift.',
        buyLinks: [
          { retailer: 'Greater Goods', url: 'https://greatergoodsroasting.com' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=greater+goods+kickstart+espresso&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/products/kickstart' },
        ]},
    ],
    'Honey & Vanilla': [
      { name: 'Bean & Bean Costa Rica Las Lajas Black Honey', origin: 'Costa Rica', roast: 'Medium', notes: 'Orange, strawberry, vanilla, watermelon with honey sweetness.',
        description: 'A textbook match -- honey-processed coffee with vanilla as an official tasting note and citrus (orange) as a primary flavor. The Chacon family pioneered honey processing in Costa Rica, leaving maximum mucilage for maximum sweetness. Organic, Fair Trade. Extremely approachable for newcomers to specialty coffee.',
        blogSlug: 'what-does-costa-rican-coffee-taste-like', buyLinks: [
          { retailer: 'Bean & Bean', url: 'https://beannbeancoffee.com/products/black-honey-las-lajas-costa-rican' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Bean-Costa-Rica-Honey-Coffee/dp/B09C323YGK?tag=jayarrcoffee-20' },
        ]},
      { name: 'Verve Streetlevel', origin: 'Blend', roast: 'Medium', notes: 'Honeyed citrus, red apple, honeycomb finish, dark chocolate.',
        description: 'The honey and citrus descriptors are confirmed across multiple independent sources. The honeycomb finish is the standout -- approachable, balanced, and built for everyday drinking. The Central American blend base provides the sweet, clean foundation. Available at Crate & Barrel for gift-giving appeal.',
        buyLinks: [
          { retailer: 'Verve Coffee', url: 'https://www.vervecoffee.com/products/streetlevel' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/VERVE-COFFEE-ROASTERS-Streetlevel-Coffee/dp/B079JR53F2?tag=jayarrcoffee-20' },
        ]},
      { name: 'Ceremony Coffee Mass Appeal', origin: 'Blend', roast: 'Medium-Light', notes: 'Maple pecan, vanilla, caramel, milk chocolate, sugar cookie.',
        description: 'The vanilla and maple/honey sweetness are front and center. "All chocolate and caramel -- a sweet tooth\'s dream" per the roaster. The extremely low acidity and sweet profile make it one of the most approachable specialty coffees available. Works with any brew method, and the name says it all.',
        buyLinks: [
          { retailer: 'Ceremony Coffee', url: 'https://ceremonycoffee.com/products/mass-appeal' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Ceremony-Coffee-Roasters-Mass-Espresso/dp/B01A7MA9UG?tag=jayarrcoffee-20' },
        ]},
    ],
    'Almond': [
      { name: 'Intelligentsia Frequency Blend', origin: 'Blend', roast: 'Medium', notes: 'Toasted almond, milk chocolate, dried fruit with smooth body.',
        description: 'The almond note is prominent and explicitly called out by Intelligentsia. Low acidity, smooth body, and milk chocolate make this a textbook match for almond lovers. Year-round availability and wide retail distribution (Target, Kroger, Whole Foods) make it one of the most accessible specialty coffees in the country.',
        buyLinks: [
          { retailer: 'Intelligentsia', url: 'https://www.intelligentsia.com/products/frequency-blend' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Intelligentsia-Coffee-Frequency-Direct-Medium/dp/B00P7EB7BU?tag=jayarrcoffee-20' },
        ]},
      { name: 'George Howell Tarrazu Dota', origin: 'Costa Rica', roast: 'Light', notes: 'Almond, milk chocolate, nougat, peach.',
        description: 'The almond-nougat-milk chocolate profile is exactly this sub-category. George Howell sources this coffee year-round from the same region, so it stays consistent. The light roast preserves the delicate almond note without roast bitterness. From the man who founded the Cup of Excellence program.',
        blogSlug: 'what-does-costa-rican-coffee-taste-like', buyLinks: [
          { retailer: 'George Howell', url: 'https://store.georgehowellcoffee.com/coffees/dota-costa-rica.html' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=george+howell+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Intelligentsia Black Cat Organic Espresso', origin: 'Blend', roast: 'Medium', notes: 'Caramel, honeydew melon, dark chocolate and toasted almond finish.',
        description: 'The dark chocolate + toasted almond finish is the signature of this espresso. Full-bodied mouthfeel with clean flavors and low-toned acidity. Works beautifully as brewed coffee too, not just espresso. Available at Target and Whole Foods for easy pickup.',
        buyLinks: [
          { retailer: 'Intelligentsia', url: 'https://www.intelligentsia.com/products/organic-black-cat-espresso' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Intelligentsia-Black-Certified-Organic-Espresso/dp/B0055ZRULM?tag=jayarrcoffee-20' },
        ]},
    ],
    'Hazelnut': [
      { name: 'Coffee Bros. Medium Roast', origin: 'Blend', roast: 'Medium', notes: 'Hazelnut, brown sugar, red fruit with balanced body.',
        description: 'A near-exact match for the sub-category -- hazelnut is the lead note, paired with red fruit and brown sugar sweetness. The Brazil component provides the hazelnut and body; the Ethiopia provides the red fruit. Roasted to order with Tuesday/Saturday ship days. Recognized by Forbes and multiple award bodies.',
        buyLinks: [
          { retailer: 'Coffee Bros.', url: 'https://coffeebros.com/products/medium-roast-coffee-blend' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=coffee+bros+medium+roast&tag=jayarrcoffee-20' },
        ]},
      { name: 'Stumptown Holler Mountain', origin: 'Blend', roast: 'Medium', notes: 'Citrus zest, caramel, hazelnut with chocolaty texture.',
        description: 'Hazelnut is one of the three official tasting notes. The caramel sweetness and full body create the "balanced and round" profile. One of the most widely available specialty coffees in America -- you can find it at most grocery stores, making it the easiest hazelnut pick to actually try.',
        buyLinks: [
          { retailer: 'Stumptown', url: 'https://www.stumptowncoffee.com/products/holler-mountain' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Stumptown-Coffee-Roasters-Organic-Mountain/dp/B008J4Z3C4?tag=jayarrcoffee-20' },
        ]},
      { name: 'JBC Guatemala Finca Santa Isabel', origin: 'Guatemala', roast: 'Medium-Light', notes: 'Cocoa powder, date, hazelnut, freesia, cedar.',
        description: 'Hazelnut and cocoa explicitly paired in the cupping notes -- a direct match. JBC is a five-time Good Food Award winner with hundreds of 90+ Coffee Review scores. Note: JBC rotates single origins seasonally, so this specific lot may not always be available, but they consistently source Guatemalan coffees with similar profiles.',
        blogSlug: 'guatemala-coffee-review-regional-differences-and-best-coffees', buyLinks: [
          { retailer: 'JBC Coffee', url: 'https://jbccoffeeroasters.com/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=jbc+coffee+roasters&tag=jayarrcoffee-20' },
        ]},
    ],
    'Peanut': [
      { name: 'Greater Goods Good Vibes', origin: 'Brazil', roast: 'Medium', notes: 'Cacao nibs, peanut butter, dried cherry with rich body.',
        description: 'Peanut butter is the lead tasting note confirmed across multiple independent reviewers (Trade Coffee, MistoBox, Bean Box, Crema.co). Heavy, smooth body with dark cocoa makes this the quintessential comfort coffee. Natural process Brazils are the origin archetype for peanut notes, and this is a year-round staple starting at just $10.',
        blogSlug: 'is-brazilian-coffee-any-good', buyLinks: [
          { retailer: 'Greater Goods', url: 'https://greatergoodsroasting.com/products/good-vibes' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Good-Vibes-Brazil-Roasted-Greater/dp/B0F22SNJQ2?tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/products/good-vibes-brazil' },
        ]},
      { name: 'Red Bird Espresso', origin: 'Blend', roast: 'Medium-Dark', notes: 'Peanut, chocolate, caramel -- tastes like a Snickers bar.',
        description: 'The "Snickers" reputation is well-documented across home-barista.com, Coffee Cantata, and multiple review sites. The peanut-chocolate-caramel profile emerges reliably, especially as the coffee rests 10-15 days post-roast. A favorite of the home espresso community for over a decade. All coffees roasted to order.',
        buyLinks: [
          { retailer: 'Red Bird Coffee', url: 'https://redbirdcoffee.com/products/red-bird-espresso' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=red+bird+espresso+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Buena Vista Brazil Organic', origin: 'Brazil', roast: 'Medium', notes: 'Peanut butter, chocolate, toffee.',
        description: 'All three cupping notes match the sub-category perfectly. The single-estate sourcing from a consistent farm means the flavor profile stays reliable season to season. Organic certification is a bonus for those who prioritize it. From a small Colorado roaster that takes quality seriously.',
        blogSlug: 'is-brazilian-coffee-any-good', buyLinks: [
          { retailer: 'Buena Vista Roastery', url: 'https://bvroastery.com/products/organic-brazilian-coffee' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=buena+vista+roastery+brazil&tag=jayarrcoffee-20' },
        ]},
    ],
    'Walnut & Pecan': [
      { name: 'Onyx Southern Weather', origin: 'Blend', roast: 'Medium', notes: 'Milk chocolate, plum, candied walnuts, pecan pie sweetness.',
        description: 'Both walnut and pecan are explicitly called out across multiple reviewers. The "pecan pie" descriptor appears independently from multiple sources -- that is not marketing, that is consensus. Caramel/brown sugar sweetness and mild citrus acidity complete the profile. Year-round flagship blend, widely available, and consistently excellent.',
        buyLinks: [
          { retailer: 'Onyx Coffee Lab', url: 'https://onyxcoffeelab.com/products/southern-weather' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Onyx-Coffee-Lab-Southern-Specialty/dp/B08JJKKVRC?tag=jayarrcoffee-20' },
        ]},
      { name: 'George Howell Dota Dark', origin: 'Costa Rica', roast: 'Dark', notes: 'Dark chocolate, caramel, walnut with rich smoothness.',
        description: 'Walnut and caramel are two of the three primary tasting notes. The dark roast brings warmth and body while George Howell\'s quality control ensures no bitter over-roast. The "warm and inviting" descriptor fits this coffee perfectly. Year-round offering for those who want their nut notes in a darker, richer package.',
        blogSlug: 'what-does-costa-rican-coffee-taste-like', buyLinks: [
          { retailer: 'George Howell', url: 'https://georgehowellcoffee.com/products/dota-french-roast-costa-rica-copy' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=george+howell+dota+french+roast&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/products/tarrazu-french' },
        ]},
      { name: 'Huckleberry Civitas Blend', origin: 'Peru', roast: 'Medium-Dark', notes: 'Toffee, nutty, chocolate with caramel stroopwafel pairing.',
        description: 'The toffee-nutty-chocolate core delivers the warm and inviting comfort profile. The Peruvian origin provides mild acidity and full body. The caramel stroopwafel milk pairing confirms the caramel warmth. Widely distributed including Target, Amazon, and Trade Coffee.',
        blogSlug: 'peru-coffee-guide-chanchamayo', buyLinks: [
          { retailer: 'Huckleberry Roasters', url: 'https://huckleberryroasters.com/products/civitas-blend' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Civitas-Blend-Roasted-Huckleberry-Roasters/dp/B0DV9VL9Y8?tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/civitas/p/2199' },
        ]},
    ],
    'Baking Spice': [
      { name: 'JBC Pantan Musara Sumatra', origin: 'Indonesia', roast: 'Medium', notes: 'Black grape, nutmeg, graham cracker, plum, bergamot.',
        description: 'The nutmeg and graham cracker notes are textbook baking spice. Unusual for Sumatra, this lot is washed -- removing some of the earthy funk while keeping the spice and thick body that Sumatran coffees are famous for. Fellow Products featured it in a dedicated brew guide, which says something about the quality.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'JBC Coffee', url: 'https://jbccoffeeroasters.com/product/pantan-musara-2/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=jbc+coffee+sumatra&tag=jayarrcoffee-20' },
        ]},
      { name: 'Equator Sumatra Queen Ketiara', origin: 'Indonesia', roast: 'Medium-Light', notes: 'Vanilla, milk chocolate, pipe tobacco, clove, tangerine.',
        description: 'The clove, pipe tobacco, and vanilla combination directly maps to baking spice warmth. Sourced exclusively from the women members of the Ketiara Co-op ("Queen" designation) -- the story behind the coffee is as compelling as the cup. Fair Trade Organic certified. Year-round staple offering.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Equator Coffees', url: 'https://www.equatorcoffees.com/products/sumatra-queen-ketiara-fair-trade-organic' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=equator+coffees+sumatra&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/products/sumatra-queen-ketiara-fair-trade-organic-nugyuujk' },
        ]},
      { name: 'Stumptown Indonesia Bies Penantan', origin: 'Indonesia', roast: 'Medium', notes: 'Dark chocolate, pineapple, clove with savory spice aroma.',
        description: 'The clove note is explicit from the roaster, and multiple reviewers confirm baking-spice character with a full, earthy body. Stumptown has worked with Ketiara since 2013, making this a consistent annual offering. Available at grocery stores and Amazon -- the most accessible baking spice pick.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Stumptown', url: 'https://www.stumptowncoffee.com/products/indonesia-bies-penantan' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Stumptown-Coffee-Roasters-Indonesia-Sumatra/dp/B008J50M92?tag=jayarrcoffee-20' },
        ]},
    ],
    'Pungent': [
      { name: 'Paradise Roasters Aged Sumatra Semiga', origin: 'Indonesia', roast: 'Medium-Dark', notes: 'Pipe tobacco, scorched clove, dark chocolate, ripe banana.',
        description: 'The 7-year aging amplifies the cedar/tobacco/dark chocolate axis to an extreme level of intensity and complexity. "Scorched clove" is almost aggressive spice -- exactly the pungent character this sub-category asks for. The heavy mouthfeel and viscosity add to the intense, lingering impression. From a Minnesota nano-roaster that specializes in aged coffees.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Paradise Roasters', url: 'https://paradiseroasters.com/products/aged-sumatra-semiga-7' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=paradise+roasters+aged+sumatra&tag=jayarrcoffee-20' },
        ]},
      { name: 'Happy Mug Sulawesi Toraja Sapan Minanga', origin: 'Indonesia', roast: 'Medium', notes: 'Black pepper, tobacco, chocolate with orange rind hints.',
        description: 'Black pepper is an explicit, confirmed tasting note. Coffee Review scored Victrola\'s version of this same lot at 90 with notes of "cedar, pungent, bittersweet chocolate." Happy Mug is also excellent value (typically $12-14/bag) -- serious pungent character at a price that lets you experiment.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Happy Mug', url: 'https://happymugcoffee.com/products/sulawesi-toraja-mananga' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=happy+mug+sulawesi+toraja&tag=jayarrcoffee-20' },
        ]},
      { name: 'Volcanica Sulawesi Reserve', origin: 'Indonesia', roast: 'Dark', notes: 'Bold cinnamon, cardamom, black pepper, dark chocolate.',
        description: 'The dark roast pushes cedar and dark chocolate notes forward while the Toraja terroir delivers the peppery spice. Volcanica roasts to order and is widely available, making this a reliable, accessible pick for those who want serious intensity. The heavy body and pungent character match the sub-category perfectly.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Volcanica Coffee', url: 'https://volcanicacoffee.com/products/sulawesi-reserve-coffee-celebes-kalossi' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Volcanica-Sulawesi-Reserve-Coffee-16-ounce/dp/B08TB16PC1?tag=jayarrcoffee-20' },
        ]},
    ],
    'Wine-like': [
      { name: 'Red Rooster Ethiopia Worka Sakaro Anaerobic Natural', origin: 'Ethiopia', roast: 'Light', notes: 'Blackberry cobbler, dark chocolate fudge, almond nougat, cedar.',
        description: 'Coffee Review literally describes this as a "blackberry cobbler" coffee. The anaerobic natural process intensifies the fermented fruit character beyond what standard natural processing achieves. The blackberry and dark chocolate fudge combination is bold and distinctive. Red Rooster brings this back annually with fresh crop -- their most popular single origin.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Red Rooster', url: 'https://www.redroostercoffee.com/products/ethiopia-worka-sakaro-anaerobic-natural' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Red-Rooster-Coffee-Roaster-Ethiopia/dp/B0CHT42Y5Q?tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/products/ethiopia-worka-sakaro-anaerobic-natural-1' },
        ]},
      { name: 'Stauf\'s Ethiopia Moka Harrar', origin: 'Ethiopia', roast: 'Medium', notes: 'Dark chocolate, red wine, blueberries, blackberries.',
        description: 'This is the quintessential wine-like coffee. Ethiopian Harrar is historically THE origin associated with "winey" character, and Stauf\'s explicitly lists "red wine" as a primary tasting note alongside blackberry. The natural process amplifies the fermented fruit qualities. Heavy body adds boldness. A classic for a reason.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Stauf\'s Coffee', url: 'https://www.staufs.com/single-origin/ethiopia-moka-harrar' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+harrar+natural+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Black & White The Natural', origin: 'Ethiopia', roast: 'Light-Medium', notes: 'Mixed berries, sangria, candied orange with sparkling acidity.',
        description: '"Sangria" is an explicit tasting note -- literally a wine-fruit punch descriptor. This is Black & White\'s flagship natural Ethiopian, designed to showcase the bold, fermented-fruit, wine-like character of natural processing. The composition rotates seasonally but the wine-like profile is consistent. Widely available year-round.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Black & White', url: 'https://www.blackwhiteroasters.com/products/the-natural' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=black+white+roasters+the+natural&tag=jayarrcoffee-20' },
          { retailer: 'Fellow', url: 'https://fellowproducts.com/products/black-and-white-the-natural' },
        ]},
    ],
    'Anise': [
      { name: 'Al Mokha Yemen Dark Roast', origin: 'Yemen', roast: 'Dark', notes: 'Anise seed, cumin, aromatic wood, date sugar, dry cocoa.',
        description: 'Yemen coffees are the most reliably anise-forward specialty origin. The dark roast emphasizes the licorice/anise character while the natural processing adds dark cherry sweetness. The chocolate and dried fruit (dates, figs) create the lingering herbal finish. Yemen is the original coffee origin with heirloom cultivars that have been grown the same way for centuries.',
        blogSlug: 'yemen-coffee-guide-mocha-origin', buyLinks: [
          { retailer: 'Al Mokha', url: 'https://www.almokha.com/products/yemeni-dark' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=al+mokha+yemen+dark+roast&tag=jayarrcoffee-20' },
        ]},
      { name: 'Prime Roast Sumatran Dark', origin: 'Indonesia', roast: 'Dark', notes: 'Dark chocolate, cherry, licorice with earthy depth.',
        description: 'One of the few specialty coffees that explicitly lists licorice alongside dark cherry and chocolate as primary tasting notes -- a direct match for the entire anise sub-category definition. Sumatra Mandheling is broadly known for "sweet chocolate and licorice tones," and the dark roast pushes the licorice character forward. Budget-friendly path to anise/licorice notes.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Prime Roast', url: 'https://primeroastcoffee.com/product/sumatran-coffee/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=sumatra+dark+roast+licorice+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Onyx Monarch', origin: 'Blend', roast: 'Medium-Dark', notes: 'Bittersweet dark chocolate, mulled wine, molasses, dried berries.',
        description: 'The mulled wine note is key -- mulled wine inherently contains star anise and warming spices. The bittersweet dark chocolate plus molasses creates a lingering, herbal-sweet finish. While Monarch doesn\'t have explicit "anise" in its descriptors, the mulled wine + dark chocolate + molasses + dried berry combination creates the same sensory impression. Also the most widely available and accessible coffee in this sub-category.',
        buyLinks: [
          { retailer: 'Onyx Coffee Lab', url: 'https://onyxcoffeelab.com/products/monarch' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Onyx-Coffee-Lab-Monarch-Espresso/dp/B0BZ4N7LRW?tag=jayarrcoffee-20' },
        ]},
    ],
    'Woody': [
      { name: 'Peach Coffee Blue Sunda Estate Java', origin: 'Indonesia', roast: 'Medium', notes: 'Cedar, dark chocolate, tobacco, dried fruit, black tea.',
        description: 'A more refined, complex expression of Indonesian woody character than typical Sumatra. Java estate coffees are smoother than their Sumatran neighbors while retaining that woody backbone. The 94-point Coffee Review score and specific cedar + dark chocolate + spice notes make it a standout in a category where many coffees blur together.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Peach Coffee', url: 'https://www.peachcoffeeroasters.com/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=blue+sunda+estate+java+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Stumptown Indonesia Sumatra', origin: 'Indonesia', roast: 'Medium-Dark', notes: 'Cedar, herb, dark chocolate with wine-toned fruit undercurrents.',
        description: 'The wet-hulled processing gives this coffee its hallmark cedar and earthy-herbal character. Stumptown\'s version is widely available, consistently high-quality, and the most accessible expression of the classic woody Sumatra profile. The cedar note is prominent and well-documented by multiple reviewers.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Stumptown', url: 'https://www.stumptowncoffee.com/collections/coffee' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/Stumptown-Coffee-Roasters-Indonesia-Sumatra/dp/B008J50M92?tag=jayarrcoffee-20' },
        ]},
      { name: 'George Howell Sumatra Lintong', origin: 'Indonesia', roast: 'Medium', notes: 'Pipe tobacco, butterscotch, cedar, full-bodied nuts.',
        description: 'George Howell\'s Sumatra Lintong specifically calls out cedar and pipe tobacco with a butterscotch sweetness that rounds out the woody character. The herb-accented profile adds complexity that elevates it above generic "earthy Sumatra" territory. Seasonal availability -- check their rotating single-origin selections.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'George Howell', url: 'https://georgehowellcoffee.com/collections/all-coffee' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=george+howell+sumatra+lintong&tag=jayarrcoffee-20' },
        ]},
    ],
    'Tobacco & Leather': [
      { name: 'Paradise Roasters Aged Sumatra Semiga', origin: 'Indonesia', roast: 'Medium-Dark', notes: 'Pipe tobacco, scorched clove, dark chocolate with syrupy-smooth body.',
        description: 'The gold standard for tobacco-forward coffee. The 7-year aging process intensifies pipe tobacco, leather, and dark cocoa notes to a level that fresh-crop coffee simply cannot reach. Paradise Roasters specializes in aged coffees and this is their flagship. If you want to know what tobacco and leather actually taste like in coffee, this is where you start.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Paradise Roasters', url: 'https://paradiseroasters.com/products/aged-sumatra-semiga-7' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=paradise+roasters+aged+sumatra&tag=jayarrcoffee-20' },
        ]},
      { name: 'Peet\'s Aged Sumatra', origin: 'Indonesia', roast: 'Dark', notes: 'Sweet wood, leather, pipe tobacco -- rugged and wild.',
        description: 'The most accessible aged Sumatra on the market. Peet\'s has been sourcing and aging Sumatran coffee since Alfred Peet started the company. The dark roast amplifies the bold, rugged tobacco-and-leather character. Much easier to find than Paradise Roasters, and the Islay whisky comparison tells you exactly what kind of drinker this is for.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Peet\'s Coffee', url: 'https://www.peets.com/products/aged-sumatra' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=peets+aged+sumatra&tag=jayarrcoffee-20' },
        ]},
      { name: 'Telluride Aged Sumatra', origin: 'Indonesia', roast: 'Medium', notes: 'Sweet wood, leather, pipe tobacco with molasses-like body.',
        description: 'The roaster\'s own description literally uses the words "sweet wood, leather, and pipe tobacco" -- a direct match for this sub-category. The 3-year aging in parchment (shorter than Paradise\'s 7-year) creates a more approachable version of the aged profile while still delivering bold leather and tobacco character. The medium+ roast lets the aging character come through without being dominated by roast flavors.',
        blogSlug: 'what-does-indonesian-coffee-taste-like', buyLinks: [
          { retailer: 'Telluride Coffee', url: 'https://telluridecoffeeroasters.net/product/aged-sumatra/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=telluride+aged+sumatra+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Herbal': [
      { name: 'Sey Coffee Hamasho Honey', origin: 'Ethiopia', roast: 'Light', notes: 'Chamomile, nectarine, limeade finish.',
        description: 'The best match in specialty coffee for genuine chamomile notes. Sey Coffee is one of the most respected light-roast-focused roasters in the US (Brooklyn, NY), and their Hamasho lot specifically features chamomile as a primary tasting note -- not filler marketing, but a confirmed, repeatable cup characteristic across multiple vintage years. The honey process and Ethiopian heirloom varieties from the Bombe Mountains create this genuinely delicate, herbal-floral profile.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Sey Coffee', url: 'https://www.seycoffee.com/collections/coffee' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=sey+coffee+hamasho&tag=jayarrcoffee-20' },
        ]},
      { name: 'Peet\'s Peru Cajamarca Organic', origin: 'Peru', roast: 'Medium-Light', notes: 'Chamomile, baking spice, soft fruit, hint of dark chocolate.',
        description: 'Peru Cajamarca is an under-recognized origin for herbal-noted coffees. Peet\'s tasters specifically called out chamomile as the leading note. More accessible and affordable than Sey, though availability is seasonal. Beansmith Coffee\'s Peru Cajamarca (90 points Coffee Review) was also noted for "a hint of sage," confirming that Cajamarca coffees genuinely produce herbal character.',
        blogSlug: 'peru-coffee-guide-chanchamayo', buyLinks: [
          { retailer: 'Peet\'s Coffee', url: 'https://www.peets.com/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=peets+peru+cajamarca&tag=jayarrcoffee-20' },
        ]},
      { name: 'Equator Ethiopian Sidama Natural', origin: 'Ethiopia', roast: 'Light', notes: 'Chamomile, apricot, brown sugar, black tea, rose.',
        description: 'The chamomile note is specifically listed among the cupping notes alongside black tea and other herbal/floral descriptors. The natural process from Sidama creates a more complex, fruit-layered version of the herbal profile than the Sey pick. Equator is a certified B Corp roaster in the San Francisco Bay Area. Their Ethiopian offerings rotate seasonally, but they consistently source Sidama naturals with this herbal character.',
        blogSlug: 'ethiopian-coffee-flavors-and-varieties', buyLinks: [
          { retailer: 'Equator Coffees', url: 'https://www.equatorcoffees.com/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=equator+coffees+ethiopian+sidama&tag=jayarrcoffee-20' },
        ]},
    ],
    'Savory': [
      { name: 'Conscious Cup Kenya AA Kiri', origin: 'Kenya', roast: 'Light-Medium', notes: 'Tomato leaf, red currant, candied violet, cedar, almond butter.',
        description: 'A 95-point Coffee Review score with "vibrantly umami" as a primary descriptor. The tomato leaf and red currant notes are the classic Kenya savory-sweet balance that defines umami in coffee. SL28/SL34 varieties from Kirinyaga are the apex of Kenyan umami character. This is not generic "earthy" -- it is genuinely, specifically savory in a way that surprises people expecting coffee to taste like coffee.',
        blogSlug: 'kenyan-coffee-flavor-notes-and-best-coffees', buyLinks: [
          { retailer: 'Conscious Cup', url: 'https://consciouscup.com/' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=conscious+cup+kenya+aa+kiri&tag=jayarrcoffee-20' },
        ]},
      { name: 'Klatch Kenya Thunguri AA', origin: 'Kenya', roast: 'Light-Medium', notes: 'Ripe tomato, black currant, almond brittle, jasmine, oak.',
        description: 'The "ripe tomato" note is the headline descriptor in Coffee Review\'s 94-point review. Klatch is a multiple-time award-winning roaster (World Brewing Championship winners). The 100% SL28 varietal composition maximizes the umami/tomato character that this variety is famous for. More reliably available than Conscious Cup since Klatch is a larger operation.',
        blogSlug: 'kenyan-coffee-flavor-notes-and-best-coffees', buyLinks: [
          { retailer: 'Klatch Coffee', url: 'https://www.klatchroasting.com/products/kenya-thunguri-aa' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=klatch+kenya+thunguri&tag=jayarrcoffee-20' },
        ]},
      { name: 'Fulcrum Myanmar Oat Twin', origin: 'Myanmar', roast: 'Light', notes: 'Green tea, red bell pepper, tomato jam -- savory and creamy.', blogSlug: 'myanmar-coffee-shan-state',
        description: 'The wildcard pick -- a genuinely unusual savory coffee from a rare origin. Myanmar is one of the newest specialty coffee origins, and Fulcrum\'s Oat Twin lot has specific tasting notes of "tomato jam" and "red bell pepper" that you almost never see in coffee. This is a different expression of savory character from a completely different terroir. The green tea note adds the "surprising" element. Will genuinely shock people who have never had savory coffee before.',
        buyLinks: [
          { retailer: 'Fulcrum Coffee', url: 'https://www.fulcrumcoffee.com/products/myanmar-oat-twin' },
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=fulcrum+coffee+myanmar&tag=jayarrcoffee-20' },
        ]},
    ],
  };

  // Petals scaled up slightly for more presence
  const petalRx = 70;
  const petalRy = 96;
  const petalOffset = 76;

  function petalCenter(angle) {
    const rad = angle * Math.PI / 180;
    return { x: cx + petalOffset * Math.sin(rad), y: cy - petalOffset * Math.cos(rad) };
  }

  function labelPos(angle) {
    const rad = angle * Math.PI / 180;
    const dist = petalOffset + 24;
    return { x: cx + dist * Math.sin(rad), y: cy - dist * Math.cos(rad) };
  }

  const subsX = 580;

  function connectorStart(angle) {
    const rad = angle * Math.PI / 180;
    const dist = petalOffset + petalRy * 0.65;
    return { x: cx + dist * Math.sin(rad), y: cy - dist * Math.cos(rad) };
  }

  let renderOrder = $derived.by(() => {
    const indices = petals.map((_, i) => i);
    if (activePetal === null) return indices;
    return indices.filter(i => i !== activePetal).concat([activePetal]);
  });

  let recommendations = $derived(activeSub ? (coffeeData[activeSub] || []) : []);

  function handlePetalClick(index) {
    if (activePetal === index) {
      activePetal = null;
      activeSub = null;
      activeCoffee = null;
    } else {
      activePetal = index;
      activeSub = null;
      activeCoffee = null;
    }
  }

  function handleSubClick(petalIndex, subName) {
    activeCoffee = null;
    activeSub = activeSub === subName ? null : subName;
  }

  function handleCoffeeClick(coffeeName) {
    activeCoffee = activeCoffee === coffeeName ? null : coffeeName;
  }
</script>

<div class="bloom-container">
  <div class="bloom-header">
    <h1>Discover Your Flavor</h1>
  </div>

  <div class="bloom-wrapper">
    <svg viewBox={isMobile ? "130 50 400 380" : "0 30 700 460"} xmlns="http://www.w3.org/2000/svg" class="bloom-svg">
      {#each renderOrder as i (petals[i].id)}
        {@const petal = petals[i]}
        {@const pc = petalCenter(petal.angle)}
        {@const lp = labelPos(petal.angle)}
        {@const isActive = activePetal === i}
        {@const isDimmed = activePetal !== null && activePetal !== i}
        <g
          class="petal-group"
          class:active={isActive}
          class:dimmed={isDimmed}
          style="transform-origin: {pc.x}px {pc.y}px;"
          onclick={() => handlePetalClick(i)}
          role="button"
          tabindex="0"
          onkeydown={(e) => e.key === 'Enter' && handlePetalClick(i)}
          aria-label={`${petal.label} flavors`}
        >
          <ellipse
            cx={pc.x}
            cy={pc.y}
            rx={petalRx}
            ry={petalRy}
            fill={isActive ? petal.colorLight : petal.color}
            stroke={isActive ? '#C17A3A' : 'none'}
            stroke-width={isActive ? 2.5 : 0}
            class="petal-shape"
            transform={`rotate(${petal.angle}, ${pc.x}, ${pc.y})`}
          />
          <text
            x={lp.x}
            y={lp.y}
            class="petal-label"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {petal.label}
          </text>
        </g>
      {/each}

      <!-- Center circle with coffee bean -->
      <circle cx={cx} cy={cy} r="24" fill="#F5F0E8" stroke="#C17A3A" stroke-width="1.5" />
      <g transform={`translate(${cx - 8}, ${cy - 10}) scale(0.65)`}>
        <path d="M12.5 2C9.5 2 6 5 6 10c0 5.5 3.5 9 6.5 9s6.5-3.5 6.5-9c0-5-3.5-8-6.5-8zm0 1.5c0 3.5-1.5 6-1.5 7.5s1.5 4 1.5 7" stroke="#C17A3A" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      </g>

      <!-- Layer 2: Sub-categories (SVG — desktop only) -->
      {#if activePetal !== null && !isMobile}
        {@const ap = petals[activePetal]}
        {@const cs = connectorStart(ap.angle)}
        <g class="sub-group show">
          <line
            x1={cs.x} y1={cs.y}
            x2={subsX - 76} y2={cy}
            stroke="#C17A3A" stroke-width="1" stroke-dasharray="4 3" opacity="0.4"
          />
          {#each ap.subs as sub, j}
            {@const pillY = cy + (j * 34) - ((ap.subs.length - 1) * 34 / 2)}
            <g
              class="sub-item"
              class:sub-active={activeSub === sub}
              onclick={(e) => { e.stopPropagation(); handleSubClick(activePetal, sub); }}
              role="button"
              tabindex="0"
              onkeydown={(e) => { if (e.key === 'Enter') handleSubClick(activePetal, sub); }}
              aria-label={sub}
            >
              <rect
                x={subsX - 74}
                y={pillY - 13}
                width="148"
                height="28"
                rx="14"
                fill={activeSub === sub ? '#C17A3A' : '#F5F0E8'}
                stroke="#C17A3A"
                stroke-width="1"
                class="sub-pill"
              />
              <text
                x={subsX}
                y={pillY + 1}
                text-anchor="middle"
                dominant-baseline="middle"
                class="sub-label"
                fill={activeSub === sub ? '#F5F0E8' : '#1A1A1A'}
              >
                {sub}
              </text>
            </g>
          {/each}
        </g>
      {/if}
    </svg>
  </div>

  <!-- Layer 2: Sub-categories (HTML — mobile only) -->
  {#if activePetal !== null && isMobile}
    <div class="mobile-subs">
      {#each petals[activePetal].subs as sub}
        <button
          class="mobile-sub-pill"
          class:mobile-sub-active={activeSub === sub}
          onclick={() => handleSubClick(activePetal, sub)}
        >
          {sub}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Layer 3: Coffee recommendations -->
  {#if activeSub && recommendations.length > 0}
    <div class="recs-section">
      <h2 class="recs-heading">{activeSub} Coffees</h2>
      <div class="recs-grid">
        {#each recommendations as coffee (coffee.name)}
          {@const isExpanded = activeCoffee === coffee.name}
          <div
            class="rec-card"
            class:expanded={isExpanded}
            onclick={() => handleCoffeeClick(coffee.name)}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && handleCoffeeClick(coffee.name)}
          >
            <!-- Collapsed state -->
            <div class="rec-header">
              <h3 class="rec-name">{coffee.name}</h3>
              <span class="rec-roast">{coffee.roast}</span>
            </div>
            <p class="rec-origin">{coffee.origin}</p>
            <p class="rec-notes">{coffee.notes}</p>

            <!-- Expanded detail (Layer 4) -->
            {#if isExpanded}
              <div class="rec-detail" role="region" aria-label="Coffee details" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
                <div class="rec-detail-inner">
                  <div class="rec-detail-left">
                    <p class="rec-description">{coffee.description}</p>
                    {#if coffee.blogSlug}
                      <a href={`/blog/${coffee.blogSlug}/`} class="rec-guide-link">
                        Read our guide &rarr;
                      </a>
                    {/if}
                  </div>
                  <div class="rec-detail-right">
                    <span class="rec-buy-label">Find this coffee</span>
                    {#each coffee.buyLinks as link}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rec-buy-btn"
                        onclick={(e) => e.stopPropagation()}
                      >
                        {link.retailer}
                      </a>
                    {/each}
                  </div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <p class="bloom-hint">
    {#if activeCoffee}
      Click a retailer to find this coffee
    {:else if activeSub}
      Click a coffee to learn more
    {:else if activePetal !== null}
      Select a flavor note to find your coffee
    {:else}
      Select a flavor family to begin your journey
    {/if}
  </p>
</div>

<style>
  .bloom-container {
    max-width: 780px;
    margin: 0 auto;
    padding: 1rem 1rem;
    text-align: center;
  }

  .bloom-header h1 {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    font-size: 2.75rem;
    color: #1A1A1A;
    letter-spacing: -0.02em;
    margin-bottom: 0.25rem;
  }

  .bloom-wrapper {
    position: relative;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
  }

  .bloom-svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  /* Petal expand animation */
  .petal-group {
    cursor: pointer;
    outline: none;
    transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .petal-group.active {
    transform: scale(1.18);
  }

  .petal-group.dimmed {
    opacity: 0.2;
    transform: scale(0.92);
  }

  .petal-shape {
    transition: fill 0.3s ease, stroke 0.3s ease, filter 0.2s ease;
  }

  .petal-group:hover .petal-shape {
    filter: brightness(1.12);
  }

  .petal-group.active .petal-shape {
    filter: brightness(1.08) drop-shadow(0 2px 8px rgba(0,0,0,0.15));
  }

  .petal-label {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 16px;
    font-weight: 700;
    fill: #F5F0E8;
    pointer-events: none;
  }

  .sub-group {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .sub-group.show {
    opacity: 1;
  }

  .sub-item {
    cursor: pointer;
    outline: none;
  }
  .sub-item:hover .sub-pill { fill: #C17A3A; }
  .sub-item:hover .sub-label { fill: #F5F0E8; }
  .sub-pill { transition: fill 0.2s ease; }

  .sub-label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    pointer-events: none;
    transition: fill 0.2s ease;
  }

  /* Layer 3: Recommendation cards */
  .recs-section {
    margin-top: 0.5rem;
    text-align: left;
  }

  .recs-heading {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    font-size: 1.5rem;
    color: #1A1A1A;
    margin-bottom: 1rem;
    text-align: center;
    letter-spacing: -0.02em;
  }

  .recs-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    max-width: 720px;
    margin: 0 auto;
  }

  .rec-card {
    background: #fff;
    border: 1px solid #D4C8B8;
    border-radius: 12px;
    padding: 1.25rem;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  .rec-card:hover {
    border-color: #C17A3A;
    box-shadow: 0 4px 16px rgba(193, 122, 58, 0.15);
    transform: translateY(-2px);
  }

  /* Layer 4: Expanded card */
  .rec-card.expanded {
    grid-column: 1 / -1;
    border-color: #C17A3A;
    box-shadow: 0 4px 20px rgba(193, 122, 58, 0.18);
    transform: none;
    cursor: default;
  }

  .rec-card.expanded:hover {
    transform: none;
  }

  .rec-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .rec-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    font-size: 1.05rem;
    color: #1A1A1A;
    line-height: 1.3;
  }

  .rec-card.expanded .rec-name {
    font-size: 1.25rem;
  }

  .rec-roast {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #C17A3A;
    background: #F5F0E8;
    padding: 2px 8px;
    border-radius: 4px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .rec-origin {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.8rem;
    color: #9B9590;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .rec-notes {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.875rem;
    color: #2A2A2A;
    line-height: 1.65;
  }

  /* Detail panel inside expanded card */
  .rec-detail {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #EBE4D8;
  }

  .rec-detail-inner {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .rec-detail-left {
    flex: 1;
  }

  .rec-description {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.9rem;
    color: #2A2A2A;
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }

  .rec-guide-link {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #C17A3A;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .rec-guide-link:hover {
    opacity: 0.75;
  }

  .rec-detail-right {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex-shrink: 0;
    min-width: 140px;
  }

  .rec-buy-label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #9B9590;
  }

  .rec-buy-btn {
    display: block;
    text-align: center;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: #C17A3A;
    background: #F5F0E8;
    border: 1px solid #C17A3A;
    border-radius: 8px;
    padding: 0.5rem 1rem;
    text-decoration: none;
    transition: background 0.2s ease, color 0.2s ease;
    cursor: pointer;
  }

  .rec-buy-btn:hover {
    background: #C17A3A;
    color: #F5F0E8;
  }

  .bloom-hint {
    font-family: 'Inter', system-ui, sans-serif;
    color: #9B9590;
    font-size: 0.875rem;
    margin-top: 1rem;
    font-style: italic;
  }

  /* Mobile sub-category pills */
  .mobile-subs {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
    padding: 0 0.5rem;
    margin-top: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .mobile-sub-pill {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: #1A1A1A;
    background: #F5F0E8;
    border: 1px solid #C17A3A;
    border-radius: 999px;
    padding: 0.5rem 1.1rem;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
    -webkit-tap-highlight-color: transparent;
  }

  .mobile-sub-pill.mobile-sub-active {
    background: #C17A3A;
    color: #F5F0E8;
  }

  @media (max-width: 640px) {
    .bloom-header h1 { font-size: 1.75rem; }
    .bloom-container { padding: 0.5rem 0.75rem; }
    .bloom-wrapper { max-width: 340px; }
    .recs-grid { grid-template-columns: 1fr; }
    .rec-detail-inner { flex-direction: column; gap: 1rem; }
    .rec-detail-right { min-width: unset; }
    .rec-card { padding: 1rem; }
    .bloom-hint { font-size: 0.8rem; margin-top: 0.75rem; }
  }
</style>
