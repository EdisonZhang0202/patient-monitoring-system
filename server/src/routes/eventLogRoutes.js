import express from "express";
import { getEventLogs } from "../controllers/eventLogController.js";

const router = express.Router();

router.get("/", getEventLogs);

export default router;