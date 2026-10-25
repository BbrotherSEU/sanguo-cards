import type { EquipSlot } from '../data/types'

const SLOT_FALLBACK: Record<EquipSlot, string> = {
  weapon: 'blade_green',
  helm: 'helm_r',
  armor: 'armor_r',
  boots: 'boot_r',
  accessory: 'ring_r',
  treasure: 'book_r',
}

export function equipArt(slot: EquipSlot, _rarity = 'R', dim = false, equipId?: string): string {
  const file = equipId || SLOT_FALLBACK[slot]
  return `<img class="equip-art${dim ? ' dim' : ''}" src="/equips/${file}.webp" alt="" />`
}
