/* KD-404 // STASIS CITY ARCADE // THREE-GAME BUILD */
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
'<header class="kd2-head"><div><small>SECTOR 07 // RECREATION & CONTAINMENT</small><h2>STASIS CITY <i>//</i> ARCADE</h2><p>THREE SIMULATIONS RECOVERED FROM THE STASIS CITY NETWORK.</p></div><span class="kd2-online">● LOCAL SYSTEM ONLINE</span></header>'+
'<div class="kd2-layout"><nav class="kd2-nav" aria-label="Arcade selection"><small>SELECT PROGRAM</small>'+
'<button type="button" class="is-active" data-game="tanks" aria-pressed="true"><b>01</b><span><strong>STASIS BREACH</strong><small>TANK COMMAND / BASE DEFENSE</small></span>›</button>'+
'<button type="button" data-game="tetris" aria-pressed="false"><b>02</b><span><strong>TETRIS</strong><small>PUZZLE / HIGH SCORE</small></span>›</button>'+
'<button type="button" data-game="pacman" aria-pressed="false"><b>03</b><span><strong>PAC-MAN</strong><small>MAZE / SURVIVAL</small></span>›</button>'+
'<div class="kd2-nav-foot">OPERATOR // KD-404<br>INPUT // KEYBOARD & TOUCH</div></nav>'+
'<main class="kd2-main"><header class="kd2-game-head"><div><small id="kd2-type">TANK COMMAND / BASE DEFENSE</small><h3 id="kd2-title">STASIS BREACH</h3><p id="kd2-desc">Command your tank, destroy enemy armor and protect the Stasis core.</p></div><span>BUILD 03.00<br>STASIS CITY LAB</span></header>'+
'<div id="kd2-cabinet" class="kd2-cabinet"></div>'+
'<footer class="kd2-foot"><span id="kd2-tip">ARROWS / WASD MOVE · SPACE FIRE · DEFEND THE CORE</span><span>RECORDS // THIS DEVICE</span></footer></main></div>';
shell.insertBefore(root,footer);
const $=s=>root.querySelector(s),cabinet=$('#kd2-cabinet');
const best=key=>Math.max(0,Number(safeGet('kd404-v2-'+key,'0'))||0);
function safeGet(k,f){try{return localStorage.getItem(k)??f;}catch(e){return f;}}
function safeSet(k,v){try{localStorage.setItem(k,String(v));}catch(e){}}
const fmt=n=>Math.max(0,Math.floor(n)).toLocaleString('en-US');
let stop=()=>{};
const info={
 tanks:['TANK COMMAND / BASE DEFENSE','STASIS BREACH','Command your tank, destroy enemy armor and protect the Stasis core.','ARROWS / WASD MOVE · SPACE / J FIRE · DEFEND THE CORE'],
 tetris:['PUZZLE / HIGH SCORE','TETRIS','Fit the falling blocks, clear lines and keep the stack below the ceiling.','← → MOVE · ↑ ROTATE · ↓ SOFT DROP · SPACE HARD DROP'],
 pacman:['MAZE / SURVIVAL','PAC-MAN','Clear the maze, collect every dot and use power pellets to turn the hunt around.','ARROWS / WASD MOVE · COLLECT DOTS · AVOID GHOSTS']
};
function choose(id){
 stop();stop=()=>{};
 root.querySelectorAll('[data-game]').forEach(b=>{const yes=b.dataset.game===id;b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes));});
 $('#kd2-type').textContent=info[id][0];$('#kd2-title').textContent=info[id][1];$('#kd2-desc').textContent=info[id][2];$('#kd2-tip').textContent=info[id][3];
 if(id==='tanks')tanks();
 if(id==='tetris')tetris();
 if(id==='pacman')pacman();
}
root.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.game)));

