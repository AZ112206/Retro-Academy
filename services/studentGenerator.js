// Base Archetypes that form the AI routing logic
const ARCHETYPES = ['Overachiever', 'Class Clown', 'Slacker', 'Anxious Prodigy', 'Rebel', 'Average Joe'];

// AI Name Construction Arrays
const PHONEMES_FIRST = ['Al', 'Sam', 'Jor', 'Tay', 'Mor', 'Cas', 'Jam', 'Ri', 'Sky', 'Cam', 'Chr', 'Pa', 'Zei', 'Xav', 'Kael', 'Brix'];
const PHONEMES_MID = ['ex', 'an', 'dan', 'lor', 'gan', 'ey', 'ie', 'ley', 'ler', 'er', 'is', 'tian', 'en', 'o', 'a'];
const LAST_NAMES = ['Smith', 'Johnson', 'Rodriguez', 'Chen', 'Davis', 'Kim', 'Garcia', 'Wilson', 'Thomas', 'Martinez', 'Onyekwere', 'Abe', 'Havel'];

// AI Narrative Generation Pools (The AI combines these based on Archetype weightings)
const BACKSTORY_COMPONENTS = {
  academicDrive: ['obsessed with perfect marks', 'doing just enough to pass', 'actively boycotting standard grading scales', 'struggling to stay awake due to late-night gaming'],
  secretHabit: ['secretly runs a multi-million view meme account', 'drinks four iced lattes before 8 AM', 'carries a lucky pocket calculator', 'can recite the entire periodic table backwards'],
  campusRep: ['respected by all faculty', 'banned from the chemistry lab for "incidents"', 'frequently found hiding in the library stacks', 'voted most likely to sleep through graduation']
};

const HAIR_STYLES = ['Messy Bedhead', 'Neat Side-Part', 'Buzzcut', 'Long Waves', 'High Ponytail', 'Curly Afro', 'Spiky Retro Gel', 'Curtain Bangs'];
const HAIR_COLORS = ['Neon Pink', 'Jet Black', 'Bleach Blonde', 'Auburn', 'Emerald Green', 'Chestnut Brown', 'Silver-Grey'];
const CLOTHING_STYLES = ['Oversized Vintage Hoodie', 'Thrifted Corduroy Jacket', 'Preppy Blazer & Tie', 'Graphic Band Tee', 'Denim Vest with Patches', 'Plain Turtleneck Sweater'];
const ACCESSORIES = ['Thick Rimmed Glasses', 'Wireless Headphones Hanging on Neck', 'Beanie Pulled Low', 'Dangle Earrings', 'Stack of Friendship Bracelets', 'None'];
const EXPRESSIONS = ['Slightly Bored', 'Laser Focused', 'Daydreaming Out the Window', 'Smug Smirk', 'Nervous Sweat-Drop', 'Yawning'];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Procedural Language AI: Assembles a completely unique name using syllable blending
 */
const aiGenerateName = () => {
  const first = getRandom(PHONEMES_FIRST) + getRandom(PHONEMES_MID);
  const last = getRandom(LAST_NAMES);
  return `${first} ${last}`;
};

/**
 * Core AI Generation Logic
 */
export const generateStudent = () => {
  const archetype = getRandom(ARCHETYPES);
  const name = aiGenerateName();

  // AI sets baseline stats dynamically based on the chosen archetype
  let baseGrades = 75, baseBehavior = 75;
  if (archetype === 'Overachiever') { baseGrades = 95; baseBehavior = 95; }
  else if (archetype === 'Slacker') { baseGrades = 50; baseBehavior = 55; }
  else if (archetype === 'Class Clown') { baseGrades = 68; baseBehavior = 45; }
  else if (archetype === 'Rebel') { baseGrades = 60; baseBehavior = 35; }
  else if (archetype === 'Anxious Prodigy') { baseGrades = 98; baseBehavior = 80; }

  const grades = Math.max(0, Math.min(100, baseGrades + Math.floor(Math.random() * 16 - 8)));
  const behavior = Math.max(0, Math.min(100, baseBehavior + Math.floor(Math.random() * 20 - 10)));

  // AI Generates a unique semantic backstory sentence
  const dynamicBio = `${name} is an ${archetype} who is ${getRandom(BACKSTORY_COMPONENTS.academicDrive)}. They are ${getRandom(BACKSTORY_COMPONENTS.secretHabit)} and are ${getRandom(BACKSTORY_COMPONENTS.campusRep)}.`;

  return {
    id: crypto.randomUUID(),
    name,
    trait: archetype,
    bio: dynamicBio,
    grades,
    behavior,
    attendance: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
    appearance: {
      hairStyle: getRandom(HAIR_STYLES),
      hairColor: getRandom(HAIR_COLORS),
      clothing: getRandom(CLOTHING_STYLES),
      accessory: getRandom(ACCESSORIES),
      expression: getRandom(EXPRESSIONS)
    }
  };
};

export const generateRoster = (size = 15) => {
  return Array.from({ length: size }, generateStudent);
};