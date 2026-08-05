// Room & Station Assignment Logic for Elementary School World

export function assignRoomsToStaff(facultyRoster, playerGrade, playerDepartment) {
  const schoolSlots = [
    { id: 'principal_office', type: 'Principal Office', category: 'admin', fixed: true },
    { id: 'nurse_station', type: 'Nurse Office', category: 'nurse', fixed: true },
    { id: 'k_room_a', type: 'Kindergarten', size: 'double', occupant: null },
    { id: 'k_room_b', type: 'Kindergarten', size: 'double', occupant: null },
    { id: 'grade_1_a', type: 'Grade 1', size: 'standard', occupant: null },
    { id: 'grade_1_b', type: 'Grade 1', size: 'standard', occupant: null },
    { id: 'grade_2_a', type: 'Grade 2', size: 'standard', occupant: null },
    { id: 'grade_3_sci', type: 'Grade 3 Science Lab', size: 'lab', occupant: null },
    { id: 'grade_4_sci', type: 'Grade 4 Science Lab', size: 'lab', occupant: null },
    { id: 'grade_5_sci', type: 'Grade 5 Science Lab', size: 'lab', occupant: null },
  ];

  const allTeachers = [];
  if (facultyRoster) {
    Object.keys(facultyRoster).forEach((key) => {
      const rosterGroup = facultyRoster[key];
      if (Array.isArray(rosterGroup)) {
        rosterGroup.forEach((member) => {
          allTeachers.push({ ...member, categoryKey: key });
        });
      }
    });
  }

  const playerTeacher = allTeachers.find((t) => t.isPlayer);
  const assignments = {};
  
  const adminStaff = facultyRoster?.administration || [];
  if (adminStaff[0]) assignments['principal_office'] = { slot: schoolSlots.find(s => s.id === 'principal_office'), teacher: adminStaff[0] };

  const nurses = facultyRoster?.nurses || [];
  if (nurses[0]) assignments['nurse_station'] = { slot: schoolSlots.find(s => s.id === 'nurse_station'), teacher: nurses[0] };

  const classroomSlots = schoolSlots.filter((s) => !s.fixed && s.size);
  const aiClassroomTeachers = allTeachers.filter((t) => !t.isPlayer && !adminStaff.includes(t) && !nurses.includes(t));

  classroomSlots.forEach((slot) => {
    const isPlayerSlot = playerTeacher && slot.type.toLowerCase().includes(String(playerGrade).toLowerCase());

    if (isPlayerSlot && !assignments[slot.id]) {
      assignments[slot.id] = { slot, teacher: playerTeacher, isOpenForPlayer: true };
      const playerIdx = aiClassroomTeachers.findIndex(t => t.isPlayer);
      if (playerIdx >= 0) aiClassroomTeachers.splice(playerIdx, 1);
    } else if (aiClassroomTeachers.length > 0) {
      const randomIndex = Math.floor(Math.random() * aiClassroomTeachers.length);
      const assignedTeacher = aiClassroomTeachers.splice(randomIndex, 1)[0];
      assignments[slot.id] = { slot, teacher: assignedTeacher, isOpenForPlayer: false };
    }
  });

  return { assignments };
}