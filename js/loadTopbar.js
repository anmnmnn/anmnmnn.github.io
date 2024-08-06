// loadTopbar.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('topbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('topbarContainer').innerHTML = data;
        })
        .catch(error => console.error('Error loading topbar:', error));
});
