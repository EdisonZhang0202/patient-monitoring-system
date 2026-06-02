import { useEffect } from "react";
import { formatVitalForChart } from "../utils/vitals";

const fetchJson = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

const loadPatientVitals = async (patient) => {
  const vitals = await fetchJson(
    `http://localhost:5000/api/patients/${patient._id}/vitals`
  );

  const recentVitals = vitals.slice(0, 10).reverse();

  if (recentVitals.length === 0) {
    return {
      patientId: patient._id,
      latestVital: null,
      chartHistory: [],
    };
  }

  return {
    patientId: patient._id,
    latestVital: recentVitals[recentVitals.length - 1],
    chartHistory: recentVitals.map(formatVitalForChart),
  };
};

export const useDashboardData = ({
  setPatients,
  setLatestVitals,
  setVitalsHistory,
  setAlerts,
}) => {
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const patients = await fetchJson("http://localhost:5000/api/patients");

        if (!Array.isArray(patients)) {
          console.error("Expected patients array but received:", patients);
          setPatients([]);
          return;
        }

        setPatients(patients);

        const patientVitals = await Promise.all(
          patients.map((patient) => loadPatientVitals(patient))
        );

        setLatestVitals((previousVitals) => {
          const nextVitals = { ...previousVitals };

          patientVitals.forEach(({ patientId, latestVital }) => {
            if (latestVital) {
              nextVitals[patientId] = latestVital;
            }
          });

          return nextVitals;
        });

        setVitalsHistory((previousHistory) => {
          const nextHistory = { ...previousHistory };

          patientVitals.forEach(({ patientId, chartHistory }) => {
            if (chartHistory.length > 0) {
              nextHistory[patientId] = chartHistory;
            }
          });

          return nextHistory;
        });
      } catch (error) {
        console.error("Failed to load dashboard patients:", error);
      }

      try {
        const alerts = await fetchJson("http://localhost:5000/api/alerts");

        if (!Array.isArray(alerts)) {
          console.error("Expected alerts array but received:", alerts);
          setAlerts([]);
          return;
        }

        setAlerts(alerts.filter((alert) => !alert.acknowledged));
      } catch (error) {
        console.error("Failed to load dashboard alerts:", error);
      }
    };

    loadDashboardData();
  }, [setPatients, setLatestVitals, setVitalsHistory, setAlerts]);
};