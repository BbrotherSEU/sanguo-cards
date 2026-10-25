/**
 * 难度最终校准验证：
 *  1) 史诗第 200 关：6 名满配神将应能险胜；5 神将 / 6 凡人 / 裸装 / 未觉醒应打不过
 *  2) 四档难度在第 200 关应呈阶梯式变难
 *  3) 普通档数值与改动前完全一致（回归）
 *  4) 各难度前期关卡不应比普通档更难（解锁链不会卡死）
 */
import { simulateStageBattle, type BattleUnit } from '../src/game/battle'
import { calcStats } from '../src/game/stats'
import { DIFFICULTIES, DIFFICULTY_ORDER, stageFor } from '../src/data/stages'
import type { OwnedEquip, OwnedHero, EquipSlot } from '../src/data/types'

const HEROES = ['guanyu', 'zhaoyun', 'lvbu', 'zhangfei', 'huangzhong', 'dianwei']
const EXCLUSIVE_WEAPON: Record<string, string> = {
  guanyu: 'blade_orange',
  zhaoyun: 'yun_spear',
  lvbu: 'sky_halberd',
  zhangfei: 'snake_spear',
  huangzhong: 'sunset_bow',
  dianwei: 'iron_ji',
}

function makeBag(): OwnedEquip[] {
  const bag: OwnedEquip[] = []
  const push = (id: string) => {
    const uid = `e_${id}`
    if (!bag.find((e) => e.uid === uid)) bag.push({ uid, equipId: id, level: 100, forge: 8 })
    return uid
  }
  for (const h of Object.values(EXCLUSIVE_WEAPON)) push(h)
  for (const id of ['armor_ssr', 'helm_ssr', 'boot_ssr', 'ring_ssr', 'book_ssr']) push(id)
  return bag
}
const BAG = makeBag()

function hero(heroId: string, divine: boolean, level = 120, gear = true, aw = 5): OwnedHero {
  const g: Partial<Record<EquipSlot, string>> = gear
    ? {
        weapon: `e_${EXCLUSIVE_WEAPON[heroId] ?? 'blade_orange'}`,
        armor: 'e_armor_ssr',
        helm: 'e_helm_ssr',
        boots: 'e_boot_ssr',
        accessory: 'e_ring_ssr',
        treasure: 'e_book_ssr',
      }
    : {}
  return { uid: `h_${heroId}_${divine ? 'd' : 'm'}`, heroId, level, shards: 0, breakthrough: 5, awaken: aw, exp: 0, gear: g, divine }
}

const TEAMS: [string, BattleUnit[]][] = [
  ['6满配神将', HEROES.map((h, i) => ({ owned: hero(h, true), slot: i }))],
  ['5满配神将', HEROES.slice(0, 5).map((h, i) => ({ owned: hero(h, true), slot: i }))],
  ['6满配凡人', HEROES.map((h, i) => ({ owned: hero(h, false), slot: i }))],
  ['5满配凡人', HEROES.slice(0, 5).map((h, i) => ({ owned: hero(h, false), slot: i }))],
  ['神将裸装', HEROES.map((h, i) => ({ owned: hero(h, true, 120, false), slot: i }))],
  ['神将未觉醒', HEROES.map((h, i) => ({ owned: hero(h, true, 120, true, 0), slot: i }))],
]

function rate(team: BattleUnit[], stageId: number, diff: string, runs = 20): { r: number; a: number } {
  const stage = stageFor(stageId, diff as never)!
  let w = 0
  let a = 0
  for (let i = 0; i < runs; i++) {
    const res = simulateStageBattle(team, BAG, stage)
    if (res.win) w++
    a += res.allies.filter((f) => f.alive).length
  }
  return { r: w / runs, a: a / runs }
}

