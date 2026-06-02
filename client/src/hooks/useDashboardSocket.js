import { useEffect } from "react";
import { io } from "socket.io-client";
import { formatVitalForChart } from "../utils/vitals";

const upsertAlert = (alerts, updatedAlert) => {
  if (updatedAlert.acknowledged) {
    return alerts.filter((alert) => alert._id !== updatedAlert._id);
  }

  const alreadyExists = alerts.some(
    (alert) => alert._id === updatedAlert._id
  );

  if (alreadyExists) {
    return alerts.map((alert) =>
      alert._id === updatedAlert._id ? updatedAlert : alert
    );
  }

  return [updatedAlert, ...alerts];
};

export const useDashboardSocket = ({
  setLatestVitals,
  setVitalsHistory,
  setAlerts,
  setLastUpdated,
}) => {
  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    socket.on("vitalUpdate", (vital) => {
      setLastUpdated(new Date());

      setLatestVitals((previousVitals) => ({
        ...previousVitals,
        [vital.patientId]: vital,
      }));

      setVitalsHistory((previousHistory) => {
        const patientHistory = previousHistory[vital.patientId] || [];

        return {
          ...previousHistory,
          [vital.patientId]: [
            ...patientHistory,
            formatVitalForChart(vital),
          ].slice(-10),
        };
      });
    });

    socket.on("alertCreated", (alert) => {
      setAlerts((previousAlerts) => {
        const alreadyExists = previousAlerts.some(
          (existingAlert) => existingAlert._id === alert._id
        );

        if (alreadyExists || alert.acknowledged) {
          return previousAlerts;
        }

        return [alert, ...previousAlerts];
      });
    });

    socket.on("alertUpdated", (updatedAlert) => {
      setAlerts((previousAlerts) =>
        upsertAlert(previousAlerts, updatedAlert)
      );
    });

    socket.on("alertAcknowledged", (updatedAlert) => {
      setAlerts((previousAlerts) =>
        previousAlerts.filter((alert) => alert._id !== updatedAlert._id)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [setLatestVitals, setVitalsHistory, setAlerts, setLastUpdated]);
};