import { useMemo, useState } from 'react';
import RetroIcon from './RetroIcon';

export default function MainMenu({ onStartSlot, onDeleteSlot, saveSlots }) {
  const [gameState, setGameState] = useState('TITLE'); // TITLE or SELECT_ROLE or SLOT_SELECT
  const [selectedRole, setSelectedRole] = useState(null);
  const [slotPrompt, setSlotPrompt] = useState(null);
  const [slotNameDraft, setSlotNameDraft] = useState('');
  const [deletePrompt, setDeletePrompt] = useState(null);

  const currentRoleSlots = useMemo(() => {
    if (!selectedRole) return [];
    return saveSlots?.[selectedRole] || [];
  }, [saveSlots, selectedRole]);

  const handleChooseRole = (role) => {
    setSelectedRole(role);
    setGameState('SLOT_SELECT');
  };

  const handleSlotClick = (slotIndex) => {
    const slotEntry = currentRoleSlots[slotIndex];
    if (slotEntry) {
      onStartSlot({
        role: selectedRole,
        slotIndex,
        slotName: slotEntry.slotName,
        saveData: slotEntry.saveData || null
      });
      return;
    }

    setSlotPrompt({ slotIndex });
    setSlotNameDraft('');
  };

  const handleCreateSlot = () => {
    const trimmedName = slotNameDraft.trim();
    if (!trimmedName || !slotPrompt) return;

    onStartSlot({
      role: selectedRole,
      slotIndex: slotPrompt.slotIndex,
      slotName: trimmedName,
      saveData: null
    });
    setSlotPrompt(null);
    setSlotNameDraft('');
  };

  const handleDeleteConfirm = () => {
    if (!deletePrompt) return;
    onDeleteSlot(selectedRole, deletePrompt.slotIndex);
    setDeletePrompt(null);
  };

  const handleSlotKeyDown = (event, slotIndex) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSlotClick(slotIndex);
    }
  };

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
      ) : gameState === 'SELECT_ROLE' ? (
        <div style={styles.menuBox}>
          <h2 style={styles.heading}>CHOOSE YOUR ROLE</h2>
          <div style={styles.roleContainer}>
            <button style={styles.roleButton} onClick={() => handleChooseRole('Student')}>
              <h3 style={styles.roleTitle}><RetroIcon kind="student" /> STUDENT</h3>
              <p>Survive exams, manage your social life, and graduate without going broke.</p>
            </button>
            
            <button style={styles.roleButton} onClick={() => handleChooseRole('Teacher')}>
              <h3 style={styles.roleTitle}><RetroIcon kind="teacher" /> TEACHER</h3>
              <p>Manage classroom chaos, grade papers, and keep your sanity intact.</p>
            </button>
          </div>
          <button style={styles.backButton} onClick={() => setGameState('TITLE')}>
            BACK TO MAIN MENU
          </button>
        </div>
      ) : (
        <div style={styles.menuBox}>
          <h2 style={styles.heading}>{selectedRole?.toUpperCase()} GAME SLOTS</h2>
          <p style={styles.subtitle}>Choose one of four retro save slots. Reloading the page clears every slot and all unsaved progress.</p>

          <div style={styles.slotGrid}>
            {Array.from({ length: 4 }, (_, index) => {
              const entry = currentRoleSlots[index];
              return (
                <div
                  key={`slot-${index}`}
                  role="button"
                  tabIndex={0}
                  style={styles.slotCard}
                  onClick={() => handleSlotClick(index)}
                  onKeyDown={(event) => handleSlotKeyDown(event, index)}
                >
                  <div style={styles.slotHeader}>
                    <span style={styles.slotIndex}>SLOT {index + 1}</span>
                    {entry && (
                      <button
                        type="button"
                        style={styles.trashButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          setDeletePrompt({ slotIndex: index, slotName: entry.slotName });
                        }}
                      >
                        <RetroIcon kind="trash" size={22} />
                      </button>
                    )}
                  </div>
                  <div style={styles.slotBody}>
                    <p style={styles.slotName}>{entry?.slotName || 'EMPTY'}</p>
                    <p style={styles.slotMeta}>
                      {entry?.updatedAt ? `Saved ${new Date(entry.updatedAt).toLocaleDateString()} ${new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Click to create a new game'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button style={styles.backButton} onClick={() => setGameState('SELECT_ROLE')}>
            BACK TO ROLE SELECT
          </button>

          {slotPrompt && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalBox}>
                <h3 style={styles.modalHeading}>NAME YOUR GAME</h3>
                <input
                  autoFocus
                  value={slotNameDraft}
                  onChange={(event) => setSlotNameDraft(event.target.value.slice(0, 24))}
                  placeholder="Enter save name"
                  style={styles.input}
                />
                <div style={styles.modalActions}>
                  <button style={styles.modalCancel} onClick={() => setSlotPrompt(null)}>CANCEL</button>
                  <button style={styles.modalOk} onClick={handleCreateSlot}>OK</button>
                </div>
              </div>
            </div>
          )}

          {deletePrompt && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalBox}>
                <h3 style={styles.modalHeading}>ARE YOU SURE?</h3>
                <div style={styles.modalMessageBox}>Delete {deletePrompt.slotName} from Slot {deletePrompt.slotIndex + 1}?</div>
                <div style={styles.modalActions}>
                  <button style={styles.modalCancel} onClick={() => setDeletePrompt(null)}>NO</button>
                  <button style={styles.deleteConfirm} onClick={handleDeleteConfirm}>YES</button>
                </div>
              </div>
            </div>
          )}
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
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '18px',
    marginBottom: '28px'
  },
  slotCard: {
    backgroundColor: '#222',
    color: '#39FF14',
    border: '2px solid #39FF14',
    padding: '18px',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: '8px',
    minHeight: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    outline: 'none'
  },
  slotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px'
  },
  slotIndex: {
    color: '#a7d89f',
    fontSize: '0.82rem',
    letterSpacing: '1px'
  },
  trashButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    padding: 0,
    lineHeight: 0,
    flex: '0 0 34px',
    borderRadius: '6px',
    border: '1px solid #ff5a5a',
    backgroundColor: '#271414',
    cursor: 'pointer',
    alignSelf: 'center'
  },
  slotBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  slotName: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#f5f1dd',
    fontWeight: 'bold'
  },
  slotMeta: {
    margin: 0,
    color: '#9acb92',
    fontSize: '0.82rem',
    lineHeight: 1.5
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
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.82)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    zIndex: 50
  },
  modalBox: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#161616',
    border: '2px solid #39FF14',
    borderRadius: '10px',
    padding: '24px',
    boxShadow: '0 0 20px rgba(57,255,20,0.16)'
  },
  modalHeading: {
    margin: '0 0 16px',
    color: '#39FF14',
    letterSpacing: '1px'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#101010',
    color: '#f5f1dd',
    border: '1px solid #39FF14',
    borderRadius: '6px',
    padding: '12px 14px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    marginBottom: '18px'
  },
  modalMessageBox: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#101010',
    color: '#f5f1dd',
    border: '1px solid #39FF14',
    borderRadius: '6px',
    padding: '12px 14px',
    fontFamily: 'inherit',
    fontSize: '1rem',
    marginBottom: '18px',
    textAlign: 'left',
    lineHeight: 1.45
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  },
  modalCancel: {
    backgroundColor: 'transparent',
    color: '#ddd',
    border: '1px solid #888',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  modalOk: {
    backgroundColor: '#39FF14',
    color: '#000',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 'bold'
  },
  deleteConfirm: {
    backgroundColor: '#FF5A5A',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 'bold'
  }
};