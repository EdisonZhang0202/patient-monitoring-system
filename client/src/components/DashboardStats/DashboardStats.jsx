function DashboardStats({ patients, alerts }) {
  const totalPatients = patients.length;

  const activePatients = patients.filter(
    (patient) => patient.status !== "discharged"
  ).length;

  const dischargedPatients = patients.filter(
    (patient) => patient.status === "discharged"
  ).length;

  const criticalPatients = alerts.filter(
    (alert) => alert.severity === "critical"
  ).length;

  return (
    <section className="dashboard-stats">
      <div className="stat-card">
        <span>Total Patients</span>
        <strong>{totalPatients}</strong>
      </div>

      <div className="stat-card">
        <span>Active Patients</span>
        <strong>{activePatients}</strong>
      </div>

      <div className="stat-card">
        <span>Active Alerts</span>
        <strong>{alerts.length}</strong>
      </div>

      <div className="stat-card">
        <span>Critical Alerts</span>
        <strong>{criticalPatients}</strong>
      </div>

      <div className="stat-card">
        <span>Discharged</span>
        <strong>{dischargedPatients}</strong>
      </div>
    </section>
  );
}

export default DashboardStats;