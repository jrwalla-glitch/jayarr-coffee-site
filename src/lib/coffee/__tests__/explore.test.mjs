import { test } from 'node:test';
import assert from 'node:assert/strict';
import originHubs from '../../../data/origin-hubs.json' with { type: 'json' };
import originSources from '../../../data/origins-sources.json' with { type: 'json' };
import summaries from '../../../data/origin-summaries.json' with { type: 'json' };
import {
  FAMILIES, OFF_GROUPS, ALL_NOTES, noteById, notesInText, familiesInText, evidenceFor, familyCounts, compareCard, encodeCard, decodeCard, MAX_PINS, inSample,
} from '../flavors.ts';
import { ATLAS, brewGuideHref, differences, differenceSentence, describe, ratioText, timeText, timePosition, TIME_TICKS } from '../methodAtlas.ts';
import { ORIGINS, CONTINENTS, monthsIn, harvestState, harvestingIn, originByPage, bandText, project, sourceNames, harvestBags } from '../origins.ts';
import { EXPLORE_SOURCES } from '../explore-sources.ts';
import { decodeBrew } from '../share.ts';
import { buildRecipe } from '../brew.ts';

const lots = originHubs.flatMap((h) => h.beans.map((b) => ({ o: h.origin_slug.replace(/_/g, '-'), p: b.processing, r: b.roast_level, notes: b.flavor_notes })));

// ── Flavor vocabulary ──
test('the bloom has eight families, every note has a unique id and words, and off notes sit on the stem', () => {
  assert.equal(FAMILIES.length, 8);
  const ids = ALL_NOTES.map((n) => n.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const n of ALL_NOTES) assert.ok(n.words.length > 0, n.id);
  assert.ok(OFF_GROUPS.every((g) => g.family === 'off'));
});

test('roaster words match the longest phrase: "orange blossom" is floral, "dark chocolate" is not plain chocolate', () => {
  const ob = notesInText('Orange blossom and bergamot');
  assert.ok(!ob.includes('orange'), ob.join(','));
  assert.equal(noteById(ob[0]).family, 'floral');
  const dc = notesInText('dark chocolate');
  assert.equal(dc.length, 1);
  assert.notEqual(dc[0], 'chocolate');
  assert.deepEqual(notesInText('lemon, more lemon'), notesInText('lemon'));
  assert.deepEqual(notesInText('melemonade'), notesInText('melemonade').filter((id) => id !== 'lemon'));
});

test('a note\'s rates are honest: hits never exceed their group, and the overall share is hits over every lot', () => {
  for (const id of ['strawberry', 'blueberry', 'jasmine', 'chocolate']) {
    const e = evidenceFor(id, lots);
    assert.equal(e.total, lots.length);
    assert.equal(e.overall, e.lots / lots.length);
    for (const r of [...e.origins, ...e.process, ...e.roast]) {
      assert.ok(r.hits <= r.of && r.rate === r.hits / r.of, `${id} ${r.key}`);
    }
    // Every process and roast row counts lots out of the same sample.
    assert.ok(e.roast.reduce((s, r) => s + r.of, 0) === lots.length);
  }
  const fam = familyCounts(lots);
  for (const v of Object.values(fam)) assert.ok(v <= lots.length);
});

test('the tasting card compares by note, then family, and its link round-trips without guessing', () => {
  const c = compareCard(['strawberry', 'jasmine', 'chocolate'], 'Raspberry, jasmine, cane sugar');
  assert.deepEqual(c.shared, ['jasmine']);
  assert.ok(c.near.includes('strawberry'));
  assert.ok(c.yoursOnly.includes('chocolate'));
  const q = encodeCard({ pins: ['strawberry', 'jasmine'], bag: 'raspberry' });
  assert.deepEqual(decodeCard(q), { pins: ['strawberry', 'jasmine'], bag: 'raspberry', dropped: 0, unknown: 0, overLimit: 0 });
  const d = decodeCard('?pins=blueberry,not-a-note,jasmine,blueberry,lemon,orange');
  assert.equal(d.pins.length, MAX_PINS);
  assert.ok(!d.pins.includes('not-a-note'));
});

// ── Brewing Constellations ──
test('thirteen brewers, each described from its own axes', () => {
  assert.equal(ATLAS.length, 13);
  for (const m of ATLAS) {
    const s = describe(m);
    assert.ok(s.endsWith('.') && s.includes(timeText(m)), `${m.id}: ${s}`);
  }
});

