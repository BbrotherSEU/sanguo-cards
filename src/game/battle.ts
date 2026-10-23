import { HERO_MAP, FACTION_LABEL } from '../data/heroes'
import { attackLine } from '../data/attackLine'
import { pickActive, unlockedSkills } from '../data/skills'
import type { OwnedEquip, OwnedHero, StageDef } from '../data/types'
import { enemyBreakthrough, squadSlots } from './squad'
import { calcStats, factionAuras, formationMods } from './stats'

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
  }
}

function strike(actor: Fighter, target: Fighter, mult: number): number {
  const hurt = dmg(actor.atk, target.def, mult)
  target.hp -= hurt
  if (target.hp <= 0) target.alive = false
  actor.dealt += hurt
  target.taken += hurt
  return hurt
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
    const passives = unlockedSkills(f.heroId, f.breakthrough).filter((s) => s.kind === 'passive')
    for (const sk of passives) {
      if (sk.fx === 'regen') {
        const weak = alive(friends).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]
        if (!weak || weak.hp >= weak.maxHp) continue
        const heal = Math.round(f.atk * (0.4 + sk.power))
        mend(f, weak, heal)
        push(log, allies, enemies, {
          kind: 'heal',
          text: `${f.name}【${sk.name}】治疗 ${weak.name} +${heal}`,
          actorId: f.uid,
          targetIds: [weak.uid],
          value: heal,
          fx: 'heal',
        })
      } else if (sk.fx === 'regen-all') {
        const wounded = alive(friends).filter((a) => a.hp < a.maxHp)
        if (!wounded.length) continue
        const heal = Math.round(f.atk * 0.28)
        const tids: string[] = []
        let total = 0
        for (const t of wounded) {
          mend(f, t, heal)
          tids.push(t.uid)
          total += heal
        }
        push(log, allies, enemies, {
          kind: 'heal',
          text: `${f.name}【${sk.name}】治疗我方全体 +${total}`,
          actorId: f.uid,
          targetIds: tids,
          value: total,
          fx: 'heal-all',
        })
      }
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

function makeEnemy(heroId: string, level: number, slot: number, bt = 0, aw = 0, uidPrefix = 'e'): Fighter {
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
  return makeFighter(owned, [], 'enemy', slot, 0, 0, 0)
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

  const outcome = runRounds(log, allies, enemies)
  if (outcome.win) {
    push(log, allies, enemies, { kind: 'win', text: `胜利！历经 ${outcome.rounds} 回合扫清敌军` })
  } else if (alive(allies).length) {
    push(log, allies, enemies, { kind: 'lose', text: '苦战超时，未能破敌' })
  } else {
    push(log, allies, enemies, { kind: 'lose', text: `战败……第 ${outcome.rounds} 回合全军覆没` })
  }
  return pack(outcome.win, log, outcome.rounds, allies, enemies)
}

/** 跑一整个遭遇战（单波），不推送胜负收尾事件，由调用方决定文案 */
function runRounds(log: BattleEvent[], allies: Fighter[], enemies: Fighter[]): { win: boolean; rounds: number } {
  let rounds = 0
  const maxRounds = 30

  while (rounds < maxRounds) {
    rounds += 1
    push(log, allies, enemies, { kind: 'round', text: `—— 第 ${rounds} 回合 ——` })
    tickRegen(log, allies, enemies)

    const order = [
      ...alive(allies).sort((a, b) => a.slot - b.slot),
      ...alive(enemies).sort((a, b) => a.slot - b.slot),
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

      const active = pickActive(f.heroId, f.breakthrough, alive(friends))
      const useSkill = !!active && (rounds % 3 === 0 || Math.random() < 0.34)
      if (useSkill && active) {
        if (active.fx === 'heal') {
          const weak = alive(friends).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]
          if (weak) {
            const heal = Math.round(f.atk * active.power)
            mend(f, weak, heal)
            push(log, allies, enemies, {
              kind: 'heal',
              text: `${f.name}【${active.name}】治疗 ${weak.name} +${heal}`,
              actorId: f.uid,
              targetIds: [weak.uid],
              value: heal,
              fx: 'heal',
            })
          }
        } else if (active.fx === 'heal-all') {
          const heal = Math.round(f.atk * active.power)
          const targets = alive(friends)
          const tids: string[] = []
          let total = 0
          for (const t of targets) {
            mend(f, t, heal)
            tids.push(t.uid)
            total += heal
          }
          push(log, allies, enemies, {
            kind: 'heal',
            text: `${f.name}【${active.name}】治疗我方全体 +${total}`,
            actorId: f.uid,
            targetIds: tids,
            value: total,
            fx: 'heal-all',
          })
        } else if (active.fx === 'burn') {
          const tick = Math.max(8, Math.round(f.atk * 0.2))
          const tids: string[] = []
          let total = 0
          for (const t of alive(foes)) {
            total += strike(f, t, active.power * 0.6)
            t.burn = Math.max(t.burn, 2)
            t.burnTick = Math.max(t.burnTick, tick)
            t.burnFrom = f.uid
            tids.push(t.uid)
          }
          push(log, allies, enemies, {
            kind: 'skill',
            text: `${f.name}【${active.name}】灼烧敌阵，造成 ${total} 伤害`,
            actorId: f.uid,
            targetIds: tids,
            value: total,
            fx: 'burn',
          })
        } else if (active.fx === 'poison') {
          const tick = Math.max(6, Math.round(f.atk * 0.16))
          const tids: string[] = []
          let total = 0
          for (const t of alive(foes)) {
            total += strike(f, t, active.power * 0.38)
            t.poison = Math.max(t.poison, 3)
            t.poisonTick = Math.max(t.poisonTick, tick)
            t.poisonFrom = f.uid
            tids.push(t.uid)
          }
          push(log, allies, enemies, {
            kind: 'skill',
            text: `${f.name}【${active.name}】施毒，造成 ${total} 伤害`,
            actorId: f.uid,
            targetIds: tids,
            value: total,
            fx: 'poison',
          })
        } else if (active.fx === 'control') {
          const t = pickFront(foes)
          if (t) {
            const hurt = strike(f, t, Math.max(0.4, active.power * 0.35))
            t.stun = Math.max(t.stun, 1)
            push(log, allies, enemies, {
              kind: 'skill',
              text: `${f.name}【${active.name}】控制 ${t.name} -${hurt}，下回合无法行动`,
              actorId: f.uid,
              targetIds: [t.uid],
              value: hurt,
              fx: 'control',
            })
          }
        } else if (active.fx === 'aoe') {
          const tids: string[] = []
          let total = 0
          for (const t of alive(foes)) {
            const hurt = strike(f, t, active.power)
            tids.push(t.uid)
            total += hurt
          }
          push(log, allies, enemies, {
            kind: 'skill',
            text: `${f.name}【${active.name}】扫过敌阵，共造成 ${total} 伤害`,
            actorId: f.uid,
            targetIds: tids,
            value: total,
            fx: 'aoe',
          })
        } else if (active.fx === 'execute') {
          const t = alive(foes).sort((a, b) => a.hp - b.hp)[0]
          if (t) {
            const hurt = strike(f, t, active.power)
            push(log, allies, enemies, {
              kind: 'skill',
              text: `${f.name}【${active.name}】锁定 ${t.name} -${hurt}`,
              actorId: f.uid,
              targetIds: [t.uid],
              value: hurt,
              fx: 'execute',
            })
          }
        } else {
          const t = pickFront(foes)
          if (t) {
            const hurt = strike(f, t, active.power)
            push(log, allies, enemies, {
              kind: 'skill',
              text: `${f.name}【${active.name}】重创 ${t.name} -${hurt}`,
              actorId: f.uid,
              targetIds: [t.uid],
              value: hurt,
              fx: 'strike',
            })
          }
        }
      } else {
        const t = pickFront(foes)
        if (t) {
          const line = attackLine(f.heroId)
          const targets = line ? expandLine(t, foes, line) : [t]
          let total = 0
          for (const foe of targets) {
            total += strike(f, foe, foe.uid === t.uid ? 1 : 0.62)
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
    enemies = waveIn.map((e, i) => makeEnemy(e.heroId, e.level, e.slot ?? slots[i] ?? i, 0, 0, `e${w}`))
    if (waves.length > 1) {
      push(log, allies, enemies, { kind: 'sys', text: `—— 第 ${w + 1} 波 · ${waveIn.length} 敌杀到 ——` })
    }
    const outcome = runRounds(log, allies, enemies)
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
