import { HERO_MAP } from '../data/heroes'
import { playSfx } from './audio'

/**
 * 神合特效：两张同名满级武将卡相向合拢 → 金光爆发 → 神将卡升起。
 * 图层挂在 body 上，避免 store 重绘把它冲掉。
 */
export function playDivineMerge(heroId: string, onMerge: () => void): void {
  const h = HERO_MAP[heroId]
  if (!h) {
    onMerge()
    return
  }
  document.querySelector('.divine-overlay')?.remove()

  const layer = document.createElement('div')
  layer.className = 'divine-overlay'
  layer.setAttribute('aria-hidden', 'true')
  layer.innerHTML = `
    <div class="dv-stage">
      <i class="dv-halo"></i>
      <div class="dv-pair">
        <div class="dv-card left"><img src="/sprites/${heroId}.png" alt="" draggable="false" /><b>${h.name}</b></div>
        <div class="dv-plus">＋</div>
        <div class="dv-card right"><img src="/sprites/${heroId}.png" alt="" draggable="false" /><b>${h.name}</b></div>
      </div>
      <div class="dv-burst"></div>
      <div class="dv-result">
        <div class="dv-godcard">
          <img src="/sprites/${heroId}.png" alt="" draggable="false" />
          <b>${h.name}</b>
        </div>
        <span class="dv-seal">神</span>
        <p class="dv-tip">神将降世</p>
      </div>
    </div>`
  document.body.appendChild(layer)
  requestAnimationFrame(() => layer.classList.add('on'))
  playSfx('card-flip')

  window.setTimeout(() => {
    layer.classList.add('merging')
    playSfx('portal-charge')
  }, 640)

  window.setTimeout(() => {
    layer.classList.add('burst')
    playSfx('divine-merge')
    onMerge()
  }, 1060)

  window.setTimeout(() => {
    layer.classList.add('out')
    window.setTimeout(() => layer.remove(), 420)
  }, 2960)
}
