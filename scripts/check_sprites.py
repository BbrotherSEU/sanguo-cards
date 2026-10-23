import os
import re

ids = set()
for fn in ["src/data/heroes.ts", "src/data/moreHeroes.ts"]:
    text = open(fn, encoding="utf-8").read()
    ids.update(re.findall(r"id: '([a-z]+)'", text))
ids -= {"taoyuan", "wushuang", "chibi", "weiwu", "jiangdong"}
pngs = {os.path.splitext(f)[0] for f in os.listdir("public/sprites")}
print("heroes", len(ids), "pngs", len(pngs))
print("missing", sorted(ids - pngs))
print("extra", sorted(pngs - ids))
