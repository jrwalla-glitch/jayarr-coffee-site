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

  // Coffee data with detail fields — will be replaced with real scraped data + affiliate links
  const coffeeData = {
    'Berry': [
      { name: 'Ethiopia Yirgacheffe', origin: 'Ethiopia', roast: 'Light', notes: 'Blueberry, strawberry, wine-like acidity with a silky body.',
        description: 'The crown jewel of Ethiopian coffees. Yirgacheffe beans are grown at 1,700–2,200m altitude in the birthplace of coffee itself. Wet-processed to preserve the explosive berry character, this coffee delivers waves of blueberry and strawberry jam layered over a wine-like acidity and silky, medium body. Best brewed as a pour-over to let the fruit complexity shine.',
        blogSlug: 'ethiopian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+yirgacheffe+coffee&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/search?q=yirgacheffe' },
        ]},
      { name: 'Kenya AA Nyeri', origin: 'Kenya', roast: 'Light-Medium', notes: 'Blackcurrant, raspberry, bright and juicy with a crisp finish.',
        description: 'Kenya AA refers to the largest bean screen size — and in Kenyan coffee, bigger often means bolder flavor. Nyeri county produces some of the most electrifying cups on earth: blackcurrant and raspberry at the front, followed by a tomato-like acidity that is unmistakably Kenyan. The crisp, clean finish makes this a coffee you keep reaching for.',
        blogSlug: 'kenyan-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=kenya+aa+nyeri+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Rwanda Huye Mountain', origin: 'Rwanda', roast: 'Light', notes: 'Mixed berry compote, plum, delicate florals.',
        description: 'Rwanda has quietly become one of specialty coffee\'s most exciting origins. Huye Mountain\'s high-altitude farms produce beans with a delicate berry compote sweetness — think plum and mixed berries folded into a light floral base. The body is clean and tea-like, making it an elegant, easy-drinking cup that punches well above its price point.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=rwanda+huye+mountain+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Citrus': [
      { name: 'Colombia Huila', origin: 'Colombia', roast: 'Medium', notes: 'Orange zest, lemon, balanced sweetness and bright acidity.',
        description: 'Huila is Colombia\'s most awarded coffee region, and for good reason. Grown at 1,500–2,000m in volcanic soil, these beans develop a bright citrus profile — orange zest and lemon — balanced by brown sugar sweetness and a clean, round body. A versatile coffee that works beautifully as pour-over, drip, or even espresso.',
        blogSlug: 'colombian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=colombia+huila+coffee&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/search?q=colombia+huila' },
        ]},
      { name: 'Costa Rica Tarrazú', origin: 'Costa Rica', roast: 'Medium', notes: 'Grapefruit, tangerine, honey sweetness, clean finish.',
        description: 'Tarrazú is Costa Rica\'s most prestigious growing region, producing beans with electric citrus acidity — grapefruit and tangerine — underpinned by honey sweetness. The exceptionally clean finish is a hallmark of Costa Rican washed processing. A bright, uplifting cup that defines what Central American coffee can be.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=costa+rica+tarrazu+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Stone Fruit': [
      { name: 'Ethiopia Guji Natural', origin: 'Ethiopia', roast: 'Light', notes: 'Peach, apricot, nectarine with a creamy mouthfeel.',
        description: 'Natural-processed Guji coffees are sun-dried inside the cherry, allowing the fruit sugars to ferment into the bean. The result is an intensely fruity cup brimming with peach, apricot, and ripe nectarine. The body is surprisingly creamy for a light roast, with a finish that lingers like stone fruit preserves.',
        blogSlug: 'ethiopian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+guji+natural+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Panama Boquete', origin: 'Panama', roast: 'Light-Medium', notes: 'Plum, cherry, refined acidity with floral undertones.',
        description: 'Panama\'s Boquete highlands produce some of the world\'s most refined coffees. Expect stone fruit — plum and cherry — with a polished acidity and subtle floral undertones. The terroir at 1,600m+ gives these beans an elegance that few origins can match. Worth seeking out for a special brew.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=panama+boquete+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Tropical': [
      { name: 'Honduras Marcala', origin: 'Honduras', roast: 'Medium', notes: 'Mango, pineapple, papaya with brown sugar sweetness.',
        description: 'Marcala was Honduras\'s first designated origin — and it earns the distinction. These beans deliver a tropical fruit salad of mango, pineapple, and papaya, grounded by brown sugar sweetness. A medium body and gentle acidity make this an incredibly approachable cup that surprises with its complexity.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=honduras+marcala+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Colombia Nariño', origin: 'Colombia', roast: 'Light-Medium', notes: 'Passion fruit, coconut, lively and exotic.',
        description: 'Nariño sits at the southern tip of Colombia, near the Ecuadorian border, where extreme altitude and equatorial sun create uniquely complex beans. The cup is lively and exotic — passion fruit and coconut lead, with a vibrant acidity that keeps things energetic. One of Colombia\'s most underrated regions.',
        blogSlug: 'colombian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=colombia+narino+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Dried Fruit': [
      { name: 'Yemen Mocha Mattari', origin: 'Yemen', roast: 'Medium', notes: 'Raisin, fig, dates with deep wine-like complexity.',
        description: 'Yemeni coffee is where it all began — and Mocha Mattari is the archetype. Ancient heirloom varieties grown on terraced hillsides produce a cup unlike anything else: raisin, fig, and dates with a deep wine-like complexity. The processing is traditional sun-drying, giving the beans a wild, untamed character. Rare and extraordinary.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=yemen+mocha+mattari+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Ethiopia Harrar Natural', origin: 'Ethiopia', roast: 'Medium', notes: 'Dried blueberry, prune, wild and winey.',
        description: 'Harrar naturals are the wild child of Ethiopian coffee. Sun-dried on raised beds, these beans develop intense dried blueberry and prune flavors with a winey, almost fermented edge. Not for the faint of heart — this is coffee with personality, best enjoyed by those who appreciate bold, distinctive cups.',
        blogSlug: 'ethiopian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+harrar+natural+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Jasmine': [
      { name: 'Panama Geisha', origin: 'Panama', roast: 'Light', notes: 'Jasmine, bergamot, honeysuckle — ethereal and complex.',
        description: 'The Geisha variety is coffee royalty — originally from Ethiopia but made famous by Panama\'s Hacienda La Esmeralda. The cup is ethereal: jasmine, bergamot, and honeysuckle float above a tea-like body. It regularly commands the highest prices at auction. If you try one exceptional coffee in your life, make it a Geisha.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=panama+geisha+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Ethiopia Washed Sidamo', origin: 'Ethiopia', roast: 'Light', notes: 'Jasmine tea, lemon, delicate and aromatic.',
        description: 'Washed Sidamo is elegance in a cup. The wet processing strips away fruit to reveal the bean\'s true terroir — jasmine tea, lemon, and a delicate aromatic quality that perfumes the room as you brew. Light-bodied and refined, this is a meditative coffee best savored slowly.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+sidamo+washed+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Rose': [
      { name: 'Ethiopia Yirgacheffe Washed', origin: 'Ethiopia', roast: 'Light', notes: 'Rose water, peach, Earl Grey tea complexity.',
        description: 'The washed version of Yirgacheffe trades the berry bomb for floral finesse. Rose water and peach dominate, with an Earl Grey tea complexity that reveals itself as the cup cools. The body is silky and the finish is long and perfumed. A stunning coffee for those who love delicacy over power.',
        blogSlug: 'ethiopian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+yirgacheffe+washed+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Tea-like': [
      { name: 'Malawi Mzuzu', origin: 'Malawi', roast: 'Light', notes: 'Black tea, subtle fruit, light and approachable.',
        description: 'Malawi is Africa\'s hidden coffee gem. Mzuzu beans grown near Lake Malawi produce a gentle, tea-like cup with subtle fruit sweetness and a light, approachable body. Perfect for those transitioning from tea to specialty coffee, or anyone who appreciates understatement over intensity.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=malawi+mzuzu+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'China Yunnan', origin: 'China', roast: 'Light-Medium', notes: 'Pu-erh tea, stone fruit, unique and smooth.',
        description: 'Yes, China grows coffee — and Yunnan province is producing increasingly interesting lots. The cup carries echoes of the region\'s famous pu-erh tea, layered with stone fruit and a smooth, round body. A curiosity that rewards the adventurous drinker.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=yunnan+china+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Perfumed': [
      { name: 'Ethiopia Natural Guji', origin: 'Ethiopia', roast: 'Light', notes: 'Lavender, honey, intensely aromatic and sweet.',
        description: 'Natural Guji at its most expressive — the dry processing creates an intensely perfumed cup where lavender and honey dominate from first sip to last. The aroma alone is worth the price of admission. Pairs beautifully with a quiet morning and zero distractions.',
        blogSlug: 'ethiopian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+guji+natural+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Dark Chocolate': [
      { name: 'Guatemala Antigua', origin: 'Guatemala', roast: 'Medium-Dark', notes: 'Dark chocolate, smoky, full body with a long finish.',
        description: 'Antigua sits in a valley between three volcanoes, and the mineral-rich volcanic soil produces Guatemala\'s most iconic coffee. Dark chocolate and smoke dominate a full, velvety body that lingers on the palate. This is the coffee that converts people who think they don\'t like dark roasts.',
        blogSlug: 'guatemalan-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=guatemala+antigua+coffee&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/search?q=guatemala+antigua' },
        ]},
      { name: 'Peru Chanchamayo', origin: 'Peru', roast: 'Medium', notes: 'Cacao, brown sugar, balanced and smooth.',
        description: 'Peru\'s Chanchamayo region produces wonderfully balanced beans where cacao meets brown sugar in a smooth, easy-drinking cup. The acidity is gentle, the body is medium, and the finish is clean. An excellent everyday coffee that never gets boring.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=peru+chanchamayo+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Milk Chocolate': [
      { name: 'Brazil Santos', origin: 'Brazil', roast: 'Medium', notes: 'Milk chocolate, nut, low acidity, creamy and sweet.',
        description: 'Brazil Santos is the world\'s most popular coffee style for a reason — it\'s the definition of comfort. Milk chocolate, roasted nut, and a creamy sweetness with virtually no acidity. The low-altitude, natural processing creates a heavy, smooth body that\'s perfect for espresso blends or a simple drip brew.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=brazil+santos+coffee+beans&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/search?q=brazil+santos' },
        ]},
      { name: 'Colombia Supremo', origin: 'Colombia', roast: 'Medium', notes: 'Chocolate, caramel, mild fruit, crowd-pleasing balance.',
        description: 'Supremo is Colombia\'s largest screen size — big beans with big flavor. Chocolate and caramel lead with mild fruit notes adding just enough complexity to keep things interesting. This is the coffee you serve to guests because literally everyone likes it.',
        blogSlug: 'colombian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=colombia+supremo+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Caramel & Toffee': [
      { name: 'El Salvador Pacamara', origin: 'El Salvador', roast: 'Medium', notes: 'Butterscotch, toffee, brown sugar, velvety body.',
        description: 'Pacamara is a hybrid variety unique to El Salvador — giant beans that deliver giant sweetness. Butterscotch and toffee dominate with brown sugar depth and a velvety, almost syrupy body. One of Central America\'s most distinctive and rewarding coffees.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=el+salvador+pacamara+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Guatemala Huehuetenango', origin: 'Guatemala', roast: 'Medium', notes: 'Caramel, apple, spice, complex sweetness.',
        description: 'Huehuetenango (way-way-ten-ANG-go) is Guatemala\'s highest and most remote growing region. The altitude develops a complex sweetness — caramel and apple with warming spice notes. Each sip reveals something new. A coffee for people who want to think while they drink.',
        blogSlug: 'guatemalan-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=guatemala+huehuetenango+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Brown Sugar': [
      { name: 'Costa Rica Honey Process', origin: 'Costa Rica', roast: 'Medium', notes: 'Brown sugar, molasses, stone fruit, syrupy.',
        description: 'Honey processing leaves some of the fruit mucilage on the bean during drying, creating a sweetness that lives up to the name. Brown sugar and molasses coat every sip, with stone fruit peeking through. The body is syrupy and the finish is long and sweet. A processing method that Costa Rica has perfected.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=costa+rica+honey+process+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Honey & Vanilla': [
      { name: 'Honduras Comayagua', origin: 'Honduras', roast: 'Medium', notes: 'Honey, vanilla, mild citrus, sweet and approachable.',
        description: 'Comayagua produces some of Honduras\'s sweetest coffees — literal honey and vanilla notes with just enough citrus to keep things balanced. An incredibly approachable cup that works for every brewing method and every palate. The kind of coffee you buy a second bag of without thinking.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=honduras+comayagua+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Almond': [
      { name: 'Brazil Cerrado', origin: 'Brazil', roast: 'Medium', notes: 'Almond, chocolate, low acidity, smooth and nutty.',
        description: 'The Cerrado plateau\'s consistent climate produces incredibly reliable, nutty coffees. Almond and chocolate in a smooth, low-acid cup with a heavy body. This is the coffee that makes Brazil the world\'s largest producer — dependable, delicious, and endlessly versatile.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=brazil+cerrado+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'India Monsooned Malabar', origin: 'India', roast: 'Medium-Dark', notes: 'Almond, spice, earthy, bold and mellow.',
        description: 'One of coffee\'s most unusual processes — beans are exposed to monsoon winds and moisture for weeks, swelling and losing acidity. The result is bold and mellow: almond, warm spice, and an earthy depth with virtually zero brightness. Divisive but beloved by its fans. A must-try for the adventurous.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=india+monsooned+malabar+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Hazelnut': [
      { name: 'Colombia Castillo', origin: 'Colombia', roast: 'Medium', notes: 'Hazelnut, cocoa, red fruit, balanced and round.',
        description: 'Castillo is a Colombian variety bred for disease resistance — and it turns out it\'s delicious too. Hazelnut and cocoa form the base with red fruit adding brightness. Balanced, round, and incredibly drinkable. Proof that practical breeding and great flavor aren\'t mutually exclusive.',
        blogSlug: 'colombian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=colombia+castillo+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Peanut': [
      { name: 'Brazil Natural', origin: 'Brazil', roast: 'Medium-Dark', notes: 'Peanut, dark chocolate, heavy body, comfort-coffee classic.',
        description: 'Natural-processed Brazilian coffee taken to a medium-dark roast is the backbone of espresso blends worldwide. Peanut and dark chocolate in a heavy, syrupy body — this is comfort coffee at its most fundamental. Makes an exceptional espresso base or a rich, satisfying French press.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=brazil+natural+process+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Walnut & Pecan': [
      { name: 'Mexico Chiapas', origin: 'Mexico', roast: 'Medium', notes: 'Pecan, caramel, mild acidity, warm and inviting.',
        description: 'Chiapas, in Mexico\'s southern highlands, produces coffees with a warm, nutty character — pecan and caramel with just enough acidity to keep things interesting. A warm, inviting cup that\'s excellent value and consistently enjoyable.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=mexico+chiapas+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Baking Spice': [
      { name: 'Sumatra Mandheling', origin: 'Indonesia', roast: 'Dark', notes: 'Cinnamon, clove, earthy, thick body, lingering warmth.',
        description: 'Mandheling is the quintessential Sumatran coffee — wet-hulled processing creates that unmistakable earthy, spicy character. Cinnamon and clove warmth in an incredibly thick, syrupy body that coats your palate. The finish lingers for minutes. A polarizing coffee that inspires fierce loyalty.',
        blogSlug: 'sumatra-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=sumatra+mandheling+coffee&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/search?q=sumatra+mandheling' },
        ]},
      { name: 'Java Estate', origin: 'Indonesia', roast: 'Medium-Dark', notes: 'Nutmeg, brown sugar, full body, spiced and clean.',
        description: 'Java was one of the first places outside Africa to grow coffee — and centuries later, the island still produces exceptional beans. Estate coffees are cleaner than their Sumatran neighbors, with nutmeg and brown sugar over a full body. Spiced but approachable.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=java+estate+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Pungent': [
      { name: 'Sulawesi Toraja', origin: 'Indonesia', roast: 'Medium-Dark', notes: 'Black pepper, dark chocolate, cedar, intense and complex.',
        description: 'Toraja coffee from Sulawesi is one of Indonesia\'s most complex offerings. Black pepper spice hits first, followed by dark chocolate and cedar. The intensity is remarkable but never overwhelming. A coffee with real depth for drinkers who want to be challenged.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=sulawesi+toraja+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Wine-like': [
      { name: 'Kenya Peaberry', origin: 'Kenya', roast: 'Medium', notes: 'Red wine, blackberry, tomato, brilliantly acidic.',
        description: 'Peaberries — single round beans instead of the usual flat pair — are hand-sorted for their concentrated flavor. Kenyan peaberries deliver red wine and blackberry with that signature Kenyan tomato acidity dialed up to 11. Brilliantly bright and complex. Not a background coffee — this demands your attention.',
        blogSlug: 'kenyan-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=kenya+peaberry+coffee&tag=jayarrcoffee-20' },
        ]},
      { name: 'Ethiopia Sidamo Natural', origin: 'Ethiopia', roast: 'Light-Medium', notes: 'Wine, blueberry, fermented fruit, bold and distinctive.',
        description: 'Natural Sidamo is wild — fermented fruit and blueberry wine in a bold, distinctive cup that pushes the boundaries of what coffee can taste like. The natural processing amplifies everything, creating an almost vinous quality. For drinkers who want coffee to surprise them.',
        blogSlug: 'ethiopian-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=ethiopia+sidamo+natural+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Anise': [
      { name: 'Guatemala El Injerto', origin: 'Guatemala', roast: 'Medium', notes: 'Anise, dark cherry, chocolate, lingering herbal finish.',
        description: 'El Injerto is one of Guatemala\'s legendary farms — Cup of Excellence winners multiple times over. The anise note is distinctive and rare, woven through dark cherry and chocolate with a lingering herbal finish. A collector\'s coffee that justifies the premium.',
        blogSlug: 'guatemalan-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=guatemala+el+injerto+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Woody': [
      { name: 'Sumatra Lintong', origin: 'Indonesia', roast: 'Dark', notes: 'Cedar, pine, dark chocolate, earthy with herbal hints.',
        description: 'Lintong, near Lake Toba in North Sumatra, produces a darker, woodier expression of Sumatran coffee. Cedar and pine dominate with dark chocolate underneath and herbal hints in the finish. The wet-hulled processing gives it that characteristic earthy depth. Excellent for French press or cold brew where the woodiness can really develop.',
        blogSlug: 'sumatra-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=sumatra+lintong+coffee&tag=jayarrcoffee-20' },
          { retailer: 'Trade Coffee', url: 'https://www.drinktrade.com/search?q=sumatra+lintong' },
        ]},
      { name: 'Papua New Guinea', origin: 'PNG', roast: 'Medium', notes: 'Oak, fruit, mild spice, complex and rustic.',
        description: 'PNG coffee is the wild frontier of specialty — many farms are small, remote, and use traditional methods. The cup is rustic and complex: oak and mild spice with unexpected fruit notes. Each lot is an adventure. If you like the idea of terroir-driven, untamed coffee, PNG delivers.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=papua+new+guinea+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Tobacco & Leather': [
      { name: 'Indian Robusta', origin: 'India', roast: 'Dark', notes: 'Tobacco leaf, leather, dark cocoa, bold and rugged.',
        description: 'Indian Robusta is not for the delicate palate — and that\'s exactly the point. Tobacco leaf and leather with dark cocoa in a punishingly thick body. This is the coffee equivalent of a peated Scotch: bold, rugged, and unapologetically intense. Makes a killer espresso for those who take it straight.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=indian+robusta+coffee+beans&tag=jayarrcoffee-20' },
        ]},
      { name: 'Sumatra Blue Batak', origin: 'Indonesia', roast: 'Medium-Dark', notes: 'Tobacco, molasses, earthy, heavy and brooding.',
        description: 'Blue Batak refers to the Batak people of North Sumatra who cultivate these distinctive beans. Tobacco and molasses in an earthy, heavy cup that feels contemplative and brooding. The wet-hulled processing creates a profile that\'s unmistakably Sumatran — dark, deep, and endlessly interesting.',
        blogSlug: 'sumatra-coffee-guide', buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=sumatra+blue+batak+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Herbal': [
      { name: 'Bolivia Caranavi', origin: 'Bolivia', roast: 'Medium', notes: 'Chamomile, sage, mild sweetness, delicate and rare.',
        description: 'Bolivia is one of the smallest and rarest specialty coffee origins. Caranavi beans carry chamomile and sage with a mild sweetness that\'s utterly unique. The body is delicate, the acidity gentle, and the finish clean. A quiet, meditative coffee for those who value subtlety. Hard to find, worth the search.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=bolivia+caranavi+coffee&tag=jayarrcoffee-20' },
        ]},
    ],
    'Savory': [
      { name: 'Myanmar Shan State', origin: 'Myanmar', roast: 'Medium', notes: 'Umami, tomato, dark chocolate, savory and surprising.',
        description: 'Myanmar\'s coffee industry is young and tiny — which makes discoveries like Shan State all the more exciting. The cup is genuinely savory: umami and tomato notes that feel more like a fine broth than a typical coffee, anchored by dark chocolate. One of the most surprising and conversation-starting coffees you\'ll ever try.',
        buyLinks: [
          { retailer: 'Amazon', url: 'https://www.amazon.com/s?k=myanmar+shan+state+coffee&tag=jayarrcoffee-20' },
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
              <div class="rec-detail" onclick={(e) => e.stopPropagation()}>
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
