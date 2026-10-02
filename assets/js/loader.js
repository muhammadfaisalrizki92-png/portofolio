/* ═══════════════════════════════════════════════ */
/* LOADER.JS — Cinematic Preloader Controller      */
/* ═══════════════════════════════════════════════ */

const LoaderModule = (() => {
    let loaderEl = null;
    let progressBar = null;
    let percentText = null;
    let statusText = null;

    let currentProgress = 0;
    let targetProgress = 15;
    let isWindowLoaded = false;
    let isCompleted = false;

    const statusMilestones = [
        { threshold: 0, text: 'Menginisialisasi sistem...' },
        { threshold: 30, text: 'Memuat aset visual & kreatif...' },
        { threshold: 60, text: 'Menyiapkan komponen web...' },
        { threshold: 85, text: 'Menyempurnakan antarmuka...' },
        { threshold: 100, text: 'Selamat datang! ✨' }
    ];

    function updateStatus(val) {
        if (!statusText) return;
        let matched = statusMilestones[0].text;
        for (let i = 0; i < statusMilestones.length; i++) {
            if (val >= statusMilestones[i].threshold) {
                matched = statusMilestones[i].text;
            }
        }
        if (statusText.textContent !== matched) {
            statusText.style.opacity = '0';
            setTimeout(() => {
                statusText.textContent = matched;
                statusText.style.opacity = '1';
            }, 120);
        }
    }

    function step() {
        if (isCompleted) return;

        // Easing interpolation
        const diff = targetProgress - currentProgress;
        const speed = isWindowLoaded ? 0.12 : 0.04;
        currentProgress += diff * speed;

        // Round progress for display
        const displayVal = Math.min(100, Math.floor(currentProgress));

        if (progressBar) {
            progressBar.style.width = `${currentProgress}%`;
        }
        if (percentText) {
            percentText.textContent = `${displayVal}%`;
        }

        updateStatus(displayVal);

        // Check if finished
        if (currentProgress >= 99.5 && isWindowLoaded) {
            completeLoader();
            return;
        }

        // Increment targetProgress gradually if still waiting
        if (!isWindowLoaded) {
            if (targetProgress < 85) {
                targetProgress += 0.25;
            }
        } else {
            targetProgress = 100;
        }

        requestAnimationFrame(step);
    }

    function completeLoader() {
        if (isCompleted) return;
        isCompleted = true;

        currentProgress = 100;
        if (progressBar) progressBar.style.width = '100%';
        if (percentText) percentText.textContent = '100%';
        updateStatus(100);

        // Slight pause at 100% so user registers completion
        setTimeout(() => {
            if (!loaderEl) return;

            // Trigger curtain split outro
            loaderEl.classList.add('loader-finished');
            document.body.classList.remove('is-loading');

            // Trigger Hero section reveal entrance
            triggerHeroEntrance();

            // After curtain transition completes, hide loader completely
            setTimeout(() => {
                loaderEl.classList.add('loader-hidden');
            }, 1000);
        }, 220);
    }

    function triggerHeroEntrance() {
        // Cascade hero reveals smoothly as curtain parts
        const heroReveals = document.querySelectorAll('#hero .reveal');
        heroReveals.forEach((el, idx) => {
            setTimeout(() => {
                el.classList.add('active');
            }, 250 + idx * 120);
        });

        // Also trigger tilt card entrance
        const tiltCard = document.querySelector('.tilt-card-wrapper');
        if (tiltCard) {
            setTimeout(() => {
                tiltCard.classList.add('active');
            }, 500);
        }
    }

    let initialized = false;

    function init() {
        if (initialized) return;
        loaderEl = document.getElementById('page-loader');
        if (!loaderEl) return;
        initialized = true;

        progressBar = document.getElementById('loader-progress-bar');
        percentText = document.getElementById('loader-percent');
        statusText = document.getElementById('loader-status-text');

        // Lock scroll initially
        document.body.classList.add('is-loading');

        // Start animation frame loop
        requestAnimationFrame(step);

        // Mark window loaded with minimum display guarantee for smooth feel
        const startTime = Date.now();
        const minDuration = 1200; // minimum duration in ms

        const markLoaded = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, minDuration - elapsed);

            setTimeout(() => {
                isWindowLoaded = true;
                targetProgress = 100;
            }, remaining);
        };

        if (document.readyState === 'complete') {
            markLoaded();
        } else {
            window.addEventListener('load', markLoaded);
        }

        // Safety fallback timeout: never hang more than 2.8s
        setTimeout(() => {
            if (!isCompleted) {
                isWindowLoaded = true;
                targetProgress = 100;
            }
        }, 2800);
    }

    // Auto-init as early as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init();
    }

    return {
        init,
        complete: completeLoader
    };
})();
