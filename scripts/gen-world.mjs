// Parses scripts/map-preview.txt into exact region rects for worldData.js.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const lines = readFileSync(join(here, 'map-preview.txt'), 'utf8')
  .split(/\r?\n/)
  .filter(l => l.length > 0);

const H = lines.length;
const W = Math.max(...lines.map(l => l.length));
console.log(`grid: ${W} x ${H}`);

const at = (x, y) => (y < 0 || y >= H || x < 0 || x >= (lines[y]?.length ?? 0)) ? '.' : lines[y][x];

// Connected components of identical chars (4-neighbour).
const seen = Array.from({ length: H }, () => new Array(W).fill(false));
const regions = [];
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const c = at(x, y);
    if (c === '.' || seen[y][x]) continue;
    const stack = [[x, y]];
    seen[y][x] = true;
    let minX = x, maxX = x, minY = y, maxY = y, count = 0;
    while (stack.length) {
      const [cx, cy] = stack.pop();
      count++;
      minX = Math.min(minX, cx); maxX = Math.max(maxX, cx);
      minY = Math.min(minY, cy); maxY = Math.max(maxY, cy);
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = cx + dx, ny = cy + dy;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        if (seen[ny][nx] || at(nx, ny) !== c) continue;
        seen[ny][nx] = true;
        stack.push([nx, ny]);
      }
    }
    const w = maxX - minX + 1, h = maxY - minY + 1;
    regions.push({ char: c, x: minX, y: minY, w, h, area: count, solid: count === w * h });
  }
}

regions.sort((a, b) => a.y - b.y || a.x - b.x);
for (const r of regions) {
  const tag = r.solid ? '' : `  <-- NON-RECT (area ${r.area} of ${r.w * r.h})`;
  console.log(`char=${r.char} x=${r.x} y=${r.y} w=${r.w} h=${r.h}${tag}`);
}
