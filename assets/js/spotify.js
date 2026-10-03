/* ═══════════════════════════════════════════════ */
/* SPOTIFY.JS — Floating Spotify Player Logic     */
/* ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    const SPOTIFY_PLAYLIST_ID = '4oQDhGjv57BzeOThOWQeS9';
    const SPOTIFY_EMBED_URL = `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`;

    // Elements
    const floatContainer = document.getElementById('spotify-float');
    const fab = document.getElementById('spotify-fab');
    const closeBtn = document.getElementById('spotify-close');
    const iframe = document.getElementById('spotify-iframe');

    if (!floatContainer || !fab || !iframe) return;

    let isOpen = false;
    let iframeLoaded = false;

    // ─── Show the FAB after page load (delayed for preloader) ───
    function showPlayer() {
        floatContainer.classList.add('visible');
    }

    // Wait for preloader to finish, then show
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (pageLoader.classList.contains('hidden') || pageLoader.style.display === 'none') {
                        setTimeout(showPlayer, 800);
                        observer.disconnect();
                    }
                }
            });
        });
        observer.observe(pageLoader, { attributes: true, attributeFilter: ['class', 'style'] });

        // Fallback: show after 6 seconds regardless
        setTimeout(showPlayer, 6000);
    } else {
        // No preloader, show immediately with slight delay
        setTimeout(showPlayer, 500);
    }

    // ─── Toggle Player ───
    function togglePlayer() {
        isOpen = !isOpen;
        floatContainer.classList.toggle('open', isOpen);

        // Lazy load iframe src only on first open
        if (isOpen && !iframeLoaded) {
            iframe.src = SPOTIFY_EMBED_URL;
            iframeLoaded = true;
        }

        // Update aria
        fab.setAttribute('aria-label', isOpen ? 'Close Spotify Player' : 'Open Spotify Player');
        fab.setAttribute('aria-expanded', isOpen);
    }

    function closePlayer() {
        if (isOpen) {
            isOpen = false;
            floatContainer.classList.remove('open');
            fab.setAttribute('aria-label', 'Open Spotify Player');
            fab.setAttribute('aria-expanded', 'false');
        }
    }

    // ─── Event Listeners ───
    fab.addEventListener('click', function (e) {
        e.stopPropagation();
        togglePlayer();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            closePlayer();
        });
    }

    // Close when clicking outside
    document.addEventListener('click', function (e) {
        if (isOpen && !floatContainer.contains(e.target)) {
            closePlayer();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) {
            closePlayer();
        }
    });

})();
