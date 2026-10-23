import { HEROES } from '../data/heroes'
import type { Faction, HeroDef, OwnedHero, Rarity, SaveData } from '../data/types'
import { newHeroUid } from './save'

/** 试玩阶段：全阵营抽卡不耗资源。阵营招募始终消耗阵符。 */
export const GACHA_FREE = true

export const FACTION_PULL_COST: Record<1 | 10, number> = { 1: 80, 10: 680 }

const POOL = HEROES.filter((h) => h.rarity !== 'N')

function pickRarity(pity: number): Rarity {
  if (pity >= 29) return 'SSR'
  const roll = Math.random() * 100
  if (roll < 8 || (pity >= 20 && roll < 18)) return 'SSR'
  if (roll < 38) return 'SR'
  return 'R'
}

export function rollHero(pity: number, faction?: Faction | null): { hero: HeroDef; pity: number } {
  const rarity = pickRarity(pity)
  const scoped = faction ? POOL.filter((h) => h.faction === faction) : POOL
  const pool = scoped.filter((h) => h.rarity === rarity)
  const hero = (pool.length ? pool : scoped)[Math.floor(Math.random() * (pool.length ? pool.length : scoped.length))] ?? POOL[0]
  const nextPity = hero.rarity === 'SSR' ? 0 : pity + 1
  return { hero, pity: nextPity }
}

export type PullResult = {
  hero: HeroDef
  isNew: boolean
  owned: OwnedHero
}

export function applyPull(
  save: SaveData,
  count: 1 | 10,
  faction?: Faction | null,
): { save: SaveData; results: PullResult[] } {
  const sealCost = faction ? FACTION_PULL_COST[count] : 0
  const costTickets = count
  const costJade = count === 10 ? 250 : 30
  const useTickets = !GACHA_FREE && !faction && save.tickets >= costTickets

  if (faction) {
    if ((save.seals ?? 0) < sealCost) throw new Error(`阵符不足（需${sealCost}）`)
  } else if (!GACHA_FREE) {
    if (useTickets) {
      if (save.tickets < costTickets) throw new Error('招募令不足')
    } else if (save.jade < costJade) {
      throw new Error('元宝不足')
    }
  }

  const next = structuredClone(save)
  if (faction) next.seals = (next.seals ?? 0) - sealCost
  else if (!GACHA_FREE) {
    if (useTickets) next.tickets -= costTickets
    else next.jade -= costJade
  }

  const results: PullResult[] = []
  for (let i = 0; i < count; i++) {
    const { hero, pity } = rollHero(next.pity, faction)
    next.pity = pity
    next.pullCount += 1

    const existing = next.owned.find((o) => o.heroId === hero.id)
    if (existing) {
      existing.shards += 10
      results.push({ hero, isNew: false, owned: existing })
    } else {
      const owned: OwnedHero = {
        uid: newHeroUid(),
        heroId: hero.id,
        level: 1,
        shards: 0,
        breakthrough: 0,
        awaken: 0,
        exp: 0,
        gear: {},
      }
      next.owned.push(owned)
      results.push({ hero, isNew: true, owned })
    }
  }

  return { save: next, results }
}
