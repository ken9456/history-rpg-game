"""Assemble offline/static releases without build dependencies.
Run: python3 build.py [--release]. Does not publish or transfer user data.
"""
from pathlib import Path
import shutil, sys, zipfile, json, hashlib, runpy
ROOT=Path(__file__).resolve().parent
DIST=ROOT/'dist'
runpy.run_path(str(ROOT/'tools/render_guides.py'),run_name='__main__')
DIST.mkdir(exist_ok=True)
for child in DIST.iterdir():
    if child.is_dir() and not child.is_symlink():shutil.rmtree(child)
    else:child.unlink()
for name in ('index.html','styles.css','map-data.js','map.js','content.js','history-v2.js','cloud.js','engine.js','game.js','audio.js'):
    shutil.copy2(ROOT/name,DIST/name)
shutil.copytree(ROOT/'assets',DIST/'assets',dirs_exist_ok=True,ignore=shutil.ignore_patterns('originals','*.png','scenes.webp','characters.webp','history.webp','endings.webp'))
shutil.copytree(ROOT/'docs',DIST/'docs',dirs_exist_ok=True)
test_target=DIST/'tests';test_target.mkdir(exist_ok=True)
shutil.copy2(ROOT/'tests/browser-harness.html',test_target/'browser-harness.html')
(DIST/'.nojekyll').write_text('')
runpy.run_path(str(ROOT/'tools/pack_single.py'),run_name='__main__')
shutil.copy2(ROOT/'tools/copy_embed.html',ROOT.parent/'deliverables/Google_Sites_貼碼助手.html')
for p in (ROOT/'tests').glob('*.fixture.json'):shutil.copy2(p,test_target/p.name)
shutil.copy2(ROOT/'tests/qa-lab.html',test_target/'qa-lab.html')
if '--release' in sys.argv:
    out=ROOT.parent/'deliverables';out.mkdir(exist_ok=True)
    with zipfile.ZipFile(out/'未知海域_航海家的傳奇_完整專案.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in ROOT.rglob('*'):
            if not p.is_file() or any(part in ('.git','dist','__pycache__') for part in p.relative_to(ROOT).parts):continue
            z.write(p,'未知海域_航海家的傳奇/'+p.relative_to(ROOT).as_posix())
        for name in ['未知海域_航海家的傳奇.html','Google_Sites_貼碼助手.html','未知海域_教師與部署指南.html']:
            z.write(out/name,'未知海域_航海家的傳奇/'+name)
    with zipfile.ZipFile(out/'未知海域_網站部署包.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in DIST.rglob('*'):
            if p.is_file() and 'tests' not in p.relative_to(DIST).parts and p.name!='single.html':z.write(p,p.relative_to(DIST).as_posix())
    with zipfile.ZipFile(out/'Google_Sites_完整貼碼工具.zip','w',zipfile.ZIP_DEFLATED) as z:
        for name in ['Google_Sites_完整貼碼.txt','Google_Sites_貼碼助手.html']:
            z.write(out/name,name)
        z.write(ROOT/'docs/DEPLOY_GOOGLE_SITES.html','部署指南.html')
    with zipfile.ZipFile(out/'未知海域_Google雲端部署包.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in (ROOT/'cloud').iterdir():
            if p.is_file():z.write(p,p.name)
        z.write(ROOT/'docs/DEPLOY_GOOGLE_SITES.html','DEPLOY_GOOGLE_SITES.html')
    names=['未知海域_航海家的傳奇_完整專案.zip','未知海域_網站部署包.zip','Google_Sites_完整貼碼工具.zip','未知海域_Google雲端部署包.zip','未知海域_航海家的傳奇.html','未知海域_教師與部署指南.html']
    hashes={name:hashlib.sha256((out/name).read_bytes()).hexdigest() for name in names}
    (out/'SHA256SUMS.json').write_text(json.dumps(hashes,ensure_ascii=False,indent=2),encoding='utf-8')
print('Static files ready:',DIST)
