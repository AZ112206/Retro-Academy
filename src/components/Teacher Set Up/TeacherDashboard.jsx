import React, { useEffect, useRef, useState } from 'react';
import SchoolTypeStep from './1. SchoolTypeStep.jsx';
import GradeConfigStep from './2. GradeConfigStep.jsx';
import ElementarySchoolScheduleStep from './3a. ElementarySchoolScheduleStep.jsx';
import MiddleSchoolScheduleStep from './3b. MiddleSchoolScheduleStep.jsx';
import HighSchoolScheduleStep from './3c. HighSchoolScheduleStep.jsx';
import ClassSelectionStep from './4. ClassSelectionStep.jsx';
import TeacherAvatarCustomizer from './TeacherAvatarCustomizer.jsx';
import SchoolDirectoryStep from '../SchoolDirectoryStep.jsx';
import ElementarySchoolMap from '../Game World/ElementarySchoolMap.jsx';
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
    minHeight: 'calc(100vh - 48px)',
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
    flexWrap: 'wrap',
    position: 'relative',
    zIndex: 2
  }
};

const WORLD_MAP_LOADING_STEPS = [
  { key: 'district', label: 'District save data', color: '#39FF14' },
  { key: 'campus', label: 'School campus shell', color: '#00FFFF' },
  { key: 'faculty', label: 'Faculty directory', color: '#f6d365' },
  { key: 'students', label: 'Student roster', color: '#ff9f43' },
  { key: 'schedule', label: 'Bell schedule matrix', color: '#9acb92' },
  { key: 'map', label: 'World map', color: '#39FF14' }
];

