// 少年三国志 Service Worker：预缓存应用壳，运行时缓存静态资源，离线可玩
const VERSION = 'v1'
const SHELL = `shell-${VERSION}`
const RUNTIME = `runtime-${VERSION}`

const FONT_SLUGS = []
for (const w of [400, 500, 600, 700, 800]) {
  for (const b of [0, 700, 1400]) FONT_SLUGS.push(`/fonts/noto-serif-sc-${w}-${b}.woff2`)
}
for (const b of [0, 700, 1400]) FONT_SLUGS.push(`/fonts/zcool-xiaowei-400-${b}.woff2`)

const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
  ...FONT_SLUGS,
]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== location.origin) return
  if (url.pathname.startsWith('/api/')) return // 账号接口永不走缓存

  // 页面导航：网络优先，离线回退到应用壳
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('/index.html')))
    return
  }

  // 静态资源：缓存优先，未命中回源并写入运行时缓存
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone()
          caches.open(RUNTIME).then((c) => c.put(req, copy))
        }
        return res
      })
    })
  )
})
