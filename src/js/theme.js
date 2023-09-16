// Function to update colors
function updateColors() {
    document.documentElement.style.setProperty('--primary-color', localStorage.getItem('primaryColor') || '#1a1a1a');
    document.documentElement.style.setProperty('--secondary-color', localStorage.getItem('secondaryColor') || '#ffffff');
}

// Initial update
updateColors();

// Listen for local storage changes
window.addEventListener('storage', function(event) {
    if (event.key === 'primaryColor' || event.key === 'secondaryColor') {
        updateColors();
    }
});
