/** Run teacherInitialize from this PRIVATE, Sheet-bound script editor.
 * The public entry point is visible in the editor's Run menu. It fails closed
 * outside the parent Sheet UI, including web-app / google.script.run calls.
 * Set Script Property CLASS_CODE first. No secret is embedded in this file.
 */
function teacherInitialize() {
  var active;
  try {
    SpreadsheetApp.getUi();
    active = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    throw Error('TEACHER_EDITOR_ONLY');
  }
  if (!active || active.getId() !== '1YMuz9BA8YOMnLXNq7A7W2QLPyNHav4Tv3xMfNmOOYW4') {
    throw Error('TEACHER_EDITOR_ONLY');
  }
  configureTeacherFiles_();
  return setup_();
}

function configureTeacherFiles_() {
  var props = PropertiesService.getScriptProperties();
  props.setProperty('SHEET_ID', '1YMuz9BA8YOMnLXNq7A7W2QLPyNHav4Tv3xMfNmOOYW4');
  props.setProperty('GAME_FILE_ID', '1EoZ-m9Xqcp5JfAkjE2X6zTMCHw3qqwit');
  return '已填入私人試算表及遊戲檔案ID。請設定CLASS_CODE，再執行setup_。';
}
