//declaring Variables

const scoreDisplay = document.querySelector('#score');
const timeLeftDisplay = document.querySelector('#timeLeft');
const maxScoreDisplay = document.querySelector('#maxScore');
const startBtn = document.querySelector('#startBtn');
const holes = document.querySelectorAll('.hole');
console.log(holes);
const moles = document.querySelectorAll('.mole');

// Required variable
var score = 0;
var time = 30;
var bestScore = 0;
var playGame = false;     //To give signal to user to start the game
var gameId = null;


function webLoad() {
  onLoad();
  displayContent();
}


//Step-2.  1.phase load the entire data

function onLoad() {
  var temp = localStorage.getItem('highScoreGame'); // 
  if (temp != null) {
    bestScore = parseInt(temp); // 
  }
  else {
    bestScore = 0;
  }
}

//Step-2 2. Reflecting the actual vale in the i=required html element using textContent

function displayContent() {
  scoreDisplay.textContent = score;
  timeLeftDisplay.textContent = time;
  maxScoreDisplay.textContent = bestScore;
}

//Calling webload function here

webLoad();

//Random time generator implementation
function randomTimeGenerator(min, max) {
  return Math.floor(Math.random() * (max - min) + min); // 
}

//Random Index function here
function randomIndex() {
  var index = Math.floor(Math.random() * holes.length);
  return holes[index];
}

//pop game implementation for image appear and disappear purpose
function popImageGame() {
  if (!playGame) return; // 

  var randomTime = randomTimeGenerator(500, 1500);
  var hole = randomIndex();
  var mole = hole.querySelector('.mole');

  mole.classList.add('up');
  setTimeout(function () {
    mole.classList.remove('up');
    popImageGame(); // keep spawning while playGame == true
  }, randomTime);
}

//Endgame implementation
function endGame() {
  playGame = false; // 
  clearInterval(gameId);
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('highScoreGame', bestScore);
    alert(`Your score is higher than previous one: ${score}`);
  }
  else {
    alert(`Your score is: ${score}`);
  }
  score = 0;
  displayContent();
  startBtn.disabled = false;
}

//ACTUAL IMPLEMENTATION OF START GAME FUNCTION
function startGame() {
  score = 0;
  time = 30;
  playGame = true; // 
  startBtn.disabled = true;

  popImageGame();
  //disabled -> true which means button is disabled...
  gameId = setInterval(function () {
    time--;
    if (time <= 0) { // 
      clearInterval(gameId);
      endGame(); // 
      //This method is used only top stop the setinterval at some condition
    }
    displayContent();
  }, 1000);
}

// Bonk (hit mole) implementation
function bonk(event) {
  if (playGame == false) return;
  if (event.target.classList.contains('up')) {
    score++;
    event.target.classList.remove('up');
    event.target.classList.add('bonked');
  }
  setTimeout(function () {
    event.target.classList.remove('bonked');
  }, 300);
  displayContent();
}

//ADD EVENT LISTENER PART:

startBtn.addEventListener('click', startGame);

moles.forEach((box) => {
  box.addEventListener('click', bonk);
});