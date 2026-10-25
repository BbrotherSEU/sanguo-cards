import { HERO_MAP, FACTION_LABEL } from '../data/heroes'
import { attackLine } from '../data/attackLine'
import { chooseSkill, unlockedSkills, type SkillContext } from '../data/skills'
import type { OwnedEquip, OwnedHero, StageDef } from '../data/types'
import { enemyBreakthrough, squadSlots } from './squad'
import { calcStats, factionAuras, formationMods } from './stats'
import { condMet } from './skillFx'
import { execSkill, makeCtx, tickPassive, type ExecHooks } from './skillExec'

export type Fighter = {
  uid: string
  heroId: string
  name: string
  side: 'ally' | 'enemy'
  hp: number
  maxHp: number
  atk: number
  def: number
  skill: string
  breakthrough: number
  divine: boolean
  /** 觉醒星数，决定觉醒技解锁 */
  awaken: number
  color: string
  alive: boolean
  /** 0 起，0–2 前排，3–5 后排 */
  slot: number
  dealt: number
  healed: number
  taken: number
  burn: number
  poison: number
  stun: number
  burnTick: number
  poisonTick: number
  burnFrom?: string
  poisonFrom?: string
  /** 护盾值：优先抵消伤害 */
  shield: number
  /** 标记：受到的伤害提高的比例 */
  mark: number
  markTurns: number
  /** 嘲讽来源，强制其优先攻击自己 */
  tauntBy?: string
  tauntTurns: number
  /** 破甲：防御降低比例 */
  defDown: number
  defDownTurns: number
  /** 削弱：攻击降低比例 */
  atkDown: number
  atkDownTurns: number
  /** 加速：行动顺序提前的档位 */
  haste: number
  hasteTurns: number
  /** 主动技已使用次数，按技能名记录 */
  skillUses: Record<string, number>
  /** 主动技冷却剩余回合，按技能名记录 */
  cooldowns: Record<string, number>
}

export type HpSnap = { uid: string; heroId: string; name: string; hp: number; maxHp: number; side: 'ally' | 'enemy'; color: string; slot: number }

export type BattleEvent = {
  text: string
  kind: 'hit' | 'skill' | 'heal' | 'sys' | 'win' | 'lose' | 'round' | 'combo'
  actorId?: string
  targetIds?: string[]
  value?: number
  comboName?: string
  fx?: string
  allies: HpSnap[]
  enemies: HpSnap[]
}

export type BattleReport = {
  uid: string
  heroId: string
  name: string
  side: 'ally' | 'enemy'
  dealt: number
  healed: number
  taken: number
}

export type BattleExpNote = {
  uid: string
  name: string
  gain: number
  levels: number
  capped: boolean
}

export type BattleResult = {
  win: boolean
  log: BattleEvent[]
  rounds: number
  allies: Fighter[]
  enemies: Fighter[]
  report: BattleReport[]
  exp: BattleExpNote[]
}

function snapSide(list: Fighter[]): HpSnap[] {
  return list.map((f) => ({
    uid: f.uid,
    heroId: f.heroId,
    name: f.name,
    hp: Math.max(0, f.hp),
    maxHp: f.maxHp,
    side: f.side,
    color: f.color,
    slot: f.slot,
  }))
}

function push(
  log: BattleEvent[],
  allies: Fighter[],
  enemies: Fighter[],
  partial: Omit<BattleEvent, 'allies' | 'enemies'>,
): void {
  log.push({
    ...partial,
    allies: snapSide(allies),
    enemies: snapSide(enemies),
  })
}

