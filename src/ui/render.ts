import { EQUIP_MAP, GEAR_QUALITY, GEAR_SLOTS, SLOT_LABEL } from '../data/equips'
import { BONDS, FACTION_LABEL, FACTION_TIERS, HEROES, HERO_MAP, ROLE_LABEL } from '../data/heroes'
import { awakenSkills, heroSkills, divineSkill } from '../data/skills'
import { attackLine } from '../data/attackLine'
import { icon, offerIcon, skillIcon } from './icons'
import { CHAPTER_SIZE, CHAPTERS, DIFFICULTIES, DIFFICULTY_ORDER, prevDifficulty, STAGES, stageFor } from '../data/stages'
import type { Difficulty, EquipSlot, Faction, OwnedHero, Screen, SkillCond, SkillTarget } from '../data/types'
import { accountState, bootAccount, login, logout, onAccount, register } from '../game/account'
import { FACTION_PULL_COST } from '../game/gacha'
import { activeBonds, awakenCost, breakthroughCost, calcStats, equipBonus, equipLevelCap, exclusiveBonus, factionAuras, findDivinePartner, fodderCandidates, isMaxedHero, levelCap, levelUpCost, MAX_BREAKTHROUGH, SMITH_CAP, smithCost, soulCost, soulFromHero, upgradeCost } from '../game/stats'
import { store } from '../game/store'
import { enemyBreakthrough, squadSlots } from '../game/squad'
import { battleBoardHtml, battleReportHtml, startBattlePlayback, type BattlePlayback } from './battlePlay'
import { battleSprite } from './battleSprite'
import { playDivineMerge } from './divineFx'
import { playGachaAnim } from './gachaAnim'
import { equipArt } from './equipArt'
import { portraitHtml } from './portrait'
import { rarityStarsHtml, rarityTagHtml } from './rarity'
import { primeAudio } from './audio'

function statLine(def: { atk: number; hp: number; def: number; rarity?: string }, level: number, forge = 0): string {
  const grown = equipBonus(def, level, forge)
  const parts: string[] = []
  if (grown.atk) parts.push(`攻${grown.atk}`)
  if (grown.hp) parts.push(`血${grown.hp}`)
  if (grown.def) parts.push(`防${grown.def}`)
  return parts.join(' ') || '无加成'
}

function exclusiveText(def: { exclusive?: { heroId: string; atk: number; hp: number; def: number } }, level: number, forge = 0): string {
  if (!def.exclusive) return ''
  const name = HERO_MAP[def.exclusive.heroId]?.name ?? ''
  const extra = exclusiveBonus(def, level, forge, def.exclusive.heroId)
  const parts: string[] = []
  if (extra.atk) parts.push(`攻${extra.atk}`)
  if (extra.hp) parts.push(`血${extra.hp}`)
  if (extra.def) parts.push(`防${extra.def}`)
  return name ? `专属${name} ${parts.join(' ')}` : ''
}

function mainStat(def: { atk: number; hp: number; def: number; rarity?: string }, level: number, forge = 0): string {
  const grown = equipBonus(def, level, forge)
  if (grown.atk >= grown.hp && grown.atk >= grown.def && grown.atk) return `攻${grown.atk}`
  if (grown.hp >= grown.def && grown.hp) return `血${grown.hp}`
  return grown.def ? `防${grown.def}` : ''
}

let accountBooted = false
let toastTimer = 0
let stopBattle: BattlePlayback | null = null
// 记录已启动回放的那场战斗，避免重绘时从头重播
let playedBattle: unknown = null
// 回放是否已播完（用于渲染终态战场与战报）
let battleFinished = false
let stopGacha: (() => void) | null = null
let selectedSlot: number | null = null
let gearPick: EquipSlot | null = null
let dragMoved = false
const pickFilter = { faction: 'all', role: 'all', rarity: 'all' }
let equipSlot: 'all' | 'exclusive' | EquipSlot = 'all'
let openEquipUid: string | null = null

const SLOT_ORDER: Record<string, number> = { weapon: 0, helm: 1, armor: 2, boots: 3, accessory: 4, treasure: 5 }

function sortEquips<T extends { equipId: string; level: number; forge?: number }>(list: T[]): T[] {
  return [...list].sort((a, b) => {
    const da = EQUIP_MAP[a.equipId]
    const db = EQUIP_MAP[b.equipId]
    const byRarity = (RARITY_RANK[db?.rarity ?? 'R'] ?? 0) - (RARITY_RANK[da?.rarity ?? 'R'] ?? 0)
    if (byRarity) return byRarity
    const bySlot = (SLOT_ORDER[da?.slot ?? ''] ?? 9) - (SLOT_ORDER[db?.slot ?? ''] ?? 9)
    if (bySlot) return bySlot
    const byLevel = b.level - a.level
    if (byLevel) return byLevel
    return (b.forge ?? 0) - (a.forge ?? 0)
  })
}
const rosterFilter = { faction: 'all', role: 'all', rarity: 'all' }
let bannerFaction: Faction = 'shu'
let rosterMode: 'list' | 'exchange' | 'scrap' = 'list'
/** 批量分解模式的勾选集合 */
const scrapPicks = new Set<string>()
let mapChapter: number | null = null
const RARITY_RANK: Record<string, number> = { N: 0, R: 1, SR: 2, SSR: 3 }

/** 技能触发条件的中文说明 */
const COND_LABEL: Record<string, string> = {
  always: '',
  'ally-hurt': '友军重伤时',
  'self-burn': '自身被灼烧时',
  'self-poison': '自身中毒时',
  'enemy-burn': '敌阵有灼烧时',
  'enemy-control': '敌阵被控时',
  'hp-high': '自身血量充沛时',
  'hp-low': '自身残血时',
  'enemy-few': '敌军溃败时',
}

/** 技能目标的中文说明 */
const TARGET_LABEL: Record<string, string> = {
  'enemy-front': '敌方前排',
  'enemy-low': '敌方残血',
  'enemy-all': '敌方全体',
  'enemy-back': '敌方后排',
  'enemy-random': '敌方随机',
  'ally-low': '友军残血',
  'ally-all': '我方全体',
  'ally-other': '我方其他',
  self: '自身',
}

export function mount(root: HTMLElement): void {
  // 首个用户交互时预热 AudioContext（浏览器策略要求）
  const firstTouch = () => {
    primeAudio()
    window.removeEventListener('pointerdown', firstTouch)
    window.removeEventListener('keydown', firstTouch)
  }
  window.addEventListener('pointerdown', firstTouch, { once: true })
  window.addEventListener('keydown', firstTouch, { once: true })

  let lastScreen: Screen | null = null
  const render = () => {
    // 战斗回放进行中：只更新提示条等轻量内容，绝不重建 DOM，否则会中断回放
    if (stopBattle && !stopBattle.finished && store.screen === 'battle') {
      updateBattleLive(root)
      return
    }
    stopBattle?.()
    stopBattle = null
    // 抽卡播放中若被意外重绘，先停掉旧动画
    if (store.gachaPhase !== 'playing') {
      stopGacha?.()
      stopGacha = null
    }
    const main = root.querySelector<HTMLElement>('.main')
    const heroScroll = root.querySelector<HTMLElement>('.hero-sheet')
    const benchStrip = root.querySelector<HTMLElement>('.bench-strip')
    const keep = {
      screen: store.screen,
      hero: store.save.selectedHeroUid,
      mainTop: main?.scrollTop ?? 0,
      heroTop: heroScroll?.scrollTop ?? 0,
      benchTop: benchStrip?.scrollTop ?? 0,
    }
    const switched = lastScreen !== null && lastScreen !== store.screen
    lastScreen = store.screen
    if (store.screen !== 'battle') {
      playedBattle = null
      battleFinished = false
    }
    root.innerHTML = view()
    bind(root)
    if (switched) {
      const shell = root.querySelector<HTMLElement>('.shell')
      shell?.classList.add('screen-enter')
    }
    if (store.screen === keep.screen) {
      const nextMain = root.querySelector<HTMLElement>('.main')
      if (nextMain) nextMain.scrollTop = keep.mainTop
      const nextBench = root.querySelector<HTMLElement>('.bench-strip')
      if (nextBench) nextBench.scrollTop = keep.benchTop
      if (store.screen === 'hero' && store.save.selectedHeroUid === keep.hero) {
        const nextHero = root.querySelector<HTMLElement>('.hero-sheet')
        if (nextHero) nextHero.scrollTop = keep.heroTop
      }
    }
    if (store.screen === 'battle' && store.lastBattle && store.lastBattle !== playedBattle) {
      playedBattle = store.lastBattle
      battleFinished = false
      const auto = store.battleMode === 'stage' && store.autoPushing
      stopBattle = startBattlePlayback(root, store.lastBattle, {
        onFinish: () => {
          battleFinished = true
          store.onBattlePlaybackDone()
        },
        speed: auto ? store.pushSpeed() : store.battleSpeed(),
        onSpeed: (n) => (auto ? store.setPushSpeed(n) : store.setBattleSpeed(n)),
      })
    }
    if (store.screen === 'gacha' && store.gachaPhase === 'playing' && store.lastPulls.length) {
      stopGacha?.()
      stopGacha = playGachaAnim(root, store.lastPulls, () => store.finishGachaAnim())
    }
    if (store.toast) {
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(() => {
        // 只移除 toast 元素，不触发全量重绘（重绘会中断战斗回放）
        store.clearToast()
        root.querySelector('.toast')?.remove()
      }, 2200)
    }
    if (store.heroFx) {
      window.setTimeout(() => store.clearHeroFx(), 1200)
    }
  }
  store.subscribe(render)
  if (!accountBooted) {
    accountBooted = true
    onAccount((ev, save) => {
      if (ev === 'in' && save && store.adoptSave(save)) return
      store.redraw()
    })
    void bootAccount()
  }
  render()
}

function tabOn(id: Screen): boolean {
  if (store.screen === id) return true
  if (store.screen === 'hero' && id === 'roster') return true
  if (store.screen === 'battle' && store.battleMode !== 'arena' && id === 'campaign') return true
  if (store.screen === 'prep' && store.battleMode !== 'arena' && id === 'campaign') return true
  if (store.screen === 'prep' && store.battleMode === 'arena' && id === 'arena') return true
  return false
}

function loginView(): string {
  const gate = accountState()
  if (gate.pending) return `<div class="shell screen-login"><p class="login-wait">正在读取存档…</p></div>`
  const lead = gate.kicked
    ? '这个账号已在其他地方登录，当前页面已下线。'
    : '登录后，换一个浏览器也能看到同一份武将。同一账号同时只能在一个网页里在线。'
  return `
  <div class="shell screen-login">
    <form class="login-gate" autocomplete="on">
      <h1>三国卡牌</h1>
      <p>${lead}</p>
      <p>第一次注册，会把当前浏览器里的武将上传。请在想保留进度的那个浏览器里注册。</p>
      <input name="user" maxlength="12" placeholder="账号" autocomplete="username" spellcheck="false" />
      <input name="pass" type="password" maxlength="32" placeholder="密码" autocomplete="current-password" />
      <p class="err">${escapeHtml(gate.error)}</p>
      <div class="login-actions">
        <button type="button" class="btn btn-primary" data-auth="login">登录</button>
        <button type="button" class="btn" data-auth="register">注册</button>
      </div>
    </form>
  </div>`
}

