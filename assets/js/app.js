/* ═══════════════════════════════════════════════ */
/* APP.JS — Entry Point / Initialize All Modules  */
/* ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Navigation.init();
    Animations.init();
    Projects.init();
    Contact.init();
    Lanyard.init();

    console.log(
        '%c⚡ Portfolio loaded successfully',
        'color: #6c63ff; font-weight: bold; font-size: 14px;'
    );
});
