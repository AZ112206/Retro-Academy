const FIRST_NAMES = [
  'Avery',
  'Jordan',
  'Riley',
  'Morgan',
  'Taylor',
  'Casey',
  'Cameron',
  'Devon',
  'Emerson',
  'Parker',
  'Quinn',
  'Dakota'
];

const LAST_NAMES = [
  'Johnson',
  'Miller',
  'Garcia',
  'Chen',
  'Patel',
  'Williams',
  'Thomas',
  'Martinez',
  'Bennett',
  'Reed',
  'Foster',
  'Walker'
];

const HAIR_STYLES = ['Side Part', 'Crop', 'Waves', 'Slick Back', 'Ponytail', 'Bun', 'Braids', 'Fade'];
const HAIR_COLORS = ['#20140F', '#4A3728', '#6D4C41', '#8E6B3F', '#0A0A0A'];
const SKIN_TONES = ['#8B5A3C', '#D39A73', '#F3D9C7', '#F0D2B3', '#D7AC7E'];
const EYE_COLORS = ['#201A17', '#4B3428', '#2A5B8A', '#3A7D44', '#6B6F72'];
const FACE_SHAPES = ['Oval', 'Round', 'Square', 'Heart'];
const LIP_COLORS = ['#542423', '#8B3A62', '#B85C7D', '#D8788A'];
const TOP_COLORS = ['#1F3A5F', '#2D6A4F', '#7A3E2B', '#5B3F8C', '#3C3C3C'];
const BOTTOM_COLORS = ['#111111', '#3C3C3C', '#5B3F2A', '#E8E1D4'];
const HIGH_DEPARTMENTS = ['Math', 'Science', 'History', 'English', 'Foreign Language'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function buildAppearance(overrides = {}) {
  return {
    hairStyle: pick(HAIR_STYLES),
    hairColor: pick(HAIR_COLORS),
    skinTone: pick(SKIN_TONES),
    faceShape: pick(FACE_SHAPES),
    eyeColor: pick(EYE_COLORS),
    lipColor: pick(LIP_COLORS),
    topColor: pick(TOP_COLORS),
    bottomColor: pick(BOTTOM_COLORS),
    ...overrides
  };
}

function makeStaff(role, overrides = {}) {
  return {
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    role,
    isPlayer: false,
    ...buildAppearance(),
    ...overrides
  };
}

function repeatStaff(count, role) {
  return Array.from({ length: count }, () => makeStaff(role));
}

function normalizeElementaryGradeLabel(grade) {
  if (grade === null || grade === undefined || grade === '' || grade === 0 || grade === '0' || String(grade).toUpperCase() === 'K') {
    return 'Kindergarten';
  }
  return `Grade ${grade}`;
}

function isUpperElementaryGrade(grade) {
  const value = Number(grade);
  return Number.isFinite(value) && value >= 3 && value <= 5;
}

function buildPlayerStaffCard(playerAvatar, fallbackRole) {
  const playerName = playerAvatar?.firstName && playerAvatar?.lastName
    ? `${playerAvatar.firstName} ${playerAvatar.lastName}`
    : (playerAvatar?.rosterName || playerAvatar?.name || 'Player Teacher');

  return {
    name: playerName,
    role: fallbackRole,
    isPlayer: true,
    ...buildAppearance(),
    ...playerAvatar,
    name: playerName
  };
}

function buildElementaryRoster(playerAvatar, playerGrade) {
  const gradeLabel = normalizeElementaryGradeLabel(playerGrade);

  const administration = [
    makeStaff('Principal'),
    makeStaff('Assistant Principal')
  ];

  const supportStaff = [
    makeStaff('Nurse'),
    makeStaff('Counselor'),
    ...repeatStaff(5, 'Cafeteria Worker'),
    ...repeatStaff(1, 'Custodian')
  ];

  const playerRole = isUpperElementaryGrade(playerGrade)
    ? `${gradeLabel} Math Teacher`
    : `${gradeLabel} Homeroom Teacher`;

  const player = buildPlayerStaffCard(playerAvatar, playerRole);

  let peers;
  if (isUpperElementaryGrade(playerGrade)) {
    peers = [
      makeStaff(`${gradeLabel} ELA Teacher`),
      makeStaff(`${gradeLabel} Science Teacher`)
    ];
  } else {
    peers = [
      makeStaff(`${gradeLabel} Homeroom Teacher`),
      makeStaff(`${gradeLabel} Homeroom Teacher`)
    ];
  }

  const teachers = [player, ...peers];

  return { administration, supportStaff, teachers };
}

function buildMiddleRoster(playerAvatar, playerGrade) {
  const gradeLabel = playerGrade ? `Grade ${playerGrade}` : 'Middle Grade';

  const administration = [
    makeStaff('Principal'),
    makeStaff('Assistant Principal')
  ];

  const supportStaff = [
    ...repeatStaff(2, 'Nurse'),
    ...repeatStaff(3, 'Counselor'),
    ...repeatStaff(10, 'Cafeteria Worker'),
    ...repeatStaff(3, 'Custodian')
  ];

  const coreTeachers = [
    buildPlayerStaffCard(playerAvatar, `${gradeLabel} Math Teacher`),
    makeStaff(`${gradeLabel} ELA Teacher`),
    makeStaff(`${gradeLabel} Science Teacher`),
    makeStaff(`${gradeLabel} Social Studies Teacher`),
    makeStaff(`${gradeLabel} PE Teacher`)
  ];

  const specialistTeachers = [
    makeStaff('Specialist - Art Teacher'),
    makeStaff('Specialist - Music Teacher'),
    makeStaff('Specialist - STEM Teacher'),
    makeStaff('Specialist - World Language Teacher'),
    makeStaff('Specialist - Intervention Teacher')
  ];

  const teachers = [...coreTeachers, ...specialistTeachers];
  return { administration, supportStaff, teachers };
}

function buildHighRoster(playerAvatar, playerDepartment) {
  const selectedDepartment = (playerDepartment || 'Math').replace(/ Dept$/i, '').trim();

  const administration = [
    makeStaff('Principal'),
    makeStaff('Assistant Principal'),
    ...repeatStaff(3, 'Dean')
  ];

  const supportStaff = [
    ...repeatStaff(5, 'Counselor'),
    ...repeatStaff(15, 'Cafeteria Worker'),
    ...repeatStaff(6, 'Custodian')
  ];

  const departmentTeachers = HIGH_DEPARTMENTS.flatMap((department) => {
    const isPlayerDepartment = department.toLowerCase() === selectedDepartment.toLowerCase();

    const team = [
      makeStaff(`${department} Department Head`),
      makeStaff(`${department} Teacher`),
      makeStaff(`${department} Teacher`),
      makeStaff(`${department} Teacher`),
      makeStaff(`${department} Teacher`),
      makeStaff(`${department} Teacher`)
    ];

    if (isPlayerDepartment) {
      team[1] = buildPlayerStaffCard(playerAvatar, `${department} Teacher`);
    }

    return team;
  });

  const electiveTeachers = [
    makeStaff('Elective Teacher - Art'),
    makeStaff('Elective Teacher - Music'),
    makeStaff('Elective Teacher - Theater'),
    makeStaff('Elective Teacher - Computer Science'),
    makeStaff('Elective Teacher - Business'),
    makeStaff('Elective Teacher - PE')
  ];

  const teachers = [...departmentTeachers, ...electiveTeachers];
  return { administration, supportStaff, teachers };
}

export function generateFacultyRoster(schoolType, playerAvatar, playerDepartment, playerGrade) {
  if (schoolType === 'Elementary') {
    return buildElementaryRoster(playerAvatar, playerGrade);
  }

  if (schoolType === 'Middle') {
    return buildMiddleRoster(playerAvatar, playerGrade);
  }

  if (schoolType === 'High') {
    return buildHighRoster(playerAvatar, playerDepartment);
  }

  return {
    administration: [makeStaff('Principal')],
    supportStaff: [makeStaff('Counselor')],
    teachers: [buildPlayerStaffCard(playerAvatar, 'Assigned Teacher')]
  };
}
