/* KD-404 // STASIS CITY ARCADE v2 */
(() => {
'use strict';
if (document.getElementById('kd-stasis-arcade-v2')) return;
const old = document.getElementById('kd-stasis-arcade');
const shell = document.querySelector('.site-shell');
const footer = shell && shell.querySelector('.site-footer');
if (!shell || !footer) {
    console.error('KD-404 ARCADE: site shell or footer not found.');
    return;
}
const root = document.createElement('section');
root.id = 'kd-stasis-arcade-v2';
root.className = 'kd-arcade-v2';
root.innerHTML =
'<header class="kd2-head"><div><small>SECTOR 07 // RECREATION & CONTAINMENT</small><h2>STASIS CITY <i>//</i> ARCADE</h2><p>UNAUTHORIZED SIMULATIONS RECOVERED FROM THE STASIS CITY NETWORK.</p></div><span class="kd2-online">● LOCAL SYSTEM ONLINE</span></header>'+
'<div class="kd2-layout"><nav class="kd2-nav" aria-label="Arcade selection"><small>SELECT PROGRAM</small>'+
'<button type="button" class="is-active" data-game="bloodlock" aria-pressed="true"><b>01</b><span><strong>BLOODLOCK</strong><small>PUZZLE / CONTAINMENT</small></span>›</button>'+
'<button type="button" data-game="pinball" aria-pressed="false"><b>02</b><span><strong>VISCERAL PINBALL</strong><small>ARCADE / PHYSICS</small>›</button>'+
'<button type="button" data-game="run" aria-pressed="false"><b>03</b><span><strong>STASIS RUN</strong><small>RUNNER / SURVIVAL</small>›</button>'+
'<button type="button" data-game="breaker" aria-pressed="false"><b>04</b><span><strong>DEMON BREAKER</strong><small>ACTION / ENDLESS WAVES</small>›</span></button>'+'<button type="button" data-game="duel" aria-pressed="false"><b>07</b><span><strong>STASIS DUEL</strong><small>FIGHTING / CPU</small>›</span></button>'+'<button type="button" data-game="breach" aria-pressed="false"><b>08</b><span><strong>STASIS BREACH</strong><small>TACTICAL SHOOTER / BOTS</small>›</span></button>'+
'<button type="button" data-game="racer" aria-pressed="false"><b>05</b><span><strong>NEON TRAFFIC</strong><small>DRIVING / DODGE</small></span>›</button>'+
'<button type="button" data-game="night" aria-pressed="false"><b>06</b><span><strong>STASIS NIGHT SHIFT</strong><small>HORROR / SURVIVAL</small></span>›</button>'+
'<button type="button" data-game="knives" aria-pressed="false"><b>10</b><span><strong>KNIVES ADVANCE</strong><small>PLATFORMER / MOMENTUM</small></span>›</button>'+'<button type="button" data-game="archive" aria-pressed="false"><b>09</b><span><strong>CLASSIFIED ARCHIVE</strong><small>INTEL / UNKNOWN SIGNAL</small></span>›</button>'+
'<div class="kd2-nav-foot">OPERATOR // KD-404<br>INPUT // KEYBOARD & TOUCH</div></nav>'+
'<main class="kd2-main"><header class="kd2-game-head"><div><small id="kd2-type">PUZZLE / CONTAINMENT</small><h3 id="kd2-title">BLOODLOCK</h3><p id="kd2-desc">Arrange the unstable fragments. Clear rows to stabilize the core.</p></div><span>BUILD 02.05<br>STASIS CITY LAB</span></header>'+
'<div id="kd2-cabinet" class="kd2-cabinet"></div>'+
'<footer class="kd2-foot"><span id="kd2-tip">ARROWS MOVE · UP ROTATE · SPACE HARD DROP</span><span>RECORDS // THIS DEVICE</span></footer></main></div>';
if (old) old.replaceWith(root);
else shell.insertBefore(root, footer);

const $ = s => root.querySelector(s);
const cabinet = $('#kd2-cabinet');
const best = key => Math.max(0, Number(safeGet('kd404-v2-'+key,'0'))||0);
function safeGet(k,f){try{return localStorage.getItem(k)??f;}catch(e){return f;}}
function safeSet(k,v){try{localStorage.setItem(k,String(v));}catch(e){}}
const fmt = n => Math.max(0,Math.floor(n)).toLocaleString('en-US');
let stop = () => {};
const info = {
 bloodlock:['PUZZLE / CONTAINMENT','BLOODLOCK','Arrange the unstable fragments. Clear rows to stabilize the core.','ARROWS MOVE · UP ROTATE · SPACE HARD DROP'],
 pinball:['ARCADE / PHYSICS','VISCERAL PINBALL','Keep the core in play. Hit the living bumpers and work the flippers.','SPACE LAUNCH · A / D OR HOLD THE FLIPPER BUTTONS'],
 run:['RUNNER / SURVIVAL','STASIS RUN','Escape the quarantine district. Jump, dodge and collect stabilizers.','SPACE / ↑ / TAP TO JUMP · AVOID DEBRIS'],
 breaker:['ACTION / ENDLESS WAVES','DEMON BREAKER','Survive randomized enemy waves. Enemies adapt, fire aimed shots and jump to reach platforms. Bosses return every fourth wave.','A / D MOVE · SPACE JUMP · HOLD X / J FIRE · W / ↑ AIM'],
 duel:['FIGHTING / CPU DUEL','STASIS DUEL','Face a combat simulator in a best-of-three fight. Build meter, guard, chain attacks and unleash a visceral burst.','A / D MOVE · W JUMP · S GUARD · J LIGHT · K HEAVY · L SPECIAL'],
 breach:['TACTICAL SHOOTER / BOTS','STASIS BREACH','Clear hostile units room by room. Use cover, aim with the mouse, manage ammunition and survive escalating rounds.','WASD MOVE · MOUSE AIM · CLICK FIRE · R RELOAD · TOUCH CONTROLS ON MOBILE'],
 racer:['DRIVING / TRAFFIC SURVIVAL','NEON TRAFFIC','Read the curves, dodge traffic and keep your run clean through the neon expressway.','A / D OR ← → STEER · HOLD DRIFT TO SLIDE'],
 night:['HORROR / NIGHT SURVIVAL','STASIS NIGHT SHIFT','Monitor the abandoned Stasis facility. Track the entities, manage power and survive until 6 AM.','CAMERAS · DOORS · LIGHTS · POWER MANAGEMENT'],
 archive:['INTEL / UNKNOWN SIGNAL','CLASSIFIED ARCHIVE','Recover a restricted file and listen to transmissions from Stasis City.','RESTRICTED ACCESS // CODE 404'],
  knives:['PLATFORMER / MOMENTUM','KNIVES ADVANCE','Build speed, ride the terrain, roll through threats and recover the signal shards across the Stasis Outskirts.','A / D OR ← → MOVE · SPACE JUMP · HOLD ↓ ROLL · X BURST']
};
function choose(id){
 stop(); stop=()=>{};
 root.querySelectorAll('[data-game]').forEach(b=>{const yes=b.dataset.game===id;b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes));});
 $('#kd2-type').textContent=info[id][0];$('#kd2-title').textContent=info[id][1];$('#kd2-desc').textContent=info[id][2];$('#kd2-tip').textContent=info[id][3];
 if(id==='bloodlock') bloodlock();
 if(id==='pinball') pinball();
 if(id==='run') runner();
 if(id==='breaker') breaker();
 if(id==='duel') duel();
 if(id==='breach') breach();
 if(id==='racer') racer();
 if(id==='night') nightshift();
 if(id==='archive') archive();
  if(id==='knives') knivesAdvance();
}
root.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.game)));

function bloodlock(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-tetris-stage"><div class="kd2-label"><span>CONTAINMENT GRID // 10 × 20</span><b id="bl-state">STANDBY</b></div><canvas id="bl-board" width="300" height="600" tabindex="0" aria-label="Bloodlock puzzle board"></canvas><div class="kd2-label"><span>CORE STABILITY</span><b id="bl-level">LEVEL 01</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>SCORE</small><strong id="bl-score">0</strong></div><div class="kd2-stat"><small>RECORD</small><strong id="bl-best">'+fmt(best('bloodlock'))+'</strong></div><div class="kd2-next"><small>NEXT FRAGMENT</small><canvas id="bl-next" width="120" height="90"></canvas></div><button class="kd2-primary" id="bl-start">INITIALIZE CORE</button><div class="kd2-controls"><button data-bl="left">◀</button><button data-bl="rotate">ROTATE</button><button data-bl="right">▶</button><button data-bl="down">▼</button><button data-bl="drop">HARD DROP</button></div><p class="kd2-help">← → MOVE · ↑ ROTATE · ↓ SOFT DROP · SPACE HARD DROP</p></aside></div>';
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
  if(!active){x.fillStyle='rgba(3,7,5,.82)';x.fillRect(15,255,270,90);x.textAlign='center';x.fillStyle='#e0e9c7';x.font='bold 15px monospace';x.fillText(ended?'CORE BREACH':'CORE IN STANDBY',150,290);x.fillStyle='#9aa68f';x.font='11px monospace';x.fillText('INITIALIZE TO BEGIN',150,315);x.textAlign='left';}
 }
 function cell(ctx,a,b,color,size){ctx.fillStyle=color;ctx.fillRect(a*size+1,b*size+1,size-2,size-2);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(a*size+4,b*size+4,size-8,3);}
 function nextDraw(){nx.fillStyle='#070b08';nx.fillRect(0,0,120,90);let size=20,ox=(120-next.m[0].length*size)/2,oy=(90-next.m.length*size)/2;next.m.forEach((r,y)=>r.forEach((v,z)=>{if(v)cell(nx,0,0,'#000',1),nx.fillStyle=next.color,nx.fillRect(ox+z*size+1,oy+y*size+1,size-2,size-2);}));}
 function update(){score.textContent=fmt(points);let b=Math.max(best('bloodlock'),points);safeSet('kd404-v2-bloodlock',b);record.textContent=fmt(b);level.textContent='LEVEL '+String(1+(lines/8|0)).padStart(2,'0');interval=Math.max(.1,.7-(lines/8|0)*.05);}
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

function pinball(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-pin-stage"><div class="kd2-label"><span>VISCERAL TABLE // FIELD A</span><b id="pb-state">STANDBY</b></div><canvas id="pb-board" width="420" height="700" tabindex="0" aria-label="Visceral pinball table"></canvas><div class="kd2-label"><span>FIXED STEP PHYSICS</span><b>3 CELLS</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>SCORE</small><strong id="pb-score">0</strong></div><div class="kd2-stat"><small>RECORD</small><strong id="pb-best">'+fmt(best('pinball'))+'</strong></div><div class="kd2-stat"><small>CELLS LEFT</small><strong id="pb-lives">3</strong></div><button class="kd2-primary" id="pb-start">START / LAUNCH</button><div class="kd2-controls"><button data-flip="left">LEFT FLIPPER</button><button data-flip="right">RIGHT FLIPPER</button></div><p class="kd2-help">SPACE TO LAUNCH · HOLD A / D OR THE FLIPPER BUTTONS.</p></aside></div>';
 const c=$('#pb-board'),x=c.getContext('2d'),score=$('#pb-score'),record=$('#pb-best'),life=$('#pb-lives'),state=$('#pb-state'),start=$('#pb-start');
 const bumpers=[{x:120,y:165,r:32},{x:210,y:105,r:34},{x:300,y:165,r:32},{x:210,y:265,r:26}],R=8;
 let points=0,lives=3,active=false,launched=false,ended=false,raf=0,last=0,acc=0,ball,ld=false,rd=false;
 const flips=[{side:'left',x:132,y:590,len:100,rest:-.18,up:-.78,a:-.18},{side:'right',x:288,y:590,len:100,rest:Math.PI+.18,up:Math.PI+.78,a:Math.PI+.18}];
 function resetBall(){ball={x:350,y:615,vx:0,vy:0};launched=false;}
 function save(v){points+=v;score.textContent=fmt(points);let b=Math.max(best('pinball'),points);safeSet('kd404-v2-pinball',b);record.textContent=fmt(b);}
 function segment(f){
  let ex=f.x+Math.cos(f.a)*f.len,ey=f.y+Math.sin(f.a)*f.len,dx=ex-f.x,dy=ey-f.y;
  let t=Math.max(0,Math.min(1,((ball.x-f.x)*dx+(ball.y-f.y)*dy)/(dx*dx+dy*dy||1)));
  let px=f.x+t*dx,py=f.y+t*dy,nx=ball.x-px,ny=ball.y-py,d=Math.hypot(nx,ny),min=R+7;
  if(d>=min)return;nx=d?nx/d:0;ny=d?ny/d:-1;ball.x=px+nx*(min+.5);ball.y=py+ny*(min+.5);
  let dot=ball.vx*nx+ball.vy*ny;if(dot<0){ball.vx-=2*dot*nx;ball.vy-=2*dot*ny;ball.vy-=90;save(5);}
 }
 function step(dt){
  flips.forEach(f=>{f.a+=( (f.side==='left'?ld:rd)?f.up:f.rest-f.a )*0;let target=(f.side==='left'?ld:rd)?f.up:f.rest;f.a+=(target-f.a)*Math.min(1,dt*24);});
  if(!launched)return;
  ball.vy+=1550*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
  if(ball.x<28){ball.x=28;ball.vx=Math.abs(ball.vx)*.8;}if(ball.x>392){ball.x=392;ball.vx=-Math.abs(ball.vx)*.8;}if(ball.y<25){ball.y=25;ball.vy=Math.abs(ball.vy)*.8;}
  bumpers.forEach(b=>{let dx=ball.x-b.x,dy=ball.y-b.y,d=Math.hypot(dx,dy),m=R+b.r;if(d<m&&d>0){let nx=dx/d,ny=dy/d;ball.x=b.x+nx*(m+.5);ball.y=b.y+ny*(m+.5);let dot=ball.vx*nx+ball.vy*ny;if(dot<0){ball.vx-=2*dot*nx;ball.vy-=2*dot*ny;}ball.vx+=nx*140;ball.vy+=ny*140;save(25);}});
  flips.forEach(segment);
  if(ball.y>710){lives--;life.textContent=String(lives);if(lives<=0){active=false;ended=true;state.textContent='TABLE SHUTDOWN';start.textContent='RESTART TABLE';}else{resetBall();state.textContent='BALL RECOVERED';}}
 }
 function draw(){
  x.fillStyle='#070b08';x.fillRect(0,0,420,700);x.fillStyle='#101910';x.beginPath();x.moveTo(25,25);x.lineTo(395,25);x.lineTo(395,640);x.lineTo(330,690);x.lineTo(90,690);x.lineTo(25,640);x.closePath();x.fill();x.strokeStyle='rgba(181,201,74,.5)';x.lineWidth=4;x.stroke();
  bumpers.forEach((b,i)=>{x.fillStyle=i===3?'#713b48':'#4d6038';x.beginPath();x.arc(b.x,b.y,b.r,0,Math.PI*2);x.fill();x.strokeStyle='#b5c94a';x.lineWidth=4;x.stroke();x.fillStyle='rgba(240,245,220,.35)';x.beginPath();x.arc(b.x,b.y,8,0,7);x.fill();});
  flips.forEach(f=>{let ex=f.x+Math.cos(f.a)*f.len,ey=f.y+Math.sin(f.a)*f.len;x.strokeStyle='#b5c94a';x.lineWidth=15;x.lineCap='round';x.beginPath();x.moveTo(f.x,f.y);x.lineTo(ex,ey);x.stroke();});
  x.fillStyle='#d8e6ac';x.beginPath();x.arc(ball.x,ball.y,R,0,7);x.fill();
  if(!launched){x.fillStyle='rgba(3,7,5,.8)';x.fillRect(65,325,290,64);x.textAlign='center';x.fillStyle='#e2eac8';x.font='bold 14px monospace';x.fillText(ended?'TABLE SHUTDOWN':'BALL IN STASIS',210,352);x.fillStyle='#9aa68f';x.font='10px monospace';x.fillText('PRESS START / SPACE TO LAUNCH',210,372);x.textAlign='left';}
 }
 function begin(){cancelAnimationFrame(raf);raf=0;points=0;lives=3;life.textContent='3';score.textContent='0';active=true;ended=false;ld=rd=false;fl.forEach(f=>f.a=f.rest);resetBall();state.textContent='BALL READY';start.textContent='LAUNCH BALL';last=0;acc=0;draw();c.focus();}
 function launch(){if(!active||ended)begin();if(!launched){launched=true;ball.vx=-110;ball.vy=-690;state.textContent='BALL IN PLAY';start.textContent='BALL ACTIVE';}}
 function frame(t){if(!active)return;if(!last)last=t;acc+=Math.min(.05,(t-last)/1000);last=t;let count=0;while(acc>=1/120&&count<8&&active){step(1/120);acc-=1/120;count++;}draw();if(active)raf=requestAnimationFrame(frame);}
 start.addEventListener('click',()=>{if(!active||ended)begin();if(!launched){launched=true;ball.vx=-110;ball.vy=-690;state.textContent='BALL IN PLAY';start.textContent='BALL ACTIVE';}if(!raf){last=0;raf=requestAnimationFrame(frame);}});
 c.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();launch();if(!raf)raf=requestAnimationFrame(frame);}if(e.key.toLowerCase()==='a')ld=true;if(e.key.toLowerCase()==='d')rd=true;});
 c.addEventListener('keyup',e=>{if(e.key.toLowerCase()==='a')ld=false;if(e.key.toLowerCase()==='d')rd=false;});
 cabinet.querySelectorAll('[data-flip]').forEach(b=>{let side=b.dataset.flip;const set=v=>{if(side==='left')ld=v;else rd=v;};b.addEventListener('pointerdown',e=>{e.preventDefault();set(true);});['pointerup','pointercancel','pointerleave'].forEach(t=>b.addEventListener(t,()=>set(false)));});
 resetBall();draw();stop=()=>{active=false;cancelAnimationFrame(raf);ld=rd=false;};
}

