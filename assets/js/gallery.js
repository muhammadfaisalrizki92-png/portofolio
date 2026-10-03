/* ═══════════════════════════════════════════════ */
/* GALLERY.JS — 3-Row Draggable & Infinite Marquee */
/* ═══════════════════════════════════════════════ */

const GalleryModule = (() => {

    function setupRow(container) {
        const outer = container.querySelector('.gallery-track-outer');
        const track = container.querySelector('.gallery-track');
        const prevBtn = container.querySelector('.gallery-nav-btn--prev');
        const nextBtn = container.querySelector('.gallery-nav-btn--next');
        const direction = track.dataset.direction || 'left';

        if (!outer || !track) return;

        let isDown = false;
        let startX = 0;
        let scrollStart = 0;
        let moved = false;
        let isHovered = false;
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let rafId = null;

        // Clone cards once for infinite continuous scroll effect
        const originalCards = Array.from(track.children);
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('is-clone');
            track.appendChild(clone);
        });

        // Set initial scroll offset for 'right' direction so it has room to scroll both ways
        if (direction === 'right') {
            outer.scrollLeft = (track.scrollWidth - outer.clientWidth) / 2;
        }

        // ─── Drag Events (Mouse) ───
        outer.addEventListener('mousedown', (e) => {
            isDown = true;
            moved = false;
            startX = e.pageX;
            scrollStart = outer.scrollLeft;
            lastX = e.pageX;
            lastTime = Date.now();
            velocity = 0;
            outer.classList.add('is-dragging');
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            const diff = e.pageX - startX;
            if (Math.abs(diff) > 5) {
                moved = true;
            }
            outer.scrollLeft = scrollStart - diff;

            const now = Date.now();
            const dt = Math.max(1, now - lastTime);
            velocity = (e.pageX - lastX) / dt;
            lastX = e.pageX;
            lastTime = now;
        });

        window.addEventListener('mouseup', () => {
            if (!isDown) return;
            isDown = false;
            outer.classList.remove('is-dragging');

            // Apply inertia glide
            if (Math.abs(velocity) > 0.2) {
                let v = velocity * 15;
                const glide = () => {
                    if (Math.abs(v) < 0.5 || isDown) return;
                    outer.scrollLeft -= v;
                    v *= 0.92;
                    requestAnimationFrame(glide);
                };
                requestAnimationFrame(glide);
            }
        });

        // ─── Touch Events (Mobile) ───
        outer.addEventListener('touchstart', (e) => {
            moved = false;
            startX = e.touches[0].pageX;
            scrollStart = outer.scrollLeft;
            isHovered = true;
        }, { passive: true });

        outer.addEventListener('touchmove', (e) => {
            const diff = e.touches[0].pageX - startX;
            if (Math.abs(diff) > 5) moved = true;
        }, { passive: true });

        outer.addEventListener('touchend', () => {
            setTimeout(() => { isHovered = false; }, 1000);
        });

        // ─── Hover Pause ───
        container.addEventListener('mouseenter', () => { isHovered = true; });
        container.addEventListener('mouseleave', () => { isHovered = false; });

        // ─── Button Navigation ───
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                outer.scrollBy({ left: -320, behavior: 'smooth' });
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                outer.scrollBy({ left: 320, behavior: 'smooth' });
            });
        }

        // ─── Auto Drift Animation Frame ───
        const speed = direction === 'right' ? -0.55 : 0.55;
        function autoDrift() {
            if (!isHovered && !isDown) {
                outer.scrollLeft += speed;

                // Infinite wrap check
                const maxScroll = track.scrollWidth / 2;
                if (speed > 0 && outer.scrollLeft >= maxScroll) {
                    outer.scrollLeft -= maxScroll;
                } else if (speed < 0 && outer.scrollLeft <= 0) {
                    outer.scrollLeft += maxScroll;
                }
            }
            rafId = requestAnimationFrame(autoDrift);
        }
        rafId = requestAnimationFrame(autoDrift);

        // ─── Lightbox Trigger on Click (only if not dragged) ───
        track.addEventListener('click', (e) => {
            if (moved) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            const card = e.target.closest('.gallery-card');
            if (!card) return;

            const fullImg = card.dataset.img;
            const caption = card.dataset.caption || '';

            if (typeof LightboxModule !== 'undefined' && fullImg) {
                // Collect all unique cards across all rows
                const allCards = Array.from(document.querySelectorAll('.gallery-card:not(.is-clone)'));
                const items = allCards.map(c => ({
                    src: c.dataset.img,
                    caption: c.dataset.caption || ''
                }));
                const clickedIndex = allCards.findIndex(c => c.dataset.img === fullImg);
                LightboxModule.open(items, Math.max(0, clickedIndex));
            }
        });
    }

    function init() {
        const containers = document.querySelectorAll('.gallery-row-container');
        containers.forEach(setupRow);
    }

    return { init };
})();
