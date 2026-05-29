export const getSeverityRank = (severity) => {
  switch (severity) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
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