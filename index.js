// Global variables related to each element, character, and state in the game.
var gameContainer = document.querySelector("#game-container");
var gameContainerRect = gameContainer.getBoundingClientRect()
var grid = document.querySelector(".grid");
var gameStart = false;
var win = false;

// Check if life was lost.
var lifeLost = false;

// Boolean to add a condition in the CheckCollision function. If true, bottom += 4.
var lifeLostDirectionChange = false;
var lives = document.getElementById("lives");

// Pause menu
var pauseMenu = document.querySelector("#pause-menu");
var paused = false;
var timesup = false;
let img = new Image();


class Ball {
    constructor(left, bottom, direction, directionX, random) {
        this.direction = direction;
        this.left = left;
        this.bottom = bottom;
        this.directionX = directionX;
    }

    moveUp() {
        this.bottom += 3;
    }
    moveDown() {
        this.bottom -= 3;
    }
    moveLeft() {
        this.left -= 3;
    }
    moveRight() {
        this.left += 3;
    }
    moveRandom() {
        if (random == 0) random = -1.5;
        this.left += random;
    }
}

let random = Math.floor(Math.random() * (4 - (-4) + 1)) + (-4)
let ballClass = new Ball(0, 68, null, null, random)

// Create blocks.
var blocks = [];
function CreateGrid() {
    for (var i = 0; i < 40; i++) {
        var rectangle = document.createElement("img");
        rectangle.src = "static/meat.png"
        if (i >= 10 && i <= 19) {
            rectangle.src = "static/catfood.png"
        } else if (i >= 20 && i <= 29) {
            rectangle.src = "static/fish.png"
        } else if (i >= 30 && i <= 40) {
            rectangle.src = "static/prawn.png"
        }
        rectangle.style.objectFit = "scale-down"
        rectangle.style.border = "solid 1px yellow";
        rectangle.style.borderRadius = "8%";
        rectangle.style.height = "40px";
        rectangle.style.width = "100%";
        rectangle.id = `block-${i + 1}`
        rectangle.className = 'block'
        grid.append(rectangle);
        blocks.push(rectangle);
    }
    preloadImage("catup.png")
}
CreateGrid();

function DisplayLives() {
    for (var j = 0; j < 3; j++) {
        var life = document.createElement("img");
        life.src = "static/life.png";
        life.style.height = "20px";
        life.style.width = "20px";
        life.className = "life"
        lives.append(life)
    }
}
DisplayLives();

var player = document.createElement("div");
var ball = document.createElement("img");


var water = document.createElement("div");
var ballbox = document.createElement("div");
function CreatePlayer() {
    player.id = "player";

    player.style.height = "15px";
    player.style.width = "120px";
    player.style.transform = `translateX(${(gameContainerRect.width / 2) - 120 / 2}px)`;

    player.style.bottom = "50px";
    player.style.marginLeft = "1px";

    player.style.position = "absolute";
    document.querySelector("#game-container").appendChild(player);
}
CreatePlayer();

var position = (gameContainerRect.width / 2) - 120 / 2 - 1;
// Only start game once otherwise cat will go too fast.
var sCount = 0;
// Count pause
var pCount = 1;
function MovePlayer(event) {
    start(event);

    if (!gameStart) return;

    switch (event.key) {
        case "ArrowLeft":
            // Keep player paddle in bounds and move left if left arrow is clicked.
            if (position > 8) {
                position -= 12;
            }
            if (position == 8) {
                position -= 4
            }
            break;
        case "ArrowRight":
            // Keep player paddle in bounds and move right if right arrow is clicked.
            if (position < 425) {
                position += 12;
            }
            if (position == 428) {
                position += 8;
            }
            break;
    }

}

function drawPlayer() {
    player.style.transform = `translateX(${position}px)`;
}

// Create ball
function CreateBall() {
    // Styling
    ball.id = "sprite";
    ball.src = "cat.png"
    ball.alt = "Cat Sprite"
    ball.classList.add("chilling")

    ball.style.position = "absolute";

    ballbox.className = "ballbox"

    ballbox.appendChild(ball)
    gameContainer.appendChild(ballbox);

    // Position
    ballbox.style.left = `${(gameContainerRect.width / 2) - (ballbox.getBoundingClientRect().width / 2)}px`;

}
CreateBall();

