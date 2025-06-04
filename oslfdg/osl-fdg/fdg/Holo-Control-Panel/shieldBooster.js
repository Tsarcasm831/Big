import { gsap } from 'gsap';

export function initShieldBooster() {
  // Create the shield booster panel
  const panel = document.createElement('div');
  panel.className = 'panel-section shield-booster';
  panel.innerHTML = `
    <h3>SHIELD BOOSTER</h3>
    <div class="shield-status">
      <div class="shield-visualization">
        <svg viewBox="0 0 100 100" class="shield-diagram">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border-color)" stroke-width="1" opacity="0.5" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="var(--border-color)" stroke-width="1" opacity="0.7" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="var(--border-color)" stroke-width="1" opacity="0.9" />
          <path id="shield-arc-outer" d="M50,5 A45,45 0 1,1 49.999,5" stroke="var(--primary-color)" 
            fill="none" stroke-width="3" stroke-dasharray="282.6 282.6" stroke-dashoffset="282.6" />
          <path id="shield-arc-middle" d="M50,15 A35,35 0 1,1 49.999,15" stroke="var(--primary-color)" 
            fill="none" stroke-width="2" stroke-dasharray="219.8 219.8" stroke-dashoffset="219.8" />
          <path id="shield-arc-inner" d="M50,25 A25,25 0 1,1 49.999,25" stroke="var(--primary-color)" 
            fill="none" stroke-width="1.5" stroke-dasharray="157 157" stroke-dashoffset="157" />
          <circle cx="50" cy="50" r="15" fill="rgba(0, 255, 157, 0.1)" stroke="var(--border-color)" stroke-width="1" />
          <text x="50" y="54" font-size="8" fill="var(--primary-color)" text-anchor="middle" id="shield-percentage">0%</text>
        </svg>
      </div>
      <div class="boost-controls">
        <div class="boost-level">
          <span class="label">BOOST LEVEL</span>
          <div class="boost-buttons">
            <button class="boost-btn" data-level="1">1</button>
            <button class="boost-btn" data-level="2">2</button>
            <button class="boost-btn" data-level="3">3</button>
          </div>
        </div>
        <div class="boost-info">
          <div class="boost-data">
            <span class="label">POWER DRAIN</span>
            <span class="value" id="shield-power-drain">-0%</span>
          </div>
          <div class="boost-data">
            <span class="label">SHIELD GAIN</span>
            <span class="value" id="shield-integrity-gain">+0%</span>
          </div>
        </div>
        <button class="sys-btn" id="activate-shield-btn">
          <svg viewBox="0 0 24 24">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22Z" />
          </svg>
          <span>ACTIVATE</span>
        </button>
      </div>
    </div>
    <div class="shield-metrics">
      <div class="shield-metric">
        <span class="label">FREQUENCY</span>
        <span class="value" id="shield-frequency">478.5 MHz</span>
      </div>
      <div class="shield-metric">
        <span class="label">MODULATION</span>
        <span class="value" id="shield-modulation">ADAPTIVE</span>
      </div>
      <div class="shield-metric">
        <span class="label">COVERAGE</span>
        <span class="value" id="shield-coverage">92.4%</span>
      </div>
    </div>
    <div class="shield-hint">Select level then press ACTIVATE to reinforce shields</div>
  `;
  
  // Add the panel to the right panel
  const rightPanel = document.querySelector('.right-panel');
  rightPanel.appendChild(panel);
  
  // Initialize the boost buttons
  const boostButtons = document.querySelectorAll('.boost-btn');
  const powerDrainLabel = document.getElementById('shield-power-drain');
  const integrityGainLabel = document.getElementById('shield-integrity-gain');
  const activateButton = document.getElementById('activate-shield-btn');
  const shieldFrequency = document.getElementById('shield-frequency');
  const shieldCoverage = document.getElementById('shield-coverage');
  const shieldPercentage = document.getElementById('shield-percentage');
  
  // Initialize shield arcs based on current shield integrity
  const systemState = window.systemState;
  const updateShieldArcs = (integrity = systemState.shieldIntegrity) => {
    const outerArc = document.getElementById('shield-arc-outer');
    const middleArc = document.getElementById('shield-arc-middle');
    const innerArc = document.getElementById('shield-arc-inner');
    const dashOffsetOuter = 282.6 - (282.6 * integrity / 100);
    const dashOffsetMiddle = 219.8 - (219.8 * integrity / 100);
    const dashOffsetInner = 157 - (157 * integrity / 100);
    
    outerArc.style.strokeDashoffset = dashOffsetOuter;
    middleArc.style.strokeDashoffset = dashOffsetMiddle;
    innerArc.style.strokeDashoffset = dashOffsetInner;
    shieldPercentage.textContent = `${Math.round(integrity)}%`;
  };
  
  // Initialize shield visualization
  updateShieldArcs();
  
  let selectedLevel = 0;
  
  // Boost level button handlers
  boostButtons.forEach(button => {
    button.addEventListener('click', () => {
      const level = parseInt(button.getAttribute('data-level'));
      
      // Deselect all buttons first
      boostButtons.forEach(btn => btn.classList.remove('active'));
      
      if (selectedLevel === level) {
        // Clicking the same button deselects it
        selectedLevel = 0;
        powerDrainLabel.textContent = '-0%';
        integrityGainLabel.textContent = '+0%';
      } else {
        // Select the new button
        button.classList.add('active');
        selectedLevel = level;
        
        // Calculate power drain and shield gain based on level
        const powerDrain = level * 8;
        const shieldGain = level * 5 + (level === 3 ? 5 : 0); // Bonus for level 3
        
        powerDrainLabel.textContent = `-${powerDrain}%`;
        integrityGainLabel.textContent = `+${shieldGain}%`;
        
        // Preview the shield boost effect
        const currentIntegrity = systemState.shieldIntegrity;
        const previewIntegrity = Math.min(100, currentIntegrity + shieldGain);
        
        // Flicker preview animation
        let isPreview = true;
        const previewAnimation = setInterval(() => {
          if (isPreview) {
            updateShieldArcs(previewIntegrity);
          } else {
            updateShieldArcs(currentIntegrity);
          }
          isPreview = !isPreview;
        }, 500);
        
        // Clear preview after 3 seconds or if another level is selected
        setTimeout(() => {
          clearInterval(previewAnimation);
          updateShieldArcs(currentIntegrity);
        }, 3000);
      }
    });
  });
  
  // Activate shield boost button handler
  activateButton.addEventListener('click', () => {
    if (selectedLevel === 0) {
      addMessage('No shield boost level selected.');
      return;
    }
    
    // Calculate power drain and shield gain based on level
    const powerDrain = selectedLevel * 8;
    const shieldGain = selectedLevel * 5 + (selectedLevel === 3 ? 5 : 0); // Bonus for level 3
    
    // Get current system state
    const systemState = window.systemState;
    
    // Check if there's enough power to allocate
    if (systemState.corePower <= powerDrain + 5) {
      addMessage('WARNING: Insufficient core power for shield boost.');
      // Visual feedback for error
      gsap.to(powerDrainLabel, {
        color: 'var(--alert-color)',
        duration: 0.3,
        yoyo: true,
        repeat: 3
      });
      return;
    }
    
    // Apply the changes to system state
    systemState.corePower -= powerDrain;
    systemState.shieldIntegrity = Math.min(100, systemState.shieldIntegrity + shieldGain);
    
    // Update UI
    window.updateProgressBar('core-power', systemState.corePower);
    window.updateProgressBar('shield-integrity', systemState.shieldIntegrity);
    
    // Animate the shield arcs
    updateShieldArcs(systemState.shieldIntegrity);
    
    // Visual pulse effect on shield diagram
    gsap.to('.shield-diagram circle', {
      stroke: 'var(--primary-color)',
      strokeWidth: 2,
      opacity: 1,
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      stagger: 0.1
    });
    
    // Update shield metrics with randomized "realistic" values
    shieldFrequency.textContent = `${(400 + Math.random() * 150).toFixed(1)} MHz`;
    shieldCoverage.textContent = `${(85 + Math.random() * 14).toFixed(1)}%`;
    
    // Reset buttons with animation
    gsap.to(boostButtons, {
      backgroundColor: 'rgba(0, 255, 157, 0.3)',
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        boostButtons.forEach(btn => btn.classList.remove('active'));
      }
    });
    
    selectedLevel = 0;
    powerDrainLabel.textContent = '-0%';
    integrityGainLabel.textContent = '+0%';
    
    // Add message to terminal
    addMessage(`Shield boost level ${selectedLevel} activated. Power allocation: -${powerDrain}%, Shield gain: +${shieldGain}%`);
    if (selectedLevel === 3) {
      addMessage('Maximum shield boost applied. Shield modulation optimized.');
    }
    
    // Visual feedback
    const panel = document.querySelector('.shield-booster');
    gsap.to(panel, {
      backgroundColor: 'rgba(0, 255, 157, 0.2)',
      duration: 0.5,
      yoyo: true,
      repeat: 1
    });
  });
  
  // Return a reference to allow external control
  return {
    boostShield: (level) => {
      if (level >= 1 && level <= 3) {
        // Programmatically click the right level button
        const button = document.querySelector(`.boost-btn[data-level="${level}"]`);
        button.click();
        activateButton.click();
      }
    },
    updateShieldVisualization: () => {
      updateShieldArcs(systemState.shieldIntegrity);
    }
  };
}