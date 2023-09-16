// Function to update colors
function updateColors() {
    document.documentElement.style.setProperty('--primary-color', localStorage.getItem('primaryColor') || '#1a1a1a');
    document.documentElement.style.setProperty('--secondary-color', localStorage.getItem('secondaryColor') || '#ffffff');
    document.documentElement.style.setProperty('--button-color', localStorage.getItem('buttonColor') || '#3498db');
    document.documentElement.style.setProperty('--button-text-color', localStorage.getItem('buttonTextColor') || '#000000');
}

// Initial update
updateColors();

// Listen for local storage changes
window.addEventListener('storage', function(event) {
    if (['primaryColor', 'secondaryColor', 'buttonColor', 'buttonTextColor'].includes(event.key)) {
        updateColors();
    }
});
