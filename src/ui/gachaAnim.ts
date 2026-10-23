import type { PullResult } from '../game/gacha'
import { portraitHtml } from './portrait'
import { rarityStarsHtml, rarityTagHtml } from './rarity'
import { playSfx } from './audio'

const RARITY_RANK: Record<string, number> = { N: 0, R: 1, SR: 2, SSR: 3 }

function rank(r: string): number {
  return RARITY_RANK[r] ?? 0
}

/** 返回这次十连里稀有度最高的结果 */
function highest(results: PullResult[]): PullResult {
  return results.reduce((a, b) => (rank(b.hero.rarity) > rank(a.hero.rarity) ? b : a))
}

/**
 * 抽卡演出：光门蓄力 → 爆发 → [SSR 专用转场] → 卡牌飞入 → 依次翻开
 * 只操作已有 DOM，中途不触发整页重渲染。
 */
export function playGachaAnim(
  root: HTMLElement,
  results: PullResult[],
  onDone: () => void,
): () => void {
  const overlay = root.querySelector<HTMLElement>('#gacha-overlay')
  const portal = root.querySelector<HTMLElement>('#gacha-portal')
  const board = root.querySelector<HTMLElement>('#gacha-board')
  const skipBtn = root.querySelector<HTMLElement>('[data-gacha-skip]')
  if (!overlay || !portal || !board) {
    onDone()
    return () => {}
  }

  // 十连是否出了 SSR
  const best = highest(results)
  const hasSsr = best.hero.rarity === 'SSR' && results.length > 1
  const soloSsr = best.hero.rarity === 'SSR' && results.length === 1

  let stopped = false
  const timers: number[] = []
  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = window.setTimeout(() => resolve(), ms)
      timers.push(t)
    })

  const stop = () => {
    stopped = true
    timers.forEach((t) => window.clearTimeout(t))
  }

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    stop()
    overlay.classList.remove('ssr-flash', 'sr-chime', 'r-flash', 'ssr-blackout', 'ssr-solo-mode', 'await-flip', 'done')
    overlay.classList.add('done')
    onDone()
  }

  skipBtn?.addEventListener(
    'click',
    () => {
      revealAllInstant(board, results)
      finish()
    },
    { once: true },
  )

  void (async () => {
    overlay.classList.add('active')

    // 1. 蓄力
    portal.classList.add('charge')
    playSfx('portal-charge')
    await wait(700)
    if (stopped) return

    // 2. 爆发
    portal.classList.add('burst')
    playSfx('portal-burst')
    await wait(450)
    if (stopped) return

    // 3. 十连出 SSR → 专用转场
    if (hasSsr || soloSsr) {
      await playSsrTransition(root, overlay, best)
      if (stopped) return
    }

    // 4. 铺卡
    board.innerHTML = results
      .map((r, i) => summonCardHtml(r, i, results.length))
      .join('')

    const cards = [...board.querySelectorAll<HTMLElement>('.summon-card')]
    for (const card of cards) {
      if (stopped) return
      card.classList.add('fly-in')
      await wait(results.length > 1 ? 90 : 160)
    }

    await wait(280)
    if (stopped) return

    portal.classList.add('leave')
    overlay.classList.remove('ssr-blackout', 'ssr-solo-mode')
    overlay.classList.add('await-flip')

    // 5. 卡牌等待点击翻开
    let flipped = 0
    cards.forEach((el, i) => {
      el.classList.add('can-flip')
      el.addEventListener('click', () => {
        if (stopped || el.classList.contains('flip')) return
        openCard(el, results[i], overlay)
        flipped += 1
        if (flipped >= cards.length) {
          const t = window.setTimeout(() => finish(), 420)
          timers.push(t)
        }
      })
    })
  })()

  return stop
}

