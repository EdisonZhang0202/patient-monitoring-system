import Alert from "../models/Alert.js";
import { getSocketInstance } from "../sockets/socket.js";

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
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    const io = getSocketInstance();

    io.emit("alertAcknowledged", alert);

    res.status(200).json(alert);
  } catch (error) {
    res.status(500).json({
      message: "Failed to acknowledge alert",
      error: error.message,
    });
  }
};