function runner(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-wide-stage"><div class="kd2-label"><span>QUARANTINE DISTRICT // ROUTE 04</span><b id="run-state">STANDBY</b></div><canvas id="run-board" width="800" height="360" tabindex="0" aria-label="Stasis Run game"></canvas><div class="kd2-label"><span>THREAT // VISCERAL TRACE</span><b>ESCAPE ROUTE OPEN</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>DISTANCE</small><strong id="run-score">0 m</strong></div><div class="kd2-stat"><small>RECORD</small><strong id="run-best">'+fmt(best('run'))+' m</strong></div><div class="kd2-stat"><small>STABILIZERS</small><strong id="run-shards">0</strong></div><button class="kd2-primary" id="run-start">START ESCAPE</button><button class="kd2-secondary" id="run-jump">JUMP / EVADE</button><p class="kd2-help">SPACE / ↑ / TAP TO JUMP. AVOID DEBRIS AND COLLECT GREEN STABILIZERS.</p></aside></div>';
 const c=$('#run-board'),x=c.getContext('2d'),score=$('#run-score'),record=$('#run-best'),shardsNode=$('#run-shards'),state=$('#run-state'),start=$('#run-start'),jumpBtn=$('#run-jump');
 let active=false,ended=false,points=0,shards=0,recorded=best('run'),raf=0,last=0,acc=0,spawn=1,speed=320,p,obs=[],gems=[];
 function reset(){p={x:115,y:240,w:40,h:42,vy:0,ground:true};obs=[];gems=[];points=0;shards=0;spawn=1;speed=320;score.textContent='0 m';shardsNode.textContent='0';}
 function jump(){if(active&&p.ground){p.vy=-690;p.ground=false;}}
 function update(dt){
  speed=Math.min(530,320+points*.12);p.vy+=1900*dt;p.y+=p.vy*dt;if(p.y+p.h>=282){p.y=240;p.vy=0;p.ground=true;}
  spawn-=dt;if(spawn<=0){let tall=Math.random()<.3;obs.push({x:825,y:282-(tall?65:36),w:tall?28:36,h:tall?65:36});if(Math.random()<.7)gems.push({x:940,y:150+Math.random()*55});spawn=1.05+Math.random()*.72;}
  obs.forEach(o=>o.x-=speed*dt);gems.forEach(g=>g.x-=speed*dt);obs=obs.filter(o=>o.x+o.w>0);gems=gems.filter(g=>g.x>-15);
  for(let o of obs)if(p.x+p.w-7>o.x+4&&p.x+7<o.x+o.w-4&&p.y+p.h-5>o.y+4&&p.y+5<o.y+o.h){active=false;ended=true;state.textContent='SUBJECT DETECTED';start.textContent='RUN AGAIN';return;}
  gems=gems.filter(g=>{if(Math.hypot(p.x+20-g.x,p.y+21-g.y)<27){shards++;shardsNode.textContent=String(shards);points+=100;return false;}return true;});
  points+=speed*dt*.04;score.textContent=Math.floor(points)+' m';if(points>recorded){recorded=Math.floor(points);record.textContent=fmt(recorded)+' m';safeSet('kd404-v2-run',recorded);}
 }
 function draw(){
  x.fillStyle='#080d0a';x.fillRect(0,0,800,360);
  for(let i=0;i<13;i++){let xx=i*100-(points*2%100),h=62+(i*43%105);x.fillStyle='#121c15';x.fillRect(xx,282-h,70,h);x.fillStyle='rgba(181,201,74,.25)';for(let y=282-h+14;y<275;y+=19)x.fillRect(xx+13,y,5,7);}
  x.fillStyle='#1b271b';x.fillRect(0,282,800,78);x.strokeStyle='rgba(181,201,74,.3)';x.beginPath();x.moveTo(0,282);x.lineTo(800,282);x.stroke();
  obs.forEach(o=>{x.fillStyle='#813f4a';x.fillRect(o.x,o.y,o.w,o.h);x.fillStyle='#c87d83';x.fillRect(o.x+4,o.y+5,o.w-8,5);});
  gems.forEach(g=>{x.save();x.translate(g.x,g.y);x.rotate(Math.PI/4);x.fillStyle='#b5c94a';x.fillRect(-8,-8,16,16);x.restore();});
  x.fillStyle='#bec99e';x.beginPath();x.ellipse(p.x+20,p.y+23,16,18,0,0,7);x.fill();x.fillStyle='#879d5a';for(let i=0;i<6;i++){x.beginPath();x.moveTo(p.x+6+i*5,p.y+13);x.lineTo(p.x+5+i*5,p.y-5-(i%2)*4);x.lineTo(p.x+13+i*5,p.y+13);x.fill();}
  x.fillStyle='#111810';x.fillRect(p.x+28,p.y+18,4,4);
  if(!active){x.fillStyle='rgba(3,7,5,.8)';x.fillRect(180,135,440,82);x.textAlign='center';x.fillStyle='#e2eac8';x.font='bold 17px monospace';x.fillText(ended?'SIGNAL LOST // SUBJECT CAPTURED':'STASIS CITY // QUARANTINE ZONE',400,169);x.fillStyle='#98a48d';x.font='11px monospace';x.fillText(ended?'REINITIALIZE TO TRY AGAIN':'INITIALIZE TO ESCAPE',400,192);x.textAlign='left';}
 }
 function frame(t){if(!active)return;if(!last)last=t;acc+=Math.min(.05,(t-last)/1000);last=t;let n=0;while(acc>=1/60&&n<5&&active){update(1/60);acc-=1/60;n++;}draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);reset();active=true;ended=false;last=0;acc=0;state.textContent='ESCAPE IN PROGRESS';start.textContent='RESTART RUN';c.focus();draw();raf=requestAnimationFrame(frame);}
 start.addEventListener('click',begin);jumpBtn.addEventListener('click',jump);c.addEventListener('pointerdown',jump);c.addEventListener('keydown',e=>{if(e.code==='Space'||e.key==='ArrowUp'){e.preventDefault();jump();}});
 reset();draw();stop=()=>{active=false;cancelAnimationFrame(raf);};
}

