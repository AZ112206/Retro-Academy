// Expanded Room & Station Assignment Logic for Elementary School World

export function assignRoomsToStaff(facultyRoster, playerGrade, playerDepartment) {
  // Define all physical rooms and stations across our school zones
  const schoolSlots = [
    // Administration & Support Stations
    { id: 'principal_office', type: 'Principal Office', category: 'admin', fixed: true },
    { id: 'admin_office', type: 'Assistant Principal Office', category: 'admin', fixed: true },
    { id: 'nurse_station', type: 'Nurse Office', category: 'nurse', fixed: true },
    
    // Kindergarten Pod (Double Size)
    { id: 'k_room_a', type: 'Kindergarten', size: 'double', occupant: null },
    { id: 'k_room_b', type: 'Kindergarten', size: 'double', occupant: null },
    
    // Primary Wing (Grades 1 & 2)
    { id: 'grade_1_a', type: 'Grade 1', size: 'standard', occupant: null },
    { id: 'grade_1_b', type: 'Grade 1', size: 'standard', occupant: null },
    { id: 'grade_2_a', type: 'Grade 2', size: 'standard', occupant: null },
    { id: 'grade_2_b', type: 'Grade 2', size: 'standard', occupant: null },
    
    // Upper-Elementary Wing (Grades 3 - 5)
    { id: 'grade_3_core', type: 'Grade 3 Math & ELA', size: 'standard', occupant: null },
    { id: 'grade_3_sci', type: 'Grade 3 Science Lab', size: 'lab', occupant: null },
    { id: 'grade_4_core', type: 'Grade 4 Math & ELA', size: 'standard', occupant: null },
    { id: 'grade_4_sci', type: 'Grade 4 Science Lab', size: 'lab', occupant: null },
    { id: 'grade_5_core', type: 'Grade 5 Math & ELA', size: 'standard', occupant: null },
    { id: 'grade_5_sci', type: 'Grade 5 Science Lab', size: 'lab', occupant: null },

    // Special Areas & Facilities
    { id: 'library', type: 'Library / Media Center', category: 'specialist', fixed: true },
    { id: 'art_studio', type: 'Art Studio', category: 'specialist', fixed: true },
    { id: 'music_room', type: 'Music Room', category: 'specialist', fixed: true },
    { id: 'multipurpose_hall', type: 'Multi-Purpose Hall (Cafeteria/Gym)', category: 'facility', fixed: true },
    { id: 'custodian_closet', type: 'Custodian Maintenance Closet', category: 'custodian', fixed: true }
  ];

  // Extract all teachers and staff from the faculty roster
  const allTeachers = [];
  Object.keys(facultyRoster).forEach((key) => {
    const rosterGroup = facultyRoster[key];
    if (Array.isArray(rosterGroup)) {
      rosterGroup.forEach((member) => {
        allTeachers.push({ ...member, categoryKey: key });
      });
    }
  });

  // Separate player teacher, fixed administration/support, and assignable classroom teachers
  const playerTeacher = allTeachers.find((t) => t.isPlayer);
  
  // Map fixed staff to their designated stations
  const assignments = {};
  
  // 1. Assign Administration
  const adminStaff = facultyRoster.administration || [];
  if (adminStaff[0]) assignments['principal_office'] = { slot: schoolSlots.find(s => s.id === 'principal_office'), teacher: adminStaff[0] };
  if (adminStaff[1]) assignments['admin_office'] = { slot: schoolSlots.find(s => s.id === 'admin_office'), teacher: adminStaff[1] };

  // 2. Assign Nurse
  const nurses = facultyRoster.nurses || [];
  if (nurses[0]) assignments['nurse_station'] = { slot: schoolSlots.find(s => s.id === 'nurse_station'), teacher: nurses[0] };

  // 3. Assign Specialists (Library, Art, Music, etc.)
  const specialists = facultyRoster.specialists || [];
  specialists.forEach((spec, idx) => {
    const slotId = idx === 0 ? 'library' : idx === 1 ? 'art_studio' : 'music_room';
    const targetSlot = schoolSlots.find(s => s.id === slotId);
    if (targetSlot) {
      assignments[slotId] = { slot: targetSlot, teacher: spec };
    }
  });

  // 4. Assign Custodians and Cafeteria Workers
  const custodians = facultyRoster.custodians || [];
  if (custodians[0]) {
    assignments['custodian_closet'] = { slot: schoolSlots.find(s => s.id === 'custodian_closet'), teacher: custodians[0] };
  }

  // 5. Gather remaining classroom teachers for random assignment
  const classroomSlots = schoolSlots.filter((s) => !s.fixed && s.size);
  const aiClassroomTeachers = allTeachers.filter((t) => !t.isPlayer && !adminStaff.includes(t) && !nurses.includes(t) && !specialists.includes(t) && !custodians.includes(t));

  classroomSlots.forEach((slot) => {
    const isPlayerSlot = playerTeacher && slot.type.toLowerCase().includes(String(playerGrade).toLowerCase());

    if (isPlayerSlot && !assignments[slot.id]) {
      assignments[slot.id] = {
        slot,
        teacher: playerTeacher,
        isOpenForPlayer: true
      };
      const playerIdx = aiClassroomTeachers.findIndex(t => t.isPlayer);
      if (playerIdx >= 0) aiClassroomTeachers.splice(playerIdx, 1);
    } else if (aiClassroomTeachers.length > 0) {
      const randomIndex = Math.floor(Math.random() * aiClassroomTeachers.length);
      const assignedTeacher = aiClassroomTeachers.splice(randomIndex, 1)[0];
      
      assignments[slot.id] = {
        slot,
        teacher: assignedTeacher,
        isOpenForPlayer: false
      };
    }
  });

  return {
    assignments,
    supportStaff: {
      cafeteriaWorkers: facultyRoster.cafeteria_workers || [],
      counselors: facultyRoster.counselors || []
    }
  };
}