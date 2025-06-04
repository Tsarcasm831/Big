document.addEventListener('DOMContentLoaded', function() {
  // Select the "Hospital" button by its text content
  const hospitalBtn = Array.from(document.querySelectorAll('#bottom-buttons button'))
                           .find(btn => btn.textContent.trim() === "Hospital");
  if (!hospitalBtn) {
    console.error("Hospital button not found.");
    return;
  }

  // Create the modal popup container for the hospital grid view
  const popup = document.createElement('div');
  popup.id = 'hospital-popup';
  popup.classList.add('hospital-popup', 'no-select');

  // Patient data for occupied beds
  const patients = {
    "bed1": {
      name: "Sarah Jennings",
      dob: "05/12/2003",
      age: 22,
      condition: "Radiation Poisoning",
      vitalSigns: "BP: 140/90, HR: 100, Temp: 39.2°C",
      treatment: "Anti-radiation meds, IV fluids, bone marrow stimulants"
    },
    "bed3": {
      name: "Marcus Reynolds",
      dob: "11/28/1992",
      age: 33,
      condition: "Mutant Venom Infection",
      vitalSigns: "BP: 90/60, HR: 120, Temp: 40.1°C",
      treatment: "Experimental antivenom, broad-spectrum antibiotics, cooling measures"
    },
    "bed4": {
      name: "Eliza Chen",
      dob: "07/03/1988",
      age: 37,
      condition: "Wasteland Pneumonia",
      vitalSigns: "BP: 110/70, HR: 95, Temp: 38.5°C, O2 Sat: 88%",
      treatment: "Oxygen therapy, specialized antibiotics, lung repair nanomeds"
    },
    "bed6": {
      name: "Jamal Wilson",
      dob: "02/15/1998",
      age: 27,
      condition: "Chemical Burns",
      vitalSigns: "BP: 135/85, HR: 105, Temp: 37.8°C",
      treatment: "Synthetic skin grafts, pain management, detoxification therapy"
    }
  };

  // Inner content for the hospital blueprint popup
  popup.innerHTML = `
    <div id="hospital-content" class="hospital-content">
      <button id="hospital-close" class="hospital-close">&times;</button>
      <h2 class="hospital-title">Post-Apocalyptic Medical Center</h2>
      
      <!-- Medical office with head doctor (replacing reception) -->
      <div class="medical-office">
        <div class="doctor-area">
          <div class="doctor-avatar">👨‍⚕️</div>
          <div class="doctor-info">
            <h3>Dr. Marcus Wells</h3>
            <p>Head Physician</p>
            <p class="doctor-quote">"We do what we can with what we have. Welcome to our medical center."</p>
          </div>
        </div>
      </div>
      
      <div class="beds-container">
        <div class="bed-row">
          <div class="bed occupied" id="bed1" data-patient="bed1">
            <div class="patient-icon">🤒</div>
            <div>Bed 1</div>
          </div>
          <div class="bed" id="bed2">
            <div>Bed 2</div>
          </div>
          <div class="bed occupied" id="bed3" data-patient="bed3">
            <div class="patient-icon">🤢</div>
            <div>Bed 3</div>
          </div>
        </div>
        <div class="bed-row">
          <div class="bed occupied" id="bed4" data-patient="bed4">
            <div class="patient-icon">😷</div>
            <div>Bed 4</div>
          </div>
          <div class="bed" id="bed5">
            <div>Bed 5</div>
          </div>
          <div class="bed occupied" id="bed6" data-patient="bed6">
            <div class="patient-icon">🥵</div>
            <div>Bed 6</div>
          </div>
        </div>
      </div>

      <!-- Patient chart modal (hidden by default) -->
      <div id="patient-chart" class="patient-chart">
        <div class="chart-content">
          <div class="chart-header">
            <h3>Patient Medical Chart</h3>
            <button id="chart-close">×</button>
          </div>
          <div class="chart-body">
            <div class="chart-row">
              <span class="chart-label">Name:</span>
              <span id="patient-name" class="chart-value"></span>
            </div>
            <div class="chart-row">
              <span class="chart-label">DOB/Age:</span>
              <span id="patient-dob-age" class="chart-value"></span>
            </div>
            <div class="chart-row">
              <span class="chart-label">Condition:</span>
              <span id="patient-condition" class="chart-value"></span>
            </div>
            <div class="chart-row">
              <span class="chart-label">Vital Signs:</span>
              <span id="patient-vitals" class="chart-value"></span>
            </div>
            <div class="chart-row">
              <span class="chart-label">Treatment:</span>
              <span id="patient-treatment" class="chart-value"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // Function to show the popup
  function showHospitalPopup() {
    console.log('Showing hospital popup'); // Log when the popup is shown
    popup.classList.add('show');
  }

  // Function to hide the popup
  function hideHospitalPopup() {
    console.log('Hiding hospital popup'); // Log when the popup is hidden
    popup.classList.remove('show');
  }

  // Function to display patient chart
  function showPatientChart(patientId) {
    const patientData = patients[patientId];
    if (!patientData) {
      console.error("Patient data not found for ID:", patientId);
      return;
    }

    // Fill in the patient chart with data
    document.getElementById('patient-name').textContent = patientData.name;
    document.getElementById('patient-dob-age').textContent = `${patientData.dob} (${patientData.age})`;
    document.getElementById('patient-condition').textContent = patientData.condition;
    document.getElementById('patient-vitals').textContent = patientData.vitalSigns;
    document.getElementById('patient-treatment').textContent = patientData.treatment;

    // Show the chart
    document.getElementById('patient-chart').classList.add('show');
  }

  // Function to hide patient chart
  function hidePatientChart() {
    document.getElementById('patient-chart').classList.remove('show');
  }

  // Open the hospital popup when the "Hospital" button is clicked
  hospitalBtn.addEventListener('click', function(e) {
    e.preventDefault();
    showHospitalPopup();
  });

  // Close the popup when the close button is clicked
  popup.querySelector('#hospital-close').addEventListener('click', hideHospitalPopup);

  // Also hide the popup when clicking outside the inner content
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      hideHospitalPopup();
    }
  });

  // Close patient chart when close button is clicked
  document.getElementById('chart-close').addEventListener('click', hidePatientChart);

  // Show patient chart when clicking on an occupied bed
  popup.querySelectorAll('.bed.occupied').forEach(bed => {
    bed.addEventListener('click', function() {
      const patientId = this.dataset.patient;
      showPatientChart(patientId);
    });
  });

  // Prevent text selection on the hospital interface
  popup.addEventListener('mousedown', function(e) {
    if (e.target.id !== 'hospital-close' && e.target.id !== 'chart-close') {
      e.preventDefault();
    }
  });
});