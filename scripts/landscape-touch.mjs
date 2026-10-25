/** 横屏触控实测：拖拽换位 / 点选上阵 / 过滤 / 难度切换 */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://127.0.0.1:5174'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'lt' + Date.now().toString(36).slice(-5)
// 一次性测试账号：密码随机生成，不写入仓库
const PASS = 'p' + Math.random().toString(36).slice(2, 12)

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  return { status: res.status, body: await res.json().catch(() => ({})) }
}
const reg = await api('/api/register', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ name: USER, password: PASS }),
})
const token = reg.body.token
const HEROES = ['guanyu', 'zhaoyun', 'lvbu', 'zhangfei', 'huangzhong', 'dianwei', 'xiaoqiao', 'huatuo']
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
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await page.evaluateOnNewDocument((tk) => localStorage.setItem('sanguo-token', tk), token)
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.goto(BASE, { waitUntil: 'networkidle2' })
await page.waitForSelector('.shell')
await page.evaluate(() => document.querySelector('[data-nav="team"]')?.click())
await new Promise((r) => setTimeout(r, 900))

const team = () => page.evaluate(() =>
  [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear),
)

// 1) 触控拖拽换位
const before = await team()
const box = await page.evaluate(() => {
  const g = (n) => {
    const b = document.querySelector(`.slot-v2[data-slot="${n}"]`).getBoundingClientRect()
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 }
  }
  return { a: g(0), b: g(1) }
})
const cdp = await page.createCDPSession()
const tp = (x, y) => [{ x, y, radiusX: 6, radiusY: 6, force: 1 }]
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(box.a.x, box.a.y) })
for (let i = 1; i <= 12; i++) {
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: tp(box.a.x + ((box.b.x - box.a.x) * i) / 12, box.a.y + ((box.b.y - box.a.y) * i) / 12),
  })
  await new Promise((r) => setTimeout(r, 18))
}
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
await new Promise((r) => setTimeout(r, 500))
const after = await team()
console.log('拖拽前:', before.slice(0, 3).join(' | '))
console.log('拖拽后:', after.slice(0, 3).join(' | '))
console.log('触控拖拽换位:', before[0] === after[1] && before[1] === after[0] ? 'PASS' : 'FAIL')

// 2) 点选上阵（先下阵腾位，再点未上阵的）
await page.evaluate(async () => {
  document.querySelector('.slot-v2.filled [data-slot-clear]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await new Promise((r) => setTimeout(r, 400))
})
await page.evaluate(() => {
  const cur = [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear)
  const card = [...document.querySelectorAll('.bench-strip .hero-card')].find(
    (c) => c.getBoundingClientRect().width > 0 && !cur.includes(c.dataset.pick),
  )
  card?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 500))
const t2 = await team()
console.log('点选上阵后人数:', t2.length, t2.length === 6 ? 'PASS' : 'FAIL')

// 3) 过滤「蜀」
const filter = await page.evaluate(async () => {
  const chip = [...document.querySelectorAll('.fv2-filters .pick-chip')].find((c) => c.textContent.trim() === '蜀')
  chip?.click()
  await new Promise((r) => setTimeout(r, 400))
  const vis = [...document.querySelectorAll('.bench-strip .hero-card')].filter((c) => c.getBoundingClientRect().width > 0)
  return { n: vis.length, f: [...new Set(vis.map((c) => c.dataset.faction))] }
})
console.log('过滤「蜀」:', filter.n, '张, 阵营:', filter.f.join(','), filter.n > 0 && filter.f.length === 1 ? 'PASS' : 'FAIL')

// 4) 难度切换
await page.evaluate(() => document.querySelector('[data-nav="campaign"]')?.click())
await new Promise((r) => setTimeout(r, 800))
const diff = await page.evaluate(async () => {
  const chip = document.querySelector('.diff-chip[data-diff="hard"]')
  const locked = chip?.disabled
  chip?.click()
  await new Promise((r) => setTimeout(r, 500))
  return { locked, on: document.querySelector('.diff-chip.on')?.dataset.diff }
})
console.log('难度切换到困难:', JSON.stringify(diff), diff.on === 'hard' ? 'PASS' : 'FAIL')

console.log('页面错误:', errors.length ? errors.slice(0, 3) : '无')
await browser.close()
