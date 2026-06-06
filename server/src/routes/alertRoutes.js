import express from "express";
import { getAlerts, acknowledgeAlert } from "../controllers/alertController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAlerts);
router.patch("/:id/acknowledge", acknowledgeAlert);

export default router;