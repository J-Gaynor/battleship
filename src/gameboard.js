import Ship from './Ship';

export default class Gameboard {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.board = this.#createBoard(this.width, this.height);
        this.misses = [];
        this.ships = [];
    }

    #createBoard(width, height) {
        const arr = [];
        for (let i = 0; i < height; i++) {
            arr.push(new Array(width).fill(null));
        }
        return arr;
    }

    placeShip(x, y, length = 1, orientation = "horizontal") {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return false;
        }
        if (orientation === "horizontal" && x + length > this.width) {
            return false;
        }
        if (orientation === "vertical" && y + length > this.height) {
            return false;
        }

        for (let i = 0; i < length; i++) {
            const checkX = orientation === "horizontal" ? x + i : x;
            const checkY = orientation === "vertical" ? y + i : y;
            if (this.board[checkY][checkX] instanceof Ship) {
                return false;
            }
        }

        const newShip = new Ship(length);

        for (let i = 0; i < length; i++) {
            if (orientation === "horizontal") {
                this.board[y][x + i] = newShip;
            } else {
                this.board[y + i][x] = newShip;
            }
        }
        this.ships.push(newShip);
        return true;
    }

    placeRandomShips(lengths = [5, 4, 3, 3, 2]) {
        for (const length of lengths) {
            let placed = false;
            while (!placed) {
                const x = Math.floor(Math.random() * this.width);
                const y = Math.floor(Math.random() * this.height);
                const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
                placed = this.placeShip(x, y, length, orientation);
            }
        }
    }

    #getShip(x, y) {
        if (this.board[y][x]) return this.board[y][x];
    }

    receiveAttack(x, y) {
        const attackedShip = this.#getShip(x, y);
        if (attackedShip) {
            attackedShip.hit();
            return true
        } else {
            this.misses.push([x, y]);
            return false;
        }
    }

    allShipsSunk() {
        const sunkShips = this.ships.filter(ship => ship.sunk === true);
        if (this.ships.length > 0 && sunkShips.length === this.ships.length) return true;
        return false;
    }
}