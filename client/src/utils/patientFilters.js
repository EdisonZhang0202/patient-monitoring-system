export const filterPatientsByStatus = ({
    patients,
    patientFilter,
    patientAlertMap,
}) => {
    switch (patientFilter) {
        case "critical":
            return patients.filter((patient) => {
                const alerts = patientAlertMap[patient._id] || [];
                return alerts.some((alert) => alert.severity === "critical");
            });

        case "high":
            return patients.filter((patient) => {
                const alerts = patientAlertMap[patient._id] || [];
                return alerts.some((alert) => alert.severity === "high");
            });

        case "stable":
            return patients.filter(
                (patient) =>
                    patient.status === "stable" &&
                    (patientAlertMap[patient._id] || []).length === 0
            );

        case "discharged":
            return patients.filter((patient) => patient.status === "discharged");

        default:
            return patients;
    }
};

export const searchPatients = (patients, searchValue) => {
    const normalizedSearch = searchValue.toLowerCase().trim();

    if (!normalizedSearch) {
        return patients;
    }

    return patients.filter((patient) => {
        return (
            patient.name.toLowerCase().includes(normalizedSearch) ||
            patient.room.toLowerCase().includes(normalizedSearch) ||
            patient.diagnosis.toLowerCase().includes(normalizedSearch)
        );
    });
};