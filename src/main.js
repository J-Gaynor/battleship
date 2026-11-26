import Player from './player'
import Ship from './Ship'
import './style.css'

const FLEET_LENGTHS = [5, 4, 3, 3, 2];

let gameMode = "computer"; // "computer" | "two-player"
let currentTurn = "setup"; // "setup" | "player1" | "player2" | "robot" | "pass" | "gameOver"
let setupPlayerKey = "player1";
let remainingShips = [...FLEET_LENGTHS];
let currentOrientation = "horizontal";

let player1 = new Player("human");
let player2 = new Player("robot");

const ensureModeControls = () => {
    if (document.getElementById("mode-controls")) return;
    const main = document.querySelector("main");
    const controls = document.createElement("div");
    controls.id = "mode-controls";

    const modeButton = document.createElement("button");
    modeButton.id = "mode-toggle-button";
    modeButton.className = "menu-btn";
    modeButton.textContent = "Mode: vs Computer";
    modeButton.addEventListener("click", () => {
        gameMode = gameMode === "computer" ? "two-player" : "computer";
        modeButton.textContent = gameMode === "computer" ? "Mode: vs Computer" : "Mode: 2 Players";
        playAgain();
    });

    const status = document.createElement("span");
    status.id = "turn-status";
    controls.append(modeButton, status);
    main.prepend(controls);
};

const updateStatus = (text) => {
    const status = document.getElementById("turn-status");
    if (status) status.textContent = text;
};

const populateBoard = () => {
    ensureModeControls();
    const playerBoardContainer = document.getElementById("player-half");
    const enemyBoardContainer = document.getElementById("enemy-half");
    playerBoardContainer.innerHTML = "";
    enemyBoardContainer.innerHTML = "";

    playerBoardContainer.appendChild(boardBuilder(player1, "player1"));
    enemyBoardContainer.appendChild(boardBuilder(player2, "player2"));

    if (currentTurn === "setup") {
        const label = gameMode === "two-player" && setupPlayerKey === "player2" ? "Player 2" : "Player 1";
        updateStatus(`${label}: Place your ships (drag or click, ${remainingShips.length} left)`);
    } else if (currentTurn === "player1") {
        updateStatus(gameMode === "two-player" ? "Player 1's turn — attack Player 2's board" : "Your turn — attack Enemy board");
    } else if (currentTurn === "player2") {
        updateStatus("Player 2's turn — attack Player 1's board");
    }
};

const shipMenuBuilder = (ownerKey) => {
    const shipsContainer = document.createElement("div");
    shipsContainer.className = "ships-container";

    const isPlacingThisBoard = currentTurn === "setup" && setupPlayerKey === ownerKey;
    if (!isPlacingThisBoard) {
        return shipsContainer;
    }

    const activePlayer = ownerKey === "player1" ? player1 : player2;
    const nextLength = remainingShips[0] || 0;

    const shipGraphicContainer = document.createElement("div");
    const shipLengthContainer = document.createElement("div");
    const shipRotationContainer = document.createElement("div");
    const shipRemainingRandomContainer = document.createElement("div");

    shipGraphicContainer.className = "ship-container-div";
    shipLengthContainer.className = "ship-container-div";
    shipRotationContainer.className = "ship-container-div";
    shipRemainingRandomContainer.className = "ship-container-div";

    // Draggable ship preview
    const draggableShip = document.createElement("div");
    draggableShip.className = `draggable-ship ${currentOrientation}`;
    draggableShip.draggable = nextLength > 0;
    for (let i = 0; i < nextLength; i++) {
        const cell = document.createElement("div");
        cell.className = "ship-preview-cell";
        draggableShip.appendChild(cell);
    }
    draggableShip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(nextLength));
    });
    shipGraphicContainer.appendChild(draggableShip);

    // Length display
    shipLengthContainer.innerHTML = `<h4>Length</h4><span>${nextLength}</span>`;

    // Rotation toggle
    const rotateBtn = document.createElement("button");
    rotateBtn.className = "menu-btn";
    rotateBtn.textContent = currentOrientation === "horizontal" ? "Horizontal" : "Vertical";
    rotateBtn.addEventListener("click", () => {
        currentOrientation = currentOrientation === "horizontal" ? "vertical" : "horizontal";
        populateBoard();
    });
    shipRotationContainer.appendChild(rotateBtn);

    // Randomize + remaining count
    const randomBtn = document.createElement("button");
    randomBtn.className = "menu-btn";
    randomBtn.textContent = "Randomize";
    randomBtn.addEventListener("click", () => {
        activePlayer.gameboard.placeRandomShips(remainingShips);
        remainingShips = [];
        finishSetupStep();
    });

    const remainingText = document.createElement("span");
    remainingText.textContent = `Left: ${remainingShips.length}`;
    shipRemainingRandomContainer.append(randomBtn, remainingText);

    shipsContainer.append(
        shipGraphicContainer,
        shipLengthContainer,
        shipRotationContainer,
        shipRemainingRandomContainer
    );
    return shipsContainer;
};