function view(): string {
  if (!accountState().authed) return loginView()
  const s = store.save
  const dockOff = store.screen === 'battle' || store.screen === 'hero' || store.screen === 'prep'
  const moreOn = store.screen === 'team' || store.screen === 'equip' || store.screen === 'equipGacha' || store.screen === 'shop' || store.screen === 'arena' || (store.screen === 'battle' && store.battleMode === 'arena')
  const playing = store.screen === 'gacha' && store.gachaPhase === 'playing'
  const leadUid = s.team.find((id): id is string => !!id)
  const lead = s.owned.find((o) => o.uid === leadUid) ?? s.owned[0]
  const face = lead ? `/sprites/${lead.heroId}.webp` : ''
  return `
  <div class="shell screen-${store.screen}${dockOff ? ' dock-off' : ''}">
    ${store.toast ? `<div class="toast">${escapeHtml(store.toast)}</div>` : ''}
    <header class="statusbar">
      <div class="player-pill">
        <span class="avatar photo">${face ? `<img src="${face}" alt="" />` : ''}</span>
        <span class="player-meta">
          <b>${escapeHtml(accountState().name || '主公')}</b>
          <small>Lv.${s.playerLevel} ${icon('atk')}${store.power()}</small>
        </span>
      </div>
      <div class="res-row">
        <span class="res" title="银两"><i>${icon('gold')}</i><b>${s.gold}</b></span>
        <span class="res" title="元宝"><i>${icon('jade')}</i><b>${s.jade}</b></span>
        <span class="res" title="招募令"><i>${icon('ticket')}</i><b>${s.tickets}</b></span>
        <span class="res" title="阵符"><i>${icon('seal')}</i><b>${s.seals ?? 0}</b></span>
        <span class="res" title="觉醒丹"><i>${icon('pill')}</i><b>${s.awakenStone}</b></span>
        <span class="res" title="锻造石"><i>${icon('stone')}</i><b>${s.forgeStone}</b></span>
        <span class="res" title="精铁"><i>${icon('iron')}</i><b>${s.iron ?? 0}</b></span>
        <span class="res" title="铸令"><i>${icon('chest')}</i><b>${s.equipTickets ?? 0}</b></span>
      </div>
    </header>
    <main class="main">${screen()}</main>
    <div class="more-sheet" id="more-sheet">
      <button type="button" data-nav="team" class="${store.screen === 'team' ? 'on' : ''}"><i>${icon('team')}</i><span>布阵</span></button>
      <button type="button" data-nav="equip" class="${store.screen === 'equip' ? 'on' : ''}"><i>${icon('equip')}</i><span>装备</span></button>
      <button type="button" data-nav="shop" class="${store.screen === 'shop' ? 'on' : ''}"><i>${icon('shop')}</i><span>商店</span></button>
      <button type="button" data-nav="arena" class="${store.screen === 'arena' ? 'on' : ''}"><i>${icon('arena')}</i><span>竞技</span></button>
      <button type="button" data-action="fill"><i>${icon('gold')}</i><span>补满</span></button>
      <button type="button" data-action="reset"><i>${icon('refresh')}</i><span>重置</span></button>
      <button type="button" data-logout><i>${icon('back')}</i><span>退出</span></button>
    </div>
    <nav class="dock">
      <button type="button" data-nav="home" class="${tabOn('home') ? 'active' : ''}"><i>${icon('city')}</i><span>主城</span></button>
      <button type="button" data-nav="roster" class="${tabOn('roster') ? 'active' : ''}"><i>${icon('roster')}</i><span>武将</span></button>
      <button type="button" data-nav="gacha" class="dock-recruit ${tabOn('gacha') ? 'active' : ''}"><i>${icon('drum')}</i><span>招募</span></button>
      <button type="button" data-nav="campaign" class="${tabOn('campaign') ? 'active' : ''}"><i>${icon('war')}</i><span>征战</span></button>
      <button type="button" data-dock-more class="${moreOn ? 'active' : ''}"><i>${icon('more')}</i><span>更多</span></button>
    </nav>
    ${
      store.screen === 'gacha'
        ? `<div id="gacha-overlay" class="gacha-overlay ${playing ? 'active' : ''}" aria-hidden="${playing ? 'false' : 'true'}">
      <div class="gacha-veil"></div>
      <div id="gacha-portal" class="gacha-portal">
        <div class="portal-ring r1"></div>
        <div class="portal-ring r2"></div>
        <div class="portal-core">召</div>
      </div>
      <div id="gacha-board" class="gacha-board"></div>
      <p class="gacha-hint">点击卡牌翻开</p>
      <button type="button" class="btn gacha-skip" data-gacha-skip>跳过动画</button>
    </div>`
        : ''
    }
  </div>`
}

function screen(): string {
  switch (store.screen) {
    case 'gacha':
      return gachaView()
    case 'roster':
      return rosterView()
    case 'hero':
      return heroDetailView()
    case 'team':
      return teamView()
    case 'equip':
      return equipView()
    case 'equipGacha':
      return equipGachaView()
    case 'shop':
      return shopView()
    case 'campaign':
      return campaignView()
    case 'arena':
      return arenaView()
    case 'prep':
      return prepView()
    case 'battle':
      return battleView()
    default:
      return homeView()
  }
}

function shopView(): string {
  const s = store.save
  const freeLeft = s.shopRefreshUsed < 1
  return `
  <section class="panel">
    <div class="form-head">
      <h3>${icon('shop')}商店</h3>
      <button class="btn btn-gold icon-btn" data-action="shop-refresh" aria-label="刷新">${icon('refresh')}${freeLeft ? '' : '<small>15</small>'}</button>
    </div>
    <div class="card-grid" style="margin-top:14px">
      ${s.shopOffers
        .map((o) => {
          const priceIcon = o.costJade != null ? icon('jade') : icon('gold')
          const price = o.costJade != null ? o.costJade : o.costGold
          return `<article class="hero-card equip-card ${o.bought ? 'bought' : ''}">
            <div class="art" style="--accent:var(--gold)"><div class="glyph">${offerIcon(o.title)}</div></div>
            <div class="meta">
              <div class="name">${o.title}</div>
              <button class="btn btn-primary shop-buy" data-buy="${o.id}" ${o.bought ? 'disabled' : ''} aria-label="购买">${priceIcon}<b>${o.bought ? '' : price}</b></button>
            </div>
          </article>`
        })
        .join('')}
    </div>
  </section>`
}

function castFigure(slot: number, role: 'back' | 'front' | 'lead'): string {
  const uid = store.save.team[slot]
  const owned = uid ? store.save.owned.find((o) => o.uid === uid) : null
  const hero = owned ? HERO_MAP[owned.heroId] : null
  if (!owned || !hero) return ''
  return `<button type="button" class="cast-hero ${role} faction-${hero.faction} rarity-${hero.rarity}" data-open="${owned.uid}" aria-label="${hero.name}">
    <i class="cast-pad" aria-hidden="true"></i>
    <em class="cast-lv"><i class="lv-arrow">${owned.level}</i><b>${hero.name}</b></em>
    <img src="/sprites/${hero.id}.webp" alt="" draggable="false" />
  </button>`
}

function homeView(): string {
  const s = store.save
  // 5 个立绘站位：左前 / 中前(主) / 右前 / 左后 / 右后
  const lineup: [number, 'lead' | 'front' | 'back'][] = [
    [3, 'back'],
    [1, 'front'],
    [0, 'lead'],
    [2, 'front'],
    [4, 'back'],
    [5, 'back'],
  ]
  const figures = lineup.map(([slot, role]) => castFigure(slot, role)).join('')
  const empty = !figures

  // 左侧竖排小图标（邮件/好友/查看/图鉴/令旗/榜文）
  const railLeft = [
    { ic: 'mail', lab: '邮件', nav: 'shop', badge: 1 },
    { ic: 'friends', lab: '好友', nav: 'arena', badge: 1 },
    { ic: 'eye', lab: '查看', nav: 'roster', badge: 0 },
    { ic: 'codex', lab: '图鉴', nav: 'roster', badge: 0 },
    { ic: 'flag', lab: '助手', nav: 'campaign', badge: 0 },
    { ic: 'notice', lab: '公告', nav: 'shop', badge: 0 },
  ]
  // 顶部活动图标（8个）
  const feats = [
    { lab: '限时挑战', nav: 'campaign', dot: true, ic: 'flame' },
    { lab: '拍卖', nav: 'shop', dot: false, ic: 'gold' },
    { lab: '活动', nav: 'shop', dot: true, ic: 'gift' },
    { lab: '商店', nav: 'shop', dot: true, ic: 'shop' },
    { lab: '心愿商店', nav: 'shop', dot: false, ic: 'ring' },
    { lab: '任务', nav: 'campaign', dot: true, ic: 'notice' },
    { lab: '贵族特权', nav: 'shop', dot: false, ic: 'jade' },
    { lab: '充值', nav: 'shop', dot: true, ic: 'jade' },
  ]

  return `
  <section class="plaza">
    <i class="stage-light" aria-hidden="true"></i>

    <!-- 左侧竖排小图标 -->
    <nav class="rail-icons" aria-label="快捷">
      ${railLeft
        .map(
          (r) => `<button type="button" class="rail-ic" data-nav="${r.nav}" aria-label="${r.lab}">
        <i>${icon(r.ic as never)}</i>
        <span class="gtip">${r.lab}</span>
        ${r.badge ? `<em>${r.badge}</em>` : ''}
      </button>`,
        )
        .join('')}
    </nav>

    <!-- 顶部活动条 -->
    <nav class="feat-bar" aria-label="活动">
      ${feats
        .map(
          (f, i) => `<button type="button" class="feat-ic" data-nav="${f.nav}" aria-label="${f.lab}">
        <i class="feat-disc feat-${i % 8}">${icon(f.ic as never)}</i>
        <span>${f.lab}</span>
        ${f.dot ? '<em class="dot"></em>' : ''}
      </button>`,
        )
        .join('')}
    </nav>

    <!-- 左下任务提示 -->
    <div class="quest-tip">
      <i class="qt-ic">${icon('city')}</i>
      <div class="qt-text">
        <b>试炼副本</b>
        <small>达到85级开启</small>
      </div>
    </div>

    <!-- 左右竖条幅 -->
    <button type="button" class="side-scroll left" data-nav="gacha" aria-label="九州探宝">
      <i>九州</i><b>探宝</b>
    </button>
    <div class="side-scrolls-right">
      <button type="button" class="side-scroll" data-nav="arena" aria-label="名人堂">
        <i>名</i><b>人堂</b>
      </button>
      <button type="button" class="side-scroll" data-nav="team" aria-label="军团">
        <i>军</i><b>团</b>
      </button>
    </div>

    <!-- 中央舞台：武将立绘 -->
    <div class="plaza-stage">
      <div class="cast-row">${figures}</div>
      ${empty ? `<button type="button" class="plaza-empty" data-nav="team" aria-label="去布阵">去布阵</button>` : ''}
      <i class="plaza-carpet"></i>
    </div>

    <!-- 底部系统消息条 -->
    <div class="sys-msg" role="status">
      <span class="sys-tag">系统</span>
      <span class="sys-text">锦帆萧萧文福至心灵，在十连中招将中，将2名红将招入麾下，威名远扬，霸业必成！</span>
    </div>

    <!-- 快捷入口（保留招募/征战） -->
    <div class="plaza-quick">
      <button type="button" class="quick-btn" data-nav="gacha" aria-label="招募">
        <i>${icon('drum')}</i><span>招募</span>
      </button>
      <button type="button" class="quick-btn" data-nav="campaign" aria-label="征战">
        <i>${icon('war')}</i><span>征战</span><small>${s.stageCleared}</small>
      </button>
    </div>
  </section>`
}

function gachaView(): string {
  const results = store.lastPulls
  const playing = store.gachaPhase === 'playing'
  const showResult = store.gachaPhase === 'result' && results.length > 0
  const again = store.lastBanner
  const scrolls: { faction: Faction; heroId: string }[] = [
    { faction: 'wei', heroId: 'zhenji' },
    { faction: 'shu', heroId: 'zhaoyun' },
    { faction: 'wu', heroId: 'sunce' },
    { faction: 'qun', heroId: 'lvbu' },
  ]

  if (showResult) {
    const best = results.reduce((a, b) => ((RARITY_RANK[b.hero.rarity] ?? 0) > (RARITY_RANK[a.hero.rarity] ?? 0) ? b : a))
    const bannerAttr = again ? `data-banner="${again}"` : ''
    const costIcon = again ? icon('seal') : icon('ticket')
    const cost1 = again ? FACTION_PULL_COST[1] : ''
    const cost10 = again ? FACTION_PULL_COST[10] : ''
    return `
    <section class="recruit-result ${results.length === 1 ? 'single' : ''}">
      <header class="result-head"><b>${best.hero.rarity}</b><span>${best.hero.name}</span><small>×${results.length}</small></header>
      <div class="summon-result-grid">${results.map((r) => resultCardHtml(r.owned.heroId, r.isNew, r.hero.rarity)).join('')}</div>
      <div class="recruit-bar">
        <button type="button" class="pull-ghost" data-gacha-back>返回</button>
        <button type="button" class="pull-big" data-pull="1" ${bannerAttr} aria-label="再抽一次">${costIcon}<b>1</b>${cost1 ? `<small>${cost1}</small>` : ''}</button>
        <button type="button" class="pull-big ten" data-pull="10" ${bannerAttr} aria-label="再抽十次">${costIcon}<b>10</b>${cost10 ? `<small>${cost10}</small>` : ''}</button>
      </div>
    </section>`
  }

  return `
  <section class="recruit-hall ${playing ? 'dimmed' : ''}">
    <aside class="recruit-side">
      <button type="button" class="side-pull" data-pull="1" aria-label="普通单抽" ${playing ? 'disabled' : ''}>${icon('ticket')}<b>1</b></button>
      <button type="button" class="side-pull ten" data-pull="10" aria-label="普通十连" ${playing ? 'disabled' : ''}>${icon('ticket')}<b>10</b></button>
      <small class="pity">${store.save.pity}/30</small>
    </aside>
    <div class="recruit-stage">
      <div class="scroll-row">
        ${scrolls
          .map(({ faction, heroId }) => {
            const on = bannerFaction === faction
            return `<div class="faction-scroll ${faction}${on ? ' on' : ''}">
              <i class="roll"></i>
              <button type="button" class="paper" data-banner-pick="${faction}" aria-label="${FACTION_LABEL[faction]}" ${playing ? 'disabled' : ''}>
                <img src="/sprites/${heroId}.webp" alt="" draggable="false" />
                <b class="seal">${FACTION_LABEL[faction]}</b>
              </button>
              <i class="roll"></i>
            </div>`
          })
          .join('')}
      </div>
      <div class="recruit-bar">
        <b class="bar-faction ${bannerFaction}">${FACTION_LABEL[bannerFaction]}</b>
        <button type="button" class="pull-big" data-pull="1" data-banner="${bannerFaction}" aria-label="阵营单抽" ${playing ? 'disabled' : ''}>${icon('seal')}<b>1</b><small>${FACTION_PULL_COST[1]}</small></button>
        <button type="button" class="pull-big ten" data-pull="10" data-banner="${bannerFaction}" aria-label="阵营十连" ${playing ? 'disabled' : ''}>${icon('seal')}<b>10</b><small>${FACTION_PULL_COST[10]}</small></button>
      </div>
    </div>
  </section>`
}

