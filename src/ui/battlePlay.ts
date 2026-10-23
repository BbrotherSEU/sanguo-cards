import { attackLineMark } from '../data/attackLine'
import { HERO_MAP } from '../data/heroes'
import type { BattleEvent, BattleResult, HpSnap } from '../game/battle'
import { battleSprite } from './battleSprite'
import { weaponHtml } from './weapon'

export function startBattlePlayback(
  root: HTMLElement,
  result: BattleResult,
  opts: { onFinish?: () => void } = {},
): () => void {
  const stage = root.querySelector<HTMLElement>('#battle-stage')
  const field = root.querySelector<HTMLElement>('#fight-field')
  const logEl = root.querySelector<HTMLElement>('#battle-feed')
  const skillFx = root.querySelector<HTMLElement>('#skill-fx')
  const clashFx = root.querySelector<HTMLElement>('#clash-fx')
  const title = root.querySelector<HTMLElement>('.battle-head h3')
  if (!stage || !field || !logEl) return () => {}

  if (title) title.textContent = '交战中'
  let idx = 0
  let timer = 0
  let stopped = false

  const finish = () => {
    if (stopped) return
    stopped = true
    window.clearTimeout(timer)
    const last = result.log[result.log.length - 1]
    if (last) syncUnits(field, last.allies, last.enemies)
    if (title) title.textContent = `${result.win ? '大获全胜' : '惜败'} · ${result.rounds} 回合`
    showReport(root, result)
    opts.onFinish?.()
  }

  const paceBtn = root.querySelector<HTMLButtonElement>('#battle-pace')
  paceBtn?.addEventListener('click', () => {
    const cur = Number(paceBtn.dataset.pace || '1')
    const next = cur === 1 ? 4 : cur === 4 ? 8 : 1
    paceBtn.dataset.pace = String(next)
    paceBtn.textContent = next >= 8 ? '极速' : next > 1 ? '快进中' : '快进'
  })
  const skipBtn = document.createElement('button')
  skipBtn.type = 'button'
  skipBtn.className = 'btn'
  skipBtn.textContent = '跳过'
  paceBtn?.insertAdjacentElement('afterend', skipBtn)
  skipBtn.addEventListener('click', finish)

  const first = result.log[0]
  if (first) syncUnits(field, first.allies, first.enemies)

  const step = () => {
    if (stopped) return
    if (idx >= result.log.length) {
      finish()
      return
    }
    const ev = result.log[idx++]
    applyEvent(stage, field, logEl, skillFx, clashFx, ev)
    const base = ev.kind === 'combo' ? 1500 : ev.kind === 'skill' ? 1400 : ev.kind === 'hit' || ev.kind === 'heal' ? 1300 : 380
    timer = window.setTimeout(step, pace(base))
  }

  timer = window.setTimeout(step, pace(420))
  return () => {
    stopped = true
    window.clearTimeout(timer)
  }
}

function pace(ms: number): number {
  const n = Number(document.querySelector('#battle-pace')?.getAttribute('data-pace') || '1')
  return Math.max(28, Math.round(ms / Math.max(1, n)))
}

function showReport(root: HTMLElement, result: BattleResult): void {
  const box = root.querySelector<HTMLElement>('#battle-report')
  if (!box) return
  const rows = result.report.filter((r) => r.side === 'ally')
  box.hidden = false
  box.innerHTML =
    `<h4>${result.win ? '胜利' : '战败'} · 我方战报</h4>` +
    rows
      .map((r) => {
        const exp = result.exp.find((e) => e.uid === r.uid)
        const expText = !exp || exp.capped ? '已满级' : exp.levels ? `+${exp.gain}经验 · 升${exp.levels}级` : `+${exp.gain}经验`
        return `<div class="rep-row"><b>${r.name}</b><span>输出 ${r.dealt}</span><span>治疗 ${r.healed}</span><span>承伤 ${r.taken}</span><em>${expText}</em></div>`
      })
      .join('')
}

function syncUnits(field: HTMLElement, allies: HpSnap[], enemies: HpSnap[]): void {
  const allyBoard = field.querySelector<HTMLElement>('#board-ally')
  const enemyBoard = field.querySelector<HTMLElement>('#board-enemy')
  if (!allyBoard || !enemyBoard) return
  const ids = [...allies, ...enemies].map((u) => u.uid).join('|')
  if (field.dataset.ids !== ids) {
    field.dataset.ids = ids
    allyBoard.querySelectorAll('.fighter').forEach((n) => n.remove())
    enemyBoard.querySelectorAll('.fighter').forEach((n) => n.remove())
    allyBoard.insertAdjacentHTML('beforeend', allies.map(fighterHtml).join(''))
    enemyBoard.insertAdjacentHTML('beforeend', enemies.map(fighterHtml).join(''))
    placeFormation(field, allies, 'ally')
    placeFormation(field, enemies, 'enemy')
  }
  for (const u of [...allies, ...enemies]) {
    const el = fighterEl(field, u.uid)
    if (!el) continue
    const pct = Math.max(0, Math.round((u.hp / u.maxHp) * 100))
    const bar = el.querySelector<HTMLElement>('.fhp i')
    if (bar) bar.style.width = `${pct}%`
    el.classList.toggle('dead', u.hp <= 0)
  }
}

