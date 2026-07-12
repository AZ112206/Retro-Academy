import React, { useMemo, useRef, useState, useEffect } from 'react';
import RetroIcon, { RetroArrow } from './RetroIcon';
import { generateFacultyRoster } from '../../services/staffGenerator';
import { PixelAvatar } from './Teacher Set Up/TeacherAvatarCustomizer.jsx';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const SUPPORT_PERIODS = ['Hall Supervision', 'Family Outreach', 'Documentation Block', 'Student Check-ins', 'Campus Coordination'];
const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const ELEMENTARY_CLASS_OPTIONS = {
  'Reading & ELA': 'Language Arts & Reading',
  Mathematics: 'Elementary Math Focus',
  'Science & Social Studies': 'Integrated Science/SS'
};
const MIDDLE_CLASS_OPTIONS = {
  6: {
    Reading: 'Narrative Literacy & Reading Workshop',
    ELA: 'Introductory Composition & Grammar Mechanics',
    Mathematics: 'Foundations of Mathematics VI',
    Science: 'Introductory Earth & Space Science',
    'Social Studies': 'Ancient World History & Geography'
  },
  7: {
    Reading: 'Critical Reading & Literary Analysis',
    ELA: 'Intermediate Writing & Rhetoric',
    Mathematics: 'Intermediate Mathematical Concepts',
    Science: 'Life Science & Microscopic Worlds',
    'Social Studies': 'Global Cultures & World Geography'
  },
  8: {
    'Foreign Language': 'Espanol: Curso Avanzado Roja',
    ELA: 'Pre-English',
    Mathematics: 'Pre-Algebra',
    Science: 'Introductory Physical Science & Physics Foundations',
    'Social Studies': 'Early American History & Civics Foundations'
  }
};
const HIGH_CLASS_OPTIONS = {
  Mathematics: ['Algebra I', 'Geometry', 'Algebra II', 'Trigonometry', 'Pre-Calculus', 'Calculus'],
  Science: ['Earth Science', 'Biology', 'Chemistry', 'Physics'],
  History: ['World History', 'Modern World History', 'US History', 'Civics & Econ'],
  ELA: ['English I', 'English II', 'English III', 'English IV', 'Creative Writing'],
  'Foreign Language': ['Spanish I', 'French I', 'Spanish II', 'French II', 'Conversational Fluency']
};
const HIGH_LUNCH_WAVE_TIMES = {
  'Wave 1': '10:30 AM - 11:10 AM',
  'Wave 2': '11:10 AM - 11:50 AM',
  'Wave 3': '11:50 AM - 12:30 PM',
  'Wave 4': '12:30 PM - 1:10 PM'
};
const HIGH_SLOT_KEYS = Array.from({ length: 10 }, (_, idx) => `slot${idx + 1}`);
const HIGH_PERIOD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const HIGH_DAY_PATTERNS = [
  { day: 'Monday', sequence: ['A', 'A', 'C', 'D', 'E', 'F', 'G', 'H', 'B', 'B'], doublePairs: [[0, 1], [8, 9]] },
  { day: 'Tuesday', sequence: ['E', 'C', 'C', 'F', 'G', 'H', 'D', 'D', 'I', 'J'], doublePairs: [[1, 2], [6, 7]] },
  { day: 'Wednesday', sequence: ['A', 'B', 'G', 'E', 'E', 'F', 'F', 'H', 'I', 'J'], doublePairs: [[3, 4], [5, 6]] },
  { day: 'Thursday', sequence: ['A', 'B', 'C', 'G', 'G', 'D', 'I', 'H', 'H', 'J'], doublePairs: [[3, 4], [7, 8]] },
  { day: 'Friday', sequence: ['I', 'I', 'A', 'B', 'C', 'D', 'E', 'F', 'J', 'J'], doublePairs: [[0, 1], [8, 9]] }
];
const HIGH_LUNCH_WAVE_DAY_TIMES = {
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
const HIGH_PERIOD_SLOT_TIMES = [
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

function simplifyTeacherRoleLabel(roleText, schoolType) {
  const role = String(roleText || '');
  const lower = role.toLowerCase();
  if (schoolType === 'High' && (lower.includes('teacher') || lower.includes('department head'))) {
    return 'Teacher';
  }
  return role;
}

function getLevelColor(level) {
  if (level === 'Advanced') return '#FF3333';
  if (level === 'Honors') return '#00FFFF';
  return '#39FF14';
}

function buildSpecialEntry(name, kind = 'support', extra = {}) {
  return {
    name,
    kind,
    level: extra.level || null,
    sec: extra.sec || null,
    detail: extra.detail || null
  };
}

function buildClassEntry(name, level, sec, detail) {
  return {
    name,
    kind: 'class',
    level,
    sec,
    detail: detail || null
  };
}

function getEntryColor(entry) {
  if (!entry) return '#666';
  if (entry.kind === 'homeroom') return '#00FFFF';
  if (entry.kind === 'lunch') return '#ffa500';
  if (entry.kind === 'prep') return '#ff9f43';
  if (entry.kind === 'support') return '#f5f1dd';
  if (entry.kind === 'class') return getLevelColor(entry.level || 'Standard');
  return '#fff';
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

function pickWithSeed(items, random) {
  if (!Array.isArray(items) || items.length === 0) return '';
  return items[Math.floor(random() * items.length)] || items[0];
}

function resolveAcademicYearLabel() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const startYear = month >= 6 ? year : year - 1;
  return `${startYear}-${startYear + 1}`;
}

function parseGradeFromRole(role) {
  const text = String(role || '').toLowerCase();
  if (text.includes('kindergarten')) return 'K';
  const match = text.match(/grade\s*(\d+)/i);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveSubjectFromRole(role) {
  const text = String(role || '').toLowerCase();
  if (text.includes('reading & ela')) return 'Reading & ELA';
  if (text.includes('science & social studies')) return 'Science & Social Studies';
  if (text.includes('history')) return 'History';
  if (text.includes('reading')) return 'Reading';
  if (text.includes('ela') || text.includes('english')) return 'ELA';
  if (text.includes('math')) return 'Mathematics';
  if (text.includes('science')) return 'Science';
  if (text.includes('social studies')) return 'Social Studies';
  if (text.includes('spanish') || text.includes('language')) return 'Foreign Language';
  if (text.includes('pe')) return 'Physical Education';
  if (text.includes('music')) return 'Music';
  if (text.includes('art')) return 'Art';
  return 'Core Instruction';
}

function resolveHighDepartmentKeyFromRole(role) {
  const text = String(role || '').toLowerCase();
  if (text.includes('math')) return 'Mathematics';
  if (text.includes('science')) return 'Science';
  if (text.includes('history')) return 'History';
  if (text.includes('english') || text.includes('ela')) return 'ELA';
  if (text.includes('language') || text.includes('spanish') || text.includes('french')) return 'Foreign Language';
  return null;
}

function buildHighDepartmentCoverageMap(facultyRoster) {
  const coverageMap = {};
  if (!facultyRoster || typeof facultyRoster !== 'object') return coverageMap;
  const lunchWaves = ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'];

  Object.entries(facultyRoster).forEach(([tabKey, members]) => {
    if (!tabKey.startsWith('department_') || !Array.isArray(members)) return;

    const departmentFromTab = tabKey === 'department_math'
      ? 'Mathematics'
      : tabKey === 'department_science'
      ? 'Science'
      : tabKey === 'department_history'
      ? 'History'
      : tabKey === 'department_english'
      ? 'ELA'
      : tabKey === 'department_foreign_language'
      ? 'Foreign Language'
      : null;

    const departmentKey = departmentFromTab || resolveHighDepartmentKeyFromRole(members[0]?.role);
    const offerings = HIGH_CLASS_OPTIONS[departmentKey] || [];
    if (offerings.length === 0) return;

    const waveCounts = lunchWaves.reduce((acc, wave) => {
      acc[wave] = 0;
      return acc;
    }, {});

    const prioritizedMembers = [...members].sort((a, b) => {
      if (a?.isPlayer && !b?.isPlayer) return -1;
      if (!a?.isPlayer && b?.isPlayer) return 1;
      return 0;
    });

    const waveOffset = hashString(tabKey) % lunchWaves.length;
    const chooseBalancedWave = () => {
      const minCount = Math.min(...Object.values(waveCounts));
      const candidates = lunchWaves.filter((wave) => waveCounts[wave] === minCount);
      const orderedCandidates = candidates.sort((a, b) => {
        const aIndex = (lunchWaves.indexOf(a) - waveOffset + lunchWaves.length) % lunchWaves.length;
        const bIndex = (lunchWaves.indexOf(b) - waveOffset + lunchWaves.length) % lunchWaves.length;
        return aIndex - bIndex;
      });
      return orderedCandidates[0] || lunchWaves[0];
    };

    prioritizedMembers.forEach((member, index) => {
      const staffKey = member?.id || member?.name;
      if (!staffKey) return;
      const preferredCourse = typeof member?.courseSpecialty === 'string' ? member.courseSpecialty : null;
      const explicitWave = typeof member?.contractLunchWave === 'string' && lunchWaves.includes(member.contractLunchWave)
        ? member.contractLunchWave
        : null;
      const assignedWave = explicitWave || chooseBalancedWave();
      waveCounts[assignedWave] = (waveCounts[assignedWave] || 0) + 1;

      coverageMap[staffKey] = {
        departmentKey,
        primaryCourse: preferredCourse && offerings.includes(preferredCourse)
          ? preferredCourse
          : offerings[index % offerings.length],
        lunchWave: assignedWave
      };
    });
  });

  return coverageMap;
}

function buildHighWeeklyRowsFromTokens(tokens, lunchWave) {
  const buildDayPeriodSequence = (sequence) => {
    return Array.isArray(sequence) ? sequence : Array(10).fill('A');
  };

  const lunchByDay = HIGH_LUNCH_WAVE_DAY_TIMES[lunchWave] || HIGH_LUNCH_WAVE_DAY_TIMES['Wave 1'];
  const periodSequenceByDay = HIGH_DAY_PATTERNS.reduce((acc, pattern) => {
    acc[pattern.day] = buildDayPeriodSequence(pattern.sequence);
    return acc;
  }, {});
  const doubleSlotsByDay = HIGH_DAY_PATTERNS.reduce((acc, pattern) => {
    acc[pattern.day] = new Set(pattern.doublePairs.flat());
    return acc;
  }, {});
  const continuationSlotsByDay = HIGH_DAY_PATTERNS.reduce((acc, pattern) => {
    acc[pattern.day] = new Set(pattern.doublePairs.map((pair) => pair[1]));
    return acc;
  }, {});

  return HIGH_SLOT_KEYS.map((slotKey, slotIdx) => {
    const entries = WEEK_DAYS.map((dayName, dayIdx) => {
      const periodLabel = periodSequenceByDay[dayName]?.[slotIdx] || HIGH_PERIOD_LETTERS[(dayIdx + slotIdx) % HIGH_PERIOD_LETTERS.length];
      const token = tokens[periodLabel] || buildSpecialEntry('Unscheduled', 'support');
      const isDouble = Boolean(doubleSlotsByDay[dayName]?.has(slotIdx));
      const detailParts = [`Period ${periodLabel}`, isDouble ? 'Double Block (80 min)' : 'Single Block (40 min)'];

      if (slotIdx >= 4 && slotIdx <= 7) {
        detailParts.push(`Lunch: ${lunchByDay[dayName]}`);
      }

      const detail = detailParts.join(' | ');
      if (token.kind === 'class') {
        return {
          ...buildClassEntry(token.name, token.level || 'Standard', token.sec || null, detail),
          isDoubleContinuation: Boolean(continuationSlotsByDay[dayName]?.has(slotIdx))
        };
      }

      const prepKind = token.kind === 'prep' ? 'prep' : 'support';
      return {
        ...buildSpecialEntry(token.name || 'Teacher Prep / Study Hall', prepKind, { detail }),
        isDoubleContinuation: Boolean(continuationSlotsByDay[dayName]?.has(slotIdx))
      };
    });

    return {
      block: `Period ${slotIdx + 1}`,
      slotIndex: slotIdx,
      time: HIGH_PERIOD_SLOT_TIMES[slotIdx] || 'Assigned by District',
      entries
    };
  });
}

function buildElementaryProfileSchedule(staff, random) {
  const grade = parseGradeFromRole(staff.role);
  const isLower = grade === 'K' || grade === 1 || grade === 2;
  const subject = resolveSubjectFromRole(staff.role);
  const sectionBase = 300 + Math.floor(random() * 500);
  const wave = pickWithSeed(['Wave A (Early)', 'Wave B (Mid)', 'Wave C (Late)'], random);
  const middayByWave = {
    'Wave A (Early)': '11:15 AM - 11:55 AM',
    'Wave B (Mid)': '11:25 AM - 12:05 PM',
    'Wave C (Late)': '11:35 AM - 12:15 PM'
  };
  const classLevel = pickWithSeed(['Standard', 'Honors', 'Advanced'], random);
  const className = ELEMENTARY_CLASS_OPTIONS[subject] || 'Elementary Core Instruction';

  if (isLower) {
    return [
      { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
      {
        block: 'Literacy Block',
        time: '8:20 AM - 9:35 AM',
        entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry('Language Arts & Reading', classLevel, `K2-LIT-${dayIdx + 1}`))
      },
      {
        block: 'Math Workshop',
        time: '9:55 AM - 11:10 AM',
        entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry('Elementary Math Focus', classLevel, `K2-MTH-${dayIdx + 1}`))
      },
      { block: `${wave} Lunch/Recess`, time: middayByWave[wave], entries: WEEK_DAYS.map(() => buildSpecialEntry('Lunch/Recess Rotation', 'lunch')) },
      {
        block: 'Inquiry Block',
        time: '12:20 PM - 1:15 PM',
        entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry('Integrated Science/SS', classLevel, `K2-INQ-${dayIdx + 1}`))
      },
      { block: 'Specialists/Prep', time: '1:20 PM - 2:05 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Specialists / Teacher Prep', 'prep')) },
      { block: 'Dismissal', time: '2:05 PM - 2:30 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Pack-up and Dismissal', 'support')) }
    ];
  }

  const sections = [`Sec #${sectionBase}`, `Sec #${sectionBase + 1}`, `Sec #${sectionBase + 2}`];
  return [
    { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
    {
      block: 'Session 1',
      time: '8:20 AM - 9:15 AM',
      entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[dayIdx % sections.length]))
    },
    {
      block: 'Session 2',
      time: '9:20 AM - 10:15 AM',
      entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(dayIdx + 1) % sections.length]))
    },
    { block: 'WIN/Intervention', time: '10:20 AM - 11:10 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Targeted Intervention', 'support')) },
    { block: `${wave} Lunch/Recess`, time: middayByWave[wave], entries: WEEK_DAYS.map(() => buildSpecialEntry('Grade-Level Lunch/Recess', 'lunch')) },
    {
      block: 'Session 3',
      time: '12:20 PM - 1:15 PM',
      entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(dayIdx + 2) % sections.length]))
    },
    { block: 'Planning/Specialists', time: '1:20 PM - 2:05 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Planning / Specialists', 'prep')) },
    { block: 'Closure & Dismissal', time: '2:05 PM - 2:30 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Closure and Dismissal', 'support')) }
  ];
}