function resultCardHtml(heroId: string, isNew: boolean, rarity: string): string {
  const h = HERO_MAP[heroId]
  return `
  <article class="result-card card-frame rarity-${rarity} faction-${h.faction}" style="--accent:${h.color}">
    ${rarityTagHtml(rarity)}
    <span class="faction-chip faction-${h.faction}">${FACTION_LABEL[h.faction]}</span>
    <div class="result-art">${portraitHtml(h, 160)}</div>
    <div class="meta">
      <div class="name">${h.name}<i class="mini-tag">${isNew ? 'NEW' : '再临'}</i></div>
      ${rarityStarsHtml(rarity)}
      <div class="sub">${h.title}</div>
    </div>
  </article>`
}

function rosterView(): string {
  const team = new Set(store.save.team.filter((id): id is string => !!id))
  const sorted = [...store.save.owned].sort((a, b) => {
    const onA = team.has(a.uid) ? 1 : 0
    const onB = team.has(b.uid) ? 1 : 0
    if (onA !== onB) return onB - onA
    return calcStats(b, store.save.equips).power - calcStats(a, store.save.equips).power
  })
  const visible = sorted.filter((o) => matchesFilter(rosterFilter, HERO_MAP[o.heroId]))
  const deployed = visible.filter((o) => team.has(o.uid))
  const bench = visible.filter((o) => !team.has(o.uid))
  const card = (o: (typeof sorted)[number]) =>
    heroCardHtml(o, { open: true, compact: true, deployed: team.has(o.uid) })
  if (rosterMode === 'exchange') return exchangeView()
  if (rosterMode === 'scrap') return scrapView()
  return `
  <section class="panel roster-panel">
    <div class="roster-bar">
      <h3>${icon('roster')}武将名录<span>${store.save.owned.length}</span></h3>
      <span class="soul-pill">${icon('soul')}${store.save.soul ?? 0}</span>
      <button type="button" class="btn btn-gold icon-btn" data-roster-mode="scrap" aria-label="批量分解" title="批量分解">${icon('soul')}</button>
      <button type="button" class="btn btn-gold icon-btn" data-roster-mode="exchange" aria-label="兑换">${icon('shop')}</button>
    </div>
    ${filterRows(rosterFilter, 'data-roster-filter')}
    ${deployed.length ? `<p class="roster-label">${icon('team')}上阵 ${deployed.length}</p><div class="card-grid pick-grid">${deployed.map(card).join('')}</div>` : ''}
    ${bench.length ? `<p class="roster-label">${icon('roster')}待命 ${bench.length}</p><div class="card-grid pick-grid">${bench.map(card).join('')}</div>` : ''}
    <p class="pick-empty muted"${visible.length ? ' hidden' : ''}>没有符合的武将</p>
  </section>`
}

function exchangeView(): string {
  const ownedIds = new Set(store.save.owned.map((o) => o.heroId))
  const list = [...HEROES].sort((a, b) => (RARITY_RANK[b.rarity] ?? 0) - (RARITY_RANK[a.rarity] ?? 0) || b.atk - a.atk)
  const shown = list.filter((h) => matchesFilter(rosterFilter, h))
  return `
  <section class="panel roster-panel">
    <div class="roster-bar">
      <button type="button" class="btn" data-roster-mode="list">返回</button>
      <span class="soul-pill">${icon('soul')}${store.save.soul ?? 0}</span>
    </div>
    <p class="roster-label">${icon('soul')}</p>
    ${filterRows(rosterFilter, 'data-roster-filter')}
    <div class="card-grid pick-grid">
      ${shown
        .map((h) => {
          const cost = soulCost(h.rarity)
          const owned = ownedIds.has(h.id)
          return `<article class="hero-card clickable pick-card card-frame rarity-${h.rarity} faction-${h.faction}" data-exchange="${h.id}" data-faction="${h.faction}" data-role="${h.role}" data-rarity="${h.rarity}">
            <span class="faction-chip faction-${h.faction}">${FACTION_LABEL[h.faction]}</span>
            ${rarityTagHtml(h.rarity)}
            <div class="art">${portraitHtml(h, 72)}</div>
            <div class="meta">
              <div class="name">${h.name}</div>
              <div class="sub">${owned ? `已有 · ${cost}魂` : `${cost} 将魂`}</div>
            </div>
          </article>`
        })
        .join('')}
    </div>
    <p class="pick-empty muted"${shown.length ? ' hidden' : ''}>没有符合的武将</p>
  </section>`
}

/** 批量分解：勾选未上阵且非神将的武将，一键换成将魂 */
function scrapView(): string {
  const team = new Set(store.save.team.filter((id): id is string => !!id))
  const pool = [...store.save.owned]
    .filter((o) => !team.has(o.uid) && !o.divine)
    .sort((a, b) => calcStats(a, store.save.equips).power - calcStats(b, store.save.equips).power)
  const visible = pool.filter((o) => matchesFilter(rosterFilter, HERO_MAP[o.heroId]))
  for (const uid of [...scrapPicks]) if (!pool.some((o) => o.uid === uid)) scrapPicks.delete(uid)
  const chosen = pool.filter((o) => scrapPicks.has(o.uid))
  const gain = chosen.reduce((sum, o) => sum + soulFromHero(HERO_MAP[o.heroId].rarity, o.shards), 0)
  const allOn = visible.length > 0 && visible.every((o) => scrapPicks.has(o.uid))
  return `
  <section class="panel roster-panel">
    <div class="roster-bar">
      <button type="button" class="btn" data-roster-mode="list">返回</button>
      <span class="soul-pill">${icon('soul')}${store.save.soul ?? 0}</span>
      <button type="button" class="btn" data-scrap-all ${visible.length ? '' : 'disabled'}>${allOn ? '取消全选' : '全选'}</button>
    </div>
    <p class="roster-label">${icon('soul')}点选要分解的武将（上阵与神将不可分解）</p>
    ${filterRows(rosterFilter, 'data-roster-filter')}
    <div class="card-grid pick-grid scrap-grid">${visible.map((o) => heroCardHtml(o, { scrap: true, compact: true, selected: scrapPicks.has(o.uid) })).join('')}</div>
    <p class="pick-empty muted"${visible.length ? ' hidden' : ''}>没有可分解的武将</p>
    <div class="scrap-bar">
      <span class="scrap-total">已选 <b>${chosen.length}</b> 名 · 可得 ${icon('soul')}<b>${gain}</b></span>
      <button type="button" class="btn btn-gold" data-scrap-confirm ${chosen.length ? '' : 'disabled'}>批量分解</button>
    </div>
  </section>`
}

function heroDetailView(): string {
  const owned = store.save.owned.find((o) => o.uid === store.save.selectedHeroUid)
  if (!owned) return `<section class="panel"><p>未选择武将</p><button class="btn" data-nav="roster">返回</button></section>`
  const h = HERO_MAP[owned.heroId]
  const st = calcStats(owned, store.save.equips)
  const bt = breakthroughCost(owned.breakthrough)
  const fodders = fodderCandidates(owned, store.save.owned, store.save.team)
  const aw = awakenCost(owned.awaken)
  const fx =
    store.heroFx?.uid === owned.uid
      ? store.heroFx.kind === 'level'
        ? 'fx-level'
        : store.heroFx.kind === 'divine'
          ? 'fx-divine'
          : 'fx-breakthrough'
      : ''
  const gearFloat = (slot: EquipSlot) => {
    const uid = owned.gear[slot]
    const eq = uid ? store.save.equips.find((e) => e.uid === uid) : null
    const def = eq ? EQUIP_MAP[eq.equipId] : null
    const label = def ? def.name : SLOT_LABEL[slot]
    const plus = def ? mainStat(def, eq?.level ?? 1, eq?.forge ?? 0) : ''
    const own = def?.exclusive?.heroId === owned.heroId ? ' own' : ''
    return `<button type="button" class="gear-float at-${slot} ${def ? 'filled' : 'empty'}${own}${gearPick === slot ? ' picking' : ''}" data-gear-slot="${slot}" aria-label="${label}" title="${def ? `${label} +${eq?.level ?? 1} 锻${eq?.forge ?? 0} ${statLine(def, eq?.level ?? 1, eq?.forge ?? 0)} ${exclusiveText(def, eq?.level ?? 1, eq?.forge ?? 0)}` : label}">
      <span class="tile rarity-${def?.rarity ?? 'empty'}">${eq ? `<b>+${eq.level}</b>` : ''}${equipArt(slot, def?.rarity ?? 'R', !def, eq?.equipId)}${plus ? `<small>${plus}</small>` : ''}</span>
      <em>${label}</em>
    </button>`
  }
  const wornBy = (equipUid: string) => {
    const who = store.save.owned.find((o) => Object.values(o.gear).includes(equipUid))
    return who ? HERO_MAP[who.heroId]?.name ?? '' : ''
  }
  const pickItems = gearPick
    ? sortEquips(store.save.equips.filter((eq) => EQUIP_MAP[eq.equipId]?.slot === gearPick))
    : []
  const currentEq = gearPick && owned.gear[gearPick] ? store.save.equips.find((e) => e.uid === owned.gear[gearPick!]) : null
  const currentDef = currentEq ? EQUIP_MAP[currentEq.equipId] : null
  const gearPop = gearPick
    ? `<div class="gear-pop" data-gear-close>
        <div class="gear-pop-card" onclick="event.stopPropagation()">
          <header>
            <b>${SLOT_LABEL[gearPick]}</b>
            <button type="button" data-gear-close aria-label="关闭">×</button>
          </header>

          ${
            currentEq && currentDef
              ? `<div class="gear-current rarity-${currentDef.rarity}">
                   <div class="gear-current-art">${equipArt(currentDef.slot, currentDef.rarity, false, currentDef.id)}</div>
                   <div class="gear-current-info">
                     <b>${currentDef.name} +${currentEq.level}</b>
                     <small>${statLine(currentDef, currentEq.level, currentEq.forge ?? 0)}</small>
                     ${exclusiveText(currentDef, currentEq.level, currentEq.forge ?? 0) ? `<small class="ex">${exclusiveText(currentDef, currentEq.level, currentEq.forge ?? 0)}</small>` : ''}
                   </div>
                   <div class="gear-current-acts">
                     <button type="button" class="act-btn act-up" data-upgrade="${currentEq.uid}" ${currentEq.level >= equipLevelCap(currentEq.forge ?? 0) ? 'disabled' : ''}>升级</button>
                     <button type="button" class="act-btn act-smith" data-smith="${currentEq.uid}" ${(currentEq.forge ?? 0) >= SMITH_CAP || currentEq.level < equipLevelCap(currentEq.forge ?? 0) ? 'disabled' : ''}>锻造</button>
                     <button type="button" class="act-btn act-off" data-unequip="${owned.uid}:${gearPick}">卸下</button>
                   </div>
                 </div>`
              : '<div class="gear-current empty"><span>当前未装备</span></div>'
          }

          <div class="gear-pop-list">
            ${
              pickItems.length
                ? pickItems
                    .map((eq) => {
                      const def = EQUIP_MAP[eq.equipId]
                      if (!def) return ''
                      const who = wornBy(eq.uid)
                      const on = owned.gear[gearPick!] === eq.uid
                      const grown = statLine(def, eq.level, eq.forge ?? 0)
                      const ex = exclusiveText(def, eq.level, eq.forge ?? 0)
                      return `<button type="button" class="gear-choice rarity-${def.rarity}${on ? ' on' : ''}${who ? ' worn' : ''}" data-wear="${eq.uid}" aria-label="${def.name}">
                        <i class="gear-choice-art">${equipArt(def.slot, def.rarity, false, def.id)}</i>
                        <span class="gear-choice-text">
                          <b>${def.name} <em>+${eq.level}</em></b>
                          <small>${grown}${ex ? ` · ${ex}` : ''}</small>
                        </span>
                        ${on ? '<em class="gear-choice-tag on">已穿</em>' : who ? `<em class="gear-choice-tag worn">${who}</em>` : ''}
                      </button>`
                    })
                    .join('')
                : '<p class="gear-pop-empty">背包里没有这个部位的装备</p>'
            }
          </div>
        </div>
      </div>`
    : ''
  const skillBtn = (sk: { name: string; fx: string; kind: string; unlockAt: number; desc: string; awakenAt?: number; cond?: SkillCond; target?: SkillTarget }) => {
    // 觉醒技也用 unlockAt=0，靠 awakenAt 区分，必须先判觉醒再判神技
    const isAwaken = !!sk.awakenAt
    const isGod = sk.unlockAt <= 0 && !isAwaken
    const open = isAwaken
      ? owned.awaken >= (sk.awakenAt ?? 1)
      : isGod
        ? !!owned.divine
        : owned.breakthrough >= Math.max(0, sk.unlockAt - 1)
    const mark = sk.kind === 'passive' ? '被动' : '主动'
    const lock = open
      ? ''
      : isAwaken
        ? `需觉醒 ${sk.awakenAt} 星`
        : isGod
          ? '神将专属，神合后领悟'
          : '突破不足，尚未解锁'
    // 条件与目标提示拼接到描述
    const extra: string[] = []
    if (sk.cond) extra.push(COND_LABEL[sk.cond] ?? '')
    if (sk.target) extra.push(TARGET_LABEL[sk.target] ?? '')
    const desc = extra.filter(Boolean).length ? `${sk.desc}（${extra.filter(Boolean).join(' · ')}）` : sk.desc
    const badge = isGod ? '<i class="sk-god-mark">神</i>' : isAwaken ? `<i class="sk-awaken-mark">${sk.awakenAt}★</i>` : ''
    return `<button type="button" class="sk-med ${open ? 'open' : 'locked'}${isGod ? ' god' : ''}${isAwaken ? ' awaken' : ''} tag-${sk.fx}" aria-label="${escapeHtml(sk.name)}" data-sk-name="${escapeHtml(sk.name)}" data-sk-kind="${mark}" data-sk-desc="${escapeHtml(desc)}" data-sk-lock="${escapeHtml(lock)}">${skillIcon(sk.fx)}<em>${escapeHtml(sk.name)}</em>${badge}</button>`
  }
  const godSkill = divineSkill(h.id)
  const baseSkills = heroSkills(h.id)
  const awakenList = awakenSkills(h.id, owned.awaken)
  const allSkills = godSkill ? [...baseSkills, ...awakenList, godSkill] : [...baseSkills, ...awakenList]
  const stars = Array.from({ length: 5 }, (_, i) => `<i class="${i < owned.awaken ? 'on' : ''}">★</i>`).join('')
  const kind = h.role === 'mage' ? '法' : h.role === 'heal' ? '疗' : '物'
  const line = attackLine(h.id) === 'row' ? '横排' : attackLine(h.id) === 'col' ? '竖排' : '单体'
  const teamIds = new Set(
    store.save.team
      .map((uid) => (uid ? store.save.owned.find((o) => o.uid === uid)?.heroId : null))
      .filter((id): id is string => !!id),
  )
  const bondList = BONDS.filter((b) => b.heroes.includes(h.id))
  const bondsHtml = bondList.length
    ? bondList
        .map((b) => {
          const on = b.heroes.every((id) => teamIds.has(id))
          return `<li class="${on ? 'on' : ''}">${b.name}</li>`
        })
        .join('')
    : '<li class="none">暂无缘分</li>'
  const lvCost = owned.level >= levelCap(owned.breakthrough) ? '' : String(levelUpCost(owned.level))

  const partner = findDivinePartner(owned, store.save.owned)
  const maxed = isMaxedHero(owned)
  const divineState = owned.divine ? 'active' : partner ? 'ready' : maxed ? 'waiting' : 'locked'
  const divineHint = owned.divine
    ? godSkill
      ? `已晋升神将 · 神技「${godSkill.name}」`
      : '已晋升神将'
    : partner
      ? `消耗另一张同名 Lv.${partner.level} 武将，合成后等级归零重新历练`
      : maxed
        ? '需另一张同名满级满突破武将'
        : `满级 Lv.${levelCap(MAX_BREAKTHROUGH)} · 突破 +${MAX_BREAKTHROUGH} 解锁`

  return `
  <section class="hero-page dossier rarity-${h.rarity} faction-${h.faction} ${fx}${owned.divine ? ' divine' : ''}" style="--accent:${h.color}">
    <div class="cultivate-fx" aria-hidden="true">${fx ? `<em>${store.heroFx?.text ?? ''}</em>` : ''}</div>
    <div class="dossier-stage">
      <button type="button" class="dossier-back" data-nav="roster" aria-label="返回">${icon('back')}</button>
      <img class="dossier-fig" src="/sprites/${h.id}.webp" alt="" />
      ${GEAR_SLOTS.map((slot) => gearFloat(slot)).join('')}
      <div class="dossier-foot">
        <div class="star-row" aria-label="觉醒${owned.awaken}">${stars}</div>
        <div class="rank-plate">
          ${owned.divine ? '<span class="gd">神将</span>' : ''}
          <span class="lv">Lv.${owned.level}</span>
          <span class="bt">突破 +${owned.breakthrough}</span>
          <span class="aw">觉醒 ${owned.awaken}</span>
          <span class="sh">同名Lv1 ${fodders.length}</span>
        </div>
        <div class="foot-row">
          <div class="foot-mini">
            <button type="button" class="wood-act" data-breakthrough="${owned.uid}" aria-label="突破" title="突破：消耗 1 名 1 级同名武将 + 银两${bt}">突破<small>同名${fodders.length}/1</small></button>
            <button type="button" class="wood-act wake" data-awaken="${owned.uid}" aria-label="觉醒" title="觉醒：消耗 1 名 1 级同名武将 + 觉醒丹${aw.stones} + 银两${aw.gold}">觉醒<small>${owned.awaken}星</small></button>
          </div>
          <div class="foot-name">
            <div class="dossier-id">${owned.divine ? '<i class="god-tag">神</i>' : ''}<b>${h.name}</b></div>
            <div class="dossier-power">战力 <b>${st.power}</b></div>
          </div>
          <button type="button" class="seal-act" data-levelup="${owned.uid}" aria-label="升级">升级<small>${lvCost}</small></button>
          <button type="button" class="swap-act" data-cycle-hero aria-label="换将">换将</button>
        </div>
      </div>
    </div>
    <aside class="dossier-side">
      <div class="dossier-head">
        <i class="role-banner"><span>${kind}</span><span>${line}</span><span>${ROLE_LABEL[h.role]}</span></i>
        <div class="mini-hero">
          <img src="/sprites/${h.id}.webp" alt="" />
          <b class="faction-seal faction-${h.faction}">${FACTION_LABEL[h.faction]}</b>
        </div>
      </div>
      <div class="dossier-stats">
        <span>攻击 <b>${st.atk}</b></span>
        <span>生命 <b>${st.hp}</b></span>
        <span>防御 <b>${st.def}</b></span>
        <span>战力 <b>${st.power}</b></span>
        <span class="wide">1级同名 <b>${fodders.length}</b> · 突破/觉醒各需 1 名 + 银两${bt} · 等级上限 Lv.${levelCap(owned.breakthrough)}</span>
      </div>
      <button type="button" class="divine-act ${divineState}" ${divineState === 'ready' ? `data-divine="${owned.uid}"` : 'disabled'} aria-label="神合" title="${divineHint}">
        <i class="dv-mark">神</i>
        <span><b>${owned.divine ? '神将' : '神合'}</b><small>${divineHint}</small></span>
      </button>
      <div class="dossier-block">
        <em>技能</em>
        <div class="sk-row">${allSkills.map((sk) => skillBtn(sk)).join('')}</div>
      </div>
      <div class="dossier-block">
        <em>缘分</em>
        <ul class="bond-list">${bondsHtml}</ul>
      </div>
      <button type="button" class="side-scrap" data-decompose="${owned.uid}" data-soul="${soulFromHero(h.rarity, owned.shards)}" aria-label="分解" title="分解">${icon('soul')}<small>${soulFromHero(h.rarity, owned.shards)}</small></button>
    </aside>
    ${gearPop}
  </section>`
}

