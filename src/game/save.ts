import { EQUIP_MAP, GRANTED_EXCLUSIVES } from '../data/equips'
import type { EquipSlot, OwnedEquip, OwnedHero, SaveData } from '../data/types'
import { pushSave } from './account'
import { DAILY_SWEEPS, rollDaily } from './daily'
import { ensureShop, generateOffers, todayKey } from './shop'

const KEY = 'sanguo-cards-save-v2'
const SAVE_VERSION = 6
const WALLET_FULL_KEY = 'sanguo-wallet-full-v2'
const WALLET_FULL = 9999999
const EXCLUSIVE_KEY = 'sanguo-exclusive-arms'
let walletFullPending = false
let exclusivePending = false

function normalizeEquip(e: { uid: string; equipId: string; level?: number; forge?: number }): OwnedEquip {
  return {
    uid: e.uid,
    equipId: e.equipId,
    level: e.level && e.level > 0 ? e.level : 1,
    forge: e.forge ?? 0,
  }
}

function grantExclusiveArms(save: SaveData) {
  for (const id of GRANTED_EXCLUSIVES) {
    if (save.equips.some((item) => item.equipId === id)) continue
    save.equips.push({ uid: uid(), equipId: id, level: 1, forge: 0 })
  }
}

function fillWallet(save: SaveData) {
  save.gold = Math.max(save.gold, WALLET_FULL)
  save.jade = Math.max(save.jade, WALLET_FULL)
  save.tickets = Math.max(save.tickets, WALLET_FULL)
  save.seals = Math.max(save.seals ?? 0, WALLET_FULL)
  save.awakenStone = Math.max(save.awakenStone, WALLET_FULL)
  save.forgeStone = Math.max(save.forgeStone, WALLET_FULL)
  save.iron = Math.max(save.iron ?? 0, WALLET_FULL)
  save.equipTickets = Math.max(save.equipTickets ?? 0, WALLET_FULL)
  save.soul = Math.max(save.soul ?? 0, WALLET_FULL)
}

