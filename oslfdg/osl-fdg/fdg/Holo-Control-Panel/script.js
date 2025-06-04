// Initialize system state with default values
const systemState = {
  corePower: 87,
  thermalReg: 64,
  shieldIntegrity: 92,
  gravitationalField: 1.02,
  temperature: 22.3,
  pressure: 1.05,
  oxygen: 21.2,
  radiation: 0.32,
  alphaWaves: 4.2,
  betaWaves: 12.7,
  gammaWaves: 0.4,
  anomalies: 3,
  activityLevel: 'MODERATE',
  stability: 98.7,
  securityLevel: 4,
  powerMode: 'standard', // 'standard', 'eco', 'boost'
  structureType: 'station', // 'station', 'satellite', 'base', 'farhaven'
  lastAnomaly: Date.now() - 300000, // 5 minutes ago
  events: [],
  systemUptime: 0,
  quantumState: 'stable',
  subspaceLinks: 3,
  dataFragments: [],
  threatLevel: 'low'
};

// Load previous state from localStorage if available
document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedState = localStorage.getItem('systemState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Merge saved state with default state
      Object.assign(systemState, parsedState);
      
      // Apply loaded state to UI
      updateMetricsFromState();
      
      // Update the terminal with system restore
      addMessage('System state restored from previous session');
    }
  } catch (e) {
    console.error('Error loading system state:', e);
    addMessage('Error loading previous system state. Using defaults.');
  }
  
  // Initialize all components with the loaded/default state
  const hologram = initHologram();
  initEMGraph();
  initSectorGrid();
  updateMetricsFromState();
  initTerminal();
  initModeButtons(hologram);
  initGlitchEffects();
  initEnvironmentData();
  initDataFlowAnimation();
  initHolographicEffects();
  initCircularProgress();
  
  // Initialize the new thermal and shield subsystems
  window.thermalOptimizer = initThermalOptimizer();
  window.shieldBooster = initShieldBooster();
  
  // Set active structure button based on loaded state
  document.querySelector(`.structure-btn[data-structure="${systemState.structureType}"]`).classList.add('active');
  document.querySelector(`.control-btn[data-mode="${systemState.powerMode}"]`).classList.add('active');
  
  // Apply security level from state
  document.querySelector('.security-level').textContent = `LVL ${systemState.securityLevel}`;
  
  // Start uptime counter
  startUptimeCounter();
  
  // Save state every minute
  setInterval(saveSystemState, 60000);
});

import { initThermalOptimizer } from './thermalOptimizer.js';
import { initShieldBooster } from './shieldBooster.js';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { createSpaceStation } from './spaceStation.js';
import { createSatelliteArray } from './satelliteArray.js';
import { createPlanetaryBase } from './planetaryBase.js';
import { createFarhavenBase } from './farhaven_base.js';

// Save system state to localStorage
const saveSystemState = () => {
  try {
    localStorage.setItem('systemState', JSON.stringify(systemState));
    console.log('System state saved');
  } catch (e) {
    console.error('Error saving system state:', e);
  }
};

// Update all metrics based on system state
const updateMetricsFromState = () => {
  // Update progress bars
  updateProgressBar('core-power', systemState.corePower);
  updateProgressBar('thermal-reg', systemState.thermalReg);
  updateProgressBar('shield-integrity', systemState.shieldIntegrity);
  
  // Update other metrics
  document.getElementById('gravity-value').textContent = `${systemState.gravitationalField.toFixed(2)}G`;
  document.getElementById('temp-value').textContent = `${systemState.temperature.toFixed(1)}°C`;
  document.getElementById('pressure-value').textContent = `${systemState.pressure.toFixed(2)} ATM`;
  document.getElementById('oxygen-value').textContent = `${systemState.oxygen.toFixed(1)}%`;
  document.getElementById('radiation-value').textContent = `${systemState.radiation.toFixed(2)} µSv`;
  document.getElementById('alpha-value').textContent = `${systemState.alphaWaves.toFixed(1)} mV`;
  document.getElementById('beta-value').textContent = `${systemState.betaWaves.toFixed(1)} mV`;
  document.getElementById('gamma-value').textContent = `${systemState.gammaWaves.toFixed(1)} mV`;
  document.getElementById('anomalies-value').textContent = systemState.anomalies;
  document.getElementById('activity-value').textContent = systemState.activityLevel;
  document.getElementById('stability-value').textContent = `${systemState.stability.toFixed(1)}%`;
  
  // Set activity color based on level
  const activityElement = document.getElementById('activity-value');
  if (systemState.activityLevel === 'CRITICAL') {
    activityElement.style.color = '#ff3333';
  } else if (systemState.activityLevel === 'HIGH') {
    activityElement.style.color = '#ffcc00';
  } else {
    activityElement.style.color = '';
  }
};

// Update progress bar with value and correctly handle colors
const updateProgressBar = (id, value) => {
  const bar = document.getElementById(id);
  const valueElement = document.getElementById(`${id}-value`);
  
  bar.style.width = `${value}%`;
  valueElement.textContent = `${value}%`;
  
  // Change color based on level
  if (value < 30) {
    bar.style.backgroundColor = '#ff3333';
  } else if (value < 70) {
    bar.style.backgroundColor = '#ffcc00';
  } else {
    bar.style.backgroundColor = 'var(--primary-color)';
  }
};

window.updateProgressBar = updateProgressBar;
window.systemState = systemState;

