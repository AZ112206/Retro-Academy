import React, { useEffect, useState } from 'react';
import SchoolTypeStep from './1. SchoolTypeStep.jsx';
import GradeConfigStep from './2. GradeConfigStep.jsx';
import HighSchoolScheduleStep from './3b. HighSchoolScheduleStep.jsx';
import MiddleSchoolScheduleStep from './3a. MiddleSchoolScheduleStep.jsx';
import ElementarySchoolScheduleStep from './3c. ElementarySchoolScheduleStep.jsx';
import ClassSelectionStep from './4. ClassSelectionStep.jsx';
import TeacherAvatarCustomizer from './TeacherAvatarCustomizer.jsx';
import SchoolDirectoryStep from '../SchoolDirectoryStep.jsx';
import RetroIcon, { RetroArrow } from '../RetroIcon';

// Global Retro Styles Shared Matrix
const retroStyles = {
  setupBox: {
    backgroundColor: '#121212',
    border: '2px solid #39FF14',
    boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)',
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center',
    fontFamily: '"Courier New", Courier, monospace',
    color: '#fff',
    width: '100%',
    maxWidth: '1100px',
    minHeight: '720px',
    margin: '0 auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  heading: {
    color: '#39FF14',
    letterSpacing: '2px',
    marginBottom: '10px',
    textTransform: 'uppercase'
  },
  subtitle: {
    color: '#aaa',
    fontSize: '0.95rem',
    marginBottom: '25px'
  },
  menuColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    margin: '0 auto'
  },
  menuButton: {
    backgroundColor: '#222',
    color: '#39FF14',
    border: '1px solid #39FF14',
    padding: '12px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  actionButton: {
    backgroundColor: '#39FF14',
    color: '#000',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s ease'
  },
  saveButton: {
    backgroundColor: '#00FFFF',
    color: '#0a0a0a',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'opacity 0.2s ease'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#39FF14',
    border: '1px solid #39FF14',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'inherit'
  },
  exitButton: {
    backgroundColor: 'transparent',
    color: '#FF3333',
    border: '1px dashed #FF3333',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'inherit'
  },
  footerActions: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    maxWidth: '760px',
    margin: '30px auto 0',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
};