function uid(): string {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeHero(h: Partial<OwnedHero> & { uid: string; heroId: string }): OwnedHero {
  return {
    uid: h.uid,
    heroId: h.heroId,
    level: h.level ?? 1,
    shards: h.shards ?? 0,
    breakthrough: h.breakthrough ?? 0,
    awaken: h.awaken ?? 0,
    exp: h.exp ?? 0,
    gear: h.gear ?? {},
    divine: h.divine ?? false,
  }
}

function normalizeTeam(team: (string | null)[] | undefined, fallback: (string | null)[]): (string | null)[] {
  const src = (team?.length ? team : fallback).slice(0, 6)
  while (src.length < 6) src.push(null)
  return src
}

export function starterOwned(): OwnedHero[] {
  return [
    normalizeHero({ uid: uid(), heroId: 'liubei', level: 3 }),
    normalizeHero({ uid: uid(), heroId: 'huangzhong', level: 2 }),
    normalizeHero({ uid: uid(), heroId: 'dianwei', level: 2 }),
    normalizeHero({ uid: uid(), heroId: 'xiaoqiao', level: 1 }),
    normalizeHero({ uid: uid(), heroId: 'huatuo', level: 1 }),
  ]
}

export function defaultSave(): SaveData {
  const owned = starterOwned()
  return {
    version: SAVE_VERSION,
    gold: 99999,
    jade: 99999,
    tickets: 99999,
    seals: 0,
    awakenStone: 99999,
    forgeStone: 99999,
    iron: 0,
    equipTickets: 0,
    equipPity: 0,
    playerLevel: 1,
    playerExp: 0,
    stageCleared: 0,
    stageHardCleared: 0,
    stageHeroCleared: 0,
    stageEpicCleared: 0,
    owned,
    equips: [
      { uid: uid(), equipId: 'blade_green', level: 1 },
      { uid: uid(), equipId: 'armor_r', level: 1 },
      { uid: uid(), equipId: 'ring_r', level: 1 },
    ],
    team: [owned[0].uid, owned[1].uid, owned[2].uid, owned[3].uid, owned[4].uid, null],
    pity: 0,
    pullCount: 0,
    arenaPoints: 1000,
    arenaTickets: 5,
    arenaWins: 0,
    arenaLosses: 0,
    selectedHeroUid: owned[0].uid,
    shopDay: todayKey(),
    shopOffers: generateOffers(),
    shopRefreshUsed: 0,
    soul: 0,
    dailyDay: todayKey(),
    dailyClaimed: false,
    sweepsLeft: DAILY_SWEEPS,
    battleSpeed: 1,
    pushSpeed: 4,
  }
}

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY) ?? localStorage.getItem('sanguo-cards-save-v1')
    if (!raw) return defaultSave()
    const data = JSON.parse(raw) as Partial<SaveData>
    if (!data.owned?.length) return defaultSave()
    const base = defaultSave()
    const owned = data.owned.map((h) => normalizeHero(h))
    const team = normalizeTeam(data.team, base.team)
    const merged: SaveData = ensureShop({
      ...base,
      ...data,
      version: SAVE_VERSION,
      owned,
      equips: (data.equips ?? base.equips).map((item) => normalizeEquip(item)),
      team,
      awakenStone: data.awakenStone ?? base.awakenStone,
      forgeStone: data.forgeStone ?? base.forgeStone,
      iron: data.iron ?? 0,
      equipTickets: data.equipTickets ?? 0,
      equipPity: data.equipPity ?? 0,
      arenaPoints: data.arenaPoints ?? base.arenaPoints,
      arenaTickets: data.arenaTickets ?? base.arenaTickets,
      arenaWins: data.arenaWins ?? 0,
      arenaLosses: data.arenaLosses ?? 0,
      selectedHeroUid: data.selectedHeroUid ?? owned[0]?.uid ?? null,
      shopDay: data.shopDay ?? '',
      shopOffers: data.shopOffers ?? [],
      shopRefreshUsed: data.shopRefreshUsed ?? 0,
      soul: data.soul ?? 0,
      seals: data.seals ?? 0,
      dailyDay: data.dailyDay ?? '',
      dailyClaimed: data.dailyClaimed ?? false,
      sweepsLeft: data.sweepsLeft ?? 8,
      battleSpeed: num(data.battleSpeed, 1) || 1,
      pushSpeed: num(data.pushSpeed, 4) || 4,
    })
    relocateGear(merged)
    if (!localStorage.getItem('sanguo-gear-slots')) {
      const has = (slot: EquipSlot) => merged.equips.some((e) => EQUIP_MAP[e.equipId]?.slot === slot)
      const grant = (equipId: string) => {
        merged.equips.push({ uid: uid(), equipId, level: 1 })
      }
      if (!has('helm')) grant('helm_r')
      if (!has('boots')) grant('boot_r')
      if (!has('treasure')) grant('book_r')
      localStorage.setItem('sanguo-gear-slots', '1')
    }
    rollDaily(merged)
    if (!localStorage.getItem('sanguo-pack-99999')) {
      merged.gold = 99999
      merged.jade = 99999
      merged.tickets = 99999
      merged.awakenStone = 99999
      merged.forgeStone = 99999
      localStorage.setItem('sanguo-pack-99999', '1')
    }
    if (!localStorage.getItem('sanguo-gold-999999')) {
      merged.gold = 999999
      localStorage.setItem('sanguo-gold-999999', '1')
    }
    if (!localStorage.getItem('sanguo-seals-2000')) {
      merged.seals = (merged.seals ?? 0) + 2000
      localStorage.setItem('sanguo-seals-2000', '1')
    }
    if (!localStorage.getItem('sanguo-seals-99999')) {
      merged.seals = Math.max(merged.seals ?? 0, 99999)
      localStorage.setItem('sanguo-seals-99999', '1')
    }
    if (!localStorage.getItem('sanguo-equip-mat')) {
      merged.equipTickets = (merged.equipTickets ?? 0) + 80
      merged.iron = (merged.iron ?? 0) + 400
      localStorage.setItem('sanguo-equip-mat', '1')
    }
    if (!localStorage.getItem(WALLET_FULL_KEY)) {
      fillWallet(merged)
      walletFullPending = true
      localStorage.setItem(WALLET_FULL_KEY, '1')
    }
    if (localStorage.getItem(EXCLUSIVE_KEY) !== '2') {
      grantExclusiveArms(merged)
      exclusivePending = true
    }
    writeSave(merged)
    return merged
  } catch {
    return defaultSave()
  }
}

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function relocateGear(save: SaveData) {
  for (const hero of save.owned) {
    const gear = { ...(hero.gear ?? {}) }
    for (const key of Object.keys(gear) as EquipSlot[]) {
      const piece = save.equips.find((e) => e.uid === gear[key])
      const def = piece ? EQUIP_MAP[piece.equipId] : null
      if (!def || def.slot === key) continue
      delete gear[key]
      if (!gear[def.slot]) gear[def.slot] = piece!.uid
    }
    hero.gear = gear
  }
}

