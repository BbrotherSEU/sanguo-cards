/* ═══════════════════════════════════════════════════════
   抽卡音效 · 纯 Web Audio 程序生成
   零外部文件、零运行时依赖、零第三方库。
   全部声音用振荡器 + ADSR 包络合成。
   ═══════════════════════════════════════════════════════ */

type SfxName = 'portal-charge' | 'portal-burst' | 'card-flip' | 'ssr-bell' | 'sr-chime' | 'r-pop' | 'divine-merge'

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
      || (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(ctx.destination)
  }
  // Safari 需要用户手势后 resume
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/** 简单 ADSR 包络：attack → decay → sustain → release */
function adsr(
  startAt: number,
  osc: OscillatorNode,
  gain: GainNode,
  peak: number,
  durMs: number,
  attack = 0.005,
  decay = 0.08,
  sustain = 0.4,
  release = 0.18,
): void {
  if (!ctx || !masterGain) return
  const dur = durMs / 1000
  gain.gain.cancelScheduledValues(startAt)
  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(peak, startAt + attack)
  gain.gain.linearRampToValueAtTime(peak * sustain, startAt + attack + decay)
  gain.gain.setValueAtTime(peak * sustain, startAt + dur - release)
  gain.gain.linearRampToValueAtTime(0.0001, startAt + dur)
  osc.start(startAt)
  osc.stop(startAt + dur + 0.02)
}

/** 白噪声 burst：用于 portal 爆发和卡翻转 */
function noiseBurst(startAt: number, durMs: number, peak: number, filterFreq = 1200, q = 0.8): void {
  if (!ctx || !masterGain) return
  const bufSize = Math.max(1, Math.floor((durMs / 1000) * ctx.sampleRate))
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filt = ctx.createBiquadFilter()
  filt.type = 'bandpass'
  filt.frequency.value = filterFreq
  filt.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(peak, startAt)
  g.gain.exponentialRampToValueAtTime(0.0001, startAt + durMs / 1000)
  src.connect(filt).connect(g).connect(masterGain)
  src.start(startAt)
  src.stop(startAt + durMs / 1000 + 0.02)
}

function tone(
  startAt: number,
  freqHz: number,
  type: OscillatorType,
  peak: number,
  durMs: number,
  opts?: Partial<{
    attack: number
    decay: number
    sustain: number
    release: number
    detune: number
    slideTo: number
    filterFreq: number
  }>,
): void {
  if (!ctx || !masterGain) return
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.value = freqHz
  if (opts?.detune) osc.detune.value = opts.detune
  if (opts?.slideTo != null) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, opts.slideTo), startAt + durMs / 1000)
  }
  let node: AudioNode = osc
  if (opts?.filterFreq) {
    const filt = ctx.createBiquadFilter()
    filt.type = 'lowpass'
    filt.frequency.value = opts.filterFreq
    node = osc.connect(filt)
  }
  const g = ctx.createGain()
  node.connect(g).connect(masterGain)
  adsr(startAt, osc, g, peak, durMs, opts?.attack, opts?.decay, opts?.sustain, opts?.release)
}

