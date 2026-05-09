import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  heartRate: {
    type: Number,
    required: true,
  },
  systolicBP: {
    type: Number,
    required: true,
  },
  diastolicBP: {
    type: Number,
    required: true,
  },
  oxygenSaturation: {
    type: Number,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Vital = mongoose.model("Vital", vitalSchema);

export default Vital;