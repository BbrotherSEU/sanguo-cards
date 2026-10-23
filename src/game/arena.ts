import type { ArenaBot } from '../data/types'

const NAMES = [
  '江东少年',
  '西凉铁骑',
  '卧龙门生',
  '虎牢挑战者',
  '许昌游侠',
  '荆州暗卫',
  '汉中斥候',
  '邺城谋士',
  '柴桑水军',
  '下邳猛士',
]

const POOL = [
  'guanyu',
  'zhaoyun',
  'zhangfei',
  'zhugeliang',
  'caocao',
  'zhouyu',
  'lvbu',
  'simayi',
  'machao',
  'xiahoudun',
  'luxun',
  'diaochan',
  'liubei',
  'sunquan',
  'dianwei',
]

export function generateOpponents(myPoints: number, myPower: number): ArenaBot[] {
  return Array.from({ length: 4 }, (_, i) => {
    const delta = (i - 1.5) * 80 + (Math.random() * 60 - 30)
    const points = Math.max(800, Math.round(myPoints + delta))
    const level = Math.max(3, Math.round(myPower / 450) + i)
    const count = 3 + (i % 3)
    const heroes = Array.from({ length: count }, (__, j) => ({
      heroId: POOL[(i * 5 + j * 3 + Math.floor(myPoints / 50)) % POOL.length],
      level: level + j,
      breakthrough: Math.min(3, Math.floor(level / 8)),
      awaken: Math.min(2, Math.floor(level / 12)),
    }))
    const power = Math.round(myPower * (0.85 + i * 0.12) + (Math.random() * 200 - 100))
    return {
      id: `bot_${i}_${points}`,
      name: NAMES[(i + Math.floor(myPoints / 100)) % NAMES.length],
      points,
      power: Math.max(600, power),
      heroes,
    }
  })
}

export function arenaReward(win: boolean, foePoints: number, myPoints: number): { points: number; gold: number; jade: number } {
  if (win) {
    const gain = Math.max(12, Math.round(18 + (foePoints - myPoints) * 0.04))
    return { points: gain, gold: 60 + Math.round(gain * 2), jade: 3 }
  }
  const loss = Math.max(8, Math.round(12 + (myPoints - foePoints) * 0.03))
  return { points: -loss, gold: 20, jade: 0 }
}
