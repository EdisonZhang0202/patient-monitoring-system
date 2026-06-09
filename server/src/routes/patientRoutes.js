import express from "express";
import {
  getPatients,
  createPatient,
  getPatientById,
  updatePatient,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
const router = express.Router();

router.use(protect);

router.get("/", getPatients);
router.post("/", createPatient);
router.get("/:id", getPatientById);
router.patch(
  "/:id",
  authorize("np", "physician", "admin"),
  updatePatient
);

export default router;