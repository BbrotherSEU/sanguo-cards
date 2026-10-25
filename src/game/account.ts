import type { SaveData } from '../data/types'

const TOKEN_KEY = 'sanguo-token'
const USERS_KEY = 'sanguo-local-users'

type Ev = 'in' | 'out' | 'kicked'
type Listener = (ev: Ev, save: SaveData | null) => void

let authed = false
let kicked = false
let pending = typeof localStorage !== 'undefined' && !!localStorage.getItem(TOKEN_KEY)
let error = ''
let name = ''
let offline = false // 后端不可达时自动降级为本地账号模式（PWA 离线可玩）
const listeners = new Set<Listener>()
let queued = ''
let sending = false
let timer = 0
let poll = 0

type LocalUser = { pass: string; save: SaveData | null }

function readUsers(): Record<string, LocalUser> {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}') as unknown
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, LocalUser>) : {}
  } catch {
    return {}
  }
}

function writeUsers(users: Record<string, LocalUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

async function hashPass(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function isLocalToken(t: string) {
  return t.startsWith('local:')
}

function localUserOf(t: string): { who: string; users: Record<string, LocalUser> } | null {
  const who = t.slice(6)
  const users = readUsers()
  return users[who] ? { who, users } : null
}

export function accountState() {
  return { authed, kicked, pending, error, name, offline }
}

export function onAccount(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function notify(ev: Ev, save: SaveData | null = null) {
  for (const fn of listeners) fn(ev, save)
}

function token() {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

function kick(message: string) {
  authed = false
  kicked = true
  pending = false
  error = message
  name = ''
  queued = ''
  localStorage.removeItem(TOKEN_KEY)
  notify('kicked')
}

async function readJson(res: Response) {
  try {
    return (await res.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

export async function bootAccount(): Promise<void> {
  if (!poll) poll = window.setInterval(() => void pulse(), 4000)
  const current = token()
  if (!current) {
    authed = false
    pending = false
    notify('out')
    return
  }
  // 本地账号模式：不走网络，直接从 localStorage 恢复
  if (isLocalToken(current)) {
    const found = localUserOf(current)
    if (found) {
      offline = true
      authed = true
      kicked = false
      pending = false
      name = found.who
      error = ''
      notify('in', found.users[found.who].save ?? null)
      return
    }
    localStorage.removeItem(TOKEN_KEY)
    authed = false
    pending = false
    notify('out')
    return
  }
  try {
    const res = await fetch('/api/session', { headers: { authorization: `Bearer ${current}` } })
    const body = await readJson(res)
    if (res.status === 409) {
      kick(String(body.error ?? '这个账号已在其他地方登录'))
      return
    }
    if (!res.ok) {
      localStorage.removeItem(TOKEN_KEY)
      authed = false
      pending = false
      notify('out')
      return
    }
    authed = true
    kicked = false
    pending = false
    name = String(body.name ?? '')
    error = ''
    notify('in', (body.save as SaveData | null) ?? null)
  } catch {
    pending = false
    authed = false
    error = '登录服务没连上，请从本机游戏地址打开'
    notify('out')
  }
}

async function pulse() {
  if (!authed || offline) return
  const current = token()
  if (!current) {
    authed = false
    name = ''
    notify('out')
    return
  }
  try {
    const res = await fetch('/api/session', { headers: { authorization: `Bearer ${current}` } })
    if (res.status === 409) {
      const body = await readJson(res)
      kick(String(body.error ?? '这个账号已在其他地方登录'))
    }
  } catch {
    /* 轮询失败时先留在本地，下次再试 */
  }
}

async function submit(path: string, user: string, password: string) {
  error = ''
  try {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: user, password }),
    })
    const body = await readJson(res)
    if (!res.ok) {
      error = String(body.error ?? '登录失败')
      notify('out')
      return
    }
    localStorage.setItem(TOKEN_KEY, String(body.token ?? ''))
    authed = true
    kicked = false
    pending = false
    name = String(body.name ?? user.trim().toLowerCase())
    error = ''
    notify('in', (body.save as SaveData | null) ?? null)
  } catch {
    // 后端不可达（如 PWA 静态部署/离线）：降级为本地账号，存档存本机
    offline = true
    const who = user.trim().toLowerCase()
    if (!/^[\u4e00-\u9fffa-z0-9_]{2,12}$/.test(who) || password.trim().length < 4) {
      error = '账号 2-12 位，密码至少 4 位'
      notify('out')
      return
    }
    const pass = await hashPass(password.trim())
    const users = readUsers()
    if (path.endsWith('/register')) {
      if (users[who]) {
        error = '账号已存在'
        notify('out')
        return
      }
      users[who] = { pass, save: null }
      writeUsers(users)
    } else if (!users[who] || users[who].pass !== pass) {
      error = '账号或密码不对'
      notify('out')
      return
    }
    localStorage.setItem(TOKEN_KEY, `local:${who}`)
    authed = true
    kicked = false
    pending = false
    name = who
    error = ''
    notify('in', users[who].save ?? null)
  }
}

export function login(user: string, password: string) {
  return submit('/api/login', user, password)
}

export function register(user: string, password: string) {
  return submit('/api/register', user, password)
}

export async function logout() {
  const current = token()
  authed = false
  kicked = false
  name = ''
  error = ''
  queued = ''
  localStorage.removeItem(TOKEN_KEY)
  if (current && !isLocalToken(current)) {
    await fetch('/api/logout', { method: 'POST', headers: { authorization: `Bearer ${current}` } }).catch(() => undefined)
  }
  notify('out')
}

export function pushSave(data: SaveData) {
  if (!authed) return
  const json = JSON.stringify(data)
  if (json === queued) return
  queued = json
  window.clearTimeout(timer)
  timer = window.setTimeout(() => void flush(), 400)
}

async function flush() {
  if (sending || !authed) return
  const current = token()
  const json = queued
  if (!current || !json) return
  sending = true
  try {
    // 本地账号模式：存档直接写入 localStorage
    if (isLocalToken(current)) {
      const found = localUserOf(current)
      if (found) {
        found.users[found.who].save = JSON.parse(json) as SaveData
        writeUsers(found.users)
      }
      queued = ''
      return
    }
    const res = await fetch('/api/save', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${current}` },
      body: json,
    })
    if (res.status === 409) {
      const body = await readJson(res)
      kick(String(body.error ?? '这个账号已在其他地方登录'))
      return
    }
    if (!res.ok) queued = ''
  } catch {
    queued = ''
  } finally {
    sending = false
    if (authed && queued && queued !== json) void flush()
  }
}