function makeFighter(
  owned: OwnedHero,
  bag: OwnedEquip[],
  side: 'ally' | 'enemy',
  slot: number,
  atkB: number,
  hpB: number,
  defB: number,
): Fighter {
  const def = HERO_MAP[owned.heroId]
  const s = calcStats(owned, bag)
  const atk = Math.round(s.atk * (1 + atkB))
  const hp = Math.round(s.hp * (1 + hpB))
  return {
    uid: owned.uid,
    heroId: owned.heroId,
    name: def.name,
    side,
    hp,
    maxHp: hp,
    atk,
    def: Math.round(s.def * (1 + defB)),
    skill: def.skill,
    breakthrough: owned.breakthrough ?? 0,
    divine: owned.divine ?? false,
    awaken: owned.awaken ?? 0,
    color: def.color,
    alive: true,
    slot,
    dealt: 0,
    healed: 0,
    taken: 0,
    burn: 0,
    poison: 0,
    stun: 0,
    burnTick: 0,
    poisonTick: 0,
    shield: 0,
    mark: 0,
    markTurns: 0,
    tauntTurns: 0,
    defDown: 0,
    defDownTurns: 0,
    atkDown: 0,
    atkDownTurns: 0,
    haste: 0,
    hasteTurns: 0,
    skillUses: {},
    cooldowns: {},
  }
}

/** 有效防御：受破甲影响 */
function effDef(target: Fighter): number {
  return Math.max(0, target.def * (1 - target.defDown))
}

/** 有效攻击：受削弱影响 */
function effAtk(actor: Fighter): number {
  return Math.max(1, actor.atk * (1 - actor.atkDown))
}

/** 技能执行器依赖的结算回调 */
const EXEC_HOOKS: ExecHooks = {
  hit: (actor, target, mult) => strike(actor, target, mult),
  mend: (actor, target, amount) => mend(actor, target, amount),
  effDef: (target) => effDef(target),
  effAtk: (actor) => effAtk(actor),
  randomFoe: (foes) => {
    const pool = alive(foes)
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : undefined
  },
}

function strike(actor: Fighter, target: Fighter, mult: number): number {
  const hurt = dmg(effAtk(actor), effDef(target), mult)
  return applyDamage(actor, target, hurt)
}

/** 结算伤害：先扣护盾，再扣生命 */
function applyDamage(actor: Fighter, target: Fighter, hurt: number): number {
  const real = Math.round(hurt * (1 + target.mark))
  let rest = real
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, rest)
    target.shield -= absorbed
    rest -= absorbed
  }
  target.hp -= rest
  if (target.hp <= 0) target.alive = false
  actor.dealt += real
  target.taken += rest
  return real
}

function mend(actor: Fighter, target: Fighter, amount: number): void {
  target.hp = Math.min(target.maxHp, target.hp + amount)
  actor.healed += amount
}

function findFighter(allies: Fighter[], enemies: Fighter[], uid?: string): Fighter | undefined {
  if (!uid) return undefined
  return [...allies, ...enemies].find((f) => f.uid === uid)
}

function tickRegen(log: BattleEvent[], allies: Fighter[], enemies: Fighter[]): void {
  for (const f of [...allies, ...enemies]) {
    if (!f.alive || f.hp <= 0) continue
    const friends = f.side === 'ally' ? allies : enemies
    const foes = f.side === 'ally' ? enemies : allies
    const passives = unlockedSkills(f.heroId, f.breakthrough, f.divine, f.awaken).filter((s) => s.kind === 'passive')
    for (const sk of passives) {
      const ctx = makeCtx(f, foes, friends)
      if (!condMet(sk.cond, ctx)) continue
      const res = tickPassive(sk, ctx, EXEC_HOOKS)
      if (!res) continue
      push(log, allies, enemies, {
        kind: res.kind,
        text: res.text,
        actorId: f.uid,
        targetIds: res.targetIds,
        value: res.value,
        fx: res.fx,
      })
    }
  }
}

/** 各回合结束时衰减持续状态 */
function tickStatus(allies: Fighter[], enemies: Fighter[]): void {
  for (const f of [...allies, ...enemies]) {
    if (f.markTurns > 0) {
      f.markTurns -= 1
      if (f.markTurns <= 0) f.mark = 0
    }
    if (f.tauntTurns > 0) {
      f.tauntTurns -= 1
      if (f.tauntTurns <= 0) f.tauntBy = undefined
    }
    if (f.defDownTurns > 0) {
      f.defDownTurns -= 1
      if (f.defDownTurns <= 0) f.defDown = 0
    }
    if (f.atkDownTurns > 0) {
      f.atkDownTurns -= 1
      if (f.atkDownTurns <= 0) f.atkDown = 0
    }
    if (f.hasteTurns > 0) {
      f.hasteTurns -= 1
      if (f.hasteTurns <= 0) f.haste = 0
    }
    for (const key of Object.keys(f.cooldowns)) {
      f.cooldowns[key] = Math.max(0, f.cooldowns[key] - 1)
    }
  }
}

