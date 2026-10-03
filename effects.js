/* ═══════════════════════════════════════════════ */
/* EFFECTS.JS — Floating Tech Logos & Global FX    */
/* ═══════════════════════════════════════════════ */

const Effects = (() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    // ─── 1. Floating tech logos: mouse parallax + click burst ───
    function setupTechOrbit() {
        const orbit = document.getElementById('tech-orbit');
        const hero = document.getElementById('hero');
        if (!orbit || !hero) return;

        const items = orbit.querySelectorAll('.tech-item');

        if (finePointer && !reduceMotion) {
            let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

            const tick = () => {
                cx += (tx - cx) * 0.08;
                cy += (ty - cy) * 0.08;
                items.forEach((item) => {
                    const depth = parseFloat(item.dataset.depth) || 1;
                    item.style.transform = `translate3d(${cx * depth * -16}px, ${cy * depth * -16}px, 0)`;
                });
                if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
                    raf = requestAnimationFrame(tick);
                } else {
                    raf = null;
                }
            };

            hero.addEventListener('mousemove', (e) => {
                const r = hero.getBoundingClientRect();
                tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
                ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
                if (!raf) raf = requestAnimationFrame(tick);
            }, { passive: true });

            hero.addEventListener('mouseleave', () => {
                tx = 0;
                ty = 0;
                if (!raf) raf = requestAnimationFrame(tick);
            });
        }

        items.forEach((item) => {
            item.addEventListener('click', () => burst(item));
        });
    }

    function burst(item) {
        const badge = item.querySelector('.tech-badge');
        if (!badge) return;
        const color = getComputedStyle(badge).getPropertyValue('--glow').trim() || '#6c63ff';

        for (let i = 0; i < 10; i++) {
            const spark = document.createElement('span');
            spark.className = 'tech-spark';
            const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
            const dist = 38 + Math.random() * 30;
            spark.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            spark.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
            spark.style.background = color;
            spark.style.boxShadow = `0 0 8px ${color}`;
            badge.appendChild(spark);
            spark.addEventListener('animationend', () => spark.remove());
        }

        badge.classList.remove('is-pop');
        void badge.offsetWidth; // restart animation
        badge.classList.add('is-pop');
    }

    // ─── 2. Typewriter role line in hero ───
    function setupTypewriter() {
        const el = document.getElementById('hero-role-text');
        if (!el) return;
        const words = (el.dataset.words || '').split('|').filter(Boolean);
        if (!words.length) return;

        if (reduceMotion) {
            el.textContent = words[0];
            return;
        }

        let w = 0, c = 0, deleting = false;
        const loop = () => {
            const word = words[w];
            if (!deleting) {
                c++;
                el.textContent = word.slice(0, c);
                if (c === word.length) {
                    deleting = true;
                    return setTimeout(loop, 1800);
                }
                return setTimeout(loop, 85);
            }
            c--;
            el.textContent = word.slice(0, c);
            if (c === 0) {
                deleting = false;
                w = (w + 1) % words.length;
                return setTimeout(loop, 350);
            }
            setTimeout(loop, 40);
        };
        setTimeout(loop, 1600);
    }

    // ─── 3. Constellation particle background ───
    function setupParticles() {
        const canvas = document.getElementById('fx-particles');
        if (!canvas) return;
        if (reduceMotion) {
            canvas.remove();
            return;
        }

        const ctx = canvas.getContext('2d');
        const colors = ['108,99,255', '0,212,170', '59,130,246'];
        const LINK = 130;
        const MOUSE_LINK = 170;
        const mouse = { x: -9999, y: -9999 };
        let w = 0, h = 0, particles = [], running = true;

        const make = () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.6 + 0.6,
            c: colors[Math.floor(Math.random() * colors.length)],
        });

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const target = Math.round(Math.min(w < 768 ? 32 : 70, (w * h) / 16000));
            while (particles.length < target) particles.push(make());
            particles.length = target;
        };

        const draw = () => {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;

                // Link to cursor + gentle repel
                const mdx = p.x - mouse.x;
                const mdy = p.y - mouse.y;
                const md = Math.sqrt(mdx * mdx + mdy * mdy);
                if (md < MOUSE_LINK) {
                    ctx.strokeStyle = `rgba(${p.c},${(1 - md / MOUSE_LINK) * 0.45})`;
                    ctx.lineWidth = 0.7;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    if (md > 0 && md < 90) {
                        const f = (1 - md / 90) * 0.8;
                        p.x += (mdx / md) * f;
                        p.y += (mdy / md) * f;
                    }
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.c},0.75)`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 < LINK * LINK) {
                        ctx.strokeStyle = `rgba(${p.c},${(1 - Math.sqrt(d2) / LINK) * 0.22})`;
                        ctx.lineWidth = 0.6;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        };

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 150);
        });

        if (finePointer) {
            window.addEventListener('mousemove', (e) => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            }, { passive: true });
            document.addEventListener('mouseleave', () => {
                mouse.x = -9999;
                mouse.y = -9999;
            });
        }

        // Pause when tab is hidden to save battery
        document.addEventListener('visibilitychange', () => {
            const wasRunning = running;
            running = !document.hidden;
            if (running && !wasRunning) requestAnimationFrame(draw);
        });

        resize();
        requestAnimationFrame(draw);
    }

    // ─── 4. Soft glow that follows the cursor ───
    function setupCursorGlow() {
        const glow = document.getElementById('cursor-glow');
        if (!glow) return;
        if (!finePointer || reduceMotion) {
            glow.remove();
            return;
        }

        let x = window.innerWidth / 2, y = window.innerHeight / 2, cx = x, cy = y;
        window.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
            glow.classList.add('is-active');
        }, { passive: true });
        document.addEventListener('mouseleave', () => glow.classList.remove('is-active'));

        const loop = () => {
            cx += (x - cx) * 0.12;
            cy += (y - cy) * 0.12;
            glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(loop);
        };
        loop();
    }

    // ─── 5. Scroll progress bar + timeline progress line ───
    function setupScrollFx() {
        const bar = document.getElementById('scroll-progress');
        const timeline = document.querySelector('.timeline');
        let items = [];

        if (timeline) {
            const fill = document.createElement('div');
            fill.className = 'timeline-progress';
            fill.setAttribute('aria-hidden', 'true');
            const head = document.createElement('div');
            head.className = 'timeline-progress-head';
            head.setAttribute('aria-hidden', 'true');
            // Prepend (not append) so `.timeline-item:last-child` still matches
            timeline.prepend(head);
            timeline.prepend(fill);
            items = Array.from(timeline.querySelectorAll('.timeline-item'));
        }

        let ticking = false;
        const update = () => {
            ticking = false;
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const p = max > 0 ? window.scrollY / max : 0;
            if (bar) bar.style.transform = `scaleX(${p})`;

            if (timeline) {
                const r = timeline.getBoundingClientRect();
                const line = window.innerHeight * 0.6;
                const tp = Math.min(1, Math.max(0, (line - r.top) / r.height));
                timeline.style.setProperty('--tp', tp.toFixed(4));
                items.forEach((item) => {
                    const dotY = item.getBoundingClientRect().top + 12;
                    item.classList.toggle('is-lit', dotY < line);
                });
            }
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        }, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    // ─── 6. Varied reveal styles per element type ───
    function setupRevealVariants() {
        const assign = (selector, cls) => {
            document.querySelectorAll(selector).forEach((el) => {
                if (el.closest('#hero') || el.classList.contains('active')) return;
                el.classList.add(cls, 'fx-revealing');

                // Remove the long transition once revealed so hover stays snappy
                const mo = new MutationObserver(() => {
                    if (el.classList.contains('active')) {
                        mo.disconnect();
                        setTimeout(() => el.classList.remove('fx-revealing'), 1000);
                    }
                });
                mo.observe(el, { attributes: true, attributeFilter: ['class'] });
            });
        };

        assign('.section-subtitle.reveal', 'reveal--blur');
        assign('.filter-bar.reveal', 'reveal--blur');
        assign('.section-tag.reveal', 'reveal--zoom');
        assign('.skill-category.reveal', 'reveal--zoom');
        assign('.project-card.reveal', 'reveal--flip');
        assign('.timeline-item.reveal', 'reveal--right');

        // Stagger index for skill-card pop-in
        document.querySelectorAll('.skill-grid').forEach((grid) => {
            grid.querySelectorAll('.skill-card').forEach((card, i) => {
                card.style.setProperty('--i', i);
            });
        });
    }

    // ─── 7. Spotlight glow inside cards ───
    function setupSpotlight() {
        if (!finePointer) return;
        document.querySelectorAll('.project-card, .skill-card, .timeline-content, .contact-link-card').forEach((card) => {
            const spot = document.createElement('span');
            spot.className = 'fx-spot';
            spot.setAttribute('aria-hidden', 'true');
            card.appendChild(spot);

            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--sx', `${e.clientX - r.left}px`);
                card.style.setProperty('--sy', `${e.clientY - r.top}px`);
            }, { passive: true });
        });
    }

    // ─── 8. Magnetic buttons (uses `translate` so hover transforms still work) ───
    function setupMagnetic() {
        if (!finePointer || reduceMotion) return;
        document.querySelectorAll('.btn-hero-resume, .btn-hero-projects, .nav-cta').forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.25;
                const y = (e.clientY - r.top - r.height / 2) * 0.35;
                el.style.translate = `${x}px ${y}px`;
            });
            el.addEventListener('mouseleave', () => {
                el.style.translate = '0px 0px';
            });
        });
    }

    // ─── 9. Ripple on button press ───
    function setupRipple() {
        document.addEventListener('pointerdown', (e) => {
            const btn = e.target.closest('.btn, .filter-btn, .nav-cta');
            if (!btn) return;
            const r = btn.getBoundingClientRect();
            const size = Math.max(r.width, r.height) * 2;
            const ripple = document.createElement('span');
            ripple.className = 'fx-ripple';
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - r.left - size / 2}px`;
            ripple.style.top = `${e.clientY - r.top - size / 2}px`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    }

    // ─── Init ───
    function init() {
        setupTechOrbit();
        setupTypewriter();
        setupParticles();
        setupCursorGlow();
        setupScrollFx();
        setupRevealVariants();
        setupSpotlight();
        setupMagnetic();
        setupRipple();
    }

    return { init };
})();
