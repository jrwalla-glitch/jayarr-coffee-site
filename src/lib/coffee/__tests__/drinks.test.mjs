import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DRINKS, knownVolume, compareRefs, refById, drinkById } from '../index.ts';

test('every drink has a sourced reference and a definition; a link is https, a printed source names its pages', () => {
  assert.equal(DRINKS.length, 18);
  for (const d of DRINKS) {
    assert.ok(d.definition.length > 20, d.id);
    assert.ok(d.refs.length >= 1, d.id);
    for (const r of d.refs) {
      if (r.source.url) assert.match(r.source.url, /^https:\/\//, r.id);
      else assert.match(r.source.name, /\bpp?\. \d/, `${r.id}: a printed source names its pages`);
      if (r.also) assert.match(r.also.url, /^https:\/\//, r.id);
    }
  }
});

test('item 41: INEI\'s technical figures cite the brochure, with the current page beside it; illy pours the foam; CoffeeGeek is the live page', () => {
  for (const id of ['espresso-inei', 'capp-inei']) {
    const r = refById(id);
    assert.match(r.source.name, /brochure, 2006\), pp?\. /, id);
    assert.equal(r.source.url, undefined, `${id}: no link that doesn't carry the table`);
    assert.equal(r.also.url, 'https://iei.coffee/en/espresso-italiano-certificato');
  }
  assert.match(refById('capp-inei').note, /25 ml of espresso and 100 ml of steamed milk/);
  const mac = refById('macchiato-illy').layers.find((l) => l.kind === 'foam');
  assert.match(mac.basis, /poured on until the cup is almost full/); assert.doesNotMatch(mac.basis, /spooned/);
  const lungo = refById('lungo-coffeegeek');
  assert.equal(lungo.source.url, 'https://coffeegeek.com/guides/howtos/espresso-lungo-how-to/');
  assert.match(lungo.source.name, /Mark Prince.*September 13, 2020/);
});

test('B2: Starbucks\' Caffè Mocha (Grande: 2 shots, 4 pumps, 16 fl oz) and Hoffmann\'s equal-parts cortado', () => {
  const m = refById('mocha-sbux');
  assert.equal(m.source.url, 'https://www.starbucks.com/menu/product/408/hot');
  assert.match(m.shots, /^2\b/); assert.deepEqual(m.vessel.capacityMl, [473, 473]);
  assert.equal(m.layers.find((l) => l.kind === 'chocolate').amount, '4 pumps of mocha sauce');
  assert.equal(drinkById('mocha').refs[0].id, 'mocha-breville', 'the default mocha is unchanged');
  const c = refById('cortado-hoffmann');
  assert.deepEqual(c.layers.map((l) => [l.kind, l.ml]), [['espresso', [30, 30]], ['milk', [30, 30]]]);
  assert.match(c.source.name, /p\. 117/);
  assert.equal(drinkById('cortado').refs[0].id, 'cortado-sabora', 'the default cortado is unchanged');
  assert.match(compareRefs(refById('cortado-hoffmann'), refById('cortado-sabora'), 'Cortado', 'Cortado'), /milk/);
  assert.match(compareRefs(refById('mocha-sbux'), refById('mocha-breville'), 'Mocha', 'Mocha'), /whipped cream/);
});

test('known volumes never exceed a published vessel capacity (capacity is not fill, but it is a ceiling)', () => {
  for (const d of DRINKS) for (const r of d.refs) {
    const v = knownVolume(r);
    if (r.vessel.capacityMl && v.complete) assert.ok(v.ml <= r.vessel.capacityMl[1] + 0.5, `${r.id}: ${v.ml} > ${r.vessel.capacityMl[1]}`);
  }
});

test('ranges are ordered and no layer is both measured and unspecified', () => {
  for (const d of DRINKS) for (const r of d.refs) for (const l of r.layers) {
    if (l.ml) assert.ok(l.ml[0] <= l.ml[1], r.id);
    if (l.g) assert.ok(l.g[0] <= l.g[1], r.id);
    if (l.unspecified) assert.ok(!l.ml && !l.g, `${r.id} ${l.kind}`);
    assert.ok(l.ml || l.g || l.unspecified, `${r.id} ${l.kind} has no amount and isn't marked unspecified`);
  }
});

test('the INEI cappuccino is 25 ml espresso + about 125 ml frothed milk in a 150–160 ml cup; no thirds', () => {
  const r = refById('capp-inei');
  assert.deepEqual(r.layers.map((l) => l.kind), ['espresso', 'frothed']);
  assert.equal(knownVolume(r).ml, 150);
});

test('comparisons say something true or admit they can\'t', () => {
  const s = compareRefs(refById('capp-inei'), refById('espresso-inei'), 'Cappuccino', 'Espresso');
  assert.match(s, /only the cappuccino has milk/i);
  assert.match(s, /6× the size/);
  const c = compareRefs(refById('cortado-sabora'), refById('flat-cimbali'), 'Cortado', 'Flat white');
  assert.match(c, /single shot and the flat white a double/);
  assert.match(c, /flat white has about 13× the milk \(128 ml against 10 ml, measured differently by the two recipes\)/);
  assert.match(compareRefs(refById('gibraltar-bluebottle'), refById('cortado-sbux'), 'Gibraltar', 'Cortado'), /don't both publish how much/);
});

test('drinks with different extras say what only one of them has', () => {
  const s = compareRefs(refById('affogato-illy'), refById('americano-lavazza'), 'Affogato', 'Americano');
  assert.match(s, /only the affogato has gelato/);
  assert.match(s, /only the americano has hot water/);
});

test('foam counts as milk, and near-equal amounts are called the same (Muse)', () => {
  const s1 = compareRefs(refById('macchiato-illy'), refById('cortado-sabora'), 'Macchiato', 'Cortado');
  assert.doesNotMatch(s1, /only the cortado has milk/);
  const s2 = compareRefs(refById('flat-cimbali'), refById('latte-illy'), 'Flat white', 'Latte');
  assert.doesNotMatch(s2, /1×/); assert.match(s2, /about the same amount of milk/); assert.match(s2, /measured differently/);
  assert.match(compareRefs(refById('espresso-inei'), refById('latte-illy'), 'Espresso', 'Latte'), /only the latte has milk/);
});

test('variable shot counts are not compared, and same-name drinks are told apart (Opus: "the latte uses a double and the latte a single")', () => {
  const sbux = DRINKS.find((d) => d.id === 'latte').refs.find((r) => /Tall/.test(r.shots));
  const illy = refById('latte-illy');
  const s = compareRefs(sbux, illy, 'Latte', 'Latte');
  assert.doesNotMatch(s, /uses a double/); assert.doesNotMatch(s, /the latte .* and the latte /);
  // Two cortados with amounts on both sides name each by its recipe.
  const cortados = DRINKS.find((d) => d.id === 'cortado').refs;
  const c = compareRefs(cortados[0], cortados[1], 'Cortado', 'Cortado');
  assert.match(c, /cortado \(/); assert.doesNotMatch(c, /the cortado [^(]/);
});

test('an unpublished milk amount is named, not skipped (Muse: latte vs macchiato said only "Both use a single shot")', () => {
  assert.match(compareRefs(refById('latte-illy'), refById('macchiato-illy'), 'Latte', 'Macchiato'), /don't both publish how much/);
});

test('Opus r3: grams compare with grams, the bigger figure first, and water is compared', () => {
  const g = compareRefs(refById('cortado-ineffable'), refById('latte-ineffable'), 'Cortado', 'Latte');
  assert.doesNotMatch(g, /don't both publish/); assert.match(g, /\d+ g against \d+(–\d+)? g/);
  // The cortado's 5–40 g can't support one multiplier (Opus r4): the span is given instead.
  assert.match(g, /about \d+(\.\d)?–\d+× as much/);
  const w = compareRefs(refById('americano-lavazza'), refById('longblack-lavazza'), 'Americano', 'Long black');
  assert.doesNotMatch(w, /don't publish enough/); assert.match(w, /hot water/);
});

test('blind Opus r5: the same recipe on both sides says so', () => {
  assert.match(compareRefs(refById('latte-illy'), refById('latte-illy'), 'Latte', 'Latte'), /same recipe/);
});
