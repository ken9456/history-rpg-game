/* Classroom revision: textbook terms, illustrated historical theatre, contextual inquiry.
 * Textbook: supplied teacher edition, printed pp. 8–21 (PDF pp. 12–25).
 * Core historical dates checked against sources in content.js. Images are artistic reconstructions.
 */
(function(){
'use strict';
const C=window.VOYAGE_CONTENT;
function terms(v){if(typeof v==='string')return v.replace(/迪亞士/g,'狄亞士').replace(/卡利卡特/g,'卡利庫特').replace(/勝利號/g,'維多利亞號');if(Array.isArray(v))return v.map(terms);if(v&&typeof v==='object')for(const k of Object.keys(v))v[k]=terms(v[k]);return v;}
terms(C);
const hist=(who,year,image,text,note='人物外貌、場景及對話為藝術重構；旁白按史料整理。')=>({speaker:who,expression:'calm',bg:'palace',historical:true,year,image,text,note,label:'真實歷史劇場'});
const dias=[
 hist('dias','1487年 · 葡萄牙出發','assets/history-dias-1.webp','狄亞士率領船隊沿非洲西岸南下。他們要尋找通往東方的新航路，海圖仍有許多未知之處。'),
 hist('dias','1488年 · 非洲南端','assets/history-dias-2.webp','強風把船隊帶離海岸。狄亞士的船隊繞過非洲南端，從大西洋進入印度洋。'),
 hist('dias','1488年 · 好望角','assets/history-dias-3.webp','這次航行沒有抵達印度，卻為後來的船隊留下重要經驗。前人的觀察，成為下一次出發的線索。','地理提醒：好望角在非洲南部，但不是非洲最南點；最南點是厄加勒斯角。')
];
const columbus=[
 hist('columbus','1492年 · 向西尋找亞洲','assets/history-columbus-1.webp','哥倫布得到西班牙王室支持，向西橫渡大西洋。他希望找到亞洲，卻低估了航程的距離。'),
 hist('columbus','1492年 · 加勒比海','assets/history-columbus-2.webp','船員終於看見陸地！船隊抵達加勒比海地區，包括巴哈馬群島，沒有到達原本想去的印度。'),
 hist('columbus','1492年以後 · 接觸與代價','assets/history-columbus-3.webp','課本稱這為「新大陸的發現」。當地早已有原住民社會；其後的殖民、剝削、暴力與疾病，令他們遭受巨大傷害。','「新大陸」反映當時歐洲人的認識；不是當地文明的開始，也不表示美洲此前無人到過。')
];
const gama=[
 hist('gama','1497年 · 從葡萄牙出發','assets/history-gama-1.webp','達伽馬率領船隊出發。他們沿着前人的經驗，繞過好望角，再沿非洲東岸北上。'),
 hist('gama','1498年 · 東非馬林迪','assets/history-gama-2.webp','印度洋早已有商船往來。船隊在馬林迪獲得補給及領航協助，利用當地航海知識前往印度。'),
 hist('gama','1498年 · 印度卡利庫特','assets/history-gama-3.webp','船隊抵達印度卡利庫特，開闢由西歐繞非洲通往印度的新航路。貿易聯繫擴大，後來也伴隨武力爭奪與殖民擴張。','記住：1497年出發，1498年抵達印度。這是歐洲新海路的開拓，不是印度文明的開始。')
];
C.scenes.history_dias={title:'狄亞士 · 風暴後的新航路',historyId:'dias',frames:dias};
C.scenes.history_columbus={title:'哥倫布 · 預想以外的陸地',historyId:'columbus',frames:columbus};
C.scenes.history_gama={title:'達伽馬 · 向熟悉海域的人學習',historyId:'gama',frames:gama};
for(const [key,id,frames] of [['cape','dias',dias],['india','gama',gama],['caribbean','columbus',columbus]]){
 const scene=C.scenes[key],at=scene.frames.findIndex(f=>f.speaker===id);scene.frames.splice(at,1,...frames);scene.historyId=id;
}
C.scenes.magellan={title:'麥哲倫船隊 · 接力走完的世界',historyId:'magellan',frames:[
 hist('magellan','出發以前 · 地圓說','assets/story/magellan-1.webp','麥哲倫希望向西找到香料群島。這不是第一次有人提出地圓說；古希臘已有地球呈球形的認識。','圖中文字校訂：當時不少有學識的人已接受地圓說。環球航行提供實際航行證據，並加深對海洋大小與分布的認識。'),
 hist('magellan','1519年 · 五艘船出航','assets/story/magellan-2.webp','在西班牙王室支持下，麥哲倫率領五艘船出發。這段航程充滿未知，不能把終點當成理所當然。','圖中文字校訂：圖片寫「三百多人」，上傳課本記「265人」，不同名冊口徑有差異。本課重點：1519年、五艘船、由西班牙出航。'),
 hist('magellan','1519–1520年 · 困難與衝突','assets/story/magellan-3.webp','風暴、物資不足和船員衝突接連出現。有船隻損失，也有人離隊。航海成就背後，是沉重的風險與代價。','圖片是故事概括；並非每個困難都能完全解決，更不應把領袖的所有手段都視作正確。'),
 hist('magellan','1520年 · 南美洲南部海峽','assets/story/magellan-4.webp','船隊尋找通道，穿過後來稱為「麥哲倫海峽」的狹長水道，進入另一片大海。','海圖、器物及人物對話是藝術想像，不是逐日航海紀錄。'),
 hist('magellan','1520–1521年 · 太平洋','assets/story/magellan-5.webp','太平洋遠比預想廣闊。長期沒有足夠補給，食物短缺、疾病與疲倦威脅着船員。','「太平洋」這個名稱不表示永遠平靜；圖中前後發生的困難被合併在同一畫面。'),
 hist('magellan','1521年 · 抵達菲律賓','assets/story/magellan-6.webp','船隊抵達菲律賓，嘗試與當地人溝通。翻譯恩里克的語言知識十分重要；當地社會早已有自己的生活與航海網絡。','圖中文字校訂：能溝通是線索，單憑語言不能證明船位。恩里克當時被奴役；這種不平等關係不能視為理所當然。'),
 hist('magellan','1521年 · 麥哲倫身亡','assets/story/magellan-7.webp','麥哲倫介入當地衝突，在菲律賓馬克坦戰死。他本人沒有完成環球航行。','探索求知的精神值得學習；對當地人民施加武力及介入衝突，也必須反思。'),
 hist('elcano','1521–1522年 · 倖存船員繼續','assets/story/magellan-8.webp','倖存者繼續航程。維多利亞號橫渡印度洋，繞過好望角，再從大西洋返回西班牙。','圖中世界路線是概括示意。課本用語：維多利亞號；海洋次序：大西洋 → 太平洋 → 印度洋 → 大西洋。'),
 hist('elcano','1522年 · 首次環球航行完成','assets/story/magellan-9.webp','埃爾卡諾與維多利亞號的倖存船員回到西班牙，完成首次環球航行。這是整支船隊接力付出的成果。','圖像人物校訂：返航者是埃爾卡諾及倖存船員，不是已於1521年身亡的麥哲倫。')
]};
const f=(speaker,text,bg='harbor')=>({speaker,text,bg,expression:'calm'});
const choice=(text,effects,tag)=>({text,effects,tag});
C.scenes.madeira={title:'海上第一站 · 為遠方留一份物資',learn:['aim','motives'],frames:[f('mara','在向西越洋以前，先練習看懂補給。黑色地方是真正未探索的海域。'),f('ines','前方可先沿海往南到加那利群島，再向西。箭頭只提供大方向，船由你掌舵。'),f('leo','為甚麼有人願意花這麼多資源出海？我想知道香料以外的原因。')],choices:[choice('靠岸前，先點算物資',{food:2,knowledge:1},'observe'),choice('向同伴了解遠航的目的',{knowledge:2,morale:1},'inquiry')]};
C.scenes.westCurrent={title:'大西洋 · 看不見陸地的判斷',learn:['technology','navigation','evidence'],frames:[f('ines','已經離開熟悉的海岸。這一段要向西北繼續；前方未探索，別把空白當成安全。','cape'),f('yusuf','羅盤告訴我們方向，航海圖記下前人的經驗。但這兩樣都不能保證我們知道精確位置。','cape'),f('leo','我會記下風向和航行距離。下一次觀察時，就能比較有沒有偏離。','cape')],choices:[choice('整理觀測，輪班檢查補給',{food:-1,knowledge:2,morale:1},'observe'),choice('不再觀察，只顧全速前進',{food:-5,morale:-4},'risk')]};
C.scenes.westBirds={title:'遠洋的線索 · 再多查證一步',learn:['evidence','columbus'],frames:[f('leo','海面有漂木，還有海鳥！這就能確定前面是印度嗎？','caribbean'),f('yusuf','先保留問題。向西北接近海岸，觀察人們的語言、生活和環境，再判斷到達哪裏。','caribbean'),f('ines','最後一段仍要看補給。需要時可以尋找已發現的停泊處。','caribbean')],choices:[choice('分工觀察，核對紀錄',{food:-1,knowledge:1,morale:2},'observe'),choice('現在便宣布抵達印度',{morale:-4,food:-3},'risk')]};
C.scenes.capeverde={title:'沿非洲南下 · 留下退航的港口',learn:['motives','supply'],frames:[f('ines','沿海向南航行，港口是休整的機會。不要看到補給還有一半，就忘記下一段距離。'),f('mara','我們已記下上一個經過的補給點。若物資耗盡，只能花時間退回去重新準備。'),f('leo','我想了解：他們為甚麼願意探索這麼遠？點「了解更多」，一起找答案。')],choices:[choice('點算食物、淡水與備用帆布',{food:2,hull:1},'prepared'),choice('了解王室與商人的不同目的',{knowledge:2},'inquiry')]};
C.scenes.angola={title:'海岸愈來愈陌生',learn:['technology','supply'],frames:[f('yusuf','我們沿非洲海岸繼續向南。每次改航都要留下理由，舊海圖也可能有錯。','cape'),f('mara','檢查船帆吧。多桅帆船提高遠航能力，但仍依靠風力，也會損壞。','cape'),f('ines','向南接近非洲南端時，要準備面對風暴。先修補，通常比事後求援容易。','cape')],choices:[choice('花物資修補破口',{food:-2,hull:4},'repair'),choice('現在不修，趕路要緊',{food:-3,hull:-4},'risk')]};
C.scenes.mozambique={title:'印度洋 · 向熟悉海域的人請教',learn:['indian','navigation'],frames:[f('leo','別的船正在往北走。他們似乎很熟悉這裏的風向。','india'),f('yusuf','對我們陌生的海域，可能是別人熟悉的家鄉。東非、阿拉伯和印度的商人早已有往來。','india'),f('ines','沿海向北，在馬林迪準備橫越印度洋。請把情報來源也記下。','india')],choices:[choice('交流風向與港口資訊',{food:-1,knowledge:2,morale:2},'cooperate'),choice('不聽任何意見，自己猜航向',{food:-5,morale:-3},'risk')]};
C.scenes.ending_ordinary={title:'結局 · 平凡的航海家',frames:[f('ines','這次航程沒有取得重大發現。船隊停下來，整理物資和未完成的海圖。','ending_return'),f('mara','看看哪些決定消耗了補給，哪些時候忽略了同伴。下一次，可以在耗盡以前靠岸。','ending_return'),f('leo','我們把航跡攤開，再看看真正航海家面對過甚麼。今天留下的問題，可以成為下一次出發的準備。','ending_return')]};
// Actual resource costs are reflected in every choice hint, avoiding stale UI numbers.
const names={food:'補給',hull:'船況',morale:'士氣',knowledge:'知識'};
const risk={capeStorm:{food:-4,hull:-6,morale:-5},wind:{food:-5,hull:-3,morale:-2},ration:{food:-3,morale:-6},sail:{hull:-6,food:-3},bird:{food:-5,morale:-2},calm:{food:-4,morale:-5},chart:{food:-5,hull:-3,morale:-2},disease:{food:-3,morale:-6},quarrel:{food:-2,morale:-6},current:{food:-5,morale:-3},rain:{hull:-5,food:-4},reef:{hull:-6,food:-3},hope:{morale:-5,food:-2},light:{food:-5,morale:-3}};
for(const [id,ev] of Object.entries(C.events)){ev.learn=[ev.lesson];if(id==='merchant')ev.learn=['indian','aim'];if(id==='quarrel')ev.learn=['motives','supply'];if(id==='hope')ev.learn=['motives','evidence'];if(id==='wind'||id==='calm')ev.learn=['technology','navigation'];for(const ch of ev.choices)if(ch.method==='risk'&&risk[id])ch.effects=risk[id];}
C.lessons.find(c=>c.id==='aim').textbook='課本第8–9頁：經濟因素';
C.lessons.find(c=>c.id==='motives').fact='開闢新航路的原因包括爭取東方貿易利益、國家競爭、傳播基督宗教，以及發揚探險精神。不同航海家的目的並不完全相同。';
C.lessons.find(c=>c.id==='motives').textbook='課本第8–15頁：經濟、宗教、思想、政治及科技因素（本卡限15至16世紀背景）';
C.lessons.push({id:'technology',title:'羅盤、航海圖與多桅帆船',fact:'羅盤協助判斷方向，航海圖記錄海岸與航路，多桅帆船提高遠航能力。技術改進有利遠航，但風暴、迷航與補給不足仍會發生。',question:'若只有羅盤，你能知道自己距離陸地多遠嗎？',sourceIds:['rmg-navigation'],textbook:'課本第15頁：科技因素',unlock:'any',optional:true});
C.lessons.push({id:'round-earth',title:'地圓說與環球航行',fact:'地圓說在古希臘已出現。麥哲倫船隊於1522年完成首次環球航行，提供實際航行證據，也擴大人們對各大洋的認識；麥哲倫本人已於1521年身亡。',question:'一個已有的學說，可以怎樣獲得新的證據？',sourceIds:['unesco-circumnavigation'],textbook:'課本第11、20頁：地圓說與環球航行',unlock:'magellan',optional:true});
for(const [id,page] of [['dias','16'],['gama','15–16'],['columbus','18–19'],['magellan','19–20'],['elcano','20–21']])C.lessons.find(c=>c.id===id).textbook='課本第'+page+'頁';
C.scenes.prologue.learn=['aim','motives'];C.scenes.canary.learn=['supply','technology'];C.scenes.atlantic.learn=['navigation','supply'];C.scenes.cape.learn=['dias','cape'];C.scenes.india.learn=['gama','indian'];C.scenes.caribbean.learn=['columbus','taino','contact'];C.scenes.magellan.learn=['magellan','elcano','round-earth'];
for(const scene of Object.values(C.scenes))for(const ch of scene.choices||[])ch.hint=Object.entries(ch.effects||{}).map(([k,v])=>names[k]+' '+(v>=0?'+':'')+v).join('；');
for(const ev of Object.values(C.events))for(const ch of ev.choices)ch.hint=Object.entries(ch.effects||{}).map(([k,v])=>names[k]+' '+(v>=0?'+':'')+v).join('；')+(ch.mini?'；互動操作':'')||'資源不變';
})();
