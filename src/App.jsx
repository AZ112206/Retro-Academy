// src/App.jsx
import { useState } from 'react';
import MainMenu from './components/MainMenu';
import TeacherDashboard from './components/Teacher Set Up/TeacherDashboard';
import StudentDashboard from './components/Student Mode/StudentDashboard'; // Placeholder for next step

function App() {
  const [currentRole, setCurrentRole] = useState(null);

  const handleSelectRole = (role) => {
    setCurrentRole(role); 
  };

  const handleExitGame = () => {
    setCurrentRole(null);
  };

  // Cross-platform styling overlay wrapper ensuring clean centering on windows + touch devices
  const appWrapperStyle = {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'hidden',
    boxSizing: 'border-box'
  };

  return (
    <div style={appWrapperStyle} id="root">
      {!currentRole ? (
        /* 1. Show Main Menu if no role is chosen */
        <MainMenu onSelectRole={handleSelectRole} />
      ) : currentRole === 'Teacher' ? (
        /* 2. Show the Teacher Setup / Dashboard / 2D Moving Engine Overworld */
        <TeacherDashboard onExit={handleExitGame} />
      ) : currentRole === 'Student' ? (
        /* 3. Show Student Gameplay Loop */
        <StudentDashboard onExit={handleExitGame} />
      ) : (
        /* Fallback safety net */
        <div style={{ color: '#FF3333', fontFamily: 'monospace', textAlign: 'center' }}>
          <h2>⚠️ Client Architecture Error</h2>
          <p>Unknown mode routing token requested.</p>
          <button 
            style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', padding: '10px 20px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '10px' }} 
            onClick={handleExitGame}
          >
            Return to Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default App;