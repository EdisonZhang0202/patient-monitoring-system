import express from "express";
import { getEventLogs } from "../controllers/eventLogController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getEventLogs);

export default router;