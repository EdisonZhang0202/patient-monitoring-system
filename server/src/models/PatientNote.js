import mongoose from "mongoose";

const patientNoteSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Clinician",
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PatientNote = mongoose.model("PatientNote", patientNoteSchema);

export default PatientNote;