import { EQUIP_MAP } from '../data/equips'
import { BONDS, FACTION_LABEL, FACTION_TIERS, HERO_MAP } from '../data/heroes'
import { unlockedSkills } from '../data/skills'
import type { Faction, OwnedEquip, OwnedHero, SaveData } from '../data/types'

export function rarityMult(rarity: string): number {
  switch (rarity) {
    case 'SSR':
      return 1.35
    case 'SR':
      return 1.18
    case 'R':
      return 1.0
    default:
      return 0.9
  }
}

export function calcEquipBonus(owned: OwnedHero, bag: OwnedEquip[]) {
  let atk = 0
  let hp = 0
  let def = 0
  for (const uid of Object.values(owned.gear ?? {})) {
    if (!uid) continue
    const oe = bag.find((e) => e.uid === uid)
    if (!oe) continue
    const ed = EQUIP_MAP[oe.equipId]
    if (!ed) continue
    const grown = equipBonus(ed, oe.level, oe.forge ?? 0)
    atk += grown.atk
    hp += grown.hp
    def += grown.def
    const extra = exclusiveBonus(ed, oe.level, oe.forge ?? 0, owned.heroId)
    atk += extra.atk
    hp += extra.hp
    def += extra.def
  }
  return { atk, hp, def }
}

export function calcStats(owned: OwnedHero, bag: OwnedEquip[] = []) {
  const def = HERO_MAP[owned.heroId]
  if (!def) return { atk: 0, hp: 0, def: 0, power: 0 }
  const lv = owned.level
  const grow = 1 + (lv - 1) * 0.08
  const rm = rarityMult(def.rarity)
  const bt = 1 + (owned.breakthrough ?? 0) * 0.08
  const aw = 1 + (owned.awaken ?? 0) * 0.05
  const eq = calcEquipBonus(owned, bag)
  let atk = Math.round(def.atk * grow * rm * bt * aw + eq.atk)
  let hp = Math.round(def.hp * grow * rm * bt * aw + eq.hp)
  let defense = Math.round(def.def * grow * rm * bt * aw + eq.def)
  for (const sk of unlockedSkills(owned.heroId, owned.breakthrough ?? 0)) {
    if (sk.kind !== 'passive') continue
    if (sk.fx === 'passive-atk') atk = Math.round(atk * (1 + sk.power))
    if (sk.fx === 'passive-hp' || sk.fx === 'regen' || sk.fx === 'regen-all') hp = Math.round(hp * (1 + sk.power))
    if (sk.fx === 'passive-def') defense = Math.round(defense * (1 + sk.power))
  }
  const power = atk * 2 + hp * 0.15 + defense * 1.5 + (owned.breakthrough ?? 0) * 40 + (owned.awaken ?? 0) * 60
  return { atk, hp, def: defense, power: Math.round(power) }
}

export function activeBonds(heroIds: string[]) {
  const set = new Set(heroIds)
  return BONDS.filter((b) => b.heroes.every((id) => set.has(id)))
}

