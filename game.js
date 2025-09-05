const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 80;
const ballSize = 14;
const paddleMargin = 20;
const aiSpeed = 4;

// Paddle objects
const leftPaddle = {
    x: paddleMargin,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#0f0'
};

const rightPaddle = {
    x: canvas.width - paddleMargin - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#f00'
};

// Ball object
const ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    size: ballSize,
    speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
    speedY: (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1),
    color: '#fff'
};

// Draw rectangle helper
function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

// Draw ball helper
function drawBall(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.size, obj.size);
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2 - ball.size / 2;
    ball.y = canvas.height / 2 - ball.size / 2;
    ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = (Math.random() * 4 + 2) * (Math.random() > 0.5 ? 1 : -1);
}

// Mouse movement for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Constrain within canvas
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height)
        leftPaddle.y = canvas.height - leftPaddle.height;
});

// Simple AI for right paddle
function moveAIPaddle() {
    const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (paddleCenter < ball.y + ball.size / 2) {
        rightPaddle.y += aiSpeed;
    } else if (paddleCenter > ball.y + ball.size / 2) {
        rightPaddle.y -= aiSpeed;
    }
    // Boundaries
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height)
        rightPaddle.y = canvas.height - rightPaddle.height;
}

// Main game loop
function gameLoop() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles and ball
    drawRect(leftPaddle);
    drawRect(rightPaddle);
    drawBall(ball);

    // Move AI paddle
    moveAIPaddle();

    // Ball movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision - top/bottom
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.speedY *= -1;
        ball.y = Math.max(0, Math.min(ball.y, canvas.height - ball.size));
    }

    // Ball collision - left paddle
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.x >= leftPaddle.x &&
        ball.y + ball.size >= leftPaddle.y &&
        ball.y <= leftPaddle.y + leftPaddle.height
    ) {
        ball.speedX *= -1;
        // Add some variation based on where the ball hits the paddle
        let impact = (ball.y + ball.size / 2) - (leftPaddle.y + leftPaddle.height / 2);
        ball.speedY = impact * 0.25;
        ball.x = leftPaddle.x + leftPaddle.width; // Prevent sticking
    }

    // Ball collision - right paddle (AI)
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.x + ball.size <= rightPaddle.x + rightPaddle.width &&
        ball.y + ball.size >= rightPaddle.y &&
        ball.y <= rightPaddle.y + rightPaddle.height
    ) {
        ball.speedX *= -1;
        let impact = (ball.y + ball.size / 2) - (rightPaddle.y + rightPaddle.height / 2);
        ball.speedY = impact * 0.25;
        ball.x = rightPaddle.x - ball.size; // Prevent sticking
    }

    // Ball out of bounds (left or right)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();