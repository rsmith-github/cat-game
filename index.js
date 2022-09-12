let body = document.body;
let gameContainer = document.querySelector("#game-container");
let gameContainerRect = gameContainer.getBoundingClientRect()
let grid = document.querySelector(".grid");
let gameStart = false;
let win = false;
let lifeLost = false;
let lives = document.getElementById("lives");

let blocks = [];
function CreateGrid() {
    for (let i = 0; i < 18; i++) {
        let rectangle = document.createElement("img");
        if (i >= 0 && i < 6) {
            rectangle.src = "chicken.gif"

        } else if (i >= 6 && i <= 11) {
            rectangle.src = "meat.png"

        } else {
            rectangle.src = "maki.png"
        }
        rectangle.style.border = "solid 1px black";
        rectangle.style.height = "50px";
        rectangle.style.width = "100%";
        rectangle.style.borderRadius = "25%"
        rectangle.id = `block-${i + 1}`
        // rectangle.className = 'block'
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
function CreatePlayer() {
    player.id = "player";
    player.style.border = "solid 1px black";
    player.style.height = "15px";
    player.style.width = "120px";
    player.style.transform = `translateX(${(gameContainerRect.width / 2) - 120 / 2}px)`;

    player.style.bottom = "50px";
    player.style.marginLeft = "1px";
    player.style.backgroundColor = "#98B4D4";

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
    switch (event.key) {
        case "ArrowLeft":
            let ballRect = ball.getBoundingClientRect()

            // Keep player paddle in bounds and move left if left arrow is clicked.
            if (position > 3) {
                position -= 12;
            }
            if (position == 6) {
                position -= 6
            }
            if (position == 8) {
                position -= 8
            }
            player.style.transform = `translateX(${position}px)`;

            // Make ball follow user if game hasn't started.
            if (!gameStart) {
                ballPos -= 12
                ball.style.transform = `translateX(${ballPos}px)`;
            }

            break;
        case "ArrowRight":

            // Keep player paddle in bounds and move right if right arrow is clicked.
            if (position < 348) {
                position += 12;
            }
            if (position == 348) {
                position += 8;
            }
            console.log(position);
            player.style.transform = `translateX(${position}px)`;

            // Make ball follow user if game hasn't started.
            if (!gameStart) {
                ballPos += 8
                ball.style.transform = `translateX(${ballPos}px)`;
            }

            break;

    }


}

// Move player on keydown.
document.addEventListener('keydown', MovePlayer);


// Create ball
function CreateBall() {
    // Styling
    ball.style.width = "25px";
    ball.style.height = "25px";
    ball.src = "cat.gif"
    ball.style.position = "absolute";
    // ball.style.border = "outset 4px white";
    ball.style.bottom = "66px";
    gameContainer.appendChild(ball);

    // Position
    ball.style.transform = `translateX(${(gameContainerRect.width / 2) - (ball.getBoundingClientRect().width / 2) + 3}px)`;

}
CreateBall();

// Set bottom to 68px;
let bottom = 68
// Player collision booleans to check which collisions have happened.
let topEdge, rightEdge, leftEdge, pRightSide, pLeftSide, brickBottomCollision;
let ballLeft = 0;


function MoveBall() {
    ball.style.bottom = bottom + "px";
    ball.style.left = ballLeft + "px";


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

    console.log("Top Edge:", topEdge, "Right Edge:", rightEdge, "Left Edge:", leftEdge, "Plyr Right:", pRightSide, "Plyr Left:", pLeftSide)



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
    let ballRect = ball.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    // Redeclaring this because dev-tools was messing up the boundaries.
    let gameRect = gameContainer.getBoundingClientRect()
    
    // check for top wall collision
    if (ballRect.top <= (gameRect.top)) {
        console.log("HIT TOP");
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
            return;

        }

    })

    let gridLength = grid.querySelectorAll(".hidden").length
    frontEndScore.innerHTML = gridLength;

    if (gridLength == 18) {
        win = true;
        return;
    }

    // check for user collision
    if (ballRect.bottom >= playerRect.top && ballRect.right >= playerRect.left && ballRect.left <= playerRect.right) {
        console.log("user collision");

        topEdge = false;
        leftEdge = false;
        rightEdge = false;
        brickBottomCollision = false;

        bottom += 2;
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
        console.log("Hit right")
        rightEdge = true;
        leftEdge = false;
    }

    // Left wall collision
    if (ballRect.left <= gameRect.left) {
        console.log("Hit left")
        leftEdge = true;
        rightEdge = false;
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

    if (lifeLost) {
        lives.removeChild(lives.lastChild)
        // alert("Oops!, you lost a life.");

        // Move player back to original position.
        player.style.transform = `translateX(${(gameContainerRect.width / 2) - 120 / 2}px)`;
        position = (gameContainerRect.width / 2) - 120 / 2 - 1;

        // Move ball back to original position.
        ball.style.transform = `translateX(${(gameContainerRect.width / 2) - (ball.getBoundingClientRect().width / 2) + 3}px)`;
        ball.style.bottom = "66px";
        bottom = 68;
        lifeLost = false;

        if (document.querySelectorAll(".life").length == 0) {
            alert("Game over! You lost all your lives.")
            return;
        }
    }
    MoveBall()


    requestAnimationFrame(Game)

}


function Reload() {
    gameStart = false;
    window.location.reload();
}