function fighterHtml(u: HpSnap): string {
  const hero = HERO_MAP[u.heroId]
  const pct = Math.max(0, Math.round((u.hp / u.maxHp) * 100))
  const body = hero ? battleSprite(hero) : ''
  const mark = hero ? attackLineMark(hero.id) : ''
  return `<div class="fighter ${u.side} ${u.hp <= 0 ? 'dead' : ''}" data-uid="${u.uid}">
    <div class="fbody">${body}${hero ? weaponHtml(u.heroId) : ''}</div>
    <div class="fhp"><i style="width:${pct}%"></i></div>
    <div class="fname">${u.name}${mark ? `<i class="line-mark">${mark}</i>` : ''}</div>
  </div>`
}

function placeFormation(field: HTMLElement, units: HpSnap[], side: 'ally' | 'enemy'): void {
  units.forEach((u) => {
    const el = fighterEl(field, u.uid)
    if (!el) return
    const file = (u.slot % 3) + 1
    const front = u.slot < 3
    const col = side === 'ally' ? (front ? 2 : 1) : front ? 1 : 2
    el.style.gridColumn = String(col)
    el.style.gridRow = String(file)
    el.classList.toggle('front', front)
    el.classList.toggle('back', !front)
  })
}

function rush(actor: HTMLElement, foe: HTMLElement | undefined, kind: 'strike' | 'step', dur: number): void {
  const motion = measureLunge(actor, foe, kind)
  actor.style.setProperty('--strike', `${dur}ms`)
  actor.style.setProperty('--lx', `${motion.x}px`)
  actor.style.setProperty('--ly', `${motion.y}px`)
  actor.style.setProperty('--lean', `${motion.lean}deg`)
  actor.classList.remove('striking')
  void actor.offsetWidth
  actor.classList.add('striking')
  if (foe && kind === 'strike') {
    const sign = motion.x >= 0 ? 1 : -1
    foe.style.setProperty('--strike', `${dur}ms`)
    foe.style.setProperty('--rx', `${sign * 22}px`)
    foe.classList.remove('hitreact')
    void foe.offsetWidth
    foe.classList.add('hitreact')
  }
  window.setTimeout(() => {
    if (actor.isConnected) actor.classList.remove('striking')
    if (foe?.isConnected) foe.classList.remove('hitreact')
  }, dur)
}

function measureLunge(actor: HTMLElement, foe: HTMLElement | undefined, kind: 'strike' | 'step'): { x: number; y: number; lean: number } {
  const dir = actor.classList.contains('ally') ? 1 : -1
  if (!foe || kind === 'step') {
    return { x: dir * (kind === 'step' ? 72 : 28), y: -8, lean: dir * 10 }
  }
  const a = actor.getBoundingClientRect()
  const b = foe.getBoundingClientRect()
  const ax = a.left + a.width / 2
  const ay = a.top + a.height * 0.7
  const bx = b.left + b.width / 2
  const by = b.top + b.height * 0.62
  let dx = bx - ax
  let dy = by - ay
  const dist = Math.hypot(dx, dy) || 1
  const reach = Math.max(48, dist - Math.max(36, b.width * 0.36))
  const scale = Math.min(1, reach / dist)
  dx = Math.round(dx * scale)
  dy = Math.round(dy * scale)
  const lean = Math.max(-16, Math.min(16, dir * 12))
  return { x: dx, y: dy, lean }
}

