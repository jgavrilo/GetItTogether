document.addEventListener('DOMContentLoaded', function() {
    // Load saved colors from local storage
    const primaryColor = localStorage.getItem('primaryColor') || '#1a1a1a';
    const secondaryColor = localStorage.getItem('secondaryColor') || '#ffffff';

    // Set the input fields with the saved colors
    document.getElementById('primaryColor').value = primaryColor;
    document.getElementById('secondaryColor').value = secondaryColor;

    // Listen for form submission
    document.getElementById('settingsForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get selected colors
        const selectedPrimaryColor = document.getElementById('primaryColor').value;
        const selectedSecondaryColor = document.getElementById('secondaryColor').value;

        // Save selected colors to local storage
        localStorage.setItem('primaryColor', selectedPrimaryColor);
        localStorage.setItem('secondaryColor', selectedSecondaryColor);

        // Update colors immediately
        updateColors();
    });
});
