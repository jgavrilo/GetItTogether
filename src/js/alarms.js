// Global variables to hold the test alarm sound and its playing state
let testAlarmSound = null;
let isAlarmPlaying = false;

// Event listener to execute once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load the previously selected alarm sound from local storage
    const savedAlarm = localStorage.getItem('selectedAlarm');
    if (savedAlarm) {
        const savedElement = document.getElementById(savedAlarm.split('.')[0]);
        if (savedElement) {
            savedElement.checked = true;
        }
    } else {
        const defaultElement = document.getElementById('classic-alarm');
        if (defaultElement) {
            defaultElement.checked = true;
        }
    }
    
    // Attach click event listeners to all radio buttons to stop test alarm
    const radioButtons = document.querySelectorAll('input[name="alarm"]');
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('click', function() {
            stopTestAlarm(); // Stop any playing test alarm
        });
    });

    // Handle submission of the alarm form to save the selected alarm
    const alarmForm = document.getElementById('alarmForm');
    if (alarmForm) {
        alarmForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const selectedAlarm = formData.get('alarm');
            localStorage.setItem('selectedAlarm', selectedAlarm); // Save to local storage
        });
    }

    // Handle "Test" button clicks to either play or stop test alarm
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', function(event) {
            event.preventDefault();
            if (isAlarmPlaying) {
                stopTestAlarm();  // Stop alarm
                testButton.textContent = 'Test'; // Reset button label
            } else {
                playTestAlarm();  // Start alarm
                testButton.textContent = 'Stop'; // Change button label
            }
            isAlarmPlaying = !isAlarmPlaying; // Toggle alarm state
        });
    }

});

// Event listener for when the tab switches, to pause and reset the test alarm
document.addEventListener('tabSwitched', function() {
    if (testAlarmSound) {
      testAlarmSound.pause();
      testAlarmSound.currentTime = 0;
    }
});

// Function to play the test alarm sound
function playTestAlarm() {
    const selectedRadio = document.querySelector('input[name="alarm"]:checked');
    if (selectedRadio) {
        const selectedAlarm = selectedRadio.value;
        const audioPath = `../../assets/audio/alarms/${selectedAlarm}.mp3`;
        testAlarmSound = new Audio(audioPath);
        testAlarmSound.play().catch(error => {
            console.error("Failed to play:", error.message);
        });
    } else {
        console.warn("No alarm selected"); // Log a warning if no alarm is selected
    }
}

// Function to stop the test alarm sound and reset its state
function stopTestAlarm() {
    if (testAlarmSound) {
        testAlarmSound.pause();
        testAlarmSound.currentTime = 0;
    }
    isAlarmPlaying = false; // Reset the alarm state
    document.getElementById('testButton').textContent = 'Test'; // Reset button label
}

// Event listener for when the tab switches, to reset the radio button to the saved alarm sound
document.addEventListener('tabSwitched', function() {
    if (testAlarmSound) {
        testAlarmSound.pause();
        testAlarmSound.currentTime = 0;
    }
    isAlarmPlaying = false; // Reset alarm state
    document.getElementById('testButton').textContent = 'Test'; // Reset button label

    // Load the saved alarm and update the radio button
    const savedAlarm = localStorage.getItem('selectedAlarm');
    if (savedAlarm) {
        const savedElement = document.getElementById(savedAlarm.split('.')[0]);
        if (savedElement) {
            savedElement.checked = true;
        }
    }
});
