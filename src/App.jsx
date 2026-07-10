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

  return (
    <div id="root">
      {!currentRole ? (
        /* 1. Show Main Menu if no role is chosen */
        <MainMenu onSelectRole={handleSelectRole} />
      ) : currentRole === 'Teacher' ? (
        /* 2. Show the Teacher Setup / Dashboard */
        <TeacherDashboard onExit={handleExitGame} />
      ) : currentRole === 'Student' ? (
        /* 3. Show Student Gameplay Loop */
        <StudentDashboard onExit={handleExitGame} />
      ) : (
        /* Fallback safety net */
        <div>
          <h2>Unknown Mode</h2>
          <button onClick={handleExitGame}>Return to Menu</button>
        </div>
      )}
    </div>
  );
}

export default App;