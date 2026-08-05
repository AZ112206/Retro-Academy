// Elementary School Tour Layout & Zone Definitions

export const SCHOOL_ZONES = {
  SAFETY_VESTIBULE: {
    name: 'South Entrance & Safety Vestibule',
    bounds: { x: 22, y: 28, width: 16, height: 6 },
    features: ['Double Safety Doors', 'Security Checkpoint']
  },
  ADMIN_SUITE_LEFT: {
    name: 'Admin Suite (Principal & AP)',
    bounds: { x: 4, y: 16, width: 16, height: 11 },
    rooms: ["Principal Office", "Assistant Principal Office"]
  },
  ADMIN_SUITE_RIGHT: {
    name: 'Support Suite (Nurse & Counselor)',
    bounds: { x: 40, y: 16, width: 16, height: 11 },
    rooms: ["Nurse's Office", "Guidance Counselor Office"]
  },
  CENTRAL_GLASS_CORRIDOR: {
    name: 'Main Lobby & Glass Window View',
    bounds: { x: 20, y: 16, width: 20, height: 11 },
    features: ['Interior Glass Window Wall']
  },
  CAFETORIUM_WING: {
    name: 'Cafetorium & Multi-Purpose (Left)',
    bounds: { x: 2, y: 2, width: 24, height: 13 },
    features: ['Double-Double Doors', 'Cafeteria', 'Gymnasium', 'Stage']
  },
  UPPER_ELEMENTARY_WING: {
    name: 'Grades 3-5 Academic Wing (Right)',
    bounds: { x: 34, y: 2, width: 24, height: 13 },
    features: ['Single Entry Door', 'Grade 3 Classrooms', 'Grade 4 Classrooms', 'Grade 5 Science Labs']
  }
};