# v0.10.0-rc3恢復與續作

請保留已完成改版，不要從零重做。若工作環境失去檔案，先解壓最新《未知海域_航海家的傳奇_完整專案.zip》。較早的可恢復測試備份為libfile_ccdfbf5305108191b28aa5cba96c26ad（只有最新完整包不可取用時才用）。

## 首先閱讀與核對

1. 讀PROJECT_STATUS.md、GAME_DESIGN.md、DEVELOPMENT_LOG.md、UPGRADE_REQUESTS.md及本檔。
2. 核對VERSION.txt、engine.js、game.js、history-v2.js、map.js、cloud.js與cloud/Code.gs。
3. 執行node --test tests/engine.test.cjs tests/cloud.test.cjs；預期30組及2,208次狀態驗證。
4. 執行python3 build.py，再執行tests/assets.test.py與tests/package.test.py。
5. 以tests/qa-lab.html進行尺寸／故事回歸；這是開發工具，不能放進學生部署包。

## 現在最優先：雲端實際部署

私人試算表已建立，不要重建：1YMuz9BA8YOMnLXNq7A7W2QLPyNHav4Tv3xMfNmOOYW4。

讀cloud/DEPLOYMENT_STATE.json，取得最新私人Game HTML檔ID、已完成狀態及有無exec網址。重用已建立的Apps Script專案（URL及ID在同一JSON），不另建副本。程式及SHEET_ID／GAME_FILE_ID已儲存。Google Drive工具可讀寫檔案，但沒有Apps Script部署工具；Google瀏覽器已完成登入。接續教師授權，不索取對話中的密碼，不繞過校方限制。

完成Code.gs、Game.html或GAME_FILE_ID設定，教師選課堂碼，從編輯器選teacherInitialize執行（Teacher_Setup.gs提供的受保護入口）、部署exec服務。先用兩個獨立瀏覽器匿名測試提交／查榜／重複提交／錯碼，再在兩部iPad及發布Sites驗證。成功後才更新狀態為已部署，並把真實URL放入教師嵌入指引。不要把模擬伺服器測試當作已跨iPad同步。

## 必須保留的成果

52張運行圖片、原圖、九張用戶提供麥哲倫圖及九張新增歷史插畫。原東部海圖／核心玩法保留。schema20支援schema10遷移；原始v3存檔不支援。結算快照不可被結局後讀卡改分。歷史圖中錯誤須同幕校訂；課本全文不放進公開網站包。

## 版本與持續保存

目前Git分支upgrade/v0.10-classroom；v0.9.0-rc1為原基礎標記。完整包保存原始碼、原遊戲、設計和開發紀錄；若恢復環境不含.git，可在核對後git init並提交恢復快照，勿誤稱舊Git物件已在包內。git版本摘要另存VERSION_HISTORY.txt。

每完成重要改動即保存檔案、更新狀態、測試、git提交並重新打包完整ZIP及單一HTML。交付檔已持久保存，但不保證額度恢復後自動在背景工作；由用戶說「繼續」並提供最新包便可重新核對後續做。

## 仍待課堂驗收

15–30分鐘為設計目標，120局模擬不是人類時長；需學生試玩校準。真實iPad的觸控、音訊、記憶體、存檔匯入匯出及Sites iframe尚待測試。已知沒有未修正的本機重大邏輯錯誤；不等於已完成所有設備與雲端驗收。