function breaker(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-wide-stage"><div class="kd2-label"><span>DEMON BREAKER // COMBAT SIMULATION</span><b id="db-state">STANDBY</b></div><canvas id="db-board" width="800" height="400" tabindex="0" aria-label="Demon Breaker action combat game"></canvas><div class="kd2-label"><span>WEAPON // VISCERAL PULSE</span><b id="db-boss">BOSS: NOT DETECTED</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>ELIMINATIONS</small><strong id="db-score">0</strong></div><div class="kd2-stat"><small>RECORD</small><strong id="db-best">'+fmt(best('breaker'))+'</strong></div><div class="kd2-stat"><small>VITALITY</small><strong id="db-hp">♥ ♥ ♥ ♥ ♥</strong></div><button class="kd2-primary" id="db-start">DEPLOY KNIVES</button><div class="kd2-controls kd2-breaker-pad"><button data-db="left">◀</button><button data-db="right">▶</button><button data-db="jump">JUMP</button><button data-db="fire">FIRE</button></div><p class="kd2-help">A / D MOVE · SPACE JUMP · X / J FIRE. DEFEAT 8 UNITS TO SUMMON THE BOSS.</p></aside></div>';
 const c=$('#db-board'),x=c.getContext('2d'),score=$('#db-score'),record=$('#db-best'),hpNode=$('#db-hp'),state=$('#db-state'),bossText=$('#db-boss'),start=$('#db-start');
 const W=800,floor=338,plats=[{x:190,y:265,w:130,h:13},{x:475,y:218,w:150,h:13},{x:350,y:290,w:92,h:12}];
 let active=false,won=false,over=false,points=0,hp=5,recorded=best('breaker'),raf=0,last=0,acc=0,spawn=1,fireWait=0,boss=null,p,enemies=[],shots=[],hostile=[],keys={};
 function reset(){p={x:85,y:floor-52,w:38,h:52,vy:0,ground:true,face:1,inv:0};enemies=[];shots=[];hostile=[];points=0;hp=5;spawn=1;fireWait=0;boss=null;keys={};score.textContent='0';hpNode.textContent='♥ ♥ ♥ ♥ ♥';bossText.textContent='BOSS: NOT DETECTED';}
 function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
 function jump(){if(active&&p.ground){p.vy=-670;p.ground=false;}}
 function fire(){if(active&&fireWait<=0){shots.push({x:p.x+(p.face>0?p.w:-7),y:p.y+26,vx:p.face*590,life:1.5});fireWait=.23;}}
 function hurt(){if(p.inv>0)return;hp--;p.inv=1;hpNode.textContent=hp?'♥ '.repeat(hp).trim():'0';if(hp<=0){active=false;over=true;state.textContent='SIGNAL LOST';start.textContent='REDEPLOY KNIVES';}}
 function spawnMob(){let side=Math.random()<.5?-30:830;enemies.push({x:side,y:floor-36,w:34,h:36,hp:2,fire:2});}
 function spawnEntity(){boss={x:670,y:floor-116,w:105,h:116,hp:14,max:14,fire:1.4};bossText.textContent='BOSS: VISCERAL SENTINEL';state.textContent='ENTITY DETECTED';}
 function update(dt){
  p.inv=Math.max(0,p.inv-dt);fireWait=Math.max(0,fireWait-dt);
  p.x=Math.max(15,Math.min(747,p.x+((keys.left?-250:0)+(keys.right?250:0))*dt));if(keys.left)p.face=-1;if(keys.right)p.face=1;
  let old=p.y+p.h;p.vy+=1850*dt;p.y+=p.vy*dt;p.ground=false;if(p.y+p.h>=floor){p.y=floor-p.h;p.vy=0;p.ground=true;}
  plats.forEach(q=>{if(p.vy>=0&&old<=q.y+5&&p.y+p.h>=q.y&&p.x+p.w>q.x&&p.x<q.x+q.w){p.y=q.y-p.h;p.vy=0;p.ground=true;}});
  spawn-=dt;if(points>=8&&!boss&&!bossText.dataset.spawned){spawnEntity();bossText.dataset.spawned='yes';}
  if(!boss&&points<8&&spawn<=0){spawnMob();spawn=1.2+Math.random();}
  enemies.forEach(e=>{let dir=Math.sign(p.x-e.x);e.x+=dir*82*dt;e.fire-=dt;if(e.fire<=0&&Math.abs(p.x-e.x)<390){hostile.push({x:e.x+e.w/2,y:e.y+15,vx:dir*220,life:2});e.fire=2.2;}if(overlap(p,e))hurt();});
  if(boss){boss.x+=(p.x<boss.x?-1:1)*12*dt;boss.x=Math.max(500,Math.min(670,boss.x));boss.fire-=dt;if(boss.fire<=0){hostile.push({x:boss.x+boss.w/2,y:boss.y+55,vx:Math.sign(p.x-boss.x)*260,life:2.5,big:true});boss.fire=1.5;}if(overlap(p,boss))hurt();}
  shots.forEach(s=>{s.x+=s.vx*dt;s.life-=dt;});hostile.forEach(s=>{s.x+=s.vx*dt;s.life-=dt;});
  shots.forEach(s=>{enemies.forEach(e=>{if(e.hp>0&&s.life>0&&overlap({x:s.x-5,y:s.y-5,w:10,h:10},e)){e.hp--;s.life=0;if(e.hp<=0){points++;score.textContent=String(points);if(points>recorded){recorded=points;record.textContent=fmt(points);safeSet('kd404-v2-breaker',points);}}}});if(boss&&s.life>0&&overlap({x:s.x-5,y:s.y-5,w:10,h:10},boss)){boss.hp--;s.life=0;if(boss.hp<=0){boss=null;active=false;won=true;state.textContent='SECTOR CLEARED';bossText.textContent='BOSS: NEUTRALIZED';start.textContent='PLAY AGAIN';}}});
  hostile.forEach(s=>{if(s.life>0&&overlap({x:s.x-6,y:s.y-6,w:12,h:12},p)){s.life=0;hurt();}});
  shots=shots.filter(s=>s.life>0&&s.x>-20&&s.x<820);hostile=hostile.filter(s=>s.life>0&&s.x>-30&&s.x<830);enemies=enemies.filter(e=>e.hp>0&&e.x>-60&&e.x<860);
 }
 function draw(){
  x.fillStyle='#080d0a';x.fillRect(0,0,800,400);
  for(let i=0;i<14;i++){let xx=i*65,h=75+(i*39%115);x.fillStyle=i%2?'#121c16':'#182219';x.fillRect(xx,floor-h,48,h);}
  x.fillStyle='#202a1e';x.fillRect(0,floor,800,62);x.strokeStyle='rgba(181,201,74,.35)';x.beginPath();x.moveTo(0,floor);x.lineTo(800,floor);x.stroke();
  plats.forEach(q=>{x.fillStyle='#46533a';x.fillRect(q.x,q.y,q.w,q.h);x.fillStyle='#b5c94a';x.fillRect(q.x,q.y,q.w,3);});
  enemies.forEach(e=>{x.fillStyle='#81404b';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#e5a1a0';x.fillRect(e.x+7,e.y+10,5,4);x.fillRect(e.x+22,e.y+10,5,4);});
  if(boss){x.fillStyle='#632c3a';x.fillRect(boss.x,boss.y,boss.w,boss.h);x.fillStyle='#d28b91';x.fillRect(boss.x+20,boss.y+32,65,9);x.fillStyle='#f3c7be';x.fillRect(boss.x+28,boss.y+34,10,5);x.fillRect(boss.x+66,boss.y+34,10,5);x.fillStyle='#b5c94a';x.fillRect(boss.x,boss.y-14,boss.w*boss.hp/boss.max,5);x.strokeStyle='#b5c94a';x.strokeRect(boss.x,boss.y-14,boss.w,5);}
  shots.forEach(s=>{x.fillStyle='#cbe98b';x.shadowColor='#b5c94a';x.shadowBlur=10;x.beginPath();x.arc(s.x,s.y,5,0,7);x.fill();x.shadowBlur=0;});
  hostile.forEach(s=>{x.fillStyle=s.big?'#d65d6b':'#bc7378';x.beginPath();x.arc(s.x,s.y,s.big?8:5,0,7);x.fill();});
  if(p.inv<=0||Math.floor(p.inv*12)%2===0){x.fillStyle='#b9c69c';x.beginPath();x.ellipse(p.x+19,p.y+29,15,20,0,0,7);x.fill();x.fillStyle='#899e5d';for(let i=0;i<6;i++){x.beginPath();x.moveTo(p.x+6+i*4,p.y+15);x.lineTo(p.x+4+i*4,p.y-5-(i%2)*4);x.lineTo(p.x+12+i*4,p.y+15);x.fill();}x.fillStyle='#c2d88c';x.fillRect(p.x+(p.face>0?33:-8),p.y+31,13,8);}
  if(!active){x.fillStyle='rgba(3,7,5,.8)';x.fillRect(190,150,420,90);x.textAlign='center';x.fillStyle='#e2eac8';x.font='bold 17px monospace';x.fillText(won?'VISCERAL SENTINEL // DEFEATED':over?'KNIVES // DOWN':'COMBAT SIMULATION',400,184);x.fillStyle='#98a48d';x.font='11px monospace';x.fillText(won?'SECTOR 04 SECURED':over?'REDEPLOY TO TRY AGAIN':'INITIALIZE TO DEPLOY',400,208);x.textAlign='left';}
 }
 function frame(t){if(!active)return;if(!last)last=t;acc+=Math.min(.05,(t-last)/1000);last=t;let n=0;while(acc>=1/60&&n<5&&active){update(1/60);acc-=1/60;n++;}draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);reset();delete bossText.dataset.spawned;active=true;won=false;over=false;state.textContent='COMBAT ACTIVE';start.textContent='RESTART MISSION';last=0;acc=0;c.focus();draw();raf=requestAnimationFrame(frame);}
 function keydown(e){if(['ArrowLeft','ArrowRight','ArrowUp',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=true;if(e.code==='Space'||e.key==='ArrowUp')jump();if(['x','j'].includes(e.key.toLowerCase()))fire();}
 function keyup(e){if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=false;}
 start.addEventListener('click',begin);c.addEventListener('keydown',keydown);c.addEventListener('keyup',keyup);
 cabinet.querySelectorAll('[data-db]').forEach(b=>{let a=b.dataset.db;const down=e=>{e.preventDefault();if(a==='left')keys.left=true;if(a==='right')keys.right=true;if(a==='jump')jump();if(a==='fire')fire();};const up=()=>{if(a==='left')keys.left=false;if(a==='right')keys.right=false;};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(t=>b.addEventListener(t,up));});
 reset();draw();stop=()=>{active=false;cancelAnimationFrame(raf);keys={};};
}


function racer(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-wide-stage"><div class="kd2-label"><span>NEON TRAFFIC // HIGHWAY 09</span><b id="nr-state">READY</b></div><canvas id="nr-board" width="720" height="480" tabindex="0"></canvas><div class="kd2-label"><span>DRIFT // CURVE // SURVIVE</span><b>NO COLLISIONS</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>DISTANCE</small><strong id="nr-score">0 m</strong></div><div class="kd2-stat"><small>BEST RUN</small><strong id="nr-best">'+fmt(best('racer'))+' m</strong></div><div class="kd2-stat"><small>CONDITION</small><strong id="nr-hp">100%</strong></div><button class="kd2-primary" id="nr-start">START ENGINE</button><div class="kd2-controls"><button data-nr="left">◀ LEFT</button><button data-nr="right">RIGHT ▶</button><button data-nr="drift">DRIFT</button><button data-nr="gas">GAS</button></div><p class="kd2-help">A / D OR ARROWS STEER · HOLD SHIFT TO DRIFT · SPACE TO ACCELERATE.</p></aside></div>';
 const c=$('#nr-board'),g=c.getContext('2d'),state=$('#nr-state'),score=$('#nr-score'),record=$('#nr-best'),hpNode=$('#nr-hp'),start=$('#nr-start');let active=false,raf=0,last=0,t=0,distance=0,hp=100,speed=0,player=0,curve=0,traffic=[],keys={},spawn=0;
 function reset(){t=0;distance=0;hp=100;speed=0;player=0;curve=0;traffic=[];keys={};spawn=.6;score.textContent='0 m';hpNode.textContent='100%';}
 function hit(){hp=Math.max(0,hp-25);hpNode.textContent=hp+'%';speed*=.35;if(!hp){active=false;state.textContent='CRASH // RUN ENDED';start.textContent='RETRY RUN';}}
 function update(dt){t+=dt;speed=Math.min(420,speed+(keys.gas?210:95)*dt);player=Math.max(-1.1,Math.min(1.1,player+((keys.left?-1:0)+(keys.right?1:0))*dt*(keys.drift?1.65:1.15)));curve=Math.sin(t*.22)*.5+Math.sin(t*.075)*.3;distance+=speed*dt*.13;spawn-=dt;if(spawn<=0){traffic.push({lane:[-.72,-.24,.24,.72][Math.floor(Math.random()*4)],z:0,type:Math.random()<.3?1:0});spawn=Math.max(.38,1.15-distance/3500)+Math.random()*.4;}traffic.forEach(v=>{v.z+=dt*(.22+speed/950);if(v.z>.86&&v.z<1.02&&Math.abs(v.lane-(player+curve*.3))<.3&&!v.hit){v.hit=true;hit();}});traffic=traffic.filter(v=>v.z<1.1&&!v.hit);score.textContent=Math.floor(distance)+' m';let b=Math.max(best('racer'),Math.floor(distance));safeSet('kd404-v2-racer',b);record.textContent=b+' m';}
 function draw(){g.fillStyle='#0a0e0b';g.fillRect(0,0,720,480);g.fillStyle='#17241b';g.fillRect(0,0,720,260);for(let i=0;i<12;i++){g.fillStyle=i%2?'#202d22':'#19251d';g.fillRect((i*73+Math.sin(t*.13+i)*13)%720,105+(i*17)%80,36,160);}let hy=190;g.fillStyle='#242a22';g.fillRect(0,hy,720,290);function road(z){let w=100+z*510,center=360+curve*z*130;return {l:center-w/2,r:center+w/2,w,center};}for(let y=hy;y<480;y+=3){let z=(y-hy)/290,r=road(z);g.fillStyle=Math.floor(z*32)%2?'#30352b':'#272e25';g.fillRect(r.l,y,r.w,4);g.fillStyle='#a5bd65';g.fillRect(r.l-3,y,3,3);g.fillRect(r.r,y,3,3);}for(let lane=1;lane<3;lane++)for(let z=.05;z<1;z+=.17){let r=road(z);g.fillStyle='#aab28d';g.fillRect(r.l+r.w*lane/3-2,hy+z*290,4,Math.max(2,z*12));}traffic.forEach(v=>{let r=road(v.z),x=r.center+(v.lane+curve*.3)*r.w*.43,y=hy+v.z*290,s=12+v.z*43;g.fillStyle=v.type?'#87485d':'#526d83';g.fillRect(x-s*.48,y-s*.8,s*.96,s*1.6);g.fillStyle='#dce8cb';g.fillRect(x-s*.3,y-s*.65,s*.6,s*.2);});let r=road(.96),px=r.center+player*r.w*.34;g.fillStyle='#b5c94a';g.fillRect(px-22,385,44,65);g.fillStyle='#1b241b';g.fillRect(px-15,395,30,18);if(!active){g.fillStyle='rgba(0,0,0,.68)';g.fillRect(130,180,460,105);g.textAlign='center';g.fillStyle='#e4edce';g.font='bold 22px monospace';g.fillText(hp?'NEON TRAFFIC':'CRASH // RUN ENDED',360,222);g.fillStyle='#aab995';g.font='12px monospace';g.fillText('DODGE TRAFFIC // FOLLOW THE CURVE',360,250);g.textAlign='left';}}
 function frame(ts){if(!active)return;if(!last)last=ts;let dt=Math.min(.04,(ts-last)/1000);last=ts;update(dt);draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);raf=0;reset();active=true;state.textContent='ENGINE ONLINE';start.textContent='RESTART RUN';c.focus();draw();last=0;raf=requestAnimationFrame(frame);}
 function down(e){if(['ArrowLeft','ArrowRight',' ','Shift'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=true;if(e.key==='Shift')keys.drift=true;if(e.code==='Space')keys.gas=true;}
 function up(e){if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=false;if(e.key==='Shift')keys.drift=false;if(e.code==='Space')keys.gas=false;}
 c.addEventListener('keydown',down);c.addEventListener('keyup',up);start.addEventListener('click',begin);cabinet.querySelectorAll('[data-nr]').forEach(b=>{let a=b.dataset.nr;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[a]=true;});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>keys[a]=false));});reset();draw();stop=()=>{active=false;cancelAnimationFrame(raf);keys={};};
}
function nightshift(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-wide-stage"><div class="kd2-label"><span>STASIS CITY // SECURITY OFFICE</span><b id="ns-state">12 AM</b></div><canvas id="ns-board" width="720" height="420" tabindex="0"></canvas><div class="kd2-label"><span id="ns-camera">CAM 01 // EAST HALL</span><b id="ns-threat">MOTION: NONE</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>POWER</small><strong id="ns-power">100%</strong></div><div class="kd2-stat"><small>SHIFT</small><strong id="ns-hour">12 AM / 6 AM</strong></div><div class="kd2-stat"><small>DOORS</small><strong id="ns-doors">OPEN / OPEN</strong></div><button class="kd2-primary" id="ns-start">BEGIN NIGHT SHIFT</button><div class="kd2-controls"><button data-ns="cam0">CAM 01</button><button data-ns="cam1">CAM 02</button><button data-ns="cam2">CAM 03</button><button data-ns="cam3">CAM 04</button><button data-ns="left">LEFT DOOR</button><button data-ns="right">RIGHT DOOR</button><button data-ns="light">OFFICE LIGHT</button></div><p class="kd2-help">TRACK ENTITIES ON CAMERA. CLOSE THE MATCHING DOOR WHEN THEY REACH YOUR HALL. POWER IS LIMITED.</p></aside></div>';
 const c=$('#ns-board'),g=c.getContext('2d'),state=$('#ns-state'),powerNode=$('#ns-power'),hourNode=$('#ns-hour'),doorsNode=$('#ns-doors'),camNode=$('#ns-camera'),threatNode=$('#ns-threat'),start=$('#ns-start'),names=['EAST HALL','FREIGHT LIFT','ARCHIVE ROOM','WEST HALL'];let active=false,raf=0,last=0,time=0,power=100,cam=0,left=false,right=false,light=false,entities=[],won=false,over=false;
 function reset(){time=0;power=100;cam=0;left=false;right=false;light=false;entities=[{side:'left',pos:0,wait:5},{side:'right',pos:0,wait:10}];won=false;over=false;ui();}
 function ui(){let h=Math.min(6,Math.floor(time/12));powerNode.textContent=Math.ceil(power)+'%';hourNode.textContent=(h||12)+' AM / 6 AM';state.textContent=(h||12)+' AM';doorsNode.textContent=(left?'CLOSED':'OPEN')+' / '+(right?'CLOSED':'OPEN');camNode.textContent='CAM 0'+(cam+1)+' // '+names[cam];threatNode.textContent=entities.some(v=>v.pos===cam+1)?'MOTION: ENTITY DETECTED':'MOTION: NONE';}
 function fail(){active=false;over=true;state.textContent='SIGNAL LOST';start.textContent='RETRY NIGHT';}
 function update(dt){time+=dt;let drain=.13+(left?.18:0)+(right?.18:0)+(light?.2:0);power=Math.max(0,power-drain*dt*10);if(power<=0){left=false;right=false;}entities.forEach(e=>{e.wait-=dt;if(e.wait<=0){if(e.pos<4)e.pos++;e.wait=Math.max(2,7-time*.025)+Math.random()*4;}let closed=e.side==='left'?left:right;if(e.pos>=4&&!closed)fail();if(e.pos>=4&&closed){e.pos=1;e.wait=9+Math.random()*5;}});if(time>=72){active=false;won=true;state.textContent='06 AM // SURVIVED';start.textContent='PLAY ANOTHER NIGHT';}ui();}
 function draw(){g.fillStyle='#050806';g.fillRect(0,0,720,420);g.fillStyle='#111a13';g.fillRect(35,35,650,350);for(let i=0;i<12;i++){g.fillStyle=i%2?'#18241b':'#1c2b20';g.fillRect(55+i*53,70,18,285);}g.strokeStyle='rgba(181,201,74,.3)';g.strokeRect(35,35,650,350);g.fillStyle='#b5c94a';g.font='13px monospace';g.fillText('STASIS CCTV // CAM 0'+(cam+1),52,60);g.fillStyle='#66765d';g.font='10px monospace';g.fillText('REC ● '+Math.floor(time)+' SEC',560,60);let e=entities.find(v=>v.pos===cam+1);if(e){let ex=e.side==='left'?250:440;g.fillStyle='#4d2835';g.beginPath();g.ellipse(ex,245,42,90,0,0,Math.PI*2);g.fill();g.fillStyle='#d7a1a0';g.fillRect(ex-18,200,9,7);g.fillRect(ex+9,200,9,7);g.fillStyle='#a5b47e';for(let i=0;i<5;i++){g.beginPath();g.moveTo(ex-32+i*14,165);g.lineTo(ex-38+i*14,135-(i%2)*15);g.lineTo(ex-20+i*14,165);g.fill();}}for(let i=0;i<75;i++){let y=(i*37+time*33)%385+20;g.fillStyle='rgba(190,220,175,.045)';g.fillRect(35,y,650,1);}if(power<=0){g.fillStyle='rgba(0,0,0,.72)';g.fillRect(35,35,650,350);g.fillStyle='#a66d78';g.fillText('POWER FAILURE // SIGNAL LOST',220,210);}if(!active){g.fillStyle='rgba(0,0,0,.7)';g.fillRect(120,155,480,110);g.textAlign='center';g.fillStyle='#e2eac8';g.font='bold 21px monospace';g.fillText(won?'SHIFT COMPLETE // 06:00 AM':over?'ENTITY BREACHED SECURITY':'NIGHT SHIFT // STASIS FACILITY',360,198);g.fillStyle='#a1ae91';g.font='12px monospace';g.fillText(won?'YOU SURVIVED THE CONTAINMENT NIGHT':over?'THE ENTITY REACHED YOUR OFFICE':'MONITOR CAMERAS // MANAGE YOUR POWER',360,226);g.textAlign='left';}}
 function frame(ts){if(!active)return;if(!last)last=ts;let dt=Math.min(.05,(ts-last)/1000);last=ts;update(dt);draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);raf=0;reset();active=true;start.textContent='ABORT SHIFT';c.focus();draw();last=0;raf=requestAnimationFrame(frame);}
 start.addEventListener('click',begin);cabinet.querySelectorAll('[data-ns]').forEach(b=>b.addEventListener('click',()=>{let a=b.dataset.ns;if(a.startsWith('cam'))cam=Number(a.slice(3));else if(a==='left')left=!left;else if(a==='right')right=!right;else light=!light;ui();draw();}));c.addEventListener('keydown',e=>{if(e.key>='1'&&e.key<='4'){cam=Number(e.key)-1;ui();draw();}if(e.key.toLowerCase()==='q')left=!left;if(e.key.toLowerCase()==='e')right=!right;if(e.key.toLowerCase()==='f')light=!light;ui();draw();});reset();draw();stop=()=>{active=false;cancelAnimationFrame(raf);};
}

