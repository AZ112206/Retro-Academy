import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GRID, HALLS, ROOMS, DOORS } from './worldData';

const GW = GRID.w;
const GH = GRID.h;

// ─── Retro palette ───────────────────────────────────────────────────────────
const PAL = {
  outdoor: '#e3ebf1',
  wall:    '#1b1b1b',
  window:  '#aed4ea',
  floors: {
    1: ['#d9d1a7', '#d9d1a7'], // room
    2: ['#d9d1a7', '#d9d1a7'], // hall
    3: ['#d9d1a7', '#d9d1a7'], // cafeteria
    4: ['#d9d1a7', '#d9d1a7'], // utility
    5: ['#e9f0f5', '#e9f0f5'], // enclosed courtyard
  },
};

const TYPE_CODE = { room: 1, hall: 2, cafeteria: 3, utility: 4, courtyard: 5 };

// ─── Build cell maps: room ids, floor types, door-edge set ───────────────────
function buildWorld() {
  const idMap = new Int16Array(GW * GH).fill(-1);
  const typeMap = new Uint8Array(GW * GH);
  const roomById = [{ type: 'hall', wing: null }];

  const stamp = (r, id, type) => {
    const t = TYPE_CODE[type] || 1;
    for (let gy = r.y; gy < r.y + r.h; gy++) {
      for (let gx = r.x; gx < r.x + r.w; gx++) {
        if (gx >= 0 && gx < GW && gy >= 0 && gy < GH) {
          idMap[gy * GW + gx] = id;
          typeMap[gy * GW + gx] = t;
        }
      }
    }
  };

  HALLS.forEach(hall => stamp(hall, 0, 'hall'));
  ROOMS.forEach((room, i) => {
    stamp(room, i + 1, room.type);
    roomById[i + 1] = room;
  });

  const doorSet = new Set();
  const drawDoorSet = new Set();
  DOORS.forEach(d => {
    for (let i = 0; i < (d.len || 1); i++) {
      const key = d.dir === 'S' ? `${d.x + i},${d.y},S` : `${d.x},${d.y + i},E`;
      doorSet.add(key);
      drawDoorSet.add(key);
    }
  });

  return { idMap, typeMap, doorSet, drawDoorSet, roomById };
}

