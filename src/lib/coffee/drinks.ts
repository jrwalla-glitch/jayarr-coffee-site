// Espresso drinks as named reference recipes, from the documentary research of 2026-10-15
// (makeover-2026-10/research/espresso-drinks-research.md, sources checked that day).
// Rules from that research, kept here:
// - Each recipe is a named reference, not a universal definition. Variants stay separate.
// - Layers appear only where the source gives them. A range stays a range. Unknown stays unknown.
// - Served milk may already include its foam ("frothed milk"); foam is never added on top twice.
// - Capacity is not fill: milk is never computed as cup minus espresso.
// - Grams are not millilitres: mass-based recipes keep grams.

export type LayerKind = 'espresso' | 'milk' | 'frothed' | 'foam' | 'water' | 'brewed' | 'chocolate' | 'gelato' | 'cream';

export interface Layer {
  kind: LayerKind;
  /** Volume in ml, as [min, max]; equal values for a nominal figure. */
  ml?: [number, number];
  /** Mass in g, when the source gives mass. */
  g?: [number, number];
  /** What the number measures, when it isn't the served layer (e.g. "cold milk before steaming"). */
  basis?: string;
  /** The source doesn't give this layer's amount. */
  unspecified?: boolean;
}

export interface DrinkRef {
  id: string;
  label: string;
  where: string;
  shots: string;
  layers: Layer[];
  vessel: { name: string; capacityMl?: [number, number] };
  foamCm?: [number, number];
  note?: string;
  source: { name: string; url: string };
}

export interface Drink { id: string; name: string; definition: string; refs: DrinkRef[] }

const S = {
  inei: { name: 'Istituto Nazionale Espresso Italiano, The Certified Italian Espresso and Cappuccino (2006), pp. 7–10', url: 'https://iei.coffee/en/espresso-italiano-certificato' },
  illyDoppio: { name: 'illy, Espresso Preparation Guide (2020)', url: 'https://www.illy.com/content/dam/channels/website/professional/usa/professional-standtogether/Espresso-Preparation-Guide-Beans_5-2020.pdf' },
  breville: { name: 'Breville, Ristretto', url: 'https://www.breville.com/us/en/coffee-journey/recipes/ristretto.html' },
  coffeegeek: { name: 'CoffeeGeek, How to Make an Espresso Lungo (archived 2025-01-09)', url: 'https://web.archive.org/web/20250109115226/https://coffeegeek.com/guides/howtos/espresso-lungo-how-to/' },
  lavazzaAmericano: { name: 'Lavazza USA, Americano: definition and origins', url: 'https://www.lavazzausa.com/en/recipes-and-coffee-hacks/americano-coffee-definition-vocabulary-curiosities' },
  lavazzaLongBlack: { name: 'Lavazza USA, How to make a long black', url: 'https://www.lavazzausa.com/en/recipes-and-coffee-hacks/how-to-make-long-black-coffee' },
  lavazzaRedEye: { name: 'Lavazza USA, Red Eye coffee recipe', url: 'https://www.lavazzausa.com/en/recipes-and-coffee-hacks/red-eye-coffee-recipe' },
  illyMacchiato: { name: 'illy Thailand, Hot Espresso Macchiato', url: 'https://illy.co.th/coffee-recipes/macchiato/' },
  sabora: { name: 'Café Sabora, Café cortado: qué es y cómo se prepara', url: 'https://cafesabora.com/es/caf%C3%A9-cortado-qu%C3%A9-es-y-c%C3%B3mo-se-prepara' },
  ineffable: { name: 'Ineffable Coffee, espresso-and-milk proportions (café con leche guide)', url: 'https://ineffablecoffee.com/blogs/aprendizaje-y-cultura-cafetera/cafe-con-leche' },
  sbuxCortado: { name: 'Starbucks, Cortado', url: 'https://www.starbucks.com/menu/product/2124649/hot' },
  blueBottle: { name: 'Blue Bottle, The Gibraltar (archived 2025-01-20)', url: 'https://web.archive.org/web/20250120104742/https://blog.bluebottlecoffee.com/posts/gibraltar' },
  libbey: { name: 'Libbey, Gibraltar 4.5 oz glass', url: 'https://shop.libbey.com/products/libbey-gibraltar-duratuff-cortado-glasses-4-5-ounce-set-of-12-durable-restaurant-quality-shot-and-espresso-glassware-dishwasher-safe' },
  pdgPiccolo: { name: 'Perfect Daily Grind, What Is a Piccolo Latte (2020)', url: 'https://perfectdailygrind.com/2020/03/what-is-a-piccolo-latte-how-do-i-make-it/' },
  cimbaliFlat: { name: 'La Cimbali, Flat White', url: 'https://www.cimbali.com/recipes/coffee-tutorial/flat-white' },
  cimbaliCapp: { name: 'La Cimbali, Cappuccino', url: 'https://www.cimbali.com/recipes/coffee-tutorial/cappuccino' },
  cimbaliLM: { name: 'La Cimbali, Latte Macchiato', url: 'https://www.cimbali.com/recipes/coffee-tutorial/latte-macchiato' },
  illyLatte: { name: 'illy, Caffelatte', url: 'https://www.illy.com/en-gb/coffee/coffee-preparation/caffe-latte' },
  sbuxFlat: { name: 'Starbucks, Flat White', url: 'https://www.starbucks.com/menu/product/565/hot' },
  sbuxLatte: { name: 'Starbucks, Caffè Latte', url: 'https://www.starbucks.com/menu/product/407/hot' },
  illyAffogato: { name: 'illy, Affogato al caffè', url: 'https://www.illy.com/it-it/caffe/ricette-caffe/affogato-al-caffe-ricetta' },
  breveMocha: { name: 'Breville, Mocha', url: 'https://www.breville.com/us/en/coffee-journey/recipes/mocha.html' },
  cafeDuMonde: { name: 'Café du Monde, Coffee Demonstration', url: 'https://shop.cafedumonde.com/coffee/coffee-demonstration' },
};

