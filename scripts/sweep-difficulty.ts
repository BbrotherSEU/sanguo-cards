/** 困难/英雄档 Boss 加成对比 */
import { simulateStageBattle, type BattleUnit } from '../src/game/battle'
import { stageFor } from '../src/data/stages'
import type { OwnedEquip, OwnedHero, EquipSlot, StageDef } from '../src/data/types'

const HEROES = ['guanyu', 'zhaoyun', 'lvbu', 'zhangfei', 'huangzhong', 'dianwei']
const EXCLUSIVE_WEAPON: Record<string, string> = {
  guanyu: 'blade_orange', zhaoyun: 'yun_spear', lvbu: 'sky_halberd',
  zhangfei: 'snake_spear', huangzhong: 'sunset_bow', dianwei: 'iron_ji',
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
function hero(heroId: string, divine: boolean, aw = 5): OwnedHero {
  const g: Partial<Record<EquipSlot, string>> = {
    weapon: `e_${EXCLUSIVE_WEAPON[heroId] ?? 'blade_orange'}`, armor: 'e_armor_ssr',
    helm: 'e_helm_ssr', boots: 'e_boot_ssr', accessory: 'e_ring_ssr', treasure: 'e_book_ssr',
  }
  return { uid: `h_${heroId}_${divine ? 'd' : 'm'}`, heroId, level: 120, shards: 0, breakthrough: 5, awaken: aw, exp: 0, gear: g, divine }
}
const god6 = HEROES.map((h, i) => ({ owned: hero(h, true), slot: i }))
const m6 = HEROES.map((h, i) => ({ owned: hero(h, false), slot: i }))

function scaled(stage: StageDef, mult: number, bossBt: number, bossAw: number): StageDef {
  const waves = stage.waves.map((w, wi) => {
    const isBoss = wi === stage.waves.length - 1
    return w.map((e) => ({ ...e, mult, bt: isBoss && bossBt ? Math.min(5, (e.bt ?? 0) + bossBt) : e.bt, aw: isBoss ? bossAw || e.aw : e.aw }))
  })
  return { ...stage, waves, enemies: waves[2] }
}
function rate(team: BattleUnit[], stage: StageDef, runs = 20) {
  let w = 0, a = 0
  for (let i = 0; i < runs; i++) {
    const r = simulateStageBattle(team, BAG, stage)
    if (r.win) w++
    a += r.allies.filter((f) => f.alive).length
  }
  return `${((w / runs) * 100).toFixed(0)}%/${(a / runs).toFixed(1)}活`
}

const base = stageFor(200, 'epic')!
console.log('配置               6神将      6凡人')
const cfgs: [string, number, number, number][] = [
  ['困难 3.2 bt0 aw0', 3.2, 0, 0],
  ['困难 3.2 bt1 aw1', 3.2, 1, 1],
  ['困难 3.6 bt1 aw1', 3.6, 1, 1],
  ['困难 4.0 bt1 aw1', 4.0, 1, 1],
  ['英雄 4.2 bt2 aw1', 4.2, 2, 1],
  ['英雄 4.2 bt2 aw2', 4.2, 2, 2],
  ['英雄 4.6 bt2 aw2', 4.6, 2, 2],
  ['史诗 5.2 bt2 aw3', 5.2, 2, 3],
  ['史诗 5.4 bt2 aw3', 5.4, 2, 3],
]
for (const [label, mult, bt, aw] of cfgs) {
  const s = scaled(base, mult, bt, aw)
  console.log(`${label.padEnd(18)} ${rate(god6, s).padEnd(11)} ${rate(m6, s)}`)
}
