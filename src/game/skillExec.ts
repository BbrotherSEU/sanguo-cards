import type { HeroSkill } from '../data/types'
import type { Fighter } from './battle'
import { pickTargets, type FxCtx } from './skillFx'

export type ExecResult = {
  text: string
  targetIds: string[]
  value: number
  kind: 'skill' | 'heal'
  fx: string
}

/** 上下文构造：把战场两侧交给效果执行器 */
export function makeCtx(actor: Fighter, foes: Fighter[], friends: Fighter[]): FxCtx {
  return {
    actor,
    foes,
    friends,
    alive: (list: Fighter[]) => list.filter((f) => f.alive && f.hp > 0),
  }
}

/** 依赖 battle.ts 内部结算能力的回调 */
export type ExecHooks = {
  /** 造成伤害：返回实际伤害 */
  hit(actor: Fighter, target: Fighter, mult: number): number
  /** 治疗 */
  mend(actor: Fighter, target: Fighter, amount: number): void
  /** 目标当前有效防御 */
  effDef(target: Fighter): number
  /** 目标当前有效攻击 */
  effAtk(actor: Fighter): number
  /** 敌方随机取一个存活目标 */
  randomFoe(foes: Fighter[]): Fighter | undefined
}

/**
 * 执行一个主动技能，返回战斗事件描述。
 * 所有新机制效果都收敛到这里，runRounds 只负责调用。
 */
