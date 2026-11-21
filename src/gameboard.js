import Ship from './Ship';

export default class Gameboard {
    constructor() {
        this.width = 10;
        this.height = 10;
        this.board = this.#createBoard(this.width, this.height);
        this.misses = [];
    }

    #createBoard(width, height) {
        const arr = [];
        for (let i = 0; i < width; i++) {
            arr.push(new Array(height).fill(null));
        }
        return arr;
    }

    placeShip(x, y) {
        this.board[x][y] = new Ship(1);
    }

    #getShip(x, y) {
        if (this.board[x][y]) return this.board[x][y];
    }

    receiveAttack(x, y) {
        const attackedShip = this.#getShip(x, y);
        if (attackedShip) {
            attackedShip.hit();
        } else {
            return this.misses.push([x, y]);
        }
    }
}