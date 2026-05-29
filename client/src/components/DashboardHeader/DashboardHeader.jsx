function DashboardHeader({ lastUpdated, onAddPatientClick }) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">Live Clinical Monitoring</p>
        <h1>Patient Monitoring Dashboard</h1>
        <p className="subtitle">Real-time overview of monitored patients</p>
      </div>

      <div className="header-status">
        <span>
          Last updated:{" "}
          {lastUpdated ? lastUpdated.toLocaleTimeString() : "Waiting..."}
        </span>

        <span className="live-dot" />
        <span>Live</span>

        <button
          className="add-patient-button"
          onClick={onAddPatientClick}
        >
          + Add New Patient
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;