function buildMiddleProfileSchedule(staff, random) {
  const grade = parseGradeFromRole(staff.role);
  const resolvedGrade = Number.isFinite(grade) ? grade : 6;
  const subject = resolveSubjectFromRole(staff.role);
  const sectionBase = resolvedGrade * 100 + Math.floor(random() * 60) + 1;
  const waveByGrade = { 6: 'Wave A (Early)', 7: 'Wave B (Mid)', 8: 'Wave C (Late)' };
  const wave = waveByGrade[resolvedGrade] || 'Wave B (Mid)';
  const classLevel = pickWithSeed(['Standard', 'Honors', 'Advanced'], random);
  const className = MIDDLE_CLASS_OPTIONS[resolvedGrade]?.[subject] || `Grade ${resolvedGrade} Core Instruction`;

  const sections = [
    `Sec #${sectionBase}`,
    `Sec #${sectionBase + 1}`,
    `Sec #${sectionBase + 2}`,
    `Sec #${sectionBase + 3}`,
    `Sec #${sectionBase + 4}`
  ];

  return [
    { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
    { block: 'Block 1', time: '8:20 AM - 9:10 AM', entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(0 + dayIdx) % sections.length])) },
    { block: 'Block 2', time: '9:15 AM - 10:05 AM', entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(1 + dayIdx) % sections.length])) },
    { block: 'Block 3', time: '10:10 AM - 11:00 AM', entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(2 + dayIdx) % sections.length])) },
    { block: 'Midday Rotation', time: '11:05 AM - 12:45 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry(`Lunch ${wave} + Advisory`, 'lunch')) },
    { block: 'Block 5', time: '12:50 PM - 1:40 PM', entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(3 + dayIdx) % sections.length])) },
    { block: 'Block 6', time: '1:45 PM - 2:30 PM', entries: WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(4 + dayIdx) % sections.length])) }
  ];
}

