var player =prompt("enter your name:");
// console.log(player1);


// Six element:

var currentScore = document.querySelector('#currentScore');
var highScore = document.querySelector('#highScore');
var clickButton = document.querySelector('#clickButton');
var timer = document.querySelector('#timer');
var startButton = document.querySelector('#startButton');
var statusMessage = document.querySelector('#statusMessage');
var resetButton = document.querySelector('#resetButton');
var pauseButton = document.querySelector('#pauseButton');
var resumeButton = document.querySelector('#resumeButton');
var video = document.querySelector('#video');

//  Extra variables required:  total:5
var name = "console.log(player1);";
var current = 0;
var high = 0;
var timer1 = 10;
var flag = false;
var timeId = null;

function onWebsite() {
    loadData();
    displayContent();
}

function loadData() {
    var temp = localStorage.getItem('highScore');
    if (temp != null) {
        high = temp;
    }
    else{
        high = 0;
    }

}

function displayContent() {
    currentScore.textContent = current;
    highScore.textContent = high;
    timer.textContent = timer1;
}

function statusMsg(msg) {
    statusMessage.textContent = msg;
}



function endGame() {
    flag = false;
    clickButton.disabled = true;
    startButton.disabled = false; 
    clearInterval(timeId);
    if (current > high) {
        video.style.display = "block";
        video.play();
        high = current;
        localStorage.setItem('highScore', high);
        statusMsg(`New High Score! ${player} scored ${current} points.`);
        current = 0;
    }
    else {
        statusMsg(`${player} current score is ${current}`);
    }

    current = 0;
    timer1 = 10;
    displayContent();
}

function startGame() {
    video.style.display = "none";
    clickButton.disabled = false;
    startButton.disabled = true; 
    pauseButton.disabled = false;
    flag = true;
    timer1 = 10;
    statusMsg("The game is startes");
    timeId = setInterval(function () {
        timer1--;
        if (timer1 <= 0) {
            endGame();
        }
        displayContent()
    },1000)
}

function pauseGame() {
    if (flag) {
        flag = false;
        clearInterval(timeId);      
        statusMsg("Game Paused");
        clickButton.disabled = true;
        resumeButton.disabled = false;
        pauseButton.disabled = true;
    }   
}


function resumeGame() {
    if (!flag) {
        flag = true;
        statusMsg("Game Resumed");
        clickButton.disabled = false;
        resumeButton.disabled = true;
        pauseButton.disabled = false;   
        timeId = setInterval(function(){
            timer1--;
            if (timer1 <= 0) {
                endGame();
            }
            displayContent()
        },1000)
    }
}


function userClick() {
    if (flag) {
        current++;
        displayContent();
    }
}

function resetGame() {
    video.style.display = "none";
    high = 0;
    localStorage.setItem('highScore', high);
    timer1 = 10; 
    flag = false;
    current = 0;
    clickButton.disabled = true; 
    clearInterval(timeId);
    displayContent();
    statusMsg("Game has been reset, click Start to play again!");
}



startButton.addEventListener('click',startGame);

clickButton.addEventListener('click',userClick);

resetButton.addEventListener('click',resetGame);

pauseButton.addEventListener('click',pauseGame);

resumeButton.addEventListener('click',resumeGame);

onWebsite();