export default function TeacherDashboard({ onExit, initialData = null, onStateChange = null, onSaveGame = null, activeSlotLabel = '', saveMessage = '' }) {
  // Step workflow tracker: 'SCHOOL_TYPE' | 'GRADE_CONFIG' | 'CLASS_SELECTION' | 'SCHEDULE_MATRIX' | 'AVATAR_CUSTOMIZE' | 'SCHOOL_DIRECTORY' | 'WORLD_MAP'
  const [step, setStep] = useState(initialData?.step || 'SCHOOL_TYPE');
  
  // Track unified setup states configurations
  const [schoolType, setSchoolType] = useState(initialData?.schoolType || null);
  const [elementaryGrade, setElementaryGrade] = useState(initialData?.elementaryGrade ?? null);
  const [middleGrade, setMiddleGrade] = useState(initialData?.middleGrade ?? null);
  const [middleLunchWave, setMiddleLunchWave] = useState(initialData?.middleLunchWave || '');
  
  const [highSchoolDept, setHighSchoolDept] = useState(initialData?.highSchoolDept || null);
  const [lunchWave, setLunchWave] = useState(initialData?.lunchWave || '');
  const [selectedClass, setSelectedClass] = useState(initialData?.selectedClass || null);
  const [highScheduleContract, setHighScheduleContract] = useState(initialData?.highScheduleContract || null);
  
  // Finalized teacher operational properties payload
  const [teacherProfile, setTeacherProfile] = useState(initialData?.teacherProfile || null);
  const [schoolDirectoryData, setSchoolDirectoryData] = useState(initialData?.schoolDirectoryData || null);

  useEffect(() => {
    if (!initialData) return;
    setStep(initialData.step || 'SCHOOL_TYPE');
    setSchoolType(initialData.schoolType || null);
    setElementaryGrade(initialData.elementaryGrade ?? null);
    setMiddleGrade(initialData.middleGrade ?? null);
    setMiddleLunchWave(initialData.middleLunchWave || '');
    setHighSchoolDept(initialData.highSchoolDept || null);
    setLunchWave(initialData.lunchWave || '');
    setSelectedClass(initialData.selectedClass || null);
    setHighScheduleContract(initialData.highScheduleContract || null);
    setTeacherProfile(initialData.teacherProfile || null);
    setSchoolDirectoryData(initialData.schoolDirectoryData || null);
  }, [initialData]);

  useEffect(() => {
    onStateChange?.({
      step,
      schoolType,
      elementaryGrade,
      middleGrade,
      middleLunchWave,
      highSchoolDept,
      lunchWave,
      selectedClass,
      highScheduleContract,
      teacherProfile,
      schoolDirectoryData
    });
  }, [
    step,
    schoolType,
    elementaryGrade,
    middleGrade,
    middleLunchWave,
    highSchoolDept,
    lunchWave,
    selectedClass,
    highScheduleContract,
    teacherProfile,
    schoolDirectoryData,
    onStateChange
  ]);

  // Structural wrappers for components that share global hooks
  const stateVars = { middleGrade, middleLunchWave, elementaryGrade };
  const stateSetters = { setElementaryGrade, setMiddleGrade, setMiddleLunchWave };

  const handleSelectSchoolType = (type) => {
    setSchoolType(type);
    setSelectedClass(null);
    setHighScheduleContract(null);
    if (type === 'High') {
      setStep('SCHEDULE_MATRIX'); // High school bypasses grade configuration steps
    } else {
      setStep('GRADE_CONFIG');
    }
  };

  const handleGradeConfigNext = () => {
    if (schoolType === 'Elementary') {
      if (elementaryGrade >= 3) {
        setStep('CLASS_SELECTION');
        return;
      }
      setStep('SCHEDULE_MATRIX');
      return;
    }

    if (schoolType === 'Middle') {
      setStep('CLASS_SELECTION');
      return;
    }

    if (schoolType === 'High') {
      setStep('SCHEDULE_MATRIX');
    }
  };

  const handleClassSelectionNext = (course) => {
    setSelectedClass(course);
    setStep('SCHEDULE_MATRIX');
  };

  const handleScheduleLaunch = (data) => {
    if (schoolType === 'High') {
      setHighSchoolDept(data.selectedDept);
      setLunchWave(data.randomLunchWave);
      setHighScheduleContract(data);
    } else if (schoolType === 'Middle') {
      setLunchWave(data.wave);
    } else if (schoolType === 'Elementary') {
      setLunchWave(data.lunchWave);
    }
    setStep('AVATAR_CUSTOMIZE');
  };

  const handleFinishCustomization = (profileData) => {
    if (schoolType === 'High' && highScheduleContract?.contractSchedule) {
      setTeacherProfile({
        ...profileData,
        contractSchedule: highScheduleContract.contractSchedule,
        contractLunchWave: highScheduleContract.randomLunchWave || null,
        contractSelectedDept: highScheduleContract.selectedDept || null,
        contractScheduleVersion: highScheduleContract.scheduleVersion || 4,
        contractWeeklyRows: highScheduleContract.weeklyRows || null,
        contractLunchByDay: highScheduleContract.lunchByDay || null
      });
    } else {
      setTeacherProfile(profileData);
    }
    setStep('SCHOOL_DIRECTORY');
  };

  const handleSchoolDirectoryProceed = (directoryData) => {
    setSchoolDirectoryData(directoryData);
    setStep('WORLD_MAP');
  };

  // ----------------------------------------------------------------
  // RENDERING TIMELINE ROUTER
  // ----------------------------------------------------------------
  
  // 1. Initial configuration path choice
  if (step === 'SCHOOL_TYPE') {
    return <SchoolTypeStep onSelectType={handleSelectSchoolType} onBack={onExit} onExit={onExit} onSaveGame={onSaveGame} styles={retroStyles} />;
  }

  // 2. Class tracks setup stage
  if (step === 'GRADE_CONFIG') {
    return (
      <GradeConfigStep 
        schoolType={schoolType} 
        stateVars={stateVars} 
        stateSetters={stateSetters} 
        onNext={handleGradeConfigNext} 
        onBack={() => setStep('SCHOOL_TYPE')} 
        onExit={onExit}
        onSaveGame={onSaveGame}
        styles={retroStyles} 
      />
    );
  }

  // 3. Structural schedule grids generation stages
  if (step === 'SCHEDULE_MATRIX') {
    if (schoolType === 'High') {
      return (
        <HighSchoolScheduleStep
          onLaunchGame={handleScheduleLaunch}
          onBack={() => setStep('SCHOOL_TYPE')}
          onExit={onExit}
          onSaveGame={onSaveGame}
          styles={retroStyles}
          resumeData={highScheduleContract}
        />
      );
    }
    if (schoolType === 'Middle') {
      return (
        <MiddleSchoolScheduleStep 
          middleGrade={middleGrade} 
          middleLunchWave={middleLunchWave} 
          selectedClass={selectedClass}
          onLaunchGame={handleScheduleLaunch} 
          onBack={() => setStep('CLASS_SELECTION')} 
          onExit={onExit}
          onSaveGame={onSaveGame}
          styles={retroStyles} 
        />
      );
    }
    if (schoolType === 'Elementary') {
      return (
        <ElementarySchoolScheduleStep
          elementaryGrade={elementaryGrade}
          selectedClass={selectedClass}
          onLaunchGame={handleScheduleLaunch}
          onBack={() => (elementaryGrade >= 3 ? setStep('CLASS_SELECTION') : setStep('GRADE_CONFIG'))}
          onExit={onExit}
          onSaveGame={onSaveGame}
          styles={retroStyles}
        />
      );
    }
  }

  if (step === 'CLASS_SELECTION') {
    return (
      <ClassSelectionStep
        schoolType={schoolType}
        elementaryGrade={elementaryGrade}
        middleGrade={middleGrade}
        highSchoolDept={highSchoolDept}
        onSelectClass={handleClassSelectionNext}
        onBack={() => setStep('GRADE_CONFIG')}
        onExit={onExit}
        onSaveGame={onSaveGame}
        styles={retroStyles}
      />
    );
  }

  // 4. Final Step: The Avatar Customizer 
  if (step === 'AVATAR_CUSTOMIZE') {
    return (
      <TeacherAvatarCustomizer 
        onSaveAvatar={handleFinishCustomization} 
        onBack={() => setStep('SCHEDULE_MATRIX')} 
        onExit={onExit}
        onSaveGame={onSaveGame}
        styles={retroStyles} 
      />
    );
  }

  // 5. Review generated school directory before entering world map
  if (step === 'SCHOOL_DIRECTORY') {
    return (
      <SchoolDirectoryStep
        schoolType={schoolType}
        playerAvatar={teacherProfile}
        playerDepartment={highSchoolDept || selectedClass}
        playerGrade={schoolType === 'Middle' ? middleGrade : schoolType === 'Elementary' ? elementaryGrade : null}
        onProceed={handleSchoolDirectoryProceed}
        onBack={() => setStep('AVATAR_CUSTOMIZE')}
        onSaveGame={onSaveGame}
        styles={retroStyles}
      />
    );
  }

  // 6. Custom Gameplay Matrix Implementation Boundary
  if (step === 'WORLD_MAP') {
    const totalStaff = schoolDirectoryData?.roster
      ? Object.values(schoolDirectoryData.roster).reduce((count, group) => count + group.length, 0)
      : 0;

    return (
      <div style={retroStyles.setupBox}>
        {/* Your custom map and navigation layout code goes right here! */}
        <h2 style={retroStyles.heading}>WORLD MAP LOADING</h2>
        <p style={retroStyles.subtitle}>Faculty directory synced: {totalStaff} staff records loaded.</p>
        <div style={{ ...retroStyles.footerActions, marginTop: '24px' }}>
          <button style={{ ...retroStyles.backButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
          <button style={{ ...retroStyles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
        </div>
        {saveMessage ? <p style={{ margin: '6px 0 0', color: '#00FFFF', fontSize: '0.76rem' }}>{saveMessage}</p> : null}
      </div>
    );
  }

  return null;
}