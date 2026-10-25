import { EQUIP_MAP, randomEquipDrop } from '../data/equips'
import { HERO_MAP } from '../data/heroes'
import { heroSkills, divineSkill } from '../data/skills'
import { STAGES, DIFFICULTIES, prevDifficulty, stageFor } from '../data/stages'
import type { ArenaBot, Difficulty, EquipSlot, Faction, OwnedHero, SaveData, Screen } from '../data/types'
import { arenaReward, generateOpponents } from './arena'
import { simulateBattle, simulateStageBattle, type BattleResult, type BattleUnit } from './battle'
import { applyDailyGrant, rollDaily } from './daily'
import { equipPullCost, rollEquips, type EquipPull } from './equipGacha'
import { applyPull, type PullResult } from './gacha'
import { acceptServerSave, loadSave, newHeroUid, newUid, resetSave, writeSave } from './save'
import { buyOffer, ensureShop, refreshShop } from './shop'
import {
  autoLineup,
  awakenCost,
  battleHeroExp,
  breakthroughCost,
  fodderCandidates,
  equipBonus,
  expForLevel,
  expToNextPlayer,
  SMITH_CAP,
  equipLevelCap,
  smithCost,
  upgradeCost,
  levelCap,
  levelUpCost,
  soulCost,
  soulFromHero,
  teamPower,
  findDivinePartner,
  isMaxedHero,
  MAX_BREAKTHROUGH,
} from './stats'

type Listener = () => void

export type GachaPhase = 'idle' | 'playing' | 'result'
export type HeroFx = { uid: string; kind: 'level' | 'breakthrough' | 'divine'; text: string }

export class Store {
  save: SaveData
  screen: Screen = 'home'
  lastPulls: PullResult[] = []
  lastEquipPulls: EquipPull[] = []
  lastBanner: Faction | null = null
  lastBattle: BattleResult | null = null
  arenaList: ArenaBot[] = []
  battleMode: 'stage' | 'arena' = 'stage'
  pending: { kind: 'stage'; stageId: number; diff: Difficulty } | { kind: 'arena'; botId: string } | null = null
  gachaPhase: GachaPhase = 'idle'
  heroFx: HeroFx | null = null
  toast = ''
  /** 当前选择的征战难度（不入存档，仅为界面状态） */
  difficulty: Difficulty = 'normal'
  /** 自动推图中：胜利后自动挑战下一关 */
  autoPushing = false
  private autoTimer = 0
  private listeners = new Set<Listener>()

