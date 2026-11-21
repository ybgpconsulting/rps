const CACHE_PREFIX = 'rps-static-'
const CACHE_NAME = `${CACHE_PREFIX}v1`
const OFFLINE_URL = '/offline.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/media/')) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const offline = await caches.match(OFFLINE_URL)
        return offline ?? new Response('Offline. Reconnect and try again.', { status: 503 })
      }),
    )
    return
  }

  if (!url.pathname.startsWith('/assets/')) return
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request)
      if (cached) return cached

      const response = await fetch(request)
      if (
        response.ok &&
        response.type === 'basic' &&
        !response.headers.get('Cache-Control')?.includes('no-store')
      ) {
        await cache.put(request, response.clone())
      }
      return response
    }),
  )
})
