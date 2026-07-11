import React, { useMemo, useState } from 'react';

// Middle school courses aligned precisely with ClassSelectionStep.jsx pool structure
const SUBJECT_POOL = {
  6: [
    { id: 'mid_reading_g6', name: '📖 Reading', course: 'Narrative Literacy & Reading Workshop' },
    { id: 'mid_ela_g6', name: '📝 ELA', course: 'Introductory Composition & Grammar Mechanics' },
    { id: 'mid_math_g6', name: '📐 Mathematics', course: 'Foundations of Mathematics VI' },
    { id: 'mid_science_g6', name: '🧪 Science', course: 'Introductory Earth & Space Science' },
    { id: 'mid_social_studies_g6', name: '📜 Social Studies', course: 'Ancient World History & Geography' }
  ],
  7: [
    { id: 'mid_reading_g7', name: '📖 Reading', course: 'Critical Reading & Literary Analysis' },
    { id: 'mid_ela_g7', name: '📝 ELA', course: 'Intermediate Writing & Rhetoric' },
    { id: 'mid_math_g7', name: '📐 Mathematics', course: 'Intermediate Mathematical Concepts' },
    { id: 'mid_science_g7', name: '🧪 Science', course: 'Life Science & Microscopic Worlds' },
    { id: 'mid_social_studies_g7', name: '📜 Social Studies', course: 'Global Cultures & World Geography' }
  ],
  8: [
    { id: 'mid_spanish_g8', name: '🗣️ Spanish', course: 'Introductory Spanish' },
    { id: 'mid_ela_g8', name: '📝 ELA', course: 'Pre-English' },
    { id: 'mid_math_g8', name: '📐 Mathematics', course: 'Pre-Algebra' },
    { id: 'mid_science_g8', name: '🧪 Science', course: 'Introductory Physical Science & Physics Foundations' },
    { id: 'mid_social_studies_g8', name: '📜 Social Studies', course: 'Early American History & Civics Foundations' }
  ]
};

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
  
  // Dynamically pull the correct subjects for the specific grade configuration
  const effectiveSubjects = useMemo(() => {
    return SUBJECT_POOL[resolvedGrade] || SUBJECT_POOL[6];
  }, [resolvedGrade]);

  const selectedSubject = effectiveSubjects.find(s => s.id === selectedSubjectId) || null;

  const autoScheduleRows = useMemo(() => {
    if (!selectedSubject) return [];
    let sectionCounter = resolvedGrade * 100 + 1; // Generates 601+, 701+, or 801+ based on grade context
    return BLOCK_TIMES.map(block => {
      if (block.type === 'prep') {
        return { block, entry: { name: '☕ Teacher Prep Block', sec: null, isPrep: true } };
      }
      const entry = { name: selectedSubject.course, sec: `#${sectionCounter}`, isPrep: false };
      sectionCounter += 1;
      return { block, entry };
    });
  }, [selectedSubject, resolvedGrade]);

  if (!selectedSubject) {
    return (
      <div style={{ ...styles.setupBox, maxWidth: '850px' }}>
        <h2 style={styles.heading}>🏫 MIDDLE SCHOOL SUBJECTS</h2>
        <p style={styles.subtitle}>Select your primary block teaching core (Grade {resolvedGrade}):</p>
        
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