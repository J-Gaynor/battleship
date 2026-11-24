import Player from './player';
import Gameboard from './gameboard';

describe("Makes a player class", () => {
    it("creates robot and human players", () => {
        const robot = new Player("robot");
        const human = new Player("human");
        expect(robot.type).toBe("robot");
        expect(human.type).toBe("human");
    });

    it("differentiates human and robot boards", () => {
        const robot = new Player("robot");
        const human = new Player("human");
        expect(robot.gameboard).toBeInstanceOf(Gameboard);
        expect(robot.gameboard).not.toBe(human.gameboard);
    })
});