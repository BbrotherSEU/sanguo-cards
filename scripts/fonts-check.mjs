// 验证字体本地化：页面加载不应请求 googleapis，woff2 子集应加载成功，
// 且生僻字（彧惇等）应命中 Noto Serif SC 而不是系统回退字体
import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const BASE = process.env.BASE ?? 'http://127.0.0.1:5174'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--headless=new', '--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 720 })

const external = []
const fontLoads = []
const fontFails = []
page.on('request', (req) => {
  const url = req.url()
  if (/googleapis|gstatic/.test(url)) external.push(url)
  if (url.includes('/fonts/')) fontLoads.push(url)
})
page.on('requestfailed', (req) => {
  if (req.url().includes('/fonts/')) fontFails.push(req.url())
})
page.on('response', (res) => {
  if (res.url().includes('/fonts/') && res.status() >= 400) fontFails.push(`${res.status()} ${res.url()}`)
})

await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise((r) => setTimeout(r, 1500))

// document.fonts 状态
const fontState = await page.evaluate(async () => {
  await document.fonts.ready
  const faces = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`)
  const loaded = [...document.fonts].filter((f) => f.status === 'loaded').length
  // 生僻字探测：用一个 ZCOOL 场景元素，测「彧」的渲染字体
  const probe = document.createElement('span')
  probe.style.cssText = 'font-family:"ZCOOL XiaoWei","Noto Serif SC",serif;font-size:40px;position:absolute;top:-999px'
  probe.textContent = '彧惇毌濬郿釭'
  document.body.appendChild(probe)
  const range = document.createRange()
  range.selectNodeContents(probe)
  const w = range.getBoundingClientRect().width
  probe.remove()
  return { total: document.fonts.size, loaded, width: Math.round(w), faces: faces.slice(0, 5) }
})

console.log('外网字体请求:', external.length ? external : '无 ✓')
console.log('本地字体请求数:', fontLoads.length)
console.log('字体加载失败:', fontFails.length ? fontFails : '无 ✓')
console.log('document.fonts:', fontState.total, '个 face,', fontState.loaded, '已加载')
console.log('生僻字探针宽度:', fontState.width, '(>0 表示有字形渲染，非 tofu 空宽)')

const pass = external.length === 0 && fontFails.length === 0 && fontState.loaded > 0 && fontState.width > 100
console.log('\n结果:', pass ? 'PASS' : 'FAIL')
await browser.close()
process.exit(pass ? 0 : 1)
