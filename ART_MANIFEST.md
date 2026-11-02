# 原創美術及聲音資源

版本 v0.10.0-rc3，2026-10-31。

## 遊戲內的圖像

52個運行用壓縮WebP：原有34個運行資產，加九張原創逐幕插畫及九張用戶提供的麥哲倫故事圖。另保留四張舊圖集備份，不在正常遊戲載入；原圖只隨完整專案保存。

- `hero.webp`：1672×941，曙光號啟航首頁及船上場景。
- `palace-wide.webp`、`storm-wide.webp`：1672×941，王宮及暴風雨過場。
- `lisbon.webp`、`palace.webp`、`storm.webp`、`cape.webp`、`india.webp`、`caribbean.webp`：六個場景，源自原創場景圖集。
- `duarte`、`ines`、`leo`、`yusuf`、`mara`、`player`：六名原創角色，各有基本肖像、另一表情，以及獨立透明全身立繪 `*-standing.webp`。
- `dias.webp`、`columbus.webp`、`gama.webp`、`magellan.webp`：四位歷史人物的風格化藝術形象，不是照片或真實發言紀錄。
- `ending-legend.webp`、`ending-return.webp`、`ending-scholar.webp`：三幅不同結局插畫。基本「遠航船長」另有專屬三幕文字，使用完成遠航的插畫。
- `scenes.webp`、`characters.webp`、`history.webp`、`endings.webp`：原創圖集備份，正常遊玩沒有一次載入整套圖集。
- `assets/originals/*.png`：生成原圖，只保存在完整專案備份，不放入網站部署包。

立繪以透明 alpha 通道疊於場景上；對話姓名旁另顯示表情近鏡。服裝、船形、室內陳設及角色職務組合是原創冒險美術，並非15–16世紀器物與船員編制的精確復原。核心史實由帶年份的文字、知識卡及來源說明承載，不能把插畫細節當作史料。

`references/` 保留用戶提供的 RPG、漫畫及麥哲倫肖像參考，只供續作參照；沒有放進可部署網站。不得把這些參考圖當成新增原創資產發布。

## 地圖與介面

原東部海岸資料、海格及船圖造型延續提供的 HTML；西部新增輪廓是教學簡圖。徽章和工具圖示是專案內 SVG 路徑，不以 emoji 代替人物。完整保留追蹤見 `docs/ORIGINAL_ANALYSIS.md`。

## 聲音

`audio.js` 在瀏覽器以 Web Audio 即時合成原創循環旋律、海浪、按鈕、翻頁、失誤、成就及低音風暴提示。聲音已包含於程式，沒有遺漏的外部音檔或音樂服務。音效、背景音樂、海浪及音量可分開調整，初次點按後才啟動。

## 驗證

開發環境已完整解碼全部運行用WebP；六幅全身立繪為RGBA，透明背景與接近完全不透明的角色主體均正常。瀏覽器已檢視首頁、王宮對話、角色表情、歷史卡及窄螢幕排版。尚待 iPad Safari 實機確認圖像解碼、聲音與記憶體表現。

## v0.10逐幕資產

- assets/history-dias-1..3.webp、history-columbus-1..3.webp、history-gama-1..3.webp：九幅獨立原創場景，由內建圖片生成工具實際生成並整合；提示和修圖紀錄見docs/STORY_ART_V2.md。
- assets/story/magellan-01..09.webp：用戶提供的九張教學故事圖，按原順序播放；不是本專案生成作品，未主張原創。文字錯誤／簡化以同幕旁白校訂，原始檔保留於assets/originals/magellan-supplied。
- 新版所有人物與場景都在自包含HTML內嵌；WebAudio仍由audio.js產生，不需要外部音樂下載。