test('every Brew Guide link decodes and builds a recipe in the engine', () => {
  for (const m of ATLAS) {
    const href = brewGuideHref(m);
    if (!href) continue;
    const st = decodeBrew(href.split('?')[1]);
    assert.equal(st.ok, true, `${m.id}: ${JSON.stringify(st)}`);
    const r = buildRecipe(st.value);
    assert.equal(r.ok, true, `${m.id}: ${JSON.stringify(r)}`);
  }
});

test('comparisons: a brewer differs from itself on nothing; V60 and French press differ on contact and filter', () => {
  for (const m of ATLAS) assert.deepEqual(differences(m, m), []);
  const v60 = ATLAS.find((m) => m.id === 'v60'), fp = ATLAS.find((m) => m.id === 'french-press');
  const d = differences(v60, fp);
  assert.ok(d.includes('contact') && d.includes('filter'), d.join(','));
  assert.match(differenceSentence(v60, fp), /\.$/);
});

test('the time axis is monotonic and its ticks sit in order', () => {
  let last = -1;
  for (const t of TIME_TICKS) { const p = timePosition(t.s); assert.ok(p > last); last = p; }
  assert.equal(timePosition(1), 0);
  assert.equal(timePosition(10 ** 7), 1);
});

// ── Origins atlas ──
test('thirty origins, each on a continent tab, with an id-unique marker inside the map', () => {
  assert.equal(ORIGINS.length, 30);
  assert.equal(new Set(ORIGINS.map((o) => o.id)).size, 30);
  for (const o of ORIGINS) {
    assert.ok(CONTINENTS.some((c) => c.id === o.continent), o.id);
    const [x, y] = project(o.lat, o.lon);
    assert.ok(x >= 0 && x <= 1000 && y >= 0 && y <= 367, `${o.id} ${x},${y}`);
  }
});

test('Yemen sits under "Africa & Yemen", as its tab says', () => {
  const africa = CONTINENTS.find((c) => c.id === 'africa');
  assert.match(africa.label, /Yemen/);
  assert.equal(ORIGINS.find((o) => o.id === 'yemen').continent, 'africa');
});

test('the 19 country pages keep their URLs and each maps to an origin hub and a summary', () => {
  const pages = ORIGINS.filter((o) => o.page);
  assert.equal(pages.length, 19);
  for (const h of originHubs) {
    const slug = h.origin_slug;
    assert.ok(originByPage(slug), `no origin for page ${slug}`);
    assert.ok(summaries[slug] || summaries[slug.replace(/_/g, '-')], `no summary for ${slug}`);
  }
});

test('harvest windows wrap across the new year; edges sit next to the window, never inside it', () => {
  assert.deepEqual(monthsIn([10, 2]), [10, 11, 12, 1, 2]);
  assert.deepEqual(monthsIn([3, 3]), [3]);
  const o = { harvest: { main: [10, 1], second: null, variesBy: null, edgeMonths: 1, sources: [] } };
  assert.equal(harvestState(o, 12), 'main');
  assert.equal(harvestState(o, 9), 'edge');
  assert.equal(harvestState(o, 2), 'edge');
  assert.equal(harvestState(o, 5), 'off');
  for (let m = 1; m <= 12; m++) for (const x of harvestingIn(m)) assert.ok(['main', 'second'].includes(harvestState(x, m)));
});

test('the "maybe" buffer is one month at most, as the key says (review r4, Astra)', () => {
  for (const o of ORIGINS) assert.ok(o.harvest.edgeMonths <= 1, `${o.id}: ${o.harvest.edgeMonths}`);
  // Each named source for a calendar resolves, drawn or compared.
  for (const o of ORIGINS) for (const id of [...o.harvest.sources, ...(o.harvest.compare ?? [])]) assert.ok(sourceNames([id]), `${o.id}: ${id}`);
});

