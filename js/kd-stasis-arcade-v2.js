/* KD-404 // STASIS CITY ARCADE v2 */
(() => {
'use strict';
if (document.getElementById('kd-stasis-arcade-v2')) return;
const old = document.getElementById('kd-stasis-arcade');
if (!old) return;
const root = document.createElement('section');
root.id = 'kd-stasis-arcade-v2';
root.className = 'kd-arcade-v2';
root.innerHTML =
'<header class="kd2-head"><div><small>SECTOR 07 // RECREATION & CONTAINMENT</small><h2>STASIS CITY <i>//</i> ARCADE</h2><p>UNAUTHORIZED SIMULATIONS RECOVERED FROM THE STASIS CITY NETWORK.</p></div><span class="kd2-online">● LOCAL SYSTEM ONLINE</span></header>'+
'<div class="kd2-layout"><nav class="kd2-nav" aria-label="Arcade selection"><small>SELECT PROGRAM</small>'+
'<button type="button" class="is-active" data-game="bloodlock" aria-pressed="true"><b>01</b><span><strong>BLOODLOCK</strong><small>PUZZLE / CONTAINMENT</small></span>›</button>'+
'<button type="button" data-game="pinball" aria-pressed="false"><b>02</b><span><strong>VISCERAL PINBALL</strong><small>ARCADE / PHYSICS</small>›</button>'+
'<button type="button" data-game="run" aria-pressed="false"><b>03</b><span><strong>STASIS RUN</strong><small>RUNNER / SURVIVAL</small>›</button>'+
'<button type="button" data-game="breaker" aria-pressed="false"><b>04</b><span><strong>DEMON BREAKER</strong><small>ACTION / BOSS HUNT</small>›</span></button>'+
'<button type="button" data-game="archive" aria-pressed="false"><b>05</b><span><strong>CLASSIFIED ARCHIVE</strong><small>INTEL / UNKNOWN SIGNAL</small></span>›</button>'+
'<div class="kd2-nav-foot">OPERATOR // KD-404<br>INPUT // KEYBOARD & TOUCH</div></nav>'+
'<main class="kd2-main"><header class="kd2-game-head"><div><small id="kd2-type">PUZZLE / CONTAINMENT</small><h3 id="kd2-title">BLOODLOCK</h3><p id="kd2-desc">Arrange the unstable fragments. Clear rows to stabilize the core.</p></div><span>BUILD 02.04<br>STASIS CITY LAB</span></header>'+
'<div id="kd2-cabinet" class="kd2-cabinet"></div>'+
'<footer class="kd2-foot"><span id="kd2-tip">ARROWS MOVE · UP ROTATE · SPACE HARD DROP</span><span>RECORDS // THIS DEVICE</span></footer></main></div>';
old.replaceWith(root);

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
 breaker:['ACTION / BOSS HUNT','DEMON BREAKER','Fight through the containment unit with Knives’ visceral energy cannon.','A / D MOVE · SPACE JUMP · X / J FIRE'],
 archive:['INTEL / UNKNOWN SIGNAL','CLASSIFIED ARCHIVE','Recover a restricted file and listen to transmissions from Stasis City.','RESTRICTED ACCESS // CODE 404']
};
function choose(id){
 stop(); stop=()=>{};
 root.querySelectorAll('[data-game]').forEach(b=>{const yes=b.dataset.game===id;b.classList.toggle('is-active',yes);b.setAttribute('aria-pressed',String(yes));});
 $('#kd2-type').textContent=info[id][0];$('#kd2-title').textContent=info[id][1];$('#kd2-desc').textContent=info[id][2];$('#kd2-tip').textContent=info[id][3];
 if(id==='bloodlock') bloodlock();
 if(id==='pinball') pinball();
 if(id==='run') runner();
 if(id==='breaker') breaker();
 if(id==='archive') archive();
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
  fl flips.forEach(segment);
  if(ball.y>710){lives--;life.textContent=String(lives);if(lives<=0){active=false;ended=true;state.textContent='TABLE SHUTDOWN';start.textContent='RESTART TABLE';}else{resetBall();state.textContent='BALL RECOVERED';}}
 }
 function draw(){
  x.fillStyle='#070b08';x.fillRect(0,0,420,700);x.fillStyle='#101910';x.beginPath();x.moveTo(25,25);x.lineTo(395,25);x.lineTo(395,640);x.lineTo(330,690);x.lineTo(90,690);x.lineTo(25,640);x.closePath();x.fill();x.strokeStyle='rgba(181,201,74,.5)';x.lineWidth=4;x.stroke();
  bumpers.forEach((b,i)=>{x.fillStyle=i===3?'#713b48':'#4d6038';x.beginPath();x.arc(b.x,b.y,b.r,0,Math.PI*2);x.fill();x.strokeStyle='#b5c94a';x.lineWidth=4;x.stroke();x.fillStyle='rgba(240,245,220,.35)';x.beginPath();x.arc(b.x,b.y,8,0,7);x.fill();});
  fl.forEach(f=>{let ex=f.x+Math.cos(f.a)*f.len,ey=f.y+Math.sin(f.a)*f.len;x.strokeStyle='#b5c94a';x.lineWidth=15;x.lineCap='round';x.beginPath();x.moveTo(f.x,f.y);x.lineTo(ex,ey);x.stroke();});
  x.fillStyle='#d8e6ac';x.beginPath();x.arc(ball.x,ball.y,R,0,7);x.fill();
  if(!launched){x.fillStyle='rgba(3,7,5,.8)';x.fillRect(65,325,290,64);x.textAlign='center';x.fillStyle='#e2eac8';x.font='bold 14px monospace';x.fillText(ended?'TABLE SHUTDOWN':'BALL IN STASIS',210,352);x.fillStyle='#9aa68f';x.font='10px monospace';x.fillText('PRESS START / SPACE TO LAUNCH',210,372);x.textAlign='left';}
 }
 function begin(){cancelAnimationFrame(raf);points=0;lives=3;life.textContent='3';score.textContent='0';active=true;ended=false;ld=rd=false;fl.forEach(f=>f.a=f.rest);resetBall();state.textContent='BALL READY';start.textContent='LAUNCH BALL';last=0;acc=0;draw();c.focus();}
 function launch(){if(!active||ended)begin();if(!launched){launched=true;ball.vx=-110;ball.vy=-690;state.textContent='BALL IN PLAY';start.textContent='BALL ACTIVE';}}
 function frame(t){if(!active)return;if(!last)last=t;acc+=Math.min(.05,(t-last)/1000);last=t;let count=0;while(acc>=1/120&&count<8&&active){step(1/120);acc-=1/120;count++;}draw();if(active)raf=requestAnimationFrame(frame);}
 start.addEventListener('click',()=>{launch();if(active&&!raf){last=0;raf=requestAnimationFrame(frame);}});
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

function archive(){
 cabinet.innerHTML='<div class="kd2-archive"><article><small>RESTRICTED ARCHIVE // K-404</small><h4>SUBJECT FILE: KNIVES</h4><p>The medical record is encrypted. Enter the recovered authorization code to reveal the report.</p><form id="ar-form"><label for="ar-code">AUTHORIZATION CODE</label><div><input id="ar-code" type="password" maxlength="8" inputmode="numeric" placeholder="ENTER CODE"><button class="kd2-primary" type="submit">DECRYPT FILE</button></div></form><p id="ar-message" aria-live="polite">FILE LOCKED // AUTHORIZATION REQUIRED</p><section id="ar-file" hidden><h5>STASIS CITY // MEDICAL & CONTAINMENT RECORD</h5><dl><dt>SUBJECT</dt><dd>KNIVES</dd><dt>SPECIES</dt><dd>HEDGEHOG / LYNX HYBRID</dd><dt>LOCATION</dt><dd>STASIS CITY</dd><dt>MEDICAL STATUS</dt><dd>TERMINAL CONDITION</dd><dt>EXPERIMENT</dt><dd>DEMONIC BLOOD INFUSION</dd><dt>INTERNAL ENTITY</dt><dd>VISCERAL DEMON // ACTIVE</dd><dt>FAMILY CONTACT</dt><dd>KURAMI // SISTER</dd><dt>CONTAINMENT</dt><dd>UNSTABLE</dd></dl><p class="kd2-kurami">INCOMING MESSAGE // KURAMI: “Knives... if you can hear this, stay with me. Do not let it take control.”</p></section></article><article><small>NETWORK EVENT // INCOMING</small><h4>TRANSMIT A SIGNAL</h4><p>Send a pulse into the Stasis City network. Some replies may not be from the system.</p><button class="kd2-primary" id="ar-signal">TRANSMIT SIGNAL</button><p id="ar-output" class="kd2-output" aria-live="polite">AWAITING INPUT...</p></article></div>';
 $('#ar-form').addEventListener('submit',e=>{e.preventDefault();let ok=$('#ar-code').value.trim()==='404';$('#ar-file').hidden=!ok;$('#ar-message').textContent=ok?'ACCESS GRANTED // FILE DECRYPTED':'ACCESS DENIED // INVALID CODE';$('#ar-message').classList.toggle('success',ok);});
 const msgs=['STASIS CITY RELAY: signal received. Keep moving, operator.','UNKNOWN CHANNEL: something is repeating your heartbeat.','KURAMI // encrypted ping detected. Origin cannot be verified.','CONTAINMENT NOTICE: do not answer the voice inside the core.','VISCERAL ENTITY: [TRANSMISSION CORRUPTED] ...LET ME OUT...','ARCHIVE FRAGMENT: Knives was not supposed to survive the procedure.'];
 $('#ar-signal').addEventListener('click',()=>$('#ar-output').textContent='> '+msgs[Math.random()*msgs.length|0]);
}
choose('bloodlock');
})();
