const boardElement = document.getElementById("board");
const resetBtnElement = document.getElementById("reset");

resetBtnElement.onclick = () => {
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }
  resetBtnElement.textContent = "🙂";
  board = generateBoard();
  generateBombs(board);
  addAdjacentBombsNumber(board);
  createCovers(board);
};

const ROWS = 9;
const COLS = 9;
const NUMBER_OF_BOMBS = 10;

const numberColorMap = {
  1: "blue",
  2: "green",
  3: "red",
};

// Generate board
function generateBoard() {
  const cells = [];

  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLS; j++) {
      row.push(Cell([i, j]));
    }
    cells.push(row);
  }

  return cells;
}

let board = generateBoard();
generateBombs(board);
addAdjacentBombsNumber(board);

//  Generate bombs at random
function generateBombs(board) {
  const bombCoords = [];
  for (let i = 0; i < NUMBER_OF_BOMBS; i++) {
    let randomNum = Math.floor(Math.random() * (ROWS * COLS));
    let x = Math.floor(randomNum / COLS);
    let y = randomNum % COLS;
    bombCoords.push([x, y]);
  }
  //  Add bombs to board
  for (let [x, y] of bombCoords) {
    board[x][y].textContent = "💣";
  }
}

// Check if neighboor is in bounds
function isInBounds([row, col]) {
  return row < 0 || col < 0 || row > ROWS - 1 || col > COLS - 1 ? false : true;
}

//  Calculate neighbors
function getNeighbors(coord) {
  let [row, col] = coord;

  let neighbors = [
    [row - 1, col - 1],
    [row - 1, col],
    [row - 1, col + 1],
    [row, col - 1],
    [row, col + 1],
    [row + 1, col - 1],
    [row + 1, col],
    [row + 1, col + 1],
  ];

  return neighbors.filter(isInBounds);
}

// Calculate number of adjacent bombs
function numberOfAdjacentBombs([row, col]) {
  let bombs = 0;
  let neighbors = getNeighbors([row, col]);
  for (let [x, y] of neighbors) {
    if (board[x][y].textContent == "💣") bombs++;
  }
  return bombs;
}

function addAdjacentBombsNumber(board) {
  //  Modify board to include # of adjacent bombs
  for (let k = 0; k < board.length; k++) {
    let row = board[k];
    for (let l = 0; l < row.length; l++) {
      let numBombs = numberOfAdjacentBombs([k, l]);
      let cell = board[k][l];
      let isBomb = cell.textContent == "💣";
      cell.textContent = isBomb ? "💣" : numBombs > 0 ? numBombs : "";
      cell.style.color = numberColorMap[cell.textContent] || "black";
    }
  }
}

function revealCell(cell) {
  cell.children[0].style.visibility = "hidden";
  if (cell.textContent == "💣") {
    revealBoard(board);
    resetBtnElement.textContent = "😵";
    cell.style.background = "red";
  }
  if (cell.textContent == "") propagateReveal(cell, new Set());
}

function coordToKey([row, col]) {
  return `${row}-${col}`;
}

function propagateReveal(cell, visited) {
  if (cell.textContent == "") {
    cell.children[0].style.visibility = "hidden";
    visited.add(cell.key);
    for (let [x, y] of getNeighbors(cell.coord)) {
      if (!visited.has(coordToKey([x, y]))) {
        propagateReveal(board[x][y], visited);
      }
    }
  }
}

function Cell([row, col]) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.key = `${row}-${col}`;
  cell.coord = [row, col];

  boardElement.appendChild(cell);

  return cell;
}

function createCovers(board) {
  for (let row of board) {
    for (let column of row) {
      const cover = document.createElement("button");
      cover.className = "cover";
      cover.onclick = (_) => revealCell(column);

      column.appendChild(cover);
    }
  }
}

createCovers(board);

function revealBoard(board) {
  for (let row of board) {
    for (let column of row) {
      column.children[0].style.visibility = "hidden";
    }
  }
}
