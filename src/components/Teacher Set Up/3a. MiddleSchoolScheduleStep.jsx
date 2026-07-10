import React, { useMemo, useState } from 'react';

const SUBJECTS = [
  { id: 'math', name: '📐 Mathematics', course: 'Math Foundations' },
  { id: 'science', name: '🧪 General Science', course: 'Earth & Life Science' },
  { id: 'history', name: '📜 Social Studies', course: 'Early Civilizations' },
  { id: 'english', name: '📝 Language Arts', course: 'Grammar & Composition' },
  { id: 'reading', name: '📚 Reading', course: 'Literature Circles' },
  { id: 'spanish', name: '🗣️ Spanish', course: 'Introductory Spanish' }
];

const BLOCK_TIMES = [
  { id: 'block1', label: 'Block 1', time: '8:00 AM - 9:00 AM', type: 'class' },
  { id: 'block2', label: 'Block 2', time: '9:00 AM - 10:00 AM', type: 'class' },
  { id: 'block3', label: 'Block 3', time: '10:00 AM - 11:00 AM', type: 'class' },
  { id: 'block4', label: 'Block 4', time: '11:00 AM - 12:00 PM', type: 'prep' },
  { id: 'block5', label: 'Block 5', time: '12:00 PM - 1:00 PM', type: 'class' },
  { id: 'block6', label: 'Block 6', time: '1:00 PM - 2:00 PM', type: 'class' }
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function MiddleSchoolScheduleStep({ middleGrade, middleLunchWave, onLaunchGame, onBack, styles }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const resolvedGrade = middleGrade || 6;
  const effectiveSubjects = useMemo(() => {
    return resolvedGrade === 8 ? SUBJECTS.filter(s => s.id !== 'reading') : SUBJECTS.filter(s => s.id !== 'spanish');
  }, [resolvedGrade]);

  const selectedSubject = effectiveSubjects.find(s => s.id === selectedSubjectId) || null;

  const autoScheduleRows = useMemo(() => {
    if (!selectedSubject) return [];
    let sectionCounter = 601;
    return BLOCK_TIMES.map(block => {
      if (block.type === 'prep') {
        return { block, entry: { name: '☕ Teacher Prep Block', sec: null, isPrep: true } };
      }
      const entry = { name: selectedSubject.course, sec: `#${sectionCounter}`, isPrep: false };
      sectionCounter += 1;
      return { block, entry };
    });
  }, [selectedSubject]);

  if (!selectedSubject) {
    return (
      <div style={{ ...styles.setupBox, maxWidth: '850px' }}>
        <h2 style={styles.heading}>🏫 MIDDLE SCHOOL SUBJECTS</h2>
        <p style={styles.subtitle}>Select your primary block teaching core:</p>
        
        <div style={{ ...styles.menuColumn, maxWidth: '550px', margin: '0 auto' }}>
          {effectiveSubjects.map(subject => (
            <button key={subject.id} style={{ ...styles.menuButton, textAlign: 'center' }} onClick={() => setSelectedSubjectId(subject.id)}>
              {subject.name}
            </button>
          ))}
          <button style={{ ...styles.exitButton, marginTop: '20px' }} onClick={onBack}>← BACK</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.setupBox, maxWidth: '900px' }}>
      <h2 style={styles.heading}>🏫 MASTER WEEKLY SCHEDULE</h2>
      <p style={styles.subtitle}>Review your unchangeable annual block timeline registration:</p>

      <div style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '8px', color: '#888' }}>BLOCK / TIME</th>
              {WEEK_DAYS.map(day => <th key={day} style={{ padding: '8px', color: '#39FF14' }}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {autoScheduleRows.map(({ block, entry }) => (
              <tr key={block.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '10px 8px', borderRight: '1px solid #222' }}>
                  <div style={{ fontWeight: 'bold' }}>{block.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{block.time}</div>
                </td>
                {WEEK_DAYS.map(day => (
                  <td key={`${block.id}-${day}`} style={{ padding: '10px 8px', borderRight: '1px solid #222', color: entry.isPrep ? '#ff9f43' : '#fff' }}>
                    <div>{entry.name}</div>
                    {entry.sec && <div style={{ fontSize: '0.7rem', color: '#39FF14' }}>Sec {entry.sec}</div>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '15px', maxWidth: '550px', margin: '0 auto' }}>
        <button style={{ ...styles.exitButton, flex: 1 }} onClick={() => setSelectedSubjectId(null)}>← BACK</button>
        <button style={{ ...styles.actionButton, flex: 2 }} onClick={() => onLaunchGame({ wave: middleLunchWave })}>
          🚀 CONFIRM & START GAME
        </button>
      </div>
    </div>
  );
}