function tickDots(log: BattleEvent[], allies: Fighter[], enemies: Fighter[]): void {
  for (const f of [...allies, ...enemies]) {
    if (!f.alive || f.hp <= 0) continue
    if (f.burn > 0) {
      const hurt = f.burnTick
      f.hp -= hurt
      f.taken += hurt
      const src = findFighter(allies, enemies, f.burnFrom)
      if (src) src.dealt += hurt
      f.burn -= 1
      if (f.hp <= 0) f.alive = false
      push(log, allies, enemies, {
        kind: 'skill',
        text: `${f.name} 受到灼烧 -${hurt}`,
        actorId: f.burnFrom,
        targetIds: [f.uid],
        value: hurt,
        fx: 'burn',
      })
    }
    if (!f.alive || f.hp <= 0 || f.poison <= 0) continue
    const hurt = f.poisonTick
    f.hp -= hurt
    f.taken += hurt
    const src = findFighter(allies, enemies, f.poisonFrom)
    if (src) src.dealt += hurt
    f.poison -= 1
    if (f.hp <= 0) f.alive = false
    push(log, allies, enemies, {
      kind: 'skill',
      text: `${f.name} 受到中毒 -${hurt}`,
      actorId: f.poisonFrom,
      targetIds: [f.uid],
      value: hurt,
      fx: 'poison',
    })
  }
}

function pack(win: boolean, log: BattleEvent[], rounds: number, allies: Fighter[], enemies: Fighter[]): BattleResult {
  const report = [...allies, ...enemies].map((f) => ({
    uid: f.uid,
    heroId: f.heroId,
    name: f.name,
    side: f.side,
    dealt: f.dealt,
    healed: f.healed,
    taken: f.taken,
  }))
  return { win, log, rounds, allies, enemies, report, exp: [] }
}

function makeEnemy(
  heroId: string,
  level: number,
  slot: number,
  bt = 0,
  aw = 0,
  uidPrefix = 'e',
  mult = 1,
): Fighter {
  const owned: OwnedHero = {
    uid: `${uidPrefix}_${slot}`,
    heroId,
    level,
    shards: 0,
    breakthrough: bt || enemyBreakthrough(level),
    awaken: aw,
    exp: 0,
    gear: {},
  }
  // 难度倍率直接作用在最终属性上
  const b = mult - 1
  return makeFighter(owned, [], 'enemy', slot, b, b, b)
}

function alive(list: Fighter[]) {
  return list.filter((f) => f.alive && f.hp > 0)
}

function pickFront(list: Fighter[]) {
  const a = alive(list)
  if (!a.length) return null
  const front = a.filter((f) => f.slot < 3)
  const pool = front.length ? front : a
  return pool.slice().sort((x, y) => x.slot - y.slot)[0]
}

/** 普攻目标：若敌方有被嘲讽者，优先攻击嘲讽来源 */
function pickTargetWithTaunt(foes: Fighter[]): Fighter | null {
  const taunted = alive(foes).find((f) => f.tauntTurns > 0 && f.tauntBy)
  if (taunted) return taunted
  return pickFront(foes)
}

/** 吸血被动比例：取自身被动技能中最高的 drain 比例 */
function drainRatioOf(f: Fighter): number {
  let best = 0
  for (const sk of unlockedSkills(f.heroId, f.breakthrough, f.divine, f.awaken)) {
    if (sk.kind === 'passive' && sk.fx === 'drain') best = Math.max(best, sk.value ?? 0)
  }
  return best
}

/** 主动技是否可用：受每场次数上限与冷却限制 */
function skillUsable(f: Fighter, sk: { name: string; uses?: number }): boolean {
  if ((f.cooldowns[sk.name] ?? 0) > 0) return false
  const limit = sk.uses ?? DEFAULT_USES
  return (f.skillUses[sk.name] ?? 0) < limit
}

