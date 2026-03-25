#!/usr/bin/env node
/**
 * extract-mini-map.mjs
 *
 * Reads mapPaths.ts, selects major landmasses, transforms coordinates
 * from 1000x367 → 300x180, simplifies paths, and outputs SVG <path>
 * elements grouped by continent.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcFile = resolve(__dirname, '../src/data/mapPaths.ts');

// --- Configuration ---

const SRC_W = 1000;
const SRC_H = 367;
const DST_W = 300;
const DST_H = 180;

// Scale factors
const SCALE_X = DST_W / SRC_W; // 0.3
const SCALE_Y = DST_H / SRC_H; // ~0.4905

// Use uniform scale (the smaller one) to preserve aspect ratio, then center
const SCALE = Math.min(SCALE_X, SCALE_Y); // 0.3
const OFFSET_X = (DST_W - SRC_W * SCALE) / 2; // 0
const OFFSET_Y = (DST_H - SRC_H * SCALE) / 2; // (180 - 110.1) / 2 = 34.95

// Countries grouped by continent (using actual IDs from the file)
const CONTINENT_COUNTRIES = {
  'North America': ['canada', 'usa', 'mexico'],
  'South America': ['brazil', 'argentina', 'colombia', 'peru', 'chile', 'venezuela', 'bolivia', 'ecuador'],
  'Europe': ['france', 'spain', 'germany', 'italy', 'uk', 'poland', 'ukraine', 'turkey', 'romania', 'greece', 'belarus'],
  'Africa': ['algeria', 'libya', 'egypt', 'sudan', 'drc', 'south-africa', 'nigeria', 'kenya', 'tanzania', 'ethiopia', 'madagascar', 'morocco'],
  'Asia': ['russia', 'china', 'india', 'kazakhstan', 'saudi-arabia', 'iran', 'mongolia', 'japan', 'indonesia', 'thailand', 'myanmar', 'pakistan'],
  'Oceania': ['australia', 'new-zealand', 'papua-new-guinea'],
};

// --- Path parsing ---

/**
 * Parse an SVG path string into an array of segments.
 * Each segment is { command, points: [[x,y], ...] }
 */
function parsePath(d) {
  const segments = [];
  // Match command letter followed by coordinate data
  const re = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g;
  let match;
  while ((match = re.exec(d)) !== null) {
    const cmd = match[1];
    const args = match[2].trim();
    if (cmd === 'Z' || cmd === 'z') {
      segments.push({ command: cmd, points: [] });
      continue;
    }
    // Parse coordinate pairs
    const nums = args.match(/-?\d+\.?\d*/g);
    if (!nums) {
      segments.push({ command: cmd, points: [] });
      continue;
    }
    const floats = nums.map(Number);
    const points = [];
    for (let i = 0; i < floats.length; i += 2) {
      if (i + 1 < floats.length) {
        points.push([floats[i], floats[i + 1]]);
      }
    }
    segments.push({ command: cmd, points });
  }
  return segments;
}

/**
 * Transform a point from source to destination coordinate space.
 */
function transformPoint([x, y]) {
  return [
    round(x * SCALE + OFFSET_X),
    round(y * SCALE + OFFSET_Y),
  ];
}

function round(n) {
  return Math.round(n * 10) / 10;
}

/**
 * Simplify a list of points using Ramer-Douglas-Peucker algorithm.
 */
function rdpSimplify(points, epsilon) {
  if (points.length <= 2) return points;

  // Find the point with the maximum distance from the line
  const start = points[0];
  const end = points[points.length - 1];
  let maxDist = 0;
  let maxIdx = 0;

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > maxDist) {
      maxDist = d;
      maxIdx = i;
    }
  }

  if (maxDist > epsilon) {
    const left = rdpSimplify(points.slice(0, maxIdx + 1), epsilon);
    const right = rdpSimplify(points.slice(maxIdx), epsilon);
    return left.slice(0, -1).concat(right);
  } else {
    return [start, end];
  }
}

