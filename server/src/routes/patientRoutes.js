import express from "express";
import {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
} from "../controllers/patientController.js";

const router = express.Router();

router.get("/", getPatients);
router.post("/", createPatient);
router.get("/:id", getPatientById);
router.patch("/:id", updatePatient);

export default router;