import React from 'react';

// Consolidated Elementary Pool: 3 classes consistent from 3rd to 5th grade
const ELEMENTARY_OPTIONS = [
  { id: 'elem_ela', name: '📚 Reading & ELA', desc: 'Developing core literacy, grammar mechanics, and sentence structures.' },
  { id: 'elem_math', name: '📐 Mathematics', desc: 'Focusing on numbers, fractions, operations, and arithmetic logic.' },
  { id: 'elem_sci_ss', name: '🌍 Science & Social Studies', desc: 'Exploring natural ecosystems, physical forces, and history timelines.' }
];

// Base Middle School Pool: 5 core subjects
const MIDDLE_SCHOOL_BASE_OPTIONS = [
  { id: 'mid_reading', name: '📖 Reading', desc: 'Text comprehension, literary analysis, and vocabulary building.' },
  { id: 'mid_ela', name: '📝 English Language Arts', desc: 'Advanced grammar, essay composition, and creative writing.' },
  { id: 'mid_math', name: '📐 Mathematics', desc: 'Pre-Algebra logic, equations, and problem-solving tracks.' },
  { id: 'mid_science', name: '🧪 Science', desc: 'Introduction to earth science, life systems, and physics concepts.' },
  { id: 'mid_social_studies', name: '📜 Social Studies', desc: 'Exploring global geography, world cultures, and early civics.' }
];

export default function ClassSelectionStep({ schoolType, elementaryGrade, middleGrade, onSelectClass, onBack, styles }) {
  
  // Rule: Grades 1 and 2 are fully locked as general core blocks
  const isLockedGeneral = schoolType === 'Elementary' && (elementaryGrade === 1 || elementaryGrade === 2);

  // Generate correct course choices matching your scaling curriculum
  const getClassPool = () => {
    if (schoolType === 'Elementary') {
      if (elementaryGrade >= 3 && elementaryGrade <= 5) return ELEMENTARY_OPTIONS;
    }
    if (schoolType === 'Middle') {
      // 8th Grade replaces 'Reading' with 'Spanish'
      if (middleGrade === 8) {
        return MIDDLE_SCHOOL_BASE_OPTIONS.map(course => {
          if (course.id === 'mid_reading') {
            return { id: 'mid_spanish', name: '🗣️ Spanish', desc: 'Introductory conversational phrases, vocabulary, and linguistic structures.' };
          }
          return course;
        });
      }
      return MIDDLE_SCHOOL_BASE_OPTIONS;
    }
    return [];
  };

  const currentPool = getClassPool();

  // Unified centered container style override
  const centeredContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    textAlign: 'center'
  };

  // Locked routing block for Early Elementary
  if (isLockedGeneral) {
    return (
      <div style={styles.setupBox}>
        <div style={centeredContainerStyle}>
          <h2 style={styles.heading}>🏫 CLASS ASSIGNMENT</h2>
          <p style={{ fontSize: '1.2rem', color: '#fff', margin: '20px 0 10px 0' }}>
            Designation: <span style={{ color: '#39FF14' }}>General Classroom Teacher</span> (Grade {elementaryGrade})
          </p>
          <p style={{ ...styles.subtitle, maxWidth: '500px' }}>
            You will guide a single primary cohort through all fundamental subjects seamlessly throughout the school day block.
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '30px', width: '100%', maxWidth: '500px' }}>
            <button style={{ ...styles.exitButton, flex: 1 }} onClick={onBack}>BACK</button>
            <button style={{ ...styles.actionButton, flex: 2 }} onClick={() => onSelectClass({ id: 'general_core', name: 'General Classroom Block' })}>
              🚀 START GAME
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallthrough block for High School (where schedules are mapped on Step 2)
  if (schoolType === 'High') {
    return (
      <div style={styles.setupBox}>
        <div style={centeredContainerStyle}>
          <h2 style={styles.heading}>🎓 SCHEDULE CONFIRMED</h2>
          <p style={{ ...styles.subtitle, maxWidth: '500px' }}>Your customized 4-Period high school block configuration is loaded into the system.</p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '30px', width: '100%', maxWidth: '500px' }}>
            <button style={{ ...styles.exitButton, flex: 1 }} onClick={onBack}>BACK</button>
            <button style={{ ...styles.actionButton, flex: 2 }} onClick={() => onSelectClass({ id: 'high_matrix', name: '4-Period Matrix Track' })}>
              🚀 START GAME
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.setupBox}>
      <div style={centeredContainerStyle}>
        <h2 style={styles.heading}>📚 SELECT ASSIGNED COURSE</h2>
        <p style={styles.subtitle}>
          {schoolType === 'Elementary' ? `Grade ${elementaryGrade} Track Selection` : `${middleGrade}th Grade Department Selection`}
        </p>

        <div style={{ ...styles.menuColumn, width: '100%', maxWidth: '500px' }}>
          {currentPool.map((course) => (
            <button key={course.id} style={{ ...styles.menuButton, textAlign: 'center' }} onClick={() => onSelectClass(course)}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{course.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>{course.desc}</span>
            </button>
          ))}
        </div>

        <button style={{ ...styles.exitButton, marginTop: '30px', width: '100%', maxWidth: '500px' }} onClick={onBack}>
          ← BACK
        </button>
      </div>
    </div>
  );
}