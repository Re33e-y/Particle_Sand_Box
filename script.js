const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

// UI elements
const ui = {
  count: document.getElementById("count"),
  size: document.getElementById("size"),
  speed: document.getElementById("speed"),
  linkDist: document.getElementById("linkDist"),
  color: document.getElementById("color"),
  connect: document.getElementById("connect"),
  wrap: document.getElementById("wrap"),
  mouseRepel: document.getElementById("mouseRepel"),
  resetBtn: document.getElementById("resetBtn"),
};

const defaults = {
  count: 160,
  size: 2.2,
  speed: 0.8,
  linkDist: 100,
  color: "#66d9ff",
  connect: true,
  wrap: true,
  mouseRepel: false,
};

// Particle system
let particles = [];
class Particle {
  constructor(x, y, r, vx, vy) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.vx = vx;
    this.vy = vy;
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Initialize particles
function initParticles() {
  particles = [];
  for (let i = 0; i < ui.count.value; i++) {
    const r = parseFloat(ui.size.value);
    const angle = Math.random() * Math.PI * 2;
    const sp = parseFloat(ui.speed.value);

    particles.push(
      new Particle(
        random(r, canvas.width - r),
        random(r, canvas.height - r),
        r,
        Math.cos(angle) * sp,
        Math.sin(angle) * sp
      )
    );
  }
}
initParticles();

// Mouse
const mouse = { x: -9999, y: -9999 };
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = ui.color.value;

  const ld = ui.linkDist.value;

  particles.forEach((p, i) => {
    // Mouse repulsion
    if (ui.mouseRepel.checked) {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 120) {
        p.vx += dx / 50;
        p.vy += dy / 50;
      }
    }

    p.move();

    // Wrap edges
    if (ui.wrap.checked) {
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    }

    // Draw particle
    p.draw();

    // Draw connecting lines
    if (ui.connect.checked) {
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);

        if (dist < ld) {
          ctx.strokeStyle = ui.color.value;
          ctx.globalAlpha = 1 - dist / ld;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
  });

  requestAnimationFrame(animate);
}
animate();

// Reset button
ui.resetBtn.onclick = () => {
  Object.keys(defaults).forEach((key) => {
    if (ui[key].type === "checkbox") {
      ui[key].checked = defaults[key];
    } else {
      ui[key].value = defaults[key];
    }
  });
  initParticles();
};

// Update when sliders change
Object.values(ui).forEach((input) => {
  input.oninput = initParticles;
});
