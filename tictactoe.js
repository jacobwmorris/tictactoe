const Player = function(name, char) {
    return {name, char};
};

const GameBoard = (function() {
    const boardValues = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
    let playerX = {};
    let playerO = {};
    let currentPlayer = null;
    let gameFinished = false;

    const newGame = () => {
        playerX = Player("test1", "x");
        playerO = Player("test2", "o");
        currentPlayer = playerX;

        setBoardPlayer(currentPlayer);
    };

    const setBoardPlayer = (player) => {
        const board = document.querySelector(".game-board");

        if (!player) {
            console.log("made it");
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

    const getSquareClickFunc = (num) => {
        return function(event) {
            if (gameFinished)
                return;
            if (this.classList.contains("x-inside") || this.classList.contains("o-inside"))
                return;

            boardValues[num] = currentPlayer.char;

            //check for winners
            if (checkWinner(currentPlayer)) {
                console.log("The winner is: " + currentPlayer.name);
                setBoardPlayer();
                gameFinished = true;
            }
            else {
                switchPlayers();
            }
            display();
        };
    };

    const startup = () => {
        const squares = document.querySelectorAll(".board-square");

        let n = 0;
        for (const square of squares) {
            square.addEventListener("click", getSquareClickFunc(n), true);
            n++;
        }

        newGame();
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

    return {startup, display};
})();

GameBoard.startup();
