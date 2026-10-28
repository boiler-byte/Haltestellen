/* Haltestellen v6 – offline app shell. No live traffic data are cached. */
const CACHE_VERSION = 'haltestellen-v6-shell-1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names
        .filter((name) => name.startsWith('haltestellen-v') && name !== CACHE_VERSION)
        .map((name) => caches.delete(name))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Cross-origin Transitous/MOTIS traffic is always fetched live;
  // never persist an old departure or arrival as if it were current.
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Prefer current online HTML and keep a copy for the next offline launch.
    event.respondWith(
      fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)));
        }
        return response;
      }).catch(async () => {
        const cache = await caches.open(CACHE_VERSION);
        return await cache.match(request) || await cache.match('./index.html') ||
          new Response('Die App ist offline noch nicht zwischengespeichert.',
            { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      })
    );
    return;
  }

  // Versioned static assets are served from the locally installed shell.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
