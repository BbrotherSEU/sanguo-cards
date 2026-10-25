/** 横屏专项实测：旋转遮罩 / 武将详情页 / 装备弹层虚化 */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://127.0.0.1:5174'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'lsc' + Date.now().toString(36).slice(-5)
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
})
const page = await browser.newPage()
await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await page.evaluateOnNewDocument((tk) => localStorage.setItem('sanguo-token', tk), token)
await page.goto(BASE, { waitUntil: 'networkidle2' })
await page.waitForSelector('.shell')

// 1) 横屏：旋转遮罩必须隐藏
const gateLandscape = await page.evaluate(() => {
  const g = document.querySelector('#rotate-gate')
  return { hidden: g.hidden, display: getComputedStyle(g).display }
})
console.log('横屏时遮罩隐藏:', gateLandscape.hidden && gateLandscape.display === 'none' ? 'PASS' : `FAIL (${JSON.stringify(gateLandscape)})`)

// 2) 竖屏：旋转遮罩必须显示并铺满
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await new Promise((r) => setTimeout(r, 600))
const gatePortrait = await page.evaluate(() => {
  const g = document.querySelector('#rotate-gate')
  const r = g.getBoundingClientRect()
  return {
    hidden: g.hidden,
    display: getComputedStyle(g).display,
    covers: r.width >= window.innerWidth && r.height >= window.innerHeight,
  }
})
console.log('竖屏时遮罩显示:', !gatePortrait.hidden && gatePortrait.display !== 'none' && gatePortrait.covers ? 'PASS' : `FAIL (${JSON.stringify(gatePortrait)})`)
await page.screenshot({ path: 'scripts/lsc-gate.png' })

// 3) 回横屏，武将详情页
await page.setViewport({ width: 844, height: 390, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await new Promise((r) => setTimeout(r, 600))
await page.evaluate(() => document.querySelector('[data-nav="roster"]')?.click())
await new Promise((r) => setTimeout(r, 800))
await page.evaluate(() => document.querySelector('.hero-card')?.click())
await new Promise((r) => setTimeout(r, 900))
const dossier = await page.evaluate(() => {
  const p = document.querySelector('.hero-page.dossier')
  const fig = document.querySelector('.dossier-fig')
  const side = document.querySelector('.dossier-side')
  if (!p) return { ok: false }
  const b = (e) => {
    const r = e?.getBoundingClientRect()
    return r ? { w: Math.round(r.width), h: Math.round(r.height) } : null
  }
  return {
    ok: true,
    fig: b(fig),
    side: b(side),
    overflow: document.documentElement.scrollWidth - window.innerWidth,
  }
})
console.log('武将详情页:', JSON.stringify(dossier))
await page.screenshot({ path: 'scripts/lsc-dossier.png' })

// 4) 装备弹层：遮罩半透明 + 强虚化，人物界面仍可见
const pop = await page.evaluate(async () => {
  document.querySelector('.gear-float[data-gear-slot]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await new Promise((r) => setTimeout(r, 600))
  const g = document.querySelector('.gear-pop')
  if (!g) return { has: false }
  const cs = getComputedStyle(g)
  const r = g.getBoundingClientRect()
  const dossier = document.querySelector('.hero-page.dossier')
  return {
    has: true,
    bg: cs.backgroundColor,
    filter: cs.backdropFilter || cs.webkitBackdropFilter,
    inDossier: !!dossier && dossier.contains(g),
    inViewport: r.left >= 0 && r.top >= 0 && r.right <= window.innerWidth + 2 && r.bottom <= window.innerHeight + 2,
  }
})
const alpha = pop.has ? (pop.bg.match(/rgba?\([^)]*?,\s*([\d.]+)\s*\)/) || [])[1] : null
const blur = pop.has ? (pop.filter.match(/blur\(([\d.]+)px\)/) || [])[1] : null
console.log(
  '装备弹层:',
  pop.has && alpha !== undefined && parseFloat(alpha) < 0.9 && blur && parseFloat(blur) >= 4 && pop.inViewport
    ? 'PASS'
    : 'FAIL',
  JSON.stringify(pop),
)
await page.screenshot({ path: 'scripts/lsc-gearpop.png' })

await browser.close()
