// Elementary School World Layout & Zone Definitions

export const SCHOOL_ZONES = {
  LOBBY_ADMIN: {
    name: 'Main Lobby & Administration',
    bounds: { x: 0, y: 0, width: 20, height: 10 },
    rooms: ['Principal Office', 'Assistant Principal Office', 'Nurse Office', 'Main Entrance']
  },
  KINDERGARTEN_POD: {
    name: 'Kindergarten Pod (Double Size)',
    bounds: { x: 21, y: 0, width: 18, height: 10 },
    features: ['Private Restroom', 'Sink Area', 'Story Circle'],
    rooms: ['Kindergarten Homeroom A', 'Kindergarten Homeroom B']
  },
  PRIMARY_WING: {
    name: 'Primary Wing (Grades 1 & 2)',
    bounds: { x: 0, y: 11, width: 39, height: 8 },
    rooms: [
      'Grade 1 Standard Classrooms (Math & ELA)', 
      'Grade 2 Standard Classrooms (Math & ELA)', 
      'Student Restrooms (M/F)', 
      'Staff Restroom'
    ]
  },
  UPPER_ELEMENTARY_WING: {
    name: 'Upper-Elementary Wing (Grades 3 - 5)',
    bounds: { x: 0, y: 20, width: 39, height: 14 },
    rooms: [
      'Grade 3 Standard Math & ELA Classrooms',
      'Grade 3 Science & Social Studies Lab (1.5x) + Prep Room',
      'Grade 4 Standard Math & ELA Classrooms',
      'Grade 4 Science & Social Studies Lab (1.5x) + Prep Room',
      'Grade 5 Standard Math & ELA Classrooms',
      'Grade 5 Science & Social Studies Lab (1.5x) + Prep Room',
      'Hallway Restrooms & Custodian Closet'
    ]
  },
  SPECIAL_AREAS: {
    name: 'Special Areas & Multi-Purpose',
    bounds: { x: 40, y: 0, width: 20, height: 34 },
    rooms: [
      'Library / Media Center', 
      'Art Studio', 
      'Music Room', 
      'Multi-Purpose Hall (Cafeteria, Gymnasium & Stage)'
    ]
  }
};