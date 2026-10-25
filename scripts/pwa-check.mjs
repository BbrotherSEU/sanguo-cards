// PWA 实测：SW 注册、manifest、离线打开、离线注册/登录/存档/会话恢复
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE ?? 'http://127.0.0.1:4174'

let pass = 0
let fail = 0
function check(ok, label, extra = '') {
  if (ok) {
    pass++
    console.log('  PASS ', label, extra)
  } else {
    fail++
    console.log('  FAIL ', label, extra)
  }
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--headless=new', '--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 720 })

// 1. 打开页面，等待 SW 激活
await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 })
const swState = await page.evaluate(async () => {
  if (!('serviceWorker' in navigator)) return { supported: false }
  const reg = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000)),
  ])
  const keys = await caches.keys()
  return { active: !!reg.active, keys }
})
check(swState.active === true, 'Service Worker 已激活')
check(swState.keys?.some((k) => k.startsWith('shell-')), 'shell 预缓存已建立', (swState.keys ?? []).join(','))

// 2. manifest
const manifest = await page.evaluate(async () => {
  const link = document.querySelector('link[rel="manifest"]')
  if (!link) return null
  const res = await fetch(link.href)
  return res.ok ? await res.json() : null
})
check(manifest?.orientation === 'landscape', 'manifest 锁定横屏')
check(manifest?.display === 'standalone', 'manifest standalone 模式')
check((manifest?.icons?.length ?? 0) >= 3, 'manifest 图标齐全')

// 3. 登录界面正常渲染（在线）
await page.waitForSelector('.login-card, .auth, input', { timeout: 8000 }).catch(() => null)
const hasLoginUI = await page.evaluate(() => !!document.querySelector('input'))
check(hasLoginUI, '登录界面渲染')

// 4. 断网 → 刷新 → SW 应提供应用壳
await page.setOfflineMode(true)
await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch((e) => console.log('reload err', e.message))
await new Promise((r) => setTimeout(r, 1200))
const offlineUI = await page.evaluate(() => ({
  hasInput: !!document.querySelector('input'),
  bodyText: document.body.innerText.slice(0, 60),
}))
check(offlineUI.hasInput, '断网后页面仍可打开（SW 应用壳）')

// 5. 断网注册本地账号：直接操作 UI 填写注册表单
const acc = 'pwa测试' + Date.now().toString(36).slice(-4)
const typed = await page.evaluate(async (acc) => {
  const inputs = [...document.querySelectorAll('input')]
  if (inputs.length < 2) return 'no-inputs:' + inputs.length
  const setVal = (el, v) => {
    el.value = v
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
  }
  setVal(inputs[0], acc)
  setVal(inputs[1], 'test1234')
  // 找注册按钮
  const btns = [...document.querySelectorAll('button')]
  const reg = btns.find((b) => /注册/.test(b.textContent))
  if (!reg) return 'no-reg-btn'
  reg.click()
  await new Promise((r) => setTimeout(r, 1500))
  return document.querySelector('input') ? 'still-login' : 'entered'
}, acc)
check(typed === 'entered', '断网注册成功并进入游戏', typed)

// 6. 本地存档写入
const saved = await page.evaluate(() => {
  const users = JSON.parse(localStorage.getItem('sanguo-local-users') ?? '{}')
  const names = Object.keys(users)
  return { names, hasSave: names.length > 0 && users[names[0]].save !== null }
})
check(saved.names.length === 1, '本地账号已写入 localStorage', saved.names.join(','))

// 7. 刷新（仍断网）→ 会话应恢复
await page.reload({ waitUntil: 'domcontentloaded' })
await new Promise((r) => setTimeout(r, 1500))
const restored = await page.evaluate(() => !document.querySelector('input'))
check(restored, '断网刷新后会话自动恢复')

console.log(`\n通过 ${pass} 项，失败 ${fail} 项`)
await browser.close()
process.exit(fail ? 1 : 0)