// ─── Main draw function ──────────────────────────────────────────────────────
function drawMap(ctx, W, H, world, pos, pal) {
  const { idMap, typeMap, drawDoorSet, roomById } = world;
  const tile = Math.max(6, Math.floor(Math.min(W / GW, H / GH)));
  const ox = Math.floor((W - GW * tile) / 2);
  const oy = Math.floor((H - GH * tile) / 2);
  const wt  = Math.max(2, Math.round(tile * 0.3));  // interior wall thickness
  const wtE = Math.max(3, Math.round(tile * 0.45)); // exterior wall thickness

  const idAt = (x, y) => (x < 0 || y < 0 || x >= GW || y >= GH) ? -1 : idMap[y * GW + x];

  // 1. outdoor / courtyard background
  ctx.fillStyle = PAL.outdoor;
  ctx.fillRect(0, 0, W, H);

  // 2. floors (subtle checker per space type)
  for (let gy = 0; gy < GH; gy++) {
    for (let gx = 0; gx < GW; gx++) {
      const id = idMap[gy * GW + gx];
      if (id < 0) continue;
      const pair = PAL.floors[typeMap[gy * GW + gx]];
      ctx.fillStyle = pair[0];
      ctx.fillRect(ox + gx * tile, oy + gy * tile, tile, tile);
    }
  }

  // 3. walls: exterior (thick) + interior partitions, skipping doorway openings
  ctx.fillStyle = PAL.wall;
  for (let gy = 0; gy < GH; gy++) {
    for (let gx = 0; gx < GW; gx++) {
      const id = idAt(gx, gy);
      if (id < 0) continue;
      const px = ox + gx * tile;
      const py = oy + gy * tile;
      const nN = idAt(gx, gy - 1), nS = idAt(gx, gy + 1);
      const nW = idAt(gx - 1, gy), nE = idAt(gx + 1, gy);

      if (nN !== id) {
        if (nN < 0) ctx.fillRect(px, py, tile, wtE);
        else if (!drawDoorSet.has(`${gx},${gy - 1},S`)) ctx.fillRect(px, py, tile, wt);
      }
      if (nS !== id) {
        if (nS < 0) ctx.fillRect(px, py + tile - wtE, tile, wtE);
        else if (!drawDoorSet.has(`${gx},${gy},S`)) ctx.fillRect(px, py + tile - wt, tile, wt);
      }
      if (nW !== id) {
        if (nW < 0) ctx.fillRect(px, py, wtE, tile);
        else if (!drawDoorSet.has(`${gx - 1},${gy},E`)) ctx.fillRect(px, py, wt, tile);
      }
      if (nE !== id) {
        if (nE < 0) ctx.fillRect(px + tile - wtE, py, wtE, tile);
        else if (!drawDoorSet.has(`${gx},${gy},E`)) ctx.fillRect(px + tile - wt, py, wt, tile);
      }
    }
  }

  // 4. windows – side-specific for wings, same cadence used across center/north areas
  ctx.fillStyle = PAL.window;
  const ww = Math.max(3, Math.round(tile * 0.6));
  const wOff = Math.floor((tile - ww) / 2);
  for (let gy = 0; gy < GH; gy++) {
    for (let gx = 0; gx < GW; gx++) {
      const id = idAt(gx, gy);
      if (id <= 0) continue;
      const room = roomById[id];
      const wing = room?.wing || null;

      const cadenceH = gx % 3 === 1;
      const cadenceV = gy % 3 === 1;

      const allowWest = wing === 'left-outer' ? cadenceV : (!wing && cadenceV);
      const allowEast = (wing === 'left-inner' || wing === 'right') ? cadenceV : (!wing && cadenceV);
      const allowNorth = !wing && cadenceH;
      const allowSouth = !wing && cadenceH;

      const px = ox + gx * tile;
      const py = oy + gy * tile;

      if (allowNorth && idAt(gx, gy - 1) < 0) ctx.fillRect(px + wOff, py, ww, wtE);
      if (allowSouth && idAt(gx, gy + 1) < 0) ctx.fillRect(px + wOff, py + tile - wtE, ww, wtE);
      if (allowWest && idAt(gx - 1, gy) < 0) ctx.fillRect(px, py + wOff, wtE, ww);
      if (allowEast && idAt(gx + 1, gy) < 0) ctx.fillRect(px + tile - wtE, py + wOff, wtE, ww);
    }
  }

  // 5. player sprite
  const spx = ox + pos.x * tile;
  const spy = oy + pos.y * tile;

  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(spx + 2, spy + tile - 2, tile - 4, 2);

  const hw = Math.max(3, Math.floor(tile * 0.54));
  const hx = spx + Math.floor((tile - hw) / 2);

  ctx.fillStyle = pal.hairColor;
  ctx.fillRect(hx, spy + Math.floor(tile * 0.07), hw, Math.max(2, Math.floor(tile * 0.2)));
  ctx.fillStyle = pal.skinTone;
  ctx.fillRect(hx, spy + Math.floor(tile * 0.2), hw, Math.max(2, Math.floor(tile * 0.22)));
  const bw = Math.max(4, Math.floor(tile * 0.64));
  const bx = spx + Math.floor((tile - bw) / 2);
  ctx.fillStyle = pal.topColor;
  ctx.fillRect(bx, spy + Math.floor(tile * 0.43), bw, Math.max(3, Math.floor(tile * 0.3)));
  const lw  = Math.max(2, Math.floor(bw * 0.42));
  const ly  = spy + Math.floor(tile * 0.72);
  const lhh = Math.max(2, Math.floor(tile * 0.2));
  ctx.fillStyle = pal.bottomColor;
  ctx.fillRect(bx,           ly, lw, lhh);
  ctx.fillRect(bx + bw - lw, ly, lw, lhh);
  ctx.fillStyle = pal.shoeColor;
  ctx.fillRect(bx - 1,           ly + lhh - 1, lw + 2, Math.max(1, Math.floor(tile * 0.07)));
  ctx.fillRect(bx + bw - lw - 1, ly + lhh - 1, lw + 2, Math.max(1, Math.floor(tile * 0.07)));
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function ElementarySchoolMap({
  playerAvatar,
  onBack,
  ...unusedProps
}) {
  void unusedProps;
  const canvasRef = useRef(null);
  const [pos, setPos]  = useState({ x: 38, y: 31 }); // start in main corridor
  const [vp,  setVp]   = useState({ w: window.innerWidth, h: window.innerHeight });

  const palette = useMemo(() => ({
    skinTone:    playerAvatar?.skinTone    || '#D8AE8B',
    hairColor:   playerAvatar?.hairColor   || '#20140F',
    topColor:    playerAvatar?.topColor    || '#1F3A5F',
    bottomColor: playerAvatar?.bottomColor || '#3C3C3C',
    shoeColor:   playerAvatar?.shoeColor   || '#111111',
  }), [playerAvatar]);

  const world = useMemo(() => buildWorld(), []);

  // Movement between cells: same space is free; different spaces need a doorway.
  const canMove = useCallback((fx, fy, tx, ty) => {
    if (tx < 0 || ty < 0 || tx >= GW || ty >= GH) return false;
    const a = world.idMap[fy * GW + fx];
    const b = world.idMap[ty * GW + tx];
    if (b < 0) return false;
    if (a === b) return true;
    const key = tx > fx ? `${fx},${fy},E`
              : tx < fx ? `${tx},${ty},E`
              : ty > fy ? `${fx},${fy},S`
              : `${tx},${ty},S`;
    return world.doorSet.has(key);
  }, [world]);

  // WASD movement + ESC to exit
  useEffect(() => {
    const onKey = e => {
      const k = e.key.toLowerCase();
      if (k === 'escape') { onBack?.(); return; }
      if (!['w', 'a', 's', 'd'].includes(k)) return;
      e.preventDefault();
      setPos(p => {
        const nx = p.x + (k === 'a' ? -1 : k === 'd' ? 1 : 0);
        const ny = p.y + (k === 'w' ? -1 : k === 's' ? 1 : 0);
        return canMove(p.x, p.y, nx, ny) ? { x: nx, y: ny } : p;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canMove, onBack]);

  // Viewport resize
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const { w, h } = vp;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMap(ctx, w, h, world, pos, palette);
  }, [pos, palette, vp, world]);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: PAL.outdoor }}>
      <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
    </div>
  );
}