function applyEvent(
  stage: HTMLElement,
  field: HTMLElement,
  logEl: HTMLElement,
  skillFx: HTMLElement | null,
  clashFx: HTMLElement | null,
  ev: BattleEvent,
): void {
  syncUnits(field, ev.allies, ev.enemies)

  const line = document.createElement('div')
  line.className = `line ${ev.kind}`
  line.textContent = ev.text
  logEl.prepend(line)

  const actor = ev.actorId ? fighterEl(field, ev.actorId) : null
  const targets = (ev.targetIds ?? []).map((id) => fighterEl(field, id)).filter((el): el is HTMLElement => !!el)
  const involved = new Set<HTMLElement>([...(actor ? [actor] : []), ...targets])

  field.querySelectorAll<HTMLElement>('.fighter').forEach((el) => {
    el.classList.toggle('aside', involved.size > 0 && !involved.has(el) && !el.classList.contains('dead'))
  })

  if (actor && (ev.kind === 'hit' || ev.kind === 'skill' || ev.kind === 'combo')) {
    const foe = targets[0]
    const healish = ev.fx === 'heal' || ev.fx === 'heal-all' || ev.fx === 'regen' || ev.fx === 'regen-all'
    const wave = !healish && (targets.length > 1 || ev.fx === 'aoe' || ev.fx === 'burn' || ev.fx === 'poison')
    const dur = pace(healish ? 520 : wave ? 680 : 860)
    if (healish) {
      actor.style.setProperty('--strike', `${dur}ms`)
      replay(actor, 'casting')
    } else rush(actor, foe, wave ? 'step' : 'strike', dur)
    window.setTimeout(() => {
      if (!stage.isConnected) return
      const marks = targets.length ? targets : actor ? [actor] : []
      castFx(stage, ev.fx || 'strike', marks, actor)
      for (const t of marks) {
        replay(t, 'struck')
        const per = ev.value ? Math.round(ev.value / Math.max(targets.length, 1)) : 0
        if (per) floatNum(t, `-${per}`, 'hurt')
      }
      stage.classList.remove('shake')
      void stage.offsetWidth
      stage.classList.add('shake')
    }, healish ? 80 : Math.round(dur * 0.42))
  } else if (ev.kind === 'heal') {
    if (actor) replay(actor, 'casting')
    castFx(stage, 'heal', targets, actor)
    for (const t of targets) {
      replay(t, 'healed')
      const per = ev.value ? Math.round(ev.value / Math.max(targets.length, 1)) : 0
      if (per) floatNum(t, `+${per}`, 'heal')
    }
  }

  if (clashFx && (ev.kind === 'hit' || ev.kind === 'skill' || ev.kind === 'combo')) {
    const anchor = targets[0] ?? actor
    if (anchor) {
      const rect = anchor.getBoundingClientRect()
      const host = stage.getBoundingClientRect()
      clashFx.style.left = `${rect.left - host.left + rect.width / 2}px`
      clashFx.style.top = `${rect.top - host.top + rect.height * 0.38}px`
    }
    clashFx.className = `clash-fx show ${ev.kind}`
    window.setTimeout(() => clashFx.classList.remove('show'), 420)
  }

  if (skillFx && (ev.kind === 'skill' || ev.kind === 'heal' || ev.kind === 'combo')) {
    const name = ev.kind === 'combo' ? ev.comboName ?? '合击' : actorName(ev.text)
    skillFx.textContent = name
    skillFx.className = `skill-fx show ${ev.fx || ev.kind}`
    window.setTimeout(() => skillFx.classList.remove('show'), ev.kind === 'combo' ? 1200 : 1100)
  }
}

function castFx(stage: HTMLElement, fx: string, targets: HTMLElement[], actor: HTMLElement | null): void {
  if (fx === 'aoe' || fx === 'burn' || fx === 'poison' || fx === 'heal-all' || fx === 'control' || fx === 'execute') {
    const veil = document.createElement('div')
    veil.className = `skill-veil ${fx}`
    stage.appendChild(veil)
    window.setTimeout(() => veil.remove(), 700)
  }
  if (fx === 'line-row' || fx === 'line-col') spawnLine(stage, targets, fx)
  if (fx === 'aoe' || fx === 'burn' || fx === 'poison') {
    const wave = document.createElement('div')
    const towardEnemy = !actor || actor.classList.contains('ally')
    wave.className = `cast-wave ${fx}`
    wave.style.left = towardEnemy ? '52%' : '4%'
    stage.appendChild(wave)
    window.setTimeout(() => wave.remove(), 1400)
  }
  for (const t of targets) {
    if (fx === 'strike' || fx === 'execute') {
      spawnSlash(stage, t, fx === 'execute' ? -48 : -32)
      spawnSlash(stage, t, fx === 'execute' ? 48 : 24)
      spawnDust(stage, t)
      if (fx === 'execute') spawnRing(stage, t)
    } else if (fx === 'heal' || fx === 'heal-all') {
      const mote = document.createElement('div')
      mote.className = 'cast-burst heal'
      pinFx(stage, t, mote, 0.42)
      window.setTimeout(() => mote.remove(), 1400)
      spawnRise(stage, t, 'heal')
    } else if (fx === 'burn') {
      spawnRise(stage, t, 'burn')
    } else if (fx === 'poison') {
      spawnRise(stage, t, 'poison')
    } else if (fx === 'control') {
      spawnRing(stage, t)
    } else if (fx !== 'line-row' && fx !== 'line-col') {
      spawnRing(stage, t)
      spawnDust(stage, t)
    }
    const burst = document.createElement('div')
    burst.className = `cast-burst ${fx}`
    pinFx(stage, t, burst, fx === 'heal' || fx === 'heal-all' ? 0.55 : 0.36)
    window.setTimeout(() => burst.remove(), 1400)
  }
}

