// Global variable to hold reference to the opened window
let timerWindow = null;
const timerWindowName = 'Timer'; // A unique name for the timer window

document.getElementById('openTimer').addEventListener('click', function() {
    // Check if myWindow holds a value and the window isn't closed, then focus on it
    if (timerWindow) {
        timerWindow.focus();
    } else {
        // Otherwise, retrieve the 'windowOpened' flag from localStorage
        const windowOpened = localStorage.getItem('windowOpened') === 'true';

        if (windowOpened) {
            // If the window has been opened before, try to focus on it
            try {
                timerWindow.focus();
            } catch (e) {
                // If focusing fails (perhaps because the window was closed or myWindow lost its reference), open a new one
                openNewWindow();
            }
        } else {
            // If the window has never been opened, open a new one
            openNewWindow();
        }
    }
});
    
function openNewWindow() {
    timerWindow = window.open('timer.html', timerWindowName, 'width=400,height=250');
        
    // If the new window opens successfully, set the 'windowOpened' flag to true in localStorage
    if (timerWindow) {
        localStorage.setItem('windowOpened', 'true');
            
        // Attach an event listener to reset the 'windowOpened' flag in localStorage when the window is closed
        timerWindow.onbeforeunload = function() {
            localStorage.setItem('windowOpened', 'false');
        }
    }
}