// Initialize electromagnetic graph with real data processing
const initEMGraph = () => {
  const canvas = document.getElementById('em-graph');
  const ctx = canvas.getContext('2d');
  
  // Set canvas dimensions
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  
  // Start with current state values
  let dataPoints = Array(50).fill(0).map(() => (
    (systemState.alphaWaves + systemState.betaWaves + systemState.gammaWaves) / 40
  ));
  
  const draw = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i < 5; i++) {
      const y = i * (canvas.height / 4);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i < 10; i++) {
      const x = i * (canvas.width / 9);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw data line
    ctx.strokeStyle = 'rgba(0, 255, 157, 1)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < dataPoints.length; i++) {
      const x = (i / (dataPoints.length - 1)) * canvas.width;
      const y = (1 - dataPoints[i]) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    
    // Glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgba(0, 255, 157, 0.7)';
    ctx.stroke();
    ctx.shadowBlur = 0;
  };
  
  const updateData = () => {
    // Calculate new EM values based on system state
    let noiseLevel = 0.1; // Base noise
    
    // More power = more EM emission
    if (systemState.corePower > 90) noiseLevel += 0.1;
    if (systemState.powerMode === 'boost') noiseLevel += 0.2;
    
    // More anomalies = more fluctuations
    noiseLevel += systemState.anomalies * 0.05;
    
    // Radiation affects readings
    noiseLevel += systemState.radiation * 0.3;
    
    // Update alpha/beta/gamma based on state factors
    systemState.alphaWaves = 2 + (systemState.corePower / 20) + (Math.random() * noiseLevel);
    systemState.betaWaves = 10 + (systemState.shieldIntegrity / 10) + (Math.random() * noiseLevel * 2);
    systemState.gammaWaves = 0.1 + (systemState.radiation / 2) + (Math.random() * noiseLevel / 2);
    
    // Limit to reasonable values
    systemState.alphaWaves = Math.min(Math.max(systemState.alphaWaves, 0.1), 10);
    systemState.betaWaves = Math.min(Math.max(systemState.betaWaves, 5), 25);
    systemState.gammaWaves = Math.min(Math.max(systemState.gammaWaves, 0.1), 2);
    
    // Shift data points and add new one, normalized
    dataPoints.shift();
    const newValue = (systemState.alphaWaves + systemState.betaWaves + systemState.gammaWaves) / 40;
    dataPoints.push(Math.min(Math.max(newValue, 0.1), 0.9));
    
    draw();
    
    // Update EM values in UI
    document.getElementById('alpha-value').textContent = systemState.alphaWaves.toFixed(1) + ' mV';
    document.getElementById('beta-value').textContent = systemState.betaWaves.toFixed(1) + ' mV';
    document.getElementById('gamma-value').textContent = systemState.gammaWaves.toFixed(1) + ' mV';
  };
  
  // Initial draw
  draw();
  
  // Update periodically
  setInterval(updateData, 2000);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    draw();
  });
};