export default function TeacherDashboard({ onExit, initialData = null, onStateChange = null, onSaveGame = null, activeSlotLabel = '', saveMessage = '' }) {
  // Step workflow tracker: 'SCHOOL_TYPE' | 'GRADE_CONFIG' | 'CLASS_SELECTION' | 'SCHEDULE_MATRIX' | 'AVATAR_CUSTOMIZE' | 'SCHOOL_DIRECTORY' | 'WORLD_MAP'
  const [step, setStep] = useState(initialData?.step || 'SCHOOL_TYPE');
  
  // Track unified setup states configurations
  const [schoolType, setSchoolType] = useState(initialData?.schoolType || null);
  const [elementaryGrade, setElementaryGrade] = useState(initialData?.elementaryGrade ?? null);
  const [middleGrade, setMiddleGrade] = useState(initialData?.middleGrade ?? null);
  const [middleLunchWave, setMiddleLunchWave] = useState(initialData?.middleLunchWave || '');
  const [highGrade, setHighGrade] = useState(initialData?.highGrade ?? null);
  const [highLetterRange, setHighLetterRange] = useState(initialData?.highLetterRange || '');
  
  const [highSchoolDept, setHighSchoolDept] = useState(initialData?.highSchoolDept || null);
  const [lunchWave, setLunchWave] = useState(initialData?.lunchWave || '');
  const [selectedClass, setSelectedClass] = useState(initialData?.selectedClass || null);
  const [highScheduleContract, setHighScheduleContract] = useState(initialData?.highScheduleContract || null);
  
  // Finalized teacher operational properties payload
  const [avatarDraft, setAvatarDraft] = useState(initialData?.avatarDraft || null);
  const [teacherProfile, setTeacherProfile] = useState(initialData?.teacherProfile || null);
  const [schoolDirectoryData, setSchoolDirectoryData] = useState(initialData?.schoolDirectoryData || null);
  const [worldLoadIndex, setWorldLoadIndex] = useState(0);
  const lastEmittedStateRef = useRef('');

  const resetSchoolBranchState = () => {
    setElementaryGrade(null);
    setMiddleGrade(null);
    setMiddleLunchWave('');
    setHighGrade(null);
    setHighLetterRange('');
    setHighSchoolDept(null);
    setLunchWave('');
    setSelectedClass(null);
    setHighScheduleContract(null);
    setAvatarDraft(null);
    setTeacherProfile(null);
    setSchoolDirectoryData(null);
  };

  useEffect(() => {
    if (!initialData) return;
    setStep(initialData.step || 'SCHOOL_TYPE');
    setSchoolType(initialData.schoolType || null);
    setElementaryGrade(initialData.elementaryGrade ?? null);
    setMiddleGrade(initialData.middleGrade ?? null);
    setMiddleLunchWave(initialData.middleLunchWave || '');
    setHighGrade(initialData.highGrade ?? null);
    setHighLetterRange(initialData.highLetterRange || '');
    setHighSchoolDept(initialData.highSchoolDept || null);
    setLunchWave(initialData.lunchWave || '');
    setSelectedClass(initialData.selectedClass || null);
    setHighScheduleContract(initialData.highScheduleContract || null);
    setAvatarDraft(initialData.avatarDraft || null);
    setTeacherProfile(initialData.teacherProfile || null);
    setSchoolDirectoryData(initialData.schoolDirectoryData || null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally mount-only; initialData is resume data, not a live sync source

  useEffect(() => {
    const nextStateSnapshot = JSON.stringify({
      step,
      schoolType,
      elementaryGrade,
      middleGrade,
      middleLunchWave,
      highGrade,
      highLetterRange,
      highSchoolDept,
      lunchWave,
      selectedClass,
      highScheduleContract,
      avatarDraft,
      teacherProfile,
      schoolDirectoryData
    });

    if (lastEmittedStateRef.current === nextStateSnapshot) return;
    lastEmittedStateRef.current = nextStateSnapshot;

    onStateChange?.({
      step,
      schoolType,
      elementaryGrade,
      middleGrade,
      middleLunchWave,
      highGrade,
      highLetterRange,
      highSchoolDept,
      lunchWave,
      selectedClass,
      highScheduleContract,
      avatarDraft,
      teacherProfile,
      schoolDirectoryData
    });
  }, [
    step,
    schoolType,
    elementaryGrade,
    middleGrade,
    middleLunchWave,
    highGrade,
    highLetterRange,
    highSchoolDept,
    lunchWave,
    selectedClass,
    highScheduleContract,
    avatarDraft,
    teacherProfile,
    schoolDirectoryData,
    onStateChange
  ]);

  useEffect(() => {
    if (step !== 'WORLD_MAP') {
      setWorldLoadIndex(0);
      return undefined;
    }

    setWorldLoadIndex(0);
    const intervalId = window.setInterval(() => {
      setWorldLoadIndex((current) => {
        if (current >= WORLD_MAP_LOADING_STEPS.length - 1) {
          window.clearInterval(intervalId);
          return current;
        }
        return current + 1;
      });
    }, 480);

    return () => window.clearInterval(intervalId);
  }, [step]);

  // Structural wrappers for components that share global hooks
  const stateVars = { middleGrade, middleLunchWave, elementaryGrade, highGrade, highLetterRange };
  const stateSetters = { setElementaryGrade, setMiddleGrade, setMiddleLunchWave, setHighGrade, setHighLetterRange };

  const handleSelectSchoolType = (type) => {
    resetSchoolBranchState();
    setSchoolType(type);
    setStep('GRADE_CONFIG');
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
      setHighGrade(data.selectedGrade || highGrade);
      setHighLetterRange(data.selectedRange || highLetterRange);
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
    setAvatarDraft(profileData);
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
          highGrade={highGrade}
          highLetterRange={highLetterRange}
          onLaunchGame={handleScheduleLaunch}
          onStateChange={setHighScheduleContract}
          onBack={() => setStep('GRADE_CONFIG')}
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
        initialData={avatarDraft}
        onStateChange={setAvatarDraft}
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
        playerGrade={schoolType === 'High' ? highGrade : schoolType === 'Middle' ? middleGrade : schoolType === 'Elementary' ? elementaryGrade : null}
        highLetterRange={highLetterRange}
        initialData={schoolDirectoryData}
        onStateChange={setSchoolDirectoryData}
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
    const totalStudents = schoolDirectoryData?.studentRoster
      ? Object.values(schoolDirectoryData.studentRoster).reduce((count, group) => count + group.length, 0)
      : 0;
    const clampedLoadIndex = Math.min(worldLoadIndex, WORLD_MAP_LOADING_STEPS.length - 1);
    const activeLoadStep = WORLD_MAP_LOADING_STEPS[clampedLoadIndex] || WORLD_MAP_LOADING_STEPS[0];
    const loadProgress = Math.round(((clampedLoadIndex + 1) / WORLD_MAP_LOADING_STEPS.length) * 100);
    const isLoadComplete = clampedLoadIndex >= WORLD_MAP_LOADING_STEPS.length - 1;

    if (schoolType === 'Elementary' && isLoadComplete) {
      return (
        <ElementarySchoolMap
          facultyRoster={schoolDirectoryData?.roster || {}}
          playerGrade={elementaryGrade}
          playerDepartment={selectedClass || highSchoolDept || null}
          playerAvatar={teacherProfile}
          onBack={() => setStep('SCHOOL_DIRECTORY')}
          onExit={onExit}
          onSaveGame={onSaveGame}
          styles={retroStyles}
          activeSlotLabel={activeSlotLabel}
          saveMessage={saveMessage}
        />
      );
    }

    return (
      <div style={{ ...retroStyles.setupBox, maxWidth: '920px', minHeight: '680px', justifyContent: 'center', gap: '18px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ ...retroStyles.heading, marginBottom: 0 }}>WORLD MAP LOADING</h2>
          <p style={{ ...retroStyles.subtitle, marginBottom: 0 }}>Booting your retro campus runtime and syncing live school data.</p>
        </div>

        <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', backgroundColor: '#101010', border: '1px solid #2b2b2b', borderRadius: '8px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#39FF14', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px' }}>
            <span>LOAD PROGRESS</span>
            <span>{loadProgress}%</span>
          </div>

          <div style={{ height: '18px', borderRadius: '999px', backgroundColor: '#181818', border: '1px solid #2f2f2f', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(57,255,20,0.08)' }}>
            <div style={{ width: `${loadProgress}%`, height: '100%', background: `linear-gradient(90deg, ${activeLoadStep.color} 0%, #f5f1dd 100%)`, boxShadow: `0 0 16px ${activeLoadStep.color}`, transition: 'width 0.35s ease' }} />
          </div>

          <div style={{ marginTop: '14px', display: 'grid', gap: '8px' }}>
            {WORLD_MAP_LOADING_STEPS.map((item, index) => {
              const isComplete = index < clampedLoadIndex;
              const isActive = index === clampedLoadIndex;
              return (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '9px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${isActive ? item.color : '#252525'}`,
                    backgroundColor: isActive ? '#171f17' : isComplete ? '#141414' : '#111',
                    color: isActive ? item.color : isComplete ? '#d7d7d7' : '#777',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontWeight: 'bold', letterSpacing: '0.4px', textTransform: 'uppercase' }}>{item.label}</span>
                  <span style={{ fontSize: '0.76rem', color: isActive ? '#f5f1dd' : isComplete ? '#9acb92' : '#666' }}>
                    {isComplete ? 'READY' : isActive ? 'LOADING...' : 'QUEUED'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px' }}>
          <div style={{ backgroundColor: '#141414', border: '1px solid #252525', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ color: '#39FF14', fontSize: '0.72rem', letterSpacing: '0.5px' }}>FACULTY</div>
            <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>{totalStaff}</div>
          </div>
          <div style={{ backgroundColor: '#141414', border: '1px solid #252525', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ color: '#39FF14', fontSize: '0.72rem', letterSpacing: '0.5px' }}>STUDENTS</div>
            <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>{totalStudents}</div>
          </div>
          <div style={{ backgroundColor: '#141414', border: '1px solid #252525', borderRadius: '6px', padding: '10px 12px' }}>
            <div style={{ color: '#39FF14', fontSize: '0.72rem', letterSpacing: '0.5px' }}>ACTIVE MODULE</div>
            <div style={{ color: activeLoadStep.color, fontSize: '1rem', fontWeight: 'bold', textTransform: 'uppercase' }}>{activeLoadStep.label}</div>
          </div>
        </div>

        <div style={{ color: activeLoadStep.color, fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          {activeLoadStep.label}
        </div>
        <div style={{ color: '#9acb92', fontSize: '0.78rem', textAlign: 'center', maxWidth: '720px', lineHeight: 1.6 }}>
          Loading {activeLoadStep.label.toLowerCase()}... world map assets, school systems, and roster links are being locked into this save.
        </div>
      </div>
    );
  }

  return null;
}