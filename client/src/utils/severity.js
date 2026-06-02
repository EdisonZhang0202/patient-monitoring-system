export const severityOrder = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const getSeverityRank = (severity) => {
  return severityOrder[severity] || 0;
};

export const getSeverityColor = (severity) => {
  switch (severity) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "medium":
      return "#eab308";
    case "low":
      return "#3b82f6";
    default:
      return "#22c55e";
  }
};

export const getVitalForAlertType = (type) => {
  switch (type) {
    case "tachycardia":
    case "bradycardia":
      return "Heart Rate";
    case "hypertension":
      return "Blood Pressure";
    case "hypoxia":
      return "SpO₂";
    case "fever":
      return "Temperature";
    default:
      return "Vitals";
  }
};

export const sortAlertsBySeverity = (alerts) => {
  return [...alerts].sort(
    (a, b) =>
      getSeverityRank(b.severity) -
      getSeverityRank(a.severity)
  );
};