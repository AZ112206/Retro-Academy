import React, { useState, useMemo } from 'react';

const ELEMENTARY_SUBJECTS = [
  { id: 'elem_ela', name: '📚 Reading & ELA', course: 'Language Arts & Reading' },
  { id: 'elem_math', name: '📐 Mathematics', course: 'Elementary Math Focus' },
  { id: 'elem_sci_ss', name: '🌍 Science & Social Studies', course: 'Integrated Science/SS' }
];

export default function ElementarySchoolScheduleStep({ elementaryGrade, onLaunchGame, onBack, styles }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  
  const isLowerElem = elementaryGrade === 0 || elementaryGrade === 1 || elementaryGrade === 2;
  const displayGradeName = elementaryGrade === 0 ? 'Kindergarten' : `Grade ${elementaryGrade}`;

  const currentSubject = useMemo(() => {
    return ELEMENTARY_SUBJECTS.find(s => s.id === selectedSubjectId) || null;
  }, [selectedSubjectId]);

  // Generate permanent Grade-to-Grade pairs and their specific Mid-Day order for the school year
  const elementaryMasterSetup = useMemo(() => {
    return {
      Kindergarten: { wave: 'Wave A (Early)', time: '10:30 AM - 11:30 AM', pairedWith: 'Grade 4', order: 'Recess First ➡️ Lunch Second' },
      'Grade 1':    { wave: 'Wave B (Mid)',   time: '11:15 AM - 12:15 PM', pairedWith: 'Grade 3', order: 'Lunch First ➡️ Recess Second' },
      'Grade 2':    { wave: 'Wave C (Late)',  time: '12:00 PM - 1:00 PM',  pairedWith: 'Grade 5', order: 'Recess First ➡️ Lunch Second' },
      'Grade 3':    { wave: 'Wave B (Mid)',   time: '11:15 AM - 12:15 PM', pairedWith: 'Grade 1', order: 'Lunch First ➡️ Recess Second' },
      'Grade 4':    { wave: 'Wave A (Early)', time: '10:30 AM - 11:30 AM', pairedWith: 'Kindergarten', order: 'Recess First ➡️ Lunch Second' },
      'Grade 5':    { wave: 'Wave C (Late)',  time: '12:00 PM - 1:00 PM',  pairedWith: 'Grade 2', order: 'Recess First ➡️ Lunch Second' }
    };
  }, []);

  const currentSetup = elementaryMasterSetup[displayGradeName];

  // Dynamic schedule generator keeping timelines mirrored between brackets
  const scheduleRows = useMemo(() => {
    const midDayLabel = `Lunch Block [${currentSetup.wave}]`;
    const midDayDisplay = `🥪 Mid-Day Block (${currentSetup.order}) — Sharing with: 👥 ${currentSetup.pairedWith} (Locked)`;

    if (isLowerElem) {
      // K-2 Self-Contained Day with explicit core subjects structured perfectly
      return [
        { time: '8:00 AM - 9:00 AM', label: 'Reading Block', display: '📚 Core Module I: Reading & ELA Foundations (Phonics, Word Study & Read-Aloud)', isSpecial: false },
        { time: '9:00 AM - 9:30 AM', label: 'Snack Time', display: '🍎 Class-Wide Morning Snack Break & Story Circle', isSpecial: true },
        { time: '9:30 AM - 10:45 AM', label: 'Math Block', display: '📐 Core Module II: Mathematics Focus (Early Numeracy, Counting Labs & Hands-On Centers)', isSpecial: false },
        { time: currentSetup.time, label: midDayLabel, display: midDayDisplay, isSpecial: true },
        { time: '11:45 AM - 1:15 PM', label: 'Inquiry Block', display: '🌍 Core Module III: Science & Social Studies (Exploration, Interactive Maps & Lab Work)', isSpecial: false },
        { time: '1:15 PM - 2:00 PM', label: 'Dismissal Pack', display: '🎒 Classroom Reflection Circle, Shared Review & Dismissal Protocol', isSpecial: true }
      ];
    } else {
      // 3-5 Departmentalized 3-Session Block Rotation
      if (!currentSubject) return [];
      let baseSectionNum = 301 + (elementaryGrade - 3) * 100;

      return [
        { time: '8:00 AM - 9:00 AM', label: 'Session 1', display: `${currentSubject.course} — Departmental Section #${baseSectionNum}`, isSpecial: false },
        { time: '9:00 AM - 9:30 AM', label: 'Snack Time', display: '🍎 Upper Elementary Hydration & Healthy Snack Interval', isSpecial: true },
        { time: '9:30 AM - 10:45 AM', label: 'Session 2', display: `${currentSubject.course} — Departmental Section #${baseSectionNum + 1}`, isSpecial: false },
        { time: currentSetup.time, label: midDayLabel, display: midDayDisplay, isSpecial: true },
        { time: '11:45 AM - 1:15 PM', label: 'Session 3', display: `${currentSubject.course} — Departmental Section #${baseSectionNum + 2}`, isSpecial: false },
        { time: '1:15 PM - 2:00 PM', label: 'Prep Block', display: '☕ Teacher Planning, Grading & Inter-Departmental Alignment', isSpecial: true }
      ];
    }
  }, [isLowerElem, currentSubject, elementaryGrade, currentSetup]);

  const alertStyle = {
    backgroundColor: '#221c11',
    border: '1px solid #ff9f43',
    borderRadius: '6px',
    padding: '14px',
    color: '#ecc9a8',
    fontSize: '0.85rem',
    marginBottom: '20px',
    textAlign: 'left',
    lineHeight: '1.5'
  };

  if (!isLowerElem && !currentSubject) {
    return (
      <div style={styles.setupBox}>
        <h2 style={styles.heading}>🍎 UPPER ELEMENTARY CORE</h2>
        <p style={styles.subtitle}>Select your primary block teaching core:</p>
        <div style={{ ...styles.menuColumn, maxWidth: '500px', margin: '0 auto' }}>
          {ELEMENTARY_SUBJECTS.map(subj => (
            <button key={subj.id} onClick={() => setSelectedSubjectId(subj.id)} style={styles.menuButton}>
              {subj.name}
            </button>
          ))}
          <button style={{ ...styles.exitButton, marginTop: '20px' }} onClick={onBack}>← BACK</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.setupBox, maxWidth: '850px' }}>
      <h2 style={styles.heading}>🍎 ELEMENTARY SCHEDULE CONFIG</h2>
      <p style={styles.subtitle}>{displayGradeName} ({isLowerElem ? 'Self-Contained Structure' : '3-Session Departmental Structure'})</p>

      <div style={alertStyle}>
        🔑 <strong>Annual Schedule Matrix Lock:</strong> <br />
        • Paired Interaction Grade: <strong style={{ color: '#ff9f43' }}>{currentSetup.pairedWith}</strong><br />
        • Time Interval Slot: <strong style={{ color: '#ff9f43' }}>{currentSetup.wave} ({currentSetup.time})</strong><br />
        • Mid-Day Activity Sequence: <strong style={{ color: '#39FF14' }}>{currentSetup.order}</strong>
      </div>

      <div style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'left' }}>
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

      <div style={{ display: 'flex', gap: '15px', maxWidth: '550px', margin: '0 auto' }}>
        <button style={{ ...styles.exitButton, flex: 1 }} onClick={isLowerElem ? onBack : () => setSelectedSubjectId(null)}>← BACK</button>
        <button style={{ ...styles.actionButton, flex: 2 }} onClick={() => onLaunchGame({ gradeType: isLowerElem ? 'Self-Contained Core' : '3-Session Departmental', lunchWave: currentSetup })}>
          🚀 FINALIZE SCHEDULE
        </button>
      </div>
    </div>
  );
}