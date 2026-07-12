import React, { useMemo, useRef, useState, useEffect } from 'react';
import RetroIcon, { RetroArrow } from './RetroIcon';
import { generateFacultyRoster } from '../../services/staffGenerator';
import { generateRoster } from '../../services/studentGenerator';
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
  if (schoolType === 'High' && lower.startsWith('elective teacher - ')) {
    return role.replace('Elective Teacher - ', '').trim() + ' Teacher';
  }
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
  if (text.includes('1')) return 6 + Math.floor(Math.random() * 2);
  if (text.includes('2')) return 7 + Math.floor(Math.random() * 2);
  if (text.includes('3')) return 8 + Math.floor(Math.random() * 2);
  if (text.includes('4')) return 9 + Math.floor(Math.random() * 2);
  if (text.includes('5')) return 10 + Math.floor(Math.random() * 2);
  if (text.includes('6')) return 11 + Math.floor(Math.random() * 2);
  if (text.includes('7')) return 12 + Math.floor(Math.random() * 2);
  if (text.includes('8')) return 13 + Math.floor(Math.random() * 2);
  if (text.includes('9')) return 14 + Math.floor(Math.random() * 2);
  if (text.includes('10')) return 15 + Math.floor(Math.random() * 2);
  if (text.includes('11')) return 16 + Math.floor(Math.random() * 2);
  if (text.includes('12')) return 17 + Math.floor(Math.random() * 2);
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
  const normalized = String(periodLabel || '').trim().toUpperCase();
  if (!normalized) return 'Period';
  return `Period ${normalized}`;
}

