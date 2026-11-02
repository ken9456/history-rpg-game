# Google Sites與iPad部署指南

v0.10.0-rc3｜2026-10-31。遊戲和圖像已整合；本輪尚未在已發布Google Sites或實際iPad Safari完成驗收。私人排行榜試算表及Apps Script專案已建立並存入程式，尚未設定課堂碼及授權部署，沒有可宣稱已運作的雲端遊戲網址。

## 先選適合你的方式

| 方式 | 學生取得 | 排行榜 | 需要的檔案 |
|---|---|---|---|
| A 完整HTML貼碼 | Google Sites頁面 | 同一瀏覽器本機榜 | 單一HTML或完整貼碼TXT |
| B Google雲端遊戲（共享榜） | Apps Script的exec網址，嵌入Google Sites | 跨iPad同課堂碼 | Code.gs、Game.html、私人Google試算表 |
| C 靜態主機網址 | GitHub Pages等HTTPS網址，嵌入Google Sites | 本機榜 | 網站部署ZIP |

Google Sites的嵌入功能支援HTML／CSS／JavaScript，但不能把多檔案遊戲的index.html貼上便自動取得旁邊的圖片或JS。這次另交付真正自包含的HTML，52張運行圖片和程式已內嵌。單一檔約11MiB；未假定Google Sites在所有帳戶都接受這個大小，若拒收或載入異常，請用B或C的網址嵌入。

## A：直接貼完整HTML

1. 下載《未知海域_航海家的傳奇.html》或《Google_Sites_完整貼碼.txt》，兩者內容相同。
2. 在電腦開啟《Google_Sites_貼碼助手.html》，選擇上一步檔案，按複製。若瀏覽器不允許剪貼簿，按全選再手動複製。
3. 在Google Sites編輯頁選「插入→嵌入→嵌入程式碼」，貼入全部內容，按下一步，確認遊戲首頁顯示後插入。
4. 把嵌入區拉闊至頁面全寬，高度先設約760–850像素。用預覽檢查；iPad橫向建議寬1024以上、高度約700–800，視型號和網站頁首調整。
5. 發布後，用學生可存取的網址測試開始、對話、移動、補給、結局和存檔。編輯預覽可用不等於學生發布頁可用。

如果貼入後出現原始文字、白畫面、資料被截斷或儲存失敗，勿反覆縮減成只有index.html。改用B／C的完整遊戲網址。在Sites旁放一個「開啟完整遊戲」按鈕連向同一網址，避免內嵌高度或儲存限制。

A版只提供本機榜，因Google Apps Script的google.script.run只存在於Apps Script提供的遊戲頁面，不能由任意Google Sites貼碼自動取得。不能以公開試算表或JSONP取代存取控制。

## B：Google試算表共享排行榜

