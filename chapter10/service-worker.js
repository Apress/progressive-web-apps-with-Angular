const TESTCACHE = 'TESTCACHE';
const TESTCACHE_URLS = [
  'index.html',
  'main.js',
  './' // Alias for index.html
];

self.addEventListener('install', event => {
  console.log('[SW.JS] Server worker has been installed');
  event.waitUntil(
    caches
      .open(TESTCACHE)
      .then(cache => cache.addAll(TESTCACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  console.log('[SW.JS] Server worker has been activated');
  const currentCaches = [TESTCACHE];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        cacheNames.filter(cacheName => !currentCaches.includes(cacheName))
      )
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete))
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('push', event => {
  console.log(
    '[SWJ.S] Debug Push',
    event.data ? event.data.text() : 'no payload'
  );
});

self.addEventListener('sync', event => {
  console.log('[SWJ.S] Debug Sync', event.tag);
});

// self.addEventListener('fetch', event => {
//   const request = event.request;
//   event.respondWith(
//     caches.match(request).then(res => {
//       // Fallback
//       return (
//         res ||
//         fetch(request).then(newRes => {
//           // Cache fetched response
//           caches
//             .open(DYNAMIC_CACHE_VERSION)
//             .then(cache => cache.put(request, newRes));
//           return newRes.clone();
//         })
//       );
//     })
//   );
// });
