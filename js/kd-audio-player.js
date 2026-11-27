(() => {
    'use strict';

    if (document.getElementById('kd-audio-player')) return;

    const tracks = [
        {
            title: 'SHADOW IN THE NIGHT',
            genre: 'AMBIENT // CYBERPUNK',
            file: 'audio/background.mp3',
            source: 'https://pixabay.com/music/ambient-shadow-in-the-night-299941/'
        },
        {
            title: 'DARKSHADOW',
            genre: 'DARK DUBSTEP',
            file: 'audio/dubstep.mp3',
            source: 'https://pixabay.com/music/upbeat-darkshadow-dark-dubstep-241029/'
        },
        {
            title: 'NIGHT CIRCUIT',
            genre: 'NIGHTCORE // HIGH ENERGY',
            file: 'audio/nightcore.mp3',
            source: 'https://pixabay.com/music/edm-night-circuit-489107/'
        },
        {
            title: 'WAREHOUSE',
            genre: 'UNDERGROUND // BASS TECH',
            file: 'audio/warehouse.mp3',
            source: 'https://pixabay.com/music/search/warehouse/'
        },
        {
            title: 'EERIE CLUB',
            genre: 'UNDERGROUND // DARK CLUB',
            file: 'audio/eerie-club.mp3',
            source: 'https://pixabay.com/music/search/eerie%20club/'
        },
        {
            title: 'BOOMP BREAKDOWN',
            genre: 'BREAKDOWN // BASS',
            file: 'audio/boomp-breakdown.mp3',
            source: 'https://pixabay.com/music/search/boomp%20breakdown/'
        },
        {
            title: 'DARK INDUSTRIAL',
            genre: 'DARK // INDUSTRIAL ELECTRO',
            file: 'audio/dark-industrial.mp3',
            source: 'https://pixabay.com/music/search/dark%20industrial/'
        }
    ];

    const storage = {
        get(key, fallback) {
            try {
                return localStorage.getItem(key) ?? fallback;
            } catch {
                return fallback;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch {}
        }
    };

    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'none';
    audio.playbackRate = 1;
    audio.defaultPlaybackRate = 1;

    let currentTrack = Number(storage.get('kd404-track', '0'));
    if (!Number.isInteger(currentTrack) || currentTrack < 0 || currentTrack >= tracks.length) {
        currentTrack = 0;
    }

    const player = document.createElement('aside');
    player.id = 'kd-audio-player';
    player.setAttribute('aria-label', 'KD-404 audio player');

    player.innerHTML = `
        <header class="kd-audio-header">
            <div class="kd-audio-heading">
                <span class="kd-audio-indicator"></span>
                <span>KD-404 // AUDIO SYSTEM</span>
            </div>
            <button class="kd-audio-minimize" type="button" aria-label="Minimize player">−</button>
        </header>

        <div class="kd-audio-content">
            <div class="kd-audio-track">
                <div class="kd-audio-track-info">
                    <span class="kd-audio-status" aria-live="polite">SYSTEM READY</span>
                    <strong class="kd-audio-title"></strong>
                    <span class="kd-audio-genre"></span>
                    <a class="kd-audio-source" target="_blank" rel="noopener noreferrer">TRACK SOURCE ↗</a>
                </div>
                <button class="kd-audio-play" type="button">▶ PLAY</button>
            </div>

            <div class="kd-audio-playlist">
                <button class="kd-audio-previous" type="button" aria-label="Previous track">◀</button>
                <select class="kd-audio-select" aria-label="Select music track">
                    ${tracks.map((track, index) => `
                        <option value="${index}">
                            ${String(index + 1).padStart(2, '0')} // ${track.title}
                        </option>
                    `).join('')}
                </select>
                <button class="kd-audio-next" type="button" aria-label="Next track">▶</button>
            </div>

            <div class="kd-audio-controls">
                <button class="kd-audio-mute" type="button">MUTE</button>
                <label class="kd-audio-volume">
                    <span>VOL</span>
                    <input type="range" min="0" max="100" value="65" aria-label="Music volume">
                </label>
                <output class="kd-audio-volume-value">65%</output>
            </div>

            <div class="kd-audio-footer">
                <span>INSTRUMENTAL MODE</span>
                <span>LOOP: ENABLED</span>
            </div>
        </div>
    `;

    document.body.appendChild(player);

    const $ = selector => player.querySelector(selector);
    const playButton = $('.kd-audio-play');
    const muteButton = $('.kd-audio-mute');
    const minimizeButton = $('.kd-audio-minimize');
    const volumeSlider = $('.kd-audio-volume input');
    const volumeOutput = $('.kd-audio-volume-value');
    const status = $('.kd-audio-status');
    const title = $('.kd-audio-title');
    const genre = $('.kd-audio-genre');
    const source = $('.kd-audio-source');
    const select = $('.kd-audio-select');

    const savedVolume = Number(storage.get('kd404-volume', '65'));
    const savedMuted = storage.get('kd404-muted', 'false') === 'true';
    const savedMinimized = storage.get('kd404-minimized', 'false') === 'true';

    audio.volume = Math.min(1, Math.max(0, savedVolume / 100));
    audio.muted = savedMuted;

    function updateVolume() {
        const value = Math.round(audio.volume * 100);
        volumeSlider.value = value;
        volumeOutput.textContent = `${value}%`;
        muteButton.textContent = audio.muted || value === 0 ? 'UNMUTE' : 'MUTE';
        storage.set('kd404-volume', String(value));
        storage.set('kd404-muted', String(audio.muted));
    }

    function updateStatus() {
        status.textContent = audio.error
            ? 'AUDIO ERROR'
            : audio.paused
                ? 'SYSTEM READY'
                : 'PLAYING // ONLINE';

        player.classList.toggle('is-playing', !audio.paused);
        playButton.textContent = audio.paused ? '▶ PLAY' : 'Ⅱ PAUSE';
    }

    function updateTrackInfo() {
        const track = tracks[currentTrack];
        title.textContent = track.title;
        genre.textContent = track.genre;
        source.href = track.source;
        select.value = String(currentTrack);
        storage.set('kd404-track', String(currentTrack));
    }

    async function changeTrack(index) {
        const wasPlaying = !audio.paused;
        currentTrack = (index + tracks.length) % tracks.length;

        audio.pause();
        audio.removeAttribute('src');
        audio.load();

        updateTrackInfo();
        updateStatus();

        if (wasPlaying) {
            audio.src = tracks[currentTrack].file;
            try {
                await audio.play();
            } catch {
                updateStatus();
            }
        }
    }

    playButton.addEventListener('click', async () => {
        if (audio.paused) {
            try {
                if (!audio.getAttribute('src')) {
                    audio.src = tracks[currentTrack].file;
                }
                await audio.play();
            } catch {
                status.textContent = 'PLAYBACK BLOCKED';
            }
        } else {
            audio.pause();
        }
        updateStatus();
    });

    $('.kd-audio-previous').addEventListener('click', () => changeTrack(currentTrack - 1));
    $('.kd-audio-next').addEventListener('click', () => changeTrack(currentTrack + 1));
    select.addEventListener('change', () => changeTrack(Number(select.value)));

    muteButton.addEventListener('click', () => {
        audio.muted = !audio.muted;
        updateVolume();
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = Number(volumeSlider.value) / 100;
        if (audio.volume > 0) audio.muted = false;
        updateVolume();
    });

    minimizeButton.addEventListener('click', () => {
        const minimized = player.classList.toggle('is-minimized');
        minimizeButton.textContent = minimized ? '+' : '−';
        minimizeButton.setAttribute('aria-label', minimized ? 'Expand player' : 'Minimize player');
        storage.set('kd404-minimized', String(minimized));
    });

    audio.addEventListener('play', updateStatus);
    audio.addEventListener('pause', updateStatus);
    audio.addEventListener('ended', updateStatus);
    audio.addEventListener('error', updateStatus);

    if (savedMinimized) {
        player.classList.add('is-minimized');
        minimizeButton.textContent = '+';
        minimizeButton.setAttribute('aria-label', 'Expand player');
    }

    updateTrackInfo();
    updateVolume();
    updateStatus();

    // Load audio only after an explicit user action.
})();
