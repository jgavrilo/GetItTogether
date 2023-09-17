// Function to update colors
function updateColors() {
    document.documentElement.style.setProperty('--primary-color', localStorage.getItem('primaryColor'));
    document.documentElement.style.setProperty('--secondary-color', localStorage.getItem('secondaryColor'));
    document.documentElement.style.setProperty('--third-color', localStorage.getItem('thirdColor'));
    document.documentElement.style.setProperty('--fourth-color', localStorage.getItem('fourthColor'));
}

// Initial update
updateColors();

// Listen for local storage changes
window.addEventListener('storage', function(event) {
    if (['primaryColor', 'secondaryColor', 'thirdColor', 'fourthColor'].includes(event.key)) {
        updateColors();
    }
});
