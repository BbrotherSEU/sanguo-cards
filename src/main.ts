import './style.css'
import './ui/theme.css'
import { mount } from './ui/render'
import { initOrientation } from './game/orientation'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')
mount(app)

// 游戏为横屏专属：竖屏时用提示遮罩挡住，并尝试锁定方向
initOrientation()
