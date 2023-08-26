// Listen for messages from the extension popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // When a "startTimer" action is received
    if (message.action === "startTimer") {
        // Create an alarm with the specified delay
        chrome.alarms.create(message.type, { delayInMinutes: message.duration / 60000 });
    }
});

// Listen for alarm triggers
chrome.alarms.onAlarm.addListener(function(alarm) {
    // When the "work" alarm triggers
    if (alarm.name === "work") {
        // Create a notification for the end of a work session
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Work Session Over',
            message: 'Time for a break!'
        });
    }
    // When the "break" alarm triggers
    else if (alarm.name === "break") {
        // Create a notification for the end of a break
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Break Over',
            message: 'Time to get back to work!'
        });
    }
});

let timer;
const alarmSound = new Audio('audio/alarm.mp3'); // Replace with the actual path to your alarm sound file

function startTimer(seconds) {
    clearInterval(timer);

    timer = setInterval(() => {
        if (seconds <= 0) {
            clearInterval(timer);
            playAlarm();
        } else {
            seconds--;
        }
    }, 1000);
}

function playAlarm() {
    alarmSound.play();
}

// Listen for messages from other parts of your extension (e.g., popup)
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'startTimer') {
        const seconds = message.seconds || 0;
        startTimer(seconds);
    }
});
