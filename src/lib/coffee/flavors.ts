// Flavor Bloom: the tasting vocabulary, how to train each note, and what roasters' words show.
//
// The families, groups and most notes follow the SCA and WCR Coffee Taster's Flavor Wheel (2016),
// which is built on WCR's Sensory Lexicon (2017). A few words roasters use often but the wheel
// lacks (blackcurrant, plum, caramel…) are added under the nearest group and marked `wheel: false`.
// Three kinds of statement are kept apart everywhere this is shown:
//   - what roasters say: counted from lot descriptions in roasters' catalogs (ROASTER_SAMPLE);
//   - what tends to bring a family out: general tendencies, with sources (Family.brings);
//   - what you noticed: the reader's own tasting card, stored on their device.

export type FamilyId = 'floral' | 'fruity' | 'sour-fermented' | 'green' | 'roasted' | 'spices' | 'nutty-cocoa' | 'sweet';

export interface Note {
  id: string;
  label: string;
  family: FamilyId | 'off';
  group: string;
  /** On the SCA/WCR wheel itself; false for a common roaster word placed under the nearest group. */
  wheel: boolean;
  /** What the note is like, in plain words. */
  gist: string;
  /** A kitchen reference to smell or taste first. */
  ref: string;
  /** Overrides the standard smell-then-sip exercise (acids are tasted, not smelled). */
  tryIt?: string;
  /** Words that mean this note in roasters' descriptions, longest phrases win. */
  words: string[];
  /** Notes that usually point to a flaw when you can pick them out. */
  flaw?: boolean;
}

export interface Group { id: string; label: string; family: FamilyId | 'off'; notes: Note[] }

export interface Family {
  id: FamilyId;
  label: string;
  /** Petal fill on paper. Labels sit outside the petal in ink. */
  colour: string;
  /** One sentence: what this family is. */
  blurb: string;
  /** What tends to bring the family out, as a general tendency (sources in `sourceIds`). */
  brings: string;
  sourceIds: string[];
  groups: Group[];
}

const n = (id: string, label: string, gist: string, ref: string, words: string[], extra: Partial<Note> = {}): Omit<Note, 'family' | 'group'> => ({ id, label, gist, ref, words, wheel: true, ...extra });
const extraWord = { wheel: false };

function family(id: FamilyId, label: string, colour: string, blurb: string, brings: string, sourceIds: string[], groups: [string, string, Omit<Note, 'family' | 'group'>[]][]): Family {
  return {
    id, label, colour, blurb, brings, sourceIds,
    groups: groups.map(([gid, glabel, notes]) => ({ id: gid, label: glabel, family: id, notes: notes.map((x) => ({ ...x, family: id, group: gid })) })),
  };
}

