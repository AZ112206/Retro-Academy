import React from 'react';

export default function SchoolTypeStep({ onSelect, onExit, styles }) {
  return (
    <div style={styles.setupBox}>
      <h2 style={styles.heading}>CHOOSE INSTITUTION TYPE</h2>
      <p style={styles.subtitle}>Select your school environment to define your schedule rhythm.</p>
      <div style={styles.menuColumn}>
        <button style={styles.menuButton} onClick={() => onSelect('Elementary')}>
          🎒 ELEMENTARY SCHOOL
          <span style={styles.subtext}>Grades 1-5 | 3 Classrooms per grade | General & Departmental tracks</span>
        </button>
        <button style={styles.menuButton} onClick={() => onSelect('Middle')}>
          🏫 MIDDLE SCHOOL
          <span style={styles.subtext}>Grades 6-8 | 5 Classrooms per grade | Block Schedule | 3 Lunch Waves</span>
        </button>
        <button style={styles.menuButton} onClick={() => onSelect('High')}>
          🎓 HIGH SCHOOL
          <span style={styles.subtext}>Grades 9-12 | 4-Period Matrix | Long & Short Blocks | 4 Lunch Waves</span>
        </button>
      </div>
      <button style={{ ...styles.exitButton, marginTop: '30px' }} onClick={onExit}>
        RETURN TO MAIN MENU
      </button>
    </div>
  );
}