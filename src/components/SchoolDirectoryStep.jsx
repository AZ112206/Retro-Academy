import React, { useMemo, useState } from 'react';
import RetroIcon, { RetroArrow } from './RetroIcon';
import { generateFacultyRoster } from '../../services/staffGenerator';

// Miniature visual representation mirroring the avatar system layout grid arrays
function DirectoryAvatarMini({ appearance }) {
  const borderColor = '#0A0A0A';
  const canvas = 84;
  const centerX = canvas / 2;
  const faceTop = 13;

  const faceGeometry = {
    Round: { width: 28, height: 28, borderRadius: '8px' },
    Square: { width: 29, height: 27, borderRadius: '4px' },
    Heart: { width: 28, height: 29, borderRadius: '8px 8px 10px 10px' },
    Oval: { width: 28, height: 29, borderRadius: '7px' }
  };

  const hairGeometry = {
    Crop: { width: 27, height: 7, top: -3, radius: '3px' },
    Waves: { width: 30, height: 9, top: -4, radius: '6px 6px 2px 2px' },
    Slick: { width: 28, height: 8, top: -3, radius: '4px 4px 1px 1px' },
    Ponytail: { width: 30, height: 10, top: -4, radius: '6px 6px 2px 2px', tail: true },
    Bun: { width: 29, height: 9, top: -3, radius: '6px 6px 2px 2px', bun: true },
    Braids: { width: 30, height: 10, top: -4, radius: '6px 6px 2px 2px', braids: true },
    Default: { width: 28, height: 8, top: -3, radius: '4px 4px 2px 2px' }
  };

  const face = faceGeometry[appearance.faceShape] || faceGeometry.Oval;
  const hairKey = appearance.hairStyle === 'Slick Back' ? 'Slick' : appearance.hairStyle;
  const hair = hairGeometry[hairKey] || hairGeometry.Default;
  const faceLeft = centerX - Math.floor(face.width / 2);

  // Use the customizer neck style with small retro spacing between head, neck, and torso.
  const neckWidth = 10;
  const neckHeight = 8;
  const neckLeft = centerX - Math.floor(neckWidth / 2);
  const neckTop = faceTop + face.height + 1;
  const torsoTop = neckTop + neckHeight + 1;

  return (
    <div
      style={{
        position: 'relative',
        width: `${canvas}px`,
        height: `${canvas}px`,
        backgroundColor: '#111',
        border: '2px solid #39FF14',
        borderRadius: '4px',
        overflow: 'hidden',
        backgroundImage: 'repeating-linear-gradient(180deg, rgba(57,255,20,0.05) 0, rgba(57,255,20,0.05) 2px, transparent 2px, transparent 4px)'
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        {(hair.tail || hair.braids) && (
          <div
            style={{
              position: 'absolute',
              left: `${faceLeft - 1}px`,
              top: `${faceTop + 12}px`,
              width: `${face.width + 2}px`,
              height: '18px',
              backgroundColor: appearance.hairColor,
              borderRadius: '0 0 8px 8px',
              zIndex: 1
            }}
          />
        )}

        <div
          style={{
            position: 'absolute',
            left: `${faceLeft}px`,
            top: `${faceTop}px`,
            width: `${face.width}px`,
            height: `${face.height}px`,
            backgroundColor: appearance.skinTone,
            border: `1px solid ${borderColor}`,
            borderRadius: face.borderRadius,
            zIndex: 3
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: `${Math.floor((face.width - hair.width) / 2)}px`,
              top: `${hair.top}px`,
              width: `${hair.width}px`,
              height: `${hair.height}px`,
              backgroundColor: appearance.hairColor,
              borderRadius: hair.radius
            }}
          />

          <div style={{ position: 'absolute', top: '9px', left: '5px', width: '5px', height: '4px', backgroundColor: '#F7F7F7', border: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
            <div style={{ width: '2px', height: '2px', margin: '0 auto', backgroundColor: appearance.eyeColor || '#201A17' }} />
          </div>
          <div style={{ position: 'absolute', top: '9px', right: '5px', width: '5px', height: '4px', backgroundColor: '#F7F7F7', border: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
            <div style={{ width: '2px', height: '2px', margin: '0 auto', backgroundColor: appearance.eyeColor || '#201A17' }} />
          </div>

          <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '6px', backgroundColor: 'rgba(124,84,55,0.35)' }} />
          <div style={{ position: 'absolute', top: '22px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '2px', backgroundColor: appearance.lipColor || '#542423', borderRadius: '1px' }} />
        </div>

        {hair.bun && (
          <div style={{ position: 'absolute', left: `${centerX - 6}px`, top: `${faceTop - 8}px`, width: '12px', height: '8px', backgroundColor: appearance.hairColor, borderRadius: '50% 50% 2px 2px', zIndex: 2 }} />
        )}

        {hair.braids && (
          <>
            <div style={{ position: 'absolute', left: `${faceLeft - 2}px`, top: `${faceTop + 18}px`, width: '4px', height: '15px', backgroundColor: appearance.hairColor, zIndex: 2 }} />
            <div style={{ position: 'absolute', left: `${faceLeft + face.width - 2}px`, top: `${faceTop + 18}px`, width: '4px', height: '15px', backgroundColor: appearance.hairColor, zIndex: 2 }} />
          </>
        )}

        <div
          style={{
            position: 'absolute',
            left: `${neckLeft}px`,
            top: `${neckTop}px`,
            width: `${neckWidth}px`,
            height: `${neckHeight}px`,
            backgroundColor: appearance.skinTone,
            borderLeft: `1px solid ${borderColor}`,
            borderRight: `1px solid ${borderColor}`,
            zIndex: 3
          }}
        />

        <div style={{ position: 'absolute', left: `${centerX - 20}px`, top: `${torsoTop - 4}px`, width: '40px', height: '7px', backgroundColor: appearance.topColor, border: `1px solid ${borderColor}`, borderBottom: 'none', boxSizing: 'border-box', zIndex: 2 }} />
        <div style={{ position: 'absolute', left: `${centerX - 18}px`, top: `${torsoTop}px`, width: '36px', height: '18px', backgroundColor: appearance.topColor, border: `1px solid ${borderColor}`, borderRadius: '2px', boxSizing: 'border-box', zIndex: 2 }} />
      </div>
    </div>
  );
}

// Reusable Faculty Grid Card matching the customization options UI panels
function FacultyCard({ staff }) {
  return (
    <div
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
        position: 'relative'
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

  // Procedurally seed the entire school grid dataset
  const facultyRoster = useMemo(() => {
    return generateFacultyRoster(schoolType, playerAvatar, playerDepartment, playerGrade);
  }, [schoolType, playerAvatar, playerDepartment, playerGrade]);

  const currentTabStaff = facultyRoster[activeTab] || [];

  const tabLabels = {
    administration: 'Administration',
    supportStaff: 'Support Staff',
    teachers: 'Faculty & Instructors'
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
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        {Object.keys(tabLabels).map((tabKey) => (
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
              letterSpacing: '0.5px'
            }}
          >
            {tabLabels[tabKey].toUpperCase()} ({facultyRoster[tabKey]?.length || 0})
          </button>
        ))}
      </div>

      {/* Main Grid View Area */}
      <div 
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
          alignContent: 'flex-start'
        }}
      >
        {currentTabStaff.length > 0 ? (
          currentTabStaff.map((staffMember, index) => (
            <FacultyCard key={`${staffMember.name}-${index}`} staff={staffMember} />
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
          onClick={() => onProceed({ roster: facultyRoster })}
        >
          OPEN SEMESTER ROSTER <RetroArrow color="#0a0a0a" />
        </button>
      </div>
    </div>
  );
}