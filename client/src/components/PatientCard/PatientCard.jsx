import { Link } from "react-router-dom";
import MiniVitalsCharts from "../MiniVitalsCharts/MiniVitalsCharts";
import {
  getSeverityRank,
  getSeverityColor,
  sortAlertsBySeverity,
} from "../../utils/severity";
import "./PatientCard.css";

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

const getAlertForVital = (vitalType) => {
  return patientAlerts.find((alert) => {
    if (vitalType === "heartRate") {
      return (
        alert.type === "tachycardia" ||
        alert.type === "bradycardia"
      );
    }
    
    if (vitalType === "bloodPressure") {
      return alert.type === "hypertension";
    }
    
    if (vitalType === "oxygenSaturation") {
      return alert.type === "hypoxia";
    }
    
    if (vitalType === "temperature") {
      return alert.type === "fever";
    }
    
    return false;
  });
};

const getVitalBoxStyle = (vitalType) => {
  const alert = getAlertForVital(vitalType);
  
  if (!alert) {
    return {};
  }
  
  return {
    borderColor: getSeverityColor(alert.severity),
    boxShadow: `0 0 0 1px ${getSeverityColor(alert.severity)}`,
  };
};

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
    <div
    className="vital-box"
    style={getVitalBoxStyle("heartRate")}
    >
    <span>HR</span>
    <strong>{vital.heartRate}</strong>
    <small>bpm</small>
    </div>
    
    <div
    className="vital-box"
    style={getVitalBoxStyle("bloodPressure")}
    >
    <span>BP</span>
    <strong>
    {vital.systolicBP}/{vital.diastolicBP}
    </strong>
    <small>mmHg</small>
    </div>
    
    <div
    className="vital-box"
    style={getVitalBoxStyle("oxygenSaturation")}
    >
    <span>SpO₂</span>
    <strong>{vital.oxygenSaturation}%</strong>
    <small>oxygen</small>
    </div>
    
    <div
    className="vital-box"
    style={getVitalBoxStyle("temperature")}
    >
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
    {sortAlertsBySeverity(patientAlerts).map((alert) => (
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