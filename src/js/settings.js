// Define preset palettes
const palettes = {
    palette1: { primary: '#000000', secondary: '#00FF00', third: '#0000FF', fourth: '#FF00FF' },
    palette2: { primary: '#FFFFFF', secondary: '#0F0F0F', third: '#0000FF', fourth: '#FF00FF' },
    palette3: { primary: '#000000', secondary: '#654321', third: '#0000FF', fourth: '#FF00FF' },
};


//Colors
document.addEventListener('DOMContentLoaded', function() {
    // Load saved colors from local storage
    const primaryColor = localStorage.getItem('primaryColor') || palettes.palette1.primary;
    const secondaryColor = localStorage.getItem('secondaryColor') || palettes.palette1.secondary;
    const thirdColor = localStorage.getItem('thirdColor') || palettes.palette1.third;
    const fourthColor =  localStorage.getItem('fourthColor') || palettes.palette1.fourth;

    // Set the input fields with the saved colors
    document.getElementById('primaryColor').value = primaryColor;
    document.getElementById('secondaryColor').value = secondaryColor;
    document.getElementById('thirdColor').value = thirdColor;
    document.getElementById('fourthColor').value = fourthColor;

    // Attach event listeners to the tab buttons
    document.getElementById('colorsTab').addEventListener('click', function(event) {
        openTab(event, 'Colors');
    });

    document.getElementById('syncTab').addEventListener('click', function(event) {
        openTab(event, 'Sync');
    });

    // Listen for form submission
    document.getElementById('settingsForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get selected colors
        const selectedPrimaryColor = document.getElementById('primaryColor').value;
        const selectedSecondaryColor = document.getElementById('secondaryColor').value;
        const selectedThirdColor = document.getElementById('thirdColor').value;
        const selectedFourTextColor = document.getElementById('fourthColor').value;

        // Save selected colors to local storage
        localStorage.setItem('primaryColor', selectedPrimaryColor);
        localStorage.setItem('secondaryColor', selectedSecondaryColor);
        localStorage.setItem('thirdColor', selectedThirdColor);
        localStorage.setItem('fourthColor', selectedFourTextColor);

        // Update colors immediately
        updateColors();
    });

// Toggle between custom and preset palettes
function toggleView() {
    const presetPalettes = document.getElementById('presetPalettes');
    const customColors = document.getElementById('customColors');
    if (presetPalettes.style.display === 'none' || presetPalettes.style.display === '') {
        presetPalettes.style.display = 'block';
        customColors.style.display = 'none';
    } else {
        presetPalettes.style.display = 'none';
        customColors.style.display = 'block';
    }
}

// Event listener for the "Custom" button
document.getElementById('palette4').addEventListener('click', toggleView);

// Event listener for the "Back" button
document.getElementById('backToPalettes').addEventListener('click', toggleView);

// Dynamically set the colors of each palette button
Object.keys(palettes).forEach(id => {
    const paletteButton = document.getElementById(id);
    ['primary', 'secondary', 'third', 'fourth'].forEach((colorType, index) => {
        const colorPart = document.createElement('div');
        colorPart.className = 'color-part';
        colorPart.style.backgroundColor = palettes[id][colorType];
        paletteButton.appendChild(colorPart);
    });
});

// Add event listeners to palette buttons
const paletteButtons = document.querySelectorAll('.palette-button');
paletteButtons.forEach(button => {
    button.addEventListener('click', function() {
        const id = this.id;
        if (id === 'palette4') {
            // Handle custom palette
        } else {
            // Set colors based on the selected palette
            const selectedPalette = palettes[id];
            document.getElementById('primaryColor').value = selectedPalette.primary;
            document.getElementById('secondaryColor').value = selectedPalette.secondary;
            document.getElementById('thirdColor').value = selectedPalette.third;
            document.getElementById('fourthColor').value = selectedPalette.fourth;
            
            // Save to local storage and update colors
            localStorage.setItem('primaryColor', selectedPalette.primary);
            localStorage.setItem('secondaryColor', selectedPalette.secondary);
            localStorage.setItem('thirdColor', selectedPalette.third);
            localStorage.setItem('fourthColor', selectedPalette.fourth);

            updateColors();
        }
    });
});


});

//Tabs
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}


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
      // If already logged in, log out (you'll need to implement logout logic)
      // For example, you could revoke the token
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
        console.log(chrome.runtime.lastError);
        return;
      }
      // Use the token to make API requests.
      isLoggedIn = true;  // Update login state
      document.getElementById('loginButton').textContent = 'Log Out';  // Update button text
    });
  }
});
