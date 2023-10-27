// SECTION - Global Variables
let windowIds = {};

// SECTION - Utility Functions

// Open a Chrome popup window with specified dimensions and flags
function openWindow(file, windowName, dimensions) {
    const fullUrl = chrome.runtime.getURL(file);

    // Create a new popup window
    chrome.windows.create({ url: fullUrl, type: 'popup', width: dimensions.width, height: dimensions.height }, function(window) {
        // Store the window ID
        windowIds[windowName] = window.id;
        // Persist the window ID in local storage
        localStorage.setItem(windowName, window.id.toString());
    });
}

// Handle the logic for opening or focusing a window
function handleWindowOpen(windowName, buttonId, file, dimensions) {
    document.getElementById(buttonId).addEventListener('click', function() {
        // Retrieve the stored window ID from local storage
        const storedId = localStorage.getItem(windowName);
        console.log("Stored window ID:", storedId);

        if (storedId) {
            // If window exists, focus it; otherwise, create a new one
            chrome.windows.get(parseInt(storedId), {}, function(window) {
                if (chrome.runtime.lastError) {
                    localStorage.removeItem(windowName); // Remove stale ID
                    openWindow(file, windowName, dimensions); // Open a new window
                } else {
                    chrome.windows.update(parseInt(storedId), { focused: true });
                }
            });
        } else {
            // Open a new window
            openWindow(file, windowName, dimensions);
        }
    });
}

// SECTION - Chrome Event Listeners

// Remove the window ID from storage when the window is closed
chrome.windows.onRemoved.addListener(function(removedId) {
    for (const [name, id] of Object.entries(windowIds)) {
        if (id === removedId) {
            console.log("Window removed:", removedId);
            delete windowIds[name];
            localStorage.removeItem(name);
        }
    }
});

// SECTION - Window Configurations

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

// SECTION - Event Listener Attachments

// Attach event listeners to handle window opening for each type
handleWindowOpen(timerWindowName, timerButtonId, timerFile, timerWindowDimensions);
handleWindowOpen(todoWindowName, todoButtonId, todoFile, todoWindowDimensions);
handleWindowOpen(settingsWindowName, settingsButtonId, settingsFile, settingsWindowDimensions);