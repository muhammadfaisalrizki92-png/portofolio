/* ═══════════════════════════════════════════════ */
/* APP.JS — Entry Point / Initialize All Modules  */
/* ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Loader immediately
    if (typeof LoaderModule !== 'undefined') {
        LoaderModule.init();
    }

    // Initialize all modules
    Navigation.init();
    Animations.init();
    Projects.init();
    Contact.init();
    Lanyard.init();

    if (typeof LightboxModule !== 'undefined') {
        LightboxModule.init();
    }

    console.log(
        '%c⚡ Portfolio loaded successfully',
        'color: #6c63ff; font-weight: bold; font-size: 14px;'
    );
});
