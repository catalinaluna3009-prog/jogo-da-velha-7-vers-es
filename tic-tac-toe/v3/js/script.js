const setupSection = document.getElementById('setup');
const gameInfo = document.getElementById('game-info');
const statusElement = document.getElementById('status');
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const clearButton = document.getElementById('clear-scores');

const player1Input = document.getElementById('player1');
const symbol1Input = document.getElementById('symbol1');
const player2Input = document.getElementById('player2');
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
let player2Name = 'Jogador 2';
let player2Symbol = 'O';

let currentSymbol = '';
let currentPlayerName = '';

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

function iniciarJogo() {
    player1Name = player1Input.value.trim() || 'Jogador 1';
    player2Name = player2Input.value.trim() || 'Jogador 2';
    player1Symbol = symbol1Input.value.trim() || 'X';
    player2Symbol = symbol2Input.value.trim() || 'O';

    // Evitar símbolos iguais
    if (player1Symbol === player2Symbol) {
        player2Symbol = 'O';
        symbol2Input.value = 'O';
    }

    // Sortear quem começa a partida
    const comecaJogador1 = Math.random() < 0.5;
    if (comecaJogador1) {
        currentSymbol = player1Symbol;
        currentPlayerName = player1Name;
    } else {
        currentSymbol = player2Symbol;
        currentPlayerName = player2Name;
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
}

function atualizarStatus() {
    if (!gameActive) return;
    statusElement.textContent = `Vez de ${currentPlayerName} (${currentSymbol})`;
}

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentSymbol;
    event.target.textContent = currentSymbol;
    event.target.disabled = true;

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
    } else {
        currentSymbol = player1Symbol;
        currentPlayerName = player1Name;
    }

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

    // Sorteia novamente quem começa
    const comecaJogador1 = Math.random() < 0.5;
    if (comecaJogador1) {
        currentSymbol = player1Symbol;
        currentPlayerName = player1Name;
    } else {
        currentSymbol = player2Symbol;
        currentPlayerName = player2Name;
    }

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
        cell.disabled = false;
    });

    atualizarStatus();
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
statusElement.textContent = 'Preencha os nomes e símbolos, depois clique em Iniciar Jogo.';