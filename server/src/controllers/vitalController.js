import Vital from "../models/Vital.js";
import { generateVitals } from "../services/vitalSimulator.js";
import { getSocketInstance } from "../sockets/socket.js";

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

  io.emit("vitalUpdate", vital);

    res.status(201).json(vital);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create simulated vital",
      error: error.message,
    });
  }
};