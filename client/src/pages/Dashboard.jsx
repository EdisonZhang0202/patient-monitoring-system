import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/Dashboard.css";

const getSeverityRank = (severity) => {
  switch (severity) {
    case "critical":
    return 4;
    case "high":
    return 3;
    case "medium":
    return 2;
    case "low":
    return 1;
    default:
    return 0;
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case "critical":
    return "#ef4444";
    case "high":
    return "#f97316";
    case "medium":
    return "#eab308";
    case "low":
    return "#3b82f6";
    default:
    return "#22c55e";
  }
};

const getVitalForAlertType = (type) => {
  switch (type) {
    case "tachycardia":
    case "bradycardia":
    return "Heart Rate";
    case "hypertension":
    return "Blood Pressure";
    case "hypoxia":
    return "SpO₂";
    case "fever":
    return "Temperature";
    default:
    return "Vitals";
  }
};

function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [latestVitals, setLatestVitals] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  
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
          
          if (!response.ok) return;
          
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
    
    fetch("http://localhost:5000/api/alerts")
    .then((response) => response.json())
    .then((data) => {
      setAlerts(data.filter((alert) => !alert.acknowledged));
    })
    .catch((error) => {
      console.error("Failed to fetch alerts:", error);
    });
  }, []);
  
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
}, []);

const patientAlertMap = useMemo(() => {
  return alerts.reduce((map, alert) => {
    if (!map[alert.patientId]) {
      map[alert.patientId] = [];
    }
    
    map[alert.patientId].push(alert);
    return map;
  }, {});
}, [alerts]);


const patientLookup = useMemo(() => {
  return patients.reduce((map, patient) => {
    map[patient._id] = patient;
    return map;
  }, {});
}, [patients]);

const alertsByPatient = useMemo(() => {
  return alerts.reduce((groups, alert) => {
    const patient = patientLookup[alert.patientId];
    const patientKey = alert.patientId;
    
    if (!groups[patientKey]) {
      groups[patientKey] = {
        patient,
        alerts: [],
      };
    }
    
    groups[patientKey].alerts.push(alert);
    return groups;
  }, {});
}, [alerts, patientLookup]);

const sortedPatients = useMemo(() => {
  return [...patients].sort((a, b) => {
    const aAlerts = patientAlertMap[a._id] || [];
    const bAlerts = patientAlertMap[b._id] || [];
    
    const aHighest = Math.max(
      0,
      ...aAlerts.map((alert) => getSeverityRank(alert.severity))
    );
    
    const bHighest = Math.max(
      0,
      ...bAlerts.map((alert) => getSeverityRank(alert.severity))
    );
    
    return bHighest - aHighest;
  });
}, [patients, patientAlertMap]);

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
    await fetch(`http://localhost:5000/api/alerts/${alertId}/acknowledge`, {
      method: "PATCH",
    });
  } catch (error) {
    console.error("Failed to acknowledge alert:", error);
  }
};

