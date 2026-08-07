import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GRID, HALLS, ROOMS, DOORS } from './worldData';

const GW = GRID.w;
const GH = GRID.h;

const PAL = {
  outdoor: '#e3ebf1',
  wall: '#1b1b1b',
  floor: '#d9d1a7',
};

const BLUEPRINT_IMAGE_PATH = '/school-floorplan.png';

const TYPE_CODE = { room: 1, hall: 2, cafeteria: 3, utility: 4, courtyard: 5 };

function buildWorld() {
  const idMap = new Int16Array(GW * GH).fill(-1);
  const roomById = [{ type: 'hall' }];

  const stamp = (room, id, type) => {
    const code = TYPE_CODE[type] || 1;
    const fill = type === 'outdoor' ? -1 : id;
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        if (x >= 0 && x < GW && y >= 0 && y < GH) {
          idMap[y * GW + x] = fill;
        }
      }
    }
    if (type !== 'outdoor') roomById[id] = { ...room, code };
  };

  HALLS.forEach(hall => stamp(hall, 0, 'hall'));
  ROOMS.forEach((room, index) => stamp(room, index + 1, room.type));

  const doorSet = new Set();
  DOORS.forEach(door => {
    for (let i = 0; i < (door.len || 1); i++) {
      const key = door.dir === 'S'
        ? `${door.x + i},${door.y},S`
        : `${door.x},${door.y + i},E`;
      doorSet.add(key);
    }
  });

  return { idMap, doorSet, roomById };
}

function drawMap(ctx, width, height, world, blueprintImage) {
  const tile = Math.max(6, Math.floor(Math.min(width / GW, height / GH)));
  const ox = Math.floor((width - GW * tile) / 2);
  const oy = Math.floor((height - GH * tile) / 2);
  const wallThin = Math.max(2, Math.round(tile * 0.28));
  const wallThick = Math.max(3, Math.round(tile * 0.45));

  const idAt = (x, y) => (x < 0 || y < 0 || x >= GW || y >= GH) ? -1 : world.idMap[y * GW + x];

  ctx.fillStyle = PAL.outdoor;
  ctx.fillRect(0, 0, width, height);

  if (blueprintImage) {
    ctx.save();
    ctx.globalAlpha = 0.28;
    ctx.drawImage(blueprintImage, ox, oy, GW * tile, GH * tile);
    ctx.restore();
  }

  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const id = world.idMap[y * GW + x];
      if (id < 0) continue;
      ctx.fillStyle = PAL.floor;
      ctx.fillRect(ox + x * tile, oy + y * tile, tile, tile);
    }
  }

  ctx.fillStyle = PAL.wall;
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW; x++) {
      const id = idAt(x, y);
      if (id < 0) continue;
      const px = ox + x * tile;
      const py = oy + y * tile;
      const nN = idAt(x, y - 1);
      const nS = idAt(x, y + 1);
      const nW = idAt(x - 1, y);
      const nE = idAt(x + 1, y);

      if (nN !== id) {
        if (nN < 0) { if (!world.doorSet.has(`${x},${y - 1},S`)) ctx.fillRect(px, py, tile, wallThick); }
        else if (!world.doorSet.has(`${x},${y - 1},S`)) ctx.fillRect(px, py, tile, wallThin);
      }
      if (nS !== id) {
        if (nS < 0) { if (!world.doorSet.has(`${x},${y},S`)) ctx.fillRect(px, py + tile - wallThick, tile, wallThick); }
        else if (!world.doorSet.has(`${x},${y},S`)) ctx.fillRect(px, py + tile - wallThin, tile, wallThin);
      }
      if (nW !== id) {
        if (nW < 0) { if (!world.doorSet.has(`${x - 1},${y},E`)) ctx.fillRect(px, py, wallThick, tile); }
        else if (!world.doorSet.has(`${x - 1},${y},E`)) ctx.fillRect(px, py, wallThin, tile);
      }
      if (nE !== id) {
        if (nE < 0) { if (!world.doorSet.has(`${x},${y},E`)) ctx.fillRect(px + tile - wallThick, py, wallThick, tile); }
        else if (!world.doorSet.has(`${x},${y},E`)) ctx.fillRect(px + tile - wallThin, py, wallThin, tile);
      }
    }
  }

  ctx.fillStyle = '#141414';
  for (const room of world.roomById) {
    if (!room || room.type === 'hall' || room.type === 'courtyard') continue;
    const px = ox + room.x * tile;
    const py = oy + room.y * tile;
    const markerW = Math.max(4, Math.round(tile * 0.5));
    const markerH = Math.max(1, Math.round(tile * 0.12));
    ctx.fillRect(
      px + Math.floor((room.w * tile - markerW) / 2),
      py + Math.floor((room.h * tile - markerH) / 2),
      markerW,
      markerH
    );
  }

  ctx.fillRect(ox, oy, GW * tile, wallThick);
  ctx.fillRect(ox, oy + GH * tile - wallThick, GW * tile, wallThick);
  ctx.fillRect(ox, oy, wallThick, GH * tile);
  ctx.fillRect(ox + GW * tile - wallThick, oy, wallThick, GH * tile);
}

export default function ElementarySchoolMap({ onBack, ...unusedProps }) {
  void unusedProps;
  const canvasRef = useRef(null);
  const blueprintRef = useRef(null);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  const world = useMemo(() => buildWorld(), []);

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

  const [pos, setPos] = useState({ x: 38, y: 31 });

  useEffect(() => {
    const onKey = event => {
      const key = event.key.toLowerCase();
      if (key === 'escape') {
        onBack?.();
        return;
      }
      if (!['w', 'a', 's', 'd'].includes(key)) return;
      event.preventDefault();
      setPos(current => {
        const nextX = current.x + (key === 'a' ? -1 : key === 'd' ? 1 : 0);
        const nextY = current.y + (key === 'w' ? -1 : key === 's' ? 1 : 0);
        return canMove(current.x, current.y, nextX, nextY) ? { x: nextX, y: nextY } : current;
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canMove, onBack]);

  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      blueprintRef.current = image;
      setVp(current => ({ ...current }));
    };
    image.src = BLUEPRINT_IMAGE_PATH;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(vp.w * dpr);
    canvas.height = Math.round(vp.h * dpr);
    canvas.style.width = `${vp.w}px`;
    canvas.style.height = `${vp.h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawMap(ctx, vp.w, vp.h, world, blueprintRef.current);
  }, [vp, world]);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: PAL.outdoor }}>
      <canvas ref={canvasRef} style={{ display: 'block', imageRendering: 'pixelated' }} />
    </div>
  );
}
