
/* KD-404 // STASIS CITY ARCADE
   Original mini-games. Local high scores stay in this browser. */
(() => {
    'use strict';
    if (document.getElementById('kd-stasis-arcade')) return;

    const shell = document.querySelector('.site-shell');
    const footer = shell && shell.querySelector('.site-footer');
    if (!shell || !footer) return;

    const root = document.createElement('section');
    root.className = 'kd-arcade';
    root.id = 'kd-stasis-arcade';
    root.setAttribute('aria-labelledby', 'kd-arcade-title');
    root.innerHTML = [
        '<div class="kd-arcade-header">',
        ' <div><span class="kd-arcade-kicker">07 // INTERACTIVE SECTOR</span><h2 id="kd-arcade-title">STASIS CITY // ARCADE</h2></div>',
        ' <p>Three experimental simulations recovered from the Stasis City network. Play, survive, and uncover the restricted file.</p>',
        '</div>',
        '<div class="kd-arcade-grid">',
        ' <article class="kd-game-card">',
        '  <div class="kd-game-heading"><div><span class="kd-game-index">GAME 01 // CONTAINMENT</span><h3>BLOODLOCK</h3><p>Arrange the unstable fragments. Keep the core contained.</p></div><span class="kd-game-status" id="kd-tetris-status">STANDBY</span></div>',
        '  <div class="kd-game-stage"><canvas id="kd-tetris-canvas" width="240" height="400" aria-label="Bloodlock falling-block game. Use arrow keys or buttons."></canvas></div>',
        '  <div class="kd-game-hud"><span>SCORE // <strong id="kd-tetris-score">0000</strong></span><span>RECORD // <strong id="kd-tetris-best">0000</strong></span></div>',
        '  <div class="kd-game-actions"><button type="button" id="kd-tetris-start">INITIALIZE</button></div>',
        '  <div class="kd-game-pad"><button type="button" data-tetris="left" aria-label="Move left">◀</button><button type="button" data-tetris="rotate" aria-label="Rotate">ROTATE</button><button type="button" data-tetris="right" aria-label="Move right">▶</button><button type="button" data-tetris="down" aria-label="Drop faster">▼</button></div>',
        '  <p class="kd-game-help">KEYS: ← → move · ↑ rotate · ↓ drop. Complete rows to stabilize the core.</p>',
        ' </article>',
        ' <article class="kd-game-card">',
        '  <div class="kd-game-heading"><div><span class="kd-game-index">GAME 02 // BIO-MECHANICAL TABLE</span><h3>VISCERAL PINBALL</h3><p>Strike the living nodes. Do not let the core fall.</p></div><span class="kd-game-status" id="kd-pinball-status">STANDBY</span></div>',
        '  <div class="kd-game-stage"><canvas id="kd-pinball-canvas" width="640" height="360" tabindex="0" aria-label="Visceral pinball. Launch the ball and operate the flippers."></canvas></div>',
        '  <div class="kd-game-hud"><span>SCORE // <strong id="kd-pinball-score">0000</strong></span><span>RECORD // <strong id="kd-pinball-best">0000</strong></span><span>CELLS // <strong id="kd-pinball-lives">3</strong></span></div>',
        '  <div class="kd-game-actions"><button type="button" id="kd-pinball-launch">START TABLE</button></div>',
        '  <div class="kd-game-pad"><button type="button" data-pinball="left">LEFT FLIPPER</button><button type="button" data-pinball="right">RIGHT FLIPPER</button></div>',
        '  <p class="kd-game-help">SPACE / LAUNCH BALL · Hold the flipper buttons. Keyboard: A and D.</p>',
        ' </article>',
        ' <article class="kd-game-card wide">',
        '  <div class="kd-game-heading"><div><span class="kd-game-index">GAME 03 // CITY ESCAPE</span><h3>STASIS RUN</h3><p>Run through the quarantine district. Collect stabilizers. Something is following you.</p></div><span class="kd-game-status" id="kd-runner-status">STANDBY</span></div>',
        '  <div class="kd-game-stage"><canvas id="kd-runner-canvas" width="720" height="260" tabindex="0" aria-label="Stasis Run side-scrolling runner. Jump over hazards."></canvas></div>',
        '  <div class="kd-game-hud"><span>DISTANCE // <strong id="kd-runner-score">0000</strong></span><span>RECORD // <strong id="kd-runner-best">0000</strong></span><span>STABILIZERS // <strong id="kd-runner-shards">0</strong></span></div>',
        '  <div class="kd-game-actions"><button type="button" id="kd-runner-start">START RUN</button><button type="button" id="kd-runner-jump">JUMP / EVADE</button></div>',
        '  <p class="kd-game-help">SPACE / ↑ / TAP TO JUMP. Avoid the containment debris and collect green stabilizers.</p>',
        ' </article>',
        '</div>',
        '<div class="kd-arcade-lower">',
        ' <article class="kd-signal-card"><span class="kd-game-index">NETWORK EVENT // INCOMING</span><h3>TRANSMIT A SIGNAL</h3><p>Send a pulse into the Stasis City network. Some replies may not be from the system.</p><button type="button" id="kd-signal-button">TRANSMIT SIGNAL</button><p class="kd-signal-output" id="kd-signal-output" aria-live="polite">AWAITING INPUT...</p></article>',
        ' <article class="kd-archive-card"><span class="kd-game-index">RESTRICTED ARCHIVE // K-404</span><h3>CLASSIFIED SUBJECT FILE</h3><p>The file is encrypted. Enter the access code to reveal the recovered medical and containment record.</p>',
        '  <form class="kd-archive-lock" id="kd-archive-form"><input id="kd-archive-code" type="password" inputmode="numeric" maxlength="8" autocomplete="off" placeholder="ACCESS CODE" aria-label="Archive access code"><button type="submit">DECRYPT</button></form>',
        '  <p class="kd-archive-message" id="kd-archive-message" aria-live="polite">FILE LOCKED // AUTHORIZATION REQUIRED</p>',
        '  <div class="kd-dossier" id="kd-dossier" aria-hidden="true"><h4>STASIS CITY // SUBJECT K-404</h4><dl>',
        '   <dt>SUBJECT</dt><dd>KNIVES</dd><dt>SPECIES</dt><dd>HEDGEHOG / LYNX HYBRID</dd><dt>LOCATION</dt><dd>STASIS CITY</dd><dt>MEDICAL STATUS</dt><dd>TERMINAL CONDITION</dd><dt>EXPERIMENT</dt><dd>DEMONIC BLOOD INFUSION</dd><dt>INTERNAL ENTITY</dt><dd>VISCERAL DEMON // ACTIVE</dd><dt>FAMILY CONTACT</dt><dd>KURAMI // SISTER</dd><dt>CONTAINMENT</dt><dd>UNSTABLE</dd>',
        '  </dl><p class="kd-kurami-msg">INCOMING MESSAGE // KURAMI: “Knives... if you can hear this, stay with me. Do not let it take control.”</p></div>',
        ' </article>',
        '</div>'
    ].join('');
    shell.insertBefore(root, footer);

    const $ = (selector) => root.querySelector(selector);
    const storage = {
        get(key, fallback) {
            try { return localStorage.getItem(key) ?? fallback; } catch (_) { return fallback; }
        },
        set(key, value) {
            try { localStorage.setItem(key, String(value)); } catch (_) {}
        }
    };
    const savedBest = (key) => Math.max(0, Number(storage.get(key, '0')) || 0);
    const formatScore = (n) => String(Math.max(0, Math.floor(n))).padStart(4, '0');

    // BLOODLOCK // falling-block containment
    (() => {
        const canvas = $('#kd-tetris-canvas');
        const ctx = canvas.getContext('2d');
        const scoreEl = $('#kd-tetris-score');
        const bestEl = $('#kd-tetris-best');
        const statusEl = $('#kd-tetris-status');
        const startBtn = $('#kd-tetris-start');
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
        const colors = ['#9DBB58','#C65B62','#8D9BA7','#D5C878','#79A98B','#B2A5C7','#A76C71'];
        let board, piece, score = 0, best = savedBest('kd404-best-tetris'), active = false, ended = false, lastDrop = 0, raf = 0;
        bestEl.textContent = formatScore(best);
        function newPiece() {
            const type = Math.floor(Math.random() * shapes.length);
            return { shape: shapes[type].map(row => row.slice()), color: colors[type], x: 3, y: 0 };
        }
        function collides(shape, px, py) {
            for (let y = 0; y < shape.length; y++) for (let x = 0; x < shape[y].length; x++) {
                if (!shape[y][x]) continue;
                const bx = px + x, by = py + y;
                if (bx < 0 || bx >= cols || by >= rows) return true;
                if (by >= 0 && board[by][bx]) return true;
            }
            return false;
        }
        function rotate(shape) {
            return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
        }
        function updateScore() {
            scoreEl.textContent = formatScore(score);
            if (score > best) { best = score; bestEl.textContent = formatScore(best); storage.set('kd404-best-tetris', best); }
        }
        function lockPiece() {
            piece.shape.forEach((row, y) => row.forEach((value, x) => {
                if (value && piece.y + y >= 0) board[piece.y + y][piece.x + x] = piece.color;
            }));
            let cleared = 0;
            for (let y = rows - 1; y >= 0; y--) {
                if (board[y].every(Boolean)) { board.splice(y, 1); board.unshift(Array(cols).fill(0)); cleared++; y++; }
            }
            if (cleared) { score += [0,100,300,500,800][cleared] || cleared * 250; updateScore(); }
            piece = newPiece();
            if (collides(piece.shape, piece.x, piece.y)) {
                active = false; ended = true; statusEl.textContent = 'CORE BREACH'; startBtn.textContent = 'RESTART';
                draw();
            }
        }
        function stepDown() {
            if (!piece) return;
            if (!collides(piece.shape, piece.x, piece.y + 1)) piece.y++;
            else lockPiece();
        }
        function draw() {
            ctx.fillStyle = '#080d0a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(181,201,74,.09)'; ctx.lineWidth = 1;
            for (let x = 0; x <= cols; x++) { ctx.beginPath(); ctx.moveTo(x*cell,0); ctx.lineTo(x*cell,rows*cell); ctx.stroke(); }
            for (let y = 0; y <= rows; y++) { ctx.beginPath(); ctx.moveTo(0,y*cell); ctx.lineTo(cols*cell,y*cell); ctx.stroke(); }
            if (board) board.forEach((row,y) => row.forEach((color,x) => { if (color) drawCell(x,y,color); }));
            if (piece) piece.shape.forEach((row,y) => row.forEach((value,x) => { if (value) drawCell(piece.x+x,piece.y+y,piece.color); }));
            if (!active) {
                ctx.fillStyle = 'rgba(4,8,6,.72)'; ctx.fillRect(0,170,240,60);
                ctx.fillStyle = '#C8D8A2'; ctx.textAlign='center'; ctx.font='bold 12px monospace';
                ctx.fillText(ended ? 'CONTAINMENT FAILED' : 'CORE IN STANDBY',120,196);
                ctx.fillStyle = '#819078'; ctx.font='9px monospace'; ctx.fillText('INITIALIZE TO BEGIN',120,213);
            }
        }
        function drawCell(x,y,color) {
            ctx.fillStyle = color; ctx.fillRect(x*cell+1,y*cell+1,cell-2,cell-2);
            ctx.fillStyle = 'rgba(255,255,255,.16)'; ctx.fillRect(x*cell+3,y*cell+3,cell-6,3);
        }
        function loop(now) {
            if (!active) return;
            if (now - lastDrop > Math.max(95, 620 - Math.floor(score / 100) * 18)) { stepDown(); lastDrop = now; }
            draw();
            if (active) raf = requestAnimationFrame(loop);
        }
        function start() {
            cancelAnimationFrame(raf);
            board = Array.from({length:rows}, () => Array(cols).fill(0));
            piece = newPiece(); score = 0; ended = false; active = true; lastDrop = performance.now();
            scoreEl.textContent = '0000'; statusEl.textContent = 'CONTAINMENT ACTIVE'; startBtn.textContent = 'RESTART';
            draw(); raf = requestAnimationFrame(loop); canvas.focus();
        }
        function move(dx,dy) {
            if (!active) return;
            if (!collides(piece.shape,piece.x+dx,piece.y+dy)) { piece.x+=dx; piece.y+=dy; draw(); }
            else if (dy > 0) lockPiece();
        }
        function turn() {
            if (!active) return;
            const next = rotate(piece.shape);
            if (!collides(next,piece.x,piece.y)) piece.shape=next;
            else if (!collides(next,piece.x-1,piece.y)) { piece.x--; piece.shape=next; }
            draw();
        }
        startBtn.addEventListener('click', start);
        root.querySelectorAll('[data-tetris]').forEach(btn => btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-tetris');
            if (action==='left') move(-1,0); if (action==='right') move(1,0); if (action==='down') move(0,1); if (action==='rotate') turn();
        }));
        canvas.addEventListener('keydown', event => {
            if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' '].includes(event.key)) event.preventDefault();
            if (event.key==='ArrowLeft' || event.key==='a' || event.key==='A') move(-1,0);
            if (event.key==='ArrowRight' || event.key==='d' || event.key==='D') move(1,0);
            if (event.key==='ArrowDown' || event.key==='s' || event.key==='S') move(0,1);
            if (event.key==='ArrowUp' || event.key==='w' || event.key==='W') turn();
        });
        board = Array.from({length:rows}, () => Array(cols).fill(0)); piece = null; draw();
    })();

    // VISCERAL PINBALL // three-life bumper table
    (() => {
        const canvas = $('#kd-pinball-canvas'), ctx = canvas.getContext('2d');
        const scoreEl = $('#kd-pinball-score'), bestEl = $('#kd-pinball-best'), livesEl = $('#kd-pinball-lives');
        const statusEl = $('#kd-pinball-status'), launchBtn = $('#kd-pinball-launch');
        let score=0, best=savedBest('kd404-best-pinball'), lives=3, active=false, launched=false, ended=false;
        let ball={x:578,y:300,vx:0,vy:0,r:7}, leftPressed=false, rightPressed=false, raf=0;
        const bumpers=[{x:170,y:118,r:25},{x:310,y:76,r:28},{x:448,y:125,r:25},{x:310,y:200,r:19}];
        bestEl.textContent=formatScore(best);
        function resetBall() { ball={x:578,y:300,vx:0,vy:0,r:7}; launched=false; launchBtn.textContent='LAUNCH BALL'; }
        function updateScore(points) {
            score+=points; scoreEl.textContent=formatScore(score);
            if(score>best){best=score;bestEl.textContent=formatScore(best);storage.set('kd404-best-pinball',best);}
        }
        function draw() {
            ctx.fillStyle='#080d0a';ctx.fillRect(0,0,640,360);
            ctx.strokeStyle='rgba(181,201,74,.25)';ctx.lineWidth=3;ctx.strokeRect(8,8,624,344);
            ctx.strokeStyle='rgba(181,201,74,.15)';ctx.lineWidth=2;
            ctx.beginPath();ctx.moveTo(520,10);ctx.lineTo(520,260);ctx.lineTo(630,335);ctx.stroke();
            ctx.fillStyle='rgba(181,201,74,.07)';ctx.fillRect(525,12,98,230);
            bumpers.forEach((b,i)=>{
                ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=i===3?'#713f4b':'#52643b';ctx.fill();
                ctx.lineWidth=4;ctx.strokeStyle='#B5C94A';ctx.stroke();
                ctx.beginPath();ctx.arc(b.x,b.y,b.r-8,0,Math.PI*2);ctx.strokeStyle='rgba(240,245,220,.35)';ctx.stroke();
            });
            ctx.strokeStyle='#B5C94A';ctx.lineWidth=11;ctx.lineCap='round';
            ctx.beginPath();ctx.moveTo(205,315);ctx.lineTo(leftPressed?145:170,leftPressed?280:300);ctx.stroke();
            ctx.beginPath();ctx.moveTo(420,315);ctx.lineTo(rightPressed?475:450,rightPressed?280:300);ctx.stroke();
            ctx.fillStyle='#D6E5A5';ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#91A18A';ctx.font='11px monospace';ctx.fillText('VISCERAL CORE // BUMPER ARRAY',22,335);
            if(!active || ended || !launched){
                ctx.fillStyle='rgba(3,7,5,.72)';ctx.fillRect(120,150,400,58);
                ctx.textAlign='center';ctx.fillStyle='#DDE8B8';ctx.font='bold 15px monospace';
                ctx.fillText(ended?'TABLE SHUTDOWN':(!active?'TABLE IN STANDBY':'BALL READY'),320,176);
                ctx.fillStyle='#91A18A';ctx.font='10px monospace';ctx.fillText(ended?'INITIALIZE TO TRY AGAIN':'PRESS LAUNCH BALL',320,193);ctx.textAlign='left';
            }
        }
        function launch() {
            if(ended || !active){start();return;}
            if(!launched){launched=true;ball.vx=-4.8;ball.vy=-8.2;launchBtn.textContent='BALL IN PLAY';statusEl.textContent='CORE ACTIVE';}
        }
        function start() {
            cancelAnimationFrame(raf);score=0;lives=3;active=true;ended=false;
            scoreEl.textContent='0000';livesEl.textContent='3';statusEl.textContent='TABLE ONLINE';
            resetBall();draw();launchBtn.textContent='LAUNCH BALL';canvas.focus();raf=requestAnimationFrame(loop);
        }
        function loseBall() {
            lives--;livesEl.textContent=String(lives);
            if(lives<=0){active=false;ended=true;statusEl.textContent='TABLE SHUTDOWN';launchBtn.textContent='RESTART';}
            else {resetBall();statusEl.textContent='BALL RECOVERY';}
            draw();
        }
        function loop() {
            if(!active)return;
            if(launched){
                ball.vy+=0.19;ball.x+=ball.vx;ball.y+=ball.vy;
                if(ball.x<17){ball.x=17;ball.vx=Math.abs(ball.vx)*.85;}
                if(ball.x>623){ball.x=623;ball.vx=-Math.abs(ball.vx)*.85;}
                if(ball.y<17){ball.y=17;ball.vy=Math.abs(ball.vy)*.85;}
                bumpers.forEach(b=>{
                    const dx=ball.x-b.x,dy=ball.y-b.y,dist=Math.hypot(dx,dy),min=ball.r+b.r;
                    if(dist<min && dist>0){
                        const nx=dx/dist,ny=dy/dist;
                        ball.x=b.x+nx*(min+1);ball.y=b.y+ny*(min+1);
                        const dot=ball.vx*nx+ball.vy*ny;
                        ball.vx=(ball.vx-2*dot*nx)*1.08+nx*1.2;
                        ball.vy=(ball.vy-2*dot*ny)*1.08+ny*1.2;
                        updateScore(25);
                    }
                });
                if(leftPressed && ball.y>275 && ball.x>115 && ball.x<270){ball.vy=-10.5;ball.vx-=1.5;ball.y=270;updateScore(5);}
                if(rightPressed && ball.y>275 && ball.x>365 && ball.x<505){ball.vy=-10.5;ball.vx+=1.5;ball.y=270;updateScore(5);}
                if(ball.y>370){loseBall();}
            }
            draw();
            if(active)raf=requestAnimationFrame(loop);
        }
        launchBtn.addEventListener('click',launch);
        canvas.addEventListener('click',launch);
        canvas.addEventListener('keydown',event=>{
            if(event.key===' '){event.preventDefault();launch();}
            if(event.key==='a'||event.key==='A')leftPressed=true;
            if(event.key==='d'||event.key==='D')rightPressed=true;
        });
        canvas.addEventListener('keyup',event=>{if(event.key==='a'||event.key==='A')leftPressed=false;if(event.key==='d'||event.key==='D')rightPressed=false;});
        root.querySelectorAll('[data-pinball]').forEach(btn=>{
            const side=btn.getAttribute('data-pinball');
            const set=(value)=>{if(side==='left')leftPressed=value;else rightPressed=value;};
            btn.addEventListener('pointerdown',event=>{event.preventDefault();set(true);});
            ['pointerup','pointerleave','pointercancel'].forEach(type=>btn.addEventListener(type,()=>set(false)));
        });
        resetBall();draw();
    })();

    // STASIS RUN // original side-scrolling escape game
    (() => {
        const canvas=$('#kd-runner-canvas'),ctx=canvas.getContext('2d');
        const scoreEl=$('#kd-runner-score'),bestEl=$('#kd-runner-best'),shardsEl=$('#kd-runner-shards');
        const statusEl=$('#kd-runner-status'),startBtn=$('#kd-runner-start'),jumpBtn=$('#kd-runner-jump');
        const ground=211;
        let active=false,ended=false,score=0,best=savedBest('kd404-best-runner'),shards=0,last=0,spawn=0,raf=0,speed=4.3;
        let player,obstacles=[],crystals=[];
        bestEl.textContent=formatScore(best);
        function reset() {
            player={x:82,y:ground-31,w:31,h:31,vy:0,onGround:true};
            obstacles=[];crystals=[];score=0;shards=0;speed=4.3;spawn=800;
            scoreEl.textContent='0000';shardsEl.textContent='0';
        }
        function jump(){if(active&&player.onGround){player.vy=-10.8;player.onGround=false;}}
        function updateBest(){scoreEl.textContent=formatScore(score);if(score>best){best=score;bestEl.textContent=formatScore(best);storage.set('kd404-best-runner',best);}}
        function start(){cancelAnimationFrame(raf);reset();active=true;ended=false;statusEl.textContent='ESCAPE IN PROGRESS';startBtn.textContent='RESTART';canvas.focus();last=performance.now();raf=requestAnimationFrame(loop);}
        function gameOver(){active=false;ended=true;statusEl.textContent='SUBJECT DETECTED';startBtn.textContent='RUN AGAIN';draw();}
        function drawCharacter(){
            const x=player.x,y=player.y;
            // Lynx ears, hedgehog spines, and a compact runner silhouette.
            ctx.fillStyle='#A8BC78';
            ctx.beginPath();ctx.moveTo(x+7,y+8);ctx.lineTo(x+5,y-8);ctx.lineTo(x+16,y+4);ctx.closePath();ctx.fill();
            ctx.beginPath();ctx.moveTo(x+19,y+5);ctx.lineTo(x+27,y-9);ctx.lineTo(x+27,y+13);ctx.closePath();ctx.fill();
            ctx.fillStyle='#B7C4A0';
            ctx.beginPath();ctx.ellipse(x+16,y+18,14,12,0,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#6C7F4A';
            for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(x+4+i*4,y+8);ctx.lineTo(x+2+i*4,y-3-(i%2)*3);ctx.lineTo(x+9+i*4,y+6);ctx.fill();}
            ctx.fillStyle='#171d16';ctx.beginPath();ctx.arc(x+23,y+14,2,0,Math.PI*2);ctx.fill();
            ctx.fillStyle='#B7C4A0';ctx.beginPath();ctx.moveTo(x+3,y+23);ctx.quadraticCurveTo(x-11,y+18,x-8,y+29);ctx.quadraticCurveTo(x-1,y+34,x+6,y+28);ctx.fill();
            ctx.fillStyle='#B5C94A';ctx.fillRect(x+7,y+28,9,3);
        }
        function draw(){
            ctx.fillStyle='#080d0a';ctx.fillRect(0,0,720,260);
            // Distant Stasis City skyline.
            ctx.fillStyle='#111a14';
            for(let i=0;i<12;i++){
                const bx=i*72-((Math.floor(score*0.3)%72));
                const h=45+(i*37%75);
                ctx.fillRect(bx,ground-h,46,h);
                ctx.fillStyle='rgba(181,201,74,.28)';
                for(let wy=ground-h+10;wy<ground-8;wy+=14)ctx.fillRect(bx+9,wy,4,5);
                ctx.fillStyle='#111a14';
            }
            ctx.strokeStyle='rgba(181,201,74,.22)';ctx.lineWidth=1;
            ctx.beginPath();ctx.moveTo(0,ground+1);ctx.lineTo(720,ground+1);ctx.stroke();
            ctx.fillStyle='#273222';ctx.fillRect(0,ground+2,720,49);
            ctx.strokeStyle='rgba(181,201,74,.12)';
            for(let x=0;x<720;x+=36){ctx.beginPath();ctx.moveTo(x,ground+2);ctx.lineTo(x-18,260);ctx.stroke();}
            obstacles.forEach(o=>{ctx.fillStyle='#8D444A';ctx.fillRect(o.x,o.y,o.w,o.h);ctx.fillStyle='#D18888';ctx.fillRect(o.x+4,o.y+4,o.w-8,4);});
            crystals.forEach(c=>{ctx.save();ctx.translate(c.x,c.y);ctx.rotate(Math.PI/4);ctx.fillStyle='#B5C94A';ctx.fillRect(-6,-6,12,12);ctx.fillStyle='#E4F0B2';ctx.fillRect(-2,-2,4,4);ctx.restore();});
            if(player)drawCharacter();
            // Entity trace approaching from behind the skyline.
            if(active||ended){ctx.fillStyle='rgba(170,45,58,.6)';ctx.beginPath();ctx.ellipse(675,ground-13,18,29,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e4a0a0';ctx.fillRect(665,ground-24,3,3);}
            if(!active){
                ctx.fillStyle='rgba(3,7,5,.72)';ctx.fillRect(150,94,420,70);
                ctx.textAlign='center';ctx.fillStyle='#DDE8B8';ctx.font='bold 15px monospace';
                ctx.fillText(ended?'SIGNAL LOST // SUBJECT CAPTURED':'STASIS CITY // QUARANTINE ZONE',360,122);
                ctx.fillStyle='#91A18A';ctx.font='10px monospace';ctx.fillText(ended?'RESTART TO TRY AGAIN':'INITIALIZE TO ESCAPE',360,143);ctx.textAlign='left';
            }
        }
        function loop(now){
            if(!active)return;
            const dt=Math.min(32,now-last);last=now;const factor=dt/16.67;
            speed=Math.min(8.5,4.3+score/900);
            player.vy+=0.58*factor;player.y+=player.vy*factor;
            if(player.y>=ground-player.h){player.y=ground-player.h;player.vy=0;player.onGround=true;}
            spawn-=dt;
            if(spawn<=0){
                const h=22+Math.random()*25,w=18+Math.random()*15;
                obstacles.push({x:735,y:ground-h,w:w,h:h});
                if(Math.random()<.72)crystals.push({x:820+Math.random()*120,y:ground-70-Math.random()*40});
                spawn=950+Math.random()*780;
            }
            obstacles.forEach(o=>o.x-=speed*factor);
            crystals.forEach(c=>c.x-=speed*factor);
            obstacles=obstacles.filter(o=>o.x+o.w>0);
            crystals=crystals.filter(c=>c.x>-15);
            const px=player.x+5,py=player.y+5,pw=player.w-9,ph=player.h-7;
            for(const o of obstacles){
                if(px<o.x+o.w-3&&px+pw>o.x+3&&py<o.y+o.h&&py+ph>o.y+3){gameOver();return;}
            }
            crystals=crystals.filter(c=>{
                const hit=Math.abs((px+pw/2)-c.x)<17&&Math.abs((py+ph/2)-c.y)<20;
                if(hit){shards++;shardsEl.textContent=String(shards);score+=50;return false;}
                return true;
            });
            score+=Math.max(1,Math.floor(dt/80));updateBest();draw();
            raf=requestAnimationFrame(loop);
        }
        startBtn.addEventListener('click',start);
        jumpBtn.addEventListener('click',jump);
        canvas.addEventListener('pointerdown',jump);
        canvas.addEventListener('keydown',event=>{if(event.key===' '||event.key==='ArrowUp'){event.preventDefault();jump();}});
        reset();draw();
    })();

    // NETWORK SIGNALS // atmospheric messages, not remote chat.
    (() => {
        const messages=[
            'STASIS CITY RELAY: signal received. Keep moving, operator.',
            'UNKNOWN CHANNEL: something is repeating your heartbeat.',
            'KURAMI // encrypted ping detected. Origin cannot be verified.',
            'CONTAINMENT NOTICE: do not answer the voice inside the core.',
            'VISCERAL ENTITY: [TRANSMISSION CORRUPTED] ...LET ME OUT...',
            'CITY SYSTEM: quarantine lights are flickering in sector 04.',
            'ARCHIVE FRAGMENT: Knives was not supposed to survive the procedure.'
        ];
        const button=$('#kd-signal-button'),output=$('#kd-signal-output');
        button.addEventListener('click',()=>{
            const message=messages[Math.floor(Math.random()*messages.length)];
            output.textContent='> '+message;
            output.classList.remove('kd-signal-flash');
            void output.offsetWidth;
            output.classList.add('kd-signal-flash');
        });
    })();

    // CLASSIFIED FILE // code 404 reveals the character dossier.
    (() => {
        const form=$('#kd-archive-form'),input=$('#kd-archive-code');
        const message=$('#kd-archive-message'),dossier=$('#kd-dossier');
        form.addEventListener('submit',event=>{
            event.preventDefault();
            if(input.value.trim()==='404'){
                dossier.classList.add('is-open');
                dossier.setAttribute('aria-hidden','false');
                message.textContent='ACCESS GRANTED // FILE DECRYPTED';
                message.style.color='#B5C94A';
            }else{
                dossier.classList.remove('is-open');
                dossier.setAttribute('aria-hidden','true');
                message.textContent='ACCESS DENIED // INVALID CODE';
                message.style.color='#e2a2a2';
            }
        });
    })();
})();