/** 服务器存档直接采用，不触发本地一次性发奖。 */
export function acceptServerSave(data: Partial<SaveData> | null | undefined): SaveData | null {
  if (!data?.owned?.length) return null
  const base = defaultSave()
  const owned = data.owned.map((h) => normalizeHero(h))
  const merged = ensureShop({
    ...base,
    ...data,
    version: SAVE_VERSION,
    owned,
    equips: (data.equips ?? []).map((item) => normalizeEquip(item)),
    team: normalizeTeam(data.team, base.team),
    gold: num(data.gold),
    jade: num(data.jade),
    tickets: num(data.tickets),
    seals: num(data.seals),
    awakenStone: num(data.awakenStone),
    forgeStone: num(data.forgeStone),
    iron: num(data.iron),
    equipTickets: num(data.equipTickets),
    equipPity: num(data.equipPity),
    playerLevel: Math.max(1, num(data.playerLevel, 1)),
    playerExp: num(data.playerExp),
    stageCleared: num(data.stageCleared),
    stageHardCleared: num(data.stageHardCleared),
    stageHeroCleared: num(data.stageHeroCleared),
    stageEpicCleared: num(data.stageEpicCleared),
    pity: num(data.pity),
    pullCount: num(data.pullCount),
    arenaPoints: num(data.arenaPoints),
    arenaTickets: num(data.arenaTickets),
    arenaWins: num(data.arenaWins),
    arenaLosses: num(data.arenaLosses),
    soul: num(data.soul),
    selectedHeroUid: data.selectedHeroUid ?? owned[0]?.uid ?? null,
    shopDay: data.shopDay ?? '',
    shopOffers: data.shopOffers ?? [],
    shopRefreshUsed: num(data.shopRefreshUsed),
    dailyDay: data.dailyDay ?? '',
    dailyClaimed: data.dailyClaimed ?? false,
    sweepsLeft: num(data.sweepsLeft, 8),
    battleSpeed: num(data.battleSpeed, 1) || 1,
    pushSpeed: num(data.pushSpeed, 4) || 4,
  })
  relocateGear(merged)
  if (walletFullPending || !localStorage.getItem(WALLET_FULL_KEY)) {
    fillWallet(merged)
    walletFullPending = false
    localStorage.setItem(WALLET_FULL_KEY, '1')
    writeSave(merged)
  }
  if (exclusivePending || localStorage.getItem(EXCLUSIVE_KEY) !== '2') {
    grantExclusiveArms(merged)
    exclusivePending = false
    localStorage.setItem(EXCLUSIVE_KEY, '2')
    writeSave(merged)
  }
  return merged
}

export function writeSave(data: SaveData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
  pushSave(data)
}

export function resetSave(): SaveData {
  const data = defaultSave()
  writeSave(data)
  return data
}

export function newUid(): string {
  return uid()
}

export function newHeroUid(): string {
  return uid()
}