test('altitude bands read low to high, and every cited source id exists', () => {
  for (const o of ORIGINS) {
    if (o.altitudeM) { assert.ok(o.altitudeM.min < o.altitudeM.max, o.id); assert.match(bandText(o.altitudeM), / m \(.* ft\)$/); }
    const ids = [...(o.harvest.sources ?? []), ...(o.harvest.compare ?? []), ...(o.altitudeM?.sources ?? []), o.tendencies?.source, o.production?.source, ...(o.sources?.regions ?? []), ...(o.sources?.varieties ?? []), ...(o.sources?.processing ?? [])].filter(Boolean);
    for (const id of ids) assert.ok(originSources[id], `${o.id}: unknown source ${id}`);
  }
  for (const m of ATLAS) for (const id of m.sourceIds) assert.ok(EXPLORE_SOURCES[id], `${m.id}: unknown source ${id}`);
});

// ── Review round 1 (Astra) regressions ──
test('each note counts only its own words: generic family words count toward no note', () => {
  assert.deepEqual(notesInText('floral'), []);
  assert.deepEqual(notesInText('red fruit'), []);
  assert.ok(!notesInText('whipped cream').includes('vanilla'));
  assert.ok(!notesInText('green tea').includes('black-tea'));
  assert.deepEqual(notesInText('elderflower').map((id) => noteById(id).label), ['Other flowers']);
  assert.deepEqual(notesInText('juicy berries').map((id) => noteById(id).label), ['Mixed berries']);
  for (const n of ALL_NOTES) for (const w of n.words) assert.ok(notesInText(w).includes(n.id), `${n.id}: "${w}" doesn't match its own note`);
});

test('a card link tells unknown notes from notes over the limit', () => {
  const over = decodeCard('?pins=blueberry,jasmine,caramel,lemon');
  assert.equal(over.unknown, 0); assert.equal(over.overLimit, 1);
  const bad = decodeCard('?pins=blueberry,not-a-note');
  assert.equal(bad.unknown, 1); assert.equal(bad.overLimit, 0);
});

test('the Clever Dripper is four minutes plus its drain; time differences of half again count', () => {
  const clever = ATLAS.find((m) => m.id === 'clever');
  assert.equal(timeText(clever), '4:30–4:45');
  const v60 = ATLAS.find((m) => m.id === 'v60'), drip = ATLAS.find((m) => m.id === 'drip-machine'), chemex = ATLAS.find((m) => m.id === 'chemex');
  assert.ok(differences(v60, drip).includes('time'));
  assert.ok(!differences(v60, chemex).includes('time'));
  const kalita = ATLAS.find((m) => m.id === 'kalita');
  assert.match(differenceSentence(v60, kalita), /times overlap/);
});

// ── Review round 2 (Opus) regressions ──
test('generic phrases count toward no note: stone fruit, white chocolate, a bare currant; red currant is a mixed berry', () => {
  assert.deepEqual(notesInText('stone fruit'), []);
  assert.deepEqual(notesInText('stonefruit, florals'), []);
  assert.deepEqual(notesInText('peach and white chocolate'), ['stone-fruit']);
  assert.deepEqual(notesInText('currant'), []);
  assert.deepEqual(notesInText('red currant').map((id) => noteById(id).label), ['Mixed berries']);
  assert.deepEqual(notesInText('blackcurrant').map((id) => noteById(id).label), ['Blackcurrant']);
});

test('a family word on the bag names the family, and a pinned note in it counts as close', () => {
  assert.deepEqual(familiesInText('floral, fruity'), ['floral', 'fruity']);
  assert.deepEqual(familiesInText('orange blossom'), []);
  const c = compareCard(['jasmine'], 'floral, nutty');
  assert.deepEqual(c.near, ['jasmine']);
  assert.deepEqual(c.yoursOnly, []);
});

// ── Review round 3 (Astra) regressions ──
test('every growing region is drawn inside its own country, even where the simplified border is coarse', async () => {
  const { regionPoint, inRing } = await import('../mapPlace.ts');
  const { countryPaths } = await import('../../../data/mapPaths.ts');
  const rings = (id) => (countryPaths.find((c) => c.id === id)?.path ?? '').split('M').filter(Boolean).map((sp) => [...sp.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [Number(m[1]), Number(m[2])]));
  const bad = [];
  for (const o of ORIGINS) {
    const rs = rings(o.id);
    if (!rs.length) continue; // Hawaii: no polygon of its own at this scale
    for (const r of o.regions.filter((x) => x.lat !== null && x.lon !== null)) {
      const [x, y] = regionPoint(o.id, r.lat, r.lon);
      if (!rs.some((ps) => inRing(x, y, ps))) bad.push(`${o.id}: ${r.name}`);
    }
  }
  assert.deepEqual(bad, []);
});

