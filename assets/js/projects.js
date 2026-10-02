/* ═══════════════════════════════════════════════ */
/* PROJECTS.JS — Filter & Modal Logic              */
/* ═══════════════════════════════════════════════ */

const Projects = (() => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');

    // Modal content elements
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalBg = document.getElementById('modal-bg');
    const modalSolution = document.getElementById('modal-solution');
    const modalTools = document.getElementById('modal-tools');
    const modalResult = document.getElementById('modal-result');
    const modalLinks = document.getElementById('modal-links');

    // ─── Project Filtering ───
    function setupFilters() {
        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                projectCards.forEach((card) => {
                    const category = card.dataset.category;

                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.position = '';
                        card.style.visibility = '';
                    } else {
                        card.classList.add('hidden');
                        // Delay position change for animation
                        setTimeout(() => {
                            if (card.classList.contains('hidden')) {
                                card.style.position = 'absolute';
                                card.style.visibility = 'hidden';
                            }
                        }, 300);
                    }
                });
            });
        });
    }

    // ─── Modal Open ───
    function openModal(card) {
        // Populate modal content from data attributes
        const title = card.dataset.title || '';
        const bg = card.dataset.bg || '';
        const solution = card.dataset.solution || '';
        const tools = card.dataset.tools || '';
        const result = card.dataset.result || '';
        const github = card.dataset.github || '';
        const report = card.dataset.report || '';
        const image = card.dataset.image || '';

        modalTitle.textContent = title;
        modalBg.textContent = bg;
        modalSolution.textContent = solution;
        modalResult.textContent = result;

        // Image
        if (image) {
            modalImage.src = image;
            modalImage.alt = title;
            modalImage.parentElement.style.display = '';
        } else {
            modalImage.parentElement.style.display = 'none';
        }

        // Tools badges
        modalTools.innerHTML = '';
        if (tools) {
            tools.split(',').forEach((tool) => {
                const badge = document.createElement('span');
                badge.className = 'modal-tool-badge';
                badge.textContent = tool.trim();
                modalTools.appendChild(badge);
            });
        }

        // Links
        modalLinks.innerHTML = '';
        if (github) {
            const ghLink = document.createElement('a');
            ghLink.href = github;
            ghLink.target = '_blank';
            ghLink.rel = 'noopener noreferrer';
            ghLink.className = 'modal-link modal-link--github';
            ghLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
            `;
            modalLinks.appendChild(ghLink);
        }

        if (report && report !== '#') {
            const rpLink = document.createElement('a');
            rpLink.href = report;
            rpLink.target = '_blank';
            rpLink.rel = 'noopener noreferrer';
            rpLink.className = 'modal-link modal-link--report';
            rpLink.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                Laporan
            `;
            modalLinks.appendChild(rpLink);
        }

        if (!github && (!report || report === '#')) {
            modalLinks.style.display = 'none';
        } else {
            modalLinks.style.display = '';
        }

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    // ─── Modal Close ───
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // ─── Event Listeners ───
    function init() {
        setupFilters();

        // Open modal on card click
        projectCards.forEach((card) => {
            card.addEventListener('click', () => openModal(card));
        });

        // Close modal
        modalClose.addEventListener('click', closeModal);

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    return { init };
})();
