document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Redirect to the correct OSL-FDG index page
            window.location.href = '/osl-fdg/osl-fdg_index.html';
        });
    }
});
