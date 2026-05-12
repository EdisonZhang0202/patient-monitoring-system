export const evaluateVitals = (vital) => {
  const alerts = [];

  if (vital.heartRate > 120) {
    alerts.push({
      patientId: vital.patientId,
      type: "tachycardia",
      severity: "high",
      message: `High heart rate detected: ${vital.heartRate} bpm`,
    });
  }

  if (vital.heartRate < 50) {
    alerts.push({
      patientId: vital.patientId,
      type: "bradycardia",
      severity: "high",
      message: `Low heart rate detected: ${vital.heartRate} bpm`,
    });
  }

  if (vital.oxygenSaturation < 92) {
    alerts.push({
      patientId: vital.patientId,
      type: "hypoxia",
      severity: "critical",
      message: `Low oxygen saturation detected: ${vital.oxygenSaturation}%`,
    });
  }

  if (vital.systolicBP > 180) {
    alerts.push({
      patientId: vital.patientId,
      type: "hypertension",
      severity: "critical",
      message: `High systolic blood pressure detected: ${vital.systolicBP} mmHg`,
    });
  }

  if (vital.temperature > 103) {
    alerts.push({
      patientId: vital.patientId,
      type: "fever",
      severity: "high",
      message: `High temperature detected: ${vital.temperature}°F`,
    });
  }

  return alerts;
};