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
  
    // Emit a custom event to notify that the tab has been switched
    const tabSwitchEvent = new Event('tabSwitched');
    document.dispatchEvent(tabSwitchEvent);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Set initial active tab
    const initialTabName = 'Colors';  // Change this to the name of the tab you want to be active initially
    document.getElementById(initialTabName).style.display = 'block';
  
    // Attach event listeners to the tab buttons
    document.getElementById('colorsTab').addEventListener('click', function(event) {
      openTab(event, 'Colors');
    });
  
    document.getElementById('alarmsTab').addEventListener('click', function(event) {
      openTab(event, 'Alarms');
    });
  });
  