import React, { useState, useMemo } from 'react';
import RetroIcon, { RetroArrow } from '../RetroIcon';

const ELEMENTARY_SUBJECTS = [
  { id: 'elem_ela', name: 'Reading & ELA', icon: 'book', course: 'Language Arts & Reading' },
  { id: 'elem_math', name: 'Mathematics', icon: 'math', course: 'Elementary Math Focus' },
  { id: 'elem_sci_ss', name: 'Science & Social Studies', icon: 'globe', course: 'Integrated Science/SS' }
];

export default function ElementarySchoolScheduleStep({ elementaryGrade, onLaunchGame, onBack, onExit, styles }) {
  
  const isLowerElem = elementaryGrade === 0 || elementaryGrade === 1 || elementaryGrade === 2;
  const displayGradeName = elementaryGrade === 0 ? 'Kindergarten' : `Grade ${elementaryGrade}`;

  // Generate permanent Grade-to-Grade pairs and their specific Mid-Day order for the school year
  const elementaryMasterSetup = useMemo(() => {
    return {
      Kindergarten: { wave: 'Wave A (Early)', time: '11:00 AM - 11:40 AM', pairedWith: 'Grade 4', order: 'Recess First / Lunch Second' },
      'Grade 1':    { wave: 'Wave B (Mid)',   time: '11:10 AM - 11:50 AM', pairedWith: 'Grade 3', order: 'Lunch First / Recess Second' },
      'Grade 2':    { wave: 'Wave C (Late)',  time: '11:20 AM - 12:00 PM', pairedWith: 'Grade 5', order: 'Recess First / Lunch Second' },
      'Grade 3':    { wave: 'Wave B (Mid)',   time: '11:10 AM - 11:50 AM', pairedWith: 'Grade 1', order: 'Lunch First / Recess Second' },
      'Grade 4':    { wave: 'Wave A (Early)', time: '11:00 AM - 11:40 AM', pairedWith: 'Kindergarten', order: 'Recess First / Lunch Second' },
      'Grade 5':    { wave: 'Wave C (Late)',  time: '11:20 AM - 12:00 PM', pairedWith: 'Grade 2', order: 'Recess First / Lunch Second' }
    };
  }, []);

  const currentSetup = elementaryMasterSetup[displayGradeName];

  // Dynamic schedule generator keeping timelines mirrored between brackets
  const scheduleRows = useMemo(() => {
    const midDayLabel = `Lunch and Recess [${currentSetup.wave}]`;
    const midDayDisplay = `Shared midday block with ${currentSetup.pairedWith}. Sequence: ${currentSetup.order}.`;

    if (isLowerElem) {
      return [
        { time: '8:00 AM - 8:20 AM', label: 'Morning Meeting', display: 'Homeroom routines, attendance, calendar work, and SEL check-in.', isSpecial: true },
        { time: '8:20 AM - 9:30 AM', label: 'Literacy Block', display: 'Reading foundations, phonics labs, read-alouds, and guided writing.', isSpecial: false },
        { time: '9:30 AM - 9:45 AM', label: 'Snack and Reset', display: 'Class snack, movement break, and transition reset.', isSpecial: true },
        { time: '9:45 AM - 10:55 AM', label: 'Math Workshop', display: 'Whole-group numeracy, centers, and intervention rotations.', isSpecial: false },
        { time: currentSetup.time, label: midDayLabel, display: midDayDisplay, isSpecial: true },
        { time: '11:45 AM - 12:40 PM', label: 'Inquiry Block', display: 'Science and social studies investigations, labs, and project work.', isSpecial: false },
        { time: '12:45 PM - 1:30 PM', label: 'Specials / Small Group', display: 'Encore rotation, targeted support, or enrichment.', isSpecial: false },
        { time: '1:30 PM - 2:00 PM', label: 'Pack Up', display: 'Reflection, family notes, and dismissal routines.', isSpecial: true }
      ];
    } else {
      let baseSectionNum = 301 + (elementaryGrade - 3) * 100;

      return [
        { time: '8:00 AM - 8:55 AM', label: 'Session 1', display: `Upper Elementary Core Rotation - Section #${baseSectionNum}`, isSpecial: false },
        { time: '9:00 AM - 9:50 AM', label: 'Session 2', display: `Upper Elementary Core Rotation - Section #${baseSectionNum + 1}`, isSpecial: false },
        { time: '9:55 AM - 10:55 AM', label: 'WIN / Intervention', display: 'Targeted reteach, acceleration, and student conferencing.', isSpecial: true },
        { time: currentSetup.time, label: midDayLabel, display: midDayDisplay, isSpecial: true },
        { time: '11:45 AM - 12:40 PM', label: 'Session 3', display: `Upper Elementary Core Rotation - Section #${baseSectionNum + 2}`, isSpecial: false },
        { time: '12:45 PM - 1:30 PM', label: 'Planning Block', display: 'Lesson prep, grading, and team alignment.', isSpecial: true },
        { time: '1:30 PM - 2:00 PM', label: 'Closure / Dismissal', display: 'Student wrap-up, hall coverage, and dismissal support.', isSpecial: true }
      ];
    }
  }, [isLowerElem, elementaryGrade, currentSetup]);

  const alertStyle = {
    backgroundColor: '#221c11',
    border: '1px solid #ff9f43',
    borderRadius: '6px',
    padding: '14px',
    color: '#ecc9a8',
    fontSize: '0.85rem',
    marginBottom: '20px',
    textAlign: 'center',
    lineHeight: '1.5'
  };

  return (
    <div style={{ ...styles.setupBox, maxWidth: '850px' }}>
      <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="grid" /> ELEMENTARY SCHEDULE CONFIG</h2>
      <p style={styles.subtitle}>{displayGradeName} ({isLowerElem ? 'Self-Contained K-2 Schedule' : '3-Session Departmental Structure'}) | Day Window: 8:00 AM - 2:00 PM</p>

      <div style={alertStyle}>
        <strong>Annual Schedule Lock</strong><br />
        Paired grade: <strong style={{ color: '#ff9f43' }}>{currentSetup.pairedWith}</strong><br />
        Midday window: <strong style={{ color: '#ff9f43' }}>{currentSetup.wave} ({currentSetup.time})</strong><br />
        Sequence: <strong style={{ color: '#39FF14' }}>{currentSetup.order}</strong>
      </div>

      <div style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '8px', color: '#888' }}>BLOCK / TIME</th>
              <th style={{ padding: '8px', color: '#39FF14' }}>DAILY SCHEDULE SYSTEM ACTIVITIES</th>
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #222', backgroundColor: row.isSpecial ? '#1b1b1b' : 'transparent' }}>
                <td style={{ padding: '10px 8px', borderRight: '1px solid #222', width: '35%' }}>
                  <div style={{ fontWeight: 'bold' }}>{row.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{row.time}</div>
                </td>
                <td style={{ padding: '10px 8px', color: row.isSpecial ? (row.label.includes('Snack') ? '#39FF14' : '#ff9f43') : '#fff' }}>
                  {row.display}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.footerActions}>
        <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span></button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
        <button style={{ ...styles.actionButton, flex: '2 1 240px' }} onClick={() => onLaunchGame({ gradeType: isLowerElem ? 'Self-Contained Core' : '3-Session Departmental', lunchWave: currentSetup.wave, lunchWindow: currentSetup.time })}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>CUSTOMIZE AVATAR <RetroArrow color="#0a0a0a" /></span>
        </button>
      </div>
    </div>
  );
}