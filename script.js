const PARTICLE_NUM = 500;
const PARTICLE_BASE_RADIUS = 0.5;
const FL = 500;
const DEFAULT_SPEED = 2.0;
const BOOST_SPEED = 300;

let canvas, context, centerX, centerY, mouseX, mouseY, speed = DEFAULT_SPEED, targetSpeed = DEFAULT_SPEED;
let particles = [];

window.addEventListener('load', function () {
  canvas = document.getElementById('c');
  context = canvas.getContext('2d');

  const resize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    centerX = canvas.width * 0.5;
    centerY = canvas.height * 0.5;
    context.fillStyle = 'rgb(255, 255, 255)';
  };

  document.addEventListener('resize', resize);
  resize();

  mouseX = centerX;
  mouseY = centerY;

  for (let i = 0; i < PARTICLE_NUM; i++) {
    particles[i] = randomizeParticle(new Particle());
  }

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, false);

  document.addEventListener('mousedown', function () {
    targetSpeed = BOOST_SPEED;
  }, false);

  document.addEventListener('mouseup', function () {
    targetSpeed = DEFAULT_SPEED;
  }, false);

  setInterval(loop, 1000 / 60);
});

function loop() {
  context.save();
  context.fillStyle = 'rgb(0, 0, 0)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();

  speed += (targetSpeed - speed) * 0.01;

  let cx, cy, x, y, z, px, py, pz, pf;
  let a1, a2;

  const halfPI = Math.PI * 0.5;
  const atan2 = Math.atan2;
  const cos = Math.cos;
  const sin = Math.sin;

  context.beginPath();
  for (let i = 0; i < PARTICLE_NUM; i++) {
    let p = particles[i];
    p.z -= speed;

    if (p.z <= 0) {
      randomizeParticle(p);
      continue;
    }

    cx = p.x - centerX;
    cy = p.y - centerY;

    x = cx / p.z * FL;
    y = cy / p.z * FL;
    z = p.z;
    px = cx / p.pastZ * FL;
    py = cy / p.pastZ * FL;
    pz = p.pastZ;

    p.pastZ = p.z;

    pf = PARTICLE_BASE_RADIUS / p.z * FL;

    a1 = atan2(py - y, px - x);
    a2 = halfPI;

    context.moveTo(px + pf * cos(a1), py + pf * sin(a1));
    context.lineTo(x + pf * cos(a1), y + pf * sin(a1));
    context.arc(x, y, pf, a1, a2, true);
  }
  context.closePath();
  context.fill();
}

function randomizeParticle(p) {
  p.x = Math.random() * canvas.width;
  p.y = Math.random() * canvas.height;
  p.z = Math.random() * 1500 + 500;
  p.pastZ = p.z;
  return p;
}

function Particle(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
  this.pastZ = z;
}