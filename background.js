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
