const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const menu = document.getElementById('menu');
const pauseOverlay = document.getElementById('pauseOverlay');
const gameOver = document.getElementById('gameOver');

const startBtn = document.getElementById('startBtn');
const menuQuitBtn = document.getElementById('menuQuitBtn');

const resumeBtn = document.getElementById('resumeBtn');
const pauseQuitBtn = document.getElementById('pauseQuitBtn');

const retryBtn = document.getElementById('retryBtn');
const quitBtn = document.getElementById('quitBtn');

const mobilePauseBtn = document.getElementById('mobilePauseBtn');

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const paddleWidth = 12, paddleHeight = 80;
const ballSize = 12;

let leftPaddle, rightPaddle, ball;
let gameState = "menu"; // "menu", "playing", "paused", "gameover"

let playStartTimestamp = 0;
let accumulatedPlayMs = 0;
let currentSpeedFactor = 1;
const speedRatePerSecond = 0.015;
const maxSpeedFactor = 3.0;

function initObjects() {
  leftPaddle = {
    x: 15,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#0cf'
  };

  rightPaddle = {
    x: canvas.width - 15 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fc0'
  };

  ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    vx: (Math.random() > 0.5 ? 4 : -4) * currentSpeedFactor,
    vy: (Math.random() * 4 - 2) * currentSpeedFactor,
    size: ballSize,
    color: '#fff'
  };
}

function resetBall() {
  ball.x = canvas.width / 2 - ballSize / 2;
  ball.y = canvas.height / 2 - ballSize / 2;
  const baseVx = (Math.random() > 0.5 ? 4 : -4);
  const baseVy = (Math.random() * 4 - 2);
  ball.vx = baseVx * currentSpeedFactor;
  ball.vy = baseVy * currentSpeedFactor;
}

function drawRect(r) { ctx.fillStyle = r.color; ctx.fillRect(r.x, r.y, r.width, r.height); }
function drawBall(b) { ctx.fillStyle = b.color; ctx.fillRect(b.x, b.y, b.size, b.size); }
function clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

function applySpeedFactorToBall(newFactor) {
  if (!ball) return;
  const scale = newFactor / (currentSpeedFactor || 1);
  ball.vx *= scale;
  ball.vy *= scale;
  currentSpeedFactor = newFactor;
}

function computeTargetSpeedFactor() {
  const now = performance.now();
  const playedMs = accumulatedPlayMs + (gameState === 'playing' ? (now - playStartTimestamp) : 0);
  const playedSeconds = playedMs / 1000;
  const factor = 1 + playedSeconds * speedRatePerSecond;
  return Math.min(factor, maxSpeedFactor);
}

function update() {
  if (gameState === 'playing') {
    const target = computeTargetSpeedFactor();
    if (target > currentSpeedFactor + 1e-6) applySpeedFactorToBall(target);
  }

  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y <= 0) { ball.y = 0; ball.vy *= -1; }
  else if (ball.y + ball.size >= canvas.height) { ball.y = canvas.height - ball.size; ball.vy *= -1; }

  if (
    ball.x <= leftPaddle.x + leftPaddle.width &&
    ball.x + ball.size >= leftPaddle.x &&
    ball.y + ball.size >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.height
  ) {
    ball.x = leftPaddle.x + leftPaddle.width;
    ball.vx = Math.abs(ball.vx);
    ball.vx *= 1.02;
    ball.vy += (Math.random() - 0.5) * 2;
  }

  if (
    ball.x + ball.size >= rightPaddle.x &&
    ball.x <= rightPaddle.x + rightPaddle.width &&
    ball.y + ball.size >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.height
  ) {
    ball.x = rightPaddle.x - ball.size;
    ball.vx = -Math.abs(ball.vx);
    ball.vx *= 1.02;
    ball.vy += (Math.random() - 0.5) * 2;
  }

  if (ball.x < 0) { enterGameOver(); return; }
  if (ball.x > canvas.width) { resetBall(); }

  let targetY = ball.y + ball.size / 2 - rightPaddle.height / 2;
  rightPaddle.y += (targetY - rightPaddle.y) * 0.09;
  rightPaddle.y = clamp(rightPaddle.y, 0, canvas.height - rightPaddle.height);
}

function draw() {
  clear();
  drawRect(leftPaddle);
  drawRect(rightPaddle);
  drawBall(ball);
}