function tetris(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-tetris-stage"><div class="kd2-label"><span>TETRIS GRID // 10 × 20</span><b id="bl-state">STANDBY</b></div><canvas id="bl-board" width="300" height="600" tabindex="0" aria-label="Bloodlock puzzle board"></canvas><div class="kd2-label"><span>LINES CLEARED</span><b id="bl-level">LEVEL 01</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>SCORE</small><strong id="bl-score">0</strong></div><div class="kd2-stat"><small>RECORD</small><strong id="bl-best">'+fmt(best('tetris'))+'</strong></div><div class="kd2-next"><small>NEXT PIECE</small><canvas id="bl-next" width="120" height="90"></canvas></div><button class="kd2-primary" id="bl-start">START TETRIS</button><div class="kd2-controls"><button data-bl="left">◀</button><button data-bl="rotate">ROTATE</button><button data-bl="right">▶</button><button data-bl="down">▼</button><button data-bl="drop">HARD DROP</button></div><p class="kd2-help">← → MOVE · ↑ ROTATE · ↓ SOFT DROP · SPACE HARD DROP</p></aside></div>';
 const c=$('#bl-board'),x=c.getContext('2d'),nc=$('#bl-next'),nx=nc.getContext('2d'),score=$('#bl-score'),record=$('#bl-best'),state=$('#bl-state'),level=$('#bl-level'),start=$('#bl-start');
 const W=10,H=20,S=30,shapes=[[[1,1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[1,1],[1,1]],[[0,1,1],[1,1,0]],[[0,1,0],[1,1,1]],[[1,1,0],[0,1,1]]],colors=['#a8c66c','#c85c66','#839ba9','#d6c66f','#72ad90','#a78cbd','#c47b62'];
 let board,piece,next,points=0,lines=0,active=false,ended=false,raf=0,last=0,acc=0,interval=.7;
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
 function update(){score.textContent=fmt(points);let b=Math.max(best('tetris'),points);safeSet('kd404-v2-tetris',b);record.textContent=fmt(b);level.textContent='LEVEL '+String(1+(lines/8|0)).padStart(2,'0');interval=Math.max(.1,.7-(lines/8|0)*.05);}
 function lock(){
  piece.m.forEach((r,y)=>r.forEach((v,z)=>{if(v&&piece.y+y>=0)board[piece.y+y][piece.x+z]=piece.color;}));
  let n=0;for(let y=H-1;y>=0;y--)if(board[y].every(Boolean)){board.splice(y,1);board.unshift(Array(W).fill(null));n++;y++;}
  if(n){lines+=n;points+=([0,100,300,500,800][n]||n*250);update();}
  piece=next;piece.x=3;piece.y=0;next=make();nextDraw();
  if(hit(piece.m,piece.x,piece.y)){active=false;ended=true;state.textContent='CORE BREACH';start.textContent='RESTART CORE';}
 }
 function descend(){if(hit(piece.m,piece.x,piece.y+1))lock();else piece.y++;}
 function action(a){
  if(!active)return;
  if(a==='left'&&!hit(piece.m,piece.x-1,piece.y))piece.x--;
  if(a==='right'&&!hit(piece.m,piece.x+1,piece.y))piece.x++;
  if(a==='down'){descend();points++;update();}
  if(a==='rotate'){let m=piece.m[0].map((_,i)=>piece.m.map(r=>r[i]).reverse());if(!hit(m,piece.x,piece.y))piece.m=m;else if(!hit(m,piece.x-1,piece.y)){piece.x--;piece.m=m;}}
  if(a==='drop'){let d=0;while(!hit(piece.m,piece.x,piece.y+1)){piece.y++;d++;}points+=d*2;update();lock();}
  draw();
 }
 function frame(t){if(!active)return;if(!last)last=t;acc+=Math.min(.05,(t-last)/1000);last=t;while(acc>=interval&&active){descend();acc-=interval;}draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);board=Array.from({length:H},()=>Array(W).fill(null));piece=make();next=make();piece.x=3;points=0;lines=0;interval=.7;last=0;acc=0;active=true;ended=false;state.textContent='CONTAINMENT ACTIVE';start.textContent='RESTART CORE';update();nextDraw();draw();c.focus();raf=requestAnimationFrame(frame);}
 start.addEventListener('click',begin);cabinet.querySelectorAll('[data-bl]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.bl)));
 c.addEventListener('keydown',e=>{let map={ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',ArrowUp:'rotate',' ':'drop'};if(map[e.key]){e.preventDefault();action(map[e.key]);}});
 board=Array.from({length:H},()=>Array(W).fill(null));next=make();nextDraw();draw();
 stop=()=>{active=false;cancelAnimationFrame(raf);};
}

function tanks(){
 const TILE=40,W=520,H=520,SIZE=26;
 const layout=[
  '.............',
  '..b....b....b',
  '..b....b....b',
  '.............',
  '.bb..bbb..bb.',
  '.b.........b.',
  '.....#.#.....',
  '..bb.....bb..',
  '...b..b..b...',
  '.............',
  '.b..b...b..b.',
  '.....bbb.....',
  '.....bEb.....'
 ];
 const dirs={up:{x:0,y:-1,a:-Math.PI/2},right:{x:1,y:0,a:0},down:{x:0,y:1,a:Math.PI/2},left:{x:-1,y:0,a:Math.PI}};
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-tank-stage"><div class="kd2-label"><span>STASIS BREACH // FRONTLINE 01</span><b id="tk-state">READY</b></div><canvas id="tk-board" width="520" height="520" tabindex="0" aria-label="Stasis Breach tank battle game"></canvas><div class="kd2-label"><span>PROTECT THE CORE</span><b>ENEMY ARMOR INBOUND</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>SCORE</small><strong id="tk-score">0</strong></div><div class="kd2-stat"><small>BEST</small><strong id="tk-best">0</strong></div><div class="kd2-stat"><small>WAVE</small><strong id="tk-wave">01</strong></div><div class="kd2-stat"><small>LIVES</small><strong id="tk-lives">3</strong></div><div class="kd2-stat"><small>HOSTILES LEFT</small><strong id="tk-left">8</strong></div><button class="kd2-primary" id="tk-start">DEPLOY TANK</button><div class="kd2-tank-pad"><button data-tank="up">▲</button><button data-tank="fire" class="kd2-tank-fire">FIRE</button><button data-tank="left">◀</button><button data-tank="down">▼</button><button data-tank="right">▶</button></div><p class="kd2-help">ARROWS / WASD DRIVE · SPACE / J FIRE. BRICK WALLS CAN BE DESTROYED. STEEL CANNOT. DO NOT LET ENEMIES DESTROY YOUR BASE.</p></aside></div>';
 const c=$('#tk-board'),g=c.getContext('2d'),state=$('#tk-state'),scoreNode=$('#tk-score'),bestNode=$('#tk-best'),waveNode=$('#tk-wave'),livesNode=$('#tk-lives'),leftNode=$('#tk-left'),start=$('#tk-start');
 let map=[],player=null,enemies=[],bullets=[],score=0,lives=3,wave=1,queued=8,spawnTimer=0,intermission=0,active=false,ended=false,raf=0,last=0,keys={},touchDir=null,touchFire=false,baseAlive=true,baseBlink=0;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const copyMap=()=>layout.map(row=>row.split(''));
 const rectHit=(x,y,w,h,tile)=>x< (tile%13+1)*TILE&&x+w> (tile%13)*TILE&&y< (Math.floor(tile/13)+1)*TILE&&y+h>Math.floor(tile/13)*TILE;
 function blockedMap(x,y){
  const x1=Math.floor((x+3)/TILE),x2=Math.floor((x+SIZE-4)/TILE),y1=Math.floor((y+3)/TILE),y2=Math.floor((y+SIZE-4)/TILE);
  if(x1<0||y1<0||x2>=13||y2>=13)return true;
  for(let ty=y1;ty<=y2;ty++)for(let tx=x1;tx<=x2;tx++){const ch=map[ty][tx];if(ch==='b'||ch==='#'||ch==='~'||ch==='E')return true;}
  return false;
 }
 function overlaps(a,b,x=a.x,y=a.y){return x<b.x+b.w-2&&x+a.w-2>b.x&&y<b.y+b.h-2&&y+a.h-2>b.y;}
 function blockedActors(actor,x,y){
  if(player&&actor!==player&&overlaps(actor,player,x,y))return true;
  return enemies.some(other=>other!==actor&&overlaps(actor,other,x,y));
 }
 function canMove(actor,x,y){return !blockedMap(x,y)&&!blockedActors(actor,x,y);}
 function newTank(x,y,dir,kind='player'){
  return {x,y,w:SIZE,h:SIZE,dir,kind,hp:kind==='heavy'?2:1,speed:kind==='fast'?112:kind==='heavy'?57:76,turn:0,fire:0,inv:0};
 }
 function resetRound(){
  map=copyMap();player=newTank(6*TILE+7,10*TILE+7,'up');enemies=[];bullets=[];queued=8+Math.min(4,wave-1);spawnTimer=.55;intermission=0;baseAlive=true;baseBlink=0;touchDir=null;touchFire=false;keys={};updateHud();
 }
 function updateHud(){
  scoreNode.textContent=fmt(score);const record=Math.max(best('tanks'),score);bestNode.textContent=fmt(record);safeSet('kd404-v2-tanks',record);
  waveNode.textContent=String(wave).padStart(2,'0');livesNode.textContent=String(lives);leftNode.textContent=String(queued+enemies.length);
 }
 function finish(reason){
  active=false;ended=true;state.textContent=reason;start.textContent='RESTART DEFENSE';draw();
 }
 function hurtPlayer(){
  if(player.inv>0||!active)return;
  lives--;updateHud();
  if(lives<=0){finish('TANK DESTROYED');return;}
  player.x=6*TILE+7;player.y=10*TILE+7;player.dir='up';player.inv=2.1;
 }
 function shoot(t,hostile){
  if(t.fire>0||bullets.filter(b=>b.hostile===hostile).length>= (hostile?3:2))return;
  const d=dirs[t.dir],cx=t.x+t.w/2,cy=t.y+t.h/2;
  bullets.push({x:cx+d.x*17,y:cy+d.y*17,vx:d.x*310,vy:d.y*310,hostile,life:1.7,alive:true});
  t.fire=hostile?1.12+Math.random()*.8:.32;
 }
 function spawnEnemy(){
  const lanes=[1,6,11],lane=lanes[(Math.random()*lanes.length)|0],x=lane*TILE+7,y=6;
  if(enemies.some(e=>Math.abs(e.x-x)<34&&e.y<70)){spawnTimer=.45;return;}
  const n=8+Math.min(4,wave-1)-queued;
  const kind=n%7===5?'heavy':n%4===2?'fast':'basic';
  const enemy=newTank(x,y,'down',kind);enemy.speed+=Math.min(34,wave*3);enemy.turn=.5+Math.random();
  enemies.push(enemy);queued--;updateHud();
 }
 function chooseEnemyDir(e){
  const target=player&&Math.random()>.35?{x:player.x,y:player.y}:{x:6*TILE,y:12*TILE};
  const options=['down','left','right','up'].filter(name=>{const d=dirs[name];return !blockedMap(e.x+d.x*5,e.y+d.y*5)&&!blockedActors(e,e.x+d.x*5,e.y+d.y*5);});
  if(options.length>1){const reverse={up:'down',down:'up',left:'right',right:'left'}[e.dir];const filtered=options.filter(n=>n!==reverse);if(filtered.length)options.splice(0,options.length,...filtered);}
  options.sort((a,b)=>{
   const da=dirs[a],db=dirs[b],sa=Math.abs(e.x+da.x*50-target.x)+Math.abs(e.y+da.y*50-target.y),sb=Math.abs(e.x+db.x*50-target.x)+Math.abs(e.y+db.y*50-target.y);
   return sa-sb+(Math.random()-.5)*45;
  });
  return options[0]||e.dir;
 }
 function bulletTile(b){
  const tx=Math.floor(b.x/TILE),ty=Math.floor(b.y/TILE);
  if(tx<0||ty<0||tx>=13||ty>=13)return {stop:true};
  const ch=map[ty][tx];
  if(ch==='b'){map[ty][tx]='.';return {stop:true};}
  if(ch==='#'||ch==='~')return {stop:true};
  if(ch==='E'){if(b.hostile){baseAlive=false;finish('CORE DESTROYED');}return {stop:true};}
  return {stop:false};
 }
 function update(dt){
  if(!active)return;
  baseBlink+=dt;if(player.inv>0)player.inv=Math.max(0,player.inv-dt);player.fire=Math.max(0,player.fire-dt);
  const wanted=touchDir||(keys.up?'up':keys.down?'down':keys.left?'left':keys.right?'right':null);
  if(wanted)player.dir=wanted;
  if(wanted){const d=dirs[wanted],nx=player.x+d.x*player.speed*dt,ny=player.y+d.y*player.speed*dt;if(canMove(player,nx,ny)){player.x=nx;player.y=ny;}}
  if(keys.fire||touchFire)shoot(player,false);
  spawnTimer-=dt;if(queued>0&&spawnTimer<=0&&enemies.length<4){spawnEnemy();spawnTimer=Math.max(.65,1.2-wave*.035);}
  enemies.forEach(e=>{
   e.fire=Math.max(0,e.fire-dt);e.turn-=dt;
   if(e.turn<=0||!canMove(e,e.x+dirs[e.dir].x*3,e.y+dirs[e.dir].y*3)){e.dir=chooseEnemyDir(e);e.turn=.5+Math.random()*1.05;}
   const d=dirs[e.dir],nx=e.x+d.x*e.speed*dt,ny=e.y+d.y*e.speed*dt;
   if(canMove(e,nx,ny)){e.x=nx;e.y=ny;}else{e.turn=0;}
   if(e.fire<=0&&Math.random()<dt*1.1)shoot(e,true);
   if(player.inv<=0&&overlaps(e,player)){hurtPlayer();}
  });
  bullets.forEach(b=>{
   if(!b.alive)return;
   b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
   if(b.life<=0||b.x<0||b.y<0||b.x>W||b.y>H){b.alive=false;return;}
   for(const e of enemies){if(!b.hostile&&e.hp>0&&b.x>e.x-3&&b.x<e.x+e.w+3&&b.y>e.y-3&&b.y<e.y+e.h+3){e.hp--;b.alive=false;if(e.hp<=0){score+=e.kind==='heavy'?250:e.kind==='fast'?150:100;}return;}}
   if(b.hostile&&player.inv<=0&&b.x>player.x&&b.x<player.x+player.w&&b.y>player.y&&b.y<player.y+player.h){b.alive=false;hurtPlayer();return;}
   const hit=bulletTile(b);if(hit.stop)b.alive=false;
  });
  enemies=enemies.filter(e=>e.hp>0);bullets=bullets.filter(b=>b.alive);
  if(queued===0&&enemies.length===0){
   if(intermission===0){intermission=1.8;state.textContent='SECTOR SECURED';}
   else{intermission-=dt;if(intermission<=0){wave++;resetRound();state.textContent='WAVE '+wave+' // ACTIVE';}}
  }
  updateHud();
 }
 function drawTank(t){
  const d=dirs[t.dir],cx=t.x+t.w/2,cy=t.y+t.h/2;
  g.save();g.translate(cx,cy);g.rotate(d.a);
  const playerTank=t.kind==='player',color=playerTank?'#b5c94a':t.kind==='heavy'?'#8b657d':t.kind==='fast'?'#d08b53':'#a84c57';
  if(t.inv>0&&Math.floor(t.inv*10)%2)g.globalAlpha=.35;
  g.fillStyle='#252a20';g.fillRect(-13,-13,8,26);g.fillRect(5,-13,8,26);
  g.fillStyle=color;g.fillRect(-10,-12,20,24);
  g.fillStyle=playerTank?'#e3f0b5':'#f0b2ae';g.fillRect(-4,-7,8,14);
  g.fillStyle=color;g.fillRect(-3,-18,6,21);
  g.fillStyle='#dce7c3';g.fillRect(-2,-23,4,10);
  if(t.kind==='heavy'){g.strokeStyle='#f0d6a2';g.lineWidth=2;g.strokeRect(-11,-13,22,26);}
  g.restore();
 }
 function draw(){
  g.fillStyle='#090e0b';g.fillRect(0,0,W,H);
  for(let y=0;y<13;y++)for(let x=0;x<13;x++){
   const ch=map[y][x],px=x*TILE,py=y*TILE;
   if(ch==='b'){g.fillStyle='#77443b';g.fillRect(px+1,py+1,38,38);g.strokeStyle='#c18a68';g.lineWidth=2;g.beginPath();g.moveTo(px+1,py+13);g.lineTo(px+39,py+13);g.moveTo(px+1,py+27);g.lineTo(px+39,py+27);g.moveTo(px+13,py+1);g.lineTo(px+13,py+13);g.moveTo(px+27,py+13);g.lineTo(px+27,py+27);g.moveTo(px+13,py+27);g.lineTo(px+13,py+39);g.stroke();}
   else if(ch==='#'){g.fillStyle='#68736e';g.fillRect(px+1,py+1,38,38);g.fillStyle='#9ba69c';g.fillRect(px+5,py+5,30,30);g.strokeStyle='#414c45';g.strokeRect(px+8,py+8,24,24);}
   else if(ch==='~'){g.fillStyle='#183b52';g.fillRect(px,py,40,40);g.strokeStyle='#4e9eb5';g.beginPath();g.moveTo(px+4,py+14);g.quadraticCurveTo(px+12,py+5,px+20,py+14);g.quadraticCurveTo(px+28,py+23,px+36,py+14);g.stroke();}
   else if(ch==='E'){g.fillStyle='#1d251b';g.fillRect(px,py,40,40);g.fillStyle=baseAlive?'#d3c56d':'#a34d5b';g.beginPath();g.moveTo(px+20,py+5);g.lineTo(px+34,py+33);g.lineTo(px+20,py+27);g.lineTo(px+6,py+33);g.closePath();g.fill();g.fillStyle='#24291e';g.fillRect(px+17,py+16,6,7);}
  }
  enemies.forEach(drawTank);if(player)drawTank(player);
  bullets.forEach(b=>{g.fillStyle=b.hostile?'#e77b85':'#e4f1a6';g.beginPath();g.arc(b.x,b.y,b.hostile?4:5,0,Math.PI*2);g.fill();});
  if(!active){g.fillStyle='rgba(0,0,0,.76)';g.fillRect(72,208,376,104);g.textAlign='center';g.fillStyle='#e4edcf';g.font='bold 20px monospace';g.fillText(ended?'DEFENSE FAILED':'STASIS BREACH // TANK COMMAND',260,248);g.fillStyle='#a9b995';g.font='12px monospace';g.fillText(ended?'THE CORE HAS FALLEN':'DEPLOY TO DEFEND THE CORE',260,276);g.textAlign='left';}
 }
 function frame(ts){if(!active)return;if(!last)last=ts;const dt=Math.min(.045,(ts-last)/1000);last=ts;update(dt);draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);score=0;lives=3;wave=1;ended=false;active=true;resetRound();state.textContent='WAVE 01 // ACTIVE';start.textContent='RESTART DEFENSE';last=0;draw();c.focus();raf=requestAnimationFrame(frame);}
 start.addEventListener('click',begin);
 c.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase(),mapKey={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};
  if(mapKey[k]){e.preventDefault();keys[mapKey[k]]=true;}
  if(e.code==='Space'||k==='j'){e.preventDefault();keys.fire=true;}
 });
 c.addEventListener('keyup',e=>{
  const k=e.key.toLowerCase(),mapKey={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};
  if(mapKey[k])keys[mapKey[k]]=false;if(e.code==='Space'||k==='j')keys.fire=false;
 });
 cabinet.querySelectorAll('[data-tank]').forEach(b=>{
  const action=b.dataset.tank;
  const down=e=>{e.preventDefault();if(action==='fire')touchFire=true;else touchDir=action;c.focus();};
  const up=()=>{if(action==='fire')touchFire=false;else if(touchDir===action)touchDir=null;};
  b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(ev=>b.addEventListener(ev,up));
 });
 resetRound();draw();
 stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;keys={};touchDir=null;touchFire=false;};
}

