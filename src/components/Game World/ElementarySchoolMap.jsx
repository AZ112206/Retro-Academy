import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SCHOOL_ZONES } from './worldData';
import { assignRoomsToStaff } from './roomAssignment';

const GRID_WIDTH = 60;
const GRID_HEIGHT = 36;

function buildPlayerPalette(playerAvatar) {
  return {
    skinTone: playerAvatar?.skinTone || '#D8AE8B',
    hairColor: playerAvatar?.hairColor || '#20140F',
    topColor: playerAvatar?.topColor || '#1F3A5F',
    bottomColor: playerAvatar?.bottomColor || '#3C3C3C',
    shoeColor: playerAvatar?.shoeColor || '#111111'
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export default function ElementarySchoolMap({ facultyRoster, playerGrade, playerDepartment, playerAvatar }) {
  const canvasRef = useRef(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 30, y: 31 });
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const assignmentsRef = useRef({});
  const playerPalette = useMemo(() => buildPlayerPalette(playerAvatar), [playerAvatar]);

  useEffect(() => {
    if (facultyRoster) {
      const { assignments } = assignRoomsToStaff(facultyRoster, playerGrade, playerDepartment);
      assignmentsRef.current = assignments;
    }
  }, [facultyRoster, playerGrade, playerDepartment]);

  // WASD controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPosition((prev) => {
        let { x, y } = prev;
        const speed = 1;
        switch (e.key.toLowerCase()) {
          case 'w': y = clamp(y - speed, 0, GRID_HEIGHT - 1); break;
          case 's': y = clamp(y + speed, 0, GRID_HEIGHT - 1); break;
          case 'a': x = clamp(x - speed, 0, GRID_WIDTH - 1); break;
          case 'd': x = clamp(x + speed, 0, GRID_WIDTH - 1); break;
          default: return prev;
        }
        return { x, y };
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const drawRetroWorld = (ctx, width, height) => {
    const tile = Math.max(10, Math.floor(Math.min(width / GRID_WIDTH, height / GRID_HEIGHT)));
    const worldW = tile * GRID_WIDTH;
    const worldH = tile * GRID_HEIGHT;
    const offsetX = Math.floor((width - worldW) / 2);
    const offsetY = Math.floor((height - worldH) / 2);

    // Night asphalt base
    ctx.fillStyle = '#070a07';
    ctx.fillRect(0, 0, width, height);

    // Vignette-like border
    ctx.strokeStyle = '#1a241a';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    // World backdrop
    ctx.fillStyle = '#0f1710';
    ctx.fillRect(offsetX, offsetY, worldW, worldH);

    // Checker grass texture
    for (let y = 0; y < GRID_HEIGHT; y += 1) {
      for (let x = 0; x < GRID_WIDTH; x += 1) {
        const px = offsetX + x * tile;
        const py = offsetY + y * tile;
        ctx.fillStyle = (x + y) % 2 === 0 ? '#122114' : '#102013';
        ctx.fillRect(px, py, tile, tile);
      }
    }

    // Buildings from zone data
    Object.values(SCHOOL_ZONES).forEach((zone) => {
      const { x, y, width: zw, height: zh } = zone.bounds;
      const rx = offsetX + x * tile;
      const ry = offsetY + y * tile;
      const rw = zw * tile;
      const rh = zh * tile;

      ctx.fillStyle = '#1b2620';
      ctx.fillRect(rx, ry, rw, rh);

      // Roof edge
      ctx.fillStyle = '#253528';
      ctx.fillRect(rx, ry, rw, Math.max(2, Math.floor(tile * 0.45)));

      // Wall outline
      ctx.strokeStyle = '#39FF14';
      ctx.lineWidth = 1;
      ctx.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);

      // Window strips
      const winW = Math.max(3, Math.floor(tile * 0.5));
      const winH = Math.max(2, Math.floor(tile * 0.35));
      for (let wx = rx + tile; wx < rx + rw - tile; wx += tile * 2) {
        const topY = ry + Math.max(2, Math.floor(tile * 0.8));
        const botY = ry + rh - Math.max(3, Math.floor(tile * 1.1));
        ctx.fillStyle = '#1f4550';
        ctx.fillRect(wx, topY, winW, winH);
        ctx.fillRect(wx, botY, winW, winH);
      }
    });

    // Main corridors
    const hallX = offsetX + 20 * tile;
    const hallY = offsetY + 16 * tile;
    const hallW = 20 * tile;
    const hallH = 11 * tile;
    ctx.fillStyle = '#202a22';
    ctx.fillRect(hallX, hallY, hallW, hallH);
    ctx.strokeStyle = '#3f5a45';
    ctx.strokeRect(hallX + 0.5, hallY + 0.5, hallW - 1, hallH - 1);

    // Safety vestibule and entrance walkway
    const entX = offsetX + 22 * tile;
    const entY = offsetY + 28 * tile;
    const entW = 16 * tile;
    const entH = 6 * tile;
    ctx.fillStyle = '#1f2c21';
    ctx.fillRect(entX, entY, entW, entH);
    for (let i = 0; i < 12; i += 1) {
      ctx.fillStyle = i % 2 === 0 ? '#2d3f31' : '#213226';
      ctx.fillRect(entX + i * Math.floor(entW / 12), entY + entH, Math.floor(entW / 12), Math.max(2, Math.floor(tile * 0.35)));
    }

    // Parking strip on far south
    const lotY = offsetY + worldH - Math.max(3, Math.floor(tile * 2.8));
    ctx.fillStyle = '#0c100d';
    ctx.fillRect(offsetX, lotY, worldW, Math.max(3, Math.floor(tile * 2.8)));
    for (let lx = offsetX + tile; lx < offsetX + worldW - tile; lx += tile * 2) {
      ctx.fillStyle = '#8b985f';
      ctx.fillRect(lx, lotY + 2, Math.max(2, Math.floor(tile * 0.5)), 1);
    }

    // Trees and detail props
    const treeSpots = [
      [3, 30], [8, 31], [14, 30], [46, 31], [52, 30], [57, 31], [6, 6], [53, 6]
    ];
    treeSpots.forEach(([gx, gy]) => {
      const tx = offsetX + gx * tile;
      const ty = offsetY + gy * tile;
      ctx.fillStyle = '#3f2a1c';
      ctx.fillRect(tx + Math.floor(tile * 0.42), ty + Math.floor(tile * 0.55), Math.max(1, Math.floor(tile * 0.18)), Math.max(2, Math.floor(tile * 0.35)));
      ctx.fillStyle = '#2f8f3d';
      ctx.fillRect(tx + Math.floor(tile * 0.2), ty + Math.floor(tile * 0.15), Math.max(4, Math.floor(tile * 0.6)), Math.max(4, Math.floor(tile * 0.45)));
    });

    // Player sprite from avatar palette
    const px = offsetX + playerPosition.x * tile;
    const py = offsetY + playerPosition.y * tile;
    const headW = Math.max(3, Math.floor(tile * 0.42));
    const headH = Math.max(3, Math.floor(tile * 0.34));
    const bodyW = Math.max(4, Math.floor(tile * 0.56));
    const bodyH = Math.max(4, Math.floor(tile * 0.44));

    ctx.fillStyle = playerPalette.hairColor;
    ctx.fillRect(px + Math.floor(tile * 0.28), py + Math.floor(tile * 0.06), headW, Math.max(2, Math.floor(headH * 0.6)));
    ctx.fillStyle = playerPalette.skinTone;
    ctx.fillRect(px + Math.floor(tile * 0.28), py + Math.floor(tile * 0.22), headW, headH);
    ctx.fillStyle = playerPalette.topColor;
    ctx.fillRect(px + Math.floor(tile * 0.2), py + Math.floor(tile * 0.52), bodyW, bodyH);
    ctx.fillStyle = playerPalette.bottomColor;
    ctx.fillRect(px + Math.floor(tile * 0.24), py + Math.floor(tile * 0.78), Math.max(2, Math.floor(bodyW * 0.36)), Math.max(2, Math.floor(tile * 0.18)));
    ctx.fillRect(px + Math.floor(tile * 0.52), py + Math.floor(tile * 0.78), Math.max(2, Math.floor(bodyW * 0.36)), Math.max(2, Math.floor(tile * 0.18)));
    ctx.fillStyle = playerPalette.shoeColor;
    ctx.fillRect(px + Math.floor(tile * 0.2), py + Math.floor(tile * 0.92), Math.max(2, Math.floor(tile * 0.25)), Math.max(1, Math.floor(tile * 0.06)));
    ctx.fillRect(px + Math.floor(tile * 0.54), py + Math.floor(tile * 0.92), Math.max(2, Math.floor(tile * 0.25)), Math.max(1, Math.floor(tile * 0.06)));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawRetroWorld(ctx, viewport.width, viewport.height);
  }, [playerPosition, playerPalette, viewport]);

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#050705', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100vw', height: '100vh', imageRendering: 'pixelated' }} />
    </div>
  );
}