import express from "express";
import { getAlerts, acknowledgeAlert } from "../controllers/alertController.js";

const router = express.Router();

router.get("/", getAlerts);
router.patch("/:id/acknowledge", acknowledgeAlert);

export default router;