// Petal order, clockwise from lower left; the wheel's neighbours stay neighbours, and the gap at the
// bottom (where the wheel has "Other") holds the stem and its leaves: the off notes.
export const FAMILIES: Family[] = [
  family('roasted', 'Roasted', '#46301f',
    'The flavors roasting itself creates: cereal and malt early, then tobacco, smoke and burnt as a roast goes darker.',
    'Darker roasts and longer roast development tend to bring more of it.',
    ['wcr-lexicon'],
    [
      ['cereal', 'Cereal', [
        n('malt', 'Malt', 'Sweet, bready grain, like malted milk.', 'a malted milk ball or a spoon of malt powder', ['malt', 'malty']),
        n('grain', 'Grain', 'Toasted cereal, crackers, a dry bready edge.', 'plain crackers or toasted oats', ['grain', 'cereal', 'biscuit', 'graham cracker', 'cracker', 'digestive biscuit', 'digestive biscuits', 'shortbread', 'wafer cookie', 'fresh bread']),
      ]],
      ['burnt', 'Burnt', [
        n('brown-roast', 'Brown roast', 'Full, round roastiness without bitterness.', 'the crust of dark toast', ['roasty', 'brown roast', 'toast', 'toasted']),
        n('smoky', 'Smoky', 'Wood smoke, a campfire edge.', 'a smoked almond or smoked paprika', ['smoky', 'smoke', 'smoked']),
        n('ashy', 'Ashy', 'Dry, dusty ash.', 'the smell of a cold fireplace (don\'t taste it)', ['ash', 'ashy']),
        n('acrid', 'Acrid', 'Sharp, scorched, over-roasted.', 'a burnt edge of toast', ['acrid', 'burnt', 'charred']),
      ]],
      ['tobacco', 'Tobacco', [
        n('tobacco', 'Tobacco', 'Dried leaf, sweet and a little earthy.', 'dried tea leaves or a fresh cigar\'s wrapper smell', ['tobacco', 'pipe tobacco']),
      ]],
    ]),
  family('spices', 'Spices', '#b4532a',
    'Warm baking spices, pepper and the pungent edge of fresh spice.',
    '',
    ['sca-wcr-wheel'],
    [
      ['brown-spice', 'Brown spice', [
        n('cinnamon', 'Cinnamon', 'Sweet, woody, warm.', 'a cinnamon stick, snapped', ['cinnamon']),
        n('clove', 'Clove', 'Sharp, numbing, medicinal warmth.', 'one whole clove, cracked', ['clove']),
        n('nutmeg', 'Nutmeg', 'Warm, nutty, a little piney.', 'freshly grated nutmeg', ['nutmeg']),
        n('anise', 'Anise', 'Licorice-like and sweet.', 'a fennel seed or star anise', ['anise', 'licorice', 'liquorice']),
        n('cardamom', 'Cardamom', 'Bright, resinous, citrus-and-pine spice.', 'a cracked green cardamom pod', ['cardamom'], extraWord),
        n('baking-spice', 'Baking spice', 'Warm mixed spice, like a spice cookie.', 'a pinch of mixed spice or pumpkin-pie spice', ['baking spice', 'brown spice', 'allspice', 'gingersnap', 'snickerdoodle cookie'], extraWord),
      ]],
      ['pepper', 'Pepper', [
        n('pepper', 'Pepper', 'Black-pepper bite at the back of the nose.', 'freshly cracked black pepper', ['pepper', 'peppery']),
      ]],
      ['pungent', 'Pungent', [
        n('pungent', 'Pungent', 'A sharp, prickly spice smell that fills the nose.', 'a raw ginger slice', ['pungent', 'ginger']),
      ]],
    ]),
  family('nutty-cocoa', 'Nutty & cocoa', '#9a6238',
    'Roasted nuts and chocolate: the most familiar coffee flavors, and the base of many blends.',
    'Very common in coffee. Roasting develops nut and cocoa aromas; very dark roasts can push them toward bitter and burnt.',
    ['wcr-lexicon'],
    [
      ['cocoa', 'Cocoa', [
        n('chocolate', 'Chocolate', 'Cocoa with the round fat of cocoa butter.', 'a square of milk chocolate', ['chocolate', 'milk chocolate', 'chocolate chip cookie', 'white chocolate']),
        n('dark-chocolate', 'Dark chocolate', 'Intense cocoa, drier and more bitter.', 'a square of 85–90% dark chocolate', ['dark chocolate', 'bittersweet chocolate']),
        n('cocoa', 'Cocoa powder', 'Dusty, brown, slightly bitter cocoa.', 'unsweetened cocoa powder', ['cocoa', 'cocoa powder', 'cacao', 'cacao nib', 'cocoa nibs', 'cacao dusting'], { wheel: false }),
      ]],
      ['nutty', 'Nutty', [
        n('almond', 'Almond', 'Sweet, woody, a hint of marzipan.', 'a toasted almond', ['almond', 'almonds', 'roasted almond', 'marzipan', 'almond cake', 'raw almond']),
        n('hazelnut', 'Hazelnut', 'Woody, sweet, buttery.', 'a roasted hazelnut', ['hazelnut', 'hazelnuts', 'roasted hazelnut', 'praline', 'nutella', 'raw hazelnut']),
        n('peanut', 'Peanut', 'Oily, roasted, a little beany.', 'a dry-roasted peanut', ['peanut', 'peanuts']),
        n('pecan', 'Pecan & other nuts', 'Rich, buttery nuts with a tannic skin.', 'a pecan or walnut half', ['pecan', 'walnut', 'macadamia', 'cashew', 'chestnut'], extraWord),
      ]],
    ]),
  family('sweet', 'Sweet', '#d79a33',
    'Brown sugar, caramel, honey and vanilla: sweetness you smell as much as taste.',
    'Roasting turns the bean\'s sugars into caramel-like aromas. Light to medium roasts usually taste sweeter; darker roasts trade sweetness for bitterness.',
    ['synthesis', 'wcr-lexicon'],
    [
      ['brown-sugar', 'Brown sugar', [
        n('caramel', 'Caramel', 'Cooked sugar: sweet with a toasty edge.', 'a soft caramel or caramelized sugar', ['caramel', 'caramelized', 'caramelised', 'toffee', 'butterscotch', 'creme brulee', 'dulce de leche', 'creamy caramel', 'fudge', 'light fudge']),
        n('brown-sugar', 'Brown sugar', 'Moist, deep sugar with a molasses note.', 'a pinch of dark brown sugar', ['brown sugar', 'raw sugar', 'cane sugar', 'panela', 'sugar cane', 'sugarcane', 'demerara', 'turbinado', 'golden syrup']),
        n('molasses', 'Molasses', 'Dark, thick, slightly bitter sugar.', 'a drop of molasses', ['molasses', 'treacle']),
        n('maple', 'Maple syrup', 'Woody, round sweetness.', 'a spoon of real maple syrup', ['maple', 'maple syrup']),
        n('honey', 'Honey', 'Floral, waxy sweetness.', 'a spoon of mild honey', ['honey', 'honeyed', 'orange blossom honey', 'floral honey', 'manuka honey', 'honeycomb', 'raw honey']),
      ]],
      ['vanilla', 'Vanilla', [
        n('vanilla', 'Vanilla', 'Sweet, creamy, a little woody.', 'a drop of vanilla extract in milk', ['vanilla', 'vanilla custard', 'vanilla bean', 'smoked vanilla', 'smoked vanilla bean']),
      ]],
    ]),
  family('floral', 'Floral', '#9c6b98',
    'Flowers and tea: delicate aromas that sit high in the nose.',
    'Usually lighter roasts. Floral aromas are delicate, fade as a roast darkens, and are prized in washed East African coffees.',
    ['wcr-lexicon'],
    [
      ['floral', 'Floral', [
        n('jasmine', 'Jasmine', 'Sweet, heady white flowers.', 'jasmine tea, smelled dry', ['jasmine', 'jasmine tea']),
        n('rose', 'Rose', 'Sweet, perfumed petals.', 'a drop of rosewater', ['rose', 'floral rose']),
        n('chamomile', 'Chamomile', 'Gentle, honeyed, hay-like flowers.', 'a chamomile tea bag', ['chamomile']),
        n('orange-blossom', 'Orange blossom', 'Citrus flowers: sweet and bright.', 'orange-blossom water', ['orange blossom', 'neroli'], extraWord),
        n('flowers-other', 'Other flowers', 'Honeysuckle, lavender, elderflower: flowers other than these.', 'a sprig of lavender or an elderflower cordial, smelled', ['honeysuckle', 'elderflower', 'magnolia blossom', 'gardenia', 'lavender', 'violet', 'hibiscus'], extraWord),
      ]],
      ['black-tea', 'Black tea', [
        n('black-tea', 'Black tea', 'Brisk, dry, a little tannic, like a plain cup of tea.', 'a plain black tea bag, brewed', ['black tea', 'earl grey', 'earl grey tea', 'darjeeling', 'assam']),
      ]],
    ]),
  family('fruity', 'Fruity', '#b23d4a',
    'Berries, citrus, stone fruit and dried fruit: notes printed on many specialty bags.',
    'Usually lighter roasts, which keep more of the acidity behind fruit-like brightness. Processing matters too; see what roasters\' words show for each note.',
    ['easto'],
    [
      ['berry', 'Berry', [
        n('blueberry', 'Blueberry', 'Dark, jammy, sweet berry.', 'a few crushed blueberries or blueberry jam', ['blueberry', 'blueberries']),
        n('strawberry', 'Strawberry', 'Sweet, candied red berry.', 'a ripe strawberry, crushed', ['strawberry', 'strawberries', 'ripe strawberry', 'strawberry candy', 'strawberry shortcake']),
        n('raspberry', 'Raspberry', 'Bright, tart red berry.', 'a few raspberries', ['raspberry', 'raspberry aroma']),
        n('blackberry', 'Blackberry', 'Dark, tart-sweet berry with seeds.', 'a blackberry or blackberry jam', ['blackberry', 'blackberry jam', 'boysenberry', 'mulberry']),
        n('blackcurrant', 'Blackcurrant', 'Tart, dark, slightly green berry: a hallmark word for Kenyan coffees.', 'blackcurrant jam or cordial', ['blackcurrant', 'black currant', 'currant', 'cassis'], extraWord),
        n('cranberry', 'Cranberry', 'Sharp, dry red berry.', 'a dried or fresh cranberry', ['cranberry'], extraWord),
        n('berries-mixed', 'Mixed berries', 'Berries without one fruit in front.', 'a spoon of mixed-berry jam', ['berry', 'berries', 'red berries', 'juicy berries', 'mixed berries', 'forest fruits', 'cloudberry', 'seabuckthorn berry', 'redcurrant'], extraWord),
      ]],
      ['dried-fruit', 'Dried fruit', [
        n('raisin', 'Raisin', 'Dark, sweet dried grape.', 'a few raisins, chewed', ['raisin', 'raisins', 'golden raisin', 'sultana']),
        n('prune', 'Prune', 'Deep, sweet, slightly bitter dried plum.', 'a prune', ['prune']),
        n('fig', 'Fig & date', 'Jammy, seedy, honeyed dried fruit.', 'a dried fig or a date', ['fig', 'date', 'dates'], extraWord),
        n('dried-other', 'Other dried fruit', 'Dried apricot, cherry or mango: chewy, concentrated fruit.', 'a dried apricot', ['dried fruit', 'dried cherry', 'dried apricot', 'dried mango'], extraWord),
      ]],
      ['other-fruit', 'Other fruit', [
        n('cherry', 'Cherry', 'Sweet red fruit with a slight almond bitterness.', 'a cherry, or cherry jam', ['cherry', 'cherries', 'ripe cherries', 'black cherry', 'red cherry', 'rainier cherry', 'cherry jam', 'cherry candy', 'cherry cola', 'sour cherry', 'sour cherries']),
        n('stone-fruit', 'Peach & apricot', 'Soft, juicy, perfumed stone fruit.', 'a ripe peach or apricot', ['peach', 'peaches', 'apricot', 'nectarine', 'white peach', 'stewed peach', 'stone fruit', 'stonefruit'], extraWord),
        n('plum', 'Plum', 'Dark, juicy fruit with a tart skin.', 'a ripe plum', ['plum', 'plums', 'stewed plum'], extraWord),
        n('apple', 'Apple', 'Crisp, juicy, from green to red.', 'a slice of red or green apple', ['apple', 'apples', 'red apple', 'green apple', 'cooked apple', 'fuji apple', 'honeycrisp apples']),
        n('pear', 'Pear', 'Soft, floral, grainy-sweet.', 'a ripe pear', ['pear', 'bosc pear']),
        n('grape', 'Grape', 'Sweet, juicy, sometimes winey.', 'a few red or white grapes', ['grape', 'grapes', 'grapey', 'red grape', 'white grape', 'green grape', 'green grapes', 'concord grape', 'grape soda']),
        n('pineapple', 'Pineapple', 'Tropical, sweet and sharp.', 'a piece of fresh pineapple', ['pineapple', 'caramelised pineapple']),
        n('tropical', 'Mango & tropical', 'Lush, ripe tropical fruit.', 'a slice of ripe mango', ['mango', 'ripe mango', 'tropical fruit', 'papaya', 'guava', 'passionfruit', 'passion fruit', 'lychee', 'dragon fruit', 'banana', 'sweet plantain', 'star fruit', 'starfruit'], extraWord),
        n('melon', 'Melon', 'Light, watery, fresh sweetness.', 'honeydew or watermelon', ['melon', 'watermelon', 'honeydew', 'honeydew melon', 'cantaloupe', 'canteloupe'], extraWord),
        n('pomegranate', 'Pomegranate', 'Tart, juicy, a little astringent.', 'a spoon of pomegranate seeds', ['pomegranate']),
        n('coconut', 'Coconut', 'Sweet, woody, oily.', 'unsweetened coconut flakes', ['coconut']),
      ]],
      ['citrus', 'Citrus fruit', [
        n('lemon', 'Lemon', 'Sharp, clean, peely sourness.', 'a strip of lemon zest', ['lemon', 'meyer lemon', 'lemon zest', 'grilled lemon', 'candied lemon', 'lemon candy', 'sweet lemon', 'limoncello', 'pink lemonade']),
        n('lime', 'Lime', 'Sour, green, a little bitter.', 'a strip of lime zest', ['lime', 'lime zest', 'key lime', 'kaffir lime', 'candied lime']),
        n('orange', 'Orange', 'Sweet, juicy, floral citrus.', 'a segment of orange', ['orange', 'blood orange', 'tangerine', 'mandarin', 'mandarin orange', 'clementine', 'sweet orange', 'orange zest', 'marmalade']),
        n('grapefruit', 'Grapefruit', 'Sour with a bitter peel edge.', 'a strip of grapefruit peel', ['grapefruit', 'ruby grapefruit', 'pomelo']),
        n('bergamot', 'Bergamot', 'Perfumed citrus, the scent of Earl Grey.', 'an Earl Grey tea bag', ['bergamot'], extraWord),
        n('citrus', 'Mixed citrus', 'Bright citrus without one fruit in front.', 'a mix of orange and lemon zest', ['citrus', 'complex citrus', 'ripe citrus', 'citrus oil', 'lemon citrus', 'candied peel', 'yuzu'], extraWord),
      ]],
    ]),
  family('sour-fermented', 'Sour & fermented', '#b9b23e',
    'Acids you taste on the tongue, and the boozy, winey notes of fermentation. Pleasant in balance, a flaw when they dominate.',
    'Light roasts keep more acid. Natural and anaerobic processing can add winey and boozy notes; vinegar-like or cheesy sourness often points to over-fermentation or a defect.',
    ['easto', 'wcr-lexicon'],
    [
      ['sour', 'Sour', [
        n('citric', 'Citric acid', 'Clean, lemony sourness on the tongue.', 'a pinch of citric acid in a glass of water', ['citric'], { tryIt: 'Dissolve a small pinch of citric acid (or a squeeze of lemon) in a glass of water and sip. Then sip the coffee and notice where the sourness lands on your tongue.' }),
        n('malic', 'Malic acid', 'Rounder, apple-like sourness.', 'a bite of green apple', ['malic'], { tryIt: 'Bite a tart green apple and notice the sourness on your tongue, then compare the coffee.' }),
        n('acetic', 'Acetic acid', 'Vinegar-like sharpness. Small amounts read as bright; more is a flaw.', 'a drop of white vinegar in water (smell it)', ['vinegar', 'acetic'], { flaw: true }),
        n('sour-aromatics', 'Sour aromatics', 'A sour, sharp smell: often over-fermentation.', 'sauerkraut brine, smelled', ['sour'], { flaw: true }),
      ]],
      ['fermented', 'Alcohol & fermented', [
        n('winey', 'Winey', 'Like red wine: fruity, sharp, a little boozy.', 'a sip of red wine, or red grape juice', ['winey', 'wine', 'wine-like', 'berries and wine', 'chardonnay', 'rose wine', 'rosé wine', 'rosé']),
        n('whiskey', 'Whiskey', 'Warm, boozy, oak-barrel sweetness.', 'a sniff of whiskey or rum', ['whiskey', 'whisky', 'boozy']),
        n('fermented', 'Fermented', 'Yeasty, sweet-sour, like stout or kombucha.', 'a sniff of stout or kombucha', ['fermented', 'funky']),
        n('overripe', 'Overripe', 'Fruit just past its best: sweet, damp, slightly musty.', 'a very ripe banana', ['overripe', 'over-ripe'], { flaw: true }),
      ]],
    ]),
  family('green', 'Green & vegetative', '#6c8a4c',
    'Grass, herbs, peas and raw beans: fresh plant notes.',
    'A little can read as fresh or herbal; strong green, peapod or raw notes usually mean under-ripe cherries or an under-developed roast.',
    ['wcr-lexicon', 'synthesis'],
    [
      ['green-veg', 'Green & vegetative', [
        n('herb', 'Herb-like', 'Fresh green herbs.', 'a crushed basil or mint leaf', ['herbal', 'herb', 'herbaceous', 'mint', 'sage', 'thyme', 'rosemary', 'lemongrass']),
        n('fresh', 'Fresh-cut grass', 'Sweet, sharp, green.', 'a handful of fresh-cut grass', ['grassy', 'grass']),
        n('hay', 'Hay-like', 'Dry, dusty, faintly sweet green.', 'dried parsley flakes', ['hay', 'straw']),
        n('peapod', 'Peapod', 'Sweet, beany, fresh pea.', 'a raw pea pod', ['peapod', 'pea', 'green pea'], { flaw: true }),
        n('under-ripe', 'Under-ripe', 'Sharp green fruit, like an unripe plum.', 'grapefruit pith', ['underripe', 'under-ripe', 'unripe'], { flaw: true }),
      ]],
      ['raw', 'Olive oil, raw & beany', [
        n('olive-oil', 'Olive oil', 'Green, buttery, peppery oil.', 'a sniff of extra virgin olive oil', ['olive oil', 'olive']),
        n('raw', 'Raw', 'Uncooked, like raw nuts or raw grain.', 'a raw almond', ['raw'], { flaw: true }),
        n('beany', 'Beany', 'Like raw beans: often an under-developed roast.', 'dry raw beans, smelled', ['beany'], { flaw: true }),
      ]],
    ]),
];

