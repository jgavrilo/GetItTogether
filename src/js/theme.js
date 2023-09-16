// Update CSS variables based on stored colors
document.documentElement.style.setProperty('--primary-color', localStorage.getItem('primaryColor') || '#1a1a1a');
document.documentElement.style.setProperty('--secondary-color', localStorage.getItem('secondaryColor') || '#ffffff');
