let body = document.body;
let gameContainer = document.querySelector("#game-container");
let gameContainerRect = gameContainer.getBoundingClientRect()
let grid = document.querySelector(".grid");
let gameStart = false;
let win = false;

// Check if life was lost.
let lifeLost = false;

// Boolean to add a condition in the CheckCollision function. If true, bottom += 4.
let lifeLostDirectionChange = false;
let lives = document.getElementById("lives");

// Pause menu
let pauseMenu = document.querySelector("#pause-menu");
let paused = false;
let timesup = false;

let blocks = [];
function CreateGrid() {
    for (let i = 0; i < 40; i++) {
        let rectangle = document.createElement("img");
        rectangle.src = "static/meat.png"
        if (i >= 10 && i <= 19) {
            rectangle.src = "static/catfood.png"
        } else if (i >= 20 && i <= 29) {
            rectangle.src = "static/fish.png"
        } else if (i >= 30 && i <= 40) {
            rectangle.src = "static/prawn.png"
        }
        rectangle.style.imageRendering = "pixelated";
        rectangle.style.objectFit = "scale-down"
        rectangle.style.border = "solid 1px yellow";
        rectangle.style.borderRadius = "8%";
        rectangle.style.height = "40px";
        rectangle.style.width = "100%";
        rectangle.id = `block-${i + 1}`
        rectangle.className = 'block'
        grid.append(rectangle);
        blocks.push(rectangle);

        // Improve performance as block positions are static.
        let newRect = rectangle.getBoundingClientRect()
        rectangle.dataset.right = newRect.right;
        rectangle.dataset.left = newRect.left;
        rectangle.dataset.bottom = newRect.bottom;

        // let newBlock = new Block
        // newBlock.bottomLeft = rectangle.left
    }
}
CreateGrid();

function DisplayLives() {
    for (let i = 0; i < 3; i++) {
        let life = document.createElement("img");
        life.src = "static/life.png";
        life.style.height = "20px";
        life.style.width = "20px";
        life.className = "life"
        lives.append(life)
    }
}
DisplayLives();

let player = document.createElement("div");
let ball = document.createElement("img");
let water = document.createElement("div");
let ballbox = document.createElement("div");
function CreatePlayer() {
    player.id = "player";

    player.style.height = "15px";
    player.style.width = "120px";
    player.style.transform = `translateX(${(gameContainerRect.width / 2) - 120 / 2}px)`;

    // player.style.backgroundImage = "url(grass-tile.png)"

    player.style.bottom = "50px";
    player.style.marginLeft = "1px";

    player.style.position = "absolute";
    // player.style.transitionDuration = "0.3s"
    // player.style.transitionTimingFunction = "linear";
    document.querySelector("#game-container").appendChild(player);
}

