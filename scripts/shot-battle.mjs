/** 截图：首页 + 布阵 + 战斗（手机横屏尺寸） */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://127.0.0.1:5174'
const VW = Number(process.argv[3] || 844)
const VH = Number(process.argv[4] || 390)
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'bat' + Date.now().toString(36).slice(-5)
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
const HEROES = ['guanyu', 'zhaoyun', 'lvbu', 'zhangfei', 'huangzhong', 'dianwei']
const owned = HEROES.map((h, i) => ({
  uid: `u_${h}_${i}`, heroId: h, level: 60, shards: 0, breakthrough: 3, awaken: 2, exp: 0, gear: {}, divine: false,
}))
const save = {
  version: 6, gold: 9999999, jade: 9999999, tickets: 9999999, seals: 9999999, awakenStone: 9999999,
  forgeStone: 9999999, iron: 9999999, equipTickets: 9999999, equipPity: 0, playerLevel: 30, playerExp: 0,
  stageCleared: 3, stageHardCleared: 0, stageHeroCleared: 0, stageEpicCleared: 0,
  owned, equips: [], team: HEROES.map((h, i) => `u_${h}_${i}`),
  pity: 0, pullCount: 0, arenaPoints: 1000, arenaTickets: 5, arenaWins: 0, arenaLosses: 0,
  selectedHeroUid: 'u_guanyu_0', shopDay: '', shopOffers: [], shopRefreshUsed: 0, soul: 0,
  dailyDay: '', dailyClaimed: false, sweepsLeft: 8, battleSpeed: 1, pushSpeed: 1,
}
await api('/api/save', {
  method: 'PUT',
  headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
  body: JSON.stringify(save),
})

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] })
const page = await browser.newPage()
await page.setViewport({ width: VW, height: VH, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
await page.evaluateOnNewDocument((tk) => localStorage.setItem('sanguo-token', tk), token)
await page.goto(BASE, { waitUntil: 'networkidle2' })
await page.waitForSelector('.shell')
await new Promise((r) => setTimeout(r, 800))
await page.screenshot({ path: 'scripts/shot-home.png' })
console.log('已截图 home')

// 征战
await page.evaluate(() => document.querySelector('[data-nav="campaign"]')?.click())
await new Promise((r) => setTimeout(r, 1000))
await page.screenshot({ path: 'scripts/shot-campaign.png' })

// 进入章节再点当前关卡
const chapter = await page.evaluate(() => {
  const n = document.querySelector('[data-open-chapter]')
  if (!n) return null
  n.click()
  return n.getAttribute('data-open-chapter')
})
console.log('进入章节', chapter)
await new Promise((r) => setTimeout(r, 1000))
await page.screenshot({ path: 'scripts/shot-chapter.png' })

const clicked = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll('[data-challenge]')]
  const open = nodes.find((n) => !n.disabled)
  if (!open) return null
  open.click()
  return open.getAttribute('data-challenge')
})
console.log('点击关卡', clicked)
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: 'scripts/shot-prep.png' })

// 开战
const btn = await page.$('[data-action="launch-battle"]')
if (btn) await btn.click()
await new Promise((r) => setTimeout(r, 1800))
await page.screenshot({ path: 'scripts/shot-battle.png' })
console.log('已截图 battle')
await new Promise((r) => setTimeout(r, 4000))
await page.screenshot({ path: 'scripts/shot-battle2.png' })
console.log('错误:', errors.length ? errors : '无')
await browser.close()
