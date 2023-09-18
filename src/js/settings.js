function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    Array.from(tabcontent).forEach(tab => {
        tab.style.display = "none";
    });

    const tablinks = document.getElementsByClassName("tablinks");
    Array.from(tablinks).forEach(link => {
        link.className = link.className.replace(" active", "");
    });

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

document.addEventListener('DOMContentLoaded', function() {
    // Attach event listeners to the tab buttons
    document.getElementById('colorsTab').addEventListener('click', function(event) {
        openTab(event, 'Colors');
    });

    document.getElementById('syncTab').addEventListener('click', function(event) {
        openTab(event, 'Sync');
    });
});
