/* ═══════════════════════════════════════════════ */
/* NAVIGATION.JS — Sticky Nav, Smooth Scroll,     */
/*                  Active State, Mobile Menu      */
/* ═══════════════════════════════════════════════ */

const Navigation = (() => {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    let isMenuOpen = false;

    // ─── Sticky Navbar on Scroll ───
    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ─── Active Link via IntersectionObserver ───
    function setupActiveLink() {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach((link) => {
                        link.classList.toggle('active', link.dataset.section === id);
                    });
                }
            });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));
    }

    // ─── Mobile Menu Toggle ───
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        hamburger.classList.toggle('active', isMenuOpen);
        navMenu.classList.toggle('active', isMenuOpen);
        mobileOverlay.classList.toggle('active', isMenuOpen);
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }

    function closeMenu() {
        if (!isMenuOpen) return;
        isMenuOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ─── Event Listeners ───
    function init() {
        // Scroll event (throttled)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Mobile menu
        hamburger.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', closeMenu);

        // Close mobile menu on link click
        navLinks.forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        // Close mobile menu on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Active link tracking
        setupActiveLink();

        // Initial check
        handleScroll();
    }

    return { init };
})();