const BOND_MARK: Record<string, string> = {
  taoyuan: '桃园',
  wushuang: '无双',
  chibi: '赤壁',
  weiwu: '魏武',
  jiangdong: '江东',
}

function teamView(): string {
  const team = [...store.save.team]
  while (team.length < 6) team.push(null)
  const ids = team
    .map((uid) => store.save.owned.find((o) => o.uid === uid)?.heroId)
    .filter((id): id is string => !!id)
  const bonds = activeBonds(ids)
  const bondIds = new Set(bonds.map((b) => b.id))
  const auras = factionAuras(ids)
  // 每个武将激活的缘分数量
  const bondCountByHero = new Map<string, number>()
  for (const b of bonds) {
    for (const hid of b.heroes) bondCountByHero.set(hid, (bondCountByHero.get(hid) ?? 0) + 1)
  }
  const focusIndex = selectedSlot ?? team.findIndex((id) => !!id)
  const focusUid = focusIndex >= 0 ? team[focusIndex] : null
  const focusOwned = focusUid ? store.save.owned.find((o) => o.uid === focusUid) ?? null : null

  const slotHtml = (i: number) => {
    const uid = team[i]
    const isFront = i < 3
    const rank = isFront ? '前' : '后'
    const row = isFront ? 'front' : 'back'
    const col = i % 3
    const picking = selectedSlot === i || (selectedSlot === null && i === focusIndex && !!uid) ? ' picking' : ''
    if (!uid) {
      return `<button type="button" class="slot-v2 empty ${row} col-${col}${picking}" data-slot="${i}" aria-label="${rank}排空位">
        <span class="slot-v2-blank"><span class="slot-v2-plus">+</span></span>
        <i class="slot-v2-rank">${rank}</i>
      </button>`
    }
    const o = store.save.owned.find((x) => x.uid === uid)
    if (!o) {
      return `<button type="button" class="slot-v2 empty ${row} col-${col}${picking}" data-slot="${i}" aria-label="${rank}排空位">
        <span class="slot-v2-blank"><span class="slot-v2-plus">+</span></span>
        <i class="slot-v2-rank">${rank}</i>
      </button>`
    }
    const h = HERO_MAP[o.heroId]
    const bondN = bondCountByHero.get(h.id) ?? 0
    return `<div class="slot-v2 filled ${row} col-${col} rarity-${h.rarity} faction-${h.faction}${picking}" data-slot="${i}" data-clear="${uid}" role="button" aria-label="${h.name}">
      <span class="slot-v2-fig">
        <img class="slot-v2-sprite" src="/sprites/${h.id}.webp" alt="" />
        <span class="slot-v2-shadow"></span>
        <div class="slot-v2-tag">
          <b class="slot-v2-name">${h.name}</b>
          <i class="slot-v2-bond">缘分${bondN}</i>
        </div>
        <i class="slot-v2-x" data-slot-clear="${i}" aria-hidden="true">×</i>
      </span>
      <i class="slot-v2-rank">${rank}</i>
    </div>`
  }

  const base = FACTION_TIERS[0]
  const factionSeals = (['shu', 'wei', 'wu', 'qun'] as const)
    .map((faction) => {
      const aura = auras.find((a) => a.faction === faction)
      const count = aura?.count ?? 0
      const on = !!aura?.active
      const tip = aura
        ? `${FACTION_LABEL[faction]} ×${count}  ${aura.hint}`
        : `${FACTION_LABEL[faction]}  上阵${base.count}名激活 · 攻+${Math.round(base.atk * 100)}% 生命+${Math.round(base.hp * 100)}%`
      return `<button type="button" class="seal faction-${faction}${on ? ' on' : ''}" data-seal="${escapeHtml(tip)}">
        <span>${FACTION_LABEL[faction]}</span>${count ? `<i>${count}</i>` : ''}
      </button>`
    })
    .join('')
  const focusBondId = focusOwned?.heroId
  const bondSeals = BONDS.filter((b) => (focusBondId ? b.heroes.includes(focusBondId) : bondIds.has(b.id))).map((b) => {
    const on = bondIds.has(b.id)
    const gain = `攻击+${Math.round(b.bonusAtk * 100)}% 生命+${Math.round(b.bonusHp * 100)}%`
    const tip = on ? `${b.name}  ${gain}` : `${b.name}  ${b.desc}  ${gain}`
    return `<button type="button" class="seal bond${on ? ' on' : ''}" data-seal="${escapeHtml(tip)}"><span>${BOND_MARK[b.id] ?? b.name.slice(0, 2)}</span></button>`
  }).join('')
  const bench = [...store.save.owned].sort((a, b) => {
    const ha = HERO_MAP[a.heroId]
    const hb = HERO_MAP[b.heroId]
    const byRarity = (RARITY_RANK[hb.rarity] ?? 0) - (RARITY_RANK[ha.rarity] ?? 0)
    if (byRarity) return byRarity
    return calcStats(b, store.save.equips).power - calcStats(a, store.save.equips).power
  })
  const focusHero = focusOwned ? HERO_MAP[focusOwned.heroId] : null
  const focusStats = focusOwned ? calcStats(focusOwned, store.save.equips) : null
  const gearTile = (slot: EquipSlot) => {
    if (!focusOwned) return `<div class="gear-tile empty" aria-label="${SLOT_LABEL[slot]}">${equipArt(slot, 'R', true)}</div>`
    const uid = focusOwned.gear[slot]
    const eq = uid ? store.save.equips.find((e) => e.uid === uid) : null
    const def = eq ? EQUIP_MAP[eq.equipId] : null
    const tip = def ? `${def.name} +${eq?.level ?? 1} 锻${eq?.forge ?? 0} ${statLine(def, eq?.level ?? 1, eq?.forge ?? 0)}` : SLOT_LABEL[slot]
    return `<button type="button" class="gear-tile ${def ? 'filled' : 'empty'}" ${uid ? `data-unequip="${focusOwned.uid}:${slot}"` : ''} aria-label="${def ? def.name : SLOT_LABEL[slot]}" title="${tip}">${equipArt(slot, def?.rarity ?? 'R', !def, def?.id)}${eq ? `<small>+${eq.level}</small>` : ''}</button>`
  }

  return `
  <section class="panel form-panel-v2">
    <div class="form-v2-tabs" role="tablist">
      <button type="button" class="on" role="tab" aria-selected="true">援 军</button>
      <button type="button" role="tab" aria-selected="false" disabled title="敬请期待">助 阵</button>
    </div>

    <div class="form-v2-stage" aria-label="布阵舞台">
      <div class="stage-platform" aria-hidden="true"></div>
      ${[0, 1, 2, 3, 4, 5].map(slotHtml).join('')}
      <div class="stage-total">已激活缘分总数: <b>${bonds.length}</b></div>
    </div>

    <aside class="form-v2-side">
      <div class="form-v2-power"><span>战力</span><b>${store.power()}</b></div>
      ${
        focusHero && focusOwned && focusStats
          ? `<div class="form-v2-focus">
               <div class="fv2-head">
                 <b>${focusHero.name}</b>
                 <small>Lv.${focusOwned.level} · ${focusHero.title}</small>
               </div>
               <div class="fv2-stats">
                 <span>${icon('atk')}${focusStats.atk}</span>
                 <span>${icon('hp')}${focusStats.hp}</span>
                 <span>${icon('def')}${focusStats.def}</span>
               </div>
               <div class="form-gear fv2-gear">${GEAR_SLOTS.map((slot) => gearTile(slot)).join('')}</div>
             </div>`
          : `<p class="fv2-hint">点选阵位查看详情<br/>拖拽可换位</p>`
      }
      <div class="seal-bar fv2-seals">
        <div class="seals">${factionSeals}</div>
        <div class="seals">${bondSeals}</div>
        <p class="seal-tip"></p>
      </div>
      <button class="btn btn-gold" type="button" data-action="auto-form">一键布阵</button>
      ${store.pending ? '<button class="btn" type="button" data-nav="prep">返回备战</button>' : ''}
    </aside>
  </section>

  <section class="panel form-v2-bench">
    <h3>援军武将</h3>
    <div class="pick-filters fv2-filters">
      ${pickChips('faction', [
        ['all', '全'],
        ['shu', '蜀'],
        ['wei', '魏'],
        ['wu', '吴'],
        ['qun', '群'],
      ])}
      ${pickChips('role', [
        ['all', '全'],
        ['tank', '坦克'],
        ['warrior', '战士'],
        ['dps', '输出'],
        ['mage', '谋士'],
        ['heal', '治疗'],
      ])}
      ${pickChips('rarity', [
        ['all', '全'],
        ['SSR', 'SSR'],
        ['SR', 'SR'],
        ['R', 'R'],
      ])}
    </div>
    <div class="bench-strip">
      ${bench
        .map((o) => heroCardHtml(o, { pick: true, compact: true, selected: team.includes(o.uid), hidden: !matchesPick(HERO_MAP[o.heroId]) }))
        .join('')}
    </div>
    <p class="pick-empty muted"${bench.some((o) => matchesPick(HERO_MAP[o.heroId])) ? ' hidden' : ''}>没有符合的武将</p>
  </section>`
}

