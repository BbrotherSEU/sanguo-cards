// 生成 PWA 图标：古风盾牌 SVG → 192/512 PNG + maskable
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${pad ? 0 : 96}" fill="#1c110c"/>
  <rect x="14" y="14" width="484" height="484" rx="${pad ? 0 : 84}" fill="none" stroke="#8a5a18" stroke-width="6"/>
  <g transform="translate(${pad ? 116 : 76} ${pad ? 116 : 76}) scale(${pad ? 0.547 : 0.703})">
    <path d="M256 40l210 84v170c0 128-88 218-210 266C168 512 80 422 80 294V124z" fill="#8a5a18"/>
    <path d="M256 72l168 68v152c0 110-76 192-168 232-92-40-168-122-168-232V140z" fill="#c43c28"/>
    <path d="M256 148v232M108 232h296" stroke="#ffd54f" stroke-width="34" fill="none" stroke-linecap="round"/>
  </g>
</svg>`

mkdirSync('public/icons', { recursive: true })
await sharp(Buffer.from(svg(false))).resize(192).png().toFile('public/icons/icon-192.png')
await sharp(Buffer.from(svg(false))).png().toFile('public/icons/icon-512.png')
await sharp(Buffer.from(svg(true))).png().toFile('public/icons/maskable-512.png')
console.log('icons done')