// Create water
function CreateWater() {
    // Styling
    water.id = "water"
    water.style.position = "absolute"
    water.style.width = "100%"
    water.style.height = "43px"
    water.style.bottom = "0px";

    gameContainer.appendChild(water);
}
CreateWater();
// Player collision booleans to check which collisions have happened.
var topEdge, rightEdge, leftEdge, brickBottomCollision, pCollision;


function MoveBall() {
    CheckCollision();
    ballbox.style.transform = `translate(${ballClass.left}px,${-ballClass.bottom + 66}px)`

    // If not moving down, move up.
    if (ballClass.direction == "up") {
        ballClass.moveUp()
    }
    if (ballClass.direction == "down") {
        ballClass.moveDown()
    }

    // Handle edges and player collision.
    if (rightEdge && ballClass.directionX == "left" || pCollision && ballClass.directionX == "left") {
        ballClass.moveLeft()
    } else if (leftEdge && ballClass.directionX == "right" || pCollision && ballClass.directionX == "right") {
        ballClass.moveRight()
    }

    if (ballClass.directionX == null) {
        ballClass.moveRandom();
    }

    if (ballClass.bottom <= 30) {
        ballClass.moveUp()
        lifeLost = true;
        return;
    }

}

// Set score to 0
var frontEndScore = document.querySelector("#score");


var url = window.location.href
function trim() {
    if (url.includes("index.html")) {
        url = window.location.href.slice(0, -10)
    }
}
trim();


// Fake throttle
var c = 2;
var ballRec = ballbox.getBoundingClientRect();
var gameRect = gameContainer.getBoundingClientRect();

// Repaint grid on resize.
window.addEventListener("resize", bricksDimensions)
function bricksDimensions() {
    gameRect = gameContainer.getBoundingClientRect();

    blocks.forEach(rec => {
        var newRect = rec.getBoundingClientRect()
        rec.dataset.right = newRect.right;
        rec.dataset.left = newRect.left;
        rec.dataset.bottom = newRect.bottom;
    })
}

function CheckCollision() {
    if (c % 3 == 0) {
        // EXPENSIVE
        ballRec = ballbox.getBoundingClientRect();
    }

    // Increase count
    c++
    var playerRect = player.getBoundingClientRect();

    // check for top wall collision
    if (ballRec.top <= (gameRect.top)) {
        ballClass.moveDown()
        ballClass.direction = "down"
        topEdge = true;
    }

    // Check for block collision
    blocks.forEach((brick) => {
        var l = brick.dataset.left
        var r = brick.dataset.right
        var b = brick.dataset.bottom
        if (brick.className != "hidden" && b >= ballRec.top && ballRec.right > l && ballRec.right < r) {

            brick.style.opacity = "0";
            brick.className = "hidden";
            // ballClass.moveDown();
            ballClass.direction = "down"
            brickBottomCollision = true;
            topEdge = false;
            changeSrc();
            lifeLostDirectionChange = false;
            return;
        }

    })

    var gridLength = grid.querySelectorAll(".hidden").length
    frontEndScore.textContent = gridLength;

    if (gridLength == 40) {
        win = true;
        return;
    }

    // check for user collision
    if (ballRec.bottom >= playerRect.top && ballRec.right >= playerRect.left && ballRec.left <= playerRect.right) {
        ballClass.direction = "up";
        pCollision = true;
        topEdge = false;
        brickBottomCollision = false;
        changeSrc();
    }


    // Check for lost life
    if (lifeLostDirectionChange) {
        lifeLostDirectionChange = false;
        ballClass.bottom += 2;
        ballClass.direction = "up";
        changeSrc()
    }

    // Right wall collision
    if (ballRec.right >= gameRect.right) {
        // console.log("Hit right")
        rightEdge = true;
        leftEdge = false;
        ball.src = "catflipup.png"
        ballClass.directionX = "left";

    }

    // Left wall collision
    if (ballRec.left <= gameRect.left) {
        // console.log("Hit left")
        leftEdge = true;
        rightEdge = false;
        ball.src = "catup.png"
        ballClass.directionX = "right";
    }

}