const finishSetupStep = () => {
    if (gameMode === "two-player" && setupPlayerKey === "player1") {
        setupPlayerKey = "player2";
        remainingShips = [...FLEET_LENGTHS];
        currentOrientation = "horizontal";
        showPassDeviceModal("Pass device to Player 2 to place ships.", () => {
            populateBoard();
        });
        return;
    }

    if (gameMode === "computer") {
        player2.gameboard.placeRandomShips(FLEET_LENGTHS);
    }

    currentTurn = "player1";
    if (gameMode === "two-player") {
        showPassDeviceModal("All ships placed! Pass device to Player 1.", () => {
            populateBoard();
        });
    } else {
        populateBoard();
    }
};

const tryPlaceNextShip = (boardInstance, x, y) => {
    if (remainingShips.length === 0) return;
    const length = remainingShips[0];
    const placed = boardInstance.gameboard.placeShip(x, y, length, currentOrientation);
    if (!placed) return;

    remainingShips.shift();
    if (remainingShips.length === 0) {
        finishSetupStep();
    } else {
        populateBoard();
    }
};

const highlightPlacementPreview = (container, gameBoard, x, y, add) => {
    const length = remainingShips[0];
    if (!length) return;

    let valid = true;
    const coords = [];
    for (let i = 0; i < length; i++) {
        const cx = currentOrientation === "horizontal" ? x + i : x;
        const cy = currentOrientation === "vertical" ? y + i : y;
        if (cx >= gameBoard.width || cy >= gameBoard.height || gameBoard.board[cy][cx] instanceof Ship) {
            valid = false;
        }
        coords.push([cx, cy]);
    }

    for (const [cx, cy] of coords) {
        const tile = container.querySelector(`.tile[data-x="${cx}"][data-y="${cy}"]`);
        if (!tile) continue;
        tile.classList.remove("placement-preview", "placement-invalid");
        if (add) {
            tile.classList.add(valid ? "placement-preview" : "placement-invalid");
        }
    }
};

const isCoordinateAttacked = (gameBoard, x, y) => {
    const ship = gameBoard.board[y][x];
    const isMiss = gameBoard.misses.some(([mx, my]) => mx === x && my === y);
    if (isMiss) return "miss";
    if (ship instanceof Ship) {
        // Track per-cell hit state on the player's attackedSet or DOM; use board-level attacked set if present
        return gameBoard.attackedCoords?.has(`${x},${y}`) ? "hit" : null;
    }
    return null;
};

const boardBuilder = (boardInstance, ownerKey) => {
    const gameBoard = boardInstance.gameboard;
    const board = document.createElement("div");
    board.className = "tile-board";

    const isPlacingThisBoard = currentTurn === "setup" && setupPlayerKey === ownerKey;
    const showOwnShips =
        isPlacingThisBoard ||
        (gameMode === "computer" && ownerKey === "player1") ||
        (gameMode === "two-player" && currentTurn === ownerKey) ||
        currentTurn === "gameOver";

    const isTargetableEnemy =
        (gameMode === "computer" && ownerKey === "player2" && currentTurn === "player1") ||
        (gameMode === "two-player" &&
            ((currentTurn === "player1" && ownerKey === "player2") ||
                (currentTurn === "player2" && ownerKey === "player1")));

    for (let y = 0; y < gameBoard.height; y++) {
        const row = document.createElement("div");
        row.className = "board-row";
        for (let x = 0; x < gameBoard.width; x++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            tile.dataset.x = x;
            tile.dataset.y = y;

            const cellState = isCoordinateAttacked(gameBoard, x, y);
            if (cellState === "hit") {
                tile.classList.add("attacked", "hit");
                tile.textContent = "H";
            } else if (cellState === "miss") {
                tile.classList.add("attacked", "miss");
                tile.textContent = "X";
            } else if (gameBoard.board[y][x] instanceof Ship && showOwnShips) {
                tile.textContent = "S";
            }

            if (isPlacingThisBoard) {
                tile.addEventListener("click", () => tryPlaceNextShip(boardInstance, x, y));
                tile.addEventListener("mouseenter", () => highlightPlacementPreview(board, gameBoard, x, y, true));
                tile.addEventListener("mouseleave", () => highlightPlacementPreview(board, gameBoard, x, y, false));
                tile.addEventListener("dragover", (e) => {
                    e.preventDefault();
                    highlightPlacementPreview(board, gameBoard, x, y, true);
                });
                tile.addEventListener("dragleave", () => highlightPlacementPreview(board, gameBoard, x, y, false));
                tile.addEventListener("drop", (e) => {
                    e.preventDefault();
                    highlightPlacementPreview(board, gameBoard, x, y, false);
                    tryPlaceNextShip(boardInstance, x, y);
                });
            } else if (isTargetableEnemy) {
                tile.classList.add("enemy-tile");
                tile.addEventListener("click", (e) => attackTile(e.target, gameBoard, x, y));
            }

            row.appendChild(tile);
        }
        board.appendChild(row);
    }

    board.appendChild(shipMenuBuilder(ownerKey));
    return board;
};

