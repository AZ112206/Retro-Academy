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
const LUNCH_WAVES = ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'];
const CLASS_LEVELS = ['Standard', 'Honors', 'Advanced'];
const PREP_TOKEN_LABEL = 'Teacher Prep / Study Hall';

const DAY_PATTERNS = [
  { day: 'Monday', sequence: ['A', 'A', 'C', 'D', 'E', 'F', 'G', 'H', 'B', 'B'], doublePairs: [[0, 1], [8, 9]] },
  { day: 'Tuesday', sequence: ['I', 'C', 'C', 'A', 'G', 'H', 'E', 'D', 'D', 'J'], doublePairs: [[1, 2], [7, 8]] },
  { day: 'Wednesday', sequence: ['B', 'C', 'E', 'E', 'D', 'F', 'F', 'F', 'G', 'I'], doublePairs: [[2, 3], [6, 7]] },
  { day: 'Thursday', sequence: ['A', 'G', 'G', 'B', 'E', 'J', 'F', 'H', 'H', 'I'], doublePairs: [[1, 2], [7, 8]] },
  { day: 'Friday', sequence: ['I', 'I', 'A', 'B', 'C', 'D', 'J', 'H', 'J', 'J'], doublePairs: [[0, 1], [8, 9]] }
];

const LUNCH_WAVE_DAY_TIMES = {
  'Wave 1': {
    Monday: '10:30 AM - 11:10 AM',
    Tuesday: '10:30 AM - 11:10 AM',
    Wednesday: '10:30 AM - 11:10 AM',
    Thursday: '10:30 AM - 11:10 AM',
    Friday: '10:30 AM - 11:10 AM'
  },
  'Wave 2': {
    Monday: '11:10 AM - 11:50 AM',
    Tuesday: '11:10 AM - 11:50 AM',
    Wednesday: '11:10 AM - 11:50 AM',
    Thursday: '11:10 AM - 11:50 AM',
    Friday: '11:10 AM - 11:50 AM'
  },
  'Wave 3': {
    Monday: '11:50 AM - 12:30 PM',
    Tuesday: '11:50 AM - 12:30 PM',
    Wednesday: '11:50 AM - 12:30 PM',
    Thursday: '11:50 AM - 12:30 PM',
    Friday: '11:50 AM - 12:30 PM'
  },
  'Wave 4': {
    Monday: '12:30 PM - 1:10 PM',
    Tuesday: '12:30 PM - 1:10 PM',
    Wednesday: '12:30 PM - 1:10 PM',
    Thursday: '12:30 PM - 1:10 PM',
    Friday: '12:30 PM - 1:10 PM'
  }
};

const PERIOD_SLOT_TIMES = [
  '8:00 AM - 8:35 AM',
  '8:40 AM - 9:15 AM',
  '9:20 AM - 9:55 AM',
  '10:00 AM - 10:35 AM',
  '10:40 AM - 11:15 AM',
  '11:20 AM - 11:55 AM',
  '12:00 PM - 12:35 PM',
  '12:40 PM - 1:15 PM',
  '1:20 PM - 1:55 PM',
  '2:00 PM - 2:30 PM'
];

function resolveLunchWaveFromTime(timeLabel) {
  const normalized = String(timeLabel || '').trim();
  const matched = Object.entries(LUNCH_WAVE_DAY_TIMES).find(([, byDay]) =>
    WEEK_DAYS.some((day) => byDay[day] === normalized)
  );
  return matched ? matched[0] : 'Adjusted';
}

const LUNCH_WAVE_SLOT_INDEX = {
  'Wave 1': 4,
  'Wave 2': 5,
  'Wave 3': 6,
  'Wave 4': 7
};

const ROTATING_LUNCH_SLOT_INDEX = {
  Monday: 4,
  Tuesday: 5,
  Wednesday: 6,
  Thursday: 7,
  Friday: 4
};

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

const createEmptyStorage = () => (
  [null, null, null]
);

const periodKeyForLetter = (letter) => `period${letter}`;

function buildDayPeriodSequence(offset, doublePairs) {
  return Array.isArray(offset) ? offset : Array(10).fill('A');
}

function getTokenSignature(itemData) {
  const name = String(itemData?.name || '').trim();
  const level = String(itemData?.level || 'Standard').trim();
  return `${name}|${level}`;
}

