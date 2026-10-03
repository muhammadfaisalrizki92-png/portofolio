/* ═══════════════════════════════════════════════ */
/* LANYARD.JS — 3D Tilt Card + Lanyard Discord    */
/*              Presence Integration               */
/* ═══════════════════════════════════════════════ */

const Lanyard = (() => {

    // ═══════════════════════════════════════════
    // CONFIG — Ganti dengan Discord User ID Anda
    // ═══════════════════════════════════════════
    const DISCORD_USER_ID = '529144973824753684'; // Discord User ID Muhammad Faisal Rizki

    // ─── DOM Elements ───
    const tiltCard = document.getElementById('tilt-card');
    const tiltGlare = document.getElementById('tilt-card-glare');
    const statusDot = document.getElementById('lanyard-status-dot');
    const activityLabel = document.getElementById('lanyard-activity-label');
    const activityDetail = document.getElementById('lanyard-activity-detail');
    const spotifySection = document.getElementById('lanyard-spotify');
    const spotifyArt = document.getElementById('lanyard-spotify-art');
    const spotifySong = document.getElementById('lanyard-spotify-song');
    const spotifyArtist = document.getElementById('lanyard-spotify-artist');

    // ═══════════════════════════════════════════
    //  3D TILT CARD EFFECT
    // ═══════════════════════════════════════════

    const TILT_MAX = 18;        // Max rotation degrees
    const GLARE_MAX = 0.35;     // Max glare opacity
    const SCALE_HOVER = 1.04;   // Scale on hover
    const TRANSITION_MS = 400;  // Return-to-flat transition

    let cardRect = null;
    let isHovering = false;
    let rafId = null;

    function updateCardRect() {
        if (tiltCard) {
            cardRect = tiltCard.getBoundingClientRect();
        }
    }

    function applyTilt(clientX, clientY) {
        if (!cardRect) return;

        const x = clientX - cardRect.left;
        const y = clientY - cardRect.top;

        const centerX = cardRect.width / 2;
        const centerY = cardRect.height / 2;

        // Normalize to -1..1
        const normalX = (x - centerX) / centerX;
        const normalY = (y - centerY) / centerY;

        // Rotation (reversed for natural feel)
        const rotateY = normalX * TILT_MAX;
        const rotateX = -normalY * TILT_MAX;

        // Apply transform
        tiltCard.style.transform = `
            perspective(800px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale3d(${SCALE_HOVER}, ${SCALE_HOVER}, ${SCALE_HOVER})
        `;

        // Glare position
        if (tiltGlare) {
            const glareX = (normalX + 1) / 2 * 100;
            const glareY = (normalY + 1) / 2 * 100;
            const glareOpacity = Math.max(
                Math.abs(normalX),
                Math.abs(normalY)
            ) * GLARE_MAX;

            tiltGlare.style.background = `
                radial-gradient(
                    circle at ${glareX}% ${glareY}%,
                    rgba(255, 255, 255, ${glareOpacity}) 0%,
                    transparent 60%
                )
            `;
        }
    }

    function resetTilt() {
        tiltCard.style.transform = `
            perspective(800px)
            rotateX(0deg)
            rotateY(0deg)
            scale3d(1, 1, 1)
        `;
        tiltCard.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`;

        if (tiltGlare) {
            tiltGlare.style.background = 'transparent';
        }
    }

    function setupTiltEvents() {
        if (!tiltCard) return;

        // Mouse events
        tiltCard.addEventListener('mouseenter', () => {
            isHovering = true;
            updateCardRect();
            tiltCard.style.transition = 'transform 0.1s ease-out';
        });

        tiltCard.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                applyTilt(e.clientX, e.clientY);
            });
        });

        tiltCard.addEventListener('mouseleave', () => {
            isHovering = false;
            resetTilt();
        });

        // Touch events (mobile)
        tiltCard.addEventListener('touchstart', (e) => {
            isHovering = true;
            updateCardRect();
            tiltCard.style.transition = 'transform 0.1s ease-out';
        }, { passive: true });

        tiltCard.addEventListener('touchmove', (e) => {
            if (!isHovering || !e.touches[0]) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                applyTilt(e.touches[0].clientX, e.touches[0].clientY);
            });
        }, { passive: true });

        tiltCard.addEventListener('touchend', () => {
            isHovering = false;
            resetTilt();
        });

        // Recalculate on resize/scroll
        window.addEventListener('resize', updateCardRect, { passive: true });
        window.addEventListener('scroll', updateCardRect, { passive: true });
    }

    // ═══════════════════════════════════════════
    //  LANYARD API (Discord Presence)
    // ═══════════════════════════════════════════

    const STATUS_COLORS = {
        online: '#43b581',
        idle: '#faa61a',
        dnd: '#f04747',
        offline: '#747f8d',
    };

    const STATUS_LABELS = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Do Not Disturb',
        offline: 'Offline',
    };

    function updatePresence(data) {
        if (!data) {
            setOfflineState();
            return;
        }

        const status = data.discord_status || 'offline';
        const activities = data.activities || [];
        const spotify = data.spotify;

        // Update status dot
        if (statusDot) {
            statusDot.style.backgroundColor = STATUS_COLORS[status] || STATUS_COLORS.offline;
            statusDot.title = STATUS_LABELS[status] || 'Offline';

            // Pulsing animation for online
            if (status === 'online') {
                statusDot.classList.add('pulse');
            } else {
                statusDot.classList.remove('pulse');
            }
        }

        // Update activity label
        if (activityLabel) {
            const gameActivity = activities.find(a => a.type === 0);
            const customStatus = activities.find(a => a.type === 4);

            if (customStatus && customStatus.state) {
                activityLabel.textContent = customStatus.state;
                if (activityDetail) {
                    activityDetail.textContent = STATUS_LABELS[status] || '';
                }
            } else if (gameActivity) {
                activityLabel.textContent = `Bermain ${gameActivity.name}`;
                if (activityDetail) {
                    activityDetail.textContent = gameActivity.details || '';
                }
            } else {
                activityLabel.textContent = STATUS_LABELS[status] || 'Offline';
                if (activityDetail) {
                    activityDetail.textContent = '';
                }
            }
        }

        // Update Spotify
        if (spotify && spotifySection) {
            spotifySection.style.display = 'flex';
            if (spotifyArt) spotifyArt.src = spotify.album_art_url || '';
            if (spotifySong) spotifySong.textContent = spotify.song || '';
            if (spotifyArtist) spotifyArtist.textContent = `oleh ${spotify.artist || ''}`;
        } else if (spotifySection) {
            spotifySection.style.display = 'none';
        }
    }

    function setOfflineState() {
        if (statusDot) {
            statusDot.style.backgroundColor = STATUS_COLORS.offline;
            statusDot.title = 'Offline';
            statusDot.classList.remove('pulse');
        }
        if (activityLabel) activityLabel.textContent = 'Offline';
        if (activityDetail) activityDetail.textContent = '';
        if (spotifySection) spotifySection.style.display = 'none';
    }

    // ─── WebSocket connection to Lanyard ───
    function connectLanyard() {
        if (!DISCORD_USER_ID) {
            // No ID configured — show static state
            if (activityLabel) activityLabel.textContent = 'ID Discord belum diatur';
            if (activityDetail) activityDetail.textContent = 'Masukkan ID di lanyard.js';
            if (statusDot) {
                statusDot.style.backgroundColor = STATUS_COLORS.offline;
            }
            return;
        }

        const ws = new WebSocket('wss://api.lanyard.rest/socket');

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            switch (msg.op) {
                case 1: // Hello — send init
                    ws.send(JSON.stringify({
                        op: 2,
                        d: { subscribe_to_id: DISCORD_USER_ID },
                    }));

                    // Heartbeat
                    setInterval(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(JSON.stringify({ op: 3 }));
                        }
                    }, msg.d.heartbeat_interval);
                    break;

                case 0: // Event
                    if (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE') {
                        updatePresence(msg.d);
                    }
                    break;
            }
        };

        ws.onclose = () => {
            // Reconnect after 5 seconds
            setTimeout(connectLanyard, 5000);
        };

        ws.onerror = () => {
            setOfflineState();
        };
    }

    // ─── Fallback: REST API ───
    async function fetchLanyardRest() {
        if (!DISCORD_USER_ID) return;
        try {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
            const json = await res.json();
            if (json.success) {
                updatePresence(json.data);
            }
        } catch {
            setOfflineState();
        }
    }

    // ─── Init ───
    function init() {
        setupTiltEvents();
        connectLanyard();
    }

    return { init };
})();
