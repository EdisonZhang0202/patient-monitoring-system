import { Link, useParams } from "react-router-dom";

function PatientAlertHistory() {
  const { patientId } = useParams();

  return (
    <div>
      <Link to={`/patients/${patientId}`}>← Back to Patient</Link>
      <h1>Alert History</h1>
      <p>Patient ID: {patientId}</p>
    </div>
  );
}

export default PatientAlertHistory;