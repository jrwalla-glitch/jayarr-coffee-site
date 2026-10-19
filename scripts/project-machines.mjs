#!/usr/bin/env node
/**
 * project-machines.mjs
 *
 * Writes src/data/machines-chooser.json: machines.json projected to the fields the Espresso Machine
 * Chooser shows (projectForChooser in src/lib/coffee/machines.ts). The full records carry every
 * field's sources and the research's notes; the Chooser's island ships only this projection
 * (Wave F r1, B6.4).
 *
 * Run it after any change to machines.json:   node scripts/project-machines.mjs
 * The Chooser page compares the two when it builds and fails the build if they differ, and an engine
 * test does the same, so a stale projection can't ship.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { projectForChooser } = await import(resolve(root, 'src/lib/coffee/machines.ts'));
const full = JSON.parse(readFileSync(resolve(root, 'src/data/machines.json'), 'utf8'));
const out = resolve(root, 'src/data/machines-chooser.json');
writeFileSync(out, JSON.stringify(projectForChooser(full), null, 1) + '\n');
console.log(`wrote ${out}`);