function perpendicularDistance(point, lineStart, lineEnd) {
  const [x, y] = point;
  const [x1, y1] = lineStart;
  const [x2, y2] = lineEnd;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;

  if (lenSq === 0) {
    // lineStart and lineEnd are the same point
    return Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
  }

  const num = Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1);
  return num / Math.sqrt(lenSq);
}

/**
 * Process a single SVG path: transform + simplify.
 * Returns a new SVG path string.
 */
function processPath(d, epsilon = 1.0) {
  // The paths use M and L commands with absolute coords, and Z to close.
  // They may contain multiple subpaths (M...Z M...Z).
  // Split into subpaths
  const subpaths = d.split(/(?=M)/);
  const resultParts = [];

  for (const sub of subpaths) {
    if (!sub.trim()) continue;

    const segments = parsePath(sub);
    // Collect all points (M + L points)
    let allPoints = [];
    let hasClose = false;

    for (const seg of segments) {
      if (seg.command === 'Z' || seg.command === 'z') {
        hasClose = true;
        continue;
      }
      for (const pt of seg.points) {
        allPoints.push(transformPoint(pt));
      }
    }

    if (allPoints.length === 0) continue;

    // Simplify
    const simplified = rdpSimplify(allPoints, epsilon);

    if (simplified.length < 3) continue; // Skip tiny fragments

    // Skip subpaths that are very small (bounding box area < threshold)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [px, py] of simplified) {
      if (px < minX) minX = px;
      if (py < minY) minY = py;
      if (px > maxX) maxX = px;
      if (py > maxY) maxY = py;
    }
    const bboxArea = (maxX - minX) * (maxY - minY);
    if (bboxArea < 4) continue; // Skip very tiny fragments at this scale

    // Build path string
    let pathStr = `M${simplified[0][0]},${simplified[0][1]}`;
    for (let i = 1; i < simplified.length; i++) {
      pathStr += `L${simplified[i][0]},${simplified[i][1]}`;
    }
    if (hasClose) pathStr += 'Z';

    resultParts.push(pathStr);
  }

  return resultParts.join('');
}

// --- Main ---

const raw = readFileSync(srcFile, 'utf-8');

// Parse the country entries: extract id and path
const entryRe = /\{\s*id:\s*"([^"]+)",\s*interactive:\s*(?:true|false),\s*path:\s*"([^"]+)"\s*\}/g;
const countryMap = new Map();
let m;
while ((m = entryRe.exec(raw)) !== null) {
  countryMap.set(m[1], m[2]);
}

console.log(`<!-- Mini world map: ${DST_W}x${DST_H}, scale=${SCALE.toFixed(4)}, offset=(${OFFSET_X.toFixed(1)},${OFFSET_Y.toFixed(1)}) -->`);
console.log(`<!-- Source: ${countryMap.size} countries in ${SRC_W}x${SRC_H} -->`);
console.log();

// Simplification tolerance in destination coordinate space
// Higher = more aggressive simplification
const EPSILON = 1.5;

let totalCountries = 0;
let skippedCountries = [];

for (const [continent, countries] of Object.entries(CONTINENT_COUNTRIES)) {
  const paths = [];

  for (const id of countries) {
    const pathData = countryMap.get(id);
    if (!pathData) {
      skippedCountries.push(id);
      continue;
    }

    const simplified = processPath(pathData, EPSILON);
    if (simplified) {
      paths.push(simplified);
      totalCountries++;
    }
  }

  if (paths.length === 0) continue;

  // Combine all paths for this continent into a single <path> element
  const combined = paths.join(' ');
  console.log(`<!-- ${continent} -->`);
  console.log(`<path d="${combined}" fill="#C9B99A" />`);
  console.log();
}

if (skippedCountries.length > 0) {
  console.log(`<!-- Skipped (not found): ${skippedCountries.join(', ')} -->`);
}
console.log(`<!-- Total: ${totalCountries} countries rendered -->`);
