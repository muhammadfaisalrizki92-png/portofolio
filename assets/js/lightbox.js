/* ═══════════════════════════════════════════════ */
/* LIGHTBOX.JS — Image Lightbox for Gallery       */
/* ═══════════════════════════════════════════════ */

const LightboxModule = (() => {

    const overlay = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentGallery = [];
    let currentIndex = 0;

    function open(gallery, index) {
        currentGallery = gallery;
        currentIndex = index;
        show();
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function show() {
        if (!currentGallery[currentIndex]) return;
        const item = currentGallery[currentIndex];
        img.src = item.src;
        img.alt = item.caption;
        caption.textContent = item.caption;

        // Toggle nav visibility
        prevBtn.style.display = currentIndex > 0 ? 'flex' : 'none';
        nextBtn.style.display = currentIndex < currentGallery.length - 1 ? 'flex' : 'none';
    }

    function prev() {
        if (currentIndex > 0) {
            currentIndex--;
            show();
        }
    }

    function next() {
        if (currentIndex < currentGallery.length - 1) {
            currentIndex++;
            show();
        }
    }

    function init() {
        if (!overlay) return;

        // Collect all gallery thumbs and attach click events
        const galleries = document.querySelectorAll('.timeline-gallery');

        galleries.forEach((galleryEl) => {
            const thumbs = galleryEl.querySelectorAll('.gallery-thumb');
            const items = [];

            thumbs.forEach((thumb, i) => {
                const src = thumb.dataset.img;
                const cap = thumb.dataset.caption || '';
                items.push({ src, caption: cap });

                thumb.addEventListener('click', () => {
                    open(items, i);
                });
            });
        });

        // Close events
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        // Navigation
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            prev();
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            next();
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('active')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        });

        // Swipe support (mobile)
        let touchStartX = 0;
        overlay.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        overlay.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 60) {
                if (diff > 0) next();
                else prev();
            }
        });
    }

    return { init, open, close };
})();
