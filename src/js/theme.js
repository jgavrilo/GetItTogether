/**
 * Function to update color variables in the DOM based on local storage values.
 */
function updateColors() {
    // Set CSS variables using the values stored in local storage
    document.documentElement.style.setProperty('--primary-color', localStorage.getItem('primaryColor'));
    document.documentElement.style.setProperty('--secondary-color', localStorage.getItem('secondaryColor'));
    document.documentElement.style.setProperty('--third-color', localStorage.getItem('thirdColor'));
    document.documentElement.style.setProperty('--fourth-color', localStorage.getItem('fourthColor'));
}

// Initial call to set the colors when the page loads
updateColors();

/**
 * Event listener for changes in local storage.
 * 
 * This will update the colors if any of the relevant keys are changed.
 */
window.addEventListener('storage', function(event) {
    // List of keys we are interested in
    const colorKeys = ['primaryColor', 'secondaryColor', 'thirdColor', 'fourthColor'];

    // If the key is in our list of color keys, update the colors
    if (colorKeys.includes(event.key)) {
        updateColors();
    }
});
