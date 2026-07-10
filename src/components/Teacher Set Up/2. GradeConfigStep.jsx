import React from 'react';

export default function GradeConfigStep({ 
  schoolType, 
  stateVars, 
  stateSetters, 
  onNext, 
  onBack, 
  styles 
}) {
  const { middleGrade, middleLunchWave } = stateVars;
  const { setElementaryGrade, setMiddleGrade, setMiddleLunchWave } = stateSetters;

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

        <button style={{ ...styles.exitButton, marginTop: '30px', width: '100%', maxWidth: '500px' }} onClick={onBack}>
          ← BACK
        </button>
      </div>
    </div>
  );
}