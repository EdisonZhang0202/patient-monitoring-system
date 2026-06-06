import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPatientNotes,
  createPatientNote,
} from "../controllers/patientNoteController.js";

const router = express.Router();

router.use(protect);

router.get("/:id/notes", getPatientNotes);
router.post("/:id/notes", createPatientNote);

export default router;