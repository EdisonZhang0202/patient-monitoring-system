import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getVitalsByPatient,
  createSimulatedVital,
  getLatestVitalByPatient,
} from "../controllers/vitalController.js";

const router = express.Router();

router.use(protect);

router.get("/patients/:patientId/vitals/latest", getLatestVitalByPatient);
router.get("/patients/:patientId/vitals", getVitalsByPatient);
router.post("/patients/:patientId/vitals/simulate", createSimulatedVital);

export default router;