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

const WEEK_DAYS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
const SLOT_KEYS = Array.from({ length: 6 }, (_, idx) => `slot${idx + 1}`);
const PERIOD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const PERIOD_KEYS = PERIOD_LETTERS.map((letter) => `period${letter}`);
const LUNCH_WAVES = ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'];
const CLASS_LEVELS = ['Standard', 'Honors', 'Advanced'];
const PREP_TOKEN_LABEL = 'Teacher Prep / Study Hall';
const TARGET_MORNING_CLASS_COUNT = 2;
const TARGET_AFTERNOON_CLASS_COUNT = 3;
const LONG_BLOCK_SLOT_INDEX = 3;
const LONG_BLOCK_DURATION_LABEL = 'Long Block (90 min)';
const STANDARD_BLOCK_DURATION_LABEL = 'Class Block (50 min)';
const LUNCH_TIME_LABEL = '11:00 AM - 11:50 AM';
const LUNCH_WAVE_SPLIT_DETAILS = {
  'Wave 1': '30 min lunch then 90 min class',
  'Wave 2': '30 min class then 30 min lunch then 60 min class',
  'Wave 3': '60 min class then 30 min lunch then 30 min class',
  'Wave 4': '90 min class then 30 min lunch'
};

const DAY_PATTERNS = [
  { day: 'Day 1', sequence: ['A', 'B', 'G', 'D', 'E', 'F'] },
  { day: 'Day 2', sequence: ['B', 'C', 'A', 'E', 'F', 'G'] },
  { day: 'Day 3', sequence: ['C', 'D', 'B', 'A', 'G', 'E'] },
  { day: 'Day 4', sequence: ['D', 'B', 'C', 'F', 'E', 'G'] },
  { day: 'Day 5', sequence: ['A', 'C', 'D', 'B', 'G', 'E'] },
  { day: 'Day 6', sequence: ['C', 'D', 'A', 'G', 'E', 'F'] },
  { day: 'Day 7', sequence: ['D', 'A', 'B', 'C', 'F', 'E'] }
];

const LUNCH_WAVE_DAY_TIMES = {
  'Wave 1': {
    'Day 1': '10:40 AM - 11:10 AM',
    'Day 2': '10:40 AM - 11:10 AM',
    'Day 3': '10:40 AM - 11:10 AM',
    'Day 4': '10:40 AM - 11:10 AM',
    'Day 5': '10:40 AM - 11:10 AM',
    'Day 6': '10:40 AM - 11:10 AM',
    'Day 7': '10:40 AM - 11:10 AM'
  },
  'Wave 2': {
    'Day 1': '11:10 AM - 11:40 AM',
    'Day 2': '11:10 AM - 11:40 AM',
    'Day 3': '11:10 AM - 11:40 AM',
    'Day 4': '11:10 AM - 11:40 AM',
    'Day 5': '11:10 AM - 11:40 AM',
    'Day 6': '11:10 AM - 11:40 AM',
    'Day 7': '11:10 AM - 11:40 AM'
  },
  'Wave 3': {
    'Day 1': '11:40 AM - 12:10 PM',
    'Day 2': '11:40 AM - 12:10 PM',
    'Day 3': '11:40 AM - 12:10 PM',
    'Day 4': '11:40 AM - 12:10 PM',
    'Day 5': '11:40 AM - 12:10 PM',
    'Day 6': '11:40 AM - 12:10 PM',
    'Day 7': '11:40 AM - 12:10 PM'
  },
  'Wave 4': {
    'Day 1': '12:10 PM - 12:40 PM',
    'Day 2': '12:10 PM - 12:40 PM',
    'Day 3': '12:10 PM - 12:40 PM',
    'Day 4': '12:10 PM - 12:40 PM',
    'Day 5': '12:10 PM - 12:40 PM',
    'Day 6': '12:10 PM - 12:40 PM',
    'Day 7': '12:10 PM - 12:40 PM'
  }
};

const PERIOD_SLOT_TIMES = [
  '7:55 AM - 8:45 AM',
  '8:50 AM - 9:40 AM',
  '9:45 AM - 10:35 AM',
  '10:40 AM - 12:40 PM',
  '12:45 PM - 1:35 PM',
  '1:40 PM - 2:30 PM'
];

function resolveLunchWaveFromTime(timeLabel) {
  const normalized = String(timeLabel || '').trim();
  const matched = Object.entries(LUNCH_WAVE_DAY_TIMES).find(([, byDay]) =>
    WEEK_DAYS.some((day) => byDay[day] === normalized)
  );
  return matched ? matched[0] : 'Adjusted';
}

