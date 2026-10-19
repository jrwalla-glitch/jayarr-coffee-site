import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitToCup, shotRoom } from '../cupFit.ts';
import { refById } from '../drinks.ts';

// Wave F r2 (Opus): an unpublished shot takes the room the recipe's own cup leaves for it.
test('the room for an unpublished shot is the recipe cup less its other parts', () => {
  assert.deepEqual(shotRoom(refById('flat-cimbali')), [20, 35]); // 150–160 ml cup, 125–130 ml frothed milk
  assert.deepEqual(shotRoom(refById('capp-cimbali')), [25, 35]); // 150–160 ml cup, 125 ml frothed milk
  assert.equal(shotRoom(refById('capp-inei')), null); // its 25 ml shot is published
  assert.equal(shotRoom(refById('latte-illy')), null); // no cup size
});

test("a 4 oz cup is too small for Cimbali's flat white: about 97 ml of milk plus the 20–35 ml its cup leaves for the double shot", () => {
  const f = fitToCup(refById('flat-cimbali'), 118.3);
  assert.ok(f.ok && f.verdict === 'too-small' && f.overflow);
  assert.deepEqual(f.shotRoomMl, [20, 35]);
});

test('the same flat white still fits 150 ml (the low end of its own cup), 6 oz and 8 oz', () => {
  for (const c of [150, 177.4, 236.6]) {
    const f = fitToCup(refById('flat-cimbali'), c);
    assert.ok(f.ok && f.verdict === 'fits', `${c} ml`);
  }
});

test("a cappuccino made twice leaves room for two shots", () => {
  const f = fitToCup(refById('capp-cimbali'), 354.9, 2);
  assert.ok(f.ok && f.times === 2);
  assert.deepEqual(f.shotRoomMl, [50, 70]);
});

test('a published shot keeps the old rule: INEI cappuccino overflows 4 oz on its own numbers', () => {
  const f = fitToCup(refById('capp-inei'), 118.3);
  assert.ok(f.ok && f.verdict === 'too-small' && f.overflow && f.shotRoomMl === undefined);
});
