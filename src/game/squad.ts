/** 1–6 人在 3×2 阵上的站位。前排 0–2，后排 3–5。 */
export function squadSlots(count: number): number[] {
  const table: number[][] = [
    [],
    [1],
    [0, 2],
    [0, 1, 2],
    [0, 1, 2, 4],
    [0, 1, 2, 3, 5],
    [0, 1, 2, 3, 4, 5],
  ]
  const n = Math.max(0, Math.min(6, count))
  return table[n] ?? table[6]
}

/** 人越少，单兵等级越高，避免一两个 NPC 被人数碾过。 */
export function squadLevel(base: number, count: number): number {
  const scale = [1, 1.42, 1.24, 1.1, 1, 0.94, 0.86][Math.max(1, Math.min(6, count))] ?? 1
  return Math.max(1, Math.round(base * scale))
}

export function enemyBreakthrough(level: number): number {
  return Math.min(4, Math.floor((level - 1) / 8))
}
