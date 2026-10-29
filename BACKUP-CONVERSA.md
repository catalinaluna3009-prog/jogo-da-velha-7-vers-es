# Backup da Conversa - Projeto Jogo da Velha 7 Versões

## Resumo
Projeto de Jogo da Velha (Tic-Tac-Toe) com 7 versões evoluídas, desenvolvido em HTML, CSS e JavaScript vanilla, sem bibliotecas ou frameworks. Todo o código está versionado no Git e enviado para o GitHub.

---

## Localização dos arquivos
Pasta principal: `C:/Users/cg305375x/Desktop/myapp/`

---

## Estrutura do projeto
```
myapp/
├── index.html                 # Página inicial (Hello, Pi!)
├── css/style.css              # CSS da página inicial
├── js/script.js               # JS da página inicial (alert "It works...")
├── README.md                  # Documentação do projeto
├── BACKUP-CONVERSA.md         # Este arquivo (backup da conversa)
└── tic-tac-toe/
    ├── v1/
    │   ├── index.html
    │   ├── css/style.css
    │   └── js/script.js
    ├── v2/
    │   ├── index.html
    │   ├── css/style.css
    │   └── js/script.js
    ├── v3/
    │   ├── index.html
    │   ├── css/style.css
    │   └── js/script.js
    ├── v4/
    │   ├── index.html
    │   ├── css/style.css
    │   └── js/script.js
    ├── v5/
    │   ├── index.html
    │   ├── css/style.css
    │   └── js/script.js
    ├── v6/
    │   ├── index.html
    │   ├── css/style.css
    │   └── js/script.js
    └── v7/
        ├── index.html
        ├── css/style.css
        └── js/script.js
```

---

## Detalhes de cada versão

### v1 - Jogo da Velha Básico
- Tabuleiro 3x3
- Modo jogador vs. jogador (PvP)
- O "X" sempre começa a partida
- Sorteio aleatório de qual jogador (1 ou 2) fica com o "X"

### v2 - Nomes e Placar
- Cadastro de nomes dos jogadores (ex.: "Fulano vs. Beltrano")
- Placar de vitórias do Jogador 1, Jogador 2 e empates
- Botão para zerar o placar
- Mantém todas as funcionalidades da v1

### v3 - Símbolos Personalizados
- Cada jogador pode definir seu próprio símbolo (ex.: "A", "✌", emojis via Windows + .)
- Sorteio de quem começa a partida (jogador 1 ou 2)
- Impede símbolos iguais entre os jogadores
- Mantém nomes, placar e modo PvP

### v4 - Modo PvP e PvC
- Seleção de modo: Jogador vs. Jogador (PvP) ou Jogador vs. Computador (PvC)
- Computador faz jogadas aleatórias em células vazias
- No modo PvC, o Jogador 2 é fixo como "Computador"
- Mantém símbolos personalizados, nomes e placar

### v5 - Tabuleiro Personalizável
- Definição de quantidade de linhas e colunas (mínimo 3, máximo 10)
- Definição da sequência vencedora (quantos símbolos conectados para vencer)
- Detecção de vitória horizontal, vertical e nas duas diagonais
- Tabuleiro gerado dinamicamente via JavaScript

### v6 - Modo Gravidade (Connect Four / Lig 4)
- Checkbox para ativar o modo gravidade
- Peças caem até a posição mais baixa disponível da coluna
- Colunas cheias são bloqueadas automaticamente
- Computador escolhe colunas com espaço disponível
- Padrões sugeridos: 6 linhas, 7 colunas, sequência de 4 para vencer

### v7 - Múltiplos Jogadores e Tema Espaço
- Configuração de quantidade de jogadores (2 a 6)
- Cada jogador pode ser Humano ou Computador (modo PvP)
- No modo PvC: Jogador 1 é humano, os demais são computadores
- Turno rotativo entre todos os jogadores
- Símbolos únicos para cada jogador
- Placar individual por jogador e empates
- **Fundo universo Star Wars**: preto com estrelinhas animadas em movimento (starMove + starTwinkle)
- Linha vencedora destacada com fundo verde e brilho
- Emoji de comemoração (🎉) na tela por 2 segundos após vitória

---

## Recursos visuais (CSS de todas as versões)
- Paleta de cores moderna (azul escuro primário, vermelho para danger, verde para sucesso)
- Fundo com gradiente cinza-azulado (v1-v6) ou preto com estrelas (v7)
- Cartão centralizado com sombra e borda arredondada
- Inputs com foco destacado
- Botões com efeito de hover (elevação) e clique (escala)
- Células do tabuleiro responsivas com transições suaves
- Placar em cards individuais
- Media queries para telas menores (celulares)
- Variáveis CSS (`:root`) para fácil ajustes

---

## Funcionalidade de vitória (todas as versões)
- As células que formam a linha vencedora recebem a classe `.winner`
- Fundo verde claro, borda verde e símbolo verde nas células vencedoras
- Emoji `🎉` aparece centralizado na tela por 2 segundos (animação de pop)
- Ao clicar em "Novo Jogo", as classes `.winner` são removidas e o tabuleiro é resetado

---

## Git e GitHub
- Repositório local iniciado em: `C:/Users/cg305375x/Desktop/myapp`
- Primeiro commit local: `d5720e4` - "feat: Jogo da Velha - 7 versões completas"
- Segundo commit: `8dc1c74` - "first commit" (adicionado README.md)
- Branch: `main`
- Repositório remoto: `https://github.com/catalinaluna3009-prog/jogo-da-velha-7-vers-es.git`
- Push realizado com sucesso para o origin/main

### Comandos Git utilizados
```bash
git init
git add -A
git commit -m "feat: Jogo da Velha - 7 versões completas"
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/catalinaluna3009-prog/jogo-da-velha-7-vers-es.git
git push -u origin main
```

---

## Como testar
1. Abra a pasta `C:/Users/cg305375x/Desktop/myapp/tic-tac-toe/`
2. Escolha uma versão (v1 a v7)
3. Abra o arquivo `index.html` dessa versão no navegador
4. Configure os jogadores, símbolos e modo de jogo conforme a versão
5. Clique em "Iniciar Jogo"

---

## Tecnologias utilizadas
- HTML5
- CSS3 (variáveis CSS, flexbox, grid, animações keyframes, media queries)
- JavaScript Vanilla (ES6+, sem bibliotecas ou frameworks)
- Git para versionamento
- GitHub para hospedagem remota

---

## Data do backup
Gerado automaticamente a partir desta conversa.
