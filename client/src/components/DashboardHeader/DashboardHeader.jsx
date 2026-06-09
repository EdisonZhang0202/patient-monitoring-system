import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DashboardHeader({ lastUpdated, onAddPatientClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="dashboard-header">
      <div>
        <p className="eyebrow">Live Clinical Monitoring</p>
        <h1>Patient Monitoring Dashboard</h1>
        <p className="subtitle">Real-time overview of monitored patients</p>
      </div>

      <div className="header-status">
        <span>
          {user ? `${user.name} · ${user.role}` : "Not signed in"}
        </span>

        <span>
          Last updated:{" "}
          {lastUpdated ? lastUpdated.toLocaleTimeString() : "Waiting..."}
        </span>

        <span className="live-dot" />
        <span>Live</span>

        <button className="add-patient-button" onClick={onAddPatientClick}>
          + Add New Patient
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;