function pickChips(key: 'faction' | 'role' | 'rarity', items: [string, string][]): string {
  const mark = key === 'faction' ? '阵' : key === 'role' ? '职' : '稀'
  return `<div class="pick-row"><em>${mark}</em>${items
    .map(([value, label]) => {
      const on = pickFilter[key] === value ? ' on' : ''
      return `<button type="button" class="pick-chip${on}" data-pick-filter="${key}" data-value="${value}">${label}</button>`
    })
    .join('')}</div>`
}

function matchesFilter(
  filter: { faction: string; role: string; rarity: string },
  h: { faction: string; role: string; rarity: string },
): boolean {
  if (filter.faction !== 'all' && h.faction !== filter.faction) return false
  if (filter.role !== 'all' && h.role !== filter.role) return false
  if (filter.rarity !== 'all' && h.rarity !== filter.rarity) return false
  return true
}

function filterRows(filter: { faction: string; role: string; rarity: string }, attr: string): string {
  const row = (key: 'faction' | 'role' | 'rarity', mark: string, items: [string, string, string?][]) =>
    `<div class="pick-row"><em>${mark}</em>${items
      .map(([value, label, name]) => {
        const on = filter[key] === value ? ' on' : ''
        return `<button type="button" class="pick-chip${on}" ${attr}="${key}" data-value="${value}" aria-label="${name ?? label}">${label}</button>`
      })
      .join('')}</div>`
  return `<div class="pick-filters">${row('faction', '阵', [
    ['all', '全'],
    ['shu', '蜀'],
    ['wei', '魏'],
    ['wu', '吴'],
    ['qun', '群'],
  ])}${row('role', icon('sword'), [
    ['all', '全', '全部'],
    ['tank', icon('armor'), '坦克'],
    ['warrior', icon('sword'), '战士'],
    ['dps', icon('atk'), '输出'],
    ['mage', icon('burst'), '谋士'],
    ['heal', icon('hp'), '治疗'],
  ])}${row('rarity', icon('gacha'), [
    ['all', '全'],
    ['SSR', 'SSR'],
    ['SR', 'SR'],
    ['R', 'R'],
  ])}</div>`
}

function matchesPick(h: { faction: string; role: string; rarity: string }): boolean {
  return matchesFilter(pickFilter, h)
}

function equipView(): string {
  const tabs: ['all' | 'exclusive' | EquipSlot, string][] = [
    ['all', '全部'],
    ['weapon', '武器'],
    ['helm', '头盔'],
    ['armor', '铠甲'],
    ['boots', '靴子'],
    ['accessory', '饰品'],
    ['treasure', '宝物'],
    ['exclusive', '专属'],
  ]
  const visible = sortEquips(
    store.save.equips.filter((eq) => {
      const def = EQUIP_MAP[eq.equipId]
      if (!def) return false
      if (equipSlot === 'exclusive') return !!def.exclusive
      if (equipSlot === 'all') return true
      return def.slot === equipSlot
    }),
  )
  const opened = openEquipUid ? store.save.equips.find((eq) => eq.uid === openEquipUid) : null
  const openDef = opened ? EQUIP_MAP[opened.equipId] : null
  const detail = opened && openDef ? equipDetail(opened, openDef) : ''
  const cards = visible
    .map((eq) => {
      const def = EQUIP_MAP[eq.equipId]
      if (!def) return ''
      const forge = eq.forge ?? 0
      const worn = store.save.owned.find((o) => Object.values(o.gear).includes(eq.uid))
      const who = worn ? HERO_MAP[worn.heroId]?.name : ''
      return `<button type="button" class="armory-card rarity-${def.rarity}${def.exclusive ? ' exclusive' : ''}" data-equip-open="${eq.uid}" aria-label="${def.name}">
        <div class="armory-art">
          <i>${GEAR_QUALITY[def.rarity] ?? def.rarity}</i>
          ${def.exclusive ? '<b>专属</b>' : ''}
          ${equipArt(def.slot, def.rarity, false, def.id)}
        </div>
        <div class="armory-copy">
          <strong>${def.name}</strong>
          <em>+${eq.level}/${equipLevelCap(forge)} · 锻${forge}${who ? ` · ${who}` : ''}</em>
          <span>${statLine(def, eq.level, forge)}</span>
        </div>
      </button>`
    })
    .join('')
  return `
  <section class="armory">
    <div class="armory-head">
      <h3>${icon('equip')}兵器库</h3>
      <p>点开装备再升级、锻造。每锻造一阶，等级上限 +10，满锻 ${SMITH_CAP} 阶至 +${equipLevelCap(SMITH_CAP)}。穿戴时选中武将。</p>
      <button type="button" class="btn btn-primary" data-nav="equipGacha">${icon('chest')}铸宝<small>${store.save.equipTickets ?? 0}</small></button>
    </div>
    <div class="armory-tabs">
      ${tabs.map(([id, label]) => `<button type="button" class="${equipSlot === id ? 'on' : ''}" data-equip-slot="${id}">${label}</button>`).join('')}
    </div>
    <div class="armory-grid">${cards || '<p class="armory-empty">这个格子还是空的。</p>'}</div>
    ${detail}
  </section>`
}

function equipDetail(
  eq: { uid: string; equipId: string; level: number; forge?: number },
  def: { id: string; name: string; rarity: string; slot: EquipSlot; atk: number; hp: number; def: number; exclusive?: { heroId: string; atk: number; hp: number; def: number } },
): string {
  const forge = eq.forge ?? 0
  const cap = equipLevelCap(forge)
  const atCap = eq.level >= cap
  const forgeFull = forge >= SMITH_CAP
  const up = upgradeCost(eq.level)
  const smith = smithCost(forge)
  const wearer = store.save.owned.find((o) => Object.values(o.gear).includes(eq.uid))
  const who = wearer ? HERO_MAP[wearer.heroId]?.name ?? '' : ''
  const ex = exclusiveText(def, eq.level, forge)
  const team = new Set(store.save.team.filter((id): id is string => !!id))
  const heroes = [
    ...store.save.owned.filter((o) => team.has(o.uid)),
    ...store.save.owned.filter((o) => !team.has(o.uid)),
  ]
  const faces = heroes
    .map((o) => {
      const h = HERO_MAP[o.heroId]
      if (!h) return ''
      const on = wearer?.uid === o.uid
      const busy = o.gear[def.slot]
      const busyDef = busy && busy !== eq.uid ? EQUIP_MAP[store.save.equips.find((e) => e.uid === busy)?.equipId ?? ''] : null
      return `<button type="button" class="wear-face${on ? ' on' : ''}" data-give="${o.uid}" data-piece="${eq.uid}" aria-label="${h.name}">
        <img src="/sprites/${h.id}.webp" alt="" />
        <b>${h.name}</b>
        <small>${on ? '已穿' : busyDef ? '替换' : '穿上'}</small>
      </button>`
    })
    .join('')
  return `<div class="armory-modal" data-equip-close>
    <div class="armory-modal-card rarity-${def.rarity}" onclick="event.stopPropagation()">
      <button type="button" class="armory-modal-close" data-equip-close aria-label="关闭">×</button>
      <div class="armory-modal-art">
        <i>${GEAR_QUALITY[def.rarity] ?? def.rarity}</i>
        ${def.exclusive ? '<b>专属</b>' : ''}
        ${equipArt(def.slot, def.rarity, false, def.id)}
      </div>
      <div class="armory-modal-side">
        <strong>${def.name}</strong>
        <em>${SLOT_LABEL[def.slot]} · +${eq.level}/${cap} · 锻${forge}${forgeFull ? ' 已满' : ''}</em>
        <span>${statLine(def, eq.level, forge)}</span>
        ${ex ? `<span class="ex">${ex}</span>` : ''}
        <span class="wear-now">${who ? `现在穿在${who}身上` : '还没有人穿'}</span>
        <div class="armory-acts detail-acts">
          <button type="button" data-upgrade="${eq.uid}" aria-label="升级" ${atCap ? 'disabled' : ''}>升级<small>${atCap ? (forgeFull ? '已满' : '先锻造') : `银${up.gold} 铁${up.iron}`}</small></button>
          <button type="button" data-smith="${eq.uid}" aria-label="锻造" ${forgeFull || !atCap ? 'disabled' : ''}>锻造<small>${forgeFull ? '已满' : !atCap ? `先到+${cap}` : `银${smith.gold} 石${smith.stones} 铁${smith.iron}`}</small></button>
          ${wearer ? `<button type="button" data-unequip="${wearer.uid}:${def.slot}" aria-label="卸下">卸下</button>` : ''}
        </div>
        <p class="wear-lab">穿到身上</p>
        <div class="wear-row">${faces}</div>
      </div>
    </div>
  </div>`
}

function equipGachaView(): string {
  const tickets = store.save.equipTickets ?? 0
  const left = Math.max(1, 10 - (store.save.equipPity ?? 0))
  const cards = store.lastEquipPulls
    .map((item) => {
      const def = EQUIP_MAP[item.id]
      if (!def) return ''
      return `<article class="armory-card rarity-${def.rarity}${def.exclusive ? ' exclusive' : ''}">
        <div class="armory-art"><i>${GEAR_QUALITY[def.rarity] ?? def.rarity}</i>${equipArt(def.slot, def.rarity, false, def.id)}</div>
        <div class="armory-copy"><strong>${def.name}</strong><em>${SLOT_LABEL[def.slot]}</em><span>${statLine(def, 1)}</span></div>
      </article>`
    })
    .join('')
  return `
  <section class="panel forge-hall">
    <div class="equip-head">
      <button type="button" class="btn" data-nav="equip">${icon('back')}返回</button>
      <h3>${icon('chest')}铸宝</h3>
      <span class="res" title="铸令"><i>${icon('chest')}</i><b>${tickets}</b></span>
    </div>
    <p class="forge-note">消耗铸令，不花阵营印。十连 9 枚。${left} 次内必出良品或极品。回来后可以升级、锻造。</p>
    <div class="login-actions">
      <button type="button" class="btn btn-primary" data-equip-pull="1" ${tickets < 1 ? 'disabled' : ''}>铸一次<small>1</small></button>
      <button type="button" class="btn btn-primary" data-equip-pull="10" ${tickets < 9 ? 'disabled' : ''}>铸十次<small>9</small></button>
    </div>
    <div class="armory-grid">${cards || '<p class="forge-note">炉子还是冷的。</p>'}</div>
  </section>`
}

