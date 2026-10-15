import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const { pods } = JSON.parse(readFileSync(new URL('../../../data/nespressoPods.json', import.meta.url), 'utf8'));

test('every pod is unique by system and name (Original Colombia is not Vertuo Colombia)', () => {
  const ids = pods.map((p) => `${p.line}:${p.name}`);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(pods.every((p) => p.line === 'original' || p.line === 'vertuo'));
  assert.equal(pods.filter((p) => p.name === 'Colombia').length, 2, 'the known shared name is still present to guard');
});

// "Try also" data: 35 suggestions point to the other system or to pods not in the catalog. The UI
// shows a suggestion only when it exists in the same system; the Pod Finder rebuild (Wave B) redoes
// this data machine-first. Guard that the count only goes down.
test('cross-system or missing "try also" suggestions do not grow', () => {
  const names = new Set(pods.map((p) => `${p.line}:${p.name}`));
  const broken = pods.filter((p) => p.try_also && !names.has(`${p.line}:${p.try_also}`)).length;
  assert.ok(broken <= 35, String(broken));
});

// ── The rebuilt explorer's engine (Wave B) ──
import { catalog, sizeRows, filterPods, wall, tryAlso, podFromParam, buySearch, aromaFamilies, sizeName, onSale } from '../pods.ts';
const all = catalog(pods);

test('the wall places every pod of a system exactly once, on its own system\'s rows', () => {
  for (const line of ['original', 'vertuo']) {
    const mine = all.filter((p) => p.line === line);
    const rows = sizeRows(all, line);
    const placed = wall(mine, rows);
    assert.equal(placed.length, mine.length, line);
    assert.equal(new Set(placed.map((x) => x.pod.id)).size, mine.length);
    for (const x of placed) { assert.equal(rows[x.row].ml, x.pod.ml); assert.equal(x.col, x.pod.intensity ?? 0); }
    // Rows run smallest first.
    assert.deepEqual(rows.map((r) => r.ml), [...rows.map((r) => r.ml)].sort((a, b) => a - b));
  }
  assert.deepEqual(sizeRows(all, 'original').map((r) => r.name), ['Ristretto', 'Espresso', 'Lungo']);
  assert.equal(sizeName({ cup_size: 'espresso', ml: 25 }), 'Ristretto');
});

test('filters, suggestions and links never cross systems; retired and unlisted pods are opt-in', () => {
  for (const line of ['original', 'vertuo']) {
    const shown = filterPods(all, { line, query: 'colombia' });
    assert.ok(shown.length >= 1 && shown.every((p) => p.line === line), line);
    assert.ok(filterPods(all, { line }).every(onSale));
    assert.ok(filterPods(all, { line, includeUnlisted: true }).length > filterPods(all, { line }).length, line);
  }
  for (const p of all) { const t = tryAlso(all, p); if (t) { assert.equal(t.line, p.line); assert.ok(onSale(t)); } }
  assert.equal(podFromParam(all, 'vertuo-colombia').line, 'vertuo');
  assert.equal(podFromParam(all, 'original-colombia').line, 'original');
  assert.equal(podFromParam(all, 'nope'), null);
  for (const p of all) assert.match(buySearch(p), new RegExp(`Nespresso\\+${p.line === 'original' ? 'Original' : 'Vertuo'}\\+`));
  assert.match(buySearch(all.find((p) => p.name.startsWith('Café'))), /Caf%C3%A9/, 'accents survive in the search');
});

test('aroma families come from the published aroma words', () => {
  const fam = (aroma) => aromaFamilies({ aroma });
  assert.deepEqual(fam('Cocoa & Fruity').sort(), ['cocoa', 'fruity']);
  assert.ok(fam('Maple & Pecan').includes('sweet'));
  assert.ok(all.filter((p) => !p.flavored).every((p) => aromaFamilies(p).length > 0 || /Bold|Balanced|Round|Chicory/.test(p.aroma)), 'unflavoured pods land in a family');
});

test('"Similar on the wall" stays on the same row, system and current range', async () => {
  const { similar } = await import('../pods.ts');
  for (const p of all) {
    const s = similar(all, p);
    if (!s) continue;
    assert.equal(s.line, p.line); assert.equal(s.ml, p.ml); assert.notEqual(s.id, p.id); assert.ok(onSale(s));
  }
  assert.ok(similar(all, all.find((p) => p.line === 'vertuo' && p.name === 'Colombia')));
});

