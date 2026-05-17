import EventLog from "../models/EventLog.js";

export const logEvent = async ({
  patientId = null,
  eventType,
  description,
  metadata = {},
}) => {
  try {
    await EventLog.create({
      patientId,
      eventType,
      description,
      metadata,
    });
  } catch (error) {
    console.error("Failed to log event:", error.message);
  }
};