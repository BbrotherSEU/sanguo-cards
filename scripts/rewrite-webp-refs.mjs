// 把 src 里对 png/jpg 资源的引用统一改为 .webp
import { readFileSync, writeFileSync } from 'node:fs'

const files = [
  'src/ui/battleSprite.ts',
  'src/ui/divineFx.ts',
  'src/ui/portrait.ts',
  'src/ui/render.ts',
  'src/ui/equipArt.ts',
  'src/ui/icons.ts',
  'src/style.css',
  'src/ui/theme.css',
]
const re = /(\/(?:sprites|equips|skills|hero|plaza)\/[A-Za-z0-9_\-${}.()]+?)\.(png|jpg)/g
for (const f of files) {
  const s = readFileSync(f, 'utf8')
  const t = s.replace(re, '$1.webp')
  if (t !== s) {
    writeFileSync(f, t)
    console.log('updated', f, (s.match(re) ?? []).length, '处')
  }
}
console.log('done')
