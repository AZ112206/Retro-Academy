import React from 'react';

const DEFAULT_PERIODS = ['Period 1', 'Period 2', 'Period 3', 'Period 4'];

export default function AutomatedPlacementStep({
  department,
  scheduleGrid,
  setScheduleGrid,
  assignedPeriods,
  setAssignedPeriods,
  conflicts,
  setConflicts,
  onBack,
}) {
  const selectedDepartment = department || 'Unassigned Department';

  const handleAutoFill = () => {
    const generated = {};
    DEFAULT_PERIODS.forEach((period, idx) => {
      generated[period] = `${selectedDepartment} Slot ${idx + 1}`;
    });

    setScheduleGrid(generated);
    setAssignedPeriods(DEFAULT_PERIODS);
    setConflicts([]);
  };

  const handleClear = () => {
    setScheduleGrid({});
    setAssignedPeriods([]);
    setConflicts([]);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Automated Placement</h2>
      <p style={styles.subtitle}>Department: {selectedDepartment}</p>

      <div style={styles.actions}>
        <button style={styles.primaryButton} onClick={handleAutoFill}>Run Auto Placement</button>
        <button style={styles.secondaryButton} onClick={handleClear}>Clear Placement</button>
        <button style={styles.backButton} onClick={onBack}>Back</button>
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelHeading}>Assigned Periods</h3>
        {assignedPeriods.length === 0 ? (
          <p style={styles.empty}>No periods assigned yet.</p>
        ) : (
          <ul style={styles.list}>
            {assignedPeriods.map((period) => (
              <li key={period} style={styles.item}>
                <strong>{period}</strong>: {scheduleGrid[period] || 'Pending'}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.panel}>
        <h3 style={styles.panelHeading}>Conflicts</h3>
        {conflicts.length === 0 ? (
          <p style={styles.empty}>No conflicts detected.</p>
        ) : (
          <ul style={styles.list}>
            {conflicts.map((conflict, index) => (
              <li key={`${conflict}-${index}`} style={styles.item}>{conflict}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    border: '2px solid #39FF14',
    borderRadius: '10px',
    padding: '24px',
    backgroundColor: '#121212',
    color: '#39FF14',
  },
  heading: {
    marginTop: 0,
    marginBottom: '8px',
    fontSize: '1.5rem',
  },
  subtitle: {
    marginTop: 0,
    marginBottom: '16px',
    color: '#9ae88d',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  primaryButton: {
    backgroundColor: '#39FF14',
    color: '#000',
    border: 'none',
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontWeight: 'bold',
    borderRadius: '4px',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#39FF14',
    border: '1px solid #39FF14',
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: '4px',
  },
  backButton: {
    backgroundColor: 'transparent',
    color: '#ff6688',
    border: '1px solid #ff6688',
    padding: '10px 14px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    borderRadius: '4px',
  },
  panel: {
    marginTop: '16px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #39FF14',
    borderRadius: '6px',
    padding: '12px',
  },
  panelHeading: {
    margin: '0 0 8px 0',
    fontSize: '1rem',
  },
  empty: {
    margin: 0,
    color: '#9aa39a',
  },
  list: {
    margin: 0,
    paddingLeft: '18px',
  },
  item: {
    marginBottom: '6px',
  },
};
