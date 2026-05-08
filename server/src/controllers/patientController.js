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

export const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create patient",
      error: error.message,
    });
  }
};