/** 播放一个音效 */
export function playSfx(name: SfxName): void {
  const c = ensureCtx()
  if (!c) return
  const t = c.currentTime

  switch (name) {
    case 'portal-charge': {
      // 低鸣：从 80Hz 缓慢上升到 180Hz，带泛音
      tone(t, 80, 'sawtooth', 0.08, 680, {
        attack: 0.05, decay: 0.3, sustain: 0.6, release: 0.12,
        slideTo: 180, filterFreq: 600,
      })
      tone(t + 0.12, 160, 'triangle', 0.04, 560, {
        attack: 0.03, decay: 0.25, sustain: 0.5, release: 0.1,
        slideTo: 360, filterFreq: 900,
      })
      break
    }
    case 'portal-burst': {
      // 爆发：噪声 + 双调正弦下扫
      noiseBurst(t, 260, 0.55, 2600, 1.2)
      tone(t, 520, 'sine', 0.22, 340, {
        attack: 0.002, decay: 0.05, sustain: 0.2, release: 0.2,
        slideTo: 90, filterFreq: 3200,
      })
      tone(t + 0.02, 780, 'triangle', 0.14, 320, {
        attack: 0.002, decay: 0.04, sustain: 0.2, release: 0.18,
        slideTo: 120, filterFreq: 2800,
      })
      break
    }
    case 'card-flip': {
      // 脆响：短噪声 + 高频敲击
      noiseBurst(t, 60, 0.28, 4200, 2.0)
      tone(t, 1800, 'square', 0.05, 50, { attack: 0.001, decay: 0.02, sustain: 0, release: 0.04, filterFreq: 5000 })
      break
    }
    case 'ssr-bell': {
      // SSR 金光长鸣：三音叠加琶音 + 低频共鸣 + 噪声金属质感
      // 主和弦：C major 7 琶音上行 再延留
      const notes = [
        { f: 261.63, delay: 0 },       // C4
        { f: 329.63, delay: 90 },      // E4
        { f: 392.00, delay: 180 },     // G4
        { f: 523.25, delay: 270 },     // C5
        { f: 659.25, delay: 360 },     // E5
      ]
      for (const n of notes) {
        tone(t + n.delay / 1000, n.f, 'triangle', 0.16, 1200, {
          attack: 0.01, decay: 0.3, sustain: 0.7, release: 0.8, filterFreq: 6200,
        })
        tone(t + n.delay / 1000, n.f * 2, 'sine', 0.05, 1200, {
          attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.8, filterFreq: 7000,
        })
      }
      // 共鸣底鼓
      tone(t, 55, 'sine', 0.32, 520, {
        attack: 0.003, decay: 0.25, sustain: 0.4, release: 0.4, filterFreq: 600,
      })
      // 金属亮片
      noiseBurst(t, 200, 0.28, 5200, 3.2)
      noiseBurst(t + 0.18, 160, 0.18, 6800, 3.8)
      break
    }
    case 'sr-chime': {
      // SR 清脆：紫色钟声，小三和弦 Arpeggio
      tone(t, 329.63, 'triangle', 0.18, 900, { attack: 0.01, decay: 0.25, sustain: 0.6, release: 0.6, filterFreq: 5500 }) // E4
      tone(t + 0.09, 392.00, 'triangle', 0.14, 900, { attack: 0.01, decay: 0.25, sustain: 0.6, release: 0.6, filterFreq: 5500 }) // G4
      tone(t + 0.18, 493.88, 'triangle', 0.14, 900, { attack: 0.01, decay: 0.25, sustain: 0.6, release: 0.6, filterFreq: 5500 }) // B4
      tone(t + 0.04, 659.25, 'sine', 0.04, 700, { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5, filterFreq: 6500 }) // E5 泛音
      noiseBurst(t, 100, 0.16, 4800, 2.5)
      break
    }
    case 'r-pop': {
      // R 短促：pop
      tone(t, 440, 'sine', 0.12, 140, { attack: 0.003, decay: 0.06, sustain: 0.1, release: 0.08, slideTo: 320 })
      noiseBurst(t, 40, 0.12, 3400, 1.5)
      break
    }
    case 'divine-merge': {
      // 神合：低频上冲 + 五度钟声 + 金属流沙
      tone(t, 110, 'sawtooth', 0.1, 900, {
        attack: 0.05, decay: 0.3, sustain: 0.55, release: 0.3,
        slideTo: 440, filterFreq: 900,
      })
      noiseBurst(t, 320, 0.4, 3200, 1.1)
      const chord = [392.0, 523.25, 659.25, 783.99]
      chord.forEach((f, i) => {
        tone(t + 0.06 + i * 0.07, f, 'triangle', 0.16, 1500, {
          attack: 0.01, decay: 0.28, sustain: 0.68, release: 0.9, filterFreq: 6800,
        })
        tone(t + 0.06 + i * 0.07, f * 2, 'sine', 0.05, 1300, {
          attack: 0.01, decay: 0.25, sustain: 0.6, release: 0.85, filterFreq: 7600,
        })
      })
      tone(t, 52, 'sine', 0.3, 620, {
        attack: 0.004, decay: 0.26, sustain: 0.42, release: 0.45, filterFreq: 560,
      })
      noiseBurst(t + 0.2, 220, 0.24, 5600, 3.4)
      break
    }
  }
}

/** 页面首个用户交互时预热 AudioContext（浏览器策略要求） */
export function primeAudio(): void {
  ensureCtx()
}
