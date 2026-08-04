import React, { useMemo, useRef, useState, useEffect } from 'react';
import RetroIcon, { RetroArrow } from './RetroIcon';
import { generateFacultyRoster } from '../../services/staffGenerator';
import { generateRoster } from '../../services/studentGenerator';
import { PixelAvatar } from './Teacher Set Up/TeacherAvatarCustomizer.jsx';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const SUPPORT_PERIODS = ['Hall Supervision', 'Family Outreach', 'Documentation Block', 'Student Check-ins', 'Campus Coordination'];
const WEEK_DAYS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
const ELEMENTARY_WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
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
const ELEMENTARY_REPORT_CARD_ELECTIVES = ['Visual Art', 'Music', 'Physical Education', 'Computer Tech'];
const MIDDLE_REPORT_CARD_ELECTIVES = ['Visual Art', 'Music', 'Physical Education', 'Computer Tech', 'Library Media'];
const MIDDLE_SPECIALIST_ROTATION = {
  6: { specialistBlock: 'Block 2', studyHallBlock: 'Block 4', lunchLabel: 'Wave A (Early)' },
  7: { specialistBlock: 'Block 4', studyHallBlock: 'Block 6', lunchLabel: 'Wave B (Mid)' },
  8: { specialistBlock: 'Block 6', studyHallBlock: 'Block 2', lunchLabel: 'Wave C (Late)' }
};
const ELEMENTARY_LUNCH_WAVE_BY_GRADE = {
  0: { label: 'Wave A (Early)', time: '11:15 AM - 11:55 AM', pairedWith: 'Grade 4', order: 'Recess First / Lunch Second' },
  1: { label: 'Wave B (Mid)', time: '11:25 AM - 12:05 PM', pairedWith: 'Grade 3', order: 'Lunch First / Recess Second' },
  2: { label: 'Wave C (Late)', time: '11:35 AM - 12:15 PM', pairedWith: 'Grade 5', order: 'Recess First / Lunch Second' },
  3: { label: 'Wave B (Mid)', time: '11:25 AM - 12:05 PM', pairedWith: 'Grade 1', order: 'Lunch First / Recess Second' },
  4: { label: 'Wave A (Early)', time: '11:15 AM - 11:55 AM', pairedWith: 'Kindergarten', order: 'Recess First / Lunch Second' },
  5: { label: 'Wave C (Late)', time: '11:35 AM - 12:15 PM', pairedWith: 'Grade 2', order: 'Recess First / Lunch Second' }
};
const MIDDLE_LUNCH_WAVE_BY_GRADE = {
  6: { label: 'Wave A (Early)', time: '10:35 AM - 11:05 AM' },
  7: { label: 'Wave B (Mid)', time: '11:10 AM - 11:40 AM' },
  8: { label: 'Wave C (Late)', time: '11:45 AM - 12:15 PM' }
};
const MIDDLE_BLOCK_TIMES = {
  homeroom: '8:00 AM - 8:15 AM',
  block1: '8:20 AM - 9:00 AM',
  block2: '9:05 AM - 9:45 AM',
  block3: '9:50 AM - 10:30 AM',
  block4: '12:20 PM - 1:00 PM',
  block5: '1:05 PM - 1:45 PM',
  block6: '1:50 PM - 2:30 PM'
};
const MIDDLE_SUPPORT_WINDOWS_BY_GRADE = {
  6: [{ block: 'Student Support', time: '11:10 AM - 12:15 PM' }],
  7: [
    { block: 'Student Support', time: '10:35 AM - 11:05 AM' },
    { block: 'Student Support', time: '11:45 AM - 12:15 PM' }
  ],
  8: [{ block: 'Student Support', time: '10:35 AM - 11:40 AM' }]
};
const HIGH_CLASS_OPTIONS = {
  Mathematics: ['Algebra I', 'Geometry', 'Algebra II', 'Trigonometry', 'Pre-Calculus', 'Calculus'],
  Science: ['Earth Science', 'Biology', 'Chemistry', 'Physics'],
  History: ['World History', 'Modern World History', 'US History', 'Civics & Econ'],
  ELA: ['English I', 'English II', 'English III', 'English IV', 'Creative Writing'],
  'Foreign Language': ['Spanish I', 'French I', 'Spanish II', 'French II', 'Conversational Fluency']
};
const CLASS_LEVELS = ['Standard', 'Honors', 'Advanced'];
const HIGH_LUNCH_WAVE_TIMES = {
  'Wave 1': '10:30 AM - 11:10 AM',
  'Wave 2': '11:10 AM - 11:50 AM',
  'Wave 3': '11:50 AM - 12:30 PM',
  'Wave 4': '12:30 PM - 1:10 PM'
};
const HIGH_SLOT_KEYS = Array.from({ length: 6 }, (_, idx) => `slot${idx + 1}`);
const HIGH_PERIOD_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const HIGH_LONG_BLOCK_SLOT_INDEX = 3;
const HIGH_LONG_BLOCK_DURATION_LABEL = 'Long Block (90 min)';
const HIGH_STANDARD_BLOCK_DURATION_LABEL = 'Class Block (50 min)';
const HIGH_LUNCH_WAVE_SPLIT_DETAILS = {
  'Wave 1': '30 min lunch then 90 min class',
  'Wave 2': '30 min class then 30 min lunch then 60 min class',
  'Wave 3': '60 min class then 30 min lunch then 30 min class',
  'Wave 4': '90 min class then 30 min lunch'
};
const HIGH_STUDENT_LUNCH_WAVES = ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'];
const HIGH_STUDY_HALL_GRADE_MIX = [9, 10, 11, 12];
const HIGH_DAY_PATTERNS = [
  { day: 'Day 1', sequence: ['A', 'B', 'G', 'D', 'E', 'F'] },
  { day: 'Day 2', sequence: ['B', 'C', 'A', 'E', 'F', 'G'] },
  { day: 'Day 3', sequence: ['C', 'D', 'B', 'A', 'G', 'E'] },
  { day: 'Day 4', sequence: ['D', 'B', 'C', 'F', 'E', 'G'] },
  { day: 'Day 5', sequence: ['A', 'C', 'D', 'B', 'G', 'E'] },
  { day: 'Day 6', sequence: ['C', 'D', 'A', 'G', 'E', 'F'] },
  { day: 'Day 7', sequence: ['D', 'A', 'B', 'C', 'F', 'E'] }
];
const HIGH_LUNCH_WAVE_DAY_TIMES = {
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
const HIGH_PERIOD_SLOT_TIMES = [
  '7:55 AM - 8:45 AM',
  '8:50 AM - 9:40 AM',
  '9:45 AM - 10:35 AM',
  '10:40 AM - 12:40 PM',
  '12:45 PM - 1:35 PM',
  '1:40 PM - 2:30 PM'
];

function resolveHighLunchWaveFromTime(timeLabel) {
  const normalized = String(timeLabel || '').trim();
  const matched = Object.entries(HIGH_LUNCH_WAVE_DAY_TIMES).find(([, byDay]) =>
    WEEK_DAYS.some((day) => byDay[day] === normalized)
  );
  return matched ? matched[0] : 'Adjusted';
}
const HIGH_LUNCH_WAVE_SLOT_INDEX = {
  'Wave 1': 4,
  'Wave 2': 5,
  'Wave 3': 6,
  'Wave 4': 7
};

function simplifyTeacherRoleLabel(roleText, schoolType) {
  const role = String(roleText || '');
  const lower = role.toLowerCase();
  if (schoolType === 'High' && lower.startsWith('elective teacher - ')) {
    return role.replace('Elective Teacher - ', '').trim() + ' Teacher';
  }
  if (schoolType === 'High' && (lower.includes('teacher') || lower.includes('department head'))) {
    return 'Teacher';
  }
  return role;
}

function isTeacherLikeRole(roleText) {
  const lower = String(roleText || '').toLowerCase();
  return lower.includes('teacher') || lower.includes('department head');
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

function resolveGradeNumberFromLabel(gradeLabel) {
  const text = String(gradeLabel || '').toLowerCase();
  if (text.includes('kindergarten') || text === 'k') return 0;
  const match = text.match(/\d+/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatRosterGradeLabel(gradeLabel) {
  const numeric = resolveGradeNumberFromLabel(gradeLabel);
  if (numeric === 0) return 'K';
  if (Number.isFinite(numeric)) return String(numeric);
  return String(gradeLabel || '').replace(/\b(th|st|nd|rd)\b/gi, '').trim() || 'N/A';
}

function resolveSectionStudentGrade(section, student, studentIndex) {
  if (!Array.isArray(section?.gradeDistribution) || section.gradeDistribution.length === 0) {
    return section?.gradeLabel || '9th';
  }

  const gradeSeed = hashString(`${section.key}|${student?.sharedRosterId || student?.id || studentIndex}|grade`);
  const pickedGrade = section.gradeDistribution[gradeSeed % section.gradeDistribution.length];
  if (pickedGrade === 0) return 'Kindergarten';
  return `${pickedGrade}th`;
}

function resolveSectionStudentLunchWave(section, student, studentIndex) {
  if (!Array.isArray(section?.lunchWaveDistribution) || section.lunchWaveDistribution.length === 0) {
    return section?.lunchWave || null;
  }

  const lunchSeed = hashString(`${section.key}|${student?.sharedRosterId || student?.id || studentIndex}|lunch-wave`);
  return section.lunchWaveDistribution[lunchSeed % section.lunchWaveDistribution.length] || section.lunchWaveDistribution[0] || null;
}

function getElementaryLunchConfigByGrade(gradeInput) {
  if (gradeInput === 'K') return ELEMENTARY_LUNCH_WAVE_BY_GRADE[0];
  const numeric = Number.isFinite(gradeInput) ? gradeInput : resolveGradeNumberFromLabel(gradeInput);
  return ELEMENTARY_LUNCH_WAVE_BY_GRADE[numeric] || ELEMENTARY_LUNCH_WAVE_BY_GRADE[1];
}

function getMiddleLunchConfigByGrade(gradeInput) {
  const numeric = Number.isFinite(gradeInput) ? gradeInput : resolveGradeNumberFromLabel(gradeInput);
  return MIDDLE_LUNCH_WAVE_BY_GRADE[numeric] || MIDDLE_LUNCH_WAVE_BY_GRADE[6];
}

function getMiddleSupportWindowsByGrade(gradeInput) {
  const numeric = Number.isFinite(gradeInput) ? gradeInput : resolveGradeNumberFromLabel(gradeInput);
  return MIDDLE_SUPPORT_WINDOWS_BY_GRADE[numeric] || MIDDLE_SUPPORT_WINDOWS_BY_GRADE[6];
}

function resolveSubjectFromRole(role) {
  const text = String(role || '').toLowerCase();
  if (text.includes('reading & ela')) return 'Reading & ELA';
  if (text.includes('science & social studies')) return 'Science & Social Studies';
  if (text.includes('algebra') || text.includes('geometry') || text.includes('trigonometry') || text.includes('calculus') || text.includes('pre-calculus')) return 'Mathematics';
  if (text.includes('earth science') || text.includes('biology') || text.includes('chemistry') || text.includes('physics') || text.includes('life science')) return 'Science';
  if (text.includes('world history') || text.includes('us history') || text.includes('civics') || text.includes('economics') || text.includes('geography')) return 'History';
  if (text.includes('composition') || text.includes('writing') || text.includes('literacy') || text.includes('grammar') || text.includes('rhetoric')) return 'ELA';
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

function resolveHighElectiveCourseFromRole(role) {
  const text = String(role || '').toLowerCase();
  if (!text.includes('elective teacher')) return null;
  if (text.includes('art')) return 'Art';
  if (text.includes('music')) return 'Music';
  if (text.includes('theater')) return 'Theater';
  if (text.includes('computer science')) return 'Computer Science';
  if (text.includes('business')) return 'Business';
  if (text.includes('pe')) return 'PE';
  return 'Elective';
}

function isStandardOnlyHighCourse(courseName = '') {
  const text = String(courseName).toLowerCase();
  return [
    'creative writing',
    'conversational fluency',
    'art',
    'music',
    'theater',
    'computer science',
    'business',
    'pe'
  ].some((label) => text === label || text.includes(label));
}

function buildHighCourseSequence(staff, coverageEntry, random) {
  const electiveCourse = resolveHighElectiveCourseFromRole(staff?.role);
  if (electiveCourse) {
    return Array.from({ length: HIGH_PERIOD_LETTERS.length }, () => electiveCourse);
  }

  const subject = resolveSubjectFromRole(staff?.role);
  const subjectKey = subject === 'Social Studies' ? 'History' : subject;
  const pool = HIGH_CLASS_OPTIONS[subjectKey] || [`${subjectKey} Seminar`, `${subjectKey} Foundations`, `${subjectKey} Lab`];
  const shuffledCourses = [...pool].sort(() => random() - 0.5);
  const courseSequence = Array.from({ length: HIGH_PERIOD_LETTERS.length }, (_, idx) => shuffledCourses[idx % shuffledCourses.length]);

  if (coverageEntry?.primaryCourse && pool.includes(coverageEntry.primaryCourse)) {
    courseSequence[0] = coverageEntry.primaryCourse;
  }

  return courseSequence;
}

function buildHighLevelSequence(courseSequence, random) {
  const balancedLevels = ['Standard', 'Honors', 'Advanced', 'Standard', 'Honors', 'Advanced', 'Standard', 'Honors'];
  const levelOffset = Math.floor(random() * balancedLevels.length);

  return courseSequence.map((courseName, idx) => {
    if (isStandardOnlyHighCourse(courseName)) return 'Standard';
    return balancedLevels[(idx + levelOffset) % balancedLevels.length];
  });
}

function deriveStudentAgeFromGrade(gradeLabel = '9th') {
  const text = String(gradeLabel).toLowerCase();
  if (text.includes('kindergarten') || text === 'k') return 5 + Math.floor(Math.random() * 2);
  // Check multi-digit grades first so '12th' is not caught by the '1' or '2' checks
  if (text.includes('12')) return 17 + Math.floor(Math.random() * 2);
  if (text.includes('11')) return 16 + Math.floor(Math.random() * 2);
  if (text.includes('10')) return 15 + Math.floor(Math.random() * 2);
  if (text.includes('9')) return 14 + Math.floor(Math.random() * 2);
  if (text.includes('8')) return 13 + Math.floor(Math.random() * 2);
  if (text.includes('7')) return 12 + Math.floor(Math.random() * 2);
  if (text.includes('6')) return 11 + Math.floor(Math.random() * 2);
  if (text.includes('5')) return 10 + Math.floor(Math.random() * 2);
  if (text.includes('4')) return 9 + Math.floor(Math.random() * 2);
  if (text.includes('3')) return 8 + Math.floor(Math.random() * 2);
  if (text.includes('2')) return 7 + Math.floor(Math.random() * 2);
  if (text.includes('1')) return 6 + Math.floor(Math.random() * 2);
  return 14 + Math.floor(Math.random() * 5);
}

function buildStudentVitals(seedStudent) {
  return {
    health: clamp(Math.round((seedStudent.behavior + seedStudent.attendance) / 2), 0, 100),
    stress: clamp(100 - seedStudent.behavior + Math.floor(Math.random() * 12), 0, 100),
    energy: clamp(seedStudent.attendance + Math.floor(Math.random() * 15) - 5, 0, 100),
    morale: clamp(seedStudent.behavior + Math.floor(Math.random() * 10) - 4, 0, 100),
    focus: clamp(seedStudent.grades + Math.floor(Math.random() * 12) - 6, 0, 100)
  };
}

function buildStudentPersonality(seedStudent) {
  return {
    strictness: clamp(35 + Math.floor(Math.random() * 35), 0, 100),
    kindness: clamp(45 + Math.floor(Math.random() * 40), 0, 100),
    patience: clamp(seedStudent.behavior + Math.floor(Math.random() * 12) - 6, 0, 100),
    humor: clamp(40 + Math.floor(Math.random() * 45), 0, 100),
    organization: clamp(seedStudent.grades + Math.floor(Math.random() * 10) - 5, 0, 100)
  };
}

function buildStudentAvatarAppearance(seedStudent, sectionKey, studentIndex) {
  const seed = hashString(`${sectionKey}|${seedStudent?.id || seedStudent?.name || 'student'}|${studentIndex}`);
  const random = createSeededRandom(seed);
  const gender = random() > 0.5 ? 'Male' : 'Female';
  const skinToneGroups = [
    ['#8B5A3C', '#6F432B', '#55301F'],
    ['#D39A73', '#B97D57', '#9A6142'],
    ['#F3D9C7', '#EBC4AF', '#D9AA8D'],
    ['#F0D2B3', '#D9B089', '#C28F69'],
    ['#D7AC7E', '#BE8C5E', '#9A6945'],
    ['#E3BF9D', '#C68F69', '#8C5D40']
  ];
  const hairStylesByGender = {
    Male: ['Side Part', 'Crop', 'Waves', 'Slick Back', 'Fade'],
    Female: ['Long Straight', 'Curly Long', 'Ponytail', 'Bun', 'Braids']
  };
  const hairColors = ['#20140F', '#4A3728', '#6D4C41', '#8E6B3F', '#0A0A0A'];
  const faceShapes = ['Oval', 'Round', 'Square', 'Heart'];
  const eyeShapes = ['Focused', 'Round', 'Narrow', 'Soft'];
  const browStyles = ['Straight', 'Arched', 'Soft', 'Bold'];
  const noseShapes = ['Short', 'Straight', 'Wide', 'Sharp'];
  const mouthStyles = ['Calm', 'Smile', 'Smirk', 'Focused'];
  const eyeColors = ['#201A17', '#4B3428', '#2A5B8A', '#3A7D44', '#6B6F72'];
  const lipColors = ['#542423', '#8B3A62', '#B85C7D', '#D8788A'];
  const wardrobeColors = ['#1F3A5F', '#2D6A4F', '#7A3E2B', '#5B3F8C', '#6E4B2A', '#3C3C3C', '#9A2D2D', '#E8E1D4'];
  const shoeColors = ['#111111', '#3C3C3C', '#5B3F2A', '#E8E1D4', '#7F8C8D'];

  const pickFrom = (items) => items[Math.floor(random() * items.length)] || items[0];
  const skinTone = pickFrom(pickFrom(skinToneGroups));

  return {
    gender,
    hairStyle: pickFrom(hairStylesByGender[gender]),
    hairColor: pickFrom(hairColors),
    skinTone,
    faceShape: pickFrom(faceShapes),
    eyeShape: pickFrom(eyeShapes),
    eyeColor: pickFrom(eyeColors),
    browStyle: pickFrom(browStyles),
    noseShape: pickFrom(noseShapes),
    mouthStyle: pickFrom(mouthStyles),
    lipColor: pickFrom(lipColors),
    topColor: pickFrom(wardrobeColors),
    bottomColor: pickFrom(wardrobeColors),
    shoeColor: pickFrom(shoeColors)
  };
}

function formatPeriodLabel(periodLabel) {
  const normalized = String(periodLabel || '')
    .trim()
    .replace(/^period\s*/i, '')
    .trim()
    .toUpperCase();
  if (!normalized) return 'Period';
  return `Period ${normalized}`;
}

function getClassTypeAbbreviation(classType) {
  const normalized = String(classType || '').trim().toLowerCase();
  if (normalized === 'honors') return '(H)';
  if (normalized === 'advanced') return '(A)';
  return '(S)';
}

function buildStudentRosterFromSections(sections) {
  const rosterCache = new Map();
  return sections.reduce((acc, section, sectionIndex) => {
    const size = Math.min(section.maxStudents || 24, 18 + ((sectionIndex * 3) % 7));
    const rosterGroup = section.rosterGroup || section.key;
    let seededStudents = rosterCache.get(rosterGroup);
    if (!seededStudents) {
      seededStudents = generateRoster(size).map((student, studentIndex) => {
        return {
          ...student,
          sharedRosterId: `${rosterGroup}-${student.id}`,
          appearance: buildStudentAvatarAppearance(student, rosterGroup, studentIndex),
          vitals: buildStudentVitals(student),
          personality: buildStudentPersonality(student)
        };
      });
      rosterCache.set(rosterGroup, seededStudents);
    }
    acc[section.key] = seededStudents.map((student, studentIndex) => {
      const resolvedGrade = resolveSectionStudentGrade(section, student, studentIndex);
      const resolvedAge = deriveStudentAgeFromGrade(resolvedGrade);
      const resolvedLunchWave = resolveSectionStudentLunchWave(section, student, studentIndex);
      const displayGrade = formatRosterGradeLabel(resolvedGrade);
      return {
        ...student,
        id: `${section.key}-${student.sharedRosterId || student.id || studentIndex}`,
        age: resolvedAge,
        grade: resolvedGrade,
        displayGrade,
        classGrade: section.courseLevel || 'Standard',
        className: section.courseName,
        sectionCode: section.sectionCode,
        rosterGroup: section.rosterGroup || section.key,
        courseNumber: section.courseNumber,
        blockLabel: section.blockLabel,
        lunchWave: resolvedLunchWave,
        teacherLunchWave: section.teacherLunchWave || null,
        sectionTeacherName: section.teacherName || null,
        homeroomTeacherName: section.homeroomTeacherName || section.teacherName || null,
        rosterLabel: section.label,
        currentGradeLetter: 'A+',
        currentGradeNumber: 100,
        homeroom: 'Homeroom & Attendance',
        profile: {
          age: resolvedAge,
          occupation: 'Student',
          yearsTeaching: 0,
          birthday: `Grade ${resolvedGrade} Student`,
          previousPositions: [{ position: section.courseName, years: 1 }],
          vitals: student.vitals,
          personality: student.personality
        }
      };
    });
    return acc;
  }, {});
}

function buildElementaryStudentRoster(playerDepartment, playerGrade) {
  const numericGrade = Number(playerGrade);
  const isPrimaryElementary = !Number.isFinite(numericGrade) || numericGrade <= 2;
  const gradeLabel = numericGrade === 0 ? 'Kindergarten' : `${numericGrade}th`;
  const baseCourseName = playerDepartment?.course || playerDepartment?.name || (numericGrade >= 3 ? 'Elementary Core' : 'General Classroom Block');
  const normalizedCourseName = numericGrade >= 3 ? baseCourseName : 'General Classroom Block';
  const gradeCode = Number.isFinite(numericGrade) ? numericGrade : 'K';
  const sections = [
    {
      key: 'homeroom',
      label: `Homeroom | HR-E${gradeCode} | Period HR`,
      sectionCode: `HR-E${gradeCode}`,
      gradeLabel,
      courseName: 'Homeroom & Attendance',
      courseLevel: 'Standard',
      courseNumber: `HR-E${gradeCode}`,
      blockLabel: 'HR',
      maxStudents: 22,
      rosterGroup: 'elementary-homeroom'
    }
  ];

  if (!isPrimaryElementary) {
    const homeroomSectionNumber = String(Math.floor(Math.random() * 3) + 1);
    ['1', '2', '3'].forEach((sessionNumber) => {
      sections.push({
        key: `session-${sessionNumber}`,
        label: `${normalizedCourseName} | Sec E${gradeCode}${sessionNumber} | Period ${sessionNumber}`,
        sectionCode: `Sec E${gradeCode}${sessionNumber}`,
        gradeLabel,
        courseName: normalizedCourseName,
        courseLevel: 'Standard',
        courseNumber: `Sec E${gradeCode}${sessionNumber}`,
        blockLabel: sessionNumber,
        maxStudents: 22,
        rosterGroup: sessionNumber === homeroomSectionNumber ? 'elementary-homeroom' : `elementary-section-${sessionNumber}`
      });
    });
  }

  return buildStudentRosterFromSections(sections);
}

function buildMiddleStudentRoster(playerDepartment, playerGrade, playerAvatar) {
  const gradeLabel = `${playerGrade || 6}th`;
  const courseName = playerDepartment?.name || 'Middle Core Instruction';
  const sectionPrefix = `M${playerGrade || 6}`;
  const resolvedGrade = Number(playerGrade) || 6;
  const gradeConfig = MIDDLE_SPECIALIST_ROTATION[resolvedGrade] || MIDDLE_SPECIALIST_ROTATION[6];
  const specialistBlockNumber = String(gradeConfig.specialistBlock || '').match(/\d+/)?.[0] || '2';
  const playerTeacherName = playerAvatar?.name || playerAvatar?.rosterName || (playerAvatar?.firstName && playerAvatar?.lastName ? `${playerAvatar.firstName} ${playerAvatar.lastName}` : null);
  const coreBlockNumbers = ['1', '2', '3', '4', '5', '6'].filter((blockNumber) => blockNumber !== specialistBlockNumber);
  const sections = [
    {
      key: 'homeroom',
      label: `Homeroom | HR-${sectionPrefix} | Period HR`,
      sectionCode: `HR-${sectionPrefix}`,
      gradeLabel,
      courseName: 'Homeroom & Attendance',
      courseLevel: 'Standard',
      courseNumber: `HR-${sectionPrefix}`,
      blockLabel: 'HR',
      maxStudents: 24,
      teacherName: playerTeacherName,
      homeroomTeacherName: playerTeacherName
    },
    ...coreBlockNumbers.map((blockLabel, index) => ({
      key: `block-${blockLabel}`,
      label: `${courseName} | Sec ${sectionPrefix}${index + 1} | Period ${blockLabel}`,
      sectionCode: `Sec ${sectionPrefix}${index + 1}`,
      gradeLabel,
      courseName,
      courseLevel: 'Standard',
      courseNumber: `Sec ${sectionPrefix}${index + 1}`,
      blockLabel,
      maxStudents: 24,
      teacherName: playerTeacherName,
      homeroomTeacherName: playerTeacherName
    }))
  ];

  return buildStudentRosterFromSections(sections);
}

function buildHighStudentRoster(playerAvatar, playerGrade, highLetterRange) {
  const sections = [];
  const seenSections = new Set();
  const contractSchedule = playerAvatar?.contractSchedule || {};
  const playerName = playerAvatar?.name || playerAvatar?.rosterName || (playerAvatar?.firstName && playerAvatar?.lastName ? `${playerAvatar.firstName} ${playerAvatar.lastName}` : 'Homeroom Teacher');
  const gradeLabel = playerGrade ? `${playerGrade}th` : '9th-12th';
  const homeroomRangeCode = String(highLetterRange || 'A-E').replace(/[^A-Za-z]/g, '').toUpperCase() || 'AE';
  const homeroomSectionCode = `HR-${playerGrade || 'HS'}-${homeroomRangeCode}`;
  const teacherLunchWave = playerAvatar?.randomLunchWave || playerAvatar?.contractLunchWave || 'Wave 1';

  sections.push({
    key: 'homeroom',
    label: `Homeroom | ${homeroomSectionCode} | Period HR`,
    sectionCode: homeroomSectionCode,
    gradeLabel,
    courseName: 'Homeroom & Attendance',
    courseLevel: 'Standard',
    courseNumber: homeroomSectionCode,
    blockLabel: 'HR',
    maxStudents: 24,
    teacherName: playerName,
    homeroomTeacherName: playerName,
    teacherLunchWave,
    lunchWaveDistribution: HIGH_STUDENT_LUNCH_WAVES
  });

  Object.entries(contractSchedule).forEach(([periodLetter, slot]) => {
    if (!slot) return;
    if (slot.isPrep) {
      const studyHallKey = `${periodLetter}|studyhall`;
      if (seenSections.has(studyHallKey)) return;
      seenSections.add(studyHallKey);
      sections.push({
        key: studyHallKey,
        label: `Study Hall | SH-${String(periodLetter || '').toUpperCase()} | ${formatPeriodLabel(periodLetter)}`,
        sectionCode: `SH-${String(periodLetter || '').toUpperCase()}`,
        gradeLabel,
        courseName: 'Study Hall',
        courseLevel: 'Support',
        courseNumber: `SH-${String(periodLetter || '').toUpperCase()}`,
        blockLabel: String(periodLetter || '').toUpperCase(),
        lunchWave: teacherLunchWave,
        teacherLunchWave,
        maxStudents: 24,
        teacherName: playerName,
        homeroomTeacherName: playerName,
        gradeDistribution: HIGH_STUDY_HALL_GRADE_MIX,
        lunchWaveDistribution: HIGH_STUDENT_LUNCH_WAVES
      });
      return;
    }
    const sectionKey = `${periodLetter}|${slot.name}|${slot.sec || ''}`;
    if (seenSections.has(sectionKey)) return;
    seenSections.add(sectionKey);
    sections.push({
      key: sectionKey,
      label: `${slot.name} | ${slot.sec || 'Sec #000'} | ${formatPeriodLabel(periodLetter)}`,
      sectionCode: slot.sec || 'Sec #000',
      gradeLabel: slot.grade || gradeLabel,
      courseName: slot.name,
      courseLevel: slot.level || 'Standard',
      courseNumber: slot.sec || 'Sec #000',
      blockLabel: String(periodLetter || '').toUpperCase(),
      lunchWave: teacherLunchWave,
      teacherLunchWave,
      maxStudents: 24,
      teacherName: playerName,
      homeroomTeacherName: playerName,
      lunchWaveDistribution: HIGH_STUDENT_LUNCH_WAVES
    });
  });

  return buildStudentRosterFromSections(sections);
}

function buildHighScheduleFallbackToken(tokens) {
  const firstClassToken = Object.values(tokens || {}).find((token) => token?.kind === 'class');
  if (firstClassToken) {
    return buildClassEntry(firstClassToken.name, firstClassToken.level || 'Standard', firstClassToken.sec || 'Sec #000');
  }

  const firstPrepToken = Object.values(tokens || {}).find((token) => token?.kind === 'prep');
  if (firstPrepToken) {
    return buildSpecialEntry(firstPrepToken.name || 'Teacher Prep / Study Hall', 'prep');
  }

  return buildSpecialEntry('Teacher Prep / Study Hall', 'prep');
}

function buildHighDepartmentCoverageMap(facultyRoster) {
  const coverageMap = {};
  if (!facultyRoster || typeof facultyRoster !== 'object') return coverageMap;
  const lunchWaves = ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'];

  const globalWaveCounts = lunchWaves.reduce((acc, wave) => {
    acc[wave] = 0;
    return acc;
  }, {});

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
      const minCount = Math.min(...Object.values(globalWaveCounts));
      const candidates = lunchWaves.filter((wave) => globalWaveCounts[wave] === minCount);
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
      globalWaveCounts[assignedWave] = (globalWaveCounts[assignedWave] || 0) + 1;

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

function buildHighSchedulePreferences(facultyRoster) {
  if (!facultyRoster || typeof facultyRoster !== 'object') {
    return { preferredPrepCount: 1 };
  }

  const allStaff = Object.values(facultyRoster).flatMap((members) => (Array.isArray(members) ? members : []));
  const playerRecord = allStaff.find((member) => member?.isPlayer);
  const playerPrepCount = Object.values(playerRecord?.contractSchedule || {}).filter((slot) => slot?.isPrep).length;

  return {
    preferredPrepCount: Number.isFinite(playerPrepCount) ? clamp(playerPrepCount, 1, 1) : 1
  };
}

function buildHighLunchPlanByDay(lunchWave) {
  const resolvedWave = ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'].includes(lunchWave) ? lunchWave : 'Wave 1';
  const dayTimes = HIGH_LUNCH_WAVE_DAY_TIMES[resolvedWave] || {};
  return HIGH_DAY_PATTERNS.reduce((acc, pattern) => {
    acc.slotIndexByDay[pattern.day] = HIGH_LONG_BLOCK_SLOT_INDEX;
    acc.lunchByDay[pattern.day] = dayTimes[pattern.day] || '11:00 AM - 11:50 AM';
    acc.waveByDay[pattern.day] = resolvedWave;
    return acc;
  }, { slotIndexByDay: {}, lunchByDay: {}, waveByDay: {} });
}

function buildHighWeeklyRowsFromTokens(tokens, lunchWave) {
  const buildDayPeriodSequence = (sequence) => {
    return Array.isArray(sequence) ? sequence : Array(10).fill('A');
  };

  const lunchPlan = buildHighLunchPlanByDay(lunchWave);
  const lunchByDay = lunchPlan.lunchByDay;
  const waveByDay = lunchPlan.waveByDay;
  const fallbackToken = buildHighScheduleFallbackToken(tokens);
  const periodSequenceByDay = HIGH_DAY_PATTERNS.reduce((acc, pattern) => {
    acc[pattern.day] = buildDayPeriodSequence(pattern.sequence);
    return acc;
  }, {});

  return HIGH_SLOT_KEYS.map((slotKey, slotIdx) => {
    const entries = WEEK_DAYS.map((dayName, dayIdx) => {
      const periodLabel = periodSequenceByDay[dayName]?.[slotIdx] || HIGH_PERIOD_LETTERS[(dayIdx + slotIdx) % HIGH_PERIOD_LETTERS.length];
      const normalizedLabel = String(periodLabel || '').toUpperCase();
      const tokenKey = normalizedLabel === 'G' ? 'periodG' : `period${normalizedLabel}`;
      const token = tokens[tokenKey] || tokens[normalizedLabel] || fallbackToken;
      const isLongBlock = slotIdx === HIGH_LONG_BLOCK_SLOT_INDEX;
      const durationLabel = isLongBlock ? HIGH_LONG_BLOCK_DURATION_LABEL : HIGH_STANDARD_BLOCK_DURATION_LABEL;
      const activeWave = waveByDay[dayName] || lunchWave || 'Wave 1';
      const detailParts = [`Period ${periodLabel}`, durationLabel];

      if (isLongBlock) {
        detailParts.push(`Lunch: ${lunchByDay[dayName]}`);
        detailParts.push(`Lunch Split: ${activeWave} - ${HIGH_LUNCH_WAVE_SPLIT_DETAILS[activeWave] || HIGH_LUNCH_WAVE_SPLIT_DETAILS['Wave 1']}`);
      }

      const detail = detailParts.join(' | ');
      const normalizedToken = token?.kind
        ? token
        : token?.isPrep
        ? { ...token, kind: 'prep' }
        : token?.isLunch
        ? { ...token, kind: 'lunch' }
        : { ...token, kind: 'class' };

      if (normalizedToken.kind === 'class') {
        return {
          ...buildClassEntry(normalizedToken.name, normalizedToken.level || 'Standard', normalizedToken.sec || null, detail),
          isLunchSlot: isLongBlock,
          isDoubleContinuation: false
        };
      }

      if (normalizedToken.kind === 'lunch') {
        return {
          ...buildSpecialEntry(normalizedToken.name || 'Lunch Break', 'lunch', { detail }),
          isLunchSlot: isLongBlock,
          isDoubleContinuation: false
        };
      }

      const prepKind = normalizedToken.kind === 'prep' ? 'prep' : 'support';
      return {
        ...buildSpecialEntry(normalizedToken.name || 'Teacher Prep / Study Hall', prepKind, { detail }),
        isLunchSlot: isLongBlock,
        isDoubleContinuation: false
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

function getScheduleDays(schoolType) {
  if (schoolType === 'High') return WEEK_DAYS;
  return ELEMENTARY_WEEK_DAYS;
}

function buildElementaryProfileSchedule(staff, random) {
  const grade = parseGradeFromRole(staff.role);
  const isLower = grade === 'K' || grade === 1 || grade === 2;
  const subject = resolveSubjectFromRole(staff.role);
  const sectionBase = 300 + Math.floor(random() * 500);
  const gradeNumber = grade === 'K' ? 0 : (Number.isFinite(grade) ? grade : 1);
  const waveConfig = getElementaryLunchConfigByGrade(gradeNumber);
  const wave = waveConfig.label;
  const classLevel = 'Standard';
  const className = ELEMENTARY_CLASS_OPTIONS[subject] || 'Elementary Core Instruction';

  if (isLower) {
    return [
      { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
      {
        block: 'Literacy Block',
        time: '8:20 AM - 9:35 AM',
        entries: ELEMENTARY_WEEK_DAYS.map((_, dayIdx) => buildClassEntry('Language Arts & Reading', classLevel, `K2-LIT-${dayIdx + 1}`))
      },
      {
        block: 'Math Workshop',
        time: '9:55 AM - 11:10 AM',
        entries: ELEMENTARY_WEEK_DAYS.map((_, dayIdx) => buildClassEntry('Elementary Math Focus', classLevel, `K2-MTH-${dayIdx + 1}`))
      },
      { block: `${wave} Lunch/Recess`, time: waveConfig.time, entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Lunch/Recess Rotation', 'lunch')) },
      {
        block: 'Inquiry Block',
        time: '12:20 PM - 1:15 PM',
        entries: ELEMENTARY_WEEK_DAYS.map((_, dayIdx) => buildClassEntry('Integrated Science/SS', classLevel, `K2-INQ-${dayIdx + 1}`))
      },
      { block: 'Specialists/Prep', time: '1:20 PM - 2:05 PM', entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Specialists / Teacher Prep', 'prep')) },
      { block: 'Dismissal', time: '2:05 PM - 2:30 PM', entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Pack-up and Dismissal', 'support')) }
    ];
  }

  const sections = [`Sec #${sectionBase}`, `Sec #${sectionBase + 1}`, `Sec #${sectionBase + 2}`];
  return [
    { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
    {
      block: 'Session 1',
      time: '8:20 AM - 9:15 AM',
      entries: ELEMENTARY_WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[dayIdx % sections.length]))
    },
    {
      block: 'Session 2',
      time: '9:20 AM - 10:15 AM',
      entries: ELEMENTARY_WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(dayIdx + 1) % sections.length]))
    },
    { block: 'WIN/Intervention', time: '10:20 AM - 11:10 AM', entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Targeted Intervention', 'support')) },
    { block: `${wave} Lunch/Recess`, time: waveConfig.time, entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Grade-Level Lunch/Recess', 'lunch')) },
    {
      block: 'Session 3',
      time: '12:20 PM - 1:15 PM',
      entries: ELEMENTARY_WEEK_DAYS.map((_, dayIdx) => buildClassEntry(className, classLevel, sections[(dayIdx + 2) % sections.length]))
    },
    { block: 'Planning/Specialists', time: '1:20 PM - 2:05 PM', entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Planning / Specialists', 'prep')) },
    { block: 'Closure & Dismissal', time: '2:05 PM - 2:30 PM', entries: ELEMENTARY_WEEK_DAYS.map(() => buildSpecialEntry('Closure and Dismissal', 'support')) }
  ];
}

function buildMiddleProfileSchedule(staff, random) {
  const middleDays = getScheduleDays('Middle');
  const grade = parseGradeFromRole(staff.role);
  const resolvedGrade = Number.isFinite(grade) ? grade : 6;
  const subject = resolveSubjectFromRole(staff.role);
  const sectionBase = resolvedGrade * 100 + 1;
  const gradeConfig = MIDDLE_SPECIALIST_ROTATION[resolvedGrade] || MIDDLE_SPECIALIST_ROTATION[6];
  const waveConfig = getMiddleLunchConfigByGrade(resolvedGrade);
  const supportWindows = getMiddleSupportWindowsByGrade(resolvedGrade);
  const wave = waveConfig.label;
  const classLevel = 'Standard';
  const className = MIDDLE_CLASS_OPTIONS[resolvedGrade]?.[subject] || `Grade ${resolvedGrade} Core Instruction`;

  const specialistBlock = gradeConfig.specialistBlock;
  const coreBlockOrder = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6'].filter((blockName) => blockName !== specialistBlock);
  const sectionByBlock = coreBlockOrder.reduce((acc, blockName, idx) => {
    acc[blockName] = `#${sectionBase + idx}`;
    return acc;
  }, {});

  const buildMiddleBlockEntry = (blockName) => {
    if (blockName === specialistBlock) {
      return buildClassEntry('Specialist Rotation (Art/Music/PE/Tech)', 'Specialist', 'Spec-101');
    }
    return buildClassEntry(className, classLevel, sectionByBlock[blockName] || `#${sectionBase}`);
  };

  const supportRows = supportWindows.map((window, idx) => ({
    block: supportWindows.length > 1 ? `${window.block} ${idx + 1}` : window.block,
    time: window.time,
    entries: middleDays.map(() => buildSpecialEntry('Student Support / Advisory', 'support'))
  }));
  const lunchRow = { block: 'Lunch Block', time: waveConfig.time, entries: middleDays.map(() => buildSpecialEntry(`Student Lunch Supervision (${wave})`, 'lunch')) };
  const middleMiddayRows = resolvedGrade === 6
    ? [lunchRow, ...supportRows]
    : resolvedGrade === 7
    ? [supportRows[0], lunchRow, supportRows[1]].filter(Boolean)
    : [...supportRows, lunchRow];

  return [
    { block: 'Homeroom', time: MIDDLE_BLOCK_TIMES.homeroom, entries: middleDays.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
    { block: specialistBlock === 'Block 1' ? 'Block 1 / Specialist' : 'Block 1', time: MIDDLE_BLOCK_TIMES.block1, entries: middleDays.map(() => buildMiddleBlockEntry('Block 1')) },
    { block: specialistBlock === 'Block 2' ? 'Block 2 / Specialist' : 'Block 2', time: MIDDLE_BLOCK_TIMES.block2, entries: middleDays.map(() => buildMiddleBlockEntry('Block 2')) },
    { block: specialistBlock === 'Block 3' ? 'Block 3 / Specialist' : 'Block 3', time: MIDDLE_BLOCK_TIMES.block3, entries: middleDays.map(() => buildMiddleBlockEntry('Block 3')) },
    ...middleMiddayRows,
    { block: specialistBlock === 'Block 4' ? 'Block 4 / Specialist' : 'Block 4', time: MIDDLE_BLOCK_TIMES.block4, entries: middleDays.map(() => buildMiddleBlockEntry('Block 4')) },
    { block: specialistBlock === 'Block 5' ? 'Block 5 / Specialist' : 'Block 5', time: MIDDLE_BLOCK_TIMES.block5, entries: middleDays.map(() => buildMiddleBlockEntry('Block 5')) },
    { block: specialistBlock === 'Block 6' ? 'Block 6 / Specialist' : 'Block 6', time: MIDDLE_BLOCK_TIMES.block6, entries: middleDays.map(() => buildMiddleBlockEntry('Block 6')) }
  ];
}

function buildHighProfileSchedule(staff, random, coverageEntry, schedulePreferences = {}) {
  const lunchWave = coverageEntry?.lunchWave || staff?.contractLunchWave || pickWithSeed(['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'], random);
  const sectionBase = 100 + Math.floor(random() * 800);

  if (staff?.isPlayer && staff?.contractScheduleVersion >= 5 && Array.isArray(staff?.contractWeeklyRows)) {
    const lunchByDay = staff?.contractLunchByDay || {};
    const upgradedRows = staff.contractWeeklyRows.map((row) => {
      const entries = WEEK_DAYS.map((day, dayIdx) => {
        const token = row?.entries?.[dayIdx];
        if (!token) return buildSpecialEntry('Teacher Prep / Study Hall', 'prep');

        const detailParts = [];
        if (token.periodLabel) detailParts.push(`Period ${token.periodLabel}`);
        if (typeof token.isDouble === 'boolean') detailParts.push(token.isDouble ? 'Double Block' : 'Single Block');
        if (row.slotIndex === HIGH_LONG_BLOCK_SLOT_INDEX && lunchByDay[day]) {
          detailParts.push(`Lunch: ${lunchByDay[day]}`);
        }

        const detail = token.detail || detailParts.join(' | ') || null;
        if (token.isLunch) {
          return buildSpecialEntry('Lunch Break', 'lunch', { detail });
        }
        if (token.isPrep) {
          return buildSpecialEntry(token.name || 'Teacher Prep / Study Hall', 'prep', { detail });
        }

        return buildClassEntry(token.name || 'Class Assignment', token.level || 'Standard', token.sec || null, detail);
      });

      return {
        block: row.block || 'Block',
        time: row.time || 'Rotating Window (Day remains 8:00 AM - 2:30 PM)',
        entries
      };
    });

    return [
      { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
      ...upgradedRows
    ];
  }

  if (staff?.isPlayer && staff?.contractSchedule) {
    const lunch = staff.contractLunchWave || lunchWave;
    const weeklyRows = buildHighWeeklyRowsFromTokens(staff.contractSchedule, lunch);

    return [
      { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
      ...weeklyRows
    ];
  }
  const courseSequence = buildHighCourseSequence(staff, coverageEntry, random);
  const levelSequence = buildHighLevelSequence(courseSequence, random);

  const prepIndexes = new Set([Math.floor(random() * HIGH_PERIOD_LETTERS.length)]);

  const periodTokens = {};
  HIGH_PERIOD_LETTERS.forEach((periodLetter, idx) => {
    if (prepIndexes.has(idx)) {
      periodTokens[periodLetter] = buildSpecialEntry('Teacher Prep / Study Hall', 'prep');
      return;
    }

    const chosenCourse = courseSequence[idx % courseSequence.length];
    const chosenLevel = levelSequence[idx % levelSequence.length];
    periodTokens[periodLetter] = buildClassEntry(chosenCourse, chosenLevel, `Sec #${sectionBase + idx}`);
  });

  const weeklyRows = buildHighWeeklyRowsFromTokens(periodTokens, lunchWave);

  return [
    { block: 'Homeroom', time: '8:00 AM - 8:15 AM', entries: WEEK_DAYS.map(() => buildSpecialEntry('Homeroom & Attendance', 'homeroom')) },
    ...weeklyRows
  ];
}

function buildSupportSchedule(schoolType, random) {
  const days = getScheduleDays(schoolType);
  const supportFocus = pickWithSeed(SUPPORT_PERIODS, random);
  if (schoolType === 'High') {
    return [
      { block: 'Campus Opening', time: '8:00 AM - 8:30 AM', entries: days.map(() => buildSpecialEntry(`${supportFocus} and Morning Coverage`, 'support')) },
      { block: 'Block Coverage', time: '8:35 AM - 10:15 AM', entries: days.map(() => buildSpecialEntry('Student Support Response Rotation', 'support')) },
      { block: 'Midday Rotation', time: '10:20 AM - 12:50 PM', entries: days.map(() => buildSpecialEntry('Midday Coverage and Documentation', 'lunch')) },
      { block: 'Afternoon Support', time: '12:55 PM - 2:30 PM', entries: days.map(() => buildSpecialEntry('Interventions and Campus Coordination', 'support')) }
    ];
  }

  return [
    { block: 'Morning Coverage', time: '8:00 AM - 9:45 AM', entries: days.map(() => buildSpecialEntry(`${supportFocus} and Classroom Support`, 'support')) },
    { block: 'Instructional Support', time: '9:50 AM - 11:30 AM', entries: days.map(() => buildSpecialEntry('Push-in / Pull-out Support', 'support')) },
    { block: 'Midday Duty', time: '11:35 AM - 12:20 PM', entries: days.map(() => buildSpecialEntry('Lunch/Recess Operations', 'lunch')) },
    { block: 'Afternoon Rotation', time: '12:25 PM - 2:30 PM', entries: days.map(() => buildSpecialEntry('Interventions and Family Follow-up', 'support')) }
  ];
}

function extractHighLunchByDayFromRows(rows, fallbackLunchByDay = {}) {
  const extracted = {};

  (rows || []).forEach((row) => {
    WEEK_DAYS.forEach((dayName, dayIdx) => {
      if (extracted[dayName]) return;
      const detailText = String(row?.entries?.[dayIdx]?.detail || '');
      const match = detailText.match(/Lunch:\s*([^|]+)/i);
      if (match && match[1]) {
        extracted[dayName] = match[1].trim();
      }
    });
  });

  return WEEK_DAYS.reduce((acc, dayName) => {
    acc[dayName] = extracted[dayName] || fallbackLunchByDay[dayName] || 'Assigned';
    return acc;
  }, {});
}

function ensureRowsHaveWeekEntries(rows = [], schoolType = 'High') {
  const days = getScheduleDays(schoolType);
  return (rows || []).map((row) => ({
    ...row,
    entries: days.map((_, dayIdx) => {
      const entry = row?.entries?.[dayIdx];
      return entry && typeof entry === 'object'
        ? entry
        : buildSpecialEntry('Assigned Coverage', 'support');
    })
  }));
}

function generateLockedStaffSchedule(staff, schoolType, highCoverageMap = {}, highSchedulePreferences = {}) {
  const academicYear = resolveAcademicYearLabel();
  const seed = hashString(`${staff?.id || staff?.name || 'staff'}|${schoolType}|${academicYear}`);
  const random = createSeededRandom(seed);
  const roleText = String(staff?.role || '').toLowerCase();
  const isTeacherLike = roleText.includes('teacher') || roleText.includes('department head');

  let rows;
  let lunchWave = null;
  let lunchByDay = null;
  if (!isTeacherLike) {
    rows = buildSupportSchedule(schoolType, random);
  } else if (schoolType === 'Elementary') {
    rows = buildElementaryProfileSchedule(staff, random);
  } else if (schoolType === 'Middle') {
    rows = buildMiddleProfileSchedule(staff, random);
  } else {
    const staffKey = staff?.id || staff?.name;
    lunchWave = highCoverageMap[staffKey]?.lunchWave || staff?.contractLunchWave || 'Wave 1';
    const defaultLunchByDay = staff?.contractLunchByDay || HIGH_LUNCH_WAVE_DAY_TIMES[lunchWave] || HIGH_LUNCH_WAVE_DAY_TIMES['Wave 1'];
    rows = buildHighProfileSchedule(staff, random, highCoverageMap[staffKey], highSchedulePreferences);
    lunchByDay = extractHighLunchByDayFromRows(rows, defaultLunchByDay);
  }

  return { academicYear, rows: ensureRowsHaveWeekEntries(rows, schoolType), lunchWave, lunchByDay };
}

function buildTeacherDirectoryForStudents(facultyRoster) {
  const staffList = Object.values(facultyRoster || {}).flatMap((members) => (Array.isArray(members) ? members : []));
  const teacherLike = staffList.filter((member) => isTeacherLikeRole(member?.role));
  const bySubject = {};
  const electiveCourseMap = {};

  teacherLike.forEach((teacher) => {
    const subject = resolveSubjectFromRole(teacher?.role);
    if (!bySubject[subject]) bySubject[subject] = [];
    bySubject[subject].push(teacher);

    const electiveCourse = normalizeHighElectiveCourseName(resolveHighElectiveCourseFromRole(teacher?.role));
    if (electiveCourse) {
      if (!electiveCourseMap[electiveCourse]) {
        electiveCourseMap[electiveCourse] = [];
      }
      if (teacher?.name) {
        electiveCourseMap[electiveCourse].push(teacher.name);
      }
    }
  });

  const highElectives = Object.entries(electiveCourseMap).map(([courseName, teachers]) => ({
    courseName,
    teachers: Array.from(new Set(teachers))
  }));

  return { all: teacherLike, bySubject, highElectives };
}

function normalizeCatalogEntryKind(entry) {
  const rawKind = String(entry?.kind || entry?.entryType || '').toLowerCase();
  if (rawKind === 'class') return 'class';
  if (rawKind === 'homeroom') return 'homeroom';
  if (rawKind === 'lunch') return 'lunch';
  if (rawKind === 'prep' || rawKind === 'studyhall') return 'prep';
  if (rawKind === 'support') return 'support';
  return 'class';
}

function buildTeacherScheduleCatalog(facultyRoster, schoolType) {
  const staffList = Object.values(facultyRoster || {}).flatMap((members) => (Array.isArray(members) ? members : []));
  const teacherLike = staffList.filter((member) => isTeacherLikeRole(member?.role));
  const highCoverageMap = schoolType === 'High' ? buildHighDepartmentCoverageMap(facultyRoster) : {};
  const highSchedulePreferences = schoolType === 'High' ? buildHighSchedulePreferences(facultyRoster) : {};
  const byBlockDay = {};

  teacherLike.forEach((staff) => {
    const lockedSchedule = generateLockedStaffSchedule(staff, schoolType, highCoverageMap, highSchedulePreferences);
    (lockedSchedule?.rows || []).forEach((row) => {
      if (!byBlockDay[row.block]) byBlockDay[row.block] = {};

      getScheduleDays(schoolType).forEach((dayName, dayIdx) => {
        if (!byBlockDay[row.block][dayName]) byBlockDay[row.block][dayName] = [];
        const entry = row?.entries?.[dayIdx];
        if (!entry) return;

        byBlockDay[row.block][dayName].push({
          kind: normalizeCatalogEntryKind(entry),
          className: entry.name || entry.className || 'Assigned Coverage',
          classType: entry.level || entry.classType || 'Standard',
          teacher: staff.name,
          detail: entry.detail || null,
          sec: entry.sec || null,
          role: staff.role,
          isPlayer: Boolean(staff.isPlayer)
        });
      });
    });
  });

  return { byBlockDay };
}

function pickAlignedScheduleEntry(scheduleCatalog, blockName, dayName, seedKey, options = {}) {
  const entries = scheduleCatalog?.byBlockDay?.[blockName]?.[dayName] || [];
  if (!entries.length) return null;

  const requestedKinds = Array.isArray(options.kinds)
    ? options.kinds
    : options.kind
    ? [options.kind]
    : ['class'];

  const kindMatches = entries.filter((entry) => requestedKinds.includes(entry.kind));
  const pool = kindMatches.length ? kindMatches : entries;
  const byTeacherAndClass = pool.filter((entry) => {
    const teacherMatch = options.teacherName ? entry.teacher === options.teacherName : true;
    const classMatch = options.className ? entry.className === options.className : true;
    return teacherMatch && classMatch;
  });
  const byClass = options.className ? pool.filter((entry) => entry.className === options.className) : [];
  const byTeacher = options.teacherName ? pool.filter((entry) => entry.teacher === options.teacherName) : [];
  const finalPool = byTeacherAndClass.length ? byTeacherAndClass : byClass.length ? byClass : byTeacher.length ? byTeacher : pool;

  if (!finalPool.length) return null;
  const pickIndex = hashString(seedKey) % finalPool.length;
  return finalPool[pickIndex] || finalPool[0] || null;
}

function pickTeacherNameForSubject(teacherDirectory, subject, random) {
  const picked = pickTeacherForSubject(teacherDirectory, subject, random);
  return picked?.name || 'Staff Teacher';
}

function pickTeacherForSubject(teacherDirectory, subject, random) {
  const candidates = teacherDirectory?.bySubject?.[subject] || teacherDirectory?.all || [];
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  return candidates[Math.floor(random() * candidates.length)] || null;
}

function pickTeacherNameFromList(teachers, seedKey, fallback = 'Staff Teacher') {
  if (!Array.isArray(teachers) || teachers.length === 0) return fallback;
  const random = createSeededRandom(hashString(seedKey));
  const pickIndex = Math.floor(random() * teachers.length);
  const picked = teachers[pickIndex];
  if (typeof picked === 'string' && picked.trim()) return picked;
  return picked?.name || fallback;
}

function pickDifferentTeacherName(teachers, excludedName, seedKey, fallback = 'Staff Teacher') {
  const filtered = (Array.isArray(teachers) ? teachers : []).filter((teacher) => teacher?.name && teacher.name !== excludedName);
  if (filtered.length === 0) return fallback;
  return pickTeacherNameFromList(filtered, seedKey, fallback);
}

function normalizeHighElectiveCourseName(courseName = '') {
  const normalized = String(courseName || '').trim();
  if (!normalized) return '';
  if (normalized.toLowerCase() === 'pe') return 'Physical Education';
  return normalized;
}

function pickCoTeacherLabelFromPool(teachers, seedKey, fallback = 'Staff Teacher') {
  const pool = (Array.isArray(teachers) ? teachers : []).filter((teacher) => String(teacher || '').trim());
  if (pool.length === 0) return fallback;
  if (pool.length === 1) return pool[0];

  const randomA = createSeededRandom(hashString(`${seedKey}|A`));
  const randomB = createSeededRandom(hashString(`${seedKey}|B`));
  const first = pool[Math.floor(randomA() * pool.length)] || pool[0];
  const remaining = pool.filter((teacher) => teacher !== first);
  const second = remaining[Math.floor(randomB() * remaining.length)] || remaining[0] || first;
  return `${first} & ${second}`;
}

function pickGymTeacherPair(teacherDirectory, seedKey) {
  const subjectTeachers = (teacherDirectory?.bySubject?.['Physical Education'] || []).map((staff) => staff?.name).filter(Boolean);
  const electiveTeachers = (teacherDirectory?.highElectives || [])
    .filter((entry) => String(entry?.courseName || '').toLowerCase() === 'physical education')
    .flatMap((entry) => entry.teachers || []);
  const allGymTeachers = Array.from(new Set([...subjectTeachers, ...electiveTeachers]));
  return pickCoTeacherLabelFromPool(allGymTeachers, seedKey, 'PE Team');
}

function pickHighCourseForGrade(subject, gradeNum, seedKey) {
  const random = createSeededRandom(hashString(seedKey));
  const grade = Number.isFinite(gradeNum) ? gradeNum : 9;

  if (subject === 'ELA') {
    if (grade <= 9) return 'English I';
    if (grade === 10) return 'English II';
    if (grade === 11) return 'English III';
    return 'English IV';
  }

  if (subject === 'Mathematics') {
    if (grade <= 9) return 'Algebra I';
    if (grade === 10) return 'Geometry';
    if (grade === 11) {
      return random() > 0.5 ? 'Algebra II' : 'Trigonometry';
    }
    return random() > 0.5 ? 'Pre-Calculus' : 'Calculus';
  }

  if (subject === 'Science') {
    if (grade <= 9) return 'Earth Science';
    if (grade === 10) return 'Biology';
    if (grade === 11) return 'Chemistry';
    return 'Physics';
  }

  if (subject === 'History') {
    if (grade <= 9) return 'World History';
    if (grade === 10) return 'Modern World History';
    if (grade === 11) return 'US History';
    return 'Civics & Econ';
  }

  if (subject === 'Foreign Language') {
    if (grade <= 9) return random() > 0.5 ? 'Spanish I' : 'French I';
    if (grade === 10) return random() > 0.5 ? 'Spanish II' : 'French II';
    return 'Conversational Fluency';
  }

  const fallbackPool = HIGH_CLASS_OPTIONS[subject] || ['Core Seminar'];
  return fallbackPool[Math.floor(random() * fallbackPool.length)] || 'Core Seminar';
}

function resolveCoreTrackFromClassName(className = '') {
  const subject = resolveSubjectFromRole(className);
  if (subject === 'Reading' || subject === 'Reading & ELA') return 'ELA';
  if (subject === 'Social Studies') return 'History';
  if (subject === 'Science & Social Studies') return 'Integrated Science/SS';
  return subject;
}

function buildTermLabelsBySchool(schoolType) {
  if (schoolType === 'High') return ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];
  return ['Trimester 1', 'Trimester 2', 'Trimester 3'];
}

function buildElementaryStudentSchedule(student, teacherDirectory, scheduleCatalog) {
  const homeroomSeed = `${student?.grade || 'elem'}|${student?.rosterGroup || student?.sectionCode || student?.rosterLabel || 'HR'}`;
  const random = createSeededRandom(hashString(homeroomSeed));
  const isLowerElem = String(student?.grade || '').toLowerCase().includes('kindergarten')
    || String(student?.grade || '').startsWith('0')
    || String(student?.grade || '').startsWith('1')
    || String(student?.grade || '').startsWith('2');

  const coreCourses = isLowerElem
    ? ['Language Arts & Reading', 'Elementary Math Focus', 'Integrated Science/SS']
    : ['Language Arts & Reading', 'Elementary Math Focus', 'Integrated Science/SS'];
  const elementaryCoreByBlock = {
    literacy: coreCourses[0] || 'Language Arts & Reading',
    math: coreCourses[1] || 'Elementary Math Focus',
    scienceSocial: coreCourses[2] || 'Integrated Science/SS'
  };
  const specialistPool = ['Visual Art', 'Music', 'Physical Education', 'Computer Tech'];
  const specialistCourse = specialistPool[Math.floor(random() * specialistPool.length)];
  const homeroomTeacher = pickTeacherNameFromList(teacherDirectory?.all, `${homeroomSeed}|homeroom`, 'Homeroom Teacher');
  const specialistTeacher = pickTeacherNameForSubject(teacherDirectory, specialistCourse, random);
  const elementaryCoreTeachers = {
    literacy: pickTeacherNameForSubject(teacherDirectory, resolveSubjectFromRole(elementaryCoreByBlock.literacy), createSeededRandom(hashString(`${homeroomSeed}|elem-lit-teacher`))),
    math: pickTeacherNameForSubject(teacherDirectory, resolveSubjectFromRole(elementaryCoreByBlock.math), createSeededRandom(hashString(`${homeroomSeed}|elem-math-teacher`))),
    scienceSocial: pickTeacherNameForSubject(teacherDirectory, resolveSubjectFromRole(elementaryCoreByBlock.scienceSocial), createSeededRandom(hashString(`${homeroomSeed}|elem-sci-teacher`)))
  };
  const gradeNum = resolveGradeNumberFromLabel(student?.grade) ?? 1;
  const lunchWaveConfig = getElementaryLunchConfigByGrade(gradeNum);
  const sessionMatch = String(student?.blockLabel || '').match(/\d+/);
  const primarySession = sessionMatch ? `Session ${sessionMatch[0]}` : null;
  const primaryClassName = student?.className || coreCourses[0] || 'Elementary Core Instruction';
  const primaryTeacher = pickTeacherNameForSubject(
    teacherDirectory,
    resolveSubjectFromRole(primaryClassName),
    createSeededRandom(hashString(`${student?.sectionCode || student?.rosterLabel || student?.id}|elem-primary-teacher`))
  );

  const rows = [
    {
      block: 'Homeroom',
      time: '8:00 AM - 8:15 AM',
      entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'homeroom', className: 'Homeroom & Attendance', classType: 'Standard', teacher: homeroomTeacher }))
    },
    ...(isLowerElem
      ? [
          {
            block: 'Literacy Block',
            time: '8:20 AM - 9:35 AM',
            entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'class', className: elementaryCoreByBlock.literacy, classType: 'Standard', teacher: elementaryCoreTeachers.literacy }))
          },
          {
            block: 'Snack and Reset',
            time: '9:35 AM - 9:50 AM',
            entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'support', className: 'Snack and Reset', classType: '', teacher: 'Grade Team' }))
          },
          {
            block: 'Math Workshop',
            time: '9:55 AM - 11:10 AM',
            entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'class', className: elementaryCoreByBlock.math, classType: 'Standard', teacher: elementaryCoreTeachers.math }))
          }
        ]
      : [
          {
            block: 'Session 1',
            time: '8:20 AM - 9:15 AM',
            entries: ELEMENTARY_WEEK_DAYS.map(() => ({
              entryType: 'class',
              className: elementaryCoreByBlock.literacy,
              classType: 'Standard',
              teacher: elementaryCoreTeachers.literacy
            }))
          },
          {
            block: 'Session 2',
            time: '9:20 AM - 10:15 AM',
            entries: ELEMENTARY_WEEK_DAYS.map(() => ({
              entryType: 'class',
              className: elementaryCoreByBlock.math,
              classType: 'Standard',
              teacher: elementaryCoreTeachers.math
            }))
          },
          {
            block: 'WIN / Intervention',
            time: '10:20 AM - 11:10 AM',
            entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'support', className: 'Targeted Intervention', classType: '', teacher: 'Grade Team' }))
          }
        ]),
    {
      block: 'Lunch/Recess',
      time: lunchWaveConfig.time,
      entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'lunch', className: `Lunch/Recess (${lunchWaveConfig.label})`, classType: '', teacher: 'Grade Team' }))
    },
    {
      block: 'Session 3',
      time: '12:20 PM - 1:15 PM',
      entries: ELEMENTARY_WEEK_DAYS.map(() => ({
        entryType: 'class',
        className: elementaryCoreByBlock.scienceSocial,
        classType: 'Standard',
        teacher: elementaryCoreTeachers.scienceSocial
      }))
    },
    {
      block: 'Planning / Specialists',
      time: '1:20 PM - 2:05 PM',
      entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'class', className: specialistCourse, classType: 'Specialist', teacher: specialistTeacher }))
    },
    {
      block: 'Closure & Dismissal',
      time: '2:05 PM - 2:30 PM',
      entries: ELEMENTARY_WEEK_DAYS.map(() => ({ entryType: 'support', className: 'Pack Up & Dismissal', classType: '', teacher: 'Grade Team' }))
    }
  ];

  if (primarySession) {
    const targetRow = rows.find((row) => row.block === primarySession);
    if (targetRow) {
      targetRow.entries = ELEMENTARY_WEEK_DAYS.map(() => ({
        entryType: 'class',
        className: primaryClassName,
        classType: 'Standard',
        teacher: primaryTeacher
      }));
    }
  }

  return rows.map((row) => ({
    ...row,
    entries: ELEMENTARY_WEEK_DAYS.map((dayName, dayIdx) => {
      const fallbackEntry = row.entries?.[dayIdx];
      const aligned = pickAlignedScheduleEntry(scheduleCatalog, row.block, dayName, `${student?.id || student?.name}|${row.block}|${dayName}`, {
        kind: fallbackEntry?.entryType === 'lunch'
          ? 'lunch'
          : fallbackEntry?.entryType === 'homeroom'
          ? 'homeroom'
          : fallbackEntry?.entryType === 'support'
          ? 'support'
          : 'class',
        teacherName: row.block === primarySession ? primaryTeacher : fallbackEntry?.teacher,
        className: fallbackEntry?.className
      });

      if (!aligned) return fallbackEntry;
      return {
        ...fallbackEntry,
        className: aligned.className || fallbackEntry?.className,
        classType: aligned.classType || fallbackEntry?.classType,
        teacher: aligned.teacher || fallbackEntry?.teacher
      };
    })
  }));
}

