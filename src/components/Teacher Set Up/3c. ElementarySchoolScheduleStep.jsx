import React, { useState, useMemo } from 'react';

// Unified subjects matching ClassSelectionStep.jsx schema
const ELEMENTARY_SUBJECTS = [
  { id: 'elem_ela', name: '📚 Reading & ELA', course: 'Language Arts & Reading' },
  { id: 'elem_math', name: '📐 Mathematics', course: 'Elementary Math Focus' },
  { id: 'elem_sci_ss', name: '🌍 Science & Social Studies', course: 'Integrated Science/SS' }
];

// Available Retro Academy Fandoms for Lunch Wave Pairings
const FANDOMS = ['Retro Gamers', 'Card Battlers', 'Mecha Pilots', 'Synthwave Kids', 'Pixel Artists', 'Comic Club'];

// Time schedule blocks spanning 8:00 AM to 2:00 PM
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

export default function ElementarySchoolScheduleStep({
  elementaryGrade, // Expected values: 0 (for Kindergarten), 1, 2, 3, 4, 5
  onLaunchGame,
  onBack,
  styles = {}
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  
  // Resolve 0 or undefined as Kindergarten
  const isKindergarten = elementaryGrade === 0 || !elementaryGrade;
  const isLowerElem = isKindergarten || elementaryGrade === 1 || elementaryGrade === 2;
  const displayGradeName = isKindergarten ? 'Kindergarten' : `Grade ${elementaryGrade}`;

  const currentSubject = useMemo(() => {
    return ELEMENTARY_SUBJECTS.find(s => s.id === selectedSubjectId) || null;
  }, [selectedSubjectId]);

  // Generate permanent, deterministic Lunch Wave Pairings matched to Fandoms for the school year
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

  // Build the complete schedule array dynamically
  const scheduleRows = useMemo(() => {
    if (isLowerElem) {
      // Kindergarten & Grades 1-2: Self-contained layout with locked wave details injection
      return K2_BLOCKS.map(block => {
        if (block.isLunch) {
          return {
            time: currentLunchSetup.time,
            label: `${block.label} [${currentLunchSetup.wave}]`,
            display: `🥪 Lunch & Recess Break — Paired Fandom: 🎮 ${currentLunchSetup.fandom} (Locked)`,
            isSpecial: true
          };
        }
        return {
          time: block.time,
          label: block.label,
          display: block.activity,
          isSpecial: block.id === 'k2_b6'
        };
      });
    } else {
      // Grades 3-5: Departmentalized setup
      if (!currentSubject) return [];
      
      let baseSectionNum = 301 + (elementaryGrade - 3) * 100;
      
      return UPPER_ELEM_BLOCKS.map(block => {
        if (block.type === 'lunch') {
          return { 
            time: block.time, 
            label: `${block.label} [${currentLunchSetup.wave}]`, 
            display: `🥪 Departmental Lunch Intermission — Paired Fandom: 🎮 ${currentLunchSetup.fandom} (Locked)`, 
            isSpecial: true 
          };
        }
        if (block.type === 'prep') {
          return { time: block.time, label: block.label, display: '☕ Teacher Planning & Prep Block', isSpecial: true };
        }
        
        let sessionIndex = block.type === 'session1' ? 0 : block.type === 'session2' ? 1 : 2;
        return {
          time: block.time,
          label: block.label,
          display: `${currentSubject.course} - Section #${baseSectionNum + sessionIndex}`,
          isSpecial: false
        };
      });
    }
  }, [isLowerElem, currentSubject, elementaryGrade, currentLunchSetup, displayGradeName]);

  return (
    <div style={{ ...defaultStyles.setupBox, ...styles.setupBox }}>
      <h2 style={{ ...defaultStyles.header, ...styles.header }}>
        🍎 Elementary School Schedule Configuration
      </h2>
      <p style={{ ...defaultStyles.subtitle, ...styles.subtitle }}>
        Grade Level: <strong>{displayGradeName}</strong> ({isLowerElem ? 'Self-Contained Single Classroom' : 'Departmentalized Core Rotation'})
      </p>

      {/* Permanent Structural Wave Info Alert Box */}
      <div style={defaultStyles.waveAlert}>
        🔑 <strong>Annual Schedule Lock:</strong> {displayGradeName} is permanently paired with 
        <strong> {currentLunchSetup.fandom}</strong> for <strong>{currentLunchSetup.wave}</strong>. This assignment cannot be modified during the academic year.
      </div>

      {/* Subject Selector for Grades 3-5 */}
      {!isLowerElem && !currentSubject && (
        <div style={defaultStyles.selectionPrompt}>
          <p style={{ marginBottom: '15px', color: '#ccc' }}>
            Select your specialized teaching core domain for this grade level rotation:
          </p>
          <div style={defaultStyles.buttonGrid}>
            {ELEMENTARY_SUBJECTS.map(subj => (
              <button
                key={subj.id}
                onClick={() => setSelectedSubjectId(subj.id)}
                style={defaultStyles.subjectButton}
              >
                {subj.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Master Preview Render */}
      {(isLowerElem || currentSubject) && (
        <div style={defaultStyles.scheduleContainer}>
          <h3 style={defaultStyles.previewTitle}>📅 Active Daily Master Schedule Preview</h3>
          <div style={defaultStyles.table}>
            <div style={defaultStyles.tableHeader}>
              <div style={{ ...defaultStyles.cell, flex: 1.2 }}>Time Frame</div>
              <div style={{ ...defaultStyles.cell, flex: 1.2 }}>Block / Wave</div>
              <div style={{ ...defaultStyles.cell, flex: 3 }}>Scheduled Activity / Assignment</div>
            </div>
            {scheduleRows.map((row, idx) => (
              <div 
                key={idx} 
                style={{
                  ...defaultStyles.tableRow,
                  backgroundColor: row.isSpecial ? '#1b1b1b' : '#222',
                  borderLeft: row.isSpecial ? '4px solid #ff9f43' : '4px solid #39FF14'
                }}
              >
                <div style={{ ...defaultStyles.cell, flex: 1.2, color: '#aaa', fontSize: '0.9rem' }}>{row.time}</div>
                <div style={{ ...defaultStyles.cell, flex: 1.2, fontWeight: 'bold' }}>{row.label}</div>
                <div style={{ ...defaultStyles.cell, flex: 3, color: row.isSpecial ? '#ff9f43' : '#fff' }}>{row.display}</div>
              </div>
            ))}
          </div>

          <div style={defaultStyles.actionRow}>
            <button onClick={onBack} style={{ ...defaultStyles.btn, ...defaultStyles.btnBack }}>
              ⬅ Back
            </button>
            <button 
              onClick={() => onLaunchGame({ scheduleRows, gradeType: isLowerElem ? 'Self-Contained' : 'Departmentalized', lunchWave: currentLunchSetup })} 
              style={{ ...defaultStyles.btn, ...defaultStyles.btnLaunch }}
            >
              🚀 Finalize & Launch Game
            </button>
          </div>
        </div>
      )}

      {isLowerElem && (
        <div style={defaultStyles.actionRowAlone}>
          <button onClick={onBack} style={{ ...defaultStyles.btn, ...defaultStyles.btnBack }}>
            ⬅ Back
          </button>
        </div>
      )}
    </div>
  );
}

const defaultStyles = {
  setupBox: {
    backgroundColor: '#171717',
    border: '1px solid #39FF14',
    borderRadius: '12px',
    padding: '24px',
    maxWidth: '750px',
    margin: '0 auto',
    boxShadow: '0 0 15px rgba(57, 255, 20, 0.15)',
    fontFamily: 'monospace'
  },
  header: {
    color: '#39FF14',
    marginTop: 0,
    marginBottom: '8px',
    fontSize: '1.4rem'
  },
  subtitle: {
    color: '#fff',
    fontSize: '1rem',
    marginBottom: '16px',
    paddingBottom: '12px'
  },
  waveAlert: {
    backgroundColor: '#221c11',
    border: '1px solid #ff9f43',
    borderRadius: '6px',
    padding: '12px',
    color: '#ecc9a8',
    fontSize: '0.9rem',
    marginBottom: '24px',
    lineHeight: '1.4'
  },
  selectionPrompt: {
    padding: '16px',
    backgroundColor: '#222',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  buttonGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  subjectButton: {
    flex: '1 1 200px',
    backgroundColor: '#171717',
    border: '1px solid #39FF14',
    color: '#fff',
    padding: '14px',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.95rem',
    fontFamily: 'monospace'
  },
  scheduleContainer: {
    marginTop: '10px'
  },
  previewTitle: {
    color: '#999',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '10px'
  },
  table: {
    border: '1px solid #333',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '24px'
  },
  tableHeader: {
    display: 'flex',
    backgroundColor: '#2d2d2d',
    color: '#39FF14',
    fontWeight: 'bold',
    borderBottom: '1px solid #444'
  },
  tableRow: {
    display: 'flex',
    borderBottom: '1px solid #333',
    alignItems: 'center'
  },
  cell: {
    padding: '12px'
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px'
  },
  actionRowAlone: {
    display: 'flex',
    marginTop: '20px'
  },
  btn: {
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    fontFamily: 'monospace',
    border: 'none'
  },
  btnBack: {
    backgroundColor: '#333',
    color: '#fff'
  },
  btnLaunch: {
    backgroundColor: '#39FF14',
    color: '#000',
    boxShadow: '0 0 10px rgba(57, 255, 20, 0.4)'
  }
};