/**
 * 美术走查：逐屏抓取 DOM + 布局探针，输出 JSON 报告。
 * 用法：node scripts/shot.mjs [输出目录]
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, statSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE = 'http://127.0.0.1:5174'
const OUT = resolve(process.argv[2] ?? '.shots')
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const USER = 'shotbot'
const PASS = 'shotbot123'

mkdirSync(OUT, { recursive: true })

async function auth() {
  const call = async (path) => {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: USER, password: PASS }),
    })
    return { status: res.status, body: await res.json().catch(() => ({})) }
  }
  let r = await call('/api/login')
  if (r.status !== 200) r = await call('/api/register')
  if (!r.body.token) throw new Error('登录失败: ' + JSON.stringify(r.body))
  return r.body.token
}

const token = await auth()

const screens = process.argv[3]
  ? [[process.argv[3], process.argv[3]]]
  : [
      ['01-home', 'home'],
      ['02-roster', 'roster'],
      ['03-team', 'team'],
      ['04-gacha', 'gacha'],
      ['05-shop', 'shop'],
      ['06-equip', 'equip'],
      ['07-arena', 'arena'],
      ['08-campaign', 'campaign'],
    ]

const report = {}

for (const [name, screen] of screens) {
  const url = `${BASE}/__shot.html?token=${token}&screen=${screen}`
  const file = `${OUT}/${name}.png`
  const profile = `${OUT}\\p-${name}`
  rmSync(profile, { recursive: true, force: true })

  // 单次启动同时产出截图与 DOM，避免多次冷启动超时
  const res = spawnSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--window-size=1280,800',
      `--screenshot=${file.replace(/\//g, '\\')}`,
      '--dump-dom',
      '--virtual-time-budget=7000',
      `--user-data-dir=${profile}`,
      url,
    ],
    { encoding: 'utf8', timeout: 30000, maxBuffer: 32 * 1024 * 1024 },
  )

  const dom = res.stdout ?? ''
  const m = dom.match(/<pre id="probe">([\s\S]*?)<\/pre>/)
  const e = dom.match(/<pre id="err">([\s\S]*?)<\/pre>/)
  let parsed = {}
  try {
    const txt = (m?.[1] ?? '{}')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
    parsed = JSON.parse(txt)
  } catch {
    parsed = { parseError: (m?.[1] ?? 'no-probe').slice(0, 400) }
  }
  if (e) parsed.pageError = e[1].slice(0, 400)

  report[name] = parsed
  let size = 0
  try {
    size = statSync(file).size
  } catch {
    /* no file */
  }
  const flags = []
  if (parsed.mainOverflowY > 0) flags.push(`overflowY=${parsed.mainOverflowY}`)
  if (parsed.mainOverflowX > 0) flags.push(`overflowX=${parsed.mainOverflowX}`)
  if (parsed.outside?.length) flags.push('outside: ' + parsed.outside.join(','))
  if (parsed.pageError) flags.push('ERR:' + parsed.pageError)
  console.log(
    name.padEnd(12),
    'nodes=' + String(parsed.nodes ?? '?').padEnd(5),
    'png=' + String(size).padEnd(8),
    flags.join(' | '),
  )
}

writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2))
console.log('report ->', `${OUT}/report.json`)
