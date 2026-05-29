import { useEffect } from "react";

const formatVitalForChart = (vital) => ({
  time: new Date(vital.timestamp).toLocaleTimeString(),
  heartRate: vital.heartRate,
  systolicBP: vital.systolicBP,
  diastolicBP: vital.diastolicBP,
  oxygenSaturation: vital.oxygenSaturation,
  temperature: vital.temperature,
});

export const useDashboardData = ({
  setPatients,
  setLatestVitals,
  setVitalsHistory,
  setAlerts,
}) => {
  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);

        data.forEach(async (patient) => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/patients/${patient._id}/vitals`
            );

            if (!response.ok) return;

            const vitals = await response.json();

            const recentVitals = vitals.slice(0, 10).reverse();

            if (recentVitals.length > 0) {
              const latestVital = recentVitals[recentVitals.length - 1];

              setLatestVitals((previousVitals) => ({
                ...previousVitals,
                [patient._id]: latestVital,
              }));

              setVitalsHistory((previousHistory) => ({
                ...previousHistory,
                [patient._id]: recentVitals.map(formatVitalForChart),
              }));
            }
          } catch (error) {
            console.error("Failed to fetch patient vitals:", error);
          }
        });
      })
      .catch((error) => {
        console.error("Failed to fetch patients:", error);
      });

    fetch("http://localhost:5000/api/alerts")
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data.filter((alert) => !alert.acknowledged));
      })
      .catch((error) => {
        console.error("Failed to fetch alerts:", error);
      });
  }, [setPatients, setLatestVitals, setVitalsHistory, setAlerts]);
};