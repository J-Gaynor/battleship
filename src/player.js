import Gameboard from './gameboard';

export default class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
        this.triedMoves = new Set();
    }

    getRandomAttack() {
        let x, y, coordinates;
        do {
            x = Math.floor(Math.random() * this.gameboard.width);
            y = Math.floor(Math.random() * this.gameboard.height);
            coordinates = `${x},${y}`;
        } while (this.triedMoves.has(coordinates));

        this.triedMoves.add(coordinates);
        return [x, y];
    }

    getCalculatedAttack() {

    }
}