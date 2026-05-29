import Patient from "../models/Patient.js";
import Vital from "../models/Vital.js";
import Alert from "../models/Alert.js";

import { generateVitals } from "./vitalSimulator.js";
import { evaluateVitals } from "./alertEngine.js";
import { logEvent } from "./eventLogger.js";

import { getSocketInstance } from "../sockets/socket.js";

export const startVitalAutomation = () => {
  setInterval(async () => {
    try {
      const patients = await Patient.find({
        status: { $ne: "discharged" },
      });
      
      const io = getSocketInstance();
      
      for (const patient of patients) {
        const vitalData = generateVitals(patient._id);
        
        const vital = await Vital.create(vitalData);
        
        await logEvent({
          patientId: patient._id,
          eventType: "VITAL_GENERATED",
          description: `Generated vitals for patient ${patient.name}`,
          metadata: {
            vitalId: vital._id,
            heartRate: vital.heartRate,
            systolicBP: vital.systolicBP,
            diastolicBP: vital.diastolicBP,
            oxygenSaturation: vital.oxygenSaturation,
            temperature: vital.temperature,
          },
        });
        
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
            await logEvent({
              patientId: patient._id,
              eventType: "ALERT_UPDATED",
              description: `Updated ${existingAlert.type} alert for patient ${patient.name}`,
              metadata: {
                alertId: existingAlert._id,
                type: existingAlert.type,
                severity: existingAlert.severity,
                message: existingAlert.message,
              },
            });
            io.emit("alertUpdated", existingAlert);
          } else {
            const newAlert = await Alert.create(alertItem);
            await logEvent({
              patientId: patient._id,
              eventType: "ALERT_CREATED",
              description: `Created ${newAlert.type} alert for patient ${patient.name}`,
              metadata: {
                alertId: newAlert._id,
                type: newAlert.type,
                severity: newAlert.severity,
                message: newAlert.message,
              },
            });
            io.emit("alertCreated", newAlert);
          }
        }
      }
    } catch (error) {
      console.error("Vital automation failed:", error.message);
    }
  }, 10000);
};