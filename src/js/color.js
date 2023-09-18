// Define preset palettes
const palettes = {
    palette1: { primary: '#000000', secondary: '#00FF00', third: '#0000FF', fourth: '#FF00FF' },
    palette2: { primary: '#FFFFFF', secondary: '#0F0F0F', third: '#0000FF', fourth: '#FF00FF' },
    palette3: { primary: '#000000', secondary: '#654321', third: '#0000FF', fourth: '#FF00FF' },
};

// Function to toggle between custom and preset palettes
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

// Function to update colors based on selected palette
function updatePaletteColors(id) {
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

// Event listener for when colors change
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

    // Event listeners for palette buttons
    document.getElementById('palette4').addEventListener('click', toggleView);
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

    // Event listeners to palette buttons
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