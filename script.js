const gameBoard = (function() {
  let board = Array(9).fill(null);

  function getBoard() { return board };
  function setMark(index, mark) {
    board[index] = mark;
  }
  function resetBoard() {
    board = Array(9).fill(null);
  }

  return { getBoard, setMark, resetBoard };
}) ();

gameBoard.getBoard();
console.log(gameBoard.getBoard());


function player(name, marker) {
  return {
    name,
    marker,
    getName() {
      return `Player: ${name}
Marker: ${marker}`;
    }
  }
}

const displayPlayer = player("Quasar", "O");
console.log(displayPlayer.getName());