/** 主动技每场默认释放次数 */
const DEFAULT_USES = 3

/** 构造技能选择用的战场情境 */
function skillCtxOf(f: Fighter, allies: Fighter[], enemies: Fighter[]): SkillContext {
  const friends = f.side === 'ally' ? allies : enemies
  const foes = f.side === 'ally' ? enemies : allies
  const pack = (list: Fighter[]) =>
    list.map((x) => ({ hp: x.hp, maxHp: x.maxHp, slot: x.slot, burn: x.burn, poison: x.poison, stun: x.stun }))
  return {
    hp: f.hp,
    maxHp: f.maxHp,
    allies: pack(friends),
    enemies: pack(foes),
  }
}

function expandLine(primary: Fighter, foes: Fighter[], line: 'row' | 'col'): Fighter[] {
  const mates = alive(foes).filter((t) =>
    line === 'row' ? t.slot % 3 === primary.slot % 3 : (t.slot < 3) === (primary.slot < 3),
  )
  if (!mates.some((t) => t.uid === primary.uid)) mates.unshift(primary)
  return mates
}

function dmg(atk: number, def: number, mult = 1) {
  const raw = atk * mult - def * 0.35
  return Math.max(8, Math.round(raw * (0.9 + Math.random() * 0.25)))
}

export type BattleUnit = {
  owned: OwnedHero
  slot: number
}

export type BattleTeamInput = {
  heroes: BattleUnit[]
  bag?: OwnedEquip[]
}

export function simulateBattle(
  team: BattleTeamInput,
  enemiesIn: { heroId: string; level: number; breakthrough?: number; awaken?: number; slot?: number }[],
  title?: string,
): BattleResult {
  const bag = team.bag ?? []
  const ids = team.heroes.map((t) => t.owned.heroId)
  const mod = formationMods(ids)
  const auras = factionAuras(ids).filter((f) => f.active)

  const allies = team.heroes.map((t) => makeFighter(t.owned, bag, 'ally', t.slot, mod.atk, mod.hp, mod.def))
  const slots = squadSlots(enemiesIn.length)
  const enemies = enemiesIn.map((e, i) => makeEnemy(e.heroId, e.level, e.slot ?? slots[i] ?? i, e.breakthrough ?? 0, e.awaken ?? 0))
  const log: BattleEvent[] = []

  push(log, allies, enemies, {
    kind: 'sys',
    text: title ? `开战：${title}` : '两军对阵，战鼓擂动！',
  })

  if (mod.bonds.length) {
    push(log, allies, enemies, {
      kind: 'sys',
      text: `羁绊：${mod.bonds.map((b) => `${b.name} 攻+${Math.round(b.bonusAtk * 100)}% 生命+${Math.round(b.bonusHp * 100)}%`).join('，')}`,
    })
  }
  if (auras.length) {
    push(log, allies, enemies, {
      kind: 'sys',
      text: `阵营：${auras.map((f) => `${FACTION_LABEL[f.faction]}×${f.count} ${f.hint.split(' · ')[0]}`).join('，')}`,
    })
  }

  const outcome = runRounds(log, allies, enemies, mod.bonds)
  if (outcome.win) {
    push(log, allies, enemies, { kind: 'win', text: `胜利！历经 ${outcome.rounds} 回合扫清敌军` })
  } else if (alive(allies).length) {
    push(log, allies, enemies, { kind: 'lose', text: '苦战超时，未能破敌' })
  } else {
    push(log, allies, enemies, { kind: 'lose', text: `战败……第 ${outcome.rounds} 回合全军覆没` })
  }
  return pack(outcome.win, log, outcome.rounds, allies, enemies)
}

