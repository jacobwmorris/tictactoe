const Player = function(name, char) {
    return {name, char};
};

const GameBoard = (function() {
    const boardValues = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
    const statusMessage = document.querySelector(".status-box > p");
    let playerX = {};
    let playerO = {};
    let currentPlayer = null;
    let gameFinished = true;

    const reset = (event) => {
        while(statusMessage.children.length > 0) {
            console.log(statusMessage.children);
            console.log(statusMessage.firstChild);
            statusMessage.removeChild(statusMessage.firstChild);
        }
        statusMessage.textContent = "Enter the players names to start.";
        statusMessage.setAttribute("class", "");
        
        playerX = {};
        playerO = {};
        currentPlayer = null;
        gameFinished = true;
        
        document.querySelector("form").classList.remove("hidden");
    }

    const newGame = (event) => {
        const p1name = document.querySelector("#player1-name").value;
        const p2name = document.querySelector("#player2-name").value;
        playerX = Player(p1name, "x");
        playerO = Player(p2name, "o");
        currentPlayer = playerX;

        setBoardPlayer(currentPlayer);
        statusMessage.textContent = `It is now ${currentPlayer.name}'s turn.`;
        gameFinished = false;
        for (let n = 0; n < 9; n++)
            boardValues[n] = "-";
        
        display();

        document.querySelector("form").classList.add("hidden");
        event.preventDefault();
    };

    const setBoardPlayer = (player) => {
        const board = document.querySelector(".game-board");

        if (!player) {
            board.setAttribute("data-current-player", "");
            return;
        }
        board.setAttribute("data-current-player", player.char);
    }

    const switchPlayers = () => {
        if (currentPlayer === playerX) {
            currentPlayer = playerO;
        }
        else {
            currentPlayer = playerX;
        }

        setBoardPlayer(currentPlayer);
        statusMessage.textContent = `It is now ${currentPlayer.name}'s turn.`;
    }

    const boardAt = (x, y) => {
        return boardValues[x + y * 3];
    }

    const checkWinnerRow = (row, player) => {
        for (let col = 0; col < 3; col++) {
            if (boardAt(col, row) !== player.char)
                return false;
        }
        return true;
    }

    const checkWinnerCol = (col, player) => {
        for (let row = 0; row < 3; row++) {
            if (boardAt(col, row) !== player.char)
                return false;
        }
        return true;
    }

    const checkWinnerDiag = (diag, player) => {
        if (diag === 0) {
            for (let n = 0; n < 3; n++) {
                if (boardAt(n, n) !== player.char)
                    return false;
            }
            return true;
        }
        
        for (let x = 0, y = 2; x < 3; x++, y--) {
            if (boardAt(x, y) !== player.char)
                return false;
        }
        return true;
    }

    const checkWinner = (player) => {
        for (let row = 0; row < 3; row++) {
            if (checkWinnerRow(row, player)) {
                return true;
            }
        }
        for (let col = 0; col < 3; col++) {
            if (checkWinnerCol(col, player)) {
                return true;
            }
        }
        if (checkWinnerDiag(0, player) || checkWinnerDiag(1, player))
            return true;
        
        return false;
    }

    const boardFilled = () => {
        return !boardValues.some(val => val === "-");
    }

    const setTieMessage = () => {
        statusMessage.textContent = "";
        const m1 = document.createElement("span");
        const m2 = document.createElement("span");
        const m3 = document.createElement("span");
        m1.textContent = "It's a tie! You're both ";
        m2.textContent = "winners";
        m2.setAttribute("style", "text-decoration: line-through;");
        m3.textContent = " losers!";
        statusMessage.appendChild(m1);
        statusMessage.appendChild(m2);
        statusMessage.appendChild(m3);
    }

    const setWinMessage = () => {
        statusMessage.textContent = `The winner is ${currentPlayer.name}! Congratulations!`;
        if (currentPlayer === playerX) {
            statusMessage.classList.add("redtext");
        }
        else {
            statusMessage.classList.add("bluetext");
        }
    }

    const turn = () => {
        if (checkWinner(currentPlayer)) {
            setWinMessage();
            setBoardPlayer();
            gameFinished = true;
        }
        else if (boardFilled()) {
            setTieMessage();
            setBoardPlayer();
            gameFinished = true;
        }
        else {
            switchPlayers();
        }
        display();
    }

    const getSquareClickFunc = (num) => {
        return function(event) {
            if (gameFinished)
                return;
            if (this.classList.contains("x-inside") || this.classList.contains("o-inside"))
                return;

            boardValues[num] = currentPlayer.char;

            turn();
        };
    };

    const startup = () => {
        const squares = document.querySelectorAll(".board-square");

        let n = 0;
        for (const square of squares) {
            square.addEventListener("click", getSquareClickFunc(n), true);
            n++;
        }

        document.querySelector("#start-button").addEventListener("click", newGame);
        document.querySelector("#reset-button").addEventListener("click", reset);
    };

    const setSquareClass = (square, value) => {
        if (value === "x") {
            square.classList.add("x-inside");
            square.classList.remove("o-inside");
            return;
        }
        if (value === "o") {
            square.classList.remove("x-inside");
            square.classList.add("o-inside");
            return;
        }
        square.classList.remove("x-inside");
        square.classList.remove("o-inside");
    };

    const display = () => {
        const squares = document.querySelectorAll(".board-square");

        let n = 0;
        for (const square of squares) {
            setSquareClass(square, boardValues[n]);
            n++;
        }
    };

    return {startup};
})();

GameBoard.startup();
