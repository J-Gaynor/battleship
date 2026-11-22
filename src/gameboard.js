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
        for (let i = 0; i < width; i++) {
            arr.push(new Array(height).fill(null));
        }
        return arr;
    }

    placeShip(x, y) {
        const newShip = new Ship(1);
        this.board[x][y] = newShip;
        this.ships.push(newShip);
    }

    #getShip(x, y) {
        if (this.board[x][y]) return this.board[x][y];
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