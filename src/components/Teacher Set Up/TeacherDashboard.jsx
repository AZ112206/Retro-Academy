import React, { useState } from 'react';
import SchoolTypeStep from './1. SchoolTypeStep.jsx';
import GradeConfigStep from './2. GradeConfigStep.jsx';
import ClassSelectionStep from './4. ClassSelectionStep.jsx';
import HighSchoolScheduleStep from './3b. HighSchoolScheduleStep.jsx';
import MiddleSchoolScheduleStep from './3a. MiddleSchoolScheduleStep.jsx';
import ElementarySchoolScheduleStep from './3c. ElementarySchoolScheduleStep.jsx';
import TeacherAvatarCustomizer from './TeacherAvatarCustomizer.jsx';
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

export default function TeacherDashboard({ onExit }) {
  // Step workflow tracker: 'SCHOOL_TYPE' | 'GRADE_CONFIG' | 'CLASS_SELECT' | 'SCHEDULE_MATRIX' | 'AVATAR_CUSTOMIZE' | 'WORLD_MAP'
  const [step, setStep] = useState('SCHOOL_TYPE');
  
  // Track unified setup states configurations
  const [schoolType, setSchoolType] = useState(null);
  const [elementaryGrade, setElementaryGrade] = useState(null);
  const [middleGrade, setMiddleGrade] = useState(null);
  const [middleLunchWave, setMiddleLunchWave] = useState('');
  
  const [assignedClass, setAssignedClass] = useState(null);
  const [highSchoolDept, setHighSchoolDept] = useState(null);
  const [lunchWave, setLunchWave] = useState('');
  
  // Finalized teacher operational properties payload
  const [teacherProfile, setTeacherProfile] = useState(null);

  // Structural wrappers for components that share global hooks
  const stateVars = { middleGrade, middleLunchWave, elementaryGrade };
  const stateSetters = { setElementaryGrade, setMiddleGrade, setMiddleLunchWave };

  const handleSelectSchoolType = (type) => {
    setSchoolType(type);
    if (type === 'High') {
      setStep('SCHEDULE_MATRIX'); // High school bypasses grade configuration steps
    } else {
      setStep('GRADE_CONFIG');
    }
  };

  const handleGradeConfigNext = () => {
    if (schoolType === 'Elementary' || schoolType === 'Middle') {
      setStep('SCHEDULE_MATRIX');
    }
  };

  const handleClassSelectNext = (selectedCourse) => {
    setAssignedClass(selectedCourse);
    setStep('AVATAR_CUSTOMIZE');
  };

  const handleScheduleLaunch = (data) => {
    if (schoolType === 'High') {
      setHighSchoolDept(data.selectedDept);
      setLunchWave(data.randomLunchWave);
    } else if (schoolType === 'Middle') {
      setLunchWave(data.wave);
    } else if (schoolType === 'Elementary') {
      setLunchWave(data.lunchWave);
    }
    setStep('CLASS_SELECT');
  };

  const handleFinishCustomization = (profileData) => {
    setTeacherProfile(profileData);
    setStep('WORLD_MAP'); // Initialize the dual-control 2D grid viewport engine
  };

  // ----------------------------------------------------------------
  // RENDERING TIMELINE ROUTER
  // ----------------------------------------------------------------
  
  // 1. Initial configuration path choice
  if (step === 'SCHOOL_TYPE') {
    return <SchoolTypeStep onSelectType={handleSelectSchoolType} onBack={onExit} onExit={onExit} styles={retroStyles} />;
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
        styles={retroStyles} 
      />
    );
  }

  // 3. Elementary dynamic course collection selector 
  if (step === 'CLASS_SELECT') {
    return (
      <ClassSelectionStep 
        schoolType={schoolType}
        elementaryGrade={elementaryGrade}
        middleGrade={middleGrade}
        highSchoolDept={highSchoolDept}
        onSelectClass={handleClassSelectNext}
        onBack={() => setStep('SCHEDULE_MATRIX')}
        onExit={onExit}
        styles={retroStyles}
      />
    );
  }

  // 4. Structural schedule grids generation stages
  if (step === 'SCHEDULE_MATRIX') {
    if (schoolType === 'High') {
      return <HighSchoolScheduleStep onLaunchGame={handleScheduleLaunch} onBack={() => setStep('SCHOOL_TYPE')} onExit={onExit} styles={retroStyles} />;
    }
    if (schoolType === 'Middle') {
      return (
        <MiddleSchoolScheduleStep 
          middleGrade={middleGrade} 
          middleLunchWave={middleLunchWave} 
          onLaunchGame={handleScheduleLaunch} 
          onBack={() => setStep('GRADE_CONFIG')} 
          onExit={onExit}
          styles={retroStyles} 
        />
      );
    }
    if (schoolType === 'Elementary') {
      return (
        <ElementarySchoolScheduleStep
          elementaryGrade={elementaryGrade}
          onLaunchGame={handleScheduleLaunch}
          onBack={() => setStep('GRADE_CONFIG')}
          onExit={onExit}
          styles={retroStyles}
        />
      );
    }
  }

  // 5. Final Step: The Avatar Customizer 
  if (step === 'AVATAR_CUSTOMIZE') {
    return (
      <TeacherAvatarCustomizer 
        onSaveAvatar={handleFinishCustomization} 
        onBack={() => setStep('SCHEDULE_MATRIX')} 
        onExit={onExit}
        styles={retroStyles} 
      />
    );
  }

  // 6. 2D Game Exploration Sandbox Viewport Screen
  if (step === 'WORLD_MAP') {
    return (
      <div style={{ ...retroStyles.setupBox, maxWidth: '1000px', borderStyle: 'solid' }}>
        <h2 style={{ ...retroStyles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="controller" /> CAMPUS OVERWORLD SANDBOX</h2>
        <p style={retroStyles.subtitle}>Welcome, <strong>{teacherProfile?.name || 'Instructor'}</strong>. The school year has officially initialized!</p>
        
        {/* Placeholder wrapper box targeting our cross-platform keyboard + mobile virtual touch overlay controls */}
        <div style={{ width: '100%', height: '400px', backgroundColor: '#000', border: '2px solid #39FF14', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#39FF14', fontSize: '1.2rem', fontFamily: 'monospace', textShadow: '0 0 5px #39FF14' }}>
            [ 🏃 2D MOVING SPRITE WORLD MAP CANVAS ENGINE GOES HERE ]
          </span>
        </div>

        <div style={retroStyles.footerActions}>
          <button style={{ ...retroStyles.backButton, flex: '1 1 200px' }} onClick={() => setStep('AVATAR_CUSTOMIZE')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK TO BADGE</span>
          </button>
          <button style={{ ...retroStyles.exitButton, flex: '1 1 200px' }} onClick={onExit}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="exit" /> SHUT DOWN CLIENT</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}