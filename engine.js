/* Voyage RPG v0.10 — state machine. Adapted from original-v3.html resource,
 * reveal, movement, port, event, repair, observation and rescue mechanics. */
(function(root){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const unique=a=>[...new Set(a)];
const MAX={food:20,hull:20,morale:20,knowledge:10};
const BADGES=[
 {id:'first',name:'初出茅廬',desc:'航行第一個海格',symbol:'helm',test:s=>s.step>0},
 {id:'reader',name:'知識探索家',desc:'閱讀6張不同知識卡',symbol:'book',test:s=>s.cards.length>=6},
 {id:'geographer',name:'地理發現家',desc:'發現5個不同地點',symbol:'compass',test:s=>s.discovered.length>=5},
 {id:'resilient',name:'逆境航海家',desc:'解決4類不同的困難',symbol:'shield',test:s=>s.resolved.length>=4},
 {id:'curious',name:'熱切求知',desc:'從事件主動閱讀3張不同的延伸知識卡',symbol:'star',test:s=>s.inquiries.filter(k=>k.startsWith('learn:')).length>=3},
 {id:'reflective',name:'修正航向',desc:'失誤後以新方法補救2次',symbol:'compass',test:s=>s.improvements.length>=2},
 {id:'legend',name:'航海傳奇',desc:'完成任一主要航程',symbol:'ship',test:s=>s.finished&&!s.returned},
 {id:'globe',name:'世界的另一端',desc:'完成環球航行歷史篇章',symbol:'globe',test:s=>!!s.flags.magellan},
];
class VoyageEngine{
 constructor(map,content,onChange=()=>{}){this.map=map;this.content=content;this.onChange=onChange;this.s=null;}
 fresh(name='無名船長',avatar=0,seed=Date.now()){
  const home=this.port('lisbon');
  this.s={version:20,id:'v-'+Date.now().toString(36)+'-'+(seed>>>0).toString(36),name:String(name).trim().slice(0,16)||'無名船長',avatar:0,route:null,x:home.x,y:home.y,step:0,days:1,food:20,hull:18,morale:18,knowledge:0,stage:0,seed:seed>>>0,flags:{},revealed:Array(this.map.W*this.map.H).fill(0),trail:[{x:home.x,y:home.y}],visitedPorts:{},discovered:['lisbon'],cards:[],inquiries:[],eventSeen:[],resolved:[],setbacks:[],improvements:[],decisions:[],log:[],badges:[],sceneRead:[],eventNext:6,lastSafe:{id:'lisbon',x:home.x,y:home.y},lastPassed:{id:'lisbon',x:home.x,y:home.y,trailIndex:0},lastSupplyStep:0,lastSupplyWarning:-20,lastProgressDay:1,historySeen:[],epilogueQueue:[],endReason:null,classroomSeconds:0,classroomLimit:1800,classroomClosed:false,result:null,lastRepair:-20,lastStars:-20,rescues:0,elapsed:0,finished:false,returned:false,ending:null,reflection:['','',''],pending:{type:'scene',key:'prologue',frame:0,after:'depart'},lessonUnlocks:['start','any'],extension:null};
  this.map.reveal(this.s,home.x,home.y);this.log('王室的委託','曙光號的航程為虛構探索。向西或向南出發，由實際航向展開故事；史實劇場會清楚標明人物與年份。');this.commit();return this.s;
 }
 port(id){return this.map.ports.find(p=>p.id===id);}
 rand(){this.s.seed=(Math.imul(1664525,this.s.seed)+1013904223)>>>0;return this.s.seed/4294967296;}
 shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(this.rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
 log(title,text){this.s.log.push({day:this.s.days,title:String(title),body:String(text)});if(this.s.log.length>240)this.s.log.shift();}
 effects(fx){const actual={};for(const k of Object.keys(MAX)){const n=Number(fx?.[k]||0);const old=this.s[k];this.s[k]=clamp(old+n,0,MAX[k]);if(n)actual[k]=this.s[k]-old;}return actual;}
 commit(){const newBadges=[];for(const b of BADGES)if(!this.s.badges.includes(b.id)&&b.test(this.s)){this.s.badges.push(b.id);newBadges.push(b.id);}this.onChange(this.s,newBadges);}
 targets(){return this.s.route==='west'?['madeira','canary','westCurrent','atlantic','westBirds','caribbean']:this.s.route==='east'?['capeverde','angola','cape','mozambique','malindi','calicut']:[];}
 target(){return this.port(this.targets()[Math.min(this.s.stage,this.targets().length-1)])||null;}
 chapterKey(id){return {calicut:'india',madeira:'madeira',capeverde:'capeverde',angola:'angola',mozambique:'mozambique'}[id]||id;}
 notice(kind){this.s.pending={type:'notice',kind};}
 finishNotice(){const p=this.s.pending;if(p?.type!=='notice')return;this.s.pending=null;if(!this.checkArrival()&&!this.checkCrisis())this.checkDeadline();this.commit();}
 heading(){const s=this.s,t=this.target();if(!t)return ['west','south'];const dx=t.x-s.x,dy=t.y-s.y;const out=[];if(dx)out.push(dx<0?'west':'east');if(dy)out.push(dy<0?'north':'south');return out.length?out:['south'];}
 detectRoute(){const s=this.s;if(s.route)return false;const h=this.port('lisbon');let route=null;if(s.x<=h.x-3)route='west';else if(s.y>=h.y+4)route='east';if(!route)return false;s.route=route;s.lastProgressDay=s.days;this.scene(route+'_departure');this.log('航向帶來的新故事',route==='west'?'你實際向西航行，開始橫渡大西洋的故事。':'你實際沿非洲向南航行，開始通往印度的故事。');return true;}
 checkDeadline(){const s=this.s;if(s.finished)return false;if((s.days>35&&!s.flags.cape&&!s.flags.caribbean)||s.days-s.lastProgressDay>35){this.finish(false,'noProgress');return true;}return false;}
 afterSailing(){if(this.checkArrival()||this.checkCrisis()||this.checkDeadline())return;const s=this.s;if((s.step-s.lastSupplyStep>=8||s.food<=6)&&s.step-s.lastSupplyWarning>=6){s.lastSupplyWarning=s.step;this.notice('supply');}}
 tick(seconds){const s=this.s;if(!s||s.classroomClosed||s.pending?.type==='report')return;const n=clamp(Math.floor(seconds),0,10);s.classroomSeconds+=n;if(!s.finished)s.elapsed+=n;if(s.classroomSeconds>=1440&&!s.finished){s.pending=null;this.finish(true,'classroom');return true;}if(s.classroomSeconds>=s.classroomLimit){s.classroomClosed=true;if(!s.finished){s.pending=null;this.finish(true,'classroom');}s.pending={type:'report'};this.log('課堂時間到，保存本次成果','30分鐘課堂模式已結算。未讀史實可在成果頁重看；閱讀時間不影響綜合分數。');this.commit();return true;}return false;}

 scene(key,after='sail',extra={}){this.s.pending={type:'scene',key,frame:0,after,...extra};}
 nextScene(){const p=this.s.pending;if(p?.type!=='scene')return false;const scene=this.content.scenes[p.key];if(!scene)return false;if(p.frame<scene.frames.length-1){p.frame++;this.commit();return true;}if(scene.choices?.length)return false;this.finishScene();return true;}
 skipScene(){const p=this.s.pending;if(p?.type!=='scene'||!this.s.sceneRead.includes(p.key))return false;p.frame=this.content.scenes[p.key].frames.length-1;this.commit();return true;}
 sceneChoice(i){const p=this.s.pending;if(p?.type!=='scene')return;const scene=this.content.scenes[p.key];if(p.frame!==scene.frames.length-1)return;const c=scene.choices?.[i];if(!c)return;this.effects(c.effects);this.s.decisions.push({day:this.s.days,title:scene.title,choice:c.text,method:c.tag||'story'});this.log(scene.title,c.text+(c.hint?'；'+c.hint:''));if(c.tag==='inquiry')this.s.inquiries=unique([...this.s.inquiries,'prologue']);this.finishScene();}
 finishScene(){const p=this.s.pending;if(p?.type!=='scene')return;const s=this.s,scene=this.content.scenes[p.key];s.sceneRead=unique([...s.sceneRead,p.key]);if(scene.historyId)s.historySeen=unique([...s.historySeen,scene.historyId]);s.pending=null;
  if(p.after==='depart')this.notice('bearing');
  else if(p.after==='milestone'){s.stage++;s.flags[p.milestone]=true;s.lastProgressDay=s.days;s.lessonUnlocks=unique([...s.lessonUnlocks,p.key]);if(['cape','india','caribbean'].includes(p.key))s.historySeen=unique([...s.historySeen,{cape:'dias',india:'gama',caribbean:'columbus'}[p.key]]);this.log('完成航程章節',scene.title);if(s.stage>=this.targets().length){this.finish(false);}}
  else if(p.after==='review')s.pending={type:'review'};
  else if(p.after==='report')s.pending={type:'report'};
  else if(p.after==='epilogue')this.nextEpilogue();
  else if(p.after==='extension_start')s.pending={type:'extension',stage:0};
  if(!s.pending&&!s.finished)this.afterSailing();this.commit();
 }
 continueReview(){if(this.s.pending?.type!=='review')return;this.s.epilogueQueue=['dias','columbus','gama'].filter(id=>!this.s.historySeen.includes(id));this.nextEpilogue();this.commit();}
 nextEpilogue(){const id=this.s.epilogueQueue.shift();if(id)this.scene('history_'+id,'epilogue');else this.startExtension();}
 replayHistory(id){if(!this.s.finished||!['dias','columbus','gama','magellan'].includes(id))return;this.scene(id==='magellan'?'magellan':'history_'+id,'report');this.commit();}

 chooseRoute(){return false;}
 move(x,y){const s=this.s;if(s.pending||s.finished)return {ok:false,reason:'先完成眼前的對話或選擇。'};if(!this.map.sea(x,y))return {ok:false,reason:'前方無法通行，請另選船旁海格。'};if(Math.abs(x-s.x)+Math.abs(y-s.y)!==1)return {ok:false,reason:'輕觸相鄰海格，或使用方向按鈕。'};
  s.x=x;s.y=y;s.step++;if(s.step%4===0)s.days++;s.trail.push({x,y});if(s.step%2===0)this.effects({food:-1});if(s.step%6===0)this.effects({morale:-1});if(s.food<=4&&s.step%2===0)this.effects({morale:-1});this.map.reveal(s,x,y);
  for(const p of this.map.ports){if(Math.abs(p.x-x)+Math.abs(p.y-y)<=1){if(!s.discovered.includes(p.id)){s.discovered.push(p.id);this.log('發現地點：'+p.name,p.fact||'');}if(['home','port','goal'].includes(p.type)){const changed=p.id!==s.lastPassed.id;s.lastPassed={id:p.id,x,y,trailIndex:s.trail.length-1};if(changed)this.log('記下退航補給點',p.name+'：即使尚未補給，船隊已經過這個地點。');}}}
  if(!this.checkCrisis()&&!this.checkDeadline()&&!this.detectRoute()&&!this.checkArrival()){
   if((s.step-s.lastSupplyStep>=8||s.food<=6)&&s.step-s.lastSupplyWarning>=6){s.lastSupplyWarning=s.step;this.notice('supply');}
   else if(s.step>=s.eventNext){s.eventNext=s.step+5;const common=['wind','ration','sail','bird','calm','chart','disease','quarrel','current','rain','reef','hope','light'];if(s.route==='east'&&s.stage>2)common.push('merchant');const pool=common.filter(k=>!s.eventSeen.includes(k));if(pool.length)this.startEvent(pool[Math.floor(this.rand()*pool.length)]);}
  }
  this.commit();return {ok:true};
 }

 checkArrival(){const s=this.s;if(!s.route||s.finished||s.stage>=this.targets().length)return false;const p=this.target();if(!p||Math.abs(s.x-p.x)+Math.abs(s.y-p.y)>1)return false;
  // The Cape storm is a full playable event before the landmark story.
  if(p.id==='cape'&&!s.flags.capeChallenge&&this.content.events.capeStorm){s.flags.capeChallenge=true;this.startEvent('capeStorm');return true;}
  const key=this.chapterKey(p.id);
  this.s.discovered=unique([...s.discovered,p.id]);this.effects({knowledge:1,morale:1});this.scene(key,'milestone',{milestone:p.id});return true;
 }
 startEvent(key){if(!this.content.events[key])return;this.s.pending={type:'event',key,inspected:false,order:this.shuffle(this.content.events[key].choices.map((_,i)=>i))};}
 inspectEvent(){const p=this.s.pending;if(p?.type!=='event'||p.inspected)return;p.inspected=true;this.s.inquiries=unique([...this.s.inquiries,'event:'+p.key]);this.log('先查情報：'+this.content.events[p.key].title,this.content.events[p.key].hint);this.commit();}
 chooseEvent(i){const s=this.s,p=s.pending;if(p?.type!=='event')return;const ev=this.content.events[p.key],choice=ev.choices[i];if(!choice)return;
  s.eventSeen=unique([...s.eventSeen,p.key]);const fx=this.effects(choice.effects);s.decisions.push({day:s.days,title:ev.title,choice:choice.text,method:choice.method,key:p.key,inspected:p.inspected});this.log(ev.title,choice.text+'。'+choice.feedback);
  if(choice.success){s.resolved=unique([...s.resolved,p.key]);this.improve(p.key,choice.feedback);}else{s.setbacks=unique([...s.setbacks,p.key]);}
  s.pending={type:'result',title:choice.success?'航向漸漸清晰':'仍有修正的機會',text:choice.feedback,effects:fx,lesson:ev.lesson||null,next:choice.mini?{type:'miniInit',kind:choice.mini,eventKey:p.key}:null};this.commit();
 }
 improve(key,text){if(this.s.setbacks.includes(key)&&!this.s.improvements.includes(key)){this.s.improvements.push(key);this.log('我的改進：'+(this.content.events[key]?.title||key),text);}}
 continueResult(){const p=this.s.pending;if(p?.type!=='result')return;this.s.pending=null;if(!this.checkCrisis()&&!this.checkDeadline()){if(p.next?.type==='miniInit')this.startMini(p.next.kind,p.next.eventKey);else this.afterSailing();}this.commit();}
 nearbyPort(){return this.map.ports.find(p=>['home','port','goal'].includes(p.type)&&Math.abs(p.x-this.s.x)+Math.abs(p.y-this.s.y)<=1);}
 dock(option){const s=this.s,p=this.nearbyPort();if(s.pending||s.finished||!p)return {ok:false,reason:'先航行至港口標記旁邊一格。'};if(s.step-(s.visitedPorts[p.id]??-100)<5)return {ok:false,reason:'此港仍在準備物資；離港航行5格後可再次補給。'};if(![0,1,2].includes(option))return {ok:false};
  const fx=this.effects([{food:12,morale:4},{food:4,hull:8,morale:8},{food:6,knowledge:2,morale:2}][option]);s.days+=option===1?2:1;s.lastSupplyStep=s.step;s.visitedPorts[p.id]=s.step;s.lastSafe={id:p.id,x:p.x,y:p.y};
  if(option===2){s.inquiries=unique([...s.inquiries,'port:'+p.id]);this.improve('chart','請教當地航海員後，你修訂了舊海圖。');this.improve('current','交流觀測方法後，你重新估算船位。');}
  if(option===1){this.improve('sail','你付出休整時間，修復了損壞的船帆。');this.improve('quarrel','港口休息與共同規劃，幫助船員重建合作。');this.improve('hope','短期休整後，船隊重新評估航程。');}
  if(option===0){this.improve('ration','你調整航線進港，補充食物與淡水。');this.improve('disease','你靠岸尋找新鮮食物和照護，沒有只顧趕路。');}
  this.log('在'+p.name+'休整',['補充食物與淡水','修理船隻並讓船員休息','向當地航海員請教'][option]+'。花費'+(option===1?2:1)+'個模擬航海日。');this.checkDeadline();this.commit();return {ok:true,effects:fx};
 }
 checkCrisis(){const s=this.s;if(s.finished)return false;if(s.food<=0&&s.morale<=0){this.finish(false,'supplyMorale');return true;}if(s.hull<=0||s.morale<=0||s.food<=0){s.pending={type:'rescue',cause:s.food<=0?'船上食物與淡水已耗盡，無法繼續遠航':s.hull<=0?'船隻損壞，無法安全前進':'船員已筋疲力盡，需要停航休整'};return true;}return false;}
 rescue(){if(this.s.pending?.type!=='rescue')return;const s=this.s,p=s.lastPassed;const reverse=s.trail.slice(p.trailIndex).reverse();for(const q of reverse.slice(1))s.trail.push({x:q.x,y:q.y,kind:'retreat'});s.x=p.x;s.y=p.y;s.food=12;s.hull=Math.max(s.hull,10);s.morale=Math.max(6,Math.min(20,s.morale+4));s.days+=3;s.rescues++;s.lastSupplyStep=s.step;s.lastPassed={...p,trailIndex:s.trail.length-1};s.pending=null;s.eventNext=Math.max(s.eventNext,s.step+3);this.map.reveal(s,s.x,s.y);this.log('重新規劃，安全再出發','補給耗盡或船隊無法前進。退回上一個經過的補給點「'+this.port(p.id).name+'」，花費3個模擬航海日；完整去程與退航線、知識和決策均保留。');if(!this.checkDeadline())this.checkArrival();this.commit();}
 requestRescue(){if(this.s.pending||this.s.finished||this.s.step===0)return false;this.s.pending={type:'rescue',cause:'主動停止冒險並向同伴求援'};this.commit();return true;}
 learnFromEvent(id){const c=this.content.lessons.find(c=>c.id===id);if(!c)return false;this.s.lessonUnlocks=unique([...this.s.lessonUnlocks,c.unlock]);this.s.inquiries=unique([...this.s.inquiries,'learn:'+id]);const result=this.readCard(id);this.commit();return result;}

 readCard(id){const c=this.content.lessons.find(c=>c.id===id);if(!c||!this.cardAvailable(c))return false;if(!this.s.cards.includes(id)){this.s.cards.push(id);if(c.optional)this.s.inquiries=unique([...this.s.inquiries,'card:'+id]);this.log('閱讀史實：'+c.title,c.fact);this.commit();}return true;}
 cardAvailable(c){return ['start','any'].includes(c.unlock)||this.s.lessonUnlocks.includes(c.unlock)||!!this.s.flags[c.unlock];}
 startMini(kind,eventKey=null){const s=this.s;if(!eventKey&&(s.pending||s.finished))return {ok:false};if(kind==='repair'&&!eventKey){if(s.food<1)return {ok:false,reason:'補給不足，請靠岸或求援。'};if(s.hull>=20)return {ok:false,reason:'船況良好，暫時不需維修。'};if(s.step-s.lastRepair<3)return {ok:false,reason:'請再航行3格，才可再次維修。'};}
  if(kind==='stars'&&!eventKey&&s.step-s.lastStars<7)return {ok:false,reason:'觀測工具仍在校準，航行7格後可再用。'};
  if(!['repair','stars','wind','reef','supplies','cargo','storm'].includes(kind))kind='cargo';
  s.pending={type:'mini',kind,eventKey,round:0,success:0,errors:0,selected:[],order:this.shuffle([0,1,2,3,4,5,6,7]),target:25+Math.floor(this.rand()*40),lane:1,layout:[],alloc:[0,0,0],retry:false};this.prepareRound();this.commit();return {ok:true};
 }
 prepareRound(){const p=this.s.pending;if(p?.type!=='mini')return;if(p.kind==='wind')p.target=Math.floor(this.rand()*4);if(p.kind==='reef'||p.kind==='storm'){p.target=Math.floor(this.rand()*3);p.layout=[0,1,2].map(i=>i===p.target?1:0);}}
 miniInput(value){const p=this.s.pending;if(p?.type!=='mini')return;const kind=p.kind;
  if(kind==='repair'){if(value===p.round){p.round++;p.success++;}else p.errors++;if(p.round===4){this.finishMini(true);return;}}
  if(kind==='stars'){if(Math.abs(Number(value)-p.target)<=5){p.success=1;this.finishMini(true);return;}p.errors++;}
  if(['wind','reef','storm'].includes(kind)){if(value===p.target)p.success++;else p.errors++;p.round++;if(p.round>=4){this.finishMini(p.success>=3);return;}this.prepareRound();}
  if(kind==='supplies'){if(p.selected.includes(value))return;p.selected.push(value);if([0,1,2,3,6].includes(value))p.success++;else p.errors++;if(p.success>=4){this.finishMini(p.errors<=1);return;}}
  if(kind==='cargo'){if(!Array.isArray(value)||value.length!==3)return;p.alloc=value.map(v=>clamp(Math.floor(v),0,6));if(p.alloc.reduce((a,b)=>a+b,0)!==6){p.errors++;this.commit();return;}if(p.alloc.every(v=>v>=1)&&p.alloc[0]>=2&&p.alloc[1]>=2){p.success=1;this.finishMini(true);return;}p.errors++;}
  this.commit();
 }
 finishMini(success,assisted=false){const s=this.s,p=s.pending;if(p?.type!=='mini')return;let fx={};const labels={repair:'修補船帆',stars:'星盤觀測',wind:'借風前進',reef:'避開暗礁',storm:'避開風浪',supplies:'補給整理',cargo:'合作分工'};
  if(p.kind==='repair'){fx={food:-1,hull:success?5:2};s.lastRepair=s.step;s.days+=2;this.improve('sail','你親手按照順序修好船帆，再次起航。');}
  else if(p.kind==='stars'){fx={knowledge:success?1:0};s.lastStars=s.step;s.days++;this.improve('light','你改用觀測星盤，修正只靠猜測的做法。');this.improve('current','你透過觀測重新估算船位。');}
  else if(p.kind==='supplies')fx={food:success?4:2};
  else if(p.kind==='wind')fx=success?{food:2,knowledge:1}:{food:-1};
  else if(p.kind==='cargo')fx=success?{morale:2,hull:1}:{morale:1};
  else fx=success?{hull:1,knowledge:1}:{hull:-2};
  if(assisted){fx=p.kind==='repair'?{food:-1,hull:2}:p.kind==='supplies'?{food:2}:{morale:1};s.days+=2;}
  const actual=this.effects(fx);const key=p.eventKey||p.kind;if(success&&!assisted){s.resolved=unique([...s.resolved,key]);this.improve(key,'你觀察提示並完成'+labels[p.kind]+'，修正了先前的方法。');}else if(!assisted){s.setbacks=unique([...s.setbacks,key]);}
  this.log(labels[p.kind],assisted?'請同伴協助完成，花費2個額外航海日。':success?'你根據觀察與操作完成挑戰。'+(p.errors?'先前的失誤幫助你調整方法。':''):'這次操作造成損耗；你可以先看提示，再次練習。');
  s.pending={type:'result',title:assisted?'與同伴完成工作':success?'完成：'+labels[p.kind]:'先觀察，再修正',text:assisted?'船員完成了基本工作。你花了額外時間，仍能繼續旅程。':success?'你已完成這次船上工作。資源的實際變化如下。':'錯誤不是旅程的終點。選擇「再試一次」，先閱讀提示；完成後可獲得一次改進紀錄。',effects:actual,miniResult:{kind:p.kind,eventKey:p.eventKey,failed:!success&&!assisted},next:null};this.commit();
 }
 retryMini(){const p=this.s.pending;if(p?.type!=='result'||!p.miniResult?.failed)return false;if(this.checkCrisis()){this.commit();return false;}const m=p.miniResult;this.s.days+=2;this.startMini(m.kind,m.eventKey||m.kind);this.s.pending.retry=true;this.commit();return true;}
 finish(returned=false,reason=null){const s=this.s;if(s.finished)return false;const forced=['supplyMorale','noProgress'].includes(reason);const complete=!forced&&!returned&&!!s.route&&s.stage>=this.targets().length;if(!forced&&!returned&&!complete)return false;if(returned&&!reason&&(s.pending||s.step===0))return false;
  s.finished=true;s.returned=!complete;s.endReason=reason;s.pending=null;s.ending=forced?'ordinary':returned?'return':s.cards.length>=8&&s.resolved.length>=4?'legend':s.improvements.length>=2&&s.setbacks.length>=2?'scholar':'captain';
  s.result={cards:[...s.cards],places:[...s.discovered],resolved:[...s.resolved],improvements:[...s.improvements],days:s.days,steps:s.step,completed:complete};this.log('航程結局',this.endingName());this.scene('ending_'+s.ending,'review');this.commit();return true;
 }
 endingName(){return {legend:'傳奇探索家',return:'勇敢的歸航者',scholar:'求知的航海家',captain:'遠航船長',ordinary:'平凡的航海家'}[this.s.ending]||'自由探索中';}
 score(){const s=this.s,r=s.result;const cards=r?r.cards:s.cards,places=r?r.places:s.discovered,resolved=r?r.resolved:s.resolved,improvements=r?r.improvements:s.improvements;return Math.min(100,(s.finished&&!s.returned?30:s.finished?15:0)+Math.min(25,cards.length*2)+Math.min(20,places.length*2)+Math.min(15,resolved.length*3)+Math.min(10,improvements.length*5));}

 startExtension(){if(!this.s.finished||this.s.pending?.type==='scene')return;this.s.extension={supply:8,crew:8,choices:[]};this.scene('magellan','extension_start');this.commit();}
 extensionChoice(i){const s=this.s,p=s.pending;if(p?.type!=='extension'||![0,1].includes(i))return;const e=s.extension;if(p.stage===0){if(i===0){e.supply-=2;e.crew-=1;}else{e.supply-=1;e.crew-=3;}e.choices.push(i===0?'先觀察海峽，分段探索':'為節省補給冒險加速');p.stage=1;}else{if(i===0){e.supply-=2;e.crew+=1;}else{e.supply-=1;e.crew-=2;}e.choices.push(i===0?'重新分配食物，照顧疲倦同伴':'維持趕路，承受更大疲勞');s.flags.magellan=true;s.historySeen=unique([...s.historySeen,'magellan']);s.lessonUnlocks=unique([...s.lessonUnlocks,'magellan']);s.pending={type:'extensionReport'};this.log('環球篇：航海抉擇',e.choices.join('；')+'。資源數字屬模擬，不能改變歷史人物的命運。');}this.commit();}
 closeExtension(){if(['extensionReport'].includes(this.s.pending?.type)){this.s.pending={type:'report'};this.commit();}}
 serialize(){return JSON.stringify({format:'unknown-seas-rpg',version:20,state:this.s});}
 load(input){const raw=typeof input==='string'?JSON.parse(input):input;const s=this.migrate(raw?.format==='unknown-seas-rpg'?raw.state:raw);this.validate(s);this.s=JSON.parse(JSON.stringify(s));this.commit();return this.s;}
 migrate(input){
  const s=JSON.parse(JSON.stringify(input));if(s?.version!==10)return s;
  s.version=20;s.avatar=0;const mapping=s.route==='west'?[1,3,5,6]:[2,4,5,6];s.stage=s.route?mapping[s.stage]:0;s.days=Math.max(1,Math.ceil(s.days/4));s.lastSupplyStep=0;s.lastSupplyWarning=-20;s.lastProgressDay=s.days;s.historySeen=[];s.epilogueQueue=[];s.endReason=null;s.classroomSeconds=Math.min(s.elapsed,1700);s.classroomLimit=1800;s.classroomClosed=false;s.result=null;
  const q=s.lastSafe;s.lastPassed={id:q.id,x:q.x,y:q.y,trailIndex:0};const i=s.trail.findIndex(v=>v.x===q.x&&v.y===q.y);if(i>=0)s.lastPassed.trailIndex=i;
  if(s.pending?.type==='route')s.pending={type:'notice',kind:'bearing'};if(s.pending?.after==='route')s.pending.after='depart';
  if(s.finished)s.result={cards:[...s.cards],places:[...s.discovered],resolved:[...s.resolved],improvements:[...s.improvements],days:s.days,steps:s.step,completed:!s.returned};
  return s;
 }
 validate(s){

  const bad=()=>{throw new Error('存檔格式不完整或版本不符。請匯入本遊戲匯出的 JSON 存檔。');};
  const int=(n,a=0,b=1000000)=>Number.isInteger(n)&&n>=a&&n<=b;
  const text=(v,n=200)=>typeof v==='string'&&v.length<=n;
  const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
  const minis=['repair','stars','wind','reef','supplies','cargo','storm'];
  const eventKey=k=>k===null||minis.includes(k)||Object.hasOwnProperty.call(this.content.events,k);
  const strings=(a,max=500)=>Array.isArray(a)&&a.length<=max&&a.every(v=>text(v))&&unique(a).length===a.length;
  const listOf=(a,allowed)=>strings(a)&&a.every(v=>allowed.includes(v));
  const permutation=(a,n)=>Array.isArray(a)&&a.length===n&&unique(a).length===n&&a.every(v=>int(v,0,n-1));
  const seaPoint=p=>obj(p)&&int(p.x,0,this.map.W-1)&&int(p.y,0,this.map.H-1)&&this.map.sea(p.x,p.y);
  if(!obj(s)||s.version!==20||!text(s.name,16)||!s.name.trim()||!text(s.id,100)||!s.id||![0,1].includes(s.avatar))bad();
  for(const k of ['step','days','seed','stage','rescues','eventNext','elapsed'])if(!int(s[k],0,k==='seed'?4294967295:1000000))bad();
  if(!seaPoint(s)||s.step>100000||s.days<1||s.stage>6||!int(s.lastRepair,-20,s.step)||!int(s.lastStars,-20,s.step))bad();
  for(const [k,m] of Object.entries(MAX))if(!int(s[k],0,m))bad();
  if(![null,'east','west'].includes(s.route)||!Array.isArray(s.revealed)||s.revealed.length!==this.map.W*this.map.H||s.revealed.some(v=>v!==0&&v!==1))bad();
  for(const k of ['inquiries','eventSeen','resolved','setbacks','improvements','lessonUnlocks'])if(!strings(s[k]))bad();
  const eventKeys=Object.keys(this.content.events);
  if(!s.eventSeen.every(k=>eventKeys.includes(k))||!s.resolved.every(eventKey)||!s.setbacks.every(eventKey)||!s.improvements.every(k=>s.setbacks.includes(k)))bad();
  if(!listOf(s.cards,this.content.lessons.map(c=>c.id))||!listOf(s.badges,BADGES.map(b=>b.id))||!listOf(s.discovered,this.map.ports.map(p=>p.id))||!listOf(s.sceneRead,Object.keys(this.content.scenes)))bad();
  if(!Array.isArray(s.log)||s.log.length>240||s.log.some(v=>!obj(v)||!text(v.title,300)||!text(v.body,4000)||!int(v.day,1)))bad();
  if(!Array.isArray(s.decisions)||s.decisions.length>1000||s.decisions.some(v=>!obj(v)||!text(v.title,300)||!text(v.choice,1000)||!int(v.day,1)))bad();
  if(!Array.isArray(s.trail)||!s.trail.length||s.trail.length>5000||s.trail.some(v=>!seaPoint(v)))bad();
  if(!obj(s.flags)||Object.entries(s.flags).some(([k,v])=>!['capeChallenge','cape','malindi','calicut','canary','atlantic','caribbean','magellan','madeira','westCurrent','westBirds','capeverde','angola','mozambique'].includes(k)||typeof v!=='boolean'))bad();
  if(!obj(s.visitedPorts)||Object.entries(s.visitedPorts).some(([k,v])=>!this.port(k)||!int(v,0,s.step)))bad();
  const safe=s.lastSafe&&this.port(s.lastSafe.id);
  if(!safe||!['home','port','goal'].includes(safe.type)||s.lastSafe.x!==safe.x||s.lastSafe.y!==safe.y||!Array.isArray(s.reflection)||s.reflection.length!==3||s.reflection.some(v=>!text(v,2000)))bad();
  if(typeof s.finished!=='boolean'||typeof s.returned!=='boolean'||![null,'legend','return','scholar','captain','ordinary'].includes(s.ending))bad();
  if(s.finished?(!s.ending||(s.returned?!['return','ordinary'].includes(s.ending)||(s.stage>=6&&s.ending!=='ordinary'):s.stage!==6||['return','ordinary'].includes(s.ending))):(s.ending!==null||s.returned||s.stage===6))bad();
  if(s.route===null&&s.stage!==0)bad();
  if(!int(s.lastSupplyStep,0,s.step)||!int(s.lastSupplyWarning,-20,s.step)||!int(s.lastProgressDay,1,s.days)||!int(s.classroomSeconds,0,100000)||s.classroomLimit!==1800||typeof s.classroomClosed!=='boolean')bad();
  if(!listOf(s.historySeen,['dias','columbus','gama','magellan'])||!listOf(s.epilogueQueue,['dias','columbus','gama'])||![null,'supplyMorale','noProgress','classroom'].includes(s.endReason))bad();
  const passed=s.lastPassed&&this.port(s.lastPassed.id);if(!passed||!['home','port','goal'].includes(passed.type)||!seaPoint(s.lastPassed)||Math.abs(passed.x-s.lastPassed.x)+Math.abs(passed.y-s.lastPassed.y)>1||!int(s.lastPassed.trailIndex,0,s.trail.length-1))bad();
  if(s.result!==null){const r=s.result;if(!obj(r)||!listOf(r.cards,this.content.lessons.map(c=>c.id))||!listOf(r.places,this.map.ports.map(p=>p.id))||!strings(r.resolved)||!r.resolved.every(eventKey)||!strings(r.improvements)||!r.improvements.every(k=>r.resolved.includes(k)||s.improvements.includes(k))||!int(r.days,1,s.days)||!int(r.steps,0,s.step)||typeof r.completed!=='boolean'||r.completed===s.returned)bad();}else if(s.finished)bad();
  if(s.extension!==null&&(!obj(s.extension)||!int(s.extension.supply,0,8)||!int(s.extension.crew,0,8)||!Array.isArray(s.extension.choices)||s.extension.choices.length>2||s.extension.choices.some(v=>!text(v,200))))bad();
  const p=s.pending;
  if(p!==null){
   if(!obj(p)||!['scene','notice','review','event','mini','result','rescue','report','extension','extensionReport'].includes(p.type))bad();
   if(p.type==='scene'){
    if(!Object.hasOwnProperty.call(this.content.scenes,p.key)||!int(p.frame,0,this.content.scenes[p.key].frames.length-1))bad();
    const milestones=s.route==='west'?['madeira','canary','westCurrent','atlantic','westBirds','caribbean']:['capeverde','angola','cape','mozambique','malindi','calicut'];
    const key={calicut:'india'}[p.milestone]||p.milestone;
    if(p.after==='milestone'){if(s.finished||!s.route||p.milestone!==milestones[s.stage]||p.key!==key)bad();}
    else if(p.after==='depart'){if(p.key!=='prologue'||s.route!==null||s.finished)bad();}
    else if(p.after==='sail'){if(p.key!==s.route+'_departure'||s.finished)bad();}
    else if(p.after==='review'){if(!s.finished||p.key!=='ending_'+s.ending)bad();}
    else if(p.after==='epilogue'){if(!s.finished||!['history_dias','history_columbus','history_gama'].includes(p.key))bad();}
    else if(p.after==='report'){if(!s.finished)bad();}
    else if(p.after==='extension_start'){if(!s.finished||p.key!=='magellan'||!s.extension)bad();}
    else bad();
   }
   if(p.type==='notice'&&(s.finished||!['bearing','supply'].includes(p.kind)))bad();
   if(p.type==='review'&&!s.finished)bad();
   if(p.type==='event'&&(!Object.hasOwnProperty.call(this.content.events,p.key)||!permutation(p.order,this.content.events[p.key].choices.length)||typeof p.inspected!=='boolean'))bad();
   if(p.type==='mini'){
    if(!minis.includes(p.kind)||!int(p.round,0,3)||!int(p.success,0,8)||!int(p.errors,0,100000)||!eventKey(p.eventKey)||!permutation(p.order,8)||!Array.isArray(p.selected)||p.selected.length>8||unique(p.selected).length!==p.selected.length||p.selected.some(v=>!int(v,0,7)))bad();
    if(!Array.isArray(p.alloc)||p.alloc.length!==3||p.alloc.some(v=>!int(v,0,6))||p.alloc.reduce((a,b)=>a+b,0)>6||typeof p.retry!=='boolean'||!int(p.lane,0,2))bad();
    if(['reef','storm'].includes(p.kind)){if(!int(p.target,0,2)||!Array.isArray(p.layout)||p.layout.length!==3||p.layout.some((v,i)=>v!==(i===p.target?1:0)))bad();}
    else if(!int(p.target,p.kind==='wind'?0:25,p.kind==='wind'?3:64)||!Array.isArray(p.layout)||p.layout.length!==0)bad();
   }
   if(p.type==='result'){
    if(!text(p.title,300)||!text(p.text,4000)||!obj(p.effects)||Object.entries(p.effects).some(([k,v])=>!Object.hasOwnProperty.call(MAX,k)||!int(v,-20,20)))bad();
    if(p.next!==null&&(!obj(p.next)||p.next.type!=='miniInit'||!minis.includes(p.next.kind)||!eventKey(p.next.eventKey)))bad();
    if(p.miniResult!==undefined&&(!obj(p.miniResult)||!minis.includes(p.miniResult.kind)||!eventKey(p.miniResult.eventKey)||typeof p.miniResult.failed!=='boolean'))bad();
   }
   if(p.type==='rescue'&&!text(p.cause,300))bad();
   if(['event','mini','result','rescue'].includes(p.type)&&s.finished)bad();
   if(['report','extension','extensionReport'].includes(p.type)&&!s.finished)bad();
   if(['extension','extensionReport'].includes(p.type)&&!s.extension)bad();
   if(p.type==='extension'&&(!int(p.stage,0,1)||s.extension.choices.length!==p.stage))bad();
   if(p.type==='extensionReport'&&s.extension.choices.length!==2)bad();
  }else if(s.finished)bad();
  return true;
 }
}
VoyageEngine.MAX=MAX;VoyageEngine.BADGES=BADGES;root.VoyageEngine=VoyageEngine;
})(typeof window!=='undefined'?window:globalThis);
