let body = document.body;
let gameContainer = document.querySelector("#game-container");
let gameContainerRect = gameContainer.getBoundingClientRect()
let grid = document.querySelector(".grid");
let gameStart = false;

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

let player = document.createElement("div");
let ballbox = document.createElement("div");
let ball = document.createElement("img");
let water = document.createElement("div");
function CreatePlayer() {
    player.id = "player";
    // player.style.border = "solid 1px black";
    player.style.height = "17px";
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
let ballPos = (gameContainerRect.width / 2) + (ball.getBoundingClientRect().width - 25)
function MovePlayer(event) {
    switch (event.key) {
        case "ArrowLeft":

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
            // if (!gameStart) {
            //     ballPos -= 4
            //     ball.style.transform = `translateX(${ballPos}px)`;
            // }

            break;
        case "ArrowRight":

            // Keep player paddle in bounds and move right if right arrow is clicked.
            console.log(position)
            if (position < 425) {
                position += 12;
            }
            if (position == 348) {
                position += 8;
            }
            player.style.transform = `translateX(${position}px)`;

            // Make ball follow user if game hasn't started.
            // if (!gameStart) {
            //     ballPos += 4
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
    // ball.id = "sprite";
    ball.src = "cat-sprite.png"
    ball.alt = "Cat Sprite"

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
let topEdge, rightEdge, leftEdge, pRightSide, pLeftSide;
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

    // If ball hits player left or right side, make it go in expected direction.
    if (pLeftSide == true) {
        pRightSide = false;
        ballLeft -= 2;
    } else if (pRightSide == true) {
        pLeftSide = false;
        ballLeft += 2
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

    console.log("Top Edge:", topEdge, "Right Edge:", rightEdge, "Left Edge:", leftEdge, "Plyr Right:", pRightSide, "Plyr Left:", pLeftSide)



    CheckCollision();
    if (bottom <= 1) {
        bottom += 2;

        alert("Game over.");
        exit(1);
    }
}


// Set score to 0
let frontEndScore = document.querySelector("#score");

function CheckCollision() {
    let ballRect = ballbox.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    // check for top wall collision
    if (ballRect.top <= (gameContainerRect.top)) {
        console.log("HIT TOP");
        bottom -= 2;
        topEdge = true;

    }

    // Check for block collision
    blocks.forEach((brick) => {
        let blockRect = brick.getBoundingClientRect()
        // If left side of ball is within the block OR the right side of the ball is within the block, hide it using opacity.
        if (ballRect.left >= blockRect.left && ballRect.left < blockRect.right && blockRect.bottom >= ballRect.top || blockRect.bottom >= ballRect.top && ballRect.right > blockRect.left && ballRect.right < blockRect.right) {
            brick.style.opacity = "0";
            brick.className = "hidden";
        }
    })

    let gridLength = grid.querySelectorAll(".hidden").length
    frontEndScore.innerHTML = gridLength;

    if (gridLength == 18) {
        alert("You win!")
        // window.reload()
    }

    // check for user collision
    if (ballRect.bottom >= playerRect.top && ballRect.right >= playerRect.left && ballRect.left <= playerRect.right) {
        console.log("user collision");
        topEdge = false;
        leftEdge = false;
        rightEdge = false;

        bottom += 2;
    }

    // Check player paddle right side collision
    if (ballRect.left >= (playerRect.right - playerRect.width / 2) && ballRect.left <= playerRect.right && ballRect.bottom >= playerRect.top) {
        pRightSide = true;
        pLeftSide = false

    }
    // Check playerPaddle left side collision
    else if (ballRect.right <= (playerRect.left + playerRect.width / 2) && ballRect.right >= playerRect.left && ballRect.bottom >= playerRect.top) {
        pLeftSide = true;
        pRightSide = false
    }

    // Right wall collision
    if (ballRect.right >= gameContainerRect.right) {
        console.log("Hit right")
        rightEdge = true;
        leftEdge = false;
    }

    // Left wall collision
    if (ballRect.left <= gameContainerRect.left) {
        console.log("Hit left")
        leftEdge = true;
        rightEdge = false;
    }






}
console.log(blocks)

function Game() {
    if (!gameStart) {
        gameStart = true;
    }

    MoveBall()


    requestAnimationFrame(Game)

}


function Stop() {
    gameStart = false;
}