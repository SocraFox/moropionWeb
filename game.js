const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 200;
const lineColor = '#000';
const xColor = '#C80000';
const oColor = '#0000C8';
let board = Array.from({ length: 3 }, () => Array(3).fill(0));
let currentPlayer = 1;
const EMPTY = 0, PLAYER_X = 1, PLAYER_O = -1, FULL = 0;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 5;
        ctx.stroke();
    }
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const centerX = col * cellSize + cellSize / 2;
            const centerY = row * cellSize + cellSize / 2;
            if (board[row][col] === PLAYER_X) {
                drawX(centerX, centerY);
            } else if (board[row][col] === PLAYER_O) {
                drawO(centerX, centerY);
            }
        }
    }
}

function drawX(centerX, centerY) {
    const offset = 50;
    ctx.strokeStyle = xColor;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(centerX - offset, centerY - offset);
    ctx.lineTo(centerX + offset, centerY + offset);
    ctx.moveTo(centerX + offset, centerY - offset);
    ctx.lineTo(centerX - offset, centerY + offset);
    ctx.stroke();
}

function drawO(centerX, centerY) {
    ctx.strokeStyle = oColor;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
    ctx.stroke();
}

function checkWinner() {
    const lines = [
        [ [0, 0], [0, 1], [0, 2] ], [ [1, 0], [1, 1], [1, 2] ], [ [2, 0], [2, 1], [2, 2] ], // Rows
        [ [0, 0], [1, 0], [2, 0] ], [ [0, 1], [1, 1], [2, 1] ], [ [0, 2], [1, 2], [2, 2] ], // Columns
        [ [0, 0], [1, 1], [2, 2] ], [ [0, 2], [1, 1], [2, 0] ] // Diagonals
    ];
    for (const line of lines) {
        const [a, b, c] = line;
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return board[a[0]][a[1]];
        }
    }
    return board.flat().every(cell => cell !== EMPTY) ? FULL : null;
}

function handleClick(event) {
    const col = Math.floor(event.offsetX / cellSize);
    const row = Math.floor(event.offsetY / cellSize);
    if (board[row][col] !== EMPTY || checkWinner()) return;
    board[row][col] = currentPlayer;
    currentPlayer *= -1;
    drawBoard();
    const winner = checkWinner();
    const messageEl = document.getElementById("message");
    if (winner === PLAYER_X) messageEl.textContent = "Le joueur X a gagné !";
    else if (winner === PLAYER_O) messageEl.textContent = "Le joueur O a gagné !";
    else if (winner === FULL) messageEl.textContent = "Match nul !";
}

canvas.addEventListener('click', handleClick);
drawBoard();
