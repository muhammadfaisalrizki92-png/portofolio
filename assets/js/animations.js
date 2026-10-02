/* ═══════════════════════════════════════════════ */
/* ANIMATIONS.JS — Scroll Reveal & Micro-anims    */
/* ═══════════════════════════════════════════════ */

const Animations = (() => {

    // ─── Scroll Reveal via IntersectionObserver ───
    function setupScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.15,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger delay based on sibling index
                    const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                    let siblingIndex = 0;
                    siblings.forEach((sib, i) => {
                        if (sib === entry.target) siblingIndex = i;
                    });

                    const delay = Math.min(siblingIndex * 80, 400);

                    setTimeout(() => {
                        entry.target.classList.add('active');
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach((el) => observer.observe(el));
    }

    // ─── Smooth anchor scroll offset ───
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (!target) return;

                e.preventDefault();

                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            });
        });
    }

    // ─── Parallax on Hero glow ───
    function setupHeroParallax() {
        const heroGlows = document.querySelectorAll('.hero-glow');
        if (!heroGlows.length) return;

        // Only on desktop (pointer: fine)
        if (!window.matchMedia('(pointer: fine)').matches) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            heroGlows.forEach((glow, i) => {
                const factor = (i + 1) * 15;
                glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        }, { passive: true });
    }

    // ─── Init ───
    function init() {
        setupScrollReveal();
        setupSmoothScroll();
        setupHeroParallax();
    }

    return { init };
})();
