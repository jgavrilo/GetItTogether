// Get references to elements
const startButton = document.getElementById("startTimer");
const startBreakButton = document.getElementById("startBreak");
const endBreakButton = document.getElementById("endBreak");

const timerContent = document.getElementById("countdown");
const inputContent = document.getElementById("inputSection");

let timerInterval; // Declare the timerInterval variable
let alarmSound; // Declare the alarm sound variable at a broader scope
let isPaused = false; // Declare a variable to track the pause state

// After the break timer is over
// Show input content and populate input fields with previous input values
function showInputContent(workTime, breakTime) {
    timerContent.style.display = "none";
    inputContent.style.display = "block";

    const workTimeInput = document.getElementById("workTime");
    const breakTimeInput = document.getElementById("breakTime");

    if (workTimeInput && breakTimeInput) {
        workTimeInput.value = workTime;
        breakTimeInput.value = breakTime;
    }
}

// Play the alarm sound
function playAlarm() {
    alarmSound = new Audio('../../assets/audio/alarm.mp3');
    alarmSound.play();
}

// Stop the alarm sound
function stopAlarm() {
    if (alarmSound) {
        alarmSound.pause();
        alarmSound.currentTime = 0;
    }
}

// Timer logic
function startTimer(duration, callback) {
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
            document.getElementById("pauseTimer").style.display = "none"; 
            if (callback) callback();
        }
    };

    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000);
}


// Event listener for start button
startButton.addEventListener("click", function(event) {
    clearInterval(timerInterval); // Stop any existing timer

    // Prevent clicks on the start button from closing the popup
    event.stopPropagation();
    

    const workTimeInput = document.getElementById("workTime");
    const inputSection = document.getElementById("inputSection");
    const countdownSection = document.getElementById("countdown");

    const workTime = parseInt(workTimeInput.value) || 0;

    inputSection.style.display = "none";
    countdownSection.style.display = "block";
    document.getElementById("stopTimer").style.display = "block";
    document.getElementById("pauseTimer").style.display = "block";
    document.getElementById("resumeTimer").style.display = "none";

    startTimer(workTime, function() {
        startBreakButton.style.display = "block";
        startBreakButton.addEventListener("click", function(event) {
            // Prevent clicks on the start break button from closing the popup
            event.stopPropagation();

            const breakTimeInput = document.getElementById("breakTime");
            const breakTime = parseInt(breakTimeInput.value) || 0;

            startBreakButton.style.display = "none";
            stopAlarm(); // Stop the alarm sound if it's playing
            startTimer(breakTime, function() {
                startBreakButton.style.display = "none";
                endBreakButton.style.display = "block";
                endBreakButton.addEventListener("click", function(event) {
                    // Prevent clicks on the end break button from closing the popup
                    event.stopPropagation();

                    inputSection.style.display = "block";
                    endBreakButton.style.display = "none";
                    countdownSection.style.display = "none";    
                    stopAlarm(); // Stop the alarm sound if it's playing

                });
            });
        });
    });
});

// Event listener for Stop button
document.getElementById("stopTimer").addEventListener("click", function() {
    clearInterval(timerInterval); // Stop any existing timer
    stopAlarm();
    clearInterval(timerInterval);
    isPaused = false; // Reset the pause state
    showInputContent(workTime, breakTime); // Show the input section
});

// Event listener for Pause button
document.getElementById("pauseTimer").addEventListener("click", function() {
    clearInterval(timerInterval); // Stop any existing timer
    isPaused = true;
    document.getElementById("pauseTimer").style.display = "none";
    document.getElementById("resumeTimer").style.display = "block";
});

// Event listener for Resume button
document.getElementById("resumeTimer").addEventListener("click", function() {
    clearInterval(timerInterval); // Stop any existing timer
    isPaused = false;
    document.getElementById("pauseTimer").style.display = "block";
    document.getElementById("resumeTimer").style.display = "none";
});