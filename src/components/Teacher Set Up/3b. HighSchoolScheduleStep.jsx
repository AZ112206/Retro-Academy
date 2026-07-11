import React, { useState } from 'react';

const DEPARTMENTS = [
  { id: 'math', name: '📐 Math Dept' },
  { id: 'science', name: '🧪 Science Dept' },
  { id: 'history', name: '📜 History Dept' },
  { id: 'english', name: '📝 English Dept' },
  { id: 'language', name: '🗣️ Foreign Lang Dept' }
];

const POOL_EXPANSIONS = {
  math: [
    { name: 'Algebra I', grade: '9th' },
    { name: 'Geometry', grade: '10th' },
    { name: 'Algebra II', grade: '11th' },
    { name: 'Trigonometry', grade: '11th' },
    { name: 'Pre-Calculus', grade: '12th' },
    { name: 'Calculus', grade: '12th' }
  ],
  science: [
    { name: 'Earth Science', grade: '9th' },
    { name: 'Biology', grade: '10th' },
    { name: 'Chemistry', grade: '11th' },
    { name: 'Physics', grade: '12th' }
  ],
  history: [
    { name: 'World History', grade: '9th' },
    { name: 'Modern World History', grade: '10th' },
    { name: 'US History', grade: '11th' },
    { name: 'Civics & Econ', grade: '12th' }
  ],
  english: [
    { name: 'English I', grade: '9th' },
    { name: 'English II', grade: '10th' },
    { name: 'English III', grade: '11th' },
    { name: 'English IV', grade: '12th' },
    { name: 'Creative Writing', grade: '12th' }
  ],
  language: [
    { name: 'Spanish I', grade: '9th' },
    { name: 'French I', grade: '9th' },
    { name: 'Spanish II', grade: '10th' },
    { name: 'French II', grade: '10th' },
    { name: 'Conversational Fluency', grade: '11th' }
  ]
};

const PERIOD_TIMES = {
  period1: { label: 'Period 1', time: '8:00 AM - 9:15 AM', length: 'Short Block' },
  period2: { label: 'Period 2', time: '9:20 AM - 10:35 AM', length: 'Short Block' },
  period3: { label: 'Period 3', time: '10:40 AM - 12:40 PM', length: '🔥 Long Block (Lunch Split)' },
  period4: { label: 'Period 4', time: '12:45 PM - 2:00 PM', length: 'Short Block' }
};

const LUNCH_WAVE_TIMES = {
  'Wave 1': '10:40 AM - 11:10 AM',
  'Wave 2': '11:10 AM - 11:40 AM',
  'Wave 3': '11:40 AM - 12:10 PM',
  'Wave 4': '12:10 PM - 12:40 PM'
};

