chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "startTimer") {
        chrome.alarms.create(message.type, { delayInMinutes: message.duration / 60000 });
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "work") {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Work Session Over',
            message: 'Time for a break!'
        });
    } else if (alarm.name === "break") {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'images/icon48.png',
            title: 'Break Over',
            message: 'Time to get back to work!'
        });
    }
});
