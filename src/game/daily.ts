import type { SaveData } from '../data/types'
import { todayKey } from './shop'

/** 每天领一次。数量按消耗来：够养阵容，阵营十连仍要攒很多天。 */
export const DAILY_GRANT = {
  gold: 1200,
  jade: 60,
  tickets: 3,
  seals: 40,
  awakenStone: 2,
  forgeStone: 3,
  soul: 8,
  arenaTickets: 5,
}

export const DAILY_SWEEPS = 8
export const ARENA_TICKET_CAP = 12

export function rollDaily(save: SaveData): boolean {
  const day = todayKey()
  if (save.dailyDay === day) return false
  save.dailyDay = day
  save.dailyClaimed = false
  save.sweepsLeft = DAILY_SWEEPS
  return true
}

export function applyDailyGrant(save: SaveData): void {
  save.gold += DAILY_GRANT.gold
  save.jade += DAILY_GRANT.jade
  save.tickets += DAILY_GRANT.tickets
  save.seals = (save.seals ?? 0) + DAILY_GRANT.seals
  save.awakenStone += DAILY_GRANT.awakenStone
  save.forgeStone += DAILY_GRANT.forgeStone
  save.soul = (save.soul ?? 0) + DAILY_GRANT.soul
  save.arenaTickets = Math.min(ARENA_TICKET_CAP, save.arenaTickets + DAILY_GRANT.arenaTickets)
  save.dailyClaimed = true
}
