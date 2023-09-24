// Predefined color palettes
const palettes = {
    palette1: { primary: '#FFFFFF', secondary: '#0F0F0F', third: '#0F0F0F', fourth: '#FFFFFF' },
    palette2: { primary: '#0F0F0F', secondary: '#FFFFFF', third: '#FFFFFF', fourth: '#0F0F0F' },
    palette3: { primary: '#000000', secondary: '#654321', third: '#654321', fourth: '#000000' },
};

/**
 * Toggle between displaying preset palettes and custom color selectors.
 */
function toggleView() {
    const presetPalettes = document.getElementById('presetPalettes');
    const customColors = document.getElementById('customColors');
    // Toggle visibility of palette sections
    if (presetPalettes.style.display === 'none' || presetPalettes.style.display === '') {
        presetPalettes.style.display = 'block';
        customColors.style.display = 'none';
    } else {
        presetPalettes.style.display = 'none';
        customColors.style.display = 'block';
    }
}

/**
 * Update the color input fields based on the selected palette.
 *
 * @param {string} id - ID of the selected palette.
 */
function updatePaletteColors(id) {
    const selectedPalette = palettes[id];
    // Update the input fields with the colors from the selected palette
    document.getElementById('primaryColor').value = selectedPalette.primary;
    document.getElementById('secondaryColor').value = selectedPalette.secondary;
    document.getElementById('thirdColor').value = selectedPalette.third;
    document.getElementById('fourthColor').value = selectedPalette.fourth;
    
    // Save to local storage and call the function to update the colors
    localStorage.setItem('primaryColor', selectedPalette.primary);
    localStorage.setItem('secondaryColor', selectedPalette.secondary);
    localStorage.setItem('thirdColor', selectedPalette.third);
    localStorage.setItem('fourthColor', selectedPalette.fourth);
    updateColors();
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved or default colors from local storage
    const primaryColor = localStorage.getItem('primaryColor') || palettes.palette1.primary;
    const secondaryColor = localStorage.getItem('secondaryColor') || palettes.palette1.secondary;
    const thirdColor = localStorage.getItem('thirdColor') || palettes.palette1.third;
    const fourthColor = localStorage.getItem('fourthColor') || palettes.palette1.fourth;

    // Populate the color input fields with saved or default colors
    document.getElementById('primaryColor').value = primaryColor;
    document.getElementById('secondaryColor').value = secondaryColor;
    document.getElementById('thirdColor').value = thirdColor;
    document.getElementById('fourthColor').value = fourthColor;

    // Add a submit event listener to the form
    document.getElementById('settingsForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get colors from the input fields
        const selectedPrimaryColor = document.getElementById('primaryColor').value;
        const selectedSecondaryColor = document.getElementById('secondaryColor').value;
        const selectedThirdColor = document.getElementById('thirdColor').value;
        const selectedFourthColor = document.getElementById('fourthColor').value;

        // Save the selected colors to local storage
        localStorage.setItem('primaryColor', selectedPrimaryColor);
        localStorage.setItem('secondaryColor', selectedSecondaryColor);
        localStorage.setItem('thirdColor', selectedThirdColor);
        localStorage.setItem('fourthColor', selectedFourthColor);

        // Call the function to update the colors
        updateColors();
    });

    // Add click event listeners to the toggle buttons
    document.getElementById('palette4').addEventListener('click', toggleView);
    document.getElementById('backToPalettes').addEventListener('click', toggleView);

    // Generate palette buttons dynamically based on predefined palettes
    Object.keys(palettes).forEach(id => {
        const paletteButton = document.getElementById(id);
        ['primary', 'secondary', 'third', 'fourth'].forEach((colorType, index) => {
            const colorPart = document.createElement('div');
            colorPart.className = 'color-part';
            colorPart.style.backgroundColor = palettes[id][colorType];
            paletteButton.appendChild(colorPart);
        });
    });

    // Attach click event listeners to palette buttons
    const paletteButtons = document.querySelectorAll('.palette-button');
    paletteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.id;
            if (id === 'palette4') {
                // Handle custom palette scenario
            } else {
                // Update and save colors based on the selected palette
                updatePaletteColors(id);
            }
        });
    });
});
