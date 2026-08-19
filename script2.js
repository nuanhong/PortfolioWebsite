// 1. ควบคุมแสงตามเมาส์
const glow = document.getElementById('glow');
window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// 2. สร้างกล่องสี่เหลี่ยมกระจายทั่วจอแบบค่อยเป็นค่อยไป
const particleContainer = document.getElementById('particleContainer');
const particleCount = 45;

for (let i = 0; i < particleCount; i++) {
    const box = document.createElement('div');
    box.classList.add('sparkle-box');

    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const size = Math.random() * 3 + 2; // ขนาด 2px - 5px
    
    // ปรับระยะเวลาแอนิเมชันให้ช้าลง (5s - 10s)
    const duration = Math.random() * 5 + 5;
    // ใช้ลบติดลบในดีเลย์เล็กน้อย เพื่อให้แอนิเมชันเริ่มสุ่มจังหวะกันทันทีตั้งแต่โหลดเสร็จแบบไม่กระตุก
    const delay = -(Math.random() * duration);

    box.style.left = `${posX}vw`;
    box.style.top = `${posY}vh`;
    box.style.width = `${size}px`;
    box.style.height = `${size}px`;
    box.style.setProperty('--duration', `${duration}s`);
    box.style.setProperty('--delay', `${delay}s`);

    const colors = ['rgba(255,255,255,0.9)', 'rgba(56,189,248,0.8)', 'rgba(192,132,252,0.8)'];
    box.style.background = colors[Math.floor(Math.random() * colors.length)];

    particleContainer.appendChild(box);
}