# Google Sheets 雲端排行榜與 Google Sites 嵌入方案

研究日期：2026-10-30（香港）。本文件是供本次實作採用的技術決定與驗收依據；不是聲稱已建立或發布任何教師帳戶內的服務。

## 建議採用的單一路徑

**雲端版：Google Sites → Apps Script Web App 的完整遊戲 → `google.script.run` → 教師私有 Google Sheets。**

遊戲的 HTML、CSS、JavaScript 及必要圖像全部打包成自包含的 `Game.html`，由 Apps Script 的 `HtmlService` 提供。伺服器 `Code.gs` 只提供提交成績及讀取課堂排行榜等有限功能。這是本專案的工程選擇，不是 Google 宣稱唯一可用的架構。

Google 官方文件確認 HTML Service 頁面可使用非同步 `google.script.run` 呼叫 Apps Script；成功與錯誤處理器用來確認結果。[G2] 這讓本版不用依賴外部靜態頁跨來源呼叫 Apps Script，也不用把 `fetch(...,{mode:'no-cors'})` 的不透明回應誤當成成功。

另交付相同遊戲的**離線單一 HTML**：圖片內嵌，直接開啟不再依賴旁邊的 `assets/` 資料夾，也可嘗試貼入 Google Sites 的「嵌入程式碼」。這份直接貼碼版不會憑空獲得 `google.script.run`；如要共用排行榜，應使用已部署的雲端版網址。介面必須明確顯示目前是「本機」或「班級雲端」模式。

Google Sites 官方支援嵌入 HTML/CSS/JavaScript，也支援網址嵌入；本次查閱的官方頁面沒有給出貼碼的可靠字數或檔案大小上限。[G1] 因此不能保證含大量內嵌圖片的 HTML 在每個學校帳戶都能直接貼入，也不能虛構一個固定上限。完整單檔仍應交付；雲端 `/exec` 網址提供較短的嵌入方式。

## 部署權限及資料範圍

- 儲存成績的 Google Sheet 保持教師私有，不需分享整張表給學生。
- Web App 若設定以部署者身份執行，伺服器將使用教師授權；不能把 OAuth token 傳到前端。[G3]
- 若帳戶允許部署為「Anyone／任何人」，可嘗試不登入 Google 的學生瀏覽器。若學校只提供「校內使用者」或限制匿名 Web App，就不能承諾免登入；需依學校權限處理，不能繞過。
- 可看到遊戲的 Google Sites 權限不等於外部 Web App 有相同權限。雲端入口及課堂加入碼的存取範圍要分開說明。
- 只上傳匿名代號、航程識別碼、結局、遊戲版本、模擬日數和計分必要統計。反思文字、完整存檔、真實姓名、學號、電郵、IP 及裝置指紋不屬本方案所需資料。
- 課堂碼是減少誤入的共同門檻，並非可靠身份認證。知道網址及課堂碼的人仍可能提交或讀取該課堂公開的匿名排名。

## 建議前後端契約

以下是工程契約草案；實作時兩端必須採同一版本與欄位，不能只做顯示介面。

### 公開可呼叫函式

1. `voyagePing({protocol:1})`：回傳服務版本、是否可用，不回傳 Spreadsheet ID、教師電郵或課堂碼。
2. `voyageSubmit(payload)`：驗證後以固定 runId 寫入一次，回傳伺服器計算的成績及 receipt。
3. `voyageBoard({protocol:1,classCode,metric,route})`：讀取指定課堂有限數量的匿名名次。

所有設定、清理、計分及讀表輔助函式以 `_` 結尾，例如 `setup_()`、`validate_()`、`score_()`；Google 官方說明此類名稱不能由 `google.script.run` 呼叫。[G2] 不可留下公開的刪表、任意讀檔或執行函式。

### 提交內容

```json
{
  "protocol": 1,
  "gameVersion": "本次發布版本",
  "classCode": "教師提供的課堂碼",
  "runId": "建立航程時生成並保存在存檔的隨機識別碼",
  "alias": "海燕07",
  "route": "west",
  "ending": "legend",
  "completed": true,
  "days": 24,
  "steps": 70,
  "elapsedSeconds": 1100,
  "cards": ["以本版有效卡片ID為準"],
  "places": ["以本版有效地點ID為準"],
  "resolved": ["以本版有效事件ID為準"],
  "improvements": ["以本版有效改進ID為準"]
}
```

