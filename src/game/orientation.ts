/**
 * 横屏锁定：
 * 1. 竖屏时显示全屏旋转提示，挡住不可用的竖屏布局
 * 2. 尝试用 Screen Orientation API 锁定横屏（Android / 已安装到主屏的 PWA 支持）
 * 3. 方向变化时通知外部重绘
 */

const gate = () => document.querySelector<HTMLElement>('#rotate-gate')

/** 竖屏提示只在触屏设备上出现：桌面浏览器用 16:9 letterbox 即可正常玩 */
function needsRotate(): boolean {
  if (window.innerHeight <= window.innerWidth) return false
  return window.matchMedia('(pointer: coarse)').matches
}

function syncGate(): void {
  const el = gate()
  if (!el) return
  el.hidden = !needsRotate()
}

/** 尝试锁定横屏；失败（iOS Safari 不支持）时静默忽略，靠提示遮罩兜底 */
export async function lockLandscape(): Promise<void> {
  const so = screen.orientation as ScreenOrientation & {
    lock?: (o: string) => Promise<void>
  }
  if (!so?.lock) return
  try {
    await so.lock('landscape')
  } catch {
    // 浏览器未授权（如非全屏、非用户手势触发）→ 忽略
  }
}

export function initOrientation(onChange?: () => void): void {
  syncGate()
  window.addEventListener('resize', () => {
    syncGate()
    onChange?.()
  })
  window.addEventListener('orientationchange', () => {
    syncGate()
    onChange?.()
  })
  // 首次交互时再试一次锁定：多数浏览器要求用户手势
  const tryLock = () => {
    void lockLandscape()
    window.removeEventListener('pointerdown', tryLock)
    window.removeEventListener('keydown', tryLock)
  }
  window.addEventListener('pointerdown', tryLock, { once: true })
  window.addEventListener('keydown', tryLock, { once: true })
}
