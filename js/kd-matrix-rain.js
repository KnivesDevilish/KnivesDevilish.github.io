(() => {
    'use strict';

    // Respect reduced-motion accessibility settings.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    if (document.getElementById('kd-matrix-rain')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'kd-matrix-rain';
    canvas.setAttribute('aria-hidden', 'true');

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Japanese characters and digital symbols.
    const glyphs = Array.from(
        '日月火水木金土山川空雨風光闇零壱弐参四五六七八九十百千龍電機能魔神影刀夢夜天心星黒白猫鬼悪帝界カキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ0123456789'
    );

    let width = 0;
    let height = 0;
    let drops = [];
    let fontSize = 18;
    let gap = 30;
    let lastFrame = 0;
    let animationTimer = 0;

    // Keep the effect visually present while limiting canvas work.
    const frameInterval = 1000 / 12; // 12 FPS

    const randomGlyph = () =>
        glyphs[Math.floor(Math.random() * glyphs.length)];

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1); // avoid high-DPI overdraw

        width = window.innerWidth;
        height = window.innerHeight;

        fontSize = width < 600 ? 14 : 16;
        gap = width < 600 ? 21 : 24; // restore denser Japanese character streams

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Set text state only on resize, not on every animation frame.
        ctx.font = `${fontSize}px \"Noto Sans Mono\", \"Noto Sans JP\", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.clearRect(0, 0, width, height);

        const columns = Math.ceil(width / gap);

        drops = Array.from({ length: columns }, () => ({
            y: Math.random() * height - height,
            speed: 1.6 + Math.random() * 2.0,
            alpha: 0.10 + Math.random() * 0.12,
            color: ['#B5C94A', '#86A88F', '#627D70'][Math.floor(Math.random() * 3)],
            char: randomGlyph()
        }));
    }

    function animate() {
        if (document.hidden) {
            animationTimer = 0;
            return;
        }

        const now = performance.now();
        const delta = lastFrame
            ? Math.min((now - lastFrame) / frameInterval, 2)
            : 1;
        lastFrame = now;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';

        drops.forEach((drop, index) => {
            if (Math.random() < 0.18) drop.char = randomGlyph();
            const x = index * gap + gap / 2;
            ctx.fillStyle = drop.color;
            ctx.globalAlpha = drop.alpha;
            ctx.fillText(drop.char, x, drop.y);
            ctx.globalAlpha = 1;
            drop.y += drop.speed * delta;

            if (drop.y > height + 30) {
                drop.y = -Math.random() * height * 0.35;
                drop.speed = 1.6 + Math.random() * 2.0;
                drop.alpha = 0.10 + Math.random() * 0.12;
                drop.color = ['#B5C94A', '#86A88F', '#627D70'][Math.floor(Math.random() * 3)];
            }
        });

        animationTimer = window.setTimeout(animate, frameInterval);
    }

    function startAnimation() {
        if (!animationTimer && !document.hidden) {
            lastFrame = 0;
            animationTimer = window.setTimeout(animate, 0);
        }
    }

    function stopAnimation() {
        if (animationTimer) {
            window.clearTimeout(animationTimer);
            animationTimer = 0;
        }
    }

    window.addEventListener('resize', resize, { passive: true });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }
    });

    // Matrix Rain is decorative: initialize it after the main page load and
    // when the browser is idle, so it cannot compete with the hero/LCP image.
    let initialized = false;
    const initialize = () => {
        if (initialized) return;
        initialized = true;
        resize();
        document.body.prepend(canvas);
        startAnimation();
    };

    const scheduleInitialize = () => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(initialize, { timeout: 1800 });
        } else {
            window.setTimeout(initialize, 500);
        }
    };

    if (document.readyState === 'complete') {
        scheduleInitialize();
    } else {
        window.addEventListener('load', scheduleInitialize, { once: true });
    }
})();
