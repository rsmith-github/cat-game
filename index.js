let body = document.body;
let gameContainer = document.querySelector("#game-container");
let gameContainerRect = gameContainer.getBoundingClientRect()
let grid = document.querySelector(".grid");
let gameStart = false;

// let blocks = [];
function CreateGrid() {
    for (let i = 0; i < 18; i++) {
        let rectangle = document.createElement("img");
        rectangle.src = "meat.png"
        rectangle.style.border = "solid 1px black";
        rectangle.style.height = "50px";
        rectangle.style.width = "100%";
        rectangle.id = `block-${i + 1}`
        rectangle.className = 'block'
        grid.append(rectangle);
        // let newBlock = new Block
        // newBlock.bottomLeft = rectangle.left
    }

}
CreateGrid();

let player = document.createElement("div");
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

            break;
        case "ArrowRight":

            // Keep player paddle in bounds and move right if right arrow is clicked.
            if (position < 348) {
                position += 12;
            }
            if (position == 348) {
                position += 8;

            }
            player.style.transform = `translateX(${position}px)`;

            break;

    }


}


document.addEventListener('keydown', MovePlayer);

let ball = document.createElement("img");
function CreateBall() {
    ball.style.width = "50px";
    ball.style.height = "50px";
    ball.src = "cat.gif"
    ball.style.position = "absolute";
    ball.style.border = "solid 1px black";

    ball.style.bottom = "66px";
    gameContainer.appendChild(ball);
    ball.style.transform = `translateX(${(gameContainerRect.width / 2) - (ball.getBoundingClientRect().width / 2) + 5}px)`;

}

CreateBall();
let bottom = 68
let topEdge = false;
function MoveBall() {
    ball.style.bottom = bottom + "px";

    if (topEdge == true) {
        bottom -= 2
    } else {
        bottom += 2;
    }

    CheckCollision();
    if (bottom <= 1) {
        bottom += 2

        alert("Game over.");
        exit(1)
    }
}


function CheckCollision() {
    let ballRect = ball.getBoundingClientRect();
    let playerRect = player.getBoundingClientRect();
    // check for wall collision
    if (ballRect.top <= (gameContainerRect.top)) {
        console.log("HIT TOP");
        bottom -= 2;
        topEdge = true;

    }

    // check for user collision
    if (ballRect.bottom >= playerRect.top && ballRect.right >= playerRect.left && ballRect.left <= playerRect.right) {
        console.log("user collision");
        topEdge = false;
        bottom += 2;
    }

}

function Game() {
    MoveBall()


    requestAnimationFrame(Game)

}


function Stop() {
    gameStart = false;
}