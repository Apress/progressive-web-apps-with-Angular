self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());

  self.registration.unregister().then(async () => {
    console.log('NGSW Safety Worker - unregistered old service worker');

    // Get all cache keys
    const cacheNames = await caches.keys();
    // If you want to delete Only Angular Caches
    const AngularCaches = cacheNames.filter(key => key.startsWith('ngsw:'));
    // Delete all caches
    await Promise.all(AngularCaches.map(cacheName => caches.delete(cacheName)));

    // Grab a list of all tabs
    const clients = await self.clients.matchAll({ type: 'window' });
    // Reload pages
    for (const client of clients) {
      client.navigate(client.url);
    }
  });
});
