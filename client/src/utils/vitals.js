export const formatVitalForChart = (vital) => ({
  time: new Date(vital.timestamp).toLocaleTimeString(),
  heartRate: vital.heartRate,
  systolicBP: vital.systolicBP,
  diastolicBP: vital.diastolicBP,
  oxygenSaturation: vital.oxygenSaturation,
  temperature: vital.temperature,
});