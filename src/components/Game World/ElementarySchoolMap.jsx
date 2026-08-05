import React, { useEffect, useRef } from 'react';
import { SCHOOL_ZONES } from './worldData';

export default function ElementarySchoolMap({ facultyRoster, playerAvatar }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Retro crisp pixel rendering settings
    ctx.imageSmoothingEnabled = false;

    // Clear canvas background (School Grounds / Floor Base)
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw campus layout zones
    ctx.fillStyle = '#2d3748';
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 2;

    // Rendering a visual representation of our zones on canvas
    Object.entries(SCHOOL_ZONES).forEach(([key, zone]) => {
      // Scale coordinates for canvas display
      const rx = zone.bounds.x * 12;
      const ry = zone.bounds.y * 15;
      const rw = zone.bounds.width * 12;
      const rh = zone.bounds.height * 15;

      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);

      // Zone Labels
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px monospace';
      ctx.fillText(zone.name.split(' ')[0], rx + 6, ry + 16);
    });

    // Render Status text overlay
    ctx.fillStyle = '#f6e05e';
    ctx.font = '14px monospace';
    ctx.fillText('Elementary Floor Plan Loaded Successfully', 20, canvas.height - 20);

  }, [facultyRoster, playerAvatar]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-white">
      <div className="mb-2 text-xl font-bold tracking-wider text-yellow-400">
        RETRO ACADEMY - ELEMENTARY CAMPUS
      </div>
      <div className="border-4 border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block w-full max-w-[800px] h-auto"
        />
      </div>
      <p className="mt-3 text-sm text-gray-400">
        Single-floor layout initialized with Kindergarten pods, science labs, and multi-purpose hall.
      </p>
    </div>
  );
}