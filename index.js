let body = document.body;
let gameContainer = document.querySelector("#game-container");
let gameContainerRect = gameContainer.getBoundingClientRect()

let grid = document.querySelector(".grid");
let gameStart = false;
// class Block {
//     constructor(xAxis, yAxis) {
//         this.bottomLeft = [xAxis, yAxis]
//         this.bottomRight = [xAxis + blockWidth, yAxis]
//         this.topRight = [xAxis + blockWidth, yAxis + blockHeight]
//         this.topLeft = [xAxis, yAxis + blockHeight]
//     }
// }

// let blocks = [];
function CreateGrid() {
    for (let i = 0; i < 18; i++) {
        let rectangle = document.createElement("img");
        rectangle.src = "chicken.gif"
        rectangle.style.border = "solid 1px black";
        rectangle.style.height = "50px";
        rectangle.style.width = "100%";
        rectangle.id = `block-${i + 1}`
        rectangle.className = 'block'
        grid.append(rectangle);
        // let newBlock = new Block
        // newBlock.bottomLeft = rectangle.left
    }
    document.querySelectorAll(".block").forEach(block => {
        block.addEventListener("click", () => {
            block.style.backgroundColor = "red";
        })
    });

}
CreateGrid();

let player = document.createElement("div");
function CreatePlayer() {
    player.id = "player";
    player.style.border = "solid 1px black";
    player.style.height = "15px";
    player.style.width = "120px";
    // player.style.left = gameContainer.getBoundingClientRect().width / 2 + "px";
    player.style.transform = `translateX(${(gameContainer.getBoundingClientRect().width / 2) - 120 / 2}px)`;

    player.style.bottom = "50px";
    player.style.marginLeft = "1px";
    player.style.backgroundColor = "#98B4D4";

    player.style.position = "absolute";
    player.style.transition = "all 25ms linear 0ms";
    // player.style.animationName = "move";
    // player.style.animationDuration = "2s";
    // player.style.animationFillMode = "forwards";
    // player.style.transitionTimingFunction = "linear";



    document.querySelector("#game-container").appendChild(player);
}

CreatePlayer();
let position = (gameContainer.getBoundingClientRect().width / 2) - 120 / 2 - 1;
function MovePlayer(event) {
    console.log(position)
    let playerRect = player.getBoundingClientRect();



    switch (event.key) {
        case "ArrowLeft":

            // Keep player within bounds.
            if (position > 6) {
                position -= 6;
            }
            player.style.transform = `translateX(${position}px)`;

            break;
        case "ArrowRight":

            if (position < 348) {
                position += 6;
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
    ball.style.transform = `translateX(${(gameContainer.getBoundingClientRect().width / 2) - (ball.getBoundingClientRect().width / 2) + 5}px)`;

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
    if (ballRect.top <= (gameContainer.getBoundingClientRect().top)) {
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