// Initialize the sector grid with realistic pattern behavior
const initSectorGrid = () => {
  const grid = document.querySelector('.sector-grid');
  
  // Create grid cells
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.classList.add('sector-cell');
    cell.dataset.index = i;
    grid.appendChild(cell);
  }
  
  // Initial cells activation
  activateCells();
  moveHighlight();
  
  // Update periodically, with longer interval
  setInterval(() => {
    if (Math.random() < 0.3) { // Only change sometimes, for more realistic behavior
      activateCells();
      moveHighlight();
    }
    
    // Check if anomaly event should occur
    const timeSinceLastAnomaly = Date.now() - systemState.lastAnomaly;
    if (timeSinceLastAnomaly > 60000 && Math.random() < 0.1) { // At least 1 minute since last anomaly
      triggerAnomaly();
    }
  }, 8000);
  
  function activateCells() {
    const cells = grid.querySelectorAll('.sector-cell');
    
    // First deactivate all cells
    cells.forEach(cell => cell.classList.remove('active'));
    
    // Then activate a pattern based on system state
    if (systemState.activityLevel === 'CRITICAL') {
      // Critical: many active cells in chaotic pattern
      const activeCount = 15 + Math.floor(Math.random() * 10);
      for (let i = 0; i < activeCount; i++) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        cells[randomIndex].classList.add('active');
      }
    } else if (systemState.activityLevel === 'HIGH') {
      // High: quadrant-based pattern with clusters
      const startQuadrant = Math.floor(Math.random() * 4);
      const startRow = Math.floor(startQuadrant / 2) * 4;
      const startCol = (startQuadrant % 2) * 4;
      
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (Math.random() < 0.6) {
            const idx = (startRow + r) * 8 + (startCol + c);
            cells[idx].classList.add('active');
          }
        }
      }
    } else if (systemState.activityLevel === 'MODERATE') {
      // Moderate: line pattern
      const isHorizontal = Math.random() > 0.5;
      const lineIndex = Math.floor(Math.random() * 8);
      
      for (let i = 0; i < 8; i++) {
        const idx = isHorizontal ? lineIndex * 8 + i : i * 8 + lineIndex;
        if (Math.random() < 0.7) {
          cells[idx].classList.add('active');
        }
      }
    } else {
      // Low: few scattered cells
      const activeCount = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < activeCount; i++) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        cells[randomIndex].classList.add('active');
      }
    }
  }
  
  function moveHighlight() {
    const highlight = document.querySelector('.sector-highlight');
    const activeCells = grid.querySelectorAll('.sector-cell.active');
    
    if (activeCells.length > 0) {
      // Pick most "concerning" cell (prefer high index numbers for realism)
      let targetCell = activeCells[0];
      if (activeCells.length > 1) {
        // Use the cell with highest index value 30% of the time
        if (Math.random() < 0.3) {
          let highestIndex = 0;
          activeCells.forEach(cell => {
            const index = parseInt(cell.dataset.index);
            if (index > highestIndex) {
              highestIndex = index;
              targetCell = cell;
            }
          });
        } else {
          // Otherwise random active cell
          targetCell = activeCells[Math.floor(Math.random() * activeCells.length)];
        }
      }
      
      const rect = targetCell.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();
      
      highlight.style.left = (rect.left - gridRect.left) + 'px';
      highlight.style.top = (rect.top - gridRect.top) + 'px';
      highlight.style.width = rect.width + 'px';
      highlight.style.height = rect.height + 'px';
    }
  }
  
  function triggerAnomaly() {
    systemState.lastAnomaly = Date.now();
    
    // Determine anomaly severity
    const severityRoll = Math.random();
    
    if (severityRoll < 0.1) {
      // Critical anomaly - 10% chance
      systemState.anomalies += Math.floor(Math.random() * 3) + 2;
      systemState.activityLevel = 'CRITICAL';
      systemState.radiation += 0.2 + (Math.random() * 0.4);
      systemState.shieldIntegrity -= Math.floor(Math.random() * 10) + 5;
      
      // Add event to log
      systemState.events.push({
        time: new Date().toISOString(),
        type: 'critical-anomaly',
        message: `CRITICAL anomaly detected in sector ${getRandomSector()}`
      });
      
      // Update terminal
      addMessage(`CRITICAL anomaly detected in sector ${getRandomSector()}!`);
      addMessage(`Shield integrity compromised. Current level: ${systemState.shieldIntegrity}%`);
      addMessage(`Radiation levels rising to ${systemState.radiation.toFixed(2)} µSv`);
      
      // Visual effects for critical anomaly
      document.querySelector('.glitch-overlay').style.opacity = '0.8';
      setTimeout(() => {
        document.querySelector('.glitch-overlay').style.opacity = '0';
      }, 2000);
      
    } else if (severityRoll < 0.3) {
      // Major anomaly - 20% chance
      systemState.anomalies += Math.floor(Math.random() * 2) + 1;
      systemState.activityLevel = 'HIGH';
      systemState.radiation += 0.1 + (Math.random() * 0.2);
      systemState.thermalReg -= Math.floor(Math.random() * 8) + 3;
      
      // Add event to log
      systemState.events.push({
        time: new Date().toISOString(),
        type: 'major-anomaly',
        message: `Major anomaly detected in sector ${getRandomSector()}`
      });
      
      // Update terminal
      addMessage(`Major anomaly detected in sector ${getRandomSector()}`);
      addMessage(`Thermal regulation decreased to ${systemState.thermalReg}%`);
      
    } else if (severityRoll < 0.6) {
      // Minor anomaly - 30% chance
      systemState.anomalies += 1;
      const prevActivity = systemState.activityLevel;
      
      if (prevActivity === 'LOW') systemState.activityLevel = 'MODERATE';
      else if (Math.random() < 0.3) systemState.activityLevel = 'HIGH';
      
      // Add event to log
      systemState.events.push({
        time: new Date().toISOString(),
        type: 'minor-anomaly',
        message: `Minor anomaly detected in sector ${getRandomSector()}`
      });
      
      // Update terminal
      addMessage(`Minor anomaly detected in sector ${getRandomSector()}`);
      
    } else {
      // False positive - 40% chance
      if (systemState.anomalies > 0 && Math.random() < 0.3) {
        systemState.anomalies -= 1;
      }
      
      if (systemState.activityLevel === 'HIGH' && Math.random() < 0.5) {
        systemState.activityLevel = 'MODERATE';
      } else if (systemState.activityLevel === 'MODERATE' && Math.random() < 0.3) {
        systemState.activityLevel = 'LOW';
      }
      
      // Add event to log
      systemState.events.push({
        time: new Date().toISOString(),
        type: 'system-check',
        message: 'Routine system check completed'
      });
      
      // Update terminal
      addMessage('Anomaly analysis complete. No new threats detected.');
    }
    
    // Update UI after anomaly
    updateMetricsFromState();
    
    // Save state after significant change
    saveSystemState();
  }
  
  function getRandomSector() {
    const sectors = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON'];
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    const number = Math.floor(Math.random() * 20) + 1;
    return `${sector}-${number}`;
  }
};