function hashString(value) {
  const source = String(value || 'retro');
  let hash = 2166136261;
  for (let i = 0; i < source.length; i += 1) {
    hash ^= source.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createSeededRandom(seedValue) {
  let seed = (seedValue >>> 0) || 123456789;
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
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
  periodG: null
});

const createEmptyStorage = () => (
  [null, null, null]
);

const periodKeyForLetter = (letter) => {
  const normalized = String(letter || '').toUpperCase();
  if (normalized === 'G') return 'periodG';
  return `period${normalized}`;
};

function buildDayPeriodSequence(offset) {
  return Array.isArray(offset) ? offset : Array(6).fill('A');
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

  for (let idx = 0; idx < totalCount; idx += 1) {
    const base = baseChoices[idx % baseChoices.length] || { name: 'General Elective', grade: '9th' };
    const level = levelCycle[idx % levelCycle.length] || 'Standard';

    balancedCatalog.push({
      name: base.name,
      grade: base.grade,
      level,
      sec: `#${100 + idx}`
    });
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

function buildLunchPlanByDay(lunchWave = 'Wave 1') {
  const resolvedWave = LUNCH_WAVES.includes(lunchWave) ? lunchWave : 'Wave 1';
  const dayTimes = LUNCH_WAVE_DAY_TIMES[resolvedWave] || {};

  return DAY_PATTERNS.reduce((acc, pattern) => {
    acc.slotIndexByDay[pattern.day] = LONG_BLOCK_SLOT_INDEX;
    acc.lunchByDay[pattern.day] = dayTimes[pattern.day] || LUNCH_TIME_LABEL;
    acc.waveByDay[pattern.day] = resolvedWave;
    return acc;
  }, { slotIndexByDay: {}, lunchByDay: {}, waveByDay: {} });
}

function validateRotationCoverage(dayPatterns) {
  return dayPatterns.every((pattern) => Array.isArray(pattern?.sequence) && pattern.sequence.length === SLOT_KEYS.length);
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
  const isLunchAssigned = lunchCount === 0 || lunchCount === 1;
  const isMorningAfternoonBalanced = morningAfternoonSplit.classBeforeLunch >= TARGET_MORNING_CLASS_COUNT && morningAfternoonSplit.classAfterLunch >= TARGET_AFTERNOON_CLASS_COUNT;
  const isClassDistributionBalanced = classValues.length <= 1 ? true : (classMax - classMin) <= 2;
  const isClassLimitOkay = classValues.every((count) => count <= 3);

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

function buildClassSignatureCounts(baseSchedule) {
  return Object.values(baseSchedule || {}).reduce((acc, slot) => {
    if (!slot || slot.isPrep || slot.isLunch) return acc;
    const signature = getTokenSignature(slot);
    acc[signature] = (acc[signature] || 0) + 1;
    return acc;
  }, {});
}

function pickLeastUsedBalancedToken(candidates, signatureCounts) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;

  const ranked = candidates
    .map((token) => {
      const signature = getTokenSignature(token);
      return {
        token,
        signature,
        count: signatureCounts[signature] || 0
      };
    })
    .sort((a, b) => a.count - b.count);

  const preferred = ranked.find((row) => row.count < 3);
  return preferred || ranked[0];
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

  const lunchPlan = buildLunchPlanByDay(lunchWave);
  const lunchByDay = lunchPlan.lunchByDay;
  const waveByDay = lunchPlan.waveByDay;
  const periodSequenceByDay = DAY_PATTERNS.reduce((acc, pattern) => {
    acc[pattern.day] = buildDayPeriodSequence(pattern.sequence, pattern.doublePairs);
    return acc;
  }, {});

  const rows = SLOT_KEYS.map((slotKey, slotIdx) => {
    const entries = WEEK_DAYS.map((dayName, dayIdx) => {
      const periodLabel = periodSequenceByDay[dayName]?.[slotIdx] || PERIOD_LETTERS[(dayIdx + slotIdx) % PERIOD_LETTERS.length];
      const sourceToken = baseSchedule[periodKeyForLetter(periodLabel)] || normalizedTokens[slotIdx] || normalizedTokens[0];
      const isLongBlock = slotIdx === LONG_BLOCK_SLOT_INDEX;
      const durationLabel = isLongBlock ? LONG_BLOCK_DURATION_LABEL : STANDARD_BLOCK_DURATION_LABEL;
      const activeWave = waveByDay[dayName] || lunchWave || 'Wave 1';
      const detailParts = [
        `Period ${periodLabel}`,
        durationLabel
      ];

      if (isLongBlock) {
        const splitRule = LUNCH_WAVE_SPLIT_DETAILS[activeWave] || LUNCH_WAVE_SPLIT_DETAILS['Wave 1'];
        detailParts.push(`Lunch: ${lunchByDay[dayName]}`);
        detailParts.push(`Lunch Split: ${activeWave} - ${splitRule}`);
      }

      if (sourceToken?.isLunch) {
        detailParts.push(`Lunch: ${lunchByDay[dayName]}`);
        return {
          name: sourceToken?.name || 'Lunch Break',
          grade: null,
          level: null,
          sec: null,
          isPrep: false,
          isLunch: true,
          kind: 'lunch',
          periodLabel,
          isLunchSlot: isLongBlock,
          detail: detailParts.join(' | ')
        };
      }

      return {
        ...sourceToken,
        kind: sourceToken?.isPrep ? 'prep' : 'class',
        periodLabel,
        isLunch: false,
        isLunchSlot: isLongBlock,
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

export default function HighSchoolScheduleStep({ highGrade, highLetterRange, onLaunchGame, onBack, onExit, onSaveGame, styles, resumeData = null }) {
  const [selectedDept, setSelectedDept] = useState(null);
  const [confirmedDept, setConfirmedDept] = useState(false);
  const [currentTokens, setCurrentTokens] = useState([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);
  const [randomLunchWave, setRandomLunchWave] = useState('');
  const [lunchByDay, setLunchByDay] = useState({});
  const [weeklyRows, setWeeklyRows] = useState([]);
  const [balanceReport, setBalanceReport] = useState(null);
  const [warningModal, setWarningModal] = useState(null);
  const [pendingReviewConfirm, setPendingReviewConfirm] = useState(null);

  const [schedule, setSchedule] = useState(createEmptySchedule());
  const [storageSlots, setStorageSlots] = useState(createEmptyStorage());

  const countClassAssignments = () => Object.values(schedule).filter((slot) => slot && !slot.isPrep && !slot.isLunch).length;

  const showWarning = (message) => {
    setPendingReviewConfirm(null);
    setWarningModal({
      title: 'MANDATORY WARNING',
      message,
      type: 'alert'
    });
  };

  const showConfirmWarning = (message, confirmToken) => {
    setPendingReviewConfirm(confirmToken);
    setWarningModal({
      title: 'WARNING',
      message,
      type: 'confirm'
    });
  };

  const closeWarningModal = () => {
    setWarningModal(null);
    setPendingReviewConfirm(null);
  };

  const countClassAssignmentsBySide = (periodKey) => {
    const targetIndex = PERIOD_KEYS.indexOf(periodKey);
    return Object.entries(schedule).reduce((count, [key, slot]) => {
      if (!slot || slot.isPrep || slot.isLunch) return count;
      const slotIndex = PERIOD_KEYS.indexOf(key);
      return slotIndex <= 2 && targetIndex <= 2 ? count + 1 : slotIndex > 2 && targetIndex > 2 ? count + 1 : count;
    }, 0);
  };

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
      showWarning('Administration Notice: You have exhausted your 3-shuffle limit for this scheduling draft.');
      return;
    }

    const basePool = POOL_EXPANSIONS[deptId] || [];
    const generatedTokens = buildBalancedCatalog(basePool, 4)
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
    const targetIsSameSignature = Boolean(targetItem && !targetItem.isPrep && !targetItem.isLunch && getTokenSignature(targetItem) === getTokenSignature(itemData));

    if (targetIsSameSignature) return true;

    const signature = getTokenSignature(itemData);
    const currentCount = Object.values(schedule).reduce((count, slot) => {
      if (!slot || slot.isPrep || slot.isLunch) return count;
      if (getTokenSignature(slot) !== signature) return count;
      if (targetItem && slot === targetItem) return count;
      return count + 1;
    }, 0);

    if (currentCount >= 3) return false;
    if (countClassAssignments() >= 7) return false;
    return true;
  };

  const hasAllBlocksAssigned = () => {
    return countPrepBlocks() === 1 && countClassAssignments() === 6;
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
        showWarning('Administrative Block: That placement would exceed the six-class limit, break the one prep/lunch rule, or exceed 3 sections of the same class+level.');
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
              showWarning('Administrative Block: That period is full. Use one of the 3 backup slots or trash a class first.');
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
          showWarning('Administrative Block: That placement would exceed the six-class limit, break the one prep/lunch rule, or exceed 3 sections of the same class+level.');
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
          showWarning('Administrative Block: Pick an open backup slot or move the card to a period first.');
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

  const handleProceedToReview = (options = {}) => {
    const { allowNoPrep = false, allowAutoFill = false } = options;
    const normalizedSchedule = { ...schedule };
    const orderedPeriodKeys = PERIOD_LETTERS.map((letter) => periodKeyForLetter(letter));
    const assignedClassCount = Object.values(normalizedSchedule).filter((slot) => slot && !slot.isPrep && !slot.isLunch).length;
    const hasPrepToken = orderedPeriodKeys.some((key) => normalizedSchedule[key]?.isPrep);

    if (currentTokens.length === 0 && assignedClassCount === 0) {
      showWarning('No class tokens are loaded. Pick a department and class tokens before reviewing the contract.');
      return;
    }

    if (assignedClassCount === 0) {
      showWarning('Schedule is empty. Add at least one class before continuing.');
      return;
    }

    if (assignedClassCount === 7 && !hasPrepToken) {
      showWarning('7 classes were selected with no Study Hall/Prep period. Add one prep/study hall block before reviewing the contract.');
      return;
    }

    if (!allowNoPrep && !hasPrepToken && assignedClassCount < 7) {
      showConfirmWarning(
        'No Study Hall/Prep block was selected. You can proceed and auto-balance will insert one prep block, but this may reduce teacher grading/planning time. Continue?',
        'allow-no-prep'
      );
      return;
    }

    if (!allowAutoFill && assignedClassCount < 6) {
      showConfirmWarning(
        'Class selections are incomplete or token picks are limited. Continue with auto-balance to fill remaining periods?',
        'allow-auto-fill'
      );
      return;
    }

    const startingCounts = buildClassSignatureCounts(normalizedSchedule);
    const classPool = [
      ...Object.values(normalizedSchedule).filter((slot) => slot && !slot.isPrep && !slot.isLunch),
      ...currentTokens.filter((slot) => slot && !slot.isPrep && !slot.isLunch)
    ];

    const uniqueSignatures = Array.from(new Set(classPool.map((slot) => getTokenSignature(slot))));
    if (uniqueSignatures.length > 0 && uniqueSignatures.length < 2) {
      showWarning('At least 2 different class tokens are required to keep each class+level at 3 sections max.');
      return;
    }

    // Ensure one prep slot exists so review can always build the contract matrix.
    const prepAlreadyPlaced = orderedPeriodKeys.some((key) => normalizedSchedule[key]?.isPrep);
    if (!prepAlreadyPlaced) {
      const firstEmptyForPrep = orderedPeriodKeys.find((key) => !normalizedSchedule[key]);
      if (firstEmptyForPrep) {
        normalizedSchedule[firstEmptyForPrep] = {
          name: PREP_TOKEN_LABEL,
          grade: null,
          level: 'Standard',
          sec: null,
          isPrep: true,
          isLunch: false,
          wave: null
        };
      }
    }

    const classSignatureCounts = { ...startingCounts };
    const fallbackClass = classPool[0] || {
      name: 'General Elective',
      grade: '9th',
      level: 'Standard',
      sec: '#100',
      isPrep: false,
      isLunch: false,
      wave: null
    };

    // Auto-fill remaining empty periods while honoring class signature max of 3.
    orderedPeriodKeys.forEach((key, idx) => {
      if (!normalizedSchedule[key]) {
        const balancedPick = pickLeastUsedBalancedToken(classPool, classSignatureCounts);
        const nextToken = balancedPick?.token || fallbackClass;
        const signature = getTokenSignature(nextToken);

        if ((classSignatureCounts[signature] || 0) >= 3) {
          return;
        }

        normalizedSchedule[key] = {
          name: nextToken.name,
          grade: nextToken.grade,
          level: nextToken.level,
          sec: nextToken.sec || `#${200 + idx}`,
          isPrep: false,
          isLunch: false,
          wave: null
        };
        classSignatureCounts[signature] = (classSignatureCounts[signature] || 0) + 1;
      }
    });

    const hasUnfilledPeriods = orderedPeriodKeys.some((key) => !normalizedSchedule[key]);
    if (hasUnfilledPeriods) {
      showWarning('Unable to auto-balance schedule without breaking the 3-section class limit. Add more class variety, then retry Review Contract.');
      return;
    }

    const finalCounts = buildClassSignatureCounts(normalizedSchedule);
    const hasOverLimitClass = Object.values(finalCounts).some((count) => count > 3);
    if (hasOverLimitClass) {
      showWarning('More than 3 sections of the same class and level were detected. Remove extras before continuing.');
      return;
    }

    setSchedule(normalizedSchedule);

    const balanceReport = buildContractBalanceReport(normalizedSchedule);
    if (!balanceReport.isLunchAssigned) {
      showWarning('Lunch is assigned automatically and balanced across the week.');
      return;
    }

    const selectedWave = LUNCH_WAVES[Math.floor(Math.random() * LUNCH_WAVES.length)];
    const selectedContract = buildWeeklyContract(normalizedSchedule, selectedWave);

    setRandomLunchWave(selectedWave);
    setLunchByDay(selectedContract.lunchByDay);
    setWeeklyRows(selectedContract.rows);
    setBalanceReport(balanceReport);
    setReviewMode(true);
  };

  const handleWarningConfirm = () => {
    const token = pendingReviewConfirm;
    setWarningModal(null);
    if (token === 'allow-no-prep') {
      handleProceedToReview({ allowNoPrep: true });
      return;
    }
    if (token === 'allow-auto-fill') {
      handleProceedToReview({ allowNoPrep: true, allowAutoFill: true });
      return;
    }
    setPendingReviewConfirm(null);
  };

  const renderWarningModal = () => {
    if (!warningModal) return null;

    return (
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.78)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
        <div style={{ width: '100%', maxWidth: '460px', border: '2px solid #39FF14', borderRadius: '8px', backgroundColor: '#111', padding: '20px', boxShadow: '0 0 20px rgba(57, 255, 20, 0.25)', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#39FF14', letterSpacing: '1px' }}>{warningModal.title}</h3>
          <p style={{ margin: 0, color: '#f5f1dd', fontSize: '0.9rem', lineHeight: 1.6 }}>{warningModal.message}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '18px' }}>
            {warningModal.type === 'confirm' && (
              <button style={{ ...styles.backButton, minWidth: '120px' }} onClick={closeWarningModal}>CANCEL</button>
            )}
            <button
              style={warningModal.type === 'confirm' ? { ...styles.actionButton, minWidth: '120px', padding: '10px 14px' } : { ...styles.actionButton, minWidth: '120px', padding: '10px 14px' }}
              onClick={warningModal.type === 'confirm' ? handleWarningConfirm : closeWarningModal}
            >
              {warningModal.type === 'confirm' ? 'CONTINUE' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
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
      <>
      <div style={styles.setupBox}>
        <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="cap" /> HIGH SCHOOL DEPARTMENTS</h2>
        <p style={styles.subtitle}>Select your specialization branch to load into the dashboard.</p>

        <div style={{ margin: '0 auto 18px', width: '100%', maxWidth: '500px', padding: '10px 12px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', color: '#d7d7d7', fontSize: '0.82rem' }}>
          <strong style={{ color: '#39FF14' }}>Assigned Grade:</strong> {highGrade ? `${highGrade}th Grade` : 'Not Set'} | <strong style={{ color: '#39FF14' }}>Homeroom Range:</strong> {highLetterRange || 'Not Set'}
        </div>
        
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
      {renderWarningModal()}
      </>
    );
  }

  // ----------------------------------------------------------------
  // PHASE 3: FINAL CONTRACT REVIEW
  // ----------------------------------------------------------------
  if (reviewMode) {
    return (
      <>
      <div style={{ ...styles.setupBox, maxWidth: '950px' }}>
        <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}><RetroIcon kind="contract" /> CONTRACT SCHEDULE PREVIEW</h2>
        <p style={styles.subtitle}>Review your locked 7-day high school matrix before avatar customization. Every 4th block is the long block and follows your assigned lunch wave split.</p>
        
        <div className="no-scrollbar" style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '15px', overflowX: 'auto', overflowY: 'visible', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ color: '#39FF14', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="grid" /> 7-Day A-G Rotation Matrix</h3>
            <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem', color: '#fff' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><RetroIcon kind="class" size={20} /> Lunch Wave Slot: <strong style={{ color: '#ffa500' }}>One Per Day, Balanced By Rotation</strong></span>
            </div>
          </div>

          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', color: '#ddd', fontSize: '0.78rem' }}>
            <strong style={{ color: '#39FF14' }}>Role:</strong> Teacher | <strong style={{ color: '#39FF14' }}>School:</strong> High
          </div>

            <div style={{ marginBottom: '10px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.78rem', color: '#ccc' }}>
            Assigned Grade: <strong style={{ color: '#f5f1dd' }}>{highGrade ? `${highGrade}th Grade` : 'Not Set'}</strong> | Homeroom Range: <strong style={{ color: '#f5f1dd' }}>{highLetterRange || 'Not Set'}</strong>
          </div>


          <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.78rem', textAlign: 'center', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #39FF14' }}>
                <th style={{ padding: '8px 7px', color: '#888', width: '22%' }}>BLOCK / TIME</th>
                {WEEK_DAYS.map(day => (
                  <th key={day} style={{ padding: '8px 7px', fontWeight: 'bold', color: '#39FF14', textTransform: 'uppercase' }}>{day}</th>
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
                    const hasDoubleAnchorAbove = !!prevRowEntry?.isDouble && !prevRowEntry?.isDoubleContinuation;
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
                          Lunch Wave Slot
                        </span>
                      )}

                      {row.slotIndex === LONG_BLOCK_SLOT_INDEX && (
                        <span style={{ display: 'inline-block', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px', marginTop: '5px' }}>
                          Long Block + Lunch Split
                        </span>
                      )}
                    </td>
                  )})}
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${WEEK_DAYS.length}, minmax(0, 1fr))`, gap: '8px', marginTop: '12px' }}>
            {WEEK_DAYS.map((day) => (
              <div key={day} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#39FF14', fontWeight: 'bold' }}>{day}</div>
                <div style={{ fontSize: '0.72rem', color: '#ffa500', marginTop: '2px' }}>{lunchByDay[day]}</div>
                <div style={{ fontSize: '0.68rem', color: '#9acb92', marginTop: '2px' }}>{resolveLunchWaveFromTime(lunchByDay[day])}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1a1a1a', borderRadius: '4px', fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="info" /> <span><strong>Matrix Core Rotation Rule:</strong> This contract uses periods A-G throughout the week with one prep block, one lunch wave slot, and balanced morning/afternoon classes.</span></span>
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
                selectedGrade: highGrade,
                selectedRange: highLetterRange,
                selectedDept,
                randomLunchWave,
                lunchByDay,
                contractSchedule: schedule,
                weeklyRows,
                scheduleVersion: 5
              })
            }
          >
            CUSTOMIZE AVATAR <RetroArrow color="#0a0a0a" />
          </button>
        </div>
      </div>
      {renderWarningModal()}
      </>
    );
  }

  // ----------------------------------------------------------------
  // PHASE 2: ACTIVE MATRIX INTERACTIVE DRAG MATRIX
  // ----------------------------------------------------------------
  return (
    <>
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
        <div style={{ backgroundColor: '#222', padding: '15px', borderRadius: '6px', border: '1px solid #39FF14', minHeight: '700px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#39FF14', margin: '0 0 15px 0', display: 'inline-flex', alignItems: 'center', gap: '10px' }}><RetroIcon kind="tokens" /> PICK CLASSES (4 OPTIONS)</h3>
          
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
            <div style={{ padding: '8px', border: '1px solid #2a2a2a', borderRadius: '4px', backgroundColor: '#151515', color: '#9acb92', fontSize: '0.74rem' }}>
              Lunch is assigned automatically between the morning and afternoon blocks and stays the same length each day.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'flex-start' }}>
            {currentTokens.map((course, i) => (
              <div
                key={i}
                draggable
                onDragStart={(e) => handleDragStart(e, { ...course, sourceType: 'library' })}
              >
                {renderScheduleCard(course, { draggable: false, compact: false })}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Static Homeroom Header Slot */}
          <div style={{ minHeight: '40px', backgroundColor: '#001a1a', border: '1px dashed #00FFFF', borderRadius: '6px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#00FFFF', fontWeight: 'bold' }}>HOMEROOM (7:35 AM - 7:50 AM) - FIXED DAILY BLOCK</span>
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
                  PERIOD {letter} ({letter === 'C' ? 'LUNCH SPLIT' : 'CLASS BLOCK'})
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
            Fill the six class periods around the auto lunch split. Use exactly one prep block and keep the class roster balanced with no more than 3 sections of any class and level combination.
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
    {renderWarningModal()}
    </>
  );
}