function campaignView(): string {
  const diff = store.difficulty
  const cleared = store.progressFor(diff)
  const autoBtn = `<button type="button" class="btn ${store.autoPushing ? 'btn-primary' : 'btn-gold'} auto-push" data-auto-push>${store.autoPushing ? '停止推图' : '自动推图'}</button>`
  // 难度选择器：普通 / 困难 / 英雄 / 史诗
  const diffPicker = `<div class="diff-picker" role="group" aria-label="难度选择">
    ${DIFFICULTY_ORDER.map((d) => {
      const meta = DIFFICULTIES[d]
      const prev = prevDifficulty(d)
      const locked = !!prev && store.progressFor(prev) < 1
      const tip = locked
        ? `${meta.hint} · 需先通关「${DIFFICULTIES[prev!].name}」第 1 关`
        : `${meta.hint} · 已通关 ${store.progressFor(d)} 关`
      return `<button type="button" class="diff-chip${d === diff ? ' on' : ''}${locked ? ' locked' : ''}" data-diff="${d}" style="--diff-color:${meta.color}" title="${tip}" ${locked ? 'disabled' : ''}>${meta.name}</button>`
    }).join('')}
  </div>`
  // 推图速度选择器：1x 2x 4x 8x
  const pushSpeed = store.pushSpeed()
  const speedPicker = `<div class="speed-picker" data-push-speed role="group" aria-label="推图速度">
    <em>推图</em>
    ${[1, 2, 4, 8]
      .map(
        (n) =>
          `<button type="button" data-push-speed-value="${n}" class="${n === pushSpeed ? 'on' : ''}" aria-label="${n}倍速">${n}x</button>`,
      )
      .join('')}
  </div>`
  if (mapChapter == null) {
    const points = CHAPTERS.map((c) => `${c.x},${c.y}`).join(' ')
    const nextId = Math.min(STAGES.length, cleared + 1)
    const next = STAGES.find((st) => st.id === nextId)
    const cur = CHAPTERS.find((c) => c.id === (next?.chapter ?? CHAPTERS.length)) ?? CHAPTERS[CHAPTERS.length - 1]
    const prev = CHAPTERS.find((c) => c.id === cur.id - 1) ?? cur
    return `
    <section class="war-map">
      <div class="war-head"><b>征战</b><small>${cleared}/${STAGES.length}</small>${diffPicker}${speedPicker}${autoBtn}</div>
      <div class="war-board">
        <svg class="war-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="${points}" />
        </svg>
        ${CHAPTERS.map((c) => {
          const open = cleared >= (c.id - 1) * CHAPTER_SIZE
          const done = cleared >= c.id * CHAPTER_SIZE
          const progress = Math.max(0, Math.min(CHAPTER_SIZE, cleared - (c.id - 1) * CHAPTER_SIZE))
          const state = !open ? 'locked' : done ? 'done' : 'now'
          return `<button type="button" class="city-node ${state}" style="left:${c.x}%;top:${c.y}%" data-open-chapter="${c.id}" ${open ? '' : 'disabled'}>
            ${castleSvg(state)}
            <b>${c.city}</b>
            <small>${open ? `${progress}/${CHAPTER_SIZE}` : ''}</small>
          </button>`
        }).join('')}
        ${walkerHtml(prev, cur)}
      </div>
    </section>`
  }
  const chapter = CHAPTERS.find((c) => c.id === mapChapter) ?? CHAPTERS[0]
  const stages = STAGES.filter((st) => st.chapter === chapter.id)
  // 10 关蛇形路线：下排 1–5 向右，上排 6–10 向左，章末 Boss 在左上
  const yard = [
    { x: 12, y: 74 },
    { x: 31, y: 78 },
    { x: 50, y: 72 },
    { x: 69, y: 78 },
    { x: 87, y: 72 },
    { x: 87, y: 32 },
    { x: 69, y: 26 },
    { x: 50, y: 32 },
    { x: 31, y: 26 },
    { x: 13, y: 32 },
  ]
  const curIndex = stages.findIndex((st) => st.id === cleared + 1)
  const stand = curIndex < 0 ? stages.length - 1 : curIndex
  const from = yard[Math.max(0, stand - (curIndex < 0 ? 0 : 1))]
  const to = yard[stand]
  const path = yard.map((p) => `${p.x},${p.y}`).join(' ')
  return `
  <section class="chapter-page">
    <div class="chapter-head">
      <button type="button" class="btn" data-map-back>地图</button>
      <div><b>${chapter.city}</b><small>${chapter.name}</small></div>
      ${diffPicker}
      ${speedPicker}
      ${autoBtn}
    </div>
    <div class="city-yard">
      <svg class="yard-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${path}" /></svg>
      ${stages
        .map((st, i) => {
          const locked = st.id > cleared + 1
          const done = st.id <= cleared
          const current = st.id === cleared + 1
          const lead = st.enemies.find((e) => e.slot === 1) ?? st.enemies[0]
          const hero = lead ? HERO_MAP[lead.heroId] : null
          const pos = yard[i] ?? yard[0]
          const reason = locked ? store.unlockReason(st.id, diff) : ''
          const tip = reason || (done ? '已通关' : current ? '当前关卡' : '未解锁')
          return `<button type="button" class="yard-hero ${st.boss ? 'boss' : ''} ${done ? 'done' : ''} ${current ? 'now' : ''} ${locked ? 'locked' : ''}" style="left:${pos.x}%;top:${pos.y}%" data-challenge="${st.id}" title="${tip}" ${locked ? 'disabled' : ''}>
            ${st.boss ? '<i class="boss-tag">BOSS</i>' : ''}
            ${hero ? `<img src="/sprites/${hero.id}.webp" alt="" draggable="false" />` : ''}
            <b>${st.name}</b>
          </button>`
        })
        .join('')}
      ${walkerHtml(from, to, true)}
    </div>
  </section>`
}

/** 大地图上的城池：城墙 + 双箭楼 + 主城楼 + 旗帜，按状态着色 */
function castleSvg(state: 'locked' | 'now' | 'done'): string {
  const wall = state === 'done' ? '#7fa06a' : state === 'now' ? '#e0b96a' : '#8a7a62'
  const wallDark = state === 'done' ? '#4a6b3c' : state === 'now' ? '#8a5f22' : '#575043'
  const roof = state === 'done' ? '#3c5a34' : state === 'now' ? '#a03c2a' : '#4a4238'
  const flag = state === 'now' ? '#e84c3d' : state === 'done' ? '#7fbf5a' : '#6b6154'
  return `<svg class="castle-art ${state}" viewBox="0 0 64 52" aria-hidden="true">
    <rect x="7" y="30" width="50" height="16" fill="${wall}" stroke="${wallDark}" stroke-width="1.4"/>
    <path d="M7 30h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-4h4v4h6v-4h4v4h4" fill="${wall}" stroke="${wallDark}" stroke-width="1.4"/>
    <rect x="3" y="22" width="10" height="24" rx="1" fill="${wall}" stroke="${wallDark}" stroke-width="1.4"/>
    <path d="M1 23 L8 15 L15 23 Z" fill="${roof}" stroke="${wallDark}" stroke-width="1.2"/>
    <rect x="51" y="22" width="10" height="24" rx="1" fill="${wall}" stroke="${wallDark}" stroke-width="1.4"/>
    <path d="M49 23 L56 15 L63 23 Z" fill="${roof}" stroke="${wallDark}" stroke-width="1.2"/>
    <rect x="24" y="16" width="16" height="16" rx="1" fill="${wall}" stroke="${wallDark}" stroke-width="1.4"/>
    <path d="M21 17 L32 7 L43 17 Z" fill="${roof}" stroke="${wallDark}" stroke-width="1.2"/>
    <line x1="32" y1="7" x2="32" y2="1" stroke="${wallDark}" stroke-width="1.4"/>
    <path class="castle-flag" d="M32 1 h11 l-3 3.5 3 3.5 h-11 z" fill="${flag}"/>
    <path d="M27 46 v-5 a5 5 0 0 1 10 0 v5 z" fill="${wallDark}"/>
    <rect x="6.2" y="25" width="3.4" height="5" rx="1.4" fill="${wallDark}"/>
    <rect x="54.4" y="25" width="3.4" height="5" rx="1.4" fill="${wallDark}"/>
    <rect x="29.5" y="19" width="5" height="6" rx="1.4" fill="${wallDark}"/>
  </svg>`
}

function walkerHtml(from: { x: number; y: number }, to: { x: number; y: number }, inside = false): string {
  const leadUid = store.save.team.find((id): id is string => !!id)
  const owned = (leadUid ? store.save.owned.find((o) => o.uid === leadUid) : null) ?? store.save.owned[0]
  const hero = owned ? HERO_MAP[owned.heroId] : null
  const flip = to.x < from.x ? ' flip' : ''
  const src = hero ? `/sprites/${hero.id}.webp` : ''
  return `<div class="map-walker${inside ? ' inside' : ''}${flip}" style="--from-x:${from.x}%;--from-y:${from.y}%;--to-x:${to.x}%;--to-y:${to.y}%">${src ? `<img src="${src}" alt="" draggable="false" />` : ''}</div>`
}

function arenaView(): string {
  const s = store.save
  return `
  <section class="panel">
    <h3>竞技场</h3>
    <div class="stats-grid">
      <div class="stat"><div class="label">积分</div><div class="value">${s.arenaPoints}</div></div>
      <div class="stat"><div class="label">挑战次数</div><div class="value">${s.arenaTickets}</div></div>
      <div class="stat"><div class="label">胜/负</div><div class="value">${s.arenaWins}/${s.arenaLosses}</div></div>
    </div>
    <div class="cta-row" style="margin-top:12px">
      <button class="btn" data-action="refresh-arena">刷新对手</button>
    </div>
    <div class="arena-grid">
      ${store.arenaList
        .map(
          (b) => `<article class="arena-card">
          <div class="arena-faces">${b.heroes
            .map((h) => portraitHtml(HERO_MAP[h.heroId], 42))
            .join('')}</div>
          <b>${b.power}</b>
          <button class="btn btn-primary" data-arena="${b.id}">挑战</button>
        </article>`,
        )
        .join('')}
    </div>
  </section>`
}

function prepView(): string {
  const pending = store.pending
  if (!pending) return `<section class="panel"><p>没有待开始的战斗</p></section>`
  const diff: Difficulty = pending.kind === 'stage' ? pending.diff : 'normal'
  const stage = pending.kind === 'stage' ? stageFor(pending.stageId, pending.diff) : null
  const bot = pending.kind === 'arena' ? store.arenaList.find((b) => b.id === pending.botId) : null
  const title = stage?.name ?? (bot ? bot.name : '备战')
  const diffMeta = DIFFICULTIES[diff]
  const diffTag =
    pending.kind === 'stage' && diff !== 'normal'
      ? `<span class="prep-diff" style="--diff-color:${diffMeta.color}">${diffMeta.name}</span>`
      : ''
  const rawFoes: { heroId: string; level: number; slot: number; breakthrough?: number }[] = stage
    ? stage.enemies
    : (bot?.heroes ?? []).map((h, i) => ({
        heroId: h.heroId,
        level: h.level,
        slot: squadSlots(bot?.heroes.length ?? 0)[i] ?? i,
        breakthrough: h.breakthrough,
      }))
  const foes = rawFoes.map((e) => {
    const hero = HERO_MAP[e.heroId]
    const bt = e.breakthrough ?? enemyBreakthrough(e.level)
    const power = calcStats({
      uid: 'foe',
      heroId: e.heroId,
      level: e.level,
      shards: 0,
      breakthrough: bt,
      awaken: 0,
      exp: 0,
      gear: {},
    }).power
    const mult = stage ? (stage.enemies.find((x) => x.heroId === e.heroId)?.mult ?? 1) : 1
    return {
      slot: e.slot,
      name: hero?.name ?? '敌军',
      level: e.level,
      power: Math.round(power * mult),
      sprite: hero ? battleSprite(hero) : '',
      line: hero ? attackLine(hero.id) : null,
    }
  })
  const team = [...store.save.team]
  while (team.length < 6) team.push(null)
  const allies = team.map((uid, slot) => {
    const owned = uid ? store.save.owned.find((o) => o.uid === uid) : null
    const hero = owned ? HERO_MAP[owned.heroId] : null
    if (!owned || !hero) return { slot, name: '', level: 0, power: 0, sprite: '', line: null as 'row' | 'col' | null }
    return {
      slot,
      name: hero.name,
      level: owned.level,
      power: calcStats(owned, store.save.equips).power,
      sprite: battleSprite(hero),
      line: attackLine(hero.id),
    }
  })
  const foePower = foes.reduce((sum, u) => sum + u.power, 0)
  const allyPower = allies.reduce((sum, u) => sum + u.power, 0)
  const cell = (u: { name: string; level: number; sprite: string; line?: 'row' | 'col' | null } | undefined) =>
    u?.sprite
      ? `<div class="prep-cell filled">${u.sprite}<b>${u.name}</b><small>Lv.${u.level}</small>${u.line ? `<i class="line-mark">${u.line === 'row' ? '横' : '竖'}</i>` : ''}</div>`
      : `<div class="prep-cell empty"></div>`
  const grid = (units: { slot: number; name: string; level: number; sprite: string; line?: 'row' | 'col' | null }[], order: number[]) => {
    const bySlot = new Map(units.filter((u) => u.sprite).map((u) => [u.slot, u]))
    return order.map((slot) => cell(bySlot.get(slot))).join('')
  }
  return `
  <section class="prep-screen">
    <div class="form-head">
      <button class="btn" data-nav="${pending.kind === 'arena' ? 'arena' : 'campaign'}">返回</button>
      <h3>${title}${diffTag}</h3>
    </div>
    <div class="prep-field">
      <div class="prep-camp ally">
        <div class="prep-camp-label"><b>我军</b><small>${allies.filter((u) => u.sprite).length}人 · 战力 ${allyPower}</small></div>
        <div class="prep-grid">${grid(allies, [3, 0, 4, 1, 5, 2])}</div>
      </div>
      <div class="prep-camp enemy">
        <div class="prep-camp-label"><b>敌军</b><small>${stage && stage.waves.length > 1 ? `${stage.waves.length}波 · 末阵 ` : ''}${foes.length}人 · 战力 ${foePower}</small></div>
        <div class="prep-grid">${grid(foes, [0, 3, 1, 4, 2, 5])}</div>
      </div>
    </div>
    <div class="cta-row prep-cta">
      <button class="btn" type="button" data-nav="team">布阵</button>
      <button class="btn btn-gold" type="button" data-action="launch-battle">开战</button>
    </div>
  </section>`
}

