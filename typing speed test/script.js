// DOM Elements
const textDisplay = document.querySelector('#textDisplay');
const typingArea = document.querySelector('#typingArea');
const timerDisplay = document.querySelector('#timer');
const wpmDisplay = document.querySelector('#wpm');
const accuracyDisplay = document.querySelector('#accuracy');
const bestWPMDisplay = document.querySelector('#bestWPM');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const timeSettings = document.querySelectorAll('.time-setting');
const dropdownButton = document.querySelector('#dropdownButton');
const dropdownMenu = document.querySelector('#dropdownMenu');
const selectedTimeDisplay = document.querySelector('#selectedTime');
const dropdownItems = document.querySelectorAll('.dropdown-item');


// Test texts
const testTexts = [
    "The quick brown fox jumps over the lazy dog. Practice makes perfect when learning to type faster.",
    "Technology has revolutionized the way we communicate and work in the modern digital era.",
    "Typing speed is an essential skill for anyone working with computers in today's workplace.",
    "Consistent practice and dedication are key to improving your typing accuracy and speed.",
    "Learning to type without looking at the keyboard significantly increases productivity and efficiency.",
    "The advancement of artificial intelligence is transforming industries across the globe.",
    "Every great achievement begins with the decision to try and the courage to persist.",
    "Programming requires logical thinking, problem-solving skills, and attention to detail."
];

// Game state
let currentText = '';
let timeLeft = 60;
let testDuration = 60; // User-selected test duration
let timerInterval = null;
let startTime = null;
let isTestActive = false;
let bestWPM = 0;
let usedTexts = []; // Track used sentences

// Initialize
loadBestWPM();
updateTimerDisplay();

// Dropdown functionality
dropdownButton.addEventListener('click', () => {
    if (!isTestActive) {
        dropdownButton.classList.toggle('active');
        dropdownMenu.classList.toggle('show');
        }
    });

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownButton.classList.remove('active');
            dropdownMenu.classList.remove('show');
        }
    });

// Dropdown item selection
dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        const time = parseInt(item.dataset.time);
        setTestDuration(time);
                
        // Update UI
        dropdownItems.forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
                
        // Update display text
        if (time >= 120) {
            selectedTimeDisplay.textContent = `${time / 60} minutes`;
        } else {
            selectedTimeDisplay.textContent = `${time} seconds`;
        }

        // Close dropdown
        dropdownButton.classList.remove('active');
        dropdownMenu.classList.remove('show');
        });
});

textDisplay.oncopy = (e) => e.preventDefault();
    textDisplay.oncut = (e) => e.preventDefault();
    textDisplay.oncontextmenu = (e) => e.preventDefault();
    typingArea.onpaste = (e) => e.preventDefault();
    typingArea.oncopy = (e) => e.preventDefault();
    typingArea.oncut = (e) => e.preventDefault();
    typingArea.oncontextmenu = (e) => e.preventDefault();



// Set time duration
function setTestDuration(seconds) {
    if (isTestActive) return; // Can't change during test
    
    testDuration = seconds;
    timeLeft = seconds;
    updateTimerDisplay();
    
    // Update active button styling
    timeSettings.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.time) === seconds) {
            btn.classList.add('active');
        }
    });
}

// Update timer display
function updateTimerDisplay() {
    timerDisplay.innerText = timeLeft;
}

// Load best WPM from sessionStorage
function loadBestWPM() {
    const saved = sessionStorage.getItem('typingTestBestWPM');
    bestWPM = saved !== null ? parseInt(saved) : 0;
    bestWPMDisplay.innerText = bestWPM;
}

// Save best WPM
function saveBestWPM(wpm) {
    if (wpm > bestWPM) {
        bestWPM = wpm;
        sessionStorage.setItem('typingTestBestWPM', bestWPM);
        bestWPMDisplay.innerText = bestWPM;
    }
}

// Get random text that hasn't been used yet
function getRandomText() {
    // If all texts have been used, reset the pool
    if (usedTexts.length >= testTexts.length) {
        usedTexts = [];
    }
    
    // Get available texts
    const availableTexts = testTexts.filter((text, index) => !usedTexts.includes(index));
    
    // Pick a random one
    const randomIndex = Math.floor(Math.random() * availableTexts.length);
    const selectedText = availableTexts[randomIndex];
    
    // Mark it as used
    const originalIndex = testTexts.indexOf(selectedText);
    usedTexts.push(originalIndex);
    
    return selectedText;
}