function buildBalancedCatalog(basePool, totalCount = 8) {
  const balancedCatalog = [];
  const pool = Array.isArray(basePool) ? basePool : [];
  const baseChoices = pool.length ? pool : [{ name: 'General Elective', grade: '9th' }];
  const levelCycle = [...CLASS_LEVELS, ...CLASS_LEVELS];

  const usedSignatures = new Map();

  for (let idx = 0; idx < totalCount; idx += 1) {
    const base = baseChoices[idx % baseChoices.length] || { name: 'General Elective', grade: '9th' };
    const level = levelCycle[idx % levelCycle.length] || 'Standard';
    const signature = `${base.name}|${level}`;
    const currentCount = usedSignatures.get(signature) || 0;

    if (currentCount >= 3) {
      const fallbackLevel = CLASS_LEVELS[idx % CLASS_LEVELS.length] || 'Standard';
      const fallbackSignature = `${base.name}|${fallbackLevel}`;
      if ((usedSignatures.get(fallbackSignature) || 0) < 3) {
        balancedCatalog.push({
          name: base.name,
          grade: base.grade,
          level: fallbackLevel,
          sec: `#${100 + idx}`
        });
        usedSignatures.set(fallbackSignature, (usedSignatures.get(fallbackSignature) || 0) + 1);
        continue;
      }
    }

    balancedCatalog.push({
      name: base.name,
      grade: base.grade,
      level,
      sec: `#${100 + idx}`
    });
    usedSignatures.set(signature, currentCount + 1);
  }

  return balancedCatalog;
}

function getMorningAfternoonSplit(schedule) {
  const entries = Object.entries(schedule || {});
  const lunchEntry = entries.find(([, slot]) => slot?.isLunch);
  const lunchPeriod = lunchEntry ? lunchEntry[0] : 'periodE';
  const dividerIndex = PERIOD_LETTERS.indexOf(String(lunchPeriod).replace('period', '').toUpperCase()) >= 0
    ? PERIOD_LETTERS.indexOf(String(lunchPeriod).replace('period', '').toUpperCase())
    : PERIOD_LETTERS.indexOf('E');

  let morningCount = 0;
  let afternoonCount = 0;

  entries.forEach(([periodKey, slot]) => {
    if (!slot || slot.isPrep || slot.isLunch) return;
    const letter = String(periodKey).replace('period', '').toUpperCase();
    const index = PERIOD_LETTERS.indexOf(letter);
    if (index < dividerIndex) morningCount += 1;
    else if (index > dividerIndex) afternoonCount += 1;
  });

  return {
    dividerIndex,
    classBeforeLunch: morningCount,
    classAfterLunch: afternoonCount,
    lunchAssigned: Boolean(lunchEntry)
  };
}

function buildLunchPlanByDay(baseSchedule) {
  const lunchSlotToken = PERIOD_LETTERS.map((letter) => baseSchedule[periodKeyForLetter(letter)]).find((slot) => slot?.isLunch);
  const fallbackWave = lunchSlotToken?.wave || 'Wave 1';

  return WEEK_DAYS.reduce((acc, dayName, dayIdx) => {
    const chosenWave = lunchSlotToken?.wave || LUNCH_WAVES[dayIdx % LUNCH_WAVES.length];
    acc.slotIndexByDay[dayName] = ROTATING_LUNCH_SLOT_INDEX[dayName] ?? 4;
    acc.lunchByDay[dayName] = LUNCH_WAVE_DAY_TIMES[chosenWave]?.[dayName]
      || LUNCH_WAVE_DAY_TIMES[fallbackWave]?.[dayName]
      || 'Assigned';
    return acc;
  }, { slotIndexByDay: {}, lunchByDay: {} });
}

function validateRotationCoverage(dayPatterns) {
  const counts = PERIOD_LETTERS.reduce((acc, letter) => {
    acc[letter] = { doubles: 0, singles: 0 };
    return acc;
  }, {});

  dayPatterns.forEach((pattern) => {
    const doubleStartSet = new Set(pattern.doublePairs.map((pair) => pair[0]));
    const continuationSet = new Set(pattern.doublePairs.map((pair) => pair[1]));

    pattern.sequence.forEach((letter, slotIdx) => {
      if (continuationSet.has(slotIdx)) return;
      if (!counts[letter]) return;
      if (doubleStartSet.has(slotIdx)) {
        counts[letter].doubles += 1;
      } else {
        counts[letter].singles += 1;
      }
    });
  });

  return PERIOD_LETTERS.every((letter) => counts[letter].doubles === 1 && counts[letter].singles === 3);
}

const HAS_VALID_ROTATION = validateRotationCoverage(DAY_PATTERNS);

