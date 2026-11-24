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
        const newShip = new Ship(length);

        for (let i = 0; i < length; i++) {
            if (orientation === "horizontal") {
                this.board[y][x + i] = newShip;
            } else {
                this.board[y + i][x] = newShip;
            }
        }
        this.ships.push(newShip);
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