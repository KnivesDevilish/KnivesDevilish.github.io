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

    document.body.prepend(canvas);

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
    let animationId = 0;

    const frameInterval = 66; // ~15 FPS instead of 20 FPS

    const randomGlyph = () =>
        glyphs[Math.floor(Math.random() * glyphs.length)];

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 1); // avoid high-DPI overdraw

        width = window.innerWidth;
        height = window.innerHeight;

        fontSize = width < 600 ? 14 : 16;
        gap = width < 600 ? 22 : 28; // fewer glyph columns to reduce canvas work

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

    function animate(timestamp) {
        if (document.hidden) { animationId = 0; return; }

        if (timestamp - lastFrame >= frameInterval) {
            const delta = lastFrame
                ? Math.min((timestamp - lastFrame) / frameInterval, 2)
                : 1;

            lastFrame = timestamp;

            // Fade existing characters without darkening the webpage.
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'source-over';

            ctx.font = `${fontSize}px "Noto Sans Mono", "Noto Sans JP", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';

            drops.forEach((drop, index) => {
                if (Math.random() < 0.18) {
                    drop.char = randomGlyph();
                }

                const x = index * gap + gap / 2;

                // White, translucent characters.
                ctx.fillStyle = drop.color;
                ctx.globalAlpha = drop.alpha;
                ctx.fillText(drop.char, x, drop.y);
                ctx.globalAlpha = 1;

                drop.y += drop.speed * delta;

                // Restart each stream after it leaves the screen.
                if (drop.y > height + 30) {
                    drop.y = -Math.random() * height * 0.35;
                    drop.speed = 1.6 + Math.random() * 2.0;
                    drop.alpha = 0.10 + Math.random() * 0.12;
                    drop.color = ['#B5C94A', '#86A88F', '#627D70'][Math.floor(Math.random() * 3)];
                }
            });
        }

        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (!animationId && !document.hidden) {
            lastFrame = 0;
            animationId = requestAnimationFrame(animate);
        }
    }

    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = 0;
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

    resize();
    startAnimation();
})();
