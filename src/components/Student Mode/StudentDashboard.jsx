import { useEffect } from 'react';

function StudentDashboard({ onExit, initialData = null, onStateChange = null, onSaveGame = null, activeSlotLabel = '', saveMessage = '' }) {
  useEffect(() => {
    onStateChange?.(initialData || { step: 'STUDENT_PLACEHOLDER' });
  }, [initialData, onStateChange]);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.heading}>Student Mode</h2>
        <p style={styles.subtitle}>Student gameplay is not configured yet.</p>
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
    minHeight: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  panel: {
    width: '100%',
    maxWidth: '1100px',
    minHeight: '720px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '18px',
    backgroundColor: '#121212',
    border: '2px solid #39FF14',
    borderRadius: '10px',
    color: '#39FF14',
    textAlign: 'center',
    padding: '40px',
    boxShadow: '0 0 20px rgba(57, 255, 20, 0.2)',
  },
  heading: {
    margin: 0,
    fontSize: '2rem',
  },
  subtitle: {
    margin: 0,
    color: '#aaa',
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
