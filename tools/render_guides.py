"""Render this project's simple Markdown guides using only Python's standard library."""
from pathlib import Path
from html import escape
import re
ROOT=Path(__file__).resolve().parents[1]
def inline(t):
    t=escape(t)
    t=re.sub(r'`([^`]+)`',r'<code>\1</code>',t)
    t=re.sub(r'\*\*([^*]+)\*\*',r'<strong>\1</strong>',t)
    def link(m):
        url=m[2]
        if url.endswith('.md'):url=url[:-3]+'.html'
        if not (url.startswith(('https://','http://')) or re.fullmatch(r'[\w./-]+',url)):return m[1]
        return f'<a href="{url}" target="_blank" rel="noopener">{m[1]}</a>'
    return re.sub(r'\[([^]]+)\]\(([^)]+)\)',link,t)
def render(s):
    out=[];lines=s.splitlines();i=0
    while i<len(lines):
        line=lines[i].strip()
        if not line:i+=1;continue
        if line.startswith('```'):
            code=[];i+=1
            while i<len(lines) and not lines[i].startswith('```'):code.append(lines[i]);i+=1
            out.append('<pre><code>'+escape('\n'.join(code))+'</code></pre>');i+=1;continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                row=lines[i].strip().strip('|').split('|')
                if not all(re.fullmatch(r'\s*:?-+:?\s*',c) for c in row):rows.append(row)
                i+=1
            out.append('<div class="table-wrap"><table><thead><tr>'+''.join('<th>'+inline(c.strip())+'</th>' for c in rows[0])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+inline(c.strip())+'</td>' for c in row)+'</tr>' for row in rows[1:])+'</tbody></table></div>');continue
        heading=re.match(r'^(#{1,6})\s+(.*)',line)
        if heading:
            n=len(heading[1]);out.append(f'<h{n}>'+inline(heading[2])+f'</h{n}>');i+=1;continue
        if re.match(r'^([-*]|\d+\.)\s+',line):
            ordered=bool(re.match(r'^\d+\.',line));tag='ol' if ordered else 'ul';items=[]
            while i<len(lines) and re.match(r'^(?:[-*]|\d+\.)\s+',lines[i].strip()):
                items.append(re.sub(r'^(?:[-*]|\d+\.)\s+','',lines[i].strip()));i+=1
            out.append(f'<{tag}>'+''.join('<li>'+inline(v)+'</li>' for v in items)+f'</{tag}>');continue
        out.append('<p>'+inline(line)+'</p>');i+=1
    return '\n'.join(out)
STYLE='''*{box-sizing:border-box}body{margin:0;background:#ede9de;color:#213d45;font:16px/1.9 -apple-system,BlinkMacSystemFont,"Noto Sans TC","PingFang TC",sans-serif}header{background:#103842;color:#f4e8c9;padding:30px max(6vw,24px)}header b{font-size:24px;font-family:serif}header p{margin:5px 0;font-size:13px}nav{margin-top:14px;display:flex;gap:15px;flex-wrap:wrap}nav a,nav button{font:inherit;font-size:14px;color:#eed6a2;background:transparent;border:1px solid #a18f66;padding:6px 16px;text-decoration:none;min-height:44px;border-radius:4px}main{max-width:1050px;margin:32px auto;background:#fffdf7;padding:clamp(20px,5vw,52px);border-top:4px solid #ba9a59;box-shadow:0 6px 40px #173b4210}h1,h2,h3{font-family:serif;line-height:1.4;break-after:avoid}h1{font-size:32px}h2{font-size:25px;margin:34px 0 14px;border-bottom:1px solid #d3c5a6;padding-bottom:9px}h3{font-size:20px}p{margin:13px 0}li{padding:5px 0}a{color:#146477;overflow-wrap:anywhere}code{background:#eee9dd;padding:2px 5px;border-radius:4px;font-size:13px}pre{background:#14343d;color:#fff;padding:18px;overflow:auto}pre code{background:none}.table-wrap{overflow:auto}table{border-collapse:collapse;width:100%;margin:18px 0;font-size:14px}th,td{border:1px solid #d6ccb6;text-align:left;padding:11px 13px;vertical-align:top}th{background:#e8dfcc;color:#29434a}tr:nth-child(even){background:#f7f3e9}footer{text-align:center;font-size:12px;padding:20px;color:#6e756c}section+section{margin-top:60px;padding-top:15px;border-top:4px solid #ba9a59}@media print{body{background:white;font-size:11pt}header,nav,footer{display:none}main{margin:0;padding:0;box-shadow:none;border:0}table{font-size:9pt}tr{break-inside:avoid}a{color:inherit;text-decoration:none}section+section{break-before:page}.table-wrap{overflow:visible}}'''
def document(title,body,nav=True):
    return '<!doctype html><html lang="zh-Hant-HK"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+'</title><style>'+STYLE+'</style><header><b>未知海域：航海家的傳奇</b><p>教師與開發資料 · v0.10.0-rc3 改版候選作品 · 2026-10-31</p><nav>'+('<a href="../index.html">返回遊戲</a>' if nav else '')+'<button onclick="window.print()">列印／儲存為 PDF</button></nav></header><main>'+body+'</main><footer>實際測試範圍請以測試報告為準。學生進度預設只保存在當前瀏覽器。</footer></html>'
if __name__=='__main__':
    for p in (ROOT/'docs').glob('*.md'):
        p.with_suffix('.html').write_text(document(p.stem,render(p.read_text())),encoding='utf-8')
    parts=['TEACHER_GUIDE','DEPLOY_GOOGLE_SITES','TEXTBOOK_ALIGNMENT','HISTORY_SOURCES','TEST_REPORT']
    if all((ROOT/'docs'/(v+'.md')).exists() for v in parts):
        body=''.join('<section>'+render((ROOT/'docs'/(v+'.md')).read_text())+'</section>' for v in parts)
        out=ROOT.parent/'deliverables';out.mkdir(exist_ok=True)
        (out/'未知海域_教師與部署指南.html').write_text(document('未知海域：教師與部署指南',body,False),encoding='utf-8')
    print('HTML guides rendered.')