function buildHighProfileSchedule(staff, random, coverageEntry) {
  const subject = resolveSubjectFromRole(staff.role);
  const lunchWave = coverageEntry?.lunchWave || staff?.contractLunchWave || pickWithSeed(['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'], random);
  const sectionBase = 100 + Math.floor(random() * 800);

  if (staff?.isPlayer && staff?.contractScheduleVersion >= 4 && Array.isArray(staff?.contractWeeklyRows)) {
    const lunchByDay = staff?.contractLunchByDay || {};
    const upgradedRows = staff.contractWeeklyRows.map((row) => {
      const entries = WEEK_DAYS.map((day, dayIdx) => {
        const token = row?.entries?.[dayIdx];
        if (!token) return buildSpecialEntry('Unscheduled', 'support');

        const detailParts = [];
        if (token.periodLabel) detailParts.push(`Period ${token.periodLabel}`);
        if (typeof token.isDouble === 'boolean') detailParts.push(token.isDouble ? 'Double Block' : 'Single Block');
        if (row.slotIndex >= 4 && row.slotIndex <= 7 && lunchByDay[day]) {
          detailParts.push(`Lunch: ${lunchByDay[day]}`);
        }

        const detail = token.detail || detailParts.join(' | ') || null;
        if (token.isPrep) {
          return buildSpecialEntry(token.name || 'Teacher Prep / Study Hall', 'prep', { detail });
        }

        return buildClassEntry(token.name || 'Class Assignment', token.level || 'Standard', token.sec || null, detail);
      });

      return {
        block: row.block || 'Block',
        time: row.time || 'Rotating Window (Day remains 8:20 AM - 2:30 PM)',
        entries
      };
    });

    return [
      { block: 'Homeroom', time: '7:35 AM - 7:50 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
      ...upgradedRows
    ];
  }

  if (staff?.isPlayer && staff?.contractSchedule) {
    const periodKeys = ['period1', 'period2', 'period3', 'period4', 'period5'];
    const lunch = staff.contractLunchWave || lunchWave;
    const periodTokens = periodKeys.map((key) => {
      const token = staff.contractSchedule[key];
      if (!token) return buildSpecialEntry('Unscheduled', 'support');
      if (token.isPrep) return buildSpecialEntry(token.name || 'Teacher Prep / Study Hall', 'support');
      return buildClassEntry(token.name || 'Class Assignment', token.level || 'Standard', token.sec || null, token.grade || null);
    });

    const rotateToken = (baseIndex, dayIdx) => periodTokens[(baseIndex - dayIdx + periodTokens.length) % periodTokens.length];
    const buildPeriodEntries = (periodIndex) => WEEK_DAYS.map((dayName, dayIdx) => {
      const token = rotateToken(periodIndex, dayIdx);
      const dayLunchWindow = HIGH_LUNCH_WAVE_DAY_TIMES[lunch]?.[dayName] || HIGH_LUNCH_WAVE_TIMES[lunch] || 'Assigned';
      if (periodIndex === 2 && token.kind === 'class') {
        return { ...token, detail: `Class Time: Period Schedule | Lunch: ${lunch} (${dayLunchWindow})` };
      }
      if (periodIndex === 2 && token.name?.toLowerCase().includes('prep')) {
        return { ...token, detail: `Class Time: Period Schedule | Lunch: ${lunch} (${dayLunchWindow})` };
      }
      return token;
    });

    return [
      { block: 'Homeroom', time: '7:35 AM - 7:50 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
      { block: 'Period 1', time: 'Period Schedule Window', entries: buildPeriodEntries(0) },
      { block: 'Period 2', time: 'Period Schedule Window', entries: buildPeriodEntries(1) },
      { block: `Period 3 (${lunch})`, time: `Class: Period Schedule | Lunch: ${HIGH_LUNCH_WAVE_TIMES[lunch] || 'Assigned by Admin'}`, entries: buildPeriodEntries(2) },
      { block: 'Period 4', time: 'Period Schedule Window', entries: buildPeriodEntries(3) },
      { block: 'Period 5', time: 'Period Schedule Window', entries: buildPeriodEntries(4) }
    ];
  }
  const subjectKey = subject === 'Social Studies' ? 'History' : subject;
  const pool = HIGH_CLASS_OPTIONS[subjectKey] || [`${subjectKey} Seminar`, `${subjectKey} Foundations`, `${subjectKey} Lab`];
  const shuffledCourses = [...pool].sort(() => random() - 0.5);
  const balancedLevels = ['Standard', 'Honors', 'Advanced', 'Standard', 'Honors', 'Advanced', 'Standard', 'Honors'];
  const levelOffset = Math.floor(random() * balancedLevels.length);

  const courseSequence = Array.from({ length: HIGH_PERIOD_LETTERS.length }, (_, idx) => shuffledCourses[idx % shuffledCourses.length]);
  const levelSequence = Array.from({ length: HIGH_PERIOD_LETTERS.length }, (_, idx) => balancedLevels[(idx + levelOffset) % balancedLevels.length]);

  if (coverageEntry?.primaryCourse && pool.includes(coverageEntry.primaryCourse)) {
    courseSequence[0] = coverageEntry.primaryCourse;
  }

  const prepCount = random() < 0.5 ? 1 : 2;
  const prepIndexes = new Set();
  while (prepIndexes.size < prepCount) {
    prepIndexes.add(Math.floor(random() * HIGH_PERIOD_LETTERS.length));
  }

  const periodTokens = {};
  HIGH_PERIOD_LETTERS.forEach((periodLetter, idx) => {
    if (prepIndexes.has(idx)) {
      periodTokens[periodLetter] = buildSpecialEntry('Teacher Prep / Study Hall', 'prep');
      return;
    }

    const chosenCourse = courseSequence[idx];
    const chosenLevel = levelSequence[idx];
    periodTokens[periodLetter] = buildClassEntry(chosenCourse, chosenLevel, `Sec #${sectionBase + idx}`);
  });

  const weeklyRows = buildHighWeeklyRowsFromTokens(periodTokens, lunchWave);

  return [
    { block: 'Homeroom', time: '7:35 AM - 7:50 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
    ...weeklyRows
  ];
}

function buildSupportSchedule(schoolType, random) {
  const supportFocus = pickWithSeed(SUPPORT_PERIODS, random);
  if (schoolType === 'High') {
    return [
      { block: 'Campus Opening', time: '8:00 AM - 8:30 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry(`${supportFocus} and Morning Coverage`, 'support')) },
      { block: 'Block Coverage', time: '8:35 AM - 10:15 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Student Support Response Rotation', 'support')) },
      { block: 'Midday Rotation', time: '10:20 AM - 12:50 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Midday Coverage and Documentation', 'lunch')) },
      { block: 'Afternoon Support', time: '12:55 PM - 2:30 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Interventions and Campus Coordination', 'support')) }
    ];
  }

  return [
    { block: 'Morning Coverage', time: '8:00 AM - 9:45 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry(`${supportFocus} and Classroom Support`, 'support')) },
    { block: 'Instructional Support', time: '9:50 AM - 11:30 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Push-in / Pull-out Support', 'support')) },
    { block: 'Midday Duty', time: '11:35 AM - 12:20 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Lunch/Recess Operations', 'lunch')) },
    { block: 'Afternoon Rotation', time: '12:25 PM - 2:30 PM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Interventions and Family Follow-up', 'support')) }
  ];
}

