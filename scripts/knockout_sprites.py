from collections import deque
from PIL import Image
import os

src_dir = r"C:\Users\FanBin\.cursor\projects\c-Users-FanBin-Documents-trae-projects-sanguo-cards\assets"
out_dir = r"C:\Users\FanBin\Documents\trae_projects\sanguo-cards\public\sprites"
os.makedirs(out_dir, exist_ok=True)
ids = [
    "zhaoyun", "guanyu", "zhangfei", "liubei", "machao",
    "zhugeliang", "huangzhong", "ganning", "xiaoqiao", "caiwenji",
    "lukang", "dongzhuo", "huaxiong", "caocao", "lvbu",
    "zhouyu", "diaochan", "zhangliao",
    "dianwei", "taishici", "huatuo", "huangyueying",
    "xiahoudun", "luxun", "guojia", "sunquan",
    "simayi", "sunce", "zhenji", "jiangwei", "zhangjiao", "pangtong", "xuchu", "daqiao",
    "lvmeng", "yuanshao", "huanggai", "guanping", "weiyan", "fazheng", "madai", "xiahouyuan",
    "xunyu", "caoren", "zhoutai", "lusu", "lingtong", "sunshangxiang", "jiaxu", "yanliang",
]

def dist(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1]) + abs(a[2] - b[2])

for i in ids:
    im = Image.open(os.path.join(src_dir, i + "-chibi.jpg")).convert("RGBA")
    w, h = im.size
    px = im.load()
    corners = [px[2, 2][:3], px[w - 3, 2][:3], px[2, h - 3][:3], px[w - 3, h - 3][:3]]
    bg = tuple(sum(c[k] for c in corners) // 4 for k in range(3))
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))
    tol = 52
    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h:
            continue
        idx = x * h + y
        if seen[idx]:
            continue
        seen[idx] = 1
        c = px[x, y]
        if dist(c, bg) <= tol:
            px[x, y] = (c[0], c[1], c[2], 0)
            q.append((x + 1, y))
            q.append((x - 1, y))
            q.append((x, y + 1))
            q.append((x, y - 1))
    # crop to opaque pixels
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 16:
                if x < minx: minx = x
                if y < miny: miny = y
                if x > maxx: maxx = x
                if y > maxy: maxy = y
    pad = 8
    box = (max(0, minx - pad), max(0, miny - pad), min(w, maxx + pad), min(h, maxy + pad))
    im = im.crop(box)
    im.save(os.path.join(out_dir, i + ".png"))
    print(i, "bg", bg, "crop", box, "out", im.size)