// System metrics initialization and updating
const updateMetrics = () => {
  // First update
  updateMetricsFromState();
  
  // Update periodically with meaningful changes
  setInterval(() => {
    // Apply gradual changes based on system state
    
    // Power fluctuations based on mode
    if (systemState.powerMode === 'eco') {
      // Eco mode: slowly decrease power, increase stability
      systemState.corePower = Math.max(75, systemState.corePower - randomChange(0.5));
      systemState.stability = Math.min(99.8, systemState.stability + randomChange(0.1));
    } else if (systemState.powerMode === 'boost') {
      // Boost mode: high power, decreased stability, increased temperature
      systemState.corePower = Math.min(98, systemState.corePower + randomChange(1));
      systemState.stability = Math.max(92, systemState.stability - randomChange(0.2));
      systemState.temperature += randomChange(0.2);
      systemState.thermalReg = Math.max(50, systemState.thermalReg - randomChange(0.5));
    } else {
      // Standard mode: balanced changes
      systemState.corePower = clamp(systemState.corePower + randomChange(1), 75, 95);
      systemState.stability = clamp(systemState.stability + randomChange(0.2), 95, 99.5);
    }
    
    // Thermal regulation is affected by power and temperature
    if (systemState.temperature > 25) {
      systemState.thermalReg = Math.max(50, systemState.thermalReg - randomChange(0.5));
    } else if (systemState.thermalReg < 70) {
      systemState.thermalReg += randomChange(0.5);
    } else {
      systemState.thermalReg = clamp(systemState.thermalReg + randomChange(1), 60, 85);
    }
    
    // Structure-specific effects
    if (systemState.structureType === 'station') {
      // Space station has most stable gravity
      systemState.gravitationalField = clamp(1 + randomChange(0.01), 0.98, 1.02);
      // Better radiation shielding
      systemState.radiation = clamp(systemState.radiation - randomChange(0.05), 0.1, 0.8);
    } else if (systemState.structureType === 'satellite') {
      // Satellite has no gravity, but fluctuating fields
      systemState.gravitationalField = clamp(0.01 + randomChange(0.01), 0, 0.05);
      // Higher radiation in orbit
      systemState.radiation = clamp(systemState.radiation + randomChange(0.1), 0.3, 1.5);
    } else if (systemState.structureType === 'base') {
      // Planetary base has planetside gravity
      systemState.gravitationalField = clamp(1.15 + randomChange(0.02), 1.1, 1.2);
      // Variable radiation based on weather
      if (Math.random() < 0.1) {
        systemState.radiation = clamp(systemState.radiation + randomChange(0.3), 0.2, 1.0);
        addMessage('Weather alert: Radiation storm approaching.');
      } else {
        systemState.radiation = clamp(systemState.radiation - randomChange(0.05), 0.1, 1.0);
      }
      
      // Oxygen fluctuates on base
      systemState.oxygen = clamp(systemState.oxygen + randomChange(0.2), 20, 22);
    }
    
    // Shield integrity is affected by radiation and power
    if (systemState.radiation > 0.8) {
      systemState.shieldIntegrity = Math.max(70, systemState.shieldIntegrity - randomChange(0.5));
    } else if (systemState.corePower < 80) {
      systemState.shieldIntegrity = Math.max(75, systemState.shieldIntegrity - randomChange(0.3));
    } else {
      systemState.shieldIntegrity = clamp(systemState.shieldIntegrity + randomChange(0.3), 85, 98);
    }
    
    // Gradually normalize temperature
    systemState.temperature = systemState.temperature > 22.5 
      ? systemState.temperature - randomChange(0.1)
      : systemState.temperature + randomChange(0.1);
    systemState.temperature = clamp(systemState.temperature, 18, 30);
    
    // Pressure changes based on structure
    if (systemState.structureType === 'base') {
      systemState.pressure = clamp(systemState.pressure + randomChange(0.02), 0.95, 1.2);
    } else {
      systemState.pressure = clamp(1 + randomChange(0.01), 0.98, 1.02);
    }
    
    // Update UI
    updateMetricsFromState();
  }, 3000);
  
  // Helper for random changes
  function randomChange(amount) {
    return (Math.random() * 2 - 1) * amount;
  }
  
  // Helper to clamp values between min and max
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
};

