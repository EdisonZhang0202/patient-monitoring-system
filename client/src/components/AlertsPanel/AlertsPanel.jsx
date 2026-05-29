import { getSeverityColor } from "../../utils/severity";

function AlertsPanel({
  alerts,
  alertSummary,
  alertsByPatient,
  acknowledgeAlert,
}) {
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
            <h4>
              {group.patient
                ? `${group.patient.name} · Room ${group.patient.room}`
                : "Unknown patient"}
            </h4>

            {group.alerts.map((alert) => (
              <div className="active-alert-card" key={alert._id}>
                <div>
                  <strong style={{ color: getSeverityColor(alert.severity) }}>
                    {alert.type}
                  </strong>

                  <p>{alert.message}</p>
                  <small>{new Date(alert.timestamp).toLocaleString()}</small>
                </div>

                <button
                  onClick={() => acknowledgeAlert(alert._id)}
                  className="ack-button"
                  title="Acknowledge alert"
                >
                  ✓
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default AlertsPanel;