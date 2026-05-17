import Alert from "../models/Alert.js";
import { getSocketInstance } from "../sockets/socket.js";
import { logEvent } from "../services/eventLogger.js";

export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch alerts",
      error: error.message,
    });
  }
};

export const acknowledgeAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { acknowledged: true },
      { returnDocument: "after" }
    );
    
    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }
    
    const io = getSocketInstance();
    
    io.emit("alertAcknowledged", alert);
    await logEvent({
      patientId: alert.patientId,
      eventType: "ALERT_ACKNOWLEDGED",
      description: `Acknowledged ${alert.type} alert`,
      metadata: {
        alertId: alert._id,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
      },
    });
    
    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({
      message: "Failed to acknowledge alert",
      error: error.message,
    });
  }
};