// Terminal functionality updated for realistic logging
const initTerminal = () => {
  const terminal = document.getElementById('terminal-content');
  
  // Add message to terminal
  window.addMessage = (message) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLine = `\n[${timestamp}] > ${message}`;
    
    // Get current content and split into lines
    let lines = terminal.textContent.split('\n');
    
    // Add new line
    lines.push(newLine);
    
    // Keep only the last 10 lines
    if (lines.length > 10) {
      lines = lines.slice(lines.length - 10);
    }
    
    // Update terminal content
    terminal.textContent = lines.join('\n');
    terminal.scrollTop = terminal.scrollHeight;
  };
  
  // Buttons functionality with meaningful impacts
  document.getElementById('power-btn').addEventListener('click', () => {
    // Toggle power state
    const body = document.body;
    const isPowerOff = body.classList.contains('power-off');
    
    if (isPowerOff) {
      // Power ON
      body.classList.remove('power-off');
      setTimeout(() => {
        // Power button cycles through power modes
        if (systemState.powerMode === 'standard') {
          systemState.powerMode = 'eco';
          addMessage('Power mode switched to ECO - reducing energy consumption');
          document.querySelector('[data-mode="standard"]').classList.remove('active');
          document.querySelector('[data-mode="eco"]').classList.add('active');
        } else if (systemState.powerMode === 'eco') {
          systemState.powerMode = 'boost';
          addMessage('Power mode switched to BOOST - maximum output enabled');
          document.querySelector('[data-mode="eco"]').classList.remove('active');
          document.querySelector('[data-mode="boost"]').classList.add('active');
          
          // Boost mode has consequences
          systemState.thermalReg -= 5;
          systemState.temperature += 1.5;
          addMessage('WARNING: Temperature rising. Thermal regulation under strain.');
        } else {
          systemState.powerMode = 'standard';
          addMessage('Power mode returned to STANDARD');
          document.querySelector('[data-mode="boost"]').classList.remove('active');
          document.querySelector('[data-mode="standard"]').classList.add('active');
        }
        
        // Visual feedback
        document.querySelector('.glitch-overlay').style.opacity = '0.8';
        setTimeout(() => {
          document.querySelector('.glitch-overlay').style.opacity = '0';
        }, 500);
        
        // Update state and save
        updateMetricsFromState();
        saveSystemState();
      }, 1000); // Wait for transition to complete
      
      addMessage('System power restored. All functions online.');
    } else {
      // Power OFF
      body.classList.add('power-off');
      addMessage('WARNING: System powering down...');
      setTimeout(() => {
        addMessage('System in standby mode. Power consumption minimized.');
      }, 1000);
    }
  });
  
  document.getElementById('anomaly-btn').addEventListener('click', () => {
    addMessage('Anomaly detection protocols activated');
    addMessage('Scanning all sectors...');
    
    // Real scanning effect
    const scanningEffect = () => {
      const activeCells = document.querySelectorAll('.sector-cell.active');
      activeCells.forEach(cell => cell.style.backgroundColor = 'rgba(255, 204, 0, 0.4)');
      
      setTimeout(() => {
        activeCells.forEach(cell => cell.style.backgroundColor = '');
      }, 1000);
    };
    
    // Scan multiple times for effect
    scanningEffect();
    setTimeout(scanningEffect, 800);
    setTimeout(scanningEffect, 1600);
    
    // Result depends on current state
    setTimeout(() => {
      if (systemState.anomalies > 0) {
        const sectors = ['ALPHA', 'BETA', 'GAMMA', 'DELTA'];
        const sector = sectors[Math.floor(Math.random() * sectors.length)];
        const number = Math.floor(Math.random() * 20) + 1;
        
        addMessage(`${systemState.anomalies} anomalies detected in sector ${sector}-${number}`);
        
        // Activate defense if serious
        if (systemState.anomalies > 3) {
          addMessage('Automated defense protocols engaged');
          systemState.shieldIntegrity += 5;
          updateMetricsFromState();
        }
      } else {
        addMessage('No anomalies detected. All systems nominal.');
        
        // Improve stability as reward for checking
        systemState.stability = Math.min(99.9, systemState.stability + 0.3);
        updateMetricsFromState();
      }
    }, 2500);
  });
  
  document.getElementById('security-btn').addEventListener('click', () => {
    // Security levels cycle 1-5
    systemState.securityLevel = (systemState.securityLevel % 5) + 1;
    addMessage(`Security level changed to LVL ${systemState.securityLevel}`);
    document.querySelector('.security-level').textContent = `LVL ${systemState.securityLevel}`;
    
    // Higher security improves shields but costs power
    if (systemState.securityLevel > 3) {
      systemState.shieldIntegrity += 3;
      systemState.corePower -= 2;
      addMessage('Shields reinforced. Power allocation adjusted.');
    } else {
      addMessage('Security systems reconfigured.');
    }
    
    // Update metrics and save state
    updateMetricsFromState();
    saveSystemState();
  });
};

// Define the addMessage function globally
window.addMessage = (message) => {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  const newLine = `\n[${timestamp}] > ${message}`;
  
  // Get current content and split into lines
  const terminal = document.getElementById('terminal-content');
  let lines = terminal.textContent.split('\n');
  
  // Add new line
  lines.push(newLine);
  
  // Keep only the last 10 lines
  if (lines.length > 10) {
    lines = lines.slice(lines.length - 10);
  }
  
  // Update terminal content
  terminal.textContent = lines.join('\n');
  terminal.scrollTop = terminal.scrollHeight;
};

// Mode switching with actual system impacts
const initModeButtons = (hologram) => {
  const viewButtons = document.querySelectorAll('.control-btn');
  
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.getAttribute('data-mode');
      
      // Only process if not already in this mode
      if (mode !== systemState.powerMode) {
        // Remove active class from all buttons
        viewButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Set hologram mode
        hologram.setMode(mode);
        
        // Set system mode and apply effects
        systemState.powerMode = mode;
        
        if (mode === 'xray') {
          // X-ray mode increases radiation slightly but provides info
          systemState.radiation += 0.05;
          addMessage('X-ray scanning active. Minor radiation increase detected.');
          
          // Sometimes detects anomalies
          if (Math.random() < 0.3 && systemState.anomalies < 1) {
            setTimeout(() => {
              systemState.anomalies += 1;
              addMessage('X-ray scan detected previously hidden anomaly.');
              updateMetricsFromState();
            }, 2000);
          }
        } else if (mode === 'energy') {
          // Energy mode uses more power
          systemState.corePower -= 3;
          addMessage('Energy mapping active. Power consumption increased.');
          
          // But can improve thermal regulation
          setTimeout(() => {
            systemState.thermalReg += 2;
            addMessage('Energy mapping complete. Thermal efficiency optimized.');
            updateMetricsFromState();
          }, 3000);
        } else {
          // Standard mode is balanced
          addMessage('Standard view mode active.');
        }
        
        // Update metrics immediately
        updateMetricsFromState();
        
        // Log to terminal
        addMessage(`Hologram mode switched to ${mode.toUpperCase()}`);
      }
    });
  });
  
  // Structure selection buttons with meaningful impacts
  const structureButtons = document.querySelectorAll('.structure-btn');
  structureButtons.forEach(button => {
    button.addEventListener('click', () => {
      const structureType = button.getAttribute('data-structure');
      
      // Only process if not already viewing this structure
      if (structureType !== systemState.structureType) {
        // Remove active class from all structure buttons
        structureButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Change structure
        hologram.changeStructure(structureType);
        systemState.structureType = structureType;
        
        // Update structure name in the info section
        const structureNames = {
          'station': 'NOVA STATION',
          'satellite': 'COMM ARRAY',
          'base': 'OUTPOST ALPHA',
          'farhaven': 'FARHAVEN BASE'
        };
        document.getElementById('structure-name').textContent = structureNames[structureType];
        
        // Structure-specific effects
        if (structureType === 'station') {
          // Space station has balanced metrics
          systemState.gravitationalField = 1.02;
          systemState.oxygen = 21.2;
          systemState.temperature = 22.3;
          systemState.pressure = 1.05;
        } else if (structureType === 'satellite') {
          // Satellite has no gravity, low pressure, cold
          systemState.gravitationalField = 0.01;
          systemState.oxygen = 0;
          systemState.temperature = -150 + Math.random() * 30;
          systemState.pressure = 0;
          addMessage('WARNING: Zero gravity environment detected.');
          addMessage('WARNING: Vacuum conditions. EVA suit required.');
        } else if (structureType === 'base') {
          // Planetary base has higher gravity, varied conditions
          systemState.gravitationalField = 1.15;
          systemState.oxygen = 20.8;
          systemState.temperature = 18 + Math.random() * 8;
          systemState.pressure = 1.1 + Math.random() * 0.1;
          addMessage('Planetary conditions detected. Adjusting environmental controls.');
        } else if (structureType === 'farhaven') {
          // Farhaven base has its own conditions
          systemState.gravitationalField = 0.9;
          systemState.oxygen = 20.5;
          systemState.temperature = 15 + Math.random() * 5;
          systemState.pressure = 1.0 + Math.random() * 0.05;
          addMessage('Farhaven Base conditions detected. Adjusting life support.');
        }
        
        // Update metrics after structure change
        updateMetricsFromState();
        
        // Add to terminal
        addMessage(`Structure changed to ${structureNames[structureType]}`);
        
        // Save state after significant change
        saveSystemState();
      }
    });
  });
};

