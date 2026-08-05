import React, { useState, useEffect, useRef } from 'react';
import { SCHOOL_ZONES } from './worldData';
import { assignRoomsToStaff } from './roomAssignment';

function buildPlayerPalette(playerAvatar) {
  return {
    skinTone: playerAvatar?.skinTone || '#D9AA8D',
    hairColor: playerAvatar?.hairColor || '#20140F',
    topColor: playerAvatar?.topColor || '#1F3A5F',
    bottomColor: playerAvatar?.bottomColor || '#3C3C3C',
    shoeColor: playerAvatar?.shoeColor || '#111111'
  };
}

function PlayerSprite({ palette }) {
  return (
    <div style={{ position: 'relative', width: '22px', height: '30px', imageRendering: 'pixelated' }}>
      <div style={{ position: 'absolute', left: '6px', top: '0px', width: '10px', height: '6px', backgroundColor: palette.hairColor, border: '1px solid #0a0a0a' }} />
      <div style={{ position: 'absolute', left: '7px', top: '5px', width: '8px', height: '8px', backgroundColor: palette.skinTone, border: '1px solid #0a0a0a' }} />
      <div style={{ position: 'absolute', left: '5px', top: '13px', width: '12px', height: '10px', backgroundColor: palette.topColor, border: '1px solid #0a0a0a' }} />
      <div style={{ position: 'absolute', left: '6px', top: '23px', width: '4px', height: '5px', backgroundColor: palette.bottomColor, border: '1px solid #0a0a0a' }} />
      <div style={{ position: 'absolute', left: '12px', top: '23px', width: '4px', height: '5px', backgroundColor: palette.bottomColor, border: '1px solid #0a0a0a' }} />
      <div style={{ position: 'absolute', left: '5px', top: '28px', width: '5px', height: '2px', backgroundColor: palette.shoeColor }} />
      <div style={{ position: 'absolute', left: '12px', top: '28px', width: '5px', height: '2px', backgroundColor: palette.shoeColor }} />
    </div>
  );
}

export default function ElementarySchoolMap({
  facultyRoster,
  playerGrade,
  playerDepartment,
  playerAvatar,
  onBack,
  onExit,
  onSaveGame,
  styles,
  activeSlotLabel,
  saveMessage
}) {
  const canvasRef = useRef(null);
  const [currentRoomInfo, setCurrentRoomInfo] = useState(null);
  
  // Player grid position
  const [playerPosition, setPlayerPosition] = useState({ x: 10, y: 10 });
  const assignmentsRef = useRef({});
  const playerPalette = buildPlayerPalette(playerAvatar);
  const rosterName = playerAvatar?.rosterName || playerAvatar?.name || 'Teacher';

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

      ctx.fillStyle = '#171f17';
      ctx.strokeStyle = '#39FF14';
      ctx.lineWidth = 2;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.strokeRect(rx, ry, rw, rh);

      ctx.fillStyle = '#f5f1dd';
      ctx.font = '10px monospace';
      ctx.fillText(zone.name.split(' ')[0], rx + 6, ry + 16);
    });

    const activeRoom = checkCurrentRoom(playerPosition.x, playerPosition.y);
    setCurrentRoomInfo(activeRoom);

  }, [playerPosition]);

  return (
    <div style={{ ...styles.setupBox, maxWidth: '980px', minHeight: '700px', justifyContent: 'flex-start', gap: '16px' }}>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <h2 style={{ ...styles.heading, marginBottom: 0 }}>RETRO ACADEMY - ELEMENTARY CAMPUS</h2>
        <p style={{ ...styles.subtitle, marginBottom: 0 }}>Use WASD to move your teacher avatar through campus rooms.</p>
      </div>

      <div style={{ width: '100%', maxWidth: '860px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', alignItems: 'stretch' }}>
        <div style={{ backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '10px 12px', color: '#ccc', fontSize: '0.78rem' }}>
          <strong style={{ color: '#39FF14' }}>ACTIVE TEACHER:</strong> {rosterName}
          {activeSlotLabel ? <span style={{ marginLeft: '10px', color: '#9acb92' }}>SAVE SLOT: {activeSlotLabel}</span> : null}
          {saveMessage ? <div style={{ marginTop: '6px', color: '#00FFFF' }}>{saveMessage}</div> : null}
        </div>
        <div style={{ backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '10px 12px', color: '#ccc', fontSize: '0.78rem' }}>
          <strong style={{ color: '#39FF14' }}>POSITION:</strong> X{playerPosition.x} / Y{playerPosition.y}
        </div>
      </div>

      <div style={{ border: '2px solid #39FF14', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 0 20px rgba(57,255,20,0.16)', backgroundColor: '#0b0b0b', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ display: 'block', width: '100%', maxWidth: '800px', height: 'auto' }}
        />

        <div
          style={{
            position: 'absolute',
            left: `${Math.max(0, Math.min(58, playerPosition.x)) * 12 - 5}px`,
            top: `${Math.max(0, Math.min(33, playerPosition.y)) * 15 - 18}px`,
            pointerEvents: 'none',
            zIndex: 4
          }}
        >
          <PlayerSprite palette={playerPalette} />
        </div>
        
        {currentRoomInfo && (
          <div style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#101010', border: '1px solid #ff9f43', padding: '10px 14px', borderRadius: '6px', textAlign: 'center', pointerEvents: 'none', minWidth: '320px', boxShadow: '0 0 12px rgba(255,159,67,0.25)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#ff9f43', fontFamily: 'monospace', fontWeight: 'bold' }}>
              {currentRoomInfo.roomNumber} : {currentRoomInfo.roomName}
            </div>
            <div style={{ fontSize: '0.74rem', fontFamily: 'monospace', color: '#d7d7d7', marginTop: '4px' }}>
              Teacher: <span style={{ color: '#39FF14' }}>{currentRoomInfo.occupant}</span>
            </div>
          </div>
        )}
      </div>

      <p style={{ marginTop: '4px', fontSize: '0.82rem', color: '#9acb92' }}>
        Use <strong style={{ color: '#39FF14' }}>W A S D</strong> keys to explore the campus rooms.
      </p>

      <div style={styles.footerActions}>
        <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}>BACK TO DIRECTORY</button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
        <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
      </div>
    </div>
  );
}