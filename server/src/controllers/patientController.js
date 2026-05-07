import Patient from "../models/Patient.js";

export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find();

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};