function archive(){
 cabinet.innerHTML='<div class="kd2-archive"><article><small>RESTRICTED ARCHIVE // K-404</small><h4>SUBJECT FILE: KNIVES</h4><p>The medical record is encrypted. Enter an authorization phrase to access the report or reveal a legacy game relay.</p><form id="ar-form"><label for="ar-code">AUTHORIZATION CODE / PHRASE</label><div><input id="ar-code" type="password" maxlength="20" inputmode="text" autocomplete="off" placeholder="ENTER ACCESS PHRASE"><button class="kd2-primary" type="submit">DECRYPT FILE</button></div></form><p id="ar-message" aria-live="polite">FILE LOCKED // AUTHORIZATION REQUIRED</p><section id="ar-file" hidden><h5>STASIS CITY // MEDICAL & CONTAINMENT RECORD</h5><dl><dt>SUBJECT</dt><dd>KNIVES</dd><dt>SPECIES</dt><dd>HEDGEHOG / LYNX HYBRID</dd><dt>LOCATION</dt><dd>STASIS CITY</dd><dt>MEDICAL STATUS</dt><dd>TERMINAL CONDITION</dd><dt>EXPERIMENT</dt><dd>DEMONIC BLOOD INFUSION</dd><dt>INTERNAL ENTITY</dt><dd>VISCERAL DEMON // ACTIVE</dd><dt>FAMILY CONTACT</dt><dd>KURAMI // SISTER</dd><dt>CONTAINMENT</dt><dd>UNSTABLE</dd></dl><p class="kd2-kurami">INCOMING MESSAGE // KURAMI: “Knives... if you can hear this, stay with me. Do not let it take control.”</p></section><section id="ar-sonic" class="kd2-secret-portal" hidden><div class="kd2-secret-head"><small>UNREGISTERED SIGNAL // LEGACY GAME RELAY</small><h5>SEGA LEGACY PORTAL</h5><p>One browser build located: Sonic Momentum Beta Edition by Mr. Bane.</p></div><div class="kd2-momentum-cabinet"><div class="kd2-momentum-screen"><span class="kd2-momentum-signal">GX.GAMES // EXTERNAL PLAYER</span><strong>SONIC<br>MOMENTUM</strong><small>BETA EDITION // SAGE 2024</small><span class="kd2-momentum-status">EMBED MODE: NOT PERMITTED BY HOST</span></div><div class="kd2-momentum-details"><b>LEGACY GAME RELAY // M1.7 GX</b><p>GX Games blocks playback inside external websites. The arcade can keep this secret terminal, but the game itself must launch on its official GX Games page unless its creator provides an embeddable HTML5 build.</p><a class="kd2-secret-launch" href="https://gx.games/games/i05uqt/sonic-momentum-beta-edition-m1-7/tracks/85855219-a8f0-4c17-962e-7b4ed74aa4ce/" target="_blank" rel="noopener noreferrer">LAUNCH SONIC MOMENTUM ON GX GAMES ↗</a><span class="kd2-secret-credit">GAME BY MR. BANE · SOURCE: SONIC FAN GAMES HQ</span></div></div><button type="button" class="kd2-secret-lock" id="ar-lock">LOCK LEGACY PORTAL</button></section></article><article><small>NETWORK EVENT // INCOMING</small><h4>TRANSMIT A SIGNAL</h4><p>Send a pulse into the Stasis City network. Some replies may not be from the system.</p><button class="kd2-primary" id="ar-signal">TRANSMIT SIGNAL</button><p id="ar-output" class="kd2-output" aria-live="polite">AWAITING INPUT...</p></article></div>';
 const form=$('#ar-form'),input=$('#ar-code'),file=$('#ar-file'),portal=$('#ar-sonic'),message=$('#ar-message');
 form.addEventListener('submit',e=>{
  e.preventDefault();const code=input.value.trim(),isFile=code==='404',isSonic=code==="Who'sSEGA?";
  file.hidden=!isFile;portal.hidden=!isSonic;
  message.textContent=isFile?'ACCESS GRANTED // FILE DECRYPTED':isSonic?'LEGACY RELAY UNLOCKED // WHO’S SEGA?':'ACCESS DENIED // INVALID CODE';
  message.classList.toggle('success',isFile||isSonic);
  if(isSonic)portal.scrollIntoView({behavior:'smooth',block:'nearest'});
 });
 $('#ar-lock').addEventListener('click',()=>{portal.hidden=true;input.value='';message.textContent='LEGACY PORTAL LOCKED';message.classList.remove('success');});
 const msgs=['STASIS CITY RELAY: signal received. Keep moving, operator.','UNKNOWN CHANNEL: something is repeating your heartbeat.','KURAMI // encrypted ping detected. Origin cannot be verified.','CONTAINMENT NOTICE: do not answer the voice inside the core.','VISCERAL ENTITY: [TRANSMISSION CORRUPTED] ...LET ME OUT...','ARCHIVE FRAGMENT: Knives was not supposed to survive the procedure.'];
 $('#ar-signal').addEventListener('click',()=>$('#ar-output').textContent='> '+msgs[Math.random()*msgs.length|0]);
}

/* V2.1 PATCH // GAMEPLAY REWORKS */
function pinball(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-pin-stage"><div class="kd2-label"><span>VISCERAL TABLE // FIELD A</span><b id="pb-state">STANDBY</b></div><canvas id="pb-board" width="420" height="700" tabindex="0" aria-label="Visceral pinball table"></canvas><div class="kd2-label"><span>3 CELLS // KEEP THE CORE ALIVE</span><b>SPACE TO LAUNCH</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>SCORE</small><strong id="pb-score">0</strong></div><div class="kd2-stat"><small>RECORD</small><strong id="pb-best">'+fmt(best('pinball'))+'</strong></div><div class="kd2-stat"><small>CELLS LEFT</small><strong id="pb-lives">3</strong></div><button class="kd2-primary" id="pb-start">START / LAUNCH</button><div class="kd2-controls"><button data-flip="left">LEFT FLIPPER</button><button data-flip="right">RIGHT FLIPPER</button></div><p class="kd2-help">PRESS START, THEN SPACE TO LAUNCH. HOLD A / D OR THE FLIPPER BUTTONS TO HIT THE BALL.</p></aside></div>';
 const c=$('#pb-board'),ctx=c.getContext('2d'),score=$('#pb-score'),record=$('#pb-best'),life=$('#pb-lives'),state=$('#pb-state'),start=$('#pb-start');
 const W=420,H=700,R=8,bumpers=[{x:125,y:185,r:31},{x:210,y:125,r:34},{x:295,y:185,r:31},{x:210,y:285,r:25}];
 const flips=[{side:'left',x:125,y:590,len:105,rest:-.17,up:-.78,a:-.17,omega:0},{side:'right',x:295,y:590,len:105,rest:Math.PI+.17,up:Math.PI+.78,a:Math.PI+.17,omega:0}];
 let points=0,lives=3,active=false,launched=false,ended=false,raf=0,last=0,acc=0,ball={x:360,y:620,vx:0,vy:0},ld=false,rd=false;
 function resetBall(){ball={x:360,y:620,vx:0,vy:0};launched=false;start.textContent='LAUNCH BALL';}
 function save(n){points+=n;score.textContent=fmt(points);const b=Math.max(best('pinball'),points);safeSet('kd404-v2-pinball',b);record.textContent=fmt(b);}
 function loseBall(){lives--;life.textContent=String(lives);if(lives<=0){active=false;ended=true;launched=false;state.textContent='TABLE SHUTDOWN';start.textContent='RESTART TABLE';}else{resetBall();state.textContent='BALL RECOVERED // '+lives+' LEFT';}}
 function collideFlipper(f){
  const ex=f.x+Math.cos(f.a)*f.len,ey=f.y+Math.sin(f.a)*f.len,dx=ex-f.x,dy=ey-f.y;
  const t=Math.max(0,Math.min(1,((ball.x-f.x)*dx+(ball.y-f.y)*dy)/(dx*dx+dy*dy||1)));
  const px=f.x+t*dx,py=f.y+t*dy,nx0=ball.x-px,ny0=ball.y-py,d=Math.hypot(nx0,ny0),min=R+8;
  if(d>=min)return;
  const nx=d?nx0/d:0,ny=d?ny0/d:-1;ball.x=px+nx*(min+0.7);ball.y=py+ny*(min+0.7);
  const dot=ball.vx*nx+ball.vy*ny;if(dot<0){ball.vx-=2.05*dot*nx;ball.vy-=2.05*dot*ny;}
  if((f.side==='left'?ld:rd)&&ball.vy>-420){ball.vy=-Math.max(470,Math.abs(ball.vy)*0.8+Math.abs(f.omega)*95);ball.vx+=(f.side==='left'?1:-1)*95;save(5);}
 }
 function step(dt){
  flips.forEach(f=>{const previous=f.a,target=(f.side==='left'?ld:rd)?f.up:f.rest;f.a+=(target-f.a)*Math.min(1,dt*26);f.omega=(f.a-previous)/dt;});
  if(!launched)return;
  ball.vy+=1320*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;ball.vx*=0.999;ball.vy=Math.min(900,ball.vy);
  if(ball.x<R+20){ball.x=R+20;ball.vx=Math.abs(ball.vx)*0.82;}
  if(ball.x>W-R-20){ball.x=W-R-20;ball.vx=-Math.abs(ball.vx)*0.82;}
  if(ball.y<R+20){ball.y=R+20;ball.vy=Math.abs(ball.vy)*0.82;}
  bumpers.forEach(b=>{const dx=ball.x-b.x,dy=ball.y-b.y,d=Math.hypot(dx,dy),min=R+b.r;if(d<min&&d>0){const nx=dx/d,ny=dy/d;ball.x=b.x+nx*(min+0.8);ball.y=b.y+ny*(min+0.8);const dot=ball.vx*nx+ball.vy*ny;if(dot<0){ball.vx-=2*dot*nx;ball.vy-=2*dot*ny;}ball.vx+=nx*185;ball.vy+=ny*185;save(25);}});
  flips.forEach(collideFlipper);if(ball.y>H+22)loseBall();
 }
 function draw(){
  ctx.fillStyle='#070b08';ctx.fillRect(0,0,W,H);ctx.fillStyle='#101910';ctx.beginPath();ctx.moveTo(26,22);ctx.lineTo(394,22);ctx.lineTo(394,635);ctx.lineTo(337,690);ctx.lineTo(83,690);ctx.lineTo(26,635);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(181,201,74,.55)';ctx.lineWidth=4;ctx.stroke();
  ctx.strokeStyle='rgba(181,201,74,.17)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(345,510);ctx.lineTo(345,635);ctx.stroke();ctx.fillStyle='rgba(181,201,74,.06)';ctx.fillRect(350,510,35,125);
  ctx.fillStyle='#77866b';ctx.font='10px monospace';ctx.fillText('LAUNCH LANE',350,500);
  bumpers.forEach((b,i)=>{ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=i===3?'#713b48':'#4d6038';ctx.fill();ctx.lineWidth=4;ctx.strokeStyle='#b5c94a';ctx.stroke();ctx.beginPath();ctx.arc(b.x,b.y,b.r-9,0,Math.PI*2);ctx.strokeStyle='rgba(240,245,220,.35)';ctx.stroke();ctx.fillStyle='#dce9b8';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText('+'+(i===3?'50':'25'),b.x,b.y+4);});
  flips.forEach(f=>{const ex=f.x+Math.cos(f.a)*f.len,ey=f.y+Math.sin(f.a)*f.len;ctx.lineCap='round';ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=21;ctx.beginPath();ctx.moveTo(f.x+2,f.y+4);ctx.lineTo(ex+2,ey+4);ctx.stroke();ctx.strokeStyle=(f.side==='left'?ld:rd)?'#e0ee9a':'#b5c94a';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.lineTo(ex,ey);ctx.stroke();ctx.fillStyle='#d8e6ac';ctx.beginPath();ctx.arc(f.x,f.y,9,0,Math.PI*2);ctx.fill();});
  ctx.shadowColor='#b5c94a';ctx.shadowBlur=13;ctx.fillStyle='#e5f4bd';ctx.beginPath();ctx.arc(ball.x,ball.y,R,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle='#87927c';ctx.font='10px monospace';ctx.textAlign='left';ctx.fillText('VISCERAL CORE // FIELD A',38,665);
  if(!launched){ctx.fillStyle='rgba(3,7,5,.78)';ctx.fillRect(62,327,296,66);ctx.textAlign='center';ctx.fillStyle='#e2eac8';ctx.font='bold 14px monospace';ctx.fillText(ended?'TABLE SHUTDOWN':'BALL IN STASIS',210,354);ctx.fillStyle='#9aa68f';ctx.font='10px monospace';ctx.fillText(ended?'RESTART TABLE TO PLAY AGAIN':'PRESS START / SPACE TO LAUNCH',210,375);ctx.textAlign='left';}
 }
 function startLoop(){if(!raf){last=0;raf=requestAnimationFrame(frame);}}
 function launchBall(){if(!active||ended)begin();if(!launched){launched=true;ball.vx=-155;ball.vy=-680;state.textContent='BALL IN PLAY';start.textContent='BALL ACTIVE';}}
 function frame(ts){if(!active){raf=0;draw();return;}if(!last)last=ts;acc+=Math.min(.05,(ts-last)/1000);last=ts;let count=0;while(acc>=1/120&&count<12&&active){step(1/120);acc-=1/120;count++;}draw();if(active)raf=requestAnimationFrame(frame);else raf=0;}
 function begin(){cancelAnimationFrame(raf);raf=0;points=0;lives=3;score.textContent='0';life.textContent='3';active=true;ended=false;ld=false;rd=false;flips.forEach(f=>{f.a=f.rest;f.omega=0;});resetBall();state.textContent='BALL READY';draw();c.focus();startLoop();}
 start.addEventListener('click',()=>{if(!active||ended)begin();if(!launched)launchBall();});
 c.addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();if(!active||ended)begin();if(!launched)launchBall();}if(e.key.toLowerCase()==='a')ld=true;if(e.key.toLowerCase()==='d')rd=true;});
 c.addEventListener('keyup',e=>{if(e.key.toLowerCase()==='a')ld=false;if(e.key.toLowerCase()==='d')rd=false;});
 cabinet.querySelectorAll('[data-flip]').forEach(b=>{const side=b.dataset.flip,set=v=>{if(side==='left')ld=v;else rd=v;};b.addEventListener('pointerdown',e=>{e.preventDefault();set(true);if(b.setPointerCapture)b.setPointerCapture(e.pointerId);});['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,()=>set(false)));});
 resetBall();draw();stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;ld=rd=false;};
}

function breaker(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-wide-stage"><div class="kd2-label"><span>DEMON BREAKER // ENDLESS COMBAT</span><b id="db-state">STANDBY</b></div><canvas id="db-board" width="800" height="400" tabindex="0" aria-label="Demon Breaker action combat game"></canvas><div class="kd2-label"><span id="db-wave">WAVE 01 // 0 / 5</span><b id="db-boss">BOSS: NOT DETECTED</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>ELIMINATIONS</small><strong id="db-score">0</strong></div><div class="kd2-stat"><small>BEST WAVE</small><strong id="db-best">'+fmt(best('breaker'))+'</strong></div><div class="kd2-stat"><small>VITALITY</small><strong id="db-hp">♥ ♥ ♥ ♥ ♥</strong></div><button class="kd2-primary" id="db-start">DEPLOY KNIVES</button><div class="kd2-controls kd2-breaker-pad"><button data-db="left">◀</button><button data-db="right">▶</button><button data-db="jump">JUMP</button><button data-db="fire">HOLD FIRE</button></div><p class="kd2-help">A / D MOVE · SPACE JUMP · HOLD X / J FIRE · W / ↑ AIM UP. ENEMIES CAN JUMP AND FIRE BACK. A BOSS APPEARS EVERY 4 WAVES.</p></aside></div>';
 const c=$('#db-board'),x=c.getContext('2d'),score=$('#db-score'),record=$('#db-best'),hpNode=$('#db-hp'),state=$('#db-state'),bossText=$('#db-boss'),waveText=$('#db-wave'),start=$('#db-start'),W=800,floor=338,plats=[{x:190,y:265,w:130,h:13},{x:475,y:218,w:150,h:13},{x:350,y:290,w:92,h:12}];
 let active=false,over=false,points=0,hp=5,wave=1,recorded=best('breaker'),raf=0,last=0,acc=0,spawn=0,spawned=0,quota=5,fireWait=0,boss=null,bossSpawned=false,p,enemies=[],shots=[],hostile=[],keys={};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function resetPlayer(){p={x:85,y:floor-52,w:38,h:52,vy:0,ground:true,face:1,inv:0};}
 function reset(){resetPlayer();enemies=[];shots=[];hostile=[];points=0;hp=5;wave=1;spawn=.8;spawned=0;quota=5;fireWait=0;boss=null;bossSpawned=false;keys={};score.textContent='0';hpNode.textContent='♥ ♥ ♥ ♥ ♥';bossText.textContent='BOSS: NOT DETECTED';waveText.textContent='WAVE 01 // 0 / 5';}
 function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
 function jump(){if(active&&p.ground){p.vy=-680;p.ground=false;}}
 function nearestTarget(){let all=enemies.filter(e=>e.hp>0);if(boss)all.push(boss);if(!all.length)return null;return all.reduce((bestOne,e)=>Math.hypot((e.x+e.w/2)-(p.x+p.w/2),(e.y+e.h/2)-(p.y+p.h/2))<Math.hypot((bestOne.x+bestOne.w/2)-(p.x+p.w/2),(bestOne.y+bestOne.h/2)-(p.y+p.h/2))?e:bestOne,all[0]);}
 function fire(){if(!active||fireWait>0)return;const target=nearestTarget(),sx=p.x+(p.face>0?p.w+2:-9),sy=p.y+22;let angle=p.face>0?0:Math.PI;if(keys.up)angle=-Math.PI/3*(p.face>0?1:-1);else if(keys.down)angle=Math.PI/3*(p.face>0?1:-1);else if(target)angle=Math.atan2(target.y+target.h/2-sy,target.x+target.w/2-sx);shots.push({x:sx,y:sy,angle:angle,vx:Math.cos(angle)*560,vy:Math.sin(angle)*560,life:1.65});fireWait=.24;}
 function hurt(amount=1){if(p.inv>0||!active)return;hp-=amount;p.inv=1.05;hpNode.textContent=hp>0?'♥ '.repeat(hp).trim():'0';if(hp<=0){active=false;over=true;state.textContent='SIGNAL LOST';start.textContent='REDEPLOY KNIVES';}}
 function spawnMob(){const side=Math.random()<.5?-36:836,r=Math.random(),type=wave<2?'stalker':r<.36?'leaper':r<.68?'gunner':'stalker',h=type==='leaper'?42:36,w=type==='gunner'?38:34,life=(type==='gunner'?3:2)+Math.floor(wave/5);enemies.push({type,x:side,y:floor-h,w,h,hp:life,max:life,vy:0,ground:true,fire:1.2+Math.random()*1.4,jump:1+Math.random()*2});}
 function spawnBoss(){const max=20+wave*5;boss={x:655,y:floor-112,w:100,h:112,hp:max,max,fire:1.1,jump:2.8,vy:0,ground:true};bossSpawned=true;bossText.textContent='BOSS: VISCERAL SENTINEL // '+max+' HP';state.textContent='BOSS WAVE // ENTITY DETECTED';}
 function advanceWave(){wave++;hp=Math.min(5,hp+1);hpNode.textContent='♥ '.repeat(hp).trim();enemies=[];hostile=[];shots=[];boss=null;spawned=0;quota=Math.min(5+wave*2,17);spawn=1.25;bossSpawned=false;waveText.textContent='WAVE '+String(wave).padStart(2,'0')+' // 0 / '+quota;bossText.textContent='BOSS: '+(wave%4===0?'INCOMING':'NOT DETECTED');state.textContent='WAVE '+wave+' // INCOMING';}
 function update(dt){
  p.inv=Math.max(0,p.inv-dt);fireWait=Math.max(0,fireWait-dt);if(keys.fire&&fireWait<=0)fire();
  p.x=clamp(p.x+((keys.left?-255:0)+(keys.right?255:0))*dt,10,752);if(keys.left)p.face=-1;if(keys.right)p.face=1;
  const oldBottom=p.y+p.h;p.vy+=1850*dt;p.y+=p.vy*dt;p.ground=false;if(p.y+p.h>=floor){p.y=floor-p.h;p.vy=0;p.ground=true;}
  plats.forEach(q=>{if(p.vy>=0&&oldBottom<=q.y+7&&p.y+p.h>=q.y&&p.x+p.w>q.x&&p.x<q.x+q.w){p.y=q.y-p.h;p.vy=0;p.ground=true;}});
  spawn-=dt;if(spawned<quota&&spawn<=0){spawnMob();spawned++;spawn=Math.max(.48,1.32-wave*.035)+Math.random()*.5;waveText.textContent='WAVE '+String(wave).padStart(2,'0')+' // '+spawned+' / '+quota;}
  enemies.forEach(e=>{
   const dir=Math.sign((p.x+p.w/2)-(e.x+e.w/2)),dist=Math.abs((p.x+p.w/2)-(e.x+e.w/2)),old=e.y+e.h;
   if(e.type==='gunner'&&dist<310)e.x+=dir*34*dt;else e.x+=dir*(e.type==='leaper'?118:78+wave*2)*dt;
   if(e.type==='leaper'){e.jump-=dt;if(e.ground&&e.jump<=0&&(p.y<e.y-20||dist<210)){e.vy=-560;e.ground=false;e.jump=1.25+Math.random()*1.25;}}
   e.vy+=1550*dt;e.y+=e.vy*dt;e.ground=false;if(e.y+e.h>=floor){e.y=floor-e.h;e.vy=0;e.ground=true;}
   plats.forEach(q=>{if(e.vy>=0&&old<=q.y+7&&e.y+e.h>=q.y&&e.x+e.w>q.x&&e.x<q.x+q.w){e.y=q.y-e.h;e.vy=0;e.ground=true;}});
   if(e.type==='gunner'||(wave>=3&&dist<285))e.fire-=dt;
   if(e.fire<=0&&dist<440){const dx=p.x+p.w/2-(e.x+e.w/2),dy=p.y+p.h/2-(e.y+e.h/2),d=Math.hypot(dx,dy)||1,v=205+Math.min(125,wave*7);hostile.push({x:e.x+e.w/2,y:e.y+e.h/2,vx:dx/d*v,vy:dy/d*v,life:2.7,big:e.type==='gunner'});e.fire=(e.type==='gunner'?1.5:2.4)+Math.random()*.8;}
   if(overlap(p,e))hurt();
  });
  enemies=enemies.filter(e=>e.hp>0&&e.x>-80&&e.x<880);
  if(boss){const direction=Math.sign(p.x+p.w/2-(boss.x+boss.w/2));boss.x=clamp(boss.x+direction*42*dt,440,690);boss.fire-=dt;boss.jump-=dt;if(boss.jump<=0&&boss.ground){boss.vy=-570;boss.ground=false;boss.jump=2.4;}const old=boss.y+boss.h;boss.vy+=1450*dt;boss.y+=boss.vy*dt;boss.ground=false;if(boss.y+boss.h>=floor){boss.y=floor-boss.h;boss.vy=0;boss.ground=true;}plats.forEach(q=>{if(boss.vy>=0&&old<=q.y+7&&boss.y+boss.h>=q.y&&boss.x+boss.w>q.x&&boss.x<q.x+q.w){boss.y=q.y-boss.h;boss.vy=0;boss.ground=true;}});if(boss.fire<=0){const base=Math.atan2(p.y+p.h/2-(boss.y+boss.h/2),p.x+p.w/2-(boss.x+boss.w/2));[-.22,0,.22].forEach(o=>hostile.push({x:boss.x+boss.w/2,y:boss.y+boss.h/2,vx:Math.cos(base+o)*310,vy:Math.sin(base+o)*310,life:3,big:true}));boss.fire=1.25;}if(overlap(p,boss))hurt();}
  shots.forEach(s=>{const target=nearestTarget();if(target){const wanted=Math.atan2(target.y+target.h/2-s.y,target.x+target.w/2-s.x),delta=Math.atan2(Math.sin(wanted-s.angle),Math.cos(wanted-s.angle));s.angle+=clamp(delta,-2.8*dt,2.8*dt);s.vx=Math.cos(s.angle)*560;s.vy=Math.sin(s.angle)*560;}s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;enemies.forEach(e=>{if(s.life>0&&e.hp>0&&overlap({x:s.x-6,y:s.y-6,w:12,h:12},e)){e.hp--;s.life=0;if(e.hp<=0){points++;score.textContent=String(points);}}});if(boss&&s.life>0&&overlap({x:s.x-7,y:s.y-7,w:14,h:14},boss)){boss.hp--;s.life=0;bossText.textContent='BOSS: VISCERAL SENTINEL // '+Math.max(0,boss.hp)+' HP';if(boss.hp<=0){points+=5;score.textContent=String(points);boss=null;bossText.textContent='BOSS: NEUTRALIZED';}}});
  hostile.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(s.life>0&&overlap({x:s.x-7,y:s.y-7,w:14,h:14},p)){s.life=0;hurt();}});
  shots=shots.filter(s=>s.life>0&&s.x>-30&&s.x<830&&s.y>-30&&s.y<430);hostile=hostile.filter(s=>s.life>0&&s.x>-50&&s.x<850&&s.y>-50&&s.y<450);
  if(spawned>=quota&&enemies.length===0&&!boss){if(wave%4===0&&!bossSpawned)spawnBoss();else advanceWave();}
  const bestWave=Math.max(best('breaker'),wave);safeSet('kd404-v2-breaker',bestWave);record.textContent=fmt(bestWave);
 }
 function draw(){x.fillStyle='#080d0a';x.fillRect(0,0,800,400);for(let i=0;i<14;i++){let xx=i*65,h=75+(i*39%115);x.fillStyle=i%2?'#121c16':'#182219';x.fillRect(xx,floor-h,48,h);}x.fillStyle='#202a1e';x.fillRect(0,floor,800,62);x.strokeStyle='rgba(181,201,74,.35)';x.beginPath();x.moveTo(0,floor);x.lineTo(800,floor);x.stroke();plats.forEach(q=>{x.fillStyle='#46533a';x.fillRect(q.x,q.y,q.w,q.h);x.fillStyle='#b5c94a';x.fillRect(q.x,q.y,q.w,3);});enemies.forEach(e=>{x.fillStyle=e.type==='gunner'?'#7d597d':e.type==='leaper'?'#a14e4c':'#81404b';x.fillRect(e.x,e.y,e.w,e.h);x.fillStyle='#f0b6aa';x.fillRect(e.x+7,e.y+10,5,4);x.fillRect(e.x+e.w-12,e.y+10,5,4);x.fillStyle='#e5a1a0';x.fillRect(e.x,e.y-7,e.w*e.hp/e.max,3);});if(boss){x.fillStyle='#632c3a';x.fillRect(boss.x,boss.y,boss.w,boss.h);x.fillStyle='#d28b91';x.fillRect(boss.x+16,boss.y+30,68,9);x.fillStyle='#f3c7be';x.fillRect(boss.x+25,boss.y+33,10,5);x.fillRect(boss.x+67,boss.y+33,10,5);x.fillStyle='#b5c94a';x.fillRect(boss.x,boss.y-14,boss.w*boss.hp/boss.max,5);x.strokeStyle='#b5c94a';x.strokeRect(boss.x,boss.y-14,boss.w,5);}shots.forEach(s=>{x.strokeStyle='rgba(181,201,74,.3)';x.lineWidth=5;x.beginPath();x.moveTo(s.x-s.vx*.025,s.y-s.vy*.025);x.lineTo(s.x,s.y);x.stroke();x.fillStyle='#dff2a6';x.beginPath();x.arc(s.x,s.y,5,0,7);x.fill();});hostile.forEach(s=>{x.fillStyle=s.big?'#e26d83':'#bc7378';x.beginPath();x.arc(s.x,s.y,s.big?8:5,0,7);x.fill();});if(p&&(p.inv<=0||Math.floor(p.inv*12)%2===0)){x.fillStyle='#b9c69c';x.beginPath();x.ellipse(p.x+19,p.y+29,15,20,0,0,7);x.fill();x.fillStyle='#899e5d';for(let i=0;i<6;i++){x.beginPath();x.moveTo(p.x+6+i*4,p.y+15);x.lineTo(p.x+4+i*4,p.y-5-(i%2)*4);x.lineTo(p.x+12+i*4,p.y+15);x.fill();}x.fillStyle='#c2d88c';x.fillRect(p.x+(p.face>0?33:-8),p.y+31,13,8);}if(!active){x.fillStyle='rgba(3,7,5,.8)';x.fillRect(190,150,420,90);x.textAlign='center';x.fillStyle='#e2eac8';x.font='bold 17px monospace';x.fillText(over?'KNIVES // DOWN':'COMBAT SIMULATION',400,184);x.fillStyle='#98a48d';x.font='11px monospace';x.fillText(over?'REDEPLOY TO CONTINUE THE ENDLESS RUN':'INITIALIZE TO DEPLOY',400,208);x.textAlign='left';}}
 function frame(t){if(!active)return;if(!last)last=t;acc+=Math.min(.05,(t-last)/1000);last=t;let n=0;while(acc>=1/60&&n<6&&active){update(1/60);acc-=1/60;n++;}draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);raf=0;reset();active=true;over=false;state.textContent='COMBAT ACTIVE';start.textContent='RESTART ENDLESS RUN';last=0;acc=0;c.focus();draw();raf=requestAnimationFrame(frame);}
 function keydown(e){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=true;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=true;if(e.code==='Space')jump();if(e.key==='ArrowUp'||e.key.toLowerCase()==='w')keys.up=true;if(e.key==='ArrowDown'||e.key.toLowerCase()==='s')keys.down=true;if(['x','j'].includes(e.key.toLowerCase()))keys.fire=true;}
 function keyup(e){if(e.key==='ArrowLeft'||e.key.toLowerCase()==='a')keys.left=false;if(e.key==='ArrowRight'||e.key.toLowerCase()==='d')keys.right=false;if(e.key==='ArrowUp'||e.key.toLowerCase()==='w')keys.up=false;if(e.key==='ArrowDown'||e.key.toLowerCase()==='s')keys.down=false;if(['x','j'].includes(e.key.toLowerCase()))keys.fire=false;}
 start.addEventListener('click',begin);c.addEventListener('keydown',keydown);c.addEventListener('keyup',keyup);
 cabinet.querySelectorAll('[data-db]').forEach(b=>{const a=b.dataset.db,down=e=>{e.preventDefault();if(a==='left')keys.left=true;if(a==='right')keys.right=true;if(a==='jump')jump();if(a==='fire')keys.fire=true;},up=()=>{if(a==='left')keys.left=false;if(a==='right')keys.right=false;if(a==='fire')keys.fire=false;};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up));});
 reset();draw();stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;keys={};};
}

