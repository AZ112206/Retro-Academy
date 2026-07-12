// src/App.jsx
import { useEffect, useMemo, useState } from 'react';
import MainMenu from './components/MainMenu';
import TeacherDashboard from './components/Teacher Set Up/TeacherDashboard';
import StudentDashboard from './components/Student Mode/StudentDashboard'; // Placeholder for next step

const SAVE_STORAGE_KEY = 'retro_academy_save_slots_v1';
const ACTIVE_SESSION_KEY = 'retro_academy_active_session_v1';

function createEmptySaveSlots() {
  return {
    Teacher: Array(4).fill(null),
    Student: Array(4).fill(null)
  };
}

function loadSaveSlots() {
  return createEmptySaveSlots();
}

function persistSaveSlots() {}

function loadActiveSession() { return null; }

function persistActiveSession() {}

function App() {
  const initialSlots = useMemo(() => loadSaveSlots(), []);
  const initialSession = useMemo(() => loadActiveSession(initialSlots), [initialSlots]);
  const [currentRole, setCurrentRole] = useState(initialSession?.role || null);
  const [saveSlots, setSaveSlots] = useState(initialSlots);
  const [activeSlot, setActiveSlot] = useState(initialSession?.activeSlot || null);
  const [sessionSnapshot, setSessionSnapshot] = useState(initialSession?.sessionSnapshot || null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    try {
      window.localStorage.removeItem(SAVE_STORAGE_KEY);
      window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // Ignore storage cleanup failures; runtime state remains the source of truth.
    }
  }, []);

  const handleStartSlot = ({ role, slotIndex, slotName, saveData = null }) => {
    const nextSlotEntry = {
      slotName,
      role,
      updatedAt: new Date().toISOString(),
      saveData: saveSlots?.[role]?.[slotIndex]?.saveData || saveData || null
    };
    const nextSlots = {
      ...saveSlots,
      [role]: saveSlots[role].map((entry, index) => (index === slotIndex ? nextSlotEntry : entry))
    };
    setSaveSlots(nextSlots);

    const nextActiveSlot = { role, slotIndex, slotName };
    setActiveSlot(nextActiveSlot);
    setSessionSnapshot(saveData);
    setCurrentRole(role);
    setSaveMessage('');
    persistActiveSession(nextActiveSlot);
  };

  const handleExitGame = () => {
    setCurrentRole(null);
    setActiveSlot(null);
    setSessionSnapshot(null);
    setSaveMessage('');
    persistActiveSession(null);
  };

  const handleDeleteSlot = (role, slotIndex) => {
    const nextSlots = {
      ...saveSlots,
      [role]: saveSlots[role].map((entry, index) => (index === slotIndex ? null : entry))
    };
    setSaveSlots(nextSlots);
    persistSaveSlots(nextSlots);
  };

  const handleSaveGame = () => {
    if (!activeSlot || !currentRole) return;

    const nextSlots = {
      ...saveSlots,
      [activeSlot.role]: saveSlots[activeSlot.role].map((entry, index) => {
        if (index !== activeSlot.slotIndex) return entry;
        return {
          slotName: activeSlot.slotName,
          role: activeSlot.role,
          updatedAt: new Date().toISOString(),
          saveData: sessionSnapshot
        };
      })
    };

    setSaveSlots(nextSlots);
    persistActiveSession(activeSlot);
    setSaveMessage(`Saved to ${activeSlot.slotName}`);
    window.setTimeout(() => setSaveMessage(''), 1800);
  };

  useEffect(() => {
    persistSaveSlots(saveSlots);
  }, [saveSlots]);

  const currentSlotLabel = useMemo(() => activeSlot?.slotName || '', [activeSlot]);

  // Cross-platform styling overlay wrapper ensuring clean centering on windows + touch devices
  const appWrapperStyle = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    padding: '24px'
  };

  return (
    <div style={appWrapperStyle}>
      {!currentRole ? (
        /* 1. Show Main Menu if no role is chosen */
        <MainMenu onStartSlot={handleStartSlot} onDeleteSlot={handleDeleteSlot} saveSlots={saveSlots} />
      ) : currentRole === 'Teacher' ? (
        /* 2. Show the Teacher Setup / Dashboard / 2D Moving Engine Overworld */
        <TeacherDashboard onExit={handleExitGame} initialData={sessionSnapshot} onStateChange={setSessionSnapshot} onSaveGame={handleSaveGame} activeSlotLabel={currentSlotLabel} saveMessage={saveMessage} />
      ) : currentRole === 'Student' ? (
        /* 3. Show Student Gameplay Loop */
        <StudentDashboard onExit={handleExitGame} initialData={sessionSnapshot} onStateChange={setSessionSnapshot} onSaveGame={handleSaveGame} activeSlotLabel={currentSlotLabel} saveMessage={saveMessage} />
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