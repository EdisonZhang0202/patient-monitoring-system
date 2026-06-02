import { useEffect, useState } from "react";
import "./PatientNotes.css";

function PatientNotes({ patientId }) {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/patients/${patientId}/notes`)
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => {
        console.error("Failed to fetch notes:", error);
      });
  }, [patientId]);

  const createNote = async (event) => {
    event.preventDefault();

    if (!noteText.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/patients/${patientId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            note: noteText,
            author: "Clinician",
          }),
        }
      );

      const createdNote = await response.json();

      setNotes((previousNotes) => [createdNote, ...previousNotes]);
      setNoteText("");
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  return (
    <section className="detail-section">
      <div className="section-header">
        <h2>Patient Notes</h2>
        <span>{notes.length} notes</span>
      </div>

      <form className="note-form" onSubmit={createNote}>
        <textarea
          placeholder="Add a patient note..."
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
        />

        <button type="submit">Add Note</button>
      </form>

      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="empty-state">No notes added</p>
        ) : (
          notes.slice(0, 5).map((note) => (
            <div className="note-card" key={note._id}>
              <p>{note.note}</p>

              <small>
                {note.author} · {new Date(note.timestamp).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default PatientNotes;