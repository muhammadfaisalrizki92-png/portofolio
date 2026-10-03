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

    if (typeof GalleryModule !== 'undefined') {
        GalleryModule.init();
    }

    console.log(
        '%c⚡ Portfolio loaded successfully',
        'color: #6c63ff; font-weight: bold; font-size: 14px;'
    );

    // Hero portrait reveal — circle follows cursor/touch
    const portraitStage = document.getElementById('hero-portrait-stage');
    if (portraitStage) {
        // Update CSS custom properties for cursor position
        const updatePosition = (clientX, clientY) => {
            const rect = portraitStage.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            portraitStage.style.setProperty('--mx', x + 'px');
            portraitStage.style.setProperty('--my', y + 'px');
        };

        // Desktop: track mouse movement
        portraitStage.addEventListener('mousemove', (e) => {
            updatePosition(e.clientX, e.clientY);
        });

        // Reset cursor to hidden position when mouse leaves
        portraitStage.addEventListener('mouseleave', () => {
            portraitStage.style.setProperty('--mx', '-200px');
            portraitStage.style.setProperty('--my', '-200px');
        });

        // Mobile: track touch position
        portraitStage.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            updatePosition(touch.clientX, touch.clientY);
            portraitStage.classList.add('hero-portrait-stage--active');
        }, { passive: true });

        portraitStage.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            updatePosition(touch.clientX, touch.clientY);
        }, { passive: true });

        portraitStage.addEventListener('touchend', () => {
            portraitStage.classList.remove('hero-portrait-stage--active');
        }, { passive: true });

        portraitStage.addEventListener('touchcancel', () => {
            portraitStage.classList.remove('hero-portrait-stage--active');
        }, { passive: true });
    }
});
