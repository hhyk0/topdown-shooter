// script.js - Top-Down Shooter Game (9:16 Aspect Ratio) with Scoring System

/* Set canvas dimensions for 9:16 aspect ratio */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 360;  // 9 units wide
canvas.height = 640; // 16 units tall

// Game settings
const playerSpeed = 5;
const bulletSpeed = 7;
const enemySpeed = 2;

// Player settings
const player = {
    x: canvas.width / 2 - 15,  // Center player horizontally
    y: canvas.height - 50,     // Position player towards the bottom
    width: 30,
    height: 30,
    color: 'lime',
    dx: 0,  // Horizontal movement speed
    dy: 0   // Vertical movement speed
};

// Bullet settings
const bullets = [];
const bulletWidth = 5;
const bulletHeight = 10;

// Enemy settings
const enemies = [];
const enemyWidth = 30;
const enemyHeight = 30;

// Score settings
let score = 0;

// Handle player movement
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -playerSpeed;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = playerSpeed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -playerSpeed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = playerSpeed;
    } else if (e.key === ' ') {  // Spacebar to shoot
        shootBullet();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = 0;
    } 
    if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') {
        player.dy = 0;
    }
});

// Shoot a bullet
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - bulletWidth / 2,
        y: player.y,
        width: bulletWidth,
        height: bulletHeight,
        color: 'yellow',
        dy: -bulletSpeed
    });
}

// Create enemy
function createEnemy() {
    const x = Math.random() * (canvas.width - enemyWidth);
    enemies.push({
        x: x,
        y: 0,
        width: enemyWidth,
        height: enemyHeight,
        color: 'red',
        dy: enemySpeed
    });
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y += bullet.dy;
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove bullet if it goes off-screen
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.dy;
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Check collision with bullets
        bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                // Increase score when enemy is destroyed
                score += 10;

                // Remove enemy and bullet
                enemies.splice(index, 1);
                bullets.splice(bulletIndex, 1);
            }
        });

        // Remove enemy if it goes off-screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

// Draw the score
function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Update game state
function update() {
    // Move player
    player.x += player.dx;
    player.y += player.dy;

    // Prevent player from going out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before each redraw
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();  // Draw the score

    // Create new enemy at random interval
    if (Math.random() < 0.02) {
        createEnemy();
    }

    // Request next frame
    requestAnimationFrame(update);
}

// Start the game loop
update();

