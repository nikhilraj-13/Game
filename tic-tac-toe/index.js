let player1 =prompt("enter your name:");
console.log(player1);
let player2 =prompt("enter your name:");
console.log(player2);
const boxes = document.querySelectorAll(".box");



const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');

let gameBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Load game state from local storage
function loadGameState() {
    const savedBoard = localStorage.getItem('ticTacToeBoard');
    const savedPlayer = localStorage.getItem('ticTacToePlayer');
    const savedActive = localStorage.getItem('ticTacToeActive');

    if (savedBoard) {
        gameBoard = JSON.parse(savedBoard);
        cells.forEach((cell, index) => {
            cell.textContent = gameBoard[index];
        });
    }
    if (savedPlayer) {
        currentPlayer = savedPlayer;
    }
    if (savedActive !== null) {
        gameActive = JSON.parse(savedActive);
    }
    updateStatus();
    checkWinOrDraw(); // Check for win/draw immediately after loading
}

// Save game state to local storage
function saveGameState() {
    localStorage.setItem('ticTacToeBoard', JSON.stringify(gameBoard));
    localStorage.setItem('ticTacToePlayer', currentPlayer);
    localStorage.setItem('ticTacToeActive', JSON.stringify(gameActive));
}

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameBoard[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    saveGameState();
    checkWinOrDraw();
}

function checkWinOrDraw() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameBoard[winCondition[0]];
        let b = gameBoard[winCondition[1]];
        let c = gameBoard[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusMessage.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        saveGameState();
        return;
    }

    let roundDraw = !gameBoard.includes('');
    if (roundDraw) {
        statusMessage.textContent = `It's a draw!`;
        gameActive = false;
        saveGameState();
        return;
    }

    changePlayer();
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
    saveGameState();
}

function updateStatus() {
    if (gameActive) {
        statusMessage.textContent = `It's ${currentPlayer}'s turn`;
    }
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusMessage.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');
    localStorage.removeItem('ticTacToeBoard');
    localStorage.removeItem('ticTacToePlayer');
    localStorage.removeItem('ticTacToeActive');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Initial load of game state
loadGameState();