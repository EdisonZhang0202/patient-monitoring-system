import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const getSeverityColor = (severity) => {
  switch (severity) {
    case "critical":
    return "#ff4d4f";
    
    case "high":
    return "#fa8c16";
    
    case "medium":
    return "#fadb14";
    
    case "low":
    return "#1890ff";
    
    default:
    return "#d9d9d9";
  }
};

function App() {
  const [patients, setPatients] = useState([]);
  const [latestVitals, setLatestVitals] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState({});
  
  
  useEffect(() => {
    fetch("http://localhost:5000/api/patients")
    .then((response) => response.json())
    .then((data) => {
      setPatients(data);
      data.forEach(async (patient) => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/patients/${patient._id}/vitals/latest`
          );
          
          if (!response.ok) {
            return;
          }
          
          const latestVital = await response.json();
          
          setLatestVitals((previousVitals) => ({
            ...previousVitals,
            [patient._id]: latestVital,
          }));
        } catch (error) {
          console.error("Failed to fetch latest vital:", error);
        }
      });
    })
    .catch((error) => {
      console.error("Failed to fetch patients:", error);
    });
  }, []);
  
  useEffect(() => {
    const socket = io("http://localhost:5000");
    
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });
    
    socket.on("vitalUpdate", (vital) => {
      console.log("New vital received:", vital);
      
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
            },
          ].slice(-10),
        };
      });
    });
    
    socket.on("alertCreated", (alert) => {
      console.log("New alert received:", alert);
      
      setAlerts((previousAlerts) => [alert, ...previousAlerts]);
    });
    
    socket.on("alertAcknowledged", (updatedAlert) => {
      setAlerts((previousAlerts) =>
        previousAlerts.map((alert) =>
          alert._id === updatedAlert._id ? updatedAlert : alert
    )
  );
});

return () => {
  socket.disconnect();
};
}, []);


return (
  <div>
  <h1>Real-Time Patient Monitoring System</h1>
  <h2>Alerts</h2>
  
  {alerts.length === 0 ? (
    <p>No active alerts</p>
  ) : (
    alerts.map((alert) => (
      <div
      key={alert._id}
      style={{
        border: `2px solid ${getSeverityColor(alert.severity)}`,
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "8px",
      }}
      >
      <h3>{alert.severity.toUpperCase()} - {alert.type}</h3>
      <p>{alert.message}</p>
      <p>Patient ID: {alert.patientId}</p>
      <p>Acknowledged: {alert.acknowledged ? "Yes" : "No"}</p>
      {!alert.acknowledged && (
        <button
        onClick={async () => {
          try {
            await fetch(
              `http://localhost:5000/api/alerts/${alert._id}/acknowledge`,
              {
                method: "PATCH",
              }
            );
          } catch (error) {
            console.error("Failed to acknowledge alert:", error);
          }
        }}
        >
        Acknowledge
        </button>
      )}
      </div>
    ))
  )}
  <h2>Patients</h2>
  
  {patients.map((patient) => (
    <div key={patient._id}>
    <h3>{patient.name}</h3>
    <p>Room: {patient.room}</p>
    <p>Diagnosis: {patient.diagnosis}</p>
    <p>Status: {patient.status}</p>
    {latestVitals[patient._id] && (
      <div>
      <h4>Latest Vitals</h4>
      <p>Heart Rate: {latestVitals[patient._id].heartRate} bpm</p>
      <p>
      Blood Pressure: {latestVitals[patient._id].systolicBP}/
      {latestVitals[patient._id].diastolicBP} mmHg
      </p>
      <p>SpO2: {latestVitals[patient._id].oxygenSaturation}%</p>
      <p>Temperature: {latestVitals[patient._id].temperature}°F</p>
      </div>
    )}
    {vitalsHistory[patient._id] && (
  <div style={{ width: "100%", height: 250 }}>
    <h4>Heart Rate Trend</h4>

    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={vitalsHistory[patient._id]}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />

        <Line
          type="monotone"
          dataKey="heartRate"
          stroke="#ff4d4f"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}
    </div>
  ))}
  </div>
);
}

export default App;