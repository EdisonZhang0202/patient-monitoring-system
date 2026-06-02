import express from "express";

import {
  getPatientNotes,
  createPatientNote,
} from "../controllers/patientNoteController.js";

const router = express.Router();

router.get("/:id/notes", getPatientNotes);
router.post("/:id/notes", createPatientNote);

export default router;