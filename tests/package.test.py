"""Verify actual deliverable HTML: decoded assets, embedded guides and script syntax."""
from pathlib import Path
from html.parser import HTMLParser
import base64, json, re, subprocess, io
from PIL import Image
R=Path(__file__).resolve().parents[1]
p=R.parent/'deliverables/未知海域_航海家的傳奇.html'
s=p.read_text()
class Page(HTMLParser):
    def __init__(self): super().__init__();self.scripts=[];self.active=False;self.external=[];self.ids=[]
    def handle_starttag(self,t,a):
        a=dict(a)
        if 'id' in a:self.ids.append(a['id'])
        if t=='script':
            assert not a.get('src'),a
            self.active=True;self.scripts.append('')
        if t in ['img','link','audio','source']:
            u=a.get('src') or a.get('href')
            if u and not u.startswith(('data:','#')):self.external.append((t,u))
    def handle_endtag(self,t):
        if t=='script':self.active=False
    def handle_data(self,d):
        if self.active:self.scripts[-1]+=d
page=Page();page.feed(s)
assert len(page.scripts)==9,len(page.scripts)
assert not page.external,page.external
assert len(page.ids)==len(set(page.ids)), 'duplicate HTML IDs'
for i,code in enumerate(page.scripts):
    result=subprocess.run(['node','--check','-'],input=code,text=True,capture_output=True)
    assert result.returncode==0,(i,result.stderr)
assets=json.loads(re.search(r'window.VoyageAssets=(.*?);window.VoyageGuides=',s).group(1))
assert len(assets)==52,len(assets)
for name,data in assets.items():
    raw=base64.b64decode(data.split(',',1)[1],validate=True)
    assert raw==(R/name).read_bytes(),name
    with Image.open(io.BytesIO(raw)) as im:im.load()
guides=json.loads(re.search(r'window.VoyageGuides=(.*?);window.VOYAGE_CLOUD_URL=',s).group(1))
assert set(guides)=={v+'.html' for v in ['TEACHER_GUIDE','DEPLOY_GOOGLE_SITES','HISTORY_SOURCES','TEST_REPORT','TEXTBOOK_ALIGNMENT']}
assert 'v0.10.0-rc3' in guides['TEACHER_GUIDE.html']
assert not re.search(r'<script[^>]+src=|<link[^>]+styles.css',s)
assert '__CLOUD_EXEC_URL__' not in s
cloud=(R/'cloud/Game.html').read_text()
assert cloud.count('__CLOUD_EXEC_URL__')==1
assert cloud.replace('__CLOUD_EXEC_URL__','')==s
assert (R.parent/'deliverables/Google_Sites_完整貼碼.txt').read_bytes()==p.read_bytes()
assert 'setLineDash([6' not in (R/'map.js').read_text()
print(f'PASS: 9 inline scripts compile; 52 embedded images equal source bytes; 5 guides; no external static dependencies; {len(s.encode()):,} bytes.')
