// resonance.script.js - Handles the interactive resonance alignment exercise

document.addEventListener('DOMContentLoaded', () => {
    const waveCanvas = document.getElementById('wave-canvas');
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    const slider3 = document.getElementById('slider3');
    const valueOutput1 = document.querySelector('output[for="slider1"]');
    const valueOutput2 = document.querySelector('output[for="slider2"]');
    const valueOutput3 = document.querySelector('output[for="slider3"]');
    const proximityIndicator = document.getElementById('proximity-indicator');

    if (!waveCanvas || !slider1 || !slider2 || !slider3 || !proximityIndicator || !valueOutput1 || !valueOutput2 || !valueOutput3) {
        console.error("Required elements for resonance interaction not found.");
        return;
    }

    const SVG_NS = "http://www.w3.org/2000/svg";
    const NUM_WAVES = 4;
    const BASE_AMPLITUDE = 30;
    const POINTS_PER_WAVE = 100;
    const TARGET_ALIGNMENT_THRESHOLD = 0.15; // Lower is better alignment

    let hiddenSliderW = 50; // Controlled by W/S
    let hiddenSliderA = 50; // Controlled by A/D
    const HIDDEN_SLIDER_STEP = 2;
    const HIDDEN_SLIDER_MIN = 0;
    const HIDDEN_SLIDER_MAX = 100;

    let time = 0;
    let animationFrameId = null;

    const wavePaths = [];
    const waveColors = ['#88aaff', '#ffaa88', '#aaffaa', '#ffaaff']; // Example colors

    function createWaves() {
        waveCanvas.innerHTML = ''; // Clear existing waves (except defs)
         // Re-add defs if clearing completely
        const defs = document.createElementNS(SVG_NS, 'defs');
        defs.innerHTML = `
            <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>`;
        waveCanvas.appendChild(defs);

        for (let i = 0; i < NUM_WAVES; i++) {
            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', waveColors[i % waveColors.length]);
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('opacity', '0.7');
            path.setAttribute('filter', 'url(#glow)');
            waveCanvas.appendChild(path);
            wavePaths.push(path);
        }
    }

    function updateWaves() {
        time += 0.02; // Increment time for animation

        const s1 = slider1.value / 100; // Normalize 0-1
        const s2 = slider2.value / 100;
        const s3 = slider3.value / 100;
        const hW = hiddenSliderW / 100; // Hidden W/S
        const hA = hiddenSliderA / 100; // Hidden A/D

        // Simple target values (can be made more complex)
        // These represent the "ideal" settings, though unreachable
        const target1 = 0.3;
        const target2 = 0.7;
        const target3 = 0.5;
        const targetW = 0.6;
        const targetA = 0.4;

        let totalDifference = 0;

        wavePaths.forEach((path, index) => {
            let d = "M 0 100 "; // Start path at middle-left
            const amplitudeFactor = 1.0 + (index - NUM_WAVES / 2) * 0.1; // Slightly different base amps
            const frequencyFactor = 1.0 + index * 0.2; // Different base frequencies

            // Combine sliders influence - make it complex and interdependent
            const influence1 = (s1 * 0.4 + hA * 0.3 + Math.sin(time * 0.8 + index) * 0.1) * amplitudeFactor;
            const influence2 = (s2 * 0.5 + hW * 0.2 + Math.cos(time * 1.1 + index * 0.5) * 0.1) * amplitudeFactor;
            const influence3 = (s3 * 0.3 + hA * 0.1 + hW * 0.2 + Math.sin(time * 1.5 + index * 1.1) * 0.05) * amplitudeFactor;

            // Overall wave turbulence based on mismatch from hypothetical target
            const diff1 = Math.abs(s1 - target1);
            const diff2 = Math.abs(s2 - target2);
            const diff3 = Math.abs(s3 - target3);
            const diffW = Math.abs(hW - targetW);
            const diffA = Math.abs(hA - targetA);
            const combinedDiff = (diff1 + diff2 + diff3 + diffW + diffA) / 5; // Average difference
            totalDifference += combinedDiff; // Accumulate difference for proximity indicator

            const turbulence = 1 + combinedDiff * 5; // More difference = more turbulence

            for (let i = 0; i <= POINTS_PER_WAVE; i++) {
                const x = (i / POINTS_PER_WAVE) * 500; // SVG width
                let y = 100; // Center line

                // Base wave shape using multiple sines/cosines
                y += Math.sin(x * 0.02 * frequencyFactor + time * 2 + index) * BASE_AMPLITUDE * influence1 * 0.5;
                y += Math.cos(x * 0.035 * frequencyFactor + time * 1.5 + index * 0.3) * BASE_AMPLITUDE * influence2 * 0.4;
                y += Math.sin(x * 0.01 * frequencyFactor + time * 2.5 + index * 0.8) * BASE_AMPLITUDE * influence3 * 0.3;

                // Add erratic movement/turbulence
                y += (Math.random() - 0.5) * 5 * turbulence; // Random noise scaled by difference
                 y += Math.sin(time * 5 + x * 0.1) * 2 * turbulence; // Faster sine noise scaled by difference

                // Clamp y within bounds (e.g., 10 to 190)
                y = Math.max(10, Math.min(190, y));

                d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
            }
            path.setAttribute('d', d);
        });

         // Update proximity indicator
        const averageDifference = totalDifference / NUM_WAVES;
        const proximityValue = 1 - Math.min(1, averageDifference / 0.5); // Normalize proximity (0 = bad, 1 = perfect)

        // Update indicator style (e.g., color/brightness)
        const hue = proximityValue * 120; // Green (120) when close, Red (0) when far
        const brightness = 50 + proximityValue * 50; // Dim when far, bright when close
        proximityIndicator.style.background = `hsl(${hue}, 80%, ${brightness}%)`;
        proximityIndicator.style.boxShadow = `0 0 ${5 + proximityValue * 10}px hsl(${hue}, 80%, ${brightness}%)`;


        // Update slider value displays
        valueOutput1.textContent = slider1.value;
        valueOutput2.textContent = slider2.value;
        valueOutput3.textContent = slider3.value;


        animationFrameId = requestAnimationFrame(updateWaves);
    }

    function handleSliderInput() {
        // No need to call updateWaves here, the animation loop handles it
    }

    function handleKeyDown(event) {
        let hiddenSliderChanged = false;
        switch (event.key.toUpperCase()) {
            case 'W':
                hiddenSliderW = Math.min(HIDDEN_SLIDER_MAX, hiddenSliderW + HIDDEN_SLIDER_STEP);
                hiddenSliderChanged = true;
                break;
            case 'S':
                hiddenSliderW = Math.max(HIDDEN_SLIDER_MIN, hiddenSliderW - HIDDEN_SLIDER_STEP);
                 hiddenSliderChanged = true;
                break;
            case 'A':
                hiddenSliderA = Math.max(HIDDEN_SLIDER_MIN, hiddenSliderA - HIDDEN_SLIDER_STEP);
                 hiddenSliderChanged = true;
                break;
            case 'D':
                hiddenSliderA = Math.min(HIDDEN_SLIDER_MAX, hiddenSliderA + HIDDEN_SLIDER_STEP);
                 hiddenSliderChanged = true;
                break;
        }

         if (hiddenSliderChanged) {
             // Prevent default browser scrolling/actions for these keys when focused on the interaction
             event.preventDefault();
             // Optional: Add subtle feedback that a hidden slider moved
            const interactionArea = document.querySelector('.resonance-interaction');
            if (interactionArea) {
                interactionArea.classList.add('key-active');
                setTimeout(() => interactionArea.classList.remove('key-active'), 150);
            }
         }
    }

    function stopAnimation() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function startAnimation() {
        if (!animationFrameId) {
            createWaves(); // Recreate waves if needed
            updateWaves();
        }
    }

    // Event Listeners
    slider1.addEventListener('input', handleSliderInput);
    slider2.addEventListener('input', handleSliderInput);
    slider3.addEventListener('input', handleSliderInput);
    document.addEventListener('keydown', handleKeyDown);

    // Start animation when the element might be visible
    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAnimation();
            } else {
                stopAnimation();
            }
        });
    }, { threshold: 0.1 }); // Start when 10% visible

    const interactionElement = document.querySelector('.resonance-interaction');
    if (interactionElement) {
        observer.observe(interactionElement);
    } else {
        // Fallback if observer target not found (e.g., start immediately)
        startAnimation();
    }


    // Initial wave creation and draw
    createWaves();
    // updateWaves(); // Initial draw now handled by IntersectionObserver/startAnimation

});