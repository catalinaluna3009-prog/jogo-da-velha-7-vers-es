const setupSection = document.getElementById('setup');
const gameInfo = document.getElementById('game-info');
const statusElement = document.getElementById('status');
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear-scores');

const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const startButton = document.getElementById('start');

const matchupElement = document.getElementById('matchup');
const nameXElement = document.getElementById('name-x');
const nameOElement = document.getElementById('name-o');
const ptsXElement = document.getElementById('pts-x');
const ptsOElement = document.getElementById('pts-o');
const ptsDrawElement = document.getElementById('pts-draw');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;

let player1Name = 'Jogador 1';
let player2Name = 'Jogador 2';
let playerXName = player1Name;
let playerOName = player2Name;

let scoreX = 0;
let scoreO = 0;
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

function iniciarJogo() {
    const p1 = player1Input.value.trim();
    const p2 = player2Input.value.trim();

    player1Name = p1 || 'Jogador 1';
    player2Name = p2 || 'Jogador 2';

    sortearJogadorX();

    matchupElement.textContent = `${player1Name} vs. ${player2Name}`;
    atualizarPlacarTela();

    setupSection.style.display = 'none';
    gameInfo.style.display = 'block';
    resetButton.style.display = 'inline-block';

    gameActive = true;
    atualizarStatus();
}

function sortearJogadorX() {
    const ehJogador1 = Math.random() < 0.5;
    if (ehJogador1) {
        playerXName = player1Name;
        playerOName = player2Name;
    } else {
        playerXName = player2Name;
        playerOName = player1Name;
    }

    nameXElement.textContent = playerXName;
    nameOElement.textContent = playerOName;
}

function atualizarPlacarTela() {
    ptsXElement.textContent = scoreX;
    ptsOElement.textContent = scoreO;
    ptsDrawElement.textContent = scoreDraw;
}

function atualizarStatus() {
    if (!gameActive) return;
    const nomeAtual = currentPlayer === 'X' ? playerXName : playerOName;
    statusElement.textContent = `Vez de ${nomeAtual} (${currentPlayer})`;
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer.toLowerCase());
    event.target.disabled = true;

    const winCells = verificarVitoria();
    if (winCells) {
        winCells.forEach(idx => cells[idx].classList.add('winner'));
        mostrarCelebracao();
        const vencedor = currentPlayer === 'X' ? playerXName : playerOName;
        statusElement.textContent = `${vencedor} venceu! 🎉`;
        if (currentPlayer === 'X') scoreX++; else scoreO++;
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

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    atualizarStatus();
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
    currentPlayer = 'X';

    sortearJogadorX();

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
        cell.disabled = false;
    });

    atualizarStatus();
}

function zerarPlacar() {
    scoreX = 0;
    scoreO = 0;
    scoreDraw = 0;
    atualizarPlacarTela();
}

startButton.addEventListener('click', iniciarJogo);
resetButton.addEventListener('click', novoJogo);
clearButton.addEventListener('click', zerarPlacar);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Estado inicial
statusElement.textContent = 'Preencha os nomes e clique em Iniciar Jogo.';