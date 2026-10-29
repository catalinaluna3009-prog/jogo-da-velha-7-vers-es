const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const playerXElement = document.getElementById('player-x');
const playerOElement = document.getElementById('player-o');
const resetButton = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let playerXName = 'Jogador 1';
let playerOName = 'Jogador 2';

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

function sortearJogadorX() {
    const ehJogador1 = Math.random() < 0.5;
    if (ehJogador1) {
        playerXName = 'Jogador 1';
        playerOName = 'Jogador 2';
    } else {
        playerXName = 'Jogador 2';
        playerOName = 'Jogador 1';
    }

    playerXElement.textContent = playerXName + ': <strong>X</strong>';
    playerOElement.textContent = playerOName + ': <strong>O</strong>';
}

function atualizarStatus(mensagem) {
    statusElement.textContent = mensagem;
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
        atualizarStatus(`${currentPlayer === 'X' ? playerXName : playerOName} venceu! 🎉`);
        gameActive = false;
        return;
    }

    if (verificarEmpate()) {
        atualizarStatus('Empate! 🤝');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    const nomeAtual = currentPlayer === 'X' ? playerXName : playerOName;
    atualizarStatus(`Vez de ${nomeAtual} (${currentPlayer})`);
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

function reiniciarJogo() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
        cell.disabled = false;
    });

    sortearJogadorX();
    const nomeAtual = currentPlayer === 'X' ? playerXName : playerOName;
    atualizarStatus(`Vez de ${nomeAtual} (${currentPlayer})`);
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', reiniciarJogo);

// Inicialização
sortearJogadorX();
atualizarStatus(`Vez de ${playerXName} (X)`);