function nightshift(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-wide-stage"><div class="kd2-label"><span>STASIS CITY // SECURITY OFFICE</span><b id="ns-state">12 AM</b></div><canvas id="ns-board" width="720" height="420" tabindex="0" aria-label="Night Shift security cameras"></canvas><div class="kd2-label"><span id="ns-camera">CAM 01 // EAST HALL</span><b id="ns-threat">MOTION: NONE</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>POWER</small><strong id="ns-power">100%</strong></div><div class="kd2-stat"><small>SHIFT</small><strong id="ns-hour">12 AM / 6 AM</strong></div><div class="kd2-stat"><small>DOORS</small><strong id="ns-doors">EAST OPEN / WEST OPEN</strong></div><button class="kd2-primary" id="ns-start">BEGIN NIGHT SHIFT</button><div class="kd2-door-map"><span>LEFT SWITCH = EAST HALL</span><span>RIGHT SWITCH = WEST HALL</span></div><div class="kd2-controls"><button data-ns="cam0">CAM 01 // EAST</button><button data-ns="cam1">CAM 02 // LIFT</button><button data-ns="cam2">CAM 03 // ARCHIVE</button><button data-ns="cam3">CAM 04 // WEST</button><button data-ns="left">EAST DOOR: OPEN</button><button data-ns="lightLeft">EAST LIGHT</button><button data-ns="right">WEST DOOR: OPEN</button><button data-ns="lightRight">WEST LIGHT</button></div><p class="kd2-help">CAMERAS TRACK THE CREATURES. USE EAST / WEST LIGHT TO CHECK OUTSIDE THAT DOOR; IF YOU SEE ONE, CLOSE THE MATCHING DOOR. LIGHTS ARE MOMENTARY. CLOSED DOORS AND LIGHTS USE POWER.</p></aside></div>';
 const c=$('#ns-board'),g=c.getContext('2d'),state=$('#ns-state'),powerNode=$('#ns-power'),hourNode=$('#ns-hour'),doorsNode=$('#ns-doors'),camNode=$('#ns-camera'),threatNode=$('#ns-threat'),start=$('#ns-start'),names=['EAST HALL','FREIGHT LIFT','ARCHIVE ROOM','WEST HALL'];
 let active=false,raf=0,last=0,time=0,power=100,cam=0,left=false,right=false,lightLeft=0,lightRight=0,entities=[],won=false,over=false;
 function reset(){time=0;power=100;cam=0;left=false;right=false;lightLeft=0;lightRight=0;entities=[{side:'east',route:[1,0],step:0,wait:5,doorTimer:2.1},{side:'west',route:[2,3],step:0,wait:8,doorTimer:2.1}];won=false;over=false;ui();}
 function atDoor(side){return entities.some(e=>e.side===side&&e.step>=e.route.length);}
 function onCam(index){return entities.some(e=>e.step<e.route.length&&e.route[e.step]===index);}
 function ui(){const h=Math.min(6,Math.floor(time/15));powerNode.textContent=Math.ceil(power)+'%';hourNode.textContent=(h||12)+' AM / 6 AM';state.textContent=(h||12)+' AM';doorsNode.textContent='EAST '+(left?'CLOSED':'OPEN')+' / WEST '+(right?'CLOSED':'OPEN');camNode.textContent='CAM 0'+(cam+1)+' // '+names[cam];threatNode.textContent=atDoor('east')?'EAST DOOR // CHECK LIGHT':atDoor('west')?'WEST DOOR // CHECK LIGHT':onCam(cam)?'MOTION: ENTITY DETECTED':'MOTION: NONE';const l=cabinet.querySelector('[data-ns="left"]'),r=cabinet.querySelector('[data-ns="right"]');l.textContent='EAST DOOR: '+(left?'CLOSED':'OPEN');r.textContent='WEST DOOR: '+(right?'CLOSED':'OPEN');l.classList.toggle('is-held',left);r.classList.toggle('is-held',right);}
 function fail(text){active=false;over=true;state.textContent='SECURITY BREACH';start.textContent='RETRY NIGHT SHIFT';threatNode.textContent=text||'ENTITY ENTERED THE OFFICE';}
 function checkLight(side){if(!active)return;if(side==='east')lightLeft=1.25;else lightRight=1.25;const detected=atDoor(side);threatNode.textContent=detected?(side.toUpperCase()+' DOOR // ENTITY DETECTED — CLOSE IT'):(side.toUpperCase()+' DOOR // HALL CLEAR');draw();}
 function update(dt){time+=dt;lightLeft=Math.max(0,lightLeft-dt);lightRight=Math.max(0,lightRight-dt);const lit=(lightLeft>0?0.55:0)+(lightRight>0?0.55:0),drain=0.16+(left?0.24:0)+(right?0.24:0)+lit;power=Math.max(0,power-drain*dt*8);if(power<=0){left=false;right=false;lightLeft=0;lightRight=0;}entities.forEach(e=>{e.wait-=dt;if(e.step<e.route.length&&e.wait<=0){e.step++;e.wait=4.5+Math.random()*3.8;}if(e.step>=e.route.length){const closed=e.side==='east'?left:right;e.doorTimer-=dt;if(closed){e.step=e.route.length-1;e.wait=5+Math.random()*3;e.doorTimer=2.1;}else if(e.doorTimer<=0)fail(e.side.toUpperCase()+' ENTITY ENTERED THE OFFICE');}});if(time>=90){active=false;won=true;state.textContent='06 AM // SURVIVED';start.textContent='PLAY ANOTHER NIGHT';}ui();}
 function draw(){g.fillStyle='#050806';g.fillRect(0,0,720,420);const isLight=(cam===0&&lightLeft>0)||(cam===3&&lightRight>0);g.fillStyle=power<=0?'#020302':isLight?'#1b251b':'#111a13';g.fillRect(35,35,650,350);for(let i=0;i<12;i++){g.fillStyle=i%2?'#18241b':'#1c2b20';g.fillRect(55+i*53,70,18,285);}g.strokeStyle='rgba(181,201,74,.3)';g.strokeRect(35,35,650,350);g.fillStyle='#b5c94a';g.font='13px monospace';g.fillText('STASIS CCTV // CAM 0'+(cam+1)+' // '+names[cam],52,60);g.fillStyle='#66765d';g.font='10px monospace';g.fillText('REC ● '+Math.floor(time)+' SEC',560,60);
  const e=entities.find(v=>v.step<v.route.length&&v.route[v.step]===cam);if(e){const ex=e.side==='east'?250:455;g.fillStyle='#4d2835';g.beginPath();g.ellipse(ex,245,42,90,0,0,Math.PI*2);g.fill();g.fillStyle='#d7a1a0';g.fillRect(ex-18,200,9,7);g.fillRect(ex+9,200,9,7);g.fillStyle='#a5b47e';for(let i=0;i<5;i++){g.beginPath();g.moveTo(ex-32+i*14,165);g.lineTo(ex-38+i*14,135-(i%2)*15);g.lineTo(ex-20+i*14,165);g.fill();}g.fillStyle='#f0c5a3';g.font='11px monospace';g.fillText('ENTITY // CAM MOTION',ex-75,330);}else{g.fillStyle='#66765d';g.font='12px monospace';g.fillText('NO MOTION DETECTED',265,215);}
  for(let i=0;i<75;i++){let y=(i*37+time*33)%385+20;g.fillStyle='rgba(190,220,175,.045)';g.fillRect(35,y,650,1);}g.fillStyle='rgba(0,0,0,.55)';g.fillRect(45,355,630,22);g.font='10px monospace';g.fillStyle=left?'#d5bd7b':'#8ca17d';g.fillText('LEFT // EAST DOOR: '+(left?'CLOSED':'OPEN'),58,370);g.fillStyle=right?'#d5bd7b':'#8ca17d';g.fillText('RIGHT // WEST DOOR: '+(right?'CLOSED':'OPEN'),390,370);
  if(lightLeft>0||lightRight>0){g.fillStyle='rgba(218,234,164,.08)';g.fillRect(35,35,650,350);if(lightLeft>0&&atDoor('east')){g.fillStyle='#b5c94a';g.font='bold 14px monospace';g.fillText('EAST DOOR: ENTITY OUTSIDE!',170,405);}else if(lightRight>0&&atDoor('west')){g.fillStyle='#b5c94a';g.font='bold 14px monospace';g.fillText('WEST DOOR: ENTITY OUTSIDE!',170,405);}}
  if(power<=0){g.fillStyle='rgba(0,0,0,.78)';g.fillRect(35,35,650,350);g.fillStyle='#a66d78';g.fillText('POWER FAILURE // DOORS RELEASED',205,210);}if(!active){g.fillStyle='rgba(0,0,0,.72)';g.fillRect(120,155,480,110);g.textAlign='center';g.fillStyle='#e2eac8';g.font='bold 21px monospace';g.fillText(won?'SHIFT COMPLETE // 06:00 AM':over?'ENTITY BREACHED SECURITY':'NIGHT SHIFT // STASIS FACILITY',360,198);g.fillStyle='#a1ae91';g.font='12px monospace';g.fillText(won?'YOU SURVIVED THE CONTAINMENT NIGHT':over?'THE ENTITY REACHED YOUR OFFICE':'MONITOR CAMERAS // CHECK THE CORRECT DOOR',360,226);g.textAlign='left';}
 }
 function frame(ts){if(!active){raf=0;draw();return;}if(!last)last=ts;let dt=Math.min(.05,(ts-last)/1000);last=ts;update(dt);draw();if(active)raf=requestAnimationFrame(frame);else raf=0;}
 function begin(){cancelAnimationFrame(raf);raf=0;reset();active=true;start.textContent='ABORT SHIFT';c.focus();draw();last=0;raf=requestAnimationFrame(frame);}
 start.addEventListener('click',()=>{if(active){active=false;state.textContent='SHIFT ABORTED';start.textContent='BEGIN NIGHT SHIFT';draw();}else begin();});
 cabinet.querySelectorAll('[data-ns]').forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.ns;if(a.startsWith('cam'))cam=Number(a.slice(3));else if(a==='left')left=!left;else if(a==='right')right=!right;else if(a==='lightLeft')checkLight('east');else if(a==='lightRight')checkLight('west');ui();draw();}));
 c.addEventListener('keydown',e=>{if(e.key>='1'&&e.key<='4')cam=Number(e.key)-1;if(e.key.toLowerCase()==='q')left=!left;if(e.key.toLowerCase()==='e')right=!right;if(e.key.toLowerCase()==='z')checkLight('east');if(e.key.toLowerCase()==='x')checkLight('west');ui();draw();});
 reset();draw();stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;};
}

