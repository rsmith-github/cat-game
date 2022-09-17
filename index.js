
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
        rectangle.src = "meat.png"
        if (i >= 10 && i <= 19) {
            rectangle.src = "catfood.png"
        } else if (i >= 20 && i <= 29) {
            rectangle.src = "fish.png"
        } else if (i >= 30 && i <= 40) {
            rectangle.src = "prawn.png"
        }
        rectangle.style.imageRendering = "pixelated";
        rectangle.style.objectFit = "scale-down"
        rectangle.style.border = "solid 1px black";
        rectangle.style.height = "40px";
        rectangle.style.width = "100%";
        rectangle.id = `block-${i + 1}`
        rectangle.className = 'block'
        grid.append(rectangle);
        blocks.push(rectangle);
        // let newBlock = new Block
        // newBlock.bottomLeft = rectangle.left
    }
}
CreateGrid();

function DisplayLives() {
    for (let i = 0; i < 3; i++) {
        let life = document.createElement("img");
        life.src = "life.png";
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
    player.style.transitionDuration = "0.3s"
    player.style.transitionTimingFunction = "linear";



    document.querySelector("#game-container").appendChild(player);
}

CreatePlayer();
let position = (gameContainerRect.width / 2) - 120 / 2 - 1;
let ballRect = (gameContainerRect.width / 2) - (ball.getBoundingClientRect().width / 2) + 3
let ballPos = ballRect.left
function MovePlayer(event) {
    if (!gameStart) return;

    switch (event.key) {
        case "ArrowLeft":
            // let ballRect = ball.getBoundingClientRect()


            // Keep player paddle in bounds and move left if left arrow is clicked.
            if (position > 4.5) {
                position -= 12;
            }
            if (position == 4.5) {
                position -= 4.5
            }

            player.style.transform = `translateX(${position}px)`;

            // Make ball follow user if game hasn't started.
            // if (!gameStart) {
            //     ballPos -= 12
            //     ball.style.transform = `translateX(${ballPos}px)`;
            // }

            break;
        case "ArrowRight":

            // Keep player paddle in bounds and move right if right arrow is clicked.
            if (position < 425) {
                position += 12;
            }
            if (position == 432) {
                position += 4.5;
            }
            // console.log(position);
            player.style.transform = `translateX(${position}px)`;

            // Make ball follow user if game hasn't started.
            // if (!gameStart) {
            //     ballPos += 8
            //     ball.style.transform = `translateX(${ballPos}px)`;
            // }

            break;

    }


}

// Move player on keydown.
document.addEventListener('keydown', MovePlayer);


// Create ball
function CreateBall() {
    // Styling
    ball.id = "sprite";
    ball.src = "cat-sprite.png"
    ball.alt = "Cat Sprite"
    ball.classList.add("chilling")

    ball.style.position = "absolute";

    ballbox.className = "ballbox"

    ballbox.appendChild(ball)
    gameContainer.appendChild(ballbox);

    // Position
    ballbox.style.transform = `translateX(${(gameContainerRect.width / 2) - (ballbox.getBoundingClientRect().width / 2) + 5}px)`;

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
    ballbox.style.bottom = bottom + "px";
    ballbox.style.left = ballLeft + "px";

    // Most basic bouncing off top. If top edge is hit, move ball downward. Else, move ball up.
    if (topEdge) {
        bottom -= 2;
    } else if (!topEdge) {
        bottom += 2;
    }

    // Right wall.
    if (rightEdge == true && !topEdge) {
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
    if (pLeftSide == true) {
        pRightSide = false;
        if (!rightEdge && !leftEdge) {
            ballLeft -= 2;
        }
    } else if (pRightSide == true) {
        pLeftSide = false;
        if (!rightEdge && !leftEdge) {
            ballLeft += 2
        }
    }


    // Left wall.
    if (leftEdge == true && !topEdge) {
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

function CheckCollision() {
    let ballRect = ballbox.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    // Redeclaring this because dev-tools was messing up the boundaries.
    let gameRect = gameContainer.getBoundingClientRect()

    // check for top wall collision
    if (ballRect.top <= (gameRect.top)) {
        // console.log("HIT TOP");
        bottom -= 2;
        topEdge = true;
    }

    // Check for block collision
    blocks.forEach((brick) => {
        let blockRect = brick.getBoundingClientRect()

        // If left side of ball is within the block OR the right side of the ball is within the block, hide it using opacity.
        if (brick.className != "hidden" && ballRect.left >= blockRect.left && ballRect.left < blockRect.right && blockRect.bottom >= ballRect.top || brick.className != "hidden" && blockRect.bottom >= ballRect.top && ballRect.right > blockRect.left && ballRect.right < blockRect.right) {
            brick.style.opacity = "0";
            brick.className = "hidden";
            bottom -= 2;
            brickBottomCollision = true;
            topEdge = false;

            if (ball.src == "http://127.0.0.1:5500/Cat-Sprite-Flip.png") {
                ball.className = "cat-flipped-down"

            } else {
                ball.className = "cat-moving-down"
            }

            lifeLostDirectionChange = false;
            return;

        }

    })

    let gridLength = grid.querySelectorAll(".hidden").length
    frontEndScore.innerHTML = gridLength;

    if (gridLength == 40) {
        win = true;
        return;
    }

    // check for user collision
    if (ballRect.bottom >= playerRect.top && ballRect.right >= playerRect.left && ballRect.left <= playerRect.right) {
        // console.log("user collision");

        topEdge = false;
        leftEdge = false;
        rightEdge = false;
        brickBottomCollision = false;

        if (ball.src == "http://127.0.0.1:5500/Cat-Sprite-Flip.png") {
            ball.className = "cat-flipped-up"
        } else {
            ball.className = "cat-moving-up"
        }

        bottom += 2;
    }

    // Check for lost life
    if (lifeLostDirectionChange) {
        bottom += 4
    }

    // Check player paddle right side collision
    if (ballRect.left > (playerRect.right - playerRect.width / 2) && ballRect.left < playerRect.right && ballRect.bottom >= playerRect.top) {
        pRightSide = true;
        pLeftSide = false
    }
    // Check playerPaddle left side collision
    else if (ballRect.right < (playerRect.left + playerRect.width / 2) && ballRect.right > playerRect.left && ballRect.bottom >= playerRect.top) {
        pLeftSide = true;
        pRightSide = false
    }

    // Right wall collision
    if (ballRect.right >= gameRect.right) {
        // console.log("Hit right")
        rightEdge = true;
        leftEdge = false;
        ball.src = ("Cat-Sprite-Flip.png")

        if (ball.className != "cat-moving-up" && ball.className != "cat-flipped-up") {
            ball.classList.add("flip");
        } else {
            ball.className = "cat-flipped-up"
        }

    }

    // Left wall collision
    if (ballRect.left <= gameRect.left) {
        // console.log("Hit left")
        leftEdge = true;
        rightEdge = false;

        ball.src = ("Cat-sprite.png")

        if (pLeftSide) {
            ball.className = "cat-moving-up"
        } else {
            ball.className = "cat-moving-down"
        }




    }

}

let startButton = document.querySelector("#gameStart")

function Game() {
    if (!gameStart) {
        gameStart = true;
    }
    if (gameStart) {
        startButton.disabled = true;
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
        // alert("Oops!, you lost a life.");

        // Move ball back to original position.
        // Most likely don't need this.
        // ballbox.style.transform = `translateX(${(gameContainerRect.width / 2) - (ball.getBoundingClientRect().width / 2) + 3}px)`;
        // ballbox.style.bottom = "66px";
        bottom = 68;
        lifeLost = false;

        lifeLostDirectionChange = true


        if (document.querySelectorAll(".life").length == 0) {
            alert("Game over! You lost all your lives.")
            return;
        }
    }

    if (paused == false) {
        MoveBall()
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
    let twoMin = 60 * 2
    startTimer(twoMin, display);

    // change animations
    ball.className = "cat-moving-up"
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