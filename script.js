const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const angleSlider = document.getElementById('angleSlider');
const pitchSlider = document.getElementById('pitchSlider');
const angleDisplay = document.getElementById('angleDisplay');
const pitchDisplay = document.getElementById('pitchDisplay');
const loadFactorDisplay = document.getElementById('loadFactorDisplay');

const straightLevelLift = 200; // Reference line for level flight lift

function drawAircraft(x, y, bankAngle, pitchAngle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-bankAngle); // Rotate for bank simulation

    // Draw fuselage in Lavender
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(-10, -40);
    ctx.quadraticCurveTo(0, -60, 10, -40);
    ctx.lineTo(10, 0);
    ctx.lineTo(-10, 0);
    ctx.closePath();
    ctx.fillStyle = 'Black'; // Lavender
    ctx.fill();
    ctx.stroke();

    // Draw wings in Lavender
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.moveTo(0, 0);
    ctx.lineTo(150, 0); // Right wing
    ctx.lineTo(165, -30); // Right winglet pointing upward
    ctx.moveTo(0, 0);
    ctx.lineTo(-150, 0); // Left wing
    ctx.lineTo(-165, -30); // Left winglet pointing upward
    ctx.moveTo(0, -60);
    ctx.lineTo(0, -90);
    ctx.lineTo(25, -90);
    ctx.lineTo(-25, -90);
    ctx.lineTo(0, -90);
    ctx.strokeStyle = 'Black'; // Lavender
    ctx.stroke();

    ctx.restore();
}

function drawVector(startX, startY, length, angle, label, color, offsetY = 0) {
    ctx.save();
    ctx.translate(startX, startY);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.moveTo(length - 20, -20);
    ctx.lineTo(length, 0);
    ctx.lineTo(length - 20, 20);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = '18px Arial';
    ctx.fillStyle = color; // Label color matches the vector
    ctx.textAlign = 'center';
    ctx.fillText(label, length / 2, offsetY - 5);

    ctx.restore();
}

function drawLegend() {
    const legendX = 30;
    const startY = 50;

    ctx.font = '15px Arial';
    ctx.fillStyle = 'White'; // Dark text for contrast
    ctx.textAlign = 'left';

    ctx.fillText('Legend:', legendX, startY);
    ctx.fillText('HC - Horizontal Component', legendX, startY + 40);
    ctx.fillText('TL - Total Lift', legendX, startY + 80);
    ctx.fillText('LF - Load Factor', legendX, startY + 120);
    ctx.fillText('VC - Vertical Component', legendX, startY + 160);
    ctx.fillText('CF - Centrifugal Force', legendX, startY + 200);
    ctx.fillText('WG - Weight', legendX, startY + 240);

    // Drawing legend squares with distinct colors
    ctx.fillStyle = '#7BC8F6'; // Sky Blue
    ctx.fillRect(legendX - 20, startY + 25, 20, 20);
    ctx.fillStyle = '#F7B2AD'; // Soft Pink
    ctx.fillRect(legendX - 20, startY + 65, 20, 20);
    ctx.fillStyle = '#98DFAF'; // Mint Green
    ctx.fillRect(legendX - 20, startY + 105, 20, 20);
    ctx.fillStyle = '#FFAD69'; // Sunset Orange
    ctx.fillRect(legendX - 20, startY + 145, 20, 20);
    ctx.fillStyle = '#C3B1E1'; // Lavender
    ctx.fillRect(legendX - 20, startY + 185, 20, 20);
    ctx.fillStyle = '#D1495B'; // Deep Red
    ctx.fillRect(legendX - 20, startY + 225, 20, 20);
}

function calculateForces(bankAngle, pitchAngle) {
    const baseLift = straightLevelLift; // Use straight level lift as base
    const pitchFactor = Math.sin(pitchAngle) * 2;

    const verticalComponent = Math.cos(bankAngle) * (baseLift + (baseLift * pitchFactor));
    const totalLift = verticalComponent / Math.cos(bankAngle);
    const loadFactor = totalLift / baseLift;

    const horizontalComponent = totalLift * Math.sin(bankAngle);
    const centrifugalForce = horizontalComponent;

    const weight = baseLift; // Weight as a downward force

    return { totalLift, loadFactor, verticalComponent, horizontalComponent, centrifugalForce, weight };
}

function updateSimulation() {
    let bankAngleDegrees = parseInt(angleSlider.value);
    let pitchAngleDegrees = parseInt(pitchSlider.value);
    let bankAngleRadians = bankAngleDegrees * (Math.PI / 180);
    let pitchAngleRadians = pitchAngleDegrees * (Math.PI / 180);
    angleDisplay.innerText = bankAngleDegrees;
    pitchDisplay.innerText = pitchAngleDegrees;
    let forces = calculateForces(bankAngleRadians, pitchAngleRadians);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all vectors first with distinct colors
    drawVector(canvas.width / 2, canvas.height / 2, straightLevelLift, -Math.PI / 2, 'Level Flight', '#7BC8F6', 30); // Sky Blue
    drawVector(canvas.width / 2, canvas.height / 2, forces.totalLift, -Math.PI / 2 - bankAngleRadians, '', '#F7B2AD', -20); // Soft Pink
    drawVector(canvas.width / 2, canvas.height / 2, forces.loadFactor * straightLevelLift, Math.PI / 2 - bankAngleRadians, '', '#98DFAF', -30); // Mint Green
    drawVector(canvas.width / 2, canvas.height / 2, forces.verticalComponent, -Math.PI / 2, '', '#FFAD69', 30); // Sunset Orange
    drawVector(canvas.width / 2, canvas.height / 2, forces.horizontalComponent, Math.PI, '', '#7BC8F6', 20); // Sky Blue (reuse)
    drawVector(canvas.width / 2, canvas.height / 2, forces.centrifugalForce, 0, '', '#C3B1E1', 20); // Lavender
    drawVector(canvas.width / 2, canvas.height / 2, forces.weight, Math.PI / 2, '', '#D1495B', -40); // Deep Red for weight
    drawLegend(); // Draw the legend

    // Draw the aircraft last to ensure it is on top
    drawAircraft(canvas.width / 2, canvas.height / 2, bankAngleRadians, pitchAngleRadians);

    loadFactorDisplay.innerText = 'Load Factor: ' + forces.loadFactor.toFixed(2);
}

angleSlider.addEventListener('input', updateSimulation);
pitchSlider.addEventListener('input', updateSimulation);

updateSimulation(); // Initial draw
