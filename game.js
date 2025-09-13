const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 12, paddleHeight = 80;
const ballSize = 12;

let leftPaddle = {
    x: 15,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#0cf'
};

let rightPaddle = {
    x: canvas.width - 15 - paddleWidth,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fc0'
};

let ball = {
    x: canvas.width/2 - ballSize/2,
    y: canvas.height/2 - ballSize/2,
    vx: (Math.random() > 0.5 ? 4 : -4),
    vy: (Math.random()*4 - 2),
    size: ballSize,
    color: '#fff'
};

function resetBall() {
    ball.x = canvas.width/2 - ballSize/2;
    ball.y = canvas.height/2 - ballSize/2;
    ball.vx = (Math.random() > 0.5 ? 4 : -4);
    ball.vy = (Math.random()*4 - 2);
}

function drawRect(r) {
    ctx.fillStyle = r.color;
    ctx.fillRect(r.x, r.y, r.width, r.height);
}

function drawBall(b) {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.size, b.size);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function update() {
    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Wall collision (top/bottom)
    if (ball.y <= 0) {
        ball.y = 0;
        ball.vy *= -1;
    } else if (ball.y + ball.size >= canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.vy *= -1;
    }

    // Paddle collision
    // Left paddle
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.x + ball.size >= leftPaddle.x &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.vx *= -1;
        // Add a bit of randomness
        ball.vy += (Math.random() - 0.5) * 2;
    }

    // Right paddle
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.x <= rightPaddle.x + rightPaddle.width &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.vx *= -1;
        ball.vy += (Math.random() - 0.5) * 2;
    }

    // Score detection (ball out of bounds)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    // Right paddle AI: simple follow
    let targetY = ball.y + ball.size/2 - rightPaddle.height/2;
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
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse controls for left paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddle.y = clamp(mouseY - leftPaddle.height/2, 0, canvas.height - leftPaddle.height);
});

gameLoop();