function duel(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-fighter-stage"><div class="kd2-label"><span>STASIS DUEL // TRAINING SIMULATION</span><b id="fg-state">READY</b></div><canvas id="fg-board" width="800" height="420" tabindex="0" aria-label="Stasis Duel fighting game"></canvas><div class="kd2-label"><span id="fg-round">ROUND 01 // FIRST TO TWO</span><b id="fg-meter">VISCERAL METER: 0%</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>YOUR WINS</small><strong id="fg-wins">0</strong></div><div class="kd2-stat"><small>CPU WINS</small><strong id="fg-losses">0</strong></div><div class="kd2-stat"><small>BEST MATCH</small><strong id="fg-best">'+fmt(best('duel'))+'</strong></div><button class="kd2-primary" id="fg-start">START MATCH</button><div class="kd2-controls kd2-fight-pad"><button data-fg="left">◀</button><button data-fg="jump">JUMP</button><button data-fg="right">▶</button><button data-fg="guard">GUARD</button><button data-fg="light">LIGHT</button><button data-fg="heavy">HEAVY</button><button data-fg="special">SPECIAL</button></div><p class="kd2-help">A / D MOVE · W JUMP · HOLD S GUARD · J LIGHT · K HEAVY · L SPECIAL. BEST OF THREE ROUNDS.</p></aside></div>';
 const c=$('#fg-board'),g=c.getContext('2d'),state=$('#fg-state'),roundNode=$('#fg-round'),meterNode=$('#fg-meter'),winsNode=$('#fg-wins'),lossesNode=$('#fg-losses'),bestNode=$('#fg-best'),start=$('#fg-start'),floor=345;
 let active=false,raf=0,last=0,playerWins=0,cpuWins=0,round=1,recorded=best('duel'),transition=0,matchOver=false,keys={},player,cpu;
 function makeFighters(){player={x:155,y:floor-82,w:46,h:82,vy:0,ground:true,hp:100,meter:0,face:1,attack:null,cd:0,inv:0,block:false};cpu={x:600,y:floor-82,w:46,h:82,vy:0,ground:true,hp:100,meter:0,face:-1,attack:null,cd:0,inv:0,block:false,ai:0,mode:'approach'};}
 function updateHud(){winsNode.textContent=String(playerWins);lossesNode.textContent=String(cpuWins);meterNode.textContent='VISCERAL METER: '+Math.floor(player.meter)+'%';roundNode.textContent='ROUND '+String(round).padStart(2,'0')+' // FIRST TO TWO';}
 function resetRound(){makeFighters();transition=0;updateHud();state.textContent='FIGHT // ROUND '+round;}
 function startAttack(f,type){if(!active||f.cd>0||f.attack)return;const cfg=type==='light'?{duration:.28,hit:.13,range:78,damage:7,meter:8}:type==='heavy'?{duration:.48,hit:.22,range:106,damage:14,meter:14}:{duration:.62,hit:.29,range:158,damage:24,meter:0};if(type==='special'){if(f.meter<100)return;f.meter=0;}f.attack={type,time:cfg.duration,hit:cfg.hit,range:cfg.range,damage:cfg.damage,meter:cfg.meter,done:false};f.cd=type==='light'?.22:type==='heavy'?.48:.78;}
 function applyHit(attacker,defender){const a=attacker.attack;if(!a||a.done||a.time>a.hit)return;a.done=true;const dx=(defender.x+defender.w/2)-(attacker.x+attacker.w/2),vertical=Math.abs((defender.y+defender.h/2)-(attacker.y+attacker.h/2));if(Math.sign(dx)===attacker.face&&Math.abs(dx)<a.range&&vertical<85){const guarded=defender.block&&defender.ground,damage=guarded?Math.ceil(a.damage*.28):a.damage;defender.hp=Math.max(0,defender.hp-damage);defender.inv=.18;defender.x=Math.max(20,Math.min(734,defender.x+attacker.face*(guarded?8:22)));attacker.meter=Math.min(100,attacker.meter+a.meter+(guarded?2:0));defender.meter=Math.min(100,defender.meter+damage*.35);}}
 function resolveRound(){if(transition>0)return;if(player.hp<=0||cpu.hp<=0){transition=2.1;if(player.hp<=0)cpuWins++;else playerWins++;state.textContent=player.hp<=0?'ROUND LOST':'ROUND WON';winsNode.textContent=String(playerWins);lossesNode.textContent=String(cpuWins);}}
 function moveFighter(f,dir,dt){f.x=Math.max(22,Math.min(732,f.x+dir*245*dt));}
 function updateFighter(f,dt){f.cd=Math.max(0,f.cd-dt);f.inv=Math.max(0,f.inv-dt);f.block=!!(f===player?keys.guard:f.block);if(f.attack){f.attack.time-=dt;applyHit(f,f===player?cpu:player);if(f.attack.time<=0)f.attack=null;}f.vy+=1550*dt;f.y+=f.vy*dt;if(f.y+f.h>=floor){f.y=floor-f.h;f.vy=0;f.ground=true;}else f.ground=false;}
 function cpuThink(dt){cpu.ai-=dt;const distance=player.x-cpu.x;cpu.face=distance<0?-1:1;if(cpu.ai<=0){cpu.ai=.12+Math.random()*.18;if(Math.abs(distance)>112){cpu.mode='approach';moveFighter(cpu,Math.sign(distance),.18);}else if(Math.random()<.25){cpu.mode='guard';cpu.block=true;}else{cpu.block=false;startAttack(cpu,Math.random()<.68?'light':'heavy');}if(Math.abs(distance)>190&&Math.random()<.18&&cpu.ground){cpu.vy=-590;cpu.ground=false;}}if(cpu.mode!=='guard')cpu.block=false;}
 function drawFighter(f,color,accent){g.save();g.globalAlpha=f.inv>0?.58:1;g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(f.x+f.w/2,floor+5,34,8,0,0,7);g.fill();g.translate(f.x+f.w/2,f.y+f.h/2);g.scale(f.face,1);g.fillStyle=accent;g.beginPath();for(let i=0;i<7;i++){const px=-18+i*6;g.moveTo(px,-24);g.lineTo(px-6,-44-(i%2)*6);g.lineTo(px+5,-31);}g.fill();g.fillStyle=color;g.beginPath();g.roundRect(-17,-32,34,58,7);g.fill();g.fillStyle=accent;g.beginPath();g.arc(0,-42,17,0,7);g.fill();g.fillStyle='#10150f';g.fillRect(5,-45,7,4);g.fillStyle=color;g.fillRect(-16,21,12,17);g.fillRect(5,21,12,17);if(f.block){g.strokeStyle='#d8e9a0';g.lineWidth=5;g.beginPath();g.arc(7,-1,32,-1.1,1.1);g.stroke();}if(f.attack){g.strokeStyle=f.attack.type==='special'?'#e36b86':accent;g.lineWidth=f.attack.type==='heavy'?12:7;g.shadowColor=accent;g.shadowBlur=14;g.beginPath();g.arc(22,-3,f.attack.range*.48,-.95,.95);g.stroke();g.shadowBlur=0;}g.restore();}
 function draw(){g.fillStyle='#070b09';g.fillRect(0,0,800,420);for(let i=0;i<12;i++){const xx=i*75;g.fillStyle=i%2?'#111b15':'#172319';g.fillRect(xx,75+(i%3)*14,50,270);g.fillStyle='rgba(181,201,74,.15)';g.fillRect(xx+12,110,5,45);g.fillRect(xx+28,180,5,34);}g.fillStyle='#202a1e';g.fillRect(0,floor,800,75);g.strokeStyle='rgba(181,201,74,.4)';g.beginPath();g.moveTo(0,floor);g.lineTo(800,floor);g.stroke();g.fillStyle='#b5c94a';g.font='11px monospace';g.fillText('KNIVES // OPERATOR',30,28);g.fillText('TRAINING CONSTRUCT // CPU',570,28);g.fillStyle='#253321';g.fillRect(30,40,300,13);g.fillStyle='#b5c94a';g.fillRect(30,40,300*player.hp/100,13);g.fillStyle='#352026';g.fillRect(470,40,300,13);g.fillStyle='#cf6877';g.fillRect(470+300*(100-cpu.hp)/100,40,300*cpu.hp/100,13);g.fillStyle='#a6b394';g.font='10px monospace';g.fillText('HP '+player.hp,30,68);g.fillText('CPU '+cpu.hp,720,68);g.fillStyle='#313b28';g.fillRect(30,76,160,5);g.fillStyle='#d0e98d';g.fillRect(30,76,160*player.meter/100,5);g.fillStyle='#313b28';g.fillRect(610,76,160,5);g.fillStyle='#d17b8a';g.fillRect(610,76,160*cpu.meter/100,5);drawFighter(player,'#8eaa69','#d9ed9d');drawFighter(cpu,'#673b4a','#df8a9a');if(!active){g.fillStyle='rgba(0,0,0,.7)';g.fillRect(190,150,420,95);g.textAlign='center';g.fillStyle='#e3edcf';g.font='bold 19px monospace';g.fillText(matchOver?'MATCH COMPLETE':'STASIS DUEL',400,187);g.fillStyle='#a4b391';g.font='12px monospace';g.fillText(matchOver?(playerWins>cpuWins?'KNIVES WINS THE SIMULATION':'CPU WINS THE SIMULATION'):'FIRST TO TWO ROUNDS // PRESS START',400,215);g.textAlign='left';}}
 function finishMatch(){active=false;matchOver=true;start.textContent='REMATCH';state.textContent=playerWins>cpuWins?'SIMULATION CLEARED':'SIMULATION FAILED';recorded=Math.max(recorded,playerWins);safeSet('kd404-v2-duel',recorded);bestNode.textContent=fmt(recorded);}
 function frame(ts){if(!active)return;if(!last)last=ts;const dt=Math.min(.04,(ts-last)/1000);last=ts;if(transition>0){transition-=dt;if(transition<=0){if(playerWins>=2||cpuWins>=2)finishMatch();else{round++;resetRound();}}}else{if(keys.left)moveFighter(player,-1,dt);if(keys.right)moveFighter(player,1,dt);player.face=cpu.x<player.x?-1:1;updateFighter(player,dt);cpuThink(dt);updateFighter(cpu,dt);applyHit(player,cpu);applyHit(cpu,player);resolveRound();}draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);raf=0;active=true;playerWins=0;cpuWins=0;round=1;matchOver=false;keys={};resetRound();start.textContent='RESTART MATCH';last=0;draw();c.focus();raf=requestAnimationFrame(frame);}
 function keydown(e){if(['ArrowLeft','ArrowRight','ArrowUp',' '].includes(e.key))e.preventDefault();if(e.key.toLowerCase()==='a'||e.key==='ArrowLeft')keys.left=true;if(e.key.toLowerCase()==='d'||e.key==='ArrowRight')keys.right=true;if(e.key.toLowerCase()==='s')keys.guard=true;if(e.key.toLowerCase()==='w'||e.key==='ArrowUp'){if(player.ground){player.vy=-600;player.ground=false;}}if(e.key.toLowerCase()==='j')startAttack(player,'light');if(e.key.toLowerCase()==='k')startAttack(player,'heavy');if(e.key.toLowerCase()==='l')startAttack(player,'special');}
 function keyup(e){if(e.key.toLowerCase()==='a'||e.key==='ArrowLeft')keys.left=false;if(e.key.toLowerCase()==='d'||e.key==='ArrowRight')keys.right=false;if(e.key.toLowerCase()==='s')keys.guard=false;}
 start.addEventListener('click',begin);c.addEventListener('keydown',keydown);c.addEventListener('keyup',keyup);
 cabinet.querySelectorAll('[data-fg]').forEach(b=>{const a=b.dataset.fg,down=e=>{e.preventDefault();if(a==='left')keys.left=true;if(a==='right')keys.right=true;if(a==='guard')keys.guard=true;if(a==='jump'&&player.ground){player.vy=-600;player.ground=false;}if(a==='light')startAttack(player,'light');if(a==='heavy')startAttack(player,'heavy');if(a==='special')startAttack(player,'special');},up=()=>{if(a==='left')keys.left=false;if(a==='right')keys.right=false;if(a==='guard')keys.guard=false;};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up));});
 resetRound();active=false;draw();stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;keys={};};
}

