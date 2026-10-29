const modeSelect = document.getElementById('mode');
const qtyInput = document.getElementById('qty');

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

const playersFields = document.getElementById('players-fields');
const startButton = document.getElementById('start');

const matchupElement = document.getElementById('matchup');
const scoreboardElement = document.getElementById('scoreboard');

let rows = 6;
let cols = 7;
let winLength = 4;
let gravityMode = false;

let board = [];
let cellElements = [];

let gameActive = false;

let players = []; // { nome, simbolo, ehComputador, vitorias }
let currentIndex = 0;

let scoreDraw = 0;

const DIRECTIONS = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1]
];

modeSelect.addEventListener('change', renderPlayerFields);
qtyInput.addEventListener('input', renderPlayerFields);

function defaultSymbolFor(i) {
    const base = ['X', 'O', 'A', 'B', 'C', 'D'];
    return base[i] || String.fromCharCode(65 + i);
}

function renderPlayerFields() {
    const n = parseInt(qtyInput.value, 10) || 2;
    const isPvC = modeSelect.value === 'PvC';

    let html = '';
    for (let i = 0; i < n; i++) {
        const isComputer = isPvC && i > 0;
        html += `
            <div class="player-card">
                <strong>Jogador ${i + 1}</strong>
                <input type="text" id="pname-${i}" placeholder="Nome" maxlength="10" value="Jogador ${i + 1}">
                <input type="text" id="psymb-${i}" placeholder="Símbolo" maxlength="2" value="${defaultSymbolFor(i)}">
                ${isPvC
                    ? `<span class="type-badge">${isComputer ? 'Computador' : 'Humano'}</span>`
                    : `<select id="ptype-${i}">
                          <option value="humano">Humano</option>
                          <option value="computador">Computador</option>
                      </select>`
                }
            </div>
        `;
    }
    playersFields.innerHTML = html;
}

function clampWinLength() {
    const maxPossible = Math.max(rows, cols);
    let val = parseInt(winInput.value, 10) || 3;
    if (val > maxPossible) {
        val = maxPossible;
        winInput.value = val;
    }
    winLength = val;
}

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

function loadPlayers() {
    const n = parseInt(qtyInput.value, 10) || 2;
    const isPvC = modeSelect.value === 'PvC';
    players = [];

    for (let i = 0; i < n; i++) {
        const nome = document.getElementById(`pname-${i}`).value.trim() || `Jogador ${i + 1}`;
        let simbolo = document.getElementById(`psymb-${i}`).value.trim() || defaultSymbolFor(i);

        let ehComputador;
        if (isPvC) {
            ehComputador = i > 0;
        } else {
            ehComputador = document.getElementById(`ptype-${i}`).value === 'computador';
        }

        players.push({ nome, simbolo, ehComputador, vitorias: 0 });
    }

    // Garantir símbolos únicos
    const usados = new Set();
    for (const p of players) {
        let s = p.simbolo;
        let k = 1;
        while (usados.has(s)) {
            s = p.simbolo + k;
            k++;
        }
        p.simbolo = s;
        usados.add(s);
    }
}

function renderScoreboard() {
    scoreboardElement.innerHTML = players.map((p, i) =>
        `<div class="score" id="score-${i}">
            <span id="name-${i}">${p.nome} (${p.simbolo})</span>: <span id="pts-${i}">0</span>
        </div>`
    ).join('');

    // Adiciona o placar de empates ao final
    const drawDiv = document.createElement('div');
    drawDiv.className = 'score';
    drawDiv.id = 'score-draw';
    drawDiv.innerHTML = `<span>Empates</span>: <span id="pts-draw">0</span>`;
    scoreboardElement.appendChild(drawDiv);
}

function atualizarPlacarTela() {
    players.forEach((p, i) => {
        const el = document.getElementById(`pts-${i}`);
        if (el) el.textContent = p.vitorias;
    });
    const drawEl = document.getElementById('pts-draw');
    if (drawEl) drawEl.textContent = scoreDraw;
}

function iniciarJogo() {
    rows = parseInt(rowsInput.value, 10) || 6;
    cols = parseInt(colsInput.value, 10) || 7;
    clampWinLength();
    gravityMode = gravityInput.checked;

    loadPlayers();
    renderScoreboard();
    atualizarPlacarTela();

    // Sorteia quem começa
    currentIndex = Math.floor(Math.random() * players.length);

    matchupElement.textContent = players.map(p => `${p.nome} (${p.simbolo})`).join(' vs. ');

    createBoard();

    setupSection.style.display = 'none';
    gameInfo.style.display = 'block';
    resetButton.style.display = 'inline-block';

    gameActive = true;
    atualizarStatus();

    if (players[currentIndex].ehComputador) {
        setTimeout(computerMove, 600);
    }
}

function atualizarStatus() {
    if (!gameActive) return;
    const p = players[currentIndex];
    statusElement.textContent = `Vez de ${p.nome} (${p.simbolo})`;
}

function jogar(r, c) {
    if (gravityMode) {
        const dropRow = getDropRow(c);
        if (dropRow === null) {
            return;
        }
        r = dropRow;
    }

    if (board[r][c] !== '' || !gameActive) {
        return;
    }

    const p = players[currentIndex];
    board[r][c] = p.simbolo;
    const cell = cellElements[r][c];
    cell.textContent = p.simbolo;
    cell.disabled = true;

    const winCells = checkWin(p.simbolo);
    if (winCells) {
        winCells.forEach(({ r, c }) => cellElements[r][c].classList.add('winner'));
        mostrarCelebracao();
        statusElement.textContent = `${p.nome} venceu! 🎉`;
        p.vitorias++;
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

    currentIndex = (currentIndex + 1) % players.length;
    atualizarStatus();

    if (players[currentIndex].ehComputador) {
        setTimeout(computerMove, 600);
    }
}

function handleCellClick(event) {
    if (players[currentIndex].ehComputador) return;
    const r = Number(event.target.dataset.row);
    const c = Number(event.target.dataset.col);
    jogar(r, c);
}

function computerMove() {
    if (!gameActive) return;

    const availableCols = [];
    for (let c = 0; c < cols; c++) {
        if (getDropRow(c) !== null) {
            availableCols.push(c);
        }
    }

    if (availableCols.length === 0) return;

    const c = availableCols[Math.floor(Math.random() * availableCols.length)];
    const r = gravityMode ? getDropRow(c) : Math.floor(Math.random() * rows);
    // Se não for gravidade, escolhe célula vazia aleatória entre todas vazias
    if (!gravityMode) {
        const empties = [];
        for (let rr = 0; rr < rows; rr++) {
            for (let cc = 0; cc < cols; cc++) {
                if (board[rr][cc] === '') empties.push({ r: rr, c: cc });
            }
        }
        if (empties.length === 0) return;
        const pick = empties[Math.floor(Math.random() * empties.length)];
        jogar(pick.r, pick.c);
        return;
    }

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
    currentIndex = Math.floor(Math.random() * players.length);
    createBoard();
    gameActive = true;
    atualizarStatus();

    if (players[currentIndex].ehComputador) {
        setTimeout(computerMove, 600);
    }
}

function zerarPlacar() {
    players.forEach(p => p.vitorias = 0);
    scoreDraw = 0;
    atualizarPlacarTela();
}

startButton.addEventListener('click', iniciarJogo);
resetButton.addEventListener('click', novoJogo);
clearButton.addEventListener('click', zerarPlacar);

// Estado inicial
renderPlayerFields();
modeSelect.dispatchEvent(new Event('change'));
statusElement.textContent = 'Configure o jogo e clique em Iniciar.';