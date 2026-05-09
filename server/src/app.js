import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import vitalRoutes from "./routes/vitalRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api", vitalRoutes);

export default app;