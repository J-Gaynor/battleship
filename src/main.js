import Player from './player'
import Ship from './Ship'
import './style.css'

let currentTurn = "human";
const enemyBoard = new Player("robot");
const playerBoard = new Player("human");

const populateBoard = () => {
    const enemyBoardContainer = document.getElementById("enemy-half");
    const playerBoardContainer = document.getElementById("player-half");
    enemyBoardContainer.appendChild(boardBuilder(enemyBoard));
    playerBoardContainer.appendChild(boardBuilder(playerBoard));
}

const boardBuilder = (boardInstance) => {
    console.log(boardInstance)
    const gameBoard = boardInstance.gameboard;

    // Testing
    gameBoard.placeShip(1, 1);
    gameBoard.placeShip(4, 5);

    const board = document.createElement("div");
    board.className = "tile-board";

    for (let y = 0; y < gameBoard.height; y++) {
        const row = document.createElement("div");
        row.className = "board-row"
        for (let x = 0; x < gameBoard.width; x++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            if (boardInstance.type === "robot") {
                tile.classList.add("enemy-tile");
                tile.addEventListener("click", e => { attackTile(e.target, gameBoard, x, y); })
            }
            if (boardInstance.type === "human") {
                tile.dataset.x = x;
                tile.dataset.y = y;
                if (gameBoard.board[y][x] instanceof Ship) {
                    tile.textContent = "S";
                }
            }
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
    return board;
}

const attackTile = (tile, gameBoard, x, y) => {
    if (currentTurn !== "human" || tile.textContent !== "") return;
    const isHit = gameBoard.receiveAttack(x, y);
    tile.textContent = isHit ? 'S' : 'X';
    if (isHit && gameBoard.allShipsSunk()) {
        currentTurn = "gameOver";
        return;
    }
    currentTurn = "robot";
    robotTurn();
}

const robotTurn = () => {
    const unattackedTiles = document.querySelectorAll("#player-half .tile:not(.attacked)");
    let highlightedTile = null;

    const scanInterval = setInterval(() => {
        if (highlightedTile) highlightedTile.classList.remove("bot-scanning");
        const randomTile = unattackedTiles[Math.floor(Math.random() * unattackedTiles.length)];
        randomTile.classList.add("bot-scanning");
        highlightedTile = randomTile;
    }, 120);

    setTimeout(() => {
        clearInterval(scanInterval);
        if (highlightedTile) highlightedTile.classList.remove("bot-scanning");

        const [x, y] = enemyBoard.getRandomAttack();
        const isHit = playerBoard.gameboard.receiveAttack(x, y);

        const targetTile = document.querySelector(`#player-half .tile[data-x="${x}"][data-y="${y}"]`);
        targetTile.classList.add("attacked");
        targetTile.textContent = isHit ? "H" : "X";

        if (isHit && playerBoard.gameboard.allShipsSunk()) {
            currentTurn = "gameOver";
            return;
        }

        currentTurn = "human";
    }, 2500);
};

populateBoard();