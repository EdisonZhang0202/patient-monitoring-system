import Vital from "../models/Vital.js";

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