function battleView(): string {
  const b = store.lastBattle
  if (!b) return `<section class="panel"><p>暂无战报</p></section>`
  const auto = store.battleMode === 'stage' && store.autoPushing
  // 自动推图用推图速度，手动战斗用战斗速度
  const speed = auto ? store.pushSpeed() : store.battleSpeed()
  // 回放已播完：直接渲染终态，避免重绘把战场清空
  const done = playedBattle === b && battleFinished
  const board = done ? battleBoardHtml(b) : null
  const report = done ? battleReportHtml(b) : ''
  return `
  <section class="battle-wrap">
    <div class="battle-head">
      <button class="btn" data-nav="${store.battleMode === 'arena' ? 'arena' : 'campaign'}">返回</button>
      <h3>${done ? `${b.win ? '大获全胜' : '惜败'} · ${b.rounds} 回合` : '交战中'}</h3>
      ${auto ? '<button class="btn btn-primary" type="button" data-auto-push>停止推图</button>' : ''}
      <div class="speed-picker" id="battle-speed" role="group" aria-label="播放速度">
        <em>速度</em>
        ${[1, 2, 4, 8]
          .map(
            (n) =>
              `<button type="button" data-speed="${n}" class="${n === speed ? 'on' : ''}" aria-label="${n}倍速">${n}x</button>`,
          )
          .join('')}
      </div>
    </div>
    <div class="battle-ticker"><div class="battle-log" id="battle-feed"></div></div>
    <div id="battle-stage" class="fight-stage">
      <div class="fight-sky"></div>
      <div class="fight-ground"></div>
      <div id="fight-field" class="fight-boards">
        <div class="camp-block enemy">
          <b class="board-label">敌军</b>
          <div class="board enemy" id="board-enemy">${board ? board.enemies : '<i class="cell"></i>'.repeat(6)}</div>
        </div>
        <div class="camp-block ally">
          <b class="board-label">我军</b>
          <div class="board ally" id="board-ally">${board ? board.allies : '<i class="cell"></i>'.repeat(6)}</div>
        </div>
      </div>
      <div class="clash-fx" id="clash-fx"></div>
      <div class="skill-fx" id="skill-fx"></div>
    </div>
    <div id="battle-report" class="battle-report" ${done ? '' : 'hidden'}>${report}</div>
  </section>`
}