test('Astra R18: verified sizes, statuses and aliases', () => {
  const get = (k) => all.find((p) => p.id === k);
  assert.equal(get('vertuo:Alto Onice').ml, 355);
  assert.equal(get('vertuo:Ginseng Delight').ml, 80);
  assert.equal(get('vertuo:Ginseng Delight').intensity, null);
  assert.equal(get('original:Caramello').cup_size, 'lungo');
  assert.equal(sizeName(get('vertuo:Ristretto Intenso')), 'Ristretto');
  assert.ok(all.every((p) => ['current', 'limited', 'seasonal', 'unlisted', 'retired'].includes(p.status)));
  assert.ok(all.filter((p) => p.status === 'unlisted').every((p) => !p.discontinued), 'unlisted is not discontinued');
  // The renamed Ristretto Italiano Decaffeinato still opens from its old link.
  assert.equal(podFromParam(all, 'original-ispirazione-ristretto-italiana-decaffeinato')?.name, 'Ristretto Italiano Decaffeinato');
  // No decaf copy promises zero caffeine or sleep.
  for (const p of all.filter((x) => x.decaf)) assert.doesNotMatch(`${p.description ?? ''} ${p.best_for ?? ''}`, /caffeine-free|zero caffeine|no caffeine|need to sleep|sleep tonight/i, p.id);
});

test('renamed capsules resolve everywhere: suggestions, line:name links and saved flights', async () => {
  const { catalog, byName, podFromParam, cleanFlight, tryAlso, onSale } = await import('../pods.ts');
  const all = catalog(pods);
  assert.equal(byName(all, 'vertuo', 'Chiaro')?.name, 'Double Espresso Chiaro');
  assert.equal(podFromParam(all, 'vertuo:Chiaro')?.name, 'Double Espresso Chiaro');
  assert.equal(podFromParam(all, 'original:Chiaro')?.line ?? 'original', 'original');
  assert.deepEqual(cleanFlight(all, ['vertuo:Chiaro', 'vertuo:Scuro', 'vertuo:Double Espresso Chiaro', 'vertuo:Colombia', 'vertuo:Colombia', 'nonsense', 7]),
    ['vertuo:Double Espresso Chiaro', 'vertuo:Double Espresso Scuro', 'vertuo:Colombia']);
  // Every editorial "try also" names a capsule of the same system, through renames.
  for (const p of all) if (p.try_also) assert.ok(byName(all, p.line, p.try_also), `${p.id} -> ${p.try_also}`);
  const scuro = all.find((p) => p.id === 'vertuo:Double Espresso Scuro');
  if (scuro?.try_also) { const t = tryAlso(all, scuro); assert.ok(!t || (t.line === 'vertuo' && onSale(t))); }
});

test('a decaf capsule is never offered a caffeinated twin, and Arpeggio Extra says it is caffeine-enriched', async () => {
  const { catalog, similar } = await import('../pods.ts');
  const all = catalog(pods);
  for (const p of all.filter((x) => x.decaf)) { const n = similar(all, p); assert.ok(!n || n.decaf, `${p.id} -> ${n?.id}`); }
  const extra = all.find((p) => p.id === 'original:Arpeggio Extra');
  assert.match(extra.description, /caffeine/);
  assert.equal(extra.caffeine_boosted, true);
  for (const p of all.filter((x) => !x.caffeine_boosted)) assert.notEqual(similar(all, p)?.id, 'original:Arpeggio Extra');
});

test('roast categories the research could not verify stay unknown', () => {
  for (const [line, name] of [['original', 'Maple Pecan'], ['vertuo', 'Decaffeinato Ontuoso'], ['vertuo', 'Bianco Leggero'], ['vertuo', 'Decaffeinato Intenso'], ['original', 'Vivalto Lungo Decaffeinato'], ['original', 'Arpeggio Extra']])
    assert.equal(pods.find((p) => p.line === line && p.name === name).roast_level, null, `${line} ${name}`);
});

test('decaf and flavour flags follow the capsule names and Nespresso\'s own wording', () => {
  for (const p of pods.filter((x) => /Decaffeinato|Decaf\b/i.test(x.name))) assert.equal(p.decaf, true, `${p.line} ${p.name}`);
  assert.equal(pods.find((p) => p.name === 'Vaniglia Decaffeinato').flavored, true);
});

test('a flight keeps up to three capsules per system, and the other system\'s flight survives', async () => {
  const { catalog, cleanFlight } = await import('../pods.ts');
  const all = catalog(pods);
  const ids = ['original:Colombia', 'original:Volluto', 'original:Cosi', 'original:Napoli', 'vertuo:Colombia'];
  assert.deepEqual(cleanFlight(all, ids), ['original:Colombia', 'original:Volluto', 'original:Cosi', 'vertuo:Colombia']);
});

test('near-duplicate Nespresso ranges join into one filter value', async () => {
  const { rangeOf } = await import('../pods.ts');
  assert.equal(rangeOf({ category: 'Starbucks® by Nespresso' }), 'Starbucks');
  assert.equal(rangeOf({ category: 'Starbucks' }), 'Starbucks');
  assert.equal(rangeOf({ category: 'Gran Lungo (5 oz)' }), 'Gran Lungo');
  assert.equal(rangeOf({ category: 'Festive Limited Edition' }), 'Limited Edition');
  assert.equal(rangeOf({ category: 'Barista Creations' }), 'Barista Creations');
});
