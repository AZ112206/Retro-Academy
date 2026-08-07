// Validates worldData.js: overlap report, door validity, and reachability.
import { GRID, HALLS, ROOMS, DOORS } from '../src/components/Game World/worldData.js';

const GW = GRID.w, GH = GRID.h;
const idMap = new Int16Array(GW * GH).fill(-1);

const overlaps = [];
const stamp = (room, id) => {
  const fill = room.type === 'outdoor' ? -1 : id;
  for (let y = room.y; y < room.y + room.h; y++) {
    for (let x = room.x; x < room.x + room.w; x++) {
      if (x < 0 || x >= GW || y < 0 || y >= GH) continue;
      const prev = idMap[y * GW + x];
      if (prev >= 0 && prev !== fill && fill >= 0) overlaps.push({ x, y, prev, id: fill });
      idMap[y * GW + x] = fill;
    }
  }
};
HALLS.forEach(h => stamp(h, 0));
ROOMS.forEach((r, i) => stamp(r, i + 1));

const overlapPairs = new Set(overlaps.map(o => `${o.prev}->${o.id}`));
console.log('overlap pairs (stamp-order carves):', [...overlapPairs].map(p => {
  const [a, b] = p.split('->').map(Number);
  const name = n => n === 0 ? 'HALL' : ROOMS[n - 1].label;
  return `${name(a)} -> ${name(b)}`;
}));

const doorSet = new Set();
DOORS.forEach(d => {
  for (let i = 0; i < (d.len || 1); i++) {
    doorSet.add(d.dir === 'S' ? `${d.x + i},${d.y},S` : `${d.x},${d.y + i},E`);
  }
});

const idAt = (x, y) => (x < 0 || y < 0 || x >= GW || y >= GH) ? -1 : idMap[y * GW + x];
const badDoors = [];
for (const key of doorSet) {
  const [x, y, dir] = key.split(',');
  const a = idAt(+x, +y);
  const b = dir === 'S' ? idAt(+x, +y + 1) : idAt(+x + 1, +y);
  if (a < 0 || b < 0 || a === b) badDoors.push({ key, a, b });
}
console.log('badDoors:', badDoors.length ? badDoors : 'none');

// BFS with the renderer's canMove rule.
const canMove = (fx, fy, tx, ty) => {
  if (tx < 0 || ty < 0 || tx >= GW || ty >= GH) return false;
  const a = idMap[fy * GW + fx], b = idMap[ty * GW + tx];
  if (b < 0) return false;
  if (a === b) return true;
  const key = tx > fx ? `${fx},${fy},E` : tx < fx ? `${tx},${ty},E`
    : ty > fy ? `${fx},${fy},S` : `${tx},${ty},S`;
  return doorSet.has(key);
};

const start = { x: 30, y: 35 }; // main corridor
const visited = new Uint8Array(GW * GH);
const queue = [start];
visited[start.y * GW + start.x] = 1;
while (queue.length) {
  const { x, y } = queue.shift();
  for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
    const nx = x + dx, ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
    if (visited[ny * GW + nx] || !canMove(x, y, nx, ny)) continue;
    visited[ny * GW + nx] = 1;
    queue.push({ x: nx, y: ny });
  }
}

const unreachedIds = new Set();
for (let y = 0; y < GH; y++) {
  for (let x = 0; x < GW; x++) {
    const id = idMap[y * GW + x];
    if (id >= 0 && !visited[y * GW + x]) unreachedIds.add(id);
  }
}
const name = n => n === 0 ? 'HALL' : ROOMS[n - 1].label;
console.log('unreached:', unreachedIds.size ? [...unreachedIds].map(name) : 'none');