export type FactionAura = {
  faction: Faction
  count: number
  atk: number
  hp: number
  def: number
  active: boolean
  hint: string
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`
}

export function factionAuras(heroIds: string[]): FactionAura[] {
  const counts = new Map<Faction, number>()
  for (const id of heroIds) {
    const faction = HERO_MAP[id]?.faction
    if (!faction) continue
    counts.set(faction, (counts.get(faction) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([faction, count]) => {
      const tier = [...FACTION_TIERS].reverse().find((t) => count >= t.count)
      const next = FACTION_TIERS.find((t) => t.count > count)
      const label = FACTION_LABEL[faction]
      const hint = tier
        ? next
          ? `攻+${pct(tier.atk)} 生命+${pct(tier.hp)}${tier.def ? ` 防+${pct(tier.def)}` : ''} · 再上${next.count - count}名可提升`
          : `攻+${pct(tier.atk)} 生命+${pct(tier.hp)} 防+${pct(tier.def)} · 同阵已满`
        : `再上${(next?.count ?? 2) - count}名${label}激活阵营加成`
      return {
        faction,
        count,
        atk: tier?.atk ?? 0,
        hp: tier?.hp ?? 0,
        def: tier?.def ?? 0,
        active: !!tier,
        hint,
      }
    })
    .sort((a, b) => b.count - a.count)
}

export function formationMods(heroIds: string[]) {
  const bonds = activeBonds(heroIds)
  const factions = factionAuras(heroIds)
  return {
    bonds,
    factions,
    atk: bonds.reduce((s, b) => s + b.bonusAtk, 0) + factions.reduce((s, f) => s + f.atk, 0),
    hp: bonds.reduce((s, b) => s + b.bonusHp, 0) + factions.reduce((s, f) => s + f.hp, 0),
    def: factions.reduce((s, f) => s + f.def, 0),
  }
}

export function teamPower(save: SaveData): number {
  const units = save.team
    .map((uid) => save.owned.find((o) => o.uid === uid))
    .filter((o): o is OwnedHero => !!o)
  if (!units.length) return 0
  const mod = formationMods(units.map((u) => u.heroId))
  return units.reduce((sum, u) => {
    const s = calcStats(u, save.equips)
    const atk = s.atk * (1 + mod.atk)
    const hp = s.hp * (1 + mod.hp)
    const defense = s.def * (1 + mod.def)
    return sum + Math.round(atk * 2 + hp * 0.15 + defense * 1.5)
  }, 0)
}

export function autoLineup(save: SaveData): (string | null)[] {
  const scored = save.owned
    .map((o) => ({
      uid: o.uid,
      role: HERO_MAP[o.heroId]?.role ?? 'warrior',
      power: calcStats(o, save.equips).power,
    }))
    .sort((a, b) => b.power - a.power)
  const used = new Set<string>()
  const take = (pred: (role: string) => boolean, n: number) => {
    const picked = scored.filter((s) => !used.has(s.uid) && pred(s.role)).slice(0, n)
    picked.forEach((s) => used.add(s.uid))
    return picked
  }
  let front = take((role) => role === 'tank', 3)
  if (front.length < 3) front = front.concat(take((role) => role === 'warrior', 3 - front.length))
  if (front.length < 3) front = front.concat(take(() => true, 3 - front.length))
  const frontRank = (role: string) => (role === 'tank' ? 0 : role === 'warrior' ? 1 : 2)
  front.sort((a, b) => frontRank(a.role) - frontRank(b.role) || b.power - a.power)

  let back = take((role) => role === 'dps' || role === 'mage' || role === 'heal', 3)
  if (back.length < 3) back = back.concat(take(() => true, 3 - back.length))
  const backRank = (role: string) => (role === 'dps' ? 0 : role === 'mage' ? 1 : role === 'heal' ? 2 : 3)
  back.sort((a, b) => backRank(a.role) - backRank(b.role) || b.power - a.power)

  const slots: (string | null)[] = [null, null, null, null, null, null]
  front.forEach((p, i) => {
    slots[i] = p.uid
  })
  back.forEach((p, i) => {
    slots[3 + i] = p.uid
  })
  return slots
}

/** 突破 0 时上限 20 级，每突破一阶上限 +10 */
export function levelCap(breakthrough: number): number {
  return 20 + Math.max(0, breakthrough) * 10
}

export function levelUpCost(level: number): number {
  return 15 + level * 6
}

export function expForLevel(level: number): number {
  return 40 + level * 10
}

export function battleHeroExp(win: boolean): number {
  return win ? 36 : 12
}

export function expToNextPlayer(level: number): number {
  return 80 + level * 40
}

export function breakthroughCost(rarity: string, current: number): { shards: number; gold: number } {
  if (current <= 0) return { shards: 0, gold: 0 }
  const base = rarity === 'SSR' ? 20 : rarity === 'SR' ? 12 : 8
  return { shards: base + current * 4, gold: 200 + current * 180 }
}

export function awakenCost(star: number): { stones: number; shards: number; gold: number } {
  return {
    stones: 5 + star * 5,
    shards: 3 + star * 2,
    gold: 300 + star * 250,
  }
}

/** 升级每级 +18%，锻造每阶再 +6%，极品、良品另有品质系数。界面和战斗用同一套数。 */
export function equipBonus(def: { atk: number; hp: number; def: number; rarity?: string }, level: number, forge = 0) {
  const scale = equipScale(level, forge, def.rarity)
  return {
    atk: Math.round(def.atk * scale),
    hp: Math.round(def.hp * scale),
    def: Math.round(def.def * scale),
  }
}

export function exclusiveBonus(
  def: { exclusive?: { heroId: string; atk: number; hp: number; def: number } },
  level: number,
  forge: number,
  heroId?: string,
) {
  const ex = def.exclusive
  if (!ex || !heroId || ex.heroId !== heroId) return { atk: 0, hp: 0, def: 0 }
  const scale = equipScale(level, forge)
  return {
    atk: Math.round(ex.atk * scale),
    hp: Math.round(ex.hp * scale),
    def: Math.round(ex.def * scale),
  }
}

function equipScale(level: number, forge = 0, rarity?: string) {
  const grow = 1 + Math.max(0, level - 1) * 0.18
  const smith = 1 + Math.max(0, forge) * 0.06
  const quality = rarity === 'SSR' ? 1.12 : rarity === 'SR' ? 1.06 : 1
  return grow * smith * quality
}

/** 锻造 0 阶时只能升到 +20，每锻造一阶，等级上限 +4。满锻 20 阶上限 +100。 */
export function equipLevelCap(forge: number): number {
  return 20 + Math.max(0, forge) * 4
}

export const SMITH_CAP = 20
export const UPGRADE_CAP = equipLevelCap(SMITH_CAP)
export const FORGE_CAP = UPGRADE_CAP

export function upgradeCost(level: number): { gold: number; iron: number } {
  return {
    gold: 100 + level * 70,
    iron: 1 + Math.floor(level / 3),
  }
}

export function smithCost(forge: number): { gold: number; stones: number; iron: number } {
  return {
    gold: 180 + forge * 120,
    stones: 2 + forge,
    iron: 2 + Math.floor(forge / 2),
  }
}

export function forgeCost(level: number): { gold: number; stones: number; iron: number } {
  const cost = upgradeCost(level)
  return { gold: cost.gold, stones: 0, iron: cost.iron }
}

const SOUL_OUT: Record<string, number> = { SSR: 40, SR: 16, R: 6, N: 2 }
const SOUL_IN: Record<string, number> = { SSR: 100, SR: 40, R: 16, N: 8 }

export function soulFromHero(rarity: string, shards: number): number {
  return (SOUL_OUT[rarity] ?? 2) + Math.floor(shards / 5)
}

export function soulCost(rarity: string): number {
  return SOUL_IN[rarity] ?? 8
}
