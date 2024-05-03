// script.js

const board = document.getElementById('board');
const n = 8; // size of the board
let knightPos = [0, 0]; // initial position of the knight
let moveCounter = 1; // initial move counter
const visited = Array.from({ length: n }, () => Array(n).fill(false)); // track visited cells

function createBoard() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', () => {
                const row = parseInt(cell.dataset.row);
                const col = parseInt(cell.dataset.col);
                if (isValidMove(knightPos[0], knightPos[1], row, col)) {
                    moveKnight(row, col);
                } else {
                    cell.classList.add('invalid');
                    setTimeout(() => {
                        cell.classList.remove('invalid');
                    }, 500); // Remove the invalid class after 0.5 seconds
                }
            });

            board.appendChild(cell);
        }
    }
}

function isValidMove(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
}

function highlightReachableCells(row, col) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const rowDiff = Math.abs(row - parseInt(cell.dataset.row));
        const colDiff = Math.abs(col - parseInt(cell.dataset.col));
        if ((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2)) {
            const cellRow = parseInt(cell.dataset.row);
            const cellCol = parseInt(cell.dataset.col);
            if (!visited[cellRow][cellCol]) {
                cell.classList.add('reachable');
            }
        }
    });
}

function clearHighlightedCells() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('reachable', 'current', 'invalid'); // Remove all added classes
    });
}

function moveKnight(row, col) {
    clearHighlightedCells();
    highlightReachableCells(row, col);
    knightPos = [row, col];
    visited[row][col] = true; // mark cell as visited
    const prevKnightCell = document.querySelector('.knight');
    if (prevKnightCell) {
        prevKnightCell.innerHTML = ''; // Remove knight from previous cell
        prevKnightCell.classList.remove('knight');
    }
    const newKnightCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    newKnightCell.classList.add('knight', 'current'); // Add both classes
    const knight = document.createElement('span');
    knight.textContent = '♞'; // Unicode character for knight
    newKnightCell.appendChild(knight);
}

createBoard();
moveKnight(0, 0); // initial position of the knight
