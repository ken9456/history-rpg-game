/* Unknown Seas: Legends of the Navigators — story and learning data.
 * Original fiction. Historical recaps are paraphrases, never invented quotations.
 * Sources checked 2026-10-28. See docs/HISTORY_SOURCES.md.
 */
'use strict';
window.VOYAGE_CONTENT = {
  characters: {
    official: {name:'杜阿爾特',role:'王室委託官 · 虛構',portrait:0,atlas:'characters'},
    ines: {name:'伊妮絲',role:'副船長 · 虛構',portrait:1,atlas:'characters'},
    leo: {name:'里奧',role:'年輕船員 · 虛構',portrait:2,atlas:'characters'},
    yusuf: {name:'尤素夫',role:'航海知識導師 · 虛構',portrait:3,atlas:'characters'},
    mara: {name:'瑪拉',role:'船隊醫師兼工匠 · 虛構',portrait:4,atlas:'characters'},
    hero: {name:'年輕航海家',role:'玩家角色 · 虛構',portrait:5,atlas:'characters'},
    dias: {name:'迪亞士',role:'歷史回顧 · 旁白',portrait:0,atlas:'history'},
    columbus: {name:'哥倫布',role:'歷史回顧 · 旁白',portrait:1,atlas:'history'},
    gama: {name:'達伽馬',role:'歷史回顧 · 旁白',portrait:2,atlas:'history'},
    magellan: {name:'麥哲倫',role:'歷史回顧 · 旁白',portrait:3,atlas:'history'},
    elcano: {name:'埃爾卡諾與倖存船員',role:'歷史回顧 · 旁白',portrait:null,atlas:null}
  },
  sources: [
    {id:'dhm-voyages',title:'德國歷史博物館：Voyages of Discovery',url:'https://www.dhm.de/archiv/ausstellungen/neue-welten/en/entdeckungsreisen.html',notes:'1488迪亞士、1492哥倫布、1498達伽馬及1519–1522船隊航程。'},
    {id:'dhm-motives',title:'德國歷史博物館：Christians and spices',url:'https://www.dhm.de/archiv/ausstellungen/neue-welten/en/prolog.html',notes:'商業、宗教及尋找新航路的動機；1498年抵達卡利卡特。'},
    {id:'loc-taino',title:'美國國會圖書館：Columbus and the Taíno',url:'https://www.loc.gov/exhibits/exploring-the-early-americas/columbus-and-the-taino',notes:'1492年加勒比海接觸、泰諾社會、哥倫布對亞洲的誤判及殖民影響。'},
    {id:'unesco-circumnavigation',title:'UNESCO：首次環球航行文獻（1519–1522）',url:'https://www.unesco.org/en/memory-world/first-voyage-circumnavigation-fernao-de-magalhaes-and-juan-sebastian-elcano-1519-1522',notes:'麥哲倫發起航程，由埃爾卡諾率倖存船員完成；對地理知識的影響。'},
    {id:'nhcp-mactan',title:'菲律賓國家歷史委員會：Mactan',url:'https://philhistoricsites.nhcp.gov.ph/registry_database/mactan-ruta-ng-ekspedisyon-magallanes-elcano-sa-pilipinas/',notes:'1521年4月27日麥哲倫於馬克坦戰死；當地政治與拉普拉普抵抗。'},
    {id:'nhcp-return',title:'菲律賓歷史地點登記：Ferdinand Magellan’s Death',url:'https://philhistoricsites.nhcp.gov.ph/registry_database/ferdinand-magellans-death/',notes:'交叉核對1521年死亡、1522年9月6日勝利號返抵西班牙。只採此頁可交叉核對的核心日期。'},
    {id:'smithsonian-indian',title:'史密森尼國立亞洲藝術博物館：Encompassing the Globe',url:'https://asia.si.edu/whats-on/exhibitions/encompassing-the-globe-portugal-and-the-world-in-the-16th-and-17th-centuries/',notes:'印度洋既有貿易網絡、葡萄牙擴張及武力。'},
    {id:'kenya-malindi',title:'肯尼亞國家博物館：Vasco Da Gama Pillar',url:'https://nmk.go.ke/vasco-da-gama-pillar/',notes:'馬林迪與補給、領航支援。領航員身分有爭議，本遊戲不採此頁的姓名指認。'},
    {id:'rmg-navigation',title:'皇家格林尼治博物館：航海教學資源',url:'https://www.rmg.co.uk/file/20586/download?token=MzYhSd-g',notes:'星盤、緯度及當時海上定位的限制。資源以較後期德雷克為主，本遊戲僅採通用儀器原理。'},
    {id:'nhs-scurvy',title:'英國國民保健署：Scurvy',url:'https://www.nhs.uk/conditions/scurvy/',notes:'今日醫學對維他命C不足及壞血病的解釋，不當作當時船員已知的知識。'},
    {id:'portugal-dias',title:'葡萄牙海軍：航海歷史',url:'https://www.marinha.pt/en/a-marinha/historia/servir-portugal/Pages/default.aspx',notes:'迪亞士1488年繞非洲南端；達伽馬1497年出發。僅採已交叉核對的核心史實。'}
  ],
  lessons: [
    {id:'aim',title:'香料為何吸引遠航？',fact:'歐洲對香料等亞洲商品有需求。葡萄牙希望尋找海路，減少對既有轉運與中介的依賴，爭取利潤；這不等於所有東方貿易被單一群體完全壟斷。',question:'價格昂貴，會令商人想改變哪一段貿易過程？',sourceIds:['dhm-motives'],unlock:'start',optional:false},
    {id:'motives',title:'遠航不只為了賺錢',fact:'商業利益、王室競爭、擴張勢力與傳播基督宗教，都是歐洲海外探索的動機。不同國家和人物的目的並不完全相同。',question:'王室、商人與傳教者可能各自期待甚麼？',sourceIds:['dhm-motives','smithsonian-indian'],unlock:'start',optional:false},
    {id:'dias',title:'1488：迪亞士繞過非洲南端',fact:'迪亞士於1488年繞過非洲南端，證明可由大西洋進入印度洋。他沒有在這次航程到達印度；其經驗成為後來航行的基礎。',question:'前人的紀錄怎樣幫助下一位探索者？',sourceIds:['dhm-voyages','portugal-dias'],unlock:'cape',optional:false},
    {id:'cape',title:'好望角不是一條捷徑',fact:'非洲南端的海況與風向可帶來危險。遊戲把等候、修理和改航化為資源選擇；具體事件與損耗數字屬模擬，不是某次航程的逐日重現。',question:'改變路線是否一定代表放棄？',sourceIds:['portugal-dias'],unlock:'cape',optional:false},
    {id:'gama',title:'1498：達伽馬抵達印度',fact:'達伽馬於1497年從葡萄牙出發，繞過非洲南端，於1498年抵達印度西岸的卡利卡特。這是海路聯繫的開拓，不是印度文明的開始。',question:'為甚麼「抵達印度」比「發現印度」更準確？',sourceIds:['dhm-voyages','dhm-motives'],unlock:'india',optional:false},
    {id:'indian',title:'印度洋早已有航海網絡',fact:'東非、阿拉伯、南亞及東南亞之間，早已有商船、港口與知識交流。歐洲船隊到來以前，這片海域並不空白。',question:'當地航海者的知識有甚麼價值？',sourceIds:['smithsonian-indian'],unlock:'malindi',optional:false},
    {id:'malindi',title:'馬林迪：向他人學習',fact:'達伽馬船隊在1498年於馬林迪獲得補給與領航協助，之後前往印度。領航員身分存在史學爭議，本遊戲不把某個姓名寫成定論。',question:'承認自己不知道，怎樣幫助航行？',sourceIds:['kenya-malindi'],unlock:'malindi',optional:false},
    {id:'columbus',title:'1492：哥倫布抵達加勒比海',fact:'哥倫布受西班牙王室支持向西尋找亞洲航路，於1492年抵達加勒比海地區，包括巴哈馬群島。他沒有在這次航程抵達印度。',question:'原本的目標與實際抵達的地方有何不同？',sourceIds:['loc-taino','dhm-voyages'],unlock:'canary',optional:false},
    {id:'taino',title:'海圖空白，不等於沒有人',fact:'加勒比海的泰諾人早已有農業、航海、政治與文化生活。哥倫布的到來是不同社會之間的接觸，不是當地歷史的起點。',question:'一張歐洲海圖可能沒有記下誰的知識？',sourceIds:['loc-taino'],unlock:'caribbean',optional:true},
    {id:'contact',title:'接觸，也有沉重代價',fact:'跨海聯繫促進商品與知識交流，也伴隨殖民、剝削、暴力與疾病傳播。美洲原住民遭受巨大傷害；其社群與文化並沒有因此完全消失。',question:'同一次接觸，不同群體會有相同感受嗎？',sourceIds:['loc-taino','smithsonian-indian'],unlock:'caribbean',optional:false},
    {id:'magellan',title:'1519：麥哲倫船隊出航',fact:'麥哲倫率領效力西班牙的船隊於1519年出發，尋找向西通往香料群島的航路。船隊經南美洲南部海峽，橫渡太平洋。',question:'向西航行與繞非洲航行的方向有何分別？',sourceIds:['unesco-circumnavigation'],unlock:'magellan',optional:false},
    {id:'mactan',title:'1521：麥哲倫於菲律賓身亡',fact:'1521年，麥哲倫介入當地權力衝突，在馬克坦與拉普拉普一方的戰鬥中身亡。探索成就不能抹去他對當地社會施加武力的問題。',question:'探索知識與支配他人，界線在哪裏？',sourceIds:['nhcp-mactan'],unlock:'magellan',optional:false},
    {id:'elcano',title:'1522：誰完成環球航行？',fact:'1522年，埃爾卡諾率領勝利號上的倖存船員回到西班牙，完成首次環球航行。麥哲倫本人沒有完成全程。這也是許多船員共同付出的成果。',question:'我們記住領袖時，是否也記住同行者？',sourceIds:['unesco-circumnavigation','nhcp-return'],unlock:'magellan',optional:false},
    {id:'navigation',title:'星盤能告訴你甚麼？',fact:'航海星盤量度太陽或星體的高度，配合計算可估計緯度。羅盤指示方向，但不能單靠它知道精確位置；當時海上經度判定仍很困難。',question:'為甚麼要把不同觀察放在一起判斷？',sourceIds:['rmg-navigation'],unlock:'any',optional:true},
    {id:'supply',title:'船艙也是航程的一部分',fact:'食物、淡水、帆布與修船材料都要預先安排。遊戲把食物及淡水合併為「補給」；固定補給商船、數字效果和緊急救援屬友善玩法。',question:'你會為未知風險預留多少物資？',sourceIds:['kenya-malindi'],unlock:'start',optional:true},
    {id:'scurvy',title:'用今天的知識理解疾病',fact:'長期缺乏維他命C可引致壞血病，出現疲倦或牙齦問題；它不是經接觸傳染的疾病。這是今日醫學解釋，不能假設當時船員已明白病因。',question:'歷史人物作決定時，與你擁有相同資訊嗎？',sourceIds:['nhs-scurvy'],unlock:'any',optional:true},
    {id:'evidence',title:'地圖也需要修訂',fact:'早期定位受工具、海況和紀錄限制。遊戲中可以比較海圖、觀察風向及請教船員；這些是學習方法的模擬，不是某位航海家的原話。',question:'若新觀察與舊地圖不符，你會怎樣查證？',sourceIds:['rmg-navigation'],unlock:'any',optional:true},
    {id:'empire',title:'航路背後的權力',fact:'葡萄牙其後在印度洋建立港口據點，並以武力爭奪貿易控制。既有商人與社會會合作，也會抵抗；海上擴張並非人人受惠。',question:'商業成功是否足以證明所有手段都合理？',sourceIds:['smithsonian-indian'],unlock:'india',optional:true},
    {id:'history-fiction',title:'史實、藝術與遊戲模擬',fact:'四位航海家的核心年份與航路有史料依據。玩家、同伴、對話、海格、資源和補給安排是虛構或模擬；人物插畫不是歷史照片。',question:'你能各舉一項史實和模擬安排嗎？',sourceIds:[],unlock:'start',optional:false}
  ],
  scenes: {
    prologue: {title:'序章 · 海圖缺失的一角',frames:[
      {speaker:'official',expression:'calm',bg:'palace',text:'這張海圖，少了一角。前任船長回來後，只留下「先問，再航行」五個字。',label:'虛構故事 · 15至16世紀航海時代背景'},
      {speaker:'official',expression:'resolve',bg:'palace',text:'來自東方的香料，在歐洲很受歡迎。經過多次轉運，商人想另闢海路。'},
      {speaker:'yusuf',expression:'calm',bg:'palace',text:'遠航也牽涉國家競爭、宗教與權力。這份委託，並不只有金錢。'},
      {speaker:'official',expression:'calm',bg:'palace',text:'我要你帶回能查證的海圖。沒有證據的猜測，不能換成王室的印章。'},
      {speaker:'ines',expression:'resolve',bg:'harbor',text:'我是伊妮絲。我會提醒你風險，也會陪你找辦法。船員的安全，不能押在運氣上。'},
      {speaker:'leo',expression:'resolve',bg:'harbor',text:'我是里奧！海圖的空白，究竟藏着甚麼？我帶了筆，想把每個新問題記下來。'},
      {speaker:'mara',expression:'calm',bg:'harbor',text:'我是瑪拉。遇到破帆或病員，先來找我。修補和休息，都要花時間與物資。'},
      {speaker:'official',expression:'resolve',bg:'palace',text:'年輕航海家，你願意帶領「曙光號」，替這張海圖寫下下一頁嗎？',label:'玩家航程為虛構；真實航程另以「歷史回顧」標示'}
    ],choices:[
      {text:'我想看看未知的世界！',hint:'帶着好奇出發：士氣 +1',effects:{morale:1},tag:'curious'},
      {text:'我願意，先讓我查閱航路情報。',hint:'謹慎準備：知識 +1',effects:{knowledge:1},tag:'inquiry'},
      {text:'我有點害怕，但想和同伴一起試。',hint:'坦誠合作：船況 +1',effects:{hull:1},tag:'together'}
    ]},
    east_departure: {title:'東方航線 · 沿着前人的線索',frames:[
      {speaker:'yusuf',expression:'calm',bg:'harbor',text:'東方航線先沿非洲向南，再繞過南端進入印度洋。真正的航路，是逐步探索出來的。'},
      {speaker:'ines',expression:'calm',bg:'harbor',text:'第一個大目標是好望角。途中可以靠岸，也可以探索外海；不要把補給用到最後一刻。'},
      {speaker:'leo',expression:'resolve',bg:'harbor',text:'舊日誌的第一頁寫着：「勇敢的人，也需要別人的經驗。」這會是缺角的線索嗎？'},
      {speaker:'yusuf',expression:'resolve',bg:'harbor',text:'我們會在途中翻閱迪亞士與達伽馬的歷史紀錄。他們的年份和航程，要分開記。'},
      {speaker:'hero',expression:'resolve',bg:'harbor',text:'曙光號，啟航！先航行一格，再留意地圖和補給。'}
    ]},
    west_departure: {title:'西方航線 · 水平線的另一邊',frames:[
      {speaker:'yusuf',expression:'calm',bg:'harbor',text:'西方航線經加那利群島，橫越大西洋。我們參考哥倫布1492年的航路，進行虛構探索。'},
      {speaker:'ines',expression:'resolve',bg:'harbor',text:'離開群島後，海上距離很長。先準備補給，再衡量每次偏航。'},
      {speaker:'leo',expression:'calm',bg:'harbor',text:'向西走，真的會到印度嗎？舊日誌只寫着：「不要把希望當成位置。」'},
      {speaker:'yusuf',expression:'calm',bg:'harbor',text:'好問題。到達哪裏，必須根據證據判斷；航海家的預想，也可能有錯。'},
      {speaker:'hero',expression:'resolve',bg:'harbor',text:'先到加那利群島整備，再朝大西洋出發。每一項發現，都要留下理由。'}
    ]},
    cape: {title:'第一章 · 風暴以後',frames:[
      {speaker:'ines',expression:'resolve',bg:'storm',text:'巨浪逼近！把貨物固定好。先看風向，再決定何時通過海角。'},
      {speaker:'leo',expression:'resolve',bg:'storm',text:'我看見陸地了！可浪頭一直擋着我們……原來看見目的地，還不等於到得了。'},
      {speaker:'mara',expression:'calm',bg:'cape',text:'船帆還撐得住。需要的話，我們先修補，等下一次機會。'},
      {speaker:'dias',expression:'calm',bg:'cape',text:'1488年，迪亞士繞過非洲南端。他到達印度洋，沒有在這次航程抵達印度。',label:'歷史回顧 · 1488年 · 旁白，非人物原話'},
      {speaker:'yusuf',expression:'resolve',bg:'cape',text:'達伽馬後來沿着前人的線索再出發。新知識，往往由一代又一代人累積。'},
      {speaker:'leo',expression:'calm',bg:'cape',text:'日誌第二頁：海圖不是一個人的作品。缺失的一角，也許不只是某一片海。'}
    ],choices:[
      {text:'檢查船帆，修補風暴留下的損傷',hint:'補給 −1；船況 +2',effects:{food:-1,hull:2},tag:'repair'},
      {text:'整理風向與海角的觀察紀錄',hint:'補給 −1；知識 +1',effects:{food:-1,knowledge:1},tag:'observe'},
      {text:'與船員檢討剛才的分工',hint:'補給 −1；士氣 +2',effects:{food:-1,morale:2},tag:'cooperate'}
    ]},
    malindi: {title:'第二章 · 借來的眼睛',frames:[
      {speaker:'leo',expression:'resolve',bg:'india',text:'碼頭上有那麼多船！原來這片我們不熟悉的海，早已有人天天航行。'},
      {speaker:'yusuf',expression:'calm',bg:'india',text:'東非、阿拉伯、印度的商人長期往來。他們知道風何時轉向，港口在哪裏。'},
      {speaker:'gama',expression:'calm',bg:'india',text:'1498年，達伽馬在馬林迪獲得補給和領航協助，然後前往印度。',label:'歷史回顧 · 1498年 · 旁白，非人物原話'},
      {speaker:'ines',expression:'calm',bg:'india',text:'委託要求我們帶回海圖，可不能把別人的知識寫成自己的發現。'},
      {speaker:'hero',expression:'resolve',bg:'india',text:'那就把提供幫助的人和觀察方法一起記下。地圖上要有航線，也要有來源。'},
      {speaker:'yusuf',expression:'resolve',bg:'india',text:'前往印度的最後一段，需要準備，也需要願意請教。你會怎樣安排？'}
    ],choices:[
      {text:'聘請熟悉航路的領航員',hint:'補給 −1；知識 +2；士氣 +1',effects:{food:-1,knowledge:2,morale:1},tag:'cooperate'},
      {text:'先觀察風向，整理商船經驗',hint:'補給 −2；知識 +2',effects:{food:-2,knowledge:2},tag:'observe'},
      {text:'暫不求助，立即出海',hint:'補給 −1；士氣 −2',effects:{food:-1,morale:-2},tag:'risk'}
    ]},
    india: {title:'第三章 · 海圖上的人',frames:[
      {speaker:'leo',expression:'resolve',bg:'india',text:'到了！碼頭上有人議價、有人修船，也有人正準備另一趟遠航。'},
      {speaker:'gama',expression:'calm',bg:'india',text:'1498年，達伽馬經非洲南端抵達印度卡利卡特，建立歐洲通往印度的新海路聯繫。',label:'歷史回顧 · 1498年 · 旁白，非人物原話'},
      {speaker:'yusuf',expression:'calm',bg:'india',text:'印度早已有悠久歷史與貿易。這是葡萄牙船隊的抵達，不是印度的開始。'},
      {speaker:'ines',expression:'resolve',bg:'india',text:'往後的海上擴張，也帶來武力與殖民。不能只看船長得到的榮譽。'},
      {speaker:'leo',expression:'calm',bg:'india',text:'我終於讀懂那張缺角海圖了。空白不是等人佔有的地方，而是我們還未了解的生活。'},
      {speaker:'hero',expression:'resolve',bg:'india',text:'把同伴、領航者與每次修訂一起寫進日誌。這才是我們帶回的答案。'}
    ]},
    canary: {title:'第一章 · 離岸前的約定',frames:[
      {speaker:'ines',expression:'calm',bg:'harbor',text:'到加那利群島附近了。再往西，是一段漫長的海路。這裏的固定補給安排是遊戲模擬。'},
      {speaker:'mara',expression:'resolve',bg:'harbor',text:'先檢查淡水、食物與船帆。補給充足，不等於可以忘記下一次風暴。'},
      {speaker:'leo',expression:'calm',bg:'harbor',text:'離岸之後，如果我發現不對勁，也可以提出問題嗎？'},
      {speaker:'hero',expression:'resolve',bg:'harbor',text:'當然。每個人的觀察都要記下；需要時，我們一起改變計劃。'}
    ],choices:[
      {text:'多備食物淡水，再檢查船帆',hint:'補給 +2；船況 +1',effects:{food:2,hull:1},tag:'prepared'},
      {text:'向航海員請教，記下風向',hint:'知識 +1；士氣 +1',effects:{knowledge:1,morale:1},tag:'observe'},
      {text:'召集船員，約定輪班與求援方法',hint:'士氣 +2',effects:{morale:2},tag:'cooperate'}
    ]},
    atlantic: {title:'第二章 · 沒有陸地的日子',frames:[
      {speaker:'ines',expression:'resolve',bg:'storm',text:'海面看不到盡頭。有人擔心補給，有人說應該回航；我們需要一個能檢查的計劃。'},
      {speaker:'leo',expression:'calm',bg:'harbor',text:'我看見漂浮的植物！但昨天的海鳥，也沒有帶我們找到陸地。'},
      {speaker:'yusuf',expression:'calm',bg:'harbor',text:'一條線索不能代替全部證據。比較航向、已航距離和補給，再判斷。'},
      {speaker:'mara',expression:'resolve',bg:'harbor',text:'我把儲備重新點算了。可以繼續，但要訂出何時休整、何時求援的界線。'},
      {speaker:'hero',expression:'resolve',bg:'harbor',text:'每個人都能提出疑問。海圖空白的時候，沉默不會令我們更安全。'}
    ],choices:[
      {text:'整理觀察，訂下短期航行目標',hint:'補給 −1；知識 +1；士氣 +1',effects:{food:-1,knowledge:1,morale:1},tag:'observe'},
      {text:'先讓疲倦船員休息',hint:'補給 −2；士氣 +2',effects:{food:-2,morale:2},tag:'rest'},
      {text:'不作解釋，命令全速航行',hint:'船況 −1；士氣 −2',effects:{hull:-1,morale:-2},tag:'risk'}
    ]},
    caribbean: {title:'第三章 · 誰的未知世界？',frames:[
      {speaker:'leo',expression:'resolve',bg:'caribbean',text:'海岸！還有獨木舟和村落。這不是沒有人到過的空白世界。'},
      {speaker:'columbus',expression:'calm',bg:'caribbean',text:'1492年，哥倫布向西航行，抵達加勒比海地區。他以為接近亞洲，實際沒有到達印度。',label:'歷史回顧 · 1492年 · 旁白，非人物原話'},
      {speaker:'yusuf',expression:'calm',bg:'caribbean',text:'當地泰諾人已有自己的社會、農業與航海知識。歐洲人的地圖沒有畫上，不代表不存在。'},
      {speaker:'ines',expression:'resolve',bg:'caribbean',text:'後來的殖民、暴力、剝削與疾病，令原住民遭受巨大傷害。接觸的代價並不平均。'},
      {speaker:'leo',expression:'calm',bg:'caribbean',text:'所以，我們不能只寫「我找到甚麼」，也要問「這裏的人如何生活」。'},
      {speaker:'hero',expression:'resolve',bg:'caribbean',text:'日誌最後一頁不再空白。我們帶回新的問題，也帶回修正錯誤的勇氣。'}
    ]},
    magellan: {title:'延伸篇 · 接力走完的世界',frames:[
      {speaker:'yusuf',expression:'calm',bg:'palace',text:'打開另一卷航海檔案。這是1519至1522年的歷史回顧，與你的虛構航程分開。',label:'獨立歷史回顧 · 抉擇屬教學模擬，不能改寫史實'},
      {speaker:'magellan',expression:'calm',bg:'harbor',text:'1519年，麥哲倫率效力西班牙的船隊出航，尋找向西通往香料群島的航路。',label:'1519年 · 旁白，非人物原話'},
      {speaker:'ines',expression:'resolve',bg:'storm',text:'船隊1520年通過南美洲南部海峽。陌生水道與風向，考驗觀察和耐心。',label:'1520年 · 歷史回顧；稍後可體驗海峽決策'},
      {speaker:'magellan',expression:'calm',bg:'cape',text:'船隊進入太平洋。漫長航程帶來食物不足、疾病與疲勞；寬廣海洋超出許多人的預想。',label:'1520–1521年 · 歷史回顧'},
      {speaker:'mara',expression:'resolve',bg:'harbor',text:'食物減少，有人病倒。航程以外，也要照顧同伴；稍後的補給推演會讓你衡量代價。',label:'歷史困難概括 · 推演數值屬遊戲模擬'},
      {speaker:'magellan',expression:'calm',bg:'caribbean',text:'1521年，麥哲倫介入菲律賓當地衝突，在馬克坦戰死。他沒有完成環球航行。',label:'1521年4月27日 · 歷史回顧；場景為藝術概括'},
      {speaker:'elcano',expression:'calm',bg:'harbor',text:'1522年，埃爾卡諾帶領勝利號的倖存船員回到西班牙，完成首次環球航行。',label:'1522年 · 歷史回顧；成就是船隊的共同經歷'},
      {speaker:'yusuf',expression:'resolve',bg:'palace',text:'這段歷史有探索、合作，也有衝突與傷害。學習其求知精神，同時要看見其局限。'}
    ]},
    ending_legend: {title:'結局 · 傳奇探索家',frames:[
      {speaker:'official',expression:'resolve',bg:'ending_legend',text:'你完成航程，也帶回豐富的知識與來源。這份海圖，能讓下一艘船走得更穩。'},
      {speaker:'ines',expression:'resolve',bg:'ending_legend',text:'你學會把勇氣放在準備之後。每次觀察和求助，都成了真正有用的航海工具。'},
      {speaker:'leo',expression:'resolve',bg:'ending_legend',text:'海圖補好了，我的問題卻更多了！下一次，我想知道這些港口如何互相交流。'},
      {speaker:'hero',expression:'resolve',bg:'ending_legend',text:'稱號會留在紀錄裏。新的問題，會帶我們繼續前進。'}
    ]},
    ending_return: {title:'結局 · 勇敢的歸航者',frames:[
      {speaker:'ines',expression:'resolve',bg:'ending_return',text:'曙光號回港了。原定目的地還沒到，但船員和已取得的情報，都被你帶回來。'},
      {speaker:'official',expression:'calm',bg:'ending_return',text:'你沒有把未知寫成答案，而是交代了風險、決策與下一步。這是一份誠實的報告。'},
      {speaker:'mara',expression:'resolve',bg:'ending_return',text:'休整需要時間。下一趟，我們可以把補給和維修安排得更好。'},
      {speaker:'hero',expression:'resolve',bg:'ending_return',text:'這次回航留下了新的起點。我知道哪些準備，能讓下一次走得更遠。'}
    ]},
    ending_scholar: {title:'結局 · 求知的航海家',frames:[
      {speaker:'leo',expression:'calm',bg:'ending_scholar',text:'日誌裏有劃掉的航線、修過的帆，還有那些「下一次試這個方法」的記號。'},
      {speaker:'ines',expression:'resolve',bg:'ending_scholar',text:'你遇到挫折後，沒有只重複原來的做法。你比較情報，再調整決定。'},
      {speaker:'yusuf',expression:'resolve',bg:'ending_scholar',text:'錯誤留下證據，反思才把它變成經驗。你的航程，正在教會下一個人。'},
      {speaker:'hero',expression:'resolve',bg:'ending_scholar',text:'我還有很多不知道的事。現在，我知道怎樣開始尋找答案。'}
    ]},
    ending_captain: {title:'結局 · 曙光號的船長',frames:[
      {speaker:'ines',expression:'resolve',bg:'ending_legend',text:'你帶領曙光號完成了主要航程。一路上的決定，讓這張海圖有了自己的故事。'},
      {speaker:'leo',expression:'calm',bg:'ending_legend',text:'有些地方我們還沒探索，有些知識也未讀過。海圖以外，仍有很多問題。'},
      {speaker:'hero',expression:'resolve',bg:'ending_legend',text:'先把這次的經驗整理好。下一次，我想多觀察一步，多問一個問題。'}
    ]}
  },
  events: {
    capeStorm: {title:'好望角的巨大風暴',character:'ines',bg:'storm',intro:'巨浪遮住海角，曙光號劇烈搖晃。船員等你下令：怎樣通過這片危險海域？',hint:'觀察浪頭，減少受風面積；轉向和等候也可幫助保護船隻。',lesson:'cape',choices:[
      {text:'減帆，觀察浪頭再操舵',hint:'補給 −1；進入風暴操舵小遊戲',effects:{food:-1},feedback:'你收起部分船帆，準備避開最猛烈的浪頭。',method:'observe',success:true,mini:'storm'},
      {text:'轉往較安全水域，等風浪轉弱',hint:'補給 −2；知識 +1；士氣 +1',effects:{food:-2,knowledge:1,morale:1},feedback:'你付出補給與等候的代價，保存船隊再尋機會。',method:'rest',success:true},
      {text:'維持全帆，強行衝過巨浪',hint:'船況 −3；士氣 −1；進入風暴操舵補救',effects:{hull:-3,morale:-1},feedback:'船隻受損，但仍有操舵避浪與事後修補的機會。先觀察，再選安全水道。',method:'risk',success:false,mini:'storm'}
    ]},
    wind: {title:'帆布迎着逆風',character:'ines',bg:'storm',intro:'船首被風吹偏。繼續按原方向前進，補給會消耗得更快。',hint:'先觀察風向；改航也可以是前進的方法。',lesson:'navigation',choices:[
      {text:'觀察風向，調整航向',hint:'補給 −1；知識 +1；進入風向小遊戲',effects:{food:-1,knowledge:1},feedback:'你記下風向，再找較有利的航向。',method:'observe',success:true,mini:'wind'},
      {text:'頂着逆風全速前進',hint:'補給 −2；船況 −1',effects:{food:-2,hull:-1},feedback:'船帆受力增加。下次先看風向，這次仍可修理。',method:'risk',success:false},
      {text:'等候風向變化',hint:'補給 −2；士氣 +1',effects:{food:-2,morale:1},feedback:'等候有物資代價，卻讓船隊避開最不利的風。',method:'rest',success:true}
    ]},
    ration: {title:'水桶發出空響',character:'mara',bg:'harbor',intro:'淡水比預期少。船員等着你分配餘下的物資。',hint:'補給同時代表食物和淡水。公平分配能維持合作。',lesson:'supply',choices:[
      {text:'重新點算，公平分配',hint:'士氣 +1；進入補給分類小遊戲',effects:{morale:1},feedback:'大家知道剩餘份量，願意一起減少浪費。',method:'cooperate',success:true,mini:'supplies'},
      {text:'先為自己留下大部分飲水',hint:'補給 +1；士氣 −3',effects:{food:1,morale:-3},feedback:'儲備暫時增加，但船員對分配失去信任。可以重新商量規則。',method:'risk',success:false},
      {text:'減慢航程，重新規劃補給',hint:'補給 −1；知識 +1',effects:{food:-1,knowledge:1},feedback:'你確認最近補給點，避免繼續盲目遠航。',method:'observe',success:true}
    ]},
    sail: {title:'裂開的船帆',character:'mara',bg:'storm',intro:'一聲裂響，帆布破了！還能航行，但破口可能擴大。',hint:'維修要花物資；拖延亦有代價。',lesson:'supply',choices:[
      {text:'停船修帆',hint:'補給 −1；船況 +1；進入修帆小遊戲',effects:{food:-1,hull:1},feedback:'你先處理破口，減少下一段航行的風險。',method:'repair',success:true,mini:'repair'},
      {text:'暫時不修，保持速度',hint:'船況 −2',effects:{hull:-2},feedback:'裂口擴大了。仍可使用修理工具補救，不必重開遊戲。',method:'risk',success:false},
      {text:'分工收帆，固定工具',hint:'補給 −1；船況 +1；士氣 +1',effects:{food:-1,hull:1,morale:1},feedback:'分工讓維修更有秩序，也讓船員知道各自的工作。',method:'cooperate',success:true,mini:'cargo'}
    ]},
    bird: {title:'海鳥帶來的疑問',character:'leo',bg:'cape',intro:'海鳥朝遠方飛去。里奧興奮地指着牠們：附近有陸地嗎？',hint:'單一線索不保證找到陸地。',lesson:'evidence',choices:[
      {text:'記錄方向，再比較其他線索',hint:'知識 +1',effects:{knowledge:1},feedback:'你把海鳥當作參考，沒有立刻把猜測寫成答案。',method:'observe',success:true},
      {text:'全速追着海鳥走',hint:'補給 −1',effects:{food:-1},feedback:'鳥群很快飛遠。下次可以先比較海流與原航向。',method:'risk',success:false},
      {text:'讓觀望員與導師共同判斷',hint:'補給 −1；士氣 +1；知識 +1',effects:{food:-1,morale:1,knowledge:1},feedback:'你聽取兩人的觀察，讓判斷更有根據。',method:'cooperate',success:true}
    ]},
    calm: {title:'帆垂下來的午後',character:'ines',bg:'cape',intro:'沒有風，船帆垂下來。目的地仍在遠方，補給卻不會停止消耗。',hint:'帆船依靠風力；硬催船員不會製造風。',lesson:'navigation',choices:[
      {text:'趁機觀察海流，準備改航',hint:'補給 −1；知識 +1',effects:{food:-1,knowledge:1},feedback:'你利用等候時間收集資料，為下一段航程作準備。',method:'observe',success:true},
      {text:'讓所有人不停划槳',hint:'補給 −1；士氣 −2',effects:{food:-1,morale:-2},feedback:'大船難靠人力持續推進，船員疲倦。可以先休整再調整方法。',method:'risk',success:false},
      {text:'輪流休息，等候微風',hint:'補給 −2；士氣 +2',effects:{food:-2,morale:2},feedback:'你付出等候成本，讓船員恢復體力。',method:'rest',success:true}
    ]},
    chart: {title:'舊圖上的假海岸',character:'yusuf',bg:'cape',intro:'眼前的海岸與舊圖不同。里奧問：錯的是地圖，還是我們的位置？',hint:'先比較觀察與紀錄，不急着選一個相信。',lesson:'evidence',choices:[
      {text:'重新觀測，修訂航圖',hint:'補給 −1；知識 +2',effects:{food:-1,knowledge:2},feedback:'你留下觀測依據，讓下次判斷可以檢查。',method:'observe',success:true},
      {text:'舊圖一定沒錯，直接照走',hint:'補給 −2；船況 −1',effects:{food:-2,hull:-1},feedback:'船隊走了冤枉路。請教導師或觀測星象，可以重新定位。',method:'risk',success:false},
      {text:'請同伴各自說出觀察',hint:'補給 −1；知識 +1；士氣 +1',effects:{food:-1,knowledge:1,morale:1},feedback:'不同角度的觀察，幫助你找出不一致的地方。',method:'cooperate',success:true}
    ]},
    disease: {title:'疲倦的同伴',character:'mara',bg:'harbor',intro:'幾名船員牙齦不適、疲倦無力。瑪拉要求重新安排工作與食物。',hint:'今日知道壞血病與維他命C不足有關；不是接觸傳染。當時船員未理解病因。',lesson:'scurvy',choices:[
      {text:'安排靠岸，尋找新鮮食物',hint:'補給 −1；士氣 +2',effects:{food:-1,morale:2},feedback:'你把健康列入航程計劃；尋找補給仍需時間和路程。',method:'cooperate',success:true},
      {text:'要求病員照常工作',hint:'士氣 −3',effects:{morale:-3},feedback:'大家更加疲倦，也對船長失去信心。可重新分工並安排休整。',method:'risk',success:false},
      {text:'減輕病員工作，重新分配食物',hint:'補給 −1；士氣 +1；知識 +1',effects:{food:-1,morale:1,knowledge:1},feedback:'你先照顧同伴，同時記下症狀與飲食；仍須尋找合適補給。',method:'cooperate',success:true}
    ]},
    quarrel: {title:'甲板上的爭執',character:'ines',bg:'harbor',intro:'有人想繼續，有人要求回航。兩邊都等着你表態。',hint:'先聽清楚原因，再用資源與情報討論。',lesson:'history-fiction',choices:[
      {text:'讓各方提出擔憂，再討論',hint:'補給 −1；士氣 +2',effects:{food:-1,morale:2},feedback:'大家說出了真正擔心的事，能一起訂出下一步。',method:'cooperate',success:true},
      {text:'禁止船員再提出疑問',hint:'士氣 −3',effects:{morale:-3},feedback:'甲板安靜了，信任卻下降。沉默不代表問題消失。',method:'risk',success:false},
      {text:'公開補給數目，訂下短期目標',hint:'補給 −1；知識 +1；士氣 +1',effects:{food:-1,knowledge:1,morale:1},feedback:'你讓計劃可以檢查，船員知道何時需要重新評估。',method:'observe',success:true}
    ]},
    current: {title:'偏離航向',character:'yusuf',bg:'cape',intro:'海流推着船走，預計位置與觀察不符。現在需要重新定位。',hint:'羅盤提供方向，星象可協助估算緯度；兩者都不是現代GPS。',lesson:'navigation',choices:[
      {text:'比較羅盤、星象與航行紀錄',hint:'補給 −1；知識 +1；進入觀星小遊戲',effects:{food:-1,knowledge:1},feedback:'你用多項資料修正估計，減少繼續偏航的風險。',method:'observe',success:true,mini:'stars'},
      {text:'憑感覺直接轉向',hint:'補給 −2',effects:{food:-2},feedback:'猜測令船隊多走了一段。先觀測，仍可重訂航向。',method:'risk',success:false},
      {text:'與同伴分工觀測',hint:'補給 −1；知識 +1；士氣 +1',effects:{food:-1,knowledge:1,morale:1},feedback:'你比較不同紀錄，找出原來估計的偏差。',method:'cooperate',success:true}
    ]},
    rain: {title:'暴雨中的貨艙',character:'mara',bg:'storm',intro:'雨水打濕甲板，木箱開始滑動。再不固定，貨物會撞壞船身。',hint:'先保護人與船，再考慮速度。',lesson:'supply',choices:[
      {text:'固定貨物，減少船帆',hint:'補給 −1；船況 +1；進入貨艙小遊戲',effects:{food:-1,hull:1},feedback:'你提前處理移動的貨物，減輕風雨造成的風險。',method:'repair',success:true,mini:'cargo'},
      {text:'保持全帆，盡快衝過',hint:'船況 −2',effects:{hull:-2},feedback:'木箱撞上船板。雨停後可修補，下次應先固定貨物。',method:'risk',success:false},
      {text:'分組輪班守船，其他人休息',hint:'補給 −1；船況 +1；士氣 +1',effects:{food:-1,hull:1,morale:1},feedback:'輪班兼顧警戒與體力，船員願意互相支援。',method:'cooperate',success:true}
    ]},
    merchant: {title:'遠方商船的招呼',character:'leo',bg:'india',intro:'另一艘商船願意交換補給與消息。這是一個了解陌生海域的機會。',hint:'本次商船相遇是遊戲模擬，不是特定歷史停靠紀錄。',lesson:'indian',choices:[
      {text:'禮貌交換航路資訊',hint:'補給 −1；知識 +2；士氣 +1',effects:{food:-1,knowledge:2,morale:1},feedback:'你記下資訊來源；這些知識來自熟悉海域的航海者。',method:'cooperate',success:true},
      {text:'用備用材料交換食物',hint:'船況 −1；補給 +3',effects:{hull:-1,food:3},feedback:'補給增加了，但維修儲備減少。接下來要留意船況。',method:'cooperate',success:true},
      {text:'保持距離，按原航線前進',hint:'資源不變；錯過本次交流',effects:{},feedback:'你保留了現有安排，也沒有獲得新情報。之後仍可在港口請教。',method:'rest',success:false}
    ]},
    reef: {title:'水面下的暗影',character:'ines',bg:'caribbean',intro:'前方水色改變，觀望員發現暗礁。船底可能擦上岩石！',hint:'先觀察水色和水深，繞路有補給成本。',lesson:'evidence',choices:[
      {text:'減速，沿深水繞過',hint:'補給 −1；進入避礁小遊戲',effects:{food:-1},feedback:'你留出轉向空間，準備逐段通過。',method:'observe',success:true,mini:'reef'},
      {text:'直接駛過較短的路',hint:'船況 −3',effects:{hull:-3},feedback:'船底擦傷。修船工具仍可補救，下一次應先查證水深。',method:'risk',success:false},
      {text:'派員觀察，重新畫出安全線',hint:'補給 −2；知識 +1',effects:{food:-2,knowledge:1},feedback:'你花時間把危險記下，往後可以避開。',method:'observe',success:true}
    ]},
    hope: {title:'日誌停在半頁',character:'leo',bg:'harbor',intro:'里奧很久沒有寫日誌了。他說：「每一天都是海，我們真的有進步嗎？」',hint:'回顧已走過的路，再訂一個能做到的目標。',lesson:'history-fiction',choices:[
      {text:'一起比較舊圖與新的觀察',hint:'補給 −1；知識 +1；士氣 +2',effects:{food:-1,knowledge:1,morale:2},feedback:'你指出已解決的具體問題，再把下一步拆小。',method:'observe',success:true},
      {text:'責怪他沒有毅力',hint:'士氣 −2',effects:{morale:-2},feedback:'里奧不再提問。可以換個方法，先聽清楚他的困難。',method:'risk',success:false},
      {text:'先休整，再重新評估計劃',hint:'補給 −2；士氣 +2',effects:{food:-2,morale:2},feedback:'休息有代價，但讓船員重新集中精神。',method:'rest',success:true}
    ]},
    light: {title:'雲縫中的星光',character:'yusuf',bg:'cape',intro:'厚雲散開。尤素夫拿出觀測工具，邀你一起檢查航向。',hint:'觀測小遊戲是原理體驗，不是完整的歷史星盤操作。',lesson:'navigation',choices:[
      {text:'觀測並留下紀錄',hint:'補給 −1；知識 +1；進入觀星小遊戲',effects:{food:-1,knowledge:1},feedback:'你把估計變成可比較的紀錄，增加判斷依據。',method:'observe',success:true,mini:'stars'},
      {text:'不觀測，按印象轉向',hint:'補給 −2',effects:{food:-2},feedback:'印象並不可靠。下次可以先請教觀測方法。',method:'risk',success:false},
      {text:'請導師示範，再自己核對',hint:'補給 −1；知識 +1；士氣 +1',effects:{food:-1,knowledge:1,morale:1},feedback:'你先學方法，再用自己的觀察確認。',method:'cooperate',success:true}
    ]}
  },
  achievements: []
};
