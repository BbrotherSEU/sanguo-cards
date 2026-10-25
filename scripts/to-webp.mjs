// 资源瘦身：public 下 PNG/JPG 转 WebP（保留透明通道），成功后删除原文件
import { readdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const JOBS = [
  { dir: 'public/sprites', ext: '.png', opts: { quality: 88 } }, // 立绘含透明
  { dir: 'public/equips', ext: '.jpg', opts: { quality: 82 } },
  { dir: 'public/skills', ext: '.jpg', opts: { quality: 82 } },
  { dir: 'public/hero', ext: '.jpg', opts: { quality: 80 } },
  { dir: 'public/plaza', ext: '.jpg', opts: { quality: 80 } },
]

let before = 0
let after = 0
for (const job of JOBS) {
  for (const fn of readdirSync(job.dir)) {
    if (!fn.toLowerCase().endsWith(job.ext)) continue
    const src = join(job.dir, fn)
    const dst = src.replace(/\.(png|jpg)$/i, '.webp')
    const size = statSync(src).size
    await sharp(src).webp(job.opts).toFile(dst)
    const out = statSync(dst).size
    before += size
    after += out
    unlinkSync(src)
    console.log(`${fn}  ${(size / 1024).toFixed(0)}KB → ${(out / 1024).toFixed(0)}KB`)
  }
}
console.log(`\n总计: ${(before / 1048576).toFixed(1)}MB → ${(after / 1048576).toFixed(1)}MB`)