  constructor() {
    this.save = ensureShop(loadSave())
    this.refreshArena()
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private emit(toast?: string): void {
    if (toast) this.toast = toast
    writeSave(this.save)
    for (const fn of this.listeners) fn()
  }

  redraw(): void {
    this.emit()
  }

  /** 清除提示文案（不触发重绘，避免打断战斗回放） */
  clearToast(): void {
    this.toast = ''
  }

  adoptSave(raw: SaveData): boolean {
    const next = acceptServerSave(raw)
    if (!next) return false
    this.save = next
    this.screen = 'home'
    this.emit()
    return true
  }

  go(screen: Screen): void {
    rollDaily(this.save)
    if (this.gachaPhase === 'playing') this.gachaPhase = 'idle'
    if (screen !== 'battle') this.stopAutoPush()
    if (screen === 'arena') this.refreshArena()
    if (screen === 'shop') this.save = ensureShop(this.save)
    this.screen = screen
    this.emit()
  }

  toggleAutoPush(): void {
    if (this.autoPushing) {
      this.stopAutoPush()
      this.emit('已停止自动推图')
      return
    }
    const nextId = this.progressFor(this.difficulty) + 1
    if (!STAGES.some((s) => s.id === nextId)) {
      this.emit('已通关全部关卡')
      return
    }
    if (this.battleRoster().length < 1) {
      this.emit('请先配置出战阵容')
      return
    }
    this.autoPushing = true
    this.challenge(nextId, this.difficulty)
  }

  private stopAutoPush(): void {
    this.autoPushing = false
    if (this.autoTimer) {
      window.clearTimeout(this.autoTimer)
      this.autoTimer = 0
    }
  }

  /** 战斗回放播完（或点跳过）后由渲染层回调，驱动自动推图连战 */
  onBattlePlaybackDone(): void {
    if (!this.autoPushing || this.screen !== 'battle') return
    if (!this.lastBattle?.win) {
      // 战败：回放播完后再停止推图，让战斗页保留推图状态直到最后一刻
      this.stopAutoPush()
      this.emit('自动推图已停止')
      return
    }
    const nextId = this.progressFor(this.difficulty) + 1
    if (!STAGES.some((s) => s.id === nextId)) {
      this.stopAutoPush()
      this.emit('已通关全部关卡！')
      return
    }
    if (this.autoTimer) return
    // 短暂停留展示战报，然后自动进入下一关；停留时长随推图速度缩短
    const hold = Math.max(120, Math.round(800 / this.pushSpeed()))
    this.autoTimer = window.setTimeout(() => {
      this.autoTimer = 0
      if (this.autoPushing) this.challenge(nextId, this.difficulty)
    }, hold)
  }

  /** 手动战斗播放速度倍率（静默保存，不触发重绘以免打断战斗回放） */
  setBattleSpeed(n: number): void {
    const v = n === 2 || n === 4 || n === 8 ? n : 1
    if (this.save.battleSpeed === v) return
    this.save.battleSpeed = v
    writeSave(this.save)
  }

  battleSpeed(): number {
    const v = this.save.battleSpeed
    return v === 2 || v === 4 || v === 8 ? v : 1
  }

  /** 自动推图播放速度倍率（静默保存） */
  setPushSpeed(n: number): void {
    const v = n === 1 || n === 2 || n === 4 || n === 8 ? n : 4
    if (this.save.pushSpeed === v) return
    this.save.pushSpeed = v
    writeSave(this.save)
  }

  pushSpeed(): number {
    const v = this.save.pushSpeed
    return v === 1 || v === 2 || v === 4 || v === 8 ? v : 4
  }

  buyShop(offerId: string): void {
    try {
      this.save = buyOffer(this.save, offerId)
      this.emit('购买成功')
    } catch (e) {
      this.emit(e instanceof Error ? e.message : '购买失败')
    }
  }

  refreshShopOffers(): void {
    try {
      const wasFree = this.save.shopRefreshUsed < 1
      this.save = refreshShop(this.save)
      this.emit(wasFree ? '商店已刷新（今日免费）' : '商店已刷新（-15元宝）')
    } catch (e) {
      this.emit(e instanceof Error ? e.message : '刷新失败')
    }
  }

  reset(): void {
    this.stopAutoPush()
    this.save = resetSave()
    this.lastPulls = []
    this.lastBattle = null
    this.gachaPhase = 'idle'
    this.refreshArena()
    this.screen = 'home'
    this.emit('已重置存档')
  }

  fillResources(): void {
    const full = 9999999
    this.save.gold = full
    this.save.jade = full
    this.save.tickets = full
    this.save.seals = full
    this.save.awakenStone = full
    this.save.forgeStone = full
    this.save.iron = full
    this.save.equipTickets = full
    this.save.soul = full
    this.emit('资源已补满')
  }

  getTeamHeroes(): OwnedHero[] {
    return this.save.team
      .map((uid) => this.save.owned.find((o) => o.uid === uid))
      .filter((o): o is OwnedHero => !!o)
  }

  battleRoster(): BattleUnit[] {
    const out: BattleUnit[] = []
    this.save.team.forEach((uid, slot) => {
      if (!uid) return
      const owned = this.save.owned.find((o) => o.uid === uid)
      if (owned) out.push({ owned, slot })
    })
    return out
  }

  power(): number {
    return teamPower(this.save)
  }

  /** 某难度已通关的最大关卡 */
  progressFor(diff: Difficulty): number {
    switch (diff) {
      case 'hard':
        return this.save.stageHardCleared
      case 'hero':
        return this.save.stageHeroCleared
      case 'epic':
        return this.save.stageEpicCleared
      default:
        return this.save.stageCleared
    }
  }

  private setProgress(diff: Difficulty, stageId: number): void {
    if (diff === 'hard') {
      if (stageId > this.save.stageHardCleared) this.save.stageHardCleared = stageId
    } else if (diff === 'hero') {
      if (stageId > this.save.stageHeroCleared) this.save.stageHeroCleared = stageId
    } else if (diff === 'epic') {
      if (stageId > this.save.stageEpicCleared) this.save.stageEpicCleared = stageId
    } else if (stageId > this.save.stageCleared) {
      this.save.stageCleared = stageId
    }
  }

  /** 该难度下这一关是否已解锁；返回空串表示可挑战 */
  unlockReason(stageId: number, diff: Difficulty): string {
    const prev = prevDifficulty(diff)
    if (prev && this.progressFor(prev) < stageId) {
      return `需先通关「${DIFFICULTIES[prev].name}」第 ${stageId} 关`
    }
    return ''
  }

  pull(count: 1 | 10, faction: Faction | null = null): void {
    if (this.gachaPhase === 'playing') return
    try {
      const { save, results } = applyPull(this.save, count, faction)
      this.save = save
      this.lastPulls = results
      this.lastBanner = faction
      this.screen = 'gacha'
      this.gachaPhase = 'playing'
      this.toast = ''
      this.emit()
    } catch (e) {
      this.emit(e instanceof Error ? e.message : '招募失败')
    }
  }

  finishGachaAnim(): void {
    if (this.gachaPhase !== 'playing') return
    this.gachaPhase = 'result'
    this.toast = ''
    this.emit()
  }

  closeGachaResult(): void {
    if (this.gachaPhase !== 'result') return
    this.gachaPhase = 'idle'
    this.toast = ''
    this.emit()
  }

  setTeamSlot(index: number, uid: string | null): void {
    if (index < 0 || index > 5) return
    const team = [...this.save.team]
    while (team.length < 6) team.push(null)
    if (uid && team.includes(uid)) {
      const old = team.indexOf(uid)
      team[old] = null
    }
    team[index] = uid
    this.save.team = team.slice(0, 6)
    this.emit()
  }

  swapTeamSlots(a: number, b: number): void {
    if (a < 0 || b < 0 || a > 5 || b > 5 || a === b) return
    const team = [...this.save.team]
    while (team.length < 6) team.push(null)
    const next = team.slice(0, 6)
    const held = next[a]
    next[a] = next[b]
    next[b] = held
    this.save.team = next
    this.emit()
  }

  autoForm(): void {
    this.save.team = autoLineup(this.save)
    this.emit('已按位置与战力排好前排、后排')
  }

  selectHero(uid: string): void {
    this.save.selectedHeroUid = uid
    this.screen = 'hero'
    this.emit()
  }

  levelUp(uid: string): void {
    const hero = this.save.owned.find((o) => o.uid === uid)
    if (!hero) return
    const cap = levelCap(hero.breakthrough ?? 0)
    if (hero.level >= cap) {
      this.emit(hero.breakthrough >= 5 ? '已达满级' : `已达上限 Lv.${cap}，请先突破`)
      return
    }
    const cost = levelUpCost(hero.level)
    if (this.save.gold < cost) {
      this.emit('银两不足')
      return
    }
    this.save.gold -= cost
    hero.level += 1
    this.heroFx = { uid, kind: 'level', text: `Lv.${hero.level}` }
    this.emit(`${HERO_MAP[hero.heroId].name} 升至 ${hero.level} 级`)
  }

  breakthrough(uid: string): void {
    const hero = this.save.owned.find((o) => o.uid === uid)
    if (!hero) return
    if (hero.breakthrough >= 5) {
      this.emit('突破已满')
      return
    }
    const needLv = levelCap(hero.breakthrough)
    if (hero.level < needLv) {
      this.emit(`需要达到 Lv.${needLv} 才能突破`)
      return
    }
    const def = HERO_MAP[hero.heroId]
    const cost = breakthroughCost(hero.breakthrough)
    const fodders = fodderCandidates(hero, this.save.owned, this.save.team)
    if (fodders.length < 1) {
      this.emit('突破需要 1 名 1 级同名武将（未上阵、非神将）')
      return
    }
    if (this.save.gold < cost) {
      this.emit('银两不足')
      return
    }
    this.save.gold -= cost
    // 消耗等级最低的同名武将作为突破材料
    const fodder = fodders[0]
    this.save.owned = this.save.owned.filter((o) => o.uid !== fodder.uid)
    hero.breakthrough += 1
    const unlocked = heroSkills(def.id).find((s) => s.unlockAt - 1 === hero.breakthrough)
    const tip = unlocked ? `解锁${unlocked.kind === 'active' ? '主动' : '被动'}「${unlocked.name}」` : '属性提升'
    this.heroFx = { uid, kind: 'breakthrough', text: unlocked ? unlocked.name : `+${hero.breakthrough}` }
    this.emit(`${def.name} 突破 +${hero.breakthrough}，${tip}`)
  }

  clearHeroFx(): void {
    if (!this.heroFx) return
    this.heroFx = null
    for (const fn of this.listeners) fn()
  }

  /** 当前武将可用来神合的同名满级满突破武将 */
  divinePartner(uid: string): OwnedHero | null {
    const hero = this.save.owned.find((o) => o.uid === uid)
    return hero ? findDivinePartner(hero, this.save.owned) : null
  }

  /** 两张同名满级满突破武将合成神将：等级与突破归零重新历练，属性加成保留并领悟神技 */
  mergeDivine(uid: string): void {
    const hero = this.save.owned.find((o) => o.uid === uid)
    if (!hero) return
    if (hero.divine) {
      this.emit('该武将已是神将')
      return
    }
    if (!isMaxedHero(hero)) {
      this.emit(`需满级 Lv.${levelCap(MAX_BREAKTHROUGH)} 且突破 +${MAX_BREAKTHROUGH} 才能神合`)
      return
    }
    const partner = findDivinePartner(hero, this.save.owned)
    if (!partner) {
      this.emit('需要另一张同名满级满突破武将')
      return
    }
    // 伙伴身上的装备空位转移给主将，避免跟着消失
    for (const slot of Object.keys(partner.gear ?? {}) as EquipSlot[]) {
      if (!hero.gear[slot] && partner.gear[slot]) hero.gear[slot] = partner.gear[slot]
    }
    this.save.owned = this.save.owned.filter((o) => o.uid !== partner.uid)
    this.save.team = this.save.team.map((id) => (id === partner.uid ? null : id))
    if (this.save.selectedHeroUid === partner.uid) this.save.selectedHeroUid = hero.uid
    hero.divine = true
    hero.level = 1
    hero.breakthrough = 0
    hero.exp = 0
    this.heroFx = { uid, kind: 'divine', text: '神将' }
    const god = divineSkill(hero.heroId)
    this.emit(`${HERO_MAP[hero.heroId].name} 神合成功，晋升神将！等级归零重新历练${god ? `，领悟神技「${god.name}」` : ''}`)
  }

  awaken(uid: string): void {
    const hero = this.save.owned.find((o) => o.uid === uid)
    if (!hero) return
    if (hero.awaken >= 5) {
      this.emit('觉醒已满星')
      return
    }
    const cost = awakenCost(hero.awaken)
    if (this.save.awakenStone < cost.stones) {
      this.emit('觉醒丹不足')
      return
    }
    if (this.save.gold < cost.gold) {
      this.emit('银两不足')
      return
    }
    const fodders = fodderCandidates(hero, this.save.owned, this.save.team)
    if (!fodders.length) {
      this.emit('觉醒需要 1 名 1 级同名武将（未上阵、非神将）')
      return
    }
    // 消耗 1 名 1 级同名武将作为觉醒材料
    const fodder = fodders[0]
    this.save.owned = this.save.owned.filter((o) => o.uid !== fodder.uid)
    this.save.awakenStone -= cost.stones
    this.save.gold -= cost.gold
    hero.awaken += 1
    this.emit(`${HERO_MAP[hero.heroId].name} 觉醒 ${'★'.repeat(hero.awaken)}，消耗 1 名 1 级同名武将`)
  }

  wearEquip(heroUid: string, equipUid: string): void {
    const hero = this.save.owned.find((o) => o.uid === heroUid)
    const eq = this.save.equips.find((e) => e.uid === equipUid)
    if (!hero || !eq) return
    const def = EQUIP_MAP[eq.equipId]
    if (!def) return
    // unequip from others
    for (const h of this.save.owned) {
      for (const slot of Object.keys(h.gear) as EquipSlot[]) {
        if (h.gear[slot] === equipUid) delete h.gear[slot]
      }
    }
    const prev = hero.gear[def.slot]
    hero.gear[def.slot] = equipUid
    void prev
    this.emit(`装备了「${def.name}」`)
  }

  unequip(heroUid: string, slot: EquipSlot): void {
    const hero = this.save.owned.find((o) => o.uid === heroUid)
    if (!hero?.gear[slot]) return
    delete hero.gear[slot]
    this.emit('已卸下装备')
  }

  upgradeEquip(equipUid: string): void {
    const eq = this.save.equips.find((e) => e.uid === equipUid)
    if (!eq) return
    const def = EQUIP_MAP[eq.equipId]
    if (!def) return
    const cap = equipLevelCap(eq.forge ?? 0)
    if (eq.level >= cap) {
      this.emit((eq.forge ?? 0) >= SMITH_CAP ? `已达满级 +${cap}` : `已达上限 +${cap}，请先锻造`)
      return
    }
    const cost = upgradeCost(eq.level)
    if (this.save.gold < cost.gold) {
      this.emit('银两不足')
      return
    }
    if ((this.save.iron ?? 0) < cost.iron) {
      this.emit('精铁不足')
      return
    }
    this.save.gold -= cost.gold
    this.save.iron = (this.save.iron ?? 0) - cost.iron
    eq.level += 1
    const grown = equipBonus(def, eq.level, eq.forge ?? 0)
    this.emit(`${def.name} 升到 +${eq.level} 攻${grown.atk} 血${grown.hp} 防${grown.def}`)
  }

  smithEquip(equipUid: string): void {
    const eq = this.save.equips.find((e) => e.uid === equipUid)
    if (!eq) return
    const def = EQUIP_MAP[eq.equipId]
    if (!def) return
    const rank = eq.forge ?? 0
    if (rank >= SMITH_CAP) {
      this.emit(`锻造已满 ${SMITH_CAP}阶`)
      return
    }
    const need = equipLevelCap(rank)
    if (eq.level < need) {
      this.emit(`需要升到 +${need} 才能锻造`)
      return
    }
    const cost = smithCost(rank)
    if (this.save.gold < cost.gold) {
      this.emit('银两不足')
      return
    }
    if (this.save.forgeStone < cost.stones) {
      this.emit('精炼石不足')
      return
    }
    if ((this.save.iron ?? 0) < cost.iron) {
      this.emit('精铁不足')
      return
    }
    this.save.gold -= cost.gold
    this.save.forgeStone -= cost.stones
    this.save.iron = (this.save.iron ?? 0) - cost.iron
    eq.forge = rank + 1
    const grown = equipBonus(def, eq.level, eq.forge)
    this.emit(`${def.name} 锻到 ${eq.forge}阶 攻${grown.atk} 血${grown.hp} 防${grown.def}`)
  }

  forgeEquip(equipUid: string): void {
    this.upgradeEquip(equipUid)
  }

  pullEquip(count: 1 | 10): void {
    const cost = equipPullCost(count)
    if ((this.save.equipTickets ?? 0) < cost) {
      this.emit('铸令不足')
      return
    }
    this.save.equipTickets -= cost
    const rolled = rollEquips(count, this.save.equipPity ?? 0)
    this.save.equipPity = rolled.pity
    this.lastEquipPulls = rolled.items
    for (const item of rolled.items) {
      this.save.equips.push({ uid: newUid(), equipId: item.id, level: 1, forge: 0 })
    }
    this.screen = 'equipGacha'
    this.emit(count === 10 ? '铸成十件' : '铸成一件')
  }

  claimDaily(): void {
    rollDaily(this.save)
    if (this.save.dailyClaimed) {
      this.emit('今日俸禄已领取')
      return
    }
    applyDailyGrant(this.save)
    this.emit('领取今日俸禄')
  }

  prepareStage(stageId: number, diff: Difficulty = this.difficulty): void {
    rollDaily(this.save)
    const stage = stageFor(stageId, diff)
    if (!stage) return
    if (stageId <= this.progressFor(diff) && this.save.sweepsLeft <= 0) {
      this.emit('今日扫荡次数已用完')
      return
    }
    if (stageId > this.progressFor(diff) + 1) {
      this.emit('请先通关前置关卡')
      return
    }
    const reason = this.unlockReason(stageId, diff)
    if (reason) {
      this.emit(reason)
      return
    }
    if (this.battleRoster().length < 1) {
      this.emit('请先配置出战阵容')
      return
    }
    this.battleMode = 'stage'
    this.pending = { kind: 'stage', stageId, diff }
    this.screen = 'prep'
    this.emit()
  }

  prepareArena(botId: string): void {
    if (this.save.arenaTickets <= 0) {
      this.emit('竞技场挑战次数不足')
      return
    }
    if (!this.arenaList.some((b) => b.id === botId)) return
    if (!this.battleRoster().length) {
      this.emit('请先配置出战阵容')
      return
    }
    this.battleMode = 'arena'
    this.pending = { kind: 'arena', botId }
    this.screen = 'prep'
    this.emit()
  }

  launchBattle(): void {
    rollDaily(this.save)
    const pending = this.pending
    if (!pending) return
    if (pending.kind === 'stage' && pending.stageId <= this.progressFor(pending.diff) && this.save.sweepsLeft <= 0) {
      this.emit('今日扫荡次数已用完')
      return
    }
    this.pending = null
    if (pending.kind === 'stage') this.challenge(pending.stageId, pending.diff)
    else this.fightArena(pending.botId)
  }

  challenge(stageId: number, diff: Difficulty = this.difficulty): void {
    const stage = stageFor(stageId, diff)
    if (!stage) return
    if (stageId > this.progressFor(diff) + 1) {
      this.stopAutoPush()
      this.emit('请先通关前置关卡')
      return
    }
    const reason = this.unlockReason(stageId, diff)
    if (reason) {
      this.stopAutoPush()
      this.emit(reason)
      return
    }
    const team = this.battleRoster()
    if (team.length < 1) {
      this.stopAutoPush()
      this.emit('请先配置出战阵容')
      return
    }

    this.battleMode = 'stage'
    const result = simulateStageBattle(team, this.save.equips, stage)
    this.grantFightExp(result)
    this.lastBattle = result
    this.screen = 'battle'

    if (result.win) {
      const sweep = stageId <= this.progressFor(diff)
      const sealsFull = Math.round((stageId % 5 === 0 ? 18 : 6) * DIFFICULTIES[diff].sealMult)
      const gold = sweep ? Math.round(stage.rewardGold / 2) : stage.rewardGold
      const jade = sweep ? Math.max(1, Math.round(stage.rewardJade / 2)) : stage.rewardJade
      const seals = sweep ? Math.max(2, Math.round(sealsFull / 2)) : sealsFull
      this.save.gold += gold
      this.save.jade += jade
      this.save.seals = (this.save.seals ?? 0) + seals
      this.save.playerExp += sweep ? Math.round(stage.rewardExp / 2) : stage.rewardExp
      this.save.awakenStone += sweep ? (stageId % 3 === 0 ? 1 : 0) : stageId % 3 === 0 ? 2 : 1
      this.save.forgeStone += sweep ? (stageId % 2 === 0 ? 1 : 0) : 1
      if (sweep) this.save.sweepsLeft = Math.max(0, this.save.sweepsLeft - 1)
      this.setProgress(diff, stageId)
      const drop = sweep ? null : randomEquipDrop(stageId)
      let dropMsg = ''
      if (drop) {
        this.save.equips.push({ uid: newUid(), equipId: drop, level: 1 })
        dropMsg = ` · 掉落「${EQUIP_MAP[drop].name}」`
      }
      while (this.save.playerExp >= expToNextPlayer(this.save.playerLevel)) {
        this.save.playerExp -= expToNextPlayer(this.save.playerLevel)
        this.save.playerLevel += 1
        this.save.tickets += 1
        this.save.jade += 10
        this.save.arenaTickets = Math.min(12, this.save.arenaTickets + 1)
      }
      const tag = diff === 'normal' ? '' : `（${DIFFICULTIES[diff].name}）`
      this.emit(
        sweep
          ? `扫荡「${stage.name}」${tag}+${gold}银两 · +${seals}阵符，今日还剩 ${this.save.sweepsLeft} 次${dropMsg}`
          : `通关「${stage.name}」${tag}！+${gold}银两 · +${seals}阵符${dropMsg}`,
      )
    } else {
      // 推图失败时先保留推图状态，等战斗回放播完再由 onBattlePlaybackDone 停止
      this.emit(`挑战「${stage.name}」失败${this.autoPushing ? '，自动推图即将停止' : ''}`)
    }
  }

  private grantFightExp(result: BattleResult): void {
    const gain = battleHeroExp(result.win)
    result.exp = result.allies.map((f) => {
      const hero = this.save.owned.find((o) => o.uid === f.uid)
      if (!hero) return { uid: f.uid, name: f.name, gain: 0, levels: 0, capped: true }
      const cap = levelCap(hero.breakthrough ?? 0)
      if (hero.level >= cap) return { uid: f.uid, name: f.name, gain: 0, levels: 0, capped: true }
      hero.exp = (hero.exp ?? 0) + gain
      let levels = 0
      while (hero.level < cap && hero.exp >= expForLevel(hero.level)) {
        hero.exp -= expForLevel(hero.level)
        hero.level += 1
        levels += 1
      }
      if (hero.level >= cap) hero.exp = 0
      return { uid: f.uid, name: f.name, gain, levels, capped: false }
    })
  }

  refreshArena(): void {
    this.arenaList = generateOpponents(this.save.arenaPoints, this.power())
  }

  fightArena(botId: string): void {
    if (this.save.arenaTickets <= 0) {
      this.emit('竞技场挑战次数不足')
      return
    }
    const bot = this.arenaList.find((b) => b.id === botId)
    if (!bot) return
    const team = this.battleRoster()
    if (!team.length) {
      this.emit('请先配置出战阵容')
      return
    }

    this.save.arenaTickets -= 1
    this.battleMode = 'arena'
    const result = simulateBattle(
      { heroes: team, bag: this.save.equips },
      bot.heroes,
      `竞技场 · ${bot.name}`,
    )
    this.grantFightExp(result)
    this.lastBattle = result
    this.screen = 'battle'

    const reward = arenaReward(result.win, bot.points, this.save.arenaPoints)
    this.save.arenaPoints = Math.max(0, this.save.arenaPoints + reward.points)
    this.save.gold += reward.gold
    this.save.jade += reward.jade
    if (result.win) this.save.arenaWins += 1
    else this.save.arenaLosses += 1
    this.refreshArena()
    this.emit(
      result.win
        ? `战胜 ${bot.name}！积分 ${reward.points > 0 ? '+' : ''}${reward.points}`
        : `惜败于 ${bot.name}，积分 ${reward.points}`,
    )
  }

  decompose(uid: string): void {
    if (this.save.owned.length <= 1) {
      this.emit('至少保留一名武将')
      return
    }
    const hero = this.save.owned.find((o) => o.uid === uid)
    if (!hero) return
    if (hero.divine) {
      this.emit('神将不可分解')
      return
    }
    const def = HERO_MAP[hero.heroId]
    const gain = soulFromHero(def.rarity, hero.shards)
    this.save.owned = this.save.owned.filter((o) => o.uid !== uid)
    this.save.team = this.save.team.map((id) => (id === uid ? null : id))
    this.save.soul = (this.save.soul ?? 0) + gain
    if (this.save.selectedHeroUid === uid) {
      this.save.selectedHeroUid = this.save.owned[0]?.uid ?? null
      this.screen = 'roster'
    }
    this.emit(`${def.name} 已分解，获得 ${gain} 将魂`)
  }

  /** 批量分解：仅允许未上阵且非神将的武将 */
  decomposeMany(uids: string[]): void {
    const picks = new Set(uids)
    const onTeam = new Set(this.save.team.filter((id): id is string => !!id))
    const targets = this.save.owned.filter((o) => picks.has(o.uid) && !o.divine && !onTeam.has(o.uid))
    if (!targets.length) {
      this.emit('没有可分解的武将')
      return
    }
    if (this.save.owned.length - targets.length < 1) {
      this.emit('至少保留一名武将')
      return
    }
    const drop = new Set(targets.map((o) => o.uid))
    let gain = 0
    for (const o of targets) gain += soulFromHero(HERO_MAP[o.heroId].rarity, o.shards)
    this.save.owned = this.save.owned.filter((o) => !drop.has(o.uid))
    this.save.soul = (this.save.soul ?? 0) + gain
    if (this.save.selectedHeroUid && drop.has(this.save.selectedHeroUid)) {
      this.save.selectedHeroUid = this.save.owned[0]?.uid ?? null
    }
    this.emit(`分解 ${targets.length} 名武将，获得 ${gain} 将魂`)
  }

  exchangeHero(heroId: string): void {
    const def = HERO_MAP[heroId]
    if (!def) return
    const cost = soulCost(def.rarity)
    if ((this.save.soul ?? 0) < cost) {
      this.emit(`将魂不足（需 ${cost}）`)
      return
    }
    this.save.soul -= cost
    const owned = this.save.owned.find((o) => o.heroId === heroId)
    if (owned) {
      // 已拥有：转为 1 级同名武将，可作为突破/觉醒材料
      this.save.owned.push({
        uid: newHeroUid(),
        heroId,
        level: 1,
        shards: 0,
        breakthrough: 0,
        awaken: 0,
        exp: 0,
        gear: {},
      })
      this.emit(`${def.name} 已拥有，兑换为 1 级同名武将`)
      return
    }
    this.save.owned.push({
      uid: newHeroUid(),
      heroId,
      level: 1,
      shards: 0,
      breakthrough: 0,
      awaken: 0,
      exp: 0,
      gear: {},
    })
    this.emit(`兑换到「${def.name}」`)
  }
}

export const store = new Store()
