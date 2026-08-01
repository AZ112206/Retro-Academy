import React, { useMemo } from 'react';
import RetroIcon, { RetroArrow } from '../RetroIcon';

// Middle school courses aligned precisely with ClassSelectionStep.jsx pool structure
const SUBJECT_POOL = {
  6: [
    { id: 'mid_reading_g6', name: 'Reading', icon: 'book', course: 'Narrative Literacy & Reading Workshop' },
    { id: 'mid_ela_g6', name: 'ELA', icon: 'pencil', course: 'Introductory Composition & Grammar Mechanics' },
    { id: 'mid_math_g6', name: 'Mathematics', icon: 'math', course: 'Foundations of Mathematics VI' },
    { id: 'mid_science_g6', name: 'Science', icon: 'science', course: 'Introductory Earth & Space Science' },
    { id: 'mid_social_studies_g6', name: 'Social Studies', icon: 'history', course: 'Ancient World History & Geography' }
  ],
  7: [
    { id: 'mid_reading_g7', name: 'Reading', icon: 'book', course: 'Critical Reading & Literary Analysis' },
    { id: 'mid_ela_g7', name: 'ELA', icon: 'pencil', course: 'Intermediate Writing & Rhetoric' },
    { id: 'mid_math_g7', name: 'Mathematics', icon: 'math', course: 'Intermediate Mathematical Concepts' },
    { id: 'mid_science_g7', name: 'Science', icon: 'science', course: 'Life Science & Microscopic Worlds' },
    { id: 'mid_social_studies_g7', name: 'Social Studies', icon: 'history', course: 'Global Cultures & World Geography' }
  ],
  8: [
    { id: 'mid_spanish_g8', name: 'Spanish', icon: 'language', course: 'Introductory Spanish' },
    { id: 'mid_ela_g8', name: 'ELA', icon: 'pencil', course: 'Pre-English' },
    { id: 'mid_math_g8', name: 'Mathematics', icon: 'math', course: 'Pre-Algebra' },
    { id: 'mid_science_g8', name: 'Science', icon: 'science', course: 'Introductory Physical Science & Physics Foundations' },
    { id: 'mid_social_studies_g8', name: 'Social Studies', icon: 'history', course: 'Early American History & Civics Foundations' }
  ]
};

