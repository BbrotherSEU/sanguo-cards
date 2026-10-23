import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { dirname, join } from 'node:path'
import type { Connect, Plugin } from 'vite'

type User = { salt: string; hash: string; session: string; save: unknown }
type Db = { users: Record<string, User> }

function send(res: ServerResponse, code: number, body: unknown) {
  res.statusCode = code
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > 2_000_000) {
        reject(new Error('too big'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8')
      if (!text) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(text))
      } catch {
        reject(new Error('bad json'))
      }
    })
    req.on('error', reject)
  })
}

function loadDb(file: string): Db {
  if (!existsSync(file)) return { users: {} }
  const parsed = JSON.parse(readFileSync(file, 'utf8')) as Db
  if (!parsed.users || typeof parsed.users !== 'object') return { users: {} }
  return parsed
}

function saveDb(file: string, db: Db) {
  mkdirSync(dirname(file), { recursive: true })
  const tmp = `${file}.tmp`
  writeFileSync(tmp, JSON.stringify(db))
  renameSync(tmp, file)
}

function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, 32).toString('hex')
}

function sameHash(password: string, salt: string, hash: string) {
  const got = Buffer.from(hashPassword(password, salt), 'hex')
  const exp = Buffer.from(hash, 'hex')
  return got.length === exp.length && timingSafeEqual(got, exp)
}

function bearer(req: IncomingMessage) {
  const header = req.headers.authorization ?? ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

function byToken(db: Db, token: string) {
  if (!token) return null
  const a = Buffer.from(token)
  for (const [name, user] of Object.entries(db.users)) {
    if (!user.session || user.session.length !== token.length) continue
    const b = Buffer.from(user.session)
    if (a.length === b.length && timingSafeEqual(a, b)) return { name, user }
  }
  return null
}

function normName(raw: unknown) {
  if (typeof raw !== 'string') return ''
  const name = raw.trim().toLowerCase()
  if (!/^[\u4e00-\u9fffa-z0-9_]{2,12}$/.test(name)) return ''
  return name
}

function normPassword(raw: unknown) {
  if (typeof raw !== 'string') return ''
  const password = raw.trim()
  if (password.length < 4 || password.length > 32) return ''
  return password
}

function accountPlugin(): Plugin {
  return {
    name: 'sanguo-accounts',
    configureServer(server) {
      mount(server.middlewares, join(server.config.root, 'data', 'accounts.json'))
    },
    configurePreviewServer(server) {
      mount(server.middlewares, join(server.config.root, 'data', 'accounts.json'))
    },
  }
}

function mount(middlewares: Connect.Server, file: string) {
  middlewares.use((req, res, next) => {
    const path = (req.url ?? '').split('?')[0]
    if (!path.startsWith('/api/')) {
      next()
      return
    }
    void handle(req, res, path, file).catch((err) => {
      console.error(err)
      if (!res.headersSent) send(res, 500, { error: '服务器出错' })
    })
  })
}

async function handle(req: IncomingMessage, res: ServerResponse, path: string, file: string) {
  if (path === '/api/register' && req.method === 'POST') {
    const body = (await readBody(req)) as { name?: unknown; password?: unknown }
    const name = normName(body.name)
    const password = normPassword(body.password)
    if (!name || !password) {
      send(res, 400, { error: '账号 2-12 位，密码至少 4 位' })
      return
    }
    const db = loadDb(file)
    if (db.users[name]) {
      send(res, 409, { error: '账号已存在' })
      return
    }
    const salt = randomBytes(16).toString('hex')
    const session = randomBytes(24).toString('hex')
    db.users[name] = { salt, hash: hashPassword(password, salt), session, save: null }
    saveDb(file, db)
    send(res, 200, { token: session, name, save: null })
    return
  }

  if (path === '/api/login' && req.method === 'POST') {
    const body = (await readBody(req)) as { name?: unknown; password?: unknown }
    const name = normName(body.name)
    const password = normPassword(body.password)
    const db = loadDb(file)
    const user = name ? db.users[name] : undefined
    if (!name || !password || !user || !sameHash(password, user.salt, user.hash)) {
      send(res, 401, { error: '账号或密码不对' })
      return
    }
    user.session = randomBytes(24).toString('hex')
    saveDb(file, db)
    send(res, 200, { token: user.session, name, save: user.save ?? null })
    return
  }

  if (path === '/api/logout' && req.method === 'POST') {
    const db = loadDb(file)
    const found = byToken(db, bearer(req))
    if (found) {
      found.user.session = ''
      saveDb(file, db)
    }
    send(res, 200, { ok: true })
    return
  }

  if (path === '/api/session' && req.method === 'GET') {
    const db = loadDb(file)
    const found = byToken(db, bearer(req))
    if (!found) {
      send(res, 409, { error: '这个账号已在其他地方登录' })
      return
    }
    send(res, 200, { name: found.name, save: found.user.save ?? null })
    return
  }

  if (path === '/api/save' && req.method === 'PUT') {
    const db = loadDb(file)
    const found = byToken(db, bearer(req))
    if (!found) {
      send(res, 409, { error: '这个账号已在其他地方登录' })
      return
    }
    const body = await readBody(req)
    if (!body || typeof body !== 'object' || !Array.isArray((body as { owned?: unknown }).owned)) {
      send(res, 400, { error: '存档无效' })
      return
    }
    found.user.save = body
    saveDb(file, db)
    send(res, 200, { ok: true })
    return
  }

  send(res, 404, { error: '没有这个接口' })
}

export { accountPlugin }
