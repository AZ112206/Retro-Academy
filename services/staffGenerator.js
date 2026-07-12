const MALE_FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Marcus', 'David', 'Arthur', 'Parker', 'Casey', 'Quinn', 'Cameron'];
const FEMALE_FIRST_NAMES = ['Avery', 'Riley', 'Maya', 'Elena', 'Chloe', 'Sarah', 'Morgan', 'Casey', 'Reese', 'Quinn'];

const LAST_NAMES_BY_TONE_GROUP = {
  dark: ['Johnson', 'Brown', 'Washington', 'Brooks', 'Carter', 'Jackson'],
  warm: ['Garcia', 'Martinez', 'Rivera', 'Lopez', 'Ramirez', 'Santos'],
  light: ['Miller', 'Bennett', 'Harris', 'Walker', 'Foster', 'Baker'],
  golden: ['Kim', 'Patel', 'Chen', 'Singh', 'Nguyen', 'Park'],
  olive: ['Haddad', 'Nasser', 'Rahman', 'Malik', 'Farah', 'Sayeed'],
  mixed: ['Reed', 'Ellis', 'Monroe', 'Bailey', 'Hayes', 'Perry']
};

const SKIN_TONES_BY_GROUP = {
  dark: ['#8B5A3C', '#6F432B', '#55301F'],
  warm: ['#D39A73', '#B97D57', '#9A6142'],
  light: ['#F3D9C7', '#EBC4AF', '#D9AA8D'],
  golden: ['#F0D2B3', '#D9B089', '#C28F69'],
  olive: ['#D7AC7E', '#BE8C5E', '#9A6945'],
  mixed: ['#E3BF9D', '#C68F69', '#8C5D40']
};

const HAIR_STYLES = ['Side Part', 'Crop', 'Waves', 'Slick Back', 'Ponytail', 'Bun', 'Braids', 'Fade'];
const HAIR_COLORS = ['#20140F', '#4A3728', '#6D4C41', '#8E6B3F', '#0A0A0A'];
const SKIN_TONES = Object.values(SKIN_TONES_BY_GROUP).flat();
const EYE_COLORS = ['#201A17', '#4B3428', '#2A5B8A', '#3A7D44', '#6B6F72'];
const FACE_SHAPES = ['Oval', 'Round', 'Square', 'Heart'];
const LIP_COLORS = ['#542423', '#8B3A62', '#B85C7D', '#D8788A'];
const WARDROBE_COLORS = ['#1F3A5F', '#2D6A4F', '#7A3E2B', '#5B3F8C', '#6E4B2A', '#3C3C3C', '#9A2D2D', '#E8E1D4', '#F7F7F7', '#7F8C8D', '#0A0A0A'];
const SHOE_COLORS = ['#111111', '#3C3C3C', '#5B3F2A', '#E8E1D4', '#F7F7F7', '#7F8C8D'];
const HIGH_DEPARTMENTS = ['Math', 'Science', 'History', 'English', 'Foreign Language'];
const BIRTH_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const ROLE_PATHS = {
  principal: ['Assistant Principal', 'Dean', 'Department Head', 'Lead Teacher'],
  'assistant principal': ['Dean', 'Counselor', 'Department Head', 'Teacher'],
  dean: ['Counselor', 'Department Head', 'Teacher', 'Program Coordinator'],
  counselor: ['Advising Assistant', 'Student Support Specialist', 'Guidance Intern', 'Family Liaison'],
  nurse: ['Clinic Assistant', 'Health Coordinator', 'School Health Aide', 'Wellness Specialist'],
  librarian: ['Library Assistant', 'Media Specialist', 'Archive Technician', 'Literacy Coach'],
  cafeteria: ['Cafeteria Assistant', 'Food Service Lead', 'Kitchen Prep Lead', 'Meal Program Coordinator'],
  custodian: ['Facilities Assistant', 'Maintenance Tech', 'Campus Operations Aide', 'Building Support Technician'],
  'pe teacher': ['Athletics Assistant', 'Coach', 'Fitness Instructor', 'Recreation Program Aide'],
  teacher: ['Student Teacher', 'Teaching Assistant', 'Intervention Instructor', 'Substitute Teacher'],
  specialist: ['Program Specialist', 'Instructional Aide', 'Curriculum Assistant', 'Lab Assistant']
};