function buildMiddleStudentSchedule(student, teacherDirectory, scheduleCatalog) {
  const middleDays = getScheduleDays('Middle');
  const random = createSeededRandom(hashString(`${student?.id || student?.name}|middle`));
  const gradeMatch = String(student?.grade || '').match(/\d+/);
  const gradeNum = gradeMatch ? Number(gradeMatch[0]) : 6;
  const gradeConfig = MIDDLE_SPECIALIST_ROTATION[gradeNum] || MIDDLE_SPECIALIST_ROTATION[6];
  const lunchWaveConfig = getMiddleLunchConfigByGrade(gradeNum);
  const supportWindows = getMiddleSupportWindowsByGrade(gradeNum);
  const corePool = Object.values(MIDDLE_CLASS_OPTIONS[gradeNum] || MIDDLE_CLASS_OPTIONS[6]);
  const homeroomSeed = `${gradeNum}|${student?.rosterGroup || student?.sectionCode || student?.rosterLabel || 'HR'}`;
  const homeroomTeacher = pickTeacherNameFromList(teacherDirectory?.all, `${homeroomSeed}|homeroom`, 'Grade Team');
  const specialistPool = ['Visual Art', 'Music', 'Physical Education', 'Computer Tech'];
  const specialistCourse = specialistPool[hashString(`${homeroomSeed}|specialist`) % specialistPool.length];
  const specialistTeacher = specialistCourse === 'Physical Education'
    ? pickGymTeacherPair(teacherDirectory, `${homeroomSeed}|middle-gym-team`)
    : pickTeacherNameForSubject(
      teacherDirectory,
      specialistCourse,
      createSeededRandom(hashString(`${homeroomSeed}|specialist-teacher`))
    );
  const studyHallTeacher = pickDifferentTeacherName(teacherDirectory?.all, homeroomTeacher, `${student?.id || student?.name}|studyhall`, 'Guidance Team');

  const coreCourseOrder = [...corePool].sort((a, b) => {
    const aSeed = hashString(`${student?.id || student?.name}|${a}`);
    const bSeed = hashString(`${student?.id || student?.name}|${b}`);
    return aSeed - bSeed;
  });

  const blockNumberMatch = String(student?.blockLabel || '').match(/\d+/);
  const primaryBlock = blockNumberMatch ? `Block ${blockNumberMatch[0]}` : null;
  const primaryClassName = student?.className || coreCourseOrder[0] || 'Core Instruction';
  const primaryClassType = student?.classGrade || 'Standard';
  const primaryTeacher = student?.sectionTeacherName || pickTeacherNameForSubject(
    teacherDirectory,
    resolveSubjectFromRole(primaryClassName),
    createSeededRandom(hashString(`${student?.sectionCode || student?.rosterLabel || student?.id}|primary-teacher`))
  );

  const coreBlocks = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5', 'Block 6'];
  const specialistBlock = gradeConfig.specialistBlock;
  const coreBlockOrder = coreBlocks.filter((blockName) => blockName !== specialistBlock);
  const sectionBase = gradeNum * 100 + 1;
  const sectionByBlock = coreBlockOrder.reduce((acc, blockName, idx) => {
    acc[blockName] = `#${sectionBase + idx}`;
    return acc;
  }, {});

  const blockAssignments = {};
  const primaryCoreTrack = primaryBlock ? resolveCoreTrackFromClassName(primaryClassName) : null;
  const uniqueCoreQueue = coreCourseOrder.filter((className, idx, array) => {
    if (array.indexOf(className) !== idx) return false;
    return primaryCoreTrack ? resolveCoreTrackFromClassName(className) !== primaryCoreTrack : true;
  });
  let coreIndex = 0;

  coreBlocks.forEach((blockName) => {
    if (blockName === specialistBlock) {
      blockAssignments[blockName] = {
        entryType: 'class',
        className: 'Specialist Rotation (Art/Music/PE/Tech)',
        classType: 'Specialist',
        teacher: specialistTeacher,
        sec: 'Spec-101'
      };
      return;
    }

    const className = uniqueCoreQueue[coreIndex] || coreCourseOrder[coreIndex] || 'Core Instruction';
    blockAssignments[blockName] = {
      entryType: 'class',
      className,
      classType: 'Standard',
      sec: sectionByBlock[blockName] || null,
      teacher: pickTeacherNameForSubject(
        teacherDirectory,
        resolveSubjectFromRole(className),
        createSeededRandom(hashString(`${homeroomSeed}|${blockName}|teacher`))
      )
    };
    coreIndex += 1;
  });

  if (primaryBlock && blockAssignments[primaryBlock]) {
    blockAssignments[primaryBlock] = {
      entryType: 'class',
      className: primaryClassName,
      classType: primaryClassType,
      sec: sectionByBlock[primaryBlock] || blockAssignments[primaryBlock].sec || null,
      teacher: primaryTeacher
    };
  }

  const supportRows = supportWindows.map((window, idx) => ({
    block: supportWindows.length > 1 ? `${window.block} ${idx + 1}` : window.block,
    time: window.time,
    entries: middleDays.map(() => ({ entryType: 'support', className: 'Student Support / Advisory', classType: 'Support', teacher: 'Grade Team' }))
  }));
  const lunchRow = {
    block: 'Lunch Block',
    time: lunchWaveConfig.time,
    entries: middleDays.map(() => ({ entryType: 'lunch', className: `Student Lunch Supervision (${lunchWaveConfig.label})`, classType: '', teacher: 'Grade Team' }))
  };
  const middleMiddayRows = gradeNum === 6
    ? [lunchRow, ...supportRows]
    : gradeNum === 7
    ? [supportRows[0], lunchRow, supportRows[1]].filter(Boolean)
    : [...supportRows, lunchRow];

  return [
    {
      block: 'Homeroom',
      time: MIDDLE_BLOCK_TIMES.homeroom,
      entries: middleDays.map(() => ({ entryType: 'homeroom', className: 'Homeroom & Attendance', classType: 'Standard', teacher: homeroomTeacher }))
    },
    {
      block: specialistBlock === 'Block 1' ? 'Block 1 / Specialist' : 'Block 1',
      time: MIDDLE_BLOCK_TIMES.block1,
      entries: middleDays.map(() => ({ ...blockAssignments['Block 1'] }))
    },
    {
      block: specialistBlock === 'Block 2' ? 'Block 2 / Specialist' : 'Block 2',
      time: MIDDLE_BLOCK_TIMES.block2,
      entries: middleDays.map(() => ({ ...blockAssignments['Block 2'] }))
    },
    {
      block: specialistBlock === 'Block 3' ? 'Block 3 / Specialist' : 'Block 3',
      time: MIDDLE_BLOCK_TIMES.block3,
      entries: middleDays.map(() => ({ ...blockAssignments['Block 3'] }))
    },
    ...middleMiddayRows,
    {
      block: specialistBlock === 'Block 4' ? 'Block 4 / Specialist' : 'Block 4',
      time: MIDDLE_BLOCK_TIMES.block4,
      entries: middleDays.map(() => ({ ...blockAssignments['Block 4'] }))
    },
    {
      block: specialistBlock === 'Block 5' ? 'Block 5 / Specialist' : 'Block 5',
      time: MIDDLE_BLOCK_TIMES.block5,
      entries: middleDays.map(() => ({ ...blockAssignments['Block 5'] }))
    },
    {
      block: specialistBlock === 'Block 6' ? 'Block 6 / Specialist' : 'Block 6',
      time: MIDDLE_BLOCK_TIMES.block6,
      entries: middleDays.map(() => ({ ...blockAssignments['Block 6'] }))
    }
  ].map((row) => ({
    ...row,
    entries: middleDays.map((dayName, dayIdx) => {
      const fallbackEntry = row.entries?.[dayIdx];
      const aligned = pickAlignedScheduleEntry(scheduleCatalog, row.block, dayName, `${student?.id || student?.name}|${row.block}|${dayName}`, {
        kind: fallbackEntry?.entryType === 'lunch'
          ? 'lunch'
          : fallbackEntry?.entryType === 'homeroom'
          ? 'homeroom'
          : fallbackEntry?.entryType === 'studyhall'
          ? 'support'
          : fallbackEntry?.entryType === 'support'
          ? 'support'
          : 'class',
        teacherName: row.block === primaryBlock ? primaryTeacher : fallbackEntry?.teacher,
        className: fallbackEntry?.className
      });

      if (!aligned) return fallbackEntry;
      return {
        ...fallbackEntry,
        className: aligned.className || fallbackEntry?.className,
        classType: aligned.classType || fallbackEntry?.classType,
        teacher: aligned.teacher || fallbackEntry?.teacher,
        sec: aligned.sec || fallbackEntry?.sec || null
      };
    })
  }));
}

