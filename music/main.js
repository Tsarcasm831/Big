import { initializeData } from './data.js';
import { doFilterSort, initEventListeners } from './events.js';
import 'bootstrap/js/bootstrap.bundle.min.js'; // Ensure Bootstrap JS is loaded

document.addEventListener('DOMContentLoaded', () => {
  initializeData();    // Load and process song data, sets it in state
  doFilterSort();      // Perform initial filter/sort and render the grid
  initEventListeners(); // Set up all event listeners for interactivity
});