import EventLog from "../models/EventLog.js";

export const getEventLogs = async (req, res) => {
  try {
    const filters = {};

    if (req.query.patientId) {
      filters.patientId = req.query.patientId;
    }

    if (req.query.eventType) {
      filters.eventType = req.query.eventType;
    }

    const events = await EventLog.find(filters).sort({
      timestamp: -1,
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch event logs",
      error: error.message,
    });
  }
};