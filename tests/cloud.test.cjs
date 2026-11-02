'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),path=require('node:path');
const root=path.join(__dirname,'..');const plain=x=>JSON.parse(JSON.stringify(x));
function service(){
 const props=new Map(),rows=[],cache=new Map();let locked=false;
 const sheet={getLastRow:()=>rows.length,setFrozenRows(){},setColumnWidth(){},getRange(r,c,h,w){return{getValues:()=>Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>rows[r+y-1]?.[c+x-1]??'')),setValues(vals){vals.forEach((line,y)=>{rows[r+y-1]||=[];line.forEach((v,x)=>rows[r+y-1][c+x-1]=v);});return this;},setBackground(){return this;},setFontColor(){return this;},setFontWeight(){return this;}};}};
 const book={getId:()=> 'test-sheet',getSheetByName:n=>n==='Scores'?sheet:null,insertSheet:()=>sheet};
 const propAPI={getProperty:k=>props.get(k)??null,setProperty(k,v){props.set(k,String(v));return this;},deleteProperty:k=>props.delete(k)};
 const c={console,PropertiesService:{getScriptProperties:()=>propAPI},SpreadsheetApp:{getActiveSpreadsheet:()=>book,openById:()=>book,flush(){}},Utilities:{getUuid:()=>crypto.randomUUID(),DigestAlgorithm:{SHA_256:'sha256'},Charset:{UTF_8:'utf8'},computeDigest:(_,s)=>[...crypto.createHash('sha256').update(s).digest()]},LockService:{getScriptLock:()=>({tryLock(){if(locked)return false;locked=true;return true;},hasLock:()=>locked,releaseLock:()=>{locked=false;}})},CacheService:{getScriptCache:()=>({get:k=>cache.get(k)||null,put:(k,v)=>cache.set(k,v)})}};
 vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'cloud/Code.gs'),'utf8'),c);
 props.set('CLASS_CODE','OceanClass');c.setup_();return{c,rows,props};
}
function client(service){const c={setTimeout,clearTimeout};c.window=c;c.google={script:{run:{withSuccessHandler(success){return{withFailureHandler(fail){return new Proxy({}, {get:(_,method)=>payload=>{try{success(plain(service.c[method](plain(payload))));}catch(e){fail(e);}}});}};}}}};vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'cloud.js'),'utf8'),c);return c.VoyageCloud;}
function state(name='海燕01',id='v-test-run-001'){const s=JSON.parse(fs.readFileSync(path.join(__dirname,'west-complete.fixture.json'),'utf8')).state;s.id=id;s.name=name;return s;}
test('two independent clients share server rows, five categories and route filters',async()=>{
 const srv=service(),a=client(srv),b=client(srv);assert.ok(a.available());assert.equal((await a.ping()).ready,true);
 const s=state();const ack=await a.submit(s,'OceanClass',s.name);assert.equal(ack.status,'stored');assert.equal(srv.rows.length,2);const s2=state('海浪02','v-test-run-002');s2.result.days+=2;await b.submit(s2,'OceanClass',s2.name);
 for(const metric of ['score','days','places','cards','obstacles']){const board=await b.board('OceanClass',metric,'west');assert.equal(board.rows.length,2);assert.ok(board.rows.some(r=>r.alias==='海燕01'));assert.equal(board.rows[0].rank,1);}
 assert.equal((await a.board('OceanClass','score','east')).rows.length,0);assert.equal((await a.board('OceanClass','days')).rows[0].alias,'海燕01');
 assert.equal(srv.rows[1][11],Math.min(100,30+Math.min(25,s.result.cards.length*2)+Math.min(20,s.result.places.length*2)+Math.min(15,s.result.resolved.length*3)+Math.min(10,s.result.improvements.length*5)));
});
test('same run retry is idempotent, changed result cannot overwrite',async()=>{const srv=service(),a=client(srv),s=state();const first=await a.submit(s,'OceanClass',s.name),again=await a.submit(s,'OceanClass',s.name);assert.equal(again.status,'duplicate');assert.equal(first.receipt,again.receipt);assert.equal(srv.rows.length,2);s.result.days++;await assert.rejects(a.submit(s,'OceanClass',s.name),/已提交另一份/);assert.equal(srv.rows.length,2);});
test('server rejects formula injection, arbitrary fields, duplicate/unknown IDs and invalid completion',()=>{
 const srv=service(),a=client(srv),base=a.payload(state(),'OceanClass','測試03');for(const mutate of [p=>p.alias='=1+1',p=>p.alias='@evil',p=>p.days=-1,p=>p.steps=999999,p=>p.elapsedSeconds=1900,p=>p.score=100,p=>p.cards.push(p.cards[0]),p=>p.cards=['invented'],p=>p.ending='ordinary',p=>p.places=['lisbon'],p=>p.gameVersion='fake']){const p=plain(base);mutate(p);assert.equal(srv.c.voyageSubmit(p).code,'INVALID_INPUT');}assert.equal(srv.rows.length,1);
});
test('class credentials stay server-side; closed and expired classrooms deny reads/writes',async()=>{const srv=service(),a=client(srv);assert.ok(!srv.props.has('CLASS_CODE'));assert.ok(srv.props.has('CLASS_HASH'));await assert.rejects(a.board('WrongClass'),/不正確/);srv.props.set('CLASS_OPEN','false');await assert.rejects(a.submit(state(),'OceanClass','測試04'),/關閉或到期/);srv.props.set('CLASS_OPEN','true');srv.props.set('CLASS_EXPIRES','1');await assert.rejects(a.board('OceanClass'),/關閉或到期/);const ping=await a.ping();assert.ok(!JSON.stringify(ping).includes('CLASS_HASH'));});
test('board does not expose run IDs, receipts, class hash or reflections',async()=>{const srv=service(),a=client(srv);await a.submit(state(),'OceanClass','測試05');const row=(await a.board('OceanClass')).rows[0];assert.deepEqual(Object.keys(row).sort(),['alias','cards','days','ending','obstacles','places','rank','route','score']);});
test('plain HTML never claims a cloud submit succeeded without the Apps Script bridge',async()=>{const c={setTimeout,clearTimeout};c.window=c;vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,'cloud.js'),'utf8'),c);assert.equal(c.VoyageCloud.available(),false);await assert.rejects(c.VoyageCloud.submit(state(),'OceanClass','測試06'),/本機版/);});
test('web app serves the configured private HTML and inserts only its public deployment URL',()=>{const srv=service(),html=fs.readFileSync(path.join(root,'cloud/Game.html'),'utf8');srv.props.set('GAME_FILE_ID','private-html');srv.c.DriveApp={getFileById(id){assert.equal(id,'private-html');return{getBlob:()=>({getDataAsString:()=>html})};}};srv.c.ScriptApp={getService:()=>({getUrl:()=> 'https://script.google.com/macros/s/test/exec'})};srv.c.HtmlService={XFrameOptionsMode:{ALLOWALL:'all'},createHtmlOutput(value){return{value,setTitle(){return this;},addMetaTag(){return this;},setXFrameOptionsMode(){return this;}};}};const out=srv.c.doGet();assert.ok(out.value.includes('https://script.google.com/macros/s/test/exec'));assert.ok(!out.value.includes('__CLOUD_EXEC_URL__'));assert.ok(!out.value.includes('private-html'));assert.ok(!out.value.includes('OceanClass'));});
test('teacher initialization rejects web-app and wrong-container calls before changing settings',()=>{
 const srv=service();vm.runInContext(fs.readFileSync(path.join(root,'cloud/Teacher_Setup.gs'),'utf8'),srv.c);
 srv.props.set('CLASS_OPEN','false');const before=JSON.stringify([...srv.props]);
 srv.c.SpreadsheetApp.getUi=()=>{throw Error('Cannot call getUi from this context');};
 assert.throws(()=>srv.c.teacherInitialize(),/TEACHER_EDITOR_ONLY/);assert.equal(JSON.stringify([...srv.props]),before);
 srv.c.SpreadsheetApp.getUi=()=>({});assert.throws(()=>srv.c.teacherInitialize(),/TEACHER_EDITOR_ONLY/);assert.equal(JSON.stringify([...srv.props]),before);
 srv.c.SpreadsheetApp.getActiveSpreadsheet=()=>({getId:()=> '1YMuz9BA8YOMnLXNq7A7W2QLPyNHav4Tv3xMfNmOOYW4'});
 assert.match(srv.c.teacherInitialize(),/已初始化/);assert.equal(srv.props.get('CLASS_OPEN'),'true');assert.equal(srv.rows.length,1);
});
