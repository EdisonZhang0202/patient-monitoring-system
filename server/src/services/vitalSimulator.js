const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateVitals = (patientId) => {
  return {
    patientId,
    heartRate: getRandomNumber(40, 130),
    systolicBP: getRandomNumber(100, 220),
    diastolicBP: getRandomNumber(60, 130),
    oxygenSaturation: getRandomNumber(88, 100),
    temperature: Number((Math.random() * (104.5 - 97.5) + 97.5).toFixed(1)),
    timestamp: new Date(),
  };
};