let testAlarmSound = null;

document.addEventListener('DOMContentLoaded', function() {
    // Load the saved alarm from local storage
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
    
    // Add event listeners to radio buttons to stop the test alarm
    const radioButtons = document.querySelectorAll('input[name="alarm"]');
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('click', function() {
        if (testAlarmSound) {
            testAlarmSound.pause();
            testAlarmSound.currentTime = 0;
        }
        });
    });

    // Handle alarm form submission
    const alarmForm = document.getElementById('alarmForm');
    if (alarmForm) {
        alarmForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const selectedAlarm = formData.get('alarm');
            localStorage.setItem('selectedAlarm', selectedAlarm);
        });
    }

    // Handle "Test" button click
    const testButton = document.getElementById('testButton');
    if (testButton) {
        testButton.addEventListener('click', function(event) {
        event.preventDefault();
        playTestAlarm();
        });
    }
    
});

// Event listener to pause the alarm and reset it if the tab switches
document.addEventListener('tabSwitched', function() {
    if (testAlarmSound) {
      testAlarmSound.pause();
      testAlarmSound.currentTime = 0;
    }
  });
  
// Function to play test alarm
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
      console.warn("No alarm selected");
    }
  }
  