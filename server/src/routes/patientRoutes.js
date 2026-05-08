import express from "express";
import {
  getPatients,
  createPatient,
  getPatientById,
} from "../controllers/patientController.js";

const router = express.Router();

router.get("/", getPatients);
router.post("/", createPatient);
router.get("/:id", getPatientById);

export default router;