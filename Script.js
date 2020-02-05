// BOARD IS COL-ROW
let gameBoard = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
let blueTurn = true;
let userGameStats = {
  userPlaying: true,
  round: 0,
  winner: null,
}

// UI functions
function onload() {
  buildBoard();
}

function buildBoard() {
  const playArea = document.getElementById("playArea");
  playArea.innerHTML = "";
  let col, square;
  for (let colNum=0; colNum<7; colNum++) {
    col = document.createElement('div');
    col.classList.add("column");
    col.setAttribute('onclick', 'columnClicked('+colNum+')')
    for(let row=0; row<6; row++) {
      square = document.createElement('div');
      square.classList.add("square");
      square.setAttribute("id", colNum+""+row)
      col.appendChild(square);
    }
    playArea.appendChild(col);
  }
}

function updateView(board) {
  for (let col=0; col<7; col++) {
    for (let row=0; row<6; row++) {
      if(board[col][row] == 1) {
        document.getElementById(col+""+row).classList.add("blue");
      } else if (board[col][row] == 2) {
        document.getElementById(col+""+row).classList.add("yellow");
      } else if (board[col][row] == 0) {
        document.getElementById(col+""+row).classList.remove("blue", "yellow");
      }
    }
  }
  document.getElementById("nextTurn").innerHTML = "Next Player: "+(blueTurn?"Blue":"Yellow");
}

function updateViewToGameBoard() {
  updateView(gameBoard);
}

function columnClicked(colNum) {
  if (!userGameStats.userPlaying) {return;}
  if (columnFull(gameBoard, colNum)) {return;}

  userGameStats.round++;
  gameBoard = placeInBoard(gameBoard, colNum);
  blueTurn = !blueTurn;

  updateViewToGameBoard();

  userGameStats.winner = checkForWin(gameBoard);
  if (userGameStats.winner != null) {
    userGameStats.userPlaying = false;
    console.log("Game Over");
    document.getElementById("nextTurn").innerHTML = userGameStats.winner==1?"Winner: Blue!":(userGameStats.winner == 2? "Winner: Yellow!": "Tie Game!");
    return;
  }
}
// END

// SYSTEM FUNCTIONS
function deepCopyMatrix(matrix) {
  let newMatrix = [];
  for (let i=0; i<matrix.length; i++) {
    if (matrix[i] instanceof Array) {
      newMatrix[i] = deepCopyMatrix(matrix[i]);
    } else {
      newMatrix[i] = matrix[i];
    }
  }
  return newMatrix;
}
//END

// GAME FUNCTIONS
function placeInBoard(board, colNum) {
  let newBoard = deepCopyMatrix(board);
  newBoard[colNum] = placeInColumn(newBoard[colNum]);
  return newBoard;
}

function placeInColumn(column) {
  let newColumn = deepCopyMatrix(column);
  for(let row=5; row>=0; row--) {
    if (newColumn[row] == 0) {
      newColumn[row] = ( blueTurn ? 1 : 2 );
      return newColumn;
    }
  }
}

function boardFull(board) {
  for (let col=0; col<7; col++) {
    if (board[col][0] == 0) {
      return false;
    }
  }
  return true;
}

function columnFull(board, colNum) {
  let column = board[colNum];
  for (let row=5; row>=0; row--) {
    if (column[row] == 0) {
      return false;
    }
  }
  return true;
}

function checkForWin(board) {
  // Fold
  if (boardFull(board)) {
    return 3;
  }
  let winner = null;
  for (let col=0; col<7; col++) {
    for (let row=0; row<6; row++) {
      // For each square
      if (board[col][row] != 0) {
        // has a piece (Check lines)
        if (row>2) {
          //ul
          if (col>2) {
            if (board[col][row] == board[col-1][row-1] && board[col][row] == board[col-2][row-2] && board[col][row] == board[col-3][row-3]) {
              return board[col][row];
            }
          }
          //u
          if (board[col][row] == board[col][row-1] && board[col][row] == board[col][row-2] && board[col][row] == board[col][row-3]) {
            return board[col][row];
          }
          //ur
          if (col<4) {
            if (board[col][row] == board[col+1][row-1] && board[col][row] == board[col+2][row-2] && board[col][row] == board[col+3][row-3]) {
              return board[col][row];
            }
          }
        }
        if (col>2) {
          //l
          if (board[col][row] == board[col-1][row] && board[col][row] == board[col-2][row] && board[col][row] == board[col-3][row]) {
            return board[col][row];
          }
        }
      }
    }
  }
  return null;
}
//END
