import {
  getSeverityColor,
  sortAlertsBySeverity,
} from "../../utils/severity";
import "./AlertsPanel.css";

function AlertsPanel({
  alerts,
  alertSummary,
  alertsByPatient,
  acknowledgeAlert,
  onAlertClick,
}) {
  
  const getAlertDisplay = (alert) => {
    const match = alert.message.match(/(\d+(\.\d+)?)/);
    
    const value = match ? match[0] : "";
    
    switch (alert.type) {
      case "tachycardia":
      case "bradycardia":
      return `HR ${value} bpm`;
      
      case "hypoxia":
      return `SpO₂ ${value}%`;
      
      case "hypertension":
      return `BP ${value} mmHg`;
      
      case "fever":
      return `${value}°F`;
      
      default:
      return alert.message;
    }
  };
  
  return (
    <aside className="alerts-panel">
    <div className="alerts-panel-header">
    <div>
    <p className="eyebrow">Active</p>
    <h2>Alerts Summary</h2>
    </div>
    
    <span className="alert-count">{alerts.length}</span>
    </div>
    
    {alerts.length === 0 ? (
      <p className="empty-alerts">No active alerts</p>
    ) : (
      <div className="summary-list">
      {Object.values(alertSummary).map((item) => (
        <div className="summary-row" key={item.type}>
        <div>
        <strong style={{ color: getSeverityColor(item.severity) }}>
        {item.type}
        </strong>
        <p>{item.vitalSign}</p>
        </div>
        
        <span
        className="summary-count"
        style={{
          borderColor: getSeverityColor(item.severity),
          color: getSeverityColor(item.severity),
        }}
        >
        {item.count}
        </span>
        </div>
      ))}
      </div>
    )}
    
    <div className="active-alert-list">
    <h3>Current Alerts</h3>
    
    {Object.entries(alertsByPatient).map(([patientId, group]) => (
      <div className="patient-alert-group" key={patientId}>
      <div
      className="active-alert-card grouped-alert-card"
      onClick={() => onAlertClick(group.alerts[0])}
      >
      <div>
      <div className="grouped-alert-header">
      <strong>
      {group.patient
        ? `${group.patient.name} · Room ${group.patient.room}`
        : "Unknown patient"}
        </strong>
        
        <div
        className="grouped-alert-severity"
        style={{
          color: getSeverityColor(
            sortAlertsBySeverity(group.alerts)[0].severity
          ),
        }}
        >
        ●{" "}
        {sortAlertsBySeverity(group.alerts)[0].severity
          .charAt(0)
          .toUpperCase() +
          sortAlertsBySeverity(group.alerts)[0].severity.slice(1)}
          </div>
          
          <span>
          {group.alerts.length} Active Alert
          {group.alerts.length > 1 ? "s" : ""}
          </span>
          </div>
          
          <div className="grouped-alert-list">
          {sortAlertsBySeverity(group.alerts).map((alert) => (
            <div
            key={alert._id}
            className="grouped-alert-item"
            >
            <span
            className="alert-type"
            style={{
              color: getSeverityColor(alert.severity),
            }}
            >
            {alert.type}
            </span>
            
            <span className="alert-value">
            {getAlertDisplay(alert)}
            </span>
            </div>
          ))}
          </div>
          </div>
          
          <button
          onClick={(event) => {
            event.stopPropagation();
            
            group.alerts.forEach((alert) => {
              acknowledgeAlert(alert._id);
            });
          }}
          className="ack-button"
          title="Acknowledge all alerts"
          >
          ✓
          </button>
          </div>
          </div>
        ))}
        </div>
        </aside>
      );
    }
    
    export default AlertsPanel;