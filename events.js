window.addEventListener("keydown", (e) => {
    console.log(e.code);
    if (e.code == "ArrowLeft") {
        leftArrow = true;
    } else if (e.code == "ArrowRight") {
        rightArrow = true;
    }
    if (e.code == "Space" && !gameStart) {
        gameStart = true;
        gamePause = false;
    }
    if (e.code == "KeyP") {
        if (!gamePause) gamePause = true;
    }
    if (e.code == "KeyS") {
        if (gamePause) gamePause = false;
    }
});
window.addEventListener("keyup", (e) => {
    if (e.code == "ArrowLeft") {
        leftArrow = false;
    } else if (e.code == "ArrowRight") {
        rightArrow = false;
    }
});

soundElement.addEventListener("click", () => {
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG =
        imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    soundElement.setAttribute("src", SOUND_IMG);
    WALL_HIT.muted = WALL_HIT.muted ? false : true;
    PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
    BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
    WIN.muted = WIN.muted ? false : true;
    LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
});

left.addEventListener("mousedown", () => {
    leftArrow = true;
});
left.addEventListener("mouseup", () => {
    leftArrow = false;
});
left.addEventListener("touchstart", () => {
    leftArrow = true;
});
left.addEventListener("touchend", () => {
    leftArrow = false;
});
right.addEventListener("mousedown", () => {
    rightArrow = true;
});
right.addEventListener("mouseup", () => {
    rightArrow = false;
});
right.addEventListener("touchstart", () => {
    rightArrow = true;
});
right.addEventListener("touchend", () => {
    rightArrow = false;
});

restart.addEventListener("click", () => {
    location.reload();
});
restart.addEventListener("touchend", () => {
    location.reload();
});

start.addEventListener("click", () => {
    gameStart = true;
    gamePause = false;
    start.style.display = "none";
    bg.style.display = "none";
});
