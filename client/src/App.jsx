import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PatientDetail from "./pages/PatientDetail";
import PatientAlertHistory from "./pages/PatientAlertHistory";
import PatientActivityLog from "./pages/PatientActivityLog";
import NotesHistory from "./pages/NotesHistory";
import Login from "./pages/Login";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:patientId"
            element={
              <ProtectedRoute>
                <PatientDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:patientId/alerts"
            element={
              <ProtectedRoute>
                <PatientAlertHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:patientId/activity"
            element={
              <ProtectedRoute>
                <PatientActivityLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients/:patientId/notes"
            element={
              <ProtectedRoute>
                <NotesHistory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;