import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function PatientAlertHistory() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${patientId}`)
      .then((response) => response.json())
      .then((data) => setPatient(data));

    fetch("http://localhost:5000/api/alerts")
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data.filter((alert) => alert.patientId === patientId));
      });
  }, [patientId]);

  return (
    <div className="patient-detail-page">
      <Link to={`/patients/${patientId}`} className="back-link">
        ← Back to Patient
      </Link>

      <section className="patient-header">
        <div>
          <p className="patient-label">Alert History</p>
          <h1>{patient ? patient.name : "Patient"}</h1>
          {patient && (
            <p className="patient-subtitle">
              Room {patient.room} · {patient.diagnosis}
            </p>
          )}
        </div>
      </section>

      <section className="detail-section">
        <div className="section-header">
          <h2>All Alerts</h2>
          <span>{alerts.length} total</span>
        </div>

        <div className="preview-list">
          {alerts.map((alert) => (
            <div key={alert._id} className="preview-card">
              <strong>
                {alert.severity.toUpperCase()} - {alert.type}
              </strong>

              <p>{alert.message}</p>

              <p>
                Acknowledged: {alert.acknowledged ? "Yes" : "No"}
              </p>

              <small>
                {new Date(alert.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PatientAlertHistory;