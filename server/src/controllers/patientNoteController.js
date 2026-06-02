import PatientNote from "../models/PatientNote.js";
import { logEvent } from "../services/eventLogger.js";

export const getPatientNotes = async (req, res) => {
  try {
    const notes = await PatientNote.find({
      patientId: req.params.id,
    }).sort({ timestamp: -1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

export const createPatientNote = async (req, res) => {
  try {
    const note = await PatientNote.create({
      patientId: req.params.id,
      note: req.body.note,
      author: req.body.author || "Clinician",
    });

    await logEvent({
      patientId: req.params.id,
      eventType: "PATIENT_NOTE_ADDED",
      description: "Added patient note",
      metadata: {
        noteId: note._id,
        author: note.author,
        note: note.note,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
};