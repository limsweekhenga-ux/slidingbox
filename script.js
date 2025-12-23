document.addEventListener('DOMContentLoaded', () => {
    const materialSelect = document.getElementById('material-select');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const floor = document.getElementById('floor');
    const assembly = document.getElementById('pulling-assembly');
    const forceLine = document.getElementById('force-line');
    const forceVal = document.getElementById('force-val');

    // Friction data
    const friction = {
        plastic: 0.2,
        metal: 0.35,
        carpet: 0.6,
        sandpaper: 0.9
    };

    let animationTimer;

    function update() {
        const mat = materialSelect.value;
        floor.className = mat;
        
        // F = mu * mass * gravity (assuming 1kg)
        const force = friction[mat] * 9.81;
        forceVal.textContent = force.toFixed(2);
        
        resetSim();
    }

    function startSim() {
        const mat = materialSelect.value;
        const mu = friction[mat];
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
        materialSelect.disabled = true;

        // Visual tension in scale
        forceLine.style.width = (mu * 100) + "%";

        setTimeout(() => {
            // Speed depends on friction (rougher = slower)
            const duration = 2 + (mu * 3);
            assembly.style.transition = `left ${duration}s linear`;
            assembly.style.left = "350px";
        }, 500);

        animationTimer = setTimeout(() => {
            stopBtn.disabled = true;
            startBtn.disabled = false;
            materialSelect.disabled = false;
        }, 5000);
    }

    function stopSim() {
        clearTimeout(animationTimer);
        const currentLeft = window.getComputedStyle(assembly).left;
        assembly.style.transition = "none";
        assembly.style.left = currentLeft;
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    function resetSim() {
        clearTimeout(animationTimer);
        assembly.style.transition = "none";
        assembly.style.left = "10px";
        forceLine.style.width = "0%";
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        materialSelect.disabled = false;
    }

    materialSelect.addEventListener('change', update);
    startBtn.addEventListener('click', startSim);
    stopBtn.addEventListener('click', stopSim);
    resetBtn.addEventListener('click', resetSim);

    // Initial call
    update();
});
