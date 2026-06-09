import Patient from "../models/Patient.js";
import Vital from "../models/Vital.js";
import Alert from "../models/Alert.js";

const formatVitalForChart = (vital) => ({
  time: new Date(vital.timestamp).toLocaleTimeString(),
  heartRate: vital.heartRate,
  systolicBP: vital.systolicBP,
  diastolicBP: vital.diastolicBP,
  oxygenSaturation: vital.oxygenSaturation,
  temperature: vital.temperature,
});

export const getDashboardData = async (req, res) => {
  try {
    const patients = await Patient.find();

    const alerts = await Alert.find({
      acknowledged: false,
    }).sort({ timestamp: -1 });

    const patientVitals = await Promise.all(
      patients.map(async (patient) => {
        const vitals = await Vital.find({
          patientId: patient._id,
        })
          .sort({ timestamp: -1 })
          .limit(10);

        const recentVitals = vitals.reverse();

        return {
          patientId: patient._id.toString(),
          latestVital:
            recentVitals.length > 0
              ? recentVitals[recentVitals.length - 1]
              : null,
          chartHistory: recentVitals.map(formatVitalForChart),
        };
      })
    );

    const latestVitals = {};
    const vitalsHistory = {};

    patientVitals.forEach(({ patientId, latestVital, chartHistory }) => {
      if (latestVital) {
        latestVitals[patientId] = latestVital;
      }

      vitalsHistory[patientId] = chartHistory;
    });

    res.status(200).json({
      patients,
      alerts,
      latestVitals,
      vitalsHistory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard data",
      error: error.message,
    });
  }
};