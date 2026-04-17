// DOM Elements
const colorDisplay = document.querySelector('#colorDisplay');
const messageDisplay = document.querySelector('#message');
const currentStreakDisplay = document.querySelector('#currentStreak');
const bestStreakDisplay = document.querySelector('#bestStreak');
const colorBoxes = document.querySelectorAll('.color-box');
const newRoundBtn = document.querySelector('#newRoundBtn');
const easyBtn = document.querySelector('#easyBtn');
const hardBtn = document.querySelector('#hardBtn');
const resetStreakBtn = document.querySelector('#resetStreakBtn');
const livesContainer = document.querySelector('#livesContainer');
const gameOverOverlay = document.querySelector('#gameOverOverlay');
const playAgainBtn = document.querySelector('#playAgainBtn');
const finalStreakDisplay = document.querySelector('#finalStreak');



// Game State
let currentStreak = 0; //user -> track
let bestStreak = 0; // previously data fecth -> store
let correctColor = ''; 
let colors = [];
let numColors = 6; // Default: Hard mode
let isRoundActive = true;
let lives = 3; // Lifelines
let maxLives = 3;

// Initialize game on load
function init() {
    loadBestStreak();
    setupEventListeners();
    startNewRound();
}

// Load best streak from localStorage
function loadBestStreak() {
    const savedStreak = localStorage.getItem('rgbGameBestStreak');
    bestStreak = savedStreak ? parseInt(savedStreak) : 0;
    updateDisplay();
}

// Save best streak to localStorage
function saveBestStreak() {
    localStorage.setItem('rgbGameBestStreak', bestStreak);
}

// Setup all event listeners
function setupEventListeners() {
    // Color box clicks
    colorBoxes.forEach(box => {
        box.addEventListener('click', handleColorGuess);
    });

    // Control buttons
    newRoundBtn.addEventListener('click', startNewRound);
    resetStreakBtn.addEventListener('click', resetStreak);
    easyBtn.addEventListener('click', () => setDifficulty('easy'));
    hardBtn.addEventListener('click', () => setDifficulty('hard'));
    playAgainBtn.addEventListener('click', resetGame);
}

// Generate random RGB color
function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// Generate array of random colors
function generateColors(count) {
    const colorArray = [];
    for (let i = 0; i < count; i++) {
        colorArray.push(generateRandomColor());
    }
    return colorArray;
}

// Pick random color from array
function pickCorrectColor(colorArray) {
    const randomIndex = Math.floor(Math.random() * colorArray.length);
    return colorArray[randomIndex];
}

// Update lives display
function updateLivesDisplay() {
      const hearts = livesContainer.querySelectorAll('.heart');
      hearts.forEach((heart, index) => {
        if (index < lives) {
          heart.classList.remove('lost');
        } else {
          heart.classList.add('lost');
        }
      });
    }

// Start new round
function startNewRound() {
    // Reset game state
    isRoundActive = true;
    messageDisplay.textContent = 'Pick a color!';
    messageDisplay.style.color = 'white';
    
    // Generate colors
    colors = generateColors(numColors);
    correctColor = pickCorrectColor(colors);
    
    // Update display
    colorDisplay.textContent = correctColor;
    
    // Reset all boxes and assign colors
    colorBoxes.forEach((box, index) => {
        if (index < numColors) {
            box.style.backgroundColor = colors[index];
            box.style.display = 'block';
            box.classList.remove('fade');
        } else {
            box.style.display = 'none';
        }
    });
}

// Handle color guess
function handleColorGuess(event) {
    if (!isRoundActive) return;
    
    const clickedBox = event.target;
    const guessedColor = clickedBox.style.backgroundColor;
    
    if (guessedColor === correctColor) {
        // Correct guess
        handleCorrectGuess(clickedBox);
    } else {
        // Wrong guess
        handleWrongGuess(clickedBox);
    }
}

// Handle correct guess
function handleCorrectGuess(box) {
    isRoundActive = false;
    currentStreak++;
    
    // Update best streak if needed
    if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
        saveBestStreak();
    }
    
    // Update UI
    messageDisplay.textContent = 'Correct! 🎉';
    messageDisplay.style.color = '#4ECDC4';
    
    // Make all boxes match the correct color
    colorBoxes.forEach(box => {
        if (box.style.display !== 'none') {
            box.style.backgroundColor = correctColor;
        }
    });
    
    updateDisplay();
}

// Handle wrong guess
function handleWrongGuess(box) {
    // Fade out wrong box
    box.classList.add('fade');
    lives--;
    updateLivesDisplay();
    
    if (lives <= 0) {
        gameOver();
      } else {
        messageDisplay.textContent = `Try Again! ${lives} ${lives === 1 ? 'life' : 'lives'} left`;
        messageDisplay.style.color = '#FF6B6B';
      }
}

// Update streak display
function updateDisplay() {
    currentStreakDisplay.textContent = currentStreak;
    bestStreakDisplay.textContent = bestStreak;
}

// Game Over
    function gameOver() {
      isRoundActive = false;
      messageDisplay.textContent = 'Game Over! 💔';
      messageDisplay.style.color = '#FF6B6B';
      
      finalStreakDisplay.textContent = currentStreak;
      gameOverOverlay.classList.add('show');
      
      colorBoxes.forEach(box => {
        box.style.pointerEvents = 'none';
        box.style.opacity = '0.3';
      });
    }

// Set difficulty mode
function setDifficulty(mode) {
    if (mode === 'easy') {
        numColors = 3;
        easyBtn.classList.add('selected');
        hardBtn.classList.remove('selected');
    } else {
        numColors = 6;
        hardBtn.classList.add('selected');
        easyBtn.classList.remove('selected');
    }
    
    // Reset current streak when changing difficulty
    currentStreak = 0;
    updateDisplay();
    startNewRound();
}

// Reset Game
    function resetGame() {
      lives = maxLives;
      currentStreak = 0;
      isRoundActive = true;
      
      gameOverOverlay.classList.remove('show');
      
      colorBoxes.forEach(box => {
        box.style.pointerEvents = 'auto';
        box.style.opacity = '1';
      });
      
      updateLivesDisplay();
      updateDisplay();
      startNewRound();
    }

// Reset streak
function resetStreak() {
    if (confirm('Are you sure you want to reset your best streak?')) {
        currentStreak = 0;
        bestStreak = 0;
        saveBestStreak();
        updateDisplay();
        messageDisplay.textContent = 'Streaks reset!';
        messageDisplay.style.color = 'white';
    }
}

// Start the game
init();