# 未知海域：航海家的傳奇

**v0.10.0-rc3｜2026-10-31。** 本輪以已交付的v0.9為基礎修改12項要求，保留原航海系統。這是可操作的改版候選作品；雲端實際部署與課堂實機驗收仍未完成，不標作v1.0。

## 開啟遊戲

最直接的版本是交付檔《未知海域_航海家的傳奇.html》：人物、故事圖、程式及教師資料已內嵌，不再依賴旁邊的圖片資料夾。電腦可直接開啟；iPad請使用HTTPS遊戲網址，檔案預覽器未必執行JavaScript。

完整專案內的 `index.html` 是便於修改的多檔案版本；請保持 `assets/` 及JS、CSS原位。`cloud/Game.html` 是供Google Apps Script使用的內嵌版本。

## 這次改版

- 純黑未知海域；自由出航，由實際向西／向南移動帶出故事，NPC與箭頭提示。
- 東、西各六段航程；補給提醒、退回最近經過的補給點、雙零與久無進展的平凡結局。
- 52張運行用圖片，包括提供的九張麥哲倫故事圖、九張新原創逐幕插畫。
- 21張歷史卡、事件「了解更多」、八枚成就、五種結局、七類互動小遊戲。
- 結局完整海圖和實際航跡；四位航海家的大型年份史實劇場。
- 本機五類排行榜；Google試算表共享榜程式及私人資料表已準備，須完成教師部署才會跨iPad同步。
- 單一HTML、貼碼文字、複製助手，以及完整原始碼和部署指南。

## Google Sites

可用「插入→嵌入→嵌入程式碼」貼入完整HTML。圖片使檔案約11MiB，若Google Sites拒收大段程式碼，改以遊戲網址嵌入。請勿只貼多檔案版的index.html，否則找不到圖片及腳本。

要共享排行榜，須部署Google Apps Script版，再把 `/exec` 網址嵌入Google Sites。單純貼入HTML仍是本機榜。詳細步驟見 `docs/DEPLOY_GOOGLE_SITES.html`；既有私人試算表ID記於 `cloud/DEPLOYMENT_STATE.json`，不用重建。

## 文件與續作

先閱讀 `PROJECT_STATUS.md`、`GAME_DESIGN.md`、`DEVELOPMENT_LOG.md`、`NEXT_STEPS.md`。教師資料在 `docs/TEACHER_GUIDE.html`，課本文字對照在 `docs/TEXTBOOK_ALIGNMENT.html`，測試證據與限制在 `docs/TEST_REPORT.html`。

原始遊戲在 `original/`；生成原圖在 `assets/originals/`。教科書全文不隨公開遊戲分發。程式內的歷史圖片是藝術重構，提供的漫畫文字另有同幕校訂。

## 開發與打包

遊戲無外部函式庫或安裝依賴。Node.js用於測試；Python3用於打包，Pillow只用於圖片檢查。

```bash
node --test tests/engine.test.cjs tests/cloud.test.cjs
node tools/simulate_balance.cjs
python3 build.py --release
python3 tests/assets.test.py
python3 tests/package.test.py
```

輸出在上層 `deliverables/`。`dist/`可作本機預覽；實際網站發布包排除測試場景及原圖。測試fixture是虛構紀錄，從未提交班級榜。
