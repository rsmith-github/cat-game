
let grid = document.querySelector(".grid");
function CreateGrid() {
    for (let i = 0; i < 24; i++) {
        let rectangle = document.createElement("div");
        rectangle.style.border = "solid 1px black";
        rectangle.style.height = "20px";
        rectangle.id = `block-${i + 1}`
        rectangle.className = 'block'
        grid.append(rectangle);
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
    player.id = "player"
    player.style.border = "solid 1px black";
    player.style.height = "15px";
    player.style.width = "150px";
    player.style.marginBottom = "50px";
    player.style.marginLeft = "338px";
    player.style.backgroundColor = "#98B4D4";
    player.style.float = "bottom"

    player.style.position = "relative";
    player.style.animationName = "move";
    player.style.animationDuration = "2s";
    player.style.animationFillMode = "forwards";


    document.querySelector("#game-container").appendChild(player);
}

CreatePlayer();
let margin = 338
function MovePlayer(event) {


    switch (event.key) {
        case "ArrowLeft":
            margin -= 10;
            player.style.marginLeft = margin + "px";
            if (margin <= 0) {
                margin += 10;
            }
            break;
        case "ArrowRight":
            margin += 10;
            player.style.marginLeft = margin + "px";
            if (margin >= 698) {
                margin -= 10;
            }
            break;

    }

}

document.addEventListener('keydown', MovePlayer);

