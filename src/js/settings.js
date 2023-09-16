document.addEventListener('DOMContentLoaded', function() {
    // Load saved colors from local storage
    const primaryColor = localStorage.getItem('primaryColor') || '#1a1a1a';
    const secondaryColor = localStorage.getItem('secondaryColor') || '#ffffff';
    const buttonColor = localStorage.getItem('buttonColor') || '#3498db';
    const buttonTextColor =  localStorage.getItem('buttonTextColor') || '#000000';
    // Set the input fields with the saved colors
    document.getElementById('primaryColor').value = primaryColor;
    document.getElementById('secondaryColor').value = secondaryColor;
    document.getElementById('buttonColor').value = buttonColor;
    document.getElementById('buttonTextColor').value = buttonTextColor;

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
        const selectedButtonColor = document.getElementById('buttonColor').value;
        const selectedButtonTextColor = document.getElementById('buttonTextColor').value;

        // Save selected colors to local storage
        localStorage.setItem('primaryColor', selectedPrimaryColor);
        localStorage.setItem('secondaryColor', selectedSecondaryColor);
        localStorage.setItem('buttonColor', selectedButtonColor);
        localStorage.setItem('buttonTextColor', selectedButtonTextColor);

        // Update colors immediately
        updateColors();
    });
});

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