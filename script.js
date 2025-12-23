document.addEventListener('DOMContentLoaded', () => {
    const materialSelect = document.getElementById('material-select');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const resetButton = document.getElementById('reset-button');
    const surfaceFloor = document.getElementById('surface-floor');
    const pullingAssembly = document.getElementById('pulling-assembly');
    const forceFill = document.getElementById('force-fill');
    const forceOutput = document.getElementById('force-output');

    // Constants
    const MASS_KG = 0.8; // Mass of the box
    const GRAVITY = 9.81;
    
    // Friction Coefficients (mu)
    const frictionValues = {
        plastic: 0.15,
        metal: 0.30,
        carpet: 0.55,
        sandpaper: 0.85
    };

    let animationTimeout;

    function updateSetup() {
        const material = materialSelect.value;
        surfaceFloor.className = 'mat-' + material;
        
        // Calculate Force: F = mu * m * g
        const force = frictionValues[material] * MASS_KG * GRAVITY;
        forceOutput.textContent = force.toFixed(2);
        
        resetSimulation();
    }

    function startPull() {
        const material = materialSelect.value;
        const mu = frictionValues[material];
        
        startButton.disabled = true;
        stopButton.disabled = false;
        materialSelect.disabled = true;

        // 1. Visual "Tension": Gauge fills up first
        forceFill.style.width = (mu * 100) + '%';

        // 2. Start sliding after a split second
        animationTimeout = setTimeout(() => {
            // Speed of slide is slower if friction is higher
            const duration = 2 + (mu * 3); 
            pullingAssembly.style.transition = `left ${duration}s linear`;
            pullingAssembly.style.left = '400px';
        }, 400);
    }

    function stopSimulation() {
        clearTimeout(animationTimeout);
        const currentLeft = window.getComputedStyle(pullingAssembly).left;
        pullingAssembly.style.transition = 'none';
        pullingAssembly.style.left = currentLeft;

        startButton.disabled = false;
        stopButton.disabled = true;
        materialSelect.disabled = false;
    }

    function resetSimulation() {
        clearTimeout(animationTimeout);
        pullingAssembly.style.transition = 'none';
        pullingAssembly.style.left = '20px';
        forceFill.style.width = '0%';
        
        startButton.disabled = false;
        stopButton.disabled = true;
        materialSelect.disabled = false;
        
        // Re-calc force for display
        const force = frictionValues[materialSelect.value] * MASS_KG * GRAVITY;
        forceOutput.textContent = force.toFixed(2);
    }

    // Listeners
    materialSelect.addEventListener('change', updateSetup);
    startButton.addEventListener('click', startPull);
    stopButton.addEventListener('click', stopSimulation);
    resetButton.addEventListener('click', resetSimulation);

    // Init
    updateSetup();
});
