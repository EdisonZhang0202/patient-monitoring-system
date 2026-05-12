import Patient from "../models/Patient.js";
import Vital from "../models/Vital.js";
import Alert from "../models/Alert.js";

import { generateVitals } from "./vitalSimulator.js";
import { evaluateVitals } from "./alertEngine.js";

import { getSocketInstance } from "../sockets/socket.js";

export const startVitalAutomation = () => {
  setInterval(async () => {
    try {
      const patients = await Patient.find();

      const io = getSocketInstance();

      for (const patient of patients) {
        const vitalData = generateVitals(patient._id);

        const vital = await Vital.create(vitalData);

        io.emit("vitalUpdate", vital);

        const alertData = evaluateVitals(vital);

        if (alertData.length > 0) {
          const alerts = await Alert.insertMany(alertData);

          alerts.forEach((alert) => {
            io.emit("alertCreated", alert);
          });
        }
      }
    } catch (error) {
      console.error("Vital automation failed:", error.message);
    }
  }, 5000);
};