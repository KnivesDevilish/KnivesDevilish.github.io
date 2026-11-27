/* KD-404 // TETRIS + EASTER EGG CODES */
(() => {
  'use strict';

  if (document.getElementById('kd-mini-apps')) return;
  const shell = document.querySelector('.site-shell');
  const footer = shell && shell.querySelector('.site-footer');
  if (!shell || !footer) return;

  const root = document.createElement('section');
  root.id = 'kd-mini-apps';
  root.className = 'kd-mini-apps';
  root.setAttribute('aria-label', 'Interactive modules');
  root.innerHTML =
    '<article class="kd-mini-card kd-tetris-card">' +
      '<header class="kd-mini-head"><div><small>01 // RECREATION MODULE</small><h2>TETRIS</h2><p>Clear lines, raise your level and keep the board alive.</p></div><span class="kd-mini-status">● READY</span></header>' +
      '<div class="kd-tetris-layout">' +
        '<div class="kd-tetris-stage"><div class="kd-mini-label"><span>GAME GRID // 10 × 20</span><b id="kdt-state">STANDBY</b></div><canvas id="kdt-board" width="240" height="480" tabindex="0" aria-label="Tetris game board"></canvas><div class="kd-mini-label"><span>LINES CLEARED</span><b id="kdt-lines">0</b></div></div>' +
        '<aside class="kd-tetris-info">' +
          '<div class="kd-mini-stat"><small>SCORE</small><strong id="kdt-score">0</strong></div>' +
          '<div class="kd-mini-stat"><small>RECORD</small><strong id="kdt-best">0</strong></div>' +
          '<div class="kd-mini-stat"><small>LEVEL</small><strong id="kdt-level">01</strong></div>' +
          '<div class="kd-mini-next"><small>NEXT PIECE</small><canvas id="kdt-next" width="120" height="84"></canvas></div>' +
          '<button class="kd-mini-primary" id="kdt-start" type="button">START TETRIS</button>' +
          '<div class="kd-tetris-controls">' +
            '<button type="button" data-kdt="left" aria-label="Move left">◀</button><button type="button" data-kdt="rotate">ROTATE</button>' +
            '<button type="button" data-kdt="right" aria-label="Move right">▶</button><button type="button" data-kdt="down" aria-label="Soft drop">▼</button>' +
            '<button type="button" data-kdt="drop">HARD DROP</button>' +
          '</div>' +
          '<p class="kd-mini-help">← → MOVE · ↑ ROTATE<br>↓ SOFT DROP · SPACE HARD DROP</p>' +
        '</aside>' +
      '</div>' +
    '</article>' +
    '<article class="kd-mini-card kd-eggs-card">' +
      '<header class="kd-mini-head"><div><small>02 // HIDDEN INTELLIGENCE</small><h2>EASTER EGG CODES</h2><p>Restricted files and messages hidden inside the network.</p></div><span class="kd-mini-status">● ENCRYPTED</span></header>' +
      '<div class="kd-eggs-content">' +
        '<section class="kd-eggs-terminal"><small>CLASSIFIED ARCHIVE // K-404</small><h3>SUBJECT FILE: KNIVES</h3><p>The medical record is encrypted. Enter a recovered authorization code to decrypt the file.</p>' +
          '<form id="kde-form"><label for="kde-code">AUTHORIZATION CODE</label><div class="kd-eggs-input-row"><input id="kde-code" type="password" maxlength="8" inputmode="numeric" autocomplete="off" placeholder="ENTER CODE"><button class="kd-mini-primary" type="submit">DECRYPT</button></div></form>' +
          '<p id="kde-message" class="kd-eggs-message" aria-live="polite">FILE LOCKED // AUTHORIZATION REQUIRED</p>' +
          '<section id="kde-file" class="kd-eggs-file" hidden><h4>STASIS CITY // MEDICAL & CONTAINMENT RECORD</h4><dl><dt>SUBJECT</dt><dd>KNIVES</dd><dt>SPECIES</dt><dd>HEDGEHOG / LYNX HYBRID</dd><dt>LOCATION</dt><dd>STASIS CITY</dd><dt>MEDICAL STATUS</dt><dd>TERMINAL CONDITION</dd><dt>EXPERIMENT</dt><dd>DEMONIC BLOOD INFUSION</dd><dt>INTERNAL ENTITY</dt><dd>VISCERAL DEMON // ACTIVE</dd><dt>FAMILY CONTACT</dt><dd>KURAMI // SISTER</dd><dt>CONTAINMENT</dt><dd>UNSTABLE</dd></dl><p class="kd-eggs-kurami">INCOMING MESSAGE // KURAMI: “Knives... if you can hear this, stay with me. Do not let it take control.”</p></section>' +
        '</section>' +
        '<section class="kd-eggs-transmit"><small>NETWORK EVENT // INCOMING</small><h3>TRANSMIT A SIGNAL</h3><p>Send a pulse into the Stasis City network. Some replies may not be from the system.</p><button class="kd-mini-primary" id="kde-signal" type="button">TRANSMIT SIGNAL</button><p id="kde-output" class="kd-eggs-output" aria-live="polite">AWAITING INPUT...</p></section>' +
      '</div>' +
    '</article>';

  shell.insertBefore(root, footer);
  const $ = (selector) => root.querySelector(selector);
  const getStored = (key, fallback) => {
    try { return localStorage.getItem(key) ?? fallback; } catch (error) { return fallback; }
  };
  const setStored = (key, value) => {
    try { localStorage.setItem(key, String(value)); } catch (error) {}
  };
  const format = (value) => Math.max(0, Math.floor(value)).toLocaleString('en-US');

  // TETRIS
  const boardCanvas = $('#kdt-board');
  const ctx = boardCanvas.getContext('2d');
  const nextCanvas = $('#kdt-next');
  const nextCtx = nextCanvas.getContext('2d');
  const scoreNode = $('#kdt-score');
  const bestNode = $('#kdt-best');
  const levelNode = $('#kdt-level');
  const linesNode = $('#kdt-lines');
  const stateNode = $('#kdt-state');
  const startButton = $('#kdt-start');
  const cols = 10, rows = 20, cell = 24;
  const shapes = [
    [[1,1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]],
    [[1,1],[1,1]],
    [[0,1,1],[1,1,0]],
    [[0,1,0],[1,1,1]],
    [[1,1,0],[0,1,1]]
  ];
  const colors = ['#a8c66c','#c85c66','#839ba9','#d6c66f','#72ad90','#a78cbd','#c47b62'];
  let board = [];
  let current = null;
  let next = null;
  let score = 0;
  let lines = 0;
  let active = false;
  let gameOver = false;
  let animation = 0;
  let previousTime = 0;
  let accumulator = 0;
  let fallInterval = 0.8;
  let best = Math.max(0, Number(getStored('kd404-v2-tetris', getStored('kd404-v2-bloodlock', '0'))) || 0);
  bestNode.textContent = format(best);

  function makePiece() {
    const index = Math.floor(Math.random() * shapes.length);
    return { matrix: shapes[index].map((row) => row.slice()), color: colors[index], x: 3, y: 0 };
  }

  function collides(matrix, x, y) {
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (!matrix[row][col]) continue;
        const bx = x + col, by = y + row;
        if (bx < 0 || bx >= cols || by >= rows) return true;
        if (by >= 0 && board[by][bx]) return true;
      }
    }
    return false;
  }

  function drawCell(context, x, y, size, color) {
    context.fillStyle = color;
    context.fillRect(x * size + 1, y * size + 1, size - 2, size - 2);
    context.fillStyle = 'rgba(255,255,255,.18)';
    context.fillRect(x * size + 4, y * size + 4, Math.max(1, size - 8), 3);
  }

  function drawNext() {
    nextCtx.fillStyle = '#070b08';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    const size = 18;
    const width = next.matrix[0].length * size;
    const height = next.matrix.length * size;
    const ox = (nextCanvas.width - width) / 2;
    const oy = (nextCanvas.height - height) / 2;
    next.matrix.forEach((row, y) => row.forEach((value, x) => {
      if (!value) return;
      nextCtx.fillStyle = next.color;
      nextCtx.fillRect(ox + x * size + 1, oy + y * size + 1, size - 2, size - 2);
      nextCtx.fillStyle = 'rgba(255,255,255,.18)';
      nextCtx.fillRect(ox + x * size + 4, oy + y * size + 4, size - 8, 3);
    }));
  }

  function drawBoard() {
    ctx.fillStyle = '#070b08';
    ctx.fillRect(0, 0, boardCanvas.width, boardCanvas.height);
    ctx.strokeStyle = 'rgba(181,201,74,.09)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath(); ctx.moveTo(x * cell, 0); ctx.lineTo(x * cell, rows * cell); ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * cell); ctx.lineTo(cols * cell, y * cell); ctx.stroke();
    }
    board.forEach((row, y) => row.forEach((value, x) => {
      if (value) drawCell(ctx, x, y, cell, value);
    }));
    if (current) current.matrix.forEach((row, y) => row.forEach((value, x) => {
      if (value && current.y + y >= 0) drawCell(ctx, current.x + x, current.y + y, cell, current.color);
    }));
    if (!active) {
      ctx.fillStyle = 'rgba(3,7,5,.84)';
      ctx.fillRect(10, 196, 220, 88);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#e0e9c7';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(gameOver ? 'GAME OVER' : 'TETRIS READY', 120, 231);
      ctx.fillStyle = '#9aa68f';
      ctx.font = '10px monospace';
      ctx.fillText(gameOver ? 'RESTART TO TRY AGAIN' : 'INITIALIZE TO BEGIN', 120, 253);
      ctx.textAlign = 'left';
    }
  }

  function updateStats() {
    scoreNode.textContent = format(score);
    if (score > best) {
      best = score;
      setStored('kd404-v2-tetris', best);
    }
    bestNode.textContent = format(best);
    const level = Math.floor(lines / 10) + 1;
    levelNode.textContent = String(level).padStart(2, '0');
    linesNode.textContent = format(lines);
    fallInterval = Math.max(0.075, 0.8 * Math.pow(0.90, level - 1));
  }

  function finishGame() {
    active = false;
    gameOver = true;
    stateNode.textContent = 'GAME OVER';
    startButton.textContent = 'PLAY AGAIN';
    drawBoard();
  }

  function lockPiece() {
    let overflow = false;
    current.matrix.forEach((row, y) => row.forEach((value, x) => {
      if (!value) return;
      const by = current.y + y;
      if (by < 0) overflow = true;
      else board[by][current.x + x] = current.color;
    }));
    if (overflow) { finishGame(); return; }

    let cleared = 0;
    for (let y = rows - 1; y >= 0; y--) {
      if (board[y].every(Boolean)) {
        board.splice(y, 1);
        board.unshift(Array(cols).fill(null));
        cleared++;
        y++;
      }
    }
    if (cleared) {
      lines += cleared;
      const level = Math.floor(lines / 10) + 1;
      const points = [0, 40, 100, 300, 1200][cleared] || cleared * 300;
      score += points * level;
      updateStats();
    }
    current = next;
    current.x = 3;
    current.y = 0;
    next = makePiece();
    drawNext();
    if (collides(current.matrix, current.x, current.y)) finishGame();
  }

  function descend() {
    if (collides(current.matrix, current.x, current.y + 1)) lockPiece();
    else current.y++;
  }

  function act(action) {
    if (!active) return;
    if (action === 'left' && !collides(current.matrix, current.x - 1, current.y)) current.x--;
    if (action === 'right' && !collides(current.matrix, current.x + 1, current.y)) current.x++;
    if (action === 'down') {
      descend();
      score += Math.floor(lines / 10) + 1;
      updateStats();
    }
    if (action === 'rotate') {
      const rotated = current.matrix[0].map((_, index) => current.matrix.map((row) => row[index]).reverse());
      if (!collides(rotated, current.x, current.y)) current.matrix = rotated;
      else if (!collides(rotated, current.x - 1, current.y)) { current.x--; current.matrix = rotated; }
      else if (!collides(rotated, current.x + 1, current.y)) { current.x++; current.matrix = rotated; }
    }
    if (action === 'drop') {
      let distance = 0;
      while (!collides(current.matrix, current.x, current.y + 1)) { current.y++; distance++; }
      score += distance * 2 * (Math.floor(lines / 10) + 1);
      updateStats();
      lockPiece();
    }
    drawBoard();
  }

  function frame(time) {
    if (!active) return;
    if (!previousTime) previousTime = time;
    accumulator += Math.min(0.05, (time - previousTime) / 1000);
    previousTime = time;
    while (accumulator >= fallInterval && active) {
      descend();
      accumulator -= fallInterval;
    }
    drawBoard();
    if (active) animation = requestAnimationFrame(frame);
  }

  function startGame() {
    cancelAnimationFrame(animation);
    board = Array.from({ length: rows }, () => Array(cols).fill(null));
    current = makePiece();
    next = makePiece();
    score = 0;
    lines = 0;
    previousTime = 0;
    accumulator = 0;
    active = true;
    gameOver = false;
    stateNode.textContent = 'ACTIVE // LEVEL 01';
    startButton.textContent = 'RESTART TETRIS';
    updateStats();
    drawNext();
    drawBoard();
    boardCanvas.focus();
    animation = requestAnimationFrame(frame);
  }

  startButton.addEventListener('click', startGame);
  boardCanvas.addEventListener('keydown', (event) => {
    const keys = { ArrowLeft: 'left', ArrowRight: 'right', ArrowDown: 'down', ArrowUp: 'rotate', ' ': 'drop' };
    if (keys[event.key]) { event.preventDefault(); act(keys[event.key]); }
  });
  root.querySelectorAll('[data-kdt]').forEach((button) => {
    button.addEventListener('click', () => act(button.dataset.kdt));
  });
  board = Array.from({ length: rows }, () => Array(cols).fill(null));
  next = makePiece();
  drawNext();
  drawBoard();

  // EASTER EGG ARCHIVE
  const form = $('#kde-form');
  const codeInput = $('#kde-code');
  const message = $('#kde-message');
  const file = $('#kde-file');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const unlocked = codeInput.value.trim() === '404';
    file.hidden = !unlocked;
    message.textContent = unlocked ? 'ACCESS GRANTED // FILE DECRYPTED' : 'ACCESS DENIED // INVALID CODE';
    message.classList.toggle('is-success', unlocked);
  });

  const transmissions = [
    'STASIS CITY RELAY: signal received. Keep moving, operator.',
    'UNKNOWN CHANNEL: something is repeating your heartbeat.',
    'KURAMI // encrypted ping detected. Origin cannot be verified.',
    'CONTAINMENT NOTICE: do not answer the voice inside the core.',
    'VISCERAL ENTITY: [TRANSMISSION CORRUPTED] ...LET ME OUT...',
    'ARCHIVE FRAGMENT: Knives was not supposed to survive the procedure.'
  ];
  $('#kde-signal').addEventListener('click', () => {
    $('#kde-output').textContent = '> ' + transmissions[Math.floor(Math.random() * transmissions.length)];
  });
})();