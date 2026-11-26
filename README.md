# Battleship

A browser-based Battleship game built with vanilla JavaScript, Vite, and Jest as part of [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-battleship) curriculum.

## Features

- **Ship Placement:** Place your 5-ship fleet (`5, 4, 3, 3, 2`) by dragging and dropping the ship preview onto your board, clicking tiles directly with a hover preview, rotating between horizontal and vertical, or clicking **Randomize**.
- **vs Computer Mode:** Play against an AI opponent that animates a scanning effect across your board before firing, avoids repeat shots, and targets adjacent tiles after scoring a hit.
- **2-Player Pass-and-Play Mode:** Switch modes anytime to play locally against another person, with a **Pass Device** screen between setup and turns so players can't see each other's boards.
- **Game Over & Reset:** Detects when all ships on either board are sunk, announces the winner, and lets you reset cleanly with **Play Again**.

## Techniques & Architecture

- **Object-Oriented Design & Separation of Concerns:** Game state and rules live in ES module classes ([`Ship`](src/Ship.js), [`Gameboard`](src/gameboard.js), [`Player`](src/player.js)), while [`main.js`](src/main.js) coordinates DOM rendering, turn state, and user events.
- **Test-Driven Development (TDD):** Core game logic (`Ship`, `Gameboard`, `Player`) is unit-tested with **Jest** using Node's `--experimental-vm-modules` flag for native ES module support.
- **Private Class Methods & Encapsulation:** Uses `#` private methods (such as `#createBoard` and `#getShip` in `Gameboard`) to keep internal board helpers out of the public API.
- **Set-Based Move Tracking & Target Queue AI:** Uses a `Set` (`triedMoves`) for $O(1)$ duplicate-shot checks and a `targetQueue` in `Player` (`getCalculatedAttack`) to follow up orthogonally after hits.
- **HTML5 Drag and Drop + Live Previews:** Uses `draggable`, `dragstart`, `dragover`, `dragleave`, and `drop` alongside `mouseenter`/`mouseleave` to preview valid and invalid ship placements directly on the grid.
- **CSS Grid & Flexbox Layout:** Uses Flexbox (`flex-direction: column-reverse`) for bottom-up `(x, y)` board coordinates, `minmax(0, 1fr)` grid tracks to keep placement controls steady across rotations, and CSS state classes (`.attacked`, `.game-over`, `.bot-scanning`) to drive hover and turn feedback.

## Getting Started

```bash
npm install
npm run dev
```

### Run Tests

```bash
npm test
```

### Build for Production

```bash
npm run build
```
