const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateVitals = (patientId) => {
  return {
    patientId,
    heartRate: getRandomNumber(60, 110),
    systolicBP: getRandomNumber(100, 145),
    diastolicBP: getRandomNumber(60, 95),
    oxygenSaturation: getRandomNumber(94, 100),
    temperature: Number((Math.random() * (99.5 - 97.5) + 97.5).toFixed(1)),
    timestamp: new Date(),
  };
};