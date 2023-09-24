let windowIds = {};

// Function to actually open the window and set flags
function openWindow(file, windowName, dimensions) {
    const fullUrl = chrome.runtime.getURL(file);
    chrome.windows.create({ url: fullUrl, type: 'popup', width: dimensions.width, height: dimensions.height }, function(window) {
        
        // Save to local storage
        chrome.storage.local.set({ [windowName]: window.id }, function() {
            console.log('Window ID saved');
        });

        // Remove the window ID when the window is closed
        chrome.windows.onRemoved.addListener(function(removedId) {
            chrome.storage.local.get([windowName], function(result) {
                if (removedId === result[windowName]) {
                    chrome.storage.local.remove([windowName], function() {
                        console.log('Window ID removed');
                    });
                }
            });
        });
    });
}

// Function to handle window opening logic
function handleWindowOpen(windowName, buttonId, file, dimensions) {
    document.getElementById(buttonId).addEventListener('click', function() {
        chrome.storage.local.get([windowName], function(result) {
            if (result[windowName]) {
                // If the window is already open, bring it to the front
                chrome.windows.update(result[windowName], { focused: true });
            } else {
                openWindow(file, windowName, dimensions);
            }
        });
    });
}

// Function to actually open the window and set flags
function openWindow(file, windowName, dimensions) {
    const fullUrl = chrome.runtime.getURL(file);
    chrome.windows.create({ url: fullUrl, type: 'popup', width: dimensions.width, height: dimensions.height }, function(window) {
        windowIds[windowName] = window.id;

        // Remove the window ID when the window is closed
        chrome.windows.onRemoved.addListener(function(removedId) {
            if (removedId === windowIds[windowName]) {
                delete windowIds[windowName];
            }
        });
    });
}

// Timer window variables
const timerWindowName = 'Timer';
const timerButtonId = 'openTimer';
const timerFile = 'src/html/timer.html';
const timerWindowDimensions = { width: 400, height: 300 };

// Todo window variables
const todoWindowName = 'TodoList';
const todoButtonId = 'openTodo';
const todoFile = 'src/html/todo.html';
const todoWindowDimensions = { width: 400, height: 500 };

// Settings window variables
const settingsWindowName = "Settings";
const settingsButtonId = 'openSettings';
const settingsFile = 'src/html/settings.html';
const settingsWindowDimensions = { width: 400, height: 300 };

// Attach event listeners
handleWindowOpen(timerWindowName, timerButtonId, timerFile, timerWindowDimensions);
handleWindowOpen(todoWindowName, todoButtonId, todoFile, todoWindowDimensions);
handleWindowOpen(settingsWindowName, settingsButtonId, settingsFile, settingsWindowDimensions);
