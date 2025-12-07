const gameBoard = (function() {
  let board = Array(9).fill(null);
  //let board = ["X", "O", "X", "O", "X", "O", "X", "O", "X"]

  function getBoard() { return board };
  function setMark(index, mark) {
    if (index < 0 || index >= board.length) {
      const error = "Invalid input. Input is out of bound(0-8)";
      console.log(error);
      return false;
    }

    if (board[index] !== null) {
      const error =  `Invalid Input: Cell at index ${index} is already filled with '${board[index]}'.`;
      console.log(error);
      return false;
    }
    board[index] = mark;
    return true;
  }

  function resetBoard() {
    board = Array(9).fill(null);
  }

  return { getBoard, setMark, resetBoard };
}) ();


function player(name, marker) {
  return { name, marker }
}

// Module to display the game on the page and allow user to add marks to the board
const displayController = (() => {
  const boardContainer = document.getElementById("board");
  const currentPlayerEl = document.getElementById("current-player");
  const gameStatusEl = document.getElementById("game-status");

  const render = (board) => {
    boardContainer.innerHTML = "";

    board.forEach((cell, index) => {
      const cellEl = document.createElement("div");
      cellEl.classList.add("cell");
      cellEl.textContent = cell;
      
      cellEl.addEventListener("click", (event) => {
        gameController.playTurn(index);
      });
      boardContainer.appendChild(cellEl);
    });
  }

  const updateStatus = (playerName, statusText) => {
    currentPlayerEl.textContent = playerName || "--";
    gameStatusEl.textContent = statusText;
  }

  const blinkWinningCells = (pattern) => {
    const cells = boardContainer.querySelectorAll(".cell");
    pattern.forEach(index => {
      const cell = cells[index];
      cell.classList.add("blink");
    })
  }

  return { render, updateStatus, blinkWinningCells };
})();

displayController.render(gameBoard.getBoard());
console.log(gameBoard.getBoard());

const gameController = (function() {
  let currentPlayer = null;
  let isGameOver = false;
  let winner = null;
  let players = [];

  function startGame() {
    const getPlayer1El = document.getElementById("player1");
    const getPlayer2El = document.getElementById("player2");

    const name1 = getPlayer1El.value.trim();
    const name2 = getPlayer2El.value.trim();

    if (!name1 || !name2) {
      alert("Please enter both player names");
      return;
    } 
    
    const player1 = player(name1, "X");
    const player2 = player(name2, "O");

    players = [player1, player2];
    currentPlayer = players[0];
    isGameOver= false;
    winner = false;
    gameBoard.resetBoard();

    displayController.render(gameBoard.getBoard());
    displayController.updateStatus(currentPlayer.name, "Game start!");
  }

  function restartGame() {
    gameBoard.resetBoard();
    currentPlayer = null;
    players = [];
    isGameOver = false;
    winner = null;
    
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";

    displayController.render(gameBoard.getBoard());
    displayController.updateStatus("--", "Ready");

    // Optionally remove any lingering blink classes
    document.querySelectorAll(".cell.blink").forEach(el => el.classList.remove("blink"));
  }

  function checkWinner() {
    const board = gameBoard.getBoard();
    const winPatterns = [
      [0, 1, 2],[3, 4, 5],[6, 7, 8],
      [0, 3, 6],[1, 4, 7],[2, 5, 8],
      [0, 4, 8],[2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;    
      if (board[a] !== null && board[a] === board[b] && board[b] === board[c]) {
        return { winner: board[a], pattern};
      }
    }
    
    if (!board.includes(null)) {
      return { winner: "Tie", pattern: [] };
    }

    return null;
  }

  function playTurn(index) {
    if (isGameOver === true) {
      console.log('Game is already over');
      return;
    }
    
    const setMarkResult = gameBoard.setMark(index, currentPlayer.marker);
    
    if (setMarkResult !== true) {
      displayController.updateStatus(currentPlayer.name, "Invalid move");
      return
    }
    

    displayController.render(gameBoard.getBoard());


    const result = checkWinner();

    if (result) {

      const actualWinner = players.find(p => p.marker === result.winner);

      if (result.winner === "Tie") {
        displayController.updateStatus("--", "It's a tie");
        isGameOver = true;
      } else if (actualWinner) {
        winner = actualWinner;
        displayController.updateStatus(winner.name, `${winner.name} wins`);
        displayController.blinkWinningCells(result.pattern);
        isGameOver = true
      }
      return;
    }


    currentPlayer = (currentPlayer === players[0] ? players[1] : players[0]);
    console.log(`Board updated. Next player: ${currentPlayer.name} (${currentPlayer.marker})`);
    displayController.updateStatus(currentPlayer.name, "Ongoing");
  }

  return { startGame, playTurn, restartGame }
})();

const UIEvents = (() => {
  document.getElementById("start").addEventListener("click", () => {
    gameController.startGame();
  });

  document.getElementById("restart").addEventListener("click", () => {
    gameController.restartGame();
  });
})();



