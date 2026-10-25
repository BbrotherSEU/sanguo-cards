/**
 * 三项改动的浏览器实测：
 *  T1 装备弹层保留人物界面虚化背景
 *  T2 布阵界面（竖排3×2 / 拖拽 / 上阵下阵体感 / 待上阵展示+过滤）
 *  T3 征战四档难度
 */
import puppeteer from 'puppeteer-core'

const BASE = 'http://127.0.0.1:5174'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'e2e' + Date.now().toString(36).slice(-5)
const PASS = 'e2epass123'

let pass = 0
let fail = 0
function check(ok, label, extra = '') {
  if (ok) pass++
  else fail++
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${extra ? '  ' + extra : ''}`)
}

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  return { status: res.status, body: await res.json().catch(() => ({})) }
}

// ── 准备账号与存档 ──────────────────────────────────────
let r = await api('/api/register', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ name: USER, password: PASS }),
})
if (r.status !== 200) {
  r = await api('/api/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: USER, password: PASS }),
  })
}
const token = r.body.token
if (!token) throw new Error('登录失败')

const mk = (heroId, i, extra = {}) => ({
  uid: `u_${heroId}_${i}`,
  heroId,
  level: extra.level ?? 60,
  shards: 0,
  breakthrough: extra.breakthrough ?? 3,
  awaken: extra.awaken ?? 2,
  exp: 0,
  gear: {},
  divine: false,
})
const TEAM_HEROES = ['guanyu', 'zhaoyun', 'lvbu', 'zhangfei', 'huangzhong', 'dianwei']
const BUDDY_HEROES = ['xiaoqiao', 'huatuo', 'zhugeliang', 'caocao', 'zhouyu', 'sunquan']
const owned = [
  ...TEAM_HEROES.map((h, i) => mk(h, i)),
  ...BUDDY_HEROES.map((h, i) => mk(h, i)),
]
const EQUIPS = [
  { uid: 'e1', equipId: 'blade_green', level: 5 },
  { uid: 'e2', equipId: 'armor_r', level: 5 },
  { uid: 'e3', equipId: 'ring_r', level: 5 },
]
owned[0].gear = { weapon: 'e1', armor: 'e2', accessory: 'e3' }
const save = {
  version: 6,
  gold: 9999999,
  jade: 9999999,
  tickets: 9999999,
  seals: 9999999,
  awakenStone: 9999999,
  forgeStone: 9999999,
  iron: 9999999,
  equipTickets: 9999999,
  equipPity: 0,
  playerLevel: 30,
  playerExp: 0,
  stageCleared: 200,
  stageHardCleared: 0,
  stageHeroCleared: 0,
  stageEpicCleared: 0,
  owned,
  equips: EQUIPS,
  team: TEAM_HEROES.map((h) => `u_${h}_${TEAM_HEROES.indexOf(h)}`),
  pity: 0,
  pullCount: 0,
  arenaPoints: 1000,
  arenaTickets: 5,
  arenaWins: 0,
  arenaLosses: 0,
  selectedHeroUid: 'u_guanyu_0',
  shopDay: '',
  shopOffers: [],
  shopRefreshUsed: 0,
  soul: 0,
  dailyDay: '',
  dailyClaimed: false,
  sweepsLeft: 8,
  battleSpeed: 8,
  pushSpeed: 8,
}
const put = await api('/api/save', {
  method: 'PUT',
  headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
  body: JSON.stringify(save),
})
if (put.status !== 200) throw new Error('写存档失败 ' + JSON.stringify(put.body))

// ── 启动浏览器 ──────────────────────────────────────────
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--window-size=1400,900'],
  defaultViewport: { width: 1400, height: 900 },
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
await page.evaluateOnNewDocument((tk) => {
  localStorage.setItem('sanguo-token', tk)
}, token)
await page.goto(BASE, { waitUntil: 'networkidle2' })
await page.waitForSelector('.shell', { timeout: 15000 })

const goScreen = async (screen) => {
  await page.evaluate((s) => {
    const btn = document.querySelector(`[data-nav="${s}"]`)
    if (btn) btn.click()
  }, screen)
  await new Promise((r) => setTimeout(r, 500))
}
const state = () => page.evaluate(() => {
  const raw = localStorage.getItem('sanguo-cards-save-v2')
  return raw ? JSON.parse(raw) : null
})

// ══════════════ T1 装备弹层虚化背景 ══════════════
console.log('\n=== T1 装备弹层保留人物界面虚化背景 ===')
await goScreen('roster')
await page.evaluate(() => {
  const c = document.querySelector('.hero-card.clickable, [data-open]')
  if (c) c.click()
})
await new Promise((r) => setTimeout(r, 600))
const hasDossier = await page.$('.hero-page.dossier')
check(!!hasDossier, '进入武将详情页')
if (hasDossier) {
  const gearHit = await page.evaluate(() => {
    const btn = document.querySelector('[data-gear-slot]')
    if (!btn) return null
    const r = btn.getBoundingClientRect()
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)
    return { clickable: btn.contains(top) || top === btn, rect: { w: r.width, h: r.height } }
  })
  check(!!gearHit, '找到装备位按钮')
  check(gearHit && gearHit.clickable, '装备位可被真实点击（未被立绘遮挡）')
  if (gearHit) {
    await page.evaluate(() => document.querySelector('[data-gear-slot]')?.click())
    await new Promise((r) => setTimeout(r, 400))
    const info = await page.evaluate(() => {
      const pop = document.querySelector('.gear-pop')
      if (!pop) return null
      const cs = getComputedStyle(pop)
      const dossier = document.querySelector('.hero-page.dossier')
      const fig = document.querySelector('.dossier-fig')
      const pr = pop.getBoundingClientRect()
      const dr = dossier.getBoundingClientRect()
      return {
        inDossier: !!dossier && dossier.contains(pop),
        inStage: !!document.querySelector('.dossier-stage')?.contains(pop),
        backdrop: cs.backdropFilter || cs.webkitBackdropFilter || '',
        bg: cs.backgroundColor,
        dossierPos: dossier ? getComputedStyle(dossier).position : '',
        figVisible: fig ? getComputedStyle(fig).display !== 'none' && fig.getBoundingClientRect().width > 0 : false,
        coversSide: pr.width > dr.width * 0.9,
        hasUpgrade: !!document.querySelector('[data-upgrade]'),
      }
    })
    check(!!info, '装备弹层已打开')
    if (info) {
      check(info.inDossier && !info.inStage, '弹层挂在人物页根级（覆盖整个界面，而非只遮立绘区）')
      const blur = info.backdrop.match(/blur\(([\d.]+)px\)/)
      check(!!blur && parseFloat(blur[1]) >= 4, '弹层有强虚化效果', info.backdrop)
      check(info.figVisible, '人物立绘仍作为背景可见')
      check(info.dossierPos === 'relative', '人物页为弹层定位上下文', info.dossierPos)
      check(info.coversSide, '弹层覆盖整个人物页（含右侧属性栏）')
      check(info.hasUpgrade, '弹层内含「升级」按钮')
      // 升级后弹层应保持打开，且等级刷新
      const up = await page.evaluate(async () => {
        const before = document.querySelector('.gear-current-info b')?.textContent ?? ''
        document.querySelector('[data-upgrade]')?.click()
        await new Promise((r) => setTimeout(r, 500))
        return {
          before,
          after: document.querySelector('.gear-current-info b')?.textContent ?? '',
          stillOpen: !!document.querySelector('.gear-pop'),
        }
      })
      check(up.stillOpen, '点「升级」后弹层保持打开')
      check(up.after !== up.before, '升级后数值刷新', `${up.before} → ${up.after}`)
    }
  }
}

// ══════════════ T2 布阵界面 ══════════════
console.log('\n=== T2 布阵界面 ===')
await goScreen('team')
await new Promise((r) => setTimeout(r, 600))

const layout = await page.evaluate(() => {
  const slots = [...document.querySelectorAll('.slot-v2')]
  const boxes = slots.map((s) => {
    const r = s.getBoundingClientRect()
    return { slot: Number(s.dataset.slot), cls: s.className, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width) }
  })
  return boxes
})
check(layout.length === 6, '阵型共 6 个槽位', String(layout.length))
{
  const xs = [...new Set(layout.map((b) => b.x))].sort((a, b) => a - b)
  const ys = [...new Set(layout.map((b) => b.y))].sort((a, b) => a - b)
  check(xs.length === 2, '横向只有 2 列（左后排 / 右前排）', `x=${xs.join(',')}`)
  check(ys.length === 3, '纵向 3 行', `y=${ys.join(',')}`)
  const back = layout.filter((b) => b.cls.includes('back'))
  const front = layout.filter((b) => b.cls.includes('front'))
  check(back.every((b) => b.x === xs[0]) && front.every((b) => b.x === xs[1]), '后排居左、前排居右（竖排 3×2）')
  check(front.every((b) => b.w > back[0].w), '前排立绘更大、后排更小')
}

const benchInfo = await page.evaluate(() => {
  const strip = document.querySelector('.bench-strip')
  if (!strip) return null
  const cards = [...strip.querySelectorAll('.hero-card')]
  const cs = getComputedStyle(strip)
  const sr = strip.getBoundingClientRect()
  const inside = cards.filter((c) => {
    const r = c.getBoundingClientRect()
    return r.left >= sr.left - 1 && r.right <= sr.right + 1 && r.top >= sr.top - 1 && r.bottom <= sr.bottom + 1
  })
  return {
    total: cards.length,
    visible: cards.filter((c) => c.getBoundingClientRect().width > 0).length,
    inside: inside.length,
    wrap: cs.flexWrap,
    overflowY: cs.overflowY,
    clientH: strip.clientHeight,
    scrollH: strip.scrollHeight,
    rows: new Set(cards.map((c) => Math.round(c.getBoundingClientRect().top))).size,
  }
})
check(!!benchInfo, '存在待上阵列表')
if (benchInfo) {
  check(benchInfo.wrap === 'wrap', '待上阵列表改为多行换行排列', benchInfo.wrap)
  check(benchInfo.inside === benchInfo.total, `待上阵武将完整展示（${benchInfo.inside}/${benchInfo.total} 张在可视区内）`)
  check(benchInfo.overflowY === 'auto' || benchInfo.overflowY === 'scroll', '超出时纵向可滚动', benchInfo.overflowY)
  check(benchInfo.clientH > 190, '待上阵区高度不再被 190px 截断', `${benchInfo.clientH}px`)
}

// 过滤
const filterResult = await page.evaluate(async () => {
  const before = [...document.querySelectorAll('.bench-strip .hero-card')].filter((c) => c.getBoundingClientRect().width > 0).length
  const chip = [...document.querySelectorAll('[data-pick-filter="faction"]')].find((c) => c.dataset.value === 'shu')
  if (!chip) return { err: 'no chip' }
  chip.click()
  await new Promise((r) => setTimeout(r, 200))
  const cards = [...document.querySelectorAll('.bench-strip .hero-card')].filter((c) => c.getBoundingClientRect().width > 0)
  const factions = [...new Set(cards.map((c) => c.dataset.faction))]
  const after = cards.length
  const all = [...document.querySelectorAll('[data-pick-filter="faction"]')].find((c) => c.dataset.value === 'all')
  all?.click()
  await new Promise((r) => setTimeout(r, 200))
  const restored = [...document.querySelectorAll('.bench-strip .hero-card')].filter((c) => c.getBoundingClientRect().width > 0).length
  return { before, after, restored, factions }
})
check(!filterResult.err, '存在阵营过滤器')
if (!filterResult.err) {
  check(filterResult.factions.length === 1 && filterResult.factions[0] === 'shu', '点选「蜀」后只剩蜀将', JSON.stringify(filterResult.factions))
  check(filterResult.after < filterResult.before, '过滤后列表变短', `${filterResult.before} → ${filterResult.after}`)
  check(filterResult.restored === filterResult.before, '切回「全」后恢复', `${filterResult.restored}`)
}

// 点击上阵 / 下阵（先腾一个空位）
const pickFlow = await page.evaluate(async () => {
  const team = () => [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear)
  document.querySelector('[data-slot-clear]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await new Promise((r) => setTimeout(r, 350))
  const startTeam = team()
  const card = [...document.querySelectorAll('.bench-strip .hero-card')].find((c) => !startTeam.includes(c.dataset.pick))
  if (!card) return { err: 'no bench card' }
  const uid = card.dataset.pick
  card.click()
  await new Promise((r) => setTimeout(r, 350))
  const afterIn = team()
  // 再点一次应下阵
  const card2 = [...document.querySelectorAll('.bench-strip .hero-card')].find((c) => c.dataset.pick === uid)
  card2?.click()
  await new Promise((r) => setTimeout(r, 350))
  const afterOut = team()
  return { startTeam, uid, afterIn, afterOut }
})
check(!pickFlow.err, '存在待上阵武将可点选')
if (!pickFlow.err) {
  check(pickFlow.afterIn.includes(pickFlow.uid), '点待上阵武将即上阵', `${pickFlow.startTeam.length} → ${pickFlow.afterIn.length}`)
  check(!pickFlow.afterOut.includes(pickFlow.uid), '再点一次即下阵', `${pickFlow.afterOut.length} 人`)
}

// 满员时点未上阵武将应提示先选阵位
const fullToast = await page.evaluate(async () => {
  const team = () => [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear)
  const cur = team()
  const card = [...document.querySelectorAll('.bench-strip .hero-card')].find((c) => !cur.includes(c.dataset.pick))
  if (!card) return { toast: '', count: team().length }
  card.click()
  await new Promise((r) => setTimeout(r, 350))
  return { toast: document.querySelector('.toast')?.textContent ?? '', count: team().length }
})
check(fullToast.toast.includes('阵容已满'), '阵容已满时提示先选阵位', fullToast.toast)

// 拖拽换位
const dragSwap = await page.evaluate(async () => {
  const before = [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear)
  return { before }
})
{
  const box0 = await page.evaluate(() => {
    const s = document.querySelector('.slot-v2.filled[data-slot="0"]')
    const r = s.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  })
  const box1 = await page.evaluate(() => {
    const s = document.querySelector('.slot-v2[data-slot="1"]')
    const r = s.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  })
  await page.mouse.move(box0.x, box0.y)
  await page.mouse.down()
  await page.mouse.move(box0.x + 12, box0.y + 4, { steps: 4 })
  await page.mouse.move(box1.x, box1.y, { steps: 12 })
  await new Promise((r) => setTimeout(r, 150))
  const live = await page.evaluate(() => !!document.querySelector('.form-v2-stage.drag-live'))
  await page.mouse.up()
  await new Promise((r) => setTimeout(r, 400))
  const after = await page.evaluate(() => [...document.querySelectorAll('.slot-v2.filled')].map((s) => s.dataset.clear))
  check(live, '拖拽时阵型进入 drag-live 状态')
  check(after[0] === dragSwap.before[1] && after[1] === dragSwap.before[0], '槽位拖拽可互换位置', `${dragSwap.before.slice(0, 2)} → ${after.slice(0, 2)}`)
}

// 拖拽上阵：先把一个阵位清空，再从待上阵拖进去
{
  await page.evaluate(() => {
    const x = document.querySelector('[data-slot-clear]')
    x?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })
  await new Promise((r) => setTimeout(r, 400))
  const emptySlot = await page.evaluate(() => {
    const s = [...document.querySelectorAll('.slot-v2.empty')][0]
    if (!s) return null
    const r = s.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, slot: s.dataset.slot }
  })
  const cardBox = await page.evaluate(() => {
    const c = document.querySelector('.bench-strip .hero-card')
    if (!c) return null
    const r = c.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, uid: c.dataset.pick }
  })
  check(!!emptySlot && !!cardBox, '存在空槽与可拖动的待上阵武将')
  if (emptySlot && cardBox) {
    await page.mouse.move(cardBox.x, cardBox.y)
    await page.mouse.down()
    await new Promise((r) => setTimeout(r, 350)) // 等待长按触发
    await page.mouse.move(emptySlot.x, emptySlot.y, { steps: 14 })
    await new Promise((r) => setTimeout(r, 150))
    const onSlot = await page.evaluate(() => !!document.querySelector('.slot-v2.drop-on'))
    await page.mouse.up()
    await new Promise((r) => setTimeout(r, 400))
    const placed = await page.evaluate((uid) => [...document.querySelectorAll('.slot-v2.filled')].some((s) => s.dataset.clear === uid), cardBox.uid)
    check(onSlot, '拖拽经过槽位时出现落点高亮')
    check(placed, '从待上阵拖拽可上阵', cardBox.uid)
  }
}

// 拖拽下阵：把阵位拖到待上阵区域
{
  const slotBox = await page.evaluate(() => {
    const s = document.querySelector('.slot-v2.filled')
    const r = s.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, uid: s.dataset.clear }
  })
  const benchBox = await page.evaluate(() => {
    const b = document.querySelector('.bench-strip')
    const r = b.getBoundingClientRect()
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  })
  const beforeCount = await page.evaluate(() => document.querySelectorAll('.slot-v2.filled').length)
  await page.mouse.move(slotBox.x, slotBox.y)
  await page.mouse.down()
  await page.mouse.move(slotBox.x + 10, slotBox.y + 10, { steps: 4 })
  await page.mouse.move(benchBox.x, benchBox.y, { steps: 14 })
  await new Promise((r) => setTimeout(r, 150))
  const benchHi = await page.evaluate(() => !!document.querySelector('.bench-strip.drop-bench'))
  await page.mouse.up()
  await new Promise((r) => setTimeout(r, 400))
  const afterCount = await page.evaluate(() => document.querySelectorAll('.slot-v2.filled').length)
  check(benchHi, '拖到待上阵区域时出现下阵高亮')
  check(afterCount === beforeCount - 1, '拖到待上阵区域可下阵', `${beforeCount} → ${afterCount}`)
}

// ══════════════ T3 征战四档难度 ══════════════
console.log('\n=== T3 征战四档难度 ===')
await goScreen('campaign')
await new Promise((r) => setTimeout(r, 600))
const diffChips = await page.evaluate(() =>
  [...document.querySelectorAll('[data-diff]')].map((c) => ({ d: c.dataset.diff, on: c.classList.contains('on'), disabled: c.disabled })),
)
check(diffChips.length === 4, '难度选择器有 4 档', JSON.stringify(diffChips.map((c) => c.d)))
check(diffChips.filter((c) => c.on).length === 1, '默认选中一档')

// 普通档已通 200，困难应解锁
const hardChip = diffChips.find((c) => c.d === 'hard')
check(hardChip && !hardChip.disabled, '普通已通关后「困难」解锁')

// 切到困难
await page.evaluate(() => document.querySelector('[data-diff="hard"]')?.click())
await new Promise((r) => setTimeout(r, 700))
const hardState = await page.evaluate(() => {
  const head = document.querySelector('.war-head small')?.textContent ?? ''
  const chips = [...document.querySelectorAll('[data-diff]')].map((c) => ({ d: c.dataset.diff, on: c.classList.contains('on'), disabled: c.disabled }))
  return { head, chips }
})
check(hardState.chips.find((c) => c.d === 'hard')?.on, '可切换到「困难」难度')
check(hardState.head.trim().startsWith('0/'), '困难难度进度独立从 0 开始', hardState.head.trim())
{
  const epic = hardState.chips.find((c) => c.d === 'epic')
  const hero = hardState.chips.find((c) => c.d === 'hero')
  check(hero && hero.disabled, '「英雄」需先打通困难第 1 关才解锁')
  check(epic && epic.disabled, '「史诗」需先打通英雄第 1 关才解锁')
}

// 困难第 1 关可挑战
await page.evaluate(() => document.querySelector('[data-open-chapter="1"]')?.click())
await new Promise((r) => setTimeout(r, 600))
const hardChapter = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll('[data-challenge]')]
  return {
    total: nodes.length,
    locked: nodes.filter((n) => n.disabled).length,
    firstDisabled: nodes[0]?.disabled,
  }
})
check(hardChapter.total === 10, '章节页 10 个关卡', String(hardChapter.total))
check(hardChapter.firstDisabled === false, '困难第 1 关可挑战（未被普通难度进度卡住）')
check(hardChapter.locked >= 9, '困难第 2 关起按递进锁定', `锁定 ${hardChapter.locked} 个`)

// 进入备战页应显示难度标签
await page.evaluate(() => document.querySelector('[data-challenge="1"]')?.click())
await new Promise((r) => setTimeout(r, 700))
const prep = await page.evaluate(() => ({
  tag: document.querySelector('.prep-diff')?.textContent ?? '',
  title: document.querySelector('.prep-screen h3')?.textContent ?? '',
  hasPrep: !!document.querySelector('.prep-screen'),
}))
check(prep.hasPrep, '进入备战页')
check(prep.tag.trim() === '困难', '备战页显示当前难度标签', prep.tag.trim())

// 上位难度未通关时，本档高关卡应被拦截
const unlockMsg = await page.evaluate(async () => {
  const node = document.querySelector('[data-challenge="2"]')
  return { disabled: node?.disabled, tip: node?.getAttribute('title') ?? '' }
})
check(unlockMsg.disabled === true, '困难第 2 关需先通困难第 1 关')
check(unlockMsg.tip.includes('前置') || unlockMsg.tip.includes('未解锁'), '锁定关卡有原因提示', unlockMsg.tip)

// 难度 chip 的解锁说明
const chipTips = await page.evaluate(() =>
  [...document.querySelectorAll('[data-diff]')].map((c) => ({ d: c.dataset.diff, disabled: c.disabled, tip: c.getAttribute('title') ?? '' })),
)
check(
  chipTips.find((c) => c.d === 'hero')?.tip.includes('困难'),
  '「英雄」chip 提示需先通困难',
  chipTips.find((c) => c.d === 'hero')?.tip ?? '',
)

// 难度进度独立：切回普通应仍是 200/200
await page.evaluate(() => document.querySelector('[data-map-back]')?.click())
await new Promise((r) => setTimeout(r, 400))
await page.evaluate(() => document.querySelector('[data-diff="normal"]')?.click())
await new Promise((r) => setTimeout(r, 700))
const backNormal = await page.evaluate(() => document.querySelector('.war-head small')?.textContent?.trim() ?? '')
check(backNormal.startsWith('200/'), '切回普通难度进度仍为 200/200（各难度独立）', backNormal)

console.log('\n控制台错误：', errors.length ? errors.slice(0, 5) : '无')
console.log(`\n通过 ${pass} 项，失败 ${fail} 项`)
await browser.close()
process.exit(fail > 0 ? 1 : 0)
