/** 布阵页布局与拖拽诊断 */
import puppeteer from 'puppeteer-core'

const BASE = 'http://127.0.0.1:5174'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'dbg' + Date.now().toString(36).slice(-5)
// 一次性测试账号：密码随机生成，不写入仓库
const PASS = 'p' + Math.random().toString(36).slice(2, 12)

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  return { status: res.status, body: await res.json().catch(() => ({})) }
}
let r = await api('/api/register', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ name: USER, password: PASS }),
})
const token = r.body.token
const HEROES = ['guanyu', 'zhaoyun', 'lvbu', 'zhangfei', 'huangzhong', 'dianwei', 'xiaoqiao', 'huatuo', 'zhugeliang', 'caocao', 'zhouyu', 'sunquan']
const owned = HEROES.map((h, i) => ({
  uid: `u_${h}_${i}`, heroId: h, level: 60, shards: 0, breakthrough: 3, awaken: 2, exp: 0, gear: {}, divine: false,
}))
const save = {
  version: 6, gold: 9999999, jade: 9999999, tickets: 9999999, seals: 9999999, awakenStone: 9999999,
  forgeStone: 9999999, iron: 9999999, equipTickets: 9999999, equipPity: 0, playerLevel: 30, playerExp: 0,
  stageCleared: 200, stageHardCleared: 0, stageHeroCleared: 0, stageEpicCleared: 0,
  owned, equips: [], team: HEROES.slice(0, 6).map((h, i) => `u_${h}_${i}`),
  pity: 0, pullCount: 0, arenaPoints: 1000, arenaTickets: 5, arenaWins: 0, arenaLosses: 0,
  selectedHeroUid: 'u_guanyu_0', shopDay: '', shopOffers: [], shopRefreshUsed: 0, soul: 0,
  dailyDay: '', dailyClaimed: false, sweepsLeft: 8, battleSpeed: 8, pushSpeed: 8,
}
await api('/api/save', {
  method: 'PUT',
  headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
  body: JSON.stringify(save),
})

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1400,900'],
  defaultViewport: { width: 1400, height: 900 },
})
const page = await browser.newPage()
await page.evaluateOnNewDocument((tk) => localStorage.setItem('sanguo-token', tk), token)
await page.goto(BASE, { waitUntil: 'networkidle2' })
await page.waitForSelector('.shell')
await page.evaluate(() => document.querySelector('[data-nav="team"]')?.click())
await new Promise((r) => setTimeout(r, 800))

const geo = await page.evaluate(() => {
  const main = document.querySelector('.main')
  const stage = document.querySelector('.form-v2-stage')
  const panel = document.querySelector('.panel.form-v2-bench')
  const strip = document.querySelector('.bench-strip')
  const cards = [...strip.querySelectorAll('.hero-card')]
  const r = (e) => {
    const b = e.getBoundingClientRect()
    return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }
  }
  return {
    viewport: { w: innerWidth, h: innerHeight },
    main: main ? r(main) : null,
    mainScroll: main ? { st: main.scrollTop, ch: main.clientHeight, sh: main.scrollHeight } : null,
    stage: stage ? r(stage) : null,
    panel: panel ? r(panel) : null,
    strip: strip ? r(strip) : null,
    stripClient: strip ? { ch: strip.clientHeight, sh: strip.scrollHeight, sw: strip.scrollWidth, cw: strip.clientWidth } : null,
    cards: cards.slice(0, 3).map(r),
    cardTops: [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().top)))],
    cardLefts: [...new Set(cards.map((c) => Math.round(c.getBoundingClientRect().left)))],
  }
})
console.log('几何：', JSON.stringify(geo, null, 1))

// 拖拽诊断
const before = await page.evaluate(() => [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear))
const b0 = await page.evaluate(() => {
  const s = document.querySelector('.slot-v2.filled[data-slot="0"]')
  const r = s.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
})
const b1 = await page.evaluate(() => {
  const s = document.querySelector('.slot-v2[data-slot="1"]')
  const r = s.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
})
console.log('slot0', b0, 'slot1', b1)
await page.mouse.move(b0.x, b0.y)
await page.mouse.down()
await page.mouse.move(b0.x + 12, b0.y + 4, { steps: 4 })
const mid = await page.evaluate(() => ({
  live: !!document.querySelector('.form-v2-stage.drag-live'),
  ghost: !!document.querySelector('.drag-ghost'),
  dragging: !!document.querySelector('.slot-v2.dragging'),
}))
console.log('拖拽中：', mid)
await page.mouse.move(b1.x, b1.y, { steps: 12 })
const over = await page.evaluate(() => ({
  dropOn: document.querySelector('.slot-v2.drop-on')?.dataset.slot ?? null,
  hit: (() => {
    const el = document.elementFromPoint(...window.__probe ?? [0, 0])
    return el?.className
  })(),
}))
console.log('经过 slot1：', over)
await page.mouse.up()
await new Promise((r) => setTimeout(r, 500))
const after = await page.evaluate(() => [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear))
const dragInfo = await page.evaluate(() => window.__drag ?? null)
console.log('拖前', before)
console.log('拖后', after)
console.log('onUp 调试：', JSON.stringify(dragInfo))
const saveTeam = await page.evaluate(() => JSON.parse(localStorage.getItem('sanguo-cards-save-v2') || '{}').team ?? null)
console.log('存档 team：', saveTeam)

await browser.close()
