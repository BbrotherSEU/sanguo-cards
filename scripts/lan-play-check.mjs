/** 局域网地址实测：用手机视口访问 LAN IP，确认完整可玩 */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://192.168.31.151:4174'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'lan' + Date.now().toString(36).slice(-5)
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
const HEROES = ['guanyu', 'zhaoyun', 'lvbu', 'zhangfei', 'huangzhong', 'dianwei']
const owned = HEROES.map((h, i) => ({
  uid: `u_${h}_${i}`, heroId: h, level: 60, shards: 0, breakthrough: 3, awaken: 2, exp: 0, gear: {}, divine: false,
}))
const save = {
  version: 6, gold: 9999999, jade: 9999999, tickets: 9999999, seals: 9999999, awakenStone: 9999999,
  forgeStone: 9999999, iron: 9999999, equipTickets: 9999999, equipPity: 0, playerLevel: 30, playerExp: 0,
  stageCleared: 200, stageHardCleared: 0, stageHeroCleared: 0, stageEpicCleared: 0,
  owned, equips: [], team: HEROES.map((h, i) => `u_${h}_${i}`),
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
  defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()) })
await page.evaluateOnNewDocument((tk) => localStorage.setItem('sanguo-token', tk), token)

const t0 = Date.now()
await page.goto(BASE, { waitUntil: 'networkidle2' })
await page.waitForSelector('.shell', { timeout: 20000 })
console.log('首次加载(网络空闲):', Date.now() - t0, 'ms')

// 逐页切换
for (const nav of ['team', 'roster', 'campaign', 'equip', 'shop', 'arena']) {
  const t = Date.now()
  await page.evaluate((n) => document.querySelector(`[data-nav="${n}"]`)?.click(), nav)
  await new Promise((r) => setTimeout(r, 700))
  const ok = await page.evaluate(() => {
    const m = document.querySelector('.main')
    return { has: m?.children.length > 0, w: document.documentElement.scrollWidth }
  })
  console.log(`  ${nav.padEnd(9)} 切换 ${String(Date.now() - t).padStart(5)}ms  内容${ok.has ? '有' : '空'}  横向溢出=${ok.w > 391 ? '有(' + ok.w + ')' : '无'}`)
}

// 存档回读：确认服务器存档生效
const persisted = await page.evaluate(() => {
  const raw = localStorage.getItem('sanguo-cards-save-v2')
  const d = raw ? JSON.parse(raw) : null
  return { owned: d?.owned?.length ?? 0, team: d?.team?.filter(Boolean).length ?? 0 }
})
console.log('本地存档:', JSON.stringify(persisted))

console.log('错误:', errors.length ? errors.slice(0, 5) : '无')
await browser.close()
