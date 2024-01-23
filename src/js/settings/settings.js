// Existing function to open tabs
function openTab(evt, tabName) {
  const tabcontent = document.getElementsByClassName("tabcontent");
  Array.from(tabcontent).forEach(tab => {
    tab.style.display = "none";
  });

  const tablinks = document.getElementsByClassName("tablinks");
  Array.from(tablinks).forEach(link => {
    link.className = link.className.replace(" active", "");
  });

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";

  // Emit a custom event to notify that the tab has been switched
  const tabSwitchEvent = new Event('tabSwitched');
  document.dispatchEvent(tabSwitchEvent);
}

// Existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
  // Set initial active tab
  const initialTabName = 'Colors';
  document.getElementById(initialTabName).style.display = 'block';

  // Attach event listeners to the tab buttons
  document.getElementById('colorsTab').addEventListener('click', function(event) {
    openTab(event, 'Colors');
  });

  document.getElementById('alarmsTab').addEventListener('click', function(event) {
    openTab(event, 'Alarms');
  });

  document.getElementById('googleAccountTab').addEventListener('click', function(event) {
    openTab(event, 'GoogleAccount');
  });

});

// New: Variable to keep track of login status
let isLoggedIn = false;

// Function to check if user is logged in without initiating login
async function checkLoginStatusWithoutLogin() {
  const savedState = localStorage.getItem('isLoggedIn');
  return savedState === 'true';
}

// Function to initiate Google login
async function initiateGoogleLogin() {
  try {
    const token = await getAuthToken();
    if (token) {
      saveLoginState(true);
      updateGoogleAccountButton();
    }
  } catch (error) {
    console.error("Error:", JSON.stringify(error, null, 2));
  }
}

// Function to get OAuth2 token
async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
}

// Function to check if user is logged in
async function checkLoginStatus() {
  try {
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    console.error("Error:", JSON.stringify(error, null, 2));
    return false;
  }
}

// Function to get user email
async function getUserEmail(token) {
  const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  return data.email;
}

// Save isLoggedIn state to localStorage
function saveLoginState(isLoggedIn) {
  localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  console.log('Login state saved:', isLoggedIn);
}

// Load isLoggedIn state from localStorage
function loadLoginState() {
  const savedState = localStorage.getItem('isLoggedIn');
  return savedState === 'true';
}

// Updated function to update button based on login status
async function updateGoogleAccountButton() {
  const loginButton = document.getElementById('googleAccountButton');
  const logoutButton = document.getElementById('googleAccountLogoutButton');
  const emailDisplay = document.getElementById('userEmail');

  if (!loginButton || !logoutButton || !emailDisplay) {
    console.error("Element(s) not found");
    return;
  }

  const isLoggedIn = await checkLoginStatusWithoutLogin();

  if (isLoggedIn) {
    try {
      const token = await getAuthToken({ 'interactive': false }); // Avoid interactive login prompt
      if (token) {
        const email = await getUserEmail(token);
        emailDisplay.textContent = `Logged in as ${email}`;
      } else {
        emailDisplay.textContent = 'Not logged in';
      }
    } catch (error) {
      console.error("Error:", JSON.stringify(error, null, 2));
      emailDisplay.textContent = 'Error fetching user info';
    }

    loginButton.style.display = 'none';
    logoutButton.style.display = 'block';
  } else {
    emailDisplay.textContent = 'Login to connect to your Google account';
    loginButton.style.display = 'block';
    loginButton.onclick = initiateGoogleLogin;
    logoutButton.style.display = 'none';
  }
}


// New function to handle logout
function logout() {
  // Your logout logic here
  saveLoginState(false);
  updateGoogleAccountButton();
}

// Attach event listener to the new logout button
document.getElementById('googleAccountLogoutButton').addEventListener('click', logout);
