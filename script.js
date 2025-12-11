document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const surfaceSelect = document.getElementById('surface-select');
    const surfaceDisplay = document.getElementById('surface-display');
    const requiredForceDisplay = document.getElementById('required-force-display');
    const forceDisplay = document.getElementById('force-display');
    const pullFeedback = document.getElementById('pull-feedback');
    const blockAndSpring = document.getElementById('block-and-spring');
    const woodBlock = document.getElementById('wood-block'); // Target for clicking

    // Physics Constants and Variables
    const MASS_BLOCK = 0.5; // kg
    const GRAVITY = 9.81; // m/s^2
    let requiredPullForce = 0; // The calculated static friction force

    // Dragging state variables
    let isDragging = false;
    const START_OFFSET = 10; // Initial left position (in percentage)
    const MAX_PULL_PIXELS = 300; // Max distance the block can be dragged (limits drag to prevent running off screen)
    const FORCE_TO_PIXEL_RATIO = 50; // 50 pixels of stretch/pull = 1 Newton of force

    // Friction Coefficients 
    const frictionCoefficients = {
        plastic: 0.1,    
        metal: 0.25,     
        sandpaper: 0.5,  
        carpet: 0.8      
    };

    /**
     * Calculates the required pulling force based on the selected surface.
     */
    function updateRequiredForce(surfaceKey) {
        const mu_k = frictionCoefficients[surfaceKey];
        // F_pull = mu_k * m * g
        requiredPullForce = mu_k * MASS_BLOCK * GRAVITY;

        // Update visuals and reset block position
        surfaceDisplay.className = '';
        surfaceDisplay.classList.add(surfaceKey);
        requiredForceDisplay.textContent = requiredPullForce.toFixed(2);
        
        // Reset block position and feedback
        blockAndSpring.style.transform = 'translateX(0px)';
        forceDisplay.textContent = '0.00';
        pullFeedback.textContent = 'Click and drag the block to pull.';
        pullFeedback.style.color = '#333';
    }

    /**
     * Handles the start of the dragging action (mousedown/touchstart).
     */
    function startDrag(e) {
        isDragging = true;
        // Prevent default text selection behavior
        e.preventDefault(); 
        
        // Add event listeners to the window for moving and releasing
        window.addEventListener('mousemove', dragMove);
        window.addEventListener('mouseup', dragEnd);
        
        // For mobile devices:
        window.addEventListener('touchmove', dragMove);
        window.addEventListener('touchend', dragEnd);
    }

    /**
     * Handles the movement while dragging (mousemove/touchmove).
     */
    function dragMove(e) {
        if (!isDragging) return;

        // Determine the horizontal mouse/touch position
        const clientX = e.clientX || e.touches[0].clientX;
        
        // Get the position of the simulation area to calculate drag distance
        const simAreaRect = document.getElementById('simulation-area').getBoundingClientRect();
        
        // Calculate the raw drag distance from the starting point
        // We subtract the sim area's left boundary and the initial 10% offset of the block
        let dragDistance = clientX - simAreaRect.left - (simAreaRect.width * START_OFFSET / 100);
        
        // Clamp the distance to prevent dragging off the screen
        dragDistance = Math.max(0, Math.min(dragDistance, MAX_PULL_PIXELS));
        
        // Calculate the applied force: Force = Distance / Ratio
        const appliedForce = dragDistance / FORCE_TO_PIXEL_RATIO;
        
        // Update the visual spring balance reading
        forceDisplay.textContent = appliedForce.toFixed(2);
        
        // Update the block's position
        blockAndSpring.style.transform = `translateX(${dragDistance}px)`;

        // Provide movement feedback
        if (appliedForce >= requiredPullForce) {
            pullFeedback.textContent = `SUCCESS! Block is moving at ${appliedForce.toFixed(2)} N.`;
            pullFeedback.style.color = '#5cb85c'; // Green
        } else if (appliedForce > 0) {
            pullFeedback.textContent = 'Force applied, but not enough to move the block.';
            pullFeedback.style.color = '#f0ad4e'; // Orange/Yellow
        } else {
            pullFeedback.textContent = 'Click and drag the block to pull.';
            pullFeedback.style.color = '#333';
        }
    }

    /**
     * Handles the end of the dragging action (mouseup/touchend).
     */
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        // Clean up listeners
        window.removeEventListener('mousemove', dragMove);
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchmove', dragMove);
        window.removeEventListener('touchend', dragEnd);
        
        // Snap the block back to the starting position (simulating release)
        blockAndSpring.style.transform = 'translateX(0px)';
        forceDisplay.textContent = '0.00';
        updateRequiredForce(surfaceSelect.value); // Reset feedback message and force
    }

    // --- EVENT LISTENERS ---

    // 1. Surface selection listener
    surfaceSelect.addEventListener('change', (event) => {
        updateRequiredForce(event.target.value);
    });

    // 2. Drag listener on the wood block (mousedown/touchstart initiates dragging)
    woodBlock.addEventListener('mousedown', startDrag);
    woodBlock.addEventListener('touchstart', startDrag);


    // Initialize the simulation with the default surface
    updateRequiredForce(surfaceSelect.value);
});