/** SSR 专用过场：金光爆发 → 黑幕 → solo 大卡 → 名字横幅 */
async function playSsrTransition(
  root: HTMLElement,
  overlay: HTMLElement,
  best: PullResult,
): Promise<void> {
  const localTimers: number[] = []
  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      const t = window.setTimeout(() => resolve(), ms)
      localTimers.push(t)
    })

  // 黑幕
  overlay.classList.add('ssr-blackout')
  playSfx('ssr-bell')
  await wait(400)

  // solo 大卡推入
  overlay.classList.add('ssr-solo-mode')
  const hero = best.hero
  const soloBoard = `<div class="ssr-solo-stage">
    <div class="ssr-solo-card-wrap rarity-SSR faction-${hero.faction}">
      <div class="ssr-solo-card">
        <div class="summon-face">
          <div class="face-frame" style="--accent:${hero.color}">
            ${rarityTagHtml('SSR')}
            <span class="faction-chip faction-${hero.faction}">${({ shu: '蜀', wei: '魏', wu: '吴', qun: '群' } as Record<string, string>)[hero.faction] ?? ''}</span>
            <div class="face-art">${portraitHtml(hero, 240)}</div>
            <div class="face-meta">
              <div class="face-name ssr-big-name">${hero.name}<i class="mini-tag">${best.isNew ? 'NEW' : '+10'}</i></div>
              ${rarityStarsHtml('SSR')}
              <div class="face-title">${hero.title}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="ssr-sparkle"></div>
      <div class="ssr-sparkle s2"></div>
      <div class="ssr-sparkle s3"></div>
    </div>
    <div class="ssr-ribbon" aria-hidden="true">
      <em>SSR</em>
      <div class="ssr-ribbon-name">${hero.name}</div>
      <small>${hero.title}</small>
    </div>
  </div>`

  // 放在 gacha-board 位置（在 overlay 里）
  const board = root.querySelector<HTMLElement>('#gacha-board')
  if (board) {
    board.innerHTML = soloBoard
  }

  await wait(1400)
}

function openCard(el: HTMLElement, result: PullResult, overlay: HTMLElement): void {
  el.classList.add('flip')
  const rarity = result.hero.rarity
  if (rarity === 'SSR') {
    el.classList.add('ssr-burst')
    overlay.classList.add('ssr-flash')
    playSfx('ssr-bell')
    window.setTimeout(() => overlay.classList.remove('ssr-flash'), 180)
  } else if (rarity === 'SR') {
    el.classList.add('sr-burst')
    overlay.classList.add('sr-chime')
    playSfx('sr-chime')
    window.setTimeout(() => overlay.classList.remove('sr-chime'), 320)
  } else {
    el.classList.add('r-burst')
    overlay.classList.add('r-flash')
    playSfx('r-pop')
    window.setTimeout(() => overlay.classList.remove('r-flash'), 200)
  }
}

function revealAllInstant(board: HTMLElement, results: PullResult[]): void {
  board.innerHTML = results.map((r, i) => summonCardHtml(r, i, results.length)).join('')
  board.querySelectorAll('.summon-card').forEach((el) => {
    el.classList.add('fly-in', 'flip', 'instant')
  })
}

function summonCardHtml(r: PullResult, index: number, total: number): string {
  const h = r.hero
  const wide = total === 1 ? 'solo' : total <= 5 ? 'mid' : 'grid'
  return `
  <div class="summon-card ${wide} rarity-${h.rarity} faction-${h.faction}" data-i="${index}" style="--accent:${h.color}; --delay:${index * 0.04}s">
    <div class="summon-inner">
      <div class="summon-back">
        <div class="back-seal">征</div>
        <div class="back-glow"></div>
      </div>
      <div class="summon-face">
        <div class="face-frame">
          ${rarityTagHtml(h.rarity)}
          <span class="faction-chip faction-${h.faction}">${({ shu: '蜀', wei: '魏', wu: '吴', qun: '群' } as Record<string, string>)[h.faction] ?? ''}</span>
          <div class="face-art">${portraitHtml(h, total === 1 ? 172 : 118)}</div>
          <div class="face-meta">
            <div class="face-name">${h.name}<i class="mini-tag">${r.isNew ? 'NEW' : '+10'}</i></div>
            ${rarityStarsHtml(h.rarity)}
            <div class="face-title">${h.title}</div>
          </div>
        </div>
      </div>
    </div>
  </div>`
}
