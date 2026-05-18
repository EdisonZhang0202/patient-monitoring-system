export const evaluateVitals = (vital) => {
  const alerts = [];

  // Tachycardia
  if (vital.heartRate > 120) {
    alerts.push({
      patientId: vital.patientId,
      type: "tachycardia",
      severity: vital.heartRate > 140 ? "critical" : "high",
      message: `High heart rate detected: ${vital.heartRate} bpm`,
    });
  }

  // Bradycardia
  if (vital.heartRate < 50) {
    alerts.push({
      patientId: vital.patientId,
      type: "bradycardia",
      severity: vital.heartRate < 40 ? "critical" : "high",
      message: `Low heart rate detected: ${vital.heartRate} bpm`,
    });
  }

  // Hypoxia
  if (vital.oxygenSaturation < 92) {
    alerts.push({
      patientId: vital.patientId,
      type: "hypoxia",
      severity:
        vital.oxygenSaturation < 88
          ? "critical"
          : "high",
      message: `Low oxygen saturation detected: ${vital.oxygenSaturation}%`,
    });
  }

  // Hypertension
  if (vital.systolicBP > 180) {
    alerts.push({
      patientId: vital.patientId,
      type: "hypertension",
      severity:
        vital.systolicBP >= 200
          ? "critical"
          : "high",
      message: `High systolic blood pressure detected: ${vital.systolicBP} mmHg`,
    });
  }

  // Fever
  if (vital.temperature > 103) {
    alerts.push({
      patientId: vital.patientId,
      type: "fever",
      severity:
        vital.temperature > 104
          ? "critical"
          : "high",
      message: `High temperature detected: ${vital.temperature}°F`,
    });
  }

  return alerts;
};