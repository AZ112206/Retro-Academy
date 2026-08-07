// Geometry transcribed 1:1 from scripts/map-preview.txt (traced blueprint).
// Region coords come from the connected-component parse in scripts/gen-world.mjs.

export const GRID = { w: 86, h: 88 };

export const HALLS = [
  { x: 12, y: 10, w: 61, h: 2 },   // north corridor
  { x: 12, y: 12, w: 5, h: 3 },    // main-entrance stub under the corridor's left end
  { x: 70, y: 12, w: 3, h: 22 },   // right hall, upper segment (ends at vestibule)
  { x: 12, y: 34, w: 51, h: 4 },   // main corridor
  { x: 23, y: 31, w: 13, h: 3 },   // courtyard-entry bump on top of the main corridor
  { x: 10, y: 19, w: 3, h: 67 },   // left wing hall
  { x: 13, y: 30, w: 9, h: 4 },    // left wing inner cutout — hall fills gap above room 2
  { x: 1,  y: 34, w: 9, h: 4 },    // left wing outer gap — hall bridges rooms 1 and 2
  { x: 70, y: 38, w: 3, h: 48 },   // right hall, lower segment
];

export const ROOMS = [
  // ===== NORTH BAND (widths 20/19/22; single cutout left, pair right) =====
  { x: 12, y: 1, w: 20, h: 9, type: 'room', wing: 'north', label: 'Kindergarten A' },
  { x: 32, y: 1, w: 19, h: 9, type: 'room', wing: 'north', label: 'Kindergarten B' },
  { x: 51, y: 1, w: 22, h: 9, type: 'room', wing: 'north', label: 'Kindergarten C' },
  { x: 29, y: 7, w: 3, h: 3, type: 'utility', wing: 'north', label: 'K Restroom A' },
  { x: 48, y: 7, w: 3, h: 3, type: 'utility', wing: 'north', label: 'K Restroom B' },
  { x: 51, y: 7, w: 3, h: 3, type: 'utility', wing: 'north', label: 'K Restroom C' },

  // ===== CENTRAL BLOCK (cafeteria | vertical kitchen | library) =====
  { x: 33, y: 12, w: 19, h: 22, type: 'cafeteria', wing: 'central', label: 'Cafeteria' },
  { x: 22, y: 28, w: 11, h:  6, type: 'room',      wing: 'central', label: 'Main Entrance Vestibule' },
  { x: 52, y: 12, w: 6, h: 16, type: 'utility', wing: 'central', label: 'Kitchen & Servery' },
  { x: 58, y: 12, w: 12, h: 16, type: 'room', wing: 'central', label: 'Library & Media Center' },
  { x: 52, y: 28, w: 6, h: 6, type: 'room', wing: 'central', label: "Custodian's Office" },
  { x: 58, y: 28, w: 12, h: 6, type: 'room', wing: 'central', label: 'Music Room' },

  // ===== LEFT WING, OUTER COLUMN =====
  { x: 1, y: 19, w: 9, h: 15, type: 'room', wing: 'left-outer', label: 'Grade 3 Math' },
  { x: 1, y: 38, w: 9, h: 11, type: 'room', wing: 'left-outer', label: 'Grade 3 Sci & Social Studies' },
  { x: 1, y: 49, w: 9, h: 11, type: 'room', wing: 'left-outer', label: 'Grade 4 Reading & ELA' },
  { x: 1, y: 60, w: 9, h: 11, type: 'room', wing: 'left-outer', label: 'Grade 4 Math' },
  { x: 1, y: 71, w: 9, h: 15, type: 'room', wing: 'left-outer', label: 'Grade 4 Sci & Social Studies' },

  // ===== LEFT WING, INNER COLUMN =====
  { x: 13, y: 19, w: 9, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 3 Reading' },
  { x: 13, y: 38, w: 9, h: 11, type: 'room', wing: 'left-inner', label: 'Health Classroom' },
  { x: 13, y: 49, w: 9, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 5 Reading & ELA' },
  { x: 13, y: 60, w: 9, h: 11, type: 'room', wing: 'left-inner', label: 'Grade 5 Math' },
  { x: 13, y: 71, w: 9, h: 15, type: 'room', wing: 'left-inner', label: 'Grade 5 Sci & Social Studies' },

  // ===== SOUTH BAND BELOW MAIN HALLWAY (y:38-43) =====
  { x: 22, y: 38, w: 9, h: 6, type: 'room', wing: 'south', label: 'Medium Classroom A' }, // starts at x:22 to close gap with left inner room
  { x: 31, y: 38, w: 8, h: 6, type: 'room', wing: 'south', label: 'Medium Classroom B' },
  // Girls extends to cover the staff footprint base (L-shape); staff rooms carved from it
  { x: 39, y: 38, w: 6, h: 6, type: 'room', wing: 'south', restroom: 'girls', label: "Girls' Restroom" },
  { x: 43, y: 38, w: 2, h: 4, type: 'utility', wing: 'south', restroom: 'staff', label: 'Staff Restroom 1' }, // carve from girls
  // Boys mirrors the girls motif — staff inset carved on his left so both staff WCs sit adjacent
  { x: 45, y: 38, w: 6, h: 6, type: 'room', wing: 'south', restroom: 'boys', label: "Boys' Restroom" },
  { x: 45, y: 38, w: 2, h: 4, type: 'utility', wing: 'south', restroom: 'staff', label: 'Staff Restroom 2' },
  { x: 51, y: 38, w: 4, h: 6, type: 'room', wing: 'south', label: "Counselor's Office" },
  { x: 55, y: 38, w: 9, h: 6, type: 'room', wing: 'south', label: "Nurse's Office" },
  { x: 55, y: 38, w: 2, h: 4, type: 'utility', wing: 'south', restroom: 'staff', label: 'Nurse Private Restroom' },

  // ===== SIDE ENTRANCE + RIGHT-SIDE RESTROOM COLUMN =====
  { x: 63, y: 34, w: 10, h: 4, type: 'room', wing: 'east', label: 'Side Entrance Vestibule' },
  { x: 64, y: 38, w: 6, h: 7, type: 'room',    wing: 'east', restroom: 'girls', label: 'Suite 2 Girls' },
  { x: 66, y: 43, w: 4, h: 2, type: 'utility', wing: 'east', restroom: 'staff', label: 'Suite 2 Girls WC' },
  { x: 64, y: 45, w: 6, h: 7, type: 'room',    wing: 'east', restroom: 'boys',  label: 'Suite 2 Boys' },
  { x: 66, y: 45, w: 4, h: 2, type: 'utility', wing: 'east', restroom: 'staff', label: 'Suite 2 Boys WC' },

  // ===== RIGHT WING (3 rooms above the exterior notch, 5 below) =====
  { x: 73, y: 1, w: 11, h: 9, type: 'room', wing: 'right', label: 'Grade 1 Classroom C' },
  { x: 73, y: 10, w: 11, h: 9, type: 'room', wing: 'right', label: 'Grade 1 Classroom B' },
  { x: 73, y: 19, w: 11, h: 9, type: 'room', wing: 'right', label: 'Grade 1 Classroom A' },
  { x: 73, y: 37, w: 11, h: 9,  type: 'room', wing: 'right', label: 'Grade 2 Classroom A' },
  { x: 73, y: 46, w: 11, h: 4,  type: 'room', wing: 'right', label: 'Right Wing Vestibule' },
  { x: 73, y: 50, w: 11, h: 9,  type: 'room', wing: 'right', label: 'Grade 2 Classroom B' },
  { x: 73, y: 59, w: 11, h: 9,  type: 'room', wing: 'right', label: 'Grade 2 Classroom C' },
  { x: 73, y: 68, w: 11, h: 7,  type: 'room', wing: 'right', label: 'Computer Lab' },
  { x: 73, y: 75, w: 11, h: 11, type: 'room', wing: 'right', label: 'Art Classroom' },

  // ===== GYMTORIUM (top edge 8 tiles below the admin strip, per blueprint) =====
  { x: 51, y: 52, w: 19, h: 34, type: 'cafeteria', wing: 'south', label: 'Gymtorium' },
  // NW corner step notch
  { x: 51, y: 52, w: 2, h: 2, type: 'outdoor' },
];

export const DOORS = [
  // North band -> north corridor
  { x: 22, y: 9, dir: 'S', len: 2 },
  { x: 40, y: 9, dir: 'S', len: 2 },
  { x: 62, y: 9, dir: 'S', len: 2 },
  // K restroom cutouts open into their classrooms
  { x: 29, y: 6, dir: 'S', len: 2 },
  { x: 48, y: 6, dir: 'S', len: 2 },
  { x: 51, y: 6, dir: 'S', len: 2 },

  // Central block
  { x: 36, y: 11, dir: 'S', len: 2 },  // cafeteria north — left cutout
  { x: 42, y: 11, dir: 'S', len: 2 },  // cafeteria north — centre cutout
  { x: 48, y: 11, dir: 'S', len: 2 },  // cafeteria north — right cutout
  { x: 62, y: 11, dir: 'S', len: 2 },  // library -> north corridor
  { x: 51, y: 18, dir: 'E', len: 2 },  // cafeteria -> kitchen servery
  { x: 54, y: 27, dir: 'S', len: 2 },  // kitchen -> custodian
  { x: 69, y: 20, dir: 'E', len: 2 },  // library -> right hall
  { x: 36, y: 33, dir: 'S', len: 2 },  // cafeteria south — left cutout
  { x: 42, y: 33, dir: 'S', len: 2 },  // cafeteria south — centre cutout
  { x: 48, y: 33, dir: 'S', len: 2 },  // cafeteria south — right cutout
  { x: 54, y: 33, dir: 'S', len: 2 },  // custodian -> main corridor
  { x: 60, y: 33, dir: 'S', len: 2 },  // music -> main corridor
  { x: 24, y: 33, dir: 'S', len: 2 },  // vestibule south — left cutout
  { x: 29, y: 33, dir: 'S', len: 2 },  // vestibule south — right cutout
  { x: 24, y: 27, dir: 'S', len: 2 },  // vestibule north — left cutout
  { x: 29, y: 27, dir: 'S', len: 2 },  // vestibule north — right cutout
  { x: 62, y: 27, dir: 'S', len: 2 },  // library -> music

  // Left outer -> left hall
  { x: 9, y: 26, dir: 'E', len: 2 },
  { x: 9, y: 43, dir: 'E', len: 2 },
  { x: 9, y: 54, dir: 'E', len: 2 },
  { x: 9, y: 65, dir: 'E', len: 2 },
  { x: 9, y: 78, dir: 'E', len: 2 },

  // Left inner -> left hall
  { x: 12, y: 26, dir: 'E', len: 2 },
  { x: 12, y: 43, dir: 'E', len: 2 },
  { x: 12, y: 54, dir: 'E', len: 2 },
  { x: 12, y: 65, dir: 'E', len: 2 },
  { x: 12, y: 78, dir: 'E', len: 2 },

  // South band below main hallway -> main corridor
  { x: 26, y: 37, dir: 'S', len: 2 },  // Medium A (x:22 w:9, centre x:26)
  { x: 35, y: 37, dir: 'S', len: 2 },  // Medium B (x:31 w:8, centre x:35)
  { x: 40, y: 37, dir: 'S', len: 2 },  // Girls
  { x: 43, y: 37, dir: 'S', len: 2 },  // Staff WC 1 — north (corridor) access only
  { x: 45, y: 37, dir: 'S', len: 2 },  // Staff WC 2 — north (corridor) access only
  { x: 48, y: 37, dir: 'S', len: 2 },  // Boys
  { x: 53, y: 37, dir: 'S', len: 2 },  // Counselor
  { x: 59, y: 37, dir: 'S', len: 2 },  // Nurse
  { x: 55, y: 41, dir: 'S', len: 2 },  // Nurse Private WC bottom — internal only

  // Vestibule links main corridor with both right-hall segments
  { x: 62, y: 34, dir: 'E', len: 4 },
  { x: 70, y: 33, dir: 'S', len: 2 },
  { x: 70, y: 37, dir: 'S', len: 2 },

  // Suite 2 — equal h=7 Girls/Boys, WC on east side (right hall access only)
  { x: 69, y: 40, dir: 'E', len: 2 },  // Suite 2 Girls -> right hall
  { x: 69, y: 43, dir: 'E', len: 2 },  // Suite 2 Girls WC — east access only
  { x: 69, y: 47, dir: 'E', len: 2 },  // Suite 2 Boys -> right hall
  { x: 69, y: 45, dir: 'E', len: 2 },  // Suite 2 Boys WC — east access only

  // Right wing
  { x: 77, y: 9, dir: 'S', len: 2 },
  { x: 72, y: 14, dir: 'E', len: 2 },
  { x: 72, y: 22, dir: 'E', len: 2 },
  { x: 72, y: 40, dir: 'E', len: 2 },
  { x: 72, y: 47, dir: 'E', len: 2 },
  { x: 72, y: 54, dir: 'E', len: 2 },
  { x: 72, y: 63, dir: 'E', len: 2 },
  { x: 72, y: 71, dir: 'E', len: 2 },
  { x: 72, y: 79, dir: 'E', len: 2 },

  // Gymtorium -> right hall
  { x: 69, y: 60, dir: 'E', len: 3 },
];

export const SCHOOL_ZONES = {};
export const BLUEPRINT_AREAS = ROOMS;
export const BLUEPRINT_GRID = GRID;
export const BLUEPRINT_PARTITIONS = [];

// Metadata export for gameplay/world-state assignment flows.
export const retroAcademyLayout = [
  { id: 'left_gr3_math', name: 'Grade 3 Math Classroom', zone: 'Left Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'left_gr3_sci_ss', name: 'Grade 3 Sci & Social Studies', zone: 'Left Wing', type: 'extended_classroom', width: 30, height: 45 },
  { id: 'left_gr4_reading_ela', name: 'Grade 4 Reading & ELA Classroom', zone: 'Left Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'left_gr4_math', name: 'Grade 4 Math Classroom', zone: 'Left Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'left_gr4_sci_ss', name: 'Grade 4 Sci & Social Studies', zone: 'Left Wing', type: 'extended_classroom', width: 30, height: 45 },
  { id: 'left_gr3_reading', name: 'Grade 3 Reading Classroom', zone: 'Left Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'left_health', name: 'Health Classroom', zone: 'Left Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'left_gr5_reading_ela', name: 'Grade 5 Reading & ELA Classroom', zone: 'Left Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'left_gr5_math', name: 'Grade 5 Math Classroom', zone: 'Left Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'left_gr5_sci_ss', name: 'Grade 5 Sci & Social Studies', zone: 'Left Wing', type: 'extended_classroom', width: 30, height: 45 },

  { id: 'north_k_a', name: 'Kindergarten A', zone: 'North Wing', type: 'classroom', width: 40, height: 30 },
  { id: 'north_k_b', name: 'Kindergarten B', zone: 'North Wing', type: 'classroom', width: 40, height: 30 },
  { id: 'north_k_c', name: 'Kindergarten C', zone: 'North Wing', type: 'classroom', width: 40, height: 30 },
  { id: 'north_k_restroom_a', name: 'K-Grade Attached Restroom A', zone: 'North Wing', type: 'restroom', width: 8, height: 8 },
  { id: 'north_k_restroom_b', name: 'K-Grade Attached Restroom B', zone: 'North Wing', type: 'restroom', width: 8, height: 8 },
  { id: 'north_k_restroom_c', name: 'K-Grade Attached Restroom C', zone: 'North Wing', type: 'restroom', width: 8, height: 8 },

  { id: 'central_main_vestibule', name: 'Main Entrance Vestibule', zone: 'Central Block', type: 'corridor', width: 25, height: 30 },
  { id: 'central_cafeteria', name: 'Cafeteria', zone: 'Central Block', type: 'facility', width: 60, height: 60 },
  { id: 'central_kitchen', name: 'Kitchen & Servery', zone: 'Central Block', type: 'facility', width: 15, height: 60 },
  { id: 'central_custodian', name: "Custodian's Office", zone: 'Central Block', type: 'office', width: 15, height: 15 },
  { id: 'central_library', name: 'Library & Media Center', zone: 'Central Block', type: 'facility', width: 60, height: 60 },
  { id: 'central_music', name: 'Music Room', zone: 'Central Block', type: 'classroom', width: 60, height: 20 },

  { id: 'south_girls', name: "Girls' Restroom", zone: 'South Corridor', type: 'restroom', width: 15, height: 20 },
  { id: 'south_boys', name: "Boys' Restroom", zone: 'South Corridor', type: 'restroom', width: 15, height: 20 },
  { id: 'south_staff_1', name: 'Staff Restroom 1', zone: 'South Corridor', type: 'restroom', width: 10, height: 10 },
  { id: 'south_staff_2', name: 'Staff Restroom 2', zone: 'South Corridor', type: 'restroom', width: 10, height: 10 },
  { id: 'south_counselor', name: "Counselor's Office", zone: 'South Corridor', type: 'office', width: 15, height: 20 },
  { id: 'south_nurse', name: "Nurse's Clinic", zone: 'South Corridor', type: 'office', width: 15, height: 25 },
  { id: 'south_asst_principal', name: "Assistant Principal's Office", zone: 'South Corridor', type: 'office', width: 15, height: 20 },
  { id: 'south_principal', name: "Principal's Office", zone: 'South Corridor', type: 'office', width: 20, height: 20 },

  { id: 'right_restroom_girls', name: 'Restroom Suite 2 (Girls)', zone: 'Right Wing', type: 'restroom', width: 15, height: 20 },
  { id: 'right_restroom_boys', name: 'Restroom Suite 2 (Boys)', zone: 'Right Wing', type: 'restroom', width: 15, height: 20 },
  { id: 'right_restroom_staff_1', name: 'Restroom Suite 2 (Staff 1)', zone: 'Right Wing', type: 'restroom', width: 10, height: 10 },
  { id: 'right_restroom_staff_2', name: 'Restroom Suite 2 (Staff 2)', zone: 'Right Wing', type: 'restroom', width: 10, height: 10 },
  { id: 'right_gymtorium', name: 'Gymtorium (Main Floor)', zone: 'Right Wing', type: 'facility', width: 80, height: 80 },
  { id: 'right_stage', name: 'Stage', zone: 'Right Wing', type: 'facility', width: 40, height: 20 },
  { id: 'right_pe_storage', name: 'PE Equipment Storage', zone: 'Right Wing', type: 'facility', width: 20, height: 20 },
  { id: 'right_event_storage', name: 'Stage/Event Storage', zone: 'Right Wing', type: 'facility', width: 20, height: 20 },
  { id: 'right_art', name: 'Art Classroom', zone: 'Right Wing', type: 'extended_classroom', width: 30, height: 45 },
  { id: 'right_g2_a', name: 'Grade 2 Classroom A', zone: 'Right Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'right_g2_b', name: 'Grade 2 Classroom B', zone: 'Right Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'right_g2_c', name: 'Grade 2 Classroom C', zone: 'Right Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'right_side_vestibule', name: 'Side Entrance Vestibule', zone: 'Right Wing', type: 'corridor', width: 10, height: 30 },
  { id: 'right_g1_a', name: 'Grade 1 Classroom A', zone: 'Right Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'right_g1_b', name: 'Grade 1 Classroom B', zone: 'Right Wing', type: 'classroom', width: 30, height: 30 },
  { id: 'right_g1_c', name: 'Grade 1 Classroom C', zone: 'Right Wing', type: 'classroom', width: 30, height: 30 },
];