function heroCardHtml(
  owned: OwnedHero,
  opts: { open?: boolean; pick?: boolean; scrap?: boolean; selected?: boolean; showNew?: boolean; compact?: boolean; hidden?: boolean; deployed?: boolean } = {},
): string {
  const h = HERO_MAP[owned.heroId]
  const st = calcStats(owned, store.save.equips)
  const partner = findDivinePartner(owned, store.save.owned)
  const cls = ['hero-card', opts.open || opts.pick || opts.scrap ? 'clickable' : '', opts.selected ? 'selected' : '', opts.compact ? 'pick-card' : '', owned.divine ? 'divine' : '']
    .filter(Boolean)
    .join(' ')
  const action = opts.open ? `data-open="${owned.uid}"` : opts.pick ? `data-pick="${owned.uid}"` : opts.scrap ? `data-scrap-pick="${owned.uid}"` : ''
  return `
  <article class="${cls} card-frame rarity-${h.rarity} faction-${h.faction}" style="--accent:${h.color}" data-faction="${h.faction}" data-role="${h.role}" data-rarity="${h.rarity}" ${action}${opts.hidden ? ' hidden' : ''}>
    <span class="faction-chip faction-${h.faction}">${FACTION_LABEL[h.faction]}</span>
    ${rarityTagHtml(h.rarity)}
    ${opts.showNew ? '<span class="badge new">NEW</span>' : ''}
    ${opts.scrap ? `<span class="scrap-check">${opts.selected ? '✓' : ''}</span>` : ''}
    <div class="art">${portraitHtml(h, opts.compact ? 72 : 112)}<span class="card-lv">Lv.${owned.level}</span>${owned.divine ? '<span class="god-seal">神</span>' : partner ? '<span class="dv-ready">神合</span>' : ''}</div>
    <div class="meta">
      <div class="name">${opts.deployed ? '<i class="team-pin">阵</i>' : ''}${h.name}</div>
      ${opts.compact ? '' : rarityStarsHtml(h.rarity)}
      ${
        opts.scrap
          ? `<div class="sub scrap-soul">${icon('soul')}+${soulFromHero(h.rarity, owned.shards)}</div>`
          : opts.compact
            ? `<div class="sub">战力 ${st.power}</div>`
            : `<div class="sub">${ROLE_LABEL[h.role]} · 突破+${owned.breakthrough} · 觉醒${owned.awaken}</div><div class="sub">战力 ${st.power}</div>`
      }
    </div>
  </article>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

/** 战斗回放期间的轻量更新：提示条 + 推图状态按钮，避免整页重建 */
function updateBattleLive(root: HTMLElement): void {
  const cur = root.querySelector('.toast')
  if (!store.toast) {
    cur?.remove()
  } else if (cur) {
    cur.textContent = store.toast
  } else {
    const el = document.createElement('div')
    el.className = 'toast'
    el.textContent = store.toast
    root.querySelector('.shell')?.prepend(el)
  }
  // 提示条定时器在轻量分支里也要装配，否则回放期间 toast 不会消失
  if (store.toast) {
    window.clearTimeout(toastTimer)
    toastTimer = window.setTimeout(() => {
      store.clearToast()
      root.querySelector('.toast')?.remove()
    }, 2200)
  }
  // 推图状态变化时同步「停止推图」按钮
  const head = root.querySelector('.battle-head')
  if (!head) return
  const auto = store.battleMode === 'stage' && store.autoPushing
  const stopBtn = head.querySelector<HTMLElement>('[data-auto-push]')
  if (auto && !stopBtn) {
    const btn = document.createElement('button')
    btn.className = 'btn btn-primary'
    btn.type = 'button'
    btn.dataset.autoPush = ''
    btn.textContent = '停止推图'
    btn.addEventListener('click', () => store.toggleAutoPush())
    head.insertBefore(btn, head.querySelector('#battle-speed'))
  } else if (!auto && stopBtn) {
    stopBtn.remove()
  }
}

function bindTeamDrag(root: HTMLElement): void {
  if (!root.querySelector('.form-v2-stage')) return

  type Src = { el: HTMLElement; slot: number | null; uid: string }
  let src: Src | null = null
  let ghost: HTMLElement | null = null
  let dragging = false
  let pointerId = -1
  let startX = 0
  let startY = 0
  let hold = 0

  const clearVisual = () => {
    window.clearTimeout(hold)
    ghost?.remove()
    ghost = null
    src?.el.classList.remove('dragging')
    root.querySelectorAll('.drop-on').forEach((n) => n.classList.remove('drop-on'))
    root.querySelectorAll('.drop-bench').forEach((n) => n.classList.remove('drop-bench'))
    root.querySelector('.form-v2-stage')?.classList.remove('drag-live')
  }

  const hitSlot = (x: number, y: number) => {
    if (ghost) ghost.hidden = true
    const node = document.elementFromPoint(x, y)
    if (ghost) ghost.hidden = false
    return node?.closest<HTMLElement>('[data-slot]') ?? null
  }

  const hitBench = (x: number, y: number) => {
    if (ghost) ghost.hidden = true
    const node = document.elementFromPoint(x, y)
    if (ghost) ghost.hidden = false
    return node?.closest<HTMLElement>('.bench-strip') ?? null
  }

  const placeGhost = (x: number, y: number) => {
    if (!ghost) return
    ghost.style.left = `${x}px`
    ghost.style.top = `${y}px`
    root.querySelectorAll('.drop-on').forEach((n) => n.classList.remove('drop-on'))
    root.querySelectorAll('.drop-bench').forEach((n) => n.classList.remove('drop-bench'))
    const slotEl = hitSlot(x, y)
    if (slotEl) slotEl.classList.add('drop-on')
    else hitBench(x, y)?.classList.add('drop-bench')
  }

  const startDrag = (x: number, y: number) => {
    if (!src || dragging) return
    dragging = true
    dragMoved = true
    src.el.classList.add('dragging')
    root.querySelector('.form-v2-stage')?.classList.add('drag-live')
    ghost = document.createElement('div')
    ghost.className = 'drag-ghost'
    const art = src.el.querySelector('img, svg')
    if (art) ghost.appendChild(art.cloneNode(true))
    else ghost.textContent = src.el.querySelector('b, .name')?.textContent?.trim() ?? ''
    document.body.appendChild(ghost)
    placeGhost(x, y)
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerId !== pointerId || !src) return
    const dx = e.clientX - startX
    const dy = e.clientY - startY
    if (!dragging) {
      if (src.slot === null) {
        if (dx * dx + dy * dy > 36) window.clearTimeout(hold)
        return
      }
      if (dx * dx + dy * dy < 36) return
      startDrag(e.clientX, e.clientY)
    }
    e.preventDefault()
    placeGhost(e.clientX, e.clientY)
  }

  const onUp = (e: PointerEvent) => {
    if (e.pointerId !== pointerId) return
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    window.clearTimeout(hold)
    if (!dragging || !src) {
      clearVisual()
      src = null
      dragging = false
      return
    }
    const slotEl = hitSlot(e.clientX, e.clientY)
    const to = slotEl ? Number(slotEl.dataset.slot) : NaN
    const from = src.slot
    const uid = src.uid
    clearVisual()
    src = null
    dragging = false
    window.setTimeout(() => {
      dragMoved = false
    }, 30)
    if (!slotEl || Number.isNaN(to)) {
      if (from !== null && hitBench(e.clientX, e.clientY)) {
        store.setTeamSlot(from, null)
        selectedSlot = null
      }
      return
    }
    if (from !== null) {
      if (from !== to) store.swapTeamSlots(from, to)
      return
    }
    const existing = store.save.team.indexOf(uid)
    if (existing >= 0) {
      if (existing !== to) store.swapTeamSlots(existing, to)
      return
    }
    store.setTeamSlot(to, uid)
    selectedSlot = null
  }

  const arm = (el: HTMLElement, slot: number | null, uid: string, e: PointerEvent) => {
    if (e.button !== 0 || !uid || src) return
    // 触屏在待上阵列表里用点选上阵，保留列表纵向滑动
    if (e.pointerType === 'touch' && slot === null) return
    src = { el, slot, uid }
    pointerId = e.pointerId
    startX = e.clientX
    startY = e.clientY
    dragging = false
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    if (slot === null) hold = window.setTimeout(() => startDrag(startX, startY), 220)
  }

  root.querySelectorAll<HTMLElement>('[data-slot].filled').forEach((el) => {
    el.addEventListener('pointerdown', (e) => arm(el, Number(el.dataset.slot), el.dataset.clear ?? '', e))
  })
  root.querySelectorAll<HTMLElement>('[data-pick]').forEach((el) => {
    el.addEventListener('pointerdown', (e) => arm(el, null, el.dataset.pick ?? '', e))
  })
}

function bind(root: HTMLElement): void {
  const tip = document.createElement('div')
  tip.className = 'sk-hover'
  tip.hidden = true
  root.querySelector('.shell')?.appendChild(tip)
  const placeTip = (el: HTMLElement) => {
    const name = el.dataset.skName || ''
    if (!name) return
    const kind = el.dataset.skKind || ''
    const desc = el.dataset.skDesc || ''
    const lock = el.dataset.skLock || ''
    tip.innerHTML = `<b>${escapeHtml(name)}</b><i>${escapeHtml(kind)}</i><p>${escapeHtml(desc)}</p>${lock ? `<em>${escapeHtml(lock)}</em>` : ''}`
    tip.hidden = false
    const shell = root.querySelector('.shell')
    if (!shell) return
    const sr = shell.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const width = tip.offsetWidth
    const height = tip.offsetHeight
    let left = r.left - sr.left - width - 10
    if (left < 8) left = r.right - sr.left + 10
    let top = r.top - sr.top + r.height / 2 - height / 2
    top = Math.max(8, Math.min(top, sr.height - height - 8))
    tip.style.left = `${left}px`
    tip.style.top = `${top}px`
  }
  root.querySelectorAll<HTMLElement>('[data-sk-name]').forEach((el) => {
    el.addEventListener('mouseenter', () => placeTip(el))
    el.addEventListener('focus', () => placeTip(el))
    el.addEventListener('mouseleave', () => {
      tip.hidden = true
    })
    el.addEventListener('blur', () => {
      tip.hidden = true
    })
  })
  root.querySelectorAll<HTMLElement>('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => store.go(el.dataset.nav as Screen))
  })
  root.querySelector<HTMLElement>('[data-dock-more]')?.addEventListener('click', () => {
    root.querySelector('#more-sheet')?.classList.toggle('open')
  })
  root.querySelectorAll<HTMLElement>('[data-gacha-back]').forEach((el) => {
    el.addEventListener('click', () => store.closeGachaResult())
  })
  root.querySelectorAll<HTMLElement>('[data-banner-pick]').forEach((el) => {
    el.addEventListener('click', () => {
      const next = el.dataset.bannerPick
      if (next !== 'shu' && next !== 'wei' && next !== 'wu' && next !== 'qun') return
      bannerFaction = next
      store.go('gacha')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-pull]').forEach((el) => {
    el.addEventListener('click', () => {
      const count = el.dataset.pull === '10' ? 10 : 1
      const raw = el.dataset.banner
      const faction = raw === 'shu' || raw === 'wei' || raw === 'wu' || raw === 'qun' ? raw : null
      store.pull(count, faction)
    })
  })
  root.querySelectorAll<HTMLElement>('[data-action="auto-form"]').forEach((el) => {
    el.addEventListener('click', () => store.autoForm())
  })
  root.querySelectorAll<HTMLElement>('[data-action="fill"]').forEach((el) => {
    el.addEventListener('click', () => store.fillResources())
  })
  root.querySelectorAll<HTMLElement>('[data-action="reset"]').forEach((el) => {
    el.addEventListener('click', () => {
      if (confirm('确定重置全部进度？')) store.reset()
    })
  })
  root.querySelectorAll<HTMLElement>('[data-action="refresh-arena"]').forEach((el) => {
    el.addEventListener('click', () => {
      store.refreshArena()
      store.go('arena')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-action="claim-daily"]').forEach((el) => {
    el.addEventListener('click', () => store.claimDaily())
  })
  root.querySelectorAll<HTMLElement>('[data-action="shop-refresh"]').forEach((el) => {
    el.addEventListener('click', () => store.refreshShopOffers())
  })
  root.querySelectorAll<HTMLElement>('[data-buy]').forEach((el) => {
    el.addEventListener('click', () => store.buyShop(el.dataset.buy!))
  })
  root.querySelectorAll<HTMLElement>('[data-levelup]').forEach((el) => {
    el.addEventListener('click', () => store.levelUp(el.dataset.levelup!))
  })
  root.querySelectorAll<HTMLElement>('[data-breakthrough]').forEach((el) => {
    el.addEventListener('click', () => store.breakthrough(el.dataset.breakthrough!))
  })
  root.querySelectorAll<HTMLElement>('[data-awaken]').forEach((el) => {
    el.addEventListener('click', () => store.awaken(el.dataset.awaken!))
  })
  root.querySelectorAll<HTMLElement>('[data-divine]').forEach((el) => {
    el.addEventListener('click', () => {
      const uid = el.dataset.divine!
      const owned = store.save.owned.find((o) => o.uid === uid)
      if (!owned) return
      playDivineMerge(owned.heroId, () => store.mergeDivine(uid))
    })
  })
  root.querySelectorAll<HTMLElement>('[data-challenge]').forEach((el) => {
    el.addEventListener('click', () => store.prepareStage(Number(el.dataset.challenge), store.difficulty))
  })
  // 难度选择
  root.querySelectorAll<HTMLElement>('[data-diff]').forEach((el) => {
    el.addEventListener('click', () => {
      const d = el.dataset.diff as Difficulty
      if (!DIFFICULTY_ORDER.includes(d)) return
      store.difficulty = d
      mapChapter = null
      store.redraw()
    })
  })
  root.querySelectorAll<HTMLElement>('[data-auto-push]').forEach((el) => {
    el.addEventListener('click', () => store.toggleAutoPush())
  })
  // 推图速度选择器（征略页/章节页）
  root.querySelectorAll<HTMLElement>('[data-push-speed-value]').forEach((el) => {
    el.addEventListener('click', () => {
      const n = Number(el.dataset.pushSpeedValue)
      store.setPushSpeed(n)
      el.parentElement?.querySelectorAll<HTMLElement>('[data-push-speed-value]').forEach((b) => {
        b.classList.toggle('on', Number(b.dataset.pushSpeedValue) === n)
      })
    })
  })
  root.querySelectorAll<HTMLElement>('[data-action="launch-battle"]').forEach((el) => {
    el.addEventListener('click', () => store.launchBattle())
  })
  root.querySelectorAll<HTMLElement>('[data-arena]').forEach((el) => {
    el.addEventListener('click', () => store.prepareArena(el.dataset.arena!))
  })
  root.querySelectorAll<HTMLElement>('[data-open]').forEach((el) => {
    el.addEventListener('click', () => store.selectHero(el.dataset.open!))
  })
  root.querySelectorAll<HTMLElement>('[data-cycle-hero]').forEach((el) => {
    el.addEventListener('click', () => {
      const cur = store.save.selectedHeroUid
      const team = store.save.team.filter((id): id is string => !!id)
      const pool = cur && team.includes(cur) ? team : store.save.owned.map((o) => o.uid)
      if (!pool.length) return
      const i = cur ? pool.indexOf(cur) : -1
      const next = pool[(i + 1) % pool.length]
      if (next) store.selectHero(next)
    })
  })
  root.querySelectorAll<HTMLElement>('[data-gear-slot]').forEach((el) => {
    el.addEventListener('click', () => {
      const slot = el.dataset.gearSlot as EquipSlot
      gearPick = gearPick === slot ? null : slot
      store.go('hero')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-gear-close]').forEach((el) => {
    el.addEventListener('click', () => {
      gearPick = null
      store.go('hero')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-wear]').forEach((el) => {
    el.addEventListener('click', () => {
      const heroUid = store.save.selectedHeroUid ?? store.save.owned[0]?.uid
      gearPick = null
      if (heroUid) store.wearEquip(heroUid, el.dataset.wear!)
    })
  })
  root.querySelectorAll<HTMLElement>('[data-auth]').forEach((el) => {
    el.addEventListener('click', () => {
      const user = root.querySelector<HTMLInputElement>('.login-gate [name="user"]')?.value ?? ''
      const password = root.querySelector<HTMLInputElement>('.login-gate [name="pass"]')?.value ?? ''
      void (el.dataset.auth === 'register' ? register(user, password) : login(user, password))
    })
  })
  root.querySelector('.login-gate')?.addEventListener('keydown', (ev) => {
    if ((ev as KeyboardEvent).key !== 'Enter') return
    ev.preventDefault()
    const user = root.querySelector<HTMLInputElement>('.login-gate [name="user"]')?.value ?? ''
    const password = root.querySelector<HTMLInputElement>('.login-gate [name="pass"]')?.value ?? ''
    void login(user, password)
  })
  root.querySelectorAll<HTMLElement>('[data-logout]').forEach((el) => {
    el.addEventListener('click', () => void logout())
  })
  root.querySelectorAll<HTMLElement>('[data-equip-pull]').forEach((el) => {
    el.addEventListener('click', () => store.pullEquip(el.dataset.equipPull === '10' ? 10 : 1))
  })
  root.querySelectorAll<HTMLElement>('[data-upgrade]').forEach((el) => {
    el.addEventListener('click', () => store.upgradeEquip(el.dataset.upgrade!))
  })
  root.querySelectorAll<HTMLElement>('[data-smith]').forEach((el) => {
    el.addEventListener('click', () => store.smithEquip(el.dataset.smith!))
  })
  root.querySelectorAll<HTMLElement>('[data-equip-slot]').forEach((el) => {
    el.addEventListener('click', () => {
      equipSlot = el.dataset.equipSlot as typeof equipSlot
      openEquipUid = null
      store.redraw()
    })
  })
  root.querySelectorAll<HTMLElement>('[data-equip-open]').forEach((el) => {
    el.addEventListener('click', () => {
      openEquipUid = el.dataset.equipOpen ?? null
      store.redraw()
    })
  })
  root.querySelectorAll<HTMLElement>('[data-equip-close]').forEach((el) => {
    el.addEventListener('click', () => {
      openEquipUid = null
      store.redraw()
    })
  })
  root.querySelectorAll<HTMLElement>('[data-give]').forEach((el) => {
    el.addEventListener('click', () => {
      const heroUid = el.dataset.give
      const piece = el.dataset.piece
      if (heroUid && piece) store.wearEquip(heroUid, piece)
    })
  })
  root.querySelectorAll<HTMLElement>('[data-unequip]').forEach((el) => {
    el.addEventListener('click', () => {
      const [uid, slot] = el.dataset.unequip!.split(':')
      gearPick = null
      store.unequip(uid, slot as EquipSlot)
    })
  })
  root.querySelectorAll<HTMLElement>('[data-slot]').forEach((el) => {
    el.addEventListener('click', (e) => {
      if (dragMoved) {
        dragMoved = false
        return
      }
      const idx = Number(el.dataset.slot)
      if ((e.target as HTMLElement).closest('[data-slot-clear]')) {
        store.setTeamSlot(idx, null)
        if (selectedSlot === idx) selectedSlot = null
        return
      }
      if (selectedSlot === idx) {
        selectedSlot = null
        store.redraw()
        return
      }
      selectedSlot = idx
      store.go('team')
    })
  })
  const sealTip = root.querySelector<HTMLElement>('.seal-tip')
  const showSeal = (el: HTMLElement) => {
    if (!sealTip) return
    sealTip.textContent = el.dataset.seal || ''
    sealTip.classList.add('show')
  }
  root.querySelectorAll<HTMLElement>('[data-seal]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (root.querySelector('.seal.open')) return
      showSeal(el)
    })
    el.addEventListener('mouseleave', () => {
      if (root.querySelector('.seal.open')) return
      sealTip?.classList.remove('show')
    })
    el.addEventListener('click', (ev) => {
      ev.stopPropagation()
      const was = el.classList.contains('open')
      root.querySelectorAll('.seal.open').forEach((n) => n.classList.remove('open'))
      if (was) {
        sealTip?.classList.remove('show')
        if (sealTip) sealTip.textContent = ''
        return
      }
      el.classList.add('open')
      showSeal(el)
    })
  })
  root.addEventListener('click', (ev) => {
    if ((ev.target as HTMLElement).closest('[data-seal]')) return
    root.querySelectorAll('.seal.open').forEach((n) => n.classList.remove('open'))
    sealTip?.classList.remove('show')
  })
  root.querySelectorAll<HTMLElement>('[data-pick-filter]').forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation()
      const key = el.dataset.pickFilter as 'faction' | 'role' | 'rarity'
      const value = el.dataset.value
      if (!value) return
      pickFilter[key] = value
      root.querySelectorAll<HTMLElement>(`[data-pick-filter="${key}"]`).forEach((chip) => {
        chip.classList.toggle('on', chip.dataset.value === value)
      })
      let shown = 0
      root.querySelectorAll<HTMLElement>('.pick-grid [data-faction], .bench-strip [data-faction]').forEach((card) => {
        const ok =
          (pickFilter.faction === 'all' || card.dataset.faction === pickFilter.faction) &&
          (pickFilter.role === 'all' || card.dataset.role === pickFilter.role) &&
          (pickFilter.rarity === 'all' || card.dataset.rarity === pickFilter.rarity)
        card.hidden = !ok
        if (ok) shown += 1
      })
      const empty = root.querySelector<HTMLElement>('.pick-empty')
      if (empty) empty.hidden = shown > 0
    })
  })
  root.querySelectorAll<HTMLElement>('[data-roster-mode]').forEach((el) => {
    el.addEventListener('click', () => {
      const mode = el.dataset.rosterMode
      rosterMode = mode === 'exchange' || mode === 'scrap' ? mode : 'list'
      if (rosterMode !== 'scrap') scrapPicks.clear()
      store.go('roster')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-scrap-pick]').forEach((el) => {
    el.addEventListener('click', () => {
      const uid = el.dataset.scrapPick!
      if (scrapPicks.has(uid)) scrapPicks.delete(uid)
      else scrapPicks.add(uid)
      store.redraw()
    })
  })
  root.querySelectorAll<HTMLElement>('[data-scrap-all]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.hasAttribute('disabled')) return
      const team = new Set(store.save.team.filter((id): id is string => !!id))
      const visible = store.save.owned.filter(
        (o) => !team.has(o.uid) && !o.divine && matchesFilter(rosterFilter, HERO_MAP[o.heroId]),
      )
      const allOn = visible.length > 0 && visible.every((o) => scrapPicks.has(o.uid))
      if (allOn) for (const o of visible) scrapPicks.delete(o.uid)
      else for (const o of visible) scrapPicks.add(o.uid)
      store.redraw()
    })
  })
  root.querySelectorAll<HTMLElement>('[data-scrap-confirm]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.hasAttribute('disabled')) return
      const uids = [...scrapPicks]
      if (!confirm(`分解选中的 ${uids.length} 名武将？该操作不可撤销。`)) return
      scrapPicks.clear()
      store.decomposeMany(uids)
    })
  })
  root.querySelectorAll<HTMLElement>('[data-roster-filter]').forEach((el) => {
    el.addEventListener('click', (ev) => {
      ev.stopPropagation()
      const key = el.dataset.rosterFilter as 'faction' | 'role' | 'rarity'
      const value = el.dataset.value
      if (!value || !key) return
      rosterFilter[key] = value
      store.go('roster')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-open-chapter]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.hasAttribute('disabled')) return
      mapChapter = Number(el.dataset.openChapter)
      store.go('campaign')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-map-back]').forEach((el) => {
    el.addEventListener('click', () => {
      mapChapter = null
      store.go('campaign')
    })
  })
  root.querySelectorAll<HTMLElement>('[data-decompose]').forEach((el) => {
    el.addEventListener('click', () => {
      const gain = el.dataset.soul ?? ''
      if (!confirm(`分解这名武将，获得 ${gain} 将魂？上阵中的会先撤下。`)) return
      store.decompose(el.dataset.decompose!)
    })
  })
  root.querySelectorAll<HTMLElement>('[data-exchange]').forEach((el) => {
    el.addEventListener('click', () => store.exchangeHero(el.dataset.exchange!))
  })
  bindTeamDrag(root)
  root.querySelectorAll<HTMLElement>('[data-pick]').forEach((el) => {
    el.addEventListener('click', () => {
      if (dragMoved) {
        dragMoved = false
        return
      }
      const uid = el.dataset.pick!
      const cur = store.save.team.indexOf(uid)
      if (cur >= 0) {
        store.setTeamSlot(cur, null)
        selectedSlot = null
        return
      }
      const slot = selectedSlot ?? store.save.team.findIndex((x) => x === null)
      if (slot < 0) {
        store.toast = '阵容已满，请先点选要替换的阵位'
        store.redraw()
        return
      }
      store.setTeamSlot(slot, uid)
      selectedSlot = null
    })
  })
}
