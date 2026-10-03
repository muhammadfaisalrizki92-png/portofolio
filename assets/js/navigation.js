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

    // ─── Mascot Indicator Position ───
    function updateMascot() {
        const mascot = document.getElementById('nav-mascot');
        const activeLink = document.querySelector('.nav-link.active');
        const navMenu = document.getElementById('nav-menu');
        if (!mascot || !activeLink || !navMenu) return;

        if (window.innerWidth <= 768) {
            mascot.style.opacity = '0';
            return;
        }

        const linkRect = activeLink.getBoundingClientRect();
        const menuRect = navMenu.getBoundingClientRect();
        const x = (linkRect.left + linkRect.width / 2) - menuRect.left;

        mascot.style.transform = `translateX(${x}px)`;
        mascot.style.opacity = '1';
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
                        const isActive = link.dataset.section === id;
                        link.classList.toggle('active', isActive);
                    });
                    updateMascot();
                }
            });
        }, observerOptions);

        sections.forEach((section) => observer.observe(section));
        
        // Also observe hero
        const heroSection = document.getElementById('hero');
        if (heroSection) observer.observe(heroSection);

        window.addEventListener('resize', updateMascot);
        setTimeout(updateMascot, 300);
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
