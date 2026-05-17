import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PatientDetail from "./pages/PatientDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route
          path="/patients/:patientId"
          element={<PatientDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;