function buildHighStudentSchedule(student, teacherDirectory, scheduleCatalog) {
  const random = createSeededRandom(hashString(`${student?.id || student?.name}|high`));
  const subjects = ['Mathematics', 'Science', 'History', 'ELA', 'Foreign Language'];
  const periodLetters = [...HIGH_PERIOD_LETTERS];
  const lunchWaves = ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'];
  const periodTimes = HIGH_PERIOD_SLOT_TIMES;
  const homeroomSeed = `${student?.grade || 'high'}|${student?.rosterGroup || student?.sectionCode || student?.rosterLabel || 'HR'}`;
  const homeroomTeacher = student?.homeroomTeacherName || pickTeacherNameFromList(teacherDirectory?.all, `${homeroomSeed}|homeroom`, 'Homeroom Teacher');
  const supportTeacher = pickDifferentTeacherName(teacherDirectory?.all, homeroomTeacher, `${student?.id || student?.name}|high-support`, 'Guidance Team');
  const blockLabelText = String(student?.blockLabel || '').toUpperCase();
  const periodMatch = blockLabelText.match(/[A-G]$/);
  const primaryPeriod = periodMatch ? periodMatch[0] : 'A';
  const primaryClassName = student?.className || 'Core Seminar';
  const primaryClassType = student?.classGrade || 'Standard';
  const primaryIsStudyHall = /study hall|prep/i.test(String(primaryClassName || ''));
  const hasAcademicPrimary = Boolean(periodMatch)
    && !/homeroom|attendance|lunch|study hall/i.test(String(primaryClassName || ''));
  const primaryTeacherRecord = pickTeacherForSubject(
    teacherDirectory,
    resolveSubjectFromRole(primaryClassName),
    createSeededRandom(hashString(`${student?.sectionCode || student?.rosterLabel || student?.id}|high-primary-teacher`))
  );
  const primaryTeacher = student?.sectionTeacherName || primaryTeacherRecord?.name || 'Staff Teacher';

  const gradeMatch = String(student?.grade || '').match(/\d+/);
  const gradeNum = gradeMatch ? Number(gradeMatch[0]) : 9;
  const sectionLunchSeed = `${student?.sectionCode || student?.rosterGroup || student?.className || 'high'}|${student?.blockLabel || ''}`;
  const teacherMatchedLunchWave = typeof student?.teacherLunchWave === 'string' && lunchWaves.includes(student.teacherLunchWave)
    ? student.teacherLunchWave
    : typeof primaryTeacherRecord?.contractLunchWave === 'string' && lunchWaves.includes(primaryTeacherRecord.contractLunchWave)
    ? primaryTeacherRecord.contractLunchWave
    : null;
  const explicitLunchWave = typeof student?.lunchWave === 'string' && lunchWaves.includes(student.lunchWave)
    ? student.lunchWave
    : null;
  const studentLunchWave = explicitLunchWave || teacherMatchedLunchWave || lunchWaves[hashString(`${sectionLunchSeed}|high-lunch-wave`) % lunchWaves.length] || 'Wave 1';
  const studentLunchByDay = HIGH_LUNCH_WAVE_DAY_TIMES[studentLunchWave] || HIGH_LUNCH_WAVE_DAY_TIMES['Wave 1'];
  const currentQuarter = 'Quarter 1';
  const gymQuarterGradeMap = {
    'Quarter 1': 12,
    'Quarter 2': 11,
    'Quarter 3': 10,
    'Quarter 4': 9
  };
  const studyHallQuarterGradeMix = {
    'Quarter 1': [9, 10, 11],
    'Quarter 2': [9, 10, 12],
    'Quarter 3': [9, 11, 12],
    'Quarter 4': [10, 11, 12]
  };
  const gymGradeForQuarter = gymQuarterGradeMap[currentQuarter] || 12;
  const studyHallMixForQuarter = studyHallQuarterGradeMix[currentQuarter] || [9, 10, 11];
  const studyHallCohort = `Cohort ${String.fromCharCode(65 + (hashString(`${student?.id || student?.name}|${currentQuarter}|studyhall`) % 3))}`;

  const supportPeriodPool = periodLetters.filter((period) => period !== primaryPeriod);
  const supportPeriod = primaryIsStudyHall
    ? primaryPeriod
    : supportPeriodPool[Math.floor(random() * supportPeriodPool.length)] || 'G';
  const gymTeacher = pickGymTeacherPair(teacherDirectory, `${student?.id || student?.name}|high-gym-team`);

  const availableElectives = Array.isArray(teacherDirectory?.highElectives)
    ? teacherDirectory.highElectives.filter((entry) => entry?.courseName && String(entry.courseName).toLowerCase() !== 'physical education')
    : [];
  const hasElectiveWindow = availableElectives.length > 0;
  const electiveAssignments = {};

  if (hasElectiveWindow && availableElectives.length > 0) {
    const electiveCount = gradeNum >= 12 && random() > 0.55 ? 2 : 1;
    const electivePeriods = periodLetters.filter((period) => period !== primaryPeriod && period !== supportPeriod);
    for (let idx = 0; idx < electiveCount && idx < electivePeriods.length; idx += 1) {
      const period = electivePeriods[idx];
      const elective = availableElectives[(hashString(`${student?.id || student?.name}|elective|${idx}`) + idx) % availableElectives.length];
      const electiveTeachers = elective?.teachers || [];
      const electiveName = normalizeHighElectiveCourseName(elective?.courseName || 'Elective');
      const teacher = electiveName === 'Physical Education'
        ? pickGymTeacherPair(teacherDirectory, `${student?.id || student?.name}|elective-gym-team|${idx}`)
        : pickTeacherNameFromList(electiveTeachers, `${student?.id || student?.name}|elective-teacher|${idx}`, 'Elective Teacher');
      electiveAssignments[period] = {
        entryType: 'class',
        className: electiveName,
        classType: 'Standard',
        teacher
      };
    }
  }

  const primaryCoreTrack = hasAcademicPrimary ? resolveCoreTrackFromClassName(primaryClassName) : null;
  const openCorePeriods = periodLetters.filter((periodLetter) => {
    if (periodLetter === supportPeriod) return false;
    if (hasAcademicPrimary && periodLetter === primaryPeriod) return false;
    if (electiveAssignments[periodLetter]) return false;
    return true;
  });
  const remainingCoreSubjects = subjects.filter((subject) => subject !== primaryCoreTrack);
  const coreAssignmentsByPeriod = openCorePeriods.reduce((acc, periodLetter, idx) => {
    const subject = remainingCoreSubjects[idx];
    if (!subject) return acc;
    acc[periodLetter] = {
      entryType: 'class',
      className: pickHighCourseForGrade(subject, gradeNum, `${student?.id || student?.name}|${periodLetter}|${subject}|course`),
      classType: CLASS_LEVELS[idx % CLASS_LEVELS.length],
      teacher: pickTeacherNameForSubject(
        teacherDirectory,
        subject,
        createSeededRandom(hashString(`${student?.id || student?.name}|${periodLetter}|teacher`))
      )
    };
    return acc;
  }, {});

  const assignedByPeriod = periodLetters.reduce((acc, periodLetter) => {
    if (hasAcademicPrimary && periodLetter === primaryPeriod) {
      acc[periodLetter] = {
        entryType: 'class',
        className: primaryClassName,
        classType: primaryClassType,
        teacher: primaryTeacher
      };
      return acc;
    }

    if (electiveAssignments[periodLetter]) {
      acc[periodLetter] = electiveAssignments[periodLetter];
      return acc;
    }

    if (periodLetter === supportPeriod) {
      acc[periodLetter] = {
        entryType: 'studyhall',
        className: 'Study Hall',
        classType: 'Support',
        teacher: primaryIsStudyHall ? primaryTeacher : supportTeacher
      };
      return acc;
    }

    if (coreAssignmentsByPeriod[periodLetter]) {
      acc[periodLetter] = coreAssignmentsByPeriod[periodLetter];
      return acc;
    }

    acc[periodLetter] = {
      entryType: 'support',
      className: 'Academic Advisory',
      classType: 'Support',
      teacher: supportTeacher
    };
    return acc;
  }, {});

  return [
    {
      block: 'Homeroom',
      time: '7:35 AM - 7:50 AM',
      entries: WEEK_DAYS.map(() => ({ entryType: 'homeroom', className: 'Homeroom & Attendance', classType: 'Standard', teacher: homeroomTeacher }))
    },
    ...HIGH_SLOT_KEYS.map((_, slotIdx) => ({
      block: `Period ${slotIdx + 1}`,
      time: periodTimes[slotIdx] || 'Assigned by District',
      entries: WEEK_DAYS.map((dayName, dayIdx) => {
        const periodLetter = HIGH_DAY_PATTERNS[dayIdx]?.sequence?.[slotIdx] || HIGH_PERIOD_LETTERS[(dayIdx + slotIdx) % HIGH_PERIOD_LETTERS.length];
        const fallbackEntry = assignedByPeriod[periodLetter] || {
          entryType: 'class',
          className: 'Core Seminar',
          classType: 'Standard',
          teacher: pickTeacherNameForSubject(teacherDirectory, 'ELA', random)
        };
        const alignedEntry = pickAlignedScheduleEntry(scheduleCatalog, `Period ${slotIdx + 1}`, dayName, `${student?.id || student?.name}|${dayName}|${slotIdx}`, {
          kind: fallbackEntry.entryType === 'studyhall' ? 'prep' : fallbackEntry.entryType,
          teacherName: periodLetter === primaryPeriod ? primaryTeacher : fallbackEntry.teacher,
          className: fallbackEntry.className
        });
        const baseEntry = alignedEntry
          ? {
              ...fallbackEntry,
              className: alignedEntry.className || fallbackEntry.className,
              classType: alignedEntry.classType || fallbackEntry.classType,
              teacher: alignedEntry.teacher || fallbackEntry.teacher
            }
          : fallbackEntry;
        const isLongBlockSlot = slotIdx === HIGH_LONG_BLOCK_SLOT_INDEX;
        const activeWave = studentLunchWave;
        const lunchLabel = studentLunchByDay?.[dayName] || '11:10 AM - 11:50 AM';
        const splitRule = HIGH_LUNCH_WAVE_SPLIT_DETAILS[activeWave] || HIGH_LUNCH_WAVE_SPLIT_DETAILS['Wave 1'];

        if (baseEntry.entryType === 'studyhall' && isLongBlockSlot) {
          if (gradeNum === gymGradeForQuarter) {
            return {
              entryType: 'class',
              className: 'Physical Education',
              classType: 'Standard',
              teacher: gymTeacher,
              detail: `Period ${periodLetter} | ${HIGH_LONG_BLOCK_DURATION_LABEL} | ${currentQuarter} Gym Grade: ${gymGradeForQuarter}th | Lunch: ${lunchLabel} | Lunch Split: ${activeWave} - ${splitRule}`
            };
          }

          return {
            ...baseEntry,
            detail: `Period ${periodLetter} | ${HIGH_LONG_BLOCK_DURATION_LABEL} | ${currentQuarter} Study Hall Mix: ${studyHallMixForQuarter.join('/')}${studyHallCohort ? ` | ${studyHallCohort}` : ''} | Lunch: ${lunchLabel} | Lunch Split: ${activeWave} - ${splitRule}`
          };
        }

        return {
          ...baseEntry,
          detail: isLongBlockSlot
            ? `Period ${periodLetter} | ${HIGH_LONG_BLOCK_DURATION_LABEL} | Lunch: ${lunchLabel} | Lunch Split: ${activeWave} - ${splitRule}`
            : `Period ${periodLetter} | ${HIGH_STANDARD_BLOCK_DURATION_LABEL}`
        };
      })
    }))
  ];
}

