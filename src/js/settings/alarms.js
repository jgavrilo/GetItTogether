// SECTION - Global Variables
let testAlarmSound = null;
let isAlarmPlaying = false;

// SECTION - DOMContentLoaded Event

// Initialize when DOM is fully loaded
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
    
    // SECTION - Event Listeners

    // Attach click event listeners to all radio buttons to stop test alarm
    const radioButtons = document.querySelectorAll('input[name="alarm"]');
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('click', function() {
            stopTestAlarm(); 
        });
    });

    // Handle submission of the alarm form to save the selected alarm
    const alarmForm = document.getElementById('alarmForm');
    if (alarmForm) {
        alarmForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const selectedAlarm = formData.get('alarm');
            localStorage.setItem('selectedAlarm', selectedAlarm); 
        });
    }

    // Handle "Test" button clicks to either play or stop test alarm
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', function(event) {
            event.preventDefault();
            if (isAlarmPlaying) {
                stopTestAlarm();  
                testButton.textContent = 'Test'; 
            } else {
                playTestAlarm();  
                testButton.textContent = 'Stop'; 
            }
            isAlarmPlaying = !isAlarmPlaying; 
        });
    }

});

// SECTION - Custom Events

// Event listener for when the tab switches, to pause and reset the test alarm
document.addEventListener('tabSwitched', function() {
    if (testAlarmSound) {
      testAlarmSound.pause();
      testAlarmSound.currentTime = 0;
    }
});

// Event listener for when the tab switches, to reset the radio button to the saved alarm sound
document.addEventListener('tabSwitched', function() {
    if (testAlarmSound) {
        testAlarmSound.pause();
        testAlarmSound.currentTime = 0;
    }
    isAlarmPlaying = false;
    document.getElementById('testButton').textContent = 'Test'; 

    // Load the saved alarm and update the radio button
    const savedAlarm = localStorage.getItem('selectedAlarm');
    if (savedAlarm) {
        const savedElement = document.getElementById(savedAlarm.split('.')[0]);
        if (savedElement) {
            savedElement.checked = true;
        }
    }
});

// SECTION - Utility Functions

// Function to play the test alarm sound
function playTestAlarm() {
    const selectedRadio = document.querySelector('input[name="alarm"]:checked');
    if (selectedRadio) {
        const selectedAlarm = selectedRadio.value;
        const audioPath = `../../assets/audio/alarms/${selectedAlarm}`;
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