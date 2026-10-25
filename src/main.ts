import './ui/fonts.css'
import './style.css'
import './ui/theme.css'
import { mount } from './ui/render'
import { initOrientation } from './game/orientation'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')
mount(app)

// 游戏为横屏专属：竖屏时用提示遮罩挡住，并尝试锁定方向
initOrientation()

// PWA：注册 Service Worker（仅生产构建，开发模式不缓存避免干扰热更新）
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
