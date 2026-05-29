const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min, max) => {
  return Number((Math.random() * (max - min) + min).toFixed(1));
};

const chooseRange = (normalRange, abnormalRange, criticalRange) => {
  const chance = Math.random();

  if (chance < 0.99) {
    return normalRange;
  }

  if (chance < 0.998) {
    return abnormalRange;
  }

  return criticalRange;
};

export const generateVitals = (patientId) => {
  const heartRateRange = chooseRange([60, 110], [45, 130], [30, 155]);
  const systolicBPRange = chooseRange([100, 140], [145, 190], [200, 230]);
  const oxygenRange = chooseRange([94, 100], [88, 93], [80, 87]);
  const temperatureRange = chooseRange([97.5, 99.5], [100.4, 103.9], [104, 106]);

  return {
    patientId,
    heartRate: getRandomNumber(heartRateRange[0], heartRateRange[1]),
    systolicBP: getRandomNumber(systolicBPRange[0], systolicBPRange[1]),
    diastolicBP: getRandomNumber(60, 95),
    oxygenSaturation: getRandomNumber(oxygenRange[0], oxygenRange[1]),
    temperature: getRandomFloat(temperatureRange[0], temperatureRange[1]),
    timestamp: new Date(),
  };
};