function start(event) {

    if (event.key == "s" && sCount == 0) {
        ball.src = `catup.png`
        ball.id = ""
        ball.className = "center"
        Game()
        InitTimer();
        sCount++;
        gameStart = true;
    }
    if (event.key == "p" && pCount % 2 == 1) {
        Pause();
        pCount++;
    } else if (event.key == "p" && pCount % 2 == 0) {
        Resume();
        pCount++;
    }

    if (paused == true && event.key == "r") {
        window.location.reload()

    }
}

window.addEventListener("keydown", MovePlayer)
function Game() {

    if (gameStart && !paused) {
        MoveBall();
        drawPlayer();
        bricksDimensions();

    }
    if (win) {
        alert("You win!");
        clearInterval(timerId);
        return;
    }
    if (timesup) {
        alert("GAME OVER! time's up.")
        return
    }
    if (lifeLost) {
        lives.removeChild(lives.lastChild)
        lifeLost = false;
        lifeLostDirectionChange = true

        if (document.querySelectorAll(".life").length == 0) {
            alert("Game over! You lost all your lives.")
            clearInterval(timerId);
            return;
        }
    }
    if (!paused) {
        requestAnimationFrame(Game)
    }

}

function Reload() {
    gameStart = false;
    window.location.reload();
}


let timerId;
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    timerId = setInterval(function () {
        if (!timesup) {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10);


            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            display.textContent = minutes + ":" + seconds;

            if (timer-- <= 0) {
                timesup = true;
                return
            }
        }
    }, 1000);
}

let display = document.querySelector('#time');
function InitTimer() {
    let twoMin = 60 * 3
    startTimer(twoMin, display);
};

function Pause() {
    clearInterval(timerId);
    paused = true;
    pauseMenu.style.display = "block";
    gameContainer.classList.add("blur");
}

function Resume() {
    paused = false;
    pauseMenu.style.display = "none";
    gameContainer.classList.remove("blur");
    let currentTime = document.querySelector("#time").innerHTML;
    currentTime = currentTime.split(":")

    let totalSeconds = (parseInt(currentTime[0]) * 60) + parseInt(currentTime[1])

    if (gameStart) {
        Game();
        startTimer(totalSeconds, display)
    }

}


// Handle src depending on direction.
function changeSrc() {
    if (ballClass.direction == "down") {
        if (ballClass.directionX == "left") {
            ball.src = "catflipdown.png"
        } else if (ballClass.directionX == "right") {
            ball.src = "catdown.png"
        }
    } else {
        if (ballClass.directionX == "left") {
            ball.src = "catflipup.png";
        } else if (ballClass.directionX == "right") {
            ball.src = "catup.png";
        }
    }

}

let leftbtn = document.getElementById("leftbtn");
let rightbtn = document.getElementById("rightbtn");

leftbtn.addEventListener("touchstart", MoveLeft);
rightbtn.addEventListener("touchstart", MoveRight);


// Prevent zoom on double tap
function preventZoom(e) {
    var t2 = e.timeStamp;
    var t1 = e.currentTarget.dataset.lastTouch || t2;
    var dt = t2 - t1;
    var fingers = e.touches.length;
    e.currentTarget.dataset.lastTouch = t2;

    if (!dt || dt > 500 || fingers > 1) return; // not double-tap

    e.preventDefault();
    e.target.click();
}

// Mobile move left
function MoveLeft(e) {
    preventZoom(e);
    if (!gameStart) {
        ball.src = `catup.png`
        ball.id = ""
        ball.className = "center"
        gameStart = true;
        Game();
        InitTimer();
    }
    if (position >= 29) {
        position -= 18;
        player.style.transform = `translateX(${position}px)`;
    }
    if (position == 11) {
        position -= 11;
        player.style.transform = `translateX(${position}px)`;
    }

}

// Mobile move right
function MoveRight(e) {
    preventZoom(e);
    if (!gameStart) {
        ball.src = `catup.png`
        ball.id = ""
        ball.className = "center"
        gameStart = true
        Game();
        InitTimer();
    }
    if (position <= 227) {
        position += 18;
    }
    player.style.transform = `translateX(${position}px)`;
}

function preloadImage(url) {
    img.src = url;
}