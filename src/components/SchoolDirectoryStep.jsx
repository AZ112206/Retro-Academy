import React, { useMemo, useRef, useState, useEffect } from 'react';
import RetroIcon, { RetroArrow } from './RetroIcon';
import { generateFacultyRoster } from '../../services/staffGenerator';
import { PixelAvatar } from './Teacher Set Up/TeacherAvatarCustomizer.jsx';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function StatBar({ label, value, color = '#39FF14' }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: '#1b1b1b', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${clamp(value, 0, 100)}%`, height: '100%', backgroundColor: color }} />
      </div>
    </div>
  );
}

// Miniature visual representation mirroring the avatar system layout grid arrays
function DirectoryAvatarMini({ appearance }) {
  return (
    <div style={{ transform: 'scale(0.78)', transformOrigin: 'center top', marginBottom: '-22px' }}>
      <PixelAvatar appearance={appearance} size="small" direction="Front" motion={{ blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 }} />
    </div>
  );
}

// Reusable Faculty Grid Card matching the customization options UI panels
function FacultyCard({ staff, onOpen }) {
  return (
    <div
      onClick={() => onOpen(staff)}
      style={{
        width: '150px',
        padding: '12px 8px',
        backgroundColor: staff.isPlayer ? '#222d15' : '#121212',
        color: '#fff',
        border: `1px solid ${staff.isPlayer ? '#00FFFF' : '#39FF14'}`,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        boxShadow: staff.isPlayer ? '0 0 8px rgba(0,255,255,0.2)' : 'none',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {staff.isPlayer && (
        <span style={{ position: 'absolute', top: '-8px', backgroundColor: '#00FFFF', color: '#000', fontSize: '0.55rem', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', letterSpacing: '0.5px' }}>
          YOU
        </span>
      )}
      
      <DirectoryAvatarMini appearance={staff} />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textAlign: 'center', width: '100%' }}>
        {/* Name displayed exactly under the frame */}
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: staff.isPlayer ? '#00FFFF' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
          {staff.name}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#39FF14', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          {staff.role}
        </span>
      </div>
    </div>
  );
}

export default function SchoolDirectoryStep({ schoolType, playerAvatar, playerDepartment, playerGrade, onProceed, onBack, styles }) {
  const [activeTab, setActiveTab] = useState('administration');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [liveProfile, setLiveProfile] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerActionEffects, setPlayerActionEffects] = useState({ health: 0, stress: 0, energy: 0, morale: 0, focus: 0, strictness: 0, kindness: 0, patience: 0, humor: 0, organization: 0 });
  const tabScrollRef = useRef(null);
  const dragStateRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
  const contentScrollRef = useRef(null);
  const contentDragRef = useRef({ dragging: false, startY: 0, startScrollTop: 0 });

  // Procedurally seed the entire school grid dataset
  const facultyRoster = useMemo(() => {
    return generateFacultyRoster(schoolType, playerAvatar, playerDepartment, playerGrade);
  }, [schoolType, playerAvatar, playerDepartment, playerGrade]);

  const tabKeys = useMemo(() => Object.keys(facultyRoster), [facultyRoster]);

  useEffect(() => {
    if (!tabKeys.includes(activeTab) && tabKeys.length > 0) {
      setActiveTab(tabKeys[0]);
    }
  }, [activeTab, tabKeys]);

  const currentTabStaff = facultyRoster[activeTab] || [];

  const toOrdinal = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    const mod100 = num % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
    const mod10 = num % 10;
    if (mod10 === 1) return `${num}st`;
    if (mod10 === 2) return `${num}nd`;
    if (mod10 === 3) return `${num}rd`;
    return `${num}th`;
  };

  const formatTabLabel = (tabKey) => {
    if (tabKey === 'administration') return 'Administration';
    if (tabKey === 'counselors') return 'Counselors';
    if (tabKey === 'nurses') return 'Nurses';
    if (tabKey === 'specialists') return 'Specialists';
    if (tabKey === 'electives') return 'Electives';
    if (tabKey === 'cafeteria_workers') return 'Cafeteria';
    if (tabKey === 'custodians') return 'Custodians';
    if (tabKey === 'kindergarten') return 'Kindergarten';
    if (tabKey.startsWith('grade_')) {
      const gradeRaw = tabKey.replace('grade_', '');
      if (gradeRaw === 'middle') return 'Middle Grade';
      return `${toOrdinal(gradeRaw)} Grade`;
    }
    if (tabKey.startsWith('department_')) {
      const department = tabKey.replace('department_', '').replace(/_/g, ' ');
      return `${department.replace(/\b\w/g, (ch) => ch.toUpperCase())} Dept`;
    }
    return tabKey.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
  };

  const beginTabDrag = (clientX) => {
    if (!tabScrollRef.current) return;
    dragStateRef.current = {
      dragging: true,
      startX: clientX,
      startScrollLeft: tabScrollRef.current.scrollLeft
    };
  };

  const moveTabDrag = (clientX) => {
    if (!dragStateRef.current.dragging || !tabScrollRef.current) return;
    const delta = clientX - dragStateRef.current.startX;
    tabScrollRef.current.scrollLeft = dragStateRef.current.startScrollLeft - delta;
  };

  const endTabDrag = () => {
    dragStateRef.current.dragging = false;
  };

  const beginContentDrag = (clientY) => {
    if (!contentScrollRef.current) return;
    contentDragRef.current = {
      dragging: true,
      startY: clientY,
      startScrollTop: contentScrollRef.current.scrollTop
    };
  };

  const moveContentDrag = (clientY) => {
    if (!contentDragRef.current.dragging || !contentScrollRef.current) return;
    const delta = clientY - contentDragRef.current.startY;
    contentScrollRef.current.scrollTop = contentDragRef.current.startScrollTop - delta;
  };

  const endContentDrag = () => {
    contentDragRef.current.dragging = false;
  };

  useEffect(() => {
    if (selectedStaff) {
      setLiveProfile(selectedStaff.profile || null);
    }
  }, [selectedStaff]);

  useEffect(() => {
    // Placeholder hook for future gameplay actions: call window.retroApplyPlayerAction({ stress: 10, morale: -5, ... })
    // to affect player vitals after game start.
    window.retroApplyPlayerAction = (effects = {}) => {
      setPlayerActionEffects((current) => {
        const next = { ...current };
        Object.keys(next).forEach((key) => {
          const delta = Number(effects[key] || 0);
          next[key] = clamp(current[key] + delta, -35, 35);
        });
        return next;
      });
    };

    return () => {
      delete window.retroApplyPlayerAction;
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || !liveProfile) return undefined;

    const interval = setInterval(() => {
      setLiveProfile((current) => {
        if (!current) return current;

        const mutate = (value, swing = 6) => clamp(value + (Math.random() * swing * 2 - swing), 0, 100);

        if (selectedStaff?.isPlayer) {
          const drift = (value, effect, randomSwing = 1.8) => {
            const randomDelta = (Math.random() * randomSwing * 2 - randomSwing);
            const effectDelta = effect * 0.22;
            return clamp(value + randomDelta + effectDelta, 0, 100);
          };

          return {
            ...current,
            vitals: {
              ...current.vitals,
              health: drift(current.vitals.health, playerActionEffects.health, 1.1),
              stress: drift(current.vitals.stress, playerActionEffects.stress, 1.4),
              energy: drift(current.vitals.energy, playerActionEffects.energy, 1.5),
              morale: drift(current.vitals.morale, playerActionEffects.morale, 1.3),
              focus: drift(current.vitals.focus, playerActionEffects.focus, 1.2)
            },
            personality: {
              ...current.personality,
              strictness: drift(current.personality.strictness, playerActionEffects.strictness, 0.7),
              kindness: drift(current.personality.kindness, playerActionEffects.kindness, 0.7),
              patience: drift(current.personality.patience, playerActionEffects.patience, 0.9),
              humor: drift(current.personality.humor, playerActionEffects.humor, 0.9),
              organization: drift(current.personality.organization, playerActionEffects.organization, 0.6)
            }
          };
        }

        return {
          ...current,
          vitals: {
            ...current.vitals,
            health: mutate(current.vitals.health, 4),
            stress: mutate(current.vitals.stress, 7),
            energy: mutate(current.vitals.energy, 8),
            morale: mutate(current.vitals.morale, 6),
            focus: mutate(current.vitals.focus, 6)
          },
          personality: {
            ...current.personality,
            strictness: mutate(current.personality.strictness, 3),
            kindness: mutate(current.personality.kindness, 3),
            patience: mutate(current.personality.patience, 4),
            humor: mutate(current.personality.humor, 4),
            organization: mutate(current.personality.organization, 3)
          }
        };
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [gameStarted, liveProfile, playerActionEffects, selectedStaff]);

  const handleOpenStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const handleProceed = () => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    onProceed({ roster: facultyRoster, gameStarted: true });
  };

  return (
    <div style={{ ...styles.setupBox, maxWidth: '1000px' }}>
      <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <RetroIcon kind="contract" /> {schoolType.toUpperCase()} STAFF DIRECTORY
      </h2>
      <p style={styles.subtitle}>
        Review your processed employment authorization roster. All faculty assignments have been verified by the district board.
      </p>

      {/* Directory Tab Selection Bar */}
      <div
        className="no-scrollbar"
        ref={tabScrollRef}
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-start',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '6px',
          cursor: dragStateRef.current.dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={(e) => beginTabDrag(e.clientX)}
        onMouseMove={(e) => moveTabDrag(e.clientX)}
        onMouseUp={endTabDrag}
        onMouseLeave={endTabDrag}
        onTouchStart={(e) => beginTabDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveTabDrag(e.touches[0].clientX)}
        onTouchEnd={endTabDrag}
      >
        {tabKeys.map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            style={{
              padding: '8px 16px',
              fontSize: '0.75rem',
              backgroundColor: activeTab === tabKey ? '#f5f1dd' : '#121212',
              color: activeTab === tabKey ? '#111' : '#fff',
              border: `1px solid ${activeTab === tabKey ? '#f5f1dd' : '#39FF14'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {formatTabLabel(tabKey).toUpperCase()} ({facultyRoster[tabKey]?.length || 0})
          </button>
        ))}
      </div>

      {/* Main Grid View Area */}
      <div
        className="no-scrollbar"
        ref={contentScrollRef}
        style={{ 
          backgroundColor: '#111', 
          border: '1px solid #39FF14', 
          borderRadius: '6px', 
          padding: '24px', 
          minHeight: '280px',
          maxHeight: '440px', 
          overflowY: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          alignContent: 'flex-start',
          cursor: contentDragRef.current.dragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        onMouseDown={(e) => beginContentDrag(e.clientY)}
        onMouseMove={(e) => moveContentDrag(e.clientY)}
        onMouseUp={endContentDrag}
        onMouseLeave={endContentDrag}
        onTouchStart={(e) => beginContentDrag(e.touches[0].clientY)}
        onTouchMove={(e) => moveContentDrag(e.touches[0].clientY)}
        onTouchEnd={endContentDrag}
      >
        {currentTabStaff.length > 0 ? (
          currentTabStaff.map((staffMember, index) => (
            <FacultyCard key={staffMember.id || `${staffMember.name}-${index}`} staff={staffMember} onOpen={handleOpenStaff} />
          ))
        ) : (
          <div style={{ color: '#555', fontStyle: 'italic', fontSize: '0.9rem', marginTop: '100px' }}>
            No authorized records discovered in this department segment.
          </div>
        )}
      </div>

      <div style={styles.footerActions}>
        <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <RetroArrow direction="left" /> BACK
          </span>
        </button>
        <button 
          style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} 
          onClick={handleProceed}
        >
          {gameStarted ? 'ENTER WORLD MAP' : 'START GAME'} <RetroArrow color="#0a0a0a" />
        </button>
      </div>

      {selectedStaff && liveProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 60, padding: '20px' }}>
          <div className="no-scrollbar" style={{ width: '100%', maxWidth: '760px', maxHeight: '86vh', overflowY: 'auto', backgroundColor: '#111', border: '2px solid #39FF14', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: '#39FF14', letterSpacing: '1px' }}>{selectedStaff.name.toUpperCase()} PROFILE</h3>
              <button style={styles.backButton} onClick={() => setSelectedStaff(null)}>CLOSE</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PixelAvatar appearance={selectedStaff} size="small" direction="Front" motion={{ blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 }} />
              </div>

              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px' }}>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Occupation:</strong> {liveProfile.occupation}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Age:</strong> {liveProfile.age}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Birthday:</strong> {liveProfile.birthday}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Years Teaching:</strong> {liveProfile.yearsTeaching}</p>
                <p style={{ margin: 0, color: '#fff' }}><strong>Gender:</strong> {selectedStaff.gender || 'N/A'}</p>
              </div>

              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <StatBar label="Health" value={liveProfile.vitals.health} color="#39FF14" />
                <StatBar label="Stress" value={liveProfile.vitals.stress} color="#FF3333" />
                <StatBar label="Energy" value={liveProfile.vitals.energy} color="#00FFFF" />
                <StatBar label="Morale" value={liveProfile.vitals.morale} color="#F7F7F7" />
                <StatBar label="Focus" value={liveProfile.vitals.focus} color="#FFA500" />
              </div>

              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px' }}>
                <p style={{ margin: '0 0 10px', color: '#39FF14', fontWeight: 'bold' }}>WORK EXPERIENCE</p>
                {Array.isArray(liveProfile.previousPositions) && liveProfile.previousPositions.length > 0 ? (
                  liveProfile.previousPositions.map((entry, idx) => (
                    <p key={`${entry.position}-${idx}`} style={{ margin: '0 0 6px', color: '#fff', fontSize: '0.86rem' }}>
                      <strong>{entry.position}</strong> - {entry.years} yr{entry.years === 1 ? '' : 's'}
                    </p>
                  ))
                ) : (
                  <p style={{ margin: 0, color: '#888', fontSize: '0.82rem' }}>No prior records available.</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '16px', backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <StatBar label="Strictness" value={liveProfile.personality.strictness} color="#ff6b6b" />
              <StatBar label="Kindness" value={liveProfile.personality.kindness} color="#4ecdc4" />
              <StatBar label="Patience" value={liveProfile.personality.patience} color="#ffe66d" />
              <StatBar label="Humor" value={liveProfile.personality.humor} color="#c7f464" />
              <StatBar label="Organization" value={liveProfile.personality.organization} color="#7b9acc" />
            </div>

            <p style={{ margin: '14px 0 0', color: gameStarted ? '#39FF14' : '#888', fontSize: '0.82rem' }}>
              {gameStarted
                ? (selectedStaff?.isPlayer
                  ? 'Game mode is active: your vitals/personality now react to action effects (action system integration is TBD).'
                  : 'Game mode is active: this NPC profile is fluctuating in real time.')
                : 'Game mode is inactive: stats stay fixed until you press START GAME.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}