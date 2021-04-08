const buttons = document.querySelector(".buttons");
const bg = document.querySelector(".bg");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
let phone = false;
let h = innerHeight;
let w = (innerHeight * 4) / 5;
if (innerHeight > innerWidth) {
    w = innerWidth;
    h = (innerWidth * 5) / 4;
    buttons.style.display = "flex";
    phone = true;
} else {
    bg.style.display = "none";
}
canvas.height = h;
canvas.width = w;

const paddleWidth = 100;
const paddleMargin = 50;
const paddleHeight = 20;
const ballRadious = 8;
const speed = 5;

let life = 3;
let score = 0;
const scoreUnit = 10;
let level = 1;
const maxLevel = 3;

let gameStart = false;
let GameOver = false;
let gamePause = false;
let leftArrow = false;
let rightArrow = false;

class Paddle {
    constructor() {
        this.x = canvas.width / 2 - paddleWidth / 2;
        this.y = canvas.height - paddleHeight - paddleMargin;
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.dx = speed;
    }
    drawPaddle() {
        ctx.drawImage(
            PADDLE_IMG,
            0,
            0,
            PADDLE_IMG.width,
            PADDLE_IMG.height,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
    movePaddle() {
        if (rightArrow) {
            this.x += this.dx;
        } else if (leftArrow) {
            this.x -= this.dx;
        }
        if (this.x > canvas.width) {
            this.x = 0 - this.width;
        } else if (this.x < 0 - this.width) {
            this.x = canvas.width;
        }
    }
}

class Ball {
    constructor() {
        this.radious = ballRadious;
        this.x = canvas.width / 2;
        this.y = paddle.y - this.radious;
        this.speed = 4;
        this.dx = 3 * (Math.random() * 2 - 1);
        this.dy = -3;
    }
    drawBall() {
        ctx.drawImage(
            BALL_IMG,
            0,
            0,
            BALL_IMG.width,
            BALL_IMG.height,
            this.x - this.radious,
            this.y - this.radious,
            this.radious * 2,
            this.radious * 2
        );
    }
    moveBall() {
        this.x += this.dx;
        this.y += this.dy;
    }
    ballPosition() {
        this.x = paddle.x + paddle.width / 2;
    }
    ballWallCollision() {
        if (this.x + this.radious > canvas.width || this.x - this.radious < 0) {
            this.dx = -this.dx;
            if (gameStart) WALL_HIT.play();
        }

        if (this.y - this.radious < 0) {
            this.dy = -this.dy;
            WALL_HIT.play();
        }

        if (this.y + this.radious > paddle.y + paddle.height) {
            life--;
            LIFE_LOST.play();
            this.resetBall();
        }
    }
    resetBall() {
        this.x = paddle.x + paddle.width / 2;
        this.y = paddle.y - this.radious;
        this.dx = 3 * (Math.random() * 2 - 1);
        this.dy = -3;
    }
    ballPaddleCollision() {
        if (
            this.x < paddle.x + paddle.width &&
            this.x > paddle.x &&
            paddle.y < paddle.y + paddle.height &&
            this.y > paddle.y - this.radious
        ) {
            PADDLE_HIT.play();
            let collidePoint = this.x - (paddle.x + paddle.width / 2);
            collidePoint = collidePoint / (paddle.width / 2);
            let angle = (collidePoint * Math.PI) / 3;
            this.dx = this.speed * Math.sin(angle);
            this.dy = -this.speed * Math.cos(angle);
        }
    }
}

class Brick {
    constructor() {
        this.row = 3;
        this.column = 6;
        this.width = canvas.width / 9.6;
        this.height = 20;
        this.offSet = 20;
        this.marginLeft =
            (canvas.width -
                this.width * this.column -
                (this.column - 1) * this.offSet) /
            2;
        this.bricks = [];
    }
    createBricks() {
        for (let r = 0; r < this.row; r++) {
            this.bricks[r] = [];
            for (let c = 0; c < this.column; c++) {
                this.bricks[r][c] = {
                    x: c * this.width + this.marginLeft + c * this.offSet,
                    y: r * this.height + 2 * this.offSet + r * this.offSet,
                    status: true,
                };
            }
        }
    }
    drawBricks() {
        for (let r = 0; r < this.row; r++) {
            for (let c = 0; c < this.column; c++) {
                let b = this.bricks[r][c];
                if (b.status) {
                    ctx.drawImage(
                        BRICK_IMG,
                        0,
                        0,
                        BRICK_IMG.width,
                        BRICK_IMG.height,
                        b.x,
                        b.y,
                        this.width,
                        this.height
                    );
                }
            }
        }
    }
    ballBrickCollision() {
        for (let r = 0; r < this.row; r++) {
            for (let c = 0; c < this.column; c++) {
                let b = this.bricks[r][c];
                if (b.status) {
                    if (
                        ball.x + ball.radious > b.x &&
                        ball.x - ball.radious < b.x + this.width &&
                        ball.y + ball.radious > b.y &&
                        ball.y - ball.radious < b.y + this.height
                    ) {
                        BRICK_HIT.play();
                        ball.dy = -ball.dy;
                        b.status = false;
                        score += scoreUnit;
                    }
                }
            }
        }
    }
}

function showGameStats(text, textX, textY, img, imgX, imgY) {
    ctx.fillStyle = "#000";
    ctx.font = "25px sans-serif";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, 25, 25);
}

function gameOver() {
    if (life <= 0) {
        gameover.style.display = "block";
        youlose.style.display = "block";
        GameOver = true;
    }
}

function levelUp() {
    let isLevelDone = true;
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            isLevelDone = isLevelDone && !brick.bricks[r][c].status;
        }
    }

    if (isLevelDone) {
        WIN.play();

        if (level >= maxLevel) {
            gameover.style.display = "block";
            youwon.style.display = "block";
            GameOver = true;
            return;
        }
        brick.row++;
        brick.createBricks();
        ball.speed += 0.5;
        ball.resetBall();
        level++;
    }
}

let paddle = new Paddle();
let ball = new Ball();
let brick = new Brick();
brick.createBricks();

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        BG_IMG,
        0,
        0,
        BG_IMG.width,
        BG_IMG.height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    paddle.drawPaddle();
    ball.drawBall();
    brick.drawBricks();
    showGameStats(score, 35, 25, SCORE_IMG, 5, 5);
    showGameStats(life, canvas.width - 25, 25, LIFE_IMG, canvas.width - 55, 5);
    showGameStats(
        level,
        canvas.width / 2,
        25,
        LEVEL_IMG,
        canvas.width / 2 - 30,
        5
    );

    if (!gamePause) paddle.movePaddle();
    if (!gameStart) ball.ballPosition();
    if (gameStart && !gamePause) ball.moveBall();
    ball.ballWallCollision();
    ball.ballPaddleCollision();
    brick.ballBrickCollision();
    gameOver();
    levelUp();
    if (!GameOver) requestAnimationFrame(animate);
}

animate();

const soundElement = document.getElementById("sound");

const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const inst = document.querySelector(".instructions");
const restart = document.getElementById("restart");

const left = document.querySelector(".left");
const right = document.querySelector(".right");
const start = document.querySelector(".start");

if (innerHeight < innerWidth) {
    inst.style.display = "flex";
    start.style.display = "none";
    start.style.pointerEvents = "none";
}

if (!phone) {
    window.addEventListener("load", () => {
        setTimeout(() => {
            inst.style.display = "none";
            inst.style.pointerEvents = "none";
        }, 2500);
    });
}