前端不能自行決定排行榜採用的最終分數。伺服器用相同且有版本的計分規則重算，並檢查 ID 白名單、去重、整數範圍、結局列舉、完成狀態和航線關係。具體上限必須依改版後的引擎設定，不能沿用舊版而誤拒新存檔。

### 回應

```json
{"ok":true,"status":"stored","runId":"...","receipt":"...","score":78,"serverTime":"2026-10-30T10:00:00.000Z"}
```

同一 runId、相同內容重送：`status:"duplicate"`，回傳原有 receipt，不多加一行。相同 runId 內容不同：`ok:false,code:"RUN_CONFLICT"`，不可偷偷覆寫較差結果。可預期錯誤使用 `INVALID_INPUT`、`CLASS_CLOSED`、`BAD_CLASS_CODE`、`BUSY`、`RATE_LIMITED` 等固定代號，前端顯示簡短繁體中文。

排名回應只含所需匿名資料和伺服器時間：

```json
{"ok":true,"metric":"score","route":"all","updatedAt":"ISO字串","rows":[{"rank":1,"alias":"海燕07","route":"west","ending":"legend","score":78,"days":24}]}
```

`google.script.run` 接受基本值及由基本值組成的物件／陣列；不可傳 `Date`、函式、DOM 節點或循環結構。[G2] 所有時間轉成 ISO 字串或整數。

## 伺服器必要保護

以下均是針對本遊戲的實作建議。

1. **輸入限制：** 拒絕超長 payload、未知欄位或不合法數值；代號限16字，移除控制字元，限制可用字元並避免以 `= + - @` 開頭。寫入試算表時以文字處理，防止公式注入；排行榜用 `textContent` 顯示。
2. **課堂設定：** 在 Script Properties 保存 Sheet ID、課堂碼雜湊及開放狀態，前端不得包含教師秘密或通用管理密碼。Script Properties 適合此類伺服器設定。[G4]
3. **重複與競爭：** 用 `LockService.getScriptLock()` 保護「檢查 runId → 寫入成績」整段。只鎖短小寫入區；取得失敗回報忙碌。寫表後 `SpreadsheetApp.flush()`，再在 `finally` 釋放鎖。[G5]
4. **限制頻率：** 同一課堂／runId 短時間只接受有限次呼叫；讀榜結果可短暫快取。Cache 是效能輔助，不是永久防濫用保證。runId 去重應以持久資料為準。
5. **資料容量：** 每課堂設定明確筆數上限和保存期限；教師從私有表管理及刪除紀錄，不提供匿名網頁刪除功能。
6. **計分公平：** 不將改進次數、事件數等直接相信任意客戶端數字；以有效且不重複的 ID 陣列計算。速度榜只列真正完成主線的航程，按航線分榜。閱讀時間不扣綜合分。
7. **誠實的防作弊說明：** 上述能防常見亂值、重複上傳及刷分錯誤，但無登入的客戶端遊戲仍可偽造合法格式的經歷；不得宣稱適合高風險考試。若要嚴格防作弊，需要伺服器接收／驗證每步事件或可信身份，而這會增加成本及維護。

## 前端狀態與可靠提交

- 完成航程後才顯示「提交至班級排行榜」，先清楚列出將分享匿名代號及分數；不要將反思一起上傳。
- 按提交後顯示「正在提交」，暫停重複按鈕；只有收到成功處理器且 `response.ok === true` 及對應 runId，才顯示「已上傳」。
- 失敗或逾時顯示「未確認上傳，成績仍保存在本機」，保留相同 runId 供重試。逾時不代表伺服器一定沒有寫入，因此不能生成新 runId 再送。
- 每次結果頁進入時讀榜一次，另有「更新排名」按鈕；不要每秒輪詢。可用短暫隨機延遲分散同班同時提交，遇忙碌再退避重試。
- 斷網或 Google 服務錯誤不應阻止看結局、保存進度或下載報告。
- 對待外部靜態頁：若沒有 `google.script.run`，只顯示本機榜及清楚的雲端版入口，不能以假排名代替真實跨裝置資料。

## 教師一次設定流程

這是建議隨最終程式交付的步驟；函式及檔案名稱要與實作一致。