/** The leaves at the stem: notes that usually mean something went wrong (the wheel's "Other"). */
export const OFF_GROUPS: Group[] = [
  { id: 'papery-musty', label: 'Papery & musty', family: 'off', notes: [
    { id: 'stale', label: 'Stale', gist: 'Flat and faded: old coffee.', ref: 'coffee left open for weeks', words: ['stale'], wheel: true, flaw: true, family: 'off', group: 'papery-musty' },
    { id: 'papery', label: 'Papery & cardboard', gist: 'Wet paper or cardboard.', ref: 'a dry paper filter, smelled (then rinse yours)', words: ['papery', 'cardboard'], wheel: true, flaw: true, family: 'off', group: 'papery-musty' },
    { id: 'musty', label: 'Musty & earthy', gist: 'Damp cellar, dust, earth.', ref: 'a damp basement or potting soil, smelled', words: ['musty', 'earthy', 'dusty', 'damp'], wheel: true, flaw: true, family: 'off', group: 'papery-musty' },
    { id: 'woody', label: 'Woody', gist: 'Dry wood or sawdust.', ref: 'a pencil shaving', words: ['woody', 'cedar'], wheel: true, family: 'off', group: 'papery-musty' },
    { id: 'phenolic', label: 'Phenolic', gist: 'Medicinal, plastic or burnt-rubber tones: a defect.', ref: 'an adhesive bandage, smelled', words: ['phenolic', 'medicinal'], wheel: true, flaw: true, family: 'off', group: 'papery-musty' },
  ] },
  { id: 'chemical', label: 'Chemical', family: 'off', notes: [
    { id: 'rubber', label: 'Rubber & petroleum', gist: 'Rubber, tire or gasoline smells: counted as a defect in arabica.', ref: 'a rubber band, smelled', words: ['rubber', 'rubbery', 'petroleum'], wheel: true, flaw: true, family: 'off', group: 'chemical' },
    { id: 'potato', label: 'Potato', gist: 'Raw potato: a known defect in some East African lots, mostly from Rwanda and Burundi. One affected bean can taint a cup.', ref: 'a freshly cut raw potato', words: ['potato'], wheel: false, flaw: true, family: 'off', group: 'chemical' },
  ] },
];

