// Floor-plan geometry mirrored from the reference elementary-school blueprint.
// Grid in tile units.

export const GRID = { w: 86, h: 88 };

export const HALLS = [
  { x: 15, y: 34, w: 58, h: 4 },   // main horizontal corridor
  { x: 12, y: 10, w: 3, h: 76 },   // left vertical hallway
  { x: 70, y: 10, w: 3, h: 76 },   // right vertical hallway
];

export const ROOMS = [
  // ===== NORTH: 3 K-Pods (equal widths: 20, 20, 21) =====
  { x: 12, y: 1, w: 20, h: 9, type: 'room', wing: 'kindergarten', label: 'K-Pod A' },
  { x: 32, y: 1, w: 20, h: 9, type: 'room', wing: 'kindergarten', label: 'K-Pod B' },
  { x: 52, y: 1, w: 21, h: 9, type: 'room', wing: 'kindergarten', label: 'K-Pod C' },

  // K-pod inward restroom cutouts at dividing walls
  { x: 29, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-a-right' },
  { x: 32, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-b-left' },
  { x: 49, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-b-right' },
  { x: 52, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-c-left' },
  { x: 66, y: 7, w: 3, h: 3, type: 'utility', wing: 'kindergarten', restroom: 'k-toilet-c-right' },

  // ===== CENTER: Media Center =====
  { x: 38, y: 10, w: 14, h: 24, type: 'room', label: 'Media Center' },

  // ===== COURTYARD (large white square) =====
  { x: 52, y: 10, w: 17, h: 18, type: 'courtyard' },

  // ===== NURSE & MUSIC (below courtyard, above corridor, y=28-34) =====
  { x: 52, y: 28, w: 6, h: 6, type: 'room', label: 'Nurse Suite' },
  { x: 54, y: 29, w: 3, h: 3, type: 'utility', restroom: 'nurse-ensuite', label: 'Nurse WC' },
  { x: 58, y: 28, w: 12, h: 6, type: 'room', label: 'Music Room' },

  // ===== LEFT WING: EXACTLY 5 ROWS, walls at y=38/49/60/71 =====
  { x: 1, y: 19, w: 11, h: 19, type: 'room', wing: 'left-outer', label: 'Science Lab 1' },
  { x: 1, y: 38, w: 11, h: 11, type: 'room', wing: 'left-outer', label: 'Science Lab 2' },
  { x: 1, y: 49, w: 11, h: 11, type: 'room', wing: 'left-outer', label: 'Science Lab 3' },
  { x: 1, y: 60, w: 11, h: 11, type: 'room', wing: 'left-outer', label: 'Science Lab 4' },
  { x: 1, y: 71, w: 11, h: 15, type: 'room', wing: 'left-outer', label: 'Science Lab 5' },

  { x: 15, y: 19, w: 8, h: 15, type: 'room', wing: 'left-inner', label: 'Grade 5 Room' },
  { x: 15, y: 38, w: 8, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 4 Room A' },
  { x: 15, y: 49, w: 8, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 4 Room B' },
  { x: 15, y: 60, w: 8, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 3 Room A' },
  { x: 15, y: 71, w: 8, h: 15, type: 'room', wing: 'left-inner', label: 'Grade 3 Room B' },

  // ===== RIGHT WING =====
  { x: 73, y: 1, w: 11, h: 9, type: 'room', wing: 'right', label: 'Art Room' },
  { x: 73, y: 10, w: 11, h: 12, type: 'room', wing: 'right', label: 'Grade 1 Room A' },
  { x: 73, y: 22, w: 11, h: 11, type: 'room', wing: 'right', label: 'Grade 1 Room B' },
  { x: 73, y: 33, w: 11, h: 5, type: 'room', wing: 'right', label: 'Grade 2 Room A' },
  { x: 73, y: 38, w: 11, h: 10, type: 'room', wing: 'right', label: 'Grade 2 Room B' },
  { x: 73, y: 48, w: 11, h: 10, type: 'room', wing: 'right', label: 'Computer Lab' },
  { x: 73, y: 58, w: 11, h: 12, type: 'room', wing: 'right', label: 'ESL Room' },
  { x: 73, y: 70, w: 11, h: 16, type: 'room', wing: 'right', label: 'Resource Room' },

  // ===== L-SHAPED RESTROOMS: simpler 2-room interlock at junction =====
  { x: 63, y: 28, w: 7, h: 6, type: 'room', restroom: 'boys', label: 'Boys Restroom' },
  { x: 63, y: 34, w: 10, h: 4, type: 'room', restroom: 'girls', label: 'Girls Restroom' },

  // ===== ADMIN ROW: 2 tiny WCs + 6 offices below corridor =====
  { x: 24, y: 38, w: 3, h: 6, type: 'room', restroom: 'boys', label: 'Boys WC' },
  { x: 27, y: 38, w: 3, h: 6, type: 'room', restroom: 'girls', label: 'Girls WC' },
  { x: 30, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Principal' },
  { x: 36, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Asst Principal' },
  { x: 42, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Main Office' },
  { x: 48, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Counselor' },
  { x: 54, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Conference' },
  { x: 60, y: 38, w: 6, h: 6, type: 'room', wing: 'admin', label: 'Staff Lounge' },

  // ===== Staff restroom stack (right hallway) =====
  { x: 66, y: 38, w: 4, h: 4, type: 'room', restroom: 'female' },
  { x: 67, y: 42, w: 3, h: 3, type: 'utility', restroom: 'staff' },
  { x: 67, y: 45, w: 3, h: 3, type: 'utility', restroom: 'staff' },
  { x: 66, y: 48, w: 4, h: 4, type: 'room', restroom: 'male' },

  // ===== CAFETORIUM =====
  { x: 44, y: 52, w: 26, h: 34, type: 'cafeteria', label: 'Cafetorium' },
];

// Doorway openings between spaces.
// dir 'S': opening between (x..x+len-1, y) and the cells directly below.
// dir 'E': opening between (x, y..y+len-1) and the cells directly right.
export const DOORS = [
  // K-Pods -> bottom edge (no hallway beneath)
  { x: 21, y: 9, dir: 'S', len: 2 },
  { x: 41, y: 9, dir: 'S', len: 2 },
  { x: 61, y: 9, dir: 'S', len: 2 },

  // Media Center -> corridor
  { x: 44, y: 33, dir: 'S', len: 2 },

  // Nurse & Music -> corridor  
  { x: 55, y: 33, dir: 'S', len: 2 },
  { x: 63, y: 33, dir: 'S', len: 2 },

  // Left outer -> left hallway
  { x: 11, y: 26, dir: 'E', len: 2 },
  { x: 11, y: 42, dir: 'E', len: 2 },
  { x: 11, y: 53, dir: 'E', len: 2 },
  { x: 11, y: 64, dir: 'E', len: 2 },
  { x: 11, y: 77, dir: 'E', len: 2 },

  // Left inner -> left hallway
  { x: 14, y: 25, dir: 'E', len: 2 },
  { x: 14, y: 42, dir: 'E', len: 2 },
  { x: 14, y: 53, dir: 'E', len: 2 },
  { x: 14, y: 64, dir: 'E', len: 2 },
  { x: 14, y: 77, dir: 'E', len: 2 },

  // WC pair + Admin suite -> corridor
  { x: 24, y: 37, dir: 'S', len: 2 },
  { x: 27, y: 37, dir: 'S', len: 2 },
  { x: 32, y: 37, dir: 'S', len: 2 },
  { x: 38, y: 37, dir: 'S', len: 2 },
  { x: 44, y: 37, dir: 'S', len: 2 },
  { x: 50, y: 37, dir: 'S', len: 2 },
  { x: 56, y: 37, dir: 'S', len: 2 },
  { x: 62, y: 37, dir: 'S', len: 2 },

  // Staff restroom stack -> right hallway
  { x: 69, y: 39, dir: 'E', len: 2 },
  { x: 69, y: 42, dir: 'E', len: 2 },
  { x: 69, y: 45, dir: 'E', len: 2 },
  { x: 69, y: 49, dir: 'E', len: 2 },

  // L-shaped restrooms -> corridor area
  { x: 66, y: 27, dir: 'S', len: 2 },
  { x: 66, y: 33, dir: 'S', len: 2 },

  // Right wing -> right hallway
  { x: 77, y: 9, dir: 'S', len: 2 },
  { x: 72, y: 16, dir: 'E', len: 2 },
  { x: 72, y: 27, dir: 'E', len: 2 },
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