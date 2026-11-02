"""Build one HTML with every runtime image, script and teacher guide embedded.
No network fetches or build dependencies. Source images remain unchanged.
"""
from pathlib import Path
import base64, json, re

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ['map-data.js','content.js','history-v2.js','cloud.js','engine.js','map.js','audio.js','game.js']
UNUSED = {'scenes.webp','characters.webp','history.webp','endings.webp'}

def js_json(value):
    return json.dumps(value,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c').replace('\u2028','\\u2028').replace('\u2029','\\u2029')

def build():
    assets = {}
    for p in sorted((ROOT/'assets').rglob('*.webp')):
        if 'originals' in p.parts or p.name in UNUSED: continue
        assets[p.relative_to(ROOT).as_posix()] = 'data:image/webp;base64,'+base64.b64encode(p.read_bytes()).decode('ascii')
    css = (ROOT/'styles.css').read_text()
    # Store each bitmap once. CSS uses variables; HTML's static img gets its src during bootstrap.
    css = re.sub(r"url\(['\"]?(assets/[^)'\"]+)['\"]?\)",lambda m:'var(--asset-'+Path(m[1]).stem+')',css)
    doc = (ROOT/'index.html').read_text()
    doc = doc.replace('<link rel="stylesheet" href="styles.css">','<style>'+css+'</style>')
    doc = re.sub(r'<script defer src="[^"]+"></script>','',doc)
    doc = re.sub(r'src="(assets/[^"]+)"',r'data-asset="\1"',doc)
    guides = {}
    for name in ['TEACHER_GUIDE','DEPLOY_GOOGLE_SITES','HISTORY_SOURCES','TEST_REPORT','TEXTBOOK_ALIGNMENT']:
        p=ROOT/'docs'/(name+'.html')
        if p.exists():
            text=p.read_text()
            text=re.sub(r'<nav>.*?</nav>','',text,flags=re.S)
            guides[name+'.html']=text
    bootstrap = 'window.VoyageAssets='+js_json(assets)+';window.VoyageGuides='+js_json(guides)+';window.VOYAGE_CLOUD_URL="__VOYAGE_URL__";\n'
    bootstrap += "for(const [p,u] of Object.entries(VoyageAssets)){const name=p.split('/').pop().replace(/\\.webp$/,'');document.documentElement.style.setProperty('--asset-'+name,'url(\"'+u+'\")');}document.querySelectorAll('[data-asset]').forEach(el=>{el.src=VoyageAssets[el.dataset.asset];});\n"
    bootstrap += "window.addEventListener('error',e=>{const b=document.getElementById('boot');if(b&&!b.classList.contains('hidden')){b.textContent='遊戲未能啟動。請重新下載完整HTML；如貼碼失敗，使用教師提供的完整遊戲網址。';}});\n"
    parts=['<script>'+bootstrap+'</script>']
    for name in SCRIPTS:
        code=(ROOT/name).read_text()
        # Raw HTML end tags must never terminate the embedding script.
        code=re.sub(r'</script',r'<\\/script',code,flags=re.I)
        parts.append('<script>\n/* '+name+' */\n'+code+'\n</script>')
    doc=doc.replace('</body>','\n'.join(parts)+'\n</body>')
    out=ROOT.parent/'deliverables';out.mkdir(exist_ok=True)
    standalone=doc.replace('__VOYAGE_URL__','')
    (out/'未知海域_航海家的傳奇.html').write_text(standalone)
    (ROOT/'cloud/Game.html').write_text(doc.replace('__VOYAGE_URL__','__CLOUD_EXEC_URL__'))
    (ROOT/'dist/single.html').write_text(standalone)
    (out/'Google_Sites_完整貼碼.txt').write_text(standalone)
    return {'images':len(assets),'bytes':len(standalone.encode()),'guides':len(guides)}

if __name__=='__main__':print(build())