function gameLoop() {
  if (gameState !== "playing") return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', function (e) {
  if (gameState !== "playing") return;
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  leftPaddle.y = clamp(mouseY - leftPaddle.height / 2, 0, canvas.height - leftPaddle.height);
});
canvas.addEventListener('touchmove', function (e) {
  if (gameState !== "playing") return;
  if (!e.touches || e.touches.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const y = touch.clientY - rect.top;
  leftPaddle.y = clamp(y - leftPaddle.height / 2, 0, canvas.height - leftPaddle.height);
}, { passive: true });

/* State helpers */
function showElement(el) { if (el) el.style.display = 'block'; }
function hideElement(el) { if (el) el.style.display = 'none'; }

function updateMobilePauseButtonVisual() {
  if (!mobilePauseBtn) return;
  if (gameState === 'paused') {
    mobilePauseBtn.classList.add('paused');
    mobilePauseBtn.setAttribute('aria-label', 'Resume');
    mobilePauseBtn.title = 'Resume';
  } else {
    mobilePauseBtn.classList.remove('paused');
    mobilePauseBtn.setAttribute('aria-label', 'Pause');
    mobilePauseBtn.title = 'Pause';
  }
}

function enterMenu() {
  gameState = "menu";
  showElement(menu);
  hideElement(pauseOverlay);
  hideElement(gameOver);
  hideElement(canvas);
  hideElement(mobilePauseBtn);
  updateMobilePauseButtonVisual();
}

function startNewGame() {
  accumulatedPlayMs = 0;
  playStartTimestamp = performance.now();
  currentSpeedFactor = 1;

  gameState = "playing";
  hideElement(menu);
  hideElement(pauseOverlay);
  hideElement(gameOver);
  showElement(canvas);
  showElement(mobilePauseBtn);
  initObjects();
  draw();
  updateMobilePauseButtonVisual();
  requestAnimationFrame(gameLoop);
}

function pauseGame() {
  if (gameState !== "playing") return;
  const now = performance.now();
  accumulatedPlayMs += now - playStartTimestamp;
  gameState = "paused";
  showElement(pauseOverlay);
  showElement(mobilePauseBtn);
  updateMobilePauseButtonVisual();
  centerPauseOverlay();
}

function resumeGame() {
  if (gameState !== "paused") return;
  playStartTimestamp = performance.now();
  gameState = "playing";
  hideElement(pauseOverlay);
  showElement(mobilePauseBtn);
  updateMobilePauseButtonVisual();
  requestAnimationFrame(gameLoop);
}

function enterGameOver() {
  gameState = "gameover";
  hideElement(menu);
  hideElement(pauseOverlay);
  showElement(gameOver);
  hideElement(canvas);
  hideElement(mobilePauseBtn);
  updateMobilePauseButtonVisual();
}

function exitProgram() {
  try { window.close(); } catch (e) {}
  setTimeout(() => {
    try { window.location.href = 'about:blank'; } catch (e) {
      document.body.innerHTML = '<div style="color:#fff;background:#222;height:100vh;display:flex;align-items:center;justify-content:center;"><h2>Thank you for playing!</h2></div>';
    }
  }, 100);
}

startBtn.addEventListener('click', startNewGame);
menuQuitBtn.addEventListener('click', exitProgram);

resumeBtn.addEventListener('click', resumeGame);
pauseQuitBtn.addEventListener('click', () => { enterMenu(); });

retryBtn.addEventListener('click', startNewGame);
quitBtn.addEventListener('click', () => { enterMenu(); });

function togglePauseFromButton() {
  if (gameState === 'playing') pauseGame();
  else if (gameState === 'paused') resumeGame();
}
if (mobilePauseBtn) {
  mobilePauseBtn.addEventListener('click', function (e) { e.preventDefault(); togglePauseFromButton(); });
  mobilePauseBtn.addEventListener('touchstart', function (e) { e.preventDefault(); togglePauseFromButton(); }, { passive: false });
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    if (gameState === 'menu' || gameState === 'gameover') return;
    e.preventDefault();
    if (gameState === 'playing') pauseGame();
    else if (gameState === 'paused') resumeGame();
  }
});

function centerPauseOverlay() {
  if (!pauseOverlay) return;
  void pauseOverlay.offsetWidth;
}

enterMenu();