export function execSkill(
  sk: HeroSkill,
  ctx: FxCtx,
  h: ExecHooks,
): ExecResult | null {
  const { actor } = ctx
  const power = sk.power
  const value = sk.value ?? 0
  const targets = pickTargets(ctx, sk.target, sk.fx)
  if (!targets.length && sk.fx !== 'cleanse') return null

  switch (sk.fx) {
    // ── 基础伤害 ──
    case 'strike': {
      const t = targets[0]
      if (!t) return null
      const hurt = h.hit(actor, t, power)
      return { text: `${actor.name}【${sk.name}】重创 ${t.name} -${hurt}`, targetIds: [t.uid], value: hurt, kind: 'skill', fx: 'strike' }
    }
    case 'aoe': {
      let total = 0
      const ids: string[] = []
      for (const t of targets) {
        total += h.hit(actor, t, power)
        ids.push(t.uid)
      }
      return { text: `${actor.name}【${sk.name}】扫过敌阵，共造成 ${total} 伤害`, targetIds: ids, value: total, kind: 'skill', fx: 'aoe' }
    }
    case 'execute': {
      const t = targets[0]
      if (!t) return null
      const hurt = h.hit(actor, t, power)
      return { text: `${actor.name}【${sk.name}】锁定 ${t.name} -${hurt}`, targetIds: [t.uid], value: hurt, kind: 'skill', fx: 'execute' }
    }
    case 'chain': {
      // 连击：弹射到 N 个目标，每次衰减
      const count = Math.max(2, Math.round(value || 3))
      const pool = ctx.alive(ctx.foes).slice()
      let total = 0
      const ids: string[] = []
      let mult = power
      for (let i = 0; i < count && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length)
        const t = pool.splice(idx, 1)[0]
        total += h.hit(actor, t, mult)
        ids.push(t.uid)
        mult *= 0.72
      }
      return { text: `${actor.name}【${sk.name}】连击 ${ids.length} 次，共造成 ${total} 伤害`, targetIds: ids, value: total, kind: 'skill', fx: 'chain' }
    }
    case 'absorb': {
      let total = 0
      const ids: string[] = []
      for (const t of targets) {
        const hurt = h.hit(actor, t, power)
        total += hurt
        ids.push(t.uid)
      }
      // 伤害的 40% 转化为治疗
      const heal = Math.round(total * 0.4)
      h.mend(actor, actor, heal)
      return { text: `${actor.name}【${sk.name}】吸取 ${total} 伤害，回复 ${heal} 生命`, targetIds: ids, value: total, kind: 'skill', fx: 'absorb' }
    }
    case 'sunder': {
      // 削减：直接削减目标最大生命
      const t = targets[0]
      if (!t) return null
      const cut = Math.max(1, Math.round(t.maxHp * power))
      t.maxHp = Math.max(1, t.maxHp - cut)
      t.hp = Math.max(0, t.hp - cut)
      if (t.hp <= 0) t.alive = false
      actor.dealt += cut
      t.taken += cut
      return { text: `${actor.name}【${sk.name}】削减 ${t.name} 生命上限 ${cut}`, targetIds: [t.uid], value: cut, kind: 'skill', fx: 'sunder' }
    }

    // ── 持续伤害 ──
    case 'burn': {
      const tick = Math.max(8, Math.round(h.effAtk(actor) * 0.2))
      const turn = Math.max(1, Math.round(value || 2))
      let total = 0
      const ids: string[] = []
      for (const t of targets) {
        total += h.hit(actor, t, power * 0.6)
        t.burn = Math.max(t.burn, turn)
        t.burnTick = Math.max(t.burnTick, tick)
        t.burnFrom = actor.uid
        ids.push(t.uid)
      }
      return { text: `${actor.name}【${sk.name}】灼烧敌阵，造成 ${total} 伤害`, targetIds: ids, value: total, kind: 'skill', fx: 'burn' }
    }
    case 'poison': {
      const tick = Math.max(6, Math.round(h.effAtk(actor) * 0.16))
      const turn = Math.max(1, Math.round(value || 3))
      let total = 0
      const ids: string[] = []
      for (const t of targets) {
        total += h.hit(actor, t, power * 0.38)
        t.poison = Math.max(t.poison, turn)
        t.poisonTick = Math.max(t.poisonTick, tick)
        t.poisonFrom = actor.uid
        ids.push(t.uid)
      }
      return { text: `${actor.name}【${sk.name}】施毒，造成 ${total} 伤害`, targetIds: ids, value: total, kind: 'skill', fx: 'poison' }
    }

    // ── 控制与增益减益 ──
    case 'control': {
      const t = targets[0]
      if (!t) return null
      const hurt = h.hit(actor, t, Math.max(0.4, power * 0.35))
      const turn = Math.max(1, Math.round(value || 1))
      t.stun = Math.max(t.stun, turn)
      return { text: `${actor.name}【${sk.name}】控制 ${t.name} -${hurt}，${turn} 回合无法行动`, targetIds: [t.uid], value: hurt, kind: 'skill', fx: 'control' }
    }
    case 'taunt': {
      const t = targets[0]
      if (!t) return null
      const turn = Math.max(1, Math.round(value || 1))
      t.tauntBy = actor.uid
      t.tauntTurns = turn
      return { text: `${actor.name}【${sk.name}】怒喝 ${t.name}，${turn} 回合被迫攻击自己`, targetIds: [t.uid], value: turn, kind: 'skill', fx: 'taunt' }
    }
    case 'pierce': {
      const t = targets[0]
      if (!t) return null
      const turn = Math.max(1, Math.round(value || 2))
      const ratio = Math.min(0.75, power)
      t.defDown = Math.max(t.defDown, ratio)
      t.defDownTurns = Math.max(t.defDownTurns, turn)
      const hurt = h.hit(actor, t, 0.3)
      return { text: `${actor.name}【${sk.name}】破甲 ${t.name}，防御降低 ${Math.round(ratio * 100)}%`, targetIds: [t.uid], value: hurt, kind: 'skill', fx: 'pierce' }
    }
    case 'weaken': {
      const t = targets[0]
      if (!t) return null
      const turn = Math.max(1, Math.round(value || 2))
      const ratio = Math.min(0.75, power)
      t.atkDown = Math.max(t.atkDown, ratio)
      t.atkDownTurns = Math.max(t.atkDownTurns, turn)
      return { text: `${actor.name}【${sk.name}】削弱 ${t.name}，攻击降低 ${Math.round(ratio * 100)}%`, targetIds: [t.uid], value: turn, kind: 'skill', fx: 'weaken' }
    }
    case 'mark': {
      const t = targets[0]
      if (!t) return null
      const turn = Math.max(1, Math.round(value || 2))
      const ratio = Math.min(0.6, power)
      t.mark = Math.max(t.mark, ratio)
      t.markTurns = Math.max(t.markTurns, turn)
      return { text: `${actor.name}【${sk.name}】标记 ${t.name}，其受到的伤害提高 ${Math.round(ratio * 100)}%`, targetIds: [t.uid], value: turn, kind: 'skill', fx: 'mark' }
    }
    case 'haste': {
      const turn = Math.max(1, Math.round(value || 2))
      const ids: string[] = []
      for (const t of targets) {
        t.haste = Math.max(t.haste, 1)
        t.hasteTurns = Math.max(t.hasteTurns, turn)
        ids.push(t.uid)
      }
      return { text: `${actor.name}【${sk.name}】疾风加持，友军行动加快`, targetIds: ids, value: turn, kind: 'skill', fx: 'haste' }
    }

    // ── 治疗与护盾 ──
    case 'heal': {
      const t = targets[0]
      if (!t) return null
      const heal = Math.round(h.effAtk(actor) * power)
      h.mend(actor, t, heal)
      return { text: `${actor.name}【${sk.name}】治疗 ${t.name} +${heal}`, targetIds: [t.uid], value: heal, kind: 'heal', fx: 'heal' }
    }
    case 'heal-all': {
      const heal = Math.round(h.effAtk(actor) * power)
      const ids: string[] = []
      let total = 0
      for (const t of targets) {
        h.mend(actor, t, heal)
        ids.push(t.uid)
        total += heal
      }
      return { text: `${actor.name}【${sk.name}】治疗我方全体 +${total}`, targetIds: ids, value: total, kind: 'heal', fx: 'heal-all' }
    }
    case 'shield': {
      const ids: string[] = []
      let total = 0
      for (const t of targets) {
        const amount = Math.round(h.effAtk(actor) * power)
        t.shield += amount
        ids.push(t.uid)
        total += amount
      }
      return { text: `${actor.name}【${sk.name}】凝聚护盾 +${total}`, targetIds: ids, value: total, kind: 'skill', fx: 'shield' }
    }
    case 'cleanse': {
      const ids: string[] = []
      let n = 0
      for (const t of targets) {
        if (t.burn > 0) {
          t.burn = 0
          t.burnTick = 0
          n += 1
        }
        if (t.poison > 0) {
          t.poison = 0
          t.poisonTick = 0
          n += 1
        }
        if (t.stun > 0) {
          t.stun = 0
          n += 1
        }
        if (t.atkDown > 0) {
          t.atkDown = 0
          t.atkDownTurns = 0
        }
        if (t.defDown > 0) {
          t.defDown = 0
          t.defDownTurns = 0
        }
        ids.push(t.uid)
      }
      if (!n) return null
      return { text: `${actor.name}【${sk.name}】驱散友军 ${n} 层负面状态`, targetIds: ids, value: n, kind: 'skill', fx: 'cleanse' }
    }

    default:
      return null
  }
}

