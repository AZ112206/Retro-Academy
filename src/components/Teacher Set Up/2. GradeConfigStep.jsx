import React from 'react';

export default function GradeConfigStep({ schoolType, stateVars, stateSetters, onNext, onBack, styles }) {
  const { middleGrade, middleLunchWave, elementaryGrade } = stateVars;
  const { setElementaryGrade, setMiddleGrade, setMiddleLunchWave } = stateSetters;

  const getGradeOptions = () => {
    if (schoolType === 'Elementary') return [0, 1, 2, 3, 4, 5];
    if (schoolType === 'Middle') return [6, 7, 8];
    return [];
  };

  const handleMiddleGradeSelect = (num) => {
    setMiddleGrade(num);
    if (num === 6) setMiddleLunchWave('Wave A (Early)');
    if (num === 7) setMiddleLunchWave('Wave B (Mid)');
    if (num === 8) setMiddleLunchWave('Wave C (Late)');
  };

  const localStyles = {
    container: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' },
    infoCallout: {
      marginTop: '20px',
      backgroundColor: '#222',
      padding: '15px',
      borderRadius: '5px',
      border: '1px dashed #39FF14',
      width: '100%',
      maxWidth: '500px',
      boxSizing: 'border-box',
      textAlign: 'left'
    },
    buttonGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '10px',
      width: '100%',
      maxWidth: '500px'
    }
  };

  return (
    <div style={styles.setupBox}>
      <div style={localStyles.container}>
        <h2 style={styles.heading}>{schoolType.toUpperCase()} CONFIGURATION</h2>
        
        {schoolType === 'Elementary' && (
          <div style={localStyles.container}>
            <p style={styles.subtitle}>Select your assigned grade level:</p>
            <div style={{ ...styles.menuColumn, maxWidth: '500px' }}>
              {getGradeOptions().map(num => (
                <button 
                  key={num} 
                  style={{ 
                    ...styles.menuButton, 
                    textAlign: 'center',
                    borderColor: elementaryGrade === num ? '#fff' : '#39FF14',
                    backgroundColor: elementaryGrade === num ? '#2d2d2d' : '#222',
                    color: elementaryGrade === num ? '#fff' : '#39FF14'
                  }} 
                  onClick={() => setElementaryGrade(num)}
                >
                  ✏️ {num === 0 ? 'Kindergarten' : `Grade ${num}`} {num <= 2 ? '(General Core Block)' : '(Subject Specialist)'}
                </button>
              ))}
            </div>
            <button 
              style={{ ...styles.actionButton, marginTop: '25px', maxWidth: '500px', opacity: elementaryGrade === null ? 0.5 : 1 }}
              disabled={elementaryGrade === null}
              onClick={onNext}
            >
              NEXT: GENERATE SCHEDULE ➡️
            </button>
          </div>
        )}

        {schoolType === 'Middle' && (
          <div style={localStyles.container}>
            <p style={styles.subtitle}>Select middle grade level track allocation:</p>
            <div style={localStyles.buttonGrid}>
              {getGradeOptions().map(num => (
                <button 
                  key={num} 
                  style={{ 
                    ...styles.menuButton, 
                    textAlign: 'center',
                    borderColor: middleGrade === num ? '#fff' : '#39FF14',
                    backgroundColor: middleGrade === num ? '#2d2d2d' : '#222',
                    color: middleGrade === num ? '#fff' : '#39FF14'
                  }} 
                  onClick={() => handleMiddleGradeSelect(num)}
                >
                  {num}th Grade
                </button>
              ))}
            </div>
            
            {middleGrade && (
              <div style={localStyles.infoCallout}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 8px 0', color: '#39FF14' }}>📋 Automated Track Profile</h3>
                <p style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '0.85rem' }}>
                  Courses: {middleGrade === 8 ? 'Spanish, ELA, Math, Science, Social Studies' : 'Reading, ELA, Math, Science, Social Studies'}
                </p>
                <p style={{ margin: 0, color: '#ff9f43', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  Lunch Wave: {middleLunchWave}
                </p>
              </div>
            )}
            
            <button 
              style={{ ...styles.actionButton, marginTop: '25px', maxWidth: '500px', opacity: !middleGrade ? 0.5 : 1 }}
              disabled={!middleGrade}
              onClick={onNext}
            >
              NEXT: GENERATE SCHEDULE ➡️
            </button>
          </div>
        )}

        <button style={{ ...styles.exitButton, marginTop: '20px', width: '100%', maxWidth: '500px' }} onClick={onBack}>
          ← BACK
        </button>
      </div>
    </div>
  );
}