const recordCellAttack = (gameBoard, x, y) => {
    if (!gameBoard.attackedCoords) {
        gameBoard.attackedCoords = new Set();
    }
    gameBoard.attackedCoords.add(`${x},${y}`);
};

const attackTile = (tile, gameBoard, x, y) => {
    if ((currentTurn !== "player1" && currentTurn !== "player2") || tile.classList.contains("attacked")) {
        return;
    }

    recordCellAttack(gameBoard, x, y);
    const isHit = gameBoard.receiveAttack(x, y);
    tile.classList.add("attacked", isHit ? "hit" : "miss");
    tile.textContent = isHit ? "H" : "X";

    if (isHit && gameBoard.allShipsSunk()) {
        const winnerName =
            currentTurn === "player1"
                ? gameMode === "two-player"
                    ? "Player 1"
                    : "Human"
                : "Player 2";
        currentTurn = "gameOver";
        gameOver(winnerName);
        return;
    }

    if (gameMode === "two-player") {
        const nextPlayer = currentTurn === "player1" ? "player2" : "player1";
        currentTurn = "pass";
        showPassDeviceModal(
            `Pass device to ${nextPlayer === "player1" ? "Player 1" : "Player 2"}.`,
            () => {
                currentTurn = nextPlayer;
                populateBoard();
            }
        );
        return;
    }

    currentTurn = "robot";
    updateStatus("Computer is thinking...");
    robotTurn();
};

const robotTurn = () => {
    const unattackedTiles = document.querySelectorAll("#player-half .tile:not(.attacked)");
    let highlightedTile = null;

    const scanInterval = setInterval(() => {
        if (highlightedTile) highlightedTile.classList.remove("bot-scanning");
        const randomTile = unattackedTiles[Math.floor(Math.random() * unattackedTiles.length)];
        if (randomTile) {
            randomTile.classList.add("bot-scanning");
            highlightedTile = randomTile;
        }
    }, 120);

    setTimeout(() => {
        clearInterval(scanInterval);
        if (highlightedTile) highlightedTile.classList.remove("bot-scanning");

        const [x, y] = player2.getRandomAttack();
        recordCellAttack(player1.gameboard, x, y);
        const isHit = player1.gameboard.receiveAttack(x, y);
        player2.getCalculatedAttack(x, y, isHit);

        const targetTile = document.querySelector(`#player-half .tile[data-x="${x}"][data-y="${y}"]`);
        if (targetTile) {
            targetTile.classList.add("attacked", isHit ? "hit" : "miss");
            targetTile.textContent = isHit ? "H" : "X";
        }

        if (isHit && player1.gameboard.allShipsSunk()) {
            currentTurn = "gameOver";
            gameOver("Computer");
            return;
        }

        currentTurn = "player1";
        updateStatus("Your turn — attack Enemy board");
    }, 2000);
};

const showPassDeviceModal = (message, onContinue) => {
    const playerBoardContainer = document.getElementById("player-half");
    const enemyBoardContainer = document.getElementById("enemy-half");
    playerBoardContainer.innerHTML = "";
    enemyBoardContainer.innerHTML = "";
    updateStatus("Pass device...");

    const gameContainer = document.getElementById("game-container");
    const modal = document.createElement("div");
    modal.className = "game-over-modal";
    modal.id = "pass-device-modal";

    const title = document.createElement("h2");
    title.textContent = "Pass Device";
    const info = document.createElement("h3");
    info.textContent = message;
    const readyBtn = document.createElement("button");
    readyBtn.className = "menu-btn";
    readyBtn.textContent = "Ready";
    readyBtn.addEventListener("click", () => {
        modal.remove();
        onContinue();
    });

    modal.append(title, info, readyBtn);
    gameContainer.appendChild(modal);
};

const gameOver = (winner) => {
    const gameContainer = document.getElementById("game-container");
    const gameOverModal = document.createElement("div");
    const gameOverText = document.createElement("h2");
    const winnerText = document.createElement("h3");
    const playAgainButton = document.createElement("button");

    gameOverModal.className = "game-over-modal";
    gameOverText.textContent = "Game Over!";
    winnerText.textContent = `${winner} sunk all their opponent's battleships.`;
    playAgainButton.textContent = "Play Again";
    gameOverModal.id = "play-again-modal";
    playAgainButton.id = "play-again-button";

    playAgainButton.addEventListener("click", playAgain);

    gameContainer.classList.add("game-over");
    gameOverModal.append(gameOverText, winnerText, playAgainButton);
    gameContainer.append(gameOverModal);
    updateStatus(`${winner} wins!`);
};

const playAgain = () => {
    const playAgainModal = document.getElementById("play-again-modal");
    const passModal = document.getElementById("pass-device-modal");
    const gameContainer = document.getElementById("game-container");

    gameContainer.classList.remove("game-over");
    if (playAgainModal) playAgainModal.remove();
    if (passModal) passModal.remove();

    player1 = new Player("human");
    player2 = new Player(gameMode === "computer" ? "robot" : "human");
    currentTurn = "setup";
    setupPlayerKey = "player1";
    remainingShips = [...FLEET_LENGTHS];
    currentOrientation = "horizontal";

    populateBoard();
};

populateBoard();