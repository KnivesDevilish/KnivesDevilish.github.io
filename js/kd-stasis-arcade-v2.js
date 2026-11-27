/* KD-404 // STASIS CITY ARCADE // TETRIS + CLASSIFIED ARCHIVE */
(() => {
'use strict';
if(document.getElementById('kd-stasis-arcade-v2'))return;
const shell=document.querySelector('.site-shell');
const footer=shell&&shell.querySelector('.site-footer');
if(!shell||!footer){console.error('STASIS ARCADE: site shell or footer not found.');return;}
const root=document.createElement('section');
root.id='kd-stasis-arcade-v2';
root.className='kd-arcade-v2';
root.innerHTML=
'<header class="kd2-head"><div><small>SECTOR 07 // RECREATION & CONTAINMENT</small><h2>STASIS CITY <i>//</i> ARCADE</h2><p>ONE ACTIVE SIMULATION // RESTRICTED INTELLIGENCE ARCHIVE.</p></div><span class="kd2-online">● LOCAL SYSTEM ONLINE</span></header>'+
'<div class="kd2-layout"><nav class="kd2-nav" aria-label="Arcade selection"><small>SELECT PROGRAM</small>'+
'<button type="button" class="is-active" data-game="tetris" aria-pressed="true"><b>01</b><span><strong>TETRIS</strong><small>PUZZLE / ENDLESS LEVELS</small></span>›</button>'+
'<button type="button" data-game="archive" aria-pressed="false"><b>02</b><span><strong>CLASSIFIED ARCHIVE</strong><small>INTEL / EASTER EGGS</small></span>›</button>'+
'<div class="kd2-nav-foot">OPERATOR // KD-404<br>INPUT // KEYBOARD & TOUCH</div></nav>'+
'<main class="kd2-main"><header class="kd2-game-head"><div><small id="kd2-type">PUZZLE / ENDLESS LEVELS</small><h3 id="kd2-title">TETRIS</h3><p id="kd2-desc">Fit the falling blocks, clear lines and advance through an endless sequence of increasingly difficult levels.</p></div><span>BUILD 04.00<br>STASIS CITY LAB</span></header>'+
'<div id="kd2-cabinet" class="kd2-cabinet"></div>'+
'<footer class="kd2-foot"><span id="kd2-tip">← → MOVE · ↑ ROTATE · ↓ SOFT DROP · SPACE HARD DROP</span><span>RECORDS // THIS DEVICE</span></footer></main></div>';
shell.insertBefore(root,footer);
const $=s=>root.querySelector(s),cabinet=$('#kd2-cabinet');
const best=key=>Math.max(0,Number(safeGet('kd404-v2-'+key,key==='tetris'?safeGet('kd404-v2-bloodlock','0'):'0'))||0);
function safeGet(k,f){try{return localStorage.getItem(k)??f;}catch(e){return f;}}
function safeSet(k,v){try{localStorage.setItem(k,String(v));}catch(e){}}
const fmt=n=>Math.max(0,Math.floor(n)).toLocaleString('en-US');
let stop=()=>{};
const info={
 tetris:['PUZZLE / ENDLESS LEVELS','TETRIS','Fit the falling blocks, clear lines and advance through an endless sequence of increasingly difficult levels.','← → MOVE · ↑ ROTATE · ↓ SOFT DROP · SPACE HARD DROP'],
 archive:['INTEL / UNKNOWN SIGNAL','CLASSIFIED ARCHIVE','Recover restricted files, enter secret codes and listen to transmissions from Stasis City.','EASTER EGGS // CODE 404']
};
function choose(id){
 stop();stop=()=>{};
 root.querySelectorAll('[data-game]').forEach(b=>{const yes=b.dataset.game===id;b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes));});
 $('#kd2-type').textContent=info[id][0];$('#kd2-title').textContent=info[id][1];$('#kd2-desc').textContent=info[id][2];$('#kd2-tip').textContent=info[id][3];
 if(id==='tetris')tetris();
 if(id==='archive')archive();
}
root.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.game)));

