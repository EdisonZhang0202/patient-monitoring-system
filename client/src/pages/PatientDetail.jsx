import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PatientNotes from "../components/PatientNotes/PatientNotes";
import "../styles/PatientDetail.css";

const getSeverityColor = (severity) => {
  switch (severity) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    default:
      return "#22c55e";
  }
};

function PatientDetail() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [latestVital, setLatestVital] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [events, setEvents] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${patientId}`)
      .then((response) => response.json())
      .then((data) => {
        setPatient(data);
      });

    fetch(
      `http://localhost:5000/api/patients/${patientId}/vitals`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setLatestVital(data[data.length - 1]);

          const formattedHistory = data.slice(-20).map((vital) => ({
  time: new Date(vital.timestamp).toLocaleTimeString(),
  heartRate: vital.heartRate,
  systolicBP: vital.systolicBP,
  diastolicBP: vital.diastolicBP,
  oxygenSaturation: vital.oxygenSaturation,
  temperature: vital.temperature,
}));

          setVitalsHistory(formattedHistory);
        }
      });

    fetch(`http://localhost:5000/api/alerts`)
      .then((response) => response.json())
      .then((data) => {
        const patientAlerts = data.filter(
          (alert) => alert.patientId === patientId
        );

        setAlerts(patientAlerts);
      });

    fetch(`http://localhost:5000/api/events?patientId=${patientId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  }, [patientId]);

  const activeAlerts = useMemo(() => {
    return alerts.filter((alert) => !alert.acknowledged);
  }, [alerts]);

  return (
    <div className="patient-detail-page">
      <Link to="/" className="back-link">
        ← Back to Dashboard
      </Link>

      {patient && (
        <section className="patient-header">
          <div>
            <p className="patient-label">Patient Monitor</p>

            <h1>{patient.name}</h1>

            <p className="patient-subtitle">
              Room {patient.room} · {patient.diagnosis}
            </p>
          </div>

          <div className="patient-status">
            {patient.status}
          </div>
        </section>
      )}

      <section className="detail-section">
        <div className="section-header">
          <h2>Active Alerts</h2>
          <span>{activeAlerts.length} active</span>
        </div>

        {activeAlerts.length === 0 ? (
          <p className="empty-state">
            No active alerts
          </p>
        ) : (
          <div className="alert-grid">
            {activeAlerts.map((alert) => (
              <div
                key={alert._id}
                className="alert-card"
                style={{
                  borderColor: getSeverityColor(alert.severity),
                }}
              >
                <div className="alert-card-header">
                  <strong
                    style={{
                      color: getSeverityColor(alert.severity),
                    }}
                  >
                    {alert.type}
                  </strong>

                  <span>{alert.severity}</span>
                </div>

                <p>{alert.message}</p>

                <small>
                  {new Date(alert.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        )}
        <PatientNotes patientId={patientId} />
      </section>

      <section className="detail-section">
        <div className="section-header">
          <h2>Vitals Trends</h2>
        </div>

        <div className="chart-layout">
  <div className="chart-card">
    <h3>Heart Rate</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={vitalsHistory}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="chart-card">
    <h3>Blood Pressure</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={vitalsHistory}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="systolicBP" stroke="#f97316" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="diastolicBP" stroke="#facc15" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="chart-card">
    <h3>Oxygen Saturation</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={vitalsHistory}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="oxygenSaturation" stroke="#3b82f6" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  <div className="chart-card">
    <h3>Temperature</h3>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={vitalsHistory}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temperature" stroke="#a855f7" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>
      </section>

      <section className="detail-section">
        <div className="section-header">
          <h2>Alert History</h2>

          <Link
            to={`/patients/${patientId}/alerts`}
            className="section-link"
          >
            View Full History →
          </Link>
        </div>

        <div className="preview-list">
          {alerts.slice(0, 10).map((alert) => (
            <div
              key={alert._id}
              className="preview-card"
            >
              <strong>{alert.type}</strong>

              <p>{alert.message}</p>

              <small>
                {new Date(alert.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <div className="section-header">
          <h2>Recent Activity</h2>

          <Link
            to={`/patients/${patientId}/activity`}
            className="section-link"
          >
            View Full Activity →
          </Link>
        </div>

        <div className="preview-list">
          {events.slice(0, 10).map((event) => (
            <div
              key={event._id}
              className="preview-card"
            >
              <strong>{event.eventType}</strong>

              <p>{event.description}</p>

              <small>
                {new Date(event.timestamp).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PatientDetail;