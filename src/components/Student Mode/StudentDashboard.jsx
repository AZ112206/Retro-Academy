function StudentDashboard({ onExit }) {
  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        <h2 style={styles.heading}>Student Mode</h2>
        <p style={styles.subtitle}>Student gameplay is not configured yet.</p>
        <button style={styles.button} onClick={onExit}>Back to Main Menu</button>
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
  button: {
    backgroundColor: '#39FF14',
    color: '#000',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
