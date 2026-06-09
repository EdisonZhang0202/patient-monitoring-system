import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import vitalRoutes from "./routes/vitalRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import eventLogRoutes from "./routes/eventLogRoutes.js";
import patientNoteRoutes from "./routes/patientNoteRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/patients", vitalRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/events", eventLogRoutes);
app.use("/api/patients", patientNoteRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;