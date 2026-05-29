import { Link } from "react-router-dom";
import MiniVitalsCharts from "../MiniVitalsCharts/MiniVitalsCharts";
import {
  getSeverityRank,
  getSeverityColor,
} from "../../utils/severity";

function PatientCard({
  patient,
  vital,
  patientAlerts,
  vitalsHistory,
  onEditPatient,
}) {
  
  const highestSeverity =
  patientAlerts.length > 0
  ? patientAlerts.reduce((highest, alert) =>
    getSeverityRank(alert.severity) >
  getSeverityRank(highest.severity)
  ? alert
  : highest
).severity
: "stable";

const isDischarged = patient.status === "discharged";

const displayStatus =
isDischarged
? "discharged"
: patientAlerts.length > 0
? highestSeverity
: patient.status;

const displayColor =
isDischarged
? "#94a3b8"
: getSeverityColor(highestSeverity);

return (
  <article
  className="patient-card"
  style={{
    borderColor: displayColor,
    opacity: isDischarged ? 0.6 : 1,
  }}
  >
  <div className="patient-card-header">
  <div>
  <h3>{patient.name}</h3>
  <p>
  Room {patient.room} · Age {patient.age}
  </p>
  <p>{patient.diagnosis}</p>
  </div>
  
  <span
  className="status-pill"
  style={{
    color: displayColor,
    borderColor: displayColor,
  }}
  >
  {displayStatus}
  </span>
  </div>
  
  {vital && (
    <div className="vitals-grid">
    <div className="vital-box">
    <span>HR</span>
    <strong>{vital.heartRate}</strong>
    <small>bpm</small>
    </div>
    
    <div className="vital-box">
    <span>BP</span>
    <strong>
    {vital.systolicBP}/{vital.diastolicBP}
    </strong>
    <small>mmHg</small>
    </div>
    
    <div className="vital-box">
    <span>SpO₂</span>
    <strong>{vital.oxygenSaturation}%</strong>
    <small>oxygen</small>
    </div>
    
    <div className="vital-box">
    <span>Temp</span>
    <strong>{vital.temperature}°F</strong>
    <small>temp</small>
    </div>
    </div>
  )}
  
  <MiniVitalsCharts vitalsHistory={vitalsHistory} />
  
  <div className="card-alerts">
  {patientAlerts.length === 0 ? (
    <p className="no-alerts">✓ No active alerts</p>
  ) : (
    <>
    <p className="alert-label">Active Alerts</p>
    
    <div className="alert-chip-list">
    {patientAlerts.map((alert) => (
      <span
      key={alert._id}
      className="alert-chip"
      style={{
        borderColor: getSeverityColor(alert.severity),
        color: getSeverityColor(alert.severity),
      }}
      >
      {alert.type}
      </span>
    ))}
    </div>
    </>
  )}
  </div>
  
  <div className="patient-card-actions">
  <Link
  to={`/patients/${patient._id}`}
  className="patient-card-button"
  >
  View Details
  </Link>
  
  <button
  type="button"
  className="patient-card-button secondary"
  onClick={() => onEditPatient(patient)}
  >
  Edit
  </button>
  </div>
  </article>
);
}

export default PatientCard;