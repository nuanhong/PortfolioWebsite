const cards = document.querySelectorAll('.phone-frame');
const leftCards = document.querySelectorAll('.side-detail-card');
const rightCards = document.querySelectorAll('.side-image-card');
const lines = document.querySelectorAll('.connection-line');
const track = document.getElementById('carouselTrack');
const showcaseArea = document.getElementById('showcaseArea');
const glow = document.getElementById('glow');

let radius = window.innerWidth > 1024 ? 260 : 180;
let currentAngle = 0;
let targetAngle = 0;
let velocity = 0;
let isDragging = false;
let startX = 0;
let lastX = 0;
let lastTime = 0;
let lastActiveIndex = -1;

// Mouse glow tracking
window.addEventListener('mousemove', (e) => {
    if (glow) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    }
});

// Adjust radius on screen resize
window.addEventListener('resize', () => {
    radius = window.innerWidth > 1024 ? 260 : 180;
});

// Calculate & draw dynamic SVG connecting lines
function updateConnectionLines(activeIndex) {
    if (window.innerWidth <= 1024) return;
    const areaRect = showcaseArea.getBoundingClientRect();
    const activePhone = cards[activeIndex];
    const activeRight = document.getElementById(`side-right-${activeIndex}`);
    const activeLine = document.getElementById(`line-${activeIndex}`);

    if (!activePhone || !activeRight || !activeLine) return;

    const phoneRect = activePhone.getBoundingClientRect();
    const rightRect = activeRight.getBoundingClientRect();

    const phoneX = (phoneRect.left + phoneRect.width / 2) - areaRect.left;
    const phoneY = (phoneRect.top + phoneRect.height / 2) - areaRect.top;
    const targetX = (rightRect.left + 10) - areaRect.left;
    const targetY = (rightRect.top + rightRect.height / 2) - areaRect.top;

    const dx = Math.abs(targetX - phoneX) * 0.45;
    activeLine.setAttribute('d', `M ${phoneX} ${phoneY} C ${phoneX + dx} ${phoneY}, ${targetX - dx} ${targetY}, ${targetX} ${targetY}`);
}

// Main Animation Loop
function animate() {
    if (!isDragging) {
        velocity *= 0.92;
        targetAngle += velocity;
    }

    currentAngle += (targetAngle - currentAngle) * 0.08;
    const totalCards = cards.length;
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
        const angle = (index / totalCards) * 360 + currentAngle;
        const radian = (angle * Math.PI) / 180;
        
        const x = Math.sin(radian) * radius;
        const z = Math.cos(radian) * radius - radius; 
        
        const distanceToFront = Math.abs(Math.cos(radian) - 1);
        if (distanceToFront < minDistance) {
            minDistance = distanceToFront;
            closestIndex = index;
        }

        const baseScale = (z + radius * 2) / (radius * 2);
        const scale = Math.max(0.65, baseScale);

        card.style.transform = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
        card.style.zIndex = Math.round(scale * 100);
        card.style.opacity = Math.max(0.2, scale);
    });

    cards.forEach((card, index) => {
        card.classList.toggle('active-card', index === closestIndex);
    });

    if (closestIndex !== lastActiveIndex) {
        leftCards.forEach((card, index) => card.classList.toggle('active-side', index === closestIndex));
        rightCards.forEach((card, index) => card.classList.toggle('active-side', index === closestIndex));
        lines.forEach((line, index) => line.classList.toggle('active', index === closestIndex));
        lastActiveIndex = closestIndex;
    }

    updateConnectionLines(closestIndex);
    requestAnimationFrame(animate);
}

// Start Animation
animate();

// Touch & Mouse Drag Controls
function startDrag(clientX) {
    isDragging = true;
    startX = clientX;
    lastX = clientX;
    lastTime = performance.now();
    velocity = 0;
}

function onDrag(clientX) {
    if (!isDragging) return;
    const now = performance.now();
    const deltaX = clientX - lastX;
    const deltaTime = now - lastTime;
    targetAngle += deltaX * 0.35;
    if (deltaTime > 0) velocity = (deltaX / deltaTime) * 2.5;
    lastX = clientX;
    lastTime = now;
}

function endDrag() { 
    isDragging = false; 
}

// Mouse Event Listeners
track.addEventListener('mousedown', (e) => startDrag(e.clientX));
window.addEventListener('mousemove', (e) => onDrag(e.clientX));
window.addEventListener('mouseup', endDrag);

// Touch Event Listeners (Mobile)
track.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX));
window.addEventListener('touchmove', (e) => onDrag(e.touches[0].clientX));
window.addEventListener('touchend', endDrag);