export const ALL_GROUPS: Group[] = [...FAMILIES.flatMap((f) => f.groups), ...OFF_GROUPS];
export const ALL_NOTES: Note[] = ALL_GROUPS.flatMap((g) => g.notes);
export const noteById = (id: string) => ALL_NOTES.find((x) => x.id === id);
export const familyById = (id: string) => FAMILIES.find((f) => f.id === id);
export const groupById = (id: string) => ALL_GROUPS.find((g) => g.id === id);

/** The tasting exercise, in words. */
export function exercise(note: Note): string {
  if (note.tryIt) return note.tryIt;
  // References are written as things ("a few raisins, chewed"); the sentence picks its verb from them.
  let r = note.ref.replace(/,\s*smelled(?=\s*\(|$)/, '');
  let verb = 'Smell';
  if (/^a sip of /.test(r)) verb = 'Take';
  else if (/^a sniff of /.test(r)) r = r.replace(/^a sniff of /, '');
  else if (/^the smell of /.test(r)) r = r.replace(/^the smell of /, '');
  if (/,\s*chewed$/.test(r)) { verb = 'Chew'; r = r.replace(/,\s*chewed$/, ''); }
  return `${verb} ${r}. Then sip the coffee, swallow, and breathe out through your nose: look for the same smell, not the same taste.`;
}

// ── Roasters' words ──────────────────────────────────────────────────────────────────────────

/** One lot as roasters described it. o = origin id, p = process, r = roast, notes = their words. */
export interface Lot { o: string; p: string; r: string; notes: string[] }

/**
 * Which recorded lots belong in the sample: those with a description, and single origins only
 * (blends and fruit co-ferments would credit an origin with words that came from elsewhere).
 */
export const inSample = (name: string, notes: string[]) => notes.some((t) => t.trim().length > 0) && !/\bblend\b|co-?ferment/i.test(name);

export const ROASTER_SAMPLE = {
  label: 'roasters\' catalogs, winter 2026',
  detail: 'Lot descriptions from 38 specialty roasters\' online catalogs, recorded January–March 2026. Most are light roasts.',
};

// Longest phrases first, so "orange blossom" is floral and not orange, and "dark chocolate" isn't chocolate.
const PHRASES: { phrase: string; id: string; flaw: boolean }[] = ALL_NOTES
  .flatMap((x) => x.words.map((w) => ({ phrase: w.toLowerCase(), id: x.id, flaw: !!x.flaw || x.family === 'off' })))
  .sort((a, b) => b.phrase.length - a.phrase.length);

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PHRASE_RE = PHRASES.map((p) => ({ ...p, re: new RegExp(`(^|[^a-z])${escape(p.phrase)}(?=$|[^a-z])`) }));

/**
 * Note ids found in free text: a roaster's description or what a reader types from a bag.
 * Each stretch of text counts once, for its longest matching phrase.
 */
export function notesInText(text: string, opts: { roaster?: boolean } = {}): string[] {
  let rest = ` ${text.toLowerCase().replace(/&?nbsp;/g, ' ').replace(/[’']/g, "'")} `;
  const found: string[] = [];
  for (const p of PHRASE_RE) {
    const m = p.re.exec(rest);
    if (!m) continue;
    // Roasters don't print flaws on their bags, so in their descriptions a flaw word is a misread
    // ("sour", "raw"): it's set aside, not counted.
    if (!found.includes(p.id) && !(opts.roaster && p.flaw)) found.push(p.id);
    const start = m.index + m[1].length;
    rest = rest.slice(0, start) + ' '.repeat(p.phrase.length) + rest.slice(start + p.phrase.length);
    // A phrase can appear twice ("lemon … lemon"); blank every occurrence.
    while (p.re.test(rest)) {
      const again = p.re.exec(rest)!;
      const s = again.index + again[1].length;
      rest = rest.slice(0, s) + ' '.repeat(p.phrase.length) + rest.slice(s + p.phrase.length);
    }
  }
  return found;
}

export const PROCESS_LABEL: Record<string, string> = { washed: 'Washed', natural: 'Natural', honey: 'Honey', anaerobic: 'Anaerobic', other: 'Other or blend' };
export const ROAST_LABEL: Record<string, string> = { light: 'Light', medium: 'Medium', dark: 'Darker' };

/** The lot data's process names, folded to five. */
export function processKind(p: string): string {
  if (p.startsWith('anaerobic')) return 'anaerobic';
  if (p.startsWith('honey')) return 'honey';
  if (p === 'washed' || p === 'natural') return p;
  if (p === 'semi-washed') return 'other';
  return p.includes('decaf') ? 'washed' : 'other';
}
/** The lot data's roast names, folded to three. */
export function roastKind(r: string): string {
  return r === 'light' || r === 'medium_light' ? 'light' : r === 'medium' ? 'medium' : 'dark';
}

export interface Rate {
  key: string;
  /** Lots in this group whose description names the note. */
  hits: number;
  /** All lots in this group. */
  of: number;
  rate: number;
}
export interface NoteEvidence {
  noteId: string;
  lots: number;
  total: number;
  /** The share of each origin's lots that name the note, for origins with enough lots to say. */
  origins: Rate[];
  process: Rate[];
  roast: Rate[];
  /** The note's share across every lot: the baseline the rows compare against. */
  overall: number;
  /** Too few lots name the note to compare groups honestly. */
  thin: boolean;
}

function rates(lots: Lot[], hit: Set<Lot>, key: (l: Lot) => string, minOf: number): Rate[] {
  const of = new Map<string, number>(), hits = new Map<string, number>();
  for (const l of lots) {
    const k = key(l);
    of.set(k, (of.get(k) ?? 0) + 1);
    if (hit.has(l)) hits.set(k, (hits.get(k) ?? 0) + 1);
  }
  return [...of.entries()]
    .filter(([, n]) => n >= minOf)
    .map(([k, n]) => ({ key: k, hits: hits.get(k) ?? 0, of: n, rate: (hits.get(k) ?? 0) / n }))
    .sort((a, b) => b.rate - a.rate || b.hits - a.hits || a.key.localeCompare(b.key));
}

/**
 * What roasters' words show for one note. Rates, not counts: the sample has far more Colombian
 * and Ethiopian lots than anything else, so raw counts would mostly show the sample's shape.
 */
export function evidenceFor(noteId: string, lots: Lot[], { minLots = 6, minOrigin = 7 } = {}): NoteEvidence {
  const hit = new Set(lots.filter((l) => l.notes.some((t) => notesInText(t, { roaster: true }).includes(noteId))));
  return {
    noteId,
    lots: hit.size,
    total: lots.length,
    origins: rates(lots, hit, (l) => l.o, minOrigin).filter((r) => r.hits > 0),
    process: rates(lots, hit, (l) => processKind(l.p), 10).filter((r) => r.key !== 'other'),
    roast: rates(lots, hit, (l) => roastKind(l.r), 10),
    overall: lots.length ? hit.size / lots.length : 0,
    thin: hit.size < minLots,
  };
}

/** Note ids per lot, computed once: for the family-level counts on the bloom. */
export function familyCounts(lots: Lot[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const l of lots) {
    const fams = new Set(l.notes.flatMap((t) => notesInText(t, { roaster: true })).map((id) => noteById(id)?.family).filter(Boolean) as string[]);
    for (const f of fams) out[f] = (out[f] ?? 0) + 1;
  }
  return out;
}

// ── The reader's tasting card ────────────────────────────────────────────────────────────────

export interface TastingCard {
  /** Up to three notes the reader picked out. */
  pins: string[];
  /** What the roaster's bag says, as typed. */
  bag: string;
  /** ISO date the card was made. */
  made: string;
}

export const MAX_PINS = 3;

export interface CardComparison {
  bagNotes: string[];
  /** Your notes the bag also names. */
  shared: string[];
  /** Your notes the bag doesn't name, but in the same family as one it does. */
  near: string[];
  /** Your notes with nothing nearby on the bag. */
  yoursOnly: string[];
  /** The bag's notes you didn't pin. */
  bagOnly: string[];
}

/** How the reader's notes line up with a roaster's: same note, same family, or neither. */
export function compareCard(pins: string[], bag: string): CardComparison {
  const bagNotes = notesInText(bag);
  const fam = (id: string) => noteById(id)?.family;
  const shared = pins.filter((p) => bagNotes.includes(p));
  const near = pins.filter((p) => !shared.includes(p) && bagNotes.some((b) => fam(b) === fam(p)));
  const yoursOnly = pins.filter((p) => !shared.includes(p) && !near.includes(p));
  const bagOnly = bagNotes.filter((b) => !pins.includes(b));
  return { bagNotes, shared, near, yoursOnly, bagOnly };
}

/** Card ↔ URL: ?pins=blueberry,jasmine&bag=… Unknown notes are dropped, never guessed. */
export function encodeCard(card: Pick<TastingCard, 'pins' | 'bag'>): string {
  const q = new URLSearchParams();
  if (card.pins.length) q.set('pins', card.pins.join(','));
  if (card.bag.trim()) q.set('bag', card.bag.trim().slice(0, 160));
  return q.toString();
}
export function decodeCard(query: string): { pins: string[]; bag: string; dropped: number; unknown: number; overLimit: number } {
  const q = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  const raw = (q.get('pins') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const known = [...new Set(raw.filter((id) => !!noteById(id)))];
  const pins = known.slice(0, MAX_PINS);
  const unknown = raw.filter((id) => !noteById(id)).length;
  return { pins, bag: (q.get('bag') ?? '').slice(0, 160), dropped: raw.length - pins.length, unknown, overLimit: known.length - pins.length };
}