function tetris(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-tetris-stage"><div class="kd2-label"><span>TETRIS GRID // 10 × 20</span><b id="bl-state">STANDBY</b></div><canvas id="bl-board" width="300" height="600" tabindex="0" aria-label="Tetris game board"></canvas><div class="kd2-label"><span>LINES CLEARED</span><b id="bl-level">LEVEL 01</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>SCORE</small><strong id="bl-score">0</strong></div><div class="kd2-stat"><small>RECORD</small><strong id="bl-best">'+fmt(best('tetris'))+'</strong></div><div class="kd2-next"><small>NEXT PIECE</small><canvas id="bl-next" width="120" height="90"></canvas></div><button class="kd2-primary" id="bl-start">START TETRIS</button><div class="kd2-controls"><button data-bl="left">◀</button><button data-bl="rotate">ROTATE</button><button data-bl="right">▶</button><button data-bl="down">▼</button><button data-bl="drop">HARD DROP</button></div><p class="kd2-help">← → MOVE · ↑ ROTATE · ↓ SOFT DROP · SPACE HARD DROP</p></aside></div>';
 const c=$('#bl-board'),x=c.getContext('2d'),nc=$('#bl-next'),nx=nc.getContext('2d'),score=$('#bl-score'),record=$('#bl-best'),state=$('#bl-state'),level=$('#bl-level'),start=$('#bl-start');
 const W=10,H=20,S=30,shapes=[[[1,1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1],[1,1]],[[0,1,1],[1,1,0]],[[0,1,0],[1,1,1]],[[1,1,0],[0,1,1]]],colors=['#a8c66c','#c85c66','#839ba9','#d6c66f','#72ad90','#a78cbd','#c47b62'];
 let board,piece,next,points=0,lines=0,active=false,ended=false,raf=0,last=0,acc=0,interval=.8;
 const make=()=>{let i=Math.random()*7|0;return {m:shapes[i].map(r=>r.slice()),color:colors[i],x:3,y:0};};
 function hit(m,px,py){for(let y=0;y<m.length;y++)for(let z=0;z<m[y].length;z++)if(m[y][z]){let a=px+z,b=py+y;if(a<0||a>=W||b>=H||(b>=0&&board[b][a]))return true;}return false;}
 function draw(){
  x.fillStyle='#070b08';x.fillRect(0,0,300,600);x.strokeStyle='rgba(181,201,74,.09)';
  for(let i=0;i<=W;i++){x.beginPath();x.moveTo(i*S,0);x.lineTo(i*S,600);x.stroke();}
  for(let i=0;i<=H;i++){x.beginPath();x.moveTo(0,i*S);x.lineTo(300,i*S);x.stroke();}
  board.forEach((r,y)=>r.forEach((v,z)=>{if(v)cell(x,z,y,v,S);}));
  if(piece)piece.m.forEach((r,y)=>r.forEach((v,z)=>{if(v&&piece.y+y>=0)cell(x,piece.x+z,piece.y+y,piece.color,S);}));
  if(!active){x.fillStyle='rgba(3,7,5,.82)';x.fillRect(15,255,270,90);x.textAlign='center';x.fillStyle='#e0e9c7';x.font='bold 15px monospace';x.fillText(ended?'GAME OVER':'TETRIS READY',150,290);x.fillStyle='#9aa68f';x.font='11px monospace';x.fillText('INITIALIZE TO BEGIN',150,315);x.textAlign='left';}
 }
 function cell(ctx,a,b,color,size){ctx.fillStyle=color;ctx.fillRect(a*size+1,b*size+1,size-2,size-2);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(a*size+4,b*size+4,size-8,3);}
 function nextDraw(){nx.fillStyle='#070b08';nx.fillRect(0,0,120,90);let size=20,ox=(120-next.m[0].length*size)/2,oy=(90-next.m.length*size)/2;next.m.forEach((r,y)=>r.forEach((v,z)=>{if(v)cell(nx,0,0,'#000',1),nx.fillStyle=next.color,nx.fillRect(ox+z*size+1,oy+y*size+1,size-2,size-2);}));}
 function update(){score.textContent=fmt(points);let b=Math.max(best('tetris'),points);safeSet('kd404-v2-tetris',b);record.textContent=fmt(b);const levelNo=Math.floor(lines/10)+1;
  level.textContent='LEVEL '+String(levelNo).padStart(2,'0')+' // '+(lines%10)+'/10 LINES';
  interval=Math.max(1/60,.8*Math.pow(.9,levelNo-1));}
 function lock(){
  piece.m.forEach((r,y)=>r.forEach((v,z)=>{if(v&&piece.y+y>=0)board[piece.y+y][piece.x+z]=piece.color;}));
  let n=0;for(let y=H-1;y>=0;y--)if(board[y].every(Boolean)){board.splice(y,1);board.unshift(Array(W).fill(null));n++;y++;}
  if(n){lines+=n;const levelNo=Math.floor(lines/10)+1;points+=([0,40,100,300,1200][n]||n*300)*levelNo;update();}
  piece=next;piece.x=3;piece.y=0;next=make();nextDraw();
  if(hit(piece.m,piece.x,piece.y)){active=false;ended=true;state.textContent='GAME OVER';start.textContent='PLAY AGAIN';}
 }
 function descend(){if(hit(piece.m,piece.x,piece.y+1))lock();else piece.y++;}
 function action(a){
  if(!active)return;
  if(a==='left'&&!hit(piece.m,piece.x-1,piece.y))piece.x--;
  if(a==='right'&&!hit(piece.m,piece.x+1,piece.y))piece.x++;
  if(a==='down'){descend();points+=Math.floor(lines/10)+1;update();}
  if(a==='rotate'){let m=piece.m[0].map((_,i)=>piece.m.map(r=>r[i]).reverse());if(!hit(m,piece.x,piece.y))piece.m=m;else if(!hit(m,piece.x-1,piece.y)){piece.x--;piece.m=m;}}
  if(a==='drop'){let d=0;while(!hit(piece.m,piece.x,piece.y+1)){piece.y++;d++;}points+=d*2*(Math.floor(lines/10)+1);update();lock();}
  draw();
 }
 function frame(t){if(!active)return;if(!last)last=t;acc+=Math.min(.05,(t-last)/1000);last=t;while(acc>=interval&&active){descend();acc-=interval;}draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);board=Array.from({length:H},()=>Array(W).fill(null));piece=make();next=make();piece.x=3;points=0;lines=0;interval=.8;last=0;acc=0;active=true;ended=false;state.textContent='LEVEL 01 // ACTIVE';start.textContent='RESTART TETRIS';update();nextDraw();draw();c.focus();raf=requestAnimationFrame(frame);}
 start.addEventListener('click',begin);cabinet.querySelectorAll('[data-bl]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.bl)));
 c.addEventListener('keydown',e=>{let map={ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',ArrowUp:'rotate',' ':'drop'};if(map[e.key]){e.preventDefault();action(map[e.key]);}});
 board=Array.from({length:H},()=>Array(W).fill(null));next=make();nextDraw();draw();
 stop=()=>{active=false;cancelAnimationFrame(raf);};
}

function archive(){
 cabinet.innerHTML='<div class="kd2-archive"><article><small>RESTRICTED ARCHIVE // K-404</small><h4>SUBJECT FILE: KNIVES</h4><p>The medical record is encrypted. Enter the recovered authorization code to reveal the report.</p><form id="ar-form"><label for="ar-code">AUTHORIZATION CODE</label><div><input id="ar-code" type="password" maxlength="8" inputmode="numeric" placeholder="ENTER CODE"><button class="kd2-primary" type="submit">DECRYPT FILE</button></div></form><p id="ar-message" aria-live="polite">FILE LOCKED // AUTHORIZATION REQUIRED</p><section id="ar-file" hidden><h5>STASIS CITY // MEDICAL & CONTAINMENT RECORD</h5><dl><dt>SUBJECT</dt><dd>KNIVES</dd><dt>SPECIES</dt><dd>HEDGEHOG / LYNX HYBRID</dd><dt>LOCATION</dt><dd>STASIS CITY</dd><dt>MEDICAL STATUS</dt><dd>TERMINAL CONDITION</dd><dt>EXPERIMENT</dt><dd>DEMONIC BLOOD INFUSION</dd><dt>INTERNAL ENTITY</dt><dd>VISCERAL DEMON // ACTIVE</dd><dt>FAMILY CONTACT</dt><dd>KURAMI // SISTER</dd><dt>CONTAINMENT</dt><dd>UNSTABLE</dd></dl><p class="kd2-kurami">INCOMING MESSAGE // KURAMI: “Knives... if you can hear this, stay with me. Do not let it take control.”</p></section></article><article><small>NETWORK EVENT // INCOMING</small><h4>TRANSMIT A SIGNAL</h4><p>Send a pulse into the Stasis City network. Some replies may not be from the system.</p><button class="kd2-primary" id="ar-signal">TRANSMIT SIGNAL</button><p id="ar-output" class="kd2-output" aria-live="polite">AWAITING INPUT...</p></article></div>';
 $('#ar-form').addEventListener('submit',e=>{e.preventDefault();let ok=$('#ar-code').value.trim()==='404';$('#ar-file').hidden=!ok;$('#ar-message').textContent=ok?'ACCESS GRANTED // FILE DECRYPTED':'ACCESS DENIED // INVALID CODE';$('#ar-message').classList.toggle('success',ok);});
 const msgs=['STASIS CITY RELAY: signal received. Keep moving, operator.','UNKNOWN CHANNEL: something is repeating your heartbeat.','KURAMI // encrypted ping detected. Origin cannot be verified.','CONTAINMENT NOTICE: do not answer the voice inside the core.','VISCERAL ENTITY: [TRANSMISSION CORRUPTED] ...LET ME OUT...','ARCHIVE FRAGMENT: Knives was not supposed to survive the procedure.'];
 $('#ar-signal').addEventListener('click',()=>$('#ar-output').textContent='> '+msgs[Math.random()*msgs.length|0]);
}

choose('tetris');
})();