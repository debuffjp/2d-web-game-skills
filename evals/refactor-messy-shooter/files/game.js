var c = document.getElementById('c');
var ctx = c.getContext('2d');
var keys = {};
var ship = { x: 400, y: 500, vx: 0 };
var bullets = [];
var enemies = [];
var score = 0;
var best = localStorage.getItem('best') || 0;
var playing = true;
var dead = false;
var last = Date.now();

document.addEventListener('keydown', function (e) {
  keys[e.key] = true;
  if (e.key == ' ' && playing && !dead) {
    bullets.push({ x: ship.x, y: ship.y - 20 });
    var s = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
    s.play();
  }
  if (e.key == 'r' && dead) {
    enemies = []; bullets = []; score = 0; dead = false; playing = true;
  }
});
document.addEventListener('keyup', function (e) { keys[e.key] = false; });

setInterval(function () {
  if (playing && !dead) {
    enemies.push({ x: Math.random() * 760 + 20, y: -20, speed: 1 + Math.random() * 2 });
  }
}, 800);

function update() {
  var now = Date.now();
  var dt = (now - last) / 16;
  last = now;

  if (keys['ArrowLeft'] || keys['a']) ship.vx = -6;
  else if (keys['ArrowRight'] || keys['d']) ship.vx = 6;
  else ship.vx = ship.vx * 0.8;
  ship.x += ship.vx * dt;
  if (ship.x < 20) ship.x = 20;
  if (ship.x > 780) ship.x = 780;

  bullets = bullets.map(function (b) { return { x: b.x, y: b.y - 10 * dt }; })
                   .filter(function (b) { return b.y > -10; });
  enemies = enemies.map(function (e) { return { ...e, y: e.y + e.speed * dt }; });

  enemies = enemies.filter(function (e) {
    var hit = bullets.find(function (b) { return Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 20; });
    if (hit) { bullets = bullets.filter(function (b) { return b !== hit; }); score++; return false; }
    if (Math.abs(ship.x - e.x) < 25 && Math.abs(ship.y - e.y) < 25) { dead = true; }
    return e.y < 620;
  });

  if (dead && score > best) { best = score; localStorage.setItem('best', best); }
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 800, 600);
  ctx.fillStyle = '#0f0';
  ctx.fillRect(ship.x - 15, ship.y - 10, 30, 20);
  ctx.fillStyle = '#ff0';
  bullets.forEach(function (b) { ctx.fillRect(b.x - 2, b.y - 6, 4, 12); });
  ctx.fillStyle = '#f33';
  enemies.forEach(function (e) { ctx.fillRect(e.x - 15, e.y - 15, 30, 30); });
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.fillText('Score: ' + score + '  Best: ' + best, 10, 30);
  if (dead) ctx.fillText('Game over - press R', 300, 300);
}

function loop() {
  if (playing && !dead) update();
  draw();
  requestAnimationFrame(loop);
}
loop();
