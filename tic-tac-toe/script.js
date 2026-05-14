let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const resetButton = document.getElementById("reset");

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];


cells.forEach(cell => {
  cell.addEventListener("click", handleClick);
});

function handleClick(e) {
  const index = e.target.getAttribute("data-index");

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  checkWinner();
}

function checkWinner() {
  for (let condition of winningConditions) {
    const [a, b, c] = condition;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      cells[a].classList.add("win");
      cells[b].classList.add("win");
      cells[c].classList.add("win");

      statusText.textContent = `Player ${currentPlayer} Wins!`;
      gameActive = false;
      return;
    }
  }

  // Draw check
  if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

// Reset game
resetButton.addEventListener("click", resetGame);

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;

  statusText.textContent = "Player X's Turn";

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win"); 
  });
}