/** 被动效果每回合结算：返回是否产生了事件 */
export function tickPassive(
  sk: HeroSkill,
  ctx: FxCtx,
  h: ExecHooks,
): ExecResult | null {
  const { actor } = ctx
  switch (sk.fx) {
    case 'regen': {
      const weak = ctx.alive(ctx.friends).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]
      if (!weak || weak.hp >= weak.maxHp) return null
      const heal = Math.round(h.effAtk(actor) * (0.4 + sk.power))
      h.mend(actor, weak, heal)
      return { text: `${actor.name}【${sk.name}】治疗 ${weak.name} +${heal}`, targetIds: [weak.uid], value: heal, kind: 'heal', fx: 'heal' }
    }
    case 'regen-all': {
      const wounded = ctx.alive(ctx.friends).filter((a) => a.hp < a.maxHp)
      if (!wounded.length) return null
      const heal = Math.round(h.effAtk(actor) * 0.28)
      const ids: string[] = []
      let total = 0
      for (const t of wounded) {
        h.mend(actor, t, heal)
        ids.push(t.uid)
        total += heal
      }
      return { text: `${actor.name}【${sk.name}】治疗我方全体 +${total}`, targetIds: ids, value: total, kind: 'heal', fx: 'heal-all' }
    }
    case 'drain': {
      // 吸血是被动标记，实际在普攻结算时生效，这里不产生事件
      return null
    }
    default:
      return null
  }
}
