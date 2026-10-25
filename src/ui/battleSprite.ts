import type { HeroDef } from '../data/types'

/** 战场全身立绘，与卡面、名册、养成同一套 Q 版 */
export function battleSprite(hero: HeroDef): string {
  return `<img class="battle-sprite battle-art" src="/sprites/${hero.id}.webp" alt="" draggable="false" />`
}
