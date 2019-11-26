// current workbox version
const MODULE_PATH_PREFIX = 'workbox-v3.6.3';
// to copy workbox files run npm run copyWorkboxModules or 'npx workbox copyLibraries dist'
// this synchronously load workbox
importScripts(`${MODULE_PATH_PREFIX}/workbox-sw.js`);

if (!workbox) {
  // if workbox for any resson didn't happen simply ignore the rest of file
  console.error(`Something went wrong while loading ${modulePathPrefix}/workbox-sw.js`);
} else {
  // set module path prefix
  workbox.setConfig({ modulePathPrefix: MODULE_PATH_PREFIX });

  // Modify SW update cycle
  workbox.skipWaiting();
  workbox.clientsClaim();

  /* PRE-CACHE STERATEGY */

  // this is a placeholder. app-shell will be injected here automatically
  workbox.precaching.precacheAndRoute([]);

  // BROADCAST UPDATE

  // Registering a broadcast update plugin for prechache asset
  workbox.precaching.addPlugins([new workbox.broadcastUpdate.Plugin('app-shell-update')]);

  /* RUNTIME CACHE STERATEGY */

  // we need to store our images in cache on run-time
  workbox.routing.registerRoute(
    new RegExp('/(.*)assets(.*).(?:png|gif|jpg)/'),
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
        })
      ]
    })
  );

  // first think first, we need to handle Google fonts
  workbox.routing.registerRoute(
    new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-apis-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 10,
          maxAgeSeconds: 10 * 24 * 60 * 60 // 10 Days
        })
        // new workbox.broadcastUpdate.Plugin('apis-updates', {
        //By default, the Content-Length, ETag, and Last-Modified headers are compared.
        //   headersToCheck: ['X-Custom-Header']
        // })
      ]
    })
  );

  // API with network-first strategy
  workbox.routing.registerRoute(
    new RegExp('https://firestore.googleapis.com/v1beta1/(.*)'),
    workbox.strategies.networkFirst({
      cacheName: 'api-network-first',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 100
        })
      ]
    })
  );

  // API with cache-first strategy
  workbox.routing.registerRoute(
    new RegExp('https://icanhazdadjoke.com/(.*)'),
    workbox.strategies.cacheFirst({
      cacheName: 'api-cache-first',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 15 * 60 * 60 // 15 min
        })
      ]
    })
  );

  // Register navigation
  workbox.routing.registerNavigationRoute('/index.html', {
    whitelist: [new RegExp('^\\/.*$')],
    blacklist: [
      new RegExp('/restricted/(.*)'),
      new RegExp('^\\/(?:.+\\/)?[^/]*\\.[^/]*$'),
      new RegExp('^\\/(?:.+\\/)?[^/]*__[^/]*$'),
      new RegExp('^\\/(?:.+\\/)?[^/]*__[^/]*\\/.*$')
    ]
  });

  // end of 'if' for checking workbox
}
