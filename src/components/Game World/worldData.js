// Floor-plan geometry mirrored from the reference elementary-school blueprint.
// Grid in tile units.

export const GRID = { w: 86, h: 88 };

const CLASS_W = 11;
const CLASS_H = 9;

// Hallways – both vertical halls share the same y/height constants by design.
export const HALLS = [
  { x: 12, y: 10, w: 61, h: 2 },   // top strip under north classrooms
  { x: 15, y: 34, w: 58, h: 4 },   // main horizontal corridor
  { x: 12, y: 19, w: 3, h: 67 },   // left vertical hallway (down to building base)
  { x: 70, y: 12, w: 3, h: 74 },   // right vertical hallway (meets top strip, runs to base)
];

export const ROOMS = [
  // North classrooms
  { x: 12, y: 1, w: 23, h: 9, type: 'room' },
  { x: 35, y: 1, w: 19, h: 9, type: 'room' },
  { x: 54, y: 1, w: 19, h: 9, type: 'room' },

  // Center drop-down block
  { x: 38, y: 12, w: 14, h: 22, type: 'room' },

  // Enclosed courtyard east of the center block
  { x: 52, y: 12, w: 18, h: 22, type: 'courtyard' },

  // Right wing: normal module is 11x9, one larger bottom room
  { x: 73, y: 1,  w: CLASS_W, h: CLASS_H, type: 'room', wing: 'right' },
  { x: 73, y: 10, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'right' },
  { x: 73, y: 19, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'right' },
  { x: 73, y: 28, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'right' },
  { x: 73, y: 37, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'right' },
  { x: 73, y: 46, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'right' },
  { x: 73, y: 55, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'right' },
  { x: 73, y: 64, w: CLASS_W, h: 11, type: 'room', wing: 'right' },
  { x: 73, y: 75, w: CLASS_W, h: 11, type: 'room', wing: 'right' },

  // Left classrooms normalized to right normal module size (11x9)
  { x: 1,  y: 19, w: CLASS_W, h: 19, type: 'room', wing: 'left-outer' }, // continuous past corridor line
  { x: 1,  y: 38, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-outer' },
  { x: 1,  y: 47, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-outer' },

  { x: 15, y: 19, w: CLASS_W, h: 15, type: 'room', wing: 'left-inner' }, // single tall room above corridor
  { x: 15, y: 38, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-inner' },
  { x: 15, y: 47, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-inner' },

  // Left stacks continue to the hallway end (reference has no left restroom block)
  { x: 1,  y: 56, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-outer' },
  { x: 1,  y: 65, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-outer' },
  { x: 1,  y: 74, w: CLASS_W, h: 12, type: 'room', wing: 'left-outer' },
  { x: 15, y: 56, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-inner' },
  { x: 15, y: 65, w: CLASS_W, h: CLASS_H, type: 'room', wing: 'left-inner' },
  { x: 15, y: 74, w: CLASS_W, h: 12, type: 'room', wing: 'left-inner' },

  // Right restroom stack hugging the right hallway (compact, per reference)
  { x: 66, y: 38, w: 4, h: 4, type: 'room',    wing: 'right-restroom', restroom: 'female' },
  { x: 67, y: 42, w: 3, h: 3, type: 'utility', wing: 'right-restroom', restroom: 'staff' },
  { x: 67, y: 45, w: 3, h: 3, type: 'utility', wing: 'right-restroom', restroom: 'staff' },
  { x: 66, y: 48, w: 4, h: 4, type: 'room',    wing: 'right-restroom', restroom: 'male' },

  // South corridor row: small restroom pair first, then classrooms
  { x: 27, y: 38, w: 3, h: 6, type: 'room', restroom: 'boys' },
  { x: 30, y: 38, w: 3, h: 6, type: 'room', restroom: 'girls' },
  { x: 33, y: 38, w: 6, h: 6, type: 'room' },
  { x: 39, y: 38, w: 6, h: 6, type: 'room' },
  { x: 45, y: 38, w: 6, h: 6, type: 'room' },
  { x: 51, y: 38, w: 6, h: 6, type: 'room' },
  { x: 57, y: 38, w: 6, h: 6, type: 'room' },

  // Cafetorium (east edge meets the right hallway, extends to building base)
  { x: 44, y: 52, w: 26, h: 34, type: 'cafeteria' },
];

// Doorway openings between spaces.
// dir 'S': opening between (x..x+len-1, y) and the cells directly below.
// dir 'E': opening between (x, y..y+len-1) and the cells directly right.
export const DOORS = [
  // Top wing -> top strip
  { x: 24, y: 9, dir: 'S', len: 2 },
  { x: 43, y: 9, dir: 'S', len: 2 },
  { x: 61, y: 9, dir: 'S', len: 2 },

  // Top strip -> center block -> main corridor
  { x: 44, y: 11, dir: 'S', len: 2 },
  { x: 44, y: 33, dir: 'S', len: 2 },

  // Top strip -> courtyard
  { x: 60, y: 11, dir: 'S', len: 2 },

  // South row: restroom pair -> corridor
  { x: 27, y: 37, dir: 'S', len: 2 },
  { x: 30, y: 37, dir: 'S', len: 2 },

  // South corridor classroom row -> corridor
  { x: 35, y: 37, dir: 'S', len: 2 },
  { x: 41, y: 37, dir: 'S', len: 2 },
  { x: 47, y: 37, dir: 'S', len: 2 },
  { x: 53, y: 37, dir: 'S', len: 2 },
  { x: 59, y: 37, dir: 'S', len: 2 },

  // Cafetorium -> right hallway
  { x: 69, y: 60, dir: 'E', len: 2 },

  // Left outer classrooms -> left hallway
  { x: 11, y: 22, dir: 'E', len: 2 },
  { x: 11, y: 31, dir: 'E', len: 2 },
  { x: 11, y: 41, dir: 'E', len: 2 },
  { x: 11, y: 50, dir: 'E', len: 2 },

  // Left inner classrooms -> left hallway
  { x: 14, y: 22, dir: 'E', len: 2 },
  { x: 14, y: 31, dir: 'E', len: 2 },
  { x: 14, y: 41, dir: 'E', len: 2 },
  { x: 14, y: 50, dir: 'E', len: 2 },

  // Left bottom classrooms -> left hallway
  { x: 11, y: 58, dir: 'E', len: 2 },
  { x: 11, y: 68, dir: 'E', len: 2 },
  { x: 11, y: 77, dir: 'E', len: 2 },
  { x: 14, y: 58, dir: 'E', len: 2 },
  { x: 14, y: 68, dir: 'E', len: 2 },
  { x: 14, y: 77, dir: 'E', len: 2 },

  // Right wing top chain + hallway access
  { x: 77, y: 9,  dir: 'S', len: 2 },
  { x: 77, y: 18, dir: 'S', len: 2 },
  { x: 77, y: 27, dir: 'S', len: 2 },
  { x: 72, y: 31, dir: 'E', len: 2 },
  { x: 72, y: 40, dir: 'E', len: 2 },
  { x: 72, y: 49, dir: 'E', len: 2 },
  { x: 72, y: 58, dir: 'E', len: 2 },
  { x: 72, y: 68, dir: 'E', len: 2 },
  { x: 72, y: 78, dir: 'E', len: 2 },

  // Right restroom block -> right hallway
  { x: 69, y: 39, dir: 'E', len: 2 },
  { x: 69, y: 42, dir: 'E', len: 2 },
  { x: 69, y: 45, dir: 'E', len: 2 },
  { x: 69, y: 49, dir: 'E', len: 2 },
];

// Legacy / compatibility exports so existing imports in other files keep working.
export const SCHOOL_ZONES = {};
export const BLUEPRINT_AREAS = ROOMS;
export const BLUEPRINT_GRID = GRID;
export const BLUEPRINT_PARTITIONS = [];