function breach(){
 cabinet.innerHTML='<div class="kd2-game-grid"><div class="kd2-stage kd2-breach-stage"><div class="kd2-label"><span>STASIS BREACH // TACTICAL SIMULATION</span><b id="br-state">READY</b></div><canvas id="br-board" width="720" height="480" tabindex="0" aria-label="Stasis Breach tactical shooter"></canvas><div class="kd2-label"><span id="br-objective">OBJECTIVE: CLEAR THE ROOM</span><b>HOSTILE CONTACT // ACTIVE</b></div></div><aside class="kd2-info"><div class="kd2-stat"><small>ROUND</small><strong id="br-round">01</strong></div><div class="kd2-stat"><small>VITALITY</small><strong id="br-hp">100%</strong></div><div class="kd2-stat"><small>MAGAZINE</small><strong id="br-ammo">12 / 48</strong></div><div class="kd2-stat"><small>ELIMINATIONS</small><strong id="br-kills">0</strong></div><button class="kd2-primary" id="br-start">DEPLOY SQUAD</button><div class="kd2-controls kd2-breach-pad"><button data-br="up">▲</button><button data-br="left">◀</button><button data-br="down">▼</button><button data-br="right">▶</button><button data-br="fire">FIRE / AUTO-AIM</button><button data-br="reload">RELOAD</button></div><p class="kd2-help">WASD MOVE · MOUSE AIM · CLICK FIRE · R RELOAD. USE WALLS AS COVER. TOUCH CONTROLS AUTO-AIM AT THE NEAREST BOT.</p></aside></div>';
 const c=$('#br-board'),g=c.getContext('2d'),state=$('#br-state'),roundNode=$('#br-round'),hpNode=$('#br-hp'),ammoNode=$('#br-ammo'),killsNode=$('#br-kills'),objective=$('#br-objective'),start=$('#br-start'),W=720,H=480,walls=[{x:125,y:88,w:135,h:34},{x:460,y:82,w:125,h:36},{x:300,y:182,w:105,h:110},{x:92,y:330,w:150,h:30},{x:493,y:330,w:135,h:30},{x:328,y:45,w:54,h:46}];
 let active=false,raf=0,last=0,round=1,hp=100,kills=0,mag=12,reserve=48,reload=0,fireWait=0,transition=0,keys={},mouse={x:520,y:220,down:false},player,bots=[],shots=[],hostile=[],spawned=0,quota=3,spawnTimer=0,touchFire=false;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function collides(o){return walls.some(w=>o.x<w.x+w.w&&o.x+o.w>w.x&&o.y<w.y+w.h&&o.y+o.h>w.y);}
 function move(o,dx,dy){o.x+=dx;if(collides(o))o.x-=dx;o.y+=dy;if(collides(o))o.y-=dy;o.x=clamp(o.x,10,W-o.w-10);o.y=clamp(o.y,10,H-o.h-10);}
 function resetPlayer(){player={x:345,y:390,w:28,h:28,angle:-Math.PI/2};}
 function updateHud(){roundNode.textContent=String(round).padStart(2,'0');hpNode.textContent=hp+'%';ammoNode.textContent=mag+' / '+reserve;killsNode.textContent=String(kills);}
 function spawnRound(){quota=Math.min(3+Math.floor((round-1)*1.25),12);spawned=0;spawnTimer=.5;bots=[];shots=[];hostile=[];transition=0;objective.textContent='OBJECTIVE: ELIMINATE '+quota+' HOSTILES';state.textContent='ROUND '+round+' // ACTIVE';}
 function spawnBot(){const edge=Math.random()*4|0,x=edge===0?30:edge===1?660:80+Math.random()*560,y=edge===2?30:edge===3?425:60+Math.random()*350,hpBot=round>4?3:2;bots.push({x,y,w:26,h:26,hp:hpBot,max:hpBot,speed:45+round*5,fire:.8+Math.random()*1.3,hit:0});}
 function nearestBot(){return bots.reduce((bestBot,b)=>!bestBot||Math.hypot(b.x-player.x,b.y-player.y)<Math.hypot(bestBot.x-player.x,bestBot.y-player.y)?b:bestBot,null);}
 function blockedLine(a,b){const dx=b.x-a.x,dy=b.y-a.y,dist=Math.hypot(dx,dy),steps=Math.ceil(dist/8);for(let i=1;i<steps;i++){const px=a.x+dx*i/steps,py=a.y+dy*i/steps;if(walls.some(w=>px>w.x&&px<w.x+w.w&&py>w.y&&py<w.y+w.h))return true;}return false;}
 function reloadWeapon(){if(reload<=0&&mag<12&&reserve>0)reload=1.15;}
 function fire(){if(!active||reload>0||fireWait>0)return;if(mag<=0){reloadWeapon();return;}const target=nearestBot(),angle=mouse.down?Math.atan2(mouse.y-(player.y+14),mouse.x-(player.x+14)):target?Math.atan2(target.y-player.y,target.x-player.x):player.angle;player.angle=angle;shots.push({x:player.x+14+Math.cos(angle)*17,y:player.y+14+Math.sin(angle)*17,vx:Math.cos(angle)*520,vy:Math.sin(angle)*520,life:1.2});mag--;fireWait=.19;updateHud();}
 function hurt(n){hp=Math.max(0,hp-n);updateHud();if(hp<=0){active=false;state.textContent='OPERATOR DOWN';start.textContent='RETRY OPERATION';objective.textContent='MISSION FAILED // '+kills+' ELIMINATIONS';}}
 function update(dt){
  fireWait=Math.max(0,fireWait-dt);if(reload>0){reload-=dt;if(reload<=0){const need=12-mag,take=Math.min(need,reserve);mag+=take;reserve-=take;updateHud();}}
  if((keys.fire||mouse.down||touchFire)&&fireWait<=0)fire();
  const dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0),len=Math.hypot(dx,dy)||1;move(player,dx/len*178*dt,dy/len*178*dt);
  if(!mouse.down&&!touchFire){const target=nearestBot();if(target)player.angle=Math.atan2(target.y-player.y,target.x-player.x);}
  spawnTimer-=dt;if(spawned<quota&&spawnTimer<=0){spawnBot();spawned++;spawnTimer=.65+Math.random()*.65;}
  bots.forEach(b=>{b.hit=Math.max(0,b.hit-dt);const dx=player.x-b.x,dy=player.y-b.y,d=Math.hypot(dx,dy)||1;if(d>175)move(b,dx/d*b.speed*dt,dy/d*b.speed*dt);else if(d<105)move(b,-dx/d*b.speed*.6*dt,-dy/d*b.speed*.6*dt);b.fire-=dt;if(b.fire<=0&&d<330&&!blockedLine({x:b.x+13,y:b.y+13},{x:player.x+14,y:player.y+14})){const a=Math.atan2(dy,dx),v=170+Math.min(100,round*8);hostile.push({x:b.x+13,y:b.y+13,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:2.5});b.fire=Math.max(.72,1.55-round*.035)+Math.random()*.5;}});
  shots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(walls.some(w=>s.x>w.x&&s.x<w.x+w.w&&s.y>w.y&&s.y<w.y+w.h))s.life=0;bots.forEach(b=>{if(s.life>0&&s.x>b.x&&s.x<b.x+b.w&&s.y>b.y&&s.y<b.y+b.h){b.hp--;s.life=0;b.hit=.12;if(b.hp<=0)kills++;}});});
  hostile.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(walls.some(w=>s.x>w.x&&s.x<w.x+w.w&&s.y>w.y&&s.y<w.y+w.h))s.life=0;if(s.life>0&&s.x>player.x&&s.x<player.x+player.w&&s.y>player.y&&s.y<player.y+player.h){s.life=0;hurt(Math.min(18,10+Math.floor(round/3)));}});
  bots=bots.filter(b=>b.hp>0);shots=shots.filter(s=>s.life>0&&s.x>=0&&s.x<=W&&s.y>=0&&s.y<=H);hostile=hostile.filter(s=>s.life>0&&s.x>=0&&s.x<=W&&s.y>=0&&s.y<=H);
  if(spawned>=quota&&bots.length===0&&transition<=0){transition=1.6;state.textContent='ROOM SECURED';objective.textContent='AREA CLEAR // PREPARE NEXT ROUND';}
  if(transition>0){transition-=dt;if(transition<=0&&active){round++;hp=Math.min(100,hp+12);mag=12;reserve=Math.min(96,reserve+6);reload=0;spawnRound();updateHud();}}
  updateHud();
 }
 function draw(){g.fillStyle='#080d0a';g.fillRect(0,0,W,H);g.fillStyle='#101a14';g.fillRect(12,12,W-24,H-24);g.strokeStyle='rgba(181,201,74,.18)';g.lineWidth=1;for(let xx=30;xx<W;xx+=30){g.beginPath();g.moveTo(xx,12);g.lineTo(xx,H-12);g.stroke();}for(let yy=30;yy<H;yy+=30){g.beginPath();g.moveTo(12,yy);g.lineTo(W-12,yy);g.stroke();}walls.forEach(w=>{g.fillStyle='#3a4937';g.fillRect(w.x,w.y,w.w,w.h);g.strokeStyle='#82946b';g.strokeRect(w.x,w.y,w.w,w.h);g.fillStyle='rgba(0,0,0,.22)';g.fillRect(w.x+4,w.y+4,w.w-8,5);});shots.forEach(s=>{g.strokeStyle='rgba(203,230,142,.45)';g.lineWidth=3;g.beginPath();g.moveTo(s.x-s.vx*.025,s.y-s.vy*.025);g.lineTo(s.x,s.y);g.stroke();g.fillStyle='#d7ee9a';g.beginPath();g.arc(s.x,s.y,3,0,7);g.fill();});hostile.forEach(s=>{g.fillStyle='#dc7380';g.beginPath();g.arc(s.x,s.y,4,0,7);g.fill();});bots.forEach(b=>{g.fillStyle=b.hit>0?'#e5b1a0':'#874958';g.fillRect(b.x,b.y,b.w,b.h);g.fillStyle='#f0b2a5';g.fillRect(b.x+5,b.y+6,5,4);g.fillRect(b.x+16,b.y+6,5,4);g.fillStyle='#d7a1a0';g.fillRect(b.x,b.y-5,b.w*b.hp/b.max,3);});if(player){g.save();g.translate(player.x+14,player.y+14);g.rotate(player.angle);g.fillStyle='#b5c94a';g.fillRect(-10,-10,20,20);g.fillStyle='#dce8bf';g.fillRect(2,-4,22,8);g.restore();}if(!active){g.fillStyle='rgba(0,0,0,.65)';g.fillRect(140,175,440,95);g.textAlign='center';g.fillStyle='#e1ebcf';g.font='bold 20px monospace';g.fillText(hp<=0?'OPERATOR DOWN':'STASIS BREACH',360,214);g.fillStyle='#aab995';g.font='12px monospace';g.fillText('TACTICAL SIMULATION // DEPLOY TO START',360,242);g.textAlign='left';}}
 function frame(ts){if(!active)return;if(!last)last=ts;const dt=Math.min(.04,(ts-last)/1000);last=ts;update(dt);draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);raf=0;round=1;hp=100;kills=0;mag=12;reserve=48;reload=0;fireWait=0;keys={};mouse.down=false;touchFire=false;resetPlayer();spawnRound();active=true;state.textContent='ROUND 01 // ACTIVE';start.textContent='RESTART OPERATION';updateHud();last=0;draw();c.focus();raf=requestAnimationFrame(frame);}
 function point(e){const r=c.getBoundingClientRect();mouse.x=(e.clientX-r.left)*W/r.width;mouse.y=(e.clientY-r.top)*H/r.height;}
 c.addEventListener('pointermove',point);c.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){point(e);mouse.down=true;}else touchFire=true;c.focus();});['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>c.addEventListener(t,()=>{mouse.down=false;touchFire=false;}));
 c.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['w','a','s','d','r',' '].includes(k))e.preventDefault();if(k==='w'||e.key==='ArrowUp')keys.up=true;if(k==='s'||e.key==='ArrowDown')keys.down=true;if(k==='a'||e.key==='ArrowLeft')keys.left=true;if(k==='d'||e.key==='ArrowRight')keys.right=true;if(k==='r')reloadWeapon();if(e.code==='Space')keys.fire=true;});
 c.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='w'||e.key==='ArrowUp')keys.up=false;if(k==='s'||e.key==='ArrowDown')keys.down=false;if(k==='a'||e.key==='ArrowLeft')keys.left=false;if(k==='d'||e.key==='ArrowRight')keys.right=false;if(e.code==='Space')keys.fire=false;});
 start.addEventListener('click',begin);
 cabinet.querySelectorAll('[data-br]').forEach(b=>{const a=b.dataset.br,down=e=>{e.preventDefault();if(a==='up')keys.up=true;if(a==='down')keys.down=true;if(a==='left')keys.left=true;if(a==='right')keys.right=true;if(a==='fire')touchFire=true;if(a==='reload')reloadWeapon();},up=()=>{if(a==='up')keys.up=false;if(a==='down')keys.down=false;if(a==='left')keys.left=false;if(a==='right')keys.right=false;if(a==='fire')touchFire=false;};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up));});
 resetPlayer();draw();stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;keys={};touchFire=false;mouse.down=false;};
}


