import React from 'react';
import RetroIcon, { RetroArrow } from '../RetroIcon';

export default function SchoolTypeStep({ onSelect, onSelectType, onBack, onExit, styles }) {
  const handleSelect = onSelectType || onSelect;

  return (
    <div style={styles.setupBox}>
      <h2 style={styles.heading}>CHOOSE INSTITUTION TYPE</h2>
      <p style={styles.subtitle}>Select your school environment to define your schedule rhythm.</p>
      <div style={styles.menuColumn}>
        <button style={styles.menuButton} onClick={() => handleSelect?.('Elementary')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="student" /> ELEMENTARY SCHOOL</span>
          <span style={styles.subtext}>Grades K-5 | 3 Classrooms per grade | General & Departmental tracks</span>
        </button>
        <button style={styles.menuButton} onClick={() => handleSelect?.('Middle')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="school" /> MIDDLE SCHOOL</span>
          <span style={styles.subtext}>Grades 6-8 | 5 Classrooms per grade | Block Schedule | 3 Lunch Waves</span>
        </button>
        <button style={styles.menuButton} onClick={() => handleSelect?.('High')}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="cap" /> HIGH SCHOOL</span>
          <span style={styles.subtext}>Grades 9-12 | 6 Classrooms per department | 4-Period Matrix | Long & Short Blocks | 4 Lunch Waves</span>
        </button>
      </div>
      <div style={styles.footerActions}>
        <button style={{ ...styles.backButton, flex: '1 1 200px' }} onClick={onBack || onExit}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span>
        </button>
        <button style={{ ...styles.exitButton, flex: '1 1 200px' }} onClick={onExit}>
          RETURN TO MAIN MENU
        </button>
      </div>
    </div>
  );
}