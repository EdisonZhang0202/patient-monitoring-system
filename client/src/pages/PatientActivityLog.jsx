import { Link, useParams } from "react-router-dom";

function PatientActivityLog() {
  const { patientId } = useParams();

  return (
    <div>
      <Link to={`/patients/${patientId}`}>← Back to Patient</Link>
      <h1>Activity Log</h1>
      <p>Patient ID: {patientId}</p>
    </div>
  );
}

export default PatientActivityLog;