function deriveRoleCategory(role) {
  const lower = role.toLowerCase();
  if (lower.includes('assistant principal')) return 'assistant principal';
  if (lower.includes('principal')) return 'principal';
  if (lower.includes('dean')) return 'dean';
  if (lower.includes('counselor')) return 'counselor';
  if (lower.includes('nurse')) return 'nurse';
  if (lower.includes('librarian')) return 'librarian';
  if (lower.includes('cafeteria')) return 'cafeteria';
  if (lower.includes('custodian')) return 'custodian';
  if (lower.includes('pe teacher')) return 'pe teacher';
  if (lower.includes('specialist')) return 'specialist';
  if (lower.includes('teacher')) return 'teacher';
  return 'teacher';
}

function buildWorkExperience(role, yearsTeaching) {
  const category = deriveRoleCategory(role);
  const path = ROLE_PATHS[category] || ROLE_PATHS.teacher;
  const count = yearsTeaching >= 10 ? randomInt(2, 3) : randomInt(1, 2);

  const shuffled = [...path].sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((position) => ({
    position,
    years: randomInt(1, Math.max(1, Math.min(6, yearsTeaching)))
  }));
}

function getToneGroupFromSkinTone(skinTone) {
  const entry = Object.entries(SKIN_TONES_BY_GROUP).find(([, tones]) => tones.includes(skinTone));
  return entry ? entry[0] : 'mixed';
}

