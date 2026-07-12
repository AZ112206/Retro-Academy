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

// Adjusted timeline terminating cleanly at 2:30 PM
const BELL_TIMELINE = [
  { id: 'homeroom', label: 'Homeroom', start: '8:00 AM', end: '8:15 AM', type: 'homeroom' },
  { id: 'block1', label: 'Block 1', start: '8:20 AM', end: '9:10 AM', type: 'class' },
  { id: 'block2', label: 'Block 2', start: '9:15 AM', end: '10:05 AM', type: 'class' },
  { id: 'block3', label: 'Block 3', start: '10:10 AM', end: '11:00 AM', type: 'class' },
  
  // Mid-day Rotations (Adjusted slightly to shift the afternoon blocks up)
  { id: 'mid_slot1', start: '11:05 AM', end: '11:35 AM', type: 'rotation' },
  { id: 'mid_slot2', start: '11:40 AM', end: '12:10 PM', type: 'rotation' },
  { id: 'mid_slot3', start: '12:15 PM', end: '12:45 PM', type: 'rotation' },
  
  { id: 'block5', label: 'Block 5', start: '12:50 PM', end: '1:40 PM', type: 'class' },
  { id: 'block6', label: 'Block 6', start: '1:45 PM', end: '2:30 PM', type: 'class' } // End target 2:30 PM
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function MiddleSchoolScheduleStep({ middleGrade, middleLunchWave, selectedClass, onLaunchGame, onBack, onExit, styles }) {
  const resolvedGrade = Number(middleGrade) || 6;
  const prepBlockByGrade = { 6: 'block2', 7: 'block4', 8: 'block6' };
  const prepBlockId = prepBlockByGrade[resolvedGrade] || 'block2';

  const fallbackSubject = SUBJECT_POOL[resolvedGrade]?.[0];
  const activeSubjectLabel = selectedClass?.name || selectedClass?.course || fallbackSubject?.course || `Grade ${resolvedGrade} Core Block`;

  const autoScheduleRows = useMemo(() => {
    let sectionCounter = resolvedGrade * 100 + 1;

    return BELL_TIMELINE.map(slot => {
      if (slot.type === 'homeroom') {
        return {
          block: { label: slot.label, time: `${slot.start} - ${slot.end}` },
          entry: { name: 'Homeroom & Attendance', sec: null, isPrep: false, isLunch: false, isHomeroom: true }
        };
      }

      if (slot.type === 'class') {
        if (slot.id === prepBlockId) {
          return {
            block: { label: `${slot.label} Specialists / Prep`, time: `${slot.start} - ${slot.end}` },
            entry: { name: 'Students in Specialists while Teachers Prep', sec: null, isPrep: true, isLunch: false }
          };
        }

        const row = {
          block: { label: slot.label, time: `${slot.start} - ${slot.end}` },
          entry: { name: activeSubjectLabel, sec: `#${sectionCounter}`, isPrep: false, isLunch: false }
        };
        sectionCounter += 1;
        return row;
      }

      if (slot.type === 'rotation') {
        // Grade 6: Lunch -> Prep -> Class
        if (resolvedGrade === 6) {
          if (slot.id === 'mid_slot1') {
            return {
              block: { label: 'Lunch Block', time: `${slot.start} - ${slot.end}` },
              entry: { name: 'Student Lunch Supervision (Wave A)', sec: null, isPrep: false, isLunch: true }
            };
          }
          if (slot.id === 'mid_slot2') {
            return {
              block: { label: 'Advisory / Flex', time: `${slot.start} - ${slot.end}` },
              entry: { name: 'Advisory, check-ins, and transition support', sec: null, isPrep: false, isLunch: false }
            };
          }
          const row = {
            block: { label: 'Block 4', time: `${slot.start} - ${slot.end}` },
            entry: { name: activeSubjectLabel, sec: `#${sectionCounter}`, isPrep: false, isLunch: false }
          };
          sectionCounter += 1;
          return row;
        }

        // Grade 7: Class -> Lunch -> Prep
        if (resolvedGrade === 7) {
          if (slot.id === 'mid_slot1') {
            return {
              block: { label: 'Block 4 Specialists / Prep', time: `${slot.start} - ${slot.end}` },
              entry: { name: 'Students in Specialists while Teachers Prep', sec: null, isPrep: true, isLunch: false }
            };
          }
          if (slot.id === 'mid_slot2') {
            return {
              block: { label: 'Lunch Block', time: `${slot.start} - ${slot.end}` },
              entry: { name: 'Student Lunch Supervision (Wave B)', sec: null, isPrep: false, isLunch: true }
            };
          }
          return {
            block: { label: 'Advisory / Flex', time: `${slot.start} - ${slot.end}` },
            entry: { name: 'Advisory, check-ins, and transition support', sec: null, isPrep: false, isLunch: false }
          };
        }

        // Grade 8: Prep -> Class -> Lunch
        if (resolvedGrade === 8) {
          if (slot.id === 'mid_slot1') {
            return {
              block: { label: 'Advisory / Flex', time: `${slot.start} - ${slot.end}` },
              entry: { name: 'Advisory, check-ins, and transition support', sec: null, isPrep: false, isLunch: false }
            };
          }
          if (slot.id === 'mid_slot2') {
            const row = {
              block: { label: 'Block 4', time: `${slot.start} - ${slot.end}` },
              entry: { name: activeSubjectLabel, sec: `#${sectionCounter}`, isPrep: false, isLunch: false }
            };
            sectionCounter += 1;
            return row;
          }
          return {
            block: { label: 'Lunch Block', time: `${slot.start} - ${slot.end}` },
            entry: { name: 'Student Lunch Supervision (Wave C)', sec: null, isPrep: false, isLunch: true }
          };
        }
      }

      return { block: { label: 'Error', time: '' }, entry: { name: 'Unassigned', sec: null } };
    });
  }, [resolvedGrade, activeSubjectLabel]);

  const actualWaveOutput = resolvedGrade === 6 ? 'Wave A (Early)' : resolvedGrade === 7 ? 'Wave B (Mid)' : 'Wave C (Late)';

  return (
    <div style={{ ...styles.setupBox, maxWidth: '900px' }}>
      <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <RetroIcon kind="grid" /> MASTER GRADE {resolvedGrade} SCHEDULE
      </h2>
      <p style={styles.subtitle}>Selected subject: {activeSubjectLabel}</p>

      <div className="no-scrollbar" style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '8px', color: '#888', textAlign: 'left' }}>BLOCK / TIME</th>
              {WEEK_DAYS.map(day => <th key={day} style={{ padding: '8px', color: '#39FF14' }}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {autoScheduleRows.map(({ block, entry }, idx) => (
              <tr key={`${block.label}-${idx}`} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '10px 8px', borderRight: '1px solid #222', textAlign: 'left', minWidth: '150px' }}>
                  <div style={{ fontWeight: 'bold', color: entry.isHomeroom ? '#00FFFF' : '#fff' }}>{block.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{block.time}</div>
                </td>
                {WEEK_DAYS.map(day => {
                  let scheduleColor = '#fff';
                  if (entry.isLunch) scheduleColor = '#f6d365';
                  else if (entry.isPrep) scheduleColor = '#ff9f43';
                  else if (entry.isHomeroom) scheduleColor = '#00FFFF';

                  return (
                    <td key={`${block.label}-${day}-${idx}`} style={{ padding: '10px 8px', borderRight: '1px solid #222', color: scheduleColor }}>
                      <div style={{ fontWeight: entry.isLunch || entry.isPrep || entry.isHomeroom ? 'bold' : 'normal' }}>{entry.name}</div>
                      {entry.sec && <div style={{ fontSize: '0.7rem', color: '#39FF14' }}>Sec {entry.sec}</div>}
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
        <button style={{ ...styles.actionButton, flex: '2 1 240px' }} onClick={() => onLaunchGame({ wave: actualWaveOutput })}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            CUSTOMIZE AVATAR <RetroArrow color="#0a0a0a" />
          </span>
        </button>
      </div>
    </div>
  );
}