// Start test
function startTest() {
    // Reset state
    timeLeft = testDuration; // Use selected duration
    isTestActive = true;
    startTime = null;
    usedTexts = []; // Reset used texts
    
    // Get random text
    currentText = getRandomText();
    textDisplay.innerText = currentText;
    
    // Enable typing area
    typingArea.disabled = false;
    typingArea.value = '';
    typingArea.focus();
    
    // Disable start button and time settings
    startBtn.disabled = true;
    timeSettings.forEach(btn => btn.disabled = true);
    
    // Start timer
    timerInterval = setInterval(updateTimer, 1000);
}

// Update timer
function updateTimer() {
    timeLeft--;
    timerDisplay.innerText = timeLeft;
    
    if (timeLeft <= 0) {
        endTest();
    }
    
    // Warning color
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#ff6b6b';
    } else {
        timerDisplay.style.color = '#2c3e50';
    }
}

// Handle typing input
typingArea.addEventListener('input', function() {
    if (!isTestActive) return;
    
    // Start time on first keystroke
    if (!startTime) {
        startTime = Date.now();
    }
    
    updateStats();
    highlightText();
    
    // Check if user finished typing the current text
    checkCompletion();
});

// Check if user completed the current text
function checkCompletion() {
    const typedText = typingArea.value;
    
    // Check if typed text matches current text exactly
    if (typedText === currentText) {
        // Load next sentence
        loadNextSentence();
    }
}

// Load next sentence
function loadNextSentence() {
    if (!isTestActive || timeLeft <= 0) return;
    
    // Get new text
    currentText = getRandomText();
    textDisplay.innerText = currentText;
    
    // Clear typing area
    typingArea.value = '';
    
    // Show brief feedback
    textDisplay.style.backgroundColor = '#d4edda';
    setTimeout(() => {
        textDisplay.style.backgroundColor = '#f8f9fa';
    }, 200);
}

// Update statistics
function updateStats() {
    const typedText = typingArea.value;
    
    // Calculate WPM
    const elapsedMinutes = (Date.now() - startTime) / 1000 / 60;
    const words = typedText.trim().split(/\s+/).filter(w => w.length > 0);
    const wpm = elapsedMinutes > 0 ? Math.round(words.length / elapsedMinutes) : 0;
    wpmDisplay.innerText = wpm;
    
    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === currentText[i]) {
            correctChars++;
        }
    }
    
    const accuracy = typedText.length > 0 
        ? (correctChars / typedText.length * 100).toFixed(1)
        : 100;
    accuracyDisplay.innerText = `${accuracy}%`;
}

// Highlight typed text
function highlightText() {
    const typedText = typingArea.value;
    let highlightedHTML = '';
    
    for (let i = 0; i < currentText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === currentText[i]) {
                highlightedHTML += `<span class="correct">${currentText[i]}</span>`;
            } else {
                highlightedHTML += `<span class="incorrect">${currentText[i]}</span>`;
            }
        } else if (i === typedText.length) {
            highlightedHTML += `<span class="current">${currentText[i]}</span>`;
        } else {
            highlightedHTML += currentText[i];
        }
    }
    
    textDisplay.innerHTML = highlightedHTML;
}

// End test
function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    typingArea.disabled = true;
    startBtn.disabled = false;
    timerDisplay.style.color = '#2c3e50';
    
    // Re-enable time settings
    timeSettings.forEach(btn => btn.disabled = false);
    
    const finalWPM = parseInt(wpmDisplay.innerText);
    saveBestWPM(finalWPM);
    
    alert(`Test Complete!\nWPM: ${finalWPM}\nAccuracy: ${accuracyDisplay.innerText}`);
}

// Reset session
function resetSession() {
    if (confirm('Reset session best score?')) {
        sessionStorage.removeItem('typingTestBestWPM');
        bestWPM = 0;
        bestWPMDisplay.innerText = 0;
    }
}

// Event listeners
startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetSession);

// Time setting buttons
timeSettings.forEach(btn => {
    btn.addEventListener('click', () => {
        const time = parseInt(btn.dataset.time);
        setTestDuration(time);
    });
});