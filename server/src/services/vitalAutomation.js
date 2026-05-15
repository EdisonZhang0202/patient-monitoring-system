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
        
        for (const alertItem of alertData) {
          const existingAlert = await Alert.findOne({
            patientId: alertItem.patientId,
            type: alertItem.type,
            acknowledged: false,
          });
          
          if (existingAlert) {
            existingAlert.message = alertItem.message;
            existingAlert.severity = alertItem.severity;
            existingAlert.timestamp = new Date();
            
            await existingAlert.save();
            
            io.emit("alertUpdated", existingAlert);
          } else {
            const newAlert = await Alert.create(alertItem);
            
            io.emit("alertCreated", newAlert);
          }
        }
      }
    } catch (error) {
      console.error("Vital automation failed:", error.message);
    }
  }, 5000);
};