function buildContractBalanceReport(baseSchedule) {
  const classCounts = {};
  const prepCount = Object.values(baseSchedule || {}).filter((slot) => slot?.isPrep).length;
  const lunchCount = Object.values(baseSchedule || {}).filter((slot) => slot?.isLunch).length;
  const activeClassSlots = Object.values(baseSchedule || {}).filter((slot) => slot && !slot.isPrep && !slot.isLunch);

  activeClassSlots.forEach((slot) => {
    const signature = getTokenSignature(slot);
    classCounts[signature] = (classCounts[signature] || 0) + 1;
  });

  const classValues = Object.values(classCounts);
  const classMax = classValues.length ? Math.max(...classValues) : 0;
  const classMin = classValues.length ? Math.min(...classValues) : 0;
  const morningAfternoonSplit = getMorningAfternoonSplit(baseSchedule);
  const isPrepAssigned = prepCount === 1;
  const isLunchAssigned = lunchCount === 1;
  const isMorningAfternoonBalanced = morningAfternoonSplit.classBeforeLunch === morningAfternoonSplit.classAfterLunch && morningAfternoonSplit.classBeforeLunch === 4;
  const isClassDistributionBalanced = classValues.length ? classMax - classMin <= 1 : true;
  const isClassLimitOkay = classMax <= 3;

  return {
    classCounts,
    classCountSpread: classMax - classMin,
    isPrepAssigned,
    isLunchAssigned,
    isMorningAfternoonBalanced,
    isClassDistributionBalanced,
    isClassLimitOkay,
    prepCount,
    lunchCount,
    morningCount: morningAfternoonSplit.classBeforeLunch,
    afternoonCount: morningAfternoonSplit.classAfterLunch
  };
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

  const lunchPlan = buildLunchPlanByDay(baseSchedule, lunchWave);
  const lunchByDay = lunchPlan.lunchByDay;
  const periodSequenceByDay = DAY_PATTERNS.reduce((acc, pattern) => {
    acc[pattern.day] = buildDayPeriodSequence(pattern.sequence, pattern.doublePairs);
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
      const lunchSlotForDay = lunchPlan.slotIndexByDay[dayName];
      const isLunchSlot = slotIdx === lunchSlotForDay;
      const detailParts = [
        `Period ${periodLabel}`,
        isDouble ? 'Double Block (80 min)' : 'Single Block (40 min)'
      ];

      if (isLunchSlot) {
        detailParts.push(`Lunch: ${lunchByDay[dayName]}`);
      }

      if (isLunchSlot) {
        return {
          name: sourceToken?.name || 'Lunch Break',
          grade: null,
          level: null,
          sec: null,
          isPrep: false,
          isLunch: true,
          kind: 'lunch',
          periodLabel,
          isDouble: false,
          isLunchSlot: true,
          isDoubleContinuation: false,
          detail: detailParts.join(' | ')
        };
      }

      return {
        ...sourceToken,
        kind: sourceToken?.isPrep ? 'prep' : 'class',
        periodLabel,
        isDouble,
        isLunch: false,
        isLunchSlot: false,
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

  const normalizedRows = rows.map((row) => ({
    ...row,
    entries: WEEK_DAYS.map((_, dayIdx) => {
      const entry = row.entries?.[dayIdx];
      return entry && typeof entry === 'object'
        ? entry
        : {
            name: 'Assigned Coverage',
            grade: null,
            level: null,
            sec: null,
            isPrep: false,
            kind: 'support',
            isDouble: false,
            isDoubleContinuation: false,
            detail: null
          };
    })
  }));

  return { rows: normalizedRows, lunchByDay };
}

export default function HighSchoolScheduleStep({ onLaunchGame, onBack, onExit, onSaveGame, styles, resumeData = null }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [confirmedDept, setConfirmedDept] = useState(false);
  const [currentTokens, setCurrentTokens] = useState([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [randomLunchWave, setRandomLunchWave] = useState('');
  const [lunchByDay, setLunchByDay] = useState({});
  const [weeklyRows, setWeeklyRows] = useState([]);
  const [balanceReport, setBalanceReport] = useState(null);

  const [schedule, setSchedule] = useState(createEmptySchedule());
  const [storageSlots, setStorageSlots] = useState(createEmptyStorage());

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
    setStorageSlots(createEmptyStorage());
    setWeeklyRows(rebuiltContract.rows);
    setLunchByDay(rebuiltContract.lunchByDay);
    setBalanceReport(buildContractBalanceReport(restoredSchedule));
    setCurrentTokens([]);
    setShuffleCount(0);
  }, [resumeData]);

  const handleShuffleCatalog = (deptId, isInitialLoad = false) => {
    if (!isInitialLoad && shuffleCount >= 3) {
      alert('Administration Notice: You have exhausted your 3-shuffle limit for this scheduling draft.');
      return;
    }

    const basePool = POOL_EXPANSIONS[deptId] || [];
    const generatedTokens = buildBalancedCatalog(basePool, 8)
      .map((token) => ({ ...token, sec: token.sec || `#${Math.floor(Math.random() * 900) + 100}` }))
      .sort(() => Math.random() - 0.5);

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
      setBalanceReport(null);
      setSchedule(createEmptySchedule());
      setStorageSlots(createEmptyStorage());
    }
    setSelectedDept(deptId);
  };

  const handleConfirmNextStep = () => {
    if (!selectedDept) return;
    setShuffleCount(0);
    setSchedule(createEmptySchedule());
    setStorageSlots(createEmptyStorage());
    handleShuffleCatalog(selectedDept, true);
    setConfirmedDept(true);
  };

  const countPrepBlocks = () => {
    return Object.values(schedule).filter(slot => slot?.isPrep).length;
  };

  const countLunchBlocks = () => {
    return Object.values(schedule).filter(slot => slot?.isLunch).length;
  };

  const countSignatureInSchedule = (itemData) => {
    if (!itemData || itemData.isPrep || itemData.isLunch) return 0;
    const signature = getTokenSignature(itemData);
    return Object.values(schedule).filter((slot) => slot && !slot.isPrep && !slot.isLunch && getTokenSignature(slot) === signature).length;
  };

  const canPlaceTokenInSchedule = (itemData, targetPeriod) => {
    if (!itemData) return false;
    if (itemData.isPrep) {
      const targetItem = schedule[targetPeriod];
      if (targetItem?.isPrep) return true;
      return countPrepBlocks() < 1;
    }
    if (itemData.isLunch) {
      const targetItem = schedule[targetPeriod];
      if (targetItem?.isLunch) return true;
      return countLunchBlocks() < 1;
    }

    const targetItem = schedule[targetPeriod];
    const baseCount = countSignatureInSchedule(itemData);
    const targetIsSameSignature = Boolean(targetItem && !targetItem.isPrep && !targetItem.isLunch && getTokenSignature(targetItem) === getTokenSignature(itemData));
    return targetIsSameSignature || baseCount < 3;
  };

  const hasAllBlocksAssigned = () => {
    return PERIOD_KEYS.every((key) => Boolean(schedule[key]));
  };

  const cloneItem = (itemData) => ({
    name: itemData.name,
    grade: itemData.grade,
    level: itemData.level,
    sec: itemData.sec,
    isPrep: Boolean(itemData.isPrep),
    isLunch: Boolean(itemData.isLunch),
    wave: itemData.wave || null
  });

  const findFirstEmptyStorageSlot = (periodKey, state = storageSlots) => {
    return state.findIndex((slot) => !slot);
  };

  const getStorageItem = (state, slotIndex) => state[slotIndex] || null;

  const setStorageItem = (state, slotIndex, nextItem) => (state || [null, null, null]).map((slot, idx) => (idx === slotIndex ? nextItem : slot));

  const clearStorageItem = (state, slotIndex) => setStorageItem(state, slotIndex, null);

  const getDragPayload = (itemData) => ({
    name: itemData.name,
    grade: itemData.grade,
    level: itemData.level,
    sec: itemData.sec,
    isPrep: Boolean(itemData.isPrep),
    isLunch: Boolean(itemData.isLunch),
    wave: itemData.wave || null
  });

  const handleDragStart = (e, itemData) => {
    e.dataTransfer.setData('application/json', JSON.stringify(itemData));
  };

  const handleDrop = (e, targetPeriod) => {
    e.preventDefault();
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('application/json'));
      const sourceType = itemData?.sourceType || 'library';
      const sourcePeriod = itemData?.sourcePeriod || null;
      const sourceStorageIndex = Number.isInteger(itemData?.sourceStorageIndex) ? itemData.sourceStorageIndex : null;
      const payload = getDragPayload(itemData);

      if (sourcePeriod === targetPeriod) return;

      const targetItem = schedule[targetPeriod];

      if (!canPlaceTokenInSchedule(payload, targetPeriod)) {
        alert('Administrative Block: That placement would exceed the max of 3 sections for the same class and level or break the one prep/lunch rule.');
        return;
      }

      setSchedule((prevSchedule) => {
        const nextSchedule = { ...prevSchedule };

        if (!targetItem) {
          nextSchedule[targetPeriod] = payload;
          if (sourceType === 'period' && sourcePeriod) {
            nextSchedule[sourcePeriod] = null;
          } else if (sourceType === 'storage' && sourceStorageIndex !== null) {
            setStorageSlots((prevStorage) => clearStorageItem(prevStorage, sourceStorageIndex));
          }
          return nextSchedule;
        }

        if (sourceType === 'library') {
          setStorageSlots((prevStorage) => {
            const storageIndex = findFirstEmptyStorageSlot(targetPeriod, prevStorage);
            if (storageIndex === -1) {
              alert('Administrative Block: That period is full. Use one of the 3 backup slots or trash a class first.');
              return prevStorage;
            }

            return setStorageItem(prevStorage, storageIndex, targetItem);
          });
          nextSchedule[targetPeriod] = payload;
          return nextSchedule;
        }

        if (sourceType === 'period' && sourcePeriod) {
          nextSchedule[targetPeriod] = payload;
          nextSchedule[sourcePeriod] = targetItem;
          return nextSchedule;
        }

        if (sourceType === 'storage' && sourceStorageIndex !== null) {
          setStorageSlots((prevStorage) => setStorageItem(prevStorage, sourceStorageIndex, targetItem));
          nextSchedule[targetPeriod] = payload;
          return nextSchedule;
        }

        return nextSchedule;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStorageDrop = (e, targetPeriod, targetSlotIndex) => {
    e.preventDefault();
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('application/json'));
      const sourceType = itemData?.sourceType || 'library';
      const sourcePeriod = itemData?.sourcePeriod || null;
      const sourceStorageIndex = Number.isInteger(itemData?.sourceStorageIndex) ? itemData.sourceStorageIndex : null;
      const payload = getDragPayload(itemData);

      setStorageSlots((prevStorage) => {
        let nextStorage = [...prevStorage];
        const targetItem = getStorageItem(nextStorage, targetSlotIndex);

        if (payload && !canPlaceTokenInSchedule(payload, 'backup')) {
          alert('Administrative Block: That placement would exceed the max of 3 sections for the same class and level or break the one prep/lunch rule.');
          return prevStorage;
        }

        if (!targetItem) {
          if (sourceType === 'period' && sourcePeriod) {
            setSchedule((prevSchedule) => ({ ...prevSchedule, [sourcePeriod]: null }));
          } else if (sourceType === 'storage' && sourceStorageIndex !== null) {
            nextStorage = clearStorageItem(nextStorage, sourceStorageIndex);
          }

          return setStorageItem(nextStorage, targetSlotIndex, payload);
        }

        if (sourceType === 'library') {
          alert('Administrative Block: Pick an open backup slot or move the card to a period first.');
          return prevStorage;
        }

        if (sourceType === 'period' && sourcePeriod) {
          nextStorage = setStorageItem(nextStorage, targetSlotIndex, payload);
          setSchedule((prevSchedule) => ({ ...prevSchedule, [sourcePeriod]: targetItem }));
          return nextStorage;
        }

        if (sourceType === 'storage' && sourceStorageIndex !== null) {
          nextStorage = setStorageItem(nextStorage, targetSlotIndex, payload);
          nextStorage = setStorageItem(nextStorage, sourceStorageIndex, targetItem);
          return nextStorage;
        }

        return prevStorage;
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrashDrop = (e) => {
    e.preventDefault();
    try {
      const itemData = JSON.parse(e.dataTransfer.getData('application/json'));
      const sourceType = itemData?.sourceType || 'library';
      const sourcePeriod = itemData?.sourcePeriod || null;
      const sourceStorageIndex = Number.isInteger(itemData?.sourceStorageIndex) ? itemData.sourceStorageIndex : null;

      if (sourceType === 'period' && sourcePeriod) {
        setSchedule((prevSchedule) => ({ ...prevSchedule, [sourcePeriod]: null }));
      }

      if (sourceType === 'storage' && sourceStorageIndex !== null) {
        setStorageSlots((prevStorage) => clearStorageItem(prevStorage, sourceStorageIndex));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProceedToReview = () => {
    if (!HAS_VALID_ROTATION) {
      alert('Administrative Warning: The high school rotation is out of balance. Reconfigure the weekly sequence before review.');
      return;
    }

    if (!hasAllBlocksAssigned()) {
      alert('Mandatory Warning: Assign a class, lunch, or prep token to every period A-J before review.');
      return;
    }

    if (countPrepBlocks() !== 1) {
      alert('Mandatory Warning: You must place exactly one Teacher Prep / Study Hall block.');
      return;
    }

    const balanceReport = buildContractBalanceReport(schedule);
    if (!balanceReport.isLunchAssigned) {
      alert('Mandatory Warning: Place one lunch wave token in the schedule before review.');
      return;
    }

    if (!balanceReport.isMorningAfternoonBalanced) {
      alert('Mandatory Warning: Keep four class periods before lunch and four after lunch for a balanced day.');
      return;
    }

    if (!balanceReport.isClassLimitOkay) {
      alert('Mandatory Warning: No class and level combination may appear more than 3 times.');
      return;
    }

    const selectedContract = buildWeeklyContract(schedule, 'Wave 1');
    const selectedLunchToken = Object.values(schedule).find((slot) => slot?.isLunch);
    const selectedWave = selectedLunchToken?.wave || 'Wave 1';

    setRandomLunchWave(selectedWave);
    setLunchByDay(selectedContract.lunchByDay);
    setWeeklyRows(selectedContract.rows);
    setBalanceReport(balanceReport);
    setReviewMode(true);
  };

  const getLevelColor = (level) => {
    if (level === 'Advanced') return '#FF3333';
    if (level === 'Honors') return '#00FFFF';
    return '#39FF14'; 
  };

  const renderScheduleCard = (item, { draggable = false, onDragStart: handleItemDragStart = null, compact = false } = {}) => {
    if (!item) return null;

    return (
      <div
        draggable={draggable}
        onDragStart={handleItemDragStart}
        style={{
          padding: compact ? '8px' : '10px',
          backgroundColor: '#121212',
          border: `1px solid ${item.isLunch ? '#ffa500' : item.isPrep ? '#ff9f43' : getLevelColor(item.level)}`,
          borderRadius: '4px',
          cursor: draggable ? 'grab' : 'default',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', fontWeight: 'bold', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontSize: compact ? '0.85rem' : '0.9rem' }}>{item.name} {item.sec || ''}</span>
          {!item.isPrep && !item.isLunch && (
            <span style={{ color: '#888', fontSize: compact ? '0.75rem' : '0.8rem' }}>{item.grade}</span>
          )}
        </div>
        {!item.isPrep && !item.isLunch && (
          <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '2px', textAlign: 'center' }}>Level Track: {item.level}</div>
        )}
        {item.isPrep && (
          <div style={{ fontSize: '0.8rem', color: '#ffa500', marginTop: '2px', textAlign: 'center' }}>Prep / Study Hall</div>
        )}
        {item.isLunch && (
          <div style={{ fontSize: '0.8rem', color: '#ffa500', marginTop: '2px', textAlign: 'center' }}>{item.wave || 'Lunch Wave'}</div>
        )}
      </div>
    );
  };

  const renderStorageCard = (item, { slotIndex } = {}) => {
    if (!item) {
      return (
        <div style={{ minHeight: '56px', border: '1px dashed #2f5f2f', borderRadius: '4px', backgroundColor: '#101810', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#567', fontSize: '0.68rem' }}>
          HOLD {slotIndex + 1}
        </div>
      );
    }

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, { ...item, sourceType: 'storage', sourceStorageIndex: slotIndex })}
      >
        {renderScheduleCard(item, { compact: true })}
      </div>
    );
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
          <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
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
        <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="contract" /> CONTRACT SCHEDULE PREVIEW</h2>
        <p style={styles.subtitle}>Review your locked 5-day high school matrix before avatar customization. Each day keeps one lunch wave, one prep block, and four morning/four afternoon classes in a rotating pattern.</p>
        
        <div className="no-scrollbar" style={{ backgroundColor: '#111', border: '2px solid #39FF14', padding: '20px', borderRadius: '8px', margin: '20px auto', overflowX: 'auto', overflowY: 'auto', maxHeight: '68vh' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ color: '#39FF14', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="grid" /> A-J Weekly Rotation Matrix</h3>
            <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem', color: '#fff' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><RetroIcon kind="class" size={20} /> Lunch Window: <strong style={{ color: '#ffa500' }}>Auto-Balanced By Schedule</strong></span>
            </div>
          </div>

          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', color: '#ddd', fontSize: '0.78rem' }}>
            <strong style={{ color: '#39FF14' }}>Role:</strong> Teacher | <strong style={{ color: '#39FF14' }}>School:</strong> High
          </div>

          <div style={{ marginBottom: '12px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.78rem', color: '#ccc' }}>
            Day Pattern Rules: Every period A-J receives exactly 1 double block and 3 single blocks in the base rotation. Lunch remains its own slot while classes stay evenly split before and after lunch.
          </div>

          {balanceReport && (
            <div style={{ marginBottom: '12px', padding: '10px', backgroundColor: '#131d13', borderRadius: '4px', border: '1px solid #2d6a2d', fontSize: '0.78rem', color: '#b7e8b2' }}>
              <div style={{ fontWeight: 'bold', color: '#39FF14', marginBottom: '4px' }}>Balance Check Locked</div>
              <div>Rotation Coverage (A-J): {HAS_VALID_ROTATION ? 'PASS' : 'FAIL'} | Double Blocks: 1 each | Single Blocks: 3 each</div>
              <div>Morning/Afternoon Classes: {balanceReport.isMorningAfternoonBalanced ? 'PASS' : 'FAIL'} ({balanceReport.morningCount}/{balanceReport.afternoonCount})</div>
              <div>Lunch & Prep Slots: {balanceReport.isLunchAssigned && balanceReport.isPrepAssigned ? 'PASS' : 'FAIL'} (Lunch: {balanceReport.lunchCount}, Prep: {balanceReport.prepCount})</div>
              <div>Class Distribution: {balanceReport.isClassDistributionBalanced && balanceReport.isClassLimitOkay ? 'PASS' : 'FAIL'} (max spread: {balanceReport.classCountSpread}, max per class+level: {Math.max(...Object.values(balanceReport.classCounts || {}), 0)})</div>
            </div>
          )}
          
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.82rem', textAlign: 'center' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #39FF14' }}>
                <th style={{ padding: '8px 7px', color: '#888', width: '24%' }}>BLOCK / TIME</th>
                {WEEK_DAYS.map(day => (
                  <th key={day} style={{ padding: '8px 7px', fontWeight: 'bold', color: '#39FF14', textTransform: 'uppercase', width: '15%' }}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #222', backgroundColor: '#0e1f1f' }}>
                <td style={{ padding: '8px 7px', borderRight: '1px solid #222' }}>
                  <div style={{ fontWeight: 'bold', color: '#00FFFF' }}>Homeroom</div>
                  <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '2px' }}>7:35 AM - 7:50 AM</div>
                  <div style={{ fontSize: '0.66rem', color: '#5acaca', fontStyle: 'italic', marginTop: '2px' }}>Fixed Daily Attendance</div>
                </td>
                {WEEK_DAYS.map((day) => (
                  <td key={day} style={{ padding: '8px 7px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#00FFFF' }}>Homeroom & Attendance</div>
                  </td>
                ))}
              </tr>

              {weeklyRows.map((row, rowIdx) => (
                <tr key={row.blockKey} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px 7px', borderRight: '1px solid #222' }}>
                    <div style={{ fontWeight: 'bold', color: '#39FF14' }}>{row.block}</div>
                    <div style={{ fontSize: '0.7rem', color: '#aaa', marginTop: '2px' }}>{row.time}</div>
                  </td>

                  {row.entries.map((entry, dayIdx) => {
                    const prevRowEntry = weeklyRows[rowIdx - 1]?.entries?.[dayIdx];
                    const hasDoubleAnchorAbove = Boolean(prevRowEntry?.isDouble) && !Boolean(prevRowEntry?.isDoubleContinuation);
                    if (entry.isDoubleContinuation && hasDoubleAnchorAbove) return null;
                    const cellRowSpan = entry.isDouble ? 2 : 1;

                    return (
                    <td
                      key={`${row.blockKey}-${WEEK_DAYS[dayIdx]}`}
                      rowSpan={cellRowSpan}
                      style={{ padding: '8px 7px', borderRight: '1px solid #222', verticalAlign: 'middle' }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: entry.isPrep ? '#ff9f43' : '#fff' }}>
                        {entry.name}
                      </div>

                      {!entry.isPrep && !entry.isLunch && !entry.isDoubleContinuation && (
                        <div style={{ fontSize: '0.7rem', marginTop: '4px', fontWeight: '500', color: getLevelColor(entry.level) }}>
                          [{entry.level}] - {entry.grade}
                        </div>
                      )}

                      {!entry.isDoubleContinuation && (
                        <div style={{ marginTop: '4px', fontSize: '0.66rem', color: '#b6d9b1' }}>
                          {entry.detail}
                        </div>
                      )}

                      {entry.isDouble && !entry.isDoubleContinuation && (
                        <span style={{ display: 'inline-block', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px', marginTop: '5px' }}>
                          Double Period
                        </span>
                      )}

                      {entry.isLunch && (
                        <span style={{ display: 'inline-block', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px', marginTop: '5px' }}>
                          Class Replaced By Lunch
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
                <div style={{ fontSize: '0.68rem', color: '#9acb92', marginTop: '2px' }}>{resolveLunchWaveFromTime(lunchByDay[day])}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1a1a1a', borderRadius: '4px', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="info" /> <span><strong>Matrix Core Rotation Rule:</strong> This contract uses periods A-J throughout the week with the requested double/single day pattern.</span></span>
          </div>

        </div>

        <div style={styles.footerActions}>
          <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={() => setReviewMode(false)}>MODIFY GRID</button>
          <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>RETURN TO MAIN MENU</button>
          <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
          <button
            style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            onClick={() =>
              onLaunchGame({
                selectedDept,
                randomLunchWave,
                lunchByDay,
                contractSchedule: schedule,
                weeklyRows,
                scheduleVersion: 4
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
          
          <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, { name: PREP_TOKEN_LABEL, isPrep: true, sourceType: 'library' })}
            >
              {renderScheduleCard(
                { name: PREP_TOKEN_LABEL, isPrep: true },
                { compact: true }
              )}
            </div>
            {LUNCH_WAVES.map((wave) => (
              <div
                key={wave}
                draggable
                onDragStart={(e) => handleDragStart(e, { name: `Lunch ${wave}`, isLunch: true, wave, sourceType: 'library' })}
              >
                {renderScheduleCard(
                  { name: `Lunch ${wave}`, isLunch: true, wave },
                  { compact: true }
                )}
              </div>
            ))}
          </div>

          <div className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '350px', overflowY: 'auto' }}>
            {currentTokens.map((course, i) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => handleDragStart(e, { ...course, sourceType: 'library' })}
              >
                {renderScheduleCard(course, { draggable: false, compact: true })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Static Homeroom Header Slot */}
          <div style={{ minHeight: '40px', backgroundColor: '#001a1a', border: '1px dashed #00FFFF', borderRadius: '6px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#00FFFF', fontWeight: 'bold' }}>HOMEROOM (7:35 AM - 7:50 AM) - FIXED ASSIGNMENT</span>
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
                  <div style={{ marginTop: '18px' }}>
                    {renderScheduleCard(filledItem, {
                      draggable: true,
                      compact: true,
                      onDragStart: (e) => handleDragStart(e, { ...filledItem, sourceType: 'period', sourcePeriod: pKey })
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#555', fontStyle: 'italic', fontSize: '0.85rem', marginTop: '10px' }}>
                    Drop token card asset here...
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: '10px', padding: '8px', backgroundColor: '#101010', border: '1px solid #2a2a2a', borderRadius: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.72rem', color: '#9ccf91' }}>
              <span>UNIVERSAL BACKUP RACK</span>
              <span style={{ color: '#666' }}>3 SLOT HOLDING AREA</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '6px' }}>
              {storageSlots.map((slotItem, slotIndex) => (
                <div
                  key={`backup-storage-${slotIndex}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleStorageDrop(e, 'backup', slotIndex)}
                >
                  {renderStorageCard(slotItem, { slotIndex })}
                </div>
              ))}
            </div>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleTrashDrop}
            style={{ marginTop: '10px', padding: '10px', borderRadius: '6px', border: '1px dashed #ff3333', backgroundColor: '#1a1010', color: '#ff7777', textAlign: 'center', fontWeight: 'bold' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <RetroIcon kind="trash" /> DROP HERE TO TRASH A CLASS OR PREP SLOT
            </span>
          </div>

          <div style={{ marginTop: '4px', fontSize: '0.72rem', color: '#9ccf91', backgroundColor: '#131313', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
            Fill all periods A-J manually. Use exactly one prep block, one lunch wave, and keep the class roster balanced with no more than 3 sections of any class and level combination.
          </div>
        </div>
      </div>

      <div style={styles.footerActions}>
        <button
          style={{ ...styles.backButton, flex: '1 1 180px' }}
          onClick={() => {
            setConfirmedDept(false);
            setReviewMode(false);
            setBalanceReport(null);
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroArrow direction="left" /> BACK</span>
        </button>
        <button style={{ ...styles.exitButton, flex: '1 1 180px' }} onClick={onExit}>
          RETURN TO MAIN MENU
        </button>
        <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
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