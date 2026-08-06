// Floor-plan geometry mirrored from the reference elementary-school blueprint.
// Grid in tile units.

export const GRID = { w: 86, h: 88 };

export const HALLS = [
  { x: 10, y: 10, w: 63, h: 3 },   // north corridor below the top classroom band
  { x: 11, y: 34, w: 62, h: 4 },   // main horizontal corridor
  { x: 11, y: 22, w: 3, h: 64 },   // left vertical hallway
  { x: 70, y: 33, w: 3, h: 53 },   // right vertical hallway
  { x: 23, y: 31, w: 15, h: 3 },   // left-side connector hall into the center spine
];

export const ROOMS = [
  // ===== NORTH BAND =====
  { x: 10, y: 1, w: 21, h: 9, type: 'room', wing: 'kindergarten', label: 'K-Pod A' },
  { x: 31, y: 1, w: 21, h: 9, type: 'room', wing: 'kindergarten', label: 'K-Pod B' },
  { x: 52, y: 1, w: 21, h: 9, type: 'room', wing: 'kindergarten', label: 'K-Pod C' },
  { x: 73, y: 1, w: 11, h: 9, type: 'room', wing: 'right', label: 'Art Room' },

  // Top-band restroom cutouts
  { x: 29, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-a-right' },
  { x: 49, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-b-right' },
  { x: 52, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-c-left' },

  // ===== CENTER: Media Center =====
  { x: 35, y: 12, w: 18, h: 22, type: 'room', label: 'Media Center' },

  // ===== COURTYARD (large white square) =====
  { x: 53, y: 12, w: 20, h: 16, type: 'courtyard' },

  // ===== NURSE & MUSIC (below courtyard, above corridor, y=28-34) =====
  { x: 53, y: 28, w: 6, h: 6, type: 'room', label: 'Nurse Suite' },
  { x: 55, y: 29, w: 3, h: 3, type: 'utility', restroom: 'nurse-ensuite', label: 'Nurse WC' },
  { x: 59, y: 28, w: 14, h: 6, type: 'room', label: 'Music Room' },

  // ===== LEFT WING: EXACTLY 5 ROWS, walls at y=38/49/60/71 =====
  { x: 0, y: 19, w: 11, h: 15, type: 'room', wing: 'left-outer', label: 'Science Lab 1' },
  { x: 0, y: 34, w: 11, h: 15, type: 'room', wing: 'left-outer', label: 'Science Lab 2' },
  { x: 0, y: 49, w: 11, h: 11, type: 'room', wing: 'left-outer', label: 'Science Lab 3' },
  { x: 0, y: 60, w: 11, h: 11, type: 'room', wing: 'left-outer', label: 'Science Lab 4' },
  { x: 0, y: 71, w: 11, h: 15, type: 'room', wing: 'left-outer', label: 'Science Lab 5' },

  { x: 14, y: 19, w: 9, h: 15, type: 'room', wing: 'left-inner', label: 'Grade 5 Room' },
  { x: 14, y: 34, w: 9, h: 15, type: 'room', wing: 'left-inner', label: 'Grade 4 Room A' },
  { x: 14, y: 49, w: 9, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 4 Room B' },
  { x: 14, y: 60, w: 9, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 3 Room A' },
  { x: 14, y: 71, w: 9, h: 15, type: 'room', wing: 'left-inner', label: 'Grade 3 Room B' },

  // ===== RIGHT WING =====
  { x: 73, y: 10, w: 11, h: 11, type: 'room', wing: 'right', label: 'Grade 1 Room A' },
  { x: 73, y: 22, w: 11, h: 11, type: 'room', wing: 'right', label: 'Grade 1 Room B' },
  { x: 73, y: 33, w: 11, h: 5, type: 'room', wing: 'right', label: 'Grade 2 Room A' },
  { x: 73, y: 38, w: 11, h: 10, type: 'room', wing: 'right', label: 'Grade 2 Room B' },
  { x: 73, y: 48, w: 11, h: 10, type: 'room', wing: 'right', label: 'Computer Lab' },
  { x: 73, y: 58, w: 11, h: 12, type: 'room', wing: 'right', label: 'ESL Room' },
  { x: 73, y: 70, w: 11, h: 16, type: 'room', wing: 'right', label: 'Resource Room' },

  // ===== ADMIN ROW: 2 tiny WCs + 6 offices below corridor =====
  { x: 23, y: 38, w: 3, h: 6, type: 'room', restroom: 'boys', label: 'Boys WC' },
  { x: 26, y: 38, w: 3, h: 6, type: 'room', restroom: 'girls', label: 'Girls WC' },
  { x: 29, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Principal' },
  { x: 35, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Asst Principal' },
  { x: 41, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Main Office' },
  { x: 47, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Counselor' },
  { x: 53, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Conference' },
  { x: 59, y: 38, w: 7, h: 6, type: 'room', wing: 'admin', label: 'Staff Lounge' },

  // ===== Staff restroom stack (right hallway) =====
  { x: 66, y: 38, w: 4, h: 4, type: 'room', restroom: 'female' },
  { x: 67, y: 42, w: 3, h: 3, type: 'utility', restroom: 'staff' },
  { x: 67, y: 45, w: 3, h: 3, type: 'utility', restroom: 'staff' },
  { x: 66, y: 48, w: 4, h: 4, type: 'room', restroom: 'male' },

  // ===== CAFETORIUM =====
  { x: 41, y: 52, w: 31, h: 34, type: 'cafeteria', label: 'Cafetorium' },
];

// Doorway openings between spaces.
// dir 'S': opening between (x..x+len-1, y) and the cells directly below.
// dir 'E': opening between (x, y..y+len-1) and the cells directly right.
export const DOORS = [
  // Top band -> north corridor
  { x: 21, y: 9, dir: 'S', len: 2 },
  { x: 41, y: 9, dir: 'S', len: 2 },
  { x: 61, y: 9, dir: 'S', len: 2 },

  // Media Center -> north corridor / main corridor
  { x: 40, y: 11, dir: 'S', len: 2 },
  { x: 44, y: 11, dir: 'S', len: 2 },
  { x: 48, y: 11, dir: 'S', len: 2 },
  { x: 43, y: 33, dir: 'S', len: 2 },

  // Nurse & Music -> corridor  
  { x: 55, y: 33, dir: 'S', len: 2 },
  { x: 62, y: 33, dir: 'S', len: 2 },

  // Left outer -> left hallway
  { x: 10, y: 26, dir: 'E', len: 2 },
  { x: 10, y: 41, dir: 'E', len: 2 },
  { x: 10, y: 53, dir: 'E', len: 2 },
  { x: 10, y: 64, dir: 'E', len: 2 },
  { x: 10, y: 77, dir: 'E', len: 2 },

  // Left inner -> left hallway
  { x: 13, y: 25, dir: 'E', len: 2 },
  { x: 13, y: 41, dir: 'E', len: 2 },
  { x: 13, y: 53, dir: 'E', len: 2 },
  { x: 13, y: 64, dir: 'E', len: 2 },
  { x: 13, y: 77, dir: 'E', len: 2 },

  // WC pair + Admin suite -> corridor
  { x: 23, y: 37, dir: 'S', len: 2 },
  { x: 26, y: 37, dir: 'S', len: 2 },
  { x: 31, y: 37, dir: 'S', len: 2 },
  { x: 37, y: 37, dir: 'S', len: 2 },
  { x: 43, y: 37, dir: 'S', len: 2 },
  { x: 49, y: 37, dir: 'S', len: 2 },
  { x: 55, y: 37, dir: 'S', len: 2 },
  { x: 61, y: 37, dir: 'S', len: 2 },

  // Staff restroom stack -> right hallway
  { x: 69, y: 39, dir: 'E', len: 2 },
  { x: 69, y: 42, dir: 'E', len: 2 },
  { x: 69, y: 45, dir: 'E', len: 2 },
  { x: 69, y: 49, dir: 'E', len: 2 },

  // Right wing -> right hallway
  { x: 77, y: 9, dir: 'S', len: 2 },
  { x: 72, y: 15, dir: 'E', len: 2 },
  { x: 72, y: 26, dir: 'E', len: 2 },
  { x: 72, y: 35, dir: 'E', len: 2 },
  { x: 72, y: 42, dir: 'E', len: 2 },
  { x: 72, y: 52, dir: 'E', len: 2 },
  { x: 72, y: 63, dir: 'E', len: 2 },
  { x: 72, y: 77, dir: 'E', len: 2 },

  // Cafetorium -> right hallway
  { x: 69, y: 60, dir: 'E', len: 3 },
];

// Legacy / compatibility exports so existing imports in other files keep working.
export const SCHOOL_ZONES = {};
export const BLUEPRINT_AREAS = ROOMS;
export const BLUEPRINT_GRID = GRID;
export const BLUEPRINT_PARTITIONS = [];