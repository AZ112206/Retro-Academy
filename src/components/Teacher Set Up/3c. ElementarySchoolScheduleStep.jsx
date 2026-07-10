import React, { useState, useMemo } from 'react';

const ELEMENTARY_SUBJECTS = [
  { id: 'elem_ela', name: '📚 Reading & ELA', course: 'Language Arts & Reading' },
  { id: 'elem_math', name: '📐 Mathematics', course: 'Elementary Math Focus' },
  { id: 'elem_sci_ss', name: '🌍 Science & Social Studies', course: 'Integrated Science/SS' }
];

const FANDOMS = ['Retro Gamers', 'Card Battlers', 'Mecha Pilots', 'Synthwave Kids', 'Pixel Artists', 'Comic Club'];

const K2_BLOCKS = [
  { id: 'k2_b1', label: 'Block 1', time: '8:00 AM - 9:00 AM', activity: '🌅 Morning Meeting & Phonics Foundations' },
  { id: 'k2_b2', label: 'Block 2', time: '9:00 AM - 10:30 AM', activity: '📖 Integrated Literacy & Guided Reading' },
  { id: 'k2_b3', label: 'Block 3', time: '10:30 AM - 11:30 AM', activity: '🥪 Lunch Break', isLunch: true },
  { id: 'k2_b4', label: 'Block 4', time: '11:30 AM - 1:00 PM', activity: '🔢 Math Centers & Hands-on Numeracy' },
  { id: 'k2_b5', label: 'Block 5', time: '1:00 PM - 1:45 PM', activity: '🎨 Inquiry Exploration (Sci/Social Studies)' },
  { id: 'k2_b6', label: 'Block 6', time: '1:45 PM - 2:00 PM', activity: '🎒 Reflection Circle & Dismissal Pack-Up' }
];

const UPPER_ELEM_BLOCKS = [
  { id: 'ue_b1', label: 'Period 1', time: '8:00 AM - 9:30 AM', type: 'session1' },
  { id: 'ue_b2', label: 'Period 2', time: '9:30 AM - 11:00 AM', type: 'session2' },
  { id: 'ue_b3', label: 'Lunch Block', time: '11:00 AM - 11:45 AM', type: 'lunch' },
  { id: 'ue_b4', label: 'Period 3', time: '11:45 AM - 1:15 PM', type: 'session3' },
  { id: 'ue_b5', label: 'Prep Block', time: '1:15 PM - 2:00 PM', type: 'prep' }
];

