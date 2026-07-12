import React, { useEffect, useState } from 'react';
import RetroIcon, { RetroArrow, RetroClose } from '../RetroIcon';

const DEPARTMENTS = [
  { id: 'math', name: 'Math Dept', icon: 'math', code: 'MATH' },
  { id: 'science', name: 'Science Dept', icon: 'science', code: 'SCI' },
  { id: 'history', name: 'History Dept', icon: 'history', code: 'HIST' },
  { id: 'english', name: 'English Dept', icon: 'book', code: 'ENG' },
  { id: 'language', name: 'Foreign Lang Dept', icon: 'language', code: 'LANG' }
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

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const SLOT_KEYS = Array.from({ length: 10 }, (_, idx) => `slot${idx + 1}`);
const PERIOD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const PERIOD_KEYS = PERIOD_LETTERS.map((letter) => `period${letter}`);

const DAY_PATTERNS = [
  { day: 'Monday', offset: 0, doublePairs: [[0, 1], [8, 9]] },
  { day: 'Tuesday', offset: 1, doublePairs: [[1, 2], [6, 7]] },
  { day: 'Wednesday', offset: 4, doublePairs: [[4, 5]] },
  { day: 'Thursday', offset: 2, doublePairs: [[2, 3], [7, 8]] },
  { day: 'Friday', offset: 0, doublePairs: [[0, 1], [8, 9]] }
];

const LUNCH_WAVE_DAY_TIMES = {
  'Wave 1': {
    Monday: '10:30 AM - 11:10 AM',
    Tuesday: '10:35 AM - 11:15 AM',
    Wednesday: '10:40 AM - 11:20 AM',
    Thursday: '10:45 AM - 11:25 AM',
    Friday: '10:50 AM - 11:30 AM'
  },
  'Wave 2': {
    Monday: '11:10 AM - 11:50 AM',
    Tuesday: '11:15 AM - 11:55 AM',
    Wednesday: '11:20 AM - 12:00 PM',
    Thursday: '11:25 AM - 12:05 PM',
    Friday: '11:30 AM - 12:10 PM'
  },
  'Wave 3': {
    Monday: '11:50 AM - 12:30 PM',
    Tuesday: '11:55 AM - 12:35 PM',
    Wednesday: '12:00 PM - 12:40 PM',
    Thursday: '12:05 PM - 12:45 PM',
    Friday: '12:10 PM - 12:50 PM'
  },
  'Wave 4': {
    Monday: '12:30 PM - 1:10 PM',
    Tuesday: '12:35 PM - 1:15 PM',
    Wednesday: '12:40 PM - 1:20 PM',
    Thursday: '12:45 PM - 1:25 PM',
    Friday: '12:50 PM - 1:30 PM'
  }
};

const PERIOD_SLOT_TIMES = [
  '7:50 AM - 8:30 AM',
  '8:30 AM - 9:10 AM',
  '9:10 AM - 9:50 AM',
  '9:50 AM - 10:30 AM',
  '10:30 AM - 11:10 AM',
  '11:10 AM - 11:50 AM',
  '11:50 AM - 12:30 PM',
  '12:30 PM - 1:10 PM',
  '1:10 PM - 1:50 PM',
  '1:50 PM - 2:30 PM'
];

const createEmptySchedule = () => ({
  periodA: null,
  periodB: null,
  periodC: null,
  periodD: null,
  periodE: null,
  periodF: null,
  periodG: null,
  periodH: null,
  periodI: null,
  periodJ: null
});

const periodKeyForLetter = (letter) => `period${letter}`;

function buildDayPeriodSequence(offset, doublePairs) {
  const sequence = Array(10).fill('A');
  const doubleStartSet = new Set(doublePairs.map((pair) => pair[0]));
  let letterCursor = 0;

  for (let slotIdx = 0; slotIdx < 10; slotIdx += 1) {
    const periodLetter = PERIOD_LETTERS[(offset + letterCursor) % PERIOD_LETTERS.length];
    sequence[slotIdx] = periodLetter;

    if (doubleStartSet.has(slotIdx) && slotIdx + 1 < 10) {
      sequence[slotIdx + 1] = periodLetter;
      slotIdx += 1;
    }

    letterCursor += 1;
  }

  return sequence;
}

function buildWeeklyContract(baseSchedule, lunchWave) {
  const normalizedTokens = PERIOD_LETTERS.map((letter) => {
    const key = periodKeyForLetter(letter);
    return (
      baseSchedule[key] || {
        name: `Unassigned Period ${letter}`,
        grade: '9th',
        level: 'Standard',
        sec: null,
        isPrep: false
      }
    );
  });

  const lunchByDay = LUNCH_WAVE_DAY_TIMES[lunchWave] || LUNCH_WAVE_DAY_TIMES['Wave 1'];
  const periodSequenceByDay = DAY_PATTERNS.reduce((acc, pattern) => {
    acc[pattern.day] = buildDayPeriodSequence(pattern.offset, pattern.doublePairs);
    return acc;
  }, {});
  const doubleSlotsByDay = DAY_PATTERNS.reduce((acc, pattern) => {
    const slots = new Set(pattern.doublePairs.flat());
    acc[pattern.day] = slots;
    return acc;
  }, {});
  const continuationSlotsByDay = DAY_PATTERNS.reduce((acc, pattern) => {
    const continuations = new Set(pattern.doublePairs.map((pair) => pair[1]));
    acc[pattern.day] = continuations;
    return acc;
  }, {});

  const rows = SLOT_KEYS.map((slotKey, slotIdx) => {
    const entries = WEEK_DAYS.map((dayName, dayIdx) => {
      const periodLabel = periodSequenceByDay[dayName]?.[slotIdx] || PERIOD_LETTERS[(dayIdx + slotIdx) % PERIOD_LETTERS.length];
      const sourceToken = baseSchedule[periodKeyForLetter(periodLabel)] || normalizedTokens[0];
      const isDouble = Boolean(doubleSlotsByDay[dayName]?.has(slotIdx));
      const detailParts = [
        `Period ${periodLabel}`,
        isDouble ? 'Double Block (80 min)' : 'Single Block (40 min)'
      ];

      if (slotIdx === 4 || slotIdx === 5) {
        detailParts.push(`Lunch: ${lunchByDay[dayName]}`);
      }

      return {
        ...sourceToken,
        periodLabel,
        isDouble,
        isDoubleContinuation: Boolean(continuationSlotsByDay[dayName]?.has(slotIdx)),
        detail: detailParts.join(' | ')
      };
    });

    return {
      block: `Period ${slotIdx + 1}`,
      blockKey: slotKey,
      slotIndex: slotIdx,
      time: PERIOD_SLOT_TIMES[slotIdx] || 'Assigned by District',
      entries
    };
  });

  return { rows, lunchByDay };
}

export default function HighSchoolScheduleStep({ onLaunchGame, onBack, onExit, styles, resumeData = null }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [confirmedDept, setConfirmedDept] = useState(false);
  const [currentTokens, setCurrentTokens] = useState([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [randomLunchWave, setRandomLunchWave] = useState('');
  const [lunchByDay, setLunchByDay] = useState({});
  const [weeklyRows, setWeeklyRows] = useState([]);

  const [schedule, setSchedule] = useState(createEmptySchedule());

  useEffect(() => {
    if (!resumeData?.selectedDept || !resumeData?.contractSchedule) return;

    const restoredSchedule = createEmptySchedule();
    PERIOD_KEYS.forEach((key) => {
      if (resumeData.contractSchedule[key]) restoredSchedule[key] = resumeData.contractSchedule[key];
    });

    const restoredWave = resumeData.randomLunchWave || 'Wave 1';
    const rebuiltContract = buildWeeklyContract(restoredSchedule, restoredWave);

    setSelectedDept(resumeData.selectedDept);
    setConfirmedDept(true);
    setReviewMode(true);
    setRandomLunchWave(restoredWave);
    setSchedule(restoredSchedule);
    setWeeklyRows(rebuiltContract.rows);
    setLunchByDay(rebuiltContract.lunchByDay);
    setCurrentTokens([]);
    setShuffleCount(0);
  }, [resumeData]);

  const handleShuffleCatalog = (deptId, isInitialLoad = false) => {
    if (!isInitialLoad && shuffleCount >= 3) {
      alert('Administration Notice: You have exhausted your 3-shuffle limit for this scheduling draft.');
      return;
    }

    const basePool = POOL_EXPANSIONS[deptId] || [];
    const shuffledBase = [...basePool].sort(() => Math.random() - 0.5);
    const levelPool = ['Standard', 'Honors', 'Advanced'];
    const usedSections = new Set();
    const buildRandomSection = () => {
      let candidate = '';
      do {
        candidate = `#${Math.floor(Math.random() * 900) + 100}`;
      } while (usedSections.has(candidate));
      usedSections.add(candidate);
      return candidate;
    };

    const generatedTokens = Array.from({ length: 5 }).map((_, idx) => {
      const base = shuffledBase[idx % Math.max(shuffledBase.length, 1)] || { name: 'General Elective', grade: '9th' };
      const level = levelPool[Math.floor(Math.random() * levelPool.length)];
      return {
        name: base.name,
        grade: base.grade,
        level,
        sec: buildRandomSection()
      };
    }).sort(() => Math.random() - 0.5);

    setCurrentTokens(generatedTokens);
    if (!isInitialLoad) {
      setShuffleCount(prev => prev + 1);
    }
  };

  const handleSelectDept = (deptId) => {
    if (selectedDept !== deptId) {
      setCurrentTokens([]);
      setShuffleCount(0);
      setReviewMode(false);
      setRandomLunchWave('');
      setLunchByDay({});
      setWeeklyRows([]);
      setSchedule(createEmptySchedule());
    }
    setSelectedDept(deptId);
  };

  const handleConfirmNextStep = () => {
    if (!selectedDept) return;
    setShuffleCount(0);
    setSchedule(createEmptySchedule());
    handleShuffleCatalog(selectedDept, true);
    setConfirmedDept(true);
  };

  const checkDuplicateLimit = (itemData, targetPeriod) => {
    let matches = 0;
    Object.entries(schedule).forEach(([pKey, slot]) => {
      if (pKey !== targetPeriod && slot && slot.name === itemData.name && slot.level === itemData.level) {
        matches++;
      }
    });
    return matches >= 4;
  };

  const countPrepBlocks = () => {
    return Object.values(schedule).filter(slot => slot?.isPrep).length;
  };

  const hasAllBlocksAssigned = () => {
    return PERIOD_KEYS.every((key) => Boolean(schedule[key]));
  };

  const handleDragStart = (e, itemData) => {
    e.dataTransfer.setData('application/json', JSON.stringify(itemData));
  };

  const handleDrop = (e, targetPeriod) => {
    e.preventDefault();
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('application/json'));

      if (itemData.isPrep) {
        if (countPrepBlocks() >= 2 && !schedule[targetPeriod]?.isPrep) {
          alert('Administrative Block: You can only have up to 2 designated Prep / Study Hall periods!');
          return;
        }
      } else {
        if (checkDuplicateLimit(itemData, targetPeriod)) {
          alert(`Administrative Block: You cannot exceed 4 concurrent sections of ${itemData.name} (${itemData.level})!`);
          return;
        }
      }

      setSchedule(prev => ({ ...prev, [targetPeriod]: itemData }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToReview = () => {
    if (!hasAllBlocksAssigned()) {
      alert('Mandatory Warning: Assign a class or prep token to every period A-J before review.');
      return;
    }

    if (countPrepBlocks() > 2) {
      alert('Mandatory Warning: You can include up to 2 Teacher Prep / Study Hall periods.');
      return;
    }

    const rolledWave = `Wave ${Math.floor(Math.random() * 4) + 1}`;
    const contract = buildWeeklyContract(schedule, rolledWave);

    setRandomLunchWave(rolledWave);
    setLunchByDay(contract.lunchByDay);
    setWeeklyRows(contract.rows);
    setReviewMode(true);
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
        <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="cap" /> HIGH SCHOOL DEPARTMENTS</h2>
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <RetroIcon kind={dept.icon} />
                  <span>[{dept.code}] {dept.name}</span>
                </span>
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                  <RetroIcon kind={dept.icon} />
                  <span>[{dept.code}] {dept.name}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button 
            style={{ 
              ...styles.actionButton, 
              marginTop: '25px', 
              width: '100%',
              maxWidth: '500px', 
              opacity: !selectedDept ? 0.5 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
            disabled={!selectedDept}
            onClick={handleConfirmNextStep}
          >
            GENERATE SCHEDULE <RetroArrow color="#0a0a0a" />
          </button>
        </div>

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 220px' }} onClick={onBack}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span>
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
        <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="contract" /> SIGN OFFICIAL COVENANT MATRIX</h2>
        <p style={styles.subtitle}>Review your 5-day high school pattern with 4 singles + 2 doubles each day.</p>
        
        <div className="no-scrollbar" style={{ backgroundColor: '#111', border: '2px solid #39FF14', padding: '20px', borderRadius: '8px', margin: '20px auto', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ color: '#39FF14', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="grid" /> A-J Weekly Rotation Matrix</h3>
            <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem', color: '#fff' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><RetroIcon kind="class" size={20} /> Lunch Assignment: <strong style={{ color: '#ffa500' }}>{randomLunchWave}</strong> (matched to weekday wave table)</span>
            </div>
          </div>

          <div style={{ marginBottom: '12px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.78rem', color: '#ccc' }}>
            Day Pattern Rules: Mon/Fri doubles at slots 1-2 and 11-12, Tue/Thu doubles at slots 3-4 and 9-10, Wed doubles at slots 5-6 and 7-8. Class picks are assigned by Period A-J.
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.9rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #39FF14' }}>
                <th style={{ padding: '10px', color: '#888', width: '24%' }}>PERIOD / TIME</th>
                {WEEK_DAYS.map(day => (
                  <th key={day} style={{ padding: '10px', fontWeight: 'bold', color: '#39FF14', textTransform: 'uppercase', width: '15%' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #222', backgroundColor: '#0e1f1f' }}>
                <td style={{ padding: '12px 10px', borderRight: '1px solid #222' }}>
                  <div style={{ fontWeight: 'bold', color: '#00FFFF' }}>Homeroom</div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '2px' }}>7:30 AM - 7:50 AM</div>
                  <div style={{ fontSize: '0.7rem', color: '#5acaca', fontStyle: 'italic', marginTop: '2px' }}>Fixed Daily Attendance</div>
                </td>
                {WEEK_DAYS.map((day) => (
                  <td key={day} style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#00FFFF' }}>Homeroom & Attendance</div>
                  </td>
                ))}
              </tr>

              {weeklyRows.map((row) => (
                <tr key={row.blockKey} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '12px 10px', borderRight: '1px solid #222' }}>
                    <div style={{ fontWeight: 'bold', color: '#39FF14' }}>{row.block}</div>
                    <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '2px' }}>{row.time}</div>
                  </td>

                  {row.entries.map((entry, dayIdx) => {
                    if (entry.isDoubleContinuation) return null;
                    const cellRowSpan = entry.isDouble ? 2 : 1;

                    return (
                    <td
                      key={`${row.blockKey}-${WEEK_DAYS[dayIdx]}`}
                      rowSpan={cellRowSpan}
                      style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: entry.isPrep ? '#ff9f43' : '#fff' }}>
                        {entry.name}
                      </div>

                      {!entry.isPrep && !entry.isDoubleContinuation && (
                        <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: '500', color: getLevelColor(entry.level) }}>
                          [{entry.level}] - {entry.grade}
                        </div>
                      )}

                      {!entry.isDoubleContinuation && (
                        <div style={{ marginTop: '4px', fontSize: '0.68rem', color: '#b6d9b1' }}>
                          {entry.detail}
                        </div>
                      )}

                      {entry.isDouble && !entry.isDoubleContinuation && (
                        <span style={{ display: 'inline-block', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px', marginTop: '5px' }}>
                          Double Period
                        </span>
                      )}
                    </td>
                  )})}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))', gap: '8px', marginTop: '12px' }}>
            {WEEK_DAYS.map((day) => (
              <div key={day} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#39FF14', fontWeight: 'bold' }}>{day}</div>
                <div style={{ fontSize: '0.72rem', color: '#ffa500', marginTop: '2px' }}>{lunchByDay[day]}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1a1a1a', borderRadius: '4px', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="info" /> <span><strong>Matrix Core Rotation Rule:</strong> This contract uses periods A-J throughout the week with the requested double/single day pattern.</span></span>
          </div>

          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#151515', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.8rem', color: '#ddd', textAlign: 'left' }}>
            <strong style={{ color: '#39FF14' }}>Lunch Waves (All Options):</strong>
            <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.entries(LUNCH_WAVE_DAY_TIMES).map(([wave, byDay]) => (
                <div key={wave} style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '6px 8px' }}>
                  <div><span style={{ color: '#ffa500', fontWeight: 'bold' }}>{wave}</span></div>
                  <div style={{ fontSize: '0.72rem', color: '#c8c8c8', marginTop: '3px' }}>Mon: {byDay.Monday}</div>
                  <div style={{ fontSize: '0.72rem', color: '#c8c8c8' }}>Tue: {byDay.Tuesday}</div>
                  <div style={{ fontSize: '0.72rem', color: '#c8c8c8' }}>Wed: {byDay.Wednesday}</div>
                  <div style={{ fontSize: '0.72rem', color: '#c8c8c8' }}>Thu: {byDay.Thursday}</div>
                  <div style={{ fontSize: '0.72rem', color: '#c8c8c8' }}>Fri: {byDay.Friday}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={() => setReviewMode(false)}>MODIFY GRID</button>
          <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
          <button
            style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() =>
              onLaunchGame({
                selectedDept,
                randomLunchWave,
                lunchByDay,
                contractSchedule: schedule,
                weeklyRows,
                scheduleVersion: 3
              })
            }
          >
            CUSTOMIZE AVATAR <RetroArrow color="#0a0a0a" />
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
        <h2 style={{ ...styles.heading, margin: 0, display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="grid" /> MATRIX SCHEDULER</h2>
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="shuffle" /> TOKENS ({shuffleCount}/3 LIMIT)</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '6px', border: '1px solid #39FF14' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#39FF14', margin: '0 0 15px 0', display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="tokens" /> PICK FOR EACH PERIOD (A-J)</h3>
          
          <div 
            draggable 
            onDragStart={(e) => handleDragStart(e, { name: 'Teacher Prep / Study Hall', isPrep: true })}
            style={{ padding: '10px', backgroundColor: '#333', border: '2px dashed #aaa', borderRadius: '4px', cursor: 'grab', marginBottom: '15px', color: '#fff', fontWeight: 'bold', textAlign: 'center' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="class" size={20} /> MOVE PREP / STUDY HALL BLOCK</span>
          </div>

          <div className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
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
          {/* Static Homeroom Header Slot */}
          <div style={{ minHeight: '40px', backgroundColor: '#001a1a', border: '1px dashed #00FFFF', borderRadius: '6px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#00FFFF', fontWeight: 'bold' }}>HOMEROOM (8:00 AM - 8:15 AM) - FIXED ASSIGNMENT</span>
          </div>

          {PERIOD_LETTERS.map((letter) => {
            const pKey = periodKeyForLetter(letter);
            const filledItem = schedule[pKey];

            return (
              <div
                key={pKey}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, pKey)}
                style={{
                  minHeight: '65px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  padding: '10px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <span style={{ fontSize: '0.75rem', color: '#888', position: 'absolute', top: '5px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', width: '100%', textAlign: 'center', padding: '0 10px' }}>
                  PERIOD {letter}
                </span>

                {filledItem ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '18px' }}>
                    <div>
                      <strong style={{ color: '#fff' }}>{filledItem.name}</strong>
                      {!filledItem.isPrep && <div style={{ fontSize: '0.8rem', color: '#fff', marginTop: '4px' }}>[{filledItem.level}] - {filledItem.grade}</div>}
                    </div>
                    <button onClick={() => setSchedule(prev => ({ ...prev, [pKey]: null }))} style={{ background: 'transparent', color: '#FF3333', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><RetroClose /></button>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#555', fontStyle: 'italic', fontSize: '0.85rem', marginTop: '10px' }}>
                    Drop token card asset here...
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#9ccf91', backgroundColor: '#131313', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
            Fill all periods A-J manually. Limit is up to 2 Prep/Study Hall periods and up to 4 simultaneous sections of the same class+level.
          </div>
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
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span>
        </button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>
          RETURN TO MAIN MENU
        </button>
        <button 
          style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          onClick={handleProceedToReview}
        >
          REVIEW CONTRACT <RetroArrow color="#0a0a0a" />
        </button>
      </div>
    </div>
  );
}