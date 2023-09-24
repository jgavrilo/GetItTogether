// Object to keep track of window IDs
let windowIds = {};

// Function to open a Chrome popup window and set its flags.
function openWindow(file, windowName, dimensions) {
    const fullUrl = chrome.runtime.getURL(file);
  
    // Create a new popup window
    chrome.windows.create({ url: fullUrl, type: 'popup', width: dimensions.width, height: dimensions.height }, function(window) {
        
        // Store the window ID
        windowIds[windowName] = window.id;
        
        // Store the window ID in local storage
        chrome.storage.local.set({ [windowName]: window.id });
        
        // Remove the window ID when the window is closed
        chrome.windows.onRemoved.addListener(function(removedId) {
            if (removedId === windowIds[windowName]) {
                delete windowIds[windowName];
                
                // Remove from local storage
                chrome.storage.local.remove(windowName);
            }
        });
    });
}

// Function to handle window-opening logic
function handleWindowOpen(windowName, buttonId, file, dimensions) {
    document.getElementById(buttonId).addEventListener('click', function() {
        // Check if the window is already open using local storage
        chrome.storage.local.get([windowName], function(result) {
            if (result[windowName]) {
                // If the window is already open, bring it to the front
                chrome.windows.update(result[windowName], { focused: true });
            } else {
                // Otherwise, open a new window
                openWindow(file, windowName, dimensions);
            }
        });
    });
}

// Configuration for different window types
const timerWindowName = 'Timer';
const timerButtonId = 'openTimer';
const timerFile = 'src/html/timer.html';
const timerWindowDimensions = { width: 400, height: 300 };

const todoWindowName = 'TodoList';
const todoButtonId = 'openTodo';
const todoFile = 'src/html/todo.html';
const todoWindowDimensions = { width: 400, height: 500 };

const settingsWindowName = 'Settings';
const settingsButtonId = 'openSettings';
const settingsFile = 'src/html/settings.html';
const settingsWindowDimensions = { width: 400, height: 300 };

// Attach event listeners for each window type
handleWindowOpen(timerWindowName, timerButtonId, timerFile, timerWindowDimensions);
handleWindowOpen(todoWindowName, todoButtonId, todoFile, todoWindowDimensions);
handleWindowOpen(settingsWindowName, settingsButtonId, settingsFile, settingsWindowDimensions);
