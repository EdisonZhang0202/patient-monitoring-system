import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../utils/api";

function PatientActivityLog() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchJson(`http://localhost:5000/api/patients/${patientId}`)
      .then((data) => setPatient(data));

    fetchJson(`http://localhost:5000/api/events?patientId=${patientId}`)
      .then((data) => setEvents(data));
  }, [patientId]);

  return (
    <div className="patient-detail-page">
      <Link to={`/patients/${patientId}`} className="back-link">
        ← Back to Patient
      </Link>

      <section className="patient-header">
        <div>
          <p className="patient-label">Activity Log</p>
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
          <h2>All Activity</h2>
          <span>{events.length} events</span>
        </div>

        <div className="preview-list">
          {events.map((event) => (
            <div key={event._id} className="preview-card">
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

export default PatientActivityLog;