// Environment data updates tied to system state
const initEnvironmentData = () => {
  // Initial update
  updateEnvironmentFromState();
  
  // Update when system state changes
  setInterval(updateEnvironmentFromState, 4000);
  
  function updateEnvironmentFromState() {
    // Add slight variations to base state values
    const tempVariation = (Math.random() * 0.4) - 0.2;
    const pressureVariation = (Math.random() * 0.04) - 0.02;
    const oxygenVariation = (Math.random() * 0.3) - 0.15;
    const radiationVariation = (Math.random() * 0.04) - 0.02;
    
    // Apply variations to UI while preserving system state
    document.getElementById('temp-value').textContent = 
      (systemState.temperature + tempVariation).toFixed(1) + '°C';
    
    document.getElementById('pressure-value').textContent = 
      (systemState.pressure + pressureVariation).toFixed(2) + ' ATM';
    
    document.getElementById('oxygen-value').textContent = 
      (systemState.oxygen + oxygenVariation).toFixed(1) + '%';
    
    document.getElementById('radiation-value').textContent = 
      (systemState.radiation + radiationVariation).toFixed(2) + ' µSv';
    
    // If values are at dangerous levels, alert
    if (systemState.temperature > 28) {
      addMessage('WARNING: Temperature exceeding safe parameters.');
    }
    
    if (systemState.radiation > 0.8) {
      addMessage('CAUTION: Elevated radiation levels detected.');
    }
    
    if (systemState.oxygen < 19.5) {
      addMessage('ALERT: Oxygen levels below minimum safe threshold.');
    }
  }
};

// Helper function to get random change with bias
function randomChange(maxChange, bias = 0) {
  return (Math.random() * 2 - 1 + bias) * maxChange;
}

