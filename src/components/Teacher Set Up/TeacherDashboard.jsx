import React, { useState } from 'react';
import SchoolTypeStep from './1. SchoolTypeStep';
import GradeConfigStep from './GradeConfigStep';
import ClassSelectionStep from './ClassSelectionStep';
import HighSchoolScheduleStep from './HighSchoolScheduleStep';
import MiddleSchoolScheduleStep from './MiddleSchoolScheduleStep';

export default function TeacherDashboard({ onExit }) {
  const [phase, setPhase] = useState('SCHOOL_TYPE');
  const [schoolType, setSchoolType] = useState(null);
  const [elementaryGrade, setElementaryGrade] = useState(null);
  const [middleGrade, setMiddleGrade] = useState(null);
  const [middleLunchWave, setMiddleLunchWave] = useState(null);
  const [highSchoolSchedule, setHighSchoolSchedule] = useState([
    { period: 1, grade: '9th', level: 'Standard', isLongBlock: true },
    { period: 2, grade: '10th', level: 'Standard', isLongBlock: false },
    { period: 3, grade: '11th', level: 'Honors', isLongBlock: true },
    { period: 4, grade: '12th', level: 'Advanced', isLongBlock: false },
  ]);
  const [highSchoolLunchWave, setHighSchoolLunchWave] = useState(null);
  const [chosenClass, setChosenClass] = useState(null);

  const renderCentered = (content) => <div style={styles.container}>{content}</div>;

  if (phase === 'SCHOOL_TYPE') {
    return renderCentered(
      <SchoolTypeStep
        onSelect={(type) => {
          setSchoolType(type);
          if (type === 'High') setPhase('HIGH_SCHOOL_CONFIG');
          else setPhase('GRADE_CONFIG');
        }}
        onExit={onExit}
        styles={styles}
      />
    );
  }

  if (phase === 'GRADE_CONFIG') {
    return renderCentered(
      <GradeConfigStep
        schoolType={schoolType}
        stateVars={{ elementaryGrade, middleGrade, middleLunchWave, highSchoolSchedule, highSchoolLunchWave }}
        stateSetters={{ setElementaryGrade, setMiddleGrade, setMiddleLunchWave, setHighSchoolSchedule, setHighSchoolLunchWave }}
        onNext={() => setPhase(schoolType === 'Middle' ? 'MIDDLE_SCHEDULE' : 'CLASS_SELECT')}
        onBack={() => setPhase('SCHOOL_TYPE')}
        styles={styles}
      />
    );
  }

  if (phase === 'MIDDLE_SCHEDULE') {
    return renderCentered(
      <MiddleSchoolScheduleStep
        middleGrade={middleGrade}
        middleLunchWave={middleLunchWave}
        onLaunchGame={(config) => {
          if (config?.wave) setMiddleLunchWave(config.wave);
          setPhase('CLASS_SELECT');
        }}
        onBack={() => setPhase('GRADE_CONFIG')}
        styles={styles}
      />
    );
  }

  if (phase === 'HIGH_SCHOOL_CONFIG') {
    return renderCentered(
      <HighSchoolScheduleStep
        onLaunchGame={(config) => {
          setChosenClass({ id: 'high_matrix', name: `${config.selectedDept.toUpperCase()} Department` });
          setHighSchoolLunchWave(config.randomLunchWave);
          setPhase('GAMEPLAY');
        }}
        onBack={() => setPhase('SCHOOL_TYPE')}
        styles={styles}
      />
    );
  }

  if (phase === 'CLASS_SELECT') {
    return renderCentered(
      <ClassSelectionStep
        schoolType={schoolType}
        elementaryGrade={elementaryGrade}
        middleGrade={middleGrade}
        onSelectClass={(course) => {
          setChosenClass(course);
          setPhase('GAMEPLAY');
        }}
        onBack={() => setPhase(schoolType === 'Middle' ? 'MIDDLE_SCHEDULE' : 'GRADE_CONFIG')}
        styles={styles}
      />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.setupBox}>
        <h2 style={styles.heading}>CLASSROOM READY</h2>
        <p style={styles.subtitle}>Role and track selection is complete.</p>
        <p style={{ margin: '0 0 8px 0' }}>
          School Type: <strong>{schoolType}</strong>
        </p>
        <p style={{ margin: '0 0 8px 0' }}>
          Course: <strong>{chosenClass?.name || 'N/A'}</strong>
        </p>
        {highSchoolLunchWave && (
          <p style={{ margin: '0 0 20px 0' }}>
            Lunch Wave: <strong>{highSchoolLunchWave}</strong>
          </p>
        )}
        <button style={styles.exitButton} onClick={onExit}>RETURN TO MAIN MENU</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#121212',
    color: '#39FF14',
    fontFamily: '"Courier New", Courier, monospace',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  setupBox: {
    textAlign: 'center',
    border: '3px solid #39FF14',
    padding: '40px',
    borderRadius: '10px',
    backgroundColor: '#1a1a1a',
    maxWidth: '750px',
    width: '100%',
    boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)'
  },
  heading: { fontSize: '1.8rem', marginBottom: '10px' },
  subtitle: { color: '#888', marginBottom: '25px' },
  menuColumn: { display: 'flex', flexDirection: 'column', gap: '15px' },
  menuButton: {
    backgroundColor: '#222',
    color: '#39FF14',
    border: '2px solid #39FF14',
    padding: '15px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: '5px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column'
  },
  subtext: { fontSize: '0.8rem', color: '#888', marginTop: '4px' },
  actionButton: {
    width: '100%',
    backgroundColor: '#39FF14',
    color: '#000',
    border: 'none',
    padding: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: '4px'
  },
  exitButton: {
    backgroundColor: 'transparent',
    color: '#FF3333',
    border: '2px solid #FF3333',
    padding: '8px 16px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 'bold'
  },
  matrixBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: '1px solid #39FF14',
    borderRadius: '8px',
    padding: '12px',
    backgroundColor: '#111'
  },
  matrixRow: {
    display: 'grid',
    gridTemplateColumns: '64px 1fr 1fr auto',
    gap: '8px',
    alignItems: 'center'
  },
  selectInput: {
    backgroundColor: '#222',
    color: '#39FF14',
    border: '1px solid #39FF14',
    borderRadius: '4px',
    padding: '8px',
    fontFamily: 'inherit'
  },
  toggleOn: {
    backgroundColor: '#39FF14',
    color: '#000',
    border: '1px solid #39FF14',
    borderRadius: '4px',
    padding: '8px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  toggleOff: {
    backgroundColor: '#222',
    color: '#39FF14',
    border: '1px solid #39FF14',
    borderRadius: '4px',
    padding: '8px 10px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  }
};