function knivesAdvance(){
 const W=960,H=540,END=6700;
 cabinet.innerHTML='<section class="kd2-ka-shell"><div class="kd2-ka-hud"><div><small>SCORE</small><strong id="ka-score">000000</strong></div><div><small>SHARDS</small><strong id="ka-rings">00</strong></div><div><small>VITALITY</small><strong id="ka-lives">♥ ♥ ♥</strong></div><div><small>ZONE TIME</small><strong id="ka-time">00:00</strong></div><div><small>MOMENTUM</small><strong id="ka-speed">0 KM/H</strong></div></div><div class="kd2-ka-screen"><canvas id="ka-game" width="960" height="540" tabindex="0" aria-label="Knives Advance platform game"></canvas><div class="kd2-ka-caption"><span id="ka-zone">ZONE 01 // STASIS OUTSKIRTS</span><span id="ka-status">SIGNAL STABLE</span></div></div><div class="kd2-ka-actions"><button type="button" class="kd2-primary" id="ka-start">ENTER ZONE</button><span>COLLECT SHARDS · BUILD MOMENTUM · REACH THE GATE</span></div><div class="kd2-ka-touch"><div><button type="button" data-ka="left">◀</button><button type="button" data-ka="right">▶</button></div><div><button type="button" data-ka="roll">ROLL</button><button type="button" data-ka="jump">JUMP</button></div></div><p class="kd2-ka-help">MOVE: A / D OR ← → · JUMP: SPACE / W / ↑ · HOLD ↓ TO ROLL · X TO BURST · TOUCH CONTROLS AVAILABLE</p></section>';
 const c=$('#ka-game'),g=c.getContext('2d'),start=$('#ka-start'),scoreEl=$('#ka-score'),ringsEl=$('#ka-rings'),livesEl=$('#ka-lives'),timeEl=$('#ka-time'),speedEl=$('#ka-speed'),statusEl=$('#ka-status');
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const ground=x=>{let y=421+Math.sin(x*.0041)*12+Math.sin(x*.0017)*17;if(x>620&&x<1320)y-=105*Math.sin((x-620)/700*Math.PI);if(x>1830&&x<2480)y+=58*Math.sin((x-1830)/650*Math.PI);if(x>3260&&x<4020)y-=84*Math.sin((x-3260)/760*Math.PI);if(x>4780&&x<5410)y+=48*Math.sin((x-4780)/630*Math.PI);if(x>5650&&x<6250)y-=48*Math.sin((x-5650)/600*Math.PI);return clamp(y,285,475);};
 const platforms=[{x:1510,y:278,w:190},{x:2670,y:306,w:170},{x:4370,y:270,w:210},{x:5550,y:300,w:180}],spikes=[{x:1030,w:96},{x:2180,w:110},{x:3820,w:100},{x:5060,w:110},{x:6130,w:100}],springs=[1130,3520,5700],seeds=[1450,2940,4580,5920];
 const keys={left:false,right:false,down:false,jump:false};let shards=[],enemies=[],particles=[],p,raf=0,last=0,time=0,cam=0,score=0,count=0,lives=3,checkpoint=80,checkpointed=false,active=false,won=false,dead=false,jumpTap=false,dashTap=false;
 function player(x){return{x,y:ground(x)-40,w:34,h:40,vx:0,vy:0,dir:1,grounded:true,rolling:false,roll:0,invuln:0,coyote:.1};}
 function setup(){shards=[];for(let x=260;x<END-180;x+=92){if(spikes.some(s=>x>s.x-65&&x<s.x+s.w+55))continue;let t=(x%552)/552;shards.push({x,y:ground(x)-60-Math.sin(t*Math.PI)*42,taken:false});}for(const base of [760,1730,2820,3450,4490,5350,6280])for(let i=0;i<6;i++){let x=base+i*34;shards.push({x,y:ground(x)-95-Math.sin(i/5*Math.PI)*62,taken:false});}enemies=seeds.map((x,i)=>({x,home:x,dir:i%2?1:-1,y:ground(x)-31,dead:false}));particles=[];}
 function hud(){scoreEl.textContent=String(score).padStart(6,'0');ringsEl.textContent=String(count).padStart(2,'0');livesEl.textContent=lives?'♥ '.repeat(lives).trim():'—';timeEl.textContent=String(Math.floor(time/60)).padStart(2,'0')+':'+String(Math.floor(time%60)).padStart(2,'0');speedEl.textContent=Math.round(Math.abs(p.vx)*.31)+' KM/H';}
 function burst(x,y,color,n=8){for(let i=0;i<n;i++){let a=Math.random()*Math.PI*2,v=45+Math.random()*180;particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:.4+Math.random()*.4,color});}}
 function reset(){score=0;count=0;lives=3;time=0;cam=0;checkpoint=80;checkpointed=false;won=false;dead=false;p=player(80);setup();$('#ka-zone').textContent='ZONE 01 // STASIS OUTSKIRTS';statusEl.textContent='SIGNAL STABLE';hud();}
 function hurt(){if(p.invuln>0||won||dead)return;burst(p.x+17,p.y+20,'#ff7a88',12);if(count>=10)count-=10;else if(count)count=0;else lives--;p.invuln=1.35;p.vx=-p.dir*270;p.vy=-340;p.grounded=false;if(lives<=0){lives=0;dead=true;active=false;start.textContent='RETRY ZONE';statusEl.textContent='OPERATOR DOWN';draw();}else statusEl.textContent='IMPACT // STABILIZING';hud();}
 function update(dt){
  time+=dt;p.invuln=Math.max(0,p.invuln-dt);let old=p.y,input=(keys.right?1:0)-(keys.left?1:0);
  if(input){p.dir=input;p.vx+=input*(p.grounded?1850:920)*dt;}else p.vx*=Math.max(0,1-(p.grounded?2.3:.45)*dt);
  if(p.grounded)p.vx+=(ground(p.x+12)-ground(p.x-12))/24*610*dt;
  p.rolling=(keys.down&&p.grounded&&Math.abs(p.vx)>115)||p.roll>0;if(p.roll>0)p.roll=Math.max(0,p.roll-dt);
  if(dashTap&&p.grounded){p.vx=p.dir*720;p.roll=.62;p.rolling=true;burst(p.x+17,p.y+p.h,'#b5c94a',7);}dashTap=false;p.vx=clamp(p.vx,-(p.rolling?740:570),p.rolling?740:570);
  if(jumpTap&&(p.grounded||p.coyote>0)){p.vy=-670;p.grounded=false;p.coyote=0;p.rolling=false;}jumpTap=false;if(keys.jump&&p.vy<0)p.vy-=230*dt;
  p.vy+=1660*dt;p.x=clamp(p.x+p.vx*dt,0,END+100);p.y+=p.vy*dt;p.grounded=false;
  if(p.y+p.h>=ground(p.x)&&p.vy>=0&&p.x<END+20){p.y=ground(p.x)-p.h;p.vy=0;p.grounded=true;}
  for(const q of platforms)if(p.vy>=0&&old+p.h<=q.y+5&&p.y+p.h>=q.y&&p.x+p.w>q.x&&p.x<q.x+q.w){p.y=q.y-p.h;p.vy=0;p.grounded=true;}
  p.coyote=p.grounded ? .1 : Math.max(0,p.coyote-dt);
  for(const x of springs)if(Math.abs(p.x+17-x)<23&&p.grounded){p.vy=-900;p.grounded=false;p.roll=.45;burst(x,ground(x)-10,'#c7e77d',12);}
  for(const r of shards)if(!r.taken){let dx=r.x-(p.x+17),dy=r.y-(p.y+20);if(dx*dx+dy*dy<34*34){r.taken=true;count++;score+=25;burst(r.x,r.y,'#f5d76e',4);}}
  for(const s of spikes)if(p.x+p.w>s.x&&p.x<s.x+s.w&&p.y+p.h>ground(s.x+s.w/2)-34)hurt();
  for(const e of enemies)if(!e.dead){e.x+=e.dir*48*dt;if(e.x<e.home-48||e.x>e.home+48)e.dir*=-1;e.y=ground(e.x)-31;if(p.x+p.w>e.x-22&&p.x<e.x+22&&p.y+p.h>e.y+3&&p.y<e.y+31){if(p.vy>100||p.rolling){e.dead=true;p.vy=-425;p.grounded=false;score+=150;burst(e.x,e.y,'#b5c94a',14);}else hurt();}}
  if(!checkpointed&&p.x>3220){checkpointed=true;checkpoint=3260;$('#ka-zone').textContent='CHECKPOINT // MID-SECTOR';statusEl.textContent='CHECKPOINT SYNCHRONIZED';score+=500;}
  if(p.x>END){won=true;active=false;score+=count*50;statusEl.textContent='ZONE CLEARED';start.textContent='PLAY AGAIN';draw();}
  if(p.y>H+180){hurt();if(!dead){p.x=checkpoint;p.y=ground(checkpoint)-p.h;p.vy=0;}}
  particles.forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=420*dt;a.life-=dt;});particles=particles.filter(a=>a.life>0);
  cam+=(clamp(p.x-330,0,END-W+250)-cam)*Math.min(1,dt*5);if(Math.abs(p.vx)>45&&p.grounded&&Math.random()<dt*12)burst(p.x+17,p.y+p.h-2,'#778c51',1);hud();
 }
 function drawPlayer(){
  if(p.invuln>0&&Math.floor(p.invuln*12)%2===0)return;g.save();g.translate(p.x-cam+17,p.y+20);if(p.rolling||!p.grounded)g.rotate(time*8*p.dir);g.scale(p.dir,1);
  const spr=['....GGG.....','...GGGGG....','..GGGBBGG...','.GGGBBBBGG..','..GBBWWBBG..','...GBBBRBBG.','....BBBBRRR.','....BBBBB...','...BB.BB.....','..BB...BB....','.BB.....BB...','BB..........'],pal={G:'#b5c94a',B:'#263544',W:'#eff4dc',R:'#a94d61'};
  spr.forEach((row,y)=>Array.from(row).forEach((ch,x)=>{if(pal[ch]){g.fillStyle=pal[ch];g.fillRect(-18+x*3,-18+y*3,3,3);}}));g.fillStyle='#151b22';g.fillRect(7,-4,3,3);g.fillStyle='#e9efcf';g.fillRect(8,-4,2,2);g.restore();
 }
 function draw(){
  g.imageSmoothingEnabled=false;let sky=g.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#101c2b');sky.addColorStop(.58,'#29404b');sky.addColorStop(1,'#9b765b');g.fillStyle=sky;g.fillRect(0,0,W,H);
  for(let i=0;i<42;i++){let x=((i*173-cam*.16)%(W+40)+W+40)%(W+40),y=34+(i*47)%190;g.fillStyle=i%3?'rgba(224,239,194,.22)':'rgba(245,218,153,.45)';g.fillRect(x,y,2,2);}
  for(let i=0;i<18;i++){let x=i*190-cam*.28;if(x<-180||x>W+20)continue;let h=70+i*53%125;g.fillStyle=i%2?'#23343b':'#1b2b35';g.fillRect(x,H-112-h,82,h);g.fillStyle='rgba(181,201,74,.23)';for(let y=H-102-h;y<H-120;y+=19)g.fillRect(x+13,y,5,7);}
  g.beginPath();g.moveTo(0,H);for(let x=Math.floor(cam/20)*20;x<cam+W+30;x+=20)g.lineTo(x-cam,ground(x));g.lineTo(W,H);g.closePath();g.fillStyle='#17261f';g.fill();
  g.beginPath();for(let x=Math.floor(cam/20)*20;x<cam+W+30;x+=20){if(x===Math.floor(cam/20)*20)g.moveTo(x-cam,ground(x));else g.lineTo(x-cam,ground(x));}g.strokeStyle='#91a85e';g.lineWidth=4;g.stroke();
  for(let x=Math.floor(cam/54)*54;x<cam+W+54;x+=54){g.fillStyle='rgba(181,201,74,.18)';g.fillRect(x-cam,ground(x)+18,25,3);}
  platforms.forEach(q=>{let x=q.x-cam;if(x+q.w<0||x>W)return;g.fillStyle='#384c3b';g.fillRect(x,q.y,q.w,12);g.fillStyle='#afc96a';g.fillRect(x,q.y,q.w,4);});
  spikes.forEach(s=>{let x=s.x-cam;if(x+s.w<0||x>W)return;g.fillStyle='#d5d8c4';for(let xx=0;xx<s.w;xx+=24){g.beginPath();g.moveTo(x+xx,ground(s.x+xx));g.lineTo(x+xx+12,ground(s.x+xx)-28);g.lineTo(x+xx+24,ground(s.x+xx));g.closePath();g.fill();}});
  springs.forEach(x=>{let sx=x-cam,y=ground(x)-10;if(sx<-30||sx>W+30)return;g.fillStyle='#a94d61';g.fillRect(sx-13,y,26,9);g.strokeStyle='#e3c27e';g.lineWidth=3;g.beginPath();g.moveTo(sx-8,y);g.lineTo(sx-4,y-8);g.lineTo(sx,y);g.lineTo(sx+4,y-8);g.lineTo(sx+8,y);g.stroke();});
  shards.forEach(r=>{if(r.taken)return;let x=r.x-cam;if(x<-20||x>W+20)return;g.strokeStyle='#f4d46c';g.lineWidth=3;g.beginPath();g.ellipse(x,r.y,6,10,Math.sin(time*4+r.x)*.18,0,Math.PI*2);g.stroke();});
  enemies.forEach(e=>{if(e.dead)return;let x=e.x-cam;if(x<-35||x>W+35)return;g.fillStyle='#5c293d';g.fillRect(x-15,e.y+9,30,22);g.fillStyle='#bd5969';g.fillRect(x-19,e.y+3,38,11);g.fillStyle='#f4dcaa';g.fillRect(x-8,e.y+7,5,4);g.fillRect(x+5,e.y+7,5,4);});
  particles.forEach(a=>{g.globalAlpha=clamp(a.life*2,0,1);g.fillStyle=a.color;g.fillRect(a.x-cam,a.y,4,4);});g.globalAlpha=1;
  if(p){g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(p.x-cam+17,ground(p.x)+4,p.rolling?17:13,4,0,0,Math.PI*2);g.fill();drawPlayer();}
  let gx=END-cam;if(gx>-55&&gx<W+55){g.fillStyle='#b5c94a';g.fillRect(gx,ground(END)-112,9,112);g.fillStyle='#e4e9c5';g.fillRect(gx-22,ground(END)-112,54,28);g.fillStyle='#1b2922';g.font='bold 13px monospace';g.fillText('GO',gx-14,ground(END)-93);}
  if(!active){g.fillStyle='rgba(4,8,12,.72)';g.fillRect(0,0,W,H);g.textAlign='center';g.fillStyle='#b5c94a';g.font='bold 18px monospace';g.fillText(won?'ZONE 01 // CLEARED':dead?'SIGNAL LOST // OPERATOR DOWN':'KNIVES ADVANCE',W/2,H/2-34);g.fillStyle='#f0f2de';g.font='bold 38px monospace';g.fillText(won?'STASIS OUTSKIRTS':dead?'RUN TERMINATED':'',W/2,H/2+10);g.fillStyle='#bdc7ae';g.font='14px monospace';g.fillText(won?'GATE REACHED // SCORE '+String(score).padStart(6,'0'):dead?'NO VITALITY REMAINING':'A NEW SIGNAL IS WAITING',W/2,H/2+48);g.textAlign='left';}
 }
 function frame(ts){if(!active)return;if(!last)last=ts;let dt=Math.min(.033,(ts-last)/1000);last=ts;update(dt);draw();if(active)raf=requestAnimationFrame(frame);}
 function begin(){cancelAnimationFrame(raf);raf=0;reset();active=true;start.textContent='RESTART ZONE';c.focus();last=0;draw();raf=requestAnimationFrame(frame);}
 function keyDown(e){if(!active)return;let k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowdown','arrowup',' ','w','a','s','d','x','z'].includes(k))e.preventDefault();if(k==='a'||k==='arrowleft')keys.left=true;if(k==='d'||k==='arrowright')keys.right=true;if(k==='s'||k==='arrowdown')keys.down=true;if(k===' '||k==='w'||k==='arrowup'){if(!keys.jump)jumpTap=true;keys.jump=true;}if((k==='x'||k==='z')&&!e.repeat)dashTap=true;}
 function keyUp(e){let k=e.key.toLowerCase();if(k==='a'||k==='arrowleft')keys.left=false;if(k==='d'||k==='arrowright')keys.right=false;if(k==='s'||k==='arrowdown')keys.down=false;if(k===' '||k==='w'||k==='arrowup')keys.jump=false;}
 function release(){keys.left=keys.right=keys.down=keys.jump=false;}
 window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);window.addEventListener('blur',release);c.addEventListener('pointerdown',()=>c.focus());
 cabinet.querySelectorAll('[data-ka]').forEach(b=>{let a=b.dataset.ka;const down=e=>{e.preventDefault();b.classList.add('is-held');if(a==='left')keys.left=true;if(a==='right')keys.right=true;if(a==='roll')keys.down=true;if(a==='jump'){if(!keys.jump)jumpTap=true;keys.jump=true;}},up=()=>{b.classList.remove('is-held');if(a==='left')keys.left=false;if(a==='right')keys.right=false;if(a==='roll')keys.down=false;if(a==='jump')keys.jump=false;};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave','lostpointercapture'].forEach(t=>b.addEventListener(t,up));});
 start.addEventListener('click',begin);reset();draw();
 stop=()=>{active=false;cancelAnimationFrame(raf);raf=0;release();window.removeEventListener('keydown',keyDown);window.removeEventListener('keyup',keyUp);window.removeEventListener('blur',release);};
}

 choose('bloodlock');
})();