test('review r4 (Muse): compounds credit both notes; bare "olive" is not olive oil; the press spans 4–8 min; Turkish is heated', () => {
  assert.deepEqual(notesInText('caramelised pineapple', { roaster: true }).sort(), ['caramel', 'pineapple']);
  assert.deepEqual(notesInText('lemon citrus', { roaster: true }).sort(), ['citrus', 'lemon']);
  assert.deepEqual(notesInText('olive'), []);
  assert.deepEqual(notesInText('olive oil'), ['olive-oil']);
  const fp = ATLAS.find((m) => m.id === 'french-press'), tk = ATLAS.find((m) => m.id === 'turkish');
  assert.deepEqual(fp.timeS, [240, 480]);
  assert.match(fp.timeNote, /4 minutes/);
  assert.match(describe(tk), /^Turkish coffee heats the coffee/);
  assert.doesNotMatch(describe(tk), /steeps/);
  for (const id of ['drip-machine', 'siphon', 'cold-brew']) assert.ok(ATLAS.find((m) => m.id === id).filterNote, id);
});

test('review r4 (Opus): a bag saying "stone fruit" or "dried fruit" is close to the notes it covers, and names Fruity; roasters\' counts unchanged', () => {
  const c = compareCard(['stone-fruit', 'raisin'], 'stone fruit, dried fruit');
  assert.deepEqual(c.near.sort(), ['raisin', 'stone-fruit']);
  assert.deepEqual(c.bagFamilies, ['fruity']);
  assert.deepEqual(c.yoursOnly, []);
  assert.deepEqual(notesInText('stone fruit', { roaster: true }), []);
  assert.deepEqual(notesInText('cherry plum', { roaster: true }), ['plum']);
});

test('review r4 (Opus): V60 vs Kalita names the grind; moka\'s ratio reads as the Brew Guide says', () => {
  const v60 = ATLAS.find((m) => m.id === 'v60'), kal = ATLAS.find((m) => m.id === 'kalita'), moka = ATLAS.find((m) => m.id === 'moka');
  const s = differenceSentence(v60, kal);
  if (v60.grind !== kal.grind) assert.match(s, /grind each recipe uses/);
  assert.match(s, /\.$/);
  assert.equal(ratioText(moka), '1:10 (the pot sets it)');
});

test('review r5 (Astra): Uganda\'s robusta windows are the Sucafina handbook\'s (May–Aug; Nov–Feb), the website compared; Cuba\'s one-lot band is scoped', () => {
  const ug = ORIGINS.find((o) => o.id === 'uganda'), cu = ORIGINS.find((o) => o.id === 'cuba');
  assert.deepEqual(ug.harvest.main, [5, 8]);
  assert.deepEqual(ug.harvest.second, [11, 2]);
  assert.deepEqual(ug.harvest.sources, ['sucafina-handbook-2026']);
  assert.deepEqual(ORIGINS.find((o) => o.id === 'peru').harvest.compare, ['ci-peru', 'sucafina-handbook-2026']);
  assert.match(cu.altitudeM.scope, /offering/);
});

test('review r5 (Opus): adjectives on a note aren\'t families; "black currant" isn\'t also a generic currant; the sample is unchanged', () => {
  assert.deepEqual(familiesInText('roasted almonds'), []);
  assert.deepEqual(familiesInText('sweet tangerine'), []);
  assert.deepEqual(familiesInText('floral, sweet'), ['floral', 'sweet']);
  const c = compareCard(['berries-mixed', 'caramel'], 'black currant, sweet tangerine');
  assert.ok(!c.near.includes('caramel'), 'sweet tangerine names no Sweet family');
  assert.ok(c.near.includes('berries-mixed'), 'same family as the bag\'s blackcurrant');
  const sample = originHubs.flatMap((h) => h.beans).filter((b) => inSample(b.name, b.flavor_notes ?? []));
  assert.equal(sample.length, 272);
});

test('review r5 (Opus): harvest lists order by the bags of the species picked; Indonesia\'s robusta total doesn\'t lift its arabica calendar', () => {
  const oct = harvestingIn(10).sort((a, b) => harvestBags(b) - harvestBags(a)).map((o) => o.id);
  assert.equal(oct[0], 'vietnam');
  assert.ok(oct.indexOf('indonesia') > 3, oct.join(','));
});
