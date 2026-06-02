import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PatientDetail from "./pages/PatientDetail";
import PatientAlertHistory from "./pages/PatientAlertHistory";
import PatientActivityLog from "./pages/PatientActivityLog";
import NotesHistory from "./pages/NotesHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/patients/:patientId" element={<PatientDetail />} />

        <Route
          path="/patients/:patientId/alerts"
          element={<PatientAlertHistory />}
        />

        <Route
          path="/patients/:patientId/activity"
          element={<PatientActivityLog />}
        />

        <Route
          path="/patients/:patientId/notes"
          element={<NotesHistory />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;