function buildStudentRosterFromSections(sections) {
  const rosterCache = new Map();
  return sections.reduce((acc, section, sectionIndex) => {
    const size = Math.min(section.maxStudents || 24, 18 + ((sectionIndex * 3) % 7));
    const rosterGroup = section.rosterGroup || section.key;
    let seededStudents = rosterCache.get(rosterGroup);
    if (!seededStudents) {
      seededStudents = generateRoster(size).map((student, studentIndex) => {
        const age = deriveStudentAgeFromGrade(section.gradeLabel);
        return {
          ...student,
          sharedRosterId: `${rosterGroup}-${student.id}`,
          age,
          appearance: buildStudentAvatarAppearance(student, rosterGroup, studentIndex),
          vitals: buildStudentVitals(student),
          personality: buildStudentPersonality(student)
        };
      });
      rosterCache.set(rosterGroup, seededStudents);
    }
    acc[section.key] = seededStudents.map((student, studentIndex) => {
      return {
        ...student,
        id: `${section.key}-${student.sharedRosterId || student.id || studentIndex}`,
        grade: section.gradeLabel,
        classGrade: section.courseLevel || 'Standard',
        className: section.courseName,
        sectionCode: section.sectionCode,
        courseNumber: section.courseNumber,
        blockLabel: section.blockLabel,
        rosterLabel: section.label,
        currentGradeLetter: 'A+',
        currentGradeNumber: 100,
        homeroom: 'Homeroom & Attendance',
        profile: {
          age: student.age,
          occupation: 'Student',
          yearsTeaching: 0,
          birthday: `Grade ${section.gradeLabel} Student`,
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

function buildMiddleStudentRoster(playerDepartment, playerGrade) {
  const gradeLabel = `${playerGrade || 6}th`;
  const courseName = playerDepartment?.name || 'Middle Core Instruction';
  const sectionPrefix = `M${playerGrade || 6}`;
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
      maxStudents: 24
    },
    ...['1', '2', '3', '5', '6'].map((blockLabel, index) => ({
      key: `block-${blockLabel}`,
      label: `${courseName} | Sec ${sectionPrefix}${index + 1} | Period ${blockLabel}`,
      sectionCode: `Sec ${sectionPrefix}${index + 1}`,
      gradeLabel,
      courseName,
      courseLevel: 'Standard',
      courseNumber: `Sec ${sectionPrefix}${index + 1}`,
      blockLabel,
      maxStudents: 24
    }))
  ];

  return buildStudentRosterFromSections(sections);
}

function buildHighStudentRoster(playerAvatar) {
  const sections = [];
  const seenSections = new Set();
  const contractSchedule = playerAvatar?.contractSchedule || {};

  sections.push({
    key: 'homeroom',
    label: 'Homeroom | HR-01 | Period HR',
    sectionCode: 'HR-01',
    gradeLabel: '9th-12th',
    courseName: 'Homeroom & Attendance',
    courseLevel: 'Standard',
    courseNumber: 'HR-01',
    blockLabel: 'HR',
    maxStudents: 24
  });

  Object.entries(contractSchedule).forEach(([periodLetter, slot]) => {
    if (!slot || slot.isPrep) return;
    const sectionKey = `${periodLetter}|${slot.name}|${slot.sec || ''}`;
    if (seenSections.has(sectionKey)) return;
    seenSections.add(sectionKey);
    sections.push({
      key: sectionKey,
      label: `${slot.name} | ${slot.sec || 'Sec #000'} | ${formatPeriodLabel(periodLetter)}`,
      sectionCode: slot.sec || 'Sec #000',
      gradeLabel: slot.grade || '9th',
      courseName: slot.name,
      courseLevel: slot.level || 'Standard',
      courseNumber: slot.sec || 'Sec #000',
      blockLabel: String(periodLetter || '').toUpperCase(),
      maxStudents: 24
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

function buildHighSchedulePreferences(facultyRoster) {
  if (!facultyRoster || typeof facultyRoster !== 'object') {
    return { preferredPrepCount: 2 };
  }

  const allStaff = Object.values(facultyRoster).flatMap((members) => (Array.isArray(members) ? members : []));
  const playerRecord = allStaff.find((member) => member?.isPlayer);
  const playerPrepCount = Object.values(playerRecord?.contractSchedule || {}).filter((slot) => slot?.isPrep).length;

  return {
    preferredPrepCount: Number.isFinite(playerPrepCount) ? clamp(playerPrepCount, 0, 3) : 2
  };
}

function buildHighWeeklyRowsFromTokens(tokens, lunchWave) {
  const buildDayPeriodSequence = (sequence) => {
    return Array.isArray(sequence) ? sequence : Array(10).fill('A');
  };

  const lunchByDay = HIGH_LUNCH_WAVE_DAY_TIMES[lunchWave] || HIGH_LUNCH_WAVE_DAY_TIMES['Wave 1'];
  const fallbackToken = buildHighScheduleFallbackToken(tokens);
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
      const token = tokens[periodLabel] || fallbackToken;
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

function buildHighProfileSchedule(staff, random, coverageEntry, schedulePreferences = {}) {
  const lunchWave = coverageEntry?.lunchWave || staff?.contractLunchWave || pickWithSeed(['Wave 1', 'Wave 2', 'Wave 3', 'Wave 4'], random);
  const sectionBase = 100 + Math.floor(random() * 800);

  if (staff?.isPlayer && staff?.contractScheduleVersion >= 4 && Array.isArray(staff?.contractWeeklyRows)) {
    const lunchByDay = staff?.contractLunchByDay || {};
    const upgradedRows = staff.contractWeeklyRows.map((row) => {
      const entries = WEEK_DAYS.map((day, dayIdx) => {
        const token = row?.entries?.[dayIdx];
        if (!token) return buildSpecialEntry('Teacher Prep / Study Hall', 'prep');

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
      if (!token) return buildSpecialEntry('Teacher Prep / Study Hall', 'prep');
      if (token.isPrep) return buildSpecialEntry(token.name || 'Teacher Prep / Study Hall', 'prep');
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
  const courseSequence = buildHighCourseSequence(staff, coverageEntry, random);
  const levelSequence = buildHighLevelSequence(courseSequence, random);

  const preferredPrepCount = clamp(Number(schedulePreferences?.preferredPrepCount ?? 2), 0, 3);
  const prepRoll = random();
  let prepCount = preferredPrepCount;

  if (preferredPrepCount === 0) {
    prepCount = prepRoll < 0.65 ? 0 : 1;
  } else if (preferredPrepCount === 1) {
    prepCount = prepRoll < 0.2 ? 0 : prepRoll < 0.8 ? 1 : 2;
  } else if (preferredPrepCount === 2) {
    prepCount = prepRoll < 0.2 ? 1 : prepRoll < 0.8 ? 2 : 3;
  } else {
    prepCount = prepRoll < 0.35 ? 2 : 3;
  }

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
    lunchByDay = staff?.contractLunchByDay || HIGH_LUNCH_WAVE_DAY_TIMES[lunchWave] || HIGH_LUNCH_WAVE_DAY_TIMES['Wave 1'];
    rows = buildHighProfileSchedule(staff, random, highCoverageMap[staffKey], highSchedulePreferences);
  }

  return { academicYear, rows, lunchWave, lunchByDay };
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

function StudentCard({ student, onOpen }) {
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
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
          {student.name}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#39FF14', letterSpacing: '0.3px', textTransform: 'uppercase' }}>
          {student.className}
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

export default function SchoolDirectoryStep({ schoolType, playerAvatar, playerDepartment, playerGrade, onProceed, onBack, onSaveGame, styles }) {
  const [viewMode, setViewMode] = useState('staff');
  const [activeTab, setActiveTab] = useState('administration');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [liveProfile, setLiveProfile] = useState(null);
  const [selectedStaffSchedule, setSelectedStaffSchedule] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [studentActiveTab, setStudentActiveTab] = useState('homeroom');
  const tabScrollRef = useRef(null);
  const dragStateRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });
  const contentScrollRef = useRef(null);
  const studentTabScrollRef = useRef(null);
  const studentDragStateRef = useRef({ dragging: false, lastX: 0, lastTime: 0 });
  const contentDragRef = useRef({ dragging: false, startX: 0, startScrollLeft: 0 });

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
    if (schoolType === 'High') return buildHighStudentRoster(playerAvatar);
    if (schoolType === 'Middle') return buildMiddleStudentRoster(playerDepartment, playerGrade);
    if (schoolType === 'Elementary') return buildElementaryStudentRoster(playerDepartment, playerGrade);
    return {};
  }, [schoolType, playerAvatar, playerDepartment, playerGrade]);

  const studentTabKeys = useMemo(() => Object.keys(studentRoster), [studentRoster]);
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

  useEffect(() => {
    if (!studentTabScrollRef.current || studentTabKeys.length === 0) return;
    const frameId = window.requestAnimationFrame(() => {
      const fallbackKey = studentTabKeys[0];
      const currentKey = studentTabKeys.includes(studentActiveTab) ? studentActiveTab : fallbackKey;
      const targetNode = studentTabScrollRef.current?.querySelector(`[data-student-tab-key="${currentKey}"]`);
      if (!targetNode) return;
      const centeredOffset = targetNode.offsetLeft - Math.max((studentTabScrollRef.current.clientWidth - targetNode.offsetWidth) / 2, 0);
      studentTabScrollRef.current.scrollTo({ left: centeredOffset, behavior: 'auto' });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [studentTabKeys, viewMode]);

  const currentTabStaff = facultyRoster[activeTab] || [];
  const currentTabStudents = studentRoster[studentActiveTab] || [];

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

  const beginStudentTabDrag = (clientX) => {
    if (!studentTabScrollRef.current) return;
    studentDragStateRef.current = {
      dragging: true,
      lastX: clientX,
      lastTime: Date.now()
    };
  };

  const moveStudentTabDrag = (clientX) => {
    if (!studentDragStateRef.current.dragging || !studentTabScrollRef.current) return;
    const now = Date.now();
    const deltaX = clientX - studentDragStateRef.current.lastX;
    const deltaTime = Math.max(now - studentDragStateRef.current.lastTime, 16);
    const pointerSpeed = Math.abs(deltaX) / deltaTime;
    const speedMultiplier = clamp(1 + (pointerSpeed * 0.9), 1, 2.35);

    studentTabScrollRef.current.scrollLeft -= deltaX * speedMultiplier;
    studentDragStateRef.current.lastX = clientX;
    studentDragStateRef.current.lastTime = now;
  };

  const endStudentTabDrag = () => {
    studentDragStateRef.current.dragging = false;
  };

  const syncStudentActiveTabFromScroll = () => {
    if (!studentTabScrollRef.current || studentTabKeys.length === 0) return;
    const tabNodes = Array.from(studentTabScrollRef.current.children);
    if (tabNodes.length === 0) return;

    const centerX = studentTabScrollRef.current.scrollLeft + (studentTabScrollRef.current.clientWidth / 2);
    const nearestNode = tabNodes.reduce((nearest, node) => {
      const nodeCenter = node.offsetLeft + (node.offsetWidth / 2);
      if (!nearest) return { node, distance: Math.abs(nodeCenter - centerX) };
      const distance = Math.abs(nodeCenter - centerX);
      return distance < nearest.distance ? { node, distance } : nearest;
    }, null);

    const nextKey = nearestNode?.node?.dataset?.studentTabKey;
    if (nextKey && nextKey !== studentActiveTab) {
      setStudentActiveTab(nextKey);
    }
  };

  const handleStudentTabWheel = (event) => {
    if (!studentTabScrollRef.current) return;
    const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    if (delta === 0) return;
    event.preventDefault();
    studentTabScrollRef.current.scrollLeft += delta;
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
      setLiveProfile(selectedStaff.profile || null);
      setSelectedStaffSchedule(generateLockedStaffSchedule(selectedStaff, schoolType, highDepartmentCoverage, highSchedulePreferences));
      setShowSchedule(false);
    }
  }, [selectedStaff, schoolType, highDepartmentCoverage, highSchedulePreferences]);

  const handleOpenStaff = (staff) => {
    setSelectedStaff(staff);
  };

  const handleOpenStudent = (student) => {
    setSelectedStudent(student);
  };

  const handleProceed = () => {
    onProceed({ roster: facultyRoster, studentRoster });
  };

  const renderLunchWaveMatrix = () => (
    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#151515', borderRadius: '4px', border: '1px solid #2a2a2a', fontSize: '0.8rem', color: '#ddd', textAlign: 'left' }}>
      <strong style={{ color: '#39FF14' }}>Lunch Waves (All Options):</strong>
      <div style={{ marginTop: '6px', display: 'grid', gridTemplateColumns: '120px repeat(5, minmax(0, 1fr))', gap: '6px', alignItems: 'stretch' }}>
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
              justifyContent: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              paddingBottom: '6px',
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
            ref={studentTabScrollRef}
            onScroll={syncStudentActiveTabFromScroll}
            onWheel={handleStudentTabWheel}
            onMouseDown={(event) => beginStudentTabDrag(event.clientX)}
            onMouseMove={(event) => moveStudentTabDrag(event.clientX)}
            onMouseUp={endStudentTabDrag}
            onMouseLeave={endStudentTabDrag}
            onTouchStart={(event) => beginStudentTabDrag(event.touches[0]?.clientX || 0)}
            onTouchMove={(event) => moveStudentTabDrag(event.touches[0]?.clientX || 0)}
            onTouchEnd={endStudentTabDrag}
            style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', marginBottom: '10px', padding: '4px 10px 12px', overflowX: 'auto', overflowY: 'hidden', scrollSnapType: 'x mandatory', userSelect: 'none', cursor: studentDragStateRef.current.dragging ? 'grabbing' : 'grab', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {studentTabKeys.map((tabKey) => (
              <div
                key={tabKey}
                data-student-tab-key={tabKey}
                style={{
                  flex: '0 0 min(280px, 78vw)',
                  minHeight: '78px',
                  padding: '12px 16px',
                  fontSize: '0.78rem',
                  backgroundColor: studentActiveTab === tabKey ? '#f5f1dd' : '#121212',
                  color: studentActiveTab === tabKey ? '#111' : '#fff',
                  border: `1px solid ${studentActiveTab === tabKey ? '#f5f1dd' : '#39FF14'}`,
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  whiteSpace: 'normal',
                  scrollSnapAlign: 'center',
                  boxShadow: studentActiveTab === tabKey ? '0 0 18px rgba(245, 241, 221, 0.18)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ color: studentActiveTab === tabKey ? '#333' : '#9acb92', fontSize: '0.7rem' }}>SCROLL TO SELECT</div>
                <div>{studentSectionMap[tabKey]?.label?.toUpperCase() || (tabKey === 'homeroom' ? 'HOMEROOM' : tabKey.toUpperCase())}</div>
                <div style={{ color: studentActiveTab === tabKey ? '#111' : '#39FF14' }}>{studentSectionMap[tabKey]?.count || 0} STUDENTS</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '18px', color: '#9acb92', fontSize: '0.76rem', letterSpacing: '0.5px', textAlign: 'center' }}>
            CLICK AND DRAG LEFT OR RIGHT TO SWITCH BETWEEN HOMEROOM AND CLASS ROSTERS.
          </div>

          <div
            ref={contentScrollRef}
            style={{ backgroundColor: '#111', border: '1px solid #39FF14', borderRadius: '6px', padding: '24px', minHeight: '280px', maxHeight: '430px', display: 'flex', flexWrap: 'wrap', gap: '16px', overflowY: 'auto', overflowX: 'hidden', justifyContent: 'center', alignContent: 'flex-start', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {currentTabStudents.length > 0 ? (
              currentTabStudents.map((student) => (
                <StudentCard key={student.id} student={student} onOpen={handleOpenStudent} />
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
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.78)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 60, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: showSchedule ? '1140px' : '760px', backgroundColor: '#111', border: '2px solid #39FF14', borderRadius: '8px', padding: showSchedule ? '24px' : '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: '#39FF14', letterSpacing: '1px' }}>{selectedStaff.name.toUpperCase()} {showSchedule ? 'CONTRACT SCREEN' : 'PROFILE'}</h3>
              <button style={styles.backButton} onClick={() => (showSchedule ? setShowSchedule(false) : setSelectedStaff(null))}>{showSchedule ? 'BACK TO PROFILE' : 'CLOSE'}</button>
            </div>

            {showSchedule && selectedStaffSchedule ? (
              <div style={{ ...styles.setupBox, maxWidth: '100%', minHeight: 'unset', padding: '20px', justifyContent: 'flex-start', backgroundColor: '#111' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <p style={{ margin: 0, color: '#39FF14', fontWeight: 'bold', letterSpacing: '0.5px' }}>CONTRACT SCHEDULE PREVIEW</p>
                  <span style={{ color: '#9acb92', fontSize: '0.76rem' }}>School Year {selectedStaffSchedule.academicYear} (Locked)</span>
                </div>

                {selectedStaffSchedule.lunchWave && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
                    <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem', color: '#fff' }}>
                      Lunch Assignment: <strong style={{ color: '#ffa500' }}>{selectedStaffSchedule.lunchWave}</strong>
                    </div>
                  </div>
                )}

                <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '6px', padding: '8px 10px', marginBottom: '10px', color: '#ddd', fontSize: '0.78rem' }}>
                  <strong style={{ color: '#39FF14' }}>Role:</strong> {simplifyTeacherRoleLabel(selectedStaff.role, schoolType)} | <strong style={{ color: '#39FF14' }}>School:</strong> {schoolType}
                </div>

                <div style={{ border: '1px solid #2a2a2a', borderRadius: '6px', flex: 1, minHeight: '420px', backgroundColor: '#111' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.86rem', textAlign: 'center' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #39FF14' }}>
                        <th style={{ padding: '10px 8px', color: '#39FF14', minWidth: '190px' }}>BLOCK / TIME</th>
                        {WEEK_DAYS.map((day) => (
                          <th key={day} style={{ padding: '10px 8px', color: '#39FF14', minWidth: '170px' }}>{day.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStaffSchedule.rows.map((row, idx) => (
                        <tr key={`${row.block}-${idx}`} style={{ borderBottom: '1px solid #232323' }}>
                          <td style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                            <div style={{ fontWeight: 'bold', color: row.block === 'Homeroom' ? '#00FFFF' : '#39FF14' }}>{row.block}</div>
                            <div style={{ color: '#9a9a9a', fontSize: '0.72rem' }}>{row.time}</div>
                          </td>
                          {(row.entries || WEEK_DAYS.map(() => '')).map((entry, entryIdx) => {
                            const normalized = entry && typeof entry === 'object' ? entry : buildSpecialEntry(String(entry || 'Teacher Coverage Block'), 'support');

                            const primaryColor = getEntryColor(normalized);
                            const showClassMeta = normalized.kind === 'class' && (normalized.level || normalized.sec);
                            const showLunchTag = normalized.kind === 'lunch';
                            const showDetail = Boolean(normalized.detail);
                            const isDoubleContinuation = Boolean(normalized.isDoubleContinuation);

                            return (
                              <td key={`${row.block}-${entryIdx}`} style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle', backgroundColor: isDoubleContinuation ? '#161616' : 'transparent' }}>
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
                                    {isDoubleContinuation ? ' | Continuation' : ''}
                                  </div>
                                )}

                                {isDoubleContinuation && !showDetail && (
                                  <div style={{ fontSize: '0.7rem', marginTop: '4px', color: '#b6d9b1' }}>
                                    Double Block Continuation
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

                {selectedStaffSchedule.lunchByDay && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))', gap: '8px', marginTop: '12px' }}>
                    {WEEK_DAYS.map((day) => (
                      <div key={day} style={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '4px', padding: '8px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#39FF14', fontWeight: 'bold' }}>{day}</div>
                        <div style={{ fontSize: '0.72rem', color: '#ffa500', marginTop: '2px' }}>{selectedStaffSchedule.lunchByDay[day]}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '10px', padding: '8px 10px', backgroundColor: '#1a1a1a', borderRadius: '6px', border: '1px solid #2a2a2a', fontSize: '0.76rem', color: '#8f8f8f', textAlign: 'center' }}>
                  Weekly contract matrix stays fully covered Monday-Friday, mirrors the player contract format, and keeps randomized prep blocks within the school-wide high school pattern.
                </div>

                {schoolType === 'High' && renderLunchWaveMatrix()}

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

                <p style={{ margin: '14px 0 0', color: '#888', fontSize: '0.82rem' }}>
                  Profile vitals stay locked in this directory preview until you enter the world map.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.78)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 60, padding: '20px' }}>
          <div style={{ width: '100%', maxWidth: '760px', backgroundColor: '#111', border: '2px solid #39FF14', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, color: '#39FF14', letterSpacing: '1px' }}>{selectedStudent.name.toUpperCase()} PROFILE</h3>
              <button style={styles.backButton} onClick={() => setSelectedStudent(null)}>CLOSE</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PixelAvatar appearance={selectedStudent.appearance || selectedStudent} size="small" direction="Front" motion={{ blink: false, mouthShift: 0, armSwing: 0, footShift: 0, browShift: 0, hairX: 0, hairY: 0 }} />
              </div>

              <div style={{ backgroundColor: '#161616', border: '1px solid #2f2f2f', borderRadius: '6px', padding: '14px' }}>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Grade:</strong> {selectedStudent.grade}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Age:</strong> {selectedStudent.age}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Class:</strong> {selectedStudent.className}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Class Grade:</strong> {selectedStudent.classGrade}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Course Number:</strong> {selectedStudent.courseNumber}</p>
                <p style={{ margin: '0 0 6px', color: '#fff' }}><strong>Period:</strong> {formatPeriodLabel(selectedStudent.blockLabel).replace('Period Period', 'Period')}</p>
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
          </div>
        </div>
      )}
    </div>
  );
}