function buildStudentReportCard(scheduleRows, schoolType, teacherDirectory) {
  const termLabels = buildTermLabelsBySchool(schoolType);
  const courseMap = new Map();

  const addCourseRow = (className, teacher, termSeed = 'A+') => {
    const safeClass = className || 'Assigned Course';
    const safeTeacher = teacher || 'Staff Teacher';
    const coreTrack = resolveCoreTrackFromClassName(safeClass);
    const isCoreTrack = ['ELA', 'Mathematics', 'Science', 'History', 'Foreign Language', 'Integrated Science/SS'].includes(coreTrack);
    const key = isCoreTrack
      ? `core:${schoolType}:${coreTrack}`
      : `course:${safeClass.toLowerCase()}`;
    if (courseMap.has(key)) return;
    const termGrades = termLabels.map((_, idx) => (idx === 0 ? termSeed : ''));
    courseMap.set(key, {
      className: safeClass,
      teacher: safeTeacher,
      termGrades
    });
  };

  (scheduleRows || []).forEach((row) => {
    (row.entries || []).forEach((entry) => {
      if (!entry || entry.entryType !== 'class') return;
      addCourseRow(entry.className, entry.teacher || 'Staff Teacher');
    });
  });

  if (schoolType === 'Elementary' || schoolType === 'Middle') {
    const electivePool = schoolType === 'Elementary' ? ELEMENTARY_REPORT_CARD_ELECTIVES : MIDDLE_REPORT_CARD_ELECTIVES;
    electivePool.forEach((electiveName) => {
      const teacher = pickTeacherNameForSubject(
        teacherDirectory,
        resolveSubjectFromRole(electiveName),
        createSeededRandom(hashString(`report-card|${schoolType}|${electiveName}`))
      );
      addCourseRow(electiveName, teacher, 'A');
    });
  }

  return {
    termLabels,
    rows: Array.from(courseMap.values()).sort((a, b) => a.className.localeCompare(b.className))
  };
}

