import React, { useEffect, useMemo } from 'react';

// Subject pools mapped by grade level
const SUBJECT_POOL = {
  6: [
    { id: 'mid_reading_g6', name: 'Reading', course: 'Narrative Literacy & Reading Workshop' },
    { id: 'mid_ela_g6', name: 'ELA', course: 'Introductory Composition & Grammar Mechanics' },
    { id: 'mid_math_g6', name: 'Mathematics', course: 'Foundations of Mathematics VI' },
    { id: 'mid_science_g6', name: 'Science', course: 'Introductory Earth & Space Science' },
    { id: 'mid_social_studies_g6', name: 'Social Studies', course: 'Ancient World History & Geography' }
  ],
  7: [
    { id: 'mid_reading_g7', name: 'Reading', course: 'Critical Reading & Literary Analysis' },
    { id: 'mid_ela_g7', name: 'ELA', course: 'Intermediate Writing & Rhetoric' },
    { id: 'mid_math_g7', name: 'Mathematics', course: 'Intermediate Mathematical Concepts' },
    { id: 'mid_science_g7', name: 'Science', course: 'Life Science & Microscopic Worlds' },
    { id: 'mid_social_studies_g7', name: 'Social Studies', course: 'Global Cultures & World Geography' }
  ],
  8: [
    { id: 'mid_spanish_g8', name: 'Spanish', course: 'Introductory Spanish' },
    { id: 'mid_ela_g8', name: 'ELA', course: 'Pre-English' },
    { id: 'mid_math_g8', name: 'Mathematics', course: 'Pre-Algebra' },
    { id: 'mid_science_g8', name: 'Science', course: 'Introductory Physical Science & Physics Foundations' },
    { id: 'mid_social_studies_g8', name: 'Social Studies', course: 'Early American History & Civics Foundations' }
  ]
};

const SPECIALIST_POOL = [
  { id: 'spec_art', name: 'Visual Art' },
  { id: 'spec_music', name: 'Music' },
  { id: 'spec_pe', name: 'Physical Education' },
  { id: 'spec_tech', name: 'Computer Tech' }
];

// Standardized bell timeline with 5 core classes, 1 specialist block, and balanced lunch
const BELL_TIMELINE = [
  { id: 'homeroom', label: 'Homeroom', time: '8:00 AM - 8:15 AM', type: 'homeroom' },
  { id: 'block1', label: 'Block 1', time: '8:20 AM - 9:10 AM', type: 'class' },
  { id: 'block2', label: 'Block 2', time: '9:15 AM - 10:05 AM', type: 'class' },
  { id: 'block3', label: 'Block 3', time: '10:10 AM - 11:00 AM', type: 'class' },
  { id: 'lunch', label: 'Lunch Block', time: '11:05 AM - 11:50 AM', type: 'lunch' },
  { id: 'block4', label: 'Block 4', time: '11:55 AM - 12:45 PM', type: 'class' },
  { id: 'block5', label: 'Block 5', time: '12:50 PM - 1:40 PM', type: 'class' },
  { id: 'block6', label: 'Block 6', time: '1:45 PM - 2:30 PM', type: 'class' }
];

