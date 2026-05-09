import express from "express";
import { getVitalsByPatient } from "../controllers/vitalController.js";

const router = express.Router();

router.get("/patients/:patientId/vitals", getVitalsByPatient);

export default router;