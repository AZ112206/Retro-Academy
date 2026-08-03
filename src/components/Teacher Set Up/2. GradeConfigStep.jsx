import React from 'react';
import RetroIcon, { RetroArrow } from '../RetroIcon';

export default function GradeConfigStep({ schoolType, stateVars, stateSetters, onNext, onBack, onExit, onSaveGame, styles }) {
  const { middleGrade, middleLunchWave, elementaryGrade, highGrade, highLetterRange } = stateVars;
  const { setElementaryGrade, setMiddleGrade, setMiddleLunchWave, setHighGrade, setHighLetterRange } = stateSetters;
  const highLetterRanges = ['A-E', 'F-J', 'K-O', 'P-T', 'U-Z'];

  const getGradeOptions = () => {
    if (schoolType === 'Elementary') return [0, 1, 2, 3, 4, 5];
    if (schoolType === 'Middle') return [6, 7, 8];
    if (schoolType === 'High') return [9, 10, 11, 12];
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
      textAlign: 'center'
    },
    buttonColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      width: '100%',
      maxWidth: '500px'
    }
  };

  const renderGradeButtonLabel = (num) => {
    if (schoolType === 'Elementary') {
      return num === 0 ? 'Kindergarten' : `Grade ${num}`;
    }
    return `Grade ${num}`;
  };

  const renderGradeButtonSubtext = (num) => {
    if (schoolType === 'Elementary') {
      return num <= 2 ? 'General Core Block / Homeroom' : 'Departmental Subject Rotation';
    }
    if (schoolType === 'Middle') {
      return num === 8
        ? 'Spanish, ELA, Math, Science, Social Studies'
        : 'Reading, ELA, Math, Science, Social Studies';
    }
    if (schoolType === 'High') {
      return `${num}th Grade homeroom/advisory track with department course scheduling`;
    }
    return '';
  };

  const isGradeSelected = schoolType === 'Elementary'
    ? elementaryGrade !== null
    : schoolType === 'Middle'
    ? middleGrade !== null
    : highGrade !== null;

  const isNextDisabled = schoolType === 'High'
    ? !(highGrade !== null && highLetterRange)
    : schoolType === 'Middle'
    ? !middleGrade
    : elementaryGrade === null;

  return (
    <div style={styles.setupBox}>
      <div style={localStyles.container}>
        <h2 style={styles.heading}>{schoolType.toUpperCase()} CONFIGURATION</h2>
        
        <div style={localStyles.container}>
          <p style={styles.subtitle}>
            {schoolType === 'Elementary'
              ? 'Select your assigned grade level:'
              : schoolType === 'Middle'
              ? 'Select middle grade level track allocation:'
              : 'Select your high school grade assignment, then choose the alphabetical homeroom range:'}
          </p>

          <div style={localStyles.buttonColumn}>
            {getGradeOptions().map((num) => {
              const isSelected = schoolType === 'Elementary'
                ? elementaryGrade === num
                : schoolType === 'Middle'
                ? middleGrade === num
                : highGrade === num;

              return (
                <button
                  key={num}
                  style={{
                    ...styles.menuButton,
                    textAlign: 'center',
                    borderColor: isSelected ? '#fff' : '#39FF14',
                    backgroundColor: isSelected ? '#2d2d2d' : '#222',
                    color: isSelected ? '#fff' : '#39FF14'
                  }}
                  onClick={() => {
                    if (schoolType === 'Elementary') setElementaryGrade(num);
                    if (schoolType === 'Middle') handleMiddleGradeSelect(num);
                    if (schoolType === 'High') setHighGrade(num);
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind={schoolType === 'High' ? 'cap' : schoolType === 'Middle' ? 'school' : 'pencil'} /> {renderGradeButtonLabel(num)}</span>
                  <span style={{ fontSize: '0.8rem', color: isSelected ? '#d7d7d7' : '#888', marginTop: '4px' }}>{renderGradeButtonSubtext(num)}</span>
                </button>
              );
            })}
          </div>

          {schoolType === 'Middle' && middleGrade && (
            <div style={localStyles.infoCallout}>
              <h3 style={{ fontSize: '1rem', margin: '0 0 8px 0', color: '#39FF14', display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="contract" /> Automated Track Profile</h3>
              <p style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '0.85rem' }}>
                Courses: {middleGrade === 8 ? 'Spanish, ELA, Math, Science, Social Studies' : 'Reading, ELA, Math, Science, Social Studies'}
              </p>
              <p style={{ margin: 0, color: '#ff9f43', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Lunch Wave: {middleLunchWave}
              </p>
            </div>
          )}

          {schoolType === 'High' && highGrade !== null && (
            <div style={{ ...localStyles.infoCallout, maxWidth: '500px' }}>
              <h3 style={{ fontSize: '1rem', margin: '0 0 10px 0', color: '#39FF14', display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="student" /> Homeroom Alphabet Range</h3>
              <div style={localStyles.buttonColumn}>
                {highLetterRanges.map((rangeLabel) => {
                  const isSelected = highLetterRange === rangeLabel;
                  return (
                    <button
                      key={rangeLabel}
                      style={{
                        ...styles.menuButton,
                        textAlign: 'center',
                        borderColor: isSelected ? '#fff' : '#39FF14',
                        backgroundColor: isSelected ? '#2d2d2d' : '#222',
                        color: isSelected ? '#fff' : '#39FF14'
                      }}
                      onClick={() => setHighLetterRange(rangeLabel)}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="book" /> {rangeLabel}</span>
                      <span style={{ fontSize: '0.8rem', color: isSelected ? '#d7d7d7' : '#888', marginTop: '4px' }}>Homeroom and advisory roster range</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            style={{ ...styles.actionButton, marginTop: '25px', maxWidth: '500px', opacity: isNextDisabled ? 0.5 : 1 }}
            disabled={isNextDisabled}
            onClick={onNext}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              {schoolType === 'Elementary'
                ? (elementaryGrade >= 3 ? 'SELECT SUBJECT' : 'GENERATE SCHEDULE')
                : schoolType === 'Middle'
                ? 'SELECT SUBJECT'
                : 'SELECT DEPARTMENT'} <RetroArrow color="#0a0a0a" />
            </span>
          </button>
        </div>

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 220px' }} onClick={onBack}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span>
          </button>
          <button style={{ ...styles.exitButton, flex: '1 1 220px' }} onClick={onExit}>
            RETURN TO MAIN MENU
          </button>
          <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>
            SAVE GAME
          </button>
        </div>
      </div>
    </div>
  );
}