function buildStudentAcademicViews(student, schoolType, facultyRoster) {
  const teacherDirectory = buildTeacherDirectoryForStudents(facultyRoster);
  const scheduleCatalog = buildTeacherScheduleCatalog(facultyRoster, schoolType);
  const scheduleRows = schoolType === 'High'
    ? buildHighStudentSchedule(student, teacherDirectory, scheduleCatalog)
    : schoolType === 'Middle'
    ? buildMiddleStudentSchedule(student, teacherDirectory, scheduleCatalog)
    : buildElementaryStudentSchedule(student, teacherDirectory, scheduleCatalog);

  const highLunchByDay = schoolType === 'High'
    ? extractHighLunchByDayFromRows(scheduleRows, HIGH_LUNCH_WAVE_DAY_TIMES['Wave 1'])
    : null;

  const highLunchWave = schoolType === 'High'
    ? resolveHighLunchWaveFromTime(highLunchByDay?.[WEEK_DAYS[0]] || '')
    : null;

  const lunchReference = schoolType === 'High'
    ? {
        label: student?.lunchWave || highLunchWave || 'Wave 1',
        time: highLunchByDay?.[WEEK_DAYS[0]] || HIGH_LUNCH_WAVE_DAY_TIMES[student?.lunchWave || highLunchWave || 'Wave 1']?.[WEEK_DAYS[0]] || '10:40 AM - 11:10 AM',
        detail: HIGH_LUNCH_WAVE_SPLIT_DETAILS[student?.lunchWave || highLunchWave || 'Wave 1'] || HIGH_LUNCH_WAVE_SPLIT_DETAILS['Wave 1']
      }
    : schoolType === 'Middle'
    ? (() => {
        const lunchConfig = getMiddleLunchConfigByGrade(student?.grade);
        return {
          label: lunchConfig.label,
          time: lunchConfig.time,
          detail: `Grade ${formatRosterGradeLabel(student?.grade)} staggered lunch block`
        };
      })()
    : (() => {
        const lunchConfig = getElementaryLunchConfigByGrade(student?.grade);
        return {
          label: lunchConfig.label,
          time: lunchConfig.time,
          detail: `${lunchConfig.pairedWith} | ${lunchConfig.order}`
        };
      })();

  return {
    scheduleRows,
    reportCard: buildStudentReportCard(scheduleRows, schoolType, teacherDirectory),
    highLunchByDay,
    highLunchWave,
    lunchReference
  };
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

const directoryCardBaseStyle = {
  width: '164px',
  minWidth: '164px',
  padding: '12px 8px',
  color: '#fff',
  borderRadius: '6px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  cursor: 'pointer',
  userSelect: 'none'
};

// Reusable Faculty Grid Card matching the customization options UI panels
function FacultyCard({ staff, onOpen, schoolType }) {
  return (
    <div
      onClick={() => onOpen(staff)}
      style={{
        ...directoryCardBaseStyle,
        backgroundColor: staff.isPlayer ? '#222d15' : '#121212',
        border: `1px solid ${staff.isPlayer ? '#00FFFF' : '#39FF14'}`,
        boxShadow: staff.isPlayer ? '0 0 8px rgba(0,255,255,0.2)' : 'none',
        scrollSnapAlign: 'start'
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
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: staff.isPlayer ? '#00FFFF' : '#fff', whiteSpace: 'normal', overflowWrap: 'anywhere', lineHeight: 1.2, width: '100%' }}>
          {staff.name}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#39FF14', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          {simplifyTeacherRoleLabel(staff.role, schoolType)}
        </span>
      </div>
    </div>
  );
}

function StudentCard({ student, onOpen, schoolType }) {
  const showClassType = schoolType === 'High';
  const classTypeTag = showClassType ? getClassTypeAbbreviation(student.classGrade) : '';
  return (
    <div
      onClick={() => onOpen(student)}
      style={{
        ...directoryCardBaseStyle,
        backgroundColor: '#121212',
        border: '1px solid #39FF14',
        boxShadow: '0 0 8px rgba(57,255,20,0.08)',
        scrollSnapAlign: 'start'
      }}
    >
      <DirectoryAvatarMini appearance={student.appearance || student} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', textAlign: 'center', width: '100%' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'normal', overflowWrap: 'anywhere', lineHeight: 1.2, width: '100%' }}>
          {student.name}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#00FFFF', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
          Grade {student.displayGrade || formatRosterGradeLabel(student.grade)}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#39FF14', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          {showClassType ? `${student.className} ${classTypeTag}` : student.className}
        </span>
        <span style={{ fontSize: '0.58rem', color: '#f5f1dd', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          {student.courseNumber} | {formatPeriodLabel(student.blockLabel)}
        </span>
        <span style={{ fontSize: '0.58rem', color: '#00FFFF', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          Grade {student.currentGradeLetter} / {student.currentGradeNumber}
        </span>
      </div>
    </div>
  );
}

export default function SchoolDirectoryStep({ schoolType, playerAvatar, playerDepartment, playerGrade, highLetterRange, initialData = null, onStateChange = null, onProceed, onBack, onSaveGame, styles }) {
  const [viewMode, setViewMode] = useState(initialData?.viewMode || 'staff');
  const [activeTab, setActiveTab] = useState(initialData?.activeTab || 'administration');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentViewMode, setStudentViewMode] = useState(initialData?.studentViewMode || 'schedule');
  const [liveProfile, setLiveProfile] = useState(null);
  const [selectedStaffSchedule, setSelectedStaffSchedule] = useState(null);
  const [showSchedule, setShowSchedule] = useState(Boolean(initialData?.showSchedule));
  const [studentActiveTab, setStudentActiveTab] = useState(initialData?.studentActiveTab || 'homeroom');
  const tabScrollRef = useRef(null);
  const dragStateRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
  const contentScrollRef = useRef(null);
  const contentDragRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
  const lastEmittedStateRef = useRef('');

  // Procedurally seed the entire school grid dataset
  const facultyRoster = useMemo(() => {
    return generateFacultyRoster(schoolType, playerAvatar, playerDepartment, playerGrade);
  }, [schoolType, playerAvatar, playerDepartment, playerGrade]);

  const highDepartmentCoverage = useMemo(() => {
    if (schoolType !== 'High') return {};
    return buildHighDepartmentCoverageMap(facultyRoster);
  }, [schoolType, facultyRoster]);

  const highSchedulePreferences = useMemo(() => {
    if (schoolType !== 'High') return { preferredPrepCount: 2 };
    return buildHighSchedulePreferences(facultyRoster);
  }, [schoolType, facultyRoster]);

  const studentRoster = useMemo(() => {
    if (schoolType === 'High') return buildHighStudentRoster(playerAvatar, playerGrade, highLetterRange);
    if (schoolType === 'Middle') return buildMiddleStudentRoster(playerDepartment, playerGrade, playerAvatar);
    if (schoolType === 'Elementary') return buildElementaryStudentRoster(playerDepartment, playerGrade);
    return {};
  }, [schoolType, playerAvatar, playerDepartment, playerGrade, highLetterRange]);

  const studentTabKeys = useMemo(() => Object.keys(studentRoster), [studentRoster]);
  const selectedStudentAcademic = useMemo(() => {
    if (!selectedStudent) return null;
    return buildStudentAcademicViews(selectedStudent, schoolType, facultyRoster);
  }, [selectedStudent, schoolType, facultyRoster]);
  const studentSectionMap = useMemo(() => {
    return Object.entries(studentRoster).reduce((acc, [key, students]) => {
      const firstStudent = students?.[0];
      acc[key] = {
        label: firstStudent?.rosterLabel || (key === 'homeroom' ? 'Homeroom | HR-01 | Period HR' : key),
        count: Array.isArray(students) ? students.length : 0
      };
      return acc;
    }, {});
  }, [studentRoster]);

  const tabKeys = useMemo(() => Object.keys(facultyRoster), [facultyRoster]);

  useEffect(() => {
    if (!tabKeys.includes(activeTab) && tabKeys.length > 0) {
      setActiveTab(tabKeys[0]);
    }
  }, [activeTab, tabKeys]);

  useEffect(() => {
    if (!studentTabKeys.includes(studentActiveTab) && studentTabKeys.length > 0) {
      setStudentActiveTab(studentTabKeys[0]);
    }
  }, [studentActiveTab, studentTabKeys]);

  const currentTabStaff = facultyRoster[activeTab] || [];
  const currentTabStudents = studentRoster[studentActiveTab] || [];
  const selectedStaffIsTeacherLike = isTeacherLikeRole(selectedStaff?.role);
  const selectedStaffUsesContractView = schoolType === 'High' || selectedStaffIsTeacherLike;

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


  const beginContentDrag = (clientX) => {
    if (!contentScrollRef.current) return;
    contentDragRef.current = {
      dragging: true,
      startX: clientX,
      startScrollLeft: contentScrollRef.current.scrollLeft
    };
  };

  const moveContentDrag = (clientX) => {
    if (!contentDragRef.current.dragging || !contentScrollRef.current) return;
    const delta = clientX - contentDragRef.current.startX;
    contentScrollRef.current.scrollLeft = contentDragRef.current.startScrollLeft - delta;
  };

  const endContentDrag = () => {
    contentDragRef.current.dragging = false;
  };

  useEffect(() => {
    if (selectedStaff) {
      const requestedStaffId = initialData?.selectedStaffId;
      const currentStaffId = selectedStaff?.id || selectedStaff?.name || null;
      if (requestedStaffId && requestedStaffId === currentStaffId) return;

      setLiveProfile(selectedStaff.profile || null);
      setSelectedStaffSchedule(generateLockedStaffSchedule(selectedStaff, schoolType, highDepartmentCoverage, highSchedulePreferences));
      setShowSchedule(false);
    }
  }, [selectedStaff, schoolType, highDepartmentCoverage, highSchedulePreferences]);

  useEffect(() => {
    if (selectedStudent) {
      setStudentViewMode('schedule');
    }
  }, [selectedStudent]);

  // Mount-only: restore selected staff from saved game resume data
  useEffect(() => {
    const requestedStaffId = initialData?.selectedStaffId;
    if (!requestedStaffId) return;
    const rosterEntries = Object.values(facultyRoster || {}).flatMap((members) => (Array.isArray(members) ? members : []));
    const matched = rosterEntries.find((staff) => (staff?.id || staff?.name) === requestedStaffId);
    if (matched) setSelectedStaff(matched);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mount-only: restore selected student from saved game resume data
  useEffect(() => {
    const requestedStudentId = initialData?.selectedStudentId;
    if (!requestedStudentId) return;
    const rosterEntries = Object.values(studentRoster || {}).flatMap((members) => (Array.isArray(members) ? members : []));
    const matched = rosterEntries.find((student) => (student?.id || student?.name) === requestedStudentId);
    if (matched) setSelectedStudent(matched);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const nextStateSnapshot = JSON.stringify({
      viewMode,
      activeTab,
      studentActiveTab,
      studentViewMode,
      showSchedule,
      selectedStaffId: selectedStaff?.id || selectedStaff?.name || null,
      selectedStudentId: selectedStudent?.id || selectedStudent?.name || null
    });

    if (lastEmittedStateRef.current === nextStateSnapshot) return;
    lastEmittedStateRef.current = nextStateSnapshot;

    onStateChange?.({
      viewMode,
      activeTab,
      studentActiveTab,
      studentViewMode,
      showSchedule,
      selectedStaffId: selectedStaff?.id || selectedStaff?.name || null,
      selectedStudentId: selectedStudent?.id || selectedStudent?.name || null
    });
  }, [
    viewMode,
    activeTab,
    studentActiveTab,
    studentViewMode,
    showSchedule,
    selectedStaff,
    selectedStudent,
    onStateChange
  ]);

  useEffect(() => {
    const hasOverlayOpen = Boolean(selectedStaff) || Boolean(selectedStudent);
    if (!hasOverlayOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedStaff, selectedStudent]);

  const handleOpenStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const handleOpenStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleProceed = () => {
    onProceed({ roster: facultyRoster, studentRoster });
  };

  const renderHighLunchWaveMatrix = () => (
    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#151515', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.8rem', color: '#ddd', textAlign: 'left' }}>
      <strong style={{ color: '#39FF14' }}>High School Lunch Wave Reference (4th Block Long Block):</strong>
      <div style={{ marginTop: '6px', display: 'grid', gridTemplateColumns: `120px repeat(${WEEK_DAYS.length}, minmax(0, 1fr))`, gap: '6px', alignItems: 'stretch' }}>
        <div style={{ backgroundColor: '#111', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '6px 8px', color: '#777', fontWeight: 'bold' }}>Wave</div>
        {WEEK_DAYS.map((day) => (
          <div key={day} style={{ backgroundColor: '#111', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '6px 8px', color: '#39FF14', fontWeight: 'bold', textAlign: 'center' }}>
            {day}
          </div>
        ))}

        {Object.entries(HIGH_LUNCH_WAVE_DAY_TIMES).flatMap(([wave, byDay]) => ([
          <div key={`${wave}-label`} style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '6px 8px', color: '#ffa500', fontWeight: 'bold' }}>
            {wave}
          </div>,
          ...WEEK_DAYS.map((day) => (
            <div key={`${wave}-${day}`} style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '6px 8px', color: '#c8c8c8', fontSize: '0.72rem', textAlign: 'center' }}>
              {byDay[day]}
            </div>
          ))
        ]))}
      </div>
    </div>
  );

  const renderMiddleLunchWaveReference = () => (
    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#151515', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.8rem', color: '#ddd', textAlign: 'left' }}>
      <strong style={{ color: '#39FF14' }}>Middle School Lunch Wave Reference:</strong>
      <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: '8px' }}>
        <div style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '8px' }}>
          <div style={{ color: '#39FF14', fontWeight: 'bold' }}>Grade 6</div>
          <div style={{ color: '#ffa500', marginTop: '2px' }}>{MIDDLE_LUNCH_WAVE_BY_GRADE[6].label}</div>
          <div style={{ color: '#c8c8c8', fontSize: '0.72rem' }}>{MIDDLE_LUNCH_WAVE_BY_GRADE[6].time}</div>
        </div>
        <div style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '8px' }}>
          <div style={{ color: '#39FF14', fontWeight: 'bold' }}>Grade 7</div>
          <div style={{ color: '#ffa500', marginTop: '2px' }}>{MIDDLE_LUNCH_WAVE_BY_GRADE[7].label}</div>
          <div style={{ color: '#c8c8c8', fontSize: '0.72rem' }}>{MIDDLE_LUNCH_WAVE_BY_GRADE[7].time}</div>
        </div>
        <div style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '8px' }}>
          <div style={{ color: '#39FF14', fontWeight: 'bold' }}>Grade 8</div>
          <div style={{ color: '#ffa500', marginTop: '2px' }}>{MIDDLE_LUNCH_WAVE_BY_GRADE[8].label}</div>
          <div style={{ color: '#c8c8c8', fontSize: '0.72rem' }}>{MIDDLE_LUNCH_WAVE_BY_GRADE[8].time}</div>
        </div>
      </div>
    </div>
  );

  const renderElementaryLunchRecessReference = () => (
    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#151515', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.8rem', color: '#ddd', textAlign: 'left' }}>
      <strong style={{ color: '#39FF14' }}>Elementary Lunch and Recess Reference:</strong>
      <div style={{ marginTop: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))', gap: '8px' }}>
        <div style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '8px' }}>
          <div style={{ color: '#39FF14', fontWeight: 'bold' }}>Wave A (Early)</div>
          <div style={{ color: '#ffa500', marginTop: '2px' }}>{ELEMENTARY_LUNCH_WAVE_BY_GRADE[0].time}</div>
          <div style={{ color: '#c8c8c8', fontSize: '0.72rem' }}>Kindergarten + Grade 4</div>
          <div style={{ color: '#9acb92', fontSize: '0.72rem' }}>Recess First / Lunch Second</div>
        </div>
        <div style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '8px' }}>
          <div style={{ color: '#39FF14', fontWeight: 'bold' }}>Wave B (Mid)</div>
          <div style={{ color: '#ffa500', marginTop: '2px' }}>{ELEMENTARY_LUNCH_WAVE_BY_GRADE[1].time}</div>
          <div style={{ color: '#c8c8c8', fontSize: '0.72rem' }}>Grade 1 + Grade 3</div>
          <div style={{ color: '#9acb92', fontSize: '0.72rem' }}>Lunch First / Recess Second</div>
        </div>
        <div style={{ backgroundColor: '#1d1d1d', border: '1px solid #2b2b2b', borderRadius: '4px', padding: '8px' }}>
          <div style={{ color: '#39FF14', fontWeight: 'bold' }}>Wave C (Late)</div>
          <div style={{ color: '#ffa500', marginTop: '2px' }}>{ELEMENTARY_LUNCH_WAVE_BY_GRADE[2].time}</div>
          <div style={{ color: '#c8c8c8', fontSize: '0.72rem' }}>Grade 2 + Grade 5</div>
          <div style={{ color: '#9acb92', fontSize: '0.72rem' }}>Recess First / Lunch Second</div>
        </div>
      </div>
    </div>
  );

  const renderSchoolLunchReference = () => {
    if (schoolType === 'High') return renderHighLunchWaveMatrix();
    if (schoolType === 'Middle') return renderMiddleLunchWaveReference();
    if (schoolType === 'Elementary') return renderElementaryLunchRecessReference();
    return null;
  };

  return (
    <div style={{ ...styles.setupBox, maxWidth: '1000px' }}>
      <h2 style={{ ...styles.heading, display: 'inline-flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
        <RetroIcon kind="contract" /> {schoolType.toUpperCase()} {viewMode === 'staff' ? 'STAFF DIRECTORY' : 'STUDENT ROSTER'}
      </h2>
      <p style={styles.subtitle}>
        {viewMode === 'staff'
          ? 'Review your processed employment authorization roster. All faculty assignments have been verified by the district board.'
          : 'Review your enrolled student roster by homeroom and class section. Each class section tops out at 24 students.'}
      </p>

      {viewMode === 'staff' ? (
        <>
          <div
            ref={tabScrollRef}
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-start',
              marginBottom: '20px',
              flexWrap: 'nowrap',
              paddingBottom: '6px',
              overflowX: 'auto',
              overflowY: 'hidden',
              userSelect: 'none',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
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
                  whiteSpace: 'nowrap'
                }}
              >
                {formatTabLabel(tabKey).toUpperCase()} ({facultyRoster[tabKey]?.length || 0})
              </button>
            ))}
          </div>

          <div
            ref={contentScrollRef}
            style={{
              backgroundColor: '#111',
              border: '1px solid #39FF14',
              borderRadius: '6px',
              padding: '24px',
              minHeight: '280px',
              maxHeight: '430px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              overflowY: 'auto',
              overflowX: 'hidden',
              justifyContent: 'center',
              alignContent: 'flex-start',
              userSelect: 'none',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
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
            <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
            <button
              style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={() => setViewMode('students')}
            >
              VIEW ROSTER <RetroArrow color="#0a0a0a" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start', marginBottom: '20px', flexWrap: 'nowrap', paddingBottom: '6px', overflowX: 'auto', overflowY: 'hidden', userSelect: 'none', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {studentTabKeys.map((tabKey) => (
              <button
                key={tabKey}
                onClick={() => setStudentActiveTab(tabKey)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.75rem',
                  backgroundColor: studentActiveTab === tabKey ? '#f5f1dd' : '#121212',
                  color: studentActiveTab === tabKey ? '#111' : '#fff',
                  border: `1px solid ${studentActiveTab === tabKey ? '#f5f1dd' : '#39FF14'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap'
                }}
              >
                {(studentSectionMap[tabKey]?.label || (tabKey === 'homeroom' ? 'Homeroom' : tabKey)).toUpperCase()} ({studentSectionMap[tabKey]?.count || 0})
              </button>
            ))}
          </div>

          <div style={{ marginBottom: '18px', color: '#9acb92', fontSize: '0.76rem', letterSpacing: '0.5px', textAlign: 'center' }}>
            CLICK A HOMEROOM OR CLASS SECTION TO VIEW THAT ROSTER.
          </div>

          <div
            ref={contentScrollRef}
            style={{
              backgroundColor: '#111',
              border: '1px solid #39FF14',
              borderRadius: '6px',
              padding: '24px',
              minHeight: '280px',
              maxHeight: '430px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              overflowY: 'auto',
              overflowX: 'hidden',
              justifyContent: 'center',
              alignContent: 'flex-start',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {currentTabStudents.length > 0 ? (
              currentTabStudents.map((student) => (
                <StudentCard key={student.id} student={student} onOpen={handleOpenStudent} schoolType={schoolType} />
              ))
            ) : (
              <div style={{ color: '#555', fontStyle: 'italic', fontSize: '0.9rem', marginTop: '100px' }}>
                No enrolled students were generated for this section.
              </div>
            )}
          </div>

          <div style={styles.footerActions}>
            <button style={{ ...styles.backButton, flex: '1 1 180px' }} onClick={() => setViewMode('staff')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                <RetroArrow direction="left" /> BACK TO STAFF
              </span>
            </button>
            <button style={{ ...styles.saveButton, flex: '2 1 240px' }} onClick={onSaveGame}>SAVE GAME</button>
            <button
              style={{ ...styles.actionButton, flex: '2 1 240px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              onClick={handleProceed}
            >
              ENTER GAME <RetroArrow color="#0a0a0a" />
            </button>
          </div>
        </>
      )}

      {selectedStaff && liveProfile && (
        <div className="no-scrollbar" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.78)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 60, padding: '16px', overflowY: 'auto' }}>
          <div className="no-scrollbar" style={{ width: '100%', maxWidth: showSchedule ? '1140px' : '760px', backgroundColor: '#111', border: '2px solid #39FF14', borderRadius: '8px', padding: showSchedule ? '24px' : '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: '#39FF14', letterSpacing: '1px' }}>{selectedStaff.name.toUpperCase()} {showSchedule ? 'CONTRACT SCREEN' : 'PROFILE'}</h3>
              <button style={styles.backButton} onClick={() => (showSchedule ? setShowSchedule(false) : setSelectedStaff(null))}>{showSchedule ? 'BACK TO PROFILE' : 'CLOSE'}</button>
            </div>

            {showSchedule && selectedStaffSchedule ? (
              <div style={{ ...styles.setupBox, maxWidth: '100%', minHeight: 'unset', padding: '20px', justifyContent: 'flex-start', backgroundColor: '#111' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <p style={{ margin: 0, color: '#39FF14', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {selectedStaffUsesContractView ? 'CONTRACT SCHEDULE PREVIEW' : 'DUTY ROTATION PREVIEW'}
                  </p>
                  <span style={{ color: '#9acb92', fontSize: '0.76rem' }}>School Year {selectedStaffSchedule.academicYear} (Locked)</span>
                </div>

                {selectedStaffSchedule.lunchWave && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
                    <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem', color: '#fff' }}>
                      Lunch Wave Slot: <strong style={{ color: '#ffa500' }}>One Per Day, Balanced By Rotation</strong>
                    </div>
                  </div>
                )}

                <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', color: '#ddd', fontSize: '0.78rem' }}>
                  <strong style={{ color: '#39FF14' }}>Role:</strong> {simplifyTeacherRoleLabel(selectedStaff.role, schoolType)} | <strong style={{ color: '#39FF14' }}>School:</strong> {schoolType}
                </div>

                {selectedStaffUsesContractView ? (
                  <>
                    {(() => {
                      const usePreviewMatrixLayout = schoolType === 'High';
                      const hasHomeroomRow = usePreviewMatrixLayout && selectedStaffSchedule.rows.some((row) => row.block === 'Homeroom');
                      const matrixRows = usePreviewMatrixLayout
                        ? selectedStaffSchedule.rows.filter((row) => row.block !== 'Homeroom')
                        : selectedStaffSchedule.rows;
                      return (
                    <div className="no-scrollbar" style={{ border: '1px solid #2a2a2a', borderRadius: '6px', flex: 1, minHeight: '420px', backgroundColor: '#111', overflowX: 'auto', overflowY: 'visible' }}>
                      <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.82rem', textAlign: 'center', tableLayout: 'fixed' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #39FF14' }}>
                            <th style={{ padding: '10px 8px', color: '#39FF14', width: '22%' }}>BLOCK / TIME</th>
                            {getScheduleDays(schoolType).map((day) => (
                              <th key={day} style={{ padding: '10px 8px', color: '#39FF14' }}>{day.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {hasHomeroomRow && (
                            <tr style={{ borderBottom: '1px solid #222', backgroundColor: '#0e1f1f' }}>
                              <td style={{ padding: '12px 10px', borderRight: '1px solid #222' }}>
                                <div style={{ fontWeight: 'bold', color: '#00FFFF' }}>Homeroom</div>
                                <div style={{ fontSize: '0.72rem', color: '#aaa', marginTop: '2px' }}>8:00 AM - 8:15 AM</div>
                                <div style={{ fontSize: '0.7rem', color: '#5acaca', fontStyle: 'italic', marginTop: '2px' }}>Fixed Daily Attendance</div>
                              </td>
                              {getScheduleDays(schoolType).map((day) => (
                                <td key={day} style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                                  <div style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#00FFFF' }}>Homeroom & Attendance</div>
                                </td>
                              ))}
                            </tr>
                          )}

                          {matrixRows.map((row, idx) => (
                            <tr key={`${row.block}-${idx}`} style={{ borderBottom: '1px solid #232323' }}>
                              <td style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                                <div style={{ fontWeight: 'bold', color: row.block === 'Homeroom' ? '#00FFFF' : '#39FF14' }}>{row.block}</div>
                                <div style={{ color: '#9a9a9a', fontSize: '0.72rem' }}>{row.time}</div>
                              </td>
                              {(row.entries || WEEK_DAYS.map(() => '')).map((entry, entryIdx) => {
                                const normalized = entry && typeof entry === 'object' ? entry : buildSpecialEntry(String(entry || 'Teacher Coverage Block'), 'support');

                                const primaryColor = getEntryColor(normalized);
                                const showLevelMeta = schoolType === 'High' && normalized.kind === 'class' && Boolean(normalized.level);
                                const showSectionMeta = normalized.kind === 'class' && Boolean(normalized.sec);
                                const showLunchTag = normalized.kind === 'lunch';
                                const showDetail = Boolean(normalized.detail);
                                const isDoubleContinuation = Boolean(normalized.isDoubleContinuation);
                                const cellRowSpan = usePreviewMatrixLayout && normalized.isDouble ? 2 : 1;

                                const prevRowEntry = matrixRows[idx - 1]?.entries?.[entryIdx];
                                const hasDoubleAnchorAbove = Boolean(prevRowEntry?.isDouble) && !Boolean(prevRowEntry?.isDoubleContinuation);

                                if (usePreviewMatrixLayout && isDoubleContinuation && hasDoubleAnchorAbove) {
                                  return null;
                                }

                                return (
                                  <td
                                    key={`${row.block}-${entryIdx}`}
                                    rowSpan={cellRowSpan}
                                    style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle', backgroundColor: isDoubleContinuation ? '#161616' : 'transparent' }}
                                  >
                                    <div style={{ fontWeight: 'bold', color: normalized.kind === 'prep' ? '#ff9f43' : '#fff', fontSize: '0.85rem', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word', lineHeight: 1.35 }}>
                                      {normalized.name}
                                    </div>

                                    {(showLevelMeta || showSectionMeta) && (
                                      <div style={{ fontSize: '0.72rem', marginTop: '4px', color: primaryColor }}>
                                        {showLevelMeta ? `[${normalized.level || 'Standard'}] ` : ''}{showSectionMeta ? normalized.sec : ''}
                                      </div>
                                    )}

                                    {showDetail && (
                                      <div style={{ fontSize: '0.7rem', marginTop: '4px', color: '#b6d9b1' }}>
                                        {normalized.detail}
                                        {isDoubleContinuation ? ' | Continuation' : ''}
                                      </div>
                                    )}

                                    {isDoubleContinuation && !showDetail && (
                                      <div style={{ fontSize: '0.7rem', marginTop: '4px', color: '#b6d9b1' }}>
                                        Double Block Continuation
                                      </div>
                                    )}

                                    {normalized.isDouble && !isDoubleContinuation && (
                                      <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px' }}>
                                        Double Period
                                      </span>
                                    )}

                                    {showLunchTag && (
                                      <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px' }}>
                                        Lunch Wave Slot
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
                      );
                    })()}

                    {selectedStaffSchedule.lunchByDay && (
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${WEEK_DAYS.length}, minmax(0, 1fr))`, gap: '8px', marginTop: '12px' }}>
                        {WEEK_DAYS.map((day) => (
                          <div key={day} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
                            <div style={{ fontSize: '0.75rem', color: '#39FF14', fontWeight: 'bold' }}>{day}</div>
                            <div style={{ fontSize: '0.72rem', color: '#ffa500', marginTop: '2px' }}>{selectedStaffSchedule.lunchByDay[day]}</div>
                            <div style={{ fontSize: '0.68rem', color: '#9acb92', marginTop: '2px' }}>{resolveHighLunchWaveFromTime(selectedStaffSchedule.lunchByDay[day])}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #2a2a2a', fontSize: '0.76rem', color: '#8f8f8f', textAlign: 'center' }}>
                      Weekly rotating matrix stays fully covered Monday-Friday with one prep block, one lunch wave slot, and balanced 3-before/3-after classes.
                    </div>

                    {renderSchoolLunchReference()}
                  </>
                ) : (
                  <>
                    <div style={{ marginBottom: '10px', padding: '10px 12px', backgroundColor: '#161616', borderRadius: '6px', border: '1px solid #2a2a2a', fontSize: '0.78rem', color: '#9acb92' }}>
                      Administrative and support staff use a duty rotation timeline instead of class-section contract blocks.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${getScheduleDays(schoolType).length}, minmax(140px, 1fr))`, gap: '8px' }}>
                      {getScheduleDays(schoolType).map((day, dayIdx) => (
                        <div key={day} style={{ backgroundColor: '#141414', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ fontSize: '0.7rem', color: '#39FF14', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid #222', paddingBottom: '3px' }}>
                            {day.toUpperCase()}
                          </div>
                          {selectedStaffSchedule.rows.map((row, idx) => {
                            const rawEntry = row?.entries?.[dayIdx];
                            const normalized = rawEntry && typeof rawEntry === 'object'
                              ? rawEntry
                              : buildSpecialEntry(String(rawEntry || 'Duty Coverage'), 'support');
                            return (
                              <div key={`${day}-${row.block}-${idx}`} style={{ backgroundColor: '#101010', border: '1px solid #242424', borderRadius: '4px', padding: '4px' }}>
                                <div style={{ fontSize: '0.62rem', color: '#8ecf85', fontWeight: 'bold' }}>{row.block}</div>
                                <div style={{ fontSize: '0.58rem', color: '#7b7b7b', marginTop: '1px' }}>{row.time}</div>
                                <div style={{ fontSize: '0.64rem', color: normalized.kind === 'prep' ? '#ff9f43' : '#fff', marginTop: '2px', fontWeight: 'bold' }}>{normalized.name}</div>
                                {normalized.detail && (
                                  <div style={{ fontSize: '0.58rem', color: '#a5bfa1', marginTop: '1px' }}>{normalized.detail}</div>
                                )}
                                {normalized.kind === 'lunch' && (
                                  <span style={{ display: 'inline-block', marginTop: '2px', fontSize: '0.56rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px' }}>
                                    Class Replaced By Lunch
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #2a2a2a', fontSize: '0.76rem', color: '#8f8f8f', textAlign: 'center' }}>
                      Duty timelines focus on supervision, intervention, and campus operations coverage across the full school day.
                    </div>
                  </>
                )}

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
                        {selectedStaffUsesContractView ? 'VIEW TEACHING SCHEDULE' : 'VIEW DUTY ROTATION'}
                      </button>
                      <p style={{ margin: '10px 0 0', color: '#9acb92', fontSize: '0.76rem' }}>
                        {selectedStaffUsesContractView
                          ? `Teaching contract is randomized and locked for school year ${selectedStaffSchedule?.academicYear || 'N/A'}. Regenerates next school year.`
                          : `Duty rotation is randomized and locked for school year ${selectedStaffSchedule?.academicYear || 'N/A'}. Regenerates next school year.`}
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

                <p style={{ margin: '14px 0 0', color: '#888', fontSize: '0.82rem' }}>
                  Profile vitals stay locked in this directory preview until you enter the world map.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="no-scrollbar" style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.78)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', zIndex: 60, padding: '16px', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: studentViewMode === 'profile' ? '760px' : '1140px', backgroundColor: '#111', border: '2px solid #39FF14', borderRadius: '8px', padding: studentViewMode === 'schedule' && schoolType === 'High' ? '24px' : '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: '#39FF14', letterSpacing: '1px' }}>
                {selectedStudent.name.toUpperCase()} {studentViewMode === 'profile' ? 'PROFILE' : studentViewMode === 'schedule' ? 'CONTRACT SCREEN' : 'REPORT CARD'}
              </h3>
              <button style={styles.backButton} onClick={() => setSelectedStudent(null)}>CLOSE</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <button
                style={{
                  ...styles.actionButton,
                  backgroundColor: studentViewMode === 'schedule' ? '#f5f1dd' : '#202020',
                  color: studentViewMode === 'schedule' ? '#111' : '#fff',
                  border: studentViewMode === 'schedule' ? '1px solid #f5f1dd' : '1px solid #444',
                  padding: '10px 14px',
                  fontSize: '0.82rem'
                }}
                onClick={() => setStudentViewMode('schedule')}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><RetroIcon kind="grid" size={18} /> VIEW SCHEDULE</span>
              </button>

              <button
                style={{
                  ...styles.actionButton,
                  backgroundColor: studentViewMode === 'report' ? '#f5f1dd' : '#202020',
                  color: studentViewMode === 'report' ? '#111' : '#fff',
                  border: studentViewMode === 'report' ? '1px solid #f5f1dd' : '1px solid #444',
                  padding: '10px 14px',
                  fontSize: '0.82rem'
                }}
                onClick={() => setStudentViewMode('report')}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><RetroIcon kind="reportCard" size={18} /> VIEW REPORT CARD</span>
              </button>
            </div>

            {studentViewMode === 'schedule' && selectedStudentAcademic ? (
              <>
                {selectedStudentAcademic.lunchReference && (
                  <div style={{ marginBottom: '12px', padding: '10px 12px', backgroundColor: '#161616', borderRadius: '6px', border: '1px solid #2a2a2a', fontSize: '0.78rem', color: '#ddd', textAlign: 'center' }}>
                    <strong style={{ color: '#39FF14' }}>Lunch Wave:</strong> <span style={{ color: '#ffa500' }}>{selectedStudentAcademic.lunchReference.label}</span> | <strong style={{ color: '#39FF14' }}>Window:</strong> <span style={{ color: '#f5f1dd' }}>{selectedStudentAcademic.lunchReference.time}</span>
                    <div style={{ marginTop: '4px', color: '#9acb92', fontSize: '0.72rem' }}>{selectedStudentAcademic.lunchReference.detail}</div>
                  </div>
                )}

                {schoolType === 'High' ? (
                  <>
                    <div style={{ ...styles.setupBox, maxWidth: '100%', minHeight: 'unset', padding: '20px', justifyContent: 'flex-start', backgroundColor: '#111' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        <p style={{ margin: 0, color: '#39FF14', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                          CONTRACT SCHEDULE PREVIEW
                        </p>
                        <span style={{ color: '#9acb92', fontSize: '0.76rem' }}>School Year {resolveAcademicYearLabel()} (Locked)</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
                        <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem', color: '#fff' }}>
                          Lunch Wave Slot: <strong style={{ color: '#ffa500' }}>One Per Day, Balanced By Rotation</strong>
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', color: '#ddd', fontSize: '0.78rem' }}>
                        <strong style={{ color: '#39FF14' }}>Role:</strong> Student | <strong style={{ color: '#39FF14' }}>School:</strong> High
                      </div>

                      <div className="no-scrollbar" style={{ border: '1px solid #2a2a2a', borderRadius: '6px', flex: 1, minHeight: '420px', backgroundColor: '#111', overflowX: 'auto', overflowY: 'visible' }}>
                        <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.82rem', textAlign: 'center', tableLayout: 'fixed' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #39FF14' }}>
                            <th style={{ padding: '10px 8px', color: '#39FF14', width: '22%' }}>BLOCK / TIME</th>
                            {WEEK_DAYS.map((day) => (
                              <th key={day} style={{ padding: '10px 8px', color: '#39FF14' }}>{day.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudentAcademic.scheduleRows.map((row, rowIdx) => {
                            const isHomeroomRow = row.block === 'Homeroom';
                            return (
                              <tr key={`${row.block}-${rowIdx}`} style={{ borderBottom: '1px solid #232323', backgroundColor: isHomeroomRow ? '#0e1f1f' : 'transparent' }}>
                                <td style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                                  <div style={{ fontWeight: 'bold', color: isHomeroomRow ? '#00FFFF' : '#39FF14' }}>{row.block}</div>
                                  <div style={{ color: '#9a9a9a', fontSize: '0.72rem' }}>{row.time}</div>
                                  {isHomeroomRow && (
                                    <div style={{ fontSize: '0.7rem', color: '#5acaca', fontStyle: 'italic', marginTop: '2px' }}>Fixed Daily Attendance</div>
                                  )}
                                </td>
                                {(row.entries || WEEK_DAYS.map(() => null)).map((entry, entryIdx) => {
                                  const normalized = entry && typeof entry === 'object'
                                    ? {
                                        name: entry.className || 'Assigned Coverage',
                                        kind: entry.entryType === 'homeroom'
                                          ? 'homeroom'
                                          : entry.entryType === 'lunch'
                                          ? 'lunch'
                                          : entry.entryType === 'studyhall'
                                          ? 'prep'
                                          : 'class',
                                        level: entry.classType || 'Standard',
                                        detail: entry.detail || null,
                                        teacher: entry.teacher || null
                                      }
                                    : buildSpecialEntry('Assigned Coverage', 'support');

                                  const primaryColor = getEntryColor(normalized);
                                  const showLevelMeta = normalized.kind === 'class' && Boolean(normalized.level);
                                  const showDetail = Boolean(normalized.detail);
                                  const showLunchTag = normalized.kind === 'lunch';
                                  const showLongBlockTag = row.block === 'Period 4';

                                  return (
                                    <td key={`${row.block}-${entryIdx}`} style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                                      <div style={{ fontWeight: 'bold', color: normalized.kind === 'prep' ? '#ff9f43' : normalized.kind === 'homeroom' ? '#00FFFF' : '#fff', fontSize: '0.85rem' }}>
                                        {normalized.name}
                                      </div>

                                      {showLevelMeta && (
                                        <div style={{ fontSize: '0.72rem', marginTop: '4px', color: primaryColor }}>
                                          [{normalized.level || 'Standard'}]
                                        </div>
                                      )}

                                      {normalized.teacher && (
                                        <div style={{ color: '#00FFFF', fontSize: '0.68rem', marginTop: '3px' }}>
                                          Teacher: {normalized.teacher}
                                        </div>
                                      )}

                                      {showDetail && (
                                        <div style={{ fontSize: '0.7rem', marginTop: '4px', color: '#b6d9b1' }}>
                                          {normalized.detail}
                                        </div>
                                      )}

                                      {showLunchTag && (
                                        <span style={{ display: 'inline-block', marginTop: '5px', fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px' }}>
                                          Lunch Wave Slot
                                        </span>
                                      )}

                                      {showLongBlockTag && (
                                        <span style={{ display: 'inline-block', marginTop: '5px', marginLeft: showLunchTag ? '6px' : 0, fontSize: '0.65rem', backgroundColor: '#333', color: '#ffa500', padding: '1px 4px', borderRadius: '3px' }}>
                                          Long Block + Lunch Split
                                        </span>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                        </table>
                      </div>

                      {selectedStudentAcademic.highLunchByDay && (
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${WEEK_DAYS.length}, minmax(0, 1fr))`, gap: '8px', marginTop: '12px' }}>
                          {WEEK_DAYS.map((day) => (
                            <div key={day} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
                              <div style={{ fontSize: '0.75rem', color: '#39FF14', fontWeight: 'bold' }}>{day}</div>
                              <div style={{ fontSize: '0.72rem', color: '#ffa500', marginTop: '2px' }}>{selectedStudentAcademic.highLunchByDay[day]}</div>
                              <div style={{ fontSize: '0.68rem', color: '#9acb92', marginTop: '2px' }}>{resolveHighLunchWaveFromTime(selectedStudentAcademic.highLunchByDay[day])}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #2a2a2a', fontSize: '0.76rem', color: '#8f8f8f', textAlign: 'center' }}>
                        Weekly rotating matrix stays fully covered Day 1-Day 7 with long-block lunch split and class/elective alignment.
                      </div>

                      {renderSchoolLunchReference()}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="no-scrollbar" style={{ border: '1px solid #2a2a2a', borderRadius: '6px', backgroundColor: '#111', overflowX: 'hidden', overflowY: 'visible' }}>
                      <table style={{ width: '100%', minWidth: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.8rem', textAlign: 'center', tableLayout: 'fixed' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #39FF14' }}>
                            <th style={{ padding: '10px 8px', color: '#39FF14', width: '24%' }}>BLOCK / TIME</th>
                            {getScheduleDays(schoolType).map((day) => (
                              <th key={day} style={{ padding: '10px 8px', color: '#39FF14' }}>{day.toUpperCase()}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedStudentAcademic.scheduleRows.map((row, rowIdx) => (
                            <tr key={`${row.block}-${rowIdx}`} style={{ borderBottom: '1px solid #242424' }}>
                              <td style={{ padding: '10px 8px', borderRight: '1px solid #222' }}>
                                <div style={{ color: '#39FF14', fontWeight: 'bold' }}>{row.block}</div>
                                <div style={{ color: '#8d8d8d', fontSize: '0.72rem' }}>{row.time}</div>
                              </td>
                              {row.entries.map((entry, entryIdx) => {
                                const isStudyHall = entry.entryType === 'studyhall';
                                const typeColor = entry.classType === 'Support' ? '#ff9f43' : getLevelColor(entry.classType || 'Standard');
                                return (
                                  <td key={`${row.block}-${entryIdx}`} style={{ padding: '10px 8px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                                    <div style={{ color: isStudyHall ? '#ff9f43' : '#fff', fontWeight: 'bold', fontSize: '0.8rem', whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word', lineHeight: 1.35 }}>{entry.className}</div>
                                    <div style={{ color: typeColor, fontSize: '0.7rem', marginTop: '3px' }}>Type: {entry.classType || 'Standard'}</div>
                                    {entry.teacher && (
                                      <div style={{ color: '#00FFFF', fontSize: '0.68rem', marginTop: '3px' }}>Teacher: {entry.teacher}</div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {renderSchoolLunchReference()}
                  </>
                )}
              </>
            ) : null}

            {studentViewMode === 'report' && selectedStudentAcademic ? (
              <>
                <div style={{ marginBottom: '10px', color: '#39FF14', fontSize: '0.84rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                  CURRENT TERM REPORT CARD
                </div>
                <div className="no-scrollbar" style={{ border: '1px solid #2a2a2a', borderRadius: '6px', backgroundColor: '#111', overflowX: 'auto', overflowY: 'visible' }}>
                  <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse', color: '#fff', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #39FF14' }}>
                        <th style={{ padding: '10px 8px', color: '#39FF14', textAlign: 'left' }}>CLASS</th>
                        <th style={{ padding: '10px 8px', color: '#39FF14', textAlign: 'left' }}>TEACHER</th>
                        {selectedStudentAcademic.reportCard.termLabels.map((termLabel) => (
                          <th key={termLabel} style={{ padding: '10px 8px', color: '#39FF14', textAlign: 'center' }}>{termLabel}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudentAcademic.reportCard.rows.map((row, idx) => (
                        <tr key={`${row.className}-${row.teacher}-${idx}`} style={{ borderBottom: '1px solid #242424' }}>
                          <td style={{ padding: '10px 8px' }}>{row.className}</td>
                          <td style={{ padding: '10px 8px' }}>{row.teacher}</td>
                          {row.termGrades.map((termGrade, gradeIdx) => (
                            <td key={`${row.className}-${row.teacher}-${gradeIdx}`} style={{ padding: '10px 8px', textAlign: 'center', color: termGrade ? '#39FF14' : '#777', fontWeight: 'bold' }}>
                              {termGrade || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ margin: '10px 0 0', color: '#9acb92', fontSize: '0.78rem', textAlign: 'center' }}>
                  Default grading starts at A+ for all graded classes. Study Hall is not graded.
                </p>
              </>
            ) : null}

            {studentViewMode === 'profile' ? (
              <>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PixelAvatar appearance={selectedStudent.appearance || selectedStudent} size="small" direction="Front" motion={{ blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 }} />
              </div>

              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px' }}>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Grade:</strong> {selectedStudent.grade}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Age:</strong> {selectedStudent.age}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Class:</strong> {schoolType === 'High' ? `${selectedStudent.className} ${getClassTypeAbbreviation(selectedStudent.classGrade)}` : selectedStudent.className}</p>
                {schoolType === 'High' && (
                  <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Class Type:</strong> {getClassTypeAbbreviation(selectedStudent.classGrade)}</p>
                )}
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Course Number:</strong> {selectedStudent.courseNumber}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Period:</strong> {formatPeriodLabel(selectedStudent.blockLabel)}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Current Grade:</strong> {selectedStudent.currentGradeLetter} / {selectedStudent.currentGradeNumber}</p>
                <p style={{ margin: 0, color: '#fff' }}><strong>Section:</strong> {selectedStudent.sectionCode}</p>
              </div>

              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <StatBar label="Health" value={selectedStudent.profile.vitals.health} color="#39FF14" />
                <StatBar label="Stress" value={selectedStudent.profile.vitals.stress} color="#FF3333" />
                <StatBar label="Energy" value={selectedStudent.profile.vitals.energy} color="#00FFFF" />
                <StatBar label="Morale" value={selectedStudent.profile.vitals.morale} color="#F7F7F7" />
                <StatBar label="Focus" value={selectedStudent.profile.vitals.focus} color="#FFA500" />
              </div>

              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <StatBar label="Strictness" value={selectedStudent.profile.personality.strictness} color="#ff6b6b" />
                <StatBar label="Kindness" value={selectedStudent.profile.personality.kindness} color="#4ecdc4" />
                <StatBar label="Patience" value={selectedStudent.profile.personality.patience} color="#ffe66d" />
                <StatBar label="Humor" value={selectedStudent.profile.personality.humor} color="#c7f464" />
                <StatBar label="Organization" value={selectedStudent.profile.personality.organization} color="#7b9acc" />
              </div>
            </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}