/** 合击：羁绊成员满员且存活时发动，对敌方全体造成合击伤害 */
function tickCombo(
  log: BattleEvent[],
  allies: Fighter[],
  enemies: Fighter[],
  bonds: { id: string; name: string; heroes: string[]; combo: string; comboMult: number }[],
): void {
  const foeList = alive(enemies)
  if (!foeList.length) return
  for (const bond of bonds) {
    // 需要该羁绊全部成员都在场
    const members = bond.heroes
      .map((hid) => allies.find((a) => a.heroId === hid))
      .filter((a): a is Fighter => !!a)
    if (members.length < bond.heroes.length) continue
    const aliveMembers = members.filter((m) => m.alive && m.hp > 0)
    if (aliveMembers.length < 2) continue
    // 取两名最强成员出手
    const casters = aliveMembers.sort((a, b) => b.atk - a.atk).slice(0, 2)
    const avgAtk = casters.reduce((s, c) => s + effAtk(c), 0) / casters.length
    const mult = bond.comboMult
    let total = 0
    const ids: string[] = []
    for (const t of foeList) {
      const hurt = Math.max(8, Math.round(avgAtk * mult - effDef(t) * 0.2))
      const real = applyDamage(casters[0], t, hurt)
      total += real
      ids.push(t.uid)
    }
    // 伤害统计分摊给两名施术者
    const share = Math.round(total / casters.length)
    casters[0].dealt = Math.max(0, casters[0].dealt - total) + share
    if (casters[1]) casters[1].dealt += share
    push(log, allies, enemies, {
      kind: 'combo',
      text: `羁绊合击【${bond.combo}】！${casters.map((c) => c.name).join('、')}合力攻敌，共造成 ${total} 伤害`,
      actorId: casters[0].uid,
      targetIds: ids,
      value: total,
      comboName: bond.combo,
      fx: 'combo',
    })
    return
  }
}

/** 跑一个整个遭遇战（单波），不推送胜负收尾事件，由调用方决定文案 */
function runRounds(
  log: BattleEvent[],
  allies: Fighter[],
  enemies: Fighter[],
  bonds: { id: string; name: string; heroes: string[]; combo: string; comboMult: number }[] = [],
): { win: boolean; rounds: number } {
  let rounds = 0
  const maxRounds = 30

  while (rounds < maxRounds) {
    rounds += 1
    push(log, allies, enemies, { kind: 'round', text: `—— 第 ${rounds} 回合 ——` })
    tickRegen(log, allies, enemies)
    // 合击：羁绊满员时每隔数回合发动一次
    if (rounds % 4 === 2) tickCombo(log, allies, enemies, bonds)

    const order = [
      ...alive(allies).sort((a, b) => a.haste - b.haste || a.slot - b.slot),
      ...alive(enemies).sort((a, b) => a.haste - b.haste || a.slot - b.slot),
    ]

    for (const f of order) {
      if (!f.alive || f.hp <= 0) continue
      if (f.stun > 0) {
        f.stun -= 1
        push(log, allies, enemies, {
          kind: 'skill',
          text: `${f.name} 被控制，无法行动`,
          actorId: f.uid,
          fx: 'control',
        })
        continue
      }
      const foes = f.side === 'ally' ? enemies : allies
      const friends = f.side === 'ally' ? allies : enemies
      if (!alive(foes).length) break

      const ctx = makeCtx(f, foes, friends)
      const active = chooseSkill(f.heroId, f.breakthrough, skillCtxOf(f, allies, enemies), f.divine, f.awaken)
      const canUse = !!active && skillUsable(f, active)
      const useSkill = canUse && (rounds % 3 === 0 || Math.random() < 0.34)
      if (useSkill && active) {
        // 记录使用次数与冷却
        f.skillUses[active.name] = (f.skillUses[active.name] ?? 0) + 1
        if (active.cooldown) f.cooldowns[active.name] = active.cooldown
        const res = execSkill(active, ctx, EXEC_HOOKS)
        if (res) {
          push(log, allies, enemies, {
            kind: res.kind,
            text: res.text,
            actorId: f.uid,
            targetIds: res.targetIds,
            value: res.value,
            fx: res.fx,
          })
        }
      } else {
        const t = pickTargetWithTaunt(foes)
        if (t) {
          const line = attackLine(f.heroId)
          const targets = line ? expandLine(t, foes, line) : [t]
          let total = 0
          for (const foe of targets) {
            total += strike(f, foe, foe.uid === t.uid ? 1 : 0.62)
          }
          // 吸血被动：普攻按比例回血
          const drainRatio = drainRatioOf(f)
          if (drainRatio > 0 && total > 0) {
            const back = Math.round(total * drainRatio)
            mend(f, f, back)
          }
          push(log, allies, enemies, {
            kind: 'hit',
            text: line ? `${f.name} ${line === 'row' ? '横排' : '竖排'} -${total}` : `${f.name} 普攻 ${t.name} -${total}`,
            actorId: f.uid,
            targetIds: targets.map((foe) => foe.uid),
            value: total,
            fx: line === 'row' ? 'line-row' : line === 'col' ? 'line-col' : 'strike',
          })
        }
      }

      if (!alive(enemies).length || !alive(allies).length) break
    }

    tickDots(log, allies, enemies)
    tickStatus(allies, enemies)

    if (!alive(enemies).length) return { win: true, rounds }
    if (!alive(allies).length) return { win: false, rounds }
  }

  return { win: false, rounds }
}

