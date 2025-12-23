const surfaceSelect = document.getElementById('surface-select');
const floor = document.getElementById('surface-floor');
const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');
const animationBox = document.getElementById('animation-container');
const springBalance = document.getElementById('spring-balance');
const forceLabel = document.getElementById('display-force');
const surfaceLabel = document.getElementById('display-surface');
const scaleLabel = document.getElementById('scale-label');

const frictionData = {
    wood: { force: 2.0, class: 'texture-wood' },
    metal: { force: 0.8, class: 'texture-metal' },
    carpet: { force: 4.5, class: 'texture-carpet' },
    sandpaper: { force: 7.2, class: 'texture-sandpaper' }
};

surfaceSelect.addEventListener('change', () => {
    resetSim();
    const selection = frictionData[surfaceSelect.value];
    floor.className = selection.class;
    surfaceLabel.innerText = surfaceSelect.value;
});

runBtn.addEventListener('click', () => {
    const selection = frictionData[surfaceSelect.value];
    const forceValue = selection.force;

    // 1. Stretch the spring container (pushes box because of flexbox)
    // Formula: Base width (80) + (Force * 15)
    const newWidth = 80 + (forceValue * 20);
    springBalance.style.width = newWidth + 'px';
    scaleLabel.innerText = forceValue + 'N';

    // 2. Animate movement after a brief "tension" delay
    setTimeout(() => {
        animationBox.style.transform = 'translateX(350px)';
        forceLabel.innerText = forceValue;
    }, 400);
});

resetBtn.addEventListener('click', resetSim);

function resetSim() {
    animationBox.style.transform = 'translateX(0px)';
    springBalance.style.width = '80px';
    forceLabel.innerText = '0';
    scaleLabel.innerText = '0N';
}

// Initial state
floor.className = 'texture-wood';
