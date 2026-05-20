import { useState } from "react";
import "./AddPatientModal.css";

function AddPatientModal({ isOpen, onClose, onPatientCreated }) {
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    room: "",
    diagnosis: "",
    status: "stable",
  });

  if (!isOpen) {
    return null;
  }

  const createPatient = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPatient,
          age: Number(newPatient.age),
        }),
      });

      const createdPatient = await response.json();

      onPatientCreated(createdPatient);

      setNewPatient({
        name: "",
        age: "",
        room: "",
        diagnosis: "",
        status: "stable",
      });

      onClose();
    } catch (error) {
      console.error("Failed to create patient:", error);
    }
  };

  return (
    <div className="modal-backdrop">
      <form className="patient-modal" onSubmit={createPatient}>
        <div className="modal-header">
          <h2>Add New Patient</h2>

          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <input
          placeholder="Name"
          value={newPatient.name}
          onChange={(event) =>
            setNewPatient({ ...newPatient, name: event.target.value })
          }
          required
        />

        <input
          placeholder="Age"
          type="number"
          value={newPatient.age}
          onChange={(event) =>
            setNewPatient({ ...newPatient, age: event.target.value })
          }
          required
        />

        <input
          placeholder="Room"
          value={newPatient.room}
          onChange={(event) =>
            setNewPatient({ ...newPatient, room: event.target.value })
          }
          required
        />

        <input
          placeholder="Diagnosis"
          value={newPatient.diagnosis}
          onChange={(event) =>
            setNewPatient({ ...newPatient, diagnosis: event.target.value })
          }
          required
        />

        <select
          value={newPatient.status}
          onChange={(event) =>
            setNewPatient({ ...newPatient, status: event.target.value })
          }
        >
          <option value="stable">Stable</option>
          <option value="monitoring">Monitoring</option>
          <option value="critical">Critical</option>
        </select>

        <button type="submit" className="modal-submit">
          Add Patient
        </button>
      </form>
    </div>
  );
}

export default AddPatientModal;