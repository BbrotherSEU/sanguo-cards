/** 横屏截图：多页面 */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://127.0.0.1:5174'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'lss' + Date.now().toString(36).slice(-5)
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
await page.goto(BASE, { waitUntil: 'networkidle2' })
await page.waitForSelector('.shell')

for (const nav of ['home', 'team', 'campaign', 'roster']) {
  if (nav !== 'home') {
    await page.evaluate((n) => document.querySelector(`[data-nav="${n}"]`)?.click(), nav)
    await new Promise((r) => setTimeout(r, 900))
  }
  await page.screenshot({ path: `scripts/lsc-${nav}.png` })
  console.log('已截图', nav)
}
await browser.close()
