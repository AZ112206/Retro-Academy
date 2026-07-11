import { useState } from 'react';
import RetroIcon from './RetroIcon';

export default function MainMenu({ onSelectRole }) {
  const [gameState, setGameState] = useState('TITLE'); // TITLE or SELECT_ROLE

  return (
    <div style={styles.container}>
      {gameState === 'TITLE' ? (
        <div style={styles.menuBox}>
          <h1 style={styles.title}>RETRO ACADEMY</h1>
          <p style={styles.subtitle}>Select Your Path. Rule the Campus.</p>
          <button style={styles.button} onClick={() => setGameState('SELECT_ROLE')}>
            START GAME
          </button>
        </div>
      ) : (
        <div style={styles.menuBox}>
          <h2 style={styles.heading}>CHOOSE YOUR ROLE</h2>
          <div style={styles.roleContainer}>
            <button style={styles.roleButton} onClick={() => onSelectRole('Student')}>
              <h3 style={styles.roleTitle}><RetroIcon kind="student" /> STUDENT</h3>
              <p>Survive exams, manage your social life, and graduate without going broke.</p>
            </button>
            
            <button style={styles.roleButton} onClick={() => onSelectRole('Teacher')}>
              <h3 style={styles.roleTitle}><RetroIcon kind="teacher" /> TEACHER</h3>
              <p>Manage classroom chaos, grade papers, and keep your sanity intact.</p>
            </button>
          </div>
          <button style={styles.backButton} onClick={() => setGameState('TITLE')}>
            BACK TO MAIN MENU
          </button>
        </div>
      )}
    </div>
  );
}

// Simple retro terminal-style styling
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    width: '100%',
    backgroundColor: '#121212',
    color: '#39FF14', // Retro green neon
    fontFamily: '"Courier New", Courier, monospace',
    padding: '20px',
    boxSizing: 'border-box',
  },
  menuBox: {
    textAlign: 'center',
    border: '3px solid #39FF14',
    padding: '40px',
    borderRadius: '10px',
    backgroundColor: '#1a1a1a',
    width: '100%',
    maxWidth: '1100px',
    minHeight: '720px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 0 15px rgba(57, 255, 20, 0.4)',
  },
  title: {
    fontSize: '3rem',
    margin: '0 0 10px 0',
    letterSpacing: '2px',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    color: '#888',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#39FF14',
    color: '#000',
    border: 'none',
    padding: '15px 40px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: '5px',
    boxShadow: '0 4px #24a10e',
  },
  roleContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '30px',
  },
  roleButton: {
    backgroundColor: '#222',
    color: '#39FF14',
    border: '2px solid #39FF14',
    padding: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: '5px',
    transition: 'background-color 0.2s',
  },
  roleTitle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    margin: '0 0 10px 0'
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#888',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }
};