// Initialize Three.js Scene
const initHologram = () => {
  const scene = new THREE.Scene();
  const container = document.getElementById('hologram-scene');
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    logarithmicDepthBuffer: true
  });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Camera
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(5, 5, 5);
  
  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 20;
  controls.minDistance = 3;
  
  // Enhanced Lights
  const ambientLight = new THREE.AmbientLight(0x00ff9d, 0.3);
  scene.add(ambientLight);
  
  const pointLight = new THREE.PointLight(0x00ff9d, 1.2, 20);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);
  
  // Add a second accent light
  const accentLight = new THREE.PointLight(0x00aaff, 0.8, 15);
  accentLight.position.set(-5, -3, -5);
  scene.add(accentLight);
  
  // Enhanced Star field with varying star sizes
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });
  
  const starsVertices = [];
  const starSizes = [];
  for (let i = 0; i < 1500; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 100;
    const z = (Math.random() - 0.5) * 100;
    starsVertices.push(x, y, z);
    
    // Varied star sizes
    const size = Math.random() * 0.1 + 0.05;
    starSizes.push(size);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
  
  // Add subtle nebula-like fog
  scene.fog = new THREE.FogExp2(0x000511, 0.0025);
  
  // Adding holographic grid
  const gridSize = 20;
  const gridDivisions = 20;
  const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ff9d, 0x004d2e);
  gridHelper.position.y = -5;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.3;
  scene.add(gridHelper);
  
  // Create selectable structures
  const structures = {
    spaceStation: createSpaceStation(),
    satelliteArray: createSatelliteArray(),
    planetaryBase: createPlanetaryBase(),
    farhavenBase: createFarhavenBase()
  };
  
  // Initially show space station
  let currentStructure = structures.spaceStation;
  scene.add(currentStructure);
  
  // Add floating data particles around structure
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00ffcc,
    size: 0.1,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  
  const particlePositions = [];
  for (let i = 0; i < 100; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 4 + Math.random() * 3;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    particlePositions.push(x, y, z);
  }
  
  particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);
  
  // Enhanced animation loop with particle effects
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    
    // Rotate structure
    currentStructure.rotation.y += 0.002;
    
    // Rotate starfield and grid
    starField.rotation.y += 0.0002;
    gridHelper.rotation.y += 0.0005;
    
    // Animate particles
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      // Move particles toward and away from center in a pulsing pattern
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      const distance = Math.sqrt(x*x + y*y + z*z);
      const normalizedX = x / distance;
      const normalizedY = y / distance;
      const normalizedZ = z / distance;
      
      const pulseSpeed = 0.02;
      const time = Date.now() * 0.001;
      const pulseOffset = i % 30 * 0.1;
      const pulseFactor = Math.sin(time * pulseSpeed + pulseOffset) * 0.1;
      
      positions[i] = normalizedX * (distance + pulseFactor);
      positions[i + 1] = normalizedY * (distance + pulseFactor);
      positions[i + 2] = normalizedZ * (distance + pulseFactor);
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    
    // Make lights pulse subtly
    const time = Date.now() * 0.001;
    pointLight.intensity = 1.2 + Math.sin(time) * 0.2;
    accentLight.intensity = 0.8 + Math.cos(time * 1.5) * 0.2;
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
  
  // Return references for external control
  return {
    scene,
    changeStructure: (structureType) => {
      scene.remove(currentStructure);
      switch(structureType) {
        case 'station':
          currentStructure = structures.spaceStation;
          break;
        case 'satellite':
          currentStructure = structures.satelliteArray;
          break;
        case 'base':
          currentStructure = structures.planetaryBase;
          break;
        case 'farhaven':
          currentStructure = structures.farhavenBase;
          break;
        default:
          currentStructure = structures.spaceStation;
      }
      scene.add(currentStructure);
      
      // Create scanner effect around new structure
      createScannerEffect(scene, currentStructure);
    },
    setMode: (mode) => {
      const materials = [];
      
      // Collect all materials from the current structure
      currentStructure.traverse(child => {
        if (child.isMesh && child.material) {
          materials.push(child.material);
        }
      });
      
      switch(mode) {
        case 'xray':
          materials.forEach(material => {
            gsap.to(material, { opacity: 0.2, duration: 1 });
            if (material.color) material.color.set(0x00ccff);
            if (material.emissive) material.emissive.set(0x00ccff);
          });
          pointLight.color.set(0x00ccff);
          break;
        case 'energy':
          materials.forEach(material => {
            gsap.to(material, { opacity: 0.7, duration: 1 });
            if (material.color) material.color.set(0xff8800);
            if (material.emissive) material.emissive.set(0xff8800);
          });
          pointLight.color.set(0xff8800);
          break;
        case 'eco':
          materials.forEach(material => {
            gsap.to(material, { opacity: 0.6, duration: 1 });
            if (material.color) material.color.set(0x00aa44);
            if (material.emissive) material.emissive.set(0x00aa44);
          });
          pointLight.color.set(0x00aa44);
          pointLight.intensity = 0.8;
          break;
        case 'boost':
          materials.forEach(material => {
            gsap.to(material, { opacity: 0.8, duration: 1 });
            if (material.color) material.color.set(0xff5500);
            if (material.emissive) material.emissive.set(0xff5500);
            if (material.emissiveIntensity) material.emissiveIntensity = 0.8;
          });
          pointLight.color.set(0xff5500);
          pointLight.intensity = 1.5;
          break;
        default: // standard
          materials.forEach(material => {
            gsap.to(material, { opacity: 0.5, duration: 1 });
            if (material.color) material.color.set(0x00ff9d);
            if (material.emissive) material.emissive.set(0x00ff9d);
            if (material.emissiveIntensity) material.emissiveIntensity = 0.3;
          });
          pointLight.color.set(0x00ff9d);
          pointLight.intensity = 1.2;
          break;
      }
    }
  };
};

// Create scanner effect around structure
const createScannerEffect = (scene, structure) => {
  // Create rings that expand outward
  const geometry = new THREE.RingGeometry(0.1, 0.15, 32);
  const material = new THREE.MeshBasicMaterial({ 
    color: 0x00ff9d, 
    transparent: true, 
    opacity: 0.7,
    side: THREE.DoubleSide
  });
  
  const ring = new THREE.Mesh(geometry, material);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
  
  // Animate ring outward
  gsap.to(ring.scale, {
    x: 50,
    y: 50,
    z: 1,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      ring.material.opacity = 0.7 * (1 - ring.scale.x / 50);
    },
    onComplete: () => {
      scene.remove(ring);
      ring.geometry.dispose();
      ring.material.dispose();
    }
  });
};

// Initialize glitch effects
const initGlitchEffects = () => {
  const createGlitch = () => {
    const overlay = document.querySelector('.glitch-overlay');
    overlay.style.opacity = '0.2';
    
    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 150);
  };
  
  // Random glitches
  setInterval(() => {
    if (Math.random() > 0.7) {
      createGlitch();
    }
  }, 3000);
};

initGlitchEffects();

