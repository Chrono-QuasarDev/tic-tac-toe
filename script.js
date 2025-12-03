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

  return { render };
})();

displayController.render(gameBoard.getBoard());
console.log(gameBoard.getBoard());

const gameController = (function() {
  let currentPlayer = null;
  let isGameOver = false;
  let winner = null;
  let players = [];

  function startGame(player1, player2) {
    players = [player1, player2];
    currentPlayer = players[0];
    isGameOver = false;
    winner = null;
    console.log(`Game started. Current player: ${currentPlayer.name} (${currentPlayer.marker})`);
  }

  function checkWinner() {
    const board = gameBoard.getBoard();
    const winPatterns = [
      [0, 1, 1],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;    
      
      if (
        board[a] !== null &&
        board[a] === board[b] && 
        board[b] === board[c]
      ) {
        gameBoard.resetBoard();
        return board[a];
      }

      if (!board.includes(null)) {
        return "Tie";
      }
    }
    return null;
  }

  function playTurn(index) {
    if (isGameOver === true) {
      console.log('Game is already over');
      return;
    }
    
    const setMarkResult = gameBoard.setMark(index, currentPlayer.marker);
    displayController.render(gameBoard.getBoard());

    if (setMarkResult !== true) {
      console.log("Invalid move:", setMarkResult)
    }
    

    const result = checkWinner();
    if (result === "Tie") {
      console.log("It's a tie");
      isGameOver = true;
      return
    }

    if (result === currentPlayer.marker) {
      console.log(`${currentPlayer.name} wins`);
      isGameOver = true;
      winner = currentPlayer;
      return;
    }

    if (setMarkResult) {
      currentPlayer = (currentPlayer === players[0] ? players[1] : players[0]);
      console.log(`Board updated. Next player: ${currentPlayer.name} (${currentPlayer.marker})`);
      console.log("Current Board:", gameBoard.getBoard());
    } else {
      console.log(`Turn failed for ${currentPlayer.name}: ${currentPlayer.marker}`);
    }
  }

  return { startGame, playTurn }
})();

const player1 = player("Quasar", "X");
const player2 = player("HaxTech", "O");
gameController.startGame(player1, player2);
// gameController.playTurn(0);
// gameController.playTurn(1);
// gameController.playTurn(2);
// gameController.playTurn(3);
// gameController.playTurn(4);
// gameController.playTurn(5);
// gameController.playTurn(6);
// gameController.playTurn(7);
// gameController.playTurn(8);
// gameController.playTurn(8);
