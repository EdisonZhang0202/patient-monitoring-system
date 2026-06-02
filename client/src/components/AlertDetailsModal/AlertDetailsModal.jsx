import "./AlertDetailsModal.css";

function AlertDetailsModal({
    isOpen,
    alert,
    alerts = [],
    patient,
    latestVital,
    onClose,
    onAcknowledge,
}) {
    if (!isOpen || !alert) {
        return null;
    }

    const criticalCount = alerts.filter(
        (alert) => alert.severity === "critical"
    ).length;

    const highCount = alerts.filter(
        (alert) => alert.severity === "high"
    ).length;

    return (
        <div className="alert-modal-backdrop">
            <div className="alert-details-modal">
                <div className="alert-modal-header">
                    <div>
                        <p className="alert-modal-label">Alert Details</p>
                        <h2>{alert.type}</h2>
                    </div>

                    <button
                        type="button"
                        className="alert-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="alert-detail-grid">
                    <div>
                        <span>Patient</span>
                        <strong>{patient ? patient.name : "Unknown patient"}</strong>
                    </div>

                    <div>
                        <span>Room</span>
                        <strong>{patient ? patient.room : "N/A"}</strong>
                    </div>

                    <div>
                        <span>Status</span>
                        <strong>
                            {alerts.length > 0 ? "Active" : "No Active Alerts"}
                        </strong>
                    </div>

                    <div>
                        <span>Critical Alerts</span>
                        <strong>{criticalCount}</strong>
                    </div>

                    <div>
                        <span>High Alerts</span>
                        <strong>{highCount}</strong>
                    </div>
                </div>

                <div className="alert-message-box">
                    <h3>Active Alerts</h3>

                    {alerts.map((patientAlert) => (
                        <div key={patientAlert._id} className="modal-alert-row">
                            <div className="modal-alert-title">
                                <div className="modal-alert-info">
                                    <strong>{patientAlert.type}</strong>

                                    <span className={`modal-severity-badge ${patientAlert.severity}`}>
                                        {patientAlert.severity}
                                    </span>
                                </div>

                                {!patientAlert.acknowledged && (
                                    <button
                                        type="button"
                                        className="modal-alert-ack"
                                        onClick={() => onAcknowledge(patientAlert._id)}
                                        title="Acknowledge alert"
                                    >
                                        ✓
                                    </button>
                                )}
                            </div>

                            <p>{patientAlert.message}</p>
                            <small>{new Date(patientAlert.timestamp).toLocaleString()}</small>
                        </div>
                    ))}
                </div>

                {latestVital && (
                    <div className="alert-message-box">
                        <h3>Current Vitals</h3>
                        <p>HR: {latestVital.heartRate} bpm</p>
                        <p>
                            BP: {latestVital.systolicBP}/{latestVital.diastolicBP} mmHg
                        </p>
                        <p>SpO₂: {latestVital.oxygenSaturation}%</p>
                        <p>Temp: {latestVital.temperature}°F</p>
                    </div>
                )}

                {!alert.acknowledged && (
                    <button
                        type="button"
                        className="alert-ack-button"
                        onClick={() => {
                            alerts.forEach((patientAlert) => {
                                onAcknowledge(patientAlert._id);
                            });

                            onClose();
                        }}
                    >
                        ✓ Acknowledge All Alerts
                    </button>
                )}
            </div>
        </div>
    );
}

export default AlertDetailsModal;