let failed = 0
const check = (ok: boolean, label: string) => {
  if (!ok) failed++
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`)
}

console.log('=== 1) 史诗第 200 关门槛（需求：6 满级神将才能打过）===')
const e200 = TEAMS.map(([n, t]) => {
  const v = rate(t, 200, 'epic')
  return `${n.padEnd(12)} ${(v.r * 100).toFixed(0)}% 胜 / 存活 ${v.a.toFixed(1)}`
})
e200.forEach((l) => console.log('  ' + l))
const g6 = rate(TEAMS[0][1], 200, 'epic')
const g5 = rate(TEAMS[1][1], 200, 'epic')
const m6 = rate(TEAMS[2][1], 200, 'epic')
const m5 = rate(TEAMS[3][1], 200, 'epic')
const bare = rate(TEAMS[4][1], 200, 'epic')
const noAw = rate(TEAMS[5][1], 200, 'epic')
check(g6.r >= 0.7, `6 满配神将能险胜（胜率 ${(g6.r * 100).toFixed(0)}% ≥ 70%）`)
check(g5.r <= 0.3, `5 神将基本打不过（胜率 ${(g5.r * 100).toFixed(0)}% ≤ 30%）`)
check(g6.r - m6.r >= 0.3, `神将明显强于凡人（${(g6.r * 100).toFixed(0)}% vs ${(m6.r * 100).toFixed(0)}%，差距 ≥ 30 个百分点）`)
check(m5.r === 0, `5 凡人完全打不过（胜率 ${(m5.r * 100).toFixed(0)}%）`)
check(bare.r === 0, `神将无装备打不过（胜率 ${(bare.r * 100).toFixed(0)}%）`)
check(noAw.r === 0, `神将未觉醒打不过（胜率 ${(noAw.r * 100).toFixed(0)}%）`)

console.log('\n=== 2) 第 200 关难度阶梯（6 满配神将 / 6 满配凡人）===')
for (const d of DIFFICULTY_ORDER) {
  const a = rate(TEAMS[0][1], 200, d)
  const b = rate(TEAMS[2][1], 200, d)
  console.log(
    `  ${DIFFICULTIES[d].name.padEnd(4)} 6神将 ${(a.r * 100).toFixed(0)}%/${a.a.toFixed(1)}活   6凡人 ${(b.r * 100).toFixed(0)}%/${b.a.toFixed(1)}活`,
  )
}
const ladder = DIFFICULTY_ORDER.map((d) => rate(TEAMS[0][1], 200, d).r)
check(
  ladder.every((v, i) => i === 0 || v <= ladder[i - 1] + 0.001),
  '同关卡下难度越高、满配神将胜率越低（阶梯成立）',
)

console.log('\n=== 3) 普通档回归（与改动前一致）===')
let normOk = true
for (const id of [1, 7, 50, 123, 200]) {
  const st = stageFor(id, 'normal')!
  const expGold = 80 + id * 25
  const expJade = id % 5 === 0 ? 20 : 5
  const expExp = 30 + id * 8
  const multOk = st.waves.every((w) => w.every((e) => (e.mult ?? 1) === 1))
  const goldOk = st.rewardGold === expGold
  const jadeOk = st.rewardJade === expJade
  const expOk = st.rewardExp === expExp
  if (!(multOk && goldOk && jadeOk && expOk)) normOk = false
  console.log(
    `  #${id} 倍率${multOk ? '=1' : '≠1'} 银两${st.rewardGold}(期望${expGold}) 元宝${st.rewardJade}(期望${expJade}) 经验${st.rewardExp}(期望${expExp})`,
  )
}
check(normOk, '普通档属性倍率与奖励完全未变')

console.log('\n=== 4) 前期关卡各难度倍率（解锁链不会卡死）===')
for (const id of [1, 5, 10, 30, 60, 100, 150, 200]) {
  const row = DIFFICULTY_ORDER.map((d) => {
    const st = stageFor(id, d)!
    return `${DIFFICULTIES[d].name}×${(st.waves[0][0]?.mult ?? 1).toFixed(2)}`
  })
  console.log(`  #${String(id).padStart(3)}  ${row.join('  ')}`)
}
let curveOk = true
for (const id of [1, 5, 10, 30, 60, 100, 150, 200]) {
  const hard = stageFor(id, 'hard')!
  const norm = stageFor(id, 'normal')!
  if ((hard.waves[0][0]?.mult ?? 1) < (norm.waves[0][0]?.mult ?? 1)) curveOk = false
}
check(curveOk, '各难度倍率单调不降于普通档')

console.log(`\n${failed === 0 ? '全部通过' : failed + ' 项未通过'}`)
if (failed > 0) process.exit(1)
