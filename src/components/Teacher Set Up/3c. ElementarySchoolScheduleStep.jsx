import React, { useState, useMemo } from 'react';
import RetroIcon, { RetroArrow } from '../RetroIcon';

const ELEMENTARY_SUBJECTS = [
  { id: 'elem_ela', name: 'Reading & ELA', icon: 'book', course: 'Language Arts & Reading' },
  { id: 'elem_math', name: 'Mathematics', icon: 'math', course: 'Elementary Math Focus' },
  { id: 'elem_sci_ss', name: 'Science & Social Studies', icon: 'globe', course: 'Integrated Science/SS' }
];

export default function ElementarySchoolScheduleStep({ elementaryGrade, selectedClass, onLaunchGame, onBack, onExit, styles }) {
  
  const isLowerElem = elementaryGrade === 0 || elementaryGrade === 1 || elementaryGrade === 2;
  const displayGradeName = elementaryGrade === 0 ? 'Kindergarten' : `Grade ${elementaryGrade}`;

  // Adjusted schedule lock times shifted by 15 minutes to preserve instructional space
  const elementaryMasterSetup = useMemo(() => {
    return {
      Kindergarten: { wave: 'Wave A (Early)', time: '11:15 AM - 11:55 AM', pairedWith: 'Grade 4', order: 'Recess First / Lunch Second' },
      'Grade 1':    { wave: 'Wave B (Mid)',   time: '11:25 AM - 12:05 PM', pairedWith: 'Grade 3', order: 'Lunch First / Recess Second' },
      'Grade 2':    { wave: 'Wave C (Late)',  time: '11:35 AM - 12:15 PM', pairedWith: 'Grade 5', order: 'Recess First / Lunch Second' },
      'Grade 3':    { wave: 'Wave B (Mid)',   time: '11:25 AM - 12:05 PM', pairedWith: 'Grade 1', order: 'Lunch First / Recess Second' },
      'Grade 4':    { wave: 'Wave A (Early)', time: '11:15 AM - 11:55 AM', pairedWith: 'Kindergarten', order: 'Recess First / Lunch Second' },
      'Grade 5':    { wave: 'Wave C (Late)',  time: '11:35 AM - 12:15 PM', pairedWith: 'Grade 2', order: 'Recess First / Lunch Second' }
    };
  }, []);

  const currentSetup = elementaryMasterSetup[displayGradeName];
  const selectedUpperSubject = selectedClass?.name || selectedClass?.course || 'Upper Elementary Core Rotation';

  // Dynamic schedule matrix scaled to complete precisely at 2:30 PM
  const scheduleRows = useMemo(() => {
    const midDayLabel = `Lunch and Recess [${currentSetup.wave}]`;
    const midDayDisplay = `Shared midday block with ${currentSetup.pairedWith}. Sequence: ${currentSetup.order}.`;

    if (isLowerElem) {
      return [
        { time: '8:00 AM - 8:15 AM', label: 'Homeroom', display: 'Homeroom routines, attendance tracking, calendar work, and SEL check-in.', isSpecial: true },
        { time: '8:20 AM - 9:35 AM', label: 'Literacy Block', display: 'Reading foundations, phonics labs, read-alouds, and guided writing workshop.', isSpecial: false },
        { time: '9:35 AM - 9:50 AM', label: 'Snack and Reset', display: 'Class nutrition snack, active movement break, and transition reset.', isSpecial: true },
        { time: '9:55 AM - 11:10 AM', label: 'Math Workshop', display: 'Whole-group numeracy, guided math centers, and physical intervention rotations.', isSpecial: false },
        { time: currentSetup.time, label: midDayLabel, display: midDayDisplay, isSpecial: true },
        { time: '12:20 PM - 1:15 PM', label: 'Inquiry Block', display: 'Science and social studies investigations, observations, and project-based labs.', isSpecial: false },
        { time: '1:20 PM - 2:05 PM', label: 'Specialists / Prep Block', display: 'Students attend specialists while teacher prep and small-group planning are completed.', isSpecial: true },
        { time: '2:05 PM - 2:30 PM', label: 'Pack Up & Dismissal', display: 'Daily student reflection, family notes filing, and baseline dismissal routines.', isSpecial: true }
      ];
    } else {
      let baseSectionNum = 301 + (elementaryGrade - 3) * 100;

      return [
        { time: '8:00 AM - 8:15 AM', label: 'Homeroom', display: 'Homeroom check-in, attendance tracking, school announcements, and organizational routines.', isSpecial: true },
        { time: '8:20 AM - 9:15 AM', label: 'Session 1', display: `${selectedUpperSubject} - Section #${baseSectionNum}`, isSpecial: false },
        { time: '9:20 AM - 10:15 AM', label: 'Session 2', display: `${selectedUpperSubject} - Section #${baseSectionNum + 1}`, isSpecial: false },
        { time: '10:20 AM - 11:10 AM', label: 'WIN / Intervention', display: 'Targeted core reteach, instructional acceleration, and individual student conferencing.', isSpecial: true },
        { time: currentSetup.time, label: midDayLabel, display: midDayDisplay, isSpecial: true },
        { time: '12:20 PM - 1:15 PM', label: 'Session 3', display: `${selectedUpperSubject} - Section #${baseSectionNum + 2}`, isSpecial: false },
        { time: '1:20 PM - 2:05 PM', label: 'Planning Block / Specialists', display: 'Teacher planning block while students are in specialists at the same time.', isSpecial: true },
        { time: '2:05 PM - 2:30 PM', label: 'Closure & Dismissal', display: 'Student wrap-up support, hallway monitoring coverage, and staggered dismissal routines.', isSpecial: true }
      ];
    }
  }, [isLowerElem, elementaryGrade, currentSetup, selectedUpperSubject]);

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
      <p style={styles.subtitle}>{displayGradeName} ({isLowerElem ? 'Self-Contained K-2 Schedule' : `Selected Subject: ${selectedUpperSubject}`}) | Day Window: 8:00 AM - 2:30 PM</p>

      <div style={alertStyle}>
        <strong>Annual Schedule Lock</strong><br />
        Paired grade: <strong style={{ color: '#ff9f43' }}>{currentSetup.pairedWith}</strong><br />
        Midday window: <strong style={{ color: '#ff9f43' }}>{currentSetup.wave} ({currentSetup.time})</strong><br />
        Sequence: <strong style={{ color: '#39FF14' }}>{currentSetup.order}</strong>
      </div>

      <div className="no-scrollbar" style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '8px', color: '#888', textAlign: 'left' }}>BLOCK / TIME</th>
              <th style={{ padding: '8px', color: '#39FF14', textAlign: 'left' }}>DAILY SCHEDULE SYSTEM ACTIVITIES</th>
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row, idx) => {
              let cellColor = '#fff';
              if (row.isSpecial) {
                if (row.label.includes('Snack')) cellColor = '#39FF14';
                else if (row.label.includes('Homeroom')) cellColor = '#00FFFF';
                else cellColor = '#ff9f43';
              }

              return (
                <tr key={idx} style={{ borderBottom: '1px solid #222', backgroundColor: row.isSpecial ? '#1b1b1b' : 'transparent' }}>
                  <td style={{ padding: '10px 8px', borderRight: '1px solid #222', width: '35%', textAlign: 'left' }}>
                    <div style={{ fontWeight: 'bold', color: row.label === 'Homeroom' ? '#00FFFF' : '#fff' }}>{row.label}</div>
                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{row.time}</div>
                  </td>
                  <td style={{ padding: '10px 8px', color: cellColor, textAlign: 'left' }}>
                    {row.display}
                  </td>
                </tr>
              );
            })}
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