function buildIdentity(overrides = {}) {
  const gender = overrides.gender || (Math.random() > 0.5 ? 'Male' : 'Female');
  const skinTone = overrides.skinTone || pick(SKIN_TONES);
  const toneGroup = getToneGroupFromSkinTone(skinTone);
  const firstName = overrides.firstName || pick(gender === 'Male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES);
  const lastName = overrides.lastName || pick(LAST_NAMES_BY_TONE_GROUP[toneGroup] || LAST_NAMES_BY_TONE_GROUP.mixed);

  return { gender, skinTone, firstName, lastName, toneGroup };
}

function buildProfileSnapshot(role) {
  const age = randomInt(24, 67);
  const yearsTeaching = randomInt(1, Math.max(1, age - 22));
  const birthYear = new Date().getFullYear() - age;
  const birthday = `${pick(BIRTH_MONTHS)} ${randomInt(1, 28)}, ${birthYear}`;
  const previousPositions = buildWorkExperience(role, yearsTeaching);

  return {
    age,
    occupation: role,
    yearsTeaching,
    birthday,
    previousPositions,
    vitals: {
      health: randomInt(60, 100),
      stress: randomInt(20, 85),
      energy: randomInt(35, 100),
      morale: randomInt(40, 100),
      focus: randomInt(35, 100)
    },
    personality: {
      strictness: randomInt(25, 100),
      kindness: randomInt(25, 100),
      patience: randomInt(20, 100),
      humor: randomInt(20, 100),
      organization: randomInt(30, 100)
    }
  };
}

function buildAppearance(overrides = {}) {
  return {
    hairStyle: pick(HAIR_STYLES),
    hairColor: pick(HAIR_COLORS),
    skinTone: overrides.skinTone || pick(SKIN_TONES),
    faceShape: pick(FACE_SHAPES),
    eyeColor: pick(EYE_COLORS),
    lipColor: pick(LIP_COLORS),
    topColor: pick(WARDROBE_COLORS),
    bottomColor: pick(WARDROBE_COLORS),
    shoeColor: pick(SHOE_COLORS),
    ...overrides
  };
}

function makeStaff(role, overrides = {}) {
  const identity = buildIdentity(overrides);
  const appearance = buildAppearance({ skinTone: identity.skinTone });
  const generatedProfile = buildProfileSnapshot(role);

  return {
    id: `${role.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Math.random().toString(36).slice(2, 10)}`,
    firstName: identity.firstName,
    lastName: identity.lastName,
    name: `${identity.firstName} ${identity.lastName}`,
    gender: identity.gender,
    role,
    isPlayer: false,
    ...appearance,
    ...overrides
    ,profile: overrides.profile || generatedProfile
  };
}

function makeGenderedStaff(role, gender, overrides = {}) {
  return makeStaff(role, { gender, ...overrides });
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

  const baseProfile = buildProfileSnapshot(fallbackRole);

  return {
    name: playerName,
    role: fallbackRole,
    isPlayer: true,
    ...buildAppearance(),
    ...playerAvatar,
    name: playerName,
    profile: playerAvatar?.profile || baseProfile
  };
}

function buildElementarySpecialists() {
  const peGender = Math.random() > 0.5 ? 'Male' : 'Female';
  return [
    makeStaff('Specialist - Librarian Teacher'),
    makeGenderedStaff('Specialist - PE Teacher', peGender),
    makeStaff('Specialist - Music Teacher'),
    makeStaff('Specialist - Art Teacher'),
    makeStaff('Specialist - Health Teacher')
  ];
}

function buildMiddleSpecialists() {
  return [
    makeStaff('Specialist - Librarian Teacher'),
    makeStaff('Specialist - Art Teacher'),
    makeGenderedStaff('Specialist - PE Teacher', 'Male'),
    makeGenderedStaff('Specialist - PE Teacher', 'Female'),
    makeStaff('Specialist - Technology and Engineering Teacher'),
    makeStaff('Specialist - Music Teacher')
  ];
}

function buildElementaryRoster(playerAvatar, playerGrade) {
  const gradeLabel = normalizeElementaryGradeLabel(playerGrade);

  const administration = [
    makeStaff('Principal'),
    makeStaff('Assistant Principal')
  ];

  const nurses = [makeStaff('Nurse')];
  const counselors = [makeStaff('Counselor')];
  const cafeteriaWorkers = repeatStaff(5, 'Cafeteria Worker');
  const custodians = repeatStaff(1, 'Custodian');

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
  const gradeKey = gradeLabel === 'Kindergarten' ? 'kindergarten' : `grade_${String(playerGrade)}`;
  const specialists = buildElementarySpecialists();

  return {
    administration,
    counselors,
    nurses,
    [gradeKey]: teachers,
    specialists,
    cafeteria_workers: cafeteriaWorkers,
    custodians
  };
}

function buildMiddleRoster(playerAvatar, playerGrade) {
  const gradeLabel = playerGrade ? `Grade ${playerGrade}` : 'Middle Grade';

  const administration = [
    makeStaff('Principal'),
    makeStaff('Assistant Principal')
  ];

  const nurses = repeatStaff(2, 'Nurse');
  const counselors = [
    makeStaff('Counselor - 6th Grade'),
    makeStaff('Counselor - 7th Grade'),
    makeStaff('Counselor - 8th Grade')
  ];
  const cafeteriaWorkers = repeatStaff(10, 'Cafeteria Worker');
  const custodians = repeatStaff(3, 'Custodian');

  const coreTeachers = [
    buildPlayerStaffCard(playerAvatar, `${gradeLabel} Math Teacher`),
    makeStaff(`${gradeLabel} ELA Teacher`),
    makeStaff(`${gradeLabel} Science Teacher`),
    makeStaff(`${gradeLabel} Social Studies Teacher`),
    makeStaff(`${gradeLabel} PE Teacher`)
  ];

  const specialistTeachers = buildMiddleSpecialists();

  const gradeKey = playerGrade ? `grade_${String(playerGrade)}` : 'grade_middle';

  return {
    administration,
    counselors,
    nurses,
    [gradeKey]: coreTeachers,
    specialists: specialistTeachers,
    cafeteria_workers: cafeteriaWorkers,
    custodians
  };
}

function buildHighRoster(playerAvatar, playerDepartment) {
  const selectedDepartment = (playerDepartment || 'Math').replace(/ Dept$/i, '').trim();

  const administration = [
    makeStaff('Principal'),
    makeStaff('Assistant Principal'),
    makeStaff('Dean - 9th Grade'),
    makeStaff('Dean - 10th Grade'),
    makeStaff('Dean - 11th Grade'),
    makeStaff('Dean - 12th Grade')
  ];

  const counselors = [
    makeStaff('Counselor - A-E'),
    makeStaff('Counselor - F-J'),
    makeStaff('Counselor - K-O'),
    makeStaff('Counselor - P-T'),
    makeStaff('Counselor - U-Z')
  ];
  const cafeteriaWorkers = repeatStaff(15, 'Cafeteria Worker');
  const custodians = repeatStaff(6, 'Custodian');

  const departmentTabs = HIGH_DEPARTMENTS.reduce((tabs, department) => {
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

    const key = `department_${department.toLowerCase().replace(/\s+/g, '_')}`;
    tabs[key] = team;
    return tabs;
  }, {});

  const electiveTeachers = [
    makeStaff('Elective Teacher - Art'),
    makeStaff('Elective Teacher - Music'),
    makeStaff('Elective Teacher - Theater'),
    makeStaff('Elective Teacher - Computer Science'),
    makeStaff('Elective Teacher - Business'),
    makeGenderedStaff('Elective Teacher - PE', 'Male'),
    makeGenderedStaff('Elective Teacher - PE', 'Female')
  ];

  return {
    administration,
    counselors,
    ...departmentTabs,
    electives: electiveTeachers,
    cafeteria_workers: cafeteriaWorkers,
    custodians
  };
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
    counselors: [makeStaff('Counselor')],
    assigned: [buildPlayerStaffCard(playerAvatar, 'Assigned Teacher')]
  };
}
