import React, { useMemo, useState } from 'react';

const SUBJECTS = [
  { id: 'math', name: '📐 Mathematics', course: 'Math Foundations' },
  { id: 'science', name: '🧪 General Science', course: 'Earth & Life Science' },
  { id: 'history', name: '📜 Social Studies', course: 'Early Civilizations' },
  { id: 'english', name: '📝 Language Arts', course: 'Grammar & Composition' },
  { id: 'reading', name: '📚 Reading', course: 'Literature Circles' },
  { id: 'spanish', name: '🗣️ Spanish', course: 'Introductory Spanish' }
];

const BLOCK_TIMES = [
  { id: 'block1', label: 'Block 1', time: '8:00 AM - 9:00 AM', type: 'class' },
  { id: 'block2', label: 'Block 2', time: '9:00 AM - 10:00 AM', type: 'class' },
  { id: 'block3', label: 'Block 3', time: '10:00 AM - 11:00 AM', type: 'class' },
  { id: 'block4', label: 'Block 4', time: '11:00 AM - 12:00 PM', type: 'prep' },
  { id: 'block5', label: 'Block 5', time: '12:00 PM - 1:00 PM', type: 'class' },
  { id: 'block6', label: 'Block 6', time: '1:00 PM - 2:00 PM', type: 'class' }
];

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const GRADE_TO_WAVE = {
  6: 'Wave A (Early)',
  7: 'Wave B (Mid)',
  8: 'Wave C (Late)'
};

export default function MiddleSchoolScheduleStep({
  middleGrade,
  middleLunchWave,
  onLaunchGame,
  onBack,
  styles,
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const resolvedGrade = middleGrade || 6;
  const resolvedWave = middleLunchWave || GRADE_TO_WAVE[resolvedGrade] || 'Wave A (Early)';
  const effectiveSubjects = useMemo(() => {
    if (resolvedGrade === 8) {
      return SUBJECTS.filter((s) => s.id !== 'reading');
    }
    return SUBJECTS.filter((s) => s.id !== 'spanish');
  }, [resolvedGrade]);

  const selectedSubject = effectiveSubjects.find((s) => s.id === selectedSubjectId) || null;

  const autoScheduleRows = useMemo(() => {
    if (!selectedSubject) return [];

    let sectionCounter = 601;
    return BLOCK_TIMES.map((block) => {
      if (block.type === 'prep') {
        return {
          block,
          entry: { name: '☕ Teacher Prep Block', sec: null, isPrep: true },
        };
      }

      const entry = {
        name: selectedSubject.course,
        sec: `#${sectionCounter}`,
        isPrep: false,
      };
      sectionCounter += 1;
      return { block, entry };
    });
  }, [selectedSubject]);

  if (!selectedSubject) {
    return (
      <div style={{ ...styles.setupBox, maxWidth: '980px' }}>
        <h2 style={styles.heading}>🏫 MIDDLE SCHOOL SUBJECTS</h2>
        <p style={styles.subtitle}>Select one subject to lock and generate your fixed 5 x 6 schedule.</p>

        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <div style={{ color: '#fff', marginBottom: '6px' }}>
            Target Grade: <strong>{resolvedGrade}th</strong>
          </div>
          <div style={{ color: '#fff' }}>
            Lunch Wave: <strong>{resolvedWave}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '15px', width: '100%', justifyContent: 'center' }}>
            {effectiveSubjects.slice(0, 3).map((subject) => (
              <button key={subject.id} style={{ ...styles.menuButton, flex: 1, textAlign: 'center', padding: '20px' }} onClick={() => setSelectedSubjectId(subject.id)}>
                {subject.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '15px', width: '66.6%', justifyContent: 'center' }}>
            {effectiveSubjects.slice(3).map((subject) => (
              <button key={subject.id} style={{ ...styles.menuButton, flex: 1, textAlign: 'center', padding: '20px' }} onClick={() => setSelectedSubjectId(subject.id)}>
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        <button style={{ ...styles.exitButton, marginTop: '30px', width: '100%', maxWidth: '550px' }} onClick={onBack}>
          ← BACK
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...styles.setupBox, maxWidth: '980px' }}>
      <h2 style={styles.heading}>🏫 MIDDLE SCHOOL SCHEDULE</h2>
      <p style={styles.subtitle}>
        Grade {resolvedGrade} is locked. Subject is locked after selection; use Back to change it.
      </p>

      <div style={{ marginBottom: '16px', textAlign: 'left' }}>
        <div style={{ color: '#fff', marginBottom: '6px' }}>
          Target Grade: <strong>{resolvedGrade}th</strong>
        </div>
        <div style={{ color: '#fff' }}>
          Lunch Wave: <strong>{resolvedWave}</strong>
        </div>
      </div>

      <div style={{ backgroundColor: '#111', border: '2px solid #39FF14', padding: '20px', borderRadius: '8px', margin: '20px auto', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: '10px', marginBottom: '15px' }}>
          <h3 style={{ color: '#39FF14', margin: 0 }}>
            📅 Fixed 5 x 6 Weekly Grid ({selectedSubject.name})
          </h3>
          <div style={{ backgroundColor: '#222', padding: '6px 12px', borderRadius: '4px', border: '1px solid #ffa500', fontSize: '0.85rem' }}>
            🔒 Locked Lunch Alignment: <strong style={{ color: '#ffa500' }}>{resolvedWave}</strong>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '0.85rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #39FF14' }}>
              <th style={{ padding: '10px', color: '#888', width: '22%' }}>BLOCK / TIMES</th>
              {WEEK_DAYS.map((day) => (
                <th key={day} style={{ padding: '10px', fontWeight: 'bold', color: '#39FF14', textTransform: 'uppercase' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {autoScheduleRows.map(({ block, entry }) => (
              <tr key={block.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px 10px', borderRight: '1px solid #222' }}>
                  <div style={{ fontWeight: 'bold' }}>{block.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '2px' }}>{block.time}</div>
                </td>

                {WEEK_DAYS.map((day) => (
                  <td key={`${block.id}-${day}`} style={{ padding: '12px 10px', borderRight: '1px solid #222', verticalAlign: 'middle' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: entry.isPrep ? '#aaa' : '#fff' }}>{entry.name}</div>
                      {entry.sec && <div style={{ fontSize: '0.75rem', color: '#39FF14', marginTop: '2px' }}>Sec {entry.sec}</div>}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#1a1a1a', borderRadius: '4px', fontSize: '0.85rem', color: '#888', textAlign: 'left' }}>
          📌 Schedule is system-generated, section IDs stay in order, and editing is disabled.
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', width: '100%', maxWidth: '550px', margin: '0 auto' }}>
        <button style={{ ...styles.exitButton, flex: 1 }} onClick={() => setSelectedSubjectId(null)}>← BACK</button>
        <button
          style={{ ...styles.actionButton, flex: 2 }}
          onClick={() =>
            onLaunchGame({
              selectedGrade: resolvedGrade,
              wave: resolvedWave,
              selectedSubject: selectedSubject.id,
              selectedSubjectName: selectedSubject.name,
              msSchedule: autoScheduleRows,
            })
          }
        >
          🚀 CONFIRM SUBJECT & SELECT CLASS
        </button>
      </div>
    </div>
  );
}