import { EQUIPS } from '../data/equips'

export type EquipPull = { id: string; rarity: string }

const COST: Record<number, number> = { 1: 1, 10: 9 }

export function equipPullCost(count: number): number {
  return COST[count] ?? count
}

/** 十连第 10 次未出 SR 时保底。抽到 SR 或 SSR 后保底计数清零。 */
export function rollEquips(count: number, pity: number): { items: EquipPull[]; pity: number } {
  const items: EquipPull[] = []
  let left = pity
  const pulls = count === 10 ? 10 : 1
  for (let i = 0; i < pulls; i++) {
    left += 1
    const roll = Math.random() * 100
    let rarity = 'R'
    if (roll < 8) rarity = 'SSR'
    else if (roll < 30) rarity = 'SR'
    if (left >= 10 && rarity === 'R') rarity = Math.random() < 0.25 ? 'SSR' : 'SR'
    if (rarity !== 'R') left = 0
    const pool = EQUIPS.filter((eq) => eq.rarity === rarity)
    const pick = pool[Math.floor(Math.random() * pool.length)]
    if (pick) items.push({ id: pick.id, rarity: pick.rarity })
  }
  return { items, pity: left }
}
