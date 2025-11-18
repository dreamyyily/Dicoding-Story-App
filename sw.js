const CACHE_NAME = 'share-story-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/Dicoding-Story-App/index.html',
  '/Dicoding-Story-App/style.css',
  '/Dicoding-Story-App/src/scripts/index.js',
  '/Dicoding-Story-App/src/scripts/idb.js',
  '/Dicoding-Story-App/icons/icon-192.png',
  '/Dicoding-Story-App/icons/icon-512.png',
  '/Dicoding-Story-App/src/offline.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  if (url.includes('/stories')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return fetch(e.request)
          .then(res => { cache.put(e.request, res.clone()); return res; })
          .catch(() => caches.match(e.request));
      })
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request)
      .catch(() => caches.match('/Dicoding-Story-App/src/offline.html')))
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/Dicoding-Story-App/icons/icon-192.png',
    badge: '/Dicoding-Story-App/icons/icon-192.png'
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/Dicoding-Story-App/'));
});
