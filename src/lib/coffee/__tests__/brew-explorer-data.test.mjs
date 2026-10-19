import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { methods, scienceArticles } from '../../../data/brewMethodData.ts';

// The Brew Explorer's article links carry their titles as data, so they drifted when articles were retitled
// (round 3, B3). Each must name a live article by its current front-matter title.
const blog = new URL('../../../content/blog/', import.meta.url);
const titleOf = (slug) => {
  for (const ext of ['.mdx', '.md']) {
    const f = new URL(slug + ext, blog);
    if (existsSync(f)) {
      const line = readFileSync(f, 'utf8').match(/^title:\s*(.*)$/m)[1].trim();
      return line.startsWith('"') ? JSON.parse(line) : line.replace(/^'(.*)'$/, '$1');
    }
  }
  return null;
};

test('B3: every Brew Explorer article link names a live article by its current title', () => {
  const links = [...methods.flatMap((m) => m.articles), ...scienceArticles];
  assert.ok(links.length > 30);
  for (const a of links) assert.equal(a.title, titleOf(a.slug), a.slug);
});

test('item 24 and B3: no unsourced pressure figures, cold brew follows the Brew Guide, no Prismo-equals-espresso claim', () => {
  const text = JSON.stringify(methods);
  assert.doesNotMatch(text, /1\.5 bars|0\.5 bars|~1\.5|~0\.5/);
  assert.doesNotMatch(text, /12[–-]24 hours/);
  assert.doesNotMatch(text, /approximates espresso|mimics espresso/);
  const cold = methods.find((m) => m.id === 'cold-brew');
  assert.match(cold.oneLiner, /about 12 hours in the fridge/);
});
