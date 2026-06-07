import { useMemo, useState } from "react";

import AddPatientModal from "../components/AddPatientModal/AddPatientModal";
import AlertsPanel from "../components/AlertsPanel/AlertsPanel";
import DashboardHeader from "../components/DashboardHeader/DashboardHeader";
import PatientCard from "../components/PatientCard/PatientCard";
import EditPatientModal from "../components/EditPatientModal/EditPatientModal";
import DashboardStats from "../components/DashboardStats/DashboardStats";
import AlertDetailsModal from "../components/AlertDetailsModal/AlertDetailsModal";
import { fetchJson } from "../utils/api";

import {
  filterPatientsByStatus,
  searchPatients,
} from "../utils/patientFilters";

import {
  getSeverityRank,
  getVitalForAlertType,
} from "../utils/severity";

import { useDashboardSocket } from "../hooks/useDashboardSocket";
import { useDashboardData } from "../hooks/useDashboardData";

import "../styles/Dashboard.css";

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [latestVitals, setLatestVitals] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [isEditPatientOpen, setIsEditPatientOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientFilter, setPatientFilter] = useState("all");
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);

  useDashboardData({
    setPatients,
    setLatestVitals,
    setVitalsHistory,
    setAlerts,
  });

  useDashboardSocket({
    setLatestVitals,
    setVitalsHistory,
    setAlerts,
    setLastUpdated,
  });

  const patientLookup = useMemo(() => {
    return patients.reduce((map, patient) => {
      map[patient._id] = patient;

      return map;
    }, {});
  }, [patients]);

  const { patientAlertMap, alertsByPatient } = useMemo(() => {
    return alerts.reduce(
      (result, alert) => {
        if (!result.patientAlertMap[alert.patientId]) {
          result.patientAlertMap[alert.patientId] = [];
        }

        result.patientAlertMap[alert.patientId].push(alert);

        const patient = patientLookup[alert.patientId];

        if (!result.alertsByPatient[alert.patientId]) {
          result.alertsByPatient[alert.patientId] = {
            patient,
            alerts: [],
          };
        }

        result.alertsByPatient[alert.patientId].alerts.push(alert);

        return result;
      },
      {
        patientAlertMap: {},
        alertsByPatient: {},
      }
    );
  }, [alerts, patientLookup]);

  const selectedPatientAlerts = useMemo(() => {
    return selectedAlert
      ? alertsByPatient[selectedAlert.patientId]?.alerts || []
      : [];
  }, [selectedAlert, alertsByPatient]);

  const selectedAlertPatient = useMemo(() => {
    return selectedAlert
      ? patientLookup[selectedAlert.patientId]
      : null;
  }, [selectedAlert, patientLookup]);

  const selectedAlertVital = useMemo(() => {
    return selectedAlert
      ? latestVitals[selectedAlert.patientId]
      : null;
  }, [selectedAlert, latestVitals]);

  const sortedPatients = useMemo(() => {
    return [...patients].sort((a, b) => {
      const aAlerts = patientAlertMap[a._id] || [];
      const bAlerts = patientAlertMap[b._id] || [];

      const aDischarged = a.status === "discharged";
      const bDischarged = b.status === "discharged";

      if (aDischarged && !bDischarged) return 1;
      if (!aDischarged && bDischarged) return -1;

      const aHighest = Math.max(
        0,
        ...aAlerts.map((alert) =>
          getSeverityRank(alert.severity)
        )
      );

      const bHighest = Math.max(
        0,
        ...bAlerts.map((alert) =>
          getSeverityRank(alert.severity)
        )
      );

      if (aHighest !== bHighest) {
        return bHighest - aHighest;
      }

      if (aAlerts.length !== bAlerts.length) {
        return bAlerts.length - aAlerts.length;
      }

      return a.name.localeCompare(b.name);
    });
  }, [patients, patientAlertMap]);



  const filteredPatients = useMemo(() => {
    return filterPatientsByStatus({
      patients: sortedPatients,
      patientFilter,
      patientAlertMap,
    });
  }, [sortedPatients, patientFilter, patientAlertMap]);

  const searchedPatients = useMemo(() => {
    return searchPatients(filteredPatients, patientSearch);
  }, [filteredPatients, patientSearch]);

  const alertSummary = useMemo(() => {
    return alerts.reduce((summary, alert) => {
      if (!summary[alert.type]) {
        summary[alert.type] = {
          type: alert.type,
          count: 0,
          severity: alert.severity,
          vitalSign: getVitalForAlertType(alert.type),
        };
      }

      summary[alert.type].count += 1;

      if (
        getSeverityRank(alert.severity) >
        getSeverityRank(summary[alert.type].severity)
      ) {
        summary[alert.type].severity = alert.severity;
      }

      return summary;
    }, {});
  }, [alerts]);

  const acknowledgeAlert = async (alertId) => {
    try {
      await fetchJson(
        `http://localhost:5000/api/alerts/${alertId}/acknowledge`,
        {
          method: "PATCH",
        }
      );
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  };

  const handlePatientCreated = (createdPatient) => {
    setPatients((previousPatients) => [
      createdPatient,
      ...previousPatients,
    ]);
  };

  const handlePatientUpdated = (updatedPatient) => {
    setPatients((previousPatients) =>
      previousPatients.map((patient) =>
        patient._id === updatedPatient._id
          ? updatedPatient
          : patient
      )
    );
  };

  return (
    <div className="dashboard">
      <DashboardHeader
        lastUpdated={lastUpdated}
        onAddPatientClick={() =>
          setIsAddPatientOpen(true)
        }
      />

      <DashboardStats patients={patients} alerts={alerts} />

      <main className="dashboard-layout">
        <section className="patients-section">
          <div className="section-title">
            <h2>Patients</h2>
            <span>Alerts shown first</span>
          </div>

          <div className="patient-controls">
            <div className="patient-filters">
              <button
                className={patientFilter === "all" ? "active" : ""}
                onClick={() => setPatientFilter("all")}
              >
                All
              </button>

              <button
                className={patientFilter === "critical" ? "active" : ""}
                onClick={() => setPatientFilter("critical")}
              >
                Critical
              </button>

              <button
                className={patientFilter === "high" ? "active" : ""}
                onClick={() => setPatientFilter("high")}
              >
                High
              </button>

              <button
                className={patientFilter === "stable" ? "active" : ""}
                onClick={() => setPatientFilter("stable")}
              >
                Stable
              </button>

              <button
                className={patientFilter === "discharged" ? "active" : ""}
                onClick={() => setPatientFilter("discharged")}
              >
                Discharged
              </button>
            </div>
            <input
              className="patient-search"
              placeholder="Search patients by name, room, or diagnosis..."
              value={patientSearch}
              onChange={(event) => setPatientSearch(event.target.value)}
            />
          </div>

          <div className="patient-grid">
            {searchedPatients.map((patient) => {
              const vital =
                latestVitals[patient._id];

              const patientAlerts =
                patientAlertMap[patient._id] || [];

              return (
                <PatientCard
                  key={patient._id}
                  patient={patient}
                  vital={vital}
                  patientAlerts={patientAlerts}
                  vitalsHistory={vitalsHistory[patient._id]}
                  onEditPatient={(patient) => {
                    setSelectedPatient(patient);
                    setIsEditPatientOpen(true);
                  }}
                />
              );
            })}
          </div>
        </section>

        <AlertsPanel
          alerts={alerts}
          alertSummary={alertSummary}
          alertsByPatient={alertsByPatient}
          acknowledgeAlert={acknowledgeAlert}
          onAlertClick={setSelectedAlert}
        />
      </main>

      <AddPatientModal
        isOpen={isAddPatientOpen}
        onClose={() =>
          setIsAddPatientOpen(false)
        }
        onPatientCreated={handlePatientCreated}
      />
      <EditPatientModal
        isOpen={isEditPatientOpen}
        patient={selectedPatient}
        onClose={() => {
          setIsEditPatientOpen(false);
          setSelectedPatient(null);
        }}
        onPatientUpdated={handlePatientUpdated}
      />
      <AlertDetailsModal
        isOpen={Boolean(selectedAlert)}
        alert={selectedAlert}
        alerts={selectedPatientAlerts}
        patient={selectedAlertPatient}
        latestVital={selectedAlertVital}
        onClose={() => setSelectedAlert(null)}
        onAcknowledge={acknowledgeAlert}
      />
    </div>
  );
}

export default Dashboard;