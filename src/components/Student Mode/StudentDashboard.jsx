function StudentDashboard({ onExit }) {
  return (
    <div className="student-dashboard">
      <h2>Student Mode</h2>
      <p>Student gameplay is not configured yet.</p>
      <button onClick={onExit}>Back to Main Menu</button>
    </div>
  );
}

export default StudentDashboard;
