// always add version to your cache
const CACHE_VERSION = "v2";
const PRECACHE_ASSETS = ["/", "/style.css", "/index.html", "/app.js"];

self.oninstall = event => {
  console.log("Install event, start precaching...");
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
};

self.onactivate = event => {
  console.log("activate event, clean up all of our caches...");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_VERSION)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
};