// Initialize holographic effects for enhanced visuals
const initHolographicEffects = () => {
  // Add holographic noise overlay to panels
  document.querySelectorAll('.panel-section').forEach(panel => {
    const noise = document.createElement('div');
    noise.classList.add('holo-noise');
    panel.appendChild(noise);
  });
  
  // Add holographic floating data particles
  const hologramContainer = document.querySelector('.hologram-container');
  const dataBlips = document.createElement('div');
  dataBlips.classList.add('data-blips');
  hologramContainer.appendChild(dataBlips);
  
  // Create random data blips that appear to float upward
  for (let i = 0; i < 15; i++) {
    const blip = document.createElement('div');
    blip.classList.add('blip');
    blip.style.left = `${Math.random() * 100}%`;
    blip.style.top = `${Math.random() * 100}%`;
    blip.style.animationDelay = `${Math.random() * 8}s`;
    dataBlips.appendChild(blip);
  }
  
  // Add glitch text effect to titles
  document.querySelectorAll('h3').forEach(title => {
    title.classList.add('glitch-text');
    title.setAttribute('data-text', title.textContent);
  });
};

// Initialize data flow animation
const initDataFlowAnimation = () => {
  const panels = document.querySelectorAll('.panel-section');
  
  panels.forEach(panel => {
    const dataFlow = document.createElement('div');
    dataFlow.classList.add('data-flow');
    panel.appendChild(dataFlow);
    
    // Create data particles flowing through panels
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.classList.add('data-particle');
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 3}s`;
      dataFlow.appendChild(particle);
    }
  });
  
  // Add data flow to the terminal area
  const terminal = document.querySelector('.terminal');
  const terminalFlow = document.createElement('div');
  terminalFlow.classList.add('data-flow');
  terminal.appendChild(terminalFlow);
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.classList.add('data-particle');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 3}s`;
    terminalFlow.appendChild(particle);
  }
};

// Initialize circular progress indicators
const initCircularProgress = () => {
  // Add circular indicators to the top section
  const leftPanel = document.querySelector('.left-panel');
  const circularSection = document.createElement('div');
  circularSection.classList.add('panel-section');
  circularSection.innerHTML = `
    <h3>QUANTUM METRICS</h3>
    <div class="circular-progress">
      <div class="circular-container">
        <div class="circular-progress-bar" id="quantum-stability"></div>
        <span class="circular-value" id="quantum-stability-value">93%</span>
        <div class="circular-label">STABILITY</div>
      </div>
      <div class="circular-container">
        <div class="circular-progress-bar" id="subspace-link"></div>
        <span class="circular-value" id="subspace-link-value">3/5</span>
        <div class="circular-label">LINKS</div>
      </div>
      <div class="circular-container">
        <div class="circular-progress-bar" id="data-integrity"></div>
        <span class="circular-value" id="data-integrity-value">87%</span>
        <div class="circular-label">INTEGRITY</div>
      </div>
    </div>
  `;
  
  leftPanel.insertBefore(circularSection, leftPanel.firstChild);
  
  // Initialize circular progress values
  updateCircularProgress('quantum-stability', 93);
  updateCircularProgress('subspace-link', 60);
  updateCircularProgress('data-integrity', 87);
  
  // Update periodically
  setInterval(() => {
    // Quantum stability fluctuates based on anomalies and system state
    const stabilityValue = Math.max(70, 95 - (systemState.anomalies * 3) - 
                                  (systemState.powerMode === 'boost' ? 5 : 0));
    updateCircularProgress('quantum-stability', stabilityValue);
    document.getElementById('quantum-stability-value').textContent = `${stabilityValue}%`;
    
    // Subspace links depend on structural integrity
    const linkPercentage = Math.min(100, Math.max(0, systemState.shieldIntegrity - 40));
    const linkValue = Math.ceil(linkPercentage / 20); // 0-5 links
    updateCircularProgress('subspace-link', linkPercentage);
    document.getElementById('subspace-link-value').textContent = `${linkValue}/5`;
    systemState.subspaceLinks = linkValue;
    
    // Data integrity depends on power and quantum stability
    const dataIntegrity = Math.min(99, Math.max(50, 
                                 systemState.corePower - 10 + 
                                 (stabilityValue - 80)));
    updateCircularProgress('data-integrity', dataIntegrity);
    document.getElementById('data-integrity-value').textContent = `${Math.round(dataIntegrity)}%`;
  }, 4000);
};

// Update circular progress display
const updateCircularProgress = (id, percentage) => {
  const element = document.getElementById(id);
  if (element) {
    element.style.background = `conic-gradient(
      var(--primary-color) ${percentage}%, 
      transparent ${percentage}%
    )`;
    
    // Set colors based on value
    if (percentage < 30) {
      element.style.background = `conic-gradient(
        var(--alert-color) ${percentage}%, 
        transparent ${percentage}%
      )`;
    } else if (percentage < 70) {
      element.style.background = `conic-gradient(
        var(--warning-color) ${percentage}%, 
        transparent ${percentage}%
      )`;
    }
  }
};

// Start system uptime counter
const startUptimeCounter = () => {
  // Add uptime indicator to status bar
  const statusBar = document.querySelector('.status-bar');
  const uptimeElement = document.createElement('div');
  uptimeElement.classList.add('status-item');
  uptimeElement.innerHTML = `
    <span class="label">UPTIME</span>
    <span class="value" id="uptime-value">00:00:00</span>
  `;
  statusBar.appendChild(uptimeElement);
  
  // Update uptime every second
  setInterval(() => {
    systemState.systemUptime++;
    const hours = Math.floor(systemState.systemUptime / 3600);
    const minutes = Math.floor((systemState.systemUptime % 3600) / 60);
    const seconds = systemState.systemUptime % 60;
    
    document.getElementById('uptime-value').textContent = 
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
};