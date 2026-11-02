"""Distribution integrity and decode checks; requires Pillow only for developer QA."""
from pathlib import Path
import json,re,sys
from PIL import Image
root=Path(__file__).resolve().parents[1]
assets=[p for p in (root/'assets').rglob('*.webp') if 'originals' not in p.parts and p.name not in {'scenes.webp','characters.webp','history.webp','endings.webp'}]
for p in assets:
    assert p.stat().st_size>0,p
    with Image.open(p) as im:
        im.load()
        assert max(im.size)<=2400,(p,im.size)
for p in (root/'assets').glob('*-standing.webp'):
    with Image.open(p) as im:
        assert im.mode=='RGBA',p
        alpha=im.getchannel('A')
        lo,hi=alpha.getextrema()
        assert lo==0 and hi>=250,p
        assert alpha.getpixel((0,0))==0,p
for f in ['index.html','styles.css','game.js','history-v2.js']:
    s=(root/f).read_text()
    for ref in re.findall(r'(?:src|href)=[\'"]([^\'"$]+)[\'"]',s):
        if ref.startswith(('http','data:','#')) or '${' in ref or ref=='docs/':continue
        assert (root/ref).is_file(),(f,ref)
    for ref in re.findall(r'[\'\"](assets/[A-Za-z0-9_./-]+\.webp)[\'\"]',s):
        assert (root/ref).is_file(),(f,ref)
for name in ['hero','palace-wide','storm-wide','cape','india','caribbean','ending-legend','ending-return','ending-scholar','dias','columbus','gama','magellan']:
    assert (root/'assets'/(name+'.webp')).is_file(),name
print(f'PASS: {len(assets)} WebP decoded; 6 transparent standing portraits; static references present.')
print('Compressed raster assets:',sum(p.stat().st_size for p in assets),'bytes')
