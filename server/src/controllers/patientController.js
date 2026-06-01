import Patient from "../models/Patient.js";
import { logEvent } from "../services/eventLogger.js";

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
    await logEvent({
      patientId: patient._id,
      eventType: "PATIENT_CREATED",
      description: `Created patient record for ${patient.name}`,
      metadata: {
        name: patient.name,
        room: patient.room,
        diagnosis: patient.diagnosis,
        status: patient.status,
      },
    });
    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create patient",
      error: error.message,
    });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }
    
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patient",
      error: error.message,
    });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    
    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }
    await logEvent({
      patientId: patient._id,
      eventType:
      patient.status === "discharged"
      ? "PATIENT_DISCHARGED"
      : "PATIENT_UPDATED",
      description:
      patient.status === "discharged"
      ? `Discharged patient ${patient.name}`
      : `Updated patient record for ${patient.name}`,
      metadata: {
        name: patient.name,
        room: patient.room,
        diagnosis: patient.diagnosis,
        status: patient.status,
      },
    });
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update patient",
      error: error.message,
    });
  }
};