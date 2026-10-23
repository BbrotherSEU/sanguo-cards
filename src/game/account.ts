import type { SaveData } from '../data/types'

const TOKEN_KEY = 'sanguo-token'

type Ev = 'in' | 'out' | 'kicked'
type Listener = (ev: Ev, save: SaveData | null) => void

let authed = false
let kicked = false
let pending = typeof localStorage !== 'undefined' && !!localStorage.getItem(TOKEN_KEY)
let error = ''
let name = ''
const listeners = new Set<Listener>()
let queued = ''
let sending = false
let timer = 0
let poll = 0

export function accountState() {
  return { authed, kicked, pending, error, name }
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
  if (!authed) return
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
    error = '登录服务没连上'
    notify('out')
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
  if (current) {
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