function spawnLine(stage: HTMLElement, targets: HTMLElement[], fx: string): void {
  if (!targets.length) return
  const host = stage.getBoundingClientRect()
  const rects = targets.map((t) => t.getBoundingClientRect())
  const beam = document.createElement('div')
  beam.className = `line-beam ${fx === 'line-col' ? 'col' : 'row'}`
  if (fx === 'line-col') {
    const x = rects.reduce((sum, r) => sum + r.left + r.width / 2, 0) / rects.length
    const top = Math.min(...rects.map((r) => r.top))
    const bottom = Math.max(...rects.map((r) => r.bottom))
    beam.style.left = `${x - host.left}px`
    beam.style.top = `${top - host.top}px`
    beam.style.height = `${Math.max(24, bottom - top)}px`
  } else {
    const y = rects.reduce((sum, r) => sum + r.top + r.height * 0.45, 0) / rects.length
    const left = Math.min(...rects.map((r) => r.left))
    const right = Math.max(...rects.map((r) => r.right))
    beam.style.left = `${left - host.left}px`
    beam.style.top = `${y - host.top}px`
    beam.style.width = `${Math.max(36, right - left)}px`
  }
  stage.appendChild(beam)
  window.setTimeout(() => beam.remove(), 480)
}

function spawnRise(stage: HTMLElement, target: HTMLElement, kind: string): void {
  for (let i = 0; i < 4; i++) {
    const mote = document.createElement('div')
    mote.className = `rise-mote ${kind}`
    mote.style.setProperty('--dx', `${(i - 1.5) * 14}px`)
    pinFx(stage, target, mote, 0.55)
    window.setTimeout(() => mote.remove(), 700)
  }
}

function pinFx(stage: HTMLElement, target: HTMLElement, node: HTMLElement, y: number): void {
  const rect = target.getBoundingClientRect()
  const host = stage.getBoundingClientRect()
  node.style.left = `${rect.left - host.left + rect.width / 2}px`
  node.style.top = `${rect.top - host.top + rect.height * y}px`
  stage.appendChild(node)
}

function spawnSlash(stage: HTMLElement, target: HTMLElement, angle = -28): void {
  const rect = target.getBoundingClientRect()
  const host = stage.getBoundingClientRect()
  const slash = document.createElement('div')
  slash.className = 'slash'
  slash.style.left = `${rect.left - host.left + rect.width * 0.2}px`
  slash.style.top = `${rect.top - host.top + rect.height * 0.34}px`
  slash.style.setProperty('--cut', `${angle}deg`)
  stage.appendChild(slash)
  window.setTimeout(() => slash.remove(), 420)
}

function spawnDust(stage: HTMLElement, target: HTMLElement): void {
  const rect = target.getBoundingClientRect()
  const host = stage.getBoundingClientRect()
  const dust = document.createElement('div')
  dust.className = 'hit-dust'
  dust.style.left = `${rect.left - host.left + rect.width / 2}px`
  dust.style.top = `${rect.top - host.top + rect.height * 0.78}px`
  stage.appendChild(dust)
  window.setTimeout(() => dust.remove(), 460)
}

function spawnRing(stage: HTMLElement, target: HTMLElement): void {
  const rect = target.getBoundingClientRect()
  const host = stage.getBoundingClientRect()
  const ring = document.createElement('div')
  ring.className = 'hit-ring'
  ring.style.left = `${rect.left - host.left + rect.width / 2}px`
  ring.style.top = `${rect.top - host.top + rect.height * 0.42}px`
  stage.appendChild(ring)
  window.setTimeout(() => ring.remove(), 480)
}

function replay(el: HTMLElement, cls: string): void {
  el.classList.remove(cls)
  void el.offsetWidth
  el.classList.add(cls)
}

function floatNum(el: HTMLElement, text: string, kind: string): void {
  const n = document.createElement('div')
  n.className = `dmg-pop ${kind}`
  n.textContent = text
  el.appendChild(n)
  window.setTimeout(() => n.remove(), 780)
}

function fighterEl(root: ParentNode, uid: string): HTMLElement | null {
  return root.querySelector<HTMLElement>(`[data-uid="${cssAttr(uid)}"]`)
}

function actorName(text: string): string {
  const m = text.match(/【(.+?)】/)
  return m?.[1] ?? '必杀'
}

function cssAttr(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}
