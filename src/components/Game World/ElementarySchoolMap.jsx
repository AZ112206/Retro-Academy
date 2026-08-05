import React, { useState, useEffect, useRef } from 'react';
import { SCHOOL_ZONES } from './worldData';
import { assignRoomsToStaff } from './roomAssignment';

export default function ElementarySchoolMap({ facultyRoster, playerGrade, playerDepartment }) {
  const canvasRef = useRef(null);
  const [currentRoomInfo, setCurrentRoomInfo] = useState(null);
  
  // Player grid position
  const [playerPosition, setPlayerPosition] = useState({ x: 10, y: 10 });
  const assignmentsRef = useRef({});

  useEffect(() => {
    if (facultyRoster) {
      const { assignments } = assignRoomsToStaff(facultyRoster, playerGrade, playerDepartment);
      assignmentsRef.current = assignments;
    }
  }, [facultyRoster, playerGrade, playerDepartment]);

  // Handle WASD Keyboard Movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPlayerPosition((prev) => {
        let { x, y } = prev;
        const speed = 1;

        switch (e.key.toLowerCase()) {
          case 'w': y = Math.max(0, y - speed); break;
          case 's': y = Math.min(33, y + speed); break;
          case 'a': x = Math.max(0, x - speed); break;
          case 'd': x = Math.min(58, x + speed); break;
          default: return prev;
        }
        return { x, y };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Room Perimeter & Coordinate Check
  const checkCurrentRoom = (x, y) => {
    const isHallway = (x >= 8 && x <= 38) && (y >= 9 && y <= 13);
    if (isHallway) return null; 

    if (x >= 0 && x <= 10 && y >= 0 && y <= 9) {
      const admin = assignmentsRef.current['principal_office'];
      return { roomNumber: 'OFFICE 101', roomName: "Principal's Office", occupant: admin?.teacher?.name || 'Principal' };
    }
    if (x >= 11 && x <= 20 && y >= 0 && y <= 9) {
      const nurse = assignmentsRef.current['nurse_station'];
      return { roomNumber: 'OFFICE 103', roomName: "Nurse's Station", occupant: nurse?.teacher?.name || 'School Nurse' };
    }
    if (x >= 21 && x <= 29 && y >= 0 && y <= 9) {
      const kRoomA = assignmentsRef.current['k_room_a'];
      return { roomNumber: 'ROOM K-1', roomName: 'Kindergarten Pod A', occupant: kRoomA?.teacher?.name || 'Kindergarten Teacher' };
    }
    if (x >= 30 && x <= 38 && y >= 0 && y <= 9) {
      const kRoomB = assignmentsRef.current['k_room_b'];
      return { roomNumber: 'ROOM K-2', roomName: 'Kindergarten Pod B', occupant: kRoomB?.teacher?.name || 'Kindergarten Teacher' };
    }
    if (x >= 0 && x <= 12 && y >= 14 && y <= 19) {
      const g1a = assignmentsRef.current['grade_1_a'];
      return { roomNumber: 'ROOM 105', roomName: 'Grade 1 Homeroom A', occupant: g1a?.teacher?.name || 'Grade 1 Teacher' };
    }
    if (x >= 25 && x <= 38 && y >= 14 && y <= 19) {
      const g2a = assignmentsRef.current['grade_2_a'];
      return { roomNumber: 'ROOM 109', roomName: 'Grade 2 Homeroom A', occupant: g2a?.teacher?.name || 'Grade 2 Teacher' };
    }
    if (x >= 0 && x <= 12 && y >= 20 && y <= 33) {
      const g3Sci = assignmentsRef.current['grade_3_sci'];
      return { roomNumber: 'LAB 301', roomName: 'Grade 3 Science Lab & Prep', occupant: g3Sci?.teacher?.name || 'Science Teacher' };
    }
    if (x >= 40 && x <= 59 && y >= 26 && y <= 33) {
      return { roomNumber: 'GYM / CAF', roomName: 'Multi-Purpose Hall (Cafetorium & Stage)', occupant: 'Cafeteria Staff & PE Coaches' };
    }

    return null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = '#1a202c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    ctx.fillStyle = '#f6e05e';
    ctx.fillRect(playerPosition.x * 12, playerPosition.y * 15, 10, 10);

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
        Use <span className="text-yellow-400 font-bold">W A S D</span> keys to explore the campus rooms.
      </p>
    </div>
  );
}