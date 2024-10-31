async function main() {
    const pyodide = await loadPyodide();

    // Charger et exécuter le code Python
    await pyodide.loadPackage("numpy");
    const response = await fetch("game.py");
    const pythonCode = await response.text();
    pyodide.runPython(pythonCode);

    // Configurer le canvas et les variables du jeu
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const messageEl = document.getElementById("message");

    function drawBoard(board) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cellSize = canvas.width / 3;

        // Dessiner les lignes de la grille
        for (let i = 1; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, canvas.height);
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(canvas.width, i * cellSize);
            ctx.stroke();
        }

        // Dessiner les X et O
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const centerX = col * cellSize + cellSize / 2;
                const centerY = row * cellSize + cellSize / 2;
                if (board[row][col] === 1) {
                    drawX(centerX, centerY, cellSize / 3);
                } else if (board[row][col] === -1) {
                    drawO(centerX, centerY, cellSize / 3);
                }
            }
        }
    }

    function drawX(x, y, size) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(x - size, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.moveTo(x + size, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.stroke();
    }

    function drawO(x, y, radius) {
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // Configurer le bouton de démarrage du jeu
    document.getElementById("startBtn").addEventListener("click", () => {
        pyodide.runPython("typeOfGame = ask_game_mode()");
        const typeOfGame = pyodide.globals.get("typeOfGame");

        messageEl.textContent = typeOfGame === 1 ? "Mode Joueur vs IA" : "Mode IA vs IA";

        // Exécuter le jeu principal
        const gameResult = pyodide.runPython("tic_tac_toe()");
        messageEl.textContent = gameResult;
    });

    // Gérer les clics de souris pour effectuer les mouvements
    canvas.addEventListener("click", (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const row = Math.floor(y / (canvas.width / 3));
        const col = Math.floor(x / (canvas.width / 3));

        // Passer les coordonnées de clic au script Python
        pyodide.runPython(`play_move(board, ${row}, ${col})`);
        const board = pyodide.globals.get("board").toJs();

        drawBoard(board);

        // Vérifier le gagnant
        const winner = pyodide.runPython("check_winner(board)");
        if (winner !== null) {
            messageEl.textContent = winner === 1 ? "X gagne !" : winner === -1 ? "O gagne !" : "Match nul !";
        }
    });
}

main();
