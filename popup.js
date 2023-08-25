// Prevent clicks from closing the popup
document.body.addEventListener("click", function(event) {
    event.stopPropagation();
});

// Get references to elements
const startButton = document.getElementById("startTimer");
const startBreakButton = document.getElementById("startBreak");
const endBreakButton = document.getElementById("endBreak");

const timerContent = document.getElementById("countdown");
const inputContent = document.getElementById("inputSection");

let timerInterval; // Declare the timerInterval variable

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

//ANCHOR: Timer logic
function startTimer(duration, callback) {
    let totalTime = duration * 60;  // Convert minutes to seconds
    const displayTimer = document.getElementById("timer");

    const updateTimerDisplay = () => {
        if (totalTime >= 0) {
            const minutes = Math.floor(totalTime / 60);
            const seconds = totalTime % 60;
            displayTimer.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            totalTime--;

            if (totalTime < 0) {
                clearInterval(timerInterval);
                if (callback) callback(); // Call the passed callback function when timer runs out
            }
        } else {
            clearInterval(timerInterval); // Clear the interval if totalTime is negative
        }
    };

    updateTimerDisplay();
    timerInterval = setInterval(updateTimerDisplay, 1000); // Initialize timerInterval here

    // At the end of the timer, if the callback is given:
    if (totalTime < 0) {
        clearInterval(timerInterval);
        if (callback) callback();
    }
}

//ANCHOR: Event listener for start button
startButton.addEventListener("click", function(event) {
    // Prevent clicks on the start button from closing the popup
    event.stopPropagation();

    const workTimeInput = document.getElementById("workTime");
    const inputSection = document.getElementById("inputSection");
    const countdownSection = document.getElementById("countdown");

    const workTime = parseInt(workTimeInput.value) || 0;

    inputSection.style.display = "none";
    countdownSection.style.display = "block";

    startTimer(workTime, function() {
        startBreakButton.style.display = "block";
        startBreakButton.addEventListener("click", function(event) {
            // Prevent clicks on the start break button from closing the popup
            event.stopPropagation();

            const breakTimeInput = document.getElementById("breakTime");
            const breakTime = parseInt(breakTimeInput.value) || 0;

            startBreakButton.style.display = "none";
            startTimer(breakTime, function() {
                startBreakButton.style.display = "none";
                endBreakButton.style.display = "block";
                endBreakButton.addEventListener("click", function(event) {
                    // Prevent clicks on the end break button from closing the popup
                    event.stopPropagation();

                    inputSection.style.display = "block";
                    endBreakButton.style.display = "none";
                    countdownSection.style.display = "none";
                });
            });
        });
    });
});