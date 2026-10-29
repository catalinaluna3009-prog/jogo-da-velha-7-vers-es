const modeSelect = document.getElementById('mode');
const player2Input = document.getElementById('player2');

const rowsInput = document.getElementById('rows');
const colsInput = document.getElementById('cols');
const winInput = document.getElementById('win');
const gravityInput = document.getElementById('gravity');

const setupSection = document.getElementById('setup');
const gameInfo = document.getElementById('game-info');
const statusElement = document.getElementById('status');
const boardElement = document.getElementById('board');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear-scores');

const player1Input = document.getElementById('player1');
const symbol1Input = document.getElementById('symbol1');
const player2NameInput = document.getElementById('player2');
const symbol2Input = document.getElementById('symbol2');
const startButton = document.getElementById('start');

const matchupElement = document.getElementById('matchup');
const name1Element = document.getElementById('name-1');
const name2Element = document.getElementById('name-2');
const pts1Element = document.getElementById('pts-1');
const pts2Element = document.getElementById('pts-2');
const ptsDrawElement = document.getElementById('pts-draw');

let rows = 6;
let cols = 7;
let winLength = 4;
let gravityMode = false;

let board = [];
let cellElements = [];

let gameActive = false;

let player1Name = 'Jogador 1';
let player1Symbol = 'X';
let player1IsComputer = false;

let player2Name = 'Computador';
let player2Symbol = 'O';
let player2IsComputer = false;

let currentSymbol = '';
let currentPlayerName = '';
let currentPlayerIsComputer = false;

let score1 = 0;
let score2 = 0;
let scoreDraw = 0;

const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
];

modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'PvC') {
        player2NameInput.value = 'Computador';
        player2NameInput.disabled = true;
    } else {
        player2NameInput.disabled = false;
    }
});

function clampWinLength() {
    const maxPossible = Math.max(rows, cols);
    let val = parseInt(winInput.value, 10) || 3;
    if (val > maxPossible) {
        val = maxPossible;
        winInput.value = val;
    }
    winLength = val;
}

// Retorna a linha mais baixa vazia da coluna (modo gravidade) ou null se cheia
function getDropRow(c) {
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r][c] === '') {
            return r;
        }
    }
    return null;
}

function createBoard() {
    boardElement.innerHTML = '';
    boardElement.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    board = [];
    cellElements = [];

    for (let r = 0; r < rows; r++) {
        board[r] = [];
        cellElements[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('button');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
            board[r][c] = '';
            cellElements[r][c] = cell;
        }
    }
}

function iniciarJogo() {
    rows = parseInt(rowsInput.value, 10) || 6;
    cols = parseInt(colsInput.value, 10) || 7;
    clampWinLength();
    gravityMode = gravityInput.checked;

    player1Name = player1Input.value.trim() || 'Jogador 1';
    player1Symbol = symbol1Input.value.trim() || 'X';
    player1IsComputer = false;

    const mode = modeSelect.value;
    if (mode === 'PvC') {
        player2Name = 'Computador';
        player2IsComputer = true;
    } else {
        player2Name = player2NameInput.value.trim() || 'Jogador 2';
        player2IsComputer = false;
    }
    player2Symbol = symbol2Input.value.trim() || 'O';

    if (player1Symbol === player2Symbol) {
        player2Symbol = 'O';
        symbol2Input.value = 'O';
    }

    // Sorteia quem começa a partida
    const comecaJogador1 = Math.random() < 0.5;
    if (comecaJogador1) {
        currentSymbol = player1Symbol;
        currentPlayerName = player1Name;
        currentPlayerIsComputer = player1IsComputer;
    } else {
        currentSymbol = player2Symbol;
        currentPlayerName = player2Name;
        currentPlayerIsComputer = player2IsComputer;
    }

    matchupElement.textContent = `${player1Name} (${player1Symbol}) vs. ${player2Name} (${player2Symbol})`;
    name1Element.textContent = `${player1Name} (${player1Symbol})`;
    name2Element.textContent = `${player2Name} (${player2Symbol})`;
    atualizarPlacarTela();

    createBoard();

    setupSection.style.display = 'none';
    gameInfo.style.display = 'block';
    resetButton.style.display = 'inline-block';

    gameActive = true;
    atualizarStatus();

    if (currentPlayerIsComputer) {
        setTimeout(computerMove, 600);
    }
}

