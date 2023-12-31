// SECTION - Global Variables
let timerInterval;
let alarmSound;
let isPaused = false;

// SECTION - DOM Elements
const startButton = document.getElementById("startTimer");
const startBreakButton = document.getElementById("startBreak");
const repeatButton = document.getElementById("repeatTimer");
const timerContent = document.getElementById("countdown");
const inputContent = document.getElementById("inputSection");

// SECTION - Utility Functions

// Toggle the display style of a DOM element
function toggleDisplay(elementId, displayStyle) {
    document.getElementById(elementId).style.display = displayStyle;
}

// Show the input section after the break timer ends
function showInputContent(workTime, breakTime) {
    toggleDisplay("countdown", "none");
    toggleDisplay("inputSection", "block");
    document.getElementById("workTime").value = workTime;
    document.getElementById("breakTime").value = breakTime;
}

// Play the selected alarm sound
function playAlarm() {
    const selectedAlarm = localStorage.getItem('selectedAlarm') || 'classic-alarm.mp3';
    alarmSound = new Audio(`../../assets/audio/alarms/${selectedAlarm}`);
    alarmSound.play();
}

// Stop the alarm sound
function stopAlarm() {
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
}

// SECTION - Main Timer Logic

// Start the timer with a given duration and optional callbacks
function startTimer(duration, callback, isBreak = false, breakCallback = false) {
    clearInterval(timerInterval); // Clear any existing timer
    let totalTime = duration * 60; // Convert minutes to seconds
    const displayTimer = document.getElementById("timer");

    const updateTimerDisplay = () => {
        if (totalTime >= 0) {
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;
            displayTimer.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            if (!isPaused) {
                totalTime--;
            }
        } else {
            clearInterval(timerInterval);
            playAlarm();
            if (isBreak) {
                toggleDisplay("stopTimer", "block");
                toggleDisplay("startBreak", "none");
                toggleDisplay("pauseTimer", "none");
                toggleDisplay("resumeTimer", "none");
                if (callback) callback();
                if (breakCallback) breakCallback();
            }
            if (callback) callback();
        }
    };

    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// SECTION - Event Listeners

// Start the work timer
startButton.addEventListener("click", function(event) {
    event.stopPropagation(); 
    const workTime = parseInt(document.getElementById("workTime").value) || 0;

    toggleDisplay("inputSection", "none");
    toggleDisplay("countdown", "block");
    toggleDisplay("stopTimer", "block");
    toggleDisplay("pauseTimer", "block");
    toggleDisplay("resumeTimer", "none");

    startTimer(workTime, function() {
        startBreakButton.style.display = "block";
        startBreakButton.addEventListener("click", function(event) {
            event.stopPropagation();
            const breakTime = parseInt(document.getElementById("breakTime").value) || 0;

            toggleDisplay("startBreak", "none");
            stopAlarm(); 
            startTimer(breakTime, function() {
                toggleDisplay("startBreak", "none");
            }, true, function() {
                toggleDisplay("repeatTimer", "block");
            });
        });
    }, true);
});

// Stop the timer and reset
document.getElementById("stopTimer").addEventListener("click", function() {
    clearInterval(timerInterval);
    stopAlarm();
    toggleDisplay("startBreak", "none");
    toggleDisplay("repeatTimer", "none");
    showInputContent(workTime, breakTime);
    isPaused = false; 
});

// Pause the timer
document.getElementById("pauseTimer").addEventListener("click", function() {
    isPaused = true;
    toggleDisplay("pauseTimer", "none");
    toggleDisplay("resumeTimer", "block");
});

// Resume the paused timer
document.getElementById("resumeTimer").addEventListener("click", function() {
    isPaused = false;
    toggleDisplay("pauseTimer", "block");
    toggleDisplay("resumeTimer", "none");
});

// Repeat the timer sequence
repeatButton.addEventListener("click", function(event) {
    event.stopPropagation();
    stopAlarm(); 
    const workTime = parseInt(document.getElementById("workTime").value) || 0;
    const breakTime = parseInt(document.getElementById("breakTime").value) || 0;
    toggleDisplay("repeatTimer", "none");
    startTimer(workTime, function() {
        startBreakButton.style.display = "block";
        startBreakButton.addEventListener("click", function(event) {
            event.stopPropagation();
            toggleDisplay("startBreak", "none");
            startTimer(breakTime, function() {
                toggleDisplay("startBreak", "none");
            }, true);
        });
    }, true);
});











