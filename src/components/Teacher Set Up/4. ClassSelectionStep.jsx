import React from 'react';

// Consolidated Elementary Pool: 3 classes consistent from 3rd to 5th grade
const ELEMENTARY_OPTIONS = [
  { id: 'elem_ela', name: '📚 Reading & ELA', desc: 'Developing core literacy, grammar mechanics, and sentence structures.' },
  { id: 'elem_math', name: '📐 Mathematics', desc: 'Focusing on numbers, fractions, operations, and arithmetic logic.' },
  { id: 'elem_sci_ss', name: '🌍 Science & Social Studies', desc: 'Exploring natural ecosystems, physical forces, and history timelines.' }
];

export default function ClassSelectionStep({ schoolType, elementaryGrade, middleGrade, onSelectClass, onBack, onExit, styles }) {
  
  // Rule: Grades 1 and 2 are fully locked as general core blocks
  const isLockedGeneral = schoolType === 'Elementary' && (elementaryGrade === 1 || elementaryGrade === 2);

  // Generate correct course choices matching your scaling curriculum
  const getClassPool = () => {
    if (schoolType === 'Elementary') {
      if (elementaryGrade >= 3 && elementaryGrade <= 5) return ELEMENTARY_OPTIONS;
    }
    
    if (schoolType === 'Middle') {
      // Dynamic grade-by-grade course names with structured identifiers
      if (middleGrade === 6) {
        return [
          { id: 'mid_reading_g6', name: '📖 Narrative Literacy & Reading Workshop', desc: 'Text comprehension, reading workshop tracks, and vocabulary building.' },
          { id: 'mid_ela_g6', name: '📝 Introductory Composition & Grammar Mechanics', desc: 'Advanced grammar, sentence building, and essay structures.' },
          { id: 'mid_math_g6', name: '📐 Foundations of Mathematics VI', desc: 'Focusing on numbers, fractions, structural logic, and introductory arithmetic.' },
          { id: 'mid_science_g6', name: '🧪 Introductory Earth & Space Science', desc: 'Exploring geological shifts, planetary orbits, and natural structures.' },
          { id: 'mid_social_studies_g6', name: '📜 Ancient World History & Geography', desc: 'Exploring foundational world history, ancient societies, and maps.' }
        ];
      }
      
      if (middleGrade === 7) {
        return [
          { id: 'mid_reading_g7', name: '📖 Critical Reading & Literary Analysis', desc: 'Analyzing textual elements, themes, character arcs, and literary motifs.' },
          { id: 'mid_ela_g7', name: '📝 Intermediate Writing & Rhetoric', desc: 'Focusing on argumentative essays, structure mechanics, and perspective formatting.' },
          { id: 'mid_math_g7', name: '📐 Intermediate Mathematical Concepts', desc: 'Stepping up arithmetic skills and logic paths to build bridges toward algebra.' },
          { id: 'mid_science_g7', name: '🧪 Life Science & Microscopic Worlds', desc: 'Introduction to biology concepts, biological structures, and ecosystem mechanics.' },
          { id: 'mid_social_studies_g7', name: '📜 Global Cultures & World Geography', desc: 'Exploring cultural landscapes, continental geography, and societal development.' }
        ];
      }
      
      if (middleGrade === 8) {
        return [
          { id: 'mid_spanish_g8', name: '🗣️ Español: Curso Avanzado Roja', desc: 'Introductory conversational phrases, structural vocabulary, and linguistic elements.' },
          { id: 'mid_ela_g8', name: '📝 Pre-English', desc: 'Advanced analytical composition to bridge and prepare students for High School requirements.' },
          { id: 'mid_math_g8', name: '📐 Pre-Algebra', desc: 'Core logic, equation formulas, functional calculations, and variables.' },
          { id: 'mid_science_g8', name: '🧪 Introductory Physical Science & Physics Foundations', desc: 'Formulating physical properties, elemental concepts, and energy physics.' },
          { id: 'mid_social_studies_g8', name: '📜 Early American History & Civics Foundations', desc: 'Reviewing governing mechanisms, early constitutional models, and historical events.' }
        ];
      }
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
          <div style={styles.footerActions}>
            <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}>← BACK</button>
            <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
            <button style={{ ...styles.actionButton, flex: '2 1 240px' }} onClick={() => onSelectClass({ id: 'general_core', name: 'General Classroom Block' })}>
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
          <div style={styles.footerActions}>
            <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}>← BACK</button>
            <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
            <button style={{ ...styles.actionButton, flex: '2 1 240px' }} onClick={() => onSelectClass({ id: 'high_matrix', name: '4-Period Matrix Track' })}>
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

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 220px' }} onClick={onBack}>
            ← BACK
          </button>
          <button style={{ ...styles.exitButton, flex: '1 1 220px' }} onClick={onExit}>
            RETURN TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}