function pacman(){
 const TILE=24,W=19,H=21;
 const layout=[
  '###################',
  '#........#........#',
  '#.###.##.#.##.###.#',
  '#o###.##.#.##.###o#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.###.#.###.####',
  '####.#.......#.####',
  '####.#.## ##.#.####',
  '.....#.#   #.#.....',
  '####.#.#   #.#.####',
  '####.#.#####.#.####',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#o.#...........#.o#',
  '##.#.#.#####.#.#.##',
  '#....#...#...#....#',
  '#.######.#.######.#',
  '#.................#',
  '###################'
 ];
 const dirs={up:{x:0,y:-1,a:-Math.PI/2},right:{x:1,y:0,a:0},down:{x:0,y:1,a:Math.PI/2},left:{x:-1,y:0,a:Math.PI}};
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-pac-stage"><div class="kd2-label"><span>STASIS MAZE // SECTOR 03</span><b id="pm-state">READY</b></div><canvas id="pm-board" width="456" height="504" tabindex="0" aria-label="Pac-Man maze game"></canvas><div class="kd2-label"><span>COLLECT ALL SIGNAL NODES</span><b>POWER PELLETS TURN THE HUNT</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>SCORE</small><strong id="pm-score">0</strong></div><div class="kd2-stat"><small>BEST</small><strong id="pm-best">0</strong></div><div class="kd2-stat"><small>LIVES</small><strong id="pm-lives">3</strong></div><div class="kd2-stat"><small>LEVEL</small><strong id="pm-level">01</strong></div><button class="kd2-primary" id="pm-start">START MAZE</button><div class="kd2-pac-pad"><button data-pac="up">▲</button><button data-pac="left">◀</button><button data-pac="down">▼</button><button data-pac="right">▶</button></div><p class="kd2-help">ARROWS / WASD MOVE. EAT ALL DOTS. LARGE POWER PELLETS LET YOU EAT THE GHOSTS FOR A SHORT TIME.</p></aside></div>';
 const c=$('#pm-board'),g=c.getContext('2d'),state=$('#pm-state'),scoreNode=$('#pm-score'),bestNode=$('#pm-best'),livesNode=$('#pm-lives'),levelNode=$('#pm-level'),start=$('#pm-start');
 let map=[],pellets=0,player=null,ghosts=[],score=0,lives=3,level=1,active=false,ended=false,raf=0,last=0,clock=0,frightUntil=0,keys={},queuedDir='left',mouth=0,invuln=0,ghostCombo=0;
 const copyMap=()=>layout.map(r=>r.split(''));
 const open=(x,y)=>{const tx=Math.round(x),ty=Math.round(y);if(ty===10&&(x<0||x>=W))return true;return ty>=0&&ty<H&&tx>=0&&tx<W&&map[ty][tx]!=='#';};
 function centerActor(a){
  const tx=Math.round(a.x),ty=Math.round(a.y),dx=tx-a.x,dy=ty-a.y,d=a.dir&&dirs[a.dir];
  if(Math.abs(dx)>.13||Math.abs(dy)>.13)return false;
  if(d&&d.x&&dx&&Math.sign(dx)!==d.x)return false;
  if(d&&d.y&&dy&&Math.sign(dy)!==d.y)return false;
  a.x=tx;a.y=ty;return true;
 }
 function resetActors(){
  player={x:9,y:15,dir:'left',speed:5.25};
  ghosts=[
   {x:9,y:9,dir:'up',color:'#e66b79',speed:4.15,homeX:9,homeY:9},
   {x:8,y:10,dir:'left',color:'#6dbde2',speed:4.0,homeX:8,homeY:10},
   {x:9,y:10,dir:'right',color:'#d5a0dc',speed:4.05,homeX:9,homeY:10},
   {x:10,y:10,dir:'right',color:'#e6a36c',speed:4.1,homeX:10,homeY:10}
  ];
  frightUntil=0;ghostCombo=0;invuln=1.4;
 }
 function resetMap(){map=copyMap();pellets=0;for(const row of map)for(const ch of row)if(ch==='.'||ch==='o')pellets++;resetActors();}
 function updateHud(){
  scoreNode.textContent=fmt(score);const record=Math.max(best('pacman'),score);bestNode.textContent=fmt(record);safeSet('kd404-v2-pacman',record);
  livesNode.textContent=String(lives);levelNode.textContent=String(level).padStart(2,'0');
 }
 function validDir(x,y,name){const d=dirs[name];return open(x+d.x*.58,y+d.y*.58);}
 function moveActor(a,speed,dt,isPlayer=false){
  if(centerActor(a)){
   if(isPlayer&&queuedDir&&validDir(a.x,a.y,queuedDir))a.dir=queuedDir;
   if(!a.dir||!validDir(a.x,a.y,a.dir))a.dir=null;
   if(!isPlayer&&!a.dir)a.dir=chooseGhostDir(a);
   if(!isPlayer&&a.dir&&Math.random()<.025)a.dir=chooseGhostDir(a);
  }
  if(!a.dir)return;
  const d=dirs[a.dir];a.x+=d.x*speed*dt;a.y+=d.y*speed*dt;
  if(a.y>=10&&a.y<=10.15&&a.x<-.45)a.x=18.4;
  if(a.y>=10&&a.y<=10.15&&a.x>18.45)a.x=-.4;
 }
 function chooseGhostDir(ghost){
  const options=Object.keys(dirs).filter(n=>validDir(ghost.x,ghost.y,n));
  if(options.length>1){const reverse={up:'down',down:'up',left:'right',right:'left'}[ghost.dir];const filtered=options.filter(n=>n!==reverse);if(filtered.length)options.splice(0,options.length,...filtered);}
  if(!options.length)return ghost.dir;
  if(clock<frightUntil||Math.random()<.14)return options[(Math.random()*options.length)|0];
  options.sort((a,b)=>{
   const da=dirs[a],db=dirs[b];
   const targetX=player.x+(ghost.color==='#6dbde2'?2:0),targetY=player.y;
   return (Math.abs(ghost.x+da.x-targetX)+Math.abs(ghost.y+da.y-targetY))-(Math.abs(ghost.x+db.x-targetX)+Math.abs(ghost.y+db.y-targetY))+(Math.random()-.5)*.7;
  });
  return options[0];
 }
 function eatPellet(){
  if(!centerActor(player))return;
  const x=Math.round(player.x),y=Math.round(player.y),ch=map[y]&&map[y][x];
  if(ch==='.'||ch==='o'){map[y][x]=' ';pellets--;score+=ch==='o'?50:10;if(ch==='o'){frightUntil=clock+8;ghostCombo=0;}updateHud();}
  if(pellets<=0){level++;resetMap();state.textContent='LEVEL '+String(level).padStart(2,'0');}
 }
 function loseLife(){
  if(invuln>0||!active)return;
  lives--;updateHud();
  if(lives<=0){active=false;ended=true;state.textContent='GAME OVER';start.textContent='PLAY AGAIN';return;}
  resetActors();state.textContent='SIGNAL RECOVERED';
 }
 function update(dt){
  clock+=dt;mouth+=dt*13;if(invuln>0)invuln=Math.max(0,invuln-dt);
  const wanted=keys.up?'up':keys.down?'down':keys.left?'left':keys.right?'right':null;if(wanted)queuedDir=wanted;
  moveActor(player,player.speed+(level-1)*.12,dt,true);eatPellet();
  ghosts.forEach(ghost=>{
   const speed=clock<frightUntil?ghost.speed*.68:ghost.speed;
   moveActor(ghost,speed,dt,false);
   const dx=ghost.x-player.x,dy=ghost.y-player.y;
   if(Math.hypot(dx,dy)<.55&&invuln<=0){
    if(clock<frightUntil){score+=200*Math.pow(2,ghostCombo);ghostCombo=Math.min(ghostCombo+1,3);ghost.x=ghost.homeX;ghost.y=ghost.homeY;ghost.dir='up';}
    else loseLife();
   }
  });
 }
 function drawGhost(ghost){
  const x=ghost.x*TILE+TILE/2,y=ghost.y*TILE+TILE/2,fright=clock<frightUntil,color=fright?'#416fe0':ghost.color;
  g.fillStyle=color;g.beginPath();g.arc(x,y-2,10,Math.PI,0);g.lineTo(x+10,y+9);g.lineTo(x+5,y+6);g.lineTo(x,y+10);g.lineTo(x-5,y+6);g.lineTo(x-10,y+9);g.closePath();g.fill();
  const eyeColor=fright?'#dce8ff':'#fff';g.fillStyle=eyeColor;g.beginPath();g.ellipse(x-4,y-2,3.4,4.4,0,0,Math.PI*2);g.ellipse(x+4,y-2,3.4,4.4,0,0,Math.PI*2);g.fill();
  g.fillStyle='#1c345d';g.beginPath();g.arc(x-3.5,y-1,1.5,0,Math.PI*2);g.arc(x+4.5,y-1,1.5,0,Math.PI*2);g.fill();
 }
 function draw(){
  g.fillStyle='#05090e';g.fillRect(0,0,c.width,c.height);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
   const ch=map[y][x],px=x*TILE,py=y*TILE;
   if(ch==='#'){g.fillStyle='#142b73';g.fillRect(px,py,TILE,TILE);g.strokeStyle='#4779d2';g.lineWidth=1.2;g.strokeRect(px+2,py+2,TILE-4,TILE-4);}
   else if(ch==='.'||ch==='o'){g.fillStyle=ch==='o'?'#f4df98':'#d4dfbe';g.beginPath();g.arc(px+12,py+12,ch==='o'?5.2:2.2,0,Math.PI*2);g.fill();}
  }
  ghosts.forEach(drawGhost);
  if(player&&(!invuln||Math.floor(clock*9)%2===0)){
   const x=player.x*TILE+12,y=player.y*TILE+12,angle=player.dir?dirs[player.dir].a:0,opening=.18+Math.abs(Math.sin(mouth))*.38;
   g.fillStyle='#f2d34c';g.beginPath();g.moveTo(x,y);g.arc(x,y,11,angle+opening,angle+Math.PI*2-opening);g.closePath();g.fill();
  }
  if(!active){g.fillStyle='rgba(0,0,0,.76)';g.fillRect(55,218,346,72);g.textAlign='center';g.fillStyle='#f1e7b3';g.font='bold 19px monospace';g.fillText(ended?'GAME OVER':'STASIS MAZE // PAC-MAN',228,249);g.fillStyle='#b1c5d9';g.font='11px monospace';g.fillText(ended?'THE GHOSTS CAUGHT YOU':'START TO ENTER THE MAZE',228,271);g.textAlign='left';}
 }
 function frame(ts){if(!active)return;if(!last)last=ts;const dt=Math.min(.05,(ts-last)/1000);last=ts;update(dt);draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);score=0;lives=3;level=1;clock=0;ended=false;active=true;queuedDir='left';resetMap();state.textContent='MAZE ACTIVE';start.textContent='RESTART MAZE';updateHud();last=0;draw();c.focus();raf=requestAnimationFrame(frame);}
 start.addEventListener('click',begin);
 c.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase(),m={arrowup:'up',w:'up',arrowdown:'down',s:'down',arrowleft:'left',a:'left',arrowright:'right',d:'right'};
  if(m[k]){e.preventDefault();queuedDir=m[k];}
 });
 cabinet.querySelectorAll('[data-pac]').forEach(b=>b.addEventListener('click',()=>{queuedDir=b.dataset.pac;c.focus();}));
 resetMap();updateHud();draw();
 stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;keys={};};
}
choose('tanks');
})();