function atualizarStatus() {
    if (!gameActive) return;
    statusElement.textContent = `Vez de ${currentPlayerName} (${currentSymbol})`;
}

function jogar(r, c) {
    if (gravityMode) {
        const dropRow = getDropRow(c);
        if (dropRow === null) {
            return; // coluna cheia
        }
        r = dropRow;
    }

    if (board[r][c] !== '' || !gameActive) {
        return;
    }

    board[r][c] = currentSymbol;
    const cell = cellElements[r][c];
    cell.textContent = currentSymbol;
    cell.disabled = true;

    const winCells = checkWin(currentSymbol);
    if (winCells) {
        winCells.forEach(({ r, c }) => cellElements[r][c].classList.add('winner'));
        mostrarCelebracao();
        statusElement.textContent = `${currentPlayerName} venceu! 🎉`;
        if (currentSymbol === player1Symbol) {
            score1++;
        } else {
            score2++;
        }
        atualizarPlacarTela();
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusElement.textContent = 'Empate! 🤝';
        scoreDraw++;
        atualizarPlacarTela();
        gameActive = false;
        return;
    }

    // Troca de turno
    if (currentSymbol === player1Symbol) {
        currentSymbol = player2Symbol;
        currentPlayerName = player2Name;
        currentPlayerIsComputer = player2IsComputer;
    } else {
        currentSymbol = player1Symbol;
        currentPlayerName = player1Name;
        currentPlayerIsComputer = player1IsComputer;
    }

    atualizarStatus();

    if (currentPlayerIsComputer) {
        setTimeout(computerMove, 600);
    }
}

function handleCellClick(event) {
    if (currentPlayerIsComputer) return;
    const r = Number(event.target.dataset.row);
    const c = Number(event.target.dataset.col);
    jogar(r, c);
}

function computerMove() {
    if (!gameActive) return;

    // Colunas que possuem pelo menos uma célula vazia
    const availableCols = [];
    for (let c = 0; c < cols; c++) {
        if (getDropRow(c) !== null) {
            availableCols.push(c);
        }
    }

    if (availableCols.length === 0) return;

    const c = availableCols[Math.floor(Math.random() * availableCols.length)];
    const r = getDropRow(c);
    jogar(r, c);
}

function checkWin(symbol) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            for (const [dr, dc] of DIRECTIONS) {
                const cellsWin = [];
                let match = true;
                for (let k = 0; k < winLength; k++) {
                    const nr = r + dr * k;
                    const nc = c + dc * k;
                    if (
                        nr < 0 || nr >= rows ||
                        nc < 0 || nc >= cols ||
                        board[nr][nc] !== symbol
                    ) {
                        match = false;
                        break;
                    }
                    cellsWin.push({ r: nr, c: nc });
                }
                if (match) return cellsWin;
            }
        }
    }
    return null;
}

function mostrarCelebracao() {
    const emoji = document.createElement('div');
    emoji.textContent = '🎉';
    emoji.className = 'celebration';
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 2000);
}

function checkDraw() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === '') {
                return false;
            }
        }
    }
    return true;
}

function novoJogo() {
    const comecaJogador1 = Math.random() < 0.5;
    if (comecaJogador1) {
        currentSymbol = player1Symbol;
        currentPlayerName = player1Name;
        currentPlayerIsComputer = player1IsComputer;
    } else {
        currentSymbol = player2Symbol;
        currentPlayerName = player2Name;
        currentPlayerIsComputer = player2IsComputer;
    }

    createBoard();
    gameActive = true;
    atualizarStatus();

    if (currentPlayerIsComputer) {
        setTimeout(computerMove, 600);
    }
}

function zerarPlacar() {
    score1 = 0;
    score2 = 0;
    scoreDraw = 0;
    atualizarPlacarTela();
}

function atualizarPlacarTela() {
    pts1Element.textContent = score1;
    pts2Element.textContent = score2;
    ptsDrawElement.textContent = scoreDraw;
}

startButton.addEventListener('click', iniciarJogo);
resetButton.addEventListener('click', novoJogo);
clearButton.addEventListener('click', zerarPlacar);

// Estado inicial
modeSelect.dispatchEvent(new Event('change'));
statusElement.textContent = 'Configure o jogo e clique em Iniciar.';