CreatePlayer();
let position = (gameContainerRect.width / 2) - 120 / 2 - 1;
function MovePlayer(event) {
    if (!gameStart) return;

    switch (event.key) {
        case "ArrowLeft":
            // Keep player paddle in bounds and move left if left arrow is clicked.
            if (position > 4.5) {
                position -= 12;
            }
            if (position == 4.5) {
                position -= 4.5
            }

            player.style.transform = `translateX(${position}px)`;
            break;
        case "ArrowRight":
            // Keep player paddle in bounds and move right if right arrow is clicked.
            if (position < 425) {
                position += 12;
            }
            if (position == 432) {
                position += 4.5;
            }

            player.style.transform = `translateX(${position}px)`;
            break;

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
        gameStart = true;
        Game();
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
        gameStart = true
        Game();
        InitTimer();
    }
    if (position <= 227) {
        position += 18;
    }
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

// Set bottom to 68px;
let bottom = 68
// Player collision booleans to check which collisions have happened.
let topEdge, rightEdge, leftEdge, pRightSide, pLeftSide, brickBottomCollision;
let ballLeft = 0;


function MoveBall() {
    ballbox.style.transform = `translate(${ballLeft}px,${-bottom + 66}px)`

    // Most basic bouncing off top. If top edge is hit, move ball downward. Else, move ball up.
    if (topEdge) {
        bottom -= 2;
    } else if (!topEdge) {
        bottom += 2;
    }

    // Right wall.
    if (rightEdge && !topEdge) {
        ballLeft -= 4
    } else if (rightEdge && topEdge) {
        pLeftSide = false;
        if (pRightSide) {
            ballLeft -= 4;
        } else {
            ballLeft -= 2;
        }
    }

    // If ball hits player on left or right side, make it go in expected direction.
    if (pLeftSide) {
        pRightSide = false;
        if (!rightEdge && !leftEdge) {
            ballLeft -= 2;
        }
    } else if (pRightSide) {
        pLeftSide = false;
        if (!rightEdge && !leftEdge) {
            ballLeft += 2
        }
    }

    // Left wall.
    if (leftEdge && !topEdge) {
        ballLeft += 4
    } else if (leftEdge && topEdge) {
        pRightSide = false;

        if (pLeftSide) {
            ballLeft += 4
        } else {
            ballLeft += 2
        }
    }

    if (brickBottomCollision) {
        bottom -= 4;
    }

    // console.log("Top Edge:", topEdge, "Right Edge:", rightEdge, "Left Edge:", leftEdge, "Plyr Right:", pRightSide, "Plyr Left:", pLeftSide)

    CheckCollision();
    if (bottom <= 1) {
        bottom += 2;
        lifeLost = true;
        return;
    }

}


// Set score to 0
let frontEndScore = document.querySelector("#score");


let url = window.location.href
// Fake throttle
let c = 2;
let ballRec = ballbox.getBoundingClientRect();
function CheckCollision() {
    // Get current url to get correc src for spritesheet.
    if (url.includes("index.html")) {
        url = window.location.href.slice(0, -10)
    }


    // EXPENSIVE
    if (c % 3 == 0) {
        ballRec = ballbox.getBoundingClientRect();
    }
    c++

    let gameRect = gameContainer.getBoundingClientRect();

    let playerRect = player.getBoundingClientRect();

    // check for top wall collision
    if (ballRec.top <= (gameRect.top)) {
        // console.log("HIT TOP");
        bottom -= 2;
        topEdge = true;

    }

    // Check for block collision
    blocks.forEach((brick) => {

        let l = brick.dataset.left
        let r = brick.dataset.right
        let b = brick.dataset.bottom
        if (brick.className != "hidden" && b >= ballRec.top && ballRec.right > l && ballRec.right < r) {
            // let blockRect = brick.getBoundingClientRect()
            // If left side of ball is within the block OR the right side of the ball is within the block, hide it using opacity. This comment does not match the code.
            // if (brick.className != "hidden" && blockRect.bottom >= ballRec.top && ballRec.right > blockRect.left && ballRec.right < blockRect.right) {
            brick.style.opacity = "0";
            brick.className = "hidden";
            bottom -= 2;
            brickBottomCollision = true;
            topEdge = false;

            if (rightEdge || pRightSide) {
                ball.src = "catflipdown.png"
            } else {
                ball.src = "catdown.png"
            }

            lifeLostDirectionChange = false;
            return;

        }

    })

    let gridLength = grid.querySelectorAll(".hidden").length
    frontEndScore.textContent = gridLength;

    if (gridLength == 40) {
        win = true;
        return;
    }

    // check for user collision
    if (ballRec.bottom >= playerRect.top && ballRec.right >= playerRect.left && ballRec.left <= playerRect.right) {
        // console.log("user collision");

        topEdge = false;
        leftEdge = false;
        rightEdge = false;
        brickBottomCollision = false;

        if (pLeftSide) {
            ball.src = "catflipup.png"
        } else {
            ball.src = "catup.png"
        }

        bottom += 2;
    }

    // Check for lost life
    if (lifeLostDirectionChange) {
        bottom += 4
    }

    // Check player paddle right side collision
    if (ballRec.left > (playerRect.right - playerRect.width / 2) && ballRec.left < playerRect.right && ballRec.bottom >= playerRect.top) {
        pRightSide = true;
        pLeftSide = false
    }
    // Check playerPaddle left side collision
    else if (ballRec.right < (playerRect.left + playerRect.width / 2) && ballRec.right > playerRect.left && ballRec.bottom >= playerRect.top) {
        pLeftSide = true;
        pRightSide = false
    }

    // Right wall collision
    if (ballRec.right >= gameRect.right) {
        // console.log("Hit right")
        rightEdge = true;
        leftEdge = false;
        ball.src = "catflipup.png"
    }

    // Left wall collision
    if (ballRec.left <= gameRect.left) {
        // console.log("Hit left")
        leftEdge = true;
        rightEdge = false;

        ball.src = "catup.png"
    }

}

// document.addEventListener("keydown", MovePlayer)


// Only start game once otherwise cat will go too fast.
let sCount = 0;
// Count pause
let pCount = 1;
document.addEventListener("keydown", function start(event) {

    if (event.key == "s" && sCount === 0 || event.key == "S" && sCount === 0) {
        ball.src = `${url}catup.png`
        sCount++;
        Game();
        InitTimer();
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
});


window.addEventListener("keydown", MovePlayer)
function Game() {

    if (!paused) {
        MoveBall()
    }
    if (!gameStart) {
        gameStart = true;
        if (url.includes("index.html")) {
            url = window.location.href.slice(0, -10)
        }
        ball.className = "center"
        ball.id = ""
    }
    if (win) {
        alert("You win!");
        return;
    }
    if (timesup) {
        alert("GAME OVER! time's up.")
        return
    }
    if (lifeLost) {
        lives.removeChild(lives.lastChild)
        bottom = 68;
        lifeLost = false;

        lifeLostDirectionChange = true

        if (document.querySelectorAll(".life").length == 0) {
            alert("Game over! You lost all your lives.")
            return;
        }
    }

    requestAnimationFrame(Game)

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
    let twoMin = 60 * 2.5
    startTimer(twoMin, display);

    // change animations
    // ball.className = "cat-moving-up"
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

    startTimer(totalSeconds, display)


}