const esp = (a: number, b = a): Layer => ({ kind: 'espresso', ml: [a, b] });

export const DRINKS: Drink[] = [
  { id: 'espresso', name: 'Espresso', definition: 'A small, concentrated coffee made by forcing hot water under pressure through finely ground coffee, served under its crema.', refs: [
    { id: 'espresso-inei', label: 'Italy · INEI', where: 'Italy', shots: 'single', layers: [{ kind: 'espresso', ml: [22.5, 27.5], basis: 'including crema' }], vessel: { name: 'Demitasse', capacityMl: [50, 100] }, note: 'The SCA\'s older definition allowed 25–35 ml and the 2026 World Barista Championship says around 30 ml.', source: S.inei },
  ] },
  { id: 'doppio', name: 'Doppio', definition: 'A double serving of espresso, not a single stretched longer.', refs: [
    { id: 'doppio-illy', label: 'illy', where: 'Italy', shots: 'double', layers: [esp(50)], vessel: { name: 'Espresso cup' }, note: 'Modern specialty recipes are usually set by weight instead, e.g. 19 g of coffee to 38 g in the cup.', source: S.illyDoppio },
  ] },
  { id: 'ristretto', name: 'Ristretto', definition: 'A restricted shot: less liquid from a similar dose, so it is shorter and more concentrated.', refs: [
    { id: 'ristretto-breville', label: 'Breville', where: 'Café style', shots: 'single', layers: [esp(15, 20)], vessel: { name: 'Demitasse' }, source: S.breville },
  ] },
  { id: 'lungo', name: 'Lungo', definition: 'A long shot: more water run through the coffee during extraction, not added afterwards.', refs: [
    { id: 'lungo-coffeegeek', label: 'Italian tradition', where: 'Italy', shots: 'single', layers: [esp(45, 50)], vessel: { name: 'Small coffee cup' }, note: 'Nespresso\'s Original lungo is a separate, much longer capsule setting (110 ml).', source: S.coffeegeek },
  ] },
  { id: 'americano', name: 'Americano', definition: 'Espresso with hot water added, usually poured in after the shot.', refs: [
    { id: 'americano-lavazza', label: 'Lavazza', where: 'Italian brand', shots: 'single', layers: [{ kind: 'espresso', unspecified: true }, { kind: 'water', ml: [120, 180] }], vessel: { name: 'Cup or mug' }, source: S.lavazzaAmericano },
  ] },
  { id: 'long-black', name: 'Long black', definition: 'An Australian and New Zealand black coffee: a shot poured over hot water, which keeps more crema on top.', refs: [
    { id: 'longblack-lavazza', label: 'Australia / NZ style', where: 'Australia / NZ', shots: 'usually double', layers: [{ kind: 'water', ml: [100, 120] }, { kind: 'espresso', unspecified: true }], vessel: { name: 'Cup or glass' }, source: S.lavazzaLongBlack },
  ] },
  { id: 'red-eye', name: 'Red eye', definition: 'A cup of brewed coffee with a shot of espresso added.', refs: [
    { id: 'redeye-lavazza', label: 'Lavazza', where: 'Italian brand', shots: 'single', layers: [{ kind: 'brewed', ml: [250, 250] }, { kind: 'espresso', unspecified: true }], vessel: { name: 'Mug' }, note: 'Two shots make a black eye; many US cafés use a double.', source: S.lavazzaRedEye },
  ] },
  { id: 'macchiato', name: 'Macchiato', definition: 'An espresso "marked" with a little milk foam: a small drink, not the tall sweet chain drink with the same name.', refs: [
    { id: 'macchiato-illy', label: 'illy', where: 'Italy', shots: 'single', layers: [esp(20, 25), { kind: 'foam', unspecified: true, basis: 'foam from about 28 ml milk, spooned on' }], vessel: { name: 'Small glass or demitasse', capacityMl: [59, 89] }, source: S.illyMacchiato },
  ] },
  { id: 'cortado', name: 'Cortado', definition: 'Espresso "cut" with a small amount of warm milk. How much milk depends a lot on where you order it.', refs: [
    { id: 'cortado-sabora', label: 'Spain · common style', where: 'Spain', shots: 'single', layers: [esp(30), { kind: 'milk', ml: [10, 10], basis: 'the 75/25 coffee-to-milk split Sabora calls common; it ranges from a few drops to equal parts' }], vessel: { name: 'Small glass or espresso cup' }, source: S.sabora },
    { id: 'cortado-ineffable', label: 'Spain · specialty', where: 'Spain', shots: 'double', layers: [{ kind: 'espresso', g: [40, 40] }, { kind: 'milk', g: [5, 40] }], vessel: { name: 'Small glass' }, note: 'Measured by weight; the milk can be anywhere in that range.', source: S.ineffable },
    { id: 'cortado-sbux', label: 'Starbucks', where: 'US chain', shots: 'three ristretto', layers: [{ kind: 'espresso', unspecified: true }, { kind: 'milk', unspecified: true }], vessel: { name: 'Short cup, 8 fl oz', capacityMl: [237, 237] }, note: 'Three blonde ristretto shots with steamed whole milk.', source: S.sbuxCortado },
  ] },
  { id: 'gibraltar', name: 'Gibraltar', definition: 'A small espresso-and-steamed-milk drink named after the 4½ oz Libbey Gibraltar glass Blue Bottle served it in; its founder calls it really a cortado.', refs: [
    { id: 'gibraltar-bluebottle', label: 'Blue Bottle', where: 'US', shots: 'not stated', layers: [{ kind: 'espresso', unspecified: true }, { kind: 'milk', unspecified: true }], vessel: { name: 'Gibraltar glass', capacityMl: [133, 133] }, source: S.blueBottle },
  ] },
  { id: 'piccolo', name: 'Piccolo', definition: 'A small single-shot milk drink with latte-textured milk and a little microfoam on top.', refs: [
    { id: 'piccolo-ona', label: 'Australia · café style', where: 'Australia', shots: 'single', layers: [esp(20, 30), { kind: 'frothed', ml: [40, 60], basis: 'textured milk poured, including its microfoam' }], vessel: { name: 'Small glass', capacityMl: [85, 114] }, source: S.pdgPiccolo },
  ] },
  { id: 'flat-white', name: 'Flat white', definition: 'Espresso with finely textured milk and a thin, glossy layer of microfoam, in a smaller cup than a latte.', refs: [
    { id: 'flat-cimbali', label: 'Cimbali', where: 'Australia / NZ style', shots: 'double', layers: [{ kind: 'espresso', unspecified: true }, { kind: 'frothed', ml: [125, 130], basis: 'frothed milk, including its foam' }], foamCm: [0.5, 0.5], vessel: { name: 'Cup', capacityMl: [150, 160] }, source: S.cimbaliFlat },
    { id: 'flat-sbux', label: 'Starbucks', where: 'US chain', shots: '2 (Tall) or 3 (Grande) ristretto', layers: [{ kind: 'espresso', unspecified: true }, { kind: 'milk', unspecified: true }], vessel: { name: 'Tall cup, 12 fl oz', capacityMl: [355, 355] }, source: S.sbuxFlat },
  ] },
  { id: 'cappuccino', name: 'Cappuccino', definition: 'Espresso with steamed milk under a deep cap of fine foam. The "equal thirds" rule has no historical basis.', refs: [
    { id: 'capp-inei', label: 'Italy · INEI', where: 'Italy', shots: 'single', layers: [esp(25), { kind: 'frothed', ml: [125, 125], basis: '100 ml cold milk steamed to about 125 ml, foam included' }], vessel: { name: 'Cappuccino cup', capacityMl: [150, 160] }, source: S.inei },
    { id: 'capp-cimbali', label: 'Cimbali', where: 'Italy', shots: 'single', layers: [{ kind: 'espresso', unspecified: true }, { kind: 'frothed', ml: [125, 125], basis: 'hot frothed milk, foam included' }], foamCm: [1, 1], vessel: { name: 'Cappuccino cup', capacityMl: [150, 160] }, source: S.cimbaliCapp },
  ] },
  { id: 'latte', name: 'Latte', definition: 'Espresso with a larger amount of heated milk; Italian recipes may have no foam, cafés usually add a thin layer.', refs: [
    { id: 'latte-illy', label: 'illy', where: 'Italy', shots: 'single', layers: [esp(20, 25), { kind: 'milk', ml: [120, 120], basis: 'whole milk measured before heating, not frothed' }], vessel: { name: 'Tall glass' }, source: S.illyLatte },
    { id: 'latte-ineffable', label: 'Spain · specialty', where: 'Spain', shots: 'double', layers: [{ kind: 'espresso', g: [40, 40] }, { kind: 'milk', g: [180, 240] }], vessel: { name: 'Glass or cup' }, note: 'Measured by weight.', source: S.ineffable },
    { id: 'latte-sbux', label: 'Starbucks', where: 'US chain', shots: '1 (Tall) or 2 (Grande)', layers: [{ kind: 'espresso', unspecified: true }, { kind: 'milk', unspecified: true }, { kind: 'foam', unspecified: true, basis: 'a light layer' }], vessel: { name: 'Tall cup, 12 fl oz', capacityMl: [355, 355] }, source: S.sbuxLatte },
  ] },
  { id: 'latte-macchiato', name: 'Latte macchiato', definition: 'Frothed milk poured first, then "marked" with espresso, often in a tall glass so the layers show.', refs: [
    { id: 'lm-cimbali', label: 'Cimbali', where: 'Italy', shots: 'single', layers: [{ kind: 'frothed', ml: [130, 130], basis: 'hot frothed milk, foam included' }, { kind: 'espresso', unspecified: true }], foamCm: [1.5, 1.5], vessel: { name: 'Tall glass' }, source: S.cimbaliLM },
  ] },
  { id: 'mocha', name: 'Mocha', definition: 'Espresso and steamed milk with chocolate, sometimes topped with whipped cream.', refs: [
    { id: 'mocha-breville', label: 'Breville', where: 'Home recipe', shots: 'single', layers: [{ kind: 'chocolate', unspecified: true, basis: 'two teaspoons of drinking chocolate' }, { kind: 'espresso', unspecified: true }, { kind: 'milk', unspecified: true }], vessel: { name: 'Glass or mug' }, source: S.breveMocha },
  ] },
  { id: 'affogato', name: 'Affogato', definition: 'A scoop of gelato or ice cream "drowned" in a hot shot of espresso.', refs: [
    { id: 'affogato-illy', label: 'illy', where: 'Italy', shots: 'single', layers: [{ kind: 'gelato', g: [40, 40], basis: 'about one 40 g scoop' }, esp(20, 25)], vessel: { name: 'Glass or small bowl' }, source: S.illyAffogato },
  ] },
  { id: 'cafe-au-lait', name: 'Café au lait', definition: 'Brewed coffee with hot milk in roughly equal parts; not espresso-based.', refs: [
    { id: 'cal-cafedumonde', label: 'New Orleans · Café du Monde', where: 'US', shots: 'none (drip coffee)', layers: [{ kind: 'brewed', unspecified: true, basis: 'half' }, { kind: 'milk', unspecified: true, basis: 'half, heated' }], vessel: { name: 'Cup or mug' }, source: S.cafeDuMonde },
  ] },
];

