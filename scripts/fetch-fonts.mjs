/**
 * 生成本地字体：把游戏实际用到的字符做成 woff2 子集，落到 public/fonts/
 * 目的：
 *  1) 去掉 fonts.googleapis.com 依赖（国内访问会失败/超时）
 *  2) 体积可控（按需子集，而不是 100+ 个 unicode-range 分片）
 *
 * 注意：Google 的 text= 参数有 URL 长度上限（实测 ~10KB 之后会静默返回
 * 不完整的子集，~18KB 直接 400），所以按字符数分批下载，
 * 每个批次一个 woff2，用 unicode-range 精确声明各自覆盖的字符。
 *
 * 用法：node scripts/fetch-fonts.mjs
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const OUT_DIR = 'public/fonts'
const OUT_CSS = 'src/ui/fonts.css'

// 字重与 style.css 用到的一致
const FAMILIES = [
  { family: 'Noto Serif SC', slug: 'noto-serif-sc', weights: [400, 500, 600, 700, 800] },
  { family: 'ZCOOL XiaoWei', slug: 'zcool-xiaowei', weights: [400] },
]

/** 单批次的字符数上限（保守取值，实测 800 字 → URL 约 7.3KB，仍在安全区） */
const BATCH_CHARS = 700

/** 收集游戏里出现过的全部字符（含数据文件里的名字/技能描述） */
async function collectChars() {
  const set = new Set()
  const walk = async (dir) => {
    for (const e of await readdir(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) await walk(p)
      else if (['.ts', '.tsx', '.js', '.html', '.css', '.json'].includes(extname(e.name))) {
        for (const ch of await readFile(p, 'utf8')) set.add(ch)
      }
    }
  }
  await walk('src')
  await walk('server')
  for (const ch of await readFile('index.html', 'utf8')) set.add(ch)
  // 数字/字母/常用标点与符号一律保留，避免动态文本缺字
  for (let i = 32; i < 127; i++) set.add(String.fromCharCode(i))
  for (const ch of '、。，！？；：“”‘’（）【】《》…—·×÷±≤≥←→↑↓★☆♦♠♥■□▲▼◀▶※¥%‰°′″①②③④⑤⑥⑦⑧⑨⑩') set.add(ch)
  return [...set].sort()
}

const all = await collectChars()
console.log(`游戏用到的字符数: ${all.length}`)

await mkdir(OUT_DIR, { recursive: true })
for (const f of await readdir(OUT_DIR)) {
  if (f.endsWith('.woff2')) await writeFile(join(OUT_DIR, f), Buffer.alloc(0))
}

const faces = []
let totalBytes = 0

for (const { family, slug, weights } of FAMILIES) {
  for (const weight of weights) {
    for (let i = 0; i < all.length; i += BATCH_CHARS) {
      const batch = all.slice(i, i + BATCH_CHARS)
      const url =
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
        `&text=${encodeURIComponent(batch.join(''))}&display=swap`
      const res = await fetch(url, { headers: { 'user-agent': UA } })
      if (!res.ok) throw new Error(`拉取 ${family} ${weight} 批次${i} 失败: ${res.status}`)
      const css = await res.text()

      const src = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\('woff2'\)/)
      if (!src) throw new Error(`${family} ${weight} 批次${i} 未取到 woff2 链接`)

      const name = `${slug}-${weight}-${i}.woff2`
      const r = await fetch(src[1], { headers: { 'user-agent': UA } })
      if (!r.ok) throw new Error(`下载 ${name} 失败: ${r.status}`)
      const buf = Buffer.from(await r.arrayBuffer())
      await writeFile(join(OUT_DIR, name), buf)
      totalBytes += buf.length

      // unicode-range 用本批次实际覆盖的字符
      const range = css.match(/unicode-range:\s*([^;]+)/)
      const ur = range ? range[1].trim() : 'U+0-10FFFF'
      faces.push(
        `@font-face {\n` +
          `  font-family: '${family}';\n` +
          `  font-style: normal;\n` +
          `  font-weight: ${weight};\n` +
          `  font-display: swap;\n` +
          `  src: url(/fonts/${name}) format('woff2');\n` +
          `  unicode-range: ${ur};\n` +
          `}`,
      )
      console.log(`  ${name.padEnd(30)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB  range ${ur.length} 字符`)
    }
  }
}

const header = `/* 本地字体子集：Noto Serif SC / ZCOOL XiaoWei
   取自 Google Fonts，遵循 SIL Open Font License 1.1。
   由 scripts/fetch-fonts.mjs 生成（仅含游戏用到的字符，按批分片），勿手改。
   作用：去掉外网字体依赖，国内可正常显示，离线 PWA 也可用。 */\n\n`
await writeFile(OUT_CSS, header + faces.join('\n\n') + '\n')

console.log(`\n字体总计: ${(totalBytes / 1024).toFixed(0)} KB`)
console.log(`已写入: ${OUT_CSS}`)
