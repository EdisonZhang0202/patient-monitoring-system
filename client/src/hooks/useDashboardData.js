import { useEffect } from "react";
import { formatVitalForChart } from "../utils/vitals";
import { fetchJson } from "../utils/api";

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
        const dashboardData = await fetchJson(
          "http://localhost:5000/api/dashboard"
        );

        setPatients(dashboardData.patients);
        setAlerts(dashboardData.alerts);
        setLatestVitals(dashboardData.latestVitals);
        setVitalsHistory(dashboardData.vitalsHistory);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      }
    };

    loadDashboardData();
  }, [
    setPatients,
    setLatestVitals,
    setVitalsHistory,
    setAlerts,
  ]);
};