已建立的教師私人試算表：[未知海域班級排行榜](https://docs.google.com/spreadsheets/d/1YMuz9BA8YOMnLXNq7A7W2QLPyNHav4Tv3xMfNmOOYW4/edit)。請重用它，無須再建立另一份。Scores目前只有18欄標題，沒有學生成績；教師說明是另一個分頁。不要把試算表設為公開，也不要把學生加入編輯者。

雲端程式已寫入教師的綁定Apps Script專案，目前未授權、未部署、未完成兩部iPad實測。Google Drive連接可建立檔案，沒有Apps Script建立／部署介面；最後授權需由教師的Google帳戶完成。以下是可直接部署的完整程式流程。

### 一次設定

1. 在上述試算表選「擴充功能→Apps Script」，建立綁定腳本；或在Apps Script建立獨立專案。
2. 開啟交付的雲端部署包，把Code.gs全文貼入腳本的Code.gs。若另有Teacher_Setup.gs，把它新增為同名腳本檔，這檔會設定已建立的試算表及私人遊戲HTML檔ID。
3. 遊戲HTML較大，推薦在Google Drive保留私人Game.html，讓伺服器讀取。已有上載的檔案ID會記在cloud/DEPLOYMENT_STATE.json及Teacher_Setup.gs；不要公開分享。若記錄沒有GAME_FILE_ID，將cloud/Game.html上載至自己的Drive，複製檔案ID，在指令碼屬性設GAME_FILE_ID。
4. 替代方法：在Apps Script新增HTML檔案，命名Game，貼入cloud/Game.html全部內容；不設定GAME_FILE_ID便用這個檔案。若編輯器無法處理大檔，回到上一步的Drive方法。
5. 在「專案設定→指令碼屬性」新增CLASS_CODE，值由教師自訂，6–32個英文字母、數字、底線或連字號；發給同班學生即可，不要用任何帳戶密碼。請使用由排行榜試算表建立的綁定專案；Teacher_Setup.gs會核對並填好已有ID。
6. 在編輯器函式選單選teacherInitialize並執行。Teacher_Setup.gs提供這個受保護入口；底線結尾的setup_不會出現在選單。按Google畫面確認所需試算表及Drive讀取授權。只有在理解權限及符合學校政策時授權；這一步不會由遊戲替學生索取Google密碼。
7. setup_保留原有成績、檢查18欄標題，將課堂碼加鹽雜湊後刪除明文屬性。CLASS_OPEN設true，首次有效期30日。設定失敗時，按錯誤訊息修正，不要刪掉既有分數。

可參照appsscript.json的V8、Asia/Hong_Kong及OAuth範圍。用Drive方法需讀取教師的Drive檔案；學生只經伺服器讀遊戲及匿名榜，不能取得資料表編輯權。若學校管理員禁止Apps Script或外部學生存取，需依學校政策處理，不能靠公開Drive檔案繞過。

### 部署並嵌入

1. Apps Script選「部署→新增部署作業→網頁應用程式」。執行身分選教師自己；存取者依校規選學校網域使用者，或在校方允許下選任何人。這是教師決定的服務存取範圍，試算表本身仍保持私人。
2. 完成授權與部署，複製以 `/exec` 結尾的正式網頁應用程式網址。不要給學生 `/dev` 編輯測試網址。
3. 在兩個獨立瀏覽器先開exec網址，輸入相同課堂碼。一邊完成航程並按「分享本次成績到班級榜」，另一邊按「更新班級排名」，確認看得到。測試代號用QA開頭，驗收後教師可在私人表刪除測試列。
4. 回Google Sites用「插入→嵌入→網址」貼exec網址，調整全寬及高度。另放「開啟完整遊戲」按鈕連同一網址。程式使用ALLOWALL供內嵌，並不等於資料表公開。
5. 發布Sites後再用學生iPad試一次，包括關閉再繼續、手動存檔匯入及跨裝置榜。正式成功前不要向學生宣稱已同步。

若需要HTML嵌入碼，可將實際exec網址填入以下兩個位置；此範例的YOUR_EXEC_URL必須替換，並非已部署地址。

```html
<iframe src="YOUR_EXEC_URL" title="未知海域：航海家的傳奇" width="100%" height="800" style="border:0" allow="autoplay; fullscreen"></iframe>
<p><a href="YOUR_EXEC_URL" target="_blank" rel="noopener">開啟完整遊戲</a></p>
```

### 課堂榜管理

同課堂碼共享五類榜：綜合、速度、發現、困難、知識；東西線可分開。學生只用代號，分享是明確按鈕操作，日誌與反思不會傳上雲端。資料表保存run_id、回執、日期、課堂雜湊、代號、航線、結局、完成狀態、日數、格數、活躍秒數、分數、地點／卡／困難／改進數、版本及提交雜湊。

同一run_id重按提交不會加一筆；同一航程改數值再提交會拒收。伺服器重算分數、檢查範圍和去重，不代表完全防作弊：學生能讀取前端程式，合理範圍的偽造結果仍可能通過。只用於教學活動。每表上限5000筆；Apps Script亦有帳戶配額，多班同時大量使用可能達限。

課後把CLASS_OPEN改false即停止讀寫；CLASS_EXPIRES是毫秒時間戳，預設30日，不會自動刪除既有紀錄。需要新課堂碼時在屬性加CLASS_CODE再跑teacherInitialize；新雜湊會把榜分組。保留舊碼再重設可回到原分組。資料保留期限由學校決定，建議課堂評估後刪除不再需要的列。

更新遊戲：替換Drive中的Game.html檔案內容或設定新GAME_FILE_ID；伺服器每次開頁讀取該檔。更新Code.gs後須「管理部署→編輯→新增版本」才更新exec服務。不要把普通本機HTML當成cloud/Game.html，後端會檢查格式並拒絕缺少雲端占位字的檔案。

## C：GitHub Pages靜態網址

1. 解壓《未知海域_網站部署包.zip》。保持index.html在最外層，assets及其他JS、CSS與docs原位。
2. 在你有權使用的GitHub帳戶建立儲存庫，上載部署包內容；不要上載整個原始素材／私人雲端設定或教科書。
3. 在Settings→Pages選從分支部署，指定main及根目錄。等GitHub完成建置，使用Pages畫面顯示的HTTPS網址，不要猜網址。
4. 開啟遊戲網址確認圖片、按鈕及存檔，再用Google Sites「嵌入→網址」。以Sites的發布網址和學生帳戶再次檢查。

靜態版不會跨iPad同步排行榜。若要共享，改用B的Apps Script頁面。任何第三方主機都需容許iframe，不能設X-Frame-Options禁止所有內嵌。

## 常見問題

| 現象 | 處理 |
|---|---|
| 貼index.html後只有文字／空白 | 使用真正單一HTML，或上載完整網站包後嵌入網址 |
| 貼碼太大／Sites拒絕 | 使用Apps Script或靜態主機URL嵌入；不要刪除人物圖片 |
| 無聲音 | 先點開始，再看聲音設定與iPad靜音／音量；Safari禁止未互動自動播放 |
| 內嵌存檔不見 | 開完整遊戲網址，並用JSON匯出匯入；不同來源可能使用不同儲存區 |
| 課堂榜說本機版 | 目前不是Apps Script提供的頁面；開老師的exec網址 |
| 課堂碼錯誤／已關閉 | 教師核對碼、CLASS_OPEN和有效期；不要向同學索取帳戶密碼 |
| 分享成功但榜讀取失敗 | 提交確認仍保留；恢復網絡後更新排名，同一航程不重複計分 |
| setup顯示欄位不符 | 使用Scores的正確18欄標題；勿任意改欄序 |
| Google登入／政策不允許 | 使用獲學校授權的帳戶與範圍；本機版仍可遊玩 |
| 不同裝置進度不同 | 存檔不雲端同步；榜同步不等於進度同步 |
| 小螢幕內容太擠 | 橫向、放大嵌入高度，或開完整遊戲；歷史圖可按放大 |

## 官方技術參考

2026-10-31核對：[綁定腳本執行環境](https://developers.google.com/apps-script/guides/bound)、[Google Sites嵌入內容](https://support.google.com/sites/answer/90569)、[Apps Script網頁應用程式](https://developers.google.com/apps-script/guides/web)、[google.script.run](https://developers.google.com/apps-script/guides/html/reference/run)、[HTML Service iframe限制](https://developers.google.com/apps-script/guides/html/restrictions)、[Drive File getBlob](https://developers.google.com/apps-script/reference/drive/file#getBlob())。服務介面及配額可改變，部署以當時官方頁面和學校政策為準。