1. 教師建立一張新的 Google Sheets，保留私有。由「擴充功能 → Apps Script」開啟綁定專案，或建立獨立專案並在 Script Properties 設定 Spreadsheet ID。
2. 放入提供的 `Code.gs` 與 `Game.html`；設定課堂碼、課堂開放狀態和保存期限。執行提供的教師初始化函式一次，僅授權所需的試算表存取。
3. 在 Apps Script 選「部署 → 新增部署」，類型選「網頁應用程式」。設定「執行身分：我」，存取對象選帳戶允許且學校批准的範圍，再部署。[G3]
4. 使用正式 `/exec` 網址。`/dev` 測試網址只供專案編輯者，不能給學生。[G3]
5. 先在未登入教師帳戶的另一瀏覽器／iPad測試遊戲和匿名存取。兩部裝置各提交不同代號，確認讀到同一份排名，再測試相同 runId 重送只保留一筆。
6. 在 Google Sites 按「插入 → 嵌入」，貼上正式網址；可用全頁嵌入，另放「開啟完整遊戲」連結。[G1]
7. 發布 Google Sites，再由學生使用的正式網址測試。只在教師編輯器預覽成功不代表學生端成功。
8. 更新程式後，經「管理部署」更新到新版本；保留原部署網址。若重新建立新部署，需更新 Sites 入口並注意瀏覽器進度環境可能改變。

`doGet()` 可回傳 `HtmlService.createHtmlOutputFromFile('Game').setTitle(...).addMetaTag('viewport','width=device-width, initial-scale=1').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)`。

`ALLOWALL` 允許其他網站嵌入，會放寬防點擊劫持限制；因此遊戲頁只提供低風險匿名成績操作，不承載教師管理、刪表或敏感資料。[G6] Google HTML Service 本身仍使用 iframe sandbox，外部主動資源須用 HTTPS，連結宜用 `_blank`；提供完整頁後備入口。[G7]

## 限額與驗收界線

查閱時官方列出的 Apps Script 限制包括每次執行6分鐘、每位使用者同時30個執行、每個腳本同時1,000個執行；數值可變，部署前應再看官方頁。[G8] 本遊戲應以短查詢、單次批次讀寫、快取及非高頻更新支援一班學生，不應以「免費」等同無限使用或無需維護。

官方文件未提供本研究可據以保證的 Google Sites 貼碼長度、Apps Script HTML 編輯器單檔可用容量或所有學校 Safari 儲存環境。單檔遊戲及實際 Web App 均須在目標帳戶／iPad驗收；不能用 Node.js 後端替身測試冒充已連接 Google Sheets。

本次研究不需要付費API。未實際部署前，交付應明示「雲端程式已備妥／待教師部署」；只有兩部獨立裝置或瀏覽器實際共用同一表成功後，才標記跨裝置驗證完成。

## 官方來源

- [G1 Google Sites：網址、HTML、CSS與JavaScript嵌入](https://support.google.com/sites/answer/90569?hl=en)
- [G2 Apps Script：HTML Service與伺服器通訊](https://developers.google.com/apps-script/guides/html/communication)
- [G3 Apps Script：Web Apps、部署、執行身份與Google Sites](https://developers.google.com/apps-script/guides/web)
- [G4 Apps Script：Properties Service](https://developers.google.com/apps-script/guides/properties)
- [G5 Apps Script：Lock與試算表flush](https://developers.google.com/apps-script/reference/lock/lock)
- [G6 Apps Script：XFrameOptionsMode](https://developers.google.com/apps-script/reference/html/x-frame-options-mode)
- [G7 Apps Script：HTML Service限制](https://developers.google.com/apps-script/guides/html/restrictions)
- [G8 Apps Script：配額及限制](https://developers.google.com/apps-script/guides/services/quotas)
- [G9 Apps Script：Content Service與JSONP警告](https://developers.google.com/apps-script/guides/content)

Google對JSONP的官方提醒是僅供非敏感、唯讀資料；本案不用JSONP提交成績，也不把可執行回呼名交由未驗證輸入控制。[G9]

rc3補充：Google編輯器不列出底線結尾的函式，Teacher_Setup.gs提供teacherInitialize入口；入口必須先通過SpreadsheetApp.getUi及指定綁定試算表檢查。Google官方說明這些綁定UI方法在web app／Apps Script API不可用，因此遠端呼叫在任何設定寫入前拒絕。[綁定腳本](https://developers.google.com/apps-script/guides/bound)。
