// Function to handle window opening logic
function handleWindowOpen(windowObj, windowName, buttonId, file, isOpenFlag, dimensions) {
    document.getElementById(buttonId).addEventListener('click', function() {
        if (windowObj) {
            windowObj.focus();
        } else {
            const isWindowOpen = localStorage.getItem(isOpenFlag) === 'true';

            if (isWindowOpen) {
                try {
                    windowObj.focus();
                } catch (e) {
                    openWindow(windowObj, file, windowName, dimensions, isOpenFlag);
                }
            } else {
                openWindow(windowObj, file, windowName, dimensions, isOpenFlag);
            }
        }
    });
}

// Function to actually open the window and set flags
function openWindow(windowObj, file, windowName, dimensions, isOpenFlag) {
    windowObj = window.open(file, windowName, dimensions);
    
    if (windowObj) {
        localStorage.setItem(isOpenFlag, 'true');
        
        windowObj.onbeforeunload = function() {
            localStorage.setItem(isOpenFlag, 'false');
        }
    }
}

// Timer window variables
let timerWindow = null;
const timerWindowName = 'Timer';
const timerButtonId = 'openTimer';
const timerFile = '../html/timer.html';
const isTimerOpen = 'isTimerWindowOpen';
const timerWindowDimensions = 'width=400,height=300';

// Todo window variables
let todoWindow = null;
const todoWindowName = 'TodoList';
const todoButtonId = 'openTodo';
const todoFile = '../html/todo.html';
const isTodoOpen = 'isTodoWindowOpen';
const todoWindowDimensions = 'width=400,height=500';

// Settings window variables
let settingsWindow = null;
const settingsWindowName = "Settings";
const settingsButtonId = 'openSettings';
const settingsFile = '../html/settings.html';
const settingsWindowDimensions = 'width=400,height=300';

// Attach event listeners
handleWindowOpen(timerWindow, timerWindowName, timerButtonId, timerFile, isTimerOpen, timerWindowDimensions);
handleWindowOpen(todoWindow, todoWindowName, todoButtonId, todoFile, isTodoOpen, todoWindowDimensions);
handleWindowOpen(settingsWindow, settingsWindowName, settingsButtonId, settingsFile, null, settingsWindowDimensions);

