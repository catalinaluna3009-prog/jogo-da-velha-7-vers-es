const modeSelect = document.getElementById('mode');
const player2Input = document.getElementById('player2');

const setupSection = document.getElementById('setup');
const gameInfo = document.getElementById('game-info');
const statusElement = document.getElementById('status');
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear-scores');

const player1Input = document.getElementById('player1');
const symbol1Input = document.getElementById('symbol1');
const symbol2Input = document.getElementById('symbol2');
const startButton = document.getElementById('start');

const matchupElement = document.getElementById('matchup');
const name1Element = document.getElementById('name-1');
const name2Element = document.getElementById('name-2');
const pts1Element = document.getElementById('pts-1');
const pts2Element = document.getElementById('pts-2');
const ptsDrawElement = document.getElementById('pts-draw');

let board = ['', '', '', '', '', '', '', '', ''];
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

modeSelect.addEventListener('change', () => {
    if (modeSelect.value === 'PvC') {
        player2Input.value = 'Computador';
        player2Input.disabled = true;
    } else {
        player2Input.disabled = false;
    }
});

function iniciarJogo() {
    const mode = modeSelect.value;

    player1Name = player1Input.value.trim() || 'Jogador 1';
    player1Symbol = symbol1Input.value.trim() || 'X';
    player1IsComputer = false;

    if (mode === 'PvC') {
        player2Name = 'Computador';
        player2IsComputer = true;
    } else {
        player2Name = player2Input.value.trim() || 'Jogador 2';
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

function jogar(index) {
    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentSymbol;
    const cell = cells[index];
    cell.textContent = currentSymbol;
    cell.disabled = true;

    const winCells = verificarVitoria();
    if (winCells) {
        winCells.forEach(idx => cells[idx].classList.add('winner'));
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

    if (verificarEmpate()) {
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
    const index = event.target.getAttribute('data-index');
    jogar(Number(index));
}

function computerMove() {
    if (!gameActive) return;

    const emptyIndices = board
        .map((cell, i) => (cell === '' ? i : null))
        .filter(i => i !== null);

    if (emptyIndices.length === 0) return;

    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    jogar(randomIndex);
}

function verificarVitoria() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] !== '' &&
            board[a] === board[b] &&
            board[a] === board[c]) {
            return condition;
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

function verificarEmpate() {
    return board.every(cell => cell !== '');
}

function novoJogo() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;

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

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
        cell.disabled = false;
    });

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

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Estado inicial
modeSelect.dispatchEvent(new Event('change'));
statusElement.textContent = 'Configure o jogo e clique em Iniciar.';