export default function HighSchoolScheduleStep({ onLaunchGame, onBack, onExit, styles }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [confirmedDept, setConfirmedDept] = useState(false); // Tracks if player hit NEXT
  const [currentTokens, setCurrentTokens] = useState([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [randomLunchWave, setRandomLunchWave] = useState('');

  const [schedule, setSchedule] = useState({
    period1: null,
    period2: null,
    period3: null, 
    period4: null
  });

  const handleShuffleCatalog = (deptId, isInitialLoad = false) => {
    if (!isInitialLoad && shuffleCount >= 3) {
      alert('⚠️ Administration Notice: You have exhausted your 3-shuffle limit for this scheduling draft!');
      return;
    }

    const basePool = POOL_EXPANSIONS[deptId] || [];
    const shuffledBase = [...basePool].sort(() => Math.random() - 0.5);
    const selectedBases = shuffledBase.slice(0, 2); 

    const generatedTokens = [];
    let sectionIdCounter = 101;

    selectedBases.forEach(base => {
      ['Standard', 'Honors', 'Advanced'].forEach(level => {
        generatedTokens.push({
          name: base.name,
          grade: base.grade,
          level: level,
          sec: `#${sectionIdCounter++}`
        });
      });
    });

    setCurrentTokens(generatedTokens);
    if (!isInitialLoad) {
      setShuffleCount(prev => prev + 1);
    }
  };

  // Handles clicking a department slot (Updates visuals only)
  const handleSelectDept = (deptId) => {
    setSelectedDept(deptId);
  };

  // Triggered when hitting the action confirmation button
  const handleConfirmNextStep = () => {
    if (!selectedDept) return;
    setShuffleCount(0);
    setSchedule({
      period1: null,
      period2: null,
      period3: null,
      period4: null
    });
    handleShuffleCatalog(selectedDept, true);
    setConfirmedDept(true); // Transitions to interactive matrix step
  };

  const checkDuplicateLimit = (itemData, targetPeriod) => {
    let matches = 0;
    Object.entries(schedule).forEach(([pKey, slot]) => {
      if (pKey !== targetPeriod && slot && slot.name === itemData.name && slot.level === itemData.level) {
        matches++;
      }
    });
    return matches >= 2;
  };

  const countPrepBlocks = () => {
    return Object.values(schedule).filter(slot => slot?.isPrep).length;
  };

  const handleDragStart = (e, itemData) => {
    e.dataTransfer.setData('application/json', JSON.stringify(itemData));
  };

  const handleDrop = (e, targetPeriod) => {
    e.preventDefault();
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('application/json'));

      if (itemData.isPrep) {
        if (countPrepBlocks() >= 1 && !schedule[targetPeriod]?.isPrep) {
          alert('Administrative Block: You can only have 1 designated Prep Block!');
          return;
        }
      } else {
        if (checkDuplicateLimit(itemData, targetPeriod)) {
          alert(`Administrative Block: You cannot exceed 2 concurrent sections of ${itemData.name} (${itemData.level})!`);
          return;
        }
      }

      setSchedule(prev => ({ ...prev, [targetPeriod]: itemData }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToReview = () => {
    if (countPrepBlocks() !== 1) {
      alert('⚠️ Mandatory Warning: Your schedule is invalid! You MUST include exactly 1 Teacher Prep Block.');
      return;
    }
    const rolledWave = `Wave ${Math.floor(Math.random() * 4) + 1}`;
    setRandomLunchWave(rolledWave);
    setReviewMode(true);
  };

  const getRotatedClass = (dayIndex, displayPeriodIndex) => {
    const sequenceKeys = ['period1', 'period2', 'period3', 'period4'];
    const targetedIndex = (displayPeriodIndex - dayIndex + 4) % 4;
    return schedule[sequenceKeys[targetedIndex]];
  };

  const getLevelColor = (level) => {
    if (level === 'Advanced') return '#FF3333';
    if (level === 'Honors') return '#00FFFF';
    return '#39FF14'; 
  };

  // ----------------------------------------------------------------
  // PHASE 1: DEPARTMENT GRID
  // ----------------------------------------------------------------
  if (!confirmedDept) {
    return (
      <div style={styles.setupBox}>
        <h2 style={styles.heading}>🎓 HIGH SCHOOL DEPARTMENTS</h2>
        <p style={styles.subtitle}>Select your specialization branch to load into the dashboard.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginTop: '20px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '500px', justifyContent: 'center' }}>
            {DEPARTMENTS.slice(0, 3).map(dept => (
              <button 
                key={dept.id} 
                style={{ 
                  ...styles.menuButton, 
                  flex: 1, 
                  textAlign: 'center', 
                  padding: '20px',
                  borderColor: selectedDept === dept.id ? '#fff' : '#39FF14',
                  backgroundColor: selectedDept === dept.id ? '#2d2d2d' : '#222',
                  color: selectedDept === dept.id ? '#fff' : '#39FF14'
                }} 
                onClick={() => handleSelectDept(dept.id)}
              >
                {dept.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '500px', justifyContent: 'center' }}>
            {DEPARTMENTS.slice(3, 5).map(dept => (
              <button 
                key={dept.id} 
                style={{ 
                  ...styles.menuButton, 
                  flex: 1, 
                  textAlign: 'center', 
                  padding: '20px',
                  borderColor: selectedDept === dept.id ? '#fff' : '#39FF14',
                  backgroundColor: selectedDept === dept.id ? '#2d2d2d' : '#222',
                  color: selectedDept === dept.id ? '#fff' : '#39FF14'
                }} 
                onClick={() => handleSelectDept(dept.id)}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic validation button built identically to GradeConfigStep structure */}
        <button 
          style={{ 
            ...styles.actionButton, 
            marginTop: '25px', 
            width: '100%',
            maxWidth: '500px', 
            opacity: !selectedDept ? 0.5 : 1 
          }}
          disabled={!selectedDept}
          onClick={handleConfirmNextStep}
        >
          NEXT: GENERATE SCHEDULE ➡️
        </button>

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 220px' }} onClick={onBack}>
            ← BACK
          </button>
          <button style={{ ...styles.exitButton, flex: '1 1 220px' }} onClick={onExit}>
            RETURN TO MAIN MENU
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // PHASE 3: FINAL CONTRACT REVIEW
  // ----------------------------------------------------------------
  if (reviewMode) {
    return (
      <div style={{ ...styles.setupBox, maxWidth: '950px' }}>
        <h2 style={styles.heading}>📋 SIGN OFFICIAL COVENANT MATRIX</h2>
        <p style={styles.subtitle}>Review your rotating 4x4 block timeline rotation matrix profiles below.</p>
        
        <div style={{ backgroundColor: '#111', border: '2px solid #39FF14', padding: '20px', borderRadius: '8px', margin: '20px auto', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ color: '#39FF14', margin: 0 }}>📅 4x4 True Rotational Matrix Grid</h3>
            <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem', color: '#fff' }}>
              📍 Room Assignment: <strong style={{ color: '#ffa500' }}>{randomLunchWave}</strong> ({LUNCH_WAVE_TIMES[randomLunchWave] || ''})
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #39FF14' }}>
                <th style={{ padding: '10px', color: '#888', width: '24%' }}>BLOCK DETAILS</th>
                {['Day 1', 'Day 2', 'Day 3', 'Day 4'].map(day => (
                  <th key={day} style={{ padding: '10px', fontWeight: 'bold', color: '#39FF14', textTransform: 'uppercase', width: '19%' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(PERIOD_TIMES).map(([pKey, details], pIdx) => {
                const isP3 = pKey === 'period3';

                return (
                  <tr key={pKey} style={{ borderBottom: '1px solid #222', backgroundColor: isP3 ? '#162510' : 'transparent' }}>
                    <td style={{ padding: '12px 10px', borderRight: '1px solid #222' }}>
                      <div style={{ fontWeight: 'bold', color: isP3 ? '#39FF14' : '#fff' }}>{details.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '2px' }}>{details.time}</div>
                      <div style={{ fontSize: '0.7rem', color: isP3 ? '#ffa500' : '#666', fontStyle: 'italic', marginTop: '2px' }}>
                        {isP3 ? `🍱 Lunch: ${LUNCH_WAVE_TIMES[randomLunchWave]}` : details.length}
                      </div>
                    </td>

                    {['Day 1', 'Day 2', 'Day 3', 'Day 4'].map((day, dayIdx) => {
                      const rotatingItem = getRotatedClass(dayIdx, pIdx);

                      return (
                        <td key={day} style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                          {rotatingItem ? (
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: rotatingItem.isPrep ? '#aaa' : '#fff' }}>
                                {rotatingItem.name}
                              </div>
                              {!rotatingItem.isPrep && (
                                <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: '500', color: getLevelColor(rotatingItem.level) }}>
                                  [{rotatingItem.level}] - {rotatingItem.grade}
                                </div>
                              )}
                              {isP3 && (
                                <span style={{ display: 'inline-block', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px', marginTop: '4px' }}>
                                  Splits for Lunch
                                </span>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#444', fontStyle: 'italic', fontSize: '0.8rem' }}>Unscheduled</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1a1a1a', borderRadius: '4px', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
            💡 <strong>Matrix Core Rotation Rule:</strong> Class assets cycle positions forward each successive instructional day. Your assigned designated room window remains localized to <strong style={{ color: '#ffa500' }}>{randomLunchWave}</strong> during the fixed middle block time window from day to day.
          </div>
        </div>

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={() => setReviewMode(false)}>MODIFY GRID</button>
          <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
          <button style={{ ...styles.actionButton, flex: '2 1 240px' }} onClick={() => onLaunchGame({ selectedDept, randomLunchWave })}>
            🚀 SIGN CONTRACT & ENTER WORLD
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // PHASE 2: ACTIVE MATRIX INTERACTIVE DRAG MATRIX
  // ----------------------------------------------------------------
  return (
    <div style={{ ...styles.setupBox, maxWidth: '950px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #39FF14', paddingBottom: '10px', marginBottom: '15px' }}>
        <h2 style={{ ...styles.heading, margin: 0 }}>⚖️ MATRIX SCHEDULER</h2>
        <button 
          onClick={() => handleShuffleCatalog(selectedDept)} 
          disabled={shuffleCount >= 3}
          style={{ 
            backgroundColor: 'transparent', 
            color: shuffleCount >= 3 ? '#555' : '#39FF14', 
            border: shuffleCount >= 3 ? '1px dashed #555' : '1px dashed #39FF14', 
            padding: '6px 12px', 
            borderRadius: '4px', 
            cursor: shuffleCount >= 3 ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold', 
            fontFamily: 'inherit' 
          }}
        >
          🔄 SHUFFLE TOKENS ({shuffleCount}/3 LIMIT)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '6px', border: '1px solid #39FF14' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#39FF14', margin: '0 0 15px 0' }}>📦 DRAGGABLE TOKENS (6 Available)</h3>
          
          <div 
            draggable 
            onDragStart={(e) => handleDragStart(e, { name: '☕ Teacher Prep Block', isPrep: true })}
            style={{ padding: '10px', backgroundColor: '#333', border: '2px dashed #aaa', borderRadius: '4px', cursor: 'grab', marginBottom: '15px', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}
          >
            move block
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
            {currentTokens.map((course, i) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => handleDragStart(e, course)}
                style={{
                  padding: '8px',
                  backgroundColor: '#121212',
                  border: `1px solid ${course.level === 'Advanced' ? '#FF3333' : course.level === 'Honors' ? '#00FFFF' : '#39FF14'}`,
                  borderRadius: '4px',
                  cursor: 'grab'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  <span>{course.name} {course.sec}</span>
                  <span style={{ color: '#888' }}>{course.grade}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '2px' }}>Level Track: {course.level}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['period1', 'period2', 'period3', 'period4'].map((pKey, idx) => {
            const isP3 = pKey === 'period3';
            const filledItem = schedule[pKey];

            return (
              <div
                key={pKey}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, pKey)}
                style={{
                  minHeight: isP3 ? '95px' : '65px',
                  backgroundColor: isP3 ? '#1b2d14' : '#1a1a1a',
                  border: isP3 ? '2px dashed #39FF14' : '1px solid #444',
                  borderRadius: '6px',
                  padding: '10px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#888', position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', width: '100%', textAlign: 'center', padding: '0 10px' }}>
                  PERIOD {idx + 1} {isP3 ? '🔥 FIXED MIDDLE LONG BLOCK (LUNCH SPLIT)' : '(SHORT BLOCK)'}
                </span>

                {filledItem ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '18px' }}>
                    <div>
                      <strong style={{ color: '#fff' }}>{filledItem.name}</strong>
                      {!filledItem.isPrep && <div style={{ fontSize: '0.8rem', color: '#39FF14', marginTop: '4px' }}>[{filledItem.level}] - {filledItem.grade}</div>}
                    </div>
                    <button onClick={() => setSchedule(prev => ({ ...prev, [pKey]: null }))} style={{ background: 'transparent', color: '#FF3333', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>[X]</button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#555', fontStyle: 'italic', fontSize: '0.85rem', marginTop: '10px' }}>
                    Drop token card asset here...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.footerActions}>
        <button
          style={{ ...styles.backButton, flex: '1 1 180px' }}
          onClick={() => {
            setConfirmedDept(false);
            setReviewMode(false);
          }}
        >
          ← BACK
        </button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>
          RETURN TO MAIN MENU
        </button>
        <button 
          style={{ ...styles.actionButton, flex: '2 1 240px' }}
          onClick={handleProceedToReview}
        >
          ➡️ PROCEED TO CONTRACT REVIEW
        </button>
      </div>
    </div>
  );
}