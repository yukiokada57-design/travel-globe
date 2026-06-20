// Service Worker — caches everything so the app works fully offline,
// including in airplane mode after the first visit.
const CACHE = 'travel-globe-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/three.min.js',
  './assets/globe.gl.min.js',
  './assets/countries.geojson',
  './assets/earth-dark.jpg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first: serve from cache, fall back to network.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request))
  );
});
