// alienData.js
const fs = require('fs');
const path = require('path');

// Define the path to your JSON file
const jsonFilePath = path.join(__dirname, 'aliens.json');

let alienData = {};

// Read and parse the JSON file when this module is loaded
try {
  const rawData = fs.readFileSync(jsonFilePath, 'utf8');
  alienData = JSON.parse(rawData);
} catch (err) {
  console.error('Error reading or parsing the JSON file:', err);
  process.exit(1);
}

/**
 * Get the entire aliens data.
 * @returns {Object} All alien data.
 */
function getAllData() {
  return alienData;
}

/**
 * Get data for a specific race.
 * @param {string} raceName - The name of the race (e.g., "Anthromorph").
 * @returns {Object|null} Data for the specified race, or null if not found.
 */
function getDataByRace(raceName) {
  return alienData[raceName] || null;
}

/**
 * Get stats for a specific troop within a given race and division.
 * @param {string} raceName - The race name (e.g., "Anthromorph").
 * @param {string} division - The division (e.g., "Base", "Superior", or "Elite").
 * @param {string} troopName - The troop name (e.g., "Grunt").
 * @returns {Object|null} The troop's stats, or null if not found.
 */
function getTroopStats(raceName, division, troopName) {
  const raceData = getDataByRace(raceName);
  if (!raceData || !raceData[division]) {
    return null;
  }
  return raceData[division].find(
    troop => troop.troop.toLowerCase() === troopName.toLowerCase()
  ) || null;
}

// Export the functions so that other parts of your project can use them.
module.exports = {
  getAllData,
  getDataByRace,
  getTroopStats
};
