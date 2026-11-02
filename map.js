/*
 * Unknown Seas — Canvas sea chart.
 * Adapted from the supplied EasyV3 paint/geo/fog/trail/ship implementation.
 * Gameplay state is owned by game.js; this class never mutates a save object.
 */
(function (global) {
'use strict';
const D=global.VoyageMapData;
if(!D)throw new Error('map-data.js must be loaded before map.js');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mix=(a,b,t)=>a+(b-a)*t;
const ease=t=>1-Math.pow(1-t,3);
const world={l:D.X0,r:D.X0+D.W*D.DX,t:D.Y1,b:D.Y1-D.H*D.DX};
class VoyageMap {
 constructor(canvas,{getState,onMove,onToast=()=>{},revealAll=false,readOnly=false}={}) {
  if(!canvas||typeof getState!=='function')throw new Error('VoyageMap requires canvas and getState');
  this.revealAll=revealAll;this.readOnly=readOnly;this.canvas=canvas;this.ctx=canvas.getContext('2d');this.getState=getState;
  this.onMove=onMove||(()=>{});this.onToast=onToast;this.zoom=1.12;this.following=true;
  this.route='east';this.target=null;this.pin=null;this.all=false;this.pending=0;this.destroyed=false;
  const s=getState();this.ship={x:s.x,y:s.y};this.lastCell={...this.ship};this.cam=D.geo(s.x,s.y);
  this.motion=null;this.pointer=null;this.guideKey='';this.guide=[];this.listeners=[];
  canvas.style.touchAction='none';
  if(!canvas.hasAttribute('aria-label'))canvas.setAttribute('aria-label','航海地圖。點按相鄰海格航行，拖曳查看海域。');
  this.listen(canvas,'pointerdown',e=>this.pointerDown(e));
  this.listen(canvas,'pointermove',e=>this.pointerMove(e));
  this.listen(canvas,'pointerup',e=>this.pointerUp(e));
  this.listen(canvas,'pointercancel',e=>{if(this.pointer?.id===e.pointerId)this.pointer=null;});
  this.listen(canvas,'lostpointercapture',()=>{this.pointer=null;});
  this.listen(canvas,'contextmenu',e=>e.preventDefault());
  this.listen(global,'resize',()=>this.draw());
  if(typeof global.ResizeObserver==='function'){
   this.observer=new global.ResizeObserver(()=>this.draw());this.observer.observe(canvas);
  }
  this.draw();
 }
 listen(target,name,callback){target.addEventListener(name,callback);this.listeners.push([target,name,callback]);}
 draw(){
  if(this.destroyed||this.pending)return;
  this.pending=global.requestAnimationFrame(t=>{this.pending=0;this.paint(t);});
 }
 zoomBy(factor){
  if(!Number.isFinite(factor)||factor<=0)return;
  this.all=false;this.zoom=clamp(this.zoom*factor,.55,2.8);this.draw();
 }
 focus(){
  this.following=true;this.all=false;this.zoom=1.12;this.pin=null;
  const s=this.getState();this.cam=D.geo(s.x,s.y);this.draw();
 }
 overview(){this.following=false;this.all=true;this.cam={lon:0,lat:4.5};this.draw();}
 setTarget(portOrNull){
  if((this.target?.id||'')!==(portOrNull?.id||'')){this.pin=null;this.guideKey='';}
  this.target=portOrNull||null;this.draw();
 }
 setRoute(route){this.route=route==='west'?'west':'east';this.draw();}
 destroy(){
  this.destroyed=true;if(this.pending)global.cancelAnimationFrame(this.pending);
  this.listeners.forEach(([target,name,fn])=>target.removeEventListener(name,fn));
  this.listeners=[];this.observer?.disconnect();
 }
 pointerDown(e){
  if(this.pointer||e.isPrimary===false)return;
  this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:false};
  try{this.canvas.setPointerCapture(e.pointerId);}catch(_){/* unsupported capture still permits a tap */}
 }
 pointerMove(e){
  const p=this.pointer;if(!p||p.id!==e.pointerId||!this.view)return;
  if(Math.hypot(e.clientX-p.x,e.clientY-p.y)>9)p.moved=true;
  if(p.moved){
   this.following=false;
   if(this.all){this.all=false;this.zoom=.55;}
   this.cam.lon-=(e.clientX-p.lastX)/this.view.pw*this.view.w;
   this.cam.lat+=(e.clientY-p.lastY)/this.view.ph*this.view.h;
   this.draw();
  }
  p.lastX=e.clientX;p.lastY=e.clientY;
 }
 pointerUp(e){
  const p=this.pointer;if(!p||p.id!==e.pointerId)return;
  this.pointer=null;
  try{this.canvas.releasePointerCapture(e.pointerId);}catch(_){}
  if(p.moved||Math.hypot(e.clientX-p.x,e.clientY-p.y)>9)return;
  this.tap(e.clientX,e.clientY);
 }
 tap(clientX,clientY){
  const v=this.view;if(!v||this.readOnly)return;
  const rect=this.canvas.getBoundingClientRect(),px=clientX-rect.left,py=clientY-rect.top;
  const lon=v.l+px/v.pw*v.w,lat=v.t-py/v.ph*v.h;
  const x=Math.floor((lon-D.X0)/D.DX),y=Math.floor((D.Y1-lat)/D.DX),s=this.getState();
  if(Math.abs(x-s.x)+Math.abs(y-s.y)===1){this.onMove(x,y);return;}
  // Finger-friendly hit zones when a sea cell is smaller than a fingertip.
  let closest=null;
  for(const [dx,dy] of [[0,-1],[-1,0],[1,0],[0,1]]){
   const nx=s.x+dx,ny=s.y+dy;if(!D.sea(nx,ny))continue;
   const g=D.geo(nx,ny),sp=this.toScreen(g.lon,g.lat),distance=Math.hypot(sp.x-px,sp.y-py);
   if(distance<Math.min(22,D.DX/v.w*v.pw*.48)&&(!closest||distance<closest.distance))closest={x:nx,y:ny,distance};
  }
  if(closest){this.onMove(closest.x,closest.y);return;}
  const places=D.ports.filter(p=>this.isKnown(p,s));
  const selected=places.find(p=>{
   const g=D.geo(p.x,p.y),sp=this.toScreen(g.lon,g.lat);return Math.hypot(sp.x-px,sp.y-py)<24;
  });
  if(selected){
   this.pin=selected;this.guideKey='';this.draw();
   this.onToast(`${selected.shortName||selected.name}：已探索的地點；請觀察海岸，自己決定航向。`);
  }else this.onToast(D.at(x,y)&&s.revealed?.[D.idx(x,y)]&&!D.sea(x,y)?'這裡是陸地，請從海面繞行。':'黑色海域尚未探索。點按船旁海格，或使用方向按鈕。');
 }
 isKnown(p,s){return this.revealAll||p.id==='lisbon'||s.revealed?.[D.idx(p.x,p.y)]||s.flags?.[p.id];}
 toScreen(lon,lat){const v=this.view;return{x:(lon-v.l)/v.w*v.pw,y:(v.t-lat)/v.h*v.ph};}
 positionAt(t){
  if(!this.motion)return {...this.ship};
  const u=clamp((t-this.motion.start)/this.motion.duration,0,1),f=ease(u);
  return {x:mix(this.motion.from.x,this.motion.to.x,f),y:mix(this.motion.from.y,this.motion.to.y,f)};
 }
 paint(now){
  if(this.destroyed)return;
  const cv=this.canvas,ctx=this.ctx,rect=cv.getBoundingClientRect();
  if(rect.width<2||rect.height<2)return;
  const s=this.getState();if(!s||!Number.isFinite(s.x)||!Number.isFinite(s.y))return;
  if(s.x!==this.lastCell.x||s.y!==this.lastCell.y){
   const from=this.positionAt(now),distance=Math.abs(s.x-this.lastCell.x)+Math.abs(s.y-this.lastCell.y);
   this.motion={from,to:{x:s.x,y:s.y},start:now,duration:distance===1?250:0};
   this.lastCell={x:s.x,y:s.y};
  }
  if(this.motion){
   if(this.motion.duration===0||now-this.motion.start>=this.motion.duration){this.ship={...this.motion.to};this.motion=null;}
   else this.ship=this.positionAt(now);
  }
  const width=rect.width,height=rect.height,dpr=clamp(global.devicePixelRatio||1,1,2);
  const pixelW=Math.round(width*dpr),pixelH=Math.round(height*dpr);
  if(cv.width!==pixelW||cv.height!==pixelH){cv.width=pixelW;cv.height=pixelH;}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const aspect=width/height;
  let visibleLat=this.all?Math.max(99,216/aspect)*1.055:clamp(53/this.zoom,19,105);
  let visibleLon=visibleLat*aspect;
  if(this.following)this.cam=D.geo(this.ship.x,this.ship.y);
  let cx=visibleLon>=216?0:clamp(this.cam.lon,world.l+visibleLon/2,world.r-visibleLon/2);
  let cy=visibleLat>=99?4.5:clamp(this.cam.lat,world.b+visibleLat/2,world.t-visibleLat/2);
  this.cam={lon:cx,lat:cy};
  this.view={l:cx-visibleLon/2,r:cx+visibleLon/2,t:cy+visibleLat/2,b:cy-visibleLat/2,w:visibleLon,h:visibleLat,pw:width,ph:height};
  cv._view=this.view;
  const v=this.view,xy=(lon,lat)=>this.toScreen(lon,lat);
  const stepx=D.DX/v.w*width,stepy=D.DX/v.h*height;
  const seaGradient=ctx.createLinearGradient(0,0,width,height);
  seaGradient.addColorStop(0,'#215c69');seaGradient.addColorStop(.5,'#164550');seaGradient.addColorStop(1,'#0c303e');
  ctx.fillStyle=seaGradient;ctx.fillRect(0,0,width,height);
  // Sparse, deterministic current marks: the chart stays still while the ship moves.
  ctx.save();ctx.strokeStyle='#bad2c4';ctx.globalAlpha=.12;ctx.lineWidth=1;
  for(let k=0;k<370;k++){
   const p=xy(world.l+(k*37.7)%216,world.b+(k*19.1)%99);
   if(p.x<-10||p.x>width+10||p.y<-5||p.y>height+5)continue;
   ctx.beginPath();ctx.moveTo(p.x-5,p.y);ctx.quadraticCurveTo(p.x,p.y-3,p.x+7,p.y);ctx.stroke();
  }ctx.restore();
  // Original coast polygons retained; layered outline produces shallow coastal water.
  for(const poly of D.polys){
   ctx.beginPath();poly.forEach((pt,i)=>{const p=xy(pt[0],pt[1]);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});ctx.closePath();
   ctx.strokeStyle='#5f948b';ctx.lineWidth=8;ctx.globalAlpha=.34;ctx.stroke();ctx.globalAlpha=1;
   const landGradient=ctx.createLinearGradient(0,0,0,height);landGradient.addColorStop(0,'#dfd2a5');landGradient.addColorStop(1,'#a6a780');
   ctx.fillStyle=landGradient;ctx.fill();ctx.strokeStyle='#efd7a1';ctx.lineWidth=1.2;ctx.stroke();
  }
  ctx.save();ctx.strokeStyle='rgba(236,222,176,.13)';ctx.lineWidth=.65;
  for(let lon=Math.ceil(v.l/10)*10;lon<v.r;lon+=10){const x=xy(lon,0).x;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
  for(let lat=Math.ceil(v.b/10)*10;lat<v.t;lat+=10){const y=xy(0,lat).y;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}ctx.restore();
  this.regionNames(s);
  // Opaque mask: every unknown pixel, including outside the chart, is black.
  if(!this.revealAll){
   ctx.save();ctx.fillStyle='#000';ctx.beginPath();ctx.rect(0,0,width,height);
   for(let y=0;y<D.H;y++)for(let x=0;x<D.W;x++)if(s.revealed?.[D.idx(x,y)]){
    const q=xy(D.X0+x*D.DX,D.Y1-y*D.DX);ctx.rect(q.x,q.y,stepx,stepy);
   }
   ctx.fill('evenodd');ctx.restore();
  }
  // The recorded trail, originally _trail, is read from the new state.trail field.
  const trail=Array.isArray(s.trail)?s.trail:[];
  if(trail.length>1){
   ctx.save();ctx.setLineDash([]);ctx.strokeStyle=this.revealAll?'#ffe18c':'rgba(226,195,137,.58)';ctx.lineWidth=this.revealAll?3:1.5;ctx.beginPath();
   trail.forEach((q,i)=>{const g=D.geo(q.x,q.y),p=xy(g.lon,g.lat);if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});ctx.stroke();ctx.restore();
  }

  const occupied=[];
  const priority=p=>(p.id===this.target?.id?100:0)+(['lisbon','cape','caribbean','calicut','malindi'].includes(p.id)?20:0)+(s.discovered.includes(p.id)?5:0);
  const known=D.ports.filter(p=>this.isKnown(p,s)).sort((a,b)=>priority(b)-priority(a));
  known.forEach(p=>this.place(p,s,occupied));
  const shipGeo=D.geo(this.ship.x,this.ship.y),pp=xy(shipGeo.lon,shipGeo.lat);
  // Original hull/mast/sails silhouette, upgraded with a second sail and wake.
  if(this.readOnly&&trail.length){
   ctx.save();ctx.strokeStyle='#092c35';ctx.lineWidth=2;const start=D.geo(trail[0].x,trail[0].y),sp=xy(start.lon,start.lat);
   ctx.fillStyle='#b8f6cc';ctx.beginPath();ctx.arc(sp.x,sp.y,7,0,Math.PI*2);ctx.fill();ctx.stroke();
   ctx.fillStyle='#ffcf66';ctx.beginPath();ctx.moveTo(pp.x,pp.y-10);ctx.lineTo(pp.x+8,pp.y);ctx.lineTo(pp.x,pp.y+10);ctx.lineTo(pp.x-8,pp.y);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
  }else this.drawShip(pp.x,pp.y,clamp(stepx*.9,22,35),!!this.motion);
  if(!this.readOnly)for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
   const nx=s.x+dx,ny=s.y+dy;if(!D.sea(nx,ny))continue;
   const g=D.geo(nx,ny),p=xy(g.lon,g.lat),rad=clamp(stepx*.26,6,13);
   ctx.save();ctx.fillStyle='rgba(236,218,171,.13)';ctx.strokeStyle='rgba(247,222,168,.65)';ctx.lineWidth=1.2;
   ctx.beginPath();ctx.arc(p.x,p.y,rad,0,Math.PI*2);ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.moveTo(p.x+dx*4,p.y+dy*4);
   if(dx){ctx.lineTo(p.x-dx*1,p.y-3);ctx.moveTo(p.x+dx*4,p.y);ctx.lineTo(p.x-dx*1,p.y+3);}else{ctx.lineTo(p.x-3,p.y-dy*1);ctx.moveTo(p.x,p.y+dy*4);ctx.lineTo(p.x+3,p.y-dy*1);}
   ctx.stroke();ctx.restore();
  }
  this.drawCompass(width,height);
  // A subtle frame and scale, with no extra DOM that could cover touch controls.
  ctx.strokeStyle='rgba(206,182,126,.35)';ctx.lineWidth=1;ctx.strokeRect(8.5,8.5,width-17,height-17);
  ctx.fillStyle='rgba(222,226,207,.6)';ctx.font='10px system-ui';ctx.textAlign='right';
  ctx.fillText('示意海圖 · 每格約 3°',width-16,height-17);
  if(this.motion)this.draw();
 }
 regionNames(s){
  const ctx=this.ctx;
  const labels=[['歐 洲',9,46],['非 洲',20,3],['印 度',79,23],['美 洲',-96,37],['大 西 洋',-38,12],['印 度 洋',63,-12],['加 勒 比 海',-72,15]];
  ctx.save();ctx.textAlign='center';ctx.font='600 15px Georgia,serif';ctx.fillStyle='rgba(32,66,64,.43)';
  for(const [text,lon,lat] of labels){const p=this.toScreen(lon,lat);ctx.fillStyle=text.includes('洋')||text.includes('海')?'rgba(191,222,207,.35)':'rgba(32,66,64,.43)';ctx.fillText(text,p.x,p.y);}
  ctx.restore();
 }
 place(p,s,occupied){
  const g=D.geo(p.x,p.y),pos=this.toScreen(g.lon,g.lat),v=this.view;
  if(pos.x<12||pos.y<12||pos.x>v.pw-12||pos.y>v.ph-12)return;
  const ctx=this.ctx,isTarget=p.id===this.target?.id,isPin=p.id===this.pin?.id;
  ctx.save();ctx.translate(pos.x,pos.y);ctx.strokeStyle=isTarget?'#ffdc8f':'#dfd9b4';ctx.fillStyle=isTarget?'#ffdf97':'#b5dbcf';ctx.lineWidth=1.5;
  if(isTarget||isPin){ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.strokeStyle=isTarget?'#d1ad62aa':'#c8efdaaa';ctx.stroke();}
  if(p.type==='goal'||p.type==='landmark'){
   ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(6,0);ctx.lineTo(0,8);ctx.lineTo(-6,0);ctx.closePath();ctx.fill();
  }else{
   // Canvas anchor, not a platform-dependent emoji.
   ctx.beginPath();ctx.arc(0,-5,2,0,Math.PI*2);ctx.moveTo(0,-3);ctx.lineTo(0,7);ctx.moveTo(-5,-1);ctx.lineTo(5,-1);ctx.moveTo(-7,2);ctx.quadraticCurveTo(-5,8,0,8);ctx.quadraticCurveTo(5,8,7,2);ctx.stroke();
  }
  ctx.restore();
  const major=['lisbon','cape','caribbean','calicut','malindi'].includes(p.id);
  if(this.readOnly&&!major&&!s.discovered.includes(p.id))return;
  const reviewNames={cape:'好望角',caribbean:'加勒比海（美洲）',calicut:'卡利庫特（印度）'};
  const label=(this.readOnly&&reviewNames[p.id])||p.shortName||p.name.replace('（印度）',''),fontSize=isTarget||this.readOnly&&major?13:11;
  ctx.font=`${isTarget||major?'700':'500'} ${fontSize}px system-ui`;
  const tw=ctx.measureText(label).width;
  const candidates=[[pos.x,pos.y-19],[pos.x,pos.y+25],[pos.x+tw/2+15,pos.y+5],[pos.x-tw/2-15,pos.y+5],[pos.x,pos.y+42]];
  let placed=null;
  for(const [cx,cy] of candidates){const x=clamp(cx,tw/2+14,v.pw-tw/2-14),y=cy;
   const bounds={l:x-tw/2-4,r:x+tw/2+4,t:y-fontSize-2,b:y+4};
   if(y<25||y>v.ph-20||occupied.some(b=>bounds.l<b.r&&bounds.r>b.l&&bounds.t<b.b&&bounds.b>b.t))continue;
   placed={x,y,bounds};break;
  }
  if(!placed)return;
  const {x,y,bounds}=placed;occupied.push(bounds);ctx.save();ctx.textAlign='center';ctx.lineWidth=4;ctx.strokeStyle='#092a35';ctx.strokeText(label,x,y);ctx.fillStyle=isTarget||this.readOnly&&major?'#ffe4a5':'#d4e2ce';ctx.fillText(label,x,y);ctx.restore();
 }
 drawShip(x,y,size,moving){
  const ctx=this.ctx;ctx.save();ctx.translate(x,y);
  ctx.strokeStyle='rgba(211,230,212,.36)';ctx.lineWidth=1.5;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,size*(.68+i*.13),size*(.65+i*.16),size*.1,0,0,Math.PI);ctx.stroke();}
  ctx.fillStyle='rgba(250,223,159,.10)';ctx.strokeStyle='#e2c28d66';ctx.lineWidth=1;ctx.beginPath();ctx.arc(0,0,size*.88,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.shadowColor='#041e29';ctx.shadowBlur=9;ctx.fillStyle='#644731';ctx.strokeStyle='#e7c896';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(-size*.58,size*.31);ctx.lineTo(size*.54,size*.31);ctx.lineTo(size*.32,size*.6);ctx.lineTo(-size*.4,size*.56);ctx.closePath();ctx.fill();ctx.stroke();ctx.shadowBlur=0;
  ctx.strokeStyle='#d5b17b';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,size*.37);ctx.lineTo(0,-size*.72);ctx.stroke();
  ctx.fillStyle='#fbebc5';ctx.strokeStyle='#a88454';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(-size*.05,-size*.67);ctx.quadraticCurveTo(-size*.48,-size*.27,-size*.45,size*.22);ctx.lineTo(-size*.05,size*.15);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(size*.06,-size*.58);ctx.quadraticCurveTo(size*.48,-size*.16,size*.4,size*.24);ctx.lineTo(size*.06,size*.16);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#c78955';ctx.beginPath();ctx.moveTo(0,-size*.71);ctx.lineTo(size*.34,-size*.62);ctx.lineTo(0,-size*.53);ctx.closePath();ctx.fill();ctx.restore();
 }
 drawCompass(width,height){
  if(width<280||height<260)return;
  const ctx=this.ctx;ctx.save();ctx.translate(42,height-60);ctx.strokeStyle='rgba(220,210,162,.35)';ctx.fillStyle='rgba(224,217,177,.6)';
  ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.stroke();
  for(let n=0;n<8;n++){ctx.save();ctx.rotate(n*Math.PI/4);ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(-3,-7);ctx.lineTo(3,-7);ctx.closePath();ctx.fill();ctx.restore();}
  ctx.font='bold 10px Georgia';ctx.textAlign='center';ctx.fillText('N',0,-29);ctx.restore();
 }
 targetAtEdge(){
  const goal=this.pin||this.target;if(!goal)return;
  const g=D.geo(goal.x,goal.y),p=this.toScreen(g.lon,g.lat),v=this.view;
  if(p.x>=25&&p.x<=v.pw-25&&p.y>=25&&p.y<=v.ph-25)return;
  const cx=v.pw/2,cy=v.ph/2,dx=p.x-cx,dy=p.y-cy;
  const k=Math.min((cx-33)/Math.max(1,Math.abs(dx)),(cy-45)/Math.max(1,Math.abs(dy)));
  const x=cx+dx*k,y=cy+dy*k,angle=Math.atan2(dy,dx),ctx=this.ctx;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle='#f0cf85';ctx.strokeStyle='#102e36';ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-7,-7);ctx.lineTo(-4,0);ctx.lineTo(-7,7);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
  ctx.save();ctx.font='600 11px system-ui';ctx.textAlign='center';ctx.fillStyle='#f1d89c';ctx.strokeStyle='#0b2936';ctx.lineWidth=3;
  const label=goal.shortName||goal.name.replace('（印度）',''),tw=ctx.measureText(label).width,lx=clamp(x,tw/2+15,v.pw-tw/2-15),ly=clamp(y+22,32,v.ph-28);
  ctx.strokeText(label,lx,ly);ctx.fillText(label,lx,ly);ctx.restore();
 }
}
global.VoyageMap=VoyageMap;
})(typeof window!=='undefined'?window:globalThis);