function generateLockedStaffSchedule(staff, schoolType, highCoverageMap = {}) {
  const academicYear = resolveAcademicYearLabel();
  const seed = hashString(`${staff?.id || staff?.name || 'staff'}|${schoolType}|${academicYear}`);
  const random = createSeededRandom(seed);
  const roleText = String(staff?.role || '').toLowerCase();
  const isTeacherLike = roleText.includes('teacher') || roleText.includes('department head');

  let rows;
  if (!isTeacherLike) {
    rows = buildSupportSchedule(schoolType, random);
  } else if (schoolType === 'Elementary') {
    rows = buildElementaryProfileSchedule(staff, random);
  } else if (schoolType === 'Middle') {
    rows = buildMiddleProfileSchedule(staff, random);
  } else {
    const staffKey = staff?.id || staff?.name;
    rows = buildHighProfileSchedule(staff, random, highCoverageMap[staffKey]);
  }

  return { academicYear, rows };
}

function StatBar({ label, value, color = '#39FF14' }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#aaa', marginBottom: '4px' }}>
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div style={{ width: '100%', height: '8px', backgroundColor: '#1b1b1b', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${clamp(value, 0, 100)}%`, height: '100%', backgroundColor: color }} />
      </div>
    </div>
  );
}

// Miniature visual representation mirroring the avatar system layout grid arrays
function DirectoryAvatarMini({ appearance }) {
  return (
    <div style={{ transform: 'scale(0.78)', transformOrigin: 'center top', marginBottom: '-22px' }}>
      <PixelAvatar appearance={appearance} size="small" direction="Front" motion={{ blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 }} />
    </div>
  );
}

// Reusable Faculty Grid Card matching the customization options UI panels
function FacultyCard({ staff, onOpen, schoolType }) {
  return (
    <div
      onClick={() => onOpen(staff)}
      style={{
        width: '150px',
        padding: '12px 8px',
        backgroundColor: staff.isPlayer ? '#222d15' : '#121212',
        color: '#fff',
        border: `1px solid ${staff.isPlayer ? '#00FFFF' : '#39FF14'}`,
        borderRadius: '6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        boxShadow: staff.isPlayer ? '0 0 8px rgba(0,255,255,0.2)' : 'none',
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {staff.isPlayer && (
        <span style={{ position: 'absolute', top: '-8px', backgroundColor: '#00FFFF', color: '#000', fontSize: '0.55rem', fontWeight: 'bold', padding: '1px 4px', borderRadius: '3px', letterSpacing: '0.5px' }}>
          YOU
        </span>
      )}
      
      <DirectoryAvatarMini appearance={staff} />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textAlign: 'center', width: '100%' }}>
        {/* Name displayed exactly under the frame */}
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: staff.isPlayer ? '#00FFFF' : '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
          {staff.name}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#39FF14', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          {simplifyTeacherRoleLabel(staff.role, schoolType)}
        </span>
      </div>
    </div>
  );
}

export default function SchoolDirectoryStep({ schoolType, playerAvatar, playerDepartment, playerGrade, onProceed, onBack, styles }) {
  const [activeTab, setActiveTab] = useState('administration');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [liveProfile, setLiveProfile] = useState(null);
  const [selectedStaffSchedule, setSelectedStaffSchedule] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerActionEffects, setPlayerActionEffects] = useState({ health: 0, stress: 0, energy: 0, morale: 0, focus: 0, strictness: 0, kindness: 0, patience: 0, humor: 0, organization: 0 });
  const tabScrollRef = useRef(null);
  const dragStateRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
  const contentScrollRef = useRef(null);
  const contentDragRef = useRef({ dragging: false, startY: 0, startScrollTop: 0 });

  // Procedurally seed the entire school grid dataset
  const facultyRoster = useMemo(() => {
    return generateFacultyRoster(schoolType, playerAvatar, playerDepartment, playerGrade);
  }, [schoolType, playerAvatar, playerDepartment, playerGrade]);

  const highDepartmentCoverage = useMemo(() => {
    if (schoolType !== 'High') return {};
    return buildHighDepartmentCoverageMap(facultyRoster);
  }, [schoolType, facultyRoster]);

  const tabKeys = useMemo(() => Object.keys(facultyRoster), [facultyRoster]);

  useEffect(() => {
    if (!tabKeys.includes(activeTab) && tabKeys.length > 0) {
      setActiveTab(tabKeys[0]);
    }
  }, [activeTab, tabKeys]);

  const currentTabStaff = facultyRoster[activeTab] || [];

  const toOrdinal = (value) => {
    const num = Number(value);
    if (!Number.isFinite(num)) return value;
    const mod100 = num % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
    const mod10 = num % 10;
    if (mod10 === 1) return `${num}st`;
    if (mod10 === 2) return `${num}nd`;
    if (mod10 === 3) return `${num}rd`;
    return `${num}th`;
  };

  const formatTabLabel = (tabKey) => {
    if (tabKey === 'administration') return 'Administration';
    if (tabKey === 'counselors') return 'Counselors';
    if (tabKey === 'nurses') return 'Nurses';
    if (tabKey === 'specialists') return 'Specialists';
    if (tabKey === 'electives') return 'Electives';
    if (tabKey === 'cafeteria_workers') return 'Cafeteria';
    if (tabKey === 'custodians') return 'Custodians';
    if (tabKey === 'kindergarten') return 'Kindergarten';
    if (tabKey.startsWith('grade_')) {
      const gradeRaw = tabKey.replace('grade_', '');
      if (gradeRaw === 'middle') return 'Middle Grade';
      return `${toOrdinal(gradeRaw)} Grade`;
    }
    if (tabKey.startsWith('department_')) {
      const department = tabKey.replace('department_', '').replace(/_/g, ' ');
      return `${department.replace(/\b\w/g, (ch) => ch.toUpperCase())} Dept`;
    }
    return tabKey.replace(/_/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
  };

  const beginTabDrag = (clientX) => {
    if (!tabScrollRef.current) return;
    dragStateRef.current = {
      dragging: true,
      startX: clientX,
      startScrollLeft: tabScrollRef.current.scrollLeft
    };
  };

  const moveTabDrag = (clientX) => {
    if (!dragStateRef.current.dragging || !tabScrollRef.current) return;
    const delta = clientX - dragStateRef.current.startX;
    tabScrollRef.current.scrollLeft = dragStateRef.current.startScrollLeft - delta;
  };

  const endTabDrag = () => {
    dragStateRef.current.dragging = false;
  };

  const beginContentDrag = (clientY) => {
    if (!contentScrollRef.current) return;
    contentDragRef.current = {
      dragging: true,
      startY: clientY,
      startScrollTop: contentScrollRef.current.scrollTop
    };
  };

  const moveContentDrag = (clientY) => {
    if (!contentDragRef.current.dragging || !contentScrollRef.current) return;
    const delta = clientY - contentDragRef.current.startY;
    contentScrollRef.current.scrollTop = contentDragRef.current.startScrollTop - delta;
  };

  const endContentDrag = () => {
    contentDragRef.current.dragging = false;
  };

  useEffect(() => {
    if (selectedStaff) {
      setLiveProfile(selectedStaff.profile || null);
      setSelectedStaffSchedule(generateLockedStaffSchedule(selectedStaff, schoolType, highDepartmentCoverage));
      setShowSchedule(false);
    }
  }, [selectedStaff, schoolType, highDepartmentCoverage]);

  useEffect(() => {
    // Placeholder hook for future gameplay actions: call window.retroApplyPlayerAction({ stress: 10, morale: -5, ... })
    // to affect player vitals after game start.
    window.retroApplyPlayerAction = (effects = {}) => {
      setPlayerActionEffects((current) => {
        const next = { ...current };
        Object.keys(next).forEach((key) => {
          const delta = Number(effects[key] || 0);
          next[key] = clamp(current[key] + delta, -35, 35);
        });
        return next;
      });
    };

    return () => {
      delete window.retroApplyPlayerAction;
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || !liveProfile) return undefined;

    const interval = setInterval(() => {
      setLiveProfile((current) => {
        if (!current) return current;

        const mutate = (value, swing = 6) => clamp(value + (Math.random() * swing * 2 - swing), 0, 100);

        if (selectedStaff?.isPlayer) {
          const drift = (value, effect, randomSwing = 1.8) => {
            const randomDelta = (Math.random() * randomSwing * 2 - randomSwing);
            const effectDelta = effect * 0.22;
            return clamp(value + randomDelta + effectDelta, 0, 100);
          };

          return {
            ...current,
            vitals: {
              ...current.vitals,
              health: drift(current.vitals.health, playerActionEffects.health, 1.1),
              stress: drift(current.vitals.stress, playerActionEffects.stress, 1.4),
              energy: drift(current.vitals.energy, playerActionEffects.energy, 1.5),
              morale: drift(current.vitals.morale, playerActionEffects.morale, 1.3),
              focus: drift(current.vitals.focus, playerActionEffects.focus, 1.2)
            },
            personality: {
              ...current.personality,
              strictness: drift(current.personality.strictness, playerActionEffects.strictness, 0.7),
              kindness: drift(current.personality.kindness, playerActionEffects.kindness, 0.7),
              patience: drift(current.personality.patience, playerActionEffects.patience, 0.9),
              humor: drift(current.personality.humor, playerActionEffects.humor, 0.9),
              organization: drift(current.personality.organization, playerActionEffects.organization, 0.6)
            }
          };
        }

        return {
          ...current,
          vitals: {
            ...current.vitals,
            health: mutate(current.vitals.health, 4),
            stress: mutate(current.vitals.stress, 7),
            energy: mutate(current.vitals.energy, 8),
            morale: mutate(current.vitals.morale, 6),
            focus: mutate(current.vitals.focus, 6)
          },
          personality: {
            ...current.personality,
            strictness: mutate(current.personality.strictness, 3),
            kindness: mutate(current.personality.kindness, 3),
            patience: mutate(current.personality.patience, 4),
            humor: mutate(current.personality.humor, 4),
            organization: mutate(current.personality.organization, 3)
          }
        };
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [gameStarted, liveProfile, playerActionEffects, selectedStaff]);

  const handleOpenStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const handleProceed = () => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    onProceed({ roster: facultyRoster, gameStarted: true });
  };

  return (
    <div style={{ ...styles.setupBox, maxWidth: '1000px' }}>
      <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <RetroIcon kind="contract" /> {schoolType.toUpperCase()} STAFF DIRECTORY
      </h2>
      <p style={styles.subtitle}>
        Review your processed employment authorization roster. All faculty assignments have been verified by the district board.
      </p>

      {/* Directory Tab Selection Bar */}
      <div
        className="no-scrollbar"
        ref={tabScrollRef}
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-start',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '6px',
          cursor: dragStateRef.current.dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        onMouseDown={(e) => beginTabDrag(e.clientX)}
        onMouseMove={(e) => moveTabDrag(e.clientX)}
        onMouseUp={endTabDrag}
        onMouseLeave={endTabDrag}
        onTouchStart={(e) => beginTabDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveTabDrag(e.touches[0].clientX)}
        onTouchEnd={endTabDrag}
      >
        {tabKeys.map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setActiveTab(tabKey)}
            style={{
              padding: '8px 16px',
              fontSize: '0.75rem',
              backgroundColor: activeTab === tabKey ? '#f5f1dd' : '#121212',
              color: activeTab === tabKey ? '#111' : '#fff',
              border: `1px solid ${activeTab === tabKey ? '#f5f1dd' : '#39FF14'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {formatTabLabel(tabKey).toUpperCase()} ({facultyRoster[tabKey]?.length || 0})
          </button>
        ))}
      </div>

      {/* Main Grid View Area */}
      <div
        className="no-scrollbar"
        ref={contentScrollRef}
        style={{ 
          backgroundColor: '#111', 
          border: '1px solid #39FF14', 
          borderRadius: '6px', 
          padding: '24px', 
          minHeight: '280px',
          maxHeight: '440px', 
          overflowY: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
          alignContent: 'flex-start',
          cursor: contentDragRef.current.dragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        onMouseDown={(e) => beginContentDrag(e.clientY)}
        onMouseMove={(e) => moveContentDrag(e.clientY)}
        onMouseUp={endContentDrag}
        onMouseLeave={endContentDrag}
        onTouchStart={(e) => beginContentDrag(e.touches[0].clientY)}
        onTouchMove={(e) => moveContentDrag(e.touches[0].clientY)}
        onTouchEnd={endContentDrag}
      >
        {currentTabStaff.length > 0 ? (
          currentTabStaff.map((staffMember, index) => (
            <FacultyCard key={staffMember.id || `${staffMember.name}-${index}`} staff={staffMember} onOpen={handleOpenStaff} schoolType={schoolType} />
          ))
        ) : (
          <div style={{ color: '#555', fontStyle: 'italic', fontSize: '0.9rem', marginTop: '100px' }}>
            No authorized records discovered in this department segment.
          </div>
        )}
      </div>

      <div style={styles.footerActions}>
        <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={onBack}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <RetroArrow direction="left" /> BACK
          </span>
        </button>
        <button 
          style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} 
          onClick={handleProceed}
        >
          {gameStarted ? 'ENTER WORLD MAP' : 'START GAME'} <RetroArrow color="#0a0a0a" />
        </button>
      </div>

      {selectedStaff && liveProfile && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 60, padding: '20px' }}>
          <div className="no-scrollbar" style={{ width: '100%', maxWidth: '760px', maxHeight: '86vh', overflowY: 'auto', backgroundColor: '#111', border: '2px solid #39FF14', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: '#39FF14', letterSpacing: '1px' }}>{selectedStaff.name.toUpperCase()} PROFILE</h3>
              <button style={styles.backButton} onClick={() => setSelectedStaff(null)}>CLOSE</button>
            </div>

            {showSchedule && selectedStaffSchedule ? (
              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '16px', minHeight: '560px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <p style={{ margin: 0, color: '#39FF14', fontWeight: 'bold', letterSpacing: '0.5px' }}>CONTRACT SCHEDULE PREVIEW</p>
                  <span style={{ color: '#9acb92', fontSize: '0.76rem' }}>School Year {selectedStaffSchedule.academicYear} (Locked)</span>
                </div>

                <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', color: '#ddd', fontSize: '0.78rem' }}>
                  <strong style={{ color: '#39FF14' }}>Role:</strong> {simplifyTeacherRoleLabel(selectedStaff.role, schoolType)} | <strong style={{ color: '#39FF14' }}>School:</strong> {schoolType}
                </div>

                <div className="no-scrollbar" style={{ border: '1px solid #2a2a2a', borderRadius: '6px', overflow: 'auto', flex: 1, minHeight: '420px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                        <th style={{ padding: '10px 8px', color: '#39FF14', textAlign: 'left', minWidth: '190px' }}>BLOCK / TIME</th>
                        {WEEK_DAYS.map((day) => (
                          <th key={day} style={{ padding: '10px 8px', color: '#39FF14', textAlign: 'left', minWidth: '170px' }}>{day.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStaffSchedule.rows.map((row, idx) => (
                        <tr key={`${row.block}-${idx}`} style={{ borderBottom: '1px solid #232323' }}>
                          <td style={{ padding: '10px 8px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 'bold' }}>{row.block}</div>
                            <div style={{ color: '#9a9a9a', fontSize: '0.72rem' }}>{row.time}</div>
                          </td>
                          {(row.entries || WEEK_DAYS.map(() => '')).map((entry, entryIdx) => {
                            const normalized = entry && typeof entry === 'object' ? entry : buildSpecialEntry(String(entry || 'Unscheduled'), 'support');
                            if (normalized.isDoubleContinuation) return null;

                            const primaryColor = getEntryColor(normalized);
                            const showClassMeta = normalized.kind === 'class' && (normalized.level || normalized.sec);
                            const showLunchTag = normalized.kind === 'lunch';
                            const showDetail = Boolean(normalized.detail);
                            const cellRowSpan = normalized.isDouble ? 2 : 1;

                            return (
                              <td key={`${row.block}-${entryIdx}`} rowSpan={cellRowSpan} style={{ padding: '10px 8px', borderRight: '1px solid #222', verticalAlign: 'top' }}>
                                <div style={{ fontWeight: 'bold', color: primaryColor, fontSize: '0.82rem' }}>
                                  {normalized.name}
                                </div>

                                {showClassMeta && (
                                  <div style={{ fontSize: '0.72rem', marginTop: '4px', color: primaryColor }}>
                                    [{normalized.level || 'Standard'}] {normalized.sec || ''}
                                  </div>
                                )}

                                {showDetail && (
                                  <div style={{ fontSize: '0.7rem', marginTop: '4px', color: '#b6d9b1' }}>
                                    {normalized.detail}
                                  </div>
                                )}

                                {showLunchTag && (
                                  <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px' }}>
                                    Splits for Lunch
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #2a2a2a', fontSize: '0.76rem', color: '#8f8f8f', textAlign: 'center' }}>
                  Weekly contract matrix rotates class sections across Monday-Friday while non-academic blocks stay fixed by role.
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '14px' }}>
                  <button style={{ ...styles.backButton, minWidth: '180px' }} onClick={() => setShowSchedule(false)}>
                    EXIT SCHEDULE
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PixelAvatar appearance={selectedStaff} size="small" direction="Front" motion={{ blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 }} />
                  </div>

                  <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px' }}>
                    <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Occupation:</strong> {simplifyTeacherRoleLabel(selectedStaff.role, schoolType)}</p>
                    <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Age:</strong> {liveProfile.age}</p>
                    <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Birthday:</strong> {liveProfile.birthday}</p>
                    <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Years Teaching:</strong> {liveProfile.yearsTeaching}</p>
                    <p style={{ margin: 0, color: '#fff' }}><strong>Gender:</strong> {selectedStaff.gender || 'N/A'}</p>
                  </div>

                  <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <StatBar label="Health" value={liveProfile.vitals.health} color="#39FF14" />
                    <StatBar label="Stress" value={liveProfile.vitals.stress} color="#FF3333" />
                    <StatBar label="Energy" value={liveProfile.vitals.energy} color="#00FFFF" />
                    <StatBar label="Morale" value={liveProfile.vitals.morale} color="#F7F7F7" />
                    <StatBar label="Focus" value={liveProfile.vitals.focus} color="#FFA500" />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px' }}>
                      <p style={{ margin: '0 0 10px', color: '#39FF14', fontWeight: 'bold' }}>WORK EXPERIENCE</p>
                      {Array.isArray(liveProfile.previousPositions) && liveProfile.previousPositions.length > 0 ? (
                        liveProfile.previousPositions.map((entry, idx) => (
                          <p key={`${entry.position}-${idx}`} style={{ margin: '0 0 6px', color: '#fff', fontSize: '0.86rem' }}>
                            <strong>{entry.position}</strong> - {entry.years} yr{entry.years === 1 ? '' : 's'}
                          </p>
                        ))
                      ) : (
                        <p style={{ margin: 0, color: '#888', fontSize: '0.82rem' }}>No prior records available.</p>
                      )}
                    </div>

                    <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px' }}>
                      <p style={{ margin: '0 0 10px', color: '#39FF14', fontWeight: 'bold' }}>SCHEDULE ACCESS</p>
                      <button
                        style={{ ...styles.actionButton, width: '100%', padding: '10px 12px', fontSize: '0.84rem' }}
                        onClick={() => setShowSchedule(true)}
                      >
                        VIEW SCHEDULE
                      </button>
                      <p style={{ margin: '10px 0 0', color: '#9acb92', fontSize: '0.76rem' }}>
                        Randomized and locked for school year {selectedStaffSchedule?.academicYear || 'N/A'}. Regenerates next school year.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <StatBar label="Strictness" value={liveProfile.personality.strictness} color="#ff6b6b" />
                  <StatBar label="Kindness" value={liveProfile.personality.kindness} color="#4ecdc4" />
                  <StatBar label="Patience" value={liveProfile.personality.patience} color="#ffe66d" />
                  <StatBar label="Humor" value={liveProfile.personality.humor} color="#c7f464" />
                  <StatBar label="Organization" value={liveProfile.personality.organization} color="#7b9acc" />
                </div>

                <p style={{ margin: '14px 0 0', color: gameStarted ? '#39FF14' : '#888', fontSize: '0.82rem' }}>
                  {gameStarted
                    ? (selectedStaff?.isPlayer
                      ? 'Game mode is active: your vitals/personality now react to action effects (action system integration is TBD).'
                      : 'Game mode is active: this NPC profile is fluctuating in real time.')
                    : 'Game mode is inactive: stats stay fixed until you press START GAME.'}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}