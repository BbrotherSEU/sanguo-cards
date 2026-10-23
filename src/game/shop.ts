import { EQUIPS } from '../data/equips'
import type { SaveData, ShopOffer } from '../data/types'

function oid(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export function generateOffers(): ShopOffer[] {
  const equip = pick(EQUIPS.filter((e) => e.rarity !== 'SSR').concat(EQUIPS.filter((e) => e.rarity === 'SR')))
  const offers: ShopOffer[] = [
    {
      id: oid(),
      kind: 'gold_pack',
      title: '军饷袋',
      desc: '获得 500 银两',
      costJade: 20,
      amount: 500,
      bought: false,
    },
    {
      id: oid(),
      kind: 'ticket',
      title: '招募令×3',
      desc: '招募令 +3',
      costJade: 40,
      amount: 3,
      bought: false,
    },
    {
      id: oid(),
      kind: 'seal',
      title: '阵符×20',
      desc: '补充阵营招募，比每日俸禄贵',
      costJade: 120,
      amount: 20,
      bought: false,
    },
    {
      id: oid(),
      kind: 'awaken',
      title: '觉醒丹×5',
      desc: '觉醒丹 +5',
      costGold: 400,
      amount: 5,
      bought: false,
    },
    {
      id: oid(),
      kind: 'forge',
      title: '精炼石×5',
      desc: '精炼石 +5',
      costGold: 350,
      amount: 5,
      bought: false,
    },
    {
      id: oid(),
      kind: 'equip',
      title: equip.name,
      desc: `${equip.rarity} · ${equip.desc}`,
      costJade: equip.rarity === 'SSR' ? 120 : equip.rarity === 'SR' ? 60 : 25,
      amount: 1,
      equipId: equip.id,
      bought: false,
    },
    {
      id: oid(),
      kind: 'jade_deal',
      title: '特惠元宝',
      desc: '元宝 +50（每日特惠）',
      costGold: 800,
      amount: 50,
      bought: false,
    },
  ]
  return offers
}

export function ensureShop(save: SaveData): SaveData {
  const day = todayKey()
  if (save.shopDay === day && save.shopOffers?.length) return save
  return {
    ...save,
    shopDay: day,
    shopOffers: generateOffers(),
    shopRefreshUsed: 0,
  }
}

export function refreshShop(save: SaveData): SaveData {
  const free = save.shopRefreshUsed < 1
  if (!free && save.jade < 15) throw new Error('元宝不足（刷新需15）')
  const next = structuredClone(save)
  if (!free) next.jade -= 15
  next.shopRefreshUsed += 1
  next.shopOffers = generateOffers()
  next.shopDay = todayKey()
  return next
}

export function buyOffer(save: SaveData, offerId: string): SaveData {
  const next = structuredClone(save)
  const offer = next.shopOffers.find((o) => o.id === offerId)
  if (!offer) throw new Error('商品不存在')
  if (offer.bought) throw new Error('已购买')
  if (offer.costGold && next.gold < offer.costGold) throw new Error('银两不足')
  if (offer.costJade && next.jade < offer.costJade) throw new Error('元宝不足')

  if (offer.costGold) next.gold -= offer.costGold
  if (offer.costJade) next.jade -= offer.costJade

  switch (offer.kind) {
    case 'gold_pack':
      next.gold += offer.amount
      break
    case 'ticket':
      next.tickets += offer.amount
      break
    case 'seal':
      next.seals = (next.seals ?? 0) + offer.amount
      break
    case 'awaken':
      next.awakenStone += offer.amount
      break
    case 'forge':
      next.forgeStone += offer.amount
      break
    case 'jade_deal':
      next.jade += offer.amount
      break
    case 'equip':
      if (offer.equipId) {
        next.equips.push({ uid: oid(), equipId: offer.equipId, level: 1 })
      }
      break
  }
  offer.bought = true
  return next
}
