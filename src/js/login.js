let isLoggedIn = false;  // Variable to keep track of login state

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('loginButton');

  // Initialize button text based on login state
  loginButton.textContent = isLoggedIn ? 'Log Out' : 'Login with Google';

  // Attach click event listener to the login button
  loginButton.addEventListener('click', function() {
    if (!isLoggedIn) {
      // If not logged in, attempt to log in
      chrome.runtime.sendMessage({ message: 'login' });
    } else {
      // If already logged in, log out
      // TODO: Implement logout logic here
      isLoggedIn = false;
      loginButton.textContent = 'Login with Google';
    }
  });
});

// Listen for login message from content script or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'login') {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      if (chrome.runtime.lastError) {
        // TODO: Handle this error in a user-friendly way
        console.log(chrome.runtime.lastError);
        return;
      }
      // Use the token to make API requests
      isLoggedIn = true;  // Update login state
      document.getElementById('loginButton').textContent = 'Log Out';  // Update button text
    });
  }
});
