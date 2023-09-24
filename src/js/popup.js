// Object to keep track of window IDs
let windowIds = {};

// Function to open a Chrome popup window and set its flags.
function openWindow(file, windowName, dimensions) {
    const fullUrl = chrome.runtime.getURL(file);
  
    // Create a new popup window
    chrome.windows.create({ url: fullUrl, type: 'popup', width: dimensions.width, height: dimensions.height }, function(window) {
        
        console.log("Window created:", window);

        // Store the window ID
        windowIds[windowName] = window.id;
        
        // Store the window ID in local storage
        localStorage.setItem(windowName, window.id.toString());
    });
}

// Function to handle window-opening logic
function handleWindowOpen(windowName, buttonId, file, dimensions) {
    document.getElementById(buttonId).addEventListener('click', function() {
        // Check if the window is already open using local storage
        const storedId = localStorage.getItem(windowName);
        console.log("Stored window ID:", storedId);

        if (storedId) {
            // If the window is already open, bring it to the front
            chrome.windows.get(parseInt(storedId), {}, function(window) {
                if (chrome.runtime.lastError) {
                    console.error("Error occurred:", chrome.runtime.lastError.message);
                    // Open a new window if the stored one doesn't exist
                    openWindow(file, windowName, dimensions);
                } else {
                    chrome.windows.update(parseInt(storedId), { focused: true });
                }
            });
        } else {
            // Otherwise, open a new window
            openWindow(file, windowName, dimensions);
        }
    });
}

// Attach an event listener to remove the window ID when the window is closed
chrome.windows.onRemoved.addListener(function(removedId) {
    for (const [name, id] of Object.entries(windowIds)) {
        if (id === removedId) {
            console.log("Window removed:", removedId);
            delete windowIds[name];
            localStorage.removeItem(name);
        }
    }
});

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
