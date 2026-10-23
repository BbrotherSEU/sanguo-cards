import fs from 'node:fs'

const p = new URL('../src/data/heroes.ts', import.meta.url)
let s = fs.readFileSync(p, 'utf8')
const map = {
  liubei: 'heal',
  guanyu: 'warrior',
  zhangfei: 'tank',
  zhaoyun: 'dps',
  zhugeliang: 'mage',
  huangyueying: 'mage',
  caocao: 'mage',
  xiahoudun: 'tank',
  dianwei: 'tank',
  guojia: 'mage',
  simayi: 'mage',
  sunquan: 'heal',
  zhouyu: 'mage',
  luxun: 'mage',
  taishici: 'warrior',
  xiaoqiao: 'heal',
  lvbu: 'warrior',
  diaochan: 'heal',
  huatuo: 'heal',
  huangzhong: 'dps',
  machao: 'dps',
  ganning: 'dps',
  zhangliao: 'warrior',
  sunce: 'warrior',
  zhenji: 'heal',
  jiangwei: 'mage',
  zhangjiao: 'mage',
  pangtong: 'mage',
  xuchu: 'tank',
  daqiao: 'heal',
  lvmeng: 'warrior',
  yuanshao: 'mage',
  huanggai: 'tank',
  guanping: 'warrior',
}
for (const [id, role] of Object.entries(map)) {
  const re = new RegExp(`(id: '${id}',[\\s\\S]*?role: ')\\w+(')`)
  if (!re.test(s)) {
    console.log('MISS', id)
    continue
  }
  s = s.replace(re, `$1${role}$2`)
}
fs.writeFileSync(p, s)
console.log('patched')