export default function ElementarySchoolScheduleStep({ elementaryGrade, onLaunchGame, onBack, styles }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  
  const isLowerElem = elementaryGrade === 0 || elementaryGrade === 1 || elementaryGrade === 2;
  const displayGradeName = elementaryGrade === 0 ? 'Kindergarten' : `Grade ${elementaryGrade}`;

  const currentSubject = useMemo(() => {
    return ELEMENTARY_SUBJECTS.find(s => s.id === selectedSubjectId) || null;
  }, [selectedSubjectId]);

  const lunchWaveAssignments = useMemo(() => {
    const waveDefinitions = [
      { wave: 'Wave A (Early)', time: '10:30 AM - 11:00 AM' },
      { wave: 'Wave B (Mid)', time: '11:00 AM - 11:30 AM' },
      { wave: 'Wave C (Late)', time: '11:30 AM - 12:00 PM' }
    ];
    return {
      Kindergarten: { wave: waveDefinitions[0].wave, time: '10:30 AM - 11:00 AM', fandom: FANDOMS[0] },
      'Grade 1': { wave: waveDefinitions[0].wave, time: '10:30 AM - 11:00 AM', fandom: FANDOMS[1] },
      'Grade 2': { wave: waveDefinitions[1].wave, time: '11:00 AM - 11:30 AM', fandom: FANDOMS[2] },
      'Grade 3': { wave: waveDefinitions[1].wave, time: '11:00 AM - 11:30 AM', fandom: FANDOMS[3] },
      'Grade 4': { wave: waveDefinitions[2].wave, time: '11:30 AM - 12:00 PM', fandom: FANDOMS[4] },
      'Grade 5': { wave: waveDefinitions[2].wave, time: '11:30 AM - 12:00 PM', fandom: FANDOMS[5] }
    };
  }, []);

  const currentLunchSetup = lunchWaveAssignments[displayGradeName];

  const scheduleRows = useMemo(() => {
    if (isLowerElem) {
      return K2_BLOCKS.map(block => {
        if (block.isLunch) {
          return {
            time: currentLunchSetup.time,
            label: `${block.label} [${currentLunchSetup.wave}]`,
            display: `🥪 Lunch — Paired Fandom: 🎮 ${currentLunchSetup.fandom} (Locked)`,
            isSpecial: true
          };
        }
        return { time: block.time, label: block.label, display: block.activity, isSpecial: block.id === 'k2_b6' };
      });
    } else {
      if (!currentSubject) return [];
      let baseSectionNum = 301 + (elementaryGrade - 3) * 100;
      return UPPER_ELEM_BLOCKS.map(block => {
        if (block.type === 'lunch') {
          return { time: block.time, label: `${block.label} [${currentLunchSetup.wave}]`, display: `🥪 Lunch — Paired Fandom: 🎮 ${currentLunchSetup.fandom} (Locked)`, isSpecial: true };
        }
        if (block.type === 'prep') {
          return { time: block.time, label: block.label, display: '☕ Teacher Planning & Prep Block', isSpecial: true };
        }
        let sessionIndex = block.type === 'session1' ? 0 : block.type === 'session2' ? 1 : 2;
        return { time: block.time, label: block.label, display: `${currentSubject.course} - Section #${baseSectionNum + sessionIndex}`, isSpecial: false };
      });
    }
  }, [isLowerElem, currentSubject, elementaryGrade, currentLunchSetup, displayGradeName]);

  const alertStyle = {
    backgroundColor: '#221c11',
    border: '1px solid #ff9f43',
    borderRadius: '6px',
    padding: '12px',
    color: '#ecc9a8',
    fontSize: '0.85rem',
    marginBottom: '20px',
    textAlign: 'left'
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
      <p style={styles.subtitle}>{displayGradeName} ({isLowerElem ? 'Self-Contained' : 'Departmentalized Core Rotation'})</p>

      <div style={alertStyle}>
        🔑 <strong>Annual Schedule Lock:</strong> permanently paired with <strong>{currentLunchSetup.fandom}</strong> for <strong>{currentLunchSetup.wave}</strong>.
      </div>

      <div style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '8px', color: '#888' }}>BLOCK / TIME</th>
              <th style={{ padding: '8px', color: '#39FF14' }}>ASSIGNMENT ACTIVITY</th>
            </tr>
          </thead>
          <tbody>
            {scheduleRows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #222', backgroundColor: row.isSpecial ? '#1b1b1b' : 'transparent' }}>
                <td style={{ padding: '10px 8px', borderRight: '1px solid #222', width: '30%' }}>
                  <div style={{ fontWeight: 'bold' }}>{row.label}</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{row.time}</div>
                </td>
                <td style={{ padding: '10px 8px', color: row.isSpecial ? '#ff9f43' : '#fff' }}>{row.display}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', gap: '15px', maxWidth: '550px', margin: '0 auto' }}>
        <button style={{ ...styles.exitButton, flex: 1 }} onClick={isLowerElem ? onBack : () => setSelectedSubjectId(null)}>← BACK</button>
        <button style={{ ...styles.actionButton, flex: 2 }} onClick={() => onLaunchGame({ gradeType: isLowerElem ? 'Self-Contained' : 'Departmentalized', lunchWave: currentLunchSetup })}>
          🚀 FINALIZE SCHEDULE
        </button>
      </div>
    </div>
  );
}