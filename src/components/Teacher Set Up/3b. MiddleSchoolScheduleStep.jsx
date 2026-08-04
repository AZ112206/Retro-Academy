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

// Standardized bell schedule: all class/specialist blocks are equal length and lunch waves are equal length.
const BELL_TIMELINE = [
  { id: 'homeroom', label: 'Homeroom', start: '8:00 AM', end: '8:15 AM', type: 'homeroom' },
  { id: 'block1', label: 'Block 1', start: '8:20 AM', end: '9:00 AM', type: 'class' },
  { id: 'block2', label: 'Block 2', start: '9:05 AM', end: '9:45 AM', type: 'class' },
  { id: 'block3', label: 'Block 3', start: '9:50 AM', end: '10:30 AM', type: 'class' },
  { id: 'lunch', label: 'Lunch Block', start: '10:35 AM', end: '11:05 AM', type: 'lunch' },
  { id: 'block4', label: 'Block 4', start: '12:20 PM', end: '1:00 PM', type: 'class' },
  { id: 'block5', label: 'Block 5', start: '1:05 PM', end: '1:45 PM', type: 'class' },
  { id: 'block6', label: 'Block 6', start: '1:50 PM', end: '2:30 PM', type: 'class' }
];

const MIDDLE_LUNCH_WAVE_BY_GRADE = {
  6: { label: 'Wave A (Early)', time: '10:35 AM - 11:05 AM' },
  7: { label: 'Wave B (Mid)', time: '11:10 AM - 11:40 AM' },
  8: { label: 'Wave C (Late)', time: '11:45 AM - 12:15 PM' }
};

const MIDDLE_SUPPORT_WINDOWS_BY_GRADE = {
  6: [{ id: 'support-midday-1', label: 'Student Support', time: '11:10 AM - 12:15 PM' }],
  7: [
    { id: 'support-midday-1', label: 'Student Support', time: '10:35 AM - 11:05 AM' },
    { id: 'support-midday-2', label: 'Student Support', time: '11:45 AM - 12:15 PM' }
  ],
  8: [{ id: 'support-midday-1', label: 'Student Support', time: '10:35 AM - 11:40 AM' }]
};

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function MiddleSchoolScheduleStep({ middleGrade, middleLunchWave, selectedClass, onLaunchGame, onBack, onExit, onSaveGame, styles }) {
  const resolvedGrade = Number(middleGrade) || 6;
  const waveConfig = MIDDLE_LUNCH_WAVE_BY_GRADE[resolvedGrade] || MIDDLE_LUNCH_WAVE_BY_GRADE[6];
  const supportWindows = MIDDLE_SUPPORT_WINDOWS_BY_GRADE[resolvedGrade] || MIDDLE_SUPPORT_WINDOWS_BY_GRADE[6];

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
    const supportSlotRows = supportWindows.map((window, idx) => ({
      id: window.id,
      label: supportWindows.length > 1 ? `${window.label} ${idx + 1}` : window.label,
      time: window.time,
      type: 'support'
    }));
    const lunchSlotRow = {
      id: 'lunch',
      label: 'Lunch Block',
      time: waveConfig.time,
      type: 'lunch'
    };
    const middayRows = resolvedGrade === 6
      ? [lunchSlotRow, ...supportSlotRows]
      : resolvedGrade === 7
      ? [supportSlotRows[0], lunchSlotRow, supportSlotRows[1]].filter(Boolean)
      : [...supportSlotRows, lunchSlotRow];

    const timelineWithSupport = [
      ...BELL_TIMELINE.slice(0, 4),
      ...middayRows,
      ...BELL_TIMELINE.slice(5)
    ];

    return timelineWithSupport.map(slot => {
      if (slot.type === 'homeroom') {
        return {
          id: slot.id,
          block: { label: slot.label, time: `${slot.start} - ${slot.end}` },
          entry: { name: 'Homeroom & Attendance', sec: null, isPrep: false, isLunch: false, isHomeroom: true }
        };
      }

      if (slot.type === 'lunch') {
        return {
          id: slot.id,
          block: { label: slot.label, time: slot.time || waveConfig.time },
          entry: { name: `Student Lunch Supervision (${waveConfig.label})`, sec: null, isPrep: false, isLunch: true }
        };
      }

      if (slot.type === 'support') {
        return {
          id: slot.id,
          block: { label: slot.label, time: slot.time },
          entry: { name: 'Student Support / Advisory', sec: null, isPrep: false, isLunch: false, isSupport: true }
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
  }, [resolvedGrade, activeSubjectLabel, specialistTargetId, supportWindows, waveConfig]);

  const actualWaveOutput = middleLunchWave || waveConfig.label;

  return (
    <div style={{ ...styles.setupBox, maxWidth: '950px' }}>
      <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <RetroIcon kind="grid" /> GRADE {resolvedGrade} TEACHER MASTER SCHEDULE
      </h2>
      <p style={styles.subtitle}>
        Core Focus: {activeSubjectLabel} | Specialist Block Locked to: <span style={{ color: '#ff9f43' }}>{specialistTargetId.toUpperCase()}</span>
      </p>
      <div style={{ backgroundColor: '#161616', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '10px 12px', marginBottom: '16px', color: '#9acb92', fontSize: '0.78rem' }}>
        6 Daily Blocks (5 Class Sessions + 1 Teacher Prep/Study Hall) with staggered 30-minute lunch waves. Rotation Rule: {specialistRotationRules[resolvedGrade]}
        <div style={{ marginTop: '6px', color: '#f6d365' }}>Lunch Wave: {actualWaveOutput} ({waveConfig.time})</div>
      </div>

      {/* Master Schedule Table */}
      <div className="no-scrollbar" style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'hidden', overflowY: 'visible', marginBottom: '20px' }}>
        <div style={{ color: '#39FF14', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          // Master Faculty Timetable (5 Core + 1 Specialist + Balanced Lunch)
        </div>
        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.78rem', textAlign: 'center', tableLayout: 'fixed' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '8px', color: '#888', textAlign: 'left' }}>BLOCK / TIME</th>
              {WEEK_DAYS.map(day => <th key={day} style={{ padding: '8px', color: '#39FF14' }}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {autoScheduleRows.map(({ id, block, entry }) => (
              <tr key={id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '8px', borderRight: '1px solid #222', textAlign: 'left', minWidth: '140px', verticalAlign: 'top' }}>
                  <div style={{ fontWeight: 'bold', color: entry.isHomeroom ? '#00FFFF' : '#fff', fontSize: '0.76rem', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word', lineHeight: 1.25 }}>{block.label}</div>
                  <div style={{ fontSize: '0.65rem', color: '#aaa' }}>{block.time}</div>
                </td>
                {WEEK_DAYS.map(day => {
                  let scheduleColor = '#fff';
                  if (entry.isLunch) scheduleColor = '#f6d365';
                  else if (entry.isPrep) scheduleColor = '#ff9f43';
                  else if (entry.isSupport) scheduleColor = '#9acb92';
                  else if (entry.isHomeroom) scheduleColor = '#00FFFF';

                  return (
                    <td key={`${id}-${day}`} style={{ padding: '8px', borderRight: '1px solid #222', color: scheduleColor, verticalAlign: 'top' }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: entry.isLunch || entry.isPrep || entry.isHomeroom ? 'bold' : 'normal', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word', lineHeight: 1.3 }}>{entry.name}</div>
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