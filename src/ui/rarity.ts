import type { Rarity } from '../data/types'

export const RARITY_LABEL: Record<Rarity, string> = {
  N: '凡品',
  R: '精良',
  SR: '史诗',
  SSR: '传说',
}

export const RARITY_STARS: Record<Rarity, number> = {
  N: 1,
  R: 2,
  SR: 3,
  SSR: 5,
}

export function rarityStarsHtml(rarity: string): string {
  const n = RARITY_STARS[rarity as Rarity] ?? 1
  return `<span class="rarity-stars rarity-${rarity}" aria-label="${rarity}">${'★'.repeat(n)}</span>`
}

export function rarityTagHtml(rarity: string): string {
  const label = RARITY_LABEL[rarity as Rarity] ?? rarity
  return `<span class="rarity-tag rarity-${rarity}"><b>${rarity}</b><i>${label}</i></span>`
}
