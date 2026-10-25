import type { SkillCond, SkillFx, SkillTarget } from '../data/types'
import type { Fighter } from './battle'

/** 技能上下文：执行一个技能所需的战场信息 */
export type FxCtx = {
  actor: Fighter
  foes: Fighter[]
  friends: Fighter[]
  /** 敌方全体（不含已阵亡） */
  alive(foes: Fighter[]): Fighter[]
}

/** 技能效果处理器签名：返回产生的日志文案与目标 */
export type FxResult = {
  text: string
  targetIds: string[]
  value: number
  kind: 'skill' | 'heal'
}

/** 目标选择：按 target 枚举挑出目标 */
export function pickTargets(ctx: FxCtx, target: SkillTarget | undefined, fx: SkillFx): Fighter[] {
  const { actor, foes, friends } = ctx
  const aliveFoes = ctx.alive(foes)
  const aliveFriends = ctx.alive(friends)
  switch (target ?? defaultTarget(fx)) {
    case 'enemy-front':
      return aliveFoes.filter((f) => f.slot < 3).slice(0, 1)
    case 'enemy-low':
      return aliveFoes.slice().sort((a, b) => a.hp - b.hp).slice(0, 1)
    case 'enemy-back':
      return aliveFoes.filter((f) => f.slot >= 3).slice(0, 1)
    case 'enemy-all':
      return aliveFoes
    case 'enemy-random': {
      if (!aliveFoes.length) return []
      return [aliveFoes[Math.floor(Math.random() * aliveFoes.length)]]
    }
    case 'ally-low':
      return aliveFriends.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp).slice(0, 1)
    case 'ally-all':
      return aliveFriends
    case 'ally-other':
      return aliveFriends.filter((f) => f.uid !== actor.uid)
    case 'self':
      return [actor]
    default:
      return aliveFoes.slice(0, 1)
  }
}

function defaultTarget(fx: SkillFx): SkillTarget {
  switch (fx) {
    case 'aoe':
    case 'burn':
    case 'poison':
      return 'enemy-all'
    case 'heal':
      return 'ally-low'
    case 'heal-all':
      return 'ally-all'
    case 'execute':
      return 'enemy-low'
    case 'shield':
    case 'taunt':
      return 'self'
    case 'cleanse':
      return 'ally-other'
    default:
      return 'enemy-front'
  }
}

/** 条件判定：条件不满足时该技能不可用 */
export function condMet(cond: SkillCond | undefined, ctx: FxCtx): boolean {
  if (!cond || cond === 'always') return true
  const { actor, foes, friends } = ctx
  switch (cond) {
    case 'ally-hurt':
      return ctx.alive(friends).some((f) => f.hp < f.maxHp * 0.7)
    case 'self-burn':
      return actor.burn > 0
    case 'self-poison':
      return actor.poison > 0
    case 'enemy-burn':
      return ctx.alive(foes).some((f) => f.burn > 0)
    case 'enemy-control':
      return ctx.alive(foes).some((f) => f.stun > 0)
    case 'hp-high':
      return actor.hp >= actor.maxHp * 0.8
    case 'hp-low':
      return actor.hp <= actor.maxHp * 0.4
    case 'enemy-few':
      return ctx.alive(foes).length <= 2
    default:
      return true
  }
}

/** 条件说明文本，用于技能描述展示 */
export const COND_TEXT: Record<SkillCond, string> = {
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

/** 目标说明文本 */
export const TARGET_TEXT: Record<SkillTarget, string> = {
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

/** 被动效果的描述补充（用于 UI 展示副数值） */
export function passiveNote(fx: SkillFx, value: number | undefined): string {
  switch (fx) {
    case 'drain':
      return `普攻回复 ${Math.round((value ?? 0) * 100)}% 伤害量的生命`
    case 'passive-atk':
      return `攻击永久 +${Math.round((value ?? 0) * 100)}%`
    case 'passive-def':
      return `防御永久 +${Math.round((value ?? 0) * 100)}%`
    case 'passive-hp':
      return `生命永久 +${Math.round((value ?? 0) * 100)}%`
    default:
      return ''
  }
}
