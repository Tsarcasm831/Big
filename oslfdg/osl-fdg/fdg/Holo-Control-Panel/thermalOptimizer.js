import { gsap } from 'gsap';

export function initThermalOptimizer() {
  // Create the thermal regulation optimization panel
  const panel = document.createElement('div');
  panel.className = 'panel-section thermal-optimizer';
  panel.innerHTML = `
    <h3>THERMAL OPTIMIZER</h3>
    <div class="energy-transfer">
      <div class="transfer-slider-container">
        <input type="range" min="0" max="100" value="0" class="transfer-slider" id="thermal-slider">
        <div class="thermal-effect-preview"></div>
        <div class="transfer-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      <div class="transfer-values">
        <div class="transfer-value">
          <span class="transfer-label">POWER COST</span>
          <span class="transfer-amount" id="thermal-power-cost">0%</span>
        </div>
        <div class="transfer-value">
          <span class="transfer-label">THERMAL GAIN</span>
          <span class="transfer-amount" id="thermal-regulation-gain">0%</span>
        </div>
      </div>
      <button class="sys-btn" id="apply-thermal-btn">
        <svg viewBox="0 0 24 24">
          <path d="M3,16H8V14H3V16M9,16H14V14H9V16M15,16H21V14H15V16M3,20H5V18H3V20M7,20H9V18H7V20M11,20H13V18H11V20M15,20H17V18H15V20M19,20H21V18H19V20M3,12H7V10H3V12M9,12H13V10H9V12M15,12H21V10H15V12M3,4V8H21V4H3Z" />
        </svg>
        <span>APPLY CHANGES</span>
      </button>
    </div>
    <div class="energy-readout">
      <div class="readout-diagram">
        <svg viewBox="0 0 100 60" class="thermal-diagram">
          <path d="M10,50 L30,50 L35,35 L40,45 L45,25 L50,40 L55,30 L60,45 L65,15 L70,50 L90,50" 
            stroke="var(--primary-color)" fill="none" stroke-width="2" class="thermal-path" />
          <rect x="10" y="51" width="80" height="1" fill="var(--border-color)" />
          <text x="10" y="58" fill="var(--text-dim)" font-size="6">TIME</text>
        </svg>
      </div>
      <div class="stats-readout">
        <div class="efficiency-indicator">
          <span class="label">EFFICIENCY</span>
          <span class="value" id="thermal-efficiency">NOMINAL</span>
        </div>
      </div>
    </div>
    <div class="help-text">
      <span>Adjust thermal energy allocation to maintain optimal operating temperatures.</span>
    </div>
  `;
  
  // Add the panel to the left side of the screen
  const leftPanel = document.querySelector('.left-panel');
  leftPanel.appendChild(panel);
  
  // Initialize the slider event
  const slider = document.getElementById('thermal-slider');
  const powerCostLabel = document.getElementById('thermal-power-cost');
  const regulationGainLabel = document.getElementById('thermal-regulation-gain');
  const applyButton = document.getElementById('apply-thermal-btn');
  const efficiencyLabel = document.getElementById('thermal-efficiency');
  const thermalEffectPreview = document.querySelector('.thermal-effect-preview');
  
  slider.addEventListener('input', () => {
    const value = parseInt(slider.value);
    // Update the preview bar width to match slider
    thermalEffectPreview.style.width = `${value}%`;
    
    // Power cost increases with higher transfer values but with diminishing returns
    const powerCost = Math.ceil((value / 100) * (value / 100) * 25);
    // Thermal gain is slightly more efficient than power cost
    const thermalGain = Math.ceil((value / 100) * 30);
    
    powerCostLabel.textContent = `-${powerCost}%`;
    regulationGainLabel.textContent = `+${thermalGain}%`;
    
    // Update efficiency indicator with better visual feedback
    if (value < 20) {
      efficiencyLabel.textContent = 'LOW';
      efficiencyLabel.className = 'value status-critical';
    } else if (value < 40) {
      efficiencyLabel.textContent = 'SUBOPTIMAL';
      efficiencyLabel.className = 'value status-warning';
    } else if (value < 70) {
      efficiencyLabel.textContent = 'NOMINAL';
      efficiencyLabel.className = 'value status-good';
    } else if (value < 90) {
      efficiencyLabel.textContent = 'OPTIMAL';
      efficiencyLabel.className = 'value status-good';
    } else {
      efficiencyLabel.textContent = 'MAXIMUM';
      efficiencyLabel.className = 'value status-warning';
    }
    
    // Visual feedback on the slider
    const gradientStop = value;
    slider.style.background = `linear-gradient(90deg, 
      var(--primary-color) 0%, 
      var(--primary-color) ${gradientStop}%, 
      rgba(0, 0, 0, 0.5) ${gradientStop}%)`;
  });
  
  // Apply changes button
  applyButton.addEventListener('click', () => {
    const value = slider.value;
    if (value <= 0) {
      addMessage('No thermal optimization parameters selected.');
      return;
    }
    
    // Calculate power cost and thermal gain
    const powerCost = Math.ceil((value / 100) * (value / 100) * 25);
    const thermalGain = Math.ceil((value / 100) * 30);
    
    // Get current system state
    const systemState = window.systemState;
    
    // Check if there's enough power to allocate
    if (systemState.corePower <= powerCost + 10) {
      addMessage('WARNING: Insufficient core power for thermal optimization.');
      // Visual feedback for error
      gsap.to(powerCostLabel, {
        color: 'var(--alert-color)',
        duration: 0.3,
        yoyo: true,
        repeat: 3
      });
      return;
    }
    
    // Apply the changes to system state
    systemState.corePower -= powerCost;
    systemState.thermalReg = Math.min(100, systemState.thermalReg + thermalGain);
    
    // Update UI
    window.updateProgressBar('core-power', systemState.corePower);
    window.updateProgressBar('thermal-reg', systemState.thermalReg);
    
    // Reset the slider with animation
    gsap.to(slider, {
      value: 0,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => {
        slider.dispatchEvent(new Event('input'));
      }
    });
    
    // Animate the thermal path to simulate optimization
    const thermalPath = document.querySelector('.thermal-path');
    gsap.to(thermalPath, {
      attr: { d: "M10,50 L30,40 L35,30 L40,25 L45,20 L50,15 L55,13 L60,12 L65,11 L70,10 L90,10" },
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(thermalPath, {
          attr: { d: "M10,50 L30,50 L35,35 L40,45 L45,25 L50,40 L55,30 L60,45 L65,15 L70,50 L90,50" },
          duration: 3,
          delay: 0.5,
          ease: "sine.inOut"
        });
      }
    });
    
    // Add message to terminal
    addMessage(`Thermal regulation optimized. Power allocation: -${powerCost}%, Thermal efficiency: +${thermalGain}%`);
    
    // Visual feedback
    const panel = document.querySelector('.thermal-optimizer');
    gsap.to(panel, {
      backgroundColor: 'rgba(0, 255, 157, 0.2)',
      duration: 0.5,
      yoyo: true,
      repeat: 1
    });
  });
  
  // Return a reference to allow external control
  return {
    optimizeThermal: (value) => {
      slider.value = value;
      slider.dispatchEvent(new Event('input'));
      applyButton.click();
    }
  };
}