import Gameboard from './gameboard';

export default class Player {
    constructor(type) {
        this.type = type;
        this.gameboard = new Gameboard();
        this.triedMoves = new Set();
        this.targetQueue = [];
    }

    getRandomAttack() {
        while (this.targetQueue.length > 0) {
            const [qx, qy] = this.targetQueue.shift();
            const key = `${qx},${qy}`;
            if (!this.triedMoves.has(key)) {
                this.triedMoves.add(key);
                return [qx, qy];
            }
        }

        let x, y, coordinates;
        do {
            x = Math.floor(Math.random() * this.gameboard.width);
            y = Math.floor(Math.random() * this.gameboard.height);
            coordinates = `${x},${y}`;
        } while (this.triedMoves.has(coordinates));

        this.triedMoves.add(coordinates);
        return [x, y];
    }

    getCalculatedAttack(x, y, isHit) {
        if (!isHit) return;
        const adjacent = [
            [x + 1, y],
            [x - 1, y],
            [x, y + 1],
            [x, y - 1],
        ];
        for (const [nx, ny] of adjacent) {
            if (
                nx >= 0 &&
                nx < this.gameboard.width &&
                ny >= 0 &&
                ny < this.gameboard.height &&
                !this.triedMoves.has(`${nx},${ny}`)
            ) {
                this.targetQueue.push([nx, ny]);
            }
        }
    }
}