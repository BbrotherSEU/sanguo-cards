# 用 fontTools 读 woff2 的真实 cmap，验证游戏用到的汉字是否都有字形
import os, re, glob
from fontTools.ttLib import TTFont

# 收集源码里用到的汉字
need = set()
for root in ('src', 'server'):
    for dirpath, _, files in os.walk(root):
        for fn in files:
            if fn.rsplit('.', 1)[-1] in ('ts', 'tsx', 'js', 'html', 'css', 'json'):
                with open(os.path.join(dirpath, fn), encoding='utf8') as f:
                    need.update(c for c in f.read() if '一' <= c <= '鿿')
with open('index.html', encoding='utf8') as f:
    need.update(c for c in f.read() if '一' <= c <= '鿿')
need = sorted(need)
print(f'源码汉字: {len(need)} 个')

fonts = sorted(glob.glob('public/fonts/*.woff2'))
# 按 family 归并各批次，统计每族的联合覆盖
fams = {}
for fp in fonts:
    fam = re.match(r'(noto-serif-sc|zcool-xiaowei)-\d+-\d+\.woff2', os.path.basename(fp))
    if not fam: continue
    fams.setdefault(fam.group(1), []).append(fp)

ok_all = True
for fam, files in sorted(fams.items()):
    cover = set()
    for fp in files:
        t = TTFont(fp, fontNumber=0, lazy=True)
        for table in t['cmap'].tables:
            cover.update(table.cmap.keys())
        t.close()
    missing = [c for c in need if ord(c) not in cover]
    size = sum(os.path.getsize(fp) for fp in files)
    status = 'PASS' if not missing else f'缺 {len(missing)} 字'
    if missing: ok_all = False
    print(f'{fam:16s} {len(files)} 个文件  共 {size//1024} KB  覆盖 {len(cover)} 字形  → {status}')
    if missing:
        print('   缺:', ''.join(missing[:30]))

print('\n总体:', 'PASS' if ok_all else 'FAIL')
