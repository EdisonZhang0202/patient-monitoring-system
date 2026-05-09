import express from "express";
import {
  getVitalsByPatient,
  createSimulatedVital,
} from "../controllers/vitalController.js";

const router = express.Router();

router.get("/patients/:patientId/vitals", getVitalsByPatient);
router.post("/patients/:patientId/vitals/simulate", createSimulatedVital);

export default router;