export const drinkById = (id: string) => DRINKS.find((d) => d.id === id);
export const refById = (id: string) => DRINKS.flatMap((d) => d.refs).find((r) => r.id === id);

/** Known volume in ml (midpoints), and whether any layer is unknown or mass-only. */
export function knownVolume(ref: DrinkRef): { ml: number; complete: boolean } {
  let ml = 0, complete = true;
  for (const l of ref.layers) {
    if (l.ml) ml += (l.ml[0] + l.ml[1]) / 2;
    else complete = false;
  }
  return { ml, complete };
}

/** One honest sentence comparing two references, using only amounts both recipes publish. */
export function compareRefs(a: DrinkRef, b: DrinkRef, nameA: string, nameB: string): string {
  if (a.id === b.id) return 'These are the same recipe; pick another version to compare.';
  // Two versions of the same drink are told apart by their recipe labels.
  const same = nameA === nameB;
  const A = same ? `${nameA.toLowerCase()} (${a.label})` : nameA.toLowerCase(), B = same ? `${nameB.toLowerCase()} (${b.label})` : nameB.toLowerCase();
  const mid = (r?: [number, number]) => (r ? (r[0] + r[1]) / 2 : undefined);
  // Milk in any form counts as milk, foam included: a macchiato's spoon of foam is milk.
  const MILKY = ['milk', 'frothed', 'foam'];
  const milkLayers = (r: DrinkRef) => r.layers.filter((l) => MILKY.includes(l.kind));
  // Milk amount and its unit: some recipes publish grams, some millilitres (blind Opus r3: grams
  // were read as "not published"). Amounts are compared only in the same unit.
  const milkAmt = (r: DrinkRef): { v: number; lo: number; hi: number; unit: 'ml' | 'g' } | 0 | undefined => {
    const ls = milkLayers(r);
    if (ls.length === 0) return 0;
    const sum = (k: 'ml' | 'g') => ({ v: ls.reduce((t, l) => t + (mid(l[k]) ?? 0), 0), lo: ls.reduce((t, l) => t + (l[k]?.[0] ?? 0), 0), hi: ls.reduce((t, l) => t + (l[k]?.[1] ?? 0), 0), unit: k });
    if (ls.every((l) => l.ml)) return sum('ml');
    if (ls.every((l) => l.g)) return sum('g');
    return undefined;
  };
  const rng = (m: { lo: number; hi: number }) => (Math.round(m.lo) === Math.round(m.hi) ? `${Math.round(m.lo)}` : `${Math.round(m.lo)}–${Math.round(m.hi)}`);
  const parts: string[] = [];
  // Only a single, definite count is compared: "1 (Tall) or 2 (Grande)" and "usually double" vary.
  const shots = (r: DrinkRef) => (/\bor\b|usually|not stated|none/.test(r.shots) ? undefined : /double|\b2\b|two/.test(r.shots) ? 2 : /triple|three|\b3\b/.test(r.shots) ? 3 : /single|\b1\b/.test(r.shots) ? 1 : undefined);
  const sa = shots(a), sb = shots(b);
  if (sa && sb && sa !== sb) parts.push(`the ${A} uses ${sa === 1 ? 'a single shot' : sa === 2 ? 'a double' : 'three shots'} and the ${B} ${sb === 1 ? 'a single' : sb === 2 ? 'a double' : 'three shots'}`);
  else if (sa && sb && sa === sb) parts.push(`both use ${sa === 1 ? 'a single shot' : sa === 2 ? 'a double shot' : 'three shots'}`);
  const ma = milkAmt(a), mb = milkAmt(b);
  // Both have milk but one amount isn't published: say so rather than saying nothing.
  if ((ma === undefined && milkLayers(b).length) || (mb === undefined && milkLayers(a).length)) parts.push(`both have milk, but the recipes don't both publish how much`);
  else if (ma === 0 && milkLayers(b).length) parts.push(`only the ${B} has milk`);
  else if (mb === 0 && milkLayers(a).length) parts.push(`only the ${A} has milk`);
  else if (ma && mb && ma.unit !== mb.unit) parts.push(`both have milk, but one recipe weighs it and the other measures its volume`);
  else if (ma && mb) {
    // Recipes measure milk differently (cold before heating, or frothed volume with its foam).
    const kinds = (r: DrinkRef) => [...new Set(milkLayers(r).map((l) => l.kind))].join();
    const mixed = kinds(a) !== kinds(b) ? ', measured differently by the two recipes' : '';
    const [big, bigV, smallV] = ma.v > mb.v ? [A, ma.v, mb.v] : [B, mb.v, ma.v];
    const ratio = bigV / smallV, u = ma.unit;
    const [bm, sm] = ma.v > mb.v ? [ma, mb] : [mb, ma];
    const loR = bm.lo / Math.max(1e-9, sm.hi), hiR = bm.hi / Math.max(1e-9, sm.lo);
    const xf = (r: number) => (r < 3 ? r.toFixed(1) : String(Math.round(r)));
    // A wide published range (a cortado's 5–40 g) can't support one multiplier: give the span (Opus r4).
    if (hiR / loR > 2 && ratio >= 1.25) parts.push(loR >= 1.25 ? `the ${big} has more milk, about ${xf(loR)}–${xf(hiR)}× as much (${rng(bm)} ${u} against ${rng(sm)} ${u}${mixed})` : `the milk amounts overlap (${rng(bm)} ${u} and ${rng(sm)} ${u}${mixed})`);
    else if (ratio < 1.25) parts.push(`both use about the same amount of milk (about ${Math.round(smallV)} and ${Math.round(bigV)} ${u}${mixed})`);
    else parts.push(`the ${big} has about ${ratio < 3 ? ratio.toFixed(1) : Math.round(ratio)}× the milk (${Math.round(bigV)} ${u} against ${Math.round(smallV)} ${u}${mixed})`);
  }
  // Water or brewed coffee in both: compare the published amounts (americano vs long black).
  for (const [k, name] of [['water', 'hot water'], ['brewed', 'brewed coffee']] as const) {
    const la = a.layers.find((l) => l.kind === k)?.ml, lb = b.layers.find((l) => l.kind === k)?.ml;
    if (la && lb) {
      const va = mid(la)!, vb = mid(lb)!;
      if (Math.abs(va - vb) / Math.min(va, vb) < 0.25) parts.push(`both use about the same ${name} (about ${Math.round(Math.min(va, vb))} and ${Math.round(Math.max(va, vb))} ml)`);
      else parts.push(`the ${va > vb ? A : B} uses more ${name} (about ${Math.round(Math.max(va, vb))} ml against ${Math.round(Math.min(va, vb))} ml)`);
    }
  }
  const EXTRA: Record<string, string> = { water: 'hot water', brewed: 'brewed coffee', gelato: 'gelato', chocolate: 'chocolate', cream: 'whipped cream' };
  for (const [r, other, N] of [[a, b, A], [b, a, B]] as const) {
    const own = Object.keys(EXTRA).filter((k) => r.layers.some((l) => l.kind === k) && !other.layers.some((l) => l.kind === k));
    if (own.length) parts.push(`only the ${N} has ${own.map((k) => EXTRA[k]).join(' and ')}`);
  }
  if (a.foamCm && b.foamCm && a.foamCm[0] !== b.foamCm[0]) {
    const [deep, deepCm, thinCm] = a.foamCm[0] > b.foamCm[0] ? [A, a.foamCm[0], b.foamCm[0]] : [B, b.foamCm[0], a.foamCm[0]];
    parts.push(`the ${deep} has about ${deepCm} cm of foam against ${thinCm} cm`);
  }
  const va = knownVolume(a), vb = knownVolume(b);
  if (va.complete && vb.complete && va.ml > 0 && vb.ml > 0 && Math.abs(va.ml - vb.ml) > 10) {
    const [big, r] = va.ml > vb.ml ? [A, va.ml / vb.ml] : [B, vb.ml / va.ml];
    parts.push(`overall the ${big} is about ${Math.round(r * 10) / 10}× the size`);
  }
  if (parts.length === 0) return `These recipes don't publish enough amounts to compare; compare the shots (${a.shots} vs ${b.shots}) and the cups.`;
  const s = parts.join('; ');
  return s.charAt(0).toUpperCase() + s.slice(1) + '.';
}