// Standardized uniform bell schedule timeline ensuring equal class lengths and balanced lunch
const BELL_TIMELINE = [
  { id: 'homeroom', label: 'Homeroom', start: '8:00 AM', end: '8:15 AM', type: 'homeroom' },
  { id: 'block1', label: 'Block 1', start: '8:20 AM', end: '9:10 AM', type: 'class' },
  { id: 'block2', label: 'Block 2', start: '9:15 AM', end: '10:05 AM', type: 'class' },
  { id: 'block3', label: 'Block 3', start: '10:10 AM', end: '11:00 AM', type: 'class' },
  { id: 'lunch', label: 'Lunch Block', start: '11:05 AM', end: '11:50 AM', type: 'lunch' },
  { id: 'block4', label: 'Block 4', start: '11:55 AM', end: '12:45 PM', type: 'class' },
  { id: 'block5', label: 'Block 5', start: '12:50 PM', end: '1:40 PM', type: 'class' },
  { id: 'block6', label: 'Block 6', start: '1:45 PM', end: '2:30 PM', type: 'class' }
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function MiddleSchoolScheduleStep({ middleGrade, middleLunchWave, selectedClass, onLaunchGame, onBack, onExit, onSaveGame, styles }) {
  const resolvedGrade = Number(middleGrade) || 6;

  // Grade placement specs: 6th = Block 2, 7th = Block 4, 8th = Block 6
  const specialistBlockByGrade = { 6: 'block2', 7: 'block4', 8: 'block6' };
  const specialistTargetId = specialistBlockByGrade[resolvedGrade] || 'block2';

  const gradeSubjects = SUBJECT_POOL[resolvedGrade] || SUBJECT_POOL[6];
  const fallbackSubject = gradeSubjects[0];
  const activeSubjectLabel = selectedClass?.name || selectedClass?.course || fallbackSubject?.course || `Grade ${resolvedGrade} Core Block`;
  const specialistRotationRules = {
    6: 'Grade 6 Specialists | Grade 7 Study Hall | Grade 8 Core Class',
    7: 'Grade 7 Specialists | Grade 8 Study Hall | Grade 6 Core Class',
    8: 'Grade 8 Specialists | Grade 6 Study Hall | Grade 7 Core Class'
  };

  // Master schedule generation with precise slot rules
  const autoScheduleRows = useMemo(() => {
    let sectionCounter = resolvedGrade * 100 + 1;

    return BELL_TIMELINE.map(slot => {
      if (slot.type === 'homeroom') {
        return {
          id: slot.id,
          block: { label: slot.label, time: `${slot.start} - ${slot.end}` },
          entry: { name: 'Homeroom & Attendance', sec: null, isPrep: false, isLunch: false, isHomeroom: true }
        };
      }

      if (slot.type === 'lunch') {
        const waveLabel = resolvedGrade === 6 ? 'Wave A (Early)' : resolvedGrade === 7 ? 'Wave B (Mid)' : 'Wave C (Late)';
        return {
          id: slot.id,
          block: { label: slot.label, time: `${slot.start} - ${slot.end}` },
          entry: { name: `Student Lunch Supervision (${waveLabel})`, sec: null, isPrep: false, isLunch: true }
        };
      }

      if (slot.type === 'class') {
        if (slot.id === specialistTargetId) {
          return {
            id: slot.id,
            block: { label: `${slot.label} / Specialist`, time: `${slot.start} - ${slot.end}` },
            entry: { name: 'Specialist Rotation (Art/Music/PE/Tech)', sec: 'Spec-101', isPrep: true, isLunch: false }
          };
        }

        const row = {
          id: slot.id,
          block: { label: slot.label, time: `${slot.start} - ${slot.end}` },
          entry: { name: activeSubjectLabel, sec: `#${sectionCounter}`, isPrep: false, isLunch: false }
        };
        sectionCounter += 1;
        return row;
      }

      return { id: slot.id, block: { label: 'Unassigned', time: '' }, entry: { name: 'Open', sec: null } };
    });
  }, [resolvedGrade, activeSubjectLabel, specialistTargetId]);

  const actualWaveOutput = resolvedGrade === 6 ? 'Wave A (Early)' : resolvedGrade === 7 ? 'Wave B (Mid)' : 'Wave C (Late)';

  return (
    <div style={{ ...styles.setupBox, maxWidth: '950px' }}>
      <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <RetroIcon kind="grid" /> GRADE {resolvedGrade} TEACHER MASTER SCHEDULE
      </h2>
      <p style={styles.subtitle}>
        Core Focus: {activeSubjectLabel} | Specialist Block Locked to: <span style={{ color: '#ff9f43' }}>{specialistTargetId.toUpperCase()}</span>
      </p>
      <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '10px 12px', marginBottom: '16px', color: '#9acb92', fontSize: '0.78rem' }}>
        6 Daily Blocks (5 Class Sessions + 1 Teacher Prep/Study Hall) with fixed lunch wave. Rotation Rule: {specialistRotationRules[resolvedGrade]}
      </div>

      {/* Master Schedule Table */}
      <div className="no-scrollbar" style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', marginBottom: '20px' }}>
        <div style={{ color: '#39FF14', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          // Master Faculty Timetable (5 Core + 1 Specialist + Balanced Lunch)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.8rem', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '8px', color: '#888', textAlign: 'left' }}>BLOCK / TIME</th>
              {WEEK_DAYS.map(day => <th key={day} style={{ padding: '8px', color: '#39FF14' }}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {autoScheduleRows.map(({ id, block, entry }) => (
              <tr key={id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '8px', borderRight: '1px solid #222', textAlign: 'left', minWidth: '140px' }}>
                  <div style={{ fontWeight: 'bold', color: entry.isHomeroom ? '#00FFFF' : '#fff' }}>{block.label}</div>
                  <div style={{ fontSize: '0.65rem', color: '#aaa' }}>{block.time}</div>
                </td>
                {WEEK_DAYS.map(day => {
                  let scheduleColor = '#fff';
                  if (entry.isLunch) scheduleColor = '#f6d365';
                  else if (entry.isPrep) scheduleColor = '#ff9f43';
                  else if (entry.isHomeroom) scheduleColor = '#00FFFF';

                  return (
                    <td key={`${id}-${day}`} style={{ padding: '8px', borderRight: '1px solid #222', color: scheduleColor }}>
                      <div style={{ fontWeight: entry.isLunch || entry.isPrep || entry.isHomeroom ? 'bold' : 'normal' }}>{entry.name}</div>
                      {entry.sec && <div style={{ fontSize: '0.65rem', color: '#39FF14' }}>{entry.sec}</div>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.footerActions}>
        <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <RetroArrow direction="left" /> BACK
          </span>
        </button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
        <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
        <button style={{ ...styles.actionButton, flex: '2 1 240px' }} onClick={() => onLaunchGame({ wave: actualWaveOutput, specialistRotationRule: specialistRotationRules[resolvedGrade] })}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            CUSTOMIZE AVATAR <RetroArrow color="#0a0a0a" />
          </span>
        </button>
      </div>
    </div>
  );
}