return (
  <div className="dashboard">
  <header className="dashboard-header">
  <div>
  <p className="eyebrow">Live Clinical Monitoring</p>
  <h1>Patient Monitoring Dashboard</h1>
  <p className="subtitle">Real-time overview of monitored patients</p>
  </div>
  
  <div className="header-status">
  <span>
  Last updated:{" "}
  {lastUpdated ? lastUpdated.toLocaleTimeString() : "Waiting..."}
  </span>
  <span className="live-dot" />
  <span>Live</span>
  </div>
  </header>
  
  <main className="dashboard-layout">
  <section className="patients-section">
  <div className="section-title">
  <h2>Patients</h2>
  <span>Alerts shown first</span>
  </div>
  
  <div className="patient-grid">
  {sortedPatients.map((patient) => {
    const vital = latestVitals[patient._id];
    const patientAlerts = patientAlertMap[patient._id] || [];
    
    const highestSeverity =
    patientAlerts.length > 0
    ? patientAlerts.reduce((highest, alert) =>
      getSeverityRank(alert.severity) >
    getSeverityRank(highest.severity)
    ? alert
    : highest
  ).severity
  : "stable";
  
  return (
    <Link
    to={`/patients/${patient._id}`}
    className="patient-card-link"
    key={patient._id}
    >
    <article
    className="patient-card"
    style={{
      borderColor: getSeverityColor(highestSeverity),
    }}
    >
    <div className="patient-card-header">
    <div>
    <h3>{patient.name}</h3>
    <p>
    Room {patient.room} · Age {patient.age}
    </p>
    <p>{patient.diagnosis}</p>
    </div>
    
    <span
    className="status-pill"
    style={{
      color: getSeverityColor(highestSeverity),
      borderColor: getSeverityColor(highestSeverity),
    }}
    >
    {patientAlerts.length > 0
      ? highestSeverity
      : patient.status}
      </span>
      </div>
      
      {vital && (
        <div className="vitals-grid">
        <div className="vital-box">
        <span>HR</span>
        <strong>{vital.heartRate}</strong>
        <small>bpm</small>
        </div>
        
        <div className="vital-box">
        <span>BP</span>
        <strong>
        {vital.systolicBP}/{vital.diastolicBP}
        </strong>
        <small>mmHg</small>
        </div>
        
        <div className="vital-box">
        <span>SpO₂</span>
        <strong>{vital.oxygenSaturation}%</strong>
        <small>oxygen</small>
        </div>
        
        <div className="vital-box">
        <span>Temp</span>
        <strong>{vital.temperature}°F</strong>
        <small>temp</small>
        </div>
        </div>
      )}
      
      {vitalsHistory[patient._id] && (
        <div className="chart-box">
        <h4>Heart Rate Trend</h4>
        <ResponsiveContainer width="100%" height={130}>
        <LineChart data={vitalsHistory[patient._id]}>
        <XAxis dataKey="time" hide />
        <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
        <Tooltip />
        <Line
        type="monotone"
        dataKey="heartRate"
        stroke={getSeverityColor(highestSeverity)}
        strokeWidth={2}
        dot={false}
        />
        </LineChart>
        </ResponsiveContainer>
        </div>
      )}
      
      <div className="card-alerts">
      {patientAlerts.length === 0 ? (
        <p className="no-alerts">✓ No active alerts</p>
      ) : (
        <>
        <p className="alert-label">Active Alerts</p>
        <div className="alert-chip-list">
        {patientAlerts.map((alert) => (
          <span
          key={alert._id}
          className="alert-chip"
          style={{
            borderColor: getSeverityColor(alert.severity),
            color: getSeverityColor(alert.severity),
          }}
          >
          {alert.type}
          </span>
        ))}
        </div>
        </>
      )}
      </div>
      </article>
      </Link>
    );
  })}
  </div>
  </section>
  
  <aside className="alerts-panel">
  <div className="alerts-panel-header">
  <div>
  <p className="eyebrow">Active</p>
  <h2>Alerts Summary</h2>
  </div>
  
  <span className="alert-count">{alerts.length}</span>
  </div>
  
  {alerts.length === 0 ? (
    <p className="empty-alerts">No active alerts</p>
  ) : (
    <div className="summary-list">
    {Object.values(alertSummary).map((item) => (
      <div className="summary-row" key={item.type}>
      <div>
      <strong style={{ color: getSeverityColor(item.severity) }}>
      {item.type}
      </strong>
      <p>{item.vitalSign}</p>
      </div>
      
      <span
      className="summary-count"
      style={{
        borderColor: getSeverityColor(item.severity),
        color: getSeverityColor(item.severity),
      }}
      >
      {item.count}
      </span>
      </div>
    ))}
    </div>
  )}
  
  <div className="active-alert-list">
  <h3>Current Alerts</h3>
  
  {Object.entries(alertsByPatient).map(([patientId, group]) => (
    <div className="patient-alert-group" key={patientId}>
    <h4>
    {group.patient
      ? `${group.patient.name} · Room ${group.patient.room}`
      : "Unknown patient"}
      </h4>
      
      {group.alerts.map((alert) => (
        <div className="active-alert-card" key={alert._id}>
        <div>
        <strong style={{ color: getSeverityColor(alert.severity) }}>
        {alert.type}
        </strong>
        
        <p>{alert.message}</p>
        <small>{new Date(alert.timestamp).toLocaleString()}</small>
        </div>
        
        <button
        onClick={() => acknowledgeAlert(alert._id)}
        className="ack-button"
        title="Acknowledge alert"
        >
        ✓
        </button>
        </div>
      ))}
      </div>
    ))}
    </div>
    </aside>
    </main>
    </div>
  );
}

export default Dashboard;