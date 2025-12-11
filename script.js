document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const surfaceSelect = document.getElementById('surface-select');
    const surfaceDisplay = document.getElementById('surface-display');
    const requiredForceDisplay = document.getElementById('required-force-display');
    const forceDisplay = document.getElementById('force-display'); // Slider reading on the spring balance
    const pullSlider = document.getElementById('pull-slider'); // The new slider
    const blockAndSpring = document.getElementById('block-and-spring');
    const pullFeedback = document.getElementById('pull-feedback');

    // Physics Constants and Variables
    const MASS_BLOCK = 0.5; // kg
    const GRAVITY = 9.81; // m/s^2 (approximates Normal Force N = mg)
    let requiredPullForce = 0; // Variable to store the calculated force

    // Friction Coefficients (Example/Approximate values for kinetic friction mu_k)
    // F_pull = mu_k * m * g
    const frictionCoefficients = {
        plastic: 0.1,    
        metal: 0.25,     
        sandpaper: 0.5,  
        carpet: 0.8      
    };

    /**
     * Calculates the required pulling force and updates the required force display.
     * @param {string} surfaceKey - The key corresponding to the selected surface.
     */
    function updateRequiredForce(surfaceKey) {
        const mu_k = frictionCoefficients[surfaceKey];

        // Calculate the required pulling force (F_pull) to overcome friction
        requiredPullForce = mu_k * MASS_BLOCK * GRAVITY;

        // Update the visual surface
        surfaceDisplay.className = '';
        surfaceDisplay.classList.add(surfaceKey);
        
        // Update the REQUIRED force output (the answer the student is seeking)
        requiredForceDisplay.textContent = requiredPullForce.toFixed(2);
        
        // Reset the slider and block position when surface changes
        pullSlider.value = 0;
        updateSimulationVisuals(0); 
        pullFeedback.textContent = 'Slide the spring balance to pull the block.';
        pullFeedback.style.color = '#333';
    }

    /**
     * Updates the visuals (block position and force reading) based on the slider.
     * @param {number} pullForce - The force currently applied by the user (slider value).
     */
    function updateSimulationVisuals(pullForce) {
        // 1. Update the instantaneous force reading on the spring balance
        forceDisplay.textContent = pullForce.toFixed(2);

        // 2. Check if the applied force overcomes the required friction force
        if (pullForce >= requiredPullForce) {
            // Block is moving! 
            const movement = 10 + (pullForce - requiredPullForce) * 20; 
            blockAndSpring.style.transform = `translateX(${movement}px)`;
            
            pullFeedback.textContent = `SUCCESS! Block is moving at ${pullForce.toFixed(2)} N.`;
            pullFeedback.style.color = '#5cb85c'; // Green
        } else if (pullForce > 0) {
            // Force is applied but NOT enough to move (static friction visualized)
            const displacement = pullForce * 5; // Small displacement to show tension
            blockAndSpring.style.transform = `translateX(${displacement}px)`;
            
            pullFeedback.textContent = 'Force applied, but not enough to move the block.';
            pullFeedback.style.color = '#f0ad4e'; // Orange/Yellow
        } else {
            // No force applied
            blockAndSpring.style.transform = 'translateX(0px)';
            pullFeedback.textContent = 'Slide the spring balance to pull the block.';
            pullFeedback.style.color = '#333';
        }
    }

    // --- EVENT LISTENERS ---

    // 1. Surface selection listener
    surfaceSelect.addEventListener('change', (event) => {
        updateRequiredForce(event.target.value);
    });

    // 2. Slider input listener
    pullSlider.addEventListener('input', (event) => {
        const currentPullForce = parseFloat(event.target.value);
        updateSimulationVisuals(currentPullForce);
    });

    // Initialize the simulation with the default surface
    updateRequiredForce(surfaceSelect.value);
});
