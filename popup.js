const startButton = document.getElementById("startTimer");
const startBreakButton = document.getElementById("startBreak");

startButton.addEventListener("click", function() {
    const workTimeInput = document.getElementById("workTime");
    const inputSection = document.getElementById("inputSection");
    const countdownSection = document.getElementById("countdown");
    const displayTimer = document.getElementById("timer");

    if (!workTimeInput || !inputSection || !countdownSection || !displayTimer) {
        console.error("One or more elements are missing.");
        return;
    }

    const workTime = parseInt(workTimeInput.value) || 0;

    inputSection.style.display = "none";
    countdownSection.style.display = "block";

    startTimer(workTime, function() {
        startBreakButton.style.display = "block";
    });
});

startBreakButton.addEventListener("click", function() {
    const breakTimeInput = document.getElementById("breakTime");
    if (!breakTimeInput) {
        console.error("Break time input not found.");
        return;
    }

    const breakTime = parseInt(breakTimeInput.value) || 0;

    startBreakButton.style.display = "none"; // Hide the start break button

    startTimer(breakTime, function() {
        alert("Break is over!");
    });
});

function startTimer(duration, callback) {
    let totalTime = duration * 60;  // Convert minutes to seconds
    const displayTimer = document.getElementById("timer");

    const updateTimerDisplay = () => {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        displayTimer.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        totalTime--;

        if (totalTime < 0) {
            clearInterval(timerInterval);
            if (callback) callback(); // Call the passed callback function when timer runs out
        }
    };

    const timerInterval = setInterval(updateTimerDisplay, 1000);
}
