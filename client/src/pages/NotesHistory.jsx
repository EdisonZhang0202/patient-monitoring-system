import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../utils/api";
import "../styles/NotesHistory.css";

function NotesHistory() {
  const { patientId } = useParams();

  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchJson(`http://localhost:5000/api/patients/${patientId}`)
      .then((data) => setPatient(data));

    fetchJson(`http://localhost:5000/api/patients/${patientId}/notes`)
      .then((data) => setNotes(data))
      .then((data) => setNotes(data))
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
      });
  }, [patientId]);

  return (
    <div className="notes-history-page">
      <Link to={`/patients/${patientId}`} className="back-link">
        ← Back to Patient
      </Link>

      <section className="notes-history-header">
        <p className="patient-label">Notes History</p>
        <h1>{patient ? patient.name : "Patient"}</h1>

        {patient && (
          <p className="patient-subtitle">
            Room {patient.room} · {patient.diagnosis}
          </p>
        )}
      </section>

      <section className="notes-history-section">
        <div className="section-header">
          <h2>All Notes</h2>
          <span>{notes.length} total</span>
        </div>

        <div className="notes-history-list">
          {notes.length === 0 ? (
            <p className="empty-state">No notes found</p>
          ) : (
            notes.map((note) => (
              <div className="notes-history-card" key={note._id}>
                <p>{note.note}</p>

                <small>
                  {note.author} · {new Date(note.timestamp).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default NotesHistory;