function StudentDashboard({ onExit, initialData = null, onStateChange = null, onSaveGame = null, activeSlotLabel = '', saveMessage = '' }) {
  const resolvedGrade = Number(initialData?.grade) || 6;
  const specialistBlockByGrade = { 6: 'block2', 7: 'block4', 8: 'block6' };
  const specialistTargetId = specialistBlockByGrade[resolvedGrade] || 'block2';
  const gradeSubjects = SUBJECT_POOL[resolvedGrade] || SUBJECT_POOL[6];

  // Generate completely unique, randomized schedules for every individual student
  const studentSchedules = useMemo(() => {
    if (Array.isArray(initialData?.studentSchedules) && initialData.studentSchedules.length > 0) {
      return initialData.studentSchedules;
    }

    const roster = ['Alex Mercer', 'Jordan Lee', 'Taylor Smith', 'Morgan Chen', 'Sam Rivera', 'Casey Jordan', 'Avery Brooks', 'Riley Quinn'];
    return roster.map((studentName, idx) => {
      const assignedSpecialist = SPECIALIST_POOL[idx % SPECIALIST_POOL.length];
      
      // Create a randomized sequence of core subjects for this specific student
      const shuffledSubs = [...gradeSubjects].sort(() => (idx % 2 === 0 ? 0.5 - Math.random() : Math.random() - 0.5));
      let subPtr = 0;

      const dailyPath = BELL_TIMELINE.map(slot => {
        if (slot.type === 'homeroom') return 'Homeroom & Attendance';
        if (slot.type === 'lunch') return 'Student Lunch Period';
        if (slot.id === specialistTargetId) return `Specialist: ${assignedSpecialist.name}`;
        
        const courseName = shuffledSubs[subPtr % shuffledSubs.length].course;
        subPtr++;
        return courseName;
      });

      return {
        name: studentName,
        id: `STU-${resolvedGrade}0${idx + 1}`,
        schedule: dailyPath
      };
    });
  }, [initialData, resolvedGrade, gradeSubjects, specialistTargetId]);

  useEffect(() => {
    onStateChange?.({
      ...(initialData || {}),
      step: 'STUDENT_DASHBOARD',
      grade: resolvedGrade,
      studentSchedules
    });
  }, [initialData, onStateChange, resolvedGrade, studentSchedules]);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.heading}>STUDENT DIRECTORY & SCHEDULES</h2>
        <p style={styles.subtitle}>Grade {resolvedGrade} Roster – Randomized Individual Timetables (5 Core + 1 Specialist + Balanced Lunch)</p>

        {/* Student Schedule View Grid */}
        <div className="no-scrollbar" style={styles.scheduleWrapper}>
          {studentSchedules.map(student => (
            <div key={student.id} style={styles.studentCard}>
              <div style={styles.studentHeader}>
                <span>{student.name}</span>
                <span style={{ color: '#00FFFF' }}>{student.id}</span>
              </div>
              <div style={styles.timelineList}>
                {BELL_TIMELINE.map((slot, idx) => {
                  const isSpecialist = slot.id === specialistTargetId;
                  const isLunch = slot.type === 'lunch';
                  const isHomeroom = slot.type === 'homeroom';
                  
                  let textColor = '#fff';
                  if (isLunch) textColor = '#f6d365';
                  else if (isSpecialist) textColor = '#ff9f43';
                  else if (isHomeroom) textColor = '#00FFFF';

                  return (
                    <div key={slot.id} style={styles.timelineRow}>
                      <span style={{ color: '#888', minWidth: '95px', textAlign: 'left' }}>{slot.label}:</span>
                      <span style={{ color: textColor, textAlign: 'right', flex: 1, fontWeight: isLunch || isSpecialist ? 'bold' : 'normal' }}>
                        {student.schedule[idx]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.footerActions}>
          <button style={styles.backButton} onClick={onExit}>Back to Main Menu</button>
          <button style={styles.saveButton} onClick={onSaveGame}>Save Game</button>
        </div>
        {saveMessage ? <p style={styles.slotText}>{saveMessage}</p> : null}
      </div>
    </div>
  );
}

export default StudentDashboard;

const styles = {
  container: {
    width: '100%',
    minHeight: 'calc(100vh - 48px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  panel: {
    width: '100%',
    maxWidth: '1150px',
    minHeight: 'calc(100vh - 88px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    backgroundColor: '#121212',
    border: '2px solid #39FF14',
    borderRadius: '10px',
    color: '#39FF14',
    textAlign: 'center',
    padding: '30px',
    boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)',
  },
  heading: {
    margin: 0,
    fontSize: '1.8rem',
  },
  subtitle: {
    margin: 0,
    color: '#aaa',
    fontSize: '0.9rem',
  },
  scheduleWrapper: {
    width: '100%',
    maxHeight: '460px',
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '15px',
    textAlign: 'left',
    paddingRight: '5px'
  },
  studentCard: {
    backgroundColor: '#181818',
    border: '1px solid #333',
    borderRadius: '6px',
    padding: '12px',
  },
  studentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    color: '#39FF14',
    borderBottom: '1px solid #282828',
    paddingBottom: '6px',
    marginBottom: '8px'
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '0.75rem'
  },
  timelineRow: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px solid #1f1f1f',
    paddingBottom: '2px'
  },
  footerActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    maxWidth: '760px'
  },
    backButton: {
    backgroundColor: 'transparent',
    color: '#39FF14',
    border: '1px solid #39FF14',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    flex: '1 1 180px'
  },
  saveButton: {
    backgroundColor: '#00FFFF',
    color: '#0a0a0a',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    fontFamily: 'inherit',
    flex: '2 1 240px'
  },
  slotText: {
    margin: 0,
    color: '#00FFFF',
    fontSize: '0.82rem'
  },
};