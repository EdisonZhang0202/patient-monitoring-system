import { useEffect, useState } from "react";
import { fetchJson } from "../../utils/api";
import "./EditPatientModal.css";

function EditPatientModal({ isOpen, patient, onClose, onPatientUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    room: "",
    diagnosis: "",
    status: "stable",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        age: patient.age || "",
        room: patient.room || "",
        diagnosis: patient.diagnosis || "",
        status: patient.status || "stable",
      });
    }
  }, [patient]);

  if (!isOpen || !patient) {
    return null;
  }

  const updatePatient = async (event) => {
    event.preventDefault();

    try {
      const updatedPatient = await fetchJson(
        `http://localhost:5000/api/patients/${patient._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            age: Number(formData.age),
          }),
        }
      );

      onPatientUpdated(updatedPatient);
      onClose();
    } catch (error) {
      console.error("Failed to update patient:", error);
    }
  };

  return (
    <div className="edit-modal-backdrop">
      <form className="edit-patient-modal" onSubmit={updatePatient}>
        <div className="edit-modal-header">
          <h2>Edit Patient</h2>

          <button type="button" className="edit-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <input
          placeholder="Name"
          value={formData.name}
          onChange={(event) =>
            setFormData({ ...formData, name: event.target.value })
          }
          required
        />

        <input
          placeholder="Age"
          type="number"
          value={formData.age}
          onChange={(event) =>
            setFormData({ ...formData, age: event.target.value })
          }
          required
        />

        <input
          placeholder="Room"
          value={formData.room}
          onChange={(event) =>
            setFormData({ ...formData, room: event.target.value })
          }
          required
        />

        <input
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChange={(event) =>
            setFormData({ ...formData, diagnosis: event.target.value })
          }
          required
        />

        <select
          value={formData.status}
          onChange={(event) =>
            setFormData({ ...formData, status: event.target.value })
          }
        >
          <option value="stable">Stable</option>
          <option value="monitoring">Monitoring</option>
          <option value="critical">Critical</option>
          <option value="discharged">Discharged</option>
        </select>

        <button type="submit" className="edit-modal-submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditPatientModal;