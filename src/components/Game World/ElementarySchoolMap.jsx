import React, { useState, useEffect, useRef } from 'react';
import { SCHOOL_ZONES } from './worldData';
import { assignRoomsToStaff } from './roomAssignment';

export default function ElementarySchoolMap({ facultyRoster, playerAvatar, playerGrade, playerDepartment }) {
  const canvasRef = useRef(null);
  const [currentRoomInfo, setCurrentRoomInfo] = useState(null);
  
  // Simulated player position on the grid
  const [playerPosition, setPlayerPosition] = useState({ x: 5, y: 5 });
  const assignmentsRef = useRef({});

  // Generate staff room assignments on mount
  useEffect(() => {
    if (facultyRoster) {
      const { assignments } = assignRoomsToStaff(facultyRoster, playerGrade, playerDepartment);
      assignmentsRef.current = assignments;
    }
  }, [facultyRoster, playerGrade, playerDepartment]);

  // Check current room: hidden in hallways, shows banner when touching room perimeters
  const checkCurrentRoom = (x, y) => {
    const isHallway = (x >= 8 && x <= 32) && (y >= 8 && y <= 12);
    if (isHallway) {
      return null; // Hidden in the hallway
    }

    // Room perimeter checks
    if (x <= 10 && y <= 10) {
      const admin = assignmentsRef.current['principal_office'];
      return { roomNumber: 'ROOM 101', roomName: "Principal's Office", occupant: admin?.teacher?.name || 'Principal' };
    } else if (x > 20 && x <= 38 && y <= 10) {
      const kRoom = assignmentsRef.current['k_room_a'];
      return { roomNumber: 'ROOM K-1', roomName: 'Kindergarten Pod A', occupant: kRoom?.teacher?.name || 'Kindergarten Teacher' };
    }
    
    return null; // Default to hidden if not touching a room perimeter
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Clear background
    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Zones
    Object.entries(SCHOOL_ZONES).forEach(([key, zone]) => {
      const rx = zone.bounds.x * 12;
      const ry = zone.bounds.y * 15;
      const rw = zone.bounds.width * 12;
      const rh = zone.bounds.height * 15;

      ctx.fillStyle = '#2d3748';
      ctx.strokeStyle = '#4a5568';
      ctx.lineWidth = 2;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.fillStyle = '#cbd5e0';
      ctx.font = '10px monospace';
      ctx.fillText(zone.name.split(' ')[0], rx + 6, ry + 16);
    });

    // Draw Player marker
    ctx.fillStyle = '#f6e05e';
    ctx.fillRect(playerPosition.x * 12, playerPosition.y * 15, 10, 10);

    // Update current room info state based on perimeter check
    const activeRoom = checkCurrentRoom(playerPosition.x, playerPosition.y);
    setCurrentRoomInfo(activeRoom);

  }, [playerPosition]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-900 min-h-screen text-white relative">
      <div className="mb-2 text-xl font-bold tracking-wider text-yellow-400">
        RETRO ACADEMY - ELEMENTARY CAMPUS
      </div>
      
      <div className="border-4 border-gray-700 rounded-lg overflow-hidden shadow-2xl bg-black relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="block w-full max-w-[800px] h-auto"
        />
        
        {/* Room Indicator HUD Banner (Only shows when touching room perimeters) */}
        {currentRoomInfo && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 border-2 border-yellow-500/80 px-6 py-2.5 rounded shadow-lg text-center pointer-events-none min-w-[300px]">
            <div className="text-xs uppercase tracking-widest text-yellow-400 font-mono font-bold">
              {currentRoomInfo.roomNumber} : {currentRoomInfo.roomName}
            </div>
            <div className="text-xs font-mono text-gray-200 mt-1">
              Teacher: <span className="text-green-400">{currentRoomInfo.occupant}</span>
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-sm text-gray-400">
        Explore the school floor plan. Room IDs and assigned staff appear when entering room perimeters.
      </p>
    </div>
  );
}