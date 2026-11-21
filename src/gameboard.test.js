import Gameboard from './gameboard';
import Ship from './Ship';

describe("Makes a gameboard class", () => {
    it("Returns an object type witha. 10x10 gameboard", () => {
        const test = new Gameboard();
        expect(test.board.length).toBe(10);
        for (const row of test.board) {
            expect(row.length).toBe(10);
        }
    })

    it("Places a ship", () => {
        const test = new Gameboard();
        test.placeShip(1, 1);
        expect(test.board[0][1]).toBe(null);
        expect(test.board[1][1]).toBeInstanceOf(Ship);
    })

    it("Receives attacks at coordinates and handles hitting a ship", () => {
        const testBoard = new Gameboard();
        testBoard.placeShip(1, 1);
        const testShip = testBoard.board[1][1];
        testBoard.receiveAttack(1, 1);
        testBoard.receiveAttack(0, 1);
        expect(testShip.hits).toBe(1);
        expect(testBoard.misses).toContainEqual([0, 1]);
    })
})