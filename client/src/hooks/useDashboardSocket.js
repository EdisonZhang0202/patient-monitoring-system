import { useEffect } from "react";
import { io } from "socket.io-client";

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
            {
              time: new Date(vital.timestamp).toLocaleTimeString(),
              heartRate: vital.heartRate,
              systolicBP: vital.systolicBP,
              diastolicBP: vital.diastolicBP,
              oxygenSaturation: vital.oxygenSaturation,
              temperature: vital.temperature,
            },
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
      setAlerts((previousAlerts) => {
        if (updatedAlert.acknowledged) {
          return previousAlerts.filter(
            (alert) => alert._id !== updatedAlert._id
          );
        }

        const alreadyExists = previousAlerts.some(
          (alert) => alert._id === updatedAlert._id
        );

        if (alreadyExists) {
          return previousAlerts.map((alert) =>
            alert._id === updatedAlert._id ? updatedAlert : alert
          );
        }

        return [updatedAlert, ...previousAlerts];
      });
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