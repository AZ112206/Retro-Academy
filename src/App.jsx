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

function isValidSlotArray(value) {
  return Array.isArray(value) && value.length === 4;
}

function normalizeSaveSlots(rawValue) {
  const fallback = createEmptySaveSlots();
  if (!rawValue || typeof rawValue !== 'object') return fallback;

  return {
    Teacher: isValidSlotArray(rawValue.Teacher) ? rawValue.Teacher : fallback.Teacher,
    Student: isValidSlotArray(rawValue.Student) ? rawValue.Student : fallback.Student
  };
}

function getDefaultSessionSnapshot(role) {
  if (role === 'Teacher') {
    return {
      step: 'SCHOOL_TYPE',
      schoolType: null,
      elementaryGrade: null,
      middleGrade: null,
      middleLunchWave: '',
      highGrade: null,
      highLetterRange: '',
      highSchoolDept: null,
      lunchWave: '',
      selectedClass: null,
      highScheduleContract: null,
      teacherProfile: null,
      schoolDirectoryData: null
    };
  }

  if (role === 'Student') {
    return {
      step: 'STUDENT_DASHBOARD'
    };
  }

  return null;
}

function loadSaveSlots() {
  try {
    const raw = window.localStorage.getItem(SAVE_STORAGE_KEY);
    if (!raw) return createEmptySaveSlots();
    return normalizeSaveSlots(JSON.parse(raw));
  } catch {
    return createEmptySaveSlots();
  }
}

function persistSaveSlots(saveSlots) {
  try {
    window.localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(normalizeSaveSlots(saveSlots)));
  } catch {
    // Ignore storage failures; in-memory state remains usable.
  }
}

function persistActiveSession(activeSlot, sessionSnapshot = null) {
  try {
    if (!activeSlot) {
      window.localStorage.removeItem(ACTIVE_SESSION_KEY);
      return;
    }

    window.localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({
      activeSlot,
      sessionSnapshot
    }));
  } catch {
    // Ignore storage failures; in-memory state remains usable.
  }
}

function App() {
  const initialSlots = useMemo(() => loadSaveSlots(), []);
  const [currentRole, setCurrentRole] = useState(null);
  const [saveSlots, setSaveSlots] = useState(initialSlots);
  const [activeSlot, setActiveSlot] = useState(null);
  const [sessionSnapshot, setSessionSnapshot] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);

  const handleStartSlot = ({ role, slotIndex, slotName, saveData = null, restart = false }) => {
    const fallbackSnapshot = getDefaultSessionSnapshot(role);
    const resolvedSaveData = restart
      ? fallbackSnapshot
      : (saveSlots?.[role]?.[slotIndex]?.saveData || saveData || fallbackSnapshot);
    const nextSlotEntry = {
      slotName,
      role,
      updatedAt: new Date().toISOString(),
      saveData: resolvedSaveData
    };
    const nextSlots = {
      ...saveSlots,
      [role]: saveSlots[role].map((entry, index) => (index === slotIndex ? nextSlotEntry : entry))
    };
    setSaveSlots(nextSlots);

    const nextActiveSlot = { role, slotIndex, slotName };
    setActiveSlot(nextActiveSlot);
    setSessionSnapshot(resolvedSaveData);
    setCurrentRole(role);
    setSaveMessage('');

    persistSaveSlots(nextSlots);
    persistActiveSession(nextActiveSlot, resolvedSaveData);
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

    if (activeSlot?.role === role && activeSlot?.slotIndex === slotIndex) {
      setCurrentRole(null);
      setActiveSlot(null);
      setSessionSnapshot(null);
      setSaveMessage('');
      persistActiveSession(null);
    }
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
    persistSaveSlots(nextSlots);
    persistActiveSession(activeSlot, sessionSnapshot);
    setSaveMessage(`Saved ${activeSlot.slotName}. You will return to this same screen when you load this slot.`);
    setShowSavePopup(true);
    window.setTimeout(() => setShowSavePopup(false), 3000);
  };

  useEffect(() => {
    persistSaveSlots(saveSlots);
  }, [saveSlots]);

  useEffect(() => {
    persistActiveSession(null);
  }, []);

  useEffect(() => {
    if (!activeSlot || !currentRole) return;
    persistActiveSession(activeSlot, sessionSnapshot);
  }, [activeSlot, currentRole, sessionSnapshot]);

  useEffect(() => {
    if (!activeSlot || !currentRole || !sessionSnapshot) return;

    setSaveSlots((prevSlots) => {
      const roleSlots = prevSlots?.[activeSlot.role] || [];
      const currentEntry = roleSlots[activeSlot.slotIndex];
      if (!currentEntry) return prevSlots;
      if (currentEntry.saveData === sessionSnapshot && currentEntry.slotName === activeSlot.slotName) {
        return prevSlots;
      }

      return {
        ...prevSlots,
        [activeSlot.role]: roleSlots.map((entry, index) => {
          if (index !== activeSlot.slotIndex) return entry;
          return {
            slotName: activeSlot.slotName,
            role: activeSlot.role,
            updatedAt: entry?.updatedAt || new Date().toISOString(),
            saveData: sessionSnapshot
          };
        })
      };
    });
  }, [activeSlot, currentRole, sessionSnapshot]);

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

      {showSavePopup && (
        <div style={savePopupStyles.modalOverlay}>
          <div style={savePopupStyles.modalBox}>
            <h3 style={savePopupStyles.modalHeading}>SAVE COMPLETE</h3>
            <p style={savePopupStyles.modalText}>
              {saveMessage || 'Your game was saved successfully.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const savePopupStyles = {
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  modalBox: {
    width: '100%',
    maxWidth: '460px',
    border: '2px solid #39FF14',
    borderRadius: '8px',
    backgroundColor: '#111',
    padding: '26px',
    boxShadow: '0 0 20px rgba(57, 255, 20, 0.25)',
    textAlign: 'center',
    fontFamily: '"Courier New", Courier, monospace'
  },
  modalHeading: {
    margin: 0,
    color: '#39FF14',
    letterSpacing: '1px'
  },
  modalText: {
    margin: '10px 0 0',
    color: '#f5f1dd',
    fontSize: '0.9rem',
    lineHeight: 1.5
  }
};

export default App;