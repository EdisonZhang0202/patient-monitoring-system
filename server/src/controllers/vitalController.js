import Vital from "../models/Vital.js";
import { generateVitals } from "../services/vitalSimulator.js";
import { getSocketInstance } from "../sockets/socket.js";
import Alert from "../models/Alert.js";
import { evaluateVitals } from "../services/alertEngine.js";

export const getVitalsByPatient = async (req, res) => {
  try {
    const vitals = await Vital.find({
      patientId: req.params.patientId,
    }).sort({ timestamp: -1 });
    
    res.status(200).json(vitals);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vitals",
      error: error.message,
    });
  }
};

export const createSimulatedVital = async (req, res) => {
  try {
    const vitalData = generateVitals(req.params.patientId);
    
    const vital = await Vital.create(vitalData);
    const io = getSocketInstance();
    
    const alertData = evaluateVitals(vital);
    const alerts = await Alert.insertMany(alertData);
    
    alerts.forEach((alert) => {
      io.emit("alertCreated", alert);
    });
    
    io.emit("vitalUpdate", vital);
    
    res.status(201).json(vital);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create simulated vital",
      error: error.message,
    });
  }
};

export const getLatestVitalByPatient = async (req, res) => {
  try {
    const latestVital = await Vital.findOne({
      patientId: req.params.patientId,
    }).sort({ timestamp: -1 });
    
    if (!latestVital) {
      return res.status(404).json({
        message: "No vitals found for patient",
      });
    }
    
    res.status(200).json(latestVital);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch latest vital",
      error: error.message,
    });
  }
};