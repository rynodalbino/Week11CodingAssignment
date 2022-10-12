const tiles = document.querySelectorAll(".tile"); //set variable for tiles and grab
const PLAYER_X = "X"; //creates player x
const PLAYER_O = "O"; //creates player o
let turn = PLAYER_X; //player x goes first as default, let allows it to change

const boardState = Array(tiles.length); //track the board and its selections
boardState.fill(null); //fill array and set to null

//Elements
const strike = document.getElementById("strike"); //grab strike
const gameOverArea = document.getElementById("game-over-area"); //grab gameover area
const gameOverText = document.getElementById("game-over-text"); //text
const playAgain = document.getElementById("play-again"); //play again button
playAgain.addEventListener("click", startNewGame); //set event listener to button to start new game


tiles.forEach((tile) => tile.addEventListener("click", tileClick)); //set event listener to each tile

function setHoverText() { //create hover function to be called
  //remove all hover text
  tiles.forEach((tile) => {
    tile.classList.remove("x-hover");
    tile.classList.remove("o-hover");
  });

  const hoverClass = `${turn.toLowerCase()}-hover`; //set which hover to each turn x or o

  tiles.forEach((tile) => { //sets the hover if there is not already an x or o present
    if (tile.innerText == "") {
      tile.classList.add(hoverClass); //add hover class
    }
  });
}

setHoverText();

function tileClick(event) { //set the tile click
  if (gameOverArea.classList.contains("visible")) { //check to see if the box is visible and able to click
    return; //if visible stop executing
  }

  const tile = event.target; //reference the html element or tile
  const tileNumber = tile.dataset.index; //which tile number is clicked using data index
  if (tile.innerText != "") { //check to see if it has a value ie x or o
    return; //stops executing if there is
  }

  if (turn === PLAYER_X) { //check whose turn it is, starts with x
    tile.innerText = PLAYER_X; //if player x its their turn
    boardState[tileNumber - 1] = PLAYER_X; //update boardstate, array starts at zero so minus one to keep track
    turn = PLAYER_O; //set player o turn
  } else { //if its player o turn.  else instead of else if
    tile.innerText = PLAYER_O;
    boardState[tileNumber - 1] = PLAYER_O; //update boardstate
    turn = PLAYER_X; //set to player x turn
  }

  
  setHoverText(); //call the function and resets to not allow hover text 
  checkWinner(); //call function after every tile clicked
}

function checkWinner() {
  //Check for a winner
  for (const winningCombination of winningCombinations) { //check over all possible combinations of winning combos
    //Object Destructuring
    const { combo, strikeClass } = winningCombination; 
    const tileValue1 = boardState[combo[0] - 1]; //get values of tiles and store them
    const tileValue2 = boardState[combo[1] - 1];
    const tileValue3 = boardState[combo[2] - 1];

    if ( 
      tileValue1 != null && //check if values are equal to each other
      tileValue1 === tileValue2 &&
      tileValue1 === tileValue3
    ) {
      strike.classList.add(strikeClass); //get the strike through
      gameOverScreen(tileValue1); //call function that causes game over screen to appear
      return; //stops executing if there is a winner
    }
  }

  //Check for a draw
  const allTileFilledIn = boardState.every((tile) => tile !== null); //if every square is filled checks if not null
  if (allTileFilledIn) {
    gameOverScreen(null); //calls function and shows game over screen
  }
}
//function that makes game over appear
function gameOverScreen(winnerText) {
  let text = "Draw!"; //default is a draw
  if (winnerText != null) { //if not draw
    text = `Winner is ${winnerText}!`; //makes winner appear
  }
  gameOverArea.className = "visible"; // manipulate DOM so game over box appears
  gameOverText.innerText = text;
  
}
//
function startNewGame() { //clear out the board with button click
  strike.className = "strike"; //resets strike class to just strike
  gameOverArea.className = "hidden";
  boardState.fill(null);
  tiles.forEach((tile) => (tile.innerText = "")); //sets text in tile to empty
  turn = PLAYER_X; //starts turn to x
  setHoverText();
}

const winningCombinations = [ //create an array and data structure to see if there is three in a row.  Listed is all possible combinations
  //rows
  { combo: [1, 2, 3], strikeClass: "strike-row-1" }, //every tile is numbered and checked recall and grabbed from css
  { combo: [4, 5, 6], strikeClass: "strike-row-2" }, //repeat for every row and column combo
  { combo: [7, 8, 9], strikeClass: "strike-row-3" },
  //columns
  { combo: [1, 4, 7], strikeClass: "strike-column-1" },
  { combo: [2, 5, 8], strikeClass: "strike-column-2" },
  { combo: [3, 6, 9], strikeClass: "strike-column-3" },
  //diagonals
  { combo: [1, 5, 9], strikeClass: "strike-diagonal-1" }, //finally check for diagonals
  { combo: [3, 5, 7], strikeClass: "strike-diagonal-2" },
];