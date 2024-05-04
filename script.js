// script.js

const board = document.getElementById('board');
const counter = document.getElementById('counter');
const resetButton = document.getElementById('resetButton'); // Added reset button reference
const n = 8; // size of the board
let knightPos = [0, 0]; // initial position of the knight
let moveCounter = 1; // initial move counter
let visitedCells = 0; // counter for visited cells
let visited = Array.from({ length: n }, () => Array(n).fill(false)); // track visited cells

function createBoard() {
    board.innerHTML = ''; // Clear existing board
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

            // Apply visited class if the cell has been visited
            if (visited[i][j]) {
                cell.classList.add('visited');
            }

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
    const prevRow = knightPos[0];
    const prevCol = knightPos[1];
    if (visited[row][col]) {
        // Treat the move as invalid if the target cell is already visited
        const invalidCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        invalidCell.classList.add('invalid');
        setTimeout(() => {
            invalidCell.classList.remove('invalid');
        }, 500); // Remove the invalid class after 0.5 seconds
        highlightReachableCells(prevRow, prevCol); // Highlight reachable cells from the previous position
        return;
    }
    visited[prevRow][prevCol] = true; // mark previous cell as visited
    visitedCells++; // increment visited cells counter
    counter.innerHTML = `Cells Visited: <strong>${visitedCells}</strong> out of 64`; // update counter text
    
    // Apply visited class to the previous cell
    const prevCell = document.querySelector(`.cell[data-row="${prevRow}"][data-col="${prevCol}"]`);
    prevCell.classList.add('visited');

    // Remove current class from the previous cell
    prevCell.classList.remove('current');

    knightPos = [row, col];
    
    // Apply current class to the current cell
    const currentCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    currentCell.classList.add('current');

    // Remove highlights before moving knight
    clearHighlightedCells(); 
    const prevKnightCell = document.querySelector('.knight');
    if (prevKnightCell) {
        prevKnightCell.innerHTML = ''; // Remove knight from previous cell
        prevKnightCell.classList.remove('knight'); // Remove knight class from previous cell
    }
    const newKnightCell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    newKnightCell.classList.add('knight'); // Add knight class to the new cell
    const knight = document.createElement('span');
    knight.textContent = '♞'; // Unicode character for knight
    newKnightCell.appendChild(knight);

    // Highlight reachable cells from the new position
    highlightReachableCells(row, col);
    if (document.querySelectorAll('.reachable').length === 0) {
    document.getElementById('gameOverMessage').style.display = 'block';
	}
}

createBoard();
moveKnight(0, 0); // initial position of the knight

// Add event listener for reset button
resetButton.addEventListener('click', () => {
    resetGame();
});

// Function to reset the game
function resetGame() {
    visited = Array.from({ length: n }, () => Array(n).fill(false)); // Reset visited cells
    visitedCells = 0; // Reset visited cells counter
    knightPos = [0, 0]; // Reset knight's position
    counter.innerHTML = `Cells Visited: <strong>${visitedCells}</strong> out of 64`; // Reset counter text
    clearHighlightedCells(); // Clear any highlighted cells
    createBoard(); // Recreate the board
    moveKnight(0, 0); // Move knight to initial position
}
