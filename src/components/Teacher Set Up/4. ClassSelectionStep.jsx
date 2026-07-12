import React from 'react';
import RetroIcon, { RetroArrow } from '../RetroIcon';

// Consolidated Elementary Pool: 3 classes consistent from 3rd to 5th grade
const ELEMENTARY_OPTIONS = [
  { id: 'elem_ela', name: 'Reading & ELA', icon: 'book', course: 'Language Arts & Reading', desc: 'Developing core literacy, grammar mechanics, and sentence structures.' },
  { id: 'elem_math', name: 'Mathematics', icon: 'math', course: 'Elementary Math Focus', desc: 'Focusing on numbers, fractions, operations, and arithmetic logic.' },
  { id: 'elem_sci_ss', name: 'Science & Social Studies', icon: 'globe', course: 'Integrated Science/SS', desc: 'Exploring natural ecosystems, physical forces, and history timelines.' }
];

export default function ClassSelectionStep({ schoolType, elementaryGrade, middleGrade, highSchoolDept, onSelectClass, onBack, onExit, styles }) {
  
  // Rule: Grades K-2 are fully locked as general core blocks
  const isLockedGeneral = schoolType === 'Elementary' && (elementaryGrade === 0 || elementaryGrade === 1 || elementaryGrade === 2);

  // Generate correct course choices matching your scaling curriculum
  const getClassPool = () => {
    if (schoolType === 'Elementary') {
      if (elementaryGrade >= 3 && elementaryGrade <= 5) return ELEMENTARY_OPTIONS;
    }
    
    if (schoolType === 'Middle') {
      // Dynamic grade-by-grade course names with structured identifiers
      if (middleGrade === 6) {
        return [
          { id: 'mid_reading_g6', name: 'Narrative Literacy & Reading Workshop', icon: 'book', desc: 'Text comprehension, reading workshop tracks, and vocabulary building.' },
          { id: 'mid_ela_g6', name: 'Introductory Composition & Grammar Mechanics', icon: 'pencil', desc: 'Advanced grammar, sentence building, and essay structures.' },
          { id: 'mid_math_g6', name: 'Foundations of Mathematics VI', icon: 'math', desc: 'Focusing on numbers, fractions, structural logic, and introductory arithmetic.' },
          { id: 'mid_science_g6', name: 'Introductory Earth & Space Science', icon: 'science', desc: 'Exploring geological shifts, planetary orbits, and natural structures.' },
          { id: 'mid_social_studies_g6', name: 'Ancient World History & Geography', icon: 'history', desc: 'Exploring foundational world history, ancient societies, and maps.' }
        ];
      }
      
      if (middleGrade === 7) {
        return [
          { id: 'mid_reading_g7', name: 'Critical Reading & Literary Analysis', icon: 'book', desc: 'Analyzing textual elements, themes, character arcs, and literary motifs.' },
          { id: 'mid_ela_g7', name: 'Intermediate Writing & Rhetoric', icon: 'pencil', desc: 'Focusing on argumentative essays, structure mechanics, and perspective formatting.' },
          { id: 'mid_math_g7', name: 'Intermediate Mathematical Concepts', icon: 'math', desc: 'Stepping up arithmetic skills and logic paths to build bridges toward algebra.' },
          { id: 'mid_science_g7', name: 'Life Science & Microscopic Worlds', icon: 'science', desc: 'Introduction to biology concepts, biological structures, and ecosystem mechanics.' },
          { id: 'mid_social_studies_g7', name: 'Global Cultures & World Geography', icon: 'history', desc: 'Exploring cultural landscapes, continental geography, and societal development.' }
        ];
      }
      
      if (middleGrade === 8) {
        return [
          { id: 'mid_spanish_g8', name: 'Espanol: Curso Avanzado Roja', icon: 'language', desc: 'Introductory conversational phrases, structural vocabulary, and linguistic elements.' },
          { id: 'mid_ela_g8', name: 'Pre-English', icon: 'pencil', desc: 'Advanced analytical composition to bridge and prepare students for High School requirements.' },
          { id: 'mid_math_g8', name: 'Pre-Algebra', icon: 'math', desc: 'Core logic, equation formulas, functional calculations, and variables.' },
          { id: 'mid_science_g8', name: 'Introductory Physical Science & Physics Foundations', icon: 'science', desc: 'Formulating physical properties, elemental concepts, and energy physics.' },
          { id: 'mid_social_studies_g8', name: 'Early American History & Civics Foundations', icon: 'history', desc: 'Reviewing governing mechanisms, early constitutional models, and historical events.' }
        ];
      }
    }

    if (schoolType === 'High') {
      const highSchoolPools = {
        math: [
          { id: 'high_alg1', name: 'Algebra I', icon: 'math', desc: 'Foundational algebraic reasoning, equations, and graphing systems.' },
          { id: 'high_geometry', name: 'Geometry', icon: 'math', desc: 'Geometric proof, spatial reasoning, and measurement concepts.' },
          { id: 'high_alg2', name: 'Algebra II', icon: 'math', desc: 'Advanced functions, polynomial work, and modeling.' },
          { id: 'high_trig', name: 'Trigonometry', icon: 'math', desc: 'Trigonometric identities, analytic triangles, and modeling.' },
          { id: 'high_precalc', name: 'Pre-Calculus', icon: 'math', desc: 'Function behavior, limits, and advanced analytical prep.' }
        ],
        science: [
          { id: 'high_earth', name: 'Earth Science', icon: 'science', desc: 'Earth systems, weather, geology, and environmental patterns.' },
          { id: 'high_bio', name: 'Biology', icon: 'science', desc: 'Life systems, cells, genetics, and ecosystems.' },
          { id: 'high_chem', name: 'Chemistry', icon: 'science', desc: 'Matter, reactions, and laboratory analysis.' },
          { id: 'high_physics', name: 'Physics', icon: 'science', desc: 'Force, motion, energy transfer, and systems.' },
          { id: 'high_env', name: 'Environmental Science', icon: 'science', desc: 'Ecology, resources, and sustainability problem solving.' }
        ],
        history: [
          { id: 'high_world_hist', name: 'World History', icon: 'history', desc: 'Global civilizations, movements, and historical change.' },
          { id: 'high_us_hist', name: 'US History', icon: 'history', desc: 'American development, institutions, and turning points.' },
          { id: 'high_civics', name: 'Civics and Economics', icon: 'history', desc: 'Government systems, citizenship, and economic structures.' },
          { id: 'high_modern', name: 'Modern World History', icon: 'history', desc: 'Industrial era transformations and global modernity.' },
          { id: 'high_geo', name: 'Human Geography', icon: 'history', desc: 'Population patterns, migration, culture, and mapping.' }
        ],
        english: [
          { id: 'high_eng1', name: 'English I', icon: 'book', desc: 'Literature, close reading, and composition fundamentals.' },
          { id: 'high_eng2', name: 'English II', icon: 'book', desc: 'Research writing, rhetoric, and literary analysis.' },
          { id: 'high_eng3', name: 'English III', icon: 'book', desc: 'American literature, argument writing, and discourse.' },
          { id: 'high_eng4', name: 'English IV', icon: 'book', desc: 'College-ready composition, research, and synthesis.' },
          { id: 'high_writing', name: 'Creative Writing', icon: 'pencil', desc: 'Narrative craft, workshop routines, and revision.' }
        ],
        language: [
          { id: 'high_spanish1', name: 'Spanish I', icon: 'language', desc: 'Introductory communication, vocabulary, and culture.' },
          { id: 'high_spanish2', name: 'Spanish II', icon: 'language', desc: 'Intermediate speaking, grammar, and reading skills.' },
          { id: 'high_french1', name: 'French I', icon: 'language', desc: 'Introductory French language and cultural foundations.' },
          { id: 'high_french2', name: 'French II', icon: 'language', desc: 'Intermediate grammar and authentic language production.' },
          { id: 'high_fluency', name: 'Conversational Fluency', icon: 'language', desc: 'Immersive discussion, listening, and live communication.' }
        ]
      };

      return highSchoolPools[highSchoolDept] || [];
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
          <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="class" /> CLASS ASSIGNMENT</h2>
          <p style={{ fontSize: '1.2rem', color: '#fff', margin: '20px 0 10px 0' }}>
            Designation: <span style={{ color: '#39FF14' }}>General Classroom Teacher</span> (Grade {elementaryGrade})
          </p>
          <p style={{ ...styles.subtitle, maxWidth: '500px' }}>
            You will guide a single primary cohort through all fundamental subjects seamlessly throughout the school day block.
          </p>
          <div style={styles.footerActions}>
            <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span></button>
            <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
            <button style={{ ...styles.actionButton, flex: '2 1 240px' }} onClick={() => onSelectClass({ id: 'general_core', name: 'General Classroom Block' })}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>START GAME <RetroArrow color="#0a0a0a" /></span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.setupBox}>
      <div style={centeredContainerStyle}>
        <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="class" /> CLASS ASSIGNMENT</h2>
        <p style={styles.subtitle}>
          {schoolType === 'Elementary'
            ? `Grade ${elementaryGrade} Classroom Assignment`
            : schoolType === 'Middle'
              ? `${middleGrade}th Grade Department Assignment`
              : `${(highSchoolDept || 'selected').toUpperCase()} Department Assignment`}
        </p>

        <div style={{ ...styles.menuColumn, width: '100%', maxWidth: '500px' }}>
          {currentPool.map((course) => (
            <button key={course.id} style={{ ...styles.menuButton, textAlign: 'center' }} onClick={() => onSelectClass(course)}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind={course.icon} /> {course.name}</span>
              <span style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>{course.desc}</span>
            </button>
          ))}
        </div>

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 220px' }} onClick={onBack}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span>
          </button>
          <button style={{ ...styles.exitButton, flex: '1 1 220px' }} onClick={onExit}>
            RETURN TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}