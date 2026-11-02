# Google班級排行榜部署包

此包包含可部署程式，尚未在教師帳戶授權發布。現有Apps Script專案、私人試算表和Game HTML檔記錄於DEPLOYMENT_STATE.json，請重用它們。

1. 打開現有試算表「擴充功能→Apps Script」。貼入Code.gs；新增Teacher_Setup.gs並貼入同名檔。若此包尚未有Teacher_Setup，改在指令碼屬性填SHEET_ID與GAME_FILE_ID。
2. 在專案設定的指令碼屬性加CLASS_CODE（自行選6–32位英文、數字、底線或連字號，不要用帳戶密碼）。
3. 從編輯器函式選單選teacherInitialize並執行。這是Teacher_Setup.gs的教師入口；底線結尾的setup_不會出現在選單。按Google畫面由教師確認授權，試算表及Game檔保持私人。
4. 部署為網頁應用程式、以教師執行，存取範圍依校規決定。複製正式exec網址；不使用dev網址給學生。
5. 兩個獨立瀏覽器以相同課堂碼測試：一方分享已完成航程，另一方更新排名；先確認成功再嵌入Google Sites。
6. Google Sites「插入→嵌入→網址」，貼exec網址。另放「開啟完整遊戲」按鈕。詳閱DEPLOY_GOOGLE_SITES.html。

Game.html較大，可用已上載的私人Drive檔（GAME_FILE_ID）由伺服器讀取；替代方式是在Apps Script新增Game HTML檔並貼全文，不設GAME_FILE_ID。普通本機HTML沒有雲端占位字，不能代替此檔。

課堂預設30日到期；CLASS_OPEN=false可停止讀寫。要重新開始有效期，先刪CLASS_EXPIRES再跑teacherInitialize。更新碼時先加CLASS_CODE再跑teacherInitialize。初始化保留分數，不刪除Scores。

學生不需取得表格編輯權；提交只含匿名代號與計分欄位，反思及完整日誌不傳上雲端。程式只提供基本去重、輸入檢查及重算分數，不能完全防作弊。不適合高風險評核。

驗收後請把exec網址、部署版本及兩客戶端／iPad測試結果記入DEPLOYMENT_STATE.json及PROJECT_STATUS.md。

教師入口會先檢查綁定試算表的UI環境及檔案ID；網頁應用程式呼叫會被拒絕，不會開啟已關閉課堂。請使用由排行榜試算表建立的綁定專案。複製給另一位教師時須修改Teacher_Setup.gs內的兩個檔案ID及檢查用的試算表ID。
