import React from 'react';

export default function GradeConfigStep({ 
  schoolType, 
  stateVars, 
  stateSetters, 
  onNext, 
  onBack, 
  styles 
}) {
  const { elementaryGrade, middleGrade, middleLunchWave, highSchoolSchedule, highSchoolLunchWave } = stateVars;
  const { setElementaryGrade, setMiddleGrade, setMiddleLunchWave, setHighSchoolSchedule, setHighSchoolLunchWave } = stateSetters;

  const getGradeOptions = () => {
    if (schoolType === 'Elementary') return [1, 2, 3, 4, 5];
    if (schoolType === 'Middle') return [6, 7, 8];
    return [];
  };

  // Middle School automation mapping
  const handleMiddleGradeSelect = (num) => {
    setMiddleGrade(num);
    if (num === 6) setMiddleLunchWave('Wave A (Early)');
    if (num === 7) setMiddleLunchWave('Wave B (Mid)');
    if (num === 8) setMiddleLunchWave('Wave C (Late)');
  };

  // Shared internal layout overrides to force perfect absolute alignment and centering
  const designStyles = {
    panelContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      textAlign: 'center'
    },
    infoCallout: {
      marginTop: '20px',
      backgroundColor: '#222',
      padding: '15px',
      borderRadius: '5px',
      border: '1px dashed #39FF14',
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box'
    },
    centeredButtonRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      width: '100%',
      maxWidth: '500px'
    }
  };

  return (
    <div style={styles.setupBox}>
      <div style={designStyles.panelContainer}>
        <h2 style={styles.heading}>{schoolType.toUpperCase()} SCHOOL CONFIGURATION</h2>
        
        {/* ELEMENTARY PANEL */}
        {schoolType === 'Elementary' && (
          <div style={designStyles.panelContainer}>
            <p style={styles.subtitle}>Select your assigned grade level:</p>
            <div style={{ ...styles.menuColumn, width: '100%', maxWidth: '500px' }}>
              {getGradeOptions().map(num => (
                <button key={num} style={{ ...styles.menuButton, textAlign: 'center' }} onClick={() => {
                  setElementaryGrade(num);
                  onNext();
                }}>
                  ✏️ Grade {num} {num <= 2 ? '(General Classroom Teacher)' : '(Subject Specialist)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MIDDLE SCHOOL PANEL */}
        {schoolType === 'Middle' && (
          <div style={designStyles.panelContainer}>
            <p style={styles.subtitle}>Select your grade level. Lunch waves are strictly locked based on grade tracks.</p>
            
            <div style={{ ...styles.menuColumn, width: '100%', maxWidth: '500px' }}>
              <div style={designStyles.centeredButtonRow}>
                {getGradeOptions().map(num => (
                  <button key={num} style={{ ...styles.menuButton, flex: 1, textAlign: 'center' }} onClick={() => handleMiddleGradeSelect(num)}>
                    {middleGrade === num ? `✅ ${num}th Grade` : `${num}th Grade`}
                  </button>
                ))}
              </div>
              
              {middleGrade && (
                <div style={designStyles.infoCallout}>
                  <h3 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#39FF14' }}>📋 Assigned Track Profile</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.9rem' }}>
                    Available: {middleGrade === 8 ? 'Spanish, ELA, Math, Science, and Social Studies' : 'Reading, ELA, Math, Science, and Social Studies'} {middleGrade === 8 && "(+ Foreign Language Upgrade)"}
                  </p>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.85rem' }}>
                    Lunch Status: Locked to <strong>{middleLunchWave}</strong>
                  </p>
                </div>
              )}

              <button 
                style={{ ...styles.actionButton, marginTop: '20px', opacity: !middleGrade ? 0.5 : 1 }} 
                disabled={!middleGrade}
                onClick={onNext}
              >
                NEXT STEP: DESIGN CLASSES ➡️
              </button>
            </div>
          </div>
        )}

        {/* HIGH SCHOOL PANEL */}
        {schoolType === 'High' && (
          <div style={designStyles.panelContainer}>
            <p style={styles.subtitle}>Configure your 4-Block Schedule. Assign any class type to any block slot.</p>
            <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '20px' }}>⚠️ Note: Your designated Lunch Wave will be randomly assigned by administration upon arrival.</p>
            
            <div style={{ ...styles.matrixBox, width: '100%', maxWidth: '500px', boxSizing: 'border-box' }}>
              {highSchoolSchedule.map((p, idx) => (
                <div key={p.period} style={styles.matrixRow}>
                  <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>B-{p.period}:</span>
                  
                  <select value={p.grade} onChange={(e) => {
                    const updated = [...highSchoolSchedule];
                    updated[idx].grade = e.target.value;
                    setHighSchoolSchedule(updated);
                  }} style={styles.selectInput}>
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                  </select>

                  <select value={p.level} onChange={(e) => {
                    const updated = [...highSchoolSchedule];
                    updated[idx].level = e.target.value;
                    setHighSchoolSchedule(updated);
                  }} style={styles.selectInput}>
                    <option value="Standard">Standard</option>
                    <option value="Honors">Honors</option>
                    <option value="Advanced">Advanced</option>
                  </select>

                  <button style={p.isLongBlock ? styles.toggleOn : styles.toggleOff} onClick={() => {
                    const updated = [...highSchoolSchedule];
                    updated[idx].isLongBlock = !updated[idx].isLongBlock;
                    setHighSchoolSchedule(updated);
                  }}>
                    {p.isLongBlock ? '⏱️ Long' : '⚡ Short'}
                  </button>
                </div>
              ))}
            </div>

            <button 
              style={{ ...styles.actionButton, marginTop: '20px', width: '100%', maxWidth: '500px' }}
              onClick={() => {
                const randomWave = `Wave ${Math.floor(Math.random() * 4) + 1}`;
                setHighSchoolLunchWave(randomWave);
                onNext();
              }}
            >
              🚀 LOCK SCHEDULE MATRIX & START GAME
            </button>
          </div>
        )}

        <button style={{ ...styles.exitButton, marginTop: '30px', width: '100%', maxWidth: '500px' }} onClick={onBack}>
          ← BACK
        </button>
      </div>
    </div>
  );
}