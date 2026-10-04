/* ═══════════════════════════════════════════════ */
/* SOUND.JS — Synthesized UI Sound Effects         */
/* Web Audio API: 0ms Latency, Zero Dependencies   */
/* ═══════════════════════════════════════════════ */

const SoundFX = (() => {
    let ctx = null;
    let masterGain = null;
    let compressor = null;
    let isMuted = false;
    let isInitialized = false;
    const lastPlayTime = {};

    // Throttle to avoid audio glitch if clicked multiple times in quick succession
    function canPlay(key, cooldown = 45) {
        const now = performance.now();
        if (lastPlayTime[key] && now - lastPlayTime[key] < cooldown) {
            return false;
        }
        lastPlayTime[key] = now;
        return true;
    }

    // Lazy initialization of Web Audio API context on user interaction
    function getContext() {
        if (isMuted) return null;

        if (!ctx) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return null;
                ctx = new AudioCtx();

                // Dynamic compressor node to prevent clipping/distortion
                compressor = ctx.createDynamicsCompressor();
                compressor.threshold.setValueAtTime(-18, ctx.currentTime);
                compressor.knee.setValueAtTime(12, ctx.currentTime);
                compressor.ratio.setValueAtTime(8, ctx.currentTime);
                compressor.attack.setValueAtTime(0.003, ctx.currentTime);
                compressor.release.setValueAtTime(0.12, ctx.currentTime);

                // Master gain for pleasant, comfortable listening volume
                masterGain = ctx.createGain();
                masterGain.gain.setValueAtTime(0.24, ctx.currentTime);

                compressor.connect(masterGain);
                masterGain.connect(ctx.destination);
            } catch (err) {
                console.warn('AudioContext not supported or blocked:', err);
                return null;
            }
        }

        if (ctx && ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        return ctx;
    }

    // Micro transient click for crisp physical tactile feel
    function addTransientClick(audioCtx, dest, startTime, volume = 0.08) {
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, startTime);
            osc.frequency.exponentialRampToValueAtTime(100, startTime + 0.012);

            gain.gain.setValueAtTime(volume, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.012);

            osc.connect(gain);
            gain.connect(dest);

            osc.start(startTime);
            osc.stop(startTime + 0.014);
        } catch (_) {}
    }

    // ─── 1. Photoshop (Ps): Cool Glass Precision Chime ───
    function playPhotoshop() {
        if (!canPlay('ps')) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        addTransientClick(c, compressor, now, 0.09);

        // Fundamental tone E5 (659.25Hz) with subtle glass glide
        const osc1 = c.createOscillator();
        const gain1 = c.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);
        osc1.frequency.linearRampToValueAtTime(740, now + 0.03);
        osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.22);

        gain1.gain.setValueAtTime(0.32, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

        // High shimmer overtone E6 (1318.5Hz)
        const osc2 = c.createOscillator();
        const gain2 = c.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.5, now);
        gain2.gain.setValueAtTime(0.14, now);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc1.connect(gain1);
        gain1.connect(compressor);
        osc2.connect(gain2);
        gain2.connect(compressor);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.28);
        osc2.stop(now + 0.18);
    }

    // ─── 2. Illustrator (Ai): Warm Vector Pluck / Marimba Snap ───
    function playIllustrator() {
        if (!canPlay('ai')) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        addTransientClick(c, compressor, now, 0.08);

        // Triangle resonant pluck D5 (587.33Hz) dropping to A4 (440Hz)
        const osc = c.createOscillator();
        const gain = c.createGain();
        const filter = c.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, now);
        filter.frequency.exponentialRampToValueAtTime(700, now + 0.18);
        filter.Q.setValueAtTime(3, now);

        gain.gain.setValueAtTime(0.36, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        // Sub body D4 (293.66Hz)
        const sub = c.createOscillator();
        const subGain = c.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(293.66, now);
        subGain.gain.setValueAtTime(0.18, now);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(compressor);

        sub.connect(subGain);
        subGain.connect(compressor);

        osc.start(now);
        sub.start(now);
        osc.stop(now + 0.24);
        sub.stop(now + 0.16);
    }

    // ─── 3. JavaScript (JS): Snappy Cyber Bubble Pop / Arcade Chirp ───
    function playJavaScript() {
        if (!canPlay('js')) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        addTransientClick(c, compressor, now, 0.12);

        // Fast downward sweep: 1120Hz -> 480Hz
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1120, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.065);

        gain.gain.setValueAtTime(0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        // Digital overtone
        const squareOsc = c.createOscillator();
        const squareGain = c.createGain();
        squareOsc.type = 'triangle';
        squareOsc.frequency.setValueAtTime(880, now);
        squareOsc.frequency.exponentialRampToValueAtTime(330, now + 0.05);

        squareGain.gain.setValueAtTime(0.14, now);
        squareGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

        osc.connect(gain);
        gain.connect(compressor);

        squareOsc.connect(squareGain);
        squareGain.connect(compressor);

        osc.start(now);
        squareOsc.start(now);
        osc.stop(now + 0.18);
        squareOsc.stop(now + 0.1);
    }

    // ─── 4. HTML5: Grounded Digital Pulse ───
    function playHTML5() {
        if (!canPlay('html')) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        addTransientClick(c, compressor, now, 0.09);

        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.linearRampToValueAtTime(523.25, now + 0.025);
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.18);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

        // Sub bass layer
        const sub = c.createOscillator();
        const subGain = c.createGain();
        sub.type = 'sine';
        sub.frequency.setValueAtTime(130.81, now);
        subGain.gain.setValueAtTime(0.22, now);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        osc.connect(gain);
        gain.connect(compressor);
        sub.connect(subGain);
        subGain.connect(compressor);

        osc.start(now);
        sub.start(now);
        osc.stop(now + 0.25);
        sub.stop(now + 0.16);
    }

    // ─── 5. CSS3: Smooth Upward Laser Shimmer ───
    function playCSS3() {
        if (!canPlay('css')) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        addTransientClick(c, compressor, now, 0.07);

        // Upward sweep from 523.25Hz (C5) to 880Hz (A5)
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

        // Sparkling overtone
        const overtone = c.createOscillator();
        const overGain = c.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(1046.5, now);
        overtone.frequency.exponentialRampToValueAtTime(1760, now + 0.07);
        overGain.gain.setValueAtTime(0.12, now);
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

        osc.connect(gain);
        gain.connect(compressor);
        overtone.connect(overGain);
        overGain.connect(compressor);

        osc.start(now);
        overtone.start(now);
        osc.stop(now + 0.28);
        overtone.stop(now + 0.2);
    }

    // ─── 6. Figma: Playful 3-Tone Arpeggio Bloom ───
    function playFigma() {
        if (!canPlay('figma')) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        addTransientClick(c, compressor, now, 0.07);

        const notes = [659.25, 830.61, 1046.50]; // E5, G#5, C6
        notes.forEach((freq, idx) => {
            const noteTime = now + idx * 0.035;
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, noteTime);

            gain.gain.setValueAtTime(0.001, noteTime);
            gain.gain.linearRampToValueAtTime(0.24 - idx * 0.03, noteTime + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.22);

            osc.connect(gain);
            gain.connect(compressor);

            osc.start(noteTime);
            osc.stop(noteTime + 0.24);
        });
    }

    // ─── 7. Nav Brand Logo (<MFR />): Executive Power Chime ───
    function playNavLogo() {
        if (!canPlay('nav-logo', 90)) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        addTransientClick(c, compressor, now, 0.1);

        // Harmonious chord: C5 (523.25Hz) + G5 (783.99Hz) + bell C6 (1046.5Hz)
        const chord = [
            { freq: 523.25, type: 'triangle', vol: 0.22, dur: 0.44 },
            { freq: 783.99, type: 'sine',     vol: 0.18, dur: 0.40 },
            { freq: 1046.5, type: 'sine',     vol: 0.14, dur: 0.34 },
            { freq: 2093.0, type: 'sine',     vol: 0.05, dur: 0.22 }
        ];

        chord.forEach(item => {
            const osc = c.createOscillator();
            const gain = c.createGain();

            osc.type = item.type;
            osc.frequency.setValueAtTime(item.freq, now);

            gain.gain.setValueAtTime(item.vol, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur);

            osc.connect(gain);
            gain.connect(compressor);

            osc.start(now);
            osc.stop(now + item.dur + 0.02);
        });
    }

    // ─── 8. Mascot: Cute Bouncy Chirp ───
    function playMascot() {
        if (!canPlay('mascot')) return;
        const c = getContext();
        if (!c) return;

        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1480, now + 0.08);

        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc.connect(gain);
        gain.connect(compressor);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // ─── Dispatcher for tech logo type ───
    function playTech(type) {
        const cleanType = (type || '').toLowerCase();
        switch (cleanType) {
            case 'ps':
            case 'photoshop':
                playPhotoshop();
                break;
            case 'ai':
            case 'illustrator':
                playIllustrator();
                break;
            case 'js':
            case 'javascript':
                playJavaScript();
                break;
            case 'html':
            case 'html5':
                playHTML5();
                break;
            case 'css':
            case 'css3':
                playCSS3();
                break;
            case 'figma':
                playFigma();
                break;
            default:
                playJavaScript();
                break;
        }
    }

    // Attach listeners to all logos at the start of the page
    function init() {
        if (isInitialized) return;
        isInitialized = true;

        // Auto-unlock audio context on first user pointer/key interaction
        const unlockAudio = () => {
            getContext();
            window.removeEventListener('pointerdown', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
        window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
        window.addEventListener('keydown', unlockAudio, { once: true, passive: true });

        // Nav logo (<MFR />)
        const navLogo = document.getElementById('nav-logo');
        if (navLogo) {
            navLogo.addEventListener('click', () => {
                playNavLogo();
                navLogo.classList.remove('is-pop');
                void navLogo.offsetWidth;
                navLogo.classList.add('is-pop');
            });
        }

        // Preloader logo
        const loaderLogo = document.querySelector('.loader-logo-wrap');
        if (loaderLogo) {
            loaderLogo.style.cursor = 'pointer';
            loaderLogo.addEventListener('click', () => {
                playNavLogo();
            });
        }

        // Mascot
        const navMascot = document.getElementById('nav-mascot');
        if (navMascot) {
            navMascot.style.cursor = 'pointer';
            navMascot.addEventListener('click', () => {
                playMascot();
                navMascot.classList.remove('is-bounce');
                void navMascot.offsetWidth;
                navMascot.classList.add('is-bounce');
            });
        }
    }

    return {
        init,
        playTech,
        playPhotoshop,
        playIllustrator,
        playJavaScript,
        playHTML5,
        playCSS3,
        playFigma,
        playNavLogo,
        playMascot
    };
})();
