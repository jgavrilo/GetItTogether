// Open seperate window that stays open
let myWindow = null;

document.getElementById('openTimer').addEventListener('click', function() {
    // Check if the window doesn't exist or it's closed
    if (!myWindow || myWindow.closed) {
        myWindow = window.open('timer.html', '', 'width=400,height=250');
    } else {
        // If the window exists, bring it to the front
        myWindow.focus();
    }
});