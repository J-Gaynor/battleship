import Ship from './Ship';

describe("Makes a ship class", () => {
    it("Returns an object type with specified length.", () => {
        const test = new Ship(3);
        expect(typeof test).toBe("object");
        expect(test.length).toBe(3);
    })
})


describe("Has working methods", () => {
    it("Tracks hits.", () => {
        const test = new Ship(3);
        test.hit();
        expect(test.hits).toBe(1);
    })

    it("Sinks when hits equal length", () => {
        const testA = new Ship(3);
        const testB = new Ship(5);
        for (let i = 0; i < 3; i++) {
            testA.hit();
            testB.hit();
        }
        expect(testA.sunk).toBe(true);
        expect(testB.sunk).toBe(false);
    })
})