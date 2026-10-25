/** 横屏布局实测：区分"真溢出"与"可滚动内容" */
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] || 'http://127.0.0.1:5174'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'lnd' + Date.now().toString(36).slice(-5)
// 一次性测试账号：密码随机生成，不写入仓库
const PASS = 'p' + Math.random().toString(36).slice(2, 12)

const DEVICES = [
  { name: 'iPhone SE', w: 667, h: 375 },
  { name: 'iPhone 14', w: 844, h: 390 },
  { name: 'iPhone 14 ProMax', w: 932, h: 430 },
  { name: 'Pixel 7', w: 851, h: 393 },
]

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

const PAGES = ['home', 'team', 'campaign', 'roster']

for (const d of DEVICES) {
  const page = await browser.newPage()
  await page.setViewport({ width: d.w, height: d.h, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  await page.evaluateOnNewDocument((tk) => localStorage.setItem('sanguo-token', tk), token)
  await page.goto(BASE, { waitUntil: 'networkidle2' })
  await page.waitForSelector('.shell')
  console.log(`\n===== ${d.name}  ${d.w}×${d.h} =====`)

  for (const nav of PAGES) {
    if (nav !== 'home') {
      await page.evaluate((n) => document.querySelector(`[data-nav="${n}"]`)?.click(), nav)
      await new Promise((r) => setTimeout(r, 800))
    }
    const m = await page.evaluate(() => {
      const b = (sel) => {
        const e = document.querySelector(sel)
        if (!e) return null
        const r = e.getBoundingClientRect()
        return { w: Math.round(r.width), h: Math.round(r.height) }
      }
      // 真正的横向溢出：文档级
      const docOverflow = document.documentElement.scrollWidth - window.innerWidth
      // 被 overflow:hidden 裁掉内容的容器（真问题）
      const clipped = []
      for (const el of document.querySelectorAll('.shell *')) {
        const cs = getComputedStyle(el)
        if (cs.overflow !== 'hidden' && cs.overflowX !== 'hidden') continue
        if (el.scrollHeight > el.clientHeight + 2 && el.clientHeight > 0) {
          clipped.push(`${(el.className || '').toString().slice(0, 24)} 内容${el.scrollHeight}>框${el.clientHeight}`)
        }
      }
      // 槽位重叠检测（浮点精度，忽略 < 2px 的亚像素误差）
      let slotOverlap = 0
      const slots = [...document.querySelectorAll('.slot-v2')].map((s) => s.getBoundingClientRect())
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const a = slots[i], c = slots[j]
          const ox = Math.min(a.right, c.right) - Math.max(a.left, c.left)
          const oy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top)
          if (ox > 2 && oy > 2) slotOverlap++
        }
      }
      return {
        vw: window.innerWidth, vh: window.innerHeight,
        shell: b('.shell'), main: b('.main'),
        stage: b('.form-v2-stage'), side: b('.form-v2-side'), bench: b('.panel.form-v2-bench'),
        docOverflow, clipped: clipped.slice(0, 4), clippedN: clipped.length, slotOverlap,
      }
    })
    const p = [`main ${m.main?.w}×${m.main?.h}`]
    if (m.stage) p.push(`舞台 ${m.stage.w}×${m.stage.h}`, `详情 ${m.side?.w}×${m.side?.h}`, `援军 ${m.bench?.w}×${m.bench?.h}`)
    console.log(`  ${nav.padEnd(9)} ${p.join(' | ')}  文档溢出=${m.docOverflow}  裁切=${m.clippedN}  槽位重叠=${m.slotOverlap}`)
    if (m.clippedN) console.log(`      裁切: ${JSON.stringify(m.clipped)}`)
  }
  await page.close()
}
await browser.close()
