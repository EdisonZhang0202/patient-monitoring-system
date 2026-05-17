import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function PatientDetail() {
    const { patientId } = useParams();
    
    const [patient, setPatient] = useState(null);
    const [latestVital, setLatestVital] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [events, setEvents] = useState([]);
    
    useEffect(() => {
        fetch(`http://localhost:5000/api/patients/${patientId}`)
        .then((response) => response.json())
        .then((data) => {
            setPatient(data);
        })
        .catch((error) => {
            console.error("Failed to fetch patient:", error);
        });
        
        fetch(
            `http://localhost:5000/api/patients/${patientId}/vitals/latest`
        )
        .then((response) => response.json())
        .then((data) => {
            setLatestVital(data);
        })
        .catch((error) => {
            console.error("Failed to fetch latest vital:", error);
        });
        
        fetch(`http://localhost:5000/api/alerts`)
        .then((response) => response.json())
        .then((data) => {
            const patientAlerts = data.filter(
                (alert) => alert.patientId === patientId
            );
            
            setAlerts(patientAlerts);
        })
        .catch((error) => {
            console.error("Failed to fetch alerts:", error);
        });
        
        fetch(`http://localhost:5000/api/events?patientId=${patientId}`)
        .then((response) => response.json())
        .then((data) => {
            setEvents(data);
        })
        .catch((error) => {
            console.error("Failed to fetch events:", error);
        });
    }, [patientId]);
    
    return (
        <div>
        <Link to="/">← Back to Dashboard</Link>
        
        <h1>Patient Detail</h1>
        
        {patient && (
            <div>
            <h2>{patient.name}</h2>
            <p>Room: {patient.room}</p>
            <p>Diagnosis: {patient.diagnosis}</p>
            <p>Status: {patient.status}</p>
            </div>
        )}
        
        {latestVital && (
            <div>
            <h2>Latest Vitals</h2>
            
            <p>Heart Rate: {latestVital.heartRate} bpm</p>
            
            <p>
            Blood Pressure: {latestVital.systolicBP}/
            {latestVital.diastolicBP} mmHg
            </p>
            
            <p>
            Oxygen Saturation: {latestVital.oxygenSaturation}%
            </p>
            
            <p>Temperature: {latestVital.temperature}°F</p>
            </div>
        )}
        <h2>Recent Activity</h2>
        
        {events.length === 0 ? (
            <p>No activity found</p>
        ) : (
            events.map((event) => (
                <div
                key={event._id}
                style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                }}
                >
                <h3>{event.eventType}</h3>
                <p>{event.description}</p>
                <p>Time: {new Date(event.timestamp).toLocaleString()}</p>
                </div>
            ))
        )}
        <h2>Alert History</h2>
        
        {alerts.length === 0 ? (
            <p>No alerts found</p>
        ) : (
            alerts.map((alert) => (
                <div
                key={alert._id}
                style={{
                    border: "1px solid gray",
                    padding: "10px",
                    marginBottom: "10px",
                }}
                >
                <h3>
                {alert.severity.toUpperCase()} - {alert.type}
                </h3>
                
                <p>{alert.message}</p>
                <p>
                Time:{" "}
                {new Date(alert.timestamp).toLocaleString()}
                </p>
                <p>
                Acknowledged:{" "}
                {alert.acknowledged ? "Yes" : "No"}
                </p>
                </div>
            ))
        )}
        </div>
    );
}

export default PatientDetail;