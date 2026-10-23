import './style.css'
import './ui/theme.css'
import { mount } from './ui/render'

const app = document.querySelector<HTMLDivElement>('#app')
if (!app) throw new Error('#app missing')
mount(app)