export function simulateStageBattle(
  team: BattleUnit[],
  bag: OwnedEquip[],
  stage: StageDef,
): BattleResult {
  const waves = stage.waves?.length ? stage.waves : [stage.enemies]
  const ids = team.map((t) => t.owned.heroId)
  const mod = formationMods(ids)
  const auras = factionAuras(ids).filter((f) => f.active)
  const allies = team.map((t) => makeFighter(t.owned, bag, 'ally', t.slot, mod.atk, mod.hp, mod.def))
  const log: BattleEvent[] = []
  let enemies: Fighter[] = []

  push(log, allies, enemies, {
    kind: 'sys',
    text: `开战：${stage.name}${waves.length > 1 ? `（共 ${waves.length} 波敌军）` : ''}`,
  })
  if (mod.bonds.length) {
    push(log, allies, enemies, {
      kind: 'sys',
      text: `羁绊：${mod.bonds.map((b) => `${b.name} 攻+${Math.round(b.bonusAtk * 100)}% 生命+${Math.round(b.bonusHp * 100)}%`).join('，')}`,
    })
  }
  if (auras.length) {
    push(log, allies, enemies, {
      kind: 'sys',
      text: `阵营：${auras.map((f) => `${FACTION_LABEL[f.faction]}×${f.count} ${f.hint.split(' · ')[0]}`).join('，')}`,
    })
  }

  let totalRounds = 0
  for (let w = 0; w < waves.length; w++) {
    const waveIn = waves[w]
    const slots = squadSlots(waveIn.length)
    enemies = waveIn.map((e, i) =>
      makeEnemy(e.heroId, e.level, e.slot ?? slots[i] ?? i, e.bt ?? 0, e.aw ?? 0, `e${w}`, e.mult ?? 1),
    )
    if (waves.length > 1) {
      push(log, allies, enemies, { kind: 'sys', text: `—— 第 ${w + 1} 波 · ${waveIn.length} 敌杀到 ——` })
    }
    const outcome = runRounds(log, allies, enemies, mod.bonds)
    totalRounds += outcome.rounds
    if (!outcome.win) {
      const reason = alive(allies).length ? '苦战超时，未能破敌' : '全军覆没'
      push(log, allies, enemies, {
        kind: 'lose',
        text: waves.length > 1 ? `战败……止步于第 ${w + 1} 波，${reason}` : `战败……${reason}`,
      })
      return pack(false, log, totalRounds, allies, enemies)
    }
    if (w < waves.length - 1) {
      // 波次间隙：存活武将恢复 15% 生命，清除持续伤害与控制
      for (const a of alive(allies)) {
        a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.15))
        a.burn = 0
        a.poison = 0
        a.stun = 0
      }
      push(log, allies, enemies, { kind: 'sys', text: `击溃第 ${w + 1} 波！稍事休整，下一波敌军正在逼近` })
    }
  }

  push(log, allies, enemies, {
    kind: 'win',
    text: waves.length > 1 ? `胜利！历经 ${totalRounds} 回合，连破 ${waves.length} 波敌军` : `胜利！历经 ${totalRounds} 回合扫清敌军`,
  })
  return pack(true, log, totalRounds, allies, enemies)
}
